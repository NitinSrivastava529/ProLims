

$(document).ready(function () {
    GetPackTypeList();
    $('#txtSearch').on('keyup', function () {
        var val = $(this).val().toLocaleLowerCase();
        $('#tblPack tbody tr').filter(function () {
            $(this).toggle($(this).text().toLocaleLowerCase().indexOf(val) > -1);
        });
    });

    $('#ddlNOS').on('change', function () {
        var nos = $(this).val();
        var qty = $('#txtPackQty').val();
        var packType = '1X' + qty + ' ' + nos;
        if (qty != '') {
            $('#txtPackType').val(packType);
            $('select').prop('selectedIndex', 0);
        }
        else {
            $('#txtPackQty').css({ 'border-color': 'red' });
            alert('Please Provide Pack Qty..');
        }
    });

    $('#btnSavePackType').on('click', function () {
        var val = $(this).val();
        if (val == 'Submit') {
            InsertPackType();
        }
        else if (val == 'Update') {
            UpdatePackType();
        }
    });
    $('#tblPack tbody').on('click', '#btndelete', function () {
        var Autoid = $(this).closest('tr').find('td:eq(0)').text();
        UpdateStatus(Autoid);
    });
});
function GetPackTypeList() {
    $('#tblPack tbody').empty();
    var url = config.baseUrl + "/api/GeneralStore/MasterQueries";
    var objBO = {};
    objBO.Logic = 'GetPackTypeList1';
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            var tbody = "";
            if (data != '') {
                $.each(data.ResultSet.Table, function (key, val) {
                    tbody += "<tr>";
                    tbody += "<td hidden>" + val.autoid + "</td>";
                    tbody += "<td>" + val.pack_type + "</td>";
                    tbody += "<td style='text-align:center'>" + val.pack_qty + "</td>";
                    tbody += "<td style='text-align:center'>" +
                        '<button type="button" id="btndelete" class="btn-danger"> <i class="fa fa-close"></i></button> ' +
                        "</td>";
                    tbody += "</tr>";
                });
                $("#tblPack tbody").append(tbody);
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

function InsertPackType() {
    if (Validate()) {
        var url = config.baseUrl + "/api/GeneralStore/InsertUpdatePackType";
        var objBO = {};
        objBO.CompId = Active.compId;
        objBO.pack_type = $('#txtPackType').val();
        objBO.pack_qty = $('#txtPQty').val();
        objBO.login_id = Active.userId;
        objBO.Logic = 'Insert';
        $.ajax({
            method: "POST",
            url: url,
            data: JSON.stringify(objBO),
            dataType: "json",
            contentType: "application/json;charset=utf-8",
            success: function (data) {
                if (data == 'Successfully Saved') {
                    Clear();
                    alert(data);
                    GetPackTypeList();
                }
                else {
                    alert(data);
                };
            },
            error: function (response) {
                alert('Server Error...!');
            }
        });
    }
}
function Validate() {
    var packType = $('#txtPackType').val();
    var packQty = $('#txtPackQty').val();
    var pQty = $('#txtPQty').val();
    if (packType == '') {
        $('#txtPackType').css({ 'border-color': 'red' });
        alert('Please Provide Pack Type..');
        return false;
    }
    else {
        $('#txtPackType').removeAttr('style').focus();
    }
    if (pQty == '') {
        $('#txtPQty').css({ 'border-color': 'red' });
        alert('Please Provide Pack Qty..');
        return false;
    }
    else {
        $('#txtPQty').removeAttr('style').focus();
    }
    return true;
}
function Clear() {
    $('input[type=text]').val('');
    $('select').prop('selectedIndex', 0);
    $('#btnSavePackType').val('Submit').removeClass('btn-warning').addClass('btn-success');
}
function UpdateStatus(autoid) {
    var url = config.baseUrl + "/api/GeneralStore/InsertUpdatePackType";
    var objBO = {};
    objBO.autoid = autoid;
    objBO.Logic = 'UpdateStatus';
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            GetPackTypeList();
        },
        error: function (response) {
            alert('Server Error...!');
        }
    });
}