// BUDGET CONTROLLER
let budgetController = (function () {

    let Expense = function (id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
        this.percentage = -1;
    };

    /*Expense.prototype.calcPercentage = function (totalInc) {
        if (totalInc > 0) {
            this.percentage = Math.round((this.value / totalInc) * 100);
        } else {
            this.percentage = -1;
        }
    };

    Expense.prototype.getPercentage = function () {
        return this.percentage;
    };*/

    let calcPercentage = function (totalInc, expEl) {
        if (totalInc > 0) {
            expEl.percentage = Math.round((expEl.value / totalInc) * 100);
        } else {
            expEl.percentage = -1;
        }
    };

    let Income = function (id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };

    // Calculate total incomes or expense
    let calculateTotal = function (type) {
        let sum = 0;

        data.allItems[type].forEach(el => {
            sum += el.value;
        });
        data.totals[type] = sum;
    };

    // Private data structure for storing our incomes and expense
    let data = {
        allItems: {
            exp: [],
            inc: []
        },
        totals: {
            exp: 0,
            inc: 0
        },
        budget: 0,
        percentage: -1
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
        },
        calculateBudget: function () {
            // calculate total income and expense
            calculateTotal('inc');
            calculateTotal('exp');
            // Calculate the budget: income - expense
            data.budget = data.totals.inc - data.totals.exp;
            // calculate the percentage of income that we spent
            if (data.totals.inc > 0 && data.totals.inc > data.totals.exp) {
                data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
            } else {
                data.percentage = -1;
            }
        },
        calculatePercentages: function () {
            data.allItems.exp.forEach(el => {
                calcPercentage(data.totals.inc, el);
            });
        },
        getPercentages: function () {
            return data.allItems.exp.map(el => {
                return el.percentage;
            });
        },
        getBudget: function () {
            return {
                budget: data.budget,
                totalInc: data.totals.inc,
                totalExp: data.totals.exp,
                percentage: data.percentage
            }
        },
        saveDataToLocalStorage: function () {
            let serialData = JSON.stringify(data);
            localStorage.setItem('budgetData', serialData);
        },
        getDataFromLocalStorage: function () {
            let budgetData = JSON.parse(localStorage.getItem('budgetData'));

            if (budgetData) {
                data = budgetData;
                return budgetData;
            } else {
                return data;
            }
        },
        clearData: function () {
            data = {
                allItems: {
                    exp: [],
                    inc: []
                },
                totals: {
                    exp: 0,
                    inc: 0
                },
                budget: 0,
                percentage: -1
            };
            localStorage.removeItem('budgetData');
            localStorage.setItem('budgetData', JSON.stringify(data));
        },
        deleteItem: function (type, id) {
            let ids, index;

            ids = data.allItems[type].map(function (el) {
                return el.id;
            });
            index = ids.indexOf(id);

            if (index !== -1) {
                data.allItems[type].splice(index, 1);
            }
        },
        testing: function () {
            return data;
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
        expenseContainer: '.expenses__list',
        budgetValue: '.budget__value',
        budgetIncVal: '.budget__income--value',
        budgetExpVal: '.budget__expenses--value',
        budgetExpPercentage: '.budget__expenses--percentage',
        clearBtn: '.clear__btn',
        container: '.container',
        expensesPercLabel: '.item__percentage'
    };

    return {
        // Public function which return the object which contain the values from input field(type, description, value)
        getInput: function () {
            return {
                type: document.querySelector(DOMstrings.inputType).value, // will be either 'inc' or 'exp' meaning + or -
                description: document.querySelector(DOMstrings.inputDescription).value,
                value: parseFloat(document.querySelector(DOMstrings.inputValue).value)
            }
        },
        // Public function which create new HTML element with data receiving from obj argument and insert him into DOM
        addListItem: function (obj, type) {
            let html, newHtml, parentElement;
            // Create HTML string with placeholder text
            if (type === 'inc') {
                parentElement = DOMstrings.incomeContainer;
                html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            } else if (type === 'exp') {
                parentElement = DOMstrings.expenseContainer;
                html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">%pers_from_storage%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }

            // Replace the placeholder text with some actual data, which we receive from item object
            newHtml = html.replace('%id%', obj.id).replace('%description%', obj.description).replace('%value%', obj.value).replace('%pers_from_storage%', obj.percentage + '%');

            // Insert the HTML into the DOM
            document.querySelector(parentElement).insertAdjacentHTML('beforeend', newHtml);
        },
        // Public method for cleaning all input fields
        clearFields: function () {
            let fields, fieldsArr;

            // Find all needed input filed in the DOM and set it into variable
            fields = document.querySelectorAll(DOMstrings.inputDescription + ', ' + DOMstrings.inputValue);

            // Convert the received list from querySelectorAll to an simple array
            fieldsArr = Array.prototype.slice.call(fields);

            // Clear all input fields storing in the fieldsArr
            fieldsArr.forEach(el => {
                el.value = '';
            });

            // Set the focus into the first element in the array
            fieldsArr[0].focus();
        },
        displayBudget: function (obj) {
            // Find and update the budget
            document.querySelector(DOMstrings.budgetValue).textContent = obj.budget || 0;
            // Find and update income
            document.querySelector(DOMstrings.budgetIncVal).textContent = obj.totalInc || 0;
            // Find and update expense
            document.querySelector(DOMstrings.budgetExpVal).textContent = obj.totalExp || 0;
            // Find and update expense percentage
            if (obj.percentage === -1) {
                document.querySelector(DOMstrings.budgetExpPercentage).textContent = '---'
            } else {
                document.querySelector(DOMstrings.budgetExpPercentage).textContent = obj.percentage + '%';
            }
        },
        displayPercentages: function (percentages) {
            let allPercLabelEl;

            allPercLabelEl = document.querySelectorAll(DOMstrings.expensesPercLabel);

            allPercLabelEl.forEach((el, index) => {
                if (percentages[index] > 0) {
                    el.textContent = percentages[index] + '%';
                } else {
                    el.textContent = '---';
                }
            })
            // Custom forEach function for nodeList array
            /*let nodeListForEach = function (list, callback) {
                  for (let i = 0; i < list.length; i++) {
                      callback(list[i], i);
                  }
            };

            nodeListForEach(allPercLabelEl, function (el, index) {
                if (percentages[index] > 0) {
                    el.textContent = percentages[index] + '%';
                } else {
                    el.textContent = '---';
                }
            })*/

        },
        deleteAllItems: function () {
            let allItems = document.querySelectorAll('.item');
            allItems.forEach(el => {
                el.remove();
            });
        },
        deleteListItem: function (itemId) {
            let deleteEl;
            // find deleting element
            deleteEl = document.querySelector(`#${itemId}`);

            // remove deleting element from the DOM
            deleteEl.remove();
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
        document.querySelector(DOM.clearBtn).addEventListener('click', clearAll);
        document.addEventListener('keypress', function (event) {
            if (event.code === 'Enter' || event.which === 13) {
                ctrlAddItem();
            }
        });

        document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);
    };

    let updateBudget = function () {
        // 1. Calculate the budget
        budgetCtl.calculateBudget();

        // 2. Return the budget
        let budget = budgetCtl.getBudget();

        // 3. Display the budget on the UI
        UICtrl.displayBudget(budget);
    };

    // Update the percentages of all expense items in dependence of total budget
    let updatePercentages = function () {
        let percentages;
        // 1. Calculate percentages
        budgetCtl.calculatePercentages();

        // 2. Read percentages from the budget controller
        percentages = budgetCtl.getPercentages();

        // 3. Update the UI with the new percentages
        UICtrl.displayPercentages(percentages);

    };

    // Add new item to the budget controller data structure and update the UI with new data.
    let ctrlAddItem = function () {
        let input, newItem;
        // 1. Get the field input data
        input = UICtrl.getInput();

        if (input.description !== '' && !isNaN(input.value) && input.value > 0) {
            // 2. Add the item to the budget controller
            newItem = budgetCtl.addItem(input.type, input.description, input.value);

            // 3. Add the item to the UI
            UICtrl.addListItem(newItem, input.type);

            // 4. Clear the fields after adding the new item
            UICtrl.clearFields();

            // 5. Calculate and Update budget
            updateBudget();

            // 6. Calculate and update percentages
            updatePercentages();

            // 7. Save new data to local storage
            budgetCtl.saveDataToLocalStorage();
        } else {
            UICtrl.clearFields();
        }
    };

    let clearAll = function () {
        // Delete all data in budget controller and local storage
        budgetCtl.clearData();

        // Update budget UI with init values
        updateBudget();

        // Delete all items from UI
        UICtrl.deleteAllItems();
    };

    let initStartingValues = function () {
        let budgetData;
        // Get data our data from local storage.
        budgetData = budgetCtl.getDataFromLocalStorage();

        // Display inc and exp items from local storage
        for (let key in budgetData.allItems) {
            budgetData.allItems[key].forEach((el) => {
                UICtrl.addListItem(el, key);
            });
        }

        // display the budget from local storage
        updateBudget();
    };

    let ctrlDeleteItem = function (event) {
        let itemID, splitID, type, ID;

        itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;

        if (itemID) {
            splitID = itemID.split('-');
            type = splitID[0];
            ID = parseInt(splitID[1]);
            // 1. delete the item from the data structure
            budgetCtl.deleteItem(type, ID);

            // 2. update the local storage
            budgetCtl.saveDataToLocalStorage();

            // 3. delete the item from the UI
            UICtrl.deleteListItem(itemID);

            // 4. Update and show the new budget
            updateBudget();

            // 5. Calculate and update percentages
            updatePercentages();
        }
    };

    return {
        init: function () {
            console.log('app is starting!');
            setupEventListeners();
            initStartingValues();
        }
    };

})(budgetController, UIController);

// Start the application
controller.init();
