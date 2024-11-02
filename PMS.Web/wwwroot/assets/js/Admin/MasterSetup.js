let MasterURL = BaseUrl + "/api/setup/getsetupbyid";
let SaveMasterURL = BaseUrl + "/api/setup/savesetuptypes";
var SetupID;
var SetupTypeID;
var SetupType;
var OurData = [];
var LoadPricingPlanGrid;
var actionData;
var parentSetupId;
LoadPricingPlanGrid = function () {
	
	var datatable = $('#MasterSetup_datatable').KTDatatable({
		// datasource definition
		rows: {
			autoHide: false
		},
		data: {
			type: 'remote',
			source: {
				read: {
					url: MasterURL,
					method: 'GET',
					params: {
						ServerGridCall: false,
						SetupID: document.getElementById("setupname").value,
						ParentSetupId : document.getElementById("ParentSetupId").value,
					},
					headers: {
						'Content-Type': "Bearer your-token", // Replace with your authentication token
						'AccessToken': getTokenFromSessionStorage()
					},
					map: function (raw) {
						debugger
						actionData = setActionsForView();
						if (actionData.Addable) {
							document.getElementById('addBtn').style.display = 'flex';
						}

						OurData = raw.parentRecords;
						var dataset = raw.setups;
						if (typeof raw !== 'undefined') {
							dataset = raw.setups;
						}
						return dataset;
					}
					//,
					//error: function (xhr, textStatus, errorThrown) {
					//	``
						
					//	if (xhr.status === 401) {
					//		// Handle unauthorized response here
					//		//alert('Unauthorized: You do not have permission to access this resource.');
					//		$('#kt_content').html('<div class="err-scrn d-flex flex-row-fluid flex-column bgi-size-cover bgi-position-center bgi-no-repeat p-10 p-sm-30"><h1 class="font-weight-boldest text-dark-75 mt-15" style="font-size: 10rem">403</h1><h4>Access Denied</h4><p class="font-size-h3 text-muted font-weight-normal">You do not have permission to access this content</p></div>'); } else {
					//		// Handle other errors here
					//		console.error('An error occurred:', errorThrown);
					//	}
					//},
				},
			},
			pageSize: 10,
			serverPaging: true,
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
			input: $('#kt_datatable_search_query'),
		},

		// columns definition
		columns: [
			{
				field: 'setupCode',
				title: 'Code',
				searchable: true,

				// callback function support for column rendering
			},
			{
				field: 'setupValue',
				title: 'Value',
				searchable: true,

				// callback function support for column rendering
			},
			{
				field: 'shortDescription',
				title: 'Description',
				searchable: true,

				// callback function support for column rendering
			},
			{
				field: 'shortDescriptionAr',
				title: 'Arabic Description',
			    searchable: true,

			},			
			{
				field: 'modifiedDate',
				title: 'Modified Date',
				searchable: true,

				type: 'date',
				template: function (row) {
					row.modifiedDate = row.modifiedDate.split(" ")[0]
					//var date = new Date((row.modifiedDate.substring(0, 10)));
					var date = new Date(row.modifiedDate);
					var month = date.getMonth() + 1;
					return month + "/" + date.getDate() + "/" + date.getFullYear() + " " + date.getHours() + ":" + date.getMinutes();
				}
				// callback function support for column rendering
			},
			{
				field: 'isActive',
				title: 'Status',
				searchable: true,

				template: function (row) {
					if (row.isActive === 1) {
						return '<span class="label label-success label-dot mr-2"></span> Active';
					} else if (row.isActive === 2) {
						return '<span class="label label-danger label-dot mr-2"></span> InActive';
					} else if (row.isActive === 3) {
						return '<span class="label label-warning label-dot mr-2"></span> Delete';
					} else {
						return '<span class="label label-secondary label-dot mr-2"></span> Unknown';
					}
				}
			},			
			{
				field: 'Actions',
				title: 'Actions',
				sortable: false,
				width: 80,
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
                        <a onclick="EditOrViewSetupDetails(\'' + row.setupId + '\',\'View\')" class="navi-link">\
                            <span class="navi-text">View Details</span>\
                        </a>\
                    </li>' +
						(actionData.Editable == true ? '<li class="navi-item"><a onclick="EditOrViewSetupDetails(\'' + row.setupId + '\', \'Edit\')" class="navi-link"><span class="navi-text">Edit Details</span></a></li>' : '') +
						'</ul>\
					 </div>\
				</div>\
				';
				},

			}
		],
		  


	});
	
	//$('#kt_datatable_search_query').on('keyup', function () {
	//	datatable.search($(this).val().toLowerCase(), 'shortDescription');
	//});
};

jQuery(document).ready(function () {
	
	$("#detailsComponent").hide();
	
	SetupTypeID = document.getElementById("setupcode").value;
	SetupType = document.getElementById("setupname").value;
	ParentSetupId = document.getElementById("ParentSetupId").value;
	langId = localStorage.getItem('languageId');
	SetupType = getGridTitle(SetupType);
	
	var statusOptions = [
		{ Id: "1", Status: "Active" },
		{ Id: "2", Status: "Inactive" }
	];

	var $dropdown = $('#statusDropdown');

	$.each(statusOptions, function (index, option) {
		$dropdown.append($('<option>', {
			value: option.Id,
			text: option.Status
		}));
	});
	localized();
	LoadPricingPlanGrid();
});

