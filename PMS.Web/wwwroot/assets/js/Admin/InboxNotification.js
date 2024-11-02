var URL = BaseUrl + "/api/ContractManagement/getMESTRFiles";
var ProcessContractURL = BaseUrl + "/api/ContractManagement/getallprocessedcontracts";
var CallURL = BaseUrl + "/api/ContractManagement";
NewURL = BaseUrl + "/api/ContractManagement" + "/" + "getsupportingdocument";
var GetFailedReq = BaseUrl + "/api/ContractManagement/getfailedrequests";
var CompanyUrl = BaseUrl + "/api/admin";
var ticketUrl = BaseUrl + "/api/HelpDesk"

var LoadPricingPlanGrid;
var LoadAllProcessContract;
var LoadAllRequestAssets;
var LoadAllTickets;
var KTDatatableAutoColumnHideDemoss;
var ktList = [];
var userID = "";
var CRN = "";
var ARN = "";
var SearchDateStart = null;
var SearchDateEnd = null;
var SearchAssetNumber = null;
var SearchStatusId = null;
var isGridInitialized = false;
var ticketStatus;
var langId;
 
$(document).ready(function () {

    sessionStorage.removeItem("InboxInfo");
    getInboxCounts();

    langId = localStorage.getItem('languageId');
    //document.getElementById('count').innerText = sessionStorage.getItem('TotalCounts');

    userID = sessionStorage.getItem("userId");

    var CompanyCount = sessionStorage.getItem("RepoComapnyCounts");
    var MakeCount = sessionStorage.getItem("AssetCounts");
    var TicketCount = sessionStorage.getItem("TicketCounts");

    var companyCount = document.getElementById('CompanyCount');
    var makeCount = document.getElementById('MakeCount');
    var tixCount = document.getElementById('ticketCount');

    companyCount.innerHTML = '0';
    companyCount.innerText = CompanyCount;
    
    makeCount.innerHTML = '0';
    makeCount.innerText = MakeCount;

    tixCount.innerHTML = '0';
    tixCount.innerText = TicketCount;

    $("#SearchDateStart").datepicker({
        autoclose: true,
    }).on('changeDate', function (selected) {
        var SearchDateStart = new Date(selected.date.valueOf());
        $('#SearchDateEnd').datepicker('setStartDate', SearchDateStart);
    });
    $("#SearchDateEnd").datepicker({
        autoclose: true,
    }).on('changeDate', function (selected) {
        var SearchDateEnd = new Date(selected.date.valueOf());
        $('#SearchDateStart').datepicker('setEndDate', SearchDateEnd);
    });
    document.getElementById("resetSearch").addEventListener("click", () => {
        resetGeneralSearch();
    });
    
    getallcompanyreq();

    document.getElementById("generalSearchForCM").addEventListener("click", () => {
        generalSearchForCM();
    });

    var options = [
        { value: '', text_en: 'Please select', text_ar: 'يرجى التحديد' },
        { value: '465', text_en: 'Pending', text_ar: 'قيد الانتظار' },
        { value: '466', text_en: 'Approved', text_ar: 'موافقة' },
        { value: '467', text_en: 'Rejected', text_ar: 'مرفوض' }
    ];

    var dropdown = document.createElement('select');
    dropdown.className = 'form-control';
    dropdown.id = 'searchStatusId';
    options.forEach(function (option) {
        var opt = document.createElement('option');
        opt.value = option.value;
        opt.text = langId == 0 ? option.text_en : option.text_ar;
        dropdown.appendChild(opt);
    });

    var container = document.getElementById('dropdownContainer');
    container.appendChild(dropdown);
    localized();
});

function resetGeneralSearch() {

    SearchDateStart = null;
    SearchDateEnd = null;
    SearchStatusId = null;

    document.getElementById("searchStatusId").value = "Please select";
    document.getElementById("SearchDateStart").value = "";
    document.getElementById("SearchDateEnd").value = "";
}

function generalSearchForCM() {
    debugger

    SearchStatusId = document.getElementById("searchStatusId").value === "Please select" ? null : document.getElementById("searchStatusId").value;

    // Get the date values
    var rawSearchDateStart = document.getElementById("SearchDateStart").value;
    var rawSearchDateEnd = document.getElementById("SearchDateEnd").value;

    // Convert the date values to a different format (e.g., "MM/DD/YYYY")
    SearchDateStart = (rawSearchDateStart != null && rawSearchDateStart != "") ? convertDateFormat(rawSearchDateStart) : rawSearchDateStart;
    SearchDateEnd = (rawSearchDateEnd != null && rawSearchDateEnd != "") ? convertDateFormat(rawSearchDateEnd) : rawSearchDateEnd;
    
    if ($('#kt_tab_pane_2').hasClass('active')) {
        $('#RuleDetails_datatable').KTDatatable().destroy();

        getallcompanyreq();
    }
    else if ($('#kt_tab_pane_3').hasClass('active')) {
        $('#RequestAssets_datatable').KTDatatable().destroy();

        getAllRequestAssets();
    }
    else if ($('#kt_tab_pane_4').hasClass('active')) {
        $('#TicketStatus_datatable').KTDatatable().destroy();

        getAllTicketsData();
    }

    $('#filterModal').modal('hide');
}

function convertDateFormat(dateString) {
    // Assuming the input format is "DD/MM/YYYY"
    var parts = dateString.split('/');
    var formattedDate = parts[1] + '/' + parts[0] + '/' + parts[2];
    return formattedDate;
}

function browserFile() {
    $('#uploadFilesDialog').modal({
        backdrop: 'static'
    });
}

