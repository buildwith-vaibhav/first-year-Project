"use client";

import { useState } from "react";
import Image from "next/image";

const PLACEHOLDER =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='800' viewBox='0 0 800 800'%3E%3Crect fill='%23e8edea' width='800' height='800'/%3E%3Ctext x='400' y='410' text-anchor='middle' fill='%23908a80' font-family='sans-serif' font-size='28'%3ENo image%3C/text%3E%3C/svg%3E";

export function ProductGallery({ images, name }: { images: string[]; name: string }) {
  const safeImages = images?.length ? images : [PLACEHOLDER];
  const [activeIdx, setActiveIdx] = useState(0);

  return (
    <div className="grid gap-4 md:grid-cols-[5rem,1fr]">
      <div className="order-2 flex gap-3 overflow-x-auto md:order-1 md:flex-col md:gap-3">
        {safeImages.map((img, i) => (
          <button
            key={i}
            type="button"
            aria-label={`View image ${i + 1}`}
            onClick={() => setActiveIdx(i)}
            className={`relative aspect-square w-20 shrink-0 overflow-hidden rounded-xl border-2 transition ${
              activeIdx === i ? "border-ink" : "border-transparent hover:border-ink/40"
            }`}
          >
            <Image
              src={img}
              alt=""
              fill
              sizes="80px"
              className="object-cover"
              unoptimized={img.startsWith("data:")}
            />
          </button>
        ))}
      </div>
      <div className="order-1 md:order-2">
        <div className="relative aspect-square overflow-hidden rounded-3xl bg-mist">
          {safeImages[activeIdx] && (
            <Image
              key={safeImages[activeIdx]}
              src={safeImages[activeIdx]}
              alt={name}
              fill
              priority
              sizes="(min-width: 768px) 50vw, 100vw"
              className="object-cover scale-in"
              unoptimized={safeImages[activeIdx].startsWith("data:")}
            />
          )}
          <div className="pointer-events-none absolute inset-x-6 bottom-6 flex items-center justify-between rounded-full bg-[#fbfaf7]/80 px-4 py-2 text-xs text-ink-soft/70 backdrop-blur">
            <span>
              {activeIdx + 1} / {safeImages.length}
            </span>
            <span>Scroll or click thumbnails</span>
          </div>
        </div>
      </div>
    </div>
  );
}
