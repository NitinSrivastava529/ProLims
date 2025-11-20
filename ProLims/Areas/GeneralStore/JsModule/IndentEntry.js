var _Required = 0;
var _MinValue = 0;
var _MaxValue = 0;
$(document).ready(function () {
    UnCompetedOrder();
    $(document).on('keydown', function (e) {
        var itemListDetails = $('#ItemListDetails').css('display') == 'block';
        var btnsaveorder = $('#btnSaveOrder').hasClass('focus1');
        var KeyCode = e.keyCode;
        if (itemListDetails) {
            var tbody = $('#tblItemList').find('tbody');
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
                    var InStock = $('#tblItemList').find('tbody').find('tr.selected').find('td:nth-child(4)').text();
                    var PackType = $('#tblItemList').find('tbody').find('tr.selected').find('td:nth-child(2)').text();
                    var PQuantity = $('#tblItemList').find('tbody').find('tr.selected').find('td:nth-child(3)').text();
                    var PendOrder = $('#tblItemList').find('tbody').find('tr.selected').find('td:nth-child(5)').text();
                    $('#txtInStock').val(InStock);
                    $('#txtPackType').val(PackType);
                    $('#txtPQuantity').val(PQuantity);
                    $('#txtPendOrder').val(PendOrder);
                    $('#ItemListDetails').hide();
                    $('input[id=txtQuantity]').focus();
                    break;
            }
        }
        if (btnsaveorder) {
            switch (KeyCode) {
                case (KeyCode = 13):
                    var ItemId = $('#btnSaveOrder').data('itemid');
                    GS_InsertModifyIndent(ItemId);
                    break;
            }
        }
    });
    $('#txtItemName').keydown(function (e) {
        var tbody = $('#tblnavigate').find('tbody');
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
                var ItemId = $('#tblnavigate').find('tbody').find('.selected').data('itemid');
                var itemName = $('#tblnavigate').find('tbody').find('.selected').text();
                $('#btnSaveOrder').data('itemid', ItemId);
                $('#txtItemName').val(itemName).blur();
                $('#ItemList').hide();
                PackSizeSelection(ItemId);
                break;
            default:
                var val = $('#txtItemName').val();
                if (val == '') {
                    $('#ItemList').hide();
                }
                else {
                    $('#ItemListDetails').hide();
                    $('#ItemList').show();
                    debugger
                    ItemSelection();
                }
                break;
        }
    });
    $(document).on('click', '.searchitems', function () {
        var itemId = $(this).data('itemid');
        $('#ItemList').hide();
        $('#txtPackSize').val(itemId);
    });
    $('#btnSaveOrder').on('click', function () {
        var ItemId = $(this).data('itemid');
        GS_InsertModifyIndent(ItemId);
    });
    $('#btnCompleteIndent').on('click', function () {
        CompleteOrder();
    });
    $('#txtRemark,#txtQuantity').on('keyup', function (e) {  
        var keyCode = e.keyCode;
        if (keyCode == 13) {
            $('#btnSaveOrder').trigger('click')
        }
    });
    $('#tblUnCompleteIndent tbody').on('click', '.delete', function () {
        var ItemId = $(this).data('itemid');
        DeleteOrder(ItemId);
    });
});
function UnCompetedOrder() {
    var url = config.baseUrl + "/api/Indent/Indent_Queries";
    var objBO = {};
    objBO.CompId = Active.compId;
    objBO.UnitId = Active.unitId;
    objBO.Logic = "UnCompetedOrder";
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        contentType: "application/json;charset=utf-8",
        dataType: "JSON",
        success: function (data) {          
            $('#tblUnCompleteIndent tbody').empty();
            if (data != '') {
                $.each(data.ResultSet.Table, function (key, val) {
                    $('<tr><td style="width:10%" ><span class="text-danger delete" data-itemid="' + val.item_id + '"><i class="fa fa-trash btnfa"></i></span></td><td style="width:10%">' + val.item_id + "</td><td style='width:30%'>"
                        + val.item_Name + "</td>" + "<td style='width:10%' >" + val.pack_type + "</td>"
                        + "<td style='width:10%' >" + val.order_qty + "</td><td style='width:40%' >" + val.OrderRemark + "</td></tr> ").appendTo($('#tblUnCompleteIndent tbody'));
                    $('#ddlIndentType').find("option:contains(" + val.uOrderType + ")").attr('selected', 'selected');
                    $('#ddlIndentType').prop("disabled", true);
                    $('#txtindent_no').val(val.IndentNo);
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
function ItemSelection() {
    var url = config.baseUrl + "/api/Indent/Indent_Queries";
    var objBO = {};
    objBO.CompId = Active.compId;
    objBO.UnitId = Active.unitId;
    objBO.userId = Active.LoginId;
    objBO.From ='1900/01/01';
    objBO.To ='1900/01/01';
    objBO.userId = Active.LoginId;
    objBO.Prm1 = $('#txtItemName').val();
    objBO.Logic = "ItemSelection"; 
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        contentType: "application/json;charset=utf-8",
        dataType: "JSON",
        success: function (data) {          
            console.log(data)
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
function PackSizeSelection(ItemId) {
    var url = config.baseUrl + "/api/Indent/Indent_Queries";
    var objBO = {};
    objBO.CompId = Active.compId;
    objBO.UnitId = Active.unitId;
    objBO.userId = Active.LoginId;
    objBO.ItemId = ItemId;
    objBO.Logic = "ItemCalculation";
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        contentType: "application/json;charset=utf-8",
        dataType: "JSON",
        success: function (data) {
            console.log(data);
            $('#tblItemList tbody').empty();
            if (data != '') {
                $.each(data.ResultSet.Table, function (key, val) {
                    $('#txtDailyAvg').val(val.DailyAvg)
                    $('#txtReq45Days').val(val.Req45Days)
                    $('#txtYourStock').val(val.unit_stock)
                    $('#txtQuantity').val(val.ActualRequired)
                    _Required = val.ActualRequired;
                    _MinValue = val.minValue;
                    _MaxValue = val.maxValue;
                    $('#ddlPack').focus();
                    $('#txtRemark').val('');
                });
                $('#ddlPack').empty().append($('<option></option>').val('-').html('Select'));
                $.each(data.ResultSet.Table1, function (key, val) {
                    $('#ddlPack').append($('<option></option>').val(val.pack_type).html(val.pack_type));
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
function EnableRemark() {

    if ($('#ddlIndentType').val() == "Monthly") {
        if ((eval($('#txtQuantity').val()) >= _MinValue && eval($('#txtQuantity').val()) <= _MaxValue)) {
            $('#txtRemark').val('');
            $('#txtRemark').removeAttr('style');
        }
        else {
            $('#txtRemark').css('border-color', 'red');
        }
    }
}
function GS_InsertModifyIndent(ItemId) {
     if (ValidateOrder()) {    
    var url = config.baseUrl + "/api/Indent/GS_InsertModifyIndent";
    var objBO = {};
    objBO.CompId = Active.compId;
    objBO.UnitId = Active.unitId;
    objBO.indent_no = $('#txtindent_no').val();
    objBO.ItemId = ItemId;
    objBO.PackType = $('#ddlPack option:selected').val();
    objBO.PackQuantity = "1";   
    objBO.Remark = $('#txtRemark').val();
    objBO.IndentType = $('#ddlIndentType').val();
    objBO.uDailyAvg = $('#txtDailyAvg').val();
    objBO.UnitStock = $('#txtYourStock').val();
    objBO.qty = $('#txtQuantity').val();
    objBO.LoginId = Active.userId;
    objBO.Logic = "Insert";
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        contentType: "application/json;charset=utf-8",
        dataType: "JSON",
        success: function (data) {
            $('#loader').show();
            if (data == 'Successfully Saved') {
                Clear();
                UnCompetedOrder();
                $('#txtRemark').removeAttr('style');
                $('#btnSaveOrder').removeClass('focus1');
                $('#txtItemName').focus();
                $('#ddlPack').empty().append($('<option></option>').val('-').html('Select')).select2();
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
function CompleteOrder() {
    var indent_no = $('#txtindent_no').val();
    if (indent_no != '') {
        var url = config.baseUrl + "/api/Indent/GS_InsertModifyIndent";
        var objBO = {};
        objBO.CompId = Active.compId;
        objBO.LoginId = Active.userId;
        objBO.indent_no = $('#txtindent_no').val();
        objBO.Logic = "Complete";
        objBO.Remark = $('#txtRemark').val();
        objBO.IndentType = $('#ddlIndentType').val();
        objBO.uDailyAvg = $('#txtDailyAvg').val();
        objBO.UnitStock = $('#txtYourStock').val();
        $.ajax({
            method: "POST",
            url: url,
            data: JSON.stringify(objBO),
            contentType: "application/json;charset=utf-8",
            dataType: "JSON",
            success: function (data) {              
                if (data != '') {
                    $('#txtindent_no').val('New');
                    UnCompetedOrder();
                    alert(data);
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
function DeleteOrder(ItemId) {
    if (confirm('Are you sure want to delete this Order.')) {
        var url = config.baseUrl + "/api/Indent/GS_InsertModifyIndent";
        var objBO = {};
        objBO.CompId = Active.compId;
        objBO.indent_no = $('#txtindent_no').val();
        objBO.ItemId = ItemId;
        objBO.Logic = "Delete";

        objBO.Remark = $('#txtRemark').val();
        objBO.IndentType = $('#ddlIndentType').val();
        objBO.uDailyAvg = $('#txtDailyAvg').val();
        objBO.UnitStock = $('#txtYourStock').val();

        $.ajax({
            method: "POST",
            url: url,
            data: JSON.stringify(objBO),
            contentType: "application/json;charset=utf-8",
            dataType: "JSON",
            success: function (data) {             
                if (data != '') {
                    UnCompetedOrder();
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
//Validation Section 
function Clear() {
    $('#txtItemName').val('');
    $('#txtInStock').val('');
    $('#txtPackType').val('');
    $('#txtPQuantity').val('');
    $('#txtPendOrder').val('');
    $('#txtQuantity').val('');
    $('#txtRemark').val('');
    $('#txtDailyAvg').val('');
    $('#txtReq45Days').val('');
    $('#txtYourStock').val('');
    $('#txtQuantity').val('');
}
function ValidateOrder() {
    var ItemName = $('#txtItemName').val();
    var Quantity = $('#txtQuantity').val();
    var IndentType = $('#ddlIndentType').val();
    var ddlPack = $('#ddlPack option:selected').text();

    if (IndentType == 'Select') {
        $('#ddlIndentType').css('border-color', 'red');
        alert("Please select Order Type ");
        return false;
    }
    else {
        $('#ddlIndentType').removeAttr('style');
    }

    if (ItemName == '') {
        $('#txtItemName').css('border-color', 'red');
        alert("Please select Item.");
        return false;
    }
    else {
        $('#txtItemName').removeAttr('style');
    }
    if (ddlPack == 'Select') {
        $('#ddlPack').css('border-color', 'red');
        alert("Please select Pack Type.");
        return false;
    }
    else {
        $('#ddlPack').removeAttr('style');
    }
    if (Quantity == '') {
        $('#txtQuantity').css('border-color', 'red');
        alert("Please Enter Quantity.");
        return false;
    }
    else {
        $('#txtQuantity').removeAttr('style');
    }
    return true;
}
//Report 
function OrderIdList() {
    $('#btnGetData').append("<i class='fa fa-spinner fa-spin' style='font-size:24px;float:left'></i>");
    var url = config.baseUrl + "/api/Indent/Indent_Queries";
    var from = $("#txtFrom").val();
    var to = $("#txtTo").val();
    var ReportType = $('#ddlReportType').val();
    var objBO = {};
    objBO.CompId = Active.compId;
    objBO.UnitId = Active.unitId;
    objBO.Logic = "AllOrdersOfUnit";
    objBO.From = from
    objBO.To = to;
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        contentType: "application/json;charset=utf-8",
        dataType: "JSON",
        success: function (data) {          
            $('#tblOrderIds tbody').empty();
            if (data != '') {               
                $.each(data.ResultSet.Table, function (key, val) {
                    $('<tr><td>' + val.order_no + '</td><td>' + val.order_date + '</td><td><input id=' + val.order_no + ' type="button" class="btn btn-warning" value="V" onclick="OrderIdDetail(this.id)" /></td></tr>').appendTo($('#tblOrderIds tbody'));
                });
                $('#btnGetData i').remove();
            }
            else {
                $('#btnGetData i').remove();
            }
        },
        error: function (response) {
            alert('Server Error...!');
        }
    });
}
function OrderIdDetail(indent_no) {

    var url = config.baseUrl + "/api/Indent/Indent_Queries";
    var objBO = {};
    objBO.CompId = Active.compId;
    objBO.UnitId = Active.unitId;
    objBO.indent_no = indent_no;
    objBO.Logic = "OrderDetailOfUnit";
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        contentType: "application/json;charset=utf-8",
        dataType: "JSON",
        success: function (data) {           
            $('#tblOrderDetail tbody').empty();
            if (data != '') {
                $.each(data.ResultSet.Table, function (key, val) {
                    $('<tr><td>' + val.item_Name + '</td><td style="text-align: center;width:10%;">' + val.pack_type + '</td><td style="text-align: center;width:10%;">' + val.pack_qty + '</td><td style="text-align: center;width:10%;">' + val.order_qty + '</td><td style="text-align: center;width:10%;">' + val.verify_qty + '</td><td style="text-align: center;width:10%;">' + val.stockAtUnit + '</td><td style="text-align: center;width:10%;">' + val.verify_remark + '</td><td style="text-align: center;width:10%;">' + val.trf_qty + '</td><td style="text-align: center;width:10%;">' + val.Pend_qty + '</td></tr>').appendTo($('#tblOrderDetail tbody'));
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
function GetSpotOrderItemList(ReportType) {
    var url = config.baseUrl + "/api/Indent/Indent_Queries";
    var objBO = {};
    objBO.CompId = Active.compId;
    objBO.UnitId = Active.unitId;
    objBO.indent_no = '-';
    objBO.Logic = "SpotOrderItemList";
    objBO.OutPutType = ReportType
    Global_DownloadExcel(url, objBO, "SpotOrderList.xlsx");

}


