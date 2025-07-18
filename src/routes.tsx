import NotFound from "./misc/NotFound";
import RootLayout from "./layout/Rootlayout";

const routes = [
  {
    path: "/",
    element: <RootLayout />,
    errorElement: <NotFound />,
    Children: [
      {
        index: true,
      },
    ],
  },
];

export default routes;
