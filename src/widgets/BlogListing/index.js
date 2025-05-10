"use client"
import { Suspense, useState } from "react";
import BlogPaginate from "./BlogPaginate";
import { BLOG } from "@/constants/apiRoutes";
import { useLocale } from "next-intl";
import useSWR from "swr";


const BlogListing = ({ }) => {
  const lang = useLocale();
  const [locale, country] = lang.split('-');
  const [blogsData, setBlogsData] = useState([])
  const [paginationData, setPaginationData] = useState({});
  const url = `${BLOG}?page=1&lang=${locale}&slug=jalabiya&sort=newest`

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