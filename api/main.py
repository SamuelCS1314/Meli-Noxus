import os
from datetime import date, time

import httpx
from dotenv import load_dotenv
from fastapi import APIRouter, Depends, FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from pydantic import BaseModel

load_dotenv()

SUPABASE_URL = os.environ["SUPABASE_URL"]
SUPABASE_KEY = os.environ["SUPABASE_PUBLISHABLE_KEY"]  # chave PÚBLICA, nunca a service_role
FRONT_URL = os.getenv("FRONT_URL", "http://localhost:5173")

app = FastAPI(title="API meli-noxus")
app.add_middleware(
    CORSMiddleware,
    allow_origins=[FRONT_URL],
    allow_methods=["*"],
    allow_headers=["*"],
)

router = APIRouter(prefix="/api")
bearer = HTTPBearer(auto_error=False)


# ---------- Ajudantes ----------

def pegar_token(cred: HTTPAuthorizationCredentials = Depends(bearer)) -> str:
    """Exige o token de login do usuário em toda rota protegida."""
    if cred is None:
        raise HTTPException(401, "Faça login primeiro")
    return cred.credentials


async def banco(metodo: str, tabela: str, token: str, params=None, corpo=None):
    """Fala com o banco COMO o usuário logado, então as regras (RLS) valem."""
    headers = {"apikey": SUPABASE_KEY, "Authorization": f"Bearer {token}"}
    if metodo in ("POST", "PATCH", "DELETE"):
        headers["Prefer"] = "return=representation"

    async with httpx.AsyncClient(timeout=15) as client:
        r = await client.request(
            metodo,
            f"{SUPABASE_URL}/rest/v1/{tabela}",
            headers=headers,
            params=params,
            json=corpo,
        )

    if r.status_code >= 400:
        detalhe = r.json() if r.content else {}
        if r.status_code in (401, 403):
            raise HTTPException(r.status_code, "Sem permissão para esta ação")
        raise HTTPException(r.status_code, detalhe.get("message", "Erro no banco"))
    return r.json() if r.content else None


# ---------- Modelos (o que a API aceita receber) ----------

class Login(BaseModel):
    email: str
    senha: str


class EventoNovo(BaseModel):
    nome: str
    data_evento: date
    id_status: int
    id_local: int | None = None
    quantidade_vagas: int = 0
    descricao: str | None = None
    horario_inicio: time | None = None
    horario_fim: time | None = None


class EventoAtualiza(BaseModel):
    nome: str | None = None
    data_evento: date | None = None
    id_status: int | None = None
    id_local: int | None = None
    quantidade_vagas: int | None = None
    descricao: str | None = None
    horario_inicio: time | None = None
    horario_fim: time | None = None


class CandidatoNovo(BaseModel):
    nome: str
    cpf: str | None = None
    telefone: str | None = None
    email: str | None = None
    data_nascimento: date | None = None
    endereco: str | None = None
    cidade: str | None = None
    estado: str | None = None


class InscricaoNova(BaseModel):
    id_evento: int
    id_candidato: int


class InscricaoStatus(BaseModel):
    status_participacao: str  # inscrito, confirmado, compareceu, faltou, cancelado


# ---------- Login ----------

@router.post("/login")
async def login(dados: Login):
    async with httpx.AsyncClient(timeout=15) as client:
        r = await client.post(
            f"{SUPABASE_URL}/auth/v1/token",
            params={"grant_type": "password"},
            headers={"apikey": SUPABASE_KEY},
            json={"email": dados.email, "password": dados.senha},
        )
    if r.status_code != 200:
        raise HTTPException(401, "E-mail ou senha inválidos")
    d = r.json()
    return {
        "access_token": d["access_token"],
        "refresh_token": d["refresh_token"],
        "expires_in": d["expires_in"],
    }


# ---------- Eventos ----------

@router.get("/eventos")
async def listar_eventos(token: str = Depends(pegar_token)):
    return await banco("GET", "eventos", token, params={
        "select": "*,locais(nome,cidade,estado),status_eventos(nome)",
        "order": "data_evento",
    })


