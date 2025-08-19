const express = require('express');
const playerController = require('~/server/controllers/PlayerController');


const router = express.Router();

router.get('/', playerController.getListPlayers); // GET all
router.get('/:id', playerController.getPlayer); // GET one
router.post('/', playerController.createPlayer); // CREATE
router.patch('/:id', playerController.updatePlayer); // UPDATE
router.delete('/:id', playerController.deletePlayer); // DELETE
//router.post('/:player_id/avatar', upload.single('file'), playerController.uploadPlayerAvatar); // AVATAR upload

module.exports = router;
