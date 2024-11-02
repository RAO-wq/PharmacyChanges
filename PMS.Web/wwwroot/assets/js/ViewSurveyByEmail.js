var ForgotUrl = BaseUrl + '/auth';



$(document).ready(function () {
    localized();
    $('#forgotform').validate({
        rules: {
            UserName: {
                required: true,
                email: true
            }
        },
        messages: {
            UserName: {
                required: getTranslation("Email address is required."),
                email: getTranslation("Please enter a valid email address.")
            }
        }
    });

    document.getElementById('submitBtn').addEventListener('click', function () {
        if ($('#forgotform').valid()) {
            $("#divLoader").show();
        var UserName = document.getElementById('UserName').value;

        Url = ForgotUrl + "/" + UserName + "/Forgot";

        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        // myHeaders.append("Authorization", "Bearer " + getTokenFromSessionStorage());

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            redirect: 'follow',
        };

        fetch(Url, requestOptions)
            .then(response => response.json())
            .then(data => {
                $("#divLoader").hide();
                if (data.success) {
                    Swal.fire({
                        icon: 'success',
                        title: getTranslation('Email Sent Successfully!'),
                        text: getTranslation('Check your inbox for password recovery instructions. You will be redirected to the login page.'),
                        confirmButtonText: getTranslation('OK'),
                    }).then((result) => {
                        if (result.isConfirmed) {
                            var url = "/Account/Login";
                            window.location.replace(url);
                        }
                    });
                }
                else {
                    Swal.fire({
                        icon: 'error',
                        title: getTranslation('Email Sending Failed!'),
                        text: getTranslation('You will be redirected to the login page.'),
                        confirmButtonText: 'OK',
                    }).then((result) => {
                        if (result.isConfirmed) {
                            var url = "/Account/Login";
                            window.location.replace(url);
                        }
                    });
                }
            });
    }
});

});