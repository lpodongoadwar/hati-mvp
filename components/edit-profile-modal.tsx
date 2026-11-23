"use client";

import { useState } from "react";
import { createClient } from "@/lib/db";
import { X, Mail, Phone, Lock, AlertCircle } from "lucide-react";

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
  
  // State
  const [step, setStep] = useState<"verify" | "edit">("verify");
  const [otpCode, setOtpCode] = useState("");
  const [newValue, setNewValue] = useState(currentValue || "");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  if (!isOpen || !type) return null;

  // 1. Trigger OTP to current email
  const handleSendOtp = async () => {
    setIsSubmitting(true);
    setErrorMsg("");
    
    const { data: { user } } = await supabase.auth.getUser();
    if (!user?.email) {
      setErrorMsg("No email found on account.");
      setIsSubmitting(false);
      return;
    }

    // Reauthenticate sends a 6-digit OTP to the current email
    const { error } = await supabase.auth.reauthenticate();
    
    if (error) {
      setErrorMsg(error.message);
    } else {
      setSuccessMsg(`A 6-digit code has been sent to ${user.email}.`);
    }
    setIsSubmitting(false);
  };

  // 2. Verify OTP and move to Edit step
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg("");

    const { data: { user } } = await supabase.auth.getUser();
    if (!user?.email) return;

    // Verify the OTP
    const { error } = await supabase.auth.verifyOtp({
      email: user.email,
      token: otpCode,
      type: 'reauthentication', 
    });

    if (error) {
      setErrorMsg(error.message);
    } else {
      setStep("edit");
      setSuccessMsg("Identity verified. You can now update your details.");
    }
    setIsSubmitting(false);
  };

  // 3. Save the new details
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg("");

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    let error;

    if (type === "email") {
      const res = await supabase.auth.updateUser({ email: newValue });
      error = res.error;
      if (!error) {
        alert("Confirmation email sent! Please check your inbox to verify the new email.");
      }
    } else if (type === "password") {
      const res = await supabase.auth.updateUser({ password: newValue });
      error = res.error;
      if (!error) alert("Password updated successfully!");
    } else if (type === "phone") {
      const res = await supabase.from("profiles").update({ phone: newValue }).eq("id", user.id);
      error = res.error;
      if (!error) alert("Phone number updated successfully!");
    }

    if (error) {
      setErrorMsg(error.message);
    } else {
      onSuccess();
      handleClose();
    }
    setIsSubmitting(false);
  };

  const handleClose = () => {
    setStep("verify");
    setOtpCode("");
    setNewValue(currentValue || "");
    setErrorMsg("");
    setSuccessMsg("");
    onClose();
  };

  const getIcon = () => {
    if (type === "email") return <Mail className="size-5" />;
    if (type === "phone") return <Phone className="size-5" />;
    return <Lock className="size-5" />;
  };

  const getTitle = () => {
    if (type === "email") return "Change Email Address";
    if (type === "phone") return "Change Phone Number";
    return "Change Password";
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="w-full max-w-md bg-background rounded-2xl shadow-xl overflow-hidden relative animate-in fade-in zoom-in-95 duration-200 border border-border/80">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border/80 bg-muted/30">
          <div className="flex items-center gap-2 text-[#1b4a3a] font-semibold">
            {getIcon()}
            <h2 className="text-lg">{getTitle()}</h2>
          </div>
          <button onClick={handleClose} className="p-1 text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors">
            <X className="size-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {/* Status Messages */}
          {errorMsg && (
            <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm flex items-start gap-2">
              <AlertCircle className="size-4 shrink-0 mt-0.5" />
              <p>{errorMsg}</p>
            </div>
          )}
          {successMsg && (
            <div className="p-3 bg-green-50 text-green-700 rounded-lg text-sm">
              {successMsg}
            </div>
          )}

          {/* STEP 1: VERIFY OTP */}
          {step === "verify" && (
            <div className="space-y-4">
              <p className="text-sm text-gray-600">
                To change your <strong>{type}</strong>, we need to verify your identity. We will send a 6-digit code to your current email address.
              </p>
              
              {!successMsg && (
                <button
                  onClick={handleSendOtp}
                  disabled={isSubmitting}
                  className="w-full bg-[#1b4a3a] text-white py-2.5 rounded-lg font-medium hover:bg-[#153a2e] disabled:opacity-50 transition-colors"
                >
                  {isSubmitting ? "Sending..." : "Send Verification Code"}
                </button>
              )}

              {successMsg && (
                <form onSubmit={handleVerifyOtp} className="space-y-4 pt-2">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Enter 6-digit Code</label>
                    <input
                      type="text"
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value)}
                      maxLength={6}
                      required
                      className="flex h-12 w-full text-center tracking-[0.5em] text-lg font-bold rounded-md border border-input bg-background px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1b4a3a]"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isSubmitting || otpCode.length < 6}
                    className="w-full bg-[#1b4a3a] text-white py-2.5 rounded-lg font-medium hover:bg-[#153a2e] disabled:opacity-50 transition-colors"
                  >
                    {isSubmitting ? "Verifying..." : "Verify Code"}
                  </button>
                </form>
              )}
            </div>
          )}

          {/* STEP 2: EDIT DETAILS */}
          {step === "edit" && (
            <form onSubmit={handleSave} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  {type === "email" ? "New Email" : type === "phone" ? "New Phone Number" : "New Password"}
                </label>
                <input
                  type={type === "password" ? "password" : type === "email" ? "email" : "tel"}
                  value={newValue}
                  onChange={(e) => setNewValue(e.target.value)}
                  required
                  minLength={type === "password" ? 6 : undefined}
                  className="flex h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1b4a3a]"
                  placeholder={`Enter new ${type}`}
                />
              </div>
              <button
                type="submit"
                disabled={isSubmitting || !newValue}
                className="w-full bg-[#1b4a3a] text-white py-2.5 rounded-lg font-medium hover:bg-[#153a2e] disabled:opacity-50 transition-colors"
              >
                {isSubmitting ? "Saving..." : "Save Changes"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}