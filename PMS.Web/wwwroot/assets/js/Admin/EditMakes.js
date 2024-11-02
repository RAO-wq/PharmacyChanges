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

function EditMakes() {

    debugger
    var MakeId = document.getElementById("MakeId").value;
    var feildurl = BaseUrl + "/api/setups/updatemakes";
    
    if ($('#EditMakes').valid()) {
        debugger

        var data = $('#EditMakes').serializeArray().reduce(function (obj, item) {
            obj[item.name] = item.value;
            return obj;
        }, {});

        console.log(data);
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        data.MakeId = MakeId;
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
        $('.errmsgs').show();
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