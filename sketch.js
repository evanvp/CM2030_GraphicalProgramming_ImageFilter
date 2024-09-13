/////////////////////////////////////
// COURSERA GRAPHICS PROGRAMMING
/////////////////////////////////////

//Commentary
//1. Dicuss your findings e.g. image thresholding using each colour channel
//Among five thresholding filters, R/B/G seperated thresholding seem a smoothier
//change in black/white value, and I also noticed the if a image contains certain colour 
//value more, we could see more white part in its threshold image. In my uploaded image,
//the red value is significantly greater than blue value across the image; as a result,
//blue threshold image goes darker faster, and this is also shown on non-threshold image.
//In blue channel separated image, the image is darker generally. 

//For CMY thredhold value, I notice a similar smoothier change in black/white value;
//however, there is one major different: the black/white parts are switched, due to CMY
//colour scheme is a invertion of RGB colour scheme.

//YCbCr threshold image changes faster, compared to other thredhold image. I used 
//mean method to get the pixel intensity to determine the threshold; however, Y-value
//and Cb/Cr are not weighted the same. Y value, an indicator in brightness level, 
//usually has wider value change. Thus, the threshold image has more weighted on 
//brightness change. To fix this issue, a normalization between Y and Cb/Cr could be 
//helpful.


//2. What problems have you faced and were you able to solve them?
//I was unfamiliar with colour schemes, and didn't know why different colour schemes
//are needed. With the documentation provided, I had a introduction to different
//colour schemes. For different purpose or tranmission protocal, different colour
//schemes might be applied; however, I was't quite understanding the conversion 
//formular among them still. I started to read the sources online and understand 
//the basic of colour converting, and finally, I worked out the basic converting 
//formula for RGB to CMY and to YCbCR.  


//3. Were you on target to successfully ocmplete you project? If not, 
//how would you address the issues and do things different? 

//Although the coding process for learner like me is not always easy. I could say 
//for this final project, the works have been done smoothly and on pace. With clear
//materials addressed during every classes and the little Hack-it DIY part, we have been equipped
//with essential skills to finish the project. Most of my codes or logic are adapted from
//the class, including pixel-based filter, block-pixels-based, and face detection techniques.
//The only challenge part is when I creating my extension for face switching. The idea
//of hold multiple faces switchings when multiple faces detected are terrifying me at first.
//With clear design and pseudocode process, I actually figured out how to solve the issue
//very soon.



//4. Also discuss you extensio and why it is a unique idea
//There are two extensions created. First one is just a colourful version of 
//pixalte filter we created for face detection keystroke change as instructed.
//The second is also an extension build on the face detection part. I applied an
//algorithm to get the next eligible face (face[4] > 4), and then applied to another function,
//which, will make the current detected face image placed to next eligible detected face. And 
//when there is no next available detected face, the function will place it into the 
//first detected face location as we have recorded at first. The idea takes the data 
//return by objectdetect.js library, and makes more complex functions based on those data.








var imgIn;
var wspace = 8;
var hspace = 12;

//thredholdslider4// 
var RThres;
var GThres;
var BThres;
var CMYThres;
var YThres;

//Face Detector adopted from class
var detector;
var classifier = objectdetect.frontalface;
var img;
var faceImg;
var faces;

//Input interaction
var mode;

//for blur matrix
var matrix = [
    [1/25, 1/25, 1/25, 1/25, 1/25],
    [1/25, 1/25, 1/25, 1/25, 1/25],
    [1/25, 1/25, 1/25, 1/25, 1/25],
    [1/25, 1/25, 1/25, 1/25, 1/25],
    [1/25, 1/25, 1/25, 1/25, 1/25]
];

//for pixelate filter
var BlockSize = 5;

