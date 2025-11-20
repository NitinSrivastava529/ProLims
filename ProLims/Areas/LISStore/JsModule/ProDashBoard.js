$(document).ready(function () {
    $('#ddlProName').empty().append($('<option></option>').val('ALL').html('Select')).select2();
    FillCurrentDate("txtfrom");
    FillCurrentDate("txtto");
    onchartList();
    GetProlist();
    GetReport('');
});

function GetProlist() {
    var url = config.baseUrl + "/api/GeneralStore/ReportQueries";
    var objBO = {};
    objBO.UnitId = '-';
    objBO.ObservationId = '-';
    objBO.From = $("#txtfrom").val();
    objBO.to = $("#txtto").val();
    objBO.Logic = 'GetProList';
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            if (Object.keys(data.ResultSet).length) {
                if (Object.keys(data.ResultSet.Table).length) {
                    $('#ddlProName').empty().append($('<option></option>').val('ALL').html('Select')).select2();
                    $.each(data.ResultSet.Table, function (key, val) {
                        $("#ddlProName").append($("<option></option>").val(val.ProId).html(val.ProName));
                    });
                }
            }
            else {
                alert("Error");
            };
        },
        error: function (response) {
            alert('Server Error...!');
        }
    });
}
function GetReport(element) {
    var _totalAmount = 0; var _TotalCount = 0; var _TotalCash = 0; var _TotalCredit = 0; var _TotalShareAmount = 0; 
    var _totalAmount1 = 0; var _TotalCount1 = 0; var _TotalCash1 = 0; var _TotalCredit1 = 0; var _TotalShareAmount1 = 0; 
    if (element != '') {
        $("#btnget").append("<i class='fa fa-spinner fa-spin' style='font-size:20px;float:left'></i>");
    }
    else {   
    }
    $("#tblReport tbody").empty();
    $("#tblReportInfo tbody").empty();
    $("#tblProReport tbody").empty();
    var url = config.baseUrl + "/api/GeneralStore/ReportQueries";
    var objBO = {};
    objBO.UnitId ='-';
    objBO.ObservationId ='-';
    objBO.From = $("#txtfrom").val();
    objBO.to = $("#txtto").val();
    objBO.DoctorId ='ALL';
    objBO.ProId = $("#ddlProName option:selected").val();
    objBO.Logic = 'GetbusinessReport';
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            var tbody1 = ""; var tbody = ""; var tbody2 = ""; var temp = "";
            if (Object.keys(data.ResultSet).length) {
                if (Object.keys(data.ResultSet.Table).length) {
                    $.each(data.ResultSet.Table, function (key, val) {
                        tbody1 += "<tr>";
                        tbody1 += "<th scope='row'>" + val.businessType + "</th>";
                        tbody1 += "<td style='text-align: center;'><input class='totalcount' value='" + val.TotalCount + "'/></td>";
                        tbody1 += "<td style='text-align:center'>" + val.totalAmount + "</td>";
                        tbody1 += "<td style='text-align:center'>" + val.TotalCash + "</td>";
                        tbody1 += "<td style='text-align:center'>" + val.TotalCredit + "</td>";
                        tbody1 += "<td style='text-align:center'>" + val.TotalShareAmount + "</td>";
                        tbody1 += "</tr>";
                        _totalAmount += parseFloat(val.totalAmount) || 0;
                        _TotalCount += parseFloat(val.TotalCount) || 0;
                        _TotalCash += parseFloat(val.TotalCash) || 0;
                        _TotalCredit += parseFloat(val.TotalCredit) || 0;
                        _TotalShareAmount += parseFloat(val.TotalShareAmount) || 0;
                    });
                    $("#tblReport tbody").append(tbody1);
                    var str1 = "<table id='tblReport' style='width:100%;font-size:12px' class='table table-bordered'>";
                    str1 += "<tr>";
                    str1 += "<td style='text-align:right;width:17%'><b>Grand Total:</b></td>";
                    str1 += "<td style='text-align:center;width:14%'><b>" + _TotalCount.toFixed(2) + "</b></td>";
                    str1 += "<td style='text-align:center;width:15%'><b>" + _totalAmount.toFixed(2) + "</b></td>";
                    str1 += "<td style='text-align:center;width:15%'><b>" + _TotalCash.toFixed(2) + "</b></td>";
                    str1 += "<td style='text-align:center;width:15%'><b>" + _TotalCredit.toFixed(2) + "</b></td>";
                    str1 += "<td style='text-align:center;width:15%'><b>" + _TotalShareAmount.toFixed(2) + "</b></td>";
                    str1 += "</tr>";
                    str1 += "</table>";
                    $('#divTotal').html(str1);
                }
                					
                if (Object.keys(data.ResultSet.Table1).length) {
                    var _TotalCountAmount1 = 0;
                    $.each(data.ResultSet.Table1, function (key, val) {
                        tbody += "<tr>";
                        tbody += "<th scope='row'>" + val.GrpName + "</th>";
                        tbody += "<td style='text-align: center;'><input class='totalcount' value='" + val.TotalTestCount + "'/></td>";
                        tbody += "</tr>";	
                        _TotalCountAmount1 += parseFloat(val.TotalTestCount) || 0;
                    });
                    $("#tblReportInfo tbody").append(tbody);
                    var str2 = "<table id='tblReportInfo' style='width:100%;font-size:12px' class='table table-bordered'>";
                    str2 += "<tr>";
                    str2 += "<td style='text-align:right;width:70%'><b>Grand Total:</b></td>";
                    str2 += "<td style='text-align:center;width:30%'><b>" + _TotalCountAmount1.toFixed(2) + "</b></td>";
                    str2 += "</tr>";
                    str2 += "</table>";
                    $('#divTotalAmount').html(str2);
                }

                if (Object.keys(data.ResultSet.Table2).length) {
                    $.each(data.ResultSet.Table2, function (key, val) {
                        if (temp != val.businessType) {
                            tbody2 += "<tr style='background:#d9d9d9;'>";
                            tbody2 += "<td colspan='12' style='font-size:13px;padding: 5px;'><b>Business Type: " + val.businessType + "</b></td>";
                            tbody2 += "</tr>";
                            temp = val.businessType
                        }
                        tbody2 += "<tr>";
                        tbody2 += "<td hidden>" + val.PanelId + "</td>";
                        tbody2 += "<td>" + val.ProName + "</td>";
                        tbody2 += "<td style='text-align:center'>" + val.TestCount + "</td>";
                        tbody2 += "<td style='text-align:center'>" + val.Amount + "</td>";
                        tbody2 += "<td style='text-align:center'>" + val.CashAmount + "</td>";
                        tbody2 += "<td style='text-align:center'>" + val.CreditAmount + "</td>";
                        tbody2 += "<td style='text-align:center'>" + val.ShareAmount + "</td>";        
                        tbody2 += "</tr>";

                        _totalAmount1 += parseFloat(val.Amount) || 0;
                        _TotalCount1 += parseFloat(val.TestCount) || 0;
                        _TotalCash1 += parseFloat(val.CashAmount) || 0;
                        _TotalCredit1 += parseFloat(val.CreditAmount) || 0;
                        _TotalShareAmount1 += parseFloat(val.ShareAmount) || 0;
                    });
                    $("#tblProReport tbody").append(tbody2);
                    var str3 = "<table id='tblProReport' style='width:100%;font-size:12px' class='table table-bordered'>";
                    str3 += "<tr>";
                    str3 += "<td style='text-align:right;width:50%' colspan='5'><b>Grand Total:</b></td>";
                    str3 += "<td style='text-align:center;width:10%'><b>" + _TotalCount1.toFixed(2) + "</b></td>";
                    str3 += "<td style='text-align:center;width:10%'><b>" + _totalAmount1.toFixed(2) + "</b></td>";
                    str3 += "<td style='text-align:center;width:10%'><b>" + _TotalCash1.toFixed(2) + "</b></td>";
                    str3 += "<td style='text-align:center;width:10%'><b>" + _TotalCredit1.toFixed(2) + "</b></td>";
                    str3 += "<td style='text-align:center;width:10%'><b>" + _TotalShareAmount1.toFixed(2) + "</b></td>";
                    str3 += "</tr>";
                    str3 += "</table>";
                    $('#divTotalPro').html(str3);
                    $("#btnget").removeClass('i').find('.fa-spinner').remove();
                }
            }
            else {
                alert("Error");
            };
        },
        error: function (response) {
            alert('Server Error...!');
        }
    });
}

