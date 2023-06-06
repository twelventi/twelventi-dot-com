import { useEffect, useState } from "react";
import { ReactMarkdown } from "react-markdown/lib/react-markdown";
import { useQuery } from "react-query";
import { useParams } from "react-router-dom";
import { BLOG_SRC_URL } from "../../static";
import YAML from "yaml";

import remarkBreaks from "remark-breaks";
import rehypeRaw from "rehype-raw";

type Metadata = {
  title: string;
  date: string;
  author: string;
};

export function BlogPage() {
  const { id } = useParams();
  const blogURL = `${BLOG_SRC_URL}/${id}.markdown`;
  const getBlogPostContents = async () =>
    (await fetch(blogURL, { method: "GET" })).text();

  const { data, error, status } = useQuery(id ?? "", getBlogPostContents);

  const [BPC, setBPC] = useState("");
  const [meta, setMeta] = useState<Metadata | undefined>();

  useEffect(() => {
    const text = data ?? "";

    const toTrim = text.indexOf("---", 4) + 3;

    const metadata: Metadata = YAML.parse(text.slice(4, toTrim - 3));
    document.title = metadata?.title;
    setMeta(metadata);
    setBPC(text.slice(toTrim));
  }, [data]);

  return (
    <div className="flex items-center w-full justify-center">
      <div className="max-w-4xl w-full">
        <h1 className="font-bold text-3xl">{meta?.title}</h1>
        <div className="flex w-full text-sm text-accent mb-10" >
          <span>
            {meta?.date ? new Date(meta?.date).toLocaleDateString() : undefined}
          </span>
          <span>&nbsp;&nbsp;&nbsp;&#183;&nbsp;&nbsp;&nbsp;</span>
          <span>{meta?.author}</span>
        </div>
        <ReactMarkdown remarkPlugins={[remarkBreaks]} rehypePlugins={[rehypeRaw]} className="markdown-fixes">{BPC ?? ""}</ReactMarkdown>
      </div>
    </div>
  );
}
