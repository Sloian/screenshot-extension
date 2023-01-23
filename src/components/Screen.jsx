import React from 'react';
import { useEffect, useState } from "react";
import CanvasDraw from 'react-canvas-draw';
import './Screen.css';

import ReactCrop from 'react-image-crop'
import 'react-image-crop/dist/ReactCrop.css';

// import { SketchField, Tools } from 'react-sketch';
window.addEventListener("beforeunload", function () {
  chrome.tabs.update(activeTab, { active: true });                            //Webkit, Safari, Chrome
});

const Screen = () => {

  const [urlImg, setUrlImg] = useState('');
  const [activeTab, setActiveTab] = useState(0)

  const [windowHeight, setWindowHeight] = useState(window.innerHeight);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  const [color, setColor] = useState('ffc600');
  const [brushRadius, setBrushRadius] = useState(10);
  const [lazyRadius, setLazyRadius] = useState(12);

  let saveableCanvas;


  useEffect(() => {
    chrome.runtime.sendMessage('get-user-data', (response) => {
      console.log(response)
      setUrlImg(response.url)
      setActiveTab(response.activeTab)
    });

  }, []);

  const downloadPage = () => {
    chrome.tabs.captureVisibleTab((dataUrl) => {
      chrome.downloads.download({
        filename: "screenshot.jpg",
        url: dataUrl
      })
    });
  }

  const [srcImg, setSrcImg] = useState(null);
  const [image, setImage] = useState(urlImg);
  const [crop, setCrop] = useState({ aspect: 16 / 9 });
  const [result, setResult] = useState(null);

  const handleImage = async (event) => {
    console.log('dsadas')
    console.log(event)
    setSrcImg(URL.createObjectURL(event.target.files[0]));
    console.log(srcImg)
    console.log(event.target.files[0]);
  };

  const cancelScreen = () => {
    const change = () => {
      window.close()
      chrome.tabs.update(activeTab, { active: true });
    }

    return change();
  }

  const getCroppedImg = async () => {
    try {
      console.log(image)
      const canvas = document.createElement("canvas");
      // debugger
      console.log(canvas.naturalWidth)
      const scaleX = image.naturalWidth / image.width;
      // debugger
      const scaleY = image.naturalHeight / image.height;
      // debugger
      canvas.width = crop.width;
      // debugger
      canvas.height = crop.height;
      const ctx = canvas.getContext("2d");
      // debugger
      ctx.drawImage(
        image,
        crop.x * scaleX,
        crop.y * scaleY,
        crop.width * scaleX,
        crop.height * scaleY,
        0,
        0,
        crop.width,
        crop.height
      );
      const base64Image = canvas.toDataURL("image/jpeg", 1);
      console.log(base64Image)
      setResult(base64Image);
      console.log(result);
    } catch (e) {
      console.log("crop the image");
    }
  };

  console.log(crop)

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log(result);
  }
  return (
    <div className='App'>
      {/*
      <SketchField width='1024px'
        height='768px'
        tool={Tools.Pencil}
        lineColor='black'
        lineWidth={3} /> */}



      {/* <div>
          <input
            type="file"
            accept="image/*"
            onChange={handleImage}
          />
        </div > */}

      <ReactCrop
        src={srcImg}
        onImageLoaded={setImage}
        crop={crop}
        onChange={(c) => setCrop(c)}
      >
        <CanvasDraw
          ref={canvasDraw => (saveableCanvas = canvasDraw)}
          imgSrc={urlImg}
          brushColor={color}
          brushRadius={brushRadius}
          lazyRadius={lazyRadius}
          canvasHeight={windowHeight}
          canvasWidth={windowWidth}
        >
        </CanvasDraw>
      </ReactCrop>
      {crop.height > 20 ? (
        <div>
          <button
            className='cropButton'
            style={{ position: 'absolute', top: `${crop.y + crop.height}px`, left: `${crop.x + crop.width + 20}px`, gap: '1', width: '50px', height: '50px' }}
            onClick={getCroppedImg}
          >
            Crop
          </button>
          <button
            className='cropButton'
            style={{ position: 'absolute', top: `${crop.y + crop.height - 60}px`, left: `${crop.x + crop.width + 20}px`, gap: '1', width: '50px', height: '50px' }}
            onClick={cancelScreen}
          >
            Cancel
          </button>
        </div>
      ) : ''}
      {
        result && (
          <div>
            <img src={result} alt="cropped image" />
          </div>
        )
      }
      {/* <ReactCrop
        src={src}
        crop={crop}
        ruleOfThirds
        onImageLoaded={onImageLoaded}
        onComplete={onCropComplete}
        onChange={(c) => setCrop(c)}
      >
        <img src={urlImg} />
      </ReactCrop> */}

      {/* {
        croppedImageUrl && (
          <img alt="Crop" style={{ maxWidth: "100%" }} src={croppedImageUrl} />
        )} */}

      {/* <ReactCrop
        src={src}
        crop={crop}
        ruleOfThirds
        onImageLoaded={this.onImageLoaded}
        onComplete={this.onCropComplete}
        onChange={this.onCropChange}
      /> */}
      {/* <div className='buttonsWrapper'>
        <button
          onClick={() => {
            chrome.tabs.captureVisibleTab((dataUrl) => {
              console.log(dataUrl)
              chrome.downloads.download({
                filename: "screenshot.jpg",
                url: dataUrl
              })
            });
          }}
        >
          GetDataURL
        </button>
        <button
          onClick={() => {
            localStorage.setItem(
              "savedDrawing",
              saveableCanvas.getSaveData(),
            );
            console.log(saveableCanvas.getSaveData())
          }}
        >
          Save
        </button>
        <button
          onClick={() => {
            saveableCanvas.eraseAll();
          }}
        >
          Erase
        </button>
        <button
          onClick={() => {
            saveableCanvas.undo();
          }}
        >
          Undo
        </button>
        <button
          onClick={() => {
            console.log(saveableCanvas.getDataURL());
            alert("DataURL written to console")
          }}
        >
          GetDataURL
        </button>
        <div>
          <label>Brush-Radius:</label>
          <input
            type="number"
            value={brushRadius}
            onChange={e =>
              brushRadius(brushRadius = parseInt(e.target.value, 10))
            }
          />
        </div>
        <div>
          <label>Lazy-Radius:</label>
          <input
            type="number"
            value={lazyRadius}
            onChange={e =>
              setLazyRadius(lazyRadius = parseInt(e.target.value, 10))
            }
          />
        </div> */}
    </div >


  );
};

export default Screen;


