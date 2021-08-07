let purpleBack;
let startButton, title, username;
let pageState = "homePage", selectedSong = "none", submitSong, backButton, songOne, songTwo, songThree, pauseButton;
let frame = 0;

// video
let preventRepeat = 0;
let vid, audio;

let classifier;
let confidenceResult;
let imageModelURL = 'https://teachablemachine.withgoogle.com/models/dAFDJsIJ2/';
let video;
let flippedVideo;
let label = "";
let dancer;

let intendedMove = "Neutral";

function preload() {
  purpleBack = loadImage("purpleSplatter.jpg");
  classifier = ml5.imageClassifier(imageModelURL + 'model.json', modelLoaded);

  //Start classifying
  video = createCapture(VIDEO);
  video.size(400, 400); //keeping the dimensions the same to avoid stretch
  video.hide();
  flippedVideo = ml5.flipImage(video);

}

function modelLoaded() {
  console.log('Model Loaded!');
  classifyVideo();
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  // intro audio
  audio = new Audio('Dance.mp3');
  // creates a username based on user input in prompt
  username = prompt("Enter player name");
  if (username === null) {
    username = "dancer";
  }
  dancer = new Player(username);
}

function draw() {
  // changes pages
  if (pageState === "homePage") {
    homePage();
  } else if (pageState === "songSelection") {
    songSelection();
  } else if (pageState === "gamePlay") {
    gamePlay();
  }
}

function homePage() {
  // dont forget to play the theme audio
  audio.play();
  background(purpleBack, windowWidth, windowHeight);
  // text for animation of text
  titleAnimation();

  if (!startButton) {
    startButton = createButton("START");
  }

  setUpStartOrSubmit(startButton); //adds style elements to the button (font size, location etc.)
  startButton.mousePressed(changeToSong);
  //startButton.mousePressed(changeGameState("songSelection"));
}

function titleAnimation() {
  if (!title) {
    // creates a div, like in html
    title = createDiv('PRECISELY PRANCE');
  }
  // gets element from CSS, class = title in both CSS and JS
  title.addClass('title');
  title.position(width * 0.165, height / 2 - 40);
}

function songSelection() {
  if (title) {
    title.remove();
    title = null;
  }
  if (startButton) {
    startButton.remove();
    startButton = null;
  }
  if (vid) {
    vid.remove();
    vid = null;
  }

  // audio plays again after back button pressed in gamePlay
  audio.play();

  background(purpleBack, windowWidth, windowHeight);
  fill('white');
  textFont('neon');
  textSize(60);
  textAlign(LEFT);
  text('Choose your song:', 20, 60);
  let pinkColor = color('#d93c6e');

  // Song One
  if (!songOne) {
    songOne = createButton("RASPUTIN");
  }
  setUpSong(songOne, "Rasputin", (windowWidth / 2 - 600)); //adds style elements to the button (font size, location etc.)
  songOne.mousePressed(selectSongOne);

  // Song Two
  if (!songTwo) {
    songTwo = createButton("FIREWORK");
  }
  setUpSong(songTwo, "Firework", (windowWidth / 2 - 150)); //adds style elements to the button (font size, location etc.)
  songTwo.mousePressed(selectSongTwo);

  // Song Three
  if (!songThree) {
    songThree = createButton("MAMBO NO.5");
  }
  setUpSong(songThree, "Mambo No.5", (windowWidth / 2 + 330)); //adds style elements to the button (font size, location etc.)
  songThree.mousePressed(selectSongThree);

  if (!submitSong) {
    submitSong = createButton("DANCE!");
  }
  setUpStartOrSubmit(submitSong); //adds style elements to the button (font size, location etc.)
  submitSong.mousePressed(changeToGame);

  if (backButton) {
    backButton.remove();
    backButton = null;
  }
}

function gamePlay() {
  audio.pause();
  if (songOne) {
    songOne.remove();
    songOne = null;
  }
  if (songTwo) {
    songTwo.remove();
    songTwo = null;
  }
  if (songThree) {
    songThree.remove();
    songThree = null;
  }
  if (submitSong) {
    submitSong.remove();
    submitSong = null;
  }
  frame++;

  //let kate = new Player("Kate")
  // let dancer = new Player(username);
  //kate.updateScore();

  background(purpleBack, windowWidth, windowHeight);
  textSize(40);
  text(`SONG: ${selectedSong}`, 190, 50);
  text(`SCORE:${dancer.score}`, 150, 90);
  text(`Player: ${dancer.name}`, 170, 130);
  text(`MOVE: ${intendedMove}`, windowWidth / 2, height-150);
  // back button - to song selection page
  //backButton();
  //backToSongs();
  noStroke();

  if (preventRepeat === 0) {
    vid = createVideo("Rasputin.mp4", [callback]);
    vid.play();
    vid.position(windowWidth * 0.1, 200);
    preventRepeat++;
  }

  displayIntendedMove(dancer);
  image(flippedVideo, windowWidth * 0.6, 150);

  // insert back/start over button

  // Draw the label
  fill(255);
  textSize(25);
  textAlign(CENTER);
  //text(label, width / 2, height - 10);


  if (!backButton) {
    backButton = createButton("BACK");
  }
  setUpStartOrSubmit(backButton);
  backButton.mousePressed(backToSongs);
}

