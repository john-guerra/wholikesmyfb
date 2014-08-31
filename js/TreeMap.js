/* global d3: false, getUrlForPhoto: false, $: false */
/*jslint browser: true, indent: 4 */


function TreeMap(htmlID) {
    "use strict";
    var self = this, margin = {top: 40, right: 0, bottom: 10, left: 0},
        width, height,
        color = d3.scale.category20c(),
        treemap,
        fScale,
        div;

    fScale = d3.scale.linear()
        .domain([10, 30000])
        .range([0.7, 2.0]);

    treemap = d3.layout.treemap()
        .sticky(true)
        .value(function (d) { return d.size; })
        .sort(function (a, b) { return d3.ascending(a.size, b.size); });


    self.init = function () {
        width = document.getElementById(htmlID.slice(1)).offsetWidth - margin.left - margin.right;
        height = $(window).height() - 200 - margin.top - margin.bottom;


        div = d3.select(htmlID).select("#innerTreeMap");
        div.style("position", "relative")
            .style("width", (width + margin.left + margin.right) + "px")
            .style("height", (height + margin.top + margin.bottom) + "px")
            .style("left", margin.left + "px")
            .style("top", margin.top + "px");

        treemap.size([width, height]);
    };
    self.update = function (root) {
            // .nodes(root);

        treemap.sticky(true);
        var node = div.selectAll(".node")
            .data(treemap.nodes(root), function (d) { return d.id; } );

        var nodeDiv = node.enter().append("div")
            .attr("class", function (d) { return "node liker liker" + d.id; })
            .on("mouseover", function (d) {
                d3.select("#albums").classed("selected", true);
                d3.select("#likersTreeMap").classed("selected", true);
                d3.selectAll(".liker"+d.id).classed("selected", true);
            })
            .on("mouseout", function () {
                d3.select("#albums").classed("selected", false);
                d3.select("#likersTreeMap").classed("selected", false);
                d3.selectAll(".liker").classed("selected", false);
            });

        nodeDiv.append("div")
                .attr("class", "nodeBG");

        nodeDiv.append("div")
            .attr("class", "nodeText")
            .style("font-size", function (d) { return d.children ? null : fScale(d.dx * d.dy) + "em"; })
            .html(function (d) { return d.children ? null : d.name + "<br>" + d.size; });

        nodeDiv.call(position);

        node
            // .data(treemap.nodes)
            .transition()
            .duration(1500)
            .call(position);

        node.select(".nodeText")
            .html(function (d) {
                    return d.children ? null : d.name + "<br>" + d.size;
                })
            // .transition()
            // .duration(1500)
            .style("font-size", function (d) { return d.children ? null : fScale(d.dx * d.dy) + "em"; });

        node.exit().remove();
    };

    function position(sel) {
        sel.style("left", function(d) { return d.x + "px"; })
        .style("top", function(d) { return d.y + "px"; })
        .style("width", function(d) { return Math.max(0, d.dx - 1) + "px"; })
        .style("height", function(d) { return Math.max(0, d.dy - 1) + "px"; });
        sel.select(".nodeBG")
            // .style("background-size", function (d) {
            //         return Math.max(0, d.dx - 1) + "px " + Math.max(0, d.dy - 1) + "px";
            //     })
            .style("background-color", function (d) { return d.children ? null : color(d.name); })
            .style("background-image", function (d) {
                return d.id ? "url(" +
                    getUrlForPhoto(d.id, "normal") +
                    ")" : null;
            });


    }
    return self;
}

