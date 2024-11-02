const BaseUrl = 'http://localhost:7037';   


//const BaseUrl = 'http://54.87.64.111:9090'
//const BaseUrl = 'http://54.87.64.111:89'
//const BaseUrl = 'http://10.228.41.10:89'


var ajaxCallParams = {};
var ajaxDataParams = {};

let sessionExpired = false;

function disableAddBtn() {
    var el = document.getElementById('addBtn');
    if (el) {
        el.display = 'none'
    }
}

disableAddBtn();


//document.addEventListener('contextmenu', function (e) {
//    e.preventDefault();
//});

//document.addEventListener('keydown', function (e) {
//    if ((e.ctrlKey && (e.key === 'c' || e.key === 'u')) || e.key === 'F12') {
//        e.preventDefault();
//    }
//});

// Generic function for all ajax calls
function ajaxCall(calls, dataParams, callback) {
    $("#divLoader").show();

    $.ajax({
        type: callParams.Type,
        url: callParams.Url,
        beforeSend: function (xhr) {
            xhr.setRequestHeader("XSRF-TOKEN",
                $('input:hidden[name="__RequestVerificationToken"]').val());
        },
        async: true,
        dataType: 'json',
        data: dataParams,
        cache: false,
        success: function (response) {
            $("#divLoader").hide();
            callback(response);
            setupSessionTimeoutCheck();
        },
        error: function (response) {
            $("#divLoader").hide();
            callback(response);
            setupSessionTimeoutCheck();
        }
    });
}

function commonFetch(Url, RequestOptions, Callback) {

    if (RequestOptions.headers != null && !RequestOptions.headers.has("AccessToken")) {
        RequestOptions.headers.append("AccessToken", getTokenFromSessionStorage());
        RequestOptions.headers.append("RequestType", "WA");
    }
    else {
        var headers = new Headers();
        headers.append("AccessToken", getTokenFromSessionStorage());
        headers.append('RequestType', "WA");

        RequestOptions.headers = headers;
    }

    setLoader();
    try {
        RequestOptions.headers.append("View", getCurrentViewName());
        fetch(Url, RequestOptions)
            .then(response => {

                var newToken = response.headers.get('accesstoken');
                if (newToken) {
                    sessionStorage.setItem("token", newToken);
                }
                console.log(Url, newToken)
                hideLoader_();
                if (response.status == 401) {
                    sessionStorage.clear();

                    showSessionExpiredModal();
                    sessionExpired = true;
                    return Promise.reject("Session expired. Please log in again.");
                }
                return response.json();
            })
            .then(data => {
                //$("#divLoader").hide();
                Callback(data)
            })
            .catch(err => {
                if (err !== "Session expired. Please log in again.") {
                    hideLoader_();
                    showSweetAlert('error', "Error", err);
                }
            })
    } catch (e) {
        showSweetAlert('error', "Error", e);
    }
}
function showSweetAlert(icon, title, text) {
    Swal.fire({
        icon: icon,
        title: getTranslation(title),
        text: getTranslation(text),
        confirmButtonText: getTranslation("OK"),
    });
}
function commonAjaxCall(requestType, requestUrl, requestParams, postData, callback) {
    $("#divLoader").show();
    $.ajax({
        type: requestType,
        url: requestUrl,
        contentType: (requestParams == null || requestParams.ContentType == null) ? "application/json" : requestParams.ContentType == null ? "application/json" : requestParams.ContentType,
        headers: getRequestHeaders(requestUrl),
        beforeSend: function (xhr) {
            //xhr.setRequestHeader("XSRF-TOKEN", $('input:hidden[name="__RequestVerificationToken"]').val());
        },
        async: true,
        dataType: 'json',
        data: postData,
        cache: false,
        success: function (response) {
            $("#divLoader").hide();
            callback(response);
            sessionStorage.removeItem("UserStory");
            //setupSessionTimeoutCheck();
        },
        error: function (response) {
            $("#divLoader").hide();
            callback(response);
            sessionStorage.removeItem("UserStory");
            setupSessionTimeoutCheck();
        }
    });
}
function sessionajaxCall(callParams, dataParams, callback) {

    $.ajax({
        type: callParams.Type,
        url: callParams.Url,
        beforeSend: function (xhr) {
            xhr.setRequestHeader("XSRF-TOKEN",
                $('input:hidden[name="__RequestVerificationToken"]').val());
        },
        dataType: 'json',
        data: dataParams,
        cache: false,
        success: function (response) {
            callback(response);
        },
        error: function (response) {
            callback(response);
        }
    });
}

function checkSession() {    
    ajaxCallParams.Type = 'POST';
    ajaxCallParams.Url = "/Admin/CheckIfSessionValid";
    try {
        sessionajaxCall(ajaxCallParams, ajaxDataParams, function (result) {
            
            console.log(result)
            if (result) {
                setupSessionTimeoutCheck();
            }
            else {
                $('#sessionOut').modal('show');
            }
        });
    }
    catch (e) {
        console.log(e);
    }
}

function setupSessionTimeoutCheck() {
    clearTimeout(checkTimeout);
    checkTimeout = setTimeout(checkSession, 1230000);
}

function ajaxCallFileUpload(callParams, dataParams, callback) {

    $.ajax({
        type: callParams.Type,
        url: callParams.Url,
        beforeSend: function (xhr) {
            xhr.setRequestHeader("XSRF-TOKEN",
                $('input:hidden[name="__RequestVerificationToken"]').val());
        },
       dataType: 'json',
        //contentType: 'multipart/form-data',
        data: dataParams,
        cache: false,
        success: function (response) {

            callback(response);
        },
        error: function (response) {
            callback(response);
        }
    });
}
//Generic Function for Post-Redirect

function getTokenFromSessionStorage() {
    return sessionStorage.getItem('token');
}
function setTokenToSessionStorage(token) {
    return sessionStorage.setItem('token',token);
}

function PostRedirect(formID,Id)
{
    //setEventType(formID);   
    var form = document.getElementById(formID);
    $('#'+formID).append("<input type='hidden' name='Id' value='" +
        Id + "' />");
    form.submit();
}

function GetSetupsBySetupType() {
    
    $("#divLoader").show();
    CountryURL =Url + "/api/Setup/getsetupsbysetuptype";
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    // myHeaders.append("Authorization", "Bearer " + getTokenFromSessionStorage());
    var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
    };
    commonFetch(CountryURL, requestOptions, function (data) {
        if (data != undefined && data != null) {
            var StringifiedJson = JSON.stringify(data);
            setSetupsInSessionStorage(StringifiedJson);

            MSetupIteraion(data);
        }
        else {
            showSweetAlert('', "Invalid Response", "")
        }
    })
    //fetch(CountryURL, requestOptions)
    //    .then(response => response.json())
    //    .then(data => {
    //        $("#divLoader").hide();
    //        var StringifiedJson = JSON.stringify(data);
    //        setSetupsInSessionStorage(StringifiedJson); 
         
    //        MSetupIteraion(data);
    //    })
    //    .catch(error => console.log('error', error));

}

function changeLangToggleText() {
    var langId = localStorage.getItem('languageId');
    var rtlStylesheet = $('#rtl-stylesheet');
    
    if (langId) {
        if (langId == 0) {
            $('#toggle-rtl span.ltxt').text('العربية');
            rtlStylesheet.prop('disabled', true);
        }
        else {
            $('#toggle-rtl span.ltxt').text('EN');
            rtlStylesheet.prop('disabled', false);
        }
    }
    else {
        $('#toggle-rtl span.ltxt').text('العربية');
        rtlStylesheet.prop('disabled', true);
        localStorage.setItem('languageId', 0);
    }
}

function GetLabelsTranslation() {
    var SetupDetailsUrl = BaseUrl + "/api/configuration/getlabelstranslation";
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", "Bearer " + getTokenFromSessionStorage());

    var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
    };
    commonFetch(SetupDetailsUrl, requestOptions, function (data) {
        if (data != undefined || data != null) {
            console.log('localization', data);
            localStorage.setItem('localization', JSON.stringify(data.data));
        }
        else {
            showSweetAlert('error', 'Invalid Response', '');
        }
    });
}

