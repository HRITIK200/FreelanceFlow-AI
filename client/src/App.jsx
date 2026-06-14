import {
  Routes,
  Route,
} from "react-router-dom";
import Dashboard from "./pages/dashboard/Dashboard";
import ProtectedRoute from "./routes/ProtectedRoute";

import Login
from "./pages/auth/Login";

import Register
from "./pages/auth/Register";

import Profile
from "./pages/profile/Profile";

import { Navigate } from "react-router-dom";

import Clients from "./pages/clients/Clients";
import Projects from "./pages/projects/Projects";
import Invoices from "./pages/invoices/Invoices";
import Activity from "./pages/activity/Activity";

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
        path="/profile"
        element={
        <ProtectedRoute>
        <Profile />
        </ProtectedRoute>
        }
      />
      <Route
        path="/"
        element={
          <Navigate
            to="/login"
            replace
          />
        }
      />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/clients"
        element={
          <ProtectedRoute>
            <Clients />
          </ProtectedRoute>
        }
      />

      <Route
        path="/projects"
        element={
          <ProtectedRoute>
            <Projects />
          </ProtectedRoute>
        }
      />

      <Route
        path="/invoices"
        element={
          <ProtectedRoute>
            <Invoices />
          </ProtectedRoute>
        }
      />

      <Route
        path="/activity"
        element={
          <ProtectedRoute>
            <Activity />
          </ProtectedRoute>
        }
      />

    </Routes>
  );
}

export default App;