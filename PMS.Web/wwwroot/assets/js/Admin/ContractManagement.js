var URL = BaseUrl + "/api/ContractManagement/getMESTRFiles";
var ResumeProcessURL = BaseUrl + "/api/ContractManagement/resumeProcess";
var ProcessContractURL = BaseUrl + "/api/ContractManagement/getallprocessedcontracts";
var CallURL = BaseUrl + "/api/ContractManagement";
NewURL = BaseUrl + "/api/ContractManagement" + "/" + "getsupportingdocument";
var GetFailedReq = BaseUrl + "/api/ContractManagement/getfailedrequests";

var accessableAssetTypes = [];
var allowedFileTypes = [];
var LoadPricingPlanGrid;
var LoadAllUploadedFiles;
var LoadAllProcessContract;
var ktList = [];
var userID = "";
var CRN = "";
var ARN = "";
var SearchDateStart = null;
var SearchDateEnd = null;
var SearchAssetNumber = null;
var SearchStatusId = null;
var SearchContractNumber = null;
var isGridInitialized = false;
var CompanyId = null;
var generalSerachFilter = false;
var Producttype = null;
var SearchPurpose = null;
var langId = 0;

$(document).ready(function () {
    console.log("Setting Value js:", maxFileSizeMB);

    langId = localStorage.getItem("languageId");
    getInboxCounts();


    $('#filterModalBtn').hide();
    userID = sessionStorage.getItem("userId");
    CompanyId = sessionStorage.getItem("companyId");
    

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


    $("#assetTypeGroup").hide();
    $(".uploadwithsuppdoc").hide();


    const searchStatusId = document.getElementById('searchStatusId');

    if (langId != 0) {
        const arabicTranslations = {
            "Please select": "الرجاء الاختيار",
            "Pending": "قيد الانتظار",
            "Accepted": "قبلت",
            "Rejected": "مرفوض"
        };

        for (let option of searchStatusId.options) {
            option.text = arabicTranslations[option.text];

        }
        // Ensure "Please select" remains selected
        const pleaseSelectOption = searchStatusId.querySelector('option[value="Please select"]');
        if (pleaseSelectOption) {
            pleaseSelectOption.selected = true;
        }

    }

    getAccessableAssetTypes();
    getAssetTypes();
    GetProductType();
    $('#associateCompanyTypeId').select2().on("change", function (e) {
        
        var selectedData = $('#associateCompanyTypeId').select2('data');
        selectedData.forEach(function (x) {
            
            if (x.text === "Select All") {
                $('#associateCompanyTypeId').find('option#all').prop('selected', false);
                $('#associateCompanyTypeId').find('option:not(#all)').prop('selected', true);
                $('#associateCompanyTypeId').change();
            }
        })
        updateUploadButtonState();
      
    });
    $('#ProductType').select2();
    $('#SearchPurpose').select2();

    getAllMESTRFiles();
  
    getFileType();
    getAssociateCompanies();
    getTNC();
    document.getElementById("selectFilesButton").addEventListener("click", () => {
        document.getElementById("contractupload").click();
    });
    document.getElementById("contractupload").addEventListener("change", updateFileList);

    //document.getElementById("selectSupportingDocsButton").addEventListener("click", () => {
    //    document.getElementById("supportingdocsupload").click();
    //});
    //document.getElementById("supportingdocsupload").addEventListener("change", updateSupportingDocsList);

    document.getElementById("selectSupportingDocsBrowse").addEventListener("click", () => {
        ;
        document.getElementById("supportingdocumentsupload").click();
    });
    document.getElementById("supportingdocumentsupload").addEventListener("change", updateSupportingDocumentsList);


    document.getElementById("generalSearchForCM").addEventListener("click", () => {
        generalSearchForCM();
    });
    document.getElementById("resetSearch").addEventListener("click", () => {
        resetGeneralSearch();
    });

    hideAssociateCompany(true);   

    localized();

});

function resetGeneralSearch() {
    
    CRN = "";
    ARN = "";
    SearchDateStart = null;
    SearchDateEnd = null;
    SearchAssetNumber = null;
    SearchStatusId = null;
    SearchContractNumber = null;
    Producttype = null;
    SearchPurpose = null;


    document.getElementById("searchCRN").value = CRN;
    document.getElementById("searchARN").value = ARN;
    //document.getElementById("searchAssetNumber").value = SearchAssetNumber;
    document.getElementById("searchStatusId").value = langId == 0 ? "Please Select" : "يرجى الاختيار";
    document.getElementById("searchContractNumber").value = SearchContractNumber;

    document.getElementById("SearchDateStart").value = "";
    document.getElementById("SearchDateEnd").value = "";
    document.getElementById("SearchDateEnd").value = "";
    $('#ProductType').val('').trigger('change');
    $('#SearchPurpose').val('').trigger('change');
}

function generalSearchForCM() {
    generalSerachFilter = true;

    CRN = document.getElementById("searchCRN").value;
    ARN = document.getElementById("searchARN").value;
    Producttype = document.getElementById("ProductType").value;
    SearchPurpose = document.getElementById("SearchPurpose").value;

    SearchContractNumber = document.getElementById("searchContractNumber").value;
    //SearchAssetNumber = document.getElementById("searchAssetNumber").value;
    SearchStatusId = document.getElementById("searchStatusId").value === "Please select" ? null : document.getElementById("searchStatusId").value;

    
    // Get the date values
    var rawSearchDateStart = document.getElementById("SearchDateStart").value;
    var rawSearchDateEnd = document.getElementById("SearchDateEnd").value;

    // Convert the date values to a different format (e.g., "MM/DD/YYYY")
    SearchDateStart = (rawSearchDateStart != null && rawSearchDateStart != "") ? convertDateFormat(rawSearchDateStart) : rawSearchDateStart;
    SearchDateEnd = (rawSearchDateEnd != null && rawSearchDateEnd != "") ? convertDateFormat(rawSearchDateEnd) : rawSearchDateEnd;

    if ($('#kt_tab_pane_1').hasClass('active')) {
        $('#MESTRFiles_datatable').KTDatatable().destroy();
        isGridInitialized = false;
        getAllMESTRFiles();
    }
    if ($('#kt_tab_pane_2').hasClass('active')) {
        $('#ProcessContracts_datatable').KTDatatable().destroy();

        getAllProcessedContracts();
    }

    if ($('#kt_tab_pane_3').hasClass('active')) {
        $('#SupportingDocuments_datatable').KTDatatable().destroy();
        KTDatatableAutoColumnHideDemo.init();
    }
    $('#filterModal').modal('hide');

    generalSerachFilter = false;

}

function convertDateFormat(dateString) {
    // Assuming the input format is "DD/MM/YYYY"
    var parts = dateString.split('/');
    var formattedDate = parts[1] + '/' + parts[0] + '/' + parts[2];
    return formattedDate;
}

function browserFile() {
    ;
    $('#uploadFilesDialog').modal({
        backdrop: 'static'
    });
}


$("#supportingdocumentsupload").change(function () {
    var checkboxChecked = $(`#termsCheckbox_TermAndConditionOne`).prop("checked");
    var supportingfileUpload = $("#supportingdocumentsupload").get(0);
    var supportingfiles = supportingfileUpload.files;
    if (checkboxChecked && supportingfiles.length > 0) {

        $(`#withSuppFileUpload`).prop("disabled", false);
    } else {
        $(`#withSuppFileUpload`).prop("disabled", true);
    }
});

function closemodal() {
    
    $('#contractupload').val('');
    $('#fileList').empty();
    $('#supportingdocumentsupload').val('');
    $('#supportingdocumentsList').empty();
    $('#kt_dropzone_2').hide();
    $('#kt_dropzone_1').css('width', '99%');
    $('#fileTypeId').val('');
    $('#assetType').val('');
    $('#assetTypeGroup').hide();
    $('#associateCompanyGroup').hide();
    $('#associateCompanyTypeId').val([]).trigger('change');
    $('#uploadFilesDialog input[type=checkbox], #uploadFilesDialog input[type=radio]').prop('checked', false);
    $('#UploadeFileBtn_TermAndConditionTwo, #withSuppFileUpload').prop('disabled', true);

}
function browserSupportingFile() {
    $('#uploadSupportingDocsDialog').modal({
        backdrop: 'static'
    });
}

