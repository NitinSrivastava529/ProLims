$(document).ready(function () {
    $('#ddlEmployee').empty().append($('<option></option>').val('-').html('Select Employee'));
    EmpWiseClient();

    $("#chkallName").change(function () {
        if (this.checked) {
            $(".unitchk").each(function () {
                this.checked = true;
            })
        } else {
            $(".unitchk").each(function () {
                this.checked = false;
            })
        }
    });
    $("#chkallssgin").change(function () {
        if (this.checked) {
            $(".assginchk").each(function () {
                this.checked = true;
            })
        } else {
            $(".assginchk").each(function () {
                this.checked = false;
            })
        }
    });
});
function SearchEmployee() {
    $('#ddlEmployee').empty().append($('<option></option>').val('-').html('Select Employee'));
    if ($('#txtSearchEmp').val().length < 3)
        return
    var url = config.baseUrl + "/api/GeneralStore/MasterQueries";
    var objBO = {};
    objBO.prm_1 = $('#txtSearchEmp').val();
    objBO.Logic = 'SearchEmployee';
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        contentType: 'application/json;charset=utf-8',
        dataType: "JSON",
        success: function (data) {
            if (Object.keys(data.ResultSet).length > 0) {
                $('#ddlEmployee').empty().append($('<option></option>').val('-').html('Select Employee'));
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
    objBO.vendor_id = $('#ddlEmployee option:selected').val();
    objBO.login_id = Active.userId;
    objBO.Logic = 'UserRightList';
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
                        tbody += "<td style='text-align:center'><input type='checkbox' checked data-clientid='" + val.ClientId + "' class='assginchk' /></td>";
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
    var isConfirmed = confirm('Are you sure you want to User Rights the data?');
    if (isConfirmed) {
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
        objBO.ClientName = $('#ddlEmployee option:selected').val();
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
                    alert(data);
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
    } else {
        alert("Cancelled");
    }
}

function LinkdeleteEmp(logicName) {
    var isConfirmed = confirm('Are you sure you want to Delete Rights the data?');
    if (isConfirmed) {
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
        objBO.ClientName = $('#ddlEmployee option:selected').val();
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
                    alert(data);
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
    } else {
        alert("Cancelled");
    }
}


