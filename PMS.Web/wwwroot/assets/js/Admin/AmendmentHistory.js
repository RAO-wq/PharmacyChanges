var URL = BaseUrl + "/api/AmendmentHistory";


function getInformation() {
    debugger
    $("#divLoader").show();

    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    // myHeaders.append("Authorization", "Bearer " + getTokenFromSessionStorage());
    debugger
    var stepCounter = 0;

    CRNNumber = document.getElementById("CRN_Number").value;
    CompanyID = sessionStorage.getItem('companyId');
    TenantID = sessionStorage.getItem('TenantId');
    CreatedBy = sessionStorage.getItem('userId');
    ModifiedBy = sessionStorage.getItem('userId');
    formData = { "CRNNumber": CRNNumber, "CompanyID": parseInt(CompanyID), "TenantID": parseInt(TenantID), "CreatedBy": CreatedBy, "ModifiedBy": ModifiedBy };


    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        redirect: 'follow',
        body: JSON.stringify(formData)
    };

    fetch(URL + "/contractAmendmentHistory", requestOptions)
        .then(response => response.json())
        .then(result => {
            $("#divLoader").hide();
            if (result.success) {
                debugger
                console.log(result.data)
                const data = result.data;
                var history = data.contractHistory;
                $('#myTab').empty();
                for (var i = 0; i < history.length; i++) {
                    stepCounter++;
                    const timestamp = history[i].createdDate;
                    const dateObj = new Date(timestamp);

                    // Extract the components
                    const year = dateObj.getFullYear();
                    const month = dateObj.getMonth() + 1; // Months are zero-based, so we add 1
                    const day = dateObj.getDate();
                    if (stepCounter == 1) { var addclass = "active" } else { addclass = "" }
                    // Create a formatted date string (dd-mm-yyyy)
                    const formattedDate = `${day}-${month}-${year}`;
                    var stepHtml = `<li class="nav-item">'\
                        <a class="nav-link ${addclass}" id="home-tab" data-toggle="tab" onclick = getContractDetails(${history[i].contractID})  role = "tab" aria - controls="one" aria - selected="true" >\
                        <div class="tb-nv-hd">\
                        <p class="tb-nv-count mb-0">${stepCounter}</p>\
                        <div>\
                        <h5>${history[i].contractPurpose}</h5>\
                        <span> Date: ${formattedDate}</span>\
                        </div>\
                        </div>\
                        </a>\
                        </li>\
                        `;
                    $('#myTab').append(stepHtml);

                }




                var dynamicContent = document.getElementById("dynamicContent");
                data.contractDetails.forEach(function (section) {
                    var sectionDiv = document.createElement("div");

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
                        a.textContent = tab.tabName;
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

                        var tabFieldsDiv = document.createElement("div");
                        tabFieldsDiv.className = "row";

                        tab.children.forEach(function (field) {
                            if (field.isActive == 1) {
                                var colDiv = document.createElement("div");
                                colDiv.className = "col-md-4 col-sm-12";

                                var formGroup = document.createElement("div");
                                formGroup.className = "form-group";

                                var label = document.createElement("label");
                                label.textContent = field.entityName.replace('_', ' ');

                                var span = document.createElement("span");
                                span.className = "text-ar-sm";
                                span.textContent = field.entityNameAr;
                                label.appendChild(span);
                                if (field.entityTypeName === "Drop Down") {
                                    var select = document.createElement("select");
                                    select.className = "form-control";

                                    field.valueList.forEach(function (option) {
                                        var optionElement = document.createElement("option");
                                        optionElement.value = option.setupCode;
                                        optionElement.textContent = option.setupValue;
                                        select.appendChild(optionElement);
                                        if (option.setupCode == field.value) {
                                            optionElement.selected = true; // Set the option as selected if it matches the desired value
                                        }
                                    });

                                    var fieldName = field.entityName;
                                    select.setAttribute("data-field-name", fieldName);
                                    select.setAttribute("disabled", "disabled");

                                    formGroup.appendChild(label);
                                    formGroup.appendChild(select);
                                }
                                else {
                                    var input = document.createElement("input");
                                    input.type = "text";
                                    input.className = "form-control";
                                    input.placeholder = field.placeholder || "";
                                    input.value = field.value;

                                    var fieldName = field.entityName;
                                    input.setAttribute("data-field-name", fieldName);
                                    input.setAttribute("readonly", "readonly");

                                    formGroup.appendChild(label);
                                    formGroup.appendChild(input);
                                }

                                colDiv.appendChild(formGroup);
                                tabFieldsDiv.appendChild(colDiv);

                                // Add the field data to the array

                            }
                        });

                        tabPane.appendChild(tabFieldsDiv);
                        tabContentDiv.appendChild(tabPane);
                    });
                    dynamicContent.appendChild(tabContentDiv);

                });
            }
            else {
                $('#myTab').empty();
                $('#dynamicContent').empty();

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

        })
        .catch(error => console.log('error', error));

}




function getContractDetails(contractId) {
    debugger
    $("#divLoader").show();

    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    // myHeaders.append("Authorization", "Bearer " + getTokenFromSessionStorage());
    debugger
    var stepCounter = 0;
    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        redirect: 'follow'
    };

    fetch(URL + "/" + contractId + "/ContractDetails", requestOptions)
        .then(response => response.json())
        .then(result => {
            $("#divLoader").hide();
            if (result.success) {
                debugger
                console.log(result.data)
                const data = result.data;

                var dynamicContent = document.getElementById("dynamicContent");
                dynamicContent.innerHTML = "";
                data.forEach(function (section) {
                    var sectionDiv = document.createElement("div");

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
                        a.textContent = tab.tabName;
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

                        var tabFieldsDiv = document.createElement("div");
                        tabFieldsDiv.className = "row";

                        tab.children.forEach(function (field) {
                            if (field.isActive == 1) {
                                var colDiv = document.createElement("div");
                                colDiv.className = "col-md-4 col-sm-12";

                                var formGroup = document.createElement("div");
                                formGroup.className = "form-group";

                                var label = document.createElement("label");
                                label.textContent = field.entityName.replace('_', ' ');

                                var span = document.createElement("span");
                                span.className = "text-ar-sm";
                                span.textContent = field.entityNameAr;
                                label.appendChild(span);
                                if (field.entityTypeName === "Drop Down") {
                                    var select = document.createElement("select");
                                    select.className = "form-control";

                                    field.valueList.forEach(function (option) {
                                        var optionElement = document.createElement("option");
                                        optionElement.value = option.setupCode;
                                        optionElement.textContent = option.setupValue;
                                        select.appendChild(optionElement);
                                        if (option.setupCode == field.value) {
                                            optionElement.selected = true; // Set the option as selected if it matches the desired value
                                        }
                                    });

                                    var fieldName = field.entityName;
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

                                    var fieldName = field.entityName;
                                    input.setAttribute("data-field-name", fieldName);

                                    formGroup.appendChild(label);
                                    formGroup.appendChild(input);
                                }

                                colDiv.appendChild(formGroup);
                                tabFieldsDiv.appendChild(colDiv);

                                // Add the field data to the array

                            }
                        });

                        tabPane.appendChild(tabFieldsDiv);
                        tabContentDiv.appendChild(tabPane);
                    });
                    dynamicContent.appendChild(tabContentDiv);

                });
            }

        })
        .catch(error => console.log('error', error));

}