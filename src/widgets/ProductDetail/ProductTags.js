"use client";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";

// Turn a display tag ("Open Abaya ") into a URL slug ("open-abaya"), which is
// also the value the collections archive sends as ?tag=.
function slugifyTag(tag) {
  return tag
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9؀-ۿ]+/g, "-") // keep Arabic letters
    .replace(/^-+|-+$/g, "");
}

// Product tags rendered as chips that link to their collection archive
// (DEV-00 / DEV-10 interlinking). `tags` is the raw comma-separated string
// from language_product.tags. `onNavigate` is supplied when rendered inside
// the product drawer so a tag click closes the drawer before routing.
export default function ProductTags({ tags, onNavigate }) {
  const t = useTranslations("Index");

  if (!tags || typeof tags !== "string") return null;

  // Split, trim, drop empties, dedupe (case-insensitive) while keeping order.
  const seen = new Set();
  const items = tags
    .split(",")
    .map((raw) => raw.trim())
    .filter(Boolean)
    .map((label) => ({ label, slug: slugifyTag(label) }))
    .filter(({ slug }) => {
      if (!slug || seen.has(slug)) return false;
      seen.add(slug);
      return true;
    });

  if (items.length === 0) return null;

  return (
    <div className="py-3 lg:py-4 border-b border-gray-200">
      <h3 className="text-base font-semibold mb-2">{t("Tags")}</h3>
      <ul className="flex flex-wrap gap-2">
        {items.map(({ label, slug }) => (
          <li key={slug}>
            <Link
              href={`/collections/${slug}`}
              onClick={
                onNavigate
                  ? (e) => {
                      // Inside the drawer: intercept plain left-clicks so the
                      // drawer can close first; let modifier/middle clicks
                      // (open-in-new-tab) behave normally.
                      if (e.metaKey || e.ctrlKey || e.shiftKey || e.button === 1) return;
                      e.preventDefault();
                      onNavigate(`/collections/${slug}`);
                    }
                  : undefined
              }
              className="inline-block rounded-full border border-gray-300 px-3 py-1 text-xs text-gray-700 hover:bg-slate-50"
            >
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
