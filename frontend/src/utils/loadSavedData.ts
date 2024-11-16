export async function loadSavedData() {
  try {
    const response = await fetch('/api/saveData');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error loading saved data:', error);
    return [];
  }
} 