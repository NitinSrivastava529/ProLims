var _unitId = "";
$(document).ready(function () {
    PendingReceive()
});
function PendingReceive() {
    $('#tblPending tbody').empty();
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
    objBO.Prm1 = '-';
    objBO.LoginId = Active.userId;
    objBO.Logic = "PendingReceive";
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
                        tbody += '<tr>';
                        tbody += '<td>' + val.TnxId + '</td>';
                        tbody += '<td>' + val.tnxDate + '</td>';   
                        tbody += '<td><button id="btnSave" style="margin-left:5px;" onclick=selectRow(this);RequestDetails("' + val.TnxId + '") class="btn btn-primary btn-sm"><i class="fa fa-sign-in"></i></button></td>';
                        tbody += '</tr>';
                    });
                    $("#tblPending tbody").append(tbody);
                }
            }
        },
        error: function (response) {
            alert('Server Error...!');
        }
    });
}
function RequestDetails(tnxId) {
    $('#txtTnxId').val(tnxId);
    $('#tblItems tbody').empty();
    var url = config.baseUrl + "/api/Indent/GS_DispatchQueries";
    var objBO = {};
    objBO.CompId = Active.compId;
    objBO.UnitId = Active.unitId;
    objBO.DispatchTo = '-';
    objBO.IndentNo = tnxId;
    objBO.ItemId = '-';
    objBO.MasterKeyId = '-';
    objBO.From = '1900/01/01';
    objBO.To = '1900/01/01';
    objBO.Prm1 = tnxId;
    objBO.LoginId = Active.userId;
    objBO.Logic = "PendingReceiveItem";
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
                        tbody += '<tr>';
                        tbody += '<td>' + val.ItemId + '</td>';
                        tbody += '<td>' + val.item_name + '</td>';
                        tbody += '<td>' + val.mfd_name + '</td>';
                        tbody += '<td>' + val.batch_no + '</td>';
                        tbody += '<td>' + val.exp_date + '</td>';
                        tbody += '<td>' + val.pack_type + '</td>';
                        tbody += '<td>' + val.pack_qty + '</td>';
                        tbody += '<td>' + val.Qty + '</td>';
                        tbody += '</tr>';
                    });
                    $("#tblItems tbody").append(tbody);              
                }
            }
        },
        error: function (response) {
            alert('Server Error...!');
        }
    });
}
function ReceiveInStock() {
    if (!confirm('are you sure?')) return
    var url = config.baseUrl + "/api/Indent/wh_DispatchComplete";
    var objBO = {};
    objBO.CompId = Active.compId;
    objBO.UnitId = Active.unitId;
    objBO.AutoId = 0;
    objBO.Qty = 0;
    objBO.LotNo = $('#txtTnxId').val();
    objBO.LoginId = Active.userId;
    objBO.Logic = "ReceiveInStock";
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        contentType: "application/json;charset=utf-8",
        dataType: "JSON",
        success: function (data) {
            if (data.includes('Success')) {
                $('#tblItems tbody').empty();
                alert(data)
            }
            alert(data)
        },
        error: function (response) {
            alert('Server Error...!');
        }
    });
}