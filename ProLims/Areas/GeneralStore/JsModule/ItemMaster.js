
$(document).ready(function () {
    GetCategory();
    GetRecord();
    GetItemMasterList('Y');
    $('#btnSaveItem').on('click', function () {
        debugger
        var val = $(this).val();
        if (val == 'Submit') {
            InsertItemMaster('Insert');
        }
        else if (val == 'Update') {
            UpdateItemMaster('Update');
        }
        else if (val == 'Import') {
            InsertItemMaster('Import');
        }
    });
    $('#tblItem tbody').on('click', '.getItem', function () {
        $('#txtItemName').val($(this).data('item_name'));
        $('#txtRemark').val($(this).data('remark'));
        $('#txtRate').val($(this).data('rate'));
        $('#txttaxPerc').val($(this).data('taxdis'));
        $('#txtHSN').val($(this).data('hsn'));
        $('#txtROL').val($(this).data('rol'));
        $('#txtMOQ').val($(this).data('moq'));
        $('#txtOrderDays').val($(this).data('orderdays'));
        var Category = $(this).data('category');
        var groupid = $(this).data('groupid');
        //$('#ddlGroup').val(groupid).select2();
        $('#ddlCategory').val(Category).select2();
        $('span[data-item_id]').text($(this).data('item_id'));
        $('#btnSaveItem').val('Update').addClass('btn-warning');
        var mfdname = $(this).data('mfd_name');
        $('#ddlManufacture option').map(function () {
            if ($(this).val() == mfdname) {
                $('#ddlManufacture').val(mfdname).change()
            }
        });
        var itemid = $(this).data('item_id');
        var itemname = $(this).data('item_name');
        $('span[data-itemname]').text(itemname);
        $('span[data-itemid]').text(itemid);
        $('#tblItem tbody tr').find('td').removeAttr('style');
        $(this).closest('tr').find('td:eq(1),td:eq(2)').css({ 'background': '#c7e6ff', 'color': 'black' });
        GetPack();
        GetManf();
    });
    $('#btnLinkPack').on('click', function () {
        var pack = $('#ddlLinkPack option:selected').text();
        LinkPackManufacturerToItem(pack, '', 'PackLink');
    });
    $('#btnLinkManufacturer').on('click', function () {
        var mnf = $('#ddlLinkManufacturer option:selected').val();
        LinkPackManufacturerToItem('', mnf, 'ManufacturerLink');
    });
    $('#tblLinkPack tbody').on('click', '#btnDelete', function () {
        debugger
       // var packtype = $(this).data('packtype');
        var packtype = $(this).closest('tr').find('td:eq(0)').text();
        DeletePackManufacturerToItem(packtype, '', 'DeletePack')
    });
    $('#tblLinkManufacturer tbody').on('click', '#btnDelete', function () {
        var mnfId = $(this).data('mfdid');
        DeletePackManufacturerToItem('', mnfId, 'DeleteManufacturer')
    });
    $('#tblSearchItem tbody').on('click', 'button', function () {
        debugger
        var itemId = $(this).closest('tr').find('td:eq(1)').text();
        var itemName = $(this).closest('tr').find('td:eq(2)').text();
        var category = $(this).closest('tr').find('td:eq(3)').text();
        var hsn = $(this).closest('tr').find('td:eq(4)').text();
        var packType = $(this).closest('tr').find('td:eq(5)').text();
        var mfdId = $(this).closest('tr').find('td:eq(6)').text();
        var groupId = $(this).closest('tr').find('td:eq(8)').text();
        //$('#ddlGroup').val(groupId).change();
        $('#ddlCategory').val(category).change();
        $('#txtRemark').val('Imported From Pharmacy.');
        $('#txtExternalItemId').text(itemId);
        $('#txtItemName').val(itemName);
        $('#txtHSN').val(hsn);
        $('#modalItemSearch').modal('hide');
        $('#modalItemSearch input[type=text]').val('');
        $('#tblSearchItem tbody').empty();
        $('#btnSaveItem').val('Import');
    });
    $("#ddlLinkPack").on("change", function () {
        var packQty = $(this).find("option:selected").data("packqty") || '';
        $("#txtpackqty").val(packQty);
    });

    $('#txtSearchHSN').on('keyup', function (e) {
        var val = $(this).val().toLocaleLowerCase();
        $('#tblHSN tbody tr').filter(function () {
            $(this).toggle($(this).text().toLocaleLowerCase().indexOf(val) > -1);
        });
        //var HSNCode = $(this).val();
        //HSNSearchDetails(HSNCode);
        //var tbody = $('#tblHSN tbody');
        //var tr = $(tbody).find('tr.select-row');
        //if (e.keyCode == 40) {
        //    if (tr.length == 0) {
        //        $(tbody).removeClass('select-row');
        //        $(tbody).find('tr:first').addClass('select-row');
        //    }
        //    $(tbody).removeClass('select-row');
        //    $(tr).next().find('tr:eq(' + index + ')').addClass('select-row');
        //}
        //else if (e.keyCode == 38) {
        //    index--;
        //    $(tbody).removeClass('select-row');
        //    $(tbody).find('tr:eq(' + index + ')').addClass('select-row');
        //}
    });

    $('#tblHSN tbody').on('click', 'button', function () {
        debugger
        var HsnCode = $(this).closest('tr').find('td:eq(1)').text();
        $('#txtHSN').val(HsnCode);
        $('#modalHSNSearch').modal('hide');
        $('#modalHSNSearch input[type=text]').val('');
        $('#tblHSN tbody').empty();

    });

    HSNSearchDetails()
});

