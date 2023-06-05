/* Copyright 2016 Mozilla Foundation
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import "web-com";
import "web-print_service";
import { RenderingStates, ScrollMode, SpreadMode } from "./ui_utils.js";
import { AppOptions } from "./app_options.js";
import { LinkTarget } from "./pdf_link_service.js";
import { PDFViewerApplication } from "./app.js";

const AppConstants = { LinkTarget, RenderingStates, ScrollMode, SpreadMode };

window.PDFViewerApplication = PDFViewerApplication;
window.PDFViewerApplicationConstants = AppConstants;
window.PDFViewerApplicationOptions = AppOptions;

function getViewerConfiguration() {
  return {
    appContainer: document.body,
    mainContainer: document.getElementById("viewerContainer"),
    viewerContainer: document.getElementById("viewer"),
    toolbar: {
      container: document.getElementById("toolbarViewer"),
      numPages: document.getElementById("numPages"),
      pageNumber: document.getElementById("pageNumber"),
      scaleSelect: document.getElementById("scaleSelect"),
      customScaleOption: document.getElementById("customScaleOption"),
      previous: document.getElementById("previous"),
      next: document.getElementById("next"),
      zoomIn: document.getElementById("zoomIn"),
      zoomOut: document.getElementById("zoomOut"),
      viewFind: document.getElementById("viewFind"),
      openFile: document.getElementById("openFile"),
      print: document.getElementById("print"),
      editorFreeTextButton: document.getElementById("editorFreeText"),
      editorFreeTextParamsToolbar: document.getElementById(
        "editorFreeTextParamsToolbar"
      ),
      editorInkButton: document.getElementById("editorInk"),
      editorInkParamsToolbar: document.getElementById("editorInkParamsToolbar"),
      download: document.getElementById("download"),
    },
    // secondaryToolbar: {
    //   toolbar: document.getElementById("secondaryToolbar"),
    //   toggleButton: document.getElementById("secondaryToolbarToggle"),
    //   presentationModeButton: document.getElementById("presentationMode"),
    //   openFileButton:
    //     typeof PDFJSDev === "undefined" || PDFJSDev.test("GENERIC")
    //       ? document.getElementById("secondaryOpenFile")
    //       : null,
    //   printButton: document.getElementById("secondaryPrint"),
    //   downloadButton: document.getElementById("secondaryDownload"),
    //   viewBookmarkButton: document.getElementById("viewBookmark"),
    //   firstPageButton: document.getElementById("firstPage"),
    //   lastPageButton: document.getElementById("lastPage"),
    //   pageRotateCwButton: document.getElementById("pageRotateCw"),
    //   pageRotateCcwButton: document.getElementById("pageRotateCcw"),
    //   cursorSelectToolButton: document.getElementById("cursorSelectTool"),
    //   cursorHandToolButton: document.getElementById("cursorHandTool"),
    //   scrollPageButton: document.getElementById("scrollPage"),
    //   scrollVerticalButton: document.getElementById("scrollVertical"),
    //   scrollHorizontalButton: document.getElementById("scrollHorizontal"),
    //   scrollWrappedButton: document.getElementById("scrollWrapped"),
    //   spreadNoneButton: document.getElementById("spreadNone"),
    //   spreadOddButton: document.getElementById("spreadOdd"),
    //   spreadEvenButton: document.getElementById("spreadEven"),
    //   documentPropertiesButton: document.getElementById("documentProperties"),
    // },
    // sidebar: {
    //   // Divs (and sidebar button)
    //   outerContainer: document.getElementById("outerContainer"),
    //   sidebarContainer: document.getElementById("sidebarContainer"),
    //   toggleButton: document.getElementById("sidebarToggle"),
    //   // Buttons
    //   thumbnailButton: document.getElementById("viewThumbnail"),
    //   outlineButton: document.getElementById("viewOutline"),
    //   attachmentsButton: document.getElementById("viewAttachments"),
    //   layersButton: document.getElementById("viewLayers"),
    //   // Views
    //   thumbnailView: document.getElementById("thumbnailView"),
    //   outlineView: document.getElementById("outlineView"),
    //   attachmentsView: document.getElementById("attachmentsView"),
    //   layersView: document.getElementById("layersView"),
    //   // View-specific options
    //   outlineOptionsContainer: document.getElementById(
    //     "outlineOptionsContainer"
    //   ),
    //   currentOutlineItemButton: document.getElementById("currentOutlineItem"),
    // },
    sidebarResizer: {
      outerContainer: document.getElementById("outerContainer"),
      resizer: document.getElementById("sidebarResizer"),
    },
    // findBar: {
    //   bar: document.getElementById("findbar"),
    //   toggleButton: document.getElementById("viewFind"),
    //   findField: document.getElementById("findInput"),
    //   highlightAllCheckbox: document.getElementById("findHighlightAll"),
    //   caseSensitiveCheckbox: document.getElementById("findMatchCase"),
    //   matchDiacriticsCheckbox: document.getElementById("findMatchDiacritics"),
    //   entireWordCheckbox: document.getElementById("findEntireWord"),
    //   findMsg: document.getElementById("findMsg"),
    //   findResultsCount: document.getElementById("findResultsCount"),
    //   findPreviousButton: document.getElementById("findPrevious"),
    //   findNextButton: document.getElementById("findNext"),
    // },
    // passwordOverlay: {
    //   dialog: document.getElementById("passwordDialog"),
    //   label: document.getElementById("passwordText"),
    //   input: document.getElementById("password"),
    //   submitButton: document.getElementById("passwordSubmit"),
    //   cancelButton: document.getElementById("passwordCancel"),
    // },
    // documentProperties: {
    //   dialog: document.getElementById("documentPropertiesDialog"),
    //   closeButton: document.getElementById("documentPropertiesClose"),
    //   fields: {
    //     fileName: document.getElementById("fileNameField"),
    //     fileSize: document.getElementById("fileSizeField"),
    //     title: document.getElementById("titleField"),
    //     author: document.getElementById("authorField"),
    //     subject: document.getElementById("subjectField"),
    //     keywords: document.getElementById("keywordsField"),
    //     creationDate: document.getElementById("creationDateField"),
    //     modificationDate: document.getElementById("modificationDateField"),
    //     creator: document.getElementById("creatorField"),
    //     producer: document.getElementById("producerField"),
    //     version: document.getElementById("versionField"),
    //     pageCount: document.getElementById("pageCountField"),
    //     pageSize: document.getElementById("pageSizeField"),
    //     linearized: document.getElementById("linearizedField"),
    //   },
    // },
    // annotationEditorParams: {
    //   editorFreeTextFontSize: document.getElementById("editorFreeTextFontSize"),
    //   editorFreeTextColor: document.getElementById("editorFreeTextColor"),
    //   editorInkColor: document.getElementById("editorInkColor"),
    //   editorInkThickness: document.getElementById("editorInkThickness"),
    //   editorInkOpacity: document.getElementById("editorInkOpacity"),
    // },
    printContainer: document.getElementById("printContainer"),
    openFileInput: document.getElementById("fileInput"),
  };
}

function webViewerLoad() {
  const config = getViewerConfiguration();
  console.log(config);

  PDFViewerApplication.run(config);
}

// Block the "load" event until all pages are loaded, to ensure that printing
// works in Firefox; see https://bugzilla.mozilla.org/show_bug.cgi?id=1618553
document.blockUnblockOnload?.(true);

if (
  document.readyState === "interactive" ||
  document.readyState === "complete"
) {
  webViewerLoad();
} else {
  document.addEventListener("DOMContentLoaded", webViewerLoad, true);
}

export {
  PDFViewerApplication,
  AppConstants as PDFViewerApplicationConstants,
  AppOptions as PDFViewerApplicationOptions,
};
