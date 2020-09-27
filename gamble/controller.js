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
function Filter() {
  var alt_min = $('#alt_min').val();
  var alt_max = $('#alt_max').val();
  var ust_min = $('#ust_min').val();
  var ust_max = $('#ust_max').val();
  var alt1_min = $('#alt1_min').val();
  var alt1_max = $('#alt1_max').val();
  var ust1_min = $('#ust1_min').val();
  var ust1_max = $('#ust1_max').val();
  var alt3_min = $('#alt3_min').val();
  var alt3_max = $('#alt3_max').val();
  var ust3_min = $('#ust3_min').val();
  var ust3_max = $('#ust3_max').val();
  var home_min = $('#home_min').val();
  var home_max = $('#home_max').val();
  var tie_min = $('#tie_min').val();
  var tie_max = $('#tie_max').val();
  var away_min = $('#away_min').val();
  var away_max = $('#away_max').val();

  if (alt_min.length === 0) alt_min = 0.1;
  if (alt_max.length === 0) alt_max = 100;
  if (ust_min.length === 0) ust_min = 0.1;
  if (ust_max.length === 0) ust_max = 100;
  if (alt1_min.length === 0) alt1_min = 0.1;
  if (alt1_max.length === 0) alt1_max = 100;
  if (ust1_min.length === 0) ust1_min = 0.1;
  if (ust1_max.length === 0) ust1_max = 100;
  if (alt3_min.length === 0) alt3_min = 0.1;
  if (alt3_max.length === 0) alt3_max = 100;
  if (ust3_min.length === 0) ust3_min = 0.1;
  if (ust3_max.length === 0) ust3_max = 100;
  if (home_min.length === 0) home_min = 0.1;
  if (home_max.length === 0) home_max = 100;
  if (tie_min.length === 0) tie_min = 0.1;
  if (tie_max.length === 0) tie_max = 100;
  if (away_min.length === 0) away_min = 0.1;
  if (away_max.length === 0) away_max = 100;
  $("#container table tbody tr").each(function() {
    $(this).show();
    var ms1 = $(this).find("td.MS1");
    var ms0 = $(this).find("td.MS0");
    var ms2 = $(this).find("td.MS2");
    var alt = $(this).find("td.alt");
    var alt1 = $(this).find("td.alt1");
    var alt3 = $(this).find("td.alt3");
    var ust = $(this).find("td.ust");
    var ust1 = $(this).find("td.ust1");
    var ust3 = $(this).find("td.ust3");
    if (ms1.html() === "" && alt.html() === "")
      $(this).hide();
    if (ms1.html() !== "")
      if (parseFloat(ms1.html()) < parseFloat(home_min) || parseFloat(ms1.html()) > parseFloat(home_max) || parseFloat(ms0.html()) < parseFloat(tie_min) || parseFloat(ms0.html()) > parseFloat(tie_max) || parseFloat(ms2.html()) < parseFloat(away_min) || parseFloat(ms2.html()) > parseFloat(away_max))
        $(this).hide();
    if (alt.html() !== "")
      if (parseFloat(alt.html()) < parseFloat(alt_min) || parseFloat(alt.html()) > parseFloat(alt_max) || parseFloat(ust.html()) < parseFloat(ust_min) || parseFloat(ust.html()) > parseFloat(ust_max))
        $(this).hide();
    if (alt1.html() !== "")
      if (parseFloat(alt1.html()) < parseFloat(alt1_min) || parseFloat(alt1.html()) > parseFloat(alt1_max) || parseFloat(ust1.html()) < parseFloat(ust1_min) || parseFloat(ust1.html()) > parseFloat(ust1_max))
        $(this).hide();
    if (alt3.html() !== "")
      if (parseFloat(alt3.html()) < parseFloat(alt3_min) || parseFloat(alt3.html()) > parseFloat(alt3_max) || parseFloat(ust3.html()) < parseFloat(ust3_min) || parseFloat(ust3.html()) > parseFloat(ust3_max))
        $(this).hide();
  })
  HideIfChecked();
}
function Clear() {
  $('#alt_min').val('');
  $('#alt_max').val('');
  $('#ust_min').val('');
  $('#ust_max').val('');
  $('#alt1_min').val('');
  $('#alt1_max').val('');
  $('#ust1_min').val('');
  $('#ust1_max').val('');
  $('#alt3_min').val('');
  $('#alt3_max').val('');
  $('#ust3_min').val('');
  $('#ust3_max').val('');
  $('#home_min').val('');
  $('#home_max').val('');
  $('#tie_min').val('');
  $('#tie_max').val('');
  $('#away_min').val('');
  $('#away_max').val('');
}
function GetMatches(date) {
  $.get('CsvFiles/CsvNewMatches/' + date + '.csv', function(data) {
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
    html += "<th> Link </th>";
    html += "</tr>";
    html += "</thead>";
    html += "<tbody>";
    var rows = data.split("\n");

    html += "<tr><td class='date'>" + date + "<td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>";

    rows.forEach(function getvalues(ourrow) {
      var columns = ourrow.split(",");
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
      var path = "http://istatistik.nesine.com/HeadToHead/Index.aspx?matchCode=" + columns[0];

      html += "<td>";
      html += '<a href="' + path + '">Check Teams</a>';
      html += "</td>";
      html += "<td onclick="
      Add()
      " class='add plus'>" + "<span class='glyphicon glyphicon-plus-sign button clickable-row' aria-hidden='true'></span>" + "</td>";
      html += "</tr>";
    });
    html += "</tbody>";
    html += "</table>";
    $('#container').append(html);
    HideIfChecked();
  });
}
function Download() {
  $(".xls").hide();
  $(".downTable").tableExport({
    formats: ["xls"]
  });
}
function HideIfChecked() {
  var tr = $("#container table tbody tr");
  tr.each(function() {
    if ($(this).find("td.alt").html() === "" && $("input:checked").length === 1)
      $(this).hide();
  });
}
function Add() {
  $(this).removeClass('add');
  var kod = $(this).parent().find('td:eq(0)').html();
  var saat = $(this).parent().find('td:eq(1)').html();
  var home = $(this).parent().find('td:eq(2)').html();
  var away = $(this).parent().find('td:eq(3)').html();
  var MS1 = $(this).parent().find('td:eq(4)').html();
  var MS0 = $(this).parent().find('td:eq(5)').html();
  var MS2 = $(this).parent().find('td:eq(6)').html();
  var alt = $(this).parent().find('td:eq(7)').html();
  var ust = $(this).parent().find('td:eq(8)').html();
  var link = $(this).parent().find('td:eq(9)').html();
  if (ust[ust.length - 1] === "\n")
    ust = ust.slice(0, -1);
  $(this).attr('id', kod);
  var kod_td = "<td>" + kod + "</td>";
  var home_td = "<td>" + home + "</td>";
  var away_td = "<td>" + away + "</td>";
  var MS1td = "<td class='hid'>" + MS1 + "</td>";
  var MS0td = "<td class='hid'>" + MS0 + "</td>";
  var MS2td = "<td class='hid'>" + MS2 + "</td>";
  var alt_td = "<td class='hid'>" + alt + "</td>";
  var ust_td = "<td class='hid'>" + ust + "</td>";

  var minus = "<td class='minus'>" + "<span class='glyphicon glyphicon-minus-sign button' aria-hidden='true'></span>" + "</td>";
  var html = "<tr>" + kod_td + home_td + away_td + MS1td + MS0td + MS2td + alt_td + ust_td + minus + "</tr>";
  for (var i = 0; i < html.length; i++) {
    html = html.replace(".", ",");
  }
  $('#selectedMatches').append(html);
  download();
}
