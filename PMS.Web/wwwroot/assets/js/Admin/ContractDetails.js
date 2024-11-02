var URL = BaseUrl + "/api/ContractManagement";
var fieldDataToStore = [];
var FieldRules = [];
var ContractId = "";
var CustomerId = "";
var AssetId = "";
var ContractAssetId = "";
var ContractStatus = "";
var UserId = "";
var formData = "";
var ContractRejection = {};
let isReasonBinded = false;
var CMFileData = [];
var FileDataId = 0;
var select2Mapping = [];
var langId = "";
var accordionObjects = [];



jQuery(document).ready(function () {
    langId = localStorage.getItem('languageId');

    $("#approvalFooter").hide();
    FileDataId = document.getElementById("FileDataId").value;
    getContractManagmentProcessedEntities("CM_Contract", "Contract Detail");
    localized();

   // getContractManagmentEntities();
});

function getContractManagmentProcessedEntities(TableNaming, TabNaming) {
    debugger
    $("#divLoader").show();

    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    // myHeaders.append("Authorization", "Bearer " + getTokenFromSessionStorage());
    debugger

    ContractId = document.getElementById("ContractId").value;
    CustomerId = document.getElementById("CustomerId").value;
    AssetId = document.getElementById("AssetId").value;
    ContractAssetId = document.getElementById("ContractAssetId").value;
    StatusId = document.getElementById("StatusId").value;
    ContractStatus = document.getElementById("ContractStatus").value;
    UserID = sessionStorage.getItem('userId');
    TableName = TableNaming;
    TabName = TabNaming;
    formData = { "TableName": TableName, "TabName": TabName, "ContractId": parseInt(ContractId), "CustomerId": parseInt(CustomerId), "AssetId": parseInt(AssetId), "ContractAssetId": parseInt(ContractAssetId), "UserId": UserID };


    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        redirect: 'follow',
        body: JSON.stringify(formData)
    };

    commonFetch(URL + "/getProcessedContractManagmentEntitiesUpdated", requestOptions, function (result) {
        debugger
        if (result != null && result != undefined) {
            debugger
            if (result.success) {
                debugger
                console.log(result.data)

                var dynamicContent = document.getElementById("dynamicContent");
                result.data.forEach(function (section) {
                    var sectionDiv = document.createElement("div");
                    sectionDiv.className = "";

                    var ul = document.createElement("ul");
                    ul.className = "nav nav-tabs nav-tabs-line";
                    ul.id = "myTab";
                    ul.role = "tablist";

                    section.tabs.forEach(function (tab, index) {
                        var li = document.createElement("li");
                        li.className = "nav-item";

                        var a = document.createElement("a");
                        a.className = "nav-link" + (index === 0 ? " active" : "");
                        a.id = "tab-" + index;
                        a.setAttribute("data-toggle", "tab");
                        a.setAttribute("data-tab-physical-name", tab.tabPhysicalName);
                        a.href = "#tab-content-" + index;
                        a.role = "tab";
                        a.setAttribute("aria-controls", "tab-content-" + index);
                        a.setAttribute("aria-selected", index === 0 ? "true" : "false");
                        a.textContent = langId == 0 ? tab.tabName : tab.tabNameAr;

                        a.addEventListener("click", function () {
                            // Check if the content is already loaded
                            var tabContent = document.getElementById("tab-content-" + index);
                            if (!tabContent.hasAttribute("data-loaded")) {
                                // Call the getContractManagmentProcessedEntities method with the appropriate parameters
                                var TableNaming = tab.tabPhysicalName; // Assuming CM_ should be added as a prefix
                                var TabNaming = tab.tabName;
                                getContractManagmentProcessedEntitiesOnClick(TableNaming, TabNaming);

                                // Mark the content as loaded
                                tabContent.setAttribute("data-loaded", "true");
                            }
                        });


                        var div = document.createElement("div");
                        div.className = "tb-nv-hd";

                        a.appendChild(div);
                        li.appendChild(a);
                        ul.appendChild(li);
                    });

                    sectionDiv.appendChild(ul);
                    dynamicContent.appendChild(sectionDiv);

                    var tabContentDiv = document.createElement("div");
                    tabContentDiv.className = "tab-content mt-5";
                    tabContentDiv.id = "tab-content";

                    section.tabs.forEach(function (tab, index) {
                        var tabPane = document.createElement("div");
                        tabPane.className = "tab-pane fade" + (index === 0 ? " show active" : "");
                        tabPane.id = "tab-content-" + index;
                        tabPane.role = "tabpanel";
                        tabPane.setAttribute("aria-labelledby", "tab-" + index);
                        if (index == 0) {
                            tabPane.setAttribute("data-loaded", "true");

                            CMFileData = tab.allFileData;

                        }

                        var tabFieldsDiv = document.createElement("div");
                        tabFieldsDiv.className = "row";

                        if (tab.accordion != null && tab.accordion.length > 0) {
                            debugger
                            console.log(tab.accordion);
                            tab.accordion.forEach(function (accordion, indexer) {
                                var openAccordionIndex = null; // Variable to store the index of the currently open accordion

                                // Create a new row for each accordion
                                var accordionRow = document.createElement("div");
                                accordionRow.className = "accordion accordion-light accordion-toggle-arrow"; // Added the theme classes
                                accordionRow.id = "accordionExample" + indexer; // Set a unique ID for each accordion
                                accordionRow.className = "col-sm-12 mb-1";
                                // Set cursor to pointer
                                accordionRow.style.cursor = "pointer";

                                // Create accordion card
                                var accordionCard = document.createElement("div");
                                accordionCard.className = "card border-0";

                                // Create card header
                                var cardHeader = document.createElement("div");
                                cardHeader.className = "card-header";
                                cardHeader.setAttribute("id", "heading" + indexer); // Replace 'someUniqueIdentifier' with a unique identifier for each accordion

                                // Create button for toggling accordion
                                var toggleButton = document.createElement("div");
                                toggleButton.className = "card-title mb-0 d-flex justify-content-between pr-1";
                                toggleButton.setAttribute("data-toggle", "collapse");
                                toggleButton.setAttribute("data-target", "#collapse" + indexer);
                                debugger;
                                //toggleButton.textContent = accordion.children.find(x => x.entityPysicalName === "Asset_Number")?.value;
                               // toggleButton.textContent = indexer;
                                let sequenceNo = indexer + 1;
                                toggleButton.innerHTML = TabNaming == "Asset Detail" ?
                                    '<div class="col-md-6">ARN: ' + accordion.contractAssetDetails.find(x => x.entityPhysicalName == "ARN")?.value + '</div>' +
                                    '<div class="col-md-6 d-flex justify-content-between">Asset Type: '
                                    + accordion.children.find(x => x.entityPhysicalName == "Asset_Type_Id").valueList.find(y => y.setupID == accordion.children.find(x => x.entityPhysicalName == "Asset_Type_Id")?.value).setupValue || '' 
                                    + '<i class="fas fa-angle-down"></i></div>'
                                    :
                                    '<div class="col-md-6">' + TabNaming + " - " + sequenceNo + '</div>' +
                                    '<div class="col-md-6"></div>' +
                                    '<i class="fas fa-angle-down"></i>';

                                var AssetId = accordion.cM_Data;


                                cardHeader.appendChild(toggleButton);

                                // Create card body
                                var cardBody = document.createElement("div");
                                cardBody.className = "collapse show"; // The accordion is initially shown, you can modify this based on your needs
                                cardBody.setAttribute("id", "collapse" + indexer); // Replace 'someUniqueIdentifier'

                                // Create card body content
                                var cardBodyContent = document.createElement("div");
                                cardBodyContent.className = "card-body row px-0";



                                accordion.children.forEach(function (field) {
                                    if (field.isActive == 1) {
                                        var colDiv = document.createElement("div");
                                        colDiv.className = "col-md-6 col-sm-12";

                                        var formGroup = document.createElement("div");
                                        formGroup.className = "form-group";

                                        var label = document.createElement("label");

                                        if (langId == 0) {
                                            label.textContent = field.entityName.replace('_', ' ');

                                        }
                                        else {
                                            var span = document.createElement("span");
                                            span.className = "text-ar-sm";
                                            span.textContent = field.entityNameAr;
                                            label.appendChild(span);

                                        }
                                        if (field.entityTypeName == "Drop Down") {
                                            var select = document.createElement("select");
                                            select.className = "form-control";
                                          
                                                select.disabled = true;
                                           
                                        var foundMatchingValue = false; // Flag to check if any value matches

                                        field.valueList.forEach(function (option) {

                                            var optionElement = document.createElement("option");
                                            optionElement.value = option.setupCode;
                                            optionElement.textContent = langId == 0 ? option.setupValue : option.shortDescription;

                                            select.appendChild(optionElement);
                                            if (option.setupID == field.value) {
                                                optionElement.selected = true;
                                                foundMatchingValue = true;// Set the option as selected if it matches the desired value
                                            }

                                            if (!foundMatchingValue) {
                                                select.selectedIndex = -1; // Set selectedIndex to -1 for no selection
                                                foundMatchingValue = false; // Update the flag
                                            }
                                        });

                                            var fieldName = field.entityPhysicalName;
                                            select.setAttribute("data-field-name", fieldName + "-" + AssetId);

                                            formGroup.appendChild(label);
                                            formGroup.appendChild(select);
                                        }
                                        else {
                                            var input = document.createElement("input");
                                            input.type = "text";
                                            input.className = "form-control";
                                            input.placeholder = field.placeholder || "";
                                            input.value = field.value;
                                            
                                                input.disabled = true;
                                          

                                            var fieldName = field.entityPhysicalName;
                                            input.setAttribute("data-field-name", fieldName + "-" + AssetId);

                                            formGroup.appendChild(label);
                                            formGroup.appendChild(input);
                                        }

                                        colDiv.appendChild(formGroup);
                                        tabFieldsDiv.appendChild(colDiv);

                                        // Add the field data to the array
                                        fieldDataToStore.push({ name: field.entityName, value: field.value == null ? "" : field.value.toString() });

                                    }
                                    // Append the created form group to card body content
                                    cardBodyContent.appendChild(colDiv);
                                });

                                cardBody.appendChild(cardBodyContent);

                                // Append card header and body to accordion card
                                accordionCard.appendChild(cardHeader);
                                accordionCard.appendChild(cardBody);

                                // Append accordion card to the row
                                accordionRow.appendChild(accordionCard);

                                // Append the row to the container
                                tabFieldsDiv.appendChild(accordionRow);
                            });
                        }
                        else {
                            if (tab.tabName == TabNaming) {
                                tab.children.forEach(function (field) {
                                    if (field.isActive == 1) {
                                        var colDiv = document.createElement("div");
                                        colDiv.className = "col-md-6 col-sm-12";

                                        var formGroup = document.createElement("div");
                                        formGroup.className = "form-group";

                                        var label = document.createElement("label");

                                        if (langId == 0) {
                                            label.textContent = field.entityName.replace('_', ' ');

                                        }
                                        else {
                                            var span = document.createElement("span");
                                            span.className = "text-ar-sm";
                                            span.textContent = field.entityNameAr;
                                            label.appendChild(span);

                                        }
                                        if (field.entityTypeName == "Drop Down") {
                                            var select = document.createElement("select");
                                            select.className = "form-control";
                                           
                                                select.disabled = true;
                                           
                                            var foundMatchingValue = false;
                                            field.valueList.forEach(function (option) {

                                                var optionElement = document.createElement("option");
                                                optionElement.value = option.setupCode;
                                                optionElement.textContent = langId == 0 ? option.setupValue : option.shortDescription;

                                                select.appendChild(optionElement);
                                                if (option.setupID == field.value) {
                                                    optionElement.selected = true;
                                                    foundMatchingValue = true;// Set the option as selected if it matches the desired value
                                                }

                                                if (!foundMatchingValue) {
                                                    select.selectedIndex = -1; // Set selectedIndex to -1 for no selection
                                                    foundMatchingValue = false; // Update the flag
                                                }
                                            });

                                            var fieldName = field.entityPhysicalName;

                                            select.setAttribute("data-field-name", fieldName);
                                            select.setAttribute("data-field-name", fieldName + "-" + AssetId);
                                            formGroup.appendChild(label);
                                            formGroup.appendChild(select);
                                        }
                                        else {
                                            var input = document.createElement("input");
                                            input.type = "text";
                                            input.className = "form-control";
                                            input.placeholder = field.placeholder || "";
                                            input.value = field.value;
                                           
                                                input.disabled = true;
                                           

                                            var fieldName = field.entityPhysicalName;
                                            input.setAttribute("data-field-name", fieldName);

                                            formGroup.appendChild(label);
                                            formGroup.appendChild(input);
                                        }

                                        colDiv.appendChild(formGroup);
                                        tabFieldsDiv.appendChild(colDiv);

                                        // Add the field data to the array
                                        fieldDataToStore.push({ name: field.entityName, value: field.value == null ? "" : field.value.toString() });

                                    }
                                });
                            }

                        }
                        tabPane.appendChild(tabFieldsDiv);
                        tabContentDiv.appendChild(tabPane);
                    });


                    var footerDiv = document.createElement("div");

                    var footerDiv = document.createElement("div");

                    if (ContractStatus == 'REJ') {
                        document.getElementById('updateAgain').remove();
                        document.getElementById("doneBtn").classList.add("w-100");

                        var approveButton = document.createElement("button");
                        approveButton.textContent = getGridTitle("ReSubmit"); // "ReSubmit";
                        approveButton.className = "btn btn-primary  font-weight-bold px-10 mr-5"; // Add any relevant CSS classes here
                        approveButton.id = "approveButton"; // Optionally, add an ID for easy identification
                        approveButton.style.display = 'none';

                        var cancelButton = document.createElement("button");
                        cancelButton.textContent = getGridTitle("Cancel"); // "Cancel";
                        cancelButton.className = "btn btn-danger font-weight-bold px-10"; // Add any relevant CSS classes here
                        cancelButton.id = "rejectButton";
                        cancelButton.style.display = 'none';


                        approveButton.addEventListener("click", function () {
                            ReSubmitContractConfirmation();
                        });


                        cancelButton.addEventListener("click", function () {
                            CancelContractView();
                            // Handle the "Reject" button click event here
                            // You can define the logic for rejection action.
                        });


                        footerDiv.className = "card-footer d-flex justify-content-end"; // Add any relevant CSS classes for your footer
                        footerDiv.appendChild(approveButton);
                        footerDiv.appendChild(cancelButton);
                        //tabContentDiv.appendChild(footerDiv);

                        approveButton.style.display = 'block';
                        cancelButton.style.display = 'block';
                    }
                    //if (StatusId == 1) {
                    //    approveButton.style.display = 'block';
                    //    rejectButton.style.display = 'block';
                    //}

                    var footerContent = document.getElementById("footerContent");
                    dynamicContent.appendChild(tabContentDiv);
                    footerContent.appendChild(footerDiv);
                });

                GetErrorDescriptionForEntities(FileDataId);

                if (ContractStatus == 'REJ') {
                    GetRejectionReason();
                }
                else {
                    ShowContractStatus();
                }

                convertDropdownsToSelect2();

            }
        }
        else {
            showSweetAlert('error', "Invalid Response", "");
        }
    });
}



