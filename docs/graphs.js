function create_stacked_bar_chart(selector) {
    //Set the viewport and margins

    const viewport_width = 1000;
    const viewport_height = 1000;
    //Set the viewport and margins
    const margin_left = 70;
    const margin_top = 80;
    const margin_bottom = 140;


    const svg = d3.select(selector);

    let tooltipNode = document.createElement("div")
    document.querySelector(selector).parentNode.appendChild(tooltipNode)
    let tooltip = d3.select(tooltipNode)
    tooltip
        .style("opacity", 0)
        .attr("id", "stacked-tooltip")
        .style("background-color", "white")
        .style("position", "absolute")
        .style("font-size", "2vh")
        .style("border", "solid")
        .style("border-width", "0.1ch")
        .style("border-radius", "0.5ch");

    var mouseover = function (d) {
        let data = d3.select(d.target).datum();
        var game = data.game;
        var val = data.val;
        tooltip
            .html("Game : <b>" + game + "</b><br>Playtime in hours: <b>" + Math.ceil(val / 60) + "</b>")
            .style("opacity", 1)
        d3.selectAll("." + d.target.getAttribute("class").split(" ")[0]).style("filter", "brightness(0.5)");
    }

    var mousemove = function (d) {
        tooltip
            .style("transform", "translateY(-55%)")
            .style("left", d.pageX + document.getElementsByTagName('body')[0].clientWidth * 0.003 + "px")
            .style("top", d.pageY - document.getElementsByTagName('body')[0].clientHeight * 0.03 + "px")
    }
    var mouseleave = function (d) {
        tooltip
            .style("opacity", 0)
        d3.selectAll("." + d.target.getAttribute("class").split(" ")[0]).style("filter", "brightness(1)");
    }

    var mouseClick = function (d) {
        handle_submit(d.target.getAttribute("data-genre"))
        d3.selectAll("." + d.target.getAttribute("class").split(" ")[0]).style("filter", "brightness(1)");
    }

    svg.attr("viewBox", `0 0 ${viewport_width} ${viewport_height}`);

    const width = viewport_width - 2 * margin_left;
    const height = viewport_height - margin_top - margin_bottom;

    //Make the group element which contains the bars
    const g = svg.append('g')
        .attr('transform', `translate(${margin_left} , ${margin_top})`);



    //Create axes which fit our box exactly
    const xscale = d3.scaleBand().range([0, width]);
    const yscale = d3.scaleLinear().range([0, height]);

    const xaxis = d3.axisBottom().scale(xscale);
    const g_xaxis = g.append('g').attr('class', 'x axis').style("font-size", "20px");
    const yaxis = d3.axisLeft().scale(yscale).tickFormat(function (d) {
        return d + "%"
    });
    const g_yaxis = g.append('g').attr('class', 'y axis').style("font-size", "20px");

    // X axis label
    g.append("text")
        .attr("transform",
            "translate(" + (width / 2) + " ," +
            (height + margin_top * 1.4) + ")")
        .style("text-anchor", "middle")
        .text("Groups")
        .style("font-size", "25px");


    //Update function to be retured
    function update(new_data, labels, title) {
        // Graph title
        g.select(".title").remove()
        g.append("text")
            .attr("class", "title")
            .attr("x", 0)
            .attr("y", -20)
            .attr("text-anchor", "left")
            .style("font-size", "35px")
            .style("font-family", "arial")
            .text(title)


        xscale.domain(labels).padding(0.1);
        yscale.domain([100, 0]);


        g_xaxis.transition().attr("transform", "translate(0," + height + ")").call(xaxis);
        g_xaxis.selectAll("text").attr("transform", "rotate(25)").style("text-anchor", "start");;
        g_yaxis.transition().call(yaxis);

        posible_subgroups = [].concat.apply([], new_data).map((e) => e.game).filter((v, i, s) => s.indexOf(v) === i)
        let color = d3.scaleOrdinal().domain(posible_subgroups).range(posible_subgroups.map((v, i, s) => d3.color(
            "hsl(" + i / s.length * 360 + ",70%,50%)")));
        //Get bars and add bars if require


        let bar_groups = g.selectAll(".bar_group").data(new_data);


        let bar_groups_enter = bar_groups.enter().append("g").attr("class", "bar_group");

        let bars = bar_groups.merge(bar_groups_enter).selectAll("rect").data((d) => d)

        let bar_enter = bars.enter().append("rect")
            .attr('x', (d) => xscale(d.label))
            .attr('y', 0)
            .attr('width', (d) => xscale.bandwidth(d.label))
            .attr('height', 0)
            .attr('class', (d) => 'bar_chart_bar_' + d.game)
            .on("click", mouseClick)
            .on("mouseover", mouseover)
            .on("mousemove", mousemove)
            .on("mouseleave", mouseleave);

        //Set the correct values for all the bars

        bars.merge(bar_enter).transition()
            .attr('height', (d) => (height - yscale(d.val / d.total_sum * 100)))
            .attr("y", (d) => yscale(d.cum_sum / d.total_sum * 100))
            .attr('width', (d) => xscale.bandwidth(d.label))
            .attr('fill', (d) => color(d.game))
            .attr('hover-tooltip', (d) => d.game + " : " + d.val)
            .attr('data-genre', (d) => d.game)
            .attr('class', (d) => 'bar_chart_bar_' + d.game.replace(/\W/g, ''))
            .attr('x', (d) => xscale(d.label))

        //Remove unecesary bars
        bars.exit().remove();


    }
    return update
}

