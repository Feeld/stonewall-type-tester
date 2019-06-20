          /* If you're feeling fancy you can add interactivity 
        to your site with Javascript */
      (function() {
          // prints "hi" in the browser's dev tools console
        const slider = document.querySelector('#font-size-slider');
        const textInput = document.querySelector('#font-input');
        const downloadLink = document.querySelector('#download-link')
        const canvasContainer = document.querySelector('#canvasContainer');

        slider.addEventListener('input', () => {
          textInput.style['font-size'] = slider.value + 'px'
        })

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

        const canvas = document.createElement('canvas');
        //canvasContainer.appendChild(canvas);

        function draw() {
          const textInputStyle = window.getComputedStyle(textInput)
          canvas.width = textInput.offsetWidth;
          canvas.height = textInput.offsetHeight;
          const contextLink = this;
          const ctx = canvas.getContext('2d');
          const desiredFontSize = slider.value * 0.85;
          ctx.fillStyle = "#fff"
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          ctx.fillStyle = "#000"
          ctx.font = `${desiredFontSize}px Stonewall`
          ctx.textBaseline = 'bottom'
          ctx.textAlign = 'center'
          const lines = getLines(ctx, textInput.innerText, canvas.width);

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
          const hiddenCanvas = document.createElement('canvas');
          hiddenCanvas.height = canvasHeight;
          hiddenCanvas.width = canvas.width;
          
          var ctx = hiddenCanvas.getContext('2d');
					ctx.fill = '#fff';
          ctx.fillRect(0, 0, hiddenCanvas.width, hiddenCanvas.height);
          ctx.drawImage(
              canvas,
              0,
              0,
              canvas.width,
              canvasHeight,
              0,
              0,
              canvas.width,
              canvasHeight
          );

          var dataURL = hiddenCanvas.toDataURL();
          this.href = dataURL;

        };
        downloadLink.addEventListener('click', download);
      })()
      
