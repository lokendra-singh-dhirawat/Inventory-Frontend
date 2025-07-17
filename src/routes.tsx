import App from "./App";
import NotFound from "./misc/NotFound";

const routes = [
  {
    path: "/",
    element: <App />,
    errorElement: <NotFound />,
    Children: [
      {
        index: true,
      },
    ],
  },
];

export default routes;
