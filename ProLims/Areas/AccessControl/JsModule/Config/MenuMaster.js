var _menuId = null;
var _subMenuId = null;
$(document).ready(function () {
    $('#ddlMainMenu').empty().append($('<option></option>').val('-').html('Select Main Menu'));
    $('#ddlAssignRole').empty().append($('<option></option>').val('-').html('Select Role'));
    GetMenuInfo();
});
function Toggle(elem) {
    $(elem).toggleClass('on')
    if ($(elem).data('init') == 'mm')
        InsertUpdate('MainMenu:Status|' + $(elem).closest('tr').find('td:eq(0)').text() + '');
    else
        InsertUpdate('SubMenu:Status|' + $(elem).closest('tr').find('td:eq(2)').text() + '');
}
function GetMenuInfo() {
    $('#tblMainMenu tbody').empty();
    $('#tblSubMenu tbody').empty();
    var url = config.baseUrl + "/api/AccessControl/Auth_ConfigQueries";
    var objBO = {};
    objBO.LoginId = $('#ddlEmployee option:selected').val();
    objBO.Password = '-';
    objBO.Prm1 = '-';
    objBO.Prm2 = '-';
    objBO.Logic = 'GetMenuInfo'
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
                        var status = (val.active_flag == 'Y') ? 'on' : '-';
                        tbody += "<tr>";
                        tbody += "<td class='hide'>" + val.menu_id + "</td>";
                        tbody += "<td>";
                        tbody += "<div data-init='mm' class='toggle toggle-sm toggle-success mb-3 " + status + "'  onclick=Toggle(this)>";
                        tbody += "<span></span>";
                        tbody += "</div>";
                        tbody += "</td>";
                        tbody += "<td>" + val.menu_name + "</td>";
                        tbody += "<td><i class='" + val.icon + "'></i></td>";
                        tbody += "<td><button onclick=EditMainMenu(this) class='btn btn-outline-dark btn-sm'><i class='fa fa-edit'>&nbsp;</i>Edit</button></td>";
                        tbody += "</tr>";

                        $('#ddlMainMenu').append($('<option></option>').val(val.menu_id).html(val.menu_name));
                    })
                    $('#tblMainMenu tbody').append(tbody);
                }
            }
            if (Object.keys(data.ResultSet).length > 1) {
                if (Object.keys(data.ResultSet.Table1).length > 0) {
                    let tbody = '';
                    let temp = '';
                    $.each(data.ResultSet.Table1, function (key, val) {
                        if (temp != val.role_id) {
                            tbody += "<tr style='background:#ddd'>";
                            tbody += "<td colspan='5'><b>Role : </b>" + val.role_name + "</td>";
                            tbody += "</tr>";
                            temp = val.role_id
                        }
                        var status = (val.active_flag == 'Y') ? 'on' : '-';
                        tbody += "<tr>";
                        tbody += "<td class='hide'>" + val.role_id + "</td>";
                        tbody += "<td class='hide'>" + val.menu_id + "</td>";
                        tbody += "<td class='hide'>" + val.sub_menu_id + "</td>";
                        tbody += "<td>";
                        tbody += "<div data-init='sm' class='toggle toggle-sm toggle-success mb-3 " + status + "' onclick=Toggle(this)>";
                        tbody += " <span></span>";
                        tbody += "</div>";
                        tbody += "</td>";
                        tbody += "<td>" + val.menu_name + "</td>";
                        tbody += "<td>" + val.sub_menu_name + "</td>";
                        tbody += "<td>" + val.sub_menu_link + "</td>";
                        tbody += "<td><button onclick=EditSubMenu(this) class='btn btn-outline-dark btn-sm'><i class='fa fa-edit'>&nbsp;</i>Edit</button></td>";
                        tbody += "</tr>";
                    })
                    $('#tblSubMenu tbody').append(tbody);
                }
            }
            $.each(data.ResultSet.Table2, function (key, val) {
                $('#ddlAssignRole').append($('<option></option>').val(val.role_id).html(val.role_name));
            })
        },
        error: function (response) {
            console.log(response)
        }
    });
}
function EditMainMenu(elem) {
    _menuId = $(elem).closest('tr').find('td:eq(0)').text();
    $('#txtMainMenu').val($(elem).closest('tr').find('td:eq(2)').text());
    $('#txtIcon').val($(elem).closest('tr').find('td:eq(3) i').attr('class'));
    $('#btnMainMenu').find('i').removeClass('fa-plus').addClass('fa-edit');
}
function EditSubMenu(elem) {
    _subMenuId = $(elem).closest('tr').find('td:eq(2)').text();
    $('#txtSubMenuName').val($(elem).closest('tr').find('td:eq(5)').text());
    $('#txtSubMenuUrl').val($(elem).closest('tr').find('td:eq(6)').text());
    $('#ddlMainMenu').val($(elem).closest('tr').find('td:eq(1)').text())
    $('#ddlAssignRole').val($(elem).closest('tr').find('td:eq(0)').text())
    $('#btnSubMenu').find('i').removeClass('fa-plus').addClass('fa-edit');
}