function CancelContractView() {
    var url = "/ContractManagement/ContractDashboard";
    window.location.replace(url);
}

function getContractManagmentProcessedEntitiesOnClick(TableNaming, TabNaming) {
    debugger
    $("#divLoader").show();

    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    debugger

    ContractId = document.getElementById("ContractId").value;
    CustomerId = document.getElementById("CustomerId").value;
    AssetId = document.getElementById("AssetId").value;
    ContractAssetId = document.getElementById("ContractAssetId").value;
    StatusId = document.getElementById("StatusId").value;
    ContractStatus = document.getElementById("ContractStatus").value;
    UserID = sessionStorage.getItem('userId');
    TableName = TableNaming;
    TabName = TabNaming;
    formData = { "TableName": TableName, "TabName": TabName, "ContractId": parseInt(ContractId), "CustomerId": parseInt(CustomerId), "AssetId": parseInt(AssetId), "ContractAssetId": parseInt(ContractAssetId), "UserId": UserID };


    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        redirect: 'follow',
        body: JSON.stringify(formData)
    };

    commonFetch(URL + "/getProcessedContractManagmentEntitiesUpdated", requestOptions, function (result) {
        if (result != null && result != undefined) {
            if (result.success) {
                debugger
                console.log(result.data);
                var dynamicContent = document.getElementById("dynamicContent");
                result.data.forEach(function (section) {

                    section.tabs.forEach(function (tab, index) {

                        var tabPaneId = "tab-content-" + index;
                        var tabPane = document.getElementById(tabPaneId);

                        var tabsContainer = document.getElementById("myTab");
                        var tabPanes = document.querySelectorAll('.tab-pane');

                        tabsContainer.addEventListener('shown.bs.tab', function (event) {
                            var activeTab = event.target; // active tab
                            var activeIndex = Array.from(tabsContainer.children).indexOf(activeTab.parentElement); // index of active tab
                            GetErrorDescriptionForEntities(param["File_Data_Id"])

                            // Show the corresponding tab content
                            tabPanes.forEach(function (tabPane, index) {
                                tabPane.classList.toggle("show", index === activeIndex);
                                tabPane.classList.toggle("active", index === activeIndex);
                            });
                        });

                        var tabFieldsDiv = document.createElement("div");
                        tabFieldsDiv.className = "row";

                        if (tab.accordion != null && tab.accordion.length > 0) {
                            debugger
                            console.log(tab.accordion);
                            tab.accordion.forEach(function (accordion, indexer) {
                                var openAccordionIndex = null; // Variable to store the index of the currently open accordion
                                var AssetId = accordion.cM_Data;

                                // Create a new row for each accordion
                                var accordionRow = document.createElement("div");
                                accordionRow.className = "accordion accordion-light accordion-toggle-arrow"; // Added the theme classes
                                accordionRow.id = "accordionExample" + indexer; // Set a unique ID for each accordion
                                accordionRow.className = "col-sm-12 mb-1";

                                // Set cursor to pointer
                                //accordionRow.style.cursor = "pointer";
                                //accordionRow.setAttribute("data-toggle", "collapse");
                                //accordionRow.setAttribute("data-target", "#collapse" + indexer);
                                // Create accordion card
                                var accordionCard = document.createElement("div");
                                accordionCard.className = "card border-0";

                                // Create card header
                                var cardHeader = document.createElement("div");
                                cardHeader.className = "card-header py-0  px-0";
                                cardHeader.setAttribute("id", "heading" + indexer); // Replace 'someUniqueIdentifier' with a unique identifier for each accordion

                                // Create button for toggling accordion
                                var toggleButton = document.createElement("div");
                                toggleButton.className = "card-title py-5 mb-0 d-flex justify-content-between";
                                toggleButton.setAttribute("data-toggle", "collapse");
                                toggleButton.setAttribute("data-target", "#collapse" + indexer);
                                toggleButton.style = "cursor:pointer";
                                debugger;
                                //toggleButton.textContent = accordion.children.find(x => x.entityPysicalName === "Asset_Number")?.value;
                               // toggleButton.innerHTML = TabNaming + " - " + indexer + '<i class="fas fa-angle-down"></i>';
                                let sequenceNumber = indexer + 1;
                                console.log(accordion);
                                let valueList = accordion?.children?.find(x => x.entityPhysicalName == "Asset_Type_Id")?.valueList;
                                let value = accordion?.children?.find(x => x.entityPhysicalName == "Asset_Type_Id")?.value;
                                let ApplicantTypeIdvalue = accordion?.children?.find(x => x.entityPhysicalName == "Applicant_Type_Id")?.value;
                                let ApplicantTypeIdList = accordion?.children?.find(x => x.entityPhysicalName == "Applicant_Type_Id")?.valueList;
                                let ARNValue = accordion?.children?.find(x => x.entityPhysicalName == "ARN")?.value == undefined ? '' : accordion?.children?.find(x => x.entityPhysicalName == "ARN")?.value
                                let IDNumberValue = accordion?.children?.find(x => x.entityPhysicalName == "ID_Number")?.value == undefined ? '' : accordion?.children?.find(x => x.entityPhysicalName == "ID_Number")?.value

                                toggleButton.innerHTML = TabNaming == "Asset Detail" ?
                                    '<div class="col-md-6">' + ARNValue + '</div>' +
                                    '<div class="col-md-6 d-flex justify-content-between">Asset Type: ' + (valueList?.filter(x => x.setupID == value)[0]?.setupValue || '') + '<i class="fas fa-angle-down"></i></div>'
                                    :
                                    '<div class="col-md-6">' + TabNaming + " - " + sequenceNumber + '</div>' +
                                    '<div class="col-md-6"></div>' +
                                    '<i class="fas fa-angle-down"></i>';



                                cardHeader.appendChild(toggleButton);


                                // Create card body
                                var cardBody = document.createElement("div");
                                cardBody.className = "collapse"; // The accordion is initially shown, you can modify this based on your needs
                                cardBody.setAttribute("id", "collapse" + indexer); // Replace 'someUniqueIdentifier'

                                // Create card body content
                                var cardBodyContent = document.createElement("div");
                                cardBodyContent.className = "card-body row px-0";



                                accordion.children.forEach(function (field) {
                                    if (field.isActive == 1) {
                                        var colDiv = document.createElement("div");
                                        colDiv.className = "col-md-6 col-sm-12";

                                        var formGroup = document.createElement("div");
                                        formGroup.className = "form-group";

                                        var label = document.createElement("label");

                                        if (langId == 0) {
                                            label.textContent = field.entityName.replace('_', ' ');

                                        }
                                        else {
                                            var span = document.createElement("span");
                                            span.className = "text-ar-sm";
                                            span.textContent = field.entityNameAr;
                                            label.appendChild(span);

                                        }
                                        if (field.entityTypeName == "Drop Down") {
                                            var select = document.createElement("select");
                                            select.className = "form-control";
                                          
                                                select.disabled = true;
                                           
                                            var foundMatchingValue = false; // Flag to check if any value matches

                                            field.valueList.forEach(function (option) {

                                                var optionElement = document.createElement("option");
                                                optionElement.value = option.setupCode;
                                                optionElement.textContent = langId == 0 ? option.setupValue : option.shortDescription;

                                                select.appendChild(optionElement);
                                                if (option.setupID == field.value) {
                                                    optionElement.selected = true;
                                                    foundMatchingValue = true;// Set the option as selected if it matches the desired value
                                                }

                                                if (!foundMatchingValue) {
                                                    select.selectedIndex = -1; // Set selectedIndex to -1 for no selection
                                                    foundMatchingValue = false; // Update the flag
                                                }
                                            });

                                            var fieldName = field.entityPhysicalName;
                                            select.setAttribute("data-field-name", fieldName + "-" + AssetId);


                                            formGroup.appendChild(label);
                                            formGroup.appendChild(select);
                                        }
                                        else {
                                            var input = document.createElement("input");
                                            input.type = "text";
                                            input.className = "form-control";
                                            input.placeholder = field.placeholder || "";
                                            input.value = field.value;
                                           
                                                input.disabled = true;
                                          

                                            var fieldName = field.entityPhysicalName;
                                            input.setAttribute("data-field-name", fieldName + "-" + AssetId);


                                            formGroup.appendChild(label);
                                            formGroup.appendChild(input);
                                        }

                                        colDiv.appendChild(formGroup);
                                        tabFieldsDiv.appendChild(colDiv);

                                        // Add the field data to the array
                                        fieldDataToStore.push({ name: field.entityName, value: field.value == null ? "" : field.value.toString() });
                                        // Append the created form group to card body content
                                        cardBodyContent.appendChild(colDiv);
                                    }

                                });

                                cardBody.appendChild(cardBodyContent);

                                // Append card header and body to accordion card
                                accordionCard.appendChild(cardHeader);
                                accordionCard.appendChild(cardBody);

                                // Append accordion card to the row
                                accordionRow.appendChild(accordionCard);

                                // Append the row to the container
                                tabFieldsDiv.appendChild(accordionRow);


                            });


                            tab.accordion.forEach(function (accordion) {
                                var tabAssetID = accordion.cM_Data;
                                GetErrorDescriptionForEntities(tabAssetID);

                            })

                        }
                        else {
                            if (tab.tabName == TabNaming) {
                                tab.children.forEach(function (field) {
                                    if (field.isActive == 1) {
                                        var colDiv = document.createElement("div");
                                        colDiv.className = "col-md-6 col-sm-12";

                                        var formGroup = document.createElement("div");
                                        formGroup.className = "form-group";

                                        var label = document.createElement("label");

                                        if (langId == 0) {
                                            label.textContent = field.entityName.replace('_', ' ');

                                        }
                                        else {
                                            var span = document.createElement("span");
                                            span.className = "text-ar-sm";
                                            span.textContent = field.entityNameAr;
                                            label.appendChild(span);

                                        }
                                        if (field.entityTypeName == "Drop Down") {
                                            var select = document.createElement("select");
                                            select.className = "form-control";
                                           
                                                select.disabled = true;
                                           
                                            var foundMatchingValue = false; // Flag to check if any value matches

                                            field.valueList.forEach(function (option) {

                                                var optionElement = document.createElement("option");
                                                optionElement.value = option.setupCode;
                                                optionElement.textContent = langId == 0 ? option.setupValue : option.shortDescription;

                                                select.appendChild(optionElement);
                                                if (option.setupID == field.value) {
                                                    optionElement.selected = true;
                                                    foundMatchingValue = true;// Set the option as selected if it matches the desired value
                                                }

                                                if (!foundMatchingValue) {
                                                    select.selectedIndex = -1; // Set selectedIndex to -1 for no selection
                                                    foundMatchingValue = false; // Update the flag
                                                }
                                            });

                                            

                                            var fieldName = field.entityPhysicalName;
                                            select.setAttribute("data-field-name", fieldName);

                                            formGroup.appendChild(label);
                                            formGroup.appendChild(select);
                                        }
                                        else {
                                            var input = document.createElement("input");
                                            input.type = "text";
                                            input.className = "form-control";
                                            input.placeholder = field.placeholder || "";
                                            input.value = field.value;
                                           
                                                input.disabled = true;
                                          

                                            var fieldName = field.entityPhysicalName;
                                            input.setAttribute("data-field-name", fieldName);

                                            formGroup.appendChild(label);
                                            formGroup.appendChild(input);
                                        }

                                        colDiv.appendChild(formGroup);
                                        tabFieldsDiv.appendChild(colDiv);

                                        // Add the field data to the array
                                        fieldDataToStore.push({ name: field.entityName, value: field.value == null ? "" : field.value.toString() });

                                    }
                                });
                            }

                        }


                        tabPane.appendChild(tabFieldsDiv);
                        //tabContentDiv.appendChild(tabPane);
                    });
                    //if (ContractStatus == 'REJ') {
                    //    var approveButton = document.createElement("button");
                    //    approveButton.textContent = "ReSubmit";
                    //    approveButton.className = "btn btn-primary  font-weight-bold px-10 mr-5"; // Add any relevant CSS classes here
                    //    approveButton.id = "approveButton"; // Optionally, add an ID for easy identification
                    //    approveButton.style.display = 'none';

                    //    var rejectButton = document.createElement("button");
                    //    rejectButton.textContent = "Cancel";
                    //    rejectButton.className = "btn btn-danger font-weight-bold px-10"; // Add any relevant CSS classes here
                    //    rejectButton.id = "rejectButton";
                    //    rejectButton.style.display = 'none';

                    //    approveButton.addEventListener("click", function () {
                    //        ReSubmitContract();
                    //    });


                    //    rejectButton.addEventListener("click", function () {
                    //        RejectContract();
                    //        // Handle the "Reject" button click event here
                    //        // You can define the logic for rejection action.
                    //    });

                    //    var footerDiv = document.createElement("div");
                    //    footerDiv.className = "card-footer d-flex justify-content-end"; // Add any relevant CSS classes for your footer
                    //    footerDiv.appendChild(approveButton);
                    //    footerDiv.appendChild(rejectButton);
                    //    tabContentDiv.appendChild(footerDiv);
                    //    $("#approvalFooter").show();

                    //    approveButton.style.display = 'block';
                    //    rejectButton.style.display = 'block';
                    //}

                    // dynamicContent.appendChild(tabContentDiv);
                });
                if (ContractStatus == 'REJ') {
                    GetRejectionReason();
                }
            }

            convertDropdownsToSelect2();

            //$("#divLoader").hide();
        }
        else {
            showSweetAlert('error', getTranslation("Invalid Response"), "");
        }
    });
    
}


