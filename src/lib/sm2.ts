import { Card } from "../types";

export function calculateNextReview(card: Card, rating: number): Card {
  let { interval, easeFactor, repetitions } = card;

  // Default interval to 1 if it's 0 (new card)
  if (interval === 0) interval = 1;

  if (rating === 0) {
    // Again (0): Reset to 1 day interval
    interval = 1;
    repetitions = 0;
  } else if (rating === 1) {
    // Hard (1): Multiply interval by 1.2
    interval = Math.max(1, Math.round(interval * 1.2));
    repetitions += 1;
  } else if (rating === 2) {
    // Good (2): Multiply interval by ease factor (2.5 default)
    interval = Math.max(1, Math.round(interval * easeFactor));
    repetitions += 1;
  } else if (rating === 3) {
    // Easy (3): Multiply interval by ease factor × 1.3, increase ease by 0.15
    interval = Math.max(1, Math.round(interval * easeFactor * 1.3));
    easeFactor = easeFactor + 0.15;
    repetitions += 1;
  }

  const nextReviewDate = new Date();
  nextReviewDate.setDate(nextReviewDate.getDate() + interval);

  return {
    ...card,
    interval,
    easeFactor,
    repetitions,
    nextReview: nextReviewDate.toISOString(),
  };
}
