'use strict';

// D3 chart for analyzing spending history
BCAP.directive('spendingChart', function($parse, $window){
		return {
        restrict: 'EA',
				template: "<svg width='850' height='200'></svg>",
        link: function(scope, elem, attrs) {

        	console.log(`scope: `, scope);
					var exp = $parse(attrs.chartData);

					var salesDataToPlot=exp(scope);

					var padding = 20;
					var pathClass="path";
					var xScale, yScale, xAxisGen, yAxisGen, lineFun;

					var d3 = $window.d3;
					var rawSvg=elem.find('svg');
					var svg = d3.select(rawSvg[0]);

					// format date time
					var formatDate = d3.time.format("%a-%b-%Y");
			    console.log(`salesDataToPlot: `, salesDataToPlot);

			    salesDataToPlot.forEach(function (d) {
		        // d.created_at = formatDate.parse(d.created_at);
		        d.created_at = new Date(d.created_at);
		        console.log(`d.created_at: `, d.created_at);
		        // console.log(`d.created_at typeof: `, typeof d.created_at);
		        d.close = +d.close;
		        return d;
			    });
			    console.log(`salesDataToPlot: `, salesDataToPlot);

					// may not be needed
					scope.$watchCollection(exp, function(newVal, oldVal){
					   salesDataToPlot=newVal;
					   redrawLineChart();
					});

					function setChartParameters(){
						console.log(`setChartParameters salesDataToPlot: `, salesDataToPlot);
						// created_at for timestamp , object.amount.amount (is string) for 
					   xScale = d3.time.scale()
					   			// reverse domain order since data is reversed
					       .domain([new Date(salesDataToPlot[salesDataToPlot.length-1].created_at), new Date(salesDataToPlot[0].created_at)])	
					       .range([padding + 5, rawSvg.attr("width") - padding]);

					   yScale = d3.scale.linear()
					       .domain([d3.min(salesDataToPlot, function (d) {
					       	return d.amount.amount;
					       }), d3.max(salesDataToPlot, function (d) {
					           return d.amount.amount;
					       })])
					       .range([rawSvg.attr("height") - padding, 0]);


					   xAxisGen = d3.svg.axis()
					       .scale(xScale)
					       .orient("center")
					       .ticks(10);

					   yAxisGen = d3.svg.axis()
					       .scale(yScale)
					       .orient("left")
					       .ticks(5);

					   lineFun = d3.svg.line()
					       .x(function (d) {
					           return xScale(d.created_at);
					       })
					       .y(function (e) {
					           return yScale(e.amount.amount);
					       })
					       .interpolate("linear");
					}

					function drawLineChart() {

					   setChartParameters();

					   svg.append("svg:g")
					       .attr("class", "x axis")
					       .attr("transform", "translate(0,180)")
					       .call(xAxisGen);

					   svg.append("svg:g")
					       .attr("class", "y axis")
					       .attr("transform", "translate(20,0)")
					       .call(yAxisGen);

					   svg.append("svg:path")
					       .attr({
					           d: lineFun(salesDataToPlot),
					           "stroke": "#666",
					           "stroke-width": 1.5,
					           "fill": "none",
					           "class": pathClass
					       });
					}

					// used if data updates, called by $watchCollection
					function redrawLineChart() {

					   setChartParameters();

					   svg.selectAll("g.y.axis").call(yAxisGen);

					   svg.selectAll("g.x.axis").call(xAxisGen);

					   svg.selectAll("."+pathClass)
					       .attr({
					           d: lineFun(salesDataToPlot)
					       });
					}

					drawLineChart();


        }
    	}
	});


