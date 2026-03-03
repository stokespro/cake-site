import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-6">
      <div className="text-center max-w-2xl">
        <h1 className="text-9xl font-black mb-8">404</h1>
        <h2 className="text-4xl font-black mb-6">Page Not Found</h2>
        <p className="text-xl text-gray-600 mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link
          href="/"
          className="inline-block bg-black text-white px-8 py-4 rounded font-bold hover:bg-gray-800 transition-colors"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}
