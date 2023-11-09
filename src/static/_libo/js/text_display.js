let search_minimized = false;
let search_toggle = "";
let text_select = "";
let id_pop_row = "";

function populateDropdown() {
  // Array of options to add
  var options = {
    "Search a text to explore": "default_page",
    "Mr. Gilfil's Love Story (1857)": "Mr.Gilfil's Love Story",
    "Janet's Repentance (1857)": "Janet's Repentance",
    "The Sad Fortunes of the Rev. Amos Barton (1857)": "The Sad Fortunes of the Reverend Amos Barton",
    "Adam Bede (1859)": "Adam Bede_refine_v1.1",
    "The Lifted Veil (1859)": "The Lifted Veil",
    "The Mill on the Floss (1860)": "The Mill on the Floss",
    "Silas Marner (1861)": "Silas Marner",
    "Romola (1863)": "Romola_refine_v1",
    "Brother Jacob (1864)": "Brother Jacob_refine_v1",
    "Felix Holt, the Radical (1866)": "Felix Holt, the Radical_refine_v1",
    "Middlemarch (1871-72)": "Middlemarch_refine_v1",
    "Daniel Deronda (1876)": "Daniel_Deronda_refine_v1",
    "Impressions of Theophrastus Such (1879)": "Impressions of Theophrastus Such",
  };

  // Get the select element
  var select = document.getElementById("fiction_list");

  var firstOptionValue;

  for (let x in options) {
    if (options.hasOwnProperty(x)) {
      var opt = x;
      var el = document.createElement("option");
      el.textContent = opt;
      el.value = options[x];
      select.appendChild(el);

      if (!firstOptionValue) {
        firstOptionValue = options[x]; // Set the first option value
      }
    }
  }
  select.addEventListener("change", function () {
    var selectedOption = this.value;
    console.log("You selected: " + selectedOption);
    doc_clear = document.getElementById("xml-display");
    doc_clear.innerHTML = "";
    displayTEIContent(selectedOption);
  });

  // Select the first option as default
  select.value = firstOptionValue;

  // Trigger the change event or call the function directly for the first option
  // Method 1: Trigger change event
  var event = new Event("change");
  select.dispatchEvent(event);

  // Or Method 2: Call the function directly (if you prefer)
  // displayTEIContent(firstOptionValue);
}

// Call the function to populate the dropdown

function displayTEIContent(filename) {
  fetch("get-xml/" + filename)
    .then((response) => response.text())
    .then((data) => {
      hide_search_container();
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(data, "text/xml");
      // Serialize XML DOM to string
      let frontNode = xmlDoc.getElementsByTagName("front")[0];
      console.log(frontNode);
      var serializer = new XMLSerializer();
      var serializedXml = serializer.serializeToString(xmlDoc);
      // Escape the XML string

      document.getElementById("xml-display").innerHTML = escapeXml(serializedXml);
    });
}

