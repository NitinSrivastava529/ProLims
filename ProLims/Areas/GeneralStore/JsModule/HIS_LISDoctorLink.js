var DoctorID = "";
$(document).ready(function () {
    OnLoadList();

    $('#tblLISReport tbody').on('click', '.btnedit', function () {
        var $tr = $(this).closest('tr');
        DoctorID = $tr.find('td:eq(0)').text().trim();
        var DoctorName = $tr.find('td:eq(1)').text().trim();
        $("#txtDoctorName").text(DoctorName)
        selectRow($(this))
        GetHisReport();
    });
});
function OnLoadList() {
    var url = config.baseUrl + "/api/GeneralStore/MasterQueries";
    var objBO = {};
    objBO.Logic = 'GetProlist';
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
                    $('#ddlProName').empty().append($('<option></option>').val('Select').html('Select')).select2();
                    $.each(data.ResultSet.Table, function (key, val) {
                        $("#ddlProName").append($("<option></option>").val(val.ProCode).html(val.ProName));
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
function GetLISReport() {
    $("#tblLISReport tbody").empty();
    var url = config.baseUrl + "/api/GeneralStore/MasterQueries";
    var objBO = {};
    objBO.prm_1 = $("#ddlProName option:selected").val();
    objBO.Logic = 'GetLISDoctorList';
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            var tbody1 = "";
            if (Object.keys(data.ResultSet).length) {
                if (Object.keys(data.ResultSet.Table).length) {
                    $.each(data.ResultSet.Table, function (key, val) {
                        tbody1 += "<tr>";
                        tbody1 += "<td>" + val.Doctor_ID + "</td>";
                        tbody1 += "<td>" + val.DoctorName + "</td>";
                        tbody1 += "<td>" + val.Specialization + "</td>";
                        tbody1 += "<td>" + val.BusinessType + "</td>";
                        tbody1 += "<td style='text-align:center'><button type='button' data-autoid='" + val.auto_id + "'  class='btn btn-primary btnedit' style='padding: 1px 5px;'><i class='fa fa-sign-in'></i></button></td>";
                        tbody1 += "</tr>";
                    });
                    $("#tblLISReport tbody").append(tbody1);
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
function GetHisReport() {
    $("#tblHISReport tbody").empty();
    $("#tblReportInfo tbody").empty();
    var url = config.baseUrl + "/api/GeneralStore/MasterQueries";
    var objBO = {};
    objBO.prm_1 = DoctorID;
    objBO.Logic = 'GetHISDoctorList';
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            var tbody1 = ""; var tbody = "";
            if (Object.keys(data.ResultSet).length) {
                if (Object.keys(data.ResultSet.Table).length) {
                    $.each(data.ResultSet.Table, function (key, val) {
                        tbody1 += "<tr>";
                        tbody1 += "<td>" + val.DoctorId + "</td>";
                        tbody1 += "<td>" + val.DoctorName + "</td>";
                        tbody1 += "<td>" + val.speciality + "</td>";
                        tbody1 += "<td>" + val.DoctorType + "</td>";
                        tbody1 += "<td style='text-align:center'><button type='button' data-doctorid='" + val.DoctorId + "'  class='btn btn-success btnedit' onclick='InsertDoctorLink(this)' style='padding: 1px 5px;'>Add</button></td>";
                        tbody1 += "</tr>";
                    });
                    $("#tblHISReport tbody").append(tbody1);
                }

                if (Object.keys(data.ResultSet.Table1).length) {
                    $.each(data.ResultSet.Table1, function (key, val) {
                        tbody += "<tr>";
                        tbody += "<td>" + val.LISDoctorName + "</td>";
                        tbody += "<td>" + val.HISDoctorName + "</td>";
                        tbody += "<td>" + val.emp_name + "</td>";
                        tbody += "<td>" + val.CurrentDate + "</td>";
                        tbody += "<td style='text-align:center'><button type='button' data-lisdoctorid='" + val.LIS_DoctorId + "' data-hisdoctorid='" + val.HIS_DoctorId + "'  class='btn btn-danger' onclick='DeleteDoctorLink(this)' style='padding: 1px 5px;'><i class='fa fa-close'></i></button></td>";
                        tbody += "</tr>";
                    });
                    $("#tblReportInfo tbody").append(tbody);
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

function InsertDoctorLink(element) {
    selectRow($(element))
    var url = config.baseUrl + "/api/GeneralStore/InsertHIS_LIS_DoctorLink";
    var objBO = {};
    objBO.LIS_DoctorId = DoctorID;
    objBO.HIS_DoctorId = $(element).data('doctorid');
    objBO.login_id = Active.userId;
    objBO.Logic = 'Insert';
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            if (data == 'Successfully Saved') {
                alert(data);
                GetHisReport();
            }
            else {
                alert(data);
            };
        },
        error: function (response) {
            alert('Server Error...!');
        }
    });
}

function DeleteDoctorLink(element) {
    selectRow($(element))
    var url = config.baseUrl + "/api/GeneralStore/InsertHIS_LIS_DoctorLink";
    var objBO = {};
    objBO.LIS_DoctorId = $(element).data('lisdoctorid');
    objBO.HIS_DoctorId = $(element).data('hisdoctorid');
    objBO.login_id = Active.userId;
    objBO.Logic = 'UpdateStatus';
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            if (data == 'Successfully Saved') {
                // alert(data);
                GetHisReport();
            }
            else {
                alert(data);
            };
        },
        error: function (response) {
            alert('Server Error...!');
        }
    });
}