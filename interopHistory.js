
var sliderMax = 0;
var sliderMin = 99999999999999;
var newOption;
var sliderTicMarks = document.getElementById("ticMarks");
var newDate;
var dates = [];
var dateString;
for (i = 0; i < sets.length; i++) {
    dateString = sets[i]["date"].split("-");

    newDate = (new Date(dateString[0], dateString[1], dateString[2])).getTime();
    dates.push(newDate);

    newOption = document.createElement("option");
    newOption.setAttribute("value", newDate);
    sliderTicMarks.appendChild(newOption);
    sliderMin = (newDate < sliderMin) ? newDate : sliderMin;
    sliderMax = (newDate > sliderMax) ? newDate : sliderMax;
    firstDate = (i == 0) ? firstDate = newDate : null;
}
var slider = document.getElementById("dateSlider");
slider.value = dates[0];
slider.max = sliderMax;
slider.min = sliderMin;

var count = 0;

////INPUTS

// keyboard: space bar
document.body.onkeyup = function (e) {
    var k = e.keyCode;
    // go forward if it's spacebar or right arrow
    if (k == 32 || k == 39) {
        goForward();
    }
    else if (k == 37) {
        goBack();
    }
}

// previous button
$(function () {
    $('#prevDataSet').click(function () {
        goBack();
    });
});

// next button
$(function () {
    $('#nextDataSet').click(function () {
        goForward();
    });
});

// move back 1 dataset
function goBack() {
    count = count - 1;
    if (count < 0) count = sets.length - 1;
    updateContent();
}

// move forward 1 dataset
function goForward() {
    count = count + 1;
    if (count > 0) count = count % sets.length;
    updateContent();
}

// call to update everything on screen
function updateContent() {
    chart = buildVennDiagram();
    div.datum(sets[count].data).call(chart);
    //document.getElementById("annotationText").innerHTML = sets[count].text;
    document.getElementById("dateSlider").value = dates[count];
    document.getElementById("subTitle").innerHTML = sets[count].date;
}

// call this to create and resize the venn diagram
function buildVennDiagram() {
    return venn.VennDiagram()
                 .width(window.innerWidth * .5)
                 .height(window.innerHeight * .6);

}

// Venn Diagram Stuff
var chart = buildVennDiagram();

var div = d3.select("#venn");

// initialize
updateContent();

window.addEventListener("resize", updateContent);

// Tooltip to show section counts
var tooltip = d3.select("body").append("div")
    .attr("class", "venntooltip");

div.selectAll("path")
    .style("stroke-opacity", 0)
    .style("stroke", "#fff")
    .style("stroke-width", 0)

div.selectAll("g")
    .on("mouseover", function (d, i) {
        // sort all the areas relative to the current item
        venn.sortAreas(div, d);

        // Display a tooltip with the current size
        tooltip.transition().duration(400).style("opacity", .9);
        tooltip.text(d.size + " users");

        // highlight the current path
        var selection = d3.select(this).transition("tooltip").duration(400);
        selection.select("path")
            .style("stroke-width", 3)
            .style("fill-opacity", d.sets.length == 1 ? .4 : .1)
            .style("stroke-opacity", 1);
    })

    .on("mousemove", function () {
        tooltip.style("left", (d3.event.pageX) + "px")
               .style("top", (d3.event.pageY - 28) + "px");
    })

    .on("mouseout", function (d, i) {
        tooltip.transition().duration(400).style("opacity", 0);
        var selection = d3.select(this).transition("tooltip").duration(400);
        selection.select("path")
            .style("stroke-width", 0)
            .style("fill-opacity", d.sets.length == 1 ? .25 : .0)
            .style("stroke-opacity", 0);
    });
