var _DispatchNo = "";
$(document).ready(function () {
    GetClientListUnitWise();
    FillCurrentDate('txtFrom');
    FillCurrentDate('txtTo');
    CloseSidebar();
});
function CloseSidebar() {
    $('html').attr('data-toggled', 'icon-overlay-close');
}
function GetClientListUnitWise() {
    var url = config.baseUrl + "/api/B2BClient/diag_SampleLabReceivingQueries";
    var objBO = {};
    objBO.from = '1900/01/01';
    objBO.to = '1900/01/01';
    objBO.unitId = Active.unitId;
    objBO.logic = "ClientList";
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            if (Object.keys(data.ResultSet).length > 0) {
                if (Object.keys(data.ResultSet.Table).length > 0) {
                    $("#ddlclient").append($("<option></option>").val("0").html("Select"));
                    $.each(data.ResultSet.Table, function (key, value) {
                        $("#ddlclient").append($("<option></option>").val(value.ClientId).html(value.ClientName)).select2();
                    });
                }
            }
            else {
                alert('No Data Found')
            }
        },
        error: function (response) {
            alert('Server Error...!');
        }
    });
}
function GetDispatchInfoByDate() {
    if ($('#ddlclient option:selected').val() == '0') {
        alert("Please Select Client Name");
        return;

    }
    var url = config.baseUrl + "/api/B2BClient/diag_SampleLabReceivingQueries";
    var objBO = {}
    objBO.from = $('#txtFrom').val();
    objBO.to = $('#txtTo').val();
    objBO.ClientId = $('#ddlclient option:selected').val();
    objBO.Logic = "GetDispatchInfoToReceiveByDate";
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            $('#tblDispatch tbody').empty();
            var tbody = '';
            var count = 0;
            if (Object.keys(data.ResultSet).length > 0) {
                if (Object.keys(data.ResultSet.Table).length > 0) {
                    $.each(data.ResultSet.Table, function (key, val) {
                        count++;
                        tbody += "<tr>";
                        tbody += "<td>" + count + "</td>";
                        tbody += "<td>" + val.DispatchUnit + "</td>";
                        tbody += "<td>" + val.DispatchNo + "</td>";
                        tbody += "<td>" + val.dispatch_date + "</td>";
                        tbody += "<td>" + val.TotalCount + "</td>";
                        tbody += "<td>" + val.tReceived + "</td>";
                        tbody += "<td>" + val.rcvStatue + "</td>";
                        tbody += "<td><button class='btn-success' onclick=GetPatientDispatch('" + val.DispatchNo + "')>View</button></td>";
                        tbody += "</tr>";


                    });
                    $('#tblDispatch tbody').append(tbody);
                }
            }
            else {
                alert('No Data Found')
            }
        },
        error: function (response) {
            alert('Server Error...!');
        }
    });
}
function GetPatientDispatch(DispatchNo) {
    _DispatchNo = DispatchNo;
    var url = config.baseUrl + "/api/B2BClient/diag_SampleLabReceivingQueries";
    var objBO = {}
    objBO.from = '1900/01/01';
    objBO.to = '1900/01/01';
    objBO.DispatchNo = _DispatchNo;
    objBO.Logic = "GetPatientInDispatch";
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            $('#tblPatientDetail tbody').empty();
            var tbody = '';
            var count = 0;
            if (Object.keys(data.ResultSet).length > 0) {
                if (Object.keys(data.ResultSet.Table).length > 0) {
                    $.each(data.ResultSet.Table, function (key, val) {
                        count++;
                        if (val.PC == 0)
                            tbody += "<tr>";
                        else
                            tbody += "<tr style='background-color:lightGreen'>";                            

                        tbody += "<td style='width:5%;'>" + count + "</td>";
                        tbody += "<td>" + val.DispatchNo + "</td>";
                        tbody += "<td>" + val.VisitNo + "</td>";
                        tbody += "<td>" + val.barcodeNo + "</td>";
                        tbody += "<td>" + val.patient_name + "</td>";
                        tbody += "<td>" + val.RegDate + "</td>";
                        tbody += "<td>" + val.gender + "</td>";
                        tbody += "<td style='width:30%;'>" + val.TestDeetail + "</td>";
                        tbody += "<td style='width:5%;'>" + val.TC + "</td>";
                        tbody += "<td style='width:5%;'>" + val.PC + "</td>";
                        tbody += "<td style='width:5%;'>" + val.PushResult + "</td>";
                        tbody += "</tr>";
                    });
                    $('#tblPatientDetail tbody').append(tbody);

                }
            }
            else {
                alert('No Data Found')
            }
        },
        error: function (response) {
            alert('Server Error...!');
        }
    });
}
function PushHospitalDataToLIS() {
    var VisitNos = "";
    $('#tblPatientDetail tbody tr').each(function () {
        if ($(this).find('td:eq(6)').text() != "0")
            VisitNos = VisitNos + $(this).find('td:eq(2)').text() + "|";
    });
    if (VisitNos.length < 5) {
        alert("No Pendency Found all Sent");
        return;
    }
    var url = config.baseUrl + "/api/B2BClient/PushJenaSekhoDataToLIS";
    var objBO = {}
    objBO.DispatchNo = _DispatchNo;
    objBO.from = '1900/01/01';
    objBO.to = '1900/01/01';
    objBO.VisitNo = VisitNos;
    objBO.Logic = "GetOutSourceRecord";
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            alert(data);
            GetPatientDispatch(_DispatchNo);
        },
        error: function (response) {
            alert('Server Error...!');
        }
    });
}




