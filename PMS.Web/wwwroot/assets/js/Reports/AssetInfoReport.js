var MasterURL = BaseUrl + "/api/setups";

var LoadPricingPlanGrid;
var start;
var end;


jQuery(document).ready(function () {
	end = moment().subtract(1, "days");
	KTBootstrapDaterangepicker.init();
	KTDatatableAutoColumnHideDemo.init();
	LoadAssetInfoGrid();

});





var KTDatatableAutoColumnHideDemo = function () {
	// Private functions	
	
	LoadAssetInfoGrid = function () {
		debugger;	
		var datatable = $('#asset_info_datatable').KTDatatable({
			// datasource definition
			data: {
				type: 'remote',
				source: {
					read: {
						url: MasterURL + "/reportsgridbyparams",
						method: 'GET',
						params: {
							ServerGridCall: true,
							StartDate: "2009-11-13T13:13:02.925Z", 
							EndDate: "2023-11-13T13:13:02.925Z",
							ReportId: "2",
							//LessorId: null
						},
						headers: {
							'Content-Type': "application/json", 
							'Authorization': "Bearer " + getTokenFromSessionStorage()
						},
						map: function (raw) {
							debugger
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
				scroll: true,
				scrollX: true
			},
			sortable: true,
			pagination: true,
			columns: [
				{
					field: 'Contract_Reference_Number',
					title: 'Contract Reference Number',
					autoHide: false,
					width: 50
					// callback function support for column rendering
				},

				{
					field: 'Contract_Registration_Number',
					title: 'Contract Registration Number',
					autoHide: false,
					// callback function support for column rendering
				},
				{
					field: 'Asset_Registration_Number',
					title: 'Asset Registration Number',
					autoHide: false,
					// callback function support for column rendering
				},
				{
					field: 'Purpose_Of_Sending_Contract_Information',
					title: 'Contract Sending Purpose',
					autoHide: false,
					// callback function support for column rendering
				},
				{
					field: 'Asset_Type',
					//title: 'Purpose of Sending Contract Information',
					title: 'Asset Type',
					autoHide: false,
					// callback function support for column rendering
				},
				{
					field: 'Asset_Primary_Value',
					//title: 'Count(Asset Registration Number)',
					title: 'The Asset Primary Amount(ASTVAL)', 
					autoHide: false,

					// callback function support for column rendering
				},
				{
					field: 'Ownership_Document_Number',
					//title: 'Count(Asset Registration Number)',
					title: 'Ownership Document Number',
					autoHide: false,

					// callback function support for column rendering
				},
				{
					field: 'Ownership_Document_Type',
					//title: 'Count(Asset Registration Number)',
					title: 'Ownership Document Type',
					autoHide: false,

					// callback function support for column rendering
				},
				{
					//title: 'Count(Asset Registration Number)',
					field: 'Vehicle_Make_English',
					title: 'Vehicle Make',
					autoHide: false,

					// callback function support for column rendering
				},
				{
					//title: 'Count(Asset Registration Number)',
					field: 'Vehicle_Type_English',
					title: 'Vehicle Type',
					autoHide: false,

					// callback function support for column rendering
				},
				{
					//title: 'Count(Asset Registration Number)',
					field: 'Vehicle_Color_English',
					title: 'Vehicle Color',
					autoHide: false,

					// callback function support for column rendering
				},
				{
					field: 'Chassis_Number',
					//title: 'Count(Asset Registration Number)',
					title: 'Chassis Number',
					autoHide: false,

					// callback function support for column rendering
				},
				{
					field: 'License_Plate_Number_Arabic',
					//title: 'Count(Asset Registration Number)',
					title: 'License Plate Number Arabic',
					autoHide: false,

					// callback function support for column rendering
				},
				{
					field: 'License_Plate_Number_English',
					//title: 'Count(Asset Registration Number)',
					title: 'License Plate Number',
					autoHide: false,

					// callback function support for column rendering
				},
				{
					field: 'Vehicle_Year_Of_Manufacturing',
					//title: 'Count(Asset Registration Number)',
					title: 'Vehicle Manufacturing Year',
					autoHide: false,

					// callback function support for column rendering
				},
				{
					field: 'Country_of_manufacturing_of_the_asset',
					//title: 'Count(Asset Registration Number)',
					title: 'Asset Manufacturing Country',
					autoHide: false,

					// callback function support for column rendering
				},
				{
					field: 'Asset_Number',
					//title: 'Count(Asset Registration Number)',
					title: 'Asset Number',
					autoHide: false,

					// callback function support for column rendering
				}
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
	
	};




	return {
		// public functions
		init: function () {
			LoadAssetInfoGrid();

		},
	};
}();




var KTBootstrapDaterangepicker = function () {

	// Private functions
	var demos = function () {
		// minimum setup
		$('#kt_daterangepicker_1, #kt_daterangepicker_1_modal').daterangepicker({
			buttonClasses: ' btn',
			applyClass: 'btn-primary',
			cancelClass: 'btn-secondary'
		});

		// input group and left alignment setup
		$('#kt_daterangepicker_2').daterangepicker({
			buttonClasses: ' btn',
			applyClass: 'btn-primary',
			cancelClass: 'btn-secondary'
		}, function (start, end, label) {
			$('#kt_daterangepicker_2 .form-control').val(start.format('YYYY-MM-DD') + ' / ' + end.format('YYYY-MM-DD'));
		});

		$('#kt_daterangepicker_2_modal').daterangepicker({
			buttonClasses: ' btn',
			applyClass: 'btn-primary',
			cancelClass: 'btn-secondary'
		}, function (start, end, label) {
			$('#kt_daterangepicker_2 .form-control').val(start.format('YYYY-MM-DD') + ' / ' + end.format('YYYY-MM-DD'));
		});

		// left alignment setup
		$('#kt_daterangepicker_3').daterangepicker({
			buttonClasses: ' btn',
			applyClass: 'btn-primary',
			cancelClass: 'btn-secondary'
		}, function (start, end, label) {
			$('#kt_daterangepicker_3 .form-control').val(start.format('YYYY-MM-DD') + ' / ' + end.format('YYYY-MM-DD'));
		});

		$('#kt_daterangepicker_3_modal').daterangepicker({
			buttonClasses: ' btn',
			applyClass: 'btn-primary',
			cancelClass: 'btn-secondary'
		}, function (start, end, label) {
			$('#kt_daterangepicker_3 .form-control').val(start.format('YYYY-MM-DD') + ' / ' + end.format('YYYY-MM-DD'));
		});


		// date & time
		$('#kt_daterangepicker_4').daterangepicker({
			buttonClasses: ' btn',
			applyClass: 'btn-primary',
			cancelClass: 'btn-secondary',

			timePicker: true,
			timePickerIncrement: 30,
			locale: {
				format: 'MM/DD/YYYY h:mm A'
			}
		}, function (start, end, label) {
			$('#kt_daterangepicker_4 .form-control').val(start.format('MM/DD/YYYY h:mm A') + ' / ' + end.format('MM/DD/YYYY h:mm A'));
		});

		// date picker
		$('#kt_daterangepicker_5').daterangepicker({
			buttonClasses: ' btn',
			applyClass: 'btn-primary',
			cancelClass: 'btn-secondary',

			singleDatePicker: true,
			showDropdowns: true,
			locale: {
				format: 'MM/DD/YYYY'
			}
		}, function (start, end, label) {
			$('#kt_daterangepicker_5 .form-control').val(start.format('MM/DD/YYYY') + ' / ' + end.format('MM/DD/YYYY'));
		});

		// predefined ranges
		var start = moment().subtract(29, 'days');
		var end = moment();

		$('#kt_daterangepicker_6').daterangepicker({
			buttonClasses: ' btn',
			applyClass: 'btn-primary',
			cancelClass: 'btn-secondary',

			startDate: start,
			endDate: end,
			ranges: {
				'Today': [moment(), moment()],
				'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
				'Last 7 Days': [moment().subtract(6, 'days'), moment()],
				'Last 30 Days': [moment().subtract(29, 'days'), moment()],
				'This Month': [moment().startOf('month'), moment().endOf('month')],
				'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
			}
		}, function (start, end, label) {
			$('#kt_daterangepicker_6 .form-control').val(start.format('MM/DD/YYYY') + ' / ' + end.format('MM/DD/YYYY'));
		});
	}

	return {
		// public functions
		init: function () {
			demos();
		}
	};
}();

