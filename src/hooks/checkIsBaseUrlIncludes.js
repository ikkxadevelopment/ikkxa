export const checkIsBaseUrlIncludes = (url) => {
  if(!url) return;
  const imageUrl = url.startsWith("images/")
    ? `${process.env.NEXT_PUBLIC_BASE_URL_IMG}${url}`
    : url;

  return imageUrl;
};
