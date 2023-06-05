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

const Pdf = () => {
  //
  const [scale, setScale] = useState<number>(0.75);
  const [numPages, setNumPages] = useState<number>(0);
  const [pdfDocument, setPdfDocument] = useState<PDFDocumentProxy | null>(null);

  // Main
  const mainContainer = useRef(null);
  const printContainerElm = useRef(null);
  const viewerContainerElm = useRef(null);
  const viewerElm = useRef(null);

  const loadingTask = pdfjsLib.getDocument({
    url: DEFAULT_URL,
    cMapUrl: CMAP_URL,
    cMapPacked: CMAP_PACKED,
    enableXfa: ENABLE_XFA,
  });

  useEffect(() => {
    console.log("---- Main");
    initialize();
  }, []);

  const initialize = async () => {
    const pdfDocumentProxy: PDFDocumentProxy = await loadingTask.promise;
    // pdfDocument.downloadInfoCapability.then((a)=>console.log(a))
    // console.log();

    // PDF Doc
    setPdfDocument(pdfDocumentProxy);
    // How many pages it has
    setNumPages(pdfDocumentProxy.numPages);
  };

  const download = async () => {
    const downloadManager = new pdfjsViewer.DownloadManager();
    const fileName = pdfjsLib.getPdfFilenameFromUrl(DEFAULT_URL);
    downloadManager.downloadUrl(DEFAULT_URL, fileName, null);
  };

  const zoomIn = async () => {
    setScale(1.5);
    // console.log(pdfDocument?.destroy);
    // const fileName = pdfjsLib
    // downloadManager.downloadUrl(DEFAULT_URL, fileName, null);
  };

  const zoomOut = async () => {
    setScale(0.75);
    // pdfjsViewer.AnnotationLayerBuilder//
    // const fileName = pdfjsLib
    // downloadManager.downloadUrl(DEFAULT_URL, fileName, null);
  };

  const onChangeZoomScale = async (e) => {
    const value = e.target.value;
    if (value === "custom") {
      return;
    }
    eventBus.dispatch("scalechanged", {
      source: self,
      value: value,
    });
    // console.log(value);
    setScale(value);
  };

  const getXfaHtmlForPrinting = () => {
    // const xfaHtml = pdfDocument?.allXfaHtml;
    // console.log(xfaHtml);
    // const linkService = new SimpleLinkService();
    // const scale =
    //   Math.round(pdfjsLib.PixelsPerInch.PDF_TO_CSS_UNITS * 100) / 100;
    // for (const xfaPage of xfaHtml.children) {
    //   const page = document.createElement("div");
    //   page.className = "xfaPrintedPage";
    //   printContainerElm.current.append(page);
    //   const builder = new XfaLayerBuilder.XfaLayerBuilder({
    //     pageDiv: page,
    //     pdfPage: null,
    //     annotationStorage: pdfDocument.annotationStorage,
    //     linkService,
    //     xfaHtml: xfaPage,
    //   });
    //   const viewport = (0, pdfjsLib.getXfaPageViewport)(xfaPage, {
    //     scale,
    //   });
    //   builder.render(viewport, "print");
    // }
  };

  const previous = async () => {
    // const a = getActiveOrFocusedElement();
    // console.log(a);
    apiPageModeToSidebarView("UseThumbs");
  };

  const next = async () => {};

  const fullScreen = () => {
    const pdfLinkService = new PDFLinkService();
    pdfLinkService.externalLinkEnabled = true;
    pdfLinkService.externalLinkTarget = 2;

    const pdfPageViewRaw = new pdfjsViewer.PDFViewer({
      container: viewerContainerElm.current,
      viewer: viewerElm.current,
      // id: pageNumber,
      // renderingId: pageNumber,
      // scale: scale,
      // defaultViewport: viewport,
      // transform: transform,
      linkService: pdfLinkService,
      eventBus,
    });

    pdfPageViewRaw.setDocument(pdfDocument!);

    console.log(pdfPageViewRaw.pagesCount);

    // pdfPageViewRaw.decreaseScale();
    // const presentationMode = new PDFPresentationMode({
    //   container: mainContainer.current,
    //   pdfViewer: pdfjsViewer,
    //   eventBus
    // });

    // presentationMode.request();
  };

  return (
    <div
      id="pageContainer"
      ref={mainContainer}
      className="pdfViewer singlePageView"
    >
      <div>
        <button onClick={previous}>{"<"}</button>
        <button onClick={next}>{">"}</button>
        <button onClick={download}>Download</button>
        <button onClick={getXfaHtmlForPrinting}>Print</button>
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

      {/* {Array.from(Array(numPages).keys()).map((i) => (
        <PdfPage
          key={`index-${i}`}
          pageNumber={i + 1}
          scale={scale}
          pdfDocument={pdfDocument}
        />
      ))} */}
      <div ref={printContainerElm} />
    </div>
  );
};
export default Pdf;

const PdfPage = ({
  scale,
  pageNumber,
  pdfDocument,
}: {
  scale: number;
  pageNumber: number;
  pdfDocument: PDFDocumentProxy;
}) => {
  const canvasElm = useRef(null);

  const [pdfPageView, setPdfPageView] =
    useState<pdfjsViewer.PDFPageView | null>(null);

  useEffect(() => {
    if (pdfPageView === null) {
      renderPage();
    } else {
      updatePage();
    }
  }, [scale]);

  const renderPage = async () => {
    const pdfPage = await pdfDocument.getPage(pageNumber);

    // console.log(pdfPage);

    // const pdfLinkService = new pdfjsViewer.PDFLinkService();
    // const simpleLinkService = new pdfjsViewer.SimpleLinkService();
    const pdfLinkService = new PDFLinkService();
    pdfLinkService.externalLinkEnabled = true;
    pdfLinkService.externalLinkTarget = 2;

    const viewport = pdfPage.getViewport({ scale: scale });
    const containerElm = canvasElm.current;

    const pdfPageViewRaw = new pdfjsViewer.PDFPageView({
      container: containerElm,
      id: pageNumber,
      renderingId: pageNumber,
      scale: scale,
      defaultViewport: viewport,
      // transform: transform,
      linkService: pdfLinkService,
      eventBus,
    });
    // Associate the actual page with the view, and draw it.
    pdfPageViewRaw.setPdfPage(pdfPage);
    pdfPageViewRaw.draw();

    setPdfPageView(pdfPageViewRaw);
  };

  const updatePage = async () => {
    pdfPageView?.update({ scale: scale });
  };

  return <div ref={canvasElm}></div>;
};
