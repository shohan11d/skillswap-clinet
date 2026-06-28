import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-zinc-800 flex flex-col items-center justify-center px-4 text-center">

      <div className="relative select-none leading-none">
        <p className="text-[120px] font-bold text-zinc-700 tracking-tighter relative">
          <span className="relative inline-block">
            4
            <span className="text-blue-500">0</span>
            4
            <span className="absolute inset-0 text-blue-500 opacity-60 translate-x-[3px] -translate-y-[2px] [clip-path:polygon(0_30%,100%_30%,100%_50%,0_50%)]">
              404
            </span>
            <span className="absolute inset-0 text-red-500 opacity-50 -translate-x-[3px] translate-y-[2px] [clip-path:polygon(0_55%,100%_55%,100%_70%,0_70%)]">
              404
            </span>
          </span>
        </p>
      </div>

      <h1 className="text-2xl font-semibold text-white mt-2">Page not found</h1>
      <p className="text-zinc-400 text-sm mt-2 max-w-sm">
        Looks like this page took a wrong turn. It may have been moved, deleted, or never existed.
      </p>

      <div className="flex gap-3 mt-8 flex-wrap justify-center">
        <Link
          href="/"
          className="bg-blue-600 hover:bg-blue-700 transition text-white px-5 py-2.5 rounded-xl text-sm font-medium"
        >
          Back to home
        </Link>
        <Link
          href="/tasks"
          className="border border-zinc-700 hover:bg-zinc-700 transition text-zinc-400 px-5 py-2.5 rounded-xl text-sm font-medium"
        >
          Browse tasks
        </Link>
      </div>

      <p className="mt-10 text-xs text-zinc-600 uppercase tracking-widest">
        SkillSwap · Error 404
      </p>
    </div>
  );
}