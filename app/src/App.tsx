import { useState, useMemo } from 'react';
import './App.css';
import IngredientInput from './components/IngredientInput';
import RecipeList from './components/RecipeList';
import { RECIPE_DATABASE } from './data/recipes';

function App() {
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>([]);

  const matchedRecipes = useMemo(() => {
    if (selectedIngredients.length === 0) {
      return [];
    }

    return RECIPE_DATABASE.filter(recipe => {
      const recipeIngredientsLower = recipe.ingredients.map(i => i.toLowerCase());
      const selectedLower = selectedIngredients.map(i => i.toLowerCase());

      // 選択された食材が全て含まれているレシピを抽出
      const allMatched = selectedLower.every(selected =>
        recipeIngredientsLower.some(ri => ri.includes(selected) || selected.includes(ri))
      );

      return allMatched;
    }).sort((a, b) => {
      // マッチ度でソート（選択食材が多いほど上位）
      const aMatches = selectedIngredients.filter(s =>
        a.ingredients.some(i => i.toLowerCase().includes(s.toLowerCase()))
      ).length;
      const bMatches = selectedIngredients.filter(s =>
        b.ingredients.some(i => i.toLowerCase().includes(s.toLowerCase()))
      ).length;
      return bMatches - aMatches;
    });
  }, [selectedIngredients]);

  const handleAddIngredient = (ingredient: string) => {
    if (!selectedIngredients.includes(ingredient) && ingredient.trim()) {
      setSelectedIngredients([...selectedIngredients, ingredient.trim()]);
    }
  };

  const handleRemoveIngredient = (ingredient: string) => {
    setSelectedIngredients(selectedIngredients.filter(i => i !== ingredient));
  };

  const handleClear = () => {
    setSelectedIngredients([]);
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>🍳 食材から逆引きレシピ</h1>
        <p>冷蔵庫の食材を入力すると、それで作れるレシピを自動提案</p>
      </header>

      <div className="app-container">
        <div className="input-section">
          <IngredientInput
            onAddIngredient={handleAddIngredient}
            selectedIngredients={selectedIngredients}
            onRemoveIngredient={handleRemoveIngredient}
            onClear={handleClear}
          />
        </div>

        <div className="results-section">
          {selectedIngredients.length > 0 ? (
            <>
              <h2 className="results-title">
                マッチしたレシピ ({matchedRecipes.length})
              </h2>
              {matchedRecipes.length > 0 ? (
                <RecipeList recipes={matchedRecipes} />
              ) : (
                <div className="no-results">
                  <p>😢 申し訳ありません。この食材の組み合わせで作れるレシピが見つかりませんでした。</p>
                  <p>他の食材を試してみてください</p>
                </div>
              )}
            </>
          ) : (
            <div className="empty-state">
              <p>食材を選択してレシピを検索しましょう！</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
