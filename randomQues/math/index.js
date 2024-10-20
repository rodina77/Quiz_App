document.addEventListener("DOMContentLoaded", () => {
  loadQuiz();
  startTimer(60);
});

function startTimer(seconds) {
  document.getElementById("timer").innerHTML=`Time left: ${seconds} seconds`;

  const countdown = setInterval(() => {
    seconds--;
    document.getElementById("timer").innerHTML= `Time left: ${seconds} seconds`;

    if (seconds <= 0) {
      clearInterval(countdown);
      document.getElementById("timer").innerHTML= "Time's up!";
      submit(); 
    }
  }, 1000);
}

function loadQuiz() {
  fetch("/math/mathQuiz.json")
    .then((response) => response.json())
    .then((data) => {
      const resultContainer = document.getElementById("result");
      const drafts = JSON.parse(localStorage.getItem('randomMath')) || [];
      const allQuestions = [...data.EasyMathematics, ...data.IntermediateMathematics]; 
      const numQuestionsToDisplay = 5; 

      const shuffledQuestions = allQuestions.sort(() => 0.5 - Math.random()).slice(0, numQuestionsToDisplay);

      shuffledQuestions.forEach(res => {
        const isDrafted = drafts.some(draft => draft.name === res.name && draft.question === res.question);

        if (!isDrafted) {
          const questionContainer = document.createElement('div');
          questionContainer.classList.add('question-container');
          questionContainer.innerHTML = `
            <p class="result_question">${res.question}</p>
            <button class="drafted-btn" onclick="draft(this, '${res.name}', '${res.question}', '${res.answer1}', '${res.answer2}', '${res.answer3}')">Draft</button><br>
            <input class="input_val" name="${res.name}" type="radio" value="${res.answer1}" data-answer="${res.correct}">${res.answer1}<br>
            <input class="input_val" name="${res.name}" type="radio" value="${res.answer2}" data-answer="${res.correct}">${res.answer2}<br>
            <input class="input_val" name="${res.name}" type="radio" value="${res.answer3}" data-answer="${res.correct}">${res.answer3}<br><br>
          `;
          resultContainer.appendChild(questionContainer); 
        }
      });
    })
    .catch((error) => {
      console.error("There was a problem with the fetch operation:", error);
    });
}

function draft(buttonElement, name, question, answer1, answer2, answer3) {
  let drafts = JSON.parse(localStorage.getItem('randomMath')) || [];

  const isDrafted = drafts.some(draft => draft.name === name && draft.question === question);

  if (isDrafted) {
    alert("This question is already drafted!"); 
    return;
  }

  const correctAnswer = buttonElement.closest('.question-container').querySelector('input[data-answer]').getAttribute('data-answer');
  const draftData = {
    name,
    question,
    options: [answer1, answer2, answer3],
    correctAnswer 
  };

  drafts.push(draftData);
  localStorage.setItem('randomMath', JSON.stringify(drafts));

  console.log("Draft saved successfully!", draftData);

  const questionContainer = buttonElement.closest('.question-container');
  if (questionContainer) {
    questionContainer.remove();
  } else {
    console.error("Question container not found.");
  }
}

function retrieveDrafts() {
  let drafts = JSON.parse(localStorage.getItem('randomMath')) || [];
  const resultContainer = document.getElementById("result");

  drafts.forEach(draft => {
      const questionContainer = document.createElement('div');
      questionContainer.classList.add('question-container');
      questionContainer.innerHTML = `
          <p class="result_question">${draft.question}</p>
          <input class="input_val" name="${draft.name}" type="radio" value="${draft.options[0]}" data-answer="${draft.correctAnswer}">${draft.options[0]}<br>
          <input class="input_val" name="${draft.name}" type="radio" value="${draft.options[1]}" data-answer="${draft.correctAnswer}">${draft.options[1]}<br>
          <input class="input_val" name="${draft.name}" type="radio" value="${draft.options[2]}" data-answer="${draft.correctAnswer}">${draft.options[2]}<br><br>
      `;
      resultContainer.appendChild(questionContainer);
  });
}


function submit() {
  let score = 0;
  let badge;
  let questions = Array.from(new Set([...document.querySelectorAll(".input_val")].map(input => input.name)));

  questions.forEach((questionName) => {
    let selectedInput = document.querySelector(`input[name="${questionName}"]:checked`);

    if (selectedInput) {
      let correctAnswer = selectedInput.getAttribute("data-answer");
      if (selectedInput.value.trim() === correctAnswer) {
        score += 1;
      }
    }
  });

  let overallBadge;
  if (score < 5) {
    overallBadge = "bad";
  } else if (score >= 5 && score < 7) {
    overallBadge = "good";
  } else {
    overallBadge = "excellent";
  }

  Swal.fire({
    title: 'Do you want to solve draft questions?',
    showCancelButton: true,
    confirmButtonText: 'Yes',
    cancelButtonText: 'No'
  })
  .then((result) => {
    if (result.isConfirmed) {
      displayDraftQuestions(score);
    } else {
      // If "No" is selected, display the score immediately
      Swal.fire(`Your score: ${score} out of 10 and your badge is ${overallBadge}`)
        .then(() => {
          // Redirect after displaying the message
          setTimeout(() => {
            window.location.href = "/options_page/math/index.html";
          }, 3000);
        });
    }
  });
}

function displayDraftQuestions(originalScore) {
  document.getElementById("result").innerHTML = '';

  let drafts = JSON.parse(localStorage.getItem('randomMath')) || [];
  if (drafts.length === 0) {
      Swal.fire("No draft questions available.");
      setTimeout(() => {
        window.location.href = "/options_page/math/index.html";
      }, 3000);
  }

  drafts.forEach((draft) => {
    document.getElementById("result").innerHTML += `
      <div class="question-container">
        <p class="result_question">${draft.question}</p>
        <input class="input_val" name="${draft.name}" type="radio" value="${draft.options[0]}" data-answer="${draft.correctAnswer}">${draft.options[0]}<br>
        <input class="input_val" name="${draft.name}" type="radio" value="${draft.options[1]}" data-answer="${draft.correctAnswer}">${draft.options[1]}<br>
        <input class="input_val" name="${draft.name}" type="radio" value="${draft.options[2]}" data-answer="${draft.correctAnswer}">${draft.options[2]}<br><br>
      </div>
    `;
  });

  const submitDraftButton = document.createElement("button");
  submitDraftButton.innerText = "Submit Draft Questions";
  submitDraftButton.classList.add("submit_draft");
  submitDraftButton.onclick = () => submitDraftQuestions(originalScore); 
  document.getElementById("result").appendChild(submitDraftButton);
  document.getElementById("submit_btn").style.display = "none";
}

function submitDraftQuestions(originalScore) {
  let score = 0;
  let badge;
  let questions = Array.from(new Set([...document.querySelectorAll(".input_val")].map(input => input.name)));

  questions.forEach((questionName) => {
    let selectedInput = document.querySelector(`input[name="${questionName}"]:checked`);

    if (selectedInput) {
      let correctAnswer = selectedInput.getAttribute("data-answer");
      if (selectedInput.value.trim() === correctAnswer) {
        score += 1;
      }
    }
  });

  const totalScore = originalScore + score;

  if (totalScore < 5) {
    badge = "bad";
  } else if (totalScore >= 5 && totalScore < 7) {
    badge = "good";
  } else {
    badge = "excellent";
  }

  Swal.fire(`Your total score: ${totalScore} out of 10 and your badge is ${badge}`);
  setTimeout(() => {
    window.location.href = "/options_page/math/index.html";
  }, 3000);
}


document.getElementById("submit_btn").onclick = submit;
