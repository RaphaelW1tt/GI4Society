	"use strict";
	// Setting variables
	let stateName;
	let geojson;

	// Functionality for changing layer style (unemployment) according to selected year of the slider
	let slider = document.getElementById("sliderRange");
	let output = document.getElementById("year");
	output.innerHTML = slider.value;
	slider.oninput = function () {
		output.innerHTML = this.value;
		styler(this.value);
	}

	// Creating map and setting properties
	let mymap = L.map('mapid', {
		zoomControl: true,
		maxZoom: 12,
		minZoom: 5
	}).setView([51.5167, 9.9167], 5);
	mymap.zoomControl.setPosition('bottomleft');
	mymap.setMaxBounds([
		[40, -5],
		[60, 25]
	]);
	mymap.doubleClickZoom.disable();

	// Adding tile layer map from OSM
	L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
		maxZoom: 14,
		attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a>, Contributor of state data: <a href="https://github.com/isellsoap">Francesco Schwarz</a>',
	}).addTo(mymap);

	// Setting layer styles for all the years
	function styler(year) {
		geojson.eachLayer(function (layer) {
			if (layer.feature.properties.highlight === true) {
				layer.setStyle({
					weight: 3,
					fillOpacity: 0.85,
					fillColor: getColor(layer["feature"]["properties"]["unemp" + year])
				});
			} else {
				layer.setStyle({
					weight: 1,
					opacity: 1,
					color: "black",
					dashArray: '0',
					fillOpacity: 0.7,
					fillColor: getColor(layer["feature"]["properties"]["unemp" + year])
				});
			}
		});
	}

	// Function for returning color according to unemployment number
	function getColor(d) {
		return d > 325 ? '#800026' :
			d > 275 ? '#BD0026' :
			d > 225 ? '#E31A1C' :
			d > 175 ? '#FC4E2A' :
			d > 125 ? '#FD8D3C' :
			d > 75 ? '#FEB24C' :
			d > 25 ? '#FED976' :
			'black';
	}

	// Adding legend to the map
	let legend = L.control({
		position: 'bottomright'
	});
	legend.onAdd = function (mymap) {
		let div = L.DomUtil.create('div', 'info legend'),
			grades = [25, 75, 125, 175, 225, 275, 325],
			labels = [];
		div.innerHTML = "Unemployed in <br> thousand <br>"
		for (let i = 0; i < grades.length; i++) {
			div.innerHTML +=
				'<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
				grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
		}
		return div;
	};
	legend.addTo(mymap);

	// // Function for highlighting shape borders by hovering over a state
	// function highlightFeature(e) {
	// 	let layer = e.target;
	// 	layer.bringToFront();
	// 	layer.setStyle({
	// 		weight: 3,
	// 		color: 'black',
	// 	});
	// }

	// // Function for resetting the highlighting by moving the mouse out of the state boundaries
	// function resetHighlight(e) {
	// 	geojson.resetStyle(e.target);
	// 	styler(slider.value);
	// };

	// Functionalities for the features of the layer (hover over/click on/double click on)
	function onEachFeature(feature, layer) {
		layer.on({
			click: function (e) {
				if (e.target.feature.properties.highlight !== true) {
					console.log("Highlighted");
					geojson.eachLayer(function (layer) {
						if (layer.feature.properties.highlight == true) {
							layer.feature.properties.highlight = false;
						}
					});
					e.target.feature.properties.highlight = true;
					//geojson.resetStyle(e.target);
					styler(slider.value);
					let layer = e.target;
					layer.bringToFront();
					stateName = feature.properties.sname;
					document.getElementById("getStateName").innerHTML = "Selected federal state:" + "<br/>" + stateName;
					createDiagrams();
					console.log(feature.properties);
				}
			},
			dblclick: function (e) {
				mymap.fitBounds(e.target.getBounds());
			}
		});
	}

	// Function for querying GDP data from the triple store
	function getGDP() {
		let qry = "select * from <http://course.geoinfo2017.org/GC> where { " +
			"<http://course.geoinfo2017.org/GC#" + stateName + "> <http://course.geoinfo2017.org/GC#hasGDP2008> ?c." +
			"<http://course.geoinfo2017.org/GC#" + stateName + "> <http://course.geoinfo2017.org/GC#hasGDP2009> ?c1." +
			"<http://course.geoinfo2017.org/GC#" + stateName + "> <http://course.geoinfo2017.org/GC#hasGDP2010> ?c2." +
			"<http://course.geoinfo2017.org/GC#" + stateName + "> <http://course.geoinfo2017.org/GC#hasGDP2011> ?c3." +
			"<http://course.geoinfo2017.org/GC#" + stateName + "> <http://course.geoinfo2017.org/GC#hasGDP2012> ?c4." +
			"<http://course.geoinfo2017.org/GC#" + stateName + "> <http://course.geoinfo2017.org/GC#hasGDP2013> ?c5." +
			"<http://course.geoinfo2017.org/GC#" + stateName + "> <http://course.geoinfo2017.org/GC#hasGDP2014> ?c6.}";
		$.post("http://giv-oct2.uni-muenster.de:8890/sparql", {
				query: qry,
				output: 'json'
			},
			function (data) {
				createGDPDiagram(data);
			});
	}

	// Function for querying risk of poverty data from the triple store
	function getROP() {
		let qry = "select * from <http://course.geoinfo2017.org/GC> where { " +
			"<http://course.geoinfo2017.org/GC#" + stateName + "> <http://course.geoinfo2017.org/GC#hasPoverty2008> ?c." +
			"<http://course.geoinfo2017.org/GC#" + stateName + "> <http://course.geoinfo2017.org/GC#hasPoverty2009> ?c1." +
			"<http://course.geoinfo2017.org/GC#" + stateName + "> <http://course.geoinfo2017.org/GC#hasPoverty2010> ?c2." +
			"<http://course.geoinfo2017.org/GC#" + stateName + "> <http://course.geoinfo2017.org/GC#hasPoverty2011> ?c3." +
			"<http://course.geoinfo2017.org/GC#" + stateName + "> <http://course.geoinfo2017.org/GC#hasPoverty2012> ?c4." +
			"<http://course.geoinfo2017.org/GC#" + stateName + "> <http://course.geoinfo2017.org/GC#hasPoverty2013> ?c5." +
			"<http://course.geoinfo2017.org/GC#" + stateName + "> <http://course.geoinfo2017.org/GC#hasPoverty2014> ?c6.}";
		$.post("http://giv-oct2.uni-muenster.de:8890/sparql", {
				query: qry,
				output: 'json'
			},
			function (data) {
				createROPDiagram(data);
			});
	}

	// Function for querying population density data from the triple store
	function getPopdens() {
		let qry = "select * from <http://course.geoinfo2017.org/GC> where { " +
			"<http://course.geoinfo2017.org/GC#" + stateName + "> <http://course.geoinfo2017.org/GC#hasPopulationDensity2008> ?c." +
			"<http://course.geoinfo2017.org/GC#" + stateName + "> <http://course.geoinfo2017.org/GC#hasPopulationDensity2009> ?c1." +
			"<http://course.geoinfo2017.org/GC#" + stateName + "> <http://course.geoinfo2017.org/GC#hasPopulationDensity2010> ?c2." +
			"<http://course.geoinfo2017.org/GC#" + stateName + "> <http://course.geoinfo2017.org/GC#hasPopulationDensity2011> ?c3." +
			"<http://course.geoinfo2017.org/GC#" + stateName + "> <http://course.geoinfo2017.org/GC#hasPopulationDensity2012> ?c4." +
			"<http://course.geoinfo2017.org/GC#" + stateName + "> <http://course.geoinfo2017.org/GC#hasPopulationDensity2013> ?c5." +
			"<http://course.geoinfo2017.org/GC#" + stateName + "> <http://course.geoinfo2017.org/GC#hasPopulationDensity2014> ?c6.}";
		$.post("http://giv-oct2.uni-muenster.de:8890/sparql", {
				query: qry,
				output: 'json'
			},
			function (data) {
				createPDDiagram(data);
			});
	}

	// Function for querying number of industry data from the triple store
	function getNumberOfIndustries() {
		let qry = "select * from <http://course.geoinfo2017.org/GC> where {" +
			"<http://course.geoinfo2017.org/GC#" + stateName + "> <http://course.geoinfo2017.org/GC#NumIndustries2008> ?c." +
			"<http://course.geoinfo2017.org/GC#" + stateName + "> <http://course.geoinfo2017.org/GC#NumIndustries2009> ?c1." +
			"<http://course.geoinfo2017.org/GC#" + stateName + "> <http://course.geoinfo2017.org/GC#NumIndustries2010> ?c2." +
			"<http://course.geoinfo2017.org/GC#" + stateName + "> <http://course.geoinfo2017.org/GC#NumIndustries2011> ?c3." +
			"<http://course.geoinfo2017.org/GC#" + stateName + "> <http://course.geoinfo2017.org/GC#NumIndustries2012> ?c4." +
			"<http://course.geoinfo2017.org/GC#" + stateName + "> <http://course.geoinfo2017.org/GC#NumIndustries2013> ?c5." +
			"<http://course.geoinfo2017.org/GC#" + stateName + "> <http://course.geoinfo2017.org/GC#NumIndustries2014> ?c6.}";
		$.post("http://giv-oct2.uni-muenster.de:8890/sparql", {
				query: qry,
				output: 'json'
			},
			function (data) {
				createNUIDiagram(data);
			});
	}

	// Function for querying shape geometry and unemployment data from the triple store
	function getData() {
		let qry = "SELECT distinct ?unemp1 ?id ?geom ?unemp2006 ?unemp2007 ?unemp2008 ?unemp2009 ?unemp2010 ?unemp2011 ?unemp2012 ?unemp2013 ?unemp2014 ?unemp2015 ?unemp2016 " +
			"from <http://course.geoinfo2017.org/GC>" +
			"WHERE {" +
			"?id <http://www.opengis.net/ont/sf#asWKT> ?geom." +
			"?unemp1 <http://www.opengis.net/ont/sf#hasGeometry> ?id." +
			"?unemp1 <http://course.geoinfo2017.org/GC#hasUnemployment2006> ?unemp2006." +
			"?unemp1 <http://course.geoinfo2017.org/GC#hasUnemployment2007> ?unemp2007." +
			"?unemp1 <http://course.geoinfo2017.org/GC#hasUnemployment2008> ?unemp2008." +
			"?unemp1 <http://course.geoinfo2017.org/GC#hasUnemployment2009> ?unemp2009." +
			"?unemp1 <http://course.geoinfo2017.org/GC#hasUnemployment2010> ?unemp2010." +
			"?unemp1 <http://course.geoinfo2017.org/GC#hasUnemployment2011> ?unemp2011." +
			"?unemp1 <http://course.geoinfo2017.org/GC#hasUnemployment2012> ?unemp2012." +
			"?unemp1 <http://course.geoinfo2017.org/GC#hasUnemployment2013> ?unemp2013." +
			"?unemp1 <http://course.geoinfo2017.org/GC#hasUnemployment2014> ?unemp2014." +
			"?unemp1 <http://course.geoinfo2017.org/GC#hasUnemployment2015> ?unemp2015." +
			"?unemp1 <http://course.geoinfo2017.org/GC#hasUnemployment2016> ?unemp2016.}";
		$.post("http://giv-oct2.uni-muenster.de:8890/sparql", {
				query: qry,
				output: 'json'
			},
			function (data) {
				let geoPar = [];
				let ame = [];
				let wkt = [];
				let unemp2006 = [];
				let unemp2007 = [];
				let unemp2008 = [];
				let unemp2009 = [];
				let unemp2010 = [];
				let unemp2011 = [];
				let unemp2012 = [];
				let unemp2013 = [];
				let unemp2014 = [];
				let unemp2015 = [];
				let unemp2016 = [];
				for (let i in data.results.bindings) {
					// Processing the geometries to transform them into Well-known text (WKT)
					wkt[i] = data.results.bindings[i].geom.value;
					wkt[i] = wkt[i].replace(/\[/g, "(");
					wkt[i] = wkt[i].replace(/\]/g, ")");
					wkt[i] = wkt[i].replace(/\d(,)/g, " ");
					// Six geometries have additional brackets at the beginning and at the end so they are removed
					if ((data.results.bindings[i].id.value == "nodeID://b12101") ||
						(data.results.bindings[i].id.value == "nodeID://b12105") ||
						(data.results.bindings[i].id.value == "nodeID://b12106") ||
						(data.results.bindings[i].id.value == "nodeID://b12108") ||
						(data.results.bindings[i].id.value == "nodeID://b12109") ||
						(data.results.bindings[i].id.value == "nodeID://b12115")) {
						wkt[i] = wkt[i].replace("(", "");
						wkt[i] = wkt[i].substring(0, wkt[i].length - 1);
						wkt[i] = wkt[i].replace(/\)\),\(\(/g, "),(");
					}

					// Transform the geometries into WKT with Terraformer
					geoPar[i] = Terraformer.WKT.parse(wkt[i]);
					geoPar[i].coordinates = JSON.stringify(geoPar[i].coordinates);
					// Replacement of double squared brackets and comma with single squared brackets and comma to make it a valid geojson geometry
					geoPar[i].coordinates = geoPar[i].coordinates.replace(/\]\],\[\[/g, "],[");
					geoPar[i].coordinates = JSON.parse(geoPar[i].coordinates);
					// Getting the name of the federal states
					let sname = data.results.bindings[i].unemp1.value;
					let hashtag = sname.indexOf("#");
					sname = sname.substring(hashtag + 1, sname.length);
					ame[i] = sname;
					// Getting the unemployment numbers
					unemp2006[i] = parseInt(data.results.bindings[i].unemp2006.value);
					unemp2007[i] = parseInt(data.results.bindings[i].unemp2007.value);
					unemp2008[i] = parseInt(data.results.bindings[i].unemp2008.value);
					unemp2009[i] = parseInt(data.results.bindings[i].unemp2009.value);
					unemp2010[i] = parseInt(data.results.bindings[i].unemp2010.value);
					unemp2011[i] = parseInt(data.results.bindings[i].unemp2011.value);
					unemp2012[i] = parseInt(data.results.bindings[i].unemp2012.value);
					unemp2013[i] = parseInt(data.results.bindings[i].unemp2013.value);
					unemp2014[i] = parseInt(data.results.bindings[i].unemp2014.value);
					unemp2015[i] = parseInt(data.results.bindings[i].unemp2015.value);
					unemp2016[i] = parseInt(data.results.bindings[i].unemp2016.value);
				}
				// If geojson layer already exists, remove it
				if (geojson) mymap.removeLayer(geojson);
				// Creating one geojson featurecollection
				let geoJsonFeatureCollection;
				geoJsonFeatureCollection = {
					"type": "FeatureCollection",
					"features": []
				};

				// Creating features for each state
				for (let t in wkt) {
					let gJ = {
						"type": "Feature",
						"id": "",
						"properties": {},
						"geometry": {}
					};

					gJ.geometry = geoPar[t];
					gJ.properties.unemp2006 = unemp2006[t];
					gJ.properties.unemp2007 = unemp2007[t];
					gJ.properties.unemp2008 = unemp2008[t];
					gJ.properties.unemp2009 = unemp2009[t];
					gJ.properties.unemp2010 = unemp2010[t];
					gJ.properties.unemp2011 = unemp2011[t];
					gJ.properties.unemp2012 = unemp2012[t];
					gJ.properties.unemp2013 = unemp2013[t];
					gJ.properties.unemp2014 = unemp2014[t];
					gJ.properties.unemp2015 = unemp2015[t];
					gJ.properties.unemp2016 = unemp2016[t];

					gJ.properties.sname = ame[t];
					// Pushing each feature into the featurecollection
					geoJsonFeatureCollection.features.push(gJ);
				}
				// Add the featurecollection as a geojson layer to the map
				geojson = L.geoJson(geoJsonFeatureCollection, {
					onEachFeature: onEachFeature
				}).addTo(mymap);
				styler(2011);
			});
	}

	// Function for creating bar diagrams when a parameter is selected
	function createDiagrams() {
		if (document.getElementById("parameter").value == "gdp") {
			getGDP();
		}
		if (document.getElementById("parameter").value == "popdens") {
			getPopdens();
		}
		if (document.getElementById("parameter").value == "numofindustries") {
			getNumberOfIndustries();
		}
		if (document.getElementById("parameter").value == "riskofpoverty") {
			getROP();
		}
	}

	// Function for creating the GDP bar diagram
	function createGDPDiagram(data) {
		let gdpdata = [];

		gdpdata[0] = parseFloat(data.results.bindings[0].c.value);
		gdpdata[1] = parseFloat(data.results.bindings[0].c1.value);
		gdpdata[2] = parseFloat(data.results.bindings[0].c2.value);
		gdpdata[3] = parseFloat(data.results.bindings[0].c3.value);
		gdpdata[4] = parseFloat(data.results.bindings[0].c4.value);
		gdpdata[5] = parseFloat(data.results.bindings[0].c5.value);
		gdpdata[6] = parseFloat(data.results.bindings[0].c6.value);

		let chart = new CanvasJS.Chart("chartContainer", {
			animationEnabled: true,
			theme: "light1",
			title: {
				text: "GDP per Capita",
				fontFamily: "arial",
				fontSize: 17,
			},
			axisY: {
				title: "GDP in €"
			},
			data: [{
				type: "column",
				showInLegend: false,
				color: "#80b1d3",
				dataPoints: [{
						y: gdpdata[0],
						label: "2008"
					},
					{
						y: gdpdata[1],
						label: "2009"
					},
					{
						y: gdpdata[2],
						label: "2010"
					},
					{
						y: gdpdata[3],
						label: "2011"
					},
					{
						y: gdpdata[4],
						label: "2012"
					},
					{
						y: gdpdata[5],
						label: "2013"
					},
					{
						y: gdpdata[6],
						label: "2014"
					},
				]
			}]
		});
		chart.render();
	}

	// Function for creating the number of industries bar diagram
	function createNUIDiagram(data) {
		let noidata = [];

		noidata[0] = parseInt(data.results.bindings[0].c.value);
		noidata[1] = parseInt(data.results.bindings[0].c1.value);
		noidata[2] = parseInt(data.results.bindings[0].c2.value);
		noidata[3] = parseInt(data.results.bindings[0].c3.value);
		noidata[4] = parseInt(data.results.bindings[0].c4.value);
		noidata[5] = parseInt(data.results.bindings[0].c5.value);
		noidata[6] = parseInt(data.results.bindings[0].c6.value);

		let chart = new CanvasJS.Chart("chartContainer", {
			animationEnabled: true,
			theme: "light1",
			title: {
				text: "Number of Industries",
				fontFamily: "arial",
				fontSize: 17,
			},
			axisY: {
				title: "Quantity"
			},
			data: [{
				type: "column",
				color: "#bababa",
				showInLegend: false,
				dataPoints: [{
						y: noidata[0],
						label: "2008"
					},
					{
						y: noidata[1],
						label: "2009"
					},
					{
						y: noidata[2],
						label: "2010"
					},
					{
						y: noidata[3],
						label: "2011"
					},
					{
						y: noidata[4],
						label: "2012"
					},
					{
						y: noidata[5],
						label: "2013"
					},
					{
						y: noidata[6],
						label: "2014"
					},
				]
			}]
		});
		chart.render();
	}

	// Function for creating the risk of poverty bar diagram
	function createROPDiagram(data) {
		let ropdata = [];

		ropdata[0] = parseFloat(data.results.bindings[0].c.value);
		ropdata[1] = parseFloat(data.results.bindings[0].c1.value);
		ropdata[2] = parseFloat(data.results.bindings[0].c2.value);
		ropdata[3] = parseFloat(data.results.bindings[0].c3.value);
		ropdata[4] = parseFloat(data.results.bindings[0].c4.value);
		ropdata[5] = parseFloat(data.results.bindings[0].c5.value);
		ropdata[6] = parseFloat(data.results.bindings[0].c6.value);

		let chart = new CanvasJS.Chart("chartContainer", {
			animationEnabled: true,
			theme: "light1",
			title: {
				text: "Risk of Poverty",
				fontFamily: "arial",
				fontSize: 17,
			},
			axisY: {
				title: "Poverty rate in %"
			},
			data: [{
				type: "column",
				color: "#5e3c99",
				showInLegend: false,
				dataPoints: [{
						y: ropdata[0],
						label: "2008"
					},
					{
						y: ropdata[1],
						label: "2009"
					},
					{
						y: ropdata[2],
						label: "2010"
					},
					{
						y: ropdata[3],
						label: "2011"
					},
					{
						y: ropdata[4],
						label: "2012"
					},
					{
						y: ropdata[5],
						label: "2013"
					},
					{
						y: ropdata[6],
						label: "2014"
					},
				]
			}]
		});
		chart.render();
	}

	// Function for creating the population density bar diagram
	function createPDDiagram(data) {
		let pddata = [];

		pddata[0] = parseInt(data.results.bindings[0].c.value);
		pddata[1] = parseInt(data.results.bindings[0].c1.value);
		pddata[2] = parseInt(data.results.bindings[0].c2.value);
		pddata[3] = parseInt(data.results.bindings[0].c3.value);
		pddata[4] = parseInt(data.results.bindings[0].c4.value);
		pddata[5] = parseInt(data.results.bindings[0].c5.value);
		pddata[6] = parseInt(data.results.bindings[0].c6.value);

		let chart = new CanvasJS.Chart("chartContainer", {
			animationEnabled: true,
			theme: "light1",
			title: {
				text: "Population density",
				fontFamily: "arial",
				fontSize: 17,
			},
			axisY: {
				title: "Population density per km²",
			},
			data: [{
				type: "column",
				color: "#66c2a5",
				showInLegend: false,
				dataPoints: [{
						y: pddata[0],
						label: "2008"
					},
					{
						y: pddata[1],
						label: "2009"
					},
					{
						y: pddata[2],
						label: "2010"
					},
					{
						y: pddata[3],
						label: "2011"
					},
					{
						y: pddata[4],
						label: "2012"
					},
					{
						y: pddata[5],
						label: "2013"
					},
					{
						y: pddata[6],
						label: "2014"
					},
				]
			}]
		});
		chart.render();
	}

	getData();