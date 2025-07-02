import { Routes, Route, useNavigate } from "react-router-dom";
import { LoadScript } from "@react-google-maps/api";
import LoginPage from "./pages/login/LoginPage";
import "./App.scss";

const googleMapsKey = import.meta.env.VITE_APP_GOOGLE_API_KEY;

function App() {
  return (
    <>
      <LoadScript googleMapsApiKey={googleMapsKey}>
        <Routes>
          <Route path="/" element={<LoginPage />} />
        </Routes>
      </LoadScript>
    </>
  );
}

export default App;
