import * as faceapi from 'face-api.js';

async function runModels(){
    return Promise.all([
        faceapi.nets.ssdMobilenetv1.loadFromUri('/models'),
        faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
        faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
        faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
    ])
}

async function getLabeledFaceDescriptions(image_url){
    return new Promise(async (resolve, reject) => {
       try{
            const image = new Image();
            image.src = image_url;

            image.onload = async () => {
                const detections = await faceapi
                    .detectSingleFace(image)
                    .withFaceLandmarks()
                    .withFaceDescriptor();

                resolve(new faceapi.LabeledFaceDescriptors('Identified', [
                    detections.descriptor
                ]))
            }

            image.onabort = () => {
                reject("Error upload image");
            }
        //    const image = await faceapi.fetchImage('./labels/haydaraka/q1.jpg');
           
       }
       catch(error){
           reject(error.message);
       }
       
   })   

}

async function faceRecognition(image_url){
    const video = document.getElementById("video");
    console.log(video, "video");
    let labeledFaceDescriptors = await getLabeledFaceDescriptions(image_url);
    let faceMatcher = new faceapi.FaceMatcher(labeledFaceDescriptors);

    video.addEventListener('play', async () => {
        const canvas = faceapi.createCanvasFromMedia(video);
        document.body.append(canvas);

        const displaySize = {
            width: video.width,
            height: video.height,
        }

        faceapi.matchDimensions(canvas, displaySize);

        setTimeout(async function checkFace(){
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

            results.forEach((result, index) => {
               console.log(result, "result");
            })

            setTimeout(checkFace, 5000);

        }, 5000)

    })
}



export {runModels, getLabeledFaceDescriptions, faceRecognition}