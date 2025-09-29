fetch("https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1")
  .then(response => response.json())
  .then(data => {
    console.log(data);
  })
  .catch(error => {
    console.error("Error:", error);
  });

const myFunction = () => {
  console.log('hello, world!');
}
