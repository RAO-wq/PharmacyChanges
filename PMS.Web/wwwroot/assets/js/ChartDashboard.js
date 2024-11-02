var MasterURL = BaseUrl + "/api/Admin";
var list = [];
var root;
var test2;
var top10RejReasonsRoot;
var assetsChartDiv;
var chart_Assets_Closure;
var chart_Duration_Analysis;
var chart_OpenYear_Purpose;
var chart_OpenYear_Lessor;
var chart_Lifting_Financial_Product;
var chart_Accept_Date;
var chart_Accept_Date_Lessor;
var chart_Open_Date_Month;
var chart_Open_Date_Month_By_Lessor;
var chart_Open_Date_Year;
var stackedChart;

var defaultStartDate;
var defaultEndDate;

var chart1 = null;
var chart2 = null;
var chart3 = null;
var chart4 = null;
var chart5 = null;
var chart6 = null;
var chart7 = null;
var chart8 = null;
var chart9 = null;
var chart10 = null;
var chart11 = null;
var chart12 = null;
var chart13 = null;
var chart14 = null;
var chart15 = null;
var chart16 = null;
var chart17 = null;
var chart18 = null;
var chart19 = null;
var chart20 = null;
var chart56 = null;
var chart57 = null;
var chartDuration = null;
var CHART_CALLS = [];

const CHART_COLORS = {
    orange: 'rgb(255, 159, 64)',
    yellow: 'rgb(255, 205, 86)',
    green: 'rgb(75, 192, 192)',
    blue: 'rgb(54, 162, 235)',
    red: 'rgb(255, 99, 132)',
    purple: 'rgb(153, 102, 255)',
    grey: 'rgb(201, 203, 207)'
};

var fromDate = '';
var toDate = '';

jQuery(document).ready(function () {

    //analytics1();
    //canvas9();
    //canvas10();

    //stackedChart = am5.Root.new("stackedChart100");
    //top10RejReasonsRoot = am5.Root.new("top10RejReasons");

    //root = am5.Root.new("chartdiv");
    //assetsChartDiv = am5.Root.new("chart_Assets");
    //chart_Assets_Closure = am5.Root.new("chart_Assets_Closure");
    //chart_Duration_Analysis = am5.Root.new("chart_Duration_Analysis");
    //chart_OpenYear_Purpose = am5.Root.new("chart_OpenYear_Purpose");
    //chart_OpenYear_Lessor = am5.Root.new("chart_OpenYear_Lessor");
    //chart_Lifting_Financial_Product = am5.Root.new("chart_Lifting_Financial_Product");
    //chart_Accept_Date = am5.Root.new("chart_Accept_Date");
    //chart_Accept_Date_Lessor = am5.Root.new("chart_Accept_Date_Lessor");
    //chart_Open_Date_Month = am5.Root.new("chart_Open_Date_Month");
    //chart_Open_Date_Month_By_Lessor = am5.Root.new("chart_Open_Date_Month_By_Lessor");
    //chart_Open_Date_Year = am5.Root.new("chart_Open_Date_Year");

    KTBootstrapDaterangepicker.init();

    GetLessorTypeCompanies();
    var ApprovedCounts = sessionStorage.getItem('ApprovedCounts');
    var PendingCounts = sessionStorage.getItem('PendingCounts');
    var RejectedCounts = sessionStorage.getItem('RejectedCounts');
    var TotalContractsCounts = sessionStorage.getItem('TotalContractsCounts');
    var StatusCounts = sessionStorage.getItem('StatusCounts');

    GetAllActionType();
});

function chartfiles(data) {
   
    root.container.children.clear();
    root.setThemes([
        am5themes_Animated.new(root)
    ]);


    var chart = root.container.children.push(am5percent.PieChart.new(root, {
        layout: root.verticalLayout
    }));

    var series = chart.series.push(am5percent.PieSeries.new(root, {
        valueField: "Total_Leasing_Amount",
        categoryField: "Product"
    }));

    if (data.data.length > 0) {
        series.data.setAll(data.data);
       
        series.appear(1000, 100);
    }
    else {
        series.data.setAll([
            { Total_Leasing_Amount: 0, Lessor_name: "" },
        ]);
    }
   
}

function assetsChart(data) {

 
    assetsChartDiv.container.children.clear();
    assetsChartDiv.setThemes([
        am5themes_Animated.new(assetsChartDiv)
    ]);

    var chart = assetsChartDiv.container.children.push(am5percent.PieChart.new(assetsChartDiv, {
        layout: assetsChartDiv.verticalLayout
    }));

    var series = chart.series.push(am5percent.PieSeries.new(assetsChartDiv, {
        valueField: "No_Of_Asset",
        categoryField: "Product"
    }));

    if (data.data.length > 0) {
        series.data.setAll(data.data);
        
        series.appear(1000, 100);
    }
    else {
        series.data.setAll([
            { Total_Leasing_Amount: 0, Lessor_name: "" },
        ]);
    }
    
}

function assetsChartByClosure(data) {

   
    chart_Assets_Closure.container.children.clear();
    chart_Assets_Closure.setThemes([
        am5themes_Animated.new(chart_Assets_Closure)
    ]);


    var chart = chart_Assets_Closure.container.children.push(am5percent.PieChart.new(chart_Assets_Closure, {
        layout: chart_Assets_Closure.verticalLayout
    }));

    var series = chart.series.push(am5percent.PieSeries.new(chart_Assets_Closure, {
        valueField: "No_Of_Assets",
        categoryField: "Closure_Reason"
    }));

    if (data.data.length > 0) {
        series.data.setAll(data.data);
       
        series.appear(1000, 100);
    }
    else {
        series.data.setAll([
            { Total_Leasing_Amount: 0, Lessor_name: "" },
        ]);
    }
   
}

function durationAnalysisChart(data) {

    chart_Duration_Analysis.container.children.clear();
    chart_Duration_Analysis.setThemes([
        am5themes_Animated.new(chart_Duration_Analysis)
    ]);

    var chart = chart_Duration_Analysis.container.children.push(am5xy.XYChart.new(chart_Duration_Analysis, {
        panX: true,
        panY: true,
        wheelX: "panX",
        wheelY: "zoomX",
        pinchZoomX: true,
        paddingLeft: 0,
        paddingRight: 1
    }));

    var cursor = chart.set("cursor", am5xy.XYCursor.new(chart_Duration_Analysis, {}));
    cursor.lineY.set("visible", false);

    var xRenderer = am5xy.AxisRendererX.new(chart_Duration_Analysis, {
        minGridDistance: 30,
        minorGridEnabled: true
    });

    xRenderer.labels.template.setAll({
        rotation: -90,
        centerY: am5.p50,
        centerX: am5.p100,
        paddingRight: 15
    });

    xRenderer.grid.template.setAll({
        location: 1
    })

    var xAxis = chart.xAxes.push(am5xy.CategoryAxis.new(chart_Duration_Analysis, {
        maxDeviation: 0.3,
        categoryField: "Company_Name",
        renderer: xRenderer,
        tooltip: am5.Tooltip.new(chart_Duration_Analysis, {})
    }));

    var yRenderer = am5xy.AxisRendererY.new(chart_Duration_Analysis, {
        strokeOpacity: 0.1
    })

    var yAxis = chart.yAxes.push(am5xy.ValueAxis.new(chart_Duration_Analysis, {
        maxDeviation: 0.3,
        renderer: yRenderer
    }));

    var series = chart.series.push(am5xy.ColumnSeries.new(chart_Duration_Analysis, {
        name: "Series 1",
        xAxis: xAxis,
        yAxis: yAxis,
        valueYField: "Duration",
        sequencedInterpolation: true,
        categoryXField: "Company_Name",
        tooltip: am5.Tooltip.new(chart_Duration_Analysis, {
            labelText: "{valueY}"
        })
    }));

    series.columns.template.setAll({ cornerRadiusTL: 5, cornerRadiusTR: 5, strokeOpacity: 0 });
    series.columns.template.adapters.add("fill", function (fill, target) {
        return chart.get("colors").getIndex(series.columns.indexOf(target));
    });

    series.columns.template.adapters.add("stroke", function (stroke, target) {
        return chart.get("colors").getIndex(series.columns.indexOf(target));
    });

    xAxis.data.setAll(data.data);
    series.data.setAll(data.data);


    series.appear(1000);
    chart.appear(1000, 100);

}

function openYearPurposeChart(data) {

    const modifiedArray = [];

    // Organize data based on "Year_Contract_Open_Date"
    data.data.forEach(entry => {
        const year = entry.Year_Contract_Open_Date;

        // Check if there's an entry for the current year in modifiedArray
        let yearEntry = modifiedArray.find(item => item.Year_Contract_Open_Date === year);

        // If not, create a new entry
        if (!yearEntry) {
            yearEntry = { Year_Contract_Open_Date: year };
            modifiedArray.push(yearEntry);
        }

        // Add product and amount to the entry
        yearEntry[entry.Purpose] = entry.No_Of_Asset;
    });

    chart_OpenYear_Purpose.container.children.clear();
    chart_OpenYear_Purpose.setThemes([
        am5themes_Animated.new(root)
    ]);

    var chart = chart_OpenYear_Purpose.container.children.push(
        am5xy.XYChart.new(chart_OpenYear_Purpose, {
            panX: true,
            panY: true,
            wheelX: "panX",
            wheelY: "zoomX",
            layout: chart_OpenYear_Purpose.verticalLayout,
            pinchZoomX: true
        })
    );

    var cursor = chart.set("cursor", am5xy.XYCursor.new(chart_OpenYear_Purpose, {
        behavior: "none"
    }));
    cursor.lineY.set("visible", false);

    var xRenderer = am5xy.AxisRendererX.new(chart_OpenYear_Purpose, {
        minorGridEnabled: true
    });
    xRenderer.grid.template.set("location", 0.5);
    xRenderer.labels.template.setAll({
        location: 0.5,
        multiLocation: 0.5
    });

    var xAxis = chart.xAxes.push(
        am5xy.CategoryAxis.new(chart_OpenYear_Purpose, {
            categoryField: "Year_Contract_Open_Date",
            renderer: xRenderer,
            tooltip: am5.Tooltip.new(chart_OpenYear_Purpose, {})
        })
    );

    xAxis.data.setAll(modifiedArray);

    var yAxis = chart.yAxes.push(
        am5xy.ValueAxis.new(chart_OpenYear_Purpose, {
            maxPrecision: 0,
            renderer: am5xy.AxisRendererY.new(chart_OpenYear_Purpose, {
                inversed: false
            })
        })
    );

 
    function createSeries(name, field) {
        var series = chart.series.push(
            am5xy.LineSeries.new(chart_OpenYear_Purpose, {
                name: name,
                xAxis: xAxis,
                yAxis: yAxis,
                valueYField: field,
                categoryXField: "Year_Contract_Open_Date",
                tooltip: am5.Tooltip.new(chart_OpenYear_Purpose, {
                    pointerOrientation: "horizontal",
                    labelText: "[bold]{name}[/]\n{categoryX}: {valueY}"
                })
            })
        );


        series.bullets.push(function () {
            return am5.Bullet.new(chart_OpenYear_Purpose, {
                sprite: am5.Circle.new(chart_OpenYear_Purpose, {
                    radius: 5,
                    fill: series.get("fill")
                })
            });
        });

       
        series.set("setStateOnChildren", true);
        series.states.create("hover", {});

        series.mainContainer.set("setStateOnChildren", true);
        series.mainContainer.states.create("hover", {});

        series.strokes.template.states.create("hover", {
            strokeWidth: 4
        });

        series.data.setAll(modifiedArray);
        series.appear(1000);
    }
    const distinctKeys = new Set();

    // Loop through resultData and pass distinct key-value pairs to your method
    modifiedArray.forEach(entry => {
        Object.keys(entry).forEach(key => {
            if (key !== 'Year_Contract_Open_Date' && !distinctKeys.has(key)) {
                const value = entry[key];
                createSeries(key, key);

                // Add the key to the set to mark it as encountered
                distinctKeys.add(key);
            }
        });
    });

    // Clear the set for future use (if needed)
    distinctKeys.clear();

    chart.set("scrollbarX", am5.Scrollbar.new(chart_OpenYear_Purpose, {
        orientation: "horizontal",
        marginBottom: 20
    }));

    var legend = chart.children.push(
        am5.Legend.new(chart_OpenYear_Purpose, {
            centerX: am5.p50,
            x: am5.p50
        })
    );

    legend.itemContainers.template.states.create("hover", {});

    legend.itemContainers.template.events.on("pointerover", function (e) {
        e.target.dataItem.dataContext.hover();
    });
    legend.itemContainers.template.events.on("pointerout", function (e) {
        e.target.dataItem.dataContext.unhover();
    });

    legend.data.setAll(chart.series.values);

  
    chart.appear(1000, 100);
}

