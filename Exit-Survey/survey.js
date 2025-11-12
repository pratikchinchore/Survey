$(document).ready(function () {
  let currentStep = 1;
  let formSubmitted = false;
  let currentQuestion = 0;
  let questions = [];
  let timer;

  // Load questions
  $.getJSON("questions.json", function (data) {
    questions = data;
    renderQuestion();
  });

  // Step 1 to Step 2
  $("#nextButton").click(function () {
    const empId = $("#empIdInput").val().trim();
    const name = $("#empNameInput").val().trim();
    const dept = $("#empDepInput").val().trim();

    if (!empId || !name || !dept) {
      Swal.fire("Error", "Please fill in all details", "error");
      return;
    }

    Swal.fire({
      title: "Instructions",
      html: "<ul style='text-align:left;'><li>15 multiple choice questions</li><li>10 minutes to complete</li><li>Auto-submit if you switch window</li><li>Timer will not pause</li></ul>",
      icon: "info",
      confirmButtonText: "Start Survey"
    }).then((result) => {
      if (result.isConfirmed) {
        $("#step1").hide();
        $("#step2").fadeIn();
        startTimer();
        currentStep = 2;
        renderQuestion();
      }
    });
  });

  // Timer
  function startTimer() {
    let duration = 600;
    const display = $("#timer");

    const interval = setInterval(() => {
      let minutes = parseInt(duration / 60, 10);
      let seconds = parseInt(duration % 60, 10);
      minutes = minutes < 10 ? "0" + minutes : minutes;
      seconds = seconds < 10 ? "0" + seconds : seconds;
      display.text(`${minutes}:${seconds}`);

      if (--duration < 0) {
        clearInterval(interval);
        $("#surveyForm").submit();
      }
    }, 1000);
  }

  // Render question
  function renderQuestion() {
    const q = questions[currentQuestion];
    if (!q) return;

    let html = `<div class="queDivOuter active">
                  <h6>${q.q}</h6>`;
    q.options.forEach(opt => {
      html += `<div class="option">
                <label><input type="radio" name="q${currentQuestion}" value="${opt.val}"/> ${opt.opt}</label>
               </div>`;
    });
    html += `</div>`;
    $("#questionContainer").html(html);

    updateProgress();
  }

  // Progress
  function updateProgress() {
    const percent = ((currentQuestion + 1) / questions.length) * 100;
    $("#progressBar").css("width", `${percent}%`);
    $("#progressText").text(`Question ${currentQuestion + 1} of ${questions.length}`);
  }

  // Next
  $("#nextQuestion").click(() => {
    if (currentQuestion < questions.length - 1) {
      currentQuestion++;
      renderQuestion();
    }
    if (currentQuestion === questions.length - 1) {
      $("#nextQuestion").addClass("d-none");
      $("#submitButton").removeClass("d-none");
    }
    $("#prevQuestion").removeClass("d-none");
  });

  // Previous
  $("#prevQuestion").click(() => {
    if (currentQuestion > 0) {
      currentQuestion--;
      renderQuestion();
    }
    if (currentQuestion === 0) $("#prevQuestion").addClass("d-none");
    $("#nextQuestion").removeClass("d-none");
    $("#submitButton").addClass("d-none");
  });

  // Submit
  $("#surveyForm").submit(function (event) {
    event.preventDefault();
    if (!formSubmitted) {
      formSubmitted = true;
      Swal.fire("Submitted!", "Survey submitted successfully.", "success").then(() => {
        window.location.href = "index.html";
      });
    }
  });
});
