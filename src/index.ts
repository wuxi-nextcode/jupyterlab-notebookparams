import {
  JupyterFrontEnd, JupyterFrontEndPlugin
} from '@jupyterlab/application';

import {
  INotebookTracker, NotebookPanel, NotebookActions
} from '@jupyterlab/notebook';


const extension: JupyterFrontEndPlugin<void> = {
  id: 'jupyterlab-notebookparams',
  autoStart: true,
  requires: [INotebookTracker],
  activate: activateExtension
};

const PARAM_CELL_PARAMETERS = "# Parameters:";
const FILTERED_PARAMS = ["reset", "clone"];
let autorun = false;

function generateParamAssignment(params: URLSearchParams, language: String): String {
  let text = "";
  for(const [key, value] of params) {
    if (FILTERED_PARAMS.includes(key)) {
      continue;
    }

    if (key == 'autorun') {
      autorun = (value == 'true');
    } else {

      let v = value;

      //Enclose value in quotes if we can't convert to a number
      if(isNaN(Number(value))) {
        v = '"' + value + '"';
      }
      switch(language) {
        case 'R': {
          text += key + ' <- ' + v + '\n';
          break;
        }
        default: {
          text += key + ' = ' + v + '\n';
          break;
        }
      }
    }
  }
  return text;
}

function activateExtension(app: JupyterFrontEnd, notebooks: INotebookTracker) : void {
  console.log('JupyterLab extension jupyterlab-notebookparams is activated!');
  const href = window.location.href;

  notebooks.widgetAdded.connect((sender, panel: NotebookPanel) => {

    panel.sessionContext.ready.then(() => {
      for(let i = 0; i < panel.model.cells.length; i++) {
        let cell = panel.model.cells.get(i);
        if(cell.value.text.startsWith(PARAM_CELL_PARAMETERS)) {
          let searchParams = new URL(href).searchParams;
          let text = generateParamAssignment(searchParams,panel.model.defaultKernelLanguage);
          if (text) {
            cell.value.text = PARAM_CELL_PARAMETERS + '\n' + text;
            console.log('jupyterlab-notebookparams: setting parameters in cell ' + cell);
          }
          if(autorun) {
            NotebookActions.runAll(panel.content,panel.sessionContext).then(() => console.log("jupyterlab-notebookparams: Autorun done."));
          }
          break;
        }
      }
    });
  });
}

// noinspection JSUnusedGlobalSymbols
export default extension;