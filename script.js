const paletteList = document.getElementById('paletteList');
const favoritesList = document.getElementById('favoritesList');
const searchInput = document.getElementById('searchInput');

const PALETTE_KEY = 'cachedPalettes';
const FAVORITES_KEY = 'favoritePalettes';
const TIMESTAMP_KEY = 'cacheTimestamp';
const CACHE_DURATION = 1000 * 60 * 60 * 24; // 1 día

function fetchPalettes() {
  const cached = localStorage.getItem(PALETTE_KEY);
  const timestamp = localStorage.getItem(TIMESTAMP_KEY);

  if (cached && timestamp && Date.now() - timestamp < CACHE_DURATION) {
    return Promise.resolve(JSON.parse(cached));
  }

  return fetch('assets/palettes.json')
    .then(res => res.json())
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
    li.classList.add('palette-item');

    const title = document.createElement('h3');
    title.textContent = palette.name;
    title.classList.add('palette-title');

    const colorsDiv = document.createElement('div');
    colorsDiv.classList.add('palette');

    palette.colors.forEach(color => {
      const colorDiv = document.createElement('div');
      colorDiv.classList.add('palette_color');
      colorDiv.style.backgroundColor = color;
      colorsDiv.appendChild(colorDiv);
    });

    colorsDiv.addEventListener('click', () => toggleFavorite(palette));

    li.appendChild(title);
    li.appendChild(colorsDiv);
    paletteList.appendChild(li);
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
  highlightFavorites(favorites);
}

function renderFavorites(favorites) {
  favoritesList.innerHTML = '';
  favorites.forEach(palette => {
    const title = document.createElement('h3');
    title.textContent = palette.name;
    title.style.marginBottom = '5px';
    title.style.color = '#fff';
    favoritesList.appendChild(title);

    const div = document.createElement('div');
    div.classList.add('palette');

    palette.colors.forEach(color => {
      const colorDiv = document.createElement('div');
      colorDiv.classList.add('palette_color');
      colorDiv.style.backgroundColor = color;
      div.appendChild(colorDiv);
    });

    favoritesList.appendChild(div);
  });
}

function highlightFavorites(favorites) {
  document.querySelectorAll('.palette').forEach(div => {
    const name = div.dataset.name;
    if (favorites.find(p => p.name === name)) {
      div.classList.add('selected');
    } else {
      div.classList.remove('selected');
    }
  });
}

searchInput.addEventListener('input', () => {
  const query = searchInput.value.toLowerCase();
  fetchPalettes().then(palettes => {
    const filtered = palettes.filter(p => p.name.toLowerCase().includes(query));
    renderPalettes(filtered);
    highlightFavorites(JSON.parse(localStorage.getItem(FAVORITES_KEY)) || []);
  });
});

fetchPalettes().then(palettes => {
  renderPalettes(palettes);
  renderFavorites(JSON.parse(localStorage.getItem(FAVORITES_KEY)) || []);
  highlightFavorites(JSON.parse(localStorage.getItem(FAVORITES_KEY)) || []);
});
