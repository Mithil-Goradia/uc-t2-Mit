import React, { useEffect, useState } from 'react';

const Liked = () => {
  const [likedMovies, setLikedMovies] = useState([]);

  useEffect(() => {
    const storedLikes = JSON.parse(localStorage.getItem('favorite')) || [];
    setLikedMovies(storedLikes);
  }, []);

  return (
    <div className='bg-[#3d2081] p-4 rounded-lg'>
      <h1 className='text-2xl text-white'>Liked Movies</h1>
      <ul className='mt-4'>
        {likedMovies.length > 0 ? (
          likedMovies.map((movie, index) => (
            <li key={index} className='text-lg text-white'>{movie.title}</li>
          ))
        ) : (
          <p className='text-white'>No liked movies</p>
        )}
      </ul>
    </div>
  );
};

export default Liked;
