'use client';

import { useEffect } from 'react';

const CURRENCY_MAP = { AE: 'AED', SA: 'SAR', KW: 'KWD' };

const TabbyCardSnippet = ({ price, publicKey, merchantCode }) => {
  const [lang, region] = (merchantCode || '').split('-');
  const currency = CURRENCY_MAP[region] || 'AED';
  const formattedPrice = region === 'KW'
    ? parseFloat(price).toFixed(3)
    : parseFloat(price).toFixed(2);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.TabbyCard) {
      new window.TabbyCard({
        selector: '#TabbyCard',
        currency,
        price: formattedPrice,
        lang: lang || 'en',
        shouldInheritBg: false,
        publicKey,
        merchantCode: region,
      });
    }
  }, [price, publicKey, merchantCode]);

  return (
    <div id="TabbyCard" className="mt-3" />
  );
};

export default TabbyCardSnippet;
