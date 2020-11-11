// ------- samples.json format -------
// samples.json {
//     .names[
//         "ID#s in a list"
//     ],
//     .metadata{
//         .id: "ID #",
//         .ethnicity: "Patient Ethnicity",
//         .gender: "Patient Gender",
//         .age: "Patient Age in years.0",
//         .location: "Where data was collected..?",
//         .bbtype: "Bellybutton type:  Innie/Outie",
//         .wfreq: "Frequency washing belly button per ..?",
//         },
//     .samples{
//         .id: "ID #",
//         .otu_ids: ["List of bacterial ID#s corresponding in position to the sample_values"],
//         .sample_values: ["List of #CFUs? corresponding in position to the otu_ids"]
//         .otu_labels: ["List of ';' separated strings containing ..?"]
//     }
// }
// ---------- format END -------------

//Building dropdown.
dropdown = d3.select("#selDataset")

samples.names.forEach(function (entry) {
    dropdown.append("option")
        .text(entry)
})
//Chart Locations
var demographics = d3.select('#sample-metadata')
var hBarChart = d3.select('#bar')
var gaugeChart = d3.select('#gauge')

//Function to get the data from a particular ID
function getSamplesData() {
    var IdNum = dropdown.property("value")
    for (i = 0; i < samples.names.length; i++) {
        if (samples.names[i] === IdNum) {
            var ethnicity = samples.metadata[i].ethnicity;
            var gender = samples.metadata[i].gender;
            var age = samples.metadata[i].age;
            var location = samples.metadata[i].location;
            switch (samples.metadata[i].bbtype.toLowerCase()) {
                case 'i':
                    bbtype = "Innie"
                    break;
                case 'o':
                    bbtype = "Outie"
                    break;
                default:
                    bbtype = 'Weirdo'
            };
            var wfreq = samples.metadata[i].wfreq;
            var otu_ids = samples.samples[i].otu_ids;
            var sample_values = samples.samples[i].sample_values;
            var otu_labels = samples.samples[i].otu_labels;
            console.log(`
            id = ${IdNum}
            ethnicity = ${ethnicity}
            gender = ${gender}
            age = ${age}
            location = ${location}
            bbtype = ${bbtype}
            wfreq = ${wfreq}
            otu_ids = ${otu_ids}
            sample_values = ${sample_values}
            otu_labels = ${otu_labels}`)
            // Demographics:

            demographics.append('p').text(`ID: ${IdNum}`)
                .append('p').text(`Ethnicity: ${ethnicity}`)
                .append('p').text(`Gender: ${gender}`)
                .append('p').text(`Age: ${age}`)
                .append('p').text(`Location: ${location}`)
                .append('p').text(`Belly Button Type: ${bbtype}`)
                .append('p').text(`Wash Freqency: ${wfreq}`)
            // Horizontal Bar Chart:
            var barLayout = {
                title: {
                    text:
                        `Patient #${IdNum}`,
                    font: {
                        size: 28,
                        color: 'black'
                    }
                    
                }
            }
            bar_labels = otu_ids.map(function (entry) { return `OTU ${entry}` }).slice(0, 11)
            bar_values = sample_values.slice(0, 10)
            bar_text = otu_labels.slice(0, 10)
            var barTrace = {
                type: 'bar',
                x: bar_values,
                y: bar_labels,
                orientation: 'h',
                text: bar_text
            }
            Plotly.newPlot('bar', [barTrace], barLayout)
            // Bubble Chart:
            var bubbleLayout = {
                xaxis: {
                    title:
                        'OTU ID'
                    
                },
                title: {
                    text:
                    'Relative Bacteria Quantities',
                    font: {
                        size: 22,
                        color: 'black'
                    }

                }
            }
            var bubbleTrace = {
                x: otu_ids,
                y: sample_values,
                mode: 'markers',
                text: otu_labels,
                marker: {
                    size: sample_values,
                    color: otu_ids,
                    colorscale: 'Picnic'
                }
            }
            Plotly.newPlot('bubble', [bubbleTrace], bubbleLayout)
            // Gauge Chart
            var gaugeTrace = {
                domain: { x: [0, 1], y: [0, 1] },
                value: wfreq,
                title: { text: "Bellybutton Scrubs per Week" },
                type: "indicator",
                mode: "gauge+number",
                gauge: {
                    axis: { range: [null, 9] },
                    steps: [
                        { range: [0, 0.5], color: "brown" },
                      ],
                    bar: {color : 'Fuchsia'},
                }
            }
            Plotly.newPlot('gauge', [gaugeTrace])
            break;
        }
    };
}

//Function to build the charts from samples data

function buildCharts() {
    getSamplesData()
    // Demographics:
    // Horizontal Bar Chart:
    // Bubble Chart:
    // 
}

//Function to update the charts from samples data
function optionChanged() {
    demographics.selectAll('p').remove()
    getSamplesData()

}




//Populate Demographics

buildCharts()