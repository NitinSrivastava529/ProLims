var editAutoid = "";
$(document).ready(function () {

    $("#txtSearch").on("keyup", function () {
        var value = $(this).val().toLowerCase();
        $("#tblReport tbody tr").filter(function () {
            $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
        });
    });
    $("#txtSearch1").on("keyup", function () {
        var value = $(this).val().toLowerCase();
        $("#tblTest tbody tr").filter(function () {
            $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
        });
    });
    Onload();
    GetItemList();
});

function validation() {
    var DoctorName = $("#txtdoctorName").val()
    var ClientName = $("#ddlClient option:selected").val();
    var Degree = $("#txtDegree").val();
    var MobileNo = $("#txtmobile").val();
    var Specialization = $("#txtSpecialization").val();
    //var AccountNo = $("#txtAccountNo").val();
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
    //if (AccountNo == "") {
    //    alert('Please Enter Account No');
    //    $("#txtAccountNo").css('border', '1px solid red');
    //    return false;
    //}
    return true;
}
function InsertUpdateDoctor() {
    if (validation()) {
        var objBO = {};
        var url = config.baseUrl + "/api/GeneralStore/Diag_InsertProfessionalFeesDoctor";
        var btntext = $("#btndaddupdate").text();
        if (btntext.trim() == "Save") {
            objBO.Logic = "Insert";
        }
        if (btntext.trim() == "Update") {
            objBO.DoctorId = $("#hidDoctorId").val();
            objBO.Logic = "Update";
        }
        objBO.Unitid = Active.unitId;
        objBO.CompId = Active.compId;
        objBO.DoctorName = $("#txtdoctorName").val();
        objBO.Specialization = $("#txtSpecialization").val();
        objBO.Degree = $("#txtDegree").val();
        objBO.MobileNo = $("#txtmobile").val();
        objBO.accountNo = $("#txtAccountNo").val();
        objBO.Amount = '0';
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
function ClearValues() {
    $("#txtdoctorName").val('');
    $("#hidDoctorId").val('');

    $("#txtDegree").val('');
    $("#txtmobile").val('');
    $("#txtSpecialization").val('');
    $("#txtAccountNo").val('');
    $("#btndaddupdate").text('Save');
    $("#btndaddupdate").val('Save');
}
function Onload() {
    $("#tblReport tbody").empty();
    var url = config.baseUrl + "/api/GeneralStore/Diag_ProfessionalFeesDoctorQueries";
    var objBO = {};
    objBO.Unitid = Active.unitId;
    objBO.Logic = 'GetProfessionalDoctorList';
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
                        tbody += "<td style='text-align:center'><button  class='btn btn-danger'  onclick='DeleteDoctor(this);selectRow(this)' data-doctorid='" + val.DoctorId + "'><i class='fa fa-trash'></i></button></td>";
                        tbody += "<td>" + val.DoctorName + "</td>";
                        tbody += "<td>" + val.MobileNo + "</td>";
                        tbody += "<td>" + val.Degree + "</td>";
                        tbody += "<td>" + val.Specialization + "</td>";
                        tbody += "<td>" + val.accountNo + "</td>";
                        tbody += "<td style='text-align:center;width:15%'><button  class='btn btn-success'  onclick='SingleDoctorDetails(this);selectRow(this)' data-doctorid='" + val.DoctorId + "'><i class='fa fa-edit'></i>&nbsp;Select</button></td>";
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
    var Doctorid = $(element).data('doctorid');
    var url = config.baseUrl + "/api/GeneralStore/Diag_ProfessionalFeesDoctorQueries";
    var objBO = {};
    objBO.Unitid = Active.unitId;
    objBO.DoctorId = Doctorid;
    objBO.Logic = 'SingleProfessionalDoctorList';
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            if (Object.keys(data.ResultSet).length > 0) {
                if (Object.keys(data.ResultSet.Table).length > 0) {
                    $("#hidDoctorId").val(data.ResultSet.Table[0].DoctorId);
                    $("#txtdoctorName").val(data.ResultSet.Table[0].DoctorName);
                    $("#txtDegree").val(data.ResultSet.Table[0].Degree);
                    $("#txtSpecialization").val(data.ResultSet.Table[0].Specialization);
                    $("#txtmobile").val(data.ResultSet.Table[0].MobileNo);
                    $("#txtAccountNo").val(data.ResultSet.Table[0].accountNo);
                    $("#btndaddupdate").text('Update');
                    $("#btndaddupdate").val('Update');
                    OnLoadTest();
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
function DeleteDoctor(element) {
    var doctorid = $(element).data('doctorid');
    var objBO = {};
    var url = config.baseUrl + "/api/GeneralStore/Diag_InsertProfessionalFeesDoctor";
    objBO.Unitid = Active.unitId;
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
function GetItemList() {
    var url = config.baseUrl + "/api/GeneralStore/Diag_ProfessionalFeesDoctorQueries";
    var objBO = {};
    objBO.login_id = Active.userId;
    objBO.Logic = 'GetItemList';
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
                    $('#ddltest').empty().append($('<option></option>').val('ALL').html('Select')).select2();
                    $.each(data.ResultSet.Table, function (key, val) {
                        $("#ddltest").append($("<option></option>").val(val.ItemID).html(val.ItemName));
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
function InsertUpdateTest() {
    var objBO = {};
    var url = config.baseUrl + "/api/GeneralStore/Diag_InsertProfessionalFeesDoctor";
    if ($("#hidDoctorId").val() == '') {
        alert("Please Select Doctor Name");
        return
    }
    if ($("#txtAmount").val() == '') {
        alert("Please Enter Amount");
        return
    }
    if ($("#ddltest option:selected").val() == 'ALL') {
        alert("Please Select Item Name");
        return
    }
    var btntext = $("#btntestaddupdate").text();
    if (btntext.trim() == "ADD") {
        objBO.Logic = "InsertTest";
    }
    if (btntext.trim() == "Update") {
        objBO.Logic = "UpdateTest";
    }
    objBO.Unitid = Active.unitId;
    objBO.CompId = Active.compId;
    objBO.TestId = $("#ddltest option:selected").val();
    objBO.DoctorId = $("#hidDoctorId").val();
    objBO.Amount = $("#txtAmount").val();
    objBO.LoginId = Active.userId;
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            if (data.includes('Success')) {
                // alert(data);
                $("#txtAmount").val('');
                $("#ddltest").prop("selectedIndex", "0").change().prop('disabled', false);
                $("#btntestaddupdate").text('ADD');
                $("#btntestaddupdate").val('ADD');
                OnLoadTest();
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
function OnLoadTest() {
    $("#tblTest tbody").empty();
    var url = config.baseUrl + "/api/GeneralStore/Diag_ProfessionalFeesDoctorQueries";
    var objBO = {};
    objBO.Unitid = Active.unitId;
    objBO.DoctorId = $("#hidDoctorId").val();
    objBO.Logic = 'GetDoctorWiseLinkItem';
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
                        if (temp != val.DoctorName) {
                            tbody += "<tr style='background:#CCC;'>";
                            tbody += "<td colspan='20' style='font-size:13px;'><b> Doctor Id : " + val.DoctorId + "</b>,<b> Doctor Name : " + val.DoctorName + "</b></td>";
                            tbody += "</tr>";
                            temp = val.DoctorName
                        }
                        if (val.IsAproved == 'Y') {
                            tbody += "<tr style='background:#99f1a4'>"
                        }
                        else if (val.IsAproved == 'X') {
                            tbody += "<tr style='background:#fde1e1'>"
                        }
                        else {
                            tbody += "<tr>"
                        }
                        tbody += "<td style='text-align:center'><button  class='btn btn-danger'  onclick='Deletetest(this);selectRow(this)' data-autoid='" + val.AutoId + "'><i class='fa fa-trash'></i></button></td>";
                        tbody += "<td>" + val.ItemId + "</td>";
                        tbody += "<td>" + val.ItemName + "</td>";
                        tbody += "<td style='text-align: center' >" + val.DoctorFee + "</td>";
                        tbody += "<td style='text-align:center;width:5%'><button  class='btn btn-success'  onclick='SingleTestDetails(this);selectRow(this)' data-autoid='" + val.AutoId + "'  data-itemid='" + val.ItemId + "' data-amount='" + val.DoctorFee + "'><i class='fa fa-edit'></i></button></td>";
                        tbody += "</tr>";
                    });
                    $("#tblTest tbody").append(tbody);

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
function Deletetest(element) {
    var autoid = $(element).data('autoid');
    var objBO = {};
    var url = config.baseUrl + "/api/GeneralStore/Diag_InsertProfessionalFeesDoctor";
    objBO.Unitid = Active.unitId;
    objBO.DoctorId = autoid;
    objBO.Logic = "DeleteTest";
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
                    OnLoadTest();
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
function SingleTestDetails(element) {
    editAutoid = $(element).data('autoid');
    var itemid = $(element).data('itemid');
    var Amount = $(element).data('amount');
    $("#ddltest").val(itemid).change().prop('disabled', true)
    $("#txtAmount").val(Amount);
    $("#btntestaddupdate").text('Update');
    $("#btntestaddupdate").val('Update');
}