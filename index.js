import express from 'express';
import bodyParser from 'body-parser';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import cors from 'cors';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 3000;

// Configure CORS to allow requests from specific origins
const corsOptions = {
  origin: ['http://localhost:3000', 'http://localhost:5173', 'https://pharma-check-seven.vercel.app'],
  optionsSuccessStatus: 200, // Some legacy browsers (IE11, various SmartTVs) choke on 204
};

// Enable CORS for specified origins
app.use(cors(corsOptions));

// Middlewares
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json()); // parse JSON requests

// Function to read the parsed JSON file for meals
function loadMeals() {
  try {
    const data = fs.readFileSync(path.join(__dirname, 'data', 'meals.json'), 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading JSON file:', error);
    return []; // Return an empty array in case of an error
  }
}

// Function to save meals on POST requests
function saveMeals(meals) {
  try {
    fs.writeFileSync(path.join(__dirname, 'data', 'meals.json'), JSON.stringify(meals, null, 2), 'utf8');
  } catch (error) {
    console.error('Error saving JSON file:', error);
  }
}

// Load up the home route
app.get('/', (req, res) => {
  try {
    const meals = loadMeals();
    res.json(meals);
  } catch (error) {
    console.error('Error handling request:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Route handler for /meals endpoint [POST]
app.post('/meals', (req, res) => {
  try {
    const newMeal = req.body;
    const meals = loadMeals();
    meals.push(newMeal);
    saveMeals(meals);
    res.status(201).json({ message: 'Meal added successfully' });
  } catch (error) {
    console.error('Error handling request:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Route handler for /meals endpoint [GET]
app.get('/meals', (req, res) => {
  try {
    const meals = loadMeals();
    res.json(meals);
  } catch (error) {
    console.error('Error handling request:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Route handler for /meals/type/:type endpoint [GET]
app.get('/meals/type/:type', (req, res) => {
  try {
    const meals = loadMeals();
    const requestedType = req.params.type;
    const filteredMeals = meals.filter((meal) => meal.type.toLowerCase() === requestedType.toLowerCase());

    if (filteredMeals.length === 0) {
      res.status(404).json({ error: 'No matching meals found' });
    } else {
      res.json(filteredMeals);
    }
  } catch (error) {
    console.error('Error handling request:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Route handler for /meals/search/:name endpoint [GET]
app.get('/meals/search/:name', (req, res) => {
  try {
    const meals = loadMeals();
    const searchQuery = req.params.name.toLowerCase();
    const matchingMeals = meals.filter((meal) => meal.name.toLowerCase().includes(searchQuery));

    if (matchingMeals.length === 0) {
      res.status(404).json({ error: 'No matching meals found' });
    } else {
      res.json(matchingMeals);
    }
  } catch (error) {
    console.error('Error handling request:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Random endpoint to get a random meal [GET]
app.get('/meals/random', (req, res) => {
  try {
    const meals = loadMeals();
    const randomIndex = Math.floor(Math.random() * meals.length);
    const randomMeal = meals[randomIndex];

    if (randomMeal) {
      res.json(randomMeal);
    } else {
      res.status(404).json({ error: 'No meals available' });
    }
  } catch (error) {
    console.error('Error handling request:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Route to get a meal by ID [GET]
app.get('/meals/:id', (req, res) => {
  try {
    const meals = loadMeals();
    const requestedId = parseInt(req.params.id);
    const foundMeal = meals.find((meal) => meal.id === requestedId);

    if (foundMeal) {
      res.json(foundMeal);
    } else {
      res.status(404).json({ error: 'Meal not found' });
    }
  } catch (error) {
    console.error('Error handling request:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Route to get a random meal of a specific type
app.get('/meals/random/:type', (req, res) => {
  try {
    const meals = loadMeals();
    const requestedType = req.params.type.toLowerCase();
    const mealsOfType = meals.filter((meal) => meal.type.toLowerCase() === requestedType);

    if (mealsOfType.length === 0) {
      res.status(404).json({ error: `No ${requestedType} meals found` });
    } else {
      const randomIndex = Math.floor(Math.random() * mealsOfType.length);
      const randomMeal = mealsOfType[randomIndex];
      res.json(randomMeal);
    }
  } catch (error) {
    console.error('Error handling request:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is NOW running at http://localhost:${port}`);
});