function cancelAaction(){
	$("#detailsComponent").hide();
	$("#MasterSetup_datatable").show();
	$("#addBtn").show();
	$("#searchBox").show();
}

function EditOrViewSetupDetails(val, mode) {
	$("#divLoader").show();
	if (mode == 'View') {
		var SetupDetailsUrl = BaseUrl + "/api/setup/" + val + "/veiwsetupdetailsbyid";
		
		
	}
	if (mode == 'Edit') {
		var SetupDetailsUrl = BaseUrl + "/api/setup/" + val + "/editsetupdetailsbyid";
	}
	
	var myHeaders = new Headers();
	myHeaders.append("Content-Type", "application/json");
	myHeaders.append("Authorization", "Bearer " + getTokenFromSessionStorage());

	var requestOptions = {
		method: 'GET',
		headers: myHeaders,
		redirect: 'follow'
	};
	commonFetch(SetupDetailsUrl, requestOptions, function (data) {
		if (data != undefined || data != null) {
			debugger;
			document.getElementById("SetupCode").value = data[0].setupCode;
			document.getElementById("SetupValue").value = data[0].setupValue;
			document.getElementById("ShortDescription").value = data[0].shortDescription;
			document.getElementById("ShortDescriptionAr").value = data[0].shortDescriptionAr;
			document.getElementById("LongDescription").value = data[0].longDescription;
			document.getElementById("LongDescriptionAr").value = data[0].longDescriptionAr;
			document.getElementById("Details").value = data[0].details;
			document.getElementById("DetailsAr").value = data[0].detailsAr;
			document.getElementById("SetupId").value = data[0].setupId;
			document.getElementById("statusDropdown").value = data[0].isActive;
			
			parentSetupId = data[0].parentSetupId;

			actionType(mode);
		}
		else {
			showMasterSweetAlert('error', 'Invalid Response', '');
		}
	});

}

function Dropdown() {
	
	console.log(OurData);
	var parentDropdownContainer = document.getElementById("parentDropdownContainer");

	if (OurData.length > 0) {
		parentDropdownContainer.style.display = "block"; 
		var parentDropdown = document.getElementById("parentdropdown");
		parentDropdown.innerHTML = "";
		var selectTemplateOption = document.createElement("option");
		selectTemplateOption.value = "";
		selectTemplateOption.text = "Select SetupType";
		parentDropdown.appendChild(selectTemplateOption);
		OurData.forEach(function (item) {
			var option = document.createElement("option");
			option.value = item.setupId;
			option.text = item.setupValue;
			parentDropdown.appendChild(option);
		});
		parentDropdown.setAttribute("required", "true");

	} else {
		parentDropdownContainer.style.display = "none"; 
	}
}

