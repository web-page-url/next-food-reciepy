import '../polyfills';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaMicrophone, FaDownload, FaBookmark, FaRegBookmark, FaUtensils, FaSearch } from 'react-icons/fa';
import ReactMarkdown from 'react-markdown';
import dynamic from 'next/dynamic';
import { generateRecipe as callDeepseekAPI, getMockRecipe } from '../services/recipeService';

// Create a client-side only component for speech recognition
const SpeechRecognitionButton = dynamic(
  () => import('../components/SpeechRecognitionButton').then((mod) => mod.default),
  { ssr: false }
);

// Import the DebugPanel component with client-side only rendering
const DebugPanel = dynamic(
  () => import('../components/DebugPanel').then((mod) => mod.default),
  { ssr: false }
);

type Recipe = {
  title?: string;
  ingredients?: string[];
  steps?: string[];
  nutrition?: {
    calories: number;
    protein: string;
    carbs: string;
    fat: string;
  };
  image_prompt?: string;
  markdown?: string;
  timestamp?: number;
};

export default function Home() {
  const [query, setQuery] = useState('');
  const [recipe, setRecipe] = useState<Recipe>({});
  const [loading, setLoading] = useState(false);
  const [savedRecipes, setSavedRecipes] = useState<Recipe[]>([]);
  const recipeRef = useRef<HTMLDivElement>(null);
  const [isClient, setIsClient] = useState(false);
  const [usingMockData, setUsingMockData] = useState(false);
  const [recipeImage, setRecipeImage] = useState('');
  
  // Set isClient to true when component mounts (client-side only)
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Load saved recipes from local storage (client-side only)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('savedRecipes');
      if (saved) setSavedRecipes(JSON.parse(saved));
    }
  }, [isClient]);

  const handleVoiceInput = (transcript: string) => {
    setQuery(transcript);
  };

  // Function to fetch a recipe image from Unsplash
  const fetchRecipeImage = async (title: string) => {
    try {
      // Array of reliable, direct image URLs that don't require redirects
      const foodImages = [
        'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=800&h=600',
        'https://images.pexels.com/photos/376464/pexels-photo-376464.jpeg?auto=compress&cs=tinysrgb&w=800&h=600',
        'https://images.pexels.com/photos/1099680/pexels-photo-1099680.jpeg?auto=compress&cs=tinysrgb&w=800&h=600',
        'https://images.pexels.com/photos/1640772/pexels-photo-1640772.jpeg?auto=compress&cs=tinysrgb&w=800&h=600',
        'https://images.pexels.com/photos/958545/pexels-photo-958545.jpeg?auto=compress&cs=tinysrgb&w=800&h=600',
        'https://images.pexels.com/photos/616354/pexels-photo-616354.jpeg?auto=compress&cs=tinysrgb&w=800&h=600'
      ];
      
      // Use consistent image by selecting one based on the recipe title
      const titleHash = title.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
      const selectedImageIndex = titleHash % foodImages.length;
      const imageUrl = foodImages[selectedImageIndex];
      
      console.log("Using food image:", imageUrl);
      setRecipeImage(imageUrl);
    } catch (error) {
      console.error('Error setting image:', error);
      // Fallback to a default food image if all else fails
      setRecipeImage('https://images.pexels.com/photos/376464/pexels-photo-376464.jpeg?auto=compress&cs=tinysrgb&w=800&h=600');
    }
  };

  const generateRecipe = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setUsingMockData(false);
    setRecipeImage(''); // Clear any existing image
    
    try {
      // Use the client-side service instead of API route
      let data: Recipe;
      
      try {
        console.log("Attempting to call OpenRouter API with query:", query);
        // Try to call OpenRouter API with DeepSeek model
        data = await callDeepseekAPI(query);
        console.log("Successfully received recipe data from API");
      } catch (error: any) {
        // Add a more descriptive error message based on the error type
        console.error("API call failed:", error.message);
        
        // Show a more informative error to the user
        let errorMessage = error.message;
        
        // Create a more user-friendly message
        if (errorMessage.includes('402') || errorMessage.includes('Payment required')) {
          alert("The recipe API usage has reached its limits. Using a sample recipe instead.");
        } else if (errorMessage.includes('401') || errorMessage.includes('Authentication')) {
          alert("There's an issue with the API authentication. Using a sample recipe instead.");
        } else if (errorMessage.includes('429') || errorMessage.includes('Rate limit')) {
          alert("Too many recipe requests. Please try again in a few moments. Using a sample recipe for now.");
        } else {
          alert(`Recipe API call failed: ${errorMessage}. Using sample recipe instead.`);
        }
        
        // Fallback to mock data if API call fails
        data = getMockRecipe(query);
        setUsingMockData(true);
      }
      
      // Generate markdown for the recipe display
      const markdown = `## ${data.title}\n\n### Ingredients\n${data.ingredients?.map((i: string) => `- **${i}**`).join('\n')}\n\n### Steps\n${data.steps?.map((s: string, i: number) => `**${i + 1}.** ${s}`).join('\n\n')}`;
      
      setRecipe({
        ...data,
        timestamp: Date.now(),
        markdown
      });
      
      // Fetch a recipe image after we have the recipe data
      if (data.title) {
        fetchRecipeImage(data.title);
      }
    } catch (error: any) {
      console.error("Error in recipe generation process:", error);
      alert(`Failed to generate recipe: ${error.message}. Please try again.`);
    } finally {
      setLoading(false);
    }
  };

  const saveRecipe = () => {
    if (!recipe.title) return;
    const updatedRecipes = [...savedRecipes, recipe];
    setSavedRecipes(updatedRecipes);
    localStorage.setItem('savedRecipes', JSON.stringify(updatedRecipes));
  };

  const removeRecipe = (timestamp: number) => {
    const updatedRecipes = savedRecipes.filter((r: Recipe) => r.timestamp !== timestamp);
    setSavedRecipes(updatedRecipes);
    localStorage.setItem('savedRecipes', JSON.stringify(updatedRecipes));
  };

  const exportToPDF = async () => {
    if (!recipeRef.current || !recipe.title) return;
    
    try {
      // Dynamically import jsPDF
      const { default: jsPDF } = await import('jspdf');
      const doc = new jsPDF();
      
      doc.text(`Recipe: ${recipe.title}`, 10, 10);
      doc.text(`Generated on ${new Date(recipe.timestamp || 0).toLocaleString()}`, 10, 20);
      
      doc.text('Ingredients:', 10, 30);
      recipe.ingredients?.forEach((item: string, i: number) => {
        doc.text(`- ${item}`, 15, 40 + (i * 7));
      });
      
      doc.text('Steps:', 10, 40 + (recipe.ingredients?.length || 0) * 7);
      recipe.steps?.forEach((step: string, i: number) => {
        doc.text(`${i + 1}. ${step}`, 15, 50 + (recipe.ingredients?.length || 0) * 7 + (i * 7));
      });
      
      doc.save(`${recipe.title.replace(/ /g, '_')}_recipe.pdf`);
    } catch (error) {
      console.error('Error exporting PDF:', error);
      alert('Failed to export PDF. Please try again.');
    }
  };

  const isSaved = savedRecipes.some((r: Recipe) => r.timestamp === recipe.timestamp);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-100 to-orange-50 p-4 md:p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-6xl mx-auto"
      >
        <header className="text-center mb-8 md:mb-12">
          <motion.h1 
            className="text-4xl md:text-5xl font-bold text-orange-800 mb-2 md:mb-4"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            🍳 AI Recipe Generator
          </motion.h1>
          <motion.p 
            className="text-gray-700 text-lg"
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            Discover delicious recipes with AI-powered suggestions
          </motion.p>
        </header>
        
        {/* Search Section */}
        <motion.div 
          className="max-w-2xl mx-auto mb-8 md:mb-12"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="What would you like to cook today?"
                className="w-full p-4 pl-10 rounded-xl border-2 border-orange-200 focus:border-orange-500 focus:outline-none shadow-sm text-gray-700"
                onKeyDown={(e) => e.key === 'Enter' && !loading && generateRecipe()}
              />
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-orange-500" />
            </div>
            <div className="flex gap-2">
              <motion.button
                onClick={generateRecipe}
                disabled={loading}
                className="bg-orange-600 text-white px-6 py-4 rounded-xl hover:bg-orange-700 disabled:opacity-50 transition-colors flex items-center gap-2 shadow-md"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {loading ? (
                  <>
                    <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                    Cooking...
                  </>
                ) : (
                  <>
                    <FaUtensils />
                    Generate Recipe
                  </>
                )}
              </motion.button>
              
              {isClient && <SpeechRecognitionButton onTranscript={handleVoiceInput} />}
            </div>
          </div>
        </motion.div>

        {/* Main Content */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Recipe Display */}
          <div className="flex-1">
            <AnimatePresence mode="wait">
              {recipe.title ? (
                <motion.div
                  key={recipe.timestamp}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                  ref={recipeRef}
                  className="bg-white p-6 md:p-8 rounded-2xl shadow-lg mb-6 border-2 border-orange-200"
                >
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-6">
                    <div>
                      <h2 className="text-2xl sm:text-3xl font-bold text-black break-words">{recipe.title}</h2>
                      {usingMockData && (
                        <div className="mt-2 text-xs px-2 py-1 bg-orange-100 text-orange-800 rounded-md inline-block font-medium">
                          Demo Recipe (API Unavailable)
                        </div>
                      )}
                    </div>
                    <div className="flex gap-3 mt-3 sm:mt-0">
                      <motion.button
                        onClick={isSaved ? () => removeRecipe(recipe.timestamp!) : saveRecipe}
                        className="p-2 text-yellow-600 hover:text-yellow-800 transition-colors bg-yellow-50 rounded-full"
                        title={isSaved ? "Remove from saved" : "Save recipe"}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        {isSaved ? <FaBookmark size={20} /> : <FaRegBookmark size={20} />}
                      </motion.button>
                      <motion.button
                        onClick={exportToPDF}
                        className="p-2 text-orange-600 hover:text-orange-800 transition-colors bg-orange-50 rounded-full"
                        title="Download PDF"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <FaDownload size={20} />
                      </motion.button>
                    </div>
                  </div>

                  {recipeImage ? (
                    <div className="w-full h-64 sm:h-72 md:h-80 bg-orange-50 rounded-xl mb-6 overflow-hidden shadow-md">
                      <img 
                        src={recipeImage} 
                        alt={recipe.title || "Recipe image"} 
                        className="w-full h-full object-cover"
                        loading="eager"
                        onError={(e) => {
                          console.error("Image failed to load");
                          // Fallback to a reliable image if loading fails
                          (e.target as HTMLImageElement).src = 'https://images.pexels.com/photos/376464/pexels-photo-376464.jpeg?auto=compress&cs=tinysrgb&w=800&h=600';
                        }}
                      />
                    </div>
                  ) : recipe.image_prompt ? (
                    <div className="w-full h-64 bg-orange-50 rounded-xl mb-6 flex items-center justify-center text-orange-400">
                      <div className="animate-pulse flex flex-col items-center">
                        <div className="rounded-full bg-orange-200 h-16 w-16 flex items-center justify-center mb-2">
                          <FaUtensils className="text-orange-600" size={24} />
                        </div>
                        <p className="text-orange-600 font-medium">Loading recipe image...</p>
                      </div>
                    </div>
                  ) : null}

                  {/* Recipe content */}
                  <div className="prose max-w-none prose-headings:text-black prose-p:text-black prose-li:text-black prose-li:marker:text-orange-600 prose-strong:text-black prose-h2:text-2xl prose-h3:text-xl font-medium">
                    <div className="bg-orange-50 p-4 rounded-lg border-2 border-orange-200">
                      <ReactMarkdown 
                        className="text-black font-medium"
                        components={{
                          p: ({node, ...props}) => <p style={{color: 'black', fontWeight: 500}} {...props} />,
                          li: ({node, ...props}) => <li style={{color: 'black', fontWeight: 500}} {...props} />,
                          h2: ({node, ...props}) => <h2 style={{color: 'black', fontWeight: 700}} {...props} />,
                          h3: ({node, ...props}) => <h3 style={{color: 'black', fontWeight: 600}} {...props} />,
                          strong: ({node, ...props}) => <strong style={{color: 'black', fontWeight: 700}} {...props} />
                        }}
                      >
                        {recipe.markdown || ''}
                      </ReactMarkdown>
                    </div>
                  </div>

                  {/* Nutrition section */}
                  {recipe.nutrition && (
                    <div className="mt-8 p-4 md:p-6 bg-green-100 rounded-xl shadow-inner border border-green-200">
                      <h3 className="font-bold text-xl mb-4 text-black">🍎 Nutrition Facts</h3>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="bg-white p-3 rounded-lg text-center shadow-sm border border-green-100">
                          <p className="text-sm text-black font-medium">Calories</p>
                          <p className="text-xl font-bold text-black">{recipe.nutrition.calories}</p>
                        </div>
                        <div className="bg-white p-3 rounded-lg text-center shadow-sm border border-green-100">
                          <p className="text-sm text-black font-medium">Protein</p>
                          <p className="text-xl font-bold text-black">{recipe.nutrition.protein}</p>
                        </div>
                        <div className="bg-white p-3 rounded-lg text-center shadow-sm border border-green-100">
                          <p className="text-sm text-black font-medium">Carbs</p>
                          <p className="text-xl font-bold text-black">{recipe.nutrition.carbs}</p>
                        </div>
                        <div className="bg-white p-3 rounded-lg text-center shadow-sm border border-green-100">
                          <p className="text-sm text-black font-medium">Fat</p>
                          <p className="text-xl font-bold text-black">{recipe.nutrition.fat}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </motion.div>
              ) : (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="bg-white p-8 rounded-2xl shadow-lg mb-6 flex flex-col items-center justify-center text-center h-64"
                >
                  <FaUtensils className="text-orange-500 mb-4" size={48} />
                  <h3 className="text-xl text-gray-700 mb-2 font-medium">Ready to cook something amazing?</h3>
                  <p className="text-gray-600">Enter an ingredient or dish above to get started</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Saved Recipes Sidebar */}
          <div className="lg:w-80">
            <div className="sticky top-4">
              <h3 className="font-bold text-xl mb-4 text-gray-900 flex items-center">
                <FaBookmark className="mr-2 text-yellow-600" />
                Saved Recipes
              </h3>
              {savedRecipes.length > 0 ? (
                <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
                  {savedRecipes.map((saved: Recipe) => (
                    <motion.div
                      key={saved.timestamp}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="bg-white p-4 rounded-xl shadow-sm cursor-pointer hover:bg-orange-50 transition-colors border border-orange-200"
                      onClick={() => {
                        setRecipe(saved);
                        if (saved.title) {
                          fetchRecipeImage(saved.title);
                        }
                      }}
                      whileHover={{ scale: 1.02 }}
                    >
                      <div className="flex justify-between items-start">
                        <h4 className="font-medium text-gray-900">{saved.title}</h4>
                        <motion.button
                          onClick={(e: React.MouseEvent) => {
                            e.stopPropagation();
                            removeRecipe(saved.timestamp!);
                          }}
                          className="text-red-600 hover:text-red-800 transition-colors h-6 w-6 flex items-center justify-center"
                          whileHover={{ scale: 1.2 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          ×
                        </motion.button>
                      </div>
                      <p className="text-sm text-gray-700 mt-1">
                        {new Date(saved.timestamp || 0).toLocaleDateString()}
                      </p>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="bg-white p-6 rounded-xl shadow-sm border border-dashed border-orange-200 text-center">
                  <p className="text-gray-700 italic">No saved recipes yet</p>
                  <p className="text-sm text-orange-700 mt-2 font-medium">Save recipes to find them here later</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.div>
      
      {/* Add a notification banner for API issues at the bottom of the page */}
      <AnimatePresence>
        {usingMockData && (
          <motion.div 
            initial={{ y: 50 }}
            animate={{ y: 0 }}
            exit={{ y: 50 }}
            className="fixed bottom-0 left-0 right-0 bg-orange-200 p-3 text-center text-orange-900 border-t border-orange-300 shadow-lg z-40"
          >
            <p className="font-medium">
              <strong>Note:</strong> Using demo mode. The API is currently unavailable. 
              <button 
                onClick={() => setUsingMockData(false)} 
                className="ml-2 underline hover:text-orange-950 font-bold"
              >
                Dismiss
              </button>
            </p>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Add the debug panel component */}
      {isClient && <DebugPanel />}
    </div>
  );
}
