import React, { useEffect, useRef, useState } from "react";

import * as pdfjsLib from "pdfjs-dist/";
import * as pdfjsViewer from "pdfjs-dist/web/pdf_viewer.js";
// import * as pdfjsViewer from "../libs/pdfjs-3.6.172-dist/web/viewer.js";
import { PDFDocumentProxy } from "pdfjs-dist";
import { PDFLinkService } from "./Viewer/pdf_link_service";
import {
  getActiveOrFocusedElement,
  apiPageModeToSidebarView,
} from "./Viewer/ui_utils";
import { PDFPresentationMode } from "./Viewer/pdf_presentation_mode";
// import { PDFPrintService } from "./Viewer/pdf_print_service";
import { PDFSidebar } from "./Viewer/pdf_sidebar";
import { PDFThumbnailViewer } from "./Viewer/pdf_thumbnail_viewer";

import { PDFSidebarResizer } from "./Viewer/pdf_sidebar_resizer";
import { GenericL10n } from "./Viewer/genericl10n";

// var _pdf = require("../pdf");
// var XfaLayerBuilder = require("./xfa_layer_builder.js");

import "./Pdf.css";

if (!pdfjsLib.getDocument || !pdfjsViewer.PDFPageView) {
  // eslint-disable-next-line no-alert
  alert("Please build the pdfjs-dist library using\n  `gulp dist-install`");
}

pdfjsLib.GlobalWorkerOptions.workerSrc =
  "../node_modules/pdfjs-dist/build/pdf.worker.js";

const CMAP_URL = "../node_modules/pdfjs-dist/cmaps";
const CMAP_PACKED = true;

// const DEFAULT_URL = "/compressed.tracemonkey-pldi-09.pdf";
const DEFAULT_URL = "/basic-link-1.pdf";
const ENABLE_XFA = true;

const eventBus = new pdfjsViewer.EventBus();

const l10n = new GenericL10n("en-US");

