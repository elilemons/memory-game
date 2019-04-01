/* eslint-disable no-console */
/* eslint-disable no-undef */
$(() => {
  class UI {
    constructor() {
      this.game = new Game(12);
    }

    init() {
      this.setupHTML();
    }

    setupHTML() {
      $('.card-grid').empty();

      // Write HTML
      for (let card of this.game.cards) {
        let cardHTML = $(`<div class="card ${card.isMatched ? 'matched' : ''}">
                          <div class="card-inner card-inner__front ${card.isFlipped ? 'hide' : ''}">
                            ${card.id + 1}
                          </div>
                          <div class="card-inner card-inner__back ${!card.isFlipped ? 'hide' : ''}">
                            <img src="${card.image}" alt="${card.name}" title="Can you find the matching ${card.name}?" />
                          </div>
                        </div>`);

        $('.card-grid').append(cardHTML);

        // Set up event listeners on each card
        $(cardHTML).on('click', () => {
          this.flipCard(card);
        });
      }

      // Set up event listeners
      $('#buttonStart').on('click', this.startGame);
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
    constructor(numOfCards) {
      this.numOfCards = numOfCards;
      this.numOfFlippedCards = 0;
      this.numOfMatchedCards = 0;
      this.cards = [];
      this.matchedCards = [];
      this.flippedCards = [];
      this.won = false;
      this.init();
    }

    /**
     * Initializes the game
     */
    init() {
      this.createCards();
    }

    /**
     * Creates an array of cards
     */
    createCards() {
      let i = 0;

      // Set up cards
      for (i; i < this.numOfCards; i++) {
        this.cards.push(
          new Card(i, `${i % 2 ? 'Kitten' : 'Puppy'}`, `${i %2 ? 'http://placekitten.com/80/80' : 'http://place-puppy.com/80x80'}`) // Create the cards
        );
      }
    }

    /**
     * Handles the card flip game logic
     */
    flipCard(card) {
      console.log('Game\'s card array: ', this.cards);
      console.log('Game flip card called, card passed in:', card,
                  '\nIt\'s index: ', card.id);
      card.isFlipped = !card.isFlipped;
      this.flippedCards.push(card);
      console.log('Flipped cards: ', this.flippedCards);

      if (this.flippedCards.length === 2) {
        this.checkForMatch(this.flippedCards);
        console.log('Matched Cards: ', this.matchedCards);
      } else if (this.flippedCards.length > 2) {
        // this.flipCardsBack(); // TODO make work
      }
    }

    /**
     * @returns {Array} Returns an array of flipped cards
     */
    getFlippedCards() {
      let flippedCards = [];
      for (let card of this.cards) {
        if (card.isFlipped) {
          flippedCards.push(card);
        }
      }

      return flippedCards;
    }

    /**
     * Checks for a matched set of cards by popping them off the passed in array
     * @param {Array} cardsToCheck An array of cards to check, expects 2
     */
    checkForMatch(cardsToCheck) {
      let card1 = cardsToCheck.pop(),
          card2 = cardsToCheck.pop();
      if (card1.name === card2.name) {
        card1.isMatched = true;
        card2.isMatched = true;
        this.matchedCards.push(card1, card2);
      }
    }

    /**
     * Flips any flipped cards back on a slight delay
     */
    flipCardsBack() {
        for (let card of this.cards) {
          if (card.isFlipped && !card.isMatched) {
            card.isFlipped = false;
          }
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

  let ui = new UI();
  ui.init();
});