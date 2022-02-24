
/**
 * Start of Global Variables.
 */

// Spin up the server:
const port = (process.env.PORT || 5000);    // required for Heroku hosting.
const hostName = '127.0.0.1';


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
  console.log(`server is up and running on http://${hostName}:${port}`);
};


/**
 * End of Main Functions.
 *
 * Start of Event Listeners.
 */

// initiate the server:
const server = app.listen(port, listening);


/**
 * End of Event Listeners.
 */
