
import Image from "next/image";

export default function Home() {
  return (
    <div className="bg-gray-100 dark:bg-gray-900 min-h-screen">
      <header className="bg-white dark:bg-gray-800 shadow-md">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Tech Recommendations</h1>
          <p className="text-gray-600 dark:text-gray-400">Your daily dose of tech news and articles, personalized for you.</p>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <main className="md:col-span-2">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">Latest Articles</h2>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">The Rise of AI in Web Development</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">Discover how artificial intelligence is revolutionizing the way we build websites and applications.</p>
              <a href="#" className="text-blue-500 hover:underline">Read more</a>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">A Guide to Real-Time Databases</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">Learn the fundamentals of real-time databases and how to choose the right one for your project.</p>
              <a href="#" className="text-blue-500 hover:underline">Read more</a>
            </div>
            {/* More articles can be added here */}
          </main>

          <aside>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">Recommended for You</h3>
              <ul>
                <li className="mb-4">
                  <a href="#" className="text-blue-500 hover:underline">Getting Started with Next.js</a>
                </li>
                <li className="mb-4">
                  <a href="#" className="text-blue-500 hover:underline">The Future of Serverless Computing</a>
                </li>
                <li className="mb-4">
                  <a href="#" className="text-blue-500 hover:underline">Understanding WebSockets</a>
                </li>
              </ul>
            </div>
          </aside>
        </div>
      </div>

      <footer className="bg-white dark:bg-gray-800 mt-8 py-6">
        <div className="container mx-auto px-4 text-center text-gray-600 dark:text-gray-400">
          <p>&copy; 2024 Tech Recommendations. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
