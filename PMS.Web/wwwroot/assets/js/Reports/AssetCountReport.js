var MasterURL = BaseUrl + "/api/setups";

var LoadPricingPlanGrid;
var start;
var end;


jQuery(document).ready(function () {
	end = moment().subtract(1, "days");
	KTBootstrapDaterangepicker.init();
	KTDatatableAutoColumnHideDemo.init();
	LoadAssetCountGrid();

});





var KTDatatableAutoColumnHideDemo = function () {
	// Private functions	
	
	LoadAssetCountGrid = function () {
		debugger;	
		// Get the selected date range from the daterangepicker
		var datepickerData = $('#kt_daterangepicker_1').data('daterangepicker');
		var startDate = datepickerData.startDate.format('YYYY-MM-DDTHH:mm:ss.SSS') + 'Z';
		var endDate = datepickerData.endDate.format('YYYY-MM-DDTHH:mm:ss.SSS') + 'Z';


		var datatable = $('#asset_count_datatable').KTDatatable({
			// datasource definition
			data: {
				type: 'remote',
				source: {
					read: {
						url: MasterURL + "/reportsgridbyparams",
						method: 'GET',
						params: {
							ServerGridCall: true,
							//StartDate: "2009-11-13T13:13:02.925Z", 
							//EndDate: "2023-11-13T13:13:02.925Z",
							StartDate: startDate,
							EndDate: endDate,
							ReportId: "1",
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
				scroll: true
			},
			sortable: true,
			pagination: true,
			columns: [
				{
					field: 'Client_Type',
					title: 'Client Type',
					autoHide: false,
					width: 50
					// callback function support for column rendering
				},

				{
					field: 'Lessor_Name',
					title: 'Lessor Name',
					autoHide: false,
					// callback function support for column rendering
				},
				{
					field: 'Contract_Type_Code',
					title: 'Contract Type Code',
					autoHide: false,
					// callback function support for column rendering
				},
				{
					field: 'Contract_Type',
					title: 'Contract Type',
					autoHide: false,
					// callback function support for column rendering
				},
				{
					field: 'Contract_Purpose',
					//title: 'Purpose of Sending Contract Information',
					title: 'Contract Sending Purpose',
					autoHide: false,
					// callback function support for column rendering
				},
				{
					field: 'Asset_Registration_Count',
					//title: 'Count(Asset Registration Number)',
					title: 'Count(ARN)',
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
			LoadAssetCountGrid();

		},
	};
}();

// Handle Apply button click
$('.applyBtn').on('click', function () {
	debugger;
	LoadAssetCountGrid();
});


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

