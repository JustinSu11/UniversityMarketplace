export default function ErrorMessage({ message, onRetry }) {
  return (
    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
      <div className="flex items-center justify-between">
        <span>{message}</span>
        {onRetry && (
          <button
            onClick={onRetry}
            className="text-red-800 hover:text-red-900 underline text-sm"
          >
            Retry
          </button>
        )}
      </div>
    </div>
  );
}
