function init() {

  var selector = d3.select("#selDataset");


  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

 
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}


init();

function optionChanged(newSample) {
  buildMetadata(newSample);
  buildCharts(newSample);
  
}


function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;

    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];

    var PANEL = d3.select("#sample-metadata");

 
    PANEL.html("");

    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

function buildCharts(sample) {

  d3.json("samples.json").then((data) => {
    var samples = data.samples;
    var resultArray = samples.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];

    var otuIds = result.otu_ids;

    var otuLabels = result.otu_labels;
    var otuLabelsSorted = otuLabels.slice(0,10).reverse();

    var sampleValues = result.sample_values;
    var sampleValuesSorted = sampleValues.slice(0,10).reverse();
    
    console.log("----------");
    console.log(result.id);

    var yticks = otuIds.map(IDname => "OTU " + IDname).slice(0, 10).reverse();

    var barData = [{
      x: sampleValuesSorted,
      y: yticks,
      type: "bar", 
      text: otuLabelsSorted,
      orientation: "h"
    }];

    var barLayout = {
      title: "Top 10 Cultures Found",
      paper_bgcolor: "#6c757d",
      plot_bgcolor: "#6c757d",
      font: {color: "#f8f9fa"}
    };
 
    Plotly.newPlot("bar", barData, barLayout)
    

    var bubbleData = [{
      x: otuIds,
      y: sampleValues, 
      text: otuLabels,
      mode: "markers",
      marker: {
        size: sampleValues,
        color: otuIds,
        colorscale: "hsv"
      }
    }];


    var bubbleLayout = {
      title: "Bacteria Cultures per Sample", 
      xaxis: {
        title: "OTU ID"
      },
      hovermode: "closest",
      autosize: true,
      paper_bgcolor: "#6c757d",
      plot_bgcolor: "#6c757d",
      font: {color: "#f8f9fa"}
    };


    Plotly.newPlot("bubble", bubbleData, bubbleLayout); 

    //filtering the metadata
    var metadata = data.metadata.filter(sampleObj => sampleObj.id == sample)[0];
    console.log(metadata);
    var washFreq = metadata.wfreq;
    console.log(washFreq);
    
    var gaugeData = [{
      value: washFreq,
      type: "indicator",
      mode: "gauge+number",
      title: {text: "<b> Belly Button Washing Frequency</b><br></br>Scrubs Per Week"},
      gauge: {
        axis: {range: [null, 10], dtick: "2"},
        bar: {color: "black"},
        steps:[
          {range: [0,2], color:"red"},
          {range: [2, 4], color: "orange"},
          {range: [4, 6], color: "yellow"},
          {range: [6, 8], color: "lightgreen"},
          {range: [8, 10], color: "green"}
        ],
        dtick: 2
      }
    }];
    
  
    var gaugeLayout = { 
     autosize: true,
     paper_bgcolor: "#6c757d",
      plot_bgcolor: "#6c757d",
      font: {color: "#f8f9fa"}
    };

  
    Plotly.newPlot("gauge", gaugeData, gaugeLayout);
   
  });
};