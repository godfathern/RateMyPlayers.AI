import { Document, Types } from 'mongoose';

export interface IPlayer extends Omit<Document, 'model'> {
  first_name: string;
  last_name: string;
  position: string;
  team: string;
  preferred_foot: 'Left' | 'Right';
  weak_foot: number;
  skill_moves: number;
  height: string;
  weight: string;
  alt_positions: string;

  stats: {
    pace: number;
    acceleration: number;
    sprint_speed: number;
    shooting: number;
    passing: number;
    dribbling: number;
    defending: number;
    physicality: number;
  };

  traits: {
    name: string;
    description: string;
  }[];

  photo?: {
    filepath: string;
    source: string;
  };

  created_by?: Types.ObjectId;
}