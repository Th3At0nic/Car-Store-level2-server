# Car Store

## Project Description

**Car Store** is a web application designed for managing a car inventory and order system. This application allows users to perform CRUD (Create, Read, Update, Delete) operations on cars, filter them by categories, and make car orders. It also includes a revenue calculation feature to track total earnings from orders. Built with **Express.js**, **TypeScript**, and **MongoDB** using **Mongoose**, the project ensures data integrity and validation through Mongoose schema and Zod.

### Key Features

- **User Authentication**: Secure user login and registration will be added in the future with the project grows.
- **Car Listing**: Add, update, delete, and retrieve cars.
- **Search Functionality**: Search cars by brand, model, or category.
- **CRUD Operations**: Create, Read, Update, and Delete operations on car inventory and orders.
- **Car Ordering**: User can order a car providing authentic information.
- **Revenue Calculation**: Calculate total revenue generated from car orders.

## Technologies Used

- **Express.js**: A web framework for Node.js.
- **TypeScript**: Superset of JavaScript for type safety and enhanced code quality.
- **MongoDB**: NoSQL database for storing car and order data.
- **Mongoose**: ODM (Object Data Modeling) library for MongoDB and Node.js.
- **Zod**: Type-safe schema validation.
- **dotenv**: For environment variable management.
- **ESLint** & **Prettier**: Code linting and formatting tools.

## Installation Instructions

To set up the project locally, follow these steps:

1. **Clone the repository**:
   Run the following command to clone the repository:

   ```bash
   git clone https://github.com/Th3At0nic/Car-Store-level2-assignment2.git
   cd Car-Store-level2-assignment2
   ```

2. **Install dependencies**:
   Make sure you have **Node.js** and **npm** installed. Run the following command to install the required dependencies:

   ```bash
   npm install
   ```

3. **Setup environment variables**:
   Create a `.env` file in the root directory and add the necessary environment variables (e.g., MongoDB connection string):

   ```text
   MONGO_URI=your_mongodb_connection_string
   ```

4. **Run the application**:
   Use the following command to start the server:

   ```bash
   npm run start:dev
   ```

   The application should now be running on `http://localhost:5000`.

## Usage Instructions

Once the project is set up, you can start interacting with it by making HTTP requests to the appropriate endpoints.

1. **Start the local server**:
   To run the application, execute:

   ```bash
   npm run start:dev
   ```

   The server will start, and you can access the application at `http://localhost:5000`.

2. **Test the API Endpoints** using tools like [Postman](https://www.postman.com/) or [Insomnia](https://insomnia.rest/).

## API Endpoints

### 1. Create a Car

- **Endpoint**: `/api/cars`
- **Method**: `POST`
- **Description**: Creates a new car in the inventory.

### 2. Get All Cars

- **Endpoint**: `/api/cars`
- **Method**: `GET`
- **Query Parameters**:
  - `searchTerm`: Filter cars by brand, model, or category (e.g., `/api/cars?searchTerm=sedan`).

### 3. Get a Specific Car

- **Endpoint**: `/api/cars/:carId`
- **Method**: `GET`
- **Description**: Retrieves a specific car by its ID.

### 4. Update a Car

- **Endpoint**: `/api/cars/:carId`
- **Method**: `PUT`
- **Description**: Updates details of an existing car.

### 5. Delete a Car

- **Endpoint**: `/api/cars/:carId`
- **Method**: `DELETE`
- **Description**: Deletes a car from the inventory.

### 6. Order a Car

- **Endpoint**: `/api/orders`
- **Method**: `POST`
- **Description**: Allows users to place an order for a car.

### 7. Calculate Revenue from Orders

- **Endpoint**: `/api/orders/revenue`
- **Method**: `GET`
- **Description**: Retrieves the total revenue generated from all car orders.

## Contributing

Feel free to fork the repository and submit a pull request with your improvements or bug fixes.

## Contact Information

If you have any questions or would like to contribute, you can reach out to me via:

- **LinkedIn**: [Md Rahatul Islam](https://www.linkedin.com/in/mdrahatulislam/)
- **Email**: islammdrahatul@gmail.com
