const charactersURL = 'https://gateway.marvel.com:443/v1/public/events/29/characters?limit=100&apikey=04f1f49d05385db43361a299cc5ef1bc';
const charactersElement = document.querySelector('.characters');
const snapElement = document.querySelector('#snap');
const thanosElement = document.querySelector('#thanos');
const clickThanosElement = document.querySelector('#click-thanos');
const theTruth = document.querySelector('#the-truth');

const introSound = document.querySelector('#intro-sound');
const snapSound = document.querySelector('#snap-sound');
const funeralSound = document.querySelector('#funeral-sound');

//audioElement.play();
snapElement.style.opacity = '0';

function getCharactersData() {
  if(localStorage.charactersData) {
    return Promise.resolve(JSON.parse(localStorage.charactersData));
  }

  return fetch(charactersURL)
    .then(response => response.json())
    .then(data => {
      localStorage.charactersData = JSON.stringify(data);
      return data;
    });
}

const hiddenCharacters = {
  1009652: true,
  1009165: true,
  1009726: true,
  1009299: true
};

function addCharactersToPage(charactersData){
  charactersElement.innerHTML = '';
  charactersData.data.results.forEach(result => {
    if(!hiddenCharacters[result.id]){
      const characterImage = result.thumbnail.path + '/standard_medium.jpg';
      const characterElement = document.createElement('div');
      characterElement.style.transform = 'scale(1)';
      characterElement.className = "character alive";

      const imageElement = document.createElement('img');
      imageElement.src = characterImage;
      characterElement.appendChild(imageElement);

      const characterName = result.name.replace(/\(.*\)/,'');
      const characterNameElement = document.createElement('h3');
      characterNameElement.textContent = characterName;
      characterElement.appendChild(characterNameElement);

      charactersElement.appendChild(characterElement);
    }
  });
  thanosElement.classList.add('hover');
  thanosElement.addEventListener('click', thanosClick);
  clickThanosElement.style.opacity = '1';
}

getCharactersData()
  .then(addCharactersToPage);

function thanosClick(){
  clickThanosElement.style.opacity = '0';
  thanosElement.classList.remove('hover');
  introSound.play();
  thanosElement.removeEventListener('click', thanosClick);
  charactersElement.style.opacity = '0.2';
  snapElement.style.opacity = '1';

  setTimeout(() => {
    introSound.pause();
    snapSound.play();
    snapElement.style.opacity = '0';

    setTimeout(() => {
      funeralSound.play();
      balanceUniverse();
    }, 2000);
  }, 4000);
}

function balanceUniverse() {
  const characters = [...document.querySelectorAll('.character')];
  //console.log(characters);
  let leftToDie = Math.floor(characters.length/2);
  charactersElement.style.opacity = '1';
  kill(characters, leftToDie);
}

function kill(characters, leftToDie) {
  if(leftToDie>0){
    const random = Math.floor(Math.random() * characters.length);
    const [characterChosen] = characters.splice(random, 1);

    characterChosen.style.opacity = '0.2';
    characterChosen.classList.remove('alive');
    characterChosen.classList.add('dead');

    setTimeout(() => {
      characterChosen.style.transform = 'scale(0)';
      characterChosen.style.height = '0px';
      characterChosen.style.width = '0px';
      kill(characters, leftToDie-1);
    }, 1000);
  } else {
    theTruth.style.opacity = '1';
    funeralMusic();
  }
}

function funeralMusic() {
  funeralSound.play();
  setTimeout(() => {
    funeralSound.pause();
  },5000);
}
