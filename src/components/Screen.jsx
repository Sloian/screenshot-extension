import React from 'react';
import { useEffect, useState, useRef } from "react";
import './Screen.css';
import ReactCrop from 'react-image-crop'
import 'react-image-crop/dist/ReactCrop.css';
import { useDebounceEffect } from './useDebounceEffect'
import { imgPreview } from './imgPreview';
// import FreeHandDraw from './FreeHandDraw';
import Canvas from './Canvas';
import { Stage, Layer, Rect, Text, Circle, Line } from 'react-konva';
import SceneWithDrawables from './classTools';
import ConvaReact from './reactConva';

import hor_copy from '../assets/icons/toolbar_res/hor_copy.png'
import hor_print from '../assets/icons/toolbar_res/hor_print.png'
import hor_save from '../assets/icons/toolbar_res/hor_save.png'
import hor_search from '../assets/icons/toolbar_res/hor_search.png'
import hor_upload from '../assets/icons/toolbar_res/hor_upload.png'
import hor_close from '../assets/icons/toolbar_res/hor_close.png'
import hor_share from '../assets/icons/toolbar_res/hor_share.png'

import draw_pencil from '../assets/icons/toolbar_res/draw_pencil.png'
import draw_line from '../assets/icons/toolbar_res/draw_line.png'
import draw_arrow from '../assets/icons/toolbar_res/draw_arrow.png'
import draw_rectangle from '../assets/icons/toolbar_res/draw_rectangle.png'
import draw_marker from '../assets/icons/toolbar_res/draw_marker.png'
import draw_text from '../assets/icons/toolbar_res/draw_text.png'
import draw_undo from '../assets/icons/toolbar_res/draw_undo.png'



