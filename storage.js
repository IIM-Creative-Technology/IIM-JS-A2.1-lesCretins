if(localStorage.deck === undefined){
    localStorage.deck = JSON.stringify(Array.from({length: 36}, () => 0));
}

//restore the stocked deck inside the dom
const urlParams = new URLSearchParams(window.location.search);
let code = urlParams.get('code');
let stored_deck = JSON.parse(localStorage.deck);

function restoreDeck(){
    if(code !== null){
        code.split(':').forEach((v,i) => {
            stored_deck[i] = parseInt(v, 16);
        })
        localStorage.deck = JSON.stringify(stored_deck);
        window.history.pushState('Pokédex Benchmark', '', '/');
    }
    allCell.forEach((cell, index) => {
        if(stored_deck[index] !== 0){
            cell.innerHTML = '';
            getPokemonData(stored_deck[index]).then(data => {
                cell.appendChild(generateCard(data));
            })
        }
    })
}

//configuring observation
const config = { attributes: false, childList: true, subtree: false };

//save the entire deck on localstorage & configure cells for stats
let alreadyRefreshing = false;
allCell.forEach((cell, index) => {

    function callback(mutationList, observer){
        let value = 0;
        for (const mutation of mutationList) {
            if (mutation.type === 'childList') {
                stored_deck = JSON.parse(localStorage.deck);
                if(mutation.addedNodes.length > 0){
                    value = parseInt(cell.querySelector('div').id.split('_')[2]);
                }
                stored_deck[index] = value;
                localStorage.deck = JSON.stringify(stored_deck);
            }
        }
        if(index < 6){
            refreshStats(index, value);
        }
    }

    const observer = new MutationObserver(callback)
    observer.observe(cell, config);
})

let saveButton = document.querySelector('button#save');

saveButton.addEventListener('click', ()=>{
    let deck = JSON.parse(localStorage.deck).slice(0,6);
    deck.forEach((value, index) => {
        deck[index] = value.toString(16);
    })
    alert(
        "Your deck can be shared with code : "
        +deck.toString().toUpperCase().replaceAll(',',':')
    )
})