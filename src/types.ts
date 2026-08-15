/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface MemoryItem {
  id: string;
  title: string;
  description: string;
  date?: string;
  emoji?: string;
  image?: string; // Optional custom image URL
}

export interface LoveCardConfig {
  recipientName: string;
  senderName: string;
  birthdayDate: string; // ISO String or YYYY-MM-DD
  letterTitle: string;
  letterBody: string;
  musicType: 'classical' | 'synth' | 'silent' | 'custom' | 'youtube';
  classicalTrack: string; // URL or name
  reasons: string[];
  memories: MemoryItem[];
}
