var editkitId = "";
var packlinkautoid = "0";
$(document).ready(function () {
    $('#ddlObservation').empty().append($('<option></option>').val('Select').html('Select')).select2();
    $('#ddlGroup').empty().append($('<option value="ALL">Select</option>'));
    $('#ddlObservation').empty().append($('<option value="ALL">Select</option>'));
    $('#ddlItem').empty().append($('<option value="ALL">Select</option>'));
    Getload();
    GetGroupList();
    GetloadList();
    GetPackList();
    GetGroupPackLinkList();
    GetGroupObservationLinkList();
    $('#btnKitsave').on('click', function () {
        var val = $(this).val();
        if (val == 'Submit') {
            InsertGroupMaster('Insert');
        }
        else if (val == 'Update') {
            InsertGroupMaster('Update');
        }
    });
    $('#tblGroupMaster tbody').on('click', '.getkit', function () {
        editkitId = $(this).closest('tr').find('td:eq(1)').text();
        var kitName = $(this).closest('tr').find('td:eq(2)').text();
        $('#txtGroupName').val(kitName)
        $('#btnKitsave').val('Update');
        $('#tblGroupMaster tbody tr').find('td').removeAttr('style');
        $(this).closest('tr').find('td:eq(1),td:eq(2)').css({ 'background': '#c7e6ff', 'color': 'black' });
    });
    $('#tblGroupMaster tbody').on('click', '#btnselect', function () {
        var groupid = $(this).closest('tr').find('td:eq(1)').text();
        var groupnme = $(this).closest('tr').find('td:eq(2)').text();
        deleteRow(groupid)
    });
    $('#btnGroupPackLink').on('click', function () {
        var val = $(this).val();
        if (val == 'Save') {
            InsertGroupPackLink('InsertGroupPackLink');
        }
        else if (val == 'Update') {
            InsertGroupPackLink('UpdateGroupPackLink');
        }
    });
    $('#btnObservationLink').on('click', function () {
        var val = $(this).val();
        if (val == 'Save') {
            InsertGroupObservationLink('InsertGroupObservationLink');
        }
        //else if (val == 'Update') {
        //    InsertGroupObservationLink('UpdateGroupPackLink');
        //}
    });
    $('#tblGroupPackLink tbody').on('click', '.getpacklink', function () {
        debugger
        packlinkautoid = $(this).closest('tr').find('td:eq(0)').text();
        var groupId = $(this).closest('tr').find('td:eq(1)').text();
        var itemid = $(this).closest('tr').find('td:eq(2)').text();
        var packtype = $(this).closest('tr').find('td:eq(4)').text();
        var intcount = $(this).closest('tr').find('td:eq(5)').text();
        $('#txttestcount').val(intcount)

        $('#ddlItem').val(itemid).change();
        $('#ddlGroup').val(groupId).change();
        $('#ddlpack').val(packtype).change();
        $('#btnGroupPackLink').val('Update');
        $('#tblGroupPackLink tbody tr').find('td').removeAttr('style');
        $(this).closest('tr').find('td:eq(1),td:eq(2),td:eq(3),td:eq(4),td:eq(5)').css({ 'background': '#c7e6ff', 'color': 'black' });
    });
    $('#tblGroupPackLink tbody').on('click', '#btndelete', function () {
        var Autoid = $(this).closest('tr').find('td:eq(0)').text();
        GroupPackLinkdeleteRow(Autoid,'DeleteGroupPackLink')
    });
    $('#tblGroupObservationLink tbody').on('click', '#btndeleteObservation', function () {
        var Autoid = $(this).closest('tr').find('td:eq(0)').text();
        GroupPackLinkdeleteRow(Autoid,'DeleteGroupObservationLink')
    });
    $('#ddlGroup').on('change', function () {
        GetGroupPackLinkList();
        GetGroupObservationLinkList();
    });
    $('#ddlItem').on('change', function () {
        GetPackList();
    });
    $('#ddlfilter').on('change', function () {
        GetloadList();
    });
});
function InsertGroupMaster(logic) {
    if ($('#txtGroupName').val() == '') {
        alert('Enter Group Name');
        $('#txtGroupName').focus();
        return
    }
    var url = config.baseUrl + "/api/GeneralStore/InsertGroupMaster";
    var objBO = {};
    objBO.Autoid = '0';
    objBO.Unitid = Active.unitId;
    objBO.GroupId = editkitId;
    objBO.GroupName = $('#txtGroupName').val();
    objBO.prm1 = '-';
    objBO.prm2 = '-';
    objBO.TestPerfNos = '-';
    objBO.login_id = Active.userid;
    objBO.Logic = logic;
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            if (data.includes('Success')) {
                alert(data);
                $('#txtGroupName').text('');
                $('#txtGroupName').val('');
                GetGroupList();
            }
            else {
                alert(data);
            };
        },
        error: function (response) {
            alert('Server Error...!');
        }
    });
}
function deleteRow(groupid) {
    var url = config.baseUrl + "/api/GeneralStore/InsertGroupMaster";
    var objBO = {};
    objBO.Autoid = '0';
    objBO.GroupId = groupid;
    objBO.GroupName = '-';
    objBO.prm1 = '-';
    objBO.prm2 = '-';
    objBO.TestPerfNos = '0';
    objBO.login_id = Active.userid;
    objBO.Logic = 'DeleteGroup';
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            if (data.includes('Success')) {
                alert(data);
                GetGroupList();
            }
            else {
                alert(data);
            };
        },
        error: function (response) {
            alert('Server Error...!');
        }
    });
}
function GetGroupList() {
    $("#tblGroupMaster tbody").empty();
    var url = config.baseUrl + "/api/GeneralStore/MasterQueries";
    var objBO = {};
    objBO.prm_1 = '-';
    objBO.Logic = 'GetGroupList';
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        contentType: "application/json;charset=utf-8",
        dataType: "JSON",
        success: function (data) {
            var tbody = "";
            if (Object.keys(data.ResultSet).length) {
                if (Object.keys(data.ResultSet.Table).length) {
                    $.each(data.ResultSet.Table, function (key, val) {
                        tbody += "<tr>";
                        tbody += "<td>" +
                            '<button type="button"  class="btn btn-warning btn-xs getkit"> <i class="fa fa-edit"></i></button> ' +
                            "</td>";
                        tbody += "<td>" + val.GroupId + "</td>";
                        tbody += "<td>" + val.GroupName + "</td>";
                        tbody += "<td>" +
                            '<button type="button" id="btnselect" class="btn btn-danger btn-xs"> <i class="fa fa-close"></i></button> ' +
                            "</td>";
                        tbody += "</tr>";
                    });
                    $("#tblGroupMaster tbody").append(tbody);

                }

                if (Object.keys(data.ResultSet.Table).length) {
                    $('#ddlGroup').empty().append($('<option value="ALL">Select</option>'));
                    $.each(data.ResultSet.Table, function (key, val) {
                        $('#ddlGroup').append($('<option></option>').val(val.GroupId).html(val.GroupName)).select2();
                    });

                }
            }

        },
        error: function (response) {
            alert('Server Error...!');
        }
    });
}
function GetPackList() {
    var url = config.baseUrl + "/api/GeneralStore/MasterQueries";
    var objBO = {};
    objBO.prm_1 = $("#ddlItem option:selected").val();
    objBO.Logic = 'loadPackList';
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
                    $('#ddlpack').empty().append($('<option></option>').val('Select').html('Select')).select2();
                    $.each(data.ResultSet.Table, function (key, val) {
                        $("#ddlpack").append($("<option></option>").val(val.pack_type).html(val.pack_type));
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
function GetloadList() {
    var url = config.baseUrl + "/api/GeneralStore/MasterQueries";
    var objBO = {};
    objBO.prm_1 = $("#ddlItem option:selected").val();
    objBO.remark = $("#ddlfilter option:selected").val();
    objBO.Logic = 'GetPackWithItemList';
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        dataType: "json",
        async: false,
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            if (Object.keys(data.ResultSet).length) {
                if (Object.keys(data.ResultSet.Table1).length) {
                    $('#ddlItem').empty().append($('<option></option>').val('ALL').html('Select')).select2();
                    $.each(data.ResultSet.Table1, function (key, val) {
                        $("#ddlItem").append($("<option></option>").val(val.item_id).html(val.item_name));
                    });
                }
                if (Object.keys(data.ResultSet.Table2).length) {
                    $('#ddlObservation').empty().append($('<option></option>').val('Select').html('Select')).select2();
                    $.each(data.ResultSet.Table2, function (key, val) {
                        $("#ddlObservation").append($("<option></option>").val(val.ObsId).html(val.TestName));
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
function Getload() {
    var url = config.baseUrl + "/api/GeneralStore/MasterQueries";
    var objBO = {};
    objBO.prm_1 ='-';
    objBO.remark = '-';
    objBO.Logic = 'GetPackWithItemList';
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        dataType: "json",
        async: false,
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            if (Object.keys(data.ResultSet).length) {
                if (Object.keys(data.ResultSet.Table3).length) {
                    $('#ddlfilter').empty().append($('<option></option>').val('Select').html('Select')).select2();
                    $.each(data.ResultSet.Table3, function (key, val) {
                        $("#ddlfilter").append($("<option></option>").val(val.GrpName).html(val.GrpName));
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
function InsertGroupPackLink(logic) {
    if ($('#ddlpack option:selected').val() == 'Select') {
        alert('Please Select Pack Name');
        $('#ddlpack').focus();
        return
    }
    if ($('#ddlItem option:selected').val() == 'ALL') {
        alert('Please Select item Name');
        $('#ddlItem').focus();
        return
    }
    if ($('#ddlGroup option:selected').val() == 'ALL') {
        alert('Please Select Group Name');
        $('#ddlGroup').focus();
        return
    }
    if ($('#txttestcount').val() == '') {
        alert('Enter Test Performance');
        $('#txttestcount').focus();
        return
    }
    var url = config.baseUrl + "/api/GeneralStore/InsertGroupMaster";
    var objBO = {};
    objBO.Autoid = packlinkautoid;
    objBO.GroupId = $('#ddlGroup option:selected').val();
    objBO.GroupName = '-';
    objBO.prm1 = '-';
    objBO.prm2 = '-';
    objBO.TestPerfNos = $('#txttestcount').val();
    objBO.ItemId = $('#ddlItem option:selected').val();
    objBO.PackType = $('#ddlpack option:selected').text();
    objBO.login_id = Active.userid;
    objBO.Logic = logic;
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            if (data.includes('Success')) {
                alert(data);
                //$('#ddlpack').prop('selectedIndex', 'Select').change();
                //$('#ddlItem').prop('selectedIndex', 'Select').change();
                ////$('#ddlGroup').prop('selectedIndex', 'Select').change();
                //$('#txttestcount').val('');
                $('#btnGroupPackLink').val('Save');
                GetGroupPackLinkList();
            }
            else {
                alert(data);
            };
        },
        error: function (response) {
            alert('Server Error...!');
        }
    });
}
function GetGroupPackLinkList() {
    $("#tblGroupPackLink tbody").empty();
    var url = config.baseUrl + "/api/GeneralStore/MasterQueries";
    var objBO = {};
    objBO.prm_1 = $('#ddlGroup option:selected').val()
    objBO.Logic = 'GetPackLinkByGroupId';
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            console.log(data);
            if (data != '') {
                var tbody = ""; var temp = "";
                $.each(data.ResultSet.Table, function (key, val) {
                    if (temp != val.GroupName) {
                        tbody += "<tr style='background:#d9d9d9;'>";
                        tbody += "<td colspan='7' style='font-size:15px;padding: 5px;'><b>Group Name:" + val.GroupName + "</b></td>";
                        tbody += "</tr>";
                        temp = val.GroupName
                    }
                    tbody += "<tr>";
                    tbody += "<td hidden>" + val.autoid + "</td>";
                    tbody += "<td hidden>" + val.GroupId + "</td>";
                    tbody += "<td hidden>" + val.ItemId + "</td>";
                    //tbody += "<td>" + val.GroupName + "</td>";
                    tbody += "<td>" + val.item_name + "</td>";
                    tbody += "<td>" + val.PackType + "</td>";
                    tbody += "<td style='text-align:center'>" + val.TestPerfNos + "</td>";
                    tbody += "<td style='text-align:center'>" +
                        '<button type="button"  class="btn btn-warning btn-xs getpacklink"><i class="fa fa-edit"></i></button>' +
                        "</td>";
                    tbody += "<td style='text-align:center'>" +
                        '<button type="button" id="btndelete" class="btn btn-danger btn-xs"> <i class="fa fa-close"></i></button> ' +
                        "</td>";
                    tbody += "</tr>";
                });
                $("#tblGroupPackLink tbody").append(tbody);
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
function GroupPackLinkdeleteRow(Autoid,logicname) {
    var url = config.baseUrl + "/api/GeneralStore/InsertGroupMaster";
    var objBO = {};
    objBO.Autoid = Autoid
    objBO.GroupId = '-';
    objBO.GroupName = '-';
    objBO.prm1 = '-';
    objBO.prm2 = '-';
    objBO.TestPerfNos = '0';
    objBO.login_id = Active.userid;
    objBO.Logic = logicname;
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            if (data.includes('Success')) {
                if (logicname =='DeleteGroupPackLink') {
                    GetGroupPackLinkList();
                    alert(data);
                }
                else if (logicname == 'DeleteGroupObservationLink') {
                    GetGroupObservationLinkList()
                    alert(data);
                }
                else{
                    alert(data);
                }
            }
            else {
                alert(data);
            };
        },
        error: function (response) {
            alert('Server Error...!');
        }
    });
}
function InsertGroupObservationLink(logic) {
    if ($('#ddlGroup option:selected').val() == 'ALL') {
        alert('Please Select Group Name');
        $('#ddlGroup').focus();
        return
    }
    if ($('#ddlObservation option:selected').val() == 'Select') {
        alert('Please Select Observation Name');
        $('#ddlObservation').focus();
        return
    }
    if ($('#ddlfilter option:selected').val() == 'Select') {
        alert('Please Select Status Name');
        $('#ddlfilter').focus();
        return
    }
    var url = config.baseUrl + "/api/GeneralStore/InsertGroupMaster";
    var objBO = {};
    objBO.Autoid = '0';
    objBO.GroupId = $('#ddlGroup option:selected').val();
    objBO.GroupName = '-';
    objBO.prm1 = $('#ddlObservation option:selected').val();
    objBO.prm2 = $("#ddlfilter option:selected").val();
    objBO.TestPerfNos = '0';
    objBO.ItemId = '-';
    objBO.PackType = '-';
    objBO.login_id = Active.userid;
    objBO.Logic = logic;
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            if (data.includes('Success')) {
                alert(data);
                //$('#ddlpack').prop('selectedIndex', 'Select').change();
                //$('#ddlObservation').prop('selectedIndex', 'Select').change();
                $('#btnObservationLink').val('Save');
                GetGroupObservationLinkList();
            }
            else {
                alert(data);
            };
        },
        error: function (response) {
            alert('Server Error...!');
        }
    });
}
function GetGroupObservationLinkList() {
    $("#tblGroupObservationLink tbody").empty();
    var url = config.baseUrl + "/api/GeneralStore/MasterQueries";
    var objBO = {};
    objBO.prm_1 = $('#ddlGroup option:selected').val();
    objBO.Logic = 'GetObservationLinkByGroupId';
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            console.log(data);
            if (data != '') {
                var tbody = ""; var temp = "";
                $.each(data.ResultSet.Table, function (key, val) {
                    if (temp != val.GroupName) {
                        tbody += "<tr style='background:#d9d9d9;'>";
                        tbody += "<td colspan='3' style='font-size:15px;padding: 5px;'><b>Group Name:" + val.GroupName + "</b></td>";
                        tbody += "</tr>";
                        temp = val.GroupName
                    }
                    tbody += "<tr>";
                    tbody += "<td hidden>" + val.autoid + "</td>";
                    tbody += "<td>" + val.GrpName + "</td>";
                    tbody += "<td>" + val.Observation_Name + "</td>";
                    tbody += "<td style='text-align:center'>" +
                        '<button type="button" id="btndeleteObservation" class="btn btn-danger btn-xs"> <i class="fa fa-close"></i></button> ' +
                        "</td>";
                    tbody += "</tr>";
                });
                $("#tblGroupObservationLink tbody").append(tbody);
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