function preload() {
    imgIn = loadImage("assets/source.jpg");
}
/////////////////////////////////////////////////////////////
function setup() {

    imgIn.resize(160,120);
    createCanvas((imgIn.width + wspace) * 3, (imgIn.height + hspace) * 5);
    mode = 1;

    RThres = createSlider(0, 255, 40);
    RThres.position((imgIn.width + wspace) * 2, 10);

    GThres = createSlider(0, 255, 40);
    GThres.position((imgIn.width + wspace) * 2, 30);

    BThres = createSlider(0, 255, 40);
    BThres.position((imgIn.width + wspace) * 2, 50);

    CMYThres = createSlider(0, 255, 120);
    CMYThres.position((imgIn.width + wspace) * 2, 70);

    YThres = createSlider(0, 255, 130);
    YThres.position((imgIn.width + wspace) * 2, 90);
    
    pixelDensity(1);
    
    capture = createCapture(VIDEO);
    capture.size(imgIn.width, imgIn.height);
    capture.hide();

    var scaleFactor = 1.2;
    detector = new objectdetect.detector(imgIn.width, imgIn.height, scaleFactor, classifier);
    faceImg = createImage(imgIn.width, imgIn.height);

   
}
/////////////////////////////////////////////////////////////
function draw() {
    background(255);
    
    image(imgIn, 0, 0);
    image(GB20(imgIn), imgIn.width + wspace, 0);

    //second row 
    image(RGBfilter(imgIn,"r"), 0, imgIn.height + hspace);
    image(RGBfilter(imgIn,"g"), imgIn.width + wspace, imgIn.height + hspace);
    image(RGBfilter(imgIn,"b"), (imgIn.width + wspace) * 2, imgIn.height + hspace);

    //third row
    image(RGBSlider(imgIn,"r"), 0, (imgIn.height + hspace) * 2);
    image(RGBSlider(imgIn,"g"), imgIn.width + wspace, (imgIn.height + hspace) * 2);
    image(RGBSlider(imgIn,"b"), (imgIn.width + wspace) * 2, (imgIn.height + hspace) * 2);

    //fourth row 
    image(imgIn, 0, (imgIn.height + hspace) * 3);
    image(RGBtoCMY(imgIn), imgIn.width + wspace, (imgIn.height + hspace) * 3);
    image(RGBtoYCbCr(imgIn), (imgIn.width + wspace) * 2, (imgIn.height + hspace) * 3);

    //fifth row
    image(capture, 0, (imgIn.height + hspace) * 4);
    image(RGBtoCMYSlider(imgIn), imgIn.width + wspace, (imgIn.height + hspace) * 4);
    image(RGBtoYCbCrSlider(imgIn), (imgIn.width + wspace) * 2, (imgIn.height + hspace) * 4);
   
    
    //video capture face detection 
    faceImg.copy(capture, 0, 0, capture.width, capture.height, 0, 0, capture.width, capture.height);
    faces = detector.detect(faceImg.canvas);

    strokeWeight(2);
    stroke(255);
    noFill();

    var firstFaceLocation = null; 

    for (var i=0; i<faces.length; i++){
        var face=faces[i];
        if (face[4] > 4){
            
            push();
            translate(0,(imgIn.height + hspace) * 4);
            rect(face[0], face[1], face[2], face[3]);
            
            filtered_face = FaceImgFilter(capture, face[0], face[1], face[2], face[3]);
            image(filtered_face, face[0], face[1]);

            if (firstFaceLocation === null) {
                firstFaceLocation = {
                    x: face[0],
                    y: face[1],
                    w: face[2],
                    h: face[3]
                };
            }

            if (mode === 6){
                var currentFaceIndex = i;
                switchToNextFaceAndApplyFilter(currentFaceIndex, firstFaceLocation);
            }

            pop();

        }
    }


}
/////////////////////////////////////////////////////////////

//keypressed for face detection filter changing
function keyPressed(){
    if (key === "1"){
        mode = 1;
    }

    if (key === "2"){
        mode = 2;
    }

    if (key === "3"){
        mode = 3;
    }


    if (key === "4"){
        mode = 4;
    }

    if (key === "5"){
        mode = 5;
    }

    if (key === "6"){
        mode = 6;
    }


}





//greyscale and brightness+20% filter
function GB20(img){
    var imgOut = createImage(img.width, img.height);
  
    imgOut.loadPixels();
    img.loadPixels();
  
    // read every pixel
    for (var x = 0; x < imgOut.width; x++) {
        for (var y = 0; y < imgOut.height; y++) {
  
            var index = (x + y * imgOut.width) * 4;
            
        
            var r = img.pixels[index + 0];
            var g = img.pixels[index + 1];
            var b = img.pixels[index + 2];

            var gray = r * 0.299 + g * 0.587 + b * 0.0114;

            //make it 20% brighter)
            gray = gray * 1.2;

            //make sure value is under 255
            if (gray > 255) gray = 255;

            imgOut.pixels[index + 0] = gray;
            imgOut.pixels[index + 1] = gray;
            imgOut.pixels[index + 2] = gray;
            imgOut.pixels[index + 3] = 255;
        }
    }
    imgOut.updatePixels();
    return imgOut;
  }
  
