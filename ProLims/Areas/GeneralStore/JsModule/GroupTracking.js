$(document).ready(function () {
    $('#ddlUnit').empty().append($('<option></option>').val('Select').html('Select')).select2();
    FillCurrentDate('txtFrom')
    FillCurrentDate('txtTo');
    OnLoadUnit();
   
});
function GetGroupTracking() {
    $('#btnGet').append("<i class='fa fa-spinner fa-spin' style='font-size:20px;float:left'></i>");
    $("#tblReport tbody").empty();
    var url = config.baseUrl + "/api/GeneralStore/KitOrTest_TrackingQueries";
    var objBO = {};
    objBO.UnitId = $('#ddlUnit option:selected').val();
    objBO.from = $('#txtFrom').val();
    objBO.to = $('#txtTo').val();
    objBO.GroupId = '-';
    objBO.Prm1 = '-';
    objBO.Logic = 'TrackingKitLog';
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            console.log(data);
            if (data != '') {
                var tbody = ""; var temp = "";
                $.each(data.ResultSet.Table, function (key, val) {
                    tbody += "<tr>";
                    tbody += "<td hidden>" + val.GroupId + "</td>";
                    tbody += '<td style="text-align:center"><a id="btngroup' + key + '" href="javascript:void(0)" onclick="GetGroupList(this)" data-groupid=' + val.GroupId + '><i class="fa fa-eye" style="color: #F44336; font-size: 13px;"></i></a></td>';
                    tbody += "<td>" + val.GroupName + "</td>";
                    tbody += "<td style='text-align:center'>" + val.OpeningQty + "</td>";
                    tbody += "<td style='text-align:center'>" + val.TrfQty + "</td>";
                    tbody += "<td style='text-align:center'>" + val.TotalTestToBePerform + "</td>";
                    tbody += "<td style='text-align:center'>" + val.TestPerformed + "</td>";
                    tbody += "<td style='text-align:center'>" + val.mac_SampleRunCount + "</td>";
                    tbody += "<td style='text-align:center'>" + val.mac_CalibRunCount + "</td>";
                    tbody += "<td style='text-align:center'>" + val.mac_QCRunCount + "</td>";
                    tbody += "<td style='text-align:center'>" + val.bal1 + "</td>";
                    tbody += "<td style='text-align:center'>" + val.bal2 + "</td>";
                    tbody += "</tr>";
                });
                $("#tblReport tbody").append(tbody);
                $('#btnGet i').remove();
            }
            else {
                alert("Error");
                $('#btnGet i').remove();
            };
        },
        error: function (response) {
            alert('Server Error...!');
            $('#btnGet i').remove();
        }
    });
}
function ExcelDownLoad() {
    var url = config.baseUrl + "/api/GeneralStore/KitOrTest_TrackingQueries";
    var objBO = {};
    objBO.UnitId = $('#ddlUnit option:selected').val();
    objBO.from = $('#txtFrom').val();
    objBO.to = $('#txtTo').val();
    objBO.GroupId = '-';
    objBO.Prm1 = '-';
    objBO.Logic = 'TrackingKitLog';
    objBO.ReportType = 'Excel';
    Global_DownloadExcel(url, objBO, "Report.xlsx");
}
function Global_DownloadExcel(Url, objBO, fileName) {
    $('#btnExcel').append("<i class='fa fa-spinner fa-spin' style='font-size:20px;float:left'></i>");
    var ajax = new XMLHttpRequest();
    ajax.open("Post", Url, true);
    ajax.responseType = "blob";
    ajax.setRequestHeader("Content-type", "application/json")
    ajax.onreadystatechange = function () {
        if (this.readyState == 4) {
            console.log(this.response);
            var blob = new Blob([this.response], { type: "application/octet-stream" });
            saveAs(blob, fileName); //refernce by ~/JsModule/FileSaver.min.js
            $('#btnExcel i').remove();
        }
    };
    ajax.send(JSON.stringify(objBO));
}
function GetGroupList(elem) {
    selectRow($(elem))
    $("#modelGroupDetails").modal('show');
    var GroupId = $(elem).data('groupid');
    GetList(GroupId)
}
function GetList(GroupId) {
    $("#tblGroupObservationLink tbody").empty();
    $("#tblGroupPackLink tbody").empty();
    var url = config.baseUrl + "/api/GeneralStore/KitOrTest_TrackingQueries";
    var objBO = {};
    objBO.UnitId = $('#ddlUnit option:selected').val();
    objBO.from = $('#txtFrom').val();
    objBO.to = $('#txtTo').val();
    objBO.GroupId = GroupId;
    objBO.Prm1 = '-';
    objBO.Logic = 'GetItemOrObservationList';
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            console.log(data);
            if (data != '') {
                var tbody = ""; var temp = ""; var temp1 = "";
                if (data && data.ResultSet) {
                    // Table 1: GroupPackLink
                    if (Array.isArray(data.ResultSet.Table) && data.ResultSet.Table.length) {
                        let temp = '';
                        let tbody = '';
                        $.each(data.ResultSet.Table, function (key, val) {
                            if (temp != val.GroupName) {
                                tbody += "<tr style='background:#d9d9d9;'>";
                                tbody += "<td colspan='7' style='font-size:15px;padding: 5px;'><b>Group Name: " + val.GroupName + "</b></td>";
                                tbody += "</tr>";
                                temp = val.GroupName;
                            }
                            tbody += "<tr>";
                            tbody += "<td hidden>" + val.autoid + "</td>";
                            tbody += "<td hidden>" + val.GroupId + "</td>";
                            tbody += "<td hidden>" + val.ItemId + "</td>";
                            tbody += "<td>" + val.item_name + "</td>";
                            tbody += "<td>" + val.PackType + "</td>";
                            tbody += "<td style='text-align:center'>" + val.TestPerfNos + "</td>";
                            tbody += "</tr>";
                        });
                        $("#tblGroupPackLink tbody").append(tbody);
                    }

                    // Table 2: GroupObservationLink
                    if (Array.isArray(data.ResultSet.Table1) && data.ResultSet.Table1.length) {
                        let temp = '';
                        let tbody = '';
                        $.each(data.ResultSet.Table1, function (key, val) {
                            if (temp != val.GroupName) {
                                tbody += "<tr style='background:#d9d9d9;'>";
                                tbody += "<td colspan='3' style='font-size:15px;padding: 5px;'><b>Group Name: " + val.GroupName + "</b></td>";
                                tbody += "</tr>";
                                temp = val.GroupName;
                            }
                            tbody += "<tr>";
                            tbody += "<td hidden>" + val.autoid + "</td>";
                            tbody += "<td>" + val.GrpName + "</td>";
                            tbody += "<td>" + val.Observation_Name + "</td>";
                            tbody += "</tr>";
                        });
                        $("#tblGroupObservationLink tbody").append(tbody);
                    }
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
function OnLoadUnit() {
    var url = config.baseUrl + "/api/GeneralStore/KitOrTest_TrackingQueries";
    var objBO = {};
    objBO.UnitId = Active.unitId;
    objBO.from = $('#txtFrom').val();
    objBO.to = $('#txtTo').val();
    objBO.GroupId = '-';
    objBO.Prm1 = '-';
    objBO.Logic = 'GetUnitList';;
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