var MasterURL = BaseUrl + "/api/setups";

var LoadPricingPlanGrid;
var SearchDateStart = null;
var SearchDateEnd = null;
var globalUserId;
var globalUserName;
var globalSearchDateStart;
var globalSearchDateEnd;
var isGridInitialized = false;
var dataSource = []
var usersDataset = []

jQuery(document).ready(function () {
    $("#UserId").select2();

    $("#SearchDateStart").datepicker({
        autoclose: true,
    }).on('changeDate', function (selected) {
        var SearchDateStart = new Date(selected.date.valueOf());
        $('#SearchDateEnd').datepicker('setStartDate', SearchDateStart);
    });0

    $("#SearchDateEnd").datepicker({
        autoclose: true,
    }).on('changeDate', function (selected) {
        var SearchDateEnd = new Date(selected.date.valueOf());
        $('#SearchDateStart').datepicker('setEndDate', SearchDateEnd);
    });

    GetAllUsers();

    $('#btnExport').prop("disabled", true);
});

function doRedirection(val, mode) {
    debugger
    switch (mode) {
        case "View":
            document.forms['ViewLogDetails']['Id'].value = val;
            PostRedirect("ViewLogDetails", val);
            break;
    }
}

function GetAllUsers() {
    debugger
    $("#divLoader").show();
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
    };

    let SetupURL = MasterURL + "/getallauditlogusers";
    commonFetch(SetupURL, requestOptions, function (data) {
        if (data != undefined || data != null) {
            var dataset = data.data;
            usersDataset = dataset;
            $("#UserId").html("");
            $("#UserId").append("<option value='all'>Select All</option>")
            for (var i = 0; i < dataset.length; i++) {
                $("#UserId").append("<option value='" + dataset[i].id + "'>" + dataset[i].userName + "</option>")
            }
        }
        else {
            showSweetAlert('error', 'Invalid Response', '');
        }
    });

    //fetch(SetupURL, requestOptions)
    //    .then(response => response.json())
    //    .then(data => {
    //        $("#divLoader").hide();
    //        debugger
    //        c
    //        console.log(dataset);
    //        $("#UserId").html("");
    //        $("#UserId").append("<option value='null'>Select All</option>")
    //        for (var i = 0; i < dataset.length; i++) {
    //            $("#UserId").append("<option value='" + dataset[i].id + "'>" + dataset[i].userName + "</option>")
    //        }
    //    })
    //    .catch(error => { console.log('error', error); $("#divLoader").hide(); });
}

