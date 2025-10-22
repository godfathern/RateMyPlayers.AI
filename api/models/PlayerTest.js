require('dotenv').config();
require('module-alias/register'); // <- add this line!
const mongoose = require('mongoose');
const { Player } = require('./Player');// Assuming same folder

const run = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/LibreChat');

    const newPlayer = new Player({
      first_name: 'Harry',
      last_name: 'Phan',
      position: 'RW',
      weak_foot: 4,
      skill_moves: 5,
      preferred_foot: 'Left',
      height: '170 cm',
      weight: '72 kg',
      alt_positions: 'CAM, CF',
      pace: 85,
      acceleration: 87,
      sprint_speed: 83,
      shooting: 92,
      passing: 91,
      dribbling: 95,
      defending: 38,
      physicality: 65,
      traits: [
        { name: 'Playmaker', description: 'Great vision and passing ability.' },
        { name: 'Finesse Shot', description: 'Scores curlers from outside the box.' },
      ],
    });

    await newPlayer.save();
    console.log('✅ Dummy player inserted!');
  } catch (err) {
    console.error('❌ Error inserting dummy player:', err);
  } finally {
    await mongoose.disconnect();
  }
};

run();
