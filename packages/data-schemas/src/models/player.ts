import playerSchema from '~/schema/agent';
import type { IPlayer } from '~/types';

/**
 * Creates or returns the Player model using the provided mongoose instance and schema
 */
export function createAgentModel(mongoose: typeof import('mongoose')) {
  return mongoose.models.Agent || mongoose.model<IPlayer>('Agent', playerSchema);
}

