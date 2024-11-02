var MasterURL = BaseUrl + "/api/setups";

var LoadPricingPlanGrid;
var KTDatatableAutoColumnHideDemo = function () {
	// Private functions
	// basic demo
	LoadPricingPlanGrid = function () {
		debugger;
		var datatable = $('#Makes_datatable').KTDatatable({
			// datasource definition
			data: {
				type: 'remote',
				source: {
					read: {
						url: MasterURL + "/getmakes",
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
				input: $('#kt_datatable_feild_query'),
			},

			// columns definition

			columns: [
				{
					field: 'makeCode',
					title: 'Makes Code',
					searchable: true,

					// callback function support for column rendering
				},

				{
					field: 'makeName',
					title: 'Makes Name',
					searchable: true,

					// callback function support for column rendering
				},
				{
					field: 'makeNameAr',
					title: 'Makes Name Ar',
					searchable: true,

					// callback function support for column rendering
				},
				{
					field: 'modifiedDate',
					title: 'Modified Date',
					// callback function support for column rendering
					template: function (row) {
						row.modifiedDate = row.modifiedDate.split(" ")[0]
						var date = new Date((row.modifiedDate.substring(0, 10)));
						var month = date.getMonth() + 1;
						return month + "/" + date.getDate() + "/" + date.getFullYear()
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
	                                        <a onclick = EditOrViewFeildDetails("'+ row.makeId + '","View") class="navi-link" >\
	                                            <span class="navi-text">View Details</span>\
	                                        </a>\
	                                    </li>'
							+ (actionData.Editable == true ? '<li class="navi-item" id="editBtn"><a onclick = EditOrViewFeildDetails("' + row.makeId + '","Edit") class="navi-link" ><span class="navi-text">Edit Details</span></a></li>' : '') +
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

		//$('#kt_datatable_feild_query').on('change', function () {
		//	datatable.search($(this).val().toLowerCase(), 'country_Name');
		//});

	};




	return {
		// public functions
		init: function () {
			LoadPricingPlanGrid();

		},
	};
}();
function EditOrViewFeildDetails(val, mode) {
	debugger

	switch (mode) {

		case "View":
			document.forms['ViewMakesDetails']['MakeId'].value = val;
			PostRedirect("ViewMakesDetails", val);
			break;

		case "Edit":
			document.forms['EditMakesDetails']['MakeId'].value = val;
			PostRedirect("EditMakesDetails", val);
			break;
	}
}

jQuery(document).ready(function () {

	KTDatatableAutoColumnHideDemo.init();
});
