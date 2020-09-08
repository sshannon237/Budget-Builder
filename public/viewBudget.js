function getValues() {
    let values = document.getElementsByClassName("expense");
    let total = 0;
    for (let i = 0; i < values.length; i++) {
        total += parseInt(values[i].innerHTML);
    }
    return total;
}

$(document).ready(() => {
    $("#availIncome").html($("#income").html()-getValues());
});