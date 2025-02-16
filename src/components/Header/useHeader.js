

import { usePathname, useRouter } from "@/i18n/routing";
import { useParams } from "next/navigation";
import { useRef, useState, useEffect, useTransition } from "react";
 
export const useHeader = () => {

  const main = useRef(null);
  // const [isScrollingDown, setIsScrollingDown] = useState(false);
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const pathname = usePathname();
  const params = useParams();

  // useEffect(() => {
  //   let lastScrollTop = 0;
  //   const handleScroll = () => {
  //     const currentScrollTop = window.pageYOffset || document.documentElement.scrollTop;
      
  //     if (currentScrollTop > lastScrollTop) {
  //       setIsScrollingDown(true);
  //     } else {
  //       setIsScrollingDown(false);
  //     }
      
  //     lastScrollTop = currentScrollTop <= 0 ? 0 : currentScrollTop; 
  //   };

  //   window.addEventListener('scroll', handleScroll);
  //   return () => {
  //     window.removeEventListener('scroll', handleScroll);
  //   };
  // }, []); 


 
  const onSelectChange = (lang) => {

    
    const nextLocale = lang;
    
    startTransition(() => {
      router.replace(
        // Adjust this line according to your routing logic
        { pathname, params },
        { locale: nextLocale }
      );
    });
  }


  return {
    main,
    // isScrollingDown,
    onSelectChange
  };
};
