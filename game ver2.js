console.log('uno!')
console.log('uno!')

//#region  // DOM AND GLOBAL VARIABLES
const cpuHandDom = document.querySelector('.cpu-hand')
const cpu2HandDom = document.querySelector('.cpu2-hand')
const playerHandDom = document.querySelector('.player-hand')

const cpuScoreDom = document.querySelector('#cpu-score')
const cpu2ScoreDom = document.querySelector('#cpu2-score')

const playerScoreDom = document.querySelector('#player-score')

const playerText = document.querySelector('#msgp')


const playPileDom = document.querySelector('.play-pile')
const drawPileDom = document.querySelector('.draw-pile')

const playerUno = document.querySelector('.player-animation')
const cpuUno = document.querySelector('.cpu-animation')

// hand arrays
const cpuHand = []
const cpu2Hand = []
const playerHand = []

const deck = []
let playPile
let cpuScore = 0
let cpu2Score = 0
let playerScore = 0

// variables to control gameplay
let playerTurn = 3
let step=1
let gameOn = true
let colorPickerIsOpen = false
let cpuDelay = Math.floor((Math.random() * cpuHand.length * 200) + 1500)
let gameOver = 100
//#endregion

//#region preload imgs for faster loading
const imgPreLoad = []
let preLoaded = false

const preLoadImgs = () => {
    for (let i = 0; i <= 3; i++) {
        let color
        if (i === 0) color = 'red'
        if (i === 1) color = 'green'
        if (i === 2) color = 'blue'
        if (i === 3) color = 'yellow'
        for (let n = 0; n <= 14; n++) {
            let img = new Image()
            img.src = 'images/' + color + i + '.png'
            imgPreLoad.push(img)
        }
    }

    for (let i = 0; i < imgPreLoad.length; i++) {
        playPileDom.appendChild(imgPreLoad[i])
        playPileDom.innerHTML = ''
    }
}
//#endregion

// #region AUDIO
const shuffleFX = new Audio('audio/shuffle.wav')
const playCardFX = new Audio('audio/playCardNew.wav')
const playCardFX2 = new Audio('audio/playCard2.wav')
const drawCardFX = new Audio('audio/drawCard.wav')
const winRoundFX = new Audio('audio/winRound.wav')
const winGameFX = new Audio('audio/winGame.wav')
const loseFX = new Audio('audio/lose.wav')
const plusCardFX = new Audio('audio/plusCard.wav')
const unoFX = new Audio('audio/uno.wav')
const colorButton = new Audio('audio/colorButton.wav')
const playAgain = new Audio('audio/playAgain.wav')

const pickPlayCardSound = () => {
    // const random = Math.random() * 10

    // if (random > 6) playCardFX.play()
    // else playCardFX2.play()

    playCardFX2.play()
}
//#endregion


const nextTurn =() => {
    playerTurn=playerTurn+step
    if (playerTurn>3) {
       playerTurn=1
	}
	else {
	    if (playerTurn<1) {
              playerTurn=3
	    }
	}
}

    


// #region CARD AND DECK MANAGEMENT
class Card {
    constructor(rgb, value, points, changeTurn, drawValue, imgSrc) {
        this.color = rgb
        this.value = value
        this.points = points
        this.changeTurn = changeTurn
        this.drawValue = drawValue
        this.src = imgSrc
        this.playedByPlayer = false
    }
}

const createCard = (rgb, color) => {
    for (let i = 0; i <= 14; i++) {
        // number cards
        if (i === 0) {
            deck.push(new Card(rgb, i, i, true, 0, 'images/' + color + i + '.png'))
        }
        else if (i > 0 && i <= 9) {
            deck.push(new Card(rgb, i, i, true, 0, 'images/' + color + i + '.png'))
            deck.push(new Card(rgb, i, i, true, 0, 'images/' + color + i + '.png'))
        }
        // reverse/skip
        else if (i === 10 || i === 11) {
            deck.push(new Card(rgb, i, 20, false, 0, 'images/' + color + i + '.png'))
            deck.push(new Card(rgb, i, 20, false, 0, 'images/' + color + i + '.png'))
        }
        // draw 2
        else if (i === 12) {
            deck.push(new Card(rgb, i, 20, false, 2, 'images/' + color + i + '.png'))
            deck.push(new Card(rgb, i, 20, false, 2, 'images/' + color + i + '.png'))
        }
        else if (i === 13) {
            deck.push(new Card('any', i, 50, true, 0, 'images/wild' + i + '.png'))
        }
        else {
            deck.push(new Card('any', i, 50, false, 4, 'images/wild' + i + '.png'))
        }
    }
}

const createDeck = () => {
    // destroy previous deck
    deck.length = 0
    // create new deck
    for (let i = 0; i <= 3; i++){
        if (i === 0) {
            createCard('rgb(255, 6, 0)', 'red')
        }
        else if (i === 1) {
            createCard('rgb(0, 170, 69)', 'green')
        }
        else if (i === 2) {
            createCard('rgb(0, 150, 224)', 'blue')
        }
        else {
            createCard('rgb(255, 222, 0)', 'yellow')
        }
    }

    console.log(playerTurn + '--> ' +deck) // TODO: remove
}

const shuffleDeck = (deck) => {
    for (let i = deck.length - 1; i > 0; i--) {
        deck[i].playedByPlayer = false
        let j = Math.floor(Math.random() * (i + 1))
        let temp = deck[i]
        deck[i] = deck[j]
        deck[j] = temp
    }
 
    shuffleFX.play()
}
//#endregion

