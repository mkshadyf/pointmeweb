function ProgressBar({ step, totalSteps }: { step: number; totalSteps: number }) {
  const percentage = (step / totalSteps) * 100;

  return (
    <div className="progress-bar">
      <div className="progress-bar-fill" style={{ width: `${percentage}%` }} />
    </div>
  );
}
export default ProgressBar; 