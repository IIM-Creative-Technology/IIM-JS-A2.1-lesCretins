//function to get raw JSON data from URL
async function getData(url){
    let request = await fetch(url);
    if(request.status !== 404){
        return request.json().then(data => data);
    }else{
        return false;
    }
}

//let's list all Pokémons for name search
let allPokemons;

//search
function findPokemon(query) {
    return allPokemons.filter(function(entry) {
        return entry.name.includes(query);
    });
}
let searchBar = document.querySelector('#search');
let amount = document.querySelector('p.amount');
searchBar.addEventListener('keyup', ()=>{
    stockReset();
    if(searchBar.value === ''){
        getDefaultPokemon();
        amount.innerHTML = ''
    }else{
        let result = findPokemon(searchBar.value);
        amount.innerHTML = 'Résultats : '+result.length;
        let i = 0;
        result.forEach((pokemon) => {
            if(i<10){
                addToDeck(pokemon['name'])
                i++
            }
        })
    }
})


//elements
let deck = document.querySelectorAll('div.deck>div.cell');
let pokemonStock = document.querySelector(".poke-stock");



//drag drop functions :
function allowDrop(e){
    if((e.target.classList.contains('cell') && e.target.childElementCount === 0)
        || e.target.classList.contains('poke-stock')){
        e.preventDefault();
    }
}
function dragPokemon(e){
    e.dataTransfer.setData('pokemon', e.target.id);
}
function dropPokemon(e){
    console.log(e.target);

    if((e.target.classList.contains('cell') && e.target.childElementCount === 0)
        || e.target.classList.contains('poke-stock')){
        let pokemonId = e.dataTransfer.getData('pokemon');
        e.target.appendChild(document.querySelector('#'+pokemonId));
    }
}

//deck and visual
async function getPokemonData(name){
    let pokemon = await getData("https://pokeapi.co/api/v2/pokemon/"+name);
    if(pokemon !== false){
        return pokemon;
    }
}
function generateCard(pokemon){
    let img = document.createElement('img');
    let p = document.createElement('p');
    let imgContainer = document.createElement('div');
    imgContainer.classList.add('img-container');
    img.src = pokemon['sprites']['front_default'];
    img.draggable = false;
    p.innerHTML = pokemon['name']+" ("+pokemon['id']+")";
    let card = document.createElement('div');
    card.classList.add('poke-card');
    imgContainer.appendChild(img)
    card.appendChild(imgContainer)
    card.appendChild(p);
    card.id = 'pokemon_'+pokemon['id'];
    card.draggable = true;
    card.ondragstart = dragPokemon;
    return card;
}
function addToDeck(name){
    getPokemonData(name).then(pokemon => {
        pokemonStock.appendChild(generateCard(pokemon));
    })
}
function getDefaultPokemon(){
    for(let i = 1; i<31; i+=3){
        addToDeck(i);
    }
}
function stockReset(){
    pokemonStock.innerHTML = '';
}


//events
deck.forEach(cell => cell.ondragover = allowDrop)
deck.forEach(cell => cell.ondrop = dropPokemon)
pokemonStock.ondragover = allowDrop;
pokemonStock.ondrop = dropPokemon;

window.onload = async () => {
    await getData("https://pokeapi.co/api/v2/pokemon?limit=100000&offset=0").then((data)=>{
        allPokemons = data['results'];
        console.log(allPokemons)
    });
    getDefaultPokemon();
}