function FilterData() {
    debugger
    var startDate = document.getElementById("SearchDateStart").value;
    var endDate = document.getElementById("SearchDateEnd").value;
    var userDropdown = document.getElementById('UserId');
    var userId = userDropdown.value;
    var username = usersDataset.find(x => x.id === userId).userName;
    globalUserName = username;

    if (startDate.trim() === '' || endDate.trim() === '' || userId.trim() === '') {
        Swal.fire({
            text: "Please select From date, To date, and user before filtering!",
            icon: "error",
            buttonsStyling: false,
            confirmButtonText: "Ok, got it!",
            customClass: {
                confirmButton: "btn font-weight-bold btn-light"
            }
        }).then(function () {
            KTUtil.scrollTop();
        });
        return; // Exit the function if validation fails
    }

    if ($('#FilterData').valid()) {
        debugger
        var rawSearchDateStart = startDate;
        var rawSearchDateEnd = endDate;
        globalUserId = userId;

        // Convert the date values to a different format (e.g., "MM/DD/YYYY")
        globalSearchDateStart = (rawSearchDateStart != null && rawSearchDateStart != "") ? convertDateFormat(rawSearchDateStart) : rawSearchDateStart;
        globalSearchDateEnd = (rawSearchDateEnd != null && rawSearchDateEnd != "") ? convertDateFormat(rawSearchDateEnd) : rawSearchDateEnd;

        if (isGridInitialized){
            debugger;
            $('#Model_datatable').KTDatatable().destroy();
        }

        KTDatatableAutoColumnHideDemo.init();
        isGridInitialized = true; 

//        $('#SearchDateStart').val('');
//        $('#SearchDateEnd').val('');

//        $('#UserId').val('all').trigger('change');

      
    } else {
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

function exportFilteredData() {
    debugger
    var startDate = document.getElementById("SearchDateStart").value;
    var endDate = document.getElementById("SearchDateEnd").value;
    var userDropdown = document.getElementById('UserId');
    var userId = userDropdown.value;

    if (startDate.trim() === '' || endDate.trim() === '' || userId.trim() === '') {
        Swal.fire({
            text: "Please select From date, To date, and user before filtering!",
            icon: "error",
            buttonsStyling: false,
            confirmButtonText: "Ok, got it!",
            customClass: {
                confirmButton: "btn font-weight-bold btn-light"
            }
        }).then(function () {
            KTUtil.scrollTop();
        });
        return; // Exit the function if validation fails
    }
    var rawSearchDateStart = startDate;
    var rawSearchDateEnd = endDate;
    globalUserId = userId;

    // Convert the date values to a different format (e.g., "MM/DD/YYYY")
    globalSearchDateStart = (rawSearchDateStart != null && rawSearchDateStart != "") ? convertDateFormat(rawSearchDateStart) : rawSearchDateStart;
    globalSearchDateEnd = (rawSearchDateEnd != null && rawSearchDateEnd != "") ? convertDateFormat(rawSearchDateEnd) : rawSearchDateEnd;

    var myHeaders = new Headers();
    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        redirect: 'follow'
    };
    var modifiedUrl = MasterURL + "/generateLogsExcel?startDate=" + globalSearchDateStart + "&endDate=" + globalSearchDateEnd + (globalUserId == 'all' ? "" : "&userId=" + globalUserId)
    commonFetch(modifiedUrl, requestOptions, function (data) {
        if (data != null && data != undefined) {
            debugger
            var fileName = data.data;
            //window.location.href = BaseUrl + '/api/setups/AuditLogsDownloaded/' + fileName + '/downloadfile';
            var downloadUrl = BaseUrl + '/api/setups/AuditLogsDownloaded/' + fileName + '/downloadfile';
            downloadFile(fileName, downloadUrl);
        }
        else {
            showSweetAlert('error', 'Invalid Response');
        }
    });

}

var KTDatatableAutoColumnHideDemo = function () {
    LoadPricingPlanGrid = function () {
        debugger;
        var datatable = $('#Model_datatable').KTDatatable({
            rows: {
                autoHide: false
            },
            data: {
                type: 'remote',
                async: true,
                source: {
                    read: {
                        url: MasterURL + "/getauditlogs",
                        method: 'POST',
                        params: {
                            ServerGridCall: true,
                            UserId: globalUserId == 'all' ? null : globalUserId,
                            UserName: globalUserName == 'Select All' ? null : globalUserName,
                            CompanyId: parseInt(sessionStorage.getItem("companyId")),
                            SearchDateStart: globalSearchDateStart,
                            SearchDateEnd: globalSearchDateEnd,
                        },
                        headers: {
                            'AccessToken': getTokenFromSessionStorage()
                        },
                        map: function (raw) {
                            debugger
                            MainDataSource = raw.data;
                            if (MainDataSource.length > 0) {
                                $('#btnExport').prop("disabled", false);
                            }
                            return MainDataSource;
                        }
                    },
                },
                pageSize: 10,
                serverPaging: true,
                serverFiltering: true,
                serverSorting: true,
                saveState: false,
            },
            columns: {
                adjust: true
            },
            layout: {
                scroll: true
            },
            sortable: true,
            pagination: true,
            columns: [
                {
                    field: 'userName',
                    title: 'Username'
                },
                {
                    field: 'viewName',
                    title: 'View Name'
                },
                {
                    field: 'controllerName',
                    title: 'Request Controller',
                },
                {
                    field: 'actionName',
                    title: 'Request Action',
                },
                {
                    field: 'eventType',
                    title: 'Event Type',
                },
                {
                    field: 'eventDate',
                    title: 'Event Date',
                    type: 'date',
                    width: 80,
                    template: function (row) {
                        debugger
                        if (row.eventDate) {
                            var dateParts = row.eventDate.split(" ");
                            if (dateParts.length > 0) {
                                var date = new Date(dateParts[0]);
                                var month = date.getMonth() + 1;
                                return month + "/" + date.getDate() + "/" + date.getFullYear() + " " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
                            }
                        }
                        return "";
                    }
                }
            ],

            error: function (e) {
                if (e.status === 403) {
                    alert('Access Denied: You do not have permission to access this resource.');
                } else {
                    console.error('An error occurred:', e.statusText);
                }
            }
        });

        $('#kt_datatable_feild_query').on('change', function () {
            debugger;
            datatable.search($(this).val().toLowerCase(), 'requestAction');
        });
    };

    return {
        init: function () {
            LoadPricingPlanGrid();
        },
    };
}();

function convertDateFormat(dateString) {
    var parts = dateString.split('/');
    var formattedDate = parts[1] + '/' + parts[0] + '/' + parts[2];
    return formattedDate;
}


function DownloadExcelReport() {
    debugger;

    const table = document.getElementById("dynamicGrid");
    const wsData = [['Select', 'Field Name', 'Mandatory', 'Type Check', 'Sequence Number']];

    // Loop through rows and cells to extract data
    const rows = table.getElementsByTagName("tbody")[0].getElementsByTagName("tr");
    for (let i = 0; i < rows.length; i++) {
        const row = rows[i];
        const rowData = [];

        // Loop through cells in the current row
        const cells = row.getElementsByTagName("td");
        const firstCell = cells[0].querySelector('input[type="checkbox"]').checked;
        for (let j = 0; j < cells.length; j++) {
            const cell = cells[j];

            if (firstCell) {
                // Handle different types of cells (text, checkbox, dropdown)
                if (cell.querySelector('input[type="text"]')) {
                    rowData.push(cell.querySelector('input[type="text"]').value);
                } else if (cell.querySelector('input[type="checkbox"]')) {
                    rowData.push(cell.querySelector('input[type="checkbox"]').checked ? 'Yes' : 'No');
                } else if (cell.querySelector('select')) {
                    rowData.push(cell.querySelector('select').value);
                } else {
                    rowData.push(cell.textContent.trim());
                }
            }
        }
        if (firstCell) {
            wsData.push(rowData);
        }
    }

    // Sort wsData by the ascending values in the 5th column
    wsData.sort((a, b) => a[4] - b[4]);

    // Generate HTML for Excel
    let excelHtml = "<table border='2px'><tHead><tr><th>Select</th><th>Field Name</th><th>Mandatory</th><th>Type Check</th><th>Sequence Number</th></tr></tHead>";
    for (let index = 1; index < wsData.length; index++) {
        excelHtml += '<tr>';
        excelHtml += '<td>' + wsData[index][0] + '</td>';
        excelHtml += '<td>' + wsData[index][1] + '</td>';
        excelHtml += '<td>' + wsData[index][2] + '</td>';
        excelHtml += '<td>' + wsData[index][3] + '</td>';
        excelHtml += '<td>' + wsData[index][4] + '</td>';
        excelHtml += '</tr>';
    }
    excelHtml = excelHtml + "</table>";

    // Download Excel file
    const ua = window.navigator.userAgent;
    const msie = ua.indexOf("MSIE ");
    let sa;

    if (msie > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./)) {
        // If Internet Explorer
        const txtArea1 = window.open('about:blank', 'excel', '');
        txtArea1.document.open("txt/html", "replace");
        txtArea1.document.write(excelHtml);
        txtArea1.document.close();
        txtArea1.focus();
        sa = txtArea1.document.execCommand("SaveAs", true, "ExcelReport.xls");
    } else {
        // For other browsers
        sa = window.open('data:application/vnd.ms-excel,' + encodeURIComponent(excelHtml));
    }

    return sa;
}