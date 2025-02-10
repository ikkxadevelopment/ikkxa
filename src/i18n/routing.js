import  {createNavigation}  from 'next-intl/navigation';
import { defineRouting } from 'next-intl/routing';

export const routing ={
   locales: ['ar-SA', 'en-SA',`en-AE`, 'ar-AE'], // Supported locale-region combinations
   defaultLocale: 'ar-SA', // Default locale-region
   pathnames: {
     '/': {
       'en-AE': '/',
       'ar-AE': '/',
       'en-SA': '/',
       'ar-SA': '/',
     },
     '/pathnames': {
      'ar-SA': '/ar/pathnames',
      'en-SA': '/pathnames',
       'en-AE': '/pathnames',
       'ar-AE': '/ar/pathnames',
       
      
     },
   },
 };

export const { Link, getPathname, redirect, usePathname, useRouter } =
createNavigation(routing);

