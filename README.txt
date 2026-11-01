INVITACIÓN XV AÑOS · IRMA
=========================

Todos los archivos van juntos en la misma carpeta:
  index.html          -> contenido
  styles.css          -> estilos
  main.js             -> datos (CONFIG), carrusel, cuenta regresiva, música, WhatsApp
  fondo-*.webp        -> fondos de cada sección
  corona.webp         -> corona de la bienvenida
  intro.mp4           -> video de la intro
  intro-poster.webp   -> imagen mientras carga el video

FOTOS DEL CARRUSEL
  Ponlas en esta misma carpeta y agrégalas en CONFIG (main.js):
    galeria: ["foto1.jpg", "foto2.jpg", "foto3.jpg"],
  Recomendado: fotos verticales 4:5 (ej. 1080x1350).

INTRO Y MÚSICA
  Ya no hay botones "con música / sin música". El invitado ve la portada del
  video y un botón "Toca para abrir tu invitación". Ese mismo toque arranca
  el video y la música a la vez (un gesto real del usuario es lo que todos
  los navegadores exigen para permitir audio). Al terminar el video (o con
  "Saltar") entra directo a la invitación. El botón flotante pausa/reanuda.

MÚSICA
  YouTube:  youtubeId: "5xPM4c_fj6Y",
  MP3 (más seguro en iPhone): pon cancion.mp3 en esta carpeta y escribe
            musicaArchivo: "cancion.mp3",
  musicaInicioSegundos: 0  -> segundo donde empieza la canción.

SI LA MÚSICA NO SUENA
  1. No abras index.html con doble clic (file://). Pruébalo en GitHub Pages
     o con Live Server en VS Code.
  2. Mira la consola: "[Música] YouTube error 101/150" = el video no permite
     reproducirse fuera de YouTube. Usa otra versión o el MP3.
