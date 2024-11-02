var MasterURL = BaseUrl + "/api/Admin";
var list = [];
var root;
var test2;

var defaultStartDate;
var defaultEndDate;


jQuery(document).ready(function () {

    KTBootstrapDaterangepicker.init();
    
    GetLessorTypeCompanies();
    var ApprovedCounts = sessionStorage.getItem('ApprovedCounts');
    var PendingCounts = sessionStorage.getItem('PendingCounts');
    var RejectedCounts = sessionStorage.getItem('RejectedCounts');
    var TotalContractsCounts = sessionStorage.getItem('TotalContractsCounts');
    var StatusCounts = sessionStorage.getItem('StatusCounts');


    getInboxCounts();
    getDashboardCount();
    localized(330);   
});
function getDashboardCount(startDate, endDate, companyId) {
    
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", "Bearer " + getTokenFromSessionStorage());
    var RoleType = sessionStorage.getItem('role');

    var companyType = sessionStorage.getItem('companyType');
    if (companyId == null) {
        if (companyType == 'Lessor') {
            companyId = sessionStorage.getItem('companyId');
        } else {
            companyId = null;
        }
    }

    if ((startDate == null || startDate == undefined) && (endDate == null || endDate == undefined)) {
        var dateTimePicker = document.getElementById("kt_daterangepicker_1");
        defaultStartDate = '2019-01-01';
        defaultEndDate = getCurrentDate(); // Assuming this function returns current date in 'YYYY-MM-DD' format
        dateTimePicker.value = moment(defaultStartDate, 'YYYY-MM-DD').format('MM/DD/YYYY') + ' - ' + moment(defaultEndDate, 'YYYY-MM-DD').format('MM/DD/YYYY');

        var startDate = defaultStartDate;
        var endDate = defaultEndDate;

        endDate = moment(endDate, 'YYYY-MM-DD').add(1, 'day').format('YYYY-MM-DD');
    } else {
        endDate = moment(endDate, 'YYYY-MM-DD').add(1, 'day').format('YYYY-MM-DD');
    }

    //if ((startDate == null || startDate == undefined) && (endDate == null || endDate == undefined)) {
    //    var dateTimePicker = document.getElementById("kt_daterangepicker_1");
    //    dateTimePicker.value = moment(subtractDaysFromCurrentDate(7), 'YYYY-MM-DD').format('MM/DD/YYYY') + ' - ' + moment(getCurrentDate(), 'YYYY-MM-DD').format('MM/DD/YYYY');
    //    var startDate = startDate || subtractDaysFromCurrentDate(7);
    //    var endDate = endDate || getCurrentDate();
    //    endDate = moment(endDate, 'YYYY-MM-DD').add(1, 'day').format('YYYY-MM-DD');
    //}
    //else {
    //    endDate = moment(endDate, 'YYYY-MM-DD').add(1, 'day').format('YYYY-MM-DD');
    //}
    
    

    if (RoleType == 'MakerCheckerRole') {
        var UserID = sessionStorage.getItem('userId');
    }
    //var companyId = sessionStorage.getItem('companyId');
    var companyTypeId = sessionStorage.getItem('companyTypeId');
    
    var UserName = sessionStorage.getItem('userName');
    formData = { "CompanyTypeId": parseInt(companyTypeId), "UserId": UserID, "UserName": UserName, "CompanyId": parseInt(companyId), "SearchDateStart": startDate,"SearchDateEnd":endDate };

    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        redirect: 'follow',
        body: JSON.stringify(formData)
    };

    let SetupURL = MasterURL + "/dashboardcounts";
    commonFetch(SetupURL, requestOptions, function (data) {
        if (data != undefined && data != null) {
            
            console.log(data);
            var Data = data.dashboardCounts;
            var count = data.statusCounts;
            $("#ApprovedCounts").text(Data.approvedContractsCount);
            $("#PendingCounts").text(Data.pendingContractsCount);
            $("#RejectedCounts").text(Data.rejectedContractsCount);
            $("#TotalContractsCounts").text(Data.totalContracts);
            $("#StatusCounts").text(count);

            sessionStorage.setItem('ApprovedCounts', Data.approvedContractsCount);
            sessionStorage.setItem('PendingCounts', Data.pendingContractsCount);
            sessionStorage.setItem('RejectedCounts', Data.rejectedContractsCount);
            sessionStorage.setItem('TotalContractsCounts', Data.totalContracts);
            sessionStorage.setItem('StatusCounts', count);
        } else {
            showSweetAlert('error', getTranslation("Invalid Response"), "");
            reject(getTranslation("Invalid Response"));
        }
    });
}

