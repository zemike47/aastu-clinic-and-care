import { useState } from "react";

import { getCurrentUser } from "../services/auth.service";
import LogoutButton from "../components/LogoutButton";
import CreateStaffForm from "../components/CreateStaffForm";

function AdminDashboard() {
  const user = getCurrentUser();

  const [createdCount, setCreatedCount] = useState(0);

  return (
    <main className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div>
            <h1 className="text-xl font-bold text-slate-900">
              AASTU Clinic & Care
            </h1>

            <p className="text-sm text-slate-500">Admin Dashboard</p>
          </div>

          <LogoutButton />
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-6 py-8">
        <section>
          <h2 className="text-2xl font-bold text-slate-900">
            Welcome, {user?.name}
          </h2>

          <p className="mt-1 text-slate-500">Manage clinic staff accounts.</p>
        </section>

        <section className="mt-8 max-w-2xl">
          <CreateStaffForm
            onCreated={() => setCreatedCount((count) => count + 1)}
          />
        </section>

        {createdCount > 0 && (
          <p className="mt-4 text-sm text-slate-500">
            {createdCount} staff account
            {createdCount === 1 ? "" : "s"} created during this session.
          </p>
        )}
      </div>
    </main>
  );
}

export default AdminDashboard;
