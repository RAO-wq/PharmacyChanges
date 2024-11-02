CountryURL = BaseUrl + "/api/setups";

jQuery(document).ready(function () {
   
    GetAuditLogById();

});
function GetAuditLogById() {
    debugger
    $("#divLoader").show();
    var logid = document.getElementById("logid").value;
    URL = CountryURL + "/" + logid + "/getauditlogbyid";

    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    // myHeaders.append("Authorization", "Bearer " + getTokenFromSessionStorage());


    var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
    };

    fetch(URL, requestOptions)
        .then(response => response.json())
        .then(data => {
            $("#divLoader").hide();

            debugger

            console.log(data);

            $("#RequestUrl").val(data.data.requestUrl);

            $("#RequestTime").val(data.data.requestTime);

            $("#ResponseTime").val(data.data.responseTime);

            $("#RequestController").val(data.data.requestController);

            $("#RequestAction").val(data.data.requestAction);

            $("#RequestBody").val(data.data.requestBody);

            $("#ResponseBody").val(data.data.responseBody);

        })
        .catch(error => console.log('error', error));

}
