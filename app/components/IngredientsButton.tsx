import React, { useState } from 'react';

interface ExplainIngredientsButtonProps {
  recipe: {
    recipe_title: string;
    ingredients: string;
    instructions: string;
  };
}

export function IngredientsButton({ recipe }: ExplainIngredientsButtonProps) {
  const [explanation, setExplanation] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const explainIngredients = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch('http://127.0.0.1:5000/explain_ingredients', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          recipe_title: recipe.recipe_title,
          ingredients: recipe.ingredients,
          instructions: recipe.instructions,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setExplanation(data.explanation);
      } else {
        const errorText = await response.text();
        console.error('Error response:', errorText);
        setError('Error explaining ingredients. Please try again.');
      }
    } catch (error) {
      console.error('Fetch error:', error);
      setError('Error explaining ingredients. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center">
      <button
        onClick={explainIngredients}
        disabled={loading}
        className={`mb-4 px-6 py-2 text-white font-semibold rounded-lg shadow-md focus:outline-none 
                            ${loading ? 'bg-gray-400' : 'bg-green-500 hover:bg-green-700'}`}
      >
        {loading ? 'Explaining Ingredients...' : 'Explain Ingredients'}
      </button>
      {error && <p className="text-red-500 mt-2">{error}</p>}
      {explanation && (
        <div className="mt-4 p-4 bg-gray-100 rounded-lg shadow-md text-black">
          <h3 className="text-lg font-semibold">Ingredients Explanation:</h3>
          <p>{explanation}</p>
        </div>
      )}
    </div>
  );
}
