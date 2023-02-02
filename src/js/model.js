import { async } from 'regenerator-runtime';
import { API_URL } from './config.js';
// import { getJSON } from './helpers.js';
// import { sendJSON } from './helpers.js';
import { AJAX } from './helpers.js';
import { RES_PER_PAGE } from './config.js';
import { KEY } from './config.js';

export const state = {
  recipe: {},
  search: {
    page: 1,
    query: '',
    results: [],
    resultsPerPage: RES_PER_PAGE,
  },
  bookmarks: [],
};

const createRecipeObject = function (data) {
  // Destructing obj from data.data for changing keys with _ between words to camelCase. After refactoring it became const variable
  const { recipe } = data.data;

  // Assigning new keys in camelCase to new reciepe obj, based on data.data properties. After refactoring it became state.recipe
  return {
    id: recipe.id,
    title: recipe.title,
    publisher: recipe.publisher,
    sourceUrl: recipe.source_url,
    image: recipe.image_url,
    servings: recipe.servings,
    cookingTime: recipe.cooking_time,
    ingredients: recipe.ingredients,
    ...(recipe.key && { key: recipe.key }),
  };
};

// Loading data from API, assingings values to state obj, and hadling errors by rendering it in UI
export const loadRecipe = async function (id) {
  try {
    const data = await AJAX(`${API_URL}${id}?key=${KEY}`);

    // After refactoring
    state.recipe = createRecipeObject(data);

    // We added bookmarked recipe into bookmars array in state. So, if ID of recipe in bookmarks array equal to ID which we get from argument of loadRecipe(), we assign true to state.recipe.bookmarked of this recipe
    if (state.bookmarks.some(bookmark => bookmark.id === id))
      state.recipe.bookmarked = true;
    else state.recipe.bookmarked = false;
  } catch (err) {
    console.error(`${err} ERROR ERROR ERROR`);
    throw err;
  }
};

export const loadSearchResults = async function (query) {
  try {
    // Assigning query value to state.search.query
    state.search.query = query;

    // Getting data from API request
    const data = await AJAX(`${API_URL}?search=${query}&key=${KEY}`);
    console.log(data);

    // Store result of searchong data in state.search.results
    state.search.results = data.data.recipes.map(recipe => {
      return {
        id: recipe.id,
        title: recipe.title,
        publisher: recipe.publisher,
        image: recipe.image_url,
        ...(recipe.key && { key: recipe.key }),
      };
    });

    // Updating pagination
    state.search.page = 1;
  } catch (err) {
    console.error(`${err} ERROR ERROR ERROR`);
    throw err;
  }
};

export const getSearchResultsPage = function (page = state.search.page) {
  state.search.page = page;

  // Calculating neccessary results of array based on page number
  const start = (page - 1) * state.search.resultsPerPage; // 0;
  const end = page * state.search.resultsPerPage; // 9;

  return state.search.results.slice(start, end);
};

export const updateServings = function (newServings) {
  state.recipe.ingredients.forEach(ing => {
    //newQt = oldQt * newServings / oldServings
    ing.quantity = (ing.quantity * newServings) / state.recipe.servings;
  });

  state.recipe.servings = newServings;
};

const persistBookmarks = function () {
  localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
};

export const addBookmark = function (recipe) {
  // Add bookmark
  state.bookmarks.push(recipe);

  // Mark current recipe as bookmarked
  if (recipe.id === state.recipe.id) state.recipe.bookmarked = true;

  // Sroring bookmarks in local storage
  persistBookmarks();
};

export const deleteBookmark = function (id) {
  // Delete bookmark
  const index = state.bookmarks.findIndex(el => el.id === id);
  state.bookmarks.splice(index, 1);

  // Mark current recipe as NOT bookmarked
  if (id === state.recipe.id) state.recipe.bookmarked = false;

  // Sroring bookmarks in local storage
  persistBookmarks();
};

const init = function () {
  const storage = localStorage.getItem('bookmarks');
  if (storage) state.bookmarks = JSON.parse(storage);
};

init();

const clearBookmarks = function () {
  localStorage.clear('bookmarks');
};
// clearBookmarks();

export const uploadRecipe = async function (newRecipe) {
  try {
    const ingredients = Object.entries(newRecipe)
      .filter(entry => entry[0].startsWith('ingredient') && entry[1] !== '')
      .map(ing => {
        // const ingArr = ing[1].replaceAll(' ', '').split(',');
        const ingArr = ing[1].split(',').map(ing => ing.trim());
        if (ingArr.length !== 3)
          throw new Error(
            'Wrong ingredient format! Please use correct format :)'
          );

        const [quantity, unit, description] = ingArr;

        return { quantity: quantity ? +quantity : null, unit, description };
      });

    const recipe = {
      title: newRecipe.title,
      source_url: newRecipe.sourceUrl,
      image_url: newRecipe.image,
      publisher: newRecipe.publisher,
      cooking_time: +newRecipe.cookingTime,
      servings: +newRecipe.servings,
      ingredients,
    };

    const data = await AJAX(`${API_URL}?key=${KEY}`, recipe);
    state.recipe = createRecipeObject(data);
    addBookmark(state.recipe);
  } catch (err) {
    throw err;
  }
};
