$(document).ready(function () {  
    FillCurrentDate("txtSearchFrom");
    FillCurrentDate("txtSearchTo");
    $('#txtSearch').on('keyup', function () {
        var val = $(this).val().toLocaleLowerCase();
        $('#tblReport tbody tr').filter(function () {
            $(this).toggle($(this).text().toLocaleLowerCase().indexOf(val) > -1);
        });
    }); 
});
function Geteport(logic) {  
    $('#tblReport tbody').empty();
    var url = config.baseUrl + "/api/Service/Diag_ServiceQueries";
    var objBO = {};
    objBO.SearcKey = $("#ddlSearchKey option:selected").val();
    objBO.SearchValue = $('#txtSearchValue').val();
    objBO.prm_1 = '-';
    objBO.from = $('#txtSearchFrom').val();
    objBO.to = $('#txtSearchTo').val();
    objBO.login_id = Active.userId;
    objBO.UnitId = Active.unitId;
    objBO.Logic = logic;
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
                    tbody += "<td>" + val.testName + "</td>";               
                    tbody += "<td><button  class='btn btn-success'  onclick= selectRow(this);DownloadReport('" + val.VisitNo + "')>Download</button></td>";                                  
                   tbody += "</tr>";                
                });
                $('#tblReport tbody').append(tbody);                       
            }
            else {
                $('#tblReport tbody').empty();            
                alert("Data Not Found..");
            };
        },
        error: function (response) {
            alert('Server Error...!');
            $(elem).removeClass('i').find('.fa-spinner').remove();
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
    objBO.Logic = 'ReportForDoctor:Date';
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