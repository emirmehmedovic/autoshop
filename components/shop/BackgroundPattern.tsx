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
          backgroundColor: "white",
          backgroundImage: "radial-gradient(#e5e7eb 1px, transparent 1px)",
          backgroundSize: "16px 16px",
        }}
      />
      {/* Blue blobs */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: -9,
          background: `
            radial-gradient(circle 600px at 100% 150px, rgba(186, 230, 253, 0.5), transparent),
            radial-gradient(circle 500px at 0% 400px, rgba(191, 219, 254, 0.4), transparent),
            radial-gradient(circle 400px at 80% 600px, rgba(224, 231, 255, 0.3), transparent)
          `,
          pointerEvents: "none",
        }}
      />
    </>
  )
}
