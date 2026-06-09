export default function Loading() {
  return (
    <div className="min-h-screen bg-linkedin-bg flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 rounded-full border-4 border-linkedin-blue border-t-transparent animate-spin" />
        <p className="text-sm text-linkedin-muted">Loading...</p>
      </div>
    </div>
  )
}
