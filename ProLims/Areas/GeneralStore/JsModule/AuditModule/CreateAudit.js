
$(document).ready(function () {
    OnLoad();
    $('#txtSearch').on('keyup', function () {
        var val = $(this).val().toLocaleLowerCase();
        $('#tblAuditMaster tbody tr').filter(function () {
            $(this).toggle($(this).text().toLocaleLowerCase().indexOf(val) > -1);
        });
    });
});

function OnLoad() {
    $('#tblAuditMaster tbody').empty();
    var url = config.baseUrl + "/api/Audit/AuditQueries";
    var objBO = {};
    objBO.CompId = Active.compId;
    objBO.UnitId = Active.unitId;
    objBO.Logic = "OnLoad";
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            if (data.ResultSet.Table.length > 0) {
                var tbody = "";
                $.each(data.ResultSet.Table, function (key, val) {
                    tbody += "<tr>";
                    tbody += "<td>" + val.audit_no + "</td>";
                    tbody += "<td>" + val.audit_remark + "</td>";
                    tbody += "<td>" + val.cr_date + "</td>";
                    tbody += "<td><button class='btn-danger btn-xs' onclick=DeleteAuditMaster('" + val.audit_no + "')>Delete</button></td>";
                    tbody += "</tr>";;
                });
                $('#tblAuditMaster tbody').append(tbody);
            }
        },
        error: function (err) {
            alert(err.responseText);
        }
    });
}
function InsertAuditMaster() {
    if (validate()) {
        var url = config.baseUrl + "/api/Audit/InsertAuditMaster";
        var objBO = {};
        objBO.CartId = '-';
        objBO.audit_no = '';
        objBO.CompId = Active.compId;
        objBO.UnitId = Active.unitId;
        objBO.audit_remark = $('#txtRemark').val();
        objBO.login_id = Active.userId;
        objBO.IsOpen = 'OPEN';
        objBO.Logic = "Insert";
        $.ajax({
            method: "POST",
            url: url,
            data: JSON.stringify(objBO),
            dataType: "json",
            contentType: "application/json;charset=utf-8",
            success: function (data) {
                alert(data);
                OnLoad();
                $('#txtRemark').val('');
            },
            error: function (err) {
                alert(err.responseText);
            }
        });
    }
}
function DeleteAuditMaster(auditno) {
    var url = config.baseUrl + "/api/Audit/InsertAuditMaster";
    var objBO = {};
    objBO.audit_no = auditno;
    objBO.Logic = "Delete";
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            OnLoad();
        },
        error: function (err) {
            alert(err.responseText);
        }
    });
}
function validate() {
    Cart = $('#ddlCart option:selected').val();

    if (Cart == 'Select Cart') {
        $('span.selection').find('span[aria-labelledby=select2-ddlCart-container]').css('border-color', 'red').focus();
        alert('Please Select Department And Cart');
        return false;
    }
    else {
        $('span.selection').find('span[aria-labelledby=select2-ddlCart-container]').removeAttr('style');
    }
    return true;
}