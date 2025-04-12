import React from 'react';

type Ingredient = {
  name: string;
  amount: string;
};

interface RecipeIngredientTableProps {
  title: string;
  ingredients: Ingredient[];
}

const RecipeIngredientTable: React.FC<RecipeIngredientTableProps> = ({ title, ingredients }) => {
  return (
    <div className="recipe-container">
      <h2 className="text-2xl sm:text-3xl font-bold text-black break-words mb-4">{title}</h2>
      <h3 className="font-bold text-xl mb-4 text-black">Ingredients</h3>
      
      <div className="ingredients-table">
        <table>
          <thead>
            <tr>
              <th>Ingredient</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            {ingredients.map((ingredient, index) => (
              <tr key={index}>
                <td><strong>{ingredient.name}</strong></td>
                <td>{ingredient.amount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <style jsx global>{`
        .recipe-container {
          margin-bottom: 2rem;
        }
        
        .ingredients-table table {
          width: 100%;
          border-collapse: collapse;
          margin: 1rem 0;
          background-color: white;
          border-radius: 0.5rem;
          overflow: hidden;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }
        
        .ingredients-table th,
        .ingredients-table td {
          border: 1px solid #fed7aa;
          padding: 0.75rem;
          text-align: left;
        }
        
        .ingredients-table th {
          background-color: #fff7ed;
          font-weight: 600;
          color: #9a3412;
        }
        
        .ingredients-table tr:nth-child(even) {
          background-color: #fff7ed;
        }
        
        .ingredients-table tr:hover {
          background-color: #ffedd5;
        }
        
        /* Responsive styles for mobile */
        @media (max-width: 640px) {
          .ingredients-table th,
          .ingredients-table td {
            padding: 0.5rem;
            font-size: 0.9rem;
          }
        }
        
        @media (max-width: 480px) {
          .ingredients-table {
            display: block;
            width: 100%;
            overflow-x: auto;
          }
          
          .ingredients-table table {
            min-width: 100%;
          }
          
          .ingredients-table td {
            white-space: normal;
            word-break: break-word;
          }
        }
      `}</style>
    </div>
  );
};

export default RecipeIngredientTable; 