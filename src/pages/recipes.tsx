import React, { useState } from 'react';
import Head from 'next/head';
import { motion } from 'framer-motion';
import RecipeIngredientTable from '../components/RecipeIngredientTable';
import { FaArrowLeft, FaUtensils } from 'react-icons/fa';
import Link from 'next/link';

// Sample recipe data
const RECIPES = [
  {
    id: 'butter-chicken',
    title: 'Butter Chicken',
    ingredients: [
      { name: 'boneless, skinless chicken thighs, cut into bite-sized pieces', amount: '1.5lbs (700g)' },
      { name: 'plain yogurt', amount: '1/2 cup' },
      { name: 'lemon juice', amount: '2 tbsp' },
      { name: 'garam masala', amount: '2 tsp' },
      { name: 'ground cumin', amount: '2 tsp' },
      { name: 'paprika', amount: '2 tsp' },
      { name: 'turmeric', amount: '1 tsp' },
      { name: 'cayenne pepper (adjust to taste)', amount: '1 tsp' },
      { name: 'minced garlic', amount: '1 tbsp' },
      { name: 'grated ginger', amount: '1 tbsp' },
      { name: 'unsalted butter', amount: '4 tbsp' },
      { name: 'large onion, finely diced', amount: '1' },
      { name: 'tomato sauce or crushed tomatoes', amount: '1 can (14 oz/400g)' },
      { name: 'heavy cream', amount: '1 cup' },
      { name: 'honey or sugar (optional)', amount: '1 tbsp' },
      { name: 'Salt', amount: 'to taste' },
      { name: 'cilantro, chopped (for garnish)', amount: 'Fresh' }
    ],
    instructions: [
      'In a bowl, mix yogurt, lemon juice, 1 tsp garam masala, 1 tsp cumin, 1 tsp paprika, turmeric, and cayenne pepper.',
      'Add chicken pieces to the marinade, making sure they are well coated. Cover and refrigerate for at least 30 minutes, ideally 2-4 hours.',
      'In a large pan or dutch oven, heat 2 tbsp of butter over medium-high heat. Add the marinated chicken pieces and cook until they start to brown, about 3-5 minutes. Remove and set aside.',
      'In the same pan, add the remaining butter. Add diced onions and sauté until soft and translucent, about 3-4 minutes.',
      'Add minced garlic and grated ginger, cook for another minute until fragrant.',
      'Add the remaining garam masala, cumin, and paprika. Stir and cook for 30 seconds.',
      'Pour in the tomato sauce/crushed tomatoes. Bring to a simmer and cook for 10-15 minutes, stirring occasionally, until the sauce thickens slightly.',
      'Return the chicken to the pan. Simmer for another 10 minutes until chicken is fully cooked.',
      'Stir in the heavy cream and honey/sugar if using. Simmer for 5 more minutes, stirring occasionally.',
      'Taste and adjust seasoning with salt as needed.',
      'Garnish with fresh chopped cilantro before serving.'
    ],
    image: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600&q=80'
  },
  {
    id: 'pasta-carbonara',
    title: 'Pasta Carbonara',
    ingredients: [
      { name: 'spaghetti or fettuccine', amount: '1 pound (450g)' },
      { name: 'pancetta or bacon, diced', amount: '8 oz (225g)' },
      { name: 'large eggs', amount: '4' },
      { name: 'Pecorino Romano cheese, grated', amount: '1 cup' },
      { name: 'Parmesan cheese, grated', amount: '1/2 cup' },
      { name: 'black pepper, freshly ground', amount: '1 tsp' },
      { name: 'garlic cloves, minced', amount: '2' },
      { name: 'salt', amount: 'to taste' },
      { name: 'fresh parsley, chopped', amount: '2 tbsp' }
    ],
    instructions: [
      'Bring a large pot of salted water to boil.',
      'In a mixing bowl, whisk together eggs, grated Pecorino Romano, Parmesan, and black pepper. Set aside.',
      'Cook pasta according to package instructions until al dente.',
      'While pasta is cooking, heat a large skillet over medium heat. Add diced pancetta/bacon and cook until crispy, about 6-8 minutes.',
      'Add minced garlic to the pancetta and cook for 30 seconds until fragrant.',
      'Reserve 1 cup of pasta cooking water before draining the pasta.',
      'Working quickly, add drained hot pasta to the skillet with pancetta and toss well.',
      'Remove skillet from heat and pour in the egg and cheese mixture, tossing continuously to create a creamy sauce.',
      'Add a splash of reserved pasta water as needed to achieve desired consistency.',
      'Season with additional salt and pepper to taste.',
      'Serve immediately garnished with additional grated cheese and fresh parsley.'
    ],
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600&q=80'
  },
  {
    id: 'vegetable-curry',
    title: 'Vegetable Curry',
    ingredients: [
      { name: 'mixed vegetables (carrots, peas, potatoes, cauliflower)', amount: '4 cups' },
      { name: 'onion, finely chopped', amount: '1 large' },
      { name: 'garlic cloves, minced', amount: '3' },
      { name: 'ginger, grated', amount: '1 tbsp' },
      { name: 'curry powder', amount: '2 tbsp' },
      { name: 'turmeric', amount: '1 tsp' },
      { name: 'cumin', amount: '1 tsp' },
      { name: 'coriander', amount: '1 tsp' },
      { name: 'coconut milk', amount: '1 can (14 oz)' },
      { name: 'vegetable broth', amount: '1 cup' },
      { name: 'tomato paste', amount: '2 tbsp' },
      { name: 'olive oil', amount: '2 tbsp' },
      { name: 'salt and pepper', amount: 'to taste' },
      { name: 'fresh cilantro, chopped', amount: '1/4 cup' },
      { name: 'lime, cut into wedges', amount: '1' }
    ],
    instructions: [
      'Heat olive oil in a large pot over medium heat.',
      'Add onions and sauté until translucent, about 3-4 minutes.',
      'Add garlic and ginger, cook for 1 minute until fragrant.',
      'Stir in curry powder, turmeric, cumin, and coriander. Cook for 30 seconds to bloom the spices.',
      'Add tomato paste and stir to combine.',
      'Add all vegetables and stir to coat with the spice mixture.',
      'Pour in vegetable broth and coconut milk. Bring to a simmer.',
      'Cover and cook for 15-20 minutes, until vegetables are tender.',
      'Season with salt and pepper to taste.',
      'Garnish with fresh cilantro and serve with lime wedges.'
    ],
    image: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600&q=80'
  }
];

