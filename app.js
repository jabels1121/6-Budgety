// BUDGET CONTROLLER
let budgetController = (function () {

    let Expense = function (id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };

    let Income = function (id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };

    // Private data structure for storing our incomes or expense
    let data = {
        allItems: {
            exp: [],
            inc: []
        },
        totals: {
            exp: 0,
            inc: 0
        }
    };

    return {
        // Public function for create an 'inc' or 'exp' object, store him in private data structure and return him.
        addItem: function (type, des, val) {
            let newItem, ID;

            //Create new ID
            if (data.allItems[type].length > 0) {
                ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
            } else {
                ID = 0;
            }

            //Create new item based on 'inc' or 'exp' type
            if (type === 'exp') {
                newItem = new Expense(ID, des, val);
            } else if (type === 'inc') {
                newItem = new Income(ID, des, val);
            }
            // Push it into our data structure
            data.allItems[type].push(newItem);
            // Return the new element
            return newItem;
        }
    };

})();

// UI CONTROLLER
let UIController = (function () {

    let DOMstrings = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        addBtn: '.add__btn',
        incomeContainer: '.income__list',
        expenseContainer: '.expenses__list'
    };

    return {
        // Public function which return the object which contain the values from input field(type, description, value)
        getInput: function () {
            return {
                type: document.querySelector(DOMstrings.inputType).value, // will be either 'inc' or 'exp' meaning + or -
                description: document.querySelector(DOMstrings.inputDescription).value,
                value: document.querySelector(DOMstrings.inputValue).value
            }
        },
        // Public function which create new HTML element with data receiving from obj argument and insert him into DOM
        addListItem: function (obj, type) {
            let html, newHtml, domElement, parentElement;
            // Create HTML string with placeholder text
            if (type === 'inc') {
                parentElement = DOMstrings.incomeContainer;
                html = '<div class="item clearfix" id="%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            } else if (type === 'exp') {
                parentElement = DOMstrings.expenseContainer;
                html = '<div class="item clearfix" id="%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }

            // Replace the placeholder text with some actual data, which we receive from item object
            newHtml = html.replace('%id%', obj.id).replace('%description%', obj.description).replace('%value%', obj.value);

            // Insert the HTML into the DOM
            document.querySelector(parentElement).insertAdjacentHTML('beforeend', newHtml);
        },
        getDOMstrings: function () {
            return DOMstrings;
        }
    }

})();

// GLOBAL APP CONTROLLER
let controller = (function (budgetCtl, UICtrl) {

    let setupEventListeners = function () {
        let DOM = UICtrl.getDOMstrings();

        document.querySelector(DOM.addBtn).addEventListener('click', ctrlAddItem);

        document.addEventListener('keypress', function (event) {
            if (event.code === 'Enter' || event.which === 13) {
                ctrlAddItem();
            }
        });
    };


    let ctrlAddItem = function () {
        let input, newItem;
        // TODO: 1. Get the field input data
        input = UICtrl.getInput();

        // TODO: 2. Add the item to the budget controller
        newItem = budgetCtl.addItem(input.type, input.description, input.value);

        // TODO: 3. Add the item to the UI
        UICtrl.addListItem(newItem, input.type);

        // TODO: 4. Calculate the budget

        // TODO: 5. Display the budget on the UI

    };

    return {
        init: function () {
            console.log('app is starting!');
            setupEventListeners();
        }
    };

})(budgetController, UIController);

// Start the application eventListeners
controller.init();