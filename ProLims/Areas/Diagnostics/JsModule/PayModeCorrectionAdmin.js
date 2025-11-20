var BankName = [];
var MachineName = [];
$(document).ready(function () {
    GetBankAndMachineInfo();
});
function GetBankAndMachineInfo() {
    var url = config.baseUrl + "/api/Service/diag_PayModeCorrectionQueries";
    var objBO = {};
    objBO.prm_1 = '-';
    objBO.Logic = 'GetBankAndMachineInfo';
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        contentType: 'application/json;charset=utf-8',
        dataType: "JSON",
        success: function (data) {
            //BankName = data.ResultSet.Table;
            MachineName = data.ResultSet.Table;
            //$.each(data.ResultSet.Table, function (key, val) {
            //    BankName += "<option value=" + val.BankId + ">" + val.BankName + "</option>";
            //})
            //$.each(data.ResultSet.Table1, function (key, val) {
            //    MachineName += "<option value=" + val.machineId + ">" + val.machineName + "</option>";
            //})
        },
        error: function (response) {
            alert('Server Error...!');
        }
    });
}
function GetPaymentInfo() {
    $('#tblReceiptInfo tbody').empty();
    if ($('#txtReceiptNo').val() == '') {
        alert('Please Provide Receipt No.')
        return
    }
    var url = config.baseUrl + "/api/Service/diag_PayModeCorrectionQueries";
    var objBO = {};
    objBO.prm_1 = $('#txtReceiptNo').val();
    objBO.Logic = 'GetPaymentInfo';
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        contentType: 'application/json;charset=utf-8',
        dataType: "JSON",
        success: function (data) {
            if (Object.keys(data.ResultSet).length > 0) {
                if (Object.keys(data.ResultSet.Table).length > 0) {
                    $.each(data.ResultSet.Table, function (key, val) {
                        $('#txtUHID').text(val.UHID);
                        $('#txtIPOPNo').text(val.ipop_no);
                        $('#txtPatientName').text(val.patient_name);
                        $('#txtReceiptDate').text(val.receiptDate);
                        $('#txtReceiptType').text(val.ReceiptType);
                        $('#txtTotalAmount').text(val.totalAmount);
                    });
                }
            }
            if (data.ResultSet.Table1.length > 1)
                $('#btnSwapAmt').prop('disabled', false);
            else
                $('#btnSwapAmt').prop('disabled', true);


            if (Object.keys(data.ResultSet).length > 0) {
                if (Object.keys(data.ResultSet.Table1).length > 0) {
                    var tbody = "";
                    var payMode = ['Cash', 'Swipe Card', 'Online']
                    $.each(data.ResultSet.Table1, function (key, val) {
                        tbody += "<tr>";
                        tbody += "<td><select class='form-control'>";
                        for (var i = 0; i < payMode.length; i++) {
                            tbody += (val.PayMode == payMode[i]) ? "<option selected>" + payMode[i] : "<option>" + payMode[i];
                        }
                        tbody += "</select></td>";
                        tbody += "<td>" + val.Amount + "</td>";
                        tbody += "<td>INR</td>";
                        tbody += "<td><input type='text' class='form-control' value='" + val.RefNo + "'/></td>";
                        tbody += "<td><select class='form-control'>";
                        for (var k = 0; k < MachineName.length; k++) {
                            tbody += (val.MachineName == MachineName[k].machineName) ? "<option selected value=" + MachineName[k].machineId + ">" + MachineName[k].machineName : "<option value=" + MachineName[k].machineId + ">" + MachineName[k].machineName
                        }
                        tbody += "</select></td>";
                        tbody += "<td><button onclick=Correction(this) data-logic='CorrectionAdmin' class='btn btn-success bt-xs'><i class='fa fa-sign-in'>&nbsp;</i>Submit</button></td>";
                        tbody += "<td hidden>" + val.auto_id + "</td>";
                        tbody += "</tr>";
                    });
                    $('#tblReceiptInfo tbody').append(tbody);
                }
                else {
                    alert('Receipt Already Cancelled or Not Found.')
                }
            }

        },
        error: function (response) {
            alert('Server Error...!');
        }
    });
}
function Cancel(elem) {
    if (confirm('Are you sure to Cancel?')) {
        $(elem).closest('tr').addClass('canceled');
    }
}
function Correction(elem) {
    if (confirm('Are you sure?')) {
        if ($('#txtReceiptNo').val() == '') {
            alert('Please Provide Receipt No.')
            return
        }
        if ($('#tblReceiptInfo tbody tr:not(.canceled)').length == 0) {
            alert('Receipt Info Not Found')
            return
        }
        var url = config.baseUrl + "/api/Service/diag_InsertPayModeCorrection";
        var obj = [];
        obj.push({
            'hosp_id': Active.unitId,
            'ReceiptNo': $('#txtReceiptNo').val(),
            'PayMode': $(elem).closest('tr').find('td:eq(0)').find('select option:selected').text(),
            'CardNo': $(elem).closest('tr').find('td:last').text(),
            'BankName': '-',
            'RefNo': $(elem).closest('tr').find('td:eq(3)').find('input[type=text]').val(),
            'MachineId': $(elem).closest('tr').find('td:eq(4)').find('select option:selected').val(),
            'MachineName': $(elem).closest('tr').find('td:eq(4)').find('select option:selected').text(),
            'Amount': ($(elem).data('logic') != 'SwapAmount') ? $(elem).closest('tr').find('td:eq(1)').text() : 0,
            'OnlPaymentId': '',
            'OnlPayStatus': '',
            'OnlPayResponse': '',
            'OnlPaymentDate': '1900/01/01',
            'login_id': Active.userId,
            'Logic': $(elem).data('logic')
        });
        $.ajax({
            method: "POST",
            url: url,
            data: JSON.stringify(obj),
            contentType: 'application/json;charset=utf-8',
            dataType: "JSON",
            success: function (data) {
                if (data.includes('Success')) {
                    GetPaymentInfo()
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