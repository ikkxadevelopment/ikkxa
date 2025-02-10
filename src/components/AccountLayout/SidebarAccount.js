import { useLogout } from "@/hooks/useLogout";
import { Link } from "@/i18n/routing";
import { userDetail } from "@/recoil/atoms";
import { useTranslations } from "next-intl";
import React from "react";
import { PiSignOutFill } from "react-icons/pi";
import { useRecoilState } from "recoil";

export default function SidebarAccount({ data, path }) {
  const t = useTranslations("Index");
  const [userDetails, setUserDetails] = useRecoilState(userDetail);
  const { handleLogOut } = useLogout();
  return (
    <div>
      <div className="lg:p-6 bg-white rounded lg:border lg:border-stone-200 ">
        <div className="">
          <div className="pb-4 border-b">
            <div className=" text-black text-base font-semibold mb-2">
              {t('Hello')} {userDetails?.first_name}!
            </div>
            <div className=" text-stone-500 text-sm font-medium ">
              {userDetails?.email}
            </div>
          </div>
          <div className="mb-6">
            {data?.map((item, i) => {
              return (
                <Link
                  key={i}
                  href={`${item?.url}`}
                  className={`flex items-center ${
                    path?.includes(item?.url)
                      ? "bg-black text-white border-transparent"
                      : "text-black border-gray-200"
                  }  px-2 py-4  border-b rounded font-medium  gap-1.5 flex`}
                >
                  <span className="text-xl md:text-2xl me-1">{item?.icon}</span>
                  {t(`${item?.title}`)}
                </Link>
              );
            })}
            <button
              onClick={handleLogOut}
              className={`flex items-center  px-2 py-4 text-black border-gray-200 border-b rounded font-medium w-full  gap-1.5 `}
            >
              <span className="text-xl md:text-2xl me-1">
                <PiSignOutFill />
              </span>
              {t('Logout')}
            </button>
          </div>
          <p className=" text-stone-500 text-sm mb-3"> {t('Legal')}</p>

          <Link
            href="/terms-conditions"
            className={`text-zinc-800 text-sm font-medium block py-1`}
          >
            {t('TermsOfUse')}
          </Link>
          <Link
            href="/privacy-policy"
            className={`text-zinc-800 text-sm font-medium block py-1`}
          >
            {t('PrivacyPolicy')}
          </Link>
        </div>
      </div>
    </div>
  );
}
