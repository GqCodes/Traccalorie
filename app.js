// Storage Controller
const StorageCtrl = (function () {
  // public methods
  return {
    storeItem: function (item) {
      let items;
      // check if any items in local storage
      if (localStorage.getItem("items") === null) {
        items = [];
        // push new item
        items.push(item);
        // set local storage
        localStorage.setItem("items", JSON.stringify(items));
      } else {
        // get what is already in local storage
        items = JSON.parse(localStorage.getItem("items"));

        // push new item
        items.push(item);

        // reset local storage
        localStorage.setItem("items", JSON.stringify(items));
      }
    },
    getItemsFromStorage: function () {
      let items;
      if (localStorage.getItem("items") === null) {
        items = [];
      } else {
        items = JSON.parse(localStorage.getItem("items"));
      }
      return items;
    },
    updateItemStorage: function (updatedItem) {
      let items = JSON.parse(localStorage.getItem("items"));

      items.forEach(function (item, index) {
        if (updatedItem.id === item.id) {
          items.splice(index, 1, updatedItem);
        }
      });
      localStorage.setItem("items", JSON.stringify(items));
    },
    deleteItemFromStorage: function (id) {
      let items = JSON.parse(localStorage.getItem("items"));

      items.forEach(function (item, index) {
        if (id === item.id) {
          items.splice(index, 1);
        }
      });
      localStorage.setItem("items", JSON.stringify(items));
    },
    clearItemsFromStorage: function () {
      localStorage.removeItem("items");
    },
  };
})();

/************** 
Item Controller
****************/
const ItemCtrl = (function () {
  // Item Constructor
  const Item = function (id, name, calories) {
    this.id = id;
    this.name = name;
    this.calories = calories;
  };

  //   Data Structure / State
  const data = {
    // items: [
    //   //   { id: 0, name: "Steak Dinner", calories: 1200 },
    //   //   { id: 1, name: "Cookie", calories: 400 },
    //   //   { id: 2, name: "Eggs", calories: 300 },
    // ],
    items: StorageCtrl.getItemsFromStorage(),
    currentItem: null,
    totalCalories: 0,
  };
  // Public methods
  return {
    getItems: () => data.items,
    addItem: (name, calories) => {
      let ID;
      // create id
      if (data.items.length > 0) {
        ID = data.items[data.items.length - 1].id + 1;
      } else {
        ID = 0;
      }

      //   calories to number
      calories = parseInt(calories);

      //   create new item
      newItem = new Item(ID, name, calories);
      //   add to items array
      data.items.push(newItem);
      return newItem;
    },
    getItemById: function (id) {
      let found = null;
      // loop through the items
      data.items.forEach(function (item) {
        if (item.id === id) {
          found = item;
        }
      });
      return found;
    },
    updateItem: function (name, calories) {
      // calories to number
      calories = parseInt(calories);

      let found = null;

      data.items.forEach(function (item) {
        if (item.id === data.currentItem.id) {
          item.name = name;
          item.calories = calories;
          found = item;
        }
      });
      return found;
    },
    deleteItem: function (id) {
      // Get ids
      const ids = data.items.map(function (item) {
        return item.id;
      });

      // get index
      const index = ids.indexOf(id);

      // remove item
      data.items.splice(index, 1);
    },
    clearAllItems: function () {
      data.items = [];
    },
    setCurrentItem: function (item) {
      data.currentItem = item;
    },
    getCurrentItem: function () {
      return data.currentItem;
    },
    getTotalCalories: () => {
      let total = 0;
      //   loop through items and add cals
      data.items.forEach((item) => {
        total += item.calories;
      });
      //   set total cal in data structure
      data.totalCalories = total;
      //   return total
      return data.totalCalories;
    },
    logData: () => data,
  };
})();

