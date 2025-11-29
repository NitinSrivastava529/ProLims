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
    objBO.Logic = 'ClientListByLogin';
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
    var url = config.baseUrl + "/api/Service/Diag_ServiceQueries";
    var objBO = {};
    objBO.SearcKey = $("#ddlSearchKey option:selected").val()
    objBO.SearchValue = $('#txtSearchValue').val();
    objBO.prm_1 = $("#ddlclient option:selected").val()
    objBO.from = $('#txtSearchFrom').val();
    objBO.to = $('#txtSearchTo').val();
    objBO.login_id = Active.userId;
    objBO.UnitId = Active.unitId;
    objBO.Logic = 'GetPatientRegister:' + $(elem).data('logic');
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        contentType: "application/json;charset=utf-8",
        dataType: "JSON",
        async: false,
        success: function (data) {
            if (data.ResultSet.Table.length > 0) {
                var tbody = ""; var temp = ""; var temp1 = "";
                var TotalAmt = 0; var AdlAmountTotal = 0; var pdiscountTotal = 0; var panelRateTotal = 0; var mrprateTotal = 0;
                $.each(data.ResultSet.Table, function (key, val) {
                    if (temp != val.ClientName) {
                        tbody += "<tr class='pr' style='background:#e2ffe2;'>";
                        tbody += "<td colspan='20' style='font-size:13px;'><b>Client Name : " + val.ClientName + "</b></td>";
                        tbody += "</tr>";
                        temp = val.ClientName
                    }
                    tbody += "<td>" + val.UHID + "</td>";
                    tbody += "<td>" + val.ipopType + "</td>";
                    tbody += "<td>" + val.VisitNo + "</td>";
                    tbody += "<td>" + val.visitdate + "</td>";
                    tbody += "<td>" + val.DoctorName + "</td>";
                    tbody += "<td>" + val.Patient_name + "</td>";
                    tbody += "<td>" + val.Age + "</td>";
                    tbody += "<td>" + val.Gender + "</td>";
                    tbody += "<td style='text-align:center'>" + val.GrossAmount + "</td>";
                    tbody += "<td style='text-align:center'>" + val.Discount + "</td>";
                    tbody += "<td style='text-align:center'>" + val.AdlDoscount + "</td>";
                    tbody += "<td style='text-align:center'>" + val.NetAmount + "</td>";
                    tbody += "<td><button  class='btn btn-success'  onclick= selectRow(this);DownloadReport('" + val.VisitNo + "')>Download</button></td>";
                    tbody += "<td><button  class='btn btn-warning'  onclick=selectRow(this);ViewReceipt('" + val.VisitNo + "')>Receipt</button></td>";
                    tbody += "<td><button class='btn btn-danger' id='viewtime'  onclick=selectRow(this);Gettimeline(this) data-visitid='" + val.VisitNo + "'><i class='fa fa-clock'></i></button></td>";
                    tbody += "</tr>";

                    AdlAmountTotal += parseFloat(val.AdlDoscount) || 0;
                    pdiscountTotal += parseFloat(val.Discount) || 0;
                    mrprateTotal += parseFloat(val.GrossAmount) || 0;
                    TotalAmt += parseFloat(val.NetAmount) || 0;
                });
                $('#tblReport tbody').append(tbody);
                $(elem).removeClass('i').find('.fa-spinner').remove();
                $("#txtMrptotal").text(mrprateTotal.toFixed(0));
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
function Gettimeline(elem) {
    $("#modelTimeline").modal('show');
    var Requetid = $(elem).data('visitid');
    var url = config.baseUrl + "/api/Service/Diag_ServiceQueries";
    var objBO = {};
    objBO.SearcKey = '';
    objBO.SearchValue = '-';
    objBO.prm_1 = Requetid;
    objBO.from = $('#txtSearchFrom').val();
    objBO.to = $('#txtSearchTo').val();
    objBO.login_id = Active.userId;
    objBO.UnitId = Active.unitId;
    objBO.Logic = 'GetPatientRegisterTimeLine';
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            console.log(data);
            $('.vtimeline').html("");
            var tbody = ""; var date = new Date();
            if (Object.keys(data.ResultSet).length > 0) {
                if (Object.keys(data.ResultSet.Table).length) {
                    $.each(data.ResultSet.Table, function (key, val) {
                        if (val.SubmitDate != '') {
                            tbody += "<div class='timeline-wrapper timeline-inverted'>";
                            tbody += "<div class='timeline-badge'><i class='circleload'></i></div>";
                            tbody += "<div class='timeline-panel'>";
                            tbody += "<div class='row'>";
                            tbody += "<div class='col-md-12'>";
                            tbody += "<h6>Patient Visit Information</h6>";
                            tbody += "</div>";
                            tbody += "<div class='col-md-12'>";
                            tbody += "<i class='fa fa-calendar text-muted me-1'></i><span>" + val.VisitDate + "</span>";
                            tbody += "</div>";
                            tbody += "<div class='col-md-12'>";
                            tbody += "<i class='fa fa-eye text-muted me-1'></i><span>" + val.VisitNo + "</span>";
                            tbody += "</div>";
                            tbody += "<div class='col-md-12'>";
                            tbody += "<i class='fa fa-user text-muted me-1'></i><span>" + val.Patient_name + "</span>";
                            tbody += "</div>";
                            tbody += "</div>";
                            tbody += "</div>"; //block1
                            tbody += "</div>";

                            tbody += "<div class='timeline-wrapper timeline-inverted'>";
                            if (val.ApprovedDate != '') {
                                tbody += "<div class='timeline-badge'><i class='circleload' style='background: #46f343; border: 4px solid #dee5de;'></i></div>";
                                tbody += "<div class='timeline-panel' style='background:#a1f9a4;'>";

                            }
                            else {
                                tbody += "<div class='timeline-badge'><i class='circleload' style='background: #ccc;border:4px solid #ccc;'></i></div>";
                                tbody += "<div class='timeline-panel' style='background:#cccccc57'>";
                            }

                            tbody += "<div class='row'>";
                            tbody += "<div class='col-md-12'>";
                            tbody += "<h6>Sample Verified</h6>";
                            tbody += "</div>";
                            tbody += "<div class='col-md-12'>";
                            tbody += "<i class='fa fa-calendar text-muted me-1'></i><span>" + val.sampleDate + "</span>";
                            tbody += "</div>";
                            tbody += "<div class='col-md-12'>";
                            tbody += "<i class='fa fa-user text-muted me-1'></i><span>" + val.sampleUserName + "</span>";
                            tbody += "</div>";
                            tbody += "</div>";
                            tbody += "</div>"; //block2
                            tbody += "</div>";


                            tbody += "<div class='timeline-wrapper timeline-inverted'>";
                            if (val.dispatchdate != '') {
                                tbody += "<div class='timeline-badge'><i class='circleload' style='background: #46f343; border: 4px solid #dee5de;'></i></div>";
                                tbody += "<div class='timeline-panel' style='background:#a1f9a4;'>";

                            } else {
                                tbody += "<div class='timeline-badge'><i class='circleload' style='background: #ccc;border:4px solid #ccc;'></i></div>";
                                tbody += "<div class='timeline-panel' style='background:#cccccc57'>";
                            }
                            tbody += "<div class='row'>";
                            tbody += "<div class='col-md-12'>";
                            tbody += "<h6>Dispatch Verified</h6>";
                            tbody += "</div>";
                            tbody += "<div class='col-md-12'>";
                            tbody += "<i class='fa fa-calendar text-muted me-1'></i><span>" + val.dispatchdate + "</span>";
                            tbody += "</div>";
                            tbody += "<div class='col-md-12'>";
                            tbody += "<i class='fa fa-user text-muted me-1'></i><span>" + val.DispatchUserName + "</span>";
                            tbody += "</div>";
                            tbody += "</div>"; // row
                            tbody += "</div>"; //block3
                            tbody += "</div>";
                            tbody += "</div>";
                        }

                    });

                    $('.vtimeline').html(tbody);
                }

            }
            else {
                alert("Error");
            }
        },

        error: function (response) {
            alert('Server Error...!');
        }
    });
}
function ViewReceipt(visitNo) {
    var url = config.rootUrl + "/Diagnostics/Print/ServiceReceipt?visitNo=" + visitNo + "& ActiveUser=" + localStorage.getItem('jsEmpCode')
    window.open(url, '_blank')
}
function DownloadReport(visitNo) {
    var url = config.rootUrl + "/B2B/Patient/dpr?VisitNo=" + visitNo;
    window.open(url, '_blank')
    //window.location.href = "https://exprohelp.com/Prolims/B2B/Patient/dpr?VisitNo=" + visitNo;    
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
    objBO.Logic = 'GetPatientRegister';
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