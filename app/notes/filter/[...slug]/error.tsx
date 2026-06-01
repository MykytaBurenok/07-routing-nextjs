"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="p-4 border border-red-300 rounded">
      <h2 className="text-lg font-semibold text-red-600">
        Something broke (surprise)
      </h2>

      <p className="mt-2 text-sm text-red-500">{error.message}</p>

      <button className="mt-4 px-3 py-1 border rounded" onClick={() => reset()}>
        Try again
      </button>
    </div>
  );
}