// #region GAME BEHAVIOURS
const dealCards = () => {
console.log(playerTurn + '--> ' +'DEALcARDS')
    let ss=''
    for (let i = 0; i < 7; i++) {
        // deal cards into cpu/player arrays
        cpuHand.push(deck.shift())  
        cpu2Hand.push(deck.shift())     
        playerHand.push(deck.shift())
		ss=ss + '  '+cpu2Hand[i].value

        // put cards on the DOM
        const cpuCard = document.createElement('img')
        cpuCard.setAttribute('src', 'images/back.png')
        cpuCard.setAttribute('class', 'cpu')
        cpuHandDom.appendChild(cpuCard)

        // put cards on the DOM
        const cpu2Card = document.createElement('img')
        cpu2Card.setAttribute('src', 'images/back.png')
        cpu2Card.setAttribute('class', 'cpu2')
        cpu2HandDom.appendChild(cpu2Card)
		
		
        const playerCard = document.createElement('img')
        playerCard.setAttribute('src', playerHand[i].src)
        playerCard.setAttribute('class', 'player')
        
        // assign cards an id = their index in the playerHand array 
        //in order to reference the correct card object
        playerCard.setAttribute('id', i)
        playerHandDom.appendChild(playerCard)
   
   }
   console.log("DealCards"+ss)	
}

const startPlayPile = () => {
    const playCard = document.createElement('img')
    
    // find first card that isn't an action card
    for (let i = 0; i < deck.length; i++) {
        if (deck[i].color !== "any" && deck[i].value <= 9) {
            // begin playPile array with first valid card
            playPile = deck.splice(i, 1)
            break
        }
    }

    // set playCard to correct image
    playCard.setAttribute('src', playPile[0].src)
    // play card to the playPile
    playPileDom.appendChild(playCard)
}

const newHand = () => {
    console.log(playerTurn + 'NEW HAND')
    gameOn = true
    // clear hands and play pile
    cpuHandDom.innerHTML = ''
    cpuHand.length = 0
	
	cpu2HandDom.innerHTML = ''
	cpu2Hand.length=0
    playerHandDom.innerHTML = ''
    playerHand.length = 0
    playPileDom.innerHTML = ''

    // create new deck
    createDeck()
    // shuffle deck
    shuffleDeck(deck)
    // deal cards and first play card
    dealCards()
    // set down first play card that isn't an action card
    startPlayPile()

    if (colorPickerIsOpen) hideColorPicker()
}

const updatePlayPileDom = () => {
    console.log(playerTurn + '--> ' +'updatePlayPileDom')

    playPileDom.innerHTML = ''

    // add played card to playPile
    const newCardImg = document.createElement('img')
    const imgSrc = playPile[playPile.length - 1].src
    newCardImg.setAttribute('src', imgSrc)
    playPileDom.appendChild(newCardImg)
}

const updateHand = (handToUpdate) => {
    console.log(playerTurn + '--> ' +'updateHand')

    let domToUpdate, cardClass;
cpuVisible = true   //LLL
cpu2Visible = true  //LLL
    if (handToUpdate === cpuHand) {
        domToUpdate = cpuHandDom
        cardClass = 'cpu'
        if (!cpuVisible) cpuVisible = true
    }
	else {
	  if (handToUpdate === cpu2Hand) {
        domToUpdate = cpu2HandDom
        cardClass = 'cpu2'
        if (!cpu2Visible) cpu2Visible = true
	  }
      else {
        domToUpdate = playerHandDom
        cardClass = 'player'
      }
	}
    
    // clear the selected dom
    domToUpdate.innerHTML = ''

    // update dom
    for (let i = 0; i < handToUpdate.length; i++) {
        let src

        if ((domToUpdate === cpuHandDom)|| (domToUpdate === cpu2HandDom)) {   //LLLL
            src = 'images/back.png'
        } 
        else {
            src = handToUpdate[i].src
        } 

        const updatedCard = document.createElement('img')
        updatedCard.setAttribute('src', src)
        updatedCard.setAttribute('class', cardClass)
        // update ID's to match playerHand indexes
        updatedCard.setAttribute('id', i)
        domToUpdate.appendChild(updatedCard)
    }

    // keep dom element from collapsing when hand is empty
    if (handToUpdate.length === 0) {
        const updatedCard = document.createElement('img')
        updatedCard.setAttribute('src', 'images/empty.png')
        updatedCard.setAttribute('class', 'empty')
        // update ID's to match playerHand indexes
        domToUpdate.appendChild(updatedCard)
    }
	
    showCpuCards()
    cpuVisible = true
    showCpu2Cards()
	cpu2Visible=true

}

const drawCard = (handGetsCard) => {
        console.log(playerTurn + '--> ' +'drawCard') // TODO: remove

    animateDrawCard(handGetsCard)
    // check if the deck has card to draw
    if (deck.length > 0) {
        // pull the top card
        const newCard = deck.shift()
        handGetsCard.push(newCard)
        console.log(playerTurn + '--> ' +handGetsCard, 'drew one card') // TODO: remove
        
    }
    else {
        // shuffle playPile
        shuffleDeck(playPile)
        for (let i = 0; i <= playPile.length - 1; i++) {
            // shuffled playPile becomes the new deck
            deck.push(playPile[i])
        }
        // leave the last played card on the playPile
        playPile.length = 1

        // pull the top card from the deck
        const newCard = deck.shift()
        handGetsCard.push(newCard)
        console.log(playerTurn + '--> ' +handGetsCard, 'drew one card') // TODO: remove
        
    }
    drawCardFX.play()
    setTimeout(() => {
        updateHand(handGetsCard)
    }, 500)
}

