import React from 'react';
import { useEffect, useState, useRef } from "react";
import './Screen.css';
import ReactCrop from 'react-image-crop'
import 'react-image-crop/dist/ReactCrop.css';
import { useDebounceEffect } from './Crop/useDebounceEffect'
import { imgPreview } from './Crop/imgPreview';
import App from './ToolbarKonva/classTools';

import HomePage from './TestKonva/HomePage'
import SuperSceneWithDrawables from './ToolbarKonva/superTestClassTools'
import { CircleDrawable } from './ToolbarKonva/superTestClassTools';

import hor_save from '../assets/icons/toolbar_res/hor_save.png'
import hor_search from '../assets/icons/toolbar_res/hor_search.png'
import hor_upload from '../assets/icons/toolbar_res/hor_upload.png'
import hor_share from '../assets/icons/toolbar_res/hor_share.png'
import draw_marker from '../assets/icons/toolbar_res/draw_marker.png'
//
import DragHandlerIcon from '@atlaskit/icon/glyph/drag-handler'
import MediaServicesLineIcon from '@atlaskit/icon/glyph/media-services/line'
import MediaServicesArrowIcon from '@atlaskit/icon/glyph/media-services/arrow'
import MediaServicesRectangleIcon from '@atlaskit/icon/glyph/media-services/rectangle'
import MediaServicesTextIcon from '@atlaskit/icon/glyph/media-services/text'
import UndoIcon from '@atlaskit/icon/glyph/undo'
import CopyIcon from '@atlaskit/icon/glyph/copy'
import CrossIcon from '@atlaskit/icon/glyph/cross'
import PdfIcon from '@atlaskit/icon/glyph/pdf'
import ShareIcon from '@atlaskit/icon/glyph/share'
import CheckIcon from '@atlaskit/icon/glyph/check'



const Screen = () => {

  // const windowHeight = window.innerHeight
  // const windowWidth = window.innerWidth
  const [activeTab, setActiveTab] = useState(0)
  const [imgCrop, setImgCrop] = useState('')
  const [imgSrc, setImgSrc] = useState('')
  const imgRef = useRef(null)
  const [crop, setCrop] = useState({ aspect: 16 / 9 })
  const [completedCrop, setCompletedCrop] = useState()
  const [scale, setScale] = useState(1)
  const [rotate, setRotate] = useState(0)
  const [disabledBool, setDisabledBool] = useState(false)

  const [pay, setPay] = useState(0)

  const [canvasStyle, setCanvasStyle] = useState({
    position: 'absolute',
    zIndex: 0,
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

    chrome.downloads.download({
      filename: "screenshot.png",
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

  const cancelScreen = () => {
    const change = () => {
      window.close()
      chrome.tabs.update(activeTab, { active: true });
    }
    return change();
  }

  const payChange = () => {
    setPay(prev => prev + 1)
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
    [completedCrop, scale, rotate, pay],
  )


  const draw_arrow_with_hand = () => {
    setDisabledBool(!disabledBool)
    if (!disabledBool) {
      setCanvasStyle({ ...canvasStyle, zIndex: 3 })
    }
    else {
      setCanvasStyle({ ...canvasStyle, zIndex: 0 })
    }

  }


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
          <div
            style={canvasStyle}
          >
            <SuperSceneWithDrawables
              setNewDrawableType={"ArrowDrawable"}
            />
            {/* <Drawable /> */}
          </div>
          <img
            className='screen'
            alt="Crop me"
            src={imgSrc}
          />
        </div>
      </ReactCrop >
      {
        crop.height > 10 || crop.width > 10 ? (
          <div>
            <div className='image-property'
              style={{ position: 'absolute', top: `${crop.y - 28}px`, left: `${crop.x + 3}px` }}
            >
              {Math.trunc(crop.width)}x{Math.trunc(crop.height)}
            </div>
            <div id="toolbar_actions" className="toolbar toolbar-horizontal" style={{ position: 'absolute', top: `${crop.y + crop.height + 6}px`, left: `${crop.x + crop.width - 214}px` }}>
              <img id="upload" alt="Завантажити на сервер prntscr.com (Ctrl+D)" title="Завантажити на сервер prntscr.com (Ctrl+D)" className="toolbar-button " src={hor_upload} />
              <span id="share" alt="Поділитися в соціальних мережах" title="Поділитися в соціальних мережах" className="toolbar-button "><ShareIcon /></span>
              <img id="share" alt="Поділитися в соціальних мережах" title="Поділитися в соціальних мережах" className="toolbar-button " src={hor_share} />
              <img id="search_google" alt="Шукати схожі зображення в Google" title="Шукати схожі зображення в Google" className="toolbar-button " src={hor_search} />
              <span id="print" alt="Друкувати (Ctrl+P)" title="Друкувати (Ctrl+P)" className="toolbar-button "><PdfIcon /></span>
              <span id="copy" alt="Копіювати (Ctrl+C)" title="Копіювати (Ctrl+C)" className="toolbar-button "><CopyIcon /></span>
              <span id="check" alt="Зберегти канвас" title="Зберегти канвас" className="toolbar-button " onClick={payChange} ><CheckIcon /></span>
              <img id="save" alt="Зберегти (Ctrl+S)" title="Зберегти (Ctrl+S)" className="toolbar-button " src={hor_save} onClick={downloadPage} />
              <div className='toolbar-separator'></div>
              <span id="close" alt="Закрити (Ctrl+X)" title="Закрити (Ctrl+X)" onClick={cancelScreen} className="toolbar-button "><CrossIcon /></span>
            </div>
            <div id="toolbar_edit" className="toolbar toolbar-vertical" style={{ position: 'absolute', top: `${crop.y + crop.height - 195}px`, left: `${crop.x + crop.width + 6}px` }}>
              <span id="pencil" alt="Олівець" title="Олівець" onClick={draw_arrow_with_hand} className="toolbar-button "><DragHandlerIcon /></span>
              <span id="line" alt="Лінія" title="Лінія" className="toolbar-button "><MediaServicesLineIcon /></span>
              <span id="arrow" alt="Стрілка" title="Стрілка" className="toolbar-button "><MediaServicesArrowIcon /></span>
              <span id="rectangle" alt="Прямокукник" title="Прямокукник" className="toolbar-button "><MediaServicesRectangleIcon /></span>
              <img id="marker" alt="Маркер" title="Маркер" className="toolbar-button " src={draw_marker} />
              <span id="text" alt="Текст" title="Текст" className="toolbar-button "><MediaServicesTextIcon /></span>
              <div className='toolbar-separator'></div>
              <span id="undo" alt="Скасувати (Ctrl+Z)" title="Скасувати (Ctrl+Z)" className="toolbar-button "><UndoIcon /></span>
            </div>
          </div>
        ) : ''
      }
    </div >
  );
};

export default Screen;


