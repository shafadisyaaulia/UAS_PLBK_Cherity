import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

export default function SupabaseProfileDemo() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      setUser(data?.user || null);
      setLoading(false);
    };
    getUser();
  }, []);

  if (loading) return <div className="text-cyan-300">Loading Supabase user...</div>;
  if (!user) return <div className="text-cyan-300">Belum login ke Supabase Auth.</div>;
  return (
    <div className="p-4 border border-cyan-400 rounded-xl bg-cyan-900/30 text-cyan-100">
      <div className="font-bold mb-2">Supabase User Profile</div>
      <div>Email: {user.email}</div>
      <div>ID: {user.id}</div>
    </div>
  );
}