const animateDrawCard = (player) => {
    console.log(playerTurn + '--> ' +'animateDrawCard') // TODO: remove

    let playerClass
    if (player === cpuHand) playerClass = 'cpu-draw'
    else playerClass = 'player-draw'
    
    const drawCardEl = document.querySelector('#draw-card')
    drawCardEl.classList.remove('hidden')
    setTimeout(() => {
        drawCardEl.classList.add(playerClass)
        setTimeout(() => {
            drawCardEl.classList.add('hidden')
            drawCardEl.classList.remove(playerClass)
            clearInterval()
        }, 500)
    }, 30)
}

const showUno = (unoHand) => {
    console.log(playerTurn + '--> ' +'showUno') // TODO: remove

    // remove hidden class from player-uno div
    unoHand.classList.remove('hidden')
    unoFX.play()
    console.log(playerTurn + '--> ' +'removed HIDDEN from', unoHand)

    // add shout class
    setTimeout(() => {
        unoHand.classList.add('shout')
        console.log(playerTurn + '--> ' +'added SHOUT to', unoHand)
        //setTimeout = after x seconds remove shout
        setTimeout(() => {
            unoHand.classList.remove('shout')
            console.log(playerTurn + '--> ' +'removed SHOUT from', unoHand)

            setTimeout(() => {
                unoHand.classList.add('hidden')
                console.log(playerTurn + '--> ' +'added HIDDEN to', unoHand)
            }, 1000)
        }, 1000)
    }, 10) 
}

const showColorPicker = () => {
     console.log(playerTurn + '--> ' +'showColorPicker')

    // show the color picker
    const colorPicker = document.querySelector('.color-picker')
    colorPicker.style.opacity = 1
    colorPickerIsOpen = true

    //assign eventHandler's to buttons
    document.querySelector('.red').addEventListener('click', (e) => {
        // pass thru the class name for color
        chooseColor('rgb(255, 6, 0)')
    })
    document.querySelector('.green').addEventListener('click', (e) => {
        // pass thru the class name for color
        chooseColor('rgb(0, 170, 69)')
    })
    document.querySelector('.blue').addEventListener('click', (e) => {
        // pass thru the class name for color
        chooseColor('rgb(0, 150, 224)')
    })
    document.querySelector('.yellow').addEventListener('click', (e) => {
        // pass thru the class name for color
        chooseColor('rgb(255, 222, 0)')
    })
}

const chooseColor = (rgb) => {
     console.log(playerTurn + '--> ' +'chooseColor')

    //assign the color to the wild on top of the play pile
    colorButton.play()
    playPile[playPile.length - 1].color = rgb

    // hide the color picker
    hideColorPicker()
    nextTurn();
    setTimeout(playCPU, cpuDelay)}

function hideColorPicker() {
     console.log(playerTurn + '--> ' +'hideColorPicker')

    const colorPicker = document.querySelector('.color-picker')
    colorPicker.style.opacity = 0
    colorPickerIsOpen = false
}

const skipOrEndTurn = () => {
     console.log(playerTurn + '--> ' +'skipOrEndTurn')

    // check if changeTurn or skip
    if (playPile[playPile.length - 1].changeTurn) {
	    nextTurn()
//        step=-step
        // cpu's turn
        if (playerTurn===1) {setTimeout(playCPU, cpuDelay)}
		else {if (playerTurn===2) setTimeout(playCPU2, cpuDelay)}
    }
}

// update player names with whose turn it is
const showTurnOnDom = () => {
     console.log(playerTurn + '--> ' +'showTurnOnDom')
    
//    if (playerTurn===1) {
        document.querySelector('.player-score-title').style.color = 'rgb(255, 255, 255)'
        document.querySelector('.cpu-score-title').style.color = 'rgb(255, 255, 255)'
        document.querySelector('.cpu2-score-title').style.color = 'rgb(255, 255, 255)'
//    }
//    else {
//        document.querySelector('.player-score-title').style.color = 'rgb(150, 200, 238)'
//        document.querySelector('.cpu-score-title').style.color = 'rgb(150, 200, 238)'
//    }
}
//#endregion

//#region END OF ROUND/GAME FUNCTIONS
const tallyPoints = (loserHand) => {
     console.log(playerTurn + '--> ' +'tallyPoints')

    let points = 0

    for (const card of loserHand) {
        points += card.points
    }

    if (loserHand == cpuHand) {
        cpuScore += points
    }
    else {
		if (loserHand==cpu2Hand) {
			cpu2Score+=points
		}
		else {
            playerScore += points
        }
	}
	
	console.log('Scores='+cpuScore+' '+cpu2Score+' '+playerScore)
}

const updateScores = () => {
     console.log(playerTurn + '--> ' +'updateScores')

    // update cpuScoreDom
    cpuScoreDom.innerHTML = cpuScore
    if (cpuScore < gameOver / 2) cpuScoreDom.style.color = 'rgb(255, 255, 0)'
    else cpuScoreDom.style.color = 'rgb(255, 255, 2)'

    // update cpuScoreDom
    cpu2ScoreDom.innerHTML = cpu2Score
    if (cpu2Score < gameOver / 2) cpu2ScoreDom.style.color = 'rgb(255, 5, 255)'
    else cpu2ScoreDom.style.color = 'rgb(255, 5, 255)'

    // update playerScoreDom
    playerScoreDom.innerHTML = playerScore
	
//    playerText.innerHTML = ''

    if (playerScore < gameOver / 2) playerScoreDom.style.color = 'rgb(0, 255, 255)'
    else playerScoreDom.style.color = 'rgb(0,255,255)'
}

