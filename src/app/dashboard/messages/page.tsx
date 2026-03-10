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

const STATUS_STYLES: Record<string, string> = {
  processing: 'bg-amber-500/20 text-amber-400 border-amber-500',
  completed: 'bg-green-500/20 text-green-400 border-green-500',
  archived: 'bg-slate-500/20 text-slate-400 border-slate-500',
};

const STATUS_OUTLINE: Record<string, string> = {
  processing: 'border-amber-500/40 text-amber-400 hover:bg-amber-500/10',
  completed: 'border-green-500/40 text-green-400 hover:bg-green-500/10',
  archived: 'border-slate-500/40 text-slate-400 hover:bg-slate-500/10',
};

export default function DashboardMessagesPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Message | null>(null);

  const fetchMessages = async () => {
    const res = await fetch('/api/messages');
    if (res.ok) {
      const data = await res.json();
      setMessages(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const markRead = async (id: string) => {
    await fetch('/api/messages', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, action: 'read' }),
    });
    const readAt = new Date().toISOString();
    setMessages((prev) =>
      prev.map((m) => (m.id === id ? { ...m, read: true, readAt: m.readAt ?? readAt } : m))
    );
    setSelected((prev) =>
      prev?.id === id ? { ...prev, read: true, readAt: prev.readAt ?? readAt } : prev
    );
  };

  const updateStatus = async (id: string, action: string) => {
    await fetch('/api/messages', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, action }),
    });
    setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, status: action } : m)));
    setSelected((prev) => (prev?.id === id ? { ...prev, status: action } : prev));
  };

  const deleteMessage = async (id: string) => {
    await fetch('/api/messages', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    setMessages((prev) => prev.filter((m) => m.id !== id));
    if (selected?.id === id) setSelected(null);
  };

  const handleSelect = (msg: Message) => {
    setSelected(msg);
    if (!msg.read) markRead(msg.id);
  };

  const unread = messages.filter((m) => !m.read).length;

  if (loading) return <div className="p-8 text-slate-400">Loading...</div>;

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-1">💬 Messages</h1>
        <p className="text-slate-400 text-sm">
          {messages.length} total message{messages.length !== 1 ? 's' : ''} · {unread} unread
        </p>
      </div>

      {messages.length === 0 ? (
        <div className="glass rounded-2xl p-12 text-center">
          <div className="text-4xl mb-4">📭</div>
          <p className="text-white font-medium mb-2">No messages yet</p>
          <p className="text-slate-400 text-sm">Messages from your contact form will appear here.</p>
        </div>
      ) : (
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Message List */}
          <div className="space-y-3">
            {messages.map((msg) => (
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
                      {msg.status && msg.status !== 'unread' && (
                        <span className={`flex-shrink-0 text-[10px] px-1.5 py-0.5 rounded font-medium ${
                          msg.status === 'processing' ? 'bg-amber-500/20 text-amber-400' :
                          msg.status === 'completed'  ? 'bg-green-500/20 text-green-400' :
                                                        'bg-slate-500/20 text-slate-400'
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

                {/* Action buttons */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {(['processing', 'completed', 'archived'] as const).map((action) => {
                    const isActive = selected.status === action;
                    return (
                      <button
                        key={action}
                        onClick={() => updateStatus(selected.id, action)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                          isActive
                            ? STATUS_STYLES[action]
                            : STATUS_OUTLINE[action]
                        }`}
                      >
                        {action.charAt(0).toUpperCase() + action.slice(1)}
                      </button>
                    );
                  })}
                  <button
                    onClick={() => deleteMessage(selected.id)}
                    className="px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-medium rounded-lg border border-red-500/40 transition-colors ml-auto"
                  >
                    Delete
                  </button>
                </div>

                <a
                  href={`mailto:${selected.email}?subject=Re: ${selected.subject}`}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-xl transition-colors inline-block"
                >
                  Reply via Email
                </a>
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
