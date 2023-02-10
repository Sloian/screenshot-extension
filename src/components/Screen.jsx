import React from 'react';
import { useEffect, useState, useRef } from "react";
import './Screen.css';
import ReactCrop from 'react-image-crop'
import 'react-image-crop/dist/ReactCrop.css';
import { useDebounceEffect } from './Crop/useDebounceEffect'
import { imgPreview } from './Crop/imgPreview';
import Drawable from './ToolbarKonva/superTestClassTools';

import hor_save from '../assets/icons/toolbar_res/hor_save.png'
import hor_search from '../assets/icons/toolbar_res/hor_search.png'
import hor_upload from '../assets/icons/toolbar_res/hor_upload.png'

import DragHandlerIcon from '@atlaskit/icon/glyph/drag-handler'
import MediaServicesArrowIcon from '@atlaskit/icon/glyph/media-services/arrow'
import MediaServicesRectangleIcon from '@atlaskit/icon/glyph/media-services/rectangle'
import MediaServicesTextIcon from '@atlaskit/icon/glyph/media-services/text'
import UndoIcon from '@atlaskit/icon/glyph/undo'
import CopyIcon from '@atlaskit/icon/glyph/copy'
import CrossIcon from '@atlaskit/icon/glyph/cross'
import ShareIcon from '@atlaskit/icon/glyph/share'
import MediaServicesPreselectedIcon from '@atlaskit/icon/glyph/media-services/preselected'
import MediaServicesLineIcon from '@atlaskit/icon/glyph/media-services/line'
import EmojiAtlassianIcon from '@atlaskit/icon/glyph/emoji/atlassian'

