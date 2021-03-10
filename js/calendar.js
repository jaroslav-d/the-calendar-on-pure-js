// Created by jaroslav-d
// 09-03-2021
;

class Calendar {
    static WEEKDAYS = ["Пн","Вт","Ср","Чт","Пт","Сб","Вс"];
    static MONTHS = [
        "Январь",
        "Февраль",
        "Март",
        "Апрель",
        "Май",
        "Июнь",
        "Июль",
        "Август",
        "Сентябрь",
        "Октябрь",
        "Ноябрь",
        "Декабрь"
    ];
    #TODAY_YEAR;
    #TODAY_MONTH;
    #number = 0;

    constructor(TODAY_MONTH = new Date().getMonth(), TODAY_YEAR = new Date().getFullYear()) {
        this.#TODAY_MONTH = TODAY_MONTH;
        this.#TODAY_YEAR = TODAY_YEAR;
    }

    #getPrevYear() {
        return new Date(this.#TODAY_YEAR, this.#TODAY_MONTH - 1).getFullYear();
    }

    #getNextYear() {
        return new Date(this.#TODAY_YEAR, this.#TODAY_MONTH + 1).getFullYear();
    }

    #getPrevMonth() {
        return new Date(this.#TODAY_YEAR, this.#TODAY_MONTH - 1).getMonth();
    }

    #getNextMonth() {
        return new Date(this.#TODAY_YEAR, this.#TODAY_MONTH + 1).getMonth();
    }

    #getLastDayPrevMonth() {
        return new Date(this.#TODAY_YEAR, this.#TODAY_MONTH, 0).getDate();
    }

    #getFirstDayNextMonth() {
        return new Date(this.#TODAY_YEAR, this.#TODAY_MONTH + 1).getDate();
    }

    #getFirstWeekdayMonth() {
        return new Date(this.#TODAY_YEAR, this.#TODAY_MONTH).getUTCDay();
    }

    #getLastWeekdayMonth() {
        return new Date(this.#TODAY_YEAR, this.#TODAY_MONTH + 1, 0).getUTCDay();
    }

