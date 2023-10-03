const pokemonOl = document.getElementById("pokemon-list");
const loadButton = document.getElementById("loadMoreButton");
const noLoadMore = document.getElementById("noLoadMore");
const pokemonDetailPage = document.getElementById("pokemonDetailPage");
const loadingIndicator = document.getElementById("loadingIndicator");
const content = document.getElementById("content");
const configButton = document.getElementById("configButton");
const configModal = document.getElementById("configModal");
const generationForm = document.getElementById("generationForm");
const paginationDropdown = document.getElementById("paginationDropdown");
const modalConfigSaveButton = document.getElementById("modalConfigSaveButton");
const errorApi = document.getElementById("errorApi");
let limit = 5;
let maxRecords = 151;
let offset = 0;

const modalGenerationsOptions = [
  {
    name: "Segunda",
    value: 251,
    label: "II",
  },
  {
    name: "Terceira",
    value: 386,
    label: "III",
  },
  {
    name: "Quarta",
    value: 493,
    label: "IV",
  },
  {
    name: "Quinta",
    value: 649,
    label: "V",
  },
  {
    name: "Sexta",
    value: 721,
    label: "VI",
  },
  {
    name: "Setima",
    value: 809,
    label: "VII",
  },
  {
    name: "Oitvava",
    value: 890,
    label: "VIII",
  },
];

/* Initialize Page */
function init() {
  pokemonDetailPage.parentElement.removeChild(pokemonDetailPage);
  noLoadMore.parentElement.removeChild(noLoadMore);
  configModal.style.display = "none";
  errorApi.parentElement.removeChild(errorApi);
  loadPokemonItems(offset, limit);
  createModalConfig();
}

/* Disable Page If Modal Or Loading Active */
function disableContent(disabled) {
  if (disabled) content.style.pointerEvents = "none";
  else content.style.pointerEvents = "auto";
}

/* Loading Element */
function setLoading(loading) {
  if (loading) {
    loadingIndicator.style.display = "flex";
    disableContent(true);
  } else {
    loadingIndicator.style.display = "none";
    disableContent(false);
  }
}

/* Load Pokemons Itens and Update Html List*/
function loadPokemonItems(offset, limit, restart = false) {
  setLoading(true);
  pokeApi
    .getPokemons(offset, limit)
    .then((pokemonList = []) => {
      if (restart) {
        pokemonOl.innerHTML = pokemonList
          .map(
            (pokemon) => `
    <li data-pokemon-id="${pokemon.pokeId}" class="pokemon ${pokemon.mainType}">
    <span class="pokemon-number">#${pokemon.pokeId}</span>
    <span class="pokemon-name">${pokemon.name}</span>

    <div class="pokemon-detail">
        <ol class="types">
        ${pokemon.types.map((type) => `<li class="type ${type}">${type}</li>`).join(" ")}
        </ol>
        <img src="${pokemon.photoUrl}"
            alt="${pokemon.name}">
    </div>
</li>
    `
          )
          .join("");
      } else {
        pokemonOl.innerHTML += pokemonList
          .map(
            (pokemon) => `
      <li data-pokemon-id="${pokemon.pokeId}" class="pokemon ${pokemon.mainType}">
      <span class="pokemon-number">#${pokemon.pokeId}</span>
      <span class="pokemon-name">${pokemon.name}</span>
  
      <div class="pokemon-detail">
          <ol class="types">
          ${pokemon.types.map((type) => `<li class="type ${type}">${type}</li>`).join(" ")}
          </ol>
          <img src="${pokemon.photoUrl}"
              alt="${pokemon.name}">
      </div>
  </li>
      `
          )
          .join("");
      }
      setLoading(false);
    })
    .catch((err) => {
      setLoading(false);
      console.log(err);
      loadButton.parentElement.replaceChild(errorApi, loadButton);
    });
}

/* Initialize Configuration Modal */
function createModalConfig() {
  generationForm.innerHTML += modalGenerationsOptions
    .map(
      (option) => `
  <label><input type="checkbox" name="${option.name}" value="${option.value}">${option.label}</label>
`
    )
    .join("");
}

init();

