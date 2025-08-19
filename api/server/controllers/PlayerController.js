const fs = require('fs').promises;
const { nanoid } = require('nanoid');
const { logger } = require('@librechat/data-schemas');
const { FileSources } = require('librechat-data-provider');
const {
  getPlayer,
  createPlayer,
  updatePlayer,
  deletePlayer,
  getListPlayers,
} = require('~/models/Player');
const { getStrategyFunctions } = require('~/server/services/Files/strategies');
const { resizeAvatar } = require('~/server/services/Files/images/avatar');
const { refreshS3Url } = require('~/server/services/Files/S3/crud');
const { filterFile } = require('~/server/services/Files/process');
const { deleteFileByFilter } = require('~/models/File');

const createPlayerHandler = async (req, res) => {
  try {
    const { name, age, position, strongFoot, description } = req.body;
    const playerData = {
      id: `player_${nanoid()}`,
      name,
      age,
      position,
      strongFoot,
      description,
      createdBy: req.user.id,
    };

    const player = await createPlayer(playerData);
    res.status(201).json(player);
  } catch (error) {
    logger.error('[/Players] Error creating player', error);
    res.status(500).json({ error: error.message });
  }
};

const getPlayerHandler = async (req, res) => {
  try {
    const player = await getPlayer({ id: req.params.id });
    if (!player) {
      return res.status(404).json({ error: 'Player not found' });
    }

    if (player.avatar?.source === FileSources.s3) {
      const originalUrl = player.avatar.filepath;
      player.avatar.filepath = await refreshS3Url(player.avatar);
      if (originalUrl !== player.avatar.filepath) {
        await updatePlayer({ id: player.id }, { avatar: player.avatar });
      }
    }

    res.status(200).json(player);
  } catch (error) {
    logger.error('[/Players/:id] Error retrieving player', error);
    res.status(500).json({ error: error.message });
  }
};

const updatePlayerHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const player = await updatePlayer({ id }, req.body, { updatingUserId: req.user.id });
    res.status(200).json(player);
  } catch (error) {
    logger.error('[/Players/:id] Error updating player', error);
    res.status(500).json({ error: error.message });
  }
};

const deletePlayerHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const player = await getPlayer({ id });
    if (!player) {
      return res.status(404).json({ error: 'Player not found' });
    }

    await deletePlayer({ id });
    res.status(200).json({ message: 'Player deleted' });
  } catch (error) {
    logger.error('[/Players/:id] Error deleting player', error);
    res.status(500).json({ error: error.message });
  }
};

const getListPlayersHandler = async (req, res) => {
  try {
    const players = await getListPlayers({ createdBy: req.user.id });
    res.status(200).json(players);
  } catch (error) {
    logger.error('[/Players] Error listing players', error);
    res.status(500).json({ error: error.message });
  }
};

const uploadPlayerAvatarHandler = async (req, res) => {
  try {
    filterFile({ req, file: req.file, image: true, isAvatar: true });
    const { player_id } = req.params;
    if (!player_id) {
      return res.status(400).json({ message: 'Player ID is required' });
    }

    const buffer = await fs.readFile(req.file.path);
    const resizedBuffer = await resizeAvatar({ userId: req.user.id, input: buffer });
    const { processAvatar } = getStrategyFunctions(req.app.locals.fileStrategy);
    const avatarUrl = await processAvatar({
      buffer: resizedBuffer,
      userId: req.user.id,
      manual: 'false',
      playerId: player_id,
    });

    const image = {
      filepath: avatarUrl,
      source: req.app.locals.fileStrategy,
    };

    let _avatar;
    try {
      const player = await getPlayer({ id: player_id });
      _avatar = player.avatar;
    } catch (err) {
      logger.error('[/:player_id/avatar] Error fetching player', err);
      _avatar = {};
    }

    if (_avatar?.source) {
      const { deleteFile } = getStrategyFunctions(_avatar.source);
      try {
        await deleteFile(req, { filepath: _avatar.filepath });
        await deleteFileByFilter({ user: req.user.id, filepath: _avatar.filepath });
      } catch (err) {
        logger.error('[/:player_id/avatar] Error deleting old avatar', err);
      }
    }

    const updated = await updatePlayer(
      { id: player_id },
      { avatar: image },
      { updatingUserId: req.user.id },
    );

    res.status(201).json(updated);
  } catch (error) {
    const message = 'An error occurred while updating the Player Avatar';
    logger.error(message, error);
    res.status(500).json({ message });
  } finally {
    try {
      await fs.unlink(req.file.path);
    } catch {
      logger.debug('[/:player_id/avatar] Temp. image file already deleted');
    }
  }
};

module.exports = {
  createPlayer: createPlayerHandler,
  getPlayer: getPlayerHandler,
  updatePlayer: updatePlayerHandler,
  deletePlayer: deletePlayerHandler,
  getListPlayers: getListPlayersHandler,
  uploadPlayerAvatar: uploadPlayerAvatarHandler,
};
