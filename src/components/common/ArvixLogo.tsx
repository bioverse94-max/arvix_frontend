import React from "react";

interface ArvixLogoProps {
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  className?: string;
  showText?: boolean;
  textColor?: "white" | "dark" | "default";
}

export const ArvixLogo: React.FC<ArvixLogoProps> = ({
  size = "sm",
  className = "",
  showText = true,
  textColor = "default",
}) => {
  const sizeClasses = {
    xs: "w-6 h-6",
    sm: "w-8 h-8",
    md: "w-11 h-11",
    lg: "w-16 h-16",
    xl: "w-24 h-24",
  };

  const textClasses = {
    xs: "text-xs tracking-widest",
    sm: "text-sm tracking-widest",
    md: "text-base tracking-[0.2em]",
    lg: "text-xl tracking-[0.25em]",
    xl: "text-3xl tracking-[0.3em]",
  };

  const textColorClass =
    textColor === "white"
      ? "text-white"
      : textColor === "dark"
      ? "text-[#0A1F36]"
      : "text-white";

  return (
    <div className={`inline-flex items-center gap-2.5 select-none ${className}`}>
      <div
        className={`${sizeClasses[size]} shrink-0 rounded-lg overflow-hidden flex items-center justify-center bg-[#070B14] shadow-xs border border-white/10`}
      >
        <img
          src="/arvix-logo.png"
          alt="ARVIX"
          className="w-full h-full object-cover"
          loading="eager"
        />
      </div>

      {showText && (
        <span
          className={`font-mono-code font-extrabold ${textClasses[size]} ${textColorClass}`}
        >
          ARVIX
        </span>
      )}
    </div>
  );
};

export default ArvixLogo;
