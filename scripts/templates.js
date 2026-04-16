function getMainTemplate(pokemon) {
  const abilities = pokemon.abilities.map((a) => a.ability.name).join(', ');
  return `
    <div class="pokemon-info-container"> <!-- Klasse statt Inline-Style -->
        <p><strong>Height:</strong> ${pokemon.height / 10} m</p>
        <p><strong>Weight:</strong> ${pokemon.weight / 10} kg</p>
        <p><strong>Base Experience:</strong> ${pokemon.base_experience}</p>
        <p><strong>Abilities:</strong> ${abilities}</p>
    </div>
  `;
}

function getTypeIconsTemplate(types) {
  return types
    .map((t) => {
      const typeColor = TYPE_COLORS[t.type.name] || '#666';
      return `
      <div class="type-icon-circle type-icon-small" style="background-color: ${typeColor};">
        <img src="./assets/icons/${t.type.name}.svg" class="type-icon-img">
      </div>`;
    })
    .join('');
}

function getPokemonCardTemplate(pokemon, detailData) {
  const mainType = detailData.types[0].type.name;
  const bgColor = TYPE_COLORS[mainType] || '#F5F5F5';
  const pokemonId = `#${detailData.id.toString().padStart(3, '0')}`;

  const typesHtml = detailData.types
    .map((t) => {
      const typeColor = TYPE_COLORS[t.type.name] || '#666';
      return `
      <div title="${t.type.name}" class="type-icon-circle type-icon-card" style="background-color: ${typeColor};">
        <img src="./assets/icons/${t.type.name}.svg" alt="${t.type.name}" class="type-icon-img">
      </div>`;
    })
    .join(' ');

  return `
    <div class="pokemon-card" onclick="openPokeDialog('${pokemon.name}')">
        <div class="card-header">
            <span class="pokemon-id-label">${pokemonId}</span>
            <h3 class="pokemon-name-title">${pokemon.name.toUpperCase()}</h3>
        </div>
        
        <div class="pokemon-image-container" style="background-color: ${bgColor};">
            <img src="${detailData.sprites.other['official-artwork'].front_default}" 
                 alt="${pokemon.name}" class="pokemon-main-img">
        </div>

        <div class="card-types-row">
            ${typesHtml}
        </div>
    </div>
  `;
}

function getStatsTemplate(pokemon) {
  return pokemon.stats
    .map(
      (s) => `
    <div class="stat-row">
        <span class="stat-label">${s.stat.name.toUpperCase()}:</span>
        <div class="bar-bg">
            <div class="bar-fill" style="width: ${Math.min(s.base_stat, 100)}%;"></div>
        </div>
        <span class="stat-value">${s.base_stat}</span>
    </div>
  `,
    )
    .join('');
}

function getEvolutionStepTemplate(p, index, length) {
  return `
    
    <div class="evo-step">
        <img src="${p.sprites.other['official-artwork'].front_default || p.sprites.front_default}" 
             alt="${p.name}" class="evo-img">
        <p class="evo-name">${p.name.toUpperCase()}</p>
    </div>
    ${index < length - 1 ? '<span class="evo-arrow">➔</span>' : ''}
  `;
}
