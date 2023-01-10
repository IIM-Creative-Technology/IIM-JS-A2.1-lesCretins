if(localStorage.deck === undefined){
    localStorage.deck = JSON.stringify([0,0,0,0,0,0]);
}

function restoreDeck(){
    let stored_deck = JSON.parse(localStorage.deck);
    stored_deck.forEach((v,i) => {
        if(v !== 0){
            deck[i].innerHTML = '';
            getPokemonData(v).then(data => {
                deck[i].appendChild(generateCard(data));
            })
        }
    })
}

deck.forEach((cell, index) => {
    cell.addEventListener('DOMNodeInserted', function(){
        let stored_deck = JSON.parse(localStorage.deck);
        stored_deck[index] = parseInt(this.querySelector('div').id.split('_')[2]);
        localStorage.deck = JSON.stringify(stored_deck);
    })
    cell.addEventListener('DOMNodeRemoved', function(){
        let stored_deck = JSON.parse(localStorage.deck);
        stored_deck[index] = 0;
        localStorage.deck = JSON.stringify(stored_deck);
    })
})