const setupContainer = document.getElementById('setup-container');
const gameContainer = document.getElementById('game-container');
const playerNameInput = document.getElementById('player-name');
const addPlayerButton = document.getElementById('add-player');
const startGameButton = document.getElementById('start-game');
const playerList = document.getElementById('player-list');
const gameInfo = document.getElementById('game-info');
const actions = document.getElementById('actions');

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

function addPlayer() {
    const playerName = playerNameInput.value.trim();
    if (playerName && players.length < 6) {
        players.push({ name: playerName, role: '', status: 'alive' });
        playerNameInput.value = '';
        renderPlayerList();
    } else if (players.length >= 6) {
        alert('Maximum of 6 players allowed.');
    }
}

function renderPlayerList() {
    const playerNamesDiv = document.querySelector('#setup-container > div#player-names');
    if(playerNamesDiv) {
        playerNamesDiv.innerHTML = ''
    } else {
        const playerNamesDiv = document.createElement('div');
        playerNamesDiv.id = 'player-names';
        setupContainer.insertBefore(playerNamesDiv, startGameButton);
    }
    

    players.forEach(player => {
        const playerDiv = document.createElement('div');
        playerDiv.textContent = player.name;
        document.querySelector('#setup-container > div#player-names').appendChild(playerDiv);
    });
}

function assignRoles() {
    const availableRoles = [...roles];
    players.forEach(player => {
        const randomIndex = Math.floor(Math.random() * availableRoles.length);
        player.role = availableRoles.splice(randomIndex, 1)[0];
    });
}

function startGame() {
    if (players.length < 4) {
        alert('A minimum of 4 players is required to start the game.');
        return;
    }

    assignRoles();
    setupContainer.classList.add('hidden');
    gameContainer.classList.remove('hidden');

    players.forEach(player => {
        const playerCard = document.createElement('player-card');
        playerCard.setAttribute('name', player.name);
        playerList.appendChild(playerCard);
    });

    // Reveal roles to each player
    setTimeout(() => {
        players.forEach(player => {
            alert(`Your role is: ${player.role}`);
        });
    }, 100);
}

addPlayerButton.addEventListener('click', addPlayer);
startGameButton.addEventListener('click', startGame);
