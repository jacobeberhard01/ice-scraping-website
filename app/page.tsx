"use client";

import { FormEvent, useState } from "react";
import { APARTMENT_COMPLEXES } from "./apartment-complexes";
import { SERVICE_WINDOWS } from "./service-windows";

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
const ALLOWED_ZIPS = ["83440", "83441", "83460"];

type FormState = Record<string, string>;

const initialForm: FormState = {
  first_name: "", last_name: "", apartment_complex: "", street_address: "", city: "", zip_code: "", phone: "",
  car_make: "", car_model: "", car_color: "", license_plate: "", subscription_tier: "Premium", subscription_frequency: "Weekly",
};

function Field({ name, placeholder, value, onChange }: { name: string; placeholder: string; value: string; onChange: (value: string) => void }) {
  return <input name={name} placeholder={placeholder} value={value} onChange={(event) => onChange(event.target.value)} required />;
}

export default function Home() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState(initialForm);
  const [schedule, setSchedule] = useState<Record<string, string>>({});
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [complexOpen, setComplexOpen] = useState(false);
  const update = (name: string, value: string) => setForm((current) => ({ ...current, [name]: value }));
  const complexOptions = APARTMENT_COMPLEXES.filter((item) => item.name.toLowerCase().includes(form.apartment_complex.toLowerCase())).slice(0, 12);
  const selectComplex = (name: string) => { const item = APARTMENT_COMPLEXES.find((entry) => entry.name === name); update("apartment_complex", name); setComplexOpen(false); if (item) setForm((current) => ({ ...current, apartment_complex: name, street_address: item.address, city: "Rexburg", zip_code: "83440" })); };
  const goNext = () => { setMessage(""); setStep((current) => Math.min(4, current + 1)); };
  const goBack = () => { setMessage(""); setStep((current) => Math.max(1, current - 1)); };
  async function submit() {
    const selectedDays = Object.keys(schedule).filter((day) => schedule[day]);
    if (!selectedDays.length) { setMessage("Please choose at least one service day."); return; }
    if (!ALLOWED_ZIPS.includes(form.zip_code)) { setMessage("Sorry, this address is outside our current service area."); return; }
    const response = await fetch("/api/bookings", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...form, weekly_schedule: JSON.stringify(schedule), service_day: selectedDays[0], scrape_by_time: schedule[selectedDays[0]], status: "Active" }) });
    if (response.ok) setSubmitted(true); else setMessage((await response.json()).error || "Could not save booking.");
  }

  return <main className="site-shell">
    <header className="site-header"><a className="brand" href="#top">Blake <span>Scrapes</span></a><nav><a href="#services">Services</a><a href="#how-it-works">How it works</a><a className="header-cta" href="/signup">Reserve a spot</a></nav></header>
    <section className="hero" id="top"><div><p className="kicker">Winter vehicle service - Rexburg, Idaho</p><h1>Wake up to a clear windshield.</h1><p className="hero-copy">Reliable weekday morning ice and frost scraping for busy students who want less stress before class.</p><a className="primary-cta" href="/signup">Request service</a><div className="hero-meta"><span>Monday-Friday</span><span>Early morning service</span><span>Rexburg apartments</span></div></div><div className="hero-art"><span className="ice-logo">*</span><span className="hero-tag">A clearer start to your day</span></div></section>
    <section className="section white" id="services"><div className="content"><p className="kicker">Choose your service</p><h2>Clear windows, simple pricing.</h2><p className="intro">Weekday morning ice and frost scraping for Rexburg apartment communities.</p><div className="service-grid"><article><h3>Basic</h3><p>Front and back windshield cleaned.</p><strong>$5 <small>daily</small></strong><div className="service-note">Front cleaned - Back cleaned</div></article><article><h3>Premium</h3><p>Complete coverage for your vehicle.</p><strong>$7 <small>daily</small></strong><div className="service-note">Front - Back - Sides - Mirrors</div></article></div></div></section>
    <section className="section" id="how-it-works"><div className="content"><p className="kicker">Getting started</p><h2>From request to ready-for-class.</h2><p className="intro">Here is what happens after you send your service request.</p><div className="steps"><div><b>1. Request service</b><span>Share your contact, apartment, vehicle, plan, and weekday schedule.</span></div><div><b>2. Blake reviews it</b><span>Blake confirms your plan and follows up with payment details.</span></div><div><b>3. Weekday morning service</b><span>Your vehicle is cleared before your selected morning time.</span></div></div><div className="info-grid"><article><h3>Parking changes?</h3><p>Update Blake if your parking location changes before service.</p></article><article><h3>Weather can change</h3><p>Snow, sleet, or refreezing can cover glass again after it has been scraped.</p></article></div></div></section>
    <section className="final-cta"><div><h2>Ready for a less stressful morning?</h2><p>Request service for the current semester.</p></div><a className="primary-cta" href="/signup">Reserve a spot</a></section>
    <section className="booking section" id="book"><div className="content"><h2>{["Your contact information", "Tell us about your car", "Choose your service", "Review and submit"][step - 1]}</h2><div className="progress"><i style={{ width: `${step * 25}%` }} /></div>{step === 1 && <div className="form-fields"><div className="grid2"><Field name="first_name" placeholder="First name" value={form.first_name} onChange={(v) => update("first_name", v)} /><Field name="last_name" placeholder="Last name" value={form.last_name} onChange={(v) => update("last_name", v)} /></div><div className="complex-picker"><Field name="apartment_complex" placeholder="Apartment Complex" value={form.apartment_complex} onChange={(v) => { update("apartment_complex", v); setComplexOpen(true); }} />{complexOpen && <div className="complex-options"><button type="button" onClick={() => selectComplex("Other")}>Other - enter your own address</button>{complexOptions.map((item) => <button type="button" key={item.name} onClick={() => selectComplex(item.name)}>{item.name}</button>)}</div>}</div><Field name="street_address" placeholder="Street address" value={form.street_address} onChange={(v) => update("street_address", v)} /><div className="grid2"><Field name="city" placeholder="City" value={form.city} onChange={(v) => update("city", v)} /><Field name="zip_code" placeholder="ZIP code" value={form.zip_code} onChange={(v) => update("zip_code", v)} /></div><Field name="phone" placeholder="Phone number" value={form.phone} onChange={(v) => update("phone", v)} /></div>}{step === 2 && <div className="form-fields grid2"><Field name="car_make" placeholder="Car make" value={form.car_make} onChange={(v) => update("car_make", v)} /><Field name="car_model" placeholder="Car model" value={form.car_model} onChange={(v) => update("car_model", v)} /><Field name="car_color" placeholder="Car color" value={form.car_color} onChange={(v) => update("car_color", v)} /><Field name="license_plate" placeholder="License plate #" value={form.license_plate} onChange={(v) => update("license_plate", v)} /></div>}{step === 3 && <div className="form-fields"><select value={form.subscription_tier} onChange={(e) => update("subscription_tier", e.target.value)}><option>Basic</option><option>Premium</option></select><select value={form.subscription_frequency} onChange={(e) => update("subscription_frequency", e.target.value)}><option>Daily</option><option>Weekly</option><option>Monthly</option><option>Semester</option></select><div className="day-grid">{DAYS.map((day) => <label key={day}><b>{day.slice(0, 3)}</b><select value={schedule[day] || ""} onChange={(e) => setSchedule((current) => ({ ...current, [day]: e.target.value }))}><option value="">No service</option>{SERVICE_WINDOWS[day].map((time) => <option key={time}>{time}</option>)}</select></label>)}</div></div>}{step === 4 && <div className="review"><p><b>{form.first_name} {form.last_name}</b></p><p>{form.apartment_complex}<br />{form.street_address}, {form.city} {form.zip_code}</p><p>{form.car_color} {form.car_make} {form.car_model} - {form.license_plate}</p><p>{form.subscription_tier} - {form.subscription_frequency}</p>{Object.entries(schedule).map(([day, time]) => time && <p key={day}>{day}: {time}</p>)}</div>}<div className="actions">{step > 1 && <button className="secondary" type="button" onClick={goBack}>Back</button>}{step < 4 ? <button className="primary-cta" type="button" onClick={goNext}>Next</button> : <button className="primary-cta" type="button" onClick={submit}>Submit booking</button>}</div>{message && <p className="error">{message}</p>}</div></section>
    {submitted && <div className="modal-backdrop"><div className="confirmation-modal"><h2>Booking request received</h2><p>Blake will reach out with payment details and confirm when your first service will be provided.</p><button className="primary-cta" onClick={() => setSubmitted(false)}>Done</button></div></div>}
  </main>;
}