function openYearPurposeChartByLessor(data) {

    const modifiedArray = [];

    // Organize data based on "Year_Contract_Open_Date"
    data.data.forEach(entry => {
        const year = entry.Year_Contract_Open_Date;

        // Check if there's an entry for the current year in modifiedArray
        let yearEntry = modifiedArray.find(item => item.Year_Contract_Open_Date === year);

        // If not, create a new entry
        if (!yearEntry) {
            yearEntry = { Year_Contract_Open_Date: year };
            modifiedArray.push(yearEntry);
        }

        // Add product and amount to the entry
        yearEntry[entry.Lessor_name] = entry.No_Of_Asset;
    });

    chart_OpenYear_Lessor.container.children.clear();
    chart_OpenYear_Lessor.setThemes([
        am5themes_Animated.new(root)
    ]);

    // Create chart
    // https://www.amcharts.com/docs/v5/charts/xy-chart/
    var chart = chart_OpenYear_Lessor.container.children.push(
        am5xy.XYChart.new(chart_OpenYear_Lessor, {
            panX: true,
            panY: true,
            wheelX: "panX",
            wheelY: "zoomX",
            layout: chart_OpenYear_Lessor.verticalLayout,
            pinchZoomX: true
        })
    );

  
    var cursor = chart.set("cursor", am5xy.XYCursor.new(chart_OpenYear_Lessor, {
        behavior: "none"
    }));
    cursor.lineY.set("visible", false);

 
    var xRenderer = am5xy.AxisRendererX.new(chart_OpenYear_Lessor, {
        minorGridEnabled: true
    });
    xRenderer.grid.template.set("location", 0.5);
    xRenderer.labels.template.setAll({
        location: 0.5,
        multiLocation: 0.5
    });

    var xAxis = chart.xAxes.push(
        am5xy.CategoryAxis.new(chart_OpenYear_Lessor, {
            categoryField: "Year_Contract_Open_Date",
            renderer: xRenderer,
            tooltip: am5.Tooltip.new(chart_OpenYear_Lessor, {})
        })
    );

    xAxis.data.setAll(modifiedArray);

    var yAxis = chart.yAxes.push(
        am5xy.ValueAxis.new(chart_OpenYear_Lessor, {
            maxPrecision: 0,
            renderer: am5xy.AxisRendererY.new(chart_OpenYear_Lessor, {
                inversed: false
            })
        })
    );

    function createSeries(name, field) {
        var series = chart.series.push(
            am5xy.LineSeries.new(chart_OpenYear_Lessor, {
                name: name,
                xAxis: xAxis,
                yAxis: yAxis,
                valueYField: field,
                categoryXField: "Year_Contract_Open_Date",
                tooltip: am5.Tooltip.new(chart_OpenYear_Lessor, {
                    pointerOrientation: "horizontal",
                    labelText: "[bold]{name}[/]\n{categoryX}: {valueY}"
                })
            })
        );


        series.bullets.push(function () {
            return am5.Bullet.new(chart_OpenYear_Lessor, {
                sprite: am5.Circle.new(chart_OpenYear_Lessor, {
                    radius: 5,
                    fill: series.get("fill")
                })
            });
        });

        series.set("setStateOnChildren", true);
        series.states.create("hover", {});

        series.mainContainer.set("setStateOnChildren", true);
        series.mainContainer.states.create("hover", {});

        series.strokes.template.states.create("hover", {
            strokeWidth: 4
        });

        series.data.setAll(modifiedArray);
        series.appear(1000);
    }

    const distinctKeys = new Set();

    // Loop through resultData and pass distinct key-value pairs to your method
    modifiedArray.forEach(entry => {
        Object.keys(entry).forEach(key => {
            if (key !== 'Year_Contract_Open_Date' && !distinctKeys.has(key)) {
                const value = entry[key];
                createSeries(key, key);

                // Add the key to the set to mark it as encountered
                distinctKeys.add(key);
            }
        });
    });

    // Clear the set for future use (if needed)
    distinctKeys.clear();

  
    chart.set("scrollbarX", am5.Scrollbar.new(chart_OpenYear_Lessor, {
        orientation: "horizontal",
        marginBottom: 20
    }));

    var legend = chart.children.push(
        am5.Legend.new(chart_OpenYear_Lessor, {
            centerX: am5.p50,
            x: am5.p50
        })
    );

    // Make series change state when legend item is hovered
    legend.itemContainers.template.states.create("hover", {});

    legend.itemContainers.template.events.on("pointerover", function (e) {
        e.target.dataItem.dataContext.hover();
    });
    legend.itemContainers.template.events.on("pointerout", function (e) {
        e.target.dataItem.dataContext.unhover();
    });

    legend.data.setAll(chart.series.values);

    chart.appear(1000, 100);
}

function chartLiftingFinancialProduct(data) {
    var transformedData = data.data.reduce(function (acc, item) {
        var lessorName = item.Lessor_name.toLowerCase();
        var purpose = item.Purpose.toLowerCase().replace(/ /g, '_');

        if (!acc[lessorName]) {
            acc[lessorName] = {
                "lessor_name": lessorName
            };
        }

        acc[lessorName][purpose] = (acc[lessorName][purpose] || 0) + item.No_Of_Asset;

        return acc;
    }, {});

    // Convert the transformed data object into an array
    var dataArray = Object.values(transformedData);

    console.log(dataArray);

    chart_Lifting_Financial_Product.container.children.clear();
    chart_Lifting_Financial_Product.setThemes([
        am5themes_Animated.new(chart_Lifting_Financial_Product)
    ]);


    var chart = chart_Lifting_Financial_Product.container.children.push(am5xy.XYChart.new(chart_Lifting_Financial_Product, {
        panX: false,
        panY: false,
        paddingLeft: 0,
        wheelX: "panX",
        wheelY: "zoomX",
        layout: chart_Lifting_Financial_Product.verticalLayout
    }));


    var legend = chart.children.push(
        am5.Legend.new(chart_Lifting_Financial_Product, {
            centerX: am5.p50,
            x: am5.p50
        })
    );


    var xRenderer = am5xy.AxisRendererX.new(chart_Lifting_Financial_Product, {
        cellStartLocation: 0.1,
        cellEndLocation: 0.9,
        minorGridEnabled: true
    })

    var xAxis = chart.xAxes.push(am5xy.CategoryAxis.new(chart_Lifting_Financial_Product, {
        categoryField: "lessor_name",
        renderer: xRenderer,
        tooltip: am5.Tooltip.new(chart_Lifting_Financial_Product, {})
    }));

    xRenderer.grid.template.setAll({
        location: 1
    })

    xAxis.data.setAll(dataArray);

    var yAxis = chart.yAxes.push(am5xy.ValueAxis.new(chart_Lifting_Financial_Product, {
        renderer: am5xy.AxisRendererY.new(chart_Lifting_Financial_Product, {
            strokeOpacity: 0.1
        })
    }));

    function makeSeries(name, fieldName) {

        var series = chart.series.push(am5xy.ColumnSeries.new(chart_Lifting_Financial_Product, {
            name: name,
            xAxis: xAxis,
            yAxis: yAxis,
            valueYField: fieldName,
            categoryXField: "lessor_name"
        }));

        series.columns.template.setAll({
            tooltipText: "{name}, {categoryX}:{valueY}",
            width: am5.percent(90),
            tooltipY: 0,
            strokeOpacity: 0
        });


        series.data.setAll(dataArray);

        // Make stuff animate on load
    
        series.appear();

        series.bullets.push(function () {
            return am5.Bullet.new(chart_Lifting_Financial_Product, {
                locationY: 0,
                sprite: am5.Label.new(chart_Lifting_Financial_Product, {
                    text: "{valueY}",
                    fill: chart_Lifting_Financial_Product.interfaceColors.get("alternativeText"),
                    centerY: 0,
                    centerX: am5.p50,
                    populateText: true
                })
            });
        });

        legend.data.push(series);
    }

    const distinctKeys = new Set();
    for (const record of dataArray) {
        for (const key in record) {
            if (record.hasOwnProperty(key) && key !== 'lessor_name') {
                distinctKeys.add(key);
            }
        }
    }

    for (const key of distinctKeys) {
        makeSeries(key.replace('_', ' '), key);
    }

    console.log("------------");


    // Make stuff animate on load

    chart.appear(1000, 100);
}

