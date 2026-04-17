const LIMIT = 20;
const CONTAINER = document.getElementById('pokemonContainer');
let OFFSET = 0;

let ALL_POKEMON_DATA = [];

let currentPokemonName = '';

const TYPE_COLORS = {
  fire: '#631212',
  grass: '#0D2B1D',
  electric: '#4A3F05',
  water: '#0A2342',
  ground: '#3B2A1E',
  rock: '#2A2A2B',
  fairy: '#4A1942',
  poison: '#2D4231',
  bug: '#3B341F',
  dragon: '#1D2B53',
  psychic: '#524E14',
  flying: '#2F3E46',
  fighting: '#4A2E1F',
  normal: '#1B1B1B',
};
