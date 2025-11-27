var _mobileNo = '';
var _userId = '';
$(document).ready(function () {
    $('.panel-group').on('hidden.bs.collapse', toggleIcon);
    $('.panel-group').on('shown.bs.collapse', toggleIcon);
    GetUserInfo();
    searchTableh('txtSearch', 'tblUserInfo')
    searchTableh('txtSearch1', 'tblCentre')
    searchTableh('txtSearch2', 'tblAllotedCentre')
    $('#ddlUserType').on('change', function () {
        $('#txtUserId').val('');
        $('#txtUserName').val('');
        $('#txtMobileNo').val('');
        $('#txtDesignation').val('');
        var val = $(this).find('option:selected').text();
        if (val == 'Chandan') {
            $('#txtUserId').prop('disabled', false);
            $('#btnAutoGen').text('Get Emp');
        }
        else {
            $('#txtUserId').prop('disabled', true);
            $('#btnAutoGen').text('Auto Gen');
        }
    });
    $('#btnAutoGen').on('click', function () {
        var val = $(this).text();
        if (val == 'Auto Gen') {
            AutoGenUserId();
        }
        else {
            GetChandanEmpInfo();
        }
    });
    $('#tblUserInfo tbody').on('click', 'button[id=btnGetInfo]', function () {
        selectRow($(this));
        var userId = $(this).closest('tr').find('td:eq(1)').text();
        var userName = $(this).closest('tr').find('td:eq(2)').text();
        var userFor = $(this).closest('tr').find('td:eq(4)').text();
        var mobileNo = $(this).closest('tr').find('td:eq(3)').text();
        $('#txtUserInfo').text(' : ' + userName.concat('-', userId));
        _mobileNo = mobileNo;
        _userId = userId;
        EmpWiseClient()
    });
    $('#AccordionRole').on('click', '.more-less', function () {
        var roleId = $(this).data('roleid');
        GetMenuByRole(roleId, '#tblRole' + roleId);
    });
    $('#AccordionAllotedRole').on('click', '.more-less', function () {
        var roleId = $(this).data('roleid');
        GetMenuByRole(roleId, '#tblAlloted' + roleId);
    });
    $('#AccordionAllotedRole').on('click', '.assign', function () {
        var roleId = $(this).data('roleid');
        unAllotRoleToUser(roleId);
    });
    $('#AccordionRole').on('click', '.assign', function () {
        var roleId = $(this).data('roleid');
        AllotRoleToUser(roleId);
    });
    $('#tblCentre').on('click', 'button', function () {
        var centreid = $(this).data('centreid');
        AllotCentreToUser(centreid);
    });
    $('#tblAllotedCentre').on('click', 'button', function () {
        var centreid = $(this).data('centreid');
        unAllotCentreToUser(centreid);
    });
    $('table thead').on('click', 'input[type=checkbox]', function () {
        var isCheck = $(this).is(':checked');
        if (isCheck) {
            $(this).parents('table').find('tbody').find('input[type=checkbox]').prop('checked', true);
        }
        else {
            $(this).parents('table').find('tbody').find('input[type=checkbox]').prop('checked', false);
        }
    });
});
function MenuAndDoctor() {
    $('#modelAssign').modal('show');
    $('#tblDoctor1 tbody').empty();
    $('#tblDoctor2 tbody').empty();
    $('#tblMenu1 tbody').empty();
    $('#tblMenu2 tbody').empty();
    var url = config.baseUrl + "/api/Patient/B2B_PatientQueries";
    var objBO = {};
    objBO.unitId = 'CH01';
    objBO.compId = 'CH01';
    objBO.clientId = '-'
    objBO.from = '1900/01/01';
    objBO.to = '1900/01/01';
    objBO.Prm1 = _userId;
    objBO.Prm2 = '-';
    objBO.Prm3 = '-';
    objBO.loginId = localStorage.getItem('jsEmpCode');
    objBO.Logic = "GetUserDoctorAndMenu";
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (data) {           
            if (Object.keys(data.ResultSet).length > 0) {
                if (Object.keys(data.ResultSet.Table).length > 0) {
                    let tbody = '';               
                    let temp = '';               
                    $.each(data.ResultSet.Table, function (key, val) {     
                        if (temp != val.ClientId) {
                            tbody += "<tr style='background:#fbf4d4'>";
                            tbody += "<td colspan='5'>" + val.ClientName + "</td>";
                            tbody += "</tr>";
                            temp = val.ClientId
                        }
                        tbody += "<tr>";                
                        tbody += "<td>" + val.ref_code + "</td>";
                        tbody += "<td>" + val.ref_name + "</td>";                    
                        tbody += "<td>" + val.Degree + "</td>";                    
                        tbody += "<td>" + val.Specialization + "</td>";                    
                        tbody += "<td><button id='btnGetInfo' data-refcode=" + val.ref_code + " data-logic='AssignDoctor' onclick=AssignDoctor(this) class='btn-warning'><i class='fa fa-sign-in'></i></button></td>";
                        tbody += "</tr>";
                    });
                    $('#tblDoctor1 tbody').append(tbody);
                }
            }
            if (Object.keys(data.ResultSet).length > 0) {
                if (Object.keys(data.ResultSet.Table).length > 0) {
                    let tbody = '';
                    let temp = '';
                    $.each(data.ResultSet.Table1, function (key, val) {
                        if (temp != val.ClientId) {
                            tbody += "<tr style='background:#fbf4d4'>";
                            tbody += "<td colspan='5'>" + val.ClientName + "</td>";
                            tbody += "</tr>";
                            temp = val.ClientId
                        }
                        tbody += "<tr>";
                        tbody += "<td><button id='btnGetInfo' data-refcode=" + val.ref_code + " data-logic='UnAssignDoctor' onclick=AssignDoctor(this) class='btn-danger'><i class='fa fa-trash'></i></button></td>";
                        tbody += "<td>" + val.ref_code + "</td>";
                        tbody += "<td>" + val.ref_name + "</td>";
                        tbody += "<td>" + val.Degree + "</td>";
                        tbody += "<td>" + val.Specialization + "</td>";                      
                        tbody += "</tr>";
                    });
                    $('#tblDoctor2 tbody').append(tbody);
                }
            }
            if (Object.keys(data.ResultSet).length > 0) {
                if (Object.keys(data.ResultSet.Table).length > 0) {
                    let tbody = '';
                    $.each(data.ResultSet.Table2, function (key, val) {
                        tbody += "<tr>";
                        tbody += "<td>" + val.sub_menu_id + "</td>";
                        tbody += "<td>" + val.sub_menu_name + "</td>";
                        tbody += "<td><button id='btnGetInfo' data-id=" + val.sub_menu_id + " data-logic='AssignMenu' onclick=AssignMenu(this) class='btn-warning'><i class='fa fa-sign-in'></i></button></td>";
                        tbody += "</tr>";
                    });
                    $('#tblMenu1 tbody').append(tbody);
                }
            }
            if (Object.keys(data.ResultSet).length > 0) {
                if (Object.keys(data.ResultSet.Table).length > 0) {
                    let tbody = '';
                    $.each(data.ResultSet.Table3, function (key, val) {
                        tbody += "<tr>";
                        tbody += "<td><button id='btnGetInfo' data-id=" + val.sub_menu_id + " data-logic='UnAssignMenu' onclick=AssignMenu(this) class='btn-danger'><i class='fa fa-trash'></i></button></td>";
                        tbody += "<td>" + val.sub_menu_id + "</td>";
                        tbody += "<td>" + val.sub_menu_name + "</td>";
                        tbody += "</tr>";
                    });
                    $('#tblMenu2 tbody').append(tbody);
                }
            }
        },
        error: function (response) {
            alert('Server Error...!');
        }
    });
}
function AssignDoctor(elem) {       
    var url = config.baseUrl + "/api/GeneralStore/GS_InsertClientMaster";
    var objBO = {};   
    objBO.ClientId = $(elem).data('refcode');
    objBO.LoginId = _userId;
    objBO.Logic = $(elem).data('logic');
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            if (data.includes('Success')) {                
                MenuAndDoctor();
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
function AssignMenu(elem) {
    var url = config.baseUrl + "/api/GeneralStore/GS_InsertClientMaster";
    var objBO = {};
    objBO.CompId ='CH01';    
    objBO.ClientId = _userId;
    objBO.LedgerId = $(elem).data('id');
    objBO.LoginId = Active.userId;
    objBO.Logic = $(elem).data('logic');
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            if (data.includes('Success')) {
                MenuAndDoctor();
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
function toggleIcon(e) {
    $(e.target)
        .prev('.panel-heading')
        .find(".more-less")
        .toggleClass('glyphicon-plus glyphicon-minus');
}
function GetChandanEmpInfo() {
    if ($('#txtUserId').val() == '') {
        alert('Please Provide User Id');
        return;
    }
    $('#txtUserName').val('');
    $('#txtMobileNo').val('');
    $('#txtDesignation').val('');
    var url = config.baseUrl + "/api/Patient/B2B_PatientQueries";
    var objBO = {};
    objBO.unitId = 'CH01';
    objBO.compId = 'CH01';
    objBO.clientId = '-'
    objBO.from = '1900/01/01';
    objBO.to = '1900/01/01';
    objBO.Prm1 = $('#txtUserId').val()
    objBO.Prm2 = '-';
    objBO.Prm3 = '-';
    objBO.loginId = localStorage.getItem('jsEmpCode');
    objBO.Logic = "GetChandanEmpInfo";
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            var tbody = '';
            if (Object.keys(data.ResultSet).length > 0) {
                if (Object.keys(data.ResultSet.Table).length > 0) {
                    $.each(data.ResultSet.Table, function (key, val) {
                        $('#txtUserName').val(val.emp_name);
                        $('#txtMobileNo').val(val.mobile_no);
                        $('#txtDesignation').val(val.designation);
                    });
                }
                else {
                    alert('Record Not Found.');
                }
            }

        },
        error: function (response) {
            alert('Server Error...!');
        }
    });
}
function AutoGenUserId() {
    $('#txtUserId').val('');
    var url = config.baseUrl + "/api/Patient/B2B_PatientQueries";
    var objBO = {};
    objBO.unitId = 'CH01';
    objBO.compId = 'CH01';
    objBO.clientId = '-'
    objBO.from = '1900/01/01';
    objBO.to = '1900/01/01';
    objBO.Prm1 = '-';
    objBO.Prm2 = '-';
    objBO.Prm3 = '-';
    objBO.loginId = localStorage.getItem('jsEmpCode');
    objBO.Logic = "AutoGenUserId";
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            if (Object.keys(data.ResultSet).length > 0) {
                if (Object.keys(data.ResultSet.Table).length > 0) {
                    $.each(data.ResultSet.Table, function (key, val) {
                        $('#txtUserId').val(val.UserId);
                    });
                }
            }
        },
        error: function (response) {
            alert('Server Error...!');
        }
    });
}
function GetRoleMaster(userFor) {
    $("#AccordionRole").empty();
    var url = config.baseUrl + "/api/ApplicationResources/MasterQueries";
    var objBO = {};
    objBO.Prm1 = '-';
    objBO.Prm2 = userFor;
    objBO.login_id = Active.userId;
    objBO.Logic = "GetRoleMaster";
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            if (Object.keys(data.ResultSet).length > 0) {
                if (Object.keys(data.ResultSet.Table).length > 0) {
                    var panel = '';
                    $.each(data.ResultSet.Table, function (key, val) {
                        var roleName = val.RoleName.replace(/\s/g, '');
                        panel += '<div class="panel panel-default">';
                        panel += '<div class="panel-heading" role="tab" id="headingOne">';
                        panel += '<h4 class="panel-title">';
                        panel += '<a role="button" data-toggle="collapse" data-parent="#accordion" href="#' + roleName + '" aria-expanded="true" aria-controls="collapseOne">';
                        panel += '<i class="more-less glyphicon glyphicon-plus" data-roleid=' + val.RoleId + '></i>';
                        panel += '' + val.RoleName + '';
                        panel += '</a>';
                        panel += '<button class="assign btn-success btn-go" style="color:#3db13d" data-roleid=' + val.RoleId + '>Allot</button>';
                        panel += '</h4>';
                        panel += '</div>';
                        panel += '<div id="' + roleName + '" class="panel-collapse collapse" role="tabpanel" aria-labelledby="headingOne">';
                        panel += '<div class="panel-body" style="padding:0">';
                        panel += '<div class="scroll">';
                        panel += '<table class="table table-bordered" id="tblRole' + val.RoleId + '">';
                        panel += '<thead>';
                        panel += '<tr>';
                        panel += '<th style="width: 25%;">Menu Id</th>';
                        panel += '<th>Menu Name</th>';
                        panel += '</tr>';
                        panel += '</thead>';
                        panel += '<tbody>';
                        panel += '</tbody>';
                        panel += '</table>';
                        panel += '</div>';
                        panel += '</div>';
                        panel += '</div></div>';
                    });
                    $("#AccordionRole").append(panel);
                }
            }
        },
        error: function (response) {
            alert('Server Error...!');
        }
    });
}
function AllotedRoles(UserId) {
    $("#AccordionAllotedRole").empty();
    var url = config.baseUrl + "/api/ApplicationResources/MasterQueries";
    var objBO = {};
    objBO.Prm1 = UserId;
    objBO.Prm2 = '-';
    objBO.login_id = Active.userId;
    objBO.Logic = "RoleAllotedToUser";
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            if (Object.keys(data.ResultSet).length > 0) {
                if (Object.keys(data.ResultSet.Table).length > 0) {
                    var panel = '';
                    $.each(data.ResultSet.Table, function (key, val) {
                        var roleName = val.RoleName.replace(/\s/g, '');
                        panel += '<div class="panel panel-default">';
                        panel += '<div class="panel-heading" role="tab" id="headingOne">';
                        panel += '<h4 class="panel-title">';
                        panel += '<a role="button" data-toggle="collapse" data-parent="#accordion" href="#Alloted' + roleName + '" aria-expanded="true" aria-controls="collapseOne">';
                        panel += '<i class="more-less glyphicon glyphicon-plus" data-roleid=' + val.RoleId + '></i>';
                        panel += '' + val.RoleName + '';
                        panel += '</a>';
                        panel += '<button class="assign btn-danger btn-go" style="color:#3db13d" data-roleid=' + val.RoleId + '>Delete</button>';
                        panel += '</h4>';
                        panel += '</div>';
                        panel += '<div id="Alloted' + roleName + '" class="panel-collapse collapse" role="tabpanel" aria-labelledby="headingOne">';
                        panel += '<div class="panel-body" style="padding:0">';
                        panel += '<div class="scroll">';
                        panel += '<table class="table table-bordered" id="tblAlloted' + val.RoleId + '">';
                        panel += '<thead>';
                        panel += '<tr>';
                        panel += '<th style="width: 25%;">Menu Id</th>';
                        panel += '<th>Menu Name</th>';
                        panel += '</tr>';
                        panel += '</thead>';
                        panel += '<tbody>';
                        panel += '</tbody>';
                        panel += '</table>';
                        panel += '</div>';
                        panel += '</div>';
                        panel += '</div></div>';
                    });
                    $("#AccordionAllotedRole").append(panel);
                }
            }
        },
        error: function (response) {
            alert('Server Error...!');
        }
    });
}
function GetMenuByRole(roleId, tbl) {
    var url = config.baseUrl + "/api/ApplicationResources/MasterQueries";
    var objBO = {};
    objBO.Prm1 = roleId;
    objBO.Prm2 = '-';
    objBO.login_id = Active.userId;
    objBO.Logic = "GetMenuByRole";
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            $(tbl + " tbody").empty();
            var tbody = '';
            $.each(data.ResultSet.Table, function (key, val) {
                tbody += "<tr>";
                tbody += "<td>" + val.menu_id + "</td>";
                tbody += "<td>" + val.menu_name + "</td>";
                tbody += "</tr>";
            });
            $(tbl + " tbody").append(tbody);
        },
        error: function (response) {
            alert('Server Error...!');
        }
    });
}
function GetCentreMaster() {
    var url = config.baseUrl + "/api/ApplicationResources/MasterQueries";
    var objBO = {};
    objBO.Prm1 = '-';
    objBO.Prm2 = '-';
    objBO.login_id = Active.userId;
    objBO.Logic = "GetCentreMaster";
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            $("#tblCentre tbody").empty();
            var tbody = '';
            var AllotedCentres = [];
            $("#tblAllotedCentre tbody tr").each(function () {
                AllotedCentres.push($(this).find('td:eq(1)').text())
            });
            $.each(data.ResultSet.Table, function (key, val) {
                if (!($.inArray(val.centreId, AllotedCentres) > -1)) {
                    tbody += "<tr>";
                    tbody += "<td><input type='checkbox' checked/></td>";
                    tbody += "<td style='display:none'>" + val.centreId + "</td>";
                    tbody += "<td>" + val.centre_name + "</td>";
                    tbody += "<td>" + val.districtName + "</td>";
                    tbody += "<td><button class='btn-success btn-go' data-centreid=" + val.centreId + ">Allot</button></td>";
                    tbody += "</tr>";
                }
            });
            $("#tblCentre tbody").append(tbody);
        },
        error: function (response) {
            alert('Server Error...!');
        }
    });
}
function GetAllotedCentre(userId) {
    var url = config.baseUrl + "/api/ApplicationResources/MasterQueries";
    var objBO = {};
    objBO.Prm1 = userId;
    objBO.Prm2 = '-';
    objBO.login_id = Active.userId;
    objBO.Logic = "GetCentreAllotedToUser";
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            $("#tblAllotedCentre tbody").empty();
            var tbody = '';
            $.each(data.ResultSet.Table, function (key, val) {
                tbody += "<tr>";
                tbody += "<td><input type='checkbox'/></td>";
                tbody += "<td style='display:none'>" + val.centreId + "</td>";
                tbody += "<td>" + val.centre_name + "</td>";
                tbody += "<td>" + val.districtName + "</td>";
                tbody += "<td><button class='btn-danger btn-go' data-centreid=" + val.centreId + ">Delete</button></td>";
                tbody += "</tr>";
            });
            $("#tblAllotedCentre tbody").append(tbody);
        },
        complete: function () {
            GetCentreMaster();
        },
        error: function (response) {
            alert('Server Error...!');
        }
    });
}
function GetUserInfo() {
    $('#tblUserInfo tbody').empty();
    var url = config.baseUrl + "/api/Patient/B2B_PatientQueries";
    var objBO = {};
    objBO.unitId = 'CH01';
    objBO.compId = 'CH01';
    objBO.clientId = '-'
    objBO.from = '1900/01/01';
    objBO.to = '1900/01/01';
    objBO.Prm1 = $('#txtUserId').val()
    objBO.Prm2 = '-';
    objBO.Prm3 = '-';
    objBO.loginId = localStorage.getItem('jsEmpCode');
    objBO.Logic = "GetUserInfo";
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            var tbody = '';
            var temp = '';
            //var jsonData = [data.ResultSet.Table[0]];
            //for (var j in Object.keys(data.ResultSet.Table[0])) {
            //	console.log(j);
            //}
            if (Object.keys(data.ResultSet).length > 0) {
                if (Object.keys(data.ResultSet.Table).length > 0) {
                    $.each(data.ResultSet.Table, function (key, val) {
                        if (temp != val.UserType) {
                            tbody += "<tr style='background:#fbf4d4'>";
                            tbody += "<td colspan='5'>" + val.UserType + " User Info</td>";
                            tbody += "</tr>";
                            temp = val.UserType
                        }
                        tbody += "<tr>";
                        tbody += "<td>";
                        tbody += "<label class='switch'>";
                        tbody += "<input type='checkbox' onchange=UpdateStatus('" + val.UserId + "') data-userid=" + val.UserId + " data-isactive=" + val.IsActive + " class='IsActive' id='chkActive' " + val.checked + ">";
                        tbody += "<span class='slider round'></span>";
                        tbody += "</label>";
                        tbody += "</td>";
                        tbody += "<td>" + val.UserId + "</td>";
                        tbody += "<td>" + val.UserName + "</td>";
                        tbody += "<td>" + val.mobile_no + "</td>";
                        tbody += "<td style='display:none'>" + val.UserType + "</td>";
                        // tbody += "<td>-</td>";
                        tbody += "<td><button id='btnGetInfo' class='btn-danger'><i class='fa fa-sign-in'></i></button></td>";
                        tbody += "</tr>";
                    });
                    $('#tblUserInfo tbody').append(tbody);
                }
            }
        },
        error: function (response) {
            alert('Server Error...!');
        }
    });
}
function InsertUser() {
    if (Validation()) {
        var url = config.baseUrl + "/api/AccessControl/Config_InsertUpdate";
        var objBO = {};
        objBO.unit_id = '-';
        objBO.menu_id = $('#ddlUserType option:selected').text();
        objBO.sub_menu_id = '-';
        objBO.menu_name = $('#txtUserName').val();
        objBO.emp_code = $('#txtUserId').val();
        objBO.Prm1 = $('#txtDesignation').val();
        objBO.Prm2 = $('#txtMobileNo').val();
        objBO.login_id = Active.userId;
        objBO.Logic = 'InsertUserInfo';
        $.ajax({
            method: "POST",
            url: url,
            data: JSON.stringify(objBO),
            dataType: "json",
            contentType: "application/json;charset=utf-8",
            success: function (data) {
                if (data.includes('Success')) {
                    alert(data);
                    GetUserInfo();
                    $('#txtUserId').val('');
                    $('#txtUserName').val('');
                    $('#txtMobileNo').val('');
                    $('#txtDesignation').val('');
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
function UpdateStatus(userId) {
    var url = config.baseUrl + "/api/AccessControl/Config_InsertUpdate";
    var objBO = {};
    objBO.unit_id = '-';
    objBO.menu_id = '-';
    objBO.sub_menu_id = '-';
    objBO.menu_name = '-';
    objBO.emp_code = userId;
    objBO.Prm1 = '-';
    objBO.Prm2 = '-';
    objBO.login_id = Active.userId;
    objBO.Logic = 'UpdateStatus';
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            GetUserInfo();
        },
        error: function (response) {
            alert('Server Error...!');
        }
    });
}

function Validation() {
    var UserType = $('#ddlUserType option:selected').text();
    var UserId = $('#txtUserId').val();
    var UserName = $('#txtUserName').val();
    var MobileNo = $('#txtMobileNo').val();
    if (UserId == '') {
        alert('Please Provide User-Id.');
        $('#txtUserId').css('border-color', 'red').focus();
        return false;
    }
    else {
        $('#txtUserId').removeAttr('style');
    }
    if (UserName == '') {
        alert('Please Provide User Name');
        $('#txtUserName').css('border-color', 'red').focus();
        return false;
    }
    else {
        $('#txtUserName').removeAttr('style');
    }
    if (MobileNo == '') {
        alert('Please Provide Mobile No');
        $('#txtMobileNo').css('border-color', 'red').focus();
        return false;
    } else if (MobileNo.length < 10) {
        alert('Mobile No Should be 10 Digit.');
        $('#txtMobileNo').css('border-color', 'red').focus();
        return false;
    }
    else {
        $('#txtMobileNo').removeAttr('style');
    }
    return true;
}
//Client Operation

function EmpWiseClient() {
    //if ($('#ddlEmployee option:selected').val() == '-') {
    //    alert('Select Employee')
    //    return
    //}

    $('#tblClient tbody').empty();
    $('#tblAssignClient tbody').empty();
    var url = config.baseUrl + "/api/GeneralStore/MasterQueries";
    var objBO = {};
    objBO.hosp_id = Active.unitId;
    objBO.vendor_id = _userId;
    objBO.login_id = Active.userId;
    objBO.Logic = 'B2BUserRightList';
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        contentType: 'application/json;charset=utf-8',
        dataType: "JSON",
        success: function (data) {
            if (Object.keys(data.ResultSet).length > 0) {
                if (Object.keys(data.ResultSet.Table).length > 0) {
                    let tbody = '';
                    $.each(data.ResultSet.Table, function (key, val) {
                        tbody += "<tr>";
                        tbody += "<td style='text-align:center'><input type='checkbox' data-clientid='" + val.ClientId + "' class='unitchk' /></td>";
                        tbody += "<td class='hide'>" + val.ClientId + "</td>";
                        tbody += "<td>" + val.ClientName + "</td>";
                        tbody += "</tr>";
                    })
                    $('#tblClient tbody').append(tbody);
                }
            }
            if (Object.keys(data.ResultSet).length > 1) {
                if (Object.keys(data.ResultSet.Table1).length > 0) {
                    let tbody = '';
                    $.each(data.ResultSet.Table1, function (key, val) {
                        var IsDefault = (val.isActive == 'Y') ? '#d7ffca' : '';
                        tbody += "<tr style='background:" + IsDefault + "'>";
                        tbody += "<td style='text-align:center'><input type='checkbox' data-clientid='" + val.ClientId + "' class='assginchk' /></td>";
                        tbody += "<td class='hide'>" + val.ClientId + "</td>";
                        tbody += "<td>" + val.ClientName + "</td>";
                        tbody += "</tr>";
                    })
                    $('#tblAssignClient tbody').append(tbody);
                }
            }
        },

        error: function (response) {
            console.log(response)
        }
    });
}

function LinkClientEmp(logicName) {
    var Empname = $('#ddlEmployee option:selected').val();
    if (Empname == 'Select') {
        $('#ddlEmployee').focus();
        alert('Please select Employee Name ..');
        return;
    }
    var url = config.baseUrl + "/api/GeneralStore/GS_InsertClientMaster";
    var objBO = {};
    var clientLinkList = [];
    $('#tblClient tbody').find('tr').each(function () {
        var ischecked = $(this).find('input[type="checkbox"]').is(':checked');
        if (ischecked) {
            clientLinkList.push($(this).find('td:eq(0)').find('input').data('clientid'));
        }
    });
    objBO.ClientName = _userId;
    objBO.Address = clientLinkList.join('|');
    objBO.LoginId = Active.userId;
    objBO.Logic = logicName;
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            if (data.includes('Success')) {               
                $('input:checkbox').removeAttr('checked');
                EmpWiseClient();
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

function LinkdeleteEmp(logicName) {
    var Empname = $('#ddlEmployee option:selected').val();
    if (Empname == 'Select') {
        $('#ddlEmployee').focus();
        alert('Please select Employee Name ..');
        return;
    }
    var url = config.baseUrl + "/api/GeneralStore/GS_InsertClientMaster";
    var objBO = {};
    var clientLinkList = [];
    $('#tblAssignClient tbody').find('tr').each(function () {
        var ischecked = $(this).find('input[type="checkbox"]').is(':checked');
        if (ischecked) {
            clientLinkList.push($(this).find('td:eq(0)').find('input').data('clientid'));
        }
    });
    objBO.ClientName = _userId;
    objBO.Address = clientLinkList.join('|');
    objBO.LoginId = Active.userId;
    objBO.Logic = logicName;
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            if (data.includes('Success')) {               
                $('input:checkbox').removeAttr('checked');
                EmpWiseClient();
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
