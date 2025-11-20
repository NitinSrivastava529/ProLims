$(document).ready(function () {

});

function IssuedProductList() {
    $('#btnGetData').append("<i class='fa fa-spinner fa-spin' style='font-size:24px;float:left'></i>");
    var url = config.baseUrl + "/api/GeneralStore/IssueQueries";
    var from = Properdate($("#txtFrom").val(), '-')
    var to = Properdate($("#txtTo").val(), '-')
    var objBO = {};
    objBO.UnitId = Active.unitId;
    objBO.from = from;
    objBO.to = to;
    objBO.Logic = "IssuedProductList";
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        contentType: "application/json;charset=utf-8",
        dataType: "JSON",
        success: function (data) {
            $('#tblIssueReport tbody').empty();
            if (data != '') {
                var temp = "";
                $.each(data.ResultSet.Table, function (key, val) {
                    if (temp != val.item_Name) {
                        $('<tr><td style="width:100%;background-color:#e5e5e5" colspan="7">' + val.item_Name + '</td></tr>').appendTo($('#tblIssueReport tbody'));
                        temp = val.item_Name
                    }
                    $('<tr><td style="width:25%">' + val.issue_date + '</td><td style="width:15%">' + val.batch_no + '</td><td style="width:15%">' + val.exp_date + '</td><td style="width:15%">' + val.pack_type + '</td><td style="width:5%;text-align:center">' + val.pack_qty + '</td><td style="width:5%;text-align:center">' + val.Issued_Qty + '</td><td style="width:20%">' + val.issue_by + '</td></tr>').appendTo($('#tblIssueReport tbody'));
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
function DownloadExcel(elem) {
    var url = config.baseUrl + "/api/GeneralStore/IssueQueries";
    var from = Properdate($("#txtFrom").val(), '-')
    var to = Properdate($("#txtTo").val(), '-')
    var objBO = {};
    objBO.UnitId = Active.unitId;
    objBO.from = from;
    objBO.to = to;
    objBO.Logic = "IssuedProductList";
    objBO.OutPutType = "Excel";
    Global_DownloadExcel(url, objBO, "IssueReport.xlsx", elem);
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