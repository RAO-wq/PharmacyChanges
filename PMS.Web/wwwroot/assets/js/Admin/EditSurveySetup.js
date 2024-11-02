var CallURL = BaseUrl + "/api/Survey";
var LoadInvoiceDetailsdatatable;
var SurveyId = document.getElementById("SurveyId").value;
var MenusMasterURL = BaseUrl + "/api/ContractManagement";
//var FileID = document.getElementById("FileId").value;

jQuery(document).ready(function () {

    //$('#SurveySetupId').select2();

    

    $("#StartDate").datepicker({
        autoclose: true,
    }).on('changeDate', function (selected) {
        var startDate = new Date(selected.date.valueOf());
        $('#StartDate').datepicker('setStartDate', startDate);
    });

    $("#EndDate").datepicker({
        autoclose: true,
    }).on('changeDate', function (selected) {
        var startDate = new Date(selected.date.valueOf());
        $('#EndDate').datepicker('setStartDate', startDate);
    });

    
    GetSurveyDetailsBySurveyId();
});

function CreateSurvey() {

    debugger
    var feildurl = CallURL + "/AddSetSurvey";
    if ($('#CreateSurvey').valid()) {
        debugger
        $("#divLoader").show();
        var data = $('#CreateSurvey').serializeArray().reduce(function (obj, item) {
            obj[item.name] = item.value;
            return obj;
        }, {});

        console.log(data);
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        var IsActiveIdSelect = document.getElementById("IsActive");
        var IsActiveselectedOption = IsActiveIdSelect.options[IsActiveIdSelect.selectedIndex];
        var IsActivesetupValue = IsActiveselectedOption.value;

        data.SurveyId = parseInt(document.getElementById("SurveyId").value);
        data.SurveySetupId = parseInt(document.getElementById("SurveySetupId").value);
        data.StartDate = moment(document.getElementById("StartDate").value, 'DD/MM/YYYY').format('YYYY-MM-DD');
        data.EndDate = moment(document.getElementById("EndDate").value, 'DD/MM/YYYY').format('YYYY-MM-DD');
        data.CreatedBy = sessionStorage.getItem('userId');
        data.ModifiedBy = sessionStorage.getItem('userId');
        data.IsActive = parseInt(IsActivesetupValue);
        data.IsRecursive = document.getElementById('RecursiveCheckbox').checked;
        data.ActionName = $("#ActionName").val();
        //data.EntityId = parseInt(document.getElementById("EntityId").value);

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            redirect: 'follow',
            body: JSON.stringify(data)
        };
        commonFetch(feildurl, requestOptions, function (data) {
            if (data != undefined || data != null) {
                $('#SurveySetupModal').modal({
                    backdrop: 'static'
                });
            }
            else {
                showSweetAlert('error', 'Invalid Response', '');
            }
        });
        //fetch(feildurl, requestOptions)
        //    .then(response => response.json())
        //    .then(data => {
        //        $("#divLoader").hide();
        //        debugger
        //        if (data.success == true) {

        //            $('#SurveySetupModal').modal({
        //                backdrop: 'static'
        //            });

        //        } else {
        //            Swal.fire({
        //                text: data.message,
        //                icon: "error",
        //                buttonsStyling: false,
        //                confirmButtonText: "Ok, got it!",
        //                customClass: {
        //                    confirmButton: "btn font-weight-bold btn-light"
        //                }
        //            });
        //        }
        //    })
        //    .catch(error => {
        //        $("#divLoader").hide();
        //        console.log('error', error)
        //    });
    }

    else {
        Swal.fire({
            text: "Please enter mandatory fields to proceed..!",
            icon: "error",
            buttonsStyling: false,
            confirmButtonText: "Ok, got it!",
            customClass: {
                confirmButton: "btn font-weight-bold btn-light"
            }
        }).then(function () {
            KTUtil.scrollTop();
        });
    }
}

