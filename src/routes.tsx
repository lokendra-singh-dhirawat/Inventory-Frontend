import App from "./App";

const routes = [
  {
    path: "/",
    element: <App />,
    Children: [
      {
        index: true,
      },
    ],
  },
];

export default routes;
