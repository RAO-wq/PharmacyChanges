const AccountURL = BaseUrl + '/auth';
const LoginErrorMessage = "Invalid Username or Password.";
var IsCaptchaRight = false;

jQuery(document).ready(function () {

    var urlParams = new URLSearchParams(window.location.search);

    var UserId = urlParams.get('userId');
    var Code = urlParams.get('code');
    if (UserId && Code != null) {
        verifylink(UserId, Code);
    }

    $("#acceptTncBtn").prop("disabled", true);
    document.getElementById("mathProblem").innerText = generateMathProblem();

    debugger
    GetLabelsTranslation();
    localized();
});

function UserLogin(username, password) {
    ;
    if ($('#kt_login_signin_form').valid()) {
        resetSessionExpiredFlag();
        const mathProblem = document.getElementById("mathProblem").innerText;
        const userAnswer = document.getElementById("userAnswer").value;

        // Evaluate the math problem
        const correctAnswer = eval(mathProblem);

        // Check if the user's answer is correct
        if (parseInt(userAnswer) === correctAnswer) {
            document.getElementById("resultMessage").innerText = getGridTitle("correct_message");//"Correct! You may proceed.";
            document.getElementById("resultMessage").style.color = "white";
            document.getElementById("resultMessage").style.fontSize = "12px";
            document.getElementById("resultMessage").style.fontStyle = "normal";

            IsCaptchaRight = true;
        } else {
            document.getElementById("resultMessage").innerText = getGridTitle("incorrect_message");//"Incorrect. Please try again.";
            document.getElementById("resultMessage").style.color = "red";
            document.getElementById("resultMessage").style.fontSize = "12px";
            document.getElementById("resultMessage").style.fontStyle = "normal";


            IsCaptchaRight = false;
            // Generate a new math problem
            document.getElementById("mathProblem").innerText = generateMathProblem();
            // Clear the user's input
            document.getElementById("userAnswer").value = "";
        }



        if (IsCaptchaRight == false) {
            //Show Error
            Swal.fire({
                title: getTranslation('Failed'),
                text: getTranslation('Invalid Captcha Entered'),
                icon: "error",
                showDenyButton: false,
                showCancelButton: false,
                confirmButtonText: getTranslation('OK'),

            }).then((result) => {
                if (result) {
                    var url = redirectUrl;
                    window.location.replace(url);
                }
            })
        }
        else {
            console.log('username' + username)
            var _buttonSpinnerClasses = 'spinner spinner-right spinner-white pr-15';
            var formSubmitButton = KTUtil.getById('lgnBtn');

            KTUtil.btnWait(formSubmitButton, _buttonSpinnerClasses, "Please wait");

            const logininfo = {
                UserName: username,
                Password: password
            };

            fetch(AccountURL + '/signin',
                {
                    method: 'post',
                    headers: {
                        'Accept': 'text/plain',
                        'Content-Type': 'text/plain',
                        'BasicAuth': "Basic " + btoa(username + ":" + password),
                        'RequestType': "WA"
                    }
                    //body: btoa("Basic " + username + ":" + password) //JSON.stringify(logininfo)
                })
                .then(response => response.json())
                .then(response => {
                    sessionStorage.setItem('showSurvey', 'true');

                    if (!password) {
                        KTUtil.btnRelease(formSubmitButton, _buttonSpinnerClasses);
                        Swal.fire({
                            title: getTranslation('Failed'),
                            text: getTranslation('Password Field cannot be empty'),
                            icon: 'error',
                            showDenyButton: false,
                            showCancelButton: false,
                            confirmButtonText: getTranslation('OK'),
                        });
                        return;
                    }

                    if (response.message == "Account InActive") {
                        KTUtil.btnRelease(formSubmitButton, _buttonSpinnerClasses);
                        Swal.fire({
                            title: response.message,
                            text: getTranslation('Contact system administrator to activate your account'),
                            icon: 'error',
                            showDenyButton: false,
                            showCancelButton: false,
                            confirmButtonText: getTranslation('OK'),
                        });
                        return;
                    }
                    else if (response.success) {
                        console.log(response);
                        var resData = response.data;
                        var token = resData.token;
                        sessionStorage.setItem('token', token);
                        //setSessionTimeout();
                        debugger

                        if (response.showTnc && token != undefined) {

                            var obj = {
                                userId: resData.userId,
                                tncAccepted: true
                            }
                            getTNC();
                            document.getElementById('acceptTncBtn').addEventListener('click', async (event) => {
                                event.preventDefault();

                                debugger

                                var isSuccess = await saveTncAcceptance(obj);

                                if (isSuccess) {
                                    document.getElementById('declineTncBtn').click();
                                    continueLogin();
                                }
                            })
                        }
                        else {
                            continueLogin();
                        }

                        function continueLogin() {

                            sessionStorage.setItem('MasterSetupAtLayout', JSON.stringify(response.entityData));

                            var role = resData.userRole;
                            // var TotalCount = response.countData.contractCount + response.countData.repoCompanyCount + response.countData.requestAssetCount;
                            //var TotalCount = response.countData.repoCompanyCount + response.countData.requestAssetCount + response.countData.ticketsCount;
                            
                            if (token != undefined) {

                                sessionStorage.setItem('role', role);
                                sessionStorage.setItem('companyType', resData.companyType);
                                sessionStorage.setItem('userName', resData.userName);
                                sessionStorage.setItem('userEmail', resData.userEmail);
                                sessionStorage.setItem('userId', resData.userId);
                                sessionStorage.setItem('companyId', resData.companyId);
                                sessionStorage.setItem('companyCode', resData.companyCode);
                                sessionStorage.setItem('companyTypeId', resData.companyTypeId);
                                sessionStorage.setItem('TenantId', resData.tenantId);
                                sessionStorage.setItem('gridTimeout', response.timeouts.gridTimeout);
                                sessionStorage.setItem('Domains', response.domains);
                                sessionStorage.setItem('userIpAddress', resData.userIpAddress);


                               // localStorage.setItem("sessionToken", response.sessionToken);

                                //sessionStorage.setItem('TotalCounts', TotalCount);
                                //sessionStorage.setItem('ContractCounts', response.countData.contractCount);
                                //sessionStorage.setItem('RepoComapnyCounts', response.countData.repoCompanyCount);
                                //sessionStorage.setItem('AssetCounts', response.countData.requestAssetCount);
                                //sessionStorage.setItem('Domains', response.countData.domains);
                                //sessionStorage.setItem('TicketCounts', response.countData.ticketsCount);

                                //var url = "/account/dashboard/1";
                                //url = "/account/dashboard"

                                var url = "/account/authenticate"
                                GetAllActionType(token).then(result => {
                                    if (result == true) {
                                        fetch(url, {
                                            method: 'GET',
                                            headers: {
                                                'AccessToken': sessionStorage.getItem('token')
                                            }
                                        }).then(response => {
                                            var newToken = response.headers.get('accesstoken');
                                            if (newToken) {
                                                sessionStorage.setItem("token", newToken);
                                            }
                                            if (resData.companyType == "Lessor") {
                                                var redirectUrl = window.location.origin + '/ContractManagement/ContractDashboard';
                                                window.location.replace(redirectUrl);
                                                KTUtil.btnRelease(formSubmitButton, _buttonSpinnerClasses);
                                            }
                                            else {
                                                window.location.replace(response.url);
                                                KTUtil.btnRelease(formSubmitButton, _buttonSpinnerClasses);
                                            }
                                            console.log(response);
                                        }).catch(err => {
                                            console.log(err);
                                        });
                                    }
                                });
                            }
                            else {
                                //Show Error
                                KTUtil.btnRelease(formSubmitButton, _buttonSpinnerClasses);
                                Swal.fire({
                                    title: getTranslation('Failed'),
                                    text: getTranslation("Login Failed, Unexpted response please contact to system administrator"),
                                    icon: "error",
                                    showDenyButton: false,
                                    showCancelButton: false,
                                    confirmButtonText: getTranslation('OK'),

                                })
                                window.location.reload();

                            }
                        }
                    }
                    else {
                        //Show Error
                        KTUtil.btnRelease(formSubmitButton, _buttonSpinnerClasses);
                        Swal.fire({
                            title: getTranslation('Failed'),
                            text: (response?.message != null && response?.message != '') ? response?.message : getTranslation('Enter Correct Credentials'),
                            icon: "error",
                            showDenyButton: false,
                            showCancelButton: false,
                            confirmButtonText: getTranslation('OK'),

                        }).then((result) => {
                            if (result) {
                                var url = redirectUrl;
                                window.location.replace(url);
                            }
                        })

                    }

                })
                .catch(error => {
                    KTUtil.btnRelease(formSubmitButton, _buttonSpinnerClasses);
                    Swal.fire({
                        title: getTranslation('Error'),
                        text: getTranslation('Something Went Wrong'),
                        icon: 'error',
                        showDenyButton: false,
                        showCancelButton: false,
                        confirmButtonText: getTranslation('OK')
                    });
                    console.error(LoginErrorMessage, error);
                });
        }



    }
    else {
        Swal.fire({
            text: getTranslation("Please enter mandatory fields to proceed..!"),
            icon: "error",
            buttonsStyling: false,
            confirmButtonText: getTranslation("Ok, got it!"),
            customClass: {
                confirmButton: "btn font-weight-bold btn-light"
            }
        }).then(function () {
            KTUtil.scrollTop();
        });
    }

}
$('#createPasswordBtn').on('click', e => {
    e.preventDefault();

    if ($("#CreatePassword").valid()) {
        CreatePassword();
    }
    else {
        $("span.field-validation-error").show();
    }
})


