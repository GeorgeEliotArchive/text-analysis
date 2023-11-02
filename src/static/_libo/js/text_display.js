let search_minimized = false;
let search_toggle = "";
let text_select = "";

function populateDropdown() {
  // Array of options to add
  var options = {
    "Brother Jacob": "Brother Jacob_refine_v1",
    "Middle March": "Middlemarch_refine_v1",
    "Adam Bebe": "Adam Bede_refine_v1.1",
    "Daniel Deronda": "Daniel_Deronda_refine_v1",
    "Felix Holt": "Felix Holt, the Radical_refine_v1",
    "Impressions of Theophrastus Such": "Impressions of Theophrastus Such",
    "Janet's Repentance": "Janet's Repentance",
    "Mr.Gilfil's Love Story": "Mr.Gilfil's Love Story",
    Romola: "Romola_refine_v1",
    "Silas Maner": "Silas Marner",
    "The Lifted Veil": "The Lifted Veil",
    "The Mill on the Floss": "The Mill on the Floss",
    "The Sad Fortunes of the Rev. Amos Barton": "The Sad Fortunes of the Reverend Amos Barton",
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

function displayTEIContent_(filename) {
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

function displayTEIContent(filename) {
  fetch("get-xml/" + filename)
    .then((response) => response.text())
    .then((data) => {
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

// function searchOneAndHighlight(phrase) {
//   const displayArea = document.getElementById("xml-display");
//   let innerHTML = displayArea.innerHTML;
//   const regex = new RegExp(phrase, "gi");
//   const replacement = `<span class="highlight">${phrase}</span>`;
//   innerHTML = innerHTML.replace(regex, replacement);
//   displayArea.innerHTML = innerHTML;
// }

// function searchWordsAndHighlight(phrase) {
//   const displayArea = document.getElementById("xml-display");
//   let innerHTML = displayArea.innerHTML;
//   // Escape any special characters in the phrase
//   const escapedPhrase = phrase.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");
//   const regex = new RegExp(`(${escapedPhrase})`, "gi");
//   const replacement = `<span class="highlight">$1</span>`;
//   innerHTML = innerHTML.replace(regex, replacement);
//   displayArea.innerHTML = innerHTML;
// }

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

  // // Escape any special characters in the phrase
  // const escapedPhrase = phrase.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");
  // // Adding word boundaries to the regex
  // const regex = new RegExp(`((?:\\w+\\W+){0,3}\\w*)?\\b(${escapedPhrase})\\b(\\w*(?:\\W+\\w+){0,3})?`, "gi");

  // Escape any special characters in the phrase
  const escapedPhrase = phrase.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");
  // Revised regex to capture strictly two words
  // const regex = new RegExp(`((?:\\w+\\W+){0,2}\\w*)?\\b(${escapedPhrase})\\b(\\w*(?:\\W+\\w+){0,2})?`, "gi");
  const regex = new RegExp(`((?:\\w+\\W+){0,2}\\w*)?\\b(${escapedPhrase})\\b(\\w*(?:\\W+\\w+){0,2})?`, "gi");

  innerHTML = innerHTML.replace(regex, function (match, p1, p2, p3) {
    let { p1_revised, p3_revised } = reviseP1P3(p1, p3);

    const id = `match-${counter++}`;
    const resultItem = document.createElement("div");
    resultItem.className = "search-result";
    resultItem.innerHTML = `${p1_revised || ""} <strong>${p2}</strong> ${p3_revised || ""}`;
    resultItem.addEventListener("click", () => {
      const target = document.getElementById(id);

      const targetPosition = target.getBoundingClientRect().top;
      const offset = window.pageYOffset + targetPosition - window.innerHeight / 2;
      window.scrollTo(0, offset);

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
    return `${p1 || ""} <span class="highlight" id="${id}">${p2}</span> ${p3 || ""}`;
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

function reviseP1P3(p1, p3) {
  let p1_revised = "";
  let p3_revised = "";
  console.log("p1: ", p1);
  console.log("p3: ", p3);
  if (p1 !== undefined) {
    // if (p1.includes("/p")) {
    //   p1_revised = "";
    // } else if (p1.includes(">")) {
    //   let parts = p1.split(">");
    //   p1_revised = parts[1].trim(); // Assuming you always want the part after ">"
    // } else {
    //   p1_revised = p1.trim(); // Just trim the original string if ">" is not present
    // }
    p1_revised = p1.replace(/<p\s*$/, "");
  }
  if (p3 !== undefined) {
    // if (p3.includes("<")) {
    //   let parts = p3.split("<");
    //   p3_revised = parts[0].trim(); // Assuming you always want the part after ">"
    // } else {
    //   p3_revised = p3.trim(); // Just trim the original string if ">" is not present
    // }
    p3_revised = p3.replace(/<p\s*$/, "");
  }

  return { p1_revised, p3_revised };
}
