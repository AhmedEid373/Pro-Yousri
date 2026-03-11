import { readData } from '@/lib/db';

interface SiteData {
  maintenance?: {
    enabled?: boolean;
    message?: string;
    gif?: string;
  };
}

export default function MaintenancePage() {
  const site = readData<SiteData>('site.json', {});
  const msg = site.maintenance?.message ?? "We're working on something awesome. Check back soon!";
  const gif = site.maintenance?.gif ?? '';

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)',
        fontFamily: 'system-ui, sans-serif',
      }}
    >
      <div style={{ textAlign: 'center', padding: '2rem', maxWidth: '500px' }}>
        {gif ? (
          <img
            src={gif}
            alt="Maintenance"
            style={{ width: '200px', height: '200px', objectFit: 'contain', margin: '0 auto 2rem', borderRadius: '12px' }}
          />
        ) : (
          <div style={{ fontSize: '80px', marginBottom: '2rem' }}>⚙️</div>
        )}
        <h1 style={{ color: '#f8fafc', fontSize: '2rem', fontWeight: 700, marginBottom: '1rem' }}>
          Under Maintenance
        </h1>
        <p style={{ color: '#94a3b8', fontSize: '1.1rem', lineHeight: 1.6 }}>{msg}</p>
      </div>
    </div>
  );
}
