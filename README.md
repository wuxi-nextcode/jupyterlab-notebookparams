# jupyterlab-notebookparams

A JupyterLab extension that populates notebooks with URL parameters.

Functionality lifted from https://github.com/manics/jupyter-notebookparams and made into a jupyterlab extension.


## Prerequisites

* JupyterLab

## Installation

```bash
jupyter labextension install @wuxinextcode/jupyterlab-notebookparams
```

## Development

For a development install (requires npm version 4 or later), do the following in the repository directory:

```bash
npm install
npm run build
jupyter labextension link .
```

To rebuild the package and the JupyterLab app:

```bash
npm run build
jupyter lab build
```