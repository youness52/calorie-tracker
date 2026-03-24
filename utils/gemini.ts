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
  try {
    const response = await fetch(
      "https://your-project.vercel.app/api/analyze",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          image: base64Image,
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText);
    }

    const data = await response.json();

    const resultText = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!resultText) {
      throw new Error("No valid response from AI");
    }

    // Since we forced JSON mode → no need to clean markdown
    const parsedData = JSON.parse(resultText);

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
    console.error("Error analyzing image:", error);
    throw error;
  }
}
