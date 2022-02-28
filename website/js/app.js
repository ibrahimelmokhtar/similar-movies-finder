
/**
 * Start of Global Variables.
 */


// obtain specific elements from the DOM:
const movieTitleObject = document.querySelector('#movie__title');
const searchBtnObject = document.querySelector('#search__btn');
const moviesListObject = document.querySelector('#similar__movies');
const movieContainerObject = document.querySelector('.movie__container');
const searchCloseIconObject = document.querySelector('form .close__icon');


// api credential:
const apiKey = '58ca8c5765590f0ebe6f99645818bb89';
const baseURL = `https://api.themoviedb.org/3`;

let movieTitle = '';
let movieID = '';
let similarMovies = [];
let moviesDesiredData = [];
let clickedMovieDetails = {};


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
 * @description Convert the movie runtime into actual time format.
 * @param {Number} runtime
 * @returns {String} formatted time as (hh mm)
 */
const convertMovieRuntime = (runtime) => {
    let formatTime = new Date(runtime * 1000).toISOString();
    if (runtime < 3600) {
        formatTime = formatTime.substr(14, 5);
    }
    else {
        formatTime = formatTime.substr(11, 8);
    }

    formatTime = formatTime.split(':');
    formatTime = `${formatTime[0]}h ${formatTime[1]}m`;

    return formatTime;
};


/**
 * @description Extract genres types for each movie.
 * @param {Array Object} genres
 * @returns {Array Object} extracted genres
 */
const extractMovieGenres =(genres) => {
    let extractedGenres = [];
    for (let i=0; i<genres.length; i++) {
        extractedGenres.push(genres[i].name);
    }
    return extractedGenres;
};


/**
 * @description Fetch API data to get movie details.
 */
