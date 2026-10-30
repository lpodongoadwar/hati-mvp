"use client"; // Ensure this line exists at the top of the file to enable client-side rendering
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
export default function LoginPage() {
  const [phone, setPhone] = useState("");
const router = useRouter(); // Correct: Inside the function component body
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    // TODO: Connect to Supabase auth here later. For now, let's simulate a successful login and redirect to the dashboard.
    router.push("/dashboard");
    // We will connect this to Supabase auth later
    alert("Login logic coming soon for: " + phone);
  };

  return (
    <main className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-md space-y-6">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-semibold tracking-tight">Welcome back to Hati</h1>
          <p className="text-muted-foreground">Log in to check your score and referrals.</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Phone Number</label>
            <input 
              type="text" 
              placeholder="+256 700 000 000" 
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2 mt-4">
  <label className="text-sm font-medium">Password</label>
  <input 
    type="password" 
    placeholder="Enter your password" 
    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" 
  />
</div>
          <button 
            type="submit" 
            className="w-full bg-[#1b4a3a] text-white hover:bg-[#153a2e] h-10 px-4 py-2 rounded-md font-medium"
          >
            Log In
          </button>
        </form>

        <div className="text-center text-sm">
          <p className="text-muted-foreground">
            Don't have an account?{" "}
            <Link href="/" className="font-semibold underline text-[#1b4a3a]">
              Sign up here
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}