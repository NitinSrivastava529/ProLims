$(document).ready(function () {
    $('#ddlPayMode').prop({ 'selectedIndex': 0, 'disabled': true }).change();
    $('select').select2();
    $('#tblPayment tbody').on('change', 'input:checkbox', function () {
        amount = 0;
        total = 0;
        $('#tblPayment tbody').find('input:checkbox:checked').each(function () {
            $(this).closest('tr').addClass('item');
            if (parseFloat($(this).closest('tr').find('td:eq(5)').text()) > 0)
                amount += parseFloat($(this).closest('tr').find('td:eq(5)').text());
        });
        $('#tblPayment tbody').find('input:checkbox:not(:checked)').each(function () {
            $(this).closest('tr').removeClass('item');
        });
        $('#txtnet').val(amount)
    });
});
function Action() {
    $('input:radio').on('change', function () {
        var isCheck = $(this).is(':checked');
        var val = $(this).val();
        if (val === 'Cancelled') {
            let totalAmount = 0;
            $('#tblPayment tbody').find('input:checkbox').each(function () {
                var rowchck = $(this).closest('tr').addClass('item');
                rowchck = $(this).prop({ checked: true, disabled: true });
                const cellValue = parseFloat($(this).closest('tr').find('td:eq(5)').text()) || 0;
                if (cellValue > 0) {
                    totalAmount += cellValue;
                }
            });
            $('#txtnet').val(totalAmount.toFixed(2)); // optional formatting
            $('#ddlPayMode').prop({ selectedIndex: 0, disabled: true }).change();
        }
        if (val == 'Refunded') {
            $('#tblPayment tbody').find('input:checkbox:checked').each(function () {
                $(this).prop({ 'checked': false, 'disabled': false });
                $(this).closest('tr').removeClass('item');
                $('#txtnet').val('0');
            })
            $('#ddlPayMode').prop({ 'selectedIndex': 0, 'disabled': false }).change();
        }
    });

}
function GetServicesRefund() {
    $('#tblDetails tbody').empty();
    $('#tblPayment tbody').empty();
    var url = config.baseUrl + "/api/Service/Diag_ServiceQueries";
    var objBO = {};
    objBO.SearcKey = '';
    objBO.SearchValue = '-';
    objBO.from = '1999-01-01';
    objBO.to = '1999-01-01';
    objBO.prm_1 = $('#txtVisitNo').val();
    objBO.login_id = Active.userId;
    objBO.Logic = 'GetCancellationList';
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        contentType: "application/json;charset=utf-8",
        dataType: "JSON",
        async: false,
        success: function (data) {
            if (data.ResultSet.Table.length > 0) {
                $('#txtVisitNo').attr('disabled', true);
                total = 0;
                amount = 0;
                $('#txtTotal').val(0);
                $('#txtnet').val(0)
                $('#txtDeduct').val(0)
                $('#txtVisitNo').val('');
                $('#txtVisitNo,textarea').val('');
                $('#txtVisitNo').val(objBO.prm_1);

                var tbody = "";
                $.each(data.ResultSet.Table, function (key, val) {
                    tbody += "<tr>";
                    tbody += "<td hidden>" + val.clientid + "</td>";
                    tbody += "<td>" + val.ipop_no + "</td>";
                    tbody += "<td>" + val.ClientName + "</td>";
                    tbody += "<td>" + val.patient_name + "</td>";
                    tbody += "<td>" + val.tnxDate + "</td>";
                    tbody += "<td class='text-right'>" + val.GrossAmount + "</td>";
                    tbody += "<td class='text-right'>" + val.PanelDiscount + "</td>";
                    tbody += "<td class='text-right'>" + val.NetAmount + "</td>";
                    tbody += "</tr>";
                });
                $('#tblDetails tbody').append(tbody);

                var html = ""; var totalCash = 0; var totaldeductAmount = 0;
                $.each(data.ResultSet.Table1, function (key, val) {
                    totalCash += parseInt(val.CashBackAmount);
                    totaldeductAmount += parseInt(val.walletDeductAmount);
                    if (val.IsCancelled == "Y") {
                        html += "<tr style='background:#ffdfdf;;'>";
                    }
                    else
                        html += "<tr>";
                    html += "<td hidden>" + val.auto_id + "</td>";
                    html += "<td hidden>" + val.ItemId + "</td>";
                    html += "<td>" + val.ItemName + "</td>";
                    html += "<td class='text-right'>" + val.GrossAmount + "</td>";
                    html += "<td class='text-right'>" + val.panel_disc + "</td>";
                    html += "<td class='text-right'>" + val.netAmount + "</td>";
                    if (val.IsCancelled == 'Y')
                        html += "<td style='text-align:center'>-</td>";
                    else
                        html += "<td style='text-align:center'><input type='checkbox'/></td>";
                    html += "</tr>";
                });
                $('#tblPayment tbody').append(html);
            }
            else {
                //alert("Data Not Found..");
                alert("You are not allowed to Cancel the data");
            };
        },
        error: function (response) {
            alert('Server Error...!');
        }
    });
}
function Validation() {
    var Remark = $('#txtRemark').val();
    var PayMode = $('#ddlPayMode option:selected').text();

    if (PayMode == 'Pay Mode') {
        $('#ddlPayMode').focus();
        alert('Please Choose Pay Mode..');
        return false;
    }
    if (Remark == '') {
        $('#txtRemark').focus();
        alert('Please Provide Cancellation Remark..');
        return false;
    }
    return true;
}
function InsertCancellation() {
    if (Validation()) {
        if (confirm('are you sure to cancel?')) {
            var url = config.baseUrl + "/api/Service/Diag_RefundBooking";
            var objBO = {};
            var item = [];
            objBO.CompId = Active.compId;
            objBO.UnitId = Active.unitId;
            objBO.ClientId = $('#tblDetails tbody tr').find('td:eq(0)').text();
            objBO.OldVisitNo = $('#txtVisitNo').val();
            objBO.DiscountRemark = $('#txtRemark').val();
            $('#tblPayment tbody tr.item').each(function () {
                var itemid = $(this).find('td:eq(0)').text();
                item.push(itemid);
            });
            if (item.length == 0) {
                alert('Please Select Item.');
                return
            }
            objBO.ItemIds = item.join('|');
            objBO.usertype = 'Super-User';
            objBO.LoginId = Active.userId;
            $.ajax({
                method: "POST",
                url: url,
                data: JSON.stringify(objBO),
                contentType: "application/json;charset=utf-8",
                dataType: "JSON",
                async: false,
                success: function (data) {
                    var newvisitNo = data.split('|')[1];
                    if (data.includes('Success')) {
                        alert('Successfully Saved !');
                        $('#txtVisitNo,textarea').val('');
                        $('#ddlPayMode').prop('selectedIndex', '0').change();
                        $('#tblDetails tbody').empty();
                        $('#tblPayment tbody').empty();
                        $('#txtnet').val('0');
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
}