

//Getting the height of top-bar and making the container below it
const topBarHeight = document.getElementById('top-bar').offsetHeight;
document.getElementById('container').style.marginTop = topBarHeight + "px";
// Add click event listeners to the header of each window
const windowHeaders = document.querySelectorAll(".window .header");

// Drag and Drop Functionality

let isDragging = false;
let offsetX, offsetY;
let activeWindow = null;
const gameArea = document.getElementById('game-area');

// Create new windows
function createWindow(id, title, columnIndex = 1) {
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

    windowDiv.style.left = newX + 'px';
    windowDiv.style.top = newY + 'px';

    const gameAreaWidth = document.getElementById('game-area').offsetWidth;
    windowDiv.style.width = ((gameAreaWidth / 3) - 50) + "px";
    
    windowDiv.style.zIndex = 1;

    const column = document.getElementById(`column${columnIndex}`);
    column.appendChild(windowDiv);
  

    return windowDiv;
}

// reposition windows when they are dropped ontop of eachother, switching positions and sorting vertically
function windowPosition(windowDiv, originalPosition) {
    const windows = document.querySelectorAll('.window');
    if (originalPosition !== undefined) {
        windows.forEach(otherWindow => {
            if (
                otherWindow !== windowDiv &&
                checkWindowOverlap(windowDiv, otherWindow)
            ) {
                //Swap window position
                const otherWindowOriginalPosition = [
                    otherWindow.offsetLeft,
                    otherWindow.offsetTop
                ];
                otherWindow.style.left = originalPosition[0] - windowDiv.margin + 'px'; //the margins were compounding and moving the windows slowly to the right. 
                windowDiv.style.left = otherWindowOriginalPosition[0] - windowDiv.margin + 'px'; //the margins were compounding and moving the windows slowly to the right. 
    
                // Fill vertical gaps
                repositionWindowsVertically();
            }
        });
    }
}

// Repositions all windows by column
function repositionWindowsVertically() {
    const columns = document.querySelectorAll('.column');
  
    columns.forEach(column => {
      const windows = column.querySelectorAll('.window');
      let currentTop = 50;
  
      // Sort windows within the column by vertical position
      const sortedWindows = Array.from(windows).sort((a, b) => a.offsetTop - b.offsetTop);
  
      sortedWindows.forEach(window => {
        window.style.top = currentTop + 'px';
        currentTop += window.offsetHeight + 20;
      });
    });
  }

//Create a series of windows for testing purposes

const window1 = createWindow('building1', 'Building 1');

windowPosition(window1);
const window2 = createWindow('building2', 'Building 2');

windowPosition(window2);
const window3 = createWindow('building3', 'Building 3');

windowPosition(window3);
const window4 = createWindow('building4', 'Building 4');

windowPosition(window4);
const window5 = createWindow('building5', 'Building 5');

windowPosition(window5);
repositionWindowsVertically();

// Function to toggle the visibility of the content div
function toggleWindow(windowId) {
    const windowContent = document.querySelector('#' + windowId + ' .content');
    if (windowContent.style.display === "none") {
        windowContent.style.display = "block";
    } else {
        windowContent.style.display = "none"; 
    }
    repositionWindowsVertically();
}

// Document listeners
document.addEventListener('DOMContentLoaded', () => {
    const collapseButtons = document.querySelectorAll("#game-area .collapse-button");
    let originalPosition;
    collapseButtons.forEach(button => {
        button.addEventListener("click", () => {
            const windowId = button.parentNode.parentNode.id;
            toggleWindow(windowId);
        });
    });

    document.addEventListener('mousedown', (e) => {
        if (e.target.classList.contains('header')) {
          isDragging = true;
      
          // Calculate the offset considering the window's position and scroll
          offsetX = e.clientX - e.target.parentNode.getBoundingClientRect().left;
          offsetY = e.clientY - e.target.parentNode.getBoundingClientRect().top;
          activeWindow = e.target.parentNode;
          originalPosition = [activeWindow.offsetLeft, activeWindow.offsetTop];
          e.preventDefault(); // Prevent text selection
        }
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
            activeWindow.style.left = newX + 'px';

            const column = document.getElementById(`column${columnIndex}`);
            column.appendChild(activeWindow);
           
            windowPosition(activeWindow, originalPosition);
            repositionWindowsVertically();
            activeWindow = null;
        }
    });
    
    document.addEventListener("mousemove", (e) => {
        if (!isDragging || !activeWindow) return;
    
        e.preventDefault();

        const gameAreaRect = document.getElementById('game-area').getBoundingClientRect();
        const mouseX = e.clientX - gameAreaRect.left;

        const columnWidth = gameAreaRect.width / 3;
        // const columnIndex = Math.min(Math.floor(mouseX / columnWidth), 2);

        // Calculate the new position using getBoundingClientRect for accurate positioning
        const newX = e.clientX - offsetX;
        const newY = e.clientY - offsetY;
    
        activeWindow.style.left = newX + 'px';
        activeWindow.style.top = newY + 'px';
    });
});

// Check window collision function using SAT library

function checkWindowOverlap(window1, window2) {
    // Create SAT.js polygon objects for the windows
    const rect1 = new SAT.Box(new SAT.Vector(window1.offsetLeft, window1.offsetTop), window1.offsetWidth, window1.offsetHeight).toPolygon();
    const rect2 = new SAT.Box(new SAT.Vector(window2.offsetLeft, window2.offsetTop), window2.offsetWidth, window2.offsetHeight).toPolygon();

    // Use SAT.js to check for collision
    const response = new SAT.Response();
    const collided = SAT.testPolygonPolygon(rect1, rect2, response);

    return collided; // Return true if collision detected, false otherwise    
}

function resizeWindows() {
    const windows = document.querySelectorAll('.window');
    const columnWidth = gameArea.offsetWidth / 3; //new column width

    windows.forEach(window => {
        const columnIndex = Math.floor(window.offsetLeft / columnWidth);
        const newX = (columnIndex * columnWidth) + 100;  
        const newWidth = columnWidth - 50;

        window.style.left = newX + 'px';
        window.style.width = newWidth + 'px';
    })
}

//Browser resizing event listener
window.addEventListener('resize', resizeWindows);