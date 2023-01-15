

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
        let modal
        if(document.querySelector('#modal') === null) {
            modal = document.createElement('div');
            modal.id = 'modal';
            modal.classList.add('modal');
            modal.style.position = "fixed";
            modal.style.top = "0";
            modal.style.left = "0";
            modal.style.width = "100%";
            modal.style.height = "100%";
            modal.style.backgroundColor = "rgba(0,0,0,0.5)";
            modal.style.display = "flex";
            modal.style.justifyContent = "center";
            modal.style.alignItems = "center";
            modal.style.zIndex = "100";
            document.body.appendChild(modal);

            let modalContent = document.createElement('div');
            modalContent.classList.add('modal-content');
            modalContent.style.width = "50%";
            modalContent.style.height = "60%";
            modalContent.style.backgroundColor = "black";
            modalContent.style.borderRadius = "10px";
            modalContent.style.display = "flex";
            modalContent.style.flexDirection = "column";
            modalContent.style.justifyContent = "center";
            modalContent.style.alignItems = "center";
            modal.appendChild(modalContent);

            let modalTitle = document.createElement('h1');
            modalTitle.innerHTML = pokemon['name'];
            modalTitle.style.color = "white";
            modalContent.appendChild(modalTitle);

            let modalImg = document.createElement('img');
            modalImg.src = pokemon['sprites']['front_default'];
            modalImg.style.width = "20rem";
            modalContent.appendChild(modalImg);

            //bouton pour passer l'img en shiny
            let shiny = document.createElement('img');
            shiny.src = "media/shiny.png";
            shiny.classList.add('shiny');
            shiny.style.width = "40px";
            shiny.style.height = "40px";
            shiny.style.top = "0";
            shiny.style.right = "0";
            shiny.style.zIndex = "100";
            modalContent.appendChild(shiny);

            shiny.addEventListener('click', () => {
                if(modalImg.src === pokemon['sprites']['front_default']){
                    modalImg.src = pokemon['sprites']['front_shiny'];
                    shiny.style.filter = "invert(1)";
                }else{
                    modalImg.src = pokemon['sprites']['front_default'];
                    shiny.style.filter = "invert(0)";
                }

            })



            let modalClose = document.createElement('button');
            modalClose.innerHTML = "Close";
            modalClose.style.width = "100px";
            modalClose.style.height = "50px";
            modalClose.style.backgroundColor = "red";
            modalClose.style.borderRadius = "10px";
            modalClose.style.color = "white";
            modalClose.style.fontSize = "20px";
            modalClose.style.margin = "20px 0";
            modalClose.style.cursor = "pointer";
            modalClose.addEventListener('click', () => {
                    modal.remove();
                })
            modalContent.appendChild(modalClose);


            //bonton faire evoluer

            let modalEvolve = document.createElement('button');
            modalEvolve.innerHTML = "Evolve";
            modalEvolve.style.width = "100px";
            modalEvolve.style.height = "50px";
            modalEvolve.style.backgroundColor = "green";
            modalEvolve.style.borderRadius = "10px";
            modalEvolve.style.color = "white";
            modalEvolve.style.fontSize = "30px";
            modalEvolve.style.cursor = "pointer";
            modalEvolve.style.marginBottom = "10px";



            modalEvolve.addEventListener('click', () => {
                if(pokemon['species']['url'] !== pokemon['forms'][0]['url']){
                    getData(pokemon['species']['url']).then(data => {
                        getData(data['evolution_chain']['url']).then(data => {
                            let evolution = data['chain'];
                            while(evolution['evolves_to'].length > 0){
                                if(evolution['species']['url'] === pokemon['forms'][0]['url']){
                                    getData(evolution['evolves_to'][0]['species']['url']).then(data => {
                                        modalImg.src = data['sprites']['front_default'];
                                        modalTitle.innerHTML = data['name'];
                                        pokemon = data;

                                    })
                                    break;
                                }else{
                                    evolution = evolution['evolves_to'][0];

                                }
                            }
                        })
                    })
                }

            })

            modalContent.appendChild(modalEvolve);


        }

        //afficher les stats
        let modalStats = document.createElement('div');
        modalStats.classList.add('modal-stats');
        modalStats.style.width = "100%";
        modalStats.style.height = "100%";
        modalStats.style.display = "flex";
        modalStats.style.flexDirection = "column";
        modalStats.style.justifyContent = "center";
        modalStats.style.alignItems = "center";
        let modalContent = document.querySelector('.modal-content');
        modalContent.appendChild(modalStats);

        let modalStatsTitle = document.createElement('h1');
        modalStatsTitle.innerHTML = "Stats";
        modalStatsTitle.style.color = "white";
        modalStats.appendChild(modalStatsTitle);

        let modalStatsList = document.createElement('ul');
        modalStatsList.style.listStyle = "none";
        modalStatsList.style.display = "flex";
        modalStatsList.style.flexDirection = "row";
        modalStatsList.style.justifyContent = "space-around";
        modalStatsList.style.alignItems = "center";
        modalStatsList.style.width = "100%";
        modalStatsList.style.height = "100%";
        modalStats.appendChild(modalStatsList);

        for(let i = 0; i < pokemon['stats'].length; i++){
            let modalStatsItem = document.createElement('li');
            modalStatsItem.innerHTML = pokemon['stats'][i]['stat']['name'] + " : " + pokemon['stats'][i]['base_stat'];
            modalStatsItem.style.color = "white";
            modalStatsItem.style.fontSize = "20px";
            modalStatsList.appendChild(modalStatsItem);
        }

        //afficher 4 attaques random
        let modalAttacks = document.createElement('div');
        modalAttacks.classList.add('modal-attacks');
        modalAttacks.style.width = "100%";
        modalAttacks.style.height = "100%";
        modalAttacks.style.display = "flex";
        modalAttacks.style.flexDirection = "column";
        modalAttacks.style.justifyContent = "center";
        modalAttacks.style.alignItems = "center";
        modalContent.appendChild(modalAttacks);

        let modalAttacksTitle = document.createElement('h1');
        modalAttacksTitle.innerHTML = "Attacks";
        modalAttacksTitle.style.color = "white";
        modalAttacks.appendChild(modalAttacksTitle);

        let modalAttacksList = document.createElement('ul');
        modalAttacksList.style.listStyle = "none";
        modalAttacksList.style.display = "flex";
        modalAttacksList.style.flexDirection = "row";
        modalAttacksList.style.justifyContent = "space-around";
        modalAttacksList.style.alignItems = "center";
        modalAttacksList.style.width = "100%";
        modalAttacksList.style.height = "100%";
        modalAttacks.appendChild(modalAttacksList);

        let randomAttacks = [];
        for(let i = 0; i < 4; i++){
            let random = Math.floor(Math.random() * pokemon['moves'].length);
            if(!randomAttacks.includes(random)){
                randomAttacks.push(random);
            }else{
                i--;
            }
        }

for(let i = 0; i < randomAttacks.length; i++){
            let modalAttacksItem = document.createElement('li');
            modalAttacksItem.innerHTML = pokemon['moves'][randomAttacks[i]]['move']['name'];
            modalAttacksItem.style.color = "white";
            modalAttacksItem.style.fontSize = "20px";
            modalAttacksItem.style.backgroundColor = typeColor[pokemon['moves'][randomAttacks[i]]['move']['name']];

            modalAttacksList.appendChild(modalAttacksItem);
        }



    })


    imgContainer.classList.add('img-container');
    img.src = pokemon['sprites']['front_default'];
    img.draggable = false;
    p.innerHTML = pokemon['name'].replace('-', ' ');
    let card = document.createElement('div');
    card.classList.add('poke-card');
    card.appendChild(p);
    card.appendChild(imginfo);
    imgContainer.appendChild(img);










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






