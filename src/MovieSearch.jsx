import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation, useParams } from 'react-router-dom'
import PageButtonPanel from './PageButtonPanel';
import axios from 'axios';

const MovieSearch = () => {
    const [movies, setMovies] = useState([]); // Holds list of movies returned
    const [results, setResults] = useState('');
    const [query, setQuery] = useState('');
    const [year, setYear] = useState('');
    const [page, setPage] = useState('1');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
    const location = useLocation();

    // Parse query parameters
    const params = new URLSearchParams(location.search);
    const q = params.get('q') || '';
    const y = params.get('y') || '';
    const p = params.get('p') || '1';

    useEffect(() => {
        setQuery(q);
        setYear(y);
        setPage(p);
        if (q) {
            fetchMovies(q, y, p);
        }
    }, [location.search]); // previous was [q, y, p]
  
    const fetchMovies = async (queryToFetch = query, yearToFetch = year, pageToFetch = '1') => {

      setLoading(true);

      try {
  
        // TODO: fix plaintext
        let url = `http://www.omdbapi.com/?s=${queryToFetch}&apikey=${import.meta.env.VITE_OMDB_API_KEY}`;
  
        if (yearToFetch.trim()) {
          url +=`&y=${yearToFetch}`;
        }
  
        if (pageToFetch.trim()) {
          url += `&page=${pageToFetch}`;
        }

        setPage(pageToFetch) // Line added bc this will render soon
  
        //console.log(url); // TODO: delete this
  
        const response = await axios.get(url);
        console.log(response); // For debugging

        if (response.data.Response === "True") {
          setMovies(response.data.Search); // Set the list of movies
          setResults(response.data.totalResults);
          setError('');
        } else {
          setError(response.data.Error);
          setResults(0);
          setMovies([]);
        }
      } catch (error) {
        console.error("Error fetching the movie data:", error);
        setError(error.message.concat(". I pinky promise it's not my fault."));
        setResults(0);
        setMovies([]);
      } finally {
        setLoading(true);
      }
    };
  
    const handleSearch = (e) => {
      e.preventDefault();

      const params = new URLSearchParams();
      
      if (query.trim()) params.append('q', query);
      if (year.trim()) params.append('y', year);
    
      // Navigate to the new URL with query parameters
      navigate(`/search?${params.toString()}`);
      
      //fetchMovies();
    };
  
    const handleNext = () => {
      // These two lines are similar bc setPage does not rerender the page
      //setPage(`${parseInt(page, 10) + 1}`);

      const pageToGo = parseInt(page, 10) + 1;

      const params = new URLSearchParams();
      
      if (query.trim()) params.append('q', query);
      if (year.trim()) params.append('y', year);
      params.append('p', pageToGo);
    
      // Navigate to the new URL with query parameters
      navigate(`/search?${params.toString()}`);

      //fetchMovies(query, year, `${pageToGo}`);
      jumpToTop();
    }
  
    const handlePrev = () => {
      //setPage(`${parseInt(page, 10) - 1}`);
      let pageToGo = parseInt(page, 10) - 1

      const params = new URLSearchParams();
      
      if (query.trim()) params.append('q', query);
      if (year.trim()) params.append('y', year);
      params.append('p', pageToGo);
    
      // Navigate to the new URL with query parameters
      navigate(`/search?${params.toString()}`);

      //fetchMovies(query, year, `${pageToGo}`);
      jumpToTop();
    }
  
    const handleFirstPage = () => {
      //setPage("1");

      const params = new URLSearchParams();
      
      if (query.trim()) params.append('q', query);
      if (year.trim()) params.append('y', year);
      params.append('p', '1');
    
      // Navigate to the new URL with query parameters
      navigate(`/search?${params.toString()}`);

      //fetchMovies();
      jumpToTop();
    }
  
    const handleLastPage = () => {
      const lastPage = Math.ceil(parseInt(results, 10) / 10);
      //setPage(lastPage.toString());

      const params = new URLSearchParams();
      
      if (query.trim()) params.append('q', query);
      if (year.trim()) params.append('y', year);
      params.append('p', lastPage);
    
      // Navigate to the new URL with query parameters
      navigate(`/search?${params.toString()}`);


      fetchMovies(query, year, lastPage.toString());
      jumpToTop();
    }
  
    const jumpToTop = () => {
      window.scrollTo({
        top: 0,
        behavior: 'auto'
      });
    };
  
    const scrollToTop = () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth' // This makes the scroll smooth
      });
    };
  
    return (
      <div>
        <h1> Movie Finder </h1>
        <form onSubmit={handleSearch}>
          <input 
            type="text" 
            value={query} 
            onChange={(e) => setQuery(e.target.value)} 
            placeholder="Search for a movie..."
          />
          
          <input 
            type="text" 
            value={year} 
            onChange={(e) => setYear(e.target.value)} 
            placeholder="Specify a year (optional)"
          /> 
          <button type="submit">Search</button>
        </form>
  
        <div>
          {movies && movies.length > 0 ? (
          <>
            <p> {results} results found </p>
            <p> Page {page} of {Math.ceil(parseInt(results, 10) / 10)} </p>

            {/* TODO: Need loading thing just in case */}
  
            <PageButtonPanel
                    handleFirstPage={handleFirstPage}
                    handleNext={handleNext}
                    handlePrev={handlePrev}
                    handleLastPage={handleLastPage}
                    page={page}
                    results={results}
            />
  
            <br></br>
  
            <div className="movies-container">
              {movies.map((movie) => (
                <div className="movie-card" key={movie.imdbID}>
                  <div className="movie-info">
                    <h2 className="movie-title">{movie.Title}</h2>
                    <h2 className="movie-year">{movie.Year}</h2>
                    <Link to={`/more/${movie.imdbID}`}>Show More</Link>
                  </div>
                  {movie.Poster === "N/A" ? (
                    <p className="no-image">No Image Available</p>
                  ) : (
                    <img className="movie-poster" src={movie.Poster} alt={movie.Title} />
                  )}
                </div>
              ))}
            </div>
  
            <PageButtonPanel
                    handleFirstPage={handleFirstPage}
                    handleNext={handleNext}
                    handlePrev={handlePrev}
                    handleLastPage={handleLastPage}
                    page={page}
                    results={results}
            />
  
            <br></br>
            <br></br>
            <button onClick={scrollToTop}> Go to Top </button>
  
          </>
          ) : (
            error ? (
              <p>{error}</p>
            ) : (
              loading ? (
                <p>Loading...</p>
              ) : 
                <p>No movies found.</p>
            )
          )}
        </div>
  
      </div>
    );
  };
  
export default MovieSearch;