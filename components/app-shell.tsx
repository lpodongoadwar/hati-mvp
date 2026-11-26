"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { Menu, X, User, Home, ShieldCheck, Scale, LogOut, TrendingUp, Trophy, Lightbulb, Star } from "lucide-react";
import { createClient } from "@/lib/db";

const logoSource = 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/file_0000000026b481f4ac4092f29fa586e7%20%281%29.png-aEG4UagFYjCgRKM7hpezKdtI5qDLCJ.jpeg';

export function AppShell({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [role, setRole] = useState("user");
  const supabase = createClient();
  const router = useRouter();
  const pathname = usePathname();

  // Fetch user role dynamically
  useEffect(() => {
    async function getRole() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase.from("profiles").select("role").eq("id", user.id).single();
        if (data) setRole(data.role);
      }
    }
    getRole();
  }, [supabase]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  // Build nav links dynamically
  const navLinks = [
    { name: "Dashboard", href: "/dashboard", icon: Home },
    { name: "Score", href: "/participate", icon: TrendingUp },
    { name: "Ambassadors Program", href: "/leaderboard", icon: Trophy },
    { name: "Ideator Pipeline", href: "/ideator", icon: Lightbulb },
    { name: "Profile", href: "/profile", icon: User },
  ];

  if (role === 'jury' || role === 'admin') {
    navLinks.push({ name: "Jury Portal", href: "/jury", icon: Star });
  }
  if (role === 'admin') {
    navLinks.push({ name: "Admin Panel", href: "/admin", icon: ShieldCheck });
  }

  // Hide the header on public/auth pages
  const isAuthPage = pathname === "/" || pathname === "/login" || pathname.startsWith("/auth");
  
  if (isAuthPage) {
    return <main className="min-h-screen bg-background text-foreground">{children}</main>;
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Top Bar */}
      <header className="sticky top-0 z-50 bg-card border-b border-border/80">
        <div className="max-w-7xl mx-auto px-5 h-16 flex items-center justify-between">
          <Link href="/dashboard" aria-label="Hati home">
            <Image
              alt="Hati"
              className="h-[40px] w-[100px] object-cover object-center mix-blend-darken"
              height={395}
              priority
              src={logoSource}
              unoptimized
              width={765}
            />
          </Link>
          
          <button onClick={() => setIsOpen(!isOpen)} className="p-2 hover:bg-muted rounded-md">
            {isOpen ? <X className="size-6" /> : <Menu className="size-6" />}
          </button>
        </div>
      </header>

      {/* Slide-out Menu */}
      {isOpen && (
        <div className="fixed inset-0 z-40 bg-black/50" onClick={() => setIsOpen(false)}>
          <div 
            className="fixed top-0 right-0 h-full w-64 bg-card border-l border-border shadow-xl p-6 space-y-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-bold text-lg">Menu</h2>
              <button onClick={() => setIsOpen(false)}><X className="size-5" /></button>
            </div>
            <nav className="space-y-2">
              {navLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-[#1b4a3a]/10 transition-colors"
                  >
                    <Icon className="size-5 text-[#1b4a3a]" />
                    <span className="font-medium">{link.name}</span>
                  </Link>
                );
              })}
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 p-3 mt-4 rounded-lg hover:bg-red-50 text-red-600 transition-colors"
              >
                <LogOut className="size-5" />
                <span className="font-medium">Log Out</span>
              </button>
            </nav>
          </div>
        </div>
      )}

      {/* Page Content */}
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
}