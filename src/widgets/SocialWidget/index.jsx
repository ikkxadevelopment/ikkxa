"use client";
import Link from "next/link";

const PLATFORM_META = {
  instagram_link: {
    name: "Instagram",
    handle: "@ikkxa",
    color: "from-purple-500 via-pink-500 to-orange-400",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
      </svg>
    ),
  },
  tiktok_link: {
    name: "TikTok",
    handle: "@ikkxa",
    color: "from-black to-gray-800",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.77 1.52V6.76a4.85 4.85 0 01-1-.07z" />
      </svg>
    ),
  },
  facebook_link: {
    name: "Facebook",
    handle: "@ikkxa",
    color: "from-blue-600 to-blue-500",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    ),
  },
  snapchat_link: {
    name: "Snapchat",
    handle: "ikkxa",
    color: "from-yellow-400 to-yellow-300",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M12.206.793c.99 0 4.347.276 5.93 3.821.529 1.193.403 3.219.299 4.847l-.003.06c-.012.18-.022.345-.03.51.075.045.203.09.401.09.3-.016.659-.12 1.033-.301.165-.088.344-.104.464-.104.182 0 .359.029.509.09.45.149.734.479.734.838.015.449-.39.839-1.213 1.168-.089.029-.209.075-.344.119-.45.135-1.139.36-1.333.81-.09.224-.061.524.12.868l.015.015c.06.136 1.526 3.475 4.791 4.014.255.044.435.27.42.509 0 .075-.015.149-.045.225-.24.569-1.273.988-3.146 1.271-.059.091-.12.375-.164.57-.029.179-.074.36-.134.553-.076.271-.27.405-.555.405h-.03c-.135 0-.313-.031-.538-.074-.36-.075-.765-.135-1.273-.135-.3 0-.599.015-.913.074-.6.104-1.123.464-1.723.884-.853.599-1.826 1.288-3.294 1.288-.06 0-.119-.015-.18-.015h-.149c-1.468 0-2.427-.675-3.279-1.288-.599-.42-1.107-.779-1.707-.884-.314-.045-.629-.074-.928-.074-.54 0-.958.089-1.272.149-.211.043-.391.074-.54.074-.374 0-.523-.224-.583-.42-.061-.192-.09-.389-.135-.567-.046-.181-.105-.494-.166-.57-1.918-.222-2.95-.642-3.189-1.226-.031-.063-.052-.15-.055-.225-.015-.243.165-.465.42-.509 3.264-.54 4.73-3.879 4.791-4.02l.016-.029c.18-.345.224-.645.119-.869-.195-.434-.884-.658-1.332-.809-.121-.029-.24-.074-.346-.119-1.107-.435-1.257-.93-1.197-1.273.09-.479.674-.793 1.168-.793.146 0 .27.029.383.074.42.194.789.3 1.104.3.234 0 .384-.06.465-.105l-.046-.569c-.098-1.626-.225-3.651.307-4.837C7.392 1.077 10.739.807 11.733.807L12.206.793z" />
      </svg>
    ),
  },
  twitter_link: {
    name: "X",
    handle: "@ikkxa",
    color: "from-gray-900 to-black",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.74l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  youtube_link: {
    name: "YouTube",
    handle: "@ikkxa",
    color: "from-red-600 to-red-500",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M23.495 6.205a3.007 3.007 0 00-2.088-2.088c-1.87-.501-9.396-.501-9.396-.501s-7.507-.01-9.396.501A3.007 3.007 0 00.527 6.205a31.247 31.247 0 00-.522 5.805 31.247 31.247 0 00.522 5.783 3.007 3.007 0 002.088 2.088c1.868.502 9.396.502 9.396.502s7.506 0 9.396-.502a3.007 3.007 0 002.088-2.088 31.247 31.247 0 00.5-5.783 31.247 31.247 0 00-.5-5.805zM9.609 15.601V8.408l6.264 3.602z" />
      </svg>
    ),
  },
  linkedin_link: {
    name: "LinkedIn",
    handle: "@ikkxa",
    color: "from-blue-700 to-blue-600",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  },
  whatsapp_link: {
    name: "WhatsApp",
    handle: "ikkxa",
    color: "from-green-500 to-green-400",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
      </svg>
    ),
  },
};

function buildPlatforms(socialLinks) {
  if (!socialLinks) return [];
  return Object.entries(PLATFORM_META)
    .filter(([key]) => socialLinks[key]?.length > 0)
    .map(([key, meta]) => ({ ...meta, url: socialLinks[key] }));
}

export default function SocialWidget({ data }) {
  const platforms = buildPlatforms(data?.social_links);
  const appLinks = data?.app_links;

  return (
    <section className="bg-[linear-gradient(90deg,#c4c2c2_37%,transparent)]  min-h-[calc(100vh-60px)] flex items-center">
      <div className="container ">
        <div className="grid grid-cols-2 items-center gap-10 lg:gap-16">

          {/* Video — left */}
          <div className="w-full  mx-auto max-w-[500px]">
            <div className="aspect-[272/352] relative">
              <video
                src="/images/magnific_positive-smooth-cinematic_cDJVcKE0eP.mp4"
                autoPlay
                muted
                playsInline
                className="absolute inset-0 w-full h-full object-cover"
              />
            </div>
          </div>
          {/* Content — right */}
          <div className="flex flex-col items-start text-left lg:w-1/2 gap-6">

            {/* Heading */}
            <div>
              <p className="text-sm font-semibold text-[#d29e82] mb-2 uppercase tracking-widest">
                Community
              </p>
              <h1 className="text-3xl lg:text-5xl font-semibold text-gray-900 mb-3">
                Join Our World
              </h1>
              <p className="text-gray-500 text-sm lg:text-base">
                Share your IKKXA moments and become part of our global fashion community. Tag your posts to be featured here.
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
                  Follow Us
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {platforms.map((p) => (
                    <Link
                      key={p.name}
                      href={p.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 hover:border-[#d29e82]/40 hover:shadow-sm transition-all duration-200 bg-white"
                    >
                      <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${p.color} flex items-center justify-center text-white shrink-0`}>
                        {p.icon}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-gray-900 truncate">{p.name}</p>
                        <p className="text-xs text-gray-400 truncate">{p.handle}</p>
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
                  Shop on the Go
                </p>
                <div className="flex flex-wrap gap-3">
                  {appLinks.apple_store_link && (
                    <Link
                      href={appLinks.apple_store_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 bg-black text-white px-5 py-2.5 rounded-xl hover:bg-gray-900 transition-colors"
                    >
                      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 shrink-0">
                        <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                      </svg>
                      <div className="text-left">
                        <p className="text-[10px] opacity-70 leading-none">Download on the</p>
                        <p className="text-sm font-semibold leading-tight">App Store</p>
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
                      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 shrink-0">
                        <path d="M3.18 23.76c.3.17.64.2.96.09l12.12-7-2.79-2.79-10.29 9.7zm-1.15-20.4A1.99 1.99 0 002 4.56v14.88c0 .54.16 1.03.43 1.44l.08.08 8.34-8.34v-.2L2.03 3.36zm17.58 8.34l-2.38-1.37-2.97 2.97 2.97 2.97 2.38-1.37c.68-.39.68-1.82 0-2.2zM4.14.36L16.26 7.36l-2.79 2.79L3.18.45A1.07 1.07 0 014.14.36z" />
                      </svg>
                      <div className="text-left">
                        <p className="text-[10px] opacity-70 leading-none">Get it on</p>
                        <p className="text-sm font-semibold leading-tight">Google Play</p>
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
