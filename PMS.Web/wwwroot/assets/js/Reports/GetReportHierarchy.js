var MasterURL = BaseUrl + "/api/setups";
var downloadReportUrl = BaseUrl + "/api/setups/downloadreport";
var companyList;
var contractPurposeList;
var assetTypeList;
var processStatusList;
var LoadPricingPlanGrid;
var start;
var end;
var selectedCompanyId = null;
var selectedPurposeCode = null;
var selectedAssetType = null;
var selectedStatus = null;
var contexting = null;
var demos;
var startdate;
var enddate

var selectedTotalPages;
var selectedTotalRecords;
var selectedReportId;
var selectedStartDate;
var selectedEndDate;

jQuery(document).ready(function () {
	//end = moment().subtract(1, "days");   

	GetReportHierarchy();
	GetLessorTypeCompanies();
	GetDataForDDBySetupType()
	//KTBootstrapDaterangepicker.init();
	KTDatatableAutoColumnHideDemo.init();
});

var KTDatatableAutoColumnHideDemo = function () {
	// Private functions	
	LoadAssetCountGrid = function (context) {
		contexting = context;
		// Get the selected date range from the daterangepicker
		//var datepickerData = $('#kt_daterangepicker_' + context).data('daterangepicker');
		//var startDate = datepickerData.startDate.format('YYYY-MM-DDTHH:mm:ss.SSS') + 'Z';
		//var endDate = datepickerData.endDate.format('YYYY-MM-DDTHH:mm:ss.SSS') + 'Z';
		 selectedCompanyId = $("#CompanyId_" + context).val();
		selectedAssetType = $("#AssetTypeId_" + context).val();
		selectedPurposeCode = $("#PurposeId_" + context).val();
		selectedStatus = $("#StatusId_" + context).val();

		//var datatable = $('#asset_count_datatable_1').KTDatatable({
		var datatable = $('#asset_count_datatable_' + context).KTDatatable({

			 columns: [],  // Initialize columns array as empty
			// datasource definition
			data: {
				type: 'remote',
				async: true,
				source: {
					read: {
						url: MasterURL + "/reportsgridbyparams",
						method: 'POST',
						params: {
							ServerGridCall: true,
							StartDate: startdate,
							EndDate: enddate,
							ReportId: context,
							LessorId: selectedCompanyId == "" ? null : selectedCompanyId,
							AssetTypeId: selectedAssetType == "" ? null : selectedAssetType,
							PurposeId: selectedPurposeCode == "" ? null : selectedPurposeCode,
							StatusId: selectedStatus == "" ? null : selectedStatus
						},
						headers: {
							'AccessToken': getTokenFromSessionStorage()
						},
						timeout: getGridTimeoutInMS(),
						map: function (raw) {
							//demos(context);
							var dataSet = raw.data;
							console.log(dataSet)
							if (typeof raw !== 'undefined') {
								dataSet = raw.data;

								// Dynamically create columns based on the keys of the first data item
								if (dataSet.length > 0) {
									var firstDataItem = dataSet[0];
									var dynamicColumns = [];

									var thead = $('#asset_count_datatable_' + context + ' thead');
									var headerRow = thead.find('tr');

									// Remove existing header cells
									headerRow.empty();

									// Add new header cells with column names
									for (var key in firstDataItem) {
										dynamicColumns.push({
											field: key,
											title: key,  // Use key as both field and title, you can customize this
										});

										headerRow.append('<th data-field="' + key + '" class = "uniqheaders">' + key + '</th>');


										// Find the newly appended th element and set the display style
										headerRow.find('th[data-field="' + key + '"]').show();
									}

									//for (var key in firstDataItem) {
									//	dynamicColumns.push({
									//		field: key,
									//		title: key,  // Use key as both field and title, you can customize this
									//		autoHide: false,
									//	});
									//}

									// Set the dynamically created columns
									datatable.setOption('columns', dynamicColumns);
									// Update the thead section with new column names

								}
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
				scrollX: true,
			},
			layout: {
				scroll: true
			},
			sortable: true,
			pagination: true,
			columns: [],
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

		
		

		var CompanyType = sessionStorage.getItem('companyType');

		// Check if CompanyType is equal to 299
		if (selectedCompanyId == null && selectedCompanyId == undefined && CompanyType == "Tawtheeq") {
			//GetLessorTypeCompanies();
			BindCompaniesToDropdown(context);
		}
		if (selectedAssetType == null && selectedAssetType == undefined) {
			//GetLessorTypeCompanies();
			BindAssetTypesToDropdown(context);
		}
		if (selectedPurposeCode == null && selectedPurposeCode == undefined) {
			//GetLessorTypeCompanies();
			BindContractPurposesToDropdown(context);
		}
		if (selectedStatus == null && selectedStatus == undefined) {
			//GetLessorTypeCompanies();
			BindProcessStatusesToDropdown(context);
		}

	};
	return {
		// public functions
		init: function () {
			LoadAssetCountGrid(contexting);

		},
	};
}();
function GetReportHierarchy() {
	
	var DynamicId = "";
	var UserId = sessionStorage.getItem('userId');
	CountryURL = BaseUrl + "/api/ContractManagement/" + UserId + "/getreporthierarchyasync";
	var myHeaders = new Headers();
	myHeaders.append("Content-Type", "application/json");

	var requestOptions = {
		method: 'GET',
		headers: myHeaders,
		redirect: 'follow'
	};
	commonFetch(CountryURL, requestOptions, function (data) {
		if (data != undefined || data != null) {
			var hierarchyData = data.data;

			// Assuming you have a div with id DynamicReportsHierarchy to bind the data
			// Function to convert numbers to English words

			// Assuming you have a div with id DynamicReportsHierarchy to bind the data
			var dynamicReportsHierarchy = document.getElementById("DynamicReportsHierarchy");

			// Create the outer row div
			var outerRowDiv = document.createElement("div");
			outerRowDiv.classList.add("row");

			// Create the col-md-2 div
			var colMd2Div = document.createElement("div");
			colMd2Div.classList.add("col-md-2", "mb-3");

			var tabList = document.createElement("ul");
			tabList.classList.add("nav", "nav-pills", "flex-column");
			tabList.setAttribute("id", "myTab");
			tabList.setAttribute("role", "tablist");

			// Counter for generating unique IDs
			var tabCounter = 1;

			// Iterate through the hierarchyData and dynamically generate HTML for tabs
			hierarchyData.forEach((report, index) => {
				var tabItem = document.createElement("li");
				tabItem.classList.add("nav-item");

				var tabLink = document.createElement("a");
				tabLink.classList.add("nav-link");
				if (index == 0) {
					tabLink.classList.add("active");
				}

				// Use a default value if entityId is undefined
				var entityId = report.entityId || `tab-${tabCounter}`;

				tabLink.setAttribute("id", `${entityId}-tab`);
				tabLink.setAttribute("data-toggle", "tab");
				tabLink.setAttribute("href", `#${entityId}`);
				tabLink.setAttribute("role", "tab");
				tabLink.setAttribute("aria-controls", entityId);
				tabLink.setAttribute("aria-selected", index === 0 ? "true" : "false");
				tabLink.innerText = report.entityName;

				tabItem.appendChild(tabLink);
				tabList.appendChild(tabItem);

				// Increment the counter
				tabCounter++;
			});

			colMd2Div.appendChild(tabList);
			outerRowDiv.appendChild(colMd2Div);

			// Create the col-md-10 div
			var colMd10Div = document.createElement("div");
			colMd10Div.classList.add("col-md-10");

			var contentContainer = document.createElement("div");
			contentContainer.classList.add("tab-content");
			contentContainer.setAttribute("id", "myTabContent");

			// Iterate through the hierarchyData and dynamically generate HTML for content
			hierarchyData.forEach((report, index) => {
				var subTabContent = document.createElement("div");
				var entityId = report.entityId || `tab-${index + 1}`;
				subTabContent.classList.add("tab-pane", "fade");
				if (index == 0) {
					subTabContent.classList.add("tab-pane", "show");
					subTabContent.classList.add("tab-pane", "active");
				}
				subTabContent.setAttribute("id", entityId);
				subTabContent.setAttribute("role", "tabpanel");

				var accordion = document.createElement("div");
				accordion.classList.add("accordion", "accordion-toggle-arrow");

				report.tabs.forEach((subtab, subIndex) => {
					var subTabItem = document.createElement("div");
					subTabItem.classList.add("card");

					var subTabHeader = document.createElement("div");
					subTabHeader.classList.add("card-header");

					// Add a title to the header
					var subTabTitle = document.createElement("div");
					subTabTitle.classList.add("card-title", "collapsed");
					subTabTitle.setAttribute("data-toggle", "collapse");
					if (subtab.entityPhysicalId != null) {
						subTabTitle.setAttribute("data-target", `#collapse${index}-${subIndex}`);
					}
					subTabTitle.setAttribute("aria-expanded", "false");
					subTabTitle.innerText = subtab.entityName;

					// Add an event listener to the button
					subTabTitle.addEventListener("click", function () {
						if (subtab.entityPhysicalId != null) {
							// Call the LoadAssetCountGrid function
							LoadAccordianData(subtab.entityPhysicalId); // Pass any necessary parameters
							//LoadAssetCountGrid(subtab.entityPhysicalId); // Pass any necessary parameters
						}
					});

					// Append the button to the header
					subTabHeader.appendChild(subTabTitle);

					var subTabBody = document.createElement("div");
					subTabBody.classList.add("collapse", "card-body");
					subTabBody.setAttribute("id", `collapse${index}-${subIndex}`);

					// Generate a unique ID for kt_daterangepicker
					var uniqueId = subtab.entityPhysicalId;

					//subTabBody.addEventListener('shown.bs.collapse', function (event) {
					//	console.log('Collapse shown:', event.target.id);

					//	// Get the ID of the datatable
					//	var datatableId = event.target.querySelector('.datatable').id;
					//	console.log('Datatable ID:', datatableId);

					//	LoadAssetCountGrid(datatableId);
					//});

					// Retrieve CompanyType from sessionStorage
					var CompanyType = sessionStorage.getItem('companyType');
					
					// Check if CompanyType is equal to 299
					var selectHtml = (CompanyType == "Tawtheeq") ? `
								<div class="col-lg-4 col-md-4 col-sm-12 align-items-center">
								<label>Lessor</label>
									<select class="form-control" id="CompanyId_${uniqueId}" onchange="ChangeOfDropDown(${uniqueId})"></select>
								</div>
							` : '';

					

					var selectAssetTypeHtml = `
								<div class="col-lg-4 col-md-4 col-sm-12">
																	<label>Asset Type</label>

									<select class="form-control" id="AssetTypeId_${uniqueId}" onchange="ChangeOfAssetTypeDropDown(${uniqueId})"></select>
								</div>`;

					var selectPurposeCodeHtml = `
								<div class="col-lg-4 col-md-4 col-sm-12">
																	<label>Purpose Code</label>

									<select class="form-control" id="PurposeId_${uniqueId}" onchange="ChangeOfPurposeCodeDropDown(${uniqueId})"></select>
								</div>`;
					var selectStatusHtml = `
								<div class="col-lg-4 col-md-4 col-sm-12">
																	<label>Status</label>

									<select class="form-control" id="StatusId_${uniqueId}" onchange="ChangeOfStatusDropDown(${uniqueId})"></select>
								</div>`;					

					// Update subTabBody.innerHTML
					subTabBody.innerHTML = `
						<div class="content d-flex flex-column flex-column-fluid" id="kt_content">
							<!--begin::Entry-->
							<div class="d-flex flex-column-fluid">
								<!--begin::Container-->
								<div class="container-fluid px-0">
									<!--begin::Dashboard-->
									<div class="card">
										<div class="form-group row d-flex align-items-center">
											<div class="col-md-6 col-sm-12 align-items-center">
												<label class="col-form-label text-right col-lg-3 col-sm-12 px-0">DATE RANGE</label>
												<input type='text' class="form-control dtpicker" id="kt_daterangepicker_${uniqueId}"  placeholder="Select date" type="text" />
											</div>
											${selectHtml} <!-- Conditionally include the select element -->
											<div class="ml-2 d-flex align-items-center">
												<a type="button" class="btn btn-sm btn-secondary font-weight-bold ml-2 d-flex align-items-center" onclick=exportReport(${uniqueId}) id="export_${uniqueId}">
												   <i class="flaticon-download mr-2"></i> Export
												</a>
											</div>
										</div>
									
										<div class="form-group row">
											${selectAssetTypeHtml}   <!-- Asset Type DD -->
											${selectPurposeCodeHtml} <!-- Purpose DD -->
											${selectStatusHtml} <!-- Status DD -->											
										</div>
										<div>
											<!--begin: Datatable -->
											<div id="asset_count_datatable_${uniqueId}" style="margin: auto; width: 100%;padding: 10px;"></div>
											<!--end: Datatable-->
										</div>
									</div>
									<!--end::Dashboard-->
								</div>
								<!--end::Container-->
							</div>
							<!--end::Entry-->
						</div>
					`;


					subTabItem.appendChild(subTabHeader);
					subTabItem.appendChild(subTabBody);
					accordion.appendChild(subTabItem);
				});

				subTabContent.appendChild(accordion);
				contentContainer.appendChild(subTabContent);
			});

			colMd10Div.appendChild(contentContainer);
			outerRowDiv.appendChild(colMd10Div);

			// Append the outerRowDiv to the dynamicReportsHierarchy div
			dynamicReportsHierarchy.appendChild(outerRowDiv);

			LoadAssetCountGrid(DynamicId);
			

		}
		else {
			showSweetAlert('error', 'Invalid Response', '');
		}
	});
}
var KTBootstrapDaterangepicker = function () {

	// Private functions
	demos = function (context) {
		debugger;
		var _START_ = moment().subtract(7, "days");
		var _END_ = moment();
		$('#kt_daterangepicker_' + context + ', kt_daterangepicker_' + context + '_modal').daterangepicker(
			{
				"locale": {
					"format": "DD/MM/YYYY",
					"separator": " - ",
					"applyLabel": "Apply",
					"cancelLabel": "Cancel",
					"fromLabel": "From",
					"toLabel": "To",
					"customRangeLabel": "Custom",
					"weekLabel": "W",
					"daysOfWeek": [
						"Su",
						"Mo",
						"Tu",
						"We",
						"Th",
						"Fr",
						"Sa"
					],
					"monthNames": [
						"January",
						"February",
						"March",
						"April",
						"May",
						"June",
						"July",
						"August",
						"September",
						"October",
						"November",
						"December"
					],
					"firstDay": 1
				},
				"linkedCalendars": false,
				"constrainInput":false,
				"maxDate": end,
				"startDate": _START_,
				"endDate": _END_

			}, function (start, end, label) {
				console.log("Callback has been called!");
				$('#kt_daterangepicker_' + context + ' .form-control').val(start.format('YYYY-MM-DD') + ' / ' + end.format('YYYY-MM-DD'));
				/*$('#reportrange span').html(start.format('DD/MM/YYYY') + ' - ' + end.format('DD/MM/YYYY'));*/
				startDate = start;
				fromdate = start.format('MM/DD/YYYY');
				todate = end.format('MM/DD/YYYY');
				endDate = end;
				update = true;
				startdate = start.format('YYYY-MM-DD');
				enddate = end.format('YYYY-MM-DD');
				KtDynamicDateRange(context);
				console.log("New date range selected: ' + start.format('YYYY-MM-DD') + ' to ' + end.format('YYYY-MM-DD') + ' (predefined range: ' + label + ')");
			}, function (start, end, label) {
				console.log("New date range selected: ' + start.format('YYYY-MM-DD') + ' to ' + end.format('YYYY-MM-DD') + ' (predefined range: ' + label + ')");
			},
			function (start, end) {
				console.log("Callback has been called!");
				$('#reportrange span').html(start.format('DD/MM/YYYY') + ' - ' + end.format('DD/MM/YYYY'));
				startDate = start;
				fromdate = start.format('MM/DD/YYYY');
				todate = end.format('MM/DD/YYYY');
				endDate = end;
				update = true;
				KtDynamicDateRange(context);
			}
		)
		
		//var start = moment().subtract(529, 'days');
		//var end = moment();
		// minimum setup
		//$('#kt_daterangepicker_' + context + ', kt_daterangepicker_' + context + '_modal').daterangepicker({
		//	buttonClasses: ' btn',
		//	applyClass: 'btn-primary',
		//	cancelClass: 'btn-secondary',
		//	buttonImageOnly: true
		//}, function (start, end, label) {
		//	$('#kt_daterangepicker_' + context + ' .form-control').val(start.format('YYYY-MM-DD') + ' / ' + end.format('YYYY-MM-DD'));
			
		//	startdate = start.format('YYYY-MM-DD');
		//	enddate = end.format('YYYY-MM-DD');
		//	KtDynamicDateRange(context);
		//});
		//// Get the apply button and add the uniqueIdIndex after the applyBtn class
		//var applyButton = $('.applyBtn');
		//var currentClasses = applyButton.attr('class');
		//applyButton.attr('class', currentClasses + ' ' + 'applyBtn_' + context);
	}


	return {
		// public functions
		init: function () {
            demos(param);
		}
	};
}();
function GetLessorTypeCompanies() {
	debugger
	
	var myHeaders = new Headers();
	myHeaders.append("Content-Type", "application/json");
	myHeaders.append("Authorization", "Bearer " + getTokenFromSessionStorage());


	var requestOptions = {
		method: 'GET',
		headers: myHeaders,
		redirect: 'follow'
	};

	var CompanyTypeID = 300;
	let SetupURL = BaseUrl + "/api/Admin/" + CompanyTypeID + "/GetCompanyByType";
	commonFetch(SetupURL, requestOptions,function (data) {
		if (data != undefined && data != null) {
			companyList = data;
		} else {
			showSweetAlert('error', "Invalid Response", "")
		}
	});
}



function GetDataForDDBySetupType() {

	$("#divLoader").show();
	//var Factoring = "Purpose Code";
	CountryURL = BaseUrl + "/api/Setups/getdetailsbysetuptype";
	var myHeaders = new Headers();
	myHeaders.append("Content-Type", "application/json");
	// myHeaders.append("Authorization", "Bearer " + getTokenFromSessionStorage());

	var filterModel = {
		Id: null,
		Value: null,
		CheckList: ["Asset Type", "Purpose Code", "Process Status"]
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
			assetTypeList = data.data.filter(x => x.setupType == "Asset Type");
			contractPurposeList = data.data.filter(x => x.setupType == "Purpose Code");
			processStatusList = data.data.filter(x => x.setupType == "Process Status");
			$("#divLoader").hide();

		}
		else {
			showSweetAlert('', "Invalid Response", "")
		}
	});

}


function BindCompaniesToDropdown(context) {
	if (companyList != null && companyList.length > 0) {
		$("#CompanyId_" + context).html("");
		$("#CompanyId_" + context).append("<option value=>All</option>")
		for (var i = 0; i < companyList.length; i++) {
			$("#CompanyId_" + context).append("<option value='" + companyList[i].company_Id + "'>" + companyList[i].companyName + "</option>")
		}
    }
}
function BindContractPurposesToDropdown(context) {
	if (contractPurposeList != null && contractPurposeList.length > 0) {
		$("#PurposeId_" + context).html("");
		$("#PurposeId_" + context).append("<option value=>All</option>")
		for (var i = 0; i < contractPurposeList.length; i++) {
			$("#PurposeId_" + context).append("<option value='" + contractPurposeList[i].setupId + "'>" + contractPurposeList[i].shortDescription + "</option>")
		}
	}
	
}
function BindAssetTypesToDropdown(context) {
	
	if (assetTypeList != null && assetTypeList.length > 0) {
		$("#AssetTypeId_" + context).html("");
		$("#AssetTypeId_" + context).append("<option value=>All</option>")
		for (var i = 0; i < assetTypeList.length; i++) {
			$("#AssetTypeId_" + context).append("<option value='" + assetTypeList[i].setupId + "'>" + assetTypeList[i].shortDescription + "</option>")
		}
	}
	
}
function BindProcessStatusesToDropdown(context) {
	
	if (processStatusList != null && processStatusList.length > 0) {
		$("#StatusId_" + context).html("");
		$("#StatusId_" + context).append("<option value=>All</option>")
		for (var i = 0; i < processStatusList.length; i++) {
			$("#StatusId_" + context).append("<option value='" + processStatusList[i].setupId + "'>" + processStatusList[i].shortDescription + "</option>")
		}
	}
}

function ChangeOfDropDown(param) {

	$('#asset_count_datatable_' + param).KTDatatable().destroy();

	LoadAssetCountGrid(param);
}
function ChangeOfAssetTypeDropDown(param) {

	$('#asset_count_datatable_' + param).KTDatatable().destroy();

	LoadAssetCountGrid(param);
}
function ChangeOfPurposeCodeDropDown(param) {

	$('#asset_count_datatable_' + param).KTDatatable().destroy();

	LoadAssetCountGrid(param);
}
function ChangeOfStatusDropDown(param) {

	$('#asset_count_datatable_' + param).KTDatatable().destroy();

	LoadAssetCountGrid(param);
}
function KtDynamicDateRange(param) {	

	//$('#kt_daterangepicker_' + param).daterangepicker().destroy();
	$('#asset_count_datatable_' + param).KTDatatable().destroy();

	LoadAssetCountGrid(param);
}
function LoadAccordianData(param) {
	debugger

	if ($('#kt_daterangepicker_' + param + ', kt_daterangepicker_' + param + '_modal').val() == '') {
		demos(param);
    }
	LoadAssetCountGrid(param);
}
function exportReport(uniqueId) {
	debugger
	//DownloadExcelReport("asset_count_datatable_" + uniqueId);

	var formData = getDownloadReportParameters(uniqueId)
	downloadReport(formData);

}

function getDownloadReportParameters(reportId) {
	debugger
	var paginationData = $('#asset_count_datatable_' + reportId).KTDatatable().getDataSourceParam('pagination');
	var dateRange = $('#kt_daterangepicker_' + reportId + ', kt_daterangepicker_' + reportId + '_modal').val().split('-').map(function (item) { return item.trim() })
	var companyId = $('#CompanyId_' + reportId).val();

	var startDate = dateRange[0];
	var endDate = dateRange[1];

	var dateRangeObject = {
		Start: startDate,
		End: endDate
	}

	console.log(paginationData);
	console.log(reportId);


	var formBody = new FormData();
	if (companyId != null && companyId != undefined) {
		formBody.append("LessorId", companyId);
	}

	formBody.append("ReportId", reportId);
	formBody.append('Json', JSON.stringify(dateRangeObject));
	formBody.append("pagination[page]", paginationData.page);
	formBody.append("pagination[pages]", paginationData.pages);
	formBody.append("pagination[perpage]", paginationData.perpage);
	formBody.append("pagination[total]", paginationData.total);

	return formBody;
}

function downloadReport(formData) {
	var myHeaders = new Headers();
	var requestOptions = {
		method: 'POST',
		headers: myHeaders,
		redirect: 'follow',
		body: formData
	};

	commonFetch(downloadReportUrl, requestOptions, function (data) {
		if (data.success) {
			var downloadUrl = BaseUrl + '/api/Setups/Reports/' + data.data + '/downloadfile';
			//window.location.href = downloadUrl;
			downloadFile(data.data, downloadUrl);
		}
		else {
			showSweetAlert('error', 'Report could not be generated!', data.message != null ? data.message : "");
		}
	});
}


//function downloadFile(data) {
//	var token = getTokenFromSessionStorage();
//	var downloadUrl = BaseUrl + '/api/Setups/Reports/' + data + '/downloadfile';

//	var headers = new Headers();
//	headers.append("AccessToken", `${token}`);
//	headers.append("RequestType", "WA");

//	fetch(downloadUrl, {
//		method: 'GET',
//		headers: headers
//	})
//		.then(response => {
//			if (response.ok) {
//				return response.blob(); // Get the file as a blob
//			} else {
//				throw new Error('File download failed');
//			}
//		})
//		.then(blob => {
//			// Create a URL for the file and initiate the download
//			var url = window.URL.createObjectURL(blob);
//			var a = document.createElement('a');
//			a.href = url;
//			a.download = data; // Use the file name for the download
//			document.body.appendChild(a);
//			a.click();
//			window.URL.revokeObjectURL(url); // Clean up the object URL
//		})
//		.catch(error => {
//			console.error('Download error:', error);
//			showSweetAlert('error', 'File could not be downloaded!', error.message);
//		});
//}

function DownloadExcelReport(table) {
	debugger
	var tab_text = "<table border='2px'><tr bgcolor='#87AFC6'>";
	tab = document.getElementById(table).getElementsByTagName("table")[0]; // id of table

	for (let j = 0; j < tab.rows.length; j++) {
		tab_text = tab_text + tab.rows[j].innerHTML + "</tr>";
	}

	tab_text = tab_text + "</table>";

	var ua = window.navigator.userAgent;
	var msie = ua.indexOf("MSIE ");

	if (msie > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./))      // If Internet Explorer
	{
		txtArea1.document.open("txt/html", "replace");
		txtArea1.document.write(tab_text);
		txtArea1.document.close();
		txtArea1.focus();
		sa = txtArea1.document.execCommand("SaveAs", true, "Say Thanks to Sumit.xls");
	}
	else                 //other browser not tested on IE 11
		sa = window.open('data:application/vnd.ms-excel,' + encodeURIComponent(tab_text));

	return (sa);
}