function CreatePassword() {

    if ($('#CreatePassword').valid()) {

        $("#divLoader").show();
        var ajaxDataParams = $('#CreatePassword').serializeArray().reduce(function (obj, item) {
            obj[item.name] = item.value;
            return obj;
        }, {});
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        //myHeaders.append("Authorization", "Bearer " + getTokenFromSessionStorage());

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            redirect: 'follow',
            body: JSON.stringify(ajaxDataParams)
        };
        ;
        fetch(BaseUrl + "/auth/createpassword", requestOptions)
            .then(response => response.json())
            .then(result => {
                $("#divLoader").hide();
                if (result.success) {
                    Swal.fire({
                        title: getTranslation('Changed Successfully'),
                        text: result.messgage,
                        icon: "success",
                        showDenyButton: false,
                        showCancelButton: false,
                        confirmButtonText: getTranslation('OK'),

                    }).then((result) => {

                        if (result) {
                            var url = "/Account/Login";
                            window.location.replace(url);
                        }
                    })
                }
                else {
                    Swal.fire({
                        title: getTranslation('Failed'),
                        text: getTranslation(result.message),
                        icon: "error",
                        showDenyButton: false,
                        showCancelButton: false,
                        confirmButtonText: getTranslation('OK'),

                    })
                }
            })
            .catch(error => {
                showSweetAlert('error', 'Faild', error);
            });
    }
}