function GetMenuEntity() {
    
    $("#divLoader").show();
    var userId = sessionStorage.getItem("userId");
    CountryURL = BaseUrl + "/api/Setups/" + userId + "/getMenuEntity";
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    // myHeaders.append("Authorization", "Bearer " + getTokenFromSessionStorage());
    var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
    };
    commonFetch(CountryURL, requestOptions, function (data) {
        if (data != undefined && data != null) {
            var StringifiedJson = JSON.stringify(data.data);
            setSetupsInSessionStorage(StringifiedJson);
            generateMenuHTML(data.data)
        }
        else {
            showSweetAlert('', "Invalid Response", "")
        }
    })
    //fetch(CountryURL, requestOptions)
    //    .then(response => response.json())
    //    .then(data => {
    //        $("#divLoader").hide();
    //        var StringifiedJson = JSON.stringify(data.data);
    //        setSetupsInSessionStorage(StringifiedJson);
    //        generateMenuHTML(data.data) 
            

    //       // MSetupIteraion(data);
    //    })
    //    .catch(error => {
    //        $("#divLoader").hide();
    //        console.log('error', error);
    //    });
}



function generateMenuHTML(data, langId) {
    
    //console.log(data);
    var menuContainer = document.getElementById('kt_aside_menu');
    menuContainer.innerHTML = "";
    var ul = document.createElement('ul');
    ul.classList.add('menu-nav');
    ul.classList.add('ind_menu');
    ul.id = 'masterSetup_menus';
    ul.style.display = 'block';
    data = data.filter(item => !(item.entityName === "Master Setup" && item.entityTypeName === "Menu"));

    debugger
    var languageId = null;
    if (langId) {
        languageId = langId; //localStorage.getItem('languageId');
    }
    else {
        languageId = localStorage.getItem('languageId');
    }
     
    debugger

    // Loop through the JSON data and create list items
    data.forEach(function (menuItem) {
        var li = document.createElement('li');
        if (menuItem.tabs.length > 0) {

            var li = document.createElement('li');
            li.classList.add('menu-item', 'menu-item-submenu');
            li.setAttribute('aria-haspopup', 'true');
            li.setAttribute('data-menu-toggle', 'hover');

            var a = document.createElement('a');
            a.href = 'javascript:;';
            a.classList.add('menu-link', 'menu-toggle');

            var div = document.createElement('div');
            div.classList.add('d-itm-img');

            //var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
            //svg.setAttribute('viewBox', '0 0 24 24');
            //svg.setAttribute('width', '24');
            //svg.setAttribute('height', '24');

            //var path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            //path.setAttribute('d', menuItem.entityExpression);

            //path.appendChild(document.createTextNode(''));
            //svg.appendChild(path);

            var img = document.createElement('img');
            img.setAttribute('src', '/assets/icons/'+menuItem.entityExpression);

            var span = document.createElement('span');
            span.classList.add('menu-text');
            span.textContent = languageId == 1 ? menuItem.entityNameAr : menuItem.entityName;

            var iArrow = document.createElement('i');
            iArrow.classList.add('menu-arrow');

            var divSubmenu = document.createElement('div');
            divSubmenu.classList.add('menu-submenu');

            var iSubmenuArrow = document.createElement('i');
            iSubmenuArrow.classList.add('menu-arrow');

            var ulSubnav = document.createElement('ul');
            ulSubnav.classList.add('menu-subnav');
            

            // Iterate over submenu items
            menuItem.tabs.forEach(function (submenuItem) {
                if (submenuItem.entityTypeName == "Sub Menu"){
                    var liSubmenuItem = document.createElement('li');
                    liSubmenuItem.classList.add('menu-item');
                    liSubmenuItem.setAttribute('aria-haspopup', 'true');

                    var aSubmenuItem = document.createElement('a');
                    aSubmenuItem.classList.add('menu-link');

                    if (submenuItem.entityExpression != "") {
                        aSubmenuItem.onclick = function () {
                            var expressionValues = submenuItem.entityExpression.split(',');
                            // Remove single quotes from the values
                            expressionValues = expressionValues.map(value => value.replace(/'/g, ''));
                            sessionStorage.setItem("SetupName", expressionValues[1])
                            setupMenu.apply(null, expressionValues);
                        };
                    }
                    else {
                        aSubmenuItem.href = submenuItem.entityUrl;

                    }

                    var iSubmenuItemBullet = document.createElement('i');
                    iSubmenuItemBullet.classList.add('menu-bullet', 'menu-bullet-dot');

                    var spanSubmenuItem = document.createElement('span');

                    spanSubmenuItem.classList.add('menu-text');
                    spanSubmenuItem.textContent = languageId == 1 ? submenuItem.entityNameAr : submenuItem.entityName;
                    spanSubmenuItem.setAttribute('id', 'MatchName');

                    // Construct the DOM tree for submenu item
                    iSubmenuItemBullet.appendChild(document.createTextNode(''));
                    aSubmenuItem.appendChild(iSubmenuItemBullet);
                    aSubmenuItem.appendChild(spanSubmenuItem);
                    liSubmenuItem.appendChild(aSubmenuItem);
                    ulSubnav.appendChild(liSubmenuItem);
                }
                
            });

            iSubmenuArrow.appendChild(document.createTextNode(""));
            divSubmenu.appendChild(iSubmenuArrow);
            divSubmenu.appendChild(ulSubnav);

            // Construct the DOM tree for the main menu item
            div.appendChild(img);
            a.appendChild(div);
            a.appendChild(span);
            a.appendChild(iArrow);
            li.appendChild(a);
            li.appendChild(divSubmenu);
        }
        else {
            
            li.classList.add('menu-item');
            li.setAttribute('aria-haspopup', 'true');

            var a = document.createElement('a');
            a.href = menuItem.entityUrl;
            a.classList.add('menu-link');

            var div = document.createElement('div');
            div.classList.add('d-itm-img');
            var img = document.createElement('img');
            img.setAttribute('src', '/assets/icons/' + menuItem.entityExpression);

            //var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
            //svg.setAttribute('viewBox', '0 0 24 24');
            //svg.setAttribute('width', '24');
            //svg.setAttribute('height', '24');

            //var path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            //path.setAttribute('d', menuItem.entityExpression);

            var span = document.createElement('span');
            span.classList.add('menu-text');
            span.textContent = languageId == 1 ? menuItem.entityNameAr : menuItem.entityName;

            //// Construct the DOM tree
            //path.appendChild(document.createTextNode(''));
            //svg.appendChild(path);
            div.appendChild(img);
            a.appendChild(div);
            a.appendChild(span);
            li.appendChild(a);
        }
        ul.appendChild(li);
    });

    menuContainer.appendChild(ul);


    if (ApplyTheme) {

        if (sessionStorage.getItem('companyType') != "Tawtheeq") {
            if (menuContainer) {
                var img = document.createElement("img");
                img.setAttribute("alt", "logo");
                img.setAttribute("id", "sideimgId");
                img.setAttribute("src", sideimg);
                menuContainer.appendChild(img);

                var sideimgId = document.getElementById("sideimgId");
                if (sideimgId) {
                    sideimgId.style.position = "sticky";
                    sideimgId.style.bottom = "18px";
                    sideimgId.style.borderRadius = "0 0 15px 15px";
                    sideimgId.style.width = "100%";
                    sideimgId.style.pointerEvents = "none";

                }


                const sideimgfix = document.querySelector('.ind_menu');
                if (sideimgfix) {
                    sideimgfix.style.height = "100%";
                }

            }
        }
        const dataTableTheme = document.querySelector('.datatable-table');
        if (dataTableTheme) {
            dataTableTheme.style.backgroundColor = "transparent";
        }



        debugger
        const menuLinks = document.querySelectorAll('.menu-link');
        const menuTxts = document.querySelectorAll('.menu-text');

        menuLinks.forEach(function (menuLink, index) {
            menuLink.addEventListener('mouseover', function () {
                // Apply styles to the corresponding .menu-text and .menu-link
                //menuTxts[index].style.setProperty('color', 'white', 'important');
                menuLink.style.setProperty('background-color', '#99C3B5', 'important');
            });

            menuLink.addEventListener('mouseout', function () {
                // Reset the styles for both .menu-text and .menu-link
               // menuTxts[index].style.removeProperty('color');
                menuLink.style.removeProperty('background-color');
            });
        });

    }

}
function MSetupIteraion(data)
{
    const menuList = document.getElementById('masterSetupMenu');
    let menuHTML = `<li class="menu-item  menu-item-parent" aria-haspopup="true">
                                                <span class="menu-link">
                                                    <span class="menu-text">Master Setup</span>
                                                </span>
                                            </li>`;
    data.forEach(item => {
        menuHTML += `
                     <li class="menu-item" aria-haspopup="true">
                                              <a onclick="setupMenu(${item.setupCode}, '${item.setupValue}',${item.parentSetupId})" class="menu-link" >\
                                <i class="menu-bullet menu-bullet-dot"><span></span></i>
                                <span class="menu-text">${item.shortDescription}</span>
                            </a>
                        </li>
                    `;


    });
    menuHTML += `
                     <li class="menu-item" aria-haspopup="true">
                                              <a onclick="countryurl('Country')" class="menu-link" >\
                                <i class="menu-bullet menu-bullet-dot"><span></span></i>
                                <span class="menu-text">Country</span>
                            </a>
                        </li>
                    `;
    menuHTML += `
                     <li class="menu-item" aria-haspopup="true">
                                              <a onclick="stateurl('State')" class="menu-link" >\
                                <i class="menu-bullet menu-bullet-dot"><span></span></i>
                                <span class="menu-text">State</span>
                            </a>
                        </li>
                    `;
    menuHTML += `
                     <li class="menu-item" aria-haspopup="true">
                                              <a onclick="cityurl('City')" class="menu-link" >\
                                <i class="menu-bullet menu-bullet-dot"><span></span></i>
                                <span class="menu-text">City</span>
                            </a>
                        </li>
                    `;
    menuHTML += `
                     <li class="menu-item" aria-haspopup="true">
                                              <a onclick="makesurl('Makes')" class="menu-link" >\
                                <i class="menu-bullet menu-bullet-dot"><span></span></i>
                                <span class="menu-text">Makes</span>
                            </a>
                        </li>
                    `;
    menuHTML += `
                     <li class="menu-item" aria-haspopup="true">
                                              <a onclick="modelurl('Models')" class="menu-link" >\
                                <i class="menu-bullet menu-bullet-dot"><span></span></i>
                                <span class="menu-text">Models</span>
                            </a>
                        </li>
                    `;
    menuList.innerHTML = menuHTML;


    
    var setupname = sessionStorage.getItem("SetupName");
    var myString = $(location).attr('pathname');
    var myStringArray = myString.split('/');
    // $('[href*="' + myString + '"]', 'li[aria-haspopup="true"] > a > span:contains('{setupname}')').parent().addClass('menu-item-active')
    // $('[href*="' + myString + '"]', 'li[aria-haspopup="true"] > a > span:contains('{ setupname }')').parents('li.menu-item.menu-item-submenu').addClass('menu-item-open')
    if (setupname != undefined) {
       // $('li[aria-haspopup="true"] > a > span:contains("' + setupname + '")').closest('li').addClass('menu-item-active')
       // $('li[aria-haspopup="true"] > a > span:contains("' + setupname + '")').closest('li.menu-item.menu-item-submenu').addClass('menu-item-open')


        $('li[aria-haspopup="true"] > a > span').filter(function () {
            return $(this).text() === setupname;
        }).closest('li').addClass('menu-item-active');

        $('li[aria-haspopup="true"] > a > span').filter(function () {
            return $(this).text() === setupname;
        }).closest('li.menu-item.menu-item-submenu').addClass('menu-item-open');


        var $menuContainer = $("#kt_aside_menu");
        var $activeMenuItem = $(".menu-item-active"); // You should replace "active" with the class you use for the active item.

        if ($activeMenuItem.length) {
            // Calculate the position of the active menu item within the container
            var containerTop = $menuContainer.offset().top;
            var itemTop = $activeMenuItem.offset().top;

            // Calculate the scroll position
            var scrollTop = itemTop - containerTop;

            // Scroll the container to the active item
            $menuContainer.scrollTop(scrollTop);
        }

        //var activeItem = document.querySelector(".menu-item-active");

        //// Check if the active item exists
        //if (activeItem) {
        //    // Scroll to the active item
        //    activeItem.scrollIntoView({
        //        behavior: "auto", // You can change this to "auto" for instant scrolling
        //        block: "start",     // Scroll to the top of the active item
        //    });
        //}
    }

    sessionStorage.removeItem("SetupName");
}



function setSetupsInSessionStorage(data) {
    sessionStorage.setItem('MasterSetupAtLayout', data); // Replace 'yourKey' with an appropriate key
}

function getSetupsFromSessionStorage() {
    return sessionStorage.getItem('MasterSetupAtLayout'); // Replace 'yourKey' with the appropriate key
}
function countryurl(name) {
    var adminUrl = "/Admin/GetCountry"; 
    sessionStorage.setItem("SetupName", name);
    window.location.href = adminUrl;
}

function stateurl(name) {
    var adminUrl = "/Admin/GetState";
    sessionStorage.setItem("SetupName", name);
    window.location.href = adminUrl;
}
function cityurl(name) {
    var adminUrl = "/Admin/GetCity";
    sessionStorage.setItem("SetupName", name);
    window.location.href = adminUrl;
}

function makesurl(name) {
    var adminUrl = "/Admin/GetMakes";
    sessionStorage.setItem("SetupName", name);
    window.location.href = adminUrl;
}
function modelurl(name) {
    var adminUrl = "/Admin/GetModels";
    sessionStorage.setItem("SetupName", name);
    window.location.href = adminUrl;
}

function goBack() {
    window.history.back();
}

function showSurvey(action) {
    debugger
    $("#divLoader").show();

    var url = BaseUrl + "/api/Survey/GetSurvey";
    var data = {
        userId: sessionStorage.getItem('userId'),
        companyId: parseInt(sessionStorage.getItem('companyId')),
        tenantId: parseInt(sessionStorage.getItem('TenantId')),
        companyType: sessionStorage.getItem('companyType'),
        actionName: action,
        actionCode: action,
        notificationType: action == null ? "EMB" : "EVB",
    };

    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", "Bearer " + getTokenFromSessionStorage());

    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        redirect: 'follow',
        body: JSON.stringify(data)

    };
    commonFetch(url, requestOptions, function (data) {
        debugger
        if (data != null && data != undefined) {
            if (data.success) {
                $("#divLoader").hide();

                if (data.dynamicData.length > 0) {

                    var langId = localStorage.getItem('languageId');

                    var modalHtml = `
        <div class="modal fade fpass-cnfrm" id="addSurveyModal" data-backdrop="static" tabindex="-1" role="dialog" aria-labelledby="surveyModal" aria-hidden="true">
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                    <!-- Modal Header -->
                    <div class="modal-header">
                          <h5 class="modal-title" id="addSurveyModal">` + getTranslation('Fill_Survey') + `</h5>
                         <!-- <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <i aria-hidden="true" class="ki ki-close"></i>
                        </button>-->
                    </div>
                    
                    <div class="modal-body pt-0">
                        <form id="surveyForm">`;

                    var groupedSurveys = {};
                    var isAddFeedBack = false;

                    // Group questions by survey ID
                    data.dynamicData.forEach(function (qa) {
                        if (!groupedSurveys[qa.surveyId]) {
                            groupedSurveys[qa.surveyId] = [];
                        }
                        groupedSurveys[qa.surveyId].push(qa);
                        if (qa.isAddFeedBack) {
                            isAddFeedBack = true;
                        }
                    });

                    // Render each survey
                    Object.keys(groupedSurveys).forEach(function (surveyId) {
                        var surveyTitle = (langId == 0 ? data.dynamicData[0].surveyTitle : data.dynamicData[0].surveyTitleAr);
                        modalHtml += `
                        <div class="survey-group">
                                <h5>` + getTranslation('Survey_Title_Popup') + `: ` + surveyTitle + `</h5>
                            <input type="hidden" id="SurveyId" name="SurveyId" value="` + surveyId + `">
                            <div class="survey-questions">`;

                        groupedSurveys[surveyId].forEach(function (qa, index) {
                            modalHtml += `
                            <div class="form-group">
                                <label style="text-transform: none;" ><strong>` + (index + 1) + `. ` + (langId == 0 ? qa.question : qa.questionAR) + `</strong></label>
                                <div class="survey-answers">`;
                            // Handle TXTBOX
                            if (qa.answerTypeId == "TXTBOX") {
                                    if (qa.answers.length > 0) {
                                                modalHtml += `
                                            <div class="form-group">
                                                <input type="text"  class="form-control" name="question_` + qa.questionId + `"  data-surveydetail-id="` + qa.answers[0].surveyDetailId + `"  data-question-id="` + qa.questionId + `" placeholder="Enter your answer" maxlength="100">
                                            </div>`;
                                      }
                             }
                            // Handle RT (Rating 1-10)
                            else if (qa.answerTypeId == "RT") {
                                modalHtml += `<div class="rating-box-group" style="display: flex; justify-content: space-between; width: 100%;">`;
                                // Append rating boxes from 1 to 10
                                for (let i = 1; i <= 10; i++) {
                                    modalHtml += `
                                    <div class="rating-box" style="display: inline-block; padding: 10px; border: 1px dashed #ccc; cursor: pointer; flex-grow: 1; text-align: center;"
                                         data-value="` + i + `" 
                                         data-surveydetail-id="` + qa.answers[0].surveyDetailId + `"
                                         data-question-id="` + qa.questionId + `">
                                        ` + i + `
                                    </div>`;
                                }
                                modalHtml += `</div>`;
                            }
                            // Handle RADIOBTN
                            else if (qa.answerTypeId == "RADIOBTN") {
                                qa.answers.forEach(function (answer) {
                                    modalHtml += `
                                    <div class="form-check" style="display: flex; align-items: center;">
                                        <input class="form-check-input" type="radio" name="question_` + qa.questionId + `" data-surveydetail-id="` + answer.surveyDetailId + `" data-question-id="` + qa.questionId + `" data-answer-id="` + answer.answerId + `" value="` + (langId == 0 ? answer.answer : qa.answerAR) + `" id="answer_` + answer.answerId + `">
                                        <label class="form-check-label" style="text-transform: none; margin-left: 10px;" for="answer_` + answer.answerId + `">` + (langId == 0 ? answer.answer : qa.answerAR)  + `</label>
                                    </div>`;
                                });
                            }
                            // Handle MS (Multi-Select)
                            else if (qa.answerTypeId == "MS") {
                                modalHtml += `
                            <div class="form-group">
                                <div class="multi-select-checkboxes">`;

                                qa.answers.forEach(function (answer) {
                                    modalHtml += `
                                    <div class="form-check" style="display: flex; align-items: center; text-transform: none;">
                                        <input class="form-check-input" type="checkbox" 
                                            name="question_` + qa.questionId + `[]" 
                                            data-surveydetail-id="` + answer.surveyDetailId + `" 
                                            data-question-id="` + qa.questionId + `" 
                                            data-answer-id="` + answer.answerId + `" 
                                            value="` + (langId == 0 ? answer.answer : qa.answerAR) + `" 
                                            id="answer_` + answer.answerId + `">
                                        <label class="form-check-label" style="text-transform: none; margin-left: 10px;" for="answer_` + answer.answerId + `">` + (langId == 0 ? answer.answer : qa.answerAR) + `</label>
                                    </div>`;
                                                            });

                                                            modalHtml += `
                                    </div>
                                </div>`;
                            }


                            modalHtml += `
                    </div>
                </div>`;
                        });

                        modalHtml += `</div></div><hr>`;
                    });

                    if (isAddFeedBack) {
                        modalHtml += `
                        <div class="form-group">
                             <label for="feedbackText" style="text-transform: none;">` + getTranslation('Feedback_Title_Popup') + `</label>
                            <textarea class="form-control" id="feedbackText" name="feedbackText" rows="7" placeholder="Please provide your feedback" maxlength="250"></textarea>
                        </div>`;
                         }

                    modalHtml += `
                      <button type="submit" class="btn btn-secondary">${getTranslation('Submit_Survey_Btn')}</button>
                      <button type="button" class="btn btn-secondary" id="notifyLaterButton">${getTranslation('Notify_Later_Btn')}</button>
                    </form>
                </div>
            </div>
        </div>
    </div>`;
                    var div = document.createElement('div');
                    div.innerHTML = modalHtml;
                    document.body.appendChild(div);

                    var modalContainer = document.getElementById('modalContainer');

                    // Check if the modalContainer exists
                    if (modalContainer) {
                        modalContainer.appendChild(div);
                    } 



                    $("#addSurveyModal").modal({
                        backdrop: 'static'
                    });

                    $('#surveyForm').on('submit', function (e) {
                        $("#divLoader").show();
                        e.preventDefault();  
                        var formData = {
                            userId: sessionStorage.getItem('userId'),
                            companyId: parseInt(sessionStorage.getItem('companyId')),
                            tenantId: parseInt(sessionStorage.getItem('TenantId')),
                            companyType: sessionStorage.getItem('companyType'),
                            actionName: action,
                            notificationType: action == null ? "EMB" : "EVB",
                            surveyId: $('#SurveyId').val(),
                            feedback: $('#feedbackText').val(),
                            answers: [] 
                        };

                        var hasMissingAnswers = false; // Flag to track if any question is unanswered
                        debugger
                        // Loop through each survey question
                        $(this).find('.survey-answers').each(function () {
                            var questionId = $(this).find('input').first().data('question-id'); // Get the question ID
                            var isAnyChecked = $(this).find('input[type="checkbox"]:checked').length > 0; // Check if any checkbox in the group is selected
                            var hasRatingSelected = $(this).find('.rating-box.selected').length > 0; // Check for selected rating-box
                            var isAnyRadioChecked = $(this).find('input[type="radio"]:checked').length > 0; // Check for radio buttons

                            var answerValue;

                            // If the current question is a group of checkboxes, make sure at least one is selected
                            if ($(this).find('input[type="checkbox"]').length > 0 && !isAnyChecked) {
                                hasMissingAnswers = true; // Mark that the question has no selected checkbox
                                return false; // Exit the loop for early validation failure
                            }

                            // If the current question is a group of checkboxes, ensure at least one is selected
                            if ($(this).find('.rating-box').length > 0 && !hasRatingSelected) {
                                hasMissingAnswers = true; // Mark that the question has no selected checkbox
                                return false; // Exit the loop for early validation failure
                            }

                            // If the current question is a group of checkboxes, ensure at least one is selected
                            if ($(this).find('input[type="radio"]').length > 0 && !isAnyRadioChecked) {
                                hasMissingAnswers = true; // Mark that the question has no selected checkbox
                                return false; // Exit the loop for early validation failure
                            }

                            // Handle other input types (e.g., radio buttons, text, select, etc.)
                            $(this).find('input:checked, input[type="text"], select, .rating-box.selected').each(function () {
                                var answerId = $(this).data('answer-id');
                                var surveyDetailId = $(this).data('surveydetail-id');

                                if ($(this).is('input[type="text"]')) {
                                    answerValue = $(this).val(); // Textbox value
                                } else if ($(this).is('input[type="radio"]:checked')) {
                                    answerValue = $(this).val(); // Radio button value
                                } else if ($(this).is('input[type="checkbox"]:checked')) {
                                    answerValue = $(this).val(); // Checkbox value
                                } else if ($(this).is('select')) {
                                    answerValue = $(this).val(); // Selected value from dropdown
                                } else if ($(this).hasClass('rating-box')) {
                                    answerValue = $(this).data('value').toString(); // Rating value
                                }

                                // Check if answerValue is empty or null
                                if (!answerValue || (Array.isArray(answerValue) && answerValue.length === 0)) {
                                    hasMissingAnswers = true; // Mark that a question is unanswered
                                    return false; // Break the loop if there's a missing answer
                                }

                                // Handle checkbox arrays and push data to formData
                                if (Array.isArray(answerValue)) {
                                    answerValue.forEach(function (value) {
                                        formData.answers.push({
                                            questionId: questionId,
                                            answerId: answerId,
                                            surveyDetailId: surveyDetailId,
                                            answer: value,
                                        });
                                    });
                                } else {
                                    formData.answers.push({
                                        questionId: questionId,
                                        answerId: answerId,
                                        surveyDetailId: surveyDetailId,
                                        answer: answerValue,
                                    });
                                }
                            });
                        });

                        // Check if there are missing answers and stop submission if any question is unanswered
                        if (hasMissingAnswers) {
                            $("#divLoader").hide();
                            alert('Please answer all the questions before submitting the survey.');
                            return; // Stop submission if any question is unanswered
                        }


                        var url = BaseUrl + "/api/Survey/SubmitSurvey";
                        var myHeaders = new Headers();
                        myHeaders.append("Content-Type", "application/json");  // Set content type to JSON
                       // myHeaders.append("Authorization", "Bearer " + getTokenFromSessionStorage());  // Add Authorization token

                        var requestOptions = {
                            method: 'POST',
                            headers: myHeaders,
                            redirect: 'follow',
                            body: JSON.stringify(formData)  
                        };
                        commonFetch(url, requestOptions, function (data) {
                            $("#divLoader").hide();

                            if (data != null && data != undefined) {
                                if (data.success) {
                                    $("#divLoader").hide();
                                    $("#addSurveyModal").modal('hide');
                                    $("#SubmitSurveySucessModal").modal('show'); 
                                }
                                else {
                                    alert("Submission failed. Please try again.");
                                }
                            }
                        });
                    });


















                    // Event listener for Notify Later button
                    document.getElementById('notifyLaterButton').addEventListener('click', function () {
                        const requestData = {
                            userId: sessionStorage.getItem('userId'),
                            companyId: parseInt(sessionStorage.getItem('companyId')),
                            tenantId: parseInt(sessionStorage.getItem('TenantId')),
                            companyType: sessionStorage.getItem('companyType'),
                            actionName: action,
                            notificationType: action == null ? "EMB" : "EVB",
                            surveyId: parseInt($('#SurveyId').val())
                        };

                        const url = BaseUrl + "/api/Survey/NotifyLater"; 

                        const myHeaders = new Headers();
                        myHeaders.append("Content-Type", "application/json");
                       // myHeaders.append("Authorization", "Bearer " + getTokenFromSessionStorage());

                        const requestOptions = {
                            method: 'POST',
                            headers: myHeaders,
                            body: JSON.stringify(requestData),
                            redirect: 'follow'
                        };
                        commonFetch(url, requestOptions, function (data) {
                            if (data != null && data != undefined) {
                                if (data.success) {
                                    alert('You will be notified later!');
                                    $("#addSurveyModal").modal('hide');
                                }
                                else
                                {
                                    alert('Failed to notify later. Please try again.');
                                }
                            }
                        });

                        //fetch(url, requestOptions)
                        //    .then(response => response.json())
                        //    .then(data => {
                        //        if (data.success) {
                        //            alert('You will be notified later!');
                        //            $("#addSurveyModal").modal('hide'); 
                        //        } else {
                        //            alert('Failed to notify later. Please try again.');
                        //        }
                        //    })
                        //    .catch(error => {
                        //        console.error('Error:', error);
                        //        alert('An error occurred. Please try again.');
                        //    });
                    });



                    // Add this part to handle clicks on rating boxes
                    document.addEventListener('click', function (e) {
                        // Check if the clicked element is a rating-box
                        if (e.target.classList.contains('rating-box')) {
                            let questionId = e.target.getAttribute('data-question-id');

                            // Remove 'selected' class from all rating-boxes for this question
                            document.querySelectorAll(`.rating-box[data-question-id="${questionId}"]`).forEach(function (box) {
                                box.classList.remove('selected');
                                box.style.backgroundColor = '';  // Reset background
                                box.style.color = '';  // Reset text color
                            });

                            // Add 'selected' class to the clicked box
                            e.target.classList.add('selected');
                            e.target.style.backgroundColor = '#007bff';  // Change color to blue
                            e.target.style.color = '#fff';  // Change text to white

                            // Optional: Log the selected value
                            let selectedValue = e.target.getAttribute('data-value');
                            console.log('Selected rating for question ' + questionId + ': ' + selectedValue);
                        }
                    });



                }
                else
                {
                    alert('No survey questions found.');
                }
            }
        }
        else
        {
            showSweetAlert('error', (data.message != null && data.message != undefined) ? data.message : "Invalid Response", "");
        }
    });
}













function showEmailSurvey(action) {
    debugger
    $("#divLoader").show();

    var url = BaseUrl + "/api/Survey/GetSurvey";
    var data = {
        userId: document.getElementById("UserId").value,
        surveyId: parseInt(document.getElementById("SurveyId").value),
        //actionName: action,
        notificationType: "EMB",
    };

    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", "Bearer " + getTokenFromSessionStorage());

    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        redirect: 'follow',
        body: JSON.stringify(data)

    };
    commonFetch(url, requestOptions, function (data) {
        debugger
        if (data != null && data != undefined) {
            if (data.success) {
                $("#divLoader").hide();

                if (data.dynamicData.length > 0) {
                    var formHtml = `
            <div class="survey-form" style="background-color: white; border: 1px solid #ccc;  border-radius: 5px;  padding: 20px;  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);  margin: 20px 0;">
                <h5 style="text-align: left;">Please fill the below Survey</h5>
               `;

                    var groupedSurveys = {};
                    var isAddFeedBack = false;

                    // Group questions by survey ID
                    data.dynamicData.forEach(function (qa) {
                        if (!groupedSurveys[qa.surveyId]) {
                            groupedSurveys[qa.surveyId] = [];
                        }
                        groupedSurveys[qa.surveyId].push(qa);
                        if (qa.isAddFeedBack) {
                            isAddFeedBack = true;
                        }
                    });

                    // Render each survey
                    Object.keys(groupedSurveys).forEach(function (surveyId) {
                        var surveyTitle = data.dynamicData[0].surveyTitle; // Assuming the title is the same for all
                        formHtml += `
                <div class="survey-group">
                    <h5>` + surveyTitle + `</h5>
                    <input type="hidden" id="SurveyId" name="SurveyId" value="` + surveyId + `">
                    <div class="survey-questions">`;

                        groupedSurveys[surveyId].forEach(function (qa, index) {
                            formHtml += `
                    <div class="form-group">
                        <label style="text-transform: none;"><strong>` + (index + 1) + `. ` + qa.question + `</strong></label>
                        <div class="survey-answers">`;

                            // Handle TXTBOX
                            if (qa.answerTypeId == "TXTBOX") {
                                formHtml += `
                            <div class="form-group">
                                <input type="text" class="form-control" name="question_` + qa.questionId + `" data-surveydetail-id="` + qa.answers[0].surveyDetailId + `" data-question-id="` + qa.questionId + `" placeholder="Enter your answer" maxlength="100">
                            </div>`;
                            }
                            // Handle RT (Rating 1-10)
                            else if (qa.answerTypeId == "RT") {
                                formHtml += `<div class="rating-box-group" style="display: flex; justify-content: space-between; width: 100%;">`;
                                // Append rating boxes from 1 to 10
                                for (let i = 1; i <= 10; i++) {
                                    formHtml += `
                            <div class="rating-box" style="display: inline-block; padding: 10px; border: 1px dashed #ccc; cursor: pointer; flex-grow: 1; text-align: center;"
                                 data-value="` + i + `"
                                 data-surveydetail-id="` + qa.answers[0].surveyDetailId + `"
                                 data-question-id="` + qa.questionId + `">
                                ` + i + `
                            </div>`;
                                }
                                formHtml += `</div>`;
                            }
                            // Handle RADIOBTN
                            else if (qa.answerTypeId == "RADIOBTN") {
                                qa.answers.forEach(function (answer) {
                                    formHtml += `
                            <div class="form-check" style="display: flex; align-items: center;">
                                <input class="form-check-input" type="radio" name="question_` + qa.questionId + `" data-surveydetail-id="` + answer.surveyDetailId + `" data-question-id="` + qa.questionId + `" data-answer-id="` + answer.answerId + `" value="` + answer.answer + `" id="answer_` + answer.answerId + `">
                                <label class="form-check-label"  style="text-transform: none; margin-left: 10px;" for="answer_` + answer.answerId + `">` + answer.answer + `</label>
                            </div>`;
                                });
                            }
                            // Handle MS (Multi-Select)
                            else if (qa.answerTypeId == "MS") {
                                formHtml += `
                                        <div class="form-group">
                                            <div class="multi-select-checkboxes">`;

                                qa.answers.forEach(function (answer) {
                                    formHtml += `
                                            <div class="form-check" style="display: flex; align-items: center; text-transform: none;">
                                                <input class="form-check-input" type="checkbox" 
                                                    name="question_` + qa.questionId + `[]" 
                                                    data-surveydetail-id="` + answer.surveyDetailId + `" 
                                                    data-question-id="` + qa.questionId + `" 
                                                    data-answer-id="` + answer.answerId + `" 
                                                    value="` + answer.answer + `" 
                                                    id="answer_` + answer.answerId + `">
                                                <label class="form-check-label"  style="text-transform: none; margin-left: 10px;"  for="answer_` + answer.answerId + `">` + answer.answer + `</label>
                                            </div>`;
                                });

                                formHtml += `
                                    </div>
                                </div>`;
                            }

                            formHtml += `
                    </div>
                </div>`;
                        });

                        formHtml += `</div></div><hr>`;
                    });

                    if (isAddFeedBack) {
                        formHtml += `
                <div class="form-group">
                    <label for="feedbackText" style="text-transform: none;">Feedback</label>
                    <textarea class="form-control" id="feedbackText" name="feedbackText" rows="7" placeholder="Please provide your feedback"  maxlength="250"></textarea>
                </div>`;
                    }

                    formHtml += `  <div class = "text-right">              
                                     <button type="submit" class="btn btn-secondary">Submit Survey</button>
                                    <button type="button" class="btn btn-secondary" id="notifyEmailLaterButton">Notify Later</button>
                                     </div>`;
                    ` </div>`;

                    // Assuming you have a specific container in your HTML to display the survey form
                    document.getElementById('modalContainer').innerHTML = formHtml; // Inject the form into a specific container
                    // Add the submit button outside the injected form to avoid nesting issues
                    //var submitButtonHtml = `<button type="submit" class="btn btn-primary">Submit Survey</button>`;
                    //document.getElementById('modalContainer').insertAdjacentHTML('beforeend', submitButtonHtml);



                    $('#surveyEmailForm').on('submit', function (e) {
                        debugger
                        console.log('Form submitted');
                        $("#divLoader").show();
                        e.preventDefault();
                        e.stopPropagation(); // Stop event from bubbling
                        var formData = {
                            userId: document.getElementById("UserId").value,
                            // companyId: parseInt(sessionStorage.getItem('companyId')),
                            //  tenantId: parseInt(sessionStorage.getItem('TenantId')),
                            //   companyType: sessionStorage.getItem('companyType'),
                            // actionName: action,
                            notificationType: "EMB",
                            //surveyId: $('#SurveyId').val(),
                            surveyId: parseInt(document.getElementById("SurveyId").value),

                            feedback: $('#feedbackText').val(),
                            answers: []
                        };

                        var hasMissingAnswers = false; // Flag to track if any question is unanswered


                        $(this).find('.survey-answers').each(function () {
                            var questionId = $(this).find('input').first().data('question-id'); // Get the question ID
                            var isAnyChecked = $(this).find('input[type="checkbox"]:checked').length > 0; // Check if any checkbox in the group is selected
                            var hasRatingSelected = $(this).find('.rating-box.selected').length > 0; // Check for selected rating-box
                            var isAnyRadioChecked = $(this).find('input[type="radio"]:checked').length > 0; // Check for radio buttons

                            var answerValue;

                            // If the current question is a group of checkboxes, ensure at least one is selected
                            if ($(this).find('input[type="checkbox"]').length > 0 && !isAnyChecked) {
                                hasMissingAnswers = true; // Mark that the question has no selected checkbox
                                return false; // Exit the loop for early validation failure
                            }
                            // If the current question is a group of checkboxes, ensure at least one is selected
                            if ($(this).find('.rating-box').length > 0 && !hasRatingSelected) {
                                hasMissingAnswers = true; // Mark that the question has no selected checkbox
                                return false; // Exit the loop for early validation failure
                            }


                            // If the current question is a group of checkboxes, ensure at least one is selected
                            if ($(this).find('input[type="radio"]').length > 0 && !isAnyRadioChecked) {
                                hasMissingAnswers = true; // Mark that the question has no selected checkbox
                                return false; // Exit the loop for early validation failure
                            }




                            // Now loop through checked inputs, text inputs, selects, and rating boxes
                            $(this).find('input:checked, input[type="text"], select, .rating-box.selected').each(function () {
                                var answerId = $(this).data('answer-id');
                                var surveyDetailId = $(this).data('surveydetail-id');

                                if ($(this).is('input[type="text"]')) {
                                    answerValue = $(this).val(); // Textbox value
                                } else if ($(this).is('input[type="radio"]:checked')) {
                                    answerValue = $(this).val(); // Radio button value
                                } else if ($(this).is('input[type="checkbox"]:checked')) {
                                    answerValue = $(this).val(); // Checkbox value
                                } else if ($(this).is('select')) {
                                    answerValue = $(this).val(); // Selected value from dropdown
                                } else if ($(this).hasClass('rating-box')) {
                                    answerValue = $(this).data('value').toString(); // Rating value
                                }

                                // Check if answerValue is empty or null

                                if (!answerValue || (Array.isArray(answerValue) && answerValue.length === 0)) {
                                    hasMissingAnswers = true; // Mark that a question is unanswered
                                    return false; // Break the loop if there's a missing answer
                                }

                                if (Array.isArray(answerValue)) {
                                    answerValue.forEach(function (value) {
                                        formData.answers.push({
                                            questionId: questionId,
                                            answerId: answerId,
                                            surveyDetailId: surveyDetailId,
                                            answer: value,
                                        });
                                    });
                                }
                                else {
                                    formData.answers.push({
                                        questionId: questionId,
                                        answerId: answerId,
                                        surveyDetailId: surveyDetailId,
                                        answer: answerValue,
                                    });
                                }
                            });

                        });

                        // Check if there are missing answers and stop submission if any question is unanswered
                        if (hasMissingAnswers) {
                            $("#divLoader").hide();
                            alert('Please answer all the questions before submitting the survey.');
                            return; // Stop submission if any question is unanswered
                        }
                        var url = BaseUrl + "/api/Survey/SubmitSurvey";
                        var myHeaders = new Headers();
                        myHeaders.append("Content-Type", "application/json");  // Set content type to JSON

                        var requestOptions = {
                            method: 'POST',
                            headers: myHeaders,
                            redirect: 'follow',
                            body: JSON.stringify(formData)
                        };
                        commonFetch(url, requestOptions, function (data) {
                            $("#divLoader").hide();

                            if (data != null && data != undefined) {
                                if (data.success) {
                                    $("#divLoader").hide();
                                    $("#SubmitEmailSurveySucessModal").modal('show');
                                }
                                else {
                                    alert("Submission failed. Please try again.");
                                }
                            }
                        });
                    });


                    

                    // Event listener for Notify via Email Later button
                    document.getElementById('notifyEmailLaterButton').addEventListener('click', function () {
                        const requestData = {
                            userId: document.getElementById("UserId").value,
                            //companyId: parseInt(sessionStorage.getItem('companyId')),
                            //tenantId: parseInt(sessionStorage.getItem('TenantId')),
                            //companyType: sessionStorage.getItem('companyType'),
                            // actionName: action,
                            notificationType:  "EMB",
                            //surveyId: parseInt($('#SurveyId').val())
                            surveyId: parseInt(document.getElementById("SurveyId").value),

                        };

                        const url = BaseUrl + "/api/Survey/NotifyLater";

                        const myHeaders = new Headers();
                        myHeaders.append("Content-Type", "application/json");

                        const requestOptions = {
                            method: 'POST',
                            headers: myHeaders,
                            body: JSON.stringify(requestData),
                            redirect: 'follow'
                        };


                        commonFetch(url, requestOptions, function (data) {
                            if (data != null && data != undefined) {
                                if (data.success) {
                                    alert('You will be notified later!');
                                    $("#addSurveyModal").modal('hide');
                                    // Redirect to the login page after the alert and modal close
                                    var url = "/Account/Login";
                                    window.location.replace(url);
                                } else {
                                    alert('Failed to notify later. Please try again.');
                                }
                            }
                        });


                        //fetch(url, requestOptions)
                        //    .then(response => response.json())
                        //    .then(data => {
                        //        if (data.success) {
                        //            alert('You will be notified later!');
                        //            $("#addSurveyModal").modal('hide');

                        //            // Redirect to the login page after the alert and modal close
                        //            var url = "/Account/Login";
                        //            window.location.replace(url);

                        //        } else {
                        //            alert('Failed to notify later. Please try again.');
                        //        }
                        //    })
                        //    .catch(error => {
                        //        console.error('Error:', error);
                        //        alert('An error occurred. Please try again.');
                        //    });
                    });


                    // Add this part to handle clicks on rating boxes
                    document.addEventListener('click', function (e) {
                        // Check if the clicked element is a rating-box
                        if (e.target.classList.contains('rating-box')) {
                            let questionId = e.target.getAttribute('data-question-id');

                            // Remove 'selected' class from all rating-boxes for this question
                            document.querySelectorAll(`.rating-box[data-question-id="${questionId}"]`).forEach(function (box) {
                                box.classList.remove('selected');
                                box.style.backgroundColor = '';  // Reset background
                                box.style.color = '';  // Reset text color
                            });

                            // Add 'selected' class to the clicked box
                            e.target.classList.add('selected');
                            e.target.style.backgroundColor = '#007bff';  // Change color to blue
                            e.target.style.color = '#fff';  // Change text to white

                            // Optional: Log the selected value
                            let selectedValue = e.target.getAttribute('data-value');
                            console.log('Selected rating for question ' + questionId + ': ' + selectedValue);
                        }
                    });

                }
                else {
                    alert('No survey questions found.');
                }
            }
            else {
                document.getElementById('modalContainer').innerHTML = `<p style = color:red>${data.message}</p>`;
            }
        }
        else {
            showSweetAlert('error', (data.message != null && data.message != undefined) ? data.message : "Invalid Response", "");
        }
    });
}


