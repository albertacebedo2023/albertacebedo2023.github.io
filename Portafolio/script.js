const projects = {
  ilustracion: {
    title: "Ilustración & personajes",
    description: "Archivo visual de personajes, universos y narrativas ilustradas.",
    works: [
      ["Operaciones especiales", "Concept art · Character Design", "../assets/illustration/soldado.webp"],
      ["Vein", "Digital Art · Colaboración", "../assets/illustration/vein.webp"],
      ["Santa Marta", "Digital Art · Colaboración", "../assets/illustration/santamarta.webp"],
      ["Sarah", "Digital Art · Character Design", "../assets/illustration/sarah.webp"],
      ["Fenamu", "Digital Art · Colaboraciòn", "../assets/illustration/fenamu.webp"],
      ["Caine", "Digital Art · Fan Art", "../assets/illustration/caine.webp"],
      ["Pokémon", "Fan art · Ilustración tradicional", "../assets/illustration/pokemon.webp"],
      ["Irio", "Diseño de personaje", "../assets/illustration/irio.webp"],
      ["Heimerdinger", "Fan art · Ilustración tradicional", "../assets/illustration/heimerdinger.webp"]
    ]
  },
  "3d": {
    title: "Modelado y animación 3D",
    description: "Formas, materiales y movimiento para construir objetos y personajes con presencia.",
    subcategories: {
      sketchfab: {
        title: "Modelos 3D",
        works: [
          // Formato: [Título, Descripción/Técnica, Miniatura web, ID de Sketchfab embed]
          ["Sci-Fi Trooper", "Modelado 3D · Texturas", "../assets/3D/Trooper12.jpg", "333bb80a2a154ffc8e649a0ecaa91f3b"],
          ["Sci-Fi Trooper Spec Ops", "Modelado 3D · Texturas", "../assets/3D/Trooper23.png", "a41bbf7c85194be09f6ad20f0936d4ab"],
          ["Güecha", "Modelado 3D · Texturas · Animaciòn", "../assets/3D/guecha2.png", "ceb3eb6df70b4a1a94aafa97b84738de"],
          ["Chamán", "Modelado 3D · Texturas · Animaciòn", "../assets/3D/Chaman.png", "8ba0981357364899b2ded4eff617c60d"]
        ]
      },
      animacion: {
        title: "Animaciones",
        works: [
          ["Materia en movimiento", "Animación 3D", "../assets/Animaciones/Animacion1.png", "https://www.youtube.com/embed/HcgeKYI1ZE4"],
          ["Materia en movimiento", "Animación 3D", "../assets/Animaciones/Animacion2.png","https://www.youtube.com/embed/GL2eROrhKvo?autoplay=1&rel=0"]
        ]
      }
    }
  },
  unity: {
    title: "Videojuegos",
    description: "Sistemas interactivos, mecánicas y experiencias desarrolladas en Unity.",
    works: [
      [
        "Wu Wei: Souls Of Clay",
        "Tras quinientos años de paz, el Vacío regresa. El último Soldado de Terracota deberá reunir cuatro reliquias para detenerlo y descubrir el verdadero valor de la vida.",
        "../assets/illustration/Wu Wei.jpg",
        "../assets/illustration/Wu Wei.jpg",
        "Unity 2022",
        "Plataformero",
        "Windows",
        "Prototipo",
        "Tras quinientos años de paz, el Vacío regresa bajo el mando de Wuwei para consumir el mundo. El último Soldado de Terracota debe reunir cuatro reliquias, liberar pueblos sometidos y enfrentar al enemigo. Guiado por Lián, descubrirá que proteger la vida implica aceptar tanto el sufrimiento como la esperanza.",
        [
          "Líder de Proyecto",
          "Programación",
          "Arte"
        ],
        "Jugar en Itch.io",
        "https://diegoferbz.itch.io/wuwei"
      ],
      [
        "Memorias Pasadas",
        "Entorno VR para Spatial inspirado en la cultura tairona, donde los estudiantes conocen seis personajes representativos y exploran su sociedad antes de la llegada española.",
        "../assets/illustration/MemoriasPasadas.jpg",
        "../assets/illustration/MemoriasPasadas.jpg",
        "Unity 2022",
        "VR",
        "Spatial",
        "Publicado",
        "Entorno de realidad virtual para Spatial inspirado en la cultura tairona y la Ciudad Perdida. Su objetivo es complementar las clases de historia mediante una experiencia inmersiva en la que los estudiantes conocen seis personajes representativos de la sociedad tairona y comprenden cómo vivían antes de la llegada de los españoles.",
        [
          "Programación",
          "Arte",
          "Modelado 3D",
          "Escenario"

        ],
        "Explorar en Spatial",
        "https://www.spatial.io/s/Memorias-Pasadas-69cedda17a3e760e1279d557?share=5839679443308794575"
      ]
    ]
  },
};

