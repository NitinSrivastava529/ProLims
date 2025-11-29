var editautoid = "";
var logicname = "";
$(document).ready(function () {
    FillCurrentDate("txtfrom");
    FillCurrentDate("txtto");
    //GetReport('');
})

function GetReport(logic) {
    logicname = logic;
    $('#tblReport tbody').empty();
    var url = config.baseUrl + "/api/Service/Diag_BusinessEnquiryQueries";
    var objBO = {};
    objBO.SearcKey = '';
    objBO.prm_1 = $('#ddlStatus option:selected').val();
    objBO.UnitId = Active.unitId;
    objBO.from = $("#txtfrom").val();
    objBO.to = $("#txtto").val();
    objBO.login_id = Active.userId;
    objBO.Logic = logic;
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        contentType: "application/json;charset=utf-8",
        dataType: "JSON",
        success: function (data) {
            if (data.ResultSet.Table.length > 0) {
                var tbody = ""; var temp = "";
                $.each(data.ResultSet.Table, function (key, val) {
                    if (val.uStatus == "Interested") {
                        tbody += "<tr style='background-color:#d1e7b7'>";
                    }
                    else {
                        tbody += "<tr>";
                    }

                    tbody += "<td>" + val.empName + "</td>";
                    tbody += "<td>" + val.MobileNo + "</td>";
                    tbody += "<td>" + val.Designation + "</td>";
                    tbody += "<td>" + val.Email + "</td>";
                    tbody += "<td>" + val.state_name + "</td>";
                    tbody += "<td>" + val.cityname + "</td>";
                    tbody += "<td>" + val.uStatus + "</td>";
                    tbody += "<td>" + val.HeadUserby + "</td>";
                    tbody += "<td>" + val.HeadRemark + "</td>";
                    if (val.uStatus == "Interested") {
                        tbody += "<td style='width: 10%;text-align:center'>-</td>";
                    } else {
                        tbody += "<td style='width: 10%;text-align:center'><button  class='btn btn-success' id='viewApprove' onclick='selectRow(this);GetApprove(this)' data-autoid='" + val.autoid + "' style='margin-left:10px;'>Proccess</button></td>";
                    }

                    tbody += "</tr>";


                });
                $('#tblReport tbody').append(tbody);
            }
        },
        error: function (response) {
            alert('Server Error...!');
        }
    });
}
function GetApprove(elem) {
    editautoid = $(elem).data('autoid');
    $("#ModelApprove").modal('show');
}
function Submitdata() {
    if ($("#ddlStatustype option:selected").val() == "0") {
        alert("Please select status");
        return
    }
    if ($("#txtRemark").val() == "") {
        alert("Please Enter Remark");
        return
    }
    var url = config.baseUrl + "/api/GeneralStore/InsertBusinessHeadLink";
    var objBO = {};
    objBO.Autoid = editautoid;
    objBO.Status = $("#ddlStatustype option:selected").val();
    objBO.remark = $("#txtRemark").val();
    objBO.loginId = Active.userId;
    objBO.Logic = 'SaveBusinessHead';
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            if (data.includes('Success')) {
                alert("Successfully Saved");
                $("#ddlStatustype").prop("selectedIndex", 0);
                $("#txtRemark").val('');
            }
            else {
                alert(data);
            }
        },
        error: function (response) {
            alert('Server Error...!');
        }
    });
}
function DownloadExcel(elem) {
    var url = config.baseUrl + "/api/Service/Diag_BusinessEnquiryQueries";
    var objBO = {};
    objBO.SearcKey = '';
    objBO.prm_1 = $('#ddlStatus option:selected').val();
    objBO.UnitId = Active.unitId;
    objBO.from = $("#txtfrom").val();
    objBO.to = $("#txtto").val();
    objBO.login_id = Active.userId;
    objBO.Logic = logicname;
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