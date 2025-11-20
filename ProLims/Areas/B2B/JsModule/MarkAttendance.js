$(document).ready(function () {
    LatLong()
    $('#ddlGlobalClientId').on('change', function () {
        LatLong() 
        updateMap();
    });
    AttDetails()   
});
function LatLong() {  
    var url = config.baseUrl + "/api/GeneralStore/MasterQueries";
    var objBO = {};
    objBO.prm_1 = $('#ddlGlobalClientId option:selected').val();
    objBO.Logic = 'LatLong';
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        contentType: "application/json;charset=utf-8",
        dataType: "JSON",
        success: function (data) {
            if (Object.keys(data.ResultSet).length) {
                if (Object.keys(data.ResultSet.Table).length) {                  
                    $.each(data.ResultSet.Table, function (key, val) {
                        $('#officeLat').val(val.lat);
                        $('#officeLon').val(val.long);
                    });    
                    updateMap();  
                }
            }           
        },
        error: function (response) {
            alert('Server Error...!');
        }
    });
}
function AttDetails() {
    $('#tblAttDetail tbody').empty();
    var url = config.baseUrl + "/api/GeneralStore/MasterQueries";
    var objBO = {};
    objBO.login_id = localStorage.getItem('jsEmpCode');
    objBO.Logic = 'AttDetails';
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        contentType: "application/json;charset=utf-8",
        dataType: "JSON",
        success: function (data) {
            if (data.ResultSet.Table.length > 0) {
                var tbody = '';
                var temp = '';       
                $.each(data.ResultSet.Table, function (key, val) {                     
                    tbody += "<tr>";
                    tbody += "<td>" + val.aStatus + "</td>";
                    tbody += "<td>" + val.wd + "</td>";
                    tbody += "<td>" + val.InTime + "</td>";
                    tbody += "<td>" + val.OutTime + "</td>";
                    tbody += "</tr>";
                });            
                $('#tblAttDetail tbody').append(tbody);        
            }
        },
        error: function (response) {
            alert('Server Error...!');
        }
    });
}
function MarkAtt(lat,long) {
    var url = config.baseUrl + "/api/Patient/Geo_AppAttendanceMarking";
    var objBO = {};
    objBO.CentreId = localStorage.getItem('ActiveClient');
    objBO.emp_code = localStorage.getItem('jsEmpCode');
    objBO.CurLat = lat;
    objBO.CurLong = long;
    objBO.AppName = 'JeenaSikho';    
    objBO.Logic = 'MarkAttendance';
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            if (data.includes('Success')) {
                alert(data);
                AttDetails();
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