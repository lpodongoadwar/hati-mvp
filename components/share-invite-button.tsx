"use client";

import { useState } from "react";

type Props = {
  /** Path the invite link points to, e.g. "/mobiliser/signup?ref=USER_ID" */
  invitePath: string;
};

export function ShareInviteButton({ invitePath }: Props) {
  const [label, setLabel] = useState("🔗 Share Invite Link");

  async function handleClick() {
    const url = `${window.location.origin}${invitePath}`;

    try {
      if (navigator.share) {
        await navigator.share({
          title: "Join Hati Campus Blitz",
          text: "Join my team on Hati Campus Blitz!",
          url,
        });
        return;
      }
      await navigator.clipboard.writeText(url);
      setLabel("✅ Link copied");
    } catch {
      // Share sheet dismissed or clipboard blocked: show the link as a last resort.
      window.prompt("Copy your invite link:", url);
    }

    setTimeout(() => setLabel("🔗 Share Invite Link"), 2000);
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className="flex flex-1 items-center justify-center gap-2 rounded-md bg-[#1b4a3a] px-4 py-2 text-sm font-medium text-white hover:bg-[#153a2e]"
    >
      {label}
    </button>
  );
}
