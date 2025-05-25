# event-management-backend-2.0UNO Event Management Backend (Version 2.0)
Welcome to the backend for the UNO Event Management application! This project provides a RESTful API for managing events, budgets, tasks, and event requests, built with Express.js and PostgreSQL. It uses Aiven PostgreSQL for the database, Swagger UI for API documentation, and includes user authentication with JWT and bcrypt.
This README will guide you through setting up the project, running the server, and testing the API endpoints.
Table of Contents

Prerequisites
Project Structure
Setup Instructions
Running the Server
Testing the API
API Endpoints
Troubleshooting
Contributing
Next Steps

Prerequisites
Before setting up the project, ensure you have the following installed:

Node.js (version 22.11.0 or later): Download Node.js
Docker (for running pgAdmin): Install Docker
Git: Install Git
A PostgreSQL database. This project uses Aiven PostgreSQL, but you can use any PostgreSQL instance.
A GitHub account to clone the repository.

Project Structure
event-management-backend-2.0/
├── routes/                     # API route handlers
│   ├── auth.js               # User signup and login routes
│   ├── events.js             # Event-related routes
│   ├── budget.js             # Budget-related routes
│   ├── tasks.js              # Task-related routes
│   ├── eventRequests.js      # Event request-related routes
├── .gitignore                 # Files/folders to ignore in Git
├── db.js                      # Database pool configuration
├── docker-compose.yml         # Docker setup for pgAdmin
├── index.js                   # Main server file
├── init.sql                   # SQL script to initialize database tables and data
├── package.json               # Project dependencies and scripts
├── package-lock.json          # Dependency lock file
├── swagger.json               # Swagger API documentation

Setup Instructions
1. Clone the Repository
Clone the repository to your local machine:
git clone https://github.com/Armand1711/event-management-backend-2.0.git
cd event-management-backend-2.0

2. Install Dependencies
Install the required Node.js dependencies:
npm install

This will install packages like express, pg, bcryptjs, jsonwebtoken, cors, swagger-ui-express, and others listed in package.json.
3. Set Up Aiven PostgreSQL
This project uses Aiven PostgreSQL as the database. Follow these steps to set up your database:

Sign up for an Aiven account at Aiven.io.
Create a new PostgreSQL service (e.g., event-management-db).
Note down the connection details:
Host (e.g., event-management-db-yourproject.aivencloud.com)
Port (e.g., 5432)
Database name (e.g., defaultdb)
Username (e.g., avnadmin)
Password (e.g., AVNS_xG4U1d5QynJ4QILAluf)


Download the CA certificate for SSL:
Go to your Aiven service > Overview > Connection Information > SSL.
Download the CA certificate and save it as aiven-ca-cert.pem in your project root directory or another accessible location.



4. Configure Environment Variables
Create a .env file in the project root directory and add the following environment variables:
DB_HOST=event-management-db-yourproject.aivencloud.com
DB_PORT=5432
DB_USER=avnadmin
DB_PASSWORD=your-aiven-password
DB_NAME=defaultdb
DB_SSL_CA=/path/to/aiven-ca-cert.pem
JWT_SECRET=your_jwt_secret
PORT=5000


Replace the values with your Aiven PostgreSQL credentials.
For DB_SSL_CA, provide the full path to aiven-ca-cert.pem (e.g., /Users/yourusername/project/aiven-ca-cert.pem).
Set JWT_SECRET to a secure random string for JWT authentication (e.g., mysecretkey123).

5. Set Up pgAdmin with Docker
To manage the database, set up pgAdmin using Docker:

Ensure Docker is running.
Run the following command to start pgAdmin:docker-compose up -d


Access pgAdmin at http://localhost:5050.
Log in with:
Email: admin@admin.com
Password: adminpassword


Add a new server in pgAdmin:
Name: Aiven Event DB
Host: (your Aiven host, e.g., event-management-db-yourproject.aivencloud.com)
Port: 5432
Maintenance database: defaultdb
Username: avnadmin
Password: (your Aiven password)
SSL Mode: Require
Root certificate: Select the aiven-ca-cert.pem file.



