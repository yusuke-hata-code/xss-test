import * as pdfjsLib from './build/generic/build/pdf.mjs';
pdfjsLib.GlobalWorkerOptions.workerSrc = './build/generic/build/pdf.worker.mjs';

const loadPDF = (url) => {
  const loadingTask = pdfjsLib.getDocument(url);
  loadingTask.promise.then(
    (pdf) => {
      // PDF のページを表示します
      pdf.getPage(1).then((page) => {
        const scale = 1.5;
        const viewport = page.getViewport({ scale: scale });

        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        document.getElementById('pdf-viewer').appendChild(canvas);

        const renderContext = {
          canvasContext: context,
          viewport: viewport,
        };
        page.render(renderContext);
      });
    },
    (reason) => {
      console.error(reason);
    }
  );
};

loadPDF(location.hash.substr(1));
