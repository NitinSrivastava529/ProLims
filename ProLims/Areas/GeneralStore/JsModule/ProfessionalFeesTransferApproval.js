var CancelAutoid = [];
var CanceldoctorId = "";
$(document).ready(function () {
    FillCurrentDate("txtFrom");
    FillCurrentDate("txtTo");
    $("#txtSearch").on("keyup", function () {
        var value = $(this).val().toLowerCase();
        $("#tblReportInfo tbody tr").filter(function () {
            $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
        });
    });
    $("#tblReportInfo tbody").on('change', '.groupchk', function () {
        var group = $(this).data('group');
        var isChecked = $(this).is(':checked');
        $('input.shiftchk[data-group="' + group + '"]').prop('checked', isChecked);
    });
    Onload();
});

function Onload() {
    var url = config.baseUrl + "/api/GeneralStore/Diag_ProfessionalFeesDoctorQueries";
    var objBO = {};
    objBO.UnitId = Active.unitId;
    objBO.Logic = 'GetUnitInfo';
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        dataType: "json",
        async: false,
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            if (Object.keys(data.ResultSet).length) {
                if (Object.keys(data.ResultSet.Table).length) {
                    $('#ddlUnit').empty().append($('<option></option>').val('ALL').html('ALL')).select2();
                    $.each(data.ResultSet.Table, function (key, val) {
                        $("#ddlUnit").append($("<option></option>").val(val.UnitId).html(val.unit_name));
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
function GetTrasferList(elem) {
    $("#tblReportInfo tbody").empty();
    var url = config.baseUrl + "/api/GeneralStore/Diag_ProfessionalFeesDoctorQueries";
    var objBO = {};
    objBO.UnitId = $("#ddlUnit option:selected").val();
    objBO.from = $("#txtFrom").val();
    objBO.to = $("#txtTo").val();
    objBO.Prm1 = $("#ddlReport option:selected").val();
    objBO.Logic = 'GetProfessionalTransferList';
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            console.log(data);
            var tbody = ""; var temp1 = ""; var temp = "";
            if (Object.keys(data.ResultSet).length) {
                if (Object.keys(data.ResultSet.Table).length) {
                    $.each(data.ResultSet.Table, function (key, val) {
                        if (temp != val.BookingUnitId) {
                            tbody += "<tr class='pr' style='background:#d7d7d7;'>";
                            tbody += "<td colspan='3' style='padding: 7px;'><b> Unit Name : " + val.BookingUnitName + "</b></td>";
                            tbody += "<td style='font-size:13px;text-align: right;'><b>Unit Wise  Total  Amount</b></td>";
                            tbody += "<td style='font-size:13px;text-align:center;'><b><label>0</label></b></td>";
                            tbody += "<td colspan='7'></td>";
                            tbody += "</tr>";
                            temp = val.BookingUnitId

                        }
                        if (temp1 != val.DoctorName) {
                            tbody += "<tr style='background:#d5e7f5;' class='dt'>";
                            tbody += "<td colspan='3'><b> Doctor Id : " + val.DoctorId + "</b>,<b> Doctor Name : " + val.DoctorName + "</b></td>";
                            tbody += "<td style='font-size:13px;text-align: right;'><b>Doctor Wise Total Amount</b></td>";
                            tbody += "<td style='font-size:13px;text-align:center;'><b><label>0</label></b></td>";

                            tbody += '<td colspan="3">' +
                                '<div style="display: flex; align-items:center;float:right;width: 100%;">' +
                                '<select class="form-control ddlbank" style="width:40%;padding: 3px 5px;"><option value="Select">Select</option><option value="Cash">Cash</option><option value="Bank">Bank</option></select>' +
                                '<button class="btn btn-success" data-doctorid="' + val.DoctorId + '" style="height:25px;padding:1px 5px;margin-left: 10px;width:30%" onclick="MultipleApproval(this)"><i class="fa fa-check"></i>&nbsp;Approve</button>' +
                                '<button class="btn btn-danger" data-doctorid="' + val.DoctorId + '"  style="height:25px;padding:1px 5px; margin-left:10px;width:30%" onclick="ModalCancel(this)"><i class="fa fa-close"></i>&nbsp;Cancel</button>' +
                                '</div>' +
                                '</td>';
                            tbody += "<td style='font-size:13px;text-align:center;'><input type='checkbox' class='groupchk' data-group='" + val.DoctorId + "'></td>";
                            tbody += "</tr>";
                            temp1 = val.DoctorName
                        }
                        if (val.IsAproved == "Y") {
                            tbody += "<tr class='pt' style='background: #e0f7c6;'>";
                        }
                        else if (val.IsAproved == "X") {
                            tbody += "<tr class='pt' style='background: #f5d1d1;'>";
                        }
                        else {
                            tbody += "<tr class='pt'>";
                        }

                        tbody += "<td hidden>" + val.DoctorId + "</td>";
                        tbody += "<td hidden>" + val.ItemId + "</td>";
                        tbody += "<td hidden>" + val.Regdate + "</td>";
                        tbody += "<td hidden>" + val.BookingUnitId + "</td>";
                        tbody += "<td>" + val.VisitNo + "</td>";
                        tbody += "<td>" + val.Regdate + "</td>";
                        tbody += "<td>" + val.PatientName + "</td>";
                        tbody += "<td>" + val.ItemName + "</td>";
                        tbody += "<td style='text-align:center'>" + val.ProfFee + "</td>";
                        tbody += "<td>" + val.PaymentUnitName + "</td>";
                        tbody += "<td>" + val.TransferUser + "</td>";
                        tbody += "<td>" + val.TransferDate + "</td>";
                        if (val.IsAproved == "Y") {
                            tbody += '<td>-</td>';
                        }
                        else if (val.IsAproved == "X") {
                            tbody += '<td>-</td>';
                        }
                        else {
                            tbody += '<td style="width:5%;text-align:center;"><input  data-autoid="' + val.AutoId + '" class="shiftchk" data-group="' + val.DoctorId + '"type="checkbox"> </td>';
                        }

                        tbody += "</tr>";
                    });
                    $("#tblReportInfo tbody").append(tbody);
                    TotalCal();
                }
                else {
                    alert("Data Not Found..");
                }

            }
            else {
                alert("Data Not Found..");
            };
        },
        error: function (response) {
            alert('Server Error...!');
        }
    });
}
function TotalCal() {
    var tcount = 0;
    var count = 0;
    var count1 = 0;
    var doctorcount = 0;
    var amount = 0;
    var doctoramount = 0;
    $('#tblReportInfo tbody tr').each(function () {
        if ($(this).attr('class') == 'pt') {
            tcount++;
            amount += parseInt($(this).find('td:eq(8)').text());
            doctoramount += parseInt($(this).find('td:eq(8)').text());
            if (count == $('#tblReportInfo tbody tr.pr').length)
                $('#tblReportInfo tbody tr.pr:last').find('td:eq(2)').find('label').text(amount);
            $('#tblReportInfo tbody tr.dt:last').find('td:eq(2)').find('label').text(doctoramount);
        }
        if ($(this).attr('class') == 'pr') {
            count++;
            if (count > 1 && count <= $('#tblReportInfo tbody tr.pr').length) {
                $('#tblReportInfo tbody tr.pr').eq((count == 2) ? 0 : count - 2).find('td:eq(2)').find('label').text(amount);
                amount = 0;
            }
            else {
                $('#tblReportInfo tbody tr.pr:last').find('td:eq(2)').find('label').text(amount);
            }
        }
        if ($(this).attr('class') == 'dt') {
            doctorcount++;
            if (doctorcount > 1 && doctorcount <= $('#tblReportInfo tbody tr.dt').length) {
                $('#tblReportInfo tbody tr.dt').eq((doctorcount == 2) ? 0 : doctorcount - 2).find('td:eq(2)').find('label').text(doctoramount);
                doctoramount = 0;
            }
            else {
                $('#tblReportInfo tbody tr.dt:last').find('td:eq(2)').find('label').text(doctoramount);
            }
        }
    });


}
function MultipleApproval(elem) {
    var objBO = {};
    var doctorRow = $(elem).closest('tr');
    var bank = doctorRow.find('select.ddlbank').val();
    var url = config.baseUrl + "/api/GeneralStore/Diag_ProfessionalFeeApproval";
    var checkAutoid = [];
    var isBankInvalid = false;
    if (!confirm('Are you sure you want to Approve the data?')) {
        return;
    }
    if (bank === "Select") {
        alert("Please select Bank Name for this Doctor");
        isBankInvalid = true;
        return false;
    }
    if (isBankInvalid) return;
    doctorRow.nextUntil('.dt', '.pt').each(function () {
        var chk = $(this).find('input.shiftchk');
        if (chk.is(':checked')) {
            checkAutoid.push(chk.data('autoid'));
        }
    });
    if (checkAutoid.length === 0) {
        alert("Please check at least one checkbox for this Doctor.");
        return;
    }
    objBO.prm_1 = doctorRow.find('select.ddlbank').val();
    objBO.DoctorId = $(elem).data('doctorid');
    objBO.unit_id = Active.unitId;
    objBO.autoIds = checkAutoid.join('|');
    objBO.login_id = Active.userId;
    objBO.Logic = 'Approval';
    $(elem).prop('disabled', true).append(" <i class='fa fa-spinner fa-spin' style='float:left'></i>");
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            if (data.includes('Success')) {
                alert(data);
                $('input[type="checkbox"]').prop('checked', false);
                $(elem).prop('disabled', false).removeClass('i').find('.fa-spinner').remove();
                GetTrasferList('');
            }
            else {
                alert(data);
                $(elem).prop('disabled', false).removeClass('i').find('.fa-spinner').remove();
            }
        },
        error: function (response) {
            alert('Server Error...!');
            $(elem).prop('disabled', false).removeClass('i').find('.fa-spinner').remove();
        }
    });
}
function ModalCancel(elem) {
    $('#ModelCancel').modal('show');
    var CanceldoctorRow = $(elem).closest('tr');
    CanceldoctorId = $(elem).data('doctorid');
    CanceldoctorRow.nextUntil('.dt', '.pt').each(function () {
        var chk = $(this).find('input.shiftchk');
        if (chk.is(':checked')) {
            CancelAutoid.push(chk.data('autoid'));
        }
    });

}
function MultipleCancel(elem) {
    var objBO = {};
    var url = config.baseUrl + "/api/GeneralStore/Diag_ProfessionalFeeApproval";
    if (CancelAutoid.length === 0) {
        alert("Please check at least one checkbox for this Doctor.");
        return;
    }
    if ($("#txtCancel").val() == '') {
        alert("Enter Remark...");
        return
    }
    objBO.prm_1 = $("#txtCancel").val();
    objBO.DoctorId = CanceldoctorId;
    objBO.unit_id = Active.unitId;
    objBO.autoIds = CancelAutoid.join('|');
    objBO.login_id = Active.userId;
    objBO.Logic = 'CancelData';
    $(elem).prop('disabled', true).append(" <i class='fa fa-spinner fa-spin' style='float:left;font-size:15px'></i>");
    console.log(objBO);
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            if (data.includes('Success')) {
                alert(data);
                $('input[type="checkbox"]').prop('checked', false);
                $(elem).prop('disabled', false).removeClass('i').find('.fa-spinner').remove();
                GetTrasferList('');
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