function chartAcceptDate(data) {
    var transformedData = data.data.reduce(function (acc, item) {
        var lessorName = item.Month_Year.toLowerCase();
        var purpose = item.Purpose.toLowerCase().replace(/ /g, '_');

        if (!acc[lessorName]) {
            acc[lessorName] = {
                "lessor_name": lessorName
            };
        }

        acc[lessorName][purpose] = (acc[lessorName][purpose] || 0) + item.No_Of_Asset;

        return acc;
    }, {});

    // Convert the transformed data object into an array
    var dataArray = Object.values(transformedData);

    console.log(dataArray);

    chart_Accept_Date.container.children.clear();
    chart_Accept_Date.setThemes([
        am5themes_Animated.new(chart_Accept_Date)
    ]);


    // Create chart
 
    var chart = chart_Accept_Date.container.children.push(am5xy.XYChart.new(chart_Accept_Date, {
        panX: false,
        panY: false,
        paddingLeft: 0,
        wheelX: "panX",
        wheelY: "zoomX",
        layout: chart_Accept_Date.verticalLayout
    }));


    // Add legend
 
    var legend = chart.children.push(
        am5.Legend.new(chart_Accept_Date, {
            centerX: am5.p50,
            x: am5.p50
        })
    );


    // Create axes
  
    var xRenderer = am5xy.AxisRendererX.new(chart_Accept_Date, {
        cellStartLocation: 0.1,
        cellEndLocation: 0.9,
        minorGridEnabled: true
    })

    var xAxis = chart.xAxes.push(am5xy.CategoryAxis.new(chart_Accept_Date, {
        categoryField: "lessor_name",
        renderer: xRenderer,
        tooltip: am5.Tooltip.new(chart_Accept_Date, {})
    }));

    xRenderer.grid.template.setAll({
        location: 1
    })

    xAxis.data.setAll(dataArray);

    var yAxis = chart.yAxes.push(am5xy.ValueAxis.new(chart_Accept_Date, {
        renderer: am5xy.AxisRendererY.new(chart_Accept_Date, {
            strokeOpacity: 0.1
        })
    }));

    function makeSeries(name, fieldName) {

        var series = chart.series.push(am5xy.ColumnSeries.new(chart_Accept_Date, {
            name: name,
            xAxis: xAxis,
            yAxis: yAxis,
            valueYField: fieldName,
            categoryXField: "lessor_name"
        }));

        series.columns.template.setAll({
            tooltipText: "{name}, {categoryX}:{valueY}",
            width: am5.percent(90),
            tooltipY: 0,
            strokeOpacity: 0
        });


        series.data.setAll(dataArray);

        // Make stuff animate on load
    
        series.appear();

        series.bullets.push(function () {
            return am5.Bullet.new(chart_Accept_Date, {
                locationY: 0,
                sprite: am5.Label.new(chart_Accept_Date, {
                    text: "{valueY}",
                    fill: chart_Accept_Date.interfaceColors.get("alternativeText"),
                    centerY: 0,
                    centerX: am5.p50,
                    populateText: true
                })
            });
        });

        legend.data.push(series);
    }

    const distinctKeys = new Set();
    for (const record of dataArray) {
        for (const key in record) {
            if (record.hasOwnProperty(key) && key !== 'lessor_name') {
                distinctKeys.add(key);
            }
        }
    }

    for (const key of distinctKeys) {
        makeSeries(key.replace('_', ' '), key);
    }

    console.log("------------");


    // Make stuff animate on load
   
    chart.appear(1000, 100);
}

function chartAcceptDateByLessor(data) {
    var transformedData = data.data.reduce(function (acc, item) {
        var lessorName = item.Company_Name.toLowerCase() + '-' + item.Month_Year.toLowerCase();
        var purpose = item.Purpose.toLowerCase().replace(/ /g, '_');

        if (!acc[lessorName]) {
            acc[lessorName] = {
                "lessor_name": lessorName
            };
        }

        acc[lessorName][purpose] = (acc[lessorName][purpose] || 0) + item.No_Of_Asset;

        return acc;
    }, {});

    // Convert the transformed data object into an array
    var dataArray = Object.values(transformedData);

    console.log(dataArray);

    chart_Accept_Date_Lessor.container.children.clear();
    chart_Accept_Date_Lessor.setThemes([
        am5themes_Animated.new(chart_Accept_Date_Lessor)
    ]);


    // Create chart
   
    var chart = chart_Accept_Date_Lessor.container.children.push(am5xy.XYChart.new(chart_Accept_Date_Lessor, {
        panX: false,
        panY: false,
        paddingLeft: 0,
        wheelX: "panX",
        wheelY: "zoomX",
        layout: chart_Accept_Date_Lessor.verticalLayout
    }));


    // Add legend
  
    var legend = chart.children.push(
        am5.Legend.new(chart_Accept_Date_Lessor, {
            centerX: am5.p50,
            x: am5.p50
        })
    );


    // Create axes
   
    var xRenderer = am5xy.AxisRendererX.new(chart_Accept_Date_Lessor, {
        cellStartLocation: 0.1,
        cellEndLocation: 0.9,
        minorGridEnabled: true
    })

    var xAxis = chart.xAxes.push(am5xy.CategoryAxis.new(chart_Accept_Date_Lessor, {
        categoryField: "lessor_name",
        renderer: xRenderer,
        tooltip: am5.Tooltip.new(chart_Accept_Date_Lessor, {})
    }));

    xRenderer.grid.template.setAll({
        location: 1
    })

    xAxis.data.setAll(dataArray);

    var yAxis = chart.yAxes.push(am5xy.ValueAxis.new(chart_Accept_Date_Lessor, {
        renderer: am5xy.AxisRendererY.new(chart_Accept_Date_Lessor, {
            strokeOpacity: 0.1
        })
    }));

    function makeSeries(name, fieldName) {

        var series = chart.series.push(am5xy.ColumnSeries.new(chart_Accept_Date_Lessor, {
            name: name,
            xAxis: xAxis,
            yAxis: yAxis,
            valueYField: fieldName,
            categoryXField: "lessor_name"
        }));

        series.columns.template.setAll({
            tooltipText: "{name}, {categoryX}:{valueY}",
            width: am5.percent(90),
            tooltipY: 0,
            strokeOpacity: 0
        });


        series.data.setAll(dataArray);

        // Make stuff animate on load
     
        series.appear();

        series.bullets.push(function () {
            return am5.Bullet.new(chart_Accept_Date_Lessor, {
                locationY: 0,
                sprite: am5.Label.new(chart_Accept_Date_Lessor, {
                    text: "{valueY}",
                    fill: chart_Accept_Date_Lessor.interfaceColors.get("alternativeText"),
                    centerY: 0,
                    centerX: am5.p50,
                    populateText: true
                })
            });
        });

        legend.data.push(series);
    }

    const distinctKeys = new Set();
    for (const record of dataArray) {
        for (const key in record) {
            if (record.hasOwnProperty(key) && key !== 'lessor_name') {
                distinctKeys.add(key);
            }
        }
    }

    for (const key of distinctKeys) {
        makeSeries(key.replace('_', ' '), key);
    }

    console.log("------------");


    // Make stuff animate on load
   
    chart.appear(1000, 100);
}

function chartOpenDateMonth(data) {

    chart_Open_Date_Month.container.children.clear();
    chart_Open_Date_Month.setThemes([
        am5themes_Animated.new(chart_Open_Date_Month)
    ]);

    // Create chart
  
    var chart = chart_Open_Date_Month.container.children.push(am5xy.XYChart.new(chart_Open_Date_Month, {
        panX: true,
        panY: true,
        wheelX: "panX",
        wheelY: "zoomX",
        pinchZoomX: true,
        paddingLeft: 0,
        paddingRight: 1
    }));

    // Add cursor
  
    var cursor = chart.set("cursor", am5xy.XYCursor.new(chart_Open_Date_Month, {}));
    cursor.lineY.set("visible", false);


    // Create axes
  
    var xRenderer = am5xy.AxisRendererX.new(chart_Open_Date_Month, {
        minGridDistance: 30,
        minorGridEnabled: true
    });

    xRenderer.labels.template.setAll({
        rotation: -90,
        centerY: am5.p50,
        centerX: am5.p100,
        paddingRight: 15
    });

    xRenderer.grid.template.setAll({
        location: 1
    })

    var xAxis = chart.xAxes.push(am5xy.CategoryAxis.new(chart_Open_Date_Month, {
        maxDeviation: 0.3,
        categoryField: "Month_Contract_Open_Date",
        renderer: xRenderer,
        tooltip: am5.Tooltip.new(chart_Open_Date_Month, {})
    }));

    var yRenderer = am5xy.AxisRendererY.new(chart_Open_Date_Month, {
        strokeOpacity: 0.1
    })

    var yAxis = chart.yAxes.push(am5xy.ValueAxis.new(chart_Open_Date_Month, {
        maxDeviation: 0.3,
        renderer: yRenderer
    }));


    // Create series
 
    var series = chart.series.push(am5xy.ColumnSeries.new(chart_Open_Date_Month, {
        name: "Series 1",
        xAxis: xAxis,
        yAxis: yAxis,
        valueYField: "No_Of_Asset",
        sequencedInterpolation: true,
        categoryXField: "Month_Contract_Open_Date",
        tooltip: am5.Tooltip.new(chart_Open_Date_Month, {
            labelText: "{valueY}"
        })
    }));

    series.columns.template.setAll({ cornerRadiusTL: 5, cornerRadiusTR: 5, strokeOpacity: 0 });
    series.columns.template.adapters.add("fill", function (fill, target) {
        return chart.get("colors").getIndex(series.columns.indexOf(target));
    });

    series.columns.template.adapters.add("stroke", function (stroke, target) {
        return chart.get("colors").getIndex(series.columns.indexOf(target));
    });

    xAxis.data.setAll(data.data);
    series.data.setAll(data.data);


    // Make stuff animate on load
 
    series.appear(1000);
    chart.appear(1000, 100);

}
function chartOpenDateMonthByLessorWise(data) {

    for (var i = 0; i < data.data.length; i++) {
        data.data[i].Company_Name = data.data[i].Company_Name + ' - ' + data.data[i].Month_Year;
    }

    chart_Open_Date_Month_By_Lessor.container.children.clear();
    chart_Open_Date_Month_By_Lessor.setThemes([
        am5themes_Animated.new(chart_Open_Date_Month_By_Lessor)
    ]);

    // Create chart
   
    var chart = chart_Open_Date_Month_By_Lessor.container.children.push(am5xy.XYChart.new(chart_Open_Date_Month_By_Lessor, {
        panX: true,
        panY: true,
        wheelX: "panX",
        wheelY: "zoomX",
        pinchZoomX: true,
        paddingLeft: 0,
        paddingRight: 1
    }));

    // Add cursor
  
    var cursor = chart.set("cursor", am5xy.XYCursor.new(chart_Open_Date_Month_By_Lessor, {}));
    cursor.lineY.set("visible", false);


    // Create axes
 
    var xRenderer = am5xy.AxisRendererX.new(chart_Open_Date_Month_By_Lessor, {
        minGridDistance: 30,
        minorGridEnabled: true
    });

    xRenderer.labels.template.setAll({
        rotation: -90,
        centerY: am5.p50,
        centerX: am5.p100,
        paddingRight: 15
    });

    xRenderer.grid.template.setAll({
        location: 1
    })

    var xAxis = chart.xAxes.push(am5xy.CategoryAxis.new(chart_Open_Date_Month_By_Lessor, {
        maxDeviation: 0.3,
        categoryField: "Company_Name",
        renderer: xRenderer,
        tooltip: am5.Tooltip.new(chart_Open_Date_Month_By_Lessor, {})
    }));

    var yRenderer = am5xy.AxisRendererY.new(chart_Open_Date_Month_By_Lessor, {
        strokeOpacity: 0.1
    })

    var yAxis = chart.yAxes.push(am5xy.ValueAxis.new(chart_Open_Date_Month_By_Lessor, {
        maxDeviation: 0.3,
        renderer: yRenderer
    }));


    // Create series
  
    var series = chart.series.push(am5xy.ColumnSeries.new(chart_Open_Date_Month_By_Lessor, {
        name: "Series 1",
        xAxis: xAxis,
        yAxis: yAxis,
        valueYField: "No_Of_Asset",
        sequencedInterpolation: true,
        categoryXField: "Company_Name",
        tooltip: am5.Tooltip.new(chart_Open_Date_Month_By_Lessor, {
            labelText: "{valueY}"
        })
    }));

    series.columns.template.setAll({ cornerRadiusTL: 5, cornerRadiusTR: 5, strokeOpacity: 0 });
    series.columns.template.adapters.add("fill", function (fill, target) {
        return chart.get("colors").getIndex(series.columns.indexOf(target));
    });

    series.columns.template.adapters.add("stroke", function (stroke, target) {
        return chart.get("colors").getIndex(series.columns.indexOf(target));
    });

    xAxis.data.setAll(data.data);
    series.data.setAll(data.data);


    // Make stuff animate on load
 
    series.appear(1000);
    chart.appear(1000, 100);

}

