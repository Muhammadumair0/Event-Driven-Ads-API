## Description
The system exposes an API that helps track what's going on with active ads.
The system can be notified of certain events, and it updates a database accordingly, it can also give you a bunch of reports.

## Run
`docker compose up` should be enough to get the system up and running on `localhost:8000`.

## E2E Tests
There's an E2E test suite that helped me write the API, you can run it on docker compose.
`docker compose -f docker-compose.yml -f docker-compose.e2e.yml up`
