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
  steps: string[];
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
    steps: [
      '鶏肉をサイコロ状に切り、塩こしょうで味付けする',
      '玉ねぎ、ニンジン、ジャガイモをそれぞれ食べやすい大きさに切る',
      '鍋に油を熱し、野菜と鶏肉を炒める',
      '水を加えて煮込み、野菜が柔らかくなったらカレーペーストを入れる',
      'お米を別に炊いて、カレーをかけて完成'
    ],
    nutrition: { calories: 520, protein: 18, carbs: 65, fat: 18 }
  },
  {
    id: '2',
    name: 'ビーフカレー',
    ingredients: ['お米', '玉ねぎ', 'ニンジン', 'ジャガイモ', 'カレーペースト', '牛肉'],
    description: '牛肉の旨味がたっぷり。濃厚でコクのあるカレー',
    difficulty: 'medium',
    cookTime: 50,
    steps: [
      '牛肉を食べやすいサイズに切る',
      '玉ねぎ、ニンジン、ジャガイモを準備する',
      '鍋に油を熱し、牛肉を焼いて色を変える',
      '野菜を加えて炒め、水を注ぐ',
      '沸騰後はカレーペーストを入れて、とろっとするまで煮込む'
    ],
    nutrition: { calories: 580, protein: 25, carbs: 65, fat: 22 }
  },
  {
    id: '3',
    name: 'シンプルトマトパスタ',
    ingredients: ['トマト', 'パスタ', 'ニンニク', 'オリーブオイル', '塩'],
    description: 'フレッシュなトマトを使ったイタリアンスタイルのパスタ',
    difficulty: 'easy',
    cookTime: 15,
    steps: [
      '塩沸騰したお湯でパスタを表示時間通り茹でる',
      'ニンニクをみじん切りにして、オリーブオイルで香りを出す',
      'トマトをダイス状に切り、ニンニクオイルに加える',
      '茹でたパスタをフライパンに入れ、トマトと絡める',
      '塩で味を調整して完成'
    ],
    nutrition: { calories: 320, protein: 12, carbs: 55, fat: 8 }
  },
  {
    id: '4',
    name: 'トマトソーススパゲティ',
    ingredients: ['パスタ', 'トマト', 'ニンニク', 'オリーブオイル', '玉ねぎ', '塩'],
    description: 'コトコト煮詰めたトマトソース。奥深い味わい',
    difficulty: 'medium',
    cookTime: 25,
    steps: [
      'ニンニクと玉ねぎをみじん切りにして、オリーブオイルで炒める',
      'トマトをみじん切りにして、玉ねぎが透き通ったら加える',
      '弱火で15分ほど煮詰めて、ソースの味を深める',
      '塩沸騰したお湯でパスタを表示時間通り茹でる',
      '茹でたパスタをソースと合わせ、塩で味を整えて完成'
    ],
    nutrition: { calories: 380, protein: 14, carbs: 58, fat: 10 }
  },
  {
    id: '5',
    name: 'ミートソーススパゲティ',
    ingredients: ['パスタ', 'トマト', '豚肉', '玉ねぎ', 'ニンニク', 'オリーブオイル'],
    description: 'ひき肉の旨味がたっぷり。子どもから大人まで大好きな一品',
    difficulty: 'medium',
    cookTime: 30,
    steps: [
      'ニンニクと玉ねぎをみじん切りにして、オリーブオイルで炒める',
      '豚肉を加えて色が変わるまで炒める',
      'トマトをみじん切りにして加え、弱火で20分ほど煮詰める',
      '塩沸騰したお湯でパスタを表示時間通り茹でる',
      '茹でたパスタにミートソースをかけて完成'
    ],
    nutrition: { calories: 520, protein: 22, carbs: 60, fat: 18 }
  },
  {
    id: '6',
    name: 'ニンニク炒めキャベツ',
    ingredients: ['キャベツ', 'ニンニク', 'オイル', '塩', 'コショウ'],
    description: 'シンプルだけど美味しい。どんな料理のおかずに最適',
    difficulty: 'easy',
    cookTime: 10,
    steps: [
      'ニンニクをみじん切りにして、オイルで弱火から中火で炒める',
      'キャベツを食べやすい大きさに切る',
      'ニンニクの香りが出たらキャベツを加えて、強火で炒める',
      'キャベツがしんなりしたら、塩とコショウで味を整えて完成'
    ],
    nutrition: { calories: 140, protein: 5, carbs: 18, fat: 6 }
  },
  {
    id: '7',
    name: '豚肉とキャベツの炒め',
    ingredients: ['豚肉', 'キャベツ', 'ニンニク', '醤油', 'オイル'],
    description: 'ボリューム満点。ご飯がすすむおかず',
    difficulty: 'easy',
    cookTime: 15,
    steps: [
      '豚肉をサイコロ状に切り、ニンニクをみじん切りにする',
      'キャベツを食べやすい大きさに切る',
      'フライパンに油を熱し、豚肉とニンニクを炒める',
      '豚肉に火が通ったら、キャベツを加えて強火で炒める',
      '醤油を回しかけて味を調え、完成'
    ],
    nutrition: { calories: 320, protein: 20, carbs: 15, fat: 18 }
  },
  {
    id: '8',
    name: 'オムレツ',
    ingredients: ['卵', 'バター', 'チーズ', 'パセリ', '塩'],
    description: 'ふわふわのオムレツ。朝食にぴったり',
    difficulty: 'medium',
    cookTime: 12,
    steps: [
      '卵を3個ボウルに割り入れ、塩を加えてよく混ぜる',
      'フライパンにバターを熱し、卵液を流し入れる',
      '半熟のうちに片方を手前に寄せ、チーズを乗せる',
      '卵を二つ折りにして皿に移す',
      'パセリをふりかけて完成'
    ],
    nutrition: { calories: 280, protein: 18, carbs: 3, fat: 22 }
  },
  {
    id: '9',
    name: '卵焼き',
    ingredients: ['卵', '砂糖', '塩', '油'],
    description: '甘い卵焼き。毎日のお弁当にぴったり',
    difficulty: 'easy',
    cookTime: 8,
    steps: [
      '卵を3個ボウルに割り入れ、砂糖と塩少々を加える',
      'よく混ぜて、ふるいで漉す',
      '卵焼きパンに油を敷き、弱火で加熱する',
      '卵液の1/3を流し入れ、半熟のうちに手前から奥へ折る',
      'この動作を3回繰り返して、完成'
    ],
    nutrition: { calories: 200, protein: 12, carbs: 8, fat: 14 }
  },
  {
    id: '10',
    name: 'チキンサラダ',
    ingredients: ['鶏肉', 'レタス', 'トマト', 'キュウリ', 'ドレッシング'],
    description: 'ヘルシーで栄養満点。ジムトレ後の定番',
    difficulty: 'easy',
    cookTime: 20,
    steps: [
      '鶏肉を塩沸騰したお湯で15分加熱し、火を通す',
      '加熱後、冷ましてから食べやすいサイズに裂く',
      'レタスを洗い、手でちぎって盛り付ける',
      'トマトとキュウリを薄切りにして加える',
      '鶏肉をのせて、ドレッシングをかけて完成'
    ],
    nutrition: { calories: 280, protein: 32, carbs: 15, fat: 10 }
  },
  {
    id: '11',
    name: 'グリーンサラダ',
    ingredients: ['レタス', 'キュウリ', 'トマト', 'ドレッシング', 'オリーブオイル'],
    description: 'シンプルな野菜サラダ。毎日食べたい',
    difficulty: 'easy',
    cookTime: 5,
    steps: [
      'レタスを洗い、水気を取ってから手でちぎる',
      'キュウリをスライスし、塩でさっと和える',
      'トマトを食べやすいサイズに切る',
      '野菜をボウルに入れてさっと混ぜる',
      'ドレッシングとオリーブオイルをかけて完成'
    ],
    nutrition: { calories: 120, protein: 4, carbs: 18, fat: 4 }
  },
  {
    id: '12',
    name: 'ごはん丼',
    ingredients: ['お米', '玉ねぎ', 'ニンジン', '豚肉', '醤油', 'みりん'],
    description: '手早く作れる。ご飯がすすむおかず',
    difficulty: 'easy',
    cookTime: 25,
    steps: [
      '豚肉をスライスし、玉ねぎとニンジンを薄く切る',
      'フライパンに油を敷き、豚肉を炒める',
      '豚肉の色が変わったら玉ねぎとニンジンを加える',
      '醤油とみりんを加えて、15分ほど煮詰める',
      'ご飯にのせて完成'
    ],
    nutrition: { calories: 450, protein: 22, carbs: 58, fat: 12 }
  },
  {
    id: '13',
    name: '鶏肉丼',
    ingredients: ['お米', '玉ねぎ', '鶏肉', '醤油', 'みりん', 'ニンニク'],
    description: 'さっぱりした鶏肉の丼。ヘルシー',
    difficulty: 'easy',
    cookTime: 20,
    steps: [
      '鶏肉をサイコロ状に切り、玉ねぎをスライスする',
      'ニンニクをみじん切りにして、フライパンで香りを出す',
      '鶏肉を加えて炒め、色が変わるまで加熱',
      '玉ねぎを加えて、醤油とみりんで味付けする',
      'ご飯にのせて完成'
    ],
    nutrition: { calories: 380, protein: 28, carbs: 50, fat: 8 }
  },
  {
    id: '14',
    name: 'ミネストローネスープ',
    ingredients: ['トマト', 'キャベツ', 'ニンジン', 'セロリ', 'パスタ', 'ニンニク'],
    description: 'イタリアンスープ。野菜がたっぷり、ボリューミー',
    difficulty: 'medium',
    cookTime: 30,
    steps: [
      'ニンニク、ニンジン、セロリをみじん切りにする',
      'キャベツをざく切りにしてトマトをダイス状に切る',
      'オリーブオイルで香味野菜を炒め、野菜を加える',
      '水を注いで煮込む。野菜が柔らかくなったらパスタを加える',
      'パスタが茹で上がったら、塩で味を調えて完成'
    ],
    nutrition: { calories: 180, protein: 8, carbs: 28, fat: 4 }
  },
  {
    id: '15',
    name: 'コンソメスープ',
    ingredients: ['玉ねぎ', 'ニンジン', 'じゃがいも', 'コンソメ', '水', '塩'],
    description: 'シンプルで懐かしい味わい。朝食の定番',
    difficulty: 'easy',
    cookTime: 20,
    steps: [
      '玉ねぎをくし切りに、ニンジンはいちょう切りにする',
      'じゃがいもを乱切りにして、水に浸す',
      '鍋に水を沸かし、玉ねぎとニンジンを加える',
      'じゃがいもを加えて15分煮込む',
      'コンソメと塩で味を整えて完成'
    ],
    nutrition: { calories: 140, protein: 6, carbs: 20, fat: 3 }
  },
  {
    id: '16',
    name: '味噌汁',
    ingredients: ['豆腐', 'わかめ', '玉ねぎ', '味噌', 'だし汁'],
    description: '日本の心。毎日のご飯に欠かせない',
    difficulty: 'easy',
    cookTime: 10,
    steps: [
      'だし汁を鍋に入れて火にかける',
      '玉ねぎを薄切りにして、沸騰したら加える',
      '豆腐を食べやすいサイズに切り、加える',
      'わかめを戻して加え、一煮立ちさせる',
      '火を止めて、味噌を溶き入れて完成'
    ],
    nutrition: { calories: 100, protein: 8, carbs: 8, fat: 3 }
  },
  {
    id: '17',
    name: 'ステーキ',
    ingredients: ['牛肉', 'バター', 'ニンニク', '塩', 'コショウ'],
    description: 'シンプルなステーキ。肉本来の味を引き出す',
    difficulty: 'medium',
    cookTime: 20,
    steps: [
      '牛肉を冷蔵庫から出して、常温に戻す',
      '塩とコショウをふり、15分置く',
      'フライパンを強火で熱し、牛肉を入れて両面焼く',
      'バターとニンニクを加えて香りを出す',
      'アルミホイルで包んで3分休ませて完成'
    ],
    nutrition: { calories: 580, protein: 50, carbs: 0, fat: 42 }
  },
  {
    id: '18',
    name: '焼き鶏',
    ingredients: ['鶏肉', 'ニンニク', '塩', '油', 'コショウ'],
    description: 'シンプルで美味しい。ご飯のおかずに最適',
    difficulty: 'easy',
    cookTime: 25,
    steps: [
      '鶏肉に塩とコショウをふり、15分置く',
      'ニンニクをみじん切りにする',
      'フライパンに油を敷き、鶏肉の皮目から焼く',
      '片面が焼けたら裏返し、ニンニクを加える',
      '完全に火が通ったら完成'
    ],
    nutrition: { calories: 280, protein: 38, carbs: 0, fat: 14 }
  },
  {
    id: '19',
    name: '豚しゃぶしゃぶ',
    ingredients: ['豚肉', 'キャベツ', 'ニンジン', 'しらたき', 'ポン酢'],
    description: 'ヘルシーで栄養満点。野菜もたっぷり',
    difficulty: 'medium',
    cookTime: 20,
    steps: [
      'キャベツをざく切りにし、ニンジンを千切りにする',
      'しらたきを適度な長さに切り、一度下茹でする',
      '鍋に昆布を敷いて水を加え、沸騰させる',
      '豚肉を1枚ずつ入れてしゃぶしゃぶしながら加熱',
      '野菜としらたきを加えて、ポン酢で食べる'
    ],
    nutrition: { calories: 250, protein: 25, carbs: 12, fat: 10 }
  },
  {
    id: '20',
    name: 'ニンニク炒飯',
    ingredients: ['お米', 'ニンニク', 'バター', '卵', '塩', 'コショウ'],
    description: 'ニンニクの香りが食欲をそそる炒飯',
    difficulty: 'easy',
    cookTime: 15,
    steps: [
      'ニンニクをみじん切りにして、卵を軽く混ぜておく',
      'フライパンにバターを敷き、ニンニクを炒める',
      '冷やご飯を加えてほぐしながら炒める',
      'ご飯がパラパラになったら、卵を加える',
      '塩とコショウで味を調えて完成'
    ],
    nutrition: { calories: 380, protein: 12, carbs: 52, fat: 14 }
  },
  {
    id: '21',
    name: 'エビチャーハン',
    ingredients: ['お米', 'えび', 'ニンニク', '卵', '塩', '醤油'],
    description: 'えびの香りが引き立つ上品な炒飯',
    difficulty: 'medium',
    cookTime: 20,
    steps: [
      'えびを塩水で洗い、背わたを取り除いて水気を切る',
      'ニンニクをみじん切りにして、卵を軽く混ぜておく',
      'フライパンに油を敷き、えびを炒める',
      'えびの色が変わったら、ニンニクと冷やご飯を加える',
      'ご飯がパラパラになったら卵を加え、塩と醤油で味を調えて完成'
    ],
    nutrition: { calories: 420, protein: 18, carbs: 50, fat: 16 }
  },
  {
    id: '22',
    name: 'グリーンスムージー',
    ingredients: ['キャベツ', 'ニンジン', 'バナナ', 'ヨーグルト', 'はちみつ'],
    description: 'グリーンで栄養満点。朝食やスナックに最適',
    difficulty: 'easy',
    cookTime: 5,
    steps: [
      'キャベツを食べやすい大きさにちぎる',
      'ニンジンを皮ごと粗く切り、バナナを輪切りにする',
      'ミキサーにキャベツ、ニンジン、バナナを入れる',
      'ヨーグルトを加えて、はちみつで甘みを調える',
      'なめらかになるまでミキサーで混ぜて完成'
    ],
    nutrition: { calories: 150, protein: 6, carbs: 28, fat: 2 }
  },
  {
    id: '23',
    name: 'ハンバーグ',
    ingredients: ['豚肉', '玉ねぎ', 'パン粉', '卵', 'ニンニク', '塩'],
    description: 'ジューシーなハンバーグ。子どもから大人まで大好き',
    difficulty: 'medium',
    cookTime: 30,
    steps: [
      '玉ねぎとニンニクをみじん切りにして、フライパンで炒める',
      '豚肉をボウルに入れ、炒めた玉ねぎ、パン粉、卵、塩を加えてこねる',
      'こねた肉を2等分してハンバーグ型に成形する',
      'フライパンに油を敷き、ハンバーグを焼く',
      '両面が焼けたら、蓋をして弱火で10分蒸し焼きにして完成'
    ],
    nutrition: { calories: 420, protein: 28, carbs: 15, fat: 26 }
  },
  {
    id: '24',
    name: 'キャベツスープ',
    ingredients: ['キャベツ', '玉ねぎ', 'ニンジン', 'コンソメ', '水', '塩'],
    description: '野菜がたっぷり。体が温まるスープ',
    difficulty: 'easy',
    cookTime: 20,
    steps: [
      'キャベツをざく切りに、玉ねぎをくし切りに、ニンジンをいちょう切りにする',
      '鍋に水を注ぎ、沸騰させる',
      'キャベツ、玉ねぎ、ニンジンを加える',
      '野菜が柔らかくなるまで15分煮込む',
      'コンソメと塩で味を調えて完成'
    ],
    nutrition: { calories: 120, protein: 5, carbs: 18, fat: 3 }
  },
  {
    id: '25',
    name: '野菜炒め',
    ingredients: ['キャベツ', 'ニンジン', '玉ねぎ', 'ニンニク', '油', '塩'],
    description: 'シンプルで栄養満点。毎日のおかず',
    difficulty: 'easy',
    cookTime: 12,
    steps: [
      'キャベツをざく切りに、玉ねぎをくし切りに、ニンジンを千切りにする',
      'ニンニクをみじん切りにする',
      'フライパンに油を敷き、ニンニクを炒める',
      'ニンジンと玉ねぎを加えて炒める',
      'キャベツを加えて強火で炒め、塩で味を調えて完成'
    ],
    nutrition: { calories: 160, protein: 6, carbs: 20, fat: 7 }
  },
  {
    id: '26',
    name: '唐揚げ',
    ingredients: ['鶏肉', '小麦粉', '醤油', 'ニンニク', '塩', '油'],
    description: 'カリカリジューシー。つまみにも最高',
    difficulty: 'medium',
    cookTime: 25,
    steps: [
      '鶏肉をサイコロ状に切り、醤油とニンニクで漬ける',
      '30分以上冷蔵庫で漬け込む',
      '鶏肉に小麦粉をコーティングする',
      '揚げ油を180℃に熱し、鶏肉を揚げる',
      '皮がカリカリになるまで揚げて、完成'
    ],
    nutrition: { calories: 380, protein: 32, carbs: 12, fat: 22 }
  },
  {
    id: '27',
    name: 'きのこスパゲティ',
    ingredients: ['パスタ', 'きのこ', 'ニンニク', 'オリーブオイル', 'パセリ', '塩'],
    description: 'きのこの香りが引き立つ上品なパスタ',
    difficulty: 'easy',
    cookTime: 18,
    steps: [
      '塩沸騰したお湯でパスタを表示時間通り茹でる',
      'きのこを薄切りにして、ニンニクをみじん切りにする',
      'オリーブオイルでニンニクを炒め、香りを出す',
      'きのこを加えてしんなりするまで炒める',
      '茹でたパスタを加えて絡め、塩で味を調え、パセリをふって完成'
    ],
    nutrition: { calories: 320, protein: 12, carbs: 55, fat: 8 }
  },
  {
    id: '28',
    name: 'ベーコンほうれん草パスタ',
    ingredients: ['パスタ', 'ベーコン', 'ほうれん草', 'ニンニク', 'オリーブオイル', '塩'],
    description: 'ベーコンの香りがたまらない。栄養も満点',
    difficulty: 'easy',
    cookTime: 18,
    steps: [
      '塩沸騰したお湯でパスタを表示時間通り茹でる',
      'ベーコンを食べやすい幅に切り、ニンニクをみじん切りにする',
      'ほうれん草を塩茹でして、食べやすい長さに切る',
      'オリーブオイルでニンニクを炒め、ベーコンを加える',
      'ベーコンがカリカリになったら、ほうれん草と茹でたパスタを加えて絡め、塩で味を調えて完成'
    ],
    nutrition: { calories: 420, protein: 18, carbs: 55, fat: 14 }
  },
  {
    id: '29',
    name: 'マーボー豆腐',
    ingredients: ['豆腐', '豚肉', '豆板醤', '塩', 'ニンニク', '片栗粉'],
    description: 'ピリ辛で旨い。ご飯がすすむ中華料理',
    difficulty: 'medium',
    cookTime: 20,
    steps: [
      '豆腐を食べやすいサイズに切り、ニンニクをみじん切りにする',
      'フライパンに油を敷き、豚肉を炒める',
      '豆板醤とニンニクを加えて、香りを出す',
      '豆腐とスープを加えて、15分煮込む',
      '水溶き片栗粉でとろみをつけ、塩で味を調えて完成'
    ],
    nutrition: { calories: 280, protein: 20, carbs: 12, fat: 16 }
  },
  {
    id: '30',
    name: '野菜天丼',
    ingredients: ['お米', 'ナス', 'ニンジン', '玉ねぎ', '小麦粉', '油'],
    description: '揚げたての野菜天。サクサク食感が最高',
    difficulty: 'medium',
    cookTime: 30,
    steps: [
      'ナス、ニンジン、玉ねぎを食べやすい大きさに切る',
      '小麦粉を水で溶いて、天ぷら粉を作る',
      '揚げ油を180℃に熱する',
      '野菜に天ぷら粉をコーティングして、カラッと揚げる',
      'ご飯に天つゆをかけ、揚げた野菜をのせて完成'
    ],
    nutrition: { calories: 480, protein: 12, carbs: 62, fat: 20 }
  },
  {
    id: '31',
    name: '海老フライ',
    ingredients: ['えび', 'パン粉', '小麦粉', '卵', '油', '塩'],
    description: 'プリプリのえび。タルタルソースをたっぷり',
    difficulty: 'medium',
    cookTime: 25,
    steps: [
      'えびを塩水で洗い、背わたを取り除いて腹を開く',
      '小麦粉を軽くふり、溶いた卵にくぐらせ、パン粉をまぶす',
      '揚げ油を170℃に熱する',
      'えびが縮まないよう、背側を下にして揚げる',
      'パン粉がキツネ色になったら油から上げて、完成'
    ],
    nutrition: { calories: 320, protein: 18, carbs: 20, fat: 16 }
  },
  {
    id: '32',
    name: '肉うどん',
    ingredients: ['うどん', '牛肉', '玉ねぎ', 'だし汁', '醤油', 'みりん'],
    description: 'ボリューム満点。冬に食べたい一品',
    difficulty: 'easy',
    cookTime: 20,
    steps: [
      '牛肉を薄くスライスし、玉ねぎを薄く切る',
      '鍋にだし汁を入れて、沸騰させる',
      '牛肉と玉ねぎを加えて、アクを取る',
      '醤油とみりんで味を調え、10分煮込む',
      'うどんを別に加熱して、丼に盛り、スープをかけて完成'
    ],
    nutrition: { calories: 480, protein: 20, carbs: 68, fat: 12 }
  },
  {
    id: '33',
    name: 'とりそば',
    ingredients: ['そば', '鶏肉', 'ネギ', 'だし汁', '醤油', 'みりん'],
    description: 'さっぱりとした鶏の味わい。夏にぴったり',
    difficulty: 'easy',
    cookTime: 18,
    steps: [
      '鶏肉をスライスし、ネギを斜め切りにする',
      'だし汁を鍋に入れ、沸騰させる',
      '鶏肉とネギを加え、醤油とみりんで味を調える',
      'そばを別に塩茹でし、冷水で締める',
      '丼にそばを盛り、スープを注いで完成'
    ],
    nutrition: { calories: 380, protein: 22, carbs: 55, fat: 8 }
  },
  {
    id: '34',
    name: 'エビマヨ',
    ingredients: ['えび', 'マヨネーズ', '玉ねぎ', 'ニンニク', '塩', '油'],
    description: 'えびのプリプリ感とマヨの濃厚さが最高',
    difficulty: 'medium',
    cookTime: 20,
    steps: [
      'えびを塩水で洗い、背わたを取り除く',
      'ニンニクをみじん切りに、玉ねぎをみじん切りにする',
      'えびに塩こしょうをふり、片栗粉をまぶす',
      'フライパンに油を敷き、えびを炒める',
      'えびの色が変わったら、マヨネーズとニンニク、玉ねぎを混ぜたタレを絡めて完成'
    ],
    nutrition: { calories: 340, protein: 16, carbs: 15, fat: 24 }
  },
  {
    id: '35',
    name: 'パプリカとブロッコリーのペペロンチーノ',
    ingredients: ['パスタ', 'パプリカ', 'ブロッコリー', 'ニンニク', 'オリーブオイル', '塩'],
    description: '彩り鮮やか。野菜たっぷりのヘルシーパスタ',
    difficulty: 'easy',
    cookTime: 18,
    steps: [
      'パスタを塩沸騰したお湯で茹でる',
      'パプリカを細切りに、ブロッコリーを小房に分ける',
      'ニンニクをみじん切りにし、オリーブオイルで炒める',
      'パプリカとブロッコリーを加えて炒める',
      '茹でたパスタを絡め、塩で味を調えて完成'
    ],
    nutrition: { calories: 350, protein: 14, carbs: 55, fat: 9 }
  },
  {
    id: '36',
    name: 'イカとアスパラのバター炒め',
    ingredients: ['イカ', 'アスパラガス', 'バター', 'ニンニク', '醤油', '塩'],
    description: 'イカの食感とアスパラの歯ごたえが絶妙',
    difficulty: 'easy',
    cookTime: 12,
    steps: [
      'イカを輪切りにし、アスパラガスを斜め切りにする',
      'ニンニクをみじん切りにする',
      'フライパンにバターを溶かし、ニンニクを炒める',
      'イカとアスパラガスを加えて強火で手早く炒める',
      '醤油をひと回しかけ、塩で味を調えて完成'
    ],
    nutrition: { calories: 200, protein: 22, carbs: 8, fat: 10 }
  },
  {
    id: '37',
    name: 'もやしとインゲンのごま油炒め',
    ingredients: ['もやし', 'インゲン', 'ごま油', 'ニンニク', '醤油', '塩'],
    description: 'シャキシャキ食感。あと一品に最適な副菜',
    difficulty: 'easy',
    cookTime: 8,
    steps: [
      'インゲンのヘタを取り、3cm長さに切る',
      'もやしを洗って水気を切る',
      'フライパンにごま油を熱し、ニンニクを炒める',
      'インゲンを先に炒め、次にもやしを加えて強火で炒める',
      '醤油と塩で味を調えて完成'
    ],
    nutrition: { calories: 100, protein: 5, carbs: 10, fat: 5 }
  },
  {
    id: '38',
    name: 'カリフラワーのチーズグラタン',
    ingredients: ['カリフラワー', 'チーズ', 'バター', 'ミルク', '小麦粉', '塩'],
    description: 'ホクホクのカリフラワーにチーズがとろり',
    difficulty: 'medium',
    cookTime: 30,
    steps: [
      'カリフラワーを小房に分け、塩茹でする',
      'バターで小麦粉を炒め、ミルクを少しずつ加えてホワイトソースを作る',
      '耐熱皿にカリフラワーを並べ、ホワイトソースをかける',
      'チーズをたっぷりのせる',
      'オーブン200℃で15分、チーズに焼き色がつくまで焼いて完成'
    ],
    nutrition: { calories: 320, protein: 18, carbs: 20, fat: 20 }
  },
  {
    id: '39',
    name: 'トウモロコシとベーコンのバターライス',
    ingredients: ['お米', 'トウモロコシ', 'ベーコン', 'バター', 'コンソメ', '塩'],
    description: '甘いトウモロコシとベーコンの組み合わせが最高',
    difficulty: 'easy',
    cookTime: 20,
    steps: [
      'トウモロコシの粒を包丁でそぎ落とす',
      'ベーコンを1cm幅に切る',
      'フライパンにバターを溶かし、ベーコンを炒める',
      'トウモロコシとご飯を加え、コンソメで味付けする',
      '全体を混ぜ合わせ、塩で味を調えて完成'
    ],
    nutrition: { calories: 420, protein: 14, carbs: 60, fat: 15 }
  },
  {
    id: '40',
    name: 'エビチリ',
    ingredients: ['えび', 'ケチャップ', '豆板醤', 'ニンニク', '片栗粉', 'ごま油'],
    description: 'ピリ辛チリソースが食欲をそそる中華の定番',
    difficulty: 'medium',
    cookTime: 20,
    steps: [
      'えびの背わたを取り、片栗粉をまぶす',
      'ニンニクをみじん切りにする',
      'フライパンにごま油を熱し、ニンニクと豆板醤を炒める',
      'えびを加えて色が変わるまで炒める',
      'ケチャップと水を加え、とろみがつくまで煮詰めて完成'
    ],
    nutrition: { calories: 250, protein: 20, carbs: 18, fat: 10 }
  },
  {
    id: '41',
    name: 'チキン南蛮',
    ingredients: ['鶏肉', '卵', '小麦粉', 'タルタルソース', '醤油', '油'],
    description: '甘酢ダレとタルタルが絡んだ宮崎名物',
    difficulty: 'medium',
    cookTime: 30,
    steps: [
      '鶏肉をそぎ切りにし、塩こしょうで下味をつける',
      '小麦粉をまぶし、溶き卵にくぐらせる',
      '170℃の油でカラッと揚げる',
      '醤油・酢・砂糖を混ぜた甘酢ダレに揚げた鶏肉を絡める',
      '皿に盛り、タルタルソースをたっぷりかけて完成'
    ],
    nutrition: { calories: 520, protein: 30, carbs: 25, fat: 32 }
  },
  {
    id: '42',
    name: 'イカのトマト煮込み',
    ingredients: ['イカ', 'トマト', '玉ねぎ', 'ニンニク', 'オリーブオイル', '塩'],
    description: 'イタリア風の柔らかイカのトマト煮',
    difficulty: 'medium',
    cookTime: 35,
    steps: [
      'イカを輪切りとゲソに分けて下処理する',
      '玉ねぎとニンニクをみじん切りにする',
      'オリーブオイルでニンニクと玉ねぎを炒める',
      'トマトを潰しながら加え、イカを入れる',
      '弱火で20分ほど煮込み、塩で味を調えて完成'
    ],
    nutrition: { calories: 220, protein: 24, carbs: 12, fat: 8 }
  },
  {
    id: '43',
    name: 'ナポリタン',
    ingredients: ['パスタ', '玉ねぎ', 'パプリカ', 'ベーコン', 'ケチャップ', 'バター'],
    description: '懐かしい喫茶店の味。ケチャップたっぷり',
    difficulty: 'easy',
    cookTime: 20,
    steps: [
      'パスタを塩沸騰したお湯で表示時間より1分長く茹でる',
      '玉ねぎを薄切り、パプリカを細切り、ベーコンを1cm幅に切る',
      'フライパンにバターを溶かし、ベーコンと野菜を炒める',
      '茹でたパスタを加え、ケチャップをたっぷり絡める',
      '強火で炒めてケチャップの酸味を飛ばして完成'
    ],
    nutrition: { calories: 480, protein: 16, carbs: 65, fat: 16 }
  },
  {
    id: '44',
    name: 'エビとブロッコリーのサラダ',
    ingredients: ['えび', 'ブロッコリー', 'マヨネーズ', 'マスタード', '塩', 'コショウ'],
    description: 'デリ風の本格サラダ。おもてなしにも',
    difficulty: 'easy',
    cookTime: 15,
    steps: [
      'えびを塩茹でして殻をむく',
      'ブロッコリーを小房に分けて塩茹でする',
      'マヨネーズとマスタードを混ぜてドレッシングを作る',
      'えびとブロッコリーをボウルに入れる',
      'ドレッシングで和え、塩こしょうで味を調えて完成'
    ],
    nutrition: { calories: 220, protein: 20, carbs: 8, fat: 12 }
  },
  {
    id: '45',
    name: '豆とトウモロコシのスパイスサラダ',
    ingredients: ['豆', 'トウモロコシ缶', 'トマト', '玉ねぎ', 'オリーブオイル', '塩'],
    description: 'メキシカン風。食物繊維たっぷりの栄養サラダ',
    difficulty: 'easy',
    cookTime: 10,
    steps: [
      '豆を水洗いして水気を切る',
      'トウモロコシ缶の水気を切る',
      'トマトと玉ねぎを小さくダイス状に切る',
      'すべてをボウルに入れ、オリーブオイルと塩で和える',
      'よく混ぜ合わせて冷蔵庫で30分冷やして完成'
    ],
    nutrition: { calories: 200, protein: 10, carbs: 30, fat: 6 }
  },
  {
    id: '46',
    name: 'サラダ油で作るシンプルチャーハン',
    ingredients: ['お米', '卵', 'ネギ', 'サラダ油', '醤油', '塩'],
    description: 'サラダ油でパラパラに。基本のチャーハン',
    difficulty: 'easy',
    cookTime: 10,
    steps: [
      '卵を溶き、ネギを小口切りにする',
      'フライパンにサラダ油を多めに熱する',
      '溶き卵を入れて半熟のうちにご飯を加える',
      '強火でご飯をほぐしながら炒め、パラパラにする',
      'ネギ・醤油・塩を加えて味を調えて完成'
    ],
    nutrition: { calories: 400, protein: 12, carbs: 55, fat: 15 }
  },
  {
    id: '47',
    name: 'エビとチリソースの炒め物',
    ingredients: ['えび', 'チリソース', 'パプリカ', 'ニンニク', 'ごま油', '塩'],
    description: 'ピリ辛で鮮やかな彩り。おつまみにもご飯にも',
    difficulty: 'medium',
    cookTime: 15,
    steps: [
      'えびの背わたを取り、パプリカを乱切りにする',
      'ニンニクをみじん切りにする',
      'フライパンにごま油を熱し、ニンニクを炒める',
      'えびとパプリカを加え、強火で炒める',
      'チリソースと塩を加えて全体に絡めて完成'
    ],
    nutrition: { calories: 200, protein: 18, carbs: 12, fat: 8 }
  },
  {
    id: '48',
    name: 'アスパラベーコン巻き',
    ingredients: ['アスパラガス', 'ベーコン', 'コショウ', 'サラダ油', '塩', 'マスタード'],
    description: '定番のおかず。お弁当にもおつまみにも',
    difficulty: 'easy',
    cookTime: 12,
    steps: [
      'アスパラガスの根元を折り、下半分の皮をむく',
      'ベーコンをアスパラガスに巻きつけ、楊枝で留める',
      'フライパンにサラダ油を熱し、巻き終わりを下にして焼く',
      '転がしながら全面に焼き色をつける',
      '塩こしょうで味を調え、マスタードを添えて完成'
    ],
    nutrition: { calories: 180, protein: 10, carbs: 5, fat: 14 }
  },
  {
    id: '49',
    name: 'タバスコ風味のピリ辛パスタ',
    ingredients: ['パスタ', 'ベーコン', 'トマト', 'タバスコ', 'ニンニク', 'オリーブオイル'],
    description: '辛いもの好きにはたまらない刺激的なパスタ',
    difficulty: 'easy',
    cookTime: 18,
    steps: [
      'パスタを塩沸騰したお湯で茹でる',
      'ベーコンを細切りに、トマトをダイス状に切る',
      'オリーブオイルでニンニクを炒め、ベーコンを加える',
      'トマトを加えて軽く炒め、タバスコを好みの量入れる',
      '茹でたパスタを絡めて完成'
    ],
    nutrition: { calories: 420, protein: 16, carbs: 58, fat: 14 }
  },
  {
    id: '50',
    name: 'アイスクリームバナナパフェ',
    ingredients: ['アイスクリーム', 'バナナ', 'ヨーグルト', 'ハチミツ'],
    description: '簡単デザート。おやつにぴったり',
    difficulty: 'easy',
    cookTime: 5,
    steps: [
      'バナナを輪切りにする',
      'グラスにヨーグルトを入れる',
      'バナナを並べ、アイスクリームをのせる',
      'ハチミツをかける',
      'お好みでナッツやフルーツをトッピングして完成'
    ],
    nutrition: { calories: 300, protein: 8, carbs: 45, fat: 12 }
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
