var MasterURL = BaseUrl + "/api/setups";
var CallURL = BaseUrl + "/api/Admin";

jQuery(document).ready(function () {

    /*    $('#CompanyId').multiselect();*/
    //$("#StartDate").datepicker({
    //    autoclose: true,
    //});

    //$("#EndDate").datepicker({
    //    autoclose: true,
    //}).on('show', function (e) {
    //    var startDate = $("#StartDate").datepicker('getDate');
    //    if (startDate !== null) {
    //        $(this).datepicker('setStartDate', startDate);
    //    }
    //});
    $('#CompanyId').select2();
    $('#RepoCompanyId').select2();
    GetSetups();
    getAssociateCompanies();
});

function AddRepossessionCompaniesConfig() {
    debugger

    if ($('#RepossessionConfigForm').valid()) {
        var data = $('#RepossessionConfigForm').serializeArray().reduce(function (obj, item) {
            obj[item.name] = item.value;
            return obj;
        }, {});

        //var selectedCompanies = [];
        //var selectElement = document.getElementById("CompanyId");
        //for (var i = 0; i < selectElement.options.length; i++) {
        //    if (selectElement.options[i].selected) {
        //        selectedCompanies.push(parseInt(selectElement.options[i].value));
        //    }
        //}
        var selectedCompanies = Array.from(document.getElementById("CompanyId").selectedOptions).map(option => parseInt(option.value));
        var selectedRepossessionCompanies = Array.from(document.getElementById("RepoCompanyId").selectedOptions).map(option => parseInt(option.value));

        var URL = CallURL + "/CompanyRepossionConfiguration";

        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        // myHeaders.append("Authorization", "Bearer " + getTokenFromSessionStorage());
        var userID = sessionStorage.getItem('userId');

        //data.StartDate = moment(document.getElementById("StartDate").value, 'DD/MM/YYYY').format('YYYY-MM-DD') || null;
        //data.EndDate = moment(document.getElementById("EndDate").value, 'DD/MM/YYYY').format('YYYY-MM-DD') || null;
        data.CompanyIds = selectedCompanies;
        data.CompanyRepossessionIds = selectedRepossessionCompanies;
        data.TenantId = parseInt(sessionStorage.getItem('TenantId'));
        data.CreateBy = userID;
        data.ModifiedBy = userID;

        //var formData = {
        //    "CompanyIds": selectedCompanies,
        //    "AssociateCompanyName": document.getElementById("AssociateCompanyName"),
        //    "CompanyCode": document.getElementById("CompanyCode"),
        //    "AssociateCompanyNameAR": document.getElementById("AssociateCompanyNameAR"),
        //    "Email": document.getElementById("Email"),
        //    "Phone": document.getElementById("Phone"),
        //    "TenantId": parseInt(sessionStorage.getItem('TenantId')),
        //    "CreateBy": userID,
        //    "ModifiedBy": userID
        //};

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            redirect: 'follow',
            body: JSON.stringify(data)
        };
        commonFetch(URL, requestOptions, function (result) {
            if (result != null && result != undefined) {
                if (result.success) {
                    $("#divLoader").hide();
                    $('#RepossessionConfigModel').modal({
                        backdrop: 'static'
                    });
                }
                else {
                    $("#divLoader").hide();
                    Swal.fire({
                        text: result.message,
                        icon: "error",
                        buttonsStyling: false,
                        confirmButtonText: "Ok, got it!",
                        customClass: {
                            confirmButton: "btn font-weight-bold btn-light"
                        }
                    }).then(function () {

                    });
                }
            }
            else {
                showSweetAlert("error", "Invalid Response", "");
            }
        })
        //fetch(URL, requestOptions)
        //    .then(response => response.json())
        //    .then(result => {
        //        debugger
        //        if (result.success) {
        //            $("#divLoader").hide();
        //            $('#RepossessionConfigModel').modal({
        //                backdrop: 'static'
        //            });
        //        }
        //        else {
        //            $("#divLoader").hide();
        //            Swal.fire({
        //                text: result.message,
        //                icon: "error",
        //                buttonsStyling: false,
        //                confirmButtonText: "Ok, got it!",
        //                customClass: {
        //                    confirmButton: "btn font-weight-bold btn-light"
        //                }
        //            }).then(function () {

        //            });
        //        }

        //    })
        //    .catch(error => console.log('error', error));
    }

    //else {
    //    validateRadioButtons();
    //}

}

function GetSetups() {
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
        if (data != null && data != undefined) {
            $("#divLoader").hide();
            debugger
            $("#CompanyId").html("");
            $("#CompanyId").append("<option value=>Please Select</option>")
            for (var i = 0; i < data.data.lessorsList.length; i++) {

                $("#CompanyId").append("<option value='" + data.data.lessorsList[i].setupId + "'>" + data.data.lessorsList[i].setupValue + "</option>")
            }
            actionData = setActionsForView();
            if (actionData.Addable) {
                document.getElementById('addBtn').style.display = "flex";
            }
        }
        else {
            showSweetAlert("error", "Invalid Response", "");
        }
    })
}


function getAssociateCompanies() {
    debugger
    $("#divLoader").show();
    //var CompanyId = parseInt(sessionStorage.getItem('companyId'));

    var setupURL = BaseUrl + "/api/Admin/GetAllRepossionCompanies";
    //var setupURL = BaseUrl + "/api/Admin/GetAssociateCompanies";

    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", "Bearer " + getTokenFromSessionStorage());

    var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
    };
    commonFetch(setupURL, requestOptions, function (data) {
        if (data != null && data != undefined) {
            $("#divLoader").hide();
            debugger
            $("#RepoCompanyId").html("");
            $("#RepoCompanyId").append("<option value=>Please Select</option>")
            for (var i = 0; i < data.data.length; i++) {
                $("#RepoCompanyId").append("<option value='" + data.data[i].repossessionCompanyId + "'>" + data.data[i].repossessionCompanyName + "</option>");
            }
        }
        else {
            showSweetAlert("error", "Invalid Response", "");
        }
    })
    //fetch(setupURL, requestOptions)
    //    .then(response => response.json())
    //    .then(data => {
    //        $("#divLoader").hide();
    //        debugger
    //        $("#RepoCompanyId").html("");
    //        $("#RepoCompanyId").append("<option value=>Please Select</option>")
    //        for (var i = 0; i < data.data.length; i++) {
    //            $("#RepoCompanyId").append("<option value='" + data.data[i].repossessionCompanyId + "'>" + data.data[i].repossessionCompanyName + "</option>");
    //        }
    //    })
    //    .catch(error => console.log('error', error));
}