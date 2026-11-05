(() => {
  'use strict';

  const STORAGE_KEY = 'reinoPalabrasSantiago_v1';
  const DRAFT_KEY = 'reinoPalabrasSantiago_draft_v1';
  const defaultState = { stars: 0, awarded: {}, missions: {} };
  let state = loadState();
  let toastTimer = 0;
  let activeGame = null;
  let activeQuestion = 0;
  let gameScore = 0;
  let answerLocked = false;
  let currentFilter = 'todos';
  let currentRegion = '';
  let storyQuery = '';
  let currentStory = null;
  let currentPromptIndex = 0;

  const stories = [
    {
      id:'renacuajo', title:'El renacuajo paseador', author:'Rafael Pombo', meta:'CLÁSICO COLOMBIANO · POESÍA NARRATIVA', category:'pombo', region:'Andina', emoji:'🐸', theme:'green', time:'5 min', tags:['Decisiones','Humor','Poesía narrativa'],
      summary:'Rin Rin es un renacuajo que se arregla para salir de paseo. Su aventura le enseña que escuchar los consejos y pensar antes de actuar puede evitar muchos problemas.',
      paragraphs:[
        'Rin Rin Renacuajo quiere salir a recorrer el mundo. Se pone su ropa más elegante, acomoda su sombrero y se despide de su mamá. Ella le pide que tenga cuidado, que no se deje llevar por cualquiera y que regrese a casa a tiempo. Pero Rin Rin está tan emocionado que apenas escucha sus consejos.',
        'En el camino encuentra nuevos conocidos y acepta invitaciones sin detenerse a pensar. La salida, que parecía un paseo divertido, se convierte en una aventura llena de sorpresas. Cada encuentro le muestra que no todas las decisiones son tan buenas como parecen al principio.',
        'La historia de Pombo mezcla humor, ritmo y situaciones inesperadas. Al leerla, podemos preguntarnos qué habría pasado si Rin Rin hubiera escuchado con más atención a su mamá y si hubiera pensado antes de seguir a sus nuevos compañeros.',
        'El poema nos invita a conversar sobre la responsabilidad, la confianza y las consecuencias de nuestros actos. ¡Y también nos recuerda que un personaje puede hacernos reír mientras aprendemos!'
      ],
      lesson:'Antes de tomar una decisión, piensa en lo que puede pasar y escucha los consejos de las personas que te cuidan.',
      question:'¿Qué consejo importante recibe Rin Rin antes de salir?', options:['Que tenga cuidado y regrese a tiempo','Que compre un sombrero nuevo','Que no vuelva a jugar nunca'], correct:0,
      notebook:'Escribe tres consejos que le darías a Rin Rin. Después inventa un final distinto en el que el renacuajo toma una decisión responsable.',
      note:'Guía de lectura adaptada; consulta el poema original en la Biblioteca Digital de Bogotá.'
    },
    {
      id:'simon', title:'Simón el Bobito', author:'Rafael Pombo', meta:'CLÁSICO COLOMBIANO · HUMOR', category:'pombo', region:'Andina', emoji:'🧢', theme:'yellow', time:'4 min', tags:['Ingenio','Humor','Razonamiento'],
      summary:'Simón es un niño que se mete en situaciones disparatadas porque entiende las cosas de una manera muy literal. Sus ocurrencias nos hacen reír y pensar.',
      paragraphs:[
        'Simón el Bobito es uno de los personajes más recordados de Rafael Pombo. Es un niño curioso, distraído y muy seguro de sus ideas, aunque a veces no comprende bien lo que le explican.',
        'En sus aventuras interpreta las palabras de forma literal y se inventa soluciones que terminan siendo un enredo. Cuando alguien le da una indicación, Simón parece escucharla, pero la lleva a cabo de una manera inesperada. Así aparecen situaciones exageradas y divertidas.',
        'El humor del poema nace de los malentendidos. El lector descubre que una misma frase puede entenderse de distintas maneras y que preguntar cuando algo no está claro es una buena idea.',
        'Al leer a Simón, podemos jugar con los dobles sentidos, las instrucciones y las palabras. También podemos recordar que equivocarse no nos hace menos inteligentes: lo importante es aprender, preguntar y volver a intentarlo.'
      ],
      lesson:'Cuando no entiendas una instrucción, pregunta. Escuchar con atención y aclarar las dudas ayuda a resolver problemas.',
      question:'¿De dónde nacen muchas situaciones graciosas de Simón?', options:['De sus malentendidos y ocurrencias','De sus viajes al espacio','De sus poderes mágicos'], correct:0,
      notebook:'Inventa dos instrucciones que Simón podría entender de manera equivocada. Escribe la instrucción y la interpretación graciosa.', note:'Guía de lectura adaptada; el poema original está disponible en recopilaciones de Rafael Pombo.'
    },
    {
      id:'viejecita', title:'La pobre viejecita', author:'Rafael Pombo', meta:'CLÁSICO COLOMBIANO · SÁTIRA', category:'pombo', region:'Andina', emoji:'👵', theme:'pink', time:'4 min', tags:['Ironía','Gratitud','Humor'],
      summary:'Una anciana dice que no tiene nada, aunque vive rodeada de comodidades. El contraste entre sus palabras y su realidad crea una historia llena de ironía.',
      paragraphs:[
        'La pobre viejecita es un personaje que se queja de no tener nada. Sin embargo, cuando miramos con atención su vida, descubrimos que tiene casa, comida, ropa y muchas comodidades.',
        'Rafael Pombo utiliza la exageración y la ironía para crear humor. La viejecita afirma que es muy pobre, pero las cosas que la rodean muestran exactamente lo contrario. Esa contradicción es la clave para comprender el poema.',
        'La ironía aparece cuando las palabras expresan algo distinto de lo que los hechos muestran. Por eso, al leer esta obra, debemos fijarnos no solo en lo que dice el personaje, sino también en lo que sucede a su alrededor.',
        'La historia nos da una oportunidad para conversar sobre la gratitud, las apariencias y la diferencia entre necesitar algo y querer tener cada vez más.'
      ],
      lesson:'Valorar lo que tenemos y reconocer las necesidades de otras personas nos ayuda a ser más agradecidos y solidarios.',
      question:'¿Por qué el poema resulta irónico?', options:['Porque la viejecita dice ser pobre aunque tiene muchas cosas','Porque la viejecita vive en una cueva','Porque nadie conoce a la protagonista'], correct:0,
      notebook:'Dibuja la casa de la viejecita y escribe cinco objetos que demuestren que no le falta todo. Luego escribe una frase sobre la gratitud.', note:'Guía de lectura adaptada; no reproduce el poema completo.'
    },
    {
      id:'mirringa', title:'Mirringa Mirronga', author:'Rafael Pombo', meta:'CLÁSICO COLOMBIANO · PERSONAJES', category:'pombo', region:'Andina', emoji:'🐱', theme:'purple', time:'4 min', tags:['Descripción','Imaginación','Ritmo'],
      summary:'Mirringa Mirronga, una gata muy elegante, prepara una reunión e invita a sus amigos. La historia juega con los preparativos, los modales y la imaginación.',
      paragraphs:[
        'Mirringa Mirronga es una gata que disfruta la elegancia y la vida social. Un día decide organizar una reunión y comienza a preparar todo para recibir a sus invitados. Quiere que la ocasión sea especial y que cada detalle esté en su lugar.',
        'La gata piensa en la comida, en el espacio para conversar y en la manera de recibir a sus amigos. A través de su personaje, Pombo crea escenas llenas de movimiento, sonidos y palabras juguetonas.',
        'Este poema permite imaginar cómo sería una fiesta de animales: qué llevaría cada invitado, qué música sonaría y qué ocurriría si todos llegaran al mismo tiempo. También podemos reconocer palabras que describen a los personajes y acciones que organizan la historia.',
        'Leerlo en voz alta es una buena oportunidad para practicar el ritmo y la entonación. ¡Las palabras de Pombo parecen jugar unas con otras!'
      ],
      lesson:'La imaginación convierte una situación cotidiana, como preparar una reunión, en una aventura divertida.',
      question:'¿Qué decide organizar Mirringa Mirronga?', options:['Una reunión para sus amigos','Una carrera de bicicletas','Un viaje a la Luna'], correct:0,
      notebook:'Diseña una invitación para la reunión de Mirringa. Incluye fecha imaginaria, lugar, invitados y tres cosas que habrá en la fiesta.', note:'Guía de lectura adaptada; consulta el poema en la colección Con Pombo y platillos.'
    },
    {
      id:'pastorcita', title:'Pastorcita', author:'Rafael Pombo', meta:'CLÁSICO COLOMBIANO · BÚSQUEDA', category:'pombo', region:'Andina', emoji:'🐑', theme:'green', time:'4 min', tags:['Perseverancia','Animales','Narración'],
      summary:'Una pequeña pastora sale a buscar a sus ovejas, que se han perdido. La historia acompaña su preocupación y su empeño por encontrarlas.',
      paragraphs:[
        'Pastorcita cuida con cariño a sus ovejas. Un día descubre que ya no están donde deberían y comienza a buscarlas. La noticia la entristece, pero no se queda quieta: decide recorrer los alrededores para encontrarlas.',
        'Mientras avanza, pregunta, observa y sigue pistas. La búsqueda se convierte en el centro de la historia. El personaje debe mantener la esperanza y usar su atención para descubrir por dónde pueden haberse ido los animales.',
        'El poema de Pombo tiene ritmo y repeticiones que ayudan a recordar la aventura. Podemos imaginar el paisaje, los caminos y los sonidos del campo mientras acompañamos a Pastorcita.',
        'Esta lectura invita a hablar de la responsabilidad y del cuidado de los animales. También nos permite pensar qué pasos seguiríamos nosotros si perdiéramos algo importante.'
      ],
      lesson:'La paciencia, la atención y el cuidado son importantes cuando tenemos una responsabilidad.',
      question:'¿Qué busca Pastorcita?', options:['A sus ovejas','Un tesoro de oro','Un barco perdido'], correct:0,
      notebook:'Dibuja un mapa con el camino que podría recorrer Pastorcita. Marca tres lugares donde buscaría sus ovejas y explica por qué.', note:'Guía de lectura adaptada; no reproduce el poema original.'
    },
    {
      id:'mariposa', title:'El niño y la mariposa', author:'Rafael Pombo', meta:'CLÁSICO COLOMBIANO · NATURALEZA', category:'pombo', region:'Andina', emoji:'🦋', theme:'blue', time:'3 min', tags:['Naturaleza','Diálogo','Curiosidad'],
      summary:'Un niño observa una mariposa y conversa con ella. El encuentro despierta preguntas sobre la belleza, la libertad y el mundo natural.',
      paragraphs:[
        'Un niño se encuentra con una mariposa y queda maravillado por sus colores y su vuelo. La observa con curiosidad y comienza a imaginar cómo será vivir entre flores, hojas y corrientes de aire.',
        'La mariposa representa la libertad y la belleza de la naturaleza. El encuentro invita a mirar con atención los seres pequeños que nos rodean y a descubrir que cada uno tiene una forma especial de vivir.',
        'Pombo transforma una escena sencilla en una conversación poética. Al leerla, podemos imaginar qué preguntas haríamos si pudiéramos hablar con una mariposa y qué nos respondería sobre su viaje.',
        'La lectura también nos recuerda que los animales no son juguetes: debemos observarlos sin lastimarlos y cuidar los lugares donde encuentran alimento y refugio.'
      ],
      lesson:'Observar la naturaleza con respeto nos ayuda a conocerla y protegerla.',
      question:'¿Qué despierta la curiosidad del niño?', options:['El vuelo y los colores de la mariposa','Un cohete en el jardín','Una montaña de juguetes'], correct:0,
      notebook:'Escribe un diálogo de seis líneas entre un niño y una mariposa. Incluye una pregunta sobre su viaje y un consejo para cuidar las flores.', note:'Guía de lectura adaptada; puedes encontrar este título en recopilaciones de Rafael Pombo.'
    },
    {
      id:'madremonte', title:'La Madremonte', author:'Tradición oral colombiana', meta:'LEYENDA · MONTAÑAS Y BOSQUES', category:'leyenda', region:'Andina', emoji:'🌳', theme:'green', time:'6 min', tags:['Naturaleza','Misterio','Cuidado del agua'],
      summary:'Una guardiana misteriosa protege montes, ríos y animales. Quienes dañan el bosque pueden perderse entre la niebla y escuchar su llamado.',
      paragraphs:[
        'En distintas zonas de Colombia se habla de una presencia que habita los montes húmedos y los lugares donde nacen las quebradas. La llaman Madremonte. Algunas personas la imaginan como una mujer de cabellos largos, cubiertos de hojas, musgo y ramas.',
        'Cuentan que aparece cuando alguien destruye el bosque, ensucia el agua o persigue sin necesidad a los animales. A veces se escucha su voz entre la lluvia y la neblina. Quien se adentra sin cuidado puede confundirse entre los caminos y no encontrar fácilmente la salida.',
        'En una versión que se cuenta en Caldas, la Madremonte está relacionada con la protección de los territorios y con la memoria de quienes narran estas historias. Cada familia puede agregar detalles propios: una quebrada, un árbol antiguo o un sonido que escuchó en la montaña.',
        'Aunque es una figura misteriosa, su mensaje es sencillo y poderoso: la naturaleza merece respeto. Los bosques guardan agua, dan hogar a los animales y ayudan a mantener el equilibrio de la vida.'
      ],
      lesson:'Cuidar los bosques y las fuentes de agua es responsabilidad de todas las personas.',
      question:'¿Qué protege la Madremonte en muchas versiones de la leyenda?', options:['Los montes, el agua y los animales','Los centros comerciales','Los vehículos de la ciudad'], correct:0,
      notebook:'Dibuja a la Madremonte en su bosque. Escribe un pequeño aviso con tres reglas para proteger el lugar donde vive.',
      note:'Leyenda de tradición oral con versiones regionales; esta narración es una adaptación infantil.'
    },
    {
      id:'mohan', title:'El Mohán', author:'Tradición oral del río Magdalena', meta:'LEYENDA · RÍOS Y QUEBRADAS', category:'leyenda', region:'Andina', emoji:'🧔🏽‍♂️', theme:'blue', time:'6 min', tags:['Río Magdalena','Misterio','Tradición oral'],
      summary:'Un personaje travieso y misterioso aparece cerca de ríos y quebradas. En algunos relatos cuida lugares de agua y pone a prueba la curiosidad de los viajeros.',
      paragraphs:[
        'A orillas de algunos ríos colombianos, especialmente en relatos relacionados con el Magdalena, se habla del Mohán. Unas personas lo describen como un hombre de cabello abundante, otras como un ser fuerte y misterioso que conoce cada piedra, remolino y cueva del río.',
        'A veces aparece sentado junto al agua, peinándose o tocando música. En otras historias es bromista y esconde objetos de los pescadores. Hay quienes dicen que conoce secretos de las corrientes y que puede confundir a quien se acerca sin respetar el río.',
        'En una narración de la comunidad de Pasuncha, recogida por la Biblioteca Nacional, el Mohán aparece como un anciano que recibe un pequeño regalo y, a cambio, hace brotar agua del suelo. Esta versión muestra cómo los relatos cambian y se enriquecen con la memoria de cada comunidad.',
        'El río es mucho más que un paisaje: da alimento, conecta pueblos y necesita cuidado. La leyenda nos invita a acercarnos al agua con respeto y a no olvidar las historias de quienes viven en sus orillas.'
      ],
      lesson:'Los ríos son fuentes de vida. Debemos protegerlos y escuchar las historias de las comunidades que viven junto a ellos.',
      question:'¿Con qué elemento de la naturaleza se relaciona especialmente el Mohán?', options:['Con los ríos y las quebradas','Con los volcanes nevados','Con los desiertos de arena'], correct:0,
      notebook:'Escribe una noticia imaginaria titulada “¡El Mohán apareció en el río!”. Incluye dónde ocurrió, qué vieron los testigos y qué mensaje dejó.',
      note:'La Biblioteca Nacional recoge una narración comunitaria del Mohán contada desde Pasuncha, Cundinamarca.'
    },
    {
      id:'patasola', title:'La Patasola', author:'Tradición oral colombiana', meta:'LEYENDA · CAMINOS Y MONTAÑAS', category:'leyenda', region:'Andina', emoji:'🌘', theme:'purple', time:'5 min', tags:['Bosques','Cuidado','Imaginación'],
      summary:'Una figura misteriosa aparece en caminos solitarios y montes espesos. Algunas versiones la presentan como guardiana de los animales y los bosques.',
      paragraphs:[
        'Cuando cae la tarde en algunos caminos de montaña, los mayores cuentan historias de una figura misteriosa conocida como la Patasola. Según la versión, puede aparecer como una mujer de larga cabellera o como una sombra que se mueve velozmente entre los árboles.',
        'Su nombre se relaciona con la imagen de una sola pierna o una huella extraña. En los relatos, quienes se internan en el monte pueden escuchar un llamado, ver una silueta a lo lejos o encontrar rastros que no saben explicar.',
        'En algunas narraciones se la presenta como protectora del bosque y de los animales. Por eso, los cazadores que actúan sin respeto o quienes destruyen la montaña deben tener cuidado. No todas las comunidades cuentan la historia de la misma forma: cada lugar conserva sus propios detalles.',
        'La Patasola pertenece al mundo de la imaginación y la tradición oral. Su leyenda permite conversar sobre los miedos, los sonidos de la noche y la importancia de cuidar los ecosistemas.'
      ],
      lesson:'La naturaleza no es un lugar para destruir: debemos respetar los animales, los árboles y los caminos del bosque.',
      question:'¿Qué tema aparece en muchas versiones de la leyenda de la Patasola?', options:['El cuidado del monte y sus animales','La construcción de castillos','La búsqueda de planetas'], correct:0,
      notebook:'Inventa una advertencia que un guardabosques escribiría para los visitantes. Debe tener un título y cuatro recomendaciones.',
      note:'La tradición oral conserva distintas versiones regionales; esta adaptación evita presentar una versión como la única.'
    },
    {
      id:'hojarasquin', title:'El Hojarasquín del Monte', author:'Tradición oral colombiana', meta:'LEYENDA · ÁRBOLES Y HOJAS', category:'leyenda', region:'Andina', emoji:'🍃', theme:'green', time:'5 min', tags:['Bosque','Animales','Ecología'],
      summary:'Un ser del bosque parece estar hecho de hojas y ramas. Su presencia recuerda que el monte tiene vida y que sus habitantes necesitan protección.',
      paragraphs:[
        'En algunos relatos campesinos se habla del Hojarasquín del Monte, un ser fantástico que se confunde con la vegetación. Puede parecer un caminante cubierto de hojas, una figura de ramas o una sombra que aparece y desaparece entre los troncos.',
        'Se dice que conoce los senderos ocultos y que protege a los animales pequeños. Cuando una persona entra al bosque para dañarlo, el Hojarasquín puede hacer que se desoriente o que escuche ruidos que la invitan a detenerse y pensar.',
        'La leyenda nos ayuda a imaginar el bosque como una comunidad: hay árboles, insectos, aves, hongos, agua y suelo. Todos cumplen una función y se relacionan entre sí, aunque muchas veces no los veamos.',
        'Si visitamos una montaña, debemos caminar por los senderos, no dejar basura, evitar ruidos que asusten a los animales y no arrancar plantas. Así, el Hojarasquín podrá seguir guardando sus secretos.'
      ],
      lesson:'Cada ser vivo cumple una función en el bosque. Cuidar un ecosistema significa respetar a todos sus habitantes.',
      question:'¿Con qué elementos parece confundirse el Hojarasquín?', options:['Hojas y ramas','Vidrio y plástico','Nieve y hielo'], correct:0,
      notebook:'Dibuja una criatura del bosque hecha de elementos naturales. Señala cinco partes de su cuerpo y explica qué función cumple cada una.',
      note:'Personaje mencionado en materiales culturales para niños del programa Nidos; relato adaptado.'
    },
    {
      id:'hombrecaiman', title:'El Hombre Caimán', author:'Tradición oral del Caribe colombiano', meta:'LEYENDA · PLATO, MAGDALENA', category:'leyenda', region:'Caribe', emoji:'🐊', theme:'green', time:'5 min', tags:['Caribe','Río','Tradición oral'],
      summary:'La historia cuenta cómo un hombre terminó convertido en un ser mitad humano y mitad caimán. Su relato está ligado al municipio de Plato, Magdalena.',
      paragraphs:[
        'En Plato, a orillas del río Magdalena, se cuenta la historia de un hombre que sentía una enorme curiosidad por observar a las mujeres que se bañaban en el río. Según la leyenda, buscó una manera de acercarse sin ser descubierto y pidió ayuda para conseguir una fórmula extraordinaria.',
        'El plan salió mal: la transformación no ocurrió como esperaba y quedó convertido en un ser mitad hombre y mitad caimán. Desde entonces, los relatos populares lo recuerdan como el Hombre Caimán, una figura que pertenece a la memoria cultural del municipio.',
        'Hay muchas maneras de narrar esta leyenda. En versiones contemporáneas para niños, el personaje puede convertirse en un guardián de las aguas y ayudar a proteger los humedales, los peces y las aves. Esta adaptación nos permite imaginar un nuevo destino para el personaje.',
        'La historia se relaciona con el paisaje del Caribe y con la importancia del río Magdalena. También nos invita a reflexionar sobre el respeto a la intimidad de las personas y el cuidado de los animales y del agua.'
      ],
      lesson:'La curiosidad debe ir acompañada de respeto. Además, los ríos y humedales son ecosistemas que debemos proteger.',
      question:'¿Con qué lugar se relaciona especialmente la leyenda del Hombre Caimán?', options:['Plato, Magdalena','Villa de Leyva, Boyacá','Leticia, Amazonas'], correct:0,
      notebook:'Haz una historieta de cuatro viñetas sobre el Hombre Caimán. Inventa un final en el que ayuda a proteger el río Magdalena.',
      note:'Leyenda asociada popularmente con Plato, Magdalena; existen adaptaciones y versiones distintas.'
    },
    {
      id:'tunda', title:'La Tunda', author:'Tradición oral del Pacífico', meta:'LEYENDA · SELVA Y MAR', category:'leyenda', region:'Pacífico', emoji:'🌫️', theme:'purple', time:'5 min', tags:['Pacífico','Familia','Orientación'],
      summary:'En relatos del Pacífico, la Tunda es un ser que puede cambiar de apariencia para atraer a quienes se internan en la selva. La historia habla de la importancia de no alejarse sin avisar.',
      paragraphs:[
        'En comunidades del Pacífico colombiano se cuentan relatos sobre la Tunda, un ser misterioso que conoce muy bien los caminos de la selva. Algunas versiones dicen que puede cambiar de apariencia y parecerse a alguien conocido para llamar la atención de una persona.',
        'Quien escucha su llamado puede sentirse confundido y alejarse del camino. Por eso, en las historias los mayores aconsejan caminar acompañado, avisar a dónde se va y prestar atención a las indicaciones de quienes conocen el territorio.',
        'La Tunda forma parte de una tradición oral viva, transmitida en familias y comunidades. Sus detalles cambian de un lugar a otro: algunas narraciones describen sus sonidos, otras hablan de los alimentos que ofrece y otras se concentran en cómo las personas logran regresar a casa.',
        'Al leer esta leyenda podemos pensar en la riqueza cultural del Pacífico, en sus selvas y ríos, y en la importancia de escuchar a quienes nos cuidan cuando exploramos un lugar nuevo.'
      ],
      lesson:'Explorar es emocionante, pero debemos hacerlo con cuidado, en compañía y respetando las recomendaciones de seguridad.',
      question:'¿Qué recomendación transmite esta adaptación de la leyenda?', options:['Explorar acompañado y avisar a dónde vas','Alejarse solo para encontrar atajos','Ignorar a quienes conocen el camino'], correct:0,
      notebook:'Crea un mapa sencillo de una selva imaginaria. Añade una ruta segura, un río, un puente y tres señales para orientarse.',
      note:'Leyenda de tradición oral del Pacífico; sus versiones varían entre comunidades.'
    },
    {
      id:'arbol', title:'La mochila de las palabras', author:'Cuento original del Reino', meta:'CUENTO ORIGINAL · AMISTAD Y LECTURA', category:'original', region:'Andina', emoji:'🎒', theme:'coral', time:'5 min', tags:['Amistad','Lectura','Creatividad'],
      summary:'En una escuela de montaña, una niña descubre una mochila que guarda palabras. Cada palabra pronunciada con cariño enciende una estrella.',
      paragraphs:[
        'En una escuela rodeada de montañas vivía Lucía, una niña que coleccionaba hojas, piedras y preguntas. Un lunes encontró una mochila antigua debajo de un árbol. No tenía cuadernos ni lápices: estaba llena de papelitos con palabras como “gracias”, “amistad”, “valentía” y “esperanza”.',
        'Lucía leyó una palabra en voz alta y una pequeña luz apareció dentro de la mochila. Probó con otra y surgió una estrella. La maestra explicó que aquella mochila era especial: guardaba las palabras que ayudan a construir puentes entre las personas.',
        'Lucía decidió compartir sus papelitos con el curso. Un compañero eligió “perdón” para reconciliarse con un amigo; otra niña tomó “gracias” para reconocer la ayuda de su abuela; y alguien eligió “puedo intentarlo” para atreverse a leer en voz alta.',
        'Al final del día, la mochila quedó casi vacía, pero el salón estaba lleno de pequeñas luces. Lucía comprendió que las palabras más valiosas no se guardan para siempre: se comparten, se dicen con respeto y ayudan a que otras personas brillen.'
      ],
      lesson:'Las palabras pueden animar, agradecer, reparar una amistad y hacer que otras personas se sientan valoradas.',
      question:'¿Qué hacía aparecer una estrella en la mochila?', options:['Leer y compartir palabras valiosas','Guardar monedas','Cerrar la mochila con llave'], correct:0,
      notebook:'Elige cinco palabras que te gustaría guardar en tu mochila. Explica cuándo usarías cada una y dibuja una estrella junto a tu favorita.'
    },
    {
      id:'colibri', title:'El colibrí y la puerta del árbol', author:'Cuento original del Reino', meta:'CUENTO ORIGINAL · AMAZONÍA', category:'original', region:'Amazonía', emoji:'🐦', theme:'blue', time:'6 min', tags:['Amazonía','Curiosidad','Biodiversidad'],
      summary:'Un colibrí descubre una puerta pequeñita en un árbol y entra a un mundo donde las semillas guardan recuerdos del bosque.',
      paragraphs:[
        'En una parte de la Amazonía vivía Kimi, un colibrí que volaba tan rápido que a veces olvidaba mirar los detalles. Una mañana vio una puerta diminuta en el tronco de un árbol gigantesco. La puerta tenía una manija hecha de una semilla brillante.',
        'Kimi tocó tres veces y la puerta se abrió. Al otro lado encontró una biblioteca de semillas. Cada una guardaba la memoria de una planta: dónde había crecido, qué animal había llevado su fruto y qué lluvia la había ayudado a despertar.',
        'La guardiana de aquel lugar le explicó que el bosque era una red de amistades. Las aves transportaban semillas, los insectos visitaban flores, los árboles daban sombra y el agua viajaba por la tierra. Si una parte desaparecía, muchas otras podían verse afectadas.',
        'Kimi regresó a su árbol con una misión: contar a los demás que cada ser vivo tenía un papel importante. Desde entonces voló un poco más despacio, observó mejor y ayudó a dispersar semillas por el bosque.'
      ],
      lesson:'La biodiversidad funciona como una red: plantas, animales, agua y suelo se necesitan unos a otros.',
      question:'¿Qué descubrió Kimi en la biblioteca de semillas?', options:['Que cada semilla guardaba la memoria de una planta','Que las semillas eran monedas de oro','Que los árboles podían volar'], correct:0,
      notebook:'Inventa una semilla mágica de la Amazonía. Dibuja la planta que crecerá de ella y escribe qué animal la ayudará a viajar.'
    },
    {
      id:'llano', title:'El silbido de la sabana', author:'Cuento original del Reino', meta:'CUENTO ORIGINAL · ORINOQUÍA', category:'original', region:'Orinoquía', emoji:'🐎', theme:'yellow', time:'5 min', tags:['Llanos','Coplas','Valentía'],
      summary:'Una niña llanera escucha un silbido que viaja por la sabana. Al seguirlo, descubre que el sonido anuncia la llegada de una tormenta y ayuda a su comunidad.',
      paragraphs:[
        'En una sabana de la Orinoquía vivía Martina, una niña que conocía el sonido de los grillos, el canto de las aves y el paso de los caballos. Una tarde, mientras ayudaba a recoger unas herramientas, escuchó un silbido largo que parecía venir de muy lejos.',
        'Martina pensó que era un compañero, pero el sonido se repitió desde otro lado. Miró el cielo y notó que las nubes oscuras avanzaban deprisa. Recordó que su abuelo le había enseñado a observar el viento y a reconocer cuándo se acercaba una tormenta.',
        'La niña avisó a su familia y entre todos guardaron los objetos que podían volarse, llevaron los animales a un sitio seguro y cerraron las ventanas. Poco después comenzó a llover con fuerza. El silbido no era un fantasma: era el viento que se colaba entre las ramas y los postes.',
        'Esa noche Martina inventó una copla para recordar su aventura. Comprendió que conocer el paisaje, escuchar a los mayores y trabajar en equipo puede convertir un misterio en una solución.'
      ],
      lesson:'Observar el entorno, escuchar a quienes tienen experiencia y colaborar con otros nos ayuda a cuidarnos.',
      question:'¿Qué descubre Martina al observar el cielo?', options:['Que se acerca una tormenta','Que va a nevar','Que un barco llegará a la sabana'], correct:0,
      notebook:'Escribe una copla de cuatro versos sobre el paisaje llanero. Incluye una palabra que describa el viento y otra que nombre un animal.'
    },
    {
      id:'isla', title:'La concha que escuchaba estrellas', author:'Cuento original del Reino', meta:'CUENTO ORIGINAL · REGIÓN INSULAR', category:'original', region:'Insular', emoji:'🐚', theme:'blue', time:'5 min', tags:['Islas','Mar','Escucha'],
      summary:'En una isla del Caribe, Tomás encuentra una concha que parece guardar sonidos del mar. Al escucharla con atención descubre que cada ola tiene una historia.',
      paragraphs:[
        'Tomás vivía en una isla rodeada de agua azul. Le gustaba caminar por la playa al final de la tarde y recoger conchas vacías para observar sus formas. Un día encontró una concha grande, lisa y brillante, que parecía tener una pequeña estrella dibujada en su interior.',
        'Al acercarla al oído, Tomás no escuchó solamente el rumor del mar: imaginó voces de pescadores, el vuelo de las aves y las risas de los niños que jugaban cerca de la orilla. Su abuela le explicó que una concha no guarda voces mágicas, pero puede despertar recuerdos e imaginación.',
        'Tomás decidió preguntar a las personas mayores de la isla por sus historias favoritas. Una le habló de una tormenta antigua; otra recordó una canción que se cantaba al salir a pescar; un vecino contó cómo aprendió a cuidar los arrecifes.',
        'El niño escribió cada relato en un cuaderno y lo llamó “El libro de las olas”. Descubrió que las historias de una comunidad son como el mar: viajan, cambian de forma y llegan a nuevas personas.'
      ],
      lesson:'Escuchar a las personas mayores y cuidar el mar nos ayuda a conservar la memoria y la naturaleza de una comunidad.',
      question:'¿Qué hizo Tomás después de escuchar la concha?', options:['Preguntó a los mayores por sus historias','La rompió para buscar una estrella','Se olvidó de la playa'], correct:0,
      notebook:'Entrevista a una persona de tu familia sobre un recuerdo especial. Escribe el relato en primera persona y ponle un título.'
    }
  ];

  const poems = [
    {id:'colombia', title:'Mi Colombia en una mochila', author:'Poema original del Reino', icon:'🎒', text:'Guardo un río entre mis cosas,\ny una montaña de sol,\nuna canción de las olas\ny un colibrí de color.\n\nLlevo una plaza en la tarde,\nun árbol para abrazar,\nla voz alegre de un pueblo\ny mil caminos por andar.\n\nMi mochila no es pesada,\nporque está hecha de ilusión;\nColombia cabe en mis sueños\ny también en mi corazón.', activity:'Dibuja una mochila con cinco recuerdos o lugares de Colombia que quisieras llevar contigo.'},
    {id:'lluvia', title:'La lluvia juega a la ronda', author:'Poema original del Reino', icon:'🌧️', text:'La lluvia toca la puerta,\ncon sus dedos de cristal;\nmoja la calle despierta\ny hace al tejado cantar.\n\nSalta una gota en la hoja,\notra se esconde en la flor;\nla nube pinta de plata\nlos caminos del calor.\n\nCuando la lluvia termina,\nse asoma un rayo de sol;\ny un arcoíris se estira\ncomo una cinta de color.', activity:'Subraya las palabras que riman y escribe dos versos nuevos sobre la lluvia.'},
    {id:'rio', title:'El río cuenta secretos', author:'Poema original del Reino', icon:'🏞️', text:'El río cuenta secretos\ncon su voz de chapuzón;\ndice que guarda luceros\ndebajo de un gran puente marrón.\n\nMe habla de peces pequeños,\nde piedras y de amistad;\nde árboles que dan sombra\ny niños que van a jugar.\n\nLe prometo en voz bajita,\ncon respeto y emoción:\n“Cuidaré siempre tus aguas,\nserás mi conversación”.', activity:'Escribe una promesa para cuidar los ríos de tu región. Añade una comparación poética.'},
    {id:'palabras', title:'Palabras de colores', author:'Poema original del Reino', icon:'🎨', text:'La palabra “hola” es amarilla,\ncomo una mañana feliz;\n“gracias” es verde y sencilla,\ncomo una hoja de anís.\n\n“Amistad” tiene tonos rojos,\ncalienta como un fogón;\n“sueño” pinta de violeta\nlas paredes del corazón.\n\n“Respeto” brilla en azul,\n“perdón” vuelve a florecer;\nlas palabras son colores\nque podemos escoger.', activity:'Escoge cuatro palabras y asígnales un color. Explica por qué elegiste cada uno.'},
    {id:'abuela', title:'La voz de mi abuela', author:'Poema original del Reino', icon:'🧶', text:'Mi abuela guarda historias\nen un cajón de algodón;\nunas huelen a canela,\notras suenan a canción.\n\nMe cuenta de otros caminos,\nde una casa junto al mar,\nde juegos bajo la lluvia\ny de estrellas al cenar.\n\nCuando termina el relato,\nse queda tibio el sillón;\ny yo guardo sus palabras\ncomo un tesoro en mi voz.', activity:'Pregunta a una persona de tu familia por una historia de su infancia y escribe un resumen.'},
    {id:'escuela', title:'Mi escuela es un planeta', author:'Poema original del Reino', icon:'🪐', text:'Mi escuela es un planeta\ncon mil rutas por abrir;\nhay preguntas que son cohetes\ny libros para partir.\n\nEn el patio hay universos,\nen el aula, un telescopio;\nuna idea se hace grande\ncuando la comparto con otro.\n\nCada día una aventura,\ncada clase una estación;\ny en la nave de las letras\nviaja mi imaginación.', activity:'Inventa un nombre para tu planeta-escuela y describe tres lugares que tendría.'}
  ];

  const pomboLinks = [
    {label:'📖 Colección “Con Pombo y platillos”', url:'https://maguare.gov.co/con-pombo-y-platillos/'},
    {label:'🐸 Leer “El renacuajo paseador”', url:'https://www.bibliotecadigitaldebogota.gov.co/resources/3681482/'},
    {label:'🎧 Cuentos de Pombo para escuchar', url:'https://maguare.gov.co/cuentos-al-oido/' }
  ];

  const gameSets = {
    trivia:{title:'El cofre de las preguntas', kicker:'COMPRENSIÓN LECTORA', questions:[
      {q:'¿Quién escribió El renacuajo paseador?', p:'Recuerda el rincón de los clásicos.', options:['Rafael Pombo','Gabriel García Márquez','José Asunción Silva'], a:0, why:'¡Así es! Rafael Pombo fue un poeta colombiano, autor de este clásico infantil.'},
      {q:'¿Qué protege la Madremonte en muchas versiones?', p:'Piensa en los paisajes donde vive.', options:['Bosques, agua y animales','Los edificios altos','Los trenes y aviones'], a:0, why:'¡Correcto! La leyenda se relaciona con la protección de los montes y las fuentes de agua.'},
      {q:'¿Con qué río se relacionan relatos del Mohán?', p:'Es uno de los grandes ríos de Colombia.', options:['Río Magdalena','Río Amazonas únicamente','Río Támesis'], a:0, why:'¡Muy bien! El Mohán aparece en relatos vinculados con el río Magdalena y otras corrientes.'},
      {q:'¿Qué descubrió Kimi en la biblioteca del árbol?', p:'Es el colibrí del cuento original del Reino.', options:['Semillas con memoria','Una caja de zapatos','Un barco de papel'], a:0, why:'¡Excelente! Cada semilla guardaba la memoria de una planta del bosque.'},
      {q:'¿Qué es una leyenda?', p:'Piensa en las historias que pasan de voz en voz.', options:['Un relato de tradición oral con elementos maravillosos','Una lista de compras','Una noticia deportiva'], a:0, why:'¡Correcto! Las leyendas forman parte de la tradición oral y mezclan realidad e imaginación.'}
    ]},
    words:{title:'Detectives de palabras', kicker:'GRAMÁTICA', questions:[
      {q:'¿Qué tipo de palabra es “mariposa”?', p:'Nombra un ser vivo.', options:['Sustantivo','Adjetivo','Verbo'], a:0, why:'¡Bien! “Mariposa” nombra un animal, por eso es un sustantivo.'},
      {q:'¿Qué tipo de palabra es “brillante”?', p:'Describe cómo es algo.', options:['Adjetivo','Verbo','Sustantivo'], a:0, why:'¡Exacto! “Brillante” es un adjetivo porque describe una cualidad.'},
      {q:'¿Qué tipo de palabra es “correr”?', p:'Expresa una acción.', options:['Verbo','Sustantivo','Adjetivo'], a:0, why:'¡Muy bien! “Correr” es un verbo: expresa una acción.'},
      {q:'En “el río canta”, ¿cuál es el verbo?', p:'Busca la acción de la oración.', options:['canta','río','el'], a:0, why:'¡Correcto! “Canta” es el verbo de la oración.'},
      {q:'¿Cuál es el adjetivo en “la selva misteriosa”?', p:'¿Qué palabra nos dice cómo es la selva?', options:['misteriosa','selva','la'], a:0, why:'¡Así es! “Misteriosa” describe a la selva.'}
    ]},
    rhyme:{title:'La máquina de rimar', kicker:'POESÍA Y SONIDOS', questions:[
      {q:'¿Qué palabra rima con “corazón”?', p:'Escucha el sonido final.', options:['canción','montaña','mariposa'], a:0, why:'¡Rima encontrada! Corazón y canción comparten el sonido final “-ón”.'},
      {q:'¿Qué palabra rima con “flor”?', p:'Piensa en algo que expresa cariño.', options:['amor','camino','nube'], a:0, why:'¡Correcto! Flor y amor tienen una rima consonante.'},
      {q:'Completa: “La rana salta en la…”.', p:'Busca una palabra que rime con rana.', options:['mañana','piedra','ventana'], a:0, why:'¡Muy bien! Rana y mañana riman. También podrías crear otros versos.'},
      {q:'¿Qué pareja rima?', p:'Lee las dos palabras en voz alta.', options:['mar – cantar','luna – sol','libro – árbol'], a:0, why:'¡Eso es! Mar y cantar comparten el sonido final “ar”.'},
      {q:'Completa: “En el cielo hay un lucero, que ilumina mi…”.', p:'Busca una palabra que rime con lucero.', options:['sendero','ventana','mar'], a:0, why:'¡Excelente! Lucero y sendero riman.'}
    ]},
    spelling:{title:'El misterio de las letras', kicker:'ORTOGRAFÍA', questions:[
      {q:'¿Cuál está escrita correctamente?', p:'Es la expresión que usamos para comenzar un cuento.', options:['Había una vez','Avía una ves','Había una ves'], a:0, why:'¡Correcto! “Había” lleva h y “vez” termina en z.'},
      {q:'¿Qué signo usamos al final de una pregunta?', p:'Piensa en “¿Cómo te llamas…?”', options:['?','!',';'], a:0, why:'¡Muy bien! Las preguntas se escriben con signos de interrogación: ¿ ?'},
      {q:'¿Cuál palabra necesita tilde?', p:'La sílaba fuerte está al final.', options:['canción','casa','mesa'], a:0, why:'¡Exacto! Canción es aguda y termina en n, por eso lleva tilde.'},
      {q:'¿Qué oración usa mayúscula correctamente?', p:'Los nombres propios empiezan con mayúscula.', options:['Lucía vive en Colombia.','lucía vive en colombia.','Lucía vive en colombia.'], a:0, why:'¡Correcto! Los nombres propios y el inicio de la oración llevan mayúscula.'},
      {q:'¿Cuál es la escritura correcta?', p:'Es una palabra relacionada con el agua.', options:['árbol','arbol','árv ol'], a:0, why:'¡Buen trabajo! Árbol lleva tilde porque es una palabra grave que termina en consonante distinta de n o s.'}
    ]}
  };

  const prompts = [
    '¿Qué pasaría si un colibrí encontrara una puerta secreta en un árbol de la Amazonía?',
    'Imagina que una palabra se escapa de un diccionario y comienza a cambiar los letreros de tu pueblo. ¿Qué sucede?',
    'Un día, el río Magdalena empieza a contar historias. ¿Qué secreto revela primero?',
    'Tu sombra aprende a bailar y se va de paseo sin ti. ¿Cómo la encuentras?',
    'Una niña descubre que puede conversar con los árboles. ¿Qué le pide el árbol más antiguo?',
    'El día en que todos los animales de Colombia organizaron una asamblea, ¿qué problema intentaron resolver?'
  ];

  function loadState(){
    try{
      const saved=JSON.parse(localStorage.getItem(STORAGE_KEY)||'null');
      if(!saved||typeof saved!=='object')return {...defaultState};
      return {stars:Number.isFinite(saved.stars)?Math.max(0,saved.stars):0,awarded:saved.awarded&&typeof saved.awarded==='object'?saved.awarded:{},missions:saved.missions&&typeof saved.missions==='object'?saved.missions:{}};
    }catch{return {...defaultState};}
  }
  function saveState(){try{localStorage.setItem(STORAGE_KEY,JSON.stringify(state));}catch{showToast('El navegador no pudo guardar el avance, ¡pero puedes seguir jugando!');}}
  function renderStars(){const target=document.getElementById('starCount');if(target)target.textContent=String(state.stars);}
  function award(key,amount,message){if(state.awarded[key]){showToast('¡Ya ganaste esta estrella en este navegador! Sigue con otra aventura. ⭐');return false;}state.awarded[key]=true;state.stars+=amount;saveState();renderStars();showToast(message||`¡Muy bien! Ganaste ${amount} ⭐`);sparkle();return true;}
  function showToast(message){const el=document.getElementById('toast');if(!el)return;el.textContent=message;el.classList.add('show');window.clearTimeout(toastTimer);toastTimer=window.setTimeout(()=>el.classList.remove('show'),2900);}
  function sparkle(){const symbols=['✨','⭐','🌟','🎉'];const el=document.createElement('span');el.textContent=symbols[Math.floor(Math.random()*symbols.length)];el.style.cssText='position:fixed;z-index:180;left:'+(35+Math.random()*30)+'%;top:55%;font-size:38px;pointer-events:none;animation:twinkle .7s ease-out forwards';document.body.appendChild(el);window.setTimeout(()=>el.remove(),800);}
  function escapeHtml(value){return String(value).replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));}

  function renderStories(){
    const grid=document.getElementById('storyGrid');const empty=document.getElementById('storyEmpty');if(!grid)return;
    const q=storyQuery.trim().toLocaleLowerCase('es');
    const filtered=stories.filter(story=>{
      const filterOk=currentFilter==='todos'||story.category===currentFilter;
      const regionOk=!currentRegion||story.region===currentRegion;
      const searchText=[story.title,story.author,story.region,story.summary,...story.tags].join(' ').toLocaleLowerCase('es');
      return filterOk&&regionOk&&(!q||searchText.includes(q));
    });
    grid.innerHTML=filtered.map((s,index)=>`<article class="story-card" data-theme="${s.theme}"><div class="story-art"><span class="story-index">${String(index+1).padStart(2,'0')}</span><span class="story-emoji" aria-hidden="true">${s.emoji}</span><span class="story-kind">${s.category==='pombo'?'CLÁSICO':s.category==='leyenda'?'LEYENDA':'CUENTO NUEVO'}</span></div><div class="story-body"><div class="story-meta">${escapeHtml(s.meta)}</div><h3>${escapeHtml(s.title)}</h3><p>${escapeHtml(s.summary)}</p><div class="story-tags">${s.tags.map(tag=>`<span>${escapeHtml(tag)}</span>`).join('')}</div><button class="story-open" type="button" data-story="${s.id}">¡Abrir historia! <span>↗</span></button></div></article>`).join('');
    empty.hidden=filtered.length!==0;
  }

  function renderPoems(){
    const grid=document.getElementById('poemGrid');if(!grid)return;
    grid.innerHTML=poems.map(poem=>`<article class="poem-card"><div class="poem-icon">${poem.icon}</div><h3>${escapeHtml(poem.title)}</h3><div class="poem-byline">${escapeHtml(poem.author)}</div><div class="poem-text">${escapeHtml(poem.text)}</div><div class="poem-activity"><strong>✏️ Reto del poema</strong><p>${escapeHtml(poem.activity)}</p></div><div class="poem-actions"><button class="listen-btn" type="button" data-poem-play="${poem.id}">🔊 Escuchar</button><button class="copy-poem" type="button" data-poem-copy="${poem.id}">✍️ Copiar</button><button class="stop-poem" type="button" data-stop-audio>⏹ Detener</button></div></article>`).join('');
  }

  function renderPomboLinks(){const box=document.getElementById('pomboLinks');if(box)box.innerHTML=pomboLinks.map(link=>`<a href="${link.url}" target="_blank" rel="noopener">${link.label} ↗</a>`).join('');}

  function speakText(text){
    if(!('speechSynthesis'in window)||!('SpeechSynthesisUtterance'in window)){showToast('Este navegador no tiene lectura en voz alta disponible.');return;}
    window.speechSynthesis.cancel();const utterance=new SpeechSynthesisUtterance(text);utterance.lang='es-CO';utterance.rate=.91;utterance.pitch=1.04;utterance.onstart=()=>showToast('🔊 ¡Escucha con atención!');utterance.onerror=()=>showToast('No fue posible reproducir el audio en este navegador.');window.speechSynthesis.speak(utterance);
  }
  function stopSpeech(){if('speechSynthesis'in window)window.speechSynthesis.cancel();}

  function openStory(id){
    const story=stories.find(item=>item.id===id);if(!story)return;currentStory=story;stopSpeech();
    const modal=document.getElementById('storyModal');const content=document.getElementById('modalContent');
    const paragraphs=story.paragraphs.map(p=>`<p>${escapeHtml(p)}</p>`).join('');
    content.innerHTML=`<div class="modal-eyebrow">${escapeHtml(story.meta)}</div><h2 class="modal-title" id="modalTitle">${escapeHtml(story.title)}</h2><div class="modal-meta">${escapeHtml(story.author)} · ${story.time} de lectura · Región: ${escapeHtml(story.region)}</div><div class="modal-cover">${story.emoji}</div><div class="modal-reading">${paragraphs}</div><div class="modal-lesson">💡 <strong>Lo que podemos aprender:</strong> ${escapeHtml(story.lesson)}</div><div class="modal-actions"><button type="button" id="listenStory">🔊 Escuchar historia</button><button type="button" class="secondary" id="stopStoryAudio">⏹ Detener audio</button></div><div class="modal-quiz"><h3>🧠 Comprueba lo que entendiste</h3><p>${escapeHtml(story.question)}</p><div class="game-choices">${story.options.map((opt,i)=>`<button class="game-choice" type="button" data-story-answer="${i}">${escapeHtml(opt)}</button>`).join('')}</div><div class="quiz-feedback" id="storyQuizFeedback" aria-live="polite"></div></div><p class="modal-footnote">${escapeHtml(story.note||'Relato adaptado para fines educativos.')}</p><div class="library-note"><span>📒</span><p><strong>Actividad para el cuaderno:</strong> ${escapeHtml(story.notebook)}</p></div>`;
    modal.hidden=false;document.body.style.overflow='hidden';
    document.getElementById('listenStory').addEventListener('click',()=>speakText(story.paragraphs.join(' ')));
    document.getElementById('stopStoryAudio').addEventListener('click',stopSpeech);
    content.querySelectorAll('[data-story-answer]').forEach(btn=>btn.addEventListener('click',()=>checkStoryAnswer(Number(btn.dataset.storyAnswer))));
  }
  function closeStory(){const modal=document.getElementById('storyModal');if(modal)modal.hidden=true;document.body.style.overflow='';stopSpeech();currentStory=null;}
  function checkStoryAnswer(index){if(!currentStory)return;const feedback=document.getElementById('storyQuizFeedback');const buttons=document.querySelectorAll('[data-story-answer]');if(index===currentStory.correct){buttons.forEach(btn=>{btn.disabled=true;if(Number(btn.dataset.storyAnswer)===index)btn.classList.add('correct');});feedback.textContent='¡Respuesta correcta! Ganaste 3 estrellas. 🌟';feedback.style.color='#23885f';award(`story:${currentStory.id}`,3,'¡Lectura superada! +3 estrellas ⭐');}else{const selected=Array.from(buttons).find(btn=>Number(btn.dataset.storyAnswer)===index);if(selected)selected.classList.add('wrong');feedback.textContent='¡Casi! Vuelve a leer la historia y prueba otra vez. 💪';feedback.style.color='#b35a41';}}

  function startGame(id){const set=gameSets[id];if(!set)return;activeGame=id;activeQuestion=0;gameScore=0;answerLocked=false;const arena=document.getElementById('gameArena');arena.hidden=false;document.getElementById('arenaKicker').textContent=set.kicker;renderGameQuestion();arena.scrollIntoView({behavior:'smooth',block:'center'});}
  function renderGameQuestion(){const set=gameSets[activeGame];const item=set.questions[activeQuestion];const content=document.getElementById('gameContent');const progress=document.getElementById('arenaProgress');progress.style.width=`${(activeQuestion/set.questions.length)*100}%`;answerLocked=false;content.innerHTML=`<h3 class="game-question">${escapeHtml(set.title)}</h3><p class="game-prompt">Reto ${activeQuestion+1} de ${set.questions.length} · ${escapeHtml(item.p)}</p><div class="game-question">${escapeHtml(item.q)}</div><div class="game-choices">${item.options.map((opt,i)=>`<button class="game-choice" type="button" data-game-answer="${i}">${escapeHtml(opt)}</button>`).join('')}</div><div class="answer-feedback" id="answerFeedback" aria-live="polite"></div>`;
    content.querySelectorAll('[data-game-answer]').forEach(btn=>btn.addEventListener('click',()=>answerGame(Number(btn.dataset.gameAnswer))));}
  function answerGame(index){if(answerLocked)return;const set=gameSets[activeGame];const item=set.questions[activeQuestion];const feedback=document.getElementById('answerFeedback');const buttons=Array.from(document.querySelectorAll('[data-game-answer]'));const selected=buttons[index];if(index===item.a){answerLocked=true;gameScore++;selected.classList.add('correct');buttons.forEach(btn=>btn.disabled=true);feedback.textContent=`${item.why} ⭐`;feedback.style.color='#23885f';const next=document.createElement('button');next.type='button';next.className='answer-next';next.textContent=activeQuestion===set.questions.length-1?'Ver mi resultado 🎉':'Siguiente pregunta →';next.addEventListener('click',()=>{activeQuestion++;if(activeQuestion>=set.questions.length)finishGame();else renderGameQuestion();});document.getElementById('gameContent').appendChild(next);}else{selected.classList.add('wrong');feedback.textContent='¡No te rindas! Lee la pista e inténtalo otra vez.';feedback.style.color='#ad5846';}}
  function finishGame(){const set=gameSets[activeGame];document.getElementById('arenaProgress').style.width='100%';const won=gameScore===set.questions.length;document.getElementById('gameContent').innerHTML=`<div class="game-finish"><span>${won?'🏆':'🌟'}</span><h3>${won?'¡Desafío superado!':'¡Buen intento, explorador!'}</h3><p>Respondiste correctamente ${gameScore} de ${set.questions.length} preguntas.</p><p>${won?'¡Ganaste 5 estrellas por completar el reto!': 'Puedes volver a jugar para practicar y aprender.'}</p><button class="answer-next" id="replayGame" type="button">${won?'Jugar de nuevo':'Intentarlo otra vez'} ↻</button></div>`;if(won)award(`game:${activeGame}`,5,'¡Reto completado! +5 estrellas ⭐');document.getElementById('replayGame').addEventListener('click',()=>startGame(activeGame));}
  function closeGame(){document.getElementById('gameArena').hidden=true;activeGame=null;}

  function bindEvents(){
    const menuToggle=document.getElementById('menuToggle');const nav=document.getElementById('mainNav');
    menuToggle.addEventListener('click',()=>{const open=nav.classList.toggle('open');menuToggle.setAttribute('aria-expanded',String(open));menuToggle.textContent=open?'✕':'☰';});
    nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{nav.classList.remove('open');menuToggle.setAttribute('aria-expanded','false');menuToggle.textContent='☰';}));

    document.querySelectorAll('[data-filter]').forEach(btn=>btn.addEventListener('click',()=>{currentFilter=btn.dataset.filter;currentRegion='';document.querySelectorAll('[data-filter]').forEach(b=>b.classList.toggle('active',b===btn));document.querySelectorAll('[data-region]').forEach(b=>b.classList.remove('active'));document.getElementById('regionHint').textContent='Selecciona una región para encontrar las historias relacionadas en la biblioteca.';renderStories();}));
    document.getElementById('storySearch').addEventListener('input',e=>{storyQuery=e.target.value;renderStories();});
    document.getElementById('storyGrid').addEventListener('click',e=>{const btn=e.target.closest('[data-story]');if(btn)openStory(btn.dataset.story);});
    document.querySelectorAll('[data-region]').forEach(btn=>btn.addEventListener('click',()=>{currentRegion=btn.dataset.region;currentFilter='todos';storyQuery='';document.getElementById('storySearch').value='';document.querySelectorAll('[data-filter]').forEach(b=>b.classList.toggle('active',b.dataset.filter==='todos'));document.querySelectorAll('[data-region]').forEach(b=>b.classList.toggle('active',b===btn));document.getElementById('regionHint').textContent=`Mostrando historias relacionadas con la región ${currentRegion}. ¡Sigue explorando!`;renderStories();document.getElementById('biblioteca').scrollIntoView({behavior:'smooth'});}));

    document.getElementById('poemGrid').addEventListener('click',e=>{const play=e.target.closest('[data-poem-play]');const copy=e.target.closest('[data-poem-copy]');const stop=e.target.closest('[data-stop-audio]');if(play){const poem=poems.find(p=>p.id===play.dataset.poemPlay);if(poem)speakText(poem.text);}if(stop)stopSpeech();if(copy){const poem=poems.find(p=>p.id===copy.dataset.poemCopy);if(poem){if(navigator.clipboard&&navigator.clipboard.writeText){navigator.clipboard.writeText(`${poem.title}\n${poem.text}`).then(()=>showToast('¡Poema copiado! Puedes pegarlo en tu cuaderno.')).catch(()=>showToast('No se pudo copiar desde este navegador.'));}else showToast('La opción de copiar no está disponible en este navegador.');}}});

    document.querySelectorAll('[data-close-modal]').forEach(btn=>btn.addEventListener('click',closeStory));document.addEventListener('keydown',e=>{if(e.key==='Escape'){closeStory();closeGame();}});
    document.querySelectorAll('.game-start').forEach(btn=>btn.addEventListener('click',()=>startGame(btn.dataset.game)));document.getElementById('closeGame').addEventListener('click',closeGame);

    document.querySelectorAll('[data-mission]').forEach(btn=>{const id=btn.dataset.mission;if(state.missions[id]){btn.disabled=true;btn.textContent='✓ ¡Misión completada!';}btn.addEventListener('click',()=>{if(state.missions[id])return;state.missions[id]=true;btn.disabled=true;btn.textContent='✓ ¡Misión completada!';award(`mission:${id}`,2,'¡Misión de cuaderno completada! +2 ⭐');saveState();});});
    document.getElementById('printPage').addEventListener('click',()=>window.print());

    const writerText=document.getElementById('writerText');const writerTitle=document.getElementById('writerTitle');const count=document.getElementById('wordCount');
    function updateWordCount(){const text=writerText.value.trim();const words=text?text.split(/\s+/).length:0;count.textContent=`${words} ${words===1?'palabra':'palabras'}`;}
    try{const draft=JSON.parse(localStorage.getItem(DRAFT_KEY)||'null');if(draft){writerTitle.value=typeof draft.title==='string'?draft.title:'';writerText.value=typeof draft.text==='string'?draft.text:'';updateWordCount();}}catch{}
    writerText.addEventListener('input',updateWordCount);
    document.querySelectorAll('[data-sticker]').forEach(btn=>btn.addEventListener('click',()=>{writerText.value+=(writerText.value?' ':'')+btn.dataset.sticker;writerText.focus();updateWordCount();}));
    document.getElementById('saveDraft').addEventListener('click',()=>{try{localStorage.setItem(DRAFT_KEY,JSON.stringify({title:writerTitle.value,text:writerText.value}));document.getElementById('draftFeedback').textContent='¡Borrador guardado en este dispositivo!';showToast('Tu creación quedó guardada en este navegador. 💾');}catch{document.getElementById('draftFeedback').textContent='No se pudo guardar. Puedes copiar tu texto en el cuaderno.';}});
    document.getElementById('clearDraft').addEventListener('click',()=>{if(!writerTitle.value&&!writerText.value)return;writerTitle.value='';writerText.value='';updateWordCount();try{localStorage.removeItem(DRAFT_KEY);}catch{}document.getElementById('draftFeedback').textContent='El borrador se ha borrado.';});
    document.getElementById('newPrompt').addEventListener('click',()=>{currentPromptIndex=(currentPromptIndex+1)%prompts.length;document.querySelector('.idea-cloud strong').textContent=prompts[currentPromptIndex];});

    const backTop=document.getElementById('backTop');window.addEventListener('scroll',()=>backTop.classList.toggle('visible',window.scrollY>500));backTop.addEventListener('click',()=>window.scrollTo({top:0,behavior:'smooth'}));
    document.getElementById('year').textContent=String(new Date().getFullYear());
  }

  function init(){renderStars();renderStories();renderPoems();renderPomboLinks();bindEvents();}
  init();
})();