function GetRejectionReason() {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    // myHeaders.append("Authorization", "Bearer " + getTokenFromSessionStorage());
    var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow',
    };
    commonFetch(URL + "/" + ContractId + "/getContractRejectionReasonByContractId", requestOptions, function (errorResult) {
        if (errorResult != undefined && errorResult != null) {
            if (errorResult.success) {
                // Match error descriptions with view elements based on data attributes
                FieldRules = errorResult.data.rejectFeilds;
                //var statusComments = document.getElementById("contractStatus");
                //statusComments.textContent = errorResult.data.rejectionComments;
                highlightTabsByError(FieldRules);
                FieldRules.forEach(function (error) {
                    var fieldName = error.fieldName;
                    var activeTabContentSelector = '.tab-pane.active.show';
                    var activeTabContent = document.querySelector(activeTabContentSelector);


                    if (activeTabContent) {
                        // Find inputs only within the active tab content
                        // var fieldName = error.field_Name;
                        var selector = `input[data-field-name], select[data-field-name]`;
                        var inputs = activeTabContent.querySelectorAll(selector);

                        inputs.forEach(function (input) {
                            debugger
                            var inputfieldname = input.getAttribute("data-field-name");
                            // Check if the inputFieldName contains the "-" symbol
                            if (inputfieldname.includes("-")) {
                                // Split the data-field-name by "-" and take the first part
                                //inputfieldname = inputfieldname.split("-")[0];
                            }
                            if (!inputfieldname.includes("-") && fieldName.includes("-")) {
                                // Split the data-field-name by "-" and take the first part
                                fieldName = fieldName.split("-")[0];
                            }

                            // if (input.getAttribute("data-field-name").toLowerCase() === fieldName.toLowerCase()) {
                            if (inputfieldname.toLowerCase() === fieldName.toLowerCase()) {

                               

                                // Find the form group element for the input
                                if (input.nodeName === 'SELECT') {
                                    highlightSelect2DropDown(fieldName)
                                }
                                else {
                                    input.style.border = "1px solid red";
                                }

                                

                                var diving = document.createElement("div");

                                diving.classList.add("d-flex");
                                var icon = document.createElement("i");
                                icon.className = "fa fa-eye mr-2";
                                // icon.textContent = "Icon"; // You can replace this with the actual icon content
                                var inputfieldName = input.getAttribute("data-field-name");
                                var inputfieldId = input.getAttribute("data-icon-field-id"); // Extract field_Id
                                icon.setAttribute("data-icon-field-name", error.fieldName);
                                icon.setAttribute("data-icon-field-id", error.fieldId);

                                var paragraph = document.createElement("p");
                                paragraph.textContent = "Click To View Errors";

                                diving.appendChild(icon);
                                diving.appendChild(paragraph);
                                // Find the form group element for the input
                                var formGroup = input.closest(".form-group");
                                if (formGroup) {
                                    // Append the icon to the form group
                                    formGroup.appendChild(diving);
                                    //formGroup.appendChild(icon);
                                    //formGroup.appendChild(paragraph);
                                }

                                // Add a click event listener to the icon
                                //icon.addEventListener("click", function () {
                                //    // Extract field_Id
                                //    showModalWithData();
                                //});
                                diving.onclick = function (event) {
                                    event.stopPropagation(); // Stop event propagation to prevent the accordion from collapsing
                                    var field_Name = icon.getAttribute("data-icon-field-name");
                                    var field_Id = icon.getAttribute("data-icon-field-id");
                                    showModalWithData(field_Name, field_Id);
                                };
                                // Enable the input field
                                input.disabled = false;
                            }
                        });
                    }
                });

                if (isReasonBinded == false) {
                    debugger
                    isReasonBinded = true;
                    ShowContractErrorStatus(errorResult.data.rejectionComments)
                }
            }
        }
        else {
            showSweetAlert('',  getTranslation("Invalid Response"), "")
        }
    });
    //fetch(URL + "/" + ContractId + "/getContractRejectionReasonByContractId", requestOptions)
    //    .then(response => response.json())
    //    .then(errorResult => {
    //        $("#divLoader").hide();
    //        if (errorResult.success) {
    //            // Match error descriptions with view elements based on data attributes
    //            FieldRules = errorResult.data.rejectFeilds;
    //            //var statusComments = document.getElementById("contractStatus");
    //            //statusComments.textContent = errorResult.data.rejectionComments;

    //            FieldRules.forEach(function (error) {
    //                var fieldName = error.fieldName;
    //                var activeTabContentSelector = '.tab-pane.active.show';
    //                var activeTabContent = document.querySelector(activeTabContentSelector);


    //                if (activeTabContent) {
    //                    // Find inputs only within the active tab content
    //                   // var fieldName = error.field_Name;
    //                    var selector = `input[data-field-name]`;
    //                    var inputs = activeTabContent.querySelectorAll(selector);

    //                    inputs.forEach(function (input) {

    //                        var inputfieldname = input.getAttribute("data-field-name");
    //                        // Check if the inputFieldName contains the "-" symbol
    //                        //if (inputfieldname.includes("-")) {
    //                        //    // Split the data-field-name by "-" and take the first part
    //                        //    inputfieldname = inputfieldname.split("-")[0];
    //                        //}

    //                        // if (input.getAttribute("data-field-name").toLowerCase() === fieldName.toLowerCase()) {
    //                        if (inputfieldname.toLowerCase() === fieldName.toLowerCase()) {
    //                            // Find the form group element for the input
    //                            input.style.border = "1px solid red";

    //                            var diving = document.createElement("div");

    //                            diving.classList.add("d-flex");                                
    //                            var icon = document.createElement("i");
    //                            icon.className = "fa fa-eye mr-2";
    //                           // icon.textContent = "Icon"; // You can replace this with the actual icon content
    //                            var inputfieldName = input.getAttribute("data-field-name");
    //                            var inputfieldId = input.getAttribute("data-icon-field-id"); // Extract field_Id
    //                            icon.setAttribute("data-icon-field-name", error.fieldName);
    //                            icon.setAttribute("data-icon-field-id", error.fieldId);

    //                            var paragraph = document.createElement("p");
    //                            paragraph.textContent = "Click To View Errors";

    //                            diving.appendChild(icon);
    //                            diving.appendChild(paragraph);
    //                            // Find the form group element for the input
    //                            var formGroup = input.closest(".form-group");
    //                            if (formGroup) {
    //                                // Append the icon to the form group
    //                                formGroup.appendChild(diving);
    //                                //formGroup.appendChild(icon);
    //                                //formGroup.appendChild(paragraph);
    //                            }

    //                            // Add a click event listener to the icon
    //                            //icon.addEventListener("click", function () {
    //                            //    // Extract field_Id
    //                            //    showModalWithData();
    //                            //});
    //                            diving.onclick = function (event) {
    //                                event.stopPropagation(); // Stop event propagation to prevent the accordion from collapsing
    //                                var field_Name = icon.getAttribute("data-icon-field-name");
    //                                var field_Id = icon.getAttribute("data-icon-field-id");
    //                                showModalWithData(field_Name, field_Id);
    //                            };
    //                        }
    //                    });
    //                }
    //            });

    //            if (isReasonBinded == false) {
    //                debugger
    //                isReasonBinded = true;
    //                ShowContractErrorStatus(errorResult.data.rejectionComments)
    //            }
    //        }
    //    });

}

