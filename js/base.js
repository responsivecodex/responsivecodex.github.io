/**
 * Once the document is ready, these actions will be performed
 */
$(document).ready(function () {
  getDataParam();
  
  const data = {
    name: _data.name,  //_data: variable creada en el index.html, mapeando los parametros de doGet()
    date: _data.date,
    legend: _data.legend,
    image: _data.image
  };

  let elapsedDays = "- - -";
  console.log("Todo va bien: " + JSON.stringify(data));
  const aDate = data.date.split(/[-T/]/ig); //La fecha debe venir en formato dd-mm-yyyy
  console.log("fecha: " + aDate);

  elapsedDays = daysMonthsYearsInDates(
    formatDate(new Date(aDate[2], aDate[1] - 1, aDate[0])),
    formatDate(new Date())
  );

  $('body').css('background','lightblue url("'+_data.image+'") no-repeat fixed center');
  $('body').css('background-size','contain');

  $('#mainSection h6').html(data.name + ((data.name.length > 0) ? ", " : "") + data.legend);
  $('#clock').html(elapsedDays);
  wakeUp();
});

function getDataParam() {
  var vals = new Array();
  if (location.search != "") {
    vals = location.search.substr(1).split("&");
    console.log(vals);
    for (var i in vals) {
      vals[i] = vals[i].replace(/\+/g, " ").split("=");
    }
    //look for the parameter named 'data'  
    var found = false;
    for (var i in vals) {
      _data[vals[i][0]] = decodeURI( vals[i][1] );
      found=true;
    }
    if (!found) { noParams(); }
  }
  else {
    noParams();
  }
}

function parseDataValue(datavalue) {
  getDataParam();

  if (datavalue != "") {
    var vals = new Array();

    vals = decodeURIComponent(datavalue).split("&");
    for (var i in vals) {
      vals[i] = vals[i].replace(/\+/g, " ").split("=");
    }

    //Loop through vals and create rows for the table  
    for (var i in vals) {
      _data[vals[i][0]] = vals[i][1];
    }

  }
  else {
    noParams();
  }
}

function noParams() {
  console.log("No se recibieron parámetros, se usarán los predeterminados.");
}

/**
 * When the main functions (OnSucess or OnFailure) finish, 
 * the display of these two sections is exchanged
 */
function wakeUp() {
  $('#waitSection').toggleClass('hidden');
  $('#mainSection').toggleClass('hidden');
}

function dateDiffInDays(a, b) {
  const _MS_PER_DAY = 1000 * 60 * 60 * 24;
  // Discard the time and time-zone information.
  const utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
  const utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());
  return Math.floor((utc2 - utc1) / _MS_PER_DAY);
}

function daysInMonth(month, year) {
  return new Date(year, month, 0).getDate();
}

function numDayInDates(dateStart, dateEnd) {
  var arrayDateStart = dateStart.split('/');
  var arrayDateEnd = dateEnd.split('/');
  var msegDateStart = Date.UTC(arrayDateStart[2], arrayDateStart[1] - 1, arrayDateStart[0]);
  var msegDateEnd = Date.UTC(arrayDateEnd[2], arrayDateEnd[1] - 1, arrayDateEnd[0]);
  var diff = msegDateEnd - msegDateStart;
  var days = Math.floor(diff / (1000 * 60 * 60 * 24));
  return days;
}

function sumDaysToDate(numDays, date) {
  var arrayDate = date.split('/');
  var newDate = new Date(arrayDate[2] + '/' + arrayDate[1] + '/' + arrayDate[0]);
  newDate.setDate(newDate.getDate() + parseInt(numDays));
  return newDate.getDate() + '/' + (newDate.getMonth() + 1) + '/' + newDate.getFullYear();
}

function daysMonthsYearsInDates(dateStart, dateEnd) {
  var daysTotals = numDayInDates(dateStart, dateEnd);
  var daysCal = 0;
  var cantDays = 0;
  var cantMonths = 0;
  var cantYears = 0;
  while (daysCal < daysTotals) {
    var arrayDateStart = dateStart.split('/');
    var daysOfMonth = daysInMonth(arrayDateStart[1], arrayDateStart[2]);
    daysCal = daysCal + daysOfMonth;
    if (daysCal <= daysTotals) {
      cantMonths++;
      if (cantMonths == 12) {
        cantYears++;
        cantMonths = cantMonths - 12;
      }
    } else {
      cantDays = Math.abs(numDayInDates(dateStart, dateEnd));
    }
    dateStart = sumDaysToDate(daysOfMonth, dateStart);
  }

  var msg = '';
  if (cantYears > 0)
    msg = cantYears + ' año' + ((cantYears > 1) ? 's ' : ' ');
  if (cantMonths > 0) {
    if (cantYears > 0) msg += ', ';
    msg += cantMonths + ' mes' + ((cantMonths > 1) ? 'es ' : ' ');
  }

  if (cantDays > 0) {
    if (cantMonths > 0) msg += ' y ';
    msg += cantDays + ' día' + ((cantDays > 1) ? 's' : '');
  }
  console.log("Tiempo transcurrido: " + msg);
  return msg;
}

function padTo2Digits(num) {
  return num.toString().padStart(2, '0');
}

function formatDate(date) {
  return [
    padTo2Digits(date.getDate()),
    padTo2Digits(date.getMonth() + 1),
    date.getFullYear(),
  ].join('/');
}