//API Calls
function getData(startDate, endDate, companyId, reportId) {
    var reportsURL = BaseUrl + "/api/setups";
    var companyType = sessionStorage.getItem('companyType');

    ////On Ready This if condition will be set value into datetime range picker.
    //if (startDate == null && endDate == null) {
    //    var dateTimePicker = document.getElementById("kt_daterangepicker_1");
    //    dateTimePicker.value = moment(subtractDaysFromCurrentDate(7), 'YYYY-MM-DD').format('MM/DD/YYYY') + ' - ' + moment(getCurrentDate(), 'YYYY-MM-DD').format('MM/DD/YYYY');

    //}
    if ((startDate == null || startDate == undefined) && (endDate == null || endDate == undefined)) {
        var dateTimePicker = document.getElementById("kt_daterangepicker_1");
        var defaultStartDate = '2019-01-01';
        var defaultEndDate = getCurrentDate(); // Assuming this function returns current date in 'YYYY-MM-DD' format
        dateTimePicker.value = moment(defaultStartDate, 'YYYY-MM-DD').format('MM/DD/YYYY') + ' - ' + moment(defaultEndDate, 'YYYY-MM-DD').format('MM/DD/YYYY');
        var startDate = defaultStartDate;
        var endDate = defaultEndDate;
        endDate = moment(endDate, 'YYYY-MM-DD').add(1, 'day').format('YYYY-MM-DD');
    }

    startDate = startDate ;
    endDate = endDate || getCurrentDate();
    // Get the input element by ID
    
    
    if (companyId == null) {
        if (companyType == 'Lessor') {
            companyId = sessionStorage.getItem('companyId');
        } else {
            companyId = null;
        }
    };

    

    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    // myHeaders.append("Authorization", "Bearer " + getTokenFromSessionStorage());
    formData = { "StartDate": startDate, "EndDate": endDate, "ReportId": reportId,"LessorId":companyId };
    //formData = { "ReportId": '16', "LessorId": companyId };

    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        redirect: 'follow',
        body: JSON.stringify(formData)
    };

    return new Promise((resolve, reject) => {
        commonFetch(reportsURL + "/reportsgridfordashboard", requestOptions, function (data) {
            if (data != undefined && data != null) {
                console.log(data);
                resolve(data);
            } else {
                showSweetAlert('error', "Invalid Response", "");
                reject("Invalid Response");
            }
        });
    });


    //return fetch(reportsURL + "/reportsgridfordashboard", requestOptions)
    //    .then(response => response.json())
    //    .then(data => {
    //        $("#divLoader").hide();
    //        ;

    //        console.log(data);
    //        return data;
    //        //chartfiles(data);
    //        //assetsChart(data);

            
    //    })
    //    .catch(error => console.log('error', error));
}

//Dates
function subtractDaysFromCurrentDate(days) {
    var today = new Date();

    
    today.setDate(today.getDate() - days);

    
    return getFormattedDate(today);
}
function getCurrentDate() {
    var today = new Date();
    return getFormattedDate(today);
}

function getFormattedDate(date) {
    
    var year = date.getFullYear();
    var month = (date.getMonth() + 1).toString().padStart(2, '0'); 
    var day = date.getDate().toString().padStart(2, '0');

    
    return year + '-' + month + '-' + day;
}

