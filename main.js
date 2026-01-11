const setupContainer = document.getElementById('setup-container');
const gameContainer = document.getElementById('game-container');
const numPlayersInput = document.getElementById('num-players');
const setPlayersButton = document.getElementById('set-players');
const playerNamesContainer = document.getElementById('player-names-container');
const startGameButton = document.getElementById('start-game');
const playerList = document.getElementById('player-list');
const gameInfo = document.getElementById('game-info');
const actions = document.getElementById('actions');
const playerInputs = document.getElementById('player-inputs');

let players = [];
const roles = ['Mafia', 'Doctor', 'Police', 'Citizen', 'Citizen', 'Citizen'];

class PlayerCard extends HTMLElement {
    constructor() {
        super();
        const shadow = this.attachShadow({ mode: 'open' });
        const wrapper = document.createElement('div');
        wrapper.setAttribute('class', 'player-card');

        const name = document.createElement('p');
        name.textContent = this.getAttribute('name');

        wrapper.appendChild(name);

        const style = document.createElement('style');
        style.textContent = `
            .player-card {
                background-color: #333;
                border: 1px solid #555;
                border-radius: 8px;
                padding: 15px;
                cursor: pointer;
                transition: transform 0.2s;
            }
            .player-card:hover {
                transform: scale(1.05);
            }
        `;
        shadow.appendChild(style);
        shadow.appendChild(wrapper);
    }
}
customElements.define('player-card', PlayerCard);

function setPlayers() {
    const numPlayers = parseInt(numPlayersInput.value, 10);

    if (isNaN(numPlayers) || numPlayers < 4 || numPlayers > 6) {
        alert('Please enter a number between 4 and 6.');
        return;
    }

    playerNamesContainer.innerHTML = '';
    for (let i = 0; i < numPlayers; i++) {
        const input = document.createElement('input');
        input.type = 'text';
        input.placeholder = `Player ${i + 1} Name`;
        input.classList.add('player-name-input');
        playerNamesContainer.appendChild(input);
    }

    playerInputs.classList.add('hidden');
    playerNamesContainer.classList.remove('hidden');
    startGameButton.classList.remove('hidden');
}

function assignRoles() {
    // Adjust roles based on player count
    const gameRoles = ['Mafia', 'Doctor', 'Police'];
    while (gameRoles.length < players.length) {
        gameRoles.push('Citizen');
    }

    const availableRoles = [...gameRoles];
    players.forEach(player => {
        const randomIndex = Math.floor(Math.random() * availableRoles.length);
        player.role = availableRoles.splice(randomIndex, 1)[0];
    });
}

function startGame() {
    const nameInputs = document.querySelectorAll('.player-name-input');
    players = [];

    for (const input of nameInputs) {
        const playerName = input.value.trim();
        if (!playerName) {
            alert('Please enter all player names.');
            return;
        }
        players.push({ name: playerName, role: '', status: 'alive' });
    }

    if (players.length < 4) {
        alert('A minimum of 4 players is required.');
        return;
    }

    assignRoles();
    setupContainer.classList.add('hidden');
    gameContainer.classList.remove('hidden');

    playerList.innerHTML = ''; // Clear previous game's player list
    players.forEach(player => {
        const playerCard = document.createElement('player-card');
        playerCard.setAttribute('name', player.name);
        playerList.appendChild(playerCard);
    });

    // Reveal roles to each player
    setTimeout(() => {
        players.forEach(player => {
            alert(`${player.name}, your role is: ${player.role}`);
        });
        // Start the first phase of the game (e.g., night)
        // nightPhase(); 
    }, 100);
}

setPlayersButton.addEventListener('click', setPlayers);
startGameButton.addEventListener('click', startGame);