// change page;/
function backToSongs() {
  pageState = "songSelection";
  //songOne.show();
}

function changeToSong() {
  pageState = "songSelection";
}

function changeToGame() {
  pageState = "gamePlay";
}


function changeGameState(gameState) {
  pageState = gameState;
}

// song selections
function selectSongOne() {
  selectedSong = "Rasputin";
  selectedSongBorder(songOne, selectedSong);
}

function selectSongTwo() {
  selectedSong = "Firework";
  selectedSongBorder(songTwo, selectedSong);
}

function selectSongThree() {
  selectedSong = "Mambo No.5";
  selectedSongBorder(songThree, selectedSong);
}

function setUpSong(button, buttonName, xPosition) {
  let pinkColor = color('#d93c6e');
  button.style("background-color", pinkColor);
  button.size(300, 300);
  button.style("color", "white");
  button.style("font-size", "40px");
  if (selectedSong != buttonName) {
    button.style("border", "none");
  }
  button.style("font-family", "Bebas Neue", "cursive");
  button.position(xPosition, windowHeight / 2 - 150);
}

function setUpStartOrSubmit(button) {
  button.size(100, 40);
  button.style("background-color", "transparent")
  button.style("color", "white")
  button.style("font-size", "40px")
  button.style("border", "none")
  button.style("font-family", "Bebas Neue", "cursive");
  button.position(windowWidth / 2 - 45, windowHeight - 90);
}
// adds border style to selected song
function selectedSongBorder(button, buttonName) {
  button.style("border", "solid");
  button.style("border-width", "5px");
  button.style("border-color", "white");
}

// Get a prediction for the current video frame
function classifyVideo() {
  flippedVideo = ml5.flipImage(video)
  classifier.classify(flippedVideo, gotResult);
  flippedVideo.remove();
}

// When we get a result
function gotResult(error, results) {
  //displayIntendedMove();
  //console.log(results);
  // The results are in an array ordered by confidence.
  let classified = results[0];

  // If there is an error
  if (error) {
    console.error(error);
    return;
  }

  // prints score and class of image onto console
  if (pageState === "gamePlay") {
    textSize(25);
    textAlign(CENTER);
    //text('Label: ' + classified.label + ' Confidence: ' + classified.confidence, width / 2, height - 100);
  }
  //console.log(results[0]);
  label = results[0].label;
  confidenceResult= classified.confidence;

  // Get confidence score of current move
  // for (let i = 0; i < results.length; i++) {
  //   //if (results[i].label === 'Left Arm Up') {
  //   if (results[i].label === intendedMove) {
  //     console.log('add this score to Left Arm Up: ' + results[i].confidence);
  //     dancer.score += results[i].confidence;
  //   }
  // }

  //prints out the confidence scores for each label
  //console.log(results)

  // Classify again
  classifyVideo();
}


class Player {
  constructor(name) {
    this.name = name;
    this.score = 0;
  }

  updateScore() {
    text(`SCORE:${this.score}`, 100, 90);
  }

}

function callback() {
  vid.loop();
  vid.volume(0);
}