///----------------------------------------//--------------------------//
//Assign In Below Methods
function onButtonClick() {

    var dates = KTBootstrapDaterangepicker.getDates();
    var startDate = dates.startDate;
    var endDate = dates.endDate;
    var companyType = sessionStorage.getItem('companyType');

    if (companyType == 'Lessor') {

        var companyId = sessionStorage.getItem('companyId')

    }
    else {
        var companyId = $("#CompanyId option:selected").val();
    }
    
    getDashboardCount(startDate, endDate, companyId)

    debugger
    
    getData(startDate, endDate, companyId, '41')
        .then(resp => {
            if (resp.success == 0) {
                canvas1(resp.data);
            }
        });

    
    getData(startDate, endDate, companyId, '42')
        .then(resp => {
            if (resp.success == 0) {
                canvas2(resp.data);
            }
        });

    getData(startDate, endDate, companyId, '43')
        .then(resp => {
            if (resp.success == 0) {
                canvas3(resp.data);
            }
        });

    getData(startDate, endDate, companyId, '44')
        .then(resp => {
            if (resp.success == 0) {
                canvas4(resp.data);
            }
        });

    getData(startDate, endDate, companyId, '45')
        .then(resp => {
            if (resp.success == 0) {
                canvas5(resp.data);
            }
        });

    getData(startDate, endDate, companyId, '46')
        .then(resp => {
            if (resp.success == 0) {
                canvas6(resp.data);
            }
        });

    getData(startDate, endDate, companyId, '47')
        .then(resp => {
            if (resp.success == 0) {
                canvas7(resp.data);
            }
        });

    getData(startDate, endDate, companyId, '48')
        .then(resp => {
            if (resp.success == 0) {
                canvas8(resp.data);
            }
        });

    
    getData(startDate, endDate, companyId, '49')
        .then(resp => {

            if (resp.success == 0) {
                analytics1(resp.data);
            }
        });

    getData(startDate, endDate, companyId, '50')
        .then(resp => {

            if (resp.success == 0) {
                canvas9(resp.data);
            }
        });

    getData(startDate, endDate, companyId, '51')
        .then(resp => {

            if (resp.success == 0) {
                canvas10(resp.data);
            }
        });

    getData(startDate, endDate, companyId, '40')
        .then(resp => {

            if (resp.success == 0) {
                canvas11(resp.data);
            }
        });

    getData(startDate, endDate, companyId, '52')
        .then(resp => {

            if (resp.success == 0) {
                canvas12(resp.data);
            }
        });

    getData(startDate, endDate, companyId, '53')
        .then(resp => {

            if (resp.success == 0) {
                analytics3(resp.data);
            }
        });


    //getData(startDate, endDate, companyId, '16')
    //    .then(resp => {
    //        // Use chartFilesAndAssetChart here
    //        chartfiles(resp);
    //        assetsChart(resp);
    //    });
    //getData(startDate, endDate, companyId, '15')
    //    .then(resp => {
    //        // Use chartFilesAndAssetChart here
    //        assetsChartByClosure(resp);
    //    });
    //getData(startDate, endDate, companyId, '10')
    //    .then(resp => {
    //        // Use chartFilesAndAssetChart here
    //        durationAnalysisChart(resp);
    //});
    
    //getData(startDate, endDate, companyId, '17')
    //    .then(resp => {
    //        // Use chartFilesAndAssetChart here
    //        openYearPurposeChart(resp);
    //    });
        
    //getData(startDate, endDate, companyId, '18')
    //    .then(resp => {
    //        // Use chartFilesAndAssetChart here
    //        openYearPurposeChartByLessor(resp);
    //    });

    //getData(startDate, endDate, companyId, '22')
    //    .then(resp => {
    //        // Use chartFilesAndAssetChart here
    //        chartLiftingFinancialProduct(resp);
    //    });
    //getData(startDate, endDate, companyId, '24')
    //    .then(resp => {
    //        // Use chartFilesAndAssetChart here
    //        chartAcceptDate(resp);
    //    });

    //getData(startDate, endDate, companyId, '25')
    //    .then(resp => {
    //        // Use chartFilesAndAssetChart here
    //        chartAcceptDateByLessor(resp);
    //    });

    //getData(startDate, endDate, companyId, '23')
    //    .then(resp => {
    //        // Use chartFilesAndAssetChart here
    //        chartOpenDateMonth(resp);
    //    });
    //getData(startDate, endDate, companyId, '26')
    //    .then(resp => {
    //        // Use chartFilesAndAssetChart here
    //        chartOpenDateMonthByLessorWise(resp);
    //    });
    

    //getData(startDate, endDate, companyId, '34')
    //    .then(resp => {
    //        // Use chartFilesAndAssetChart here
    //        chartopenDateYear(resp);
    //    });
}