const projectsNav = document.querySelector("#projects-nav");
const galleryGrid = document.querySelector("#gallery-grid");
const galleryTitle = document.querySelector("#gallery-title");
const galleryDescription = document.querySelector("#gallery-description");
const subTabsContainer = document.querySelector("#sub-tabs-container");

const lightbox = document.querySelector("#lightbox");
const lightboxStage = document.querySelector("#lightbox-stage");
const lightboxMediaWrapper = document.querySelector("#lightbox-media-wrapper");
const lightboxImage = document.querySelector("#lightbox-image");
const lightboxTitle = document.querySelector("#lightbox-title");
const lightboxMeta = document.querySelector("#lightbox-meta");
const lightboxDescription = document.querySelector(".lightbox-desc");
const closeLightboxBtn = document.querySelector(".lightbox-close");
const zoomResetBtn = document.querySelector("#zoom-reset");
const lightboxControlsGroup = document.querySelector("#lightbox-controls-group");

let currentKey = "ilustracion";
let currentSubKey = null; // Para manejar subpestañas en 3D
let currentIndex = 0;
let zoom = 1;

function renderProjectsNav() {
  projectsNav.innerHTML = Object.entries(projects).map(([key, data]) => `
    <button type="button" class="project-card ${key === currentKey ? "is-active" : ""}" data-key="${key}">
      <h3>${data.title}</h3>
      <p>${data.description}</p>
    </button>
  `).join("");
}

function renderGallery(key) {
  currentKey = key;
  const currentCategory = projects[key];
  galleryTitle.textContent = currentCategory.title;
  galleryDescription.textContent = currentCategory.description;

  let activeWorks = [];

  // Si la categoría tiene subpestañas (como Modelado y animación 3D)
  if (currentCategory.subcategories) {
    if (!currentSubKey || !currentCategory.subcategories[currentSubKey]) {
      currentSubKey = Object.keys(currentCategory.subcategories)[0];
    }
    
    // Renderizar botones de subpestañas (Sketchfab vs Animaciones)
    subTabsContainer.innerHTML = `
      <div class="sub-tabs">
        ${Object.entries(currentCategory.subcategories).map(([subKey, subData]) => `
          <button type="button" class="sub-tab-btn ${subKey === currentSubKey ? "is-active" : ""}" data-subkey="${subKey}">
            ${subData.title}
          </button>
        `).join("")}
      </div>
    `;
    activeWorks = currentCategory.subcategories[currentSubKey].works;
  } else {
    subTabsContainer.innerHTML = "";
    currentSubKey = null;
    activeWorks = currentCategory.works;
  }

  galleryGrid.innerHTML = activeWorks.map((work, index) => `
    <article class="work-card" data-index="${index}">
      <div class="work-image">
        <img src="${work[2]}" alt="${work[0]}" loading="lazy" />
        <i>${key === '3d' ? (currentSubKey === 'sketchfab' ? 'Ver modelo 3D ↗' : 'Ver animación ↗') : 'Ver detalle ↗'}</i>
      </div>
      <div class="work-text">
        <div class="work-info">
          <h3>${work[0]}</h3>
          <p>${work[1]}</p>
        </div>
        <span class="work-index">#0${index + 1}</span>
      </div>
    </article>
  `).join("");

  renderProjectsNav();
}

// Evento para cambiar de categoría principal
projectsNav.addEventListener("click", event => {
  const card = event.target.closest("[data-key]");
  if (!card) return;
  renderGallery(card.dataset.key);
});

// Evento para cambiar de subpestaña (Sketchfab / Animaciones)
subTabsContainer.addEventListener("click", event => {
  const btn = event.target.closest("[data-subkey]");
  if (!btn) return;
  currentSubKey = btn.dataset.subkey;
  renderGallery(currentKey);
});

galleryGrid.addEventListener("click", event => {
  const card = event.target.closest(".work-card");
  if (!card) return;
  currentIndex = Number(card.dataset.index);
  openLightbox();
});

function openLightbox() {
  updateLightboxContent();
  zoom = 1;
  updateZoom();
  lightbox.showModal();
}

function getActiveWorkList() {
  if (projects[currentKey].subcategories) {
    return projects[currentKey].subcategories[currentSubKey].works;
  }
  return projects[currentKey].works;
}

