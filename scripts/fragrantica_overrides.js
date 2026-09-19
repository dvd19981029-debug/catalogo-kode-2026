const fs = require('fs');
const path = require('path');

// Dictionary of canonical Fragrantica data for the 51 fragrances
const FRAGRANTICA_OVERRIDES = {
  '286': {
    name: 'Le Male Elixir',
    family: 'Ámbar Fougère',
    accords: ['avainillado', 'dulce', 'miel', 'ámbar', 'cálido especiado', 'lavanda'],
    topNotes: ['Lavanda', 'Menta'],
    heartNotes: ['Vainilla', 'Benjuí'],
    baseNotes: ['Miel', 'Haba tonka', 'Tabaco'],
    description: 'Inspirada en Le Male Elixir de Jean Paul Gaultier. Una concentración ardiente y ultra sensual donde la menta fresca y la lavanda noble se funden en un corazón ardiente de benjuí y vainilla, culminando en un fondo adictivo de miel dorada, haba tonka y tabaco.'
  },
  '350': {
    name: 'Stronger With You',
    family: 'Aromática Fougère',
    accords: ['avainillado', 'dulce', 'aromático', 'cálido especiado', 'amaderado'],
    topNotes: ['Cardamomo', 'Pimienta rosa', 'Hojas de violeta', 'Menta'],
    heartNotes: ['Salvia', 'Melón', 'Piña', 'Lavanda', 'Canela'],
    baseNotes: ['Vainilla', 'Castaña', 'Cedro', 'Madera de gaiac', 'Amberwood'],
    description: 'Inspirada en Emporio Armani Stronger With You. Una fragancia magnética y contemporánea que abre con una fusión chispeante de cardamomo y pimienta rosa, evoluciona hacia un corazón aromático y frutal, y reposa sobre una base cálida y adictiva de castaña caramelizada y vainilla.'
  },
  '285': {
    name: 'Le Beau',
    family: 'Amaderada Aromática',
    accords: ['coco', 'avainillado', 'dulce', 'cítrico', 'lactónico', 'amaderado'],
    topNotes: ['Bergamota'],
    heartNotes: ['Madera de coco'],
    baseNotes: ['Haba tonka'],
    description: 'Inspirada en Le Beau de Jean Paul Gaultier. La tentación irresistible en el jardín del Edén. Una salida ultra fresca y enérgica de bergamota que abre paso a la sensualidad exótica y cremosa de la madera de coco sobre un fondo embriagador de haba tonka.'
  },
  '690': {
    name: 'Mandarin Sky',
    family: 'Cítrica Gourmand',
    accords: ['cítrico', 'dulce', 'caramelo', 'avainillado', 'ámbar', 'amaderado'],
    topNotes: ['Mandarina', 'Naranja', 'Azafrán', 'Salvia'],
    heartNotes: ['Caramelo', 'Haba tonka', 'Tagetes'],
    baseNotes: ['Ambroxan', 'Vetiver', 'Cedro'],
    description: 'Inspirada en Odyssey Mandarin Sky de Armaf. Un torrente radiante y goloso de mandarina jugosa y azafrán que se envuelve en un centro decadente de caramelo tostado y haba tonka, con una base envolvente y moderna de ambroxan y maderas nobles.'
  },
  '287': {
    name: 'Le Male Le Parfum',
    family: 'Ámbar Oriental',
    accords: ['avainillado', 'cálido especiado', 'aromático', 'lavanda', 'atalcado', 'amaderado'],
    topNotes: ['Cardamomo'],
    heartNotes: ['Lavanda', 'Iris'],
    baseNotes: ['Vainilla', 'Notas orientales', 'Haba tonka', 'Notas amaderadas'],
    description: 'Inspirada en Le Male Le Parfum de Jean Paul Gaultier. El liderazgo y magnetismo del capitán al mando. Una salida elegante de cardamomo especiado que contrasta con la finura atalcada del iris y la lavanda, asentada en un lecho cálido y aterciopelado de vainilla noble y maderas preciosas.'
  },
  '431': {
    name: 'Burberry Her',
    family: 'Floral Frutal Gourmand',
    accords: ['afrutado', 'dulce', 'amaderado', 'avainillado', 'almizclado', 'atalcado'],
    topNotes: ['Fresa', 'Frambuesa', 'Zarzamora', 'Cereza ácida', 'Mandarina'],
    heartNotes: ['Violeta', 'Jazmín'],
    baseNotes: ['Vainilla', 'Cashmeran', 'Almizcle', 'Ámbar', 'Musgo de roble'],
    description: 'Inspirada en Burberry Her de Burberry. El espíritu vibrante, libre y juvenil de la metrópoli londinense. Una explosión embriagadora de frutos rojos silvestres como fresa y zarzamora, entrelazados con un corazón elegante de jazmín y violeta sobre un fondo suave de vainilla, almizcle y ámbar.'
  },
  '216': {
    name: 'Eros Flame',
    family: 'Amaderada Especiada',
    accords: ['cítrico', 'cálido especiado', 'aromático', 'avainillado', 'amaderado', 'fresco especiado'],
    topNotes: ['Mandarina', 'Pimienta negra', 'Chinotto', 'Limón', 'Romero'],
    heartNotes: ['Pimienta', 'Geranio', 'Rosa'],
    baseNotes: ['Vainilla', 'Haba tonka', 'Cedro de Texas', 'Sándalo', 'Pachulí'],
    description: 'Inspirada en Eros Flame de Versace. La llama de la pasión ardiente y la seducción invencible. Contrastes intensos entre la frescura chispeante de la mandarina italiana y el chinotto con la calidez de la pimienta negra, el geranio y un fondo suntuoso de vainilla, cedro y haba tonka.'
  },
  '452': {
    name: 'Coco Chanel',
    family: 'Ámbar Especiada',
    accords: ['cálido especiado', 'ámbar', 'amaderado', 'dulce', 'atalcado', 'floral'],
    topNotes: ['Rosa de Bulgaria', 'Cilantro', 'Melocotón', 'Jazmín', 'Mandarina'],
    heartNotes: ['Clavo de olor', 'Rosa', 'Flor de azahar', 'Mimosa'],
    baseNotes: ['Ámbar', 'Sándalo', 'Haba tonka', 'Vainilla', 'Pachulí', 'Ládano'],
    description: 'Inspirada en Coco de Chanel. La máxima expresión del barroco olfativo y la elegancia eterna. Despliega un bouquet fastuoso de rosas y melocotón especiado con cilantro, un corazón ardiente de clavo y flor de azahar, y una base opulenta de ámbar cálido, sándalo y pachulí.'
  },
  '362': {
    name: 'Toy Boy',
    family: 'Amaderada Especiada',
    accords: ['rosas', 'cálido especiado', 'floral', 'amaderado', 'afrutado', 'aromático'],
    topNotes: ['Pimienta rosa', 'Pera', 'Nuez moscada', 'Elemí', 'Bergamota'],
    heartNotes: ['Rosa', 'Clavo de olor', 'Magnolia', 'Flor de lino'],
    baseNotes: ['Cashmeran', 'Vetiver de Haití', 'Sándalo', 'Ámbar'],
    description: 'Inspirada en Toy Boy de Moschino. Una reinterpretación rebelde, audaz e irónica de la elegancia masculina. Combina la frescura jugosa de la pera y la pimienta rosa con un corazón inesperado de rosa exquisita y clavo de olor sobre un fondo suntuoso de cashmeran y vetiver.'
  },
  '152': {
    name: 'Bad Boy',
    family: 'Ámbar Especiada',
    accords: ['cálido especiado', 'amaderado', 'cacao', 'avainillado', 'dulce', 'aromático'],
    topNotes: ['Pimienta blanca', 'Pimienta negra', 'Bergamota'],
    heartNotes: ['Salvia esclarea', 'Cedro'],
    baseNotes: ['Haba tonka', 'Cacao', 'Amberwood'],
    description: 'Inspirada en Bad Boy de Carolina Herrera. La fascinante dualidad del hombre audaz y contemporáneo. Un juego electrizante de luces y sombras entre el brillo de la bergamota y las pimientas blanca y negra, contrastado con la calidez seductora del cedro, cacao puro y haba tonka.'
  },
  '446': {
    name: 'Chanel 5',
    family: 'Floral Aldehídica',
    accords: ['aldehídico', 'atalcado', 'floral', 'amaderado', 'floral blanco', 'cítrico'],
    topNotes: ['Aldehídos', 'Ylang-ylang', 'Neroli', 'Bergamota', 'Melocotón'],
    heartNotes: ['Iris', 'Jazmín', 'Rosa', 'Lirio de los valles'],
    baseNotes: ['Sándalo', 'Vainilla', 'Almizcle', 'Vetiver', 'Pachulí'],
    description: 'Inspirada en Chanel N°5 de Chanel. La cumbre de la elegancia atemporal y la sofisticación femenina. Su mítica apertura de aldehídos brillantes e ylang-ylang da paso a un corazón imperial de jazmín de Grasse, rosa de mayo e iris, reposando en un lecho regio de sándalo y vainilla.'
  },
  '255': {
    name: 'Invictus Victory',
    family: 'Ámbar',
    accords: ['avainillado', 'ámbar', 'dulce', 'cálido especiado', 'aromático'],
    topNotes: ['Limón', 'Pimienta rosa'],
    heartNotes: ['Incienso de olíbano', 'Lavanda'],
    baseNotes: ['Vainilla', 'Haba tonka', 'Ámbar'],
    description: 'Inspirada en Invictus Victory de Paco Rabanne. La consagración del triunfo absoluto en un duelo aromático extremo. El frescor vivificante del limón y la pimienta rosa choca contra un corazón envolvente de incienso místico y lavanda, culminando en un fondo goloso de vainilla y haba tonka.'
  },
  '345': {
    name: 'Scandal Pour Homme',
    family: 'Ámbar Amaderada Gourmand',
    accords: ['caramelo', 'aromático', 'avainillado', 'amaderado', 'dulce'],
    topNotes: ['Mandarina', 'Salvia esclarea'],
    heartNotes: ['Caramelo', 'Haba tonka'],
    baseNotes: ['Vetiver'],
    description: 'Inspirada en Scandal Pour Homme de Jean Paul Gaultier. El rey indiscutible del cuadrilátero con un carisma arrollador. Un golpe maestro de energía con mandarina y salvia fresca que se funde en la tentación adictiva del caramelo tostado y haba tonka sobre una base masculina de vetiver.'
  },
  '132': {
    name: 'Absolu Aventus',
    family: 'Chipre Frutal',
    accords: ['cítrico', 'fresco especiado', 'afrutado', 'amaderado', 'cálido especiado', 'aromático'],
    topNotes: ['Pomelo', 'Bergamota', 'Grosellas negras', 'Limón'],
    heartNotes: ['Jengibre', 'Canela', 'Cardamomo', 'Piña'],
    baseNotes: ['Pimienta rosa', 'Pachulí', 'Vetiver', 'Musgo de roble'],
    description: 'Inspirada en Absolu Aventus de Creed. Una obra maestra aristocrática de intensidad desbordante. Abre con un estallido energizante de pomelo y grosellas negras, enriquecido por un corazón especiado y noble de jengibre y canela, sobre un fondo majestuoso de pachulí y vetiver ahumado.'
  },
  '315': {
    name: 'Phantom',
    family: 'Amaderada Aromática',
    accords: ['aromático', 'cítrico', 'avainillado', 'terroso', 'lavanda', 'dulce'],
    topNotes: ['Lavanda', 'Limón de Amalfi', 'Ralladura de limón'],
    heartNotes: ['Lavanda', 'Manzana', 'Humo', 'Notas terrosas', 'Pachulí'],
    baseNotes: ['Vainilla', 'Lavanda', 'Vetiver'],
    description: 'Inspirada en Phantom de Paco Rabanne. La esencia de la autoconfianza y la energía futurista. Una sobredosis electrizante de lavanda combinada con el brillo cítrico del limón italiano, un corazón fascinante con notas de manzana y humo, y un fondo cremoso de vainilla y vetiver.'
  },
  '692': {
    name: 'Imagination',
    family: 'Cítrica Aromática',
    accords: ['cítrico', 'ámbar', 'fresco especiado', 'aromático', 'verde', 'amaderado'],
    topNotes: ['Cidra', 'Bergamota de Calabria', 'Naranja de Sicilia'],
    heartNotes: ['Neroli de Túnez', 'Jengibre', 'Canela de Ceilán'],
    baseNotes: ['Té negro', 'Ambroxan', 'Madera de gaiac', 'Incienso'],
    description: 'Inspirada en Imagination de Louis Vuitton. El viaje infinito del espíritu creador. Una salida deslumbrante y cristalina de cítricos italianos da paso al fuego sutil del jengibre y la canela, concluyendo en un fondo sublime de té negro chino infusionado en ambroxan y maderas preciosas.'
  },
  '448': {
    name: 'Cloud',
    family: 'Floral Frutal Gourmand',
    accords: ['dulce', 'lactónico', 'avainillado', 'coco', 'afrutado', 'almizclado'],
    topNotes: ['Lavanda', 'Pera', 'Bergamota'],
    heartNotes: ['Crema batida', 'Praliné', 'Coco', 'Orquídea de vainilla'],
    baseNotes: ['Almizcle', 'Notas amaderadas'],
    description: 'Inspirada en Cloud de Ariana Grande. Una experiencia reconfortante y soñadora que evoca esponjosas nubes de felicidad. Una apertura delicada de lavanda y pera jugosa que se sumerge en un corazón goloso de crema batida, praliné y coco, descansando sobre almizcle cálido y maderas suaves.'
  },
  '1001': {
    name: 'Invictus Victory Elixir',
    family: 'Ámbar Amaderada',
    accords: ['avainillado', 'ámbar', 'cálido especiado', 'aromático', 'amaderado'],
    topNotes: ['Lavandín', 'Cardamomo', 'Pimienta negra'],
    heartNotes: ['Incienso', 'Pachulí'],
    baseNotes: ['Vainilla', 'Haba tonka'],
    description: 'Inspirada en Invictus Victory Elixir de Paco Rabanne. La cúspide de la intensidad para el vencedor legendario. Notas especiadas de cardamomo y pimienta negra despiertan los sentidos, entrelazadas con un corazón místico de incienso y pachulí sobre un lecho embriagador de vainilla y tonka.'
  },
  '701': {
    name: 'Le Beau Paradise Garden',
    family: 'Amaderada Acuática',
    accords: ['dulce', 'coco', 'verde', 'acuático', 'fresco', 'aromático'],
    topNotes: ['Notas acuáticas', 'Menta', 'Jengibre', 'Notas verdes'],
    heartNotes: ['Coco', 'Higo', 'Sal'],
    baseNotes: ['Haba tonka', 'Sándalo'],
    description: 'Inspirada en Le Beau Paradise Garden de Jean Paul Gaultier. Un edén apasionado de frescura salvaje y tentación tropical. Una explosión acuática y verde con menta crujiente que revela la pulpa deliciosa del higo y el coco salado, asentada en la calidez noble del sándalo y la tonka.'
  },
  '417': {
    name: 'Be Delicious',
    family: 'Floral Frutal',
    accords: ['verde', 'afrutado', 'acuático', 'fresco', 'floral', 'cítrico'],
    topNotes: ['Pepino', 'Pomelo', 'Magnolia'],
    heartNotes: ['Manzana verde', 'Lirio de los valles', 'Nardo', 'Violeta', 'Rosa'],
    baseNotes: ['Notas amaderadas', 'Sándalo', 'Ámbar'],
    description: 'Inspirada en DKNY Be Delicious de Donna Karan. El icónico mordisco crujiente a la Gran Manzana. Frescura chispeante de pepino y pomelo que abre camino al corazón inconfundible de manzana verde fresca y flores acuáticas, sobre una base equilibrada de maderas claras y ámbar suave.'
  },
  '670': {
    name: 'Lost Cherry',
    family: 'Ámbar Floral',
    accords: ['cereza', 'dulce', 'almendra', 'avainillado', 'amaderado', 'cálido especiado'],
    topNotes: ['Cereza ácida', 'Almendra amarga', 'Licor'],
    heartNotes: ['Cereza ácida', 'Ciruela', 'Rosa turca', 'Jazmín sambac'],
    baseNotes: ['Haba tonka', 'Vainilla', 'Bálsamo del Perú', 'Canela', 'Sándalo', 'Cedro'],
    description: 'Inspirada en Lost Cherry de Tom Ford. Un viaje suntuoso a lo prohibido donde la inocencia colisiona con la indulgencia. Cerezas negras maduras maceradas en licor y almendra amarga que dan paso a un corazón floral opulento y una base arrebatadora de haba tonka, canela y bálsamo del Perú.'
  },
  '293': {
    name: 'Light Blue Intense',
    family: 'Amaderada Acuática',
    accords: ['cítrico', 'marino', 'aromático', 'fresco especiado', 'amaderado', 'salado'],
    topNotes: ['Pomelo', 'Mandarina'],
    heartNotes: ['Agua marina', 'Enebro de Virginia'],
    baseNotes: ['Almizcle', 'Amberwood'],
    description: 'Inspirada en Light Blue Eau Intense Pour Homme de Dolce & Gabbana. La frescura magnética del Mediterráneo en su versión más potente. Abre con toronja helada y mandarina jugosa, dando paso a una ola marina revitalizante con enebro sobre un fondo duradero y sensual de amberwood y almizcle.'
  },
  '519': {
    name: 'Idole',
    family: 'Chipre Floral',
    accords: ['floral', 'rosas', 'afrutado', 'almizclado', 'fresco', 'dulce'],
    topNotes: ['Pera', 'Bergamota', 'Pimienta rosa'],
    heartNotes: ['Rosa de mayo', 'Rosa turca', 'Jazmín de la India'],
    baseNotes: ['Almizcle blanco', 'Vainilla', 'Cedro', 'Pachulí'],
    description: 'Inspirada en Idôle de Lancôme. El aura radiante de las mujeres que conquistan su propio destino. Una apertura luminosa de pera jugosa y bergamota que da paso a un corazón sublime de rosas nobles y jazmín puro, reposando sobre un lecho limpio y envolvente de almizcle blanco y vainilla.'
  },
  '617': {
    name: 'Scandal',
    family: 'Chipre Floral Gourmand',
    accords: ['miel', 'dulce', 'floral blanco', 'cítrico', 'caramelo'],
    topNotes: ['Naranja sanguina', 'Mandarina'],
    heartNotes: ['Miel', 'Gardenia', 'Flor de azahar', 'Jazmín', 'Melocotón'],
    baseNotes: ['Cera de abeja', 'Caramelo', 'Pachulí', 'Regaliz'],
    description: 'Inspirada en Scandal de Jean Paul Gaultier. Una provocación elegante, deliciosa y descarada. Una sobredosis adictiva de miel dorada y naranja sanguina que se funde en un corazón floral opulento sobre un lecho sensual de cera de abejas y caramelo.'
  },
  '719': {
    name: "L'Immensité",
    family: 'Ámbar Especiada',
    accords: ['cítrico', 'fresco especiado', 'aromático', 'ámbar', 'acuático', 'amaderado'],
    topNotes: ['Pomelo', 'Jengibre', 'Bergamota'],
    heartNotes: ['Notas acuáticas', 'Salvia', 'Romero', 'Geranio'],
    baseNotes: ['Ambroxan', 'Ámbar', 'Ládano'],
    description: 'Inspirada en L\'Immensité de Louis Vuitton. Una oda a los horizontes infinitos y la libertad interior. La frescura cortante y revitalizante del jengibre y el pomelo se funde con acordes marinos y aromáticos, anclados en la calidez majestuosa del ámbar y el ambroxan.'
  },
  '254': {
    name: 'Invictus Platinum',
    family: 'Amaderada Aromática',
    accords: ['aromático', 'fresco', 'amaderado', 'cítrico', 'verde'],
    topNotes: ['Absenta', 'Pomelo'],
    heartNotes: ['Menta', 'Lavanda'],
    baseNotes: ['Ciprés', 'Pachulí'],
    description: 'Inspirada en Invictus Platinum de Paco Rabanne. El triunfo de los desafiantes implacables. Una sacudida vibrante de absenta vigorizante y pomelo fresco que desata un corazón helado de menta y lavanda, sellado por la fuerza imponente del ciprés y el pachulí.'
  },
  '295': {
    name: 'Luna Rossa Carbon',
    family: 'Aromática Fougère',
    accords: ['fresco especiado', 'aromático', 'lavanda', 'metálico', 'cítrico', 'ámbar'],
    topNotes: ['Bergamota', 'Pimienta'],
    heartNotes: ['Lavanda', 'Notas metálicas', 'Carbón', 'Notas acuosas'],
    baseNotes: ['Ambroxan', 'Pachulí'],
    description: 'Inspirada en Luna Rossa Carbon de Prada. La colisión perfecta entre la naturaleza botánica y la ingeniería de vanguardia. La bergamota italiana y la pimienta dialogan con un corazón mineral de lavanda, carbón y acordes metálicos, sostenidos por una base pulcra de ambroxan.'
  },
  '317': {
    name: 'Phantom Parfum',
    family: 'Aromática Fougère',
    accords: ['aromático', 'avainillado', 'cálido especiado', 'amaderado', 'dulce', 'cítrico'],
    topNotes: ['Cardamomo', 'Ruibarbo', 'Limón', 'Bergamota'],
    heartNotes: ['Lavanda', 'Pachulí', 'Cedro', 'Geranio'],
    baseNotes: ['Vainilla', 'Bálsamo de Tolú', 'Vetiver'],
    description: 'Inspirada en Phantom Parfum de Paco Rabanne. La faceta nocturna, seductora e indómita de la masculinidad moderna. Abre con el frescor punzante del cardamomo y ruibarbo, transiciona a un corazón aromático y oscuro de lavanda y pachulí, reposando sobre una base licorosa de vainilla y bálsamo de Tolú.'
  },
  '678': {
    name: 'Red Tobacco',
    family: 'Amaderada Especiada',
    accords: ['tabaco', 'cálido especiado', 'dulce', 'avainillado', 'amaderado', 'ámbar'],
    topNotes: ['Canela', 'Madera de oud', 'Incienso', 'Azafrán', 'Nuez moscada', 'Manzana verde'],
    heartNotes: ['Pachulí', 'Jazmín'],
    baseNotes: ['Tabaco', 'Vainilla de Madagascar', 'Ámbar', 'Madera de gaiac', 'Sándalo'],
    description: 'Inspirada en Red Tobacco de Mancera. Un torbellino incandescente y opulentamente embriagador. Una explosión inicial de canela cálida, oud precioso y azafrán que evoluciona hacia un corazón sutil de pachulí y un fondo magistral de hojas de tabaco rubio, vainilla y maderas exóticas.'
  },
  '729': {
    name: 'Le beau Le Parfum',
    family: 'Ámbar Amaderada',
    accords: ['coco', 'avainillado', 'dulce', 'amaderado', 'tropical', 'ámbar'],
    topNotes: ['Piña', 'Iris', 'Ciprés', 'Jengibre'],
    heartNotes: ['Coco', 'Notas amaderadas'],
    baseNotes: ['Haba tonka', 'Sándalo', 'Ámbar', 'Ámbar gris'],
    description: 'Inspirada en Le Beau Le Parfum de Jean Paul Gaultier. La fruta prohibida elevada a su máxima intensidad y opulencia. Abre con una explosión tropical y exótica de piña y jengibre combinados con la finura del iris, revelando un corazón irresistible de coco sobre un lecho dorado de sándalo y tonka.'
  },
  '590': {
    name: 'Perfect',
    family: 'Ámbar Floral',
    accords: ['afrutado', 'verde', 'almendra', 'dulce', 'floral', 'amaderado'],
    topNotes: ['Ruibarbo', 'Narciso'],
    heartNotes: ['Leche de almendras'],
    baseNotes: ['Cashmeran', 'Cedro'],
    description: 'Inspirada en Perfect de Marc Jacobs. Una celebración luminosa de la autenticidad y el amor propio. El contraste jugoso y crujiente del ruibarbo y el narciso silvestre se suaviza con un corazón reconfortante y aterciopelado de leche de almendras sobre un fondo moderno de cashmeran.'
  },
  '720': {
    name: 'Stronger With You Intensely',
    family: 'Ámbar Fougère',
    accords: ['dulce', 'avainillado', 'cálido especiado', 'amaderado', 'canela', 'ámbar'],
    topNotes: ['Pimienta rosa', 'Enebro', 'Violeta'],
    heartNotes: ['Castaña', 'Canela', 'Lavanda', 'Salvia'],
    baseNotes: ['Vainilla', 'Haba tonka', 'Amberwood', 'Gamuza'],
    description: 'Inspirada en Emporio Armani Stronger With You Intensely. El testimonio de un amor apasionado y desbordante. Salida especiada con pimienta rosa que da paso a un corazón adictivo de castaña tostada, canela ardiente y salvia, asentada en una base opulenta de vainilla, tonka y gamuza suave.'
  },
  '682': {
    name: 'Toy 2 Pearl',
    family: 'Floral Frutal',
    accords: ['cítrico', 'fresco', 'floral', 'aromático', 'amaderado', 'marino'],
    topNotes: ['Limón', 'Sorbete', 'Orégano'],
    heartNotes: ['Arena', 'Fresia', 'Jazmín'],
    baseNotes: ['Ciprés', 'Almizcle', 'Vetiver'],
    description: 'Inspirada en Toy 2 Pearl de Moschino. Un destello iridiscente de frescura mediterránea y diversión despreocupada. Notas chispeantes de sorbete de limón y orégano aromático dan paso a un corazón solar de arena y fresia, descansando sobre un fondo marino y limpio de ciprés y almizcle.'
  },
  '702': {
    name: 'Le Beau Eau de Parfum',
    family: 'Ámbar Amaderada',
    accords: ['coco', 'avainillado', 'dulce', 'amaderado', 'tropical', 'ámbar'],
    topNotes: ['Piña', 'Iris', 'Ciprés', 'Jengibre'],
    heartNotes: ['Coco', 'Notas amaderadas'],
    baseNotes: ['Haba tonka', 'Sándalo', 'Ámbar'],
    description: 'Inspirada en Le Beau Eau de Parfum de Jean Paul Gaultier. Intensidad salvaje y sensualidad tropical desbordante. Salida exótica de piña madura y jengibre que da paso al emblemático corazón de madera de coco, reposando sobre un fondo rico y duradero de haba tonka y sándalo.'
  },
  '716': {
    name: 'Boss Bottled Parfum',
    family: 'Cuero Amaderada',
    accords: ['amaderado', 'cuero', 'cálido especiado', 'ahumado', 'iris', 'cítrico'],
    topNotes: ['Incienso de olíbano', 'Mandarina'],
    heartNotes: ['Higo', 'Raíz de lirio'],
    baseNotes: ['Cuero', 'Cedro'],
    description: 'Inspirada en Boss Bottled Parfum de Hugo Boss. La personificación de la elegancia madura y la autoridad indiscutible. Abre con notas misteriosas de incienso místico y mandarina noble, revelando un corazón majestuoso de madera de higuera e iris, asentado en una base viril de cuero y cedro.'
  },
  '722': {
    name: 'I Want Choo',
    family: 'Ámbar Floral',
    accords: ['avainillado', 'floral blanco', 'afrutado', 'dulce', 'cítrico'],
    topNotes: ['Melocotón', 'Mandarina'],
    heartNotes: ['Jazmín', 'Lirio rojo'],
    baseNotes: ['Vainilla'],
    description: 'Inspirada en I Want Choo de Jimmy Choo. La oda definitiva al glamour, la seducción y las noches de fiesta inolvidables. La salida chispeante y jugosa del durazno aterciopelado y la mandarina se une a la fascinación floral del jazmín y el lirio rojo sobre una base adictiva de vainilla.'
  },
  '402': {
    name: 'Alien',
    family: 'Ámbar Amaderada',
    accords: ['floral blanco', 'ámbar', 'amaderado', 'cálido especiado', 'almizclado'],
    topNotes: ['Jazmín sambac'],
    heartNotes: ['Madera de cashmeran'],
    baseNotes: ['Ámbar blanco'],
    description: 'Inspirada en Alien de Mugler. Una fragancia mística y magnética que irradia una energía solar cautivadora. Compuesta por la opulencia luminosa del jazmín sambac de la India, la sensualidad envolvente de la madera de cashmeran y un fondo sagrado de ámbar blanco.'
  },
  '548': {
    name: 'Libre Intense',
    family: 'Ámbar Fougère',
    accords: ['avainillado', 'floral blanco', 'dulce', 'lavanda', 'cítrico', 'ámbar'],
    topNotes: ['Lavanda', 'Mandarina', 'Bergamota'],
    heartNotes: ['Lavanda', 'Flor de azahar', 'Jazmín sambac', 'Orquídea'],
    baseNotes: ['Vainilla de Madagascar', 'Haba tonka', 'Ámbar gris', 'Vetiver'],
    description: 'Inspirada en Libre Intense de Yves Saint Laurent. La llamada ardiente a la libertad sin concesiones. La tensión icónica entre la lavanda francesa y la flor de azahar marroquí se enciende con un corazón salvaje de orquídea viva y un fondo suntuoso de vainilla de Madagascar y haba tonka.'
  },
  '569': {
    name: 'My Way',
    family: 'Floral',
    accords: ['floral blanco', 'nardo', 'cítrico', 'avainillado', 'almizclado', 'floral'],
    topNotes: ['Flor de azahar', 'Bergamota de Calabria'],
    heartNotes: ['Nardos', 'Jazmín de la India'],
    baseNotes: ['Vainilla de Madagascar', 'Almizcle blanco', 'Cedro de Virginia'],
    description: 'Inspirada en My Way de Giorgio Armani. Un viaje olfativo de descubrimientos y conexiones auténticas. La salida radiante de bergamota y azahar se abre paso hacia un corazón opulento de nardos cosechados a mano y jazmín puro, descansando sobre la dulzura cremosa de la vainilla y almizcles.'
  },
  '637': {
    name: 'Toy 2',
    family: 'Almizcle Floral Amaderado',
    accords: ['afrutado', 'floral', 'fresco', 'cítrico', 'almizclado', 'dulce'],
    topNotes: ['Manzana Granny Smith', 'Mandarina', 'Magnolia'],
    heartNotes: ['Grosella blanca', 'Peonía', 'Jazmín'],
    baseNotes: ['Almizcle', 'Amberwood', 'Sándalo'],
    description: 'Inspirada en Toy 2 de Moschino. Una creación chispeante, alegre y deliciosamente adictiva. La frescura crujiente de la manzana Granny Smith y la mandarina armonizan con un bouquet femenino de peonía y magnolia, concluyendo en la pureza suave del almizcle y el sándalo.'
  },
  '641': {
    name: 'Very Good Glam',
    family: 'Floral Frutal',
    accords: ['cereza', 'dulce', 'almendra', 'avainillado', 'rosas', 'afrutado'],
    topNotes: ['Cereza ácida', 'Almendra amarga'],
    heartNotes: ['Rosa', 'Azucena'],
    baseNotes: ['Vainilla Bourbon', 'Vetiver'],
    description: 'Inspirada en Very Good Girl Glam de Carolina Herrera. Un tributo resplandeciente al poder de la feminidad intrépida. Una salida deslumbrante de cereza negra ácida y almendra amarga que se funde en un corazón elegante de agua de rosas y azucena, coronado por vainilla Bourbon y vetiver.'
  },
  '672': {
    name: 'Naxos',
    family: 'Cítrica Gourmand',
    accords: ['dulce', 'miel', 'tabaco', 'avainillado', 'cítrico', 'lavanda'],
    topNotes: ['Lavanda', 'Bergamota', 'Limón'],
    heartNotes: ['Miel', 'Canela', 'Cashmeran', 'Jazmín sambac'],
    baseNotes: ['Hojas de tabaco', 'Haba tonka', 'Vainilla'],
    description: 'Inspirada en XJ 1861 Naxos de Xerjoff. Un homenaje apasionado al corazón mediterráneo de Sicilia. El frescor noble de la lavanda y los cítricos italianos se rinde ante la calidez exuberante de la miel dorada y la canela, cerrando con un fondo magistral de hojas de tabaco y vainilla pura.'
  },
  '699': {
    name: 'The Scent Elixir',
    family: 'Ámbar Amaderada Cuero',
    accords: ['cálido especiado', 'lavanda', 'amaderado', 'aromático', 'fresco especiado'],
    topNotes: ['Pimiento rojo', 'Mandarina'],
    heartNotes: ['Lavandín'],
    baseNotes: ['Sándalo'],
    description: 'Inspirada en Boss The Scent Elixir for Him de Hugo Boss. La culminación de la intensidad magnética y la seducción profunda. Una salida picante y ardiente de pimiento rojo que enciende el corazón noble de absoluto de lavandín, asentada sobre un lecho rico y cremoso de madera de sándalo.'
  },
  '712': {
    name: 'God of Fire',
    family: 'Ámbar Amaderada',
    accords: ['afrutado', 'tropical', 'dulce', 'amaderado', 'cítrico', 'ámbar'],
    topNotes: ['Mango', 'Limón', 'Pimienta rosa', 'Jengibre'],
    heartNotes: ['Cumarina', 'Jazmín', 'Cedro'],
    baseNotes: ['Oud', 'Cipriol', 'Ámbar', 'Almizcle'],
    description: 'Inspirada en God of Fire de Stéphane Humbert Lucas 777. Inspirada en la deidad azteca Xiuhtecuhtli. Una explosión fulgurante de mango jugoso tropical y jengibre chispeante que muta en un corazón místico de maderas secas, finalizando en un fondo sobrecogedor de oud, cipriol y ámbar cálido.'
  },
  '791': {
    name: 'Ombre Nomade',
    family: 'Ámbar Amaderada',
    accords: ['oud', 'amaderado', 'cálido especiado', 'ahumado', 'rosas', 'cuero'],
    topNotes: ['Frambuesa', 'Azafrán'],
    heartNotes: ['Oud', 'Rosa', 'Incienso'],
    baseNotes: ['Ámbar gris', 'Benjuí', 'Abedul'],
    description: 'Inspirada en Ombre Nomade de Louis Vuitton. Un viaje místico y ardiente al corazón infinito del desierto. Una estela opulenta de madera de oud de Asam y notas ahumadas de incienso, acariciadas por la dulzura de la frambuesa silvestre y un lecho majestuoso de benjuí y ámbar gris.'
  },
  '820': {
    name: 'Afternoon Swim',
    family: 'Cítrica',
    accords: ['cítrico', 'fresco', 'aromático', 'fresco especiado', 'acuático'],
    topNotes: ['Mandarina', 'Naranja', 'Bergamota'],
    heartNotes: ['Jengibre'],
    baseNotes: ['Ámbar gris'],
    description: 'Inspirada en Afternoon Swim de Louis Vuitton. Una inmersión radiante en un océano de pura energía solar. Un torrente vitamínico y ultra refrescante de mandarina de Sicilia, naranja y bergamota, realzado con un toque chispeante de jengibre fresco sobre un fondo salino y limpio de ámbar gris.'
  },
  '195': {
    name: 'CR7',
    family: 'Aromática Fougère',
    accords: ['aromático', 'cálido especiado', 'amaderado', 'avainillado', 'tabaco', 'fresco especiado'],
    topNotes: ['Lavanda', 'Cardamomo', 'Bergamota', 'Artemisia'],
    heartNotes: ['Tabaco', 'Canela', 'Cedro', 'Iris'],
    baseNotes: ['Vainilla', 'Almizcle', 'Sándalo', 'Ámbar'],
    description: 'Inspirada en CR7 de Cristiano Ronaldo. La fragancia dinámica y carismática para el hombre que persigue el triunfo. Una apertura fresca y vigorizante de lavanda y cardamomo que evoluciona hacia un corazón especiado y masculino de tabaco rubio y canela, sobre un fondo cálido de sándalo y vainilla.'
  },
  '332': {
    name: 'Polo Ultra Blue',
    family: 'Aromática Cítrica',
    accords: ['cítrico', 'aromático', 'marino', 'mineral', 'fresco', 'amaderado'],
    topNotes: ['Cidra', 'Limón', 'Hierba luisa', 'Albahaca'],
    heartNotes: ['Notas minerales', 'Amberwood'],
    baseNotes: ['Sal', 'Almizcle', 'Notas amaderadas'],
    description: 'Inspirada en Polo Ultra Blue de Ralph Lauren. El culmen de la frescura marina ultra deportiva y tonificante. Cítricos vibrantes como la cidra y el limón combinados con hierba luisa abren paso a un corazón mineral electrizante, sellado con un acorde salino y maderas limpias.'
  },
  '428': {
    name: 'Born in Roma',
    family: 'Ámbar Floral',
    accords: ['avainillado', 'amaderado', 'afrutado', 'floral blanco', 'cálido especiado'],
    topNotes: ['Grosellas negras', 'Pimienta rosa', 'Bergamota'],
    heartNotes: ['Jazmín sambac', 'Jazmín', 'Té de jazmín'],
    baseNotes: ['Vainilla Bourbon', 'Cashmeran', 'Madera de gaiac'],
    description: 'Inspirada en Valentino Donna Born In Roma. La celebración de la alta costura romana y la elegancia contemporánea. Salida crujiente de grosellas negras y pimienta rosa entrelazada con tres variedades nobles de jazmín, envueltas en una suntuosa sobredosis de vainilla Bourbon y cashmeran.'
  },
  '708': {
    name: 'Born in Roma Donna',
    family: 'Ámbar Floral',
    accords: ['avainillado', 'amaderado', 'afrutado', 'floral blanco', 'cálido especiado'],
    topNotes: ['Grosellas negras', 'Pimienta rosa', 'Bergamota'],
    heartNotes: ['Jazmín sambac', 'Jazmín', 'Té de jazmín'],
    baseNotes: ['Vainilla Bourbon', 'Cashmeran', 'Madera de gaiac'],
    description: 'Inspirada en Valentino Donna Born In Roma. La celebración de la alta costura romana y la elegancia contemporánea. Salida crujiente de grosellas negras y pimienta rosa entrelazada con tres variedades nobles de jazmín, envueltas en una suntuosa sobredosis de vainilla Bourbon y cashmeran.'
  },
  '711': {
    name: 'Born in Roma Coral Fantasy',
    family: 'Amaderada Aromática',
    accords: ['afrutado', 'cálido especiado', 'aromático', 'tabaco', 'amaderado', 'dulce'],
    topNotes: ['Manzana roja', 'Cardamomo', 'Bergamota de Calabria'],
    heartNotes: ['Lavanda', 'Salvia esclarea', 'Geranio bourbon'],
    baseNotes: ['Hojas de tabaco', 'Pachulí', 'Vetiver'],
    description: 'Inspirada en Valentino Uomo Born In Roma Coral Fantasy. Inspirada en la hora dorada sobre la ciudad eterna de Roma. Un acorde vibrante de manzana roja crujiente y cardamomo que da paso a la masculinidad aromática de la salvia y la lavanda, concluyendo en un fondo cautivador de hojas de tabaco y vetiver.'
  }
};

module.exports = { FRAGRANTICA_OVERRIDES };
