"use client";

import { useEffect } from "react";
import { Crisp } from "crisp-sdk-web";
import { createClient } from "@/lib/supabase";

export function CrispChat() {
  const supabase = createClient();

  useEffect(() => {
    // 1. Initialize Crisp with your Website ID
    // You will get this ID from your Crisp Dashboard > Settings > Website Settings
    Crisp.configure("YOUR_CRISP_WEBSITE_ID_HERE");
    Crisp.chat.hide();

    // 2. Identify the user (so you don't have to ask "Who am I speaking to?")
    const setUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        // If they are logged in, pass their details to Crisp
        Crisp.user.setEmail(user.email || "");
        Crisp.user.setNickname(user.user_metadata?.full_name || "Hati User");
      }
    };

    setUser();
  }, [supabase]);

  return null; // This component doesn't render any visible UI itself
}