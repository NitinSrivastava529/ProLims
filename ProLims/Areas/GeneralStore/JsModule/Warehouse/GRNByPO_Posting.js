var _unitId = "";
var _GrnNo = "";
var _TotalValue =0;
$(document).ready(function () {
    GRNInfoForPosting();
});

function GRNInfoForPosting() {
    $('#tblPendingGRN tbody').empty();
    var url = config.baseUrl + "/api/Indent/GS_PurchaseOrderQueries";
    var objBO = {};
    objBO.CompId = Active.compId;
    objBO.UnitId = Active.unitId;
    objBO.indent_no = '-';
    objBO.PONo = '-';
    objBO.GrnNo = '-';
    objBO.VendorId = '-';
    objBO.ItemId = '-';
    objBO.From = '1900/01/01';
    objBO.To = '1900/01/01';
    objBO.Prm1 = '-';
    objBO.LoginId = Active.userId;
    objBO.Logic = "GRNInfoForPosting";
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
                        tbody += '<tr>';
                        tbody += '<td class="hide">' + val.TotalValue + '</td>';
                        tbody += '<td>' + val.po_no + '</td>';
                        tbody += '<td>' + val.GRNNo + '</td>';
                        tbody += '<td>' + val.Cr_Date + '</td>';
                        tbody += '<td><button id="btnSave" style="margin-left:5px;" onclick=selectRow(this);PrintGRN(this) class="btn btn-primary btn-sm"><i class="fa fa-sign-in"></i></button></td>';
                        tbody += '</tr>';
                    });
                    $("#tblPendingGRN tbody").append(tbody);
                }
            }
        },
        error: function (response) {
            alert('Server Error...!');
        }
    });
}
function GRNPosting() {
    if (!confirm('are you sure?')) return
    var url = config.baseUrl + "/api/Indent/wh_GRNPosting";
    var objBO = {};
    objBO.GrnNo = _GrnNo;
    objBO.LoginId = Active.userId;
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        contentType: "application/json;charset=utf-8",
        dataType: "JSON",
        success: function (data) {
            alert(data)
        },
        error: function (response) {
            alert('Server Error...!');
        }
    });
}
function PrintGRN(elem) {  
    _TotalValue = $(elem).closest('tr').find('td:eq(0)').text();
    _GrnNo = $(elem).closest('tr').find('td:eq(2)').text();
    var url = config.rootUrl + '/GeneralStore/Print/PrintGrn?GrnNo=' + _GrnNo;
    $('iframe').attr('src', url)
}