function uploadExcel() {
    debugger;
    //var selectedOption = $("input[name='fileType']:checked").val();
    var selectedOption = $("#fileTypeId").val();
    var selectedCompanyOption = $("#associateCompanyTypeId").val();

    if (window.FormData !== undefined && selectedOption && selectedCompanyOption) {

        var fileUpload = $("#contractupload").get(0);
        var files = fileUpload.files;
        var supportingfileUpload = $("#supportingdocsupload").get(0);
        var supportingfiles = supportingfileUpload.files;
        if (files.length > 0) {

            // Create FormData object  
            var fileData = new FormData();

            // Looping over all files and add it to FormData object  
            for (var i = 0; i < files.length; i++) {
                fileData.append(files[i].name, files[i]);
            }
            fileData.append('UserId', sessionStorage.getItem("userId"))
            fileData.append('CompanyId', sessionStorage.getItem("companyId"))
            // fileData.append('TemplateTypeID', $("input[name='fileType']:checked").attr('value'))
            fileData.append('TemplateTypeID', $("#fileTypeId").val())
            fileData.append('AssociateCompanyId', $("#associateCompanyTypeId").val())
            fileData.append('TenantId', sessionStorage.getItem("TenantId") == null ? 0 : sessionStorage.getItem("TenantId"))
            $("#divLoader").show();
            $.ajax({
                url: BaseUrl + '/api/ContractManagement/uploadContract',
                type: "POST",
                contentType: false, // Not to set any content header  
                processData: false, // Not to process data  
                data: fileData,
                success: function (result) {
                    //alert(result);
                    if (result.success) {
                        $("#divLoader").hide();
                        //$("#divLoader").hide();
                        //Swal.fire({
                        //    text: "Payer uploaded scuccessfully",
                        //    //icon: "error",
                        //    buttonsStyling: false,
                        //    confirmButtonText: "Ok, got it!",
                        //    customClass: {
                        //        confirmButton: "btn font-weight-bold btn-light"
                        //    }
                        //}).then(function () {

                        //});
                        //GetAllFilesToProcesss();
                        $("th#totalrows").empty().append(result.dynamicData.totalRows);
                        $("th#procrows").empty().append(result.dynamicData.processedRows);
                        $("th#failedrows").empty().append(result.dynamicData.failedRows);
                        $("#UploadSuccessModal").modal('show');
                        //$('#MESTRFiles_datatable').KTDatatable.load();
                        //$('#MESTRFiles_datatable').KTDatatatable('reload');
                        //DirectDebitdatatable.reload();
                        
                    }
                    else {
                        $("#divLoader").hide();
                        Swal.fire({
                            text: result.message,
                            icon: "error",
                            buttonsStyling: false,
                            confirmButtonText: "Ok, got it!",
                            customClass: {
                                confirmButton: "btn font-weight-bold btn-light"
                            }
                        }).then(function () {

                        });
                        if (result.dynamicData != undefined) {
                            //window.location = BaseUrl + '/api/ContractManagement/ContractRegistration/' + result.dynamicData + '/downloadfile';
                            var downloadUrl = BaseUrl + '/api/ContractManagement/ContractRegistration/' + result.dynamicData + '/downloadfile';
                            downloadFile(result.dynamicData, downloadUrl);
                        }
                    }
                },
                error: function (err) {
                    $("#divLoader").hide();
                    Swal.fire({
                        text: "Failed:" + err,
                        icon: "error",
                        buttonsStyling: false,
                        confirmButtonText: "Ok, got it!",
                        customClass: {
                            confirmButton: "btn font-weight-bold btn-light"
                        }
                    }).then(function () {

                    });
                }
            });
        }

        if (supportingfiles.length > 0) {
            // Create FormData object  
            var fileData = new FormData();

            // Looping over all files and add it to FormData object  
            for (var i = 0; i < supportingfiles.length; i++) {
                fileData.append(supportingfiles[i].name, supportingfiles[i]);
            }

            // Add additional variables to the FormData object
            fileData.append("CreatedBy", userID);
            fileData.append("CompanyId", 1);
            fileData.append("TenantId", 1);

            $("#divLoader").show();
            $.ajax({
                url: BaseUrl + '/api/ContractManagement/uploadSupportingDocuments',
                type: "POST",
                contentType: false, // Not to set any content header  
                processData: false, // Not to process data  
                data: fileData,
                success: function (result) {
                    //alert(result);
                    if (result.success) {
                        $("#divLoader").hide();
                        $('#SupportingocsUploadSuccessModal').modal('show');
                    }
                    else {
                        $("#divLoader").hide();
                        Swal.fire({
                            text: result.message,
                            icon: "error",
                            buttonsStyling: false,
                            confirmButtonText: "Ok, got it!",
                            customClass: {
                                confirmButton: "btn font-weight-bold btn-light"
                            }
                        }).then(function () {

                        });
                        if (result.dynamicData != undefined) {
                            //window.location = BaseUrl + '/api/ContractManagement/ContractRegistration/' + result.dynamicData + '/downloadfile'; //'/api/ContractManagement/' + result.dynamicData + '/downloadInvalidFiles';
                            var downloadUrl = BaseUrl + '/api/ContractManagement/ContractRegistration/' + result.dynamicData + '/downloadfile';
                            downloadFile(result.dynamicData, downloadUrl);
                        }
                    }
                },
                error: function (err) {
                    $("#divLoader").hide();
                    Swal.fire({
                        text: "Failed:" + err,
                        icon: "error",
                        buttonsStyling: false,
                        confirmButtonText: "Ok, got it!",
                        customClass: {
                            confirmButton: "btn font-weight-bold btn-light"
                        }
                    }).then(function () {

                    });
                }
            });

        }

    }
    else {
        if (!selectedOption) {
            Swal.fire({
                text: "Error: Please Select File Type",
                icon: "error",
                buttonsStyling: false,
                confirmButtonText: "Ok, got it!",
                customClass: {
                    confirmButton: "btn font-weight-bold btn-light"
                }
            })
        }
        else {
            Swal.fire({
                text: "Error: Please Select File",
                icon: "error",
                buttonsStyling: false,
                confirmButtonText: "Ok, got it!",
                customClass: {
                    confirmButton: "btn font-weight-bold btn-light"
                }
            })
        }
    }
}

function UploadSupportingDocuments() {
    debugger;
    // Checking whether FormData is available in browser  
    if (window.FormData !== undefined) {

        var supportingfileUpload = $("#supportingdocumentsupload").get(0);
        var supportingfiles = supportingfileUpload.files;

        if (supportingfiles.length > 0) {
            // Create FormData object  
            var fileData = new FormData();

            // Looping over all files and add it to FormData object  
            for (var i = 0; i < supportingfiles.length; i++) {
                fileData.append(supportingfiles[i].name, supportingfiles[i]);
            }
            var userId = sessionStorage.getItem('userId');

            var ContractId = document.getElementById("contId").value;
            // Add additional variables to the FormData object
            fileData.append("CreatedBy", userId);
            fileData.append("CompanyId", 1);
            fileData.append("TenantId", 1);
            fileData.append("ContractId", ContractId);

            $("#divLoader").show();
            $.ajax({
                url: BaseUrl + '/api/ContractManagement/uploadSupportingDocuments',
                type: "POST",
                contentType: false, // Not to set any content header  
                processData: false, // Not to process data  
                data: fileData,
                success: function (result) {
                    //alert(result);
                    if (result.success) {
                        $("#divLoader").hide();
                        $('#SupportingocsUploadSuccessModal').modal('show');
                    }
                    else {
                        $("#divLoader").hide();
                        Swal.fire({
                            text: result.message,
                            icon: "error",
                            buttonsStyling: false,
                            confirmButtonText: "Ok, got it!",
                            customClass: {
                                confirmButton: "btn font-weight-bold btn-light"
                            }
                        }).then(function () {

                        });
                        if (result.dynamicData != undefined) {
                            //window.location = BaseUrl + '/api/ContractManagement/ContractRegistration/' + result.dynamicData + '/downloadfile'; //'/api/ContractManagement/' + result.dynamicData + '/downloadInvalidFiles';
                            var downloadUrl = BaseUrl + '/api/ContractManagement/ContractRegistration/' + result.dynamicData + '/downloadfile';
                            downloadFile(result.dynamicData, downloadUrl);
                        }
                    }
                },
                error: function (err) {
                    $("#divLoader").hide();
                    Swal.fire({
                        text: "Failed:" + err,
                        icon: "error",
                        buttonsStyling: false,
                        confirmButtonText: "Ok, got it!",
                        customClass: {
                            confirmButton: "btn font-weight-bold btn-light"
                        }
                    }).then(function () {

                    });
                }
            });

        }

    } else {
        alert("FormData is not supported.");
    }
}