// Function to handle redirection
function redirectToLogin() {
    var url = "/Account/Login"; // Specify the URL to redirect to
    window.location.replace(url); // Redirects the user
}









function clearSessionStorageAndLogout() {
    var token = sessionStorage.getItem('token');  // Replace 'yourTokenKey' with the actual key you use for storing the token


    // Make a request to the API endpoint for token expiration
    //expireTokenOnServer(token)
    //    .then(() => {
            sessionStorage.clear();
            var currentUrl = window.location.href;
            var origin = currentUrl.split('/').slice(0, 3).join('/');
            window.location.href = origin;

    // Add the following lines to manipulate the browser history
    history.pushState(null, null, origin);
    window.addEventListener('popstate', function () {
        history.pushState(null, null, origin);
    });
        //})
        //.catch(error => {
        //    // Handle error if the token expiration request fails
        //    console.error('Failed to expire token:', error);
        //});
}

function expireTokenOnServer(token) {
    debugger

    // Replace 'yourApiEndpoint' with the actual API endpoint for token expiration
    return fetch(BaseUrl + '/auth/auth/expiretoken', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(token), // Assuming your server expects a string directly
    });
}

function logoutUser() {
    var requestOptions = {
            method: 'POST',
            redirect: 'follow',
    };
    commonFetch(BaseUrl + "/auth/logout", requestOptions, function (data) {
        if (data != null && data != undefined) {
            fetch("/account/logout").then(response => {
                debugger
                clearSessionStorageAndLogout();
            }).catch(err => showSweetAlert('error', "Error logging out", err))
        }
        else {
            showSweetAlert('error', "Invalid Response", "")
        }
    })
}
//function GetErrorDescriptionForEntities(token) {
//    debugger
//    $("#divLoader").show();
//    var myHeaders = new Headers();
//    myHeaders.append("Content-Type", "application/json");
//    debugger