function actionType(actionType) {
	
	var validationMessageContainers = document.querySelectorAll('.errmsgs');
	validationMessageContainers.forEach(function (container) {
		container.style.display = 'none';
	});
	$("#detailsComponent").show();
	$("#addBtn").hide();
	$("#searchBox").hide();
	$("#MasterSetup_datatable").hide();

	var setupName = $("#setupname").val();
	var langId = localStorage.getItem('languageId')
	if (actionType == 'Add') {

		Dropdown();

		var setupcode = document.getElementById("setupcode").value;

		var form = document.getElementById("setupForm");
		var inputs = form.getElementsByTagName("input");
		for (var i = 0; i < inputs.length; i++) {

			inputs[i].disabled = false;
			inputs[i].value = '';
		}
		var deleteOption = document.querySelector('option[value="3"]');
		if (deleteOption) {
			deleteOption.remove();
		}

		if (typeof (setupName) == "string") {
			if (langId == 1) {
				document.getElementById("actionType").innerHTML = "يضيف " + getGridTitle(setupName);
			}else {
				document.getElementById("actionType").innerHTML = "Add " + getGridTitle(setupName);
			}
		}
		document.getElementById("subbtn").innerHTML = "Submit";
	}
	if (actionType == 'View') {

		Dropdown();
		
		var dropdown = document.getElementById("parentdropdown");
		var setupcode = document.getElementById("setupcode").value;

		
		if (dropdown) {
			dropdown.disabled = true;
		}
		var form = document.getElementById("setupForm");
		var inputs = form.getElementsByTagName("input");
		for (var i = 0; i < inputs.length; i++) {

			inputs[i].disabled = true;
		}


		var dropdown = document.getElementById("statusDropdown");
		if (dropdown) {
			dropdown.disabled = true;
		}
		var deleteOption = document.querySelector('option[value="3"]');
		if (deleteOption) {
			deleteOption.remove();
		}

		if (typeof(setupName) == "string") {
			if (langId == 1) {
				document.getElementById("actionType").innerHTML = "منظر " + getGridTitle(setupName);
			} else {
				document.getElementById("actionType").innerHTML = "View " + getGridTitle(setupName);
			}
		}
		 
		if (dropdown) {
			document.getElementById("parentdropdown").value = parentSetupId
		}
		$("#subbtn").hide();
	}
	if (actionType == 'Edit') {

		Dropdown();
		
		var form = document.getElementById("setupForm");
		var inputs = form.getElementsByTagName("input");
		var setupcode = document.getElementById("setupcode").value;

		for (var i = 0; i < inputs.length; i++) {

			inputs[i].disabled = false;
		}
		var dropdown = document.getElementById("parentdropdown");
		if (dropdown) {
			dropdown.disabled = false;
		}

		var dropdown = document.getElementById("statusDropdown");
		if (dropdown) {
			dropdown.disabled = false;
		}
		var deleteOption = document.querySelector('option[value="3"]');
		if (!deleteOption) {
			var newOption = document.createElement("option");
			newOption.text = "Delete";
			newOption.value = "3";
			dropdown.appendChild(newOption);
		}

		if (typeof(setupName) == "string") {
			document.getElementById("actionType").innerHTML = "Edit " + setupName
		}

		if (dropdown) {
			document.getElementById("parentdropdown").value = parentSetupId
		}
		
		$("#subbtn").show();
		document.getElementById("subbtn").innerHTML = "Update";
		$('#SetupCode').prop('readonly', true);
	}

}
function SaveAndUpdate() {
	

	
	if ($('#setupForm').valid()) {
		$("#divLoader").show();
		var formdata = $('#setupForm').serializeArray().reduce(function (obj, item) {
			obj[item.name] = item.value;
			return obj;
		}, {});
		var myHeaders = new Headers();
		myHeaders.append("Content-Type", "application/json");
		myHeaders.append("Authorization", "Bearer " + getTokenFromSessionStorage());
		var parentid  = $("#parentdropdown").val();
		
		
		formdata.SetupType = SetupType;
		formdata.SetupTypeId = SetupTypeID;
		if (typeof parentid === 'undefined'|| parentid === '') {
			formdata.ParentSetupId = SetupTypeID;
		} else {
			formdata.ParentSetupId = parentid;
		}
		formdata.CreatedBy = sessionStorage.getItem('userName');
		formdata.ModifiedBy = sessionStorage.getItem('userName');
		var MasterURL = '';
		var MasterURL = (formdata.SetupId == null || formdata.SetupId === "") ? BaseUrl + '/api/setup/savesetuptypes' : BaseUrl+ '/api/setup/updatesetup';
		formdata.SetupId = (formdata.SetupId == null || formdata.SetupId === "") ? 0 : formdata.SetupId;
		var requestOptions = {
			method: 'POST',
			headers: myHeaders,
			body: JSON.stringify(formdata)
		};

		commonFetch(MasterURL, requestOptions, function (data) {
			debugger;

			if ((data != undefined || data != null ) && data.success != 1) {
				if (formdata.SetupId == null) {
					$("th#setupNaming").empty().text($("#SetupValue").val());

					$('#MasterSetupCreateModal').modal({
						backdrop: 'static'
					});
				}
				else {
					$("th#setupNaming").empty().text($("#SetupValue").val());

					$('#MasterSetupUpdateModal').modal({
						backdrop: 'static'
					});
				}
			}
			else {
				if (data) {
					showMasterSweetAlert('error', 'Error', data.message);

				}
				else
					showMasterSweetAlert('error', 'Invalid Response', '');
			}
		});
		//fetch(MasterURL, requestOptions)
		//	.then(response => response.json())
		//	.then(data => {
		//		
		//		$("#divLoader").hide();
		//		if (data.success == 0) {
		//			
		//			if (formdata.SetupId == null) {
		//				$("th#setupNaming").empty().append(document.getElementById("SetupValue").value);

		//				$('#MasterSetupCreateModal').modal({
		//					backdrop: 'static'
		//				});
		//			}
		//			else {
		//				$("th#setupNaming").empty().append(document.getElementById("SetupValue").value);

		//				$('#MasterSetupUpdateModal').modal({
		//					backdrop: 'static'
		//				});
		//			}


		//			//Swal.fire({
		//			//	text: data.message,
		//			//    icon: "success",
		//			//    buttonsStyling: false,
		//			//    confirmButtonText: "Ok, got it!",
		//			//    customClass: {
		//			//        confirmButton: "btn font-weight-bold btn-light"
		//			//    }
		//			//})

		//		}
		//		else {
		//			Swal.fire({
		//				text: data.message,
		//				icon: "error",
		//				buttonsStyling: false,
		//				confirmButtonText: "Ok, got it!",
		//				customClass: {
		//					confirmButton: "btn font-weight-bold btn-light"
		//				}
		//			})
		//		}
		//	})
		//	.catch(error => { console.log('error', error); $("#divLoader").show(); });
	}
	else {
		var validationMessageContainers = document.querySelectorAll('.errmsgs');
		validationMessageContainers.forEach(function (container) {
			container.style.display = 'block';
		});
	}
}



function showMasterSweetAlert(icon, title, text) {
	Swal.fire({
		icon: icon,
		title: title,
		text: text,
		confirmButtonText: "OK",
	});
}

