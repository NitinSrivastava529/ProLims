var _itemId = "";
$(document).ready(function () {
    ItemsForRateList();
    $('#tblRateList tbody').on('click', 'button', function () {       
        var val = $(this).data('id');     
        if (val == 'single') {
            var rateListId = $(this).closest('tr').find('td:eq(0)').text();
            var rate = $(this).closest('tr').find('td:eq(2) input').val();
            UpdateRateList($(this), rateListId, rate)
        }
        if (val == 'multi') {                 
            var group = $(this).data('list');     ;                   
            $("#tblRateList tbody tr." + group+"").each(function () {            
                var indx = $(this);
                var rateListId = $(this).find('td:eq(0)').text();
                var rate = $(this).find('td:eq(2) input').val();
                debugger
                UpdateRateList(indx, rateListId, rate)                       
            });
        }    
    });
});
function ItemsForRateList() {
    $('#tblItem tbody').empty();
    $('#tblRateList tbody').empty();
    var url = config.baseUrl + "/api/GeneralStore/MasterQueries";
    var objBO = {};
    objBO.prm_1 = '-';
    objBO.Logic = 'ItemsForRateList';
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        contentType: "application/json;charset=utf-8",
        dataType: "JSON",
        success: function (data) {
            if (Object.keys(data.ResultSet).length) {
                if (Object.keys(data.ResultSet.Table).length) {
                    var tbody = ""; var temp = "";
                    $.each(data.ResultSet.Table, function (key, val) {

                        tbody += "<tr>";
                        tbody += "<td>" + val.ItemID + "</td>";
                        tbody += "<td>" + val.ItemName + "</td>";
                        tbody += "<td><button type='button' class='btn btn-warning btn-sm' onclick=RateListByItems('" + val.ItemID + "')><span class='fa fa-sign-in'></span>&nbsp;</button></td>";
                        tbody += "</tr>";
                    });
                    $('#tblItem tbody').append(tbody);
                }
            }
            else {
                $('#btnsearch i').remove();
            }

        },
        error: function (response) {
            alert('Server Error...!');
        }
    });
}
function RateListByItems(itemId) {
    _itemId = itemId;
    $('#tblRateList tbody').empty();
    var url = config.baseUrl + "/api/GeneralStore/MasterQueries";
    var objBO = {};
    objBO.prm_1 = itemId;
    objBO.Logic = 'RateListByItems';
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        contentType: "application/json;charset=utf-8",
        dataType: "JSON",
        success: function (data) {
            if (Object.keys(data.ResultSet).length) {
                if (Object.keys(data.ResultSet.Table).length) {
                    var tbody = ""; var temp = "";
                    $.each(data.ResultSet.Table, function (key, val) {
                        if (temp != val.RateListType) {
                            tbody += "<tr style='background:#ddd'>";
                            tbody += "<td colspan='2'>RateList Type : " + val.RateListType + "</td>";
                            tbody += "<td><input type='text' data-list=" + val.RateListType + " onkeyup=readVal(this) class='bg-warning'/></td>";
                            tbody += "<td><button type='button' data-id='multi' data-list=" + val.RateListType + " class='btn btn-warning btn-sm'><i class='fa fa-plus-circle'></i>&nbsp;</button></td>";
                            tbody += "</tr>";
                            temp = val.RateListType;
                        }
                        tbody += "<tr class=" + val.RateListType+">";
                        tbody += "<td class='hide'>" + val.RateListId + "</td>";
                        tbody += "<td>" + val.RateListName + "</td>";
                        var val1 = (val.Rate == null) ? '' : val.Rate;
                        tbody += "<td><input type='text' value='" + val1 + "'/></td>";
                        tbody += "<td><button type='button' data-id='single' class='btn btn-success btn-sm'><i class='fa fa-plus-circle'></i>&nbsp;</button></td>";
                        tbody += "</tr>";
                    });
                    $('#tblRateList tbody').append(tbody);
                }
            }
            else {
                $('#btnsearch i').remove();
            }

        },
        error: function (response) {
            alert('Server Error...!');
        }
    });
}
function readVal(elem) {
    $('#tblRateList tbody tr.' + $(elem).data('list')+'').each(function () { $(this).find('td:eq(2) input').val($(elem).val()) })
}
function UpdateRateList(elem, rateliestId, rate) {
    $(elem).closest('tr').find('td:eq(3) button').find('i').removeClass('fa-plus-circle').addClass('fa-spinner');    
    //setTimeout(function () {
    //    $(elem).closest('tr').find('td:eq(3) button').find('i').removeClass('fa-spinner').addClass('fa-plus-circle');
    //}, 2000)
    //return
    var url = config.baseUrl + "/api/GeneralStore/InsertPanelMaster";
    var objBO = {};
    objBO.Unitid = Active.unitId;
    objBO.CompId = Active.compId;
    objBO.PanelName = '-';
    objBO.itemId = _itemId;
    objBO.PanelId = rateliestId;
    objBO.login_id = Active.userId;
    objBO.Rate = rate;
    objBO.Logic = 'UpdateRateList';
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            if (data.includes('Success')) {
                $(elem).closest('tr').find('td:eq(3) button').find('i').removeClass('fa-spinner').addClass('fa-plus-circle');
                $(elem).closest('tr').addClass('bg-success');
            }
            else {
                alert(data);
                $(elem).closest('tr').removeClass('bg-success');
                $(elem).closest('tr').find('td:eq(3) button').find('i').removeClass('fa-spinner').addClass('fa-plus-circle');
            };
        },
        error: function (response) {
            alert('Server Error...!');
        }
    });
}