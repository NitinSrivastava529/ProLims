$(document).ready(function () {
    $('#ddlPayMode').prop({ 'selectedIndex': 0, 'disabled': true }).change();
});
function Action() {
    $('input:radio').on('change', function () {
        var isCheck = $(this).is(':checked');
        var val = $(this).val();
        if (val === 'Cancelled') {
            $('#tblPayment .payment').each(function () {
                $(this).find('label input').prop({ 'checked': true, 'disabled': true }).change()
            })
            setTimeout(function () {
                var total = [...$('#tblPayment .payment input:checkbox:checked').map((k, v) => $(v).data('info').netAmount)].reduce((a, b) => eval(a) + eval(b));
                $('#txtnet').val(total);

            }, 500)
          
            $('#ddlPayMode').prop({ selectedIndex: 0, disabled: true }).change();
        }
        if (val == 'Refunded') {            
            $('#tblPayment .payment').each(function () {
                $(this).find('label input').prop({ 'checked': false, 'disabled': false }).change()
            })
            $('#txtnet').val('0');
            $('#ddlPayMode').prop({ 'selectedIndex': 0, 'disabled': false }).change();
        }
    });

}
function Calculate() {
    var total = [...$('#tblPayment .payment input:checkbox:checked').map((k, v) => $(v).data('info').netAmount)].reduce((a, b) => eval(a) + eval(b));
    $('#txtnet').val(total);
}
function GetServicesRefund() {
    $('#tblDetails tbody').empty();
    $('#tblPayment').empty();
    var url = config.baseUrl + "/api/Service/Diag_ServiceQueries";
    var objBO = {};
    objBO.CompId = localStorage.getItem('ActiveClient');
    objBO.SearcKey = '';
    objBO.SearchValue = '-';
    objBO.from = '1999-01-01';
    objBO.to = '1999-01-01';
    objBO.prm_1 = $('#txtVisitNo').val();
    objBO.Logic = 'GetServicesRefundNew';
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
                var temp = "";
                $.each(data.ResultSet.Table, function (key, val) {
                    if (temp != val.ipop_no) {
                        tbody += "<tr class='group'>";
                        tbody += "<td colspan='3'><b>Name : </b>" + val.patient_name + ",Date : " + val.tnxDate + "</td>";
                        tbody += "</tr>";
                        temp = val.ipop_no;
                    }
                    tbody += "<tr>";
                    tbody += "<td hidden>" + val.ipop_no + "</td>";
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

                    if (val.IsCancelled == 'Y')
                        html += "<div class='payment' style='background: #ffdfdf;'>";
                    else
                        html += "<div class='payment'>";

                    html += "<span class='item'><b>Item :</b> " + val.ItemName + "</span>";
                    html += "<span class='amt'><b>Gross : </b>" + val.GrossAmount + ", <b>Discount : </b>" + val.panel_disc + ", <b>Net : </b>" + val.netAmount + "</span>";
                    if (val.IsCancelled == 'N')
                        html += "<label class='IsCheck'><input onchange=Calculate() data-info='" + JSON.stringify(data.ResultSet.Table1[key]) + "' type='checkbox'/></label>";

                    html += "</div>";
                });
                $('#tblPayment').append(html);
            }
            else {
                alert("Data Not Found..");
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
            objBO.CompId = localStorage.getItem('ActiveClient');
            objBO.UnitId = localStorage.getItem('ActiveClient');
            objBO.ClientId = $('#tblDetails tbody tr:last').find('td:eq(0)').text();
            objBO.OldVisitNo = $('#txtVisitNo').val();
            objBO.DiscountRemark = $('#txtRemark').val();
            objBO.LoginId = localStorage.getItem('jsEmpCode');
            if ([...$('#tblPayment .payment input:checkbox:checked').map((k, v) => $(v).data('info').auto_id)].length == 0) {
                alert('Please Select Item.');
                return
            }
            objBO.ItemIds = [...$('#tblPayment .payment input:checkbox:checked').map((k, v) => $(v).data('info').auto_id)].join('|');
            $('#btnRefund').prop('disabled',true)
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
                        $('#textarea').val('');
                        $('#ddlPayMode').prop('selectedIndex', '0').change();
                        $('#tblDetails tbody').empty();
                        $('#tblPayment').empty();
                        $('#txtnet').val('0');
                        $('#btnRefund').prop('disabled', false)
                        GetServicesRefund() 
                    }
                    else {
                        alert(data);
                        $('#btnRefund').prop('disabled', false)
                    }
                },
                error: function (response) {
                    alert('Server Error...!');
                }
            });
        }
    }
}
