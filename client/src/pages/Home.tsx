import { motion } from 'framer-motion';
import { ArrowRight, Map, Sun, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Home() {
  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center justify-center overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1605333391784-3c66048126b8?auto=format&fit=crop&w=1600&q=80"
            alt="Lalibela Rock-Hewn Church"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-gray-900/80 to-gray-900/40" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center md:text-left">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl"
          >
            <span className="inline-block py-1 px-3 rounded-full bg-green-500/20 text-green-300 backdrop-blur-md text-sm font-medium tracking-wide mb-6 border border-green-500/30">
              Discover the Land of Origins
            </span>
            <h1 className="text-4xl md:text-6xl font-bold text-white tracking-tight mb-6 leading-tight">
              Experience the Untold Stories of <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-green-400">Ethiopia</span>
            </h1>
            <p className="text-lg text-gray-200 mb-8 max-w-2xl">
              Your ultimate companion to explore ancient heritages, vibrant cultures, and breathtaking landscapes. We provide everything you need for a seamless journey.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <Link
                to="/heritages"
                className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-gray-900 bg-yellow-400 hover:bg-yellow-500 transition-colors shadow-lg shadow-yellow-500/30"
              >
                Explore Heritages
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
              <Link
                to="/essentials"
                className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-base font-medium rounded-lg text-white bg-white/10 hover:bg-white/20 backdrop-blur-md transition-colors"
              >
                Tourist Essentials
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Everything You Need in One Place</h2>
            <p className="text-gray-600 text-lg">
              We've crafted a comprehensive platform to solve common travel problems and enhance your experience in Ethiopia.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<Map className="w-8 h-8 text-green-600" />}
              title="Rich Heritage & Stories"
              description="Discover UNESCO registered places like Lalibela and Gondar with deep historical contexts and stories."
            />
            <FeatureCard 
              icon={<Sun className="w-8 h-8 text-yellow-500" />}
              title="Real-Time Travel Info"
              description="Get live updates on weather, transport conditions, and precise distances between destinations."
            />
            <FeatureCard 
              icon={<ShieldCheck className="w-8 h-8 text-red-500" />}
              title="Essential Services"
              description="Access vital information on banking, telecommunications, hotels, and car rentals effortlessly."
            />
          </div>
        </div>
      </section>

      {/* Cultural Showcase Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="w-full md:w-1/2">
              <img 
                src="https://images.unsplash.com/photo-1596700858169-e092d6e3c9a0?auto=format&fit=crop&w=800&q=80" 
                alt="Fasil Ghebbi Castles in Gondar" 
                className="rounded-2xl shadow-xl w-full h-[400px] object-cover"
              />
            </div>
            <div className="w-full md:w-1/2">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">A Journey Through Time</h2>
              <p className="text-gray-600 mb-6 text-lg">
                Ethiopia is not just a destination; it's an experience. From the ancient obelisks of Aksum to the medieval castles of Gondar, every stone tells a story.
              </p>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <div className="shrink-0 w-6 h-6 rounded-full bg-green-100 flex items-center justify-center mt-1">
                    <div className="w-2 h-2 rounded-full bg-green-600" />
                  </div>
                  <span className="ml-3 text-gray-700">9 UNESCO World Heritage Sites to explore.</span>
                </li>
                <li className="flex items-start">
                  <div className="shrink-0 w-6 h-6 rounded-full bg-yellow-100 flex items-center justify-center mt-1">
                    <div className="w-2 h-2 rounded-full bg-yellow-500" />
                  </div>
                  <span className="ml-3 text-gray-700">Unique cultural traditions and diverse languages.</span>
                </li>
                <li className="flex items-start">
                  <div className="shrink-0 w-6 h-6 rounded-full bg-red-100 flex items-center justify-center mt-1">
                    <div className="w-2 h-2 rounded-full bg-red-500" />
                  </div>
                  <span className="ml-3 text-gray-700">Breathtaking landscapes from the Danakil Depression to Simien Mountains.</span>
                </li>
              </ul>
              <div className="mt-8">
                <Link to="/heritages" className="text-green-600 font-semibold hover:text-green-700 inline-flex items-center">
                  Read more about our heritage
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className="p-8 bg-gray-50 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all"
    >
      <div className="w-14 h-14 bg-white rounded-xl shadow-sm flex items-center justify-center mb-6">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-gray-900 mb-3">{title}</h3>
      <p className="text-gray-600 leading-relaxed">{description}</p>
    </motion.div>
  );
}
