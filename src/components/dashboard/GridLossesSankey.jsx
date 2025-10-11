import { useState, useEffect } from 'react';

export const GridLossesSankey = ({ data }) => {
  const { generation, transmission, distribution, consumption, losses } = data;
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const height = isMobile ? 560 : 300;
  const width = isMobile ? 300 : 730;
  const nodeWidth = 80;
  const nodeHeight = 80;

  // Mobile: Vertical Layout, Desktop: Horizontal Layout
  const nodes = isMobile ? [
    { label: 'Erzeugung', value: generation, x: width / 2 - nodeWidth / 2, y: 90 },
    { label: 'Übertragung', value: transmission, x: width / 2 - nodeWidth / 2, y: 210 },
    { label: 'Verteilung', value: distribution, x: width / 2 - nodeWidth / 2, y: 330 },
    { label: 'Verbrauch', value: consumption, x: width / 2 - nodeWidth / 2, y: 450 }
  ] : [
    { label: 'Erzeugung', value: generation, x: 50, y: height / 2 },
    { label: 'Übertragung', value: transmission, x: 250, y: height / 2 },
    { label: 'Verteilung', value: distribution, x: 450, y: height / 2 },
    { label: 'Verbrauch', value: consumption, x: 650, y: height / 2 }
  ];

  return (
    <div className="card">
      <div className="card-header">
        <span className="card-title">Netz-Verluste (Sankey)</span>
      </div>
      <div className="sankey-container" style={{ height: `${height}px` }}>
        <svg width="100%" height="100%" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="xMidYMid meet">
          {isMobile ? (
            <>
              {/* Mobile: Vertical Flows */}
              {/* Generation to Transmission */}
              <path
                d={`M ${nodes[0].x + nodeWidth / 2} ${nodes[0].y + nodeHeight}
                    C ${nodes[0].x + nodeWidth / 2} ${nodes[0].y + 90},
                      ${nodes[1].x + nodeWidth / 2} ${nodes[1].y - 30},
                      ${nodes[1].x + nodeWidth / 2} ${nodes[1].y}`}
                fill="none"
                stroke="#3b82f6"
                strokeWidth="50"
                opacity="0.5"
              />

              {/* Transmission to Distribution */}
              <path
                d={`M ${nodes[1].x + nodeWidth / 2} ${nodes[1].y + nodeHeight}
                    C ${nodes[1].x + nodeWidth / 2} ${nodes[1].y + 90},
                      ${nodes[2].x + nodeWidth / 2} ${nodes[2].y - 30},
                      ${nodes[2].x + nodeWidth / 2} ${nodes[2].y}`}
                fill="none"
                stroke="#3b82f6"
                strokeWidth="40"
                opacity="0.5"
              />

              {/* Distribution to Consumption */}
              <path
                d={`M ${nodes[2].x + nodeWidth / 2} ${nodes[2].y + nodeHeight}
                    C ${nodes[2].x + nodeWidth / 2} ${nodes[2].y + 90},
                      ${nodes[3].x + nodeWidth / 2} ${nodes[3].y - 30},
                      ${nodes[3].x + nodeWidth / 2} ${nodes[3].y}`}
                fill="none"
                stroke="#3b82f6"
                strokeWidth="35"
                opacity="0.5"
              />
            </>
          ) : (
            <>
              {/* Desktop: Horizontal Flows */}
              {/* Generation to Transmission */}
              <path
                d={`M ${nodes[0].x + nodeWidth} ${nodes[0].y}
                    C ${nodes[0].x + 150} ${nodes[0].y},
                      ${nodes[1].x - 50} ${nodes[1].y},
                      ${nodes[1].x} ${nodes[1].y}`}
                fill="none"
                stroke="#3b82f6"
                strokeWidth="50"
                opacity="0.5"
              />

              {/* Transmission to Distribution */}
              <path
                d={`M ${nodes[1].x + nodeWidth} ${nodes[1].y}
                    C ${nodes[1].x + 150} ${nodes[1].y},
                      ${nodes[2].x - 50} ${nodes[2].y},
                      ${nodes[2].x} ${nodes[2].y}`}
                fill="none"
                stroke="#3b82f6"
                strokeWidth="40"
                opacity="0.5"
              />

              {/* Distribution to Consumption */}
              <path
                d={`M ${nodes[2].x + nodeWidth} ${nodes[2].y}
                    C ${nodes[2].x + 150} ${nodes[2].y},
                      ${nodes[3].x - 50} ${nodes[3].y},
                      ${nodes[3].x} ${nodes[3].y}`}
                fill="none"
                stroke="#3b82f6"
                strokeWidth="35"
                opacity="0.5"
              />
            </>
          )}

          {/* Nodes */}
          {nodes.map((node, i) => (
            <g key={i}>
              <rect
                x={node.x}
                y={node.y - 40}
                width={nodeWidth}
                height="80"
                fill="var(--surface-hover)"
                stroke="var(--border)"
                strokeWidth="2"
                rx="8"
              />
              <text
                x={node.x + nodeWidth / 2}
                y={node.y - 10}
                textAnchor="middle"
                fontSize="12"
                fontWeight="600"
                fill="var(--text)"
              >
                {node.label}
              </text>
              <text
                x={node.x + nodeWidth / 2}
                y={node.y + 10}
                textAnchor="middle"
                fontSize="16"
                fontWeight="700"
                fill="var(--accent)"
              >
                {node.value}
              </text>
              <text
                x={node.x + nodeWidth / 2}
                y={node.y + 25}
                textAnchor="middle"
                fontSize="10"
                fill="var(--text-secondary)"
              >
                MW
              </text>
            </g>
          ))}

          {/* Loss labels */}
          {isMobile ? (
            <>
              {/* Mobile: Vertical Loss Labels */}
              <g>
                <rect x={width / 2 - 35} y="155" width="70" height="38" fill="#ef444420" rx="6" />
                <text x={width / 2} y="171" textAnchor="middle" fontSize="11" fontWeight="600" fill="#ef4444">
                  Verlust:
                </text>
                <text x={width / 2} y="186" textAnchor="middle" fontSize="15" fontWeight="700" fill="#ef4444">
                  {losses.transmission} MW
                </text>
              </g>
              <g>
                <rect x={width / 2 - 35} y="275" width="70" height="38" fill="#ef444420" rx="6" />
                <text x={width / 2} y="291" textAnchor="middle" fontSize="11" fontWeight="600" fill="#ef4444">
                  Verlust:
                </text>
                <text x={width / 2} y="306" textAnchor="middle" fontSize="15" fontWeight="700" fill="#ef4444">
                  {losses.distribution} MW
                </text>
              </g>
            </>
          ) : (
            <>
              {/* Desktop: Horizontal Loss Labels */}
              <g>
                <rect x="140" y="65" width="70" height="38" fill="#ef444420" rx="6" />
                <text x="175" y="81" textAnchor="middle" fontSize="11" fontWeight="600" fill="#ef4444">
                  Verlust:
                </text>
                <text x="175" y="96" textAnchor="middle" fontSize="15" fontWeight="700" fill="#ef4444">
                  {losses.transmission} MW
                </text>
              </g>
              <g>
                <rect x="340" y="65" width="70" height="38" fill="#ef444420" rx="6" />
                <text x="375" y="81" textAnchor="middle" fontSize="11" fontWeight="600" fill="#ef4444">
                  Verlust:
                </text>
                <text x="375" y="96" textAnchor="middle" fontSize="15" fontWeight="700" fill="#ef4444">
                  {losses.distribution} MW
                </text>
              </g>
            </>
          )}
        </svg>
      </div>
      <div style={{ padding: '12px 24px 0', fontSize: '12px', color: 'var(--text-secondary)' }}>
        Gesamtverluste: {losses.transmission + losses.distribution + losses.other} MW ({((losses.transmission + losses.distribution + losses.other) / generation * 100).toFixed(1)}%)
      </div>
    </div>
  );
};
