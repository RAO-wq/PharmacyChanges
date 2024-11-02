$(document).ready(function () {
    debugger
    
    getAllFailedRequests();
    
    document.getElementById("generalSearchForCM").addEventListener("click", () => {
        generalSearchForCM();
    });
});


var CallURL = BaseUrl + "/api/ContractManagement";

var GetFailedReq = BaseUrl + "/api/ContractManagement/getfailedrequests";

var LoadPricingPlanGrid;
var LoadAllUploadedFiles;
var LoadAllProcessContract;
var ktList = [];
var userID = "";
var CRN = "";
var ARN = "";
var SearchDateStart = null;
var SearchDateEnd = null;
var SearchContractNumber = null;
var SearchContractPurpose = null;
var SearchAssetNumber = null;
var SearchStatusId = null;
var isGridInitialized = false;

function generalSearchForCM() {
    debugger
   
    SearchContractNumber = document.getElementById("searchContractNumber").value;
    SearchContractPurpose = document.getElementById("searchContract").value;

    SearchStatusId = document.getElementById("searchStatusId").value === "Please select" ? null : document.getElementById("searchStatusId").value;

    $('#kt_getfailedrequestsdatatable').KTDatatable().destroy();

    
    getAllFailedRequests();
    
    $('#filterModal').modal('hide');
}
function ExportFailedCmFileDataById() {
    $("#divLoader").show();
    debugger
    // Initialize an empty array to store the selected fileDataIds
    // Initialize an empty array to store the selected fileDataIds
    var selectedFileDataIds = [];

    // Use jQuery to select all checkboxes with the class 'select-row'
    var selectedCheckboxes = $('#kt_getfailedrequestsdatatable .select-row');

    // Loop through all checkboxes and check if they are checked
    selectedCheckboxes.each(function () {
        if ($(this).is(':checked')) {
            var fileDataId = $(this).val(); // The value attribute contains the fileDataId
            selectedFileDataIds.push(fileDataId); // Add the fileDataId to the list
        }
    });

    if (selectedFileDataIds.length === 0) {
        $("#divLoader").hide();

        Swal.fire({
            text: "Please select one or more File Data before proceeding.",
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
    else {
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        // myHeaders.append("Authorization", "Bearer " + getTokenFromSessionStorage());
        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: JSON.stringify(selectedFileDataIds) // Send the JSON data as a plain string
        };

        commonFetch(CallURL + "/getfilerowsdatabyids", requestOptions, function (result) {
            if (result != null && result != undefined) {
                if (result.success) {
                    //window.location = BaseUrl + '/api/ContractManagement/ContractRegistration/' + result.data + '/downloadfile'; //'/api/ContractManagement/' + result.dynamicData + '/downloadInvalidFiles';
                    var downloadURL  = BaseUrl + '/api/ContractManagement/ContractRegistration/' + result.data + '/downloadfile'; //'/api/ContractManagement/' + result.dynamicData + '/downloadInvalidFiles';
                    downloadFile(result.data, downloadURL)

                }
                else {
                    Swal.fire({
                        text: result.message,
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
                showSweetAlert('error', "Invalid Response", "");
            }
        });

        //fetch(CallURL + "/getfilerowsdatabyids", requestOptions)
        //    .then(response => response.json())
        //    .then(result => {
        //        $("#divLoader").hide();
        //        debugger
        //        if (result.success) {
        //            window.location = BaseUrl + '/api/ContractManagement/ContractRegistration/' + result.data + '/downloadfile'; //'/api/ContractManagement/' + result.dynamicData + '/downloadInvalidFiles';
        //        }
        //        else {
        //            Swal.fire({
        //                text: result.message,
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

}
function getAllFailedRequests() {
    // Uncheck all checkboxes   
    debugger;
    $('#select-all-checkbox').prop('checked', false);
    $('.select-row').prop('checked', false);

    LoadFailedRequestdatatable();
    LoadFailedRequests.init();
}


var LoadFailedRequests = function () {
    debugger
    // basic demo
    LoadFailedRequestdatatable = function () {

        activegroupdatatable = $('#kt_getfailedrequestsdatatable').KTDatatable({
            //DirectDebitdatatable = $('#MESTRFiles_datatable').KTDatatable({
            // datasource definition
            rows: {
                autoHide: false
            },
            data: {
                type: 'remote',
                async: true,
                source: {
                    read: {
                        url: GetFailedReq,
                        method: 'POST',
                        headers: {
                            "AccessToken": getTokenFromSessionStorage()
                        },
                        params: {
                            ServerGridCall: true,
                            UserId: sessionStorage.getItem("userId"),
                            CompanyId: parseInt(sessionStorage.getItem("companyId")),
                            SearchStatusId: SearchStatusId,
                            SearchContractNumber: SearchContractNumber,
                            SearchContractPurpose: SearchContractPurpose
                        },
                        map: function (raw) {
                            MainDataSource = raw.data;
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

            // column sorting
            sortable: true,
            pagination: true,
            search: {
                input: $('#DirectDebit_datatable_search_query'),
                key: 'generalSearch'
            },


            // columns definition
            columns: [
                {
                    field: 'fileDataId',
                    title: '<label class="checkbox checkbox-single checkbox-solid checkbox-primary">' +
                        '<input type="checkbox" id="select-all-checkbox">' +
                        '<span id="selectallgap" style = "margin-right: 8px"></span>' +
                        'All</label>',
                    sortable: false,
                    // width: 35,
                    textAlign: 'center',
                    template: function (row) {
                        return '<label class="checkbox checkbox-single checkbox-solid checkbox-primary"><input type="checkbox" class="select-row" value="' + row.fileDataId + '"><span></span></label>';
                    },
                },
                {
                    field: 'contractPurpose',
                    title: 'Contract Purpose',
                    sortable: false,
                },
                {
                    field: 'productType',
                    title: 'Product Type',
                    sortable: false,
                },
                {
                    field: 'assetType',
                    title: 'Asset Type',
                    sortable: false,
                },
                {
                    field: 'contractNumber',
                    title: 'Contract NO',
                    sortable: false,
                },
                {
                    field: 'assetNumber',
                    title: 'Asset NO',
                    sortable: false,
                },
                {
                    field: 'totalErrorsCount',
                    title: 'Errors Count',
                    sortable: false,
                },
                //{
                //    field: 'processedStatusId',
                //    title: 'Status',
                //    sortable: false,
                //    template: function (row) {
                //        // Determine the class and title based on totalErrorsCount
                //        var statusClass = row.totalErrorsCount > 0 ? ' label-light-danger' : 'label-light-success';
                //        var statusTitle = row.totalErrorsCount > 0 ? 'Failed' : 'Processed';

                //        return '<span class="label font-weight-bold label-lg ' + statusClass + ' label-inline mr-5 py-5 px-5" style="cursor: pointer;">' + statusTitle + '</span>';

                //       // return '<span class="label font-weight-bold label-lg ' + status[row.processedStatusId].class + ' label-inline mr-5 py-5 px-5" style="cursor: pointer;">' + status[row.processedStatusId].title + '</span>';
                //    }
                //},
                {
                    field: 'processedStatusId',
                    title: 'Status',
                    sortable: false,
                    template: function (row) {
                        var status = {
                            'N': { 'title': 'New', 'class': ' label-warning' },
                            'P': { 'title': 'Passed', 'class': 'label-success' },
                            'F': { 'title': 'Failed', 'class': ' label-danger' },
                            'D': { 'title': 'Deleted', 'class': ' label-light-warning' },
                            'C': { 'title': 'Processed', 'class': 'label-success' },
                        };
                        return '<span class="label font-weight-bold label-lg ' + status[row.processedStatusId].class + ' label-inline mr-5 py-5 px-5" style="cursor: pointer;">' + status[row.processedStatusId].title + '</span>';
                    }
                },
                {
                    field: 'Actions',
                    title: 'Actions',
                    sortable: false,
                    width: 70,
                    overflow: 'visible',
                    autoHide: false,
                    template: function (row) {

                        return '\
	                        <div class="dropdown dropdown-inline">\
	                            <a href="javascript:;" class="btn btn-sm btn-secondary btn-icon mr-2" data-toggle="dropdown">\
	                                <span class="svg-icon svg-icon-md">\
										<i class="ki ki-bold-more-ver"></i>\
	                                </span>\
	                            </a>\
	                            <div class="dropdown-menu dropdown-menu-sm dropdown-menu-right">\
	                                <ul class="navi flex-column navi-hover py-2">\
	                                    <li class="navi-item">\
	                                        <a onclick = doRedirection("'+ row.fileDataId + '","' + row.fileId + '","View") class="navi-link" >\
	                                            <span class="navi-text">View Details</span>\
	                                        </a>\
	                                    </li>\
                                    </ul>\
	                            </div>\
	                        </div>\
	                    ';
                    },
                }
            ]
        });
        // Add event listener for "Select All" checkbox after the DataTable is fully initialized
        activegroupdatatable.on('datatable-on-layout-updated', function () {
            $('#select-all-checkbox', activegroupdatatable).on('change', function () {
                var isChecked = $(this).prop('checked');
                $('.select-row', activegroupdatatable).prop('checked', isChecked);
            });
        });
    };
    return {
        // public functions
        init: function () {
            LoadFailedRequestdatatable();
            ktList.push("#kt_getfailedrequestsdatatable");

        },
    };
}();



function doRedirection(val, vall, mode) {

    switch (mode) {

        case "View":
            document.forms['ContractDetailsForLSR']['FileDataId'].value = val;
            document.forms['ContractDetailsForLSR']['FileId'].value = vall;
            PostRedirect("ContractDetailsForLSR", val);
            break;

        case "Edit":
            document.forms['ContractDetailsForLSR']['FileDataId'].value = val;
            document.forms['ContractDetailsForLSR']['FileId'].value = vall;
            PostRedirect("ContractDetailsForLSR", val);
            break;
    }
}

