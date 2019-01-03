//LS controler
const LsCtrl = (function() {
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

//Item controler
const ItemCtrl = (function() {
    //new resutl object constructor
    const Result = function(item) {
        this.bikeKm = item.bikeKm;
        this.bikeTime = item.bikeTime;
        this.runKm = item.runKm;
        this.runTime = item.runTime;
        this.totalKm = item.totalKm();
        this.totalTime = item.totalTime();
        this.id = item.id;
    };

    return {
        getTasks: function() {
            return tasks;
        },
        newTask: function(item) {
            const newTask = new Result(item);
            return newTask;
        }
    };

})();

//UI controler
const UiCtrl = (function(LsCtrl) {
    //dom elements
    const uiElements = {
        addBtn: document.querySelector(".add-btn"),
        formBackground: document.querySelector(".form-background"),
        formWrapper: document.querySelector(".form-wrapper"),
        closeBtn: document.querySelector(".close"),
        bikeKm: document.querySelector(".bike-km"),
        bikeTime: document.querySelector(".bike-time"),
        runKm: document.querySelector(".run-km"),
        runTime: document.querySelector(".run-time"),
        totalKm: document.querySelector(".total-km"),
        totalRecords: document.querySelector(".total-records"),
        submit: document.querySelector(".submit"),
        remove: document.querySelector(".remove"),

        bestBikeKm: document.querySelector(".bestBike-km"),
        bestBikeTime: document.querySelector(".bestBike-time"),
        bestRunKm: document.querySelector(".bestRun-km"),
        bestRunTime: document.querySelector(".bestRun-time"),
        bestTotalKm: document.querySelector(".bestTotal-km"),
        bestTotalTime: document.querySelector(".bestTotal-time"),

        avrBike: document.querySelector(".bike-avr"),
        avrRun: document.querySelector(".run-avr"),
        tableBody: document.querySelector(".list"),
        // order: document.querySelectorAll(".order")
    };

    //initial modal status
    let modalStatus = false;

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
        toggleForm: function() {
            if(!modalStatus) {
                uiElements.formBackground.classList.add("open");
                uiElements.formWrapper.classList.add("open");
    
                modalStatus = true;
            } else {
                uiElements.formBackground.classList.remove("open");
                uiElements.formWrapper.classList.remove("open");
    
                modalStatus = false;
            };
            this.clearInputFields();
        },
        drawList: function(tasks) {
            tasks.forEach(function(task, index) {
                let newRow = uiElements.tableBody.insertRow(),
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
            
            cell2.textContent = task.bikeKm + "km";
            cell2.setAttribute("headers", "bike");
            
            cell3.textContent = task.bikeTime;
            cell3.setAttribute("headers", "bike");
            
            cell4.textContent = task.runKm + "km";
            cell4.setAttribute("headers", "run");

            cell5.textContent = task.runTime;
            cell5.setAttribute("headers", "run");
            
            cell6.textContent = task.totalKm + "km";
            cell6.setAttribute("headers", "sum");
            
            cell7.textContent = task.totalTime;
            cell7.setAttribute("headers", "sum");
            
            cell8.innerHTML = `<a href="#"><i class="remove fas fa-trash-alt"></i></a>`;
            cell8.className = "small delete";
            cell8.setAttribute("headers", "delete");
            cell8.setAttribute("id", task.id);
 
        });
        },
        addItemToList: function(item) {
            const tasks = LsCtrl.getItemsFromLs();
            let newRow = uiElements.tableBody.insertRow(),
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
                
                cell6.textContent = item.totalKm + "km";
                cell6.setAttribute("headers", "sum");
                
                cell7.textContent = item.totalTime;
                cell7.setAttribute("headers", "sum");
                
                cell8.innerHTML = `<a href="#"><i class="remove fas fa-trash-alt"></i></a>`;
                cell8.className = "small delete";
                cell8.setAttribute("headers", "delete");
                cell8.setAttribute("id", item.id);
        },
        removeItemFromList: function(rowindex) {
            uiElements.tableBody.deleteRow(rowindex);
        },
        showTotalKm: function(total) {
            uiElements.totalKm.textContent = total;
        },
        showTotalRecords: function(total) {
            uiElements.totalRecords.textContent = total;
        },
        showBest: function(tasks) {

            const rowsEl = uiElements.tableBody;
            const rowsLength = rowsEl.rows.length;
            let i = 0;
            for(; i < rowsLength; i++) {
                rowsEl.rows[i].cells[0].innerHTML = i + 1;
                rowsEl.rows[i].cells[1].innerHTML = tasks[i].bikeKm + "km";
                rowsEl.rows[i].cells[2].innerHTML = tasks[i].bikeTime;
                rowsEl.rows[i].cells[3].innerHTML = tasks[i].runKm + "km";
                rowsEl.rows[i].cells[4].innerHTML = tasks[i].runTime;
                rowsEl.rows[i].cells[5].innerHTML = tasks[i].totalKm + "km";
                rowsEl.rows[i].cells[6].innerHTML = tasks[i].totalTime;
                rowsEl.rows[i].cells[7].id = tasks[i].id;
            }
        },
        showAvr: function(avrB, avrR) {
            uiElements.avrBike.innerHTML = avrB;
            uiElements.avrRun.innerHTML = avrR;
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
    };

})(LsCtrl);

//App controler
const AppCtrl = (function(LsCtrl, UiCtrl, ItemCtrl) {
    //get UI elements from Ui controle
    const uiElements = UiCtrl.getUiElements();

    //RegExp for testing time input
    const regExp = /^[0-9]?[0-9]:[0-9]?[0-9]:[0-9]?[0-9]$/;

    //event listeners loader
    const loadEventListeners = function() {
        document.addEventListener("DOMContentLoaded", setInitialList)
        uiElements.addBtn.addEventListener("click", function() {
            UiCtrl.toggleForm();
        });
        uiElements.closeBtn.addEventListener("click", () => {
            UiCtrl.toggleForm();
        });
        uiElements.submit.addEventListener("click", addItem);
        uiElements.tableBody.addEventListener("click", removeItem);
        uiElements.bestBikeKm.addEventListener("click", findBestKm);
        uiElements.bestRunKm.addEventListener("click", findBestKm);
        uiElements.bestTotalKm.addEventListener("click", findBestKm);
        uiElements.bestBikeTime.addEventListener("click", findBestTime);
        uiElements.bestRunTime.addEventListener("click", findBestTime);
        uiElements.bestTotalTime.addEventListener("click", findBestTime);

    };

    //draw the saved table list after DOM is loaded
    const setInitialList = function() {
        const tasks = LsCtrl.getItemsFromLs();
        UiCtrl.drawList(tasks);

        //average min/km
        avrKmTime("bike");
        avrKmTime("run");

        //recalc total KM
        calcTotalKm();

        //show total records
        calcTotalRecords();
    };

    //add item function
    const addItem = function() {
        const tasks = LsCtrl.getItemsFromLs();
        const item = {
            bikeKm: kmToNumber(uiElements.bikeKm.value),
            bikeTime: uiElements.bikeTime.value.trim() !== "" ? formTest(uiElements.bikeTime.value) : "00:00:00",
            runKm: kmToNumber(uiElements.runKm.value),
            runTime: uiElements.runTime.value.trim() !== "" ? formTest(uiElements.runTime.value) : "00:00:00",
            totalKm: function() {
                return (this.bikeKm === "" ? 0 : this.bikeKm) + (this.runKm === "" ? 0 : this.runKm);
            },
            totalTime: function() {
                return addTimesTogether(this.bikeTime, this.runTime);
            },
            id: tasks.length > 0 ?  tasks[tasks.length - 1].id + 1 : 0,
        };

        if(item.bikeKm !== "" || item.runKm !== "") {

            if(item.bikeTime && item.runTime) {
                //calling itemctrl's object constructor
                const newResult = ItemCtrl.newTask(item);
                //adding the noew item to the tabel
                UiCtrl.addItemToList(newResult);
                //add item to ls
                LsCtrl.addItemsToLs(newResult);
                
                //recalc total KM
                calcTotalKm();

                //show total records
                calcTotalRecords();

                //call the toggle function to close the form
                UiCtrl.toggleForm();

                //average min/km
                avrKmTime("bike");
                avrKmTime("run");
                
            } else {
                UiCtrl.displayMessage("Please enter the right format (hh:mm:ss)!!", "alert");
            }
        } else {
            UiCtrl.displayMessage("One of the distances input is required!!", "alert");
        }
    };

    //remove item function
    const removeItem = function(e) {
        if(e.target.classList.contains("remove")) {
            const tr = e.target.parentElement.parentElement.parentElement.rowIndex - 2;
            const id = parseInt(e.target.parentElement.parentElement.id, 10);
            if(confirm("Are you sure, you want to delete?")) {
                //remove item from the DOM list
                UiCtrl.removeItemFromList(tr);

                //remove item from LS list
                LsCtrl.removeItemFromLs(id);

                //average min/km
                avrKmTime("bike");
                avrKmTime("run");

                //recalc total KM
                calcTotalKm();

                //show total records
                calcTotalRecords();

                //reorganize numbering of the table
                reorganize();
            }
        }
        e.preventDefault();
    };

    //keep the numbering of the table rows in order
    const reorganize = function() {
        const elements = uiElements.tableBody;
        const elementLength = elements.rows.length;
        let i = 0;
        for( ; i < elementLength; i++) {
            elements.rows[i].cells[0].innerHTML = i + 1
        }
    };

    //calculate total KM
    const calcTotalKm = function() {
        const tasks = LsCtrl.getItemsFromLs();
        let total = 0;
        tasks.forEach(function(task) { 
            total += task.totalKm;
        });
        UiCtrl.showTotalKm(total);
    };

    //calculate total RECORDS
    const calcTotalRecords = function() {
        const tasks = LsCtrl.getItemsFromLs();
        const total = tasks.length;
        UiCtrl.showTotalRecords(total);
    };

    //convert KM string to NUMBER if it's an empty string retrun an epmty ""
    const kmToNumber = function(km) {
        let number = 0;
        const index = km.indexOf(".");
        if(index === -1) {
            number = parseInt(km, 10);
            if(!isNaN(number)) {
                return number;
            } else {
                return "";
            }
        } else {
            number = parseFloat(km);
            if(!isNaN(number)) {
                return number;
            } else {
                return "";
            }
        }
    };

    //test if the time is in right formate
    const formTest = function(time) {
        const t = regExp.test(time);
        if(t) {
            return time;
        } else {
            return t;
        }
    };

    //add two times together
    const addTimesTogether = function(firstTime, secondTime) {
        const time = [0, 0, 0],
              max = time.length;

        let a,
            b;
    
        if(firstTime.trim() !== "") {
            a = (firstTime).split(":");
        } else {
            a = ["0", "0", "0"];
        };

        if(secondTime.trim() !== "") {
            b = (secondTime).split(":");
        } else {
            b = ["0", "0", "0"];
        }

        let i = 0;
        for(i; i < max; i++) {
            time[i] = parseInt(a[i]) + parseInt(b[i]);
        }

        let hours = time[0];
        let minutes = time[1];
        let seconds = time[2];

        if(seconds >= 60) {
            let m = (seconds / 60) << 0;
            minutes += m;
            seconds -= 60 * m;
        }

        if(minutes >= 60) {
            let h = (minutes / 60) << 0;
            hours += h;
            minutes -= 60 * h;
        }

        return ("0" + hours).slice(-2) + ":" + ("0" + minutes).slice(-2) + ":" + ("0" + seconds).slice(-2);
        
    };

    //the best km
    const findBestKm = function(e) {
        e.preventDefault();
        const tasks = LsCtrl.getItemsFromLs();
        if(e.target.classList.contains("bike")) {

            tasks.sort(function(a, b) {
                let result = a.bikeKm - b.bikeKm;
                if(result < 0) {
                    return 1;
                } else if( result > 0) {
                    return -1;
                } else if(result === 0) {
                    return 0;
                }
            });
        } else if(e.target.classList.contains("run")) {
            tasks.sort(function(a, b) {
                let result = a.runKm - b.runKm;
                if(result < 0) {
                    return 1;
                } else if( result > 0) {
                    return -1;
                } else if(result === 0) {
                    return 0;
                }
            })
        } else if(e.target.classList.contains("total")) {
            tasks.sort(function(a, b) {
                let result = a.totalKm - b.totalKm;
                if(result < 0) {
                    return 1;
                } else if( result > 0) {
                    return -1;
                } else if(result === 0) {
                    return 0;
                }
            })
        }

        UiCtrl.showBest(tasks);
    };

    //best time
    const findBestTime = function(e) {
        e.preventDefault();
        const tasks = LsCtrl.getItemsFromLs();
        if(e.target.classList.contains("bike")) {

            tasks.sort(function(a, b) {
                return hourFormat(a.bikeTime) - hourFormat(b.bikeTime);
            });
        } else if(e.target.classList.contains("run")) {
            tasks.sort(function(a, b) {
                return hourFormat(a.runTime) - hourFormat(b.runTime);
            })
        } else if(e.target.classList.contains("total")) {
            tasks.sort(function(a, b) {
                return hourFormat(a.totalTime) - hourFormat(b.totalTime);
            })
        }
        UiCtrl.showBest(tasks);
    };

    //transform TIME  in HOURS
    const hourFormat = function(time) {

        const timeArr = time.split(":");
        const seconds = parseInt(timeArr[2], 10) / 60;
        const minutes = (parseInt(timeArr[1], 10) + seconds) / 60;
        const hours = (parseInt(timeArr[0], 10) + minutes);
        return hours;
    };

    //how much is the average time per km
    const avrKmTime = function (type) {
        const tasks = LsCtrl.getItemsFromLs();
        let timeB = 0;
        let kmB = 0;
        let avrB = 0;

        let timeR = 0;
        let kmR = 0;
        let avrR = 0;
        if(tasks.length > 0) {
            tasks.forEach(function(task) {
                timeB += hourFormat(task.bikeTime);
                kmB += task.bikeKm;

                timeR += hourFormat(task.runTime);
                kmR += task.runKm;
            });

            avrB = isNaN((timeB * 60 / kmB).toFixed(2)) ? 0 : (timeB * 60 / kmB).toFixed(2);
            avrR = isNaN((timeR * 60 / kmR).toFixed(2)) ? 0 : (timeR * 60 / kmR).toFixed(2);
        }
        
        UiCtrl.showAvr(avrB, avrR);
    }

    return {
        init: function() {
            //load all evnet listeners
            loadEventListeners();

            //clear input fields
            UiCtrl.clearInputFields();

            
        }
    };
})(LsCtrl, UiCtrl, ItemCtrl);

AppCtrl.init();