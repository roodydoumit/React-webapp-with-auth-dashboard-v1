import { useEffect, useMemo, useState } from 'react';
import type { DragEvent } from 'react';
import { useAuth } from '../components/AuthContext';
import type { DashboardTile } from '../types';

const statusColor: Record<DashboardTile['status'], string> = {
  active: 'bg-emerald-500',
  pending: 'bg-amber-400',
  urgent: 'bg-rose-500',
};

const menu = [
  {
    title: 'Admin Reports',
    items: ['Total Profit', 'Job Status', 'Empty Containers', 'Client Invoices', 'Ongoing Jobs'],
    roles: ['admin'],
  },
  {
    title: 'Client Reports',
    items: ['To Be Loaded', 'On Water', 'Under Clearance', 'Invoice Status'],
    roles: ['admin', 'operator', 'customer'],
  },
  {
    title: 'User Reports',
    items: ['Todo Checklist', 'To Be Loaded', 'On Water', 'Under Clearance', 'Invoice Status'],
    roles: ['admin', 'operator', 'customer'],
  },
  {
    title: 'KPI Analytics',
    items: ['Dashboard', 'Sales Report', 'Total TEU'],
    roles: ['admin', 'operator'],
  },
  {
    title: 'Settings',
    items: ['User Profile', 'Logout'],
    roles: ['admin', 'operator', 'customer'],
  },
] as const;

const initialTiles: DashboardTile[] = [
  { id: 'profit', title: 'Total Profit', section: 'admin', status: 'active', value: '$2,480,000', detail: '+12% month-over-month' },
  { id: 'job', title: 'Job Status', section: 'admin', status: 'pending', value: '74 Active', detail: '9 delayed shipments' },
  { id: 'containers', title: 'Empty Containers', section: 'admin', status: 'urgent', value: '18 units', detail: 'Need repositioning' },
  { id: 'invoices', title: 'Client Invoices', section: 'client', status: 'pending', value: '43 pending', detail: '27 paid this week' },
  { id: 'ongoing', title: 'Ongoing Jobs', section: 'admin', status: 'active', value: '86%', detail: 'Average completion rate' },
  { id: 'water', title: 'On Water', section: 'client', status: 'active', value: '31 containers', detail: 'ETA accuracy 95%' },
  { id: 'clearance', title: 'Under Clearance', section: 'user', status: 'pending', value: '12 jobs', detail: 'Avg. 2.1 days left' },
  { id: 'teu', title: 'Total TEU', section: 'kpi', status: 'active', value: '5,430', detail: 'Quarterly throughput' },
];

