jQuery(document).ready(function () {
    debugger;

    $("#RegistrationDate").datepicker({
        autoclose: true,
    })
    var Id = document.getElementById("CompanyId").value;
    GetCompanyByID(Id);


});

function GetCompanyByID(Id) {
    $("#divLoader").show();

    CountryURL = BaseUrl + "/api/Admin/" + Id + "/getcompanyrepossessionbyid";
    redirectUrl = "/Admin/getcompanyrepossessionbyid";
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", "Bearer " + getTokenFromSessionStorage());


    var requestOptions = {
        method: 'GET',
        //params: {
        //    ServerGridCall: true,
        //    SetupID: document.getElementById("CompanyId").value,
        //},
        headers: myHeaders,

        redirect: 'follow'
    };

    //fetch(CountryURL + "/" + Id, requestOptions)

    commonFetch(CountryURL, requestOptions, function (data) {
        if (data != null && data != undefined) {
            var documents = data.documents;

            var fileList = document.getElementById("fileList");
            fileList.innerHTML = ""; // Clear existing content before appending new documents

            documents.forEach(function (documentData) {
                var listItem = document.createElement("li");
                var fileName = document.createElement("span");
                fileName.textContent = documentData.documentName; // Show only the document name

                // Add data attributes to store DocumentId and DocumentPath for reference
                listItem.setAttribute("data-documentId", documentData.documentId);
                listItem.setAttribute("data-documentPath", documentData.documentPath);

                listItem.style.display = "flex";
                listItem.style.alignItems = "center";
                listItem.style.justifyContent = "space-between"; // Pushes the button to the right

                var addButton = document.createElement("button");
                addButton.textContent = "Download";
                addButton.className = "btn btn-outline-secondary btn-sm";
                addButton.setAttribute("data-documentName", documentData.documentName);

                addButton.addEventListener("click", function (event) {
                    event.preventDefault(); // Prevent the default action of the button

                    var documentName = this.getAttribute("data-documentName");
                    //var downloadUrl = BaseUrl + '/api/ContractManagement/' + documentName + '/downloadcompanydocument';
                    var downloadUrl = BaseUrl + '/api/ContractManagement/RepossessionFile/' + documentName + '/downloadfile';

                    // Perform download logic, for example:
                    //window.location.href = downloadUrl;
                    downloadFile(documentName,downloadUrl);

                });

                listItem.appendChild(fileName);
                listItem.appendChild(addButton);
                fileList.appendChild(listItem);
            });

            $("#CountryId").html("");
            $("#CountryId").append("<option value=>Please Select</option>")
            for (var i = 0; i < data?.countries?.length; i++) {

                $("#CountryId").append("<option value='" + data?.countries[i]?.country_Id + "'>" + data?.countries[i]?.country_Name + "</option>")
            }



            $("#CompanyName").val(data?.companyName);
            $("#RegistrationNumber").val(data?.registrationNumber);

            $("#RegistrationDate").val(data?.registrationDate);
            $('#RegistrationDate').datepicker("update", new Date(data?.registrationDate));

            // $('#RegistrationDate').val(data?.registrationDate.split('T')[0]);


            $("#CompanyDetails").val(data?.companyDetails);
            $("#contactEmail").val(data?.contactEmail);
            $("#AddressLine1").val(data?.addressLine1);
            $("#AddressLine2").val(data?.addressLine2);
            $("#PostalCode").val(data?.postalCode);
            $("#WebsiteUrl").val(data?.websiteUrl);
            $("#CompanyCode").val(data?.companyCode);
            $("#ContactPerson").val(data?.contactPerson);
            $("#ContactPhone").val(data?.contactPhone);
            $("#ContactEmail").val(data?.contactEmail);
            $("#statusDropdown").val(data?.isActive);
            const submitBtn = document.getElementById('subimitbtn');

            // Check if isActive is 2, then disable the button
            if (data.isActive == 2) {
                submitBtn.disabled = true;
                submitBtn.classList.add('disabled');
            }

            const tagContainer = document.getElementById('tagContainer');
            data?.tags.forEach(tagText => {
                var newTag = document.createElement('tag');
                newTag.className = 'tagify__tag'; // Add required classes
                newTag.setAttribute('contenteditable', 'false');
                newTag.setAttribute('spellcheck', 'false');
                newTag.setAttribute('tabindex', '-1');
                newTag.setAttribute('value', tagText); // Set the value of the tag

                var removeBtn = document.createElement('x');
                removeBtn.title = '';
                removeBtn.className = 'tagify__tag__removeBtn';
                removeBtn.setAttribute('role', 'button');
                removeBtn.setAttribute('aria-label', 'remove tag');

                var tagTextContainer = document.createElement('div');
                var tagTextSpan = document.createElement('span');
                tagTextSpan.className = 'tagify__tag-text';
                tagTextSpan.textContent = tagText;

                tagTextContainer.appendChild(tagTextSpan);
                newTag.appendChild(removeBtn);
                newTag.appendChild(tagTextContainer);

                // Add a click event listener to the remove button
                removeBtn.addEventListener('click', function () {
                    // Remove the clicked tag when the remove button is clicked
                    tagContainer.removeChild(newTag);
                });

                // Append the new tag to the tags container
                tagContainer.appendChild(newTag);
            });

            // Assuming data is your response object
            var selectedCountryId = data?.countryId; // Assuming "CountryId" is the property in your data object

            // Set the selected value of the dropdown
            $("#CountryId").val(selectedCountryId);



            var selectedCompanyTypeId = data?.companyTypeId;
            $("#CompanyTypeId").val(selectedCompanyTypeId);
        }
        else {
            showSweetAlert('error', "Invalid Response", "");
        }
    });

    //fetch(CountryURL, requestOptions)
    //    .then(response => response.json())
    //    .then(data => {
    //        debugger
    //        $("#divLoader").hide();
    //        var documents = data.documents;

    //        var fileList = document.getElementById("fileList");
    //        fileList.innerHTML = ""; // Clear existing content before appending new documents

    //        documents.forEach(function (documentData) {
    //            var listItem = document.createElement("li");
    //            var fileName = document.createElement("span");
    //            fileName.textContent = documentData.documentName; // Show only the document name

    //            // Add data attributes to store DocumentId and DocumentPath for reference
    //            listItem.setAttribute("data-documentId", documentData.documentId);
    //            listItem.setAttribute("data-documentPath", documentData.documentPath);

    //            listItem.style.display = "flex";
    //            listItem.style.alignItems = "center";
    //            listItem.style.justifyContent = "space-between"; // Pushes the button to the right

    //            var addButton = document.createElement("button");
    //            addButton.textContent = "Download";
    //            addButton.className = "btn btn-outline-secondary btn-sm";
    //            addButton.setAttribute("data-documentName", documentData.documentName);

    //            addButton.addEventListener("click", function (event) {
    //                event.preventDefault(); // Prevent the default action of the button

    //                var documentName = this.getAttribute("data-documentName");
    //                //var downloadUrl = BaseUrl + '/api/ContractManagement/' + documentName + '/downloadcompanydocument';
    //                var downloadUrl = BaseUrl + '/api/ContractManagement/RepossessionFile/' + documentName + '/downloadfile';

    //                // Perform download logic, for example:
    //                window.location.href = downloadUrl;
    //            });

    //            listItem.appendChild(fileName);
    //            listItem.appendChild(addButton);
    //            fileList.appendChild(listItem);
    //        });

    //        $("#CountryId").html("");
    //        $("#CountryId").append("<option value=>Please Select</option>")
    //        for (var i = 0; i < data?.countries?.length; i++) {

    //            $("#CountryId").append("<option value='" + data?.countries[i]?.country_Id + "'>" + data?.countries[i]?.country_Name + "</option>")
    //        }



    //        $("#CompanyName").val(data?.companyName);
    //        $("#RegistrationNumber").val(data?.registrationNumber);

    //        $("#RegistrationDate").val(data?.registrationDate);
    //        $('#RegistrationDate').datepicker("update", new Date(data?.registrationDate));

    //        // $('#RegistrationDate').val(data?.registrationDate.split('T')[0]);


    //        $("#CompanyDetails").val(data?.companyDetails);
    //        $("#contactEmail").val(data?.contactEmail);
    //        $("#AddressLine1").val(data?.addressLine1);
    //        $("#AddressLine2").val(data?.addressLine2);
    //        $("#PostalCode").val(data?.postalCode);
    //        $("#WebsiteUrl").val(data?.websiteUrl);
    //        $("#CompanyCode").val(data?.companyCode);
    //        $("#ContactPerson").val(data?.contactPerson);
    //        $("#ContactPhone").val(data?.contactPhone);
    //        $("#ContactEmail").val(data?.contactEmail);
    //        $("#statusDropdown").val(data?.isActive);
    //        const submitBtn = document.getElementById('subimitbtn');

    //        // Check if isActive is 2, then disable the button
    //        if (data.isActive == 2) {
    //            submitBtn.disabled = true;
    //            submitBtn.classList.add('disabled'); 
    //        }

    //        const tagContainer = document.getElementById('tagContainer');
    //        data?.tags.forEach(tagText => {
    //            var newTag = document.createElement('tag');
    //            newTag.className = 'tagify__tag'; // Add required classes
    //            newTag.setAttribute('contenteditable', 'false');
    //            newTag.setAttribute('spellcheck', 'false');
    //            newTag.setAttribute('tabindex', '-1');
    //            newTag.setAttribute('value', tagText); // Set the value of the tag

    //            var removeBtn = document.createElement('x');
    //            removeBtn.title = '';
    //            removeBtn.className = 'tagify__tag__removeBtn';
    //            removeBtn.setAttribute('role', 'button');
    //            removeBtn.setAttribute('aria-label', 'remove tag');

    //            var tagTextContainer = document.createElement('div');
    //            var tagTextSpan = document.createElement('span');
    //            tagTextSpan.className = 'tagify__tag-text';
    //            tagTextSpan.textContent = tagText;

    //            tagTextContainer.appendChild(tagTextSpan);
    //            newTag.appendChild(removeBtn);
    //            newTag.appendChild(tagTextContainer);

    //            // Add a click event listener to the remove button
    //            removeBtn.addEventListener('click', function () {
    //                // Remove the clicked tag when the remove button is clicked
    //                tagContainer.removeChild(newTag);
    //            });

    //            // Append the new tag to the tags container
    //            tagContainer.appendChild(newTag);
    //        });

    //        // Assuming data is your response object
    //        var selectedCountryId = data?.countryId; // Assuming "CountryId" is the property in your data object

    //        // Set the selected value of the dropdown
    //        $("#CountryId").val(selectedCountryId);



    //        var selectedCompanyTypeId = data?.companyTypeId;
    //        $("#CompanyTypeId").val(selectedCompanyTypeId);
    //    })
    //    .catch(error => console.log('error', error));

}

