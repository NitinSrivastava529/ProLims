function Login() {
    if ($('#txtEmpCode').val() == '') {
        alert('Please Provide Emp Code')
        return
    }
    if ($('#txtEmpCode').val().length>10) {
        alert('Emp Code not in Correct Format')
        return
    }
    if ($('#txtPassword').val() == '') {
        alert('Please Provide Password')
        return
    }
    var url = config.baseUrl + "/api/Patient/B2B_PatientQueries";
    var objBO = {};
    objBO.unitId = 'CH01';
    objBO.compId = '-';
    objBO.clientId = '-';
    objBO.from = '1900/01/01';
    objBO.to = '1900/01/01';
    objBO.Prm1 = $('#txtPassword').val();
    objBO.Prm2 = '-';
    objBO.Prm3 = '-';
    objBO.loginId = $('#txtEmpCode').val();
    objBO.Logic = "Login1";                                                                                   
    $.ajax({
        method: "POST",
        url: url,
        data: JSON.stringify(objBO),
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            console.log(data)
            if (!data.Msg.includes('Success')) {
                alert(data.Msg)
                return
            }
            if (data.ResultSet.Table.length > 0) {
                $.each(data.ResultSet.Table, function (key, val) {
                    localStorage.setItem('jsEmpCode', val.emp_code)
                    localStorage.setItem('jsEmpName', val.emp_name)
                    localStorage.setItem('jsClientInfo', JSON.stringify(data.ResultSet.Table1))
                    localStorage.setItem('ActiveClient', data.ResultSet.Table1[0].ClientId)
                    window.location.href = config.rootUrl + '/B2B/Patient/Dashboard';
                });               
            }
        },
        error: function (response) {
            alert('Server Error...!');
        }
    });
}