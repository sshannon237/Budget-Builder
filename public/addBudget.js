function getValues() {
    let values = document.getElementsByClassName("expense");
    let total = 0;
    for (let i = 0; i < values.length; i++) {
        if (values[i].value != "") {
            total += parseInt(values[i].value);
        }
    }
    return total;
}

$(document).ready(() => {

    $("#income").change(() => {
        $("#availIncome").html($("#income").val() - getValues());
    })

    $("#housing").change(() => {
        $("#availIncome").html($("#income").val() - getValues());
    })

    $("#transportation").change(() => {
        $("#availIncome").html($("#income").val() - getValues());
    })

    $("#groceries").change(() => {
        $("#availIncome").html($("#income").val() - getValues());
    })

    $("#other_food").change(() => {
        $("#availIncome").html($("#income").val() - getValues());
    })

    $("#savings").change(() => {
        $("#availIncome").html($("#income").val() - getValues());
    })

    $("#other").change(() => {
        $("#availIncome").html($("#income").val() - getValues());
    })
});