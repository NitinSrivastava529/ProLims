$(document).ready(function () {
    FillCurrentDate("txtFrom");
    FillCurrentDate("txtTo");
    Onload();

    $('#myInput').on('keyup', function () {
        var val = $(this).val().toLowerCase();
        $('#tblReport tbody tr').filter(function () {
            $(this).toggle($(this).text().toLowerCase().indexOf(val) > -1);
        });
    });
});
function Onload() {
    var url = config.baseUrl + "/api/Finance/Diag_AccountingQueries";
    var objBO = {};
    objBO.UnitId = Active.unitId;
    objBO.CompId = Active.compId;
    objBO.from = $("#txtFrom").val();
    objBO.to = $("#txtTo").val();
    objBO.Logic = 'GetUnitList';
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            if (Object.keys(data.ResultSet).length > 0) {
                if (Object.keys(data.ResultSet.Table).length > 0) {
                    $("#ddlUnit").empty().append($("<option selected></option>").val("ALL").html("ALL")).select2();
                    $.each(data.ResultSet.Table, function (key, value) {
                        $("#ddlUnit").append($("<option></option>").val(value.Unitid).html(value.unit_name));
                    });
                }
            }
            else {
                alert('No Data Found')
            }
        },
        error: function (response) {
            alert('Server Error...!');
        }
    });
}
function GetReport(elem) {
    var totalCreditAmount = 0; var totalWorkAmt = 0; var totalVoucherAmt = 0; var totalReceiptAmt = 0;
    $(elem).append("<i class='fa fa-spinner fa-spin' style='font-size:20px;float:left'></i>");
    $('#tblReport tbody').empty();
    var url = config.baseUrl + "/api/Finance/Diag_AccountingQueries";
    var objBO = {};
    objBO.UnitId = $("#ddlUnit option:selected").val();
    objBO.CompId = Active.compId;
    objBO.from = $("#txtFrom").val();
    objBO.to = $("#txtTo").val();
    objBO.Logic = 'JeenaSikhoAccountMatchSheet';
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        contentType: "application/json;charset=utf-8",
        dataType: "JSON",
        async: false,
        success: function (data) {
            if (data.ResultSet.Table.length > 0) {
                var tbody = "";
                $.each(data.ResultSet.Table, function (key, val) {
                    if (val.Reciptflag == "Y") {
                        tbody += "<tr style='background: #d4edb8;'>";
                    }
                    else {
                        tbody += "<tr>";
                    }

                    tbody += "<td hidden>" + val.unitid + "</td>";
                    tbody += "<td hidden>" + val.tnxDate1 + "</td>";
                    tbody += "<td>" + val.unit_name + "</td>";
                    tbody += "<td>" + val.tnxDate + "</td>";
                    tbody += "<td style='text-align:center'>" + val.WorkAmt + "</td>";
                    tbody += "<td style='text-align:center'>" + val.VoucherAmt + "</td>";
                    tbody += "<td style='text-align:center'>" + val.ReceiptAmt + "</td>";
                    tbody += "<td style='text-align:center'>" + val.CreditAmount + "</td>";
                    tbody += "<td style='text-align:center'>" +
                        '<button class="btn btn-success" id="btnUpload" type="button" onclick="InsertRefresh(this)" style="margin-left: 10px;height:30px;"> <span class="fa fa-refresh"></span> &nbsp; Refresh </button>' +
                        "</div></td>";
                    tbody += "</tr>";
                    totalWorkAmt += parseFloat(val.WorkAmt) || 0;
                    totalVoucherAmt += parseFloat(val.VoucherAmt) || 0;
                    totalReceiptAmt += parseFloat(val.ReceiptAmt) || 0;
                    totalCreditAmount += parseFloat(val.CreditAmount) || 0;
                });
                $('#tblReport tbody').append(tbody);
                $(elem).removeClass('i').find('.fa-spinner').remove();


                $("#txtworkAmount").text(totalWorkAmt.toFixed(0));
                $("#txtVoucherAmount").text(totalVoucherAmt.toFixed(0));
                $("#txtReceiptAmount").text(totalReceiptAmt.toFixed(0));
                $("#txtCreditAmount").text(totalCreditAmount.toFixed(0));

            }
            else {
                $('#tblReport tbody').empty();
                $(elem).removeClass('i').find('.fa-spinner').remove();
                alert("Data Not Found..");
            };
        },
        error: function (response) {
            alert('Server Error...!');
            $(elem).removeClass('i').find('.fa-spinner').remove();
        }
    });
}

function DownloadExcel(elem) {
    var url = config.baseUrl + "/api/Finance/Diag_AccountingQueries";
    var objBO = {};
    objBO.UnitId = $("#ddlUnit option:selected").val();
    objBO.CompId = Active.compId;
    objBO.from = $("#txtFrom").val();
    objBO.to = $("#txtTo").val();
    objBO.Logic = 'JeenaSikhoAccountMatchSheet';
    objBO.OutPutType = 'Excel';
    Global_DownloadExcel(url, objBO, "Report.xlsx", elem);
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

function InsertRefresh(elem) {
    selectRow(elem);
    var $row = $(elem).closest('tr'); // get current row
    var UnitId = $row.find('td:eq(0)').text();
    var rawDate = $row.find('td:eq(1)').text();
    //var date = rawDate.replace('T', ' ');
    var objBO = {};
    var url = config.baseUrl + "/api/Finance/Prolims_VoucherGeneration";
    objBO.unit_Id = UnitId;
    objBO.vchdate = rawDate;
    $(elem).append("<i class='fa fa-spinner fa-spin' style='font-size:20px;float:left'></i>");
    $(elem).prop('disabled', true)
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            if (data.includes('Success')) {
                alert(data);
                $(elem).removeClass('i').find('.fa-spinner').remove();

            }
            else {
                alert(data);
                $(elem).removeClass('i').find('.fa-spinner').remove();
            }
        },
        error: function (response) {
            alert('Server Error...!');
            $(elem).removeClass('i').find('.fa-spinner').remove();
        }
    });
}