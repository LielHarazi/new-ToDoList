"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Btn } from "zvijude/btns";
import { signUp, signIn } from "@/app/actions";
import { getFormData } from "zvijude/form/funcs";

export default function AuthDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [isSignUp, setIsSignUp] = useState(true);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    const data = getFormData(e as any);

    if (isSignUp) {
      const result = await signUp(data);
      if (result.error) {
        setError(result.error);
      } else {
        onOpenChange(false);
      }
    } else {
      const result = await signIn(data.email);
      if (result.error) {
        setError(result.error);
      } else {
        onOpenChange(false);
      }
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isSignUp ? "Sign Up" : "Sign In"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="text-red-500 text-sm bg-red-50 p-2 rounded">
              {error}
            </div>
          )}

          {isSignUp && (
            <div>
              <label className="block text-sm font-medium mb-1">Username</label>
              <Input name="username" placeholder="Enter username..." required />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <Input
              name="email"
              type="email"
              placeholder="Enter email..."
              required
            />
          </div>

          <div className="flex gap-2">
            <Btn type="submit" lbl={isSignUp ? "Register Now" : "Sign In"} />
            <Btn
              type="button"
              onClick={() => {
                setIsSignUp(!isSignUp);
                setError("");
              }}
              lbl={
                isSignUp ? "Already have an account" : "Don't have an account"
              }
              className="bg-gray-500 hover:bg-gray-600"
            />
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
