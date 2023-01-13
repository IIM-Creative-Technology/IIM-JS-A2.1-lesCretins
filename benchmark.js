let pokeTeam;
let allTeamTypes;

async function calculateStats(){
    pokeTeam = JSON.parse(localStorage.deck).slice(0,6);
    let avgStats = {'HP': 0, 'Attack': 0, 'Defense': 0, 'Special Attack': 0, 'Speed': 0};
    await Promise.all(pokeTeam.map(async (id) => {
        if(id!==0){
            let data = await getPokemonData(id);
            //remplissage du tableau des types
            data['types'].forEach(pokeType => {
                if(!allTeamTypes.includes(pokeType['type']['name'])){
                    allTeamTypes.push(pokeType['type']['name']);
                }
            })
            //ajout aux moyennes de stats
            Object.keys(avgStats).forEach((v,i) => {
                avgStats[v] += data['stats'][i]['base_stat'];
            })
        }
    }));
    return avgStats;
}

let DOMStats = document.querySelectorAll('table.stat td.stat');
let DOMTypeContainer = document.querySelector('p.teamTypes > span');

function refreshStats(){
    allTeamTypes = [];
    calculateStats().then((avgStats)=>{
        DOMTypeContainer.innerHTML = '';
        //écriture des stats moyennes
        Object.keys(avgStats).forEach((statName, i) => {
            DOMStats[i].innerHTML = (Math.floor(avgStats[statName]/6)).toString();
        })
        //affichage des types de l'équipe
        allTeamTypes.forEach(type => {
            let span = document.createElement('span');
            span.innerHTML = type;
            span.style.backgroundColor = typeColor[type];
            DOMTypeContainer.appendChild(span);
        })
    })
}



//LE CODE SUIVANT EST FOURNI EN PARTIE PAR GPTCHAT À LA SUITE DE PROMPTS PAR SOUCI DE TEMPS

//soit la matrice 2D suivante, un tableau de tableaux d'entiers (0, 0.5, 1 ou 2)
// représentant les effets de chaque type sur chaque autre type
// (0 = pas d'effet, 0.5 = dégâts infligés faibles, 1 = dégats infligés normaux, 2 = dégâts infligés forts)

const typeChart = [
    [1, 1, 1, 1, 1, 0.5, 1, 0, 0.5, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [2, 1, 0.5, 0.5, 1, 2, 0.5, 0, 2, 1, 1, 1, 1, 0.5, 2, 1, 2, 0.5],
    [1, 2, 1, 1, 1, 0.5, 2, 1, 0.5, 1, 1, 2, 0.5, 1, 1, 1, 1, 1],
    [1, 1, 1, 0.5, 0.5, 0.5, 1, 0.5, 0, 1, 1, 2, 1, 1, 1, 1, 1, 2],
    [1, 1, 0, 2, 1, 2, 0.5, 1, 2, 2, 1, 0.5, 2, 1, 1, 1, 1, 1],
    [1, 0.5, 2, 1, 0.5, 1, 2, 1, 0.5, 2, 1, 1, 1, 1, 2, 1, 1, 1],
    [1, 0.5, 0.5, 0.5, 1, 1, 1, 0.5, 0.5, 0.5, 1, 2, 1, 2, 1, 1, 2, 0.5],
    [0, 0, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 2, 1, 1, 0.5, 1],
    [1, 1, 1, 1, 1, 2, 1, 1, 0.5, 0.5, 0.5, 1, 0.5, 1, 2, 1, 1, 2],
    [1, 1, 1, 1, 1, 0.5, 2, 1, 2, 0.5, 0.5, 2, 1, 1, 2, 0.5, 1, 1],
    [1, 1, 1, 1, 2, 2, 1, 1, 1, 2, 0.5, 0.5, 1, 1, 1, 0.5, 1, 1],
    [1, 1, 0.5, 0.5, 2, 2, 0.5, 1, 0.5, 0.5, 2, 0.5, 1, 1, 1, 0.5, 1, 1],
    [1, 1, 2, 1, 0, 1, 1, 1, 1, 1, 2, 0.5, 0.5, 1, 1, 0.5, 1, 1],
    [1, 2, 1, 2, 1, 1, 1, 1, 0.5, 1, 1, 1, 1, 0.5, 1, 1, 0, 1],
    [1, 1, 2, 1, 2, 1, 1, 1, 0.5, 0.5, 0.5, 2, 1, 1, 0.5, 2, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 0.5, 1, 1, 1, 1, 1, 1, 2, 1, 0 ],
    [1, 0.5, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 2, 1, 0.5, 0.5, 0.5],
    [1, 2, 1, 0.5, 1, 1, 1, 1, 0.5, 0.5, 1, 1, 1, 1, 1, 2, 2, 1]
];

//soit types un tableau de chaînes de caractères représentant les types, placés pour correspondre à l'indice de typeChart
const types = [
    "normal",
    "fighting",
    "flying",
    "poison",
    "ground",
    "rock",
    "bug",
    "ghost",
    "steel",
    "fire",
    "water",
    "grass",
    "electric",
    "psychic",
    "ice",
    "dragon",
    "dark",
    "fairy"
];