//    var requestOptions = {
//        method: 'POST',
//        headers: myHeaders,
//        redirect: 'follow',
//        body: JSON.stringify(token)
//    };
//    fetch(BaseUrl + "/Auth/expiretoken", requestOptions)
//        .then(response => response.json())
//        .then(errorResult => {

//        });
//}


//function expireTokenOnServer(token) {
//    ajaxCallParams.Type = 'POST';
//    ajaxCallParams.Url = "/Auth/expiretoken";
//    body: JSON.stringify({ token: token }),

//    try {
//        sessionajaxCall(ajaxCallParams, ajaxDataParams, function (result) {

//        });
//    }
//    catch (e) {
//        console.log(e);
//    }
//}
function setLoader() {
    $("#divLoader").show();
    var loadCount = sessionStorage.getItem("LoadingCount");
    if (loadCount == null) {
        sessionStorage.setItem("LoadingCount", 1);
    }
    else {
        var count = parseInt(loadCount);
        loadCount = count + 1;
        sessionStorage.setItem("LoadingCount", loadCount);
    }
}
function hideLoader_() {
    var loadCount = sessionStorage.getItem("LoadingCount")
    var count = parseInt(loadCount);
    loadCount = count - 1;
    sessionStorage.setItem("LoadingCount", loadCount);

    if (loadCount == null || loadCount == undefined || isNaN(loadCount)) {
        $("#divLoader").hide();
    }
    else if (parseInt(loadCount) <= 0) {
        $("#divLoader").hide();
    }
}

