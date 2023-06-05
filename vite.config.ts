import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    global: {
      PDFJSDev: 'GENERIC',
      // exports: false,
    }
  },
  resolve: {
    alias: {
      // "pdfjs-root/": "./src/libs/pdf-js/",
      // "pdfjs/": "./src/libs/pdf-js/src/",
      // "pdfjs-lib": "./src/libs/pdf-js/src/pdf.js",
      // "pdfjs-web/": "./src/libs/pdf-js/web/",
      // "pdfjs-fitCurve": "fit-curve",
      // "web-annotation_editor_params":
      //   "./src/libs/pdf-js/web/annotation_editor_params.js",
      // "web-pdf_attachment_viewer":
      //   "./src/libs/pdf-js/web/pdf_attachment_viewer.js",
      // "web-pdf_cursor_tools": "./src/libs/pdf-js/web/pdf_cursor_tools.js",
      // "web-pdf_document_properties":
      //   "./src/libs/pdf-js/web/pdf_document_properties.js",
      // "web-pdf_find_bar": "./src/libs/pdf-js/web/pdf_find_bar.js",
      // "web-pdf_layer_viewer": "./src/libs/pdf-js/web/pdf_layer_viewer.js",
      // "web-pdf_outline_viewer":
      //   "./src/libs/pdf-js/web/pdf_outline_viewer.js",
      // "web-pdf_presentation_mode":
      //   "./src/libs/pdf-js/web/pdf_presentation_mode.js",
      // "web-pdf_sidebar": "./src/libs/pdf-js/web/pdf_sidebar.js",
      // "web-pdf_sidebar_resizer": "./src/libs/pdf-js/web/pdf_sidebar_resizer.js",
      // "web-pdf_thumbnail_viewer":
      //   "./src/libs/pdf-js/web/pdf_thumbnail_viewer.js",
      // "web-secondary_toolbar":
      //   "./src/libs/pdf-js/web/secondary_toolbar.js",
      // "web-toolbar": "./src/libs/pdf-js/web/toolbar.js",
      // "pdf-web": "./public/web/",
    },
  },
});