//R,G,B channel seperation filter
function RGBfilter(img,colour){
    var imgOut = createImage(img.width, img.height);
  
    imgOut.loadPixels();
    img.loadPixels();
  
    // read every pixel
    for (var x = 0; x < imgOut.width; x++) {
        for (var y = 0; y < imgOut.height; y++) {
  
            var index = (x + y * imgOut.width) * 4;
  
            var r = img.pixels[index + 0];
            var g = img.pixels[index + 1];
            var b = img.pixels[index + 2];

            switch(colour){
                case 'r': g = 0; 
                          b = 0;
                          break;
                case 'g': r = 0;
                          b = 0;
                          break;
                case 'b': r = 0;
                          g = 0;
                          break;
                default: break; 
            }

            imgOut.pixels[index + 0] = r;
            imgOut.pixels[index + 1] = g;
            imgOut.pixels[index + 2] = b;
            imgOut.pixels[index + 3] = 255;
        }
    }
    imgOut.updatePixels();
    return imgOut;
  }

//Advanced R,G,B sepration with slider
function RGBSlider(img,colour){
    var imgOut = createImage(img.width, img.height);
  
    imgOut.loadPixels();
    img.loadPixels();
  
    // read every pixel
    for (var x = 0; x < imgOut.width; x++) {
        for (var y = 0; y < imgOut.height; y++) {
  
            var index = (x + y * imgOut.width) * 4;
  
            var r = img.pixels[index + 0];
            var g = img.pixels[index + 1];
            var b = img.pixels[index + 2];

            var value;
            var slider;

            switch(colour){
                case 'r': value = r;
                          slider = RThres;
                          break;
                case 'g': value = g; 
                          slider = GThres;
                          break;
                case 'b': value = b;
                          slider = BThres;
                          break;
                default: break; 
            }

            var output;

            if (value > slider.value()){
                output = 255;
            }
            
            else{
                output = 0;
            }

            imgOut.pixels[index + 0] = output;
            imgOut.pixels[index + 1] = output;
            imgOut.pixels[index + 2] = output;
            imgOut.pixels[index + 3] = 255;
        }
    }
    imgOut.updatePixels();
    return imgOut;
  }

//RGB to CMY colour space
function RGBtoCMY(img){
    var imgOut = createImage(img.width, img.height);
  
    imgOut.loadPixels();
    img.loadPixels();
  
    // read every pixel
    for (var x = 0; x < imgOut.width; x++) {
        for (var y = 0; y < imgOut.height; y++) {
  
            var index = (x + y * imgOut.width) * 4;
  
            var r = img.pixels[index + 0];
            var g = img.pixels[index + 1];
            var b = img.pixels[index + 2];

            var cyan = 1 - r/255;
            var magenta = 1 - g/255;
            var yellow = 1 - b/255;

            imgOut.pixels[index + 0] = cyan * 255;
            imgOut.pixels[index + 1] = magenta * 255;
            imgOut.pixels[index + 2] = yellow * 255;
            imgOut.pixels[index + 3] = 255;
        }
    }
    imgOut.updatePixels();
    return imgOut;
  }

//RGB to YCbCr colour space
function RGBtoYCbCr(img){
    var imgOut = createImage(img.width, img.height);
  
    imgOut.loadPixels();
    img.loadPixels();
  
    // read every pixel
    for (var x = 0; x < imgOut.width; x++) {
        for (var y = 0; y < imgOut.height; y++) {
  
            var index = (x + y * imgOut.width) * 4;
  
            var r = img.pixels[index + 0];
            var g = img.pixels[index + 1];
            var b = img.pixels[index + 2];

            //var Yvalue = 0.2215 * r + 0.7154 * g + 0.0721 * b;
            //var Cb = -0.1145 * r - 0.3855 * g + 0.5 * b;
            //var Cr = 0.5016 * r - 0.4556 * g - 0.0459 * b;

            //var Yvalue = 0.299 * r + 0.587 * g + 0.114 * b;
            //var Cb = 0.564 * (b - Yvalue);
            //var Cr = 0.713 * (r - Yvalue);

            var Yvalue = 0.299 * r + 0.587 * g + 0.114 * b;
            var Cb = -0.169 * r - 0.331 * g + 0.5 * b + 128;
            var Cr = 0.5 * r - 0.419 * g - 0.081 * b + 128;


            imgOut.pixels[index + 0] = Yvalue;
            imgOut.pixels[index + 1] = Cb;
            imgOut.pixels[index + 2] = Cr;
            imgOut.pixels[index + 3] = 255;
        }
    }
    imgOut.updatePixels();
    return imgOut;
  }

