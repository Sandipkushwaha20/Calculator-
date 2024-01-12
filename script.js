// we can take and provide the value to inputBox through display
let display = document.getElementById("inputBox");

let buttons = document.querySelectorAll("button");

// Convert all nodes into array
let buttonArray = Array.from(buttons);

//Variable Initialization Part
let arr = ["%", "/", "*", "-", "+", ".", "+/-"];
let nums = ["%", "/", "*", "-", "+"];
let nums1 = ["%" , "/" , "*" , "-", "+", ".", "1 ", "2", "3", "4", "5", "6", "7", "8", "9", "0", "="];
let flag = false;
let string = "";
let cnt = 0,
  cnt0 = 0; // cnt is used to count the no. of operators and cnt0 for zero
let cntPoint = 0; // cntPoint will store the count of .
let cntOther = 0; // cntOther for any other events

//Input part

//Detecting button press
// Apply a forEach loop to access array elements individualy
buttonArray.forEach((btn) => {
  btn.addEventListener("click", (e) => {
    //click sound for buttons
    let crash = new Audio("Click.wav");
    crash.play();

    let buttonInnerHTML = e.target.innerHTML;

    //Error handling : 9/00000
    if (buttonInnerHTML == "0" && cntOther == 0) cnt0++, (cntOther = 0);
    //Error handling: --- or ... or ***  etc
    else if (
      string.length != 0 &&
      buttonInnerHTML == "-" &&
      string[string.length - 1] != "-" &&
      nums.includes(string[string.length - 1])
    )
      cnt = 1;
    //Error handling: ** or  %* or -- ++ etc
    else if (nums.includes(buttonInnerHTML)) cnt++, (cntOther = 0);
    //Error handling: ....
    else if (buttonInnerHTML == ".") cntPoint++;
    else (cntOther = 1), (cnt = 0), (cnt0 = 0), (cntPoint = 0);

    if (cnt < 2 && cnt0 < 2 && cntPoint < 2)
      performCalculation(buttonInnerHTML);
  });
});

// //Detecting key press
document.addEventListener("keypress", function (event) {
  if (nums1.includes(event.key)) {
    //click sound for buttons
    let crash = new Audio("Click.wav");
    crash.play();
    //Error handling : 9/00000
    if (event.key == "0" && cntOther == 0) cnt0++, (cntOther = 0);

    //Error handling : 9/00000
    if (event.key == "0" && cntOther == 0) cnt0++, (cntOther = 0);
    //Error handling: --- or ... or ***  etc
    else if (
      string.length != 0 &&
      event.key == "-" &&
      string[string.length - 1] != "-" &&
      nums.includes(string[string.length - 1])
    )
      cnt = 1;
    //Error handling: ** or  %* or -- ++ etc
    else if (nums.includes(event.key)) cnt++, (cntOther = 0);
    //Error handling: ....
    else if (event.key == ".") cntPoint++;
    else (cntOther = 1), (cnt = 0), (cnt0 = 0), (cntPoint = 0);

    if (cnt < 2 && cnt0 < 2 && cntPoint < 2) performCalculation(event.key);
  }
});

//Calculation Part
function performCalculation(key) {
  //Error handling : Cannot divide by zero85 => 85 or 5 + 4 = 9 =>98(press 8)
  if (
    string == "Cannot divide by zero" ||
    string == "Invalid Operation" ||
    string == "Invalid Calculation" ||
    (!nums.includes(key) && flag == true && key != "+/-")
  )
    (string = ""), (flag = false);

  //Error handling : %0(error) =>0%0(currect)
  if (string.length == 0 && arr.includes(key)) string = "0";

  //Error handling : +. or *.
  if (key == "." && nums.includes(string[string.length - 1])) string += "0";

  if (key == "AC") {
    string = "";
    display.value = string;
  }

  //Error handling : ====
  else if (string.length == 0 && key == "=") string = "";
  else if (key == "DEL") {
    string = string.slice(0, -1); //Or string = string.substring(0 , string.length - 1);
    display.value = string;
  } else if (key == "+/-") {
    string = -string;
    if (!isValid(string)) {
      // alert('Error: You are doing wrong Calculation');
      string = "Invalid Operation";
    }

    display.value = string;
  } else if (key == "=") {
    // eval() convert stirng to code then, it calculate
    // Error handling : 9/0 or 4/00 or 8%0 or 3%00
    if (isValid(string)) {
      let a = string; // Error handling : 8== then +(any key) result 0+(wrong) =>8+(currect)
      string = calculateExpression(string); // string = eval(string); can be use but could be dangerous

      if (string == "Infinity" || string == "-Infinity") {
        // alert(
        //   'Error: Your operation is leads to "division by zero"'
        // );
        string = "Cannot divide by zero";
      }
      if (a != string) flag = true;
      display.value = string;
    } else {
      // alert('Error : You entered a invalid number');
      string = "Invalid Calculation";
      display.value = string;
      flag = true;
    }
  } else {
    string += key;
    display.value = string;
    flag = false;
  }
}

//cheking validation of a number
function isValid(expression) {
  try {
    // Use eval to evaluate the expression
    const result = eval(expression);

    // Check if the result is a valid number
    return typeof result === "number" && !isNaN(result);
  } catch (error) {
    // Handle any errors during evaluation
    return false;
  }
}

// Using Function constructor as an alternative to eval ot calculate the values
function calculateExpression(expression) {
  try {
    // Creating a new function with the provided expression
    const calculate = new Function("return " + expression);

    // Executing the function to calculate the result
    const result = calculate();

    return result;
  } catch (error) {
    // Handling any potential errors
    console.error("Error:", error.message);
  }
}
