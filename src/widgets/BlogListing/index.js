"use client"
import { Suspense } from "react";
import BlogPaginate from "./BlogPaginate";

const BlogListing = ({ data }) => {
	return (
		<section className={`bg-neutral-100 lg:pb-[100px]`} id="BlogListing"> 
			<div className="container">
				<Suspense fallback="Loading">
					<BlogPaginate datas={data} tags={null} />
				</Suspense>
			</div>
		</section>
	);
};

export default BlogListing;