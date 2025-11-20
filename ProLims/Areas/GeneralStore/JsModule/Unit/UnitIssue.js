var _unitId = "";
$(document).ready(function () {
    FillCurrentDate('txtFrom')
    FillCurrentDate('txtTo')
    UnitList()
});

function UnitList() {
    $('#ddlUnit').empty().append($('<option></option>').val('ALL').html('All Unit'));
    var url = config.baseUrl + "/api/Indent/GS_DispatchQueries";
    var objBO = {};
    objBO.CompId = Active.compId;
    objBO.UnitId = Active.unitId;
    objBO.DispatchTo = '-';
    objBO.IndentNo = '-';
    objBO.ItemId = '-';
    objBO.MasterKeyId = '-';
    objBO.From = '1900/01/01';
    objBO.To = '1900/01/01';
    objBO.Prm1 = $('#ddlType option:selected').text();
    objBO.LoginId = Active.userId;
    objBO.Logic = "UnitList";
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        contentType: "application/json;charset=utf-8",
        dataType: "JSON",
        success: function (data) {
            var tbody = "";
            var temp = "";
            if (Object.keys(data.ResultSet).length > 0) {
                if (Object.keys(data.ResultSet.Table).length > 0) {
                    $.each(data.ResultSet.Table, function (key, val) {
                        $('#ddlUnit').append($('<option></option>').val(val.unit_id).html(val.unit_name));
                    });
                }
            }
        },
        error: function (response) {
            alert('Server Error...!');
        }
    });
}
function PendingIssue() {
    $('#tblPendingIssue tbody').empty();
    var url = config.baseUrl + "/api/Indent/GS_DispatchQueries";
    var objBO = {};
    objBO.CompId = Active.compId;
    objBO.UnitId = $('#ddlUnit option:selected').val();
    objBO.DispatchTo = '-';
    objBO.IndentNo = '-';
    objBO.ItemId = '-';
    objBO.MasterKeyId = '-';
    objBO.From = $('#txtFrom').val();
    objBO.To = $('#txtTo').val();
    objBO.Prm1 = '-';
    objBO.LoginId = Active.userId;
    objBO.Logic = "UnitIndent:PendingIssue";
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        contentType: "application/json;charset=utf-8",
        dataType: "JSON",
        success: function (data) {
            var tbody = "";
            var temp = "";
            if (Object.keys(data.ResultSet).length > 0) {
                if (Object.keys(data.ResultSet.Table).length > 0) {
                    $.each(data.ResultSet.Table, function (key, val) {
                        if (temp != val.IndentNo) {
                            tbody += '<tr style="background:#e5eaef">';
                            tbody += '<td colspan="6"><b>IndentNo : </b>' + val.IndentNo + ',<b>Indent Date And By : </b>' + val.IndentDate + ' | ' + val.IndentBy + '</td>';
                            tbody += '</tr>';
                            temp = val.IndentNo
                        }
                        tbody += '<tr>';
                        tbody += '<td><button id="btnSave" style="margin-left:5px;" onclick=selectRow(this);StockItems(this) class="btn btn-primary btn-sm"><i class="fa fa-sign-in"></i></button></td>';
                        tbody += '<td class="hide">' + val.IndentNo + '</td>';
                        tbody += '<td class="hide">' + val.UnitId + '</td>';
                        tbody += '<td class="hide">' + val.item_id + '</td>';
                        tbody += '<td>' + val.item_id + '</td>';
                        tbody += '<td>' + val.item_name + '</td>';
                        tbody += '<td>' + val.PackType + '</td>';
                        tbody += '<td class="text-right">' + val.order_qty + '</td>';
                        tbody += '</tr>';
                    });
                    $("#tblPendingIssue tbody").append(tbody);
                }
            }
        },
        error: function (response) {
            alert('Server Error...!');
        }
    });
}
function StockItems(elem) {
    $('#tblIssuedItem tbody').empty();
    $('#tblStock tbody').empty();
    var url = config.baseUrl + "/api/Indent/GS_DispatchQueries";
    var objBO = {};
    objBO.CompId = Active.compId;
    objBO.UnitId = $(elem).closest('tr').find('td:eq(2)').text();
    objBO.DispatchTo = '-';
    objBO.IndentNo = $(elem).closest('tr').find('td:eq(1)').text();
    objBO.ItemId = $(elem).closest('tr').find('td:eq(3)').text();
    objBO.MasterKeyId = '-'
    objBO.From = '1900/01/01';
    objBO.To = '1900/01/01';
    objBO.Prm1 = $(elem).closest('tr').find('td:eq(6)').text();
    objBO.LoginId = Active.userId;
    objBO.Logic = "UnitIndent:StockItems";   
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        contentType: "application/json;charset=utf-8",
        dataType: "JSON",
        success: function (data) {
            if (Object.keys(data.ResultSet).length > 0) {
                if (Object.keys(data.ResultSet.Table).length > 0) {
                    let tbody = "";
                    $.each(data.ResultSet.Table, function (key, val) {
                        tbody += '<tr>';
                        tbody += '<td>' + val.masterKeyId + '</td>';
                        tbody += '<td>' + val.ItemId + '</td>';
                        tbody += '<td>' + val.pack_type + '</td>';
                        tbody += '<td>' + val.batch_no + '</td>';
                        tbody += '<td>' + val.exp_date + '</td>';
                        tbody += '<td>' + val.stockQty + '</td>';
                        tbody += '<td><input type="text" value="0" /></td>';
                        tbody += '<td><button id="btnSave" style="margin-left:5px;" onclick=selectRow(this);Dispatch(this) class="btn btn-primary btn-sm"><i class="fa fa-sign-in"></i></button></td>';
                        tbody += '</tr>';
                    });
                    $("#tblStock tbody").append(tbody);
                }
            }
            if (Object.keys(data.ResultSet).length > 0) {
                if (Object.keys(data.ResultSet.Table1).length > 0) {
                    let tbody = "";
                    let temp = "";
                    let count = 0;
                    $.each(data.ResultSet.Table1, function (key, val) {
                        count++
                        if (temp != val.IndentNo) {
                            tbody += '<tr style="background:#e5eaef">';
                            tbody += '<td colspan="6"><b>IndentNo : </b>' + val.IndentNo + ',<b>Indent Date And By : </b>' + val.IndentDate + ' | ' + val.IndentBy + '</td>';
                            tbody += '</tr>';
                            temp = val.IndentNo
                        }
                        tbody += '<tr>';
                        tbody += '<td>' + count + '</td>';
                        tbody += '<td>' + val.item_id + '</td>';
                        tbody += '<td>' + val.item_name + '</td>';
                        tbody += '<td>' + val.PackType + '</td>';
                        tbody += '<td class="text-right">' + val.order_qty + '</td>';
                        tbody += '</tr>';
                    });
                    $("#tblIssuedItem tbody").append(tbody);
                }
            }
        },
        error: function (response) {
            alert('Server Error...!');
        }
    });
}
function Dispatch(elem) {
    if (($(elem).closest('tr').find('input').val() || 0) <= 0) {
        alert('Please Provide Qty');
        return
    }
    var url = config.baseUrl + "/api/Indent/wh_DispatchComplete";
    var objBO = {};
    objBO.CompId = Active.compId;
    objBO.UnitId = Active.unitId;
    objBO.AutoId = 0;
    objBO.MasterKeyId = $(elem).closest('tr').find('td:eq(0)').text();
    objBO.ItemId = $(elem).closest('tr').find('td:eq(1)').text();
    objBO.PackType = $(elem).closest('tr').find('td:eq(2)').text();
    objBO.Qty = $(elem).closest('tr').find('input').val();
    objBO.LotNo = $('#tblPendingIssue tbody tr.select-row').find('td:eq(1)').text();
    objBO.LoginId = Active.userId;
    objBO.Logic = "UnitIndent:Dispatch";
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        contentType: "application/json;charset=utf-8",
        dataType: "JSON",
        success: function (data) {
            if (data.includes('Success')) {
                alert(data)
                $('#tblPendingIssue tbody tr.select-row button').click();
            }
            alert(data)
        },
        error: function (response) {
            alert('Server Error...!');
        }
    });
}