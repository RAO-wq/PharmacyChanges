jQuery(document).ready(function () {
    debugger;

    GetAllCountry()




});
$("#CountryId").change(function () {
    var countryId = $(this).val();
    debugger;
    GetStateValue(countryId);

});
function GetStateValue(countryId) {
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

                $("#StateId").append("<option value='" + data.data[i].stateId + "'>" + data.data[i].stateName + "</option>")



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

    //            $("#StateId").append("<option value='" + data.data[i].stateId + "'>" + data.data[i].stateName + "</option>")



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


    let SetupURL = MasterURL + "/getcountryactive";
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
    //    .catch(error => { console.log('error', error); $("#divLoader").hide(); });

}
function CreateCity() {

    debugger
    var feildurl = BaseUrl + "/api/setups/savecity";



    var selectedCompany = $("#CompanyId option:selected").val() == "" ? 0 : $("#CompanyId option:selected").val();

    if ($('#CreateCity').valid()) {
        debugger

        var data = $('#CreateCity').serializeArray().reduce(function (obj, item) {
            obj[item.name] = item.value;
            return obj;
        }, {});
        console.log(data);
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");


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
                $("#divLoader").hide();

                debugger
                if (data.success === 0) {
                    debugger

                    $("th#cityNaming").empty().append(data.data.cityName);

                    /* $('#feildNaming').val(Field_Name)*/
                    $('#setcityModal').modal({
                        backdrop: 'static'
                    });

                    //Swal.fire({
                    //    text: "Created",
                    //    icon: "success",
                    //    buttonsStyling: false,
                    //    confirmButtonText: "Ok, got it!",
                    //    customClass: {
                    //        confirmButton: "btn font-weight-bold btn-light"
                    //    }
                    //})

                }
                else {
                    Swal.fire({
                        text: data.message,
                        icon: "error",
                        buttonsStyling: false,
                        confirmButtonText: "Ok, got it!",
                        customClass: {
                            confirmButton: "btn font-weight-bold btn-light"
                        }
                    })
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
        //        if (data.success === 0) {
        //            debugger

        //            $("th#cityNaming").empty().append(data.data.cityName);

        //            /* $('#feildNaming').val(Field_Name)*/
        //            $('#setcityModal').modal({
        //                backdrop: 'static'
        //            });

        //            //Swal.fire({
        //            //    text: "Created",
        //            //    icon: "success",
        //            //    buttonsStyling: false,
        //            //    confirmButtonText: "Ok, got it!",
        //            //    customClass: {
        //            //        confirmButton: "btn font-weight-bold btn-light"
        //            //    }
        //            //})

        //        }
        //        else {
        //            Swal.fire({
        //                text: data.message,
        //                icon: "error",
        //                buttonsStyling: false,
        //                confirmButtonText: "Ok, got it!",
        //                customClass: {
        //                    confirmButton: "btn font-weight-bold btn-light"
        //                }
        //            })
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