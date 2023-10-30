let search_minimized = false;
let search_toggle = "";

function displayTEIContent(filename) {
  fetch("get-xml/" + filename)
    .then((response) => response.text())
    .then((data) => {
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(data, "text/xml");

      // Extract elements
      const paragraphs = Array.from(xmlDoc.getElementsByTagName("p"));
      const heads = Array.from(xmlDoc.getElementsByTagName("head"));

      // Convert the XML elements to HTML and append them to the page
      const displayArea = document.getElementById("xml-display");

      heads.forEach((head) => {
        const h = document.createElement("h2");
        h.textContent = head.textContent;
        displayArea.appendChild(h);
      });

      paragraphs.forEach((p) => {
        const para = document.createElement("p");
        para.textContent = p.textContent;
        displayArea.appendChild(para);
      });
    });
}

function searchOneAndHighlight(phrase) {
  const displayArea = document.getElementById("xml-display");
  let innerHTML = displayArea.innerHTML;
  const regex = new RegExp(phrase, "gi");
  const replacement = `<span class="highlight">${phrase}</span>`;
  innerHTML = innerHTML.replace(regex, replacement);
  displayArea.innerHTML = innerHTML;
}

function searchWordsAndHighlight(phrase) {
  const displayArea = document.getElementById("xml-display");
  let innerHTML = displayArea.innerHTML;
  // Escape any special characters in the phrase
  const escapedPhrase = phrase.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");
  const regex = new RegExp(`(${escapedPhrase})`, "gi");
  const replacement = `<span class="highlight">$1</span>`;
  innerHTML = innerHTML.replace(regex, replacement);
  displayArea.innerHTML = innerHTML;
}

function searchPhraseAndHighlight(phrase) {
  const displayArea = document.getElementById("xml-display");

  // First, remove existing highlights
  const highlighted = Array.from(displayArea.querySelectorAll(".highlight"));
  highlighted.forEach((span) => {
    const parent = span.parentNode;
    while (span.firstChild) {
      parent.insertBefore(span.firstChild, span);
    }
    parent.removeChild(span);
  });

  // Continue with the search and highlighting process
  let innerHTML = displayArea.innerHTML;
  // Escape any special characters in the phrase
  const escapedPhrase = phrase.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");
  const regex = new RegExp(`(${escapedPhrase})`, "gi");
  const replacement = `<span class="highlight">$1</span>`;
  innerHTML = innerHTML.replace(regex, replacement);
  displayArea.innerHTML = innerHTML;
}

function searchAndHighlight(phrase) {
  const displayArea = document.getElementById("xml-display");
  const searchResults = document.getElementById("search_results");
  const searchContainer = document.getElementById("search_container");
  const searchInput = document.getElementById("search_input");

  searchContainer.innerHTML = ""; // Clear previous search results
  searchResults.innerHTML = ""; // Clear previous search results

  searchContainer.classList.remove("minimized");
  searchResults.classList.remove("minimized");
  search_minimized = false;

  // First, remove existing highlights
  const highlighted = Array.from(displayArea.querySelectorAll(".highlight"));
  highlighted.forEach((span) => {
    const parent = span.parentNode;
    while (span.firstChild) {
      parent.insertBefore(span.firstChild, span);
    }
    parent.removeChild(span);
  });

  let counter = 0;
  let innerHTML = displayArea.innerHTML;
  // Escape any special characters in the phrase
  const escapedPhrase = phrase.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");
  // Revised regex to capture strictly two words
  const regex = new RegExp(`((?:\\w+\\W+){0,2}\\w*)?\\W*(${escapedPhrase})\\W*(\\w*(?:\\W+\\w+){0,2})?`, "gi");

  innerHTML = innerHTML.replace(regex, function (match, p1, p2, p3) {
    const id = `match-${counter++}`;
    const resultItem = document.createElement("div");
    resultItem.className = "search-result";
    resultItem.innerHTML = `${p1 || ""} <strong>${p2}</strong> ${p3 || ""}`;
    resultItem.addEventListener("click", () => {
      const target = document.getElementById(id);
      const targetPosition = target.getBoundingClientRect().top;
      const offset = window.pageYOffset + targetPosition - window.innerHeight / 2;
      window.scrollTo(0, offset);

      // highlight the target when scroll to it
      if (search_toggle !== id) {
        if (search_toggle !== "") {
          const old_target = document.getElementById(search_toggle);
          if (old_target) old_target.classList.remove("jump-to");
        }
        search_toggle = id;
        target.classList.add("jump-to");
      }
      // search_results.classList.add("minimized");
    });
    searchResults.appendChild(resultItem);
    return `${p1 || ""} <span class="highlight" id="${id}">${p2}</span> ${p3 || ""}`;
  });

  if (searchResults.children.length > 0) {
    // search_results.style.display = "block";
    searchContainer.appendChild(searchResults);
    searchContainer.style.display = "block";
    pop_up_interactive(searchContainer, searchResults, searchInput);
  }

  draggable_div(searchContainer);

  displayArea.innerHTML = innerHTML;
}