const checkForWinner = () => {
     console.log(playerTurn + '--> ' +'checkForWinner')

    // check if that no one has lost
    if (playerScore < gameOver && cpuScore < gameOver) {
        // next round
        if (playerHand.length === 0) {
            winRoundFX.play()
            endRound(playerHand)
        }
        if (cpuHand.length === 0) {
            loseFX.play()
            endRound(cpuHand)
        }
    }
        
    else {
        // game over
        endGame()
    }
}

const showCpuCards = () => {
     console.log(playerTurn + '--> ' +'showCpuCards')

    if (cpuHand.length >= 1) {
        cpuHandDom.innerHTML = ''
        for (let i = 0; i < cpuHand.length; i++) {
    
            // turn the cards over
            const cpuCard = document.createElement('img')
            cpuCard.setAttribute('src', cpuHand[i].src)
            cpuCard.setAttribute('class', 'cpu')
            cpuHandDom.appendChild(cpuCard)
        }
    } 
}

const hideCpuCards = () => {
     console.log(playerTurn + '--> ' +'hideCpuCards')

    if (cpuHand.length >= 1) {
        cpuHandDom.innerHTML = ''
        for (let i = 0; i < cpuHand.length; i++) {
    
            // turn the cards over
            const cpuCard = document.createElement('img')
            cpuCard.setAttribute('src', 'images/back.png')
            cpuCard.setAttribute('class', 'cpu')
            cpuHandDom.appendChild(cpuCard)
        }
    } 
}


const showCpu2Cards = () => {
     console.log(playerTurn + '--> ' +'showCpu2Cards')

    if (cpu2Hand.length >= 1) {
        cpu2HandDom.innerHTML = ''
        for (let i = 0; i < cpu2Hand.length; i++) {
    
            // turn the cards over
            const cpu2Card = document.createElement('img')
            cpu2Card.setAttribute('src', cpu2Hand[i].src)
            cpu2Card.setAttribute('class', 'cpu2')
            cpu2HandDom.appendChild(cpu2Card)
        }
    } 
}

const hide2CpuCards = () => {
     console.log(playerTurn + '--> ' +'hide2CpuCards')

    if (cpu2Hand.length >= 1) {
        cpu2HandDom.innerHTML = ''
        for (let i = 0; i < cpu2Hand.length; i++) {
    
            // turn the cards over
            const cpu2Card = document.createElement('img')
            cpu2Card.setAttribute('src', 'images/back.png')
            cpu2Card.setAttribute('class', 'cpu2')
            cpuHandDom.appendChild(cpu2Card)
        }
    } 
}

const endRound = (winner) => {
     console.log(playerTurn + '--> ' +'endRound')

    console.log(playerTurn + '--> ' +'round over') // TODO: remove
    gameOn = false;
    nextTurn()
    if (cpuHand.length > 0) showCpuCards()
    
    const endOfroundDom = document.querySelector('.end-of-round')
    const roundDom = document.querySelector('.round')
    
    // show end of round element & format it based on who won
    endOfroundDom.classList.remove('hidden')
    if (winner === playerHand) roundDom.textContent = 'You won the round!'
    else roundDom.textContent = 'CPU won the round...'
    
    // hide end of round element after 2 seconds
    setTimeout(() => {
        endOfroundDom.classList.add('hidden')
        playerTurn = 3
        newHand()
        if (playerTurn===1) {setTimeout(playCPU, cpuDelay)}
		else {if (playerTurn===2) setTimeout(playCPU, cpuDelay)}
        
    }, 3000)
}

const endGame = () => {
     console.log(playerTurn + '--> ' +'endGame')

    console.log(playerTurn + '--> ' +'game over') // TODO: remove
    gameOn = false;
    if (cpuHand.length > 0) showCpuCards()

    const endOfGameDom = document.querySelector('.end-of-game')
    const gameDom = document.querySelector('.game')

    // show end of game element & format based on winner
    endOfGameDom.classList.remove('hidden')

    if (playerScore > gameOver) {
        loseFX.play()
        gameDom.textContent = 'CPU won the game... Play again?'
    }  
    else {
        winGameFX.play()
        gameDom.textContent = 'You won the game! Play again?'
    }

    // add event listener to 'play again' button
    document.querySelector('.play-again').addEventListener('click', () => {
        playAgain.play()
        // hide end of game element on click
        endOfGameDom.classList.add('hidden')
        playerScore = 0
        cpuScore = 0
		cpu2Score=0
        updateScores()
        nextTurn()		
        newHand()
        if (playerTurn===1) {
		   setTimeout(playCPU, cpuDelay)}
		else {
		   if (playerTurn===2) {setTimeout(playCPU2, cpuDelay)}
		}
    })
}
//#endregion

//#region ////////CPU LOGIC////////
const letCpuDrawCards = (cpH) => {
     console.log(playerTurn + '--> ' +'letCpuDrawCards')

    if (playPile[playPile.length - 1].drawValue > 0) {
        // add however many cards based on drawValue of last played card
        for (let i = 0; i < playPile[playPile.length - 1].drawValue; i++) {
            drawCard(cpH)
        }
		console.log(playerTurn + '--> ' +'letCpuDrawCards')
		console.log(playerTurn + '--> ' +cpH)
    }
}