function chartopenDateYear(data) {

    //


    console.log("created data");
    var resultData = [];

    // Organize data based on "Year_Contract_Open_Date"
    data.data.forEach(entry => {
        const year = entry.Year_Contract_Open_Date;

        // Check if there's an entry for the current year in resultData
        let yearEntry = resultData.find(item => item.Year_Contract_Open_Date === year);

        // If not, create a new entry
        if (!yearEntry) {
            yearEntry = { Year_Contract_Open_Date: year };
            resultData.push(yearEntry);
        }

        // Add product and amount to the entry
        yearEntry[entry.Product] = entry.Total_Leasing_Amount;
    });

    console.log(resultData);

    chart_Open_Date_Year.container.children.clear();
    chart_Open_Date_Year.setThemes([
        am5themes_Animated.new(root)
    ]);

    // Create chart
  
    var chart = chart_Open_Date_Year.container.children.push(
        am5xy.XYChart.new(chart_Open_Date_Year, {
            panX: true,
            panY: true,
            wheelX: "panX",
            wheelY: "zoomX",
            layout: chart_Open_Date_Year.verticalLayout,
            pinchZoomX: true
        })
    );

    // Add cursor
   
    var cursor = chart.set("cursor", am5xy.XYCursor.new(chart_Open_Date_Year, {
        behavior: "none"
    }));
    cursor.lineY.set("visible", false);

    // Create axes
 
    var xRenderer = am5xy.AxisRendererX.new(chart_Open_Date_Year, {
        minorGridEnabled: true
    });
    xRenderer.grid.template.set("location", 0.5);
    xRenderer.labels.template.setAll({
        location: 0.5,
        multiLocation: 0.5
    });

    var xAxis = chart.xAxes.push(
        am5xy.CategoryAxis.new(chart_Open_Date_Year, {
            categoryField: "Year_Contract_Open_Date",
            renderer: xRenderer,
            tooltip: am5.Tooltip.new(chart_Open_Date_Year, {})
        })
    );

    xAxis.data.setAll(resultData);

    var yAxis = chart.yAxes.push(
        am5xy.ValueAxis.new(chart_Open_Date_Year, {
            maxPrecision: 0,
            renderer: am5xy.AxisRendererY.new(chart_Open_Date_Year, {
                inversed: false
            })
        })
    );

    // Add series
  
    function createSeries(name, field) {
        var series = chart.series.push(
            am5xy.LineSeries.new(chart_Open_Date_Year, {
                name: name,
                xAxis: xAxis,
                yAxis: yAxis,
                valueYField: field,
                categoryXField: "Year_Contract_Open_Date",
                tooltip: am5.Tooltip.new(chart_Open_Date_Year, {
                    pointerOrientation: "horizontal",
                    labelText: "[bold]{name}[/]\n{categoryX}: {valueY}"
                })
            })
        );


        series.bullets.push(function () {
            return am5.Bullet.new(chart_Open_Date_Year, {
                sprite: am5.Circle.new(chart_Open_Date_Year, {
                    radius: 5,
                    fill: series.get("fill")
                })
            });
        });

        // create hover state for series and for mainContainer, so that when series is hovered,
        // the state would be passed down to the strokes which are in mainContainer.
        series.set("setStateOnChildren", true);
        series.states.create("hover", {});

        series.mainContainer.set("setStateOnChildren", true);
        series.mainContainer.states.create("hover", {});

        series.strokes.template.states.create("hover", {
            strokeWidth: 4
        });

        series.data.setAll(resultData);
        series.appear(1000);
    }
    //createSeries("Purpose","No_Of_Contract")
    // Loop through resultData and pass key-value pairs to your method
    //resultData.forEach(entry => {
    //    Object.keys(entry).forEach(key => {
    //        if (key !== 'Year_Contract_Open_Date') {
    //            createSeries(key, key);
    //        }
    //    });
    //});

    const distinctKeys = new Set();

    // Loop through resultData and pass distinct key-value pairs to your method
    resultData.forEach(entry => {
        Object.keys(entry).forEach(key => {
            if (key !== 'Year_Contract_Open_Date' && !distinctKeys.has(key)) {
                const value = entry[key];
                createSeries(key, key);

                // Add the key to the set to mark it as encountered
                distinctKeys.add(key);
            }
        });
    });

    // Clear the set for future use (if needed)
    distinctKeys.clear();

   
    chart.set("scrollbarX", am5.Scrollbar.new(chart_Open_Date_Year, {
        orientation: "horizontal",
        marginBottom: 20
    }));

    var legend = chart.children.push(
        am5.Legend.new(chart_Open_Date_Year, {
            centerX: am5.p50,
            x: am5.p50
        })
    );

    // Make series change state when legend item is hovered
    legend.itemContainers.template.states.create("hover", {});

    legend.itemContainers.template.events.on("pointerover", function (e) {
        e.target.dataItem.dataContext.hover();
    });
    legend.itemContainers.template.events.on("pointerout", function (e) {
        e.target.dataItem.dataContext.unhover();
    });

    legend.data.setAll(chart.series.values);

    // Make stuff animate on load
    chart.appear(1000, 100);
}

//API Calls
function getData(startDate, endDate, companyId, reportId) {
    var reportsURL = BaseUrl + "/api/setups";
    var companyType = sessionStorage.getItem('companyType');


    startDate = startDate;
    endDate = endDate || getCurrentDate();
    // Get the input element by ID

    company = sessionStorage.getItem('companyIdFilter')
   
    companyId = $("#CompanyId option:selected").val();
    
    if (companyId == null || companyId == "") {
        if (companyType == 'Lessor') {
            companyId = sessionStorage.getItem('companyId');
        } else {
            companyId = company;
        }
    };
    var LoginCompanyId =  sessionStorage.getItem('companyId');

    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    // myHeaders.append("Authorization", "Bearer " + getTokenFromSessionStorage());
    formData = { "StartDate": startDate, "EndDate": endDate, "ReportId": reportId, "LessorId": companyId, "LoginCompanyId": LoginCompanyId };
    //formData = { "ReportId": '16', "LessorId": companyId };

    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        redirect: 'follow',
        body: JSON.stringify(formData)
    };

    return new Promise((resolve, reject) => {
        commonFetch(reportsURL + "/reportsgridfordashboard", requestOptions, function (data) {
            if (data != undefined && data != null) {
                console.log(data);
                if (data.message == "EnableTWQPLUSCharts") {
                    document.getElementById("TWQPLUSCHARTS").style.display = "flex";
                }
                else
                {
                    document.getElementById("TWQPLUSCHARTS").style.display = "none";

                }
                resolve(data);
            } else {
                showSweetAlert('error', "Invalid Response", "");
                reject("Invalid Response");
            }
        });
    });


   
}

//Dates
function subtractDaysFromCurrentDate(days) {
    var today = new Date();


    today.setDate(today.getDate() - days);


    return getFormattedDate(today);
}
function getCurrentDate() {
    var today = new Date();
    return getFormattedDate(today);
}

function getFormattedDate(date) {

    var year = date.getFullYear();
    var month = (date.getMonth() + 1).toString().padStart(2, '0');
    var day = date.getDate().toString().padStart(2, '0');


    return year + '-' + month + '-' + day;
}

///----------------------------------------//--------------------------//
//Assign In Below Methods
function onButtonClick() {

    //var dates = KTBootstrapDaterangepicker.getDates();
    //var startDate = dates.startDate;
    //var endDate = dates.endDate;
    //var companyType = sessionStorage.getItem('companyType');
    
    if (companyType == 'Lessor') {
        var companyId = sessionStorage.getItem('companyId')
    }
    else {
        var companyId = $("#CompanyId option:selected").val();
    }

    sessionStorage.removeItem('companyIdFilter')
    sessionStorage.setItem('companyIdFilter', companyId);

    location.reload();

}

