import { useEffect } from "react";
import { ReactMarkdown } from "react-markdown/lib/react-markdown";
import { useQuery } from "react-query";
import rehypeRaw from "rehype-raw";
import remarkBreaks from "remark-breaks";
import { ABOUT_CONTENT } from "../static";

export const getAboutContents = async () =>
  (await fetch(ABOUT_CONTENT, { method: "GET" })).text();

export function About() {
  const { data, error, status } = useQuery("aboutText", getAboutContents);

  useEffect(() => {
    document.title = "About - twelventi.com";
  }, []);

  return (
    <div className="flex items-center w-full justify-center">
      <div className="max-w-4xl">
        <ReactMarkdown
          remarkPlugins={[remarkBreaks]}
          rehypePlugins={[rehypeRaw]}
          className="markdown-fixes"
        >
          {data ?? ""}
        </ReactMarkdown>
      </div>
    </div>
  );
}
