CountryURL = BaseUrl + "/api/setups";

jQuery(document).ready(function () {
    debugger;
    var validationMessageContainers = document.querySelectorAll('.errmsgs');
    validationMessageContainers.forEach(function (container) {
        container.style.display = 'none';
    });
    GetMakerById();

});
function GetMakerById() {
    debugger
    $("#divLoader").show();
    var MakeId = document.getElementById("MakeId").value;
    URL = CountryURL + "/" + MakeId + "/getmakesbyid";

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

            $("#MakeCode").val(data.data.makeCode);

            $("#MakeName").val(data.data.makeName);

            $("#MakeNameAr").val(data.data.makeNameAr);

            $("#Details").val(data.data.details);
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

    //        $("#MakeCode").val(data.data.makeCode);

    //        $("#MakeName").val(data.data.makeName);
            
    //        $("#MakeNameAr").val(data.data.makeNameAr);
            
    //        $("#Details").val(data.data.details);
            
    //    })
    //    .catch(error => console.log('error', error));

}
