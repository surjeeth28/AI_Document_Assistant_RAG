import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/login";
import Signup from "./pages/signup";
import Chat from "./pages/Chat";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/chat" element={<Chat />} />
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Signup />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;