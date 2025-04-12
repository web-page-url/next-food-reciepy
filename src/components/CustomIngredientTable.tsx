import React, { useState, useEffect } from 'react';
import { parseCustomIngredients, Ingredient } from '../utils/recipeParser';
import RecipeIngredientTable from './RecipeIngredientTable';

interface CustomIngredientTableProps {
  rawContent: string;
  title: string;
}

const CustomIngredientTable: React.FC<CustomIngredientTableProps> = ({ 
  rawContent, 
  title 
}) => {
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      if (rawContent) {
        const parsedIngredients = parseCustomIngredients(rawContent);
        setIngredients(parsedIngredients);
        setError(null);
      }
    } catch (err) {
      console.error('Error parsing ingredients:', err);
      setError('Failed to parse ingredients. Please check the format.');
    }
  }, [rawContent]);

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-lg">
        <p className="font-medium">{error}</p>
        <div className="mt-3 text-sm">
          <p className="font-bold">Raw content:</p>
          <pre className="mt-2 bg-white p-2 rounded border border-red-100 overflow-x-auto">
            {rawContent}
          </pre>
        </div>
      </div>
    );
  }

  if (ingredients.length === 0 && rawContent) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 p-4 rounded-lg">
        <p>No ingredients could be extracted from the provided content.</p>
      </div>
    );
  }

  return <RecipeIngredientTable title={title} ingredients={ingredients} />;
};

export default CustomIngredientTable; 