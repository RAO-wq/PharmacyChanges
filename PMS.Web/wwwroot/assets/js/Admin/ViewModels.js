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
    var ModelId = document.getElementById("ModelId").value;
    URL = CountryURL + "/" + ModelId + "/getmodelbyid";

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

            $("#ModelCode").val(data.data.modelCode);

            $("#ModelName").val(data.data.modelName);

            $("#ModelNameAr").val(data.data.modelNameAr);
            $("#statusDropdown").val(data.data.isActive);

            $("#Details").val(data.data.details);
            var makeid = data.data.makeId;
            GetAllBrands(makeid);
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

    //        $("#ModelCode").val(data.data.modelCode);

    //        $("#ModelName").val(data.data.modelName);
            
    //        $("#ModelNameAr").val(data.data.modelNameAr);
    //        $("#statusDropdown").val(data.data.isActive);
            
    //        $("#Details").val(data.data.details);
    //        var makeid = data.data.makeId;
    //        GetAllBrands(makeid);
            
    //    })
    //    .catch(error => console.log('error', error));

}

function GetAllBrands(makeid) {
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


    let SetupURL = BaseUrl + "/api/setups/getmakes";
    commonFetch(SetupURL, requestOptions, function (data) {
        if (data != null && data != undefined) {
            $("#divLoader").hide();
            debugger
            $("#MakeId").html("");
            $("#MakeId").append("<option value=>Please Select</option>")
            for (var i = 0; i < data.data.length; i++) {
                var optionValue = data.data[i].makeId;
                var optionText = data.data[i].makeName;

                var isSelected = (optionValue === makeid);
                debugger
                $("#MakeId").append("<option value='" + optionValue + "'" + (isSelected ? " selected" : "") + ">" + optionText + "</option>")
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
    //        $("#MakeId").html("");
    //        $("#MakeId").append("<option value=>Please Select</option>")
    //        for (var i = 0; i < data.data.length; i++) {
    //            var optionValue = data.data[i].makeId;
    //            var optionText = data.data[i].makeName;

    //            var isSelected = (optionValue === makeid);
    //            debugger
    //            $("#MakeId").append("<option value='" + optionValue + "'" + (isSelected ? " selected" : "") + ">" + optionText + "</option>")
    //        }
    //    })
    //    .catch(error => { console.log('error', error); $("#divLoader").hide(); });

}

