'use client';

import { useState, useEffect } from 'react';

interface Message {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: string;
  read: boolean;
  readAt?: string;
  status: string;
}

type Tab = 'inbox' | 'archive' | 'trash';

const STATUS_STYLES: Record<string, string> = {
  processing: 'bg-amber-500/20 text-amber-400 border-amber-500',
  completed: 'bg-green-500/20 text-green-400 border-green-500',
};

const STATUS_OUTLINE: Record<string, string> = {
  processing: 'border-amber-500/40 text-amber-400 hover:bg-amber-500/10',
  completed: 'border-green-500/40 text-green-400 hover:bg-green-500/10',
};

export default function DashboardMessagesPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Message | null>(null);
  const [tab, setTab] = useState<Tab>('inbox');

  useEffect(() => {
    fetch('/api/messages')
      .then((r) => r.ok ? r.json() : [])
      .then((data) => { setMessages(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const patch = async (id: string, action: string) => {
    await fetch('/api/messages', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, action }),
    });
  };

  const markRead = async (id: string) => {
    await patch(id, 'read');
    const readAt = new Date().toISOString();
    setMessages((prev) =>
      prev.map((m) => m.id === id ? { ...m, read: true, readAt: m.readAt ?? readAt } : m)
    );
    setSelected((prev) =>
      prev?.id === id ? { ...prev, read: true, readAt: prev.readAt ?? readAt } : prev
    );
  };

  const updateStatus = async (id: string, action: string) => {
    await patch(id, action);
    setMessages((prev) => prev.map((m) => m.id === id ? { ...m, status: action } : m));
    setSelected((prev) => prev?.id === id ? { ...prev, status: action } : prev);
  };

  const moveToTrash = async (id: string) => {
    await patch(id, 'trashed');
    setMessages((prev) => prev.map((m) => m.id === id ? { ...m, status: 'trashed' } : m));
    setSelected(null);
  };

  const restoreMessage = async (id: string) => {
    await patch(id, 'restored');
    setMessages((prev) => prev.map((m) => m.id === id ? { ...m, status: 'unread' } : m));
    setSelected(null);
  };

  const permanentDelete = async (id: string) => {
    await fetch('/api/messages', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    setMessages((prev) => prev.filter((m) => m.id !== id));
    setSelected(null);
  };

  const handleSelect = (msg: Message) => {
    setSelected(msg);
    if (!msg.read) markRead(msg.id);
  };

  const switchTab = (t: Tab) => { setTab(t); setSelected(null); };

  const inboxMessages   = messages.filter((m) => m.status !== 'archived' && m.status !== 'trashed');
  const archiveMessages = messages.filter((m) => m.status === 'archived');
  const trashMessages   = messages.filter((m) => m.status === 'trashed');
  const displayed = tab === 'inbox' ? inboxMessages : tab === 'archive' ? archiveMessages : trashMessages;
  const unread = inboxMessages.filter((m) => !m.read).length;

  const subtitle =
    tab === 'inbox'   ? `${inboxMessages.length} message${inboxMessages.length !== 1 ? 's' : ''} · ${unread} unread` :
    tab === 'archive' ? `${archiveMessages.length} archived` :
                        `${trashMessages.length} in trash`;

  if (loading) return <div className="p-8 text-slate-400">Loading...</div>;

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white mb-1">💬 Messages</h1>
        <p className="text-slate-400 text-sm">{subtitle}</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 bg-slate-800/50 rounded-xl p-1 w-fit">
        {([
          { key: 'inbox',   label: 'Inbox',   icon: '💬', count: inboxMessages.length   },
          { key: 'archive', label: 'Archive', icon: '🗂️', count: archiveMessages.length },
          { key: 'trash',   label: 'Trash',   icon: '🗑️', count: trashMessages.length   },
        ] as { key: Tab; label: string; icon: string; count: number }[]).map((t) => (
          <button
            key={t.key}
            onClick={() => switchTab(t.key)}
            className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors ${
              tab === t.key ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            <span>{t.icon}</span>
            <span>{t.label}</span>
            {t.count > 0 && (
              <span className="text-xs bg-slate-600 px-1.5 py-0.5 rounded-full leading-none">
                {t.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {displayed.length === 0 ? (
        <div className="glass rounded-2xl p-12 text-center">
          <div className="text-4xl mb-4">
            {tab === 'inbox' ? '📭' : tab === 'archive' ? '🗂️' : '🗑️'}
          </div>
          <p className="text-white font-medium mb-2">
            {tab === 'inbox' ? 'No messages yet' : tab === 'archive' ? 'Archive is empty' : 'Trash is empty'}
          </p>
          <p className="text-slate-400 text-sm">
            {tab === 'inbox' ? 'Messages from your contact form will appear here.' :
             tab === 'archive' ? 'Archived messages will appear here.' :
             'Deleted messages will appear here.'}
          </p>
        </div>
      ) : (
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Message List */}
          <div className="space-y-3">
            {displayed.map((msg) => (
              <button
                key={msg.id}
                onClick={() => handleSelect(msg)}
                className={`w-full text-left glass rounded-xl p-4 transition-all duration-200 hover:border-blue-500/50 ${
                  selected?.id === msg.id ? 'border-blue-500/50 bg-blue-500/5' : ''
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      {!msg.read && (
                        <div className="w-2 h-2 bg-blue-400 rounded-full flex-shrink-0" />
                      )}
                      <p className={`font-medium text-sm truncate ${msg.read ? 'text-slate-300' : 'text-white'}`}>
                        {msg.name}
                      </p>
                    </div>
                    <p className="text-slate-400 text-xs truncate mb-1">{msg.subject}</p>
                    <div className="flex items-center gap-2">
                      <p className="text-slate-500 text-xs truncate">{msg.message}</p>
                      {tab === 'inbox' && msg.status && msg.status !== 'unread' && (
                        <span className={`flex-shrink-0 text-[10px] px-1.5 py-0.5 rounded font-medium ${
                          msg.status === 'processing' ? 'bg-amber-500/20 text-amber-400' :
                          'bg-green-500/20 text-green-400'
                        }`}>
                          {msg.status.charAt(0).toUpperCase() + msg.status.slice(1)}
                        </span>
                      )}
                    </div>
                  </div>
                  <p className="text-slate-500 text-xs flex-shrink-0">
                    {new Date(msg.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </button>
            ))}
          </div>

          {/* Message Detail */}
          <div>
            {selected ? (
              <div className="glass rounded-2xl p-6">
                <div className="mb-6">
                  <h3 className="text-white font-bold text-lg mb-1">{selected.subject}</h3>
                  <p className="text-slate-400 text-sm">
                    From: {selected.name} &lt;{selected.email}&gt;
                  </p>
                  <p className="text-slate-500 text-xs mt-0.5">
                    {new Date(selected.createdAt).toLocaleString()}
                  </p>
                  {selected.readAt && (
                    <p className="text-xs text-slate-500 mt-0.5">
                      Opened: {new Date(selected.readAt).toLocaleString()}
                    </p>
                  )}
                </div>

                <div className="bg-slate-800/50 rounded-xl p-4 mb-4">
                  <p className="text-slate-200 text-sm leading-relaxed whitespace-pre-wrap">
                    {selected.message}
                  </p>
                </div>

                {/* Per-tab action buttons */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {tab === 'inbox' && (
                    <>
                      {(['processing', 'completed'] as const).map((action) => {
                        const isActive = selected.status === action;
                        return (
                          <button
                            key={action}
                            onClick={() => updateStatus(selected.id, action)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                              isActive ? STATUS_STYLES[action] : STATUS_OUTLINE[action]
                            }`}
                          >
                            {action.charAt(0).toUpperCase() + action.slice(1)}
                          </button>
                        );
                      })}
                      <button
                        onClick={() => updateStatus(selected.id, 'archived')}
                        className="px-3 py-1.5 rounded-lg text-xs font-medium border border-slate-500/40 text-slate-400 hover:bg-slate-500/10 transition-colors"
                      >
                        Archive
                      </button>
                      <button
                        onClick={() => moveToTrash(selected.id)}
                        className="px-3 py-1.5 rounded-lg text-xs font-medium border border-red-500/40 text-red-400 hover:bg-red-500/10 transition-colors ml-auto"
                      >
                        🗑️ Move to Trash
                      </button>
                    </>
                  )}

                  {tab === 'archive' && (
                    <>
                      <button
                        onClick={() => restoreMessage(selected.id)}
                        className="px-3 py-1.5 rounded-lg text-xs font-medium border border-blue-500/40 text-blue-400 hover:bg-blue-500/10 transition-colors"
                      >
                        ↩ Restore to Inbox
                      </button>
                      <button
                        onClick={() => moveToTrash(selected.id)}
                        className="px-3 py-1.5 rounded-lg text-xs font-medium border border-red-500/40 text-red-400 hover:bg-red-500/10 transition-colors ml-auto"
                      >
                        🗑️ Move to Trash
                      </button>
                    </>
                  )}

                  {tab === 'trash' && (
                    <>
                      <button
                        onClick={() => restoreMessage(selected.id)}
                        className="px-3 py-1.5 rounded-lg text-xs font-medium border border-green-500/40 text-green-400 hover:bg-green-500/10 transition-colors"
                      >
                        ↩ Restore to Inbox
                      </button>
                      <button
                        onClick={() => permanentDelete(selected.id)}
                        className="px-3 py-1.5 rounded-lg text-xs font-medium bg-red-500/20 border border-red-500 text-red-300 hover:bg-red-500/30 transition-colors ml-auto"
                      >
                        Delete Forever
                      </button>
                    </>
                  )}
                </div>

                {tab !== 'trash' && (
                  <a
                    href={`mailto:${selected.email}?subject=Re: ${selected.subject}`}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-xl transition-colors inline-block"
                  >
                    Reply via Email
                  </a>
                )}
              </div>
            ) : (
              <div className="glass rounded-2xl p-12 text-center h-64 flex flex-col items-center justify-center">
                <div className="text-3xl mb-3">👈</div>
                <p className="text-slate-400 text-sm">Select a message to view</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
