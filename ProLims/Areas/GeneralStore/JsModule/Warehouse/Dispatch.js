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
function RequestList() {
    $('#tblRequest tbody').empty();
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
    objBO.Logic = "RequestList";
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
                        if (temp != val.unit_name) {
                            tbody += '<tr style="background:#e5eaef">';
                            tbody += '<td colspan="6">' + val.unit_name + '</td>';
                            tbody += '</tr>';
                            temp = val.unit_name
                        }
                        tbody += '<tr>';
                        tbody += '<td class="hide">' + val.unit_id + '</td>';
                        tbody += '<td>' + val.IndentNo + '</td>';
                        tbody += '<td>' + val.indent_date + '</td>';
                        tbody += '<td>' + val.order_qty + '</td>';
                        tbody += '<td>' + val.trf_qty + '</td>';
                        tbody += '<td><button id="btnSave" style="margin-left:5px;" onclick=selectRow(this);RequestDetails(this) class="btn btn-primary btn-sm"><i class="fa fa-sign-in"></i></button></td>';
                        tbody += '</tr>';
                    });
                    $("#tblRequest tbody").append(tbody);
                }
            }
        },
        error: function (response) {
            alert('Server Error...!');
        }
    });
}
function RequestDetails(elem) {
    $('ul[role=tablist]').find('li:first').find('a').removeClass('active')
    $('ul[role=tablist]').find('li:last').find('a').addClass('active')
    $('#Request').removeClass('active show')
    $('#RequestDetails').addClass('active show')
    $('#tblRequestDetails tbody').empty();

    var url = config.baseUrl + "/api/Indent/GS_DispatchQueries";
    var objBO = {};
    objBO.CompId = Active.compId;
    objBO.UnitId = Active.unitId;
    objBO.DispatchTo = '-';
    objBO.IndentNo = $(elem).closest('tr').find('td:eq(1)').text();
    objBO.ItemId = '-';
    objBO.MasterKeyId = '-';
    objBO.From = '1900/01/01';
    objBO.To = '1900/01/01';
    objBO.Prm1 = '-';
    objBO.LoginId = Active.userId;
    objBO.Logic = "ReqDetailsByIndentNo";
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
                            tbody += '<td colspan="9"><b>Indent No : </b>' + val.IndentNo + '</td>';
                            tbody += '</tr>';
                            temp = val.IndentNo
                        }
                        tbody += '<tr>';
                        tbody += '<td class="hide">' + val.unit_id + '</td>';
                        tbody += '<td><button id="btnSave" disabled style="margin-left:5px;" onclick=selectRow(this);GetStockDetails(this) class="btn btn-primary btn-sm"><i class="fa fa-sign-in"></i></button></td>';
                        tbody += '<td>' + val.item_id + '</td>';
                        tbody += '<td>' + val.item_name + '</td>';
                        tbody += '<td>' + val.Pack_type + '</td>';
                        tbody += '<td>' + val.whStock + '</td>';
                        tbody += '<td>' + val.unitStock + '</td>';
                        tbody += '<td>' + val.indentQty + '</td>';
                        tbody += '<td>' + val.verify_qty + '</td>';
                        tbody += '<td>' + val.pendQty + '</td>';
                        tbody += '</tr>';
                    });
                    $("#tblRequestDetails tbody").append(tbody);
                }
            }
        },
        error: function (response) {
            alert('Server Error...!');
        }
    });
}
function ALLProductByIndentNo() {
    $('#tblWarehouseStock tbody').empty();
    var url = config.baseUrl + "/api/Indent/GS_DispatchQueries";
    var objBO = {};
    objBO.CompId = Active.compId;
    objBO.UnitId = Active.unitId;
    objBO.DispatchTo = '-';
    objBO.IndentNo = $('#tblRequestDetails tbody tr:first').find('td:first').text().split(':')[1].trim();
    objBO.ItemId = '-';
    objBO.MasterKeyId = '-';
    objBO.From = $('#txtFrom').val();
    objBO.To = $('#txtTo').val();
    objBO.Prm1 = '-';
    objBO.LoginId = Active.userId;
    objBO.Logic = "ALLProductByIndentNo";
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
                        if (temp != val.item_name) {
                            tbody += '<tr style="background:#e5eaef">';
                            tbody += '<td colspan="8"><b>Item Name : </b>' + val.item_name + '</td>';
                            tbody += '</tr>';
                            temp = val.item_name
                        }
                        if (eval(val.qty)==0)
                            tbody += '<tr style="background:#ffd4d4">';
                        else
                            tbody += '<tr>';
                        tbody += '<td class="hide">' + val.Rec_Id + '</td>';
                        tbody += '<td class="hide">' + val.LotNo + '</td>';                    
                        tbody += '<td>' + val.master_key_id  + '</td>';
                        tbody += '<td>' + val.mfd_name + '</td>';
                        tbody += '<td>' + val.batch_no + '</td>';
                        tbody += '<td>' + val.exp_date + '</td>';
                        tbody += '<td>' + val.pack_type + '</td>';
                        tbody += '<td>' + val.stock_qty + '</td>';
                        tbody += '<td><input type="text" value='+val.qty+' class="form-control" /></td>';
                        tbody += '<td><button id="btnSave" style="margin-left:5px;" onclick=ModifyTRNItem(this); class="btn btn-primary btn-sm"><i class="fa fa-sign-in"></i></button></td>';
                        tbody += '</tr>';
                    });
                    $("#tblWarehouseStock tbody").append(tbody);
                    $("#txtLotNo").val(data.ResultSet.Table[0].LotNo);
                }
            }
        },
        error: function (response) {
            alert('Server Error...!');
        }
    });
}
function DispatchComplete() {    
    var url = config.baseUrl + "/api/Indent/wh_DispatchComplete";
    var objBO = {};
    objBO.CompId = Active.compId;
    objBO.UnitId = Active.unitId;
    objBO.AutoId =0;    
    objBO.Qty =0;    
    objBO.LotNo = $('#txtLotNo').val();    
    objBO.LoginId = Active.userId;
    objBO.Logic = "Dispatch";
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        contentType: "application/json;charset=utf-8",
        dataType: "JSON",
        success: function (data) {
            if (data.includes('Success')) {
               // ALLProductByIndentNo()
                alert(data)
            }
            alert(data)
        },
        error: function (response) {
            alert('Server Error...!');
        }
    });
}
function ModifyTRNItem(elem) {
    var url = config.baseUrl + "/api/Indent/wh_DispatchComplete";
    var objBO = {};
    objBO.CompId = Active.compId;
    objBO.UnitId = Active.unitId;
    objBO.AutoId = $(elem).closest('tr').find('td:eq(0)').text();
    objBO.Qty = $(elem).closest('tr').find('input').val();
    objBO.LotNo ='-'
    objBO.LoginId = Active.userId;
    objBO.Logic = "ModifyTRNItem";
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        contentType: "application/json;charset=utf-8",
        dataType: "JSON",
        success: function (data) {
            if (data.includes('Success')) {
                ALLProductByIndentNo()
            }
            alert(data)
        },
        error: function (response) {
            alert('Server Error...!');
        }
    });
}