function AllotMenu(logic) {
    if ($.inArray(logic, ['AssignMenu', 'DeleteMenu']) > -1) {
        if (logic.includes('Assign') && [...$('#MenuList').find('input[data-type=submenu]:checked').map((i, v) => $(v).data('submenuid'))].length == 0) {
            alert('select Sub Menu')
            return
        }
        if (logic.includes('Delete') && [...$('#AllotedMenuList').find('input[data-type=submenu]:checked').map((i, v) => $(v).data('submenuid'))].length == 0) {
            alert('select Sub Menu')
            return
        }
    }
    if ($.inArray(logic, ['AssignUnit', 'DeleteUnit']) > -1) {
        if (logic.includes('Assign') && [...$('#tblUnit tbody input:checkbox:checked').map((i, v) => $(v).data('unitid'))].length == 0) {
            alert('select Unit')
            return
        }
        if (logic.includes('Delete') && [...$('#tblAssignUnit tbody input:checkbox:checked').map((i, v) => $(v).data('unitid'))].length == 0) {
            alert('select Unit')
            return
        }
    }
    var url = config.baseUrl + "/api/AccessControl/Config_InsertUpdate";
    var IdsList;
    if ($.inArray(logic, ['AssignMenu', 'DeleteMenu']) > -1) {
        IdsList = (logic.includes('Assign')) ?
            [...$('#MenuList').find('input[data-type=submenu]:checked').map((i, v) => $(v).data('submenuid'))].join(':') :
            [...$('#AllotedMenuList').find('input[data-type=submenu]:checked').map((i, v) => $(v).data('submenuid'))].join(':');
    }
    if ($.inArray(logic, ['AssignUnit', 'DeleteUnit']) > -1) {
        IdsList = (logic.includes('Assign')) ?
            [...$('#tblUnit tbody input:checkbox:checked').map((i, v) => $(v).data('unitid'))].join(':') :
            [...$('#tblAssignUnit tbody input:checkbox:checked').map((i, v) => $(v).data('unitid'))].join(':');
    }
    var objBO = {};
    objBO.unit_id = '-';
    objBO.emp_code = $('#ddlEmployee option:selected').val();
    objBO.Prm1 = IdsList;
    objBO.Prm2 = '-';
    objBO.login_id = Active.userId;
    objBO.Logic = logic;

    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        contentType: 'application/json;charset=utf-8',
        dataType: "JSON",
        success: function (data) {
            if ($.inArray(logic, ['AssignMenu', 'DeleteMenu']) > -1)
                EmpWiseMenu()

            if ($.inArray(logic, ['AssignUnit', 'DeleteUnit']) > -1)
                EmpWiseUnit()
        },
        error: function (response) {
            console.log(response)
        }
    });
}
function InsertUpdate(logic) {
    if (!logic.includes('Status'))
        logic = logic + (logic.includes('MainMenu') ? ((_menuId == null) ? 'Insert' : 'Update') : (_subMenuId == null) ? 'Insert' : 'Update');
    else {
        var logical = logic;
        logic = logic.split('|')[0];
        if (logic.includes('MainMenu'))
            _menuId = logical.split('|')[1]
        else
            _subMenuId = logical.split('|')[1]
    }
    if (!logic.includes('Status')) {
        if (logic.includes('MainMenu')) {
            if ($('#txtMainMenu').val() == '') {
                alert('Please Provide Menu Name')
                return
            }
            if ($('#txtIcon').val() == '') {
                alert('Please Provide Icon Name')
                return
            }
        }
        if (logic.includes('SubMenu')) {
            if ($('#ddlMainMenu option:selected').val() == '-') {
                alert('Please Select Main Menu.')
                return
            }
            if ($('#txtSubMenuName').val() == '') {
                alert('Please Provide Sub Menu Name')
                return
            }
            if ($('#txtSubMenuUrl').val() == '') {
                alert('Please Provide Url')
                return
            }
            if ($('#ddlAssignRole option:selected').val() == '-') {
                alert('Please Select Role.')
                return
            }
        }
    }
    var url = config.baseUrl + "/api/AccessControl/Config_InsertUpdate";
    var objBO = {};
    objBO.unit_id = '-';
    objBO.menu_id = (logic.includes('MainMenu')) ? _menuId : $('#ddlMainMenu option:selected').val();
    objBO.sub_menu_id = _subMenuId;
    objBO.menu_name = (logic.includes('MainMenu')) ? $('#txtMainMenu').val() : $('#txtSubMenuName').val();
    objBO.emp_code = '-';
    objBO.Prm1 = (logic.includes('MainMenu')) ? $('#txtIcon').val() : $('#txtSubMenuUrl').val();
    objBO.Prm2 = $('#ddlAssignRole option:selected').val();
    objBO.login_id = Active.userId;
    objBO.Logic = logic;
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        contentType: 'application/json;charset=utf-8',
        dataType: "JSON",
        success: function (data) {
            if (data.includes('Success') && (!logic.includes('Status'))) {
                if (logic.includes('MainMenu')) {
                    if (_menuId != null) {
                        $('#tblMainMenu tbody tr').each(function () {
                            if ($(this).find('td:eq(0)').text() == _menuId) {
                                $(this).find('td:eq(2)').text($('#txtMainMenu').val());
                                $(this).find('td:eq(3) i').removeAttr('class').addClass($('#txtIcon').val());
                            }
                        });
                    }
                    else {
                        GetMenuInfo()
                    }
                }
                if (logic.includes('SubMenu')) {
                    if (_subMenuId != null) {
                        $('#tblSubMenu tbody tr').each(function () {
                            if ($(this).find('td:eq(2)').text() == _subMenuId) {
                                $(this).find('td:eq(4)').text($('#ddlMainMenu option:selected').text());
                                $(this).find('td:eq(5)').text($('#txtSubMenuName').val());
                                $(this).find('td:eq(6)').text($('#txtSubMenuUrl').val());
                            }
                        });
                    }
                    else {
                        GetMenuInfo()
                    }
                }
                Clear();
            }
        },
        error: function (response) {
            console.log(response)
        }
    });
}
function Clear() {
    _menuId = null;
    _subMenuId = null;
    $('input').val('');
    $('select').val('-')
    $('#btnMainMenu,#btnSubMenu').find('i').removeClass('fa-edit').addClass('fa-plus');
}