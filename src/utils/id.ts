let counter = 0;

export function generateUniqueId(): string {
  counter += 1;
  return `entity_${Date.now()}_${counter}`;
}
