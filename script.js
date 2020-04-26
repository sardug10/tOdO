var dataController = (function () {
  var NewTodo = function (id, description) {
    this.id = id;
    this.description = description;
  };

  var data = {
    allItems: [],
  };

  return {
    item: function (desc) {
      var newItem, ID;

      if (data.allItems.length > 0) {
        ID = data.allItems[data.allItems.length - 1].id + 1;
      } else {
        ID = 0;
      }

      newItem = new NewTodo(ID, desc);
      data.allItems.push(newItem);

      return newItem;
    },

    deleteItem: function (id) {
      data.allItems.splice(id, 1);
    },
  };
})();

var UIcontroller = (function () {
  const DOMstrings = {
    addBtn: ".main-btn",
    todoInput: ".main-input",
    listContainer: ".main-lists",
    itemDone: ".item-done",
    itemDelete: ".item-delete",
    container: ".main-lists",
  };
  return {
    getDomStrings: function () {
      return DOMstrings;
    },

    getInput: function () {
      return {
        description: document.querySelector(DOMstrings.todoInput).value,
      };
    },

    addNewItem: function (obj) {
      var html = `<div class="list_item" id="item-%id%">
        <h3>
          %description%
          <span class="item-delete"
            ><ion-icon name="close-circle-outline"></ion-icon
          ></span>
          <span class="item-done"
            ><ion-icon name="checkmark-circle-outline"></ion-icon
          ></span>
        </h3>
      </div>`;
      var element = DOMstrings.listContainer;
      var newHtml = html.replace("%id%", obj.id);
      newHtml = newHtml.replace("%description%", obj.description);

      document.querySelector(element).insertAdjacentHTML("beforeend", newHtml);
    },

    clearFields: function () {
      document.querySelector(DOMstrings.todoInput).value = "";
    },

    UIdeleteItem: function (itemId) {
      var el;
      el = document.getElementById(itemId);
      el.parentNode.removeChild(el);
    },

    UIcheckItem: function (itemId) {
      document.getElementById(itemId).classList.add("list-checked");
    },
  };
})();

var globalController = (function (datactrl, UIctrl) {
  const Dom = UIctrl.getDomStrings();
  var setUpEventListeners = function () {
    document.querySelector(Dom.addBtn).addEventListener("click", ctrlAddItem);

    document.addEventListener("keypress", function (event) {
      if (event.keyCode === 13 || event.which === 13) {
        ctrlAddItem();
      }
    });

    //document.querySelector(Dom.itemDone).addEventListener('click', UIctrl.itemChecked)
    document
      .querySelector(Dom.container)
      .addEventListener("click", function (event) {
        itemId = event.target.parentNode.parentNode.parentNode.id;
        itemClass = event.target.parentNode.className;
        console.log(itemId, itemClass);

        if (itemClass === "item-delete") {
          ctrlDeleteItem(itemId);
        } else if (itemClass === "item-done") {
          ctrlCheckItem(itemId);
        }
      });
  };

  var ctrlAddItem = function () {
    // getting the input values
    input = UIctrl.getInput();
    //console.log(input.description);

    // send it to data controller
    if (input.description !== "") {
      newItem = datactrl.item(input.description);
      console.log(newItem);
    }

    //display it on the UI
    UIctrl.addNewItem(newItem);

    //clear the input fields
    UIctrl.clearFields();
  };

  var ctrlDeleteItem = function (itemId) {
    var itemId, splitId, splitIdarr;
    //itemId = event.target.parentNode.parentNode.parentNode.id;
    splitIdarr = itemId.split("-");
    splitId = splitIdarr[1];
    console.log(splitId);

    //delete the item from data
    datactrl.deleteItem(splitId);

    //delete the item from UI
    UIctrl.UIdeleteItem(itemId);
  };

  var ctrlCheckItem = function (itemId) {
    UIctrl.UIcheckItem(itemId);
  };

  return {
    init: function () {
      console.log(`application has started`);
      setUpEventListeners();
    },
  };
})(dataController, UIcontroller);
globalController.init();
