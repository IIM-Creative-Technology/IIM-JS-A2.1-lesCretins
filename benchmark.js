let pokeTeam;
let allTeamTypes;
let score = document.querySelector('h2#score');

let canvas = document.querySelector("canvas");
let ctx = canvas.getContext("2d");

//GPTChat function to darken color
function darkenColor(hex, lum) {
    // Validate hex string
    hex = String(hex).replace(/[^0-9a-f]/gi, '');
    if (hex.length < 6) {
        hex = hex[0]+hex[0]+hex[1]+hex[1]+hex[2]+hex[2];
    }
    lum = lum || 0;

    // Convert to decimal and change luminosity
    let rgb = "#", c, i;
    for (i = 0; i < 3; i++) {
        c = parseInt(hex.substr(i*2,2), 16);
        c = Math.round(Math.min(Math.max(0, c + (c * lum)), 255)).toString(16);
        rgb += ("00"+c).substr(c.length);
    }

    return rgb;
}

function getRank(scoreCalculation) {
    score.style.animation = 'none';
    if (scoreCalculation < 100) {
        score.style.color = '#4d4038';
        return "F";
    } else if (scoreCalculation < 200) {
        score.style.color = '#384d38';
        return "E";
    } else if (scoreCalculation < 300) {
        score.style.color = '#c01818';
        return "D";
    } else if (scoreCalculation < 400) {
        score.style.color = '#c04a18';
        return "C";
    } else if (scoreCalculation < 500) {
        score.style.color = '#c77717';
        return "B";
    } else {
        score.style.color = '#ffea00';
        score.style.animation = 'bounce 1s infinite';
        return "A";
    }
}

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
    let scoreCalculation = 0;
    Object.values(avgStats).forEach(value => scoreCalculation += Math.floor(value/6));
    score.innerHTML = getRank(scoreCalculation);
    return avgStats;
}

let DOMStats = document.querySelectorAll('table.stat td.stat');
let DOMTypeContainer = document.querySelector('div.teamTypes');
let DOMBenchmark = document.querySelector('.benchmark');
let canvasPlacement = [[-1,-2],[0,-2],[1,-2], [-0.5,-1], [0.5,-1], [0,0]];



function refreshStats(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    allTeamTypes = [];
    calculateStats().then((avgStats)=>{
        DOMTypeContainer.innerHTML = '';
        //écriture des stats moyennes
        Object.keys(avgStats).forEach((statName, i) => {
            DOMStats[i].innerHTML = (Math.floor(avgStats[statName]/6)).toString();
        })
        //affichage des types de l'équipe
        let bgCard = false;
        allTeamTypes.forEach(type => {
            let span = document.createElement('span');
            span.innerHTML = type;
            span.style.backgroundColor = typeColor[type];
            if(!bgCard){
                bgCard = true;
                DOMBenchmark.style.background = ' url(https://grainy-gradients.vercel.app/noise.svg), radial-gradient(' +
                    'circle, ' +
                    darkenColor(typeColor[type], +0.2)+', '+
                    darkenColor(typeColor[type], -0.2)+')';
            }
            DOMTypeContainer.appendChild(span);
        })
        let order = [5, 4, 3, 2, 1, 0];
        order.forEach((v,i) => {
            let image = allCell[v].querySelector('img');
            if(image !== null){
                image.crossOrigin = 'Anonymous';
                setTimeout(()=>{
                    let imgWidth = 100;
                    let imgHeight = 100;
                    let x = (canvas.width - imgWidth)/2 +canvasPlacement[i][0]*80;
                    let y = (canvas.width - imgHeight)/2+canvasPlacement[i][1]*80 +60;
                    ctx.drawImage(image, x, y);
                }, 50 + 50*i);
            }
        })
    })
}

let modalBackground = document.querySelector('.modal-save-background');
let modal = document.querySelector(".modal-save");
let isModalClicked = false;

document.querySelector('#saveCard').addEventListener('click', ()=>{

    html2canvas(DOMBenchmark).then(canvas => {
        modal.appendChild(canvas);
    })
    modalBackground.style.display = 'flex';
})
modal.addEventListener('click', ()=>{
    isModalClicked = true;
})
modalBackground.addEventListener('click', function (){
    modal.innerHTML = '';
    if(!isModalClicked){
        this.style.display = 'none';
    }
    isModalClicked = false;
})

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

