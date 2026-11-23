"use client";

import { useState } from "react";
import { Coins, Sparkles, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function SwetSimulator() {
  const [vaultBalance, setVaultBalance] = useState(0);
  const [creditScore, setCreditScore] = useState(350);
  const [selectedAmount, setSelectedAmount] = useState(500);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const amounts = [100, 500, 1000, 5000];

  const handleSimulate = () => {
    // 1. Update vault balance
    const newBalance = vaultBalance + selectedAmount;
    setVaultBalance(newBalance);

    // 2. Increase score by a random amount between 5 and 15
    const scoreIncrease = Math.floor(Math.random() * 11) + 5;
    const newScore = creditScore + scoreIncrease;
    setCreditScore(newScore);

    // 3. Trigger Toast Notification
    setToastMessage(`Success! You saved UGX ${selectedAmount.toLocaleString()}. Your score jumped to ${newScore}!`);

    // Clear toast after 4 seconds
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  return (
    <Card className="h-full flex flex-col bg-[#fcfaf6] border-[#e5e1d8] shadow-sm rounded-[26px] overflow-hidden relative">
      
      {/* Custom Toast Notification */}
      {toastMessage && (
        <div className="absolute top-4 left-4 right-4 z-50 bg-[#1b4a3a] text-white p-3 rounded-xl shadow-lg flex items-start gap-2 animate-in fade-in slide-in-from-top-4 duration-300">
          <Sparkles className="size-5 shrink-0 text-[#c4f080]" />
          <p className="text-sm font-medium">{toastMessage}</p>
        </div>
      )}

      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-semibold tracking-[-0.04em] flex items-center gap-2 text-[#1b4a3a]">
          <Coins className="size-6" />
          SWET Simulator
        </CardTitle>
        <p className="text-sm text-muted-foreground">Learn how saving builds your credit.</p>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col justify-between space-y-6 pt-4">
        
        {/* Simulated Vault Visual */}
        <div className="bg-[#1b4a3a] p-6 rounded-2xl text-white text-center shadow-inner relative overflow-hidden">
          <div className="absolute top-0 right-0 p-3 opacity-10">
            <TrendingUp className="size-24" />
          </div>
          <p className="text-xs font-medium uppercase tracking-widest text-[#c4f080] mb-1">Simulated Vault</p>
          <h3 className="text-3xl font-bold">UGX {vaultBalance.toLocaleString()}</h3>
          <div className="mt-3 inline-flex items-center gap-1 bg-white/10 px-3 py-1 rounded-full text-xs">
            <span>Simulated Score: {creditScore}</span>
          </div>
        </div>

        {/* Amount Selector */}
        <div className="space-y-3">
          <p className="text-sm font-medium text-gray-700">Select Transaction Amount:</p>
          <div className="grid grid-cols-4 gap-2">
            {amounts.map((amt) => (
              <button
                key={amt}
                onClick={() => setSelectedAmount(amt)}
                className={`py-2 text-xs font-semibold rounded-lg border transition-all ${
                  selectedAmount === amt
                    ? "bg-[#1b4a3a] text-white border-[#1b4a3a] shadow-md scale-105"
                    : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
                }`}
              >
                {amt}
              </button>
            ))}
          </div>
        </div>

        <Button 
          onClick={handleSimulate}
          className="w-full bg-[#1b4a3a] hover:bg-[#153a2e] text-white h-12 rounded-xl text-sm font-semibold transition-all active:scale-95"
        >
          Simulate Transaction & Save
        </Button>

      </CardContent>

      <CardFooter className="pt-2 pb-4">
        <p className="text-[10px] text-center w-full text-gray-400">
          This is a simulation. No real money is involved.
        </p>
      </CardFooter>
    </Card>
  );
}