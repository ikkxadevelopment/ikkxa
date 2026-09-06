"use client";

import { useEffect } from "react";

// Tabby's "learn more" popup is not rendered inside the widget container — the
// script appends a container to <body> and renders the dialog
// (`div[class^="styles__dialog"]`, older builds: `div.tabby-promo`) into it.
// Inside a modal drawer/dialog (vaul → Radix Dialog) that body-level node is
// isolated in three ways, all of which leave the popup visible but dead:
//   1. `body { pointer-events: none }`  → restored in globals.css
//   2. a pointerdown "outside" the drawer dismisses it → see isInsideTabbyPopup
//   3. react-remove-scroll cancels wheel/touchmove that start outside the
//      drawer content → useTabbyPopupScroll below
export const TABBY_POPUP_SELECTOR = '.tabby-promo, [class*="styles__dialog"]';

export function isInsideTabbyPopup(node) {
  return node instanceof Element && !!node.closest(TABBY_POPUP_SELECTOR);
}

/**
 * Lets the Tabby popup scroll while a modal drawer holds the scroll lock, by
 * stopping wheel/touchmove at the window capture phase so react-remove-scroll's
 * document-level listener never sees (and never preventDefaults) them.
 */
export default function useTabbyPopupScroll() {
  useEffect(() => {
    const allowScroll = (event) => {
      if (isInsideTabbyPopup(event.target)) event.stopPropagation();
    };
    const options = { capture: true, passive: false };
    window.addEventListener("wheel", allowScroll, options);
    window.addEventListener("touchmove", allowScroll, options);
    return () => {
      window.removeEventListener("wheel", allowScroll, options);
      window.removeEventListener("touchmove", allowScroll, options);
    };
  }, []);
}
