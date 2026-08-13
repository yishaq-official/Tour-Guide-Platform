import fs from 'fs';
import path from 'path';

const images = {
  'meskel.jpg': 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Meskel_Festival_in_Addis_Ababa_%2821617478330%29.jpg/800px-Meskel_Festival_in_Addis_Ababa_%2821617478330%29.jpg',
  'fichee.jpg': 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/Sidama_people.jpg/800px-Sidama_people.jpg',
  'gada.jpg': 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/77/Oromo_people_at_Irreechaa_festival.jpg/800px-Oromo_people_at_Irreechaa_festival.jpg',
  'timket.jpg': 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9b/Timkat_Festival_in_Gondar_%2821617478330%29.jpg/800px-Timkat_Festival_in_Gondar_%2821617478330%29.jpg',
  'shuwalid.jpg': 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Harar_street.jpg/800px-Harar_street.jpg',
  'xeer.jpg': 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/Dire_Dawa_market.jpg/800px-Dire_Dawa_market.jpg',
  'gifaataa.jpg': 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Sodo_town.jpg/800px-Sodo_town.jpg'
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
