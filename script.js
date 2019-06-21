/* If you're feeling fancy you can add interactivity
        to your site with Javascript */
(function() {
  // prints "hi" in the browser's dev tools console
  const slider = document.querySelector('#font-size-slider');
  const colorPicker = document.querySelector('.colorPicker');
  const textInput = document.querySelector('#font-input');
  const downloadLink = document.querySelector('#download-link')
  const canvasContainer = document.querySelector('#canvasContainer');
  const viewerContainer = document.querySelector('.viewer');
  const viewerContainer2 = document.querySelector('.viewer2');
  const hiddenCanvas = document.createElement('canvas');
  const canvas = document.createElement('canvas');

  viewerContainer.appendChild(hiddenCanvas);
  viewerContainer2.appendChild(canvas);

  slider.addEventListener('input', () => {
    textInput.style['font-size'] = slider.value + 'px'
  })

  const colors = {
    black: "#111913",
    white: "#FFFFFF",
    red: "#FF401D",
  }

  function getLines(ctx, text, maxWidth) {
    var words = text.split(" ");
    var lines = [];
    var currentLine = words[0];

    for (var i = 1; i < words.length; i++) {
      var word = words[i];
      var width = ctx.measureText(currentLine + " " + word).width;
      if (width < maxWidth) {
        currentLine += " " + word;
      } else {
        lines.push(currentLine);
        currentLine = word;
      }
    }
    lines.push(currentLine);
    return lines;
  }

  let bgColor = colors.white;
  let fgColor = colors.black;

  let selectedBgColor = 'white';
  let selectedFgColor = 'black';

  function draw() {
    const textInputStyle = window.getComputedStyle(textInput)
    canvas.width = textInput.offsetWidth;
    canvas.height = textInput.offsetHeight;
    const contextLink = this;
    const ctx = canvas.getContext('2d');
    const desiredFontSize = slider.value * 0.85 | 0;
    ctx.font = `${desiredFontSize}px Stonewall`

    const ps = textInput.innerText.split('\n')

    const lines = ps.reduce((ls, p) => {
      return ls.concat(getLines(ctx, p, canvas.width))
    }, []);
    let step = 16;
    let fontSize = desiredFontSize;
    const estimatedHeight = step + fontSize * lines.length;

    canvas.width = textInput.offsetWidth;
    canvas.height = Math.max(estimatedHeight, canvas.height);

    ctx.font = `${fontSize}px Stonewall`;
    ctx.textBaseline = 'bottom'
    ctx.textAlign = 'center'
    ctx.fillStyle = bgColor;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = fgColor;


    for (const line of lines) {
      let { width } = ctx.measureText(line);
      while (width > canvas.width ) {
        fontSize *= 0.95;
        ctx.font = `${fontSize}px Stonewall`;
        width = ctx.measureText(line).width;
      }

      step += fontSize * 0.9;
      ctx.font = `${fontSize}px Stonewall`;
      ctx.fillText(line, canvas.width/2, step);
      ctx.font = `${desiredFontSize}px Stonewall`
    }

    return step + 16;
  }


  function download() {

    const canvasHeight = draw();
    hiddenCanvas.height = Math.max(canvasHeight, canvas.height);
    hiddenCanvas.width = canvas.width;

    var ctx = hiddenCanvas.getContext('2d');
    ctx.fillStyle = bgColor;
    ctx.clearRect(0, 0, hiddenCanvas.width, hiddenCanvas.height);
    ctx.fillRect(0, 0, hiddenCanvas.width, hiddenCanvas.height);

    const startY = (hiddenCanvas.height - canvasHeight) / 2

    ctx.drawImage(
      canvas,
      0,
      startY,
    );

    const stamp = stamps[selectedFgColor];
    const logo = logos[selectedFgColor];

    const marginWidth = hiddenCanvas.width * 0.05;
    const stampWidth = hiddenCanvas.width * 0.1;
    const stampHeight = stampWidth *  (stamp.height / stamp.width);

    ctx.drawImage(
      logo,
      marginWidth,
      marginWidth,
      stampWidth,
      stampWidth,
    )


    ctx.drawImage(
      stamp,
      hiddenCanvas.width - (stampWidth + marginWidth),
      hiddenCanvas.height - (stampHeight + marginWidth),
      stampWidth,
      stampHeight,
    )

    var dataURL = hiddenCanvas.toDataURL();
    this.href = dataURL;

  };


  function handleChangeColor(e) {
    e.preventDefault();
    if (!e.target.classList.contains('color')) {
      return;
    }

    if (e.target.classList.contains('selected')) {
      return;
    }

    const type = e.target.classList.contains('fg') ? 'fg' : 'bg';

    colorPicker.querySelector(`.${type}.color.selected`)
      .classList.remove('selected');
    e.target.classList.add('selected');

    const colorList = Object.keys(colors);

    const selectedColor = colorList.find(c => e.target.classList.contains(c));

    if (type === 'bg') {
      selectedBgColor = selectedColor;
      bgColor = colors[selectedColor];
    } else {
      selectedFgColor = selectedColor;
      fgColor = colors[selectedColor];
    }

    setColors();

  }


  function setColors() {
    textInput.style['color'] = fgColor;
    textInput.style['background-color'] = bgColor;
  }

  const logos = {};
  const stamps = {};

  function loadImages() {
    Object.keys(colors).map(c => {

      const logoImg = document.createElement('img');
      logoImg.src = `./assets/logo-${c}.svg`;
      logos[c] = logoImg

      const stampImg = document.createElement('img');
      stampImg.src = `./assets/stamp-${c}.svg`;
      stamps[c] = stampImg

    })

  }


  function startup() {
    loadImages();
    console.log('starting up')
    downloadLink.addEventListener('click', download);
    colorPicker.addEventListener('click', handleChangeColor);
    setColors();
  }

  window.onload = startup;

})()