function updateFileList() {
    const fileList = document.getElementById("contractupload").files;
    const ul = document.getElementById("fileList");
    ul.innerHTML = ""; // Clear the unordered list

    for (const file of fileList) {
        const li = document.createElement("li");
        const p = document.createElement("p");
        p.classList.add("text-primary");
        p.textContent = file.name;
        li.appendChild(p);
        ul.appendChild(li);
    }
}

function updateSupportingDocsList() {
    const fileList = document.getElementById("supportingdocsupload").files;
    const ul = document.getElementById("supportingdoscList");
    ul.innerHTML = ""; // Clear the unordered list

    for (const file of fileList) {
        const li = document.createElement("li");
        const p = document.createElement("p");
        p.classList.add("text-primary");
        p.textContent = file.name;
        li.appendChild(p);
        ul.appendChild(li);
    }
}

function updateSupportingDocumentsList() {
    const fileList = document.getElementById("supportingdocumentsupload").files;
    const ul = document.getElementById("supportingdocumentsList");
    ul.innerHTML = ""; // Clear the unordered list

    for (const file of fileList) {
        const li = document.createElement("li");
        const p = document.createElement("p");
        p.classList.add("text-primary");
        p.textContent = file.name;
        li.appendChild(p);
        ul.appendChild(li);
    }
}

function updateSupportingDocumentsForContractList() {
    const fileList = document.getElementById("supportingdocumentsOfContractupload").files;
    const ul = document.getElementById("supportingdocumentsOfContractList");
    ul.innerHTML = ""; // Clear the unordered list

    for (const file of fileList) {
        const li = document.createElement("li");
        const p = document.createElement("p");
        p.classList.add("text-primary");
        p.textContent = file.name;
        li.appendChild(p);
        ul.appendChild(li);

    }
}

function getAllRequestAssets() {
    debugger;

    $('#select-all-checkbox').prop('checked', false);
    $('.select-row').prop('checked', false);

    getAllRequestGrid();
    LoadAllRequestAssets.init();
}



LoadAllProcessContract = function (status) {
    getAllProcessedContractsGrid = function () {
        datatable = $('#ProcessContracts_datatable').KTDatatable({
            // datasource definition
            rows: {
                autoHide: false
            },
            data: {
                type: 'remote',
                async: true,
                source: {
                    read: {
                        url: CallURL + "/getallcontractstatus",
                        method: 'POST',
                        params: {
                            ServerGridCall: true,
                            UserId: sessionStorage.getItem("userId"),
                            Crn: CRN,
                            Arn: ARN,
                            SearchDateStart: SearchDateStart,
                            SearchDateEnd: SearchDateEnd,
                            SearchAssetNumber: SearchAssetNumber,
                            SearchStatusId: SearchStatusId,
                            CompanyTypeId: sessionStorage.getItem("companyTypeId"),
                            CompanyId: sessionStorage.getItem("companyId")
                        },
                        headers: {
                            'AccessToken': getTokenFromSessionStorage()
                        },
                        map: function (raw) {
                            debugger;
                            var dataSet = raw.data;
                            if (typeof raw.data !== 'undefined') {
                                dataSet = raw.data;
                            }
                            return dataSet;
                        }
                    },
                },
                saveState: false,
                pageSize: 10,
                serverPaging: true,
                serverFiltering: false,
                serverSorting: false,
            },
            layout: {
                scroll: true
            },
            // column sorting
            sortable: true,
            pagination: true,
            //search: {
            //    input: $('#Group_search_query'),
            //    key: 'generalSearch'
            //},

            // columns definition
            columns: [
                //{
                //    field: 'contractId',
                //    sortable: false,
                //    // width: 35,
                //    textAlign: 'center',
                //    template: function (row) {
                //        // Show the checkbox only if the statusId is 'REJ'
                //        if (row.contractStatus === 'REJ') {
                //            return '<label class="checkbox checkbox-single checkbox-solid checkbox-primary"><input type="checkbox" class="select-row" value="' + row.fileDataId + '"><span></span></label>';
                //        } else {
                //            // Return an empty string if the statusId is not 'REJ'
                //            return '';
                //        }
                //    },
                //},
                {
                    field: 'crn',
                    title: 'CRN',
                    sortable: false,
                },

                {
                    field: 'arn',
                    title: 'ARN',
                    sortable: false,
                },
                {
                    field: 'assetId',
                    title: 'ASSET NO',
                    sortable: false,
                    width: 100,
                },
                {
                    field: 'modifiedBy',
                    title: 'Modified By',
                },
                {
                    field: 'modifiedDate',
                    title: 'Modified Date',
                    type: 'date',
                    template: function (row) {
                        debugger
                        if (row.modifiedDate) {
                            var dateParts = row.modifiedDate.split(" ");
                            if (dateParts.length > 0) {
                                var date = new Date(dateParts[0]);
                                var month = date.getMonth() + 1;
                                return month + "/" + date.getDate() + "/" + date.getFullYear();
                            }
                        }
                        return "";
                    }
                },
                {
                    field: 'statusId',
                    title: 'Status',
                    sortable: false,
                    template: function (row) {
                        var statusEn = {
                            'PEN': { 'title': 'Pending', 'class': 'label-warning' },
                            'APR': { 'title': 'Accepted', 'class': 'label-success' },
                            'REJ': { 'title': 'Rejected', 'class': 'label-danger' }
                        };
                        var statusAr = {
                            'PEN': { 'title': 'قيد الانتظار', 'class': 'label-warning' },
                            'APR': { 'title': 'قبلت', 'class': 'label-success' },
                            'REJ': { 'title': 'مرفوض', 'class': 'label-danger' }
                        };
                        return '<span class="label font-weight-bold label-lg ' + langId == 0 ? statusEn[row.contractStatus].class : statusAr[row.contractStatus].class + ' label-inline mr-5 py-5 px-5" style="cursor: pointer;">' + langId == 0 ? statusEn[row.contractStatus].title : statusAr[row.contractStatus].title + '</span>';
                    }
                },
                {
                    field: 'Actions',
                    title: 'Actions',
                    sortable: false,
                    width: 110,
                    overflow: 'visible',
                    autoHide: false,
                    template: function (row) {
                        var actionsHtml = '\
            <div class="dropdown dropdown-inline">\
                <a href="javascript:;" class="btn btn-sm btn-secondary btn-icon mr-2" data-toggle="dropdown">\
                    <span class="svg-icon svg-icon-md">\
                        <i class="ki ki-bold-more-ver"></i>\
                    </span>\
                </a>\
                <div class="dropdown-menu dropdown-menu-sm dropdown-menu-right">\
                    <ul class="navi flex-column navi-hover py-2">\
                        <li class="navi-item">\
                            <a onclick="viewContractDetails(' + row.contractId + ',' + row.customerId + ',' + row.assetId + ',' + row.contractAssetId + ',' + row.statusId + ',' + "'" + row.contractStatus + "'" + ',' + "'" + row.fileId + "'" + ',' + "'" + row.fileDataId + "'" + ')" class="navi-link">\
                                <span class="navi-text" >'+ getGridTitle("view_details") +'</span>\
                            </a>\
                        </li>\
                        <li class="navi-item">\
                            <a  onclick=doRedirection("'+ row.contractNumber + '","ViewDocument") class="navi-link">\
                                <span class="navi-text">View Document</span>\
                            </a>\
                        </li>\
                        '

                            ;

                       
                        if (row.ContractStatus != 'PEN') { // Assuming 1 represents "Pending"
                            actionsHtml += '\
                        <li class="navi-item">\
	                        <a onclick = doRedirectionToCertificate("'+ row.contractId + '","' + row.customerId + '","' + row.assetId + '","' + row.contractAssetId + '","' + row.statusId + '","Certificate") class="navi-link" >\
	                                            <span class="navi-text">View Certificate</span>\
	                        </a>\
                        </li>';

                        }


                        actionsHtml += '</ul>\
                </div>\
            </div>';

                        return actionsHtml;
                    },
                }]
        });
    }
    return {
        // public functions
        init: function () {
            getAllProcessedContractsGrid();
            ktList.push("#ProcessContracts_datatable");

        },
    };
}();

