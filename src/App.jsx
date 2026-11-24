import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard"
import Eventos from "./pages/Eventos"

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/usuarios" replace />} />
          <Route path="dasboard" element={<Dashboard />} />
          <Route path="eventos" element={<Eventos/>} />

        </Route>
      </Routes>
    </BrowserRouter>
  )
}