var _PONo = "";
var _vendorId = "";
$(document).ready(function () {
    FillCurrentDate('txtInvDate')
    FillCurrentDate('txteWayBillDate')
});

function POList() {
    $('#tblVendorInfo tbody').empty();
    $('#tblPOInfo tbody').empty();
    var url = config.baseUrl + "/api/Indent/GS_PurchaseOrderQueries";
    var objBO = {};
    objBO.CompId = Active.compId;
    objBO.UnitId = Active.unitId;
    objBO.indent_no = '-';
    objBO.ItemId = '-';
    objBO.From = '1900/01/01';
    objBO.To = '1900/01/01';
    objBO.Prm1 = '-';
    objBO.LoginId = Active.userId;
    objBO.Logic = "GRNByPO:POList";
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        contentType: "application/json;charset=utf-8",
        dataType: "JSON",
        success: function (data) {
            var tbody = "";
            if (Object.keys(data.ResultSet).length > 0) {
                if (Object.keys(data.ResultSet.Table).length > 0) {
                    $.each(data.ResultSet.Table, function (key, val) {
                        tbody += '<tr>';
                        tbody += '<td>' + val.POType + '</td>';
                        tbody += '<td>' + val.po_no + '</td>';
                        tbody += '<td>' + val.po_date + '</td>';
                        tbody += '<td><button id="btnSelect" style="margin-left:5px;" onclick=selectRow(this);VendorByPO("' + val.po_no + '") class="btn btn-primary btn-sm"><i class="fa fa-sign-in"></i></button></td>';
                        tbody += '</tr>';
                    });
                    $("#tblPOInfo tbody").append(tbody);
                }
            }
            $('#modalPO').modal('show')
        },
        error: function (response) {
            alert('Server Error...!');
        }
    });
}
function VendorByPO(poNo) {
    _PONo = poNo;
    $('#tblVendorInfo tbody').empty();
    var url = config.baseUrl + "/api/Indent/GS_PurchaseOrderQueries";
    var objBO = {};
    objBO.CompId = Active.compId;
    objBO.UnitId = Active.unitId;
    objBO.indent_no = '-';
    objBO.ItemId = '-';
    objBO.From = '1900/01/01';
    objBO.To = '1900/01/01';
    objBO.Prm1 = poNo;
    objBO.LoginId = Active.userId;
    objBO.Logic = "GRNByPO:VendorByPO";
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        contentType: "application/json;charset=utf-8",
        dataType: "JSON",
        success: function (data) {
            var tbody = "";
            if (Object.keys(data.ResultSet).length > 0) {
                if (Object.keys(data.ResultSet.Table).length > 0) {
                    $.each(data.ResultSet.Table, function (key, val) {
                        tbody += '<tr>';
                        tbody += '<td class="hide">' + val.VendorId + '</td>';
                        tbody += '<td>' + val.vendor_name + '</td>';
                        tbody += '<td><button id="btnSelect" style="margin-left:5px;" onclick=selectRow(this);ItemInfo(this) class="btn btn-primary btn-sm"><i class="fa fa-sign-in"></i></button></td>';
                        tbody += '</tr>';
                    });
                    $("#tblVendorInfo tbody").append(tbody);
                }
            }
            $('#modalPO').modal('show')
        },
        error: function (response) {
            alert('Server Error...!');
        }
    });
}
function ItemInfo(elem) {
    _vendorId = $(elem).closest('tr').find('td:first').text();
    var vendor = "<b>PO No. : </b>" + _PONo + ", <b>Vendor : </b>" + $(elem).closest('tr').find('td:eq(1)').text().substring(0, 46);
    $('.poInfo').html(vendor);
    $('#ddlGRNVendorName').val($(elem).closest('tr').find('td:eq(1)').text().substring(0, 46));
    $('#ddlPendingGRNNo').empty().append($('<option></option>').val('New').html('New'));
    $('#modalPO').modal('hide')
    $('#tblItemInfo tbody').empty();
    var url = config.baseUrl + "/api/Indent/GS_PurchaseOrderQueries";
    var objBO = {};
    objBO.CompId = Active.compId;
    objBO.UnitId = Active.unitId;
    objBO.From = '1900/01/01';
    objBO.To = '1900/01/01';
    objBO.VendorId = _vendorId;
    objBO.GrnNo = $('#ddlPendingGRNNo option:selected').text();
    objBO.PONo = _PONo;
    objBO.indent_no = '-';
    objBO.LoginId = Active.userId;
    objBO.Logic = 'GRNByPO:ItemInfo';
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        contentType: "application/json;charset=utf-8",
        dataType: "JSON",
        success: function (data) {
            var tbody = "";
            var count = 0;
            if (Object.keys(data.ResultSet).length > 0) {
                if (Object.keys(data.ResultSet.Table).length > 0) {
                    $.each(data.ResultSet.Table, function (key, val) {
                        //if (temp != val.VendorName) {
                        //    tbody += '<tr style="background:#c1e0ff">';
                        //    tbody += '<td colspan="10"><b>Last Vendor : </b>' + val.VendorName + "</td>";
                        //    tbody += '</tr>';
                        //    temp = val.VendorName
                        //}
                        tbody += '<tr data-id=' + val.AutoId + '>';
                        tbody += '<td class="hide">' + JSON.stringify(data.ResultSet.Table[count]) + '</td>';
                        tbody += '<td><input type="checkbox"/></td>';
                        var size = (val.item_name.length > 33) ? '10px !important' : '12px !important';
                        tbody += '<td style="font-size:' + size + '">' + val.item_name + '</td>';
                        tbody += '<td>' + val.mfd_name + '</td>';
                        tbody += '<td>' + val.hsn + '</td>';
                        tbody += '<td>' + val.batchNo + '</td>';
                        tbody += '<td>' + val.exp_date + '</td>';
                        tbody += '<td>' + val.Pack_type + '</td>';
                        tbody += '<td>' + val.pack_qty + '</td>';
                        tbody += '<td>' + val.mrp + '</td>';
                        tbody += '<td>' + val.trade + '</td>';
                        tbody += '<td>' + val.PO_Qty + '</td>';
                        tbody += '<td>' + val.tax_rate + '</td>';
                        tbody += '<td>' + val.amount + '</td>';
                        tbody += '<td><button id="btnSelect" style="margin-left:5px;" onclick=selectRow(this);selectItem(this); class="btn btn-primary btn-sm"><i class="fa fa-sign-in"></i></button></td>';
                        tbody += '</tr>';
                        count++;
                    });
                    $("#tblItemInfo tbody").append(tbody);
                }
            }
            if (Object.keys(data.ResultSet).length > 0) {
                if (Object.keys(data.ResultSet.Table1).length > 0) {
                    $.each(data.ResultSet.Table1, function (key, val) {
                        $('#ddlPendingGRNNo').append($('<option></option>').val(val.GRNNo).html(val.GRNNo));
                    });
                }
            }
        },
        error: function (response) {
            alert('Server Error...!');
        }
    });
}
function selectItem(elem) {
    var val = JSON.parse($(elem).closest('tr').find('td:eq(0)').text());
    $('#txtCorrBatch').val(val.batchNo);
    $('#txtCorrExpDate').val(val.exp_date);
    $('#txtCorrPQty').val(val.PO_Qty);
    $('#txtCorrMRP').val(val.mrp);
    $('#txtCorrTrade').val(val.trade);
    $('#txtCorrBatch').data('id', val.AutoId);
    ItemLinkInfo(val.item_id, val.mfd_id, val.Pack_type)
}
function ItemLinkInfo(itemId, mfdId, ptype) {
    $('#ddlCorrManufacturer').empty().append($('<option></option>').val('Select').html('Select'));
    $('#ddlCorrPackType').empty().append($('<option></option>').val('Select').html('Select'));
    var url = config.baseUrl + "/api/Indent/GS_PurchaseOrderQueries";
    var objBO = {};
    objBO.CompId = Active.compId;
    objBO.UnitId = Active.unitId;
    objBO.indent_no = '-';
    objBO.ItemId = itemId;
    objBO.From = '1900/01/01';
    objBO.To = '1900/01/01';
    objBO.Prm1 = '-';
    objBO.LoginId = Active.userId;
    objBO.Logic = "GRNByPO:ItemLinkInfo";
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        contentType: "application/json;charset=utf-8",
        dataType: "JSON",
        success: function (data) {
            if (Object.keys(data.ResultSet).length > 0) {
                if (Object.keys(data.ResultSet.Table).length > 0) {
                    $.each(data.ResultSet.Table, function (key, val) {
                        $('#ddlCorrManufacturer').append($('<option></option>').val(val.mfd_id).html(val.mfd_name));
                    });
                }
            }
            if (Object.keys(data.ResultSet).length > 0) {
                if (Object.keys(data.ResultSet.Table1).length > 0) {
                    $.each(data.ResultSet.Table1, function (key, val) {
                        $('#ddlCorrPackType').append($('<option></option>').val(val.pack_type).html(val.pack_type));
                    });
                }
            }
        },
        complete: function () {
            $('#ddlCorrManufacturer').val(mfdId).change();
            $('#ddlCorrPackType').val(ptype).change();
        },
        error: function (response) {
            alert('Server Error...!');
        }
    });
}
function Proceed(logic) {
    if ($('#ddlPendingGRNNo option:selected').text() == 'New') {
        if ($("#tblItemInfo tbody").find('input:checkbox:checked').length == 0) {
            alert('Select Item First')
            return
        }
    }
    if (_PONo == '') {
        alert('PO No. Not Selected.')
        return
    }
    if (_vendorId == '') {
        alert('Vendor Not Selected.')
        return
    }
    $('#ddlOtherCharges').empty().append($('<option></option>').val('Select').html('Select'));
    $("#tblGRNItemInfo tbody").empty();
    var url = config.baseUrl + "/api/Indent/GS_PurchaseOrderQueries";
    var objBO = {};
    objBO.CompId = Active.compId;
    objBO.UnitId = Active.unitId;
    objBO.indent_no = '-';
    objBO.PONo = _PONo;
    objBO.GrnNo = $('#ddlPendingGRNNo option:selected').text();
    objBO.VendorId = _vendorId;
    objBO.ItemId = '-';
    objBO.From = '1900/01/01';
    objBO.To = '1900/01/01';
    objBO.Prm1 = [...$("#tblItemInfo tbody").find('input:checkbox:checked').map((k, v) => $(v).closest('tr').data('id'))].join();
    objBO.LoginId = Active.userId;
    objBO.Logic = "GRNByPO:ItemById";
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        contentType: "application/json;charset=utf-8",
        dataType: "JSON",
        success: function (data) {
            if (Object.keys(data.ResultSet).length > 0) {
                if (Object.keys(data.ResultSet.Table).length > 0) {
                    var tbody = "";
                    var count = 0;
                    $.each(data.ResultSet.Table, function (key, val) {
                        tbody += '<tr>';
                        tbody += '<td class="hide">' + JSON.stringify(data.ResultSet.Table[count]) + '</td>';
                        tbody += '<td>' + val.item_name + '</td>';
                        tbody += '<td>' + val.mfd_name + '</td>';
                        tbody += '<td>' + val.hsn + '</td>';
                        tbody += '<td><input type="text" value=' + val.Batch_No + ' class="form-control" /></td>';
                        tbody += '<td><input type="text" value=' + val.exp_date + ' class="form-control" /></td>';
                        tbody += '<td>' + val.Pack_type + '</td>';
                        tbody += '<td>' + val.pack_qty + '</td>';
                        tbody += '<td>' + val.mrp + '</td>';
                        tbody += '<td>' + val.trade + '</td>';
                        tbody += '<td><input type="text" value=' + val.PO_Qty + ' class="form-control" /></td>';
                        tbody += '<td><input type="text" value=' + val.DisAmount + ' class="form-control" placeholder="Discount" /></td>';
                        tbody += '<td><input type="text" value=' + val.It_Free + ' class="form-control" placeholder="Free Qty" /></td>';
                        tbody += '<td>' + val.tax + '</td>';
                        tbody += '<td>' + val.amount + '</td>';
                        tbody += '<td><button id="btnRemove" style="margin-left:5px;" onclick=GRNItemsTranDelete(' + val.Auto_Id + '); class="btn btn-danger btn-sm"><i class="fa fa-trash"></i></button></td>';
                        tbody += '</tr>';
                        count++;
                    });
                    $("#tblGRNItemInfo tbody").append(tbody);
                    var IsLocked = (data.ResultSet.Table[0].IsLocked == 'Y') ? 'BlockUI' : '-';
                    $("#modalGRN .modal-body").addClass(IsLocked);
                    $('#txtTempGRNNo').val(data.ResultSet.Table[0].GRNNo);
                }
            }
            if (Object.keys(data.ResultSet).length > 0) {
                if (Object.keys(data.ResultSet.Table1).length > 0) {
                    $.each(data.ResultSet.Table1, function (key, val) {
                        $('#ddlOtherCharges').append($('<option></option>').val(val.item_id).html(val.item_name));
                    });
                }
            }
            if (Object.keys(data.ResultSet).length > 1) {
                if (Object.keys(data.ResultSet.Table2).length > 0) {
                    GRNTotalCal(data.ResultSet.Table2)
                }
            }
        },
        complete: function () {
            OtherChargesInfo()
            if (logic != 'calculate')
                $('#modalGRN').modal('show')
        },
        error: function (response) {
            alert('Server Error...!');
        }
    });
}
function AddOtherCharges() {
    var tbody = "";
    tbody += "<tr>";
    tbody += "<td class='hide'>" + $('#ddlOtherCharges option:selected').val() + "</td>";
    tbody += "<td>" + $('#ddlOtherCharges option:selected').text() + "</td>";
    tbody += "<td>" + $('#txtGRNTaxableAmount').val() + "</td>";
    tbody += "<td>" + $('#txtGRNTaxableRate').val() + "</td>";
    tbody += "<td>" + $('#txtGRNTax').val() + "</td>";
    tbody += '<td><button id="btnRemove" style="margin-left:5px;" onclick=removeGRNItem(this); class="btn btn-danger btn-sm"><i class="fa fa-trash"></i></button></td>';
    tbody += "</tr>";
    $("#tblGRNOtherCharges tbody").append(tbody);
}
function removeGRNItem(elem) {
    if (confirm('are you sure?'))
        $(elem).closest("tr").remove()
}
function OtherChargesInfo() {
    $("#tblGRNOtherCharges tbody").empty();
    var url = config.baseUrl + "/api/Indent/GS_PurchaseOrderQueries";
    var objBO = {};
    objBO.CompId = Active.compId;
    objBO.UnitId = Active.unitId;
    objBO.indent_no = '-';
    objBO.PONo = _PONo;
    objBO.GrnNo = $('#txtTempGRNNo').val();
    objBO.VendorId = _vendorId;
    objBO.ItemId = '-';
    objBO.From = '1900/01/01';
    objBO.To = '1900/01/01';
    objBO.Prm1 = '-';
    objBO.LoginId = Active.userId;
    objBO.Logic = "OtherChargesInfo";
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        contentType: "application/json;charset=utf-8",
        dataType: "JSON",
        success: function (data) {
            if (Object.keys(data.ResultSet).length > 0) {
                if (Object.keys(data.ResultSet.Table).length > 0) {
                    var tbody = "";
                    $.each(data.ResultSet.Table, function (key, val) {
                        tbody += '<tr>';
                        tbody += '<td class="hide">' + val.AutoId + '</td>';
                        tbody += '<td class="hide">' + val.ItemId + '</td>';
                        tbody += '<td>' + val.item_name + '</td>';
                        tbody += '<td>' + val.TaxableAmount + '</td>';
                        tbody += '<td>' + val.TaxRate + '</td>';
                        tbody += '<td>' + val.Tax + '</td>';
                        tbody += '<td>' + val.CGST + '</td>';
                        tbody += '<td>' + val.SGST + '</td>';
                        tbody += '<td>' + val.IGST + '</td>';
                        tbody += '<td><button id="btnRemove" style="margin-left:5px;" onclick=OtherCharges(' + val.AutoId + '); class="btn btn-danger btn-sm"><i class="fa fa-trash"></i></button></td>';
                        tbody += '</tr>';
                    });
                    $("#tblGRNOtherCharges tbody").append(tbody);
                }
            }
            if (Object.keys(data.ResultSet).length > 0) {
                if (Object.keys(data.ResultSet.Table1).length > 0) {
                    GRNTotalCal(data.ResultSet.Table1)
                }
            }
        },      
        error: function (response) {
            alert('Server Error...!');
        }
    });
}
function GRNTotalCal(data) {
    var tbody = "";
    $.each(data, function (key, val) {
        $('#txtTaxable').text(val.TaxableAmount);
        $('#txtCGST').text(val.CGST);
        $('#txtSGST').text(val.SGST);
        $('#txtIGST').text(val.IGST);
        $('#txtDiscount').text(val.Discount);
        $('#txtTotalValue').text(val.TotalValue.toFixed(2));
    });
}
function Calculate(logic) {
    if (logic == 'OverallDiscount') {
        if ($('#txtTempOverAllDiscount').val() == '') {
            alert('Please Provide Discount Amount.')
            return
        }
    }
    if (!confirm('are you sure?')) return
    var url = config.baseUrl + "/api/Indent/wh_GRNInsert";
    var objBO = {};
    var objItems = [];
    objBO.AutoId = $('#txtTempOverAllDiscount').val();
    objBO.CompId = Active.compId;
    objBO.UnitId = Active.unitId;
    objBO.Grn_type = $('#ddlGrnType option:selected').text();
    objBO.Vendor_Code = _vendorId;
    objBO.po_no = _PONo;
    objBO.Inv_No = $('#txtInvNo').val();
    objBO.Inv_Date = $('#txtInvDate').val();
    objBO.NatureOfPurchase = $('#txtInvDate').val();
    objBO.eWayBillNo = $('#txteWayBillNo').val();
    objBO.eWayBillDate = $('#txteWayBillDate').val();
    objBO.Remark = '-';
    objBO.GrnNo = $('#txtTempGRNNo').val();
    objBO.CreatedBy = Active.userId;
    objBO.Logic = logic;
    $("#tblGRNItemInfo tbody tr").each(function () {
        var val = JSON.parse($(this).find('td:eq(0)').text())
        objItems.push({
            'AutoId': val.Auto_Id,
            'Item_id': val.item_id,
            'barcodeNo': '-',
            'hsn': val.hsn,
            'mfd_id': val.mfd_id,
            'Batch_No': $(this).find('td:eq(4) input').val(),
            'Exp_Date': $(this).find('td:eq(5) input').val(),
            'pack_type': val.Pack_type,
            'pack_qty': val.pack_qty,
            'MRP': val.mrp,
            'trade': val.trade,
            'Quantity': $(this).find('td:eq(10) input').val(),
            'It_Free': $(this).find('td:eq(12) input').val(),
            'DisPer': $(this).find('td:eq(11) input').val(),
            'Tax_id': 0,
            'BestRate': 0,
            'ItemType': 'Item'
        })
    });
    $("#tblGRNOtherCharges tbody tr").each(function () {
        objItems.push({
            'AutoId': 0,
            'Item_id': $(this).find('td:eq(0)').text(),
            'barcodeNo': '-',
            'hsn': '-',
            'mfd_id': '-',
            'Batch_No': '-',
            'Exp_Date': '1900/01/01',
            'pack_type': '-',
            'pack_qty': 0,
            'MRP': $(this).find('td:eq(2)').text(),
            'trade': $(this).find('td:eq(3)').text(),
            'Quantity': 0,
            'It_Free': 0,
            'DisPer': $(this).find('td:eq(4)').text(),
            'Tax_id': 0,
            'BestRate': 0,
            'ItemType': 'OtherCharges'
        })
    });

    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify({ objBO: objBO, items: objItems }),
        contentType: "application/json;charset=utf-8",
        dataType: "JSON",
        success: function (data) {
            if (JSON.parse(data).result.includes('Success')) {
                alert(JSON.parse(data).result)
                Proceed()
            }
            else {
                alert(JSON.parse(data).result)
            }
        },
        error: function (response) {
            alert('Server Error...!');
        }
    });
}
function ExpDateFormat() {
    if ($('#txtCorrExpDate').val().length ==4 && !$('#txtCorrExpDate').val().includes('-'))
        $('#txtCorrExpDate').val($('#txtCorrExpDate').val() + '-')
    else
        $('#txtCorrExpDate').val($('#txtCorrExpDate').val())
}
function Modify() {
    if (!confirm('are you sure?')) return
    var url = config.baseUrl + "/api/Indent/wh_GRNInsert";
    var objBO = {};
    var objItems = [];
    objBO.AutoId = 0;
    objBO.CompId = Active.compId;
    objBO.UnitId = Active.unitId;
    objBO.Grn_type = '-';
    objBO.Vendor_Code = '-';
    objBO.po_no = _PONo;
    objBO.Inv_No = '-';
    objBO.Inv_Date = '1900/01/01';
    objBO.NatureOfPurchase = '-';
    objBO.eWayBillNo = '-';
    objBO.eWayBillDate = '1900/01/01';
    objBO.Remark = '-';
    objBO.GrnNo = '-';
    objBO.CreatedBy = Active.userId;
    objBO.Logic = 'Modify';             
    if ($('#txtCorrBatch').val() == '') {
        alert('Please Provide Batch No.')
        $('#txtCorrBatch').focus()
        return
    }
    if ($('#txtCorrExpDate').val() == '') {
        alert('Please Provide Expiry Date.')
        $('#txtCorrExpDate').focus()
        return
    }
    if ($('#ddlCorrPackType option:selected').text() == '' || $('#ddlCorrPackType option:selected').text() == 'Select') {
        alert('Please Select Pack Type.')    
        return
    }    
    if ($('#txtCorrPQty').val() == '') {
        alert('Please Provide PQty.')
        $('#txtCorrPQty').focus()
        return
    }
    if ($('#txtCorrPQty').val() == '') {
        alert('Please Provide PQty.')
        $('#txtCorrPQty').focus()
        return
    }
    objItems.push({
        'AutoId': $('#txtCorrBatch').data('id'),
        'Item_id': '-',
        'barcodeNo': '-',
        'hsn': '-',
        'mfd_id': $('#ddlCorrManufacturer option:selected').val(),
        'Batch_No': $('#txtCorrBatch').val(),
        'Exp_Date': $('#txtCorrExpDate').val()+'-01',
        'pack_type': $('#ddlCorrPackType option:selected').text(),
        'pack_qty': $('#txtCorrPQty').val(),
        'MRP': $('#txtCorrMRP').val(),
        'trade': $('#txtCorrTrade').val(),
        'Quantity': 0,
        'It_Free': 0,
        'DisPer': 0,
        'Tax_id': 0,
        'BestRate': 0,
        'ItemType': 'Item'
    })

    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify({ objBO: objBO, items: objItems }),
        contentType: "application/json;charset=utf-8",
        dataType: "JSON",
        success: function (data) {
            if (JSON.parse(data).result.includes('Success')) {
                alert(JSON.parse(data).result)               
            }
            else {
                alert(JSON.parse(data).result)
            }
        },
        error: function (response) {
            alert('Server Error...!');
        }
    });
}
function OtherCharges(autoId) {
    if (autoId == 'OtherCharges:Insert') {
        if ($('#ddlOtherCharges option:selected').val() == 'Select') {
            alert('Please Select Other Charges')
            return
        }
        if ($('#txtGRNTaxableAmount').val() == '') {
            alert('Please Provide Taxable Amount.')
            return
        }
        if ($('#txtGRNTaxableRate').val() == '') {
            alert('Please Provide Taxable Rate.')
            return
        }
        if ($('#txtGRNTax').val() == '') {
            alert('Please Provide Tax.')
            return
        }
    }
    if (autoId != 'OtherCharges:Insert')
        if (!confirm('are you sure?')) return

    var url = config.baseUrl + "/api/Indent/wh_GRNInsert";
    var objBO = {};
    var objItems = [];
    objBO.AutoId = (autoId == 'OtherCharges:Insert') ? 0 : autoId;
    objBO.CompId = Active.compId;
    objBO.UnitId = Active.unitId;
    objBO.Grn_type = '-';
    objBO.Vendor_Code = _vendorId,
        objBO.po_no = _PONo;
    objBO.Inv_No = '-';
    objBO.Inv_Date = '1900/01/01';
    objBO.NatureOfPurchase = '-';
    objBO.eWayBillNo = '-';
    objBO.eWayBillDate = '1900/01/01';
    objBO.Remark = '-';
    objBO.GrnNo = $('#txtTempGRNNo').val();
    objBO.CreatedBy = Active.userId;
    objBO.Logic = (autoId == 'OtherCharges:Insert') ? autoId : 'OtherCharges:Delete';
    objItems.push({
        'AutoId': 0,
        'Item_id': $('#ddlOtherCharges option:selected').val(),
        'barcodeNo': '-',
        'hsn': '-',
        'mfd_id': '-',
        'Batch_No': '-',
        'Exp_Date': '1900/01/01',
        'pack_type': '-',
        'pack_qty': 0,
        'MRP': $('#txtGRNTaxableAmount').val(),
        'trade': $('#txtGRNTaxableRate').val(),
        'Quantity': $('#txtGRNTax').val(),
        'It_Free': 0,
        'DisPer': 0,
        'Tax_id': 0,
        'BestRate': 0,
        'ItemType': 'OtherCharges'
    })

    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify({ objBO: objBO, items: objItems }),
        contentType: "application/json;charset=utf-8",
        dataType: "JSON",
        success: function (data) {
            if (JSON.parse(data).result.includes('Success')) {
                OtherChargesInfo()
                $('#ddlOtherCharges').val('Select');
                $('#txtGRNTaxableAmount').val('');
                $('#txtGRNTaxableRate').val('');
                $('#txtGRNTax').val('');
            }
            else {
                alert(JSON.parse(data).result)
            }
        },
        error: function (response) {
            alert('Server Error...!');
        }
    });
}
function GRNItemsTranDelete(autoId) {
    if (!confirm('are you sure?')) return

    var url = config.baseUrl + "/api/Indent/wh_GRNInsert";
    var objBO = {};
    var objItems = [];
    objBO.AutoId = autoId;
    objBO.CompId = Active.compId;
    objBO.UnitId = Active.unitId;
    objBO.Grn_type = '-';
    objBO.Vendor_Code = _vendorId,
        objBO.po_no = _PONo;
    objBO.Inv_No = '-';
    objBO.Inv_Date = '1900/01/01';
    objBO.NatureOfPurchase = '-';
    objBO.eWayBillNo = '-';
    objBO.eWayBillDate = '1900/01/01';
    objBO.Remark = '-';
    objBO.GrnNo = '-';
    objBO.CreatedBy = Active.userId;
    objBO.Logic = 'GRNItemsTran:Delete';
    objItems.push({
        'AutoId': 0,
        'Item_id': '-',
        'barcodeNo': '-',
        'hsn': '-',
        'mfd_id': '-',
        'Batch_No': '-',
        'Exp_Date': '1900/01/01',
        'pack_type': '-',
        'pack_qty': 0,
        'MRP': 0,
        'trade': 0,
        'Quantity': 0,
        'It_Free': 0,
        'DisPer': 0,
        'Tax_id': 0,
        'BestRate': 0,
        'ItemType': 'OtherCharges'
    })

    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify({ objBO: objBO, items: objItems }),
        contentType: "application/json;charset=utf-8",
        dataType: "JSON",
        success: function (data) {
            if (JSON.parse(data).result.includes('Success')) {
                Proceed()
            }
            else {
                alert(JSON.parse(data).result)
            }
        },
        error: function (response) {
            alert('Server Error...!');
        }
    });
}
function LockGrn() {
    if (!confirm('are you sure?')) return
    if ($('#txtInvNo').val() == '') {
        alert('Please Provide Invoice No.')
        return
    }
    if ($('#txtInvDate').val() == '') {
        alert('Please Provide Invoice Date.')
        return
    }
    var url = config.baseUrl + "/api/Indent/wh_GRNInsert";
    var objBO = {};
    var objItems = [];
    objBO.AutoId = 0;
    objBO.CompId = Active.compId;
    objBO.UnitId = Active.unitId;
    objBO.Grn_type = $('#ddlGrnType').text();
    objBO.Vendor_Code = _vendorId;
    objBO.po_no = _PONo;
    objBO.Inv_No = $('#txtInvNo').val();
    objBO.Inv_Date = $('#txtInvDate').val();
    objBO.NatureOfPurchase = $('#ddlNatureOfPurchase option:selected').text();
    objBO.eWayBillNo = $('#txteWayBillNo').val();
    objBO.eWayBillDate = $('#txteWayBillDate').val();
    objBO.Remark = '-';
    objBO.GrnNo = $('#txtTempGRNNo').val();
    objBO.CreatedBy = Active.userId;
    objBO.Logic = 'LockGrn';
    objItems.push({
        'AutoId': 0,
        'Item_id': '-',
        'barcodeNo': '-',
        'hsn': '-',
        'mfd_id': '-',
        'Batch_No': '-',
        'Exp_Date': '1900/01/01',
        'pack_type': '-',
        'pack_qty': 0,
        'MRP': 0,
        'trade': 0,
        'Quantity': 0,
        'It_Free': 0,
        'DisPer': 0,
        'Tax_id': 0,
        'BestRate': 0,
        'ItemType': 'OtherCharges'
    })

    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify({ objBO: objBO, items: objItems }),
        contentType: "application/json;charset=utf-8",
        dataType: "JSON",
        success: function (data) {
            if (JSON.parse(data).result.includes('Success')) {
                Proceed()
            }
            else {
                alert(JSON.parse(data).result)
            }
        },
        error: function (response) {
            alert('Server Error...!');
        }
    });
}