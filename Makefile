.DEFAULT_GOAL := build

.PHONY: build build-templates

build: build-templates

build-templates:
	php build-templates.php