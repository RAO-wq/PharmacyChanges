let MasterURL = BaseUrl+"/api/Admin/getallcompanies";

var LoadPricingPlanGrid;
var KTDatatableAutoColumnHideDemo = function () {
	// Private functions
	// basic demo
	LoadPricingPlanGrid = function () {
		debugger;
		var datatable = $('#CompanySetup_datatable').KTDatatable({
			// datasource definition
			data: {
				type: 'remote',
				source: {
					read: {
						url: MasterURL +"?ActiveAndInActive="+true,
						method: 'GET',
						params: {
							ServerGridCall: true,
							SetupID: ""
						},
						headers: {
							'AccessToken': getTokenFromSessionStorage()
						},
						map: function (raw) {
							debugger;
							actionData = setActionsForView();
							if (actionData.Addable) {
								document.getElementById('addBtn').style.display = 'flex';
							}
							var dataset = [];

							for (var i = 0; i < raw.length; i++) {
								if (raw[i].companyType !== 'Tawtheeq') {
									dataset.push(raw[i]);
								}
							}
							
							return dataset;
							console.log(dataset);
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
				input: $('#kt_datatable_Company_query'),
			},

			// columns definition
			columns: [
				{
					field: 'companyType',
					title: 'Company Type',
					searchable: true,

					// callback function support for column rendering
				},
				{
					field: 'companyCode',
					title: 'Company Code',
					searchable: true,

					// callback function support for column rendering
				},
				{
					field: 'companyName',
					title: 'Company Name',
					searchable: true,

					// callback function support for column rendering
				},
				{
					field: 'companyDetails',
					title: 'Company Details',
					searchable: true,

					// callback function support for column rendering
				},
				{
					field: 'websiteUrl',
					title: 'Website URL',
					searchable: true,

				},
				{
					field: 'modifiedBy',
					title: 'Modified By',
					searchable: true,

				},
				{
					field: 'modifiedDate',
					title: 'Modified Date',
					type: 'date',
					template: function (row) {
						row.modifiedDate = row.modifiedDate.split(" ")[0]
						var date = new Date(row.modifiedDate);
						var month = date.getMonth() + 1;
						return month + "/" + date.getDate() + "/" + date.getFullYear() + " " + date.getHours() + ":" + date.getMinutes();
					}
					// callback function support for column rendering
				},
				{
					field: 'isActive',
					title: 'Status',
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
	                                        <a onclick = EditOrViewCompanyDetails("'+ row.company_Id + '","View") class="navi-link" >\
	                                            <span class="navi-text">View Details</span>\
	                                        </a>\
	                                    </li>'
							+ (actionData.Editable == true ?'<li class="navi-item" id="editBtn">\
	                                        <a onclick = EditOrViewCompanyDetails("'+ row.company_Id + '","Edit") class="navi-link" >\
	                                            <span class="navi-text">Edit Details</span>\
	                                        </a>\
	                                    </li>':'')+
						            '</ul>\
	                            </div>\
	                        </div>\
	                    ';
					},
				}],
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

		//$('#kt_datatable_Company_query').on('change', function () {
		//	datatable.search($(this).val().toLowerCase(), 'companyName');
		//});

	};




	return {
		// public functions
		init: function () {
			LoadPricingPlanGrid();

		},
	};
}();

jQuery(document).ready(function () {

	KTDatatableAutoColumnHideDemo.init();
});


function EditOrViewSetupDetails(val, mode) {
	let SetupDetailsUrl = BaseUrl + "/api/Admin/getallcompanies";
}

function GetSetupDetails() {
	debugger
	var myHeaders = new Headers();
	myHeaders.append("Content-Type", "application/json");
	myHeaders.append("Authorization", "Bearer " + getTokenFromSessionStorage());


	var requestOptions = {
		method: 'GET',
		headers: myHeaders,
		redirect: 'follow'
	};

	fetch(SetupDetailsUrl, requestOptions)
		.then(response => response.json())
		.then(data => {
			console.log(data);
			//debugger
			//$("#CompanyType").html("");
			//$("#CompanyType").append("<option value=>Please Select</option>")
			//for (var i = 0; i < data.length; i++) {

			//	$("#CompanyType").append("<option value='" + data[i].countryId + "'>" + data[i].countryName + "</option>")
			//}
		})
		.catch(error => console.log('error', error));

}




function EditOrViewCompanyDetails(Id, mode) {
	debugger;
	if (mode == "View") {
		document.forms['ViewCompanyDetails']['CompanyId'].value = Id;

		PostRedirect("ViewCompanyDetails", Id)
	}
	else if (mode == "Edit") {
		document.forms['EditCompanyDetails']['CompanyId'].value = Id;

		PostRedirect("EditCompanyDetails", Id)
	}
}