function verifylink(userid, code) {
    $("#divLoader").show();

    ;
    var URL = AccountURL + '/Auth' + '/' + userid + '/' + code + '/verifylink';

    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        redirect: 'follow',
    };

    fetch(URL, requestOptions)
        .then(response => response.json())
        .then(result => {
            $("#divLoader").hide();
            if (result.data == 1) {
                Swal.fire({
                    icon: 'error',
                    title: getTranslation('Link Expired'),
                    text: getTranslation('Sorry, the link you are trying to access has expired. Please request a new link.'),
                    confirmButtonText: getTranslation('OK'),

                }).then((result) => {

                    if (result) {
                        var url = "/Account/Login";
                        window.location.replace(url);
                    }
                })
            }
            else {
                return "";
            }
        })
        .catch(error => {
            showSweetAlert('error', 'Faild', error);
        });
}

function generateMathProblem() {
    const operand1 = Math.floor(Math.random() * 10);
    const operand2 = Math.floor(Math.random() * 10);
    return `${operand1} + ${operand2}`;
}

function checkAnswer() {
    const mathProblem = document.getElementById("mathProblem").innerText;
    const userAnswer = document.getElementById("userAnswer").value;

    // Evaluate the math problem
    const correctAnswer = eval(mathProblem);

    // Check if the user's answer is correct
    if (parseInt(userAnswer) === correctAnswer) {
        document.getElementById("resultMessage").innerText = getGridTitle("correct_message");//"Correct! You may proceed.";
        IsCaptchaRight = true;
    } else {
        document.getElementById("resultMessage").innerText = getGridTitle("incorrect_message");//"Incorrect. Please try again.";
        IsCaptchaRight = false;
        // Generate a new math problem
        document.getElementById("mathProblem").innerText = generateMathProblem();
        // Clear the user's input
        document.getElementById("userAnswer").value = "";
    }
}

