import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import InternalDashboard from "./InternalDashboard";

export default async function InternalPage() {
  const cookieStore = await cookies();
  if (cookieStore.get("blake_internal_session")?.value !== process.env.INTERNAL_SESSION_TOKEN) redirect("/login");
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return <main className="internal-page"><section className="signup-card"><h1>Dashboard unavailable</h1><p>Supabase is not configured.</p></section></main>;
  const supabase = createClient(url, key, { auth: { persistSession: false } });
  const { data, error } = await supabase.from("bookings").select("*").order("created_at", { ascending: false }).limit(1000);
  if (error) return <main className="internal-page"><section className="signup-card"><h1>Dashboard unavailable</h1><p>{error.message}</p></section></main>;
  return <InternalDashboard bookings={data || []} />;
}
