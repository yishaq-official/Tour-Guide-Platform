import fs from 'fs';
import path from 'path';

const images = {
  'meskel.jpg': 'https://upload.wikimedia.org/wikipedia/commons/9/9b/Meskel_Celebration.jpg',
  'fichee.jpg': 'https://upload.wikimedia.org/wikipedia/commons/f/f0/Fichchee-_The_New_Year_of_Sidama-_The_Sidama_people_celebrate_the_festival_en_mass_in_their_sacred_place_called_Gudumale_which_is_located_on_the_beautiful_city_of_Hawassa-_2013-12-18_17-37.jpg',
  'gada.jpg': 'https://upload.wikimedia.org/wikipedia/commons/8/86/Oromo_Cultural_dressing.jpg',
  'timket.jpg': 'https://upload.wikimedia.org/wikipedia/commons/d/de/Gondar_Fasiladas_Bath_Timket.jpg',
  'shuwalid.jpg': 'https://upload.wikimedia.org/wikipedia/commons/4/4a/City_Gate%2C_Harar_Jugol_%2814464345823%29.jpg',
  'xeer.jpg': 'https://upload.wikimedia.org/wikipedia/commons/4/4e/Dire_dawa%2C_edificio_circolare.jpg',
  'gifaataa.jpg': 'https://upload.wikimedia.org/wikipedia/commons/5/5d/Wolayta_Sodo_Tona_Roundabout.jpg'
};

async function downloadImages() {
  const dir = path.join(process.cwd(), '../client/public/images/cultures');
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  for (const [filename, url] of Object.entries(images)) {
    try {
      console.log(`Downloading ${filename} from ${url}...`);
      const response = await fetch(url, {
        headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36' }
      });
      if (response.ok) {
        const buffer = await response.arrayBuffer();
        fs.writeFileSync(path.join(dir, filename), Buffer.from(buffer));
        console.log(`Successfully saved ${filename}`);
      } else {
        console.log(`Failed to download ${filename}: ${response.status} ${response.statusText}`);
      }
    } catch (err) {
      console.error(`Error downloading ${filename}:`, err.message);
    }
  }
}

downloadImages();