function GetLessorTypeCompanies() {

    $("#divLoader").show();
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", "Bearer " + getTokenFromSessionStorage());
    var currentCompanyId = "";
    var langId = localStorage.getItem('languageId');

    var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
    };

    var CompanyTypeID = 300;
    let SetupURL = BaseUrl + "/api/Admin/" + CompanyTypeID + "/GetCompanyByType";


    var companyType = sessionStorage.getItem('companyType');

    if (companyType == 'Lessor') {

        $("#CompanyId").prop("disabled", true);
    }
    else {
        $("#CompanyId").prop("disabled", false);
    }
    commonFetch(SetupURL, requestOptions,function (data) {
        if (data != undefined && data != null) {
            $("#divLoader").hide();

            $("#CompanyId").html("");
            if (langId == 1) {
                $("#CompanyId").append("<option value=''>الجميع</option>")
                for (var i = 0; i < data.length; i++) {

                    $("#CompanyId").append("<option value='" + data[i].company_Id + "'>" + data[i].companyNameAR + "</option>")
                }
            }
            else {
                $("#CompanyId").append("<option value=''>All</option>")
                for (var i = 0; i < data.length; i++) {

                    $("#CompanyId").append("<option value='" + data[i].company_Id + "'>" + data[i].companyName + "</option>")
                }
            }
            
            
            if (companyType == 'Lessor') {
                currentCompanyId = sessionStorage.getItem('companyId');

                $("#CompanyId").val(currentCompanyId);

            }
            else {
                currentCompanyId = null;

            }
            
        } else {
            showSweetAlert('error', "Invalid Response", "")
        }
    });
}

//Assign Methods End

var KTBootstrapDaterangepicker = function () {


    var startDate, endDate;


    var demos = function () {
        ;

        $('#kt_daterangepicker_1, #kt_daterangepicker_1_modal').daterangepicker({
            buttonClasses: ' btn',
            applyClass: 'btn-primary',
            cancelClass: 'btn-secondary'
        }, function (start, end, label) {

            startDate = start.format('YYYY-MM-DD');
            endDate = end.format('YYYY-MM-DD');
            console.log("Selected dates:", startDate, "to", endDate);
        });
    };


    var getDates = function () {
        return { startDate: startDate, endDate: endDate };
    };

    return {

        init: function () {
            demos();
        },
        getDates: getDates
    };
}();

function getNextColor(currentColor) {
    const colorNames = Object.keys(CHART_COLORS);
    const currentIndex = colorNames.indexOf(currentColor);

    if (currentIndex === -1) {
        // If the current color is not found or invalid, return the first color
        return colorNames[0];
    }

    const nextIndex = (currentIndex + 1) % colorNames.length;
    return colorNames[nextIndex];
}


function formatDate(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2)
        month = '0' + month;
    if (day.length < 2)
        day = '0' + day;

    return [day, month, year].join('-');
}


window.addEventListener('DOMContentLoaded', (event) => {
    if (sessionStorage.getItem('showSurvey') === 'true') {
        showSurvey();
        sessionStorage.removeItem('showSurvey');  // Clean up the flag
    }
});