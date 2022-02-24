
/**
 * Start of Global Variables.
 */


// obtain specific elements from the DOM:
const movieTitleObject = document.querySelector('#movie__title');
const searchBtnObject = document.querySelector('#search__btn');


// api credential:
const apiKey = "58ca8c5765590f0ebe6f99645818bb89";
const baseURL = `https://api.themoviedb.org/3/movie/550?api_key=${apiKey}`;

let movieTitle = '';
let favoriteMovieDetails = {};


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
 * @description Fetch API data of user's favorite movie.
 * @param {String} movieTitle
 */
 const obtainMovieData = async () => {
    const url = `${baseURL}&query=${movieTitle.split(' ').join('+')}`;
    console.log(url);

    try {
        const response = await fetch(url);
        favoriteMovieDetails = await response.json();

        console.log(favoriteMovieDetails);
    } catch (error) {
        console.log(`error: ${error}`);
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

    // obtain current movie data:
    await obtainMovieData();
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
