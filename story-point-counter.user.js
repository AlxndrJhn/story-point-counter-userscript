// ==UserScript==
// @name         Auto Selected Story Counter
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  every second, count the selected rows in story points
// @author       You
// @match        https://dev.azure.com/*/*/_backlogs/backlog/*/Stories
// @icon         https://www.google.com/s2/favicons?sz=64&domain=azure.com
// @grant        none
// ==/UserScript==
var lastSelectedRowCount = 0;
var lastTotal = 0;
var lastCountOfNans = 0;
function getSelectedStoryPoints() {
  // column for story points
  let gridHeaderCanvas = document.querySelector(
    "div.grid-header > div.grid-header-canvas"
  );
  let children = gridHeaderCanvas.children;
  let searchText = "story points";

  let foundIndex = -1; // Default to -1, indicating not found

  for (let i = 0; i < children.length; i++) {
    if (
      children[i].textContent.toLowerCase().includes(searchText.toLowerCase())
    ) {
      foundIndex = i;
      break;
    }
  }

  //   console.log(foundIndex); // Outputs the found index, or -1 if not found
  if (foundIndex === -1) {
    console.log("Not found");
  }

  // rows
  let selectedRows = document.querySelectorAll(".grid-row-selected");

  // count all cells in the selected rows in the column with the found index
  let total = 0;
  let counted = 0;
  let nans = 0;
  for (let i = 0; i < selectedRows.length; i++) {
    counted++;
    let storyPoints = parseInt(
      selectedRows[i].children[foundIndex].textContent
    );
    if (isNaN(storyPoints) || storyPoints <= 0) {
      nans++;
      //   console.log(
      //     "NaN: `" + selectedRows[i].children[foundIndex].textContent + "`"
      //   );
      // make the background red
      //   selectedRows[i].children[foundIndex].style.backgroundColor = "red";
    } else {
      //   selectedRows[i].children[foundIndex].style.backgroundColor = "green";
      total += storyPoints;
    }
  }
  if (
    lastSelectedRowCount !== counted ||
    lastTotal !== total ||
    lastCountOfNans !== nans
  ) {
    lastSelectedRowCount = counted;
    lastTotal = total;
    lastCountOfNans = nans;
    console.log(
      `Selected rows: ${counted}, total: ${total}, unpokered: ${nans}`
    );
  }
}

(function () {
  "use strict";

  setInterval(function () {
    getSelectedStoryPoints();
  }, 1000); // 1000 milliseconds
})();