//Creates the scatterplot
function create_scatterplot(selector) {
    function update(selectedGenre) {
        // Set viewport and margins
        const viewport_width = 500;
        const viewport_height = 400;

        const margin = {
            top: 40,
            left: 100,
            bottom: 80,
            right: 70
        }

        var svg = d3.select(selector)

        // Remove all contents
        d3.select(selector).selectAll("*").remove();

        svg.attr("viewBox", `0 0 ${viewport_width} ${viewport_height}`);

        const width = viewport_width - margin.left - margin.right
        const height = viewport_height - margin.top - margin.bottom

        // Make the group element which contains the actual graph
        const g = svg.append('g')
            .attr('transform', `translate(${margin.left} , ${margin.top})`);

        //Read the data
        ratingData = data[3]
        ratingGenreData = [] //data filtered for specific genre

        // Add X axis
        var x = d3.scaleLinear()
            .domain([0, 50])
            .range([0, width]);
        g.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x));

        // Add Y axis
        var y = d3.scaleLinear()
            .domain([0, 100])
            .range([height, 0]);
        g.append("g")
            .call(d3.axisLeft(y));

        // X axis label
        g.append("text")
            .attr("transform",
                "translate(" + (width / 2) + " ," +
                (height + margin.top) + ")")
            .style("text-anchor", "middle")
            .text("Price")
            .style("font-size", "15px");

        // Y axis label
        g.append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 0 - margin.left)
            .attr("x", 0 - (height / 2))
            .attr("dy", "1em")
            .style("text-anchor", "middle")
            .text("Positive Rating")
            .style("font-size", "15px");



        //populate filtered genre data array
        ratingData.forEach((d) => {
            if (d.genre == selectedGenre) {
                ratingGenreData.push({
                    price: d.price.replace(/\D/g, ''),
                    pos_reviews: d.pos_reviews
                })
            }
        })
        // Sort ratingGenreData on price
        ratingGenreData.sort((a, b) => {
            return a.price - b.price
        })


        // Add the scatterplot line
        g.append("path")
            .datum(ratingGenreData)
            .attr("fill", "none")
            .attr("stroke", "#69b3a2")
            .attr("stroke-width", 1.5)
            .attr('class', 'scatterpath')
            .attr("d", d3.line()
                .x(function (d) {
                    return x(d.price)
                })
                .y(function (d) {
                    return y(d.pos_reviews)
                })
            )

        // Add the points
        g
            .append("g")
            .selectAll("dot")
            .data(ratingGenreData)
            .enter()
            .append("circle")
            .attr("cx", function (d) {
                return x(d.price)
            })
            .attr("cy", function (d) {
                return y(d.pos_reviews)
            })
            .attr("r", 5)
            .attr("fill", "#69b3a2")
    }
    return update;
}

