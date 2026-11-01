/* =========================================================
   XV AÑOS · IRMA — Configuración y funcionalidad
   Edita solo el objeto CONFIG para cambiar los datos.
   ========================================================= */

const CONFIG = {
  nombre: "Irma Roshely",

  // Fecha y hora del evento (hora de República Dominicana, UTC-4)
  fechaEvento: "2026-12-18T19:00:00-04:00",

  // Carrusel: agrega las rutas en orden. Ejemplo:
  // galeria: ["foto1.jpg", "foto2.jpg", "foto3.jpg"],
  galeria: [],
  espaciosVacios: 3, // cuántos espacios de muestra ver mientras galeria esté vacía

  lugar: {
    nombre: "Plaza Hollywood",
    direccion: "Calle Catalina Fernández de Pou 07,<br>Santo Domingo<br><em>Detrás de Downtown Center</em>",
    mapa: "https://maps.app.goo.gl/mgLiqFTWWsr7SZx89"
  },

  // Música de fondo: ID del video de YouTube (lo que va después de "v=" en el enlace)
  // Ej.: https://www.youtube.com/watch?v=RoX_ftB2Nj8  ->  "RoX_ftB2Nj8"
  youtubeId: "5xPM4c_fj6Y",
  // Opción más segura: un MP3 subido junto a la invitación, ej. "cancion.mp3".
  // Si lo pones, se usa este en vez de YouTube.
  musicaArchivo: "cancion.mp3",
  musicaInicioSegundos: 0, // desde qué segundo empieza la canción

  // Regalo: pega aquí el enlace de la lista de deseos de Amazon
  regaloUrl: "https://www.amazon.com/hz/wishlist/ls/1PI07H84A44ZQ?ref_=wl_share",

  // WhatsApp: código de país + número, sin espacios ni signos
  whatsapp: "18096061767",
  telefonoTexto: "(809) 606-1767"
};

/* ---------- Utilidades ---------- */
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

function crearImagen(src, alt) {
  const img = new Image();
  img.src = src;
  img.alt = alt;
  img.loading = "lazy";
  img.decoding = "async";
  return img;
}

/* ---------- Datos en la página ---------- */
function aplicarDatos() {
  // En la portada el nombre va en dos líneas (Irma / Roshely)
  $$("[data-nombre]").forEach(el => {
    el.innerHTML = CONFIG.nombre.split(" ").map(p => `<span class="nombre__linea">${p}</span>`).join("");
  });
  const firma = $("[data-nombre-firma]");
  if (firma) firma.firstChild.textContent = CONFIG.nombre + " ";
  const cierre = $("[data-nombre-cierre]");
  if (cierre) cierre.firstChild.textContent = CONFIG.nombre + " ";

  $("[data-lugar-nombre]").textContent = CONFIG.lugar.nombre;
  $("[data-lugar-direccion]").innerHTML = CONFIG.lugar.direccion;
  $("[data-mapa]").href = CONFIG.lugar.mapa;

  $("[data-regalo]").href = CONFIG.regaloUrl;
}

/* ---------- Carrusel ---------- */
function iniciarCarrusel() {
  const carrusel = $("[data-carrusel]");
  const pista = $("[data-pista]");
  const puntos = $("[data-puntos]");
  const fotos = CONFIG.galeria.filter(Boolean);
  const total = fotos.length || CONFIG.espaciosVacios;

  for (let i = 0; i < total; i++) {
    const slide = document.createElement("div");
    slide.className = "carrusel__slide";
    slide.setAttribute("role", "group");
    slide.setAttribute("aria-label", `Foto ${i + 1} de ${total}`);

    if (fotos.length) {
      slide.appendChild(crearImagen(fotos[i], `Foto ${i + 1} de ${CONFIG.nombre}`));
    } else {
      slide.innerHTML = `
        <div class="foto-vacia">
          <svg viewBox="0 0 24 24"><path d="M4 8h3l2-3h6l2 3h3v11H4z"/><circle cx="12" cy="13" r="3.5"/></svg>
          <span>Foto ${i + 1}</span>
        </div>`;
    }
    pista.appendChild(slide);

    const punto = document.createElement("button");
    punto.type = "button";
    punto.setAttribute("role", "tab");
    punto.setAttribute("aria-label", `Ver foto ${i + 1}`);
    punto.addEventListener("click", () => { ir(i); reiniciarAuto(); });
    puntos.appendChild(punto);
  }

  let actual = 0;
  let auto = null;

  function ir(i) {
    actual = (i + total) % total;
    pista.style.transform = `translateX(-${actual * 100}%)`;
    $$("button", puntos).forEach((p, n) => p.setAttribute("aria-selected", n === actual));
  }
  function reiniciarAuto() {
    clearInterval(auto);
    if (total > 1 && !matchMedia("(prefers-reduced-motion: reduce)").matches) {
      auto = setInterval(() => ir(actual + 1), 4500);
    }
  }

  $("[data-prev]").addEventListener("click", () => { ir(actual - 1); reiniciarAuto(); });
  $("[data-next]").addEventListener("click", () => { ir(actual + 1); reiniciarAuto(); });

  // Deslizar con el dedo
  let inicioX = null;
  carrusel.addEventListener("touchstart", e => { inicioX = e.touches[0].clientX; }, { passive: true });
  carrusel.addEventListener("touchend", e => {
    if (inicioX === null) return;
    const dx = e.changedTouches[0].clientX - inicioX;
    if (Math.abs(dx) > 40) { ir(actual + (dx < 0 ? 1 : -1)); reiniciarAuto(); }
    inicioX = null;
  });

  if (total < 2) $$(".carrusel__flecha").forEach(b => (b.hidden = true));
  ir(0);
  reiniciarAuto();
}

