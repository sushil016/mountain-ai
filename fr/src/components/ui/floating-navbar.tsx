import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { AuthModal } from "../auth/auth-modal";
import { InteractiveHoverButton } from "@/components/magicui/interactive-hover-button";

interface FloatingNavbarProps {
  className?: string;
}

export const FloatingNavbar: React.FC<FloatingNavbarProps> = ({ className }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);



  
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <nav
        className={cn(
          "fixed top-4 left-1/2 z-50 px-6 py-3 rounded-2xl transition-all duration-300",
          "bg-white/10 backdrop-blur-md border border-white/20",
          "w-[95vw] max-w-6xl",
          isScrolled ? "py-2.5 px-5" : "px-8 py-4",
          className
        )}
        style={{
          transform: "translateX(-50%)",
          left: "50%",
        }}
      >
        <div className="flex items-center justify-between w-full px-2">
          {/* Logo */}
          <motion.div 
            className="flex items-center space-x-3 flex-shrink-0"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          >
            <Link to="/" className="flex items-center space-x-3">
              <motion.img
                src="/mountainai.png"
                alt="Mountain AI"
                className={cn(
                  "transition-all duration-300",
                  isScrolled ? "w-8 h-8" : "w-10 h-10"
                )}
                whileHover={{ rotate: 5 }}
                transition={{ duration: 0.2 }}
              />
              <div className={cn(
                "pixel-text transition-all duration-300 text-blue-500",
                isScrolled ? "text-2xl" : "text-3xl"
              )}>
                MOUNTAIN AI
              </div>
            </Link>
          </motion.div>

          {/* Navigation Items - Centered */}
          <div className="hidden lg:flex items-center space-x-6 flex-1 justify-center">
            <NavItem to="/">Home</NavItem>
            <NavItem to="/generate-flowchart">Generate</NavItem>
            <NavItem to="/about">About</NavItem>
            <NavItem to="/documentation">Docs</NavItem>
            <NavItem to="/contact">Contact</NavItem>
            <NavItem to="/privacy">Privacy</NavItem>
          </div>

          {/* Right side - GitHub Stars & CTA */}
          <div className="flex items-center space-x-3 flex-shrink-0">
            {/* GitHub Stars */}
            <div className="hidden sm:flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-black/20 border border-white/10">
              <svg 
                className="w-4 h-4 text-white" 
                fill="currentColor" 
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span className="text-xs font-medium text-white">1.2k</span>
            </div>
            
            {/* Login Button */}
            <InteractiveHoverButton
              onClick={() => setIsAuthModalOpen(true)}
              className={cn(
                "px-4 py-2 font-medium rounded-full duration-200 text-sm whitespace-nowrap",
                isScrolled ? "px-3 py-1.5" : ""
              )}
            >
             {"@"} Login
            </InteractiveHoverButton>
          </div>
        </div>
      </nav>
      
      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        initialMode="login"
      />
    </>
  );
};

interface NavItemProps {
  to: string;
  children: React.ReactNode;
}

const NavItem: React.FC<NavItemProps> = ({ to, children }) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  
  return (
    <Link
      to={to}
      className={cn(
        "transition-colors duration-200 text-sm font-medium",
        isActive 
          ? "text-blue-400" 
          : "text-white hover:text-blue-400"
      )}
    >
      {children}
    </Link>
  );
};
