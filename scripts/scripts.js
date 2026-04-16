async function searchPokemon() {
  const input = document.getElementById('searchInput').value.toLowerCase();
  const loadMoreBtn = document.querySelector('.load-content');
  if (input.length >= 3) {
    loadMoreBtn.classList.add('d-none');
    const filtered = ALL_POKEMON_DATA.filter((p) =>
      p.name.toLowerCase().includes(input),
    );
    CONTAINER.innerHTML = filtered
      .map((p) => getPokemonCardTemplate(p, p))
      .join('');
  } else {
    loadMoreBtn.classList.remove('d-none'); // HINZUFÜGEN
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

    ALL_POKEMON_DATA.push(detailData);
  }

  renderPokemonList();

  OFFSET += LIMIT;
}

function renderPokemonList() {
  CONTAINER.innerHTML = '';

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
  const formattedId = `#${p.id.toString().padStart(3, '0')}`;
  document.getElementById('pokemon-title').innerHTML =
    `<span class="pokemon-id-num">${formattedId}</span><span class="pokemon-name-text">${p.name}</span>`;
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
  document.getElementById('pokeDialog').classList.add('is-visible');
  document.body.classList.add('no-scroll');
}

function closeDialog() {
  document.getElementById('pokeDialog').classList.remove('is-visible'); // HINZUFÜGEN
  document.body.classList.remove('no-scroll');
}

async function renderEvolutionTab(evoData) {
  // Findet das Element über die ID, nutzt aber das Klassen-Styling aus dem CSS
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
  // 1. Alle Inhalte verstecken
  const contents = document.getElementsByClassName('tab-content');
  for (let content of contents) {
    content.classList.remove('active');
  }

  const links = document.getElementsByClassName('tab-link');
  for (let link of links) {
    link.classList.remove('active');
  }

  document.getElementById(tabName).classList.add('active');
  if (evt) {
    evt.currentTarget.classList.add('active');
  }
}

getPokemon();

async function loadMore() {
  const btn = document.querySelector('.load-btn');
  const overlay = document.getElementById('spinner-overlay');

  overlay.classList.add('is-loading');
  btn.classList.add('hidden');

  document.body.style.height = 'auto';
  document.body.style.overflowY = 'auto';
  document.querySelector('main').style.height = 'auto';
  document.querySelector('main').style.overflow = 'visible';

  // 3. Daten laden
  await new Promise((resolve) => setTimeout(resolve, 2000));
  await getPokemon();

  // 4. Spinner weg, Button wieder da
  overlay.classList.remove('is-loading');
  btn.classList.remove('hidden');
}
