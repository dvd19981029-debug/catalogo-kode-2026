const fs = require('fs');
const path = require('path');

// 1. Load source perfumes
const perfumes = JSON.parse(fs.readFileSync(path.join(__dirname, '../perfumes.json'), 'utf8'));

// 2. Load kodelocal databases
const db = JSON.parse(fs.readFileSync('/Users/luis/.gemini/antigravity/scratch/kodelocal/src/lib/fragranceDatabase.json', 'utf8'));

const { FRAGRANTICA_OVERRIDES } = require('./fragrantica_overrides.js');

// 3. Palette for accord bars
const ACCORD_COLORS = {
  'amaderado': { bg: '#4a154b', text: '#ffffff' },
  'oud': { bg: '#1e1b4b', text: '#ffffff' },
  'pachulí': { bg: '#581c87', text: '#ffffff' },
  'terroso': { bg: '#2e1065', text: '#ffffff' },
  'cuero': { bg: '#3b0764', text: '#ffffff' },
  'tabaco': { bg: '#4c0519', text: '#ffffff' },
  'cálido especiado': { bg: '#701a75', text: '#ffffff' },
  'canela': { bg: '#831843', text: '#ffffff' },
  'especias': { bg: '#701a75', text: '#ffffff' },
  'café': { bg: '#311042', text: '#ffffff' },
  'cacao': { bg: '#3b0764', text: '#ffffff' },
  'ámbar': { bg: '#86198f', text: '#ffffff' },
  'ambarado': { bg: '#86198f', text: '#ffffff' },
  'avainillado': { bg: '#9333ea', text: '#ffffff' },
  'vainilla': { bg: '#9333ea', text: '#ffffff' },
  'dulce': { bg: '#d946ef', text: '#ffffff' },
  'miel': { bg: '#a21caf', text: '#ffffff' },
  'caramelo': { bg: '#a855f7', text: '#ffffff' },
  'balsámico': { bg: '#6b21a8', text: '#ffffff' },
  'licor': { bg: '#581c87', text: '#ffffff' },
  'aromático': { bg: '#4338ca', text: '#ffffff' },
  'fresco especiado': { bg: '#4f46e5', text: '#ffffff' },
  'fresco': { bg: '#6366f1', text: '#ffffff' },
  'lavanda': { bg: '#7e22ce', text: '#ffffff' },
  'iris': { bg: '#4f46e5', text: '#ffffff' },
  'anisado': { bg: '#3730a3', text: '#ffffff' },
  'anís': { bg: '#3730a3', text: '#ffffff' },
  'floral': { bg: '#c026d3', text: '#ffffff' },
  'floral blanco': { bg: '#818cf8', text: '#ffffff' },
  'rosas': { bg: '#be123c', text: '#ffffff' },
  'afrutado': { bg: '#db2777', text: '#ffffff' },
  'frutal': { bg: '#db2777', text: '#ffffff' },
  'fruta de la pasión': { bg: '#e11d48', text: '#ffffff' },
  'cereza': { bg: '#9f1239', text: '#ffffff' },
  'coco': { bg: '#c084fc', text: '#ffffff' },
  'cítrico': { bg: '#6366f1', text: '#ffffff' },
  'marino': { bg: '#0284c7', text: '#ffffff' },
  'acuático': { bg: '#0284c7', text: '#ffffff' },
  'salado': { bg: '#0284c7', text: '#ffffff' },
  'tropical': { bg: '#db2777', text: '#ffffff' },
  'nardo': { bg: '#818cf8', text: '#ffffff' },
  'almendra': { bg: '#a855f7', text: '#ffffff' },
  'ozónico': { bg: '#38bdf8', text: '#0f172a' },
  'vodka': { bg: '#38bdf8', text: '#0f172a' },
  'verde': { bg: '#059669', text: '#ffffff' },
  'musgoso': { bg: '#065f46', text: '#ffffff' },
  'absenta': { bg: '#0d9488', text: '#ffffff' },
  'atalcado': { bg: '#a855f7', text: '#ffffff' },
  'lactónico': { bg: '#e9d5ff', text: '#581c87' },
  'almizclado': { bg: '#64748b', text: '#ffffff' },
  'ahumado': { bg: '#334155', text: '#ffffff' },
  'mineral': { bg: '#334155', text: '#ffffff' },
  'metálico': { bg: '#475569', text: '#ffffff' },
  'aldehídico': { bg: '#a5b4fc', text: '#1e1b4b' }
};

function getAccordColor(name) {
  const norm = (name || '')
    .toLowerCase()
    .trim()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');

  for (const [key, val] of Object.entries(ACCORD_COLORS)) {
    const normKey = key.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    if (norm === normKey || norm.includes(normKey) || normKey.includes(norm)) {
      return val;
    }
  }
  return { bg: '#4f46e5', text: '#ffffff' };
}

