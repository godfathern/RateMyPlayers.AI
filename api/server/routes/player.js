const express = require('express');
const { logger } = require('@librechat/data-schemas');
const { PermissionTypes, Permissions } = require('librechat-data-provider');
const {
  createPlayer,
  getPlayers,
  getPlayerById,
  deletePlayer,
  renamePlayer,
} = require('~/models/Player');
const { requireJwtAuth } = require('~/server/middleware');
const { generateCheckAccess } = require('@librechat/api');
const { getRoleByName } = require('~/models/Role');

const router = express.Router();

const checkPlayerAccess = generateCheckAccess({
  permissionType: PermissionTypes.PLAYERS,
  permissions: [Permissions.USE],
  getRoleByName,
});

router.use(requireJwtAuth);
router.use(checkPlayerAccess);

/**
 * GET /
 * Retrieves all players for the authenticated user.
 */
router.get('/', async (req, res) => {
  try {
    const players = await getPlayers(req.user.id);
    if (players) {
      res.status(200).json(players);
    } else {
      res.status(404).end();
    }
  } catch (error) {
    logger.error('Error getting players:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * GET /:playerId
 * Retrieves a specific player by ID for the authenticated user.
 */
router.get('/:playerId', async (req, res) => {
  const { playerId } = req.params;
  if (!playerId) {
    return res.status(400).json({ error: 'playerId is required' });
  }

  try {
    const player = await getPlayerById(req.user.id, playerId);
    if (player) {
      res.status(200).json(player);
    } else {
      res.status(404).json({ error: 'Player not found' });
    }
  } catch (error) {
    logger.error('Error getting player by ID:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * POST /
 * Creates a new player for the authenticated user.
 */
router.post('/', async (req, res) => {
  try {
    const player = await createPlayer(req.user.id, req.body);
    res.status(200).json(player);
  } catch (error) {
    logger.error('Error creating player:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * DELETE /
 * Deletes a player for the authenticated user.
 */
router.delete('/', async (req, res) => {
  const { playerId } = req.body;
  if (!playerId) {
    return res.status(400).json({ error: 'no player provided' });
  }

  try {
    const dbResponse = await deletePlayer(req.user.id, playerId);
    res.status(201).json(dbResponse);
  } catch (error) {
    logger.error('Error deleting player', error);
    res.status(500).send('Error deleting player');
  }
});

/**
 * POST /rename
 * Rename a player for the authenticated user.
 */
router.post('/rename', async (req, res) => {
  const { playerId, newPlayerName } = req.body;
  if (!playerId) {
    return res.status(400).json({ error: 'no player found' });
  }
  if (!newPlayerName) {
    return res.status(400).json({ error: 'Name invalid' });
  }

  try {
    const dbResponse = await renamePlayer(req.user.id, playerId, newPlayerName);
    res.status(201).json(dbResponse);
  } catch (error) {
    logger.error('Error renaming player', error);
    res.status(500).send('Error renaming player');
  }
});



module.exports = router;
