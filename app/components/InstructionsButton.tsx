import React, { useState } from 'react';

interface Recipe {
  recipe_title: string;
  ingredients: string;
  instructions: string;
}

interface ExplainInstructionsButtonProps {
  recipe: Recipe;
  setExplanation: React.Dispatch<React.SetStateAction<string | null>>; // Add this line
}

export function InstructionsButton({ recipe, setExplanation }: ExplainInstructionsButtonProps) {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const explainInstructions = async () => {
    setLoading(true);
    setError('');
    try {
const response = await fetch('https://recipecraft-c5725e69feda.herokuapp.com/explain_instructions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          recipe_title: recipe.recipe_title,
          instructions: recipe.instructions,
          ingredients: recipe.ingredients,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setExplanation(data.explanation); // Set the explanation here
      } else {
        const errorText = await response.text();
        console.error('Error response:', errorText);
        setError('Error explaining instructions. Please try again.');
      }
    } catch (error) {
      console.error('Fetch error:', error);
      setError('Error explaining instructions. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-4">
      <button
        onClick={explainInstructions}
        disabled={loading}
        className="px-4 py-2 bg-green-500 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 focus:outline-none"
      >
        {loading ? 'Loading...' : 'Explain Instructions'}
      </button>
      {error && <p className="text-red-500 mt-2">{error}</p>}
    </div>
  );
}