function displayIntendedMove(dancer) {
  //clapping takes around exactly one second

  if (vid.time() < 1.05) {
    intendedMove = "Neutral";
    // dancer.score += 1;
    // console.log(dancer.score);
   // dancer.updateScore();
    console.log(label)
    if (label === "Neutral")
      dancer.score += Math.round( 10 * confidenceResult);
  }
  else if (vid.time() < 1.8) {
    intendedMove = "Clapping";
    if (label === "Clapping")
      dancer.score += Math.round(10 * confidenceResult);
  }
  else if (vid.time() < 3) {
    intendedMove = "Neutral";
    if (label === "Neutral")
      dancer.score += Math.round(10 * confidenceResult);
  }
  else if (vid.time() < 3.925) {
    intendedMove = "Clapping";
    if (label === "Clapping")
      dancer.score += Math.round(10 * confidenceResult);
  }
  else if (vid.time() < 4.83) {
    intendedMove = "Neutral";
    if (label === "Neutral")
      dancer.score += Math.round(10 * confidenceResult);
  }
  else if (vid.time() < 5.755) {
    intendedMove = "Clapping";
    if (label === "Clapping")
      dancer.score += Math.round(10 * confidenceResult);
  }
  else if (vid.time() < 6.65) {
    intendedMove = "Neutral";
    if (label === "Neutral")
      dancer.score += Math.round(10 * confidenceResult);
  }
  else if (vid.time() < 7.6) {
    intendedMove = "Clapping";
    if (label === "Clapping")
      dancer.score += Math.round(10 * confidenceResult);
  }
  else if (vid.time() < 8.45) {
    intendedMove = "Neutral";
    if (label === "Neutral")
      dancer.score += Math.round(10 * confidenceResult);
  }
  else if (vid.time() < 9.6) {
    intendedMove = "Clapping";
    if (label === "Clapping")
      dancer.score += Math.round(10 * confidenceResult);
  }
  else if (vid.time() < 10.6) {
    intendedMove = "Neutral";
    if (label === "Neutral")
      dancer.score += Math.round(10 * confidenceResult);
  }
  else if (vid.time() < 11.6) {
    intendedMove = "Left-Arm Up";
    if (label === "Left Arm Up")
      dancer.score += Math.round(10 * confidenceResult);
  }
  else if (vid.time() < 12.6) {
    intendedMove = "Right-Arm Up";
     if (label === "Right Arm Up")
      dancer.score += Math.round(10 * confidenceResult);
  }
  else if (vid.time() < 13.6) {
    intendedMove = "Left-Arm Up";
    if (label === "Left Arm Up")
      dancer.score += Math.round(10 * confidenceResult);
  }
  else if (vid.time() < 14.6) {
    intendedMove = "Right-Arm Up";
     if (label === "Right Arm Up")
      dancer.score += Math.round(10 * confidenceResult);
  }
  else if (vid.time() < 15.6) {
    intendedMove = "Left-Arm Up";
    if (label === "Left Arm Up")
      dancer.score += Math.round(10 * confidenceResult);
  }
  else if (vid.time() < 16.6) {
    intendedMove = "Right-Arm Up";
     if (label === "Right Arm Up")
      dancer.score += Math.round(10 * confidenceResult);
  }
  else if (vid.time() < 17.6) {
    intendedMove = "Left-Arm Up";
    if (label === "Left Arm Up")
      dancer.score += Math.round(10 * confidenceResult);
  }
  else if (vid.time() < 18.6) {
    intendedMove = "Right-Arm Up";
     if (label === "Right Arm Up")
      dancer.score += Math.round(10 * confidenceResult);
  }
  else if (vid.time() < 19.6) {
    intendedMove = "Left-Arm Up";
    if (label === "Left Arm Up")
      dancer.score += Math.round(10 * confidenceResult);
  }
  else if (vid.time() < 20.6) {
    intendedMove = "Right-Arm Up";
     if (label === "Right Arm Up")
      dancer.score += Math.round(10 * confidenceResult);
  }
  else if (vid.time() < 21.6) {
    intendedMove = "Left-Arm Up";
    if (label === "Left Arm Up")
      dancer.score += Math.round(10 * confidenceResult);
  }
  else if (vid.time() < 22.6) {
    intendedMove = "Right-Arm Up";
     if (label === "Right Arm Up")
      dancer.score += Math.round(10 * confidenceResult);
  }
  else if (vid.time() < 23.6) {
    intendedMove = "Left-Arm Up";
    if (label === "Left Arm Up")
      dancer.score += Math.round(10 * confidenceResult);
  }
  else if (vid.time() < 24.6) {
    intendedMove = "Right-Arm Up";
     if (label === "Right Arm Up")
      dancer.score += Math.round(10 * confidenceResult);
  }
  else if (vid.time() < 25.6) {
    intendedMove = "Left-Arm Up";
    if (label === "Left Arm Up")
      dancer.score += Math.round(10 * confidenceResult);
  }
  else if (vid.time() < 26.6) {
    intendedMove = "Right-Arm Up";
     if (label === "Right Arm Up")
      dancer.score += Math.round(10 * confidenceResult);
  }
  else if (vid.time() < 34.1) {
    intendedMove = "Right Angle Arm Movement";
  }
  else if (vid.time() < 45.6) {
    intendedMove = "Squat To Star Jump";
  }

  //left arm up lasts :1 second
  //Right arm up lasts 1 second
}

