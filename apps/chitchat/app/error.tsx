'use client'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-purple-600 via-indigo-600 to-blue-500 text-white">
      <h2 className="text-2xl font-bold mb-4">Something went wrong!</h2>
      <button
        onClick={() => reset()}
        className="bg-white text-indigo-700 px-4 py-2 rounded-lg font-semibold hover:bg-gray-100"
      >
        Try again
      </button>
    </div>
  )
}
