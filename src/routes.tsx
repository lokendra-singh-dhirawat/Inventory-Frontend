import NotFound from "./misc/NotFound";
import RootLayout from "./layout/Rootlayout";
import LoginForm from "./pages/authentication/LoginForm";
import { useAuth } from "./context/authContext";
import { Navigate } from "react-router";
import RegisterForm from "./pages/authentication/Register";

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, loading } = useAuth();
  if (loading) {
    return <div>Loading authentication...</div>;
  }
  return isAuthenticated ? children : <Navigate to="/login" />;
};
const routes = [
  {
    path: "login",
    element: <LoginForm />,
  },
  {
    path: "register",
    element: <RegisterForm />,
  },

  {
    path: "/",
    element: <RootLayout />,
    children: [
      {
        index: true,
      },
    ],
  },
  {
    path: "*",
    element: <NotFound />,
  },
];

export default routes;