const Screen = () => {

  const windowHeight = window.innerHeight
  const windowWidth = window.innerWidth
  const [activeTab, setActiveTab] = useState(0)
  const [imgCrop, setImgCrop] = useState('')
  const [imgSrc, setImgSrc] = useState('')
  const imgRef = useRef(null)
  const [crop, setCrop] = useState({ aspect: 16 / 9 })
  const [completedCrop, setCompletedCrop] = useState()
  const [scale, setScale] = useState(1)
  const [rotate, setRotate] = useState(0)

  const [disabledBool, setDisabledBool] = useState(false)

  const [canvasStyle, setCanvasStyle] = useState({
    border: "1px solid black",
    position: 'absolute',
    zIndex: 2
  })

  useEffect(() => {
    chrome.runtime.sendMessage('get-user-data', (response) => {
      setImgSrc(response.url)
      setActiveTab(response.activeTab)
    });
  }, []);

  const [renderCrop, setRenderCrop] = useState(0)
  useEffect(() => {
    setCompletedCrop({ ...completedCrop, x: completedCrop?.x - 1 })
  }, [renderCrop]);



  const downloadPage = () => {
    setRenderCrop(prev => prev + 1)
    chrome.downloads.download({
      filename: "screenshot.jpg",
      url: imgCrop
    })
    cancelScreen()
  }


  // const printPDF = () => {
  //   const pdfBlob = new Blob([completedCrop], { type: "application/pdf" });
  //   const url = URL.createObjectURL(pdfBlob);
  //   printJS({
  //     printable: url,
  //     type: 'pdf',
  //     base64: true
  //   });
  // }

  const copyPicture = () => {
  };

  const cancelScreen = () => {
    const change = () => {
      window.close()
      chrome.tabs.update(activeTab, { active: true });
    }
    return change();
  }


  useDebounceEffect(
    async () => {
      if (
        completedCrop?.width &&
        completedCrop?.height &&
        imgRef.current
      ) {
        imgPreview(
          imgRef.current,
          completedCrop,
          scale,
          rotate,
          setImgCrop
        )
      }
    },
    100,
    [completedCrop, scale, rotate],
  )

  console.log(completedCrop)


  const draw_arrow_with_hand = () => {
    setDisabledBool(!disabledBool)
    if (!disabledBool) {
      setCanvasStyle({ ...canvasStyle, zIndex: 2 })
    }
    else {
      setCanvasStyle({ ...canvasStyle, zIndex: 0 })
    }

  }

  // console.log(imgRef)
  const [a, setA] = useState()

  return (
    <div className='App'>

      <ReactCrop
        key={JSON.stringify(renderCrop)}
        crop={crop}
        onChange={(crop) => setCrop(crop)}
        onComplete={(c) => setCompletedCrop(c)}
        disabled={disabledBool}
      >
        <div
          ref={imgRef}
        >
          { }
          <Canvas
            // setA={setA}
            width={windowWidth}
            height={windowHeight}
            style={canvasStyle}
          />
          <img
            className='screen'
            alt="Crop me"
            src={imgSrc}
          />
        </div>
      </ReactCrop>
      {crop.height > 10 || crop.width > 10 ? (
        <div>
          <div className='image-property'
            style={{ position: 'absolute', top: `${crop.y - 28}px`, left: `${crop.x + 3}px` }}
          >
            {Math.trunc(crop.width)}x{Math.trunc(crop.height)}
          </div>
          <div id="toolbar_actions" className="toolbar toolbar-horizontal" style={{ position: 'absolute', top: `${crop.y + crop.height + 6}px`, left: `${crop.x + crop.width - 214}px` }}>
            <img id="upload" alt="Завантажити на сервер prntscr.com (Ctrl+D)" title="Завантажити на сервер prntscr.com (Ctrl+D)" className="toolbar-button " src={hor_upload} />
            <img id="share" alt="Поділитися в соціальних мережах" title="Поділитися в соціальних мережах" className="toolbar-button " src={hor_share} />
            <img id="search_google" alt="Шукати схожі зображення в Google" title="Шукати схожі зображення в Google" className="toolbar-button " src={hor_search} />
            <img id="print" alt="Друкувати (Ctrl+P)" title="Друкувати (Ctrl+P)" className="toolbar-button " src={hor_print} />
            <img id="copy" alt="Копіювати (Ctrl+C)" title="Копіювати (Ctrl+C)" className="toolbar-button " src={hor_copy} onClick={copyPicture} />
            <img id="save" alt="Зберегти (Ctrl+S)" title="Зберегти (Ctrl+S)" className="toolbar-button " src={hor_save} onClick={downloadPage} />
            <div className='toolbar-separator'></div>
            <img id="close" alt="Закрити (Ctrl+X)" title="Закрити (Ctrl+X)" className="toolbar-button " src={hor_close} onClick={cancelScreen} />
          </div>
          <div id="toolbar_edit" className="toolbar toolbar-vertical" style={{ position: 'absolute', top: `${crop.y + crop.height - 195}px`, left: `${crop.x + crop.width + 6}px` }}>
            <img id="pencil" alt="Олівець" title="Олівець" className="toolbar-button " src={draw_pencil} onClick={draw_arrow_with_hand} />
            <img id="line" alt="Лінія" title="Лінія" className="toolbar-button " src={draw_line} />
            <img id="arrow" alt="Стрілка" title="Стрілка" className="toolbar-button " src={draw_arrow} />
            <img id="rectangle" alt="Прямокукник" title="Прямокукник" className="toolbar-button " src={draw_rectangle} />
            <img id="marker" alt="Маркер" title="Маркер" className="toolbar-button " src={draw_marker} />
            <img id="text" alt="Текст" title="Текст" className="toolbar-button " src={draw_text} />
            <div className='toolbar-separator'></div>
            <img id="undo" alt="Скасувати (Ctrl+Z)" title="Скасувати (Ctrl+Z)" className="toolbar-button " src={draw_undo} />
          </div>
        </div>
      ) : ''
      }
    </div >
  );
};

export default Screen;


