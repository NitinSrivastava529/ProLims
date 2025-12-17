$(document).ready(function () {
    $("#txtSearch").on("keyup", function () {
        var value = $(this).val().toLowerCase();
        $("#tblReport tbody tr").filter(function () {
            $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
        });
    });
    $("#chkallshift").change(function () {
        if (this.checked) {
            $(".shiftchk").each(function () {
                this.checked = true;
            })
        } else {
            $(".shiftchk").each(function () {
                this.checked = false;
            })
        }
    });
    Onload('');
   
});

function Onload(elem) {
    $("#tblReport tbody").empty();
    $(elem).append("<i class='fa fa-spinner fa-spin' style='font-size:20px;float:left'></i>");
    var url = config.baseUrl + "/api/GeneralStore/Diag_ProfessionalFeesDoctorQueries";
    var objBO = {};
    objBO.Prm1 = $("#ddlReportType option:selected").val();
    objBO.Logic = 'GetUnitWiseProfessional';
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            console.log(data);
            var tbody = ""; var temp = "";var temp1 = "";
            if (Object.keys(data.ResultSet).length) {
                if (Object.keys(data.ResultSet.Table).length) {
                    $.each(data.ResultSet.Table, function (key, val) {
                        if (temp != val.unit_name) {
                            tbody += "<tr style='background:#d9d7d7;'>";
                            tbody += "<td colspan='20'><b> Unit Id : " + val.UnitId + "</b>,<b> Unit Name : " + val.unit_name + "</b></td>";
                            tbody += "</tr>";
                            temp = val.unit_name
                        }
                        if (temp1 != val.DoctorName) {
                            tbody += "<tr style='background:#d5e7f5;'>";
                            tbody += "<td colspan='20'><b> Doctor Id : " + val.DoctorId + "</b>,<b> Doctor Name : " + val.DoctorName + "</b></td>";
                            tbody += "</tr>";
                            temp1 = val.DoctorName
                        }
                        //tbody += "<tr>";
                        if (val.IsAproved == 'Y') {
                            tbody += "<tr style='background:#dbf3c1;'>";
                        }
                        else {
                            tbody += "<tr>";
                        }
                        if (val.IsAproved == 'Y') {
                            tbody += '<td style="width:5%;text-align:center;">-</td>';
                        }
                        else {
                            tbody += '<td style="width:5%;text-align:center;"><input id="chkshift" data-autoid="' + val.AutoId + '"type="checkbox" class="shiftchk"> </td>';
                        }
                        tbody += "<td hidden>" + val.ItemId + "</td>";
                        tbody += "<td>" + val.ItemName + "</td>";
                        tbody += "<td style='text-align:center'>" + val.DoctorFee + "</td>";
                        tbody += "<td>" + val.ApprovedBy + "</td>";
                        tbody += "<td>" + val.ApprovedDate + "</td>";
                        tbody += "</tr>";
                    });
                    $("#tblReport tbody").append(tbody);
                    $(elem).removeClass('i').find('.fa-spinner').remove();
                }
                else {
                    alert("Data Not Found..");
                    $(elem).removeClass('i').find('.fa-spinner').remove();
                }

            }
            else {
                alert("Data Not Found..");
                $(elem).removeClass('i').find('.fa-spinner').remove();
            };
        },
        error: function (response) {
            alert('Server Error...!');
            $(elem).removeClass('i').find('.fa-spinner').remove();
        }
    });
}

function Approvedata(elem) {

    var isConfirmed = confirm('Are you sure you want to Approve the data?');
    if (isConfirmed) {
        
        var url = config.baseUrl + "/api/GeneralStore/Diag_InsertProfessionalFeesDoctor";
        var objBO = {};
        var LinkList = [];
        $('#tblReport tbody').find('tr').each(function () {
            var ischecked = $(this).find('input[type="checkbox"]').is(':checked');
            if (ischecked) {
                LinkList.push($(this).find('td:eq(0)').find('input').data('autoid'));
            }
        });
        objBO.Unitid = Active.unitId;
        objBO.CompId = Active.compId;
        objBO.prm1 = LinkList.join('|');
        objBO.Amount = '0';
        objBO.LoginId = Active.userId;
        objBO.Logic = 'ApproveData';
        $(elem).append("<i class='fa fa-spinner fa-spin' style='font-size:20px;float:left'></i>");
        $.ajax({
            method: "POST",
            url: url,
            data: JSON.stringify(objBO),
            dataType: "json",
            contentType: "application/json;charset=utf-8",
            success: function (data) {
                if (data.includes('Success')) {
                    alert(data)
                    $(elem).removeClass('i').find('.fa-spinner').remove();
                    $('input[type="checkbox"]').prop('checked', false);
                    Onload('');
                }
                else {
                    alert(data);
                    $(elem).removeClass('i').find('.fa-spinner').remove();
                }
            },
            error: function (response) {
                alert('Server Error...!');
                $(elem).removeClass('i').find('.fa-spinner').remove();
            }
        });
    } else {
        alert("Cancelled");
    }
}