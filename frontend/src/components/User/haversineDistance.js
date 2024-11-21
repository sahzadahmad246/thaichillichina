
export const haversineDistance = (coord1, coord2) => {
    const toRad = (value) => (value * Math.PI) / 180;
  
    const lat1 = toRad(coord1.lat);
    const lon1 = toRad(coord1.lng);
    const lat2 = toRad(coord2.lat);
    const lon2 = toRad(coord2.lng);
  
    const R = 6371; 
    const dLat = lat2 - lat1;
    const dLon = lon2 - lon1;
    
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1) * Math.cos(lat2) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
      
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
  
    return distance;
  };
  