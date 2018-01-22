// Create an object that contains properties specific to the score panel
const scorePanel = {
    // Set up the score panel
    setup() {
        this.selectStarElems();
        this.addRestartBtnListener();
    },
    // Select the star elements as a list (HTMLCollection)
    selectStarElems() {
        this.starElems = document.getElementsByClassName('fa-star');
    },
    /*
    Select the last star in the list and replace its star icon with
    an empty star.
    */
    replaceStarIcon() {
        const lastIndex = this.starElems.length - 1;
        this.starElems[lastIndex].classList.replace('fa-star', 'fa-star-o');
    },
    // Add a click event listener to the restart button
    addRestartBtnListener() {
        const restartBtn = document.querySelector('.restart');
        restartBtn.addEventListener('click', function() {
            game.reset();
        });
    },
    // Reset the star icons if at least one has been removed
    resetStarElems() {
        if (this.starElems.length < 3) {
            const starListItems = document.querySelectorAll('.stars li');
            starListItems.forEach(function(starItem) {
                const star = starItem.firstElementChild;
                if (star.classList.contains('fa-star-o')) {
                    star.classList.replace('fa-star-o', 'fa-star');
                }
            });
        }
    }
};

// Create an object that contains properties specific to the card deck
const deck = {
    // Set up the card deck
    setup() {
        this.createCardList();
        this.displayCards();
        this.addEventListeners();
    },
    // Create the card list
    createCardList() {
        /*
        Create an array containing each card type, represented by a Font
        Awesome class name. A pair of cards will be created for each card type
        in the forEach() method that follows. The missing 'fa-' prefix will be
        added to each card when its HTML is created.
        */
        this.cardList = [
            'diamond',
            'paper-plane-o',
            'anchor',
            'bolt',
            'cube',
            'leaf',
            'bicycle',
            'bomb'
        ];

        /*
        Add a copy of each card type to the cardList array to create pairs
        of cards.
        */
        this.cardList.forEach(function(card, i, arr) {
            arr.push(card);
        });
    },
    // Display the cards on the page
    displayCards() {
        // Shuffle the list of cards
        this.cardList = this.shuffle(this.cardList);

        // Create a fragment to reduce reflow and repaint
        const fragment = document.createDocumentFragment();

        // Loop through each card and create its HTML
        for (const card of this.cardList) {
            // Create a list item element for each card
            const cardElem = document.createElement('li');
            cardElem.classList.add('card');

            // Create a string variable containing each card's HTML text
            const cardHTML = `<i class="fa fa-${card}"></i>`;

            /*
            Parse each card's text as HTML and insert it into the
            card element.
            */
            cardElem.insertAdjacentHTML('beforeend', cardHTML);

            // Append each card element to the document fragment
            fragment.appendChild(cardElem);
        }

        // Select the deck element
        const deckElem = document.querySelector('.deck');

        // Append the document fragment to the deck element
        deckElem.appendChild(fragment);
    },
    // Shuffle function from http://stackoverflow.com/a/2450976
    shuffle(array) {
        let currentIndex = array.length, temporaryValue, randomIndex;

        while (currentIndex !== 0) {
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;
            temporaryValue = array[currentIndex];
            array[currentIndex] = array[randomIndex];
            array[randomIndex] = temporaryValue;
        }

        return array;
    },
    // Add a click event listener to each card
    addEventListeners() {
        const cards = document.getElementsByClassName('card');
        for (let i = 0; i < cards.length; i++) {
            cards[i].addEventListener('click', function() {
                // Only handle a click if a card is not "open"
                if (!this.classList.contains('open')) {
                    game.handleClick(this);
                }
            });
        }
    },
    // Reset the card deck by clearing the cards and adding a new set
    resetDeck() {
        const cards = document.querySelectorAll('.card');
        cards.forEach(function(card) {
            card.remove();
        });
        this.displayCards();
        this.addEventListeners();
    }
};

// Create an object that contains properties specific to the game
 const game = {
    start() {
        this.setProperties();
        scorePanel.setup();
        deck.setup();
    },
    reset() {
        this.setProperties();
        deck.resetDeck();
    },
    // Set (or reset) the game object properties
    setProperties() {
        this.openCardList =[];
        this.moveCounter = 0;
        this.starsCount = 3;
    },
    handleClick(card) {
        this.displayCardSymbol(card);
        this.addCardToOpenList(card);

        /*
        Call the appropriate methods when a move has been made. This is
        determined by there being an even number of cards in the open
        cards list.
        */
        if (this.openCardList.length % 2 === 0) {
            this.incrementMoveCounter();
            this.removeStarIfNecessary();
            this.checkForMatch();
        }
    },
    // Display the card's symbol when clicked
    displayCardSymbol(card) {
        card.classList.add('open', 'show');
    },
    // Add the clicked card to a list of open cards
    addCardToOpenList(card) {
        this.openCardList.push(card);
    },
    // Increment the move counter and display its updated value on the page
    incrementMoveCounter() {
        // Select the move counter element
        const moveCounterElem = document.querySelector('.moves');

        /*
        Increment the move counter's value and assign it to the move counter
        element's textContent property.
        */
        moveCounterElem.textContent = ++this.moveCounter;
    },
    // Remove a star after 13 moves and another after 25 moves
    removeStarIfNecessary() {
        switch (this.moveCounter) {
            case 13:
            case 25:
                // Remove a star from the starsCount property
                this.starsCount--;

                /*
                Remove the last star from the set of stars on the score panel.
                This is accomplished by replacing the star's icon with an
                empty star.
                */
                scorePanel.replaceStarIcon();
        }
    },
    // Check if the two most recently added cards match
    checkForMatch() {
        // Get the index for the current and previous cards
        const currentIndex  = this.openCardList.length - 1;
        const previousIndex = this.openCardList.length - 2;

        // Using the indexes, get the current and previous cards
        const currentCard = this.openCardList[currentIndex];
        const previousCard = this.openCardList[previousIndex];

        // Get the symbol for each card
        const currentCardSymbol = currentCard.firstElementChild.classList[1];
        const previousCardSymbol = previousCard.firstElementChild.classList[1];

        // Now check if the symbols match
        if (currentCardSymbol === previousCardSymbol) {
            this.isGameOver();
        } else {
            this.handleMismatch(previousIndex, currentCard, previousCard);
        }
    },
    handleMismatch(previousIndex, currentCard, previousCard) {
        this.openCardList.splice(previousIndex, 2);
        setTimeout(function() {
            currentCard.classList.remove('open', 'show');
            previousCard.classList.remove('open', 'show');
        }, 800);
    },
    // Check if the game is over and take appropriate action
    isGameOver() {
        // If there are 16 cards in the open cards list, the game is over
        if (this.openCardList.length === 16) {
            this.displayModal();
        }
    },
    displayModal() {
        // Select the deck and hide it
        const deckContainerElem = document.querySelector('.container');
        deckContainerElem.style.display = 'none';

        // Select the hidden modal and display it
        const modalElem = document.querySelector('.modal');
        modalElem.style.display = 'block';

        /*
        Select the moves total element and change its textContent
        property to display the move counter's value.
        */
        const movesTotalElem = document.querySelector('.moves-total');
        movesTotalElem.textContent = this.moveCounter;

        /*
        Select the stars total element and change its textContent
        property to display the stars count value.
        */
        const starsTotalElem = document.querySelector('.stars-total');
        starsTotalElem.textContent = this.starsCount;
    }
 };

game.start();
