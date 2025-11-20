$(document).ready(function () {
    $('#ddlEmployee').empty().append($('<option></option>').val('-').html('Select Employee'));
});
function SearchEmployee() {
    $('#ddlEmployee').empty().append($('<option></option>').val('-').html('Select Employee'));
    if ($('#txtSearchEmp').val().length < 3)
        return

    var url = config.baseUrl + "/api/AccessControl/Auth_ConfigQueries";
    var objBO = {};
    objBO.LoginId = '-';
    objBO.Password = '-';
    objBO.Prm1 = $('#txtSearchEmp').val();
    objBO.Prm2 = '-';
    objBO.Logic = 'SearchEmployee'
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),            
        contentType: 'application/json;charset=utf-8',
        dataType: "JSON",
        success: function (data) {
            if (Object.keys(data.ResultSet).length > 0) {
                $.each(data.ResultSet.Table, function (key, val) {
                    $('#ddlEmployee').append($('<option></option>').val(val.user_code).html(val.user_name));
                })
            }
        },
        error: function (response) {
            console.log(response)
        }
    });
}
function EmpWiseMenu() {
    $('#MenuList').empty();
    $('#AllotedMenuList').empty();
    var url = config.baseUrl + "/api/AccessControl/Auth_ConfigQueries";
    var objBO = {};
    objBO.LoginId = $('#ddlEmployee option:selected').val();
    objBO.Password = '-';
    objBO.Prm1 = '-';
    objBO.Prm2 = '-';
    objBO.Logic = 'EmpWiseMenu'
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        contentType: 'application/json;charset=utf-8',
        dataType: "JSON",
        success: function (data) {
            if (Object.keys(data.ResultSet).length > 0) {
                let html = "";
                let roleList = [...new Map(data.ResultSet.Table.map(item => [item['role_id'], item['role_name']]))];
                $.each(roleList, function (key, val) {
                    html += "<div class='accordion-item' data-milestone=" + val[0] + ">";
                    html += "<h2 class='accordion-header' id=heading" + val[0] + "><label><input data-type='role' type='checkbox' checked/>&nbsp;" + val[1] + "</label>";
                    html += "<button class='accordion-button collapsed' type='button' data-bs-toggle='collapse' data-bs-target='#" + val[0] + "' aria-expanded='false' aria-controls=" + val[0] + "></button>";
                    html += "</h2>";
                    html += "<div id=" + val[0] + " class='accordion-collapse collapse' aria-labelledby=heading" + val[0] + " data-bs-parent='#accordioncustomicon1Example'>";
                    html += "<div class='accordion-body'>";
                    let menuFilter = data.ResultSet.Table.filter(item => item.role_id == val[0]);
                    let menuList = [...new Map(menuFilter.map(item => [item['menu_id'], item['menu_name']]))];
                    for (var i = 0; i < menuList.length; i++) {
                        html += "<label class='menu'><Input data-type='menu' type='checkbox' checked data-menuid=" + menuList[i][0] + "/>&nbsp;" + menuList[i][1] + "</label>";
                        html += "<ul>";
                        let subMenuList = data.ResultSet.Table.filter(item => item.role_id == val[0] && item.menu_id == menuList[i][0]);
                        for (var j = 0; j < subMenuList.length; j++) {
                            html += "<li><label><Input data-type='submenu' type='checkbox' checked data-submenuid='" + subMenuList[j].sub_menu_id + "'/>&nbsp;" + subMenuList[j].sub_menu_name + "</label></li>";
                        }
                        html += "</ul>";
                    }
                    html += "</div>";
                    html += "</div>";
                    html += "</div>";
                })
                $('#MenuList').append(html);
            }
            if (Object.keys(data.ResultSet).length > 1) {
                let html = "";
                let roleList = [...new Map(data.ResultSet.Table1.map(item => [item['role_id'], item['role_name']]))];
                $.each(roleList, function (key, val) {
                    html += "<div class='accordion-item' data-milestone=" + val[0] + ">";
                    html += "<h2 class='accordion-header' id=headingA" + val[0] + "><label><input data-type='role' type='checkbox' checked/>&nbsp;" + val[1] + "</label>";
                    html += "<button class='accordion-button collapsed' type='button' data-bs-toggle='collapse' data-bs-target='#A" + val[0] + "' aria-expanded='false' aria-controls=A" + val[0] + "></button>";
                    html += "</h2>";
                    html += "<div id=A" + val[0] + " class='accordion-collapse collapse' aria-labelledby=headingA" + val[0] + " data-bs-parent='#accordioncustomicon1Example'>";
                    html += "<div class='accordion-body'>";
                    let menuFilter = data.ResultSet.Table1.filter(item => item.role_id == val[0]);
                    let menuList = [...new Map(menuFilter.map(item => [item['menu_id'], item['menu_name']]))];
                    for (var i = 0; i < menuList.length; i++) {
                        html += "<label class='menu'><Input type='checkbox' checked data-type='menu' data-menuid=" + menuList[i][0] + "/>&nbsp;" + menuList[i][1] + "</label>";
                        html += "<ul>";
                        let subMenuList = data.ResultSet.Table1.filter(item => item.role_id == val[0] && item.menu_id == menuList[i][0]);
                        for (var j = 0; j < subMenuList.length; j++) {
                            html += "<li><label><Input type='checkbox' data-type='submenu' checked data-submenuid='" + subMenuList[j].sub_menu_id + "'/>&nbsp;" + subMenuList[j].sub_menu_name + "</label></li>";
                        }
                        html += "</ul>";
                    }
                    html += "</div>";
                    html += "</div>";
                    html += "</div>";
                })
                $('#AllotedMenuList').append(html);
                $('input:checkbox').on('change', function () {
                    if ($(this).data('type') == 'role')
                        $(this).parents('.accordion-item').find('.accordion-body').find('input:checkbox').prop('checked', $(this).is(':checked'))

                    if ($(this).data('type') == 'menu')
                        $(this).closest('label').next('ul').find('input:checkbox').prop('checked', $(this).is(':checked'))
                })
            }
        },
        complete: function (response) {
            EmpWiseUnit();
        },
        error: function (response) {
            console.log(response)
        }
    });
}
function EmpWiseUnit() {
    if ($('#ddlEmployee option:selected').val() == '-') {
        alert('Select Employee')
        return
    }
    $('#tblUnit tbody').empty();
    $('#tblAssignUnit tbody').empty();
    var url = config.baseUrl + "/api/AccessControl/Auth_ConfigQueries";
    var objBO = {};
    objBO.LoginId = $('#ddlEmployee option:selected').val();
    objBO.Password = '-';
    objBO.Prm1 = '-';
    objBO.Prm2 = '-';
    objBO.Logic = 'EmpWiseUnit'
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
                        tbody += "<td><input type='checkbox' checked data-unitid='" + val.Unit_Code + "' /></td>";
                        tbody += "<td class='hide'>" + val.Unit_Code + "</td>";
                        tbody += "<td>" + val.unit_name + "</td>";
                        tbody += "</tr>";
                    })
                    $('#tblUnit tbody').append(tbody);
                }
            }
            if (Object.keys(data.ResultSet).length > 1) {
                if (Object.keys(data.ResultSet.Table1).length > 0) {
                    let tbody = '';
                    $.each(data.ResultSet.Table1, function (key, val) {
                        var IsDefault = (val.default_flag == 'Y') ? '#d7ffca' : '';
                        tbody += "<tr style='background:" + IsDefault + "' ondblclick=SetDefaultUnit('" + val.Unit_Code + "')>";
                        tbody += "<td><input type='checkbox' checked data-unitid='" + val.Unit_Code + "' /></td>";
                        tbody += "<td class='hide'>" + val.Unit_Code + "</td>";
                        tbody += "<td>" + val.unit_name + "</td>";
                        tbody += "</tr>";
                    })
                    $('#tblAssignUnit tbody').append(tbody);
                }
            }
        },
        //complete: function () {
        //    $('#modalUnit').modal('show');
        //},
        error: function (response) {
            console.log(response)
        }
    });
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
    objBO.comp_id = Active.compId;
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
function SetDefaultUnit(unitId) {
    var url = config.baseUrl + "/api/AccessControl/Config_InsertUpdate";
    var objBO = {};
    objBO.unit_id = unitId;
    objBO.menu_id = '-';
    objBO.sub_menu_id = '-';
    objBO.menu_name = '-';
    objBO.emp_code = $('#ddlEmployee option:selected').val();
    objBO.Prm1 = '-';
    objBO.Prm2 = '-';
    objBO.login_id = Active.userId;
    objBO.Logic = 'SetDefaultUnit';
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        contentType: 'application/json;charset=utf-8',
        dataType: "JSON",
        success: function (data) {
            EmpWiseUnit();
        },
        error: function (response) {
            console.log(response)
        }
    });
}