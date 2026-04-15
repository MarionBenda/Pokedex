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
  return `
    <div class="pokemon-card" onclick="openPokeDialog('${pokemon.name}')">
        <img src="${detailData.sprites.front_default}" alt="${pokemon.name}">
        <h3>${pokemon.name.toUpperCase()}</h3>
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
