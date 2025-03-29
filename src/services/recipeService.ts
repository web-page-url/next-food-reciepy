import axios from 'axios';

type Recipe = {
  title: string;
  ingredients: string[];
  steps: string[];
  nutrition: {
    calories: number;
    protein: string;
    carbs: string;
    fat: string;
  };
  image_prompt: string;
};

// Helper to get the API key from window or process.env
const getApiKey = (): string => {
  if (typeof window !== 'undefined' && window.ENV_OPENROUTER_API_KEY) {
    console.log('Using API key from window.ENV_OPENROUTER_API_KEY');
    return window.ENV_OPENROUTER_API_KEY;
  }
  console.log('Falling back to process.env.OPENROUTER_API_KEY');
  return process.env.OPENROUTER_API_KEY || '';
};

/**
 * Calls the OpenRouter API with DeepSeek model to generate a recipe
 */
export const generateRecipe = async (query: string): Promise<Recipe> => {
  try {
    const apiKey = getApiKey();
    
    // Log API key availability (without logging the key itself)
    console.log('API Key available?', !!apiKey, 'Length:', apiKey ? apiKey.length : 0);
    
    if (!apiKey) {
      console.error('OpenRouter API key is not available');
      throw new Error('API key is not configured');
    }
    
    const url = "https://openrouter.ai/api/v1/chat/completions";
    console.log('Making request to:', url);
    
    const requestBody = {
      model: "deepseek/deepseek-chat-v3-0324:free",
      messages: [
        {
          role: "system",
          content: `You are a professional chef and nutritionist. Return recipes in this EXACT JSON format:
          {
            "title": string,
            "ingredients": string[],
            "steps": string[],
            "nutrition": {
              "calories": number,
              "protein": string,
              "carbs": string,
              "fat": string
            },
            "image_prompt": "A professional food photography of [DISH] with [INGREDIENTS]"
          }`
        },
        {
          role: "user",
          content: `Generate a detailed recipe for: ${query}. Include nutrition estimates.`
        }
      ],
      temperature: 0.7,
    };
    
    console.log('Request body:', JSON.stringify(requestBody));
    
    const headers = { 
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "HTTP-Referer": typeof window !== 'undefined' ? window.location.href : 'https://recipe-generator.app',
      "X-Title": "AI Recipe Generator",
    };
    
    console.log('Request headers:', JSON.stringify(headers, (key, value) => 
      key === 'Authorization' ? 'Bearer [REDACTED]' : value
    ));
    
    // Call OpenRouter API directly from the client using DeepSeek model
    const response = await axios.post(
      url,
      requestBody,
      { headers }
    );

    console.log('OpenRouter API response status:', response.status);
    console.log('OpenRouter API response headers:', JSON.stringify(response.headers));
    console.log('OpenRouter API response data structure:', Object.keys(response.data));
    
    // Parse the JSON from OpenRouter's response
    try {
      if (response.data && response.data.choices && response.data.choices[0] && response.data.choices[0].message) {
        // The structure of OpenRouter response is similar to OpenAI
        const content = response.data.choices[0].message.content;
        console.log('Raw content from API:', content.substring(0, 200) + (content.length > 200 ? '...' : ''));
        
        // Extract the JSON object from the content
        try {
          const recipeData = JSON.parse(content);
          console.log('Successfully parsed recipe data:', Object.keys(recipeData));
          return recipeData;
        } catch (jsonError) {
          console.error('Failed to parse JSON from content:', content);
          
          // Attempt to extract JSON if wrapped in code blocks or has text before/after
          const jsonMatch = content.match(/```(?:json)?([\s\S]*?)```/) || 
                          content.match(/{[\s\S]*?}/);
                          
          if (jsonMatch) {
            try {
              const extractedJson = jsonMatch[0].replace(/```json|```/g, '').trim();
              console.log('Extracted JSON:', extractedJson.substring(0, 200) + (extractedJson.length > 200 ? '...' : ''));
              const recipeData = JSON.parse(extractedJson);
              console.log('Successfully parsed recipe data from extracted JSON:', Object.keys(recipeData));
              return recipeData;
            } catch (e) {
              console.error('Failed to parse extracted JSON:', e);
              throw new Error('Could not parse recipe from response');
            }
          } else {
            throw new Error('Response did not contain valid JSON');
          }
        }
      } else {
        console.error('Unexpected API response format', JSON.stringify(response.data));
        throw new Error('Invalid API response format');
      }
    } catch (error) {
      console.error("Failed to parse recipe:", error);
      throw error;
    }
  } catch (error: any) {
    // Provide specific error messages for common error status codes
    if (error.response) {
      const status = error.response.status;
      console.error('Error response data:', JSON.stringify(error.response.data));
      
      if (status === 402) {
        console.error('Payment required: Your OpenRouter API account has exceeded limits or requires payment');
        throw new Error('Payment required: Your API usage has exceeded limits or requires payment. Please check your API account.');
      } else if (status === 401) {
        console.error('Authentication failed: Invalid API key');
        throw new Error('Authentication failed: Please check your OpenRouter API key.');
      } else if (status === 429) {
        console.error('Rate limit exceeded: Too many requests');
        throw new Error('Rate limit exceeded: Please try again later.');
      } else {
        console.error(`Error (${status}) generating recipe:`, error.message);
        throw new Error(`API error (${status}): ${error.message}`);
      }
    } else if (error.request) {
      console.error('Network error: No response received from API', error.message);
      throw new Error('Network error: Unable to reach the API. Please check your internet connection.');
    } else {
      console.error('Error generating recipe:', error.message, error.stack);
      throw error;
    }
  }
};

