import { memo, useEffect, useRef, useState } from "react";

// import * as pdfjsLib from "pdfjs-dist";
// import * as pdfjsViewer from "pdfjs-dist/web/pdf_viewer";
import "./Pdf.css";

import "web-com";
import "web-print_service";
import {
  RenderingStates,
  ScrollMode,
  SpreadMode,
} from "./libs/pdf-js/web/ui_utils";
import { AppOptions } from "./libs/pdf-js/web/app_options";
import { LinkTarget } from "./libs/pdf-js/web/pdf_link_service";
import { PDFViewerApplication } from "./libs/pdf-js/web/app";

/**
 * PDF Constants
 */
const CMAP_URL = "../node_modules/pdfjs-dist/cmaps/";
const CMAP_PACKED = true;
const ENABLE_XFA = true;
const SEARCH_FOR = ""; // try "Mozilla";
const SANDBOX_BUNDLE_SRC = "../../node_modules/pdfjs-dist/build/pdf.sandbox.js";
const DEFAULT_URL =
  "https://raw.githubusercontent.com/mozilla/pdf.js/ba2edeae/examples/learning/helloworld.pdf";

// Block the "load" event until all pages are loaded, to ensure that printing
// works in Firefox; see https://bugzilla.mozilla.org/show_bug.cgi?id=1618553
document.blockUnblockOnload?.(true);

// const eventBus = new pdfjsViewer.EventBus();

const AppConstants = { LinkTarget, RenderingStates, ScrollMode, SpreadMode };

// window.PDFViewerApplication = PDFViewerApplication;
// window.PDFViewerApplicationConstants = AppConstants;
// window.PDFViewerApplicationOptions = AppOptions;
PDFViewerApplication

// console.log(AppOptions);

// pdfjsLib.GlobalWorkerOptions.workerSrc =
//   "../node_modules/pdfjs-dist/build/pdf.worker.min.js";

