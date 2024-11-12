

//Getting the height of top-bar and making the container below it
const topBarHeight = document.getElementById('top-bar').offsetHeight;
document.getElementById('container').style.marginTop = topBarHeight + "px";



// Create new windows
function createWindow(id, title) {
    const windowDiv = document.createElement('div');
    windowDiv.classList.add('window');
    windowDiv.id = id;

    const headerDiv = document.createElement('div');
    headerDiv.classList.add('header');
    headerDiv.textContent = title;

    const collapseButton = document.createElement('button');
    collapseButton.classList.add('collapse-button');
    headerDiv.appendChild(collapseButton);

    const contentDiv = document.createElement('div');
    contentDiv.classList.add('content');

    windowDiv.appendChild(headerDiv);
    windowDiv.appendChild(contentDiv);

    let newX 
    let newY 

    const windows = document.querySelectorAll('.window');
    windows.forEach(existingWindow => {
        if (existingWindow !== windowDiv) {
            const existingRect = existingWindow.getBoundingClientRect();
            const newRect = windowDiv.getBoundingClientRect();
            console.log("window")
            // Check if the windows overlap horizontally
            const overlapX = newRect.left < existingRect.right && newRect.right > existingRect.left;

            // Check if the windows overlap vertically
            const overlapY = newRect.top < existingRect.bottom && newRect.bottom > existingRect.top;

            // If both overlapX and overlapY are true, then the windows overlap
            if (overlapX && overlapY) {
            newX += existingWindow.offsetWidth + 100;
            console.log("overlap")
            }
        }
    });

    windowDiv.style.left = newX + 'px';
    windowDiv.style.top = newY + 'px';

    const gameAreaWidth = document.getElementById('game-area').offsetWidth;
    windowDiv.style.width = ((gameAreaWidth / 3) - 50) + "px";

    return windowDiv;
}

// Function to toggle the visibility of the content div
function toggleWindow(windowId) {
    const windowContent = document.querySelector('#' + windowId + ' .content');
    if (windowContent.style.display === "none") {
        windowContent.style.display = "block";
    } else {
        windowContent.style.display = "none"; 
    }
}

// Add click event listeners to the header of each window
const windowHeaders = document.querySelectorAll(".window .header");

// Drag and Drop Functionality

let isDragging = false;
let offsetX, offsetY;
let activeWindow = null;

// windowHeaders.forEach(header => {
//     header.addEventListener("mousedown", (e) => {
//         isDragging = true;

//         // Calculate the offset considering the window's position and scoll
//         offsetX = e.clientX - header.parentNode.getBoundingClientRect().left;
//         offsetY = e.clientY - header.parentNode.getBoundingClientRect().top;
//         activeWindow = header.parentNode;
//     });
// });

const window1 = createWindow('building1', 'Building 1');
const window2 = createWindow('building2', 'Building 2');
const window3 = createWindow('building3', 'Building 3');

const gameArea = document.getElementById('game-area');
gameArea.appendChild(window1);
gameArea.appendChild(window2);
gameArea.appendChild(window3);

// const collapseButtons = document.querySelectorAll(".collapse-button");

// collapseButtons.forEach(button => {
//     button.addEventListener("click", () => {
//         const windowId = button.parentNode.parentNode.id;
//         toggleWindow(windowId);
//     })
// })

document.addEventListener('DOMContentLoaded', () => {
    const collapseButtons = document.querySelectorAll("#game-area .collapse-button");

    collapseButtons.forEach(button => {
        button.addEventListener("click", () => {
            const windowId = button.parentNode.parentNode.id;
            toggleWindow(windowId);
        });
    });

    const windowHeaders = document.querySelectorAll("#game-area .window .header");

    windowHeaders.forEach(header => {
        header.addEventListener("mousedown", (e) => {
            isDragging = true;
    
            // Calculate the offset considering the window's position and scoll
            offsetX = e.clientX - header.parentNode.getBoundingClientRect().left;
            offsetY = e.clientY - header.parentNode.getBoundingClientRect().top;
            activeWindow = header.parentNode;
        });
    });

    

    document.addEventListener("mouseup", (e) => {
        if (isDragging) {
            isDragging = false;
    
            const gameAreaRect = document.getElementById('game-area').getBoundingClientRect();
            const mouseX = e.clientX - gameAreaRect.left;
    
            const columnWidth = gameAreaRect.width / 3;
            let columnIndex = (Math.ceil(mouseX / columnWidth));

            if (columnIndex <= 0) {
                console.log("out of bounds")
                columnIndex = 1
            } if (columnIndex >= 3) {
                columnIndex = 3
            }
    
            const newX = (columnIndex * columnWidth) + 100 - columnWidth;
    
            console.log("Window dropped in column:", columnIndex);
            console.log("Window dropped at:", newX);
            console.log("columnWidth", columnWidth);
    
            activeWindow.style.left = newX + 'px';
    
            activeWindow = null;
        }
    });
    
    document.addEventListener("mousemove", (e) => {
        if (!isDragging || !activeWindow) return;
    
        e.preventDefault();

        const gameAreaRect = document.getElementById('game-area').getBoundingClientRect();
        const mouseX = e.clientX - gameAreaRect.left;

        const columnWidth = gameAreaRect.width / 3;
        const columnIndex = Math.min(Math.floor(mouseX / columnWidth), 2);

        console.log("Window dropped in column:", columnIndex);
        console.log(gameAreaRect.width)
        console.log(mouseX)

        // Calculate the new position using getBoundingClientRect for accurate positioning
        const newX = e.clientX - offsetX;
        const newY = e.clientY - offsetY;
    
        activeWindow.style.left = newX + 'px';
        activeWindow.style.top = newY + 'px';
    });


});