function getCurrentViewName() {
    var url = window.location.href;
    var segments = url.split('/');
    var viewName = segments[segments.length - 1];
    return viewName;
}

function getUserStory() {
    var story = sessionStorage.getItem("UserStory");
    var b64Story = btoa(story)

    sessionStorage.removeItem("UserStory");
    return b64Story;
}

function isTokenExpired() {
    var token = sessionStorage.getItem("token");
    if (token != null) {
        const base64Url = token.split(".")[1];
        const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
        const jsonPayload = decodeURIComponent(
            atob(base64)
                .split("")
                .map(function (c) {
                    return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
                })
                .join("")
        );

        const { exp } = JSON.parse(jsonPayload);
        const expired = Date.now() >= exp * 1000
        return expired
    }
}

function showSessionExpiredModal() {
    if (!sessionExpired) {
        Swal.fire({
            icon: 'warning',
            title: 'Session Timed Out',
            text: "Your session has expired. Please login again"
        }).then(function () {
            logoutUser();
        });
    }
    
    
}


function GetAllActionType() {
    CountryURL = BaseUrl + "/api/Setups/getdetailsbysetuptype";
    redirectUrl = "/Setups/getdetailsbysetuptype";
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    
    var filterModel = {
        Id: null,
        Value: null,
        CheckList: ["Action Type"]
    };

    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        redirect: 'follow',
        body: JSON.stringify(filterModel)
    };

    commonFetch(CountryURL, requestOptions, function (data) {
        if (data != undefined || data != null) {
            ActionType = data.data;
            var actions = [];
            ActionType.forEach(function (item) {
                var data = {
                    ActionId: item.setupId,
                    ActionCode: item.setupCode,
                    ActionName: item.shortDescription
                };

                actions.push(data);
            });

            sessionStorage.setItem("Actions", JSON.stringify(actions));
        }
        else {
            showSweetAlert('error', 'Invalid Response', '');
        }
    });
}

