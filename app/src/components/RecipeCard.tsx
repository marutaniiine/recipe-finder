import { useState } from 'react';
import './RecipeCard.css';
import type { Recipe } from '../data/recipes';

interface RecipeCardProps {
  recipe: Recipe;
}

export default function RecipeCard({ recipe }: RecipeCardProps) {
  const [expanded, setExpanded] = useState(false);

  const getDifficultyLabel = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return '簡単';
      case 'medium':
        return '中級';
      case 'hard':
        return '難しい';
      default:
        return difficulty;
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return '#10b981';
      case 'medium':
        return '#f59e0b';
      case 'hard':
        return '#ef4444';
      default:
        return '#6b7280';
    }
  };

  return (
    <div className="recipe-card">
      <div className="recipe-header">
        <div className="recipe-title-section">
          <h3 className="recipe-name">{recipe.name}</h3>
          <p className="recipe-description">{recipe.description}</p>
        </div>
        <div className="recipe-meta">
          <div className="difficulty-badge" style={{ backgroundColor: getDifficultyColor(recipe.difficulty) }}>
            {getDifficultyLabel(recipe.difficulty)}
          </div>
          <div className="cook-time">
            <span>⏱️ {recipe.cookTime}分</span>
          </div>
        </div>
      </div>

      <div className="recipe-ingredients">
        <h4>材料</h4>
        <div className="ingredients-tags">
          {recipe.ingredients.map(ingredient => (
            <span key={ingredient} className="ingredient-badge">
              {ingredient}
            </span>
          ))}
        </div>
      </div>

      <div className="recipe-nutrition">
        <div className="nutrition-stat">
          <p className="nutrition-label">カロリー</p>
          <p className="nutrition-value">{recipe.nutrition.calories} kcal</p>
        </div>
        <div className="nutrition-stat">
          <p className="nutrition-label">タンパク質</p>
          <p className="nutrition-value">{recipe.nutrition.protein}g</p>
        </div>
        <div className="nutrition-stat">
          <p className="nutrition-label">炭水化物</p>
          <p className="nutrition-value">{recipe.nutrition.carbs}g</p>
        </div>
        <div className="nutrition-stat">
          <p className="nutrition-label">脂質</p>
          <p className="nutrition-value">{recipe.nutrition.fat}g</p>
        </div>
      </div>

      <button
        className="expand-btn"
        onClick={() => setExpanded(!expanded)}
      >
        {expanded ? '詳細を閉じる ▲' : '詳細を表示 ▼'}
      </button>

      {expanded && (
        <div className="recipe-details">
          <div className="details-section">
            <h4>調理方法</h4>
            <ol className="cooking-steps">
              {recipe.steps.map((step, index) => (
                <li key={index} className="cooking-step">
                  <span className="step-number">{index + 1}</span>
                  <span className="step-text">{step}</span>
                </li>
              ))}
            </ol>
          </div>

          <div className="details-section">
            <h4>栄養バランス</h4>
            <div className="nutrition-bars">
              <div className="nutrition-bar">
                <div className="bar-label">タンパク質</div>
                <div className="bar-container">
                  <div
                    className="bar-fill"
                    style={{
                      width: `${Math.min((recipe.nutrition.protein / 100) * 100, 100)}%`,
                      backgroundColor: '#ef4444'
                    }}
                  ></div>
                </div>
              </div>
              <div className="nutrition-bar">
                <div className="bar-label">炭水化物</div>
                <div className="bar-container">
                  <div
                    className="bar-fill"
                    style={{
                      width: `${Math.min((recipe.nutrition.carbs / 100) * 100, 100)}%`,
                      backgroundColor: '#f59e0b'
                    }}
                  ></div>
                </div>
              </div>
              <div className="nutrition-bar">
                <div className="bar-label">脂質</div>
                <div className="bar-container">
                  <div
                    className="bar-fill"
                    style={{
                      width: `${Math.min((recipe.nutrition.fat / 100) * 100, 100)}%`,
                      backgroundColor: '#06b6d4'
                    }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
