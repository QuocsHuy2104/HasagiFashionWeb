import { useEffect, useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';

const useFavoriteCount = () => {
  const [favoriteCount, setFavoriteCount] = useState(0);

  const fetchFavoriteCount = async () => {
    const accountId = Cookies.get('accountId'); // Lấy accountId từ cookie
    try {
      const response = await axios.get(`http://localhost:3000/api/favorites/count/${accountId}`, { withCredentials: true });
      setFavoriteCount(response.data);
    } catch (error) {
      console.error("Error fetching favorite count:", error.response?.data || error.message);
    }
  };

  useEffect(() => {
    fetchFavoriteCount();
  }, []); // Chạy khi component được mount

  return { favoriteCount, fetchFavoriteCount };
};

export default useFavoriteCount;
