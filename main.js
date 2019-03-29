$(() => {
  function testLogs(options) {
    console.log(options);
  }

  class UI {
    constructor() {
      this.grid = new CardGrid(4);
      this.game = new Game(this.grid.cards);
      this.setupHTML();
    }

    setupHTML() {
      $('.card-grid').empty();

      // Write HTML
      for (let card of this.grid.cards) {
        let cardHTML = $(`<div class="card ${card.isMatched ? 'matched' :  ''}">
                          <div class="card-inner card-inner__front ${card.isFlipped ? 'hide' : ''}">
                            ${card.id}
                          </div>
                          <div class="card-inner card-inner__back ${!card.isFlipped ? 'hide' : ''}">
                            <img src="${card.image.source}" alt="${card.image.name}" title="Can you find the matching ${card.image.name}?" />
                          </div>
                        </div>`);

        $('.card-grid').append(cardHTML);

        // Set up event listeners on each card
        $(cardHTML).on('click', () => {
          if (card.isMatched) { return; }
          // Let game update the card array then redraw the HTML
          this.game.flipCard(card);
          testLogs({functionName: 'card click', params: {
            cards: this.grid.cards
          }});
          this.setupHTML();
        });
      }

      // Set up event listeners
      $('#buttonStart').on('click', this.game.startGame);
    }
  }

 class Game {
   constructor(cardArray) {
     this.cardArray = cardArray;
     this.cardsMatched = 0;
     this.cardsFlipped = [];
     this.maxCardsFlipped = 2;
   }

   startGame() {
    // Scroll to the bottom
    $('html, body').animate({
      scrollTop: $(document).height()-$(window).height()},
      1400,
   );
  }

  flipCard(card) {
    card.isFlipped = !card.isFlipped;

    // If the card has been flipped,
    if (card.isFlipped) {
      this.cardsFlipped.push(card);
    }

    this.cardArray.splice(card.id - 1, 1, card);

    if (this.cardsFlipped.length === 2) {
      if (this.hasMatch()) {
        testLogs({
          functionName: 'Game.flipCard()',
          params: {
            'cards': this.cardArray,
            'flipped': this.cardsFlipped,
            'numMatched': this.cardsMatched
          },
          message: 'Found a match'
        })
        this.cardsMatched += 2;

        if (this.hasWon()) {
          alert("You've won!");
        } else {
          this.cardArray[this.cardsFlipped[0].id - 1].isMatched = true;
          this.cardArray[this.cardsFlipped[1].id - 1].isMatched = true;
        }
      }
    }
  }

  hasMatch() {
    console.log('looking for a match');
    testLogs({ functionName: 'game.hasMatch', params: {
      allCards: this.cardArray,
      cardsFlipped: this.cardsFlipped,
    }});
    return this.cardsFlipped[0].image.name === this.cardsFlipped[1].image.name;
  }

  hasWon() {
     return this.cardsMatched === this.cardArray.length;
   }
 }

  class CardGrid {
    constructor(numOfCards) {
      this.numOfCards = numOfCards;
      this.cards = [];
      this.init();
    }

    init() {
      let i = 1;

      // Set up cards
      for (i; i <= this.numOfCards; i++) {
        this.cards.push(
          new Card(i, new Image('Kitten', 'http://placekitten.com/80/80')) // Create the cards
        );
      }
    }
  }

  class Card {
    constructor(id, image) {
      this.id = id;
      this.image = image;
      this.isFlipped = false;
      this.isMatched = false;
    }
  }

  class Image {
    constructor(name, source) {
      this.name = name;
      this.source = source;
    }
  }

  let ui = new UI();
});