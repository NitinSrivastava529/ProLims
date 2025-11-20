var proid = "";
$(document).ready(function () {
    GetProList();
    $('#txtSearch').on('keyup', function () {
        var val = $(this).val().toLocaleLowerCase();
        $('#tblReport tbody tr').filter(function () {
            $(this).toggle($(this).text().toLocaleLowerCase().indexOf(val) > -1);
        });
    });
    $('#tblReportInfo thead').on('keyup', 'input[type=text]', function () {
        var Amount = $(this).val();
        $('#tblReportInfo tbody tr').find('td:eq(1) input').val(Amount);
    });
});

function GetProList() {
    if ($("#ddlfinancial option:selected").val() == "Select") {
        alert("Please Select Financial Year")
        return
    }
    $("#tblReport tbody").empty();
    var url = config.baseUrl + "/api/GeneralStore/MasterQueries";
    var objBO = {};
    objBO.login_id = Active.userId;

    objBO.Logic = 'ProList';
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            var tbody = ""; var temp = "";
            ; if (Object.keys(data.ResultSet).length) {
                if (Object.keys(data.ResultSet.Table).length) {
                    $.each(data.ResultSet.Table, function (key, val) {
                        if (temp != val.BossName) {
                            tbody += "<tr style='background:#d9d9d9;'>";
                            tbody += "<td colspan='12'><b>Boss Code: " + val.BossCode + " ,&nbsp;Boss Name: " + val.BossName + "</b></td>";
                            tbody += "</tr>";
                            temp = val.BossName
                        }
                        tbody += "<tr>";
                        tbody += "<td hidden>" + val.ProId + "</td>";
                        tbody += "<td>" + val.ProCode + "</td>";
                        tbody += "<td>" + val.ProName + "</td>";
                        //tbody += "<td style='text-align:center'><button proid='" + val.ProId + "' type='button' class='btn btn-success btnedit' style='padding: 1px 5px;width: 100px;'  onclick='selectRow(this); GetProListDetails(this)' >Select</button></td>";
                        tbody += "<td><button  class='btn btn-success'  style='padding: 1px 5px;width: 100px;'  onclick='GetProListDetails(this);selectRow(this)' data-proid='" + val.ProId + "' style='margin-left:10px;'>select</button></td>";
                        tbody += "</tr>";
                    });
                    $("#tblReport tbody").append(tbody);

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
function GetProListDetails(elem) {
    proid = $(elem).data('proid');
    GetDetails();
}
function GetDetails() {
    $('#modelmonthList').modal('show');
    if ($("#ddlfinancial option:selected").val() == "Select") {
        alert("Please Select Financial Year")
        return
    }
    $("#tblReportInfo tbody").empty();
    var url = config.baseUrl + "/api/GeneralStore/MasterQueries";
    var objBO = {};
    objBO.login_id = Active.userId;
    objBO.prm_1 = $("#ddlfinancial option:selected").val();
    objBO.vendor_id = proid;
    objBO.Logic = 'YearwiseProList';
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            var tbody = ""; var temp = "";
            if (Object.keys(data.ResultSet).length) {
                if (Object.keys(data.ResultSet.Table).length) {
                    $.each(data.ResultSet.Table, function (key, val) {
                        tbody += "<tr>";
                        tbody += "<td>" + val.month_name + "</td>";
                        tbody += "<td><input type='text' class='form-control txtrate' style='text-align: center;' value='" + val.TargetAmount + "'></td>";
                        tbody += "</tr>";
                        if (val.TargetAmount == null) {
                            $("#btnSave").prop("disabled", false);
                        }
                        else {
                            $("#btnSave").prop("disabled", true);
                        }
                    });
                    $("#tblReportInfo tbody").append(tbody);

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

function InsertRate() {
    debugger
    if (confirm('Are you sure to Insert Amount ')) {
        var url = config.baseUrl + "/api/GeneralStore/GS_InsertProRateLink";
        var objBO = [];
        $('#tblReportInfo tbody tr').each(function () {
            objBO.push({
                'Month_Name': $(this).find('td:eq(0)').text(),
                'FinYear': $("#ddlfinancial option:selected").val(),
                'TargetAmount': $(this).find('td:eq(1) input').val(),
                'ProId': proid,
                'login_id': Active.userId,
                'Logic': 'InsertProAmonut',
            });
        });
        $.ajax({
            method: "POST",
            url: url,
            data: JSON.stringify(objBO),
            dataType: "json",
            contentType: "application/json;charset=utf-8",
            success: function (data) {
                if (data.includes('Success')) {
                    alert(data);
                    // $("#btnSave").prop("disabled", true);
                    GetDetails();
                }
                else {
                    alert(data);
                }
            },
            error: function (response) {
                alert('Server Error...!');
            }
        });
    } else {
        alert("Cancel");
    }
}