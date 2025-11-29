$(document).ready(function () {
    $('#ddlEmployee').empty().append($('<option></option>').val(0).html('Select Employee'));
    GetState()
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
    $('#tblCityLink tbody').on('click', '#btndelete', function () {
        var Autoid = $(this).closest('tr').find('td:eq(0)').text();
        UpdateStatus(Autoid);
    });
    $('#myInput1').on('keyup', function () {
        var val = $(this).val().toLowerCase();
        $('#tblCity tbody tr').filter(function () {
            $(this).toggle($(this).text().toLowerCase().indexOf(val) > -1);
        });
    });
})

function GetState() {
    var url = config.baseUrl + "/api/Service/Diag_BusinessEnquiryQueries";
    var objBO = {};
    objBO.prm_1 = '14';
    objBO.Logic = 'GetStateByCountry';
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        contentType: "application/json;charset=utf-8",
        dataType: "JSON",
        success: function (data) {
            $('#ddlState').empty().append($('<option></option>').val(0).html('Select State'));
            $.each(data.ResultSet.Table, function (key, val) {
                $('#ddlState').append($('<option></option>').val(val.state_code).html(val.state_name)).select2();
            });
        },
        error: function (response) {
            alert('Server Error...!');
        }
    });
}
function GetDistrict() {
    $('#tblCity tbody').empty();
    var url = config.baseUrl + "/api/Service/Diag_BusinessEnquiryQueries";
    var objBO = {};
    objBO.prm_1 = $('#ddlState option:selected').val();
    objBO.Logic = 'GetCityByState';
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        contentType: "application/json;charset=utf-8",
        dataType: "JSON",
        success: function (data) {
            if (data.ResultSet.Table.length > 0) {
                var tbody = "";
                $.each(data.ResultSet.Table, function (key, val) {
                    tbody += "<tr>";
                    tbody += '<td style="width:5%;text-align:center;"><input id="chkshift" data-distcode="' + val.dist_code + '"type="checkbox" class="shiftchk"> </td>';
                    tbody += "<td>" + val.distt_name + "</td>";
                    tbody += "</tr>";
                });
                $('#tblCity tbody').append(tbody);
            }
        },
        error: function (response) {
            alert('Server Error...!');
        }
    });
}
function SearchEmployee() {
    var url = config.baseUrl + "/api/Service/Diag_BusinessEnquiryQueries";
    var objBO = {};
    objBO.prm_1 = $("#txtSearchEmp").val();
    objBO.Logic = 'SearchEmployee';
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        contentType: "application/json;charset=utf-8",
        dataType: "JSON",
        success: function (data) {
            $('#ddlEmployee').empty().append($('<option></option>').val(0).html('Select Employee'));
            $.each(data.ResultSet.Table, function (key, val) {
                $('#ddlEmployee').append($('<option></option>').val(val.user_code).html(val.user_name));
            });
        },
        error: function (response) {
            alert('Server Error...!');
        }
    });
}
function LinkCityEmployeeWise() {
    var isConfirmed = confirm('Are you sure you want to City Rights the data?');
    if (isConfirmed) {
        var Empname = $('#ddlEmployee option:selected').val();
        if (Empname == 'Select') {
            $('#ddlEmployees').focus();
            alert('Please select Employee Name ..');
            return;
        }
        var url = config.baseUrl + "/api/GeneralStore/InsertBusinessHeadLink";
        var objBO = {};
        var LinkList = [];
        $('#tblCity tbody').find('tr').each(function () {
            var ischecked = $(this).find('input[type="checkbox"]').is(':checked');
            if (ischecked) {
                LinkList.push($(this).find('td:eq(0)').find('input').data('distcode'));
            }
        });
        objBO.Autoid = '0';
        objBO.EmpCode = $('#ddlEmployee option:selected').val();
        objBO.StateId = $('#ddlState option:selected').val();
        objBO.CityId = LinkList.join('|');
        objBO.Logic = 'Insert';
        objBO.loginId = Active.userId;
        $.ajax({
            method: "POST",
            url: url,
            data: JSON.stringify(objBO),
            dataType: "json",
            contentType: "application/json;charset=utf-8",
            success: function (data) {
                if (data.includes('Success')) {
                    alert("Successfully Saved");
                    $('input[type="checkbox"]').prop('checked', false);
                    GetEmployeeWiseInfo();
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
        alert("Cancelled");
    }
}
function GetEmployeeWiseInfo() {
    $('#tblCityLink tbody').empty();
    var url = config.baseUrl + "/api/Service/Diag_BusinessEnquiryQueries";
    var objBO = {};
    objBO.SearcKey = '';
    objBO.prm_1 = $('#ddlEmployee option:selected').val();
    objBO.UnitId = Active.unitId;
    objBO.from = '1999-01-01';
    objBO.to = '1999-01-01';
    objBO.login_id = Active.userId;
    objBO.Logic = 'BusinessHeadLinkList';
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
                    if (temp != val.state_name) {
                        tbody += "<tr style='background:#dddddd'>";
                        tbody += "<td colspan='9'>State Name : " + val.state_name + "</td>";
                        tbody += "</tr>";
                        temp = val.state_name;
                    }
                    tbody += "<tr>";
                    tbody += "<td hidden>" + val.AutoId + "</td>";
                    tbody += "<td hidden>" + val.StateId + "</td>";
                    tbody += "<td hidden>" + val.CityId + "</td>";
                    tbody += "<td>" + val.emp_name + "</td>";
                    tbody += "<td>" + val.cityName + "</td>";
                    tbody += "<td style='text-align:center'>" +
                        '<button type="button" id="btndelete" class="btn-danger"> <i class="fa fa-close"></i></button> ' +
                        "</td>";
                    tbody += "</tr>";
                });
                $('#tblCityLink tbody').append(tbody);
            }
        },
        error: function (response) {
            alert('Server Error...!');
        }
    });
}
function UpdateStatus(autoid) {
    var url = config.baseUrl + "/api/GeneralStore/InsertBusinessHeadLink";
    var objBO = {};
    objBO.Autoid = autoid;
    objBO.Logic = 'Delete';
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            if (data.includes('Success')) {
                GetEmployeeWiseInfo();
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