"use client";

import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import { SearchButton } from './components/SearchButton';
import { SaveRecipeButton } from './components/SaveRecipeButton';
// import { IngredientsButton } from './components/IngredientsButton';
import { InstructionsButton } from './components/InstructionsButton';

interface Recipe {
  recipe_title: string;
  ingredients: string;
  instructions: string;
  total_time: string;
}

export default function Home() {
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [savedRecipes, setSavedRecipes] = useState<Recipe[]>([]);
  const [explanation, setExplanation] = useState<string | null>(null);

  // Function to load saved recipes from localStorage
  const loadSavedRecipes = () => {
    const savedRecipesFromStorage = JSON.parse(localStorage.getItem('savedRecipes') ?? '[]') as Recipe[];
    setSavedRecipes(savedRecipesFromStorage);
    console.log('Loaded saved recipes:', savedRecipesFromStorage);
  };

  // Function to delete a recipe from saved recipes
  const deleteRecipe = (recipeTitle: string) => {
    const updatedRecipes = savedRecipes.filter(recipe => recipe.recipe_title !== recipeTitle);
    setSavedRecipes(updatedRecipes);
    localStorage.setItem('savedRecipes', JSON.stringify(updatedRecipes));
  };

  // Function to reset the explanation
  const resetExplanation = () => {
    setExplanation(null);
  };

  // Function to reset the recipe
  const resetRecipe = () => {
    setRecipe(null);
  };

  // Load saved recipes when the component mounts
  useEffect(() => {
    loadSavedRecipes();
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <div className="flex flex-col items-center justify-center flex-grow bg-gray-100">
        <SearchButton
          onRecipeGenerated={(generatedRecipe) => setRecipe(generatedRecipe)}
          resetExplanation={resetExplanation}
          resetRecipe={resetRecipe}
        />

        {recipe && (
          <div className="w-full max-w-md p-4 bg-white rounded-lg shadow-md mt-4 text-black">
            {recipe.recipe_title && (
              <div>
                <h3 className="text-lg font-semibold">Recipe:</h3>
                <p>{recipe.recipe_title}</p>
              </div>
            )}
            {recipe.total_time && (
              <div>
                <h3 className="text-lg font-semibold">Total Time:</h3>
                <p>{recipe.total_time}</p>
              </div>
            )}
            {recipe.ingredients && (
              <div>
                <h3 className="text-lg font-semibold">Ingredients:</h3>
                <ul className="list-disc list-inside">
                  {recipe.ingredients.split('\n').map((ingredient, index) => {
                    const isHighlighted = ingredient.startsWith('#');
                    const displayText = isHighlighted ? ingredient.slice(1).trim() : ingredient;

                    return (
                      <li
                        key={index}
                        className={isHighlighted ? 'text-red-500' : ''}
                      >
                        {displayText}
                      </li>
                    );
                  })}
                </ul>

              </div>
            )}
            {recipe.instructions && (
              <div>
                <h3 className="text-lg font-semibold">Instructions:</h3>
                <p>{recipe.instructions}</p>
                <InstructionsButton recipe={recipe} setExplanation={setExplanation} />
              </div>
            )}

            <SaveRecipeButton recipe={recipe} onSave={loadSavedRecipes} />
          </div>
        )}

        {explanation && (
          <div className="w-full max-w-md p-4 bg-white rounded-lg shadow-md mt-4 text-black">
            <h3 className="text-lg font-semibold">Instructions Explanation:</h3>
            <p>{explanation}</p>
          </div>
        )}

        {savedRecipes.length > 0 && (
          <div className="w-full max-w-md p-4 bg-gray-200 rounded-lg shadow-md mt-4 text-black">
            <h3 className="text-lg font-semibold">Saved Recipes:</h3>
            <ul className="list-disc list-inside">
              {savedRecipes.map((savedRecipe, index) => (
                <li key={index} className="flex justify-between items-center">
                  <a
                    href="#"
                    onClick={() => {
                      const newTab = window.open();
                      if (newTab) {
                        newTab.document.write(`
                          <html>
                            <head><title>${savedRecipe.recipe_title}</title></head>
                            <body>
                              <h1>${savedRecipe.recipe_title}</h1>
                              <p><strong>Total Time:</strong> ${savedRecipe.total_time}</p>
                              <h2>Ingredients</h2>
                              <p>${savedRecipe.ingredients.replace(/\n/g, '<br>')}</p>
                              <h2>Instructions</h2>
                              <p>${savedRecipe.instructions.replace(/\n/g, '<br>')}</p>
                            </body>
                          </html>
                        `);
                        newTab.document.close();
                      }
                    }}
                    className="text-blue-500 hover:underline"
                  >
                    {savedRecipe.recipe_title}
                  </a>
                  <button
                    onClick={() => deleteRecipe(savedRecipe.recipe_title)}
                    className="ml-4 text-red-500 hover:text-red-700"
                  >
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