const playCPU = () => {   
     console.log(playerTurn + '--> ' +'playCPU')
	 console.log(playerTurn + '--> ' +playerTurn)

    if ((playerTurn==1) && gameOn) {
        console.log(playerTurn + '--> ' +'cpu beginning turn') // TODO: remove        
        
        // create temp array of playable cards based on last card played
        const playable = determinePlayableCards()

        // if no playable cards
        if (playable.length === 0) {
            console.log(playerTurn + '--> ' +'CPU has no cards to play') // TODO: remove
            // draw card
            drawCard(cpuHand)
            // end turn
            setTimeout(() => {
                console.log(playerTurn + '--> ' +'CPU ending turn') // TODO: remove
				nextTurn()
                if (playerTurn===2) {setTimeout(playCPU2, cpuDelay)}                
                return
            }, 500)
        }
        //if one playable card
        else if (playable.length === 1) {
            // chosenCard = playable[0]
            setTimeout(playCPUCard, 300, playable[0])
            console.log(playable[0])
            //playCPUCard(playable[0])
        }
        // if more than one playable cards
        else if (playable.length > 1) {
            console.log(playerTurn + '--> ' +'cpu has', playable.length, 'playable cards')
            
            let chosenCard = runStrategist(playable)
            setTimeout(playCPUCard, 300, chosenCard)
            
            console.log(chosenCard)
            //playCPUCard(chosenCard)
        }
    }
//#region CPU SPECIFIC FUNCTIONS
    function determinePlayableCards() {
	     console.log(playerTurn + '--> ' +'determinePlayableCards')

        const playableCards = []

        console.log(playerTurn + '--> ' +'last card played:') // TODO: remove
        console.log(playerTurn + '--> ' +playPile[playPile.length - 1])
        for (let i = 0; i < cpuHand.length; i++) {
            if (cpuHand[i].color === playPile[playPile.length - 1].color || cpuHand[i].value === playPile[playPile.length - 1].value || cpuHand[i].color === 'any' || playPile[playPile.length - 1].color === 'any') {
                let validCard = cpuHand.splice(i, 1)
                playableCards.push(validCard[0])
            }
        }
        console.log(playerTurn + '--> ' +'playable cards:')
        console.log(playerTurn + '--> ' +playableCards) // TODO: remove
        
        return playableCards
}
    
    function runStrategist(playable) {
        let cardIndex
            
	     console.log(playerTurn + '--> ' +'runStrategist')
			
        // run strategist to determine strategy
        let strategist = Math.random()
        console.log(playerTurn + '--> ' +'strategist:', strategist) // TODO: remove
        // if strategist > 0.5 || playerHand <= 3
        if (playPile.length > 2 && (strategist > 0.7 || playerHand.length < 3 || cpuHand.length > (playerHand.length * 2) || (playPile[playPile.length - 1].playedByPlayer === true && playPile[playPile.length - 1].drawValue > 0) || (playPile[playPile.length - 2].playedByPlayer === true && playPile[playPile.length - 1].drawValue > 0))) {
            // prioritize action/high point cards
            console.log(playerTurn + '--> ' +'cpu chose high card') // TODO: remove
            let highestValue = 0

            for (let i = 0; i < playable.length; i++){
                if (playable[i].value > highestValue) {
                    highestValue = playable[i].value
                    cardIndex = i
                }
            }

            // play card determined by strategist
            // remove card from playable
            chosenCard = playable.splice(cardIndex, 1)

            // return playable to cpuHand
            returnPlayablesToHand()
    }
        else {
            // else prioritize color || number cards
            console.log(playerTurn + '--> ' +'cpu chose low card') // TODO: remove
            let lowestValue = 14

            for (let i = 0; i < playable.length; i++){
                if (playable[i].value < lowestValue) {
                    lowestValue = playable[i].value
                    cardIndex = i
                }
            }

            // play card determined by strategist
            // remove card from playable
            chosenCard = playable.splice(cardIndex, 1)

            returnPlayablesToHand()           
        }

        console.log(playerTurn + '--> ' +chosenCard[0])  // TODO: remove
        return chosenCard[0]

        function returnPlayablesToHand() {
			     console.log(playerTurn + '--> ' +'returnPlayablesToHand')

            if (playable.length > 0) {
                for (const card of playable) {
                    cpuHand.push(card)
                }
            }
        }
    }

    function playCPUCard(chosenCard) {
        console.log(playerTurn + '--> ' +'playing card:') // TODO: remove
        console.log(playerTurn + '--> ' +chosenCard)
        
        //animate random card from cpuHandDom
        const cpuDomCards = cpuHandDom.childNodes
        cpuDomCards[Math.floor(Math.random() * cpuDomCards.length)].classList.add('cpu-play-card')
        console.log(playerTurn + '--> ' +'animating CPU card')
        pickPlayCardSound()
        // debugger
        
        setTimeout(() => {
            playPile.push(chosenCard)
            // update playPileDom
            updatePlayPileDom()

            // check if cpu played wild
            if (playPile[playPile.length - 1].color === 'any' && playPile[playPile.length - 1].drawValue === 0 && playPile[playPile.length - 1].playedByPlayer === false) {
                console.log(playerTurn + '--> ' +'cpu played a wild') // TODO: remove
                chooseColorAfterWild()
            }

            // check cpuHand length and update cpuHandDom
            if (cpuHand.length >= 1) {
                updateHand(cpuHand)
                if (cpuHand.length === 1) {
                    showUno(cpuUno)
                }
            }
            // if end of round
            else {
                // tallyPoints(playerHand)
                // updateScores()
                // checkForWinner()
                updateHand(cpuHand)
                setTimeout(() => {
                    tallyPoints(cpuHand)
					tallyPoints(cpu2Hand)
                    updateScores()
                    checkForWinner()
                }, 1200)
            }

            // if cpu played a draw card
            if (chosenCard.drawValue > 0) {
                // alert('cpu played a +' + chosenCard.drawValue + ' card!')
                console.log(playerTurn + '--> ' +'cpu played a +' + chosenCard.drawValue + ' card!') // TODO: remove
                hitWithDrawCard()
                setTimeout(() => {
                    for (let i = 0; i < chosenCard.drawValue; i++) {
                        drawCard(playerHand)
                    }
                    checkChangeTurn()
                },1000)
            }
            // else checkChangeTurn()
            else setTimeout(checkChangeTurn, 500)
        }, 500)
        

        function checkChangeTurn() {
		    console.log(playerTurn + '--> ' +'checkChangeTurn') // TODO: remove

            if (chosenCard.changeTurn) {
                // if changeTurn, playerTurn = true
                console.log(playerTurn + '--> ' +'cpu has finished its turn') // TODO: remove

                nextTurn()
//                step=-step
				if (playerTurn===2) {
                          setTimeout(playCPU2, cpuDelay)
					}
				else {
				    playerTurn=3
					console.log(playerTurn + '--> ' +'PLAYERTURN=3')
					return	
				}
            }				
            else {
                // else cpuTurn() again
                console.log(playerTurn + '--> ' +'cpu goes again') // TODO: remove	
                setTimeout(playCPU, cpuDelay)
            }
        }
    }



    function chooseColorAfterWild() {
	    console.log(playerTurn + '--> ' +'chooseColorAfterWild') // TODO: remove

        console.log(playerTurn + '--> ' +'cpu picking new color') // TODO: remove
        const colors = ['rgb(255, 6, 0)', 'rgb(0, 170, 69)', 'rgb(0, 150, 224)', 'rgb(255, 222, 0)']
        const colorsInHand = [0, 0, 0, 0]

        // cpu checks how many of each color it has
        for (const card of cpuHand) {
            if (card.color === colors[0]) colorsInHand[0]++
            if (card.color === colors[1]) colorsInHand[1]++
            if (card.color === colors[2]) colorsInHand[2]++
            if (card.color === colors[3]) colorsInHand[3]++
        }

        // find the index of the max value
        let indexOfMax = colorsInHand.indexOf(Math.max(...colorsInHand))

        // style the wild card and it's color
        const wildCardDom = playPileDom.childNodes[0]
        wildCardDom.style.border = '5px solid ' + colors[indexOfMax]
        wildCardDom.style.width = '105px'
        playPile[playPile.length - 1].color = colors[indexOfMax]
    }
    //#endregion
}

