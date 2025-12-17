var UnitName = [];
$(document).ready(function () {
    FillCurrentDate("txtFrom");
    FillCurrentDate("txtTo");
    Onload();
    GetUnit();
    $('#ddlTest').empty().append($('<option></option>').val('ALL').html('ALL')).select2();
    $("#txtSearch1").on("keyup", function () {
        var value = $(this).val().toLowerCase();
        $("#tblReportInfo tbody tr").filter(function () {
            $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
        });
    });
    $("#txtSearch").on("keyup", function () {
        var value = $(this).val().toLowerCase();
        $("#tblReport tbody tr").filter(function () {
            $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
        });
    });
    $("#chkallshift").change(function () {
        if (this.checked) {
            $(".shiftchk").each(function () {
                this.checked = true;
            })
        } else {
            $(".shiftchk").each(function () {
                this.checked = false;
            })
        }
    });
    $("#tblReport tbody").on("keyup", ".profFeeInput", function () {
        let amount = parseFloat($(this).closest('tr').find('td:eq(9)').text());
        let min = amount;
        let val = parseFloat($(this).val());
        if (val > min) {
            alert("Net Amount should be less than or equal");
            $(this).val('');
        }
    });
});

function Onload() {
    var url = config.baseUrl + "/api/GeneralStore/Diag_ProfessionalFeesDoctorQueries";
    var objBO = {};
    objBO.UnitId = Active.unitId;
    objBO.Logic = 'GetUnitWiseDoctorList';
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
                    $('#ddlDoctor').empty().append($('<option></option>').val('ALL').html('ALL')).select2();
                    $.each(data.ResultSet.Table, function (key, val) {
                        $("#ddlDoctor").append($("<option></option>").val(val.DoctorId).html(val.DoctorName));
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
function GetItemList() {
    var url = config.baseUrl + "/api/GeneralStore/Diag_ProfessionalFeesDoctorQueries";
    var objBO = {};
    objBO.UnitId = Active.unitId;
    objBO.DoctorId = $("#ddlDoctor option:selected").val();
    objBO.Logic = 'GetDoctorWiseItemList';
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
                    $('#ddlTest').empty().append($('<option></option>').val('ALL').html('ALL')).select2();
                    $.each(data.ResultSet.Table, function (key, val) {
                        $("#ddlTest").append($("<option></option>").val(val.ItemId).html(val.ItemName));
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
function GetUnit() {
    var url = config.baseUrl + "/api/GeneralStore/Diag_ProfessionalFeesDoctorQueries";
    var objBO = {};
    objBO.UnitId = Active.unitId;
    objBO.Logic = 'GetUnitList';
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        dataType: "json",
        async: false,
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            UnitName = data.ResultSet.Table;
        },
        error: function (response) {
            alert('Server Error...!');
        }
    });
}
function GetPendingList(elem) {
    $("#tblReport tbody").empty();
    $(elem).append("<i class='fa fa-spinner fa-spin' style='font-size:20px;float:left'></i>");
    var url = config.baseUrl + "/api/GeneralStore/Diag_ProfessionalFeesDoctorQueries";
    var objBO = {};
    objBO.UnitId = Active.unitId;
    objBO.from = $("#txtFrom").val();
    objBO.to = $("#txtTo").val();
    objBO.DoctorId = $("#ddlDoctor option:selected").val();
    objBO.ItemId = $("#ddlTest option:selected").val();
    objBO.Logic = 'GetPendingPaymentList';
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            console.log(data);
            var tbody = ""; var temp1 = "";
            if (Object.keys(data.ResultSet).length) {
                if (Object.keys(data.ResultSet.Table).length) {
                    $.each(data.ResultSet.Table, function (key, val) {
                        if (temp1 != val.DoctorName) {
                            tbody += "<tr style='background:#d5e7f5;'>";
                            tbody += "<td colspan='20'><b> Doctor Id : " + val.DoctorId + "</b>,<b> Doctor Name : " + val.DoctorName + "</b></td>";
                            tbody += "</tr>";
                            temp1 = val.DoctorName
                        }
                       
                        if (val.IsProfFeeApproved == "S") {
                            tbody += "<tr style='background-color:#fff4d2'>";
                        }
                        else if (val.IsProfFeeApproved == "Y") {
                            tbody += "<tr style='background-color:#d5f3b2'>";
                        }
                        else {
                            tbody += "<tr>";
                        }
                      
                        tbody += "<td hidden>" + val.DoctorId + "</td>";
                        tbody += "<td hidden>" + val.ItemId + "</td>";
                        tbody += "<td hidden>" + val.regDate + "</td>";
                        tbody += "<td>" + val.visitno + "</td>";
                        tbody += "<td>" + val.regdate1 + "</td>";
                        tbody += "<td>" + val.patientname + "</td>";
                        tbody += "<td>" + val.itemName + "</td>";
                        tbody += "<td style='text-align:center'>" + val.rate + "</td>";
                        tbody += "<td style='text-align:center'>" + val.disc + "</td>";
                        tbody += "<td style='text-align:center'>" + val.app_rate + "</td>";
                        tbody += "<td style='text-align:center'>" + val.ProFee + "</td>";
                        tbody += "<td><select class='form-control'>";
                        for (var k = 0; k < UnitName.length; k++) {
                            tbody += (Active.unitId == UnitName[k].UnitId) ? "<option selected value=" + UnitName[k].UnitId + ">" + UnitName[k].unit_name : "<option value=" + UnitName[k].UnitId + ">" + UnitName[k].unit_name
                        }
                        tbody += "</select></td>";
                        if (val.IsProfFeeApproved == "S") {
                            tbody += "<td style='width:10%;text-align:center'>-</td>"
                        }
                        else if (val.IsProfFeeApproved == "Y") {
                            tbody += "<td style='width:10%;text-align:center'>-</td>"
                        }
                        else
                        {
                            tbody += "<td style='width:10%;text-align:center'><button type='button' class='btn btn-success' onclick='ApproveData(this)'><span class='fa fa-sign-in'>&nbsp;</span>&nbsp;Transfer</button></td>"
                        }
                        ;
                        tbody += "</tr>";
                    });
                    $("#tblReport tbody").append(tbody);
                    $(elem).removeClass('i').find('.fa-spinner').remove();
                }
                else {
                    alert("Data Not Found..");
                    $(elem).removeClass('i').find('.fa-spinner').remove();
                }

            }
            else {
                alert("Data Not Found..");
                $(elem).removeClass('i').find('.fa-spinner').remove();
            };
        },
        error: function (response) {
            alert('Server Error...!');
            $(elem).removeClass('i').find('.fa-spinner').remove();
        }
    });
}
function ApproveData(elem) {
    selectRow(elem);
    $(elem).prop('disabled', true)
    var objBO = {};
    var url = config.baseUrl + "/api/GeneralStore/Diag_InsertProfessionalFeesTransfer";
    objBO.BookingUnitId = Active.unitId;
    objBO.DoctorId = $(elem).closest('tr').find('td:eq(0)').text();
    objBO.ItemId = $(elem).closest('tr').find('td:eq(1)').text();
    objBO.regDate = $(elem).closest('tr').find('td:eq(2)').text();
    objBO.VisitNo = $(elem).closest('tr').find('td:eq(3)').text();
    objBO.PatientName = $(elem).closest('tr').find('td:eq(5)').text();
    objBO.netAmount = $(elem).closest('tr').find('td:eq(9)').text();
    objBO.ProfFee = $(elem).closest('tr').find('td:eq(10)').text();
    objBO.PaymentUnitId = $(elem).closest('tr').find('td:eq(11) select').val();
    objBO.createdBy = Active.userId;
    objBO.Logic = "Insert";
    $(elem).append("<i class='fa fa-spinner fa-spin' style='font-size:20px;float:left'></i>");
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            if (data.includes('Success')) {
              //  alert(data);
                $(elem).removeClass('i').find('.fa-spinner').remove();
                GetPendingList('');
            }
            else {
                alert(data);
                $(elem).removeClass('i').find('.fa-spinner').remove();
                $(elem).prop('disabled', false)
            }
        },
        error: function (response) {
            alert('Server Error...!');
            $(elem).removeClass('i').find('.fa-spinner').remove();
            $(elem).prop('disabled', false)
        }
    });
}
