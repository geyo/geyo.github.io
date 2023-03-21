//Use D3 Library to read in data from url
const bb_json = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";

//Initialize arrays used.
let person_id = [];

//Wrap code w/ "then" to execute after data is retrieved.
d3.json(bb_json).then((data) => {
    //JSON data structure: 
    //metadata, names, samples
        //metadata: id, ethnicity, gender, age, location, bbtype, wfreq
        //samples: id, otu_ids, sample_values, otu_labels

    //store sample data.
    samples = data.samples;
    metadata = data.metadata;
       
    //populate person_id array.
    for (i = 0; i < samples.length; i++){
        person_id.push(samples[i]["id"]);
    };

    //Grab dropdown in html
    let dropdown = d3.select("#selDataset");
    //Add each person's id as options in the dropdown.
    for (i = 0; i < person_id.length; i++){
        d3.select("#selDataset").append("option").text(person_id[i]);
    };

    //HORIZONTAL BAR CHART: TOP 10 OTUS PER PERSON
    // Function to generate horizontal bar chart of top 10 OTUs
    function create_bar (selected_id) {
        selected_id = d3.event.target.value; //capture selection
        //use selected option to look up the index w/n array.
        index = person_id.indexOf(selected_id);
        personData = samples[index]; //store person's sample data.

        //sort and slice top 10 OTUs
        //create an array of arrays: inner array = [index, otu_id, otu_labels, sample_value]
        let otusAndSample = personData.otu_ids.map((otu_id, idx) => 
            [idx, otu_id, personData.otu_labels[idx], personData.sample_values[idx]]);
        otusAndSample.sort((a,b) => b[3] - a[3]); //sort by ascending by sample_values
        sortedOtusAndSample = otusAndSample.slice(0,10); //grab top 10
        
        //prep data
        //prepare x-values (otu_ids)
        otuIdArray = sortedOtusAndSample.map((x) => `OTU: ${(x[1])}`); //make otu_id into string
        //prepare y-values (sample_values)
        sampleArray = sortedOtusAndSample.map((x) => x[3]);
        //prepare hovertext (otu_labels)
        hoverText = sortedOtusAndSample.map((x) => x[2]);
        
        //construct graph from barData and layout
        let trace1 = {
            x: sampleArray.reverse(), //reverse so top bar is the biggest bar
            y: otuIdArray.reverse(),
            orientation: 'h',
            type: "bar",
            hovertext: hoverText
        };
        let layout = {
            title: `Top Ten OTUs from ID ${selected_id}`,
            xaxis: {title: 'Size of Sample'},
        };
        Plotly.newPlot("bar", [trace1], layout);
        
        //testing
        console.log("ID selected: " + selected_id); //log selected ID
        console.log("Number of datapoints for id: " + otusAndSample.length);
        //console.log(index);
        //console.log(personData);
        //console.log(otusAndSample);
        //console.log(xValues);
    };
    


    // BUBBLE BAR CHART 
    // Create a bubble chart that displays each sample.
    // Use otu_ids for the x values.
    // Use sample_values for the y values.
    // Use sample_values for the marker size.
    // Use otu_ids for the marker colors.
    // Use otu_labels for the text values.
    function create_bubble (selected_id) {
        selected_id = d3.event.target.value; //capture selection
        //use selected option to look up the index w/n array.
        index = person_id.indexOf(selected_id);
        personData = samples[index]; //store person's sample data.

        //create an array of arrays: inner array = [index, otu_id, otu_labels, sample_value]
        let otusAndSample = personData.otu_ids.map((otu_id, idx) => 
            [idx, otu_id, personData.otu_labels[idx], personData.sample_values[idx]]);
        sortedOtusAndSample = otusAndSample.sort((a,b) => b[3] - a[3]); //sort by ascending by sample_values
        
        //prep data
        //prepare x-values (otu_ids)
        otuIdArray = sortedOtusAndSample.map((x) => x[1]); 
        //prepare y-values (sample_values)
        sampleArray = sortedOtusAndSample.map((x) => x[3]);
        //prepare text values (otu_labels)
        hoverText = sortedOtusAndSample.map((x) => x[2]);
        
        //construct graph from data and layout
        let trace1 = {
            x: otuIdArray, //otu_ids for x
            y: sampleArray, //sample_values for y
            mode: "markers",
            marker: {
                size: sampleArray, //sample_values for marker size
                color: otuIdArray //otu_ids for colors
            }, 
            text: hoverText //otu_labels for text values
        };
        let layout = {
            title: `Sample Sizes from ID ${selected_id}`,
            //xaxis: {title: 'Size of Sample'},
        };
        Plotly.newPlot("bubble", [trace1], layout);
        
        //testing
        console.log(`bubble sizes: ${sampleArray}`);
    };

    // SAMPLE METADATA (DEMOGRAPHICS)
    // Function to populate metadata
    function populateMetadata (selected_id) {
        selected_id = d3.event.target.value; //capture dropdown selection
        index = person_id.indexOf(selected_id); //use selected option to look up the index w/n array.
        personDemo = metadata[index]; //lookup demographic data w/ index. 
        
        //use '.html' to an unordered list to sample-metadata div. 
        d3.select("#sample-metadata")
            .html(`<p><b>id</b>: ${personDemo.id} <br>
                <b>ethnicity</b>: ${personDemo.ethnicity} <br>
                <b>gender</b>: ${personDemo.gender} <br>
                <b>age</b>: ${personDemo.age} <br>
                <b>location</b>: ${personDemo.location} <br>
                <b>bbtype</b>: ${personDemo.bbtype} <br>
                <b>wfreq</b>: ${personDemo.wfreq}</p>`);
        

                //    d3.select("#sample-metadata")
                //    .html(`<ul style="list-style-type: none;"> 
                //                <li>id: ${personDemo.id}</li>
                //                <li>ethnicity: ${personDemo.ethnicity}</li>
                //                <li>gender: ${personDemo.gender}</li>
                //                <li>age: ${personDemo.age}</li>
                //                <li>location: ${personDemo.location}</li>
                //                <li>bbtype: ${personDemo.bbtype}</li>
                //                <li>wfreq: ${personDemo.wfreq}</li>           
                //           </ul>`);
        //testing
        console.log(personDemo);
    };

    // Display each key-value pair from the metadata JSON object somewhere on the page.
        //ADD CODE HERE OR UPDATE ABOVE
    
    
    //GAUGE FUNCTION
    function create_gauge (selected_id) {
        selected_id = d3.event.target.value; //capture dropdown selection
        index = person_id.indexOf(selected_id); //use selected option to look up the index w/n array.
        personDemo = metadata[index]; //lookup demographic data w/ index. 
        
        //construct gauge from data and layout
        let trace1 = {
            domain: {x: [0,1], y: [0,1]},
            value: personDemo.wfreq,
            type: "indicator",
            mode: "gauge+number",
            gauge: {
                axis: {
                    range:[0,10],
                    dtick: 2
                },
                steps: [
                    {range: [0,2], color: "lightgray"},
                    {range: [2,4], color: "white"},
                    {range: [4,6], color: "lightgray"},
                    {range: [6,8], color: "white"},
                    {range: [8,10], color: "lightgray"},
                ]

            }
        };
        let layout = {
            title: `Belly Button Wash Frequency from ID ${selected_id}`,
        };
        Plotly.newPlot("gauge", [trace1], layout);

    };

    // Update all the plots when a new sample is selected. 
    function allCharts(){
        create_bar();
        populateMetadata();
        create_bubble();
        create_gauge();
    };

    dropdown.on("change", allCharts);


    // Deploy your app to a free static page hosting service, such as GitHub Pages. Submit the links to your deployment and your GitHub repo. Ensure that your repository has regular commits and a thorough README.md file

}); //close wrapped promise