@router.get("/eventos/{id_evento}")
async def buscar_evento(id_evento: int, token: str = Depends(pegar_token)):
    dados = await banco("GET", "eventos", token, params={
        "select": "*,locais(*),status_eventos(nome),eventos_rotas(rotas_fretado(*,pontos_embarque(*)))",
        "id_evento": f"eq.{id_evento}",
    })
    if not dados:
        raise HTTPException(404, "Evento não encontrado")
    return dados[0]


@router.post("/eventos", status_code=201)
async def criar_evento(evento: EventoNovo, token: str = Depends(pegar_token)):
    dados = await banco("POST", "eventos", token,
                        corpo=evento.model_dump(mode="json", exclude_none=True))
    return dados[0]


@router.patch("/eventos/{id_evento}")
async def atualizar_evento(id_evento: int, evento: EventoAtualiza,
                           token: str = Depends(pegar_token)):
    campos = evento.model_dump(mode="json", exclude_none=True)
    if not campos:
        raise HTTPException(400, "Nada para atualizar")
    dados = await banco("PATCH", "eventos", token,
                        params={"id_evento": f"eq.{id_evento}"}, corpo=campos)
    if not dados:
        raise HTTPException(404, "Evento não encontrado ou sem permissão")
    return dados[0]


@router.delete("/eventos/{id_evento}", status_code=204)
async def remover_evento(id_evento: int, token: str = Depends(pegar_token)):
    dados = await banco("DELETE", "eventos", token,
                        params={"id_evento": f"eq.{id_evento}"})
    if not dados:
        raise HTTPException(404, "Evento não encontrado ou sem permissão")


# ---------- Candidatos ----------

@router.get("/candidatos")
async def listar_candidatos(status: str | None = None,
                            token: str = Depends(pegar_token)):
    params = {"select": "*", "order": "criado_em.desc"}
    if status:
        params["status_candidato"] = f"eq.{status}"
    return await banco("GET", "candidatos", token, params=params)


@router.post("/candidatos", status_code=201)
async def criar_candidato(candidato: CandidatoNovo, token: str = Depends(pegar_token)):
    dados = await banco("POST", "candidatos", token,
                        corpo=candidato.model_dump(mode="json", exclude_none=True))
    return dados[0]


# ---------- Inscrições ----------

@router.get("/eventos/{id_evento}/inscricoes")
async def listar_inscricoes(id_evento: int, token: str = Depends(pegar_token)):
    return await banco("GET", "inscricoes", token, params={
        "select": "*,candidatos(nome,telefone,email)",
        "id_evento": f"eq.{id_evento}",
    })


@router.post("/inscricoes", status_code=201)
async def inscrever(inscricao: InscricaoNova, token: str = Depends(pegar_token)):
    evento = await banco("GET", "eventos", token, params={
        "select": "quantidade_vagas",
        "id_evento": f"eq.{inscricao.id_evento}",
    })
    if not evento:
        raise HTTPException(404, "Evento não encontrado")

    ativas = await banco("GET", "inscricoes", token, params={
        "select": "id_inscricao",
        "id_evento": f"eq.{inscricao.id_evento}",
        "status_participacao": "neq.cancelado",
    })
    if len(ativas) >= evento[0]["quantidade_vagas"]:
        raise HTTPException(409, "Evento sem vagas disponíveis")

    dados = await banco("POST", "inscricoes", token, corpo=inscricao.model_dump())
    return dados[0]


@router.patch("/inscricoes/{id_inscricao}")
async def mudar_status(id_inscricao: int, corpo: InscricaoStatus,
                       token: str = Depends(pegar_token)):
    dados = await banco("PATCH", "inscricoes", token,
                        params={"id_inscricao": f"eq.{id_inscricao}"},
                        corpo=corpo.model_dump())
    if not dados:
        raise HTTPException(404, "Inscrição não encontrada ou sem permissão")
    return dados[0]


app.include_router(router)