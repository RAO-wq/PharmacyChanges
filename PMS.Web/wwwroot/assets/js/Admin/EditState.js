
function EditState() {

    debugger
    var StateId = document.getElementById("StateId").value;
    var feildurl = BaseUrl + "/api/setups/editstate";
    

    if ($('#EditState').valid()) {


        var data = $('#EditState').serializeArray().reduce(function (obj, item) {
            obj[item.name] = item.value;
            return obj;
        }, {});

        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        data.StateId = StateId;
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
                debugger
                if (data.success === 0) {
                    debugger

                    $("th#stateNaming").empty().append(data.data.stateName);

                    $('#setstateModal').modal({
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

        //            $("th#stateNaming").empty().append(data.data.stateName);

        //            $('#setstateModal').modal({
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