const playCPU2 = () => {   
     console.log(playerTurn + '--> ' +'CPU2--->CPU2--->playCPU2')

    if (playerTurn===2 && gameOn) {
        console.log(playerTurn + '--> ' +'CPU2--->cpu beginning turn') // TODO: remove        
        
        // create temp array of playable cards based on last card played
        const playable = determinePlayableCards()

        // if no playable cards
        if (playable.length === 0) {
            console.log(playerTurn + '--> ' +'CPU2--->CPU has no cards to play') // TODO: remove
            // draw card
            drawCard(cpu2Hand)
            // end turn
            setTimeout(() => {
                console.log(playerTurn + '--> ' +'CPU2 ending turn') // TODO: remove
				nextTurn()
                if (playerTurn===1) {setTimeout(playCPU, cpuDelay)}                
                return
            }, 500)
        }
        //if one playable card
        else if (playable.length === 1) {
            // chosenCard = playable[0]
            setTimeout(playCPU2Card, 300, playable[0])
            console.log(playable[0])
            //playCPUCard(playable[0])
        }
        // if more than one playable cards
        else if (playable.length > 1) {
            console.log(playerTurn + '--> ' +'CPU2--->cpu 2 has', playable.length, 'playable cards')
            
            let chosenCard = runStrategist(playable)
            setTimeout(playCPU2Card, 300, chosenCard)
             console.log(chosenCard)

            //playCPUCard(chosenCard)
        }
    }
//#region CPU SPECIFIC FUNCTIONS
    function determinePlayableCards() {
	     console.log(playerTurn + '--> ' +'CPU2--->determinePlayableCards')

        const playableCards = []

        console.log(playerTurn + '--> ' +'CPU2--->last card played:') // TODO: remove
        console.log(playerTurn + '--> ' +playPile[playPile.length - 1])
        for (let i = 0; i < cpu2Hand.length; i++) {
            if (cpu2Hand[i].color === playPile[playPile.length - 1].color || cpu2Hand[i].value === playPile[playPile.length - 1].value || cpu2Hand[i].color === 'any' || playPile[playPile.length - 1].color === 'any') {
                let validCard = cpu2Hand.splice(i, 1)
                playableCards.push(validCard[0])
            }
        }
        console.log(playerTurn + '--> ' +'CPU2--->playable cards:')
        console.log(playerTurn + '--> ' +playableCards) // TODO: remove
        
        return playableCards
}
    
    function runStrategist(playable) {
        let cardIndex
            
	     console.log(playerTurn + '--> ' +'CPU2--->runStrategist')
			
        // run strategist to determine strategy
        let strategist = Math.random()
        console.log(playerTurn + '--> ' +'CPU2--->strategist:', strategist) // TODO: remove
        // if strategist > 0.5 || playerHand <= 3
        if (playPile.length > 2 && (strategist > 0.7 || playerHand.length < 3 || cpuHand.length > (playerHand.length * 2) || (playPile[playPile.length - 1].playedByPlayer === true && playPile[playPile.length - 1].drawValue > 0) || (playPile[playPile.length - 2].playedByPlayer === true && playPile[playPile.length - 1].drawValue > 0))) {
            // prioritize action/high point cards
            console.log(playerTurn + '--> ' +'CPU2--->cpu2 chose high card') // TODO: remove
            let highestValue = 0

            for (let i = 0; i < playable.length; i++){
                if (playable[i].value > highestValue) {
                    highestValue = playable[i].value
                    cardIndex = i
                }
            }

            // play card determined by strategist
            // remove card from playable
            chosenCard = playable.splice(cardIndex, 1)

            // return playable to cpuHand
            returnPlayablesToHand()
    }
        else {
            // else prioritize color || number cards
            console.log(playerTurn + '--> ' +'CPU2--->cpu2 chose low card') // TODO: remove
            let lowestValue = 14

            for (let i = 0; i < playable.length; i++){
                if (playable[i].value < lowestValue) {
                    lowestValue = playable[i].value
                    cardIndex = i
                }
            }

            // play card determined by strategist
            // remove card from playable
            chosenCard = playable.splice(cardIndex, 1)

            returnPlayablesToHand()           
        }

        console.log(playerTurn + '--> ' +chosenCard[0])  // TODO: remove
        return chosenCard[0]

        function returnPlayablesToHand() {
			     console.log(playerTurn + '--> ' +'CPU2--->returnPlayablesToHand')

            if (playable.length > 0) {
                for (const card of playable) {
                    cpu2Hand.push(card)
                }
            }
        }
    }

    function playCPU2Card(chosenCard) {
        console.log(playerTurn + '--> ' +'CPU2--->playing card:') // TODO: remove
        console.log(playerTurn + '--> ' +chosenCard)
        
        //animate random card from cpuHandDom
        const cpu2DomCards = cpu2HandDom.childNodes
        cpu2DomCards[Math.floor(Math.random() * cpu2DomCards.length)].classList.add('cpu2-play-card')
        console.log(playerTurn + '--> ' +'CPU2--->animating CPU2 card')
        pickPlayCardSound()
        // debugger
        
        setTimeout(() => {
            playPile.push(chosenCard)
            // update playPileDom
            updatePlayPileDom()

            // check if cpu played wild
            if (playPile[playPile.length - 1].color === 'any' && playPile[playPile.length - 1].drawValue === 0 && playPile[playPile.length - 1].playedByPlayer === false) {
                console.log(playerTurn + '--> ' +'CPU2--->cpu2 played a wild') // TODO: remove
                chooseColorAfterWild()
            }

            // check cpuHand length and update cpuHandDom
            if (cpu2Hand.length >= 1) {
                updateHand(cpu2Hand)
                if (cpu2Hand.length === 1) {
                    showUno(cpu2Uno)
                }
            }
            // if end of round
            else {
                // tallyPoints(playerHand)
                // updateScores()
                // checkForWinner()
                updateHand(cpu2Hand)
                setTimeout(() => {
                    tallyPoints(cpu2Hand)
                    tallyPoints(cpuHand)
					updateScores()
                    checkForWinner()
                }, 1200)
            }

            // if cpu played a draw card
            if (chosenCard.drawValue > 0) {
                // alert('cpu played a +' + chosenCard.drawValue + ' card!')
                console.log(playerTurn + '--> ' +'CPU2--->cpu2 played a +' + chosenCard.drawValue + ' card!') // TODO: remove
                hitWithDrawCard()
                setTimeout(() => {
                    for (let i = 0; i < chosenCard.drawValue; i++) {
                        drawCard(playerHand)
                    }
                    checkChangeTurn()
                },1000)
            }
            // else checkChangeTurn()
            else setTimeout(checkChangeTurn, 500)
        }, 500)
        

        function checkChangeTurn() {
		    console.log(playerTurn + '--> ' +'CPU2--->checkChangeTurn') // TODO: remove

            if (chosenCard.changeTurn) {
                // if changeTurn, playerTurn = true
                console.log(playerTurn + '--> ' +'CPU2--->cpu2 has finished its turn') // TODO: remove
				nextTurn()
//				step=-step
		    	if (playerTurn===1) {
                          setTimeout(playCPU, cpuDelay)
			    }
			    else {
				        playerTurn=3
					    console.log(playerTurn + '--> ' +'PLAYERTURN=3')
					    return	
			   }
            }     				
            else {
                // else cpuTurn() again
                console.log(playerTurn + '--> ' +'CPU2 goes again') // TODO: remove	
                setTimeout(playCPU2, cpuDelay)
            }
        }
    }

    function chooseColorAfterWild() {
	    console.log(playerTurn + '--> ' +'CPU2--->chooseColorAfterWild') // TODO: remove

        console.log(playerTurn + '--> ' +'CPU2--->cpu picking new color') // TODO: remove
        const colors = ['rgb(255, 6, 0)', 'rgb(0, 170, 69)', 'rgb(0, 150, 224)', 'rgb(255, 222, 0)']
        const colorsInHand = [0, 0, 0, 0]

        // cpu checks how many of each color it has
        for (const card of cpu2Hand) {
            if (card.color === colors[0]) colorsInHand[0]++
            if (card.color === colors[1]) colorsInHand[1]++
            if (card.color === colors[2]) colorsInHand[2]++
            if (card.color === colors[3]) colorsInHand[3]++
        }

        // find the index of the max value
        let indexOfMax = colorsInHand.indexOf(Math.max(...colorsInHand))

        // style the wild card and it's color
        const wildCardDom = playPileDom.childNodes[0]
        wildCardDom.style.border = '5px solid ' + colors[indexOfMax]
        wildCardDom.style.width = '105px'
        playPile[playPile.length - 1].color = colors[indexOfMax]
    }
    //#endregion
}



