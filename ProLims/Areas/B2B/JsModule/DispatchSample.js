$(document).ready(function () {
    FillCurrentDate('txtDate');
});
function GetPendencyForDispatch() {
    $('#tblDispatchInfo tbody').empty();
    var url = config.baseUrl + "/api/Patient/B2B_PatientQueries";
    var objBO = {};
    objBO.unitId = 'CH01';
    objBO.compId = 'CH01';
    objBO.clientId = $('#ddlGlobalClientId option:selected').val();
    objBO.from = $('#txtDate').val();
    objBO.to = '1900/01/01';
    objBO.Prm1 = '-';
    objBO.Prm2 = '-';
    objBO.Prm3 = '-';
    objBO.loginId = localStorage.getItem('jsEmpCode');
    objBO.Logic = "GetPendencyForDispatch";
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            if (data.ResultSet.Table.length > 0) {
                $.each(data.ResultSet.Table, function (key, val) {
                    $('#txtTotalPatient').text(val.totalPatient);
                    $('#txtTotalScannedPendency').text(val.totalSampleCollected);
                    $('#txtTotalDispatched').text(val.totalPatient-val.totalSampleCollected);
                });
                var tbody = '';
                $.each(data.ResultSet.Table1, function (key, val) {
                    tbody += "<tr>";
                    tbody += "<td>" + val.dispatchNo + "</td>";
                    tbody += "<td>" + val.dispatchdate + "</td>";
                    tbody += "<td>" + val.totalRecord + "</td>";
                    tbody += "</tr>";
                });
                $('#tblDispatchInfo tbody').append(tbody);
            }
        },
        error: function (response) {
            alert('Server Error...!');
        }
    });
}
function DispatchSample() {
    if (!confirm('are you sure?')) return
    var url = config.baseUrl + "/api/Patient/Diag_SampleCollection";
    var obj = [];
    obj.push({
        'VisitNo': '-',
        'UnitId': 'CH01',
        'ClientId': localStorage.getItem('ActiveClient'),
        'Prm1': $('#txtDate').val(),
        'login_id': localStorage.getItem('jsEmpCode'),
        'Logic': 'Dispatch',
        'AutoTestId': 0,
        'testcode': '-',
        'sampleName': '-',
        'BarcodeNo': '-',
        'VialQty': 1
    });
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(obj),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (data) {          
            if (data.includes('Success')) {
                GetPendencyForDispatch();
                alert(data)
            }
        },
        error: function (response) {
            alert('Server Error...!');
        }
    });
}
