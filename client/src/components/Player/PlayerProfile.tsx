import React from 'react';

export type Player = {
  first_name: string;
  last_name: string;
  position: string;
  weak_foot: number;
  skill_moves: number;
  preferred_foot: string;
  height: string;
  weight: string;
  alt_positions: string;
  pace: number;
  acceleration: number;
  sprint_speed: number;
  shooting: number;
  passing: number;
  dribbling: number;
  defending: number;
  physicality: number;
  traits: { name: string; description: string }[];
  photoUrl?: string; // 👈 new: optional player picture
};

const renderStars = (count: number) => {
  return [...Array(5)].map((_, i) => (
    <span key={i} className={`text-yellow-500 ${i + 1 > count ? 'opacity-30' : ''}`}>★</span>
  ));
};

const StatBar = ({ label, value }: { label: string; value: number }) => (
  <div className="mb-2">
    <div className="flex justify-between text-sm">
      <span>{label}</span>
      <span>{value}</span>
    </div>
    <div className="w-full h-2 bg-gray-200 rounded">
      <div
        className="h-2 bg-blue-500 rounded"
        style={{ width: `${value}%` }}
      />
    </div>
  </div>
);

const PlayerProfile = ({ player }: { player: Player }) => {
  return (
    <div className="w-full max-w-25xl mx-auto p-4 bg-white rounded-xl shadow-md">
      <h2 className="text-xl font-bold mb-4">
        {player.first_name} {player.last_name} — EA SPORTS FC™ 25 Ratings
      </h2>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Left column: Photo */}
        <div className="flex justify-center">
          <img
            src={player.photoUrl || '/assets/91.png'}
            alt={`${player.first_name} ${player.last_name}`}
            className="rounded-lg shadow-none border-none w-60 h-80 object-cover"
          />
        </div>

        {/* Middle column: Info */}
        <div>
          <div className="mb-4 text-lg font-semibold">Position: {player.position}</div>
          <div className="mb-2">Weak Foot: {renderStars(player.weak_foot)}</div>
          <div className="mb-2">Skill Moves: {renderStars(player.skill_moves)}</div>
          <div className="mb-1">Preferred Foot: {player.preferred_foot}</div>
          <div className="mb-1">Height: {player.height}</div>
          <div className="mb-1">Weight: {player.weight}</div>
          <div className="mb-1">Alt Positions: {player.alt_positions}</div>

          {/* Traits */}
          <div className="mt-4">
            <h3 className="font-semibold mb-2">Traits</h3>
            <div className="space-y-2">
              {player.traits.map((trait, index) => (
                <div
                  key={index}
                  className="p-2 border rounded bg-gray-50"
                >
                  <h4 className="font-medium text-sm">{trait.name}</h4>
                  <p className="text-xs text-gray-700">{trait.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right column: Stats */}
        <div>
          <StatBar label="Pace" value={player.pace} />
          <StatBar label="Acceleration" value={player.acceleration} />
          <StatBar label="Sprint Speed" value={player.sprint_speed} />
          <StatBar label="Shooting" value={player.shooting} />
          <StatBar label="Passing" value={player.passing} />
          <StatBar label="Dribbling" value={player.dribbling} />
          <StatBar label="Defending" value={player.defending} />
          <StatBar label="Physicality" value={player.physicality} />
        </div>
      </div>
    </div>
  );
};

export default PlayerProfile;
