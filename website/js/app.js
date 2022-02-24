
/**
 * Start of Global Variables.
 */

// obtain specific elements from the DOM:
const movieTitleObject = document.querySelector('#movie__title');
const searchBtnObject = document.querySelector('#search__btn');


/**
 * End of Global Variables.
 *
 * Start of Helper Functions.
 */

/**
 * @description Get user's favorite movie title.
 */
 const getMovieTitle = () => {
    if (movieTitleObject.value.trim() !== '') {
        const movieTitle = movieTitleObject.value.trim();
        console.log(movieTitle);
    }
};


/**
 * End of Helper Functions.
 *
 * Start of Main Functions.
 */


/**
 * End of Main Functions.
 *
 * Start of Event Listeners.
 */

// main entry point:
document.addEventListener('DOMContentLoaded', () => {
    // listen to search button 'click' events:
    searchBtnObject.addEventListener('click', getMovieTitle);
});


/**
 * End of Event Listeners.
 */
