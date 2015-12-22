FusionCharts.ready(function () {
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
                    "data": [
                        {
                            "value": "10000"
                        },
                        {
                            "value": "11500"
                        },
                        {
                            "value": "12500"
                        },
                        {
                            "value": "15000"
                        },
                         {
                             "value": "10000"
                         },
                        {
                            "value": "11500"
                        },
                        {
                            "value": "12500"
                        },
                        {
                            "value": "15000"
                        },
                         {
                             "value": "10000"
                         },
                        {
                            "value": "11500"
                        },
                        {
                            "value": "12500"
                        },
                        {
                            "value": "15000"
                        },
                        {
                            "value": "15000"
                        }
                    ]
                },
                {
                    "seriesname": "Current Year",
                    "data": [
                        {
                            "value": "25400"
                        },
                        {
                            "value": "29800"
                        },
                        {
                            "value": "21800"
                        },
                        {
                            "value": "26800"
                        },
                         {
                             "value": "25400"
                         },
                        {
                            "value": "29800"
                        },
                        {
                            "value": "21800"
                        },
                        {
                            "value": "26800"
                        },
                         {
                             "value": "25400"
                         },
                        {
                            "value": "29800"
                        },
                        {
                            "value": "21800"
                        },
                        {
                            "value": "26800"
                        },
                        {
                            "value": "26800"
                        }
                    ]
                }
            ],
            "trendlines": [
                {
                    "line": [
                        {
                            "startvalue": "12250",
                            "color": "#0075c2",
                            "displayvalue": "Previous{br}Average",
                            "valueOnRight": "1",
                            "thickness": "1",
                            "showBelow": "1",
                            "tooltext": "Previous year quarterly target  : $13.5K"
                        },
                        {
                            "startvalue": "25950",
                            "color": "#1aaf5d",
                            "displayvalue": "Current{br}Average",
                            "valueOnRight": "1",
                            "thickness": "1",
                            "showBelow": "1",
                            "tooltext": "Current year quarterly target  : $23K"
                        }
                    ]
                }
            ]
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
                    "data": [
                        {
                            "value": "10000"
                        },
                        {
                            "value": "11500"
                        },
                        {
                            "value": "12500"
                        },
                        {
                            "value": "15000"
                        },
                         {
                             "value": "10000"
                         },
                        {
                            "value": "11500"
                        },
                        {
                            "value": "12500"
                        },
                        {
                            "value": "15000"
                        },
                         {
                             "value": "10000"
                         },
                        {
                            "value": "11500"
                        },
                        {
                            "value": "12500"
                        },
                        {
                            "value": "15000"
                        },
                        {
                            "value": "15000"
                        }
                    ]
                },
                {
                    "seriesname": "Current Year",
                    "data": [
                        {
                            "value": "25400"
                        },
                        {
                            "value": "29800"
                        },
                        {
                            "value": "21800"
                        },
                        {
                            "value": "26800"
                        },
                         {
                             "value": "25400"
                         },
                        {
                            "value": "29800"
                        },
                        {
                            "value": "21800"
                        },
                        {
                            "value": "26800"
                        },
                         {
                             "value": "25400"
                         },
                        {
                            "value": "29800"
                        },
                        {
                            "value": "21800"
                        },
                        {
                            "value": "26800"
                        },
                        {
                            "value": "26800"
                        }
                    ]
                }
            ],
            "trendlines": [
                {
                    "line": [
                        {
                            "startvalue": "12250",
                            "color": "#0075c2",
                            "displayvalue": "Previous{br}Average",
                            "valueOnRight": "1",
                            "thickness": "1",
                            "showBelow": "1",
                            "tooltext": "Previous year quarterly target  : $13.5K"
                        },
                        {
                            "startvalue": "25950",
                            "color": "#1aaf5d",
                            "displayvalue": "Current{br}Average",
                            "valueOnRight": "1",
                            "thickness": "1",
                            "showBelow": "1",
                            "tooltext": "Current year quarterly target  : $23K"
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
                    "data": [
                        {
                            "value": "10000"
                        },
                        {
                            "value": "11500"
                        },
                        {
                            "value": "12500"
                        },
                        {
                            "value": "15000"
                        },
                         {
                             "value": "10000"
                         },
                        {
                            "value": "11500"
                        },
                        {
                            "value": "12500"
                        },
                        {
                            "value": "15000"
                        },
                         {
                             "value": "10000"
                         },
                        {
                            "value": "11500"
                        },
                        {
                            "value": "12500"
                        },
                        {
                            "value": "15000"
                        },
                        {
                            "value": "15000"
                        }
                    ]
                },
                {
                    "seriesname": "Current Year",
                    "data": [
                        {
                            "value": "25400"
                        },
                        {
                            "value": "29800"
                        },
                        {
                            "value": "21800"
                        },
                        {
                            "value": "26800"
                        },
                         {
                             "value": "25400"
                         },
                        {
                            "value": "29800"
                        },
                        {
                            "value": "21800"
                        },
                        {
                            "value": "26800"
                        },
                         {
                             "value": "25400"
                         },
                        {
                            "value": "29800"
                        },
                        {
                            "value": "21800"
                        },
                        {
                            "value": "26800"
                        },
                        {
                            "value": "26800"
                        }
                    ]
                }
            ],
            "trendlines": [
                {
                    "line": [
                        {
                            "startvalue": "12250",
                            "color": "#0075c2",
                            "displayvalue": "Previous{br}Average",
                            "valueOnRight": "1",
                            "thickness": "1",
                            "showBelow": "1",
                            "tooltext": "Previous year quarterly target  : $13.5K"
                        },
                        {
                            "startvalue": "25950",
                            "color": "#1aaf5d",
                            "displayvalue": "Current{br}Average",
                            "valueOnRight": "1",
                            "thickness": "1",
                            "showBelow": "1",
                            "tooltext": "Current year quarterly target  : $23K"
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
                        }
                    ]
                }
            ],
            "dataset": [
                {
                    "seriesname": "FY16",
                    "data": [
                        {
                            "value": "121000"
                        },
                        {
                            "value": "135000"
                        },
                        {
                            "value": "123500"
                        },
                        {
                            "value": "145000"
                        },
                        {
                            "value": "121000"
                        },
                        {
                            "value": "121000"
                        }
                    ]
                },
                {
                    "seriesname": "FY16",
                    "data": [
                        {
                            "value": "131400"
                        },
                        {
                            "value": "154800"
                        },
                        {
                            "value": "98300"
                        },
                        {
                            "value": "131800"
                        },
                        {
                            "value": "98300"
                        },
                        {
                            "value": "131800"
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
                "xAxisName": "Day",
                "showValues": "0"
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
                    "seriesname": "YTD",
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
                }
            ],
            "trendlines": [
                {
                    "line": [
                        {
                            "startvalue": "140000",
                            "color": "#6baa01",
                            "valueOnRight": "1",
                            "displayvalue": "Target",
                            "dashed":"1"
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
                    "data": [
                        {
                            "value": "10000"
                        },
                        {
                            "value": "11500"
                        },
                        {
                            "value": "12500"
                        },
                        {
                            "value": "15000"
                        },
                         {
                             "value": "10000"
                         },
                        {
                            "value": "11500"
                        },
                        {
                            "value": "12500"
                        },
                        {
                            "value": "15000"
                        },
                         {
                             "value": "10000"
                         },
                        {
                            "value": "11500"
                        },
                        {
                            "value": "12500"
                        },
                        {
                            "value": "15000"
                        },
                        {
                            "value": "15000"
                        }
                    ]
                },
                {
                    "seriesname": "Current Year",
                    "data": [
                        {
                            "value": "25400"
                        },
                        {
                            "value": "29800"
                        },
                        {
                            "value": "21800"
                        },
                        {
                            "value": "26800"
                        },
                         {
                             "value": "25400"
                         },
                        {
                            "value": "29800"
                        },
                        {
                            "value": "21800"
                        },
                        {
                            "value": "26800"
                        },
                         {
                             "value": "25400"
                         },
                        {
                            "value": "29800"
                        },
                        {
                            "value": "21800"
                        },
                        {
                            "value": "26800"
                        },
                        {
                            "value": "26800"
                        }
                    ]
                }
            ],
            "trendlines": [
                {
                    "line": [
                        {
                            "startvalue": "12250",
                            "color": "#0075c2",
                            "displayvalue": "Previous{br}Average",
                            "valueOnRight": "1",
                            "thickness": "1",
                            "showBelow": "1",
                            "tooltext": "Previous year quarterly target  : $13.5K"
                        },
                        {
                            "startvalue": "25950",
                            "color": "#1aaf5d",
                            "displayvalue": "Current{br}Average",
                            "valueOnRight": "1",
                            "thickness": "1",
                            "showBelow": "1",
                            "tooltext": "Current year quarterly target  : $23K"
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
                "yAxisValueDecimals":"9"
                
            },
            "categories": [
                {
                    "category": [
                        {
                            "label": "Jan-15"
                        },
                        {
                            "label": "Feb-15"
                        },
                        {
                            "label": "Mar-15"
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
                            "label": "Apr-15"
                        },
                        {
                            "label": "May-15"
                        },
                        {
                            "label": "Jun-15"
                        },
                        {
                            "label": "Jul-15"
                        },
                        {
                            "label": "Aug-15"
                        },
                        {
                            "label": "Sep-15"
                        },
                        {
                            "label": "Oct-15"
                        },
                        {
                            "label": "Nov-15"
                        }
                    ]
                }
            ],
            "dataset": [
                {
                    "seriesname": "YTD",
                    "data": [
                        {
                            "value": "0.777"
                        },
                        {
                            "value": "0.781"
                        },
                        {
                            "value": "0.762"
                        },
                        {
                            "value": "0.876"
                        },
                        {
                            "value": "0.765"
                        },
                        {
                            "value": "0.77"
                        },
                        {
                            "value": "0.732"
                        },
                        {
                            "value": "0.709"
                        },
                        {
                            "value": "0.702"
                        },
                        {
                            "value": "0.713"
                        },
                        {
                            "value": "0.723"
                        }
                    ]
                }
            ],
            "trendlines": [
                {
                    "line": [
                        {
                            "startvalue": "140000",
                            "color": "#6baa01",
                            "valueOnRight": "1",
                            "displayvalue": "Target",
                            "dashed": "1"
                        }
                    ]
                }
            ]
        }


    });

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




    revenueChart.render();
    resourceHoursChart.render();
    ProjectsInProgressChart.render();
    RevenueByClusterChart.render();
    CumulativeHoursChart.render();
    HeadcountChart.render();
    FXTrendChart.render();
    EDCMarginChart.render();

});
