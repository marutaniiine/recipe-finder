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
    name: 'カレーライス',
    ingredients: ['お米', '玉ねぎ', 'ニンジン', 'ジャガイモ', 'カレーペースト', '鶏肉'],
    description: '日本の国民食。甘口から辛口まで好みで調整できる定番メニュー',
    difficulty: 'medium',
    cookTime: 40,
    nutrition: { calories: 520, protein: 18, carbs: 65, fat: 18 }
  },
  {
    id: '2',
    name: 'ビーフカレー',
    ingredients: ['お米', '玉ねぎ', 'ニンジン', 'ジャガイモ', 'カレーペースト', '牛肉'],
    description: '牛肉の旨味がたっぷり。濃厚でコクのあるカレー',
    difficulty: 'medium',
    cookTime: 50,
    nutrition: { calories: 580, protein: 25, carbs: 65, fat: 22 }
  },
  {
    id: '3',
    name: 'シンプルトマトパスタ',
    ingredients: ['トマト', 'パスタ', 'ニンニク', 'オリーブオイル', '塩'],
    description: 'フレッシュなトマトを使ったイタリアンスタイルのパスタ',
    difficulty: 'easy',
    cookTime: 15,
    nutrition: { calories: 320, protein: 12, carbs: 55, fat: 8 }
  },
  {
    id: '4',
    name: 'トマトソーススパゲティ',
    ingredients: ['パスタ', 'トマト', 'ニンニク', 'オリーブオイル', '玉ねぎ', '塩'],
    description: 'コトコト煮詰めたトマトソース。奥深い味わい',
    difficulty: 'medium',
    cookTime: 25,
    nutrition: { calories: 380, protein: 14, carbs: 58, fat: 10 }
  },
  {
    id: '5',
    name: 'ミートソーススパゲティ',
    ingredients: ['パスタ', 'トマト', '豚肉', '玉ねぎ', 'ニンニク', 'オリーブオイル'],
    description: 'ひき肉の旨味がたっぷり。子どもから大人まで大好きな一品',
    difficulty: 'medium',
    cookTime: 30,
    nutrition: { calories: 520, protein: 22, carbs: 60, fat: 18 }
  },
  {
    id: '6',
    name: 'ニンニク炒めキャベツ',
    ingredients: ['キャベツ', 'ニンニク', 'オイル', '塩', 'コショウ'],
    description: 'シンプルだけど美味しい。どんな料理のおかずに最適',
    difficulty: 'easy',
    cookTime: 10,
    nutrition: { calories: 140, protein: 5, carbs: 18, fat: 6 }
  },
  {
    id: '7',
    name: '豚肉とキャベツの炒め',
    ingredients: ['豚肉', 'キャベツ', 'ニンニク', '醤油', 'オイル'],
    description: 'ボリューム満点。ご飯がすすむおかず',
    difficulty: 'easy',
    cookTime: 15,
    nutrition: { calories: 320, protein: 20, carbs: 15, fat: 18 }
  },
  {
    id: '8',
    name: 'オムレツ',
    ingredients: ['卵', 'バター', 'チーズ', 'パセリ', '塩'],
    description: 'ふわふわのオムレツ。朝食にぴったり',
    difficulty: 'medium',
    cookTime: 12,
    nutrition: { calories: 280, protein: 18, carbs: 3, fat: 22 }
  },
  {
    id: '9',
    name: '卵焼き',
    ingredients: ['卵', '砂糖', '塩', '油'],
    description: '甘い卵焼き。毎日のお弁当にぴったり',
    difficulty: 'easy',
    cookTime: 8,
    nutrition: { calories: 200, protein: 12, carbs: 8, fat: 14 }
  },
  {
    id: '10',
    name: 'チキンサラダ',
    ingredients: ['鶏肉', 'レタス', 'トマト', 'キュウリ', 'ドレッシング'],
    description: 'ヘルシーで栄養満点。ジムトレ後の定番',
    difficulty: 'easy',
    cookTime: 20,
    nutrition: { calories: 280, protein: 32, carbs: 15, fat: 10 }
  },
  {
    id: '11',
    name: 'グリーンサラダ',
    ingredients: ['レタス', 'キュウリ', 'トマト', 'ドレッシング', 'オリーブオイル'],
    description: 'シンプルな野菜サラダ。毎日食べたい',
    difficulty: 'easy',
    cookTime: 5,
    nutrition: { calories: 120, protein: 4, carbs: 18, fat: 4 }
  },
  {
    id: '12',
    name: 'ごはん丼',
    ingredients: ['お米', '玉ねぎ', 'ニンジン', '豚肉', '醤油', 'みりん'],
    description: '手早く作れる。ご飯がすすむおかず',
    difficulty: 'easy',
    cookTime: 25,
    nutrition: { calories: 450, protein: 22, carbs: 58, fat: 12 }
  },
  {
    id: '13',
    name: '鶏肉丼',
    ingredients: ['お米', '玉ねぎ', '鶏肉', '醤油', 'みりん', 'ニンニク'],
    description: 'さっぱりした鶏肉の丼。ヘルシー',
    difficulty: 'easy',
    cookTime: 20,
    nutrition: { calories: 380, protein: 28, carbs: 50, fat: 8 }
  },
  {
    id: '14',
    name: 'ミネストローネスープ',
    ingredients: ['トマト', 'キャベツ', 'ニンジン', 'セロリ', 'パスタ', 'ニンニク'],
    description: 'イタリアンスープ。野菜がたっぷり、ボリューミー',
    difficulty: 'medium',
    cookTime: 30,
    nutrition: { calories: 180, protein: 8, carbs: 28, fat: 4 }
  },
  {
    id: '15',
    name: 'コンソメスープ',
    ingredients: ['玉ねぎ', 'ニンジン', 'じゃがいも', 'コンソメ', '水', '塩'],
    description: 'シンプルで懐かしい味わい。朝食の定番',
    difficulty: 'easy',
    cookTime: 20,
    nutrition: { calories: 140, protein: 6, carbs: 20, fat: 3 }
  },
  {
    id: '16',
    name: '味噌汁',
    ingredients: ['豆腐', 'わかめ', '玉ねぎ', '味噌', 'だし汁'],
    description: '日本の心。毎日のご飯に欠かせない',
    difficulty: 'easy',
    cookTime: 10,
    nutrition: { calories: 100, protein: 8, carbs: 8, fat: 3 }
  },
  {
    id: '17',
    name: 'ステーキ',
    ingredients: ['牛肉', 'バター', 'ニンニク', '塩', 'コショウ'],
    description: 'シンプルなステーキ。肉本来の味を引き出す',
    difficulty: 'medium',
    cookTime: 20,
    nutrition: { calories: 580, protein: 50, carbs: 0, fat: 42 }
  },
  {
    id: '18',
    name: '焼き鶏',
    ingredients: ['鶏肉', 'ニンニク', '塩', '油', 'コショウ'],
    description: 'シンプルで美味しい。ご飯のおかずに最適',
    difficulty: 'easy',
    cookTime: 25,
    nutrition: { calories: 280, protein: 38, carbs: 0, fat: 14 }
  },
  {
    id: '19',
    name: '豚しゃぶしゃぶ',
    ingredients: ['豚肉', 'キャベツ', 'ニンジン', 'しらたき', 'ポン酢'],
    description: 'ヘルシーで栄養満点。野菜もたっぷり',
    difficulty: 'medium',
    cookTime: 20,
    nutrition: { calories: 250, protein: 25, carbs: 12, fat: 10 }
  },
  {
    id: '20',
    name: 'ニンニク炒飯',
    ingredients: ['お米', 'ニンニク', 'バター', '卵', '塩', 'コショウ'],
    description: 'ニンニクの香りが食欲をそそる炒飯',
    difficulty: 'easy',
    cookTime: 15,
    nutrition: { calories: 380, protein: 12, carbs: 52, fat: 14 }
  },
  {
    id: '21',
    name: 'エビチャーハン',
    ingredients: ['お米', 'えび', 'ニンニク', '卵', '塩', '醤油'],
    description: 'えびの香りが引き立つ上品な炒飯',
    difficulty: 'medium',
    cookTime: 20,
    nutrition: { calories: 420, protein: 18, carbs: 50, fat: 16 }
  },
  {
    id: '22',
    name: 'グリーンスムージー',
    ingredients: ['キャベツ', 'ニンジン', 'バナナ', 'ヨーグルト', 'はちみつ'],
    description: 'グリーンで栄養満点。朝食やスナックに最適',
    difficulty: 'easy',
    cookTime: 5,
    nutrition: { calories: 150, protein: 6, carbs: 28, fat: 2 }
  },
  {
    id: '23',
    name: 'ハンバーグ',
    ingredients: ['豚肉', '玉ねぎ', 'パン粉', '卵', 'ニンニク', '塩'],
    description: 'ジューシーなハンバーグ。子どもから大人まで大好き',
    difficulty: 'medium',
    cookTime: 30,
    nutrition: { calories: 420, protein: 28, carbs: 15, fat: 26 }
  },
  {
    id: '24',
    name: 'キャベツスープ',
    ingredients: ['キャベツ', '玉ねぎ', 'ニンジン', 'コンソメ', '水', '塩'],
    description: '野菜がたっぷり。体が温まるスープ',
    difficulty: 'easy',
    cookTime: 20,
    nutrition: { calories: 120, protein: 5, carbs: 18, fat: 3 }
  },
  {
    id: '25',
    name: '野菜炒め',
    ingredients: ['キャベツ', 'ニンジン', '玉ねぎ', 'ニンニク', '油', '塩'],
    description: 'シンプルで栄養満点。毎日のおかず',
    difficulty: 'easy',
    cookTime: 12,
    nutrition: { calories: 160, protein: 6, carbs: 20, fat: 7 }
  },
  {
    id: '26',
    name: '唐揚げ',
    ingredients: ['鶏肉', '小麦粉', '醤油', 'ニンニク', '塩', '油'],
    description: 'カリカリジューシー。つまみにも最高',
    difficulty: 'medium',
    cookTime: 25,
    nutrition: { calories: 380, protein: 32, carbs: 12, fat: 22 }
  },
  {
    id: '27',
    name: 'きのこスパゲティ',
    ingredients: ['パスタ', 'きのこ', 'ニンニク', 'オリーブオイル', 'パセリ', '塩'],
    description: 'きのこの香りが引き立つ上品なパスタ',
    difficulty: 'easy',
    cookTime: 18,
    nutrition: { calories: 320, protein: 12, carbs: 55, fat: 8 }
  },
  {
    id: '28',
    name: 'ベーコンほうれん草パスタ',
    ingredients: ['パスタ', 'ベーコン', 'ほうれん草', 'ニンニク', 'オリーブオイル', '塩'],
    description: 'ベーコンの香りがたまらない。栄養も満点',
    difficulty: 'easy',
    cookTime: 18,
    nutrition: { calories: 420, protein: 18, carbs: 55, fat: 14 }
  },
  {
    id: '29',
    name: 'マーボー豆腐',
    ingredients: ['豆腐', '豚肉', '豆板醤', '塩', 'ニンニク', '片栗粉'],
    description: 'ピリ辛で旨い。ご飯がすすむ中華料理',
    difficulty: 'medium',
    cookTime: 20,
    nutrition: { calories: 280, protein: 20, carbs: 12, fat: 16 }
  },
  {
    id: '30',
    name: '野菜天丼',
    ingredients: ['お米', 'ナス', 'ニンジン', '玉ねぎ', '小麦粉', '油'],
    description: '揚げたての野菜天。サクサク食感が最高',
    difficulty: 'medium',
    cookTime: 30,
    nutrition: { calories: 480, protein: 12, carbs: 62, fat: 20 }
  },
  {
    id: '31',
    name: '海老フライ',
    ingredients: ['えび', 'パン粉', '小麦粉', '卵', '油', '塩'],
    description: 'プリプリのえび。タルタルソースをたっぷり',
    difficulty: 'medium',
    cookTime: 25,
    nutrition: { calories: 320, protein: 18, carbs: 20, fat: 16 }
  },
  {
    id: '32',
    name: '肉うどん',
    ingredients: ['うどん', '牛肉', '玉ねぎ', 'だし汁', '醤油', 'みりん'],
    description: 'ボリューム満点。冬に食べたい一品',
    difficulty: 'easy',
    cookTime: 20,
    nutrition: { calories: 480, protein: 20, carbs: 68, fat: 12 }
  },
  {
    id: '33',
    name: 'とりそば',
    ingredients: ['そば', '鶏肉', 'ネギ', 'だし汁', '醤油', 'みりん'],
    description: 'さっぱりとした鶏の味わい。夏にぴったり',
    difficulty: 'easy',
    cookTime: 18,
    nutrition: { calories: 380, protein: 22, carbs: 55, fat: 8 }
  },
  {
    id: '34',
    name: 'エビマヨ',
    ingredients: ['えび', 'マヨネーズ', '玉ねぎ', 'ニンニク', '塩', '油'],
    description: 'えびのプリプリ感とマヨの濃厚さが最高',
    difficulty: 'medium',
    cookTime: 20,
    nutrition: { calories: 340, protein: 16, carbs: 15, fat: 24 }
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
