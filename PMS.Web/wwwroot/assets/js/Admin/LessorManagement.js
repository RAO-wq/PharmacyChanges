const UserURL = BaseUrl + '/auth/getalllessorusers';
var LoadUserManagementGrid;
LoadUserManagementGrid = function () {
	debugger;
	var langId = localStorage.getItem("languageId");

	var datatable = $('#UserManagement_datatable').KTDatatable({
		// datasource definition
		rows: {
			autoHide: false
		},
		data: {
			type: 'remote',
			source: {
				read: {
					url: UserURL,
					method: 'GET',
					params: {
						ServerGridCall: false,
						UserId: sessionStorage.getItem('userId')
					},
					headers: {
						'AccessToken': getTokenFromSessionStorage()
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
					}, error: function (xhr, textStatus, errorThrown) {
						debugger
						if (xhr.status === 401) {
							// Handle unauthorized response here
							//alert('Unauthorized: You do not have permission to access this resource.');
							$('#kt_content').html('<div class="err-scrn d-flex flex-row-fluid flex-column bgi-size-cover bgi-position-center bgi-no-repeat p-10 p-sm-30"><h1 class="font-weight-boldest text-dark-75 mt-15" style="font-size: 10rem">403</h1><h4>Access Denied</h4><p class="font-size-h3 text-muted font-weight-normal">You do not have permission to access this content</p></div>');
						} else {
							// Handle other errors here
							console.error('An error occurred:', errorThrown);
						}
					},
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
			input: $('#kt_datatable_search_query'),
			key: 'generalSearch'
		},

		// columns definition
		columns: [
			{
				field: langId == 1 ? 'fullNameAr' : 'fullName',
				title: getGridTitle('Full_Name'),

				// callback function support for column rendering
			},
			{
				field: 'email',
				title: getGridTitle('Email'),
				// callback function support for column rendering
			},
			{
				field: 'userRole',
				title: getGridTitle('User_Role'),
				// callback function support for column rendering
			},
			{
				field: langId == 1 ? 'companyNameAr' : 'companyName',
				title: getGridTitle('Company_Name'),
				// callback function support for column rendering
			},
			{
				field: 'isActive',
				title: getGridTitle('Status'),
				template: function (row) {
					if (row.isActive === 1) {
						return langId == 0 ? '<span class="label label-success label-dot mr-2"></span> Active' : '<span class="label label-success label-dot mr-2"></span> نشيط' ;
					} else if (row.isActive === 2) {
						return langId == 0 ? '<span class="label label-danger label-dot mr-2"></span> InActive' : '<span class="label label-danger label-dot mr-2"></span> غير نشط';
					} else {
						return langId == 0 ? '<span class="label label-secondary label-dot mr-2"></span> Unknown' : '<span class="label label-secondary label-dot mr-2"></span> مجهول';
					}
				}
			},
			{
				field: 'Actions',
				title: getGridTitle('Actions'),
				sortable: false,
				width: 80,
				overflow: 'visible',
				autoHide: false,
				template: function (row) {
					var viewDetailsText = langId == '0' ? 'View Details' : 'تفاصيل العرض';
					var editDetailsText = langId == '0' ? 'Edit Details' : 'تحرير التفاصيل';
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
	                                        <a onclick = EditOrViewUserManagementDetails("'+ row.userId + '","View") class="navi-link" >\
	                                            <span class="navi-text">'+ viewDetailsText +'</span>\
	                                        </a>\
	                                    </li>'
						+ (actionData.Editable == true ? '<li class="navi-item" id="editBtn"><a onclick = EditOrViewUserManagementDetails("' + row.userId + '","Edit") class="navi-link" ><span class="navi-text">' + editDetailsText +'</span></a></li>' :'')+
						            '</ul>\
	                            </div>\
	                        </div>\
	                    ';
				},
			}
		],
	});

	$('#kt_datatable_UserManagement_query').on('change', function () {
		datatable.search($(this).val().toLowerCase(), 'email');
	});
	// Use regex search with an OR condition	});
};

jQuery(document).ready(function () {
	localized();
	LoadUserManagementGrid();
});



function EditOrViewUserManagementDetails(Id, mode) {
	debugger;
	if (mode == "View") {
		document.forms['ViewUserById']['Id'].value = Id;

		PostRedirect("ViewUserById", Id)
	}
	else if (mode == "Edit") {
		document.forms['EditUserById']['Id'].value = Id;

		PostRedirect("EditUserById", Id)
	}
}