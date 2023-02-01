import type { Timestamp } from 'firebase-admin/firestore';

/**
 * timestamp変換前
 * IDもない
 */
export interface QAOnFirestore {
  question: string;
  answer: string | null;
  date: Timestamp;
}
export interface QA {
  id: string;
  question: string;
  answer: string | null;
  date: Date;
}
