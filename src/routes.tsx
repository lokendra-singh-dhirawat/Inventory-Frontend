import NotFound from "./misc/NotFound";
import RootLayout from "./layout/Rootlayout";
import LoginForm from "./pages/authentication/LoginForm";
import { useAuth } from "./context/authContext";
import { Navigate } from "react-router";
import RegisterForm from "./pages/authentication/Register";
import ChangePasswordForm from "./pages/authentication/ChangePassword";
import CreateGameForm from "./pages/createGame/create";
import GameList from "./pages/GetGames/getAllgames";

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
        element: <GameList />,
      },
      {
        path: "change-password",
        element: (
          <PrivateRoute>
            <ChangePasswordForm />
          </PrivateRoute>
        ),
      },
      {
        path: "create-game",
        element: (
          <PrivateRoute>
            <CreateGameForm />
          </PrivateRoute>
        ),
      },
    ],
  },
  {
    path: "*",
    element: <NotFound />,
  },
];

export default routes;