LoadAllRequestAssets = function (status) {
    var statusEn = {
        'PEN': { 'title': 'Pending', 'class': 'label-warning' },
        'APR': { 'title': 'Accepted', 'class': 'label-success' },
        'REJ': { 'title': 'Rejected', 'class': 'label-danger' }
    };
    var statusAr = {
        'PEN': { 'title': 'قيد الانتظار', 'class': 'label-warning' },
        'APR': { 'title': 'قبلت', 'class': 'label-success' },
        'REJ': { 'title': 'مرفوض', 'class': 'label-danger' }
    };
    getAllRequestGrid = function () {
        datatable = $('#RequestAssets_datatable').KTDatatable({
            // datasource definition
            rows: {
                autoHide: false
            },
            data: {
                type: 'remote',
                async: true,
                source: {
                    read: {
                        url: CallURL + "/GetAllRequestAssets",
                        headers: {
                            "AccessToken": getTokenFromSessionStorage()
                        },
                        method: 'POST',
                        params: {
                            ServerGridCall: true,
                            UserId: sessionStorage.getItem("userId"),
                            CompanyId: sessionStorage.getItem("companyId"),
                            CompanyTypeId: sessionStorage.getItem("companyTypeId"),
                            SearchDateStart: SearchDateStart,
                            SearchDateEnd: SearchDateEnd,
                            SearchAssetNumber: SearchAssetNumber,
                            SearchStatusId: SearchStatusId,
                            IsInbox: true,
                        },
                        map: function (raw) {
                            debugger;
                            var dataSet = raw.data;
                            if (raw.success && dataSet != null) {
                                var count = dataSet.filter(x => x.status == 'PEN').length;

                                //updateBellCount("ASSET", count);

                                if (typeof raw.data !== 'undefined') {
                                    dataSet = raw.data;
                                }
                            }
                            return dataSet;
                        }
                    },
                },
                saveState: false,
                pageSize: 10,
                serverPaging: true,
                serverFiltering: false,
                serverSorting: false,
            },
            layout: {
                scroll: true
            },
            // column sorting
            sortable: true,
            pagination: true,
            //search: {
            //    input: $('#Group_search_query'),
            //    key: 'generalSearch'
            //},

            // columns definition
            columns: [
                //{
                //    field: 'contractId',
                //    sortable: false,
                //    // width: 35,
                //    textAlign: 'center',
                //    template: function (row) {
                //        // Show the checkbox only if the statusId is 'REJ'
                //        if (row.contractStatus === 'REJ') {
                //            return '<label class="checkbox checkbox-single checkbox-solid checkbox-primary"><input type="checkbox" class="select-row" value="' + row.fileDataId + '"><span></span></label>';
                //        } else {
                //            // Return an empty string if the statusId is not 'REJ'
                //            return '';
                //        }
                //    },
                //},
                

                {
                    field: langId == 0 ? 'makeName' : 'makeNameAr',
                    title: getGridTitle("Make_Name"),
                    sortable: false,
                },
                {
                    field: langId == 0 ? 'modelName' : 'modelNameAr',
                    title: getGridTitle("Model_Name"),
                    sortable: false,
                    width: 100,
                },
                {
                    field: 'modifiedBy',
                    title: getGridTitle("MODIFIED_BY"),
                },
                {
                    field: 'modifiedDate',
                    title: getGridTitle("MODOFIED_DATE"),
                    type: 'date',
                    template: function (row) {
                        debugger
                        if (row.modifiedDate) {
                            var dateParts = row.modifiedDate.split(" ");
                            if (dateParts.length > 0) {
                                var date = new Date(dateParts[0]);
                                var month = date.getMonth() + 1;
                                return month + "/" + date.getDate() + "/" + date.getFullYear();
                            }
                        }
                        return "";
                    }
                },
                {
                    field: langId == 0 ? 'statusEn' : 'statusAr',
                    sortable: false,
                    title: getGridTitle("Status"),
                    template: function (row) {
                        var status = langId == 0 ? statusEn : statusAr
                        return '<span class="label font-weight-bold label-lg ' + status[row.status].class + ' label-inline mr-5 py-5 px-5" style="cursor: pointer;">' + status[row.status].title + '</span>';
                    }
                },
                {
                    field: 'Actions',
                    title: getGridTitle("Action"),
                    sortable: false,
                    width: 110,
                    overflow: 'visible',
                    autoHide: false,
                    template: function (row) {
                        var actionsHtml = '\
            <div class="dropdown dropdown-inline">\
                <a href="javascript:;" class="btn btn-sm btn-secondary btn-icon mr-2" data-toggle="dropdown">\
                    <span class="svg-icon svg-icon-md">\
                        <i class="ki ki-bold-more-ver"></i>\
                    </span>\
                </a>\
                <div class="dropdown-menu dropdown-menu-sm dropdown-menu-right">\
                    <ul class="navi flex-column navi-hover py-2">\
                        <li class="navi-item">\
                            <a onclick = doRedirectionRequestAsset("'+ row.requestAssetId + '","View") class="navi-link" >\
                                <span class="navi-text">'+ getGridTitle("view_details") +'</span>\
                            </a>\
                        </li>\
                        ';


                        //// Check the statusId and conditionally add the "Add Supporting Docs" option
                        //if (row.ContractStatus === 'PEN') { // Assuming 1 represents "Pending"
                        //    actionsHtml += '\
                        //<li class="navi-item">\
                        //    <a  onclick="browserSupportingFileForContract(' + row.contractId + ')" class="navi-link">\
                        //        <span class="navi-text">Add Supporting Docs</span>\
                        //    </a>\
                        //</li>';


                        //}
                        //if (row.ContractStatus != 'PEN') { // Assuming 1 represents "Pending"
                        //    actionsHtml += '\
                        //<li class="navi-item">\
	                       // <a onclick = doRedirectionToCertificate("'+ row.contractId + '","' + row.customerId + '","' + row.assetId + '","' + row.contractAssetId + '","' + row.statusId + '","Certificate") class="navi-link" >\
	                       //                     <span class="navi-text">View Certificate</span>\
	                       // </a>\
                        //</li>';

                        //}


                        actionsHtml += '</ul>\
                </div>\
            </div>';

                        return actionsHtml;
                    },
                }]
        });
    }
    return {
        // public functions
        init: function () {
            getAllRequestGrid();
            ktList.push("#RequestAssets_datatable");

        },
    };
}();

