/*
Create an array containing each card type, represented by a Font Awesome class
name. A pair of cards will be created for each card type in the forEach()
method that follows. The missing 'fa-' prefix will be added to each card when
its HTML is created.
*/
let cardList = [
    'diamond',
    'paper-plane-o',
    'anchor',
    'bolt',
    'cube',
    'leaf',
    'bicycle',
    'bomb'
];

// Add a copy of each card type to the cardList array to create pairs of cards
cardList.forEach(function(card) {
    cardList.push(card);
});

// Display the cards on the page
function displayCards() {
    // Shuffle the list of cards
    cardList = shuffle(cardList);

    // Create a fragment to reduce reflow and repaint
    const fragment = document.createDocumentFragment();

    // Loop through each card and create its HTML
    for (const card of cardList) {
        // Create a list item element for each card
        const cardElem = document.createElement('li');
        cardElem.classList.add('card');

        // Create a string variable containing each card's HTML text
        const cardHTML = `<i class="fa fa-${card}"></i>`;

        // Parse each card's text as HTML and insert it into the card element
        cardElem.insertAdjacentHTML('beforeend', cardHTML);

        // Append each card element to the document fragment
        fragment.appendChild(cardElem);
    }

    // Select the deck element
    const deck = document.querySelector('.deck');

    // Append the document fragment to the deck element
    deck.appendChild(fragment);
}

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}


/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */
