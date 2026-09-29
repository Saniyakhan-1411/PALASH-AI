/**
 * PALASH AI - Educational Photo & Visual Asset Engine
 * Provides authentic, high-resolution, culturally aligned educational photos
 * for Primary Class 1-5 Flashcards, See and Learn, and Vernacular Pedagogy.
 */

interface PhotoEntry {
  keywords: string[];
  url: string;
  alt: string;
  iconName: string;
}

export const EDUCATIONAL_PHOTOS: PhotoEntry[] = [
  // 1. Water & Liquids
  {
    keywords: ['पानी', 'जल', 'ᱫᱟᱜ', 'दाग', 'दाः', 'water', 'दारे', 'liquid', 'drink', 'पीना'],
    url: 'https://images.unsplash.com/photo-1548839140-29a749e1bc4e?w=600&auto=format&fit=crop&q=80',
    alt: 'स्वच्छ जल (Water)',
    iconName: 'Droplets',
  },
  // 2. Trees & Forest
  {
    keywords: ['पेड़', 'पौधा', 'ᱫᱟᱨᱮ', 'दारे', 'दारु', 'tree', 'plant', 'वन', 'जंगल', 'साखू', 'साल', 'महुआ', 'पलास', 'नीम', 'बीर', 'bir'],
    url: 'https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=600&auto=format&fit=crop&q=80',
    alt: 'हरा-भरा वृक्ष (Tree)',
    iconName: 'Trees',
  },
  // 3. Leaf
  {
    keywords: ['पत्ता', 'पत्ती', 'पत्तियां', 'ᱥᱟᱠᱟᱢ', 'साकाम', 'leaf', 'leaves', 'foliage'],
    url: 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?w=600&auto=format&fit=crop&q=80',
    alt: 'हरा पत्ता (Leaf)',
    iconName: 'Leaf',
  },
  // 4. Sun & Light
  {
    keywords: ['धूप', 'सूर्य', 'सूरज', 'ᱥᱤᱛᱩᱝ', 'ᱵᱮᱲᱟ', 'सितुंग', 'बेड़ा', 'सिंगी', 'singi', 'sun', 'sunlight', 'morning', 'प्रातः'],
    url: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=600&auto=format&fit=crop&q=80',
    alt: 'सूर्य की किरणें (Sunlight)',
    iconName: 'Sun',
  },
  // 5. Soil & Earth
  {
    keywords: ['मिट्टी', 'धरती', 'ᱦᱟᱥᱟ', 'हासा', 'soil', 'earth', 'mud', 'sprout', 'जमीन'],
    url: 'https://images.unsplash.com/photo-1592417817098-8f3d69102353?w=600&auto=format&fit=crop&q=80',
    alt: 'उपजाऊ मिट्टी (Soil)',
    iconName: 'Sprout',
  },
  // 6. Flower
  {
    keywords: ['फूल', 'पुष्प', 'ᱵᱟᱦᱟ', 'बाहा', 'flower', 'blossom', 'palash flower', 'पलाश'],
    url: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=600&auto=format&fit=crop&q=80',
    alt: 'खिला हुआ फूल (Flower)',
    iconName: 'Flower2',
  },
  // 7. Fruits
  {
    keywords: ['फल', 'आम', 'सेब', 'ᱡᱚ', 'ᱩᱞ', 'जो', 'उल', 'fruit', 'mango', 'apple', 'अमरूद'],
    url: 'https://images.unsplash.com/photo-1553279768-865429fa0078?w=600&auto=format&fit=crop&q=80',
    alt: 'मीठा फल (Fruit)',
    iconName: 'Apple',
  },
  // 8. Birds
  {
    keywords: ['चिड़िया', 'पक्षी', 'ᱪᱮᱬᱮ', 'चेणे', 'चेणें', 'bird', 'sparrow', 'गौरैया'],
    url: 'https://images.unsplash.com/photo-1444464666168-49d633b86797?w=600&auto=format&fit=crop&q=80',
    alt: 'सुंदर पक्षी (Bird)',
    iconName: 'Sparkles',
  },
  // 9. Peacock
  {
    keywords: ['मोर', 'ᱢᱟᱨᱟᱜ', 'माराग', 'मारार', 'peacock'],
    url: 'https://images.unsplash.com/photo-1536514498073-50e69d19f0cf?w=600&auto=format&fit=crop&q=80',
    alt: 'राष्ट्रीय पक्षी मोर (Peacock)',
    iconName: 'Sparkles',
  },
  // 10. Cow & Domestic Animals
  {
    keywords: ['गाय', 'गौ', 'ᱜᱟᱹᱭ', 'गई', 'उरीः', 'urih', 'cow', 'cattle', 'दूध'],
    url: 'https://images.unsplash.com/photo-1546445317-29f4545e9d53?w=600&auto=format&fit=crop&q=80',
    alt: 'देशी गाय (Cow)',
    iconName: 'Sparkles',
  },
  // 11. Goat
  {
    keywords: ['बकरी', 'बकरा', 'ᱢᱮᱨᱚᱢ', 'मेरोम', 'मेड़ोम', 'goat'],
    url: 'https://images.unsplash.com/photo-1524024973431-2ad916746881?w=600&auto=format&fit=crop&q=80',
    alt: 'बकरी (Goat)',
    iconName: 'Sparkles',
  },
  // 12. Dog
  {
    keywords: ['कुत्ता', 'पिल्ला', 'ᱥᱮᱛᱟ', 'सेता', 'seta', 'dog', 'puppy'],
    url: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=600&auto=format&fit=crop&q=80',
    alt: 'पालतू कुत्ता (Dog)',
    iconName: 'Sparkles',
  },
  // 13. Cat
  {
    keywords: ['बिल्ली', 'पुसी', 'ᱯᱩᱥᱤ', 'pusi', 'cat', 'kitten'],
    url: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=600&auto=format&fit=crop&q=80',
    alt: 'बिल्ली (Cat)',
    iconName: 'Sparkles',
  },
  // 14. Elephant
  {
    keywords: ['हाथी', 'गज', 'ᱦᱟᱹᱛᱤ', 'हाती', 'hati', 'elephant'],
    url: 'https://images.unsplash.com/photo-1557050543-4d5f4e07ef46?w=600&auto=format&fit=crop&q=80',
    alt: 'जंगली हाथी (Elephant)',
    iconName: 'Sparkles',
  },
  // 15. Tiger
  {
    keywords: ['बाघ', 'शेर', 'तेंदुआ', 'ᱛᱟᱹᱨᱩᱵ', 'तारुब', 'कुला', 'kula', 'tiger'],
    url: 'https://images.unsplash.com/photo-1561731216-c3a4d99437d5?w=600&auto=format&fit=crop&q=80',
    alt: 'भारतीय बाघ (Tiger)',
    iconName: 'Sparkles',
  },
  // 16. Deer
  {
    keywords: ['हिरण', 'मृग', 'ᱡᱷᱤᱞ', 'झिल', 'deer'],
    url: 'https://images.unsplash.com/photo-1484406566174-9da000fda645?w=600&auto=format&fit=crop&q=80',
    alt: 'हिरण (Deer)',
    iconName: 'Sparkles',
  },
  // 17. Fish
  {
    keywords: ['मछली', 'मीन', 'ᱦᱟᱹᱠᱩ', 'हाकू', 'haku', 'fish'],
    url: 'https://images.unsplash.com/photo-1522069169874-c58ec4b76be5?w=600&auto=format&fit=crop&q=80',
    alt: 'रंगीन मछली (Fish)',
    iconName: 'Sparkles',
  },
  // 18. School & Classroom
  {
    keywords: ['स्कूल', 'विद्यालय', 'पाठशाला', 'ᱟᱥᱲᱟ', 'आसड़ा', 'इसकुल', 'iskul', 'school', 'classroom', 'कक्षा', 'चानाच'],
    url: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=600&auto=format&fit=crop&q=80',
    alt: 'प्राथमिक विद्यालय (Primary School)',
    iconName: 'BookOpen',
  },
  // 19. Book & Reading
  {
    keywords: ['किताब', 'पुस्तक', 'ᱯᱩᱛᱷᱤ', 'पुथी', 'puthi', 'book', 'reading', 'study', 'पढ़ना', 'पाठ'],
    url: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600&auto=format&fit=crop&q=80',
    alt: 'ज्ञानवर्धक किताब (Book)',
    iconName: 'BookOpen',
  },
  // 20. Pen, Pencil & Writing
  {
    keywords: ['कलम', 'पेंसिल', 'लेखनी', 'ᱠᱚᱞᱚᱢ', 'कोलोम', 'कालाम', 'pen', 'pencil', 'write', 'लिखना', 'ओल'],
    url: 'https://images.unsplash.com/photo-1585336261026-40788ee5908e?w=600&auto=format&fit=crop&q=80',
    alt: 'कलम व पेंसिल (Pencil)',
    iconName: 'BookOpen',
  },
  // 21. Village Home
  {
    keywords: ['घर', 'मकान', 'ᱚᱲᱟᱜ', 'ओड़ाग', 'ओड़ाः', 'odah', 'home', 'house'],
    url: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=600&auto=format&fit=crop&q=80',
    alt: 'सुंदर गाँव का घर (Home)',
    iconName: 'BookOpen',
  },
  // 22. Village Landscape
  {
    keywords: ['गाँव', 'ग्राम', 'ᱟᱹᱛᱩ', 'आतु', 'हातूं', 'हातु', 'hatu', 'village', 'rural'],
    url: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600&auto=format&fit=crop&q=80',
    alt: 'प्रकृति की गोद में गाँव (Village)',
    iconName: 'Trees',
  },
  // 23. Mother
  {
    keywords: ['माँ', 'माता', 'माताजी', 'ᱟᱭᱳ', 'आयो', 'एंगा', 'enga', 'mother', 'mom'],
    url: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=600&auto=format&fit=crop&q=80',
    alt: 'स्नेहमयी माँ (Mother)',
    iconName: 'Sparkles',
  },
  // 24. Father
  {
    keywords: ['पिताजी', 'पिता', 'ᱵᱟᱵᱟ', 'बाबा', 'आपा', 'apa', 'father', 'dad'],
    url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&auto=format&fit=crop&q=80',
    alt: 'पिताजी (Father)',
    iconName: 'Sparkles',
  },
  // 25. Teacher
  {
    keywords: ['शिक्षक', 'शिक्षिका', 'गुरुजी', 'मास्टर', 'माचेत', 'ᱢᱟᱪᱮᱛ', 'मास्तर', 'teacher', 'guru'],
    url: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?w=600&auto=format&fit=crop&q=80',
    alt: 'प्राथमिक शिक्षक (Teacher)',
    iconName: 'GraduationCap',
  },
  // 26. Children / Students
  {
    keywords: ['बच्चे', 'बच्चा', 'विद्यार्थी', 'छात्र', 'ᱜᱤᱫᱽᱨᱟᱹ', 'गिदरा', 'होनको', 'हुनको', 'hon', 'children', 'students'],
    url: 'https://images.unsplash.com/photo-1485546246426-74dc88dec4d9?w=600&auto=format&fit=crop&q=80',
    alt: 'हँसते-खेलते बच्चे (Children)',
    iconName: 'Sparkles',
  },
  // 27. Greetings / Johar
  {
    keywords: ['नमस्ते', 'प्रणाम', 'जोहार', 'ᱡᱚᱦᱟᱨ', 'greeting', 'johar', 'namaste'],
    url: 'https://images.unsplash.com/photo-1491438590914-bc09fcaaf77a?w=600&auto=format&fit=crop&q=80',
    alt: 'पारंपरिक जोहार व अभिवादन (Johar)',
    iconName: 'Sparkles',
  },
  // 28. Market / Weekly Haat
  {
    keywords: ['हाट', 'बाज़ार', 'बाजार', 'ᱦᱟᱴ', 'market', 'haat'],
    url: 'https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=600&auto=format&fit=crop&q=80',
    alt: 'साप्ताहिक हाट बाज़ार (Market)',
    iconName: 'Sparkles',
  },
  // 29. Money & Currency
  {
    keywords: ['रुपये', 'पैसा', 'सिक्का', 'ᱴᱟᱠᱟ', 'ᱯᱩᱭᱥᱟᱹ', 'टाका', 'पुईसा', 'money', 'rupee', 'currency'],
    url: 'https://images.unsplash.com/photo-1621416894569-0f39ed31d247?w=600&auto=format&fit=crop&q=80',
    alt: 'भारतीय मुद्रा व सिक्के (Money)',
    iconName: 'Sparkles',
  },
  // 30. Numbers & Math
  {
    keywords: ['गिनती', 'संख्या', 'लेखा', 'लखा', 'ᱞᱮᱠᱷᱟ', 'एक', 'दो', 'तीन', 'चार', 'पांच', 'पाँच', 'counting', 'numbers', 'math'],
    url: 'https://images.unsplash.com/photo-1596495578065-6e0763fa1178?w=600&auto=format&fit=crop&q=80',
    alt: 'संख्या व गिनती (Numbers)',
    iconName: 'BookOpen',
  },
  // 31. River
  {
    keywords: ['नदी', 'जलधारा', 'ᱜᱟᱰᱟ', 'गाडा', 'गाड़ा', 'river', 'stream'],
    url: 'https://images.unsplash.com/photo-1437482078695-73f5ca6c96e2?w=600&auto=format&fit=crop&q=80',
    alt: 'कलकल बहती नदी (River)',
    iconName: 'Droplets',
  },
  // 32. Mountain & Hills
  {
    keywords: ['पहाड़', 'पर्वत', 'ᱵᱩᱨᱩ', 'बुरू', 'बुरु', 'buru', 'mountain', 'hill'],
    url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600&auto=format&fit=crop&q=80',
    alt: 'ऊँचा हरा-भरा पहाड़ (Mountain)',
    iconName: 'Trees',
  },
  // 33. Cloud & Rain
  {
    keywords: ['बादल', 'बारिश', 'वर्षा', 'ᱨᱤᱢᱤᱞ', 'ᱫᱟᱜ ᱡᱟᱹᱲᱤ', 'रिमिल', 'दाग जाड़ी', 'गामा', 'gama', 'rain', 'cloud', 'monsoon'],
    url: 'https://images.unsplash.com/photo-1534088568595-a066f410bcda?w=600&auto=format&fit=crop&q=80',
    alt: 'घने बादल व वर्षा (Clouds & Rain)',
    iconName: 'Droplets',
  },
  // 34. Rice / Paddy & Crops
  {
    keywords: ['धान', 'चावल', 'चाउले', 'चाउली', 'भात', 'ᱫᱟᱠᱟ', 'ᱪᱟᱣᱞᱮ', 'दाका', 'मंडी', 'rice', 'paddy', 'grain', 'farm', 'खेत'],
    url: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&auto=format&fit=crop&q=80',
    alt: 'धान की सुनहरी फसल (Paddy/Rice)',
    iconName: 'Sprout',
  },
  // 35. Eyes & Vision
  {
    keywords: ['आँख', 'आंख', 'नयन', 'नेत्र', 'ᱢᱮᱫ', 'मेद', 'med', 'eye', 'eyes', 'vision'],
    url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=600&auto=format&fit=crop&q=80',
    alt: 'आँख (Eye)',
    iconName: 'Sparkles',
  },
  // 36. Ears & Hearing
  {
    keywords: ['कान', 'कर्ण', 'ᱞᱩᱛᱩᱨ', 'लुतुर', 'लुतुर', 'lutur', 'ear', 'ears', 'hear', 'सुनना'],
    url: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=600&auto=format&fit=crop&q=80',
    alt: 'कान (Ear)',
    iconName: 'Sparkles',
  },
  // 37. Hands & Work
  {
    keywords: ['हाथ', 'हस्त', 'कर', 'ᱛᱤ', 'ती', 'ti', 'hand', 'hands'],
    url: 'https://images.unsplash.com/photo-1532798442725-41036acc7489?w=600&auto=format&fit=crop&q=80',
    alt: 'हाथ (Hand)',
    iconName: 'Sparkles',
  },
  // 38. Legs & Walking
  {
    keywords: ['पैर', 'पांव', 'पाद', 'चरण', 'ᱡᱟᱝᱜᱟ', 'जांगा', 'कता', 'kata', 'foot', 'leg', 'walk', 'चलना'],
    url: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=600&auto=format&fit=crop&q=80',
    alt: 'पैर (Foot/Leg)',
    iconName: 'Sparkles',
  },
  // 39. Moon & Night
  {
    keywords: ['चाँद', 'चांद', 'चन्द्रमा', 'ᱪᱟᱸᱫᱚ', 'चांदो', 'चांदु', 'chandu', 'moon', 'night'],
    url: 'https://images.unsplash.com/photo-1532767153582-b1a0e5145009?w=600&auto=format&fit=crop&q=80',
    alt: 'शीतल चाँद (Moon)',
    iconName: 'Sparkles',
  },
  // 40. Stars
  {
    keywords: ['तारा', 'तारे', 'नक्षत्र', 'ᱤᱯᱤᱞ', 'इपिल', 'ipil', 'star', 'stars'],
    url: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?w=600&auto=format&fit=crop&q=80',
    alt: 'चमकते तारे (Stars)',
    iconName: 'Sparkles',
  },
  // 41. Hen & Rooster
  {
    keywords: ['मुर्गा', 'मुर्गी', 'कुक्कुट', 'ᱥᱤᱢ', 'सीम', 'सीम सांडी', 'सीम एंगा', 'sim', 'hen', 'rooster', 'chicken'],
    url: 'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?w=600&auto=format&fit=crop&q=80',
    alt: 'मुर्गा व मुर्गी (Hen/Rooster)',
    iconName: 'Sparkles',
  },
  // 42. Food & Roti / Bread
  {
    keywords: ['रोटी', 'पीठा', 'लाड', 'ᱯᱤᱴᱷᱟᱹ', 'lad', 'bread', 'roti', 'food', 'भोजन', 'खाना'],
    url: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&auto=format&fit=crop&q=80',
    alt: 'स्वादिष्ट रोटी (Roti)',
    iconName: 'Sparkles',
  },
  // 43. Milk
  {
    keywords: ['दूध', 'दुग्ध', 'ᱛᱳᱣᱟ', 'तोवा', 'तोआ', 'toa', 'milk'],
    url: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=600&auto=format&fit=crop&q=80',
    alt: 'पौष्टिक दूध (Milk)',
    iconName: 'Sparkles',
  },
  // 44. Traditional Music & Drum
  {
    keywords: ['मांदर', 'ढोल', 'नगाड़ा', 'वाद्ययंत्र', 'संगीत', 'ᱛᱩᱢᱫᱟᱜ', 'tumdak', 'drum', 'music'],
    url: 'https://images.unsplash.com/photo-1519892300165-cb5542fb47c7?w=600&auto=format&fit=crop&q=80',
    alt: 'पारंपरिक मांदर व संगीत (Music)',
    iconName: 'Sparkles',
  },
];

