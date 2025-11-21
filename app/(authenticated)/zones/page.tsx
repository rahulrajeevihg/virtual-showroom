export default function ZonesPage() {
  const zones = [
    { id: '1', name: 'Zone 1', description: 'Commercial & Panel Lighting', icon: '🏢' },
    { id: '2', name: 'Zone 2', description: 'Industrial & Outdoor Lighting', icon: '🏭' },
    { id: '3', name: 'Zone 3', description: 'Smart & Task Lighting', icon: '💡' },
    { id: '4', name: 'Zone 4', description: 'Recessed & Track Lighting', icon: '🎯' },
    { id: '5', name: 'Zone 5', description: 'Decorative & Designer Lighting', icon: '✨' },
    { id: '6', name: 'Zone 6', description: 'Specialty Lighting Solutions', icon: '🌟' },
    { id: '7', name: 'Zone 7', description: 'Outdoor & Landscape Lighting', icon: '🌳' },
    { id: '8', name: 'Zone 8', description: 'Emergency & Safety Lighting', icon: '🚨' }
  ];

  return (
    <div className="min-h-screen bg-black py-12 px-4 overflow-x-hidden w-full">
      <div className="container mx-auto w-full max-w-full">
        <h1 className="text-5xl font-bold text-white mb-6 text-center glow-text-subtle">
          Browse by Zone
        </h1>
        <p className="text-center text-white/60 mb-12 text-lg">
          Explore our curated collections organized by application and style
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {zones.map((zone, index) => (
            <a
              key={zone.id}
              href={`/zone/${zone.id}`}
              className="group bg-black border-2 border-white/20 rounded-2xl p-8 hover:border-white/60 hover:scale-105 transition-all duration-500 animate-slide-up opacity-0"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="text-6xl mb-4 group-hover:scale-110 transition-transform">
                {zone.icon}
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">{zone.name}</h2>
              <p className="text-white/60">{zone.description}</p>
              <div className="mt-4 flex items-center text-white/80 group-hover:text-white transition">
                <span>Explore</span>
                <svg className="w-5 h-5 ml-2 group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
