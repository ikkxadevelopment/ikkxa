'use client';

import { useEffect, useId } from 'react';

const CURRENCY_MAP = { AE: 'AED', SA: 'SAR', KW: 'KWD' };

const TabbyCardSnippet = ({ price, publicKey, merchantCode }) => {
  const [lang, region] = (merchantCode || '').split('-');
  const currency = CURRENCY_MAP[region] || 'AED';
  const formattedPrice = region === 'KW'
    ? parseFloat(price).toFixed(3)
    : parseFloat(price).toFixed(2);
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
        lang: lang || 'en',
        shouldInheritBg: false,
        publicKey,
        merchantCode: region,
      });
    }
  }, [price, publicKey, merchantCode, containerId]);

  return (
    <div id={containerId} className="mt-3" />
  );
};

export default TabbyCardSnippet;
