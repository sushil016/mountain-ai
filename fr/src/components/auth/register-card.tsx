"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MagicCard } from "@/components/magicui/magic-card";

interface RegisterCardProps {
  onSwitchToLogin?: () => void;
  onClose?: () => void;
}

export function RegisterCard({ onSwitchToLogin, onClose }: RegisterCardProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate registration
    setTimeout(() => {
      setIsLoading(false);
      console.log("Registration attempted with:", formData);
      onClose?.();
    }, 2000);
  };

  const handleGoogleRegister = () => {
    console.log("Google register clicked");
  };

  const handleGitHubRegister = () => {
    console.log("GitHub register clicked");
  };

  return (
    <MagicCard
      gradientColor="#8b5cf680"
      gradientFrom="#8b5cf6"
      gradientTo="#a78bfa"
      gradientOpacity={0.8}
      gradientSize={300}
      className="max-w-sm w-full"
    >
      <Card className="border-0 shadow-none bg-transparent">
        <CardHeader className="border-b border-white/10 p-6">
          <CardTitle className="text-2xl text-white">Create Account</CardTitle>
          <CardDescription className="text-white/70">
            Enter your details to create your account
          </CardDescription>
        </CardHeader>
        
        <CardContent className="p-6">
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4">
              <div className="grid gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleGoogleRegister}
                  className="w-full bg-white/5 border-white/20 text-white hover:bg-white/10"
                >
                  Sign up with Google
                </Button>
                
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleGitHubRegister}
                  className="w-full bg-white/5 border-white/20 text-white hover:bg-white/10"
                >
                  Sign up with GitHub
                </Button>
              </div>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-white/20" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-transparent px-2 text-white/60">Or continue with</span>
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="name" className="text-white">Full Name</Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="bg-white/5 border-white/20 text-white placeholder:text-white/40"
                  required
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="email" className="text-white">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="name@example.com"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="bg-white/5 border-white/20 text-white placeholder:text-white/40"
                  required
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="password" className="text-white">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Create a password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="bg-white/5 border-white/20 text-white placeholder:text-white/40"
                  required
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="confirmPassword" className="text-white">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="bg-white/5 border-white/20 text-white placeholder:text-white/40"
                  required
                />
              </div>
            </div>
          </form>
        </CardContent>
        
        <CardFooter className="p-6 border-t border-white/10 flex-col gap-4">
          <Button 
            className="w-full bg-purple-600 hover:bg-purple-700" 
            onClick={handleSubmit}
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                Creating account...
              </span>
            ) : (
              "Create Account"
            )}
          </Button>
          
          <div className="text-center text-sm text-white/60">
            Already have an account?{" "}
            <Button 
              variant="link" 
              className="p-0 h-auto text-purple-400"
              onClick={onSwitchToLogin}
            >
              Sign in
            </Button>
          </div>
        </CardFooter>
      </Card>
    </MagicCard>
  );
}
