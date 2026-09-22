'use client';

import { useEffect, useId } from 'react';
import { getTabbyConfig } from '@/constants/tabby';

// `locale` is the storefront locale ("ar-SA"); the Tabby public key and merchant
// code for that country come from constants/tabby.
const TabbyCardSnippet = ({ price, locale }) => {
  const { publicKey, merchantCode, currency, lang, formatPrice } = getTabbyConfig(locale);
  const formattedPrice = formatPrice(price);
  // A fixed id breaks as soon as two of these are mounted at once (the product
  // modal renders on top of a page that may already have one) — Tabby's
  // querySelector would resolve to the first match, not this instance.
  const containerId = `TabbyCard-${useId().replace(/:/g, '')}`;

  useEffect(() => {
    if (typeof window !== 'undefined' && window.TabbyCard) {
      new window.TabbyCard({
        selector: `#${containerId}`,
        currency,
        price: formattedPrice,
        lang,
        shouldInheritBg: false,
        publicKey,
        merchantCode,
      });
    }
  }, [formattedPrice, currency, lang, publicKey, merchantCode, containerId]);

  return (
    <div id={containerId} className="mt-3" />
  );
};

export default TabbyCardSnippet;
