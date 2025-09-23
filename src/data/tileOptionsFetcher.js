import yaml from 'js-yaml';

export async function fetchTileOptions() {
  try {
    const response = await fetch('../../public/tileOptions.yaml');
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