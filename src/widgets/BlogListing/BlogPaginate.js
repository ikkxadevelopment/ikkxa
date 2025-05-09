"use client";
import qs from "qs";
import React, { useEffect, useState } from "react";
import axios from "axios";
import useSWR from "swr";
import { BLOGS, CATEGORIES } from "@/constants/apiRoutes";
import { useSearchParams } from "next/navigation";
import Pagination from "./Pagination";

import Tags from "./Tags";
import MediaCard from "@/components/MediaCard";
import { useLocale } from "next-intl";

const fetcher = (url) => axios.get(url).then((res) => res.data);

export default function BlogPaginate({ datas }) {
    const locale = useLocale();
    const [page, setPage] = useState(1);
    const [selectedTag, setSelectedTag] = useState(null);
    const searchParams = useSearchParams();

    const tag = searchParams.get("tags")
    const pages = searchParams.get("page")

    useEffect(() => {
        if (tag !== null) {
            setSelectedTag(tag)
        }
        if (pages !== null) {
            setPage(pages)
        }
    }, [tag, pages])

    const query = qs.stringify({
        populate: 'cover',
        sort: 'publishedAt:DESC',
        locale: locale,
        pagination: {
            page,
            pageSize: 9,
        },
        filters: selectedTag ? {
            category: {
                slug: {
                    $eq: selectedTag,
                },
            },
        } : undefined,
    }, {
        encodeValuesOnly: true,
    });
    const { data: tags } = useSWR(`${process.env.NEXT_PUBLIC_BASE_URL}${CATEGORIES}?locale=${locale}`, fetcher, {
        dedupingInterval: 60000,
        revalidateOnFocus: false,
    });
    const { data, error } = useSWR(`${process.env.NEXT_PUBLIC_BASE_URL}${BLOGS}${query ? `?${query}` : ""}`, fetcher, {
        dedupingInterval: 60000,
        revalidateOnFocus: false,
    });

    if (error) return <h1>Error</h1>;

    return (
        <div >
            <div className="grid grid-cols-12 mb-4 lg:mb-7 items-end">
                <div className="col-span-8">
                    <h1 className=" text-3xl lg:text-6xl font-semibold  lg:leading-tight  bg-gradient-to-r from-[#242E49]  to-[#5B95F9] bg-clip-text text-transparent font-condensed ">
                        {datas?.titleMain}
                    </h1>
                </div>
                <div className="col-span-4">
                    <Tags selectedTag={selectedTag} setPage={setPage} setSelectedTag={setSelectedTag} tags={tags} />
                </div>
            </div>


            {!data ? "Loaid" :
                <div className="grid lg:grid-cols-3 lg:gap-6">
                    {data?.data?.map((item, i) => (
                        <div className="" key={i}>
                            <MediaCard data={item} />
                        </div>
                    ))}
                </div>}
            {data?.meta?.pagination?.pageCount > 1 ? <Pagination page={page} setPage={setPage} pageCount={data?.meta?.pagination?.pageCount} /> : ""}
        </div>
    );
}

