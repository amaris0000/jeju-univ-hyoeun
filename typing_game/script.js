const quotes = [
// 'When you have eliminated the impossible, whatever remains, however improbable, must be the truth.',
// 'There is nothing more deceptive than an obvious fact.',
// 'I ought to know by this time that when a fact appears to be opposed to along train of deductions it invariably proves to be capable of bearing someother interpretation.',
// 'I never make exceptions. An exception disproves the rule.',
// 'What one man can invent another can discover.',
// 'Nothing clears up a case so much as stating it to another person.',
// 'Education never ends, Watson. It is a series of lessons, with the greatest for the last.',
'asdf'
];

let words = [];
let wordIndex = 0;
let startTime = Date.now();

const start = document.getElementById('start');
const quoteElement = document.getElementById('quote');
const messageElement = document.getElementById('message');
const typedValueElement = document.getElementById('typed-value');

//모달 관련
const modal = document.getElementById('modal');
const modalMessageElement = document.getElementById('modal_message');
const closeButton = document.getElementById('modal_close');

//local storage 관련
myStorage = window.localStorage;
const high_score_key = 'my storage';

start.addEventListener('click',() => {
    start.disabled = true;
    typedValueElement.disabled = false;
    const quoteIndex = Math.floor(Math.random() * quotes.length); // 무작위 인덱스생성
    const quote = quotes[quoteIndex]; // 무작위 인덱스 값으로 인용문 선택
    words = quote.split(' '); // 공백 문자를 기준으로 words 배열에 저장
    wordIndex = 0; // 초기화
    const spanWords = words.map(function(word) { return `<span>${word} </span>`}); // span 태그로 감싼 후 배열에 저장
    quoteElement.innerHTML = spanWords.join(''); // 하나의 문자열로 결합 및 설정
    quoteElement.childNodes[0].className = 'highlight'; // 첫번째 단어 강조
    messageElement.innerText = ''; // 메시지 요소 초기화
    typedValueElement.value = ''; //입력 필드 초기화
    typedValueElement.focus(); // 포커스 설정
    startTime = new Date().getTime(); // 타이핑 시작 시간 기록 
});

typedValueElement.addEventListener('input', () => {
    const currentWord = words[wordIndex];
    const typedValue = typedValueElement.value;
    if (typedValue === currentWord && wordIndex === words.length - 1) {
        const elapsedTime = new Date().getTime() - startTime;
        
        //localStorage 관련
        const stored_time_string = localStorage.getItem(high_score_key)
        let message = '';
        if(stored_time_string == null || elapsedTime<parseInt(stored_time_string)){
            localStorage.setItem(high_score_key, elapsedTime.toString());
            message = `NEW HIGH SCORE! You finished in ${elapsedTime / 1000} seconds.`;
        }
        else{
            const current_high_score = (parseInt(stored_time_string));
            message = `CONGRATULATIONS! You finished in ${elapsedTime / 1000} seconds. (BestRecord: ${current_high_score/ 1000} seconds.)`;
        }
        
        // const message = `CONGRATULATIONS! You finished in ${elapsedTime / 1000} seconds.`;
        // messageElement.innerText = message;
        
        //모달 관련
        modalMessageElement.innerText = message;
        modal.style.display = 'flex';
        
        start.disabled = false;
        typedValueElement.disabled = true;
    }
    else if (typedValue.endsWith(' ') && typedValue.trim() === currentWord) { 
        typedValueElement.value = '';
        wordIndex++;
        for (const wordElement of quoteElement.childNodes) {
            wordElement.className = '';
        }
        quoteElement.childNodes[wordIndex].className = 'highlight';
    } 
    else if (currentWord.startsWith(typedValue)) {
        typedValueElement.className = '';
    } 
    else {
        typedValueElement.className = 'error';
    }

    //애니메이션 관련
    typedValueElement.classList.add('change_scale');
    setTimeout(() => {
        typedValueElement.classList.remove('change_scale');
    },100);

});

function closeModal(){
    modal.style.display = 'none';
    messageElement.innerText = ''; // 메시지 요소 정리
}

// 닫기 버튼, 또는 모달 내부의 'Start Over' 버튼에 closeModal 함수 연결
if (closeButton) {
    closeButton.addEventListener('click', closeModal);}