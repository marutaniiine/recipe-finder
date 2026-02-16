import { useState } from 'react';
import './IngredientInput.css';

interface IngredientInputProps {
  onAddIngredient: (ingredient: string) => void;
}

const POPULAR_INGREDIENTS = [
  'トマト', 'タマネギ', 'ニンニク', 'パスタ', 'お米',
  '鶏肉', '豚肉', '牛肉', '卵', 'バター',
  'レタス', 'キャベツ', 'ニンジン', 'キュウリ', 'ジャガイモ',
  'セロリ', 'バナナ', 'ヨーグルト', 'チーズ', 'オイル',
];

export default function IngredientInput({ onAddIngredient }: IngredientInputProps) {
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
        <div className="quick-add-buttons">
          {POPULAR_INGREDIENTS.slice(0, 8).map(ingredient => (
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
    </div>
  );
}
