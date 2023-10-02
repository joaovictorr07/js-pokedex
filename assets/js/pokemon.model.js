class PokemonModel {
  pokeId;
  name;
  mainType;
  types = [];
  photoUrl;
  details = {
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
}
