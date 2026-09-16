const roles = [
  {
    title: "Patients",
    description:
      "Book appointments, track their status, and view clinical notes and prescriptions.",
  },
  {
    title: "Nurses",
    description:
      "Review patients waiting for assessment and record nursing notes.",
  },
  {
    title: "Doctors",
    description:
      "Review nurse assessments and document clinical consultations.",
  },
  {
    title: "Pharmacists",
    description:
      "Review prescriptions, check inventory, and dispense medicines.",
  },
];

function RoleFeatures() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-16">
      <div className="max-w-2xl">
        <h2 className="text-2xl font-bold text-slate-900">
          One workflow, different responsibilities
        </h2>

        <p className="mt-2 text-slate-500">
          Each role gets access to the part of the clinic workflow they are
          responsible for.
        </p>
      </div>

      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {roles.map((role) => (
          <article
            key={role.title}
            className="rounded-lg bg-white p-6 shadow-sm"
          >
            <h3 className="font-semibold text-slate-900">{role.title}</h3>

            <p className="mt-3 text-sm leading-6 text-slate-600">
              {role.description}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}

export default RoleFeatures;
