export const PlayerToken = ({ player, size }) => {
  const ping = player.isPlaying ? "animate-ping" : "";
  return (
    <span className="relative flex">
      <span
        className={`absolute inline-flex ${ping} opacity-85`}
        style={{
          backgroundColor: player.color,
          width: size,
          height: size,
          borderRadius: "50%",
        }}
      ></span>
      <span
        className="opacity-80"
        style={{
          backgroundColor: player.color,
          width: size,
          height: size,
          borderRadius: "50%",
        }}
      ></span>
    </span>
  );
};
