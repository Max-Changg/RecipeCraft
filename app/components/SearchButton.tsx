import React, { useState } from 'react';

interface Recipe {
    recipe_title: string;
    ingredients: string;
    instructions: string;
    total_time: string;
}

interface SearchButtonProps {
    onRecipeGenerated: (recipe: Recipe) => void;
    resetExplanation: () => void; 
    resetRecipe: () => void; // New prop to reset the recipe
}

export function SearchButton({ onRecipeGenerated, resetExplanation, resetRecipe }: SearchButtonProps) {
    const [ingredients, setIngredients] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const generateRecipe = async () => {
        setLoading(true);
        setError('');
        resetExplanation();  // Reset the explanation state
        resetRecipe();  // Reset the recipe state
        try {
            console.log('Sending request with ingredients:', ingredients);

            const response = await fetch('http://127.0.0.1:5000/generate_recipe', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ ingredients }),
            });

            console.log('Received response:', response);

            if (response.ok) {
                const data = await response.json();
                console.log('Received data:', data);
                onRecipeGenerated(data.recipe);
            } else {
                const errorText = await response.text();
                console.error('Error response:', errorText);
                setError('Error generating recipe. Please try again.');
            }
        } catch (error) {
            console.error('Fetch error:', error);
            setError('Error generating recipe. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center">
            <input
                type="text"
                value={ingredients}
                onChange={(e) => setIngredients(e.target.value)}
                placeholder="Enter ingredients"
                className="mb-4 px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 text-black"
            />
            <button
                onClick={generateRecipe}
                disabled={loading}
                className={`mb-4 px-6 py-2 text-white font-semibold rounded-lg shadow-md focus:outline-none 
                            ${loading ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-700'}`}
            >
                {loading ? 'Searching...' : 'Search'}
            </button>
            {error && <p className="text-red-500 mt-2">{error}</p>}
        </div>
    );
}