function GetSurveyDetailsBySurveyId() {
    debugger
    $("#divLoader").show();
    var SurveyId = document.getElementById("SurveyId").value;

    SurveySetupDetails = CallURL + "/" + SurveyId + "/GetSurveySetupDetailsBySurveyId";

    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    // myHeaders.append("Authorization", "Bearer " + getTokenFromSessionStorage());


    var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
    };
    commonFetch(SurveySetupDetails, requestOptions, function (data) {
        if (data != undefined || data != null) {
            $("#SurveyId").val(data.data?.surveyId);
            $("#SurveyName").val(data.data?.surveyName);

            var parsedStartDate = moment(data.data?.startDate, 'YYYY-MM-DD').format('DD/MM/YYYY');
            $("#StartDate").val(parsedStartDate);

            var parsedEndDate = moment(data.data?.endDate, 'YYYY-MM-DD').format('DD/MM/YYYY');
            $("#EndDate").val(parsedEndDate);

            /*$("#ViewName").val(data.data?.viewName);*/
            //DropDownSet(data.data?.surveySetupId)
            // Selecting the checkbox by its ID
            var selectedIsActive = data.data?.isActive;
            $("#IsActive").val(selectedIsActive);

            // Selecting the checkbox by its ID
            var recursiveCheckbox = document.getElementById('RecursiveCheckbox');

            // Setting the checkbox state based on the API value
            recursiveCheckbox.checked = data.data?.isRecursive;

            GetSurveyActions(data.data?.actionName);
            //GetEntities(data.data?.entityId);
            GetSetups(data.data?.surveySetupId);
            GetLessorUsers(data.data?.userId);
        }
        else {
            showSweetAlert('error', 'Invalid Response', '');
        }
    });

    //fetch(SurveySetupDetails, requestOptions)
    //    .then(response => response.json())
    //    .then(data => {
    //        debugger
    //        $("#divLoader").hide();

    //        $("#SurveyId").val(data.data?.surveyId);
    //        $("#SurveyName").val(data.data?.surveyName);

    //        var parsedStartDate = moment(data.data?.startDate, 'YYYY-MM-DD').format('DD/MM/YYYY');
    //        $("#StartDate").val(parsedStartDate);

    //        var parsedEndDate = moment(data.data?.endDate, 'YYYY-MM-DD').format('DD/MM/YYYY');
    //        $("#EndDate").val(parsedEndDate);

    //        /*$("#ViewName").val(data.data?.viewName);*/
    //        //DropDownSet(data.data?.surveySetupId)
    //        // Selecting the checkbox by its ID
    //        var selectedIsActive = data.data?.isActive;
    //        $("#IsActive").val(selectedIsActive);

    //        // Selecting the checkbox by its ID
    //        var recursiveCheckbox = document.getElementById('RecursiveCheckbox');

    //        // Setting the checkbox state based on the API value
    //        recursiveCheckbox.checked = data.data?.isRecursive;

    //        GetSurveyActions(data.data?.actionName);
    //        //GetEntities(data.data?.entityId);
    //        GetSetups(data.data?.surveySetupId);
    //        GetLessorUsers(data.data?.userId);
    //    })
    //    .catch(error => {
    //        $("#divLoader").hide();
    //        console.log('error', error)
    //    });

}

//function GetEntities(entityId) {
//    debugger
//    $("#divLoader").show();
//    var userId = sessionStorage.getItem('userId');
//    let MenusURL = `${MenusMasterURL}/${userId}/GetAllMenus`;
//    var myHeaders = new Headers();
//    myHeaders.append("Content-Type", "application/json");

//    var requestOptions = {
//        method: 'GET',
//        headers: myHeaders,
//        redirect: 'follow'
//    };
//    fetch(MenusURL, requestOptions)
//        .then(response => response.json())
//        .then(data => {
//            $("#divLoader").hide();
//            debugger
//            $("#EntityId").html("");
//            $("#EntityId").append("<option value=>Please Select</option>")
//            for (var i = 0; i < data.data.length; i++) {
//                if (data.data[i].entityName != 'Survey') {
//                    for (var j = 0; j < data.data[i].tabs.length; j++) {
//                        $("#EntityId").append("<option value='" + data.data[i].tabs[j].entityId + "'>" + data.data[i].tabs[j].entityName + "</option>")
//                    }
//                }
//            }

