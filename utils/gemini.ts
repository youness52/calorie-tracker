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
      "https://api-indol-theta-99.vercel.app/analyze",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: base64Image }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      // Handles 429 (Rate Limit) or 400 (No Food) from your backend
      throw new Error(data.error || "Analysis failed");
    }

    // IMPORTANT: 'data' is already the flat JSON object from your server.
    // We don't need to look for data.candidates here.
    return {
      name: data.name || 'Unknown Food',
      calories: Number(data.calories) || 0,
      protein: Number(data.protein) || 0,
      carbs: Number(data.carbs) || 0,
      fat: Number(data.fat) || 0,
      servingSize: data.servingSize || '1 serving',
      category: (data.category as FoodCategory) || 'other',
    };

  } catch (error: any) {
    console.error("Gemini Utility Error:", error);
    throw error;
  }
}
