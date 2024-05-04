import { useEffect, useState, useRef } from 'react';
import StarRating from './StarRating';
import { useMovies } from './useMovies';
import { useLocalStorageState } from './useLocalStorageState';
import { useKeystroke } from './useKeystroke';

const API_KEY = 'dc022b7f';

const average = (arr) => arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);

export default function App() {
  const [query, setQuery] = useState('');
  const [selectedId, setSelectedId] = useState(null);
  const { movies, isLoading, error } = useMovies(query);
  const [watched, setWatched] = useLocalStorageState('watched', []);

  function handleSelectedMovie(id) {
    setSelectedId((currSelectedId) => (id === currSelectedId ? null : id));
  }

  function handleCloseMovie() {
    setSelectedId(null);
  }

  function handleWatchedMovie(movie) {
    setWatched((currWatched) => [...currWatched, movie]);
  }

  function handleDeleteWatched(id) {
    setWatched((currWatched) => currWatched.filter((movie) => movie.imdbID !== id));
  }

  return (
    <>
      <NavBar>
        <Search query={query} setQuery={setQuery} />
        <NumResults movies={movies} />
      </NavBar>

      <Main>
        <Box>
          {isLoading && <Loader />}
          {!isLoading && !error && (
            <MovieList movies={movies} onSelectedMovie={handleSelectedMovie} />
          )}
          {error && <ErrorMessage error={error} />}
        </Box>

        <Box>
          {selectedId ? (
            <SelectedMovie
              selectedId={selectedId}
              onCloseMove={handleCloseMovie}
              onAddWatchedMovie={handleWatchedMovie}
              watched={watched}
            />
          ) : (
            <>
              <WatchedSummary watched={watched} />
              <WatchedMoviesList watched={watched} onDeleteWatched={handleDeleteWatched} />
            </>
          )}
        </Box>
      </Main>
    </>
  );
}

function Loader() {
  return <p className='loader'>Loading...</p>;
}

function ErrorMessage({ error }) {
  return (
    <p className='error'>
      <span>🛑</span> {error}
    </p>
  );
}

function NavBar({ children }) {
  return (
    <nav className='nav-bar'>
      <Logo />
      {children}
    </nav>
  );
}

function Logo() {
  return (
    <div className='logo'>
      <span role='img'>🍿</span>
      <h1>usePopcorn</h1>
    </div>
  );
}

function Search({ query, setQuery }) {
  const inputEl = useRef(null);

  useKeystroke('Enter', function () {
    if (document.activeElement === inputEl.current) return;
    inputEl.current.focus();
    setQuery('');
  });

  return (
    <input
      className='search'
      type='text'
      placeholder='Search movies...'
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      ref={inputEl}
    />
  );
}

function NumResults({ movies }) {
  return (
    <p className='num-results'>
      Found <strong>{movies.length}</strong> results
    </p>
  );
}

function Main({ children }) {
  return <main className='main'>{children}</main>;
}

function Box({ children }) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className='box'>
      <button className='btn-toggle' onClick={() => setIsOpen((open) => !open)}>
        {isOpen ? '–' : '+'}
      </button>
      {isOpen && children}
    </div>
  );
}

function MovieList({ movies, onSelectedMovie }) {
  return (
    <ul className='list list-movies'>
      {movies?.map((movie) => (
        <Movie movie={movie} key={movie.imdbID} onSelectedMovie={onSelectedMovie} />
      ))}
    </ul>
  );
}

function Movie({ movie, onSelectedMovie }) {
  return (
    <li onClick={() => onSelectedMovie(movie.imdbID)}>
      <img src={movie.Poster} alt={`${movie.Title} poster`} />
      <h3>{movie.Title}</h3>
      <div>
        <p>
          <span>🗓</span>
          <span>{movie.Year}</span>
        </p>
      </div>
    </li>
  );
}

function WatchedSummary({ watched }) {
  const avgImdbRating = average(watched.map((movie) => movie.imdbRating));
  const avgUserRating = average(watched.map((movie) => movie.userRating));
  const avgRuntime = average(watched.map((movie) => movie.runtime));

  return (
    <div className='summary'>
      <h2>Movies you watched</h2>
      <div>
        <p>
          <span>#️⃣</span>
          <span>{watched.length} movies</span>
        </p>
        <p>
          <span>⭐️</span>
          <span>{avgImdbRating.toFixed(1)}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{avgUserRating.toFixed(1)}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{avgRuntime} min</span>
        </p>
      </div>
    </div>
  );
}