const Pdf = () => {
  // Main
  const appContainer = useRef(null);
  const mainContainer = useRef(null);
  const viewerContainer = useRef(null);
  const fileInputElement = useRef(null);

  // Toolbar
  const toolbarContainerElement = useRef(null);
  const toolbarNumPagesElement = useRef(null);
  const toolbarPageNumberElement = useRef(null);
  const toolbarScaleSelectElement = useRef(null);
  const toolbarCustomScaleOptionElement = useRef(null);
  const toolbarPreviousElement = useRef(null);
  const toolbarNextElement = useRef(null);
  const toolbarZoomInElement = useRef(null);
  const toolbarZoomOutElement = useRef(null);
  const toolbarViewFindElement = useRef(null);
  const toolbarOpenFileElement = useRef(null);
  const toolbarPrintElement = useRef(null);
  const toolbarEditorFreeTextButtonElement = useRef(null);
  const toolbarEditorFreeTextParamsToolbarElement = useRef(null);
  const toolbarEditorInkButtonElement = useRef(null);
  const toolbarEditorInkParamsToolbarElement = useRef(null);
  const toolbarDownloadElement = useRef(null);

  // secondaryToolbar
  const secondaryOpenFileElement = useRef(null);

  // sidebar
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

  // Document
  const documentDialogElement = useRef(null);
  const documentCloseButtonElement = useRef(null);
  const documentFileNameElement = useRef(null);
  const documentFileSizeElement = useRef(null);
  const documentTitleElement = useRef(null);
  const documentAuthorElement = useRef(null);
  const documentSubjectElement = useRef(null);
  const documentKeywordsElement = useRef(null);
  const documentCreationDateElement = useRef(null);
  const documentModificationDateElement = useRef(null);
  const documentCreatorElement = useRef(null);
  const documentProducerElement = useRef(null);
  const documentVersionElement = useRef(null);
  const documentPageCountElement = useRef(null);
  const documentPageSizeElement = useRef(null);
  const documentLinearizedElement = useRef(null);

  // annotationEditorParams
  const annotationEditorFreeTextFontSizeElement = useRef(null);
  const annotationEditorFreeTextColorElement = useRef(null);
  const annotationEditorInkColorElement = useRef(null);
  const annotationEditorInkThicknessElement = useRef(null);
  const annotationEditorInkOpacityElement = useRef(null);

  // State Params
  const [findInputValue, setFindInputValue] = useState("");
  const [editorInkColor, setEditorInkColor] = useState("#rrggbb");
  const [scaleSelectValue, setScaleSelectValue] = useState("auto");
  const [editorInkOpacityValue, setEditorInkOpacityValue] = useState("100");
  const [editorInkThicknessValue, setEditorInkThicknessValue] = useState("1");

  //
  useEffect(() => {
    webViewerLoad();
  }, []);

  function getViewerConfiguration() {
    return {
      appContainer: appContainer.current,
      mainContainer: mainContainer.current,
      viewerContainer: viewerContainer.current,
      printContainer: document.getElementById("printContainer"),
      openFileInput: fileInputElement.current,
      debuggerScriptPath: "pdfjs/web/debugger",
      toolbar: {
        container: toolbarContainerElement.current,
        numPages: toolbarNumPagesElement.current,
        pageNumber: toolbarPageNumberElement.current,
        scaleSelect: toolbarScaleSelectElement.current,
        customScaleOption: toolbarCustomScaleOptionElement.current,
        previous: toolbarPreviousElement.current,
        next: toolbarNextElement.current,
        zoomIn: toolbarZoomInElement.current,
        zoomOut: toolbarZoomOutElement.current,
        viewFind: toolbarViewFindElement.current,
        openFile: toolbarOpenFileElement.current,
        print: toolbarPrintElement.current,
        editorFreeTextButton: toolbarEditorFreeTextButtonElement.current,
        editorFreeTextParamsToolbar:
          toolbarEditorFreeTextParamsToolbarElement.current,
        editorInkButton: toolbarEditorInkButtonElement.current,
        editorInkParamsToolbar: toolbarEditorInkParamsToolbarElement.current,
        download: toolbarDownloadElement.current,
      },
      secondaryToolbar: {
        toolbar: document.getElementById("secondaryToolbar"),
        toggleButton: document.getElementById("secondaryToolbarToggle"),
        presentationModeButton: document.getElementById("presentationMode"),
        openFileButton: secondaryOpenFileElement.current,
        printButton: document.getElementById("secondaryPrint"),
        downloadButton: document.getElementById("secondaryDownload"),
        viewBookmarkButton: document.getElementById("viewBookmark"),
        firstPageButton: document.getElementById("firstPage"),
        lastPageButton: document.getElementById("lastPage"),
        pageRotateCwButton: document.getElementById("pageRotateCw"),
        pageRotateCcwButton: document.getElementById("pageRotateCcw"),
        cursorSelectToolButton: document.getElementById("cursorSelectTool"),
        cursorHandToolButton: document.getElementById("cursorHandTool"),
        scrollPageButton: document.getElementById("scrollPage"),
        scrollVerticalButton: document.getElementById("scrollVertical"),
        scrollHorizontalButton: document.getElementById("scrollHorizontal"),
        scrollWrappedButton: document.getElementById("scrollWrapped"),
        spreadNoneButton: document.getElementById("spreadNone"),
        spreadOddButton: document.getElementById("spreadOdd"),
        spreadEvenButton: document.getElementById("spreadEven"),
        documentPropertiesButton: document.getElementById("documentProperties"),
      },
      sidebar: {
        // Divs (and sidebar button)
        outerContainer: sidebarOuterContainerElement.current,
        sidebarContainer: sidebarSidebarContainerElement.current,
        toggleButton: sidebarToggleButtonElement.current,
        resizer: sidebarResizerElement.current,
        // Buttons
        thumbnailButton: sidebarThumbnailButtonElement.current,
        outlineButton: sidebarOutlineButtonElement.current,
        attachmentsButton: sidebarAttachmentsButtonElement.current,
        layersButton: sidebarLayersButtonElement.current,
        // Views
        thumbnailView: sidebarThumbnailViewElement.current,
        outlineView: sidebarOutlineViewElement.current,
        attachmentsView: sidebarAttachmentsViewElement.current,
        layersView: sidebarLayersViewElement.current,
        outlineOptionsContainer: sidebarOutlineOptionsContainerElement.current,
        currentOutlineItemButton:
          sidebarCurrentOutlineItemButtonElement.current,
      },
      sidebarResizer: {
        outerContainer: sidebarOuterContainerElement.current,
        resizer: sidebarResizerElement.current,
      },
      findBar: {
        bar: document.getElementById("findbar"),
        toggleButton: document.getElementById("viewFind"),
        findField: document.getElementById("findInput"),
        highlightAllCheckbox: document.getElementById("findHighlightAll"),
        caseSensitiveCheckbox: document.getElementById("findMatchCase"),
        matchDiacriticsCheckbox: document.getElementById("findMatchDiacritics"),
        entireWordCheckbox: document.getElementById("findEntireWord"),
        findMsg: document.getElementById("findMsg"),
        findResultsCount: document.getElementById("findResultsCount"),
        findPreviousButton: document.getElementById("findPrevious"),
        findNextButton: document.getElementById("findNext"),
      },
      passwordOverlay: {
        dialog: document.getElementById("passwordDialog"),
        label: document.getElementById("passwordText"),
        input: document.getElementById("password"),
        submitButton: document.getElementById("passwordSubmit"),
        cancelButton: document.getElementById("passwordCancel"),
      },
      documentProperties: {
        dialog: documentDialogElement.current,
        closeButton: documentCloseButtonElement.current,
        fields: {
          fileName: documentFileNameElement.current,
          fileSize: documentFileSizeElement.current,
          title: documentTitleElement.current,
          author: documentAuthorElement.current,
          subject: documentSubjectElement.current,
          keywords: documentKeywordsElement.current,
          creationDate: documentCreationDateElement.current,
          modificationDate: documentModificationDateElement.current,
          creator: documentCreatorElement.current,
          producer: documentProducerElement.current,
          version: documentVersionElement.current,
          pageCount: documentPageCountElement.current,
          pageSize: documentPageSizeElement.current,
          linearized: documentLinearizedElement.current,
        },
      },
      annotationEditorParams: {
        editorFreeTextFontSize: annotationEditorFreeTextFontSizeElement.current,
        editorFreeTextColor: annotationEditorFreeTextColorElement.current,
        editorInkColor: annotationEditorInkColorElement.current,
        editorInkThickness: annotationEditorInkThicknessElement.current,
        editorInkOpacity: annotationEditorInkOpacityElement.current,
      },
    };
  }

  function webViewerLoad() {
    const config = getViewerConfiguration();

    if (typeof PDFJSDev !== "undefined" && PDFJSDev.test("GENERIC")) {
      // Give custom implementations of the default viewer a simpler way to
      // set various `AppOptions`, by dispatching an event once all viewer
      // files are loaded but *before* the viewer initialization has run.
      const event = new CustomEvent("webviewerloaded", {
        bubbles: true,
        cancelable: true,
        detail: {
          source: window,
        },
      });
      try {
        // Attempt to dispatch the event at the embedding `document`,
        // in order to support cases where the viewer is embedded in
        // a *dynamically* created <iframe> element.
        parent.document.dispatchEvent(event);
      } catch (ex) {
        // The viewer could be in e.g. a cross-origin <iframe> element,
        // fallback to dispatching the event at the current `document`.
        console.error(`webviewerloaded: ${ex}`);
        document.dispatchEvent(event);
      }
    }
    // console.log(config);
    PDFViewerApplication.run(config);
  }

  return (
    <div className="dummy-body" tabIndex={1} ref={appContainer}>
      <div id="outerContainer" ref={sidebarOuterContainerElement}>
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

        <div id="mainContainer">
          <div className="findbar hidden doorHanger" id="findbar">
            <div id="findbarInputContainer">
              <input
                id="findInput"
                className="toolbarField"
                title="Find"
                placeholder="Find in document…"
                tabIndex={91}
                data-l10n-id="find_input"
                aria-invalid="false"
                value={findInputValue}
                onChange={(e) => setFindInputValue(e.target.value)}
              />
              <div className="splitToolbarButton">
                <button
                  id="findPrevious"
                  className="toolbarButton"
                  title="Find the previous occurrence of the phrase"
                  tabIndex={92}
                  data-l10n-id="find_previous"
                >
                  <span data-l10n-id="find_previous_label">Previous</span>
                </button>
                <div className="splitToolbarButtonSeparator"></div>
                <button
                  id="findNext"
                  className="toolbarButton"
                  title="Find the next occurrence of the phrase"
                  tabIndex={93}
                  data-l10n-id="find_next"
                >
                  <span data-l10n-id="find_next_label">Next</span>
                </button>
              </div>
            </div>
            <div id="findbarOptionsOneContainer">
              <input
                type="checkbox"
                id="findHighlightAll"
                className="toolbarField"
                tabIndex={94}
                value=""
                onChange={(e) => console.log(e)}
              />
              <label
                htmlFor="findHighlightAll"
                className="toolbarLabel"
                data-l10n-id="find_highlight"
              >
                Highlight All
              </label>
              <input
                type="checkbox"
                id="findMatchCase"
                className="toolbarField"
                tabIndex={95}
                value=""
                onChange={(e) => console.log(e)}
              />
              <label
                htmlFor="findMatchCase"
                className="toolbarLabel"
                data-l10n-id="find_match_case_label"
              >
                Match Case
              </label>
            </div>
            <div id="findbarOptionsTwoContainer">
              <input
                type="checkbox"
                id="findMatchDiacritics"
                className="toolbarField"
                tabIndex={96}
                value=""
                onChange={(e) => console.log(e)}
              />
              <label
                htmlFor="findMatchDiacritics"
                className="toolbarLabel"
                data-l10n-id="find_match_diacritics_label"
              >
                Match Diacritics
              </label>
              <input
                type="checkbox"
                id="findEntireWord"
                className="toolbarField"
                tabIndex={97}
                value=""
                onChange={(e) => console.log(e)}
              />
              <label
                htmlFor="findEntireWord"
                className="toolbarLabel"
                data-l10n-id="find_entire_word_label"
              >
                Whole Words
              </label>
            </div>

            <div id="findbarMessageContainer" aria-live="polite">
              <span id="findResultsCount" className="toolbarLabel"></span>
              <span id="findMsg" className="toolbarLabel"></span>
            </div>
          </div>

          <div
            className="editorParamsToolbar hidden doorHangerRight"
            id="editorFreeTextParamsToolbar"
            ref={toolbarEditorFreeTextParamsToolbarElement}
          >
            <div className="editorParamsToolbarContainer">
              <div className="editorParamsSetter">
                <label
                  htmlFor="editorFreeTextColor"
                  className="editorParamsLabel"
                  data-l10n-id="editor_free_text_color"
                >
                  Color
                </label>
                <input
                  type="color"
                  id="editorFreeTextColor"
                  className="editorParamsColor"
                  tabIndex={100}
                  value=""
                  onChange={(e) => console.log(e)}
                  ref={annotationEditorFreeTextColorElement}
                />
              </div>
              <div className="editorParamsSetter">
                <label
                  htmlFor="editorFreeTextFontSize"
                  className="editorParamsLabel"
                  data-l10n-id="editor_free_text_size"
                >
                  Size
                </label>
                <input
                  type="range"
                  id="editorFreeTextFontSize"
                  className="editorParamsSlider"
                  value="10"
                  min="5"
                  max="100"
                  step="1"
                  tabIndex={101}
                  onChange={(e) => console.log(e)}
                  ref={annotationEditorFreeTextFontSizeElement}
                />
              </div>
            </div>
          </div>

          <div
            className="editorParamsToolbar hidden doorHangerRight"
            id="editorInkParamsToolbar"
            ref={toolbarEditorInkParamsToolbarElement}
          >
            <div className="editorParamsToolbarContainer">
              <div className="editorParamsSetter">
                <label
                  htmlFor="editorInkColor"
                  className="editorParamsLabel"
                  data-l10n-id="editor_ink_color"
                >
                  Color
                </label>
                <input
                  type="color"
                  id="editorInkColor"
                  className="editorParamsColor"
                  tabIndex={102}
                  value={editorInkColor}
                  onChange={(e) => setEditorInkColor(e.target.value)}
                  ref={annotationEditorInkColorElement}
                />
              </div>
              <div className="editorParamsSetter">
                <label
                  htmlFor="editorInkThickness"
                  className="editorParamsLabel"
                  data-l10n-id="editor_ink_thickness"
                >
                  Thickness
                </label>
                <input
                  type="range"
                  id="editorInkThickness"
                  className="editorParamsSlider"
                  value={editorInkThicknessValue}
                  min="1"
                  max="20"
                  step="1"
                  tabIndex={103}
                  onChange={(e) => setEditorInkThicknessValue(e.target.value)}
                  ref={annotationEditorInkThicknessElement}
                />
              </div>
              <div className="editorParamsSetter">
                <label
                  htmlFor="editorInkOpacity"
                  className="editorParamsLabel"
                  data-l10n-id="editor_ink_opacity"
                >
                  Opacity
                </label>
                <input
                  type="range"
                  id="editorInkOpacity"
                  className="editorParamsSlider"
                  value={editorInkOpacityValue}
                  min="1"
                  max="100"
                  step="1"
                  tabIndex={104}
                  onChange={(e) => setEditorInkOpacityValue(e.target.value)}
                  ref={annotationEditorInkOpacityElement}
                />
              </div>
            </div>
          </div>

          <div
            id="secondaryToolbar"
            className="secondaryToolbar hidden doorHangerRight"
          >
            <div id="secondaryToolbarButtonContainer">
              <button
                id="secondaryOpenFile"
                className="secondaryToolbarButton visibleLargeView"
                title="Open File"
                tabIndex={51}
                data-l10n-id="open_file"
                ref={secondaryOpenFileElement}
              >
                <span data-l10n-id="open_file_label">Open</span>
              </button>

              <button
                id="secondaryPrint"
                className="secondaryToolbarButton visibleMediumView"
                title="Print"
                tabIndex={52}
                data-l10n-id="print"
              >
                <span data-l10n-id="print_label">Print</span>
              </button>

              <button
                id="secondaryDownload"
                className="secondaryToolbarButton visibleMediumView"
                title="Save"
                tabIndex={53}
                data-l10n-id="save"
              >
                <span data-l10n-id="save_label">Save</span>
              </button>

              <div className="horizontalToolbarSeparator visibleLargeView"></div>

              <button
                id="presentationMode"
                className="secondaryToolbarButton"
                title="Switch to Presentation Mode"
                tabIndex={54}
                data-l10n-id="presentation_mode"
              >
                <span data-l10n-id="presentation_mode_label">
                  Presentation Mode
                </span>
              </button>

              <a
                href="#"
                id="viewBookmark"
                className="secondaryToolbarButton"
                title="Current Page (View URL from Current Page)"
                tabIndex={55}
                data-l10n-id="bookmark1"
              >
                <span data-l10n-id="bookmark1_label">Current Page</span>
              </a>

              <div
                id="viewBookmarkSeparator"
                className="horizontalToolbarSeparator"
              ></div>

              <button
                id="firstPage"
                className="secondaryToolbarButton"
                title="Go to First Page"
                tabIndex={56}
                data-l10n-id="first_page"
              >
                <span data-l10n-id="first_page_label">Go to First Page</span>
              </button>
              <button
                id="lastPage"
                className="secondaryToolbarButton"
                title="Go to Last Page"
                tabIndex={57}
                data-l10n-id="last_page"
              >
                <span data-l10n-id="last_page_label">Go to Last Page</span>
              </button>

              <div className="horizontalToolbarSeparator"></div>

              <button
                id="pageRotateCw"
                className="secondaryToolbarButton"
                title="Rotate Clockwise"
                tabIndex={58}
                data-l10n-id="page_rotate_cw"
              >
                <span data-l10n-id="page_rotate_cw_label">
                  Rotate Clockwise
                </span>
              </button>
              <button
                id="pageRotateCcw"
                className="secondaryToolbarButton"
                title="Rotate Counterclockwise"
                tabIndex={59}
                data-l10n-id="page_rotate_ccw"
              >
                <span data-l10n-id="page_rotate_ccw_label">
                  Rotate Counterclockwise
                </span>
              </button>

              <div className="horizontalToolbarSeparator"></div>

              <div id="cursorToolButtons" role="radiogroup">
                <button
                  id="cursorSelectTool"
                  className="secondaryToolbarButton toggled"
                  title="Enable Text Selection Tool"
                  tabIndex={60}
                  data-l10n-id="cursor_text_select_tool"
                  role="radio"
                  aria-checked="true"
                >
                  <span data-l10n-id="cursor_text_select_tool_label">
                    Text Selection Tool
                  </span>
                </button>
                <button
                  id="cursorHandTool"
                  className="secondaryToolbarButton"
                  title="Enable Hand Tool"
                  tabIndex={61}
                  data-l10n-id="cursor_hand_tool"
                  role="radio"
                  aria-checked="false"
                >
                  <span data-l10n-id="cursor_hand_tool_label">Hand Tool</span>
                </button>
              </div>

              <div className="horizontalToolbarSeparator"></div>

              <div id="scrollModeButtons" role="radiogroup">
                <button
                  id="scrollPage"
                  className="secondaryToolbarButton"
                  title="Use Page Scrolling"
                  tabIndex={62}
                  data-l10n-id="scroll_page"
                  role="radio"
                  aria-checked="false"
                >
                  <span data-l10n-id="scroll_page_label">Page Scrolling</span>
                </button>
                <button
                  id="scrollVertical"
                  className="secondaryToolbarButton toggled"
                  title="Use Vertical Scrolling"
                  tabIndex={63}
                  data-l10n-id="scroll_vertical"
                  role="radio"
                  aria-checked="true"
                >
                  <span data-l10n-id="scroll_vertical_label">
                    Vertical Scrolling
                  </span>
                </button>
                <button
                  id="scrollHorizontal"
                  className="secondaryToolbarButton"
                  title="Use Horizontal Scrolling"
                  tabIndex={64}
                  data-l10n-id="scroll_horizontal"
                  role="radio"
                  aria-checked="false"
                >
                  <span data-l10n-id="scroll_horizontal_label">
                    Horizontal Scrolling
                  </span>
                </button>
                <button
                  id="scrollWrapped"
                  className="secondaryToolbarButton"
                  title="Use Wrapped Scrolling"
                  tabIndex={65}
                  data-l10n-id="scroll_wrapped"
                  role="radio"
                  aria-checked="false"
                >
                  <span data-l10n-id="scroll_wrapped_label">
                    Wrapped Scrolling
                  </span>
                </button>
              </div>

              <div className="horizontalToolbarSeparator"></div>

              <div id="spreadModeButtons" role="radiogroup">
                <button
                  id="spreadNone"
                  className="secondaryToolbarButton toggled"
                  title="Do not join page spreads"
                  tabIndex={66}
                  data-l10n-id="spread_none"
                  role="radio"
                  aria-checked="true"
                >
                  <span data-l10n-id="spread_none_label">No Spreads</span>
                </button>
                <button
                  id="spreadOdd"
                  className="secondaryToolbarButton"
                  title="Join page spreads starting with odd-numbered pages"
                  tabIndex={67}
                  data-l10n-id="spread_odd"
                  role="radio"
                  aria-checked="false"
                >
                  <span data-l10n-id="spread_odd_label">Odd Spreads</span>
                </button>
                <button
                  id="spreadEven"
                  className="secondaryToolbarButton"
                  title="Join page spreads starting with even-numbered pages"
                  tabIndex={68}
                  data-l10n-id="spread_even"
                  role="radio"
                  aria-checked="false"
                >
                  <span data-l10n-id="spread_even_label">Even Spreads</span>
                </button>
              </div>

              <div className="horizontalToolbarSeparator"></div>

              <button
                id="documentProperties"
                className="secondaryToolbarButton"
                title="Document Properties…"
                tabIndex={69}
                data-l10n-id="document_properties"
                aria-controls="documentPropertiesDialog"
              >
                <span data-l10n-id="document_properties_label">
                  Document Properties…
                </span>
              </button>
            </div>
          </div>

          <div className="toolbar">
            <div id="toolbarContainer">
              <div id="toolbarViewer" ref={toolbarContainerElement}>
                <div id="toolbarViewerLeft">
                  <button
                    id="sidebarToggle"
                    className="toolbarButton"
                    title="Toggle Sidebar"
                    tabIndex={11}
                    data-l10n-id="toggle_sidebar"
                    aria-expanded="false"
                    aria-controls="sidebarContainer"
                    ref={sidebarToggleButtonElement}
                  >
                    <span data-l10n-id="toggle_sidebar_label">
                      Toggle Sidebar
                    </span>
                  </button>
                  <div className="toolbarButtonSpacer"></div>
                  <button
                    id="viewFind"
                    className="toolbarButton"
                    title="Find in Document"
                    tabIndex={12}
                    data-l10n-id="findbar"
                    aria-expanded="false"
                    aria-controls="findbar"
                    ref={toolbarViewFindElement}
                  >
                    <span data-l10n-id="findbar_label">Find</span>
                  </button>
                  <div className="splitToolbarButton hiddenSmallView">
                    <button
                      className="toolbarButton"
                      title="Previous Page"
                      id="previous"
                      tabIndex={13}
                      data-l10n-id="previous"
                      ref={toolbarPreviousElement}
                    >
                      <span data-l10n-id="previous_label">Previous</span>
                    </button>
                    <div className="splitToolbarButtonSeparator"></div>
                    <button
                      className="toolbarButton"
                      title="Next Page"
                      id="next"
                      tabIndex={14}
                      data-l10n-id="next"
                      ref={toolbarNextElement}
                    >
                      <span data-l10n-id="next_label">Next</span>
                    </button>
                  </div>
                  <input
                    type="number"
                    id="pageNumber"
                    className="toolbarField"
                    title="Page"
                    value="1"
                    min="1"
                    tabIndex={15}
                    data-l10n-id="page"
                    autoComplete="off"
                    onChange={(e) => console.log(e)}
                    ref={toolbarPageNumberElement}
                  />
                  <span
                    id="numPages"
                    className="toolbarLabel"
                    ref={toolbarNumPagesElement}
                  ></span>
                </div>
                <div id="toolbarViewerRight">
                  <button
                    id="openFile"
                    className="toolbarButton hiddenLargeView"
                    title="Open File"
                    tabIndex={31}
                    data-l10n-id="open_file"
                    ref={toolbarOpenFileElement}
                  >
                    <span data-l10n-id="open_file_label">Open</span>
                  </button>

                  <button
                    id="print"
                    className="toolbarButton hiddenMediumView"
                    title="Print"
                    tabIndex={32}
                    data-l10n-id="print"
                    ref={toolbarPrintElement}
                  >
                    <span data-l10n-id="print_label">Print</span>
                  </button>

                  <button
                    id="download"
                    className="toolbarButton hiddenMediumView"
                    title="Save"
                    tabIndex={33}
                    data-l10n-id="save"
                    ref={toolbarDownloadElement}
                  >
                    <span data-l10n-id="save_label">Save</span>
                  </button>

                  <div className="verticalToolbarSeparator hiddenMediumView"></div>

                  <div
                    id="editorModeButtons"
                    className="splitToolbarButton toggled"
                    role="radiogroup"
                  >
                    <button
                      id="editorFreeText"
                      className="toolbarButton"
                      disabled={true}
                      title="Text"
                      role="radio"
                      aria-checked="false"
                      tabIndex={34}
                      data-l10n-id="editor_free_text2"
                      ref={toolbarEditorFreeTextButtonElement}
                    >
                      <span data-l10n-id="editor_free_text2_label">Text</span>
                    </button>
                    <button
                      id="editorInk"
                      className="toolbarButton"
                      disabled={true}
                      title="Draw"
                      role="radio"
                      aria-checked="false"
                      tabIndex={35}
                      data-l10n-id="editor_ink2"
                      ref={toolbarEditorInkButtonElement}
                    >
                      <span data-l10n-id="editor_ink2_label">Draw</span>
                    </button>
                  </div>

                  <div
                    id="editorModeSeparator"
                    className="verticalToolbarSeparator"
                  ></div>

                  <button
                    id="secondaryToolbarToggle"
                    className="toolbarButton"
                    title="Tools"
                    tabIndex={48}
                    data-l10n-id="tools"
                    aria-expanded="false"
                    aria-controls="secondaryToolbar"
                  >
                    <span data-l10n-id="tools_label">Tools</span>
                  </button>
                </div>
                <div id="toolbarViewerMiddle">
                  <div className="splitToolbarButton">
                    <button
                      id="zoomOut"
                      className="toolbarButton"
                      title="Zoom Out"
                      tabIndex={21}
                      data-l10n-id="zoom_out"
                      ref={toolbarZoomOutElement}
                    >
                      <span data-l10n-id="zoom_out_label">Zoom Out</span>
                    </button>
                    <div className="splitToolbarButtonSeparator"></div>
                    <button
                      id="zoomIn"
                      className="toolbarButton"
                      title="Zoom In"
                      tabIndex={22}
                      data-l10n-id="zoom_in"
                      ref={toolbarZoomInElement}
                    >
                      <span data-l10n-id="zoom_in_label">Zoom In</span>
                    </button>
                  </div>
                  <span
                    id="scaleSelectContainer"
                    className="dropdownToolbarButton"
                  >
                    <select
                      id="scaleSelect"
                      title="Zoom"
                      tabIndex={23}
                      value={scaleSelectValue}
                      data-l10n-id="zoom"
                      onChange={(e) => setScaleSelectValue(e.target.value)}
                      ref={toolbarScaleSelectElement}
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
                        ref={toolbarCustomScaleOptionElement}
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
                  </span>
                </div>
              </div>
              <div id="loadingBar">
                <div className="progress">
                  <div className="glimmer"></div>
                </div>
              </div>
            </div>
          </div>

          <div id="viewerContainer" tabIndex={0} ref={mainContainer}>
            <div id="viewer" ref={viewerContainer} className="pdfViewer"></div>
          </div>
        </div>

        <div id="dialogContainer">
          <dialog id="passwordDialog">
            <div className="row">
              <label
                htmlFor="password"
                id="passwordText"
                data-l10n-id="password_label"
              >
                Enter the password to open this PDF file:
              </label>
            </div>
            <div className="row">
              <input
                type="password"
                id="password"
                className="toolbarField"
                value=""
                onChange={(e) => console.log(e)}
              />
            </div>
            <div className="buttonRow">
              <button id="passwordCancel" className="dialogButton">
                <span data-l10n-id="password_cancel">Cancel</span>
              </button>
              <button id="passwordSubmit" className="dialogButton">
                <span data-l10n-id="password_ok">OK</span>
              </button>
            </div>
          </dialog>
          <dialog id="documentPropertiesDialog" ref={documentDialogElement}>
            <div className="row">
              <span
                id="fileNameLabel"
                data-l10n-id="document_properties_file_name"
              >
                File name:
              </span>
              <p
                id="fileNameField"
                ref={documentFileNameElement}
                aria-labelledby="fileNameLabel"
              >
                -
              </p>
            </div>
            <div className="row">
              <span
                id="fileSizeLabel"
                data-l10n-id="document_properties_file_size"
              >
                File size:
              </span>
              <p
                id="fileSizeField"
                ref={documentFileSizeElement}
                aria-labelledby="fileSizeLabel"
              >
                -
              </p>
            </div>
            <div className="separator"></div>
            <div className="row">
              <span id="titleLabel" data-l10n-id="document_properties_title">
                Title:
              </span>
              <p
                id="titleField"
                ref={documentTitleElement}
                aria-labelledby="titleLabel"
              >
                -
              </p>
            </div>
            <div className="row">
              <span id="authorLabel" data-l10n-id="document_properties_author">
                Author:
              </span>
              <p
                id="authorField"
                ref={documentAuthorElement}
                aria-labelledby="authorLabel"
              >
                -
              </p>
            </div>
            <div className="row">
              <span
                id="subjectLabel"
                data-l10n-id="document_properties_subject"
              >
                Subject:
              </span>
              <p
                id="subjectField"
                ref={documentSubjectElement}
                aria-labelledby="subjectLabel"
              >
                -
              </p>
            </div>
            <div className="row">
              <span
                id="keywordsLabel"
                data-l10n-id="document_properties_keywords"
              >
                Keywords:
              </span>
              <p
                id="keywordsField"
                ref={documentKeywordsElement}
                aria-labelledby="keywordsLabel"
              >
                -
              </p>
            </div>
            <div className="row">
              <span
                id="creationDateLabel"
                data-l10n-id="document_properties_creation_date"
              >
                Creation Date:
              </span>
              <p
                id="creationDateField"
                ref={documentCreationDateElement}
                aria-labelledby="creationDateLabel"
              >
                -
              </p>
            </div>
            <div className="row">
              <span
                id="modificationDateLabel"
                data-l10n-id="document_properties_modification_date"
              >
                Modification Date:
              </span>
              <p
                id="modificationDateField"
                aria-labelledby="modificationDateLabel"
                ref={documentModificationDateElement}
              >
                -
              </p>
            </div>
            <div className="row">
              <span
                id="creatorLabel"
                data-l10n-id="document_properties_creator"
              >
                Creator:
              </span>
              <p
                id="creatorField"
                aria-labelledby="creatorLabel"
                ref={documentCreatorElement}
              >
                -
              </p>
            </div>
            <div className="separator"></div>
            <div className="row">
              <span
                id="producerLabel"
                data-l10n-id="document_properties_producer"
              >
                PDF Producer:
              </span>
              <p
                id="producerField"
                aria-labelledby="producerLabel"
                ref={documentProducerElement}
              >
                -
              </p>
            </div>
            <div className="row">
              <span
                id="versionLabel"
                data-l10n-id="document_properties_version"
              >
                PDF Version:
              </span>
              <p
                id="versionField"
                aria-labelledby="versionLabel"
                ref={documentVersionElement}
              >
                -
              </p>
            </div>
            <div className="row">
              <span
                id="pageCountLabel"
                data-l10n-id="document_properties_page_count"
              >
                Page Count:
              </span>
              <p
                id="pageCountField"
                aria-labelledby="pageCountLabel"
                ref={documentPageCountElement}
              >
                -
              </p>
            </div>
            <div className="row">
              <span
                id="pageSizeLabel"
                data-l10n-id="document_properties_page_size"
              >
                Page Size:
              </span>
              <p
                id="pageSizeField"
                aria-labelledby="pageSizeLabel"
                ref={documentPageSizeElement}
              >
                -
              </p>
            </div>
            <div className="separator"></div>
            <div className="row">
              <span
                id="linearizedLabel"
                data-l10n-id="document_properties_linearized"
              >
                Fast Web View:
              </span>
              <p
                id="linearizedField"
                aria-labelledby="linearizedLabel"
                ref={documentLinearizedElement}
              >
                -
              </p>
            </div>
            <div className="buttonRow">
              <button
                id="documentPropertiesClose"
                ref={documentCloseButtonElement}
                className="dialogButton"
              >
                <span data-l10n-id="document_properties_close">Close</span>
              </button>
            </div>
          </dialog>
          <dialog id="printServiceDialog" style={{ minWidth: "200px" }}>
            <div className="row">
              <span data-l10n-id="print_progress_message">
                Preparing document for printing…
              </span>
            </div>
            <div className="row">
              <progress value="0" max="100"></progress>
              <span
                data-l10n-id="print_progress_percent"
                data-l10n-args='{ "progress": 0 }'
                className="relative-progress"
              >
                0%
              </span>
            </div>
            <div className="buttonRow">
              <button id="printCancel" className="dialogButton">
                <span data-l10n-id="print_progress_close">Cancel</span>
              </button>
            </div>
          </dialog>
        </div>
      </div>
      <div id="printContainer"></div>
      <input
        type="file"
        id="fileInput"
        ref={fileInputElement}
        className="hidden"
      />
    </div>
  );
};

export default Pdf;
