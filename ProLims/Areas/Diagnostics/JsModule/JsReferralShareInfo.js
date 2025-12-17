$(document).ready(function () {
    //FillCurrentMonth('txtMonth')   
});
function JS_Payable() {
    $("#tblShare tbody").empty();
    $("#tblShare span").text(00);
    var url = config.baseUrl + "/api/B2BClient/B2B_JS_ShareQueries";
    var objBO = {};
    objBO.clientId = Active.clientId;
    objBO.from = $('#txtMonth').val();
    objBO.to = '1900/01/01';
    objBO.Prm1 = Active.userId;
    objBO.loginId = Active.userId;
    objBO.Logic = 'JS_DoctorIncentive';
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            console.log(data)
            $('#txtStatus').text(data.Msg);
            if (data.Msg.includes('Preserve')) {
                $('#btnxl').removeClass('blockUI');
                $('#btnPresertve').addClass('blockUI');
            }
            else {
                $('#btnxl').addClass('blockUI');
                $('#btnPresertve').removeClass('blockUI');
            }
            var tbody = ""; var temp = ""; var count = 0;
            var mrpTotal = 0, share = 0;
            if (Object.keys(data.ResultSet).length) {
                if (Object.keys(data.ResultSet.Table).length) {
                    $.each(data.ResultSet.Table, function (key, val) {
                        count++;
                        if (temp != val.ClientName) {
                            tbody += "<tr style='background:#CCC;'>";
                            tbody += "<td colspan='8' style='font-size:13px;'><b> Client Name : " + val.ClientName + "</b></td>";
                            tbody += "</tr>";
                            temp = val.ClientName
                        }
                        mrpTotal += val.Amount;
                        share += val.DoctorShare;                    

                        tbody += "<tr>";
                        tbody += "<td class='hidden'>" + val.ClientId + "</td>";
                        tbody += "<td>" + count + "</td>";       
                        tbody += "<td>" + val.ref_code + "</td>";
                        tbody += "<td>" + val.ref_name + "</td>";
                        tbody += "<td>" + val.Degree + "</td>";
                        tbody += "<td>" + val.MobileNo + "</td>";
                        tbody += "<td class='text-right'>" + val.Amount + "</td>";
                        tbody += "<td class='text-right'>" + val.DoctorShare + "</td>";                    
                        tbody += "</tr>";
                    });
                    $("#tblShare tbody").append(tbody);
                    $("#mrpTotal").text(mrpTotal.toFixed(0));
                    $("#share").text(share.toFixed(0));                 
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
function Preserve() {
    var url = config.baseUrl + "/api/B2BClient/B2B_JS_ShareQueries";
    var objBO = {};
    objBO.clientId = Active.clientId;
    objBO.from = $('#txtMonth').val();
    objBO.to = '1900/01/01';
    objBO.Prm1 = Active.userId;
    objBO.loginId = Active.userId;
    objBO.Logic = 'PreserveJSReferralShareInfo';
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            console.log(data)
            if (data.Msg.includes('Preserved')) {
                alert(data.Msg);
                JS_Payable()
            }
            else {
                alert(data.Msg);
            };
        },
        error: function (response) {
            alert('Server Error...!');
        }
    });
}
function DownloadExcel(elem) {
    var url = config.baseUrl + "/api/B2BClient/B2B_JS_ShareQueries";
    var objBO = {};
    objBO.clientId = Active.clientId;
    objBO.from = $('#txtMonth').val();
    objBO.to = '1900/01/01';
    objBO.Prm1 = Active.userId;
    objBO.loginId = Active.userId;
    objBO.Logic = 'JS_DoctorIncentive';
    objBO.OutPutType = 'Excel';
    Global_DownloadExcel(url, objBO, "JS_Payable.xlsx", elem);
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