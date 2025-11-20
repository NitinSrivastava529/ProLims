var ClientID = "";
$(document).ready(function () {
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

});
function GetUnitList() {
    var url = config.baseUrl + "/api/GeneralStore/MasterQueries";
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
    var url = config.baseUrl + "/api/GeneralStore/MasterQueries";
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
                        tbody += "<td>" + val.PaymentType + "</td>";
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
    var url = config.baseUrl + "/api/GeneralStore/MasterQueries";
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
    var url = config.baseUrl + "/api/GeneralStore/MasterQueries";
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
    ClientID = $(element).data('clientid');
    var url = config.baseUrl + "/api/GeneralStore/MasterQueries";
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
            if (Object.keys(data.ResultSet).length > 0) {
                if (Object.keys(data.ResultSet.Table).length > 0) {
                    $("#hidClientId").val(data.ResultSet.Table[0].ClientId);
                    $("#txtClientName").val(data.ResultSet.Table[0].ClientName);
                    $("#ddlClientType").val(data.ResultSet.Table[0].ClientType);
                    $("#ddlPaymentType").val(data.ResultSet.Table[0].PaymentType);
                    $("#ddlState").val(data.ResultSet.Table[0].StateName);
                    $("#ddlCity").val(data.ResultSet.Table[0].CityName).change();
                    $("#txtAddress").val(data.ResultSet.Table[0].Address);
                    $("#txtEmail").val(data.ResultSet.Table[0].EmailId);
                    $("#txtPINCode").val(data.ResultSet.Table[0].PINCode);
                    $("#txtCreditLimit").val(data.ResultSet.Table[0].CreditLimit);
                    $("#txtCreditDays").val(data.ResultSet.Table[0].CreditDays);
                    $("#txtTdsPerc").val(data.ResultSet.Table[0].tdsPerc);
                    $("#ddlMRPRateList").val(data.ResultSet.Table[0].MRPRateListId).change();
                    $("#ddlClientRateList").val(data.ResultSet.Table[0].ClientRateListId).change()
                    $("#ddlUnit").val(data.ResultSet.Table[0].Unitid).change()
                    $("#ddlLedger").val(data.ResultSet.Table[0].LedgerId);
                    $("#ddlClientGroupName").val(data.ResultSet.Table[0].ClientGroupName);

                    $("#btndaddupdate").text('Update');
                    $("#btndaddupdate").val('Update');

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
    var url = config.baseUrl + "/api/GeneralStore/MasterQueries";
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
                $('#ddlMRPRateList').empty().append($('<option value="0">Select </option>')).change();
                $('#ddlClientRateList').empty().append($('<option value="0">Select </option>')).change();
                $.each(data.ResultSet.Table, function (key, val) {
                    $('#ddlMRPRateList').append($('<option></option>').val(val.RateListId).html(val.RateListName)).select2();
                    $('#ddlClientRateList').append($('<option></option>').val(val.RateListId).html(val.RateListName)).select2();
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
function ClearValues() {
    $("#txtClientName").val('');
    $("#hidClientId").val('');
    $("#ddlClientType").prop("selectedIndex", "0").val();
    $("#ddlPaymentType").prop("selectedIndex", "0").val();
    $("#ddlUnit").prop("selectedIndex", "0").change();
    $("#ddlCity").prop("selectedIndex", "0").val();
    $("#ddlState").prop("selectedIndex", "0").val();
    $("#ddlMRPRateList").prop("selectedIndex", "0").change();
    $("#ddlClientGroupName").prop("selectedIndex", "0").val();
    $('#ddlClientRateList').prop('selectedIndex', '0').change();
    $("#txtAddress").val('');
    $("#txtEmail").val('');
    $("#txtPINCode").val('');
    $("#txtCreditDays").val('0');
    $("#txtCreditLimit").val('0');
    $("#txtTdsPerc").val('0');
    $("#btndaddupdate").text('Save');
    $("#btndaddupdate").val('Save');
}
function validation() {
    var clientName = $("#txtClientName").val()
    var UnitName = $("#ddlUnit option:selected").val();
    var clientType = $("#ddlClientType option:selected").val();
    var clientGroupName = $("#ddlClientGroupName option:selected").val();
    var PaymentType = $("#ddlPaymentType option:selected").val();
    var StateName = $("#ddlState option:selected").val();
    var cityName = $("#ddlCity option:selected").val();
    var PinCode = $("#txtPINCode").val();
    var Address = $("#txtAddress").val();
    var Emails = $("#txtEmail").val();
    var mrprateList = $("#ddlMRPRateList option:selected").val();
    var clientratelist = $("#ddlClientRateList option:selected").val();
    var Creditlimit = $("#txtCreditLimit").val();
    var CreditDays = $("#txtCreditDays").val();
    var Tdsperc = $("#txtTdsPerc").val();
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
    if (PaymentType == "0") {
        alert('Please select Payment Type');
        $("#ddlPaymentType").css('border', '1px solid red');
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
    if (mrprateList == "0") {
        alert('Please Enter MRP Rate List');
        $("#ddlMRPRateList").css('border', '1px solid red');
        return false;
    }
    if (clientratelist == "0") {
        alert('Please Enter Client Rate List');
        $("#ddlClientRateList").css('border', '1px solid red');
        return false;
    }
    if (Creditlimit == "") {
        alert('Please Enter Credit Limit');
        $("#txtCreditLimit").css('border', '1px solid red');
        return false;
    }
    if (CreditDays == "") {
        alert('Please Enter Credit Days');
        $("#txtCreditDays").css('border', '1px solid red');
        return false;
    }
    if (Tdsperc == "") {
        alert('Please Enter Tds %');
        $("#txtTdsPerc").css('border', '1px solid red');
        return false;
    }
    return true;
}
function InsertUpdateClient() {
    if (validation()) {
        var objBO = {};
        var url = config.baseUrl + "/api/GeneralStore/GS_InsertClientMaster";
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
        objBO.PaymentType = $("#ddlPaymentType option:selected").val();
        objBO.CityName = $("#ddlCity option:selected").val();
        objBO.StateName = $("#ddlState option:selected").val();
        objBO.Address = $("#txtAddress").val();
        objBO.PINCode = $("#txtPINCode").val();
        objBO.EmailId = $("#txtEmail").val();
        objBO.CreditLimit = $("#txtCreditLimit").val();
        objBO.CreditDays = $("#txtCreditDays").val();
        objBO.LoginId = Active.userId;
        objBO.MRPRateListId = $("#ddlMRPRateList option:selected").val();
        objBO.ClientRateListId = $("#ddlClientRateList option:selected").val();
        objBO.ClientGroupName = $("#ddlClientGroupName option:selected").val();
        objBO.tdsPerc = $("#txtTdsPerc").val();
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
    var url = config.baseUrl + "/api/GeneralStore/GS_InsertClientMaster";
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
    var url = config.baseUrl + "/api/GeneralStore/MasterQueries";
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