LoadAllTickets = function (status) {
    var statusEn = {
        'Low': { 'title': 'Low', 'class': 'label-default' },
        'Medium': { 'title': 'Medium', 'class': 'label-warning' },
        'High': { 'title': 'High', 'class': 'label-danger' },
    };
    var statusAr = {
        'Low': { 'title': 'قليل', 'class': 'label-default' },
        'Medium': { 'title': 'واسطة', 'class': 'label-warning' },
        'High': { 'title': 'عالي', 'class': 'label-danger' },
    };
    var ticketStatus = langId == 0 ? statusEn : statusAr;
    getAllTickets = function () {
        debugger
        datatable = $('#TicketStatus_datatable').KTDatatable({
            rows: {
                autoHide: false
            },
            data: {
                type: 'remote',
                async: true,
                source: {
                    read: {
                        url: ticketUrl + "/GetNewTickets",
                        headers: {
                            "AccessToken": getTokenFromSessionStorage()
                        },
                        method: 'GET',
                        params: {
                            ServerGridCall: true,
                            UserId: sessionStorage.getItem("userId"),
                            CompanyId: sessionStorage.getItem("companyId"),
                            CompanyTypeId: sessionStorage.getItem("companyTypeId"),
                            TicketStatusCode: ticketStatus,
                            SearchDateStart: SearchDateStart,
                            SearchDateEnd: SearchDateEnd,
                        },
                        map: function (raw) {
                            debugger;
                            var dataSet = raw.data;

                            var compType = sessionStorage.getItem('companyType');
                            var role = sessionStorage.getItem('role');

                            var count = 0;
                            if (compType === 'Tawtheeq' && role === 'Super Admin') {
                                count = dataSet.filter(item => item.statusCode === 'NW').length;
                            }
                            else if (compType === 'Tawtheeq') {
                                count = dataSet.filter(item => item.statusCode === 'ASIG' && item.assignedToUserId === sessionStorage.getItem("userId")).length;
                            }
                            else {
                                count = dataSet.filter(item => item.statusCode !== 'CLS').length;
                            }

                            //updateBellCount("TICKET", count);

                            if (typeof raw.data !== 'undefined') {
                                dataSet = raw.data;
                            }
                            return dataSet;
                        }
                    },
                },
                saveState: false,
                pageSize: 10,
                serverPaging: false,
                serverFiltering: false,
                serverSorting: false,
            },
            layout: {
                scroll: true
            },
            sortable: true,
            pagination: true,
            columns: [
                {
                    field: 'title',
                    title: getGridTitle('Title'),
                    sortable: false,
                },
                {
                    field: 'submittedByUser',
                    title: getGridTitle('Submitted_By_User'),
                    sortable: false,
                    width: 100,
                },
                {
                    field: langId == 0 ? 'submittedByCompany' : 'submittedByCompanyAr',
                    title: getGridTitle('Submitted_By_Company'),
                },
                {
                    field: langId == 0 ? 'priority' : 'priorityAr',
                    title: getGridTitle('Priority'),
                    type: 'date',
                    sortable: false,

                    template: function (row) {
                        var status = langId == 0 ? statusEn : statusAr
                        return '<span class="label font-weight-bold label-lg ' + status[row.priority].class + ' label-inline mr-5 py-5 px-5" style="cursor: pointer;">' + status[row.priority].title + '</span>';
                    }
                },
                {
                    field: 'createdDate',
                    title: getGridTitle('Created_Date'),
                    type: 'date',
                    sortable: false,

                    template: function (row) {
                        var dateParts = row.createdDate.split(" ");
                        if (dateParts.length > 0) {
                            var date = new Date(dateParts[0]);
                            var month = date.getMonth() + 1;
                            return month + "/" + date.getDate() + "/" + date.getFullYear() + " " + date.getHours() + ":" + date.getMinutes();
                        }
                        return "";
                    }
                },
                {
                    field: 'status',
                    title: getGridTitle('Status'),
                    sortable: false,
                    template: function (row) {
                        debugger
                        var statusEn = {
                            'NW': { 'title': 'New', 'class': 'label-warning' },
                            'INP': { 'title': 'In Progress', 'class': 'label-warning' },
                            'CLS': { 'title': 'Close', 'class': 'label-success' },
                            'NF': { 'title': 'Not Fixed', 'class': 'label-warning' },
                            'CT': { 'title': 'Cannot Change', 'class': 'label-default' },
                            'PFR': { 'title': 'Pending First Review', 'class': 'label-warning' },
                            'PRA': { 'title': 'Pending Request Analysis', 'class': 'label-warning' },
                            'ASIG': { 'title': 'Assigned', 'class': 'label-primary' },
                            'REOP': { 'title': 'Reopened', 'class': 'label-warning' },
                        };
                        var statusAr = {
                            'NW': { 'title': 'جديد', 'class': 'label-warning' },
                            'INP': { 'title': 'في تَقَدم', 'class': 'label-warning' },
                            'CLS': { 'title': 'يغلق', 'class': 'label-success' },
                            'NF': { 'title': 'لم تحل', 'class': 'label-warning' },
                            'CT': { 'title': 'لا يمكن تغيير', 'class': 'label-default' },
                            'PFR': { 'title': 'في انتظار المراجعة الأولى', 'class': 'label-warning' },
                            'PRA': { 'title': 'تحليل الطلب المعلق', 'class': 'label-warning' },
                            'ASIG': { 'title': 'مُكَلَّف', 'class': 'label-primary' },
                            'REOP': { 'title': 'أعيد فتحه', 'class': 'label-warning' },
                        };
                        var status = langId == 0 ? statusEn : statusAr;
                        return '<span class="label font-weight-bold label-lg ' + status[row.statusCode].class + ' label-inline mr-5 py-5 px-5" style="cursor: pointer;">' + status[row.statusCode].title + '</span>';
                    }
                },
                {
                    field: 'Actions',
                    title: getGridTitle('Action'),
                    sortable: false,
                    width: 110,
                    overflow: 'visible',
                    autoHide: false,
                    template: function (row) {
                        var actionsHtml = '\
                    <div class="dropdown dropdown-inline">\
                        <a href="javascript:;" class="btn btn-sm btn-secondary btn-icon mr-2" data-toggle="dropdown">\
                            <span class="svg-icon svg-icon-md">\
                                <i class="ki ki-bold-more-ver"></i>\
                            </span>\
                        </a>\
                        <div class="dropdown-menu dropdown-menu-sm dropdown-menu-right">\
                            <ul class="navi flex-column navi-hover py-2">\
                                <li class="navi-item">\
                                    <a onclick="doRedirectionTicketStatus(\'' + row.ticketId + '\', \'View\')" class="navi-link">\
                                        <span class="navi-text">' + (langId == 0 ? 'View Ticket' : 'عرض التذكرة') + '</span>\
                                    </a>\
                                </li>\
                            </ul>\
                        </div>\
                    </div>';

                        return actionsHtml;
                    }
                }]
        });
    }
    return {
        init: function () {
            getAllTickets();
            ktList.push("#TicketStatus_datatable")
        }
    }
}

