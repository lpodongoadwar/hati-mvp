"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/db";
import { Users, CheckCircle2 } from "lucide-react";

const TEAMS = [
  { id: 'red', name: 'Makerere University', color: 'bg-red-600' },
  { id: 'yellow', name: 'Victoria University', color: 'bg-yellow-400' },
  { id: 'blue', name: 'MUBS', color: 'bg-blue-600' },
  { id: 'green', name: 'KIU', color: 'bg-green-600' },
  { id: 'orange', name: 'KYU', color: 'bg-orange-500' },
  { id: 'purple', name: 'IUEA', color: 'bg-purple-600' },
];

export function TeamSelector() {
  const supabase = createClient();
  const [currentTeam, setCurrentTeam] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    async function fetchTeam() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase.from('profiles').select('team').eq('id', user.id).single();
        setCurrentTeam(data?.team || null);
      }
      setLoading(false);
    }
    fetchTeam();
  }, [supabase]);

  const handleJoinTeam = async (teamId: string) => {
    setUpdating(true);
    const { data: { user } } = await supabase.auth.getUser();
    
    if (user) {
      const { error } = await supabase
        .from('profiles')
        .update({ team: teamId })
        .eq('id', user.id);
        
      if (!error) {
        setCurrentTeam(teamId);
      } else {
        alert("Failed to join team: " + error.message);
      }
    }
    setUpdating(false);
  };

  if (loading) return <div className="text-sm text-gray-500">Loading team status...</div>;

  return (
    <div className="bg-card border border-border/80 rounded-2xl p-6 shadow-sm space-y-4">
      <div className="flex items-center gap-3 border-b border-border/80 pb-4">
        <Users className="size-6 text-[#1b4a3a]" />
        <div>
          <h2 className="text-xl font-semibold text-foreground">Campus Blitz Team Selection</h2>
          <p className="text-sm text-muted-foreground">Join a university team to compete for the prize pool.</p>
        </div>
      </div>

      {currentTeam && currentTeam !== 'individual' ? (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-3">
          <CheckCircle2 className="size-6 text-green-600" />
          <div>
            <p className="font-semibold text-green-900">You have joined a team!</p>
            <p className="text-sm text-green-700 capitalize">Team {currentTeam}</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {TEAMS.map((team) => (
            <button
              key={team.id}
              onClick={() => handleJoinTeam(team.id)}
              disabled={updating}
              className="flex items-center gap-3 p-3 rounded-lg border border-border hover:border-[#1b4a3a] transition-colors text-left disabled:opacity-50"
            >
              <div className={`size-4 rounded-full ${team.color}`} />
              <span className="font-medium text-sm">{team.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}