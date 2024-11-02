var CallURL = BaseUrl + "/api/Survey";
var actionData;
var SurveySetupGrid;

var KTDatatableAutoColumnHideDemo = function () {
	// Private functions
	// basic demo
	SurveySetupGrid = function () {
		debugger;
		var datatable = $('#Model_datatable').KTDatatable({
			// datasource definition
			data: {
				type: 'remote',
				source: {
					read: {
						url: CallURL + "/GetSurveySetups",
						method: 'GET',
						params: {
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
				key: 'query'
			},

			// columns definition

			columns: [

				//{
				//	field: 'surveyId',
				//	title: 'Survey Id',
				//	// callback function support for column rendering
				//},
				{
					field: 'surveyName',
					title: 'Survey Name',
					// callback function support for column rendering
				},
				{
					field: 'entityName',
					title: 'Event Name',
					// callback function support for column rendering
				},
				{
					field: 'startDate',
					title: 'Start Date',
					// callback function support for column rendering
					template: function (row) {
						row.startDate = row.startDate.split(" ")[0]
						var date = new Date((row.startDate.substring(0, 10)));
						var month = date.getMonth() + 1;
						return month + "/" + date.getDate() + "/" + date.getFullYear()
					}
				},
				{
					field: 'endDate',
					title: 'End Date',
					// callback function support for column rendering
					template: function (row) {
						row.endDate = row.endDate.split(" ")[0]
						var date = new Date((row.endDate.substring(0, 10)));
						var month = date.getMonth() + 1;
						return month + "/" + date.getDate() + "/" + date.getFullYear()
					}
				},
				{
					field: 'modifiedDate',
					title: 'Modified Date',
					// callback function support for column rendering
					template: function (row) {
						debugger
						row.modifiedDate = row.modifiedDate.split(" ")[0]
						var date = new Date(row.modifiedDate);
						var month = date.getMonth() + 1;
						return month + "/" + date.getDate() + "/" + date.getFullYear() + " " + date.getHours() + ":" + date.getMinutes();
					}
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
							return 'Unknown';
						}
					}
				},
				{
					field: 'isRecursive',
					title: 'Is Recursive',
					sortable: false,

					template: function (row) {
						var status = {
							true: { 'title': 'Active', 'class': 'label-light-success' },
							false: { 'title': 'Inactive', 'class': ' label-light-info' }

						};
						return status[row.isRecursive].title;
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
	                                        <a onclick = EditOrViewFeildDetails("'+ row.surveyId + '","View") class="navi-link" >\
	                                            <span class="navi-text">View Details</span>\
	                                        </a>\
	                                    </li>' 
					+	(actionData.Editable == true ? '<li class="navi-item" id="editBtn"><a onclick = EditOrViewFeildDetails("'+ row.surveyId + '","Edit") class="navi-link" >\<span class="navi-text">Edit Details</span></a></li>' : '') +
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
			

		}).on('draw.dt', function () {

		});

		$('#kt_datatable_feild_query').on('change', function () {
			datatable.search($(this).val().toLowerCase(), 'country_Name');
		});
		$('#kt_datatable_feild_query').on('datatable-on-ajax-done', function () {
			console.log('I AM DONE');
		});

	};




	return {
		// public functions
		init: function () {
			SurveySetupGrid();
		},
	};
}();
function EditOrViewFeildDetails(val, mode) {
	debugger

	switch (mode) {

		case "View":
			document.forms['ViewSurveyDetails']['SurveyId'].value = val;
			PostRedirect("ViewSurveyDetails", val);
			break;

		case "Edit":
			document.forms['EditSurveyDetails']['SurveyId'].value = val;
			PostRedirect("EditSurveyDetails", val);
			break;
	}
}

jQuery(document).ready(function () {
	KTDatatableAutoColumnHideDemo.init();
});
