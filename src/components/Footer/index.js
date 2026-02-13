"use client";
import Link from "next/link";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FaFacebookF, FaYoutube } from "react-icons/fa";
import { FiMessageSquare } from "react-icons/fi";
import { BsSuitcaseLg } from "react-icons/bs";
import { RiTwitterXLine } from "react-icons/ri";
import { IoMdCall } from "react-icons/io";
import { FaLinkedinIn } from "react-icons/fa6";
import { FaInstagram } from "react-icons/fa";
import { LiaSnapchat } from "react-icons/lia";
import PaymetnIcons from "../PaymentIcons";
import { useLocale, useTranslations } from "next-intl";
import { EnquireModal } from "../EnquireForm/EnquireModal";
import { FaTiktok } from "react-icons/fa";

import Image from "../Image/image";

export default function Footer({ data, menu }) {
  const t = useTranslations("Index");
  const footerMenu = data?.message?.menu?.footer_menu;
  const social = data?.message?.social_links;
  const locale = useLocale();
  const country = locale.split("-")[1];

  return (
    <footer>
      <div className="lg:hidden">
        <Tabs defaultValue="tab0" className="w-full">
          <TabsList className="w-full overflow-x-auto">
            {menu?.map((item, i) => {
              return (
                <TabsTrigger value={`tab${i}`} key={i} className="w-full">
                  {item?.title}
                </TabsTrigger>
              )
            })}
            {/* <TabsTrigger value="general" className="w-full">
              {t('General')}
            </TabsTrigger>
            <TabsTrigger value="two" className="w-full">
              Categories
            </TabsTrigger>
            <TabsTrigger value="three" className="w-full">
              Useful links
            </TabsTrigger> */}
          </TabsList>
          {menu?.map((item, i) => {
            return (
              <TabsContent value={`tab${i}`} key={i}>
                <div className="container">
                  <ul className="grid grid-cols-2 py-3">
                    {item?.links?.map((linkItem, index) => {
                      return (
                        <li className="mb-2" key={index}>
                          <Link
                            href={`${linkItem?.url}`}
                            className=" text-black text-sm  "
                          >
                            {linkItem?.label}
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </TabsContent>

            )
          })}
          {/* <TabsContent value="general">
            <div className="container">
              <ul className="grid grid-cols-2 py-3">
                {footerMenu?.map((item, i) => {
                  return (
                    <li className="mb-2" key={i}>
                      <Link
                        href={`${item?.url}`}
                        className=" text-black text-sm  "
                      >
                        {item?.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          </TabsContent>
          <TabsContent value="two">
            <div className="container">
              <ul className="grid grid-cols-2 py-3">
                {data?.message?.menu?.header_menu?.map((item, i) => {
                  return (
                    <li className="mb-2" key={i}>
                      <Link
                        href={`${item?.url}`}
                        className=" text-black text-sm  "
                      >
                        {item?.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          </TabsContent>
          <TabsContent value="three">
            <div className="container">
              <ul className="grid grid-cols-2 py-3">
                {data?.message?.menu?.useful_links?.map((item, i) => {
                  return (
                    <li className="mb-2" key={i}>
                      <Link
                        href={`${item?.url}`}
                        className=" text-black text-sm  "
                      >
                        {item?.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          </TabsContent> */}
          {/* <TabsContent value="password">Change your password here.</TabsContent> */}
        </Tabs>
      </div>
      <div className="">
        <div className="lg:py-9 bg-neutral-100 hidden lg:block">
          <div className="container">
            <div className="grid grid-cols-3">
              <div>
                <Link href={`/contact-us`} className="justify-start items-center gap-[19px] inline-flex">
                  <div className="w-[63.54px] h-[63.54px] relative rounded-full border-2 text-2xl border-neutral-200 flex items-center justify-center">
                    <IoMdCall />
                  </div>
                  <div className="flex-col  gap-[5px]">
                    <div className=" text-black text-sm  text-start">
                      {t('TalkToUs')}
                    </div>
                    {/* <div className=" text-black text-base font-semibold text-left">
                     {data?.message?.footer_data?.footer_contact_phone}
                    </div> */}
                  </div>
                </Link>
              </div>
              <div className="text-center">
                <Link href={`/contact-us`} className="justify-start items-center gap-5  inline-flex">
                  <div className="w-[63.54px] h-[63.54px] relative rounded-full border-2 text-2xl border-neutral-200 flex items-center justify-center">
                    <FiMessageSquare />
                  </div>
                  <div className="w-[170px] text-black text-sm   text-start">
                    {t('WriteToUs')}
                  </div>
                </Link>
              </div>
              <div className="text-right">
                <EnquireModal />
                {/* <Link href={`tel:${data?.message?.footer_data?.footer_contact_phone}`} className="justify-start items-center gap-5  inline-flex">
                  <div className="w-[63.54px] h-[63.54px] relative rounded-full border-2 text-2xl border-neutral-200 flex items-center justify-center">
                    <BsSuitcaseLg />
                  </div>
                  <div className="relative">
                    <div className=" text-black text-sm    text-left">
                      {t('B2BHelpcenter')}
                    </div>
                    <div className="text-black text-base font-semibold text-left ">
                     {data?.message?.footer_data?.footer_contact_phone}
                    </div>
                  </div>
                </Link> */}
              </div>
            </div>
          </div>
        </div>

        <div className="lg:py-8 bg-white">
          <div className="container">
            <div className=" grid-cols-5 hidden lg:grid">
              {/* <div>
                <h3 className=" text-black text-sm font-semibold  mb-2">
                {t('General')}
                </h3>
                <ul className="">
                  {footerMenu?.map((item, i) => {
                    return (
                      <li className="mb-2" key={i}>
                        <Link
                          href={`${item?.url}`}
                          className=" text-black text-sm  "
                        >
                          {item?.label}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>

              <div>
                <h3 className=" text-black text-sm font-semibold  mb-2">
                  Categories
                </h3>
                <ul className="">
                  {data?.message?.menu?.header_menu?.map((item, i) => {
                    return (
                      <li className="mb-2" key={i}>
                        <Link
                          href={`${item?.url}`}
                          className=" text-black text-sm  "
                        >
                          {item?.label}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>

              <div>
                <h3 className=" text-black text-sm font-semibold  mb-2">
                 Useful Links
                </h3>
                <ul className="">
                  {data?.message?.menu?.useful_links?.map((item, i) => {
                    return (
                      <li className="mb-2" key={i}>
                        <Link
                          href={`${item?.url}`}
                          className=" text-black text-sm  "
                        >
                          {item?.label}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div> */}

              {menu?.map((item, i) => {
                return (
                  <div key={i}>
                    <h3 className=" text-black text-sm font-semibold mb-2 ">
                      {item?.title}
                    </h3>
                    <ul className="">
                      {item?.links?.map((linkItem, index) => {
                        return (
                          <li className="mb-2" key={index}>
                            <Link href={`${linkItem?.url}`} className=" text-black text-sm  ">
                              {linkItem?.label}
                            </Link>
                          </li>
                        )
                      })}
                    </ul>
                  </div>
                )
              })}
            </div>
            {country === "AE" && (
              <div className="">

                <div className="relative w-32 aspect-[16/9] ">
                  <Image
                    src="/images/partners/fazaa.png"
                    alt="Fazaa Partner"
                    fill
                    className="object-contain"
                  />
                </div>
              </div>

            )}
            <div className={`flex flex-col lg:flex-row justify-between lg:items-center ${country === "AE" ? 'mt-2' : 'mt-10'} space-y-3`}>
              <PaymetnIcons />
              <div className="justify-start items-start gap-[13px] inline-flex ">
                {social?.facebook_link?.length > 0 && (
                  <a
                    href={social.facebook_link}
                    target="_blank"
                    className="w-10 h-10 p-2 bg-stone-50 rounded-full justify-center items-center text-lg inline-flex"
                  >
                    <FaFacebookF />
                  </a>
                )}
                {social?.twitter_link?.length > 0 && (
                  <a
                    href={social.twitter_link}
                    target="_blank"
                    className="w-10 h-10 p-2 bg-stone-50 rounded-full justify-center items-center text-lg inline-flex"
                  >
                    <RiTwitterXLine />
                  </a>
                )}
                {social?.linkedin_link?.length > 0 && (
                  <a
                    href={social.linkedin_link}
                    target="_blank"
                    className="w-10 h-10 p-2 bg-stone-50 rounded-full justify-center items-center text-lg inline-flex"
                  >
                    <FaLinkedinIn />
                  </a>
                )}
                {social?.instagram_link?.length > 0 && (
                  <a
                    href={social.instagram_link}
                    target="_blank"
                    className="w-10 h-10 p-2 bg-stone-50 rounded-full justify-center items-center text-lg inline-flex"
                  >
                    <FaInstagram />
                  </a>
                )}

                {social?.youtube_link?.length > 0 && (
                  <a
                    href={social.youtube_link}
                    target="_blank"
                    className="w-10 h-10 p-2 bg-stone-50 rounded-full justify-center items-center text-lg inline-flex"
                  >
                    <FaYoutube />
                  </a>
                )}
                {social?.snapchat_link?.length > 0 && (
                  <a
                    href={social.snapchat_link}
                    target="_blank"
                    className="w-10 h-10 p-2 bg-stone-50 rounded-full justify-center items-center text-lg inline-flex"
                  >
                    <LiaSnapchat />
                  </a>
                )}
                {social?.tiktok_link?.length > 0 && (
                  <a
                    href={social.tiktok_link}
                    target="_blank"
                    className="w-10 h-10 p-2 bg-stone-50 rounded-full justify-center items-center text-lg inline-flex"
                  >
                    <FaTiktok />
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-1  border-t border-zinc-100 py-3 lg:py-4">
            <div>
              <p className=" text-black text-xs md:text-sm  ">
                {t('Copyright')}
              </p>
            </div>
            <div className=" lg:text-end">
              <p className="text-black  text-xs md:text-sm   ">
                {t('DesignedBy')} <span className="text-blue-700  ">{t('BCOMMERCE')}</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

const footer = [{
  title: "General",
  links: [{
    title: "Home",
    url: "/"
  }, {
    title: "Home",
    url: "/"
  }, {
    title: "Home",
    url: "/"
  }]
}, {
  title: "Policies",
  links: [{
    title: "Home",
    url: "/"
  }, {
    title: "Home",
    url: "/"
  }, {
    title: "Home",
    url: "/"
  }]
}]