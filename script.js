

//Getting the height of top-bar and making the container below it
const topBarHeight = document.getElementById('top-bar').offsetHeight;
document.getElementById('container').style.marginTop = topBarHeight + "px";
// Add click event listeners to the header of each window
const windowHeaders = document.querySelectorAll(".window .header");

// Drag and Drop Functionality

let isDragging = false;
let offsetX, offsetY;
let activeWindow = null;

//Switching areas constants
const townArea = document.getElementById('TownArea');
const workersArea = document.getElementById('WorkersArea');
const heroesArea = document.getElementById('HeroesArea');
const questBoardArea = document.getElementById('QuestBoardArea');
const adventuresArea = document.getElementById('AdventuresArea');

const townButton = document.getElementById('townButton');
const workersButton = document.getElementById('workersButton');
const heroesButton = document.getElementById('heroesButton');
const questBoardButton = document.getElementById('questBoardButton');
const adventuresButton = document.getElementById('adventuresButton');

// Function for changing areas
function showArea(areaId) {
    townArea.style.display = areaId === 'TownArea' ? 'grid' : 'none';
    workersArea.style.display = areaId === 'WorkersArea' ? 'block' : 'none';
    heroesArea.style.display = areaId === 'HeroesArea' ? 'block' : 'none';
    questBoardArea.style.display = areaId === 'QuestBoardArea' ? 'block' : 'none';
    adventuresArea.style.display = areaId === 'AdventuresArea' ? 'block' : 'none';
}

//Click Events for area buttons
townButton.addEventListener('click', () => showArea('TownArea'));
workersButton.addEventListener('click', () => showArea('WorkersArea'));
heroesButton.addEventListener('click', () => showArea('HeroesArea'));
questBoardButton.addEventListener('click', () => showArea('QuestBoardArea'));
adventuresButton.addEventListener('click', () => showArea('AdventuresArea'));

//Initiate first area
showArea('TownArea');

// Create new windows
function createBuildingWindow(id, title, columnIndex = 1) {
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

    const townAreaWidth = document.getElementById('TownArea').offsetWidth;
    windowDiv.style.width = ((townAreaWidth / 3) - 50) + "px";
    
    windowDiv.style.zIndex = 1;

    const column = document.getElementById(`column${columnIndex}`);
    column.appendChild(windowDiv);
  
    return windowDiv;
}

//Create a series of windows for testing purposes

const window1 = createBuildingWindow('building1', 'Building 1');

windowPosition(window1);
const window2 = createBuildingWindow('building2', 'Building 2');

windowPosition(window2);
const window3 = createBuildingWindow('building3', 'Building 3');

windowPosition(window3);
const window4 = createBuildingWindow('building4', 'Building 4');

windowPosition(window4);
const window5 = createBuildingWindow('building5', 'Building 5');

windowPosition(window5);
repositionWindowsVertically();

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
                const otherWindowComputedStyle = window.getComputedStyle(otherWindow);
                const otherWindowMargin = otherWindowComputedStyle.margin;
                const windowDivComputedStyle = window.getComputedStyle(windowDiv);
                const windowDivMargin = windowDivComputedStyle.margin;
                otherWindow.style.left = originalPosition[0] - otherWindowMargin + 'px'; //the margins were compounding and moving the windows slowly to the right. 
                windowDiv.style.left = otherWindowOriginalPosition[0] - windowDivMargin + 'px'; //the margins were compounding and moving the windows slowly to the right. 
                console.log('new position: ', windowDiv.style.left)
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
    const collapseButtons = document.querySelectorAll("#TownArea .collapse-button");
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
    
            const townAreaRect = document.getElementById('TownArea').getBoundingClientRect();
            const mouseX = e.clientX - townAreaRect.left;
    
            const columnWidth = townAreaRect.width / 3;
            let columnIndex = (Math.ceil(mouseX / columnWidth));

            if (columnIndex <= 0) {
                console.log("out of bounds")
                columnIndex = 1
            } if (columnIndex >= 3) {
                columnIndex = 3
            }
    
            const newX = (columnIndex * columnWidth) + 125 - columnWidth;  
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

        const townAreaRect = document.getElementById('TownArea').getBoundingClientRect();
        const mouseX = e.clientX - townAreaRect.left;

        const columnWidth = townAreaRect.width / 3;
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
    const columnWidth = townArea.offsetWidth / 3; //new column width

    windows.forEach(window => {
        const columnIndex = Math.floor(window.offsetLeft / columnWidth);
        const newX = (columnIndex * columnWidth) + 125;  
        const newWidth = columnWidth - 50;

        window.style.left = newX + 'px';
        window.style.width = newWidth + 'px';
    })
}

//Browser resizing event listener
window.addEventListener('resize', resizeWindows);

// **Worker Area** 

//create worker windows
function createWorkerWindow(workerData) {
    const workerWindow = document.createElement('div');
    workerWindow.classList.add('workerWindow');

    //Worker name
    const nameDiv = document.createElement('div');
    nameDiv.classList.add('workerHeader');
    nameDiv.textContent = workerData.name;
    workerWindow.appendChild(nameDiv);

    //Worker picture
    const picture = document.createElement('img');
    picture.classList.add('workerPicture');
    picture.src = workerData.picture;
    picture.alt = workerData.picture + ' Picture';
    picture.style.height = '100px';
    picture.style.width = '100px';
    picture.style.padding = '10px'
    workerWindow.appendChild(picture);

    //Worker skills
    const skillsDiv = document.createElement('div');
    skillsDiv.classList.add('workerSkills');
    const skillsList = document.createElement('ul');
    workerData.skills.forEach(skill => {
        const skillItem = document.createElement('li');
        skillItem.textContent = skill.name + ": Level " + skill.level;
        skillsList.appendChild(skillItem);
    });
    skillsDiv.appendChild(skillsList);
    workerWindow.appendChild(skillsDiv);

    //Worker Data
    const statsDiv = document.createElement('div');
    statsDiv.classList.add('workerStats');
    const statsList = document.createElement('ul');
    workerData.stats.forEach(stat => {
        const statItem = document.createElement('li');
        statItem.textContent = stat.name + ": " + stat.value;
        statsList.appendChild(statItem);
    });
    statsDiv.appendChild(statsList);
    workerWindow.appendChild(statsDiv);

    //Worker ability
    const abilitiesDiv = document.createElement('div');
    abilitiesDiv.classList.add('workerAbilities');
    const abilitiesList = document.createElement('ul');
    workerData.abilities.forEach(abitlity => {
        const abitlityItem = document.createElement('li');
        abitlityItem.textContent = abitlity;
        abilitiesList.appendChild(abitlityItem);
    });
    abilitiesDiv.appendChild(abilitiesList);

    workerWindow.appendChild(abilitiesDiv);

    return workerWindow;
}

const workers = getWorkerData();
workers.forEach(worker => {
    const workerWindow = createWorkerWindow(worker);
    workersArea.appendChild(workerWindow);
});