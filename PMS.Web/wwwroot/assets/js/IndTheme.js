

var ApplyTheme = true;


if (ApplyTheme) {

    const backgroundColor = '#006847';

    const loginForm = document.querySelector('.login.login-4 .login-form');
    if (loginForm) {
        loginForm.style.background = backgroundColor;
    }
    var lgnBtn = document.getElementById("lgnBtn");
    if (lgnBtn) {
        lgnBtn.style.background = "#66A491";

    }

    const body = document.body;
    body.style.background = backgroundColor;




    var companyLogo = '../../../assets/media/logos/hl-logo.png';
    var visionLogo = '../../../assets/media/logos/vision-logo.svg';
    var themelogoatlogin = 'assets/media/logos/twq-icon.svg';
    var sideimg = '../../../assets/media/logos/side-image.png';

    var logoatlogin = document.getElementById("logoatlogin");
    if (logoatlogin) {
        var IndLoginBgImg = '../../../assets/media/bg/indoor-login.png';
        var loginbackground = document.getElementById("IndLoginBg");
        loginbackground.style.backgroundImage = "url('" + IndLoginBgImg + "')";
        loginbackground.style.textAlign = "center";

        loginbackground.classList.replace("bgi-position-center", "bgi-position-bottom");


        var logoAndNote = document.getElementById("logoAndNote");

        logoAndNote.innerHTML = "";
        logoatlogin.style.paddingTop = "60px";
        var logoatlogin = document.getElementById("loginheight");
        logoatlogin.classList.replace("h-100", "pt-5");
    }

    var img = document.createElement("img");
    img.setAttribute("alt", "logo");
    img.setAttribute("id", "themelogoatlogin");
    img.setAttribute("src", themelogoatlogin);
    var anchor = document.getElementById("logoAnchor");
    if (anchor) {
        anchor.appendChild(img);
    }

    debugger
    //card-custom
    var ktcontentbg = document.getElementById("kt_content");
    if (ktcontentbg) {
        var ktcontentimg = '../../../assets/media/bg/baji.jpg';
        ktcontentbg.style.backgroundImage = "url('" + ktcontentimg + "')";
        ktcontentbg.style.backgroundSize = "cover";
        ktcontentbg.style.backgroundPosition = "center";
        ktcontentbg.style.backgroundRepeat = "no-repeat";
    }

    //Dashboard-top-left-logo
    var img = document.createElement("img");
    img.setAttribute("alt", "logo");
    img.setAttribute("id", "dashboardtopleftId");
    img.setAttribute("src", companyLogo);
    var dashboardTopLeftLogo = document.getElementById("dashboardTopLeftLogo");
    if (dashboardTopLeftLogo) {
        dashboardTopLeftLogo.appendChild(img);
    }

    var dashboardtopleftId = document.getElementById("dashboardtopleftId");
    if (dashboardtopleftId) {
        dashboardtopleftId.style.width = "60px";
    }

    var centertitle = document.createElement("h3");
    centertitle.innerHTML = "   حلمنا العليا و واقعنا وصل ";
    centertitle.classList.add("m-0");
    var dashboardTopCenterTitle = document.getElementById("dashboardTopCenterTitle");
    if (dashboardTopCenterTitle) {
        dashboardTopCenterTitle.style.color = "#006847";
        dashboardTopCenterTitle.appendChild(centertitle);
    }


    //Dashboard-top-left-logo
    var img = document.createElement("img");
    img.setAttribute("alt", "logo");
    img.setAttribute("id", "dashboardtopRightId");
    img.setAttribute("src", visionLogo);
    var dashboardTopRightLogo = document.getElementById("dashboardTopRightLogo");
    if (dashboardTopRightLogo) {
        dashboardTopRightLogo.appendChild(img);
    }
    var dashboardtopRightId = document.getElementById("dashboardtopRightId");
    if (dashboardtopRightId) {
        dashboardtopRightId.style.width = "70px";
    }
    var kt_header_menu_wrapper = document.getElementById("kt_header_menu_wrapper");
    if (kt_header_menu_wrapper) {
        kt_header_menu_wrapper.remove();
    }


    var dashtopsec = document.getElementById("dashtopsec");
    if (dashtopsec) {
        dashtopsec.style.width = "80%";
    }


    var ktcontentbg = document.getElementById("kt_content");
    if (ktcontentbg) {
        var ktcontentimg = '../../../assets/media/bg/ind-dash-bg.png';
        ktcontentbg.style.backgroundImage = "url('" + ktcontentimg + "')";
        ktcontentbg.style.backgroundSize = "cover";
        ktcontentbg.style.backgroundPosition = "center";
        ktcontentbg.style.backgroundRepeat = "no-repeat";
        ktcontentbg.style.marginTop = "15px";
        ktcontentbg.style.padding = "15px";
        ktcontentbg.style.height = "84vh";

    }



    debugger
    var ktasidemenu = document.getElementById("kt_aside_menu");
    if (ktasidemenu) {
        var img = document.createElement("img");
        img.setAttribute("alt", "logo");
        img.setAttribute("id", "sideimgId");
        img.setAttribute("src", sideimg);
        ktasidemenu.appendChild(img);
    }

    const cardcustomTheme = document.querySelector('.card-custom');
    if (cardcustomTheme) {
        cardcustomTheme.style.backgroundColor = "rgba(255,255,255,0.95)";
    }
    const dataTableTheme = document.querySelector('.datatable-table');
    if (dataTableTheme) {
        dataTableTheme.style.backgroundColor = "transparent";
    }















    
}
else {
    var dashtopsec = document.getElementById("dashtopsec");
    if (dashtopsec) {
        dashtopsec.remove();

    }
}