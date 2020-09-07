function makeResponsive() {

    // if the SVG area isn't empty when the browser loads,
    // remove it and replace it with a resized version of the chart
    var svgArea = d3.select("body").select("svg");

    if (!svgArea.empty()) {
    svgArea.remove();
    }

    // Set svg dimensions
    // var svgWidth = 960;
    // var svgHeight = 500;
    var svgHeight = window.innerHeight;
    var svgWidth = window.innerWidth;

    var margin = {
    top: 20,
    right: 40,
    bottom: 60,
    left: 100
    };

    var width = svgWidth - margin.left - margin.right;
    var height = svgHeight - margin.top - margin.bottom;
    console.log(`Width: ${width}, Height: ${height}`)

    // Create an SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins.
    var svg = d3.select("#scatter")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);

    var chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

    // Import Data
    d3.csv("assets/data/data.csv").then(function(data) {

        // Parse Data/Cast as numbers
        
        data.forEach(function(data) {
        data.healthcare = +data.healthcare;
        data.poverty = +data.poverty;
        });

        // Create scale functions
        
        var xLinearScale = d3.scaleLinear()
        .domain([2, d3.max(data, d => d.healthcare)])
        .range([0, width]);

        var yLinearScale = d3.scaleLinear()
        .domain([8, d3.max(data, d => d.poverty)])
        .range([height, 0]);

        // Create axis functions
        
        var bottomAxis = d3.axisBottom(xLinearScale);
        var leftAxis = d3.axisLeft(yLinearScale);

        // Append Axes to the chart
        
        chartGroup.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(bottomAxis);

        chartGroup.append("g")
        .call(leftAxis);

        // Create Circles

        var circlesGroup = chartGroup.selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .attr("cx", d => xLinearScale(d.healthcare))
        .attr("cy", d => yLinearScale(d.poverty))
        .attr("r", "15")
        .attr("fill", "#50BBC0")
        .attr("opacity", ".75");

        var textLabels = chartGroup.append("g")
        .selectAll("text")
        .data(data)
        .enter()
        .append("text")
        .attr("x", d => xLinearScale(d.healthcare))
        .attr("y", d => yLinearScale(d.poverty))
        .attr('text-anchor', 'middle')
        .attr('alignment-baseline', 'middle')
        .attr('fill', 'white')
        .text(d => d.abbr)

        // Initialize tool tip

        var toolTip = d3.tip()
        .attr("class", "tooltip")
        .offset([80, -60])
        .html(function(data, index) {
            return (`${data.state}<br>Healthcare: ${data.healthcare}<br>Poverty: ${data.poverty}`);
        });
        
        // Create tooltip in the chart
        chartGroup.call(toolTip);

        // Step 8: Create event listeners to display and hide the tooltip
        // ==============================
        circlesGroup.on("mouseover", function(data) {
        toolTip.show(data, this);
        })
        // onmouseout event
        .on("mouseout", function(data, index) {
            toolTip.hide(data);
        });

        textLabels.on("mouseover", function(data) {
            toolTip.show(data, this);
            })
            // onmouseout event
            .on("mouseout", function(data, index) {
                toolTip.hide(data);
            });

        // Create axes labels
        chartGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left + 40)
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .attr("class", "axisText")
        .text("In Poverty (%)");

        chartGroup.append("text")
        .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
        .attr("class", "axisText")
        .text("Lacks Healthcare (%)");
    }).catch(function(error) {
        console.log(error);
    });
}

makeResponsive();

// Event listener for window resize.
// When the browser window is resized, makeResponsive() is called.
d3.select(window).on("resize", makeResponsive);

