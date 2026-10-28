import Link from 'next/link';

export default function NotFound() {
  return (
    <div
      className="min-h-screen bg-white text-stone-900 flex flex-col justify-center items-center py-12 px-4"
      style={{ fontFamily: "var(--font-arvo), 'Arvo', serif" }}
    >
      <section className="page_404 w-full max-w-xl mx-auto">
        <div className="text-center">
          {/* 404 at the top, separate from animation so it never merges */}
          <h1 className="text-center font-bold tracking-tight text-[#1c1917] select-none text-[56px] sm:text-[76px] leading-none mb-1">
            404
          </h1>

          {/* Animated GIF Background - clean and unobstructed */}
          <div className="four_zero_four_bg my-1" />

          {/* Content Box */}
          <div className="contant_box_404">
            <h3 className="text-2xl sm:text-3xl font-bold text-stone-900 mb-2">
              Look like you're lost
            </h3>

            <p className="text-stone-600 text-sm sm:text-base max-w-md mx-auto mb-4">
              The page you are looking for is not available!
            </p>

            <Link href="/" className="link_404 shadow-md transition-all duration-200 hover:brightness-110 active:scale-95">
              Go to Home
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
