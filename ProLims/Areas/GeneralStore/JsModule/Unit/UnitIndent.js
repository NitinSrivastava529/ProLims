$(document).ready(function () {
    UnitStockItem()
});
function UnitStockItem() {
    $('#tblStockItem tbody').empty();
    var url = config.baseUrl + "/api/Indent/Indent_Queries";
    var objBO = {};
    objBO.CompId = Active.compId;
    objBO.UnitId = Active.unitId;
    objBO.Logic = "UnitStockItem";
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        contentType: "application/json;charset=utf-8",
        dataType: "JSON",
        success: function (data) {
            if (Object.keys(data.ResultSet).length) {
                if (Object.keys(data.ResultSet.Table).length) {
                    var tbody = "";
                    $.each(data.ResultSet.Table, function (key, val) {
                        tbody += "<tr>";
                        tbody += "<td>" + val.ItemId + "</td>";
                        tbody += "<td>" + val.item_name + "</td>";
                        tbody += "<td>" + val.pack_type + "</td>";
                        tbody += "<td class='text-right'>" + val.StockQty + "</td>";
                        tbody += "<td><input type='text' value='0' class='form-control' placeholder='Indent Qty'/></td>";
                        tbody += "<td><button onclick=AddItem(this) class='btn btn-warning btn-xs select'><i class='fa fa-sign-in'>&nbsp;</i>Select</button></td>";
                        tbody += "</tr>";
                    });
                    $('#tblStockItem tbody').append(tbody);
                }
            }
        },
        error: function (response) {
            alert('Server Error...!');
        }
    });
}
function AddItem(elem) {
    var itemId = $(elem).closest('tr').find('td:eq(0)').text();
    var itemName = $(elem).closest('tr').find('td:eq(1)').text();
    var packType = $(elem).closest('tr').find('td:eq(2)').text();
    var qty = $(elem).closest('tr').find('td:eq(4) input').val();
    var tbody = "";
    tbody += "<tr>";
    tbody += "<td>" + itemId + "</td>";
    tbody += "<td>" + itemName+ "</td>";
    tbody += "<td>" + packType + "</td>";
    tbody += "<td>" + qty + "</td>";  
    tbody += "<td><button onclick=$(this).closest('tr').remove() class='btn btn-danger btn-xs select'><i class='fa fa-close'>&nbsp;</i>Remove</button></td>";
    tbody += "</tr>";
    $('#tblIndentItems tbody').append(tbody);
}
function UnitIndent() {    
    if (!confirm('are you sure?')) return

    var url = config.baseUrl + "/api/Indent/GS_GenerateManualPO";
    var objBO = {};
    var objItem = [];
    objBO.CompId = Active.compId;
    objBO.UnitId = Active.unitId;
    objBO.po_no = '-';
    objBO.LoginId = Active.userId;
    objBO.Logic = 'UnitIndent';
    $('#tblIndentItems tbody tr').each(function () {
    objItem.push({
        'ItemId': $(this).find('td:eq(0)').text(),
        'PackType': $(this).find('td:eq(2)').text(),
        'Qty': $(this).find('td:eq(3)').text(),
        });
    })
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify({ objBO: objBO, item: objItem }),
        contentType: "application/json;charset=utf-8",
        dataType: "JSON",
        success: function (data) {
            if (data.includes('Success')) {               
                alert(data);
                $('#tblIndentItems tbody').empty();
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
