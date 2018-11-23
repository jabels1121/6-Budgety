// BUDGET CONTROLLER
let budgetController = (function () {

    // Some code

})();

// UI CONTROLLER
let UIController = (function () {

    let DOMstrings = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        addBtn: '.add__btn'
    };

    return {
        getInput: function () {
            return {
                type: document.querySelector(DOMstrings.inputType).value, // will be either 'inc' or 'exp' meaning + or -
                inputDescription: document.querySelector(DOMstrings.inputDescription).value,
                inputValue: document.querySelector(DOMstrings.inputValue).value
            }
        },
        getDOMstrings: function () {
            return DOMstrings;
        }
    }

})();

// GLOBAL APP CONTROLLER
let controller = (function (budgetCtl, UICtrl) {

    let setupEventListeners = function() {
        let DOM = UICtrl.getDOMstrings();

        document.querySelector(DOM.addBtn).addEventListener('click', ctrlAddItem);

        document.addEventListener('keypress', function (event) {
            if (event.code === 'Enter' || event.which === 13) {
                ctrlAddItem();
            }
        });
    };


    let ctrlAddItem = function () {
        // TODO: 1. Get the field input data
        let input = UICtrl.getInput();

        // TODO: 2. Add the item to the budget controller

        // TODO: 3. Add the item to the UI

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

controller.init();