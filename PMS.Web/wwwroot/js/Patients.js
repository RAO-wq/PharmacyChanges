function LoadPatientsGrid() {
    var datatable = $('#Patients_Grid').KTDatatable({
        data: {
            type: 'local',
            source: [
                { "patientId": 1, "name": "John Doe", "age": 45, "gender": "Male", "lastVisit": "2023-09-12" },
                { "patientId": 2, "name": "Jane Smith", "age": 32, "gender": "Female", "lastVisit": "2023-08-15" },
                { "patientId": 3, "name": "Robert Brown", "age": 29, "gender": "Male", "lastVisit": "2023-10-01" },
                { "patientId": 4, "name": "Emily Davis", "age": 54, "gender": "Female", "lastVisit": "2023-07-22" },
                { "patientId": 5, "name": "Michael Wilson", "age": 40, "gender": "Male", "lastVisit": "2023-06-18" },
                { "patientId": 6, "name": "Laura Martinez", "age": 37, "gender": "Female", "lastVisit": "2023-09-05" },
                { "patientId": 7, "name": "James Lee", "age": 61, "gender": "Male", "lastVisit": "2023-03-12" },
                { "patientId": 8, "name": "Anna Lopez", "age": 28, "gender": "Female", "lastVisit": "2023-08-20" },
                { "patientId": 9, "name": "Charles Green", "age": 47, "gender": "Male", "lastVisit": "2023-05-18" },
                { "patientId": 10, "name": "Samantha Harris", "age": 50, "gender": "Female", "lastVisit": "2023-01-11" },
                { "patientId": 11, "name": "William Hall", "age": 55, "gender": "Male", "lastVisit": "2023-02-25" },
                { "patientId": 12, "name": "Olivia King", "age": 30, "gender": "Female", "lastVisit": "2023-04-14" },
                { "patientId": 13, "name": "Henry Scott", "age": 39, "gender": "Male", "lastVisit": "2023-09-30" },
                { "patientId": 14, "name": "Sophia Clark", "age": 26, "gender": "Female", "lastVisit": "2023-07-04" },
                { "patientId": 15, "name": "Christopher Moore", "age": 34, "gender": "Male", "lastVisit": "2023-06-23" },
                { "patientId": 16, "name": "Lisa Walker", "age": 33, "gender": "Female", "lastVisit": "2023-05-08" },
                { "patientId": 17, "name": "David Young", "age": 48, "gender": "Male", "lastVisit": "2023-10-10" },
                { "patientId": 18, "name": "Karen Allen", "age": 29, "gender": "Female", "lastVisit": "2023-02-17" },
                { "patientId": 19, "name": "Daniel Hernandez", "age": 41, "gender": "Male", "lastVisit": "2023-06-15" },
                { "patientId": 20, "name": "Megan Adams", "age": 52, "gender": "Female", "lastVisit": "2023-04-25" },
                { "patientId": 21, "name": "Anthony Wright", "age": 36, "gender": "Male", "lastVisit": "2023-03-03" },
                { "patientId": 22, "name": "Patricia Baker", "age": 27, "gender": "Female", "lastVisit": "2023-05-29" },
                { "patientId": 23, "name": "Brian Nelson", "age": 49, "gender": "Male", "lastVisit": "2023-04-10" },
                { "patientId": 24, "name": "Rachel Carter", "age": 35, "gender": "Female", "lastVisit": "2023-08-08" },
                { "patientId": 25, "name": "George Mitchell", "age": 60, "gender": "Male", "lastVisit": "2023-09-19" }
            ],
            pageSize: 10,
        },
        layout: {
            scroll: true,
            footer: false
        },
        sortable: true,
        pagination: true,
        search: {
            input: $('#kt_datatable_search_query'),
        },
        columns: [
            {
                field: 'patientId',
                title: 'Patient ID',
                width: 100,
            },
            {
                field: 'name',
                title: 'Name',
            },
            {
                field: 'age',
                title: 'Age',
            },
            {
                field: 'gender',
                title: 'Gender',
            },
            {
                field: 'lastVisit',
                title: 'Last Visit',
                type: 'date',
                format: 'YYYY-MM-DD'
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
                            <a onclick="EditOrViewDetails(\'' + row.patientId + '\', \'View\')" class="navi-link">\
                                <span class="navi-text">View Details</span>\
                            </a>\
                        </li>\
                        <li class="navi-item">\
                            <a onclick="EditOrViewDetails(\'' + row.patientId + '\', \'Edit\')" class="navi-link">\
                                <span class="navi-text">Edit Details</span>\
                            </a>\
                        </li>\
                    </ul>\
                </div>\
            </div>\
        ';
                }
            }


        ]
    });
}

jQuery(document).ready(function () {
    LoadPatientsGrid();
});
