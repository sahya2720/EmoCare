const mouth = document.querySelector(".mouth");

// simulate bot speaking
function botTalk(duration = 2000) {
  mouth.classList.add("talking");

  setTimeout(() => {
    mouth.classList.remove("talking");
  }, duration);
}

// demo: bot talks every few seconds
setInterval(() => {
  botTalk(1500);
}, 5000);
