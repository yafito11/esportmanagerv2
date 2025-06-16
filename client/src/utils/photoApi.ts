
// Unsplash API integration for player photos
const UNSPLASH_ACCESS_KEY = 'your-unsplash-access-key';
const UNSPLASH_API_URL = 'https://api.unsplash.com/photos/random';

export const getPlayerPhoto = async (nationality: string, gender: string = 'any') => {
  try {
    const searchQuery = `person portrait ${nationality} esports gamer`;
    const response = await fetch(
      `${UNSPLASH_API_URL}?query=${encodeURIComponent(searchQuery)}&orientation=portrait&w=300&h=400`,
      {
        headers: {
          'Authorization': `Client-ID ${UNSPLASH_ACCESS_KEY}`
        }
      }
    );
    
    if (response.ok) {
      const data = await response.json();
      return data.urls.small;
    }
  } catch (error) {
    console.error('Failed to fetch player photo:', error);
  }
  
  // Fallback to a default avatar
  return `https://ui-avatars.com/api/?name=${encodeURIComponent('Player')}&background=6366f1&color=fff&size=300`;
};

// Alternative: Pexels API
const PEXELS_API_KEY = 'your-pexels-api-key';

export const getPlayerPhotoFromPexels = async (nationality: string) => {
  try {
    const searchQuery = `esports gamer ${nationality} portrait`;
    const response = await fetch(
      `https://api.pexels.com/v1/search?query=${encodeURIComponent(searchQuery)}&per_page=1&orientation=portrait`,
      {
        headers: {
          'Authorization': PEXELS_API_KEY
        }
      }
    );
    
    if (response.ok) {
      const data = await response.json();
      if (data.photos && data.photos.length > 0) {
        return data.photos[0].src.medium;
      }
    }
  } catch (error) {
    console.error('Failed to fetch player photo from Pexels:', error);
  }
  
  return `https://ui-avatars.com/api/?name=${encodeURIComponent('Player')}&background=6366f1&color=fff&size=300`;
};
