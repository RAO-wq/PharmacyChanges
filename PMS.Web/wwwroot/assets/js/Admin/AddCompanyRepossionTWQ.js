var MasterURL = BaseUrl + "/api/setups";
var CallURL = BaseUrl + "/api/Admin";
var multiInputEmails;

const validateEmail = (email) => {
    return String(email)
        .toLowerCase()
        .match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        );
};
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
    //$('#CompanyId').select2();
    //GetSetups();

    var inputEmails = document.getElementById('multiEmails');
    multiInputEmails = new Tagify(inputEmails);

    multiInputEmails.on("add", function (item) {
        debugger
        var isValid = validateEmail(item.detail.data.value);
        if (isValid == null) {
            showSweetAlert('error', 'Invalid Email');
            multiInputEmails.removeTag(item.detail.data.value);
        }
        else {
            $("#reqmesg").hide();
        }
    });
});

function AddCompanyAssociateTWQ() {
    debugger

    if ($('#CreateAssociateCompanies').valid()) {
        var data = $('#CreateAssociateCompanies').serializeArray().reduce(function (obj, item) {
            obj[item.name] = item.value;
            return obj;
        }, {});

        var emails = []
        multiInputEmails.value.forEach(item => { emails.push(item.value) })
        if (emails.length == 0) {
            $("#reqmesg").show();
            return;
        }

        //var selectedCompanies = [];
        //var selectElement = document.getElementById("CompanyId");
        //for (var i = 0; i < selectElement.options.length; i++) {
        //    if (selectElement.options[i].selected) {
        //        selectedCompanies.push(parseInt(selectElement.options[i].value));
        //    }
        //}
        //var selectedCompanies = Array.from(document.getElementById("CompanyId").selectedOptions).map(option => parseInt(option.value));

        var URL = CallURL + "/AddCompanyRepossionTWQ";

        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        // myHeaders.append("Authorization", "Bearer " + getTokenFromSessionStorage());
        var userID = sessionStorage.getItem('userId');

        //data.StartDate = moment(document.getElementById("StartDate").value, 'DD/MM/YYYY').format('YYYY-MM-DD') || null;
        //data.EndDate = moment(document.getElementById("EndDate").value, 'DD/MM/YYYY').format('YYYY-MM-DD') || null;
       // data.CompanyIds = selectedCompanies;
        data.AssociateCompanyName = document.getElementById("AssociateCompanyName").value;
        data.CompanyCode = document.getElementById("CompanyCode").value;
        data.AssociateCompanyNameAR = document.getElementById("AssociateCompanyNameAR").value;
        data.Email = emails.length > 0 ? emails.join(',') : ''; //document.getElementById("Email").value;
        data.Phone = document.getElementById("Phone").value;
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
                    $('#RepossionModal').modal({
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
        //            $('#RepossionModal').modal({
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
            //actionData = setActionsForView();
            //if (actionData.Addable) {
            //    document.getElementById('addBtn').style.display='flex';
            //}
        }
        else {
            showSweetAlert("error", "Invalid Response", "");
        }
    })
    //fetch(CountryURL, requestOptions)
    //    .then(response => response.json())
    //    .then(data => {
    //        $("#divLoader").hide();
    //        debugger
    //        $("#CompanyId").html("");
    //        $("#CompanyId").append("<option value=>Please Select</option>")
    //        for (var i = 0; i < data.data.lessorsList.length; i++) {

    //            $("#CompanyId").append("<option value='" + data.data.lessorsList[i].setupId + "'>" + data.data.lessorsList[i].setupValue + "</option>")
    //        }
    //    })
    //    .catch(error => console.log('error', error));
}

//var KTSelect2 = function () {
//    // Private functions
//    var demos = function () {
//        $('#CompanyId').select2({
//            placeholder: 'Select Companies'
//        });
//    }
//    // Public functions
//    return {
//        init: function () {
//            demos();
//        }
//    };
//}();

function validatePhoneNumber() {
    debugger
    var currValue = $('#Phone').val();
    if (currValue.startsWith(0) && currValue.length == 10) {
        return true;
    }
    else {
        return false;
    }
}