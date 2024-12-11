const DEFAULT_STARTING_DATE = new Date('2024-12-10 00:00:00');
const DEFAULT_TARGET_DATE = new Date('2025-01-29 00:00:00');
const DEFAULT_EXPAND_DATE = new Date('2025-02-01 00:00:00');

let STARTING_DATE = DEFAULT_STARTING_DATE;
let TARGET_DATE = DEFAULT_TARGET_DATE;
let TEMPORARY_DATE = new Date();

if (DEFAULT_TARGET_DATE - TEMPORARY_DATE < 0 && DEFAULT_EXPAND_DATE - TEMPORARY_DATE > 0) {
    STARTING_DATE = DEFAULT_TARGET_DATE;
    TARGET_DATE = DEFAULT_EXPAND_DATE;
}

function getDateDisplay() {
    function findMonth(monthNumber) {
        switch (true) {
            case monthNumber === 1:
                return'Januari';
                break;
            case monthNumber === 2:
                return'Febuari';
                break;
            case monthNumber === 3:
                return'Maret';
                break;
            case monthNumber === 4:
                return'April';
                break;
            case monthNumber === 5:
                return'Mei';
                break;
            case monthNumber === 6:
                return'Juni';
                break;
            case monthNumber === 7:
                return'Juli';
                break;
            case monthNumber === 8:
                return'Agustus';
                break;
            case monthNumber === 9:
                return'September';
                break;
            case monthNumber === 10:
                return'Oktober';
                break;
            case monthNumber === 11:
                return'November';
                break;
            case monthNumber === 12:
                return'Desember';
                break;
        }        
    }

    document.getElementById('countToDayDisplay').textContent = `${TARGET_DATE.getDate()} ${findMonth(TARGET_DATE.getMonth() + 1)} ${TARGET_DATE.getFullYear()}`;
    document.getElementById('startingDateCounter').textContent = `* Dimulai dari ${STARTING_DATE.getDate()} ${findMonth(STARTING_DATE.getMonth() + 1)} ${STARTING_DATE.getFullYear()}`;
}

function findDifferenceLength() {
    const CURRENT_DATE = new Date();

    const milliSecondDifference = TARGET_DATE - CURRENT_DATE;

    const dayDifference = Math.ceil(milliSecondDifference / (60 * 60 * 24 * 1000));
    
    if (dayDifference < 0) {
        document.getElementById('dayDisplayLength').textContent = `Perhitungan Hari Selesai`;        
    }
    else if (dayDifference === 0) {
        document.getElementById('dayDisplayLength').textContent = `Hari Yang Ditentukan Tiba`;        
    }
    else {
        document.getElementById('dayDisplayLength').textContent = `${dayDifference} Hari`;
    }
}

function detailDifferenceLength() {
    const CURRENT_TIME = new Date();

    const millisecondsTimeDifference = TARGET_DATE - CURRENT_TIME;
    let secondsTimeDifference = Math.ceil(millisecondsTimeDifference / 1000);
    if (secondsTimeDifference < 0) {
        secondsTimeDifference = 0;
    }
    let minutesTimeDifference = 0;
    let hoursTimeDifference = 0;
    let daysTimeDifference = 0;
    let monthTimeDifference = 0;
    let yearTimeDifference = 0; 

    let theMonth = CURRENT_TIME.getMonth();
    let theYear = CURRENT_TIME.getFullYear();


    function decreaseDayByMonth() {
        const dayInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
        let isLeapYear = theYear % 4 === 0;

        if (isLeapYear && theMonth === 1) {
            daysTimeDifference -= dayInMonth[theMonth] + 1;
        }
        else {
            daysTimeDifference -= dayInMonth[theMonth];
        }

        theMonth++;
        if (theMonth >= 12) {
            theMonth -= 12;
            theYear++;
        }
    }

    while (secondsTimeDifference >= 60) {
        secondsTimeDifference -= 60;
        minutesTimeDifference++;
    }
    while (minutesTimeDifference >= 60) {
        minutesTimeDifference -= 60;
        hoursTimeDifference++;
    }
    while (hoursTimeDifference >= 24) {
        hoursTimeDifference -= 24;
        daysTimeDifference++;
    }
    while (daysTimeDifference >= 28) {
        decreaseDayByMonth();
        monthTimeDifference++;
    }
    while (monthTimeDifference >= 12) {
        monthTimeDifference -= 12;
        yearTimeDifference++;
    }

    const id_Display = ['displayYearsLength', 'displayMonthsLength', 'displayDaysLength', 'displayHoursLength', 'displayMinutesLength', 'displaySecondsLength'];
    const detailTimeDiffference = [yearTimeDifference, monthTimeDifference, daysTimeDifference, hoursTimeDifference, minutesTimeDifference, secondsTimeDifference];

    for (let index = 0; index < id_Display.length; index++){
        let texts = String(detailTimeDiffference[index]);
        if (texts.length === 1) {
            texts = '0' + texts;
        }
        document.getElementById(id_Display[index]).textContent = texts;
    }
}

let addingExecute = false;

function changePercentage() {
    CURRENT_TIME = new Date();
    const millisecondDifferenceTotal = TARGET_DATE - STARTING_DATE;
    const currentMillisecondDifference = TARGET_DATE - CURRENT_TIME;
    const doneTimeTotal = millisecondDifferenceTotal - currentMillisecondDifference;
    
    let percentageDoneTotal = Number(String(((doneTimeTotal / millisecondDifferenceTotal) * 100).toFixed(2)));
    let currentPercentage = Number(document.getElementById('barsPercentage').textContent.replace('%', ''));
    if (percentageDoneTotal > 100) {
        percentageDoneTotal = 100;
    }

    let diffPercentage = (percentageDoneTotal - currentPercentage) * 100;
    if (!addingExecute && diffPercentage > 0) {
        let temporaryPercent = currentPercentage * 100;
        addingExecute = true;
        let addedDone = 0;

        function addingPercentageSlow() {
            if (diffPercentage - addedDone > 100) {
                addedDone += 100;
                temporaryPercent += 100;
            }
            else {
                temporaryPercent++;
                addedDone++;
            }
            document.getElementById('barsPercentage').textContent = `${(temporaryPercent / 100).toFixed(2)}%`;
            document.getElementById('progressBarInside').style.width = `${(temporaryPercent / 100).toFixed(2)}%`;

            if (addedDone < diffPercentage) {
                setTimeout(addingPercentageSlow, 20);
            }
            else {
                addingExecute = false;
            }
        }

        addingPercentageSlow();
    }
}

getDateDisplay();
findDifferenceLength();

detailDifferenceLength();
changePercentage();
setInterval(detailDifferenceLength, 1000);
setInterval(changePercentage, 1000);