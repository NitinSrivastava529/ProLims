var editPanelId = "";
$(document).ready(function () {
    OnloadPanelList();
    $('#btnPanelsave').on('click', function () {
        var val = $(this).val();
        if (val == 'Submit') {
            InsertPanelMaster('Insert');
        }
        else if (val == 'Update') {
            InsertPanelMaster('Update');
        }
    });
    $('#tblPanelMaster tbody').on('click', '.getpanel', function () {
        editPanelId = $(this).closest('tr').find('td:eq(2)').text();
        var PanelName = $(this).closest('tr').find('td:eq(3)').text();
        $('#txtPanelName').val(PanelName)
        $('#btnPanelsave').val('Update');
        $('#tblPanelMaster tbody tr').find('td').removeAttr('style');
        $(this).closest('tr').find('td:eq(2),td:eq(3)').css({ 'background': '#c7e6ff', 'color': 'black' });
    });
    $('#tblPanelMaster tbody').on('click', '#btnselect', function () {
        var PanelId = $(this).closest('tr').find('td:eq(2)').text();
        var PanelName = $(this).closest('tr').find('td:eq(3)').text();
        deleteRow(PanelId)
    });
});
function InsertPanelMaster(logic) {
    if ($('#txtPanelName').val() == '') {
        alert('Enter Panel Name');
        $('#txtPanelName').focus();
        return
    }
    var url = config.baseUrl + "/api/GeneralStore/InsertPanelMaster";
    var objBO = {};
    objBO.Unitid = Active.unitId;
    objBO.CompId = Active.compId;
    objBO.PanelId = editPanelId;
    objBO.PanelName = $('#txtPanelName').val();
    objBO.itemId = '-';
    objBO.login_id = Active.userId;
    objBO.Rate = '0';
    objBO.Logic = logic;
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            if (data.includes('Success')) {
                alert(data);
                $('#txtPanelName').text('');
                $('#txtPanelName').val('');
                $('#btnPanelsave').val('Submit');
                OnloadPanelList();
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
function OnloadPanelList() {
    $("#tblPanelMaster tbody").empty();
    var url = config.baseUrl + "/api/GeneralStore/MasterQueries";
    var objBO = {};
    objBO.prm_1 = '-';
    objBO.Logic = 'OnloadPanelList';
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        contentType: "application/json;charset=utf-8",
        dataType: "JSON",
        success: function (data) {
            var tbody = "";
            if (Object.keys(data.ResultSet).length) {
                if (Object.keys(data.ResultSet.Table).length) {
                    $.each(data.ResultSet.Table, function (key, val) {
                        tbody += "<tr>";
                        tbody += "<td style='text-align:center'>" +
                            '<button type="button" id="btnselect" class="btn btn-danger btn-xs"> <i class="fa fa-close"></i></button> ' +
                            "</td>";
                        tbody += "<td style='text-align:center'>" +
                            '<button type="button" class="btn btn-warning btn-xs getpanel"> <i class="fa fa-edit"></i></button> ' +
                            "</td>";
                        tbody += "<td>" + val.Panel_Id + "</td>";
                        tbody += "<td>" + val.Panel_Name + "</td>";
                        tbody += "<td style='width:12%;text-align:center'><button type='button' data-panelid='" + val.Panel_Id + "' style='height:30px' class='btn btn-success' onclick='DownloadExcel(this)'><span class='fa fa-download'></span>&nbsp;DownLoad</button></td>";
                        tbody += "<td style='width:40%;text-align:center'>" + 
                            '<div style="display:flex"><input type="file" id="btnBrowser" class="form-control" />' +
                            '<button class="btn btn-warning" id="btnUpload" type="button" onclick="UploadPanelRate(this)" style="margin-left: 10px;width:25%;"> <span class="fa fa-upload"></span> &nbsp;Upload </button>' +
                            "</div></td>";
                        tbody += "</tr>";
                    });
                    $("#tblPanelMaster tbody").append(tbody);

                }
            }

        },
        error: function (response) {
            alert('Server Error...!');
        }
    });
}
function deleteRow(PanelId) {
    var url = config.baseUrl + "/api/GeneralStore/InsertPanelMaster";
    var objBO = {};
    objBO.Unitid = Active.unitId;
    objBO.CompId = Active.compId;
    objBO.PanelId = PanelId;
    objBO.PanelName = '-';
    objBO.itemId = '-';
    objBO.login_id = Active.userId;
    objBO.Rate = '0';
    objBO.Logic = 'Delete';
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            if (data.includes('Success')) {
                alert(data);
                OnloadPanelList();
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
function DownloadExcel(elem) {
    selectRow(elem);
    var url = config.baseUrl + "/api/GeneralStore/MasterQueries";
    var objBO = {};
    objBO.OutPutType = "Excel";
    objBO.prm_1 = $(elem).data('panelid');
    objBO.Logic = 'ItemListByPanelId';
    Global_DownloadExcel(url, objBO, "PanelReport.xlsx", elem);
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
function UploadPanelRate(btn) {
    selectRow(btn);
    var $row = $(btn).closest('tr'); // get current row
    var PanelId = $row.find('td:eq(2)').text();
    var PanelName = $row.find('td:eq(3)').text();
    var uploadFile = $row.find('#btnBrowser')[0].files;
    if (uploadFile.length === 0) {
        alert('Please select an Excel file');
        return;
    }
    $(btn).append("<i class='fa fa-spinner fa-spin' style='font-size:20px;float:left'></i>");
    var formData = new FormData();
    formData.append("ExcelFile", uploadFile[0]);
    formData.append("LoginId", Active.userId);
    formData.append("Logic", "InsertExcel");
    $.ajax({
        url: config.baseUrl + '/api/GeneralStore/UploadPanelRateExcel',
        type: 'POST',
        data: formData,
        contentType: false,
        processData: false,
        success: function (data) {
            if (data.includes('Success')) {
                alert(data);
                $('#btnUpload i').remove();
                $(btn).prop("disabled", true);
            }
            else
            {
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
