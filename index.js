const DEFAULT_GRID_AREA = 16;
const DEFAULT_PIXEL_COLOR = "#000";


let gridArea = DEFAULT_GRID_AREA;
let pixelColor = DEFAULT_PIXEL_COLOR;

const root = document.documentElement;
const gridContainerEl = document.querySelector(".grid-box-container");

let currentlyActive = false; //checks whether mouse click is active inside grid canvas
let gridBoxes = []; //Array of all je pixels inside canvas
let showgrid = true;//show grid lines by default
let set__randomColor = false; //checks if random color is to be generated for each pixels or not

createGrid(gridArea);


const toggleGrigBtn = document.querySelector("button#grid-toggle");//Button to toggle Grid Lines
toggleGrigBtn.addEventListener("click", toggleGrid);

const clearBtn = document.querySelector("button#clear");//Clear Button
clearBtn.addEventListener("click", clear);

/***--------------------------------------- */

const randomColorBtn = document.querySelector("button#random")
randomColorBtn.addEventListener("click", () => {
  set__randomColor = set__randomColor ? false : true;
  randomColorBtn.classList.toggle("btn-select");
});

/**--------------------------------------------------------------------- */
function createGrid(area) {
  deleteGrid();

  for (let i = 0; i < area ** 2; i++) {
    const grid = document.createElement("div");
    grid.classList.add("grid-box");
    grid.setAttribute("data-value", i + 1);
    grid.addEventListener("mouseover", addTail); //tail effect on mouse hover
    grid.addEventListener("click", togglePixelFill); //fill color in pixel
    gridContainerEl.append(grid);
    gridContainerEl.setAttribute("data-size", gridArea);
    if (showgrid) grid.classList.add("grid-box-border");
    gridBoxes = [...document.querySelectorAll(".grid-box")];
  }
}

/**--------------------------------------------------------------------------- */

const sizeSelectorEl = document.querySelector("#size");
sizeSelectorEl.setAttribute("min", 3);
sizeSelectorEl.setAttribute("max", 6);
sizeSelectorEl.value = 4;//default value is 16 (2^4)
sizeSelectorEl.addEventListener("input", inputGridSize);

const gridSizeEl = document.querySelector("#grid-size");
gridSizeEl.textContent = `${gridArea} X ${gridArea}`;

/**------------Add tail effect when mouse hovers------------------------ */
function addTail(e) {
  if (window.matchMedia("(hover:hover)").matches) {
    e.target.addEventListener("mouseover", () => {
      this.classList.add("tail");
    });

    setTimeout(() => {
      e.target.classList.remove("tail");
    }, 100);
  }
}
/**------------------------------------------------------- */


const colorPickerEl = document.querySelector("#color__picker");
colorPickerEl.value = "#000";

colorPickerEl.addEventListener("input", (e) => {
  set__randomColor = false;
  pixelColor = e.target.value;
});


/**---------------------------- */

function fillPixel(e) {
  if (set__randomColor)
    pixelColor = randomColorGenerator(); //generate random color if randomColor is true

  e.target.style.backgroundColor = pixelColor;
  colorPickerEl.value = pixelColor;
}

function togglePixelFill() {
  if (!currentlyActive) {
    gridBoxes.forEach((box) => {
      box.addEventListener("mouseleave", fillPixel);
      box.addEventListener("touchstart", fillPixel);
      box.addEventListener("touchend", fillPixel);
    });
    currentlyActive = true;
  } else {
    gridBoxes.forEach((box) => {
      box.removeEventListener("mouseleave", fillPixel);
    });
    currentlyActive = false;
  }
}

function randomColorGenerator() {
  const letters = "0123456789ABCDEF";
  let randomColor = "#";
  for (let i = 0; i < 6; i++) {
    randomColor += letters[Math.floor(Math.random() * 16)];
  }
  return randomColor;
}
/**----------------------------------------------------------------- */


function inputGridSize(e) {
  gridArea = Math.pow(2, e.target.value);
  root.style.setProperty("--column__no", gridArea);

  createGrid(gridArea);
  gridSizeEl.textContent = `${gridArea} X ${gridArea}`;
}
/**----------------------------------------------------------- */



function deleteGrid() {
  gridBoxes.map((box) => box.remove());
}
/**-------------------------- */

function toggleGrid(e) {
  gridBoxes.forEach((box) => {
    showgrid ?
      box.classList.remove("grid-box-border") :
      box.classList.add("grid-box-border");
  });
  showgrid = showgrid ? false : true;
  e.target.textContent = showgrid ? "Hide Grid" : "Show Grid";
}

function clear() {
  createGrid(gridArea);
}


/**-------------------------Theme-------------- */
const documentBody = document.querySelector("body");
const themeChangeEl = document.querySelector("#theme");
const userPreference =
  window.matchMedia("(prefers-color-scheme:dark)").matches ?
    "Dark" : "Light";


if (userPreference === "Dark") {
  documentBody.classList.add("dark-theme");
  themeChangeEl.checked = true;
}
else {
  documentBody.classList.remove("dark-theme");
  themeChangeEl.checked = false;
}

themeChangeEl.addEventListener("change", () => {
  documentBody.classList.toggle("dark-theme");
});

