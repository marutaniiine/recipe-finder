import RecipeCard from './RecipeCard';
import './RecipeList.css';

interface Recipe {
  id: string;
  name: string;
  ingredients: string[];
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  cookTime: number;
  steps: string[];
  nutrition: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
}

interface RecipeListProps {
  recipes: Recipe[];
}

export default function RecipeList({ recipes }: RecipeListProps) {
  return (
    <div className="recipe-list">
      {recipes.map(recipe => (
        <RecipeCard key={recipe.id} recipe={recipe} />
      ))}
    </div>
  );
}