function browserSupportingFileForContract(contId) {
    document.getElementById("contId").value = contId;
    $('#uploadSupportingDocsDialog').modal({
        backdrop: 'static'
    });
}

function uploadExcel() {
    
    //var selectedOption = $("input[name='fileType']:checked").val();
    var selectedOption = $("#fileTypeId").val();
    //var selectedCompanyOption = $("#associateCompanyTypeId").val();
    var selectedCompanyOption = Array.from(document.getElementById("associateCompanyTypeId").selectedOptions).map(option => option.value).join(',');

    var includeAssociateCompanies = false;
    if (getSelectedFileTpyeCode() == "REPOF" || getSelectedFileTpyeCode() == "EF") {
        includeAssociateCompanies = true;
    }

    if (window.FormData !== undefined && selectedOption) {

        var fileUpload = $("#contractupload").get(0);
        var files = fileUpload.files;
        if (files.length > 0) {

            // Create FormData object  
            var fileData = new FormData();
            fileData.append("SourceType", "APP");

            // Looping over all files and add it to FormData object  
            for (var i = 0; i < files.length; i++) {
                fileData.append(files[i].name, files[i]);
            } 

            if (typeof(sessionStorage.getItem("userId")) == "string") {
                fileData.append('UserId', sessionStorage.getItem("userId"))
            }

            var companyId = parseInt(sessionStorage.getItem("companyId"));
            if (!isNaN(companyId)) {
                fileData.append('CompanyId', companyId)
            }
            
            fileData.append('TemplateTypeID', $("#fileTypeId").val())
            fileData.append('AssociateCompanyId', includeAssociateCompanies ? $("#associateCompanyTypeId").val() : '')

            var tenantId = parseInt(sessionStorage.getItem("TenantId"));
            if (sessionStorage.getItem("TenantId") == null) {
                fileData.append('TenantId', 0);
            }
            else if (!isNaN(tenantId)) {
                fileData.append('TenantId', tenantId);
            }

            var userIpAddress = sessionStorage.getItem("userIpAddress");          
            fileData.append('UserIpAddress', userIpAddress);
           

            $('#uploadFilesDialog').modal('hide');

            var requestOptions = {
                method: 'POST',
                redirect: 'follow',
                body: fileData
            };

            commonFetch(BaseUrl + '/api/ContractManagement/uploadContract', requestOptions, function (result) {
                if (result != null && result != undefined) {
                    if (result.success) {
                        debugger
                        if (getSelectedFileTpyeCode() == "REPOF" || getSelectedFileTpyeCode() == "EF") {
                            $("#FileWithSuppDocsUploadSuccessModal").modal('show');
                        }
                        else {
                            $("#UploadSuccessModal").modal('show');
                        }
                       // showSurvey(getTranslation('File Upload'));
                       // showSurvey(getTranslation('RCON'));
                        showSurvey("SUREFU");
                        getAllMESTRFiles();
                    }
                    else {

                        var message = getTranslation(result.message);

                        showSweetAlert('error', "", result.message);
                        if (result.dynamicData != undefined) {
                            window.location = BaseUrl + '/api/ContractManagement/ContractRegistration/' + message + '/downloadfile'; //'/api/ContractManagement/' + result.dynamicData + '/downloadInvalidFiles';
                        }
                    }
                }
                else {
                    showSweetAlert('error', getTranslation("Invalid Response"), "");
                }

            });
        }
        else {
            var errorElement = document.getElementById("selectfileerror");
            var message = getTranslation(result.message);

            errorElement.innerText = message;
        }
    }
    else {
        if (!selectedOption) {
           
            var errorElement = document.getElementById("filetypeerror");
            errorElement.innerText = getTranslation("File type is required, Please select");

        }
        else {
            Swal.fire({
                text: getTranslation("Error: Please Select File"),
                icon: "error",
                buttonsStyling: false,
                confirmButtonText: getTranslation("Ok, got it!"),
                customClass: {
                    confirmButton: "btn font-weight-bold btn-light"
                }
            })
        }
    }
}

