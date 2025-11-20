var btn = "";
$(document).ready(function () {
    FillCurrentDate('txtFrom')
    FillCurrentDate('txtTo')
    $('#ddlUnit').empty().append($('<option></option>').val('ALL').html('ALL')).select2();
    GetUnitList();
    GetReportCategory();
    $('#tblReportCategory tbody').on('click', '.btnEdit', function () {
        var ReportCatid = $(this).closest('tr').find('td:eq(0)').text();
        GetReportType(ReportCatid)
    });
});

function GetUnitList() {
    var url = config.baseUrl + "/api/GeneralStore/MasterQueries";
    var objBO = {};
    objBO.Logic = 'GetUnitList';
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        dataType: "json",
        async: false,
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            if (Object.keys(data.ResultSet).length) {
                if (Object.keys(data.ResultSet.Table).length) {
                    $('#ddlUnit').empty().append($('<option></option>').val('ALL').html('ALL')).select2();
                    $.each(data.ResultSet.Table, function (key, val) {
                        $("#ddlUnit").append($("<option></option>").val(val.Unit_Code).html(val.unit_name));
                    }); 
                }
            }
            else {
                alert("Error");
            };
        },
        error: function (response) {
            alert('Server Error...!');
        }
    });
}
function GetReportCategory() {
    $('#tblReportCategory tbody').empty();
    var url = config.baseUrl + "/api/GeneralStore/Internal_AuditQuery";
    var objBO = {};
    objBO.UnitCode = $('#ddlUnit option:selected').val();
    objBO.from = $('#txtFrom').val();
    objBO.To = $('#txtTo').val();
    objBO.ReportName = 'ReportCategoryList';
    objBO.Prm1 = '-';
    objBO.Prm2 = '-';
    objBO.LoginId = '-';
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            var tbody = "";
            if (Object.keys(data.ResultSet).length > 0) {
                if (Object.keys(data.ResultSet.Table).length > 0) {
                    $.each(data.ResultSet.Table, function (key, val) {
                        tbody += "<tr>";
                        tbody += '<td hidden>' + val.ReportCatId + '</td>';
                        tbody += '<td>' + val.ReportCatName + '</td>';
                        tbody += '<td style="width:5%;text-align:center;"><button  class="btn btn-success btnEdit">Select</button></td>';
                        tbody += '</tr>';
                    });
                    $('#tblReportCategory tbody').append(tbody);

                }
            }
        },
        error: function (response) {
            alert('Server Error...!');
        }
    });
}
function GetReportType(categoryId) {
    $('#tblReportType tbody').empty();
    var url = config.baseUrl + "/api/GeneralStore/Internal_AuditQuery";
    var objBO = {};
    objBO.UnitCode = $('#ddlUnit option:selected').val();
    objBO.from = $('#txtFrom').val();
    objBO.To = $('#txtTo').val();
    objBO.ReportName = 'ReportTypeList';
    objBO.Prm1 = categoryId;
    objBO.Prm2 = '-';
    objBO.LoginId = '-';
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            console.log(data);
            var tbody = "";
            if (Object.keys(data.ResultSet).length > 0) {
                if (Object.keys(data.ResultSet.Table).length > 0) {
                    $.each(data.ResultSet.Table, function (key, val) {
                        tbody += "<tr>";
                        tbody += '<td hidden>' + val.CatId + '</td>';
                        tbody += '<td>' + val.ReportName + '</td>';
                        tbody += '<td style="Width:20%;text-align:center">' + val.Daterequired + '</td>';
                        tbody += '<td class="text-center" style="width:15%"><a id="btnPrintpdf' + key +
                            '" href="javascript:void(0)" onclick="GetExcelReport(' + " '" + key + "','" + val.ReportName + "'" + ')" class="btn btn-success">Excel</a></td>';
                        tbody += '</tr>';
                    });
                    $('#tblReportType tbody').append(tbody);

                }
            }
        },
        error: function (response) {
            alert('Server Error...!');
        }
    });
}

function GetExcelReport(Key, ReportType) {
    btn = $('#btnPrintpdf' + Key);  // Select the specific button
    btn.append("<i class='fa fa-spinner fa-spin' style='font-size:15px;float:left;margin-right:5px'></i>");
    var url = config.baseUrl + "/api/GeneralStore/Internal_AuditQuery";
    var objBO = {};
    objBO.UnitCode = $('#ddlUnit option:selected').val();
    objBO.from = $('#txtFrom').val();
    objBO.To = $('#txtTo').val();
    objBO.ReportName = ReportType;
    objBO.Prm1 = '-';
    objBO.Prm2 = '-';
    objBO.LoginId = '-';
    objBO.OutPutType = "Excel"
    Global_DownloadExcel(url, objBO, "" + ReportType + ".xlsx")
}
function Global_DownloadExcel(Url, objBO, fileName) {
    var ajax = new XMLHttpRequest();
    ajax.open("Post", Url, true);
    ajax.responseType = "blob";
    ajax.setRequestHeader("Content-type", "application/json")
    ajax.onreadystatechange = function () {
        if (this.readyState == 4) {
            var blob = new Blob([this.response], { type: "application/octet-stream" });
            saveAs(blob, fileName); //refernce by ~/JsModule/FileSaver.min.js
        }
        btn.find('i.fa-spinner').remove();
    };
    ajax.send(JSON.stringify(objBO));
}