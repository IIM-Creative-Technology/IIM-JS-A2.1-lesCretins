

//function to get raw JSON data from URL
async function getData(url){
    let request = await fetch(url);
    if(request.status !== 404){
        return await request.json()
    }else{
        return false;
    }
}

//let's list all Pokémons for name search
let allPokemons;

const typeColor = {
    "normal": "#F5F5DC",
    "fire": "#F08030",
    "water": "#87CEEB",
    "electric": "#F8D030",
    "grass": "#90EE90",
    "ice": "#E0FFFF",
    "fighting": "#F08080",
    "poison": "#9370DB",
    "ground": "#D2B48C",
    "flying": "#E6E6FA",
    "psychic": "#FF69B4",
    "bug": "#90EE90",
    "rock": "#B0C4DE",
    "ghost": "#9370DB",
    "dragon": "#9932CC",
    "dark": "#A9A9A9",
    "steel": "#B0C4DE",
    "fairy": "#FFB6C1"
};

//search
async function isType(pokemon, type){
    let data = await getData("https://pokeapi.co/api/v2/type/"+type);
    let isType = false;
    data['pokemon'].forEach(poke => {
        if(poke['pokemon']['name'] === pokemon){
            isType = true;
        }
    })
    return isType;
}

let searchBar = document.querySelector('#search')
let amount = document.querySelector('.amount')
let type = document.querySelector('#type')

type.addEventListener('change',  async () => {
    stockReset();
    if(searchBar.value === ''){
        getDefaultPokemon();
    }else{
        await addPokemonIfQuery();
    }
})

//async filter by Tamás Sallai
async function filter(array, condition){
    const results = await Promise.all(array.map(condition));
    return array.filter((_v, index) => results[index]);
}

//find pokemon based on various conditions
async function findPokemon(query) {
    return await filter(allPokemons, async (entry) => {
        if (entry.name.includes(query)) {
            if (type.value !== "") {
                return await isType(entry.name, type.value);
            }else{
                return true;
            }
        }else{
            return false;
        }
    })
}


async function addPokemonIfQuery(){
    let result = await findPokemon(searchBar.value); //ducoup on await
    amount.innerHTML = 'Résultats : '+result.length;
    let i = 0;
    result.forEach((pokemon) => {
        if(i<10){
            addToDeck(pokemon['name']);
            i++;
        }
    })
}

searchBar.addEventListener('keyup', async ()=>{ //on fait une fonction async

    stockReset();
    if(searchBar.value === ''){
        // vérifier que
        getDefaultPokemon();
        amount.innerHTML = ''
    }else{
        await addPokemonIfQuery();
    }
})

let deckContainers = document.querySelectorAll('div.deck');

//let's generate the big deck
deckContainers.forEach((deck, index) => {
    let cell = document.createElement('div');
    cell.classList.add('cell');
    for(let i = 0; i<6; i++){
        deck.appendChild(cell.cloneNode());
    }
})
//put the first as active
deckContainers[0].classList.add('active');

//elements
let allCell = document.querySelectorAll('div.cell');
let pokemonStock = document.querySelector(".poke-" + "stock");
let trash = document.querySelector("#trash");
let deckSelector = document.querySelector('#slots');

deckSelector.addEventListener('change', function () {
    deckContainers.forEach((deck) => {
        deck.classList.remove('active');
    })
    deckContainers[parseInt(this.value) - 1].classList.add('active')
})



//drag drop functions :
function allowDrop(e){
    if((e.target.classList.contains('cell') && e.target.childElementCount === 0)
        || e.target.id === 'trash'
        || e.target.classList.contains('poke-stock')){
        e.preventDefault();
    }else{
    }
}

function dragPokemon(e){
    e.dataTransfer.setData('pokemon', e.target.id);
    if(e.target.parentNode.classList.contains('poke-stock')){
        e.dataTransfer.setData('toCopy', 'true');
        console.log('à copier')
    }
}

let aaaAAAH = document.querySelector('#aaaAAAH');
aaaAAAH.volume = 0.2;

