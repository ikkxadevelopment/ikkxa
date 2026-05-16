// Build Tabby merchant_urls with the Tabby-approved redirect messages
// (sourced from next-intl translations: Index.RejectTabbyCancel / Index.RejectTabbyGeneral)
// passed in by the caller, so they stay localized and managed in messages/.
export const buildTabbyMerchantUrls = (
  origin,
  lang,
  { cancelMessage, failureMessage }
) => ({
  success: `${origin}/${lang}/checkout/order-success`,
  cancel: `${origin}/${lang}/checkout?tabby_status=cancel&message=${encodeURIComponent(cancelMessage)}`,
  failure: `${origin}/${lang}/checkout/order-cancel?tabby_status=failure&message=${encodeURIComponent(failureMessage)}`,
});
