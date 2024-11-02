const UserURL = BaseUrl + '/auth/getallusers';
var LoadUserManagementGrid;
var userIdToResetPassword;
LoadUserManagementGrid = function () {
	debugger;
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
						'UserId': "",
						'Content-Type': "application/json", 
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
						``
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
			input: $('#kt_datatable_UserManagement_query'),
			key: 'generalSearch'
		},

		// columns definition
		columns: [
			{
				field: 'fullName',
				title: 'Full Name',
			    searchable: true,

				// callback function support for column rendering
			},
			{
				field: 'email',
				title: 'Email',
				searchable: true,

				// callback function support for column rendering
			},
			{
				field: 'userRole',
				title: 'User Role',
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
				field: 'modifiedDate',
				title: 'Modified Date',
				// callback function support for column rendering
				template: function (row) {
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
	                                        <a onclick = EditOrViewUserManagementDetails("'+ row.userId + '","View") class="navi-link" >\
	                                            <span class="navi-text">View Details</span>\
	                                        </a>\
	                                    </li>'
						+ (actionData.Editable == true ?'<li class="navi-item"id="editBtn"><a onclick = EditOrViewUserManagementDetails("' + row.userId + '","Edit") class="navi-link" ><span class="navi-text">Edit Details</span></a></li>': '') +
										'<li class="navi-item">'
						+ (actionData.Editable == true ? ' <a onclick = resetpasswordmodal("' + row.userId + '") class="navi-link" ><span class="navi-text">Reset Password</span>\</a>\</li>' : '') +
						            '</ul>\
	                            </div>\
	                        </div>\
	                    ';
				},
			}
		],



	});

	//$('#kt_datatable_UserManagement_query').on('change', function () {
	//	datatable.search($(this).val().toLowerCase(), 'email');
	//});
	 // Use regex search with an OR condition	});
};

jQuery(document).ready(function () {
	debugger
	LoadUserManagementGrid();
	var textbox = document.getElementById('kt_datatable_UserManagement_query');
	textbox.value = '';
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

// Reset User Password START
function checkPasswordMatching() {
	if (document.getElementById('newPassword').value ==
		document.getElementById('confirmPassword').value) {

		document.getElementById('mismatchPassword').innerHTML = '';
		document.getElementById('updatePasswordBtn').disabled = false;
		
	} else {
		document.getElementById('mismatchPassword').style.color = 'red';
		document.getElementById('mismatchPassword').innerHTML = 'Passwords do not match';
		document.getElementById('updatePasswordBtn').disabled = true;
	}

}

function resetpasswordmodal(userId) {
	userIdToResetPassword = userId;
	$('#resetpasswordmodal').modal({
		backdrop: 'static',
	});
}

function resetPassword() {
	debugger
	if ($('#resetpassword').valid()) {
		if (userIdToResetPassword) {
			var newPasswordToSave = document.getElementById("newPassword").value;
			if (newPasswordToSave) {
				var myHeaders = new Headers();
				myHeaders.append("Content-Type", "application/json");
				myHeaders.append("Authorization", "Bearer " + getTokenFromSessionStorage());
				var requestOptions = {
					method: 'POST',
					headers: myHeaders,
					redirect: 'follow',
					body: JSON.stringify({ userId: userIdToResetPassword, newPassword: newPasswordToSave })
				};

				$("#divLoader").show();
				commonFetch(BaseUrl + "/auth/users/resetpasswordbyadmin", requestOptions, function (result) {
					if (result != null && result != undefined) {
						if (result.success) {
							$("#divLoader").hide();
							Swal.fire({
								icon: "success",
								title: "Success",
								text: result.message
							});
						}
						else {
							$("#divLoader").hide();
							Swal.fire({
								icon: "error",
								title: "Error",
								text: result.message
							});
						}
					}
					else {
						showSweetAlert("error", "Invalid Response", "");
					}
				})

				//fetch(BaseUrl + "/auth/users/resetpasswordbyadmin", requestOptions)
				//	.then(response => {
				//		return response.json();
				//	})
				//	.then(result => {
				//		if (result.success) {
				//			$("#divLoader").hide();
				//			Swal.fire({
				//				icon: "success",
				//				title: "Success",
				//				text: result.message
				//			});
				//		}
				//		else {
				//			$("#divLoader").hide();
				//			Swal.fire({
				//				icon: "error",
				//				title: "Error",
				//				text: result.message
				//			});
				//                 }
				//	})
				//	.catch(error => {
				//		$("#divLoader").hide();
				//		Swal.fire({
				//			icon: "error",
				//			title: "Error",
				//			text: error
				//		});
				//	})
			}
			else {
				Swal.fire({
					icon: "error",
					title: "Error",
					text: "Password is empty"
				});
			}
		}
	}
	else {
		Swal.fire({
			text: "Please enter mandatory fields to proceed..!",
			icon: "error",
			buttonsStyling: false,
			confirmButtonText: "Ok, got it!",
			customClass: {
				confirmButton: "btn font-weight-bold btn-light"
			}
		}).then(function () {
			KTUtil.scrollTop();
		});
	}
	//if (userIdToResetPassword) {
	//	var newPasswordToSave = document.getElementById("newPassword").value;
	//	if (newPasswordToSave) {
	//		var myHeaders = new Headers();
	//		myHeaders.append("Content-Type", "application/json");
	//		myHeaders.append("Authorization", "Bearer " + getTokenFromSessionStorage());
	//		var requestOptions = {
	//			method: 'POST',
	//			headers: myHeaders,
	//			redirect: 'follow',
	//			body: JSON.stringify({ userId: userIdToResetPassword, newPassword: newPasswordToSave })
	//		};

	//		$("#divLoader").show();
	//		commonFetch(BaseUrl + "/auth/users/resetpasswordbyadmin", requestOptions, function (result) {
	//			if (result != null && result != undefined) {
	//				if (result.success) {
	//					$("#divLoader").hide();
	//					Swal.fire({
	//						icon: "success",
	//						title: "Success",
	//						text: result.message
	//					});
	//				}
	//				else {
	//					$("#divLoader").hide();
	//					Swal.fire({
	//						icon: "error",
	//						title: "Error",
	//						text: result.message
	//					});
	//				}
	//			}
	//			else {
	//				showSweetAlert("error", "Invalid Response", "");
	//			}
	//		})

	//		//fetch(BaseUrl + "/auth/users/resetpasswordbyadmin", requestOptions)
	//		//	.then(response => {
	//		//		return response.json();
	//		//	})
	//		//	.then(result => {
	//		//		if (result.success) {
	//		//			$("#divLoader").hide();
	//		//			Swal.fire({
	//		//				icon: "success",
	//		//				title: "Success",
	//		//				text: result.message
	//		//			});
	//		//		}
	//		//		else {
	//		//			$("#divLoader").hide();
	//		//			Swal.fire({
	//		//				icon: "error",
	//		//				title: "Error",
	//		//				text: result.message
	//		//			});
 //  //                 }
	//		//	})
	//		//	.catch(error => {
	//		//		$("#divLoader").hide();
	//		//		Swal.fire({
	//		//			icon: "error",
	//		//			title: "Error",
	//		//			text: error
	//		//		});
	//		//	})
	//	}
	//	else {
	//		Swal.fire({
	//			icon: "error",
	//			title: "Error",
	//			text: "Password is empty"
	//		});
 //       }
 //   }
	
}

// Reset User Password END