/**
 * Generate a mock recipe for demo/fallback
 */
export const getMockRecipe = (query: string): Recipe => {
  console.log('Using mock recipe for:', query);
  const capitalizedQuery = query.split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
    
  // Common ingredients for different recipe types
  const queryLower = query.toLowerCase();
  
  let ingredients: string[] = [
    '2 cups of main ingredient',
    '1 tablespoon of olive oil',
    'Salt and pepper to taste',
    '1/2 cup of chopped onions',
    '3 cloves of garlic, minced',
    'Fresh herbs for garnish'
  ];
  
  let steps: string[] = [
    'Preheat the oven to 350°F (175°C)',
    'Prepare all ingredients as indicated in the list',
    'Heat oil in a large pan over medium heat',
    'Add onions and garlic, cook until fragrant',
    'Add main ingredients and cook for 10-15 minutes', 
    'Season with salt and pepper',
    'Transfer to a baking dish if needed and bake for 20 minutes',
    'Let cool for 5 minutes before serving',
    'Garnish with fresh herbs'
  ];
  
  // Default nutrition values
  let nutrition = {
    calories: 320,
    protein: '15g',
    carbs: '25g',
    fat: '12g'
  };
  
  // Customize recipe based on query keywords
  if (queryLower.includes('chicken')) {
    ingredients = [
      '2 pounds boneless chicken breasts, cut into strips',
      '2 tablespoons olive oil',
      '1 teaspoon salt and 1/2 teaspoon black pepper',
      '1 onion, chopped',
      '2 bell peppers, sliced',
      '3 cloves garlic, minced',
      '1 teaspoon dried oregano',
      'Fresh parsley for garnish'
    ];
    steps = [
      'Season chicken strips with salt and pepper',
      'Heat olive oil in a large skillet over medium-high heat',
      'Cook chicken in batches until golden brown, about 5-6 minutes per side',
      'Remove chicken and set aside',
      'In the same pan, sauté onions and peppers until softened',
      'Add garlic and oregano, cook for 1 minute until fragrant',
      'Return chicken to the pan and combine with vegetables',
      'Cook for additional 5 minutes until chicken is cooked through',
      'Garnish with fresh parsley before serving'
    ];
    nutrition = {
      calories: 380,
      protein: '42g',
      carbs: '8g',
      fat: '18g'
    };
  } else if (queryLower.includes('pasta') || queryLower.includes('spaghetti')) {
    ingredients = [
      '1 pound pasta or spaghetti',
      '2 tablespoons olive oil',
      '1 onion, finely chopped',
      '4 cloves garlic, minced',
      '1 can (28 oz) crushed tomatoes',
      '1 teaspoon dried basil',
      '1 teaspoon dried oregano',
      '1/2 teaspoon red pepper flakes (optional)',
      'Salt and black pepper to taste',
      'Grated Parmesan cheese for serving',
      'Fresh basil leaves for garnish'
    ];
    steps = [
      'Bring a large pot of salted water to a boil',
      'Cook pasta according to package instructions until al dente',
      'Meanwhile, heat olive oil in a large pan over medium heat',
      'Add onion and cook until softened, about 4-5 minutes',
      'Add garlic and cook for 30 seconds until fragrant',
      'Pour in crushed tomatoes, add dried herbs and red pepper flakes',
      'Simmer sauce for 15-20 minutes, stirring occasionally',
      'Season with salt and pepper to taste',
      'Drain pasta and add to the sauce, tossing to coat evenly',
      'Serve with grated Parmesan and fresh basil leaves'
    ];
    nutrition = {
      calories: 420,
      protein: '14g',
      carbs: '68g',
      fat: '10g'
    };
  } else if (queryLower.includes('vegetarian') || queryLower.includes('vegan') || queryLower.includes('veggie')) {
    ingredients = [
      '2 tablespoons olive oil',
      '1 large onion, diced',
      '3 cloves garlic, minced',
      '1 bell pepper, chopped',
      '1 zucchini, chopped',
      '1 cup mushrooms, sliced',
      '1 can (15 oz) chickpeas, drained and rinsed',
      '1 can (14 oz) diced tomatoes',
      '1 teaspoon cumin',
      '1 teaspoon paprika',
      '1/2 teaspoon turmeric',
      'Salt and pepper to taste',
      'Fresh cilantro or parsley for garnish'
    ];
    steps = [
      'Heat olive oil in a large pot over medium heat',
      'Add onion and cook until translucent, about 3-4 minutes',
      'Add garlic and cook for 30 seconds until fragrant',
      'Add bell pepper, zucchini, and mushrooms, cook for 5-7 minutes until vegetables begin to soften',
      'Stir in chickpeas, diced tomatoes, and spices',
      'Cover and simmer for 15-20 minutes, stirring occasionally',
      'Season with salt and pepper to taste',
      'Serve hot, garnished with fresh herbs'
    ];
    nutrition = {
      calories: 280,
      protein: '10g',
      carbs: '35g',
      fat: '8g'
    };
  } else if (queryLower.includes('fish') || queryLower.includes('salmon') || queryLower.includes('seafood')) {
    ingredients = [
      '1.5 pounds fish fillets (salmon, cod, or tilapia)',
      '2 tablespoons olive oil',
      '1 lemon, sliced',
      '3 cloves garlic, minced',
      '1 tablespoon fresh dill, chopped',
      '1 teaspoon paprika',
      'Salt and pepper to taste',
      '1 tablespoon butter',
      'Fresh parsley for garnish'
    ];
    steps = [
      'Preheat oven to 375°F (190°C)',
      'Pat fish fillets dry with paper towels',
      'Season both sides of fillets with salt, pepper, and paprika',
      'Heat olive oil in an oven-safe skillet over medium-high heat',
      'Place fish skin-side down (if applicable) and cook for 3-4 minutes',
      'Add garlic, butter, and lemon slices to the skillet',
      'Transfer skillet to preheated oven and bake for 10-12 minutes until fish flakes easily',
      'Sprinkle with fresh dill and parsley before serving'
    ];
    nutrition = {
      calories: 310,
      protein: '36g',
      carbs: '4g',
      fat: '16g'
    };
  } else if (queryLower.includes('soup') || queryLower.includes('stew')) {
    ingredients = [
      '1 tablespoon olive oil',
      '1 large onion, diced',
      '2 carrots, sliced',
      '2 celery stalks, sliced',
      '2 cloves garlic, minced',
      '6 cups vegetable or chicken broth',
      '1 cup diced tomatoes',
      '1 cup lentils or beans, rinsed',
      '1 teaspoon dried thyme',
      '1 bay leaf',
      'Salt and pepper to taste',
      'Fresh parsley for garnish'
    ];
    steps = [
      'Heat oil in a large pot over medium heat',
      'Add onion, carrots, and celery, cook for 5 minutes until softened',
      'Add garlic and cook for 30 seconds until fragrant',
      'Pour in broth, add tomatoes, lentils, thyme, and bay leaf',
      'Bring to a boil, then reduce heat to low',
      'Cover and simmer for 25-30 minutes, until lentils are tender',
      'Remove bay leaf and season with salt and pepper',
      'Serve hot, garnished with fresh parsley'
    ];
    nutrition = {
      calories: 220,
      protein: '12g',
      carbs: '30g',
      fat: '5g'
    };
  } else if (queryLower.includes('dessert') || queryLower.includes('cake') || queryLower.includes('cookie')) {
    ingredients = [
      '1 1/2 cups all-purpose flour',
      '1 cup sugar',
      '1/2 cup butter, softened',
      '2 eggs',
      '1 teaspoon vanilla extract',
      '1/2 teaspoon baking powder',
      '1/4 teaspoon salt',
      '1/2 cup milk',
      'Optional toppings or mix-ins as desired'
    ];
    steps = [
      'Preheat oven to 350°F (175°C)',
      'In a large bowl, cream together butter and sugar until light and fluffy',
      'Beat in eggs one at a time, then stir in vanilla',
      'In a separate bowl, combine flour, baking powder, and salt',
      'Gradually add dry ingredients to the wet mixture, alternating with milk',
      'Pour batter into prepared pan or distribute on cookie sheet',
      'Bake for 25-30 minutes for cake, 10-12 minutes for cookies',
      'Allow to cool before serving'
    ];
    nutrition = {
      calories: 380,
      protein: '5g',
      carbs: '55g',
      fat: '16g'
    };
  }
    
  return {
    title: `${capitalizedQuery} Recipe`,
    ingredients,
    steps,
    nutrition,
    image_prompt: `A professional food photography of delicious ${query} with fresh ingredients, beautifully plated`
  };
}; 