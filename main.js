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

// Modal elements
const 
 = document.getElementById('role-reveal-modal');
const roleRevealPlayerName = document.getElementById('role-reveal-player-name');
const roleRevealImage = document.getElementById('role-reveal-image');
const roleRevealRoleName = document.getElementById('role-reveal-role-name');
const roleRevealCloseButton = document.getElementById('role-reveal-close');

let players = [];
let currentPlayerIndex = 0;

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

function showRoleForCurrentPlayer() {
    if (currentPlayerIndex >= players.length) {
        console.log("All roles revealed. Starting game.");
        nightPhase(); 
        return;
    }

    const player = players[currentPlayerIndex];
    roleRevealPlayerName.textContent = player.name;
    roleRevealRoleName.textContent = player.role;
    roleRevealImage.src = `https://placehold.co/400x300/2a2a2a/ffffff?text=${player.role}`;
    roleRevealImage.alt = `Image for ${player.role}`;

    roleRevealModal.classList.remove('hidden');
}

function handleCloseRoleModal() {
    roleRevealModal.classList.add('hidden');
    currentPlayerIndex++;
    if (currentPlayerIndex < players.length) {
        setTimeout(showRoleForCurrentPlayer, 200);
    } else {
        console.log("All roles revealed. Starting game.");
        nightPhase();
    }
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

    playerList.innerHTML = '';
    players.forEach(player => {
        const playerCard = document.createElement('player-card');
        playerCard.setAttribute('name', player.name);
        playerList.appendChild(playerCard);
    });

    currentPlayerIndex = 0;
    showRoleForCurrentPlayer();
}

function nightPhase() {
    gameInfo.textContent = "Night has fallen. The Mafia awakens.";
    // More complex night logic will go here.
    // For now, we can just move to the next phase after a delay.
    setTimeout(dayPhase, 3000);
}

function dayPhase() {
    gameInfo.textContent = "Day breaks. Discuss and vote who to lynch.";
    // Voting logic will go here.
}

setPlayersButton.addEventListener('click', setPlayers);
startGameButton.addEventListener('click', startGame);
roleRevealCloseButton.addEventListener('click', handleCloseRoleModal);