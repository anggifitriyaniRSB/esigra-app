const NODES = [
  { label: 'DETECT', angle: -90 },
  { label: 'EDUCATE', angle: -30 },
  { label: 'ALERT', angle: 30 },
  { label: 'VALIDATE', angle: 90 },
  { label: 'FOLLOW UP', angle: 150 },
  { label: 'MONITOR', angle: 210 },
];

export function ClosedLoopDiagram() {
  const size = 320;
  const center = size / 2;
  const radius = 120;

  const points = NODES.map((n) => {
    const rad = (n.angle * Math.PI) / 180;
    return {
      ...n,
      x: center + radius * Math.cos(rad),
      y: center + radius * Math.sin(rad),
    };
  });

  return (
    <div className="flex flex-col items-center">
      <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size} role="img" aria-label="Closed-loop maternal risk monitoring diagram">
        <circle cx={center} cy={center} r={radius} fill="none" stroke="var(--color-sage-line)" strokeWidth={2} strokeDasharray="4 6" />
        <circle cx={center} cy={center} r={54} fill="var(--color-sage)" />
        <text x={center} y={center - 4} textAnchor="middle" className="fill-[var(--color-deep-dark)] font-semibold" style={{ fontSize: 15, fontFamily: 'Fraunces, serif' }}>
          e-SIGRA
        </text>
        <text x={center} y={center + 14} textAnchor="middle" className="fill-[var(--color-ink)]" style={{ fontSize: 8, opacity: 0.7 }}>
          Closed-Loop Monitoring
        </text>
        {points.map((p, i) => {
          const next = points[(i + 1) % points.length];
          return (
            <line
              key={`line-${p.label}`}
              x1={p.x}
              y1={p.y}
              x2={next.x}
              y2={next.y}
              stroke="var(--color-teal)"
              strokeWidth={1.5}
              markerEnd="url(#arrow)"
              opacity={0.5}
            />
          );
        })}
        <defs>
          <marker id="arrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
            <path d="M0,0 L6,3 L0,6 Z" fill="var(--color-teal)" opacity={0.6} />
          </marker>
        </defs>
        {points.map((p) => (
          <g key={p.label}>
            <circle cx={p.x} cy={p.y} r={30} fill="white" stroke="var(--color-deep)" strokeWidth={1.5} />
            <text x={p.x} y={p.y + 3} textAnchor="middle" className="fill-[var(--color-deep-dark)] font-semibold" style={{ fontSize: 9 }}>
              {p.label}
            </text>
          </g>
        ))}
      </svg>
      <p className="mt-3 text-center text-xs text-[var(--color-ink)]/50">
        e-SIGRA bukan sekadar formulir skrining — setiap deteksi berlanjut hingga tindak lanjut tercatat.
      </p>
    </div>
  );
}
