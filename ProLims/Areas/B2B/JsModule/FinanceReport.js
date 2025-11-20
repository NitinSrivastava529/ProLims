
$(document).ready(function () {
    FillCurrentDate('txtFrom');
    FillCurrentDate('txtTo');
});
function FinanceReport() {
    $('#tblFinanceReport tbody').empty();
    var url = config.baseUrl + "/api/Patient/B2B_PatientQueries";
    var objBO = {};
    objBO.unitId = 'CH01';
    objBO.compId = 'CH01';
    objBO.clientId = $('#ddlGlobalClientId option:selected').val();
    objBO.from = $('#txtFrom').val();
    objBO.to = $('#txtTo').val();
    objBO.Prm1 = '-';
    objBO.Prm2 = '-';
    objBO.Prm3 = '-';
    objBO.loginId = localStorage.getItem('jsEmpCode');
    objBO.Logic = "FinanceReport";
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            if (data.ResultSet.Table.length > 0) {
                var tbody = '';
                var temp = '';
                var total = 0;
                $.each(data.ResultSet.Table, function (key, val) {
                    if (temp != val.clientId) {
                        tbody += "<tr class='group'>";
                        tbody += "<td colspan='3'><b>ClientName : </b>" + val.ClientName + "</td>";                      
                        tbody += "</tr>";
                        temp = val.clientId;
                    }
                    total +=val.Amount;
                    tbody += "<tr>";
                    tbody += "<td>" + val.visitdate + "</td>";
                    tbody += "<td>" + val.PayMode + "</td>";
                    tbody += "<td class='text-right'>" + val.Amount + "</td>";                 
                    tbody += "</tr>";
                });
                tbody += "<tr class='total'>";
                tbody += "<td colspan='2'>Total</td>";
                tbody += "<td class='text-right'>" + total + "</td>";
                tbody += "</tr>";
                $('#tblFinanceReport tbody').append(tbody);
            }
        },
        error: function (response) {
            alert('Server Error...!');
        }
    });
}