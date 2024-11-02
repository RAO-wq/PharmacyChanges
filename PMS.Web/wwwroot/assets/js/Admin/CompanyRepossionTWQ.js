let MasterURL = BaseUrl + "/api/Admin/GetAllRepossionCompaniesTWQ";

var LoadRepossessionCompaniesGrid;

jQuery(document).ready(function () {

	KTDatatableAutoColumnHideDemo.init();
});

var KTDatatableAutoColumnHideDemo = function () {
	// Private functions
	// basic demo
	LoadRepossessionCompaniesGrid = function () {
		debugger;
		var datatable = $('#RepossessionCompanySetup_datatable').KTDatatable({
			// datasource definition
			data: {
				type: 'remote',
				source: {
					read: {
						url: MasterURL,
						method: 'GET',
						params: {
							ServerGridCall: true,
							SetupID: ""
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
							var dataSet = raw.data;
							console.log(dataSet)
							if (typeof raw.data !== 'undefined') {
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

			//search: {
			//	input: $('#kt_datatable_Company_query'),
			//	key: 'query'
			//},

			// columns definition
			columns: [
				{
					field: 'companyCode',
					title: 'Company Code',
					// callback function support for column rendering
				},
				{
					field: 'companyName',
					title: 'Company Name',
					// callback function support for column rendering
				},
				{
					field: 'contactEmail',
					title: 'Email',
					// callback function support for column rendering
				},
				{
					field: 'modifiedBy',
					title: 'Modified By'
				},
				{
					field: 'modifiedDate',
					title: 'Modified Date',
					type: 'date',
					template: function (row) {
						row.modifiedDate = row.modifiedDate.split(" ")[0]
						var date = new Date(row.modifiedDate);
						var month = date.getMonth() + 1;
						return month + "/" + date.getDate() + "/" + date.getFullYear() + " " + date.getHours() + ":" + date.getMinutes()
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
	                                        <a onclick = EditOrViewCompanyDetails("'+ row.companyId + '","View") class="navi-link" >\
	                                            <span class="navi-text">View Details</span>\
	                                        </a>\
	                                    </li>'
							+ (actionData.Editable == true ?'<li class="navi-item" id="editBtn">\<a onclick = EditOrViewCompanyDetails("' + row.companyId + '","Edit") class="navi-link" ><span class="navi-text">Edit Details</span></a></li>': '') +
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

		$('#kt_datatable_Company_query').on('change', function () {
			datatable.search($(this).val().toLowerCase(), 'companyName');
		});

	};




	return {
		// public functions
		init: function () {
			LoadRepossessionCompaniesGrid();

		},
	};
}();

function EditOrViewCompanyDetails(Id, mode) {
	debugger;
	if (mode == "View") {
		document.forms['ViewCompanyDetails']['CompanyId'].value = Id;

		PostRedirect("ViewCompanyDetails", Id)
	}
	else if (mode == "Edit") {
		document.forms['EditCompanyDetails']['AssociateCompanyId'].value = Id;

		PostRedirect("EditCompanyDetails", Id)
	}
}
