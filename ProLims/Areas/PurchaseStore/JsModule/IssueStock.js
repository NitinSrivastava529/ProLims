var _ItemId = "";
; $(document).ready(function () {
    StaffList();
    TodayIssuedList();
    $('#txtIssueItemName').keydown(function (e) {
        var tbody = $('#tblIssuenavigate').find('tbody');
        var selected = tbody.find('.selected');
        var KeyCode = e.keyCode;

        switch (KeyCode) {
            case (KeyCode = 40):
                tbody.find('.selected').removeClass('selected');
                if (selected.next().length == 0) {
                    tbody.find('tr:first').addClass('selected');
                }
                else {
                    tbody.find('.selected').removeClass('selected');
                    selected.next().addClass('selected');
                }
                break;
            case (KeyCode = 38):
                tbody.find('.selected').removeClass('selected');
                if (selected.prev().length == 0) {
                    tbody.find('tr:last').addClass('selected');
                }
                else {
                    selected.prev().addClass('selected');
                }
                break;
            case (KeyCode = 13):
                debugger;
                _ItemId = $('#tblIssuenavigate').find('tbody').find('.selected').data('itemid');
                var itemName = $('#tblIssuenavigate').find('tbody').find('.selected').text();
                $('#btnIssueSaveOrder').data('itemid', _ItemId);
                $('#txtIssueItemName').val(itemName).blur();
                $('#ItemList').hide();
                IssuePackSizeSelection(_ItemId);
                break;
            default:
                var val = $('#txtIssueItemName').val();
                if (val == '') {
                    $('#ItemList').hide();
                }
                else {
                    $('#ItemListDetails').hide();
                    $('#ItemList').show();
                    IssueItemSelection();
                }
                break;
        }
    });
    $(document).on('keydown', function (e) {
        var itemListDetails = $('#ItemListDetails').css('display') == 'block';
        var btnsaveIssue = $('#btnSaveIssueOrder').hasClass('focus1');
        var KeyCode = e.keyCode;
        if (itemListDetails) {
            var tbody = $('#tblIssueItemList').find('tbody');
            var selected = tbody.find('.selected');
            switch (KeyCode) {
                case (KeyCode = 40):
                    tbody.find('.selected').removeClass('selected');
                    if (selected.next().length == 0) {
                        tbody.find('tr:first').addClass('selected');
                    }
                    else {
                        tbody.find('.selected').removeClass('selected');
                        selected.next().addClass('selected');
                    }
                    break;
                case (KeyCode = 38):
                    tbody.find('.selected').removeClass('selected');
                    if (selected.prev().length == 0) {
                        tbody.find('tr:last').addClass('selected');
                    }
                    else {
                        selected.prev().addClass('selected');
                    }
                    break;
                case (KeyCode = 13):
                    var MasterKeyId = $('#tblIssueItemList').find('tbody').find('tr.selected').find('td:nth-child(1)').text();
                    var InStock = $('#tblIssueItemList').find('tbody').find('tr.selected').find('td:nth-child(6)').text();
                    var PackType = $('#tblIssueItemList').find('tbody').find('tr.selected').find('td:nth-child(2)').text();
                    var PQuantity = $('#tblIssueItemList').find('tbody').find('tr.selected').find('td:nth-child(4)').text();
                    var PendOrder = $('#tblIssueItemList').find('tbody').find('tr.selected').find('td:nth-child(5)').text();
                    $('#txtIssueInStock').val(InStock);
                    $('#txtIssuePackType').val(PackType);
                    $('#txtIssuePQuantity').val(PQuantity);
                    $('#txtIssuePendOrder').val(PendOrder);
                    $('#ItemListDetails').hide();
                    $('input[id=txtIssueQuantity]').focus();
                    $('#btnSaveIssueOrder').data('masterkeyid', MasterKeyId);
                    break;
            }
        }
        if (btnsaveIssue) {
            switch (KeyCode) {
                case (KeyCode = 13):
                    var MasterkeyId = $('#btnSaveIssueOrder').data('masterkeyid');
                    InsertIssue(MasterkeyId);
                    break;
            }
        }

    });
    $('#txtIssueQuantity').on('keydown', function (e) {
        var keyCode = e.keyCode;
        if (keyCode == 13) {
            if (ValidateIssue()) {
                $(this).blur();
                $('#btnSaveIssueOrder').addClass('focus1');
            }

        }
    });
    $('#btnSaveIssueOrder').on('click', function () {
        var MasterKeyId = $(this).data('masterkeyid');
        InsertIssue(MasterKeyId);
    });
    $('#tblIssueUnCompleteOrder tbody').on('click', '.delete', function () {
        var RecId = $(this).data('recid');
        IssueDeleteOrder(RecId);
    });
});

