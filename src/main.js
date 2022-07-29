import './styles/style.css'

const pokeContainer = document.querySelector('.pokemons')
const inputSearch = document.querySelector('.search__input')
const testPokemon = document.querySelector('#testPokemon')
const sortSelect = document.querySelector('#sort__select')
const typesContainer = document.querySelector('.filter__type-wrapper')
const pokeLottie = document.querySelector('.pokemons_loader')
const btnClear = document.querySelector('#btnClear')

testPokemon.classList.add('is--test')

// Global Variables

let numOfPokemons = 151
let pokemons = [];
let tempPokemons;





let html;

const getPokemon = async (num) => {
    pokeLottie.style.display = "flex"
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
        tempPokemons = [...pokemons]
        //Log fetch time in console.
        clearInterval(intervalFetch); 0
        console.log(`Pokemons Fetched! in ${(time / 1000).toFixed(2)} seconds.`);
        pokeLottie.style.display = "none"

        //For each pokemon display the pokemon block inside the parent container.
        pokemons.forEach((pokemon) => {
            renderPokemon(pokemon);
        });

        // console.log(`TEMP POKEMONS AT THE START ${tempPokemons.length}`)
    } catch (err) {
        new Error(err, "NOT gonna catch them all today.");
    }
};

// ............
// Renderer function for each pokemon-wrapper
// ...use data-attributes?
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
    <div class="pokemon__name">${pokemon.name[0].toUpperCase() + pokemon.name.slice(1)}</div>
    <div class="pokemon__type is--${pokemon.types[0].type.name}">${pokemon.types[0].type.name[0].toUpperCase() + pokemon.types[0].type.name.slice(1)} </div>
    </div>
    `;
    pokeContainer.insertAdjacentHTML("beforeend", html);
}

getPokemon(numOfPokemons)


// ............
// Search function
// ............
inputSearch.addEventListener("keyup", (e) => {
    e.preventDefault()
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
    // FIRST WAY FOR SINGLE BUTTON SORTING
    //probably only for button to change onclick, doesnt workt as intended in dropdown
    // order = !order; 
    // // console.log(attr)
    // // console.log("After Pressing The Button:", order);
    // pokeContainer.innerHTML = "";
    // // console.log(tempPokemons.length)
    // order === true
    //     ? array.sort((a, b) => a[attr] - b[attr])
    //     : array.sort((a, b) => b[attr] - a[attr]);
    // array.forEach((pokemon) => {
    //     renderPokemon(pokemon);
    // });
    if (attr === 'id-asc') { array.sort((a, b) => a['id'] - b['id']) }
    if (attr === 'id-dsc') { array.sort((a, b) => b['id'] - a['id']) }
    if (attr === 'base_experience-asc') { array.sort((a, b) => a['base_experience'] - b['base_experience']) }
    if (attr === 'base_experience-dsc') { array.sort((a, b) => b['base_experience'] - a['base_experience']) }
    pokeContainer.innerHTML = ""
    array.forEach(pokemon => renderPokemon(pokemon))
    // console.log(attr)
}

function filterPokemons(array, type) {

    pokeContainer.innerHTML = "";

    array = array.filter(pokemon => pokemon.types[0].type.name === type)
    array.forEach((pokemon) => {
        renderPokemon(pokemon)
    })


    return array
}

// console.log(order)
sortSelect.addEventListener('change', () => {
    // console.log('==================================')
    // console.log(`before sort ${tempPokemons.length}`)
    sortPokemons(tempPokemons, sortSelect.value)
    // console.log(`after sort ${tempPokemons.length}`)
    // console.log(order)

})

typesContainer.addEventListener('click', (e) => {

    tempPokemons = pokemons
    if (e.target === typesContainer) return
    if (e.target === btnClear) {
        pokeContainer.innerHTML = "";
        inputSearch.value = ''
        pokemons.forEach(pokemon => renderPokemon(pokemon))
        return
    }
    let pokemonType = e.target.innerText.toLowerCase()
    tempPokemons = filterPokemons(tempPokemons, pokemonType)
    // console.log(tempPokemons.length)
    // console.log(tempPokemons)

})