function highlightTabsByError(rejectedErrors) {
    var tabGroup = document.getElementById('myTab');
    rejectedErrors.forEach(function (x) {
        var tab = tabGroup.querySelector('[data-tab-physical-name=' + x.tabPhysicalName + ']');
        tab.style.backgroundColor = '#f72f3f';
        tab.style.color = 'white';
        tab.onmouseover = function (e) {
            e.srcElement.style.color = 'black';
        };
        tab.onmouseleave = function (e) {
            e.srcElement.style.color = 'white';
        }
    });
}


function stopPropagation(event) {
    // Stop event propagation to prevent the accordion from collapsing
    event.stopPropagation();
}

function GetErrorDescriptionForEntities(fileDataId) {
    debugger
    $("#divLoader").show();
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    //var FDataID = document.getElementById("FileDataId").value;
    var FDataID = document.getElementById("FileId").value;

    // myHeaders.append("Authorization", "Bearer " + getTokenFromSessionStorage());
    debugger
    var FetchErrorsDataToView = { "FileDataId": fileDataId, "TenantId": 0 };

    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        redirect: 'follow',
        body: JSON.stringify(FetchErrorsDataToView)
    };

    commonFetch(URL + "/geterrordescriptionforentities", requestOptions, function (errorResult) {
        if (errorResult != undefined && errorResult != null) {
            if (errorResult.success) {
                // Match error descriptions with view elements based on data attributes

                var activeTabContentSelector = '.tab-pane.active.show';
                var activeTabContent = document.querySelector(activeTabContentSelector);

                errorResult.data.forEach(function (error) {
                    if (error.alertTypeCode != "WRN") {
                        var fieldName = error.fieldValue;
                        var selector = `input[data-field-name], select[data-field-name]`;
                        var inputs = activeTabContent.querySelectorAll(selector);
                        if (inputs.length > 0) {
                            inputs.forEach(function (input) {
                                if (input.getAttribute("data-field-name").toLowerCase() === fieldName.toLowerCase()) {
                                    // Find the form group element for the input
                                    var formGroup = input.closest(".form-group");
                                    if (formGroup) {
                                        var status = {
                                            "ERR": { 'title': 'Error', 'class': 'red' },
                                            "WRN": { 'title': 'Warning', 'class': '#ffc107 ' },
                                            "INF": { 'title': 'Information', 'class': '#17a2b8' },
                                        };
                                        // Create a span for the error message
                                        var errorSpan = document.createElement("span");
                                        errorSpan.className = "error-message";
                                        errorSpan.textContent = error.errorDetails;
                                        errorSpan.style.color = status[error.alertTypeCode].class;

                                        input.style.border = "1px solid" + status[error.alertTypeCode].class;
                                        // Append the error message to the form group
                                        formGroup.appendChild(errorSpan);
                                        // You can adjust the border style as needed                                    
                                    }
                                }
                            });
                        }
                    }
                });
            }
        }
        else {
            showSweetAlert('', getTranslation("Invalid Response"), "")
        }
    });
    //fetch(URL + "/geterrordescriptionforentities", requestOptions)
    //    .then(response => response.json())
    //    .then(errorResult => {
    //        $("#divLoader").hide();
    //        if (errorResult.success) {
    //            // Match error descriptions with view elements based on data attributes

    //            var activeTabContentSelector = '.tab-pane.active.show';
    //            var activeTabContent = document.querySelector(activeTabContentSelector);

    //            errorResult.data.forEach(function (error) {
    //                var fieldName = error.fieldValue;
    //                var selector = `input[data-field-name], select[data-field-name]`;
    //                var inputs = activeTabContent.querySelectorAll(selector);
    //                if (inputs.length > 0) {
    //                    inputs.forEach(function (input) {
    //                        if (input.getAttribute("data-field-name").toLowerCase() === fieldName.toLowerCase()) {
    //                            // Find the form group element for the input
    //                            var formGroup = input.closest(".form-group");
    //                            if (formGroup) {
    //                                var status = {
    //                                    "ERR": { 'title': 'Error', 'class': 'red' },
    //                                    "WRN": { 'title': 'Warning', 'class': '#ffc107 ' },
    //                                    "INF": { 'title': 'Information', 'class': '#17a2b8' },
    //                                };
    //                                // Create a span for the error message
    //                                var errorSpan = document.createElement("span");
    //                                errorSpan.className = "error-message";
    //                                errorSpan.textContent = error.errorDetails;
    //                                errorSpan.style.color = status[error.alertTypeCode].class;

    //                                input.style.border = "1px solid" + status[error.alertTypeCode].class;
    //                                // Append the error message to the form group
    //                                formGroup.appendChild(errorSpan);
    //                                // You can adjust the border style as needed
    //                            }
    //                        }
    //                    });
    //                }
    //            });
    //        }
    //    });
}


