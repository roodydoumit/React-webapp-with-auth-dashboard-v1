import { Link } from 'react-router-dom';

export const LandingPage = () => {
  return (
    <main className="min-h-screen bg-gradient-to-b from-sky-950 via-slate-900 to-slate-950 text-white">
      <section className="mx-auto max-w-7xl px-6 py-16 lg:px-10">
        <nav className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-wide text-cyan-300">XOLOG sal</h1>
          <Link className="rounded-lg bg-cyan-400 px-5 py-2 font-semibold text-slate-900 hover:bg-cyan-300" to="/login">
            Secure Login
          </Link>
        </nav>

        <div className="mt-20 grid gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="text-cyan-300">Global Freight Forwarding Excellence</p>
            <h2 className="mt-4 text-5xl font-black leading-tight">Move cargo smarter with XOLOG visibility.</h2>
            <p className="mt-6 max-w-xl text-slate-200">
              Inspired by xolog.com, this modern logistics portal gives customers, operators, and admins one secure home for shipment
              operations, invoice control, and KPI analytics.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {['Ocean Freight', 'Air Freight', 'Customs Clearance', 'Last-Mile Coordination'].map((item) => (
              <div key={item} className="rounded-xl border border-cyan-800 bg-slate-800/60 p-5 shadow-lg shadow-cyan-900/20">
                <h3 className="font-bold text-cyan-200">{item}</h3>
                <p className="mt-2 text-sm text-slate-300">Real-time updates and reliable execution for mission-critical cargo.</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
};
