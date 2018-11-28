let cards = [];
let suits = ["spades", "hearts", "clubs", "diams"];
let numb = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
let playerCard = [];
let dealerCard = [];
let mydollars = 100;
let cardCount = 0;
let endplay = false;



let message = document.getElementById("message");
let output = document.getElementById("output");
let dealerHolder = document.getElementById("dealerHolder");
let playerHolder = document.getElementById("playerHolder");
let pValue = document.getElementById("pValue");
let dValue = document.getElementById("dValue");
let dollarValue = document.getElementById("dollars");

document.getElementById('mybet').onchange = function () {
    if (this.value < 0) {
        this.value = 0;
    }
    if (this.value > mydollars) {
        this.value = mydollars;
    }
    message.innerhtml = "Bet changed to $" + this.value;
}


for (s in suits) {
    let suit = suits[s][0].toUpperCase();
    let bgcolor = suit == "S" || suit == "C" ? "black" : "red";
    for (n in numb) {
        //output.innerHTML += "<span style='color:" + bgcolor+"'>&"+suits[s]+";"+numb[n]+ "</span> ";
        let cardValue = n > 9 ? 10 : parseInt(n) + 1;
        let card = {
            suit: suit,
            icon: suits[s],
            bgcolor: bgcolor,
            cardnum: numb[n],
            cardvalue: cardValue
        };
        cards.push(card);
    }
}

function Start() {
    shuffleDeck(cards);
    mydollars = 100;
    dealNew();
    document.getElementById("start").style.display = "none";
    document.getElementById("dollars").innerHTML = mydollars;
}

function dealNew() {
    playerCard = [];
    dealerCard = [];
    dealerHolder.innerHTML = "";
    playerHolder.innerHTML = "";

    let betvalue = document.getElementById("mybet").value;
    mydollars = mydollars - betvalue;
    document.getElementById("dollars").innerHTML = mydollars;
    document.getElementById("myactions").style.display = "block";
    message.innerHTML =
        "Get upto 21 and beat the dealer to win.<br>Current bet is $" + betvalue;
    document.getElementById("mybet").disabled = true;
    document.getElementById("maxbet").disabled = true;
    deal();
    document.getElementById("btndeal").style.display = "none";
    document.getElementById('dValue').innerHTML = "?";
}

function reshuffle() {
    cardCount++;
    if (cardCount > 45) {
        console.log("New Deck");
        shuffleDeck(cards);
        cardCount = 0;
        message.innerHTML = "Deck Shuffled";
    }
}

function deal() {
   
    for (x = 0; x < 2; x++) {
        dealerCard.push(cards[cardCount]);
        dealerHolder.innerHTML += cardOutput(cardCount, x);
        if (x == 0) {
            dealerHolder.innerHTML += "<div id ='cover' style='left:100px;'</div>";
        }
        reshuffle();
        playerCard.push(cards[cardCount]);
        playerHolder.innerHTML += cardOutput(cardCount, x);
        reshuffle();
    }
    //end play if player has blackjack.

    pValue.innerHTML = checktotal(playerCard);
    dValue.innerHTML = checktotal(dealerCard);

    // let playervalue = checktotal(playerCard);
    // if (playervalue == 21 && playerCard.length == 2) {
    //    playend();    
    //}
}


function cardOutput(n, x) {
    let hpos = x > 0 ? x * 60 + 100 : 100;
    return (
        '<div class="icard ' +
        cards[n].icon +
        ' "style="left:' +
        hpos +
        'px"> <div class="top-card suit">' +
        cards[n].cardnum +
        '<br></div> <div class="content-card suit"></div> <div class="bottom-card suit">' +
        cards[n].cardnum +
        "<br></div> </div>"
    );
}

function maxbet() {
    document.getElementById('mybet').value = mydollars;
    message.innerHTML = "Bet changed to $" + mydollars;
}




