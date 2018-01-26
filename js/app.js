// Create an object that contains properties specific to the score panel
const scorePanel = {
    // Set up the score panel
    setup() {
        this.selectComponents();
        this.addRestartBtnListener();
    },
    selectComponents() {
        // Select the timer elements
        this.timerElem = document.querySelector('.timer');
        this.minutesElem = document.querySelector('.minutes');
        this.secondsElem = document.querySelector('.seconds');
        this.mSecondsElem = document.querySelector('.m-seconds');

        // Select the star elements as a list (HTMLCollection)
        this.starElems = document.getElementsByClassName('fa-star');

        // Select the move counter element
        this.moveCounterElem = document.querySelector('.moves');
    },
    /*
    Select the last star in the list and replace its star icon with
    an empty star.
    */
    replaceStarIcon() {
        const lastIndex = this.starElems.length - 1;
        this.starElems[lastIndex].classList.replace('fa-star', 'fa-star-o');
    },
    /*
    Update the move counter element's textContent property with the value
    passed in.
    */
    updateMoveCounterElem(value) {
        this.moveCounterElem.textContent = value;
    },
    // Update the timer with the values passed in
    updateTimer(mSec, sec, min) {
        this.mSecondsElem.textContent = mSec;
        this.secondsElem.textContent = sec;
        this.minutesElem.textContent = min;
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

/*
Create an object that contains properties specific to the modal. The modal is
hidden until the game is won.
*/
const modal = {
    // Set up the modal by selecting and storing the relevant elements
    setup() {
        this.selectComponents();
        this.addPlayAgainBtnListener();
    },
    // Select and store the elements necessary for the modal
    selectComponents() {
        // Select the deck
        this.deckContainerElem = document.querySelector('.container');

        // Select the actual modal
        this.modalElem = document.querySelector('.modal');

        // Select the moves total element
        this.movesTotalElem = document.querySelector('.moves-total');

        // Select the stars total element
        this.starsTotalElem = document.querySelector('.stars-total');

        // Select the time element
        this.timeElem = document.querySelector('.time');
    },
    // Toggle the modal
    toggleModal() {
        const modalDisplay = this.modalElem.style.display;
        if (modalDisplay === 'none' || modalDisplay === '') {
            // Assign the appropriate values to the corresponding elements
            this.movesTotalElem.textContent = game.moveCounter;
            this.starsTotalElem.textContent = game.starsCount;

            /*
            Get the timer value, remove its whitespace, and then assign it to
            timeElem's textContent property. Use of the .replace() method,
            along with the RegExp, was made possible with the following Stack
            Overflow post: https://stackoverflow.com/a/6623263
            */
            const timerVal = scorePanel.timerElem.textContent;
            this.timeElem.textContent = timerVal.replace(/\s/g, '');

            // Hide the card deck
            this.deckContainerElem.style.display = 'none';

            // Display the modal
            this.modalElem.style.display = 'block';
        } else {
            // Hide the modal
            this.modalElem.style.display = 'none';

            // Display the card deck
            this.deckContainerElem.style.display = 'flex';
        }
    },
    // Add a click event listener to the 'play again' button
    addPlayAgainBtnListener() {
        const playAgainBtn = document.querySelector('.play-again-btn');

        /*
        The keyword 'this' is bound to the listener in order to maintain the
        correct context. In this case, 'this' refers to the modal object. The
        following Stack Overflow discussion was helpful:
        https://stackoverflow.com/q/13996263
        */
        playAgainBtn.addEventListener('click', function() {
            /*
            Disable the button to ensure there are no additional clicks. The
            following Stack Overflow post was used as a reference:
            https://stackoverflow.com/a/11719987
            */
            playAgainBtn.disabled = true;
            game.reset();
            this.toggleModal();

            // Enable the button when it is no longer visible
            playAgainBtn.disabled = false;
        }.bind(this));
    }
};

// Create an object that contains properties specific to the game
 const game = {
    start() {
        this.setProperties();
        scorePanel.setup();
        deck.setup();
        modal.setup();
    },
    reset() {
        this.setProperties();
        scorePanel.resetStarElems();
        scorePanel.updateMoveCounterElem(0);
        deck.resetDeck();
    },
    // Set (or reset) the game object properties
    setProperties() {
        this.openCardList =[];
        this.moveCounter = 0;
        this.starsCount = 3;
    },
    handleClick(card) {
        // Only start the timer on the first click of a new game
        if (this.moveCounter < 1 && this.openCardList.length < 1) {
            this.startTimer();
        }
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
    /*
    Start the timer. Initially sets a start time and continually subtracts from
    this time to get the elapsed time. Developed with help from the following
    resources:

    https://www.sitepoint.com/creating-accurate-timers-in-javascript
    https://stackoverflow.com/a/7910506
    */
    startTimer() {
        // Get an initial start time
        const start = new Date().getTime();

        // Pad the value with a leading zero if necessary
        function padWithZero(val) {
            return val > 9 ? val : "0" + val;
        }

        /*
        Using an interval, continually call the following function to simulate
        an onscreen timer. The returned interval ID is saved to an object
        property in order to cancel the interval later.
        */
        this.timer = setInterval(function() {
            const time = new Date().getTime() - start;
            const mSeconds = padWithZero(parseInt(time % 1000 / 10, 10));
            const seconds = padWithZero(parseInt(time / 1000 % 60, 10));
            const minutes = padWithZero(parseInt(time / 60000, 10));
            scorePanel.updateTimer(mSeconds, seconds, minutes);
        }, 10);
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
        /*
        Pass the move counter's incremented value to updateMoveCounterElem() as
        an argument.
        */
        scorePanel.updateMoveCounterElem(++this.moveCounter);
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
            // Stop the timer
            clearInterval(game.timer);

            // Display the modal
            modal.toggleModal();
        }
    }
 };

game.start();
