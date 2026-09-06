'use client';

import { useEffect, useId } from 'react';

const CURRENCY_MAP = { AE: 'AED', SA: 'SAR', KW: 'KWD' };
const SCRIPT_POLL_MS = 200;
const SCRIPT_MAX_WAIT_MS = 5000;

const TabbyPromoWithButton = ({ price, publicKey, merchantCode, source = 'product' }) => {
  const [lang, region] = (merchantCode || '').split('-');
  const currency = CURRENCY_MAP[region] || 'AED';
  const formattedPrice = region === 'KW'
    ? parseFloat(price).toFixed(3)
    : parseFloat(price).toFixed(2);
  // The product modal mounts a second ProductDetail on top of a page that may
  // already render one, so a shared `#TabbyPromo` id would resolve to the
  // widget behind the drawer and leave the one inside it empty.
  const containerId = `TabbyPromo-${useId().replace(/:/g, '')}`;

  useEffect(() => {
    if (typeof window === 'undefined') return;

    let cancelled = false;
    let timer;
    let waited = 0;

    // tabby-promo.js is loaded with `beforeInteractive`, but the widget is dead
    // if this effect happens to run before the script finished evaluating.
    const mount = () => {
      if (cancelled) return;
      if (!window.TabbyPromo) {
        if (waited >= SCRIPT_MAX_WAIT_MS) return;
        waited += SCRIPT_POLL_MS;
        timer = setTimeout(mount, SCRIPT_POLL_MS);
        return;
      }
      new window.TabbyPromo({
        selector: `#${containerId}`,
        currency,
        price: formattedPrice,
        lang: lang || 'en',
        source,
        shouldInheritBg: false,
        publicKey,
        merchantCode: region,
      });
    };

    mount();

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [price, publicKey, merchantCode, source, containerId]);

  return (
    // Inside a vaul drawer (the product modal), DrawerContent's onPointerDown
    // calls `event.target.setPointerCapture(...)` to track a drag. Tabby renders
    // its widget in a shadow root, so that target is the retargeted shadow host
    // — the capture then delivers pointerup to the host instead of the "Learn
    // more" element inside it, the click resolves to their common ancestor, and
    // Tabby's handler never runs: the popup does not open. Keeping the press out
    // of vaul's drag handling costs nothing here (the widget is not a drag
    // handle) and makes the popup work in the drawer.
    <div
      className="tabby-promo-container mb-4"
      onPointerDown={(event) => event.stopPropagation()}
    >
      <div id={containerId} className="tabby-promo-widget" />
    </div>
  );
};

export default TabbyPromoWithButton;
