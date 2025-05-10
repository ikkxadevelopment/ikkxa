"use client";
import qs from "qs";
import React, { useEffect, useState } from "react";
import axios from "axios";
import useSWR, { useSWRConfig } from "swr";
import { BLOG, BLOGS, CATEGORIES } from "@/constants/apiRoutes";
import { useSearchParams } from "next/navigation";
import Pagination from "./Pagination";

import Tags from "./Tags";
import MediaCard from "@/components/MediaCard";
import { useLocale } from "next-intl";

const fetcher = (url) => axios.get(url).then((res) => res.data);
const data = [
    {
      id: 2,
      slug: "jalabiya",
      status: 1,
      created_at: "2024-03-12T17:33:00.000000Z",
      updated_at: "2024-03-13T03:52:21.000000Z",
      title: "Jalabiya",
      current_language: [
        {
          id: 2,
          blog_category_id: 2,
          lang: "en",
          title: "Jalabiya",
          meta_title: "Jalabiya",
          meta_description: "Jalabiya",
          created_at: "2024-03-12T17:33:00.000000Z",
          updated_at: "2024-03-12T17:55:06.000000Z"
        },
        {
          id: 3,
          blog_category_id: 2,
          lang: "ar",
          title: "جلابية",
          meta_title: "جلابية",
          meta_description: "جلابية",
          created_at: "2024-03-12T17:55:23.000000Z",
          updated_at: "2024-03-12T17:55:23.000000Z"
        }
      ]
    },
    {
      id: 1,
      slug: "abaya",
      status: 1,
      created_at: "2024-03-12T17:27:13.000000Z",
      updated_at: "2024-03-12T17:27:13.000000Z",
      title: "Abaya",
      current_language: [
        {
          id: 1,
          blog_category_id: 1,
          lang: "en",
          title: "Abaya",
          meta_title: "Abaya",
          meta_description: "Abaya",
          created_at: "2024-03-12T17:27:13.000000Z",
          updated_at: "2024-03-12T18:12:25.000000Z"
        },
        {
          id: 4,
          blog_category_id: 1,
          lang: "ar",
          title: "عباية",
          meta_title: "عباية",
          meta_description: "عباية",
          created_at: "2024-03-12T17:55:42.000000Z",
          updated_at: "2024-03-12T17:55:42.000000Z"
        }
      ]
    }
  ];
  
  

export default function BlogPaginate({ datas, paginationData }) {
    console.log("blogssssssssssssssss",datas);
    const lang = useLocale();
    const [locale, country] = lang.split('-');
    const [page, setPage] = useState(1);
    const [selectedTag, setSelectedTag] = useState(null);
    const [tags, setTags] = useState([]);
    const searchParams = useSearchParams();
    const { mutate } = useSWRConfig();

    const tag = searchParams.get("tags")
    const pages = searchParams.get("page")

    const getLocalizedCategories = (data, lang) => {
        const categories = data ?? [];
      
        return categories.map(category => {
          const localized = category.current_language.find(item => item.lang === lang);
          return {
            slug: category.slug,
            title: localized ? localized.title : category.title, // fallback to default title
          };
        });
      };

    useEffect(() => {
        if (tag !== null) {
          mutate(`${BLOG}?page=1&lang=${locale}&slug=${tag}&sort=newest`)
            setSelectedTag(tag)
        }
        if (pages !== null) {
          mutate(`${BLOG}?page=${pages}&lang=${locale}&slug=${selectedTag}&sort=newest`)
            setPage(pages)
        }
        setTags(getLocalizedCategories(data,locale))
    }, [tag,pages])

    // const query = qs.stringify({
    //     populate: 'cover',
    //     sort: 'publishedAt:DESC',
    //     locale: locale,
    //     pagination: {
    //         page,
    //         pageSize: 9,
    //     },
    //     filters: selectedTag ? {
    //         category: {
    //             slug: {
    //                 $eq: selectedTag,
    //             },
    //         },
    //     } : undefined,
    // }, {
    //     encodeValuesOnly: true,
    // });
    // const { data: tags } = useSWR(`${process.env.NEXT_PUBLIC_BASE_URL}${CATEGORIES}?locale=${locale}`, fetcher, {
    //     dedupingInterval: 60000,
    //     revalidateOnFocus: false,
    // });
    // const { data, error } = useSWR(`${process.env.NEXT_PUBLIC_BASE_URL}${BLOGS}${query ? `?${query}` : ""}`, fetcher, {
    //     dedupingInterval: 60000,
    //     revalidateOnFocus: false,
    // });

    // if (error) return <h1>Error</h1>;

    return (
        <div >
            <div className="grid grid-cols-12 mb-4 lg:mb-7 items-end">
                <div className="col-span-8">
                    <h1 className=" text-3xl lg:text-6xl font-semibold  lg:leading-tight  bg-gradient-to-r from-[#242E49]  to-[#5B95F9] bg-clip-text text-transparent font-condensed ">
                        Blogs
                    </h1>
                </div>
                <div className="col-span-4">
                    <Tags selectedTag={selectedTag} setPage={setPage} setSelectedTag={setSelectedTag} tags={tags} />
                </div>
            </div>


            {!datas ? "Loaid" :
                <div className="grid lg:grid-cols-3 lg:gap-6">
                    {datas?.map((item, i) => (
                        <div className="" key={i}>
                            <MediaCard data={item} />
                        </div>
                    ))}
                </div>}
            {paginationData?.total_pages > 1 ? <Pagination page={page} setPage={setPage} pageCount={paginationData?.total_pages} /> : ""}
        </div>
    );
}

