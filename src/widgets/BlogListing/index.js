"use client"
import { Suspense, useState } from "react";
import BlogPaginate from "./BlogPaginate";
import { BLOG } from "@/constants/apiRoutes";
import { useLocale } from "next-intl";
import useSWR from "swr";
import { useSearchParams } from "next/navigation";


const BlogListing = ({ }) => {
  const lang = useLocale();
  const [locale, country] = lang.split('-');
  const [blogsData, setBlogsData] = useState([])
  const [paginationData, setPaginationData] = useState({});
  const searchParams = useSearchParams();
  const tag = searchParams.get("tags")
  const url = tag ? `${BLOG}?page=1&lang=${locale}&slug=${tag}&sort=newest` : `${BLOG}?page=1&lang=${locale}&sort=newest`

  const { data, error } = useSWR(url, {
    onSuccess: (data) => {
      if (data) {
        const blogResult = data?.results?.blogs
        setPaginationData(blogResult)
        setBlogsData(blogResult?.data)
      }
    },
  });

	return (
		<section  id="BlogListing"> 
			<div className="container">
				<Suspense fallback="Loading">
					<BlogPaginate datas={blogsData} tags={null} paginationData={paginationData} />
				</Suspense>
			</div>
		</section>
	);
};

export default BlogListing;