"use client";
import { ThreeDMarquee } from "@/components/ui/3d-marquee";

export function Marquee() {
  const images = [
    "/image-hero/a.jpg",
    "/image-hero/b.jpg",
    "/image-hero/c.jpg",
    "/image-hero/d.jpg",
    "/image-hero/e.jpg",
    "/image-hero/f.jpg",
    "/image-hero/g.jpg",
    "/image-hero/h.jpg",
    "/image-hero/i.jpg",
    "/image-hero/j.jpg",
    "/image-hero/k.jpg",
    "/image-hero/l.jpg",
    "/image-hero/m.jpg",
    "/image-hero/n.jpg",
    "/image-hero/o.jpg",
    "/image-hero/a.jpg",
    "/image-hero/b.jpg",
    "/image-hero/c.jpg",
    "/image-hero/d.jpg",
    "/image-hero/e.jpg",
    "/image-hero/f.jpg",
    "/image-hero/g.jpg",
    "/image-hero/h.jpg",
    "/image-hero/i.jpg",
    "/image-hero/j.jpg",
    "/image-hero/k.jpg",
    "/image-hero/l.jpg",
    "/image-hero/m.jpg",
    "/image-hero/n.jpg",
    "/image-hero/o.jpg",
    "/image-hero/a.jpg",
  ];
  return (
    <div className="relative mx-auto flex h-screen w-full  flex-col items-center justify-center overflow-hidden ">    
      {/* overlay */}
      <div className="absolute inset-0 z-10 h-full w-full bg-black/80 dark:bg-black/40" />
      <ThreeDMarquee
        className="pointer-events-none absolute inset-0 h-full w-full"
        images={images}
      />
    </div>
    );
}
