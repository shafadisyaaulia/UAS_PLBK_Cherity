import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

const GURU_EMAIL = 'guru@demo.com';
const SISWA_EMAIL = 'siswa@demo.com';
const DEMO_PASSWORD = 'demopassword';

export default function SupabaseAuthDemo() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUser = async () => {
    const { data } = await supabase.auth.getUser();
    setUser(data.user || null);
  };

  const login = async (role: 'guru' | 'siswa') => {
    setLoading(true);
    setError(null);
    const email = role === 'guru' ? GURU_EMAIL : SISWA_EMAIL;
    const { error } = await supabase.auth.signInWithPassword({ email, password: DEMO_PASSWORD });
    if (error) setError(error.message);
    await fetchUser();
    setLoading(false);
  };

  const logout = async () => {
    setLoading(true);
    await supabase.auth.signOut();
    setUser(null);
    setLoading(false);
  };

  // Fetch user on mount
  if (user === null && typeof window !== 'undefined') fetchUser();

  return (
    <div className="p-4 border border-cyan-400 rounded-xl bg-cyan-900/30 text-cyan-100 mt-4">
      <div className="font-bold mb-2">Demo Login Supabase Auth</div>
      {user ? (
        <>
          <div className="mb-2">Login sebagai: <span className="font-semibold">{user.email}</span></div>
          <button onClick={logout} className="px-4 py-2 bg-cyan-600 rounded hover:bg-cyan-700 transition">Logout</button>
        </>
      ) : (
        <>
          <div className="mb-2">Status: <span className="font-semibold">Guest (belum login)</span></div>
          <div className="flex gap-2">
            <button onClick={() => login('guru')} className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-700 transition">Login Guru</button>
            <button onClick={() => login('siswa')} className="px-4 py-2 bg-green-600 rounded hover:bg-green-700 transition">Login Siswa</button>
          </div>
        </>
      )}
      {loading && <div className="text-cyan-300 mt-2">Loading...</div>}
      {error && <div className="text-red-400 mt-2">{error}</div>}
      <div className="text-xs text-cyan-300/60 mt-2">Email demo: guru@demo.com / siswa@demo.com<br/>Password: demopassword</div>
    </div>
  );
}
