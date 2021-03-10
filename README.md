# The Calendar on pure JS
## Description

The core of this calendar project is the file `calendar.js`. 
This file constructs a calendar data model, so if you only need to generate dates in your project, then just use this file.
The calendar model contains dates for a specific month and dates that are in the same week of a specific month.
It's easier to understand this when starting a project.

The following data can be obtained from the model:
- `TODAY_YEAR` (yyyy format)
- `TODAY_MONTH` (Attention! It's return index of month)
- `WEEKDAYS` (name of weekdays)
- `MONTHS` (name of months)
- days (any formats)

The month and year for this calendar are set once.
If you need to change the month or year in your calendar, you need to create a new copy of the calendar.

#### Attention!
The weekdays and months wrote on Russian lang, so if you need change name of weekdays or name of months, you can make it.
You can rewrite all code, if you want))

## Create the calendar
The calendar is created with parameters and without parameters.

If the calendar has no parameters, then the calendar is created
with today's month and year:
```
new Calendar()
```
You can add two parameters to the calendar: month id and year
```
new Calendar(0, 2020); // month id, year (in format yyyy)
```
Month id ranges from 0 to 11, where 0 is January, 11 is December.

## Basic calendar methods

###`getDates` method
The simplest day format can be obtained through the method `getDates()`.
This and other date methods return an array of dates. This method returns a number.

### `getDatesObject` method
If you need to get more detailed data of the day, you can get it using the `getDatesObject()` method.
This method returns data of day in next format:
```
{
    date: /*date*/,
    weekNum: /*number week*/,
    monthIdx: /*id month*/,
    monthName: /*name month*/,
    weekdayIdx: /*id weekday*/,
    weekdayName: /*name weekday*/,
    day: /*number day*/
    status: /*callback function, when set in parameters of method*/
}
```
The callback can set for call method `getDatesObject(callback)`. 
You can pass a parameter to the callback, which will be the same object only without the status property.
```
  function callback(obj){...}, where obj = {date: /*date*/, weekNum: /*number week*/, ...}
```

### `getDatesCustom` method
If you need to get your own (custom) data of day, you can get it using the `getDatesCustom(...callbacks)` method.

:+1: What can be done with this method:
- do not set parameters (when return array with day object { date: "yyyy-mm-dd"})
  ```
  getDatesCustom()
  ```
- set a named function
  ```
  getDatesCustom(function foo(){})
  ```
- set enumerated named functions 
  ```
  getDatesCustom(function foo(){...}, function bar(){...}, ...)
  ```
- set an array named functions 
  ```
  getDatesCustom([
    function foo(){...}, 
    function bar(){...}, 
    ...
  ])
  ```
- set an object named functions 
  ```
  getDatesCustom({
    foo: function(){...}, 
    bar: function(){...},
    ... 
  })
  ```
You can pass three parameters to the callback, where the first parameter
is the day, the second is the month id, the third is the year
for the given day.
```
function foo(day, monthIdx, year) {...}
```

:-1: What not to do with this method:
- set not a function to parameters
  ```
  getDatesCustom(123)
  ```
- set an unnamed function
  ```
  getDatesCustom(function (){})
  ```
- set enumerated arrays, objects or other data
  ```
  getDatesCustom([...],[...],[...])
  ```
- set an array of arrays named functions
  ```
  getDatesCustom([
    function foo(){...},
    function bar(){...},
    [
        function one(){...},
        function two(){...},
        ...
    ],
    ...
  ])
  ```
- set an object of functions in object
  ```
  getDatesCustom({
    foo: function(){...},
    bar: function(){...},
    obj: {
        one: function(){...},
        two: function(){...},
        ...
    },
    ...
  })
  ```

## About the project

This project was written without using another different libraries, so the calendar has no unnecessary dependencies.
This project can help for beginners frontend developers to help them write a calendar (such as a test assignment), and for projects when need create a calendar without another libraries.

Created by jaroslav-d
09-03-2021