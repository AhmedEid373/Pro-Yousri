'use client';

import { useState, useEffect, useRef } from 'react';

interface MediaFile {
  id: string;
  filename: string;
  url: string;
  size: number;
  createdAt: number;
}

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function MediaPage() {
  const [files, setFiles] = useState<MediaFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadFiles = async () => {
    setLoading(true);
    const res = await fetch('/api/upload');
    const data = await res.json();
    setFiles(data.files ?? []);
    setLoading(false);
  };

  useEffect(() => { loadFiles(); }, []);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError('');
    setSuccess('');
    const form = new FormData();
    form.append('file', file);
    const res = await fetch('/api/upload', { method: 'POST', body: form });
    const data = await res.json();
    if (data.url) {
      setSuccess('Image uploaded successfully.');
      await loadFiles();
    } else {
      setError(data.error ?? 'Upload failed.');
    }
    setUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleDelete = async (id: string) => {
    setError('');
    const res = await fetch(`/api/upload?id=${encodeURIComponent(id)}`, { method: 'DELETE' });
    if (res.ok) {
      setFiles((prev) => prev.filter((f) => f.id !== id));
      setSuccess('Image deleted.');
    } else {
      setError('Failed to delete image.');
    }
    setConfirmDelete(null);
  };

  const copyUrl = (url: string) => {
    navigator.clipboard.writeText(window.location.origin + url);
    setCopied(url);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="p-8 max-w-5xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Media Library</h1>
          <p className="text-slate-400 text-sm mt-1">All uploaded images. Click Copy URL to use in any field.</p>
        </div>
        <div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleUpload}
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-sm font-medium rounded-lg transition-colors"
          >
            {uploading ? 'Uploading…' : '+ Upload Image'}
          </button>
        </div>
      </div>

      {success && (
        <div className="mb-4 px-4 py-3 rounded-lg bg-green-900/30 border border-green-700 text-green-400 text-sm">
          {success}
        </div>
      )}
      {error && (
        <div className="mb-4 px-4 py-3 rounded-lg bg-red-900/30 border border-red-700 text-red-400 text-sm">
          {error}
        </div>
      )}

      {loading ? (
        <p className="text-slate-400 text-sm">Loading…</p>
      ) : files.length === 0 ? (
        <div className="bg-slate-800 rounded-xl p-12 text-center">
          <div className="text-4xl mb-3">🖼️</div>
          <p className="text-slate-300 font-medium">No images uploaded yet</p>
          <p className="text-slate-500 text-sm mt-1">Upload an image to get started.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {files.map((file) => (
            <div key={file.id} className="bg-slate-800 rounded-xl overflow-hidden">
              {/* Thumbnail */}
              <div className="aspect-square bg-slate-900 flex items-center justify-center overflow-hidden">
                <img
                  src={file.url}
                  alt={file.filename}
                  className="w-full h-full object-cover"
                  onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                />
              </div>
              {/* Info */}
              <div className="p-3">
                <p className="text-white text-xs font-medium truncate" title={file.filename}>
                  {file.filename}
                </p>
                <p className="text-slate-500 text-xs mt-0.5">{formatSize(file.size)}</p>
                <div className="flex gap-2 mt-2">
                  <button
                    onClick={() => copyUrl(file.url)}
                    className="flex-1 py-1 text-xs rounded bg-slate-700 hover:bg-slate-600 text-slate-300 hover:text-white transition-colors"
                  >
                    {copied === file.url ? '✓ Copied' : 'Copy URL'}
                  </button>
                  {confirmDelete === file.id ? (
                    <button
                      onClick={() => handleDelete(file.id)}
                      className="px-2 py-1 text-xs rounded bg-red-700 hover:bg-red-600 text-white transition-colors"
                    >
                      Confirm
                    </button>
                  ) : (
                    <button
                      onClick={() => setConfirmDelete(file.id)}
                      className="px-2 py-1 text-xs rounded bg-slate-700 hover:bg-red-700/50 text-red-400 hover:text-red-300 transition-colors"
                    >
                      ✕
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
