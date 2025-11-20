
$(document).ready(function () {
    OnloadPanelList();
    $('#ddlPanel').on('change', function () {
        AddPanellist();
    });
});
function OnloadPanelList() {
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
        if (Object.keys(data.ResultSet.Table).length) {
            $('#ddlPanel').empty().append($('<option value="ALL">Select</option>'));
            $.each(data.ResultSet.Table, function (key, val) {
                $('#ddlPanel').append($('<option></option>').val(val.Panel_Id).html(val.Panel_Name)).select2();
            });

        }

        },
        error: function (response) {
            alert('Server Error...!');
        }
    });
}
function AddPanellist() {
    var body1 = "";
    var PanelId = $('#ddlPanel option:selected').val()
    var PanelName = $('#ddlPanel option:selected').text()
    var exists = $('#tblPanelList tbody tr td[data-panelid="' + PanelId + '"]').length > 0
    if (!exists) {
        var body1 = "";
        body1 += "<tr>";
        body1 += "<td style='padding:2px;' data-panelid='" + PanelId + "'>" + PanelId + "</td>";
        body1 += "<td style='padding:2px;'>" + PanelName + "</td>";
        body1 += "<td style='width:5%;text-align:center'><button onclick='deleteRow(this)' class='btn btn-danger'><i class='fa fa-remove'></i></button></td>";
        body1 += "</tr>";
        $('#tblPanelList tbody').append(body1);
    }
    else {
        alert("This Unit Name is already added!");
    }
}
function deleteRow(el) {
    $(el).closest('#tblPanelList tbody tr').remove();
}
function DownloadExcel(elem) {
    debugger
    var Panellist = []; 
    var isEmpty = true; 
    $('#tblPanelList tbody tr').each(function () {
        isEmpty = false;
        Panellist.push($(this).find('td:eq(0)').data('panelid'));
    });
    if (isEmpty) {
        alert("Please Add at least one Panel Name.");
        $('#tblPanelList').focus();
        return;
    }
    var url = config.baseUrl + "/api/GeneralStore/MasterQueries";
    var objBO = {};
    objBO.OutPutType = "Excel";
    objBO.remark = Panellist.join(',');
    objBO.Logic = 'PanelRateListExcel';
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


