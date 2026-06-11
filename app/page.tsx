import Link from "next/link"

// Temporary simplified homepage to debug Vercel 404 issue
export default function HomePage() {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(to bottom right, #1e293b, #0f172a)',
      color: 'white',
      padding: '20px',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      <h1 style={{ fontSize: '48px', marginBottom: '20px' }}>
        ✅ AutoShop Works!
      </h1>
      <p style={{ fontSize: '20px', marginBottom: '40px', opacity: 0.8 }}>
        If you see this, the deployment is successful.
      </p>

      <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', justifyContent: 'center' }}>
        <Link
          href="/shop"
          style={{
            padding: '12px 24px',
            background: '#a3e635',
            color: '#0f172a',
            textDecoration: 'none',
            borderRadius: '8px',
            fontWeight: 'bold'
          }}
        >
          Go to Shop
        </Link>
        <Link
          href="/login"
          style={{
            padding: '12px 24px',
            background: 'transparent',
            color: '#a3e635',
            textDecoration: 'none',
            borderRadius: '8px',
            border: '2px solid #a3e635',
            fontWeight: 'bold'
          }}
        >
          Login
        </Link>
        <Link
          href="/test"
          style={{
            padding: '12px 24px',
            background: 'transparent',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '8px',
            border: '2px solid white',
            fontWeight: 'bold'
          }}
        >
          Test Page
        </Link>
      </div>

      <div style={{ marginTop: '60px', opacity: 0.6, fontSize: '14px' }}>
        <p>Environment: {process.env.NODE_ENV}</p>
        <p>Time: {new Date().toISOString()}</p>
      </div>
    </div>
  )
}
