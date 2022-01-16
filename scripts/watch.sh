#!/bin/sh

fswatch -o src/ | xargs -n1 -I{} make