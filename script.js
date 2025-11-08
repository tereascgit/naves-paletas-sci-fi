// Claves para guardar favoritos en localStorage
const FAVORITES_KEY = 'sciFiFavorites';

// Referencias a elementos del DOM
const paletteList = document.getElementById('paletteList');
const favoritesList = document.getElementById('favoritesList');
const searchInput = document.getElementById('searchInput');

// Evento de búsqueda: se activa cada vez que el usuario escribe
searchInput.oninput = function () {
  const query = searchInput.value.toLowerCase();

  // Cargar paletas y filtrar por nombre
  fetch('assets/palettes.json')
    .then(response => response.json())
    .then(palettes => {
      const filtered = palettes.filter(p => p.name.toLowerCase().includes(query));
      renderPalettes(filtered);
    });
};

// Renderiza todas las paletas en pantalla
function renderPalettes(palettes) {
  paletteList.innerHTML = ''; // Limpiar lista anterior

  palettes.forEach(palette => {
    // Crear elemento de lista
    const li = document.createElement('li');
    li.className = 'palette-item';

    // Crear título con el nombre de la paleta
    const title = document.createElement('h3');
    title.textContent = palette.name;
    title.className = 'palette-title';

    // Crear contenedor de colores
    const colorsDiv = document.createElement('div');
    colorsDiv.className = 'palette';
    colorsDiv.dataset.name = palette.name;

    // Al hacer clic en la paleta, se marca como favorita
    colorsDiv.onclick = function () {
      toggleFavorite(palette);
    };

    // Crear cada color dentro de la paleta
    palette.colors.forEach(color => {
      const colorDiv = document.createElement('div');
      colorDiv.className = 'palette_color';
      colorDiv.style.backgroundColor = color;
      colorsDiv.appendChild(colorDiv);
    });

    // Añadir título y colores al elemento de lista
    li.appendChild(title);
    li.appendChild(colorsDiv);
    paletteList.appendChild(li);
  });
}

// Renderiza las paletas favoritas en su sección
function renderFavorites(favorites) {
  favoritesList.innerHTML = ''; // Limpiar lista anterior

  favorites.forEach(palette => {
    const li = document.createElement('li');
    li.className = 'palette-item';

    const title = document.createElement('h3');
    title.textContent = palette.name;
    title.className = 'palette-title';

    const colorsDiv = document.createElement('div');
    colorsDiv.className = 'palette';

    colorsDiv.onclick = function () {
      toggleFavorite(palette);
    };

    palette.colors.forEach(color => {
      const colorDiv = document.createElement('div');
      colorDiv.className = 'palette_color';
      colorDiv.style.backgroundColor = color;
      colorsDiv.appendChild(colorDiv);
    });

    li.appendChild(title);
    li.appendChild(colorsDiv);
    favoritesList.appendChild(li);
  });
}

// Añade o elimina una paleta de la lista de favoritas
function toggleFavorite(palette) {
  let favorites = JSON.parse(localStorage.getItem(FAVORITES_KEY)) || [];

  const exists = favorites.find(p => p.name === palette.name);

  if (!exists) {
    favorites.push(palette); // Añadir si no existe
  } else {
    favorites = favorites.filter(p => p.name !== palette.name); // Eliminar si ya está
  }

  localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
  renderFavorites(favorites); // Actualizar vista
}

// Cargar paletas y favoritas al iniciar la página
fetch('assets/palettes.json')
  .then(response => response.json())
  .then(palettes => {
    renderPalettes(palettes);

    const favorites = JSON.parse(localStorage.getItem(FAVORITES_KEY)) || [];
    renderFavorites(favorites);
  });
