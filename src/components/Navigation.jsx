import Link from 'next/link';

export default function Navigation() {
  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <Link href="/" className="text-xl font-bold text-gray-900 hover:text-blue-600 transition-colors">
            Campus Exchange
          </Link>
          
          <div className="flex items-center space-x-6">
            <Link 
              href="/" 
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              Browse
            </Link>
            <Link 
              href="/newListing" 
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
              Create Listing
            </Link>
            <Link 
              href="/profile" 
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              Profile
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
