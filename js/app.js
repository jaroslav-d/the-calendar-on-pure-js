// Created by jaroslav-d
// 09-03-2021
;

let builderView = {
    createDays: (days) => `
        ${[...Array(days.length / 7).keys()].map(i => `
            <li>
                ${days.slice(i*7,(i+1)*7).map(dayObj => `
                    <div data-type="day" data-date="${dayObj.date}">${dayObj.day}</div>
                    <div></div>`
                ).join("")}
                <div></div>
            </li>`
        ).join("")}`,
    // ANOTHER WAY
    // createWeekdays: function (weekdays, tasks) {
    //     return [...Array(7).keys()].map(i => `
    //                 ${this.createWeekday(weekdays[i])}
    //                 ${this.createTask(tasks[i])}`
    //     ).join("")
    // },
    // createWeekday: (weekday) => `<div data-type="weekday">${weekday}</div>`,
    // createTask: (task) => {
    //     let visible = task ? "" : 'class="invisible-element" ';
    //     return `<div ${visible} data-type="task"><span>${task}</span></div>`
    // },
    render: () => `
        ${Array(7).fill(`
            <div data-type="weekday"></div>
            <div class="invisible-element" data-type=\"task\"></div>`
        ).join("")}
        <div id="open-calendar"><i class="fa fa-angle-down"></i></div>
        <div class="dropdown-part">
            <ul></ul>
            <div class="footer-calendar">
                <div id="prev-month"><i class="fas fa-arrow-left"></i> Предыдущий месяц</div>
                <div id="name-month"></div>
                <div id="next-month">Следующий месяц <i class="fas fa-arrow-right"></i></div>
            </div>
        </div>`
    // ANOTHER WAY
    // render: () => `
    //     <div id="open-calendar"><i class="fa fa-angle-down"></i></div>
    //     <div class="dropdown-part">
    //         <ul></ul>
    //         <div class="footer-calendar">
    //             <div id="prev-month"><i class="fas fa-arrow-left"></i> Предыдущий месяц</div>
    //             <div id="name-month"></div>
    //             <div id="next-month">Следующий месяц <i class="fas fa-arrow-right"></i></div>
    //         </div>
    //     </div>`
};


let currentView = document.querySelector("#dropdown-calendar");
currentView.innerHTML = builderView.render();
let dropdownCalendar = {
    view: {
        self: currentView,
        // ANOTHER WAY
        // weekdays and tasks is empty
        weekdays: currentView.querySelectorAll("[data-type='weekday']"),
        tasks: currentView.querySelectorAll("[data-type='task']"),
        buttonOpenCalendar: currentView.querySelector("#open-calendar"),
        dropdown: currentView.querySelector(".dropdown-part"),
        calendar: currentView.querySelector("ul"),
        buttonPrevMonth: currentView.querySelector("#prev-month"),
        nameMonth: currentView.querySelector("#name-month"),
        buttonNextMonth: currentView.querySelector("#next-month"),
    },
    weekdays: Calendar.WEEKDAYS,
    set calendar(calendar) {
        this.dayObjects = calendar.getDatesObject();
        this.nameMonth = Calendar.MONTHS[calendar.TODAY_MONTH];
        this.todayYear = calendar.TODAY_YEAR;
        this.todayMonth = calendar.TODAY_MONTH;
        this.view.calendar.innerHTML = builderView.createDays(this.dayObjects);
        this.view.nameMonth.innerText = this.nameMonth;
    },
    set tasksOfWeek(values) {
        if (!values && values.length < 7) return;
        this._tasksOfWeek = values;
        for (let i in this._tasksOfWeek) {
            this.view.weekdays[i].innerText = this.weekdays[i];
            this.view.tasks[i].innerHTML = `<span>${this._tasksOfWeek[i]}</span>`;
            if (this._tasksOfWeek[i]) this.view.tasks[i].classList.toggle("invisible-element")
        }
    },
    get tasksOfWeek() {
        return this._tasksOfWeek ?? Array(7).fill(0);
    },
    set openedCalendar(value) {
        this._openedCalendar = value;
        if (this._openedCalendar) {
            this.view.self.classList.add("opened-calendar");
            this.view.buttonOpenCalendar.classList.add("tapped");
        } else {
            this.view.self.classList.remove("opened-calendar");
            this.view.buttonOpenCalendar.classList.remove("tapped");
        }
    },
    get openedCalendar() {
        return this._openedCalendar ?? false;
    },
    // ANOTHER WAY
    // set tasksOfWeek(values) {
    //     if (!values && values.length < 7) return;
    //     this._tasksOfWeek = values;
    //     this.view.self.querySelectorAll("[data-type='weekday']").forEach(weekday => weekday.remove());
    //     this.view.self.querySelectorAll("[data-type='task']").forEach(task => task.remove());
    //     this.view.self.innerHTML = builderView.createWeekdays(this.weekdays, this._tasksOfWeek) + this.view.self.innerHTML;
    // },
    // get tasksOfWeek() {
    //     return this._tasksOfWeek ?? Array(7).fill(0);
    // },
    _tapOfDay: {
        _first: null,
        _second: null,
        _nowHove: null,
        set first(value) {
            this._first = value;
            const dayView = dropdownCalendar.view.calendar.querySelector(`[data-date="${value}"]`);
            dayView.classList.add("dropdownn-calendar-today");
        },
        get first() {
            return this._first;
        },
        set second(value) {
            this._second = value;
            const dayView = dropdownCalendar.view.calendar.querySelector(`[data-date="${value}"]`);
            dayView.classList.add("dropdownn-calendar-today");
            const first = this._first;
            const second = this._second;
            const interval = first < second ? {from: first, to: second} : {from: second, to: first};
            alert(`You checked from ${interval.from} to ${interval.to}`);
            dropdownCalendar.tapOfDay = null;
        },
        get second() {
            return this._second;
        },
        set nowHove(value) {
            this._nowHove = value;
            const first = new Date(this._first);
            const hover = new Date(this._nowHove);
            const interval = first < hover ? {from: first, to: hover} : {from: hover, to: first};
            const dayViews = dropdownCalendar.view.calendar.querySelectorAll("[data-type=\"day\"]");
            const dates = dropdownCalendar.dayObjects.map(dayObj => new Date(dayObj.date));
            dayViews.forEach((viewElem, viewIdx) => {
                if (dates[viewIdx] >= interval.from && dates[viewIdx] <= interval.to) {
                    viewElem.classList.add("dropdownn-calendar-today");
                } else {
                    viewElem.classList.remove("dropdownn-calendar-today");
                }
            });
        },
        get nowHove() {
            return this._nowHove;
        }
    },
    set tapOfDay(value) {
        if (!value) {
            this._tapOfDay._first = null;
            this._tapOfDay._second = null;
            this._tapOfDay._nowHove = null;
            const dayViews = this.view.calendar.querySelectorAll("[data-type=\"day\"]");
            dayViews.forEach(viewElem => viewElem.classList.remove("dropdownn-calendar-today"));
        }
    },
    get tapOfDay() {
        return this._tapOfDay;
    },
    refreshCalendar: function(date) {
        let month = date.getMonth();
        let year = date.getFullYear();
        this.calendar = new Calendar(month, year);
    },
    previousMonth: function() {
        let prevDate = new Date(this.todayYear, this.todayMonth - 1);
        this.refreshCalendar(prevDate);
    },
    nextMonth: function() {
        let nextDate = new Date(this.todayYear, this.todayMonth + 1);
        this.refreshCalendar(nextDate);
    }
};


