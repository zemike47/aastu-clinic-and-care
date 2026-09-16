import { Link } from "react-router-dom";

function LandingHero() {
  return (
    <section className="border-b border-slate-200 bg-white">
      <div className="mx-auto max-w-6xl px-6 py-20 sm:py-28">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">
            AASTU Clinic & Care
          </p>

          <h1 className="mt-4 text-4xl font-bold tracking-tight text-slate-900 sm:text-6xl">
            A simple digital workflow for modern clinic care.
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
            Connect patients, nurses, doctors, and pharmacists through one
            secure role-based clinic platform.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/register"
              className="rounded-lg bg-slate-900 px-5 py-3 text-sm font-medium text-white hover:bg-slate-800"
            >
              Book an appointment
            </Link>

            <Link
              to="/login"
              className="rounded-lg border border-slate-300 bg-white px-5 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Staff login
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export default LandingHero;
