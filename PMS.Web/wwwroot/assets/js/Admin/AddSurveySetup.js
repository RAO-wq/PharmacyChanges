var CallURL = BaseUrl + "/api/Survey";
var MenusMasterURL = BaseUrl + "/api/ContractManagement";
var LoadInvoiceDetailsdatatable;
//var FileID = document.getElementById("FileId").value;

jQuery(document).ready(function () {

    $('#SurveySetupId').select2();
    $('#EntityId').select2();

    //$("#StartDate").datepicker({
    //    autoclose: true,
    //}).on('changeDate', function (selected) {
    //    var startDate = new Date(selected.date.valueOf());
    //    $('#StartDate').datepicker('setStartDate', startDate);
    //});

    //$("#EndDate").datepicker({
    //    autoclose: true,
    //}).on('changeDate', function (selected) {
    //    var startDate = new Date(selected.date.valueOf());
    //    $('#EndDate').datepicker('setStartDate', startDate);
    //});
    $("#StartDate").datepicker({
        autoclose: true,
    }).on('changeDate', function (selected) {
        var startDate = new Date(selected.date.valueOf());
        $('#EndDate').datepicker('setStartDate', startDate);

        // Check if end date is before start date and adjust it if needed
        var endDate = $('#EndDate').datepicker('getDate');
        if (endDate !== null && endDate < startDate) {
            $('#EndDate').datepicker('setDate', startDate);
        }
    });

    $("#EndDate").datepicker({
        autoclose: true,
    }).on('changeDate', function (selected) {
        var endDate = new Date(selected.date.valueOf());
        $('#StartDate').datepicker('setEndDate', endDate);

        // Check if start date is after end date and adjust it if needed
        var startDate = $('#StartDate').datepicker('getDate');
        if (startDate !== null && startDate > endDate) {
            $('#StartDate').datepicker('setDate', endDate);
        }
    });

    GetSetups();
    GetSurveyActions();
    //GetEntities();
    GetLessorUsers();
});

function CreateSurvey() {

    debugger
    var feildurl = CallURL + "/AddSetSurvey";
    if ($('#CreateSurvey').valid()) {
        debugger
        $("#divLoader").show();
        var data = $('#CreateSurvey').serializeArray().reduce(function (obj, item) {
            obj[item.name] = item.value;
            return obj;
        }, {});

        console.log(data);
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        var IsActiveIdSelect = document.getElementById("IsActive");
        var IsActiveselectedOption = IsActiveIdSelect.options[IsActiveIdSelect.selectedIndex];
        var IsActivesetupValue = IsActiveselectedOption.value;

        data.SurveySetupId = parseInt(document.getElementById("SurveySetupId").value);
        data.StartDate = moment(document.getElementById("StartDate").value, 'DD/MM/YYYY').format('YYYY-MM-DD');
        data.EndDate = moment(document.getElementById("EndDate").value, 'DD/MM/YYYY').format('YYYY-MM-DD');
        data.CreatedBy = sessionStorage.getItem('userId');
        data.ModifiedBy = sessionStorage.getItem('userId');
        data.IsActive = IsActivesetupValue;
        data.IsRecursive = document.getElementById('RecursiveCheckbox').checked;
        data.ActionName = $("#ActionName").val();
        //data.EntityId = parseInt(document.getElementById("EntityId").value);

        //data.UserId = $('#UserId').val();

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            redirect: 'follow',
            body: JSON.stringify(data)
        };

        commonFetch(feildurl, requestOptions, function (data) {
            if (data != undefined || data != null) {
                $('#SurveySetupModal').modal({
                    backdrop: 'static'
                });
            }
            else {
                showSweetAlert('error', 'Invalid Response', '');
            }
        });

        //fetch(feildurl, requestOptions)
        //    .then(response => response.json())
        //    .then(data => {
        //        $("#divLoader").hide();
        //        debugger
        //        if (data.success == true) {

        //            $('#SurveySetupModal').modal({
        //                backdrop: 'static'
        //            });

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
        //    .catch(error => {
        //        $("#divLoader").hide();
        //        console.log('error', error)
        //    });
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

//function GetEntities() {
//    debugger
//    $("#divLoader").show();
//    var userId = sessionStorage.getItem('userId');
//    let MenusURL = `${MenusMasterURL}/${userId}/GetAllMenus`;
//    var myHeaders = new Headers();
//    myHeaders.append("Content-Type", "application/json");

//    var requestOptions = {
//        method: 'GET',
//        headers: myHeaders,
//        redirect: 'follow'
//    };
//    fetch(MenusURL, requestOptions)
//        .then(response => response.json())
//        .then(data => {
//            $("#divLoader").hide();
//            debugger
//            $("#EntityId").html("");
//            $("#EntityId").append("<option value=>Please Select</option>")
//            for (var i = 0; i < data.data.length; i++) {
//                if (data.data[i].entityName != 'Survey') {
//                    for (var j = 0; j < data.data[i].tabs.length; j++) {
//                        $("#EntityId").append("<option value='" + data.data[i].tabs[j].entityId + "'>" + data.data[i].tabs[j].entityName + "</option>")
//                    }
//                }
//            }
//        })
//        .catch(error => console.log('error', error));
//}

 