## Description
EventDrivenAdsAPI is an innovative system designed for tracking and analyzing interactions with active advertisements through an API. Developed as a test project for an interview process, it leverages event-driven architecture to monitor ad performance and user engagement, demonstrating practical application of the Nest.js framework.

## Running the Project
To get the system operational, follow these steps:
1. Ensure Docker is installed and running on your machine.
2. Open a terminal and navigate to the project directory.
3. Execute the following command:`docker compose up`

This will start the service on `localhost:8000`, making it accessible for further interaction and testing.


## End-to-End Tests
The project includes a suite of E2E tests designed to validate the functionality and reliability of the API. To run these tests, follow these instructions:
1. With Docker still running, open a new terminal window.
2. Navigate to the project's root directory if you're not already there.
3. Run the following command: `docker compose -f docker-compose.yml -f docker-compose.e2e.yml up`

These tests play a crucial role in ensuring that all components of the API perform as expected, highlighting the robustness of the system.