function getAllTicketsData() {

    var role = sessionStorage.getItem('role');
    var companyType = sessionStorage.getItem('companyType');

    if (role === 'Super Admin' && companyType === 'Tawtheeq') {
        ticketStatus = "NW";
    }
    else if (companyType === 'Lessor') {
        ticketStatus = "ASIG";
    }

    var grid = LoadAllTickets();
    grid.init();
}

function CreateContract() {
    PostRedirect("CreateContract", 0)
}

function doRedirectionRequestAsset(val, mode) {
    debugger
    switch (mode) {
        case "View":
            document.forms['ViewRequestAssetById']['RequestAssetId'].value = val;
            PostRedirect("ViewRequestAssetById", val);
            break;
    }
}

function doRedirectionTicketStatus(val, mode) {
    debugger
    switch (mode) {
        case "View":
            document.forms['AssignTicket']['TicketId'].value = val;
            PostRedirect("AssignTicket", val);
            break;
    }
}

function doRedirection(val, mode) {
    debugger
    switch (mode) {
        case "View":
            document.forms['ViewContractDetailsById']['FileId'].value = val;
            PostRedirect("ViewContractDetailsById", val);
            break;
        case "ViewDocument":
            document.forms['GetSupportingDocument']['ContractNumber'].value = val;
            PostRedirect("GetSupportingDocument", val);
            break;

    }
}

function viewContractDetails(contract, customer, asset, contractasset, statusId, status, fileId, FileDataId) {
    document.forms['ViewContractDetails']['ContractId'].value = contract;
    document.forms['ViewContractDetails']['CustomerId'].value = customer;
    document.forms['ViewContractDetails']['AssetId'].value = asset;
    document.forms['ViewContractDetails']['ContractAssetId'].value = contractasset;
    document.forms['ViewContractDetails']['StatusId'].value = statusId;
    document.forms['ViewContractDetails']['ContractStatus'].value = status;
    document.forms['ViewContractDetails']['FileId'].value = fileId;
    document.forms['ViewContractDetails']['FileDataId'].value = FileDataId;
    PostRedirect("ViewContractDetails", 0);
}

function doRedirectionToCertificate(contract, customer, asset, contractasset, statusId, action) {
    if (action == "Certificate") {
        document.forms['CertificateDetails']['ContractId'].value = contract;
        PostRedirect("CertificateDetails", 0);
    }
    else {
        document.forms['HistoryContractDetails']['ContractId'].value = contract;
        document.forms['HistoryContractDetails']['CustomerId'].value = customer;
        document.forms['HistoryContractDetails']['AssetId'].value = asset;
        document.forms['HistoryContractDetails']['ContractAssetId'].value = contractasset;
        document.forms['HistoryContractDetails']['StatusId'].value = statusId;
        PostRedirect("HistoryContractDetails", 0);
    }

}


