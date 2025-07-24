import NotFound from "./misc/NotFound";
import RootLayout from "./layout/Rootlayout";
import LoginForm from "./components/LoginForm";
import { useAuth } from "./context/authContext";
import { Navigate } from "react-router";

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, loading } = useAuth();
  if (loading) {
    return <div>Loading authentication...</div>;
  }
  return isAuthenticated ? children : <Navigate to="/login" />;
};
const routes = [
  {
    path: "/",
    element: <RootLayout />,
    errorElement: <NotFound />,
    Children: [
      {
        index: true,
        element: (
          <PrivateRoute>
            <div>
              <h1 className="text-2xl font-bold">Welcome to Your Inventory!</h1>
              <p>Use the sidebar to manage games.</p>
            </div>
          </PrivateRoute>
        ),
      },
      {
        path: "login",
        element: <LoginForm />,
      },
      {
        path: "*",
        element: <NotFound />,
      },
    ],
  },
];

export default routes;
