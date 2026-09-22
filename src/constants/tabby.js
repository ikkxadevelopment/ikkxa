// Tabby account credentials used by the on-site snippets (promo / card).
// Each storefront country has its own Tabby merchant, so the keys are per region.
// NEXT_PUBLIC_* values are inlined at build time, so they must be referenced literally.
const TABBY_ACCOUNTS = {
  SA: {
    publicKey: process.env.NEXT_PUBLIC_TABBY_PUBLIC_KEY_SA || process.env.NEXT_PUBLIC_TABBY_PUBLIC_KEY,
    merchantCode: process.env.NEXT_PUBLIC_TABBY_MERCHANT_CODE_SA,
    currency: "SAR",
  },
  AE: {
    publicKey: process.env.NEXT_PUBLIC_TABBY_PUBLIC_KEY_AE || process.env.NEXT_PUBLIC_TABBY_PUBLIC_KEY,
    merchantCode: process.env.NEXT_PUBLIC_TABBY_MERCHANT_CODE_AE,
    currency: "AED",
  },
  KW: {
    publicKey: process.env.NEXT_PUBLIC_TABBY_PUBLIC_KEY_KW || process.env.NEXT_PUBLIC_TABBY_PUBLIC_KEY,
    merchantCode: process.env.NEXT_PUBLIC_TABBY_MERCHANT_CODE_KW,
    currency: "KWD",
  },
};

// `locale` is the storefront locale, e.g. "ar-SA".
export const getTabbyConfig = (locale) => {
  const [lang, region] = (locale || "").split("-");
  const account = TABBY_ACCOUNTS[region] || TABBY_ACCOUNTS.SA;
  return {
    ...account,
    lang: lang === "ar" ? "ar" : "en",
    formatPrice: (price) =>
      parseFloat(price || 0).toFixed(region === "KW" ? 3 : 2),
  };
};

// rejection_reason from Tabby -> next-intl key (Index namespace) with Tabby's wording.
// https://docs.tabby.ai/pay-in-4-custom-integration/checkout-flow#possible-rejection_reason-values
export const TABBY_REJECTION_MESSAGE_KEYS = {
  not_available: "RejectTabbyGeneral",
  order_amount_too_high: "RejectTabbyAmountTooHigh",
  order_amount_too_low: "RejectTabbyAmountTooLow",
};

export const tabbyRejectionKey = (reason) =>
  TABBY_REJECTION_MESSAGE_KEYS[reason] || "RejectTabbyGeneral";
