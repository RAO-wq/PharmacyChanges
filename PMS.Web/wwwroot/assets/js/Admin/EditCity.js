
function EditCity() {

    debugger
    var CityId = document.getElementById("CityId").value;
    var feildurl = BaseUrl + "/api/setups/editcity";
    

    if ($('#CreateCity').valid()) {


        var data = $('#CreateCity').serializeArray().reduce(function (obj, item) {
            obj[item.name] = item.value;
            return obj;
        }, {});

        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        data.CityId = CityId;
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
                if (data.success === 0) {
                    debugger
                    $("th#cityNaming").empty().text($("#CityName").val());

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
        //            $("th#cityNaming").empty().append(document.getElementById("CityName").value);
                    
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
        var validationMessageContainers = document.querySelectorAll('.errmsgs');
        validationMessageContainers.forEach(function (container) {
            container.style.display = 'block';
        });
    }
}