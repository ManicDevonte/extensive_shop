import React, { useState } from "react";
import { ArrowRight, Eye, EyeOff, Leaf, LoaderCircle, LockKeyhole, Mail, UserRound } from "lucide-react";
import { signIn, signUp } from "./authApi";

export default function AuthPage({ t, mode, onAuthenticated, setPage }) {
  const isSignUp = mode === "signup";
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const update = (field) => (event) => setForm((current) => ({ ...current, [field]: event.target.value }));
  const submit = async (event) => {
    event.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const user = isSignUp ? await signUp(form) : await signIn({ email: form.email, password: form.password });
      onAuthenticated(user);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-5rem)] grid lg:grid-cols-[1.1fr_0.9fr] gap-8 items-center px-4 py-10 sm:px-8 lg:px-16">
      <section className="hidden lg:block max-w-xl">
        <p className="text-xs font-bold uppercase tracking-[0.24em] text-amber-600 mb-4">Your everyday, beautifully sorted</p>
        <h1 className="text-5xl font-black tracking-tight leading-[1.05]">Everything you love, ready when you are.</h1>
        <p className={`mt-5 max-w-md text-base leading-relaxed ${t.muted}`}>Save your favourites, track every delivery, and check out faster with one secure Extensive Assortment account.</p>
        <div className="mt-10 flex items-center gap-3 text-sm font-semibold"><span className="grid h-10 w-10 place-items-center rounded-full bg-amber-500/15 text-amber-600"><Leaf size={18} /></span> One account across fashion, tech, beauty and home.</div>
      </section>

      <section className={`w-full max-w-md mx-auto rounded-[2rem] p-6 sm:p-8 ${t.glassStrong} border ${t.shadow}`}>
        <div className="flex items-center gap-3 mb-7">
          <div className="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 shadow-lg shadow-amber-500/20"><Leaf size={20} className="text-white" /></div>
          <div><p className="text-sm font-extrabold">Extensive Assortment</p><p className={`text-xs ${t.muted}`}>{isSignUp ? "Create your account" : "Welcome back"}</p></div>
        </div>
        <h2 className="text-2xl font-extrabold tracking-tight">{isSignUp ? "Join the assortment" : "Sign in to your account"}</h2>
        <p className={`mt-2 text-sm ${t.muted}`}>{isSignUp ? "Your next great find is closer than you think." : "Pick up where you left off."}</p>

        <form onSubmit={submit} className="mt-6 space-y-4">
          {isSignUp && <label className="block"><span className="mb-1.5 block text-xs font-semibold">Full name</span><span className="relative block"><UserRound size={16} className={`absolute left-3 top-1/2 -translate-y-1/2 ${t.muted}`} /><input required value={form.name} onChange={update("name")} autoComplete="name" className={`w-full rounded-xl py-3 pl-10 pr-3 text-base sm:text-sm outline-none ${t.input}`} placeholder="Dumisani Mangqishe" /></span></label>}
          <label className="block"><span className="mb-1.5 block text-xs font-semibold">Email address</span><span className="relative block"><Mail size={16} className={`absolute left-3 top-1/2 -translate-y-1/2 ${t.muted}`} /><input required type="email" value={form.email} onChange={update("email")} autoComplete="email" className={`w-full rounded-xl py-3 pl-10 pr-3 text-base sm:text-sm outline-none ${t.input}`} placeholder="you@example.com" /></span></label>
          <label className="block"><span className="mb-1.5 block text-xs font-semibold">Password</span><span className="relative block"><LockKeyhole size={16} className={`absolute left-3 top-1/2 -translate-y-1/2 ${t.muted}`} /><input required type={showPassword ? "text" : "password"} minLength={8} value={form.password} onChange={update("password")} autoComplete={isSignUp ? "new-password" : "current-password"} className={`w-full rounded-xl py-3 pl-10 pr-11 text-base sm:text-sm outline-none ${t.input}`} placeholder="At least 8 characters" /><button type="button" onClick={() => setShowPassword((visible) => !visible)} aria-label={showPassword ? "Hide password" : "Show password"} className={`absolute right-3 top-1/2 -translate-y-1/2 ${t.muted}`}>{showPassword ? <EyeOff size={16} /> : <Eye size={16} />}</button></span></label>
          {error && <p role="alert" className="rounded-xl bg-rose-500/10 px-3 py-2.5 text-xs font-semibold text-rose-600">{error}</p>}
          <button disabled={submitting} className="flex w-full items-center justify-center gap-2 rounded-xl bg-gray-900 py-3.5 text-sm font-bold text-white shadow-lg shadow-black/20 disabled:cursor-wait disabled:opacity-60">{submitting && <LoaderCircle size={16} className="animate-spin" />}{isSignUp ? "Create account" : "Sign in"}<ArrowRight size={16} /></button>
        </form>

        <p className={`mt-6 text-center text-xs ${t.muted}`}>{isSignUp ? "Already have an account?" : "New to Extensive Assortment?"}{" "}<button onClick={() => setPage(isSignUp ? "login" : "signup")} className="font-bold text-amber-600 hover:text-amber-700">{isSignUp ? "Sign in" : "Create an account"}</button></p>
        <button onClick={() => setPage("home")} className={`mt-5 w-full text-center text-xs font-semibold ${t.muted} hover:text-amber-600`}>Continue browsing</button>
      </section>
    </div>
  );
}
