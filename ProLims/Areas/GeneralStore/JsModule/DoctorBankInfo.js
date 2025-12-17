var Doctorid = "";
$(document).ready(function () {
    Onload();
    GetClientList();
    $("#txtSearch").on("keyup", function () {
        var value = $(this).val().toLowerCase();
        $("#tblReport tbody tr").filter(function () {
            $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
        });
    });

});
function GetClientList() {
    var url = config.baseUrl + "/api/GeneralStore/MasterQueries";
    var objBO = {};
    objBO.login_id = Active.userId;
    objBO.Logic = 'GetClientList';
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
                    $('#ddlClient').empty().append($('<option></option>').val('ALL').html('Select')).select2();
                    $.each(data.ResultSet.Table, function (key, val) {
                        $("#ddlClient").append($("<option></option>").val(val.ClientId).html(val.ClientName));
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
function Onload() {
    $("#tblReport tbody").empty();
    var url = config.baseUrl + "/api/GeneralStore/MasterQueries";
    var objBO = {};
    objBO.login_id = Active.userId;
    objBO.Logic = 'GetDoctorList';
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            var tbody = ""; var temp = "";
            if (Object.keys(data.ResultSet).length) {
                if (Object.keys(data.ResultSet.Table).length) {
                    $.each(data.ResultSet.Table, function (key, val) {
                        tbody += "<tr>";
                        tbody += "<td style='text-align:center'><button  class='btn btn-danger'  onclick='DeleteDoctor(this);selectRow(this)' data-doctorid='" + val.ref_code + "'><i class='fa fa-trash'></i></button></td>";
                        tbody += "<td>" + val.ref_name + "</td>";
                        tbody += "<td>" + val.MobileNo + "</td>";
                        tbody += "<td>" + val.Degree + "</td>";
                        tbody += "<td>" + val.Specialization + "</td>";
                        tbody += "<td style='text-align:center'><button  class='btn btn-success'  onclick='SingleDoctorDetails(this);selectRow(this)' data-doctorid='" + val.ref_code + "'><i class='fa fa-edit'></i></button></td>";
                        tbody += "</tr>";
                    });
                    $("#tblReport tbody").append(tbody);

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
function SingleDoctorDetails(element) {
    Doctorid = $(element).data('doctorid');
    var url = config.baseUrl + "/api/GeneralStore/MasterQueries";
    var objBO = {};
    objBO.login_id = Active.userId;
    objBO.prm_1 = Doctorid;
    objBO.Logic = 'SingleDoctorList';
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            if (Object.keys(data.ResultSet).length > 0) {
                if (Object.keys(data.ResultSet.Table).length > 0) {
                    $("#hidDoctorId").val(data.ResultSet.Table[0].ref_code);
                    $("#txtdoctorName").val(data.ResultSet.Table[0].ref_name);
                    $("#txtDegree").val(data.ResultSet.Table[0].Degree);
                    $("#txtSpecialization").val(data.ResultSet.Table[0].Specialization);
                    $("#txtmobile").val(data.ResultSet.Table[0].MobileNo);
                    $("#txtIFSCCode").val(data.ResultSet.Table[0].IFSCCode);
                    $("#txtAccNo").val(data.ResultSet.Table[0].BankAccountNo);
                    $("#ddlClient").val(data.ResultSet.Table[0].ClientShareId).change();             
                }
            }
            else {
                MsgBox('No Data Found')
            }
        },
        error: function (response) {
            alert('Server Error...!');
        }
    });
}
function ClearValues() {
    $("#txtdoctorName").val('');
    $("#hidDoctorId").val('');
    $("#ddlClient").prop("selectedIndex", "0").change();
    $("#txtDegree").val('');
    $("#txtmobile").val('');
    $("#txtIFSCCode").val('');
    $("#txtAccNo").val('');
    $("#txtSpecialization").val('');
}
function validation() {
    var DoctorName = $("#txtdoctorName").val()
    var ClientName = $("#ddlClient option:selected").val();
    var Degree = $("#txtDegree").val();
    var MobileNo = $("#txtmobile").val();
    var Specialization = $("#txtSpecialization").val();
    if (DoctorName == "") {
        alert('Please Enter Doctor Name');
        $("#txtdoctorName").css('border', '1px solid red');
        return false;
    }
    if (ClientName == "ALL") {
        alert('Please select client Name');
        $("#ddlClient").css('border', '1px solid red');
        return false;
    }
    if (Degree == "") {
        alert('Please Enter Degree');
        $("#txtDegree").css('border', '1px solid red');
        return false;
    }
    if (MobileNo == "") {
        alert('Please Enter MobileNo');
        $("#txtmobile").css('border', '1px solid red');
        return false;
    }
    if (Specialization == "") {
        alert('Please Enter Specialization');
        $("#txtSpecialization").css('border', '1px solid red');
        return false;
    }

    return true;
}
function InsertUpdateDoctor() {
    if (validation()) {
        var objBO = {};
        var url = config.baseUrl + "/api/GeneralStore/GS_InsertDoctorMaster";
        var btntext = $("#btndaddupdate").text();
        if (btntext.trim() == "Save") {
            objBO.Logic = "Insert";
        }
        if (btntext.trim() == "Update") {
            objBO.DoctorId = $("#hidDoctorId").val();
            objBO.Logic = "UpdateByBankInfo";
        }
        objBO.Unitid = Active.unitId;
        objBO.CompId = Active.compId;
        objBO.ClientId = $("#ddlClient option:selected").val();
        objBO.DoctorName = $("#txtdoctorName").val();
        objBO.Specialization = $("#txtSpecialization").val();
        objBO.Degree = $("#txtDegree").val();
        objBO.MobileNo = $("#txtmobile").val();
        objBO.IFSCCode = $("#txtIFSCCode").val();
        objBO.BankAccountNo = $("#txtAccNo").val();
        objBO.LoginId = Active.userId;
        $.ajax({
            method: "POST",
            url: url,
            data: JSON.stringify(objBO),
            dataType: "json",
            contentType: "application/json;charset=utf-8",
            success: function (data) {
                if (data.includes('Success')) {
                    alert(data);
                    ClearValues();
                    Onload();
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
function DeleteDoctor(element) {
    var doctorid = $(element).data('doctorid');
    var objBO = {};
    var url = config.baseUrl + "/api/GeneralStore/GS_InsertDoctorMaster";
    objBO.DoctorId = doctorid;
    objBO.Logic = "Delete";
    if (confirm("Are you sure want to delete?")) {
        $.ajax({
            method: "POST",
            url: url,
            data: JSON.stringify(objBO),
            dataType: "json",
            contentType: "application/json;charset=utf-8",
            success: function (data) {
                if (data.includes('Success')) {
                    alert(data);
                    Onload();
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
