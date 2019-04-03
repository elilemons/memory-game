/*eslint-env jquery*/
$(() => {
  class UI {
    constructor() {
      this.game = new Game();
    }

    /**
     * Sets up the HTML then hides the grid
     */
    init() {
      this.setupHTML();
      $('.card-grid').hide();
    }

    /**
     * Triggers all of the HTML setup functions
     */
    setupHTML() {
      this.setupCardsHTML();
      this.setupEventListeners();
    }

    /**
     * Sets up the HTML for the cards
     */
    setupCardsHTML() {
      $('.card-grid').empty();

      for (let card of this.game.cards) {
        let cardHTML = $(`<div class="card ${card.isMatched ? 'matched' : ''}">
                          <div class="card-inner card-inner__front ${card.isFlipped ? 'hide' : ''}">
                            ${card.id + 1}
                          </div>
                          <div class="card-inner card-inner__back ${!card.isFlipped ? 'hide' : ''}">
                            <img src="${card.image}" alt="${card.name}" title="Can you find the matching ${card.name}?" class="card-image" />
                          </div>
                        </div>`);

        $('.card-grid').append(cardHTML);

        // Set up event listeners on each card
        $(cardHTML).on('click', () => {
          this.flipCard(card);
        });
      }
    }

    /**
     * Sets up the event listeners
     */
    setupEventListeners() {
      $('#buttonStart').on('click', () => {
        $('.card-grid').slideDown();

        setTimeout(() => {
          this.game.startGame();
        });
      });

      $('#buttonPause').on('click', () => {
        this.game.pauseGame();
      });

      $('#buttonReset').on('click', () => {
        this.game.resetGame();
        $('.card-grid').slideUp();
        this.setupHTML();
      });
    }

    /**
     * Handles the card flip UI logic
     * @param {Card} card
     */
    flipCard(card) {
      // TODO: Animate flipping card
      this.game.flipCard(card); // Tell the game we're flipping the card
      this.setupHTML(); // Redraw the cards after the game handles the flip
    }
  }

  class Game {
    /**
     * Tracks the progress of the game and manages the logic for it
     * @param {Number} numOfCards The number of cards the game should create
     */
    constructor(numOfCards = 20) {
      this.numOfCards = numOfCards;
      this.cards = [];
      this.matchedCards = [];
      this.flippedCards = [];
      this.timer = new Timer();
      this.init();
    }

    /**
     * Initializes the game
     */
    init() {
      this.createCards();
    }

    /**
     * Starts the timer for the game
     */
    startGame() {
      this.timer.start();
    }

    pauseGame() {
      this.timer.pause();
    }

    resetGame() {
      this.timer.reset();
      this.init();
    }

    /**
     * Creates an array of cards
     */
    createCards() {
      let i = 1,
          kittens = [],
          puppies = [];

      // Empty out all arrays
      this.cards = [];
      this.matchedCards = [];
      this.flippedCards = [];

      // This works but I don't want to keep these arrays on the game when there's not even 20 cards
      for (i; i <= 5; i++) {
        kittens.push(new Card(undefined, `kitten-${i}`, `/images/kittens/${i}.png`));
        kittens.push(new Card(undefined ,`kitten-${i}`, `/images/kittens/${i}.png`));
        puppies.push(new Card(undefined, `puppy-${i}`, `/images/puppies/${i}.png`));
        puppies.push(new Card(undefined, `puppy-${i}`, `/images/puppies/${i}.png`));
      }

      let cuteBabes = [];
      kittens.forEach(kitten => cuteBabes.push(kitten));
      puppies.forEach(puppy => cuteBabes.push(puppy));

      // Set up initial cards
      for (i = 0; i < this.numOfCards; i++) {
        cuteBabes[i].id = i;
        this.cards.push(cuteBabes[i]);
      }
    }

    /**
     *  Handles the card flip game logic
     * @param {Card} card The card that is being flipped
     */
    flipCard(card) {
      // We don't want to do anything on matched cards
      if (card.isMatched === true) { return; }

      // Flip the card front or back
      card.isFlipped = !card.isFlipped;

      if (card.isFlipped) { // If we are flipping the card to its image, check for matches
        // Add card to array of flipped cards
        this.flippedCards.push(card);

        // Check if two flipped cards match
        if (this.flippedCards.length === 2) {
            this.checkForMatch(this.flippedCards);
            this.checkForWin();
        }

        // Flip the first two cards back if we have more than 2
        if (this.flippedCards.length > 2) {
          this.flipCardsBack(this.flippedCards);
        }
      }

      if (!card.isFlipped) { // If we are flipping the card back to its front, make sure the appropiate arrays are updated
        let cardToFlip, i = 0;
        // Find the card in the flipped cards and remove it, placing it into cardToFlip
        for (i = 0; i < this.flippedCards.length; i++ ) {
          if (this.flippedCards[i].id === card.id) {
            // Splice returns an array, we just want one item
            cardToFlip = this.flippedCards.splice(i, 1)[0];
            break; // Again, we just want one item, so we can stop looping on finding and storing a match
          }
        }
        // Within the cards array, find the matching card (id === index), and flip it back
        for (let card of this.cards) {
          if (card.id === cardToFlip.id) {
            card.isFlipped = false;
          }
        }
      }
    }

    /**
     * Removes the first two cards in the array, then flips them in the game's array as well
     * @param {Array} flippedCards An array of flipped cards
     */
    flipCardsBack(flippedCards) {
      let card1 = flippedCards.shift(),
          card2 = flippedCards.shift();
      this.cards[card1.id].isFlipped = false;
      this.cards[card2.id].isFlipped = false;
    }

    /**
     * Checks for a matched set of cards by popping them off the passed in array
     * @param {Array} cardsToCheck An array of cards to check, expects 2
     */
    checkForMatch(cardsToCheck) {
      if (cardsToCheck[0].name === cardsToCheck[1].name) {
        let card1 = cardsToCheck.pop(),
        card2 = cardsToCheck.pop();
        card1.isMatched = true;
        card2.isMatched = true;
        this.matchedCards.push(card1, card2);
        return true;
      }
      return false;
    }

    checkForWin() {
      if (this.matchedCards.length === this.cards.length) {
        this.pauseGame();
        setTimeout(() => {
          alert(`You've won with a time of: ${this.timer.getFullTimerString()}`);
        }, 100);
      }
    }
  }

  class Card {
    /**
     * Represents a card with a front and back side. Tracks whether it is flipped (showing its backside) and
     * whether it has been matched with its companion card
     * @param {Number} id The ID of a card
     * @param {String} name The name of a card
     * @param {String} image The URL where the image of a card can be found
     */
    constructor(id, name, image) {
      this.id = id;
      this.name = name;
      this.image = image;
      this.isFlipped = false;
      this.isMatched = false;
    }
  }

  class Timer {
    /**
     * A simple timer that updates the timer in the HTML
     */
    constructor() {
      this.hours = 0;
      this.minutes = 0;
      this.seconds = 0;
      this.milliseconds = 0;
    }

    /**
     * Starts the timer, updating the HTML
     */
    start() {
      if (!this.interval) {
        this.interval = setInterval(() => {
          this.milliseconds += 5;
          if (this.milliseconds >= 999) {
            this.milliseconds = this.milliseconds - 999;
            this.seconds += 1;

            if (this.seconds === 59) {
              this.minutes += 1;
              this.seconds = 0;
              if (this.minutes === 59) {
                this.hours += 1;
                this.minutes = 0;
              }
            }
          }
          this.setupTimerHTML();
        }, 5);
      }
    }

    pause() {
      if (this.interval) {
        clearInterval(this.interval);
        delete this.interval;
      }
    }

    reset() {
      this.pause();
      this.hours = 0;
      this.minutes = 0;
      this.seconds = 0;
      this.milliseconds = 0;

      this.setupTimerHTML();
    }

    setupTimerHTML() {
      $('#milliseconds').text(this.getTimeString(this.milliseconds, 3));
      $('#seconds').text(this.getTimeString(this.seconds, 2));
      $('#minutes').text(this.getTimeString(this.minutes, 2));
      $('#hours').text(this.getTimeString(this.hours, 2));
    }

    getTimeString(timeType, zeroPadStart) {
      return timeType.toString().padStart(zeroPadStart, '0');
    }

    getFullTimerString() {
      return `${this.getTimeString(this.hours, 2)}:${this.getTimeString(this.minutes, 2)}:${this.getTimeString(this.seconds, 2)}:${this.getTimeString(this.milliseconds, 3)}`;
    }
  }

  let ui = new UI();
  ui.init();
});