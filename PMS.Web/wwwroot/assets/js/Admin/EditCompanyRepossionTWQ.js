var MasterURL = BaseUrl + "/api/setups";
var CallURL = BaseUrl + "/api/Admin";
var multiInputEmails;

jQuery(document).ready(function () {
    debugger;
    /*    $('#CompanyId').multiselect();*/
    $("#StartDate").datepicker({
        autoclose: true,
    });

    $("#EndDate").datepicker({
        autoclose: true,
    }).on('show', function (e) {
        var startDate = $("#StartDate").datepicker('getDate');
        if (startDate !== null) {
            $(this).datepicker('setStartDate', startDate);
        }
    });
    var multiEmailsInput = document.getElementById('multiEmails');
    multiInputEmails =  new Tagify(multiEmailsInput);
    $('#CompanyId').select2();
    /*GetSetups();*/
    GetCompanyByID();
});

function GetCompanyByID() {
    $("#divLoader").show();
    var RepoCompId = document.getElementById("AssociateCompanyId").value;

    CountryURL = BaseUrl + "/api/Admin/" + RepoCompId + "/GetCompanyRepossessionTWQById";
    redirectUrl = "/Admin/getcompanyrepossessionbyid";
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", "Bearer " + getTokenFromSessionStorage());


    var requestOptions = {
        method: 'GET',
        //params: {
        //    ServerGridCall: true,
        //    SetupID: document.getElementById("CompanyId").value,
        //},
        headers: myHeaders,

        redirect: 'follow'
    };
    commonFetch(CountryURL, requestOptions, function (data) {
        if (data != null && data != undefined) {
            debugger
            $("#divLoader").hide();

            $("#AssociateCompanyName").val(data?.companyName);
            $("#AssociateCompanyNameAR").val(data?.companyNameAR);
            $("#Email").val(data?.contactEmail);
            $("#CompanyCode").val(data?.companyCode);
            $("#Phone").val(data?.contactPhone);

            
            $("#statusDropdown").val(data.isActive);
             var multiEmails = [];
            if (data?.contactEmail.includes(',')) {
                var emails = data?.contactEmail.split(',')
                emails.forEach(item => {
                    multiEmails.push(item);
                });
            }
            else {
                multiEmails.push(data?.contactEmail);
            }

            multiInputEmails.addTags(multiEmails);
            var selectElement = $('#CompanyId');
            selectElement.select2();

            // Set selected values using the Select2 'val' method
            selectElement.val(data?.companyIds);

            // Trigger the Select2 update
            selectElement.trigger('change');

            ////var selectElement = document.getElementById('CompanyId');
            //var selectElement = $('#CompanyId');
            //// Loop through the options and set selected attribute based on API data
            //for (var i = 0; i < selectElement.options.length; i++) {
            //    var optionValue = selectElement.find('option').eq(i).val();

            //    // Check if the option value is present in the API data
            //    if (data?.companyIds.includes(parseInt(optionValue))) {
            //        selectElement.find('option').eq(i).prop('selected', true);
            //    }
            //}
            //selectElement.select2();
        }
        else {
            showSweetAlert("error", "Invalid Response", "");
        }
    })

    //fetch(CountryURL + "/" + Id, requestOptions)
    //fetch(CountryURL, requestOptions)
    //    .then(response => response.json())
    //    .then(data => {
    //        debugger
    //        $("#divLoader").hide();
            
    //        $("#AssociateCompanyName").val(data?.companyName);
    //        $("#AssociateCompanyNameAR").val(data?.companyNameAR);
    //        $("#Email").val(data?.contactEmail);
    //        $("#CompanyCode").val(data?.companyCode);
    //        $("#Phone").val(data?.contactPhone);
    //        $("#ContactEmail").val(data?.contactEmail);
    //        $("#statusDropdown").val(data.isActive);
    //        var selectElement = $('#CompanyId');
    //        selectElement.select2();

    //        // Set selected values using the Select2 'val' method
    //        selectElement.val(data?.companyIds);

    //        // Trigger the Select2 update
    //        selectElement.trigger('change');

    //        ////var selectElement = document.getElementById('CompanyId');
    //        //var selectElement = $('#CompanyId');
    //        //// Loop through the options and set selected attribute based on API data
    //        //for (var i = 0; i < selectElement.options.length; i++) {
    //        //    var optionValue = selectElement.find('option').eq(i).val();

    //        //    // Check if the option value is present in the API data
    //        //    if (data?.companyIds.includes(parseInt(optionValue))) {
    //        //        selectElement.find('option').eq(i).prop('selected', true);
    //        //    }
    //        //}
    //        //selectElement.select2();
    //    })
    //    .catch(error => console.log('error', error));

}

function EditCompanyAssociateTWQ() {
    debugger

    if ($('#CreateAssociateCompanies').valid()) {
        $("#divLoader").show();
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
        /*var selectedCompanies = Array.from(document.getElementById("CompanyId").selectedOptions).map(option => parseInt(option.value));*/

        var URL = CallURL + "/EditCompanyRepossionTWQ";

        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        // myHeaders.append("Authorization", "Bearer " + getTokenFromSessionStorage());
        var userID = sessionStorage.getItem('userId');

        data.AssociateCompanyId = document.getElementById("AssociateCompanyId").value;
       /* data.CompanyIds = selectedCompanies;*/
        data.AssociateCompanyName = document.getElementById("AssociateCompanyName").value;
        data.CompanyCode = document.getElementById("CompanyCode").value;
        data.AssociateCompanyNameAR = document.getElementById("AssociateCompanyNameAR").value;
        data.Email = emails.length > 0 ? emails.join(',') : '';
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



//function GetSetups() {
//    debugger
//    $("#divLoader").show();

//    CountryURL = BaseUrl + "/api/Configuration/configurationdropdowns";
//    var myHeaders = new Headers();
//    myHeaders.append("Content-Type", "application/json");

//    var requestOptions = {
//        method: 'GET',
//        headers: myHeaders,
//        redirect: 'follow'
//    };
//    commonFetch(CountryURL, requestOptions, function (data) {
//        if (data != null && data != undefined) {
//            $("#divLoader").hide();
//            debugger
//            $("#CompanyId").html("");
//            $("#CompanyId").append("<option value=>Please Select</option>")
//            for (var i = 0; i < data.data.lessorsList.length; i++) {

//                $("#CompanyId").append("<option value='" + data.data.lessorsList[i].setupId + "'>" + data.data.lessorsList[i].setupValue + "</option>")
//            }
//        }
//        else {
//            showSweetAlert("error", "Invalid Response", "");
//        }
//    })
//    //fetch(CountryURL, requestOptions)
//    //    .then(response => response.json())
//    //    .then(data => {
//    //        $("#divLoader").hide();
//    //        debugger
//    //        $("#CompanyId").html("");
//    //        $("#CompanyId").append("<option value=>Please Select</option>")
//    //        for (var i = 0; i < data.data.lessorsList.length; i++) {

//    //            $("#CompanyId").append("<option value='" + data.data.lessorsList[i].setupId + "'>" + data.data.lessorsList[i].setupValue + "</option>")
//    //        }
//    //    })
//    //    .catch(error => console.log('error', error));
//}



//show success alert
function showSweetAlert(icon, title, text) {
    Swal.fire({
        icon: icon,
        title: title,
        text: text,
        //footer: '<a href="">Why do I have this issue?</a>'
    });

}