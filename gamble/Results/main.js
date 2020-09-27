var getDates = function(startDate, endDate) {
  var dates = [],
    currentDate = startDate,
    addDays = function(days) {
      var date = new Date(this.valueOf());
      date.setDate(date.getDate() + days);
      return date;
    };
  while (currentDate <= endDate) {
    dates.push(currentDate);
    currentDate = addDays.call(currentDate, 1);
  }
  return dates;
}

function Reset() {
  $('#container').empty();
}

function BringMatches() {
  $('#container').empty();
  var dates = getDates((new Date(document.getElementById('startDate').value)), (new Date(document.getElementById('endDate').value)));
  dates.sort(function(a, b) {
    return a.getTime() - b.getTime()
  }).forEach(function(date) {
    GetMatches(date.toISOString().split('T')[0]);
  });
}

function Clear() {
  $('#alt_min').val('');
  $('#alt_max').val('');
  $('#ust_min').val('');
  $('#ust_max').val('');
  $('#home_min').val('');
  $('#home_max').val('');
  $('#tie_min').val('');
  $('#tie_max').val('');
  $('#away_min').val('');
  $('#away_max').val('');
  $('#ms_home').val('');
  $('#ms_away').val('');
}

function Filter() {
  var count = 0;
  var counter0 = 0;
  var counter1 = 0;
  var counter2 = 0;
  var counter3 = 0;
  var counter4 = 0;
  var beraber = 0;

  var alt_min = $('#alt_min').val();
  var alt_max = $('#alt_max').val();
  var ust_min = $('#ust_min').val();
  var ust_max = $('#ust_max').val();
  var home_min = $('#home_min').val();
  var home_max = $('#home_max').val();
  var tie_min = $('#tie_min').val();
  var tie_max = $('#tie_max').val();
  var away_min = $('#away_min').val();
  var away_max = $('#away_max').val();
  var ms_home = $('#ms_home').val();
  var ms_away = $('#ms_away').val();
  if (alt_min.length === 0) alt_min = 0.1;
  if (alt_max.length === 0) alt_max = 10;
  if (ust_min.length === 0) ust_min = 0.1;
  if (ust_max.length === 0) ust_max = 10;
  if (home_min.length === 0) home_min = 0.1;
  if (home_max.length === 0) home_max = 10;
  if (tie_min.length === 0) tie_min = 0.1;
  if (tie_max.length === 0) tie_max = 10;
  if (away_min.length === 0) away_min = 0.1;
  if (away_max.length === 0) away_max = 10;
  var tr = $("#container table tbody tr");
  tr.each(function() {
    $(this).show();
    var ms1 = $(this).find("td.MS1");
    var ms0 = $(this).find("td.MS0");
    var ms2 = $(this).find("td.MS2");
    var alt = $(this).find("td.alt");
    var ust = $(this).find("td.alt");
    var ms = $(this).find("td.MS");
    var str2 = ms.html();

    if (ms1.html() === "-" && alt.html() === "-")
      $(this).hide();
    if (ms1.html() !== "")
      if (parseFloat(ms1.html()) < parseFloat(home_min) || parseFloat(ms1.html()) > parseFloat(home_max) || parseFloat(ms0.html()) < parseFloat(tie_min) || parseFloat(ms0.html()) > parseFloat(tie_max) || parseFloat(ms2.html()) < parseFloat(away_min) || parseFloat(ms2.html()) > parseFloat(away_max))
        $(this).hide();
    if (alt.html() !== "")
      if (parseFloat(alt.html()) < parseFloat(alt_min) || parseFloat(alt.html()) > parseFloat(alt_max) || parseFloat(ust.html()) < parseFloat(ust_min) || parseFloat(ust.html()) > parseFloat(ust_max))
        $(this).hide();
    if (str2 !== undefined && parseInt(ms_home) < 10 && parseInt(ms_home) >= 0 && parseInt(ms_away) < 10 && parseInt(ms_away) >= 0)
      if (parseInt(str2[0]) !== parseInt(ms_home) || parseInt(str2[2]) !== parseInt(ms_away))
        $(this).hide();
  });
  var html = "";
  var array = [];
  for (var i = 0; i < 5; i++) array[i] = [];

  tr.each(function() {
    var ms = $(this).find("td.MS");

    if ($(this).is(":visible")) {
      var doda = $(this).find("td.MS1");

      if (ms.html() !== undefined) {
        count++;
        var str = ms.html();

        if (str[0] === str[2]) {
          switch (str[0]) {
            case "0":
              counter0++;
              array[0].push(parseFloat(doda.html()));
              break;
            case "1":
              counter1++;
              array[1].push(parseFloat(doda.html()));
              break;
            case "2":
              counter2++;
              array[2].push(parseFloat(doda.html()));
              break;
            case "3":
              counter3++;
              array[3].push(parseFloat(doda.html()));
              break;
            case "4":
              array[4].push(parseFloat(doda.html()));
              counter4++;
              break;
          }
          html += doda.html();
          html += "<br/>";
          beraber++;
        }
      }
    }
  });

  doit();
  $('#p1').html(count);
  $('#p2').html(beraber);
  $('#p3').html(Math.floor((beraber / count) * 100)).append("%");
  $('#00').html(counter0);
  $('#11').html(counter1);
  $('#22').html(counter2);
  $('#33').html(counter3);
  $('#44').html(counter4);

  count = 0;
  beraber = 0;
  counter0 = 0;
  counter1 = 0;
  counter2 = 0;
  counter3 = 0;
  counter4 = 0;
  var result = [];
  for (i = 0; i < 5; i++)
    result[i] = getResults(array[i]);

  $('#00top3').html(result[0][0] + "   " + result[0][1] + "   " + result[0][2]);
  $('#11top3').html(result[1][0] + "   " + result[1][1] + "   " + result[1][2]);
  $('#22top3').html(result[2][0] + "   " + result[2][1] + "   " + result[2][2]);
  $('#33top3').html(result[3][0] + "   " + result[3][1] + "   " + result[3][2]);
  $('#44top3').html(result[4][0] + "   " + result[4][1] + "   " + result[4][2]);
}