const Pdf = () => {
  //
  const [scale, setScale] = useState<number>(0.75);
  const [numPages, setNumPages] = useState<number>(0);
  const [pdfViewer, setPdfViewer] = useState<pdfjsViewer.PDFViewer>();
  const [pdfDocument, setPdfDocument] = useState<PDFDocumentProxy>();

  // Main
  const mainContainer = useRef(null);
  const printContainerElm = useRef(null);
  const viewerContainerElm = useRef(null);
  const viewerElm = useRef(null);

  // Sidebar
  const sidebarOuterContainerElement = useRef(null);
  const sidebarSidebarContainerElement = useRef(null);
  const sidebarToggleButtonElement = useRef(null);
  const sidebarResizerElement = useRef(null);
  const sidebarThumbnailButtonElement = useRef(null);
  const sidebarOutlineButtonElement = useRef(null);
  const sidebarAttachmentsButtonElement = useRef(null);
  const sidebarLayersButtonElement = useRef(null);
  const sidebarThumbnailViewElement = useRef(null);
  const sidebarOutlineViewElement = useRef(null);
  const sidebarAttachmentsViewElement = useRef(null);
  const sidebarLayersViewElement = useRef(null);
  const sidebarOutlineOptionsContainerElement = useRef(null);
  const sidebarCurrentOutlineItemButtonElement = useRef(null);

  const loadingTask = pdfjsLib.getDocument({
    url: DEFAULT_URL,
    cMapUrl: CMAP_URL,
    cMapPacked: CMAP_PACKED,
    enableXfa: ENABLE_XFA,
  });

  useEffect(() => {
    initialize();
  }, []);

  const initialize = async () => {
    const pdfDocumentProxy: PDFDocumentProxy = await loadingTask.promise;
    // pdfDocument.downloadInfoCapability.then((a)=>console.log(a))
    // console.log();

    // PDF Doc
    setPdfDocument(pdfDocumentProxy);
    // PDF Viewer

    // How many pages it has
    setNumPages(pdfDocumentProxy.numPages);
  };

  useEffect(() => {
    console.log("Called");

    if (pdfDocument) {
      console.log("Called-again");
      initPdfViewer();
    }
  }, [pdfDocument]);

  const initPdfViewer = () => {
    const pdfLinkService = new PDFLinkService();
    pdfLinkService.externalLinkEnabled = true;
    pdfLinkService.externalLinkTarget = 2;

    const pdfViewerRaw = new pdfjsViewer.PDFViewer({
      container: viewerContainerElm.current,
      viewer: viewerElm.current,
      l10n: l10n,
      // id: pageNumber,
      // renderingId: pageNumber,
      // scale: scale,
      // defaultViewport: viewport,
      // transform: transform,
      isInPresentationMode: false,
      linkService: pdfLinkService,
      eventBus,
    });

    pdfViewerRaw.setDocument(pdfDocument!);

    setPdfViewer(pdfViewerRaw);
  };

  const download = async () => {
    const downloadManager = new pdfjsViewer.DownloadManager();
    const fileName = pdfjsLib.getPdfFilenameFromUrl(DEFAULT_URL);
    downloadManager.downloadUrl(DEFAULT_URL, fileName, null);
  };

  const zoomIn = async () => {
    pdfViewer?.increaseScale();
  };

  const zoomOut = async () => {
    pdfViewer?.decreaseScale();
  };

  const onChangeZoomScale = async (e) => {
    // const value = e.target.value;
    // if (value === "custom") {
    //   return;
    // }
    // eventBus.dispatch("scalechanged", {
    //   source: self,
    //   value: value,
    // });
    // // console.log(value);
    // setScale(value);
  };

  const print = () => {
    // const sidebarResizer = new PDFSidebarResizer(
    //   {
    //     outerContainer: mainContainer.current,
    //     resizer: sidebarResizerElement.current,
    //   },
    //   eventBus,
    //   l10n
    // );
    // // const printService = new PDFPrintService();

    // const pdfThumbnailViewer = new PDFThumbnailViewer({
    //   container: sidebarThumbnailViewElement.current,
    //   linkService: pdfViewer?.linkService,
    //   renderingQueue: pdfViewer?.renderingQueue,
    //   l10n: l10n,
    //   pageColors: pdfViewer?.pageColors,
    // });

    // pdfThumbnailViewer.forceRendering();
    // pdfThumbnailViewer.setDocument(pdfDocument);

    // console.log(pdfThumbnailViewer.getThumbnail(0))

    // const sideBar = new PDFSidebar({
    //   elements: {
    //     // Divs (and sidebar button)
    //     outerContainer: mainContainer.current,
    //     sidebarContainer: sidebarSidebarContainerElement.current,
    //     toggleButton: sidebarToggleButtonElement.current,
    //     resizer: sidebarResizerElement.current,
    //     // Buttons
    //     thumbnailButton: sidebarThumbnailButtonElement.current,
    //     outlineButton: sidebarOutlineButtonElement.current,
    //     attachmentsButton: sidebarAttachmentsButtonElement.current,
    //     layersButton: sidebarLayersButtonElement.current,
    //     // Views
    //     thumbnailView: sidebarThumbnailViewElement.current,
    //     outlineView: sidebarOutlineViewElement.current,
    //     attachmentsView: sidebarAttachmentsViewElement.current,
    //     layersView: sidebarLayersViewElement.current,
    //     outlineOptionsContainer: sidebarOutlineOptionsContainerElement.current,
    //     currentOutlineItemButton:
    //       sidebarCurrentOutlineItemButtonElement.current,
    //   },
    //   pdfViewer,
    //   pdfThumbnailViewer,
    //   eventBus,
    //   l10n: pdfViewer?.l10n,
    // });

    // sideBar.open();

    // console.log(sideBar);
  };

  const previous = async () => {
    pdfViewer?.previousPage();
  };

  const next = async () => {
    pdfViewer?.nextPage();
  };

  const fullScreen = () => {
    const presentationMode = new PDFPresentationMode({
      container: viewerContainerElm.current,
      pdfViewer: pdfViewer,
      eventBus,
    });
    presentationMode.request();
  };

  return (
    <div
      id="pageContainer"
      ref={mainContainer}
      className="pdfViewer singlePageView"
    >
      <div id="sidebarContainer" ref={sidebarSidebarContainerElement}>
        <div id="toolbarSidebar">
          <div id="toolbarSidebarLeft">
            <div
              id="sidebarViewButtons"
              className="splitToolbarButton toggled"
              role="radiogroup"
            >
              <button
                id="viewThumbnail"
                className="toolbarButton toggled"
                title="Show Thumbnails"
                tabIndex={2}
                data-l10n-id="thumbs"
                role="radio"
                aria-checked="true"
                aria-controls="thumbnailView"
                ref={sidebarThumbnailButtonElement}
              >
                <span data-l10n-id="thumbs_label">Thumbnails</span>
              </button>
              <button
                id="viewOutline"
                className="toolbarButton"
                title="Show Document Outline (double-click to expand/collapse all items)"
                tabIndex={3}
                data-l10n-id="document_outline"
                role="radio"
                aria-checked="false"
                aria-controls="outlineView"
                ref={sidebarOutlineButtonElement}
              >
                <span data-l10n-id="document_outline_label">
                  Document Outline
                </span>
              </button>
              <button
                id="viewAttachments"
                className="toolbarButton"
                title="Show Attachments"
                tabIndex={4}
                data-l10n-id="attachments"
                role="radio"
                aria-checked="false"
                aria-controls="attachmentsView"
                ref={sidebarAttachmentsButtonElement}
              >
                <span data-l10n-id="attachments_label">Attachments</span>
              </button>
              <button
                id="viewLayers"
                className="toolbarButton"
                title="Show Layers (double-click to reset all layers to the default state)"
                tabIndex={5}
                data-l10n-id="layers"
                role="radio"
                aria-checked="false"
                aria-controls="layersView"
                ref={sidebarLayersButtonElement}
              >
                <span data-l10n-id="layers_label">Layers</span>
              </button>
            </div>
          </div>

          <div id="toolbarSidebarRight">
            <div
              id="outlineOptionsContainer"
              ref={sidebarOutlineOptionsContainerElement}
              className="hidden"
            >
              <div className="verticalToolbarSeparator"></div>

              <button
                id="currentOutlineItem"
                className="toolbarButton"
                disabled={true}
                title="Find Current Outline Item"
                tabIndex={6}
                data-l10n-id="current_outline_item"
                ref={sidebarCurrentOutlineItemButtonElement}
              >
                <span data-l10n-id="current_outline_item_label">
                  Current Outline Item
                </span>
              </button>
            </div>
          </div>
        </div>
        <div id="sidebarContent">
          <div id="thumbnailView" ref={sidebarThumbnailViewElement}></div>
          <div
            id="outlineView"
            ref={sidebarOutlineViewElement}
            className="hidden"
          ></div>
          <div
            id="attachmentsView"
            ref={sidebarAttachmentsViewElement}
            className="hidden"
          ></div>
          <div
            id="layersView"
            ref={sidebarLayersViewElement}
            className="hidden"
          ></div>
        </div>
        <div id="sidebarResizer" ref={sidebarResizerElement}></div>
      </div>

      <div>
        <button ref={sidebarToggleButtonElement}>Toggle</button>
        <button onClick={previous}>{"<"}</button>
        <button onClick={next}>{">"}</button>
        <button onClick={download}>Download</button>
        <button onClick={print}>Print</button>
        <button onClick={zoomOut}>-</button>
        <button onClick={zoomIn}>+</button>
        <select
          id="scaleSelect"
          title="Zoom"
          data-l10n-id="zoom"
          value={scale}
          onChange={onChangeZoomScale}
        >
          <option
            id="pageAutoOption"
            title=""
            value="auto"
            data-l10n-id="page_scale_auto"
          >
            Automatic Zoom
          </option>
          <option
            id="pageActualOption"
            title=""
            value="page-actual"
            data-l10n-id="page_scale_actual"
          >
            Actual Size
          </option>
          <option
            id="pageFitOption"
            title=""
            value="page-fit"
            data-l10n-id="page_scale_fit"
          >
            Page Fit
          </option>
          <option
            id="pageWidthOption"
            title=""
            value="page-width"
            data-l10n-id="page_scale_width"
          >
            Page Width
          </option>
          <option
            id="customScaleOption"
            title=""
            value="custom"
            disabled={true}
            hidden={true}
          ></option>
          <option
            title=""
            value="0.5"
            data-l10n-id="page_scale_percent"
            data-l10n-args='{ "scale": 50 }'
          >
            50%
          </option>
          <option
            title=""
            value="0.75"
            data-l10n-id="page_scale_percent"
            data-l10n-args='{ "scale": 75 }'
          >
            75%
          </option>
          <option
            title=""
            value="1"
            data-l10n-id="page_scale_percent"
            data-l10n-args='{ "scale": 100 }'
          >
            100%
          </option>
          <option
            title=""
            value="1.25"
            data-l10n-id="page_scale_percent"
            data-l10n-args='{ "scale": 125 }'
          >
            125%
          </option>
          <option
            title=""
            value="1.5"
            data-l10n-id="page_scale_percent"
            data-l10n-args='{ "scale": 150 }'
          >
            150%
          </option>
          <option
            title=""
            value="2"
            data-l10n-id="page_scale_percent"
            data-l10n-args='{ "scale": 200 }'
          >
            200%
          </option>
          <option
            title=""
            value="3"
            data-l10n-id="page_scale_percent"
            data-l10n-args='{ "scale": 300 }'
          >
            300%
          </option>
          <option
            title=""
            value="4"
            data-l10n-id="page_scale_percent"
            data-l10n-args='{ "scale": 400 }'
          >
            400%
          </option>
        </select>
        <button onClick={fullScreen}>Full Screen</button>
      </div>

      <div id="viewerContainer" ref={viewerContainerElm}>
        <div id="viewer" ref={viewerElm} className="pdfViewer"></div>
      </div>

      <div ref={printContainerElm} />
    </div>
  );
};
export default Pdf;