const RecipesPage: React.FC = () => {
  const [selectedRecipe, setSelectedRecipe] = useState<string | null>(null);
  
  const currentRecipe = RECIPES.find(recipe => recipe.id === selectedRecipe);
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-100 to-orange-50 p-4 md:p-8">
      <Head>
        <title>Recipe Collection | AI Recipe Generator</title>
        <meta name="description" content="Browse our collection of delicious recipes" />
      </Head>
      
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center mb-6">
          <Link href="/" className="text-orange-600 hover:text-orange-800 mr-4">
            <FaArrowLeft size={20} />
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold text-orange-800">Recipe Collection</h1>
        </div>
        
        {selectedRecipe ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-6 md:p-8 rounded-2xl shadow-lg border-2 border-orange-200"
          >
            <div className="flex justify-between items-start mb-6">
              <h2 className="text-2xl sm:text-3xl font-bold text-black">{currentRecipe?.title}</h2>
              <button 
                onClick={() => setSelectedRecipe(null)}
                className="bg-orange-100 text-orange-700 px-3 py-1 rounded-lg hover:bg-orange-200 transition-colors"
              >
                Back to recipes
              </button>
            </div>
            
            {currentRecipe?.image && (
              <div className="w-full h-64 sm:h-72 md:h-80 bg-orange-50 rounded-xl mb-6 overflow-hidden shadow-md">
                <img 
                  src={currentRecipe.image} 
                  alt={currentRecipe.title} 
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            
            <RecipeIngredientTable 
              title={currentRecipe?.title || ''} 
              ingredients={currentRecipe?.ingredients || []} 
            />
            
            <div className="mt-8">
              <h3 className="font-bold text-xl mb-4 text-black">Instructions</h3>
              <ol className="space-y-3 pl-6">
                {currentRecipe?.instructions.map((step, index) => (
                  <li key={index} className="text-gray-800">
                    <span className="font-bold text-orange-700">{index + 1}.</span> {step}
                  </li>
                ))}
              </ol>
            </div>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {RECIPES.map(recipe => (
              <motion.div
                key={recipe.id}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                className="bg-white rounded-xl shadow-md overflow-hidden cursor-pointer border-2 border-orange-100 hover:border-orange-300 transition-colors"
                onClick={() => setSelectedRecipe(recipe.id)}
              >
                <div className="h-48 overflow-hidden">
                  {recipe.image ? (
                    <img 
                      src={recipe.image} 
                      alt={recipe.title} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-orange-200 flex items-center justify-center">
                      <FaUtensils className="text-orange-600" size={32} />
                    </div>
                  )}
                </div>
                <div className="p-5">
                  <h3 className="font-bold text-xl text-gray-800 mb-2">{recipe.title}</h3>
                  <p className="text-sm text-gray-600">{recipe.ingredients.length} ingredients • {recipe.instructions.length} steps</p>
                  <button className="mt-3 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors w-full">
                    View Recipe
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RecipesPage; 