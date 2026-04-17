async function searchPokemon() {
  const input = document.getElementById('searchInput').value.toLowerCase();
  const btn = document.querySelector('.load-btn');

  if (input.length < 3) {
    if (btn) btn.classList.remove('d-none');
    return renderPokemonList();
  }
  if (btn) btn.classList.add('d-none');
  const filtered = ALL_POKEMON_DATA.filter((p) =>
    p.name.toLowerCase().includes(input),
  );
  if (filtered.length === 0) {
    CONTAINER.innerHTML = getErrorTemplate(input);
  } else {
    CONTAINER.innerHTML = filtered
      .map((p) => getPokemonCardTemplate(p))
      .join('');
  }
}

async function getPokemon() {
  const url = `https://pokeapi.co/api/v2/pokemon?limit=${LIMIT}&offset=${OFFSET}`;
  const data = await fetch(url).then((r) => r.json());
  const detailPromises = data.results.map((pokemon) =>
    fetch(pokemon.url).then((r) => r.json()),
  );
  const newDetails = await Promise.all(detailPromises);

  ALL_POKEMON_DATA.push(...newDetails);
  renderPokemonList();
  OFFSET += LIMIT;
}

function renderPokemonList() {
  CONTAINER.innerHTML = ALL_POKEMON_DATA.map((p) =>
    getPokemonCardTemplate(p),
  ).join('');
}

async function openPokeDialog(name) {
  const pokemon = ALL_POKEMON_DATA.find((p) => p.name === name);
  if (!pokemon) return;
  currentPokemonName = name;
  if (!pokemon.evoData) {
    const stats = await (await fetch(pokemon.species.url)).json();
    pokemon.evoData = await (await fetch(stats.evolution_chain.url)).json();
  }
  updateDialogUI(pokemon);
  await renderEvolutionTab(pokemon.evoData);
  openTab(null, 'mainContainer');
  const dialog = document.getElementById('pokeDialog');
  dialog?.showModal();
  dialog && document.body.classList.add('no-scroll');
}

function updateDialogUI(p) {
  const formattedId = `#${p.id.toString().padStart(3, '0')}`;
  document.getElementById('pokemonTitle').innerHTML = getDialogTitleTemplate(
    formattedId,
    p.name,
  );
  document.getElementById('headerImage').src =
    p.sprites.other['official-artwork'].front_default;
  document.getElementById('imageContainer').style.backgroundColor =
    TYPE_COLORS[p.types[0].type.name] || '#FFF';
  document.getElementById('dialogTypeIcons').innerHTML = getTypeIconsTemplate(
    p.types,
  );
  document.getElementById('mainContainer').innerHTML = getMainTemplate(p);
  document.getElementById('statsContainer').innerHTML = getStatsTemplate(p);
}

function changePokemon(event, direction) {
  event.stopPropagation();

  const currentIndex = ALL_POKEMON_DATA.findIndex(
    (p) => p.name === currentPokemonName,
  );
  let nextIndex = currentIndex + direction;
  if (nextIndex >= ALL_POKEMON_DATA.length) nextIndex = 0;
  if (nextIndex < 0) nextIndex = ALL_POKEMON_DATA.length - 1;

  const nextPokemon = ALL_POKEMON_DATA[nextIndex];
  openPokeDialog(nextPokemon.name);
}

function closeDialog() {
  const dialog = document.getElementById('pokeDialog');
  dialog.close();
  document.body.classList.remove('no-scroll');
}

async function renderEvolutionTab(evoData) {
  const names = [];
  let curr = evoData.chain;
  while (curr) {
    names.push(curr.species.name);
    curr = curr.evolves_to[0];
  }
  const pokemonResults = await Promise.all(
    names.map((n) =>
      fetch(`https://pokeapi.co/api/v2/pokemon/${n}`).then((r) => r.json()),
    ),
  );
  document.getElementById('evoContainer').innerHTML = pokemonResults
    .map((p, i) => getEvolutionStepTemplate(p, i, pokemonResults.length))
    .join('');
}

function openTab(evt, tabName) {
  const contents = document.getElementsByClassName('tab-content');
  const links = document.getElementsByClassName('tab-link');
  for (let c of contents) c.classList.remove('active');
  for (let l of links) l.classList.remove('active');
  document.getElementById(tabName).classList.add('active');
  if (evt) evt.currentTarget.classList.add('active');
}

async function loadMore() {
  const btn = document.querySelector('.load-btn');
  const overlay = document.getElementById('spinnerOverlay');

  btn.disabled = true;
  overlay.classList.add('is-loading');

  try {
    await getPokemon();
  } catch (e) {
    console.error('Fehler beim Laden', e);
  } finally {
    overlay.classList.remove('is-loading');
    btn.disabled = false;
  }
}

getPokemon();
