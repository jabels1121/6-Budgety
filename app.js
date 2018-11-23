// BUDGET CONTROLLER
let budgetController = (function () {

    // Some code

})();

// UI CONTROLLER
let UIController = (function () {

})();

// GLOBAL APP CONTROLLER
let controller = (function (budgetCtl, UICtrl) {

    let ctrlAddItem = function() {
        // TODO: 1. Get the field input data

        // TODO: 2. Add the item to the budget controller

        // TODO: 3. Add the item to the UI

        // TODO: 4. Calculate the budget

        // TODO: 5. Display the budget on the UI

        console.log('some event happens');
    };

    document.querySelector('.add__btn').addEventListener('click', ctrlAddItem);

    document.addEventListener('keypress', function (event) {
         if (event.keyCode === 13 || event.which === 13) {
             ctrlAddItem();
         }
    });

})(budgetController, UIController);