export default function robots() {
    return {
      rules: [
        {
          userAgent: '*',
          disallow: ['/wishlist','/cart','/profile','/orders','/manage-addresses','/checkout'],
        },
      ],
      // sitemap: 'https://ikkxa.com/sitemap.xml',
    }
  }

 