function ApproveContract() {
    debugger
    
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    //myHeaders.append("Authorization", "Bearer " + getTokenFromSessionStorage());
    ContractId = document.getElementById("ContractId").value;
    CustomerId = document.getElementById("CustomerId").value;
    AssetId = document.getElementById("AssetId").value;
    ContractAssetId = document.getElementById("ContractAssetId").value;
    UserId = sessionStorage.getItem('userId');
    UserName = sessionStorage.getItem('userName');
    ContractStatus = 'APR';
    TenantId = 1;
    CompanyId = sessionStorage.getItem('companyId');

    formData = { "CompanyId": parseInt(CompanyId), "ContractId": parseInt(ContractId), "CustomerId": parseInt(CustomerId), "AssetId": parseInt(AssetId), "ContractAssetId": parseInt(ContractAssetId), "UserId": UserId, "ContractStatus": ContractStatus, "UserName": UserName, "TenantId": TenantId };
    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        redirect: 'follow',
        body: JSON.stringify(formData)
    };
    debugger;

    commonFetch(URL + "/ApproveContract", requestOptions, function (result) {
        if (result != undefined && result != null) {
            if (result.success) {
                // Handle the success response
                $('#ApproveContractSuccessModal').modal({
                    backdrop: 'static'
                });
            }
            else {
                Swal.fire({
                    title: 'Failed',
                    text: result.messgage,
                    icon: "error",
                    showDenyButton: false,
                    showCancelButton: false,
                    confirmButtonText: 'OK',

                })
            }
        }
        else {
            showSweetAlert('error', getTranslation("Invalid Response"), "");
        }
    })

    //fetch(URL + "/ApproveContract", requestOptions)
    //    .then(response => response.json())
    //    .then(result => {
    //        $("#divLoader").hide();
    //        debugger
    //        if (result.success) {
    //            // Handle the success response
    //            $('#ApproveContractSuccessModal').modal({
    //                backdrop: 'static'
    //            });
    //        }
    //        else {
    //            Swal.fire({
    //                title: 'Failed',
    //                text: result.messgage,
    //                icon: "error",
    //                showDenyButton: false,
    //                showCancelButton: false,
    //                confirmButtonText: 'OK',

    //            })
    //        }
    //    })
    //    .catch(error => {
    //        showSweetAlert('error', 'Faild', error);
    //    });
}

