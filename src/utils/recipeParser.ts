/**
 * Types for ingredient data structure
 */
export type Ingredient = {
  name: string;
  amount: string;
};

/**
 * Parse a raw ingredients string into a structured format
 * This handles several common formats:
 * - "1 cup flour"
 * - "2 tbsp olive oil"
 * - "Salt and pepper to taste"
 */
export function parseIngredientsFromString(ingredientsString: string): Ingredient[] {
  // Split the string by newlines and filter out empty lines
  const lines = ingredientsString
    .split('\n')
    .map(line => line.trim())
    .filter(line => line.length > 0);
    
  return lines.map(line => {
    // Try to separate amount from ingredient name
    const match = line.match(/^([\d\/\.\s]+\s*(?:cup|cups|tbsp|tsp|oz|g|kg|ml|l|lb|lbs|pound|pounds|pinch|dash|to taste)?)(.+)$/i);
    
    if (match && match[1] && match[1].trim()) {
      // If we found a pattern with amount and unit
      return {
        name: match[2].trim(),
        amount: match[1].trim()
      };
    } else {
      // Check if there's a number at the beginning
      const numberMatch = line.match(/^([\d\/\.\s]+)(.+)$/);
      
      if (numberMatch && numberMatch[1] && numberMatch[1].trim()) {
        return {
          name: numberMatch[2].trim(),
          amount: numberMatch[1].trim()
        };
      } else {
        // If no clear amount is found, assume it's "to taste" or a similar qualifier
        return {
          name: line,
          amount: "as needed"
        };
      }
    }
  });
}

/**
 * Parse a HTML table into structured ingredients
 */
export function parseIngredientsFromTable(tableHtml: string): Ingredient[] {
  const ingredients: Ingredient[] = [];
  
  try {
    // Create a temporary div to parse the HTML
    if (typeof document !== 'undefined') {
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = tableHtml;
      
      // Find all table rows
      const rows = tempDiv.querySelectorAll('tr');
      
      rows.forEach(row => {
        const cells = row.querySelectorAll('td, th');
        
        // Skip header rows or invalid rows
        if (cells.length < 2 || (cells[0].tagName === 'TH' && cells[1].tagName === 'TH')) return;
        
        // Extract text content from cells
        let firstCell = cells[0].textContent?.trim() || '';
        let secondCell = cells[1].textContent?.trim() || '';
        
        // Handle strong tags inside cells
        const firstStrong = cells[0].querySelector('strong');
        const secondStrong = cells[1].querySelector('strong');
        
        if (firstStrong) firstCell = firstStrong.textContent?.trim() || firstCell;
        if (secondStrong) secondCell = secondStrong.textContent?.trim() || secondCell;
        
        // Check if first cell looks like an amount (contains numbers or common units)
        const firstCellIsAmount = /^[\d\/\.\s]+|cup|cups|tbsp|tsp|oz|g|kg|ml|l|lb|lbs|pound|pounds/i.test(firstCell);
        
        if (firstCellIsAmount) {
          ingredients.push({
            name: secondCell,
            amount: firstCell
          });
        } else {
          ingredients.push({
            name: firstCell,
            amount: secondCell
          });
        }
      });
      
      return ingredients;
    }
  } catch (error) {
    console.error('Error parsing HTML:', error);
  }
  
  // Server-side or fallback - use a simple regex approach to extract table rows
  const rows = tableHtml.match(/<tr[^>]*>(.+?)<\/tr>/gs) || [];
  
  rows.forEach(row => {
    const cells = row.match(/<td[^>]*>(.+?)<\/td>/gs) || [];
    if (cells.length < 2) return;
    
    // Extract content from cells
    const cellContents = cells.map(cell => {
      // Remove HTML tags but preserve strong tag content
      let content = cell.replace(/<td[^>]*>|<\/td>/g, '');
      
      // Extract content from strong tag if present
      const strongMatch = content.match(/<strong[^>]*>(.+?)<\/strong>/);
      if (strongMatch && strongMatch[1]) {
        content = strongMatch[1];
      } else {
        // Otherwise remove all HTML tags
        content = content.replace(/<[^>]+>/g, '');
      }
      
      return content.trim();
    });
    
    // Check if first cell looks like an amount
    const firstCellIsAmount = /^[\d\/\.\s]+|cup|cups|tbsp|tsp|oz|g|kg|ml|l|lb|lbs|pound|pounds/i.test(cellContents[0]);
    
    if (firstCellIsAmount) {
      ingredients.push({
        name: cellContents[1],
        amount: cellContents[0]
      });
    } else {
      ingredients.push({
        name: cellContents[0],
        amount: cellContents[1]
      });
    }
  });
  
  return ingredients;
}

/**
 * Attempts to determine ingredient type from strings or HTML content
 * and convert to structured format
 */
export function parseCustomIngredients(input: string): Ingredient[] {
  // Check if input looks like HTML
  if (input.includes('<table') || input.includes('<tr') || input.includes('<td')) {
    // Try to parse as HTML table
    try {
      return parseIngredientsFromTable(input);
    } catch (error) {
      console.error('Error parsing ingredients table:', error);
      // Fall back to string parsing
      return parseIngredientsFromString(input);
    }
  } else {
    // Parse as plain text
    return parseIngredientsFromString(input);
  }
} 