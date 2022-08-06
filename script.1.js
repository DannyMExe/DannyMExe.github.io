/* eslint-disable no-alert */

/**************
 *   SLICE 1
 **************/

function updateCoffeeView(coffeeQty) {
  document.getElementById('coffee_counter').innerText = coffeeQty;
}

function clickCoffee(data) {
  data.coffee+=1;
  updateCoffeeView(data.coffee);
  renderProducers(data);
}

/**************
 *   SLICE 2
 **************/

function unlockProducers(producers, coffeeCount) {
  producers.forEach(elem => {
    if(coffeeCount >= elem.price / 2) {
      elem.unlocked = true;
    }
  })
}

function getUnlockedProducers(data) {
  return data.producers.filter(elem => {
    return elem.unlocked ? true: false
  })
}

function makeDisplayNameFromId(id) {
  return id.split('_').map(elem => elem[0].toUpperCase() + elem.slice(1)).join(' ');
}

// You shouldn't need to edit this function-- its tests should pass once you've written makeDisplayNameFromId
function makeProducerDiv(producer) {
  const containerDiv = document.createElement('div');
  containerDiv.className = 'producer';
  const displayName = makeDisplayNameFromId(producer.id);
  const currentCost = producer.price;
  const html = `
  <div class="producer-column">
    <div class="producer-title">${displayName}</div>
    <button type="button" class='buy' id="buy_${producer.id}">Buy</button>
    <button type="button" class='sell' id="sell_${producer.id}">Sell</button>
  </div>
  <div class="producer-column">
    <div>Quantity: ${producer.qty}</div>
    <div>Coffee/second: ${producer.cps}</div>
    <div>Cost: ${currentCost} coffee</div>
  </div>
  `;
  containerDiv.innerHTML = html;
  return containerDiv;
}

function deleteAllChildNodes(parent) {
  while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}

function renderProducers(data) {
  let prodCont = document.getElementById('producer_container');
  unlockProducers(data.producers, data.coffee);
  deleteAllChildNodes(prodCont);
  getUnlockedProducers(data).forEach(elem => prodCont.appendChild(makeProducerDiv(elem)));
  
}

/**************
 *   SLICE 3
 **************/

function getProducerById(data, producerId) {
  let producers = data.producers;
  return producers.filter(elem => elem.id === producerId ? true: false)[0]
}

function canAffordProducer(data, producerId) {
  return (getProducerById(data, producerId).price <= data.coffee) ? true: false
  
}

function updateCPSView(cps) {
  let cpsElem = document.getElementById('cps');
  cpsElem.innerText = cps;
}

function updatePrice(oldPrice) {
  return Math.floor(oldPrice *1.25);
}

// function updatePriceSell(oldPrice) {
//   return Math.ceil(oldPrice * .8);
// }

function attemptToBuyProducer(data, producerId) {
  let canAfford = canAffordProducer(data, producerId);
  let producer = getProducerById(data, producerId);
  if(canAfford) {
    producer.qty ++;
    data.coffee -= producer.price;
    producer.price = updatePrice(producer.price);
    data.totalCPS += producer.cps;
  }
  return canAfford;
}

// function attemptToSellProducer(data, producerId) {
//   // let canAfford = canAffordProducer(data, producerId);
//   let producer = getProducerById(data, producerId);
//   let canAfford=false;
//   if(producer.qty > 0) {
//     canAfford=true;
//     producer.qty --;
//     data.coffee += Math.ceil(producer.price * .75);
//     producer.price = updatePriceSell(producer.price);
//     data.totalCPS -= producer.cps;
//   }
//   return canAfford;
// }

function buyButtonClick(event, data) {
  if(event.target.className === 'buy') {
    let id = event.target.id.slice(4);
    let canAfford = false;
    canAfford = attemptToBuyProducer(data, id);
    if(canAfford){
      renderProducers(data);
      updateCoffeeView(data.coffee);
      updateCPSView(data.totalCPS);
    }else{
      window.alert('Not enough coffee!');
    }
  } 
  // else if(event.target.className === 'sell') {
  //     let id = event.target.id.slice(5);
  //     let canAfford = false;
  //     canAfford = attemptToSellProducer(data, id);
  //     if(canAfford) {
  //       renderProducers(data);
  //       updateCoffeeView(data.coffee);
  //       updateCPSView(data.totalCPS);
  //     } else {
  //       window.alert(`Not enough ${makeDisplayNameFromId(id)} Producers`)
  //     }
  // }
}

// function saveGame(data) {
//   let gameState = JSON.stringify(data)
//   window.localStorage.setItem('game', gameState)
// }

// function restoreGame(data) {
//   let mySave = window.localStorage.getItem('game');
//   window.data = JSON.parse(mySave);
// }

function tick(data) {
  data.coffee += data.totalCPS;
  updateCoffeeView(data.coffee);
  renderProducers(data);
  updateCPSView(data.totalCPS);
}

/*************************
 *  Start your engines!
 *************************/

// You don't need to edit any of the code below
// But it is worth reading so you know what it does!

// So far we've just defined some functions; we haven't actually
// called any of them. Now it's time to get things moving.

// We'll begin with a check to see if we're in a web browser; if we're just running this code in node for purposes of testing, we don't want to 'start the engines'.

// How does this check work? Node gives us access to a global variable /// called `process`, but this variable is undefined in the browser. So,
// we can see if we're in node by checking to see if `process` exists.
if (typeof process === 'undefined') {
  // Get starting data from the window object
  // (This comes from data.js)
  let data = window.data
  // if(window.localStorage.getItem('game')) {
  //   data = JSON.parse(window.localStorage.getItem('game'));
  // }else{
  //   data = window.data;
  // }
  
  //Save and restore buttons
  // const save = document.getElementById('saveButton');
  // const restore = document.getElementById('restoreButton');
  // save.addEventListener('click', ()=> saveGame(data));
  // restore.addEventListener('click', ()=> restoreGame(data));

  // Add an event listener to the giant coffee emoji
  const bigCoffee = document.getElementById('big_coffee');
  bigCoffee.addEventListener('click', () => clickCoffee(data));

  // Add an event listener to the container that holds all of the producers
  // Pass in the browser event and our data object to the event listener
  const producerContainer = document.getElementById('producer_container');
  producerContainer.addEventListener('click', event => {
    buyButtonClick(event, data);
  });

  // Call the tick function passing in the data object once per second
  setInterval(() => tick(data), 1000);
}
// Meanwhile, if we aren't in a browser and are instead in node
// we'll need to exports the code written here so we can import and
// Don't worry if it's not clear exactly what's going on here;
// We just need this to run the tests in Mocha.
else if (process) {
  module.exports = {
    updateCoffeeView,
    clickCoffee,
    unlockProducers,
    getUnlockedProducers,
    makeDisplayNameFromId,
    makeProducerDiv,
    deleteAllChildNodes,
    renderProducers,
    updateCPSView,
    getProducerById,
    canAffordProducer,
    updatePrice,
    attemptToBuyProducer,
    buyButtonClick,
    tick
  };
}