// 4. Note Image Mapping Rules
const NOTE_RULES = [
  // Cítricos
  { pattern: /bergamot/i, file: 'bergamota' },
  { pattern: /lim[oó]n/i, file: 'limon' },
  { pattern: /lemon/i, file: 'lemon' },
  { pattern: /lima(?!\s*caviar)/i, file: 'lima' },
  { pattern: /mandarin/i, file: 'mandarina' },
  { pattern: /naranja/i, file: 'naranja' },
  { pattern: /pomelo|toronja/i, file: 'pomelo' },
  { pattern: /yuzu/i, file: 'yuzu' },
  { pattern: /petit\s*grain/i, file: 'petitgrain' },
  { pattern: /c[íi]tric/i, file: 'limon' },

  // Frutas
  { pattern: /manzana\s*verde/i, file: 'manzana-verde' },
  { pattern: /manzana/i, file: 'manzana' },
  { pattern: /pera/i, file: 'pera' },
  { pattern: /pi[ñn]a/i, file: 'pina' },
  { pattern: /ciruela/i, file: 'ciruela' },
  { pattern: /coco/i, file: 'coco' },
  { pattern: /cereza/i, file: 'cereza' },
  { pattern: /frambuesa/i, file: 'frambuesa' },
  { pattern: /fresa/i, file: 'frambuesa' },
  { pattern: /zarzamora|mora\b/i, file: 'grosella' },
  { pattern: /grosella/i, file: 'grosella' },
  { pattern: /melocot[óo]n|durazno|mel[oó]n|sand[íi]a/i, file: 'melocoton' },
  { pattern: /granada/i, file: 'granada' },
  { pattern: /maracuy[áa]/i, file: 'maracuya' },
  { pattern: /lichi/i, file: 'lichi' },
  { pattern: /higo/i, file: 'higo' },
  { pattern: /fruto/i, file: 'frambuesa' },

  // Aromáticas y Hierbas
  { pattern: /lavand/i, file: 'lavanda' },
  { pattern: /menta/i, file: 'menta' },
  { pattern: /salvia/i, file: 'salvia' },
  { pattern: /romero/i, file: 'romero' },
  { pattern: /albahaca/i, file: 'albahaca' },
  { pattern: /tomillo/i, file: 'tomillo' },
  { pattern: /enebro/i, file: 'enebro' },
  { pattern: /cipr[ée]s/i, file: 'cipres' },
  { pattern: /hinojo|alcaravea/i, file: 'anis' },
  { pattern: /absenta/i, file: 'menta' },
  { pattern: /bamb[úu]/i, file: 'notas-verdes' },
  { pattern: /cannabis/i, file: 'notas-verdes' },
  { pattern: /lentisco/i, file: 'notas-verdes' },
  { pattern: /davana/i, file: 'melocoton' },

  // Especias
  { pattern: /canela/i, file: 'canela' },
  { pattern: /cardamomo/i, file: 'cardamomo' },
  { pattern: /pimienta\s*rosa/i, file: 'pimienta-rosa' },
  { pattern: /pimienta\s*blanca/i, file: 'pimienta-blanca' },
  { pattern: /pimienta/i, file: 'pimienta-negra' },
  { pattern: /jengibre/i, file: 'jengibre' },
  { pattern: /azafr[áa]n/i, file: 'azafran' },
  { pattern: /nuez\s*moscada/i, file: 'nuez-moscada' },
  { pattern: /an[íi]s|regaliz/i, file: 'anis' },
  { pattern: /clavo/i, file: 'clavo' },
  { pattern: /cilantro/i, file: 'cilantro' },
  { pattern: /especia/i, file: 'canela' },

  // Flores
  { pattern: /rosa\s*blanca/i, file: 'rosa-blanca' },
  { pattern: /rosa/i, file: 'rosa' },
  { pattern: /jazm[íi]n/i, file: 'jazmin' },
  { pattern: /azahar|neroli/i, file: 'flor-azahar' },
  { pattern: /tuberosa|nardo/i, file: 'tuberosa' },
  { pattern: /iris/i, file: 'iris' },
  { pattern: /violeta/i, file: 'violeta' },
  { pattern: /geranio/i, file: 'geranio' },
  { pattern: /gardenia/i, file: 'gardenia' },
  { pattern: /peon[íi]a/i, file: 'peonia' },
  { pattern: /orqu[íi]dea/i, file: 'orquidea' },
  { pattern: /ylang/i, file: 'ylang-ylang' },
  { pattern: /magnolia/i, file: 'magnolia' },
  { pattern: /loto/i, file: 'flor-loto' },
  { pattern: /campanilla|mimosa|osmanto|fresia/i, file: 'jazmin' },
  { pattern: /floral/i, file: 'rosa' },

  // Maderas
  { pattern: /cedro/i, file: 'cedro' },
  { pattern: /s[áa]ndalo/i, file: 'sandalo' },
  { pattern: /vetiver/i, file: 'vetiver' },
  { pattern: /oud|agar/i, file: 'oud' },
  { pattern: /gaiac|guayaco/i, file: 'guayaco' },
  { pattern: /cachemira|cashmeran/i, file: 'cachemira' },
  { pattern: /abedul/i, file: 'abedul' },
  { pattern: /musgo/i, file: 'musgo-roble' },
  { pattern: /caoba|palo\s*de\s*rosa/i, file: 'cedro' },
  { pattern: /madera/i, file: 'maderas' },

  // Resinas y Bálsamos
  { pattern: /[áa]mbar/i, file: 'ambar' },
  { pattern: /pachul[íi]/i, file: 'pachuli' },
  { pattern: /incienso|ol[íi]bano/i, file: 'incienso' },
  { pattern: /benju[íi]/i, file: 'benjui' },
  { pattern: /l[áa]dano/i, file: 'ladano' },
  { pattern: /mirra/i, file: 'mirra' },
  { pattern: /b[áa]lsamo|resina/i, file: 'incienso' },
  { pattern: /ambroxan|ambrofix/i, file: 'ambroxan' },
  { pattern: /amberwood/i, file: 'ambar' },
  { pattern: /iso\s*e\s*super/i, file: 'maderas' },

  // Gourmand
  { pattern: /vainilla/i, file: 'vainilla' },
  { pattern: /tonka/i, file: 'haba-tonka' },
  { pattern: /caf[ée]/i, file: 'cafe' },
  { pattern: /cacao/i, file: 'cacao' },
  { pattern: /chocolate/i, file: 'chocolate' },
  { pattern: /miel/i, file: 'miel' },
  { pattern: /caramelo/i, file: 'caramelo' },
  { pattern: /almendra/i, file: 'almendra' },
  { pattern: /avellana|pralin[ée]/i, file: 'avellana' },
  { pattern: /crema\s*batida/i, file: 'crema-batida' },
  { pattern: /algod[óo]n\s*(de\s*)?az[úu]car/i, file: 'algodon-azucar' },

  // Cuero y Tabaco
  { pattern: /cuero/i, file: 'cuero' },
  { pattern: /tabaco/i, file: 'tabaco' },
  { pattern: /almizcle|ambreta/i, file: 'almizcle' },

  // Acuático, Fresco y Especial
  { pattern: /marina|mar\b|acu[aá]t|acuos|aquozone|calone|sal\b|salado/i, file: 'notas-marinas' },
  { pattern: /mineral|met[aá]lic|carb[oó]n|arena|humo/i, file: 'notas-minerales' },
  { pattern: /oz[óo]nic/i, file: 'notas-ozonicas' },
  { pattern: /verde|pepino|ruibarbo|t[eé]|hierba\s*luisa/i, file: 'notas-verdes' },
  { pattern: /helad|vodka|ginebra|licor/i, file: 'ginebra-helada' },
  { pattern: /aldeh[íi]d/i, file: 'aldehidos' },
  { pattern: /mango/i, file: 'maracuya' },
  { pattern: /casta[ñn]a/i, file: 'avellana' },
  { pattern: /cidra|sorbete/i, file: 'limon' },
  { pattern: /narciso/i, file: 'magnolia' },
  { pattern: /azucena|muguete|lirio|lino|tagetes/i, file: 'flor-azahar' },
  { pattern: /or[ée]gano/i, file: 'romero' },
  { pattern: /algalia|civet/i, file: 'almizcle' },
  { pattern: /opop[oó]naco/i, file: 'benjui' },
  { pattern: /chinotto/i, file: 'naranja' },
  { pattern: /pimiento|chile/i, file: 'pimienta-rosa' },
  { pattern: /nagarmot|cipriol/i, file: 'pachuli' },
  { pattern: /cumarina/i, file: 'haba-tonka' },
  { pattern: /abr[oó]tano|artemisia|mugwort/i, file: 'salvia' },
  { pattern: /gamuza/i, file: 'cuero' },
  { pattern: /elem[íi]/i, file: 'incienso' },
  { pattern: /cera\s*(de\s*)?abeja/i, file: 'miel' },
  { pattern: /oriental/i, file: 'ambar' }
];

