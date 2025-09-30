"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { GoogleSignInButton } from "./google-signin-button";
import { useAuth } from "../hooks/use-auth";
import { useState } from "react";

interface LoginDialogProps {
  trigger: React.ReactNode;
  onSuccess?: () => void;
}

export function LoginDialog({ trigger, onSuccess }: LoginDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { error, clearError } = useAuth();

  const handleSuccess = () => {
    setIsOpen(false);
    clearError();
    onSuccess?.();
  };

  const handleError = (errorMessage: string) => {
    console.error("Login error:", errorMessage);
    // Error is already handled by the auth store
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center">تسجيل الدخول</DialogTitle>
          <DialogDescription className="text-center">
            مرحباً بك، قم بتسجيل الدخول للمتابعة
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4 py-4">
          {error && (
            <div className="text-sm text-red-600 text-center bg-red-50 p-2 rounded">
              {error}
            </div>
          )}
          <GoogleSignInButton onSuccess={handleSuccess} onError={handleError} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
