const HomeLoader = () => {
    return (
      <div className="w-full min-h-screen bg-gray-100 p-4">
        {/* Header section */}
        <div className="mb-4 bg-white p-4 rounded-lg shadow">
          {/* Location and Status */}
          <div className="flex justify-between mb-4">
            <div className="w-1/2 h-8 bg-gray-300 animate-pulse rounded"></div>
            <div className="w-1/3 h-8 bg-gray-300 animate-pulse rounded"></div>
          </div>
          {/* Search box */}
          <div className="w-full h-12 bg-gray-300 animate-pulse rounded"></div>
        </div>
  
        {/* First set of three boxes */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {[...Array(3)].map((_, index) => (
            <div key={index} className="aspect-square bg-white shadow rounded-lg overflow-hidden">
              <div className="w-full h-full bg-gray-300 animate-pulse"></div>
            </div>
          ))}
        </div>
  
        {/* Second set of three boxes */}
        <div className="grid grid-cols-3 gap-4">
          {[...Array(3)].map((_, index) => (
            <div key={index} className="aspect-square bg-white shadow rounded-lg overflow-hidden">
              <div className="w-full h-full bg-gray-300 animate-pulse"></div>
            </div>
          ))}
        </div>
      </div>
    );
  };
  
  export default HomeLoader;