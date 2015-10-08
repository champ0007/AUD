﻿/// <reference path="../angular.min.js" />
/// <reference path="../jquery-1.10.2.intellisense.js" />
var todos;

var AUDashboardApp = angular.module("AUDashboardApp", ["ngRoute", "tc.chartjs", "angularFileUpload", "angularUtils.directives.dirPagination"]);

AUDashboardApp.config(['$routeProvider',
    function ($routeProvider) {
        $routeProvider.
        when('/Dashboard', {
            templateUrl: 'partials/partialDashboard.html',
            controller: 'DashboardController'
        }).
        when('/ActionItems', {
            templateUrl: 'partials/ActionItems.html',
            controller: 'ActionItemsController'
        }).
        when('/ActiveProjects', {
            templateUrl: 'partials/ActiveProjects.html',
            controller: 'ActiveProjectsController'
        }).
        when('/ActiveResources', {
            templateUrl: 'partials/ActiveResources.html',
            controller: 'ActiveResourcesController'
        }).
        when('/NewActionItems', {
            templateUrl: 'partials/NewActionItems.html',
            controller: 'NewActionItemsController'
        }).
        when('/Operations', {
            templateUrl: 'partials/Operations.html',
            controller: 'OperationsController'
        }).
        when('/Invoices', {
            templateUrl: 'partials/Invoices.html',
            controller: 'InvoicesController'
        }).
        when('/CurrentStatus', {
            templateUrl: 'partials/CurrentStatus.html',
            controller: "CurrentStatusController"
        }).
        otherwise({
            redirectTo: '/Dashboard'
        });
    }
]);