function updateLightboxContent() {
  const workList = getActiveWorkList();
  const work = workList[currentIndex];
  
  lightboxTitle.textContent = work[0];
  lightboxMeta.textContent = work[1];
  lightboxDescription.textContent = "";
  document.querySelector("#image-counter").textContent = `${currentIndex + 1} / ${workList.length}`;

  // Si estamos en la categoría 3D y es Sketchfab
  if (currentKey === '3d' && currentSubKey === 'sketchfab') {
    lightboxControlsGroup.style.display = 'none'; // Ocultar zoom de imagen estática
    lightboxMediaWrapper.innerHTML = `
      <iframe title="${work[0]}" src="https://sketchfab.com/models/${work[3]}/embed" 
        style="width: 100%; height: 100%; border: none;" allow="autoplay; fullscreen; xr-spatial-tracking" 
        xr-spatial-tracking execution-while-out-of-viewport execution-while-not-rendered web-share>
      </iframe>
    `;
  } 
  // Si estamos en la categoría 3D y es Animación (Video)
  else if (currentKey === '3d' && currentSubKey === 'animacion') {
    lightboxControlsGroup.style.display = 'none';
    lightboxMediaWrapper.innerHTML = `
      <iframe
          src="${work[3]}?autoplay=1&rel=0"
          title="${work[0]}"
          frameborder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerpolicy="strict-origin-when-cross-origin"
          allowfullscreen>
      </iframe>
    `;
  } 
  // Si estamos en la categoría Videojuegos
  else if (currentKey === 'unity') {
    lightboxControlsGroup.style.display = 'none';
    lightboxMediaWrapper.innerHTML = `
      <div class="game-view">
        <img
          src="${work[3]}"
          class="game-banner"
          alt="${work[0]}"
        >
      </div>`;
    lightboxMeta.innerHTML = `
      <strong>Motor:</strong> ${work[4]}<br>
      <strong>Género:</strong> ${work[5]}<br>
      <strong>Plataforma:</strong> ${work[6]}<br>
      <strong>Estado:</strong> ${work[7]}`;
    lightboxDescription.innerHTML = `
      <p>${work[8]}</p>
      <br>
      <strong>Mi rol</strong>
      <ul>
        ${work[9].map(r => `<li>${r}</li>`).join("")}
      </ul>
      <br>
      <a
        href="${work[11]}"
        target="_blank"
        class="game-button">
        ${work[10]} ↗
      </a>`;
  }
  // Para Ilustración u otras secciones estándar (Imágenes con Lightbox y Zoom)
  else {
    lightboxControlsGroup.style.display = 'flex';
    lightboxMediaWrapper.innerHTML = `<img id="lightbox-image" src="${work[2]}" alt="${work[0]}" style="max-width: 100%; max-height: 100%; object-fit: contain; cursor: grab;" />`;
    lightboxDescription.textContent = "Exploración visual enfocada en la atmósfera, el volumen y la narrativa del personaje.";
  }
}

const updateZoom = () => {
  const img = document.querySelector("#lightbox-image");
  if (img) {
    img.style.transform = `scale(${zoom})`;
    if (zoomResetBtn) {
      zoomResetBtn.textContent = `${Math.round(zoom * 100)}%`;
    }
  }
};

document.querySelector("#next-work").addEventListener("click", () => {
  const workList = getActiveWorkList();
  currentIndex = (currentIndex + 1) % workList.length;
  zoom = 1;
  updateLightboxContent();
  updateZoom();
});

document.querySelector("#previous-work").addEventListener("click", () => {
  const workList = getActiveWorkList();
  currentIndex = (currentIndex - 1 + workList.length) % workList.length;
  zoom = 1;
  updateLightboxContent();
  updateZoom();
});

document.querySelector("#zoom-in").addEventListener("click", () => {
  zoom = Math.min(3, zoom + 0.25);
  updateZoom();
});

document.querySelector("#zoom-out").addEventListener("click", () => {
  zoom = Math.max(0.75, zoom - 0.25);
  updateZoom();
});

if (zoomResetBtn) {
  zoomResetBtn.addEventListener("click", () => {
    zoom = 1;
    const img = document.querySelector("#lightbox-image");
    if (img) img.style.transformOrigin = "center";
    updateZoom();
  });
}

lightboxStage.addEventListener("wheel", event => {
  if (currentKey === '3d') return; // Evitar zoom de rueda si es visor 3D/Video
  event.preventDefault();
  zoom = Math.min(3, Math.max(0.75, zoom + (event.deltaY < 0 ? 0.15 : -0.15)));
  updateZoom();
}, { passive: false });

lightboxStage.addEventListener("pointermove", event => {
  const img = document.querySelector("#lightbox-image");
  if (!img) return;
  if (zoom > 1) { 
    const rect = img.getBoundingClientRect();
    const x = Math.min(100, Math.max(0, ((event.clientX - rect.left) / rect.width) * 100));
    const y = Math.min(100, Math.max(0, ((event.clientY - rect.top) / rect.height) * 100));
    img.style.transformOrigin = `${x}% ${y}%`;
  } else {
    img.style.transformOrigin = "center";
  }
});

lightboxStage.addEventListener("pointerleave", () => {
  const img = document.querySelector("#lightbox-image");
  if (img) img.style.transformOrigin = "center";
});

closeLightboxBtn.addEventListener("click", () => {
  lightbox.close();
  lightboxMediaWrapper.innerHTML = ''; // Limpiar iframe/video al cerrar para detener reproducción de audio/memoria
});

lightbox.addEventListener("click", event => {
  if (event.target === lightbox) {
    lightbox.close();
    lightboxMediaWrapper.innerHTML = '';
  }
});

renderGallery("ilustracion");