//This function creates setsup the bar chart by providing a update function
function create_bar_chart(selector) {
    //Set the viewport and margins
    const viewport_width = 500;
    const viewport_height = 400;
    const margin = {
        top: 60,
        left: 100,
        bottom: 90,
        right: 70
    }


    const svg = d3.select(selector);
    let tooltipNode = document.createElement("div")
    document.querySelector(selector).parentNode.appendChild(tooltipNode)
    let tooltip = d3.select(tooltipNode)
    tooltip
        .style("opacity", 0)
        .attr("id", "stacked-tooltip")
        .style("background-color", "white")
        .style("position", "absolute")
        .style("font-size", "2vh")
        .style("border", "solid")
        .style("border-width", "0.1ch")
        .style("border-radius", "0.5ch");

    var mouseover = function (d) {
        tooltip
            .html("Value : <b>" + d3.select(d.target).datum() + "</b>")
            .style("opacity", 1)
        d3.selectAll("." + d.target.getAttribute("class").split(" ")[0]).style("filter", "brightness(0.5)");
    }
    var mousemove = function (d) {
        tooltip
            .style("transform", "translateY(-55%)")
            .style("left", d.pageX + document.getElementsByTagName('body')[0].clientWidth * 0.003 + "px")
            .style("top", d.pageY - document.getElementsByTagName('body')[0].clientHeight * 0.015 + "px")
    }
    var mouseleave = function (d) {
        tooltip
            .style("opacity", 0)
        d3.selectAll("." + d.target.getAttribute("class").split(" ")[0]).style("filter", "brightness(1)");
    }

    var mouseClick = function (d) {
        handle_submit(d.target.getAttribute("data-label"))
        d3.selectAll("." + d.target.getAttribute("class").split(" ")[0]).style("filter", "brightness(1)");
    }

    svg.attr("viewBox", `0 0 ${viewport_width} ${viewport_height}`);

    const width = viewport_width - margin.left - margin.right;
    const height = viewport_height - margin.top - margin.bottom;

    //Make the group element which contains the bars
    const g = svg.append('g')
        .attr('transform', `translate(${margin.left} , ${margin.top})`);


    //Create axes which fit our box exactly
    const xscale = d3.scaleBand().range([0, width]);
    const yscale = d3.scaleLinear().range([0, height]);

    const xaxis = d3.axisBottom().scale(xscale);
    const g_xaxis = g.append('g').attr('class', 'x axis');
    const yaxis = d3.axisLeft().scale(yscale).tickFormat(function (e) {
        if (Math.floor(e) != e) {
            return;
        }
        return e;
    });
    const g_yaxis = g.append('g').attr('class', 'y axis');

    // X axis label
    g.append("text")
        .attr("id", "bar_chart_x_label")
        .attr("x", width / 2)
        .attr("y", height + margin.top)
        .style("text-anchor", "middle")
        .text("")
        .style("font-size", "12px");

    // Y axis label
    g.append("text")
        .attr("id", "bar_chart_y_label")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left)
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text("yaxis_t")
        .style("font-size", "12px");
    //Update function to be retured
    function update(new_data, labels, title, yaxis_t, xaxis_t, ylabel_loc = margin.left, xlabel_loc = margin.top) {

        g.select(".title").remove()
        g.append("text")
            .attr("class", "title")
            .attr("x", 0)
            .attr("y", -20)
            .attr("text-anchor", "left")
            .style("font-size", "15px")
            .style("font-family", "arial")
            .text(title)

        g.select("#bar_chart_x_label").text(xaxis_t).attr("y", height + xlabel_loc)
        g.select("#bar_chart_y_label").text(yaxis_t).attr("y", 0 - ylabel_loc)


        //Create the axis with the new data.
        xscale.domain(labels).padding(0.1);
        yscale.domain([d3.max(new_data), 0]);


        g_xaxis.transition().attr("transform", "translate(0," + height + ")").call(xaxis);
        g_xaxis.selectAll("text").attr("transform", "rotate(25)").style("text-anchor", "start");;
        g_yaxis.transition().call(yaxis);


        //Get bars and add bars if required
        const bars = g.selectAll("rect").data(new_data);

        const bar_enter = bars.enter().append("rect")
            .attr('x', (d) => xscale(labels[new_data.indexOf(d)]))
            .attr('y', height)
            .attr('width', xscale.bandwidth())
            .attr('height', 0)
            .attr('class', (d) => 'bar_chart_bar_' + labels[new_data.indexOf(d)].replace(/\W/g, '') + " bar_chart_bar")
            .on("mouseover", mouseover)
            .on("mousemove", mousemove)
            .on("mouseleave", mouseleave)
            .on("click", mouseClick);

        //Set the correct values for all the bars
        bars.merge(bar_enter).transition()
            .attr('height', (d) => (height - yscale(d)))
            .attr("y", (d) => (yscale(d)))
            .attr('width', xscale.bandwidth())
            .attr('x', (d) => xscale(labels[new_data.indexOf(d)]))
            .attr('class', (d) => 'bar_chart_bar_' + labels[new_data.indexOf(d)].replace(/\W/g, '') + " bar_chart_bar")
            .attr("data-label", (d) => labels[new_data.indexOf(d)])
        //Remove unecesary bars
        bars.exit().remove();

    }
    return update;
}

