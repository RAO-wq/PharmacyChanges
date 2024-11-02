var CallURL = BaseUrl + "/api/Admin";
var LoadContractDetailsdatatable;
var CompanyId = document.getElementById("CompanyId").value;

jQuery(document).ready(function () {
    $('#CompanyIds').select2();
    var multiEmailsInput = document.getElementById('multiEmails');
    tagify = new Tagify(multiEmailsInput);
    
    GetRequestAssetDetailsById();
});

function GetRequestAssetDetailsById() {
    debugger
    $("#divLoader").show();
    var RepoCompId = document.getElementById("CompanyId").value;

    RequestAssetDetails = CallURL + "/" + RepoCompId + "/GetCompanyRepossessionTWQById";

    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    // myHeaders.append("Authorization", "Bearer " + getTokenFromSessionStorage());


    var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
    };
    commonFetch(RequestAssetDetails, requestOptions, function (data) {
        if (data != null && data != undefined) {
            debugger
            $("#divLoader").hide();

            $("#CompanyName").val(data.companyName);
            //$("#TypeOfOwnershipId").val(data.data?.typeOfOwnerShipId);
            $("#CompanyCode").val(data.companyCode);
            $("#ContactPhone").val(data.contactPhone);
            
            $("#statusDropdown").val(data.isActive);
            $("#CompanyNameAR").val(data.companyNameAR);
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

            tagify.addTags(multiEmails);

            var selectElement = $('#CompanyIds');
            selectElement.select2();

            // Set selected values using the Select2 'val' method
            selectElement.val(data?.companyIds);

            // Trigger the Select2 update
            selectElement.trigger('change');
            //var parsedStartDate = moment(data.data?.startDate, 'YYYY-MM-DD').format('DD/MM/YYYY');
            //$("#StartDate").val(parsedStartDate);
        }
        else {
            showSweetAlert("error", "Invalid Response", "");
        }
    })
    //fetch(RequestAssetDetails, requestOptions)
    //    .then(response => response.json())
    //    .then(data => {
    //        debugger
    //        $("#divLoader").hide();

    //        $("#CompanyName").val(data.companyName);
    //        //$("#TypeOfOwnershipId").val(data.data?.typeOfOwnerShipId);
    //        $("#CompanyCode").val(data.companyCode);
    //        $("#ContactPhone").val(data.contactPhone);
    //        $("#ContactEmail").val(data.contactEmail);
    //        $("#statusDropdown").val(data.isActive);
    //        $("#CompanyNameAR").val(data.companyNameAR);
            
    //        var selectElement = $('#CompanyIds');
    //        selectElement.select2();

    //        // Set selected values using the Select2 'val' method
    //        selectElement.val(data?.companyIds);

    //        // Trigger the Select2 update
    //        selectElement.trigger('change');
    //        //var parsedStartDate = moment(data.data?.startDate, 'YYYY-MM-DD').format('DD/MM/YYYY');
    //        //$("#StartDate").val(parsedStartDate);


    //    })
    //    .catch(error => console.log('error', error));

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
//            $("#CompanyIds").html("");
//            $("#CompanyIds").append("<option value=>Please Select</option>")
//            for (var i = 0; i < data.data.lessorsList.length; i++) {

//                $("#CompanyIds").append("<option value='" + data.data.lessorsList[i].setupId + "'>" + data.data.lessorsList[i].setupValue + "</option>")
//            }
//            GetRequestAssetDetailsById();
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
//    //        $("#CompanyIds").html("");
//    //        $("#CompanyIds").append("<option value=>Please Select</option>")
//    //        for (var i = 0; i < data.data.lessorsList.length; i++) {

//    //            $("#CompanyIds").append("<option value='" + data.data.lessorsList[i].setupId + "'>" + data.data.lessorsList[i].setupValue + "</option>")
//    //        }
//    //    })
//    //    .catch(error => console.log('error', error));
//}