var config = {
    //localhost Url 
    baseUrl: "http://localhost:53114",
    rootUrl: 'http://localhost:53101',
    IISRoot: 'http://localhost:53101',
    DocumentUrl: window.location.origin,
    //baseUrl: window.location.origin + '/ExproMateApi',
    //rootUrl: window.location.origin + '/ExproMate',
    //IISRoot: window.location.origin + '/ExproMate',
    //DocumentUrl: window.location.origin
};
var Active = {
    userName: localStorage.getItem('Username'),
    userId: localStorage.getItem('UserID'),
    unitId: localStorage.getItem('UnitId'),
    compId: localStorage.getItem('CompId'),
    clientId: localStorage.getItem('ClientId'),
    userStatus: localStorage.getItem('UserStatus'),
    specialMailing: localStorage.getItem('specialMailing'),

}
function setUnit(unitId) {
    localStorage.setItem('UnitId', unitId)
    Active.unitId = unitId;
    $('.ddlGlobalUnit option').each(function () {
        if ($(this).val() == Active.unitId)
            $('.ddlGlobalUnit').prop('selectedIndex', '' + $(this).index() + '');
    })
}
$(document).ready(function () {
    inputLimit();
    onlyInt();
    onlyChar();
    loading();
});
var Loading = {
    small_gear: "<i><img src='" + config.rootUrl + "/Content/logo/gear.gif' /></i>"
}
function loading() {
    $loading = $("#ajaxLoading").hide();
    $(document).on({
        ajaxStart: function () {
            //$("#ajaxLoading").show();
            //$("#sb-site").css('filter', 'contrast(0.5)');
            //setTimeout(function () {
            //	$("#ajaxLoading").show();
            //}, 300);
            $('#LineLoader').show();
        },
        ajaxStop: function () {
            $('#LineLoader').hide();
            //         setTimeout(function () {
            //	$("#ajaxLoading").hide();
            //	$("#sb-site").css('filter', 'contrast(1)');
            //	$("body").removeAttr('style');
            //}, 300);
        }
    });
}
function Global_DownloadExcel(Url, objBO, fileName) {
    $('#LineLoader').show();
    var ajax = new XMLHttpRequest();
    ajax.open("Post", Url, true);
    ajax.responseType = "blob";
    ajax.setRequestHeader("Content-type", "application/json")
    ajax.onreadystatechange = function () {
        if (this.readyState == 4) {
            console.log(this.response);
            var blob = new Blob([this.response], { type: "application/octet-stream" });
            saveAs(blob, fileName); //refernce by ~/JsModule/FileSaver.min.js
            $('#LineLoader').hide();
        }
    };
    ajax.send(JSON.stringify(objBO));
}
function Global_DownloadPDF(Url, objBO, fileName) {
    $('#LineLoader').show();
    var ajax = new XMLHttpRequest();
    ajax.open("Post", Url, true);
    ajax.responseType = "blob";
    ajax.setRequestHeader("Content-type", "application/json")
    ajax.onreadystatechange = function () {
        if (this.readyState == 4) {
            console.log(this.response);
            var blob = new Blob([this.response], { type: "application/octet-stream" });
            saveAs(blob, fileName);
            $('#LineLoader').hide();
        }
    };
    ajax.send(JSON.stringify(objBO));
}
function lockPreviousDate(elementid) {
    //var today = new Date().toISOString().split('T')[0];	
    var today = localStorage.getItem('ServerTodayDate').split('T')[0];
    // alert(today);
    $("#" + elementid).attr("min", today);
}
function FillCurrentDate(elementid) {

    var date = new Date();
    var day = date.getDate();
    var month = date.getMonth() + 1;
    var year = date.getFullYear();
    if (month < 10) month = "0" + month;
    if (day < 10) day = "0" + day;
    var today = year + "-" + month + "-" + day;
    $("#" + elementid).attr("value", today);
}
function GetPreviousDate() {

    var date = new Date();
    var day = date.getDate();
    var month = date.getMonth() + 1;
    var year = date.getFullYear();
    if (month < 10) month = "0" + month;
    if (day < 10) day = "0" + day;

    return year + "-" + month + "-" + day;

}

