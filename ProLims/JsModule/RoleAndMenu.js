$(document).ready(function () {
   
    if (localStorage.length == 0)
        window.location.href = (window.location.origin.includes('localhost')) ? '/' : "/expromate";    

    RolesInfo();

    if (localStorage.hasOwnProperty('menuAndSubMenu')) {
        loadMenuAndSubMenu();
    }
    LoadProfile()
    loadUnit()
    $('.main-menu ').on('click', '.slide', function () {
        //$('.main-menu .slide*').removeClass('open');
        //$('.main-menu .slide*').find('ul').toggle('slow');
        //$('.main-menu .slide*').removeClass('open');
        //$('.main-menu .slide*').find('ul').hide('slow');
        $(this).toggleClass('open');
        $(this).find('ul.slide-menu').toggle(260);
    });
    //setTimeout(function () { loadMenu('R012') }, 100)
});
function openmail() {
    window.location.href = config.rootUrl + '/WorkMate/WorkMate/MailBox';
}
function loadUnit() {
    if (localStorage.getItem('AllotedUnit').length == 2) {
        $('.ddlGlobalUnit').append($('<option selected></option>').val('-').html('Unit Not Alloted'));
        return
    }
    var data = JSON.parse(localStorage.getItem('AllotedUnit'));
    $('.ddlGlobalUnit').empty();
    var unitId = data[0].unit_id;
    $.each(data, function (key, val) {
        if (val.default_flag == 'Y')
            unitId = val.unit_id;

        $('.ddlGlobalUnit').append($('<option></option>').val(val.unit_id).html(val.unit_name));
    })
    unitId = (localStorage.hasOwnProperty('UnitId')) ? localStorage.getItem('UnitId') : unitId;
    setUnit(unitId)
}
function LoadProfile() {
    var gender = localStorage.getItem('sex');
    var src = (Object.keys(localStorage.getItem('photo')).length > 10) ? localStorage.getItem('photo') : (gender == 'M') ? config.rootUrl + '/images/male.png' : config.rootUrl + '/images/female.png';
    $('.headerProfile-dropdown img').prop('src', src);
    $('.my-auto h6').text(localStorage.getItem('Username'));
    $('.my-auto span').text(localStorage.getItem('designation'));
}
function FilterRoles(val) {
    $('#tablist1 li').filter(function () {
        $(this).toggle($(this).text().toLowerCase().indexOf(val) > -1);
    })
}
function RolesInfo() {
    var data = [...new Map(JSON.parse(localStorage.getItem('AllotedMenu')).map(item => [item['role_id'], item['role_name']]))];
    var html = "";
    $('ul[id=tablist1]').empty();
    $.each(data, function (key, val) {
        html += "<li class='nav-item' role='presentation'>";
        html += " <a class='nav-link' onclick=loadMenu('" + val[0] + "') data-roleid=" + val[0] + " data-bs-toggle='tab' href='#' aria-selected='false' role='tab' tabindex='-1'><i class='fe fe-bell fs-15 me-2'></i>" + val[1] + "</a>";
        html += "</li>";
    });
    $('ul[id=tablist1]').append(html);
}
function loadMenu(roleId) {
    GetMenuAndSubMenu(roleId)
    $('button[class=btn-close]').trigger('click');
    $('.app-sidebar').removeAttr('style')
    $('.app-sidebar .main-sidebar').show()
    $('.app-content').removeAttr('style')
    // $('.container-fluid').hide()
    $('.container-fluid:last').hide()
    //setInterval(function () {
    //    window.location.assign(config.rootUrl + '/Utility/Utility/Dashboard');
    //}, 500)   
}
function GetMenuAndSubMenu(roleId) {
    var data = JSON.parse(localStorage.getItem('AllotedMenu')).filter(item => item.role_id == roleId)
    localStorage.setItem('menuAndSubMenu', JSON.stringify(data));
    loadMenuAndSubMenu();
}
function loadMenuAndSubMenu() {
    var data = JSON.parse(localStorage.getItem('menuAndSubMenu'));
    $('ul[class=main-menu]').empty();
    if (Object.keys(data).length > 0) {
        var html = "";
        var mainMenu = [...new Map(data.map(item => [item['menu_id'], item])).values()];
        $.each(mainMenu, function (key, val) {
            html += "<li class='slide has-sub'>";
            html += "<a href='javascript:void(0);' class='side-menu__item'>";
            html += "<i class='" + val.icon + "'>&nbsp;&nbsp;</i>";
            html += "<span class='side-menu__label'>" + val.menu_name + "</span>";
            html += "<i class='fe fe-chevron-right side-menu__angle'></i>";
            html += "</a>";
            html += "<ul class='slide-menu child1'>";
            var subMenu = JSON.parse(localStorage.getItem('menuAndSubMenu')).filter(item => item.menu_id == val.menu_id);
            $.each(subMenu, function (key, val) {              
                html += "<li class='slide'>";
                html += "<a href=" + config.rootUrl + '/' + val.sub_menu_link + " class='side-menu__item'>" + val.sub_menu_name + "</a>";
                //html += "<a href='/Utility/Utility/MailBox' class='side-menu__item'>" + val.sub_menu_name + "</a>";
                html += "</li>";
            });
            html += "</ul>";
            html += "</li>";
        });
        $('ul[class=main-menu]').append(html);
    }
}
function removeJS(filename) {
    var tags = document.getElementsByTagName('script');
    for (var i = tags.length; i >= 0; i--) { //search backwards within nodelist for matching elements to remove
        if (tags[i] && tags[i].getAttribute('src') != null && tags[i].getAttribute('src').indexOf(filename) != -1)
            tags[i].parentNode.removeChild(tags[i]); //remove element by calling parentNode.removeChild()        
    }
}
function Logout() {
    localStorage.removeItem('LoginUser');
    localStorage.removeItem('AllotedRoles');
    localStorage.removeItem('AllotedUnit');
    localStorage.removeItem('AllotedDefaultUnit');
    localStorage.removeItem('UnitId');


    localStorage.removeItem('AllotedMenu');
    localStorage.removeItem('AllotedUnit');
    localStorage.removeItem('LoginUser');
    localStorage.removeItem('UnitId');
    localStorage.removeItem('UserID');
    localStorage.removeItem('Username');
    localStorage.removeItem('defaultRole');
    localStorage.removeItem('designation');
    localStorage.removeItem('menuAndSubMenu');
    localStorage.removeItem('photo');
    localStorage.removeItem('sex');
    localStorage.clear();
    Active.unitId = "";
    $('.ddlGlobalUnit').empty();
    window.location.href = (window.location.origin.includes('localhost')) ? '/' : "/expromate";
}
