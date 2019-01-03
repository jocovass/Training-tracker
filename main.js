
const Ui = (function() {
    //js to open the form modul
    const uiElements = {
        addBtn: document.querySelector(".add-btn"),
        formBackground: document.querySelector(".form-background"),
        formWrapper: document.querySelector(".form-wrapper"),
        closeBtn: document.querySelector(".close"),

    // Grabing the elements from the dom
        bikeKm: document.querySelector(".bike-km"),
        bikeTime: document.querySelector(".bike-time"),
        runKm: document.querySelector(".run-km"),
        runTime: document.querySelector(".run-time"),
        sumKm: document.querySelector(".sum-km"),
        sumTime: document.querySelector(".sum-time"),
        submit: document.querySelector(".submit"),

        bestKm: document.querySelector(".best-km"),
        bestTime: document.querySelector(".best-time"),

        totalKm: document.querySelector(".total-km"),
        totalRecords: document.querySelector(".total-records"),

        table: document.querySelector(".table"),
        order: document.querySelectorAll(".order")
    };

    //public
    return {
        getUiElements: function() {
            return uiElements;
        },
        clearInputFields: function() {
            uiElements.bikeKm.value = "";
            uiElements.bikeTime.value = "";
            uiElements.runKm.value = "";
            uiElements.runTime.value = "";
        },
        displayMessage: function(message, clsName) {
            this.clearMessage();
            const div = document.createElement("div");
            div.className = clsName + " message";
            div.appendChild(document.createTextNode(message));
            uiElements.formBackground.insertBefore(div, uiElements.formWrapper);

            setTimeout(() => {
                this.clearMessage();
                this.clearInputFields();
            }, 5000);
        },
        clearMessage: function() {
            const message = document.querySelector(".message");
            if(message) {
                message.remove();
            }
        },
        showTotalKm: function(km) {
            uiElements.totalKm.innerHTML = km;
        },
        showTotalRecords: function(total) {
            uiElements.totalRecords.innerHTML = total;
        }
    }
})();

const Ls = (function() {
    const getItemsFromLs = function() {
        let tasks;
        if(localStorage.getItem("tasks") !== null) {
            tasks = JSON.parse(localStorage.getItem("tasks"));
        } else {
            tasks = [];
        }
        return tasks;
    };

    return {
        getItemsFromLs: getItemsFromLs,
        addItemsToLs: function(task) {
            const tasks = getItemsFromLs();
            tasks.push(task);
            localStorage.setItem("tasks", JSON.stringify(tasks));
        },
        removeItemFromLs: function(id) {
            const tasks = getItemsFromLs();
            tasks.forEach(function(task, index) {
                if(task.id === id) {
                    tasks.splice(index, 1);
                }
            });

            localStorage.setItem("tasks", JSON.stringify(tasks));
        }
    }

})();

