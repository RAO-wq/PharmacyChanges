var MasterURL = BaseUrl + "/api/setups";

var LoadPricingPlanGrid;
var KTDatatableAutoColumnHideDemo = function () {
	// Private functions
	// basic demo
	LoadPricingPlanGrid = function () {
		debugger;
		var datatable = $('#Model_datatable').KTDatatable({
			// datasource definition
			data: {
				type: 'remote',
				source: {
					read: {
						url: MasterURL + "/getmodels?showAll=true",
						method: 'POST',
						params: {
							ServerGridCall: true,
							MakeId: 0,
							ShowAll: true
						},
						headers: {
							"AccessToken": getTokenFromSessionStorage()
						},
						map: function (raw) {
							debugger;
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
				serverPaging: true,
				serverFiltering: true,
				serverSorting: true,
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
					field: 'makerName',
					title: 'Brand Name',
					searchable: true,
					// callback function support for column rendering
				},
				{
					field: 'modelCode',
					title: 'Model Code',
					searchable: true,

					// callback function support for column rendering
				},

				{
					field: 'modelName',
					title: 'Model Name',
					searchable: true,

					// callback function support for column rendering
				},
				{
					field: 'modelNameAr',
					title: 'Model Name Ar',
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
					field: 'isActive',
					title: 'Status',
					template: function (row) {
						debugger
						if (row.isActive === 1) {
							return '<span class="label label-success label-dot mr-2"></span> Active';
						} else if (row.isActive === 2) {
							return '<span class="label label-danger label-dot mr-2"></span> InActive';
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
	                                        <a onclick = EditOrViewFeildDetails("'+ row.modelId + '","View") class="navi-link" >\
	                                            <span class="navi-text">View Details</span>\
	                                        </a>\
	                                    </li>'
							+ (actionData.Editable == true ? '<li class="navi-item" id="editBtn"><a onclick = EditOrViewFeildDetails("' + row.modelId + '","Edit") class="navi-link" ><span class="navi-text">Edit Details</span></a></li>' : '') +
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
		//	datatable.search($(this).val().toLowerCase(), 'makerName');
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
			document.forms['ViewModelDetails']['ModelId'].value = val;
			PostRedirect("ViewModelDetails", val);
			break;

		case "Edit":
			document.forms['EditModelDetails']['ModelId'].value = val;
			PostRedirect("EditModelDetails", val);
			break;
	}
}

jQuery(document).ready(function () {

	KTDatatableAutoColumnHideDemo.init();
});