function Properdate(inp_date, seprater) {
    if (inp_date == "")
        corr_formate = "1900/01/01";
    else
        corr_formate = inp_date
    //if (inp_date != "") {
    //    var f = inp_date.split(seprater);
    //    corr_formate = f[2] + "/" + f[1] + "/" + f[0];
    //}
    //else { corr_formate = "1900/01/01"; }
    return corr_formate;
}

function FixTableHead() {
    var table = $('#tblUnCompleteOrder').height();
    var thead = $('#tblUnCompleteOrder').find('thead');
    var tbody = $('#tblUnCompleteOrder').find('tbody');
    if (table == 335) {
        $(thead).css('position', 'absolute');
    }
}

function chkSession() {
    var Username = localStorage.getItem('Username');
    var UserID = localStorage.getItem('UserID');
    var urlPath = window.location.pathname.toLowerCase();
    var urlOrigin = window.location.origin.toLowerCase();
    var siteUrl = config.rootUrl;
    if (Username != null && urlOrigin == siteUrl) {
        window.location.href = siteUrl + "/Admin/Dashboard";
    }
}
function CloseSidebar() {
    $('body').addClass('closed-sidebar');
}
function inputLimit() {
    $('input[data-count]').on('click', function (e) {
        $('limit').remove('.count');
        $(this).after('<limit class="count"></limit>');
        t = $(this).data('count');
        $('input[data-count]').on('keyup', function (e) {
            $(this).siblings('limit').show();
            $(this).attr('maxlength', t);
            $(this).siblings('limit').text(t);
            len = $(this).val().length;
            r = parseInt(t) - parseInt(len);
            $(this).siblings('limit').text(r);
            if (r <= 0)
                $(this).css('border-color', 'red');
            else
                $(this).removeAttr('style');
        });
    });
}
function selectRow(id) {
    $(id).closest('tr').parents('tbody').find('tr').removeClass('select-row');
    $(id).closest('tr').addClass('select-row');
}
function searchTableh(txt, tbl) {
    $('#' + tbl + ' thead').on('keyup', '#' + txt, function () {
        var val = $(this).val().toLocaleLowerCase();
        $('#' + tbl + ' tbody tr').filter(function () {
            $(this).toggle($(this).text().toLocaleLowerCase().indexOf(val) > -1);
        });
    });
}
function hoverRow() {
    $('table tbody').on('mouseover', 'td', function () {
        $('table tbody').find('tr').removeAttr('style');
        $(this).closest('tr:not(.select-row)').css({ 'background': '#d0e8e5' });
    });
}
function onlyInt() {
    $('input[data-int]').on('keyup', function () {
        if (/\D/g.test(this.value)) this.value = this.value.replace(/\D/g, '');
    });
}
function query() {
    var vars = [], hash;
    var url = window.location.href.replace('#', '');
    var hashes = url.slice(url.indexOf('?') + 1).split('&');
    for (i = 0; i < hashes.length; i++) {
        hash = hashes[i].split('=');
        vars.push(hash[0]);
        vars[decodeURIComponent(hash[0])] = decodeURIComponent(hash[1]);
    }
    return vars;
}

function onlyChar() {
    $('input[data-char]').on('keyup', function () {
        if (/\d+/g.test(this.value)) this.value = this.value.replace(/\d+/g, '');
    });
}
function searchTable(txt, tbl) {
    $('#' + txt).on('keyup', function () {
        var val = $(this).val().toLocaleLowerCase();
        $('#' + tbl + ' tbody tr').filter(function () {
            $(this).toggle($(this).text().toLocaleLowerCase().indexOf(val) > -1);
        });
    });
}
function toggleFullScreen() {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen();
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        }
    }
}