"use client";

export function AnimatedBubbles() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {/* Multiple bubbles with different sizes and animations */}
      {Array.from({ length: 15 }).map((_, i) => {
        const size = Math.random() * 100 + 50; // Random size between 50-150px
        const left = Math.random() * 100; // Random horizontal position
        const animationDuration = Math.random() * 20 + 15; // Random duration 15-35s
        const animationDelay = Math.random() * 5; // Random delay 0-5s
        const opacity = Math.random() * 0.3 + 0.1; // Random opacity 0.1-0.4

        return (
          <div
            key={i}
            className="absolute rounded-full bg-purple-400/20 blur-xl"
            style={{
              width: `${size}px`,
              height: `${size}px`,
              left: `${left}%`,
              bottom: '-100px',
              opacity: opacity,
              animation: `bubble-float ${animationDuration}s ease-in-out infinite`,
              animationDelay: `${animationDelay}s`,
            }}
          />
        );
      })}
    </div>
  );
}
