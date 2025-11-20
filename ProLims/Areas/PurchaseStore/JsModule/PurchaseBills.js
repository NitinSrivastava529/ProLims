$(document).ready(function () {
    FillCurrentDate('txtFrom');
    FillCurrentDate('txtTo');
    GetVendor();
    $('#tblPurchaseBills tbody').on('click', '.printInvoice', function () {
        purchId = $(this).closest('tr').find('td:eq(1)').text();
        PrintInvoice(purchId);
    });
    $('#tblPurchaseBills tbody').on('click', '.attach', function () {
        $("#modalUploadDocument").modal('show');
        selectRow($(this));
        purchId = $(this).closest('tr').find('td:eq(1)').text();
    });

    $('#tblPurchaseBills tbody').on('click', '#printGoodsReceiptNote', function () {
        purchId = $(this).closest('tr').find('td:eq(1)').text();
        PrintGoodsReceiptNote(purchId);
    });
});
function PrintGoodsReceiptNote(purchId) {
    var url = config.rootUrl + "/Print/PrintGoodsReceiptNote?purchId=" + purchId;
    window.open(url, '_blank');
}
function GetVendor() {
    var url = config.baseUrl + "/api/GeneralStore/PurchaseQueries";
    var objBO = {};
    objBO.Logic = 'GetVendorList';
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            if (data != '') {
                $('#ddlVendor').empty().append($('<option value="ALL">ALL</option>'));
                $.each(data.ResultSet.Table, function (key, val) {
                    $('#ddlVendor').append($('<option></option>').val(val.vendor_id).html(val.vendor_name)).select2();
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
function PurchaseBills() {
    $('#btnGet').append("<i class='fa fa-spinner fa-spin' style='font-size:20px;float:left'></i>");
    var url = config.baseUrl + "/api/GeneralStore/PurchaseQueries";
    var objBO = {};
    objBO.prm_1 = $('#ddlVendor option:selected').val();
    objBO.from = $('#txtFrom').val();
    objBO.to = $('#txtTo').val();
    objBO.Logic = 'PurchaseBills';
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            if (data != '') {
                console.log(data);
                $('#tblPurchaseBills tbody').empty();
                var tbody = "";
                var temp = "";
                $.each(data.ResultSet.Table, function (key, val) {
                    if (temp != val.vendor_name) {
                        tbody += "<tr style='background:#c9e8ff'>";
                        tbody += "<td colspan='16'>" + val.vendor_name + "</td>";
                        tbody += "</tr>";
                        temp = val.vendor_name
                    }
                    tbody += "<tr>";
                    tbody += "<td><span class='btn btn-success btn-xs printInvoice'><i class='fa fa-print'></i></span></td>";
                    tbody += "<td>" + val.Purch_id + "</td>";
                    tbody += "<td>" + val.Inv_No + "</td>";
                    tbody += "<td>" + val.inv_date + "</td>";
                    tbody += "<td>" + val.cr_date + "</td>";
                    tbody += "<td>" + val.inv_count + "</td>";
                    tbody += "<td>" + val.Inv_Total + "</td>";
                    tbody += "<td>" + val.Inv_Tax + "</td>";
                    tbody += "<td>" + val.inv_discount + "</td>";
                    tbody += "<td>" + val.netamount + "</td>";
                    tbody += "<td>" + val.cgst + "</td>";
                    tbody += "<td>" + val.sgst + "</td>";
                    tbody += "<td>" + val.igst + "</td>";
                    tbody += "<td>" + val.Pay_Mode + "</td>";
                    if (val.virtual_path == null) {
                        tbody += "<td><button class='btn-success btn-flat attach' style='padding: 5px;'>Attach</button></td>";
                    }
                    else {
                        tbody += "<td><a class='btn-success btn-xs' href='" + val.virtual_path + "' target='_blank' style='padding: 5px;'>View</a></td>";
                    }
                    tbody += "<td><span class='btn btn-warning btn-xs' id='printGoodsReceiptNote'><i class='fa fa-print'></i></span></span></td>";
                    tbody += "</tr>";
                });
                $('#tblPurchaseBills tbody').append(tbody);
                $('#btnGet i').remove();
            }
            else {
                alert("Error");
                $('#btnGet i').remove();
            };
        },
        error: function (response) {
            alert('Server Error...!');     
            $('#btnGet i').remove();
        }
    });
}
function Print() {
    prm1 = $('#ddlVendor option:selected').val();
    from = $('#txtFrom').val();
    to = $('#txtTo').val();
    var url = "PrintPurchaseBills?prm1=" + btoa(prm1) + "&from=" + btoa(from) + "&to=" + btoa(to);
    frame = '<iframe style="width:100%" id="frameInvoice" src=' + url + '>';
    window.open(url);
    //$('body').append(frame);
}
function PrintInvoice(purchId) {
    var url = config.rootUrl + "/Print/PrintInvoice?purchId=" + purchId;
    window.open(url, '_blank');
}
function IsValid(upload) {
    var files = $(upload).get(0).files;
    var data1 = files[0]['name'].split('.');
    var photo1 = data1[0] + '.' + data1[1];
    if (files.length > 0) {
        if ((files[0].type == 'image/jpeg') || (files[0].type == 'image/png') || (files[0].type == 'image/jpg') || (files[0].type == 'application/pdf') || (files[0].type.includes('video/x-matroska'))) {
            var size = parseInt((files[0].size) / 1024) / 1024;;
            if (size > 300000000) {
                $('input[type=file]').val('');
                alert('File Size should be less then 3 MB.');
                return false;
            }
        }
        else {
            $('input[type=file]').val('');
            alert('File is Not Valid.');
            return false;
        }
    }
    return true;
}
function UploadDocumentInfo() {
    if ($('input[id=txtNewAttachment]')[0].files.length > 0) {
        var url = config.baseUrl + "/api/GeneralStore/PurchaseUploadDocument";
        var purchId = $('#tblPurchaseBills tbody').find('tr.select-row').find('td:eq(1)').text();
        var obj = {};
        obj.HospitalId = Active.HospitalId;
        obj.TranId = purchId;
        obj.TrnType = "Purchase-GeneralStore";
        obj.ImageName = "";
        obj.ImageType = $('input[id=txtNewAttachment]')[0].files[0].type.split('/')[1];
        obj.login_id = Active.userId;
        var data = new FormData();
        data.append('obj', JSON.stringify(obj));
        data.append('ImageByte', $('input[id=txtNewAttachment]')[0].files[0]);
        UploadDocument(url, data);
    }
    else {
        alert('Please Choose Document..!');
    }
}
//Uploading Document
function UploadDocument(url, data) {
    $('#btnSave').append("<i class='fa fa-spinner fa-spin' style='font-size:20px;float:left'></i>");
    var UploadDocumentInfo = new XMLHttpRequest();
    UploadDocumentInfo.onreadystatechange = function () {
        if (UploadDocumentInfo.status) {
            if (UploadDocumentInfo.status == 200 && (UploadDocumentInfo.readyState == 4)) {
                var json = JSON.parse(UploadDocumentInfo.responseText);
                if (json.Message.includes('Success')) {
                    $('#btnSave i').remove();
                    alert('Successfully Uploading');

                    $('#modalUploadDocument input[id=txtNewAttachment]').val('');
                    $('#modalUploadDocument').modal('hide');
                    $('#UploadingStatus').text('');
                    $('#tblPurchaseBills tbody').find('tr.select-row').find('td:eq(14)').
                        html("<a class='btn-warning btn-flat attach' href='" + json.virtual_path + "' target='_blank'>View</a>");
                }
                else {
                    alert(json.Message);
                    $('#btnSave i').remove();
                }
            }
        }
    }
    UploadDocumentInfo.open('POST', url, true);
    UploadDocumentInfo.send(data);
}
function DownloadExcel(elem) {
    var url = config.baseUrl + "/api/GeneralStore/PurchaseQueries";
    var objBO = {};
    objBO.prm_1 = $('#ddlVendor option:selected').val();
    objBO.from = $('#txtFrom').val();
    objBO.to = $('#txtTo').val();
    objBO.OutPutType = "Excel";
    objBO.Logic = 'PurchaseBills';
    Global_DownloadExcel(url, objBO, "PurchaseBills.xlsx", elem);
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