function allowNumbersOnly(e) {

    var code = (e.which) ? e.which : e.keyCode;
    if (code > 31 && (code < 48 || code > 57)) {
        e.preventDefault();
    }
}

function getTNC() {

    var TNCType = "TNC1";
    var setupURL = BaseUrl + "/api/Setups/" + TNCType + "/gettermsandcondition";
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    var requestOptions = {
        method: 'GET',
        params: {
            ServerGridCall: true,
            Query: 'TNC',
        },
        headers: myHeaders,
        redirect: 'follow'
    };
    commonFetch(setupURL, requestOptions, function (data) {
        if (data != null && data != undefined) {

            var parent = document.getElementById('textarea-en');
            var ul = document.createElement('ul');
            parent.appendChild(ul);
            var tncArr = data.data.defaultParameterDescription.split('|');
            tncArr.forEach(item => {
                var text = item.trim();
                var li = document.createElement('li');
                li.innerText = text;
                ul.appendChild(li);
            });

            var parent = document.getElementById('textarea-ar');
            var ul = document.createElement('ul');
            parent.appendChild(ul);
            var tncArr = data.data.defaultParameterDescriptionAr.split('|');
            tncArr.forEach(item => {

                var text = item.trim();
                var li = document.createElement('li');
                li.innerText = text;
                ul.appendChild(li);
            });

            //----------------------------------------------------------------------------------------------------------------------------//

            var headingdiv = $("<div>").addClass("form-group mb-0").css("display", "flex");
            var selectlang = $("<p>").attr("for", "TNCLabel").attr("id", "selectLangText").text("Select Language:").css("text-align", "left");

            // Create a clickable text (link) for language toggle
            var languageLink = $("<a>")
                .attr("href", "#")
                .attr("id", "languageLink")
                .text("عربي")
                .css("margin-left", "10px")
                .click(function (event) {
                    event.preventDefault();

                    toggleLanguage();
                });
            headingdiv.append(selectlang, languageLink);
            $("#TermAndConditionOne").prepend(headingdiv);

            var checkboxContainer = $("<div>")
                .addClass("form-group")
                .css("display", "flex");

            var checkbox = $("<input>")
                .attr({
                    type: "checkbox",
                    id: "termsCheckbox"
                })
                .addClass("mb-3")
                .change(function () {
                    function updaetBtnState() {

                        var checkboxChecked = $("#termsCheckbox").prop("checked");
                        $("#acceptTncBtn").prop("disabled", !checkboxChecked);
                    }

                    updaetBtnState();
                });

            var label = $("<label style='margin-bottom: 8px;'>")
                .attr({ for: "termsCheckbox", id: "lblTermsCheckbox" })
                .css({
                    "font-weight": "bold",
                    "color": "#333",
                    "margin-left": "6px",
                    "margin-right": "6px"
                })
                .text(data.data.defaultParameterAcceptText);

            checkboxContainer.append(checkbox, label);

            $("#TermAndConditionOneCheckbox").append(checkboxContainer);

            function toggleLanguage() {

                // Get the current language text
                var currentLanguage = $("#languageLink").text();

                // Toggle between English and Arabic
                var newLanguage = currentLanguage === "عربي" ? "English" : "عربي";

                // Update the language text
                $("#languageLink").text(newLanguage);
                $("#textareaDescription").addClass("arz-l");
                // Update the textarea content based on the selected language
                if (currentLanguage === "عربي") {
                    document.getElementById('textarea-en').style.display = 'none';
                    document.getElementById('textarea-ar').style.display = 'flex';


                    var lbl = document.getElementById('lblTermsCheckbox');
                    lbl.dir = 'rtl';

                    lbl.innerText = data.data.defaultParameterAcceptTextAr;
                    lbl.style.textAlign = 'right';

                    var chkboxDiv = document.getElementById('TermAndConditionOneCheckbox');
                    chkboxDiv.dir = 'rtl';

                } else {
                    document.getElementById('textarea-en').style.display = 'flex';
                    document.getElementById('textarea-ar').style.display = 'none';

                    var lbl = document.getElementById('lblTermsCheckbox');
                    lbl.dir = 'ltr';
                    lbl.innerText = data.data.defaultParameterAcceptText;
                    lbl.style.textAlign = 'left';

                    var chkboxDiv = document.getElementById('TermAndConditionOneCheckbox');
                    chkboxDiv.dir = 'ltr';
                }
            }

            showTncModal();
        }
        else {
            showSweetAlert('error', "Invalid Response", "");
        }
    });
}

