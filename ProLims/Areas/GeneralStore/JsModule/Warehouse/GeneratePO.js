var _unitId = "";
var _logic = "";
$(document).ready(function () {

});

function POList() {
    $('#tblUnProcessedPO tbody').empty();
    $('#tblPOList tbody').empty();
    var url = config.baseUrl + "/api/Indent/GS_PurchaseOrderQueries";
    var objBO = {};
    objBO.CompId = Active.compId;
    objBO.UnitId = Active.unitId;
    objBO.indent_no = '-';
    objBO.ItemId = '-';
    objBO.From = '1900/01/01';
    objBO.To = '1900/01/01';
    objBO.Prm1 = '-';
    objBO.LoginId = Active.userId;
    objBO.Logic = "POList";
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
                        tbody += '<td>' + val.OrderType + '</td>';
                        tbody += '<td>' + val.po_no + '</td>';
                        tbody += '<td>' + val.po_date + '</td>';
                        tbody += '<td><button id="btnSave" style="margin-left:5px;" onclick=selectRow(this);GetOrders("GeneratePO:ByPoNo") class="btn btn-primary btn-sm"><i class="fa fa-sign-in"></i></button></td>';
                        tbody += '</tr>';
                    });
                    $("#tblPOList tbody").append(tbody);
                }
            }
        },
        error: function (response) {
            alert('Server Error...!');
        }
    });
}
function GetOrders(logic) {
    _logic = logic;
    $('#tblUnProcessedPO tbody').empty();
    var url = config.baseUrl + "/api/Indent/GS_PurchaseOrderQueries";
    var objBO = {};
    objBO.CompId = Active.compId;
    objBO.UnitId = Active.unitId;
    objBO.indent_no = $('#tblPOList tbody tr.select-row').find('td:eq(1)').text();
    objBO.PONo = $('#tblPOList tbody tr.select-row').find('td:eq(1)').text();
    objBO.GrnNo = '-';
    objBO.VendorId = '-';
    objBO.ItemId = '-';
    objBO.From = '1900/01/01';
    objBO.To = '1900/01/01';
    objBO.Prm1 = $('#ddlType option:selected').text();
    objBO.LoginId = Active.userId;
    objBO.Logic = logic;
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
                        if (temp != val.VendorId) {
                            tbody += '<tr style="background:#c1e0ff">';
                            tbody += '<td colspan="10"><b>Vendor : </b>' + val.vendor_name;
                            tbody += '<button class="btn btn-primary btn-sm pull-right" data-info=' + JSON.stringify({ 'poNo': objBO.PONo, 'email': val.email }) + ' onclick="SendMail(this)"><i class="fa fa-paper-plane">&nbsp;</i>Send Mail</button>&nbsp;';
                            tbody += '<button class="btn btn-warning btn-sm pull-right" data-info=' + JSON.stringify({ 'poNo': objBO.PONo, 'email': val.email }) + ' onclick="PrintPO(this)"><i class="fa fa-print">&nbsp;</i>Print PO</button>';
                            tbody += '</td>';
                            tbody += '</tr>';
                            temp = val.VendorId
                        }
                        tbody += '<tr>';
                        tbody += '<td>' + val.item_name + '</td>';
                        tbody += '<td>' + val.Pack_type + '</td>';
                        tbody += '<td>' + val.wh_stock + '</td>';
                        tbody += '<td>' + val.unit_req + '</td>';
                        tbody += '<td>' + val.FinalPO + '</td>';
                        tbody += '<td>' + val.trade + '</td>';
                        tbody += '<td>' + val.amount + '</td>';
                        tbody += '</tr>';
                    });
                    $("#tblUnProcessedPO tbody").append(tbody);
                }
            }
        },
        error: function (response) {
            alert('Server Error...!');
        }
    });
}

function PrintPO(elem) {
    var val = JSON.parse(JSON.stringify($(elem).data("info")));
    var url = config.rootUrl + '/GeneralStore/Print/PrintPurchaseOrder?po_no=' + val.poNo;
    window.open(url, '_blank')
}
function SendMail(elem) {
    if (!confirm('are you sure?')) return

    $(elem).find('i').addClass('spinner-border spinner-border-sm').removeClass('fa-paper-plane');
    var val = JSON.parse(JSON.stringify($(elem).data("info")));
    var url = config.rootUrl + '/GeneralStore/Print/SendPoMail?po_no=' + val.poNo + '&email=' + val.email + '';
    $.ajax({
        method: "GET",
        url: url,
        contentType: "application/json;charset=utf-8",
        dataType: "JSON",
        success: function (data) {
            console.log(data)
        },
        complete: function (data) {
            $(elem).find('i').removeClass('spinner-border spinner-border-sm').addClass('fa-paper-plane');
        }
    });
}
function GeneratePO() {
    if (!confirm('are you sure?')) return
    var url = config.baseUrl + "/api/Indent/GS_GeneratePurchaseOrder";
    var objBO = {};
    objBO.CompId = Active.compId;
    objBO.UnitId = Active.unitId;
    objBO.Prm1 = $('#ddlType option:selected').text();
    objBO.LoginId = Active.userId;
    objBO.Logic = $('#ddlType option:selected').val();
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        contentType: "application/json;charset=utf-8",
        dataType: "JSON",
        success: function (data) {
            if (data.includes('Success')) {
                GetOrders('GeneratePO:PendingItem')
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
function DownloadExcel(elem) {
    $(elem).append("<i class='fa fa-spinner fa-spin' style='font-size:15px;'></i>");
    var url = config.baseUrl + "/api/Indent/GS_PurchaseOrderQueries";
    var objBO = {};
    objBO.CompId = Active.compId;
    objBO.UnitId = Active.unitId;
    objBO.indent_no = $('#tblPOList tbody tr.select-row').find('td:eq(1)').text();
    objBO.PONo = $('#tblPOList tbody tr.select-row').find('td:eq(1)').text();
    objBO.GrnNo = '-';
    objBO.VendorId = '-';
    objBO.ItemId = '-';
    objBO.OutPutType = 'Excel';
    objBO.From = '1900/01/01';
    objBO.To = '1900/01/01';
    objBO.Prm1 = $('#ddlType option:selected').text();
    objBO.LoginId = Active.userId;
    objBO.Logic = _logic;
    GlobalDownloadExcel(url, objBO, 'PurchaseOrder.xlsx', elem)
}
function GlobalDownloadExcel(Url, objBO, fileName, elem) {
    var ajax = new XMLHttpRequest();
    ajax.open("Post", Url, true);
    ajax.responseType = "blob";
    ajax.setRequestHeader("Content-type", "application/json")
    ajax.onreadystatechange = function () {
        if (this.readyState == 4) {
            console.log(this.response);
            var blob = new Blob([this.response], { type: "application/octet-stream" });
            saveAs(blob, fileName); //refernce by ~/JsModule/FileSaver.min.js      
            $(elem).find('i.fa-spinner').remove();
        }
    };
    ajax.send(JSON.stringify(objBO));
}