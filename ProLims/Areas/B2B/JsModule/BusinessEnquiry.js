$(document).ready(function () {
    GetState()
})
function Insert() {
    if (!Validation()) return
    var url = config.baseUrl + "/api/Patient/InsertBusinessEnquiry";
    var objBO = {};
    objBO.name = $('#txtName').val();
    objBO.mobile_no = $('#txtMobile').val();
    objBO.designation = $('#txtDesignation').val();
    objBO.state = $('#ddlState option:selected').text();
    objBO.city = $('#ddlCity option:selected').text();
    objBO.email = $('#txtEmail').val();
    objBO.remark = $('#txtRemark').val();
    objBO.Logic = "Insert";
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            if (data.includes('Success')) {
                alert(data)
                $('input').val('');
            }
            else {
                alert(data)
            }
        },
        error: function (response) {
            alert('Server Error...!');
        }
    });
}
function Validation() {
    var name = $('#txtName').val();
    var mobile = $('#txtMobile').val();
    var state = $('#ddlState option:selected').text();
    var city = $('#ddlCity option:selected').text();
    var remark = $('#txtRemark').val();

    if (name == '') {
        alert('Provide Name.');
        $('#txtName').focus();
        return false;
    }
    if (mobile == '') {
        alert('Provide Mobile No.');
        $('#txtMobile').focus();
        return false;
    } else if ((mobile).length < 10) {
        alert('Mobile No should be 10 Digit.');
        $('#txtMobile').focus();
        return false;
    }
    if (state == 'Select State') {
        alert('Please Select State.');
        $('#ddlState').focus();
        return false;
    }
    if (city == 'Select City') {
        alert('Please Select City.');
        $('#ddlCity').focus();
        return false;
    }
    if (remark == '') {
        alert('Please Provide Remark.');
        $('#txtRemark').focus();
        return false;
    }

    return true;
}
function GetState() {
    var url = config.baseUrl + "/api/Patient/B2B_PatientQueries";
    var objBO = {};
    objBO.unitId = 'CH01';
    objBO.compId = '-';
    objBO.clientId = '-';
    objBO.from = '1900/01/01';
    objBO.to = '1900/01/01';
    objBO.Prm1 = '-';
    objBO.Prm2 = '-';
    objBO.Prm3 = '-';
    objBO.loginId = localStorage.getItem('jsEmpCode');
    objBO.Logic = "GetState";
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        contentType: "application/json;charset=utf-8",
        dataType: "JSON",
        success: function (data) {
            $('#ddlState').empty().append($('<option></option>').val(0).html('Select State'));
            $('#ddlCity').empty().append($('<option></option>').val(0).html('Select District'));
            $.each(data.ResultSet.Table, function (key, val) {
                $('#ddlState').append($('<option></option>').val(val.state_code).html(val.statename));
            });
        },
        complete: function (response) {
            $('#ddlState option[value="32"]').prop('selected', true).change();
        },
        error: function (response) {
            alert('Server Error...!');
        }
    });
}
function GetDistrict() {
    var url = config.baseUrl + "/api/Patient/B2B_PatientQueries";
    var objBO = {};
    objBO.unitId = 'CH01';
    objBO.compId = '-';
    objBO.clientId = '-';
    objBO.from = '1900/01/01';
    objBO.to = '1900/01/01';
    objBO.Prm1 = $('#ddlState option:selected').val();
    objBO.Prm2 = '-';
    objBO.Prm3 = '-';
    objBO.loginId = localStorage.getItem('jsEmpCode');
    objBO.Logic = "GetDistrictByState";
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        contentType: "application/json;charset=utf-8",
        dataType: "JSON",
        success: function (data) {
            $('#ddlCity').empty().append($('<option></option>').val(0).html('Select District'));
            $.each(data.ResultSet.Table, function (key, val) {
                $('#ddlCity').append($('<option></option>').val(val.dist_code).html(val.distt_name));
            });
        },
        complete: function (response) {
            $('#ddlCity option[value="45"]').prop('selected', true).change();
        },
        error: function (response) {
            alert('Server Error...!');
        }
    });
}