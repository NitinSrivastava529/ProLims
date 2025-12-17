
$(document).ready(function () {
    $("#ddlDoctorName").empty().append($("<option selected></option>").val("ALL").html("ALL")).select2();
    FillCurrentDate('txtFrom')
    FillCurrentDate('txtTo')
    Onload();
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


});
function Onload() {
    var url = config.baseUrl + "/api/Service/Diag_ServiceQueries";
    var objBO = {};
    objBO.SearcKey = '';
    objBO.SearchValue = '-';
    objBO.from = $('#txtFrom').val();
    objBO.to = $('#txtTo').val();
    objBO.login_id = Active.userId;
    objBO.UnitId = Active.unitId;
    objBO.Logic = 'UserWiseClientList';
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            if (Object.keys(data.ResultSet).length > 0) {
                if (Object.keys(data.ResultSet.Table).length > 0) {
                    $.each(data.ResultSet.Table, function (key, value) {
                        $("#ddlClient").append($("<option></option>").val(value.ClientId).html(value.ClientName)).select2();
                    });
                    DoctorList();
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
function DoctorList() {
    $("#ddlDoctorName").empty().append($("<option selected></option>").val("ALL").html("ALL")).select2();
    var url = config.baseUrl + "/api/Service/Diag_ServiceQueries";
    var objBO = {};
    objBO.SearcKey = '';
    objBO.SearchValue = $("#ddlClient option:selected").val();
    objBO.from = $('#txtFrom').val();
    objBO.to = $('#txtTo').val();
    objBO.login_id = Active.userId;
    objBO.UnitId = Active.unitId;
    objBO.Logic = 'GetDoctorList';
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            if (Object.keys(data.ResultSet).length > 0) {
                if (Object.keys(data.ResultSet.Table).length > 0) {
                    $.each(data.ResultSet.Table, function (key, value) {
                        $("#ddlDoctorName").append($("<option></option>").val(value.ref_code).html(value.ref_name));
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
function GetReport(elem) {
    $(elem).append("<i class='fa fa-spinner fa-spin' style='font-size:20px;float:left'></i>");
    $('#tblReport tbody').empty();
    var url = config.baseUrl + "/api/Service/Diag_ServiceQueries";
    var objBO = {};
    objBO.SearcKey = '-';
    objBO.SearchValue = $("#ddlClient option:selected").val();
    objBO.prm_1 = '-';
    objBO.from = $('#txtFrom').val();
    objBO.to = $('#txtTo').val();
    objBO.login_id = Active.userId;
    objBO.UnitId = Active.unitId;
    objBO.Logic = 'UnitWisePatientList';
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        contentType: "application/json;charset=utf-8",
        dataType: "JSON",
        async: false,
        success: function (data) {
            if (data.ResultSet.Table.length > 0) {
                var tbody = ""; var temp = ""; var temp1 = "";
                $.each(data.ResultSet.Table, function (key, val) {
                    if (temp != val.doctorName) {
                        tbody += "<tr class='pr' style='background:#e2ffe2;'>";
                        tbody += "<td colspan='20' style='font-size:13px;'><b>Doctor Name : " + val.doctorName + "</b></td>";
                        tbody += "</tr>";
                        temp = val.doctorName
                    }

                    tbody += '<td style="width:5%;text-align:center;"><input id="chkshift" data-visitno="' + val.VisitNo + '"type="checkbox" class="shiftchk"> </td>';
                    tbody += "<td>" + val.ClientName + "</td>";
                    tbody += "<td>" + val.UHID + "</td>";
                    tbody += "<td>" + val.VisitNo + "</td>";
                    tbody += "<td>" + val.visitdate + "</td>";
                    tbody += "<td>" + val.Patient_name + "</td>";
                    tbody += "<td>" + val.ageInfo + "</td>";
                    tbody += "<td>" + val.Gender + "</td>";
                    tbody += "<td>" + val.mobile_no + "</td>";
                    tbody += "<td>" + val.doctorName + "</td>";

                    tbody += "</tr>";
                });
                $('#tblReport tbody').append(tbody);
                $(elem).removeClass('i').find('.fa-spinner').remove();
            }
            else {
                $('#tblReport tbody').empty();
                $(elem).removeClass('i').find('.fa-spinner').remove();
                alert("Data Not Found..");
            };
        },
        error: function (response) {
            alert('Server Error...!');
            $(elem).removeClass('i').find('.fa-spinner').remove();
        }
    });
}

function LinkDoctorPatient() {
    debugger
    var isConfirmed = confirm('Are you sure you want to Update Doctor the data?');
    if (isConfirmed) {
        var Empname = $('#ddlDoctorName option:selected').val();
        if (Empname == 'Select') {
            $('#ddlDoctorName').focus();
            alert('Please select Doctor Name ..');
            return;
        }
        var url = config.baseUrl + "/api/GeneralStore/Diag_InsertReferralReplace";
        var objBO = {};
        var LinkList = [];
        $('#tblReport tbody').find('tr').each(function () {
            var ischecked = $(this).find('input[type="checkbox"]').is(':checked');
            if (ischecked) {
                LinkList.push($(this).find('td:eq(0)').find('input').data('visitno'));
            }
        });
        objBO.CompId = Active.compId;
        objBO.unit_id = Active.unitId;
        objBO.login_id = Active.userId;
        objBO.Clientid = $('#ddlClient option:selected').val();
        objBO.DoctorCode = $('#ddlDoctorName option:selected').val();
        objBO.visitNo = LinkList.join('|');
        objBO.Logic = 'UpdateReferralReplace';
        $.ajax({
            method: "POST",
            url: url,
            data: JSON.stringify(objBO),
            dataType: "json",
            contentType: "application/json;charset=utf-8",
            success: function (data) {
                if (data.includes('Success')) {
                    alert(data);
                    $('input:checkbox').removeAttr('checked');
                    $("#ddlDoctorName").prop("selectedIndex", "0").change();
                    GetReport('')
                }
                else {
                    alert(data);
                }
            },
            error: function (response) {
                alert('Server Error...!');
            }
        });
    } else {
        alert("Cancelled");
    }
}