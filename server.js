// Require Libs and ops
var jsonfile = require('jsonfile');
var http = require('http');

var src = ''; // source of where you want to save the date
var first = true;
var startDate,
    file,
    fileName,
    endDate;

function makeRequest(start,end){
  var options = {
    host:'', // host of query
    path:'', // path of query 
  };
  var end_date = new Date(end);
  end_date = end_date.toISOString();
  var start_date = new Date(start);
  start_date = start_date.toISOString();
  // Query options (depends of API)
  var start = 'start=' + start_date + '&';
  var end = 'end=' + end_date;
  options.path += start += end;
  // File name (you need to change the fileNameRute and fileName when create files, because it may be rewrite)
  fileName = 'file.json';
  // file rute + file name
  fileNameRute = src + fileName;
  // execute query
  http.request(options, callback).end();
}

callback = function(response) {
  var str = '';
  response.on('data', function (chunk) {
    str += chunk;
  });
  response.on('end', function () {
    if (first) {
      result = JSON.parse(str);
    }
    var currentData = JSON.parse(str);
    var lastDate = new Date(result.rows[result.rows.length-1].date);
    var diff = timeDiference(startDate,lastDate);
    if (diff <= 10) {
      // Make query 10 minutes more of last date
      var newDateObj = new Date(lastDate.getTime() + 10 * 60000);
      makeRequest(lastDate,newDateObj);
      first = false;
      for (var i = 0; i < currentData.rows.length; i++) {
        result.rows.push(currentData.rows[i]);
      }
    }else{
      createFile(result,fileName);
      // Make query 10 minutes more of last date
      var newDateObj = new Date(lastDate.getTime() + 10 * 60000);
      startDate = lastDate;
      makeRequest(lastDate,newDateObj);
      first = true;
    }
  });
}

// Diference of minutes between dates
function timeDiference(date1,date2){
  var timeDiff = Math.abs(date2.getTime() - date1.getTime());
  var diffMinutes = Math.ceil(timeDiff / (1000 * 3600 * 24 / 60 /60));
  return diffMinutes;
}

// Create file function using jsonfile library
function createFile(obj){
//  (you need to change the fileNameRute and fileName when create files, because it may be rewrite)
  jsonfile.writeFile(fileNameRute, obj, function (err) {
    console.log( "There are an error:  " + err || "--- Success file created --- ");
  })
}

// Define first query parameter
startDate = new Date('2015-11-21T23:55:00.000');
endDate = new Date('2015-11-22T00:19:50.000');

// Run aplication
makeRequest(startDate,endDate);