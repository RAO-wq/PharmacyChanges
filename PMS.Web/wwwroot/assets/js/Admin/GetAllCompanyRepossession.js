let MasterURL = BaseUrl + "/api/Admin/getallcompanyrepossession";

var LoadPricingPlanGrid;
var companyId = null;
$(document).ready(function () {
	MasterURL += "?companyId=" + sessionStorage.getItem("companyId");
})

var KTDatatableAutoColumnHideDemo = function () {
	// Private functions
	// basic demo
	LoadPricingPlanGrid = function () {
		var langId = localStorage.getItem("languageId");
		var statusEn = {
			'PEN': { 'title': 'Pending', 'class': 'label-warning' },
			'APR': { 'title': 'Accepted', 'class': 'label-success' },
			'REJ': { 'title': 'Rejected', 'class': 'label-danger' },
		};

		var statusAr = {
			'PEN': { 'title': 'قيد الانتظار', 'class': 'label-warning' },
			'APR': { 'title': 'قبلت', 'class': 'label-success' },
			'REJ': { 'title': 'مرفوض', 'class': 'label-danger' },
		};
		var datatable = $('#CompanySetup_datatable').KTDatatable({
			// datasource definition
			data: {
				autoHide: false,
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
							"AccessToken": getTokenFromSessionStorage()
						},
						map: function (raw) {
							debugger
							actionData = setActionsForView();
							if (actionData.Addable) {
								document.getElementById('addBtn').style.display = 'flex';
							}
							var dataSet = raw;
							console.log(dataSet)
							if (typeof raw !== 'undefined') {
								dataSet = raw;
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
					title: getGridTitle('Company_Code'),
					autoHide: false,
					sortable: false
					// callback function support for column rendering
				},
				{
					field: langId == 0 ? 'companyName' : "companyNameAr",
					title: getGridTitle('Company_Name'),
					autoHide: false,
					sortable: false
					// callback function support for column rendering
				},
				{
					field: 'email',
					title: getGridTitle('Emails'),
					autoHide: false,
					sortable: false
				},
				//{
				//	field: 'phone',
				//	title: 'Phone',
				//	autoHide: false,
				//	sortable: false
				//},
				{
					field: 'processStatus',
					title: getGridTitle('Status'),
					autoHide: false,
					sortable: false,
					template: function (row) {
						var status = langId == 0 ? statusEn : statusAr;
						return '<span class="label font-weight-bold label-lg ' + status[row.processStatus].class + ' label-inline mr-5 py-5 px-5" style="cursor: pointer;">' + status[row.processStatus].title + '</span>';
					}
				}
				//{
				//	field: 'Actions',
				//	title: 'Actions',
				//	sortable: false,
				//	width: 80,
				//	overflow: 'visible',
				//	autoHide: false,
				//	template: function (row) {
				//		debugger;

				//		return '\
	   //                     <div class="dropdown dropdown-inline">\
	   //                         <a href="javascript:;" class="btn btn-sm btn-secondary btn-icon mr-2" data-toggle="dropdown">\
	   //                             <span class="svg-icon svg-icon-md">\
				//						<i class="ki ki-bold-more-ver"></i>\
	   //                             </span>\
	   //                         </a>\
	   //                         <div class="dropdown-menu dropdown-menu-sm dropdown-menu-right">\
	   //                             <ul class="navi flex-column navi-hover py-2">'
				//			+ (actionData.Editable == true ? '<li class="navi-item" id="editBtn"><a onclick = EditOrViewCompanyDetails("' + row.company_Id + '","View") class="navi-link" ><span class="navi-text">View Details</span></a></li>' : '') +
				//		            '</ul>\
	   //                         </div>\
	   //                     </div>\
	   //                 ';
				//	},
				//}
			],
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
			LoadPricingPlanGrid();

		},
	};
}();

jQuery(document).ready(function () {

	KTDatatableAutoColumnHideDemo.init();
	localized();
});




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