function getNoteImageUrl(note) {
  if (!note) return 'notes/maderas.jpg';
  for (const rule of NOTE_RULES) {
    if (rule.pattern.test(note)) {
      return `notes/${rule.file}.jpg`;
    }
  }
  return 'notes/maderas.jpg';
}

// 5. Canonical overrides for missing, empty or top-fidelity fragrances in DB
const OVERRIDES = {
  '343': {
    name: 'Sauvage Elixir',
    family: 'Aromática Especiada',
    accords: ['cálido especiado', 'amaderado', 'fresco especiado', 'lavanda', 'aromático'],
    topNotes: ['Canela', 'Nuez moscada', 'Cardamomo', 'Pomelo'],
    heartNotes: ['Lavanda'],
    baseNotes: ['Regaliz', 'Sándalo', 'Ámbar', 'Pachulí', 'Vetiver'],
    description: 'Una concentración nocturna desbordante y adictiva. Canela cálida y cardamomo salvaje colisionan con un corazón noble de lavanda de Nyons, envueltos en un fondo suntuoso de maderas ricas, regaliz y ámbar licoroso.'
  },
  '141': {
    name: 'Aqua Di Gio Profondo',
    family: 'Aromática Acuática',
    accords: ['marino', 'aromático', 'cítrico', 'fresco especiado', 'mineral'],
    topNotes: ['Notas marinas', 'Aquozone', 'Bergamota', 'Mandarina verde'],
    heartNotes: ['Romero', 'Lavanda', 'Ciprés', 'Lentisco'],
    baseNotes: ['Notas minerales', 'Almizcle', 'Pachulí', 'Ámbar'],
    description: 'Una inmersión profunda en la inmensidad del océano azul. Una explosión electrizante de notas marinas y cítricos vigorizantes combinados con la masculinidad aromática del romero y un fondo mineral envolvente.'
  },
  '192': {
    name: 'Club De Nuit Intense Man',
    family: 'Amaderada Especiada',
    accords: ['cítrico', 'afrutado', 'amaderado', 'ahumado', 'cuero'],
    topNotes: ['Limón', 'Piña', 'Bergamota', 'Grosellas negras', 'Manzana'],
    heartNotes: ['Abedul', 'Jazmín', 'Rosa'],
    baseNotes: ['Almizcle', 'Ámbar gris', 'Pachulí', 'Vainilla'],
    description: 'El icono definitivo del magnetismo y la presencia ejecutiva. Abre con un golpe crujiente de piña ahumada, grosellas y cítricos que evoluciona hacia un corazón ahumado de abedul y un lecho duradero de ámbar gris y almizcle.'
  },
  '240': {
    name: 'Good Girl',
    family: 'Ámbar Floral',
    accords: ['dulce', 'floral blanco', 'cálido especiado', 'avainillado', 'cacao'],
    topNotes: ['Almendra', 'Café', 'Bergamota', 'Limón'],
    heartNotes: ['Nardo', 'Jazmín sambac', 'Flor de azahar', 'Iris'],
    baseNotes: ['Haba tonka', 'Cacao', 'Vainilla', 'Praliné', 'Sándalo'],
    description: 'El desafío de la audacia femenina en su máxima expresión. La dualidad luminosa de las flores blancas de nardo y jazmín contrastada con la sensualidad oscura del café tostado, cacao puro y haba tonka.'
  },
  '266': {
    name: 'La Vie Est Belle',
    family: 'Floral Frutal Gourmand',
    accords: ['dulce', 'avainillado', 'afrutado', 'pachulí', 'floral'],
    topNotes: ['Grosellas negras', 'Pera'],
    heartNotes: ['Iris', 'Jazmín', 'Flor de azahar'],
    baseNotes: ['Praliné', 'Vainilla', 'Pachulí', 'Haba tonka'],
    description: 'Una oda luminosa y dulce a la alegría de vivir. Un majestuoso acorde de iris pálido entrelazado con azahar y jazmín, envuelto en una estela golosa de praliné artesanal, vainilla y pachulí noble.'
  },
  '270': {
    name: 'Libre',
    family: 'Ámbar Fougère Floral',
    accords: ['floral blanco', 'cítrico', 'lavanda', 'avainillado', 'aromático'],
    topNotes: ['Lavanda', 'Mandarina', 'Grosellas negras', 'Petitgrain'],
    heartNotes: ['Lavanda', 'Flor de azahar', 'Jazmín'],
    baseNotes: ['Vainilla de Madagascar', 'Almizcle', 'Cedro', 'Ámbar gris'],
    description: 'El manifiesto olfativo de la mujer que vive según sus propias reglas. La tensión ardiente entre la lavanda francesa tradicionalmente masculina y la flor de azahar marroquí ultra femenina con vainilla.'
  },
  '700': {
    name: 'Scandal',
    family: 'Chipre Floral Gourmand',
    accords: ['miel', 'dulce', 'floral blanco', 'cítrico', 'caramelo'],
    topNotes: ['Naranja sanguina', 'Mandarina'],
    heartNotes: ['Miel', 'Gardenia', 'Flor de azahar', 'Jazmín', 'Melocotón'],
    baseNotes: ['Cera de abeja', 'Caramelo', 'Pachulí', 'Regaliz'],
    description: 'Una provocación elegante, deliciosa y descarada. Una sobredosis adictiva de miel dorada y naranja sanguina que se funde en un corazón floral opulento sobre un lecho sensual de cera de abejas y caramelo.'
  },
  '718': {
    name: 'Scandal Pour Homme',
    family: 'Ámbar Amaderada Gourmand',
    accords: ['caramelo', 'aromático', 'avainillado', 'amaderado', 'dulce'],
    topNotes: ['Mandarina', 'Salvia esclarea'],
    heartNotes: ['Caramelo', 'Haba tonka'],
    baseNotes: ['Vetiver'],
    description: 'El rey del cuadrilátero, energizante y sumamente seductor. El contraste arrollador entre la salvia fresca y un corazón goloso de caramelo tostado y haba tonka sobre una base terrosa de vetiver.'
  },
  '341': {
    name: '212 VIP Men',
    family: 'Ámbar Amaderada',
    accords: ['vodka', 'aromático', 'fresco especiado', 'amaderado', 'cálido especiado'],
    topNotes: ['Maracuyá', 'Lima', 'Pimienta', 'Jengibre'],
    heartNotes: ['Vodka', 'Ginebra', 'Menta', 'Especias'],
    baseNotes: ['Ámbar', 'Cuero', 'Notas amaderadas'],
    description: 'El pase VIP a las noches más exclusivas e inolvidables. Una mezcla electrizante de fruta de la pasión con vodka helado y menta fresca, asentada sobre una base seductora de cuero y ámbar.'
  },
  '340': {
    name: '212 VIP Rose',
    family: 'Floral Frutal',
    accords: ['afrutado', 'dulce', 'floral', 'amaderado', 'fresco'],
    topNotes: ['Champán rosado', 'Frutas rojas'],
    heartNotes: ['Flor de durazno'],
    baseNotes: ['Notas amaderadas', 'Almizcle blanco', 'Ámbar'],
    description: 'El glamour, la sofisticación y el brillo de una celebración única. Efervescente salida de champán rosado y frutas rojas que da paso a un corazón aterciopelado de flor de durazno y maderas suaves.'
  },
  '251': {
    name: 'Invictus',
    family: 'Amaderada Acuática',
    accords: ['marino', 'cítrico', 'aromático', 'amaderado', 'ámbar'],
    topNotes: ['Notas marinas', 'Pomelo', 'Mandarina'],
    heartNotes: ['Hojas de laurel', 'Jazmín'],
    baseNotes: ['Ámbar gris', 'Madera de gaiac', 'Musgo de roble', 'Pachulí'],
    description: 'El aroma de la victoria heroica y el dinamismo indestructible. Una colisión fascinante entre la frescura salina del laurel y notas marinas con la sensualidad masculina de la madera de guayaco y el ámbar gris.'
  },
  '161': {
    name: 'Bleu De Chanel',
    family: 'Amaderada Aromática',
    accords: ['cítrico', 'ámbar', 'amaderado', 'cálido especiado', 'aromático'],
    topNotes: ['Pomelo', 'Limón', 'Menta', 'Pimienta rosa'],
    heartNotes: ['Jengibre', 'Nuez moscada', 'Jazmín', 'Iso E Super'],
    baseNotes: ['Incienso', 'Vetiver', 'Cedro', 'Sándalo', 'Pachulí'],
    description: 'Una creación aromática amaderada intemporal y sofisticada. Destaca por su salida vibrante de cítricos frescos y menta que da paso a un corazón especiado con jengibre y un fondo profundo de incienso, cedro y sándalo.'
  },
  '677': {
    name: 'Oud Wood',
    family: 'Ámbar Amaderada',
    accords: ['oud', 'amaderado', 'cálido especiado', 'balsámico', 'aromático'],
    topNotes: ['Palo de rosa', 'Cardamomo', 'Pimienta de Sichuan'],
    heartNotes: ['Oud', 'Sándalo', 'Vetiver'],
    baseNotes: ['Haba tonka', 'Vainilla', 'Ámbar'],
    description: 'Una de las composiciones más exclusivas y opulentas de la alta perfumería. Maderas raras de oud y sándalo se funden con la calidez del cardamomo y la dulzura envolvente del haba tonka y el ámbar.'
  },
  '679': {
    name: 'Santal 33',
    family: 'Amaderada Aromática',
    accords: ['amaderado', 'cuero', 'cálido especiado', 'atalcado', 'floral'],
    topNotes: ['Cardamomo', 'Iris', 'Violeta'],
    heartNotes: ['Papiro', 'Cedro', 'Cuero'],
    baseNotes: ['Sándalo', 'Ámbar', 'Notas amaderadas'],
    description: 'Una leyenda indiscutible de la perfumería contemporánea. Con un magnetismo ahumado y coriáceo, despliega sándalo australiano, cardamomo y papiro con sutiles acordes florales de iris y violeta.'
  },
  '256': {
    name: "Issey Miyake L'eau D'Issey",
    family: 'Amaderada Acuática',
    accords: ['cítrico', 'aromático', 'fresco especiado', 'acuático', 'amaderado'],
    topNotes: ['Yuzu', 'Limón', 'Bergamota', 'Mandarina', 'Ciprés'],
    heartNotes: ['Lirio de los valles', 'Nuez moscada', 'Loto azul', 'Canela'],
    baseNotes: ['Vetiver de Tahití', 'Almizcle', 'Cedro', 'Sándalo', 'Ámbar'],
    description: 'La quintaesencia de la frescura serena y cristalina. Una cascada vigorizante de yuzu japonés y cítricos nobles que fluye hacia un corazón especiado acuático y una base atemporal de cedro y vetiver.'
  },
  '257': {
    name: 'Jean Paul Gaultier Le Male',
    family: 'Ámbar Fougère',
    accords: ['avainillado', 'aromático', 'fresco especiado', 'cálido especiado', 'verde'],
    topNotes: ['Lavanda', 'Menta', 'Cardamomo', 'Bergamota'],
    heartNotes: ['Canela', 'Flor de azahar', 'Alcaravea'],
    baseNotes: ['Vainilla', 'Haba tonka', 'Ámbar', 'Sándalo', 'Cedro'],
    description: 'Un tributo legendario a la figura icónica y sensual del marinero. La frescura vibrante de la menta y la lavanda tradicional se funde magistralmente con la calidez de la canela, el azahar y una vainilla sedosa irresistible.'
  },
  '674': {
    name: 'Ombre Leather',
    family: 'Cuero Floral',
    accords: ['cuero', 'cálido especiado', 'amaderado', 'floral blanco', 'terroso'],
    topNotes: ['Cardamomo'],
    heartNotes: ['Cuero', 'Jazmín sambac'],
    baseNotes: ['Ámbar', 'Musgo', 'Pachulí'],
    description: 'Un viaje sensual al corazón del desierto nocturno. Cuero negro flexible e intenso envuelto en especias de cardamomo, flores blancas de jazmín salvaje y un fondo misterioso de ámbar y pachulí.'
  },
  '351': {
    name: 'Swiss Army Classic',
    family: 'Aromática Verde',
    accords: ['aromático', 'verde', 'fresco especiado', 'amaderado', 'cítrico'],
    topNotes: ['Menta', 'Bergamota', 'Yuzu', 'Notas verdes'],
    heartNotes: ['Romero', 'Lavanda', 'Hojas de violeta'],
    baseNotes: ['Ciprés', 'Cedro', 'Abeto', 'Almizcle'],
    description: 'La pureza estimulante de los Alpes suizos. Aire fresco de montaña protagonizado por hojas de menta, ciprés alpino y romero vigorizante, reposado sobre maderas alpinas limpias y duraderas.'
  },
  '323': {
    name: 'Polo Black',
    family: 'Amaderada Aromática',
    accords: ['afrutado', 'aromático', 'amaderado', 'cálido especiado', 'cítrico'],
    topNotes: ['Mango helado', 'Salvia'],
    heartNotes: ['Artemisia', 'Limón'],
    baseNotes: ['Pachulí negro', 'Sándalo', 'Haba tonka'],
    description: 'Una propuesta audaz, moderna y decididamente nocturna. El golpe jugoso del mango helado se contrasta con notas aromáticas de salvia española y un fondo profundo de sándalo y pachulí negro.'
  },
  '445': {
    name: 'Chance Chanel',
    family: 'Chipre Floral',
    accords: ['cítrico', 'floral blanco', 'pachulí', 'dulce', 'fresco especiado'],
    topNotes: ['Pimienta rosa', 'Piña', 'Iris', 'Pachulí'],
    heartNotes: ['Limón', 'Jazmín', 'Rosa'],
    baseNotes: ['Pachulí', 'Almizcle', 'Vainilla', 'Vetiver'],
    description: 'Un torbellino floral inesperado, optimista y radiante. Pimienta rosa y piña se entrelazan con la elegancia celestial del jazmín y la sensualidad atemporal del pachulí y la vainilla.'
  },
  '334': {
    name: 'Pour Homme Caron',
    family: 'Aromática Lavanda',
    accords: ['lavanda', 'avainillado', 'aromático', 'amaderado', 'fresco'],
    topNotes: ['Lavanda', 'Romero', 'Bergamota', 'Limón'],
    heartNotes: ['Salvia sclarea', 'Cedro', 'Rosa'],
    baseNotes: ['Vainilla', 'Almizcle', 'Haba tonka', 'Ámbar'],
    description: 'Una obra de arte clásica de la alta perfumería francesa. El diálogo poético entre la frescura silvestre de la lavanda fina de Provenza y la nobleza reconfortante de la vainilla dulce y el ámbar.'
  },
  '209': {
    name: 'Dior Homme Intense',
    family: 'Amaderada Floral Almizclada',
    accords: ['iris', 'amaderado', 'terroso', 'atalcado', 'aromático'],
    topNotes: ['Lavanda'],
    heartNotes: ['Iris de Toscana', 'Ambreta', 'Pera'],
    baseNotes: ['Cedro de Virginia', 'Vetiver'],
    description: 'El sumun de la elegancia masculina sofisticada. El iris noble de Toscana aporta una textura aterciopelada y sublime, enriquecida por la caricia afrutada de la ambreta y la firmeza del cedro de Virginia.'
  },
  '211': {
    name: 'Dolce Gabbana Pour Homme',
    family: 'Aromática Fougère',
    accords: ['cítrico', 'aromático', 'fresco especiado', 'lavanda', 'tabaco'],
    topNotes: ['Cítricos', 'Bergamota', 'Neroli', 'Mandarina'],
    heartNotes: ['Lavanda', 'Salvia', 'Pimienta'],
    baseNotes: ['Tabaco', 'Haba tonka', 'Cedro'],
    description: 'La esencia del hombre mediterráneo clásico: carismático, seguro y elegante. Salida luminosa de neroli y bergamota con corazón aromático de lavanda y un fondo varonil inconfundible de tabaco noble.'
  },
  '252': {
    name: 'Invictus Intense',
    family: 'Ámbar Amaderada',
    accords: ['ámbar', 'marino', 'cálido especiado', 'amaderado', 'dulce'],
    topNotes: ['Pimienta negra', 'Flor de azahar'],
    heartNotes: ['Laurel', 'Licor'],
    baseNotes: ['Ámbar gris', 'Ámbar negro', 'Sal'],
    description: 'El aroma del triunfo elevado a su máxima potencia. Una colisión ardiente entre la frescura salina del laurel y el azahar con notas licorosas embriagadoras sobre un lecho dorado de ámbar gris.'
  },
  '748': {
    name: 'Born in Roma Purple Melancholia',
    family: 'Amaderada Especiada',
    accords: ['amaderado', 'cálido especiado', 'aromático', 'avainillado', 'mineral'],
    topNotes: ['Pimienta rosa', 'Bergamota'],
    heartNotes: ['Lavanda', 'Salvia aromática'],
    baseNotes: ['Vainilla Bourbon', 'Vetiver ahumado', 'Maderas minerales'],
    description: 'Inspirada en Valentino Born in Roma. Una oda a la alta costura romana con contrastes fascinantes entre notas minerales frescas, acordes aromáticos de salvia y la intensidad envolvente de la vainilla Bourbon.'
  },
  '732': {
    name: 'MYSLF EDP',
    family: 'Floral Amaderada',
    accords: ['floral blanco', 'cítrico', 'amaderado', 'fresco', 'aromático'],
    topNotes: ['Bergamota de Calabria', 'Bergamota verde'],
    heartNotes: ['Flor de azahar del naranjo de Túnez'],
    baseNotes: ['Ambrofix', 'Pachulí'],
    description: 'Inspirada en MYSLF de Yves Saint Laurent. La afirmación moderna de la masculinidad auténtica. Una apertura chispeante de bergamota de Calabria complementada por un corazón floral radiante de azahar y maderas sensuales.'
  },
  '726': {
    name: 'Eros Eau de Parfum',
    family: 'Ámbar Amaderada',
    accords: ['aromático', 'cítrico', 'avainillado', 'amaderado', 'fresco especiado'],
    topNotes: ['Menta', 'Manzana acaramelada', 'Limón', 'Mandarina'],
    heartNotes: ['Ambroxan', 'Salvia esclarea', 'Geranio'],
    baseNotes: ['Vainilla', 'Cedro', 'Sándalo', 'Pachulí', 'Cuero'],
    description: 'Inspirada en Versace Eros EDP. Pasión desbordante y poder mitológico. Acordes frescos de menta crujiente y cáscara de limón que se funden en la sensualidad adictiva de la vainilla oriental y las maderas nobles.'
  },
  '727': {
    name: 'Eros Energy Eau de Parfum',
    family: 'Cítrica Aromática',
    accords: ['cítrico', 'aromático', 'fresco especiado', 'amaderado', 'almizclado'],
    topNotes: ['Limón italiano', 'Bergamota', 'Naranja sanguina', 'Lima', 'Pomelo', 'Mandarina'],
    heartNotes: ['Pimienta rosa', 'Grosellas negras', 'Ámbar blanco'],
    baseNotes: ['Pachulí', 'Almizcle', 'Musgo de roble'],
    description: 'Inspirada en Versace Eros Energy. Una explosión solar cítrica y vivificante que captura la alegría y el magnetismo de la costa mediterránea, impulsada por pimienta rosa y una base amaderada de almizcle.'
  }
};

