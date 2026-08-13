import fs from 'fs';

const markdown = fs.readFileSync('src/knowledge_culture.md', 'utf-8');

const cultures = [];
const sections = markdown.split('\n# ').filter(s => s.trim().length > 0);

sections.forEach((section, index) => {
  const lines = section.split('\n');
  let name = (index === 0 ? lines[0].replace(/^# /, '') : lines[0]).trim();
  
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
    } else if (currentHeader.startsWith('History')) {
      if (line !== '' && !line.startsWith('---') && !line.startsWith('#')) {
        history += line + '\n\n';
      }
    } else if (currentHeader.startsWith('Key Cultural Highlights') || currentHeader.startsWith('Key Cultural')) {
      if (line.startsWith('#### ')) {
        if (currentHighlight) highlights.push(currentHighlight);
        currentHighlight = { title: line.replace(/#### \d+\.\s*/, '').trim(), description: '' };
      } else if (line.startsWith('* ') && currentHighlight) {
        currentHighlight.description += line.replace('* ', '') + ' ';
      }
    } else if (currentHeader.startsWith('What Travelers')) {
      if (line.startsWith('* ')) {
        travelerExperience.push(line.replace('* ', '').replace(/\*\*/g, ''));
      }
    }
  }
  
  if (currentHighlight) highlights.push(currentHighlight);

  const loc = quickFacts['Location'] || '';

  // Image mapping (fallback to Wikimedia)
  let image = 'https://upload.wikimedia.org/wikipedia/commons/2/29/Meskel_Festival%2C_Addis_Ababa.jpg'; // default meskel
  if (name.toLowerCase().includes('fichee')) image = 'https://upload.wikimedia.org/wikipedia/commons/c/c5/Sidama_people_celebrating_Fichee-Chambalaalla.jpg';
  if (name.toLowerCase().includes('gada')) image = 'https://upload.wikimedia.org/wikipedia/commons/f/fc/Oromo_gadaa.jpg';
  if (name.toLowerCase().includes('timket')) image = 'https://upload.wikimedia.org/wikipedia/commons/e/ec/Timkat_Addis_Ababa.jpg';
  if (name.toLowerCase().includes('shuwalid')) image = 'https://upload.wikimedia.org/wikipedia/commons/6/67/Harar_gate.jpg';
  if (name.toLowerCase().includes('xeer')) image = 'https://upload.wikimedia.org/wikipedia/commons/1/15/Dire_Dawa_station.jpg';
  if (name.toLowerCase().includes('gifaataa')) image = 'https://upload.wikimedia.org/wikipedia/commons/f/fb/Wolaita_Sodo_Landscape.jpg';

  cultures.push({
    name,
    history: history.trim(),
    location: loc,
    image,
    isUnesco: true,
    quickFacts,
    culturalHighlights: highlights,
    travelerExperience
  });
});

fs.writeFileSync('src/data/culturesData.json', JSON.stringify(cultures, null, 2));
console.log('Successfully generated src/data/culturesData.json with ' + cultures.length + ' records.');
