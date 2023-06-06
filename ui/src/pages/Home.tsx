import { useEffect } from "react";
import { BlogMain } from "./Blog/BlogMain";

export function Home() {
  useEffect(() => {
    document.title = "Home - twelventi.com";
  }, []);
  return (
    <>
      <BlogMain />
    </>
  );
}