function EditCompany() {
    debugger
    $("#divLoader").show();

    CountryURL = BaseUrl + "/api/Admin/updatecompany";
    redirectUrl = "/Admin/updatecompany";
    var data = $('#EditCompany').serializeArray().reduce(function (obj, item) {
        obj[item.name] = item.value;
        return obj;
    }, {});

    data.RegistrationDate = moment(document.getElementById("RegistrationDate").value, 'DD/MM/YYYY').format('MM/DD/YYYY');
    

    var inputDateString = data.RegistrationDate;
    var parts = inputDateString.split('/');
    var isoFormattedDate = parts[2] + '-' + parts[0].padStart(2, '0') + '-' + parts[1].padStart(2, '0') + 'T00:00:00.000Z';
    data.RegistrationDate = isoFormattedDate;

    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var tagContainer = document.getElementById('tagContainer');
    var tags = tagContainer.querySelectorAll('.tagify__tag');
    var tagsArray = [];

    tags.forEach(function (tag) {
        tagsArray.push(tag.textContent.trim());
    });


    data.tags = tagsArray;
    data.CreatedBy = sessionStorage.getItem('userId');
    data.ModifiedBy = sessionStorage.getItem('userId');

    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        redirect: 'follow',
        body: JSON.stringify(data)
    };

    commonFetch(CountryURL, requestOptions, function (data) {
        if (data != null && data != undefined) {
            if (data.status == 0) {
                debugger

                $("th#CompanyNaming").empty().text($("#CompanyName").val());
                $('#setCompanyModal').modal({
                    backdrop: 'static'
                });

                //Swal.fire({
                //    text: "Created",
                //    icon: "success",
                //    buttonsStyling: false,
                //    confirmButtonText: "Ok, got it!",
                //    customClass: {
                //        confirmButton: "btn font-weight-bold btn-light"
                //    }
                //})

            }
            else {
                Swal.fire({
                    text: data.message,
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
    })

    //fetch(CountryURL, requestOptions)
    //    .then(response => response.json())
    //    .then(data => {
    //        debugger
    //        $("#divLoader").hide();
    //        if (data.status == 0) {
    //            debugger

    //            $("th#CompanyNaming").empty().append(document.getElementById("CompanyName").value);
    //            $('#setCompanyModal').modal({
    //                backdrop: 'static'
    //            });

    //            //Swal.fire({
    //            //    text: "Created",
    //            //    icon: "success",
    //            //    buttonsStyling: false,
    //            //    confirmButtonText: "Ok, got it!",
    //            //    customClass: {
    //            //        confirmButton: "btn font-weight-bold btn-light"
    //            //    }
    //            //})

    //        }
    //        else {
    //            Swal.fire({
    //                text: data.message,
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



//show success alert
function showSweetAlert(icon, title, text) {
    Swal.fire({
        icon: icon,
        title: title,
        text: text,
        //footer: '<a href="">Why do I have this issue?</a>'
    });

}