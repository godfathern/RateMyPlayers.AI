import { Schema } from 'mongoose';
import type { IPlayer } from '~/types';

const playerSchema: Schema<IPlayer> = new Schema(
  {
    first_name: {
      type: String,
      required: true,
    },
    last_name: {
      type: String,
      required: true,
    },
    position: {
      type: String,
      required: true,
    },
    preferred_foot: {
      type: String,
      enum: ['Left', 'Right'],
      required: true,
    },
    weak_foot: {
      type: Number,
      min: 1,
      max: 5,
      required: true,
    },
    skill_moves: {
      type: Number,
      min: 1,
      max: 5,
      required: true,
    },
    height: {
      type: String,
      required: true,
    },
    weight: {
      type: String,
      required: true,
    },
    alt_positions: {
      type: String,
      default: '',
    },
    stats: {
      pace: Number,
      acceleration: Number,
      sprint_speed: Number,
      shooting: Number,
      passing: Number,
      dribbling: Number,
      defending: Number,
      physicality: Number,
    },
    traits: [
      {
        name: String,
        description: String,
      },
    ],
    photo: {
      type: Schema.Types.Mixed, //fking learn from avatar in LibreChat
      default: undefined,
    },
    created_by: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  },
);

export default playerSchema;
