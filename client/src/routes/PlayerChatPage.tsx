import React from 'react';
import PlayerProfile from '../components/Player/PlayerProfile';
import ChatForm from '../components/Chat/Input/ChatForm';


const PlayerChatPage = () => {
  const player = {
    first_name: 'Lionel',
    last_name: 'Messi',
    position: 'RW',
    weak_foot: 4,
    skill_moves: 5,
    preferred_foot: 'Left',
    height: "170 cm",
    weight: "72 kg",
    alt_positions: "CAM, CF",
    pace: 85,
    acceleration: 87,
    sprint_speed: 83,
    shooting: 92,
    passing: 91,
    dribbling: 95,
    defending: 38,
    physicality: 65,
    traits: [
      { name: "Playmaker", description: "Great vision and passing ability." },
      { name: "Finesse Shot", description: "Scores curlers from outside the box." },
    ]
  };

  return (
    <div className="flex flex-col min-h-screen">
      <div className="p-4 bg-gray-100">
        <PlayerProfile player={player} />
      </div>
      {/* <div className="flex-grow p-4 bg-white border-t">
        <ChatForm />
      </div> */}
    </div>
  );
};

export default PlayerChatPage;

