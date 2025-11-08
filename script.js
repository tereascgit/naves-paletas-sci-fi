const PALETTE_KEY = 'sciFiPalettes';
const TIMESTAMP_KEY = 'sciFiTimestamp';
const FAVORITES_KEY = 'sciFiFavorites';
const CACHE_DURATION = 1000 * 60 * 60 * 24; // 1 día

const paletteList = document.getElementById('paletteList');
const favoritesList = document.getElementById('favoritesList');
const searchInput = document.getElementById('searchInput');

// Asignar directamente el evento de búsqueda
searchInput.oninput = function () {
  const query = searchInput.value.toLowerCase();
  fetchPalettes().then(palettes => {
    const filtered = palettes.filter(p => p.name.toLowerCase().includes(query));
    renderPalettes(filtered);
  });
};

function fetchPalettes() {
  const cached = localStorage.getItem(PALETTE_KEY);
  const timestamp = localStorage.getItem(TIMESTAMP_KEY);

  if (cached && timestamp && Date.now() - timestamp < CACHE_DURATION) {
    return Promise.resolve(JSON.parse(cached));
  }

  return fetch('assets/palettes.json')
    .then(response => response.json())
    .then(data => {
      localStorage.setItem(PALETTE_KEY, JSON.stringify(data));
      localStorage.setItem(TIMESTAMP_KEY, Date.now());
      return data;
    });
}

function renderPalettes(palettes) {
  paletteList.innerHTML = '';
  palettes.forEach(palette => {
    const li = document.createElement('li');
    li.className = 'palette-item';

    const title = document.createElement('h3');
    title.textContent = palette.name;
    title.className = 'palette-title';

    const colorsDiv = document.createElement('div');
    colorsDiv.className = 'palette';
    colorsDiv.dataset.name = palette.name;

    // Asignar función directamente al clic
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
    paletteList.appendChild(li);
  });
}

function renderFavorites(favorites) {
  favoritesList.innerHTML = '';
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

function toggleFavorite(palette) {
  let favorites = JSON.parse(localStorage.getItem(FAVORITES_KEY)) || [];
  const exists = favorites.find(p => p.name === palette.name);

  if (!exists) {
    favorites.push(palette);
  } else {
    favorites = favorites.filter(p => p.name !== palette.name);
  }

  localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
  renderFavorites(favorites);
}

// Inicializar la app
fetchPalettes().then(palettes => {
  renderPalettes(palettes);
  const favorites = JSON.parse(localStorage.getItem(FAVORITES_KEY)) || [];
  renderFavorites(favorites);
});