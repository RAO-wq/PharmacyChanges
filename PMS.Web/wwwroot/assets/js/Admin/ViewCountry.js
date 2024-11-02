CountryURL = BaseUrl + "/api/setups";

jQuery(document).ready(function () {
    debugger;
    var validationMessageContainers = document.querySelectorAll('.errmsgs');
    validationMessageContainers.forEach(function (container) {
        container.style.display = 'none';
    });
    GetFeildConfigurationById();

});
function GetFeildConfigurationById() {
    debugger
    $("#divLoader").show();
    var CountryId = document.getElementById("Country_Id").value;
    URL = CountryURL + "/" + CountryId + "/GetCountryById";

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

            $("#Country_Code_2").val(data.data.country_Code_2);

            $("#Country_Code_3").val(data.data.country_Code_3);

            $("#Country_Name").val(data.data.country_Name);

            $("#Country_Name_Ar").val(data.data.country_Name_Ar);
            $("#Country_Number_Code").val(data.data.country_Number_Code);
            $("#Country_Dial_Code").val(data.data.country_Dial_Code);

            $("#Is_Active").val(data.data.is_Active);
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

    //        $("#Country_Code_2").val(data.data.country_Code_2);

    //        $("#Country_Code_3").val(data.data.country_Code_3);
            
    //        $("#Country_Name").val(data.data.country_Name);
            
    //        $("#Country_Name_Ar").val(data.data.country_Name_Ar);
    //        $("#Country_Number_Code").val(data.data.country_Number_Code);
    //        $("#Country_Dial_Code").val(data.data.country_Dial_Code);

    //        $("#Is_Active").val(data.data.is_Active);
           
            


            





    //    })
    //    .catch(error => console.log('error', error));

}
