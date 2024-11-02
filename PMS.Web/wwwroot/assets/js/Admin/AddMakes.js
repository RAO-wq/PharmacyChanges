function CreateMakes() {

    debugger
    var feildurl = BaseUrl + "/api/setups/addmakes";

    if ($('#CreateMakes').valid()) {
        debugger

        var data = $('#CreateMakes').serializeArray().reduce(function (obj, item) {
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
                if (data.success == 0) {
                    if (data.MakeId == null) {
                        $("th#MakeName").empty().text($("#MakeName").val());

                        $('#MakesModal').modal({
                            backdrop: 'static'
                        });
                    } else {
                        $("th#MakeName").empty().text($("#MakeName").val());

                        $('#MakesModal').modal({
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
        //                $("th#MakeName").empty().append(document.getElementById("MakeName").value);

        //                $('#MakesModal').modal({
        //                    backdrop: 'static'
        //                });
        //            } else {
        //                $("th#MakeName").empty().append(document.getElementById("MakeName").value);

        //                $('#MakesModal').modal({
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