//RGB to CMY with slider
function RGBtoCMYSlider(img){
    var imgOut = createImage(img.width, img.height);
  
    imgOut.loadPixels();
    img.loadPixels();
  
    // read every pixel
    for (var x = 0; x < imgOut.width; x++) {
        for (var y = 0; y < imgOut.height; y++) {
  
            var index = (x + y * imgOut.width) * 4;
  
            var r = img.pixels[index + 0];
            var g = img.pixels[index + 1];
            var b = img.pixels[index + 2];

            var cyan = 1 - r/255;
            var magenta = 1 - g/255;
            var yellow = 1 - b/255;

            var gray = ((cyan + magenta + yellow) / 3) * 255;
            var output;

            if (gray > CMYThres.value()){
                output = 255;
            }
            else{
                output = 0;
            }

            imgOut.pixels[index + 0] = output;
            imgOut.pixels[index + 1] = output;
            imgOut.pixels[index + 2] = output;
            imgOut.pixels[index + 3] = 255;
        }
    }
    imgOut.updatePixels();
    return imgOut;
  }

//RGB to YCbCr with slider
function RGBtoYCbCrSlider(img){
    var imgOut = createImage(img.width, img.height);
  
    imgOut.loadPixels();
    img.loadPixels();
  
    // read every pixel
    for (var x = 0; x < imgOut.width; x++) {
        for (var y = 0; y < imgOut.height; y++) {
  
            var index = (x + y * imgOut.width) * 4;
  
            var r = img.pixels[index + 0];
            var g = img.pixels[index + 1];
            var b = img.pixels[index + 2];

            var Yvalue = 0.299 * r + 0.587 * g + 0.114 * b;
            var Cb = -0.169 * r - 0.331 * g + 0.5 * b + 128;
            var Cr = 0.5 * r - 0.419 * g - 0.081 * b + 128;

          
            var gray = ((Yvalue + Cb + Cr) / 3);
            var output;

            if (gray > YThres.value()){
                output = 255;
            }
            else{
                output = 0;
            }

            imgOut.pixels[index + 0] = output;
            imgOut.pixels[index + 1] = output;
            imgOut.pixels[index + 2] = output;
            imgOut.pixels[index + 3] = 255;
        }
    }
    imgOut.updatePixels();
    return imgOut;
  }

//Detected face filter (Greyscale, blur, CMY, Pixelate)
function FaceImgFilter(source,x,y,w,h){
    facefilter = createImage(w,h);
    if(mode === 1){
        facefilter.copy(GB20(source), x, y, w, h, 0, 0, w, h);
    }

    if(mode === 2){
        facefilter.copy(blur(source), x, y, w, h, 0, 0, w, h);
    }
    
    if(mode === 3){
        facefilter.copy(RGBtoCMY(source), x, y, w, h, 0, 0, w, h);
    }

    if(mode === 4){
        facefilter.copy(pixelateFilter(GB20(source), BlockSize), x, y, w, h, 0, 0, w, h);
    }

    if(mode === 5){
        facefilter.copy(pixelateFilter2(source, BlockSize), x, y, w, h, 0, 0, w, h);
    }

    return facefilter;
}

//blur filter combo
function blur(img){
    var imgOut = createImage(img.width, img.height);
    var matrixSize = matrix.length;
  
    imgOut.loadPixels();
    img.loadPixels();
  
    // read every pixel
    for (var x = 0; x < imgOut.width; x++) {
        for (var y = 0; y < imgOut.height; y++) {
  
            var index = (x + y * imgOut.width) * 4;
            var c = convolution(x, y, matrix, matrixSize, img);
  
            imgOut.pixels[index + 0] = c[0];
            imgOut.pixels[index + 1] = c[1];
            imgOut.pixels[index + 2] = c[2];
            imgOut.pixels[index + 3] = 255;
        }
    }
    imgOut.updatePixels();
    return imgOut;
}

function convolution(x, y, matrix, matrixSize, img) {
    var totalRed = 0.0;
    var totalGreen = 0.0;
    var totalBlue = 0.0;
    var offset = floor(matrixSize / 2);

    // convolution matrix loop
    for (var i = 0; i < matrixSize; i++) {
        for (var j = 0; j < matrixSize; j++) {
            // Get pixel loc within convolution matrix
            var xloc = x + i - offset;
            var yloc = y + j - offset;
            var index = (xloc + img.width * yloc) * 4;
            // ensure we don't address a pixel that doesn't exist
            index = constrain(index, 0, img.pixels.length - 1);

            // multiply all values with the mask and sum up
            totalRed += img.pixels[index + 0] * matrix[i][j];
            totalGreen += img.pixels[index + 1] * matrix[i][j];
            totalBlue += img.pixels[index + 2] * matrix[i][j];
        }
    }
    // return the new color
    return [totalRed, totalGreen, totalBlue];
}

