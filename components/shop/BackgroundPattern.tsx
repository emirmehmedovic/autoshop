"use client"

export function BackgroundPattern() {
  return (
    <>
      {/* Base - clean white with subtle blue tint */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: -10,
          height: "100%",
          width: "100%",
          background: "linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%)",
        }}
      />
      {/* Geometric broken shapes pattern */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: -9,
          opacity: 0.4,
          pointerEvents: "none",
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg stroke='%2394a3b8' stroke-width='0.5'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />
      {/* Floating geometric shapes */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: -8,
          pointerEvents: "none",
          overflow: "hidden",
        }}
      >
        {/* Large triangle top-right */}
        <div
          style={{
            position: "absolute",
            top: "-5%",
            right: "-5%",
            width: "40vw",
            height: "40vw",
            background: "linear-gradient(135deg, rgba(147, 197, 253, 0.15) 0%, rgba(199, 210, 254, 0.08) 100%)",
            clipPath: "polygon(100% 0, 0 0, 100% 100%)",
          }}
        />
        {/* Medium polygon left */}
        <div
          style={{
            position: "absolute",
            top: "30%",
            left: "-10%",
            width: "30vw",
            height: "30vw",
            background: "linear-gradient(180deg, rgba(165, 180, 252, 0.12) 0%, rgba(196, 181, 253, 0.06) 100%)",
            clipPath: "polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%)",
            transform: "rotate(-15deg)",
          }}
        />
        {/* Small diamond bottom-right */}
        <div
          style={{
            position: "absolute",
            bottom: "10%",
            right: "10%",
            width: "20vw",
            height: "20vw",
            background: "linear-gradient(45deg, rgba(147, 197, 253, 0.1) 0%, rgba(191, 219, 254, 0.05) 100%)",
            clipPath: "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)",
            transform: "rotate(15deg)",
          }}
        />
        {/* Hexagon center-left */}
        <div
          style={{
            position: "absolute",
            top: "60%",
            left: "5%",
            width: "15vw",
            height: "15vw",
            background: "linear-gradient(135deg, rgba(199, 210, 254, 0.1) 0%, transparent 100%)",
            clipPath: "polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)",
          }}
        />
        {/* Small triangle top-left */}
        <div
          style={{
            position: "absolute",
            top: "5%",
            left: "15%",
            width: "12vw",
            height: "12vw",
            background: "linear-gradient(180deg, rgba(165, 180, 252, 0.08) 0%, transparent 100%)",
            clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)",
            transform: "rotate(25deg)",
          }}
        />
      </div>
    </>
  )
}
