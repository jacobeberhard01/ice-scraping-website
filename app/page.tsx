"use client";
import { FormEvent, useState } from "react";

export default function Home() {
  const [status, setStatus] = useState("");
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setStatus("Submitting…");
    const form = new FormData(event.currentTarget);
    const response = await fetch("/api/bookings", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(Object.fromEntries(form)) });
    setStatus(response.ok ? "Thanks! We’ll be in touch shortly." : "Something went wrong. Please try again.");
    if (response.ok) event.currentTarget.reset();
  }
  return <main><nav><strong>❄ Blake Scrapes</strong><a href="#book">Book now</a></nav><section className="hero"><div><p className="eyebrow">WINTER VEHICLE SERVICE</p><h1>Wake up to a clear windshield.</h1><p className="lead">Reliable morning snow and ice scraping for busy people who want to start their day on time.</p><a className="button" href="#book">Reserve a spot</a></div><div className="ice">❄</div></section><section className="features"><article><span>01</span><h2>Early arrival</h2><p>Your car is ready before you need to leave.</p></article><article><span>02</span><h2>Simple booking</h2><p>Tell us where you park and we’ll handle the rest.</p></article><article><span>03</span><h2>Local service</h2><p>Friendly, dependable help from Blake.</p></article></section><section id="book" className="booking"><div><p className="eyebrow">GET STARTED</p><h2>Book your morning scrape</h2><p>Leave your details and we’ll confirm availability and pricing.</p></div><form onSubmit={submit}><input name="name" placeholder="Your name" required /><input name="phone" type="tel" placeholder="Phone number" required /><input name="address" placeholder="Parking address" required /><input name="preferred_time" placeholder="Preferred time (e.g. 6:30 AM)" /><textarea name="notes" placeholder="Anything we should know?" rows={4} /><button className="button" type="submit">Request booking</button>{status && <p aria-live="polite">{status}</p>}</form></section><footer>© {new Date().getFullYear()} Blake Scrapes</footer></main>;
}
