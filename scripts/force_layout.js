/*
*    Title: Force-Directed Graph
*    Author: Mike Bostock
*    Released under: GNU General Public License, version 3
*    Availability: https://bl.ocks.org/mbostock/4062045

*    Edited by: Bryson Seiler
*    Date: 06/04/2018
*/


//Bryson Seiler: Added: function to open json networks:
function open_file(filename, scale_node, link_strength, body_strength, collide_strength, distance, iterations){

	//Bryson Seiler: Added: Varaibles: filename, strength, distance, iterations

	var filename = filename;
	var scale_node = scale_node;
	var link_strength = link_strength;
	var body_strength = body_strength;
	var collide_strength = collide_strength;
	var distance = distance; 
	var iterations = iterations;

	var svg = d3.select("svg"),
					width = +svg.attr("width"),
					height = +svg.attr("height");
				
	var color = d3.scaleOrdinal(d3.schemeCategory20c);
				
	var simulation = d3.forceSimulation()
					//Bryson Seiler: Added: .strength(strength).distance(distance).iterations(iterations)
					.force("link", d3.forceLink().id(function(d) { return d.id; }).strength(link_strength).distance(distance))
					.force("charge", d3.forceManyBody().strength(body_strength))
					.force("collision", d3.forceCollide(12).strength(collide_strength).iterations(iterations))
					.force("center", d3.forceCenter(width / 2, height / 2));

	d3.json(filename, function(error, graph) {
			if (error) throw error;
					
		var link = svg.append("g")
						.attr("class", "links")
						.selectAll("line")
						.data(graph.links)
						.enter().append("line")
						.attr("stroke-width", function(d) { return Math.sqrt(d.value); });
					
		var node = svg.append("g")
						.attr("class", "nodes")
						.selectAll("circle")
						.data(graph.nodes)
						.enter().append("circle")
						//Bryson Seiler added: Change color/size based off of degree
						.attr("fill", function(d) { return color(d.group); })
						.attr("fill", function(d) { return color(d.Degree); })
						//.attr("r", function(d) { return d.group*2; })
						.attr("r", function(d) { return d.Degree*scale_node; })
						.call(d3.drag()
							.on("start", dragstarted)
							.on("drag", dragged)
							.on("end", dragended));

		//Bryson Seiler Added labels:
		node.append("text")
			.attr("dx", 12)
			.attr("dy", ".35em")
			.text(function(d) { return d.Label });
					
		node.append("title")
			.text(function(d) { return d.id; });
					
		simulation
			.nodes(graph.nodes)
			.on("tick", ticked);
					
		simulation.force("link")
			.links(graph.links);
					
		function ticked() {
			link
				.attr("x1", function(d) { return d.source.x; })
				.attr("y1", function(d) { return d.source.y; })
				.attr("x2", function(d) { return d.target.x; })
				.attr("y2", function(d) { return d.target.y; });
					
			node
				.attr("cx", function(d) { return d.x; })
				.attr("cy", function(d) { return d.y; });
			}
		});
			
	function dragstarted(d) {
		if (!d3.event.active) simulation.alphaTarget(0.3).restart();
			d.fx = d.x;
			d.fy = d.y;
		}
				
	function dragged(d) {
		d.fx = d3.event.x;
		d.fy = d3.event.y;
		}
				
	function dragended(d) {
		if (!d3.event.active) simulation.alphaTarget(0);
			d.fx = null;
			d.fy = null;
		}

}