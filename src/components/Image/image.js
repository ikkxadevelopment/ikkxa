import { forwardRef } from "react";
import ImageNext from "next/image";

import { checkIsBaseUrlIncludes } from "@/hooks/checkIsBaseUrlIncludes";


const Image= (props, ref) => {
  const { src, ...rest } = props;

  const hasSource = !!src;

  if (!hasSource) {
    return null;
  }

  return (
    <ImageNext
      src={checkIsBaseUrlIncludes(src)}
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 100vw"
      quality={90}
      {...rest}
      ref={ref}
    />
  );
};

export default forwardRef(Image);