function pop_up_interactive(doc_container, displayed_results, doc_scroll_top) {
  // Create a container div for text and button
  var container = document.createElement("div");
  container.style.display = "flex";
  // container.style.alignItems = "center";
  container.style.justifyContent = "space-between";
  container.className = "position-sticky position-absolute ms-2 mt-1 top-0";

  // Create a text span or div
  var textDisplay = document.createElement("span");
  textDisplay.className = "start-0 text-primary fs-6";
  textDisplay.textContent = "Found " + displayed_results.children.length + " results";
  container.appendChild(textDisplay); // Append text to the container

  const divButtons = document.createElement("div");
  divButtons.id = "sr_div_buttons";
  divButtons.className = "btn-group mb-1 ";
  divButtons.setAttribute("role", "group");

  const buttonItem = document.createElement("button");
  buttonItem.className = "btn btn-outline-primary btn-sm top-0";
  buttonItem.setAttribute("type", "button");

  buttonItem.textContent = "Minimize";
  buttonItem.id = "sr_minimize_button";
  buttonItem.addEventListener("click", () => {
    if (search_minimized === false) {
      doc_container.classList.add("minimized");
      displayed_results.classList.add("minimized");
      buttonItem.textContent = "Maxmize";
      search_minimized = true;
    } else {
      doc_container.classList.remove("minimized");
      displayed_results.classList.remove("minimized");
      buttonItem.textContent = "Minimize";
      search_minimized = false;
    }
  });

  // Append the container to the target div
  divButtons.appendChild(buttonItem); // Append button to the container

  // add scroll top button
  const buttonScrollTop = document.createElement("button");
  buttonScrollTop.className = "btn btn-outline-success btn-sm top-0";
  buttonScrollTop.setAttribute("type", "button");

  buttonScrollTop.textContent = "Scroll Top";
  buttonScrollTop.id = "sr_scroll_top_button";
  buttonScrollTop.addEventListener("click", () => {
    doc_scroll_top.scrollIntoView();
  });

  divButtons.appendChild(buttonScrollTop);
  container.appendChild(divButtons);
  doc_container.insertBefore(container, doc_container.firstChild);
}

function offset(el) {
  var rect = el.getBoundingClientRect(),
    scrollLeft = window.pageXOffset || document.documentElement.scrollLeft,
    scrollTop = window.pageYOffset || document.documentElement.scrollTop;

  return {
    top: rect.top + scrollTop,
    left: rect.left + scrollLeft,
  };
}

function draggable_div(doc_drag) {
  // Variables to hold mouse x and y position
  var mouseX = 0,
    mouseY = 0,
    elementX = 0,
    elementY = 0;

  function onMouseMove(event) {
    mouseX = event.clientX;
    mouseY = event.clientY;
    doc_drag.style.left = mouseX + elementX + "px";
    doc_drag.style.top = mouseY + elementY + "px";
  }

  doc_drag.addEventListener("mousedown", function (e) {
    // When the mouse button is pressed down, update the initial position
    elementX = doc_drag.offsetLeft - e.clientX;
    elementY = doc_drag.offsetTop - e.clientY;

    // Attach the listeners to `document`
    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
  });

  function onMouseUp() {
    // Remove the listeners when mouse button is released
    document.removeEventListener("mousemove", onMouseMove);
    document.removeEventListener("mouseup", onMouseUp);
  }
}
