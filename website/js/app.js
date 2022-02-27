
/**
 * Start of Global Variables.
 */


// obtain specific elements from the DOM:
const movieTitleObject = document.querySelector('#movie__title');
const searchBtnObject = document.querySelector('#search__btn');
const MoviesListObject = document.querySelector('#similar__movies');


// api credential:
const apiKey = '58ca8c5765590f0ebe6f99645818bb89';
const baseURL = `https://api.themoviedb.org/3`;

let movieTitle = '';
let movieID = '';
let similarMovies = [];
let moviesDesiredData = [];


/**
 * End of Global Variables.
 *
 * Start of Helper Functions.
 */


/**
 * @description Get user's favorite movie title.
 */
const getMovieTitle = async () => {
    if (movieTitleObject.value.trim() !== '') {
        movieTitle = movieTitleObject.value.trim();

        // post movie title into the server:
        await postMovieTitle('/postMovieTitle', {title: movieTitle});
    }
};


/**
 * @description POST data into the server.
 * @param {String} url
 * @param {Object} data
 */
 const postMovieTitle = async (url, data) => {
    const requestHeader = {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    };

    try {
        const response = await fetch(url, requestHeader);

    } catch (error) {
        console.log(`error: ${error}`);
    }
};


/**
 * @description Fetch API data of user's favorite movie to get movie ID.
 */
const obtainMovieID = async () => {
    const url = `${baseURL}/search/movie?api_key=${apiKey}&query=${movieTitle.split(' ').join('+')}`;

    try {
        const response = await fetch(url);
        const favoriteMovieDetails = await response.json();

        movieID = favoriteMovieDetails.results[0].id;

    } catch (error) {
        console.log(`error: ${error}`);
    }
};


/**
 * @description Extract specific details about each movie.
 */
const extractMoviesData = () => {
    // clear the previously captured movies:
    moviesDesiredData = [];

    for (let i=0; i<similarMovies.length; i++) {
        // format the release date of the movie:
        let formatDate = new Date(similarMovies[i].release_date).toDateString().split(' ');
        formatDate = `${formatDate[1]} ${formatDate[2]}, ${formatDate[3]}`;

        // construct movie object:
        const singleMovie = {
            id: similarMovies[i].id,
            title: similarMovies[i].title,
            posterURL: `https://image.tmdb.org/t/p/w500${similarMovies[i].poster_path}`,
            userScore: Math.round(similarMovies[i].vote_average * 10),
            releaseDate: formatDate,
        };

        // append the created movie object into the array:
        moviesDesiredData.push(singleMovie);
    }
};


/**
 * End of Helper Functions.
 *
 * Start of Main Functions.
 */


/**
 * @description Find datails about the entered movie title.
 */
const findMovieDetails = async () => {
    // get user's favorite movie title:
    await getMovieTitle();

    // obtain current movie ID:
    await obtainMovieID();

    // find similar movies:
    await findSimilarMovies();

    // extract specific details about movies:
    extractMoviesData();

    // display the movies into movie cards:
    displaySimilarMovies();
};


/**
 * @description Find movies similar to the favorite movie of the user.
 */
const findSimilarMovies = async () => {
    const url = `${baseURL}/movie/${movieID}/similar?api_key=${apiKey}&language=en-US&page=1`;

    const response = await fetch(url);
    const resultsObject = await response.json();

    similarMovies = resultsObject.results;
};


/**
 * @description Display the list of similar movies.
 */
 const displaySimilarMovies = () => {
    // clear displayed movies list:
    MoviesListObject.innerHTML = '';

    const fragment = document.createDocumentFragment();
    for (let i=0; i<moviesDesiredData.length; i++) {
        // create empty <li> element to contain movie details:
        const movieCardObject = document.createElement('li');
        movieCardObject.classList.add('movie__card');

        // construct the details of a specific movie:
        movieCardObject.innerHTML =
        `
            <img src="${moviesDesiredData[i].posterURL}" alt="Movie Poster Image" class="movie__poster">
            <div class="movie__details">
                <div class="user__score"><span id="value">${moviesDesiredData[i].userScore}</span><span id="percentage">&percnt;</span></div>
                <h2 class="movie__title">${moviesDesiredData[i].title}</h2>
                <h2 class="release__date">${moviesDesiredData[i].releaseDate}</h2>
            </div>
        `;

        // append movie card to the virtual element:
        fragment.append(movieCardObject);
    }

    // append the virtual element to the <ul> element:
    MoviesListObject.append(fragment);
};


/**
 * End of Main Functions.
 *
 * Start of Event Listeners.
 */


// main entry point:
document.addEventListener('DOMContentLoaded', () => {
    // listen to search button 'click' events:
    searchBtnObject.addEventListener('click', findMovieDetails);
});


/**
 * End of Event Listeners.
 */