AUDashboardApp.controller("CurrentStatusController", ['$scope', '$http','$timeout','$filter', function ($scope, $http,$timeout,$filter) {
    var STORAGE_ID = 'Projects';
    $scope.AllProjectDetails = {};
    $scope.ProposedProjectDetails = {};

    $scope.$on('$viewContentLoaded', function () {
        $timeout(function () {
            var downloadServiceUrl = "SendMail.asmx/SendReport";
            $scope.Download = function () {
                html2canvas(document.body, {
                    onrendered: function (canvas) {
                        var Pic = canvas.toDataURL("image/png");
                        Pic = Pic.replace(/^data:image\/(png|jpg);base64,/, "");

                        // Sending the image data to Server
                        
                        $http({
                            method: 'POST',
                            //url: 'SendMail.asmx/UploadPic',
                            url: 'api/Dashboard/UploadCurrentStatus',
                            data: Pic,//JSON.stringify(JSON.stringify(Pic))
                            //data: {
                            //    imageData: Pic
                            //},
                            contentType: 'application/json, charset=utf-8',
                            //dataType: 'json',
                        }).success(function (msg) {
                            alert(msg);
                        }).error(function (msg) {
                            alert(msg);
                        });
                    }
                });
            }
            $scope.Download();
        }, 5000);
    });

    // get proposed/all projects
    $scope.getProjects = function () {
        $http({
            method: 'GET',
            url: 'api/Dashboard/GetReferenceData?storageId=' + STORAGE_ID + '&authToken=' + $scope.UserIdentity + "-" + $scope.UserPassword,
        }).
        success(function (data, status, headers, config) {
            if (data != 'null') {
                $scope.AllProjectDetails = JSON.parse(JSON.parse(data));
                $scope.ProposedProjectDetails = $filter('filter')($scope.AllProjectDetails, { Stage: "Proposal" });
            }
        }).
        error(function (data, status, headers, config) {
            // called asynchronously if an error occurs
            // or server returns response with an error status.
        });

    };

    // get key updates
    $scope.getKeyUpdates = function () {
        $http({
            method: 'GET',
            url: 'api/Dashboard/GetReferenceData?storageId=KeyUpdates&authToken=' + $scope.UserIdentity + "-" + $scope.UserPassword
        }).
        success(function (data, status, headers, config) {
            if (data != 'null') {
                $scope.keyUpdates = JSON.parse(JSON.parse(data));
            }
        }).
        error(function (data, status, headers, config) {
        });
    };

    // get dashboard count
    $scope.getDashboardCount = function () {
        $http({
            method: 'GET',
            url: 'api/Dashboard/GetDashboardCounts?authToken=' + $scope.UserIdentity + "-" + $scope.UserPassword
        }).success(function (data, status, headers, config) {
            $scope.$parent.PendingInvoices = JSON.parse(JSON.parse(data))[0];
            $scope.$parent.ActiveProjects = JSON.parse(JSON.parse(data))[1];
            $scope.$parent.OpenActionItems = JSON.parse(JSON.parse(data))[2];
            $scope.$parent. ActiveResources = JSON.parse(JSON.parse(data))[3];

        }).error(function (data, status, headers, config) {
            // called asynchronously if an error occurs
            // or server returns response with an error status.
            $scope.ActiveProjects = -1;
            $scope.PendingInvoices = -1;
            $scope.ActiveResources = -1;
            $scope.OpenActionItems = -1;
        });
    }

    // Competency Distribution Chart
    $scope.UpdateTechChart = function () {
        $http({
            method: 'GET',
            url: 'api/Dashboard/GetTechChartData?authToken=' + $scope.UserIdentity + "-" + $scope.UserPassword
        }).
      success(function (data, status, headers, config) {
          if (data != null) {
              debugger;
              var colors = ['#F7464A', '#46BFBD', '#FDB45C', '#40C000', '#FF8000', '#F7464A', '#46BFBD', '#FDB45C', '#46BFBA', '#FDB4AC', '#F7464A', '#46BFBD', '#FDB45C', '#46BFBA', '#FDB4AC', '#F7464A', '#46BFBD', '#FDB45C', '#46BFBA', '#FDB4AC'];
              var highlights = ['#FF5A5E', '#5AD3D1', '#FFC870', '#40C000', '#FFC870', '#FF5A5E', '#5AD3D1', '#FFC870', '#5AD3D1', '#FFC870', '#FF5A5E', '#5AD3D1', '#FFC870', '#5AD3D1', '#FFC870', '#FF5A5E', '#5AD3D1', '#FFC870', '#5AD3D1', '#FFC870'];
              $scope.ProjectChartData = [];
              var ProjectChartDataList = JSON.parse(data[0]);
              for (i = 0; i < ProjectChartDataList.length; i++) {
                  var dataItem = new Object();
                  dataItem.value = ProjectChartDataList[i].value;
                  dataItem.label = ProjectChartDataList[i].label;
                  dataItem.color = colors[i];
                  dataItem.highlight = highlights[i];
                  $scope.ProjectChartData.push(dataItem);
              }
          }
      }).
      error(function (data, status, headers, config) {
          // called asynchronously if an error occurs
          // or server returns response with an error status.
          $scope.AllResources = -1;
      });
    };

    $scope.ProjectChartOptions = {

        // Sets the chart to be responsive
        responsive: true,

        //Boolean - Whether we should show a stroke on each segment
        segmentShowStroke: true,

        //String - The colour of each segment stroke
        segmentStrokeColor: '#fff',

        //Number - The width of each segment stroke
        segmentStrokeWidth: 2,

        //Number - The percentage of the chart that we cut out of the middle
        percentageInnerCutout: 50, // This is 0 for Pie charts

        //Number - Amount of animation steps
        animationSteps: 100,

        //String - Animation easing effect
        animationEasing: 'easeOutQuint',

        //Boolean - Whether we animate the rotation of the Doughnut
        animateRotate: true,

        //Boolean - Whether we animate scaling the Doughnut from the centre
        animateScale: false,

        //String - A legend template
        legendTemplate: '<ul class="tc-chart-js-legend"><% for (var i=0; i<segments.length; i++){%><li><span style="background-color:<%=segments[i].fillColor%>"></span><%if(segments[i].label){%><%=segments[i].label%><%}%></li><%}%></ul>'

    };

    // Project Distribution Chart
    $scope.UpdateProjectDistributionChart = function () {
        $http({
            method: 'GET',
            url: 'api/Dashboard/GetProjectDistributionChartData?authToken=' + $scope.UserIdentity + "-" + $scope.UserPassword
        }).
      success(function (data, status, headers, config) {
          if (data != null) {
              //debugger;

              $scope.ProjectDistLabels = JSON.parse(data[0]);
              $scope.ProjectDistData = JSON.parse(data[1]);

              $scope.ProjectDistributionData.labels = JSON.parse(data[0]);
              $scope.ProjectDistributionData.datasets[0].data = JSON.parse(data[1]);

          }
      }).
      error(function (data, status, headers, config) {
          // called asynchronously if an error occurs
          // or server returns response with an error status.

      });
    };

    $scope.ProjectDistributionData = {
        labels: $scope.ProjectDistLabels,
        datasets: [
          {
              label: 'No. of projects by month',
              fillColor: '#0cc09f',
              strokeColor: 'rgba(220,220,220,0.8)',
              highlightFill: '#0aac8e',
              highlightStroke: 'rgba(220,220,220,1)',
              data: $scope.ProjectDistData
          }
        ]
    };

    $scope.ProjectDistributionOptions = {

        // Sets the chart to be responsive
        responsive: true,

        //Boolean - Whether the scale should start at zero, or an order of magnitude down from the lowest value
        scaleBeginAtZero: true,

        //Boolean - Whether grid lines are shown across the chart
        scaleShowGridLines: true,

        //String - Colour of the grid lines
        scaleGridLineColor: "rgba(0,0,0,.05)",

        //Number - Width of the grid lines
        scaleGridLineWidth: 1,

        //Boolean - If there is a stroke on each bar
        barShowStroke: true,

        //Number - Pixel width of the bar stroke
        barStrokeWidth: 2,

        //Number - Spacing between each of the X value sets
        barValueSpacing: 5,

        //Number - Spacing between data sets within X values
        barDatasetSpacing: 1,

        //String - A legend template
        legendTemplate: '<div class="tc-chart-js-legend"><% for (var i=0; i<datasets.length; i+=3){%><span style="background-color:<%=datasets[i].fillColor%>"></span><%if(i<datasets.length){%><%=datasets[i].label%><%}%><%if(i+1<datasets.length){%><span style="background-color:<%=datasets[i+1].fillColor%>"></span> &nbsp; <%=datasets[i+1].label%><%}%><%if(i+2<datasets.length){%><span style="background-color:<%=datasets[i+2].fillColor%>"></span><%=datasets[i+2].label%><%}%><%}%></div>'
    };

    // Resource Demand Chart
    $scope.UpdateSoldProposedChart = function () {
        $http({
            method: 'GET',
            url: 'api/Dashboard/GetSoldProposedChartData?authToken=' + $scope.UserIdentity + "-" + $scope.UserPassword
        }).
      success(function (data, status, headers, config) {
          if (data != null) {
              //debugger;
              $scope.SoldProposedChartLabels = JSON.parse(data[0]);
              $scope.SoldProjectsChartData = JSON.parse(data[1]);
              $scope.ProposedProjectsChartData = JSON.parse(data[2]);

              $scope.SoldProposedData.labels = $scope.SoldProposedChartLabels;
              $scope.SoldProposedData.datasets[0].data = $scope.SoldProjectsChartData;
              $scope.SoldProposedData.datasets[1].data = $scope.ProposedProjectsChartData;
          }
      }).
      error(function (data, status, headers, config) {
          // called asynchronously if an error occurs
          // or server returns response with an error status.
          $scope.AllResources = -1;
      });
    };

    $scope.SoldProposedData = {
        labels: $scope.SoldProposedChartLabels,
        datasets: [
          {
              label: 'Sold resource needs',
              fillColor: 'rgba(320,220,220,0.2)',
              strokeColor: 'rgba(220,220,220,1)',
              pointColor: 'rgba(220,220,220,1)',
              pointStrokeColor: '#fff',
              pointHighlightFill: '#fff',
              pointHighlightStroke: 'rgba(220,220,220,1)',
              data: $scope.SoldProjectsChartData
          },
          {
              label: 'Proposed resource needs',
              fillColor: 'rgba(151,187,205,0.2)',
              strokeColor: 'rgba(151,187,205,1)',
              pointColor: 'rgba(151,187,205,1)',
              pointStrokeColor: '#fff',
              pointHighlightFill: '#fff',
              pointHighlightStroke: 'rgba(151,187,205,1)',
              data: $scope.ProposedProjectsChartData
          }
        ]
    };

    $scope.SoldProposedOptions = {

        // Sets the chart to be responsive
        responsive: true,

        ///Boolean - Whether grid lines are shown across the chart
        scaleShowGridLines: true,

        //String - Colour of the grid lines
        scaleGridLineColor: "rgba(0,0,0,.05)",

        //Number - Width of the grid lines
        scaleGridLineWidth: 1,

        //Boolean - Whether the line is curved between points
        bezierCurve: true,

        //Number - Tension of the bezier curve between points
        bezierCurveTension: 0.4,

        //Boolean - Whether to show a dot for each point
        pointDot: true,

        //Number - Radius of each point dot in pixels
        pointDotRadius: 4,

        //Number - Pixel width of point dot stroke
        pointDotStrokeWidth: 1,

        //Number - amount extra to add to the radius to cater for hit detection outside the drawn point
        pointHitDetectionRadius: 20,

        //Boolean - Whether to show a stroke for datasets
        datasetStroke: true,

        //Number - Pixel width of dataset stroke
        datasetStrokeWidth: 2,

        //Boolean - Whether to fill the dataset with a colour
        datasetFill: true,

        // Function - on animation progress
        onAnimationProgress: function () { },

        // Function - on animation complete
        onAnimationComplete: function () { },

        //String - A legend template
        legendTemplate: '<ul class="tc-chart-js-legend"><% for (var i=0; i<datasets.length; i++){%><li><span style="background-color:<%=datasets[i].strokeColor%>"></span><%if(datasets[i].label){%><%=datasets[i].label%><%}%></li><%}%></ul>'
    };

    $scope.getKeyUpdates();
    $scope.getProjects();
    $scope.getDashboardCount();
    $scope.UpdateTechChart();
    $scope.UpdateProjectDistributionChart();
    $scope.UpdateSoldProposedChart();
}]);
AUDashboardApp.controller('DashboardController', ['$scope', '$http', function ($scope, $http) {

    $scope.UserIdentity = null;
    $scope.UserPassword = null;
    $scope.UserValidated = false;
    $scope.LoginMessage = null;

    debugger;
    if (getCookie('UserIdentity') != "") {
        $scope.UserIdentity = getCookie('UserIdentity');
    }
    if (getCookie('UserPassword') != "") {
        $scope.UserPassword = getCookie('UserPassword');
    }
    if (getCookie('UserValidated') != "") {
        $scope.UserValidated = getCookie('UserValidated');
    }   
    $scope.ValidateUserLogin = function () {
        $http({
            method: 'GET',
            url: 'api/Dashboard/GetAuthentication?authToken=' + $scope.UserIdentity + "-" + $scope.UserPassword
        }).
        success(function (data, status, headers, config) {
            var isValidUser = JSON.parse(data);
            $scope.UserValidated = JSON.parse(data)
            if (isValidUser == "false")
                $scope.LoginMessage = "* user name/password not correct";
            else {
                $scope.LoginMessage = null;
                document.cookie = "UserIdentity=" + $scope.UserIdentity + "; path=/";
                document.cookie = "UserPassword=" + $scope.UserPassword + "; path=/";
                document.cookie = "UserValidated=" + $scope.UserValidated + "; path=/";
                $http({
                    method: 'GET',
                    url: 'api/Dashboard/GetDashboardCounts?authToken=' + $scope.UserIdentity + "-" + $scope.UserPassword
                }).
                success(function (data, status, headers, config) {
                    $scope.PendingInvoices = JSON.parse(JSON.parse(data))[0];
                    $scope.ActiveProjects = JSON.parse(JSON.parse(data))[1];
                    $scope.OpenActionItems = JSON.parse(JSON.parse(data))[2];
                    $scope.ActiveResources = JSON.parse(JSON.parse(data))[3];

                }).
                error(function (data, status, headers, config) {
                    // called asynchronously if an error occurs
                    // or server returns response with an error status.
                    $scope.ActiveProjects = -1;
                    $scope.PendingInvoices = -1;
                    $scope.ActiveResources = -1;
                    $scope.OpenActionItems = -1;
                });


                //$scope.PendingInvoices = 9;
                //$scope.ActiveResources = 32;
                //$scope.OpenActionItems = 5;

                var ProjectEntity;

                var FakeNotifications = [{
                    message: 'Frank Farrall USI Visit - Mumbai',
                    eventdate: '8-Dec',
                    type: 'fa fa-calendar fa-fw'
                }, {
                    message: 'Frank Farrall USI Visit - Hyderabad',
                    eventdate: '10-Dec',
                    type: 'fa fa-calendar fa-fw'
                }, {
                    message: 'Submit Project Report',
                    eventdate: '20-Dec',
                    type: 'fa fa-twitter fa-fw'
                }, {
                    message: 'EDC-AU meet',
                    eventdate: '5-Jan',
                    type: 'fa fa-calendar fa-fw'
                }, {
                    message: 'EDC Upcoming Holiday',
                    eventdate: '26-Dec',
                    type: 'fa fa-calendar fa-fw'
                }];

                $scope.notifications = FakeNotifications;



                //Start 
                // Chart.js Data
                $scope.skillChartData = {
                    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
                    datasets: [
                      {
                          label: 'FY15 Business',
                          fillColor: '#FFFFFF',
                          strokeColor: 'rgba(69,201,102,0.9)',
                          highlightFill: 'rgba(69,201,102,0.9)',
                          highlightStroke: 'rgba(220,220,220,1)',
                          data: [65, 59, 80, 81, 56, 55, 40]
                      },
                      {
                          label: 'FY14 Business',
                          fillColor: '#FFFFFF',
                          strokeColor: 'rgba(1,187,205,0.8)',
                          highlightFill: 'rgba(38, 208, 255, 0.75)',
                          highlightStroke: 'rgba(151,187,205,1)',
                          data: [28, 48, 40, 19, 86, 27, 30]
                      }
                    ]
                };

                // Chart.js Options
                $scope.skillChartOptions = {

                    // Sets the chart to be responsive
                    responsive: true,

                    //Boolean - Whether the scale should start at zero, or an order of magnitude down from the lowest value
                    scaleBeginAtZero: true,

                    //Boolean - Whether grid lines are shown across the chart
                    scaleShowGridLines: true,

                    //String - Colour of the grid lines
                    scaleGridLineColor: "rgba(0,0,0,.05)",

                    //Number - Width of the grid lines
                    scaleGridLineWidth: 1,

                    //Boolean - If there is a stroke on each bar
                    barShowStroke: true,

                    //Number - Pixel width of the bar stroke
                    barStrokeWidth: 2,

                    //Number - Spacing between each of the X value sets
                    barValueSpacing: 5,

                    //Number - Spacing between data sets within X values
                    barDatasetSpacing: 1,

                    //String - A legend template
                    legendTemplate: '<ul class="tc-chart-js-legend"><% for (var i=0; i<datasets.length; i++){%><li><span style="background-color:<%=datasets[i].fillColor%>"></span><%if(datasets[i].label){%><%=datasets[i].label%><%}%></li><%}%></ul>'
                };

                $scope.ProjectChartData = [];

                $scope.UpdateProjChart = function () {
                    $http({
                        method: 'GET',
                        url: 'api/Dashboard/GetProjChartData?authToken=' + $scope.UserIdentity + "-" + $scope.UserPassword
                    }).
                  success(function (data, status, headers, config) {
                      if (data != null) {
                          debugger;
                          $scope.ProjectChartData = [];
                          var ProjectChartDataList = JSON.parse(data[0]);
                          for (i = 0; i < ProjectChartDataList.length; i++) {
                              var dataItem = new Object();
                              dataItem.value = ProjectChartDataList[i].Count;
                              dataItem.label = ProjectChartDataList[i].ProjectStatus;
                              dataItem.color = colors[i];
                              dataItem.highlight = highlights[i];
                              $scope.ProjectChartData.push(dataItem);
                          }
                          //$scope.revenueChartPrevData = JSON.parse(data[1]);
                          //$scope.revenueChartCurrData = JSON.parse(data[0]);
                          //$scope.skillChartData.datasets[0].data = $scope.revenueChartCurrData;
                          //$scope.skillChartData.datasets[1].data = $scope.revenueChartPrevData;
                          //$scope.skillChartData.datasets[0].label = JSON.parse(data[2]);
                          //$scope.skillChartData.datasets[1].label = JSON.parse(data[3]);
                      }
                  }).
                  error(function (data, status, headers, config) {
                      // called asynchronously if an error occurs
                      // or server returns response with an error status.
                      $scope.AllResources = -1;
                  });
                };

                //$scope.UpdateProjChart();

                //// Chart.js Data
                //$scope.ProjectChartData = [
                //  {
                //      value: 0,
                //      color: '#F7464A',
                //      highlight: '#FF5A5E',
                //      label: 'Sitecore'
                //  }];
                //  {
                //      value: 0,
                //      color: '#46BFBD',
                //      highlight: '#5AD3D1',
                //      label: 'Hybris'
                //  },
                //  {
                //      value: 0,
                //      color: '#FDB45C',
                //      highlight: '#FFC870',
                //      label: 'Adobe CQ'
                //  },
                //  {
                //      value: 0,
                //      color: '#46BFBA',
                //      highlight: '#5AD3D1',
                //      label: 'Biztalk'
                //  },
                //  {
                //      value: 0,
                //      color: '#FDB4AC',
                //      highlight: '#FFC870',
                //      label: 'Mobile'
                //  }
                //];

                // Chart.js Options
                $scope.ProjectChartOptions = {

                    // Sets the chart to be responsive
                    responsive: true,

                    //Boolean - Whether we should show a stroke on each segment
                    segmentShowStroke: true,

                    //String - The colour of each segment stroke
                    segmentStrokeColor: '#fff',

                    //Number - The width of each segment stroke
                    segmentStrokeWidth: 2,

                    //Number - The percentage of the chart that we cut out of the middle
                    percentageInnerCutout: 50, // This is 0 for Pie charts

                    //Number - Amount of animation steps
                    animationSteps: 100,

                    //String - Animation easing effect
                    animationEasing: 'easeOutQuint',

                    //Boolean - Whether we animate the rotation of the Doughnut
                    animateRotate: false,

                    //Boolean - Whether we animate scaling the Doughnut from the centre
                    animateScale: false,

                    //String - A legend template     
                    legendTemplate: '<ul class="tc-chart-js-legend"><% for (var i=0; i<datasets.length; i++){%><li><span style="background-color:<%=datasets[i].fillColor%>"></span><%if(datasets[i].label){%><%=datasets[i].label%><%}%></li><%}%></ul>'

                };
                //End
            }
        }).
        error(function (data, status, headers, config) {
            $scope.UserValidated = false;
            $scope.LoginMessage = "* user name/password not correct";
        });
    }
    $scope.UserLogout = function () {
        $scope.UserIdentity = null;
        $scope.UserPassword = null;
        $scope.UserValidated = false;
        $scope.LoginMessage = null;
    }

    var downloadServiceUrl = "SendMail.asmx/SendReport";
    $scope.Download = function () {
        window.open('#/CurrentStatus', '_blank');
    }
}]);

