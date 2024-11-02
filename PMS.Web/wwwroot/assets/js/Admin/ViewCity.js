CountryURL = BaseUrl + "/api/setups";

jQuery(document).ready(function () {
    debugger;
    var validationMessageContainers = document.querySelectorAll('.errmsgs');
    validationMessageContainers.forEach(function (container) {
        container.style.display = 'none';
    });
    GetAllCountry()

});
$("#CountryId").change(function () {
    var countryId = $(this).val();
    debugger;
    GetStateValue(countryId);

});
function GetStateValue(countryId, state) {
    debugger
    $("#divLoader").show();
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", "Bearer " + getTokenFromSessionStorage());


    var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
    };


    let SetupURL = BaseUrl + "/api/setups/" + countryId + "/getallstate";
    commonFetch(SetupURL, requestOptions, function (data) {
        if (data != null && data != undefined) {
            $("#divLoader").hide();
            debugger
            $("#StateId").html("");
            $("#StateId").append("<option value=>Please Select</option>")
            data.data.sort(function (a, b) {
                var nameA = a.stateName.toUpperCase();
                var nameB = b.stateName.toUpperCase();
                return (nameA < nameB) ? -1 : (nameA > nameB) ? 1 : 0;
            });
            for (var i = 0; i < data.data.length; i++) {
                var optionValue = data.data[i].stateId;
                var optionText = data.data[i].stateName;

                var isSelected = (optionValue === state);
                debugger
                $("#StateId").append("<option value='" + optionValue + "'" + (isSelected ? " selected" : "") + ">" + optionText + "</option>")
            }
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
    //        $("#StateId").html("");
    //        $("#StateId").append("<option value=>Please Select</option>")
    //        data.data.sort(function (a, b) {
    //            var nameA = a.stateName.toUpperCase();
    //            var nameB = b.stateName.toUpperCase();
    //            return (nameA < nameB) ? -1 : (nameA > nameB) ? 1 : 0;
    //        });
    //        for (var i = 0; i < data.data.length; i++) {
    //            var optionValue = data.data[i].stateId;
    //            var optionText = data.data[i].stateName;

    //            var isSelected = (optionValue === state);
    //            debugger
    //            $("#StateId").append("<option value='" + optionValue + "'" + (isSelected ? " selected" : "") + ">" + optionText + "</option>")
    //        }

    //    })
    //    .catch(error => { console.log('error', error); $("#divLoader").hide(); });
        

}
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
    var CityId = document.getElementById("CityId").value;
    URL = CountryURL + "/" + CityId + "/getcitybyid";

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

            $("#CityCode").val(data.data.cityCode);

            $("#CityName").val(data.data.cityName);

            $("#CityNameAr").val(data.data.cityNameAr);
            country = data.data.countryId
            $("#CountryId").val(data.data.countryId);
            state = data.data.stateId
            GetStateValue(country, state);



            $("#statusDropdown").val(data.data.isActive);
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

    //        $("#CityCode").val(data.data.cityCode);

    //        $("#CityName").val(data.data.cityName);

    //        $("#CityNameAr").val(data.data.cityNameAr);
    //        country = data.data.countryId
    //        $("#CountryId").val(data.data.countryId);
    //        state=data.data.stateId
    //        GetStateValue(country, state);
            
            

    //        $("#statusDropdown").val(data.data.isActive);










    //    })
    //    .catch(error => console.log('error', error));

}
