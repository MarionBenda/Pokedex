function getDialogTitleTemplate(id, name) {
  return `<span class="pokemon-id-num">${id}</span><span class="pokemon-name-text">${name}</span>`;
}

function getErrorTemplate(searchTerm) {
  return `
    <div class="search-error-container">
        <div class="search-error-content">
            <h2>Pokémon nicht gefunden</h2>
            <p>Wir konnten kein Pokémon finden, das "<span>${searchTerm}</span>" enthält.</p>
            <button class="search-error-btn" onclick="resetSearch()">Zurück zur Liste</button>
        </div>
    </div>`;
}

function resetSearch() {
  document.getElementById('searchInput').value = '';
  searchPokemon();
}

function getMainTemplate(pokemon) {
  const abilities = pokemon.abilities.map((a) => a.ability.name).join(', ');
  return `
    <div class="pokemon-info-container">
        <p><strong>Height:</strong> ${pokemon.height / 10} m</p>
        <p><strong>Weight:</strong> ${pokemon.weight / 10} kg</p>
        <p><strong>Base Experience:</strong> ${pokemon.base_experience}</p>
        <p><strong>Abilities:</strong> ${abilities}</p>
    </div>`;
}

function getTypeIconsTemplate(types) {
  return types
    .map((t) => {
      const color = TYPE_COLORS[t.type.name] || '#666';
      return `<div class="type-icon-circle type-icon-small" style="background-color: ${color};">
              <img src="./assets/icons/${t.type.name}.svg" class="type-icon-img">
            </div>`;
    })
    .join('');
}

function getPokemonCardTemplate(p) {
  const color = TYPE_COLORS[p.types[0].type.name] || '#F5F5F5';
  const id = `#${p.id.toString().padStart(3, '0')}`;
  return `
    <div class="pokemon-card" onclick="openPokeDialog('${p.name}')">
        <div class="card-header"><span class="pokemon-id-label">${id}</span>
            <h3 class="pokemon-name-title">${p.name.toUpperCase()}</h3></div>
        <div class="pokemon-image-container" style="background-color: ${color};">
            <img src="${p.sprites.other['official-artwork'].front_default}" class="pokemon-main-img">
        </div>
        <div class="card-types-row">${getTypeIconsTemplate(p.types)}</div>
    </div>`;
}

function getStatsTemplate(pokemon) {
  return pokemon.stats
    .map(
      (s) => `
    <div class="stat-row">
        <span class="stat-label">${s.stat.name.toUpperCase()}:</span>
        <div class="bar-bg"><div class="bar-fill" style="width: ${Math.min(s.base_stat, 100)}%;"></div></div>
        <span class="stat-value">${s.base_stat}</span>
    </div>`,
    )
    .join('');
}

function getEvolutionStepTemplate(p, index, length) {
  const img =
    p.sprites.other['official-artwork'].front_default ||
    p.sprites.front_default;
  return `
    <div class="evo-step">
        <img src="${img}" class="evo-img">
        <p class="evo-name">${p.name.toUpperCase()}</p>
    </div>
    ${index < length - 1 ? '<span class="evo-arrow">➔</span>' : ''}`;
}
