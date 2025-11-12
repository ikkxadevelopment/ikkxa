// components/TabbyPromoWithButton.js

import { useEffect } from 'react';

const TabbyPromoWithButton = ({ price, publicKey, merchantCode, currency }) => {
  const [lang, region] = merchantCode.split("-");
  console.log("lang------>");
  
  useEffect(() => {
    if (window.TabbyPromo) {
      new window.TabbyPromo({
        selector: '#tabbyPromo',  // The div where the promo snippet will be placed
        currency: currency,  // The currency for the product
        price: price,  // The price of the product
        lang: lang,  // Language (en for English, ar for Arabic)
        source: 'product',  // The source (product or cart)
        publicKey: publicKey,  // Your public key from Tabby
        merchantCode: region,  // Your merchant code from Tabby
        installmentOption: 4, // Specify 4 payments (Tabby doesn't directly expose an option for this, but you can handle it in your custom UI or request)
      });
    }
  }, [price, publicKey, merchantCode, currency]);
  console.log("region------>");

  return (
    <div className="tabby-promo-container mb-4">
      <div id="tabbyPromo" className="tabby-promo-widget" />
    </div>
  );
};

export default TabbyPromoWithButton;
