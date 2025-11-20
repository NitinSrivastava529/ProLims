
$(document).ready(function () {
    FillCurrentDate('txtFrom');
    FillCurrentDate('txtTo');
    $('#ddlB2BClient').append($('.ddlGlobalUnit').clone().html());
    B2BClient();
});
function B2BClient() {
    $('#ddlB2BClient').empty().append($('<option></option>').val('ALL').html('ALL'));
    var url = config.baseUrl + "/api/Patient/B2B_PatientQueries";
    var objBO = {};
    objBO.unitId = 'CH01';
    objBO.compId = 'CH01';
    objBO.clientId = '-';
    objBO.from = '1900/01/01';
    objBO.to = '1900/01/01';
    objBO.Prm1 = '-';
    objBO.Prm2 = '-';
    objBO.Prm3 = '-';
    objBO.loginId = Active.userId;
    objBO.Logic = "B2BDash:Client";
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            if (Object.keys(data.ResultSet).length > 0) {
                if (Object.keys(data.ResultSet.Table).length > 0) {
                    $.each(data.ResultSet.Table, function (key, val) {
                        $('#ddlB2BClient').append($('<option></option>').val(val.ClientId).html(val.ClientName));
                    });
                }
            }
        },
        complete: function () {
            B2BDashboard()
        },
        error: function (response) {
            alert('Server Error...!');
        }
    });
}
function B2BDashboard() {
    $('#tblClient tbody').empty();
    $('#tblCategoryWise').empty();
    var url = config.baseUrl + "/api/Patient/B2B_PatientQueries";
    var objBO = {};
    objBO.unitId = 'CH01';
    objBO.compId = 'CH01';
    objBO.clientId = $('#ddlB2BClient option:selected').val();
    objBO.from = $('#txtFrom').val();
    objBO.to = $('#txtTo').val();
    objBO.Prm1 = '-';
    objBO.Prm2 = '-';
    objBO.Prm3 = '-';
    objBO.loginId = Active.userId;
    objBO.Logic = "B2BDash:Data";
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            console.log(data)
            if (Object.keys(data.ResultSet).length > 0) {
                if (Object.keys(data.ResultSet.Table).length > 0) {
                    $.each(data.ResultSet.Table, function (key, val) {
                        $('#txtTotalAmount').text(val.NetAmount);
                        $('#txtTotalPatient').text(val.PatientCount);
                        $('#txtTotalTest').text(val.TestCount);
                        $('#txtTotalCash').text(val.cashTotal);
                        $('#txtTotalCredit').text(val.creditTotal);
                    });
                }
            }
            if (data.ResultSet.Table1.length > 0) {
                var tbody = '';
                var temp = '';
                var total = 0;
                $.each(data.ResultSet.Table1, function (key, val) {
                    if (temp != val.CityName) {
                        tbody += "<tr class='group'>";
                        tbody += "<td colspan='6'><b>City Name : </b>" + val.CityName + "</td>";
                        tbody += "</tr>";
                        temp = val.CityName;
                    }
                    total += val.NetAmount;
                    tbody += "<tr>";
                    tbody += "<td>" + val.ClientName + "</td>";
                    tbody += "<td class='text-right'>" + val.PatientCount + "</td>";
                    tbody += "<td class='text-right'>" + val.TestCount + "</td>";
                    tbody += "<td class='text-right'>" + val.cashTotal + "</td>";
                    tbody += "<td class='text-right'>" + val.creditTotal + "</td>";
                    tbody += "<td class='text-right'>" + val.NetAmount + "</td>";
                    tbody += "</tr>";
                });
                //tbody += "<tr class='total'>";
                //tbody += "<td colspan='2'>Total</td>";
                //tbody += "<td class='text-right'>" + total + "</td>";
                //tbody += "</tr>";
                $('#tblClient tbody').append(tbody);
            }
            if (data.ResultSet.Table2.length > 0) {
                let tbody = '';
                $.each(data.ResultSet.Table2, function (key, val) {
                    tbody += "<tr>";
                    tbody += "<th>" + val.SubCatName + "</th>";
                    tbody += "<td class='text-right'>" + val.totalTest + "</td>";
                    tbody += "<td class='text-right'>" + val.totalAmount + "</td>";
                    tbody += "</tr>";
                });
                $('#tblCategoryWise').append(tbody);
            }         
            if (data.ResultSet.Table3.length > 0) {
                var month = [...data.ResultSet.Table3.map((k, v) => k.tnxDate)];
                var net = [...data.ResultSet.Table3.map((k, v) => k.NetAmount)];
                var patient = [...data.ResultSet.Table3.map((k, v) => k.PatientCount)];               
                DrawGraph(month,net, patient)
            }
        },
        error: function (response) {
            alert('Server Error...!');
        }
    });
}
function DrawGraph(month,net, patient) {   
    var ctx2 = document.querySelectorAll(".chart-line");
    new Chart(ctx2[ctx2.length - 1], {
        type: "line",
        data: {
            //labels: [month],
            labels: ["Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec", "Jan", "Feb", "Mar"],
            datasets: [{
                label: "Net Amount",
                tension: 0.4,
                borderWidth: 0,
                pointRadius: 0,
                borderColor: "#00ab55",
                borderWidth: 3,
                backgroundColor: "transparent",
                data: net,
                maxBarThickness: 6
            },
            {
                label: "Patient Count",
                tension: 0.4,
                borderWidth: 0,
                pointRadius: 0,
                borderColor: "#212b36",
                borderWidth: 3,
                backgroundColor: "transparent",
                data: patient,
                maxBarThickness: 6
            },
            ],
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            legend: {
                display: false,
            },
            tooltips: {
                enabled: true,
                mode: "index",
                intersect: false,
            },
            scales: {
                yAxes: [{
                    gridLines: {
                        borderDash: [2],
                        borderDashOffset: [2],
                        color: '#dee2e6',
                        zeroLineColor: '#dee2e6',
                        zeroLineWidth: 1,
                        zeroLineBorderDash: [2],
                        drawBorder: false,
                    },
                    ticks: {
                        suggestedMin: 0,
                        suggestedMax: 50000,
                        beginAtZero: true,
                        padding: 10,
                        fontSize: 11,
                        fontColor: '#adb5bd',
                        lineHeight: 3,
                        fontStyle: 'normal',
                        fontFamily: "Public Sans",
                    },
                },],
                xAxes: [{
                    gridLines: {
                        zeroLineColor: 'rgba(0,0,0,0)',
                        display: false,
                    },
                    ticks: {
                        padding: 10,
                        fontSize: 11,
                        fontColor: '#adb5bd',
                        lineHeight: 3,
                        fontStyle: 'normal',
                        fontFamily: "Public Sans",
                    },
                },],
            },
        },
    });
}