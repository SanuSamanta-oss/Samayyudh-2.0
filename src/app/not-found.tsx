import Link from 'next/link';

export default function NotFound() {
  return (
    <div
      className="min-h-screen bg-white text-stone-900 flex flex-col justify-center items-center py-12 px-4"
      style={{ fontFamily: "var(--font-arvo), 'Arvo', serif" }}
    >
      <section className="page_404 w-full">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="text-center">
            {/* Animated GIF Background */}
            <div className="four_zero_four_bg flex items-center justify-center">
              <h1 className="text-center font-bold tracking-tight text-[#1c1917]">
                404
              </h1>
            </div>

            {/* Content Box */}
            <div className="contant_box_404">
              <h3 className="text-3xl sm:text-4xl font-bold text-stone-900 mb-3">
                Look like you're lost
              </h3>

              <p className="text-stone-600 text-base sm:text-lg max-w-md mx-auto mb-6">
                The page you are looking for is not available!
              </p>

              <Link href="/" className="link_404 shadow-md transition-all duration-200 hover:brightness-110 active:scale-95">
                Go to Home
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
