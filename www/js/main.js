      // Setting variables
      var geoJsonFeatureCollection;
      var stateName;
      var gJ;
      var geojson;
      var ame = [];
      var wkt = [];
      var geoPar = [];
      var unemp2006 = [];
      var unemp2007 = [];
      var unemp2008 = [];
      var unemp2009 = [];
      var unemp2010 = [];
      var unemp2011 = [];
      var unemp2012 = [];
      var unemp2013 = [];
      var unemp2014 = [];
      var unemp2015 = [];
      var unemp2016 = [];

      // Functionality for changing layer style (unemployment) according to selected year
      var slider = document.getElementById("sliderRange");
    	var output = document.getElementById("year");
    	output.innerHTML = slider.value;
    	slider.oninput = function() {
    	  output.innerHTML = this.value;
        if(slider.value == 2006){
          geojson.setStyle(style2006);
        } else if(slider.value == 2007){
          geojson.setStyle(style2007);
        }else if(slider.value == 2008){
          geojson.setStyle(style2008);
        } else if(slider.value == 2009){
          geojson.setStyle(style2009);
        } else if(slider.value == 2010){
          geojson.setStyle(style2010);
        } else if (slider.value == 2011){
          geojson.setStyle(style2011);
        } else if (slider.value == 2012){
          geojson.setStyle(style2012);
        } else if (slider.value == 2013){
          geojson.setStyle(style2013);
        } else if (slider.value == 2014){
          geojson.setStyle(style2014);
        } else if (slider.value == 2015){
          geojson.setStyle(style2015);
        } else if (slider.value == 2016){
          geojson.setStyle(style2016);
        }
    	}

  	  // Creating map and setting properties
      var mymap = L.map('mapid', {zoomControl:true, maxZoom: 12, minZoom: 5}).setView([51.5167, 9.9167], 5);
      mymap.zoomControl.setPosition('bottomleft');
      mymap.setMaxBounds([
        [40,-5],
        [60,25]
      ]);
      mymap.doubleClickZoom.disable();

      // Adding tile layer from OSM
      L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 14,
        attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a>, Contributor of state data: <a href="https://github.com/isellsoap">Francesco Schwarz</a>',
      }).addTo(mymap);

      // Setting layer styles for all the years
      function style2006(feature) {
        return {
          weight: 1,
          opacity: 1,
          color: "black",
          dashArray: '0',
          fillOpacity: 0.7,
          fillColor: getColor(feature.properties.unemp2006)
        };
      }
      function style2007(feature) {
        return {
          weight: 1,
          opacity: 1,
          color: "black",
          dashArray: '0',
          fillOpacity: 0.7,
          fillColor: getColor(feature.properties.unemp2007)
        };
      }
      function style2008(feature) {
        return {
          weight: 1,
          opacity: 1,
          color: "black",
          dashArray: '0',
          fillOpacity: 0.7,
          fillColor: getColor(feature.properties.unemp2008)
        };
      }
      function style2009(feature) {
        return {
          weight: 1,
          opacity: 1,
          color: "black",
          dashArray: '0',
          fillOpacity: 0.7,
          fillColor: getColor(feature.properties.unemp2009)
        };
      }
      function style2010(feature) {
        return {
          weight: 1,
          opacity: 1,
          color: "black",
          dashArray: '0',
          fillOpacity: 0.7,
          fillColor: getColor(feature.properties.unemp2010)
        };
      }
      function style2011(feature) {
        return {
          weight: 1,
          opacity: 1,
          color: "black",
          dashArray: '0',
          fillOpacity: 0.7,
          fillColor: getColor(feature.properties.unemp2011)
        };
      }
      function style2012(feature) {
        return {
          weight: 1,
          opacity: 1,
          color: "black",
          dashArray: '0',
          fillOpacity: 0.7,
          fillColor: getColor(feature.properties.unemp2012)
        };
      }
      function style2013(feature) {
        return {
          weight: 1,
          opacity: 1,
          color: "black",
          dashArray: '0',
          fillOpacity: 0.7,
          fillColor: getColor(feature.properties.unemp2013)
        };
      }
      function style2014(feature) {
        return {
          weight: 1,
          opacity: 1,
          color: "black",
          dashArray: '0',
          fillOpacity: 0.7,
          fillColor: getColor(feature.properties.unemp2014)
        };
      }
      function style2015(feature) {
        return {
          weight: 1,
          opacity: 1,
          color: "black",
          dashArray: '0',
          fillOpacity: 0.7,
          fillColor: getColor(feature.properties.unemp2015)
        };
      }
      function style2016(feature) {
        return {
          weight: 1,
          opacity: 1,
          color: "black",
          dashArray: '0',
          fillOpacity: 0.7,
          fillColor: getColor(feature.properties.unemp2016)
        };
      }

      // Function for returning color according to unemployment number
      function getColor(d) {
          return d > 325  ? '#800026' :
                 d > 275  ? '#BD0026' :
                 d > 225  ? '#E31A1C' :
                 d > 175  ? '#FC4E2A' :
                 d > 125  ? '#FD8D3C' :
                 d > 75   ? '#FEB24C' :
                 d > 25   ? '#FED976' :
                            'black';
      }

      // Adding legend to the map
      var legend = L.control({position: 'bottomright'});
      legend.onAdd = function (mymap) {
        var div = L.DomUtil.create('div', 'info legend'),
        grades = [25, 75, 125, 175, 225, 275, 325],
        labels = [];
        div.innerHTML = "Unemployed in <br> thousand <br>"
            for (var i = 0; i < grades.length; i++) {
                div.innerHTML +=
                    '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
                    grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
            }
            return div;
      };
      legend.addTo(mymap);

      // Function for highlighting shape borders by hovering over a state
      function highlightFeature(e) {
        var layer = e.target;
        layer.bringToFront();
        layer.setStyle({
            weight: 3,
            color: 'black',
        });
      }

      // Function for resetting the highlighting by moving the mouse out of the state
      function resetHighlight(e) {
        geojson.resetStyle(e.target);
        if(slider.value == 2006){
          geojson.setStyle(style2006);
        } else if(slider.value == 2007){
          geojson.setStyle(style2007);
        }else if(slider.value == 2008){
          geojson.setStyle(style2008);
        } else if(slider.value == 2009){
          geojson.setStyle(style2009);
        } else if(slider.value == 2010){
          geojson.setStyle(style2010);
        } else if (slider.value == 2011){
          geojson.setStyle(style2011);
        } else if (slider.value == 2012){
          geojson.setStyle(style2012);
        } else if (slider.value == 2013){
          geojson.setStyle(style2013);
        } else if (slider.value == 2014){
          geojson.setStyle(style2014);
        } else if (slider.value == 2015){
          geojson.setStyle(style2015);
        } else if (slider.value == 2016){
          geojson.setStyle(style2016);
        }
      }

      // Functionalities for the features of the layer
      function onEachFeature(feature, layer) {
        layer.on({
          mouseover: highlightFeature,
          mouseout: resetHighlight,
          click: function(e){
            stateName = feature.properties.sname;
            document.getElementById("getStateName").innerHTML = "Selected federal state:" + "<br/>" + stateName;
            createDiagrams();
            console.log(feature.properties);
          }
        });
        layer.on({
          dblclick: function(e){
            mymap.fitBounds(e.target.getBounds());
          }
        });
      }

      // Function for querying GDP data from the triple store
      function getGDP(){
        var qry = "select * from <http://course.geoinfo2017.org/GC> where { "+
          "<http://course.geoinfo2017.org/GC#" + stateName + "> <http://course.geoinfo2017.org/GC#hasGDP2008> ?c."+
          "<http://course.geoinfo2017.org/GC#" + stateName + "> <http://course.geoinfo2017.org/GC#hasGDP2009> ?c1."+
          "<http://course.geoinfo2017.org/GC#" + stateName + "> <http://course.geoinfo2017.org/GC#hasGDP2010> ?c2."+
          "<http://course.geoinfo2017.org/GC#" + stateName + "> <http://course.geoinfo2017.org/GC#hasGDP2011> ?c3."+
          "<http://course.geoinfo2017.org/GC#" + stateName + "> <http://course.geoinfo2017.org/GC#hasGDP2012> ?c4."+
          "<http://course.geoinfo2017.org/GC#" + stateName + "> <http://course.geoinfo2017.org/GC#hasGDP2013> ?c5."+
          "<http://course.geoinfo2017.org/GC#" + stateName + "> <http://course.geoinfo2017.org/GC#hasGDP2014> ?c6.}";
        $.post("http://giv-oct2.uni-muenster.de:8890/sparql", {
          query: qry,
          output: 'json'
        },
        function(data){
          createGDPDiagram(data);
        });
      }

      // Function for querying risk of poverty data from the triple store
      function getROP(){
        var qry = "select * from <http://course.geoinfo2017.org/GC> where { "+
          "<http://course.geoinfo2017.org/GC#" + stateName + "> <http://course.geoinfo2017.org/GC#hasPoverty2008> ?c."+
          "<http://course.geoinfo2017.org/GC#" + stateName + "> <http://course.geoinfo2017.org/GC#hasPoverty2009> ?c1."+
          "<http://course.geoinfo2017.org/GC#" + stateName + "> <http://course.geoinfo2017.org/GC#hasPoverty2010> ?c2."+
          "<http://course.geoinfo2017.org/GC#" + stateName + "> <http://course.geoinfo2017.org/GC#hasPoverty2011> ?c3."+
          "<http://course.geoinfo2017.org/GC#" + stateName + "> <http://course.geoinfo2017.org/GC#hasPoverty2012> ?c4."+
          "<http://course.geoinfo2017.org/GC#" + stateName + "> <http://course.geoinfo2017.org/GC#hasPoverty2013> ?c5."+
          "<http://course.geoinfo2017.org/GC#" + stateName + "> <http://course.geoinfo2017.org/GC#hasPoverty2014> ?c6.}";
        $.post("http://giv-oct2.uni-muenster.de:8890/sparql", {
          query: qry,
          output: 'json'
        },
        function(data){
          createROPDiagram(data);
        });
      }

      // Function for querying population density data from the triple store
      function getPopdens(){
        var qry = "select * from <http://course.geoinfo2017.org/GC> where { "+
          "<http://course.geoinfo2017.org/GC#" + stateName + "> <http://course.geoinfo2017.org/GC#hasPopulationDensity2008> ?c."+
          "<http://course.geoinfo2017.org/GC#" + stateName + "> <http://course.geoinfo2017.org/GC#hasPopulationDensity2009> ?c1."+
          "<http://course.geoinfo2017.org/GC#" + stateName + "> <http://course.geoinfo2017.org/GC#hasPopulationDensity2010> ?c2."+
          "<http://course.geoinfo2017.org/GC#" + stateName + "> <http://course.geoinfo2017.org/GC#hasPopulationDensity2011> ?c3."+
          "<http://course.geoinfo2017.org/GC#" + stateName + "> <http://course.geoinfo2017.org/GC#hasPopulationDensity2012> ?c4."+
          "<http://course.geoinfo2017.org/GC#" + stateName + "> <http://course.geoinfo2017.org/GC#hasPopulationDensity2013> ?c5."+
          "<http://course.geoinfo2017.org/GC#" + stateName + "> <http://course.geoinfo2017.org/GC#hasPopulationDensity2014> ?c6.}";
        $.post("http://giv-oct2.uni-muenster.de:8890/sparql", {
          query: qry,
          output: 'json'
        },
        function(data){
          createPDDiagram(data);
        });
      }

      // Function for querying number of industry data from the triple store
      function getNumberOfIndustries(){
        var qry = "select * from <http://course.geoinfo2017.org/GC> where {"+
          "<http://course.geoinfo2017.org/GC#" + stateName + "> <http://course.geoinfo2017.org/GC#NumIndustries2008> ?c."+
          "<http://course.geoinfo2017.org/GC#" + stateName + "> <http://course.geoinfo2017.org/GC#NumIndustries2009> ?c1."+
          "<http://course.geoinfo2017.org/GC#" + stateName + "> <http://course.geoinfo2017.org/GC#NumIndustries2010> ?c2."+
          "<http://course.geoinfo2017.org/GC#" + stateName + "> <http://course.geoinfo2017.org/GC#NumIndustries2011> ?c3."+
          "<http://course.geoinfo2017.org/GC#" + stateName + "> <http://course.geoinfo2017.org/GC#NumIndustries2012> ?c4."+
          "<http://course.geoinfo2017.org/GC#" + stateName + "> <http://course.geoinfo2017.org/GC#NumIndustries2013> ?c5."+
          "<http://course.geoinfo2017.org/GC#" + stateName + "> <http://course.geoinfo2017.org/GC#NumIndustries2014> ?c6.}";
        $.post("http://giv-oct2.uni-muenster.de:8890/sparql", {
          query: qry,
          output: 'json'
        },
        function(data){
          createNUIDiagram(data);
        });
      }

      // Function for querying shape geometry and unemployment data from the triple store
      function getData(){
        var qry = "SELECT distinct ?unemp1 ?id ?geom ?unemp2006 ?unemp2007 ?unemp2008 ?unemp2009 ?unemp2010 ?unemp2011 ?unemp2012 ?unemp2013 ?unemp2014 ?unemp2015 ?unemp2016 "+
          "from <http://course.geoinfo2017.org/GC>"+
          "WHERE {"+
          "?id <http://www.opengis.net/ont/sf#asWKT> ?geom."+
          "?unemp1 <http://www.opengis.net/ont/sf#hasGeometry> ?id."+
          "?unemp1 <http://course.geoinfo2017.org/GC#hasUnemployment2006> ?unemp2006."+
          "?unemp1 <http://course.geoinfo2017.org/GC#hasUnemployment2007> ?unemp2007."+
          "?unemp1 <http://course.geoinfo2017.org/GC#hasUnemployment2008> ?unemp2008."+
          "?unemp1 <http://course.geoinfo2017.org/GC#hasUnemployment2009> ?unemp2009."+
          "?unemp1 <http://course.geoinfo2017.org/GC#hasUnemployment2010> ?unemp2010."+
          "?unemp1 <http://course.geoinfo2017.org/GC#hasUnemployment2011> ?unemp2011."+
          "?unemp1 <http://course.geoinfo2017.org/GC#hasUnemployment2012> ?unemp2012."+
          "?unemp1 <http://course.geoinfo2017.org/GC#hasUnemployment2013> ?unemp2013."+
          "?unemp1 <http://course.geoinfo2017.org/GC#hasUnemployment2014> ?unemp2014."+
          "?unemp1 <http://course.geoinfo2017.org/GC#hasUnemployment2015> ?unemp2015."+
          "?unemp1 <http://course.geoinfo2017.org/GC#hasUnemployment2016> ?unemp2016.}";
        $.post("http://giv-oct2.uni-muenster.de:8890/sparql", {
          query: qry,
          output: 'json'
        },
        function(data){
          for (var i in data.results.bindings){
            wkt[i] = data.results.bindings[i].geom.value;
            wkt[i] = wkt[i].replace(/\[/g, "(");
            wkt[i] = wkt[i].replace(/\]/g, ")");
            wkt[i] = wkt[i].replace(/\d(,)/g," ");
            if((data.results.bindings[i].id.value == "nodeID://b12101")
             ||(data.results.bindings[i].id.value == "nodeID://b12105")
             ||(data.results.bindings[i].id.value == "nodeID://b12106")
             ||(data.results.bindings[i].id.value == "nodeID://b12108")
             ||(data.results.bindings[i].id.value == "nodeID://b12109")
             ||(data.results.bindings[i].id.value == "nodeID://b12115")){
              wkt[i] = wkt[i].replace("(", "");
              wkt[i] = wkt[i].substring(0, wkt[i].length-1);
              wkt[i] = wkt[i].replace(/\)\),\(\(/g, "),(");
            }

            geoPar[i] = Terraformer.WKT.parse(wkt[i]);
            geoPar[i].coordinates = JSON.stringify(geoPar[i].coordinates);
            geoPar[i].coordinates = geoPar[i].coordinates.replace(/\]\],\[\[/g,"],[");
            geoPar[i].coordinates = JSON.parse(geoPar[i].coordinates);

            var sname = data.results.bindings[i].unemp1.value;
            var hashtag = sname.indexOf("#");
            sname = sname.substring(hashtag+1, sname.length);
            ame[i] = sname;
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
          if (geojson) mymap.removeLayer(geojson);

          geoJsonFeatureCollection = {
            "type": "FeatureCollection",
            "features": []
          };

          for (var t in wkt){
            gJ = {
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

            geoJsonFeatureCollection.features.push(gJ);
          }

          geojson = L.geoJson(geoJsonFeatureCollection, {
            style: style2011,
            onEachFeature: onEachFeature
          }).addTo(mymap);
        });
      }

      // Function for creating bar diagrams
      function createDiagrams(){
        if(document.getElementById("parameter").value == "gdp"){
          getGDP();
        }
        if(document.getElementById("parameter").value == "popdens"){
          getPopdens();
        }
        if(document.getElementById("parameter").value == "numofindustries"){
          getNumberOfIndustries();
        }
        if(document.getElementById("parameter").value == "riskofpoverty"){
          getROP();
        }
      }

      // Function for creating the GDP bar diagram
      function createGDPDiagram(data){
        var gdpdata = [];
        var gdpyear = [];

        gdpdata[0] = parseFloat(data.results.bindings[0].c.value);
        gdpdata[1] = parseFloat(data.results.bindings[0].c1.value);
        gdpdata[2] = parseFloat(data.results.bindings[0].c2.value);
        gdpdata[3] = parseFloat(data.results.bindings[0].c3.value);
        gdpdata[4] = parseFloat(data.results.bindings[0].c4.value);
        gdpdata[5] = parseFloat(data.results.bindings[0].c5.value);
        gdpdata[6] = parseFloat(data.results.bindings[0].c6.value);

        var chart = new CanvasJS.Chart("chartContainer", {
        	animationEnabled: true,
        	theme: "light1",
        	title:{
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
        		dataPoints: [
              { y: gdpdata[0],  label: "2008" },
              { y: gdpdata[1],  label: "2009" },
              { y: gdpdata[2],  label: "2010" },
              { y: gdpdata[3],  label: "2011" },
              { y: gdpdata[4],  label: "2012" },
              { y: gdpdata[5],  label: "2013" },
              { y: gdpdata[6],  label: "2014" },
        		]
        	}]
        });
        chart.render();
      }

      // Function for creating the number of industries bar diagram
      function createNUIDiagram(data){
        var noidata = [];
        var gdpyear = [];

        noidata[0] = parseInt(data.results.bindings[0].c.value);
        noidata[1] = parseInt(data.results.bindings[0].c1.value);
        noidata[2] = parseInt(data.results.bindings[0].c2.value);
        noidata[3] = parseInt(data.results.bindings[0].c3.value);
        noidata[4] = parseInt(data.results.bindings[0].c4.value);
        noidata[5] = parseInt(data.results.bindings[0].c5.value);
        noidata[6] = parseInt(data.results.bindings[0].c6.value);

        var chart = new CanvasJS.Chart("chartContainer", {
          animationEnabled: true,
          theme: "light1",
          title:{
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
            dataPoints: [
              { y: noidata[0],  label: "2008" },
              { y: noidata[1],  label: "2009" },
              { y: noidata[2],  label: "2010" },
              { y: noidata[3],  label: "2011" },
              { y: noidata[4],  label: "2012" },
              { y: noidata[5],  label: "2013" },
              { y: noidata[6],  label: "2014" },
            ]
          }]
        });
      chart.render();
      }

      // Function for creating the risk of poverty bar diagram
      function createROPDiagram(data){
        var ropdata = [];
        var gdpyear = [];

        ropdata[0] = parseFloat(data.results.bindings[0].c.value);
        ropdata[1] = parseFloat(data.results.bindings[0].c1.value);
        ropdata[2] = parseFloat(data.results.bindings[0].c2.value);
        ropdata[3] = parseFloat(data.results.bindings[0].c3.value);
        ropdata[4] = parseFloat(data.results.bindings[0].c4.value);
        ropdata[5] = parseFloat(data.results.bindings[0].c5.value);
        ropdata[6] = parseFloat(data.results.bindings[0].c6.value);

        var chart = new CanvasJS.Chart("chartContainer", {
          animationEnabled: true,
          theme: "light1",
          title:{
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
            dataPoints: [
              { y: ropdata[0],  label: "2008" },
              { y: ropdata[1],  label: "2009" },
              { y: ropdata[2],  label: "2010" },
              { y: ropdata[3],  label: "2011" },
              { y: ropdata[4],  label: "2012" },
              { y: ropdata[5],  label: "2013" },
              { y: ropdata[6],  label: "2014" },
            ]
          }]
        });
      chart.render();
      }

      // Function for creating the population density bar diagram
      function createPDDiagram(data){
        var pddata = [];
        var gdpyear = [];

        pddata[0] = parseInt(data.results.bindings[0].c.value);
        pddata[1] = parseInt(data.results.bindings[0].c1.value);
        pddata[2] = parseInt(data.results.bindings[0].c2.value);
        pddata[3] = parseInt(data.results.bindings[0].c3.value);
        pddata[4] = parseInt(data.results.bindings[0].c4.value);
        pddata[5] = parseInt(data.results.bindings[0].c5.value);
        pddata[6] = parseInt(data.results.bindings[0].c6.value);

        var chart = new CanvasJS.Chart("chartContainer", {
          animationEnabled: true,
          theme: "light1",
          title:{
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
            dataPoints: [
              { y: pddata[0],  label: "2008" },
              { y: pddata[1],  label: "2009" },
              { y: pddata[2],  label: "2010" },
              { y: pddata[3],  label: "2011" },
              { y: pddata[4],  label: "2012" },
              { y: pddata[5],  label: "2013" },
              { y: pddata[6],  label: "2014" },
            ]
        }]
        });
        chart.render();
      }

      getData();
