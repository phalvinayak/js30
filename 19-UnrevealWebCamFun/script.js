const video = document.querySelector('.player');
const canvas = document.querySelector('.photo');
const ctx = canvas.getContext('2d');
const strip = document.querySelector('.strip');
const snap = document.querySelector('.snap');


function getVideo(){
    navigator.mediaDevices.getUserMedia({video: true, audio: false})
        .then(mediaSource => {
            video.srcObject = mediaSource;
            video.play();
        }).catch(err => {
            console.log(`OH NO!!!`, err);
        });
}

function paintToCanvas(){
    const width = video.videoWidth;
    const height = video.videoHeight;

    canvas.width = width;
    canvas.height = height;

    setInterval(() => {
        ctx.drawImage(video, 0, 0, width, height);
        // Take the pixels out
        let pixels = ctx.getImageData(0, 0, width, height);
        // Mess with them
        // pixels = redEffect(pixels);

        // pixels = rgbSplit(pixels);
        // ctx.globalAlpha = .8

        pixels = greenScreen(pixels);
        // Put them back
        ctx.putImageData(pixels, 0, 0);

    }, 16);
}

function takePhoto(){
    // Played the sound
    snap.currentTime = 0;
    snap.play();

    // Take the data out of the canvas
    const data = canvas.toDataURL('image/jpeg')
    const link = document.createElement('a');
    link.href = data;
    link.setAttribute('download', 'handsome');
    link.textContent = 'Download Image';
    strip.insertBefore(link, strip.firstChild);
    link.innerHTML = `<img src="${data}" alt="Photo" />`;
}

function redEffect(pixels){
    for(let i=0; i < pixels.data.length; i+=4){
        pixels.data[i+0] = pixels.data[i+0] + 100; // Red
        pixels.data[i+1] = pixels.data[i+1] - 50; // Green
        pixels.data[i+2] = pixels.data[i+2] * 0.5; // Blue
    }
    return pixels;
}


function rgbSplit(pixels){
    for(let i=0; i < pixels.data.length; i+=4){
        pixels.data[i-50] = pixels.data[i+0]; // Red
        pixels.data[i+200] = pixels.data[i+1]; // Green
        pixels.data[i-150] = pixels.data[i+2]; // Blue
    }
    return pixels;
}

function greenScreen(pixels){
    console.log(pixels);
    debugger;
    const levels = {};
    [...document.querySelectorAll('.rgb input')].forEach(input => {
        levels[input.name] = input.value;
    });
    for(let i=0; i < pixels.data.length; i+=4){
        let red = pixels.data[i+0];
        let green = pixels.data[i+1];
        let blue = pixels.data[i+2];
        let alpha = pixels.data[i+3];

        if(red >= levels.rmin
            && green >= levels.gmin
            && blue >= levels.bmin
            && red <= levels.rmax
            && green <= levels.gmax
            && blue <= levels.bmax){
                pixels.data[i+3] = 0.5;
        }
    }
    return  pixels;
}


getVideo();

video.addEventListener('canplay', paintToCanvas);