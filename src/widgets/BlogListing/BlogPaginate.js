"use client";
import qs from "qs";
import React, { useEffect, useState } from "react";
import axios from "axios";
import useSWR, { useSWRConfig } from "swr";
import { BLOG, BLOG_CATEGORY, BLOGS, CATEGORIES } from "@/constants/apiRoutes";
import { useSearchParams } from "next/navigation";
import Pagination from "./Pagination";

import Tags from "./Tags";
import MediaCard from "@/components/MediaCard";
import { useLocale, useTranslations } from "next-intl";

const fetcher = (url) => axios.get(url).then((res) => res.data);

export default function BlogPaginate({ datas, paginationData }) {
    const t = useTranslations("Index");
    const lang = useLocale();
    const [locale, country] = lang.split('-');
    const baseUrl = country === "SA" ? process.env.NEXT_PUBLIC_API_BASE_URL_SA : process.env.NEXT_PUBLIC_API_BASE_URL_AE;

    const [page, setPage] = useState(1);
    const [selectedTag, setSelectedTag] = useState(null);
    const [tags, setTags] = useState([]);
    const searchParams = useSearchParams();
    const { mutate } = useSWRConfig();

    const tag = searchParams.get("tags")
    const pages = searchParams.get("page")
    const getLocalizedCategories = (data, lang) => {
        const categories = data ?? [];
      
        return categories?.map(category => {
          const localized = category.current_language.find(item => item.lang === lang);
          return {
            slug: category.slug,
            title: localized ? localized.title : category.title, // fallback to default title
          };
        });
      };

    const loadData = async () => {
      if (tag !== null) {
        mutate(`${BLOG}?page=1&lang=${locale}&slug=${tag}&sort=newest`);
        setSelectedTag(tag);
      }

      if (pages !== null) {
        mutate(`${BLOG}?page=${pages}&lang=${locale}&slug=${selectedTag}&sort=newest`);
        setPage(pages);
      }

      if (tags?.length === 0) {
        try {
          const categoryData = await fetcher(`${baseUrl}${BLOG_CATEGORY}`);
          const localized = getLocalizedCategories(categoryData?.results?.categories?.data, locale);
          setTags(localized);
        } catch (err) {
          console.error("Failed to fetch category data", err);
        }
      }
    };


    useEffect(() => {
      loadData();
    }, [tag, pages]);


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
                    <h1 className=" text-3xl lg:text-6xl font-semibold  lg:leading-tight  bg-gradient-to-r from-[#242E49]  to-[#fdba74] bg-clip-text text-transparent font-condensed ">
                      {t('Blogs')}
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