function GetLessorTypeCompanies() {

    $("#divLoader").show();
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", "Bearer " + getTokenFromSessionStorage());
    var currentCompanyId = "";

    var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
    };

    var CompanyTypeID = 300;
    let SetupURL = BaseUrl + "/api/Admin/" + CompanyTypeID + "/GetCompanyByType";


    var companyType = sessionStorage.getItem('companyType');

    if (companyType == 'Lessor') {

        $("#CompanyId").prop("disabled", true);
    }
    else {
        $("#CompanyId").prop("disabled", false);
    }


    var defaultStartDate = sessionStorage.getItem('startDate');
    var defaultEndDate = sessionStorage.getItem('endDate');
    
    if ((defaultStartDate == null || defaultStartDate == undefined || defaultStartDate == "undefined") && (defaultEndDate == null || defaultEndDate == undefined || defaultEndDate == "undefined")) {
        var dateTimePicker = document.getElementById("kt_daterangepicker_1");
        var defaultStartDate = '2019-01-01';
        defaultEndDate = getCurrentDate(); // Assuming this function returns current date in 'YYYY-MM-DD' format
        dateTimePicker.value = moment(defaultStartDate, 'YYYY-MM-DD').format('MM/DD/YYYY') + ' - ' + moment(defaultEndDate, 'YYYY-MM-DD').format('MM/DD/YYYY');
        defaultStartDate = defaultStartDate;
        defaultEndDate = moment(defaultEndDate, 'YYYY-MM-DD').add(1, 'day').format('YYYY-MM-DD');
    }
    else {
        var dateTimePicker = document.getElementById("kt_daterangepicker_1");
        dateTimePicker.value = moment(defaultStartDate, 'YYYY-MM-DD').format('MM/DD/YYYY') + ' - ' + moment(defaultEndDate, 'YYYY-MM-DD').format('MM/DD/YYYY');
    }

    var companyIdFilter = sessionStorage.getItem('companyIdFilter');
    
    commonFetch(SetupURL, requestOptions, function (data) {
        if (data != undefined && data != null) {
            $("#divLoader").hide();

            $("#CompanyId").html("");
            $("#CompanyId").append("<option value=''>All</option>")
            for (var i = 0; i < data.length; i++) {

                $("#CompanyId").append("<option value='" + data[i].company_Id + "'>" + data[i].companyName + "</option>")
            }

            if (companyType == 'Lessor') {
                currentCompanyId = sessionStorage.getItem('companyId');

                $("#CompanyId").val(currentCompanyId);
            }
            else {
                currentCompanyId = null;
                $("#CompanyId").val(companyIdFilter);
            }

            //Api Calls And Charts

            CHART_CALLS.canvasDurationChart = function () {
                getData(defaultStartDate, defaultEndDate, currentCompanyId, '10')
                    .then(resp => {
                        if (resp.success == 0) {
                            canvasDurationChart(resp.data);
                        }
                    })
            }

            CHART_CALLS.canv1 = function () {
                getData(defaultStartDate, defaultEndDate, currentCompanyId, '41')
                    .then(resp => {
                        if (resp.success == 0) {
                            canvas1(resp.data);
                        }
                    })
            };

            CHART_CALLS.canv2 = function () {
                getData(defaultStartDate, defaultEndDate, currentCompanyId, '42')
                    .then(resp => {
                        if (resp.success == 0) {
                            canvas2(resp.data);
                        }
                    })
            };

            CHART_CALLS.canv3 = function () {
                getData(defaultStartDate, defaultEndDate, currentCompanyId, '43')
                    .then(resp => {
                        if (resp.success == 0) {
                            canvas3(resp.data);
                        }
                    })
            };

            CHART_CALLS.canv4 = function () {
                getData(defaultStartDate, defaultEndDate, currentCompanyId, '44')
                    .then(resp => {
                        if (resp.success == 0) {
                            canvas4(resp.data);
                        }
                    })
            };

            CHART_CALLS.canv5 = function () {
                getData(defaultStartDate, defaultEndDate, currentCompanyId, '45')
                    .then(resp => {
                        if (resp.success == 0) {
                            canvas5(resp.data);
                        }
                    })
            };

            CHART_CALLS.canv6 = function () {
                getData(defaultStartDate, defaultEndDate, currentCompanyId, '46')
                    .then(resp => {
                        if (resp.success == 0) {
                            canvas6(resp.data);
                        }
                    })
            };

            CHART_CALLS.canv7 = function () {
                getData(defaultStartDate, defaultEndDate, currentCompanyId, '47')
                    .then(resp => {
                        if (resp.success == 0) {
                            canvas7(resp.data);
                        }
                    })
            };

            CHART_CALLS.canv8 = function () {
                getData(defaultStartDate, defaultEndDate, currentCompanyId, '48')
                    .then(resp => {
                        if (resp.success == 0) {
                            canvas8(resp.data);
                        }
                    })
            };

            CHART_CALLS.canv9 = function () {
                getData(defaultStartDate, defaultEndDate, currentCompanyId, '50')
                    .then(resp => {

                        if (resp.success == 0) {
                            canvas9(resp.data);
                        }
                    })
            };

            CHART_CALLS.canv10 = function () {
                getData(defaultStartDate, defaultEndDate, currentCompanyId, '51')
                    .then(resp => {

                        if (resp.success == 0) {
                            canvas10(resp.data);
                        }
                    })
            };

            CHART_CALLS.canv11 = function () {
                getData(defaultStartDate, defaultEndDate, currentCompanyId, '40')
                    .then(resp => {

                        if (resp.success == 0) {
                            canvas11(resp.data);
                        }
                    })
            };

            CHART_CALLS.canv12 = function () {
                getData(defaultStartDate, defaultEndDate, currentCompanyId, '52')
                    .then(resp => {

                        if (resp.success == 0) {
                            canvas12(resp.data);
                        }
                    })
            };

            CHART_CALLS.canv13 = function () {
                getData(defaultStartDate, defaultEndDate, currentCompanyId, '15')
                    .then(resp => {
                        if (resp.success == 0) {
                            canvas13(resp.data);
                        }
                    })
            }

            CHART_CALLS.canv14 = function () {
                getData(defaultStartDate, defaultEndDate, currentCompanyId, '17')
                    .then(resp => {
                        if (resp.success == 0) {
                            canvas14(resp.data);
                        }
                    })
            }

            CHART_CALLS.canv15 = function () {
                getData(defaultStartDate, defaultEndDate, currentCompanyId, '18')
                    .then(resp => {
                        if (resp.success == 0) {
                            canvas15(resp.data);
                        }
                    })
            }

            CHART_CALLS.canv16 = function () {
                getData(defaultStartDate, defaultEndDate, currentCompanyId, '23')
                    .then(resp => {
                        if (resp.success == 0) {
                            canvas16(resp.data);
                        }
                    })
            }

            CHART_CALLS.canv17 = function () {
                getData(defaultStartDate, defaultEndDate, currentCompanyId, '25')
                    .then(resp => {
                        if (resp.success == 0) {
                            canvas17(resp.data);
                        }
                    })
            }

            CHART_CALLS.canv18 = function () {
                getData(defaultStartDate, defaultEndDate, currentCompanyId, '26')
                    .then(resp => {
                        if (resp.success == 0) {
                            canvas18(resp.data);
                        }
                    })
            }

            CHART_CALLS.canv20 = function () {
                getData(defaultStartDate, defaultEndDate, currentCompanyId, '22')
                    .then(resp => {
                        if (resp.success == 0) {
                            canvas20(resp.data);
                        }
                    })
            }

            CHART_CALLS.canv19 = function () {
                getData(defaultStartDate, defaultEndDate, currentCompanyId, '9')
                    .then(resp => {
                        if (resp.success == 0) {
                            canvas19(resp.data);
                        }
                    })
            }

            CHART_CALLS.analytics1 = function () {
                getData(defaultStartDate, defaultEndDate, currentCompanyId, '49')
                    .then(resp => {

                        if (resp.success == 0) {
                            analytics1(resp.data);
                        }
                    })
            };

            CHART_CALLS.analytics2 = function () {
                getData(defaultStartDate, defaultEndDate, currentCompanyId, '53')
                    .then(resp => {

                        if (resp.success == 0) {
                            analytics2(resp.data);
                        }
                    })
            };

            CHART_CALLS.canv56 = function () {
                debugger
                getData(defaultStartDate, defaultEndDate, currentCompanyId, '56')
                    .then(resp => {
                        if (resp.success == 0) { 
                            canvas56(resp.data);
                        }
                    })
            };

            CHART_CALLS.canv57 = function () {
                getData(defaultStartDate, defaultEndDate, currentCompanyId, '57')
                    .then(resp => {
                        if (resp.success == 0) {
                            canvas57(resp.data);
                        }
                    })
            };
            divObserver();


        } else {
            showSweetAlert('error', "Invalid Response", "")
        }
    });
}

//Assign Methods End

var KTBootstrapDaterangepicker = function () {

    var startDate, endDate;

    var demos = function () {
        ;

        $('#kt_daterangepicker_1, #kt_daterangepicker_1_modal').daterangepicker({
            buttonClasses: ' btn',
            applyClass: 'btn-primary',
            cancelClass: 'btn-secondary'
        }, function (start, end, label) {

            startDate = start.format('YYYY-MM-DD');
            endDate = end.format('YYYY-MM-DD');

            sessionStorage.setItem('startDate', startDate);
            sessionStorage.setItem('endDate', endDate);
            console.log("Selected dates:", startDate, "to", endDate);
        });
    };


    var getDates = function () {
        return { startDate: startDate, endDate: endDate };
    };

    return {

        init: function () {
            demos();
        },
        getDates: getDates
    };
}();

function getNextColor(currentColor) {
    const colorNames = Object.keys(CHART_COLORS);
    const currentIndex = colorNames.indexOf(currentColor);

    if (currentIndex === -1) {
        // If the current color is not found or invalid, return the first color
        return colorNames[0];
    }

    const nextIndex = (currentIndex + 1) % colorNames.length;
    return colorNames[nextIndex];
}




function canvas56(serverData) {
    // Number of closed contracts vs open account based on product
    debugger
    if (chart56 != null) {
        chart56.destroy();
    }

    // data transformation --- start
    const transformedLabels = ["External Apis Calls"];
    let passedCount = 0;
    let failedCount = 0;
    let totalCount = 0;

    serverData.forEach(item => {
        passedCount += item.passed;
        failedCount += item.failed;
        totalCount += item.passed + item.failed;
    });

    const transformedData = [
        { label: 'Passed APIs', data: (passedCount / totalCount) * 100 },
        { label: 'Failed APIs', data: (failedCount / totalCount) * 100 }
    ];
    // data transformation --- end

    // chart building
    const ctx = document.getElementById('canv56');
    const data = {
        labels: transformedData.map(d => d.label),
        datasets: [
            {
                label: 'Percentage',
                data: transformedData.map(d => d.data),
                backgroundColor: transformedData.map(d => d.label === 'Passed APIs' ? CHART_COLORS.green : CHART_COLORS.red),
            }
        ]
    };

    chart56 = new Chart(ctx, {
        type: 'bar',
        data: data,
        options: {
            indexAxis: 'y', // This will make the bars horizontal
            plugins: {
                title: {
                    display: true,
                    text: 'Number Of Passed External Apis Vs Failed External Apis '.toUpperCase(),
                },
            },
            responsive: true,
            interaction: {
                intersect: false
            },
            scales: {
                x: {
                    ticks: {
                        callback: function(value) {
                            return value + '%';
                        },
                        beginAtZero: true,
                        max: 100
                    }
                },
                y: {
                    barPercentage: 1,
                    categoryPercentage: 1
                }
            }
        }
    });
}
function canvas57(serverData) {

    if (chart57 != null) {
        chart57.destroy();
    }

    // data transformation - start

    const transformedLabels = [];

    const tranformedApprovedPercentData = [];
   // const tranformedRejectedPercentData = [];

    const tranformedApprovedCountData = [];
   // const tranformedRejectedCountData = [];
    function transformData() {
        serverData.forEach(item => {
            transformedLabels.push(item.companyName);

            tranformedApprovedPercentData.push(item.numberOfApisCalled);
           // tranformedRejectedPercentData.push(item.rejected_Percent);

            tranformedApprovedCountData.push(item.numberOfApisCalled);
           // tranformedRejectedCountData.push(item.rejected_Contracts);
        });
    }

    transformData();
    // data transformation - end

    const footer = (tooltipItems) => {
        let number = 0;

        tooltipItems.forEach(function (tooltipItem) {
            number += tooltipItem.dataset.totals[tooltipItem.dataIndex];
        });
        return 'Count: ' + number;
    };

    // chart building
    const ctx = document.getElementById('canv57');
    const data = {
        labels: transformedLabels,
        datasets: [
            {
                label: 'Apis Called',
                data: tranformedApprovedPercentData,
                totals: tranformedApprovedCountData,
                backgroundColor: CHART_COLORS.blue,
                stack: 'Stack 0',
            },
            //{
            //    label: 'Rejected %',
            //    data: tranformedRejectedPercentData,
            //    totals: tranformedRejectedCountData,
            //    backgroundColor: CHART_COLORS.red,
            //    stack: 'Stack 0',
            //}
        ]
    };
    const config = {
        type: 'bar',
        data: data,
        options: {
            plugins: {
                tooltip: {
                    callbacks: {
                        footer: footer
                    }
                },
                title: {
                    display: true,
                    text: 'Number Of Apis Called Grouped By Company'.toUpperCase()
                },
            },
            responsive: true,
            interaction: {
                intersect: false,
            },
            scales: {
                x: {
                    stacked: true,
                },
                y: {
                    stacked: true
                }
            }
        }
    };

    chart57 = new Chart(ctx, config);
}


