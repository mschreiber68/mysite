.DEFAULT_GOAL := build

.PHONY: build build-templates build-sass

build: build-sass build-templates

build-templates:
	php build-templates.php

build-sass:
	npx sass src/scss/pages:build/css --style compressed
