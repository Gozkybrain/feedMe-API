import express from 'express';
import bodyParser from 'body-parser';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 3000;

// middlewares
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json()); // parse JSON requests

// function to read the parsed json file for meals
function loadMeals() {
  try {
    const data = fs.readFileSync(path.join(__dirname, 'data', 'meals.json'), 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading JSON file:', error);
    return []; // Return an empty array in case of an error
  }
}

// function to save meals on post requests
function saveMeals(meals) {
  try {
    fs.writeFileSync(path.join(__dirname, 'data', 'meals.json'), JSON.stringify(meals, null, 2), 'utf8');
  } catch (error) {
    console.error('Error saving JSON file:', error);
  }
}

// load up the home route
app.get('/', (req, res) => {
  // Load meal data
  const meals = loadMeals();
  // Render a template with the meal data
  res.render('main-template.ejs', { meals });
});

// route handler for /meals endpoint [POST]
app.post('/meals', (req, res) => {
  try {
    // Get the new meal data from the request body
    const newMeal = req.body;

    // Load meal data
    const meals = loadMeals();

    // Add the new meal to the meals array
    meals.push(newMeal);

    // Save the updated meals array
    saveMeals(meals);

    // Send a success response
    res.status(201).json({ message: 'Meal added successfully' });
  } catch (error) {
    // Handle any errors that occur during the request
    console.error('Error handling request:', error);
    // Return an internal server error response
    res.status(500).send('Internal Server Error');
  }
});

// route handler for /meals endpoint [GET]
app.get('/meals', (req, res) => {
  try {
    // Load meal data
    const meals = loadMeals();
    // Send the list of meals as JSON
    res.json(meals);
  } catch (error) {
    // Handle any errors that occur during the request
    console.error('Error handling request:', error);
    // Send a 500 (Internal Server Error) response
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// route handler for /meals/type/Breakfast endpoint [GET]
app.get('/meals/type/:type', (req, res) => {
  try {
    // Load meal data
    const meals = loadMeals();

    // Get the requested meal type from the URL parameter
    const requestedType = req.params.type;

    // Filter meals by type
    const filteredMeals = meals.filter((meal) => meal.type.toLowerCase() === requestedType.toLowerCase());

    // Check if any matching meals were found
    if (filteredMeals.length === 0) {
      // No matching meals found, send a 404 (Not Found) response
      res.status(404).json({ error: 'No matching meals found' });
    } else {
      // Send the filtered meals as JSON
      res.json(filteredMeals);
    }
  } catch (error) {
    // Handle any errors that occur during the request
    console.error('Error handling request:', error);
    // Send a 500 (Internal Server Error) response
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// route handler for /meals/search/Chicken endpoint [GET]
app.get('/meals/search/:name', (req, res) => {
  try {
    // Load meal data
    const meals = loadMeals();

    // Get the search query from the URL parameter
    const searchQuery = req.params.name.toLowerCase();

    // Filter meals by name
    const matchingMeals = meals.filter((meal) => meal.name.toLowerCase().includes(searchQuery));

    // Check if any matching meals were found
    if (matchingMeals.length === 0) {
      // No matching meals found, send a 404 (Not Found) response
      res.status(404).json({ error: 'No matching meals found' });
    } else {
      // Send the matching meals as JSON
      res.json(matchingMeals);
    }
  } catch (error) {
    // Handle any errors that occur during the request
    console.error('Error handling request:', error);
    // Send a 500 (Internal Server Error) response
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Random endpoint to get a random meal [GET]
app.get('/meals/random', (req, res) => {
  try {
    // Load meal data
    const meals = loadMeals();

    // Pick a random meal from the list
    const randomIndex = Math.floor(Math.random() * meals.length);
    const randomMeal = meals[randomIndex];

    if (randomMeal) {
      // Send the random meal as JSON
      res.json(randomMeal);
    } else {
      // No meals available, send a 404 (Not Found) response
      res.status(404).json({ error: 'No meals available' });
    }
  } catch (error) {
    // Handle any errors that occur during the request
    console.error('Error handling request:', error);
    // Send a 500 (Internal Server Error) response
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Route to get a meal by ID [GET]
app.get('/meals/:id', (req, res) => {
  try {
    // Load meal data
    const meals = loadMeals();

    // Get the requested meal ID from the URL parameter
    const requestedId = parseInt(req.params.id);

    // Find the meal with the requested ID
    const foundMeal = meals.find((meal) => meal.id === requestedId);

    if (foundMeal) {
      // Send the found meal as JSON
      res.json(foundMeal);
    } else {
      // No meal with the requested ID found, send a 404 (Not Found) response
      res.status(404).json({ error: 'Meal not found' });
    }
  } catch (error) {
    // Handle any errors that occur during the request
    console.error('Error handling request:', error);
    // Send a 500 (Internal Server Error) response
    res.status(500).json({ error: 'Internal Server Error' });
  }
});



// Route to get a random meal of a specific type
app.get('/meals/random/:type', (req, res) => {
  try {
    // Load meal data
    const meals = loadMeals();

    // Get the requested meal type from the URL parameter
    const requestedType = req.params.type.toLowerCase();

    // Filter meals by the requested type
    const mealsOfType = meals.filter((meal) => meal.type.toLowerCase() === requestedType);

    // Check if there are any meals of the requested type
    if (mealsOfType.length === 0) {
      // No meals of the requested type found, send a 404 (Not Found) response
      res.status(404).json({ error: `No ${requestedType} meals found` });
    } else {
      // Select a random meal from the filtered list
      const randomIndex = Math.floor(Math.random() * mealsOfType.length);
      const randomMeal = mealsOfType[randomIndex];

      // Send the random meal as JSON
      res.json(randomMeal);
    }
  } catch (error) {
    // Handle any errors that occur during the request
    console.error('Error handling request:', error);
    // Send a 500 (Internal Server Error) response
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


// Start the server
app.listen(port, () => {
  console.log(`Server is NOW running at http://localhost:${port}`);
});