function canvas1(serverData) {
    // Number of closed contract’s vs open account based on product

    if (chart1 != null) {
        chart1.destroy();
    }

    // data transformation --- start
    const transformedLabels = [];
    const transformedOpenedData = [];
    const transformedClosedData = [];
    function transformData() {
        serverData.forEach(item => {
            transformedLabels.push(item.product_Type);
            transformedOpenedData.push(item.number_Of_Open_Contracts);
            transformedClosedData.push(item.number_Of_Closed_Contracts)
        });
    }

    transformData();
    // data transformation --- end

    // chart building
    const ctx = document.getElementById('canv1');
    const data = {
        labels: transformedLabels,
        datasets: [
            {
                label: 'Opened Accounts',
                data: transformedOpenedData,
                backgroundColor: CHART_COLORS.blue,
                stack: 'Stack 0',
            },
            {
                label: 'Closed Contracts',
                data: transformedClosedData,
                backgroundColor: CHART_COLORS.red,
                stack: 'Stack 0',
            }
        ]
    };

    chart1 = new Chart(ctx, {
        type: 'bar',
        data: data,
        options: {
            plugins: {
                title: {
                    display: true,
                    text: 'Number of Closed Contracts VS Open Account Based On Product'.toUpperCase(),
                },
            },
            responsive: true,
            interaction: {
                intersect: false
            },
            scales: {
                x: {
                    stacked: true,
                },
                y: {
                    stacked: true,
                }
            }
        }
    });
}

function canvas2(serverData) {

    if (chart2 != null) {
        chart2.destroy();
    }

    // data transformation --- start
    const transformedLabels = [];
    const transformedData = [];
    function transformData() {
        serverData.forEach(item => {
            transformedLabels.push(item.asset_Type);
            transformedData.push(item.registration_Percent)
        });
    }
    transformData();
    // data transformation --- end

    //chart building
    const ctx = document.getElementById('canv2');
    const data = {
        labels: transformedLabels,
        datasets: [{
            label: 'Percentage',
            data: transformedData,
            backgroundColor: [
                CHART_COLORS.red,
                CHART_COLORS.blue,
                CHART_COLORS.yellow
            ],
            hoverOffset: 4
        }]
    };

    const config = {
        type: 'polarArea',
        data: data,
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: 'Percentage Of Type Of Leased Asset Based On The Registered Contract'.toUpperCase(),
                }
            }
        }
    };

    chart2 = new Chart(ctx, config);
}

function canvas3(serverData) {

    if (chart3 != null) {
        chart3.destroy();
    }

    // data transformation --- start
    const transformedColors = [];
    const transformedLabels = [];
    const transformedYearlyData = [];
    const transformedMonthlyData = [];
    const transformedWeeklyData = [];

    function transformData() {
        var color;
        serverData.forEach(item => {
            color = getNextColor(color);

            transformedColors.push(CHART_COLORS[color]);
            transformedLabels.push(item.contract_Purpose);
            transformedYearlyData.push(item.yearly_Rejection_Rate);
            transformedMonthlyData.push(item.monthly_Rejection_Rate);
            transformedWeeklyData.push(item.weekly_Rejection_Rate);
        });
    }

    transformData();

    // data transformation --- end


    // chart building
    const ctx = document.getElementById('canv3');
    const data = {
        labels: transformedLabels,
        datasets: [
            {
                label: 'Yearly %',
                data: transformedYearlyData,
                backgroundColor: transformedColors,
                hoverOffset: 4
            },
            {
                label: 'Monthly %',
                data: transformedMonthlyData,
                backgroundColor: transformedColors,
                hoverOffset: 4
            },
            {
                label: 'Weekly %',
                data: transformedWeeklyData,
                backgroundColor: transformedColors,
                hoverOffset: 4
            }
        ]
    };

    const config = {
        type: 'pie',
        data: data,
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                title: {
                    display: true,
                    text: 'Average weekly / monthly / yearly rejection rate for execution orders'.toUpperCase(),
                }
            }
        }
    };

    chart3 = new Chart(ctx, config);
}

function canvas4(serverData) {

    if (chart4 != null) {
        chart4.destroy();
    }

    // data transformation --- start
    const transformedLabels = [];
    const transformedData = [];
    function transformData() {
        serverData.forEach(item => {
            transformedLabels.push(item.contract_Purpose);
            transformedData.push(item.yearly_Rejection_Rate);
            transformedData.push(item.monthly_Rejection_Rate);
            transformedData.push(item.weekly_Rejection_Rate);
        });
    }

    transformData();

    // data transformation --- end


    // chart building
    const ctx = document.getElementById('canv4');
    const data = {
        labels: ['Yearly %', 'Monthly %', 'Weekly %'],
        datasets: [{
            label: transformedLabels,
            data: transformedData,
            backgroundColor: [
                CHART_COLORS.red,
                CHART_COLORS.blue,
                CHART_COLORS.yellow
            ],
            hoverOffset: 4
        }]
    };

    const config = {
        type: 'pie',
        data: data,
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: 'Average weekly / monthly / yearly rejection rate for registration'.toUpperCase(),
                }
            }
        }
    };

    chart4 = new Chart(ctx, config);

}

function canvas5(serverData) {
    // Average monthly / weekly/yearly execution orders accepted rate.– Enforcement and Repossession cases

    if (chart5 != null) {
        chart5.destroy();
    }

    // data transformation --- start
    const transformedLabel = [];
    const transformedYearlyData = [];
    const transformedMonthlyData = [];
    const transformedWeeklyData = [];
    function transformData() {
        serverData.forEach(item => {
            transformedLabel.push(item.contract_Purpose);
            transformedYearlyData.push(item.yearly_Acceptance_Rate);
            transformedMonthlyData.push(item.monthly_Acceptance_Rate);
            transformedWeeklyData.push(item.weekly_Acceptance_Rate);
        });
    }

    transformData();

    // data transformation --- end

    // chart building
    const ctx = document.getElementById('canv5');
    const data = {
        labels: transformedLabel,
        datasets: [
            {
                label: 'Yearly %',
                data: transformedYearlyData,
                backgroundColor: CHART_COLORS.red,
                stack: 'Stack 0',
            },
            {
                label: 'Monthly %',
                data: transformedMonthlyData,
                backgroundColor: CHART_COLORS.blue,
                stack: 'Stack 0',
            },
            {
                label: 'Weekly %',
                data: transformedWeeklyData,
                backgroundColor: CHART_COLORS.yellow,
                stack: 'Stack 0',
            },
        ]
    };

    chart5 = new Chart(ctx, {
        type: 'bar',
        data: data,
        options: {
            plugins: {
                title: {
                    display: true,
                    text: 'Average weekly / monthly / yearly execution orders accepted rate (Enforcement and Repossession)'.toUpperCase(),
                },
            },
            responsive: true,
            interaction: {
                intersect: false
            },
            scales: {
                x: {
                    stacked: true,
                },
                y: {
                    stacked: true,
                }
            }
        }
    });
}

function canvas6(serverData) {

    if (chart6 != null) {
        chart6.destroy();
    }
    // data transformation - start

    const transformedLabels = [];
    const tranformedData = [];
    function transformData() {
        serverData.forEach(item => {
            transformedLabels.push(item.contract_Purpose);
            tranformedData.push(item.avg_Yearly_Apr_Contracts);
            tranformedData.push(item.avg_Monthly_Apr_Contracts);
            tranformedData.push(item.avg_Weekly_Apr_Contracts);
        });
    }

    transformData();

    // data transformation - end

    // chart building

    const ctx = document.getElementById('canv6');
    const data = {
        labels: ['Yearly %', 'Monthly %', 'Weekly %'],
        datasets: [
            {
                label: transformedLabels,
                data: tranformedData,
                backgroundColor: [
                    CHART_COLORS.red,
                    CHART_COLORS.blue,
                    CHART_COLORS.yellow
                ]
            }
        ]
    };

    const config = {
        type: 'polarArea',
        data: data,
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                },
                title: {
                    display: true,
                    text: 'Average weekly / monthly / yearly registration accepted rate'.toUpperCase()
                }
            }
        },
    };

    chart6 = new Chart(ctx, config);
}

function canvas7(serverData) {

    if (chart7 != null) {
        chart7.destroy();
    }

    // data transformation - start

    const transformedLabels = [];

    const tranformedApprovedPercentData = [];
    const tranformedRejectedPercentData = [];

    const tranformedApprovedCountData = [];
    const tranformedRejectedCountData = [];
    function transformData() {
        serverData.forEach(item => {
            transformedLabels.push(item.contract_Purpose);

            tranformedApprovedPercentData.push(item.approved_Percent);
            tranformedRejectedPercentData.push(item.rejected_Percent);

            tranformedApprovedCountData.push(item.approved_Contracts);
            tranformedRejectedCountData.push(item.rejected_Contracts);
        });
    }

    transformData();
    // data transformation - end

    const footer = (tooltipItems) => {
        let number = 0;

        tooltipItems.forEach(function (tooltipItem) {
            number += tooltipItem.dataset.totals[tooltipItem.dataIndex];
        });
        return 'Count: ' + number;
    };

    // chart building
    const ctx = document.getElementById('canv7');
    const data = {
        labels: transformedLabels,
        datasets: [
            {
                label: 'Accepted %',
                data: tranformedApprovedPercentData,
                totals: tranformedApprovedCountData,
                backgroundColor: CHART_COLORS.blue,
                stack: 'Stack 0',
            },
            {
                label: 'Rejected %',
                data: tranformedRejectedPercentData,
                totals: tranformedRejectedCountData,
                backgroundColor: CHART_COLORS.red,
                stack: 'Stack 0',
            }
        ]
    };
    const config = {
        type: 'bar',
        data: data,
        options: {
            plugins: {
                tooltip: {
                    callbacks: {
                        footer: footer
                    }
                },
                title: {
                    display: true,
                    text: 'Number and percentage of accepted contracts vs rejected contracts based on service'.toUpperCase()
                },
            },
            responsive: true,
            interaction: {
                intersect: false,
            },
            scales: {
                x: {
                    stacked: true,
                },
                y: {
                    stacked: true
                }
            }
        }
    };

    chart7 = new Chart(ctx, config);
}

