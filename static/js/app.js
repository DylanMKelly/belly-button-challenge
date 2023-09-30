// Fetch url 

const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";

// Fetch json data to console log
d3.json(url).then(function(data) {
    console.log(data);
});

// Create home page/ dropdown menu selection
function home() {

    // Establish dropdown menu
    let dropdownmenu = d3.select("#selDataset");

    // Fetch json data
    d3.json(url).then((data) => {
    
        // Populate dropdown menu
        let names = data.names;
        
        names.forEach((name) => {
            dropdownmenu.append("option").text(name).property("value", name);
        });

        // Variable for starting point
        start_samp = names[0];
        
        // Call the functions for assignment (started with bubble as I wanted to work on it first)
        bubblechart(start_samp);
        barchart(start_samp);
        loaddatat(start_samp);
    });
}

home();

// Function for loading data

function loaddata(selection) {

    // Fetch json data
    d3.json(url).then((data) => {

        // Metadata variable
        let metadata = data.metadata;

        // Filter for results to connect with ID
        let results = metadata.filter((sample) => sample.id == selection);

        // Starting point
        let start_samp = results[0];

        // Select the panel with the sample-metadata id and clear any existing metadata
        let demographic = d3.select("#sample-metadata").html("");

        // Add each key and value pair to the panel using an h5 element
        Object.entries(start_samp).forEach(([key, value]) => {
            console.log(data)
            demographic.append("h5").text(`${key}: ${value}`);
        });
    });
}

//Create Bubble Chart

function bubblechart(selection) {

    d3.json(url).then((data) => {

        // Variable for array of objects
        let sample_detail = data.samples;

        // Filter for results to connect with ID
        let results = sample_detail.filter((sample) => sample.id == selection);   

        // Variable for starting point
        let start_samp = results[0];

        // Setup trace
        let x_axis = start_samp.otu_ids;
        let y_axis = start_samp.sample_values;
        let text_label = start_samp.otu_labels;
        
        console.log(x_axis,y_axis,text_label);

    
        let trace = [{
            x: x_axis,
            y: y_axis,
            text: text_label,
            mode: "markers",
            marker: {
                size: y_axis,
                color: x_axis,
                colorscale: "Viridis"
            }
        }];

        // Layout setup
        let layout = {
            xaxis: {title: "OTU Bubble Chart"}
        };

        // Plot bubble chart
        Plotly.newPlot("bubble", trace, layout);
    });
}

// Create Barchart

function barchart(selection) {

    // Fetch json data
    d3.json(url).then((data) => {

        // Variable for array of objects
        let samples = data.samples;

        // Filter for results to connect with ID
        let results = samples.filter((sample) => sample.id == selection);    

        // Variable for starting point
        let start_samp = results[0];
        
        // Setup trace
        let trace = [{
            x: start_samp.sample_values.slice(0,10).reverse(),
            y: start_samp.otu_ids.slice(0,10).map((otu_id) => `OTU ${otu_id}`).reverse(),
            text: start_samp.otu_labels.slice(0,10).reverse(),
            type: "bar",
            orientation: "h"
        }];

        // Bar chart layout creation
        let layout = {
            title: "Top 10 OTUs"
        };

        // Plot chart
        Plotly.newPlot("bar", trace, layout);

    });
}

// OptionChanged 

function optionChanged(selection) {
    bubblechart(selection);
    barchart(selection);
    loaddata(selection);
}