/************** 
 UI Controller 
****************/
const UICtrl = (() => {
  const UISelectors = {
    itemList: "#item-list",
    listItems: "#item-list li",
    addBtn: ".add-btn",
    updateBtn: ".update-btn",
    deleteBtn: ".delete-btn",
    backBtn: ".back-btn",
    clearBtn: ".clear-btn",
    itemNameInput: "#item-name",
    itemCaloriesInput: "#item-calories",
    totalCalories: ".total-calories",
  };

  // public method
  return {
    populateItemList: (items) => {
      let html = "";
      items.forEach((item) => {
        html += `<li class="collection-item" id="${item.id}">
          <strong>${item.name}: </strong> <em>${item.calories} Calories</em>
          <a href="#" class="secondary-content"> <i class="edit item fa fa-pencil"></i></a></li>`;
      });

      //   insert list items
      document.querySelector(UISelectors.itemList).innerHTML = html;
    },
    getItemInput: () => {
      return {
        name: document.querySelector(UISelectors.itemNameInput).value,
        calories: document.querySelector(UISelectors.itemCaloriesInput).value,
      };
    },
    addListItem: (item) => {
      //   show item
      document.querySelector(UISelectors.itemList).style.display = "block";
      // create li element
      const li = document.createElement("li");
      //   add class
      li.className = "collection-item";
      //   add ID
      li.id = `item-${item.id}`;
      //   add HTML
      li.innerHTML = `<strong>${item.name}: </strong> <em>${item.calories} Calories</em>
          <a href="#" class="secondary-content"> <i class="edit-item fa fa-pencil"></i></a>`;
      //   insert item
      document.querySelector(UISelectors.itemList).insertAdjacentElement("beforeend", li);
    },
    updateListItem: function (item) {
      let listItems = document.querySelectorAll(UISelectors.listItems);

      // Turn node list into array
      listItems = Array.from(listItems);

      listItems.forEach(function (listItem) {
        const itemID = listItem.getAttribute("id");
        if (itemID === `item-${item.id}`) {
          document.querySelector(`#${itemID}`).innerHTML = `<strong>${item.name}: </strong> <em>${item.calories} Calories</em>
          <a href="#" class="secondary-content"> <i class="edit-item fa fa-pencil"></i></a>`;
        }
      });
    },

    deleteListItem: function (id) {
      const itemID = `#item-${id}`;
      const item = document.querySelector(itemID);
      item.remove();
    },

    clearInput: () => {
      document.querySelector(UISelectors.itemNameInput).value = "";
      document.querySelector(UISelectors.itemCaloriesInput).value = "";
    },
    addItemToForm: function () {
      document.querySelector(UISelectors.itemNameInput).value = ItemCtrl.getCurrentItem().name;
      document.querySelector(UISelectors.itemCaloriesInput).value = ItemCtrl.getCurrentItem().calories;
      UICtrl.showEditState();
    },
    removeItems: function () {
      let listItems = document.querySelectorAll(UISelectors.listItems);

      // turn node list into array
      listItems = Array.from(listItems);

      listItems.forEach(function (item) {
        item.remove();
      });
    },
    hidelist: () => {
      document.querySelector(UISelectors.itemList).style.display = "none";
    },
    showTotalCalories: (totalCalories) => {
      document.querySelector(UISelectors.totalCalories).textContent = totalCalories;
    },
    clearEditState: function () {
      UICtrl.clearInput();
      document.querySelector(UISelectors.updateBtn).style.display = "none";
      document.querySelector(UISelectors.deleteBtn).style.display = "none";
      document.querySelector(UISelectors.backBtn).style.display = "none";
      document.querySelector(UISelectors.addBtn).style.display = "inline";
    },
    showEditState: function () {
      document.querySelector(UISelectors.updateBtn).style.display = "inline";
      document.querySelector(UISelectors.deleteBtn).style.display = "inline";
      document.querySelector(UISelectors.backBtn).style.display = "inline";
      document.querySelector(UISelectors.addBtn).style.display = "none";
    },
    getSelectors: () => UISelectors,
  };
})();

