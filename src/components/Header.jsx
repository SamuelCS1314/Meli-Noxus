import { Navbar, Container, Form, Image } from "react-bootstrap";
import "./style/Header.css";

// Troque pelo caminho do logo do seu projeto
// import logo from "./assets/mercado-livre-logo.png";

export default function Header({
  userLabel = "TA Ops · Talent Attraction",
  onSearch,
}) {
  const handleSubmit = (e) => {
    e.preventDefault();
    const term = new FormData(e.currentTarget).get("q");
    onSearch?.(term);
  };

  return (
    <Navbar as="header" className="ml-header" role="banner">
      <Container fluid className="ml-header__container">
        <Navbar.Brand href="/" className="ml-header__brand">
          {/* <Image src={logo} alt="Mercado Livre" height={56} /> */}
        </Navbar.Brand>

        <Form
          role="search"
          className="ml-header__search"
          onSubmit={handleSubmit}
        >
          <Form.Control
            type="search"
            name="q"
            placeholder="Buscar evento, parceiro, região ou candidato"
            aria-label="Buscar evento, parceiro, região ou candidato"
            className="ml-header__input"
          />
        </Form>

        <span className="ml-header__user d-none d-md-block">{userLabel}</span>
      </Container>
    </Navbar>
  );
}