var MasterURL = BaseUrl + "/api/setups";

var LoadPricingPlanGrid;
var KTDatatableAutoColumnHideDemo = function () {
	// Private functions
	// basic demo
	LoadPricingPlanGrid = function () {
		debugger;
		var datatable = $('#feild_datatable').KTDatatable({
			// datasource definition
			data: {
				type: 'remote',
				source: {
					read: {
						url: MasterURL + "/getstate",
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

			//search: {
			//	input: $('#kt_datatable_Company_query'),
			//	key: 'query'
			//},

			// columns definition

			columns: [
				{
					field: 'stateName',
					title: 'State Name',
					// callback function support for column rendering
				},

				{
					field: 'stateCode',
					title: 'State  Code',
					// callback function support for column rendering
				},
				{
					field: 'modifiedBy',
					title: 'Modified By',
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
					field: 'isActive',
					title: 'Status',
					sortable: false,
					template: function (row) {
						var status = {
							1: { 'title': 'Active', 'class': 'label-light-success' },
							2: { 'title': 'InActive', 'class': ' label-light-info' },

						};
						return status[row.isActive].title;
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
	                                        <a onclick = EditOrViewFeildDetails("'+ row.stateId + '","View") class="navi-link" >\
	                                            <span class="navi-text">View Details</span>\
	                                        </a>\
	                                    </li>'
							+ (actionData.Editable == true ? '<li class="navi-item"><a onclick = EditOrViewFeildDetails("' + row.stateId + '","Edit") class="navi-link" ><span class="navi-text">Edit Details</span></a></li>' : '') +
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

		$('#kt_datatable_feild_query').on('change', function () {
			datatable.search($(this).val().toLowerCase(), 'stateName');
		});

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
			document.forms['ViewStateDetails']['StateId'].value = val;
			PostRedirect("ViewStateDetails", val);
			break;

		case "Edit":
			document.forms['EditStateDetails']['StateId'].value = val;
			PostRedirect("EditStateDetails", val);
			break;
	}
}

jQuery(document).ready(function () {

	KTDatatableAutoColumnHideDemo.init();
});
