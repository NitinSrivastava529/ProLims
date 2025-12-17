var _visitNo = "";
$(document).ready(function () {
    FillCurrentDate('txtDate')
});

function SelectPatient() {
    $("#divFormBody input").val('')
    $("#divFormBody").removeClass('Inactive');
    if ($("#ddlPatient option:selected").val() == 'New') {

        $("#txtUHID").val($("#ddlPatient option:selected").val());
    }
    else {
        var val = JSON.parse($("#ddlPatient option:selected").val());
        $("#txtUHID").val(val.UHID);
        $("#txtPatientName").val(val.patient_name);
        $("#ddlGender").val(val.gender);
        $("#txtAge").val(val.age);
        $("#ddlAgeType").val(val.age_type);
    }
}
function PatientInfo() {
    if ($('#ddlGlobalClientId option:selected').val() == 'Select') {
        alert('Please Select Client')
        return
    }
    $('#patientInfo').empty();
    var url = config.baseUrl + "/api/Patient/B2B_PatientQueries";
    var objBO = {};
    objBO.unitId = 'CH01';
    objBO.compId = '-';
    objBO.clientId = $('#ddlGlobalClientId option:selected').val();
    objBO.from = $('#txtDate').val();
    objBO.to = '1900/01/01';
    objBO.Prm1 = $('#ddlStatus option:selected').text();
    objBO.Prm2 = '-';
    objBO.Prm3 = '-';
    objBO.loginId = localStorage.getItem('jsEmpCode');
    objBO.Logic = "Collection:Pending";
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            if (data.ResultSet.Table.length > 0) {
                var html = "";
                $.each(data.ResultSet.Table, function (key, val) {
                    html += "<div class='patient-box'>";
                    html += "<table class='table tblPatient'>";
                    html += "<tr>";
                    html += "<th>Date</th>";
                    html += "<th>:</th>";
                    html += "<td>" + val.RegDate + "</td>";
                    html += "<td>&nbsp;</td>";
                    html += "<th>IPOP No</th>";
                    html += "<th>:</th>";
                    html += "<td>" + val.ipop_no + "</td>";
                    html += "</tr>";
                    html += "<tr>";
                    html += "<th>Visit No</th>";
                    html += "<th>:</th>";
                    html += "<td>" + val.VisitNo + "</td>";
                    html += "<td>&nbsp;</td>";
                    html += "<th>Age</th>";
                    html += "<th>:</th>";
                    html += "<td>" + val.age + "</td>";
                    html += "</tr>";
                    html += "<tr>";
                    html += "<th>Name</th>";
                    html += "<th>:</th>";
                    html += "<td colspan='3'>" + val.Patient_name + "</td>";
                    html += "<td>&nbsp;</td>";
                    html += "<th><span class='pending'><i class='fa fa-clock-o'></i> " + val.Pending + "</span><button onclick=PendingSample('" + val.VisitNo + "') class='btn btn-warning btn-sm'><i class='fa fa-eye'>&nbsp;</i>Collect</button></th>";
                    html += "</tr>";
                    html += "</table>";
                    html += "</div>";
                });
                $('#patientInfo').append(html);
            }
        },
        error: function (response) {
            alert('Server Error...!');
        }
    });
}
function PendingSample(visitNo) {
    _visitNo = visitNo;
    $("#tblSample tbody").empty();
    var url = config.baseUrl + "/api/Patient/B2B_PatientQueries";
    var objBO = {};
    objBO.unitId = Active.unitId;
    objBO.compId = Active.compId;
    objBO.clientId = $('#ddlGlobalClientId option:selected').val();
    objBO.from = '1900/01/01';
    objBO.to = '1900/01/01';
    objBO.Prm1 = visitNo;
    objBO.Prm2 = '-';
    objBO.Prm3 = '-';
    objBO.loginId = localStorage.getItem('jsEmpCode');
    objBO.Logic = "Collection:PendingSample";
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (data) {    
            if (data.ResultSet.Table.length > 0) {
                var tbody = "";
                $.each(data.ResultSet.Table1, function (key, val) {
                    tbody += '<tr>';
                    tbody += '<td class="hide">' + val.AutoTestId + '</td>';
                    tbody += '<td>' + val.ItemId + '</td>';
                    tbody += '<td>' + val.ItemName + '..</td>';
                    tbody += '<td><select>';
                    $.each(data.ResultSet.Table, function (key, value) {
                        tbody += '<option value=' + value.sampl_code + '>' + value.sample_name + '</option>';
                    });
                    tbody += '</select></td>';
                    tbody += "<td><input type='text' value='" + val.barcodeNo + "' style='width:100%'/></td>";
                    tbody += '</tr>';
                });
                $("#tblSample tbody").append(tbody);
                $('#modelCollect').modal('show')
            }
            if (Object.keys(data.ResultSet).length > 0) {
                if (Object.keys(data.ResultSet.Table2).length > 0) {
                    $.each(data.ResultSet.Table2, function (key, val) {
                        $("#txtVUHID").text(val.UHID);
                        $("#txtVIPOPNo").text(val.ipop_no);
                        $("#txtVVisitNo").text(val.VisitNo);
                        $("#txtVAge").text(val.age);
                        $("#txtVName").text(val.Patient_name);
                    });
                }
            }
        },
        error: function (response) {
            alert('Server Error...!');
        }
    });
}

function PayInit() {
    $('#modelPay').modal('show');
    var total = [...$('#tblSelectedTest tbody tr').map((k, v) => $(v).find('td:eq(3)').text())].reduce((a, b) => eval(a) + eval(b));
    $('#txtAllTotal').val(total);
    $('#txtAllDiscount').val(0);
    $('#txtAllNet').val(total);
    $('#tblPayment tbody tr.pay:first input:first').val(total);
}

function Collect() {
    if (confirm('Are you sure to Collect?')) {
        // var waiting = "<img src='/content/img/waiting.gif' style='width:15px'/>&nbsp;Submitting.."
        //$('#btnSubmit').html(waiting).prop('disabled', true);
        var url = config.baseUrl + "/api/Patient/Diag_SampleCollection";
        var obj = [];
        $('#tblSample tbody tr').each(function () {
            if ($(this).find('td:eq(4) input').val().length > 4) {
                obj.push({
                    'VisitNo': _visitNo,
                    'ClientId': $('#ddlGlobalClientId option:selected').val(),
                    'login_id': localStorage.getItem('jsEmpCode'),
                    'Prm1': $(this).find('td:eq(3) select option:selected').text(),
                    'Logic': 'SampleCollect',
                    'AutoTestId': $(this).find('td:eq(0)').text(),
                    'testcode': $(this).find('td:eq(1)').text(),
                    'sampleName': $(this).find('td:eq(3) select option:selected').text(),
                    'BarcodeNo': $(this).find('td:eq(4) input').val(),
                    'VialQty': 1
                });
            }
        });
        $.ajax({
            method: "POST",
            url: url,
            data: JSON.stringify(obj),
            dataType: "json",
            contentType: "application/json;charset=utf-8",
            success: function (data) {
                if (data.includes('Success')) {
                    alert(data);
                    $('#tblSample tbody').empty();
                    $("#txtVUHID").text('-');
                    $("#txtVIPOPNo").text('-');
                    $("#txtVVisitNo").text('-');
                    $("#txtVAge").text('-');
                    $("#txtVName").text('-');
                    $('#modelCollect').modal('hide')

                    PatientInfo();
                }
                else {
                    alert(data);
                }
            },
            error: function (response) {
                alert('Server Error...!');
            }
        });
    }
}