AUDashboardApp.controller('ActionItemsController', ['$scope', '$filter', '$http', function ($scope, $filter, $http) {

    var todos = $scope.todos = [];

    $scope.newTodo = '';
    $scope.newAssignedTo = '';
    $scope.editedTodo = null;
    var STORAGE_ID = 'ToDoItems';

    $scope.$watch('todos', function (newValue, oldValue) {
        //$scope.remainingCount = $filter('filter')(todos, { completed: false }).length;
        //$scope.completedCount = todos.length - $scope.remainingCount;
        //$scope.allChecked = !$scope.remainingCount;
        if (newValue !== oldValue) { // This prevents unneeded calls to the local storage
            $scope.setTodos(todos);
        }
    }, true);

    //// Monitor the current route for changes and adjust the filter accordingly.
    //$scope.$on('$routeChangeSuccess', function () {
    //    var status = $scope.status = $routeParams.status || '';

    //    $scope.statusFilter = (status === 'active') ?
    //			{ completed: false } : (status === 'completed') ?
    //			{ completed: true } : null;
    //});

    $scope.getTodos = function () {

        $http({
            method: 'GET',
            url: 'api/Dashboard/GetReferenceData?storageId=' + STORAGE_ID + '&authToken=' + $scope.UserIdentity + "-" + $scope.UserPassword
        }).
        success(function (data, status, headers, config) {

            if (data != 'null') {
                todos = $scope.todos = JSON.parse(JSON.parse(data));
                $scope.$parent.OpenActionItems = todos.length;
            }
        }).
        error(function (data, status, headers, config) {
            // called asynchronously if an error occurs
            // or server returns response with an error status.

        });

    };

    $scope.getTodos();

    $scope.setTodos = function (todos) {
        //localStorage.setItem(STORAGE_ID, JSON.stringify(todos));
        ////debugger;
        var referenceData = new Object();
        referenceData.storageId = STORAGE_ID;
        referenceData.storageData = JSON.stringify(todos);
        referenceData.authToken = $scope.UserIdentity + "-" + $scope.UserPassword;
        $http({
            url: 'api/Dashboard/SetReferenceData',
            method: "POST",
            data: JSON.stringify(JSON.stringify(referenceData))
        })
            .then(function (response) { },
                function (response) { // optional
                }
            );
    };

    $scope.addTodo = function () {
        ////debugger;
        var newTodo = $scope.newTodo.trim();
        var newAssignedTo = $scope.newAssignedTo.trim();
        if (!newTodo.length && !newTodo.length) {
            return;
        }
        todos.push({
            title: newTodo,
            AssignedTo: newAssignedTo,
            completed: false
        });

        $scope.newTodo = '';
        $scope.newAssignedTo = '';
    };

    $scope.editTodo = function (todo) {
        $scope.editedTodo = todo;
        // Clone the original todo to restore it on demand.
        $scope.originalTodo = angular.extend({}, todo);
    };

    $scope.doneEditing = function (todo) {
        $scope.editedTodo = null;
        todo.title = todo.title.trim();
        todo.AssignedTo = todo.AssignedTo.trim();

        if (!todo.title) {
            $scope.removeTodo(todo);
        }
    };

    $scope.revertEditing = function (todo) {
        todos[todos.indexOf(todo)] = $scope.originalTodo;
        $scope.doneEditing($scope.originalTodo);
    };

    $scope.removeTodo = function (todo) {
        todos.splice(todos.indexOf(todo), 1);
    };

    $scope.clearCompletedTodos = function () {
        $scope.todos = todos = todos.filter(function (val) {
            return !val.completed;
        });
    };

    $scope.markAll = function (completed) {
        todos.forEach(function (todo) {
            todo.completed = !completed;
        });
    };
}]);

