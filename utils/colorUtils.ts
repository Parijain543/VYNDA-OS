// Generate a consistent HSL color from a string ID
export const getMemoryColor = (id: string) => {
  if (!id) return 'hsl(210, 70%, 60%)'; // Fallback color for missing IDs
  
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = id.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  // Constrain hue to a nice palette range (e.g., avoid muddy browns)
  // We want cool, tech, or distinct colors.
  const hue = Math.abs(hash % 360);
  const saturation = 70; // High saturation
  const lightness = 60; // Medium lightness for readability against dark bg
  
  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
};

export const getMemoryColorBg = (id: string, opacity = 0.1) => {
    if (!id) return `hsla(210, 70%, 60%, ${opacity})`;

    let hash = 0;
    for (let i = 0; i < id.length; i++) {
      hash = id.charCodeAt(i) + ((hash << 5) - hash);
    }
    const hue = Math.abs(hash % 360);
    return `hsla(${hue}, 70%, 60%, ${opacity})`;
}