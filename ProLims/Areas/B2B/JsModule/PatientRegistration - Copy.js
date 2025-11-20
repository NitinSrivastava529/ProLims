$(document).ready(function () {
    $('input:text').attr('autocomplete', 'off');
    $("#divFormBody").removeClass('Inactive');
    searchTableh('txtSeachTest', 'tblTest');
    $('#tblTest tbody').on('change', 'input[type=checkbox]', function (e) {
        if ($("#ddlGlobalClientId option:selected").val() == 'Select') {
            $('#tblTest input:checkbox').prop('checked', false);
            $('#tblSelectedTest tbody').empty();
            alert('Please Select Client Id')
            return
        }     
        TestAmount()
        $('#tblTest thead input:text').val('').focus().trigger('keyup')
    });
    $('#tblSelectedTest tbody').on('click', 'button', function () {
        var testCode = $(this).closest('tr').find('td:eq(1)').text();
        $(this).closest('tr').remove();
        $('#tblTest tbody tr').each(function () {
            if ($(this).find('td:eq(1)').text() == testCode) {
                $(this).find('input[type=checkbox]').prop('checked', false);
            }
        });
        TestAmount()
    });
    $("#ddlPatient").on('change', function () {
        SelectPatient();
    })
    TestInfo('All');
});

function SelectPatient() {
    $("#divFormBody input").val('')
    $("#divFormBody").removeClass('Inactive');
    if ($("#ddlPatient option:selected").val() == 'New') {

        $("#txtUHID").val($("#ddlPatient option:selected").val());
    }
    else {
        var val = JSON.parse($("#ddlPatient option:selected").val());
        $("#txtHealthCardNo").val(val.card_no);
        $("#txtUHID").val(val.UHID);
        $("#txtPatientName").val(val.patient_name);
        $("#ddlGender").val(val.gender);
        $("#txtAge").val(val.age);
        $("#ddlAgeType").val(val.age_type);
    }
}
function TestInfo(param) {
    $('#tblTest tbody').empty();
    $("#ddlDoctor").empty().append($("<option></option>").val("Select").html("Select")).select2();
    var url = config.baseUrl + "/api/Patient/B2B_PatientQueries";
    var objBO = {};
    objBO.unitId = 'CH01';
    objBO.compId = '-';
    objBO.clientId = $('#ddlGlobalClientId option:selected').val();
    objBO.from = '1900/01/01';
    objBO.to = '1900/01/01';
    objBO.Prm1 = param;
    objBO.Prm2 = '-';
    objBO.Prm3 = '-';
    objBO.loginId = localStorage.getItem('jsEmpCode');
    objBO.Logic = "TestInfo";
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            if (data.ResultSet.Table.length > 0) {
                $.each(data.ResultSet.Table, function (key, value) {
                    $("#ddlDoctor").append($("<option></option>").val(value.DoctorCode).html(value.DoctorName));
                });
            }
            if (data.ResultSet.Table.length > 0) {
                var tbody = "";
                $.each(data.ResultSet.Table1, function (key, val) {
                    tbody += '<tr>';
                    tbody += '<td><input type="checkbox" data-code=' + val.TestId + ' /></td>';
                    tbody += '<td style="display:none">' + val.TestId + '</td>';
                    tbody += '<td>' + val.TestName + '</td>';
                    tbody += '</tr>';
                });
                $('#tblTest tbody').append(tbody);
            }
        },
        error: function (response) {
            alert('Server Error...!');
        }
    });
}
function PatientInfoByMobile() {
    $("#ddlPatient").empty().append($("<option></option>").val("Select").html("Select")).select2();
    $("#ddlPatient").append($("<option></option>").val("New").html("New"));
    var url = config.baseUrl + "/api/Patient/B2B_PatientQueries";
    var objBO = {};
    objBO.unitId = Active.unitId;
    objBO.compId = Active.compId;
    objBO.clientId = $('#ddlGlobalClientId option:selected').val();
    objBO.from = '1900/01/01';
    objBO.to = '1900/01/01';
    objBO.Prm1 = $("#txtMobileNo").val();
    objBO.Prm2 = '-';
    objBO.Prm3 = '-';
    objBO.loginId = localStorage.getItem('jsEmpCode');
    objBO.Logic = "PatientInfoByMobile";
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            if (data.ResultSet.Table.length > 0) {
                $.each(data.ResultSet.Table, function (key, value) {
                    $("#ddlPatient").append($("<option data-info='wer'></option>").val(JSON.stringify(data.ResultSet.Table[key])).html(value.patient_name));
                });
            }
        },
        error: function (response) {
            alert('Server Error...!');
        }
    });
}
function TestAmount() {
    $('#tblSelectedTest tbody').empty();
    var url = config.baseUrl + "/api/Patient/B2B_PatientQueries";
    var objBO = {};
    objBO.unitId = Active.unitId;
    objBO.compId = Active.compId;
    objBO.clientId = $("#ddlGlobalClientId option:selected").val();
    objBO.from = '1900/01/01';
    objBO.to = '1900/01/01';
    objBO.Prm1 = [...$('#tblTest tbody input:checkbox:checked').map((k, v) => $(v).data('code'))].join('|');
    objBO.Prm2 = '-';
    objBO.Prm3 = '-';
    objBO.loginId = Active.userId;
    objBO.Logic = "TestAmount";
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            var tbody = "";
            if (data.ResultSet.Table.length > 0) {
                $.each(data.ResultSet.Table, function (key, val) {
                    tbody += '<tr>';
                    tbody += '<td><button class="btn-danger btn-del"><i class="fa fa-trash"></i></button></td>';
                    tbody += '<td style="display:none">' + val.ItemId + '</td>';
                    tbody += '<td>' + val.ItemName + '</td>';
                    tbody += '<td class="text-right">' + val.mrp_rate + '</td>';
                    tbody += '<td class="hide">' + val.panel_rate + '</td>';
                    tbody += '<td class="hide">' + val.panel_disc + '</td>';
                    tbody += '<td class="hide">0</td>';
                    tbody += '<td class="hide">' + val.Net + '</td>';
                    tbody += '</tr>';
                });
                $('#tblSelectedTest tbody').append(tbody);
            }
        },
        error: function (response) {
            alert('Server Error...!');
        }
    });
}
function PayInit() {
    $('#modelPay').modal('show');
    var total = [...$('#tblSelectedTest tbody tr').map((k, v) => $(v).find('td:eq(3)').text())].reduce((a, b) => eval(a) + eval(b));
    var panel_disc = [...$('#tblSelectedTest tbody tr').map((k, v) => $(v).find('td:eq(5)').text())].reduce((a, b) => eval(a) + eval(b));
    var net = [...$('#tblSelectedTest tbody tr').map((k, v) => $(v).find('td:last').text())].reduce((a, b) => eval(a) + eval(b));
    $('#txtAllTotal').val(total);
    $('#txtPanelDiscount').val(panel_disc);
    $('#txtAllDiscount').val(0);
    $('#txtAllNet').val(net);
    $('#tblPayment tbody tr.pay:first input:first').val(net);
}
function CalculateAmount() {
    $('#tblSelectedTest tbody').empty();
    var url = config.baseUrl + "/api/Patient/B2B_PatientQueries";
    var objBO = {};
    objBO.unitId = Active.unitId;
    objBO.compId = Active.compId;
    objBO.clientId = $("#ddlGlobalClientId option:selected").val();
    objBO.from = '1900/01/01';
    objBO.to = '1900/01/01';
    objBO.Prm1 = [...$('#tblTest tbody input:checkbox:checked').map((k, v) => $(v).data('code'))].join('|');
    objBO.Prm2 = $("#ddlDiscountType option:selected").text();
    objBO.Prm3 = $("#txtApplyDiscount").val();
    objBO.loginId = Active.userId;
    objBO.Logic = "CalItemDiscount";
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            var tbody = "";
            if (data.ResultSet.Table.length > 0) {
                $.each(data.ResultSet.Table, function (key, val) {
                    tbody += '<tr>';
                    tbody += '<td><button class="btn-danger btn-del"><i class="fa fa-trash"></i></button></td>';
                    tbody += '<td style="display:none">' + val.ItemId + '</td>';
                    tbody += '<td>' + val.ItemName + '</td>';
                    tbody += '<td class="text-right">' + val.mrp_rate + '</td>';
                    tbody += '<td class="hide">' + val.panel_rate + '</td>';
                    tbody += '<td class="hide">' + val.panel_disc + '</td>';
                    tbody += '<td class="hide">' + val.addl_disc + '</td>';
                    tbody += '<td class="hide">' + val.Net + '</td>';
                    tbody += '</tr>';
                });
                $('#tblSelectedTest tbody').append(tbody);
            }
        },
        complete: function () {
            var amount = [...$('#tblSelectedTest tbody tr').map((k, v) => $(v).find('td:eq(3)').text())].reduce((a, b) => eval(a) + eval(b));
            var discount = [...$('#tblSelectedTest tbody tr').map((k, v) => $(v).find('td:eq(6)').text())].reduce((a, b) => eval(a) + eval(b));
            var panel_disc = [...$('#tblSelectedTest tbody tr').map((k, v) => $(v).find('td:eq(5)').text())].reduce((a, b) => eval(a) + eval(b));
            var net = [...$('#tblSelectedTest tbody tr').map((k, v) => $(v).find('td:eq(7)').text())].reduce((a, b) => eval(a) + eval(b));
            $('#txtAllTotal').val(Math.round(amount));
            $('#txtPanelDiscount').val(Math.round(panel_disc));
            $('#txtAllDiscount').val(Math.round(discount));
            $('#txtAllNet').val(Math.round(net));
            $('#tblPayment tbody tr.pay:first input:first').val(Math.round(net));
        },
        error: function (response) {
            alert('Server Error...!');
        }
    });
}
function EnablePayMode() {
    var val = [...$('#modelPay .payMode input:checkbox:checked').map((k, v) => $(v).val())];
    var total = $('#txtAllNet').val();
    $('#tblPayment tbody input').val('');
    $('#tblPayment tbody tr').addClass('hidden').removeClass('pay')
    for (var i = 0; i < val.length; i++) {
        $('#tblPayment tbody tr').each(function () {
            if ($(this).hasClass(val[i]))
                $(this).removeClass('hidden').addClass('pay')
        })
    }
    $('#tblPayment tbody tr.pay:first input:first').val(total);
}
function InsertPatient() {
    if (Validation()) {
        if (confirm('Are you sure to Submit?')) {
            var waiting = "<img src='/content/img/waiting.gif' style='width:15px'/>&nbsp;Submitting.."
            $('#btnSubmit').html(waiting).prop('disabled', true);

            var url = config.baseUrl + "/api/Patient/Diag_TestBooking";
            var obj = {};
            var objBO = {};
            var TestBookingItems = [];
            var Receipt = [];
            $('#tblSelectedTest tbody tr').each(function () {
                TestBookingItems.push(
                    {
                        'RateListId': '-',
                        'ItemId': $(this).find('td:eq(1)').text(),
                        'mrp_rate': $(this).find('td:eq(3)').text(),
                        'panel_rate': $(this).find('td:eq(4)').text(),
                        'adl_disc_amount': $(this).find('td:eq(6)').text(),
                        'net_amount': $(this).find('td:eq(7)').text(),
                        'IsUrgent': 'N',
                        'Remark': '-'
                    });
            });
            $('#tblPayment tbody tr.pay').each(function () {
                Receipt.push(
                    {
                        'ReceiptNo': '-',
                        'PayMode': $(this).find('td:eq(0)').text(),
                        'CardNo': '-',
                        'BankName': '-',
                        'RefNo': $(this).find('td:eq(2)').text(),
                        'MachineId': $(this).find('td:eq(3) select option:selected').val(),
                        'MachineName': $(this).find('td:eq(3) select option:selected').text(),
                        'Amount': $(this).find('td:eq(1) input').val(),
                        'OnlPaymentId': '-',
                        'OnlPayStatus': '-',
                        'OnlPayResponse': '-',
                        'OnlPaymentDate': '1900/01/01',
                        'login_id': '-'
                    });
            });
            objBO.CompId = 'CH01';
            objBO.UnitId = 'CH01';
            objBO.ClientId = $('#ddlGlobalClientId option:selected').val();
            objBO.ipopType = $('#ddlPatientType option:selected').text();
            objBO.Title = 'Mr.';
            objBO.UHID = $('#txtUHID').val();
            objBO.patient_name = $('#txtPatientName').val();
            objBO.email = '-';
            objBO.age = $('#txtAge').val();
            objBO.ageType = $('#ddlAgeType option:selected').text();
            objBO.gender = $('#ddlGender option:selected').text();
            objBO.dob = '2025/01/01';
            objBO.StateName = '';
            objBO.district = '';
            objBO.locality = '';
            objBO.address = '';
            objBO.CardNo = '';
            objBO.mobile_no = $('#txtMobileNo').val();
            objBO.RefCode = $('#ddlDoctor option:selected').val();
            objBO.Ref_name = '-';
            objBO.login_id = localStorage.getItem('jsEmpCode');
            objBO.GenFrom = '-';
            objBO.HealthCardNo = $('#txtHealthCardNo').val();
            objBO.PatientRemark = '-';
            objBO.Logic = "Insert";

            obj.diagTestBooking = objBO;
            obj.TestBookingItems = TestBookingItems;
            obj.Receipt = Receipt;
            $.ajax({
                method: "POST",
                url: url,
                data: JSON.stringify(obj),
                dataType: "json",
                contentType: "application/json;charset=utf-8",
                success: function (data) {
                    if (data.includes('Success')) {
                        $('#btnSubmit').html('Submit');
                        alert('Successfully Registered.');
                        $('input').val('');
                        $('seelct').prop('selectedIndex', '0').change();
                        $('#tblTest tbody').find('input[type=checkbox]').prop('checked', false);
                        $('#tblSelectedTest tbody').empty();
                        $('#modelPay').modal('hide');
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
    }
}
function Validation() {
    var HealthCardNo = $('#txtHealthCardNo').val();
    var mobile = $('#txtMobileNo').val();
    var name = $('#txtPatientName').val();
    var gender = $('#ddlGender option:selected').text();
    var age = $('#txtAge').val();
    var doctor = $('#ddlDoctor option:selected').text();
    var test = $('#tblSelectedTest tbody tr').length;
    if (HealthCardNo == '') {
        alert('Please Provide Health Card No.');
        $('#txtHealthCardNo').css('border-color', 'red').focus();
        return false;
    }
    else {
        $('#txtHealthCardNo').removeAttr('style');
    }
    if (mobile == '') {
        alert('Provide Mobile No.');
        $('#txtMobileNo').css('border-color', 'red').focus();
        return false;
    } else if ((mobile).length < 10) {
        alert('Mobile No should be 10 Digit.');
        $('#txtMobileNo').css('border-color', 'red').focus();
        return false;
    }
    else {
        $('#txtMobileNo').removeAttr('style');
    }
    if (name == '') {
        alert('Please Provide Patient Name.');
        $('#txtPatientName').css('border-color', 'red').focus();
        return false;
    }
    else {
        $('#txtPatientName').removeAttr('style');
    }
    if (gender == 'Select') {
        alert('Please Select Gender.');
        $('#ddlGender').css('border-color', 'red').focus();
        return false;
    }
    else {
        $('#ddlGender').removeAttr('style');
    }
    if (age == '') {
        alert('Please Provide Patient Age.');
        $('#txtAge').css('border-color', 'red').focus();
        return false;
    }
    else {
        $('#txtAge').removeAttr('style');
    }
    if (doctor == 'Select') {
        alert('Please Select Prescribed By.');
        $('span.selection').find('span[aria-labelledby=select2-ddlDoctor-container]').css({ 'border-color': 'red' }).focus();
        return false;
    }
    else {
        $('span.selection').find('span[aria-labelledby=select2-ddlDoctor-container]').removeAttr('style');

    }
    if (test < 1) {
        alert('Please Select Test.');
        return false;
    }
    return true;
}
//New Health Card Member
function NewMember() {
    GetState()
    $('#modelCard').modal('show');
}
function IsMember() {
    var url = config.baseUrl + "/api/Patient/B2B_PatientQueries";
    var objBO = {};
    objBO.unitId = 'CH01';
    objBO.compId = '-';
    objBO.clientId = '-';
    objBO.from = '1900/01/01';
    objBO.to = '1900/01/01';
    objBO.Prm1 = $('#txtCardMobileNo').val();
    objBO.Prm2 = '-';
    objBO.Prm3 = '-';
    objBO.loginId = localStorage.getItem('jsEmpCode');
    objBO.Logic = "GetCardInfo";
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        contentType: "application/json;charset=utf-8",
        dataType: "JSON",
        success: function (data) {
            $.each(data.ResultSet.Table, function (key, val) {
                $("#txtCardHealthCardNo").val(val.card_no);
                $("#txtHealthCardNo").val(val.card_no);
                $("#txtCardHolder").val(val.cust_name);
                $("#txtCardType").val(val.cardtype);
                $("#ddlCardGender").val(val.gender);
                $("#txtCardDOB").val(val.d_o_b);
                $("#txtCardEmailId").val(val.email);
                $("#txtCardArea").val(val.area);
                $("#txtCardLocality").val(val.locality);
                $("#txtCardPin").val(val.pin);
                $("#ddlCardState").val(val.state);
                $("#ddlCardCity").val(val.district);
                if (val.cardtype == 'Privilege') {
                    $(".info").addClass('Inactive');
                }
                else {
                    $(".info").removeClass('Inactive');
                }
            });
        },
        error: function (response) {
            alert('Server Error...!');
        }
    });
}
function GetState() {
    var url = config.baseUrl + "/api/Patient/B2B_PatientQueries";
    var objBO = {};
    objBO.unitId = 'CH01';
    objBO.compId = '-';
    objBO.clientId = '-';
    objBO.from = '1900/01/01';
    objBO.to = '1900/01/01';
    objBO.Prm1 = '-';
    objBO.Prm2 = '-';
    objBO.Prm3 = '-';
    objBO.loginId = localStorage.getItem('jsEmpCode');
    objBO.Logic = "GetState";
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        contentType: "application/json;charset=utf-8",
        dataType: "JSON",
        success: function (data) {
            $('#ddlCardState').empty().append($('<option></option>').val(0).html('Select State'));
            $('#ddlCardState').empty().append($('<option></option>').val(0).html('Select District'));
            $.each(data.ResultSet.Table, function (key, val) {
                $('#ddlCardState').append($('<option></option>').val(val.state_code).html(val.statename)).select2();
            });
        },
        complete: function (response) {
            $('#ddlCardState option[value="32"]').prop('selected', true).change();
        },
        error: function (response) {
            alert('Server Error...!');
        }
    });
}
function GetDistrict() {
    var url = config.baseUrl + "/api/Patient/B2B_PatientQueries";
    var objBO = {};
    objBO.unitId = 'CH01';
    objBO.compId = '-';
    objBO.clientId = '-';
    objBO.from = '1900/01/01';
    objBO.to = '1900/01/01';
    objBO.Prm1 = $('#ddlCardState option:selected').val();
    objBO.Prm2 = '-';
    objBO.Prm3 = '-';
    objBO.loginId = localStorage.getItem('jsEmpCode');
    objBO.Logic = "GetDistrictByState";
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        contentType: "application/json;charset=utf-8",
        dataType: "JSON",
        success: function (data) {
            $('#ddlCardCity').empty().append($('<option></option>').val(0).html('Select District'));
            $.each(data.ResultSet.Table, function (key, val) {
                $('#ddlCardCity').append($('<option></option>').val(val.dist_code).html(val.distt_name)).select2();
            });
        },
        complete: function (response) {
            $('#ddlCardCity option[value="45"]').prop('selected', true).change();
        },
        error: function (response) {
            alert('Server Error...!');
        }
    });
}
function CreateChandanCareCard() {
    if (Validate1()) {
        var url = "https://exprohelp.com/ExproMateApi/api/HealthCard/CreateChandanCareCard";
        var obj = {};
        obj.UnitId = 'CH01';
        obj.card_no = $('#txtCardHealthCardNo').val();
        obj.cust_name = $('#txtCardHolder').val();
        obj.gender = $('#ddlCardGender option:selected').text();
        obj.dob = $('#txtCardDOB').val();
        obj.mobileno = $('#txtCardMobileNo').val();
        obj.area = $('#txtCardArea').val();
        obj.Locality = $('#txtCardLocality').val();
        obj.district = $('#ddlCardCity option:selected').text();
        obj.state = $('#ddlCardState option:selected').text();
        obj.email = $('#txtCardEmailId').val();
        obj.pin = $('#txtCardPin').val();
        obj.login_id = localStorage.getItem('jsEmpCode');
        obj.logic = "Insert";
        $.ajax({
            method: "POST",
            url: url,
            data: JSON.stringify(obj),
            contentType: "application/json;charset=utf-8",
            dataType: "JSON",
            success: function (data) {
                if (data.includes('Success')) {
                    alert(data);
                    $("#txtHealthCardNo").val(obj.card_no);
                    $('.info').addClass('Inactive')
                    $('.info input').val('')
                    $('.info select').prop('selectedIndex', 0)
                    $('#modelCard').modal('hide');
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
}
function ClearMember() {
    $('.info').removeClass('Inactive')
    $('.info input').val('')
    $('.info select').prop('selectedIndex', 0)
}
function Validate1() {
    var mobile = $('#txtCardMobileNo').val();
    var name = $('#txtCardHolder').val();
    var gender = $('#ddlCardGender option:selected').text();

    if (mobile == '') {
        alert('Please Provide Mobile..');
        $('#txtCardMobileNo').css('border-color', 'red').focus();
        return false;
    }
    else if (mobile.length != 10) {
        alert('Mobile should be 10 digit..');
        $('#txtCardMobileNo').css('border-color', 'red').focus();
        return false;
    }
    else {
        $('#txtCardMobileNo').removeAttr('style');
    }
    if (name == '') {
        alert('Please Provide Name..');
        $('#txtCardHolder').css('border-color', 'red').focus();
        return false;
    }
    else {
        $('#txtCardHolder').removeAttr('style');
    }
    if (gender == 'Select Gender') {
        alert('Please Select Gender..');
        $('#ddlCardGender').css('border-color', 'red').focus();
        return false;
    }
    else {
        $('#ddlCardGender').removeAttr('style');
    }
    return true;
}