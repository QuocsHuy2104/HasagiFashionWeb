import { useEffect, useState } from 'react';
import ShopDetailService from '../../../services/ProductDetail';
const useFavoriteCount = () => {
  const [favoriteCount, setFavoriteCount] = useState(0);

  const fetchFavoriteCount = async () => {
    try {
      const response = await ShopDetailService.getAllFavorites();
      if (response && response.data !== undefined) {
        setFavoriteCount(response.data);
      }
    } catch (error) {
      console.error("Error fetching favorite count:", error.response?.data || error.message);
    }
  };

  useEffect(() => {
    fetchFavoriteCount();
    const intervalId = setInterval(() => {
      fetchFavoriteCount();
  }, 500);
  return () => {
      clearInterval(intervalId);
  };
  }, []); 

  return { favoriteCount, fetchFavoriteCount };
};

export default useFavoriteCount;
