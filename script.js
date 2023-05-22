const modal = document.getElementById("modal-container"),
  modalShow = document.getElementById("show-modal"),
  modalClose = document.getElementById("close-modal"),
  bookmarkForm = document.getElementById("bookmark-form"),
  websiteNameEl = document.getElementById("website-name"),
  websiteUrlEl = document.getElementById("website-url"),
  bookmarksContainer = document.getElementById("bookmarks-container");

// let bookmarks = [];
// console.log(bookmarks);
// saveinFirebase();

// Show Modal, Focus on Input
function showModal() {
  modal.classList.add("show-modal");
  websiteNameEl.focus();
}

// Validate Form
function validate(nameValue, urlValue) {
  const expression =
    /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/g;
  const regex = new RegExp(expression);
  if (!nameValue || !urlValue) {
    alert("Please submit values for both fields");
    return false;
  }
  if (!urlValue.match(regex)) {
    alert("Please provide a valid url");
    return false;
  }
  // Valid
  return true;
}

// Helper function for setting attribute
function setElementAttributes(element, attributes) {
  for (let key in attributes) {
    element.setAttribute(key, attributes[key]);
  }
}

// Build our Bookmarks DOM
function buildBookmarks() {
  bookmarksContainer.textContent = "";

  console.log(bookmarks);
  // Build Item
  bookmarks.forEach((bookmark) => {
    // Destructuring
    const { name, url } = bookmark;

    // Item
    const item = document.createElement("div");
    item.classList.add("item");
    const closeIcon = document.createElement("i");
    closeIcon.classList.add("fas", "fa-times");
    setElementAttributes(closeIcon, {
      title: "Delete Bookmark",
      onclick: `deleteBookmark('${url}')`,
    });

    // Favicon/ Link Container
    const linkInfo = document.createElement("div");
    linkInfo.classList.add("name");

    //Favicon
    const favicon = document.createElement("img");
    setElementAttributes(favicon, {
      src: `https://www.google.com/s2/u/0/favicons?domain=${url}`,
      alt: "Favicon",
    });

    // Link
    const link = document.createElement("a");
    setElementAttributes(link, {
      href: url,
      target: "_blank",
    });
    link.textContent = name;

    // Append to our bookmarks container
    linkInfo.append(favicon, link);
    item.append(closeIcon, linkInfo);
    bookmarksContainer.appendChild(item);
  });
}

function deleteBookmark(url) {
  const index = bookmarks.findIndex((bookmark) => bookmark.url === url);
  bookmarks.splice(index, 1);
  // Update bookmarks
  // localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
  // console.log(bookmarks);
  buildBookmarks();
  saveinFirebase();
  // getFromFirebase();
}

async function saveinFirebase() {
  try {
    const response = await fetch(
      "https://bookmarks-6d735-default-rtdb.firebaseio.com/bookmarks.json",
      {
        method: "PUT",
        body: JSON.stringify(bookmarks),
      }
    );
    bookmarks = await response.json();
    fetchBookmarks();
  } catch (error) {}
}

let data;

async function getFromFirebase() {
  try {
    const response = await fetch(
      "https://bookmarks-6d735-default-rtdb.firebaseio.com/bookmarks.json"
    );
    data = await response.json();
    fetchBookmarks();
  } catch (error) {}
}

// Fetch Bookmarks
function fetchBookmarks() {
  // Get Bookmarks from localStorage
  if (data) {
    bookmarks = data;
  } else {
    // Create bookmarks array in lcoalStorage
    bookmarks = [
      {
        name: "Google",
        url: "google.com",
      },
    ];
    // saveinFirebase();
  }
  buildBookmarks();
}

// Handle Data from form
function storeBookmark(event) {
  event.preventDefault();
  const nameValue = websiteNameEl.value;
  let urlValue = websiteUrlEl.value;
  if (!urlValue.includes("https://") && !urlValue.includes("http://")) {
    urlValue = `https://${urlValue}`;
  }
  if (!validate(nameValue, urlValue)) {
    return false;
  }
  const bookmark = {
    name: nameValue,
    url: urlValue,
  };

  bookmarks.push(bookmark);
  buildBookmarks();
  saveinFirebase();
  // console.log(bookmarks);
  // getFromFirebase();
  bookmarkForm.reset();
  websiteNameEl.focus();
}

// Modal Event Listener
modalShow.addEventListener("click", showModal);
modalClose.addEventListener("click", () => {
  modal.classList.remove("show-modal");
});
// false means we aren't gonna do anything
window.addEventListener("click", (event) =>
  event.target === modal ? modal.classList.remove("show-modal") : false
);

bookmarkForm.addEventListener("submit", storeBookmark);
getFromFirebase();
