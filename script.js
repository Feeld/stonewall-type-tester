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


  function draw() {
    const textInputStyle = window.getComputedStyle(textInput)
    canvas.width = textInput.offsetWidth;
    canvas.height = textInput.offsetHeight;
    const contextLink = this;
    const ctx = canvas.getContext('2d');
    const desiredFontSize = slider.value * 0.85;
    ctx.fillStyle = bgColor;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = fgColor;
    ctx.font = `${desiredFontSize}px Stonewall`
    ctx.textBaseline = 'bottom'
    ctx.textAlign = 'center'

    const ps = [];

    textInput.querySelectorAll('p').forEach(p => ps.push(p.innerText))

    const lines = ps.reduce((ls, p) => {
      return ls.concat(getLines(ctx, p, canvas.width))
    }, []);
    debugger;
    let step = 16;
    let fontSize = desiredFontSize;
    for (const line of lines) {
      let { width } = ctx.measureText(line);

      while (width > canvas.width ) {
        fontSize *= 0.99;
        ctx.font = `${fontSize}px Stonewall`;
        width = ctx.measureText(line).width;
      }

      step += fontSize * 0.9;
      ctx.fillText(line, canvas.width/2, step);
      ctx.font = `${desiredFontSize}px Stonewall`
    }

    return step + 16;
  }


  function download() {

    const canvasHeight = draw();
    hiddenCanvas.height = Math.max(canvasHeight, canvas.height);
    hiddenCanvas.width = canvas.width;

    console.log('exporting: ', canvasHeight, canvas.width)

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
      bgColor = colors[selectedColor];
    } else {
      fgColor = colors[selectedColor];
    }

    setColors();

  }


  function setColors() {
    textInput.style['color'] = fgColor;
    textInput.style['background-color'] = bgColor;
  }


  function startup() {
    console.log('starting up')
    downloadLink.addEventListener('click', download);
    colorPicker.addEventListener('click', handleChangeColor);
    setColors();
  }

  window.onload = startup;

})()

