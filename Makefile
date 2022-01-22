.DEFAULT_GOAL := build

.PHONY: build build-templates build-sass

clean:
	rm -rf build/

build: sass postcss templates

templates:
	php build-templates.php

sass:
	npx sass src/scss/pages:build/css --no-source-map

postcss:
	npx postcss build/css --replace
