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

function getPokemonCardTemplate(pokemon, detailData) {
  // 1. Hintergrundfarbe basierend auf dem ersten Typ ermitteln
  const mainType = detailData.types[0].type.name;
  const bgColor = typeColors[mainType] || '#F5F5F5';

  // 2. ID formatieren (z.B. #001)
  const pokemonId = `#${detailData.id.toString().padStart(3, '0')}`;

  // 3. Typ-Icons (Badges) generieren
  const typesHtml = detailData.types
    .map((t) => {
      const typeColor = typeColors[t.type.name] || '#666';
      return `
      <span style="
        background-color: ${typeColor}; 
        color: #333; 
        padding: 2px 8px; 
        border-radius: 12px; 
        font-size: 0.7rem; 
        font-weight: bold; 
        text-transform: uppercase;
        border: 1px solid rgba(0,0,0,0.1);
      ">${t.type.name}</span>`;
    })
    .join(' ');

  // 4. Das Template zurückgeben (Struktur wie im Dialog-Header)
  return `
    <div class="pokemon-card" onclick="openPokeDialog('${pokemon.name}')">
        <!-- Header: Nummer und Name nebeneinander -->
        <div style="display: flex; justify-content: space-between; width: 100%; align-items: center; margin-bottom: 10px;">
            <span style="font-weight: bold; color: #888;">${pokemonId}</span>
            <h3 style="margin: 0; font-size: 1.1rem;">${pokemon.name.toUpperCase()}</h3>
        </div>
        
        <!-- Bild-Container mit Hintergrundfarbe der Pokémon-Art -->
        <div style="background-color: ${bgColor}; border-radius: 15px; width: 100%; text-align: center; padding: 15px;">
            <img src="${detailData.sprites.other['official-artwork'].front_default}" 
                 alt="${pokemon.name}" 
                 style="width: 120px; height: 120px; object-fit: contain;">
        </div>

        <!-- Typ-Icons unter dem Foto -->
        <div style="display: flex; gap: 5px; justify-content: center; margin-top: 10px;">
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