// ajax request
dropdownCalendar.tasksOfWeek = Calendar.WEEKDAYS.map(weekday => {
    switch (weekday) {
        case "Пн" : return 3;
        case "Вт" : return 0;
        case "Ср" : return 0;
        case "Чт" : return 4;
        case "Пт" : return 0;
        case "Сб" : return 0;
        case "Вс" : return 1;
    }
});
dropdownCalendar.calendar = new Calendar();

let dropdownCalendarController = {
    tappedOnButtonNextMonth: function () {
        dropdownCalendar.nextMonth();
    },
    tappedOnButtonPrevMonth: function () {
        dropdownCalendar.previousMonth();
    },
    tapOnDayView: function (e) {
        const isFirstTapOnDay = !dropdownCalendar.tapOfDay.first;
        const haveSecondTap = !!dropdownCalendar.tapOfDay.second;
        const dayView = e.target.getAttribute("data-type") === "day" ? e.target : null;
        if (haveSecondTap) return;
        if (isFirstTapOnDay && dayView) {
            dropdownCalendar.tapOfDay.first = dayView.getAttribute("data-date");
            console.log(dropdownCalendar.tapOfDay.first);
            return;
        }
        if (!isFirstTapOnDay && dayView) {
            dropdownCalendar.tapOfDay.second = dayView.getAttribute("data-date");
            console.log(dropdownCalendar.tapOfDay.second);
        }
    },
    hoverOnDayView: function (e) {
        const haveFirstTap = !!dropdownCalendar.tapOfDay.first;
        const haveNotSecondTap = !dropdownCalendar.tapOfDay.second;
        const dayView = e.target.getAttribute("data-type") === "day" ? e.target : null;
        if (haveFirstTap && haveNotSecondTap && dayView) {
            dropdownCalendar.tapOfDay.nowHove = dayView.getAttribute("data-date");
            console.log(dropdownCalendar.tapOfDay.nowHove);
        }
    },
    toggleOpenCalendar: function () {
        dropdownCalendar.openedCalendar = !dropdownCalendar.openedCalendar
    }
};

dropdownCalendar.view.buttonPrevMonth.addEventListener("click", dropdownCalendarController.tappedOnButtonPrevMonth);
dropdownCalendar.view.buttonNextMonth.addEventListener("click", dropdownCalendarController.tappedOnButtonNextMonth);
dropdownCalendar.view.buttonOpenCalendar.addEventListener("click", dropdownCalendarController.toggleOpenCalendar);
dropdownCalendar.view.calendar.addEventListener("mouseover", dropdownCalendarController.hoverOnDayView);
dropdownCalendar.view.calendar.addEventListener("click", dropdownCalendarController.tapOnDayView);
