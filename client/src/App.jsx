import {
  Routes,
  Route,
} from "react-router-dom";
import Dashboard from "./pages/dashboard/Dashboard";

import Login
from "./pages/auth/Login";

import Register
from "./pages/auth/Register";

function App() {
  return (
    <Routes>

      <Route
        path="/login"
        element={<Login />}
      />

      <Route
        path="/register"
        element={<Register />}
      />

      <Route
        path="/dashboard"
        element={<Dashboard />}
      />

    </Routes>
  );
}

export default App;