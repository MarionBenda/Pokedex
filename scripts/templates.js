function getMainTemplate(pokemon) {
  const abilities = pokemon.abilities.map((a) => a.ability.name).join(', ');
  return `
    <div style="text-align: left; margin-top: 15px; line-height: 1.6;">
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
      const typeName = t.type.name;
      const typeColor = TYPE_COLORS[typeName] || '#666';
      return `
      <div style="background-color: ${typeColor}; border-radius: 50%; width: 40px; height: 40px; 
                  display: flex; align-items: center; justify-content: center; border: 1px solid rgba(255,255,255,0.2);">
        <img src="./assets/icons/${typeName}.svg" style="width: 22px; height: 22px; filter: brightness(0) invert(1);">
      </div>`;
    })
    .join('');
}

function getPokemonCardTemplate(pokemon, detailData) {
  // 1. Hintergrundfarbe für das Hauptbild ermitteln
  const mainType = detailData.types[0].type.name;
  const bgColor = TYPE_COLORS[mainType] || '#F5F5F5';
  const pokemonId = `#${detailData.id.toString().padStart(3, '0')}`;

  // 2. Typ-Icons (SVGs) generieren
  const typesHtml = detailData.types
    .map((t) => {
      const typeName = t.type.name;
      const typeColor = TYPE_COLORS[typeName] || '#666';

      return `
      <div title="${typeName}" style="
        background-color: ${typeColor}; 
        border-radius: 50%; 
        width: 38px; 
        height: 38px; 
        display: flex; 
        align-items: center; 
        justify-content: center;
        border: 1px solid rgba(255,255,255,0.15);
        box-shadow: 0 4px 6px rgba(0,0,0,0.4);
      ">
        <img src="./assets/icons/${typeName}.svg" 
             alt="${typeName}" 
             style="width: 22px; height: 22px; filter: brightness(0) invert(1);">
      </div>`;
    })
    .join(' ');

  // 3. Das finale Karten-Template
  return `
    <div class="pokemon-card" onclick="openPokeDialog('${pokemon.name}')">
        <!-- Header: ID und Name -->
        <div style="display: flex; justify-content: space-between; width: 100%; align-items: center; margin-bottom: 12px;">
            <span style="font-weight: bold; color: #888;">${pokemonId}</span>
            <h3 style="margin: 0; font-size: 1.1rem; color: #fff; letter-spacing: 1px;">${pokemon.name.toUpperCase()}</h3>
        </div>
        
        <!-- Bild-Bereich mit dynamischem Hintergrund -->
        <div style="background-color: ${bgColor}; border-radius: 15px; width: 100%; text-align: center; padding: 20px; box-shadow: inset 0 0 20px rgba(0,0,0,0.2);">
            <img src="${detailData.sprites.other['official-artwork'].front_default}" 
                 alt="${pokemon.name}" 
                 style="width: 130px; height: 130px; object-fit: contain;">
        </div>

        <!-- Typ-Icons Reihe -->
        <div style="display: flex; gap: 12px; justify-content: center; margin-top: 15px;">
            ${typesHtml}
        </div>
    </div>
  `;
}

function getStatsTemplate(pokemon) {
  return pokemon.stats
    .map(
      (s) => `
    <div class="stat-row" style="display: flex; align-items: center; margin-bottom: 5px;">
        <span style="width: 100px;">${s.stat.name.toUpperCase()}:</span>
        <div style="background: #eee; flex: 1; height: 8px; border-radius: 4px; margin: 0 10px;">
            <div style="width: ${Math.min(s.base_stat, 100)}%; background: #4caf50; height: 100%; border-radius: 4px;"></div>
        </div>
        <span>${s.base_stat}</span>
    </div>
  `,
    )
    .join('');
}

function getEvolutionStepTemplate(p, index, length) {
  return `
        <div class="evo-step" style="display: inline-block; text-align: center; margin: 10px;">
            <img src="${p.sprites.front_default}" alt="${p.name}" style="width: 80px;">
            <p>${p.name.toUpperCase()}</p>
            ${index < length - 1 ? '<span style="font-size: 20px;">➔</span>' : ''}
        </div>
    `;
}
