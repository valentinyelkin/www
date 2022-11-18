export const onePercent = (value): number => {
  return value + value / 100;
};

export const getBonusesPercent = (balance): number => {
  return balance / 101;
};

export const getTenPercent = (dailyBonus): number => {
  return (dailyBonus / 100) * 100;
};
