var _unitId = "";
$(document).ready(function () {
    VerifyOrder()
});

function UnitWiseOrder() {
    $('#tblOrders tbody').empty();
    $('#tblUnitWiseOrder tbody').empty();
    var url = config.baseUrl + "/api/Indent/GS_IndentProcessingQueries";
    var objBO = {};
    objBO.CompId = Active.compId;
    objBO.UnitId = Active.unitId;
    objBO.indent_no = '-';
    objBO.Prm1 = $('#ddlType option:selected').text();
    objBO.LoginId = Active.userId;
    objBO.Logic = "UnitWiseOrder";
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
                            tbody += '<tr style="background:#c1e0ff">';
                            tbody += '<td colspan="4">' + val.unit_name + '</td>';
                            tbody += '</tr>';
                            temp = val.unit_name
                        }
                        tbody += '<tr>';
                        tbody += '<td class="hide">' + val.unit_id + '</td>';
                        tbody += '<td>' + val.IndentNo + '</td>';
                        tbody += '<td>' + val.indent_date + '</td>';
                        tbody += '<td>' + val.indentBy + '</td>';
                        tbody += '<td><button id="btnSave" style="margin-left:5px;" onclick=selectRow(this);OrderDetail("' + val.unit_id + '") class="btn btn-primary btn-sm"><i class="fa fa-sign-in"></i></button></td>';
                        tbody += '</tr>';
                    });
                    $("#tblUnitWiseOrder tbody").append(tbody);
                }
            }
        },
        error: function (response) {
            alert('Server Error...!');
        }
    });
}
function OrderDetail(unitId) {
    _unitId = unitId;
    $('#tblOrders tbody').empty();
    var url = config.baseUrl + "/api/Indent/GS_IndentProcessingQueries";
    var objBO = {};
    objBO.CompId = Active.compId;
    objBO.UnitId = unitId;
    objBO.indent_no = '-';
    objBO.LoginId = Active.userId;
    objBO.Logic = "UnitWiseOrderDetail";
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
                            tbody += '<tr class="grp" style="background:#c1e0ff">';
                            tbody += '<td colspan="8"><b>Indent No : </b>' + val.IndentNo + "&nbsp;<b>, Date : </b>" + val.indent_date + "<button style='float: right;' onclick=VerifyALLOrder(); class='btn btn-success btn-sm pull-right'><i class='fa fa-check-circle'>&nbsp;</i>Verify All</button></td>";
                            tbody += '</tr>';
                            temp = val.IndentNo
                        }
                        if (val.verify_flag == 'Y')
                            tbody += '<tr style="background:#b6edb2">';
                        else
                            tbody += '<tr>';

                        tbody += '<td class="hide">' + val.auto_id + '</td>';
                        tbody += '<td class="hide">' + val.IndentNo + '</td>';
                        tbody += '<td class="hide">' + val.item_id + '</td>';
                        tbody += '<td>' + val.item_name + '</td>';
                        tbody += '<td>' + val.uDailyAvg + '</td>';
                        tbody += '<td>' + val.stockAtUnit + '</td>';
                        tbody += '<td>' + val.SysReq + '</td>';
                        tbody += '<td>' + val.order_qty + '</td>';
                        tbody += '<td><input type="text" style="width:80%;text-align:right" value=' + val.verify_qty + ' placeholder="Qty"/></td>';
                        tbody += '<td><input type="text" value="' + val.verify_remark + '" placeholder="Remark"/></td>';
                        tbody += '<td><button id="btnOrderInfo" onclick=OrderInfo("' + val.IndentNo + '") style="margin-left:5px;float:right" class="btn btn-primary btn-sm"><i class="fa fa-eye"></i></button></td>';
                        tbody += '</tr>';
                    });
                    $("#tblOrders tbody").append(tbody);
                }
            }
        },
        error: function (response) {
            alert('Server Error...!');
        }
    });
}
function OrderInfo(indentNo) {
    $('#modalOrderInfo').modal('show')
}
function GS_InsertModifyIndent(autoId, qty, remark, load) {
    var url = config.baseUrl + "/api/Indent/GS_IndentProcInsertUpdate";
    var objBO = {};
    objBO.AutoId = autoId;
    objBO.CompId = Active.compId;
    objBO.UnitId = Active.unitId;
    objBO.indent_no = '-';
    objBO.ItemId = '-';
    objBO.PackType = '-';
    objBO.PackQuantity = "0";
    objBO.Remark = remark;
    objBO.IndentType = '-';
    objBO.uDailyAvg = 0;
    objBO.UnitStock = 0;
    objBO.qty = qty;
    objBO.LoginId = Active.userId;
    objBO.Logic = "VerifyOrder";
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        contentType: "application/json;charset=utf-8",
        dataType: "JSON",
        success: function (data) {
            if (data.includes('Success')) {
                if (load)
                    OrderDetail(_unitId)
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
function VerifyOrder() {
    $('#tblOrders tbody').on('keyup', 'input:text', function (e) {
        if (e.keyCode == 13) {
            var autoId = $(this).closest('tr').find('td:eq(0)').text();
            var qty = $(this).closest('tr').find('input:first').val();
            var remark = $(this).closest('tr').find('input:last').val();
            GS_InsertModifyIndent(autoId, qty, remark,true)
        }
    });
}
function VerifyALLOrder() {
    if (!confirm('are you sure?')) return

    var count = 0;
    $('#tblOrders tbody tr:not(.grp)').each(function () {
        count++;
        var autoId = $(this).find('td:eq(0)').text();
        var qty = $(this).find('input:first').val();
        var remark = $(this).find('input:last').val();
        var load = ($('#tblOrders tbody tr').length-1 == count) ? true : false;
        GS_InsertModifyIndent(autoId, qty, remark, load)
    });
}