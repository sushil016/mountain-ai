"use client";

import { useState } from "react";
import { LoginCard } from "./login-card";
import { RegisterCard } from "./register-card";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: "login" | "register";
}

export function AuthModal({ isOpen, onClose, initialMode = "login" }: AuthModalProps) {
  const [mode, setMode] = useState<"login" | "register">(initialMode);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/70 backdrop-blur-xl"
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="relative z-10 p-4">
        {mode === "login" ? (
          <LoginCard
            onSwitchToRegister={() => setMode("register")}
            onClose={onClose}
          />
        ) : (
          <RegisterCard
            onSwitchToLogin={() => setMode("login")}
            onClose={onClose}
          />
        )}
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute -top-2 -right-2 w-8 h-8 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}
