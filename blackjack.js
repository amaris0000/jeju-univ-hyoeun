function randomCard(){
    return Math.floor(Math.random()*11)+1
}

//Player Card
let cardOne = randomCard();
let cardTwo = randomCard();
let sum = cardOne + cardTwo;

//BlackJack
if (sum==21){
    console.log('BlackJack! You win');
}

let cardThree = randomCard();
sum += cardThree;

//Lost
if (sum > 21) {
  console.log('You lost');
}
console.log(`You have ${sum} points`);

//Bank Card
let cardBank = [randomCard(), randomCard()];
let bankSum = cardBank[0]+cardBank[1];

//Bank < 17
if (bankSum<17){
    for (i=2; bankSum>17; i++)
        cardBank[i]=randomCard();
        bankSum += cardBank[1];
    }
    
//Win
if (bankSum > 21 || (sum <= 21 && sum > bankSum)) {
  console.log('You win');
} else {
  console.log('Bank wins');
}


//Draw
if (bankSum==sum){
    console.log('Draw');
}