import { readData } from '@/lib/db';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default function DashboardPage() {
  const messages = readData<Array<{ id: string; read: boolean }>>('messages.json');
  const unread = messages.filter((m) => !m.read).length;

  const cards = [
    { title: 'Home Page', desc: 'Edit hero, stats, skills & projects', href: '/dashboard/home', icon: '🏠', color: 'blue' },
    { title: 'About Page', desc: 'Edit bio, expertise & timeline', href: '/dashboard/about', icon: '👤', color: 'purple' },
    { title: 'Services Page', desc: 'Edit services, prices & process', href: '/dashboard/services', icon: '⚙️', color: 'green' },
    { title: 'Contact Page', desc: 'Edit contact information', href: '/dashboard/contact', icon: '📞', color: 'orange' },
    { title: 'Messages', desc: `${unread} unread message${unread !== 1 ? 's' : ''}`, href: '/dashboard/messages', icon: '💬', color: 'pink' },
  ];

  const colorMap: Record<string, string> = {
    blue: 'bg-blue-600/20 border-blue-500/30 text-blue-400',
    purple: 'bg-purple-600/20 border-purple-500/30 text-purple-400',
    green: 'bg-green-600/20 border-green-500/30 text-green-400',
    orange: 'bg-orange-600/20 border-orange-500/30 text-orange-400',
    pink: 'bg-pink-600/20 border-pink-500/30 text-pink-400',
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-1">Dashboard Overview</h1>
        <p className="text-slate-400 text-sm">Manage your portfolio content from here.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="glass rounded-xl p-4">
          <p className="text-slate-400 text-xs mb-1">Total Pages</p>
          <p className="text-white text-2xl font-bold">4</p>
        </div>
        <div className="glass rounded-xl p-4">
          <p className="text-slate-400 text-xs mb-1">Total Messages</p>
          <p className="text-white text-2xl font-bold">{messages.length}</p>
        </div>
        <div className="glass rounded-xl p-4">
          <p className="text-slate-400 text-xs mb-1">Unread</p>
          <p className="text-pink-400 text-2xl font-bold">{unread}</p>
        </div>
        <div className="glass rounded-xl p-4">
          <p className="text-slate-400 text-xs mb-1">Status</p>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <p className="text-green-400 text-sm font-medium">Live</p>
          </div>
        </div>
      </div>

      {/* Page Cards */}
      <h2 className="text-lg font-semibold text-white mb-4">Manage Pages</h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map((card) => (
          <Link
            key={card.href}
            href={card.href}
            className="glass rounded-2xl p-6 hover:border-slate-600 transition-all duration-200 hover:-translate-y-0.5 group"
          >
            <div
              className={`w-12 h-12 border rounded-xl flex items-center justify-center text-xl mb-4 ${colorMap[card.color]}`}
            >
              {card.icon}
            </div>
            <h3 className="text-white font-semibold mb-1 group-hover:text-blue-400 transition-colors">
              {card.title}
            </h3>
            <p className="text-slate-400 text-sm">{card.desc}</p>
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="mt-8">
        <h2 className="text-lg font-semibold text-white mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-4">
          <Link
            href="/"
            target="_blank"
            className="px-4 py-2 glass rounded-xl text-sm text-slate-300 hover:text-white hover:border-slate-600 transition-all"
          >
            🌐 View Live Site
          </Link>
          <Link
            href="/dashboard/messages"
            className="px-4 py-2 glass rounded-xl text-sm text-slate-300 hover:text-white hover:border-slate-600 transition-all"
          >
            💬 Check Messages ({unread} new)
          </Link>
        </div>
      </div>
    </div>
  );
}
