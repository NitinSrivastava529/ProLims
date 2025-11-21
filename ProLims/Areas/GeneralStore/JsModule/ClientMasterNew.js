var ClientID = "";
$(document).ready(function () {
    $("#btnPayMode").prop("disabled", true)
    Onload();
    GetStateByCountry();
    GetRateList();
    GetUnitList();
    $("#txtSearch").on("keyup", function () {
        var value = $(this).val().toLowerCase();
        $("#tblReport tbody tr").filter(function () {
            $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
        });
    });
    $('#ddlState').on('change', function () {
        var stateid = $(this).find('option:selected').val();
        GetCityByState(stateid);
    });
    onloadpaymade();
});

function GetUnitList() {
    var url = config.baseUrl + "/api/GeneralStore/Diag_ClientQueries";
    var objBO = {};
    objBO.Logic = 'GetUnitList';
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        dataType: "json",
        async: false,
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            if (Object.keys(data.ResultSet).length) {
                if (Object.keys(data.ResultSet.Table).length) {
                    $('#ddlUnit').empty().append($('<option></option>').val('ALL').html('Select')).select2();
                    $.each(data.ResultSet.Table, function (key, val) {
                        $("#ddlUnit").append($("<option></option>").val(val.Unit_Code).html(val.unit_name));
                    });
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
function Onload() {
    $("#tblReport tbody").empty();
    var url = config.baseUrl + "/api/GeneralStore/Diag_ClientQueries";
    var objBO = {};
    objBO.login_id = Active.userId;
    objBO.Logic = 'ClientList';
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
                        if (temp != val.ClientGroupName) {
                            tbody += "<tr style='background:#CCC;'>";
                            tbody += "<td colspan='20' style='font-size:13px;'><b> Group Name : " + val.ClientGroupName + "</b></td>";
                            tbody += "</tr>";
                            temp = val.ClientGroupName
                        }
                        tbody += "<tr>";
                        tbody += "<td style='text-align:center'><button  class='btn btn-danger'  onclick='DeleteClient(this);selectRow(this)' data-clientid='" + val.ClientId + "'><i class='fa fa-trash'></i></button></td>";
                        tbody += "<td>" + val.ClientName + "</td>";
                        tbody += "<td>" + val.ClientType + "</td>";
                        tbody += "<td style='text-align:center'><button  class='btn btn-success'  onclick='SingleClientDetails(this);selectRow(this)' data-clientid='" + val.ClientId + "'><i class='fa fa-edit'></i></button></td>";
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
function GetStateByCountry() {
    var url = config.baseUrl + "/api/GeneralStore/Diag_ClientQueries";
    var objBO = {};
    objBO.country_id = '14';
    objBO.Logic = 'GetStateByCountry';
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            if (data != '') {
                $('#ddlState').empty().append($('<option value="prompt">Select State</option>')).change();
                $.each(data.ResultSet.Table, function (key, val) {
                    $('#ddlState').append($('<option data-text="' + val.state_name + '" data-countryid=' + val.country_id + '></option>').val(val.state_code).html(val.state_name)).select2();
                });
            }
            else {
                alert("Error");
            };
        },
        complete: function (data) {
            $('#ddlState').val(32).change();
        },
        error: function (response) {
            alert('Server Error...!');
        }
    });
}
function GetCityByState(sId) {
    var url = config.baseUrl + "/api/GeneralStore/Diag_ClientQueries";
    var objBO = {};
    objBO.state_id = $('#ddlState option:selected').val();
    objBO.Logic = 'GetCityByState';
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            if (data != '') {
                $('#ddlCity').empty().append($('<option value="0">Select City</option>')).change();
                $.each(data.ResultSet.Table, function (key, val) {
                    $('#ddlCity').append($('<option data-text="' + val.distt_name + '" data-stateid=' + val.state_code + '></option>').val(val.dist_code).html(val.distt_name)).select2();
                });
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
function SingleClientDetails(element) {
    $("#tblPaymentInfo tbody").empty();
    ClientID = $(element).data('clientid');
    var url = config.baseUrl + "/api/GeneralStore/Diag_ClientQueries";
    var objBO = {};
    objBO.login_id = Active.userId;
    objBO.prm_1 = ClientID;
    objBO.Logic = 'SingleClientList';
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            console.log(data);
            var tbody = "";
            if (Object.keys(data.ResultSet).length > 0) {
                if (Object.keys(data.ResultSet.Table).length > 0) {
                    $("#hidClientId").val(data.ResultSet.Table[0].ClientId);
                    $("#txtClientName").val(data.ResultSet.Table[0].ClientName);
                    $("#ddlClientType").val(data.ResultSet.Table[0].ClientType);
                    $("#ddlState").val(data.ResultSet.Table[0].StateName);
                    $("#ddlCity").val(data.ResultSet.Table[0].CityName).change();
                    $("#txtAddress").val(data.ResultSet.Table[0].Address);
                    $("#txtEmail").val(data.ResultSet.Table[0].EmailId);
                    $("#txtPINCode").val(data.ResultSet.Table[0].PINCode);
                    $("#ddlUnit").val(data.ResultSet.Table[0].Unitid).change()
                    $("#ddlClientGroupName").val(data.ResultSet.Table[0].ClientGroupName);
                    $("#btndaddupdate").text('Update');
                    $("#btndaddupdate").val('Update');
                    $("#btnPayMode").prop("disabled", false)
                    $("#ddlPaymode").prop("selectedIndex", "0").change();

                    PaymodeList(ClientID);
                }

            }
            else {
                MsgBox('No Data Found')
            }
        },
        error: function (response) {
            alert('Server Error...!');
        }
    });
}
function GetRateList() {
    var url = config.baseUrl + "/api/GeneralStore/Diag_ClientQueries";
    var objBO = {};
    objBO.Logic = 'CityRateListMaster';
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            if (data != '') {
                $('#ddlCityRate').empty().append($('<option value="0">Select </option>')).change();
                $('#ddlCityRate1').empty().append($('<option value="0">Select </option>')).change();
                $('#ddlClientRate').empty().append($('<option value="0">Select </option>')).change();
                $('#ddlClientRate1').empty().append($('<option value="0">Select </option>')).change();
                $.each(data.ResultSet.Table, function (key, val) {
                    $('#ddlCityRate').append($('<option></option>').val(val.RateListId).html(val.RateListName)).select2();
                    $('#ddlCityRate1').append($('<option></option>').val(val.RateListId).html(val.RateListName)).select2();
                    $('#ddlClientRate').append($('<option></option>').val(val.RateListId).html(val.RateListName)).select2();
                    $('#ddlClientRate1').append($('<option></option>').val(val.RateListId).html(val.RateListName)).select2();
                });
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
function ClearValues() {
    $("#txtClientName").val('');
    $("#hidClientId").val('');
    $("#ddlClientType").prop("selectedIndex", "0").val();
    $("#ddlUnit").prop("selectedIndex", "0").change();
    $("#ddlCity").prop("selectedIndex", "0").change();
    $("#ddlState").prop("selectedIndex", "0").val();
    $("#ddlClientGroupName").prop("selectedIndex", "0").val();
    $("#txtAddress").val('');
    $("#txtEmail").val('');
    $("#txtPINCode").val('');
    $("#btndaddupdate").text('Save');
    $("#btndaddupdate").val('Save');
}
function validation() {
    var clientName = $("#txtClientName").val()
    var UnitName = $("#ddlUnit option:selected").val();
    var clientType = $("#ddlClientType option:selected").val();
    var clientGroupName = $("#ddlClientGroupName option:selected").val();
    var StateName = $("#ddlState option:selected").val();
    var cityName = $("#ddlCity option:selected").val();
    var PinCode = $("#txtPINCode").val();
    var Address = $("#txtAddress").val();
    var Emails = $("#txtEmail").val();

    if (clientName == "") {
        alert('Please Enter Client Name');
        $("#clientName").css('border', '1px solid red');
        return false;
    }
    if (UnitName == "ALL") {
        alert('Please select Unit Name');
        $("#ddlUnit").css('border', '1px solid red');
        return false;
    }
    if (clientType == "0") {
        alert('Please select Client Type');
        $("#ddlClientType").css('border', '1px solid red');
        return false;
    }
    if (clientGroupName == "0") {
        alert('Please select Group Name');
        $("#ddlClientGroupName").css('border', '1px solid red');
        return false;
    }
    if (PinCode == "") {
        alert('Please Enter Pin code');
        $("#txtPINCode").css('border', '1px solid red');
        return false;
    }

    if (StateName == "prompt") {
        alert('Please select State Name');
        $("#ddlState").css('border', '1px solid red');
        return false;
    }
    if (cityName == "0") {
        alert('Please select City Name');
        $("#ddlCity").css('border', '1px solid red');
        return false;
    }
    if (Address == "") {
        alert('Please Enter Address');
        $("#txtAddress").css('border', '1px solid red');
        return false;
    }
    if (Emails == "") {
        alert('Please Enter Email');
        $("#txtEmail").css('border', '1px solid red');
        return false;
    }
    return true;
}
function InsertUpdateClient() {
    if (validation()) {
        var objBO = {};
        var url = config.baseUrl + "/api/GeneralStore/Diag_InsertClientMasterNew";
        var btntext = $("#btndaddupdate").text();
        if (btntext.trim() == "Save") {
            objBO.Logic = "Insert";
        }
        if (btntext.trim() == "Update") {
            objBO.ClientId = $("#hidClientId").val();
            objBO.Logic = "Update";
        }
        objBO.Unitid = $("#ddlUnit option:selected").val();
        objBO.CompId = Active.compId;
        objBO.ClientName = $("#txtClientName").val();
        objBO.ClientType = $("#ddlClientType option:selected").val();
        objBO.ClientGroupName = $("#ddlClientGroupName option:selected").val();
        objBO.CityName = $("#ddlCity option:selected").val();
        objBO.StateName = $("#ddlState option:selected").val();
        objBO.Address = $("#txtAddress").val();
        objBO.PINCode = $("#txtPINCode").val();
        objBO.EmailId = $("#txtEmail").val();
        objBO.LoginId = Active.userId;
        $.ajax({
            method: "POST",
            url: url,
            data: JSON.stringify(objBO),
            dataType: "json",
            contentType: "application/json;charset=utf-8",
            success: function (data) {
                if (data.includes('Success')) {
                    alert(data);
                    ClearValues();
                    Onload();
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
function DeleteClient(element) {
    var ClientID = $(element).data('clientid');
    var objBO = {};
    var url = config.baseUrl + "/api/GeneralStore/Diag_InsertClientMasterNew";
    objBO.ClientId = ClientID;
    objBO.Logic = "Delete";
    if (confirm("Are you sure want to delete?")) {
        $.ajax({
            method: "POST",
            url: url,
            data: JSON.stringify(objBO),
            dataType: "json",
            contentType: "application/json;charset=utf-8",
            success: function (data) {
                if (data.includes('Success')) {
                    alert(data);
                    Onload();
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
function IDDoseInsertData() {
    var clientName = $("#txtClientName").val()
    var Address = $("#txtAddress").val();
    if (Address == "") {
        alert('Please Enter Address');
        $("#txtAddress").css('border', '1px solid red');
        return false;
    }
    if (clientName == "") {
        alert('Please Enter Client Name');
        $("#clientName").css('border', '1px solid red');
        return false;
    }
    var objBO = {};
    var url = config.baseUrl + "/api/GeneralStore/GS_InsertIdDoseClientMaster";
    objBO.ClientId = $("#hidClientId").val();
    objBO.ClientName = $("#txtClientName").val();
    objBO.Address = $("#txtAddress").val();
    objBO.Logic = "Insert";
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            if (data.includes('Success')) {
                alert(data);
                ClearValues();
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
function DownloadExcel(elem) {
    var url = config.baseUrl + "/api/GeneralStore/Diag_ClientQueries";
    var objBO = {};
    objBO.OutPutType = "Excel";
    objBO.prm_1 = ClientID;
    objBO.Logic = 'ClientwiseExcelList';
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
function DownloadPdf(elem) {
    if (ClientID == "") {
        alert("Please select Client Name")
        return
    }
    var ClientName = $("#txtClientName").val();
    var url = "../Print/PrintRateList?clientid=" + ClientID + "&clientName=" + ClientName;
    window.open(url, '_blank');
}
function onloadpaymade() {
    let mode = $("#ddlPaymode option:selected").val();
    if (mode === "Cash") {
        $(".cash-row").show();
        $(".credit-row").hide();
    }
    else if (mode === "Credit") {
        $(".cash-row").hide();
        $(".credit-row").show();
    }
    else if (mode === "Both") {
        $(".cash-row").show();
        $(".credit-row").show();
    }
    else {
        $(".cash-row, .credit-row").hide();
    }
}
function InsertUpdateClientPair(Logicname) {
    var isConfirmed = confirm('Are you sure you want to Save the data?');
    var url = config.baseUrl + "/api/GeneralStore/Diag_InsertClientPair";
    var objMaster = {}; var objPayments = [];
    if (isConfirmed) {
        let mode = $("#ddlPaymode option:selected").val();
        // CREDIT ROWS
        if (mode == "Credit") {
            $('#tblPaymentDetails tbody tr.credit-row').each(function () {
                var creditLimit1 = parseFloat($(this).find('td:eq(1) input[id="txtcreditLimit"]').val());
                if (creditLimit1 > 0) {
                    var CityRateListSelect = $(this).find('td:eq(3) select option:selected').val();
                    var ClientRateListSelect = $(this).find('td:eq(4) select option:selected').val();

                    if (CityRateListSelect == '0') {
                        alert('Please Select City Rate List');
                        return false; // stops loop
                    }
                    if (ClientRateListSelect == '0') {
                        alert('Please Select Client Rate List');
                        return false;
                    }
                    var creditLimit = parseFloat($(this).find('td:eq(1) input[id="txtcreditLimit"]').val());
                    if (creditLimit > 0) {
                        objPayments.push({
                            'PaymentType': $(this).find('td:eq(0)').text(),
                            'CreditLimit': creditLimit,
                            'CreditDays': $(this).find('td:eq(2) input[id="txtcreditDays"]').val(),
                            'CityRateListId': CityRateListSelect,
                            'ClientRateListId': ClientRateListSelect,
                            'ExtLedgerId': '-'
                        });
                    }
                }
                else {
                    alert('Please Enter Credit Limit');
                    return;
                }
            });
        }
        else if (mode == "Cash") {
            // CASH ROWS
            $('#tblPaymentDetails tbody tr.cash-row').each(function () {
                var CityRateListSelect = $(this).find('td:eq(3) select option:selected').val();
                var ClientRateListSelect = $(this).find('td:eq(4) select option:selected').val();
                if (CityRateListSelect == '0') {
                    alert('Please Select City Rate List');
                    return false;
                }
                if (ClientRateListSelect == '0') {
                    alert('Please Select Client Rate List');
                    return false;
                }
                objPayments.push({
                    'PaymentType': $(this).find('td:eq(0)').text(),
                    'CreditLimit': '0',
                    'CreditDays': '0',
                    'CityRateListId': CityRateListSelect,
                    'ClientRateListId': ClientRateListSelect,
                    'ExtLedgerId': '-'
                });

            });
        }
        else if (mode == "Both") {
            $('#tblPaymentDetails tbody tr').each(function () {
                var CityRateListSelect = $(this).find('td:eq(3) select option:selected').val();
                var ClientRateListSelect = $(this).find('td:eq(4) select option:selected').val();
                if (CityRateListSelect == '0') {
                    alert('Please Select City Rate List');
                    return false;
                }
                if (ClientRateListSelect == '0') {
                    alert('Please Select Client Rate List');
                    return false;
                }
                objPayments.push({
                    'PaymentType': $(this).find('td:eq(0)').text(),
                    'CreditLimit': $(this).find('td:eq(1) input[id="txtcreditLimit"]').val(),
                    'CreditDays': $(this).find('td:eq(2) input[id="txtcreditDays"]').val(),
                    'CityRateListId': CityRateListSelect,
                    'ClientRateListId': ClientRateListSelect,
                    'ExtLedgerId': '-'
                });

            });
        }
        else {
            alert("Please select PayMode");
            return
        }

        objMaster.ClientId = $("#hidClientId").val();
        objMaster.UnitId = Active.unitId;
        objMaster.CompId = Active.compId;
        objMaster.prm1 = '-';
        objMaster.login_id = Active.userId;
        objMaster.logic = Logicname;
        var MasterObject = {};
        MasterObject.objMaster = objMaster;
        MasterObject.objPairList = objPayments;
        $.ajax({
            method: "POST",
            url: url,
            dataType: "json",
            contentType: "application/json;charset=utf-8",
            data: JSON.stringify(MasterObject),
            success: function (data) {
                if (data.includes('Success')) {
                    alert("Successfully Saved");
                    $('#ddlClientRate').prop('selectedIndex', '0').change();
                    $('#ddlClientRate1').prop('selectedIndex', '0').change();
                    $('#ddlCityRate1').prop('selectedIndex', '0').change();
                    $('#ddlCityRate').prop('selectedIndex', '0').change();
                    $('#txtcreditLimit').val('0');
                    $('#txtcreditDays').val('0');
                    $("#btnPayMode").prop("disabled", true)
                    PaymodeList(objMaster.ClientId)

                } else {
                    alert(data);
                }
            }
        });
    }

    else {
        alert('Data Save canceled.');
    }

}
function PaymodeList(ClientID) {
    let hasCash = false;
    let hasCredit = false;
    $("#tblPaymentInfo tbody").empty();
    var url = config.baseUrl + "/api/GeneralStore/Diag_ClientQueries";
    var objBO = {};
    objBO.login_id = Active.userId;
    objBO.prm_1 = ClientID;
    objBO.Logic = 'ClientIdWisePaymodeList';
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
                        tbody += "<td>" + val.PaymentType + "</td>";
                        tbody += "<td>" + val.CreditLimit + "</td>";
                        tbody += "<td>" + val.CreditDays + "</td>";
                        tbody += "<td>" + val.CityRateName + "</td>";
                        tbody += "<td>" + val.ClientRateName + "</td>";
                        tbody += "<td style='text-align:center'><button  class='btn btn-danger'  onclick='DeleteClientWisePayMode(this);selectRow(this)' data-clientid='" + val.ClientId + "'data-pairid='" + val.PairId + "'><i class='fa fa-trash'></i></button></td>";
                        tbody += "</tr>";
                        // Track payment modes
                        if (val.PaymentType === "Cash") {
                            hasCash = true;
                        }
                        if (val.PaymentType === "Credit") {
                            hasCredit = true;
                        }
                    });
                    $("#tblPaymentInfo tbody").append(tbody);
                }
            }
            else {
                alert("Error");
            };
        },
        complete: function (response) {
            $("#btnCashPayMode").prop("disabled", !hasCash);
            $("#btnCreditPayMode").prop("disabled", !hasCredit);
        },
        error: function (response) {
            alert('Server Error...!');
        }
    });
}
function DeleteClientWisePayMode(element) {
    var ClientID = $(element).data('clientid');
    var PairId = $(element).data('pairid');
    var objBO = {};
    var url = config.baseUrl + "/api/GeneralStore/Diag_InsertClientMasterNew";
    objBO.ClientId = ClientID;
    objBO.ClientName = PairId;
    objBO.Logic = "DeletePaymode";
    if (confirm("Are you sure want to delete?")) {
        $.ajax({
            method: "POST",
            url: url,
            data: JSON.stringify(objBO),
            dataType: "json",
            contentType: "application/json;charset=utf-8",
            success: function (data) {
                if (data.includes('Success')) {
                    alert(data);
                    PaymodeList(objBO.ClientId)
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
    else {
        alert("Data Cancelled..")
    }

}