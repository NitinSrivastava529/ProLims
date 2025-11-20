var _AuditNo = "";
$(document).ready(function () {
    FillCurrentDate('txtFrom');
    FillCurrentDate('txtTo');
    $('input[name=Product]').on('change', function () {
        if ($(this).val() == 'Pending') {
            $('input[type=date]').prop("disabled", true);
            GetPendingReport('GetUnProcessedAudit');
        }
        else {
            $('input[type=date]').prop("disabled", false);
        }
    });
});
function DownloadExcel(elem) {
    var url = config.baseUrl + "/api/Audit/DownloadAuditReport";
    var objBO = {};
    objBO.AuditNo = _AuditNo;
    objBO.login_id = Active.userId;
    objBO.CompId = Active.compId;
    objBO.UnitId = Active.unitId;
    objBO.Logic = "GetAuditInfo";
    Global_DownloadExcel(url, objBO, "AuditReport.xlsx", elem);
}
function Global_DownloadExcel(Url, objBO, fileName, elem) {
    $(elem).append("<i class='fa fa-spinner fa-spin' style='font-size:20px;float:left'></i>");
    var ajax = new XMLHttpRequest();
    ajax.open("Post", Url, true);
    ajax.responseType = "blob";
    ajax.setRequestHeader("Content-type", "application/json")
    ajax.onreadystatechange = function () {
        if (this.readyState == 4) {
            var blob = new Blob([this.response], { type: "application/octet-stream" });
            saveAs(blob, fileName); //refernce by ~/JsModule/FileSaver.min.js
            $(elem).removeClass('i').find('.fa-spinner').remove();

        }
    };
    ajax.send(JSON.stringify(objBO));
} 
function GetPendingReport(logic) {
    $('#tblDetails tbody').empty();
    var url = config.baseUrl + "/api/Audit/AuditQueries";
    var objBO = {};
    objBO.from = $('#txtFrom').val();
    objBO.to = $('#txtTo').val();
    objBO.CompId = Active.compId;
    objBO.UnitId = Active.unitId;
    objBO.Logic = logic;
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            console.log(data)
            if (data.ResultSet.Table.length > 0) {
                var htmldata = "";
                var CartName = "";
                $.each(data.ResultSet.Table, function (key, val) {
                    htmldata += '<tr>';
                    htmldata += '<td>' + val.audit_no + '</td>';
                    htmldata += '<td>' + val.audit_date.split('T')[0] + '</td>';
                    htmldata += "<td><button class='btn btn-success' style='padding: 0px 5px;' onclick=GetAllInfoById('" + val.audit_no + "')><span class='fa fa-sign-in'></button></td >";
                    htmldata += '</tr>';
                });
                $('#tblDetails tbody').append(htmldata);
            }
        },
        error: function (err) {
            alert(err.responseText);
        }
    });

}
function GetAllInfoById(auditno) {
    debugger
    $('#txtItemStock').html("Audit No :"+auditno);
    _AuditNo = auditno;
    var url = config.baseUrl + "/api/Audit/AuditQueries";
    var objBO = {};
    objBO.AuditNo = auditno;
    objBO.from = '1900/01/01';
    objBO.to = '1900/01/01';
    objBO.Logic = "GetAuditInfo";
    objBO.login_id = Active.userId;
    objBO.CompId = Active.compId;
    objBO.UnitId = Active.unitId;
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            console.log(data);
            if (data.ResultSet.Table.length > 0) {
                var htmldata = "";
                var auditnos = "";
                $('#tblAuditReport tbody').empty();
                $.each(data.ResultSet.Table, function (key, val) {
                    console.log(data);
                    if (auditnos != val.auditType) {
                        htmldata += '<tr>';
                        htmldata += '<td colspan="10" style="font-weight:bold;background-color:#d1ebfb;color:#000">' + val.auditType + '</td>';
                        htmldata += '</tr>';
                        auditnos = val.auditType;
                    }
                    htmldata += '<tr>';
                    htmldata += '<td>' + val.item_name + '</td>';
                    htmldata += '<td>' + val.mfd_name + '</td>';
                    htmldata += '<td>' + val.batch_no + '</td>';
                    htmldata += '<td>' + val.exp_date + '</td>';
                    htmldata += '<td>' + val.pack_type + '</td>';
                    htmldata += '<td>' + val.pack_qty + '</td>';
                    htmldata += '<td>' + val.qty + '</td>';
                    htmldata += '<td>' + val.mrp + '</td>';
                    htmldata += '<td>' + val.amount + '</td>';
                    htmldata += '<td>' + val.upr + '</td>';
                    htmldata += '</tr>';
                });
                $('#tblAuditReport tbody').append(htmldata);
            }
        },
        error: function (err) {
            alert(err.responseText);
        }
    });
}
function InsertAuditComplete() {
    var url = config.baseUrl + "/api/Audit/AuditCompletion";
    var objBO = {};
    objBO.UnitId = Active.unitId;
    objBO.CompId = Active.compId;
    objBO.AuditNo = _AuditNo;
    objBO.login_id = Active.userId;
    objBO.Logic = "PostAuditedStock";
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            if (data != '') {
                alert(data);
            }
            else {
                alert(data);
            }
        }

    });

}