const obtainMovieDetails = async (currentMovieIndex, currentMovieID) => {
    const url = `${baseURL}/movie/${currentMovieID}?api_key=${apiKey}`;

    try {
        const response = await fetch(url);
        const currentMovieDetails = await response.json();

        // format movie runtime into actual time:
        const formatTime = convertMovieRuntime(currentMovieDetails.runtime);

        // extract movie genres:
        const movieGenres = extractMovieGenres(currentMovieDetails.genres);

        // construct desired movie details:
        clickedMovieDetails = {
            id: moviesDesiredData[currentMovieIndex].id,
            title: moviesDesiredData[currentMovieIndex].title,
            posterURL: moviesDesiredData[currentMovieIndex].posterURL,
            userScore: moviesDesiredData[currentMovieIndex].userScore,
            releaseDate: moviesDesiredData[currentMovieIndex].releaseDate,
            overview: currentMovieDetails.overview,
            tagline: currentMovieDetails.tagline,
            year: new Date(currentMovieDetails.release_date).getFullYear(),
            runtime: formatTime,
            genres: movieGenres,
        };

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
 * @description Remove repeated movies from the Web API result.
 */
const removeRepeatedMovies = () => {
    for (let i=0; i<similarMovies.length; i++) {
        for (let j=i+1; j<similarMovies.length; j++) {
            const condition = (similarMovies[j].title === similarMovies[i].title) &&
                                (similarMovies[j].release_date === similarMovies[i].release_date);
            if (condition) {
                similarMovies.splice(j, 1);
            }
        }
    }
};


/**
 * @description Clear the displayed output.
 */
const clearDisplayedOutput = () => {
    // clear the search bar:
    movieTitleObject.value = '';

    // clear the displayed movie cards:
    moviesListObject.innerHTML = '';
};


/**
 * End of Helper Functions.
 *
 * Start of Main Functions.
 */


/**
 * @description Find datails about the entered movie title.
 */
const startSearching = async () => {
    // get user's favorite movie title:
    await getMovieTitle();

    // obtain current movie ID:
    await obtainMovieID();

    // find similar movies:
    similarMovies = [];
    for (let i=1; i<=2; i++) {
        await findSimilarMovies(i);
    }

    // remove repeated entries of movies:
    removeRepeatedMovies();

    // extract specific details about movies:
    extractMoviesData();

    // sort the collected movies:
    sortMovies();

    // display the movies into movie cards:
    displaySimilarMovies();
};


/**
 * @description Find movies similar to the favorite movie of the user.
 */
const findSimilarMovies = async (pageNumber) => {
    const url = `https://api.themoviedb.org/3/movie/${movieID}/recommendations?api_key=${apiKey}&language=en-US&page=${pageNumber}`;

    try {
        const response = await fetch(url);
        const resultsObject = await response.json();

        // unpack the obtained result:
        similarMovies.push(...resultsObject.results);

    } catch (error) {
        console.log(`error: ${error}`);
    }
};


/**
 * @description Apply 'Insertion Sort' to sort the movies based on their user score.
 */
 const sortMovies = () => {
    // sort the array from lowest to highest:
    for (let i=1; i<moviesDesiredData.length; i++) {
        let lastSortedIndex = i;
        let currentMovie = moviesDesiredData[i];

        for (let j=i-1; j>=0; j--) {
            if (currentMovie.userScore < moviesDesiredData[j].userScore) {
                // swap the TWO movies:
                let temp = moviesDesiredData[j];
                moviesDesiredData[j] = currentMovie;
                moviesDesiredData[lastSortedIndex] = temp;

                // update last sorted index:
                lastSortedIndex = j;
            }
            else {
                break;
            }
        }
    }

    // reverse the array to be sorted from highest to lowest:
    moviesDesiredData.reverse();
};


/**
 * @description Display the list of similar movies.
 */
 const displaySimilarMovies = () => {
    // clear displayed movies list:
    moviesListObject.innerHTML = '';

    const fragment = document.createDocumentFragment();

    for (let i=0; i<moviesDesiredData.length; i++) {
        // create empty <li> element to contain movie details:
        const movieCardObject = document.createElement('li');
        movieCardObject.classList.add('movie__card');
        movieCardObject.setAttribute('data-id', moviesDesiredData[i].id);
        movieCardObject.setAttribute('data-index', i);

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
    moviesListObject.append(fragment);
};


/**
 * @description Display clicked movie details.
 * @param {Event} event
 */
const showMoreDetails = async (event) => {
    // different levels of parent nodes:
    const firstLevelParent = event.target.parentNode;
    const secondLevelParent = event.target.parentNode.parentNode;
    const thirdLevelParent = event.target.parentNode.parentNode.parentNode;

    // desired data to be collected from the event target:
    let currentMovieIndex = null;
    let currentMovieID = null;

    // determine the fired event target:
    if (firstLevelParent.hasAttribute('data-id')) {
        currentMovieIndex = firstLevelParent.getAttribute('data-index');
        currentMovieID = firstLevelParent.getAttribute('data-id');
    }
    else if (secondLevelParent.hasAttribute('data-id')) {
        currentMovieIndex = secondLevelParent.getAttribute('data-index');
        currentMovieID = secondLevelParent.getAttribute('data-id');
    }
    else if (thirdLevelParent.hasAttribute('data-id')) {
        currentMovieIndex = thirdLevelParent.getAttribute('data-index');
        currentMovieID = thirdLevelParent.getAttribute('data-id');
    }

    if (currentMovieID !== null) {
        // extract movie details:
        await obtainMovieDetails(currentMovieIndex, currentMovieID);

        // display movie details:
        displayMovieDetails();
    }
};


/**
 * @description Display collected details about the clicked movie card.
 */
const displayMovieDetails = () => {
    // set the values with the currently clicked movie card details:
    movieContainerObject.innerHTML =
    `
        <div class="single__movie">
            <i class="fas fa-times close__icon"></i>
            <img src="${clickedMovieDetails.posterURL}" alt="Movie Poster Image">
            <div class="details__container">
                <div class="main__title">
                    <h2>${clickedMovieDetails.title} <span class="year">(${clickedMovieDetails.year})</span></h2>
                    <ul>
                        <li>${clickedMovieDetails.releaseDate}</li>
                        <li>${clickedMovieDetails.genres.join(', ')}</li>
                        <li>${clickedMovieDetails.runtime}</li>
                    </ul>
                </div>
                <div class="user__score"><span id="value">${clickedMovieDetails.userScore}</span><span id="percentage">&percnt;</span></div>
                <div class="movie__tagline">${clickedMovieDetails.tagline}</div>
                <div class="movie__overview">
                    <h2>Overview</h2>
                    <p>${clickedMovieDetails.overview}</p>
                </div>
            </div>
        </div>
    `;

    // update the (left) style attribute to show the movie container:
    movieContainerObject.style.left = 0;
};


/**
 * End of Main Functions.
 *
 * Start of Event Listeners.
 */


// main entry point:
document.addEventListener('DOMContentLoaded', () => {
    // listen to search button 'click' events:
    searchBtnObject.addEventListener('click', startSearching);

    searchCloseIconObject.addEventListener('click', clearDisplayedOutput);

    // listen to movie cards 'click' events:
    moviesListObject.addEventListener('click', showMoreDetails);
});


/**
 * End of Event Listeners.
 */
