import { Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import SignInPage from "./pages/SignInPage";
import SignUpPage from "./pages/SignUpPage";
import ChatPage from "./pages/ChatPage";
import { ThemeProvider } from "./components/ThemeProvider";

function App() {
  return (
    <ThemeProvider>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/sign-in" element={<SignInPage />} />
        <Route path="/sign-up" element={<SignUpPage />} />
        <Route path="/chat" element={<ChatPage />} />
      </Routes>
    </ThemeProvider>
  );
}

export default App;
