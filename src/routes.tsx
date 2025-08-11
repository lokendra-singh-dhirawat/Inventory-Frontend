import { lazy, Suspense, type JSX } from "react";
import { Navigate } from "react-router";
import { useAuth } from "./context/authContext";

const RootLayout = lazy(() => import("./layout/Rootlayout"));
const LoginForm = lazy(() => import("./pages/authentication/LoginForm"));
const RegisterForm = lazy(() => import("./pages/authentication/Register"));
const ChangePasswordForm = lazy(
  () => import("./pages/authentication/ChangePassword")
);
const CreateGameForm = lazy(() => import("./pages/createGame/create"));
const GameList = lazy(() => import("./pages/GetGames/getAllgames"));
const UpdateGameForm = lazy(() => import("./pages/UpdateGame/updateGame"));
const SingleGamePage = lazy(
  () => import("./pages/SingleGamePage/SingleGamePage")
);
const NotFound = lazy(() => import("./misc/NotFound"));

const S = (el: JSX.Element) => (
  <Suspense fallback={<div style={{ padding: 16 }}>Loading…</div>}>
    {el}
  </Suspense>
);

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return <div>Loading authentication...</div>;
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
};

const routes = [
  {
    path: "login",
    element: S(<LoginForm />),
  },
  {
    path: "register",
    element: S(<RegisterForm />),
  },
  {
    path: "/",
    element: S(<RootLayout />),
    children: [
      { index: true, element: S(<GameList />) },
      { path: "game/:id", element: S(<SingleGamePage />) },
      {
        path: "change-password",
        element: S(
          <PrivateRoute>
            <ChangePasswordForm />
          </PrivateRoute>
        ),
      },
      {
        path: "create-game",
        element: S(
          <PrivateRoute>
            <CreateGameForm />
          </PrivateRoute>
        ),
      },
      {
        path: "update-game/:id",
        element: S(
          <PrivateRoute>
            <UpdateGameForm />
          </PrivateRoute>
        ),
      },
    ],
  },
  { path: "*", element: S(<NotFound />) },
];

export default routes;
