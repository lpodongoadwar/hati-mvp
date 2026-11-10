"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { createClient } from "@/lib/db";

type ModalType = "email" | "phone" | "password" | null;

interface EditProfileModalProps {
  isOpen: boolean;
  type: ModalType;
  currentValue?: string;
  onClose: () => void;
  onSuccess: () => void;
}

export function EditProfileModal({ isOpen, type, currentValue, onClose, onSuccess }: EditProfileModalProps) {
  const supabase = createClient();
  const [value, setValue] = useState(currentValue || "");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen || !type) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      if (type === "email") {
        // Update Email (Requires confirmation from Supabase)
        const { error } = await supabase.auth.updateUser({ email: value });
        if (error) throw error;
        alert("Confirmation email sent! Please check your inbox to verify the new email.");

      } else if (type === "phone") {
        // Update Phone in the profiles table
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error("Not logged in");

        const { error } = await supabase.from("profiles").update({ phone: value }).eq("id", user.id);
        if (error) throw error;
        alert("Phone number updated successfully!");
        onSuccess(); // Refresh the page data

      } else if (type === "password") {
        // Update Password
        const { error } = await supabase.auth.updateUser({ password: value });
        if (error) throw error;
        alert("Password updated successfully!");
      }

      onClose();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getTitle = () => {
    if (type === "email") return "Change Email Address";
    if (type === "phone") return "Change Phone Number";
    return "Change Password";
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-2xl bg-background p-6 shadow-xl relative animate-in fade-in zoom-in-95 duration-200">
        <button onClick={onClose} className="absolute right-4 top-4 text-muted-foreground hover:text-foreground">
          <X className="size-5" />
        </button>

        <h2 className="text-xl font-semibold mb-4">{getTitle()}</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">
              {type === "email" ? "New Email" : type === "phone" ? "New Phone Number" : "New Password"}
            </label>
            <input
              type={type === "password" ? "password" : type === "email" ? "email" : "tel"}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              required
              minLength={type === "password" ? 6 : undefined}
              className="flex h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1b4a3a]"
              placeholder={`Enter new ${type}`}
            />
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-[#1b4a3a] text-white py-2.5 rounded-lg font-medium hover:bg-[#153a2e] disabled:opacity-50 transition-colors"
          >
            {isSubmitting ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </div>
    </div>
  );
}