
function getPlot(id) {
  //1. Use the D3 library to read in samples.json.
  d3.json("samples.json").then((data)=> {
      
      /*2. Create a horizontal bar chart with a dropdown menu to display the top 10 OTUs found in that individual.
          -Use sample_values as the values for the bar chart.
          -Use otu_ids as the labels for the bar chart.
          -Use otu_labels as the hovertext for the chart.
      */
      
      // Sample data per ID
      var ID_samples = data.samples.filter(samples => samples.id.toString() === id)[0];
      console.log(ID_samples);

      // sample values, again pick 10 only
      var id_samplevalues = ID_samples.sample_values.slice(0, 10).reverse();

      // otu ids
      var id_otuids = (ID_samples.otu_ids.slice(0, 10)).reverse();
      
      // format otu ids
      var new_otuids = id_otuids.map(d => "OTU " + d)

      // also pull the labels
      var labels = ID_samples.otu_labels.slice(0, 10);

      // create trace variable for the plot
      var bartrace = {
          x: id_samplevalues,
          y: new_otuids,
          text: labels,
          marker: {
            color: 'rgb(255, 153, 153)'},
          type:"bar",
          orientation: "h",
      };

      // create data variable
      var bardata = [bartrace];
      var title_text = "Top 10 OTU Data for subject:" + id;
      
      // bar layout
      var bar_layout = {
          title: title_text,
          yaxis:{
              tickmode:"linear",
          },
          margin: {
              l: 100,
              r: 100,
              t: 100,
              b: 30
          }
      };

      // create the bar plot
      Plotly.newPlot("bar", bardata, bar_layout);
      //end bar

    
      
  /*
  3.Create a bubble chart that displays each sample.
    Use otu_ids for the x values.
    Use sample_values for the y values.
    Use sample_values for the marker size.
    Use otu_ids for the marker colors.
    Use otu_labels for the text values.
  */
      //bubble trace - get all data not just 10. 
      var bubbletrace = {
          x: ID_samples.otu_ids,
          y: ID_samples.sample_values,
          mode: "markers",
          marker: {
              size: ID_samples.sample_values,
              color: ID_samples.otu_ids
          },
          text: ID_samples.otu_labels

      };

      // bubble plot layout
      var bubble_layout = {
          title:  "Data for subject:" + id,
          xaxis:{title: "OTU IDs"},
          yaxis:{title: "sample values"},
          height: 600,
          width: 1000
      };

      // creating data variable 
      var bubble_data = [bubbletrace];

      // create the bubble plot
      Plotly.newPlot("bubble", bubble_data, bubble_layout); 
      //end - bubble

      /*4. Display the sample metadata, i.e., an individual's demographic information.
      5. Display each key-value pair from the metadata JSON object somewhere on the page.*/
      var metadata = data.metadata;
      //console.log(metadata)

      // get metadata based on the id
      var id_metadata = metadata.filter(meta => meta.id.toString() === id)[0];

      // select demographic panel to put data
      var demographicInfo = d3.select("#sample-metadata");
      
      // empty the demographic info panel each time before getting new id info
      demographicInfo.html("");

      // grab the necessary demographic data data for the id and append the info to the panel
      Object.entries(id_metadata).forEach((key) => {   
              demographicInfo.append("h5").text(key[0] + ":" + key[1] + "\n");    });
        // end info
              
      
      
        // The guage chart

      var wfreq = data.metadata.map(d => d.wfreq);
      console.log(`Washing Freq: ${wfreq}`);
      var data_g = [
        {
        domain: { x: [0, 1], y: [0, 1] },
        value: parseFloat(wfreq),
        title: { text: `Weekly Washing Frequency ` },
        type: "indicator",
        
        mode: "gauge+number",
        gauge: { axis: { range: [null, 9] },
        //shape
                 steps: [
                  { range: [0, 1], color: 'rgb(255, 100, 0)' },
                  { range: [1, 2], color: 'rgb(255, 100, 40)' },
                  { range: [2, 3], color: 'rgb(255, 120, 40)' },
                  { range: [3, 4], color: 'rgb(255, 120, 80)' },
                  { range: [4, 5], color: 'rgb(255, 140, 80)' },
                  { range: [5, 6], color: 'rgb(255, 140, 120)' },
                  { range: [6, 7], color: 'rgb(255, 160, 120)' },
                  { range: [7, 8], color: 'rgb(255, 160, 140)' },
                  { range: [8, 9], color: 'rgb(255, 180, 140)' },
                ]}
            
        }
      ];
      var layout_g = { 
          width: 500, 
          height: 500, 
          margin: { t: 20, b: 40, l:100, r:100 } ,
         // showarrow:'true'
          
        };
      



    Plotly.newPlot("gauge", data_g, layout_g);
    });

    
} 


// create the function for the change event
function updatedata(id) {
  getPlot(id);
}

// create the function for the initial data rendering
function init() {
  // select dropdown menu 
  var dropdown = d3.select("#selDataset");

  // read the data 
  d3.json("samples.json").then((data)=> {
      console.log(data)

      // get the id data to the dropdwown menu
      data.names.forEach(function(name) {
          dropdown.append("option").text(name).property("value");
      });

      // call the functions to display the data and the plots to the page
      getPlot(data.names[0]);
  });
}

init();