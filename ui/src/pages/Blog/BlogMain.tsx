import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { BLOG_RSS_URL } from "../../static";
import parser from "fast-xml-parser";

import { Link } from "react-router-dom";

type RssItem = {
  author: string;
  link: string;
  pubDate: string;
  title: string;
};

type RssObject = {
  rss: {
    channel: { item: RssItem[] };
  };
};

export function BlogMain() {
  const getBlogRss = async () => {
    const rss = await (await fetch(BLOG_RSS_URL, { method: "GET" })).text();
    const xp = new parser.XMLParser();
    const jsObject: RssObject = xp.parse(rss);
    return jsObject.rss.channel.item.sort((a, b) => {
      return (
        new Date(Date.parse(b.pubDate)).valueOf() -
        new Date(Date.parse(a.pubDate)).valueOf()
      );
    });
  };
  const { data, error, status } = useQuery("blog-list", getBlogRss);

  return (
    <div className="flex items-center w-full justify-center">
      <div className="max-w-4xl w-[56rem] px-5">
        <h1 className="font-bold text-xl">Posts</h1>
        {data?.map((item) => {
          return (
            <Link
              to={
                window.location.host !== "twelventi.com"
                  ? item.link.replace(
                      "https://twelventi.com",
                      `${window.location.protocol}${window.location.host}`
                    )
                  : item.link
              }
            >
              <div
                key={item.link}
                className="my-2 p-5 hover:bg-base-200 rounded-xl"
              >
                <h1 className="text-2xl">{item.title}</h1>
                <div className="flex items-center">
                  <p className="pr-5">{item.author}</p>
                  <p>{new Date(item.pubDate).toLocaleDateString()}</p>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
