
function CreateCountry() {

    debugger
    var feildurl = BaseUrl + "/api/setups/savecountry";
    
   
   
    var selectedCompany = $("#CompanyId option:selected").val() == "" ? 0 : $("#CompanyId option:selected").val();

    if ($('#CreateCountry').valid()) {
        debugger

        var data = $('#CreateCountry').serializeArray().reduce(function (obj, item) {
            obj[item.name] = item.value;
            return obj;
        }, {});
        console.log(data);
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
       

        data.Created_By = sessionStorage.getItem('userName');
        data.Modified_By = sessionStorage.getItem('userName');
        var countryName = data.Country_Name;
        

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

                    $("th#templateNaming").empty().append(countryName);

                    /* $('#feildNaming').val(Field_Name)*/
                    $('#setTemplateModal').modal({
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
                   
        //            $("th#templateNaming").empty().append(countryName);
                    
        //            /* $('#feildNaming').val(Field_Name)*/
        //            $('#setTemplateModal').modal({
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