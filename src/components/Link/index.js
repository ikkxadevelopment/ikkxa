import { forwardRef } from "react";
import LinkNext from "next/link";
import { checkIsBaseUrlIncludes } from "@/hooks/checkIsBaseUrlIncludes";

const Link= (props, ref) => {
  const { href, ...rest } = props;

  const hasSource = !!href;

  if (!hasSource) {
    return null;
  }

  return (
    <LinkNext
      href={checkIsBaseUrlIncludes(href)}
      {...rest}
      ref={ref}
    />
  );
};

export default forwardRef(Link);