export const DashboardPage = () => {
  const { user, logout } = useAuth();
  const [dark, setDark] = useState(false);
  const [tiles, setTiles] = useState(initialTiles);
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState<DashboardTile | null>(null);

  useEffect(() => {
    const id = window.setInterval(() => {
      setTiles((prev) =>
        prev.map((tile) =>
          tile.id === 'profit'
            ? { ...tile, detail: `+${Math.floor(Math.random() * 15) + 5}% month-over-month (live)` }
            : tile.id === 'invoices'
              ? { ...tile, value: `${Math.floor(Math.random() * 20) + 35} pending` }
              : tile,
        ),
      );
    }, 30000);

    return () => window.clearInterval(id);
  }, []);

  const roleMenu = useMemo(
    () => menu.filter((section) => section.roles.includes((user?.role ?? 'customer') as never)),
    [user?.role],
  );

  const filteredTiles = useMemo(
    () => tiles.filter((t) => t.title.toLowerCase().includes(query.toLowerCase()) || t.detail.toLowerCase().includes(query.toLowerCase())),
    [tiles, query],
  );

  const onDragStart = (event: DragEvent<HTMLDivElement>, id: string) => {
    event.dataTransfer.setData('tileId', id);
  };

  const onDrop = (event: DragEvent<HTMLDivElement>, targetId: string) => {
    const sourceId = event.dataTransfer.getData('tileId');
    if (!sourceId || sourceId === targetId) return;
    const sourceIndex = tiles.findIndex((tile) => tile.id === sourceId);
    const targetIndex = tiles.findIndex((tile) => tile.id === targetId);
    const updated = [...tiles];
    const [moved] = updated.splice(sourceIndex, 1);
    updated.splice(targetIndex, 0, moved);
    setTiles(updated);
  };

  return (
    <div className={dark ? 'dark' : ''}>
      <main className="min-h-screen bg-slate-100 text-slate-900 dark:bg-slate-900 dark:text-slate-100">
        <div className="flex min-h-screen">
          <aside className="w-72 border-r border-slate-300 p-4 dark:border-slate-700">
            <h2 className="mb-4 text-2xl font-black text-cyan-500">XOLOG sal</h2>
            <div className="space-y-4">
              {roleMenu.map((section, idx) => (
                <div key={section.title}>
                  <h3 className={`font-bold ${idx === 0 ? 'text-lg text-cyan-500' : 'text-base'}`}>{section.title}</h3>
                  <ul className="mt-2 space-y-1 text-sm">
                    {section.items.map((item) => (
                      <li key={item} className="rounded px-2 py-1 hover:bg-slate-200 dark:hover:bg-slate-800">
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </aside>

          <section className="flex-1 p-4 lg:p-6">
            <header className="mb-5 flex flex-wrap items-center gap-3 rounded-xl bg-white p-3 shadow dark:bg-slate-800">
              <input
                className="min-w-[220px] flex-1 rounded-lg border border-slate-300 px-3 py-2 dark:border-slate-600 dark:bg-slate-900"
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search with AI assistant hints..."
                title="AI search mock: filter KPIs and contextual insights"
                value={query}
              />
              <button className="rounded bg-indigo-500 px-3 py-2 text-sm text-white" title="AI capability mock tooltip" type="button">
                Ask AI
              </button>
              <button className="rounded border px-3 py-2" onClick={() => setDark((d) => !d)} type="button">
                {dark ? 'Light' : 'Dark'}
              </button>
              <button className="rounded border px-3 py-2" title="3 unread alerts" type="button">
                🔔
              </button>
              <div className="ml-auto flex items-center gap-2 text-sm">
                <span>{user?.name}</span>
                <button className="rounded border px-3 py-2" onClick={logout} type="button">
                  Logout
                </button>
              </div>
            </header>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
              {filteredTiles.map((tile, index) => (
                <article
                  className={`rounded-xl bg-white p-4 shadow transition hover:-translate-y-0.5 dark:bg-slate-800 ${index % 5 === 0 ? 'xl:col-span-2' : ''}`}
                  draggable
                  key={tile.id}
                  onClick={() => setSelected(tile)}
                  onDragOver={(event) => event.preventDefault()}
                  onDragStart={(event) => onDragStart(event, tile.id)}
                  onDrop={(event) => onDrop(event, tile.id)}
                  title={`Click to drill down: ${tile.detail}`}
                >
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold">{tile.title}</h4>
                    <span className={`h-3 w-3 rounded-full ${statusColor[tile.status]}`} />
                  </div>
                  <p className="mt-3 text-2xl font-black">{tile.value}</p>
                  <p className="text-sm text-slate-500 dark:text-slate-300">{tile.detail}</p>
                </article>
              ))}
            </div>
          </section>
        </div>
      </main>
      {selected && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/60 p-4" onClick={() => setSelected(null)}>
          <div className="w-full max-w-md rounded-xl bg-white p-6 text-slate-800" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-xl font-bold">{selected.title}</h3>
            <p className="mt-2 text-3xl font-black">{selected.value}</p>
            <p className="mt-3 text-sm">{selected.detail}</p>
            <button className="mt-4 rounded bg-cyan-600 px-3 py-2 text-white" onClick={() => setSelected(null)} type="button">
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