function getActionsForSelectedMenu() {
    let matchingObject = {};
    const targetUrl = sessionStorage.getItem('menuSelection');
    var menuData = JSON.parse(sessionStorage.getItem("MasterSetupAtLayout"));
    if (targetUrl.includes('MasterSetup')) {
        var menuItem = sessionStorage.getItem("currentMenuItem");
        if (menuItem) {
            var temp = menuData.find(item => item.entityName == menuData);
            if (temp == undefined || temp.length == 0) {
                temp = menuData.forEach(item => {
                    if (item.tabs && item.tabs.length > 0) {
                        const matchingTab = item.tabs.find(tab => tab.entityName == menuItem);
                        if (matchingTab) {
                            matchingObject = matchingTab.actions;
                        }
                    }
                    else {
                        const matchingObj = item.tabs.find(tab => tab.entityName == menuItem);
                        if (matchingObj) {
                            matchingObject = matchingObj.actions;
                        }
                    }
                    
                });
            }
        }
    }
    else {
        menuData.forEach(menuItem => {
            if (menuItem.tabs && menuItem.tabs.length > 0) {
                const matchingTab = menuItem.tabs.find(tab => tab.entityUrl === targetUrl);
                if (matchingTab) {
                    matchingObject = matchingTab.actions; //{ ...menuItem, tabs: [matchingTab] };
                }
            }
            else {
                const matchingTab = menuItem.entityUrl === targetUrl ? menuItem : null;
                if (matchingTab) {
                    matchingObject = matchingTab.actions; //{ ...menuItem, tabs: [matchingTab] };
                }
            }
        });
    }

    if (matchingObject) {
        console.log("Actions:", matchingObject);
    } else {
        console.log("No matching object found for the given URL in tabs.");
    }

    return matchingObject;
}


