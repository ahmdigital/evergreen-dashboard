# Concurrent User Testing
k6 is a tool that allows you to simulate multiple users accessing a site, each performing various actions.
For our dashboard, the only issue that can arise with multiple users is a failure to handle multiple concurrent
requests to reacquire the organisation's data. A test has been created to simulate this situation.
## Running the Test
To run the test you must have k6 installed, available here:

https://k6.io/docs/getting-started/installation/

Then, you must start start the dashboard with the address "http://localhost:3000/".

Finally, the command to run the test is:

`k6 run .\concurrent.js`

This test will use all 3 APIs, and is manually evaluated by observing the server console.
Initially, a single acquisition
of the data should occur, intermixed with calls to retrieve the data. This should then be followed by a stream of "Served cache".
If, later in the test, a new data acquisition begins, then the test has failed.