Running the Server
Start the server to initialize the database and run the API:
node index.js

You should see:
Server running on port 5000
Connected to Aiven PostgreSQL
Database initialized successfully

The API will be accessible at http://localhost:5000.
Testing the API
The API includes Swagger UI for testing endpoints. Follow these steps to test the API:
1. Access Swagger UI

Open your browser and go to http://localhost:5000/api-docs.
You’ll see the Swagger UI interface with all available endpoints.

2. Test User Registration (/api/auth/signup)

Click POST /api/auth/signup.
Click Try it out.
Enter:{
  "email": "testuser@example.com",
  "password": "testpass123"
}


Click Execute.
Expect a 201 response: { "message": "User registered" }.

3. Test User Login (/api/auth/login)

Click POST /api/auth/login.
Click Try it out.
Enter:{
  "email": "testuser@example.com",
  "password": "testpass123"
}


Click Execute.
Expect a 200 response with a JWT token (e.g., { "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." }).

4. Test Adding a Budget Item (/api/budget)

Click POST /api/budget.
Click Try it out.
Enter:{
  "event_id": 1,
  "description": "Decorations",
  "category": "Setup",
  "amount": 150,
  "status": "Pending"
}


Click Execute.
Expect a 201 response with the new budget item (e.g., { "id": 5, "event_id": 1, ... }).

5. Test Retrieving Data

Events: Click GET /api/events > Try it out > Execute.
Expect initial events (e.g., Corporate Year-End Gala).


Budget Items: Click GET /api/budget > Try it out > Execute.
Expect budget items, including the new “Decorations” entry.


Tasks: Click GET /api/tasks > Try it out > Execute.
Event Requests: Click GET /api/event-requests > Try it out > Execute.

6. Verify Data in pgAdmin

In pgAdmin (http://localhost:5050), expand Aiven Event DB > defaultdb > Schemas > public > Tables.
Check:
users table for testuser@example.com.
budget_items table for the “Decorations” entry.



API Endpoints
Here’s a summary of the main API endpoints:

Auth:
POST /api/auth/signup: Register a new user.
POST /api/auth/login: Log in and receive a JWT token.


Events:
GET /api/events: Retrieve all events.


Budget:
GET /api/budget: Retrieve all budget items.
POST /api/budget: Add a new budget item.
PUT /api/budget/:id: Update a budget item.
DELETE /api/budget/:id: Delete a budget item.


Tasks:
GET /api/tasks: Retrieve all tasks.


Event Requests:
GET /api/event-requests: Retrieve all event requests.



For a full list of endpoints, refer to Swagger UI at http://localhost:5000/api-docs.
Troubleshooting

Database Connection Error:
Ensure your .env file has the correct Aiven credentials.
Verify the aiven-ca-cert.pem file path in DB_SSL_CA.


pgAdmin Connection Fails:
Double-check the Aiven host, port, and SSL settings in pgAdmin.
Ensure Docker is running (docker-compose up -d).


500 Internal Server Error:
Check the terminal logs for detailed error messages.
Common issues include database connectivity or duplicate emails in the users table.


CORS Issues:
The server includes CORS middleware, but ensure your frontend origin matches the allowed origins.



Contributing
To contribute to this project:

Fork the repository.
Create a new branch (git checkout -b feature/your-feature).
Make your changes and commit (git commit -m "Add your feature").
Push to your branch (git push origin feature/your-feature).
Open a pull request on GitHub.

Please ensure your code follows the existing style and includes tests where applicable.
Next Steps

Integrate with a frontend (e.g., using axios to call these APIs).
Add authentication middleware to secure endpoints.
Expand CRUD operations for tasks, events, and event requests.
Add unit tests for API endpoints.


This project was initially set up by Armand1711 on May 25, 2025. Feel free to reach out for questions or collaboration opportunities!
