$(document).ready(function () {
    $("#btnUpdate").prop('disabled', true);
});
function GetPatientInfo() {
    $('#tblPatintInfo tbody').empty();
    if ($('#txtVisitNo').val() == '') {
        alert('Please Provide Visite No.')
        return
    }
    var url = config.baseUrl + "/api/GeneralStore/Diag_ClientQueries";
    var objBO = {};
    objBO.prm_1 = $('#txtVisitNo').val();
    objBO.Logic = 'PatientDetails';
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        contentType: 'application/json;charset=utf-8',
        dataType: "JSON",
        success: function (data) {
            console.log(data);
            if (Object.keys(data.ResultSet).length > 0) {
                if (Object.keys(data.ResultSet.Table).length > 0) {
                    $.each(data.ResultSet.Table, function (key, val) {
                        $('#txtPatientName').val(val.Patient_name);
                        $('#ddlGender').val(val.Gender);
                        $('#txtAge').val(val.age);
                        $('#txtmobile_no').val(val.mobile_no);
                        var dob = data.ResultSet.Table[0].dob;
                        if (dob != null) {
                            var dateto = dob.split('T')[0];
                            $("#txtDob").val(dateto);
                        }
                        $("#btnUpdate").prop('disabled', false);
                    });
                }
            }
            if (Object.keys(data.ResultSet).length > 0) {
                if (Object.keys(data.ResultSet.Table).length > 0) {
                    var tbody = "";
                    $.each(data.ResultSet.Table, function (key, val) {
                        tbody += "<tr>";
                        tbody += "<td>" + val.VisitNo + "</td>";
                        tbody += "<td>" + val.Patient_name + "</td>";
                        tbody += "<td>" + val.Gender + "</td>";
                        tbody += "<td>" + val.dobInfo + "</td>";
                        tbody += "<td>" + val.ageinfo1 + "</td>";
                        tbody += "<td>" + val.mobile_no + "</td>";
                        tbody += "</tr>";
                    });
                    $('#tblPatintInfo tbody').append(tbody);
                }

            }

        },
        error: function (response) {
            alert('Server Error...!');
        }
    });
}

function UpdatePatient() {
    if ($("#txtPatientName").val() == "") {
        alert('Please Enter Patient Name');
        $("#txtPatientName").css('border', '1px solid red');
        return;
    }
    if ($("#ddlGender option:selected").val() == "0") {
        alert('Please Select Gender');
        $("#ddlGender").css('border', '1px solid red');
        return;
    }
    if ($("#txtAge").val() == "") {
        alert('Please Enter Age');
        $("#txtAge").css('border', '1px solid red');
        return;
    }
    if ($("#txtmobile_no").val() == "") {
        alert('Please Enter Moblie No');
        $("#txtmobile_no").css('border', '1px solid red');
        return;
    }
    var isConfirmed = confirm('Are you sure you want to Update the data?');
    if (isConfirmed) {
        var objBO = {};
        var url = config.baseUrl + "/api/GeneralStore/Diag_InsertClientMasterNew";
        objBO.Unitid = Active.unitId;
        objBO.CompId = Active.compId;
        objBO.ClientId = $('#txtVisitNo').val()
        objBO.ClientName = $("#txtPatientName").val();
        objBO.ClientType = $("#ddlGender option:selected").val();
        objBO.Address = $("#txtmobile_no").val();
        objBO.PINCode = $("#txtAge").val();
        objBO.EmailId = $("#txtDob").val();
        objBO.LoginId = Active.userId;
        objBO.Logic = 'UpdatePatientDetails';
        $.ajax({
            method: "POST",
            url: url,
            data: JSON.stringify(objBO),
            dataType: "json",
            contentType: "application/json;charset=utf-8",
            success: function (data) {
                if (data.includes('Success')) {
                    alert(data);
                    GetPatientInfo();
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
    else {
        alert('Data Save Cancelled.');
    }

}