function GetMatches(date) {
  $.get('CsvFiles/CsvFinished/' + date + '.csv', function(data) {
      var html = "<table class='table table-striped' >";
      html += "<thead>";
      html += "<tr>";
      html += "<th>Kod</th>";
      html += "<th>Saat</th>";
      html += "<th>Home</th>";
      html += "<th>Away</th>";
      html += "<th>1</th>";
      html += "<th>0</th>";
      html += "<th>2</th>";
      html += "<th>Alt</th>";
      html += "<th>Ust</th>";
      html += "<th>IY</th>";
      html += "<th>MS</th>";
      html += "<th> Link </th>";
      html += "</tr>";
      html += "</thead>";
      html += "<tbody>";
      var rows = data.split("\n");
      rows.forEach(function getvalues(ourrow) {
        var columns = ourrow.split(",");

        html += "<tr><td class='date'>" + date + "<td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>";

        html += "<tr>";
        html += "<td>" + columns[0] + "</td>";
        html += "<td>" + columns[1] + "</td>";
        html += "<td>" + columns[2] + "</td>";
        html += "<td>" + columns[3] + "</td>";
        html += "<td class='MS1'>" + columns[4] + "</td>";
        html += "<td class='MS0'>" + columns[5] + "</td>";
        html += "<td class='MS2'>" + columns[6] + "</td>";
        html += "<td class='alt'>" + columns[7] + "</td>";
        html += "<td class='ust'>" + columns[8] + "</td>";
        html += "<td>" + columns[9] + "</td>";
        html += "<td class='MS'>" + columns[10] + "</td>";

        var path = "http://istatistik.nesine.com/HeadToHead/Index.aspx?matchCode=" + columns[0];

        html += '<td>';
        html += '<a href="' + path + '">Check Teams</a>';
        html += '</td>';
        html += "</tr>";
      });
      html += "</tbody>";
      html += "</table>";
      $('#container').empty().append(html);
      doit()();
    });
}

function getResults(array) {
  var dict = {};
  for (var i = 0; i < array.length; i++) {
    dict[array[i]] = 0;
  }
  for (i = 0; i < array.length; i++) {
    dict[array[i]]++;
  }
  var sortable = [];

  for (var key in dict)
    sortable.push([key, dict[key]])
  sortable.sort(function(a, b) {
    return a[1] - b[1]
  });
  if (sortable[0] === undefined) {
    sortable[0] = ["", 0];
    sortable[1] = ["", 0];
    sortable[2] = ["", 0];
  } else if (sortable[1] === undefined) {
    sortable[1] = ["", 0];
    sortable[2] = ["", 0];
  } else if (sortable[2] === undefined) {
    sortable[2] = ["", 0];
  }
  var results = [sortable[sortable.length - 1][0], sortable[sortable.length - 2][0], sortable[sortable.length - 3][0]]
  return results;
}

function doit() {
  $("#container table tbody tr").each(function() {
    if ($(this).find("td.alt").html() === "-" && $("input:checked").length === 1)
      $(this).hide();
  });
}
