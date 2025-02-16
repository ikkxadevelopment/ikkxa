

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
    // Get the current pathname
    const currentPath = window.location.pathname;
    
    // Extract current locale-country pattern
    const match = currentPath.match(/^\/(en|ar)-(SA|AE)/);
    
    if (match) {
      // Keep the current country code
      const currentCountry = match[2];
      
      // Create new path with new language but same country
      const newPath = currentPath.replace(
        /^\/(en|ar)-(SA|AE)/,
        `/${lang}-${currentCountry}`
      );
      
      startTransition(() => {
        router.replace(newPath);
      });
    }
  }


  // const onSelectChange = (lang) => {

    
  //   const nextLocale = lang;
    
  //   startTransition(() => {
  //     router.replace(
  //       // Adjust this line according to your routing logic
  //       { pathname, params },
  //       { locale: nextLocale }
  //     );
  //   });
  // }


  return {
    main,
    // isScrollingDown,
    onSelectChange
  };
};
