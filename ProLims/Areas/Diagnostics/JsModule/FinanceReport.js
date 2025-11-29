$(document).ready(function () {
    FillCurrentDate("txtSearchFrom");
    FillCurrentDate("txtSearchTo");
    $('#txtSearch').on('keyup', function () {
        var val = $(this).val().toLocaleLowerCase();
        $('#tblReport tbody tr').filter(function () {
            $(this).toggle($(this).text().toLocaleLowerCase().indexOf(val) > -1);
        });
    });

});
function GetCollectionReport(elem) {
    $(elem).append("<i class='fa fa-spinner fa-spin' style='font-size:20px;float:left'></i>");
    $('#tblReport tbody').empty();
    var url = config.baseUrl + "/api/Service/Diag_ServiceQueries";
    var objBO = {};
    objBO.SearcKey = '';
    objBO.SearchValue = '-';
    objBO.UnitId = Active.unitId;
    objBO.from = $('#txtSearchFrom').val();
    objBO.to = $('#txtSearchTo').val();
    objBO.login_id = Active.userId;
    objBO.Logic = 'CollectionReportAtLinkedUnit';
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        contentType: "application/json;charset=utf-8",
        dataType: "JSON",
        async: false,
        success: function (data) {
            console.log(data);
            if (data.ResultSet.Table.length > 0) {
                var tbody = ""; var temp = ""; var CashTotalAmt = 0; var OnlineTotalAmt = 0;
                $.each(data.ResultSet.Table, function (key, val) {
                    if (temp != val.ClientName) {
                        tbody += "<tr class='pr' style='background:#deffe0;'>";
                        tbody += "<td colspan='2' style='font-size:13px;'><b>Client Name : " + val.ClientName + "</b></td>";
                        tbody += "<td style='font-size:13px;text-align:right;'><b>Total :</b></td>";
                        tbody += "<td style='font-size:13px;text-align:center;font-weight: 700;'><label>0</label></td>";
                        tbody += "</tr>";
                        temp = val.ClientName
                    }

                    tbody += "<tr class='pt'>";
                    tbody += "<td hidden>" + val.clientId + "</td>";
                    tbody += "<td>" + val.staffName + "</td>";
                    tbody += "<td>" + val.visitdate + "</td>";
                    tbody += "<td>" + val.PayMode + "</td>";
                    tbody += "<td style='text-align:center'>" + val.Amount + "</td>";
                    if (val.PayMode == "Cash") {
                        CashTotalAmt += parseFloat(val.Amount) || 0;
                    }
                    else {
                        OnlineTotalAmt += parseFloat(val.Amount) || 0;
                    }
                    tbody += "</tr>";
                });
                $('#tblReport tbody').append(tbody);
                $("#txcashAmount").text(CashTotalAmt.toFixed(0));
                $("#txtOnlineAmount").text(OnlineTotalAmt.toFixed(0));
                $(elem).removeClass('i').find('.fa-spinner').remove();
            }
            else {
                $('#tblReport tbody').empty();
                $(elem).removeClass('i').find('.fa-spinner').remove();
                alert("Data Not Found..");
            };
        },
        complete: function (response) {
            TotalCal()
        },
        error: function (response) {
            alert('Server Error...!');
            $(elem).removeClass('i').find('.fa-spinner').remove();
        }
    });
}
function TotalCal() {
    var tcount = 0;
    var count = 0;
    var count1 = 0;
    var amount = 0;
    var amount1 = 0;
    $('#tblReport tbody tr').each(function () {
        if ($(this).attr('class') == 'pt') {
            tcount++;
            amount += parseInt($(this).find('td:eq(4)').text());
            if (count == $('#tblReport tbody tr.pr').length)
                $('#tblReport tbody tr.pr:last').find('td:eq(2)').find('label').text(amount);
        }

        if ($(this).attr('class') == 'pr') {
            count++;
            if (count > 1 && count <= $('#tblReport tbody tr.pr').length) {
                $('#tblReport tbody tr.pr').eq((count == 2) ? 0 : count - 2).find('td:eq(2)').find('label').text(amount);
                amount = 0;
            }
            else {
                $('#tblReport tbody tr.pr:last').find('td:eq(2)').find('label').text(amount);
            }
        }
    });


}
function DownloadDayBook(elem) {
    var url = config.baseUrl + "/api/Service/Diag_ServiceQueries";
    var objBO = {};
    objBO.SearcKey = '';
    objBO.SearchValue = '-';
    objBO.from = $('#txtSearchFrom').val();
    objBO.to = $('#txtSearchTo').val();
    objBO.login_id = Active.userId;
    objBO.UnitId = Active.unitId;
    objBO.Logic = 'JeenaSikhoDayBookReport';
    objBO.OutPutType = 'Excel';
    Global_DownloadExcel(url, objBO, "Report.xlsx", elem);
}
function DownloadExcel(elem) {
    var url = config.baseUrl + "/api/Service/Diag_ServiceQueries";
    var objBO = {};
    objBO.SearcKey = '';
    objBO.SearchValue = '-';
    objBO.UnitId = Active.unitId;
    objBO.from = $('#txtSearchFrom').val();
    objBO.to = $('#txtSearchTo').val();
    objBO.login_id = Active.userId;
    objBO.Logic = 'CollectionReportAtLinkedUnit';
    //objBO.Logic = 'JeenaSikhoCollectionReport';
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
    var unit = $('.ddlGlobalUnit option:selected').val()
    if (unit == "-") {
        alert('please Select Unit');
        return;
    }
    if ($("#txtVoucherDate").val() == "") {
        alert('please Select Voucher Date');
        return;
    }
    var objBO = {};
    var url = config.baseUrl + "/api/Service/Prolims_VoucherGeneration";
    objBO.unit_Id = unit;
    objBO.vchdate = $("#txtVoucherDate").val();
    $(elem).append("<i class='fa fa-spinner fa-spin' style='font-size:20px;float:left'></i>");
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