var autidd = "";
var catid = "";
$(document).ready(function () {
    GetMainCategory();
    GetCategoryList();
    $('#txtSearch').on('keyup', function () {
        var val = $(this).val().toLocaleLowerCase();
        $('#tblCategory tbody tr').filter(function () {
            $(this).toggle($(this).text().toLocaleLowerCase().indexOf(val) > -1);
        });
    });
    $('#tblCategory tbody').on('click', '#btnEdit', function () {
        autidd = $(this).closest('tr').find('td:eq(1)').text();
        var maincat = $(this).closest('tr').find('td:eq(2)').text();
        catid = $(this).closest('tr').find('td:eq(3)').text();
        var catname = $(this).closest('tr').find('td:eq(4)').text();
        $('#ddlMainCategory option').each(function () {
            if ($(this).text() == maincat) {
                $('#ddlMainCategory').prop('selectedIndex', '' + $(this).index() + '').change();
            }
        });
        $('#txtCatName').val(catname);
        $('#btnSaveCategory').val('Update').addClass('btn-warning');
        selectRow($(this));
    });
    $('#tblCategory tbody').on('click', '#btndelete', function () {
        var autoid = $(this).closest('tr').find('td:eq(1)').text();
        var catid = $(this).closest('tr').find('td:eq(3)').text();
        UpdateStatus(autoid, catid);
    });
    $('#btnSaveCategory').on('click', function () {
        var val = $(this).val();
        if (val == 'Submit') {
            InsertCategory();
        }
        else if (val == 'Update') {
            UpdateCategory();
        }
    });
});
function GetCategoryList() {
    $('#tblCategory tbody').empty();
    var url = config.baseUrl + "/api/GeneralStore/MasterQueries";
    var objBO = {};
    objBO.Logic = 'GetCategoryList';
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            var tbody = ""; var temp = "";
           if (data != '') {
                $.each(data.ResultSet.Table, function (key, val) {
                    if (temp != val.MainCategory) {
                        tbody += "<tr style='background:#d9d9d9;'>";
                        tbody += "<td colspan='3' style='font-size:15px;padding: 5px;'><b>Group Name:" + val.MainCategory + "</b></td>";
                        tbody += "</tr>";
                        temp = val.MainCategory
                    }
                    tbody += "<tr>";
                    tbody += "<td style='text-align:center'>" +
                        '<button type="button" id="btnEdit" class="btn-warning"> <i class="fa fa-edit"></i></button> ' +
                        "</td>";
                    tbody += "<td hidden>" + val.autoid + "</td>";
                    tbody += "<td hidden>" + val.MainCategory + "</td>";
                    tbody += "<td hidden>" + val.CategoryId + "</td>";
                    tbody += "<td>" + val.CategoryName + "</td>";
                    tbody += "<td style='text-align:center'>" +
                        '<button type="button" id="btndelete" class="btn-danger"> <i class="fa fa-close"></i></button> ' +
                        "</td>";

                    tbody += "</tr>";
                    tbody += "</tr>";
                });
                $("#tblCategory tbody").append(tbody);
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
function InsertCategory() {
    if (Validate()) {
        var url = config.baseUrl + "/api/GeneralStore/InsertUpdateCategory";
        var objBO = {};
        objBO.hosp_id = Active.compId;
        objBO.MainCategory = $('#ddlMainCategory option:selected').text();
        objBO.CategoryName = $('#txtCatName').val();
        objBO.login_id = Active.userId;
        objBO.Logic = 'Insert';
        $.ajax({
            method: "POST",
            url: url,
            data: JSON.stringify(objBO),
            dataType: "json",
            contentType: "application/json;charset=utf-8",
            success: function (data) {
                if (data == 'Successfully Saved') {
                    Clear();
                    alert(data);
                    GetCategoryList();
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
function UpdateCategory() {
    if (Validate()) {
        var url = config.baseUrl + "/api/GeneralStore/InsertUpdateCategory";
        var objBO = {};
        objBO.hosp_id = Active.compId;
        objBO.Prm1 = autidd;
        objBO.MainCategory = $('#ddlMainCategory option:selected').text();
        objBO.CategoryId = catid;
        objBO.CategoryName = $('#txtCatName').val().toUpperCase();
        objBO.login_id = Active.userId;
        objBO.Logic = 'Update';
        $.ajax({
            method: "POST",
            url: url,
            data: JSON.stringify(objBO),
            dataType: "json",
            contentType: "application/json;charset=utf-8",
            success: function (data) {
                console.log(data);
                if (data == 'Successfully Saved') {
                    Clear();
                    alert(data);
                    GetCategoryList();
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
function UpdateStatus(autoid, catid) {
    var url = config.baseUrl + "/api/GeneralStore/InsertUpdateCategory";
    var objBO = {};
    objBO.CategoryId = catid;
    objBO.Prm1 = autoid;
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
                GetCategoryList();
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

//Validation
function Validate() {
    var name = $('#txtCatName').val();
    var MainCategory = $('#ddlMainCategory option:selected').text();

    if (MainCategory == 'Select') {
        $('span.selection').find('span[aria-labelledby=select2-ddlMainCategory-container]').css('border-color', 'red').focus();
        alert('Please Select Main Category..');
        return false;
    }
    else {
        $('span.selection').find('span[aria-labelledby=select2-ddlMainCategory-container]').removeAttr('style').focus();
    }
    if (name == '') {
        $('#txtCatName').css('border-color', 'red').focus();
        alert('Please Provide Category Name..');
        return false;
    }
    else {
        $('#txtCatName').removeAttr('style').focus();
    }
    return true;
}
function Clear() {
    $('input[type=text]').val('');
    $('select').prop('selectedIndex', '0').change();
    $('#btnSaveCategory').val('Submit').removeClass('btn-warning').addClass('btn-success');
}

function GetMainCategory() {
    var url = config.baseUrl + "/api/GeneralStore/MasterQueries";
    var objBO = {};
    objBO.Logic = 'GetMainCategoryList';
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
                    $('#ddlMainCategory').empty().append($('<option></option>').val('Select').html('Select')).select2();
                    $.each(data.ResultSet.Table, function (key, val) {
                        $("#ddlMainCategory").append($("<option></option>").val(val.MainCategory).html(val.MainCategory));
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