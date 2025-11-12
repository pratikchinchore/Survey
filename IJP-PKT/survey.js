$(document).ready(function() {
    var currentStep = 1;
    var formSubmitted = false;
    // var tabSwitched = false;
    var timer; // Timer variable
    var questions; // Store loaded questions data

    // Load questions from JSON file
    $.getJSON("questions.json", function(data) {
        questions = data;
        generateQuestions();
    });
 
    // Prevent minimizing or tab switching
    $(window).on('blur', function() {
        if (currentStep === 2 && !formSubmitted && !tabSwitched) {
            Swal.fire({
                title: "Warning",
                text: "You are attempting to leave the page. Your survey responses will be automatically submitted.",
                icon: "warning",
                showCancelButton: false,
                confirmButtonText: "OK"
            }).then((result) => {
                if (result.isConfirmed) {
                    // Automatically submit the form data
                    $("#surveyForm").submit();
                    tabSwitched = true;
                }
            });
        }
    });

    $("#nextButton").click(function() {
        if (currentStep === 1) {
            var empId = $("input[name='emp_id']").val();

            var department = $("input[name='department']").val();

            // Perform any necessary validation before proceeding
            if (empId === "pratik" && department ==="pratik" ) {
                // Check if empId is already in the database
                Swal.fire({
                    title: 'Instructions',
                    html: "<ul style='text-align: left;font-size: 17px;line-height:30px;'><li>The Quiz consist of 15 Multiple choice questios .</li><li>You have total 10 minutes to complete the Quiz.</li><li>The quiz would be automatically submitted if you switch the window/screen.</li><li>Once the timer start it won't be paused or reset</li><li>Good Luck !!</li></ul>",
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonText: 'Yes, proceed!',
                    cancelButtonText: 'No, cancel'
                }).then((result) => {
                    if (result.isConfirmed) {
                        // Request fullscreen
                        var element = document.documentElement;
                        if (element.requestFullscreen) {
                            element.requestFullscreen();
                        } else if (element.mozRequestFullScreen) {
                            element.mozRequestFullScreen();
                        } else if (element.webkitRequestFullscreen) {
                            element.webkitRequestFullscreen();
                        } else if (element.msRequestFullscreen) {
                            element.msRequestFullscreen();
                        }
                        startTimer();
                        $("#step1").hide();
                        $("#step2").show();
                        currentStep = 2;
                    }
                });
            } else {
                Swal.fire("Error", "Please fill in all details", "error");
            }
        }
    });

    function startTimer() {
        var duration = 600; // Timer duration in seconds (5 minutes)
        var display = $("#timer");
        var minutes, seconds;

        // Update the timer display
        function updateDisplay() {
            minutes = parseInt(duration / 60, 10);
            seconds = parseInt(duration % 60, 10);

            minutes = minutes < 10 ? "0" + minutes : minutes;
            seconds = seconds < 10 ? "0" + seconds : seconds;

            display.text(minutes + ":" + seconds);

            if (--duration < 0) {
                clearInterval(timer);
                $("#surveyForm").submit();
            }
        }

        display.text("10:00");
        timer = setInterval(updateDisplay, 1000);
    }

    $("#surveyForm").submit(function(event) {
        event.preventDefault();
        var totalScore = 0;
        let totalSecTaken=0;
        let timeTaken = $("#timer").html();
        let TotalTimeInSec = 10*60
        timeTaken = timeTaken.split(':');
        totalSecTaken=parseInt(timeTaken[0])*60;
        totalSecTaken = totalSecTaken + parseInt(timeTaken[1]);
        totalSecTaken = TotalTimeInSec - totalSecTaken;


        $(this).append("<input type='hidden' name='timeTaken'  value='" + totalSecTaken + "'>");

        if (!formSubmitted) {
            formSubmitted = true;
            $(`.queDivOuter`).attr("disabled", false);
            Swal.fire("Success", "Survey submitted successfully", "success").then((result) => {

                if (result.isConfirmed) {
                    window.location.href = "index.html";
                }
            });
           
        }

    });

    // Pratik Code Starts

    function generateQuestions() {
        var questionContainer = $("#questionContainer");
        questionContainer.empty();  
        for (var i = 0; i < questions.length; i++) {
            var questionObj = questions[i];
            var questionHTML = `<div class="my-5 px-5 border-bottom border-dark queDiv${i} queDivOuter ">
                        <h6>${questionObj.q}</h6>`;
            for (var j = 0; j < questionObj.options.length; j++) {
                var option = questionObj.options[j];
                questionHTML += `
            <div class="form-group pl-4 ">
                    <label class="btn-radio">
                        <input class="  queDiv${i} queDivOuter" type="radio" value="${option.val}"  name="q${i}" />
                        <svg width="20px" height="20px" viewBox="0 0 20 20">
                            <circle cx="10" cy="10" r="9"></circle>
                            <path d="M10,7 C8.34314575,7 7,8.34314575 7,10 C7,11.6568542 8.34314575,13 10,13 C11.6568542,13 13,11.6568542 13,10 C13,8.34314575 11.6568542,7 10,7 Z" class="inner"></path>
                            <path d="M10,1 L10,1 L10,1 C14.9705627,1 19,5.02943725 19,10 L19,10 L19,10 C19,14.9705627 14.9705627,19 10,19 L10,19 L10,19 C5.02943725,19 1,14.9705627 1,10 L1,10 L1,10 C1,5.02943725 5.02943725,1 10,1 L10,1 Z" class="outer"></path>
                        </svg>
                        <span class="" style="margin-left:5px;">${option.opt}</span>
                    </label>
                </div>`;
            }
            questionHTML += `</div>`
            questionContainer.append(questionHTML);
            let counter = 1;
            let new_counter = 1;
            for (let i = 0; i < 20; i++) {
                $(`.queDiv${i}`).css('color', 'black');
            }
            let totalQues = $('.queDivOuter');
            $(window).on('scroll', function () {
                let queDiv = $(`.queDiv${counter}`);
                if (counter < questions.length) {
                    // console.log(counter);
                    if ($(window).scrollTop() > queDiv.offset().top + queDiv.outerHeight() - window.innerHeight) {
                        console.log(counter);

                        $(`.queDivOuter`).attr("disabled", true);
                        $(`.queDivOuter`).css('opacity', '0.4');
                        $(`.queDiv${counter}`).css({ 'color': 'black ' });
                        $(`.queDiv${counter}`).attr("disabled", false);
                        $(`.queDiv${counter}`).css({ 'opacity': '1' });
                        counter++;
                        // new_counter = counter - 1;
                    }
                    else {
                        counter--;
                        // new_counter = counter - 1;
                    }
                }
                else {
                    counter--;
                    // new_counter = counter - 1;
                }

            });
        }
    }

});

    // Pratik Code Ends

