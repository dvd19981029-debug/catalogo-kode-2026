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
  window.resetQuiz = function() {
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

  // Algoritmo de Coincidencia Ponderada por Mejores Ventas (Top Sellers)
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

    // 2. Puntaje ponderado dando máxima preferencia a las que más vendemos
    const scored = candidates.map(perfume => {
      let score = 0;
      const sales = perfume.sales || 0;

      // Base: Puntuación de ventas masivas (las que más tenemos y más pide la gente)
      score += Math.min(60, sales * 0.12);

      // Ponderación por vibra
      if (answers.vibe === 'power') {
        if (['343', '149', '192', '453', '677'].includes(perfume.code)) score += 40;
        if (perfume.olfactoryFamily && /amaderad|especiad|ámbar/i.test(perfume.olfactoryFamily)) score += 20;
      } else if (answers.vibe === 'seduction') {
        if (['343', '286', '495', '658', '350', '681'].includes(perfume.code)) score += 40;
        if (perfume.olfactoryFamily && /oriental|ámbar|vainill|dulce/i.test(perfume.olfactoryFamily)) score += 20;
      } else if (answers.vibe === 'fresh') {
        if (['141', '140', '161', '344', '443', '689'].includes(perfume.code)) score += 40;
        if (perfume.olfactoryFamily && /acuátic|cítric|fresc|aromátic/i.test(perfume.olfactoryFamily)) score += 20;
      } else if (answers.vibe === 'elegance') {
        if (['161', '453', '520', '679', '149'].includes(perfume.code)) score += 40;
        if (perfume.olfactoryFamily && /amaderad|floral|chipre/i.test(perfume.olfactoryFamily)) score += 20;
      } else if (answers.vibe === 'sweet') {
        if (['534', '431', '286', '658', '350', '681'].includes(perfume.code)) score += 40;
        if (perfume.olfactoryFamily && /gourmand|frutal|vainill/i.test(perfume.olfactoryFamily)) score += 20;
      }

      // Ponderación por ocasión
      if (answers.occasion === 'night') {
        if (['343', '286', '495', '658', '677', '192'].includes(perfume.code)) score += 30;
      } else if (answers.occasion === 'daily') {
        if (['161', '344', '141', '140', '453', '431', '443'].includes(perfume.code)) score += 30;
      } else if (answers.occasion === 'signature') {
        if (['161', '344', '165', '453', '534', '679'].includes(perfume.code)) score += 30;
      } else if (answers.occasion === 'events') {
        if (['343', '149', '389', '495', '658', '689'].includes(perfume.code)) score += 30;
      }

      // Ponderación por notas
      if (answers.notes === 'woody_spicy') {
        if (['343', '161', '192', '677', '679', '165'].includes(perfume.code)) score += 35;
      } else if (answers.notes === 'citrus_aquatic') {
        if (['141', '140', '161', '344', '443', '689'].includes(perfume.code)) score += 35;
      } else if (answers.notes === 'vanilla_gourmand') {
        if (['286', '350', '534', '495', '681', '658'].includes(perfume.code)) score += 35;
      } else if (answers.notes === 'floral_fruity') {
        if (['534', '431', '389', '443', '520', '453'].includes(perfume.code)) score += 35;
      } else if (answers.notes === 'surprise') {
        // En surprise, dar máximo empuje a los absolutos Top 1 y Top 2
        if (['343', '161', '534', '453', '658'].includes(perfume.code)) score += 50;
      }

      return { perfume, score };
    });

    scored.sort((a, b) => b.score - a.score);
    return scored[0] ? scored[0].perfume : candidates[0];
  }

  // Renderizar la Pantalla de Resultados ("Zodiaco Olfativo")
  function renderQuizResults() {
    const container = document.getElementById('perfume-quiz-content');
    if (!container) return;

    const matchedPerfume = calculateBestMatch(quizAnswers);
    if (!matchedPerfume) return;

    // Obtener o generar arquetipo y lectura
    const info = ARCHETYPES_DB[matchedPerfume.code] || {
      archetype: 'Esencia Magnética • El Carisma Auténtico',
      element: 'Aura Radiante ✨',
      personality: 'Tienes una presencia vibrante y segura que atrae a las personas por tu autenticidad y buen gusto innato. Tu energía deja una huella indeleble dondequiera que vayas.',
      matchWhy: `Buscabas una fragancia con carácter y estela memorable. Kódigo ${matchedPerfume.code} combina una composición equilibrada de acordes nobles con una fijación excepcional pensada para acompañarte todo el día.`
    };

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
            <button type="button" class="result-repeat-btn" onclick="resetQuiz()">
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
