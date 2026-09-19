// ==========================================================================
// KÖDE — TEST DE PERFUME IDEAL & ZODIACO OLFATIVO (PERFUME-QUIZ.JS)
// ==========================================================================

(function() {
  'use strict';

  // Base de datos de Arquetipos y Lecturas Zodiacales Olfativas para los Top Sellers
  const ARCHETYPES_DB = {
    '343': {
      archetype: 'Fuego Magnético • El Conquistador Alfa',
      element: 'Fuego Nocturno 🔥',
      personality: 'Tu presencia no pide permiso, domina el espacio. Tienes una personalidad intensa, decidida y con un magnetismo oscuro que intriga a los demás. No sigues tendencias, las creas.',
      matchWhy: 'Elegiste proyectar una vibra de poder y magnetismo nocturno. La colisión de canela ardiente, cardamomo salvaje y regaliz con lavanda pura de Nyons es la fórmula más arrolladora y comentada del catálogo.'
    },
    '161': {
      archetype: 'Zafiro Impecable • El Aristócrata Urbano',
      element: 'Éter & Madera Azul 💎',
      personality: 'Irradias esa confianza tranquila del que sabe exactamente lo que vale sin necesidad de presumir. Posees un encanto natural, elegancia sobria y un radar infalible para el buen gusto.',
      matchWhy: 'Buscabas sofisticación y versatilidad de alto nivel. Los cítricos limpios con corazón de incienso, cedro y sándalo te brindan esa aura de lujo silencioso que funciona tanto en la oficina como en una cena exclusiva.'
    },
    '344': {
      archetype: 'Tormenta Solar • El Carisma Indomable',
      element: 'Aire Eléctrico ⚡',
      personality: 'Tienes un aura vibrante que contagia energía al instante. Espontáneo, seguro de ti mismo y con una chispa magnética que arranca cumplidos dondequiera que pongas un pie.',
      matchWhy: 'Buscabas una firma todoterreno con estela salvaje y cumplidos garantizados. La bergamota de Calabria con pimienta de Sichuan y ambroxan es la bomba de cumplidos más probada del mundo.'
    },
    '165': {
      archetype: 'Rebelde Sofisticado • La Vanguardia Romana',
      element: 'Ámbar Mineral 🏛️',
      personality: 'Mezclas la elegancia clásica con un toque audaz y contemporáneo. Llamas la atención por tu estilo propio, carisma fresco y autenticidad sin esfuerzo.',
      matchWhy: 'Buscabas un aroma moderno y seductor. Sus hojas de violeta con jengibre picante y vetiver ahumado dan ese toque vanguardista y cosmopolita que te hace inolvidable.'
    },
    '141': {
      archetype: 'Abismo Marino • La Fuerza Invencible',
      element: 'Agua de Alta Mar 🌊',
      personality: 'Tu vibra es fresca, dinámica y atlética. Transmites serenidad y poder al mismo tiempo, como una marea profunda que avanza con seguridad inquebrantable.',
      matchWhy: 'Buscabas frescura vigorizante y energía limpia para el día a día. Sus notas marinas minerales con bergamota verde y romero proyectan una sensación de pulcritud y libertad que revitaliza todo a su paso.'
    },
    '140': {
      archetype: 'Brisa Mediterránea • La Elegancia Vital',
      element: 'Agua Cristalina ☀️',
      personality: 'Eres pura frescura, luz y accesibilidad. La gente se siente cómoda y atraída por tu vibra relajada, pulcra y optimista.',
      matchWhy: 'Buscabas un clásico marino ligero y fresco para todos los días. Sus notas acuáticas y cítricas son el estándar de oro de la limpieza y la frescura masculina.'
    },
    '149': {
      archetype: 'Emperador Dorado • La Visión del Triunfador',
      element: 'Madera Imperial 👑',
      personality: 'Naciste para liderar y conquistar metas grandes. Tienes un porte distinguido, seguridad imperturbable y una ambición elegante que inspira respeto inmediato.',
      matchWhy: 'Buscabas proyectar éxito, liderazgo y distinción ejecutiva. La legendaria piña ahumada con abedul negro, grosellas y almizcle noble es el estandarte olfativo del éxito mundial.'
    },
    '286': {
      archetype: 'Miel Dorada • El Seductor Insaciable',
      element: 'Fuego Dulce 🍯',
      personality: 'Peligrosamente adictivo. Tienes un encanto pícaro y cálido que hace que la gente quiera quedarse cerca de ti. Tu vibra es de miradas intensas y complicidad inmediata.',
      matchWhy: 'Buscabas máxima seducción para citas y noches especiales. Su combinación ultra adictiva de miel dorada, haba tonka, lavanda y vainilla licorosa es un verdadero imán de atracción de cerca.'
    },
    '350': {
      archetype: 'Abrazo Eterno • La Pasión Envolvente',
      element: 'Fuego Ambarino 🍂',
      personality: 'Cálido, protector y magnético. Eres de las personas cuyo abrazo se siente como un refugio y cuya sonrisa desarma cualquier tensión.',
      matchWhy: 'Buscabas un aroma dulce y acogedor con personalidad envolvente. El cardamomo con castaña confitada y vainilla cremosa crea una presencia irresistible.'
    },
    '192': {
      archetype: 'Titán Nocturno • La Presencia Imponente',
      element: 'Humo y Cítrico Intenso 🖤',
      personality: 'Enfocado, implacable y con gran presencia. No necesitas alzar la voz para hacerte notar: tu porte y determinación hablan por ti.',
      matchWhy: 'Buscabas proyección bestial a precio justo. Su apertura de limón y piña con corazón de abedul ahumado y fondo de pachulí llena cualquier lugar con autoridad.'
    },
    '109': {
      archetype: 'Vértigo Metropolitano • El Urbano Implacable',
      element: 'Hierba Fresca & Metal 🏙️',
      personality: 'Moderno, cosmopolita y lleno de seguridad. Te mueves con agilidad en el asfalto, dominas tus proyectos y tienes esa frescura urbana magnética que no necesita esfuerzo.',
      matchWhy: 'Buscabas una fragancia limpia, versátil y con carácter contemporáneo. Sus hojas verdes y jengibre con gardenia y sándalo proyectan una energía ejecutiva fresca que dura todo el día.'
    },
    '285': {
      archetype: 'Paraíso Prohibido • La Tentación Tropical',
      element: 'Coco & Brasa Marina 🥥',
      personality: 'Sensual, libre y desinhibido. Tienes un magnetismo exótico y carismático que evoca un verano interminable. La gente se siente atraída por tu vibra cálida y atrevida.',
      matchWhy: 'Buscabas seducción y frescura adictiva. El coco cremoso con bergamota chispeante y haba tonka tostada es un imán tropical irresistible que arranca suspiros de inmediato.'
    },
    '690': {
      archetype: 'Cielo Dorado • El Encanto Majestuoso',
      element: 'Cítrico Acaramelado 🍊',
      personality: 'Expansivo, optimista y de presencia luminosa. Tu calidez humana y buen humor conquistan al instante, dejando una sensación reconfortante y de puro lujo a tu alrededor.',
      matchWhy: 'Buscabas dulzura equilibrada y frescura vibrante. La mandarina jugosa con caramelo fino, haba tonka y maderas suaves ofrece una estela exquisita que todos adoran.'
    },
    '142': {
      archetype: 'Roca Volcánica • La Fuerza Oceánica',
      element: 'Olas Negras & Incienso 🌋',
      personality: 'Imponente, sereno y con una profundidad admirable. Combinas la calma de las aguas profundas con la fuerza indomable de las rocas volcánicas bajo la marea.',
      matchWhy: 'Buscabas elegancia, frescura y porte distinguido. El choque del romero aromático y notas marinas con incienso ahumado y pachulí crea una firma majestuosa de gran duración.'
    },
    '217': {
      archetype: 'Dios Victorioso • La Pasión Legendaria',
      element: 'Fuego & Menta Viva ⚡',
      personality: 'Apasionado, audaz y dueño de tu propio destino. No temes ser el centro de atención: irradias una seguridad arrolladora que inspira y conquista a dondequiera que vas.',
      matchWhy: 'Buscabas potencia, seducción y presencia festiva. La menta fresca combinada con manzana verde crocante, haba tonka y vainilla de Madagascar crea una explosión de cumplidos.'
    },
    '179': {
      archetype: 'Noche Bohemia • El Lujo Especiado',
      element: 'Ron Añejo & Cuero Noble 🥃',
      personality: 'Misterioso, culto y con una seducción madura e implacable. Aprecias las buenas historias, los ambientes exclusivos y el magnetismo que surge de la templanza y el buen porte.',
      matchWhy: 'Buscabas calidez, sofisticación y distinción nocturna. El acorde de ron añejo con especias ardientes, cuero curtido y benjuí viste tu piel con una elegancia aristocrática sublime.'
    },
    '2': {
      archetype: 'Seducción Romana • La Intensidad Nocturna',
      element: 'Vainilla Ahumada & Noche 🏛️',
      personality: 'Intenso, magnético y vanguardista. Sabes cuándo dar el paso audaz y tienes un encanto nocturno que atrapa miradas en la penumbra.',
      matchWhy: 'Buscabas sensualidad, fijación extrema y distinción contemporánea. La vainilla de Bourbon profunda con lavanda aromática y vetiver ahumado es una verdadera arma de seducción.'
    },
    '256': {
      archetype: 'Pureza Zen • La Armonía Cristalina',
      element: 'Agua de Manantial & Yuzu 🌿',
      personality: 'Reflexivo, impecable y de una elegancia natural envidiable. Transmites paz, pulcritud y un gusto exquisito por la sencillez de las cosas auténticas.',
      matchWhy: 'Buscabas frescura limpia y porte distinguido para el día a día. El yuzu japonés con flor de loto, nuez moscada y maderas nobles es la definición de distinción limpia.'
    },
    '697': {
      archetype: 'Visión de Éxito • La Determinación Moderna',
      element: 'Salvia Eléctrica & Cedro 💎',
      personality: 'Enfocado en tus metas, perseverante y con una mentalidad ganadora. Proyectas la imagen de alguien que sabe adónde va y construye su propio camino con firmeza.',
      matchWhy: 'Buscabas una firma todoterreno ultra versátil con duración de más de 12 horas. La manzana verde con salvia aromática, geranio y haba tonka es la fórmula moderna definitiva.'
    },
    '287': {
      archetype: 'Comandante de Medianoche • La Autoridad Seductora',
      element: 'Cardamomo & Vainilla Negra ⚓',
      personality: 'Líder natural con porte caballeroso y mirada penetrante. Inspiras respeto y confianza instantánea, complementado con una calidez seductora que hipnotiza.',
      matchWhy: 'Buscabas una fragancia con estela de líder para citas y noches especiales. El cardamomo especiado con corazón de iris noble y fondo de vainilla oriental es un deleite absoluto.'
    },
    '292': {
      archetype: 'Sol de Capri • La Vitalidad Mediterránea',
      element: 'Brisa Marina & Cítrico Vivo ☀️',
      personality: 'Alegre, jovial y con una sonrisa que desarma. Amas los días soleados, la libertad al aire libre y las conversaciones espontáneas llenas de buena vibra.',
      matchWhy: 'Buscabas frescura cítrica vigorizante para el calor y el uso diario. La toronja jugosa con bergamota, pimienta de Sichuan y musgo de roble evoca las costas italianas.'
    },
    '100': {
      archetype: 'Lingote de Fuego • El Triunfo Supremo',
      element: 'Manzana Confitada & Oro 🏆',
      personality: 'Ambicioso, brillante y seguro de su valor. Te gusta lo mejor de la vida y tu energía arrolladora no pasa inadvertida ante nadie.',
      matchWhy: 'Buscabas máxima dulzura, duración y cumplidos. La manzana confitada con flor de osmanto, haba tonka y corteza de vainilla negra crea una estela que se siente a metros.'
    },
    '223': {
      archetype: 'Llama Legendaria • El Mito Inconfundible',
      element: 'Fuego & Cuero Vintage 🔥',
      personality: 'Auténtico, rebelde y con una personalidad única e irrepetible. No te pareces a nadie: dejas una huella profunda y memorable allá donde vas.',
      matchWhy: 'Buscabas un perfume con carácter fuerte e identidad inolvidable. Las hojas de violeta con cuero ahumado, nuez moscada y madera de cedro son la firma de los espíritus legendarios.'
    },
    '251': {
      archetype: 'Victoria Olímpica • El Espíritu Campeón',
      element: 'Laurel & Marea Victoriosa 🥇',
      personality: 'Enérgico, competitivo y enfocado en la victoria. Encaras cada desafío con entusiasmo y tu vitalidad contagia a quienes te acompañan.',
      matchWhy: 'Buscabas frescura marina energizante para el día a día. El pomelo chispeante con acorde marino, hojas de laurel y ámbar gris es la bomba de adrenalina y cumplidos más celebrada.'
    },
    '166': {
      archetype: 'Caballero Contemporáneo • El Éxito Cotidiano',
      element: 'Manzana & Madera Noble 💼',
      personality: 'Equilibrado, confiable y con una caballerosidad clásica que nunca pasa de moda. Sabes liderar con el ejemplo y tu porte impecable genera respeto inmediato.',
      matchWhy: 'Buscabas un aroma versátil para el trabajo y reuniones. La manzana verde crujiente con canela cálida, geranio y madera de olivo es el traje a la medida de la perfumería masculina.'
    },
    '136': {
      archetype: 'Dinamismo Chic • La Frescura de Alta Gama',
      element: 'Mandarina & Brisa Cristalina 🏎️',
      personality: 'Activo, sofisticado y con una frescura elegante e impecable. Te apasiona el movimiento, los retos y vivir cada día con estilo y distinción.',
      matchWhy: 'Buscabas frescura deportiva con la elegancia máxima de alta perfumería. La naranja y mandarina con notas marinas, pimienta negra, neroli y cedro blanco crean un rastro ultra refinado.'
    },
    // MUJER
    '534': {
      archetype: 'Néctar Radiante • El Aura de la Reina Feliz',
      element: 'Luz Solar ☀️',
      personality: 'Tu sonrisa ilumina cualquier habitación. Irradias una energía contagiosa, optimista y envolvente. Tienes un corazón generoso y una elegancia dulce que deja recuerdos imborrables.',
      matchWhy: 'Buscabas una dulzura sofisticada y encantadora que celebre la vida. El iris noble de Florencia bañado en praliné gourmand, grosellas y vainilla pura es el himno absoluto a la alegría femenina.'
    },
    '453': {
      archetype: 'Chic Parisino • El Lujo Silencioso',
      element: 'Cristal & Rosa Viva 🌹',
      personality: 'Posees una distinción innata y un magnetismo sofisticado. Independiente, decidida y con un estilo impecable que combina la rebeldía inteligente con la máxima feminidad.',
      matchWhy: 'Buscabas elegancia, clase y presencia atemporal para cualquier ocasión. La naranja viva con rosas frescas, jazmín y pachulí blanco crea un rastro inconfundible de estatus y buen gusto.'
    },
    '495': {
      archetype: 'Diosa Nocturna • La Femme Fatale',
      element: 'Sombra Seductora 👠',
      personality: 'Juegas con la dualidad: dulce y encantadora de día, misteriosa e irresistible de noche. Sabes exactamente lo que quieres y tu sensualidad audaz nunca pasa desapercibida.',
      matchWhy: 'Buscabas magnetismo nocturno y arrancar cumplidos en citas o fiestas. El nardo luminoso con café negro, almendra tostada y cacao crea una estela embriagadora y ultra femenina.'
    },
    '431': {
      archetype: 'Mora Silvestre • El Espíritu Libre',
      element: 'Viento Primaveral 🍓',
      personality: 'Fresca, moderna y auténtica. Tienes una personalidad espontánea, dulce y chispeante que atrae a la gente por tu simpatía natural y estilo juvenil desenfadado.',
      matchWhy: 'Buscabas dulzura moderna y encanto diario. La explosión de frutos rojos del bosque con jazmín y ámbar acogedor te acompaña con una vibra alegre y deliciosa todo el día.'
    },
    '389': {
      archetype: 'Champaña Rosé • El Alma de la Fiesta',
      element: 'Burbuja Festiva 🥂',
      personality: 'Donde estás tú, empieza la celebración. Tienes un magnetismo chispeante, divertido y lleno de glamour. Tu presencia es sinónimo de diversión, alegría y estilo VIP.',
      matchWhy: 'Buscabas destacar en eventos, salidas y fiestas. La efervescencia de la champaña rosada con flor de durazno y maderas suaves te convierte en el centro de todas las miradas.'
    },
    '520': {
      archetype: 'Oro Divino • La Diosa Solar',
      element: 'Flor de Oro 👑',
      personality: 'Majestuosa, refinada y con un brillo dorado inconfundible. Amas la belleza clásica, los detalles sublimes y la alta feminidad que trasciende las modas pasajeras.',
      matchWhy: 'Buscabas un rastro floral opulento y prestigioso. Su bouquet imperial de ylang-ylang, rosa damascena y jazmín sambac viste tu piel como un velo de oro puro.'
    },
    '443': {
      archetype: 'Rocío Romántico • La Ternura Radiante',
      element: 'Flor de Cerezo 🌸',
      personality: 'Delicada, luminosa y con un encanto sutil que enamora sin esfuerzo. Tu vibra es pacífica, fresca y femenina, como una mañana perfecta de primavera.',
      matchWhy: 'Buscabas frescura romántica y elegancia discreta. El membrillo jugoso y la toronja con jacinto y almizcle blanco dejan una sensación limpia y celestial en tu piel.'
    },
    '452': {
      archetype: 'Opulencia Barroca • La Dama Legendaria',
      element: 'Rosa Ámbar & Especias 👑',
      personality: 'Majestuosa, culta y con una distinción imponente. Tu estilo trasciende las modas: posees esa sofisticación profunda que solo tienen las verdaderas damas de mundo.',
      matchWhy: 'Buscabas un perfume con carácter soberbio y estela opulenta. La rosa búlgara con cilantro, melocotón, clavo de olor, ámbar y sándalo viste tu presencia de realeza.'
    },
    '446': {
      archetype: 'Icono Inmortal • El Mito Absoluto',
      element: 'Polvo de Oro & Ylang Imperial 💎',
      personality: 'Única, eterna y con un magnetismo misterioso que cautiva generaciones. Tu sola presencia irradia alta costura y un aura legendaria que nadie puede igualar.',
      matchWhy: 'Buscabas la máxima elegancia clásica de la historia. Los aldehídos luminosos con ylang-ylang, iris de Florencia, jazmín y sándalo son el símbolo definitivo de la sofisticación femenina.'
    },
    '563': {
      archetype: 'Romance Eterno • El Jardín Encantado',
      element: 'Rosas de Grasse & Lirio 💐',
      personality: 'Romántica, soñadora y con una dulzura luminosa que enamora. Tienes un corazón apasionado y ves la belleza en los detalles más delicados de la vida.',
      matchWhy: 'Buscabas un bouquet floral radiante y femenino. Las rosas centifolia de Grasse con lirio de los valles, peonía y maderas tiernas te envuelven en un romance primaveral eterno.'
    },
    '428': {
      archetype: 'Aristocracia Moderna • La Rebelde Chic',
      element: 'Jazmín Sambac & Vainilla Bourbon 🎀',
      personality: 'Vanguardista, segura de sí misma y con un estilo propio arrollador. Combinas la alta costura con un toque atrevido y urbano que marca tendencia por donde caminas.',
      matchWhy: 'Buscabas feminidad moderna y sensualidad duradera. El jazmín sambac bañado en vainilla Bourbon suntuosa con grosellas negras y maderas nobles es elegancia con actitud.'
    },
    '549': {
      archetype: 'Brisa de Capri • El Resplandor Mediterráneo',
      element: 'Limón Siciliano & Manzana Crujiente 🍋',
      personality: 'Fresca, libre y llena de vitalidad. Tu energía es como un rayo de sol sobre el mar: despiertas sonrisas y transmites bienestar con tu frescura inagotable.',
      matchWhy: 'Buscabas un aroma fresco, limpio y alegre para el día a día. El limón siciliano con manzana verde Granny Smith, bambú y cedro blanco es una caricia revitalizante inconfundible.'
    },
    '429': {
      archetype: 'Diamante Radiante • La Luz Cristalina',
      element: 'Flor de Loto & Granada 🌸',
      personality: 'Delicada, luminosa y con un encanto dulce y cristalino. La gente adora estar cerca de ti por tu ternura, tu elegancia natural y tu trato amable y sincero.',
      matchWhy: 'Buscabas frescura floral delicada para todo momento. La granada jugosa con yuzu chispeante, peonía, flor de loto y ámbar vegetal te envuelve en un aura limpia y sumamente chic.'
    },
    '448': {
      archetype: 'Nube Mágica • La Fantasía Pastel',
      element: 'Crema de Coco & Praliné ☁️',
      personality: 'Creativa, soñadora y con un aura acogedora y dulce. Transmites optimismo, ternura y esa magia juvenil que hace que el mundo a tu alrededor se sienta más cálido.',
      matchWhy: 'Buscabas una dulzura esponjosa, adictiva y moderna. La crema de coco con praliné gourmet, lavanda dulce y orquídea de vainilla es un abrazo delicioso que todos elogian.'
    },
    '417': {
      archetype: 'Chic Neoyorquino • La Manzana Verde',
      element: 'Manzana Crujiente & Pepino 🍏',
      personality: 'Dinámica, cosmopolita y llena de chispa. Te apasiona la emoción de las grandes ciudades, los días activos y expresar tu individualidad sin filtros.',
      matchWhy: 'Buscabas frescura chispeante, frutal y limpia. La manzana verde fresca con pepino crujiente, toronja, magnolia y maderas blancas es un impulso de energía y alegría contagiosa.'
    },
    '567': {
      archetype: 'Diosa del Triunfo • La Fuerza Femenina',
      element: 'Vainilla Salada & Jazmín Solar 🏛️',
      personality: 'Segura, magnética y con un porte de reina invencible. Tienes una personalidad cautivadora que mezcla la fuerza con la sensualidad más refinada.',
      matchWhy: 'Buscabas estela potente, cumplidos y presencia en eventos. El contraste único de la vainilla salada con jazmín acuático, mandarina verde y ámbar gris te hace inolvidable.'
    },
    '574': {
      archetype: 'Deseo Prohibido • La Tentación Magnética',
      element: 'Palomitas de Maíz & Ylang Exótico 🍿',
      personality: 'Atrevida, seductora y apasionadamente coqueta. Sabes cómo despertar curiosidad y jugar con el encanto sensual de las miradas cómplices.',
      matchWhy: 'Buscabas sensualidad gourmand adictiva para salidas y citas. La explosión de palomitas de maíz calientes con flor de ylang-ylang, vainilla caliente y sándalo es puro magnetismo.'
    },
    // UNISEX
    '658': {
      archetype: 'Alquimia Estelar • El Aura Millonaria',
      element: 'Cristal Carmín 🔮',
      personality: 'Tu vibra es de otro planeta: enigmática, exclusiva y magnética. Dejas una estela flotante que todo el mundo intenta descifrar pero nadie logra olvidar.',
      matchWhy: 'Buscabas exclusividad y un rastro inolvidable. El azafrán con jazmín grandiflorum y madera de ámbar mineral es la fragancia más lujosa, viral y codiciada del mundo.'
    },
    '677': {
      archetype: 'Santuario Secreto • El Aristócrata Enigmático',
      element: 'Madera Sagrada 🪵',
      personality: 'Misterio puro, refinamiento y carácter. Hablas con la mirada y tienes un aura de exclusividad reservada que fascina a quienes tienen el privilegio de conocerte de verdad.',
      matchWhy: 'Buscabas distinción fuera de lo común. El humo noble de madera de oud con cardamomo, palo de rosa y sándalo te otorga un halo de prestigio y distinción única.'
    },
    '679': {
      archetype: 'Espíritu Libre • El Icono Vanguardista',
      element: 'Cuero & Sándalo 🎨',
      personality: 'Creativo, independiente y con una visión única del mundo. Huir de lo común es tu firma: amas el arte, el diseño y las experiencias con alma.',
      matchWhy: 'Buscabas una fragancia icónica con personalidad de autor. El sándalo australiano con cardamomo, iris y papiro es el aroma fetiche de las mentes más creativas del mundo.'
    },
    '689': {
      archetype: 'Jardín Dorado • La Abundancia Sensorial',
      element: 'Fruto Divino 🍊',
      personality: 'Tu energía es arrolladora y expansiva. Expresas vida, entusiasmo y una calidez que conquista corazones al primer instante.',
      matchWhy: 'Buscabas una estela inolvidable y duradera. Las frutas mediterráneas con vainilla pura de Madagascar proyectan un festival de vitalidad que dura más de 12 horas.'
    },
    '681': {
      archetype: 'Club Privado • La Calidez Aristocrática',
      element: 'Tabaco Dulce 🎩',
      personality: 'Gusto exquisito, conversación fascinante y una presencia suntuosa. Te apasiona la calidez de las buenas charlas y los placeres refinados de la vida.',
      matchWhy: 'Buscabas calidez, sensualidad y distinción para el frío o la noche. La hoja de tabaco rubio con haba tonka, vainilla cremosa y frutos secos es un abrazo de puro lujo.'
    },
    '674': {
      archetype: 'Desierto Salvaje • La Piel de Leyenda',
      element: 'Cuero Negro & Cardamomo 🏜️',
      personality: 'Libre, indómito y con una seguridad de acero. Tienes un espíritu aventurero y un magnetismo sobrio que impone respeto y admiración sin pronunciar palabra.',
      matchWhy: 'Buscabas distinción, estela imponente y un aroma de autor fuera de lo común. El cuero negro táctil con cardamomo especiado, jazmín sambac y pachulí es el epítome del lujo contemporáneo.'
    },
    '669': {
      archetype: 'Corte Aristocrática • El Carisma Noble',
      element: 'Manzana Especiada & Vainilla de Autor 👑',
      personality: 'Sofisticado, elocuente y con un encanto caballeroso irresistible. Tu presencia llena cualquier reunión con distinción, calidez y un gusto refinado superior.',
      matchWhy: 'Buscabas un perfume nicho distinguido con cumplidos garantizados. La manzana crujiente con lavanda, vainilla cremosa, cardamomo y maderas nobles es una obra de arte olfativa.'
    },
    '664': {
      archetype: 'Riviera Mediterránea • El Escape Soñado',
      element: 'Ciprés Marino & Pino Costero 🌲',
      personality: 'Elegante, relajado y con un porte aristocrático veraniego. Sabes disfrutar de la buena vida y transmites una calma distinguida que atrae a las mentes selectas.',
      matchWhy: 'Buscabas frescura marina de alta gama con cuerpo amaderado. La madera flotante con enebro, ciprés, alga marina, mirto y cítricos nobles evoca un crucero privado por el Mediterráneo.'
    },
    '670': {
      archetype: 'Cereza Prohibida • La Obsesión Licorosa',
      element: 'Cereza Negra & Almendra Amarga 🍒',
      personality: 'Fascinante, tentador y con un aura de misterio dulce. Tienes un gusto sibarita por lo exquisito y disfrutas de las sensaciones intensas que desafían lo convencional.',
      matchWhy: 'Buscabas una fragancia suntuosa, dulce y sumamente adictiva. La cereza negra licorosa con almendra amarga, licor de grosellas, rosa turca y haba tonka es un manjar olfativo sin igual.'
    }
  };

  // Preguntas del Cuestionario Interactivo
  const QUIZ_QUESTIONS = [
    {
      step: 1,
      key: 'gender',
      badge: 'PASO 1 DE 4',
      title: '¿Para quién es el perfume?',
      subtitle: 'Comencemos por el punto de partida.',
      options: [
        {
          id: 'hombre',
          icon: '👨',
          title: 'Para Caballero',
          desc: 'Fragancias masculinas con carácter, fuerza y presencia.'
        },
        {
          id: 'mujer',
          icon: '👩',
          title: 'Para Dama',
          desc: 'Fragancias femeninas cautivadoras, elegantes y adictivas.'
        },
        {
          id: 'unisex',
          icon: '✨',
          title: 'Unisex / Sin Etiquetas',
          desc: 'Aromas de autor que huelen increíble en cualquier persona.'
        }
      ]
    },
    {
      step: 2,
      key: 'vibe',
      badge: 'PASO 2 DE 4',
      titlesByGender: {
        hombre: '¿Qué vibra o aura deseas proyectar?',
        mujer: '¿Qué vibra o aura deseas proyectar?',
        unisex: '¿Qué vibra o personalidad buscas?'
      },
      subtitlesByGender: {
        hombre: 'Elige la energía con la que quieres impactar a quienes te rodean.',
        mujer: 'Elige la energía y presencia con la que quieres cautivar hoy.',
        unisex: 'Elige la declaración olfativa que mejor define tu estilo.'
      },
      optionsByGender: {
        hombre: [
          {
            id: 'power',
            icon: '👑',
            title: 'Poder, Lujo y Éxito Alfa',
            desc: 'Presencia imponente de líder. Que sepan que llegué y mande respeto.'
          },
          {
            id: 'seduction',
            icon: '🔥',
            title: 'Seducción y Magnetismo Prohibido',
            desc: 'Misterioso, sensual e irresistible. Un imán de miradas y cumplidos de cerca.'
          },
          {
            id: 'fresh',
            icon: '⚡',
            title: 'Frescura Imparable y Energía Limpia',
            desc: 'Vibrante, dinámico y pulcro. Como recién salido de una ducha de lujo.'
          },
          {
            id: 'elegance',
            icon: '💎',
            title: 'Elegancia Silenciosa y Clase Atemporal',
            desc: 'Lujo sutil y refinado. Seguro de sí mismo, sobrio y con impecable buen gusto.'
          },
          {
            id: 'sweet',
            icon: '🍯',
            title: 'Dulzura Cálida y Encanto Envolvente',
            desc: 'Acogedor, tentador y goloso. Un abrazo cálido del que nadie se quiere soltar.'
          }
        ],
        mujer: [
          {
            id: 'power',
            icon: '👑',
            title: 'Seguridad, Glamour & Empoderamiento',
            desc: 'Aura de mujer exitosa y magnética. Imponente, segura y dueña de su espacio.'
          },
          {
            id: 'seduction',
            icon: '💋',
            title: 'Sensualidad, Misterio & Femme Fatale',
            desc: 'Irresistible, seductora y apasionada. Un imán de miradas y cumplidos al pasar.'
          },
          {
            id: 'fresh',
            icon: '✨',
            title: 'Frescura Radiante, Luz & Vitalidad',
            desc: 'Limpia, luminosa, alegre y chic. Sensación de brisa fresca, bienestar y energía viva.'
          },
          {
            id: 'elegance',
            icon: '💎',
            title: 'Elegancia Chic & Distinción Atemporal',
            desc: 'Sofisticada, impecable y refinada. Buen gusto absoluto con porte de alta costura.'
          },
          {
            id: 'sweet',
            icon: '💖',
            title: 'Dulzura Adictiva, Vainilla & Encanto',
            desc: 'Deliciosa, envolvente y coqueta. Un abrazo dulce y tentador que nadie olvida.'
          }
        ],
        unisex: [
          {
            id: 'power',
            icon: '👑',
            title: 'Exclusividad, Estatus & Jerarquía',
            desc: 'Personalidad arrolladora y de autor. Un halo sofisticado que impone distinción.'
          },
          {
            id: 'seduction',
            icon: '🔥',
            title: 'Atracción Enigmática & Magnetismo',
            desc: 'Misterioso, hipnótico y adictivo en piel. Deja una huella inolvidable y cercana.'
          },
          {
            id: 'fresh',
            icon: '🌊',
            title: 'Frescura Pura & Minimalismo Pulcro',
            desc: 'Limpio, tonificante, moderno y cristalino. Una bocanada revitalizante de puro lujo.'
          },
          {
            id: 'elegance',
            icon: '💎',
            title: 'Lujo Silencioso & Vanguardia de Nicho',
            desc: 'Alta perfumería, sobrio y contemporáneo. Para quienes aprecian la maestría artesanal.'
          },
          {
            id: 'sweet',
            icon: '🍯',
            title: 'Calidez Ambarina & Adicción Suntuosa',
            desc: 'Notas tostadas, envolventes y golosas. Confort cálido y adictivo de máxima calidad.'
          }
        ]
      }
    },
    {
      step: 3,
      key: 'occasion',
      badge: 'PASO 3 DE 4',
      titlesByGender: {
        hombre: '¿En qué momentos será tu arma secreta?',
        mujer: '¿Para qué ocasión buscas tu perfume?',
        unisex: '¿En qué momentos lo vas a utilizar?'
      },
      subtitlesByGender: {
        hombre: 'Dinos cuándo lo vas a lucir más.',
        mujer: 'Dinos en qué momentos quieres que sea tu cómplice ideal.',
        unisex: 'Dinos el momento o uso principal que tienes en mente.'
      },
      optionsByGender: {
        hombre: [
          {
            id: 'daily',
            icon: '💼',
            title: 'Uso Diario, Trabajo y Oficina',
            desc: 'Ser quien mejor huele todos los días sin abrumar a nadie.'
          },
          {
            id: 'night',
            icon: '🌙',
            title: 'Citas Especiales y Salidas Nocturnas',
            desc: 'Máxima estela y fijación para conquistar y arrancar suspiros.'
          },
          {
            id: 'signature',
            icon: '🌟',
            title: 'Mi Firma Personal 24/7',
            desc: 'Un aroma versátil y todoterreno que me identifique siempre.'
          },
          {
            id: 'events',
            icon: '🥂',
            title: 'Fiestas, Eventos y Momentos VIP',
            desc: 'Destacar entre la multitud y que me volteen a ver al pasar.'
          }
        ],
        mujer: [
          {
            id: 'daily',
            icon: '💼',
            title: 'Día a Día, Oficina & Rutina Chic',
            desc: 'Oler impecable, femenina y fresca todo el día sin abrumar.'
          },
          {
            id: 'night',
            icon: '🌙',
            title: 'Citas Románticas & Noches Especiales',
            desc: 'Estela hipnótica e intensa para enamorar, cautivar y dejar huella.'
          },
          {
            id: 'signature',
            icon: '🌟',
            title: 'Mi Firma Personal (Mi Sello Diario)',
            desc: 'El aroma por el que todos me reconozcan y recuerden siempre.'
          },
          {
            id: 'events',
            icon: '🥂',
            title: 'Fiestas, Galas & Eventos Inolvidables',
            desc: 'Brillar con luz propia, robar suspiros y recibir elogios sin parar.'
          }
        ],
        unisex: [
          {
            id: 'daily',
            icon: '💼',
            title: 'Día a Día, Trabajo & Espacios Compartidos',
            desc: 'Aroma pulcro y agradable para una presencia constante y refinada.'
          },
          {
            id: 'night',
            icon: '🌙',
            title: 'Noches Especiales & Encuentros Clave',
            desc: 'Profundidad, proyección y fijación duradera bajo las luces.'
          },
          {
            id: 'signature',
            icon: '🌟',
            title: 'Firma de Autor Versátil (Todo Momento)',
            desc: 'Un perfume insignia adaptable a cualquier clima, ocasión y hora.'
          },
          {
            id: 'events',
            icon: '🥂',
            title: 'Eventos Sociales & Fiestas Exclusivas',
            desc: 'Para destacar en reuniones y proyectar un gusto de nivel superior.'
          }
        ]
      }
    },
    {
      step: 4,
      key: 'notes',
      badge: 'PASO 4 DE 4',
      titlesByGender: {
        hombre: '¿Qué familia o sensación aromática prefieres?',
        mujer: '¿Qué aromas o notas te enamoran más?',
        unisex: '¿Qué acordes o sensaciones olfativas buscas?'
      },
      subtitlesByGender: {
        hombre: 'Elige tu perfil olfativo favorito.',
        mujer: 'Elige la familia aromática que más te hace suspirar.',
        unisex: 'Elige el perfil aromático que mejor va contigo.'
      },
      optionsByGender: {
        hombre: [
          {
            id: 'woody_spicy',
            icon: '🌲',
            title: 'Maderas Nobles, Especias o Ámbar',
            desc: 'Cálido, profundo, imponente y con gran cuerpo.'
          },
          {
            id: 'citrus_aquatic',
            icon: '🌊',
            title: 'Cítricos Frescos o Notas Marinas',
            desc: 'Azul, chispeante, energizante y sumamente limpio.'
          },
          {
            id: 'vanilla_gourmand',
            icon: '🍦',
            title: 'Vainilla Cremosa, Haba Tonka o Miel',
            desc: 'Gourmand, licoroso, tentador y ultra adictivo.'
          },
          {
            id: 'floral_fruity',
            icon: '🌸',
            title: 'Flores Blancas, Frutos Rojos o Almizcle',
            desc: 'Radiante, chic, delicado y embriagador.'
          },
          {
            id: 'surprise',
            icon: '🎲',
            title: '¡Sorpréndanme con su Top 1 Más Vendido!',
            desc: 'Confío en KöDE, quiero la bomba de cumplidos masculina que todos aman.'
          }
        ],
        mujer: [
          {
            id: 'floral_fruity',
            icon: '🌸',
            title: 'Flores Delicadas, Jazmín o Frutos Rojos',
            desc: 'Femenino, romántico, luminoso, alegre y sumamente chic.'
          },
          {
            id: 'vanilla_gourmand',
            icon: '🍰',
            title: 'Vainilla Cremosa, Caramelo o Bombón',
            desc: 'Gourmand dulce, adictivo, cálido y absolutamente delicioso.'
          },
          {
            id: 'citrus_aquatic',
            icon: '🍋',
            title: 'Cítricos Chispeantes & Brisa Marina Fresca',
            desc: 'Luminoso, fresco, revitalizante y de sensación limpia radiante.'
          },
          {
            id: 'woody_spicy',
            icon: '🪵',
            title: 'Maderas Finas, Pachulí & Especias Cálidas',
            desc: 'Misterioso, elegante, con cuerpo sofisticado y gran carácter.'
          },
          {
            id: 'surprise',
            icon: '🎲',
            title: '¡Sorpréndanme con su Top 1 Más Vendido!',
            desc: 'Confío en KöDE, quiero el perfume femenino más elogiado e irresistible.'
          }
        ],
        unisex: [
          {
            id: 'woody_spicy',
            icon: '🌲',
            title: 'Maderas Nobles, Ámbar & Especias Cálidas',
            desc: 'Seco, resinoso, profundo y de arquitectura olfativa compleja.'
          },
          {
            id: 'citrus_aquatic',
            icon: '🌊',
            title: 'Cítricos Puros, Té Verde & Brisa Mineral',
            desc: 'Crisp, ozónico, limpio y con una frescura translúcida vibrante.'
          },
          {
            id: 'vanilla_gourmand',
            icon: '🍦',
            title: 'Vainilla Bourbon, Haba Tonka & Praliné',
            desc: 'Gourmand refinado, balsámico y profundamente seductor.'
          },
          {
            id: 'floral_fruity',
            icon: '🌺',
            title: 'Florales de Autor & Acordes Frutales Jugosos',
            desc: 'Rosa aterciopelada, iris o higo maduro de alta gama.'
          },
          {
            id: 'surprise',
            icon: '🎲',
            title: '¡Sorpréndanme con su Top 1 Más Vendido!',
            desc: 'Confío en KöDE, recomiéndame su joya unisex más codiciada.'
          }
        ]
      }
    }
  ];

  // Helper para resolver dinámicamente la pregunta y opciones según el género seleccionado
  function getQuizQuestion(step, gender) {
    const q = QUIZ_QUESTIONS.find(item => item.step === step);
    if (!q) return null;
    const targetGender = ['hombre', 'mujer', 'unisex'].includes(gender) ? gender : 'hombre';

    return {
      step: q.step,
      key: q.key,
      badge: q.badge,
      title: (q.titlesByGender && q.titlesByGender[targetGender]) || q.title,
      subtitle: (q.subtitlesByGender && q.subtitlesByGender[targetGender]) || q.subtitle,
      options: (q.optionsByGender && q.optionsByGender[targetGender]) || q.options
    };
  }

  // Estado del Cuestionario
  let quizCurrentStep = 1;
  let quizAnswers = {
    gender: null,
    vibe: null,
    occasion: null,
    notes: null
  };

  // Abrir Cuestionario
  window.openPerfumeQuiz = function() {
    const dialog = document.getElementById('perfume-quiz-dialog');
    if (!dialog) return;

    try {
      if (window.KodeTracker && typeof window.KodeTracker.trackEvent === 'function') {
        window.KodeTracker.trackEvent('quiz_touch', {});
      }
    } catch (e) {}

    quizCurrentStep = 1;
    quizAnswers = { gender: null, vibe: null, occasion: null, notes: null };
    renderQuizStep();

    if (typeof dialog.showModal === 'function') {
      dialog.showModal();
    } else {
      dialog.setAttribute('open', '');
    }
    document.body.style.overflow = 'hidden';
  };

  // Cerrar Cuestionario
  window.closePerfumeQuiz = function() {
    const dialog = document.getElementById('perfume-quiz-dialog');
    if (dialog) {
      if (typeof dialog.close === 'function') {
        dialog.close();
      } else {
        dialog.removeAttribute('open');
      }
    }
    document.body.style.overflow = '';
  };

  // Retroceder un paso
  window.previousQuizStep = function() {
    if (quizCurrentStep > 1) {
      quizCurrentStep--;
      renderQuizStep();
    }
  };

  // Reiniciar Cuestionario
  window.resetQuiz = function(e) {
    if (e && typeof e.stopPropagation === 'function') {
      e.stopPropagation();
    }
    quizCurrentStep = 1;
    quizAnswers = { gender: null, vibe: null, occasion: null, notes: null };
    renderQuizStep();
  };

  // Seleccionar opción de un paso
  window.selectQuizOption = function(key, value) {
    quizAnswers[key] = value;
    if (quizCurrentStep < QUIZ_QUESTIONS.length) {
      quizCurrentStep++;
      renderQuizStep();
    } else {
      renderQuizResults();
    }
  };

  // Renderizar paso del cuestionario
  function renderQuizStep() {
    const container = document.getElementById('perfume-quiz-content');
    if (!container) return;

    const currentQuestion = getQuizQuestion(quizCurrentStep, quizAnswers.gender);
    if (!currentQuestion) return;

    const progressPct = ((quizCurrentStep - 1) / QUIZ_QUESTIONS.length) * 100;

    let optionsHtml = currentQuestion.options.map(opt => {
      const isSelected = quizAnswers[currentQuestion.key] === opt.id;
      return `
        <button type="button" 
                class="quiz-option-card ${isSelected ? 'selected' : ''}" 
                onclick="selectQuizOption('${currentQuestion.key}', '${opt.id}')">
          <span class="quiz-opt-icon">${opt.icon}</span>
          <div class="quiz-opt-text">
            <span class="quiz-opt-title">${opt.title}</span>
            <span class="quiz-opt-desc">${opt.desc}</span>
          </div>
          <span class="quiz-opt-radio">${isSelected ? '●' : '○'}</span>
        </button>
      `;
    }).join('');

    container.innerHTML = `
      <div class="quiz-wizard-header">
        <div class="quiz-nav-top">
          ${quizCurrentStep > 1 
            ? `<button type="button" class="quiz-back-btn" onclick="previousQuizStep()" aria-label="Paso anterior">
                 <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="15 18 9 12 15 6"></polyline></svg>
                 Anterior
               </button>`
            : `<span></span>`
          }
          <button type="button" class="quiz-close-btn" onclick="closePerfumeQuiz()" aria-label="Cerrar test">✕</button>
        </div>

        <div class="quiz-progress-track">
          <div class="quiz-progress-bar" style="width: ${Math.max(12, progressPct)}%;"></div>
        </div>

        <div class="quiz-step-meta">
          <span class="quiz-step-badge">${currentQuestion.badge}</span>
          <h2 class="quiz-step-title">${currentQuestion.title}</h2>
          <p class="quiz-step-subtitle">${currentQuestion.subtitle}</p>
        </div>
      </div>

      <div class="quiz-wizard-body">
        <div class="quiz-options-list">
          ${optionsHtml}
        </div>
      </div>
    `;

    // Desplazar contenedor al inicio del diálogo
    container.scrollTop = 0;
  }

  // Generador dinámico de respaldo si algún perfume no tiene ficha estática en ARCHETYPES_DB
  function generateDynamicArchetype(perfume, answers) {
    const family = perfume.olfactoryFamily || 'Aromática Noble';
    const mainAccord = (perfume.accords && perfume.accords[0] && perfume.accords[0].name) || 'Acordes Nobles';
    const accordTitle = mainAccord.charAt(0).toUpperCase() + mainAccord.slice(1);

    return {
      archetype: `Aura Distinguida • El Magnetismo de ${accordTitle}`,
      element: `${accordTitle} & Ámbar ✨`,
      personality: 'Proyectas un halo de seguridad, buen gusto y elegancia natural. Tu estilo atrae cumplidos genuinos porque refleja autenticidad y una presencia memorable que no necesita excesos para destacar.',
      matchWhy: `Buscabas una fragancia de alta fijación con notas que se adapten a tu estilo. Kódigo ${perfume.code} destaca por su familia ${family} con acordes de ${mainAccord}, garantizando una estela cautivadora y duradera.`
    };
  }

  // Algoritmo de Coincidencia Ponderada por Mejores Ventas (Pool Amplio: Top 30)
  function calculateBestMatch(answers) {
    const catalog = (typeof window !== 'undefined' && Array.isArray(window.CATALOG_DATA) && window.CATALOG_DATA.length > 0)
      ? window.CATALOG_DATA
      : (typeof globalCatalog !== 'undefined' ? globalCatalog : []);

    if (!Array.isArray(catalog) || catalog.length === 0) return null;

    // 1. Filtrar por género seleccionado estrictamente
    let candidates = [];
    if (answers.gender === 'hombre') {
      candidates = catalog.filter(p => p.gender === 'hombre');
    } else if (answers.gender === 'mujer') {
      candidates = catalog.filter(p => p.gender === 'mujer');
    } else if (answers.gender === 'unisex') {
      candidates = catalog.filter(p => p.gender === 'unisex');
    }

    if (candidates.length === 0) candidates = [...catalog];

    // 2. Limitar a las fragancias más vendidas de esa categoría (Top 30 con rotación probada)
    candidates.sort((a, b) => (b.sales || 0) - (a.sales || 0));
    const minSalesThreshold = answers.gender === 'hombre' ? 35 : (answers.gender === 'mujer' ? 15 : 12);
    let pool = candidates.filter(p => (p.sales || 0) >= minSalesThreshold).slice(0, 30);
    if (pool.length === 0) pool = candidates.slice(0, 30);

    // 3. Puntaje ponderado que combina popularidad con afinidad olfativa real (acordes, notas, familia)
    const scored = pool.map((perfume, index) => {
      let score = 0;

      // Base de ventas escalonada dentro del Top 30 (privilegia a los top sellers pero permite variedad justa)
      if (index < 3) score += 24;
      else if (index < 8) score += 18;
      else if (index < 15) score += 14;
      else if (index < 22) score += 10;
      else score += 6;

      const accords = (perfume.accords || []).map(a => (a.name || '').toLowerCase());
      const accordsText = accords.join(' ');
      const desc = (perfume.description || '').toLowerCase();
      const family = (perfume.olfactoryFamily || '').toLowerCase();
      const pyr = perfume.pyramid || {};
      const notesList = [...(pyr.top || []), ...(pyr.heart || []), ...(pyr.base || [])].map(n => (n.name || '').toLowerCase()).join(' ');
      const fullText = [perfume.name, perfume.reference, desc, family, accordsText, notesList].filter(Boolean).join(' ').toLowerCase();

      function hasAccord(regex) {
        return accords.some(a => regex.test(a));
      }

      // Ponderación por Vibra (hasta 40 pts)
      if (answers.vibe === 'power') {
        if (hasAccord(/cuero|amaderado|cálido especiado/)) score += 22;
        if (/oud|cuero|especias|intenso|potente|rey|fuego|autoridad|elixir|noble|imperial|salvaje/.test(fullText)) score += 18;
      } else if (answers.vibe === 'seduction') {
        if (hasAccord(/avainillado|cálido especiado|ámbar|dulce/)) score += 22;
        if (/seductor|adictivo|sensual|cacao|café|miel|noche|misterio|tentación|nardo|almendra|licor/.test(fullText)) score += 18;
      } else if (answers.vibe === 'fresh') {
        if (hasAccord(/marino|acuático|cítrico|fresco especiado|aromático/)) score += 22;
        if (/energía|brisa|limpio|vital|chispeante|mar|agua|frescura|ozon|mineral/.test(fullText)) score += 18;
      } else if (answers.vibe === 'elegance') {
        if (hasAccord(/floral|amaderado|aromático|almizclado|chipre/)) score += 22;
        if (/sofisticad|elegante|lujo|atemporal|clase|porte|refinado|parisino|couture|sándalo|iris|cedro/.test(fullText)) score += 18;
      } else if (answers.vibe === 'sweet') {
        if (hasAccord(/dulce|avainillado|afrutado/)) score += 22;
        if (/gourmand|azúcar|bombón|praliné|miel|delicioso|postre|caramelo|frutos rojos/.test(fullText)) score += 18;
      }

      // Ponderación por Ocasión (hasta 30 pts)
      if (answers.occasion === 'daily') {
        if (hasAccord(/cítrico|acuático|marino|fresco especiado|aromático/)) score += 20;
        if (/oficina|diario|trabajo|versátil|limpio|fresco|primavera/.test(fullText)) score += 10;
        if (hasAccord(/cuero|tabaco/) || /oud/.test(fullText)) score -= 14;
      } else if (answers.occasion === 'night') {
        if (hasAccord(/cálido especiado|ámbar|avainillado|cuero/)) score += 20;
        if (/noche|nocturno|fiesta|conquista|cita|intenso|elixir|misterio/.test(fullText)) score += 10;
      } else if (answers.occasion === 'signature') {
        if (hasAccord(/aromático|amaderado|fresco especiado|cítrico/)) score += 18;
        score += 12;
      } else if (answers.occasion === 'events') {
        if (hasAccord(/ámbar|amaderado|cálido especiado|dulce|floral blanco/)) score += 20;
        if (/gala|evento|fiesta|vip|celebración|brillar|estela|nardo|glamour/.test(fullText)) score += 10;
      }

      // Ponderación por Familia y Notas Olfativas (hasta 45 pts)
      if (answers.notes === 'woody_spicy') {
        if (hasAccord(/amaderado/)) score += 25;
        if (hasAccord(/cálido especiado|especiado/)) score += 15;
        if (/cedro|sándalo|oud|pachulí|vetiver|canela|cardamomo/.test(fullText)) score += 10;
      } else if (answers.notes === 'citrus_aquatic') {
        if (hasAccord(/cítrico/)) score += 25;
        if (hasAccord(/marino|acuático/)) score += 20;
        if (/bergamota|limón|pomelo|mandarina|mar|agua|loto/.test(fullText)) score += 10;
      } else if (answers.notes === 'vanilla_gourmand') {
        if (hasAccord(/avainillado/)) score += 25;
        if (hasAccord(/dulce/)) score += 15;
        if (/vainilla|tonka|caramelo|praliné|miel|cacao|café/.test(fullText)) score += 10;
      } else if (answers.notes === 'floral_fruity') {
        if (hasAccord(/floral|floral blanco/)) score += 25;
        if (hasAccord(/afrutado|frutal/)) score += 15;
        if (/rosa|jazmín|nardo|frutos rojos|pera|durazno|frambuesa|cereza/.test(fullText)) score += 10;
      } else if (answers.notes === 'surprise') {
        score += Math.max(0, 36 - index * 2);
      }

      return { perfume, score };
    });

    scored.sort((a, b) => b.score - a.score);
    return scored[0] ? scored[0].perfume : pool[0];
  }

  // Renderizar la Pantalla de Resultados ("Zodiaco Olfativo")
  function renderQuizResults() {
    const container = document.getElementById('perfume-quiz-content');
    if (!container) return;

    const matchedPerfume = calculateBestMatch(quizAnswers);
    if (!matchedPerfume) return;

    // Obtener o generar arquetipo y lectura
    const info = ARCHETYPES_DB[matchedPerfume.code] || generateDynamicArchetype(matchedPerfume, quizAnswers);

    // Tracking de Test Completado
    try {
      sessionStorage.setItem('kode_quiz_completed', 'true');
      sessionStorage.setItem('kode_quiz_perfume', matchedPerfume.code);
      if (window.KodeTracker && typeof window.KodeTracker.trackEvent === 'function') {
        window.KodeTracker.trackEvent('quiz_complete', {
          code: matchedPerfume.code,
          name: `Kódigo ${matchedPerfume.code}`,
          inspiration: inspiration,
          archetype: info.archetype,
          gender: quizAnswers.gender,
          vibe: quizAnswers.vibe,
          occasion: quizAnswers.occasion,
          notes: quizAnswers.notes
        });
      }
    } catch (e) {}

    const imgSrc = matchedPerfume.image || `images/kode/kode_${matchedPerfume.code}.webp`;
    const brandPart = matchedPerfume.brand ? ` (${matchedPerfume.brand})` : '';
    const inspiration = matchedPerfume.reference || matchedPerfume.name;
    const chordsList = Array.isArray(matchedPerfume.accords) 
      ? matchedPerfume.accords.slice(0, 3).map(a => `<span class="result-accord-pill" style="background:${a.bg || '#27272a'};color:${a.text || '#ffffff'};">${a.name}</span>`).join('')
      : '';

    container.innerHTML = `
      <div class="quiz-result-wrap">
        <div class="quiz-nav-top result-nav">
          <span class="quiz-result-badge">✨ TU ZODIACO OLFATIVO</span>
          <button type="button" class="quiz-close-btn" onclick="closePerfumeQuiz()" aria-label="Cerrar">✕</button>
        </div>

        <!-- Tarjeta del Signo / Arquetipo Olfativo -->
        <div class="zodiac-archetype-card">
          <div class="zodiac-header">
            <span class="zodiac-element">${info.element}</span>
            <h3 class="zodiac-title">${info.archetype}</h3>
          </div>
          <div class="zodiac-quote">
            <p class="zodiac-text">“${info.personality}”</p>
          </div>
        </div>

        <!-- Tarjeta del Perfume Ideal Recomendado -->
        <div class="result-product-card">
          <span class="result-card-eyebrow">TU PERFUME IDEAL KÖDE</span>
          
          <div class="result-product-hero">
            <img src="${imgSrc}" alt="Kódigo ${matchedPerfume.code}" class="result-product-img" onerror="this.src='images/kode_cover.png'">
            <div class="result-product-info">
              <h4 class="result-product-name">Kódigo ${matchedPerfume.code}</h4>
              <p class="result-product-inspire">Inspirado en <strong>${inspiration}</strong>${brandPart}</p>
              
              <div class="result-accords-row">
                ${chordsList}
              </div>
            </div>
          </div>

          <!-- Explicación de por qué es su match -->
          <div class="result-match-box">
            <div class="result-match-header">
              <span class="result-match-icon">🎯</span>
              <span class="result-match-label">¿Por qué es tu match perfecto?</span>
            </div>
            <p class="result-match-desc">${info.matchWhy}</p>
          </div>

          <!-- Botones de Acción -->
          <div class="result-actions-row">
            <a href="producto.html?k=${matchedPerfume.code}&from=quiz" class="apple-checkout-btn result-cta-btn" onclick="onQuizCtaClick('${matchedPerfume.code}')">
              Ver Perfume y Ordenar →
            </a>
            <button type="button" class="result-repeat-btn" onclick="resetQuiz(event)">
              🔄 Repetir Test
            </button>
          </div>
        </div>
      </div>
    `;

    // Desplazar suavemente arriba
    container.scrollTop = 0;
  }

  // Clic en CTA de resultado del test
  window.onQuizCtaClick = function(code) {
    try {
      sessionStorage.setItem('kode_from_quiz', 'true');
      if (window.KodeTracker && typeof window.KodeTracker.trackEvent === 'function') {
        window.KodeTracker.trackEvent('quiz_cta_click', { code: code });
      }
    } catch (e) {}
  };

  // Inicializar eventos de clic fuera del diálogo
  function setupQuizDialogEvents() {
    const dialog = document.getElementById('perfume-quiz-dialog');
    if (dialog) {
      dialog.addEventListener('click', (e) => {
        // Ignorar clics en el contenido interno de la tarjeta del diálogo
        if (e.target !== dialog) return;
        const rect = dialog.getBoundingClientRect();
        const isInDialog = (
          rect.top <= e.clientY &&
          e.clientY <= rect.top + rect.height &&
          rect.left <= e.clientX &&
          e.clientX <= rect.left + rect.width
        );
        if (!isInDialog) closePerfumeQuiz();
      });
    }
  }

  document.addEventListener('DOMContentLoaded', setupQuizDialogEvents);
})();
