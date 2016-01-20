FusionCharts.ready(function () {

    var revAtCostCurrentFiscalData, revAtCostPreviousFiscalData, userName, password, currentAverage, previousAverage, clusterChartData;
    var resHrsData, resHrsCurAvg, resHrsPrevAvg;
    var cumulativeHoursData, cumulativeHoursLabels;
    var FXChartData, FXChartLabels, FXAverage;
    var projectChartData, projectCurAvg, projectPrevAvg;
    var resourceChartData, resourceCurAvg, resourcePrevAvg;

    if (getCookie('UserIdentity') != "") {
        userName = getCookie('UserIdentity');
    }
    if (getCookie('UserPassword') != "") {
        password = getCookie('UserPassword');
    }

    $.ajax({
        type: "GET",
        url: "api/Dashboard/GetConsultingReportData?authToken=" + $.trim(userName) + "-" + $.trim(password),
        //data: parameters,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (data) {
            debugger;
            if (data != null) {
                //$scope.revAtCost = JSON.parse(data[0]);
                //$scope.revByCluster = JSON.parse(data[1]);
                //$scope.resourceHours = JSON.parse(data[2]);
                //$scope.cumulativeHours = JSON.parse(data[3]);
                //$scope.ProjectChartData = JSON.parse(data[4]);
                //$scope.ResourceChartData = JSON.parse(data[5]);
                //$scope.FXData = JSON.parse(data[6]);
                revAtCostCurrentFiscalData = JSON.parse(data[0]);
                revAtCostPreviousFiscalData = JSON.parse(data[1]);
                currentAverage = data[2];
                previousAverage = data[3];
                clusterChartData = JSON.parse(data[4]); 
                clusterLabels = JSON.parse(data[5]);
                resHrsData = JSON.parse(data[6]);
                resHrsCurAvg = data[7];
                resHrsPrevAvg = data[8];
                cumulativeHoursData = JSON.parse(data[9]);
                cumulativeHoursLabels = JSON.parse(data[10]);
                FXChartData = JSON.parse(data[11]);
                FXChartLabels = JSON.parse(data[12]);
                FXAverage = JSON.parse(data[13]);
                projectChartData = JSON.parse(data[14]);
                projectCurAvg = data[15];
                projectPrevAvg = data[16];
                resourceChartData = JSON.parse(data[17]);
                resourceCurAvg = data[18];
                resourcePrevAvg = data[19];


                debugger;

                var revenueChart = new FusionCharts({
                    "type": "mscolumn2d",
                    "renderAt": "chartContainer",
                    "width": "100%",
                    "height": "250",
                    "dataFormat": "json",
                    "dataSource": {
                        "chart": {
                            //"caption": "Comparison of Quarterly Revenue",
                            "xAxisname": "Periods",
                            "yAxisName": "Cost",
                            "numberPrefix": "$",
                            "plotFillAlpha": "80",
                            "paletteColors": "#0075c2,#1aaf5d",
                            "baseFontColor": "#333333",
                            "baseFont": "Helvetica Neue,Arial",
                            "captionFontSize": "14",
                            "subcaptionFontSize": "14",
                            "subcaptionFontBold": "0",
                            "showBorder": "0",
                            "bgColor": "#ffffff",
                            "showShadow": "0",
                            "canvasBgColor": "#ffffff",
                            "canvasBorderAlpha": "0",
                            "divlineAlpha": "100",
                            "divlineColor": "#999999",
                            "divlineThickness": "1",
                            "divLineIsDashed": "1",
                            "divLineDashLen": "1",
                            "divLineGapLen": "1",
                            "usePlotGradientColor": "0",
                            "showplotborder": "0",
                            "valueFontColor": "#ffffff",
                            "showValues": "0",
                            //"placeValuesInside": "0",
                            "showHoverEffect": "1",
                            "rotateValues": "1",
                            "showXAxisLine": "1",
                            "xAxisLineThickness": "1",
                            "xAxisLineColor": "#999999",
                            "showAlternateHGridColor": "0",
                            "legendBgAlpha": "0",
                            "legendBorderAlpha": "0",
                            "legendShadow": "0",
                            "legendItemFontSize": "10",
                            "legendItemFontColor": "#666666"
                        },
                        "categories": [
                            {
                                "category": [
                                    {
                                        "label": "P1"
                                    },
                                    {
                                        "label": "P2"
                                    },
                                    {
                                        "label": "P3"
                                    },
                                    {
                                        "label": "P4"
                                    },
                                    {
                                        "label": "P5"
                                    },
                                    {
                                        "label": "P6"
                                    },
                                    {
                                        "label": "P7"
                                    },
                                    {
                                        "label": "P8"
                                    },
                                    {
                                        "label": "P9"
                                    },
                                    {
                                        "label": "P10"
                                    },
                                    {
                                        "label": "P11"
                                    },
                                    {
                                        "label": "P12"
                                    },
                                    {
                                        "label": "P13"
                                    }
                                ]
                            }
                        ],
                        "dataset": [
                            {
                                "seriesname": "Previous Year",
                                "data": revAtCostPreviousFiscalData
                            },
                            {
                                "seriesname": "Current Year",
                                "data": revAtCostCurrentFiscalData
                            }
                        ],
                        "trendlines": [
                            {
                                "line": [
                                    {
                                        "startvalue": previousAverage,
                                        "color": "#0075c2",
                                        "displayvalue": "Previous{br}Average",
                                        "valueOnRight": "1",
                                        "thickness": "1",
                                        "showBelow": "1",
                                        "tooltext": numeral(previousAverage).format('($ 0.00 a)')
                                    },
                                    {
                                        "startvalue": currentAverage,
                                        "color": "#1aaf5d",
                                        "displayvalue": "Current{br}Average",
                                        "valueOnRight": "1",
                                        "thickness": "1",
                                        "showBelow": "1",
                                        "tooltext": numeral(currentAverage).format('($ 0.00 a)')
                                    }
                                ]
                            }
                        ]
                    }
                });

                var RevenueByClusterChart = new FusionCharts({
                    "type": "stackedcolumn2d",
                    "renderAt": "RevenueByClusterContainer",
                    "width": "100%",
                    "height": "250",
                    "dataFormat": "json",
                    "dataSource": {
                        "chart": {
                            //"caption": "Product-wise quarterly revenue in current year",
                            //"subCaption": "Harry's SuperMart",
                            "xAxisname": "Periods",
                            "yAxisName": "Revenue",
                            "numberPrefix": "$",
                            "paletteColors": "#0075c2,#1aaf5d,#006400, #000000",
                            "bgColor": "#ffffff",
                            "borderAlpha": "20",
                            "showBorder": "0",
                            "showCanvasBorder": "0",
                            "usePlotGradientColor": "0",
                            "plotBorderAlpha": "10",
                            "legendBorderAlpha": "0",
                            "legendShadow": "0",
                            "valueFontColor": "#ffffff",
                            "showXAxisLine": "1",
                            "xAxisLineColor": "#999999",
                            "divlineColor": "#999999",
                            "divLineDashed": "1",
                            "showAlternateHGridColor": "0",
                            "subcaptionFontBold": "0",
                            "subcaptionFontSize": "14",
                            "showHoverEffect": "1",
                            "showValues": "0"
                        },
                        "categories": [
                            {
                                "category": clusterLabels
                            }
                        ],
                        "dataset": clusterChartData
                    }
                });


                var resourceHoursChart = new FusionCharts({
                    "type": "mscolumn2d",
                    "renderAt": "resourceHoursChartContainer",
                    "width": "100%",
                    "height": "250",
                    "dataFormat": "json",
                    "dataSource": {
                        "chart": {
                            //"caption": "Comparison of Quarterly Revenue",
                            "xAxisname": "Periods",
                            "yAxisName": "Hours",
                            //"numberPrefix": "$",
                            "plotFillAlpha": "80",
                            "paletteColors": "#0075c2,#1aaf5d",
                            "baseFontColor": "#333333",
                            "baseFont": "Helvetica Neue,Arial",
                            "captionFontSize": "14",
                            "subcaptionFontSize": "14",
                            "subcaptionFontBold": "0",
                            "showBorder": "0",
                            "bgColor": "#ffffff",
                            "showShadow": "0",
                            "canvasBgColor": "#ffffff",
                            "canvasBorderAlpha": "0",
                            "divlineAlpha": "100",
                            "divlineColor": "#999999",
                            "divlineThickness": "1",
                            "divLineIsDashed": "1",
                            "divLineDashLen": "1",
                            "divLineGapLen": "1",
                            "usePlotGradientColor": "0",
                            "showplotborder": "0",
                            "valueFontColor": "#ffffff",
                            "showValues": "0",
                            //"placeValuesInside": "0",
                            "showHoverEffect": "1",
                            "rotateValues": "1",
                            "showXAxisLine": "1",
                            "xAxisLineThickness": "1",
                            "xAxisLineColor": "#999999",
                            "showAlternateHGridColor": "0",
                            "legendBgAlpha": "0",
                            "legendBorderAlpha": "0",
                            "legendShadow": "0",
                            "legendItemFontSize": "10",
                            "legendItemFontColor": "#666666"
                        },
                        "categories": [
                            {
                                "category": [
                                    {
                                        "label": "P1"
                                    },
                                    {
                                        "label": "P2"
                                    },
                                    {
                                        "label": "P3"
                                    },
                                    {
                                        "label": "P4"
                                    },
                                    {
                                        "label": "P5"
                                    },
                                    {
                                        "label": "P6"
                                    },
                                    {
                                        "label": "P7"
                                    },
                                    {
                                        "label": "P8"
                                    },
                                    {
                                        "label": "P9"
                                    },
                                    {
                                        "label": "P10"
                                    },
                                    {
                                        "label": "P11"
                                    },
                                    {
                                        "label": "P12"
                                    },
                                    {
                                        "label": "P13"
                                    }
                                ]
                            }
                        ],
                        "dataset": resHrsData,
                        "trendlines": [
                            {
                                "line": [
                                    {
                                        "startvalue": resHrsPrevAvg,
                                        "color": "#0075c2",
                                        "displayvalue": "Previous{br}Average",
                                        "valueOnRight": "1",
                                        "thickness": "1",
                                        "showBelow": "1",
                                        "tooltext": numeral(resHrsPrevAvg).format('(0.00 a)')
                                    },
                                    {
                                        "startvalue": resHrsCurAvg,
                                        "color": "#1aaf5d",
                                        "displayvalue": "Current{br}Average",
                                        "valueOnRight": "1",
                                        "thickness": "1",
                                        "showBelow": "1",
                                        "tooltext": numeral(resHrsCurAvg).format('(0.00 a)')
                                    }
                                ]
                            }
                        ]
                    }
                });

                var CumulativeHoursChart = new FusionCharts({
                    "type": "msline",
                    "renderAt": "CumulativeHoursContainer",
                    "width": "100%",
                    "height": "250",
                    "dataFormat": "json",
                    "dataSource": {

                        "chart": {

                            "captionFontSize": "14",
                            "subcaptionFontSize": "14",
                            "subcaptionFontBold": "0",
                            "paletteColors": "#0075c2,#1aaf5d",
                            "bgcolor": "#ffffff",
                            "showBorder": "0",
                            "showShadow": "0",
                            "showCanvasBorder": "0",
                            "usePlotGradientColor": "0",
                            "legendBorderAlpha": "0",
                            "legendShadow": "0",
                            "showAxisLines": "0",
                            "showAlternateHGridColor": "0",
                            "divlineThickness": "1",
                            "divLineDashed": "1",
                            "divLineDashLen": "1",
                            "divLineGapLen": "1",
                            "xAxisName": "Periods",
                            "showValues": "0"
                        },
                        "categories": [
                            {
                                "category": cumulativeHoursLabels
                            }
                        ],
                        "dataset": cumulativeHoursData,
                        "trendlines": [
                            {
                                "line": [
                                    {
                                        "startvalue": "140000",
                                        "color": "#6baa01",
                                        "valueOnRight": "1",
                                        "displayvalue": "Target {br} 140k",
                                        "dashed": "1"
                                    }
                                ]
                            }
                        ]
                    }


                });

                var FXTrendChart = new FusionCharts({
                    "type": "msline",
                    "renderAt": "FXTrendContainer",
                    "width": "100%",
                    "height": "250",
                    "dataFormat": "json",
                    "dataSource": {
                        "chart": {
                            "captionFontSize": "14",
                            "subcaptionFontSize": "14",
                            "subcaptionFontBold": "0",
                            "paletteColors": "#0075c2,#1aaf5d",
                            "bgcolor": "#ffffff",
                            "showBorder": "0",
                            "showShadow": "0",
                            "showCanvasBorder": "0",
                            "usePlotGradientColor": "0",
                            "legendBorderAlpha": "0",
                            "legendShadow": "0",
                            "showAxisLines": "0",
                            "showAlternateHGridColor": "0",
                            "divlineThickness": "1",
                            "divLineDashed": "1",
                            "divLineDashLen": "1",
                            "divLineGapLen": "1",
                            "xAxisName": "Day",
                            "showValues": "0",
                            "yAxisValueDecimals": "9"

                        },
                        "categories": [
                            {
                                "category": FXChartLabels
                            }
                        ],
                        "dataset": FXChartData,
                        "trendlines": [
                            {
                                "line": [
                                    {
                                        "startvalue": FXAverage,
                                        "color": "#6baa01",
                                        "valueOnRight": "1",
                                        "displayvalue": "Average",
                                        "dashed": "1",
                                        "tooltext": numeral(FXAverage).format('(0.00 a)')
                                    }
                                ]
                            }
                        ]
                    }


                });

                var ProjectsInProgressChart = new FusionCharts({
                    "type": "mscolumn2d",
                    "renderAt": "ProjectsInProgressContainer",
                    "width": "100%",
                    "height": "250",
                    "dataFormat": "json",
                    "dataSource": {
                        "chart": {
                            //"caption": "Comparison of Quarterly Revenue",
                            "xAxisname": "Periods",
                            "yAxisName": "Cost",
                            "numberPrefix": "$",
                            "plotFillAlpha": "80",
                            "paletteColors": "#0075c2,#1aaf5d",
                            "baseFontColor": "#333333",
                            "baseFont": "Helvetica Neue,Arial",
                            "captionFontSize": "14",
                            "subcaptionFontSize": "14",
                            "subcaptionFontBold": "0",
                            "showBorder": "0",
                            "bgColor": "#ffffff",
                            "showShadow": "0",
                            "canvasBgColor": "#ffffff",
                            "canvasBorderAlpha": "0",
                            "divlineAlpha": "100",
                            "divlineColor": "#999999",
                            "divlineThickness": "1",
                            "divLineIsDashed": "1",
                            "divLineDashLen": "1",
                            "divLineGapLen": "1",
                            "usePlotGradientColor": "0",
                            "showplotborder": "0",
                            "valueFontColor": "#ffffff",
                            "showValues": "0",
                            //"placeValuesInside": "0",
                            "showHoverEffect": "1",
                            "rotateValues": "1",
                            "showXAxisLine": "1",
                            "xAxisLineThickness": "1",
                            "xAxisLineColor": "#999999",
                            "showAlternateHGridColor": "0",
                            "legendBgAlpha": "0",
                            "legendBorderAlpha": "0",
                            "legendShadow": "0",
                            "legendItemFontSize": "10",
                            "legendItemFontColor": "#666666"
                        },
                        "categories": [
                            {
                                "category": [
                                    {
                                        "label": "Jun"
                                    },
                                    {
                                        "label": "Jul"
                                    },
                                    {
                                        "label": "Aug"
                                    },
                                    {
                                        "label": "Sep"
                                    },
                                    {
                                        "label": "Oct"
                                    },
                                    {
                                        "label": "Nov"
                                    },
                                    {
                                        "label": "Dec"
                                    },
                                    {
                                        "label": "Jan"
                                    },
                                    {
                                        "label": "Feb"
                                    },
                                    {
                                        "label": "Mar"
                                    },
                                    {
                                        "label": "Apr"
                                    },
                                    {
                                        "label": "May"
                                    }
                                ]
                            }
                        ],
                        "dataset": projectChartData,
                        "trendlines": [
                            {
                                "line": [
                                    {
                                        "startvalue": projectPrevAvg,
                                        "color": "#0075c2",
                                        "displayvalue": "PreviousAvg",
                                        "valueOnRight": "1",
                                        "thickness": "1",
                                        "showBelow": "1",
                                        "tooltext": numeral(projectPrevAvg).format('(0 a)')
                                    },
                                    {
                                        "startvalue": projectCurAvg,
                                        "color": "#1aaf5d",
                                        "displayvalue": "CurrentAvg",
                                        "valueOnRight": "1",
                                        "thickness": "1",
                                        "showBelow": "1",
                                        "tooltext": numeral(projectCurAvg).format('(0 a)')
                                    }
                                ]
                            }
                        ]
                    }
                });

                var HeadcountChart = new FusionCharts({
                    "type": "mscolumn2d",
                    "renderAt": "HeadcountContainer",
                    "width": "100%",
                    "height": "250",
                    "dataFormat": "json",
                    "dataSource": {
                        "chart": {
                            //"caption": "Comparison of Quarterly Revenue",
                            "xAxisname": "Periods",
                            //"yAxisName": "Cost",
                            //"numberPrefix": "$",
                            "plotFillAlpha": "80",
                            "paletteColors": "#0075c2,#1aaf5d",
                            "baseFontColor": "#333333",
                            "baseFont": "Helvetica Neue,Arial",
                            "captionFontSize": "14",
                            "subcaptionFontSize": "14",
                            "subcaptionFontBold": "0",
                            "showBorder": "0",
                            "bgColor": "#ffffff",
                            "showShadow": "0",
                            "canvasBgColor": "#ffffff",
                            "canvasBorderAlpha": "0",
                            "divlineAlpha": "100",
                            "divlineColor": "#999999",
                            "divlineThickness": "1",
                            "divLineIsDashed": "1",
                            "divLineDashLen": "1",
                            "divLineGapLen": "1",
                            "usePlotGradientColor": "0",
                            "showplotborder": "0",
                            "valueFontColor": "#ffffff",
                            "showValues": "0",
                            //"placeValuesInside": "0",
                            "showHoverEffect": "1",
                            "rotateValues": "1",
                            "showXAxisLine": "1",
                            "xAxisLineThickness": "1",
                            "xAxisLineColor": "#999999",
                            "showAlternateHGridColor": "0",
                            "legendBgAlpha": "0",
                            "legendBorderAlpha": "0",
                            "legendShadow": "0",
                            "legendItemFontSize": "10",
                            "legendItemFontColor": "#666666"
                        },
                        "categories": [
                            {
                                "category": [
                                     {
                                         "label": "Jun"
                                     },
                                    {
                                        "label": "Jul"
                                    },
                                    {
                                        "label": "Aug"
                                    },
                                    {
                                        "label": "Sep"
                                    },
                                    {
                                        "label": "Oct"
                                    },
                                    {
                                        "label": "Nov"
                                    },
                                    {
                                        "label": "Dec"
                                    },
                                    {
                                        "label": "Jan"
                                    },
                                    {
                                        "label": "Feb"
                                    },
                                    {
                                        "label": "Mar"
                                    },
                                    {
                                        "label": "Apr"
                                    },
                                    {
                                        "label": "May"
                                    }
                                ]
                            }
                        ],
                        "dataset": resourceChartData,
                        "trendlines": [
                            {
                                "line": [
                                    {
                                        "startvalue": resourcePrevAvg,
                                        "color": "#0075c2",
                                        "displayvalue": "Previous{br}Average",
                                        "valueOnRight": "1",
                                        "thickness": "1",
                                        "showBelow": "1",
                                        "tooltext": numeral(resourcePrevAvg).format('(0 a)')
                                    },
                                    {
                                        "startvalue": resourceCurAvg,
                                        "color": "#1aaf5d",
                                        "displayvalue": "Current{br}Average",
                                        "valueOnRight": "1",
                                        "thickness": "1",
                                        "showBelow": "1",
                                        "tooltext": numeral(resourceCurAvg).format('(0 a)')
                                    }
                                ]
                            }
                        ]
                    }
                });





                revenueChart.render();
                RevenueByClusterChart.render();
                resourceHoursChart.render();
                CumulativeHoursChart.render();
                FXTrendChart.render();
                ProjectsInProgressChart.render();
                HeadcountChart.render();
                DownloadConsultingReport();


            }
            
        },
        error: function (e) {
            
        }
    });

    var DownloadConsultingReport = function () {
        //debugger;
        $.ajax({
            method: 'GET',
            cache: false,
            url: 'api/Dashboard/GetConsultingReportPDF',
            responseType: 'arraybuffer',
            headers: {
                'Content-Type': 'application/json; charset=utf-8'                
            }
        }).success(function (data, status, headers) {
            debugger;
            var octetStreamMime = 'application/pdf';
            var success = false;

            // Get the headers
            //headers = headers();

            // Get the filename from the x-filename header or default to "download.bin"
            var filename = "ConsultingReport.pdf";

            // Determine the content type from the header or default to "application/octet-stream"
            var contentType = headers['content-type'] || octetStreamMime;

            try {

                console.log(filename);
                // Try using msSaveBlob if supported
                console.log("Trying saveBlob method ...");
                var blob = new Blob([data], { type: contentType });
                if (navigator.msSaveBlob)
                    navigator.msSaveBlob(blob, filename);
                else {
                    // Try using other saveBlob implementations, if available
                    var saveBlob = navigator.webkitSaveBlob || navigator.mozSaveBlob || navigator.saveBlob;
                    if (saveBlob === undefined) throw "Not supported";
                    saveBlob(blob, filename);
                }
                console.log("saveBlob succeeded");
                success = true;
            } catch (ex) {
                console.log("saveBlob method failed with the following exception:");
                console.log(ex);
            }
            //debugger;
            if (!success) {
                // Get the blob url creator
                var urlCreator = window.URL || window.webkitURL || window.mozURL || window.msURL;
                if (urlCreator) {
                    // Try to use a download link
                    var link = document.createElement('a');
                    if ('download' in link) {
                        // Try to simulate a click
                        try {
                            // Prepare a blob URL
                            console.log("Trying download link method with simulated click ...");
                            var blob = new Blob([data], { type: contentType });
                            var url = urlCreator.createObjectURL(blob);
                            link.setAttribute('href', url);

                            // Set the download attribute (Supported in Chrome 14+ / Firefox 20+)
                            link.setAttribute("download", filename);

                            // Simulate clicking the download link
                            var event = document.createEvent('MouseEvents');
                            event.initMouseEvent('click', true, true, window, 1, 0, 0, 0, 0, false, false, false, false, 0, null);
                            link.dispatchEvent(event);
                            console.log("Download link method with simulated click succeeded");
                            success = true;

                        } catch (ex) {
                            console.log("Download link method with simulated click failed with the following exception:");
                            console.log(ex);
                        }
                    }

                    if (!success) {
                        // Fallback to window.location method
                        try {
                            // Prepare a blob URL
                            // Use application/octet-stream when using window.location to force download
                            console.log("Trying download link method with window.location ...");
                            var blob = new Blob([data], { type: octetStreamMime });
                            var url = urlCreator.createObjectURL(blob);
                            window.location = url;
                            console.log("Download link method with window.location succeeded");
                            success = true;
                        } catch (ex) {
                            console.log("Download link method with window.location failed with the following exception:");
                            console.log(ex);
                        }
                    }

                }
            }

            if (!success) {
                // Fallback to window.open method
                console.log("No methods worked for saving the arraybuffer, using last resort window.open");
                window.open(httpPath, '_blank', '');
            }
            /******************/


        }).error(function (data, status) {

            console.log("Request failed with status: " + status);

            // Optionally write the error out to scope
            //$scope.errorDetails = "Request failed with status: " + status;
        });
    };

   
    

    var EDCMarginChart = new FusionCharts({
        "type": "msline",
        "renderAt": "EDCMarginContainer",
        "width": "100%",
        "height": "250",
        "dataFormat": "json",
        "dataSource": {

            "chart": {

                "captionFontSize": "14",
                "subcaptionFontSize": "14",
                "subcaptionFontBold": "0",
                "paletteColors": "#0075c2,#1aaf5d",
                "bgcolor": "#ffffff",
                "showBorder": "0",
                "showShadow": "0",
                "showCanvasBorder": "0",
                "usePlotGradientColor": "0",
                "legendBorderAlpha": "0",
                "legendShadow": "0",
                "showAxisLines": "0",
                "showAlternateHGridColor": "0",
                "divlineThickness": "1",
                "divLineDashed": "1",
                "divLineDashLen": "1",
                "divLineGapLen": "1",
                "xAxisName": "Day",
                "showValues": "0",
                "numberPrefix": "$"
            },
            "categories": [
                {
                    "category": [
                        {
                            "label": "P1"
                        },
                        {
                            "label": "P2"
                        },
                        {
                            "label": "P3"
                        },
                        //{
                        //    "vline": "true",
                        //    "lineposition": "0",
                        //    "color": "#6baa01",
                        //    "labelHAlign": "center",
                        //    "labelPosition": "0",
                        //    "label": "National holiday",
                        //    "dashed": "1"
                        //},
                        {
                            "label": "P4"
                        },
                        {
                            "label": "P5"
                        },
                        {
                            "label": "P6"
                        }
                    ]
                }
            ],
            "dataset": [
                {
                    "seriesname": "Cost of Service",
                    "data": [
                        {
                            "value": "24336"
                        },
                        {
                            "value": "52509"
                        },
                        {
                            "value": "83792"
                        },
                        {
                            "value": "117572"
                        },
                        {
                            "value": "153834"
                        },
                        {
                            "value": "192545"
                        }
                    ]
                },
                {
                    "seriesname": "Planned Invoice Amount",
                    "data": [
                        {
                            "value": "35000"
                        },
                        {
                            "value": "65000"
                        },
                        {
                            "value": "100000"
                        },
                        {
                            "value": "140000"
                        },
                        {
                            "value": "180000"
                        },
                        {
                            "value": "250000"
                        }
                    ]
                }
            ]
            //"trendlines": [
            //    {
            //        "line": [
            //            {
            //                "startvalue": "140000",
            //                "color": "#6baa01",
            //                "valueOnRight": "1",
            //                "displayvalue": "Target",
            //                "dashed": "1"
            //            }
            //        ]
            //    }
            //]
        }


    });




  
    
    
    
    
    EDCMarginChart.render();

});
