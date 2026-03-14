import { FoodCategory } from '@/types/food';

interface AIDietaryInfo {
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  servingSize: string;
  category: FoodCategory;
}

export async function analyzeFoodImage(base64Image: string): Promise<AIDietaryInfo> {
  const apiKey = 'AIzaSyCBBpvJymLiC0EzhdxeKWZkB8r5bu_QtPg';
  
  if (!apiKey) {
    throw new Error('Gemini API key is missing. Please add EXPO_PUBLIC_GEMINI_API_KEY to your .env file.');
  }

  const prompt = `
You are a professional nutritionist. Analyze the food in standard serving sizes shown in this image.
Provide the following information exclusively in JSON format without any markdown wrappers, code blocks, or extra text:

{
  "name": "Specific name of the food (e.g., Grilled Chicken Salad)",
  "calories": number (estimated total calories),
  "protein": number (estimated protein in grams),
  "carbs": number (estimated carbs in grams),
  "fat": number (estimated fat in grams),
  "servingSize": "string (estimated serving size, e.g., '1 bowl' or '250g')",
  "category": "one of: protein, carbs, fruit, vegetable, dairy, snack, beverage, other"
}

Be as accurate as possible. If the image is not food, return an error in JSON format like: {"error": "No food detected"}.
`;

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${apiKey}`;

  const requestBody = {
    contents: [
      {
        parts: [
          {
            text: prompt,
          },
          {
            inlineData: {
              data: base64Image,
              mimeType: 'image/jpeg',
            },
          },
        ],
      },
    ],
    generationConfig: {
      temperature: 0.2,
      responseMimeType: "application/json",
    },
  };

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Gemini API Error:', errorText);
      throw new Error(`Failed to analyze image: ${response.statusText}`);
    }

    const data = await response.json();
    const resultText = data.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!resultText) {
      throw new Error('No valid response from Gemini');
    }

    // Try parsing the text (clean up markdown if Gemini ignored the instruction)
    const cleanedText = resultText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    const parsedData = JSON.parse(cleanedText);

    if (parsedData.error) {
      throw new Error(parsedData.error);
    }

    return {
      name: parsedData.name || 'Unknown Food',
      calories: parsedData.calories || 0,
      protein: parsedData.protein || 0,
      carbs: parsedData.carbs || 0,
      fat: parsedData.fat || 0,
      servingSize: parsedData.servingSize || '1 serving',
      category: parsedData.category || 'other',
    };
  } catch (error) {
    console.error('Error analyzing image:', error);
    throw error;
  }
}
