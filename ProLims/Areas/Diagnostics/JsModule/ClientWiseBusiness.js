$(document).ready(function () {
    $("#ddlclient").append($("<option selected></option>").val("ALL").html("ALL")).select2();
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
    objBO.Logic = 'UserWiseClient';
// objBO.Logic = 'UserWiseClientList';
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            if (Object.keys(data.ResultSet).length > 0) {
                if (Object.keys(data.ResultSet.Table).length > 0) {
                    $("#ddlclient").empty().append($("<option selected></option>").val("ALL").html("ALL")).select2();
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
    var url = config.baseUrl + "/api/Patient/pB2B_AnalysisQueries";
    var objBO = {};
    objBO.unitId = 'CH01';
    objBO.compId = 'CH01';
    objBO.clientId = $('#ddlclient option:selected').val();
    objBO.from = $('#txtSearchFrom').val();
    objBO.to = $('#txtSearchTo').val();
    objBO.Prm1 = '-';
    objBO.Prm2 = '-';
    objBO.Prm3 = '-';
    objBO.loginId = Active.userId;
    objBO.Logic = "B2BDash:ClientWiseBusiness";    
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
                var TotalAmt = 0; var txtPanelAmount = 0; var B2BRevenue = 0; var ChandanRevenue = 0;var AdlAmountTotal = 0; var pdiscountTotal = 0; var panelRateTotal = 0; var mrprateTotal = 0;
                $.each(data.ResultSet.Table, function (key, val) {
                    if (temp != val.CityName) {
                        tbody += "<tr class='pr' style='background:#e7e7e7;'>";
                        tbody += "<td colspan='20' style='font-size:13px;'><b>City Name : " + val.CityName + "</b></td>";
                        tbody += "</tr>";
                        temp = val.CityName
                    }
                    //tbody += "<td>" + val.ClientName + "</td>";     
                    tbody += '<td><a id="btn' + key + '" href="javascript:void(0)" '
                        + 'onclick="GetCategoryAndTest(this)" '
                        + 'data-clientid="' + val.ClientId + '" '
                        + 'data-clientname="' + val.ClientName + '" '
                        + 'style="color:blue;border-bottom:1px solid;">'
                        + val.ClientName +
                        '</a></td>';
                    tbody += "<td style='text-align:right'>" + val.PatientCount + "</td>";
                    tbody += "<td style='text-align:right'>" + val.TestCount + "</td>";
                    tbody += "<td style='text-align:right'>" + val.GrossAmount + "</td>";
                    tbody += "<td style='text-align:right'>" + val.ContractualAmount + "</td>";                   
                    tbody += "<td style='text-align:right'>" + val.ContractualDiscount + "</td>";                   
                    tbody += "<td style='text-align:right'>" + val.AdlDiscount + "</td>";                   
                    tbody += "<td style='text-align:right'>" + val.NetAmount + "</td>";                   
                    tbody += "</tr>";

                    AdlAmountTotal += parseFloat(val.AdlDiscount) || 0;
                    txtPanelAmount += parseFloat(val.ContractualAmount) || 0;                   
                    mrprateTotal += parseFloat(val.GrossAmount) || 0;
                    TotalAmt += parseFloat(val.NetAmount) || 0;
                });
                $('#tblReport tbody').append(tbody);
                $(elem).removeClass('i').find('.fa-spinner').remove();
                $("#txtMrptotal").text(mrprateTotal.toFixed(0));
                $("#txtPanelAmount").text(txtPanelAmount.toFixed(0));             
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
    var url = config.baseUrl + "/api/Patient/pB2B_AnalysisQueries";
    var objBO = {};
    objBO.unitId = 'CH01';
    objBO.compId = 'CH01';
    objBO.clientId = $('#ddlclient option:selected').val();
    objBO.from = $('#txtSearchFrom').val();
    objBO.to = $('#txtSearchTo').val();
    objBO.Prm1 = '-';
    objBO.Prm2 = '-';
    objBO.Prm3 = '-';
    objBO.OutPutType = 'Excel';
    objBO.loginId = Active.userId;
    objBO.Logic = "B2BDash:ClientWiseBusiness";    
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
function GetCategoryAndTest(elem) {
    $('#tblTest tbody').empty();
    $('#tblCategory tbody').empty();
    selectRow($(elem))
    $("#ModelCategoryAndTest").modal('show');
    var ClientID = $(elem).data('clientid');
    var ClientName = $(elem).data('clientname');
    $("#txtclientName").text(ClientName);
    GetCategoryList(ClientID);
}
function GetCategoryList(ClientID) {
    $('#tblCategory tbody').empty();
    var url = config.baseUrl + "/api/Patient/pB2B_AnalysisQueries";
    var objBO = {};
    objBO.unitId = 'CH01';
    objBO.compId = 'CH01';
    objBO.clientId = ClientID;
    objBO.from = $('#txtSearchFrom').val();
    objBO.to = $('#txtSearchTo').val();
    objBO.Prm1 = '-';
    objBO.Prm2 = '-';
    objBO.Prm3 = '-';
    objBO.loginId = Active.userId;
    objBO.Logic = "B2BCategory:ClientWiseBusiness";
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        contentType: "application/json;charset=utf-8",
        dataType: "JSON",
        success: function (data) {
            if (data.ResultSet.Table.length > 0) {
                var tbody = "";
                $.each(data.ResultSet.Table, function (key, val) {
                    tbody += "<tr>";
                    tbody += "<td>" + val.SubCatName + "</td>";
                    tbody += "<td style='text-align:center;'>" + val.totalTest + "</td>";
                    tbody += "<td style='text-align:center;'>" + val.totalAmount + "</td>";
                    tbody += "<td style='text-align:center;'>"
                        + "<button data-subcatid='" + val.SubCatId + "' "
                        + "data-clientid='" + objBO.clientId + "' "
                        + "onclick='GetTestList(this);selectRow(this)' "
                        + "class='btn btn-warning bt-xs'>"
                        + "<i class='fa fa-sign-in'>&nbsp;</i>"
                        + "</button></td>";
                    tbody += "</tr>";
                });
                $('#tblCategory tbody').append(tbody);
            }
        },
        error: function (response) {
            alert('Server Error...!');
        }
    });
}
function GetTestList(elem) {
    $('#tblTest tbody').empty();
    var subcategoryId = $(elem).data('subcatid');
    var clientid = $(elem).data('clientid');
    var url = config.baseUrl + "/api/Patient/pB2B_AnalysisQueries";
    var objBO = {};
    objBO.unitId = 'CH01';
    objBO.compId = 'CH01';
    objBO.clientId = clientid;
    objBO.from = $('#txtSearchFrom').val();
    objBO.to = $('#txtSearchTo').val();
    objBO.Prm1 = subcategoryId;
    objBO.Prm2 = '-';
    objBO.Prm3 = '-';
    objBO.loginId = Active.userId;
    objBO.Logic = "B2BTest:ClientWiseBusiness";
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        contentType: "application/json;charset=utf-8",
        dataType: "JSON",
        success: function (data) {
            if (data.ResultSet.Table.length > 0) {
                var tbody = "";
                $.each(data.ResultSet.Table, function (key, val) {
                    tbody += "<tr>";
                    tbody += "<td>" + val.ItemName + "</td>";
                    tbody += "<td style='text-align:center;'>" + val.totalTest + "</td>";
                    tbody += "<td style='text-align:center;'>" + val.totalAmount + "</td>";
                    tbody += "</tr>";
                });
                $('#tblTest tbody').append(tbody);
            }
        },
        error: function (response) {
            alert('Server Error...!');
        }
    });
}



