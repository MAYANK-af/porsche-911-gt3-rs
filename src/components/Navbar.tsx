"use client";

import { useState, useEffect } from "react";
import { Menu, Globe, User } from "lucide-react";

interface NavbarProps {
  onMenuToggle: () => void;
  onConfigureToggle: () => void;
  onDealersToggle: () => void;
  onLoginToggle: () => void;
}

export default function Navbar({
  onMenuToggle,
  onConfigureToggle,
  onDealersToggle,
  onLoginToggle
}: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    // Run once on mount
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 h-14 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-[#0a0a0a]/90 backdrop-blur-md border-b border-white/[0.04] text-white"
          : "bg-transparent text-white"
      }`}
    >
      <div className="max-w-[1700px] mx-auto h-full px-6 flex items-center justify-between relative">
        
        {/* Left: Menu hamburger */}
        <button
          onClick={onMenuToggle}
          className="flex items-center gap-2 hover:opacity-70 transition-opacity duration-200 cursor-pointer"
        >
          <Menu size={18} strokeWidth={1.75} />
          <span className="text-[15px] font-bold uppercase tracking-wider hidden sm:inline">
            Menu
          </span>
        </button>

        {/* Center: Absolute centered PORSCHE wordmark */}
        <div 
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 cursor-pointer"
        >
          <span className="porsche-wordmark tracking-[0.45em] transition-colors duration-300 text-white">
            PORSCHE
          </span>
        </div>

        {/* Right: Globe, User icon, and simple Configure text link */}
        <div className="flex items-center gap-5 text-[15px] font-bold uppercase tracking-wider">
          <button 
            onClick={onDealersToggle}
            className="hover:opacity-70 transition-opacity duration-200 cursor-pointer flex items-center" 
            aria-label="Find a dealer"
          >
            <Globe size={18} strokeWidth={1.75} />
          </button>
          
          <button 
            onClick={onLoginToggle}
            className="hover:opacity-70 transition-opacity duration-200 cursor-pointer flex items-center" 
            aria-label="Account login"
          >
            <User size={18} strokeWidth={1.75} />
          </button>

          <button
            onClick={onConfigureToggle}
            className="hover:opacity-70 transition-opacity duration-200 cursor-pointer hidden sm:inline font-bold uppercase tracking-wider text-[15px]"
          >
            Configure
          </button>
        </div>
      </div>
    </nav>
  );
}