function showTncModal() {

    $('#tncModal').modal({
        backdrop: 'static'
    });

}

function saveTncAcceptance(obj) {
    return new Promise((resolve, reject) => {

        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            redirect: 'follow',
            body: JSON.stringify(obj)
        };
        var url = AccountURL + "/Auth/saveuserupdateddetails?isTnc=true"

        commonFetch(url, requestOptions, function (response) {
            if (response != null && response != undefined) {
                if (response.success) {
                    resolve(true);
                }
                else {
                    reject(false);
                }
            }
            else {
                showSweetAlert('error', 'Invalid Response');
                reject(false);
            }
        });
    });
}


function GetAllActionType(token) {
    CountryURL = BaseUrl + "/api/Setups/getdetailsbysetuptype";
    redirectUrl = "/Setups/getdetailsbysetuptype";
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("AccessToken", token);
    myHeaders.append("RequestType", "WA");

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
    return new Promise(function (resolve, reject) {
        fetch(CountryURL, requestOptions)
            .then(response => {
                debugger
                var newToken = response.headers.get('accesstoken');
                if (newToken) {
                    sessionStorage.setItem("token", newToken);
                }

                console.log('GetAllActionType', newToken)
                return response.json()
            })
            .then(data => {
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
                    resolve(true);
                }
                else {
                    Swal.fire({
                        title: getTranslation('Invalid Response'),
                        text: '',
                        icon: "error",
                        showDenyButton: false,
                        showCancelButton: false,
                        confirmButtonText: getTranslation('OK'),

                    })
                    reject(false);
                }
            })
            .catch(err => {
                Swal.fire({
                    title: getTranslation('Error fetching actions'),
                    text: err,
                    icon: 'error',
                    showDenyButton: false,
                    showCancelButton: false,
                    confirmButtonText: getTranslation('OK'),
                });
                reject(false);
            })
    });
}

document.getElementById('declineTncBtn').addEventListener('click', function () {

    var tncCheck = document.getElementById('TermAndConditionOneCheckbox');
    var selectLangText = document.getElementById('selectLangText');
    var langToggle = document.getElementById('languageLink');
    var txtEn = document.getElementById('textarea-en');
    var txtAr = document.getElementById('textarea-ar');


    tncCheck.innerHTML = "";
    selectLangText.innerHTML = "";
    langToggle.innerHTML = "";
    txtEn.innerHTML = "";
    txtAr.innerHTML = "";
});