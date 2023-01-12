if(localStorage.deck === undefined){
    localStorage.deck = JSON.stringify(Array.from({length: 36}, () => 0));
}

//restore the stocked deck inside the dom
function restoreDeck(){
    let stored_deck = JSON.parse(localStorage.deck);
    allCell.forEach((cell, index) => {
        if(stored_deck[index] !== 0){
            cell.innerHTML = '';
            getPokemonData(stored_deck[index]).then(data => {
                cell.appendChild(generateCard(data));
            })
        }
    })
}

//save the entire deck on localstorage

allCell.forEach((cell, index) => {

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

let saveText = document.querySelector('input#save-text');
let saveButton = document.querySelector('button#save');
saveButton.style.color = 'gray';
saveText.addEventListener('keyup', function (){
    if(this.value !== ''){
        saveButton.style.color = 'black';
    }else{
        saveButton.style.color = 'gray';
    }
})
saveButton.addEventListener('click', async () => {
    if(saveText.value !== ''){
        let response = await fetch("/decks.json");
        let data = await response.json();
        if(Object.keys(data).includes(saveText.value)){
            //if already in base
            alert('This deck already exists. Find another name.');
            saveText.value = '';
        }else{

        }
    }
})