import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { motion } from 'framer-motion';
import { FaArrowLeft, FaTable, FaPaste, FaCheck } from 'react-icons/fa';
import Link from 'next/link';
import { useRouter } from 'next/router';
import CustomIngredientTable from '../components/CustomIngredientTable';

const ConvertPage: React.FC = () => {
  const router = useRouter();
  const [inputText, setInputText] = useState('');
  const [recipeTitle, setRecipeTitle] = useState('');
  const [converted, setConverted] = useState(false);
  const [rawHtml, setRawHtml] = useState('');

  // Handle URL parameters
  useEffect(() => {
    if (router.query.title) {
      setRecipeTitle(router.query.title as string);
    }
  }, [router.query]);

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setInputText(text);
    } catch (err) {
      console.error('Failed to read clipboard contents:', err);
      alert('Unable to access clipboard. Please paste manually.');
    }
  };

  const handleConvert = () => {
    if (!inputText.trim()) {
      alert('Please enter ingredient content to convert');
      return;
    }
    
    if (!recipeTitle.trim()) {
      setRecipeTitle('My Recipe');
    }
    
    // For HTML table data
    if (inputText.includes('<table') || inputText.includes('<tr') || inputText.includes('<td')) {
      setRawHtml(inputText);
    }
    
    setConverted(true);
  };

  const handleReset = () => {
    setInputText('');
    setRecipeTitle('');
    setConverted(false);
    setRawHtml('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-100 to-orange-50 p-4 md:p-8">
      <Head>
        <title>Ingredient Converter | AI Recipe Generator</title>
        <meta name="description" content="Convert ingredient text to properly formatted tables" />
      </Head>
      
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center mb-6">
          <Link href="/" className="text-orange-600 hover:text-orange-800 mr-4">
            <FaArrowLeft size={20} />
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold text-orange-800">Ingredient Converter</h1>
        </div>
        
        {!converted ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-6 md:p-8 rounded-2xl shadow-lg border-2 border-orange-200"
          >
            <div className="mb-6">
              <label htmlFor="recipe-title" className="block text-gray-700 font-medium mb-2">
                Recipe Title
              </label>
              <input
                id="recipe-title"
                type="text"
                value={recipeTitle}
                onChange={(e) => setRecipeTitle(e.target.value)}
                placeholder="Enter recipe title"
                className="w-full p-3 rounded-lg border-2 border-orange-200 focus:border-orange-500 focus:outline-none"
              />
            </div>
            
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <label htmlFor="ingredient-input" className="block text-gray-700 font-medium">
                  Ingredient Content
                </label>
                <button
                  onClick={handlePaste}
                  className="text-orange-600 hover:text-orange-800 text-sm flex items-center gap-1"
                >
                  <FaPaste /> Paste from Clipboard
                </button>
              </div>
              <textarea
                id="ingredient-input"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Paste ingredient content here. This can be text or HTML table markup."
                className="w-full p-3 rounded-lg border-2 border-orange-200 focus:border-orange-500 focus:outline-none h-64 font-mono text-sm"
              />
              <div className="mt-2 text-sm text-gray-600">
                <p>Supported formats:</p>
                <ul className="list-disc pl-5 mt-1">
                  <li>Line-by-line text (e.g. "1 cup flour")</li>
                  <li>HTML table markup with ingredient and amount columns</li>
                  <li>Raw table data from websites (often in the format: <code>&lt;td&gt;ingredient&lt;/td&gt;&lt;td&gt;amount&lt;/td&gt;</code>)</li>
                </ul>
              </div>
            </div>
            
            <button
              onClick={handleConvert}
              className="w-full py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors flex items-center justify-center gap-2 font-medium"
            >
              <FaTable /> Convert to Table Format
            </button>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="bg-green-50 border border-green-200 text-green-800 p-4 rounded-lg mb-6 flex items-center gap-3">
              <FaCheck className="text-green-600" />
              <p>Successfully converted ingredients to table format!</p>
              <button
                onClick={handleReset}
                className="ml-auto bg-white text-green-700 px-3 py-1 rounded border border-green-300 text-sm hover:bg-green-50"
              >
                Convert Another
              </button>
            </div>
            
            <CustomIngredientTable rawContent={rawHtml || inputText} title={recipeTitle} />
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default ConvertPage; 