const mongoose = require('mongoose');
const { Player } = require('~/db/models');

/**
 * Create a new player
 * @param {Object} playerData
 * @returns {Promise<Player>}
 */
const createPlayer = async (playerData) => {
  return (await Player.create(playerData)).toObject();
};

/**
 * Get a player by ID
 * @param {string} playerId
 * @returns {Promise<Player|null>}
 */
const getPlayerById = async (playerId) => {
  return Player.findById(playerId).lean();
};

/**
 * Get players by filter
 * @param {Object} filter
 * @returns {Promise<Player[]>}
 */
const getPlayers = async (filter = {}) => {
  return Player.find(filter).lean();
};

/**
 * Update player by ID
 * @param {string} playerId
 * @param {Object} updateData
 * @returns {Promise<Player|null>}
 */
const updatePlayer = async (playerId, updateData) => {
  return Player.findByIdAndUpdate(playerId, updateData, { new: true }).lean();
};

/**
 * Delete a player by ID
 * @param {string} playerId
 * @returns {Promise<Player|null>}
 */
const deletePlayer = async (playerId) => {
  return Player.findByIdAndDelete(playerId).lean();
};

module.exports = {
  createPlayer,
  getPlayerById,
  getPlayers,
  updatePlayer,
  deletePlayer,
};
