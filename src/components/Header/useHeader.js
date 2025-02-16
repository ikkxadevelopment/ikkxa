

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


  const onSelectChange = (lang) => {
    const currentPath = window.location.pathname;
    const match = currentPath.match(/^\/(en|ar)-(SA|AE)/);
    
    if (match) {
      const currentCountry = match[2];
      const restOfPath = currentPath.replace(/^\/(en|ar)-(SA|AE)/, '');
      const newPath = `/${lang}-${currentCountry}`;
      
      window.location.href = newPath;
    }
  };

  return {
    main,
    // isScrollingDown,
    onSelectChange
  };
};
