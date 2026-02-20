/**
 * Sparkline Component
 * Following Edward Tufte's principle of "small, high-resolution graphics
 * embedded in a context of words, numbers, images"
 */
import { theme } from '../../theme/colors';

const Sparkline = ({
  data = [],
  width = 60,
  height = 20,
  color = 'currentColor',
  showEndDot = true,
  showMinMax = false,
  strokeWidth = 1.5,
  className = ''
}) => {
  if (!data || data.length < 2) return null;

  const values = data.map(d => typeof d === 'object' ? d.value : d);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;

  // Normalize values to SVG coordinates
  const padding = 2;
  const chartWidth = width - padding * 2;
  const chartHeight = height - padding * 2;

  const points = values.map((value, index) => {
    const x = padding + (index / (values.length - 1)) * chartWidth;
    const y = padding + chartHeight - ((value - min) / range) * chartHeight;
    return { x, y, value };
  });

  // Create smooth path using line segments
  const pathData = points
    .map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x.toFixed(1)} ${point.y.toFixed(1)}`)
    .join(' ');

  // Find min/max points for highlighting
  const minPoint = points.find(p => p.value === min);
  const maxPoint = points.find(p => p.value === max);
  const lastPoint = points[points.length - 1];

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className={`sparkline ${className}`.trim()}
      aria-hidden="true"
      style={{ display: 'block' }}
    >
      {/* Gradient fill under the line */}
      <defs>
        <linearGradient id={`sparkline-gradient-${color.replace('#', '')}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.15" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Area fill */}
      <path
        d={`${pathData} L ${lastPoint.x.toFixed(1)} ${height - padding} L ${padding} ${height - padding} Z`}
        fill={`url(#sparkline-gradient-${color.replace('#', '')})`}
      />

      {/* Main line */}
      <path
        d={pathData}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Min/Max indicators */}
      {showMinMax && (
        <>
          <circle cx={minPoint.x} cy={minPoint.y} r={2} fill={theme.colors.availabilityNone} />
          <circle cx={maxPoint.x} cy={maxPoint.y} r={2} fill={theme.colors.availabilityFtth} />
        </>
      )}

      {/* End dot */}
      {showEndDot && (
        <circle
          cx={lastPoint.x}
          cy={lastPoint.y}
          r={2.5}
          fill={color}
        />
      )}
    </svg>
  );
};

/**
 * SparkBar - Mini bar chart variant
 * Good for showing discrete values or comparisons
 */
const SparkBar = ({
  data = [],
  width = 60,
  height = 20,
  color = 'currentColor',
  gap = 1,
  className = ''
}) => {
  if (!data || data.length < 1) return null;

  const values = data.map(d => typeof d === 'object' ? d.value : d);
  const max = Math.max(...values);

  const barWidth = (width - gap * (values.length - 1)) / values.length;

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className={`sparkbar ${className}`.trim()}
      aria-hidden="true"
      style={{ display: 'block' }}
    >
      {values.map((value, index) => {
        const barHeight = (value / max) * height;
        const x = index * (barWidth + gap);
        const y = height - barHeight;
        const isLast = index === values.length - 1;

        return (
          <rect
            key={index}
            x={x}
            y={y}
            width={barWidth}
            height={barHeight}
            fill={color}
            opacity={isLast ? 1 : 0.5}
            rx={1}
          />
        );
      })}
    </svg>
  );
};

export { Sparkline, SparkBar };
export default Sparkline;