/**
 * Returns a high-resolution educational photo URL for any given word or topic.
 * Accurately matches Hindi, Santali (Ol Chiki + Deva), Ho, and Mundari terms.
 */
export function getEducationalPhoto(
  word: string,
  topic = '',
  fallbackDefault = 'https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=600&auto=format&fit=crop&q=80'
): { url: string; alt: string; iconName: string } {
  const cleanWord = (word || '').toLowerCase().trim();
  const cleanTopic = (topic || '').toLowerCase().trim();

  if (!cleanWord && !cleanTopic) {
    return {
      url: fallbackDefault,
      alt: 'प्राकृतिक परिवेश',
      iconName: 'Leaf',
    };
  }

  // 1. Primary: Match against the specific word itself
  for (const entry of EDUCATIONAL_PHOTOS) {
    if (
      entry.keywords.some((k) => {
        const lk = k.toLowerCase();
        return cleanWord === lk || cleanWord.includes(lk) || lk.includes(cleanWord);
      })
    ) {
      return { url: entry.url, alt: entry.alt, iconName: entry.iconName };
    }
  }

  // 2. Secondary: Match against individual tokens of the word
  const tokens = cleanWord.split(/[\s/,\-()।॥]+/);
  for (const token of tokens) {
    if (token.length > 1) {
      for (const entry of EDUCATIONAL_PHOTOS) {
        if (entry.keywords.some((k) => k.toLowerCase() === token || token.includes(k.toLowerCase()))) {
          return { url: entry.url, alt: entry.alt, iconName: entry.iconName };
        }
      }
    }
  }

  // 3. Tertiary: Fallback to topic match
  if (cleanTopic) {
    for (const entry of EDUCATIONAL_PHOTOS) {
      if (entry.keywords.some((k) => cleanTopic.includes(k.toLowerCase()))) {
        return { url: entry.url, alt: entry.alt, iconName: entry.iconName };
      }
    }
  }

  // Fallback to vibrant nature tree
  return {
    url: fallbackDefault,
    alt: `${word} सचित्र फ़्लैशकार्ड`,
    iconName: 'Leaf',
  };
}