function WatchedMoviesList({ watched, onDeleteWatched }) {
  return (
    <ul className='list'>
      {watched.map((movie) => (
        <WatchedMovie movie={movie} key={movie.imdbID} onDeleteWatched={onDeleteWatched} />
      ))}
    </ul>
  );
}

function WatchedMovie({ movie, onDeleteWatched }) {
  return (
    <li>
      <img src={movie.poster} alt={`${movie.title} poster`} />
      <h3>{movie.title}</h3>
      <div>
        <p>
          <span>⭐️</span>
          <span>{movie.imdbRating}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{movie.userRating}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{movie.runtime} min</span>
        </p>
        <button className='btn-delete' onClick={() => onDeleteWatched(movie.imdbID)}>
          X
        </button>
      </div>
    </li>
  );
}

function SelectedMovie({ selectedId, onCloseMove, onAddWatchedMovie, watched }) {
  const [selectedMovie, setSelectedMovie] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [userRating, setUserRating] = useState(0);

  const countRating = useRef(0);

  useEffect(() => {
    if (userRating) countRating.current += 1;
  }, [userRating]);

  const isWatched = watched.map((movie) => movie.imdbID).includes(selectedId);

  const watchedUserRating = watched.find((movie) => movie.imdbID === selectedId)?.userRating;

  const {
    Title: title,
    Year: year,
    Poster: poster,
    Runtime: runtime,
    imdbRating,
    Plot: plot,
    Released: released,
    Actors: actors,
    Director: director,
    Genre: genre,
  } = selectedMovie;

  function handleAddWatchedMovie() {
    const newWatchedMovie = {
      imdbID: selectedId,
      title,
      year,
      poster,
      runtime: Number(runtime.replace(' min', '')),
      imdbRating: Number(imdbRating),
      userRating,
      contRatingDecisions: countRating.current,
    };

    onAddWatchedMovie(newWatchedMovie);
    onCloseMove();
  }

  useKeystroke('Escape', onCloseMove);

  useEffect(() => {
    async function fetchSelectedMovie() {
      try {
        setError('');
        setIsLoading(true);

        const response = await fetch(`http://www.omdbapi.com/?apikey=${API_KEY}&i=${selectedId}`);

        if (!response.ok) setError('Failed to fetch movie details');

        const data = await response.json();

        setSelectedMovie(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    }
    fetchSelectedMovie();
  }, [selectedId]);

  useEffect(() => {
    if (!title) return;
    document.title = `Movie | ${title}`;

    return function () {
      document.title = 'usePopcorn';
    };
  }, [title]);

  return (
    <div className='details'>
      {isLoading && <Loader />}
      {error && <ErrorMessage error={error} />}
      {!isLoading && !error && (
        <>
          <header>
            <button className='btn-back' onClick={onCloseMove}>
              &larr;
            </button>
            <img src={poster} alt={`Poster of ${title}`} />
            <div className='details-overview'>
              <h2>{title}</h2>
              <p>
                {released} &bull; {runtime}
              </p>
              <p>{genre}</p>
              <p>
                <span>⭐️</span>
                {imdbRating} IMDB Rating
              </p>
            </div>
          </header>
          <section>
            <div className='rating'>
              {!isWatched ? (
                <>
                  <StarRating
                    maxRating={10}
                    textSize={24}
                    starSize={24}
                    onSetRating={setUserRating}
                  />
                  {userRating > 0 && (
                    <button className='btn-add' onClick={handleAddWatchedMovie}>
                      + add to list
                    </button>
                  )}
                </>
              ) : (
                <p>
                  You already rated this movie {watchedUserRating} <span>⭐️</span>
                </p>
              )}
            </div>
            <p>
              <em>{plot}</em>
            </p>
            <p>Starring {actors}</p>
            <p>Directed by {director}</p>
          </section>
        </>
      )}
    </div>
  );
}
