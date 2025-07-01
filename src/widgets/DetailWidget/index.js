"use client"
import useSWR from "swr";
import Image from "@/components/Image/image";
import { BLOG_CATEGORY, BLOG_DETAIL } from "@/constants/apiRoutes";
import { Link } from "@/i18n/routing";
import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { FaFacebook, FaLinkedinIn, FaTwitter, FaWhatsapp } from "react-icons/fa";

export default function DetailWidget({ }) {
  const t = useTranslations('Index')
  const lang = useLocale();
  const [locale, country] = lang.split('-');
  const pathname = usePathname()
  const pathSegments = pathname.split('/');
  const cat = pathSegments[3];
  const url = `${BLOG_DETAIL}/${cat}`
  
  const text = "Check out this post!"
  const facebookShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
  const twitterShareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`;
  const linkedInShareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
  const whatsappShareUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}%20${encodeURIComponent(url)}`;

const [blogCategories, setBlogCategories] = useState([])
const [blogData, setBlogData] = useState([])
const [blogLanguage, setBlogLanguage] = useState([])
  
  // const url = BLOG_CATEGORY
  const { data, error } = useSWR(url, {
    onSuccess: (data) => {
      if (data) {
        const res = data?.results?.blog
        setBlogData(res)
        setBlogLanguage(res?.blog_languages)
        // setBlogCategories()
      }
    },
  });

  const getLocalizedBlog = (dataArray, lang) => {
  return dataArray?.find(item => item.lang === lang);
};


  return (
    <section className={`overflow-hidden bg-slate-50 pt-14  pb-12 2xl:pt-[120px] 2xl:pb-[100px]`} id="DetailWidget">
      <div className="container">
        <div className="2xl:px-24 mt-8 mb-8 max-w-[1000px] mx-auto ">
          <p className=" text-primary text-sm font-semibold  leading-none mb-2"><Link href={`/`} className="uppercase">{t('Home')}</Link> / <Link href={`/blogs`} className="uppercase">{t('Blogs')}</Link></p>
         
            <div className="">
              <h1 className="  text-3xl lg:text-5xl xl:text-6xl font-semibold  lg:leading-normal xl:leading-tight bg-gradient-to-r from-[#242E49]  to-[#242E49] bg-clip-text text-transparent font-condensed mb-1 lg:mb-1">{blogData?.title}</h1>
              <div className="text-neutral-500 text-base">{blogData?.created_at && `Published on ${new Date(blogData?.created_at).toLocaleDateString('en-GB')}`}</div>
            </div>
            {/* <div className="col-span-12 lg:col-span-3">
              <div className="lg:text-end">
                <a className="inline-block px-2 py-1 me-1 text-[#969696]" href={facebookShareUrl} target="_blank" rel="noopener noreferrer"><FaFacebook /></a>
                <a className="inline-block px-2 py-1 me-1 text-[#969696]" href={twitterShareUrl} target="_blank" rel="noopener noreferrer"><FaTwitter /></a>
                <a className="inline-block px-2 py-1 me-1 text-[#969696]" href={linkedInShareUrl} target="_blank" rel="noopener noreferrer"><FaLinkedinIn /></a>
                <a className="inline-block px-2 py-1 me-1 text-[#969696]" href={whatsappShareUrl} target="_blank" rel="noopener noreferrer"><FaWhatsapp /></a>
              </div>
            </div> */}
        </div>
        <div className="aspect-[1454/548] bg-slate-200 relative">
        {blogData?.banner_img && <Image src={blogData?.banner_img} className="object-cover" fill alt={blogData?.title} />}
        </div>

        <div className="2xl:px-24 py-6 lg:py-14 max-w-[1000px] mx-auto">
              <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: getLocalizedBlog(blogLanguage,locale)?.long_description }}></div></div>
            {/* <div className="col-span-3">
              {blogData?.relatedBlogs?.map((item, i) => {
                return (
                  <Link key={i} href={`/blogs/${item?.slug}`} className="py-3 block  border-b border-neutral-300">
                    <div className="grid grid-cols-12 gap-x-3 items-center">
                      <div className="col-span-4">
                        <div className="aspect-[1/1] relative">
                          <Image src={item?.thumbnail} className="object-cover" fill alt={item?.title} />
                        </div>
                      </div>
                      <div className="col-span-8">
                        <h3 className="text-black text-lg font-medium font-condensed line-clamp-2">{item?.title}</h3>
                        <p className="text-zinc-600/90 text-sm  leading-snug line-clamp-2" >{item?.short_description}</p>
                      </div>
                    </div>

                  </Link>
                )
              })}
            </div> */}

      </div>
    </section>
  );
}
