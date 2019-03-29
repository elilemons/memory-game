$(() => {
  function testLogs(options) {
    console.log(options);
  }
  class UI {
    constructor() {
      this.grid = new CardGrid(9);
      this.setupHTML();
    }

    setupHTML() {
      // Write HTML
      for (let card of this.grid.cards) {
        let cardHTML = $(`<div class="card">
                          <div class="card-inner card-inner__front">
                            ${card.id}
                          </div>
                          <div class="card-inner hide card-inner__back">
                            <img src="${card.image}" alt="An image" title="Can you find my match?" />
                          </div>
                        </div>`);

        $('.card-grid').append(cardHTML);

        // Set up event listeners on each card
        $(cardHTML).on('click', () => {
          this.flipCard(cardHTML);
          card.isFlipped = !card.isFlipped;
        });
      }

      // Set up event listeners
      $('#buttonStart').on('click', this.startGame);
    }

    startGame() {
      // Scroll to the bottom
      $('html, body').animate({
        scrollTop: $(document).height()-$(window).height()},
        1400,
     );
    }

    flipCard(cardHTML) {
      $(cardHTML).find('.card-inner__front').toggleClass('hide');
      $(cardHTML).find('.card-inner__back').toggleClass('hide');
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

      // Set up array
      for (i; i <= 9; i++) {
        this.cards.push(
          new Card(i, 'http://placekitten.com/80/80') // Create the cards
        );
      }
    }
  }

  class Card {
    constructor(id, image) {
      this.id = id;
      this.image = image;
      this.isFlipped = false;
    }
  }

  let ui = new UI();
});