function getFileType() {
    debugger
    $("#divLoader").show();
    var Factoring = "Template Type";
    var setupURL = BaseUrl + "/api/Setups/" + Factoring + "/getfiletypesbysetuptype";
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    var requestOptions = {
        method: 'GET',
        params: {
            ServerGridCall: true,
            Query: 'File Type',
        },
        headers: myHeaders,
        redirect: 'follow'
    };

    fetch(setupURL, requestOptions)
        .then(response => response.json())
        .then(data => {
            $("#divLoader").hide();
            debugger
            $("#fileTypeId").on("mouseover", function () {
                $(this).css("cursor", "pointer");
            });

            $("#fileTypeId").on("mouseout", function () {
                $(this).css("cursor", "default");
            });

            var labeling = $("<p>")
                .attr("for", "fileTypeLabel")
                .css({
                    "font-weight": "bold",
                    "color": "#333",
                    "margin-left": "6px"
                })
                .text("Select File Type");

            $("#fileTypeLabel").append(labeling);
            $("#fileTypeId").html("");
            $("#fileTypeId").css("margin-top", "20px"); // Adjust the value (20px) as needed
            $("#fileTypeId").html("<option value=''>Please Select</option>");

            // Append new options
            for (var i = 0; i < data.length; i++) {
                $("#fileTypeId").append("<option value='" + data[i].setupId + "'>" + data[i].setupValue + "</option>");
            }
        })
        .catch(error => console.log('error', error));

}

function getAssociateCompanies() {
    debugger
    $("#divLoader").show();
    var CompanyId = parseInt(sessionStorage.getItem('companyId'));

    var setupURL = BaseUrl + "/api/Admin/" + CompanyId + "/GetAssociateCompanies";
    //var setupURL = BaseUrl + "/api/Admin/GetAssociateCompanies";

    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", "Bearer " + getTokenFromSessionStorage());

    var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
    };

    fetch(setupURL, requestOptions)
        .then(response => response.json())
        .then(data => {
            $("#divLoader").hide();
            debugger
            $("#associateCompanyTypeId").on("mouseover", function () {
                $(this).css("cursor", "pointer");
            });

            $("#associateCompanyTypeId").on("mouseout", function () {
                $(this).css("cursor", "default");
            });
            debugger
            var labeling = $("<p>")
                .attr("for", "associateCompanyLabel")
                .css({
                    "font-weight": "bold",
                    "color": "#333",
                    "margin-left": "6px",
                    "margin-top": "30px" // Adjust the value as needed
                })
                .text(getGridTitle("Select_Associate_Company"));

            $("#associateCompanyLabel").append(labeling);
            $("#associateCompanyTypeId").html("");
            $("#associateCompanyTypeId").css("margin-top", "20px"); // Adjust the value (20px) as needed
            $("#associateCompanyTypeId").html("<option value=''>Please Select</option>");

            // Append new options
            for (var i = 0; i < data.data.length; i++) {
                $("#associateCompanyTypeId").append("<option value='" + data.data[i].companyId + "'>" + data.data[i].companyName + "</option>");
            }
        })
        .catch(error => console.log('error', error));

}



function createTermsAndConditions(containerId, data) {
    var headingdiv = $("<div>").addClass("form-group").css("display", "flex");
    var selectlang = $("<p>").attr("for", "TNCLabel").text("Select Language").css("text-align", "left");

    // Create a clickable text (link) for language toggle
    var languageLink = $("<a>")
        .attr("href", "#")
        .attr("id", "languageLink")
        .text("English")
        .css("margin-left", "10px")
        .click(function (event) {
            event.preventDefault(); // Prevent the default behavior of the link
            // Toggle between English and Arabic languages
            toggleLanguage(containerId);
        });
    headingdiv.append(selectlang, languageLink);
    $(`#${containerId}`).append(headingdiv);

    // Create a new textarea element
    var textarea = $("<textarea>")
        .val(data.data.defaultParameterDescription)
        .addClass("form-control")
        .attr("rows", 5)
        .attr("id", `textareaDescription_${containerId}`); // Use a unique ID for each textarea

    // Append the clickable text, textarea, and checkbox to the specified container
    $(`#${containerId}`).append(textarea);

    // Create a div container for checkbox
    var checkboxContainer = $("<div>")
        .addClass("form-group")
        .css("display", "flex");

    // Create a checkbox element
    var checkbox = $("<input>")
        .attr({
            type: "checkbox",
            id: `termsCheckbox_${containerId}` // Use a unique ID for each checkbox
        })
        .change(function () {
            // Update the state of the "Upload File" button when the checkbox is changed
            updateUploadButtonState(containerId);
        });

    // Create a label for the checkbox
    var label = $("<p>")
        .attr("for", `termsCheckbox_${containerId}`) // Use a unique ID for each label
        .css({
            "font-weight": "bold",
            "color": "#333",
            "margin-left": "6px"
        })
        .text("I have read and accepted the terms and conditions");

    // Append the checkbox and label to the container
    checkboxContainer.append(checkbox, label);

    // Append the checkbox container to the specified container for checkboxes
    $(`#${containerId}Checkbox`).append(checkboxContainer);

    // Function to handle language change
    function toggleLanguage(containerId) {
        debugger;
        // Get the current language text
        var currentLanguage = $("#languageLink").text();

        // Toggle between English and Arabic
        var newLanguage = currentLanguage === "عربي" ? "English" : "عربي";

        // Update the language text
        $("#languageLink").text(newLanguage);
        $(`#textareaDescription_${containerId}`).addClass("arz-l");
        // Update the textarea content based on the selected language
        if (newLanguage === "عربي") {
            $(`#textareaDescription_${containerId}`).val(data.data.defaultParameterDescription);
            $(`#textareaDescription_${containerId}`).removeClass("arz-r");
            $(`#textareaDescription_${containerId}`).addClass("arz-l");
        } else {
            $(`#textareaDescription_${containerId}`).val(data.data.defaultParameterDescriptionAr);
            $(`#textareaDescription_${containerId}`).removeClass("arz-l");
            $(`#textareaDescription_${containerId}`).addClass("arz-r");
        }
    }

    function updateUploadButtonState(containerId) {
        var checkboxChecked = $(`#termsCheckbox_${containerId}`).prop("checked");
        if (checkboxChecked) {
            $(`#UploadeFileBtn_${containerId}`).prop("disabled", false);
        } else {
            $(`#UploadeFileBtn_${containerId}`).prop("disabled", true);
        }
    }

}

// Usage for both TermAndConditionOne and TermAndConditionTwo
function getTNC() {
    debugger;
    $("#divLoader").show();
    var TNCType = "TNC";
    var setupURL = BaseUrl + "/api/Setups/" + TNCType + "/gettermsandcondition";
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    var requestOptions = {
        method: 'GET',
        params: {
            ServerGridCall: true,
            Query: 'TNC',
        },
        headers: myHeaders,
        redirect: 'follow'
    };

    fetch(setupURL, requestOptions)
        .then(response => response.json())
        .then(data => {
            $("#divLoader").hide();

            // Create Terms and Conditions One
            createTermsAndConditions("TermAndConditionOne", data);

            // Create Terms and Conditions Two
            createTermsAndConditions("TermAndConditionTwo", data);
        })
        .catch(error => console.log('error', error));
}


