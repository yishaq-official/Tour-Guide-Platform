const fs = require('fs');

const markdown = fs.readFileSync('src/knowledge.md', 'utf-8');

const heritages = [];
const sections = markdown.split('\n# ').filter(s => s.trim().length > 0);

sections.forEach((section, index) => {
  const lines = section.split('\n');
  const name = (index === 0 ? lines[0].replace(/^# /, '') : lines[0]).trim();
  
  let currentHeader = '';
  let quickFacts = {};
  let history = '';
  let highlights = [];
  let travelerExperience = [];
  
  let currentHighlight = null;

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (line.startsWith('### ')) {
      currentHeader = line.replace('### ', '').trim();
      continue;
    }
    
    if (currentHeader === 'Quick Facts') {
      if (line.startsWith('| **')) {
        const parts = line.split('|').filter(p => p.trim() !== '');
        if (parts.length >= 2) {
          const key = parts[0].replace(/\*\*/g, '').trim();
          let value = parts[1].trim();
          // merge next lines if they are breaks
          let j = i + 1;
          while (j < lines.length && (lines[j].trim().startsWith('<br>') || lines[j].trim() === '')) {
             if (lines[j].trim().startsWith('<br>')) {
                 value += '\n' + lines[j].replace(/<br>/g, '').trim();
             }
             j++;
          }
          quickFacts[key] = value;
        }
      }
    } else if (currentHeader === 'History & Significance') {
      if (line !== '' && !line.startsWith('---') && !line.startsWith('#')) {
        history += line + '\n\n';
      }
    } else if (currentHeader.startsWith('Key Tourist Highlights') || currentHeader.startsWith('Key Tourist')) {
      if (line.startsWith('#### ')) {
        if (currentHighlight) highlights.push(currentHighlight);
        currentHighlight = { title: line.replace(/#### \d+\.\s*/, '').trim(), description: '' };
      } else if (line.startsWith('* ') && currentHighlight) {
        currentHighlight.description += line.replace('* ', '') + ' ';
      }
    } else if (currentHeader === 'What Travelers Experience') {
      if (line.startsWith('* ')) {
        travelerExperience.push(line.replace('* ', '').replace(/\*\*/g, ''));
      }
    }
  }
  
  if (currentHighlight) highlights.push(currentHighlight);

  // Region mapping
  let region = "Unknown";
  const loc = quickFacts['Location'] || '';
  if (loc.includes('Amhara')) region = 'Amhara';
  else if (loc.includes('Tigray')) region = 'Tigray';
  else if (loc.includes('Harari')) region = 'Harari';
  else if (loc.includes('Afar')) region = 'Afar';
  else if (loc.includes('South') || loc.includes('Southern')) region = 'South Ethiopia';
  else if (loc.includes('Central')) region = 'Central Ethiopia';
  else if (loc.includes('Oromia')) region = 'Oromia';

  // Coordinates mapping (fallback)
  let coordinates = { lat: 9.03, lng: 38.74 }; // Addis default
  if (name.includes('Lalibela')) coordinates = { lat: 12.0319, lng: 39.0411 };
  if (name.includes('Gondar')) coordinates = { lat: 12.6080, lng: 37.4696 };
  if (name.includes('Aksum')) coordinates = { lat: 14.1308, lng: 38.7156 };
  if (name.includes('Awash')) coordinates = { lat: 11.1, lng: 40.5 };
  if (name.includes('Harar')) coordinates = { lat: 9.3106, lng: 42.1278 };
  if (name.includes('Tiya')) coordinates = { lat: 8.43, lng: 38.61 };
  if (name.includes('Omo')) coordinates = { lat: 4.8, lng: 36.16 };
  if (name.includes('Konso')) coordinates = { lat: 5.25, lng: 37.48 };
  if (name.includes('Gedeo')) coordinates = { lat: 6.13, lng: 38.31 };
  if (name.includes('Melka')) coordinates = { lat: 8.71, lng: 38.6 };

  // Image mapping
  let image = '/images/placeholder.png';
  if (name.includes('Lalibela')) image = '/images/lalibela.png';
  if (name.includes('Gondar')) image = '/images/gondar.png';
  if (name.includes('Aksum')) image = '/images/aksum.png';
  if (name.includes('Awash')) image = '/images/awash.png';
  if (name.includes('Harar')) image = '/images/harar.png';
  if (name.includes('Tiya')) image = '/images/tiya.png';
  if (name.includes('Omo')) image = '/images/omo.png';
  if (name.includes('Konso')) image = 'https://upload.wikimedia.org/wikipedia/commons/4/4b/Konso_terrasses.jpg';
  if (name.includes('Gedeo')) image = 'https://upload.wikimedia.org/wikipedia/commons/e/ec/Stelae_at_Tuto_Fela.jpg';
  if (name.includes('Melka')) image = 'https://upload.wikimedia.org/wikipedia/commons/b/b5/Melka_Kunture_museum_3.jpg';

  heritages.push({
    name,
    history: history.trim(),
    location: loc,
    coordinates,
    image,
    isUnesco: true,
    category: "Historical", // generic
    region,
    quickFacts,
    touristHighlights: highlights,
    travelerExperience
  });
});

fs.writeFileSync('src/data/heritagesData.json', JSON.stringify(heritages, null, 2));
console.log('Successfully generated src/data/heritagesData.json with ' + heritages.length + ' records.');
