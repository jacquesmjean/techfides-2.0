import Link from "next/link";

export default function NotFound() {
  return (
    <div className="grid-pattern flex min-h-screen items-center justify-center px-6">
      <div className="text-center">
        <p className="text-8xl font-extrabold text-electric-400">404</p>
        <h1 className="mt-4 text-3xl font-bold text-slate-100">
          Page Not Found
        </h1>
        <p className="mt-4 max-w-md text-lg text-slate-400">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <div className="mt-8 flex items-center justify-center gap-4">
          <Link
            href="/"
            className="rounded-lg bg-electric-500 px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-electric-400"
          >
            Back to Home
          </Link>
          <Link
            href="/solutions"
            className="rounded-lg border border-slate-700 px-6 py-3 text-sm font-semibold text-slate-300 transition-all hover:border-electric-500/50 hover:text-white"
          >
            Explore Solutions
          </Link>
        </div>
      </div>
    </div>
  );
}
