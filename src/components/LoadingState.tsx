export function LoadingState() {
  return (
    <div className="rounded-2xl border border-orange-200 bg-orange-50 p-6 text-center">
      <div className="mx-auto size-9 animate-spin rounded-full border-4 border-orange-200 border-t-[#F75202]" />
      <p className="mt-3 text-sm font-semibold text-slate-700">Generating your future smile...</p>
      <p className="mt-1 text-xs text-slate-500">This may take 10-30 seconds.</p>
    </div>
  );
}
