import { useState } from 'react';
import './IngredientInput.css';

interface IngredientInputProps {
  onAddIngredient: (ingredient: string) => void;
  selectedIngredients: string[];
  onRemoveIngredient: (ingredient: string) => void;
  onClear: () => void;
}

interface IngredientCategory {
  name: string;
  emoji: string;
  items: string[];
}

const INGREDIENT_CATEGORIES: IngredientCategory[] = [
  {
    name: '野菜',
    emoji: '🥬',
    items: ['トマト', '玉ねぎ', 'ニンジン', 'ジャガイモ', 'キャベツ', 'レタス', 'キュウリ',
            'ナス', 'パプリカ', 'ほうれん草', 'ブロッコリー', 'カリフラワー', 'インゲン',
            'トウモロコシ', 'セロリ', 'アスパラガス', 'もやし', 'しらたき', 'わかめ']
  },
  {
    name: '肉・魚',
    emoji: '🍗',
    items: ['鶏肉', '豚肉', '牛肉', 'ベーコン', 'えび', 'イカ', '豆腐']
  },
  {
    name: '調味料・油',
    emoji: '🧂',
    items: ['ニンニク', '塩', 'コショウ', 'オリーブオイル', 'バター', '醤油', 'みりん',
            '味噌', '豆板醤', 'ポン酢', 'だし汁', 'コンソメ', 'カレーペースト', '油',
            'サラダ油', 'ごま油', 'ハチミツ', 'ケチャップ', 'マスタード', 'タバスコ']
  },
  {
    name: '穀物・麺',
    emoji: '🍚',
    items: ['お米', 'パスタ', 'うどん', 'そば', '小麦粉', 'パン粉', 'マヨネーズ']
  },
  {
    name: '乳製品・卵',
    emoji: '🥛',
    items: ['卵', 'チーズ', 'ヨーグルト', 'バター', 'ミルク', 'アイスクリーム']
  },
  {
    name: 'その他',
    emoji: '🌟',
    items: ['ハチミツ', 'バナナ', 'きのこ', 'ドレッシング', 'パセリ', '片栗粉',
            'タルタルソース', 'チリソース', '豆', 'トウモロコシ缶']
  }
];

const POPULAR_INGREDIENTS = INGREDIENT_CATEGORIES.flatMap(cat => cat.items);

export default function IngredientInput({
  onAddIngredient,
  selectedIngredients,
  onRemoveIngredient,
  onClear,
}: IngredientInputProps) {
  const [inputValue, setInputValue] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);

  const handleInputChange = (value: string) => {
    setInputValue(value);

    if (value.trim().length === 0) {
      setSuggestions([]);
      return;
    }

    const filtered = POPULAR_INGREDIENTS.filter(ingredient =>
      ingredient.toLowerCase().includes(value.toLowerCase())
    ).slice(0, 5);

    setSuggestions(filtered);
  };

  const handleAddIngredient = (ingredient: string = inputValue) => {
    if (ingredient.trim()) {
      onAddIngredient(ingredient.trim());
      setInputValue('');
      setSuggestions([]);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleAddIngredient();
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    handleAddIngredient(suggestion);
  };

  return (
    <>
      {selectedIngredients.length > 0 && (
        <div className="selected-ingredients">
          <h2>選択した食材 ({selectedIngredients.length})</h2>
          <div className="ingredients-list">
            {selectedIngredients.map(ingredient => (
              <div key={ingredient} className="ingredient-tag">
                <span>{ingredient}</span>
                <button
                  className="remove-btn"
                  onClick={() => onRemoveIngredient(ingredient)}
                  aria-label={`${ingredient}を削除`}
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
          <button className="btn btn-secondary" onClick={onClear}>
            クリア
          </button>
        </div>
      )}

      <div className="ingredient-input">
      <h2>食材を追加</h2>
      <div className="input-wrapper">
        <input
          type="text"
          className="ingredient-field"
          placeholder="食材の名前を入力... (例: トマト, 鶏肉など)"
          value={inputValue}
          onChange={(e) => handleInputChange(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button
          className="btn btn-primary"
          onClick={() => handleAddIngredient()}
          disabled={!inputValue.trim()}
        >
          追加
        </button>
      </div>

      {suggestions.length > 0 && (
        <div className="suggestions">
          <p className="suggestions-label">候補:</p>
          <div className="suggestions-list">
            {suggestions.map(suggestion => (
              <button
                key={suggestion}
                className="suggestion-item"
                onClick={() => handleSuggestionClick(suggestion)}
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="common-ingredients">
        <p className="common-label">よくある食材:</p>
        <div className="ingredient-categories">
          {INGREDIENT_CATEGORIES.map(category => (
            <div key={category.name} className="ingredient-category-group">
              <h3 className="category-title">{category.emoji} {category.name}</h3>
              <div className="quick-add-buttons">
                {category.items.map(ingredient => (
                  <button
                    key={ingredient}
                    className="quick-add-btn"
                    onClick={() => handleAddIngredient(ingredient)}
                  >
                    {ingredient}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      </div>
    </>
  );
}
