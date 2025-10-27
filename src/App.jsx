import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Timer from "./pages/Timer";
import Scripture from "./pages/Scripture";
import InsightForm from "./pages/InsightForm";
import Success from "./pages/Success";
import Navbar from "./components/Navbar";
import Toasts from "./components/Toast";

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/timer" element={<Timer />} />
        <Route path="/scripture" element={<Scripture />} />
        <Route path="/insight" element={<InsightForm />} />
        <Route path="/success" element={<Success />} />
      </Routes>
      <Toasts />
    </BrowserRouter>
  );
}
