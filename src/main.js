import './styles/style.css'

const pokeContainer = document.querySelector('.pokemons')
const inputSearch = document.querySelector('.search__input')
const testPokemon = document.querySelector('#testPokemon')
const sortSelect = document.querySelector('#sort__select')
const typesContainer = document.querySelector('.filter__type-wrapper')

testPokemon.classList.add('is--test')

// Global Variables

let numOfPokemons = 151
let pokemons = [];
let tempPokemons = pokemons;



let html;

const getPokemon = async (num) => {
    try {
        //Setup a mini fetch-timer.
        let time = 0;
        let intervalFetch = setInterval(() => time++, 1);
        intervalFetch;

        //Fetch Pokemons URL
        const url = `https://pokeapi.co/api/v2/pokemon/`;

        //Fetch pokemons and push into array
        for (let i = 1; i <= num; i++) {
            const res = await fetch(`${url}${i}`);
            const data = await res.json();
            pokemons.push(data);
        }

        //Log fetch time in console.
        clearInterval(intervalFetch);
        console.log(`Pokemons Fetched! in ${(time / 1000).toFixed(2)} seconds.`);

        //For each pokemon display the pokemon block inside the parent container.
        pokemons.forEach((pokemon) => {
            renderPokemon(pokemon);
        });

        console.log(`TEMP POKEMONS AT THE START ${tempPokemons.length}`)
    } catch (err) {
        new Error(err, "NOT gonna catch them all today.");
    }
};

// ............
// Renderer function for each pokemon-wrapper
// ............
function renderPokemon(pokemon) {
    html = `
    <div class="pokemons__wrapper">
    <div class="pokemon__img-wrapper">
    <img src="${pokemon.sprites.front_default}" loading="lazy" alt="" class="pokemon__img">
    </div>
    <div class="pokemon__stats-wrapper">
    <div class="pokemon__id">#${pokemon.id.toString().padStart(3, '0')}</div>
    <div class="pokemon__exp">EXP: ${pokemon.base_experience}</div>
    </div>
    <div class="pokemon__name">${pokemon.name}</div>
    <div class="pokemon__type is--${pokemon.types[0].type.name}">${pokemon.types[0].type.name}</div>
    </div>
    `;
    pokeContainer.insertAdjacentHTML("beforeend", html);
}

getPokemon(numOfPokemons)


// ............
// Search function
// ............
inputSearch.addEventListener("keyup", (e) => {
    pokeContainer.innerHTML = "";
    let searchPokemons = pokemons.filter((poke) =>
        poke.name.includes(inputSearch.value)
    );
    searchPokemons.forEach((pokemon) => {
        renderPokemon(pokemon);
    });

    tempPokemons = searchPokemons

});

// ............
// Sorting function
// ............
let order = true;


function sortPokemons(array, attr) {
    order = !order;
    // console.log(attr)
    // console.log("After Pressing The Button:", order);
    pokeContainer.innerHTML = "";

    order === true
        ? array.sort((a, b) => a[attr] - b[attr])
        : array.sort((a, b) => b[attr] - a[attr]);
    array.forEach((pokemon) => {
        renderPokemon(pokemon);
    });
}

function filterPokemons(array, type) {
    pokeContainer.innerHTML = "";

    let filteredArr = array.filter(pokemon => pokemon.types[0].type.name === type)
    filteredArr.forEach((pokemon) => {
        renderPokemon(pokemon)
    })


}

sortSelect.addEventListener('change', () => {
    sortPokemons(tempPokemons, sortSelect.value)
})

typesContainer.addEventListener('click', (e) => {
    if (e.target === typesContainer) return
    let pokemonType = e.target.innerText.toLowerCase()
    filterPokemons(tempPokemons, pokemonType)

})