function cardAction(a) {
    console.log(a);
    switch (a) {
        case "hit":
            playucard(); //add new card to players hand
            break;
        case "hold":
            playend(); //play out and calculate
            break;
        case "double":
            let betvalue = parseInt(document.getElementById('mybet').value);
            if ((mydollars - betvalue) < 0) {
                betvalue = betvalue + mydollars;
                mydollars = 0;
            } else {
                mydollars = mydollars - betvalue;
                betvalue = betvalue * 2;
            }
            document.getElementById('dollars').innerhtml = mydollars;
            document.getElementById('mybet').value = betvalue;


            // double current bet and remove value from mydollars
            playucard(); //add new card to players hand
            playend(); //play out and calculate
            break;
        default:
            console.log("done");
            playend(); //playout and calculate
    }
}

function playucard() {
    playerCard.push(cards[cardCount]);
    playerHolder.innerHTML += cardOutput(cardCount, playerCard.length - 1);
    reshuffle();
    var rValu = checktotal(playerCard);
    pValue.innerHTML = rValu;
    if (rValu > 21) {
        message.innerHTML += "BUSTED!";
        playend();
    }
}

function playend() {
    endplay = true;
    document.getElementById("cover").style.display = "none";
    document.getElementById("myactions").style.display = "none";
    document.getElementById("btndeal").style.display = "block";

    document.getElementById("mybet").disabled = false;
    document.getElementById("maxbet").disabled = false;
    message.innerHTML = "Game Over<br>";
    var payoutJack = 1;
    var dealervalue = checktotal(dealerCard);
    dValue.innerHTML = dealervalue;

    while (dealervalue < 17) {

        dealerCard.push(cards[cardCount]);
        dealerHolder.innerHTML += cardOutput(cardCount, dealerCard.length - 1);
        reshuffle();
        dealervalue = checktotal(dealerCard);
    }

    //check for winner
    let playervalue = checktotal(playerCard);
    if (playervalue == 21 && playerCard.length == 2) {
        message.innerHTML += "Player Blackjack!";
        payoutJack = 1.5;
    }

    let betvalue = parseInt(document.getElementById("mybet").value) * payoutJack;

    if (
        (playervalue < 22 && dealervalue < playervalue) ||
        (dealervalue > 21 && playervalue < 22)
    ) {
        message.innerHTML +=
            '<span style="color:green;"> Winner Winner Chicken Dinner! You won $' +
            betvalue +
            "</span>";
        mydollars = mydollars + betvalue * 2;
    } else if (playervalue > 21) {
        message.innerHTML +=
            '<span style="color:red;">Dealer Wins! You lost $' + betvalue + "</span>";
    } else if (playervalue == dealervalue) {
        message.innerHTML += '<span style="color:blue;">You WIN! you won $' + betvalue + '</span>';
        mydollars = mydollars + betvalue;
    } else {
        message.innerHTML +=
            '<span style="color:red;">Dealer Wins! You lost $' + betvalue + "</span>";

    }

    pValue.innerHTML = playervalue;
    dValue.innerHTML = dealervalue;
    dollarValue.innerHTML = mydollars;
}

var dealervalue = checktotal(dealerCard);

dValue.innerHTML = dealervalue;

function checktotal(arr) {
    var rValue = 0;
    var aceAdjust = false;
    for (var i in arr) {
        if (arr[i].cardnum == "A" && !aceAdjust) {
            aceAdjust = true;
            rValue = rValue + 10;
        }
        rValue = rValue + arr[i].cardvalue;
    }
    if (aceAdjust && rValue > 21) {
        rValue = rValue - 10;
    }
    return rValue;
}

function shuffleDeck(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array;
}

function outputCard() {
    output.innerHTML +="<span style='color:" + cards[cardCount].bgcolor +
        "'>" + cards[cardCount].cardnum + "&" + cards[cardCount].icon + ";</span> ";
}

// let randomNum = Math.floor(Math.random()*52);
// output.innerHTML += "<span style='color:" + cards[randomNum].bgcolor + "'>&" + cards[randomNum].icon + ";" + cards[randomNum].cardnum + "</span> ";
// ;