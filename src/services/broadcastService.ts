/**
 * PALASH AI - Real-Time Classroom Broadcast Service
 * Enables live teacher-student room synchronization via unique 6-digit room codes,
 * BroadcastChannel, and local storage events.
 */

export interface BroadcastSentence {
  id: string;
  roomCode: string;
  senderRole: 'teacher' | 'student';
  senderName: string;
  textHindi: string;
  textSantaliOlChiki: string;
  textMundari?: string;
  textHo?: string;
  transliterationDevanagari: string;
  timestamp: number;
}

export type BroadcastListener = (sentence: BroadcastSentence) => void;

class BroadcastService {
  private channel: BroadcastChannel | null = null;
  private listeners: Set<BroadcastListener> = new Set();
  private currentRoomCode: string = '';

  constructor() {
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      try {
        this.channel = new BroadcastChannel('palash_classroom_broadcast_channel');
        this.channel.onmessage = (event) => {
          if (event.data && event.data.type === 'CLASSROOM_SENTENCE') {
            const sentence: BroadcastSentence = event.data.sentence;
            if (sentence.roomCode === this.currentRoomCode) {
              this.notifyListeners(sentence);
            }
          }
        };
      } catch (e) {
        console.warn('BroadcastChannel initialization error:', e);
      }
    }

    // Storage fallback for environments without BroadcastChannel
    if (typeof window !== 'undefined') {
      window.addEventListener('storage', (e) => {
        if (e.key === 'palash_latest_broadcast_sentence' && e.newValue) {
          try {
            const sentence: BroadcastSentence = JSON.parse(e.newValue);
            if (sentence.roomCode === this.currentRoomCode) {
              this.notifyListeners(sentence);
            }
          } catch {}
        }
      });
    }
  }

  /**
   * Generates a 6-digit room code for the teacher's classroom
   */
  public generateRoomCode(): string {
    const existing = localStorage.getItem('palash_active_room_code');
    if (existing && existing.length === 6) {
      this.currentRoomCode = existing;
      return existing;
    }
    const newCode = Math.floor(100000 + Math.random() * 900000).toString();
    this.currentRoomCode = newCode;
    localStorage.setItem('palash_active_room_code', newCode);
    return newCode;
  }

  public getActiveRoomCode(): string {
    return this.currentRoomCode || localStorage.getItem('palash_active_room_code') || '742918';
  }

  public joinRoom(roomCode: string): boolean {
    const code = roomCode.trim();
    if (code.length === 6) {
      this.currentRoomCode = code;
      localStorage.setItem('palash_student_room_code', code);
      return true;
    }
    return false;
  }

  public subscribe(listener: BroadcastListener): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notifyListeners(sentence: BroadcastSentence) {
    this.listeners.forEach((listener) => {
      try {
        listener(sentence);
      } catch (e) {
        console.error('Error in broadcast listener:', e);
      }
    });
  }

  public broadcastSentence(sentence: Omit<BroadcastSentence, 'id' | 'timestamp'>): BroadcastSentence {
    const fullSentence: BroadcastSentence = {
      ...sentence,
      id: `bc-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      timestamp: Date.now(),
    };

    // Save to room history
    this.saveToHistory(fullSentence);

    // Send through BroadcastChannel
    if (this.channel) {
      this.channel.postMessage({
        type: 'CLASSROOM_SENTENCE',
        sentence: fullSentence,
      });
    }

    // Send through localStorage event
    try {
      localStorage.setItem('palash_latest_broadcast_sentence', JSON.stringify(fullSentence));
    } catch {}

    // Notify local listeners
    this.notifyListeners(fullSentence);

    return fullSentence;
  }

  private saveToHistory(sentence: BroadcastSentence) {
    try {
      const key = `palash_room_history_${sentence.roomCode}`;
      const existing = JSON.parse(localStorage.getItem(key) || '[]');
      const updated = [sentence, ...existing.slice(0, 49)];
      localStorage.setItem(key, JSON.stringify(updated));
    } catch {}
  }

  public getRoomHistory(roomCode: string): BroadcastSentence[] {
    try {
      const key = `palash_room_history_${roomCode}`;
      return JSON.parse(localStorage.getItem(key) || '[]');
    } catch {
      return [];
    }
  }
}

export const broadcastService = new BroadcastService();
