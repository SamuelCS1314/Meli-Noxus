import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import Layout from "./components/Layout";
import Dashboard from "./components/Dashboard"
import Eventos from "./pages/Eventos"

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/eventos " replace />} />
          <Route path="eventos" element={<Eventos />} />
          <Route path="dashboard" element={<Dashboard />} />

        </Route>
      </Routes>
    </BrowserRouter>
  );

}