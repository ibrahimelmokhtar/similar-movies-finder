
/**
 * Start of Global Variables.
 */

// Spin up the server:
const port = (process.env.PORT || 5000);    // required for Heroku hosting.
const hostName = '127.0.0.1';

const admin = 'mokhtar_admin';
const password = 'dCr8VswfF8uwHL2o';


/**
 * End of Global Variables.
 *
 * Start of Helper Functions.
 */

// Express to run server and routes:
const express = require('express');

// Dependencies:
const cors = require('cors');
const bodyParser = require('body-parser');
const {MongoClient} = require('mongodb');

// Start up an instance of app:
const app = express();


/**
 * End of Helper Functions.
 *
 * Start of Middleware.
 */

// Parse a specific media type: (application/json):
app.use(bodyParser.json());

// Parse requests where the (Content-Type) header matches the (type) option ONLY:
app.use(bodyParser.urlencoded({extended: 'false'}));

// Cors for cross origin allowance:
app.use(cors());

// Initialize the main project folder:
app.use(express.static('./website'));


/**
 * End of Middleware.
 *
 * Start of Main Functions.
 */

// Callback to debug:
const listening = () => {
  console.log(`server is up and running on http://${hostName}:${port}\n`);
};


// Callback function to complete POST '/postMovieTitle':
const postMovieTitle = (req, res) => {
  // save the new data into emailDetails object:
  const movieTitle = req.body.title;
  console.log(movieTitle);

  // construct new entry to save into the database:
  const newEntry = {
    date: new Date().toString(),
    movieTitle: movieTitle,
  };

  // save into the database:
  saveNewEntry(newEntry);

  // close the connection successfully:
  res.status(200).end();
};


/**
 * @description Save new entry into specific MongoDB database.
 * @param {Object} newEntryObject
 */
const saveNewEntry = async (newEntryObject) => {
  // database URL:
  const url = `mongodb+srv://${admin}:${password}@cluster0.fttjz.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

  // create new client:
  const client = new MongoClient(url);

  try {
    // connect to the database:
    await client.connect();
    console.log('connected to database ...');

    // save the new entry into the database:
    await client.db('user_movies').collection('favoriteMovies').insertOne(newEntryObject);

    // close the connection:
    await client.close();
    console.log('close the database connection ...\n');

  } catch (error) {
    console.log(`error: ${error}`);
  }
};


/**
 * End of Main Functions.
 *
 * Start of Event Listeners.
 */

// initiate the server:
const server = app.listen(port, listening);

// Initialize POST '/postMovieTitle' route with a callback function:
app.post('/postMovieTitle', postMovieTitle);

/**
 * End of Event Listeners.
 */
