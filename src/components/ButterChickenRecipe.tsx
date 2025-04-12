import React from 'react';
import ReactMarkdown from 'react-markdown';

const ButterChickenRecipe: React.FC = () => {
  const recipeMarkdown = `## Butter Chicken

### Ingredients

<div class="ingredients-table">
<table>
<thead>
<tr>
<th>Ingredient</th>
<th>Amount</th>
</tr>
</thead>
<tbody>
<tr>
<td><strong>boneless, skinless chicken thighs, cut into bite-sized pieces</strong></td>
<td>1.5lbs (700g)</td>
</tr>
<tr>
<td><strong>plain yogurt</strong></td>
<td>1/2 cup</td>
</tr>
<tr>
<td><strong>lemon juice</strong></td>
<td>2 tbsp</td>
</tr>
<tr>
<td><strong>garam masala</strong></td>
<td>2 tsp</td>
</tr>
<tr>
<td><strong>ground cumin</strong></td>
<td>2 tsp</td>
</tr>
<tr>
<td><strong>paprika</strong></td>
<td>2 tsp</td>
</tr>
<tr>
<td><strong>turmeric</strong></td>
<td>1 tsp</td>
</tr>
<tr>
<td><strong>cayenne pepper (adjust to taste)</strong></td>
<td>1 tsp</td>
</tr>
<tr>
<td><strong>minced garlic</strong></td>
<td>1 tbsp</td>
</tr>
<tr>
<td><strong>grated ginger</strong></td>
<td>1 tbsp</td>
</tr>
<tr>
<td><strong>unsalted butter</strong></td>
<td>4 tbsp</td>
</tr>
<tr>
<td><strong>large onion, finely diced</strong></td>
<td>1</td>
</tr>
<tr>
<td><strong>tomato sauce or crushed tomatoes</strong></td>
<td>1 can (14 oz/400g)</td>
</tr>
<tr>
<td><strong>heavy cream</strong></td>
<td>1 cup</td>
</tr>
<tr>
<td><strong>honey or sugar (optional)</strong></td>
<td>1 tbsp</td>
</tr>
<tr>
<td><strong>Salt</strong></td>
<td>to taste</td>
</tr>
<tr>
<td><strong>cilantro, chopped (for garnish)</strong></td>
<td>Fresh</td>
</tr>
</tbody>
</table>
</div>

### Steps

**1.** In a bowl, mix yogurt, lemon juice, 1 tsp garam masala, 1 tsp cumin, 1 tsp paprika, turmeric, and cayenne pepper.

**2.** Add chicken pieces to the marinade, making sure they are well coated. Cover and refrigerate for at least 30 minutes, ideally 2-4 hours.

**3.** In a large pan or dutch oven, heat 2 tbsp of butter over medium-high heat. Add the marinated chicken pieces and cook until they start to brown, about 3-5 minutes. Remove and set aside.

**4.** In the same pan, add the remaining butter. Add diced onions and sauté until soft and translucent, about 3-4 minutes.

**5.** Add minced garlic and grated ginger, cook for another minute until fragrant.

**6.** Add the remaining garam masala, cumin, and paprika. Stir and cook for 30 seconds.

**7.** Pour in the tomato sauce/crushed tomatoes. Bring to a simmer and cook for 10-15 minutes, stirring occasionally, until the sauce thickens slightly.

**8.** Return the chicken to the pan. Simmer for another 10 minutes until chicken is fully cooked.

**9.** Stir in the heavy cream and honey/sugar if using. Simmer for 5 more minutes, stirring occasionally.

**10.** Taste and adjust seasoning with salt as needed.

**11.** Garnish with fresh chopped cilantro before serving.
`;

  return (
    <div className="bg-white p-6 md:p-8 rounded-2xl shadow-lg mb-6 border-2 border-orange-200">
      <div className="prose max-w-none prose-headings:text-black prose-p:text-black prose-li:text-black prose-li:marker:text-orange-600 prose-strong:text-black prose-h2:text-2xl prose-h3:text-xl font-medium">
        <div className="bg-orange-50 p-4 rounded-lg border-2 border-orange-200">
          <ReactMarkdown 
            className="text-black font-medium"
            components={{
              p: ({node, ...props}) => <p style={{color: 'black', fontWeight: 500}} {...props} />,
              li: ({node, ...props}) => <li style={{color: 'black', fontWeight: 500}} {...props} />,
              h2: ({node, ...props}) => <h2 style={{color: 'black', fontWeight: 700}} {...props} />,
              h3: ({node, ...props}) => <h3 style={{color: 'black', fontWeight: 600}} {...props} />,
              strong: ({node, ...props}) => <strong style={{color: 'black', fontWeight: 700}} {...props} />,
              table: ({node, ...props}) => <table className="w-full border-collapse my-4" {...props} />,
              thead: ({node, ...props}) => <thead className="bg-orange-100" {...props} />,
              th: ({node, ...props}) => <th className="border border-orange-200 p-2 text-left text-black font-semibold" {...props} />,
              td: ({node, ...props}) => <td className="border border-orange-200 p-2 text-black" {...props} />,
              tr: ({node, ...props}) => <tr className="border-b border-orange-200" {...props} />
            }}
          >
            {recipeMarkdown}
          </ReactMarkdown>
        </div>
      </div>
      <style jsx global>{`
        .ingredients-table table {
          width: 100%;
          border-collapse: collapse;
          margin: 1rem 0;
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
          .ingredients-table th,
          .ingredients-table td {
            display: block;
            width: 100%;
          }
          
          .ingredients-table tr {
            margin-bottom: 1rem;
            display: block;
            border: 1px solid #fed7aa;
          }
          
          .ingredients-table th {
            text-align: center;
          }
          
          .ingredients-table thead {
            display: none;
          }
          
          .ingredients-table td:before {
            content: attr(data-label);
            font-weight: 600;
            display: inline-block;
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
};

export default ButterChickenRecipe; 