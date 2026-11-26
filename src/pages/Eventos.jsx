import { useState } from "react";
import { Form, Card, Button } from "react-bootstrap";

export default function Eventos() {
  const [nome, setNome] = useState("");
  const [data, setData] = useState("");
  const [loading, setLoading] = useState("");
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");

  const API_URL = "localhost:5173/api"

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErro("");
        setSucesso(false);

        const evento = {nome,data}; //Cria o meu Json

        try {
            const response = await fetch(`${API_URL}/eventos`, {
                method: "POST",
                headers: {"Content-Type" : "application/json"},
                body: JSON.stringify(evento),
            });
        
            if(!response.ok) {
                throw new Error(`Erro ${response.status} ao salvar o evento` )
            }
            const resultado = await response.json();
            console.log("Responsta da API: ", resultado)
            
            setSucesso(true);
            setNome("");
            setData("");
        } catch (err) {
            setErro(err.message);
        } finally {
            setLoading(false);
        }
    };


  return (
    <div className="d-flex vh-100 align-itens-center justify-content-center bg-light">
      <Card style={{ width: 360 }} className="shadow-sm">
        <Card.Body className="pt-4">
          <Form onSubmit={handleSubmit}>
            <Form.Group contolId="nome">
              <Form.Label>Nome Evento</Form.Label>
              <Form.Control
                type="nome"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
              />
            </Form.Group>

            <Form.Group contolId="data">
              <Form.Label>data Evento</Form.Label>
              <Form.Control
                type="data"
                value={data}
                onChange={(e) => setData(e.target.value)}
              />
            </Form.Group>

            <Button type="submit" className="w-100">
                Entrar
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
}
