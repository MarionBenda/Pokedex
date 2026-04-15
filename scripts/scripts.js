const url = 'https://pokeapi.co/api/v2/pokemon?limit=100&offset=0';

const LIMIT = 20;
const CONTAINER = document.getElementById('pokemon-container');
let OFFSET = 0;

const typeColors = {
  fire: '#FDDFDF',
  grass: '#DEFDE0',
  electric: '#FCF7DE',
  water: '#DEF3FD',
  ground: '#f4e7da',
  rock: '#d5d5d4',
  fairy: '#fceaff',
  poison: '#98d7a5',
  bug: '#f8d5a3',
  dragon: '#97b3e1',
  psychic: '#eaeda1',
  flying: '#F5F5F5',
  fighting: '#E6E0D4',
  normal: '#F5F5F5',
};

async function getPokemon() {
  const url = `https://pokeapi.co/api/v2/pokemon?limit=${LIMIT}&offset=${OFFSET}`;
  const response = await fetch(url);
  const data = await response.json();

  let htmlCollector = '';
  for (let pokemon of data.results) {
    const detailRes = await fetch(pokemon.url);
    const detailData = await detailRes.json();
    htmlCollector += getPokemonCardTemplate(pokemon, detailData);
  }

  // Beim ersten Aufruf (OFFSET 0) den "Lade..." Text löschen
  if (OFFSET === 0) CONTAINER.innerHTML = '';

  // Neue Karten hinzufügen
  CONTAINER.innerHTML += htmlCollector;

  // OFFSET für den nächsten Klick erhöhen
  OFFSET += LIMIT;
}

async function openPokeDialog(name) {
  const p = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`).then((r) =>
    r.json(),
  );
  const s = await fetch(p.species.url).then((r) => r.json());
  const e = await fetch(s.evolution_chain.url).then((r) => r.json());

  // Header-Texte & Bild setzen
  document.getElementById('pokemon-title').innerText =
    `#${p.id.toString().padStart(3, '0')} ${p.name.toUpperCase()}`;
  document.getElementById('header-image').src =
    p.sprites.other['official-artwork'].front_default;

  // NUR den Bild-Hintergrund färben
  const color = typeColors[p.types[0].type.name] || '#FFF';
  document.getElementById('image-container').style.backgroundColor = color;

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
