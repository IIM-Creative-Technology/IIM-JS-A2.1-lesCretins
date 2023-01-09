//il y a

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

getPokemonData('pikachu').then(r => console.log(r));

for(let i = 1; i<31; i+=3){
    let img = document.createElement('img');
    let p = document.createElement('p');
    getPokemonData(i).then(pokemon => {
        img.src = pokemon['sprites']['front_default'];
        p.innerHTML = pokemon['name']+" ("+pokemon['id']+")";
        let card = document.createElement('div');
        card.classList.add('poke-card');
        card.appendChild(img);
        card.appendChild(p);
        card.addEventListener('dragstart', ()=>{
            console.log('something is being dragged');
        })
        document.querySelector(".pokemon").appendChild(card);
    })
}