var logicvalue = "";
$(document).ready(function () {
    CloseSidebar();
    $('select').select2();
    FillCurrentDate("txtSearchFrom");
    FillCurrentDate("txtSearchTo");
    $('#btnSearchByOption').click(function () {
        SearchByKey();
    });
    $('#btnSearchByDate').click(function () {
        SearchByDate();
    });
});

function CloseSidebar() {
    $('html').attr('data-toggled', 'icon-overlay-close');
}
function SearchByKey() {
    $('#tblServiceRegister tbody').empty();
    logicvalue = "SearchByKey";
    var url = config.baseUrl + "/api/Service/Diag_ServiceQueries";
    var objBO = {};
    objBO.SearcKey = '';
    objBO.SearchValue = $('#txtSearchValue').val();
    objBO.from = $('#txtSearchFrom').val();
    objBO.to = $('#txtSearchTo').val();
    objBO.prm_1 = '-';
    objBO.Logic = 'SearchByKey';
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        contentType: "application/json;charset=utf-8",
        dataType: "JSON",
        async: false,
        success: function (data) {
            if (data.ResultSet.Table.length > 0) {
                var tbody = "";
                $.each(data.ResultSet.Table, function (key, val) {
                    tbody += "<tr>";
                    tbody += "<td>" + val.UHID + "</td>";
                    tbody += "<td>" + val.patient_name + "</td>";
                    tbody += "<td>" + val.DoctorName + "</td>";
                    tbody += "<td>" + val.Age + "</td>";
                    tbody += "<td>" + val.mobile_no + "</td>";
                    tbody += "<td>" + val.visitNo + "</td>";
                    tbody += "<td>" + val.VisitDate + "</td>";
                    tbody += "<td class='text-right'>" + val.GrossAmount + "</td>";
                    tbody += "<td class='text-right'>" + val.PanelDiscount + "</td>";
                    tbody += "<td class='text-right'>" + val.AdlDiscount + "</td>";
                    tbody += "<td class='text-right'>" + val.NetAmount + "</td>";
                    tbody += "<td class='text-right'>" + val.RegFee + "</td>";
                    tbody += "<td class='text-right'>" + val.card_no + "</td>";
                    tbody += "<td class='flex'>";
                    tbody += "<button class='btn btn-info btn-flat' onclick=Receipt('" + val.visitNo + "')>Print</button>";
                    tbody += "</td>";
                    tbody += "</tr>";
                });
                $('#tblServiceRegister tbody').append(tbody);
            }
            else {
                $('#tblServiceRegister tbody').empty();
                alert("Data Not Found..");
            };
        },
        error: function (response) {
            alert('Server Error...!');
        }
    });
}
function SearchByDate() {
    $('#tblServiceRegister tbody').empty();
    logicvalue = "SearchByDate";
    var url = config.baseUrl + "/api/Service/Diag_ServiceQueries";
    var objBO = {};
    objBO.SearcKey = '';
    objBO.SearchValue = '-';
    objBO.from = $('#txtSearchFrom').val();
    objBO.to = $('#txtSearchTo').val();
    objBO.prm_1 = '-';
    objBO.Logic = 'SearchByDate';
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        contentType: "application/json;charset=utf-8",
        dataType: "JSON",
        async: false,
        success: function (data) {
            console.log(data);
            if (data.ResultSet.Table.length > 0) {
                var tbody = "";
                $.each(data.ResultSet.Table, function (key, val) {
                    tbody += "<tr>";
                    tbody += "<td>" + val.UHID + "</td>";
                    tbody += "<td>" + val.patient_name + "</td>";
                    tbody += "<td>" + val.DoctorName + "</td>";
                    tbody += "<td>" + val.Age + "</td>";
                    tbody += "<td>" + val.mobile_no + "</td>";
                    tbody += "<td>" + val.visitNo + "</td>";
                    tbody += "<td>" + val.VisitDate + "</td>";
                    tbody += "<td class='text-right'>" + val.GrossAmount + "</td>";
                    tbody += "<td class='text-right'>" + val.PanelDiscount + "</td>";
                    tbody += "<td class='text-right'>" + val.AdlDiscount + "</td>";
                    tbody += "<td class='text-right'>" + val.NetAmount + "</td>";
                    tbody += "<td class='text-right'>" + val.RegFee + "</td>";
                    tbody += "<td>" + val.card_no + "</td>";
                    tbody += "<td class='flex'>";
                    tbody += "<button class='btn btn-info btn-flat' onclick=Receipt('" + val.visitNo + "')>Print</button>";
                    tbody += "</td>";
                    tbody += "</tr>";
                });
                $('#tblServiceRegister tbody').append(tbody);
            }
            else {
                $('#tblOPDRegister tbody').empty();
                alert("Data Not Found..");
            };
        },
        complete: function (data) {
            $.each(data.responseJSON.ResultSet.Table, function (key, val) {
                if (val.IsReschedule == '1')
                    $('#tblServiceRegister tbody').find('tr:eq(' + key + ')').find('td:eq(0),td:eq(1),td:eq(2),td:eq(3),td:eq(4),td:eq(5),td:eq(6),td:eq(7),td:eq(8),td:eq(9),td:eq(10),td:eq(11)').addClass('row-green');
            });
        },
        error: function (response) {
            alert('Server Error...!');
        }
    });
}
function Receipt(tnxid) {
    var url = "../Print/ServiceReceipt?visitNo=" + tnxid + "&ActiveUser=" + Active.userName;
    window.open(url, '_blank');
}
function ExcelDownloadData() {
    var url = config.baseUrl + "/api/Service/Diag_ServiceQueries";
    var objBO = {};
    objBO.SearcKey = '';
    objBO.SearchValue = $('#txtSearchValue').val();
    objBO.from = $('#txtSearchFrom').val();
    objBO.to = $('#txtSearchTo').val();
    objBO.prm_1 = '-';
    objBO.Logic = logicvalue;
    objBO.OutPutType = 'Excel';
    Global_DownloadExcel(url, objBO, "ServiceRegisterReport.xlsx");
}