AUDashboardApp.controller('ActiveProjectsController', ['$scope', '$filter', '$http', function ($scope, $filter, $http) {
    var STORAGE_ID = 'Projects';
    $scope.EditMode = "false";
    $scope.ActiveFilterSet;    
    $scope.currentProjectPage = 1;
    $scope.pageSize = 10;
    $scope.ProjectPerPage = 10;

    var ProjectDetails = $scope.ActiveProjectDetails = [];

    $scope.getProjects = function () {
        ////debugger;
        $http({
            method: 'GET',
            url: 'api/Dashboard/GetReferenceData?storageId=' + STORAGE_ID + '&authToken=' + $scope.UserIdentity + "-" + $scope.UserPassword,
        }).
        success(function (data, status, headers, config) {

            if (data != 'null') {
                ProjectDetails = $scope.ActiveProjectDetails = JSON.parse(JSON.parse(data));
                $scope.OriginalProjectDetails = JSON.parse(JSON.parse(data));
                $scope.$parent.ActiveProjects = $filter('filter')(ProjectDetails, { Stage: "Sold" }).length;
                $scope.UpdateChart();
            }
        }).
        error(function (data, status, headers, config) {
            // called asynchronously if an error occurs
            // or server returns response with an error status.

        });

    };

    $scope.EditProject = function (project, index) {
        project.index = index;
        $scope.ProjectEntity = jQuery.extend(true, {}, project); // deep copy
        $scope.OriginalProject = jQuery.extend(true, {}, project); // deep copy
    }

    //$scope.setProjects = function (ProjectDetails) {
    //    var referenceData = new Object();
    //    referenceData.storageId = STORAGE_ID;
    //    referenceData.storageData = JSON.stringify(ProjectDetails);
    //    $http({
    //        url: 'api/Dashboard/SetReferenceData',
    //        method: "POST",
    //        data: JSON.stringify(JSON.stringify(referenceData))
    //    })
    //        .then(function (response) {
    //            $scope.getProjects();
    //        },
    //            function (response) { // optional
    //            }
    //        );
    //};

    //$scope.$watch('ActiveProjectDetails', function (newValue, oldValue) {
    //    if (newValue !== oldValue) { // This prevents unneeded calls to the local storage
    //        $scope.setProjects($scope.ActiveProjectDetails);
    //    }
    //}, true);

    $scope.AddProject = function (ProjectEntity, action) {
        var projectRequest = new Object();
        projectRequest.Projects = ProjectDetails;
        projectRequest.Project = ProjectEntity;
        projectRequest.action = action;
        projectRequest.authToken=$scope.UserIdentity + "-" + $scope.UserPassword;
        
        $http({
            method: 'POST',
            url: 'api/Dashboard/UpsertProject',
            data: projectRequest
        }).
       success(function (data, status, headers, config) {
           //success logic
           if (data != 'null') {
               ProjectDetails = $scope.ActiveProjectDetails = JSON.parse(JSON.parse(data));
               $scope.OriginalProjectDetails = JSON.parse(JSON.parse(data));
               $scope.$parent.ActiveProjects = $filter('filter')(ProjectDetails, { Stage: "Sold" }).length;
               $scope.UpdateChart();

               $scope.ActiveProjectDetails = ProjectDetails;
               $scope.ProjectEntity = '';
           }
       }).
       error(function (data, status, headers, config) {
          //error handling logic
       });

    };

    $scope.OpenAddProject = function () {
        $scope.ProjectEntity = '';
    };


    //Start Key Updates
    var keyUpdates = $scope.keyUpdates = [];

    $scope.getKeyUpdates = function () {

        $http({
            method: 'GET',
            url: 'api/Dashboard/GetReferenceData?storageId=KeyUpdates&authToken=' + $scope.UserIdentity + "-" + $scope.UserPassword
        }).
        success(function (data, status, headers, config) {

            if (data != 'null') {
                keyUpdates = $scope.keyUpdates = JSON.parse(JSON.parse(data));
            }
        }).
        error(function (data, status, headers, config) {
            // called asynchronously if an error occurs
            // or server returns response with an error status.

        });

    };

    $scope.EditKeyUpdates = function (keyUpdate, index) {
        keyUpdate.index = index;
        $scope.keyUpdate = jQuery.extend(true, {}, keyUpdate); // deep copy
        $scope.OriginalKeyUpdate = jQuery.extend(true, {}, keyUpdate); // deep copy

    }

    $scope.getKeyUpdates();

    $scope.setKeyUpdates = function (keyUpdates) {
        var referenceData = new Object();
        referenceData.storageId = 'KeyUpdates';
        referenceData.storageData = JSON.stringify(keyUpdates);
        referenceData.authToken = $scope.UserIdentity + "-" + $scope.UserPassword;
        $http({
            url: 'api/Dashboard/SetReferenceData',
            method: "POST",
            data: JSON.stringify(JSON.stringify(referenceData))
        })
            .then(function (response) {
                $scope.getKeyUpdates();
            },
                function (response) { // optional
                }
            );
    };

    $scope.$watch('keyUpdates', function (newValue, oldValue) {
        if (newValue !== oldValue) { // This prevents unneeded calls to the local storage
            $scope.setKeyUpdates(keyUpdates);
        }
    }, true);

    $scope.AddKeyUpdate = function (keyUpdate) {
        if (keyUpdate.index >= 0) {
            keyUpdates[keyUpdate.index] = keyUpdate;
        } else {
            keyUpdates.push(keyUpdate);
        }

        $scope.keyUpdates = keyUpdates;
        $scope.keyUpdate = '';
    };

    $scope.DeleteKeyUpdate = function (keyUpdate) {
        keyUpdates.splice(keyUpdate.index, 1);
    };

    $scope.OpenAddUpdates = function () {
        $scope.keyUpdate = '';
    };
    //End Key updates




    $scope.UpdateChart = function () {
        $http({
            method: 'GET',
            url: 'api/Dashboard/GetProjectChartData?authToken=' + $scope.UserIdentity + "-" + $scope.UserPassword
        }).
      success(function (data, status, headers, config) {
          if (data != null) {
              //debugger;
              $scope.ProjectChartData = [];
              $scope.chartLabels = JSON.parse(data[0]);
              $scope.chartData = JSON.parse(data[1]);
              $scope.ActiveProjectChartData.labels = $scope.chartLabels;
              $scope.ActiveProjectChartData.datasets[0].data = $scope.chartData;
          }
      }).
      error(function (data, status, headers, config) {
          // called asynchronously if an error occurs
          // or server returns response with an error status.
          $scope.AllResources = -1;
      });
    };


    // Chart.js Data
    $scope.ActiveProjectChartData = {
        labels: $scope.chartLabels,
        datasets: [
          {
              label: 'Project Status',
              fillColor: 'rgba(220,220,220,0.5)',
              strokeColor: 'rgba(220,220,220,0.8)',
              highlightFill: 'rgba(220,220,220,0.75)',
              highlightStroke: 'rgba(220,220,220,1)',
              data: $scope.chartData
          }
        ]
    };

    // Chart.js Options
    $scope.ActiveProjectChartOptions = {

        // Sets the chart to be responsive
        responsive: true,

        //Boolean - Whether the scale should start at zero, or an order of magnitude down from the lowest value
        scaleBeginAtZero: true,

        //Boolean - Whether grid lines are shown across the chart
        scaleShowGridLines: true,

        //String - Colour of the grid lines
        scaleGridLineColor: "rgba(0,0,0,.05)",

        //Number - Width of the grid lines
        scaleGridLineWidth: 1,

        //Boolean - If there is a stroke on each bar
        barShowStroke: true,

        //Number - Pixel width of the bar stroke
        barStrokeWidth: 2,

        //Number - Spacing between each of the X value sets
        barValueSpacing: 15,

        //Number - Spacing between data sets within X values
        barDatasetSpacing: 50,

        //String - A legend template
        legendTemplate: '<ul class="tc-chart-js-legend"><% for (var i=0; i<datasets.length; i++){%><li><span style="background-color:<%=datasets[i].fillColor%>"></span><%if(datasets[i].label){%><%=datasets[i].label%><%}%></li><%}%></ul>'
    };

    $scope.getProjects();

}]);

