
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
windowHeaders.forEach(header => {
    header.addEventListener("click", () => {
        const windowId = header.parentNode.id;
        toggleWindow(windowId);
    });
});

// Drag and Drop Functionality

let isDragging = false;
let offsetX, offsetY;
let activeWindow = null;

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
        activeWindwow = null;
    }
});

document.addEventListener("mousemove", (e) => {
    if (!isDragging || !activeWindow) return;

    e.preventDefault();

    console.log("mousemove")
    
    // Calculate the new position using getBoundingClientRect for accurate positioning
    const newX = e.clientX - offsetX;
    const newY = e.clientY - offsetY;

    activeWindow.style.left = newX + 'px';
    activeWindow.style.top = newY + 'px';
});