// Merge canonical Fragrantica overrides
Object.assign(OVERRIDES, FRAGRANTICA_OVERRIDES);

function normalize(str) {
  return (str || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

// Progresión decreciente de pesos para acordes
const ACCORD_WEIGHTS = [100, 84, 70, 58, 48, 40, 32, 26];

const enrichedPerfumes = perfumes.map((p) => {
  const code = String(p.code).trim();
  const normRef = normalize(p.reference || p.name);

  // Check overrides first
  let profile = OVERRIDES[code];

  // If not in overrides, search in db by code or name
  if (!profile) {
    if (db[code]) {
      const entry = db[code];
      const hasNotes = (entry.topNotes && entry.topNotes.length > 0) ||
                       (entry.heartNotes && entry.heartNotes.length > 0) ||
                       (entry.baseNotes && entry.baseNotes.length > 0);
      if (hasNotes) {
        profile = entry;
      }
    }
  }

  if (!profile) {
    for (const [k, v] of Object.entries(db)) {
      const nContratipo = normalize(v.contratipo);
      const nOfficial = normalize(v.officialName);
      if (nContratipo === normRef || nOfficial === normRef) {
        const hasNotes = (v.topNotes && v.topNotes.length > 0) ||
                         (v.heartNotes && v.heartNotes.length > 0) ||
                         (v.baseNotes && v.baseNotes.length > 0);
        if (hasNotes) {
          profile = v;
          break;
        }
      }
    }
  }

  // If still no profile, fallback based on gender
  if (!profile) {
    const g = (p.gender || '').toLowerCase();
    const isDama = g.includes('dama') || g.includes('mujer');
    const isHombre = g.includes('caballero') || g.includes('hombre');

    profile = {
      family: p.olfactoryFamily || (isDama ? 'Floral Frutal Oriental' : isHombre ? 'Amaderada Aromática Fougère' : 'Ámbar Cítrica Unisex'),
      accords: isDama
        ? ['floral', 'dulce', 'afrutado', 'avainillado']
        : isHombre
        ? ['amaderado', 'aromático', 'fresco especiado', 'cítrico']
        : ['cítrico', 'aromático', 'amaderado', 'ámbar'],
      topNotes: isDama
        ? ['Bergamota', 'Pera jugosa', 'Mandarina']
        : isHombre
        ? ['Bergamota', 'Pimienta rosa', 'Toronja']
        : ['Bergamota', 'Limón', 'Notas verdes'],
      heartNotes: isDama
        ? ['Jazmín Sambac', 'Rosa', 'Flor de azahar']
        : isHombre
        ? ['Lavanda silvestre', 'Geranio', 'Pimienta']
        : ['Lavanda', 'Jazmín', 'Nuez moscada'],
      baseNotes: isDama
        ? ['Vainilla', 'Pachulí', 'Almizcle blanco']
        : isHombre
        ? ['Cedro', 'Vetiver', 'Ambroxan', 'Pachulí']
        : ['Cedro', 'Almizcle', 'Ámbar']
    };
  }

  // Ensure top, heart, base arrays are filled
  const topNotesRaw = (profile.topNotes && profile.topNotes.length > 0)
    ? profile.topNotes
    : ['Bergamota', 'Limón', 'Pimienta rosa'];
  const heartNotesRaw = (profile.heartNotes && profile.heartNotes.length > 0)
    ? profile.heartNotes
    : ['Lavanda', 'Jazmín', 'Geranio'];
  const baseNotesRaw = (profile.baseNotes && profile.baseNotes.length > 0)
    ? profile.baseNotes
    : ['Cedro', 'Vainilla', 'Pachulí'];

  // Map to objects with image
  const top = topNotesRaw.slice(0, 5).map(n => ({
    name: n,
    image: getNoteImageUrl(n)
  }));
  const heart = heartNotesRaw.slice(0, 5).map(n => ({
    name: n,
    image: getNoteImageUrl(n)
  }));
  const base = baseNotesRaw.slice(0, 5).map(n => ({
    name: n,
    image: getNoteImageUrl(n)
  }));

  // Build Accords
  const rawAccords = (profile.accords && profile.accords.length > 0)
    ? profile.accords
    : ['cítrico', 'amaderado', 'aromático', 'ámbar'];

  const accords = rawAccords.slice(0, 6).map((acc, idx) => {
    const color = getAccordColor(acc);
    return {
      name: acc,
      percentage: ACCORD_WEIGHTS[idx] || Math.max(20, 100 - idx * 14),
      bg: color.bg,
      text: color.text
    };
  });

  // Build sensory description
  let description = profile.description;
  if (!description || description.trim().length === 0) {
    const family = profile.family || p.olfactoryFamily || 'Fragancia Fina';
    const topStr = top.map(n => n.name).join(', ');
    const heartStr = heart.map(n => n.name).join(', ');
    const baseStr = base.map(n => n.name).join(', ');

    description = `Inspirada en ${p.reference || p.name} de ${p.brand}. Pertenece a la prestigiosa familia olfativa ${family}. Abre con un despliegue radiante de ${topStr.toLowerCase()}, revela un corazón fascinante de ${heartStr.toLowerCase()}, y perdura sobre un fondo suntuoso de ${baseStr.toLowerCase()}. Formulada con esencias de alta concentración para ofrecer una estela envolvente y una fijación superior.`;
  }

  return {
    ...p,
    olfactoryFamily: profile.family || p.olfactoryFamily,
    accords,
    pyramid: {
      top,
      heart,
      base
    },
    description
  };
});

// Save to perfumes.json
fs.writeFileSync(path.join(__dirname, '../perfumes.json'), JSON.stringify(enrichedPerfumes, null, 2), 'utf8');

// Save to catalog-data.js
const jsContent = `window.CATALOG_DATA = ${JSON.stringify(enrichedPerfumes, null, 2)};\n`;
fs.writeFileSync(path.join(__dirname, '../catalog-data.js'), jsContent, 'utf8');

console.log('Successfully enriched all', enrichedPerfumes.length, 'perfumes!');
console.log('Sample item 0:', JSON.stringify(enrichedPerfumes[0], null, 2));
