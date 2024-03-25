# Grocery Store Price Tracker

## Overview
This Grocery Store Price Tracker offers a streamlined way to manage grocery lists, user authentication, and navigation. Built with the MERN stack, it leverages MongoDB, Express.js, React, and Node.js, offering a full-stack solution for grocery shopping efficiency.

## Features
- **User Authentication**: Secure login and registration system for user management.
- **Grocery List Management**: Users can add, remove, and update items on their grocery lists.
- **Dynamic Pricing Information**: Fetches and displays current prices for grocery items from various stores.
- **Interactive UI**: React-based frontend for an intuitive and responsive user experience.
- **Serverless Backend**: Utilizes AWS Lambda and API Gateway for scalable, cost-efficient backend operations.
- **Data Storage and Retrieval**: MongoDB Atlas is used for robust data management, ensuring reliability and efficiency.

## Tech Stack
- **Frontend**: React
- **Backend**: Node.js, Express.js
- **Database**: MongoDB Atlas
- **Serverless**: AWS Lambda, AWS API Gateway
- **Other Tools**: npm for package management

## Project Structure
- `backend.py`: Contains serverless backend logic using AWS Lambda for handling CRUD operations and API requests.
- `fetch.py`: Script for fetching grocery item prices from various sources and updating the database.
- `index.html`, `style.css`, `index.js`: Frontend files for the application's landing page and styling.
- `App.js`, `home.js`, `login.js`, `groceryListTable.js`: React components for the application's core functionalities.
- `index.js` (root level): Entry point for React frontend, setting up the React DOM and routing.

## Getting Started
1. **Clone the repository**:
   ```
   git clone https://github.com/jho1211/bcs-hacks-2024.git
   ```
2. **Install dependencies**:
   Navigate to the project directory and run:
   ```
   npm install
   ```
3. **Set up environment variables**:
   Configure environment variables for MongoDB Atlas, AWS Lambda, and AWS API Gateway according to your setup.

4. **Start the application**:
   - For the frontend, run:
     ```
     npm start
     ```
   - For the backend, deploy the Python scripts to AWS Lambda and configure the API Gateway.

5. **Access the application**:
   Open `localhost:3000` in your browser to access the application.

## Contributing
Contributions are welcome! Please fork the repository and submit pull requests with any enhancements or bug fixes.

## License