//            $("#EntityId").val(entityId);
//        })
//        .catch(error => console.log('error', error));
//}
function GetSetups(surveySetupId) {
    debugger
    $("#divLoader").show();

    CountryURL = BaseUrl + "/api/Configuration/configurationdropdowns";
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
    };
    commonFetch(CountryURL, requestOptions, function (data) {
        if (data != undefined || data != null) {
            $("#SurveySetupId").html("");
            $("#SurveySetupId").append("<option value=>Please Select</option>")
            for (var i = 0; i < data.data.surveyList.length; i++) {

                $("#SurveySetupId").append("<option value='" + data.data.surveyList[i].setupId + "'>" + data.data.surveyList[i].shortDescription + "</option>")
            }
            $("#SurveySetupId").val(surveySetupId);
        }
        else {
            showSweetAlert('error', 'Invalid Response', '');
        }
    });
    //fetch(CountryURL, requestOptions)
    //    .then(response => response.json())
    //    .then(data => {
    //        $("#divLoader").hide();
    //        debugger
    //        $("#SurveySetupId").html("");
    //        $("#SurveySetupId").append("<option value=>Please Select</option>")
    //        for (var i = 0; i < data.data.surveyList.length; i++) {

    //            $("#SurveySetupId").append("<option value='" + data.data.surveyList[i].setupId + "'>" + data.data.surveyList[i].shortDescription + "</option>")
    //        }

    //        $("#SurveySetupId").val(surveySetupId);

    //    })
    //    .catch(error => {
    //        $("#divLoader").hide();
    //        console.log('error', error)
    //    });
}

function GetLessorUsers(userId) {
    debugger
    $("#divLoader").show();

    var url = BaseUrl + "/auth/getlessors"
    var myHeaders = new Headers();
    var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
    };
    commonFetch(url, requestOptions, function (data) {
        if (data != undefined || data != null) {
            $("#UserId").html("");
            $("#UserId").append("<option value=>Please Select</option>")
            $("#UserId").append("<option value=all>All</option>")
            for (var i = 0; i < data.length; i++) {
                $("#UserId").append("<option value='" + data[i].userId + "'>" + data[i].fullName + "</option>")
            }
            if (userId == '' || userId == null) {
                $("#UserId").val('all');
            }
            else {
                $("#UserId").val(userId);
            }
        }
        else {
            showSweetAlert('error', 'Invalid Response', '');
        }
    });
    //fetch(url, requestOptions)
    //    .then(response => response.json())
    //    .then(data => {
    //        $("#divLoader").hide();
    //        debugger
    //        $("#UserId").html("");
    //        $("#UserId").append("<option value=>Please Select</option>")
    //        $("#UserId").append("<option value=all>All</option>")
    //        for (var i = 0; i < data.length; i++) {
    //            $("#UserId").append("<option value='" + data[i].userId + "'>" + data[i].fullName + "</option>")
    //        }

    //        if (userId == '' || userId == null) {
    //            $("#UserId").val('all');
    //        }
    //        else {
    //            $("#UserId").val(userId);
    //        }
    //    })
    //    .catch(err => {
    //        $("#divLoader").hide();
    //        console.log('error', err)
    //    });
}

function GetSurveyActions(actionName) {
    debugger
    $("#divLoader").show();

    var url = BaseUrl + "/api/Survey/surveyactions"
    var myHeaders = new Headers();

    var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
    };
    commonFetch(url, requestOptions, function (data) {
        if (data != undefined || data != null) {
            $("#ActionName").html("");
            $("#ActionName").append("<option value=>Please Select</option>")

            for (var i = 0; i < data.data.length; i++) {
                $("#ActionName").append("<option value='" + data.data[i] + "'>" + data.data[i] + "</option>")
            }
            $("#ActionName").val(actionName);
        }
        else {
            showSweetAlert('error', 'Invalid Response', '');
        }
    });
    //fetch(url, requestOptions)
    //    .then(response => response.json())
    //    .then(data => {
    //        $("#divLoader").hide();
    //        $("#ActionName").html("");
    //        $("#ActionName").append("<option value=>Please Select</option>")

    //        for (var i = 0; i < data.data.length; i++) {
    //            $("#ActionName").append("<option value='" + data.data[i] + "'>" + data.data[i] + "</option>")
    //        }

    //        $("#ActionName").val(actionName);
    //    })
    //    .catch(e => {
    //        $("#divLoader").hide();
    //        console.log('error', e)
    //    });
}