function showSweetAlert(icon, title, text) {
    Swal.fire({
        icon: icon,
        title: title,
        text: text,
        //footer: '<a href="">Why do I have this issue?</a>'
    });

}

var selectedCheckboxes = {};

// Event handler for checkbox clicks


function handleCheckboxClick(event) {
    //const checkbox = event.target;
    //const fieldId = checkbox.getAttribute("data-field-id");

    //if (checkbox.checked) {
    //    // If checkbox is checked, add it to the selectedCheckboxes object
    //    selectedCheckboxes[fieldId] = selectedCheckboxes[fieldId] || [];
    //    selectedCheckboxes[fieldId].push(checkbox.value);
    //} else {
    //    // If checkbox is unchecked, remove it from the selectedCheckboxes object
    //    if (selectedCheckboxes[fieldId]) {
    //        selectedCheckboxes[fieldId] = selectedCheckboxes[fieldId].filter(value => value !== checkbox.value);
    //    }
    //}
    const checkbox = event.target;
    const fieldId = checkbox.getAttribute("data-field-id");
    const fieldName = checkbox.getAttribute("data-field-name");
    const ruleId = checkbox.getAttribute("data-rule-id");
    const ruleText = checkbox.value;

    if (checkbox.checked) {
        // If checkbox is checked, add it to the selectedCheckboxes object
        if (!selectedCheckboxes[fieldId]) {
            selectedCheckboxes[fieldId] = {
                field_Id: fieldName,
                field_Name: fieldId,
                rules: [],
            };
        }
        selectedCheckboxes[fieldId].rules.push({ RuleId: ruleId, RuleErrorDescriptions: ruleText });
    } else {
        // If checkbox is unchecked, remove it from the selectedCheckboxes object
        if (selectedCheckboxes[fieldId]) {
            selectedCheckboxes[fieldId].rules = selectedCheckboxes[fieldId].rules.filter(
                rule => rule.rule_id !== ruleId
            );
            if (selectedCheckboxes[fieldId].rules.length === 0) {
                delete selectedCheckboxes[fieldId];
            }
        }
    }
}



function showModalWithData(name, id) {
    var rulesBody = document.getElementById("rulesbody");
    rulesBody.innerHTML = "";
   
    var Rules = FieldRules.filter(x => x.fieldName == name)[0].rejectionRulesError;

    if (Rules != undefined) {
        const fieldLabel = document.createElement("h4");
        var updatedName = name.split('-')[0];
        fieldLabel.textContent = langId == 0 ? ("Field Name: " + updatedName) : ("اسم الحقل:" + updatedName);
        rulesBody.appendChild(fieldLabel);

        const list = document.createElement("ul");
        Rules.forEach(function (rule) {
            
            const listItem = document.createElement("li");
            listItem.textContent = rule.ruleErrorDescriptions;
            list.appendChild(listItem);
        });

        rulesBody.appendChild(list);

    }
    
    $('#FieldErroDetails').modal('show');
}


function RejectContract() {
    //var modal = document.getElementById("RejectContract");
    var modalContent = document.getElementById("rejectrulesbody");

    // Clear the existing content in the modal
    modalContent.innerHTML = "";

    // Loop through selectedCheckboxes and create elements to display them
    for (const fieldId in selectedCheckboxes) {
        const selectedValues = selectedCheckboxes[fieldId].rules;

        if (selectedValues.length > 0) {
            const fieldLabel = document.createElement("h4");
            fieldLabel.textContent = "Field Name: " + fieldId;
            modalContent.appendChild(fieldLabel);

            const list = document.createElement("ul");

            for (const value of selectedValues) {
                const listItem = document.createElement("li");
                listItem.textContent = value.RuleErrorDescriptions;
                list.appendChild(listItem);
            }
            modalContent.appendChild(list);
        }
    }
    errorFields = [];
    for (const fieldName in selectedCheckboxes) {
        const errorFeilds = selectedCheckboxes[fieldName];
        errosObj = {};
        errosObj = {
            FieldName: errorFeilds.field_Name,
            FieldId: errorFeilds.field_Id,
            RejectionRulesError: errorFeilds.rules
        }
        errorFields.push(errosObj);
    }


    ContractId = document.getElementById("ContractId").value;
    CustomerId = document.getElementById("CustomerId").value;
    AssetId = document.getElementById("AssetId").value;
    ContractAssetId = document.getElementById("ContractAssetId").value;
    UserId = sessionStorage.getItem('userId');
    UserName = sessionStorage.getItem('userName');
    ContractStatus = 'REJ';
    TenantId = 1;
    Comments = document.getElementById("rejectionReason").value;
    ContractRejection =
    {
        "ContractId": parseInt(ContractId),
        "CustomerId": parseInt(CustomerId),
        "AssetId": parseInt(AssetId),
        "ContractAssetId": parseInt(ContractAssetId),
        "UserId": UserId,
        "ContractStatus": parseInt(ContractStatus),
        "UserName": UserName,
        "TenantId": TenantId,
        "Comments": Comments,
        "rejectionFieldRuleDetails": errorFields
    };
    ////(RejectContract);
    console.log(FetchFieldRules);
    $('#RejectContract').modal('show');
}


function RejectContractCall() {
    $('#RejectContract').modal('hide');
    debugger
    $("#divLoader").show();
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    //myHeaders.append("Authorization", "Bearer " + getTokenFromSessionStorage());
    ContractRejection.Comments = document.getElementById("rejectionReason").value;
    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        redirect: 'follow',
        body: JSON.stringify(ContractRejection)
    };
    debugger;
    commonFetch(URL + "/RejectContract", requestOptions, function (result) {
        if (result != undefined && result != null) {
            debugger
            if (result.success) {
                // Handle the success response
                $('#RejectContractSuccessModal').modal({
                    backdrop: 'static'
                });
            }
            else {
                Swal.fire({
                    title: 'Failed',
                    text: result.messgage,
                    icon: "error",
                    showDenyButton: false,
                    showCancelButton: false,
                    confirmButtonText: 'OK',

                })
            }
        }
        else {
            showSweetAlert('error', getTranslation("Invalid Response"), "");
        }
    })

    //fetch(URL + "/RejectContract", requestOptions)
    //    .then(response => response.json())
    //    .then(result => {
    //        $("#divLoader").hide();
    //        debugger
    //        if (result.success) {
    //            // Handle the success response
    //            $('#RejectContractSuccessModal').modal({
    //                backdrop: 'static'
    //            });
    //        }
    //        else {
    //            Swal.fire({
    //                title: 'Failed',
    //                text: result.messgage,
    //                icon: "error",
    //                showDenyButton: false,
    //                showCancelButton: false,
    //                confirmButtonText: 'OK',

    //            })
    //        }
    //    })
    //    .catch(error => {
    //        showSweetAlert('error', 'Faild', error);
    //    });
}


