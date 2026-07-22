"use client";
import { useEffect } from "react";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { useRecoilState } from "recoil";
import { checkoutDataState } from "@/recoil/atoms";
import Image from "@/components/Image/image";

/**
 * TabbyRedirectMessage
 *
 * Shown on /checkout/order-cancel and /checkout/order-failure.
 * - Displays the appropriate message for cancel vs failure.
 * - Clears any stored Tabby session URL from checkoutDataState so that
 *   when the customer returns to checkout, a fresh Tabby session is created.
 */
const TabbyRedirectMessage = ({ type }) => {
    const t = useTranslations("Index");
    const [checkoutData, setCheckoutData] = useRecoilState(checkoutDataState);

    // Clear any stale Tabby session data so a new session is created on retry
    useEffect(() => {
        if (checkoutData) {
            setCheckoutData((prev) => ({
                ...prev,
                tabby: null,
                tabby_checkout_url: null,
            }));
        }
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    const isCancel = type === "cancel";

    return (
        <section className="min-h-[calc(100vh-80px)] py-12 flex items-center">
            <div className="container max-w-lg mx-auto text-center">
                {/* Illustration */}
                <div className="aspect-[200/157] relative max-w-52 mx-auto mb-8">
                    <Image
                        src={isCancel ? "/images/op_img.svg" : "/images/op_img.svg"}
                        sizes="50vw"
                        fill
                        className="object-contain"
                        alt={isCancel ? "payment cancelled" : "payment failed"}
                    />
                </div>

                {/* Status badge */}
                <div
                    className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium mb-5 ${isCancel
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                        }`}
                >
                    <span>{isCancel ? "⚠️" : "❌"}</span>
                    <span>{isCancel ? t("TabbyPaymentCancelled") : t("TabbyPaymentFailed")}</span>
                </div>

                {/* Description */}
                <p className="text-zinc-500 text-sm lg:text-base leading-relaxed mb-8">
                    {isCancel ? t("TabbyPaymentCancelledDesc") : t("TabbyPaymentFailedDesc")}
                </p>

                {/* Tabby logo */}
                <div className="flex items-center justify-center gap-2 mb-8">
                    <span className="text-sm text-gray-400">Powered by</span>
                    <div className="aspect-[46/17] w-14 relative">
                        <Image
                            src="/images/tabby_logo.png"
                            fill
                            className="object-contain"
                            alt="tabby logo"
                        />
                    </div>
                </div>

                {/* Action buttons */}
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Link
                        href="/checkout"
                        className="btn btn-grad btn-lg px-8"
                    >
                        {t("ReturnToCheckout")}
                    </Link>
                    <Link
                        href="/cart"
                        className="btn btn-lg px-8 border border-gray-300 bg-white text-black hover:bg-gray-50 transition-colors"
                    >
                        {t("Cart")}
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default TabbyRedirectMessage;
