const API_URL = "http://localhost:5000/api/menu";

const menuList = document.getElementById("menu-list");
const addItemForm = document.getElementById("add-item-form");

// Fetch all menu items from the API and display them
async function loadMenu() {
  try {
    const response = await fetch(API_URL);
    const result = await response.json();

    if (!result.success || result.data.length === 0) {
      menuList.innerHTML = "<p>No menu items found. Add one below!</p>";
      return;
    }

    menuList.innerHTML = result.data
      .map(
        (item) => `
        <div class="menu-item">
          <div class="menu-item-info">
            <h3>${item.name}</h3>
            <p>${item.description || ""}</p>
          </div>
          <div class="menu-item-price">
            ₦${item.price}
          </div>
        </div>
      `
      )
      .join("");
  } catch (error) {
    menuList.innerHTML = "<p>Error loading menu items. Please try again later.</p>";
    console.error("Error fetching menu items:", error);
  }
}

// Handle the "Add menu item" form submission
addItemForm.addEventListener("submit", async (event) => {
  event.preventDefault(); // stops the page from reloading on submit
  const newItem = {
    name: document.getElementById("name").value,
    description: document.getElementById("description").value,
    price: Number(document.getElementById("price").value),
    category: document.getElementById("category").value,
  };
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newItem),
    });

    const result = await response.json();

    if (result.success) {
      addItemForm.reset(); // clear the form
      loadMenu(); // refresh the list to show the new item
    } else {
      alert("Failed to add item: " + result.message);
    }
  } catch (error) {
    alert("Something went wrong. Check the console.");
    console.error("Error adding item:", error);
  }
});

// Load the menu as soon as the page opens
loadMenu();