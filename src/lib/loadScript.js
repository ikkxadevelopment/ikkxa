// Load a third-party script once, on demand, and resolve when it has run.
// Used for Tabby so its scripts no longer block every page (they used to be
// `beforeInteractive` in the root layout) and load only where a widget mounts.
const pending = {};

export default function loadScript(src) {
  if (typeof window === "undefined") return Promise.reject(new Error("no window"));
  if (pending[src]) return pending[src];
  pending[src] = new Promise((resolve, reject) => {
    const existing = document.querySelector(`script[src="${src}"]`);
    const el = existing || document.createElement("script");
    const done = () => resolve();
    const fail = () => {
      delete pending[src];
      reject(new Error(`Failed to load ${src}`));
    };
    if (existing && existing.dataset.loaded === "1") return resolve();
    el.addEventListener("load", () => {
      el.dataset.loaded = "1";
      done();
    });
    el.addEventListener("error", fail);
    if (!existing) {
      el.src = src;
      el.async = true;
      document.head.appendChild(el);
    }
  });
  return pending[src];
}