function ShowContractStatus() {

    // Mock status, you can replace this with the actual status logic in your application
    var ContractStatus = document.getElementById("ContractStatus").value;
    var status = ""; // Possible values: 'pending', 'approved', 'rejected'

    // Create the main alert container
    var alertContainer = document.createElement('div');
    alertContainer.classList.add('alert', 'alert-custom', 'alert-notice', 'fade', 'show');

    // Create the main status container
    var mainStatusContainer = document.createElement('div');
    mainStatusContainer.classList.add('main-status-container');

    // Create the alert icon
    var alertIcon = document.createElement('div');
    alertIcon.classList.add('alert-icon');
    var icon = document.createElement('i');

    // Dynamically set the background color based on the status
    if (ContractStatus === 'PEN') {
        alertContainer.classList.add('alert-light-warning'); // Yellow for pending
        icon.classList.add('flaticon-warning'); // Use warning icon for statusId 1
        status = "Pending ";
    } else if (ContractStatus === 'APR') {
        alertContainer.classList.add('alert-light-success'); // Green for approved
        icon.classList.add('flaticon-check-mark'); // Use check mark icon for statusId 2
        status = "Approved ";
    } else if (ContractStatus === 'REJ') {
        alertContainer.classList.add('alert-light-danger'); // Red for rejected
        icon.classList.add('flaticon-error'); // Use error icon for statusId 3
        status = "Rejected "+ " ";
    }


    alertIcon.appendChild(icon);
    mainStatusContainer.appendChild(alertIcon);
   
    // Create the supporting alert text
    var alertText = document.createElement('div');
    alertText.classList.add('alert-text');
    alertText.setAttribute('id', 'contractStatus');

    // Set supporting text based on the main status
    if (ContractStatus === 'PEN') {
        alertText.textContent = status + ": " + getTranslation("Contract is under review for approval");
    } else if (ContractStatus === 'APR') {
        alertText.textContent = status + ": " + getTranslation("Contract has been approved");
    } else if (ContractStatus === 'REJ') {
        alertText.textContent = status + ": " + getTranslation("Contract has been rejected by Tawtheeq");
    }

    // Append the main status container to the main alert container
    alertContainer.appendChild(mainStatusContainer);

    // Append the supporting alert text to the main alert container
    alertContainer.appendChild(alertText);

    var statusContainer = document.getElementById("ContractStatusMesssage");
    // Append the main alert container to the body of the document
    statusContainer.appendChild(alertContainer);
}


function ShowContractErrorStatus(errorMessage) {

    // Mock status, you can replace this with the actual status logic in your application
    var statusID = document.getElementById("StatusId").value;
    var status = ""; // Possible values: 'pending', 'approved', 'rejected'

    // Create the main alert container
    var alertContainer = document.createElement('div');
    alertContainer.classList.add('alert', 'alert-custom', 'alert-notice', 'fade', 'show');

    // Create the main status container
    var mainStatusContainer = document.createElement('div');
    mainStatusContainer.classList.add('main-status-container');

    // Create the alert icon
    var alertIcon = document.createElement('div');
    alertIcon.classList.add('alert-icon');
    var icon = document.createElement('i');

    alertContainer.classList.add('alert-light-danger'); // Red for rejected
    icon.classList.add('flaticon-error'); // Use error icon for statusId 3
    status = getTranslation("Rejected") + " :  "+ " ";

    alertIcon.appendChild(icon);
    mainStatusContainer.appendChild(alertIcon);

    // Create the main status text
    var mainStatusText = document.createElement('div');
    mainStatusText.classList.add('main-status-text');
    mainStatusText.textContent = status; // Display the main status text
    mainStatusContainer.appendChild(mainStatusText);

    // Create the supporting alert text
    var alertText = document.createElement('div');
    alertText.classList.add('alert-text');
    alertText.setAttribute('id', 'contractStatus');
    alertText.textContent = errorMessage; // Display the supporting text

    // Append the main status container to the main alert container
    alertContainer.appendChild(mainStatusContainer);

    // Append the supporting alert text to the main alert container
    alertContainer.appendChild(alertText);

    var statusContainer = document.getElementById("ContractStatusMesssage");
    // Append the main alert container to the body of the document
    statusContainer.appendChild(alertContainer);
}



function ReSubmitContractConfirmation() {
    $('#ReSubmitContractConfirmationModal').modal({
        backdrop: 'static'
    });
}


