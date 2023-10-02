const pokeApi = {};

/*Convert PokeApi Details to pokedex details model*/
function convertPokemonApiDetailsToPokemonModelDetails(pokemonDetail) {
  const details = {
    weight: 0,
    height: 0,
    baseStats: [
      {
        statValue: 0,
        statName: "",
        statAcronym: "",
      },
    ],
  };
  details.weight = pokemonDetail.weight;
  details.height = pokemonDetail.height;
  details.baseStats.push(
    pokemonDetail.stats.map((status) => {
      const baseStats = {
        statValue: 0,
        statName: "",
        statAcronym: "",
      };
      baseStats.statValue = status.base_stat;
      baseStats.statName = status.stat.name;
      baseStats.statAcronym = convertStatName(status.stat.name);
      return baseStats;
    })
  );
  details.baseStats.shift();
  return details;
  function convertStatName(statName) {
    switch (statName) {
      case "hp":
        return "HP";
      case "attack":
        return "ATK";
      case "defense":
        return "DEF";
      case "special-attack":
        return "SP ATK";
      case "special-defense":
        return "SP DEF";
      case "speed":
        return "SPD";
    }
  }
}

/*Convert PokeApi Pokemon to pokedex Pokemon model*/
function convertPokeApiDetailToPokemonModel(pokemonDetail) {
  const pokemon = new PokemonModel();
  pokemon.pokeId = pokemonDetail.id;
  pokemon.name = pokemonDetail.name;
  pokemon.photoUrl = pokemonDetail.sprites.other["official-artwork"].front_default;
  const types = pokemonDetail.types.map((typeSlot) => typeSlot.type.name);
  const [mainType] = types;
  pokemon.mainType = mainType;
  pokemon.types = types;
  pokemon.details = convertPokemonApiDetailsToPokemonModelDetails(pokemonDetail);
  return pokemon;
}

/* Get Pokemon Detail by Url*/
pokeApi.getPokemonDetail = async (pokemon) => {
  const response = await fetch(pokemon.url);
  const pokemonDetail = await response.json();
  return convertPokeApiDetailToPokemonModel(pokemonDetail);
};

/* Get Pokemon Detail By ID */
pokeApi.getPokemonDetailByID = async (id) => {
  const url = `https://pokeapi.co/api/v2/pokemon/${id}`;
  const response = await fetch(url);
  const pokemonDetail = await response.json();
  return convertPokeApiDetailToPokemonModel(pokemonDetail);
};

/* Get Pokemons List */
pokeApi.getPokemons = async (offset = 0, limit = 5) => {
  const URL = `https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`;
  try {
    const response = await fetch(URL);
    const responseBody = await response.json();
    const pokemons = responseBody.results;
    const detailsRequests = pokemons.map(pokeApi.getPokemonDetail);
    const pokemonDetails = await Promise.all(detailsRequests);
    return pokemonDetails;
  } catch (err) {
    console.log(err);
  }
};
