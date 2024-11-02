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
    //        $("#statusDropdown").val(data.data.isActive);
    //        $("#ModelName").val(data.data.modelName);

    //        $("#ModelNameAr").val(data.data.modelNameAr);

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

function CreateModels() {

    debugger
    var feildurl = BaseUrl + "/api/setups/updatemodel";
    var ModelId = document.getElementById("ModelId").value;
    var MakeId = $('#MakeId').val();
    if ($('#CreateModels').valid()) {
        debugger

        var data = $('#CreateModels').serializeArray().reduce(function (obj, item) {
            obj[item.name] = item.value;
            return obj;
        }, {});

        console.log(data);
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        data.MakeId = MakeId;
        data.ModelId = ModelId;
        data.CreatedBy = sessionStorage.getItem('userName');
        data.ModifiedBy = sessionStorage.getItem('userName');

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            redirect: 'follow',
            body: JSON.stringify(data)
        };
        commonFetch(feildurl, requestOptions, function (data) {
            if (data != null && data != undefined) {
                if (data.success == 0) {
                    if (data.MakeId == null) {
                        $("th#ModelName").empty().text($("#ModelName").val());

                        $('#ModelModal').modal({
                            backdrop: 'static'
                        });
                    } else {
                        $("th#ModelName").empty().text($("#ModelName").val());

                        $('#ModelModal').modal({
                            backdrop: 'static'
                        });
                    }
                } else {
                    Swal.fire({
                        text: data.message,
                        icon: "error",
                        buttonsStyling: false,
                        confirmButtonText: "Ok, got it!",
                        customClass: {
                            confirmButton: "btn font-weight-bold btn-light"
                        }
                    });
                }
            }
            else {
                showSweetAlert("error", "Invalid Response", "");
            }
        })

        //fetch(feildurl, requestOptions)
        //    .then(response => response.json())
        //    .then(data => {
        //        $("#divLoader").hide();
        //        debugger
        //        if (data.success == 0) {
        //            if (data.MakeId == null) {
        //                $("th#ModelName").empty().append(document.getElementById("ModelName").value);

        //                $('#ModelModal').modal({
        //                    backdrop: 'static'
        //                });
        //            } else {
        //                $("th#ModelName").empty().append(document.getElementById("ModelName").value);

        //                $('#ModelModal').modal({
        //                    backdrop: 'static'
        //                });
        //            }
        //        } else {
        //            Swal.fire({
        //                text: data.message,
        //                icon: "error",
        //                buttonsStyling: false,
        //                confirmButtonText: "Ok, got it!",
        //                customClass: {
        //                    confirmButton: "btn font-weight-bold btn-light"
        //                }
        //            });
        //        }
        //    })
        //    .catch(error => console.log('error', error));
    }

    else {
        Swal.fire({
            text: "Please enter mandatory fields to proceed..!",
            icon: "error",
            buttonsStyling: false,
            confirmButtonText: "Ok, got it!",
            customClass: {
                confirmButton: "btn font-weight-bold btn-light"
            }
        }).then(function () {
            KTUtil.scrollTop();
        });
    }
}