import { useState, useEffect } from 'react'
import { Link } from "react-router-dom"
import { useParams, useNavigate } from "react-router-dom"
import axios from 'axios';

const ShowMore = () => {
    const { id } = useParams();
    const [movie, setMovie] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {

        const fetchMovie = async () => {
            try {
    
                // TODO: fix plaintext
                const url = `http://www.omdbapi.com/?i=${id}&apikey=${import.meta.env.VITE_OMDB_API_KEY}`;
        
                console.log(url); // TODO: delete this
        
                const response = await axios.get(url);
        
                console.log(response); // For debugging
        
                if (response.data.Response === "True") {
                    setMovie(response.data);
                } else {
                    setError(response.data.Error);
                }
            } catch (error) {
                console.error("Error fetching the movie data:", error);
                setError(error.message.concat(". I pinky promise it's not my fault."));
            }
        }

        fetchMovie();

    }, [id]);

    const navigate = useNavigate();

    const goBack = () => {
        navigate(-1);
    };


    return (
        <>
            <div className="float">
                {movie.Poster === "N/A" ? (
                <p className="no-image">No Image Available</p>
                ) : (
                <img className="movie-card-detail" src={movie.Poster} alt={movie.Title} />
                )}

                <div className="more-info">
                    <h2 className="movie-title">{movie.Title}</h2>
                    <h2 className="movie-year">{movie.Year}</h2>
                    <div>
                        <p><b>Runtime:</b> {movie.Runtime}</p>
                        <p><b>Genre:</b> {movie.Genre}</p>
                        <p><b>Director:</b> {movie.Director}</p>
                        <p><b>Writer:</b> {movie.Writer}</p>
                        <p><b>Actors:</b> {movie.Actors}</p>
                        <p><b>Plot:</b> {movie.Plot}</p>
                        <p><b>Language:</b> {movie.Language}</p>
                        <p><b>Country:</b> {movie.Country}</p>
                        <p><b>Awards:</b> {movie.Awards}</p>
                        <p><b>IMDB rating:</b> {movie.imdbRating} </p>
                        <p><b>Type:</b> {movie.Type && (movie.Type.charAt(0).toUpperCase() + movie.Type.slice(1))} </p>
                        <p><b>Box Office:</b> {movie.BoxOffice}</p>
                    </div>
                </div>
            </div>

            {/* <Link to="/">Home</Link> */}
            <button onClick={goBack}>Go Back</button>

        </>
    )
}

export default ShowMore