function searchAndHighlight(phrase) {
  // const displayArea = document.getElementById("xml-display");
  const displayArea = document.getElementsByTagName("text")[0];

  const searchResults = document.getElementById("search_results");
  const searchContainer = document.getElementById("search_container");
  const searchInput = document.getElementById("search_input");

  searchContainer.innerHTML = ""; // Clear previous search results
  searchContainer.classList.remove("minimized");

  searchResults.innerHTML = "";
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

  // v1
  // // Escape any special characters in the phrase
  // const escapedPhrase = phrase.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");
  // // Adding word boundaries to the regex
  // const regex = new RegExp(`((?:\\w+\\W+){0,3}\\w*)?\\b(${escapedPhrase})\\b(\\w*(?:\\W+\\w+){0,3})?`, "gi");

  // v2
  // const escapedPhrase = phrase.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");
  // const regex = new RegExp(`((?:\\w+\\W+){0,2}\\w*)?\\b(${escapedPhrase})\\b(\\w*(?:\\W+\\w+){0,2})?`, "gi");

  // v3
  const escapedPhrase = phrase.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");
  const variationPattern = `\\w*`; // This matches "ing" or "s" after the base word.
  const regex = new RegExp(`((?:\\w+\\W+){0,3})?\\b(${escapedPhrase}${variationPattern})((?:\\W+\\w+){0,3})?`, "gi");

  // // v4
  // const escapedPhrase = phrase.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");
  // console.log(escapedPhrase);
  // const regex = new RegExp(`((?:^|\\w+\\W+){0,3})?(${escapedPhrase})((?:\\W+\\w+){0,3})?`, "gi");

  innerHTML = innerHTML.replace(regex, function (match, p1, p2, p3) {
    // let { p1_revised, p3_revised } = reviseP1P3(p1, p3);
    let p1_revised = revisePhrase(p1);
    let p3_revised = revisePhrase(p3);

    const id = `match-${counter++}`;
    const id_pop = `pop-${counter++}`;
    const resultItem = document.createElement("div");
    resultItem.className = "search-result";
    resultItem.innerHTML = `<span  id="${id_pop}">${p1_revised || ""}<strong>${p2}</strong>${p3_revised || ""}</span>`;
    resultItem.addEventListener("click", () => {
      const target = document.getElementById(id);
      const targetPosition = target.getBoundingClientRect().top;
      const offset = window.pageYOffset + targetPosition - window.innerHeight / 2;
      minimize_pop();
      window.scrollTo(0, offset);

      // highlight the target when scroll to it
      const target_pop_row = document.getElementById(id_pop_row);
      if (target_pop_row) target_pop_row.classList.remove("text-primary");
      const target_pop = document.getElementById(id_pop);
      target_pop.classList.add("text-primary");
      id_pop_row = id_pop;

      // displayArea.scrollTop = targetPosition;

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
    return `${p1 || ""}<span class="highlight" id="${id}">${p2}</span>${p3 || ""}`;
  });

  searchContainer.appendChild(searchResults);
  if (searchResults.children.length === 0) {
    search_minimized = true;
  }
  searchContainer.style.display = "block";
  pop_up_interactive(searchContainer, searchResults, searchInput);

  draggable_div(searchContainer);

  displayArea.innerHTML = innerHTML;
}

function pop_up_interactive(doc_container, displayed_results, doc_scroll_top) {
  // Create a container div for text and button
  const container = document.createElement("div");
  container.style.display = "flex";
  // container.style.alignItems = "center";
  container.style.justifyContent = "space-between";
  container.className = "position-sticky position-absolute mt-1 top-0";
  if (displayed_results.offsetWidth < 50) {
    // if the search results are none, set the width to 300px
    container.style.width = 300 + "px";
  } else {
    container.style.width = displayed_results.offsetWidth - 26 + "px";
  }

  // Create a text span or div
  var textDisplay = document.createElement("span");
  textDisplay.className = "start-0 text-primary fs-6";
  textDisplay.textContent = displayed_results.children.length + " results";
  container.appendChild(textDisplay); // Append text to the container

  const divButtons = document.createElement("div");
  divButtons.id = "sr_div_buttons";
  divButtons.className = "btn-group mb-1 ";
  divButtons.setAttribute("role", "group");

  const buttonItem = document.createElement("button");
  buttonItem.className = "btn btn-outline-primary btn-sm top-0";
  buttonItem.setAttribute("type", "button");

  buttonItem.textContent = "Min";
  buttonItem.id = "sr_minimize_button";
  buttonItem.addEventListener("click", () => {
    if (search_minimized === false) {
      doc_container.classList.add("minimized");
      displayed_results.classList.add("minimized");
      buttonItem.textContent = "Max";
      search_minimized = true;
    } else {
      doc_container.classList.remove("minimized");
      displayed_results.classList.remove("minimized");
      buttonItem.textContent = "Min";
      search_minimized = false;
    }
  });

  // Append the container to the target div
  divButtons.appendChild(buttonItem); // Append button to the container

  // add scroll top button
  const buttonScrollTop = document.createElement("button");
  buttonScrollTop.className = "btn btn-outline-success btn-sm top-0";
  buttonScrollTop.setAttribute("type", "button");

  buttonScrollTop.textContent = "Top";
  buttonScrollTop.id = "sr_scroll_top_button";
  buttonScrollTop.addEventListener("click", () => {
    doc_scroll_top.scrollIntoView();
  });

  divButtons.appendChild(buttonScrollTop);
  container.appendChild(divButtons);
  doc_container.insertBefore(container, doc_container.firstChild);
}

function offset(el) {
  const rect = el.getBoundingClientRect(),
    scrollLeft = window.pageXOffset || document.documentElement.scrollLeft,
    scrollTop = window.pageYOffset || document.documentElement.scrollTop;

  return {
    top: rect.top + scrollTop,
    left: rect.left + scrollLeft,
  };
}

function draggable_div(doc_drag) {
  // Variables to hold mouse x and y position
  let mouseX = 0,
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

function xmlToHtml(xmlNode) {
  var html = "";

  // Iterate over XML nodes and build HTML
  xmlNode.childNodes.forEach(function (node) {
    switch (node.nodeType) {
      case Node.ELEMENT_NODE: // Element
        html += "<div><strong>" + node.nodeName + ":</strong>";
        html += xmlToHtml(node); // Recursive call for child nodes
        html += "</div>";
        break;
      case Node.TEXT_NODE: // Text
        if (node.textContent.trim() !== "") {
          html += " " + node.textContent;
        }
        break;
    }
  });

  return html;
}

function escapeXml(xmlString) {
  // Escape special characters, <q>'s, and </q>'s
  return xmlString.replace(/<q>/gi, "").replace(/<\/q>/gi, "");
}

function revisePhrase(phrase) {
  let p_revised = "";

  if (phrase !== undefined) {
    p_revised = phrase.replace(/<p\s*$/, "");
  }

  return p_revised;
}

function minimize_pop() {
  const buttonItem = document.getElementById("sr_minimize_button");
  const doc_container = document.getElementById("search_container");
  const displayed_results = document.getElementById("search_results");
  if (search_minimized === false) {
    doc_container.classList.add("minimized");
    displayed_results.classList.add("minimized");
    buttonItem.textContent = "Max";
    search_minimized = true;
  }
}

function hide_search_container() {
  const searchContainer = document.getElementById("search_container");
  if (searchContainer !== null) {
    // searchContainer.innerHTML = "";
    searchContainer.style.display = "none";
  }
}