function create_pie_chart(selector) {

    const viewport_width = 300;
    const viewport_height = 300;

    const margin_left = 30;
    const margin_top = 80;


    const svg = d3.select(selector);

    svg.attr("viewBox", `0 0 ${viewport_width} ${viewport_height}`);

    const width = viewport_width - 2 * margin_left;
    const height = viewport_height - 2 * margin_top;

    //Make the group element which contains the bars
    const g = svg.append('g')
        .attr('transform', 'translate(' + width / 2 + ',' + (height / 2 + margin_top) + ')')

    var color = d3.scaleOrdinal(d3.schemeSet3);

    var min = Math.min(width, height);
    var oRadius = min / 2 * 0.9;
    var iRadius = 0;

    // construct default pie
    var pie = d3.pie().value(function (d) {
        return d.value;
    }).sort(null);

    // construct arc generator
    var arc = d3.arc()
        .outerRadius(oRadius)
        .innerRadius(iRadius);


    function update(new_data, title) {
        // Remove current title and add new one
        g.select(".title").remove()
        g.append("text")
            .attr("class", "title")
            .attr("y", -margin_top)
            .attr("text-anchor", "middle")
            .style("font-size", "30px")
            .style("font-family", "arial")
            .text(title)

        // Calculate position of each data point on the pie
        const pied = pie(new_data)

        color.domain(new_data.map((d) => d.name))

        // Get the current pie chart data
        const old = g.selectAll('path').data();

        function tweenArc(d, i) {
            const interpolate = d3.interpolateObject(old[i], d);
            return (t) => arc(interpolate(t));
        }

        // Add the pie-pieces
        const path = g.selectAll('path').data(pied, (d) => d.data.name).join(
            (enter) => {
                const path_enter = enter.append('path')
                path_enter.append('title')
                return path_enter
            },
            (update) => update,
            (exit) => exit.transition()
            .attrTween('d', tweenArc)
            .remove()
        );

        // Specify transition
        path.transition()
            .attrTween('d', tweenArc)
            .style('fill', (d) => color(d.data.name))

        // Add hover element
        path.select('title').text((d) => d.data.name + ':' + d.data.value)

    }
    return update;
}

