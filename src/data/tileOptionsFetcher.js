import yaml from 'js-yaml';

export async function fetchTileOptions() {

  const isDev = import.meta.env.VITE_DEV;
  const filePath = isDev ? '../../public/tileOptions.yaml' : '/tileOptions.yaml';

  if (isDev) {
    console.log(`Development mode: Fetching tile options from ${filePath}`);
  } else {
    console.log(`Production mode: Fetching tile options from ${filePath}`);
  }

  try {
    const response = await fetch(filePath);

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status} - Could not fetch ${filePath}`);
    }

    const yamlText = await response.text();
    const parsedOptions = yaml.load(yamlText);

    if (!parsedOptions || !parsedOptions.options) {
      throw new Error('YAML content is not in the expected format.');
    }

    return parsedOptions.options;
  } catch (error) {
    console.error(`There was a problem with the tileOptions.yaml file:`, error);
    return null;
  }
}