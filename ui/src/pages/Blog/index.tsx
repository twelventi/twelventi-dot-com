import { Outlet, Route, Routes } from "react-router-dom";
import { BlogMain } from "./BlogMain";
import { BlogPage } from "./BlogPage";

export const BlogRoutes = (
  <>
    <Route path=":id" element={<BlogPage />} />
    <Route index element={<BlogMain />} />
  </>
);

export function Blog() {
  return <Outlet />;
}
