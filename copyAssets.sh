#!/bin/bash

cp src/index.html dist \
&& cp node_modules/bootstrap/dist/css/bootstrap.min.css dist \
&& cp src/renderer/titlebar.css dist \
&& cp src/renderer/styles.css dist \
&& cp -r images dist