function HSNSearchDetails() {
    debugger
    var url = config.baseUrl + "/api/GeneralStore/MasterQueries";
    var objBO = {};
    objBO.prm_1 = '-';
    objBO.login_id = Active.userId;
    objBO.Logic = 'SearchHSNCode';
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        contentType: "application/json;charset=utf-8",
        dataType: "JSON",
        async: false,
        success: function (data) {
            $('#tblHSN tbody').empty();
            if (Object.keys(data.ResultSet).length > 0) {
                if (Object.keys(data.ResultSet.Table).length) {
                    var tbody = "";
                    $.each(data.ResultSet.Table, function (key, val) {
                        tbody += "<tr>";
                        tbody += "<td><button class='btn btn-success bn' style='height:25px'>Select</button></td>";
                        tbody += "<td>" + val.HSN + "</td>";
                        tbody += "<td>" + val.hsnDescription + "</td>";
                        tbody += "<td style='text-align:center'>" + val.cgst_rate.toFixed(2) + "</td>";
                        tbody += "<td style='text-align:center'>" + val.sgst_rate.toFixed(2) + "</td>";
                        tbody += "<td style='text-align:center'>" + val.igst_rate.toFixed(2) + "</td>";
                        tbody += "</tr>";

                    });
                    $('#tblHSN tbody').append(tbody);
                }
            }
            else {
                alert('No Record Found..');
            }
        },
        error: function (response) {
            alert('Server Error...!');
        }
    });
}
function Toggle(elem) {
    var itemid = $(elem).data('itemid');
    $(elem).toggleClass('on')
    UpdateStatus(itemid)
}
function GetCategory() {
    var url = config.baseUrl + "/api/GeneralStore/MasterQueries";
    var objBO = {};
    objBO.Logic = 'GetCategoryList1';
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
                    $('#ddlCategory').empty().append($('<option></option>').val('ALL').html('ALL')).select2();
                    $.each(data.ResultSet.Table, function (key, val) {
                        $("#ddlCategory").append($("<option></option>").val(val.CategoryId).html(val.CategoryName));
                    });
                }
            }
            //if (Object.keys(data.ResultSet).length) {
            //    if (Object.keys(data.ResultSet.Table1).length) {
            //        $('#ddlGroup').empty().append($('<option></option>').val('ALL').html('ALL')).select2();;
            //        $.each(data.ResultSet.Table1, function (key, val) {
            //            $("#ddlGroup").append($("<option></option>").val(val.GroupId).html(val.GroupName));
            //        });
            //    }
            //}
            else {
                alert("Error");
            };
        },
        error: function (response) {
            alert('Server Error...!');
        }
    });
}
function GetRecord() {
    var url = config.baseUrl + "/api/GeneralStore/MasterQueries";
    var objBO = {};
    objBO.Logic = 'All';
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            if (data != '') {
                $("#ddlLinkPack").empty().append($('<option>Select Pack</option>')).select2();
                $.each(data.ResultSet.Table2, function (key, val) {
                    $("#ddlLinkPack").append($("<option data-packqty=" + val.pack_qty + "></option>").val(val.autoid).html(val.pack_type));
                });
                $("#ddlLinkManufacturer").empty().append($('<option>Select Manufacturer</option>')).select2();
                $.each(data.ResultSet.Table1, function (key, val) {
                    $("#ddlLinkManufacturer").append($("<option data-mfdid=" + val.mfd_id + "></option>").val(val.mfd_id).html(val.mfd_name));
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
//Validation
function Validate() {
    var name = $('#txtItemName').val();
    var hsn = $('#txtHSN').val();
    var rol = $('#txtROL').val();
    var category = $('#ddlCategory option:selected').text();

    if (category == 'Select Category') {
        $('span.selection').find('span[aria-labelledby=select2-ddlCategory-container]').css('border-color', 'red').focus();
        alert('Please Select Category..');
        return false;
    }
    else {
        $('span.selection').find('span[aria-labelledby=select2-ddlCategory-container]').removeAttr('style');
    }
    if (name == '') {
        $('#txtItemName').css({ 'border-color': 'red' }).focus();
        alert('Please Provide Item Name..');
        return false;
    }
    else {
        $('#txtItemName').removeAttr('style');
    }
    if (hsn == '') {
        $('#txtHSN').css({ 'border-color': 'red' }).focus();
        alert('Please Provide HSN..');
        return false;
    }
    else {
        $('#txtHSN').removeAttr('style');
    }
    return true;
}
function InsertItemMaster(logic) {
    debugger
    if (Validate()) {
        var url = config.baseUrl + "/api/GeneralStore/InsertUpdateItemMaster";
        var objBO = {};
        objBO.hosp_id = Active.unitId;
        objBO.ItemId = $('#txtExternalItemId').text();
        objBO.hsn = $('#txtHSN').val();
        objBO.MfdId = $('#ddlManufacture option:selected').data('mfdid');
        objBO.purchase_flag = $('#ddlPurchaseFlag option:selected').val();
        objBO.GroupId = '-';
        objBO.ItemName = $('#txtItemName').val().toUpperCase();
        objBO.CategoryId = $('#ddlCategory option:selected').val();
        objBO.rol = $('#txtROL').val();
        objBO.MOQ = $('#txtMOQ').val();
        objBO.rate ='0';
        objBO.taxPerc = '0';
        objBO.ItemType = $('#txtOrderDays').val();
        objBO.Remark = $('#txtRemark').val();
        objBO.login_id = Active.userId;
        objBO.ShelfNo = '';
        objBO.Logic = logic;
        $.ajax({
            method: "POST",
            url: url,
            data: JSON.stringify(objBO),
            dataType: "json",
            contentType: "application/json;charset=utf-8",
            success: function (data) {
                if (data.includes('Success')) {
                    Clear();
                    alert(data);
                    GetItemMasterList('Y');
                    $('#ddlGroup').prop('selectedIndex', '0').change();
                    $('#ddlCategory').prop('selectedIndex', '0').change();
                    $('input[type=text]').val('');
                    $('#txtRemark').val('');
                    $('#txtExternalItemId').text('');
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
}
function GetItemMasterList(flag) {
    if (flag == 'Load') {
        $('#btnload').append("<i class='fa fa-spinner fa-spin' style='font-size:20px;float:left'></i>");
    }
    var url = config.baseUrl + "/api/GeneralStore/MasterQueries";
    var objBO = {};
    objBO.prm_1 = '-';
    objBO.Logic = 'GetItemMasterList';
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            console.log(data)
            if (data != '') {
                $('#tblItem tbody').empty();
                var tbody = "";
                var temp = "";
                $.each(data.ResultSet.Table, function (key, val) {
                    if (temp != val.CategoryName) {
                        tbody += "<tr style='background:#f3f3f3'>";
                        tbody += "<td colspan='5'>" + val.CategoryName + "</td>";
                        tbody += "</tr>";
                        temp = val.CategoryName;
                    }
                    tbody += "<tr>";
                    tbody += "<td>" +
                        '<category type="button" data-moq="' + val.MOQ + '" data-rol="' + val.rol + '" data-hsn="' + val.hsn + '" data-item_type="' + val.item_type + '"' +
                        ' data-item_id="' + val.item_id + '" data-item_name="' + val.item_name + '" data-category="' + val.category + '" data-groupid="' + val.KitGroupId + '"data-orderdays="' + val.vOrderDays + '" data-remark="' + val.remark + '"' +
                        ' data-rate="' + val.rate + '" data-taxdis="' + val.taxPerc + '"' +
                        ' class= "btn btn-warning btn-xs getItem"> <i class="fa fa-edit"></i></category> ' +
                        "</td>";
                    tbody += "<td>" + val.item_id + "</td>";
                    tbody += "<td>" + val.item_name + "</td>";
                    tbody += '<td class="text-center">' +
                         "<div data-init='mm' class='toggle mb-3 " + 
                           (val.status_flag === 'Y' ? 'on' : 'off') + 
                           "' data-itemid='" + val.item_id + "' data-flag='" + val.status_flag + "'  onclick='Toggle(this)'><span></span></div>" +
                        '</td>';
                    tbody += "</tr>";
                });
                $('#tblItem tbody').append(tbody);
                $('#btnload i').remove();
            }
            else {
                alert("Error");
                $('#btnload i').remove();
            };
        },
        error: function (response) {
            alert('Server Error...!');
            $('#btnload i').remove();
        }
    });
}
function UpdateStatus(itemid) {
    var url = config.baseUrl + "/api/GeneralStore/InsertUpdateItemMaster";
    var objBO = {};
    objBO.ItemId = itemid;
    objBO.StatusFlag = '-';
    objBO.login_id = Active.userId;
    objBO.Logic = 'UpdateStatus';
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            console.log(data);
            if (data == 'Successfully Saved') {
                GetItemMasterList('Y');
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
function GetPack() {
    var url = config.baseUrl + "/api/GeneralStore/MasterQueries";
    var objBO = {};
    objBO.prm_1 = $('span[data-itemid]').text();
    objBO.Logic = 'PackByItemId';
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            if (data != '') {
                $("#tblLinkPack tbody").empty();
                var tbody = "";
                $.each(data.ResultSet.Table, function (key, val) {
                    tbody += "<tr>";
                    tbody += "<td>" + val.pack_type + "</td>";
                    tbody += "<td style='text-align:center'>" + val.pack_qty + "</td>";
                    tbody += "<td><button id='btnDelete' data-packtype=" + val.pack_type + " class='btn-danger'>Delete</button></td>";
                    tbody += "</tr>";
                });
                $("#tblLinkPack tbody").append(tbody);
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
function GetManf() {
    var url = config.baseUrl + "/api/GeneralStore/MasterQueries";
    var objBO = {};
    objBO.prm_1 = $('span[data-itemid]').text();
    objBO.Logic = 'ManfByItemId';
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            if (data != '') {
                $("#tblLinkManufacturer tbody").empty();
                var tbody = "";
                $.each(data.ResultSet.Table, function (key, val) {
                    tbody += "<tr>";
                    tbody += "<td>" + val.mfd_name + "</td>";
                    tbody += "<td><button id='btnDelete' data-mfdid=" + val.mfd_id + " class='btn-danger'>Delete</button></td>";
                    tbody += "</tr>";
                });
                $("#tblLinkManufacturer tbody").append(tbody);
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
function LinkPackManufacturerToItem(pack, mfd, logic) {
    var url = config.baseUrl + "/api/GeneralStore/InsertLinkPackManufacturerToItem";
    var objBO = {};
    objBO.ItemId = $('span[data-itemid]').text();
    objBO.pack_type = pack;
    objBO.pack_qty = $("#txtpackqty").val();
    objBO.MfdId = mfd;
    objBO.login_id = Active.userId;
    objBO.Logic = logic;
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            if (data.includes('Success')) {
                if (logic == 'PackLink') {
                    GetPack();
                }
                else if (logic == 'ManufacturerLink') {
                    GetManf();
                }
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
function DeletePackManufacturerToItem(packtype, mfd, logic) {
    var url = config.baseUrl + "/api/GeneralStore/InsertLinkPackManufacturerToItem";
    var objBO = {};
    objBO.ItemId = $('span[data-itemid]').text();
    objBO.pack_type = packtype;
    objBO.MfdId = mfd;
    objBO.login_id = Active.userId;
    objBO.Logic = logic;
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            if (data.includes('Success')) {
                if (logic == 'DeletePack') {
                    GetPack();
                }
                else if (logic == 'DeleteManufacturer') {
                    GetManf();
                }
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
    $("#tblLinkPack tbody").empty();
    $("#tblLinkManufacturer tbody").empty();
    //$('#ddlGroup').prop('selectedIndex', '0').change();
    $('#ddlCategory').prop('selectedIndex', '0').change();
    $('#ddlMainCategory').prop('selectedIndex', '0').change();
    $('input[type=text]').val('');
    $('#txtRemark').val('');
    $('#txtExternalItemId').text('');
    $('#btnSaveItem').val('Submit').removeClass('btn-warning').addClass('btn-success');
    $('#ddlLinkPack').prop('selectedIndex', '0').change();
    $('#ddlLinkManufacturer').prop('selectedIndex', '0').change();
}
function ItemSearch() {
    if ($('#txtItemSearch').val().trim().length > 2) {
        var url = config.baseUrl + "/api/GeneralStore/MasterQueries";
        var objBO = {};
        objBO.prm_1 = $('#txtItemSearch').val();
        objBO.login_id = Active.userId;
        objBO.Logic = "ItemsForItemMaster";
        $.ajax({
            method: "POST",
            url: url,
            data: JSON.stringify(objBO),
            contentType: "application/json;charset=utf-8",
            dataType: "JSON",
            async: false,
            success: function (data) {
                $('#tblSearchItem tbody').empty();
                if (Object.keys(data.ResultSet).length > 0) {
                    if (Object.keys(data.ResultSet.Table).length) {
                        var tbody = "";
                        $.each(data.ResultSet.Table, function (key, val) {
                            tbody += "<tr>";
                            tbody += "<td style='width:1%'><button class='btn-success btn-flat'>Select</button></td>";
                            tbody += "<td>" + val.item_id + "</td>";
                            tbody += "<td>" + val.item_name + "</td>";
                            tbody += "<td>" + val.category + "</td>";
                            tbody += "<td>" + val.hsn + "</td>";
                            tbody += "<td>" + val.pack_type + "</td>";
                            tbody += "<td>" + val.mfd_id + "</td>";
                            tbody += "<td>" + val.mfd_name + "</td>";
                            tbody += "<td hidden>" + val.KitGroupId + "</td>";
                            tbody += "</tr>";
                        });
                        $('#tblSearchItem tbody').append(tbody);
                    }
                }
                else {
                    alert('No Record Found..');
                }
            },
            error: function (response) {
                alert('Server Error...!');
            }
        });
    }
}
function UpdateItemMaster() {
    if (Validate()) {
        var url = config.baseUrl + "/api/GeneralStore/InsertUpdateItemMaster";
        var objBO = {};
        objBO.hosp_id = Active.unitId;
        objBO.hsn = $('#txtHSN').val();
        objBO.MfdId = $('#ddlManufacture option:selected').data('mfdid');
        objBO.MfdName = $('#ddlManufacture option:selected').text();
        objBO.purchase_flag = $('#ddlPurchaseFlag option:selected').val();
        objBO.ItemType = $('#txtOrderDays').val();
        objBO.ItemId = $('span[data-item_id]').text();
        objBO.ItemName = $('#txtItemName').val().toUpperCase();
        objBO.CategoryId = $('#ddlCategory option:selected').val();
        objBO.GroupId = '-';
        objBO.rol = $('#txtROL').val();
        objBO.MOQ = $('#txtMOQ').val();
        objBO.rate = '0';
        objBO.taxPerc = '0';
        objBO.Remark = $('#txtRemark').val();
        objBO.login_id = Active.userId;
        objBO.ShelfNo = '';
        objBO.Logic = 'Update';
        $.ajax({
            method: "POST",
            url: url,
            data: JSON.stringify(objBO),
            dataType: "json",
            contentType: "application/json;charset=utf-8",
            success: function (data) {
                if (data.includes('Success')) {
                    Clear();
                    alert(data);
                    GetItemMasterList('Y');
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
}
function FilterCategory(mainCat, data) {
    var url = config.baseUrl + "/api/GeneralStore/MasterQueries";
    var objBO = {};
    objBO.MainCategory = mainCat;
    objBO.Logic = 'GetCategoryListByMainCat';
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        dataType: "json",
        async: false,
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            if (data != '') {
                $("#ddlCategory").empty().append($('<option>Select Category</option>'));
                $.each(data.ResultSet.Table, function (key, val) {
                    //    $("#ddlCategory").append($("<option data-category=" + val.CategoryId + "></option>").val(val.CategoryName).html(val.CategoryName));
                    $("#ddlCategory").append($("<option data-category=" + val.CategoryName + "></option>").val(val.CategoryName).html(val.CategoryName));
                });
            }
            else {
                alert("Error");
            };
        },
        complete: function (com) {
            $('#ddlCategory option').map(function () {
                if ($(this).data('category') == data) {
                    $('#ddlCategory').val($(this).val()).change()
                }
            });
        },
        error: function (response) {
            alert('Server Error...!');
        }
    });
}

