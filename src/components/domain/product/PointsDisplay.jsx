export default function PointsDisplay({ points }) {
  return (
    <div className="points-display">
      <span>
        보유 포인트
        <span className="point-value">{points}</span>
      </span>
    </div>
  );
} 