/* ---------- Cuenta regresiva ---------- */
function iniciarCuenta() {
  const destino = new Date(CONFIG.fechaEvento).getTime();
  const el = {
    d: $("[data-dias]"), h: $("[data-horas]"),
    m: $("[data-minutos]"), s: $("[data-segundos]"),
    cuenta: $("[data-cuenta]"), fin: $("[data-cuenta-fin]")
  };
  const dos = n => String(n).padStart(2, "0");

  function tick() {
    const resta = destino - Date.now();
    if (resta <= 0) {
      el.cuenta.hidden = true;
      el.fin.hidden = false;
      clearInterval(timer);
      return;
    }
    el.d.textContent = dos(Math.floor(resta / 86400000));
    el.h.textContent = dos(Math.floor(resta / 3600000) % 24);
    el.m.textContent = dos(Math.floor(resta / 60000) % 60);
    el.s.textContent = dos(Math.floor(resta / 1000) % 60);
  }
  const timer = setInterval(tick, 1000);
  tick();
}

/* ---------- Confirmación por WhatsApp ---------- */
function iniciarRSVP() {
  const texto =
    `Confirmo mi asistencia a los XV años de ${CONFIG.nombre} ` +
    `el viernes 18 de diciembre a las 7:00 p. m. 💜`;
  $("[data-rsvp]").href = `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(texto)}`;
}

/* =========================================================
   INTRO · UN TOQUE → VIDEO + MÚSICA → INVITACIÓN
   El mismo toque que inicia el video inicia la música. Al ser un
   gesto real del usuario, Chrome, Safari (iPhone), Firefox, Edge y
   Samsung Internet permiten el audio.
   ========================================================= */
let player = null;
let playerListo = false;
let sonando = false;
let quiereMusica = false;

function iniciarIntro() {
  const intro = $("#intro");
  const video = $("#introVideo");
  const tocar = $("#introTocar");
  const saltar = $("#introSaltar");
  let iniciado = false;
  let dentro = false;

  tocar.addEventListener("click", () => {
    if (iniciado) return;
    iniciado = true;
    // IMPORTANTE: música y video se llaman aquí mismo, de forma
    // síncrona dentro del toque (requisito de iOS Safari).
    quiereMusica = true;
    reproducir();
    tocar.hidden = true;
    saltar.hidden = false;
    const p = video.play();
    if (p && p.catch) p.catch(entrar);
  });

  video.addEventListener("ended", entrar);
  video.addEventListener("error", () => { if (iniciado) entrar(); });
  saltar.addEventListener("click", () => {
    if (quiereMusica && !sonando) reproducir(); // otro gesto: reintenta la música
    video.pause();
    entrar();
  });

  function entrar() {
    if (dentro) return;
    dentro = true;
    intro.classList.add("intro--final");
    $("#musicaToggle").hidden = false;
    actualizarIconoMusica();
    setTimeout(() => {
      intro.classList.add("intro--saliendo");
      document.body.classList.remove("intro-activa");
      document.body.classList.add("abierta");
      window.scrollTo(0, 0);
      setTimeout(() => { intro.remove(); }, 1400);
    }, 500);
  }

  // Red de seguridad: si por algún motivo la música aún no suena
  // (p. ej. YouTube terminó de cargar después del toque), el próximo
  // toque o desplazamiento con el dedo dentro de la invitación la arranca.
  const reintentar = () => {
    if (!quiereMusica || sonando) return;
    reproducir();
  };
  ["pointerup", "touchend", "click", "keydown"].forEach(ev =>
    document.addEventListener(ev, reintentar, { passive: true })
  );
}

/* ---------- Música: MP3 propio o YouTube (precargado desde el inicio) ---------- */
let usarArchivo = false;

