import { useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";

import { login } from "../services/auth.service";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    setError("");

    try {
      const response = await login({
        email,
        password,
      });

      switch (response.user.role) {
        case "PATIENT":
          navigate("/patient");
          break;

        case "NURSE":
          navigate("/nurse");
          break;

        case "DOCTOR":
          navigate("/doctor");
          break;

        case "PHARMACIST":
          navigate("/pharmacist");
          break;

        case "ADMIN":
          navigate("/admin");
          break;

        default:
          setError("Unknown user role");
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : "Login failed");
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      {" "}
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md rounded-xl bg-white p-8 shadow-sm"
      >
        {" "}
        <h1 className="text-2xl font-bold text-slate-900">
          AASTU Clinic & Care{" "}
        </h1>
        <p className="mt-2 text-sm text-slate-500">Sign in to your account</p>
        {error && (
          <div className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">
            {error}
          </div>
        )}
        <div className="mt-6">
          <label className="mb-2 block text-sm font-medium">Email</label>

          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-slate-500"
            placeholder="you@example.com"
            required
          />
        </div>
        <div className="mt-4">
          <label className="mb-2 block text-sm font-medium">Password</label>

          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-slate-500"
            placeholder="••••••••"
            required
          />
        </div>
        <button
          type="submit"
          className="mt-6 w-full rounded-lg bg-slate-900 px-4 py-2.5 font-medium text-white hover:bg-slate-800"
        >
          Sign in
        </button>
        <button
          type="button"
          onClick={() => navigate("/register")}
          className="mt-3 w-full text-sm text-slate-600 hover:text-slate-900"
        >
          Create a patient account
        </button>
      </form>
    </main>
  );
}

export default Login;
