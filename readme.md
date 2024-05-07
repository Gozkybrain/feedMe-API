# Meal API Documentation

Welcome to the Meal API documentation. This API provides access to a collection of meals, allowing you to retrieve meals by type, search for meals by name, and even get a random meal. Below are the available endpoints and their descriptions:

## Base URL

The base URL for all endpoints is `http://localhost:3000`.

## Endpoints
 
### Get a List of All Meals

- **Endpoint**: `/meals`
- **Method**: `GET`
- **Description**: Retrieve a list of all meals available.
- **Example Request**: `GET http://localhost:3000/meals`
- **Response**: JSON array containing meal objects.

### Get Meals by Type

- **Endpoint**: `/meals/type/:type`
- **Method**: `GET`
- **Description**: Retrieve meals of a specific type.
- **Parameters**:
  - `:type` (string): The type of meal to filter by (e.g., breakfast, lunch, dinner).
- **Example Request**: `GET http://localhost:3000/meals/type/breakfast`
- **Response**: JSON array containing meal objects of the specified type.

### Search for Meals by Name

- **Endpoint**: `/meals/search/:name`
- **Method**: `GET`
- **Description**: Search for meals by name, returning partial matches.
- **Parameters**:
  - `:name` (string): The name or part of the name to search for.
- **Example Request**: `GET http://localhost:3000/meals/search/pancake`
- **Response**: JSON array containing meal objects with names that match the search query.

### Get a Random Meal

- **Endpoint**: `/meals/random`
- **Method**: `GET`
- **Description**: Retrieve a random meal from the collection.
- **Example Request**: `GET http://localhost:3000/meals/random`
- **Response**: JSON object representing a random meal.

### Get a Random Meal of a Specific Type

- **Endpoint**: `/meals/random/:type`
- **Method**: `GET`
- **Description**: Retrieve a random meal of a specific type.
- **Parameters**:
  - `:type` (string): The type of meal to filter by (e.g., breakfast, lunch, dinner).
- **Example Request**: `GET http://localhost:3000/meals/random/breakfast`
- **Response**: JSON object representing a random meal of the specified type.

### Get a Meal by ID

- **Endpoint**: `/meals/:id`
- **Method**: `GET`
- **Description**: Retrieve a meal by its unique ID.
- **Parameters**:
  - `:id` (number): The unique ID of the meal.
- **Example Request**: `GET http://localhost:3000/meals/1`
- **Response**: JSON object representing the meal with the specified ID.

## Error Handling

- If a requested meal type or search query does not match any records, the API returns a 404 (Not Found) response with an error message.
- If there is an internal server error during processing, the API returns a 500 (Internal Server Error) response with an error message.

## Example Usage

### Get a Random Breakfast

To get a random breakfast, you can make a `GET` request to the `/meals/random/breakfast` endpoint:

```http
GET http://localhost:3000/meals/random/breakfast
