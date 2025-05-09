"use client";
import useSWR from "swr";
import { BLOG } from '@/constants/apiRoutes';
import { useLocale } from 'next-intl';
import React, { useState } from 'react';
import useBlogCategories from "./useBlogCategories";


const blogs = [
    {
      id: '1',
      title: 'First Blog Post',
      image: 'https://via.placeholder.com/400x200',
      shortDescription: 'This is a short description of the first blog.',
      fullDescription: 'This is a full description of the first blog post, containing more detailed content.',
      writer: 'John Doe',
    },
    {
      id: '2',
      title: 'Second Blog Post',
      image: 'https://via.placeholder.com/400x200',
      shortDescription: 'Another blog with a different angle.',
      fullDescription: 'Here we explore something new and insightful.',
      writer: 'Jane Smith',
    },
];
  

const BlogWidget = () => {
  const { blogCategories, setBlogCategories, isLoading, isError } = useBlogCategories();
  const lang = useLocale();
  const [locale, country] = lang.split('-');
  const [blogsData, setBlogsData] = useState([])
  const [page, setPage] = useState(1)
  const [sort, setSort] = useState('newest')
  const [slug, setSlug] = useState('jalabiya')
  const [totalPages, setTotalPages] = useState(3)
  
  const url = `${BLOG}?page=${page}&lang=${locale}&slug=${slug}&sort=${sort}`
  const { data, error } = useSWR(url, {
    onSuccess: (data) => {
      if (data) {
        const blogResult = data?.results?.blogs?.data
        setBlogsData(blogResult)
      }
    },
  });

  const goToNextPage = () => {
      if (page < totalPages) setPage((prev) => prev + 1);
    };
  
    const goToPreviousPage = () => {
      if (page > 1) setPage((prev) => prev - 1);
    };
    const handleFilterClick = (slug) => {
      setSlug(slug)
    };
  
  
  return (
    <div>
      <h1>Blog List</h1>
      {blogsData?.map((blog) => (
        <div key={blog.id} style={{ border: '1px solid #ccc', padding: '1rem', margin: '1rem 0' }}>
          <img src={blog.thumbnail} alt={blog.title} width="400" />
          <h2>{blog.title}</h2>
          <p>{blog.short_description}</p>
          {/* <Link to={`/blog/${blog.id}`}>Read More</Link> */}
        </div>
      ))}

    <div style={{ marginTop: '1rem' }}>
        <button onClick={goToPreviousPage} disabled={page === 1}>Previous</button>
        <br />
        <button onClick={goToNextPage} disabled={page === totalPages}>Next</button>
      </div>
      <div>
      {blogCategories?.map((category) => {
        const titleObj = category.current_language.find((item) => item.lang === locale);
        const displayTitle = titleObj ? titleObj.title : category.title;

        return (
          <button
            key={category.id}
            onClick={() => handleFilterClick(category.slug)}
            style={{ margin: "5px", padding: "10px" }}
          >
            {displayTitle}
          </button>
        );
      })}
      </div>
    </div>

  );
};

export default BlogWidget;