function setActionsForView() {
    try {
        var actions = getActionsForSelectedMenu();
        var allActions = JSON.parse(sessionStorage.getItem("Actions"));

        if (actions && allActions) {
            var addAction = allActions.filter(item => item.ActionCode == "ACTA")[0];
            var editAction = allActions.filter(item => item.ActionCode == "ACTE")[0];

            var canAdd = false;
            var canEdit = false;
            actions.forEach(function (item) {
                if (item.actionId == addAction.ActionId) {
                    canAdd = true;
                }
                else if (item.actionId == editAction.ActionId) {
                    canEdit = true;
                }
            });
        }
        //if (canAdd) {
        //    document.getElementById('addBtn');
        //    el.display = '';
        //}
        //if (!canAdd) {
        //    document.getElementById('addBtn').remove();
        //}
        //if (!canEdit) {
        //    document.getElementById('editBtn').remove();
        //}

        //if (canAdd) {
        //    document.getElementById('addBtn');
        //    el.display = '';
        //}
    } catch (e) {
        console.error(e);
    }
    return { Addable: canAdd, Editable: canEdit };
}

function getGridTimeoutInMS() {
    var timeout = sessionStorage.getItem("gridTimeout")
    var timeoutInMs = parseInt(timeout) * 1000;
    return parseInt(timeoutInMs);
}

function getInboxCounts() {
    var myHeaders = new Headers();
    myHeaders.append("AccessToken", getTokenFromSessionStorage());
    var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow',
    };

    return new Promise(function (resolve, reject) {
        var info = sessionStorage.getItem("InboxInfo");
        if (info === null) {
            fetch(BaseUrl + "/api/ContractManagement/getInboxCounts", requestOptions)
                .then(response => {
                    var newToken = response.headers.get('accesstoken');
                    if (newToken) {
                        sessionStorage.setItem("token", newToken);
                    }
                    return response.json()

                })
                .then(data => {
                    console.log(data);
                    if (data != null && data.success) {
                        sessionStorage.setItem("InboxInfo", JSON.stringify(data));
                        bindInboxData(data);
                        resolve(true);
                    }
                    else {
                        showSweetAlert('error', 'Invalid Response', "");
                        reject(false);
                    }
                })
                .catch(err => {
                    showSweetAlert('error', "Error", err);
                    reject(false);
                })
        }
        else {
            var info = sessionStorage.getItem("InboxInfo");
            var data = JSON.parse(info);
            bindInboxData(data);
        }
    });
    

    //commonFetch(BaseUrl + "/api/ContractManagement/getInboxCounts", requestOptions, function (data) {

    //    if (data != null && data.success) {
    //        document.getElementById('count').innerText = data.data.totalCount;
    //        var compCount = document.getElementById('CompanyCount');
    //        if (compCount) {
    //            compCount.innerText = data.data.repoCompanyCount;
    //        }

    //        var makeCount = document.getElementById('MakeCount');
    //        if (makeCount) {
    //            makeCount.innerText = data.data.requestAssetCount;
    //        }

    //        var ticketCount = document.getElementById('ticketCount');
    //        if (ticketCount) {
    //            ticketCount.innerText = data.data.ticketsCount;
    //        }

    //        sessionStorage.setItem('SupportingDocData', JSON.stringify(data.dynamicData));
    //    }
    //    else {
    //        showSweetAlert('error', 'Invalid Response', data.message);
    //    }
    //});
}

