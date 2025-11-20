var Autoid = "0";
var packType = "";
var mfdname = "";
$(document).ready(function () {
    $('#ddlVender').empty().append($('<option></option>').val('ALL').html('Select')).select2();
    OnLoadList()
    GetItemList()
    $('#tblReport tbody').on('click', '.btnsave', function () {
        var $tr = $(this).closest('tr');
        var Autoid = $tr.find('td:eq(0)').text().trim();
        var Packtype = $tr.find('td:eq(1)').text().trim();
        var rate = $tr.find('td:eq(2) input.txtrate').val();
        var VendorId = $tr.find('td:eq(3) select.ddlVender').val();
        if (typeof VendorId === 'undefined') {
            VendorId = $tr.find('td:eq(3) select').data('vendorid') || '';
        }
        var mfdname = $tr.find('td:eq(4) select.ddlManufacturer').val();
        if (typeof mfdname === 'undefined') {
            mfdname = $tr.find('td:eq(4) select').data('mfdid') || $tr.find('td:eq(4)').text().trim();
        }
        var logicName = 'Insert';
        InsertBestRate(Autoid, Packtype, rate, VendorId, mfdname, logicName);
    });
    $('#tblReport tbody').on('click', '#btnUpdate', function () {
        var $tr = $(this).closest('tr');
        var Autoid = $tr.find('td:eq(0)').text().trim();
        var rate = $tr.find('td:eq(2) input.txtrate').val();
        var VendorId = $tr.find('td:eq(3) select.ddlVender').val();
        if (typeof VendorId === 'undefined') {
            VendorId = $tr.find('td:eq(3) select').data('vendorid') || '';
        }
        var logicName = 'Update';
        UpdateBestRate(Autoid, rate, VendorId, logicName);
    });
});
function OnLoadList() {
    var url = config.baseUrl + "/api/GeneralStore/MasterQueries";
    var objBO = {};
    objBO.Logic = 'OnLoadVenderAndItemList';
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
                    $('#ddlCategory').empty().append($('<option></option>').val('ALL').html('Select')).select2();
                    $.each(data.ResultSet.Table1, function (key, val) {
                        $("#ddlCategory").append($("<option></option>").val(val.CategoryId).html(val.CategoryName));
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
function GetItemList() {
    $('#ddlItem').empty().append($('<option></option>').val('ALL').html('Select')).select2();
    var url = config.baseUrl + "/api/GeneralStore/MasterQueries";
    var objBO = {};
    objBO.prm_1 = $("#ddlCategory option:selected").val();
    objBO.Logic = 'CategoryWiseItemeList';
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            if (Object.keys(data.ResultSet).length) {
                if (Object.keys(data.ResultSet.Table).length) {
                    $('#ddlItem').empty().append($('<option></option>').val('ALL').html('Select')).select2();
                    $.each(data.ResultSet.Table, function (key, val) {
                        $("#ddlItem").append($("<option></option>").val(val.item_id).html(val.item_name));
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
function GetItemsWisePackList() {
    var VenderName = []; var mfdName = [];
    $("#tblReport tbody").empty();
    $("#tblReportInfo tbody").empty();
    $('.ddlManufacturer').empty().append($('<option></option>').val('ALL').html('Select')).select2();
    $('.ddlVender').empty().append($('<option></option>').val('ALL').html('Select')).select2();
    var url = config.baseUrl + "/api/GeneralStore/MasterQueries";
    var objBO = {};
    objBO.item_name = $("#ddlItem option:selected").val();
    objBO.Logic = 'ItemWisePackAndManufacturerList';
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            var tbody = ""; var tbody1 = "";
            if (Object.keys(data.ResultSet).length) {
                if (Object.keys(data.ResultSet.Table1).length) {
                    $.each(data.ResultSet.Table1, function (key, val) {
                        mfdName.push(val.mfd_id);
                        VenderName.push(val.VendorId);
                        tbody += "<tr>";
                        tbody += "<td hidden>" + val.auto_id + "</td>";
                        tbody += "<td>" + val.pack_type + "</td>";
                        tbody += "<td><input type='text' class='form-control txtrate' value='" + val.BestRate + "'></td>";
                        tbody += "<td><select class='form-control ddlVender' data-vendorid='" + val.VendorId + "'></select></td>";
                        tbody += "<td><select class='form-control ddlManufacturer' data-mfdid='" + val.mfd_id + "'></select></td>";
                        if (val.IsActive === 'Y') {
                            tbody += "<td style='text-align:center'><button type='button' class='btn btn-warning' style='padding: 1px 5px;' id='btnUpdate'>Update</button></td>";
                            tbody += "<td style='text-align:center'><button type='button' data-autoid='" + val.auto_id + "'  class='btn btn-danger btndelete' onclick='UpdateStatus(this)' style='padding: 1px 5px;'><i class='fa fa-close'></i></button></td>";

                        } else {
                            tbody += "<td style='text-align:center'><button type='button' class='btn btn-success btnsave' style='padding: 1px 5px;'>Save</button></td>";
                            tbody += "<td style='text-align:center'>-</td>";
                        }
                        tbody += "</tr>";
                    });
                    $("#tblReport tbody").append(tbody);

                }

                // Fill Manufacturer dropdowns
                if (Object.keys(data.ResultSet.Table).length) {
                    $(".ddlManufacturer").each(function () {
                        $(this).empty().append($('<option></option>').val('ALL').html('Select')).select2();
                        $.each(data.ResultSet.Table, function (key, val) {
                            $(this).append($("<option></option>").val(val.mfd_id).html(val.mfd_name));
                        }.bind(this));
                    });
                }

                // Fill Vendor dropdowns
                if (Object.keys(data.ResultSet.Table2).length) {
                    $(".ddlVender").each(function () {
                        $(this).empty().append($('<option></option>').val('ALL').html('Select')).select2();
                        $.each(data.ResultSet.Table2, function (key, val) {
                            $(this).append($("<option></option>").val(val.PartnerId).html(val.PartnerName));
                        }.bind(this));
                    });
                }

                if (Object.keys(data.ResultSet.Table3).length) {
                    $.each(data.ResultSet.Table3, function (key, val) {
                        tbody1 += "<tr>";
                        tbody1 += "<td hidden>" + val.auto_id + "</td>";
                        tbody1 += "<td>" + val.PackType + "</td>";
                        tbody1 += "<td>" + val.BestRate + "</td>";
                        tbody1 += "<td>" + val.VenderName + "</td>";
                        tbody1 += "<td>" + val.item_name + "</td>";
                        tbody1 += "<td>" + val.mfd_name + "</td>";
                        tbody1 += "<td style='text-align:center'><button type='button' data-autoid='" + val.auto_id + "'  class='btn btn-danger btndelete' onclick='UpdateStatus(this)' style='padding: 1px 5px;'><i class='fa fa-close'></i></button></td>";
                        tbody1 += "</tr>";
                    });
                    $("#tblReportInfo tbody").append(tbody1);

                }

            }
            else {
                alert("Error");
            };
        },
        complete: function (response) {
            $('.ddlVender').each(function () {
                var venderId = $(this).data('vendorid');
                if (VenderName.includes(venderId)) {
                    $(this).val(venderId).change();
                }
            });

            $('.ddlManufacturer').each(function () {
                var mfdid = $(this).data('mfdid');
                if (mfdName.includes(mfdid)) {
                    $(this).val(mfdid).change();
                }
            });
        },
        error: function (response) {
            alert('Server Error...!');
        }
    });
}
function InsertBestRate(Autoid, Packtype, rate, VendorId, mfdname, logicName) {
    var url = config.baseUrl + "/api/GeneralStore/InsertBestRateMaster";
    var objBO = {};
    objBO.autoid = Autoid;
    objBO.CompId = Active.compId;
    objBO.UnitId = Active.unitId;
    objBO.VendorId = VendorId;
    objBO.ItemId = $('#ddlItem option:selected').val();
    objBO.pack_type = Packtype;
    objBO.mfd_id = mfdname;
    objBO.BestRate = rate;
    objBO.login_id = Active.userId;
    objBO.Logic = logicName;
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            if (data == 'Successfully Saved') {
                alert(data);
                GetItemsWisePackList();
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
function UpdateStatus(elem) {
    var Autoid = $(elem).data('autoid');
    var url = config.baseUrl + "/api/GeneralStore/InsertBestRateMaster";
    var objBO = {};
    objBO.autoid = Autoid;
    objBO.VendorId = '-';
    objBO.ItemId = '-';
    objBO.pack_type = '-';
    objBO.mfd_id = '-';
    objBO.BestRate = '-';
    objBO.CompId = Active.compId;
    objBO.UnitId = Active.unitId;
    objBO.login_id = Active.userId;
    objBO.Logic = 'UpdateStatus';
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            if (data == 'Successfully Saved') {
                GetItemsWisePackList();
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
function Clear() {
    $('#ddlCategory').prop('selectedIndex', '0').change();
    $('#ddlManufacturer').prop('selectedIndex', '0').change();
    $('#ddlItem').prop('selectedIndex', '0').change();
    $('#ddlVender').prop('selectedIndex', '0').change();
    $('#txtbestRate').val('');
}
function DownloadExcel(elem) {
    var url = config.baseUrl + "/api/GeneralStore/MasterQueries";
    var objBO = {};
    objBO.OutPutType = "Excel";
    objBO.item_name = $("#ddlItem option:selected").val();
    objBO.Logic = 'GetBestRateListExcel';
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
function UpdateBestRate(Autoid, rate, VendorId, logicName) {
    var url = config.baseUrl + "/api/GeneralStore/InsertBestRateMaster";
    var objBO = {};
    objBO.autoid = Autoid;
    objBO.VendorId = VendorId;
    objBO.ItemId = '-';
    objBO.pack_type = '-';
    objBO.mfd_id = '-';
    objBO.BestRate = rate;
    objBO.login_id = Active.userId;
    objBO.CompId = Active.compId;
    objBO.UnitId = Active.unitId;
    objBO.Logic = logicName;
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            if (data == 'Successfully Saved') {
                alert(data);
                GetItemsWisePackList();
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