let zminna
const Screen = () => {

  let isCtrl = false;
  const keyDownEvent = (event) => {
    if (event.ctrlKey && event.keyCode == 83) {
      console.log("Hey! Ctrl+S event captured!");
      event.preventDefault();
    }

    let keyid = event.keyCode;
    if (keyid == 17) {
      isCtrl = true;
    }
  }

  const keyUpEvent = (event) => {
    let keyid = event.keyCode;
    if (keyid == 17) {
      isCtrl = false;
    }

    if (keyid == 67 && isCtrl == true) {
      console.log(imgCrop);
      clipboard()
    }
  }
  document.onkeydown = keyDownEvent;
  document.onkeyup = keyUpEvent;


  const [activeTab, setActiveTab] = useState(0)
  const [imgCrop, setImgCrop] = useState('')
  const [imgSrc, setImgSrc] = useState('')
  const imgRef = useRef(null)
  const [crop, setCrop] = useState({ aspect: 16 / 9 })
  const [completedCrop, setCompletedCrop] = useState()
  const [scale,] = useState(1)
  const [rotate,] = useState(0)
  const [disabledBool, setDisabledBool] = useState(false)

  //
  const [newDrawableType, setNewDrawableType] = useState(`FreePathDrawable`)
  const [newDrawable, setNewDrawable] = useState([])
  const [drawables, setDrawables] = useState([])
  const toolbar_edit = useRef(null)
  const toolbar_actions = useRef(null)


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

  const cancelScreen = () => {
    const change = () => {
      window.close()
      chrome.tabs.update(activeTab, { active: true });
    }
    return change();
  }

  const clipboard = () => {
    navigator.clipboard.writeText(imgCrop).then(function () {
      console.log('Async: Copying to clipboard was successful!');
    }, function (err) {
      console.error('Async: Could not copy text: ', err);
    });
  }

  const copyTextToClipboard = async () => {
    setNewDrawable([])
    clipboard()
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
    [completedCrop, scale, rotate, newDrawable],
  )


  const draw_arrow_with_hand = () => {

    setDisabledBool(!disabledBool)
    if (!disabledBool) {
      setCanvasStyle({ ...canvasStyle, zIndex: 3 })
    }
    else {
      toolbar_edit.current.children[0].children[0].style.background = `turquoise`
      // zminna = newDrawableType
      setCanvasStyle({ ...canvasStyle, zIndex: 0 })
    }
  }

  const draw_with_hand = () => {
    setDisabledBool(!disabledBool)
    if (!disabledBool) {
      setCanvasStyle({ ...canvasStyle, zIndex: 3 })
      toolbar_edit.current.children[0].children[0].style.background = `turquoise`
    }
    else {
      setCanvasStyle({ ...canvasStyle, zIndex: 0 })
    }
  }


  return (
    <div className='App'>
      <ReactCrop
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
            <Drawable
              setNewDrawableType={setNewDrawableType}
              newDrawableType={newDrawableType}
              setDrawables={setDrawables}
              drawables={drawables}
              setNewDrawable={setNewDrawable}
              newDrawable={newDrawable}
              toolbar_edit={toolbar_edit}
              toolbar_actions={toolbar_actions}
            />
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
            <div ref={toolbar_actions} id="toolbar_actions" className="toolbar toolbar-horizontal" style={{ position: 'absolute', top: `${crop.y + crop.height + 6}px`, left: `${crop.x + crop.width - 140}px` }}>
              <span id="share" alt="Поділитися в Jira" title="Поділитися в Jira" className="toolbar-button "><EmojiAtlassianIcon /></span>
              <img id="search_google" alt="Шукати схожі зображення в Google" title="Шукати схожі зображення в Google" className="toolbar-button " src={hor_search} />
              <span id="copy" alt="Копіювати (Ctrl+C)" title="Копіювати (Ctrl+C)" className="toolbar-button" onClick={copyTextToClipboard}><CopyIcon /></span>
              <img id="save" alt="Зберегти (Ctrl+S)" title="Зберегти (Ctrl+S)" className="toolbar-button " src={hor_save} onClick={downloadPage} />
              <div className='toolbar-separator'></div>
              <span id="close" alt="Закрити (Ctrl+X)" title="Закрити (Ctrl+X)" onClick={cancelScreen} className="toolbar-button "><CrossIcon /></span>
            </div>
            <div ref={toolbar_edit} id="toolbar_edit" className="toolbar toolbar-vertical" style={{ position: 'absolute', top: `${crop.y + crop.height - 195}px`, left: `${crop.x + crop.width + 6}px` }}>
              <span id="pencil" alt="Олівець" title="Олівець" onClick={() => {
                setNewDrawableType("FreePathDrawable")
                draw_arrow_with_hand()
                console.log(`FreePathDrawable`)
              }} className="toolbar-button "><DragHandlerIcon /></span>
              <span id="arrow" alt="Стрілка" title="Стрілка" className="toolbar-button " onClick={() => {
                setNewDrawableType("ArrowDrawable")
                draw_arrow_with_hand()
              }}>
                <MediaServicesArrowIcon /></span>
              <span id="rectangle" alt="Прямокукник" title="Прямокукник" className="toolbar-button " onClick={() => {
                setNewDrawableType("RectangleDrawable")
                draw_arrow_with_hand()
              }}><MediaServicesRectangleIcon /></span>
              <span id="line" alt="Лінія" title="Лінія" className="toolbar-button " onClick={() => {
                setNewDrawableType("CircleDrawable")
                draw_arrow_with_hand()
              }}><MediaServicesPreselectedIcon /></span>
              <span id="text" alt="Текст" title="Текст" className="toolbar-button" onClick={() => {
                setNewDrawableType("TextDrawable")
                draw_arrow_with_hand()
              }}><MediaServicesTextIcon /></span>
              <span id="text" alt="Текст" title="Текст" className="toolbar-button" onClick={() => {
                setNewDrawableType("LineDrawable")
                draw_arrow_with_hand()
              }}><MediaServicesLineIcon /></span>
              <div className='toolbar-separator'></div>
              <span id="undo" alt="Скасувати (Ctrl+Z)" title="Скасувати (Ctrl+Z)" className="toolbar-button" onClick={() => {
                drawables.pop()
                setNewDrawable([])
              }}><UndoIcon /></span>
            </div>
          </div>
        ) : ''
      }
    </div >
  );
};

export default Screen;