function bindInboxData(data) {
    debugger
    document.getElementById('count').innerText = data.data.totalCount;
    var compCount = document.getElementById('CompanyCount');
    if (compCount) {
        compCount.innerText = data.data.repoCompanyCount;
    }

    var makeCount = document.getElementById('MakeCount');
    if (makeCount) {
        makeCount.innerText = data.data.requestAssetCount;
    }

    var ticketCount = document.getElementById('ticketCount');
    if (ticketCount) {
        ticketCount.innerText = data.data.ticketsCount;
    }

    sessionStorage.setItem('SupportingDocData', JSON.stringify(data.dynamicData));
}

function setSupportingDocMimeType() {
    try {
        var sizeLimit = sessionStorage.getItem("SupportingDocData");
        var json = JSON.parse(sizeLimit);
        var spDocElement = document.getElementById('supportingdocumentsupload');//.innerText = json["SizeLimit"];
        spDocElement.setAttribute("accept", json["allowedMimeTypes"]);
    } catch (e) {
        console.log(e);
    }
}


function localized() {
    var elements = document.querySelectorAll('[data_val]', '[data-field]');
    var defaultElements = document.querySelectorAll('[default-val]');
    var langId = localStorage.getItem('languageId');
    var localization = JSON.parse(localStorage.getItem('localization'));
    var path = window.location.pathname.substring(1)
    var combinedPath = path != "" ? ("/" + window.location.pathname.substring(1)) : null;
    var labels = localization.formDictionaries.filter(item => item.entityURL == combinedPath && item.languageId == langId);
    
    elements.forEach(function (element) {
        var entityType = element.getAttribute('data_val').toLowerCase();
        var value = getLabelValue(labels, entityType);
        if (value == undefined || value == null || value == "true") {
            value = element.innerHTML;
        } 

        if (element.tagName.toLowerCase() === 'input' || element.tagName.toLowerCase() === 'textarea') {
            if (value != "true" && value != "") {
                element.placeholder = value
            }
        } else {
            element.innerHTML = value;
        }
    });
    
    defaultElements.forEach(function (element) {
        var entityType = element.getAttribute('default-val').toLowerCase();
        var labels = localization.formDictionaries.filter(item => item.entityURL == null && item.languageId == langId);
        var value = getLabelValue(labels, entityType);
        if (value == undefined || value == null || value == "true") {
            value = element.innerHTML;
        }
        if (element.tagName.toLowerCase() === 'input') {
            if (value != "true" && value != "") {
                element.placeholder = value
            }
        } else {
            element.innerHTML = value;
        }
    });
}

function getLabelValue(labels, entityType) {
    var dataValue = entityType;
    labels.forEach(function (element) {
        var labelsObj = element.labels;
        var matchingKey = Object.keys(labelsObj).find(key => key.toLowerCase() === entityType);
        if (matchingKey != undefined) {
            dataValue = matchingKey ? labelsObj[matchingKey] : entityType;
            return dataValue;
        }
    });

    return dataValue;
}

function getGridTitle(entityType) {
    var localization = JSON.parse(localStorage.getItem('localization'));
    var langId = localStorage.getItem('languageId');
    var path = window.location.pathname.substring(1);
    var combinedPath = path != "" ? ("/" + window.location.pathname.substring(1)) : null;
    var labels = localization.formDictionaries.filter(item => item.entityURL == combinedPath && item.languageId == langId);

    var entityTypeLower = entityType.toLowerCase();
    var dataValue = entityType;
    labels.forEach(function (element) {
        var labelsObj = element.labels;
        var matchingKey = Object.keys(labelsObj).find(key => key.toLowerCase() === entityTypeLower);
        if (matchingKey != undefined) {
            dataValue = matchingKey ? labelsObj[matchingKey] : '';
            return dataValue;
        }
    });
    return dataValue;
}

function getTranslation(message) {
    var localization = JSON.parse(localStorage.getItem('localization'));
    var langId = localStorage.getItem('languageId');
    var translation = localization.dictionary.find(function (element) {
        return element.entityValue == message.toLowerCase() && element.languageId == langId;
    });

    return translation ? translation.fieldTranslation : message;
}

function localizeValidationMessages() {
    var validationSpans = document.querySelectorAll('span.errormsg');
    validationSpans.forEach(function (span) {
        var validationKey = span.innerText;
        
        var translatedMessage = getTranslation(validationKey);

        span.textContent = translatedMessage;
    });
}


function resetSessionExpiredFlag() {
    sessionExpired = false;
}


function downloadFile(fileName, downloadURL) {
    var token = getTokenFromSessionStorage();
    //var downloadUrl = BaseUrl + '/api/Setups/Reports/' + data + '/downloadfile';

    var headers = new Headers();
    headers.append("AccessToken", `${token}`);
    headers.append("RequestType", "WA");

    fetch(downloadURL, {
        method: 'GET',
        headers: headers
    })
        .then(response => {
            if (response.ok) {
                return response.blob(); // Get the file as a blob
            } else {
                throw new Error('File download failed');
            }
        })
        .then(blob => {
            // Create a URL for the file and initiate the download
            var url = window.URL.createObjectURL(blob);
            var a = document.createElement('a');
            a.href = url;
            a.download = fileName; // Use the file name for the download
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url); // Clean up the object URL
        })
        .catch(error => {
            console.error('Download error:', error);
            showSweetAlert('error', 'File could not be downloaded!', error.message);
        });
}



function ValidateArabic(fld, e) {

    //var strCheck = 'ذض ص ث ق ف غ ع ه خ ح ج دش س ي ب ل ا ت ن م ك ط ئءؤرلاى ةوزظ';
    var strCheck = '0123456789!@#$%^&*()-_=+[]{};:,.<>? ذض ص ث ق ف غ ع ه خ ح ج دش س ي ب ل ا ت ن م ك ط ئءؤرلاى ةوزظ';

    var whichCode = e.which ? e.which : e.keyCode;

    if (whichCode == 13 || whichCode == 8 || whichCode == 9) return true;
    key = String.fromCharCode(whichCode);
    if (strCheck.indexOf(key) == -1)
        return false;

    return true;
}

function ValidateNonArabic(fld, e) {
    // Allowed characters (English letters, numbers, common symbols, and space)
    var strCheck = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()-_=+[]{};:,.<>? ';
  //  var strCheck = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%^&*()-_=+[]{};:,.<>? ';

    var whichCode = e.which ? e.which : e.keyCode;

    // Allow Enter, Backspace, and Tab keys
    if (whichCode === 13 || whichCode === 8 || whichCode === 9) return true;

    var key = String.fromCharCode(whichCode);

    // Check if the key is not in the allowed characters
    if (strCheck.indexOf(key) === -1) {
        return false; // Disallow the input
    }

    return true; // Allow the input
}


// Handle paste event for the Arabic input field
function HandlePasteArabic(e) {
    var pastedData = e.clipboardData.getData('text'); // Get the pasted text

    // Regular expression to match Arabic characters only
    var arabicPattern = /^[\u0600-\u06FF\s]+$/;

    // If the pasted text contains non-Arabic characters, block the paste
    if (!arabicPattern.test(pastedData)) {
        e.preventDefault(); // Cancel the paste event if it contains non-Arabic characters
    }
}

// Handle paste event for the English input field
function HandlePasteEnglish(e) {
    var pastedData = e.clipboardData.getData('text'); // Get the pasted text

    // Regular expression to match English letters only
    var englishPattern = /^[A-Za-z\s]+$/;

    // If the pasted text contains non-English characters, block the paste
    if (!englishPattern.test(pastedData)) {
        e.preventDefault(); // Cancel the paste event if it contains non-English characters
    }
}

