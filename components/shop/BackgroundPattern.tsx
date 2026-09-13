"use client"

export function BackgroundPattern() {
  return (
    <>
      {/* Base - clean white with subtle warmth */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: -10,
          height: "100%",
          width: "100%",
          background: "linear-gradient(180deg, #fafafa 0%, #f5f5f5 100%)",
        }}
      />
      {/* Subtle dot grid pattern */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: -9,
          opacity: 0.5,
          pointerEvents: "none",
          backgroundImage: `radial-gradient(circle at center, #d4d4d4 1px, transparent 1px)`,
          backgroundSize: "24px 24px",
        }}
      />
      {/* Soft gradient orbs */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: -8,
          pointerEvents: "none",
          overflow: "hidden",
        }}
      >
        {/* Top right warm glow */}
        <div
          style={{
            position: "absolute",
            top: "-20%",
            right: "-10%",
            width: "60vw",
            height: "60vw",
            background: "radial-gradient(circle, rgba(255, 237, 213, 0.4) 0%, rgba(254, 215, 170, 0.15) 40%, transparent 70%)",
            filter: "blur(60px)",
          }}
        />
        {/* Left side accent */}
        <div
          style={{
            position: "absolute",
            top: "30%",
            left: "-15%",
            width: "50vw",
            height: "50vw",
            background: "radial-gradient(circle, rgba(254, 215, 170, 0.2) 0%, rgba(253, 186, 116, 0.08) 50%, transparent 70%)",
            filter: "blur(80px)",
          }}
        />
        {/* Bottom center subtle glow */}
        <div
          style={{
            position: "absolute",
            bottom: "-10%",
            left: "30%",
            width: "40vw",
            height: "40vw",
            background: "radial-gradient(circle, rgba(229, 231, 235, 0.5) 0%, transparent 60%)",
            filter: "blur(50px)",
          }}
        />
      </div>
    </>
  )
}
