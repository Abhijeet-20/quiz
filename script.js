const _question = document.querySelector('#question');
const _options = document.querySelector('.quiz_options');
const _correctScore = document.querySelector('#correct_ans');
const _checkBtn = document.querySelector('#chech_ans');
const _playAgainBtn = document.querySelector('#play_again');
const _result = document.getElementById('result');

let correctAns = "",correctScore = askedCount = 0;

async function loadQuestion(){
    const APIUrl = 'https://opentdb.com/api.php?amount=1&type=multiple';
    const result = await fetch(`${APIUrl}`)
    const data = await result.json();
    _result.innerHTML = "";
    showQuestion(data.results[0]);
}

function eventListeners(){
    _checkBtn.addEventListener('click',checkAnswer);
    _playAgainBtn.addEventListener('click',restartQuiz);
}


document.addEventListener('DOMContentLoaded',()=>{
    loadQuestion();
    eventListeners();
    _correctScore.innerHTML = correctScore;
});


function showQuestion(data){
    _checkBtn.disabled = false;
    correctAns = data.correct_answer;
    let incorrectAns = data.incorrect_answers;
    let optionList = incorrectAns;
    optionList.splice(Math.floor(Math.random() * (incorrectAns.length + 1)),0,correctAns);
    // console.log(optionList);
    // console.log(correctAns);

    _question.innerHTML = `${data.question}`;
    _options.innerHTML =   `
        ${optionList.map((option,index)=>`<li class="option"> ${index+1}. <span>${option}</span> </li>`).join('')}
    `;
    
    selectOption();
}

function selectOption(){
    _options.querySelectorAll('li').forEach((option)=>{
        option.addEventListener('click',()=>{
            if(_options.querySelector('.selected')){
                const activeOption = _options.querySelector('.selected');
                activeOption.classList.remove('selected');
            }
            option.classList.add('selected');
        });
    });
    console.log(correctAns);
}


function checkAnswer(){
    _checkBtn.disabled = true;
    if(_options.querySelector('.selected')){
        let selectedAnswer = _options.querySelector('.selected span').textContent;
        if(selectedAnswer.trim() == HTMLDecode(correctAns)){
            correctScore++;
            _result.innerHTML = `<i class="ri-checkbox-circle-fill"></i>Correct Answer! </p>`;
        }else{
            _result.innerHTML = `<p><i class="ri-close-circle-fill"></i>Incorrect Answer! </p> <p><small><b>Correct Answer: </b>${correctAns}</small></p>`;
        }
        checkCount();
    }else {
        _result.innerHTML=`<p><i class="ri-question-fill"></i>Please select an option! </p>`;
        _checkBtn.disabled =false;
    }
}
function HTMLDecode(textString) {
    let doc = new DOMParser().parseFromString(textString, "text/html");
    return doc.documentElement.textContent;
}

function checkCount(){
    askedCount++;
    setCount();
    if(askedCount == 10){
        setTimeout(() => {
            console.log("");
        }, 5000);

        _result.innerHTML += `<p>Your score is ${correctScore}.</p>`;
        _playAgainBtn.style.display = "block";
        _checkBtn.style.display = "none";
    } else {
        setTimeout(function(){
            loadQuestion();
        },400);
    }
}

function setCount(){
    _correctScore.textContent = correctScore;
}

function restartQuiz(){
    correctScore=askedCount=0;
    _playAgainBtn.style.display="none";
    _checkBtn.style.display="block";
    _checkBtn.disabled=false;
    setCount();
    loadQuestion();
}