function createHeatMap(selector) {

    const viewport_width = 1000;
    const viewport_height = 900;
    //Set the viewport and margins
    const margin_left = 200;
    const margin_top = 100;

    const svg = d3.select(selector)

    svg.attr("viewBox", `0 0 ${viewport_width} ${viewport_height}`);

    const width = viewport_width - 2 * margin_left;
    const height = viewport_height - 2 * margin_top;

    //Make the group element which contains the bars
    const g = svg.append('g')
        .attr('transform', `translate(${margin_left} , ${margin_top})`);

    //Read the data
    ratingData = data[3]
    var myPrice = []
    var myGenres = []
    // Labels of row and columns -> unique identifier of the column called 'price' and 'genre'
    ratingData.forEach((d) => {
        myPrice.push(d.price)
        myGenres.push(d.genre)
    })

    // Build X scales and axis:
    var x = d3.scaleBand()
        .range([0, width])
        .domain(myPrice)
        .padding(0.01);
    g.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x))
        .style("font-size", "20px")


    // X axis label
    g.append("text")
        .attr("transform",
            "translate(" + (width / 2) + " ," +
            (height + margin_top / 2) + ")")
        .style("text-anchor", "middle")
        .text("Price")
        .style("font-size", "25px");

    // Build Y scales and axis:
    var y = d3.scaleBand()
        .range([height, 0])
        .domain(myGenres)
        .padding(0.01);
    g.append("g")
        .call(d3.axisLeft(y))
        .style("font-size", "15px");

    // Y axis label
    g.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin_left)
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text("Value")
        .style("font-size", "20px");

    // Build color scale
    var myColor = d3.scaleSequential()
        .interpolator(d3.interpolateSpectral)
        .domain([1, 100])

    let tooltipNode = document.createElement("div")
    document.querySelector(selector).parentNode.appendChild(tooltipNode)
    let tooltip = d3.select(tooltipNode)
    tooltip
        .style("opacity", 0)
        .attr("id", "stacked-tooltip")
        .style("background-color", "white")
        .style("position", "absolute")
        .style("font-size", "2vh")
        .style("border", "solid")
        .style("border-width", "0.1ch")
        .style("border-radius", "0.5ch");

    // Three function that change the tooltip when user hover / move / leave a cell
    var mouseover = function (d) {
        tooltip
            .style("opacity", 0.9)
    }
    var mousemove = function (d) {
        let data = d3.select(d.target).datum()
        var pos_reviews = data.pos_reviews
        var count = data.count
        tooltip
            .style("transform", "translateY(-55%)")
            .style("left", d.pageX + document.getElementsByTagName('body')[0].clientWidth * 0.003 + "px")
            .style("top", d.pageY - document.getElementsByTagName('body')[0].clientHeight * 0.015 + "px")
            .html("Positive Reviews: " + ((pos_reviews < 1) ? 'N/A' : "<b>" + pos_reviews + "</b>%") +
                " | Games: <b>" + count + "</b>")
    }

    var mouseleave = function (d) {
        tooltip.style("opacity", 0)
    }

    // add the squares
    g.selectAll()
        .data(ratingData, function (d) {
            return d.price + ':' + d.genre;
        })
        .enter()
        .append("rect")
        .attr("x", function (d) {
            return x(d.price)
        })
        .attr("y", function (d) {
            return y(d.genre)
        })
        .attr("width", x.bandwidth())
        .attr("height", y.bandwidth())
        .attr('class', (d) => 'bar_chart_bar_' + d.genre.replace(/\W/g, ''))
        .style("opacity", (d) => (d.pos_reviews < 1) ? "0.3" : "1")
        .style("fill", function (d) {
            return myColor((d.pos_reviews < 1) ? NaN : d.pos_reviews)
        }) //In order for empty entries to be black
        .on("mouseover", mouseover)
        .on("mousemove", mousemove)
        .on("mouseleave", mouseleave)

    // Graph title
    g.append("text")
        .attr("x", 0)
        .attr("y", -40)
        .attr("text-anchor", "left")
        .style("font-size", "35px")
        .style("font-family", "arial")
        .text("Positive Reviews");

    // Graph subtitle
    g.append("text")
        .attr("x", 0)
        .attr("y", -15)
        .attr("text-anchor", "left")
        .style("font-size", "25px")
        .style("font-family", "arial")
        .style("fill", "grey")
        .style("max-width", width)
        .text("Percentage of positive reviews based on the game's genre and price");
}