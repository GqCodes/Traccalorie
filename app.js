// Storage Controller

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
    items: [
      //   { id: 0, name: "Steak Dinner", calories: 1200 },
      //   { id: 1, name: "Cookie", calories: 400 },
      //   { id: 2, name: "Eggs", calories: 300 },
    ],
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
    addBtn: ".add-btn",
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
          <a href="#" class="secondary-content"> <i class="edit item fa fa-pencil"></i></a>`;
      //   insert item
      document.querySelector(UISelectors.itemList).insertAdjacentElement("beforeend", li);
    },

    clearInput: () => {
      document.querySelector(UISelectors.itemNameInput).value = "";
      document.querySelector(UISelectors.itemCaloriesInput).value = "";
    },
    hidelist: () => {
      document.querySelector(UISelectors.itemList).style.display = "none";
    },
    showTotalCalories: (totalCalories) => {
      document.querySelector(UISelectors.totalCalories).textContent = totalCalories;
    },
    getSelectors: () => UISelectors,
  };
})();

/************** 
 App Controller
****************/
const App = ((ItemCtrl, UICtrl) => {
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

        // clear fields
        UICtrl.clearInput();
      }
      e.preventDefault();
      // Add item event
    };
    document.querySelector(UISelectors.addBtn).addEventListener("click", itemAddSubmit);
  };

  //   Public methods
  return {
    init: () => {
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
})(ItemCtrl, UICtrl);

/************** 
Initialize App
****************/
App.init();
