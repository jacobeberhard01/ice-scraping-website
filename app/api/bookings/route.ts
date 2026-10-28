import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { SERVICE_WINDOWS } from "../../service-windows";
const SERVICE_ZIPS = new Set(["83440", "83441", "83460"]);
function authorized(request: Request) { return request.headers.get("cookie")?.split(";").map((item) => item.trim()).some((item) => item === `blake_internal_session=${process.env.INTERNAL_SESSION_TOKEN}`); }
export async function PATCH(request: Request) {
  if (!authorized(request)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id, payment_status } = await request.json();
  if (!Number.isInteger(Number(id)) || !["Paid", "Unpaid"].includes(payment_status)) return NextResponse.json({ error: "Invalid payment update." }, { status: 400 });
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL; const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return NextResponse.json({ error: "Supabase is not configured" }, { status: 503 });
  const supabase = createClient(url, key, { auth: { persistSession: false } });
  const { error } = await supabase.from("bookings").update({ payment_status }).eq("id", Number(id));
  if (error) return NextResponse.json({ error: "Could not update payment status." }, { status: 500 });
  return NextResponse.json({ ok: true });
}
export async function POST(request: Request) {
  const body = await request.json(); const zip = String(body.zip_code || "").trim(); const day = String(body.service_day || ""); const time = String(body.scrape_by_time || "");
  const phone = String(body.phone || "").replace(/\D/g, "");
  if (!body.first_name || !body.last_name || !body.street_address || !body.city || !zip || !body.phone || !body.car_make || !body.car_model || !body.car_color || !body.license_plate || !body.license_state || !day || !time || !body.subscription_tier || !body.subscription_frequency || !body.payment_option) return NextResponse.json({ error: "Please complete all required fields." }, { status: 400 });
  if (phone.length !== 10) return NextResponse.json({ error: "Please enter a valid 10-digit phone number." }, { status: 422 });
  if (!SERVICE_ZIPS.has(zip)) return NextResponse.json({ error: "Sorry, this address is outside our current service area." }, { status: 422 });
  if (!SERVICE_WINDOWS[day]?.includes(time)) return NextResponse.json({ error: "That service time is not available for the selected day." }, { status: 422 });
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL; const key = process.env.SUPABASE_SERVICE_ROLE_KEY; if (!url || !key) return NextResponse.json({ error: "Supabase is not configured" }, { status: 503 });
  const supabase = createClient(url, key, { auth: { persistSession: false } }); const address = `${body.street_address}, ${body.city}, ${zip}`; let weeklySchedule: Record<string, string>;
  try { weeklySchedule = JSON.parse(String(body.weekly_schedule || "{}")); } catch { return NextResponse.json({ error: "Invalid weekly schedule." }, { status: 400 }); }
  for (const [selectedDay, selectedTime] of Object.entries(weeklySchedule)) if (!SERVICE_WINDOWS[selectedDay]?.includes(selectedTime)) return NextResponse.json({ error: "One of the selected service times is not available." }, { status: 422 });
  const formattedPhone = `(${phone.slice(0, 3)}) ${phone.slice(3, 6)}-${phone.slice(6)}`;
  const { error } = await supabase.from("bookings").insert({ first_name: body.first_name, last_name: body.last_name, street_address: address, apartment_complex: body.apartment_complex || null, phone: formattedPhone, car_make: body.car_make, car_model: body.car_model, car_color: body.car_color, license_plate: body.license_plate, license_state: body.license_state, service_day: day, scrape_by_time: time, weekly_schedule: weeklySchedule, subscription_tier: body.subscription_tier, subscription_frequency: body.subscription_frequency, status: "Active", payment_option: body.payment_option, payment_status: "Unpaid", notes: body.notes || null });
  if (error) return NextResponse.json({ error: "Could not save booking" }, { status: 500 }); return NextResponse.json({ ok: true });
}