const hitWithDrawCard = () => {
	    console.log(playerTurn + '--> ' +'hitWithDrawCard') // TODO: remove

    plusCardFX.play()
    playPileDom.classList.add('shout')
    setTimeout(() => {
        playPileDom.classList.remove('shout')
    }, 1000)
}
//#endregion

const playPlayerCard = (index) => {
	    console.log(playerTurn + '--> ' +'playPlayerCard') // TODO: remove

    let cardToPlay = playerHand.splice(index, 1)
    cardToPlay[0].playedByPlayer = true
    playPile.push(cardToPlay[0])

    // clear the playPile
    updatePlayPileDom()
}

//#region ///////MAIN GAME FUNCTION////////
const startGame = () => {
	    console.log(playerTurn + '--> ' +'startGame') // TODO: remove

    if (!preLoaded) {
        preLoadImgs()
        preLoaded = true
    } 

    playerScore = 0
    cpu1Score = 0
    cpu2Score=0
    listenForDevMode()
    setInterval(showTurnOnDom, 100)
    newHand()
    updateScores()
    playerTurn=3

///LLLL    if (!playerTurn) setTimeout(playCPU, cpuDelay)	


    // set event listeners on playerHandDom and drawPileDom
    // playerHandDom

    playerHandDom.addEventListener('click', (event) => {
        if ((playerTurn) && !colorPickerIsOpen && event.target.getAttribute('id')) {

            const lastCardDom = playPileDom.childNodes[0]
            if (lastCardDom.style !== '100px') {
                lastCardDom.style.width = '100px'
                lastCardDom.style.border = 'none'
            }

            // use target's ID to find card object in array
            let index = parseInt(event.target.getAttribute('id'))
            
            // if value or color matches topOfPlayPile OR color = 'any'
            if (playerHand[index].value === playPile[playPile.length - 1].value || playerHand[index].color === playPile[playPile.length - 1].color || playerHand[index].color === 'any' || playPile[playPile.length - 1].color === 'any') {     
                
                // animate clicked card
                pickPlayCardSound()
                event.target.classList.add('play-card')
                console.log(playerTurn + '--> ' +'you played', event.target.currentSrc) // TODO: remove

                setTimeout(() => {
                    // set topOfPlayPile to target.src
                    //topOfPlayPile.length = 0
                    playPlayerCard(index)


                    // invoke cpuTurn to add cards if there are any to add
                    if (playerTurn==1) {letCpuDrawCards(cpuHand)}
					else {if (playerTurn==2) {letCpuDrawCards(cpu2Hand)}}

                    
                    // check playerHand length and update DOM
                    if (playerHand.length >= 1) {
                        updateHand(playerHand)
                        if (playerHand.length === 1) showUno(playerUno)
                    }
                    else {
                        updateHand(playerHand)
                        setTimeout(() => {
                            tallyPoints(cpuHand)
                            updateScores()
                            checkForWinner()
                        }, 1200)
                    }

                    //check if wild
                    if (playPile[playPile.length - 1].color === 'any' && playPile[playPile.length - 1].drawValue === 0 && playPile[playPile.length - 1].playedByPlayer) {
                        // set new color
                        showColorPicker()
                        return
                    }

                    skipOrEndTurn();
                }, 1000)
                
            }
        }
    })
    
    let areYouSure = false

    drawPileDom.addEventListener('click', () => {
        if ((playerTurn===3) && !colorPickerIsOpen) {
            drawCard(playerHand)
            // playerTurn = false;
            // setTimeout(playCPU, cpuDelay)
            setTimeout(() => {
			    nextTurn()
				if (playerTurn===1) {setTimeout(playCPU, cpuDelay)}
			    else {if (playerTurn===2) {setTimeout(playCPU2, cpuDelay)}
				}
            }, 500)
        }
    })
}
//#endregion
let cpuVisible = true
let cpu2Visible = true