const App = (function(Ui, Ls) {
    //reg exp for checking the time
    const regExp = /^[0-9]?[0-9]:[0-9]?[0-9]:[0-9]?[0-9]$/;
    //getting ui elements from ui controler
    const uiElements = Ui.getUiElements();
    //initial state for modal
    let status = false;

    const loadEventListeners = function() {
        uiElements.addBtn.addEventListener("click", toggleForm);
        uiElements.closeBtn.addEventListener("click", toggleForm);

        uiElements.submit.addEventListener("click", addItemToList);

        uiElements.table.addEventListener("click", removeItemFromList);

        uiElements.bestKm.addEventListener("click", findeBestKm);
    }

    const toggleForm = function() {
        if(!status) {
            uiElements.formBackground.classList.add("open");
            uiElements.formWrapper.classList.add("open");

            status = true;
        } else {
            uiElements.formBackground.classList.remove("open");
            uiElements.formWrapper.classList.remove("open");

            status = false;
        };
        //clear input fields 
        Ui.clearInputFields();
    };

    //set initial table list
    const setInitialList = function(tasks) {
        tasks.forEach(function(task, index) {
            let newRow = uiElements.table.insertRow(),
                        cell1 = newRow.insertCell(0),
                        cell2 = newRow.insertCell(1),
                        cell3 = newRow.insertCell(2),
                        cell4 = newRow.insertCell(3),
                        cell5 = newRow.insertCell(4),
                        cell6 = newRow.insertCell(5),
                        cell7 = newRow.insertCell(6);
                        cell8 = newRow.insertCell(7);
                
                //set each cell content individually
                cell1.textContent = index + 1;
                cell1.className = "small order";
                cell1.setAttribute("headers", "id");
                
                cell2.textContent = task.bikeKm === "" ? 0 + "km": task.bikeKm + "km";
                cell2.setAttribute("headers", "bike");
                
                cell3.textContent = task.bikeTime;
                cell3.setAttribute("headers", "bike");
                
                cell4.textContent = task.runKm === "" ? 0 + "km": task.runKm + "km";
                cell4.setAttribute("headers", "run");

                cell5.textContent = task.runTime;
                cell5.setAttribute("headers", "run");
                
                cell6.textContent = task.bikeKm + task.runKm + "km";
                cell6.setAttribute("headers", "sum");
                
                cell7.textContent = addTimesTogether(task.bikeTime, task.runTime);
                cell7.setAttribute("headers", "sum");
                
                cell8.innerHTML = `<a href="#"><i class="remove fas fa-trash-alt"></i></a>`;
                cell8.className = "small delete";
                cell8.setAttribute("headers", "delete");
                cell8.setAttribute("id", task.id);
        });

        //calc the total km
        calcTotalKm();

        //count total records
        calcTotalRecords();
    };

    //add new row to the table
    const addItemToList = function() {
        const tasks = Ls.getItemsFromLs();
        //gettunk the inputs from the ui
        const item = {
            bikeKm: kmToNumber(uiElements.bikeKm.value),
            bikeTime: uiElements.bikeTime.value.trim() !== "" ? formateTest(uiElements.bikeTime.value) : "00:00:00",
            runKm: kmToNumber(uiElements.runKm.value),
            runTime: uiElements.runTime.value.trim() !== "" ? formateTest(uiElements.runTime.value) : "00:00:00",
            id: tasks.length > 0 ?  tasks[tasks.length - 1].id + 1 : 0,
        };

        if(item.bikeKm !== "" || item.runKm !== "") {

            if(item.bikeTime && item.runTime) {
                //we create a new row and 8 table cell
                let newRow = uiElements.table.insertRow(),
                        cell1 = newRow.insertCell(0),
                        cell2 = newRow.insertCell(1),
                        cell3 = newRow.insertCell(2),
                        cell4 = newRow.insertCell(3),
                        cell5 = newRow.insertCell(4),
                        cell6 = newRow.insertCell(5),
                        cell7 = newRow.insertCell(6);
                        cell8 = newRow.insertCell(7);
                
                //set each cell content individually
                cell1.textContent = tasks.length + 1;
                cell1.className = "small order";
                cell1.setAttribute("headers", "id");
                
                cell2.textContent = item.bikeKm === "" ? 0 + "km": item.bikeKm + "km";
                cell2.setAttribute("headers", "bike");
                
                cell3.textContent = item.bikeTime;
                cell3.setAttribute("headers", "bike");
                
                cell4.textContent = item.runKm === "" ? 0 + "km": item.runKm + "km";
                cell4.setAttribute("headers", "run");

                cell5.textContent = item.runTime;
                cell5.setAttribute("headers", "run");
                
                cell6.textContent = item.bikeKm + item.runKm + "km";
                cell6.setAttribute("headers", "sum");
                
                cell7.textContent = addTimesTogether(item.bikeTime, item.runTime);
                cell7.setAttribute("headers", "sum");
                
                cell8.innerHTML = `<a href="#"><i class="remove fas fa-trash-alt"></i></a>`;
                cell8.className = "small delete";
                cell8.setAttribute("headers", "delete");
                cell8.setAttribute("id", item.id);

                //add items to ls
                Ls.addItemsToLs(item);

                //calc the total km
                calcTotalKm();

                //count total records
                calcTotalRecords();

                //call the toggle function to close the form
                toggleForm();
            } else {
                Ui.displayMessage("Please enter the right format(hh:mm:ss)!!", "alert");
            }
        } else {
            Ui.displayMessage("One of the distance input is required!!", "alert");
        }
    };

    //keep the numbering of the table rows in order
    const reorganize = function() {
        const elements = uiElements.table;
        for(let i = 0; i < elements.rows.length; i += 1) {
            if(i >= 2) {
                elements.rows[i].cells[0].innerHTML = i - 1;
            }
        }
    };

    //remove row from table
    const removeItemFromList = function(e) {
        const id = parseInt(e.target.parentElement.parentElement.id, 10);
        if(e.target.classList.contains("remove")) {
            if(confirm("Are you sure you want to delete?")) {
                //remove from table
                uiElements.table.deleteRow(e.target.parentElement.parentElement.parentElement.rowIndex);
                //remove from LS
                Ls.removeItemFromLs(id);
                //reorganize the table numbering
                reorganize();
                //calc the total km
                calcTotalKm();
                //count total records
                calcTotalRecords();
            }
        }
        e.preventDefault();
    };

    //calculate total km
    const calcTotalKm = function() {
        const tasks = Ls.getItemsFromLs();
        let km = 0;
        tasks.forEach(function(task) {
            km += (task.bikeKm === "" ? 0 : task.bikeKm) + (task.runKm === "" ? 0 : task.runKm);
        });
        Ui.showTotalKm(km);
    };

    //count total records
    const calcTotalRecords = function() {
        const tasks = Ls.getItemsFromLs();
        const total = tasks.length;

        Ui.showTotalRecords(total);
    }

    //change string to number or replace it with 0
    const kmToNumber = function(km) {
        if (km.indexOf(".") === -1) {
            const numInt = parseInt(km, 10);
            if(!isNaN(numInt)) {
                return numInt;
            } else {
                return "";
            }
        } else {
             const numFloat = parseFloat(km, 10);
            if(!isNaN(numFloat)) {
                return numFloat;
            } else {
                return "";
            }
        }
    };

    //test for the right format of the test
    const formateTest = function(test) {
        const regTest = regExp.test(test);
        if(regTest) {
            return test;
        } else {
            return regTest;
        }
    };

    //add to times together
    const addTimesTogether = function(firstTime, secondTime) {
        const time = [0, 0, 0];
        const max = time.length;
        let a;
        let b;
        if(firstTime.trim() !== "") {
            a = (firstTime || "").split(":");
        } else {
            a = ["0", "0", "0"];
        };
        
        if(secondTime.trim() !== "") {
            b = (secondTime || "").split(":");
        } else {
            b = ["0", "0", "0"];
        }

        for(let i = 0; i < max; i += 1) {
            a[i] = isNaN(parseInt(a[i])) ? 0 : parseInt(a[i]);
            b[i] = isNaN(parseInt(b[i])) ? 0 : parseInt(b[i]);
        }

        for(let i = 0; i < max; i += 1) {
            time[i] = a[i] + b[i];
        }

        let hours = time[0];
        let min = time[1];
        let sec = time[2];

        if(sec >= 60) {
            let m = (sec / 60) << 0;
            min += m;
            sec -= 60 * m;
        };

        if(min >= 60) {
            let h = (min / 60) << 0;
            hours += h;
            min -= 60 * h;
        };

        return ("0" + hours).slice(-2) + ":"  + ("0" + min).slice(-2) + ":" + ("0" + sec).slice(-2);
    };

    //the best km
    const findeBestKm = function() {
        const tasks = Ls.getItemsFromLs();
        tasks.sort(function(a, b) {
            let result = (a.bikeKm + a.runKm) - (b.bikeKm + b.runKm);
            if(result < 0) {
                return 1;
            } else if(result > 0) {
                return -1;
            } else if (result === 0) {
                return 0;
            }
        });
        const elements = uiElements.table;
        for(let i = 0; i < elements.rows.length; i += 1) {
            if(i >= 2) {
                elements.rows[i].cells[0].innerHTML = i - 1;
                elements.rows[i].cells[1].innerHTML = tasks[i - 2].bikeKm + "km";
                elements.rows[i].cells[2].innerHTML = tasks[i - 2].bikeTime;
                elements.rows[i].cells[3].innerHTML = tasks[i - 2].runKm + "km";
                elements.rows[i].cells[4].innerHTML = tasks[i - 2].runTime;
                elements.rows[i].cells[5].innerHTML = tasks[i - 2].bikeKm + tasks[i - 2].runKm + "km";
                elements.rows[i].cells[6].innerHTML = addTimesTogether(tasks[i - 2].bikeTime, tasks[i - 2].runTime);
                elements.rows[i].cells[7].id = tasks[i - 2].id;
            }
        }
    };
    
    // const helper = function 

    return {
        init: function() {
            setInitialList(Ls.getItemsFromLs());
            //load all event listeners
            loadEventListeners();
            //clear inputs
            Ui.clearInputFields();
        },
         
    }
})(Ui, Ls);

App.init();

