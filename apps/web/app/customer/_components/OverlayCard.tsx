import Image from "next/image";
import { ReactNode } from "react";

interface OverlayCardProps {
  image: string;
  title: string;
  description?: string;
  height?: string;
  badges?: ReactNode;
  footer?: ReactNode;
  onClick?: () => void;
}

export default function OverlayCard({
  image,
  title,
  description,
  height = "h-64",
  badges,
  footer,
  onClick
}: OverlayCardProps) {
  return (
    <div 
      className={`relative rounded-3xl overflow-hidden ${height} group cursor-pointer`}
      onClick={onClick}
    >
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/40 to-black/20 z-10 transition-opacity group-hover:opacity-90"></div>
      
      {/* Background image */}
      <Image 
        src={image} 
        alt={title} 
        width={400} 
        height={300} 
        className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-700" 
      />
      
      {/* Badges (top-right) */}
      {badges && (
        <div className="absolute top-4 right-4 z-20">
          {badges}
        </div>
      )}
      
      {/* Content */}
      <div className="absolute inset-x-0 bottom-0 z-20 p-6">
        <h3 className="text-xl font-bold text-white mb-1">{title}</h3>
        {description && (
          <p className="text-white/80 text-sm mb-3">{description}</p>
        )}
        {footer && (
          <div className="mt-2">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
