

$(document).ready(function () {
    FillCurrentDate("txtSearchFrom");
    FillCurrentDate("txtSearchTo");
    $('#txtSearch').on('keyup', function () {
        var val = $(this).val().toLocaleLowerCase();
        $('#tblReport tbody tr').filter(function () {
            $(this).toggle($(this).text().toLocaleLowerCase().indexOf(val) > -1);
        });
    });
    Onload();
});
function Onload() {
    var url = config.baseUrl + "/api/Service/Diag_ServiceQueries";
    var objBO = {};
    objBO.SearcKey = '';
    objBO.SearchValue = '-';
    objBO.from = $('#txtSearchFrom').val();
    objBO.to = $('#txtSearchTo').val();
    objBO.login_id = Active.userId;
    objBO.UnitId = Active.unitId;
    objBO.Logic = 'UserWiseClientList';
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            if (Object.keys(data.ResultSet).length > 0) {
                if (Object.keys(data.ResultSet.Table).length > 0) {
                    $("#ddlclient").append($("<option selected></option>").val("ALL").html("ALL")).select2();
                    $.each(data.ResultSet.Table, function (key, value) {
                        $("#ddlclient").append($("<option></option>").val(value.ClientId).html(value.ClientName));
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

function Geteport(elem) {
    $(elem).append("<i class='fa fa-spinner fa-spin' style='font-size:20px;float:left'></i>");
    $('#tblReport tbody').empty();
    var url = config.baseUrl + "/api/Service/Diag_ServiceQueries";
    var objBO = {};
    objBO.SearcKey = '';
    objBO.SearchValue = '-';
    objBO.prm_1 = $("#ddlclient option:selected").val()
    objBO.from = $('#txtSearchFrom').val();
    objBO.to = $('#txtSearchTo').val();
    objBO.login_id = Active.userId;
    objBO.UnitId = Active.unitId;
    objBO.Logic = 'JeenaSikhoPatientReport';
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
                var tbody = ""; var temp = ""; var temp1 = "";
                var TotalAmt = 0; var AdlAmountTotal = 0; var pdiscountTotal = 0; var panelRateTotal = 0; var mrprateTotal = 0;
                $.each(data.ResultSet.Table, function (key, val) {
                    if (temp != val.ClientName) {
                        tbody += "<tr class='pr' style='background:#dbdbdb;'>";
                        tbody += "<td colspan='20' style='font-size:13px;'><b>Client Name : " + val.ClientName + "</b></td>";
                        tbody += "</tr>";
                        temp = val.ClientName
                    }
                    if (temp1 != val.Patient_name) {
                        tbody += "<tr style='background:#d2f3ab;'>";
                        tbody += "<td colspan='20' style='font-size:13px;'><b>Patient Name : " + val.Patient_name + "</b>,&nbsp;&nbsp;&nbsp;<b>Gender: " + val.Gender + "</b>,&nbsp;&nbsp;&nbsp;<b>Age: " + val.ageInfo + "</b></td>";
                        tbody += "</tr>";
                        temp1 = val.Patient_name
                    }
                    tbody += "<td>" + val.UHID + "</td>";
                    tbody += "<td>" + val.ipop_no + "</td>";
                    tbody += "<td>" + val.VisitNo + "</td>";
                    tbody += "<td>" + val.VisitDate + "</td>";
                    tbody += "<td>" + val.ItemName + "</td>";
                    tbody += "<td>" + val.Qty + "</td>";
                    tbody += "<td style='text-align:center'>" + val.mrp_rate + "</td>";
                    tbody += "<td style='text-align:center'>" + val.panel_rate + "</td>";
                    tbody += "<td style='text-align:center'>" + val.panel_disc + "</td>";
                    tbody += "<td style='text-align:center'>" + val.adl_discount + "</td>";
                    tbody += "<td style='text-align:center'>" + val.amount + "</td>";
                    tbody += "<td>" + val.sampleUserName + "</td>";
                    tbody += "<td>" + val.sampleDate + "</td>";
                    tbody += "<td>" + val.DispatchNo + "</td>";
                    tbody += "<td>" + val.DispatchUserName + "</td>";
                    tbody += "<td>" + val.dispatchdate + "</td>";
                    tbody += "<td style='text-align:center'>" + val.IsPushToLIS + "</td>";
                    tbody += "</tr>";

                    if (val.IsPackagedItem == "0") {
            
                        AdlAmountTotal += parseFloat(val.adl_discount) || 0;
                        pdiscountTotal += parseFloat(val.panel_disc) || 0;
                        panelRateTotal += parseFloat(val.panel_rate) || 0;
                        mrprateTotal += parseFloat(val.mrp_rate) || 0;
                        TotalAmt += parseFloat(val.amount) || 0;
                    }
                    else {
                    }
                });
                $('#tblReport tbody').append(tbody);
                $(elem).removeClass('i').find('.fa-spinner').remove();
                $("#txtMrptotal").text(mrprateTotal.toFixed(0));
                $("#txtpanelRatetotal").text(panelRateTotal.toFixed(0));
                $("#txtpaneldistotal").text(pdiscountTotal.toFixed(0));
                $("#txtAdltotal").text(AdlAmountTotal.toFixed(0));
                $("#txttotal").text(TotalAmt.toFixed(0));
             
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
    var url = config.baseUrl + "/api/Service/Diag_ServiceQueries";
    var objBO = {};
    objBO.SearcKey = '';
    objBO.SearchValue = '-';
    objBO.prm_1 = $("#ddlclient option:selected").val()
    objBO.from = $('#txtSearchFrom').val();
    objBO.to = $('#txtSearchTo').val();
    objBO.login_id = Active.userId;
    objBO.UnitId = Active.unitId;
    objBO.Logic = 'JeenaSikhoPatientReport';
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