//pixelateFilter 
function pixelateFilter(img, blockSize) {

    var imgOut = createImage(img.width, img.height);

    imgOut.loadPixels();
    img.loadPixels();

    // Loop through blocks
    for (var blockX = 0; blockX < img.width; blockX += blockSize) {
        for (var blockY = 0; blockY < img.height; blockY += blockSize) {
            // Calculate the average pixel intensity of each block
            var totalIntensity = 0;

            // Loop through pixels in the block
            for (var x = blockX; x < blockX + blockSize; x++) {
                for (var y = blockY; y < blockY + blockSize; y++) {
                   var index = (x + y * img.width) * 4;
                   //not using image.get(x,y) as suggested 
                   totalIntensity += (img.pixels[index] + img.pixels[index + 1] + img.pixels[index + 2]) / 3;
                }
            }1

            // Calculate the average intensity
            var aveIntensity = totalIntensity / (blockSize * blockSize);


            // Paint the entire block using the average pixel intensity
            for (var x = blockX; x < blockX + blockSize; x++) {
                for (var y = blockY; y < blockY + blockSize; y++) {
                    imgOut.set(x, y, aveIntensity);
                }
            }
        }
    }

    imgOut.updatePixels();
    return imgOut;
}

// Extension: ColouredPixelateFilter
function pixelateFilter2(img, blockSize) {

    var imgOut = createImage(img.width, img.height);

    imgOut.loadPixels();
    img.loadPixels();

    // Loop through blocks
    for (var blockX = 0; blockX < img.width; blockX += blockSize) {
        for (var blockY = 0; blockY < img.height; blockY += blockSize) {
            // Calculate the average pixel intensity of each block
            var totalRed = 0;
            var totalGreen = 0;
            var totalBlue = 0;
            

            // Loop through pixels in the block
            for (var x = blockX; x < blockX + blockSize; x++) {
                for (var y = blockY; y < blockY + blockSize; y++) {
                   var index = (x + y * img.width) * 4;
                   //not using image.get(x,y) as suggested 
                   totalRed += img.pixels[index];
                   totalGreen += img.pixels[index + 1];
                   totalBlue += img.pixels[index + 2];
                }
            }

            // Calculate the average RGB value
            var aveRed= totalRed / (blockSize * blockSize);
            var aveGreen= totalGreen / (blockSize * blockSize);
            var aveBlue= totalBlue / (blockSize * blockSize);

            for (var x = blockX; x < blockX + blockSize; x++) {
                for (var y = blockY; y < blockY + blockSize; y++) {
                    var index = (x + y * imgOut.width) * 4;
                    imgOut.set(x,y,color(aveRed,aveGreen,aveBlue));
                }
            }
        }
    }

    imgOut.updatePixels();
    return imgOut;
}
 


//return the next available qualified face
function switchToNextQualifiedFace(currentFaceIndex) {
    // Iterate over the faces to find the next qualified face
    for (var i = currentFaceIndex + 1; i < faces.length; i++) {
        // was a + Index 
       // var index = i % faces.length;  // Wrap around to the start if we reach the end
        var face = faces[i];

        // Check if the face has a confident rate greater than 4
        if (face[4] > 4) {
            // Switch to the next qualified face
            currentFaceIndex = i;
            return face;
        }
    }

    // If no qualified faces found, return null or handle it as needed
    return null;
}

// Call this function when keypress === 6
function switchToNextFaceAndApplyFilter(currentFaceIndex, firstFaceLocation) {
    var nextQualifiedFace = switchToNextQualifiedFace(currentFaceIndex);

    if (nextQualifiedFace !== null) {
        var filtered_face = createImage(nextQualifiedFace[2], nextQualifiedFace[3]);

        // Copy the region from the captured image to the new image
        filtered_face.copy(capture, faces[currentFaceIndex][0], faces[currentFaceIndex][1], faces[currentFaceIndex][2], faces[currentFaceIndex][3], 0, 0, nextQualifiedFace[2], nextQualifiedFace[3]);

        push();
        // Display the new image
        image(filtered_face, nextQualifiedFace[0], nextQualifiedFace[1]);
        pop();
    }

    else {
        var filtered_face = createImage(firstFaceLocation.w, firstFaceLocation.h);
        filtered_face.copy(capture, faces[currentFaceIndex][0], faces[currentFaceIndex][1], faces[currentFaceIndex][2], faces[currentFaceIndex][3], 0, 0, firstFaceLocation.w, firstFaceLocation.h);

        image(filtered_face, firstFaceLocation.x, firstFaceLocation.y);
    }

   
}

