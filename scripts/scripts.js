const url = 'https://pokeapi.co/api/v2/pokemon?limit=100&offset=0';

async function getPokemon() {
  const response = await fetch(url);
  const data = await response.json();
  const container = document.getElementById('pokemon-container');
  container.innerHTML = '';

  for (let pokemon of data.results) {
    const detailRes = await fetch(pokemon.url);
    const detailData = await detailRes.json();

    const html = `
            <div class="pokemon-card">
                <img src="${detailData.sprites.front_default}" alt="${pokemon.name}">
                <h3>${pokemon.name}</h3>
            </div>
        `;
    container.innerHTML += html;
  }
}

getPokemon();
