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
          backgroundColor: "#faf8f5",
          backgroundImage: "radial-gradient(rgba(120, 53, 15, 0.07) 1px, transparent 1px)",
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
            radial-gradient(circle 640px at 100% 140px, rgba(180, 83, 9, 0.1), transparent 64%),
            radial-gradient(circle 520px at 0% 420px, rgba(120, 53, 15, 0.08), transparent 66%),
            radial-gradient(circle 460px at 80% 680px, rgba(245, 158, 11, 0.07), transparent 68%),
            linear-gradient(180deg, rgba(255, 251, 235, 0.36), rgba(250, 248, 245, 0.18))
          `,
          pointerEvents: "none",
        }}
      />
    </>
  )
}
