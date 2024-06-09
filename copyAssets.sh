#!/bin/bash

cp src/index.html out \
&& cp node_modules/bootstrap/dist/css/bootstrap.min.css out \
&& cp src/renderer/titlebar.css out \
&& cp src/renderer/styles.css out \
&& cp -r images out