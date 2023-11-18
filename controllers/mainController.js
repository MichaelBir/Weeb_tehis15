const express = require('express');
const axios = require('axios');
const http = require('http');


exports.getMainPage = (req, res) => {
    res.render('index', { movieDetails:''});
}

exports.PostMainPage = (req, res) => {
    let movieTitle = req.body.movieTitle;

    console.log (movieTitle);

    let movieUrl = `https://api.themoviedb.org/3/search/movie?api_key=e0311f3f77cbf90171a1e025d2c61744&query=${movieTitle}`;
    let genresUrl ='https://api.themoviedb.org/3/genre/movie/list?api_key=e0311f3f77cbf90171a1e025d2c61744&language=en-US';

    let endpoint = [movieUrl, genresUrl];


    axios.all(endpoint.map((endpoint)=> axios.get(endpoint)))
        .then(axios.spread((movie, genres) => {

            const [movieRaw] = movie.data.results;
            let movieGenreId = movieRaw.genre_ids;
            let movieGenres = genres.data.genres;

            let movieGenresArray = [];

            let movieGenersArray = [];
                for(let i = 0; i < movieGenreId.length; i++) {
                    for(let j = 0; j < movieGenres.length; j++) {
                        if(movieGenreId[i] === movieGenres[j].id) {
                    movieGenersArray.push(movieGenres[j].name)
                    }             
                }
            }
            let currentYear = new Date().getFullYear();

    //  console.log (movieGenersArray, movieGenreId, movieGenres, movieRaw);

            let genresToDisplay = '';
            movieGenersArray.forEach(genre => {
                genresToDisplay = genresToDisplay+ `${genre}, `;
            });

            genresToDisplay = genresToDisplay.slice(0, -2) + '.';

            let movieData  = {
                title: movieRaw.title,
                year: new Date(movieRaw.release_date).getFullYear(),
                genres: genresToDisplay,
                release: movieRaw.releaseYear,
                vote: movieRaw.vote_average,
                overview: movieRaw.overview,
                tagline: movieRaw.tagline,
                popularity: movieRaw.popularity,
                original_language: movieRaw.original_language,
                release_date: movieRaw.release_date,
                posterUrl: `https://image.tmdb.org/t/p/w500/${movieRaw.poster_path}`,
                backgroundUrl: `https://image.tmdb.org/t/p/w500/${movieRaw.backdrop_path}`,
                thisyear: currentYear
            };
            res.render('index', {movieDetails: movieData});
        }));
}


exports.PostSearchPage = ('/getmovie', (req, res) => {
	const movieToSearch =
		req.body.queryResult && req.body.queryResult.parameters && req.body.queryResult.parameters.movie
			? req.body.queryResult.parameters.movie
			: '';

	const reqUrl = encodeURI(
		`http://www.omdbapi.com/?t=${movieToSearch}&apikey=cc6f9d1b`
	);
	http.get(
		reqUrl,
		responseFromAPI => {
			let completeResponse = ''
			responseFromAPI.on('data', chunk => {
				completeResponse += chunk
			})
			responseFromAPI.on('end', () => {
				const movie = JSON.parse(completeResponse);
                if (!movie || !movie.Title) {
                    return res.json({
                        fulfillmentText: 'Sorry, we could not find the movie you are asking for.',
                        source: 'getmovie'
                    });
                }

				let dataToSend = movieToSearch;
				dataToSend = `${movie.Title} was released in the year ${movie.Year}. It is directed by ${
					movie.Director
				} and stars ${movie.Actors}.\n Here some glimpse of the plot: ${movie.Plot}.`;

				return res.json({
					fulfillmentText: dataToSend,
					source: 'getmovie'
				});
			})
		},
		error => {
			return res.json({
				fulfillmentText: 'Could not get results at this time',
				source: 'getmovie'
			});
		}
	)
});