function UploadSupportingDocuments() {
    
    // Checking whether FormData is available in browser  
    if (window.FormData !== undefined) {

        var supportingfileUpload = $("#supportingdocumentsupload").get(0);
        var supportingfiles = supportingfileUpload.files;

        var invalidFiles = [];
        let totalFileSize = 0;

        if (supportingfiles.length > 0) {
            // Create FormData object  
            var fileData = new FormData();
            ;
            const maxFileSizeBytes = maxFileSizeMB * 1048576; // Convert MB to bytes

            // Looping over all files and add it to FormData object  
            for (var i = 0; i < supportingfiles.length; i++) {
                var file = supportingfiles[i];
                var fileName = file.name;

                totalFileSize += file.size;

                if (totalFileSize > maxFileSizeBytes) {
                    Swal.fire({
                        icon: 'error',
                        title: getTranslation('Total File Size Exceeded'),
                        text: `The total size of all files exceeds the allowed limit of ${maxFileSizeMB} MB.`,
                        showConfirmButton: true
                    });
                    return; // Stop further execution
                }

                if (fileName.split('.')[0].length < 16) {
                    invalidFiles.push(fileName);
                    continue
                }

                var extension = fileName.split('.').pop().toLowerCase();
                if (extension === 'csv' || extension === 'pdf') {
                    fileData.append(supportingfiles[i].name, supportingfiles[i]);
                }
                else {

                    Swal.fire({
                        icon: 'error',
                        title: getTranslation('Invalid Supporting Document File Type'),
                        text: getTranslation('Only accepts CSV and PDF file format.'),
                        showConfirmButton: true
                    });

                    return;
                }

            }

            
            


            if (invalidFiles.length > 0) {
                var incorrectFileNames = invalidFiles.join('\n');
                Swal.fire({
                    title: getTranslation("Invalid Supporting Documents Files"),
                    icon: 'error',
                    text: getTranslation("Following filenames length are incorrect") + "\n" + incorrectFileNames,
                });
            }
            else {
                var userId = sessionStorage.getItem('userId');
                // var ContractId = document.getElementById("contId").value;
                // Add additional variables to the FormData object
                fileData.append("CreatedBy", userId);
                fileData.append("CompanyId", parseInt(sessionStorage.getItem("companyId")));
                fileData.append("TenantId", parseInt(sessionStorage.getItem("TenantId")));
                fileData.append("ContractId", ContractId);
                fileData.append("FileTypeId", parseInt($('#fileTypeId').val()));

                var requestOptions = {
                    method: 'POST',
                    redirect: 'follow',
                    body: fileData
                };

                commonFetch(BaseUrl + '/api/ContractManagement/uploadSupportingDocuments', requestOptions, function (result) {
                    if (result != null && result != undefined) {
                        if (result.success) {
                            
                            $("#divLoader").hide();
                            $("th#uploaddoc").empty().append(result.dynamicData.uploadedDocument);
                            $("th#invaliddoc").empty().append(result.dynamicData.invalidCount);
                            var invalidDocsRow = document.getElementById("invaliddocs");

                            invalidDocsRow.style.float = "right";
                            // Create a new table cell for each value in the list and append it to the row
                            result.dynamicData.invalidDocumentName.forEach(function (value) {
                                var cell = document.createElement("td");
                                cell.textContent = value;
                                invalidDocsRow.appendChild(cell);
                            });
                            // $('#SupportingocsUploadSuccessModal').modal('show');
                            //showSurvey('Upload Supporting Document');
                            showSurvey('SUREUSD');


                            uploadExcel();
                        }
                        else {
                            $("#divLoader").hide();
                            Swal.fire({
                                text: result.message,
                                icon: "error",
                                buttonsStyling: false,
                                confirmButtonText: getTranslation("Ok, got it!"),
                                customClass: {
                                    confirmButton: "btn font-weight-bold btn-light"
                                }
                            }).then(function () {

                            });
                            if (result.dynamicData != undefined) {
                                window.location = BaseUrl + '/api/ContractManagement/ContractRegistration/' + result.dynamicData + '/downloadfile'; //'/api/ContractManagement/' + result.dynamicData + '/downloadInvalidFiles';
                            }
                        }
                    }
                    else {
                        showSweetAlert('error', getTranslation("Invalid Response"), "");
                    }
                });
            }
           
        }
        else {
            $('#uploadSupportingDocsDialog').modal({
                backdrop: 'static',
                keyboard: false
            });

            Swal.fire({
                icon: 'error',
                title: getTranslation("No Supporting Documents Selected"),
                text: getTranslation("Please upload at least one file."),
                showConfirmButton: true
            });
            return; // Stop further execution
        }

    } else {
        alert(getTranslation("FormData is not supported."));
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


    if (getSelectedFileTpyeCode() == "REPOF" || getSelectedFileTpyeCode() == "EF") {

        var checkboxChecked = $(`#termsCheckbox_TermAndConditionTwo`).prop("checked");
        var selectedOption = $("#fileTypeId").val();
        var contractfileUpload = $("#contractupload").get(0);
        var contractFiles = contractfileUpload.files;

        var supportfileUpload = $("#supportingdocumentsupload").get(0);
        var supportingFiles = supportfileUpload.files;
        if (checkboxChecked && contractFiles.length > 0 && supportingFiles.length > 0 && selectedOption != "") {
            $(`.uploadwithsuppdoc`).prop("disabled", false);

        }
        else {
            $(`.uploadwithsuppdoc`).prop("disabled", true);
        }
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


    if (getSelectedFileTpyeCode() == "REPOF" || getSelectedFileTpyeCode() == "EF") {

        var checkboxChecked = $(`#termsCheckbox_TermAndConditionTwo`).prop("checked");
        var selectedOption = $("#fileTypeId").val();
        var contractfileUpload = $("#contractupload").get(0);
        var contractFiles = contractfileUpload.files;

        var supportfileUpload = $("#supportingdocumentsupload").get(0);
        var supportingFiles = supportfileUpload.files;
        if (checkboxChecked && contractFiles.length > 0 && supportingFiles.length > 0 && selectedOption != "") {
            $(`.uploadwithsuppdoc`).prop("disabled", false);

        }
        else {
            $(`.uploadwithsuppdoc`).prop("disabled", true);

        }

    }

}

var KTDatatableAutoColumnHideDemo = function () {
    // Private functions
    // basic demo
    if (!generalSerachFilter) {
        resetGeneralSearch();
    }
    LoadPricingPlanGrid = function () {

        var datatable = $('#SupportingDocuments_datatable').KTDatatable({
            // datasource definition
            data: {
                type: 'remote',
                source: {
                    read: {
                        url: NewURL + "?companyId=" + CompanyId,
                        method: 'GET',
                        params: {
                            ServerGridCall: true,
                            SetupID: ""
                        },
                        headers: {
                            'AccessToken': getTokenFromSessionStorage()
                        },
                        timeout: getGridTimeoutInMS(),
                        map: function (raw) {

                            var dataSet = raw.data;
                            console.log(dataSet)
                            if (typeof raw !== 'undefined') {
                                dataSet = raw.data;
                            }
                            return dataSet;
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

            search: {
                input: $('#kt_datatable_supporting'),
            },
           
            columns: [
                {
                    field: 'arn',
                    title: 'ARN',
                    searchable: true,

                },
                {
                    field: 'documentName',
                    title: 'Document Name',
                    searchable: true,

                },

                {
                    field: 'user',
                    title: 'Created By',
                    searchable: true,


                },
                {
                    field: 'createdDate',
                    title: 'Created DATE',

                    template: function (row) {
                        row.createdDate = row.createdDate.split(" ")[0]
                        var date = new Date(row.createdDate);
                        var month = date.getMonth() + 1;
                        return month + "/" + date.getDate() + "/" + date.getFullYear() + " " + date.getHours() + ":" + date.getMinutes();
                    }
                    // callback function support for column rendering
                },
                {

                    field: 'Actions',
                    title: 'Actions',
                    sortable: false,
                    width: 80,
                    overflow: 'visible',
                    autoHide: false,
                    template: function (row) {
                        const parts = row.documentPath.split("\\");
                        var lastSegment = parts.pop() || parts.pop();
                        //var downloadUrl = BaseUrl + '/api/ContractManagement/' + lastSegment + '/downloadsupportingdocument';
                        var downloadUrl = BaseUrl + '/api/ContractManagement/SupportingDocument/' + lastSegment + '/downloadfile';

                        // Attach a click event to the download button
                        return '\
                            <button class="btn btn-sm btn-secondary font-weight-bold mr-0 download-btn" data-filename="' + lastSegment + '">\
                                Download\
                            </button>\
                        ';
                    },
                }],
            error: function (e) {
                if (e.status === 403) {
                    // Handle "Access Denied" response here
                    alert(getTranslation('Access Denied: You do not have permission to access this resource.'));
                } else {
                    // Handle other errors here
                    console.error('An error occurred:', e.statusText);
                }
            }
        });
        $('#SupportingDocuments_datatable').on('click', '.download-btn', function () {
            // Get the file name from the data attribute
            var fileName = $(this).data('filename');


            //window.location.href = BaseUrl + '/api/ContractManagement/' + fileName + '/downloadsupportingdocument';
            window.location.href = BaseUrl + '/api/ContractManagement/SupportingDocument/' + fileName + '/downloadfile';
        });

        //$('#kt_datatable_feild_query').on('change', function () {
        //    datatable.search($(this).val().toLowerCase(), 'template_Name');
        //});

    };




    return {
        // public functions
        init: function () {
            LoadPricingPlanGrid();
            ktList.push("#SupportingDocuments_datatable");
        },
    };
}();

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

function getAllProcessedContracts() {
    if (!generalSerachFilter) {
        resetGeneralSearch();
    }

    $('#filterModalBtn').show();
    $('#select-all-checkbox').prop('checked', false);
    $('.select-row').prop('checked', false);

    getAllProcessedContractsGrid();
    LoadAllProcessContract.init();
}

function getAllMESTRFiles() {
    if (!generalSerachFilter) {
        resetGeneralSearch();
    }
    
    if (isGridInitialized) {
        $('#MESTRFiles_datatable').KTDatatable().destroy();
    }
    //getAllUploadLoadedFiles();
    LoadAllUploadedFiles.init();
    isGridInitialized = true;
}

function getAllFailedRequests() {
    // Uncheck all checkboxes   
    if (!generalSerachFilter) {
        resetGeneralSearch();
    }
    ;
    $('#select-all-checkbox').prop('checked', false);
    $('.select-row').prop('checked', false);

    LoadFailedRequestdatatable();
    LoadFailedRequests.init();
}

var LoadFailedRequests = function () {

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
                        params: {
                            ServerGridCall: true,
                            UserId: sessionStorage.getItem("userId"),
                            CompanyId: parseInt(sessionStorage.getItem("companyId")),
                            SearchStatusId: SearchStatusId,

                        },
                        headers: {
                            'AccessToken': getTokenFromSessionStorage()
                        },
                        timeout: getGridTimeoutInMS(),
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
                    field: 'totalErrorsCount',
                    title: 'Errors Count',
                    sortable: false,
                },
                {
                    field: 'processedStatusId',
                    title: 'Status',
                    sortable: false,
                    template: function (row) {
                        var status = {
                            "Modified": { 'title': 'Modified', 'class': 'label-success' },
                            "UnProcessed": { 'title': 'UnProcessed', 'class': ' label-danger' },
                            "Delete": { 'title': 'Delete', 'class': ' label-danger' },
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
	                            <a href="javascript:;" class="btn btn-sm btn-secondary btn-icon mr-0" data-toggle="dropdown">\
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
        //$('#select-all-checkbox').on('change', function () {
        //    var isChecked = $(this).prop('checked');
        //    $('.select-row').prop('checked', isChecked);
        //});

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

LoadAllUploadedFiles = function (status) {
    getAllUploadLoadedFiles = function () {
        DirectDebitdatatable = $('#MESTRFiles_datatable').KTDatatable({
            // datasource definition
            rows: {
                autoHide: false
            },
            data: {
                type: 'remote',
                source: {
                    read: {
                        url: URL,
                        headers: {
                            "AccessToken": getTokenFromSessionStorage()
                        },
                        method: 'GET',
                        params: {
                            ServerGridCall: true,
                            UserId: sessionStorage.getItem("userId"),
                            CompanyId: parseInt(sessionStorage.getItem("companyId")),
                            SearchDateStart: SearchDateStart,
                            SearchDateEnd: SearchDateEnd
                        },
                        timeout: getGridTimeoutInMS(),
                        map: function (raw) {

                            MainDataSource = raw;

                            return MainDataSource;
                        }
                    },
                },
                pageSize: 10,
                serverPaging: true,
                serverFiltering: true,
                // serverSorting: true,
                saveState: true,

            },
            columns: {
                adjust: true
            },
            layout: {
                scroll: true
            },

            // column sorting
            // sortable: true,
            pagination: true,
            search: {
                input: $('#DirectDebit_datatable_search_query'),
                key: 'generalSearch'
            },

            // columns definition
            columns: [
                {
                    field: 'fileName',
                    title: getGridTitle("File_Name"),

                },
                {
                    field: 'totalRows',
                    title: getGridTitle("Total_Contract"),

                },
                {
                    field: 'errorRows',
                    title: getGridTitle("Failed_Contract"),

                    width: 100
                },
                {
                    field: 'processedRows',
                    title: getGridTitle("Processed_Contracts"),
                },
                {
                    field: 'processedBy',
                    title: getGridTitle("Upload_By"),

                },
                {
                    field: 'processedDate',
                    title: getGridTitle("Upload_Date"),

                    template: function (row) {
                        
                        row.processedDate = row.processedDate.split(" ")[0]
                        var date = new Date(row.processedDate);
                        var month = date.getMonth() + 1;
                        return month + "/" + date.getDate() + "/" + date.getFullYear() + " " + date.getHours() + ":" + date.getMinutes();
                    }
                    // callback function support for column rendering
                },
                {
                    field: langId == 0 ? 'details' : 'detailsAr',
                    title: getGridTitle("Type"),

                },
                {
                    field: 'processedStatusId',
                    title: getGridTitle("Status"),
                    template: function (row) {
                        var statusClass;
                        var statusTitle;

                        var statusTitlesEn = {
                            'Failed': 'Failed',
                            'Processed': 'Processed',
                            'Partial': 'Partial',
                            'Paused': 'Paused'

                        };

                        var statusTitlesAr = {
                            'Failed': 'فشل',
                            'Processed': 'معالج',
                            'Partial': 'جزئي',
                            'Paused': 'توقفت العملية'
                        };

                        var statusTitles = langId == 0 ? statusTitlesEn : statusTitlesAr;
                        if (row.processedStatusCode == 'PF') {
                            statusClass = 'label-danger';
                            statusTitle = statusTitles['Paused'];
                        }
                        else if (row.errorRows + row.processedRows !== row.totalRows) {
                            statusClass = 'label-warning';
                            statusTitle = statusTitles['Partial'];
                        } else {
                            statusClass = row.errorRows > 0 ? 'label-danger' : 'label-success';
                            statusTitle = row.errorRows > 0 ? statusTitles['Failed'] : statusTitles['Processed'];
                        }

                        return '<span class="label font-weight-bold label-lg ' + statusClass + ' label-inline mr-5 py-5 px-5" style="cursor: pointer;">' + statusTitle + '</span>';


                    }
                },
                {
                    field: '',
                    title: getGridTitle("Action"),

                    template: function (row) {
                        if (row.processedStatusCode == 'PF') {
                            return '<button class="btn btn-sm btn-success  mr-0" onclick="resumeProcess(\'' + row.fileId + '\')">Resume</button>';
                        }
                        else {
                            var showErrorDownload = row.errorRows > 0 ? true : false;
                            var viewErrorsLink = showErrorDownload ?
                                '<a onclick="doRedirection(\'' + row.fileId + '\', \'ViewError\')" class="navi-link">' +
                                '<span class="navi-text">' + getGridTitle("autoValidation_viewerrors") + '</span>' +
                                '</a>' :
                                '';
                            return '\
                            <div class="dropdown dropdown-inline">\
                                <a href="javascript:;" class="btn btn-sm btn-secondary btn-icon mr-0" data-toggle="dropdown">\
                                    <span class="svg-icon svg-icon-md">\
                                        <i class="ki ki-bold-more-ver"></i>\
                                    </span>\
                                </a>\
                                <div class="dropdown-menu dropdown-menu-sm dropdown-menu-right">\
                                    <ul class="navi flex-column navi-hover py-2">\
                                        <li class="navi-item">\
                                            <a onclick="doRedirection(\'' + row.fileId + '\', \'View\')" class="navi-link">\
                                                <span class="navi-text">'+ getGridTitle("autovalidation_viewdetails") + '</span>\
                                            </a>' + viewErrorsLink +
                                (showErrorDownload == true ? '<a onclick="doRedirection(\'' + row.fileId + '\', \'DownloadFailedRows\')" class="navi-link"><span class="navi-text">' + getGridTitle("autoValidation_downloadfailedrows") + '</span></a>' : '') +
                                '\
                                        </li>\
                                    </ul>\
                                </div>\
                            </div>\
                        ';
                        }
                            
                    }
                }],


        });
    }
    return {
        // public functions
        init: function () {
            getAllUploadLoadedFiles();
            ktList.push("#MESTRFiles_datatable");

        },
    };
}();

LoadAllProcessContract = function (status) {
    debugger
    var statusEn = {
        'PEN': { 'title': 'Pending', 'class': 'label-warning' },
        'APR': { 'title': 'Accepted', 'class': 'label-success' },
        'REJ': { 'title': 'Rejected', 'class': 'label-danger' },
        'RESUB': { 'title': 'Resumbit', 'class': 'label-primary' },
        'DEL': { 'title': 'Deleted', 'class': 'label-secondary' },
        'Removed': { 'title': 'Removed', 'class': 'label-info' }
    };

    var statusAr = {
        'PEN': { 'title': 'قيد الانتظار', 'class': 'label-warning' },
        'APR': { 'title': 'قبلت', 'class': 'label-success' },
        'REJ': { 'title': 'مرفوض', 'class': 'label-danger' },
        'RESUB': { 'title': 'استئناف', 'class': ' label-light-warning' },
        'DEL': { 'title': 'تم الحذف', 'class': ' label-light-warning' },
        'Removed': { 'title': 'إزالة', 'class': ' label-light-warning' }
    };
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
                        url: CallURL + "/getallprocessedcontracts",
                        method: 'POST',
                        headers: {
                            "AccessToken": getTokenFromSessionStorage()
                        },
                        params: {

                            ServerGridCall: true,
                            UserId: sessionStorage.getItem("userId"),
                            CompanyId: CompanyId,
                            Crn: CRN,
                            Arn: ARN,
                            SearchDateStart: SearchDateStart,
                            SearchDateEnd: SearchDateEnd,
                            SearchAssetNumber: SearchAssetNumber,
                            SearchStatusId: SearchStatusId,
                            SearchContractNumber: SearchContractNumber,
                            ProductType: Producttype,
                            SearchPurpose: SearchPurpose
                        },
                        timeout: 100000,//getGridTimeoutInMS(),
                        map: function (raw) {
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
                serverFiltering: true,
                serverSorting: true,
            },
            layout: {
                scroll: true
            },
            // column sorting
            sortable: true,
            pagination: true,
            columns: [
                {
                    field: langId == 0 ? 'purposeCode' : 'purposeCodeAr',
                    title: getGridTitle("manualcheck_purpose"),
                    sortable: false,
                },
                {
                    field: 'contractNumber',
                    title: getGridTitle("manualcheck_contractnumber"),
                    sortable: false,

                },                
                {
                    field: langId == 0 ? 'productType' : 'productTypeAr',
                    title: getGridTitle("manualcheck_producttype"),
                    sortable: false,
                },
                {
                    field: 'crn',
                    title: getGridTitle("manualcheck_crn"),
                    sortable: false,
                },
                {
                    field: 'arn',
                    title: getGridTitle("manualcheck_arn"),
                    sortable: false,
                },
                {
                    field: 'modifiedDate',
                    title: getGridTitle("manualcheck_modifieddate"),
                    type: 'date',
                    template: function (row) {
                        
                        if (row.modifiedDate) {
                            var date = new Date(row.modifiedDate);
                            var month = date.getMonth() + 1;
                            return month + "/" + date.getDate() + "/" + date.getFullYear() + " " + date.getHours() + ":" + date.getMinutes();
                        }
                        return "";
                    }
                },
                {
                    field: 'createdDate',
                    title: getGridTitle("manualcheck_createddate"),
                    type: 'date',
                    template: function (row) {

                        if (row.createdDate) {
                            var date = new Date(row.createdDate);
                            var month = date.getMonth() + 1;
                            return month + "/" + date.getDate() + "/" + date.getFullYear() + " " + date.getHours() + ":" + date.getMinutes();
                        }
                        return "";
                    }
                },
                {
                    field: 'contractStatus',
                    title: getGridTitle("Status"),
                    sortable: false,

                    template: function (row) {
                        var status = langId == 0 ? statusEn : statusAr;
                        return '<span class="label font-weight-bold label-lg ' + status[row.contractStatus].class + ' label-inline mr-5 py-5 px-5" style="cursor: pointer;">' + status[row.contractStatus].title + '</span>';
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
                <a href="javascript:;" class="btn btn-sm btn-secondary btn-icon mr-0" data-toggle="dropdown">\
                    <span class="svg-icon svg-icon-md">\
                        <i class="ki ki-bold-more-ver"></i>\
                    </span>\
                </a>\
                <div class="dropdown-menu dropdown-menu-sm dropdown-menu-right">\
                    <ul class="navi flex-column navi-hover py-2">' +
                            (row.contractStatus == "REJ" ?
                                '<li class="navi-item">\
                                        <a onclick="viewContractDetails(' + row.contractId + ',' + row.customerId + ',' + row.assetId + ',' + row.contractAssetId + ',' + row.statusId + ',' + "'" + row.contractStatus + "'" + ',' + "'" + row.fileId + "'" + ',' + "'" + row.fileDataId + "'" + ',' + "'" + row.contractNumber + "'" + ')" class="navi-link">\
                                            <span class="navi-text">'+ getGridTitle("manualcheck_viewdetails") + '</span>\
                                        </a>\
                                        <a  onclick=doRedirection("'+ row.contractId + '","ViewRejectionErrorDetails") class="navi-link">\
                                                                        <span class="navi-text">'+ getGridTitle("autoValidation_viewerrors") + '</span>\
                                                                    </a>\
                                    </li>'
                                : '') +
                            ((row.purposeCode == "Repossess" || row.purposeCode == "Enforcement" || row.purposeCode == "Realestate Repossess" || row.purposeCode == "Real Estate Repossess") ?
                                '<li class="navi-item">\
                            <a  onclick=doRedirection("'+ row.contractId + '","ViewDocument") class="navi-link">\
                                <span class="navi-text">'+ getGridTitle("manualcheck_viewdocuments") + '</span>\
                            </a>\
                        </li>\
                        ' : "");
                        if (row.ContractStatus != 'PEN') { // Assuming 1 represents "Pending"
                            actionsHtml += '\
                        <li class="navi-item">\
	                        <a onclick = doRedirectionToCertificate("'+ row.contractId + '","' + row.customerId + '","' + row.assetId + '","' + row.contractAssetId + '","' + row.statusId + '","Certificate") class="navi-link" >\
	                                            <span class="navi-text">'+ getGridTitle("manualcheck_viewcertificate") + '</span>\
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

function CreateContract() {
    PostRedirect("CreateContract", 0)
}

function doRedirection(val, mode) {
    ;
    debugger
    switch (mode) {
        case "View":
            document.forms['ViewContractDetailsById']['FileId'].value = val;
            PostRedirect("ViewContractDetailsById", val);
            break;
        case "ViewError":
            document.forms['ViewErrorDetailsById']['FileId'].value = val;
            PostRedirect("ViewErrorDetailsById", val);
            break;
        case "ViewDocument":
            document.forms['GetSupportingDocument']['ContractId'].value = val;
            PostRedirect("GetSupportingDocument", val);
            break;
        case "ViewRejectionErrorDetails":
            document.forms['ViewRejectionByContractId']['ContractId'].value = val;
            PostRedirect("ViewRejectionByContractId", val);
        case "DownloadFailedRows":
            
            downloadFailedRows(val);
            break;

    }
}

                                                                                                                                                                                                                                                                                                                    function viewContractDetails(contract, customer, asset, contractasset, statusId, status, fileId, FileDataId, ContractNumber) {
                                                                                                                                                                                                                                                                                                                        document.forms['ViewContractDetails']['ContractId'].value = contract;
                                                                                                                                                                                                                                                                                                                        document.forms['ViewContractDetails']['CustomerId'].value = customer;
                                                                                                                                                                                                                                                                                                                        document.forms['ViewContractDetails']['AssetId'].value = asset;
                                                                                                                                                                                                                                                                                                                        document.forms['ViewContractDetails']['ContractAssetId'].value = contractasset;
                                                                                                                                                                                                                                                                                                                        document.forms['ViewContractDetails']['StatusId'].value = statusId;
                                                                                                                                                                                                                                                                                                                        document.forms['ViewContractDetails']['ContractStatus'].value = status;
                                                                                                                                                                                                                                                                                                                        document.forms['ViewContractDetails']['FileId'].value = fileId;
                                                                                                                                                                                                                                                                                                                        document.forms['ViewContractDetails']['FileDataId'].value = FileDataId;
                                                                                                                                                                                                                                                                                                                        document.forms['ViewContractDetails']['ContractNumber'].value = ContractNumber;
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
    commonFetch(setupURL, requestOptions, function (data) {
        if (data != undefined && data != null) {
            $("#divLoader").hide();

            $("#fileTypeId").on("mouseover", function () {
                $(this).css("cursor", "pointer");
            });

            $("#fileTypeId").on("mouseout", function () {
                $(this).css("cursor", "default");
            });

            var labeling = $("<label class='mb-0'>")
                .attr("for", "fileTypeLabel")
                .css({
                    "font-weight": "bold",
                    "color": "#333",
                    "margin-left": "13px"
                })
                .text(getTranslation("Select File Type *"));

            $("#fileTypeLabel").append(labeling);
            $("#fileTypeId").html("");
            $("#fileTypeId").css("margin-top", "5px"); // Adjust the value (20px) as needed
            $("#fileTypeId").html(`<option value=''>${langId == 0 ? "Please Select" : "يرجى الاختيار"}</option>`);

            // Append new options
            for (var i = 0; i < data.length; i++) {
                if (data[i].setupCode != "TWQPLUS") {
                    var options = document.createElement("option");
                    //$("#fileTypeId").append("<option value='" + data[i].setupId + "'class='" + data[i].setupCode + "'>" + data[i].setupValue + "</option>");
                    options.value = data[i].setupId,
                        options.text = langId == 0 ? data[i].setupValue : data[i].shortDescriptionAr,
                        options.setAttribute("code", data[i].setupCode)
                    $("#fileTypeId").append(options);
                }                
            }
        } else {
            showSweetAlert('error', "Invalid Response", "")
        }
    });

}

function getAssociateCompanies() {

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
    commonFetch(setupURL, requestOptions, function (data) {
        if (data != undefined && data != null) {
            
            if (data.success) {
                $("#divLoader").hide();
                //associateCompanyTypeId
                $("#associateCompanyTypeId").on("mouseover", function () {
                    $(this).css("cursor", "pointer");
                });

                $("#associateCompanyTypeId").on("mouseout", function () {
                    $(this).css("cursor", "default");
                });

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
                $("#associateCompanyTypeId").html(`<option value='' id='all'>${langId == 0 ? "Select All" : "اختر الكل"}</option>`);

                // Append new options
                for (var i = 0; i < data.data.length; i++) {
                    var companyData = langId == 0 ? data.data[i].companyName : data.data[i].companyNameAr;
                     companyData =  (companyData == undefined ? "" : companyData);
                    $("#associateCompanyTypeId").append("<option value='" + data.data[i].companyId + "'>" + companyData + "</option>");
                }
            }
        } else {
            showSweetAlert('error', getTranslation("Invalid Response"), "")
        }
    });  
}

function createTermsAndConditions(containerId, data) {
    var headingdiv = $("<div>").addClass("form-group mb-0").css("display", "flex");
    var selectlang = $("<p>").attr("for", "TNCLabel").text("Select Language").css("text-align", "left");

    // Create a clickable text (link) for language toggle
    var languageLink = $("<a>")
        .attr("href", "#")
        .attr("id", "languageLink")
        .text("عربي")
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
        .prop("readonly", true)
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
    var label = $("<label class='mb-0' style='text-transform:unset;'>")
        .addClass("mb-0")
        .attr("for", `termsCheckbox_${containerId}`) // Use a unique ID for each label
        .css({
            "font-weight": "bold",
            "color": "#333",
            "margin-left": "6px"
        })
        .text(langId == 0 ? "I have read and accepted the terms and conditions" : "لقد قرأت وقبلت الشروط والأحكام");

    // Append the checkbox and label to the container
    checkboxContainer.append(checkbox, label);

    // Append the checkbox container to the specified container for checkboxes
    $(`#${containerId}Checkbox`).append(checkboxContainer);

    // Function to handle language change
    function toggleLanguage(containerId) {
        
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
   
}

function updateUploadButtonState(containerId) {
    
    var selectedAssetType = getSelectedAssetTypeCode();

    var associateCompanyDiv = document.getElementById("associateCompanyGroup").style.display;
    var checkboxChecked = $(`#termsCheckbox_TermAndConditionTwo`).prop("checked");
    var selectedOption = $("#fileTypeId").val();

    var contractfileUpload = $("#contractupload").get(0);
    var contractFiles = contractfileUpload.files;

    if (getSelectedFileTpyeCode() == "REPOF" || getSelectedFileTpyeCode() == "EF") {
        var supportfileUpload = $("#supportingdocumentsupload").get(0);
        var supportingFiles = supportfileUpload.files;
        if (checkboxChecked && contractFiles.length > 0 && supportingFiles.length > 0 && selectedOption != "") {
            $(`.uploadwithsuppdoc`).prop("disabled", false);

        }
        else {
            $(`.uploadwithsuppdoc`).prop("disabled", true);

        }

    }   
    else if (checkboxChecked && contractFiles.length > 0 && selectedOption != "") {

        var selectedData = $('#associateCompanyTypeId').select2('data');
        if (accessableAssetTypes.includes(selectedAssetType)) {
            if (associateCompanyDiv != "none" && selectedData.length > 0) {
                $(`#UploadeFileBtn_TermAndConditionTwo`).prop("disabled", false);
            }
            else if (getSelectedFileTpyeCode() != "REPOF") {
                $(`#UploadeFileBtn_TermAndConditionTwo`).prop("disabled", false);
            }
            else {
                $(`#UploadeFileBtn_TermAndConditionTwo`).prop("disabled", true);
            }
        }
        else {
            $(`#UploadeFileBtn_TermAndConditionTwo`).prop("disabled", false);
        }

    }
    else {
        if (associateCompanyDiv === "none") {
            $(`#UploadeFileBtn_TermAndConditionTwo`).prop("disabled", true);
        }
        else {
            var selectedAssociateCompanies = $('#associateCompanyTypeId').select2('data');
            if (selectedAssociateCompanies.length > 0) {
                $(`#UploadeFileBtn_TermAndConditionTwo`).prop("disabled", true);
            }
        }

    }
}

function createTermsAndConditionsSupport(containerId, data) {
    var headingdiv = $("<div>").addClass("form-group mb-0").css("display", "flex");
    var selectlang = $("<p>").attr("for", "TNCLabel").text("Select Language").css("text-align", "left");

    // Create a clickable text (link) for language toggle
    var languageLinkSupp = $("<a>")
        .attr("href", "#")
        .attr("id", "languageLinkSupp")
        .text("عربي")
        .css("margin-left", "10px")
        .click(function (event) {
            event.preventDefault(); // Prevent the default behavior of the link
            // Toggle between English and Arabic languages
            toggleLanguageSupp(containerId);
        });
    headingdiv.append(selectlang, languageLinkSupp);
    $(`#${containerId}`).append(headingdiv);

    // Create a new textarea element
    var textarea = $("<textarea>")
        .val(data.data.defaultParameterDescription)
        .prop("readonly", true)
        .addClass("form-control")
        .attr("rows", 5)
        .attr("id", `textareaDescriptionSupp_${containerId}`); // Use a unique ID for each textarea

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
            updateUploadButtonStateSupport(containerId);
        });

    // Create a label for the checkbox
    var label = $("<label class='mb-0' style='text-transform:unset;'>")
        .attr("for", `termsCheckbox_${containerId}`) // Use a unique ID for each label
        .css({
            "font-weight": "bold",
            "color": "#333",
            "margin-left": "6px"
        })
        .text(getTranslation("I have read and accepted the terms and conditions"));

    // Append the checkbox and label to the container
    checkboxContainer.append(checkbox, label);

    // Append the checkbox container to the specified container for checkboxes
    $(`#${containerId}Checkbox`).append(checkboxContainer);

    function toggleLanguageSupp(containerId) {
        ;
        // Get the current language text
        var currentLanguage = $("#languageLinkSupp").text();

        // Toggle between English and Arabic
        var newLanguage = currentLanguage === "عربي" ? "English" : "عربي";

        // Update the language text
        $("#languageLinkSupp").text(newLanguage);
        $(`#textareaDescription_${containerId}`).addClass("arz-l");
        // Update the textarea content based on the selected language
        if (newLanguage === "عربي") {
            $(`#textareaDescriptionSupp_${containerId}`).val(data.data.defaultParameterDescription);
            $(`#textareaDescription_${containerId}`).removeClass("arz-r");
            $(`#textareaDescriptionSupp_${containerId}`).addClass("arz-l");
        } else {
            $(`#textareaDescriptionSupp_${containerId}`).val(data.data.defaultParameterDescriptionAr);
            $(`#textareaDescriptionSupp_${containerId}`).removeClass("arz-l");
            $(`#textareaDescriptionSupp_${containerId}`).addClass("arz-r");
        }
    }

    function updateUploadButtonStateSupport(containerId) {


        var checkboxChecked = $(`#termsCheckbox_${containerId}`).prop("checked");
        var supportingfileUpload = $("#supportingdocumentsupload").get(0);
        var supportingfiles = supportingfileUpload.files;
        if (checkboxChecked && supportingfiles.length > 0) {

            $(`#UploadeFileBtn_${containerId}`).prop("disabled", false);
        } else {
            $(`#UploadeFileBtn_${containerId}`).prop("disabled", true);
        }
    }
}
// Usage for both TermAndConditionOne and TermAndConditionTwo
function getTNC() {
    ;
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
    commonFetch(setupURL, requestOptions, function (data) {
        if (data != undefined && data != null) {
            $("#divLoader").hide();

            // Create Terms and Conditions One
            createTermsAndConditions("TermAndConditionTwo", data);

            // Create Terms and Conditions Two
            createTermsAndConditionsSupport("TermAndConditionOne", data);
        } else {
            showSweetAlert('error', getTranslation("Invalid Response"), "")
        }
    });


}
function supportingDocUploadTACChecking() {
    var checkboxChecked = $(`#termsCheckbox_TermAndConditionOne`).prop("checked");
    var supportingfileUpload = $("#supportingdocsupload").get(0);
    var supportingfiles = supportingfileUpload.files;
    if (checkboxChecked && supportingfiles.length > 0) {

        $(`#withSuppFileUpload`).prop("disabled", false);
    } else {
        $(`#withSuppFileUpload`).prop("disabled", true);
    }
}

function supportingDocUploadTACCheck() {
    var checkboxChecked = $(`#termsCheckbox_TermAndConditionOne`).prop("checked");
    var supportingfileUpload = $("#supportingdocumentsupload").get(0);
    var supportingfiles = supportingfileUpload.files;
    if (checkboxChecked && supportingfiles.length > 0) {

        $(`#UploadeFileBtn_TermAndConditionOne`).prop("disabled", false);
    } else {
        $(`#UploadeFileBtn_TermAndConditionOne`).prop("disabled", true);
    }
}

function csvFileUploadTACCheck() {
    var checkboxChecked = $(`#termsCheckbox_TermAndConditionTwo`).prop("checked");
    var selectedOption = $("#fileTypeId").val();

    var supportingfileUpload = $("#contractupload").get(0);
    var supportingfiles = supportingfileUpload.files;
    if (checkboxChecked && supportingfiles.length > 0 && selectedOption != "") {

        $(`#UploadeFileBtn_TermAndConditionTwo`).prop("disabled", false);
    } else {
        $(`#UploadeFileBtn_TermAndConditionTwo`).prop("disabled", true);
    }
}


function ExportFailedCmFileDataById() {
    $("#divLoader").show();

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
            text: getTranslation("Please select one or more File Data before proceeding."),
            icon: "error",
            buttonsStyling: false,
            confirmButtonText: getTranslation("Ok, got it!"),
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
            // redirect: 'follow',
            body: JSON.stringify(selectedFileDataIds) // Send the JSON data as a plain string
        };
        commonFetch(CallURL + "/getfilerowsdatabyids", requestOptions, function (data) {
            if (data != undefined && data != null) {
                $("#divLoader").hide();

                if (result.success) {
                    window.location = BaseUrl + '/api/ContractManagement/ContractRegistration/' + result.dynamicData + '/downloadfile'; //'/api/ContractManagement/' + result.dynamicData + '/downloadInvalidFiles';
                }
                else {
                    Swal.fire({
                        text: getTranslation(result.message),
                        icon: "error",
                        buttonsStyling: false,
                        confirmButtonText: getTranslation("Ok, got it!"),
                        customClass: {
                            confirmButton: "btn font-weight-bold btn-light"
                        }
                    })
                }
            } else {
                showSweetAlert('error', getTranslation("Invalid Response"), "")
            }
        });

    }

}

function ExportProcessedRequestsById() {
    $("#divLoader").show();

    // Initialize an empty array to store the selected fileDataIds
    // Initialize an empty array to store the selected fileDataIds
    var selectedFileDataIds = [];

    // Use jQuery to select all checkboxes with the class 'select-row'
    var selectedCheckboxes = $('#ProcessContracts_datatable .select-row');

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
            text: getTranslation("Please select one or more File Data before proceeding."),
            icon: "error",
            buttonsStyling: false,
            confirmButtonText: getTranslation("Ok, got it!"),
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
            // redirect: 'follow',
            body: JSON.stringify(selectedFileDataIds) // Send the JSON data as a plain string
        };
        commonFetch(CallURL + "/getfilerowsdatabyids", requestOptions, function (data) {
            if (data != undefined && data != null) {
                $("#divLoader").hide();

                if (result.success) {
                    window.location = BaseUrl + '/api/ContractManagement/ContractRegistration/' + result.dynamicData + '/downloadfile'; //'/api/ContractManagement/' + result.dynamicData + '/downloadInvalidFiles';
                }
                else {
                    Swal.fire({
                        text: getTranslation(result.message),
                        icon: "error",
                        buttonsStyling: false,
                        confirmButtonText: getTranslation("Ok, got it!"),
                        customClass: {
                            confirmButton: "btn font-weight-bold btn-light"
                        }
                    })
                }
            } else {
                showSweetAlert('error', getTranslation("Invalid Response"), "")
            }
        });
        
    }

}

function hideAssociateCompany(isRepo) {
    isRepo ? document.getElementById("associateCompanyGroup").style.display = "none" : document.getElementById("associateCompanyGroup").style.display = "";
}

function showhideAssetTypes(fileTypeCode) {

    if (fileTypeCode != null && fileTypeCode != undefined) {
        if (allowedFileTypes.includes(fileTypeCode)) {
            $("#assetTypeGroup").show();
        }
        else {
            $("#assetTypeGroup").hide();
        }
    }
    else {
        $("#assetTypeGroup").hide();
    }
}

document.getElementById("fileTypeId").addEventListener("change", function () {
    
    var opt = document.getElementById("fileTypeId")
    var code = opt.selectedOptions[0].getAttribute("code");
    debugger
    showhideAssetTypes(code);

    if (code === "REPOF") {
        //$("#assetTypeGroup").show();
        $(".upl-file-two").show();
        $(".uploadwithsuppdoc").show();
        $(".only-File-Upload").hide();

        var dropzoneElements = document.querySelectorAll('.dropzone.dropzone-default');
        dropzoneElements.forEach(function (element) {
            element.style.width = '48%';
            element.style.minHeight = '192px';
            element.style.float = 'left';
            element.style.margin = '0 6px';
        });

        if (getSelectedAssetTypeCode() != null) {
            hideAssociateCompany(false);
        }
    }
    else if (code === "EF") {
        //$("#assetTypeGroup").show();
        $(".upl-file-two").show();
        $(".uploadwithsuppdoc").show();
        $(".only-File-Upload").hide();

        var dropzoneElements = document.querySelectorAll('.dropzone.dropzone-default');
        dropzoneElements.forEach(function (element) {
            element.style.width = '48%';
            element.style.minHeight = '192px';
            element.style.float = 'left';
            element.style.margin = '0 6px';
        });

        if (getSelectedAssetTypeCode() != null) {
            hideAssociateCompany(true);
        }
    }
    else {
        
        //$("#assetTypeGroup").hide();
        $(".upl-file-two").hide();
        $(".uploadwithsuppdoc").hide();
        $(".only-File-Upload").show();
        const ul = document.getElementById("supportingdocumentsList");
        ul.innerHTML = ""; // Clear the unordered list
        var dropzoneElements = document.querySelectorAll('.dropzone.dropzone-default');
        dropzoneElements.forEach(function (element) {
            element.style.width = '100%';
            element.style.minHeight = '192px';
            element.style.float = 'left';
            element.style.margin = '0 6px';
        });

        hideAssociateCompany(true);
      
    }

    updateUploadButtonState();
});

document.getElementById("assetType").addEventListener('change', function () {
    var code = getSelectedAssetTypeCode();
    if (accessableAssetTypes.includes(code)) {
        hideAssociateCompany(false);
    }
    else {
        hideAssociateCompany(true);
    }

    updateUploadButtonState();
});

//$('#associateCompanyTypeId').select2('data')

$('#associateCompanyTypeId').on('select2:select', function (e) {
    
    var data = e.params.data;
    if (data.value === 'all') {

    }
})

function downloadFailedRows(fileId) {
    var requestOptions = {
        method: 'GET',
        redirect: 'follow'
    };
    commonFetch(BaseUrl + '/api/ContractManagement/getfailedrowsdata?fileId=' + fileId, requestOptions, function (result) {
        if (result != null && result != undefined) {
            if (result.success) {
                var urlparams = new URLSearchParams();
                urlparams.append("filePath", result.data);
                window.location = BaseUrl + '/api/Download/Get?' + urlparams;

                //window.location = BaseUrl + '/api/ContractManagement/ContractRegistration/' + result.data + '/downloadfile'; //'/api/ContractManagement/' + result.dynamicData + '/downloadInvalidFiles';
            }
            else {
                debugger
                showSweetAlert('error', getTranslation("Failed"), getTranslation(result.message));
            }
        }
        else {
            showSweetAlert('error', getTranslation("Invalid Response"), "");
        }
    });
    var url = BaseUrl + "/api/";
}

function getAssetTypes() {
    var url = BaseUrl + "/api/Setups/Asset Type/getdatabysetuptype";
    var requestOptions = {
        method: 'GET',
        headers: new Headers(),
        redirect: 'follow'
    };
    commonFetch(url, requestOptions, function (data) {
        if (data != null && data != undefined) {
            
            $("#assetType").on("mouseover", function () {
                $(this).css("cursor", "pointer");
            });

            $("#assetType").on("mouseout", function () {
                $(this).css("cursor", "default");
            });

            var labeling = $("<label class='mb-0'>")
                .attr("for", "assetTypeLabel")
                .css({
                    "font-weight": "bold",
                    "color": "#333",
                    "margin-left": "13px",
                    "marging-top": "20px"
                })
                .text(getTranslation("select_asset_type"))

            $("#assetTypeLabel").append(labeling);
            $("#assetType").html("");
            $("#assetType").css("margin-top", "5px"); // Adjust the value (20px) as needed
            $("#assetType").html(`<option value=''>${langId == 0 ? "Please Select" : "يرجى الاختيار"}</option>`);

            // Append new options
            for (var i = 0; i < data.length; i++) {
                var options = document.createElement("option");
                //$("#fileTypeId").append("<option value='" + data[i].setupId + "'class='" + data[i].setupCode + "'>" + data[i].setupValue + "</option>");
                options.value = data[i].setupId,
                    options.text = langId == 0 ? data[i].shortDescription : data[i].shortDescriptionAr,
                    options.setAttribute("code", data[i].setupCode)
                $("#assetType").append(options);
            }
        }
        else {

        }
    })
}

function getAccessableAssetTypes() {
    var url = CallURL + "/getAccessableAssetTypes";
    var requestOptions = {
        method: 'GET',
        headers: new Headers(),
        redirect: 'follow'
    };

    commonFetch(url, requestOptions, function (data) {
        if (data != null && data != undefined) {
            if (data.success) {

                data.data.AllowedAssets.forEach(item => {
                    accessableAssetTypes.push(item);
                });

                data.data.AllowedFileTypes.forEach(item => {
                    allowedFileTypes.push(item);
                });
            }
        }
        else {
            showSweetAlert('error', getTranslation("Invalid Response"));
        }
    });
}

function getSelectedAssetTypeCode() {
    var opt = document.getElementById("assetType");
    var code = opt.selectedOptions[0].getAttribute("code");
    return code;
}

function getSelectedFileTpyeCode() {
    var opt = document.getElementById("fileTypeId");
    var code = opt.selectedOptions[0].getAttribute("code");
    return code;
}

document.getElementById("navUploadedFiles").addEventListener('click', function () {

    if (ktList.includes("#MESTRFiles_datatable")) {
        var index = ktList.indexOf("#MESTRFiles_datatable")
        ktList.splice(index, 1);

        $('#MESTRFiles_datatable').KTDatatable("destroy");
        isGridInitialized = false;

        getAllMESTRFiles();
        $('#filterModalBtn').hide();
    }
    else {
        getAllMESTRFiles();
    }
});

document.getElementById("navProcessedReq").addEventListener('click', function () {

    if (ktList.includes("#ProcessContracts_datatable")) {
        var index = ktList.indexOf("#ProcessContracts_datatable")
        ktList.splice(index, 1);

        $('#ProcessContracts_datatable').KTDatatable("destroy");
        getAllProcessedContracts();
        
    }
    else {
        getAllProcessedContracts();
    }
})

function GetProductType() {
    
    $("#divLoader").show();
    //var Factoring = "Purpose Code";
    CountryURL = BaseUrl + "/api/Setups/getdetailsbysetuptype";
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    // myHeaders.append("Authorization", "Bearer " + getTokenFromSessionStorage());

    var filterModel = {
        Id: null,
        Value: null,
        CheckList: ["Product Type","Purpose Code"]
    };
    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        redirect: 'follow',
        body: JSON.stringify(filterModel)
    };
    commonFetch(CountryURL, requestOptions, function (data) {

        if (data != undefined && data != null) {
            var Data = data.data;
            var ProductTypes = data.data.filter(x => x.setupType == "Product Type");
            var PurposeCode = data.data.filter(x => x.setupType == "Purpose Code");
            $("#divLoader").hide();
            
            //$("#ProductType").html("");
            //$("#ProductType").append("<option value=>Please Select</option>")
            //for (var i = 0; i < ProductTypes.length; i++) {

            //    $("#ProductType").append("<option value='" + ProductTypes[i].setupId + "'>" + ProductTypes[i].shortDescription + "</option>")
            //}

            $('#ProductType').html("");
            var pleaseSelectContractPur = (langId == 0) ? "Please Select" : "الرجاء التحديد";
            $("#ProductType").append("<option value=''>" + pleaseSelectContractPur + "</option>");
            for (var i = 0; i < ProductTypes.length; i++) {
                var shortDescription = (langId == 0) ? ProductTypes[i].shortDescription : ProductTypes[i].shortDescriptionAr;

                $("#ProductType").append("<option value='" + ProductTypes[i].setupId + "'>" + shortDescription + "</option>")
            }

            //$("#SearchPurpose").html("");
            //$("#SearchPurpose").append("<option value=>Please Select</option>")
            //for (var i = 0; i < PurposeCode.length; i++) {

            //    $("#SearchPurpose").append("<option value='" + PurposeCode[i].setupId + "'>" + PurposeCode[i].shortDescription + "</option>")
            //}

            $('#SearchPurpose').html("");
            var pleaseSelectContractPur = (langId == 0) ? "Please Select" : "الرجاء التحديد";
            $("#SearchPurpose").append("<option value=''>" + pleaseSelectContractPur + "</option>");
            for (var i = 0; i < PurposeCode.length; i++) {
                var shortDescription = (langId == 0) ? PurposeCode[i].shortDescription : PurposeCode[i].shortDescriptionAr;

                $("#SearchPurpose").append("<option value='" + PurposeCode[i].setupId + "'>" + shortDescription + "</option>")
            }
        }
        else {
            showSweetAlert('', langId == 0 ? "Invalid Response" : "استجابة غير صالحة", "")
        }
    });

}


function resumeProcess(fileID) {
    $("#divLoader").show();
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var resumeFileProcess = {
        fileID: fileID,
    };
    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        redirect: 'follow',
        body: JSON.stringify(resumeFileProcess)
    };
    commonFetch(ResumeProcessURL, requestOptions, function (data) {

        if (data != undefined && data != null) {
            if (data.success) {
                $("#UploadResumeSuccessModal").modal('show');
            }
        }
        else {
            showSweetAlert('', langId == 0 ? "Something went wrong" : "حدث خطأ ما", "")
        }
    });
}

