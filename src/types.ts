export type Difficulty = "easy" | "medium" | "hard";

export interface Card {
  id: string;
  front: string;
  back: string;
  difficulty: Difficulty;
  nextReview: string; // ISO date
  easeFactor: number;
  interval: number; // in days
  repetitions: number;
}

export interface Deck {
  id: string;
  title: string;
  created: string; // ISO date
  cards: Card[];
}

export interface FlashcardDecks {
  decks: Deck[];
}

export type View = "dashboard" | "generate" | "review" | "settings";