function canvas8(serverData) {

    if (chart8 != null) {
        chart8.destroy();
    }

    // data transformation - start

    const transformedLabels = [];

    const tranformedApprovedPercentData = [];
    const tranformedRejectedPercentData = [];

    const tranformedApprovedCountData = [];
    const tranformedRejectedCountData = [];
    function transformData() {
        serverData.forEach(item => {
            transformedLabels.push(item.product_Type);

            tranformedApprovedPercentData.push(item.approved_Percent);
            tranformedRejectedPercentData.push(item.rejected_Percent);

            tranformedApprovedCountData.push(item.approved_Contracts);
            tranformedRejectedCountData.push(item.rejected_Contracts);
        });
    }

    transformData();
    // data transformation - end

    const footer = (tooltipItems) => {
        let number = 0;

        tooltipItems.forEach(function (tooltipItem) {
            number += tooltipItem.dataset.totals[tooltipItem.dataIndex];
        });
        return 'Count: ' + number;
    };

    // chart building
    const ctx = document.getElementById('canv8');
    const data = {
        labels: transformedLabels,
        datasets: [
            {
                label: 'Accepted %',
                data: tranformedApprovedPercentData,
                totals: tranformedApprovedCountData,
                backgroundColor: CHART_COLORS.blue,
                stack: 'Stack 0',
            },
            {
                label: 'Rejected %',
                data: tranformedRejectedPercentData,
                totals: tranformedRejectedCountData,
                backgroundColor: CHART_COLORS.red,
                stack: 'Stack 0',
            }
        ]
    };
    const config = {
        type: 'bar',
        data: data,
        options: {
            plugins: {
                tooltip: {
                    callbacks: {
                        footer: footer
                    }
                },
                title: {
                    display: true,
                    text: 'Number and percentage of accepted contracts vs rejected contracts based on product'.toUpperCase()
                },
            },
            responsive: true,
            interaction: {
                intersect: false,
            },
            scales: {
                x: {
                    stacked: true,
                },
                y: {
                    stacked: true
                }
            }
        }
    };

    chart8 = new Chart(ctx, config);
}

function canvas9(serverData) {

    if (chart9 != null) {
        chart9.destroy();
    }

    const transformedColors = [];
    const transformedLabels = [];
    const transformedServices = [];
    const transformedData = [];

    function transformData() {
        var color = '';
        serverData.forEach(item => {
            color = getNextColor(color);

            transformedColors.push(CHART_COLORS[color])
            transformedLabels.push(item.execution_Reason);
            transformedData.push(item.count);
            transformedServices.push(item.contract_Purpose);
        });
    }

    transformData();


    const footer = (tooltipItems) => {
        let text = '';

        tooltipItems.forEach(function (tooltipItem) {
            text = tooltipItem.dataset.services[tooltipItem.dataIndex];
        });
        return 'Service: ' + text;
    };


    const ctx = document.getElementById('canv9');

    const data = {
        labels: transformedLabels,// ['Jan', 'Feb', 'Mar'],
        datasets: [
            {
                label: 'Count',
                data: transformedData,
                services: transformedServices,
                backgroundColor: transformedColors,
                stack: 'Stack 0',
            }
        ]
    };

    const config = {
        type: 'bar',
        data: data,
        options: {
            plugins: {
                tooltip: {
                    callbacks: {
                        footer: footer
                    }
                },
                title: {
                    display: true,
                    text: 'breakdown execution reasons based on services'.toUpperCase()
                },
            },
            responsive: true,
            interaction: {
                intersect: false,
            },
            scales: {
                x: {
                    stacked: true,
                },
                y: {
                    stacked: true
                }
            }
        }
    };

    chart9 = new Chart(ctx, config);
}

function canvas10(serverData) {

    if (chart10 != null) {
        chart10.destroy();
    }

    const transformedColors = [];
    const transformedLabels = [];
    const transformedServices = [];
    const transformedData = [];

    function transformData() {
        var color = 'red';
        serverData.forEach(item => {
            color = getNextColor(color);

            transformedColors.push(CHART_COLORS[color])
            transformedLabels.push(item.execution_Reason);
            transformedData.push(item.count);
            transformedServices.push(item.product_Type);
        });
    }

    transformData();


    const footer = (tooltipItems) => {
        let text = '';

        tooltipItems.forEach(function (tooltipItem) {
            text = tooltipItem.dataset.services[tooltipItem.dataIndex];
        });
        return 'Product Type: ' + text;
    };


    const ctx = document.getElementById('canv10');

    const data = {
        labels: transformedLabels,// ['Jan', 'Feb', 'Mar'],
        datasets: [
            {
                label: 'Count',
                data: transformedData,
                services: transformedServices,
                backgroundColor: transformedColors,
                stack: 'Stack 0',
            }
        ]
    };

    const config = {
        type: 'bar',
        data: data,
        options: {
            plugins: {
                tooltip: {
                    callbacks: {
                        footer: footer
                    }
                },
                title: {
                    display: true,
                    text: 'breakdown execution reasons based on products'.toUpperCase()
                },
            },
            responsive: true,
            interaction: {
                intersect: false,
            },
            scales: {
                x: {
                    stacked: true,
                },
                y: {
                    stacked: true
                }
            }
        }
    };

    chart10 = new Chart(ctx, config);
}

function canvas11(serverData) {

    if (chart11 != null) {
        chart11.destroy();
    }

    // data transformation - start

    const tranformedColors = [];
    const transformedLabels = [];
    const tranformedData = [];
    const transformedCustomData = [];
    function transformData() {
        var color = ''
        serverData.forEach(item => {
            color = getNextColor(color);

            transformedCustomData.push(item.contract_Purpose);
            tranformedColors.push(CHART_COLORS[color]);
            transformedLabels.push(item.field_Name);
            tranformedData.push(item.count);
        });
    }

    transformData();

    // data transformation - end

    // chart building

    const footer = (tooltipItems) => {
        let text = '';

        tooltipItems.forEach(function (tooltipItem) {
            text = tooltipItem.dataset.services[tooltipItem.dataIndex];
        });
        return 'Service: ' + text;
    };

    const ctx = document.getElementById('canv11');
    const data = {
        labels: transformedLabels,
        datasets: [
            {
                label: 'Count',
                data: tranformedData,
                services: transformedCustomData,
                backgroundColor: tranformedColors
            }
        ]
    };

    const config = {
        type: 'polarArea',
        data: data,
        options: {
            responsive: true,
            plugins: {
                tooltip: {
                    callbacks: {
                        footer: footer
                    }
                },
                legend: {
                    position: 'top',
                },
                title: {
                    display: true,
                    text: 'Top 10 Rejection Reasons Based On Services'.toUpperCase()
                }
            }
        },
    };

    chart11 = new Chart(ctx, config);
}

function canvas12(serverData) {
    // data transformation - start

    if (chart12 != null) {
        chart12.destroy();
    }

    const tranformedColors = [];
    const transformedLabels = [];
    const tranformedData = [];
    const transformedCustomData = [];
    function transformData() {
        var color = ''
        serverData.forEach(item => {
            color = getNextColor(color);

            transformedCustomData.push(item.product_Type);
            tranformedColors.push(CHART_COLORS[color]);
            transformedLabels.push(item.field_Name);
            tranformedData.push(item.count);
        });
    }

    transformData();

    // data transformation - end

    // chart building

    const footer = (tooltipItems) => {
        let text = '';

        tooltipItems.forEach(function (tooltipItem) {
            text = tooltipItem.dataset.services[tooltipItem.dataIndex];
        });
        return 'Product: ' + text;
    };

    const ctx = document.getElementById('canv12');
    const data = {
        labels: transformedLabels,
        datasets: [
            {
                label: 'Count',
                data: tranformedData,
                services: transformedCustomData,
                backgroundColor: tranformedColors
            }
        ]
    };

    const config = {
        type: 'polarArea',
        data: data,
        options: {
            responsive: true,
            plugins: {
                tooltip: {
                    callbacks: {
                        footer: footer
                    }
                },
                legend: {
                    position: 'top',
                },
                title: {
                    display: true,
                    text: 'Top 10 Rejection Reasons Based On Products'.toUpperCase()
                }
            }
        },
    };

    chart12 = new Chart(ctx, config);
}


function canvas13(serverData) {
    if (chart13 != null) {
        chart13.destroy();
    }

    var noOfContracts = [];
    var noOfAssets = [];
    var closureReasons = [];
    var lessorName = [];

    serverData.forEach(item => {
        noOfContracts.push(item.no_Of_Contracts);
        noOfAssets.push(item.no_Of_Assets);
        closureReasons.push(item.closure_Reason)
        lessorName.push(item.lessor_name)
    })

    const lessorNames = serverData.map(item => item.lessor_name);
    
    // chart building
    const ctx = document.getElementById('canv13');
    const data = {
        labels: closureReasons,
        datasets: [
            {
                label: 'Number of Contracts',
                data: noOfContracts,
                backgroundColor: CHART_COLORS.blue,
                borderWidth: 1
            },
            {
                label: 'Number of Assets',
                data: noOfAssets,
                backgroundColor: CHART_COLORS.green,
                borderWidth: 1
            },
        ]
    };

    chart13 = new Chart(ctx, {
        type: 'bar',
        data: data,
        options: {
            plugins: {
                tooltip: {
                    enabled: true,
                    callbacks: {
                        label: function (tooltipItem) {
                            const label = tooltipItem.dataset.label || '';
                            const value = tooltipItem.raw.toLocaleString();
                            return [
                                `${label}: ${value}`,
                                `Lessor: ${lessorNames[tooltipItem.dataIndex]}`,
                            ];
                        }
                    }
                },
                title: {
                    display: true,
                    text: 'No of Assets by Closure Reason Report'.toUpperCase(),
                },
            },
            responsive: true,
            interaction: {
                intersect: false
            },
            scales: {
                x: {
                    stacked: true,
                },
                y: {
                    stacked: true,
                }
            },
        }
    });
}


function canvas14(serverData) {
    if (chart14 != null) {
        chart14.destroy();
    }
    const purposes = serverData.map(item => item.purpose);
    const years = serverData.map(item => item.year_Contract_Open_Date);
    const totalLeasingAmounts = serverData.map(item => item.total_Leasing_Amount);
    const noOfContracts = serverData.map(item => item.no_Of_Contract);
    const noOfAssets = serverData.map(item => item.no_Of_Asset);

    // chart building
    const ctx = document.getElementById('canv14');

    chart14 = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: years,
            datasets: [
                {
                    label: 'Number of Contracts',
                    data: noOfContracts,
                    backgroundColor: CHART_COLORS.blue,
                    borderWidth: 1
                },
                {
                    label: 'Number of Assets',
                    data: noOfAssets,
                    backgroundColor: CHART_COLORS.green,
                    borderWidth: 1
                },
            ]
        },
        options: {
            responsive: true,
            interaction: {
                intersect: false
            },
            scales: {
                x: {
                    stacked: true,
                },
                y: {
                    stacked: true,
                }
            },
            plugins: {
                tooltip: {
                    enabled: true,
                    callbacks: {
                        label: function (tooltipItem) {
                            const label = tooltipItem.dataset.label || '';
                            const value = tooltipItem.raw.toLocaleString();
                            return [
                                `${label}: ${value}`,
                                `Purpose: ${purposes[tooltipItem.dataIndex]}`,
                                `Total Leasing Amount: ${totalLeasingAmounts[tooltipItem.dataIndex]}`
                            ];
                        }
                    }
                },
                title: {
                    display: true,
                    text: 'Open Year 127, 129 Analysis CEO ALL Lessors'.toUpperCase(),
                },
            },
        }
    });
}