function cargarMusica() {
  const audio = $("#musicaAudio");
  if (CONFIG.musicaArchivo) {
    usarArchivo = true;
    audio.src = CONFIG.musicaArchivo;
    audio.addEventListener("playing", () => { sonando = true; actualizarIconoMusica(); });
    audio.addEventListener("pause", () => { sonando = false; actualizarIconoMusica(); });
    audio.addEventListener("loadedmetadata", () => {
      if (CONFIG.musicaInicioSegundos) audio.currentTime = CONFIG.musicaInicioSegundos;
    }, { once: true });
    audio.load();
    habilitarBotonMusica();
    return;
  }
  cargarYouTube();
}

function cargarYouTube() {
  if (!CONFIG.youtubeId) { habilitarBotonMusica(); return; }
  if (location.protocol === "file:") {
    console.warn("[Música] YouTube no suena abriendo el archivo directo (file://). " +
                 "Prueba desde GitHub Pages o con un servidor local (ej. Live Server).");
  }
  window.onYouTubeIframeAPIReady = crearReproductor;
  const s = document.createElement("script");
  s.src = "https://www.youtube.com/iframe_api";
  s.onerror = habilitarBotonMusica;
  document.body.appendChild(s);
  // Si la red está lenta, no dejamos al invitado esperando.
  setTimeout(habilitarBotonMusica, 6000);
}

function crearReproductor() {
  if (player) return;
  const vars = {
    autoplay: 0, controls: 0, disablekb: 1, fs: 0, loop: 1,
    modestbranding: 1, playsinline: 1, rel: 0, iv_load_policy: 3,
    playlist: CONFIG.youtubeId, start: CONFIG.musicaInicioSegundos, enablejsapi: 1
  };
  if (location.protocol.startsWith("http")) vars.origin = location.origin;

  player = new YT.Player("youtube-player", {
    width: "200", height: "200",
    videoId: CONFIG.youtubeId,
    host: "https://www.youtube.com",
    playerVars: vars,
    events: {
      onReady: e => {
        playerListo = true;
        e.target.setVolume(100);
        e.target.unMute();
        habilitarBotonMusica();
        // Si eligieron música antes de que cargara, arranca ahora.
        if (quiereMusica && !sonando) e.target.playVideo();
      },
      onStateChange: e => {
        if (e.data === YT.PlayerState.PLAYING) sonando = true;
        else if (e.data === YT.PlayerState.PAUSED || e.data === YT.PlayerState.ENDED) sonando = false;
        actualizarIconoMusica();
      },
      onError: e => {
        const motivos = {
          2: "ID de video inválido",
          5: "error del reproductor HTML5",
          100: "el video no existe o es privado",
          101: "el dueño no permite reproducirlo fuera de YouTube",
          150: "el dueño no permite reproducirlo fuera de YouTube",
          153: "falta el origen de la página (ábrela desde un sitio web, no como archivo)"
        };
        console.warn(`[Música] YouTube error ${e.data}: ${motivos[e.data] || "desconocido"}`);
        playerListo = false;
        habilitarBotonMusica();
      }
    }
  });
}

// La música se precarga mientras el invitado ve la portada del video.
// El botón de toque se muestra "cargando" hasta que la música esté lista
// (máx. 6 s), para que el toque pueda arrancarla en todos los navegadores.
function habilitarBotonMusica() {
  const b = $("#introTocar");
  if (b && b.disabled) {
    b.disabled = false;
    $("#introTocarTexto").textContent = "Toca aquí";
  }
}
function bloquearBotonHastaMusica() {
  const b = $("#introTocar");
  if (!b) return;
  b.disabled = true;
  $("#introTocarTexto").textContent = "Cargando…";
}

function reproducir() {
  if (usarArchivo) {
    const audio = $("#musicaAudio");
    audio.volume = 1;
    const p = audio.play();
    if (p && p.catch) p.catch(err => console.warn("[Música] No se pudo reproducir el MP3:", err));
    return;
  }
  if (playerListo && player) {
    player.unMute();
    player.playVideo(); // "sonando" lo confirma onStateChange
  }
  actualizarIconoMusica();
}

function pausar() {
  quiereMusica = false; // el invitado la pausó: no reintentar sola
  if (usarArchivo) { $("#musicaAudio").pause(); return; }
  if (player && playerListo) player.pauseVideo();
  sonando = false;
  actualizarIconoMusica();
}

function actualizarIconoMusica() {
  const b = $("#musicaToggle");
  if (!b) return;
  b.setAttribute("aria-pressed", sonando);
  b.setAttribute("aria-label", sonando ? "Pausar música" : "Reproducir música");
}

function iniciarBotonMusica() {
  $("#musicaToggle").addEventListener("click", () => {
    if (sonando) pausar();
    else { quiereMusica = true; reproducir(); }
  });
}

/* ---------- Inicio ---------- */
document.addEventListener("DOMContentLoaded", () => {
  aplicarDatos();
  iniciarCarrusel();
  iniciarCuenta();
  iniciarRSVP();
  iniciarBotonMusica();
  bloquearBotonHastaMusica();
  cargarMusica();
  iniciarIntro();
});