    #getNumberWeeksOfMonth() {
        let firstWeekdayMonth = this.#getFirstWeekdayMonth();
        let lastWeekdayMonth = this.#getLastWeekdayMonth();
        if (this.#TODAY_MONTH === 1 && firstWeekdayMonth === 0 && lastWeekdayMonth === 6) {
            return [...Array(4).keys()];
        }
        if (firstWeekdayMonth === 5 && lastWeekdayMonth === 0) {
            return [...Array(6).keys()];
        }
        if (firstWeekdayMonth === 6 && lastWeekdayMonth === 0) {
            return [...Array(6).keys()];
        }
        if (firstWeekdayMonth === 6 && lastWeekdayMonth === 1) {
            return [...Array(6).keys()];
        }
        return [...Array(5).keys()];
    }

    #getDay(week, weekdayIdx) {
        if (week === 0) {
            if (weekdayIdx < this.#getFirstWeekdayMonth()) {
                return this.#getLastDayPrevMonth() - (this.#getFirstWeekdayMonth() - weekdayIdx - 1);
            }
        }
        if (week === this.#getNumberWeeksOfMonth().length - 1) {
            if (weekdayIdx > this.#getLastWeekdayMonth()) {
                return this.#getFirstDayNextMonth() + (weekdayIdx - this.#getLastWeekdayMonth() - 1);
            }
        }
        this.#number += 1;
        return this.#number;
    }

    #getDayObj(week, weekdayIdx, callback) {
        if (week === 0) {
            if (weekdayIdx < this.#getFirstWeekdayMonth()) {
                const day = this.#getLastDayPrevMonth() - (this.#getFirstWeekdayMonth() - weekdayIdx - 1);
                const obj = {
                    date: `${this.#getPrevYear()}-${this.#getPrevMonth()+1}-${day}`,
                    weekNum: week,
                    monthIdx: this.#getPrevMonth(),
                    monthName: Calendar.MONTHS[this.#getPrevMonth()],
                    weekdayIdx: weekdayIdx,
                    weekdayName: Calendar.WEEKDAYS[weekdayIdx],
                    day: day
                };
                obj.status = callback(obj);
                return obj;
            }
        }
        if (week === this.#getNumberWeeksOfMonth().length - 1) {
            if (weekdayIdx > this.#getLastWeekdayMonth()) {
                const day = this.#getFirstDayNextMonth() + (weekdayIdx - this.#getLastWeekdayMonth() - 1);
                const obj = {
                    date: `${this.#getNextYear()}-${this.#getNextMonth()+1}-${day}`,
                    weekNum: week,
                    monthIdx: this.#getNextMonth(),
                    monthName: Calendar.MONTHS[this.#getNextMonth()],
                    weekdayIdx: weekdayIdx,
                    weekdayName: Calendar.WEEKDAYS[weekdayIdx],
                    day: day
                };
                obj.status = callback(obj);
                return obj;
            }
        }
        this.#number += 1;
        const obj = {
            date: `${this.#TODAY_YEAR}-${this.#TODAY_MONTH+1}-${this.#number}`,
            weekNum: week,
            monthIdx: this.#TODAY_MONTH,
            monthName: Calendar.MONTHS[this.#TODAY_MONTH],
            weekdayIdx: weekdayIdx,
            weekdayName: Calendar.WEEKDAYS[weekdayIdx],
            day: this.#number
        };
        obj.status = callback(obj);
        return obj;
    }

    #getDayCustom(week, weekdayIdx, callbacks) {
        if (week === 0) {
            if (weekdayIdx < this.#getFirstWeekdayMonth()) {
                const day = this.#getLastDayPrevMonth() - (this.#getFirstWeekdayMonth() - weekdayIdx - 1);
                const monthIdx = this.#getPrevMonth();
                const year = this.#getPrevYear();
                const obj = {};
                callbacks.forEach( callback => obj[callback.name] = callback(day, monthIdx, year));
                return obj;
            }
        }
        if (week === this.#getNumberWeeksOfMonth().length - 1) {
            if (weekdayIdx > this.#getLastWeekdayMonth()) {
                const day = this.#getFirstDayNextMonth() + (weekdayIdx - this.#getLastWeekdayMonth() - 1);
                const monthIdx = this.#getNextMonth();
                const year = this.#getNextYear();
                const obj = {};
                callbacks.forEach( callback => obj[callback.name] = callback(day, monthIdx, year));
                return obj;
            }
        }
        this.#number += 1;
        const obj = {};
        callbacks.forEach( callback =>
            obj[callback.name] = callback(this.#number, this.#TODAY_MONTH, this.#TODAY_YEAR)
        );
        return obj;
    }

    getDates() {
        let arrayDate = [];
        this.#number = 0;
        for (let week of this.#getNumberWeeksOfMonth()) {
            for (let weekdayIdx in Calendar.WEEKDAYS) {
                arrayDate.push(this.#getDay(week, weekdayIdx));
            }
        }
        return arrayDate;
    }

    getDatesObject(callback = () => {}) {
        let arrayObjectsDate = [];
        this.#number = 0;
        for (let week of this.#getNumberWeeksOfMonth()) {
            for (let weekdayIdx in Calendar.WEEKDAYS) {
                arrayObjectsDate.push(this.#getDayObj(week, weekdayIdx, callback));
            }
        }
        return arrayObjectsDate;
    }

    getDatesCustom(...callbacks) {
        let arrayCustomObjectsDate = [];
        this.#number = 0;
        if (callbacks.length === 0) {
            callbacks.push(function date(day, monthIdx, year) {
                const month = monthIdx < 9 ? `0${monthIdx+1}` : monthIdx+1;
                return `${year}-${month}-${day}`
            });
        }
        if (typeof callbacks[0] === "object") {
            const obj = callbacks[0];
            callbacks = [];
            for (let key in obj) {
                callbacks.push(obj[key]);
            }
        }
        callbacks.flat(Infinity);
        for (let week of this.#getNumberWeeksOfMonth()) {
            for (let weekdayIdx in Calendar.WEEKDAYS) {
                arrayCustomObjectsDate.push(this.#getDayCustom(week,weekdayIdx,callbacks));
            }
        }
        return arrayCustomObjectsDate;
    }

    createCalendarHTML() {
        let html = "";
        this.#number = 0;
        html += "<ul>";
        for (let week of this.#getNumberWeeksOfMonth()) {
            html += "<li>";
            for (let weekdayIdx in Calendar.WEEKDAYS) {
                html += `<div>${ this.#getDay(week, weekdayIdx) }</div>`;
                html += `<div></div>`;
            }
            html += "<div></div>";
            html += "</li>";
        }
        html += "</ul>";
        return html;
    }

    get TODAY_YEAR() {
        return this.#TODAY_YEAR;
    }

    get TODAY_MONTH() {
        return this.#TODAY_MONTH;
    }
}
