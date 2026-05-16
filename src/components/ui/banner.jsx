"use client";
import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// Vendored from https://21st.dev/community/components/nurui/banner — Fumadocs tokens
// (bg-fd-*) swapped for this project's shadcn tokens. Keeps the rainbow + normal
// variants and the optional dismiss behaviour (active when an `id` is provided).
export function Banner({
  id,
  xColor,
  variant = "normal",
  height = "3rem",
  rainbowColors = [
    "rgba(0,149,255,0.56)",
    "rgba(231,77,255,0.77)",
    "rgba(255,0,0,0.73)",
    "rgba(131,255,166,0.66)",
  ],
  className,
  children,
  ...props
}) {
  const [open, setOpen] = useState(true);
  const globalKey = id ? `nd-banner-${id}` : null;

  useEffect(() => {
    if (globalKey) setOpen(localStorage.getItem(globalKey) !== "true");
  }, [globalKey]);

  if (!open) return null;

  return (
    <div
      id={id}
      {...props}
      className={cn(
        "sticky top-0 z-40 flex flex-row items-center justify-center px-4 text-center text-sm font-medium",
        variant === "normal" && "bg-secondary",
        variant === "rainbow" && "bg-background",
        className
      )}
      style={{ height }}
    >
      {variant === "rainbow" ? <Flow colors={rainbowColors} /> : null}
      {children}
      {id ? (
        <button
          type="button"
          aria-label="Close Banner"
          onClick={() => {
            setOpen(false);
            if (globalKey) localStorage.setItem(globalKey, "true");
          }}
          className={cn(
            buttonVariants({
              variant: "ghost",
              className:
                "absolute end-2 md:end-20 top-1/2 -translate-y-1/2 text-muted-foreground/50",
              size: "icon",
            })
          )}
        >
          <X color={xColor} />
        </button>
      ) : null}
    </div>
  );
}

const maskImage =
  "linear-gradient(to bottom,white,transparent), radial-gradient(circle at top center, white, transparent)";

function Flow({ colors }) {
  return (
    <>
      <div
        className="absolute inset-0 z-[-1]"
        style={{
          maskImage,
          maskComposite: "intersect",
          animation: "fd-moving-banner 20s linear infinite",
          backgroundImage: `repeating-linear-gradient(70deg, ${[...colors, colors[0]]
            .map((color, i) => `${color} ${(i * 50) / colors.length}%`)
            .join(", ")})`,
          backgroundSize: "200% 100%",
          filter: "saturate(2)",
        }}
      />
      <style>
        {`@keyframes fd-moving-banner {
            from { background-position: 0% 0; }
            to { background-position: 100% 0; }
         }`}
      </style>
    </>
  );
}
