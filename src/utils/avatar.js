const ANIMALS = ['🐻', '🐱', '🐶', '🐰', '🐸', '🐨', '🐼', '🦊', '🐹', '🐮', '🐷', '🐧', '🦁', '🐯', '🦋'];

const PASTEL_COLORS = [
  '#FFB3C1', '#B5EAD7', '#C7CEEA', '#FFDAC1',
  '#FFD1DC', '#B5D8EB', '#E2F0CB', '#F9C4D2',
  '#FFF1BA', '#D4E8FF', '#F0C6FF', '#C6FFE8',
];

export function generateAvatar(userId) {
  const hash = userId.split('').reduce((acc, ch) => acc * 31 + ch.charCodeAt(0), 0);
  const absHash = Math.abs(hash);
  return {
    emoji: ANIMALS[absHash % ANIMALS.length],
    bgColor: PASTEL_COLORS[(absHash * 7) % PASTEL_COLORS.length],
  };
}

export function generateRandomAvatar() {
  return {
    emoji: ANIMALS[Math.floor(Math.random() * ANIMALS.length)],
    bgColor: PASTEL_COLORS[Math.floor(Math.random() * PASTEL_COLORS.length)],
  };
}
