$(document).ready(function () {
    GetHSNList();
    $('#txtSearch').on('keyup', function () {
        var val = $(this).val().toLocaleLowerCase();
        $('#tblPack tbody tr').filter(function () {
            $(this).toggle($(this).text().toLocaleLowerCase().indexOf(val) > -1);
        });
    });
    $('#tblPack tbody').on('click', '#btndelete', function () {
        var HSNCode = $(this).closest('tr').find('td:eq(0)').text();
        UpdateStatus(HSNCode);
    });
});
function GetHSNList() {
    $('#tblPack tbody').empty();
    var url = config.baseUrl + "/api/GeneralStore/MasterQueries";
    var objBO = {};
    objBO.Logic = 'GetHSNList';
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            var tbody = "";
            if (data != '') {
                $.each(data.ResultSet.Table, function (key, val) {
                    tbody += "<tr>";
                    tbody += "<td>" + val.HSN + "</td>";
                    tbody += "<td>" + val.hsnDescription + "</td>";
                    tbody += "<td style='text-align:center'>" + val.cgst_rate.toFixed(2)  + "</td>";
                    tbody += "<td style='text-align:center'>" + val.sgst_rate.toFixed(2)  + "</td>";
                    tbody += "<td style='text-align:center'>" + val.igst_rate.toFixed(2) + "</td>";
                    tbody += "<td style='text-align:center'>" +
                        '<button type="button" id="btndelete" class="btn-danger"> <i class="fa fa-close"></i></button> ' +
                        "</td>";
                    tbody += "</tr>";
                });
                $("#tblPack tbody").append(tbody);
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
function InsertHSN() {
    if ($('#txtHSN').val() == '') {
        alert('Enter HSN Code');
        return
    }
    if ($('#txtdescription').val() == '') {
        alert('Enter HSN Description');
        return
    }
    var url = config.baseUrl + "/api/GeneralStore/InsertHSNMaster";
    var objBO = {};
    objBO.CompId = Active.compId;
    objBO.HSNCode = $('#txtHSN').val();
    objBO.HSNRemark = $('#txtdescription').val();
    objBO.Cgst_rate = $('#txtCgst').val();
    objBO.Sgst_rate = $('#txtSgst').val();
    objBO.Igst_rate = $('#txtIgst').val();
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
                alert(data);
                clear();
                GetHSNList();
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
function onCgstSgstChange() {
    var cgst = parseFloat($("#txtCgst").val()) || 0;
    var sgst = parseFloat($("#txtSgst").val()) || 0;
    var igst = parseFloat($("#txtIgst").val()) || 0;

    if (cgst > 0) {
        $("#txtSgst").val(cgst)
        $("#txtIgst").val(0);
    }
    else if (sgst>0) {
        $("#txtCgst").val(sgst)
        $("#txtIgst").val(0);
    }
    else if (igst > 0) {
        $("#txtCgst").val(0);
        $("#txtSgst").val(0);
    }
   
}
function clear() {
   $('#txtHSN').val('');
   $('#txtdescription').val('');
   $('#txtCgst').val('');
   $('#txtSgst').val('');
   $('#txtIgst').val('');
}
function UpdateStatus(HSNCode) {
    var url = config.baseUrl + "/api/GeneralStore/InsertHSNMaster";
    var objBO = {};
    objBO.HSNCode = HSNCode;
    objBO.CompId = Active.compId;
    objBO.Logic = 'UpdateStatus';
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            if (data == 'Successfully Delete')
            {
                GetHSNList();
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