function onchartList() {
    var url = config.baseUrl + "/api/GeneralStore/ReportQueries";
    var objBO = {};
    objBO.UnitId = '-';
    objBO.ObservationId = '-';
    objBO.From = $("#txtfrom").val();
    objBO.to = $("#txtto").val();
    objBO.Logic = 'LineChartReport';
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            console.log(data);
            //if (data.ResultSet && data.ResultSet.Table && data.ResultSet.Table.length > 0) {
            //    debugger
            //    let row = data.ResultSet.Table[0]; // since you have only one row
            //    let xValues = Object.keys(row);    // ["TestCount","Amount","CashAmount","CreditAmount","ShareAmount"]
            //    let yValues = Object.values(row);  // [1, 430.00, 430.00, 430.00, 0.00]
            //    new Chart("myChart", {
            //        type: "line",
            //        data: {
            //            labels: xValues,   // column names
            //            datasets: [{
            //                label: "Values",
            //                data: yValues,
            //                borderColor: "green",
            //                //lineTension: 0,
            //                fill: false

            //            }]
            //        },
            //        options: {
            //            legend: { display: false },
            //            scales: {
            //                yAxes: [{
            //                    ticks: {
            //                        beginAtZero: true
            //                    }
            //                }]
            //            }
            //        }
            //    });
            //} else {
            //    alert("No Data Found");
            //}

            if (data.ResultSet && data.ResultSet.Table && data.ResultSet.Table.length > 0) {
                let rows = data.ResultSet.Table;   // All records
                let datasets = [];
                let xValues = Object.keys(rows[0]); // ["TestCount","Amount","CashAmount","CreditAmount","ShareAmount"]    // X-axis = column names
                let colors = ["#a6cee3", "#b2df8a", "#1f78b4", "#fddf84", "#8467D7", "brown"];    // Colors for lines
                rows.forEach((row, i) => { // Each row becomes one dataset (line)
                    let yValues = Object.values(row); // values from that row
                    datasets.push({
                        label: "Row " + (i + 1),   // Row 1, Row 2...
                        data: yValues,
                        backgroundColor: colors[i % colors.length], // unique color for this dataset
                        borderColor: colors[i % colors.length],
                        borderRadius: 50,  
                        borderWidth: 1
                    });
                });
                new Chart("myChart", {
                    type: "bar",
                    data: { 
                        labels: xValues,   // X-axis = column names
                        datasets: datasets
                    },
                    options: {
                        legend: { display: false }, // show Row1, Row2... in legend off
                        scales: {
                            yAxes: [{
                                ticks: { beginAtZero: true }
                            }]
                        }
                    }
                });
            } else {
                alert("No Data Found");
            }

        },
        error: function () {
            alert('Server Error...!');
        }
    });
}

  