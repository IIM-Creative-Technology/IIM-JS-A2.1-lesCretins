

let deck = document.querySelector('div.deck');
let pokemonStock = document.querySelector(".poke-stock");

async function getData(url){
    let request = await fetch(url);
    if(request.status !== 404){
        return request.json().then(data => data);
    }else{
        return false;
    }
}

async function getPokemonData(name){
    let pokemon = await getData("https://pokeapi.co/api/v2/pokemon/"+name);
    if(pokemon !== false){
        return pokemon;
    }
}


//drag drop functions :
function allowDrop(e){
    if(e.target.classList.contains('deck') || e.target.classList.contains('poke-stock')){
        e.preventDefault();
    }
}
function dragPokemon(e){
    e.dataTransfer.setData('pokemon', e.target.id);
}
function dropPokemon(e){
    console.log(e.target);

    if(e.target.classList.contains('deck') || e.target.classList.contains('poke-stock')){
        let pokemonId = e.dataTransfer.getData('pokemon');
        e.target.appendChild(document.querySelector('#'+pokemonId));
    }
}

//afficher les 10 premiers pokémons dans le stock
for(let i = 1; i<31; i+=3){

    let img = document.createElement('img');
    let p = document.createElement('p');

    getPokemonData(i).then(pokemon => {

        img.src = pokemon['sprites']['front_default'];
        img.draggable = false;
        p.innerHTML = pokemon['name']+" ("+pokemon['id']+")";

        let card = document.createElement('div');
        card.classList.add('poke-card');
        card.appendChild(img);
        card.appendChild(p);
        card.id = 'pokemon_'+pokemon['id'];
        card.draggable = true;
        card.ondragstart = dragPokemon;

        pokemonStock.appendChild(card);

    })
}

deck.ondragover = allowDrop;
deck.ondrop = dropPokemon;

pokemonStock.ondragover = allowDrop;
pokemonStock.ondrop = dropPokemon;