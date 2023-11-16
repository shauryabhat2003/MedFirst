// Assuming you have an array of places
var places = [
    { placeName: 'Baidyanath Memorial', contactInfo: '123-456-7890' },
    // Add more places as needed
  ];
  
  // Function to dynamically generate content for the frontSide of each card
  function generateCardFront(place) {
    return `
      <p class="title">${place.placeName}</p>
      <img src="./IMAGES/${place.placeName}.jpg" alt="${place.placeName}" id="${place.placeName.replace(/\s/g, '')}">
    `;
  }
  
  // Function to handle the "Call Now" button click
  function handleCallNowClick(place) {
    if (place.contactInfo) {
      alert(`Contact Now: ${place.contactInfo}`);
    } else {
      alert('Contact information not available');
    }
  }
  
  // Loop through places array and generate cards
  places.forEach(place => {
    // Create a new card element
    var newCard = document.createElement('div');
    newCard.className = 'myCard';
  
    // Create a new innerCard element
    var newInnerCard = document.createElement('div');
    newInnerCard.className = 'innerCard';
  
    // Generate content for the frontSide
    newInnerCard.querySelector('.frontSide').innerHTML = generateCardFront(place);
  
    // Add event listener for the "Call Now" button
    newInnerCard.querySelector('.call-now-button').addEventListener('click', function() {
      handleCallNowClick(place);
    });
  
    // Append the innerCard to the card
    newCard.appendChild(newInnerCard);
  
    // Append the card to the document or a container
    document.body.appendChild(newCard);
  });
  