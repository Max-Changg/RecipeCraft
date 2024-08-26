import React from 'react';

interface Recipe {
    recipe_title: string;
    ingredients: string;
    instructions: string;
    total_time: string;
}

interface SaveRecipeButtonProps {
    recipe: Recipe;
    onSave: () => void; // Callback to update the list of saved recipes
}

export function SaveRecipeButton({ recipe, onSave }: SaveRecipeButtonProps) {
    const saveRecipe = () => {
        const savedRecipes = JSON.parse(localStorage.getItem('savedRecipes') ?? '[]') as Recipe[];
        savedRecipes.push(recipe);
        localStorage.setItem('savedRecipes', JSON.stringify(savedRecipes));

        onSave(); // Call the callback to update the list of saved recipes
    };

    return (
        <button
            onClick={saveRecipe}
            className="mt-4 px-4 py-2 bg-green-500 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 focus:outline-none"
        >
            Save Recipe
        </button>
    );
}
