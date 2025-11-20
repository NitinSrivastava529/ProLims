$(document).ready(function () {
    FillCurrentDate("txtfrom");
    FillCurrentDate("txtto");
    OnloadList();
});
function OnloadList() {
    $("#tblUnit tbody").empty();
    $("#tblObservation tbody").empty();
    var url = config.baseUrl + "/api/GeneralStore/ReportQueries";
    var objBO = {};
    objBO.Logic = 'GetUnitAndObservation';
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            var tbody = ""; var tbody1 = "";
            if (Object.keys(data.ResultSet).length) {
                if (Object.keys(data.ResultSet.Table).length) {
                    $.each(data.ResultSet.Table, function (key, val) {
                        tbody1 += "<tr>";
                        tbody1 += "<td>" + val.Unit_Code + "</td>";
                        tbody1 += "<td>" + val.unit_name + "</td>";
                        tbody1 += "<td style='text-align:center'><button type='button' data-unitcode='" + val.Unit_Code + "' data-unitname='" + val.unit_name + "' class='btn btn-success' onclick='AddUnit(this)' style='padding: 1px 5px;'>Add</button></td>";
                        tbody1 += "</tr>";
                    });
                    $("#tblUnit tbody").append(tbody1);

                }
                if (Object.keys(data.ResultSet.Table1).length) {
                    $.each(data.ResultSet.Table1, function (key, val) {
                        tbody += "<tr>";
                        tbody += "<td>" + val.testid + "</td>";
                        tbody += "<td>" + val.TestName + "</td>";
                        tbody += "<td style='text-align:center'><button type='button' data-testid='" + val.testid + "' data-testname='" + val.TestName + "' class='btn btn-success' onclick='AddObservation(this)' style='padding: 1px 5px;'>Add</button></td>";
                        tbody += "</tr>";
                    });
                    $("#tblObservation tbody").append(tbody);

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
function DownloadExcel(elem, logicname) {
    var unitlist = []; var ObservationList = [];
    var isEmpty = true; var isEmptytest = true;
    $('#tblUnitInfo tbody tr').each(function () {
        isEmpty = false;
        unitlist.push($(this).find('td:eq(0)').data('unitcode'));
    });
    if (isEmpty) {
        alert("Please Add at least one Unit Name.");
        $('#tblUnitInfo').focus();
        return;
    }
    $('#tblObservationInfo tbody').find('tr').each(function () {
        isEmptytest = false;
        ObservationList.push($(this).find('td:eq(0)').data('testid'));
    });
    if (isEmptytest) {
        alert("Please Add at least one Observation Name.");
        $('#tblObservationInfo').focus();
        return;
    }
    var url = config.baseUrl + "/api/GeneralStore/ReportQueries";
    var objBO = {};
    objBO.UnitId = unitlist.join(',');
    objBO.ObservationId = ObservationList.join(',');
    objBO.From = $("#txtfrom").val();
    objBO.to = $("#txtto").val();
    objBO.OutPutType = 'Excel';
    objBO.Logic = logicname;
    Global_DownloadExcel(url, objBO, "TestPerformReport.xlsx", elem);
}
function Global_DownloadExcel(Url, objBO, fileName, elem) {
    $(elem).append("<i class='fa fa-spinner fa-spin' style='font-size:20px;float:left'></i>");
    var ajax = new XMLHttpRequest();
    ajax.open("Post", Url, true);
    ajax.responseType = "blob";
    ajax.setRequestHeader("Content-type", "application/json")
    ajax.onreadystatechange = function () {
        if (this.readyState == 4) {
            var blob = new Blob([this.response], { type: "application/octet-stream" });
            saveAs(blob, fileName); //refernce by ~/JsModule/FileSaver.min.js
            $(elem).removeClass('i').find('.fa-spinner').remove();

        }
    };
    ajax.send(JSON.stringify(objBO));
} 
function AddUnit(element) {
    if (element == "") {
        var body1 = "";
        $('#tblUnit tbody tr').each(function () {
            var Unitcode = $(this).find('td:eq(0)').text().trim();
            var UnitName = $(this).find('td:eq(1)').text().trim();
            body1 += "<tr>";
            body1 += "<td style='padding:2px;' data-unitcode='" + Unitcode + "'>" + Unitcode + "</td>";
            body1 += "<td style='padding:2px;'>" + UnitName + "</td>";
            body1 += "<td style='width:5%;text-align:center'><button onclick='deleteRow(this)' class='btn-danger'><i class='fa fa-remove'></i></button></td>";
            body1 += "</tr>";
        });
        $('#tblUnitInfo tbody').append(body1);
    }
    else {
        var Unitcode = $(element).data('unitcode');
        var UnitName = $(element).data('unitname');
        selectRow($(element))
        var exists = $('#tblUnitInfo tbody tr td[data-unitcode="' + Unitcode + '"]').length > 0
        if (!exists) {
            var body1 = "";
            body1 += "<tr>";
            body1 += "<td style='padding:2px;' data-unitcode='" + Unitcode + "'>" + Unitcode + "</td>";
            body1 += "<td style='padding:2px;'>" + UnitName + "</td>";
            body1 += "<td style='width:5%;text-align:center'><button onclick='deleteRow(this)' class='btn-danger'><i class='fa fa-remove'></i></button></td>";
            body1 += "</tr>";
            $('#tblUnitInfo tbody').append(body1);
        }
        else {
            alert("This Unit Name is already added!");
        }
    }
   
   
}
function deleteRow(el) {
    $(el).closest('#tblUnitInfo tbody tr').remove();
}
function AddObservation(element) {
    var body1 = "";
    if (element == "") {
        $('#tblObservation tbody tr').each(function () {
            var testcode = $(this).find('td:eq(0)').text().trim();
            var testName = $(this).find('td:eq(1)').text().trim();
            body1 += "<tr>";
            body1 += "<td style='padding:2px;' data-testid='" + testcode + "'>" + testcode + "</td>";
            body1 += "<td style='padding:2px;'>" + testName + "</td>";
            body1 += "<td style='width:5%;text-align:center'><button onclick='deleteRowtest(this)' class='btn-danger'><i class='fa fa-remove'></i></button></td>";
            body1 += "</tr>";
        });
        $('#tblObservationInfo tbody').append(body1);
    }
    else {
        selectRow($(element));
        var testid = $(element).data('testid');
        var testname = $(element).data('testname');
        var exists = $('#tblObservationInfo tbody tr td[data-testid="' + testid + '"]').length > 0;
        if (!exists) {
            body1 += "<tr>";
            body1 += "<td style='padding:2px;' data-testid='" + testid + "'>" + testid + "</td>";
            body1 += "<td style='padding:2px;'>" + testname + "</td>";
            body1 += "<td style='width:5%;text-align:center'><button onclick='deleteRowtest(this)' class='btn-danger'><i class='fa fa-remove'></i></button></td>";
            body1 += "</tr>";
            $('#tblObservationInfo tbody').append(body1);
        } else {
            alert("This Observation Name is already added!");
        }
    }
    
}
function deleteRowtest(el) {
    $(el).closest('#tblObservationInfo tbody tr').remove();
}
