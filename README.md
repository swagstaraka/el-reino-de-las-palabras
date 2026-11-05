# 🏰 El Reino de las Palabras — con el Profe Santiago

Sitio educativo estático de Lengua Castellana para niños y niñas de 10 a 12 años. Reúne cuentos y leyendas colombianas adaptadas, clásicos de Rafael Pombo, poemas originales para escuchar, conceptos de lenguaje, juegos, escritura creativa y misiones para el cuaderno.

## ✨ ¿Qué incluye?

- **Biblioteca con 16 historias:** seis guías de lectura de clásicos de Rafael Pombo, seis leyendas de tradición oral colombiana y dos cuentos originales escritos para este proyecto.
- **Seis poemas originales** que se pueden escuchar con la voz del navegador.
- **Rincón de Rafael Pombo** con información del autor y enlaces a recursos de bibliotecas y del Ministerio de las Culturas.
- **Caja de herramientas del lenguaje:** cuento, leyenda, fábula, poema, personajes, narrador, ambiente, adjetivos, verbos y rima.
- **Taller de escritura:** espacio para inventar un cuento o poema, añadir stickers y guardar el borrador localmente.
- **Cuatro juegos interactivos:** comprensión lectora, clasificación de palabras, rimas y ortografía.
- **Misiones para el cuaderno:** cuatro actividades guiadas que se pueden imprimir.
- **Recompensas sencillas:** estrellas al responder correctamente o completar una misión. No hay perfiles, usuarios, contraseñas, niveles ni sección de logros.
- **GitHub Actions:** publicación automática en GitHub Pages al hacer push a la rama `main`.

## 🧩 Tecnología y privacidad

Este proyecto usa únicamente HTML, CSS y JavaScript. No necesita servidor, API, base de datos, registro, backend ni proceso de compilación.

Las estrellas, las misiones completadas y el borrador del taller se guardan con `localStorage` en el navegador y dispositivo donde se usa la página. No se envían a un servidor y no se sincronizan entre computadores. Al borrar los datos del navegador, se puede perder ese avance.

La función de lectura en voz alta utiliza `SpeechSynthesis` del navegador. La voz disponible depende del dispositivo y del navegador; algunos equipos pueden no tener una voz española instalada. El sitio funciona aunque esa función no esté disponible.

Las fuentes tipográficas se cargan desde Google Fonts cuando hay conexión; si no, se usan fuentes alternativas instaladas en el dispositivo.

## 🚀 Publicar gratis con GitHub Pages y Actions

1. Descarga y descomprime el archivo ZIP.
2. Crea un repositorio en GitHub. Para usar GitHub Free con Pages, utiliza un repositorio público.
3. Sube **todo el contenido** de esta carpeta a la raíz del repositorio. Deben quedar `index.html`, `styles.css`, `app.js`, `assets/` y `.github/workflows/deploy.yml` en la raíz/ruta indicada.
4. En GitHub, abre **Settings → Pages**.
5. En **Build and deployment → Source**, selecciona **GitHub Actions**.
6. Abre la pestaña **Actions** y espera a que termine el flujo **Publicar El Reino de las Palabras**.
7. Cuando el flujo termine correctamente, GitHub mostrará la URL de GitHub Pages. Normalmente tendrá esta forma:

   `https://TU-USUARIO.github.io/NOMBRE-DEL-REPOSITORIO/`

Cada actualización que subas a `main` volverá a publicar el sitio automáticamente. También puedes iniciar la publicación manualmente desde **Actions → Publicar El Reino de las Palabras → Run workflow**.

## 🖥️ Probar en tu computador

Puedes abrir `index.html` directamente con un navegador moderno. Para una prueba local más parecida a GitHub Pages, inicia un servidor estático desde la carpeta del proyecto, por ejemplo:

```bash
python -m http.server 8000
```

Luego abre `http://localhost:8000`.

## 📚 Fuentes de consulta y criterio de adaptación

- [Maguaré — Con Pombo y platillos](https://maguare.gov.co/con-pombo-y-platillos/), colección de clásicos infantiles de Rafael Pombo.
- [Biblioteca Digital de Bogotá — El renacuajo paseador](https://www.bibliotecadigitaldebogota.gov.co/resources/3681482/), ejemplar de libre acceso y ficha de la obra.
- [Biblioteca Nacional de Colombia — La Madremonte](https://www.bibliotecanacional.gov.co/es-co/Bibliotecas-en-Red/bibliotecas-publicas-moviles/Itinerancias/la-madremonte.html), relato de tradición oral compartido desde Caldas.
- [Biblioteca Nacional de Colombia — Cuento del Mohán](https://www.bibliotecanacional.gov.co/es-co/Bibliotecas-en-Red/bibliotecas-publicas-moviles/Itinerancias/cuento-del-mohan.html), relato compartido por la comunidad de Pasuncha, Cundinamarca.
- [Nidos — Me contaban los abuelos](https://nidos.gov.co/juega-con-nidos/me-contaban-los-abuelos), material cultural para niños sobre personajes de la tradición oral, entre ellos la Patasola, el Hombre Caimán y el Hojarasquín.

**Nota editorial:** las historias de tradición oral pueden tener variantes locales. Las versiones narrativas de este sitio se redactaron como adaptaciones educativas y no pretenden ser la única versión. Las fichas de Rafael Pombo son guías y resúmenes, no reproducciones completas de sus poemas. Los seis poemas de la sección de poesía y los dos cuentos marcados como originales fueron creados para este proyecto.

---

Hecho para leer, imaginar, conversar y crear. 💜