AUDashboardApp.controller('ActiveResourcesController', ['$scope', '$http', 'FileUploader', function ($scope, $http, FileUploader) {
    var STORAGE_ID = 'Resources';
    $scope.EditMode = "false";
    $scope.currentPage = 1;
    $scope.currentGSSPage = 1;
    $scope.pageSize = 10;

    var resources = $scope.AllResources = [];

    $scope.getResources = function () {
        $http({
            method: 'GET',
            url: 'api/Dashboard/GetReferenceData?storageId=' + STORAGE_ID + '&authToken=' + $scope.UserIdentity + "-" + $scope.UserPassword
        }).
        success(function (data, status, headers, config) {
            if (data != null) {
                resources = $scope.AllResources = JSON.parse(JSON.parse(data));
                $scope.UpdateChart();
            }
        }).
        error(function (data, status, headers, config) {
            // called asynchronously if an error occurs
            // or server returns response with an error status.
            $scope.AllResources = -1;
        });

        $http({
            method: 'GET',
            url: 'api/Dashboard/GetReferenceData?storageId=GSSResources&authToken=' + $scope.UserIdentity + "-" + $scope.UserPassword

        }).
       success(function (data, status, headers, config) {
           if (data != null) {
               $scope.AllGSSResources = JSON.parse(JSON.parse(data));
               $scope.$parent.ActiveResources = $scope.AllGSSResources.length;
               $scope.UpdateChart();
           }
       }).
       error(function (data, status, headers, config) {
           // called asynchronously if an error occurs
           // or server returns response with an error status.
           $scope.AllResources = -1;
       });

    };

    //$scope.setResources = function (resourcesToBeSaved) {
    //    var referenceData = new Object();
    //    referenceData.storageId = STORAGE_ID;
    //    referenceData.storageData = JSON.stringify(resourcesToBeSaved);
    //    $http({
    //        url: 'api/Dashboard/SetReferenceData',
    //        method: "POST",
    //        data: JSON.stringify(JSON.stringify(referenceData))
    //    })
    //        .then(function (response) {
    //            $scope.getResources();
    //        },
    //            function (response) { // optional
    //            }
    //        );
    //};

    //$scope.$watch('AllResources', function (newValue, oldValue) {
    //    if (newValue !== oldValue) { // This prevents unneeded calls to the local storage
    //        $scope.setResources(resources);
    //    }
    //}, true);

    $scope.EditResource = function (resource, index) {
        //debugger;
        resource.index = index;
        $scope.EditMode = "true";
        //Shallow Copy - $scope.ResourceEntity = resource;
        $scope.ResourceEntity = jQuery.extend(true, {}, resource); // deep copy
        $scope.OriginalResourceEntity = jQuery.extend(true, {}, resource); // deep copy
    };

    $scope.addResource = function (resource, action) {
        var resourceRequest = new Object();
        resourceRequest.Resources = resources;
        resourceRequest.Resource = resource;
        resourceRequest.Action = action;
        resourceRequest.authToken=$scope.UserIdentity + "-" + $scope.UserPassword;

        $http({
            method: 'POST',
            url: 'api/Dashboard/UpsertResource',
            data: resourceRequest
        }).
       success(function (data, status, headers, config) {
           //success logic
           if (data != null) {
               resources = $scope.AllResources = JSON.parse(JSON.parse(data));

               $scope.UpdateChart();

               $scope.AllResources = resources;
               $scope.ResourceEntity = '';

           }
       }).
       error(function (data, status, headers, config) {
           //error handling logic
       });

    };

    var chartLabels, chartData;

    $scope.UpdateChart = function () {
        $http({
            method: 'GET',
            url: 'api/Dashboard/GetResourceChartData?authToken=' + $scope.UserIdentity + "-" + $scope.UserPassword
        }).
      success(function (data, status, headers, config) {
          if (data != null) {
              chartLabels = JSON.parse(data[0]);
              chartData = JSON.parse(data[1]);
          }
      }).
      error(function (data, status, headers, config) {
          // called asynchronously if an error occurs
          // or server returns response with an error status.
          $scope.AllGSSResources = -1;
      });


        // Chart.js Data
        $scope.ResourceChartData = {
            labels: chartLabels, // ['AMP', 'Telstra', 'QUU', 'AusSuper', 'ANZ', 'Caltex'],
            datasets: [
              {
                  label: 'My First dataset',
                  fillColor: '#FFFFFF',
                  strokeColor: '#000000',
                  highlightFill: '#000000',
                  highlightStroke: '#FFFFFF',
                  data: chartData //[65, 59, 80, 81, 56, 55]
              }

            ]
        };

        // Chart.js Options
        $scope.ResourceChartOptions = {

            // Sets the chart to be responsive
            responsive: true,

            //Boolean - Whether the scale should start at zero, or an order of magnitude down from the lowest value
            scaleBeginAtZero: true,

            //Boolean - Whether grid lines are shown across the chart
            scaleShowGridLines: true,

            //String - Colour of the grid lines
            scaleGridLineColor: "rgba(0,0,0,.05)",

            //Number - Width of the grid lines
            scaleGridLineWidth: 1,

            //Boolean - If there is a stroke on each bar
            barShowStroke: true,

            //Number - Pixel width of the bar stroke
            barStrokeWidth: 2,

            //Number - Spacing between each of the X value sets
            barValueSpacing: 15,

            //Number - Spacing between data sets within X values
            barDatasetSpacing: 1,

            //String - A legend template
            legendTemplate: '<ul class="tc-chart-js-legend"><% for (var i=0; i<datasets.length; i++){%><li><span style="background-color:<%=datasets[i].fillColor%>"></span><%if(datasets[i].label){%><%=datasets[i].label%><%}%></li><%}%></ul>'
        };

    };

    //File upload functionality
    var uploader = $scope.uploader = new FileUploader({
        url: 'api/Dashboard/UploadResources',
        autoUpload: true
        //removeAfterUpload: true
    });

    uploader.onCompleteItem = function (fileItem, response, status, headers) {
        $scope.getResources();
    };
    $scope.ShowCurrent = true;

    $scope.DisplayContent = function (activeTab) {
        if (activeTab == 'Unallocated') {
            $scope.ShowCurrent = false;
        }
        else {
            $scope.ShowCurrent = true;
        }
        $scope.searchResource = '';
    };

    $scope.OpenAddResource = function () {
        $scope.ResourceEntity = '';
        $scope.IsHidden = true;
    };

    $scope.getResources();

}]);

AUDashboardApp.controller('NewActionItemsController', ['$scope', '$filter', '$http', function ($scope, $filter, $http) {
    var STORAGE_ID = 'NewToDoItems'; // To be passed
    //$scope.EditMode = "false";
    $scope.currentPage = 1;
    $scope.currentToDoPage = 1;
    $scope.pageSize = 5;
    $scope.ToDoPerPage = 5;

    var NewToDos = $scope.NewToDos = [];

    $scope.getNewToDos = function () {
        $http({
            method: 'GET',
            url: 'api/Dashboard/GetReferenceData?storageId=' + STORAGE_ID + '&authToken=' + $scope.UserIdentity + "-" + $scope.UserPassword
        }).
        success(function (data, status, headers, config) {

            if (data != 'null') {
                NewToDos = $scope.NewToDos = JSON.parse(JSON.parse(data));
                $scope.$parent.OpenActionItems = $filter('filter')(NewToDos, { Status: "Open" }).length;
                $scope.UpdateChart($filter('filter')(NewToDos, { Status: "Open" }).length, $filter('filter')(NewToDos, { Status: "Closed" }).length, $filter('filter')(NewToDos, { Status: "Pending" }).length);
            }
        }).
        error(function (data, status, headers, config) {
            // called asynchronously if an error occurs
            // or server returns response with an error status.

        });

    };

    $scope.EditToDoItem = function (ToDoItem, index) {
        ToDoItem.index = index;
        $scope.ToDoItem = jQuery.extend(true, {}, ToDoItem); // deep copy
        $scope.OriginalToDoItem = jQuery.extend(true, {}, ToDoItem); // deep copy
    }

    $scope.setToDoItems = function (NewToDos) {
        var referenceData = new Object();
        referenceData.storageId = STORAGE_ID;
        referenceData.storageData = JSON.stringify(NewToDos);
        referenceData.authToken= $scope.UserIdentity + "-" + $scope.UserPassword;
        $http({
            url: 'api/Dashboard/SetReferenceData',
            method: "POST",
            data: JSON.stringify(JSON.stringify(referenceData))
        })
            .then(function (response) {
                $scope.getNewToDos();
            },
                function (response) { // optional
                }
            );
    };

    $scope.$watch('NewToDos', function (newValue, oldValue) {
        if (newValue !== oldValue) { // This prevents unneeded calls to the local storage
            $scope.setToDoItems(NewToDos);
        }
    }, true);

    $scope.AddToDoItem = function (ToDoItem) {

        if (ToDoItem.index >= 0) {
            NewToDos[ToDoItem.index] = ToDoItem;
        } else {
            ToDoItem.Status = 'Open';
            NewToDos.push(ToDoItem);
        }

        $scope.NewToDos = NewToDos;
        $scope.NewToDoItem = '';
    };

    $scope.DeleteToDoItem = function (ToDoItem) {
        for (var i = 0; i < NewToDos.length; i++) {
            if (NewToDos[i].Desc === ToDoItem.Desc && NewToDos[i].AssignedTo === ToDoItem.AssignedTo && NewToDos[i].Status === ToDoItem.Status && NewToDos[i].Comments === ToDoItem.Comments) {
                NewToDos.splice(i, 1);
                break;
            }
        }
    };

    $scope.UpdateChart = function (open, closed, pending) {
        // Chart.js Data
        $scope.ActionItemChartData = [
          {
              value: open,
              color: '#F7464A',
              highlight: '#FF5A5E',
              label: 'Open'
          },
          {
              value: closed,
              color: '#46BFBD',
              highlight: '#5AD3D1',
              label: 'Closed'
          },
          {
              value: pending,
              color: '#FDB45C',
              highlight: '#FFC870',
              label: 'Pending'
          }
        ];

        // Chart.js Options
        $scope.ActionItemChartOptions = {

            // Sets the chart to be responsive
            responsive: true,

            //Boolean - Whether we should show a stroke on each segment
            segmentShowStroke: true,

            //String - The colour of each segment stroke
            segmentStrokeColor: '#fff',

            //Number - The width of each segment stroke
            segmentStrokeWidth: 2,

            //Number - The percentage of the chart that we cut out of the middle
            percentageInnerCutout: 0, // This is 0 for Pie charts

            //Number - Amount of animation steps
            animationSteps: 100,

            //String - Animation easing effect
            animationEasing: 'easeOutQuint',

            //Boolean - Whether we animate the rotation of the Doughnut
            animateRotate: true,

            //Boolean - Whether we animate scaling the Doughnut from the centre
            animateScale: false,

            //String - A legend template
            legendTemplate: '<ul class="tc-chart-js-legend"><% for (var i=0; i<segments.length; i++){%><li><span style="background-color:<%=segments[i].fillColor%>"></span><%if(segments[i].label){%><%=segments[i].label%><%}%></li><%}%></ul>'

        };
    };

    $scope.getNewToDos();

}]);

