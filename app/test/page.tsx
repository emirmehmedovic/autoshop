export default function TestPage() {
  return (
    <div style={{ padding: '40px', fontFamily: 'sans-serif' }}>
      <h1>✅ Test Page Works!</h1>
      <p>If you see this, routing is working on Vercel.</p>
      <p>Time: {new Date().toISOString()}</p>
    </div>
  )
}
