import React from 'react';
import { useEffect, useState, useRef } from "react";
import './Screen.css';
import ReactCrop from 'react-image-crop'
import 'react-image-crop/dist/ReactCrop.css';
import { useDebounceEffect } from './useDebounceEffect'
import { imgPreview } from './imgPreview';
import printJS from 'print-js'
import hor_copy from '../assets/icons/toolbar_res/hor_copy.png'
import hor_print from '../assets/icons/toolbar_res/hor_print.png'
import hor_save from '../assets/icons/toolbar_res/hor_save.png'
import hor_search from '../assets/icons/toolbar_res/hor_search.png'
import hor_upload from '../assets/icons/toolbar_res/hor_upload.png'
import hor_close from '../assets/icons/toolbar_res/hor_close.png'
import hor_share from '../assets/icons/toolbar_res/hor_share.png'

const Screen = () => {
  const [activeTab, setActiveTab] = useState(0)
  const [imgCrop, setImgCrop] = useState('')
  const [imgSrc, setImgSrc] = useState('')
  const imgRef = useRef(null)
  const [crop, setCrop] = useState({ aspect: 16 / 9 })
  const [completedCrop, setCompletedCrop] = useState()
  const [scale, setScale] = useState(1)
  const [rotate, setRotate] = useState(0)

  useEffect(() => {
    chrome.runtime.sendMessage('get-user-data', (response) => {
      setImgSrc(response.url)
      setActiveTab(response.activeTab)
    });
  }, []);

  const downloadPage = () => {
    console.log(imgCrop)
    chrome.downloads.download({
      filename: "screenshot.jpg",
      url: imgCrop
    })
    cancelScreen()
  }

  const printPDF = () => {
    const pdfBlob = new Blob([completedCrop], { type: "application/pdf" });
    const url = URL.createObjectURL(pdfBlob);
    printJS({
      printable: url,
      type: 'pdf',
      base64: true
    });
  }

  const copyPicture = async () => {
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

  return (
    <div className='App'>
      <ReactCrop
        crop={crop}
        onChange={(crop) => setCrop(crop)}
        onComplete={(c) => setCompletedCrop(c)}
      >
        <img
          className='screen'
          ref={imgRef}
          alt="Crop me"
          src={imgSrc}
        />
      </ReactCrop>
      {crop.height > 10 || crop.width > 10 ? (
        <div>
          <div className='image-property'
            style={{ position: 'absolute', top: `${crop.y - 28}px`, left: `${crop.x + 3}px` }}
          >
            {Math.trunc(crop.width)}x{Math.trunc(crop.height)}
          </div>
          <div id="toolbar_actions" className="toolbar toolbar-horizontal" style={{ position: 'absolute', top: `${crop.y + crop.height + 8}px`, left: `${crop.x + crop.width - 214}px` }}>
            <img id="upload" alt="Завантажити на сервер prntscr.com (Ctrl+D)" title="Завантажити на сервер prntscr.com (Ctrl+D)" className="toolbar-button " src={hor_upload} />
            <img id="share" alt="Поділитися в соціальних мережах" title="Поділитися в соціальних мережах" className="toolbar-button " src={hor_share} />
            <img id="search_google" alt="Шукати схожі зображення в Google" title="Шукати схожі зображення в Google" className="toolbar-button " src={hor_search} />
            <img id="print" alt="Друкувати (Ctrl+P)" title="Друкувати (Ctrl+P)" className="toolbar-button " src={hor_print} onClick={printPDF} />
            <img id="copy" alt="Копіювати (Ctrl+C)" title="Копіювати (Ctrl+C)" className="toolbar-button " src={hor_copy} onClick={copyPicture} />
            <img id="save" alt="Зберегти (Ctrl+S)" title="Зберегти (Ctrl+S)" className="toolbar-button " src={hor_save} onClick={downloadPage} />
            <img id="close" alt="Закрити (Ctrl+X)" title="Закрити (Ctrl+X)" className="toolbar-button " src={hor_close} onClick={cancelScreen} />
          </div>

        </div>
      ) : ''
      }
    </div >
  );
};

export default Screen;


