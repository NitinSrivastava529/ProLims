$(document).ready(function () {
    OnLoadList();
    OnloadCityList();
    $('#txtSearch').on('keyup', function () {
        var val = $(this).val().toLowerCase();
        $('#tblReport tbody tr').filter(function () {
            $(this).toggle($(this).text().toLowerCase().indexOf(val) > -1);
        });
    });
});
function OnLoadList() {
    $('#tblReport tbody').empty();
    var url = config.baseUrl + "/api/GeneralStore/MasterQueries";
    var objBO = {};
    objBO.prm_1 = '-';
    objBO.Logic = 'CityRateListMaster';
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        contentType: "application/json;charset=utf-8",
        dataType: "JSON",
        success: function (data) {
            if (Object.keys(data.ResultSet).length) {
                if (Object.keys(data.ResultSet.Table).length) {
                    var tbody = ""; var temp = "";
                    $.each(data.ResultSet.Table, function (key, val) {

                        tbody += "<tr>";
                        tbody += "<td>" + val.RateListId + "</td>";
                        tbody += "<td>" + val.RateListName + "</td>";
                        tbody += "<td>" + val.RateListType + "</td>";
                        tbody += "<td style='width:12%;text-align:center'><button type='button' data-rateid='" + val.RateListId + "' style='height:30px' class='btn btn-success' onclick='DownloadExcel(this)'><span class='fa fa-download'></span>&nbsp;DownLoad</button></td>";
                        tbody += "<td style='width:40%;text-align:center'>" +
                            '<div style="display:flex"><input type="file" id="btnBrowser" class="form-control" />' +
                            '<button class="btn btn-warning" id="btnUpload" type="button" onclick="UploadCityRate(this)" style="margin-left: 10px;width:25%;"> <span class="fa fa-upload"></span> &nbsp;Upload </button>' +
                            "</div></td>";
                        tbody += "<td style='width:5%;text-align:center'><button type='button' data-rateid='" + val.RateListId + "' data-ratename='" + val.RateListName + "'style='height:30px' class='btn btn-primary' onclick='DownloadPdf(this)'><span class='fa fa-download'></span>&nbsp;Pdf</button></td>";
                        tbody += "</tr>";
                    });
                    $('#tblReport tbody').append(tbody);
                }
            }
            else {
                $('#btnsearch i').remove();
            }

        },
        error: function (response) {
            alert('Server Error...!');
        }
    });
}
function DownloadExcel(elem) {
    selectRow(elem);
    var url = config.baseUrl + "/api/GeneralStore/MasterQueries";
    var objBO = {};
    objBO.OutPutType = "Excel";
    objBO.prm_1 = $(elem).data('rateid');
    objBO.Logic = 'RateIdWiseItemList';
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
function UploadCityRate(btn) {
    selectRow(btn);
    var $row = $(btn).closest('tr'); // get current row
    var RateListId = $row.find('td:eq(0)').text();
    var RateListName = $row.find('td:eq(1)').text();
    var uploadFile = $row.find('#btnBrowser')[0].files;
    if (uploadFile.length === 0) {
        alert('Please select an Excel file');
        return;
    }
    $(btn).append("<i class='fa fa-spinner fa-spin' style='font-size:20px;float:left'></i>");
    var formData = new FormData();
    formData.append("ExcelFile", uploadFile[0]);
    formData.append("LoginId", Active.userId);
    formData.append("Unitid", Active.unitId);
    formData.append("CompId", Active.compId);
    formData.append("RateListId", RateListId);
    formData.append("Logic", "UpdateCityRateExcelWise");
    $.ajax({
        url: config.baseUrl + '/api/GeneralStore/UploadExcelCityRate',
        type: 'POST',
        data: formData,
        contentType: false,
        processData: false,
        success: function (data) {
            if (data.includes('Success')) {
                alert(data);
                $('#btnUpload i').remove();
                $(btn).prop("disabled", true);
                $row.find('#btnBrowser').val('')
            }
            else {
                alert(data);
                $('#btnUpload i').remove();
            };
        },
        error: function (response) {
            alert('Server Error...!');
            alert('Error while uploading file.');
            $('#btnUpload i').remove();
        }
    });
}
function OnloadCityList() {
    var url = config.baseUrl + "/api/GeneralStore/MasterQueries";
    var objBO = {};
    objBO.prm_1 = '-';
    objBO.Logic = 'Citylist';
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        contentType: "application/json;charset=utf-8",
        dataType: "JSON",
        success: function (data) {
            if (Object.keys(data.ResultSet.Table).length) {
                $('#ddlCity').empty().append($('<option value="ALL">Select</option>'));
                $.each(data.ResultSet.Table, function (key, val) {
                    $('#ddlCity').append($('<option></option>').val(val.CityName).html(val.CityName));
                });

            }

        },
        error: function (response) {
            alert('Server Error...!');
        }
    });
}
function SubmitCity() {
    var url = config.baseUrl + "/api/GeneralStore/InsertPanelMaster";
    var objBO = {};
    objBO.Unitid = Active.unitId;
    objBO.CompId = Active.compId;
    objBO.PanelId = '-';
    objBO.PanelName = $("#ddlCity option:selected").val() + ' ' + '[City Rate]';
    objBO.itemId = '-';
    objBO.login_id = Active.userId;
    objBO.Rate = '0';
    objBO.Logic = 'InsertDiag_RateListName';
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            if (data.includes('Success')) {
                alert(data);
                $('#ddlCity').prop('selectedIndex', '0').change();
                OnLoadList();
            }
            else {
                alert(data);
            };
        },
        error: function (response) {
            alert('Server Error...!');
        }
    });
}

function DownloadPdf(elem) {
    selectRow(elem);
    var rateid = $(elem).data('rateid');
    var RateName = $(elem).data('ratename');
    var url = "../Print/PrintCityRateList?RateId=" + rateid + "&RateName=" + RateName;
    window.open(url, '_blank');
}
