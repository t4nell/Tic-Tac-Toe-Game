let fields = [
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null
];
let currentPlayer = 'circle';

function init() {
    render();
    updateTurnIndicator();
}

function render() {
    const container = document.getElementById('container');
    let boardHTML = '<div class="board-container">';
    boardHTML += "<table>";
    for (let row = 0; row < 3; row++) {
        boardHTML += "<tr>";
        for (let col = 0; col < 3; col++) {
            const index = row * 3 + col;
            let cellContent = "";
            if (fields[index] === 'circle') {
                cellContent = generateCircleSVG();
            } else if (fields[index] === 'cross') {
                cellContent = generateCrossSVG();
            }
            if (cellContent === "") {
                boardHTML += `<td onclick="cellClick(${index}, this)"></td>`;
            } else {
                boardHTML += `<td>${cellContent}</td>`;
            }
        }
        boardHTML += "</tr>";
    }
    boardHTML += "</table>";
    boardHTML += `
<svg id="win-line" style="position: absolute; top: 0; left: 0; pointer-events: none; width: 100%; height: 100%;"></svg>`;
    boardHTML += "</div>";
    container.innerHTML = boardHTML;
}

function cellClick(index, cellElement) {
    fields[index] = currentPlayer;
    if (currentPlayer === 'circle') {
        cellElement.innerHTML = generateCircleSVG();
    } else {
        cellElement.innerHTML = generateCrossSVG();
    }
    cellElement.removeAttribute("onclick");
    const winCombination = checkGameOver(currentPlayer);
    if (winCombination) {
        drawWinLine(winCombination);
    } else {
        currentPlayer = (currentPlayer === 'circle') ? 'cross' : 'circle';
        updateTurnIndicator();
    }
}

function checkGameOver(player) {
    const winConditions = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];
    for (const condition of winConditions) {
        const [a, b, c] = condition;
        if (fields[a] === player && fields[b] === player && fields[c] === player) {
            return condition;
        }
    }
    return null;
}

function drawWinLine(winIndexes) {
    const cellSize = 500 / 3;
    const firstIndex = winIndexes[0];
    const lastIndex = winIndexes[2];
    const startRow = Math.floor(firstIndex / 3);
    const startCol = firstIndex % 3;
    const endRow = Math.floor(lastIndex / 3);
    const endCol = lastIndex % 3;
    const x1 = startCol * cellSize + cellSize / 2;
    const y1 = startRow * cellSize + cellSize / 2;
    const x2 = endCol * cellSize + cellSize / 2;
    const y2 = endRow * cellSize + cellSize / 2;
    const winSVG = document.getElementById('win-line');
    winSVG.innerHTML = `
    <line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="white" stroke-width="5" stroke-linecap="round"/>
    `;
}

function generateCircleSVG() {
    const circumference = 2 * Math.PI * 40;
    return `
<svg width="90px" height="90px" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
  <circle cx="50" cy="50" r="40" fill="none" stroke="#00B0EF" stroke-width="10" stroke-dasharray="0 ${circumference}">
    <animate attributeName="stroke-dasharray"
             from="0 ${circumference}"
             to="${circumference} 0"
             dur="500ms"
             fill="freeze" />
  </circle>
</svg>
    `;
}

function generateCrossSVG() {
    const lineLength = 84.85;
    return `
<svg width="90px" height="90px" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
  <line x1="20" y1="20" x2="80" y2="80" stroke="#FFC000" stroke-width="10" stroke-dasharray="0 ${lineLength}">
    <animate attributeName="stroke-dasharray"
             from="0 ${lineLength}"
             to="${lineLength} 0"
             dur="300ms"
             fill="freeze" />
  </line>
  <line x1="80" y1="20" x2="20" y2="80" stroke="#FFC000" stroke-width="10" stroke-dasharray="0 ${lineLength}">
    <animate attributeName="stroke-dasharray"
             from="0 ${lineLength}"
             to="${lineLength} 0"
             begin="300ms"
             dur="300ms"
             fill="freeze" />
  </line>
</svg>
    `;
}

function resetGame() {
    fields = [
        null, null, null,
        null, null, null,
        null, null, null
    ];
    currentPlayer = 'circle';
    render();
    updateTurnIndicator();
}

function updateTurnIndicator() {
    const indicator = document.getElementById('current-player');
    if (indicator) {
        indicator.innerHTML = currentPlayer === 'circle'
            ? generateCircleSVG()
            : generateCrossSVG();
    }
}