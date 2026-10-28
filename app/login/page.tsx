"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    const result = await response.json();
    setLoading(false);
    if (!response.ok) {
      setError(result.error || "Unable to log in.");
      return;
    }
    router.push("/internal");
  }

  return <main className="login-page"><section className="login-card"><p className="kicker">Blake Scrapes internal access</p><h1>Log in</h1><form onSubmit={submit}><label>Username<input value={username} onChange={event => setUsername(event.target.value)} autoComplete="username" required /></label><label>Password<input type="password" value={password} onChange={event => setPassword(event.target.value)} autoComplete="current-password" required /></label><button className="primary-cta" disabled={loading}>{loading ? "Logging in…" : "Log in"}</button></form>{error && <p className="error">{error}</p>}</section></main>;
}
