$(document).ready(function () {
    debugger
    
    

    $("#StartDate").datepicker({
        autoclose: true,
    }).on('changeDate', function (selected) {
        var startDate = new Date(selected.date.valueOf());
        $('#StartDate').datepicker('setStartDate', startDate);
    });

    $("#EndDate").datepicker({
        autoclose: true,
    }).on('changeDate', function (selected) {
        var startDate = new Date(selected.date.valueOf());
        $('#EndDate').datepicker('setStartDate', startDate);
    });
    GetAllSurvey()

    
});

function GetAllSurvey() {
    debugger
    // var table = $('#kt_datatable_vertical_scroll').DataTable();
    SurveyURL = BaseUrl + "/api/Configuration/configurationdropdowns";
    
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    // myHeaders.append("Authorization", "Bearer " + getTokenFromSessionStorage());
    $("#divLoader").show();

    var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
    };
    commonFetch(SurveyURL, requestOptions, function (data) {
        if (data != undefined || data != null) {
            $("#Survey_Id").html("");
            $("#Survey_Id").append("<option value=>Please Select</option>")
            for (var i = 0; i < data.data.surveyList.length; i++) {
                $("#Survey_Id").append("<option value='" + data.data.surveyList[i].setupId + "'>" + data.data.surveyList[i].shortDescription + "</option>")              
            }
        }
        else {
            showSweetAlert('error', 'Invalid Response', '');
        }
    });
   

}

function getData() {
    if ($('#CreateSurvey').valid()) {
        $("#divLoader").show();
        surveySetupId = $("#Survey_Id option:selected").val();
        startDate = moment(document.getElementById("StartDate").value, 'DD/MM/YYYY').format('YYYY-MM-DD');
        endDate = moment(document.getElementById("EndDate").value, 'DD/MM/YYYY').format('YYYY-MM-DD');


        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        // myHeaders.append("Authorization", "Bearer " + getTokenFromSessionStorage());
        formData = { "StartDate": startDate, "EndDate": endDate, "SurveyId": surveySetupId };


        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            redirect: 'follow',
            body: JSON.stringify(formData)
        };
        commonFetch(BaseUrl + "/api/Admin/GetAllSurvey", requestOptions, function (data) {
            if (data != undefined || data != null) {
                updateGrid(data);
            }
            else {
                showSweetAlert('error', 'Invalid Response', '');
            }
        });

    }
    
    
}

function updateGrid(data) {
    $("#divLoader").hide();
    const dynamicGrid = document.getElementById("dynamicGrid").getElementsByTagName('tbody')[0];
    dynamicGrid.innerHTML = "";

    data.data.forEach(item => {
        const row = dynamicGrid.insertRow();

        const cell1 = row.insertCell(0);
        const cell2 = row.insertCell(1);
        const cell3 = row.insertCell(2);
        const cell4 = row.insertCell(3);
        const cell5 = row.insertCell(4);

        cell1.textContent = item.questionShortDescription;
        cell2.textContent = item.answerShortDescription;
        cell3.textContent = item.firstName + ' ' + item.lastName;
        const createdDate = new Date(item.createdDate);
        // Get the date portion using toLocaleDateString()
        cell4.textContent = createdDate.toLocaleDateString();
        cell5.textContent = item.company;

        // Convert item.createdDate to Date object
        
    });
}