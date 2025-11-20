export default function AboutPage() {
  return (
    <div className="min-h-screen bg-black py-12 px-4">
      <div className="container mx-auto max-w-4xl">
        <h1 className="text-5xl font-bold text-white mb-12 text-center glow-text-subtle">
          About LED World
        </h1>

        <div className="space-y-8 text-white/80">
          <section className="bg-black border-2 border-white/20 rounded-2xl p-8">
            <h2 className="text-3xl font-bold text-white mb-4">Our Story</h2>
            <p className="mb-4">
              Founded in 2010, LED World has been at the forefront of the lighting revolution. We believe that great lighting transforms spaces and enhances lives. Our mission is to provide premium LED solutions that combine energy efficiency, longevity, and stunning aesthetics.
            </p>
            <p>
              From humble beginnings as a small showroom, we&apos;ve grown into a comprehensive virtual lighting experience, serving thousands of satisfied customers across commercial, industrial, and residential sectors.
            </p>
          </section>

          <section className="bg-black border-2 border-white/20 rounded-2xl p-8">
            <h2 className="text-3xl font-bold text-white mb-4">Our Mission</h2>
            <p>
              To illuminate the world with sustainable, innovative LED lighting solutions that enhance productivity, safety, and beauty while reducing environmental impact.
            </p>
          </section>

          <section className="bg-black border-2 border-white/20 rounded-2xl p-8">
            <h2 className="text-3xl font-bold text-white mb-4">Why Choose Us</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <div>
                <h3 className="text-xl font-semibold text-white mb-2">Quality Assurance</h3>
                <p>All products undergo rigorous testing and come with extended warranties.</p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white mb-2">Expert Guidance</h3>
                <p>Our team provides personalized recommendations for your specific needs.</p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white mb-2">Energy Efficient</h3>
                <p>Save up to 80% on energy costs compared to traditional lighting.</p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white mb-2">Fast Delivery</h3>
                <p>Quick shipping and professional installation support available.</p>
              </div>
            </div>
          </section>

          <section className="bg-black border-2 border-white/20 rounded-2xl p-8">
            <h2 className="text-3xl font-bold text-white mb-4">Our Values</h2>
            <ul className="space-y-3">
              <li className="flex items-start">
                <span className="text-white mr-2">✓</span>
                <span><strong>Innovation:</strong> Constantly exploring new lighting technologies</span>
              </li>
              <li className="flex items-start">
                <span className="text-white mr-2">✓</span>
                <span><strong>Sustainability:</strong> Committed to environmental responsibility</span>
              </li>
              <li className="flex items-start">
                <span className="text-white mr-2">✓</span>
                <span><strong>Customer First:</strong> Your satisfaction is our top priority</span>
              </li>
              <li className="flex items-start">
                <span className="text-white mr-2">✓</span>
                <span><strong>Quality:</strong> Never compromising on product excellence</span>
              </li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}
