export const getAvatarIcon = (icon: string | null) => {
  const avatarsIcons = {
    "person": "👤",
    "wizard": "🧙",
    "crown": "👑",
    "knight": "⚔️",
    "shield": "🛡️",
    "bow": "🏹",
    "sword": "🗡️",
    "crystal": "🔮",
    "lion": "🦁",
    "lightning": "⚡",
    "star": "🌟",
    "dragon": "🐉"
  };

  return avatarsIcons[icon as keyof typeof avatarsIcons] || "👤";
}