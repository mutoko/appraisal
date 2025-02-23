// Function to calculate weighted average
function calculateWeightedAverage() {
    // Get the values from the input fields
    var weight = parseFloat(document.getElementById('weight').value);
    var score = parseFloat(document.getElementById('score').value);

    // Calculate the weighted average
    var weightedAverage = (weight * score) / 100;

    // Display the result in the weighted average field
    document.getElementById('weightedAverage').value = weightedAverage.toFixed(2);
}
// Add event listeners to the input fields to trigger the calculation in real time
document.getElementById('weight').addEventListener('input', calculateWeightedAverage);
document.getElementById('score').addEventListener('input', calculateWeightedAverage);
// Trigger the calculation when the page loads to handle any pre-filled values
window.addEventListener('load', calculateWeightedAverage);