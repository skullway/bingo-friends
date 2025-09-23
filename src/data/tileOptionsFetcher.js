import yaml from 'js-yaml';

export async function fetchTileOptions() {
    
  if (import.meta.env.DEV) {
    console.log("Development mode: Fetching tile options from local file.");
    const filePath = '../../public/tileOptions.yaml';
  } else {
    console.log("Production mode: Fetching tile options from server.");
    const filePath = '/tileOptions.yaml';
  }

  try {
    const response = await fetch(filePath);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const optionsArray = await response.text();
    return yaml.load(optionsArray).options;
  } catch (error) {
      console.error("There's a problem with tileOptions.yaml file", error);
      return null;
  }
}