function canvas15(serverData) {
    if (chart15 != null) {
        chart15.destroy();
    }

    const purposes = serverData.map(item => item.purpose);
    const years = serverData.map(item => item.year_Contract_Open_Date);
    const totalLeasingAmounts = serverData.map(item => item.total_Leasing_Amount);
    const noOfContracts = serverData.map(item => item.no_Of_Contract);
    const noOfAssets = serverData.map(item => item.no_Of_Asset);
    const lessors = serverData.map(item => item.lessor_name)
    // chart building
    const ctx = document.getElementById('canv15');

    chart15 = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: years,
            datasets: [
                {
                    label: 'Number of Contracts',
                    data: noOfContracts,
                    backgroundColor: CHART_COLORS.blue,
                    borderWidth: 1
                },
                {
                    label: 'Number of Assets',
                    data: noOfAssets,
                    backgroundColor: CHART_COLORS.green,
                    borderWidth: 1
                },
            ]
        },
        options: {
            responsive: true,
            interaction: {
                intersect: false
            },
            scales: {
                x: {
                    stacked: true,
                },
                y: {
                    stacked: true,
                }
            },
            plugins: {
                tooltip: {
                    enabled: true,
                    callbacks: {
                        label: function (tooltipItem) {
                            const label = tooltipItem.dataset.label || '';
                            const value = tooltipItem.raw.toLocaleString();
                            return [
                                `${label}: ${value}`,
                                `Lessor: ${lessors[tooltipItem.dataIndex]}`,
                                `Purpose: ${purposes[tooltipItem.dataIndex]}`,
                                `Total Leasing Amount: ${totalLeasingAmounts[tooltipItem.dataIndex]}`
                            ];
                        }
                    }
                },
                title: {
                    display: true,
                    text: 'Open Year 127, 129 Analysis CEO'.toUpperCase(),
                },
            },
        }
    });
}

function canvas16(serverData) {
    if (chart16 != null) {
        chart16.destroy();
    }

    const ctx = document.getElementById('canv16');

    const monthContractOpenDate = serverData.map(item => item.month_Contract_Open_Date);
    const noOfAssets = serverData.map(item => item.no_Of_Asset)
    
    chart16 = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: monthContractOpenDate,
            datasets: [
                {
                    label: 'Number of Assets',
                    data: noOfAssets,
                    backgroundColor: CHART_COLORS.blue,
                    borderWidth: 1
                }
            ]
        },
        borderWidth: 1,
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: 'Purpose Analysis Open date CEO All Lessors'.toUpperCase(),
                },
            },
        }
    });
}

function canvas17(serverData) {
    if (chart17 != null) {
        chart17.destroy();
    }
    const ctx = document.getElementById('canv17');

    const purpose = serverData.map(item => item.purpose);
    const noOfAssets = serverData.map(item => item.no_Of_Asset);
    const years = serverData.map(item => item.month_Year);
    const lessors = serverData.map(item => item.company_Name);


    const purposes = [...new Set(serverData.map(item => item.purpose))];

    const colorList = Object.values(CHART_COLORS);

    const dataset = purposes.map((purpose, index) => {
        return {
            label: purpose,
            data: years.map(name => {
                const found = serverData.find(item => item.month_Year === name && item.purpose === purpose);
                return found ? found.no_Of_Asset : 0;
            }),
            backgroundColor: colorList[index % colorList.length]
        }
    });

    chart17 = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: years,
            datasets: dataset
        },
        borderWidth: 1,
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: 'Purpose Analysis CEO'.toUpperCase(),
                },
                //tooltip: {
                //    enabled: true,
                //    callbacks: {
                //        label: function (tooltipItem) {
                //            const label = tooltipItem.dataset.label || '';
                //            const value = tooltipItem.raw.toLocaleString();
                //            return [
                //                `${label}: ${value}`,
                //                `Lessor: ${lessors[tooltipItem.dataIndex]}`
                //            ];
                //        }
                //    }
                //},
            },
        }
    });
}

function canvas18(serverData) {
    if (chart18 != null) {
        chart18.destroy();
    }
    const ctx = document.getElementById('canv18');

    const noOfAssets = serverData.map(item => item.no_Of_Asset);
    const years = serverData.map(item => item.month_Year);
    const lessors = serverData.map(item => item.company_Name);

    chart18 = new Chart(ctx, {
        type: 'line',
        data: {
            labels: lessors,
            datasets: [
                {
                    label: 'Number of Assets',
                    data: noOfAssets,
                    backgroundColor: CHART_COLORS.blue,
                    borderWidth: 1
                }
            ]
        },
        borderWidth: 1,
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: 'Purpose Analysis Open date CEO'.toUpperCase(),
                },
                tooltip: {
                    enabled: true,
                    callbacks: {
                        label: function (tooltipItem) {
                            const label = tooltipItem.dataset.label || '';
                            const value = tooltipItem.raw.toLocaleString();
                            return [
                                `${label}: ${value}`,
                                `Year: ${years[tooltipItem.dataIndex]}`,
                            ];
                        }
                    }
                },
            },
        }
    });
}

function canvas19(serverData) {
    if (chart19 != null) {
        chart19.destroy();
    }
    
    const ctx = document.getElementById('canv19');

    const groupedData = serverData.reduce((acc, item) => {
        if (!acc[item.product]) {
            acc[item.product] = { product: item.product, totalLeasingAmount: 0 };
        }
        acc[item.product].totalLeasingAmount += item.execution_value;
        return acc;
    }, {});

    const result = Object.values(groupedData);

    var products = result.map(x => x.product);
    var total_leasing_amount = result.map(x => x.totalLeasingAmount)
    

    chart19 = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: products,
            datasets: [
                {
                    label: products,
                    data: total_leasing_amount,
                    backgroundColor: CHART_COLORS.blue,
                    borderWidth: 1
                }
            ]
        },
        borderWidth: 1,
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: 'Total Leasing Amount by Product CEO v3'.toUpperCase(),
                },
            },
        }
    });
}

function canvas20(serverData) {
    if (chart20 != null) {
        chart20.destroy();
    }
    const ctx = document.getElementById('canv20');

    const purposes = [...new Set(serverData.map(item => item.purpose))];

    const lessorNames = [...new Set(serverData.map(item => item.lessor_name))];

    const colorList = Object.values(CHART_COLORS);

    const dataset = purposes.map((purpose, index) => {
        return {
            label: purpose,
            data: lessorNames.map(name => {
                const found = serverData.find(item => item.lessor_name === name && item.purpose === purpose);
                return found ? found.no_Of_Asset : 0;
            }),
            backgroundColor: colorList[index % colorList.length]
        }
    });
   
    chart20 = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: lessorNames,
            datasets: dataset
        },
        borderWidth: 1,
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: 'Purpose Analysis CEO Daily'.toUpperCase(),
                },
            },
        }
    });
}

function canvas10(serverData) {
    if (chart20 != null) {
        chart20.destroy();
    }
    const ctx = document.getElementById('canv20');

    const purposes = [...new Set(serverData.map(item => item.purpose))];

    const lessorNames = [...new Set(serverData.map(item => item.lessor_name))];

    const colorList = Object.values(CHART_COLORS);

    const dataset = purposes.map((purpose, index) => {
        return {
            label: purpose,
            data: lessorNames.map(name => {
                const found = serverData.find(item => item.lessor_name === name && item.purpose === purpose);
                return found ? found.no_Of_Asset : 0;
            }),
            backgroundColor: colorList[index % colorList.length]
        }
    });

    chart20 = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: lessorNames,
            datasets: dataset
        },
        borderWidth: 1,
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: 'Purpose Analysis CEO Daily'.toUpperCase(),
                },
            },
        }
    });
}

function canvasDurationChart(serverData) {
    
    if (chartDuration != null) {
        chartDuration.destroy();
    }
    const ctx = document.getElementById('canvasDurationChart');

    const durations = serverData.map(item => item.duration);
    const noOfAssets = serverData.map(item => item.total_Number_Of_Asset);
    const lessors = serverData.map(item => item.company_Name);

    chartDuration = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: lessors,
            datasets: [
                {
                    label: 'Number Of Assets',
                    data: noOfAssets,
                    backgroundColor: CHART_COLORS.green,
                    borderWidth: 1
                },
            ]
        },
        borderWidth: 1,
        options: {
            responsive: true,
            plugins: {
                tooltip: {
                    enabled: true,
                    callbacks: {
                        label: function (tooltipItem) {
                            const label = tooltipItem.dataset.label || '';
                            const value = tooltipItem.raw.toLocaleString();
                            return [
                                `${label}: ${value}`,
                                `Duration: ${durations[tooltipItem.dataIndex]}`,
                            ];
                        }
                    }
                },
                title: {
                    display: true,
                    text: 'Duration Analysis CEO All Lessors'.toUpperCase(),
                },
            },
        }
    });
}

function analytics1(serverData) {

    var el = document.getElementById('analytics1');
    el.innerHTML = "";

    serverData.forEach(item => {
        var service = item.contract_Purpose;
        item.product_Types.forEach(p => {

            var newRow = document.createElement('tr');

            // Create a new <th> element for the header cell
            var headerCell = document.createElement('th');
            headerCell.setAttribute('scope', 'row');
            headerCell.textContent = service;

            // Create two <td> elements for the data cells
            var dataCell1 = document.createElement('td');
            dataCell1.textContent = p.product;

            var dataCell2 = document.createElement('td');
            dataCell2.textContent = p.transactions_Count;

            // Append the header cell and data cells to the <tr> element
            newRow.appendChild(headerCell);
            newRow.appendChild(dataCell1);
            newRow.appendChild(dataCell2);

            el.appendChild(newRow);
        });
    });
}

function analytics2(serverData) {

    var el = document.getElementById('analytics2');
    el.innerHTML = "";

    serverData.forEach(item => {
        var newRow = document.createElement('tr');

        // Create a new <th> element for the header cell
        var headerCell = document.createElement('th');
        headerCell.setAttribute('scope', 'row');
        headerCell.textContent = formatDate(item.status_Date);

        var dataCell1 = document.createElement('td');
        dataCell1.textContent = item.registered_Contracts_Count;

        // Append the header cell and data cells to the <tr> element
        newRow.appendChild(headerCell);
        newRow.appendChild(dataCell1);

        el.appendChild(newRow);
    });

}

function formatDate(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2)
        month = '0' + month;
    if (day.length < 2)
        day = '0' + day;

    return [day, month, year].join('-');
}

function divObserver() {

    var rootElement = document.getElementById('kt_wrapper');
    const options = {
        root: rootElement,
        rootMargin: '10px',
        threshold: 0.65
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {

            if (entry.intersectionRatio > 0.65) {

                var canvasId = entry.target.id.toString();
                CHART_CALLS[canvasId]();
                observer.unobserve(document.getElementById(canvasId));

            }
            //console.log(JSON.stringify({ 'canvasId': entry.target.id, 'ratio': entry.intersectionRatio, 'text': entry.intersectionRatio > 0.65 ? 'visible' : 'invisible' }));
            //observer.unobserve(document.getElementById(entry.target.id));
        });

    }, options);

    const canvase = document.getElementsByTagName('canvas');
    for (var i = 0; i < canvase.length; i++) {
        observer.observe(canvase[i]);
    }

    const analytics = document.getElementsByTagName('tbody');
    for (var i = 0; i < analytics.length; i++) {
        observer.observe(analytics[i]);
    }
}