function StaffList() {
    var url = config.baseUrl + "/api/GeneralStore/IssueQueries";
    var objBO = {};
    objBO.Logic = "StaffList";
    objBO.UnitId = Active.unitId;
    objBO.LoginId = Active.userId;
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        contentType: "application/json;charset=utf-8",
        dataType: "JSON",
        success: function (data) {
            $('#ddlEmployee').empty().append($('<option>Select Employee</option>'));
            if (data != '') {
                $.each(data.ResultSet.Table, function (key, val) {
                    $('#ItemList').show();
                    $('#ddlEmployee').append($('<option></option>').val(val.emp_code).html(val.emp_name)).select2();
                });
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
function IssueItemSelection() {
    var url = config.baseUrl + "/api/GeneralStore/IssueQueries";
    var objBO = {};
    objBO.UnitId = Active.unitId;
    objBO.Prm1 = $('#txtIssueItemName').val();
    objBO.Logic = ($('input[name=returnProduct]').is(':checked')) ? 'ItemSelectionReturn' : 'ItemSelection';
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        contentType: "application/json;charset=utf-8",
        dataType: "JSON",
        success: function (data) {
            $('#ItemList tbody').empty();
            if (data != '') {
                $.each(data.ResultSet.Table, function (key, val) {
                    $('#ItemList').show();
                    $('<tr class="searchitems" data-itemid=' + val.item_id + '><td>' + val.item_name + "</td></tr>").appendTo($('#ItemList tbody'));
                });
            }
            else {
                $('#ItemList').hide();
            }
        },
        error: function (response) {
            alert('Server Error...!');
        }
    });
}
function IssuePackSizeSelection(ItemId) {
    var url = config.baseUrl + "/api/GeneralStore/IssueQueries";
    var objBO = {};
    objBO.UnitId = Active.unitId;
    objBO.ItemId = ItemId;
    objBO.Logic = ($('input[name=returnProduct]').is(':checked')) ? 'PackSizeSelectionReturn' : 'PackSizeSelection';
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        contentType: "application/json;charset=utf-8",
        dataType: "JSON",
        success: function (data) {
            console.log(data);
            $('#tblIssueItemList tbody').empty();
            if (data != '') {
                $.each(data.ResultSet.Table, function (key, val) {
                    $('#ItemListDetails').show();
                    $('<tr class="searchitemsList"><td>' + val.master_key_id + "</td><td>" + val.pack_type + "</td><td>"
                        + val.batch_no + "</td><td>" + val.pack_qty + "</td><td>" + val.exp_date + "</td><td>"
                        + val.qty + "</td></tr > ").appendTo($('#tblIssueItemList tbody'));
                });
            }
            else {
                $('#tblItemList').hide();
            }
        },
        error: function (response) {
            alert('Server Error...!');
        }
    });
}
function ClearIssue() {
    $('#txtIssueItemName').val('');
    $('#txtIssueInStock').val('');
    $('#txtIssuePackType').val('');
    $('#txtIssuePQuantity').val('');
    $('#txtIssueQuantity').val('');
}
function ValidateIssue() {
    var ItemName = $('#txtIssueItemName').val();
    var Quantity = $('#txtIssueQuantity').val();
    var InStock = $('#txtIssueInStock').val();
    var Emp = $('#ddlEmployee option:selected').val();

    if (Emp == 'Select Employee') {
        alert("Select Employee Name");
        $('#ddlEmployee').css('border-color', 'red');
        return false;
    }
    else {
        $('#ddlEmployee').removeAttr('style');
    }
    if (ItemName == '') {
        $('#txtIssueItemName').css('border-color', 'red');
        return false;
    }
    else {
        $('#txtIssueItemName').removeAttr('style');
    }
    if (Quantity == '') {
        $('#txtIssueQuantity').css('border-color', 'red');
        return false;
    }
    else {
        $('#txtIssueQuantity').removeAttr('style');
    }
    if (parseInt(InStock) < parseInt(Quantity)) {
        alert('Issue Quantity Should be Less Then In Stock Quantity.');
        return false;
    }
    return true;
}
function InsertIssue(MasterKeyId) {
    if (ValidateIssue()) {
        debugger
        var url = config.baseUrl + "/api/GeneralStore/InsertIssue";
        var objBO = {};
        objBO.MasterKeyId = MasterKeyId;
        objBO.Qty = $('#txtIssueQuantity').val();
        objBO.UnitId = Active.unitId;
        objBO.LoginId = Active.userId;
        objBO.CompId = Active.compId;
        objBO.item_id = _ItemId;
        objBO.AllotedTo = $('#ddlEmployee option:selected').val();;
        objBO.AutoId = 0;
        objBO.Logic = "Issue";
        $.ajax({
            method: "POST",
            url: url,
            data: JSON.stringify(objBO),
            contentType: "application/json;charset=utf-8",
            dataType: "JSON",
            success: function (data) {
                if (data = 'Successfully Saved') {
                    ClearIssue();
                    TodayIssuedList();
                    $('#btnSaveIssueOrder').removeClass('focus1');
                    $('#txtIssueItemName').focus();
                }
                else {
                    alert(data);
                }
            },
            complete: function (res) {
                $('#loader').hide();
            },
            error: function (response) {
                alert('Server Error...!');
            }
        });
    }
}
function TodayIssuedList() {
    var url = config.baseUrl + "/api/GeneralStore/IssueQueries";
    var objBO = {};
    objBO.UnitId = Active.unitId;
    objBO.Logic = "TodayIssuedList";
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        contentType: "application/json;charset=utf-8",
        dataType: "JSON",
        success: function (data) {
            console.log(data);
            $('#tblIssueUnCompleteOrder tbody').empty();
            if (data != '') {
                console.log(data);
                $.each(data.ResultSet.Table, function (key, val) {
                    $('<tr><td style="width:45px;"><span class="text-danger delete" data-recid="' + val.auto_id + '"><i class="fa fa-trash btnfa"></i></span></td><td>' + val.master_key_id + "</td><td>"
                        + val.item_Name + "</td><td>" + val.pack_type + "</td><td>"
                        + val.pack_qty + "</td><td>" + val.Issued_Qty + "</td><td>" + val.batch_no + "</td><td>" + val.exp_date + "</td></tr> ").appendTo($('#tblIssueUnCompleteOrder tbody'));
                });
            }
            else {
            }
        },
        error: function (response) {
            alert('Server Error...!');
        }
    });
}
function IssueDeleteOrder(RecId) {
    if (confirm('Are you sure want to delete this Order.')) {
        var url = config.baseUrl + "/api/GeneralStore/InsertIssue";
        var objBO = {};
        objBO.AutoId = RecId;
        objBO.item_id = '-';
        objBO.LotNo = '';
        objBO.MasterKeyId = '';
        objBO.TrfQty = '';
        objBO.UnitId = Active.unitId;
        objBO.LoginId = Active.userId;
        objBO.CompId = Active.compId;
        objBO.Logic = "Delete";
        $.ajax({
            method: "POST",
            url: url,
            data: JSON.stringify(objBO),
            contentType: "application/json;charset=utf-8",
            dataType: "JSON",
            success: function (data) {
                console.log(data);
                if (data == 'Successfully Deleted') {
                    TodayIssuedList();
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