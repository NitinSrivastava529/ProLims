$(document).ready(function () {
    FillCurrentDate('txtDate');
});
function PatientReport(logic) {
    $('#tblDispatchInfo tbody').empty();
    var url = config.baseUrl + "/api/Patient/B2B_PatientQueries";
    var objBO = {};
    objBO.unitId = 'CH01';
    objBO.compId = '-';
    objBO.clientId = $('#ddlGlobalClientId option:selected').val();
    objBO.from = $('#txtDate').val();
    objBO.to = '1900/01/01';
    objBO.Prm1 = $('#txtInput').val();
    objBO.Prm2 = $('#txtInput').val();
    objBO.Prm3 = '-';
    objBO.loginId = localStorage.getItem('jsEmpCode');
    objBO.Logic = (logic == 'PatientReport:Bydate') ? logic : 'PatientReport:' + $('#ddlType option:selected').val();
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            var tbody = "";
            var VisitNo = "";
            $('#Report').empty();
            if (data.ResultSet.Table.length > 0) {
                $.each(data.ResultSet.Table, function (key, val) {
                    if (VisitNo != val.VisitNo) {
                        var disabled = ([...data.ResultSet.Table.filter(i => i.VisitNo == val.VisitNo).map((v, k) => v.status)].every(i => i == 'Pending')) ? '-' : '-';
                        tbody += '<div class="info">';
                        tbody += '<span><b>Name :</b> ' + val.PatientName + '   <b>Visit No :</b> ' + val.VisitNo + '</span>';
                        tbody += '<download><button ' + disabled + ' class="bg-theme btn-xs bn1 text-white pull-left" onclick=DownloadReport("' + val.VisitNo + '")>Download</button>&nbsp;&nbsp;<button style="margin-left:5px;" ' + disabled + ' class="bg-theme btn-xs bn1 pull-left text-white" data-id="' + val.VisitNo + '" onclick=ViewReceipt("' + val.VisitNo + '")>Receipt</button><div style="width:60%" class="flex pull-right"><input id="txtMobileNo" maxlength="10" class="bn" placeholder="Mobile No." type="text" value=' + val.MobileNo + ' style="width:66%"/><button style="width:50%" data-visitno=' + val.VisitNo + ' onclick=SendReportDownloadLink(this) class="bg-theme text-white btn-xs bn1 pull-left">Send Report</button></div></download>';
                        tbody += '<div class="table table-responsive" style="border:1px solid #ccc;padding: 3px;">';
                        tbody += '<table class="table-bordered" id="tblPatientReport" style="width: 100%;">';
                        tbody += '<tbody>';
                        VisitNo = val.VisitNo;
                        $.each(data.ResultSet.Table, function (key, val) {
                            if (VisitNo == val.VisitNo) {
                                tbody += '<tr>';
                                tbody += '<td>' + val.TestName + '</td>';
                                tbody += '<td style="width:10%">' + val.status + '</td>';
                                tbody += '</tr>';
                            }
                        });
                        tbody += '</tbody>';
                        tbody += '</table>';
                        tbody += '</div></div>';
                    }
                });
                $('#Report').append(tbody);
                $('#txtInput').val('');
            }
            else {
                //alert('Data Not Found..');
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
    window.location.href = config.rootUrl + "/B2B/Patient/dpr?VisitNo=" + visitNo;
    //window.location.href = "https://exprohelp.com/Prolims/B2B/Patient/dpr?VisitNo=" + visitNo;    
}
