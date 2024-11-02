CountryURL = BaseUrl + "/api/setups";

jQuery(document).ready(function () {
    debugger;
    var validationMessageContainers = document.querySelectorAll('.errmsgs');
    validationMessageContainers.forEach(function (container) {
        container.style.display = 'none';
    });
    GetAllCountry()
    

});
function GetAllCountry() {
    debugger
    var MasterURL = BaseUrl + "/api/setups";
    $("#divLoader").show();
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", "Bearer " + getTokenFromSessionStorage());


    var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
    };


    let SetupURL = MasterURL + "/getcountry";
    commonFetch(SetupURL, requestOptions, function (data) {
        if (data != null && data != undefined) {
            $("#divLoader").hide();
            debugger
            $("#CountryId").html("");
            $("#CountryId").append("<option value=>Please Select</option>")

            data.data.sort(function (a, b) {
                var nameA = a.country_Name.toUpperCase();
                var nameB = b.country_Name.toUpperCase();
                return (nameA < nameB) ? -1 : (nameA > nameB) ? 1 : 0;
            });
            for (var i = 0; i < data.data.length; i++) {

                $("#CountryId").append("<option value='" + data.data[i].country_Id + "'>" + data.data[i].country_Name + "</option>")

            }
            GetFeildConfigurationById();
        }
        else {
            showSweetAlert("error", "Invalid Response", "");
        }
    })

    //fetch(SetupURL, requestOptions)
    //    .then(response => response.json())
    //    .then(data => {
    //        $("#divLoader").hide();
    //        debugger
    //        $("#CountryId").html("");
    //        $("#CountryId").append("<option value=>Please Select</option>")

    //        data.data.sort(function (a, b) {
    //            var nameA = a.country_Name.toUpperCase();
    //            var nameB = b.country_Name.toUpperCase();
    //            return (nameA < nameB) ? -1 : (nameA > nameB) ? 1 : 0;
    //        });
    //        for (var i = 0; i < data.data.length; i++) {

    //            $("#CountryId").append("<option value='" + data.data[i].country_Id + "'>" + data.data[i].country_Name + "</option>")

    //        }


    //    })
    //    .finally(() => {
    //        GetFeildConfigurationById();
    //    })
    //    .catch(error => { console.log('error', error); $("#divLoader").hide(); });

}
function GetFeildConfigurationById() {
    debugger
    $("#divLoader").show();
    var StateId = document.getElementById("StateId").value;
    URL = CountryURL + "/" + StateId + "/GetStateById";

    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    // myHeaders.append("Authorization", "Bearer " + getTokenFromSessionStorage());


    var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
    };
    commonFetch(URL, requestOptions, function (data) {
        if (data != null && data != undefined) {
            $("#divLoader").hide();

            debugger

            console.log(data);

            $("#StateCode").val(data.data.stateCode);

            $("#CountryId").val(data.data.countryId);

            $("#StateName").val(data.data.stateName);

            $("#StateNameAr").val(data.data.stateNameAr);
            $("#statusDropdown").val(data.data.isActive);
            $("#SortOrder").val(data.data.sortOrder);
        }
        else {
            showSweetAlert("error", "Invalid Response", "");
        }
    })

    //fetch(URL, requestOptions)
    //    .then(response => response.json())
    //    .then(data => {
    //        $("#divLoader").hide();

    //        debugger

    //        console.log(data);

    //        $("#StateCode").val(data.data.stateCode);

    //        $("#CountryId").val(data.data.countryId);

    //        $("#StateName").val(data.data.stateName);

    //        $("#StateNameAr").val(data.data.stateNameAr);
    //        $("#statusDropdown").val(data.data.isActive);
    //        $("#SortOrder").val(data.data.sortOrder);

            










    //    })
    //    .catch(error => console.log('error', error));

}
