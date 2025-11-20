var Investgationid = "";
var golbletestCode = "";
$(document).ready(function () {
    //$('select').select2();
    Onload();
    CloseSidebar();
    $('#txtInvestName').keyup(function (e) {
        var txtVal = $(this).val();
        $('#txtInvestReportName').val(txtVal);
    });
    $("#txtSearch").on("keyup", function () {
        var value = $(this).val().toLowerCase();
        $("#tblTestDetails tbody tr").filter(function () {
            $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
        });
    });
    $("#txtSearch1").on("keyup", function () {
        var value = $(this).val().toLowerCase();
        $("#tblPackageDetails tbody tr").filter(function () {
            $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
        });
    });
    $("#txtSearch2").on("keyup", function () {
        var value = $(this).val().toLowerCase();
        $("#tblSampleDetails tbody tr").filter(function () {
            $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
        });
    });
    $('#btnSample').prop('disabled', true);
});
function CloseSidebar() {
    $('html').attr('data-toggled', 'icon-overlay-close');
}
function Onload() {
    var url = config.baseUrl + "/api/Service/Diag_InvestigationQueries";
    var objBO = {};
    objBO.Logic = "OnLoad";
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            if (Object.keys(data.ResultSet).length > 0) {

                if (Object.keys(data.ResultSet.Table).length > 0) {
                    $("#ddlTestSubCategory").append($("<option selected></option>").val("ALL").html("ALL")).select2();
                    $("#ddlSubCategory").append($("<option></option>").val("0").html("Please Select")).select2();
                    $.each(data.ResultSet.Table, function (key, value) {
                        $("#ddlTestSubCategory").append($("<option></option>").val(value.SubCatID).html(value.SubCatName));
                        $("#ddlSubCategory").append($("<option></option>").val(value.SubCatID).html(value.SubCatName));
                    });
                }
                //if (Object.keys(data.ResultSet.Table1).length > 0) {
                //    //$("#ddlSamplesdata").append($("<option selected></option>").val("").html(""));
                //    $.each(data.ResultSet.Table1, function (key, value) {
                //        $("#ddlSamplesdata").append($("<option></option>").val(value.samp_code).html(value.samp_type)).select2();
                //    });
                //}

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
function SearchBySubCategory() {
    $("#tblTestDetails tbody").empty();
    var htmldata = "";
    var url = config.baseUrl + "/api/Service/Diag_InvestigationQueries";
    var objBO = {};
    objBO.Logic = "GetTestBySubCategory";
    objBO.subcateid = $("#ddlTestSubCategory option:selected").val();
    objBO.prm_1 = '-';
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
                        htmldata += '<tr>';
                        htmldata += "<td style='width:12%;text-align:center'><button type='button' id='btnEditInvestigation" + key + "' onclick=selectRow(this);EditInvestigationDetails('" + val.testcode + "')  class='btn btn-success'><span class='fa fa-edit'></span></button></td>";
                        htmldata += '<td hidden>' + val.testcode + '</td>';
                        htmldata += '<td>' + val.testcode1 + '</td>';
                        htmldata += '<td>' + val.TestName + '</td>';
                        htmldata += '</tr>';
                    });
                    $("#tblTestDetails tbody").append(htmldata);
                }
                else {
                    htmldata += '<tr>';
                    htmldata += '<td colspan="3" class="text-center text-red">No Data Found</td>';
                    htmldata += '</tr>';
                    $("#tblTestDetails tbody").append(htmldata);
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
function EditInvestigationDetails(testcode) {
    golbletestCode = testcode;
    var url = config.baseUrl + "/api/Service/Diag_InvestigationQueries";
    var objBO = {};
    objBO.Logic = "EditInvestigation";
    objBO.investcode = testcode
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            console.log(data);
            if (Object.keys(data.ResultSet).length > 0) {
                if (Object.keys(data.ResultSet.Table).length > 0) {
                    $("#ddlCategory").val(data.ResultSet.Table[0].CatId).prop('selected', true).change();
                    $("#ddlSubCategory").val(data.ResultSet.Table[0].SubCatId).prop('selected', true).change();
                    $("#txtExtCode").val(data.ResultSet.Table[0].testcode);
                    $("#txtExtCode").prop('disabled', true);
                    $("#txtInvestCode").val(data.ResultSet.Table[0].extTestCode);
                    $("#txtInvestCode").prop('disabled', true);
                    $("#txtInvestName").val(data.ResultSet.Table[0].TestName);
                    $("#txtInvestReportName").val(data.ResultSet.Table[0].nameonreport);
                    $("#ddlInvestType").val(data.ResultSet.Table[0].testType);
                    $("#ddlReportType").val(data.ResultSet.Table[0].r_type);
                    $("#txtRate").val(data.ResultSet.Table[0].offer_rate);
                    $("#ddlSampleoption").val(data.ResultSet.Table[0].sample_option).prop('selected', true).change();
                    data.ResultSet.Table[0].IsPopular == 'Y' ? $('#chkIsOutSource').prop('checked', true) : $('#chkIsOutSource').prop('checked', false);
                    $("#txtDefaultSample").val(data.ResultSet.Table[0].default_sample);
                    //$.each(data.ResultSet.Table1, function (key, val1) {
                    //    $("#ddlSamplesdata").val(val1.samp_code).prop('selected', true).change();
                    //});

                    //if (data.ResultSet && data.ResultSet.Table1) {
                    //    let sampCodes = [];
                    //    $.each(data.ResultSet.Table1, function (key, val1) {
                    //        sampCodes.push(val1.samp_code);
                    //    });
                    //    $("#ddlSamplesdata").val(sampCodes).change();
                    //}
                    //$('#ddlSamplesdata :selected').each(function () {
                    //    if ($(this).text() == data.ResultSet.Table[0].default_sample) {
                    //        $("#ddlDefaultSample").append($("<option selected></option>").val($(this).val()).html($(this).text()));
                    //    }
                    //    else {
                    //        $("#ddlDefaultSample").append($("<option></option>").val($(this).val()).html($(this).text()));
                    //    }
                    //});
                    GetTestWisePackageSample(testcode)
                    $("#btnInvestigationSample").val('Update').addClass('btn-warning').removeClass('btn-success');
                    $('#btnSample').prop('disabled', false);
                }
                else {
                    MsgBox('No Data Found');
                }
            }
            else {
                MsgBox('No Data Found');
            }
        },
        error: function (response) {
            alert('Server Error...!');
        }
    });
}
function GetTestWisePackageSample(testcode) {
    $("#tblPackageDetails tbody").empty();
    $("#tblSampleDetails tbody").empty();
    var htmldata = ""; var htmldata1 = "";
    var url = config.baseUrl + "/api/Service/Diag_InvestigationQueries";
    var objBO = {};
    objBO.Logic = "GetTestwisePakegeAndSample";
    objBO.subcateid = '-';
    objBO.prm_1 = testcode;
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
                        htmldata += '<tr>';
                        htmldata += '<td hidden>' + val.testcode + '</td>';
                        htmldata += '<td hidden>' + val.PackageId + '</td>';
                        htmldata += '<td>' + val.ItemId + '</td>';
                        htmldata += '<td>' + val.ItemName + '</td>';
                        htmldata += '</tr>';
                    });
                    $("#tblPackageDetails tbody").append(htmldata);
                }

                if (Object.keys(data.ResultSet.Table1).length > 0) {
                    $.each(data.ResultSet.Table1, function (key, val) {
                        htmldata1 += '<tr>';
                        htmldata1 += '<td hidden>' + val.Investigation_id + '</td>';
                        htmldata1 += '<td>' + val.sampletypeid + '</td>';
                        htmldata1 += '<td>' + val.sampleName + '</td>';
                        htmldata1 += '</tr>';
                    });
                    $("#tblSampleDetails tbody").append(htmldata1);
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
function validation() {
    var subcatid = $("#ddlSubCategory option:selected").val();
    var investname = $("#txtInvestName").val();
    var investreprtname = $("#txtInvestReportName").val();
    var investtype = $("#ddlInvestType option:selected").val();
    var rate = $("#txtRate").val();
    var Sampleoption = $("#ddlSampleoption option:selected").val();
    if (subcatid == "0") {
        alert('Please select sub category');
        $("#ddlSubCategory").css('border', '1px solid red');
        return false;
    }
    if (investtype == "0") {
        alert('Please select investigation type');
        $("#ddlInvestType").css('border', '1px solid red');
        return false;
    }
    if (investname == "") {
        alert('Please enter investigation name');
        $("#txtInvestName").css('border', '1px solid red');
        return false;
    }
    if (rate == "") {
        alert('Please enter Enter Rate');
        $("#txtRate").css('border', '1px solid red');
        return false;
    }
    if (investreprtname == "") {
        alert('Please enter report name');
        $("#txtInvestReportName").css('border', '1px solid red');
        return false;
    }
    if (Sampleoption == "0") {
        alert('Please select sample option');
        $("#ddlSampleoption").css('border', '1px solid red');
        return false;
    }
    return true;
}
function InsertUpdateInvestigation() {

    if (validation()) {
        //var conv = [];  
        //$('#ddlSamplesdata option:selected').each(function () {
        //    conv.push(this.value);
        //});
        var objBO = {};
        var url = config.baseUrl + "/api/Service/Diag_InvestigationInsertUpdate";
        objBO.subcateid = $("#ddlSubCategory option:selected").val();
        objBO.investcode = $("#txtInvestCode").val();
        objBO.extTestCode = $("#txtExtCode").val();
        objBO.investname = $("#txtInvestName").val();
        objBO.investtype = $("#ddlInvestType option:selected").val();
        objBO.rate = ($("#txtRate").val() == '') ? 0 : $("#txtRate").val();
        objBO.sampleoption = $("#ddlSampleoption option:selected").val();
        //objBO.samplelinkdata = (conv.length > 0) ? conv.join() : '-';
        objBO.samplelinkdata = '-';
        objBO.defaultsample = $("#txtDefaultSample").val();
        objBO.IsPopular = $('#chkIsOutSource').is(':checked') ? 'Y' : 'N';
        objBO.login_id = Active.userId;
        objBO.Logic = ($("#btnInvestigationSample").val() == 'Save') ? 'Insert' : 'Update';
        console.log(objBO)
        $.ajax({
            method: "POST",
            url: url,
            data: JSON.stringify(objBO),
            dataType: "json",
            contentType: "application/json;charset=utf-8",
            success: function (data) {
                if (data == 'success') {
                    alert('Test investigation saved successfully');
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
}
function ClearValues() {
    $("#ddlSubCategory").prop("selectedIndex", 0).change();
    $("#txtInvestCode").val('');
    $("#txtExtCode").val('');
    $("#txtInvestName").val('');
    $("#ddlInvestType").prop("selectedIndex", 0);
    $("#ddlSampleoption").prop("selectedIndex", 0).change();
    //$("#ddlSamplesdata").prop("selectedIndex", 0).change();
    $("#ddlDefaultSample").prop("selectedIndex", 0);
    $("#txtRate").val('');
    $('#chkIsOutSource').prop('checked', false);
    $("#ddlDefaultSample").empty();
    $("#btnInvestigationSample").val('Save').addClass('btn-success').removeClass('btn-warning');
}
function SearchByCode() {
    if ($("#ddlstatus option:selected").val() == 'select') {
        alert("Please select Report Type")
        return
    }
    $('#tblInvestgationDetails tbody').empty();
    var url = config.baseUrl + "/api/Service/ITDose_TestInfoQueries";
    var objBO = {};
    objBO.Prm1 = $("#txtSearchCode").val();
    objBO.Logic = $("#ddlstatus option:selected").val();
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        contentType: "application/json;charset=utf-8",
        dataType: "JSON",
        success: function (data) {
            if (Object.keys(data.ResultSet).length) {
                if (Object.keys(data.ResultSet.Table).length) {
                    var tbody = "";
                    $.each(data.ResultSet.Table, function (key, val) {
                        tbody += "<tr>";
                        tbody += "<td style='width:15%'>" + val.Investigation_Id + "</td>";
                        tbody += "<td style='width:15%'>" + val.testcode + "</td>";
                        tbody += "<td style='width:25%'>" + val.TestName + "</td>";
                        tbody += "<td style='width:25%'>" + val.SubCatName + "</td>";
                        tbody += "<td style='width:12%;text-align:center'><button type='button' id='btnInvestgationDetails" + key + "' onclick=selectRow(this);ITDoseInvestigationDetails('" + val.Investigation_Id + "')  class='btn btn-success'><span class='fa fa-arrow-right'></span></button></td>";
                        tbody += "</tr>";

                    });
                    $('#tblInvestgationDetails tbody').append(tbody);
                }

            }
        },
        error: function (response) {
            alert('Server Error...!');
        }
    });
}
function SearchByName() {
    $('#tblInvestgationDetails tbody').empty();
    var url = config.baseUrl + "/api/Service/ITDose_TestInfoQueries";
    var objBO = {};
    objBO.Prm1 = $("#txtSearchText").val().trim();
    objBO.Logic = 'ByTestSearch';
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        contentType: "application/json;charset=utf-8",
        dataType: "JSON",
        success: function (data) {
            if (Object.keys(data.ResultSet).length) {
                if (Object.keys(data.ResultSet.Table).length) {
                    var tbody = "";
                    $.each(data.ResultSet.Table, function (key, val) {

                        tbody += "<tr>";
                        tbody += "<td style='width:15%'>" + val.Investigation_Id + "</td>";
                        tbody += "<td style='width:15%'>" + val.testcode + "</td>";
                        tbody += "<td style='width:25%'>" + val.TestName + "</td>";
                        tbody += "<td style='width:25%'>" + val.SubCatName + "</td>";
                        tbody += '<td><button class="btn btn-success InvestgationDetails" ' + val.Investigation_Id + '><i class="fa fa-arrow-right"></i></button></td>';
                        tbody += "</tr>";

                    });
                    $('#tblInvestgationDetails tbody').append(tbody);
                }

            }
        },
        error: function (response) {
            alert('Server Error...!');
        }
    });
}
function ITDoseInvestigationDetails(testcode) {
    $('#tblPackageDetails tbody').empty();
    var url = config.baseUrl + "/api/Service/ITDose_TestInfoQueries";
    var objBO = {};
    objBO.Prm1 = testcode;
    objBO.Logic = 'PackageCodeWise';
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            if (Object.keys(data.ResultSet).length > 0) {
                if (Object.keys(data.ResultSet.Table).length > 0) {
                    $("#ddlSubCategory").val(data.ResultSet.Table[0].SubCategoryID).prop('selected', true).change();
                    $("#txtExtCode").val(data.ResultSet.Table[0].TestCode);
                    $("#txtExtCode").prop('disabled', true);
                    $("#txtInvestCode").val(data.ResultSet.Table[0].ItemID);
                    $("#txtInvestCode").prop('disabled', true);
                    $("#txtInvestName").val(data.ResultSet.Table[0].ItemName);
                    $("#ddlInvestType").val(data.ResultSet.Table[0].testType);
                    $("#txtRate").val(data.ResultSet.Table[0].MRP);
                    $("#ddlSampleoption").val(data.ResultSet.Table[0].SampleOption).prop('selected', true).change();
                    $("#txtDefaultSample").val(data.ResultSet.Table[0].default_sample);
                    $("#modalSearch").modal('hide');
                }
                if (Object.keys(data.ResultSet.Table).length) {
                    var tbody = "";
                    $.each(data.ResultSet.Table, function (key, val) {

                        tbody += "<tr>";
                        tbody += '<td>' + val.ItemID + '</td>';
                        tbody += '<td hidden>' + val.TestId + '</td>';
                        tbody += '<td>' + val.TestName + '</td>';
                        tbody += "</tr>";

                    });
                    $('#tblPackageDetails tbody').append(tbody);
                }
                else {
                    MsgBox('No Data Found');
                }
            }
            else {
                MsgBox('No Data Found');
            }
        },
        error: function (response) {
            alert('Server Error...!');
        }
    });
}
function ImportPackageData() {
    var isConfirmed = confirm('Are you sure you want to Save the data?');
    if (isConfirmed) {
        var url = config.baseUrl + "/api/Service/Diag_ImportFromLisPackage";
        var objMaster = {};
        var objPackageList = [];
        objMaster.subcateid = $("#ddlSubCategory option:selected").val();
        objMaster.extTestCode = $("#txtExtCode").val();
        objMaster.investcode = $("#txtInvestCode").val();
        objMaster.investname = $("#txtInvestName").val();
        objMaster.investtype = $("#ddlInvestType").val();
        objMaster.rate = $("#txtRate").val();
        objMaster.sampleoption = $("#ddlSampleoption option:selected").val();
        objMaster.defaultsample = $("#txtDefaultSample").val();
        objMaster.IsPopular = $("#chkIsOutSource").is(":checked") ? "Y" : "N";
        objMaster.login_id = Active.userId;
        objMaster.Logic = 'ImportPackage';
        $('#tblPackageDetails tbody tr').each(function () {
            objPackageList.push({
                'itemId': $(this).find('td:eq(1)').text(),
                'PackageId': $(this).find('td:eq(0)').text(),
                'InvestigationID': '-',
                'TypeName': $(this).find('td:eq(2)').text(),
            });
        });
        var MasterObject = {};
        MasterObject.objMaster = objMaster;
        MasterObject.objPackageList = objPackageList;
        console.log(MasterObject);
        $.ajax({
            method: "POST",
            url: url,
            data: JSON.stringify(MasterObject),
            dataType: "json",
            contentType: "application/json;charset=utf-8",
            success: function (data) {
                if (data.includes('Success')) {
                    alert(data);
                    ClearValues();
                    $('#tblPackageDetails tbody').empty();
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
        alert('Data Save canceled.');
    }

}
function ImportSampleData() {
    var isConfirmed = confirm('Are you sure you want to Save the data?');
    if (isConfirmed) {
        $('#tblSampleDetails tbody').empty();
        var url = config.baseUrl + "/api/Service/ITDose_TestInfoQueries";
        var objBO = {};
        objBO.Prm1 = golbletestCode;
        objBO.Logic = 'GetSample';
        $.ajax({
            method: "POST",
            url: url,
            data: JSON.stringify(objBO),
            contentType: "application/json;charset=utf-8",
            dataType: "JSON",
            success: function (data) {
                if (Object.keys(data.ResultSet.Table).length) {
                    var tbody = "";
                    $.each(data.ResultSet.Table, function (key, val) {
                        tbody += "<tr>";
                        tbody += "<td>" + val.sampletypeid + "</td>";
                        tbody += "<td>" + val.sampleName + "</td>";
                        tbody += "</tr>";
                    });
                    $('#tblSampleDetails tbody').append(tbody);
                    InsertSample()
                }
                else {
                    alert('No Data Found');
                }
            },
            error: function (response) {
                alert('Server Error...!');
            }
        });
    }
    else {
        alert('Data Save canceled.');
    }
}
function InsertSample() {
    var url = config.baseUrl + "/api/Service/Diag_ImportFromLisPackage";
    var objMaster = {};
    var objPackageList = [];
    objMaster.investcode = golbletestCode;
    objMaster.login_id = Active.userId;
    objMaster.Logic = 'ImportSample';
    $('#tblSampleDetails tbody tr').each(function () {
        objPackageList.push({
            'itemId': golbletestCode,
            'PackageId': $(this).find('td:eq(0)').text(),
            'InvestigationID': '-',
            'TypeName': $(this).find('td:eq(1)').text(),
        });
    });
    var MasterObject = {};
    MasterObject.objMaster = objMaster;
    MasterObject.objPackageList = objPackageList;
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(MasterObject),
        dataType: "json",
        contentType: "application/json;charset=utf-8", 
        success: function (data) {
            if (data.includes('Success')) {
                alert(data);
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