function dropPokemon(e){
    if((e.target.classList.contains('cell') && e.target.childElementCount === 0)
        || e.target.id === 'trash'
        || e.target.classList.contains('poke-stock')){
        let pokemonId = e.dataTransfer.getData('pokemon');
        if(e.target.id === 'trash'){
            document.querySelector('#'+pokemonId).remove();
            if(!aaaAAAH.paused){
                aaaAAAH.paused = true;
                aaaAAAH.currentTime=0;
            }
            aaaAAAH.play();

        }else{
            if(e.dataTransfer.getData('toCopy') === 'true' && !e.target.classList.contains('poke-stock')){
                let pokeID = pokemonId.split('_')[2];
                getPokemonData(pokeID).then(data => {
                    e.target.appendChild(generateCard(data));
                })
            }else{
                if(e.target.classList.contains('poke-stock') && e.dataTransfer.getData('toCopy') !== 'true'){
                    document.querySelector('#'+pokemonId).remove();
                }else{
                    e.target.appendChild(document.querySelector('#'+pokemonId));
                }
            }
        }
    }
}

//deck and visual
async function getPokemonData(name){
    let pokemon = await getData("https://pokeapi.co/api/v2/pokemon/"+name);
    if(pokemon !== false){
        return pokemon;
    }
}

let amountCard = 0;

function generateCard(pokemon){
    let img = document.createElement('img');
    let p = document.createElement('p');
    let imgContainer = document.createElement('div');



    let imginfo = document.createElement('img');
    imginfo.src = "media/information.png";
    imginfo.classList.add('info');

    imginfo.style.width = "20px";
    imginfo.style.height = "20px";
    imginfo.style.position = "absolute";



    imginfo.addEventListener('click', () => {
        alert(pokemon['name'] + " est un pokémon de type " + pokemon['types'][0]['type']['name']);


    })


    let shiny = document.createElement('img');
    shiny.src = "media/shiny.png";
    shiny.classList.add('shiny');

    shiny.style.width = "20px";
    shiny.style.height = "20px";
    shiny.style.position = "absolute";

    shiny.addEventListener('click', () => {
        img.src = pokemon['sprites']['front_shiny'];

    })

    shiny.addEventListener('dblclick', () => {
        img.src = pokemon['sprites']['front_default'];
    })


    let zoom = document.createElement('img');
    zoom.src = "media/loop.png";
    zoom.classList.add('zoom');


    zoom.style.width = "20px";
    zoom.style.height = "20px";
    zoom.style.right = "0px";



    zoom.addEventListener('click', () => {
        let img = document.createElement('img');
        img.src = pokemon['sprites']['front_default'];
        img.style.width = "500px";
        img.style.height = "500px";
        img.style.position = "absolute";
        img.style.top = "0";
        img.style.left = "0";
        img.style.zIndex = "1000";
        img.style.backgroundColor = "beige";
        img.style.opacity = "0.9";
        img.style.borderRadius = "10px";
        img.style.cursor = "pointer";
        img.addEventListener('click', () => {
            img.remove();
        })
        document.body.appendChild(img);
    } //

    )





    imgContainer.classList.add('img-container');
    img.src = pokemon['sprites']['front_default'];
    img.draggable = false;
    p.innerHTML = pokemon['name'].replace('-', ' ');
    let card = document.createElement('div');
    card.classList.add('poke-card');
    card.appendChild(p);
    card.appendChild(imginfo);
    imgContainer.appendChild(img);
    imgContainer.appendChild(shiny);
    imgContainer.appendChild(zoom);










    card.appendChild(imgContainer);
    card.style.borderColor = typeColor[pokemon['types'][0]['type']['name']]
    card.id = 'card_' + amountCard + '_'+pokemon['id'];
    amountCard++;
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
    if(type.value === ''){
        for(let i = 1; i<31; i+=3){
            addToDeck(i);
        }
    }else{
        getData("https://pokeapi.co/api/v2/type/"+type.value).then(data =>{
            for(let i = 0; i<10; i++){
                addToDeck(data['pokemon'][i]['pokemon']["name"]);
            }
        })
    }
}

function stockReset(){
    pokemonStock.innerHTML = '';
}


//events
allCell.forEach(cell => cell.ondragover = allowDrop)
allCell.forEach(cell => cell.ondrop = dropPokemon)
pokemonStock.ondragover = allowDrop;
pokemonStock.ondrop = dropPokemon;
trash.ondragover = allowDrop;
trash.ondrop = dropPokemon;

window.onload = async () => {
    await getData("https://pokeapi.co/api/v2/pokemon?limit=100000&offset=0").then((data)=>{
        allPokemons = data['results'];
    });
    getDefaultPokemon();
    //storage
    restoreDeck();

}




// info pokemon

const popinfo = document.querySelector('.iconeinfo');

