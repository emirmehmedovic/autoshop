"use client"

export function BackgroundPattern() {
  return (
    <>
      {/* Dot pattern */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: -10,
          height: "100%",
          width: "100%",
          backgroundColor: "#fbfaf8",
          backgroundImage: "radial-gradient(rgba(120, 53, 15, 0.035) 1px, transparent 1px)",
          backgroundSize: "16px 16px",
        }}
      />
      {/* Amber wood glow */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: -9,
          background: `
            radial-gradient(circle 680px at 100% 140px, rgba(180, 83, 9, 0.045), transparent 68%),
            radial-gradient(circle 560px at 0% 420px, rgba(120, 53, 15, 0.035), transparent 70%),
            radial-gradient(circle 500px at 80% 680px, rgba(245, 158, 11, 0.03), transparent 72%),
            linear-gradient(180deg, rgba(255, 251, 235, 0.18), rgba(251, 250, 248, 0.08))
          `,
          pointerEvents: "none",
        }}
      />
    </>
  )
}