/************** 
 App Controller
****************/
const App = ((ItemCtrl, StorageCtrl, UICtrl) => {
  // Load event listeners
  const loadEventListeners = () => {
    // get ui selectors
    const UISelectors = UICtrl.getSelectors();

    //   Add item submit
    const itemAddSubmit = (e) => {
      // get form input from UI controller
      const input = UICtrl.getItemInput();

      //   check for name and calorie input
      if (input.name !== "" && input.calories !== "") {
        // add item
        const newItem = ItemCtrl.addItem(input.name, input.calories);

        // add item to UI list
        UICtrl.addListItem(newItem);

        // get total calories
        const totalCalories = ItemCtrl.getTotalCalories();
        // add total to ui
        UICtrl.showTotalCalories(totalCalories);

        // store in local storage
        StorageCtrl.storeItem(newItem);

        // clear fields
        UICtrl.clearInput();
      }
      e.preventDefault();
    };
    // Add item event
    document.querySelector(UISelectors.addBtn).addEventListener("click", itemAddSubmit);

    // click edit item
    const itemEditClick = function (e) {
      if (e.target.classList.contains("edit-item")) {
        // Get list item id
        const listId = e.target.parentNode.parentNode.id;
        // break into an array
        const listIdArr = listId.split("-");
        // get the actual id
        const id = parseInt(listIdArr[1]);
        // get item
        const itemToEdit = ItemCtrl.getItemById(id);
        // set current item
        ItemCtrl.setCurrentItem(itemToEdit);

        // add item to form
        UICtrl.addItemToForm();
      }
      e.preventDefault();
    };
    // edit icon click event
    document.querySelector(UISelectors.itemList).addEventListener("click", itemEditClick);

    // update items submit
    const itemUpdateSubmit = function (e) {
      // get item input
      const input = UICtrl.getItemInput();

      // update item
      const updatedItem = ItemCtrl.updateItem(input.name, input.calories);

      // Update Ui
      UICtrl.updateListItem(updatedItem);

      // get total calories
      const totalCalories = ItemCtrl.getTotalCalories();
      // add total to ui
      UICtrl.showTotalCalories(totalCalories);

      // update local storage
      StorageCtrl.updateItemStorage(updatedItem);

      UICtrl.clearEditState();

      e.preventDefault();
    };
    // update item event
    document.querySelector(UISelectors.updateBtn).addEventListener("click", itemUpdateSubmit);

    // Back Button event
    document.querySelector(UISelectors.backBtn).addEventListener("click", UICtrl.clearEditState);

    // delete item event
    const itemDeleteSubmit = function (e) {
      // get id from current item
      const currentItem = ItemCtrl.getCurrentItem();
      // delete from data structure
      ItemCtrl.deleteItem(currentItem.id);

      // delete from ui
      UICtrl.deleteListItem(currentItem.id);

      // get total calories
      const totalCalories = ItemCtrl.getTotalCalories();
      // add total to ui
      UICtrl.showTotalCalories(totalCalories);

      // delete from local storage
      StorageCtrl.deleteItemFromStorage(currentItem.id);

      UICtrl.clearEditState();

      e.preventDefault(e);
    };

    document.querySelector(UISelectors.deleteBtn).addEventListener("click", itemDeleteSubmit);

    // Clear Items
    const clearAllItemsClick = function () {
      // delete all items from data structure
      ItemCtrl.clearAllItems();

      // get total calories
      const totalCalories = ItemCtrl.getTotalCalories();
      // add total to ui
      UICtrl.showTotalCalories(totalCalories);

      // remove from ui
      UICtrl.removeItems();

      // clear from local storage
      StorageCtrl.clearItemsFromStorage();

      // hide ul
      UICtrl.hidelist();
    };

    document.querySelector(UISelectors.clearBtn).addEventListener("click", clearAllItemsClick);
    // disable submit on enter
    document.addEventListener("keypress", function (e) {
      if (e.keyCode === 13 || e.which === 13) {
        e.preventDefault();
        return false;
      }
    });
  };

  //   Public methods
  return {
    init: () => {
      // clear edit state / set initial state
      UICtrl.clearEditState();

      //   Fetch items from data structure
      const items = ItemCtrl.getItems();

      //   check if any items
      if (items.length === 0) {
        UICtrl.hidelist();
      } else {
        //   Populate list with items
        UICtrl.populateItemList(items);
      }

      // get total calories
      const totalCalories = ItemCtrl.getTotalCalories();
      // add total to ui
      UICtrl.showTotalCalories(totalCalories);

      //   load event listeners
      loadEventListeners();
    },
  };
})(ItemCtrl, StorageCtrl, UICtrl);

/************** 
Initialize App
****************/
App.init();
