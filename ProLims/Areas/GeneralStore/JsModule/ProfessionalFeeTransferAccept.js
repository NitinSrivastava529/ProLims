$(document).ready(function () {
    FillCurrentDate("txtFrom");
    FillCurrentDate("txtTo");
    $("#txtSearch").on("keyup", function () {
        var value = $(this).val().toLowerCase();
        $("#tblReportInfo tbody tr").filter(function () {
            $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
        });
    });
    CloseSidebar();
});

function CloseSidebar() {
    $('html').attr('data-toggled', 'icon-overlay-close');
}
function GetApproveList(elem) {
    $(elem).prop('disabled', true).append(" <i class='fa fa-spinner fa-spin' style='float:left'></i>");
    $("#tblReportInfo tbody").empty();
    var url = config.baseUrl + "/api/GeneralStore/Diag_ProfessionalFeesDoctorQueries";
    var objBO = {};
    objBO.UnitId = Active.unitId;
    objBO.from = $("#txtFrom").val();
    objBO.to = $("#txtTo").val();
    objBO.Prm1 = $("#ddlReport option:selected").val();
    objBO.Logic = 'GetProfessionalTransferApproveList';
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
                            tbody += "<td colspan='9'></td>";
                            tbody += "</tr>";
                            temp = val.BookingUnitId

                        }
                        if (temp1 != val.DoctorName) {
                            tbody += "<tr style='background:#d5e7f5;' class='dt'>";
                            tbody += "<td colspan='3'><b> Doctor Id : " + val.DoctorId + "</b>,<b> Doctor Name : " + val.DoctorName + "</b></td>";
                            tbody += "<td style='font-size:13px;text-align: right;'><b>Doctor Wise Total Amount</b></td>";
                            tbody += "<td style='font-size:13px;text-align:center;'><b><label>0</label></b></td>";
                            if (val.Acceptflag == "Y") {
                                tbody += '<td>-</td>';
                            }
                            else {
                                tbody += '<td colspan="9">' +
                                    '<button class="btn btn-success" data-doctorid="' + val.DoctorId + '" style="height:25px;padding:1px 5px;float:right" onclick="MultipleAccept(this)"><i class="fa fa-check"></i>&nbsp;Accept</button>' +
                                    '</td>';
                            }


                            tbody += "</tr>";
                            temp1 = val.DoctorName
                        }
                        if (val.Acceptflag == "Y") {
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
                        tbody += "<td>" + val.ApprovedBy + "</td>";
                        tbody += "<td>" + val.ApprovedDate + "</td>";
                        tbody += "<td>" + val.CancelBy + "</td>";
                        tbody += "<td>" + val.CancelDate + "</td>";
                        if (val.Acceptflag == "Y") {
                            tbody += '<td>-</td>';
                        }
                        else if (val.IsAproved == "X") {
                            tbody += '<td>-</td>';
                        }
                        else {
                            tbody += '<td style="width:5%;text-align:center;"><input id="chkshift"  data-autoid="' + val.AutoId + '" type="checkbox" class="shiftchk"> </td>';
                        }

                        tbody += "</tr>";
                    });
                    $("#tblReportInfo tbody").append(tbody);
                    $(elem).prop('disabled', true).removeClass('i').find('.fa-spinner').remove();
                    TotalCal();
                }
                else {
                    alert("Data Not Found..");
                    $(elem).prop('disabled', true).removeClass('i').find('.fa-spinner').remove();
                }

            }
            else {
                alert("Data Not Found..");
                $(elem).prop('disabled', true).removeClass('i').find('.fa-spinner').remove();
            };
        },
        error: function (response) {
            alert('Server Error...!');
            $(elem).prop('disabled', true).removeClass('i').find('.fa-spinner').remove();
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

function MultipleAccept(elem) {
    var objBO = {};
    var doctorRow = $(elem).closest('tr');
    var url = config.baseUrl + "/api/GeneralStore/Diag_ProfessionalFeeApproval";
    var checkAutoid = [];
    if (!confirm('Are you sure you want to Accept the data?')) {
        return;
    }
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
    objBO.prm_1 = '-';
    objBO.DoctorId = $(elem).data('doctorid');
    objBO.unit_id = Active.unitId;
    objBO.autoIds = checkAutoid.join('|');
    objBO.login_id = Active.userId;
    objBO.Logic = 'AcceptData';
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
                GetApproveList('');
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