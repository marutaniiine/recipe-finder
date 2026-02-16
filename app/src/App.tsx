import { useState, useMemo } from 'react';
import './App.css';
import IngredientInput from './components/IngredientInput';
import RecipeList from './components/RecipeList';

interface Recipe {
  id: string;
  name: string;
  ingredients: string[];
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  cookTime: number;
  nutrition: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
}

const RECIPE_DATABASE: Recipe[] = [
  {
    id: '1',
    name: 'シンプルトマトパスタ',
    ingredients: ['トマト', 'パスタ', 'ニンニク', 'オリーブオイル', '塩'],
    description: 'フレッシュなトマトを使ったイタリアンンスタイルのパスタ',
    difficulty: 'easy',
    cookTime: 15,
    nutrition: { calories: 320, protein: 12, carbs: 55, fat: 8 }
  },
  {
    id: '2',
    name: 'チキンサラダ',
    ingredients: ['鶏肉', 'レタス', 'トマト', 'キュウリ', 'ドレッシング'],
    description: 'ヘルシーで栄養満点のサラダ。ジムトレ後の定番',
    difficulty: 'easy',
    cookTime: 20,
    nutrition: { calories: 280, protein: 32, carbs: 15, fat: 10 }
  },
  {
    id: '3',
    name: 'カレーライス',
    ingredients: ['お米', '玉ねぎ', 'ニンジン', 'ジャガイモ', 'カレーペースト', '鶏肉'],
    description: '日本の国民食。甘口から辛口まで好みで調整',
    difficulty: 'medium',
    cookTime: 40,
    nutrition: { calories: 520, protein: 18, carbs: 65, fat: 18 }
  },
  {
    id: '4',
    name: 'ニンニク炒め',
    ingredients: ['キャベツ', 'ニンニク', 'オイル', '塩', 'コショウ'],
    description: 'シンプルだけど美味しい。どんな料理のおかずに最適',
    difficulty: 'easy',
    cookTime: 10,
    nutrition: { calories: 140, protein: 5, carbs: 18, fat: 6 }
  },
  {
    id: '5',
    name: 'オムレツ',
    ingredients: ['卵', 'バター', 'チーズ', 'パセリ', '塩'],
    description: 'ふわふわのオムレツ。朝食にぴったり',
    difficulty: 'medium',
    cookTime: 12,
    nutrition: { calories: 280, protein: 18, carbs: 3, fat: 22 }
  },
  {
    id: '6',
    name: 'ミネストローネスープ',
    ingredients: ['トマト', 'キャベツ', 'ニンジン', 'セロリ', 'パスタ', 'ニンニク'],
    description: 'イタリアンスープ。野菜がたっぷり、ボリューミー',
    difficulty: 'medium',
    cookTime: 30,
    nutrition: { calories: 180, protein: 8, carbs: 28, fat: 4 }
  },
  {
    id: '7',
    name: 'ステーキ',
    ingredients: ['牛肉', 'バター', 'ニンニク', '塩', 'コショウ'],
    description: 'シンプルなステーキ。肉本来の味を引き出す',
    difficulty: 'medium',
    cookTime: 20,
    nutrition: { calories: 580, protein: 50, carbs: 0, fat: 42 }
  },
  {
    id: '8',
    name: 'ごはん丼',
    ingredients: ['お米', '玉ねぎ', 'ニンジン', '豚肉', '醤油', 'みりん'],
    description: '手早く作れる。ご飯がすすむおかずです',
    difficulty: 'easy',
    cookTime: 25,
    nutrition: { calories: 450, protein: 22, carbs: 58, fat: 12 }
  },
  {
    id: '9',
    name: 'グリーンスムージー',
    ingredients: ['キャベツ', 'ニンジン', 'バナナ', 'ヨーグルト', 'はちみつ'],
    description: 'グリーンで栄養満点。朝食やスナックに最適',
    difficulty: 'easy',
    cookTime: 5,
    nutrition: { calories: 150, protein: 6, carbs: 28, fat: 2 }
  },
  {
    id: '10',
    name: 'ニンニク炒飯',
    ingredients: ['お米', 'ニンニク', 'バター', '卵', '塩', 'コショウ'],
    description: 'ニンニクの香りが食欲をそそる炒飯',
    difficulty: 'easy',
    cookTime: 15,
    nutrition: { calories: 380, protein: 12, carbs: 52, fat: 14 }
  },
];

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
          <IngredientInput onAddIngredient={handleAddIngredient} />

          {selectedIngredients.length > 0 && (
            <div className="selected-ingredients">
              <h2>選択した食材 ({selectedIngredients.length})</h2>
              <div className="ingredients-list">
                {selectedIngredients.map(ingredient => (
                  <div key={ingredient} className="ingredient-tag">
                    <span>{ingredient}</span>
                    <button
                      className="remove-btn"
                      onClick={() => handleRemoveIngredient(ingredient)}
                      aria-label={`${ingredient}を削除`}
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
              <button className="btn btn-secondary" onClick={handleClear}>
                クリア
              </button>
            </div>
          )}
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
