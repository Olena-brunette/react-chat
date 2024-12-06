const COLORS = [
  '#FF5733',
  '#33FF57',
  '#3357FF',
  '#F3FF33',
  '#33FFF3',
  '#FF33A1',
  '#A133FF',
  '#FFA533',
  '#33FFA5',
  '#5733FF',
  '#FF5733',
  '#57FF33',
  '#3357FF',
  '#F333FF',
  '#3FFF33',
  '#FF333F',
  '#33FFF3',
  '#A1FF33',
  '#33A1FF',
  '#FF33A1',
  '#33FF57',
  '#5733FF',
  '#FF3357',
  '#33FFA1',
  '#FF33F3',
];

export const formatTimestamp = (timestamp: number) => {
  return new Date(timestamp).toLocaleString('en-US', {
    month: 'numeric',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
  });
};

export const getColor = (index: number) => {
  return COLORS[index % COLORS.length];
};


export const findById = (array: any[], id: string) => {
  return array.find((item) => item.id === id);
}