function ReSubmitContract() {
    $("#divLoader").show();
    debugger 
    var orignalData = CMFileData;
    //---- Multi Asset
    var fieldAssetDataJSONArray = [];
    var fieldFinanaceDataJSONArray = [];
    var fieldLesseDataJSONArray = [];


    // Select first and second tabs
    var firstTab = document.querySelector('#tab-content-0');
    // var secondTab = document.querySelector('#tab-content-1');

    // Create an object for the first tab
    var firstTabDataJSON = {};
    var firstTabInputElements = firstTab.querySelectorAll('input[data-field-name]');
    firstTabInputElements.forEach(function (inputElement) {
        var id = inputElement.getAttribute('data-field-name');
        var value = inputElement.value;
        firstTabDataJSON[id] = value;
    });

    var firstTabSelectElements = firstTab.querySelectorAll('select[data-field-name]');
    firstTabSelectElements.forEach(function (selectElement) {
        var id = selectElement.getAttribute('data-field-name');
        var selectedOption = selectElement.options[selectElement.selectedIndex];
        var value = selectedOption == undefined ? '' : selectedOption.value;
        firstTabDataJSON[id] = value;
    });

    // Create an object for the second tab
    //var secondTabDataJSON = {};
    //var secondTabInputElements = secondTab.querySelectorAll('input[data-field-name]');
    //secondTabInputElements.forEach(function (inputElement) {
    //    var id = inputElement.getAttribute('data-field-name');
    //    var value = inputElement.value;
    //    secondTabDataJSON[id] = value;
    //});

    //var secondTabSelectElements = secondTab.querySelectorAll('select[data-field-name]');
    //secondTabSelectElements.forEach(function (selectElement) {
    //    var id = selectElement.getAttribute('data-field-name');
    //    var selectedOption = selectElement.options[selectElement.selectedIndex];
    //    var value = selectedOption == undefined ? '' : selectedOption.value;
    //    secondTabDataJSON[id] = value;
    //});


    // Now iterate through the third tab's accordions
    var secondTab = document.querySelector('#tab-content-1');
    var thirdTab = document.querySelector('#tab-content-2');
    var forthTab = document.querySelector('#tab-content-3');

    var accordionLesseElements = secondTab.querySelectorAll('.card');
    var accordionElements = thirdTab.querySelectorAll('.card');
    var accordionForthElements = forthTab.querySelectorAll('.card');
    var accordionLesseDataJSON = {};
    var accordionDataJSON = {};
    var accordionDataJSON2 = {};



    accordionLesseElements.forEach(function (accordionLesseElement, accordionIndex) {
        // Create an object for each accordion
        accordionLesseDataJSON = {};

        // Select input and select elements within the accordion
        var accordionInputElements = accordionLesseElement.querySelectorAll('input[data-field-name]');
        accordionInputElements.forEach(function (inputElement) {
            var id = inputElement.getAttribute('data-field-name');
            var value = inputElement.value;
            accordionLesseDataJSON[id] = value;
        });

        var accordionSelectElements = accordionLesseElement.querySelectorAll('select[data-field-name]');
        accordionSelectElements.forEach(function (selectElement) {
            var id = selectElement.getAttribute('data-field-name');
            var selectedOption = selectElement.options[selectElement.selectedIndex];
            var value = selectedOption == undefined ? '' : selectedOption.value;
            accordionLesseDataJSON[id] = value;
        });

        fieldLesseDataJSONArray.push(accordionLesseDataJSON);

    });


    accordionElements.forEach(function (accordionElement, accordionIndex) {
        // Create an object for each accordion
        accordionDataJSON = {};

        // Select input and select elements within the accordion
        var accordionInputElements = accordionElement.querySelectorAll('input[data-field-name]');
        accordionInputElements.forEach(function (inputElement) {
            var id = inputElement.getAttribute('data-field-name');
            var value = inputElement.value;
            accordionDataJSON[id] = value;
        });

        var accordionSelectElements = accordionElement.querySelectorAll('select[data-field-name]');
        accordionSelectElements.forEach(function (selectElement) {
            var id = selectElement.getAttribute('data-field-name');
            var selectedOption = selectElement.options[selectElement.selectedIndex];
            var value = selectedOption == undefined ? '' : selectedOption.value;
            accordionDataJSON[id] = value;
        });

        fieldAssetDataJSONArray.push(accordionDataJSON);

    });

    for (let index = 0; index < accordionForthElements.length; index++) {
        accordionDataJSON2 = {};

        // Select input and select elements within the accordion
        var accordionInputElements = accordionForthElements[index].querySelectorAll('input[data-field-name]');
        accordionInputElements.forEach(function (inputElement) {
            var id = inputElement.getAttribute('data-field-name');
            var value = inputElement.value;
            accordionDataJSON2[id] = value;
        });

        var accordionSelectElements = accordionForthElements[index].querySelectorAll('select[data-field-name]');
        accordionSelectElements.forEach(function (selectElement) {
            var id = selectElement.getAttribute('data-field-name');
            var selectedOption = selectElement.options[selectElement.selectedIndex];
            var value = selectedOption == undefined ? '' : selectedOption.value;
            accordionDataJSON2[id] = value;
        });

        fieldFinanaceDataJSONArray.push(accordionDataJSON2);

    }



    orignalData.forEach(function (originalObject, index) {
        for (var key in firstTabDataJSON) {
           // var updatedKey = key.replace(/_[^_]*$/, '');
            var updatedKey = key;
            if (originalObject.hasOwnProperty(updatedKey)) {
                originalObject[updatedKey] = firstTabDataJSON[key];
            }
        }
    });
  
    if (fieldLesseDataJSONArray.length === 1) {
       //  Only one row in fieldLesseDataJSONArray, update all rows in originalData
        //orignalData.forEach(function (originalObject) {
        //    for (var key in fieldLesseDataJSONArray[0]) {
        //       // var updatedKey = key.replace(/_[^_]*$/, '');
        //        var updatedKey = key.replace(/-[^-]*$/, '');  // Change to replace the last dash instead of the last underscore

        //        if (originalObject.hasOwnProperty(updatedKey)) {
        //            originalObject[updatedKey] = fieldLesseDataJSONArray[0][key];
        //        }
        //    }
        //});

        orignalData.forEach(function (originalObject, index) {
            debugger;
            fieldLesseDataJSONArray.forEach(function (fieldLesse, index) {
                for (var key in fieldLesse) {
                    var splitKey = key.split('-');
                    if (splitKey.length < 2) continue;  // Skip if the key doesn't split into two parts
                    var baseKey = splitKey[0];
                    var fileDataId = splitKey[1];

                    // var updatedKey = key.replace(/_[^_]*$/, '');
                    var updatedKey = key.replace(/-[^-]*$/, '');  // Change to replace the last dash instead of the last underscore
                    if (originalObject.Prev_File_Data_Id == fileDataId) {
                        if (originalObject.hasOwnProperty(updatedKey)) {
                            originalObject[updatedKey] = fieldLesse[key];
                        }
                    }
                }
            });
        });


    }
    else if (fieldLesseDataJSONArray.length > 1) {
        //orignalData.forEach(function (originalObject, index) {
        //    var lesseData = fieldLesseDataJSONArray[index];
        //    for (var key in lesseData) {
        //        //var updatedKey = key.replace(/_[^_]*$/, '');
        //        var updatedKey = key.replace(/-[^-]*$/, '');  // Change to replace the last dash instead of the last underscore

        //        if (originalObject.hasOwnProperty(updatedKey)) {
        //            originalObject[updatedKey] = lesseData[key];
        //        }
        //    }
        //});


        orignalData.forEach(function (originalObject, index) {
            debugger;
            fieldLesseDataJSONArray.forEach(function (fieldLesse, index) {
                for (var key in fieldLesse) {
                    var splitKey = key.split('-');
                    if (splitKey.length < 2) continue;  // Skip if the key doesn't split into two parts
                    var baseKey = splitKey[0];
                    var fileDataId = splitKey[1];

                    // var updatedKey = key.replace(/_[^_]*$/, '');
                    var updatedKey = key.replace(/-[^-]*$/, '');  // Change to replace the last dash instead of the last underscore
                    if (originalObject.Prev_File_Data_Id == fileDataId) {
                        if (originalObject.hasOwnProperty(updatedKey)) {
                            originalObject[updatedKey] = fieldLesse[key];
                        }
                    }
                }
            });
        });
    }


    //orignalData.forEach(function (originalObject, index) {
    //    var assetData = fieldAssetDataJSONArray[index];
    //    for (var key in assetData) {
    //        //var updatedKey = key.replace(/_[^_]*$/, '');
    //        var updatedKey = key.replace(/-[^-]*$/, '');  // Change to replace the last dash instead of the last underscore

    //        if (originalObject.hasOwnProperty(updatedKey)) {
    //            originalObject[updatedKey] = assetData[key];
    //        }
    //    }
    //});

    orignalData.forEach(function (originalObject, index) {
        debugger;
        fieldAssetDataJSONArray.forEach(function (fieldAsset, index) {
            for (var key in fieldAsset) {
                var splitKey = key.split('-');
                if (splitKey.length < 2) continue;  // Skip if the key doesn't split into two parts
                var baseKey = splitKey[0];
                var fileDataId = splitKey[1];

                // var updatedKey = key.replace(/_[^_]*$/, '');
                var updatedKey = key.replace(/-[^-]*$/, '');  // Change to replace the last dash instead of the last underscore
                if (originalObject.Prev_File_Data_Id == fileDataId) {
                    if (originalObject.hasOwnProperty(updatedKey)) {
                        originalObject[updatedKey] = fieldAsset[key];
                    }
                }
            }
        });
    });

    //orignalData.forEach(function (originalObject, index) {
    //    var assetData = fieldFinanaceDataJSONArray[index];
    //    for (var key in assetData) {
    //        //var updatedKey = key.replace(/_[^_]*$/, '');
    //        var updatedKey = key.replace(/-[^-]*$/, '');  // Change to replace the last dash instead of the last underscore

    //        if (originalObject.hasOwnProperty(updatedKey)) {
    //            originalObject[updatedKey] = assetData[key];
    //        }
    //    }
    //});


    orignalData.forEach(function (originalObject, index) {
        fieldFinanaceDataJSONArray.forEach(function (fieldFinanace, index) {
            for (var key in fieldFinanace) {
                var splitKey = key.split('-');
                if (splitKey.length < 2) continue;  // Skip if the key doesn't split into two parts
                var baseKey = splitKey[0];
                var fileDataId = splitKey[1];
                // var updatedKey = key.replace(/_[^_]*$/, '');
                var updatedKey = key.replace(/-[^-]*$/, '');  // Change to replace the last dash instead of the last underscore
                if (originalObject.Prev_File_Data_Id == fileDataId) {
                    if (originalObject.hasOwnProperty(updatedKey)) {
                        originalObject[updatedKey] = fieldFinanace[key];
                    }
                }
            }
        });

    });

    console.log(orignalData)

    orignalData.forEach(function (ele, index) {
        ele["Prev_File_Data_Id"] = ele["File_Data_Id"];
        ele["Processed_Status_Id"] = 0;
        ele["Row_No"] = index++;

        delete ele["File_Data_Id"];
        delete ele["Processed_Status_Date"];
        delete ele["Return_File_Date"];
    })


    debugger
   // var fieldDataJSON = {};
    var fieldData = {};
    fieldData.FileName = "";   

    var FileId = document.getElementById("FileId").value;
    var FileDataId = document.getElementById("FileDataId").value;
    var Contract_Id = document.getElementById("ContractId").value;
    var IsReSubmit = true;
    fieldData.FileJSON = JSON.stringify(orignalData);   
    debugger;

    if (!fieldData.FileJSON || fieldData.FileJSON === "null" || fieldData.FileJSON.length === 0) {
        // Refresh the page
        location.reload();
    }
    else {
        debugger
        fieldData.Contract_Id = Contract_Id;
        fieldData.IsReSubmit = IsReSubmit;
        fieldData.File_Id = FileId;
        fieldData.Tenant_Id = sessionStorage.getItem('TenantId');
        fieldData.CompanyId = sessionStorage.getItem('companyId');
        fieldData.Processed_By = sessionStorage.getItem('userEmail');
        fieldData.UserIpAddress = sessionStorage.getItem('userIpAddress');
        fieldData.Processed_Status_Id = "0";
        fieldData.Prev_File_Data_Id = FileDataId;
        fieldData.File_Data_Id = FileDataId;
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        // myHeaders.append("Authorization", "Bearer " + getTokenFromSessionStorage());
        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            // redirect: 'follow',
            body: JSON.stringify(fieldData) // Send the JSON data as a plain string
        };

        commonFetch(URL + "/addorupdatecontractdetails", requestOptions, function (result) {
            if (result != undefined && result != null) {
                if (result.success) {
                    // Handle the success response
                    $('#UpdateContractSuccessModal').modal({
                        backdrop: 'static'
                    });
                }
                else {
                    Swal.fire({
                        icon: 'error',
                        title: getTranslation('Update Contract Details Failed!'),
                        confirmButtonText: getTranslation('OK'),
                    }).then((result) => {
                        if (result.isConfirmed) {
                            var url = "/ContractManagement/ContractDashboard";
                            window.location.replace(url);
                        }
                    });
                }
            }
            else {
                showSweetAlert('error', getTranslation("Invalid Response"), "");
            }
        })

    }

    
}

function convertDropdownsToSelect2() {
    var selectTags = document.getElementsByTagName('select');
    for (var i = 0; i < selectTags.length; i++) {
        $(selectTags[i]).select2();
    }
}

function highlightSelect2DropDown(dataFieldName) {
    $('select[data-field-name=' + dataFieldName +']').each(function () {
        var selectElement = $(this);
        var select2Container = selectElement.next('.select2-container');
        select2Container.css({ "border": "1px solid red" });
        select2Container.css({ "border-radius": "4px" });
    });
}