AUDashboardApp.controller('OperationsController', ['$scope', '$http', function ($scope, $http) {

    //Start Key Updates
    var keyUpdates = $scope.keyUpdates = [];

    $scope.getKeyUpdates = function () {
        ////debugger;
        $http({
            method: 'GET',
            url: 'api/Dashboard/GetReferenceData?storageId=KeyUpdates&authToken=' + $scope.UserIdentity + "-" + $scope.UserPassword
        }).
        success(function (data, status, headers, config) {

            if (data != 'null') {
                keyUpdates = $scope.keyUpdates = JSON.parse(JSON.parse(data));
            }
        }).
        error(function (data, status, headers, config) {
            // called asynchronously if an error occurs
            // or server returns response with an error status.

        });

    };

    $scope.EditKeyUpdates = function (keyUpdate, index) {
        keyUpdate.index = index;
        $scope.keyUpdate = jQuery.extend(true, {}, keyUpdate); // deep copy
        $scope.OriginalKeyUpdate = jQuery.extend(true, {}, keyUpdate); // deep copy

    }

    $scope.getKeyUpdates();

    $scope.setKeyUpdates = function (keyUpdates) {
        var referenceData = new Object();
        referenceData.storageId = 'KeyUpdates';
        referenceData.storageData = JSON.stringify(keyUpdates);
        referenceData.authToken = $scope.UserIdentity + "-" + $scope.UserPassword;
        $http({
            url: 'api/Dashboard/SetReferenceData',
            method: "POST",
            data: JSON.stringify(JSON.stringify(referenceData))
        })
            .then(function (response) {
                $scope.getKeyUpdates();
            },
                function (response) { // optional
                }
            );
    };

    $scope.$watch('keyUpdates', function (newValue, oldValue) {
        if (newValue !== oldValue) { // This prevents unneeded calls to the local storage
            $scope.setKeyUpdates(keyUpdates);
        }
    }, true);

    $scope.AddKeyUpdate = function (keyUpdate) {
        if (keyUpdate.index >= 0) {
            keyUpdates[keyUpdate.index] = keyUpdate;
        } else {
            keyUpdates.push(keyUpdate);
        }

        $scope.keyUpdates = keyUpdates;
        $scope.keyUpdate = '';
    };
    //End Key updates

    //Start 

    $scope.UpdateProjectDistributionChart = function () {
        $http({
            method: 'GET',
            url: 'api/Dashboard/GetProjectDistributionChartData?authToken=' + $scope.UserIdentity + "-" + $scope.UserPassword
        }).
      success(function (data, status, headers, config) {
          if (data != null) {
              //debugger;

              $scope.ProjectDistLabels = JSON.parse(data[0]);
              $scope.ProjectDistData = JSON.parse(data[1]);

              $scope.ProjectDistributionData.labels = JSON.parse(data[0]);
              $scope.ProjectDistributionData.datasets[0].data = JSON.parse(data[1]);

          }
      }).
      error(function (data, status, headers, config) {
          // called asynchronously if an error occurs
          // or server returns response with an error status.

      });
    };

    $scope.UpdateProjectDistributionChart();


    $scope.ProjectDistributionData = {
        labels: $scope.ProjectDistLabels,
        datasets: [
          {
              label: 'No. of projects by month',
              fillColor: '#0cc09f',
              strokeColor: 'rgba(220,220,220,0.8)',
              highlightFill: '#0aac8e',
              highlightStroke: 'rgba(220,220,220,1)',
              data: $scope.ProjectDistData
          }
        ]
    };

    $scope.ProjectDistributionOptions = {

        // Sets the chart to be responsive
        responsive: true,

        //Boolean - Whether the scale should start at zero, or an order of magnitude down from the lowest value
        scaleBeginAtZero: true,

        //Boolean - Whether grid lines are shown across the chart
        scaleShowGridLines: true,

        //String - Colour of the grid lines
        scaleGridLineColor: "rgba(0,0,0,.05)",

        //Number - Width of the grid lines
        scaleGridLineWidth: 1,

        //Boolean - If there is a stroke on each bar
        barShowStroke: true,

        //Number - Pixel width of the bar stroke
        barStrokeWidth: 2,

        //Number - Spacing between each of the X value sets
        barValueSpacing: 5,

        //Number - Spacing between data sets within X values
        barDatasetSpacing: 1,

        //String - A legend template
        legendTemplate: '<div class="tc-chart-js-legend"><% for (var i=0; i<datasets.length; i+=3){%><span style="background-color:<%=datasets[i].fillColor%>"></span><%if(i<datasets.length){%><%=datasets[i].label%><%}%><%if(i+1<datasets.length){%><span style="background-color:<%=datasets[i+1].fillColor%>"></span> &nbsp; <%=datasets[i+1].label%><%}%><%if(i+2<datasets.length){%><span style="background-color:<%=datasets[i+2].fillColor%>"></span><%=datasets[i+2].label%><%}%><%}%></div>'
    };

    //Resource Deployment

    $scope.UpdateResourceDeploymentChart = function () {
        $http({
            method: 'GET',
            url: 'api/Dashboard/GetResourceDeploymentChartData?authToken=' + $scope.UserIdentity + "-" + $scope.UserPassword
        }).
      success(function (data, status, headers, config) {
          if (data != null) {
              //debugger;

              $scope.ResourceMonthLabels = JSON.parse(data[0]);
              $scope.ResourceMonthData = JSON.parse(data[1]);
              $scope.ResourceDeploymentData.labels = JSON.parse(data[0]);
              $scope.ResourceDeploymentData.datasets[0].data = JSON.parse(data[1]);

          }
      }).
      error(function (data, status, headers, config) {
          // called asynchronously if an error occurs
          // or server returns response with an error status.

      });
    };

    $scope.UpdateResourceDeploymentChart();



    $scope.ResourceDeploymentData = {
        labels: $scope.ResourceMonthLabels,
        datasets: [
          {
              label: 'No. of resources by month',
              fillColor: '#0cc09f',//rgba(69,201,102,0.75)',
              strokeColor: 'rgba(220,220,220,0.8)',
              highlightFill: '#0aac8e',
              highlightStroke: 'rgba(220,220,220,1)',
              data: $scope.ResourceMonthData
          }
        ]
    };

    $scope.ResourceDeploymentOptions = {
        // Sets the chart to be responsive
        responsive: true,

        //Boolean - Whether the scale should start at zero, or an order of magnitude down from the lowest value
        scaleBeginAtZero: true,

        //Boolean - Whether grid lines are shown across the chart
        scaleShowGridLines: false,

        //String - Colour of the grid lines
        scaleGridLineColor: "rgba(0,0,0,.05)",

        //Number - Width of the grid lines
        scaleGridLineWidth: 1,

        //Boolean - If there is a stroke on each bar
        barShowStroke: true,

        //Number - Pixel width of the bar stroke
        barStrokeWidth: 2,

        //Number - Spacing between each of the X value sets
        barValueSpacing: 5,

        //Number - Spacing between data sets within X values
        barDatasetSpacing: 1,

        //String - A legend template
        legendTemplate: '<div class="tc-chart-js-legend"><% for (var i=0; i<datasets.length; i+=3){%><span style="background-color:<%=datasets[i].fillColor%>"></span><%if(i<datasets.length){%><%=datasets[i].label%><%}%><%if(i+1<datasets.length){%><span style="background-color:<%=datasets[i+1].fillColor%>"></span> &nbsp; <%=datasets[i+1].label%><%}%><%if(i+2<datasets.length){%><span style="background-color:<%=datasets[i+2].fillColor%>"></span><%=datasets[i+2].label%><%}%><%}%></div>'
        //legendTemplate: '<ul class="tc-chart-js-legend"><% for (var i=0; i<datasets.length; i++){%><li><span style="background-color:<%=datasets[i].fillColor%>"></span><%if(datasets[i].label){%><%=datasets[i].label%><%}%></li><%}%></ul>'

    };

    // added by Vibhav. To update skill revenue chart 
    $scope.UpdateRevenueChart = function () {
        $http({
            method: 'GET',
            url: 'api/Dashboard/GetRevenueChartData?authToken=' + $scope.UserIdentity + "-" + $scope.UserPassword
        }).
      success(function (data, status, headers, config) {
          if (data != null) {
              debugger;
              $scope.revenueChartPrevData = JSON.parse(data[1]);
              $scope.revenueChartCurrData = JSON.parse(data[0]);

              $scope.skillChartData.datasets[0].data = $scope.revenueChartCurrData;
              $scope.skillChartData.datasets[1].data = $scope.revenueChartPrevData;
              $scope.skillChartData.datasets[0].label = JSON.parse(data[2]);
              $scope.skillChartData.datasets[1].label = JSON.parse(data[3]);

              $scope.YoYInnerData = JSON.parse(data[4]);
              $scope.YoYLabels = JSON.parse(data[5]);
              $scope.YoYData.datasets[0].data = $scope.YoYInnerData;
              $scope.YoYData.labels = $scope.YoYLabels;
          }
      }).
      error(function (data, status, headers, config) {
          // called asynchronously if an error occurs
          // or server returns response with an error status.
          $scope.AllResources = -1;
      });
    };

    // Chart.js Data
    $scope.skillChartData = {
        labels: ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'],
        datasets: [
          {
              label: 'FY15 Business',
              fillColor: 'rgba(620,201,102,0.75)',
              strokeColor: 'rgba(220,220,220,0.8)',
              highlightFill: 'rgba(69,201,102,0.9)',
              highlightStroke: 'rgba(220,220,220,1)',
              data: $scope.revenueChartCurrData//[65, 59, 80, 81, 56, 55, 40]
              //data: [0, 10764, 7866, 18819, 20674, 7494, 54873, 22355, 147398, 47036, 125764, 126168]
          },
          {
              label: 'FY14 Business',
              fillColor: 'rgba(321, 176, 0, 1)',
              strokeColor: 'rgba(321, 176, 0, 0.8)',
              highlightFill: 'rgba(38, 208, 255, 0.75)',
              highlightStroke: 'rgba(151,187,205,1)',
              //data: [28, 48, 40, 19, 86, 27, 30,12,12,12,12,12]
              data: $scope.revenueChartPrevData
          }
        ]
    };

    // Chart.js Options
    $scope.skillChartOptions = {

        // Sets the chart to be responsive
        responsive: true,

        //Boolean - Whether the scale should start at zero, or an order of magnitude down from the lowest value
        scaleBeginAtZero: true,

        //Boolean - Whether grid lines are shown across the chart
        scaleShowGridLines: true,

        //String - Colour of the grid lines
        scaleGridLineColor: "rgba(0,0,0,.05)",

        //Number - Width of the grid lines
        scaleGridLineWidth: 1,

        //Boolean - If there is a stroke on each bar
        barShowStroke: true,

        //Number - Pixel width of the bar stroke
        barStrokeWidth: 2,

        //Number - Spacing between each of the X value sets
        barValueSpacing: 5,

        //Number - Spacing between data sets within X values
        barDatasetSpacing: 1,

        //String - A legend template
        legendTemplate: '<div class="tc-chart-js-legend"><% for (var i=0; i<datasets.length; i+=3){%><span style="background-color:<%=datasets[i].fillColor%>"></span><%if(i<datasets.length){%><%=datasets[i].label%><%}%><%if(i+1<datasets.length){%><span style="background-color:<%=datasets[i+1].fillColor%>"></span> &nbsp; <%=datasets[i+1].label%><%}%><%if(i+2<datasets.length){%><span style="background-color:<%=datasets[i+2].fillColor%>"></span><%=datasets[i+2].label%><%}%><%}%></div>'
        //legendTemplate: '<ul class="tc-chart-js-legend"><% for (var i=0; i<datasets.length; i++){%><li><span style="background-color:<%=datasets[i].fillColor%>"></span><%if(datasets[i].label){%><%=datasets[i].label%><%}%></li><%}%></ul>'
    };

    $scope.UpdateRevenueChart();

    $scope.YoYData = {
        labels: $scope.YoYLabels,
        datasets: [
          {
              label: 'YoY Revenue(million USD)',
              fillColor: '#0cc09f',
              strokeColor: 'rgba(220,220,220,0.8)',
              highlightFill: '#0aac8e',
              highlightStroke: 'rgba(220,220,220,1)',
              data: $scope.YoYInnerData
          }
        ]
    };

    $scope.YoYOptions = {

        // Sets the chart to be responsive
        responsive: true,

        //Boolean - Whether the scale should start at zero, or an order of magnitude down from the lowest value
        scaleBeginAtZero: true,

        //Boolean - Whether grid lines are shown across the chart
        scaleShowGridLines: true,

        //String - Colour of the grid lines
        scaleGridLineColor: "rgba(0,0,0,.05)",

        //Number - Width of the grid lines
        scaleGridLineWidth: 1,

        //Boolean - If there is a stroke on each bar
        barShowStroke: true,

        //Number - Pixel width of the bar stroke
        barStrokeWidth: 1,

        //Number - Spacing between each of the X value sets
        barValueSpacing: 50,

        //Number - Spacing between data sets within X values
        barDatasetSpacing: 5,

        //String - A legend template
        legendTemplate: '<div class="tc-chart-js-legend"><% for (var i=0; i<datasets.length; i+=3){%><span style="background-color:<%=datasets[i].fillColor%>"></span><%if(i<datasets.length){%><%=datasets[i].label%><%}%><%if(i+1<datasets.length){%><span style="background-color:<%=datasets[i+1].fillColor%>"></span> &nbsp; <%=datasets[i+1].label%><%}%><%if(i+2<datasets.length){%><span style="background-color:<%=datasets[i+2].fillColor%>"></span><%=datasets[i+2].label%><%}%><%}%></div>'
    };

    $scope.UpdateTechChart = function () {
        $http({
            method: 'GET',
            url: 'api/Dashboard/GetTechChartData?authToken=' + $scope.UserIdentity + "-" + $scope.UserPassword
        }).
      success(function (data, status, headers, config) {
          if (data != null) {
              debugger;
              var colors = ['#F7464A', '#46BFBD', '#FDB45C', '#40C000', '#FF8000', '#F7464A', '#46BFBD', '#FDB45C', '#46BFBA', '#FDB4AC', '#F7464A', '#46BFBD', '#FDB45C', '#46BFBA', '#FDB4AC', '#F7464A', '#46BFBD', '#FDB45C', '#46BFBA', '#FDB4AC'];
              var highlights = ['#FF5A5E', '#5AD3D1', '#FFC870', '#40C000', '#FFC870', '#FF5A5E', '#5AD3D1', '#FFC870', '#5AD3D1', '#FFC870', '#FF5A5E', '#5AD3D1', '#FFC870', '#5AD3D1', '#FFC870', '#FF5A5E', '#5AD3D1', '#FFC870', '#5AD3D1', '#FFC870'];
              $scope.ProjectChartData = [];
              var ProjectChartDataList = JSON.parse(data[0]);
              for (i = 0; i < ProjectChartDataList.length; i++) {
                  var dataItem = new Object();
                  dataItem.value = ProjectChartDataList[i].value;
                  dataItem.label = ProjectChartDataList[i].label;
                  dataItem.color = colors[i];
                  dataItem.highlight = highlights[i];
                  $scope.ProjectChartData.push(dataItem);
              }
              //$scope.revenueChartPrevData = JSON.parse(data[1]);
              //$scope.revenueChartCurrData = JSON.parse(data[0]);
              //$scope.skillChartData.datasets[0].data = $scope.revenueChartCurrData;S
              //$scope.skillChartData.datasets[1].data = $scope.revenueChartPrevData;
              //$scope.skillChartData.datasets[0].label = JSON.parse(data[2]);
              //$scope.skillChartData.datasets[1].label = JSON.parse(data[3]);
          }
      }).
      error(function (data, status, headers, config) {
          // called asynchronously if an error occurs
          // or server returns response with an error status.
          $scope.AllResources = -1;
      });
    };

    $scope.UpdateTechChart();


    // Chart.js Options
    $scope.ProjectChartOptions = {

        // Sets the chart to be responsive
        responsive: true,

        //Boolean - Whether we should show a stroke on each segment
        segmentShowStroke: true,

        //String - The colour of each segment stroke
        segmentStrokeColor: '#fff',

        //Number - The width of each segment stroke
        segmentStrokeWidth: 2,

        //Number - The percentage of the chart that we cut out of the middle
        percentageInnerCutout: 50, // This is 0 for Pie charts

        //Number - Amount of animation steps
        animationSteps: 100,

        //String - Animation easing effect
        animationEasing: 'easeOutQuint',

        //Boolean - Whether we animate the rotation of the Doughnut
        animateRotate: true,

        //Boolean - Whether we animate scaling the Doughnut from the centre
        animateScale: false,

        //String - A legend template
        legendTemplate: '<ul class="tc-chart-js-legend"><% for (var i=0; i<segments.length; i++){%><li><span style="background-color:<%=segments[i].fillColor%>"></span><%if(segments[i].label){%><%=segments[i].label%><%}%></li><%}%></ul>'

    };


    //End


    $scope.UpdateSoldProposedChart = function () {
        $http({
            method: 'GET',
            url: 'api/Dashboard/GetSoldProposedChartData?authToken=' + $scope.UserIdentity + "-" + $scope.UserPassword
        }).
      success(function (data, status, headers, config) {
          if (data != null) {
              //debugger;
              $scope.SoldProposedChartLabels = JSON.parse(data[0]);
              $scope.SoldProjectsChartData = JSON.parse(data[1]);
              $scope.ProposedProjectsChartData = JSON.parse(data[2]);

              $scope.SoldProposedData.labels = $scope.SoldProposedChartLabels;
              $scope.SoldProposedData.datasets[0].data = $scope.SoldProjectsChartData;
              $scope.SoldProposedData.datasets[1].data = $scope.ProposedProjectsChartData;
          }
      }).
      error(function (data, status, headers, config) {
          // called asynchronously if an error occurs
          // or server returns response with an error status.
          $scope.AllResources = -1;
      });
    };

    $scope.UpdateSoldProposedChart();

    // Chart.js Data
    $scope.SoldProposedData = {
        labels: $scope.SoldProposedChartLabels,
        datasets: [
          {
              label: 'Sold resource needs',
              fillColor: 'rgba(320,220,220,0.2)',
              strokeColor: 'rgba(220,220,220,1)',
              pointColor: 'rgba(220,220,220,1)',
              pointStrokeColor: '#fff',
              pointHighlightFill: '#fff',
              pointHighlightStroke: 'rgba(220,220,220,1)',
              data: $scope.SoldProjectsChartData
          },
          {
              label: 'Proposed resource needs',
              fillColor: 'rgba(151,187,205,0.2)',
              strokeColor: 'rgba(151,187,205,1)',
              pointColor: 'rgba(151,187,205,1)',
              pointStrokeColor: '#fff',
              pointHighlightFill: '#fff',
              pointHighlightStroke: 'rgba(151,187,205,1)',
              data: $scope.ProposedProjectsChartData
          }
        ]
    };

    // Chart.js Options
    $scope.SoldProposedOptions = {

        // Sets the chart to be responsive
        responsive: true,

        ///Boolean - Whether grid lines are shown across the chart
        scaleShowGridLines: true,

        //String - Colour of the grid lines
        scaleGridLineColor: "rgba(0,0,0,.05)",

        //Number - Width of the grid lines
        scaleGridLineWidth: 1,

        //Boolean - Whether the line is curved between points
        bezierCurve: true,

        //Number - Tension of the bezier curve between points
        bezierCurveTension: 0.4,

        //Boolean - Whether to show a dot for each point
        pointDot: true,

        //Number - Radius of each point dot in pixels
        pointDotRadius: 4,

        //Number - Pixel width of point dot stroke
        pointDotStrokeWidth: 1,

        //Number - amount extra to add to the radius to cater for hit detection outside the drawn point
        pointHitDetectionRadius: 20,

        //Boolean - Whether to show a stroke for datasets
        datasetStroke: true,

        //Number - Pixel width of dataset stroke
        datasetStrokeWidth: 2,

        //Boolean - Whether to fill the dataset with a colour
        datasetFill: true,

        // Function - on animation progress
        onAnimationProgress: function () { },

        // Function - on animation complete
        onAnimationComplete: function () { },

        //String - A legend template
        legendTemplate: '<ul class="tc-chart-js-legend"><% for (var i=0; i<datasets.length; i++){%><li><span style="background-color:<%=datasets[i].strokeColor%>"></span><%if(datasets[i].label){%><%=datasets[i].label%><%}%></li><%}%></ul>'
    };



}]);