/*Request new items or remove button*/
loadButton.addEventListener("click", () => {
  offset += limit;
  const qtdRecordsNewPage = offset + limit;
  if (qtdRecordsNewPage >= maxRecords) {
    const newLimit = maxRecords - offset;
    if (newLimit != 0) {
      loadPokemonItems(offset, newLimit);
    }
    loadButton.parentElement.replaceChild(noLoadMore, loadButton);
  } else {
    loadPokemonItems(offset, limit);
  }
});

/* Open Pokemon Details Clicked */
pokemonOl.addEventListener("click", function (event) {
  const pokemonItem = event.target.closest("li[data-pokemon-id]");
  if (pokemonItem) {
    const pokemonId = pokemonItem.getAttribute("data-pokemon-id");
    setLoading(true);
    pokeApi.getPokemonDetailByID(pokemonId).then((pokemon) => {
      pokemonDetailPage.innerHTML = `
        <h2 class="pokemon-name">#${pokemon.pokeId} ${pokemon.name}</h2>
        <div class="pokemon-img ${pokemon.mainType}">
        <img src="${pokemon.photoUrl}"
            alt="${pokemon.name}">
    </div>

    <ol class="types">
    ${pokemon.types.map((type) => `<li class="type ${type}">${type}</li>`).join(" ")}
    </ol>
    <div class="pokemon-info">
        <div class="info">
            <h2>${pokemon.details.weight} KG</h2>
            <h5>Weight</h5>
        </div>
        <div class="info">
            <h2>${pokemon.details.height} M</h2>
            <h5>Height</h5>
        </div>
    </div>
    <div class="stats-info">
        <h3>Base Stats</h3>
        <ol class="stats">
         ${pokemon.details.baseStats[0]
           .map(
             (stat) => ` <li class="stat">
         <div class="info-stat">
             <h6>${stat.statAcronym}</h6>
             <div class="outer-bar">
                 <div class="stats-bar ${stat.statName}" style="width: calc((${stat.statValue} / 300) * 100%);">
                 ${stat.statValue}/300
                 </div>
             </div>
         </div>
     </li>`
           )
           .join(" ")}
        </ol>
    </div>
    <button tabinex=1 id="returnButton" class="pokedex-button" type="button">Back</button>`;
      pokemonOl.parentElement.replaceChild(pokemonDetailPage, pokemonOl);
      loadButton.style.display = "none";
      noLoadMore.style.display = "none";
      setLoading(false);
    });
  }
});

/* Close Pokemon Details */
pokemonDetailPage.addEventListener("click", (event) => {
  if (event.target.classList.contains("pokedex-button")) {
    pokemonDetailPage.parentElement.replaceChild(pokemonOl, pokemonDetailPage);
    loadButton.style.display = "block";
    noLoadMore.style.display = "block";
  }
});

/* Open Configuration Modal */
configButton.addEventListener("click", () => {
  configModal.style.display = "flex";
  disableContent(true);
});

/* Save Change to Pokemon Generation Display Setting */
generationForm.addEventListener("change", () => {
  var selectedValues = [];
  var checkBoxes = generationForm.querySelectorAll("input[type='checkbox']");
  var selectedValues = [];
  var max = null;
  checkBoxes.forEach((checkBox) => {
    if (checkBox.checked) {
      selectedValues.push(parseInt(checkBox.value));
    }
  });

  if (selectedValues.length > 0) {
    max = Math.max(...selectedValues);
  }
  checkBoxes.forEach((checkBox) => {
    if (checkBox.value <= max) {
      checkBox.checked = true;
    }
  });
  maxRecords = max;
});

/* Save Change to Items per page Setting */
paginationDropdown.addEventListener("change", () => {
  var newLimit = paginationDropdown.value;
  limit = Number(newLimit);
});

/* Close Configuration Modal and restar Html Pokemons List*/
modalConfigSaveButton.addEventListener("click", () => {
  offset = 0;
  loadPokemonItems(offset, limit, true);
  configModal.style.display = "none";
  disableContent(false);
});

/* Close Configuration Modal and restar Html Pokemons List*/
configModal.addEventListener("click", (event) => {
  if (event.target === configModal) {
    offset = 0;
    loadPokemonItems(offset, limit, true);
    configModal.style.display = "none";
    disableContent(false);
  }
});
