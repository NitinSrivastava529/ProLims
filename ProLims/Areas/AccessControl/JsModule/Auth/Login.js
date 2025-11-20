var _OTP = "";
$(document).ready(function () {
});
function Toggle1() {
    const container = document.getElementById('container');
    container.classList.add("right-panel-active");
}
function Toggle2() {
    const container = document.getElementById('container');
    container.classList.remove("right-panel-active");
}
function Authenticate() {
    $('#btnLogin').addClass('blockUI').find('i').addClass('lds-hourglass').removeClass('fa fa-sign-in-alt');
    var url = config.baseUrl + "/api/auth/login";
    var objBO = {};
    objBO.LoginId = $('#txtEmployeeCode').val();
    objBO.Password = $('#txtPassword').val();
    objBO.Logic = 'Authenticate'
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        contentType: 'application/json;charset=utf-8',
        dataType: "JSON",
        Authorization: 'Bearer csdcwc',
        success: function (data) {
            console.log(data)
            if (Object.keys(data.ResultSet).length > 2) {
                localStorage.setItem('UserID', data.ResultSet.Table[0].login_id);
                localStorage.setItem('Username', data.ResultSet.Table[0].login_name);
                localStorage.setItem('sex', data.ResultSet.Table[0].sex);
                localStorage.setItem('designation', data.ResultSet.Table[0].designation);
                localStorage.setItem('photo', data.ResultSet.Table[0].photo);
                localStorage.setItem('defaultRole', data.ResultSet.Table[0].defa_role_id);
                localStorage.setItem('CompId', data.ResultSet.Table[0].CompId);

                localStorage.setItem('LoginUser', JSON.stringify(data.ResultSet.Table));
                localStorage.setItem('AllotedUnit', JSON.stringify(data.ResultSet.Table1));
                localStorage.setItem('AllotedMenu', JSON.stringify(data.ResultSet.Table2));      
                window.location.href = config.rootUrl + "/AccessControl/Configuration/Dashboard";
            }
            else {
                alert(data.ResultSet.Table[0].msg)
            }
        },
        complete: function () {
            $('#btnLogin').removeClass('blockUI').find('i').removeClass('lds-hourglass').addClass('fa fa-sign-in-alt');
        },
        error: function (response) {
            console.log(response)
        }
    });
}
function EmployeeValidation() {
    var url = config.baseUrl + "/api/AccessControl/Auth_ConfigQueries";
    _OTP = Math.random().toString().slice(-10, -6);
    _OTP
    var objBO = {};
    objBO.LoginId = $('#txtRPEmpCode').val();
    objBO.Password = _OTP;
    objBO.Logic = 'SendOTPForResetPassword';
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        contentType: 'application/json;charset=utf-8',
        dataType: "JSON",
        success: function (data) {
            console.log(data)
            if (data.Msg.length>10) {              
                alert(data.Msg)
                $('#txtRPEmpCode').addClass('blockUI');
            }
            else {
                alert(data.Msg)
            }
        },
        error: function (response) {
            console.log(response)
        }
    });
}
function ResetPassword() {
    if (ValidateNewPass()) {
        $('#btnReset').addClass('blockUI').find('i').addClass('lds-hourglass').removeClass('fa fa-key');
        var url = config.baseUrl + "/api/AccessControl/Auth_ConfigQueries";
        var objBO = {};
        objBO.LoginId = $('#txtRPEmpCode').val();
        objBO.Password = $('#txtNewPassword').val();
        objBO.Logic = 'ResetPassword';
        $.ajax({
            method: "POST",
            url: url,
            data: JSON.stringify(objBO),
            contentType: 'application/json;charset=utf-8',
            dataType: "JSON",
            success: function (data) {
                console.log(data)
                if (data.Msg.includes('Success')) {
                    _OTP = "";
                    alert(data.Msg)
                    $('#txtRPOTP').val('');
                    $('#txtRPEmpCode').val('').removeClass('blockUI');
                    $('#txtNewPassword').val('').addClass('blockUI');
                }
                else {
                    alert(data.Msg.split('|')[0])
                }
            },
            complete: function () {
                $('#btnReset').removeClass('blockUI').find('i').removeClass('lds-hourglass').addClass('fa fa-key');
            },
            error: function (response) {
                console.log(response)
            }
        });
    }
}
function ValidateNewPass() {
    var newpass = $('#txtNewPassword').val();
    if (newpass == '') {
        alert('Password Required');
        return false;
    }
    else if (newpass.length < 5) {
        alert('Password Should be Min 5 Character');
        return false;
    }
    else if (newpass.search(/[a-zA-Z]/) == -1) {
        alert('One Character Required');
        return false;
    }
    else if (newpass.search(/[0-9]/) == -1) {
        alert('One Digit Required.');
        return false;
    }
    else if (newpass.search(/[!\@\#\$\%\^\*\~\_\(\)]/) == -1) {
        alert('One Special Charecter Required.');
        return false;
    }
    return true;
}
function ValidateOTP() {
    if ($('#txtRPOTP').val() == _OTP) {
        $('#txtNewPassword').removeClass('blockUI').focus();
        alert('Validated Successfully!')
    }
    else {
        alert('OTP Not Matched')
        $('#txtNewPassword').addClass('blockUI');
        $('#txtRPOTP').val('')
    }
}
