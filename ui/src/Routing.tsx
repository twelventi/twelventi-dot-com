import { PropsWithChildren } from "react";
import { useQuery } from "react-query";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { MainLayout } from "./Layout";
import { About, getAboutContents } from "./pages/About";
import { Blog, BlogRoutes } from "./pages/Blog";
import { Home } from "./pages/Home";

export const mainLayoutRoutes = [
  { path: "/", element: <Home />, name: "Home" },
  { path: "/about", element: <About />, name: "About" },
  {
    path: "/blog",
    element: <Blog />,
    name: "Blog",
    childRoutes: BlogRoutes,
    hiddenFromNav: true,
  },
];

export const Routing = ({ children }: PropsWithChildren) => {
  //pre-load the contents of the about page in  case the user clicks on it
  useQuery("aboutText", getAboutContents);

  return (
    <Router>
      <>{children}</>
      <Routes>
        {/* all routes within this element will have the same layout as the main site */}
        <Route element={<MainLayout />}>
          {mainLayoutRoutes.map((route) => {
            return (
              <Route path={route.path} element={route.element}>
                {route.childRoutes}
              </Route>
            );
          })}
        </Route>
      </Routes>
    </Router>
  );
};