KTDatatableAutoColumnHideDemos = function (status) {
    // Private functions
    // basic demo
    LoadPricingPlanGrid = function () {
        var statusEn = {
            'PEN': { 'title': 'Pending', 'class': 'label-warning' },
            'APR': { 'title': 'Accepted', 'class': 'label-success' },
            'REJ': { 'title': 'Rejected', 'class': 'label-danger' },
        };
        var statusAr = {
            'PEN': { 'title': 'قيد الانتظار', 'class': 'label-warning' },
            'APR': { 'title': 'قبلت', 'class': 'label-success' },
            'REJ': { 'title': 'مرفوض', 'class': 'label-danger' }
        };
        var datatable = $('#RuleDetails_datatable').KTDatatable({
            data: {
                type: 'remote',
                source: {
                    read: {
                        //url: CompanyUrl + "/Companyreq?UserId=" + sessionStorage.getItem('userId'),
                        url: CallURL + "/repoCompanyRequests",
                        method: 'POST',
                        headers: {
                            "AccessToken": getTokenFromSessionStorage()
                        },
                        params: {
                            ServerGridCall: true,
                            UserId: sessionStorage.getItem("userId"),
                            CompanyId: sessionStorage.getItem("companyId"),
                            CompanyTypeId: sessionStorage.getItem("companyTypeId"),
                            SearchDateStart: SearchDateStart,
                            SearchDateEnd: SearchDateEnd,
                            SearchAssetNumber: SearchAssetNumber,
                            SearchStatusId: SearchStatusId,
                        },
                        map: function (raw) {
                            debugger

                            var dataset = raw;

                            var count = raw.filter(x => x.processStatus == 'PEN').length;

                            //updateBellCount("REPO", count);

                            console.log(dataset)
                            if (typeof raw !== 'undefined') {
                                dataset = raw;
                            }
                            return dataset;
                        }
                    },
                },
                pageSize: 10,
                serverPaging: false,
                serverFiltering: false,
                serverSorting: false,
                saveState: false,
            },

            layout: {
                scroll: true
            },

            // column sorting
            sortable: true,

            pagination: true,

            //search: {
            //	input: $('#kt_datatable_Company_query'),
            //	key: 'query'
            //},

            // columns definition
            columns: [
                {
                    field: 'companyCode',
                    title: getGridTitle("Company_Code"),
                },
                {
                    field: langId == 0 ? 'companyName' : 'companyNameAr',
                    title: getGridTitle("Company_Name"),
                },
                {
                    field: langId == 0 ? 'submittedByCompanyName' : 'submittedByCompanyNameAr',
                    title: getGridTitle("Submited_By"),

                },
                {
                    field: 'submissionDate',
                    title: getGridTitle("Submission_Date"),
                    type: 'date',
                    template: function (row) {
                        debugger
                        if (row.submissionDate) {
                            var dateParts = row.submissionDate.split(" ");
                            if (dateParts.length > 0) {
                                var date = new Date(dateParts[0]);
                                var month = date.getMonth() + 1;
                                return month + "/" + date.getDate() + "/" + date.getFullYear() + " " + date.getHours() + ":" + date.getMinutes();
                            }
                        }
                        return "";
                    }
                },
                {
                    field: 'processStatus',
                    title: 'Status',
                    title: getGridTitle("Status"),
                    sortable: false,
                    template: function (row) {
                        var status = langId == 0 ? statusEn : statusAr;
                        return '<span class="label font-weight-bold label-lg ' + status[row.processStatus].class + ' label-inline mr-5 py-5 px-5" style="cursor: pointer;">' + status[row.processStatus].title + '</span>';
                    }
                },
                {
                    field: 'Actions',
                    title: getGridTitle('Action'),
                    sortable: false,
                    width: 80,
                    overflow: 'visible',
                    autoHide: false,
                    template: function (row) {
                        debugger;

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
                            <a onclick=EditOrViewCompanyDetails("' + row.companyAssociateId + '","View") class="navi-link" >\
                                <span class="navi-text">'+ getGridTitle("view_details") +'</span>\
                            </a>\
                        </li>\
                    </ul>\
                </div>\
            </div>\
        ';
                    },
                }
            ],
            error: function (e) {
                if (e.status === 403) {
                    // Handle "Access Denied" response here
                    alert('Access Denied: You do not have permission to access this resource.');
                } else {
                    // Handle other errors here
                    console.error('An error occurred:', e.statusText);
                }
            }

        });

        $('#kt_datatable_Rules_query').on('change', function () {
            datatable.search($(this).val().toLowerCase(), 'companyName');
        });
    };




    return {
        // public functions
        init: function () {
            LoadPricingPlanGrid();
            ktList.push("#RuleDetails_datatable");
            localized();
        },
    };
}();



function getallcompanyreq() {
    debugger
    //$('#select-all-checkbox').prop('checked', false);
    //$('.select-row').prop('checked', false);
    LoadPricingPlanGrid();
    KTDatatableAutoColumnHideDemos.init();
}
function EditOrViewCompanyDetails(Id, mode) {
    debugger;
    if (mode == "View") {
        document.forms['ViewCompanyDetails']['CompanyRepossessionId'].value = Id;

        PostRedirect("ViewCompanyDetails", Id)
    }
    else if (mode == "Edit") {
        document.forms['EditCompanyDetails']['CompanyId'].value = Id;

        PostRedirect("EditCompanyDetails", Id)
    }
}

function updateBellCount(type, count) {

    debugger
    var assCount = sessionStorage.getItem("AssetCounts");
    var tixCount = sessionStorage.getItem("TicketCounts");
    var repoCount = sessionStorage.getItem("RepoComapnyCounts");

    if (type === "REPO") {
        repoCount = count;
        document.getElementById('CompanyCount').innerText = count;
    }
    else if (type === "ASSET") {
        assCount = count;
        document.getElementById('MakeCount').innerText = count;
    }
    else if (type === "TICKET") {
        tixCount = count

        document.getElementById('ticketCount').innerText = count;
    }
    
    sessionStorage.setItem("RepoComapnyCounts", repoCount);
    sessionStorage.setItem("TicketCounts", tixCount);
    sessionStorage.setItem("AssetCounts", assCount);

    var totalcount = parseInt(assCount) + parseInt(tixCount) + parseInt(repoCount);
    sessionStorage.setItem("TotalCounts", totalcount);
    document.getElementById('count').innerText = totalcount;
}