"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  BarChart3,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  Users,
} from "lucide-react";

import { createClient } from "@/lib/supabase/client";

export default function LoginForm() {
  const router = useRouter();
  const supabase = createClient();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    router.replace("/dashboard");
    router.refresh();
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-zinc-950 text-white">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute left-[-120px] top-[-120px] h-96 w-96 rounded-full bg-violet-500/10 blur-3xl" />

        <div className="absolute bottom-[-150px] right-[-100px] h-[420px] w-[420px] rounded-full bg-blue-500/10 blur-3xl" />

        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:42px_42px]" />
      </div>

      {/* Main */}
      <div className="relative z-10 mx-auto flex min-h-screen max-w-7xl items-center px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid w-full overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] shadow-2xl shadow-black/40 backdrop-blur-xl lg:grid-cols-2">
          {/* Left Side */}
          <div className="hidden min-h-[650px] flex-col justify-between border-r border-white/10 p-10 lg:flex xl:p-14">
            {/* Logo */}
            <div>
              <div className="inline-flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-zinc-950">
                  <BarChart3 className="h-5 w-5" />
                </div>

                <div>
                  <p className="text-lg font-semibold tracking-tight">
                    FlowCRM
                  </p>

                  <p className="text-xs text-zinc-500">
                    Sales workspace
                  </p>
                </div>
              </div>
            </div>

            {/* Hero */}
            <div className="max-w-xl">
              <p className="mb-4 text-sm font-medium uppercase tracking-[0.2em] text-violet-300">
                Your sales workspace
              </p>

              <h1 className="text-5xl font-semibold leading-tight tracking-tight xl:text-6xl">
                Keep every deal
                <span className="block text-zinc-500">
                  moving forward.
                </span>
              </h1>

              <p className="mt-6 max-w-lg text-base leading-7 text-zinc-400">
                Manage contacts, track opportunities, monitor pipeline value,
                and keep every customer interaction organized in one place.
              </p>

              {/* Feature Cards */}
              <div className="mt-10 grid grid-cols-2 gap-4">
                <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
                  <Users className="mb-4 h-5 w-5 text-violet-300" />

                  <p className="font-medium">
                    Contacts
                  </p>

                  <p className="mt-1 text-sm text-zinc-500">
                    Keep your customer relationships organized.
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
                  <BarChart3 className="mb-4 h-5 w-5 text-blue-300" />

                  <p className="font-medium">
                    Pipeline
                  </p>

                  <p className="mt-1 text-sm text-zinc-500">
                    Move deals through every stage with clarity.
                  </p>
                </div>
              </div>
            </div>

            {/* Footer */}
            <p className="text-xs text-zinc-600">
              FlowCRM Mini · Full-stack CRM
            </p>
          </div>

          {/* Right Side */}
          <div className="flex min-h-[650px] items-center justify-center p-6 sm:p-10 lg:p-14">
            <div className="w-full max-w-md">
              {/* Mobile Logo */}
              <div className="mb-9 lg:hidden">
                <div className="inline-flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-zinc-950">
                    <BarChart3 className="h-5 w-5" />
                  </div>

                  <div>
                    <p className="font-semibold">
                      FlowCRM
                    </p>

                    <p className="text-xs text-zinc-500">
                      Sales workspace
                    </p>
                  </div>
                </div>
              </div>

              {/* Login Heading */}
              <div className="mb-8">
                <p className="text-sm font-medium text-violet-300">
                  Welcome back
                </p>

                <h2 className="mt-2 text-3xl font-semibold tracking-tight">
                  Sign in to FlowCRM
                </h2>

                <p className="mt-3 text-sm leading-6 text-zinc-500">
                  Enter your account credentials to access your dashboard.
                </p>
              </div>

              {/* Form */}
              <form
                onSubmit={handleLogin}
                className="space-y-5"
              >
                {/* Email */}
                <div>
                  <label
                    htmlFor="email"
                    className="mb-2 block text-sm font-medium text-zinc-300"
                  >
                    Email address
                  </label>

                  <div className="relative">
                    <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />

                    <input
                      id="email"
                      type="email"
                      autoComplete="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      placeholder="you@example.com"
                      className="h-12 w-full rounded-xl border border-white/10 bg-zinc-950/70 pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-violet-400/50 focus:ring-4 focus:ring-violet-500/10"
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label
                    htmlFor="password"
                    className="mb-2 block text-sm font-medium text-zinc-300"
                  >
                    Password
                  </label>

                  <div className="relative">
                    <LockKeyhole className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />

                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="current-password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      placeholder="Enter your password"
                      className="h-12 w-full rounded-xl border border-white/10 bg-zinc-950/70 pl-11 pr-12 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-violet-400/50 focus:ring-4 focus:ring-violet-500/10"
                    />

                    {/* Show / Hide Password */}
                    <button
                      type="button"
                      onClick={() =>
                        setShowPassword((current) => !current)
                      }
                      aria-label={
                        showPassword
                          ? "Hide password"
                          : "Show password"
                      }
                      title={
                        showPassword
                          ? "Hide password"
                          : "Show password"
                      }
                      className="absolute right-4 top-1/2 flex -translate-y-1/2 items-center justify-center text-zinc-500 transition hover:text-zinc-300 focus:outline-none"
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Error */}
                {error && (
                  <div
                    role="alert"
                    className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300"
                  >
                    {error}
                  </div>
                )}

                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading}
                  className="group flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-white px-4 text-sm font-semibold text-zinc-950 transition hover:bg-zinc-200 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? (
                    "Signing in..."
                  ) : (
                    <>
                      Sign in

                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </>
                  )}
                </button>
              </form>

              {/* Footer */}
              <div className="mt-8 border-t border-white/10 pt-6">
                <p className="text-center text-xs leading-5 text-zinc-600">
                  Secure authentication powered by Supabase.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}