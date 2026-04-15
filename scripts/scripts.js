async function searchPokemon() {
  const input = document.getElementById('searchInput').value.toLowerCase();
  const loadMoreBtn = document.querySelector('.load-content');

  // Ab 3 Zeichen wird gefiltert
  if (input.length >= 3) {
    loadMoreBtn.style.display = 'none';
    const filtered = ALL_POKEMON_DATA.filter((p) =>
      p.name.toLowerCase().includes(input),
    );
    CONTAINER.innerHTML = filtered
      .map((p) => getPokemonCardTemplate(p, p))
      .join('');
  }
  // Wenn weniger als 3 Zeichen (inklusive 0), zeige wieder alle geladenen an
  else {
    loadMoreBtn.style.display = 'block';
    renderPokemonList(); // Hier stand vorher renderMainList (Fehler)
  }
}

async function getPokemon() {
  const url = `https://pokeapi.co/api/v2/pokemon?limit=${LIMIT}&offset=${OFFSET}`;
  const response = await fetch(url);
  const data = await response.json();

  for (let pokemon of data.results) {
    const detailRes = await fetch(pokemon.url);
    const detailData = await detailRes.json();
    // WICHTIG: Die Daten im globalen Speicher für die Suche ablegen
    ALL_POKEMON_DATA.push(detailData);
  }

  // Das eigentliche Zeichnen der Karten auslagern
  renderPokemonList();

  // OFFSET für den nächsten Klick erhöhen
  OFFSET += LIMIT;
}

// Hilfsfunktion: Zeichnet alle aktuell geladenen Pokemon in den CONTAINER
function renderPokemonList() {
  // Container leeren
  CONTAINER.innerHTML = '';
  // Karten aus dem globalen Array generieren
  ALL_POKEMON_DATA.forEach((pokemon) => {
    CONTAINER.innerHTML += getPokemonCardTemplate(pokemon, pokemon);
  });
}

async function openPokeDialog(name) {
  const p = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`).then((r) =>
    r.json(),
  );
  const s = await fetch(p.species.url).then((r) => r.json());
  const e = await fetch(s.evolution_chain.url).then((r) => r.json());
  document.getElementById('pokemon-title').innerText =
    `#${p.id.toString().padStart(3, '0')} ${p.name.toUpperCase()}`;
  document.getElementById('header-image').src =
    p.sprites.other['official-artwork'].front_default;
  document.getElementById('image-container').style.backgroundColor =
    TYPE_COLORS[p.types[0].type.name] || '#FFF';
  document.getElementById('dialog-type-icons').innerHTML = getTypeIconsTemplate(
    p.types,
  );
  document.getElementById('main-container').innerHTML = getMainTemplate(p);
  document.getElementById('stats-container').innerHTML = getStatsTemplate(p);
  await renderEvolutionTab(e);
  openTab(null, 'main-container');
  document.getElementById('pokeDialog').style.display = 'flex';
  document.body.style.overflow = 'hidden';
}

function closeDialog() {
  document.getElementById('pokeDialog').style.display = 'none';
  document.body.style.overflow = 'auto';
}

async function renderEvolutionTab(evoData) {
  const evoContainer = document.getElementById('evo-container');
  const evoChainNames = [];
  let currentStep = evoData.chain;

  while (currentStep) {
    evoChainNames.push(currentStep.species.name);
    currentStep = currentStep.evolves_to[0];
  }

  const pokemonPromises = evoChainNames.map((name) =>
    fetch(`https://pokeapi.co/api/v2/pokemon/${name}`).then((res) =>
      res.json(),
    ),
  );
  const pokemonResults = await Promise.all(pokemonPromises);

  evoContainer.innerHTML = pokemonResults
    .map((p, i) => getEvolutionStepTemplate(p, i, pokemonResults.length))
    .join('');
}

function openTab(evt, tabName) {
  const contents = document.getElementsByClassName('tab-content');
  for (let content of contents) content.style.display = 'none';

  const links = document.getElementsByClassName('tab-link');
  for (let link of links) link.classList.remove('active');

  document.getElementById(tabName).style.display = 'block';
  if (evt) evt.currentTarget.classList.add('active');
}

getPokemon();

async function loadMore() {
  const btn = document.querySelector('.load-btn');
  const overlay = document.getElementById('spinner-overlay');

  btn.style.display = 'none';
  overlay.style.display = 'flex'; // Overlay anzeigen

  await new Promise((resolve) => setTimeout(resolve, 5000)); // 5 Sekunden Pause

  await getPokemon();

  overlay.style.display = 'none';
  btn.style.display = 'block';
}