// ---------------------------------- raj added JS -----------------------------

let slideTraker=0;
let maxques = 15;
let activeQue = 1;
$('#nextBtn').click(function (e) {
    e.preventDefault();
    if (activeQue == maxques-1){
    $('#nextBtn').css('display', 'none');
    $('#submitButton').css('display', 'inline-block');
    }
    if (activeQue == maxques){
        activeQue=maxques;

    }else{
        activeQue++;
        $('.single_Q_Div').css({'transform': `translateX(-${slideTraker+=105.25}%)`});

        currentQueDisplayTraker(activeQue);
    }
});

$('#preBtn').click(function (e) {
    e.preventDefault();
    $('#submitButton').css('display', 'none');
    $('#nextBtn').css('display', 'inline-block');
    if (activeQue == 1){
        activeQue=1;
    }else{
        activeQue--;
        $('.single_Q_Div').css({'transform': `translateX(-${slideTraker-=105.25}%)`});

        currentQueDisplayTraker(activeQue);
    }
});

function afterClickRadioBtn(activeQue){
    $(`#queIndicator-${activeQue}`).addClass('queIndicatorChecked');
}

function currentQueDisplayTraker(crntQue){
    $(`.queIndicator`).css({'background-color': '#00698f63','transform': 'scale(1)'});
    $(`#queIndicator-${crntQue}`).css({'background-color': '#208abd','transform': 'scale(1.15)','transition': '0.3s ease'});
}
currentQueDisplayTraker(activeQue);
