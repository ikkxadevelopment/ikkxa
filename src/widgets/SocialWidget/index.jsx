"use client";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { FaInstagram, FaFacebookF, FaYoutube, FaWhatsapp } from "react-icons/fa";
import { FaTiktok, FaLinkedinIn, FaGooglePlay, FaApple } from "react-icons/fa6";
import { LiaSnapchat } from "react-icons/lia";
import { RiTwitterXLine } from "react-icons/ri";

const PLATFORM_META = {
  instagram_link: {
    name: "Instagram",
    handle: "@ikkxa",
    color: "from-purple-500 via-pink-500 to-orange-400",
    icon: <FaInstagram className="w-4 h-4" />,
  },
  tiktok_link: {
    name: "TikTok",
    handle: "@ikkxa",
    color: "from-black to-gray-800",
    icon: <FaTiktok className="w-4 h-4" />,
  },
  facebook_link: {
    name: "Facebook",
    handle: "@ikkxa",
    color: "from-blue-600 to-blue-500",
    icon: <FaFacebookF className="w-4 h-4" />,
  },
  snapchat_link: {
    name: "Snapchat",
    handle: "ikkxa",
    color: "from-yellow-400 to-yellow-300",
    icon: <LiaSnapchat className="w-4 h-4" />,
  },
  twitter_link: {
    name: "X",
    handle: "@ikkxa",
    color: "from-gray-900 to-black",
    icon: <RiTwitterXLine className="w-4 h-4" />,
  },
  youtube_link: {
    name: "YouTube",
    handle: "@ikkxa",
    color: "from-red-600 to-red-500",
    icon: <FaYoutube className="w-4 h-4" />,
  },
  linkedin_link: {
    name: "LinkedIn",
    handle: "@ikkxa",
    color: "from-blue-700 to-blue-600",
    icon: <FaLinkedinIn className="w-4 h-4" />,
  },
  whatsapp_link: {
    name: "WhatsApp",
    handle: "ikkxa",
    color: "from-green-500 to-green-400",
    icon: <FaWhatsapp className="w-4 h-4" />,
  },
};

function buildPlatforms(socialLinks) {
  if (!socialLinks) return [];
  return Object.entries(PLATFORM_META)
    .filter(([key]) => socialLinks[key]?.length > 0)
    .map(([key, meta]) => ({ ...meta, url: socialLinks[key] }));
}

export default function SocialWidget({ data }) {
  const t = useTranslations("Index");
  const platforms = buildPlatforms(data?.social_links);
  const appLinks = data?.app_links;

  return (
    <section className="bg-[linear-gradient(90deg,#fdba7433_37%,transparent)] min-h-[calc(100vh-60px)] flex items-center">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-10 lg:gap-16">

          {/* Video — left */}
          <div className="w-full mx-auto max-w-[500px]">
            <div className="aspect-[272/352] relative">
              <video
                src={`${process.env.NEXT_PUBLIC_BASE_URL_IMG}images/magnific_positive-smooth-cinematic_cDJVcKE0eP.mp4`}
                autoPlay
                muted
                playsInline
                className="absolute inset-0 w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Content — right */}
          <div className="flex pb-10 flex-col items-start text-start gap-6">

            {/* Heading */}
            <div>
              <p className="text-sm font-semibold text-[#d29e82] mb-2 uppercase tracking-widest">
                {t("SocialCommunity")}
              </p>
              <h1 className="text-3xl lg:text-5xl font-semibold text-gray-900 mb-3">
                {t("SocialHeading")}
              </h1>
              <p className="text-gray-500 text-sm lg:text-base">
                {t("SocialDescription")}
              </p>
            </div>

            {/* Hashtag badge */}
            <div className="inline-flex items-center gap-2 bg-white border border-[#d29e82]/40 rounded-full px-5 py-2.5 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-[#d29e82] animate-pulse" />
              <span className="text-sm font-semibold text-gray-800 tracking-wide">#IKKXA</span>
            </div>

            {/* Social platforms */}
            {platforms.length > 0 && (
              <div className="w-full">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">
                  {t("SocialFollowUs")}
                </p>
                <div className="flex gap-2">
                  {platforms.map((p) => (
                    <Link
                      key={p.name}
                      href={p.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 rounded-xl transition-all duration-200"
                    >
                      <div className="w-8 h-8 rounded-full flex items-center justify-center text-black shrink-0">
                        {p.icon}
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* App download */}
            {appLinks && (appLinks.apple_store_link || appLinks.play_store_link) && (
              <div className="w-full">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">
                  {t("SocialShopOnTheGo")}
                </p>
                <div className="flex flex-wrap gap-3">
                  {appLinks.apple_store_link && (
                    <Link
                      href={appLinks.apple_store_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 bg-black text-white px-5 py-2.5 rounded-xl hover:bg-gray-900 transition-colors"
                    >
                      <FaApple className="w-5 h-5 shrink-0" />
                      <div className="text-start">
                        <p className="text-[10px] opacity-70 leading-none">{t("SocialDownloadOn")}</p>
                        <p className="text-sm font-semibold leading-tight">{t("SocialAppStore")}</p>
                      </div>
                    </Link>
                  )}
                  {appLinks.play_store_link && (
                    <Link
                      href={appLinks.play_store_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 bg-black text-white px-5 py-2.5 rounded-xl hover:bg-gray-900 transition-colors"
                    >
                      <FaGooglePlay className="w-5 h-5 shrink-0" />
                      <div className="text-start">
                        <p className="text-[10px] opacity-70 leading-none">{t("SocialGetItOn")}</p>
                        <p className="text-sm font-semibold leading-tight">{t("SocialGooglePlay")}</p>
                      </div>
                    </Link>
                  )}
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </section>
  );
}