AUDashboardApp.controller('InvoicesController', ['$scope', '$filter', '$http', 'FileUploader', function ($scope, $filter, $http, FileUploader) {
    var STORAGE_ID = 'Invoices';
    $scope.EditMode = "false";
    $scope.currentPage = 1;
    $scope.pageSize = 10;

    var InvoiceDetails = $scope.InvoiceDetails = [];

    $scope.getInvoices = function () {
        $http({
            method: 'GET',
            url: 'api/Dashboard/GetReferenceData?storageId=' + STORAGE_ID + '&authToken=' + $scope.UserIdentity + "-" + $scope.UserPassword
        }).
        success(function (data, status, headers, config) {

            if (data != 'null') {
                InvoiceDetails = $scope.InvoiceDetails = JSON.parse(JSON.parse(data));
                $scope.$parent.PendingInvoices = $filter('filter')(InvoiceDetails, { PaymentReceived: "Pending" }).length;

            }
        }).
        error(function (data, status, headers, config) {
            // called asynchronously if an error occurs
            // or server returns response with an error status.

        });

    };

    $scope.EditInvoice = function (invoice, index) {
        invoice.index = index;
        $scope.InvoiceEntity = jQuery.extend(true, {}, invoice); // deep copy
        $scope.OriginalInvoice = jQuery.extend(true, {}, invoice); // deep copy
    }

    $scope.ShowReceived = function (showReceived) {
        if (showReceived == "Received" || showReceived == "Yes") {
            return true;
        }
        else
            return false;
    }

    $scope.ShowPending = function (showPending) {
        if (showPending == "Pending" || showPending == "No") {
            return true;
        }
        else
            return false;
    }

    $scope.getInvoices();

    $scope.setInvoices = function (InvoiceDetails) {
        var referenceData = new Object();
        referenceData.storageId = STORAGE_ID;
        referenceData.storageData = JSON.stringify(InvoiceDetails);
        referenceData.authToken = $scope.UserIdentity + "-" + $scope.UserPassword;
        $http({
            url: 'api/Dashboard/SetReferenceData',
            method: "POST",
            data: JSON.stringify(JSON.stringify(referenceData))
        })
            .then(function (response) {
                $scope.getInvoices();
            },
                function (response) { // optional
                }
            );
    };

    $scope.OpenAddInvoice = function () {
        $scope.InvoiceEntity = '';
    };

    //$scope.$watch('InvoiceDetails', function (newValue, oldValue) {
    //    if (newValue !== oldValue) { // This prevents unneeded calls to the local storage
    //        $scope.setInvoices(InvoiceDetails);
    //    }
    //}, true);

    $scope.AddInvoice = function (InvoiceEntity, action) {
        var invoiceRequest = new Object();
        invoiceRequest.Invoices = InvoiceDetails;
        invoiceRequest.InvoiceEntity = InvoiceEntity;
        invoiceRequest.action = action;
        invoiceRequest.authToken = $scope.UserIdentity + "-" + $scope.UserPassword;
        
        $http({
            method: 'POST',
            url: 'api/Dashboard/UpsertInvoice',
            data: invoiceRequest
        }).
       success(function (data, status, headers, config) {
           //success logic
           if (data != 'null') {
               InvoiceDetails = $scope.InvoiceDetails = JSON.parse(JSON.parse(data));
               $scope.$parent.PendingInvoices = $filter('filter')(InvoiceDetails, { PaymentReceived: "Pending" }).length;

           }
       }).
       error(function (data, status, headers, config) {
           //error handling logic
       });

    
    };

    $scope.DownloadInvoice = function (InvoiceNo, DownloadType) {
        debugger;
        $http({
            method: 'GET',
            cache: false,
            url: 'api/Dashboard/GetInvoiceFile',
            responseType: 'arraybuffer',
            headers: {
                'Content-Type': 'application/json; charset=utf-8',
                'fileID': InvoiceNo
            }           
        }).success(function (data, status, headers) {
            var octetStreamMime = 'application/pdf'; 
            if (DownloadType == 'xls') { octetStreamMime = 'application/xls'; }
            
            var success = false;

            // Get the headers
            headers = headers();

            // Get the filename from the x-filename header or default to "download.bin"
            var filename = headers['x-filename'] || 'download.bin';

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
            debugger;
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

    //File upload functionality
    var uploader = $scope.uploader = new FileUploader({
        url: 'api/Dashboard/UploadInvoices',
        autoUpload: true        
        //removeAfterUpload: true
    });

    uploader.onCompleteItem = function (fileItem, response, status, headers) {
        $scope.getInvoices();
    };

    //Invoice File upload functionality
    var invoiceuploader = $scope.invoiceuploader = new FileUploader({
        url: 'api/Dashboard/UploadInvoiceFiles',
        autoUpload: true
        //removeAfterUpload: true
    });

    // FILTERS

    invoiceuploader.filters.push({
        name: 'pdfFilter',
        fn: function (item /*{File|FileLikeObject}*/, options) {
            var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
            return '|pdf|'.indexOf(type) !== -1;
        }
    });

    // FILTERS

    //uploader.filters.push({
    //    name: 'customFilter',
    //    fn: function(item /*{File|FileLikeObject}*/, options) {
    //        return this.queue.length < 10;
    //    }
    //});

    // Chart.js Data
    $scope.InvoiceChartData = {
        labels: ['Payment Pending', 'Closed', 'ATB Approval Pending', 'Processed'],
        datasets: [
          {
              label: 'Invoices by Status',
              fillColor: 'rgba(220,220,220,0.5)',
              strokeColor: 'rgba(220,220,220,0.8)',
              highlightFill: 'rgba(220,220,220,0.75)',
              highlightStroke: 'rgba(220,220,220,1)',
              data: [6, 5, 12, 23]
          }
        ]
    };

    // Chart.js Options
    $scope.InvoiceChartOptions = {

        // Sets the chart to be responsive
        responsive: true,

        //Boolean - Whether the scale should start at zero, or an order of magnitude down from the lowest value
        scaleBeginAtZero: true,

        //Boolean - Whether grid lines are shown across the chart
        scaleShowGridLines: true,

        //String - Colour of the grid lines
        scaleGridLineColor: "rgba(0,0,0,.05)",

        //Number - Width of the grid lines
        scaleGridLineWidth: 1,

        //Boolean - If there is a stroke on each bar
        barShowStroke: true,

        //Number - Pixel width of the bar stroke
        barStrokeWidth: 2,

        //Number - Spacing between each of the X value sets
        barValueSpacing: 15,

        //Number - Spacing between data sets within X values
        barDatasetSpacing: 50,

        //String - A legend template
        legendTemplate: '<ul class="tc-chart-js-legend"><% for (var i=0; i<datasets.length; i++){%><li><span style="background-color:<%=datasets[i].fillColor%>"></span><%if(datasets[i].label){%><%=datasets[i].label%><%}%></li><%}%></ul>'
    };

    $scope.predicate;
    $scope.reverse=false;
    $scope.sort = function (item) {
        if ($scope.predicate == 'Period') {
            return new Date(item.Period);
        }
        return item[$scope.predicate];
    };

    //$scope.sortBy = function (field) {
    //    if ($scope.predicate != field) {
    //        $scope.predicate = field;
    //        $scope.reverse = false;
    //    } else {
    //        $scope.reverse = !$scope.reverse;
    //    }
    //};
}]);

angular.module('AUDashboardApp').filter('changeDateFormat', function($filter)
{
    return function(input)
    {
        if(input == null){ return ""; }
        var _date = $filter('date')(new Date(input),'MMM-yy');
        return _date.toUpperCase();
        //return new Date(input);
    };
});

//javascript function to cookie manipulation
function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1);
        if (c.indexOf(name) == 0) return c.substring(name.length, c.length);
    }
    return "";
}