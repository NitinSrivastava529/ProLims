var _Required = 0;
var _MinValue = 0;
var _MaxValue = 0;
$(document).ready(function () {
    Pending();
    $(document).on('keydown', function (e) {
        var itemListDetails = $('#ItemListDetails').css('display') == 'block';
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
});
function ItemSelection() {
    var url = config.baseUrl + "/api/Indent/Indent_Queries";
    var objBO = {};
    objBO.CompId = Active.compId;
    objBO.UnitId = Active.unitId;
    objBO.userId = Active.LoginId;
    objBO.From = '1900/01/01';
    objBO.To = '1900/01/01';
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
function Pending() {
    $('#tblUnCompletePO tbody').empty();
    var url = config.baseUrl + "/api/Indent/GS_PurchaseOrderQueries";
    var objBO = {};
    objBO.CompId = Active.compId;
    objBO.UnitId = Active.unitId;
    objBO.PONo = $('#txtPoNo').val();
    objBO.indent_no = '-';
    objBO.ItemId = '-';
    objBO.From = '1900/01/01';
    objBO.To = '1900/01/01';
    objBO.Prm1 = '-';
    objBO.LoginId = Active.userId;
    objBO.Logic = "ManualPO:Pending";
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        contentType: "application/json;charset=utf-8",
        dataType: "JSON",
        success: function (data) {
            var tbody = "";
            if (Object.keys(data.ResultSet).length > 0) {
                if (Object.keys(data.ResultSet.Table).length > 0) {
                    $.each(data.ResultSet.Table, function (key, val) {
                        $('#txtPoNo').val(val.po_no);
                        tbody += '<tr>';
                        tbody += '<td style="display:none">' + val.AutoId + '</td>';
                        tbody += '<td>' + val.item_id + '</td>';
                        tbody += '<td>' + val.item_name + '</td>';
                        tbody += '<td>' + val.Pack_type + '</td>';
                        tbody += '<td>' + val.FinalPO + '</td>';
                        tbody += '<td><button id="btnSelect" style="margin-left:5px;" onclick=GenManualPO("' + val.AutoId + '") class="btn btn-danger btn-sm"><i class="fa fa-trash"></i></button></td>';
                        tbody += '</tr>';
                    });
                    $("#tblUnCompletePO tbody").append(tbody);
                }
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
                $('#ddlPack').empty().append($('<option></option>').val('-').html('Select'));
                $.each(data.ResultSet.Table1, function (key, val) {
                    $('#ddlPack').append($('<option></option>').val(val.pack_type).html(val.pack_type));
                });
                $('#ddlPack').focus();
                $('#txtRemark').val('');
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
function GenManualPO(logic) {
    if (logic.includes('Insert')) {
        var ItemId = $('#btnSaveOrder').data('itemid');
        var ItemName = $('#txtItemName').val();
        var PackType = $('#ddlPack option:selected').text();
        var Qty = $('#txtQty').val();
        if (ItemId == '' || ItemName == '' || PackType == 'Select' || Qty == '') {
            alert('Provide All Details.')
            return
        }
    }
    if (logic.includes('Done'))
        if (!confirm('are you sure?')) return

    var url = config.baseUrl + "/api/Indent/GS_GenerateManualPO";
    var objBO = {};
    var objItem = [];
    objBO.CompId = Active.compId;
    objBO.UnitId = Active.unitId;
    objBO.po_no = (isNaN(logic)) ? $('#txtPoNo').val() :logic;
    objBO.LoginId = Active.userId;
    objBO.Logic = (isNaN(logic)) ? logic : 'GenManual:Delete';
    objItem.push({
        'ItemId': ItemId,
        'PackType': PackType,
        'Qty': Qty
    });  
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify({ objBO: objBO, item: objItem }),
        contentType: "application/json;charset=utf-8",
        dataType: "JSON",
        success: function (data) {
            if (data.includes('Success')) {
                $('#btnSaveOrder').data('-');
                $('#txtItemName').val('');
                $('#ddlPack').text('Select');
                $('#txtQty').val('');

                if (!logic.includes('Done')) {
                    $('#txtPoNo').val(data.split('|')[1])
                    Pending()
                }


                if (logic.includes('Done')) {
                    $('#tblUnCompletePO tbody').empty();
                    $('#txtPoNo').val('New')
                    Pending()
                }

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