const listenForDevMode = () => {
	    console.log(playerTurn + '--> ' +'listenForDevMode') // TODO: remove

    document.addEventListener('keydown', event => {
        const key = event.key.toLowerCase()
        console.log(playerTurn + '--> ' +key)
        if (key === 'p') {
            playerTurn = 3;
            console.log(playerTurn + '--> ' +'forced playerTurn', playerTurn)
        }

        if (key === 'c') {
            drawCard(cpuHand)
            updateHand(cpuHand)
        }

        if (key === 'x') {
            playerHand.pop()
            updateHand(playerHand)
        }

        if (key === 'z') {
            cpuHand.pop()
            updateHand(cpuHand)
        }

        if (key === 'w') {
            const wild = new Card('any', 13, 50, true, 0, 'images/wild13.png')
            playerHand.push(wild)
            updateHand(playerHand)
        }

        if (key === '4') {
            const wild4 = new Card('any', 14, 50, true, 4, 'images/wild14.png')
            playerHand.push(wild4)
            updateHand(playerHand)
        }

        if (key === '=') {
            playerScore += 10
            updateScores()
        }

        if (key === 's') {
            if (cpuVisible) {
                hideCpuCards()
                cpuVisible = false
            }
            else {
                showCpuCards()
                cpuVisible = true
				showCpu2Cards()
				cpu2Visible=true
            }
        }
		
		let mypoints=0
        if ((key === '1') && (cpuHand.length>0)) {
          for (const card of cpuHand) {
               mypoints += card.points
          }			
		}
		
		if ((key === '2') && (cpu2Hand.length>0)) {
          for (const card of cpu2Hand) {
               mypoints += card.points
          }			
		}
		
		if ((key === '3')  && (playerHand.length>0)){
          for (const card of playerHand) {
               mypoints += card.points
          }			
		}
		
		console.log('Show ' + key + ' Hand score '+mypoints)
        
    })
}

startGame()
