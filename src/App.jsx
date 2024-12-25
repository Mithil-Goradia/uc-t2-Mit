import React, { useEffect, useState } from 'react';
import './App.css';
import Swal from 'sweetalert2';
import { Link } from 'react-router-dom';

function App() {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [movies, setMovies] = useState([]);
  const [count, setCount] = useState(0);

  const toggleProfile = () => {
    setIsProfileOpen(!isProfileOpen);
  };

  useEffect(() => {
    fetch('http://localhost:3000/movies')
      .then((response) => response.json())
      .then((data) => {
        setMovies(data);
        setCount(data.length);
      });
  }, []);

  const addForm = () => {
    let view = document.getElementById('view');

    let card = document.createElement('div');
    card.className = 'flex flex-col gap-2 w-full lg:w-[50%] bg-[#433D8B] p-2 justify-center items-center rounded-lg mt-5';

    let name = document.createElement('input');
    name.placeholder = 'Enter name';
    name.className = 'rounded-lg p-1 w-full';
    card.appendChild(name);

    let genre = document.createElement('input');
    genre.placeholder = 'Genre';
    genre.className = 'rounded-lg p-1 w-full';
    card.appendChild(genre);

    let plat = document.createElement('input');
    plat.placeholder = 'Platform';
    plat.className = 'rounded-lg p-1 w-full';
    card.appendChild(plat);

    let but = document.createElement('button');
    but.className = 'rounded-xl border-solid border-2 border-[#C8ACD6] w-10 h-10 p-1 hover:scale-110 mt-2';
    but.onclick = () => {
      const newMovie = {
        title: name.value,
        genre: genre.value,
        platform: plat.value,
        status: false,
        favorite: false,
      };
      
      fetch('http://localhost:3000/movies', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newMovie),
      })
        .then((response) => response.json())
        .then((data) => {
          setMovies([data, ...movies]);
          setCount(count + 1);
          Swal.fire({
            title: 'Updated',
            text: 'Your movie is added to the list',
            icon: 'success',
          });
        });
    };
    let img = document.createElement('img');
    img.src = './done.png';
    but.appendChild(img);
    card.appendChild(but);

    view.appendChild(card);
  };

  const del = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!"
    }).then((result) => {
      if (result.isConfirmed) {
        fetch(`http://localhost:3000/movies/${id}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
        })
          .then((response) => {
            if (response.ok) {
              setMovies(movies.filter((movie) => movie.id !== id));
              setCount(count - 1);
              Swal.fire({
                title: "Deleted!",
                text: "Your movie has been removed from the list",
                icon: "success"
              });
            } else {
              Swal.fire({
                title: "Error",
                text: "There was an issue deleting the movie.",
                icon: "error"
              });
            }
          })
          .catch((error) => {
            console.error("Error deleting movie:", error);
            Swal.fire({
              title: "Error",
              text: "There was an issue deleting the movie.",
              icon: "error"
            });
          });
      }
    });
  };

  const watched = (id) => {
    fetch(`http://localhost:3000/movies/${id}`)
      .then((response) => response.json())
      .then((data) => {
        const doneMovie = {...data, status : true};

        fetch(`http://localhost:3000/movies/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(doneMovie),
        })
        .then((response) => response.json())
        .then((updatedData) => {
          setMovies((prevMovies) =>
            prevMovies.map((movie) =>
              movie.id === id ? { ...movie, status: true } : movie
            )
          );
        })
      });
  }

  const edit = (id) => {
    const editMovie = {
      title: prompt("title"),
      genre: prompt("genre"),
      platform: prompt("platform"),
    }

    fetch(`http://localhost:3000/movies/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(editMovie)
    })
    .then((response) => response.json())
    .then((data) => {
      setMovies((prevMovies) => prevMovies.map((movie) => movie.id === id? {...movie, editMovie} : movie))
    })
  }

  const addLike = (id) => {
    // Fetch the movie details
    const movie = movies.find((movie) => movie.id === id);

    // Save the liked movie to local storage
    let likedMovies = JSON.parse(localStorage.getItem('favorite')) || [];
    likedMovies.push(movie);
    localStorage.setItem('favorite', JSON.stringify(likedMovies));

    // Update state if needed
  }

  return (
    <div>
      <div className='flex flex-col lg:flex-row gap-[20px]'>
        {/* Profile Section */}
        <div className={`fixed top-4 left-4 lg:static lg:block ${isProfileOpen ? 'block' : 'hidden'} bg-[#17153B] h-[80vh] p-5 rounded-3xl z-50`}>
          <h1 className='font-extrabold text-center text-lg'>Profile</h1>
          <div className='flex gap-3 mt-5'>
            <div className='w-[80px] rounded-full border-solid border-4 border-[#C8ACD6] p-2'>
              <img src='./profile_icon.png' alt=''/>
            </div>
            <div>
              <p>Mithil Goradia</p>
              <p>Male</p>
              <p>mithilgoradia88@gmail.com</p>
            </div>
          </div>
          <div className='flex justify-evenly p-2 border-solid border-b-2 border-[#433D8B] pb-4'>
            <button className='py-1 px-3 mt-4 rounded-xl border-solid border-2 border-[#C8ACD6] w-24'>Logout</button>
            <button className='py-1 px-3 mt-4 rounded-xl border-solid border-2 border-[#C8ACD6] w-24'>Delete</button>
          </div>
          <div className='flex flex-col gap-3 mt-5'>
            <Link to="/liked" className='hover:bg-[#f0dff92a] '>Favorites</Link>
            <a className='hover:bg-[#f0dff92a]' >Genres</a>
            <a className='hover:bg-[#f0dff92a]'>Gate-keeping</a>
            <a className='hover:bg-[#f0dff92a]'>OTT platforms</a>
            <a className='hover:bg-[#f0dff92a]'>Watch Later</a>
            <a className='hover:bg-[#f0dff92a]'>Calendar</a>
          </div>
        </div>

        {/* Toggle Button for Smaller Screens */}
        <div className='lg:hidden fixed top-4 left-4 z-50'>
          <button onClick={toggleProfile} className='p-2 bg-[#433D8B] text-white rounded-full'>
            {isProfileOpen ? <img src='./arrow.png' className='w-[40px] rounded-full'/> : <img src='./home.png' className='w-[40px] rounded-full'/>}
          </button>
        </div>

        {/* Content Section */}
        <div className='flex flex-col bg-[#17153B] h-auto p-5 rounded-3xl w-full lg:w-[70%] items-center' id='view'>
          <p>Movie list</p>
          {/* Display the list of movies */}
          {movies.map((movie) => (
            <div key={movie.id} className='bg-[#433D8B] p-4 rounded-3xl w-full lg:w-[500px] flex justify-between gap-4 mb-4'>
              <div className='flex-1'>
                <div className='flex gap-4 items-center'>
                  <div className='w-[25px] h-[25px] rounded-full bg-[#f0dff9] text-[#17153B] text-center'>{movie.id}</div>
                  <h1
                  className={`font-extrabold text-xl leading-snug break-words text-[#f0dff9] ${
                   movie.status ? 'line-through' : ''
                  }`}
                  >{movie.title}</h1>
                </div>
                <div className='flex mt-4 gap-2'>
                  <h2 className='border-solid border-r-2 border-[#C8ACD6] px-2'>{movie.genre}</h2>
                  <h2 className='border-solid border-r-2 border-[#C8ACD6] px-2'>{movie.platform}</h2>
                </div>
              </div>
              <div className='flex flex-col gap-2 w-24 h-24 flex-wrap'>
                <button 
                  onClick={() => watched(movie.id)}
                  className='rounded-xl border-solid border-2 border-[#C8ACD6] w-10 h-10 p-1 hover:scale-110'>
                  <img src='./done.png'/>
                </button>
                <button 
                  onClick={() => del(movie.id)} // Pass movie ID to delete function
                  className='rounded-xl border-solid border-2 border-[#C8ACD6] w-10 h-10 p-1 hover:scale-110'>
                  <img src='./cut.png'/>
                </button>
                <button 
                  onClick={() => addLike(movie.id)} 
                  className='rounded-xl border-solid border-2 border-[#C8ACD6] w-10 h-10 p-1 hover:scale-110'>
                  <img src='./fav.png'/>
                </button>
                <button 
                  onClick={() => edit(movie.id)}
                  className='rounded-xl border-solid border-2 border-[#C8ACD6] w-10 h-10 p-1 hover:scale-110'>
                  <img src='./edit.png'/>
                </button>
              </div>
            </div>
          ))}

          <div className='w-full flex justify-end mt-5'>
            <button onClick={addForm}>
              <img src='./add.png' className='w-[40px] hover:scale-110 border-2 border-solid border-[#C8ACD6] rounded-full'/>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
