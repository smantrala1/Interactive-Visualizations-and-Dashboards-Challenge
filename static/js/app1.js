/*Use the D3 library to read in samples.json.*/
// Initializes the page with a default plot
function init() {
  //pic value from dropdown
  var dropdownval = d3.select("#selDataset");

  // read the data 
  d3.json("./samples.json").then((data)=> {
      //console.log(data)

      // get the id data to the dropdwown menu
      data.names.forEach(function(name) {
        dropdownval.append("option").text(name).property("value");
      });
     // console.log(data.names[0]);
      // call the functions to display the data and the plots to the page
      buildPlot(data.names[0]);
      //getInfo(data.names[0]);
  });

  function buildPlot(id){
    d3.json("./samples.json").then(function(data) {
        
        // filter by id
        var id_data = data.samples.filter(s => s.id.toString() === id)[0];
        
        console.log(id_data);
    
        // Top 10 OTU IDs
        var top_OTU_IDs = (id_data.otu_ids.slice(0, 10)).reverse();
        console.log(`OTU IDS: ${top_OTU_IDs}`);
    
        // Top 10 OTU values
        var top_OTU_Values= (id_data.sample_values.slice(0, 10));
        console.log(`OTU values: ${top_OTU_Values}`);
        
        // Top 10 OTU labels
        var top_otu_labels = top_OTU_Values.map(d => "OTU " + d);
        console.log(`OTU labels: ${top_otu_labels}`);
    
      
        // get the top 10 labels for the plot
        var labels = id_data.otu_labels.slice(0, 10);
        console.log(`labels: ${labels}`);
    
    
            
         // create trace variable for the plot
            var trace = {
                x: top_OTU_Values,
                y: top_otu_labels,
                text: top_otu_labels,
                marker: {
                  color: 'rgb(142,124,195)'},
                type:"bar",
                orientation: "h",
            };
      
            // create data variable
            var data = [trace];
            console.log(trace);
            // create layout variable to set plots layout
            var layout = {
                title: "Top 10 OTU",
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
            Plotly.newPlot("bar", data, layout);
      
            //console.log(`ID: ${samples.otu_ids}`)
    });
    }

// This function is called when a dropdown menu item is selected
function updatePlotly() {
  // Use D3 to select the dropdown menu
  var dropdownMenu = d3.select("#selDataset").node();
  // Assign the value of the dropdown menu option to a variable
  //var dataset = dropdownMenu.property("value");
  var dataset = dropdownMenu.value;

  // Initialize x and y arrays
  var x = [];
  var y = [];

  if (dataset == 'dataset1') {
    x = [1, 2, 3, 4, 5];
    y = [1, 2, 4, 8, 16];
  }

  if (dataset == 'dataset2') {
    x = [10, 20, 30, 40, 50];
    y = [1, 10, 100, 1000, 10000];  
  }

  if (dataset == 'dataset3'){
    x = [5, 10, 15, 20, 30];
    y = [10, 20, 40, 80, 160];
  }

  // Note the extra brackets around 'x' and 'y'
  Plotly.restyle("plot", "x", [x]);
  Plotly.restyle("plot", "y", [y]);
}

// Call updatePlotly() when a change takes place to the DOM
d3.select("#selDataset").on("change", updatePlotly);

init();
}

