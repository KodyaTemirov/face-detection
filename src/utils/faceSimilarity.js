import * as faceapi from 'face-api.js';

async function runModels(){
    return Promise.all([
        faceapi.nets.ssdMobilenetv1.loadFromUri('/models'),
        faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
        faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
        faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
    ])
}

async function getLabeledFaceDescriptions(base64){
    return new Promise(async (resolve, reject) => {
       try{
            const img = await faceapi.fetchImage(base64);
            const detections = await faceapi
                    .detectSingleFace(img, new faceapi.TinyFaceDetectorOptions())
                    .withFaceLandmarks()
                    .withFaceDescriptor();

                if(detections){
                    resolve(new faceapi.LabeledFaceDescriptors('Identified', [
                        detections.descriptor
                    ]))
                }
                else{
                    reject("Error upload image"); 
                }
                
            }

          
        //    const image = await faceapi.fetchImage('./labels/haydaraka/q1.jpg');
       catch(error){
           reject(error.message);
       }
       
   })   

}

async function faceRecognition(video, base64){
    let labeledFaceDescriptors = await getLabeledFaceDescriptions(base64);
    let faceMatcher = new faceapi.FaceMatcher(labeledFaceDescriptors);

    const canvas = faceapi.createCanvasFromMedia(video);
    document.body.append(canvas);

    const displaySize = {
        width: video.videoWidth,
        height: video.videoHeight,
    }

    faceapi.matchDimensions(canvas, displaySize);

    const detections = await faceapi
        .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions({
            inputSize: 512, // Увеличиваем размер входного изображения для более дальнего обнаружения
            scoreThreshold: 0.1 // Устанавливаем нижний порог для точности детектора
        }))
        .withFaceLandmarks()
        .withFaceDescriptors();

    const resizedDetections = faceapi.resizeResults(detections, displaySize);

    canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);

    const results = resizedDetections.map(detection => {
        return faceMatcher.findBestMatch(detection.descriptor);
    })

    results.forEach(result => {
        console.log(result, "result");
    })


    // video.addEventListener('playing', async () => {
    //     console.log("played");
        

    //     setTimeout(async function checkFace(){
           
    //         setTimeout(checkFace, 5000);

    //     }, 5000)

    // })
}



export {runModels, getLabeledFaceDescriptions, faceRecognition}