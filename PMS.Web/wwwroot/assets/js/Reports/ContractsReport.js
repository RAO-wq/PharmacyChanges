var MasterURL = BaseUrl + "/api/setups";

var LoadPricingPlanGrid;
var start;
var end;


jQuery(document).ready(function () {
	end = moment().subtract(1, "days");
	KTBootstrapDaterangepicker.init();
	KTDatatableAutoColumnHideDemo.init();
	LoadContractsReportGrid();

});





var KTDatatableAutoColumnHideDemo = function () {
	// Private functions	
	
	LoadContractsReportGrid = function () {
		debugger;	
		var datatable = $('#contracts_report_datatable').KTDatatable({
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
							ReportId: "6",
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
					title: 'Purpose Code',
					autoHide: false,
					// callback function support for column rendering
				},
				{
					field: 'Accept_date',
					//title: 'Purpose of Sending Contract Information',
					title: 'Accept Date',
					autoHide: false,
					// callback function support for column rendering
				},
				{
					field: 'Lessor_Name_English',
					title: 'Lessor Name',
					autoHide: false,
					width: 50
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
			LoadContractsReportGrid();

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

