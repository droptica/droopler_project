#!/bin/bash

dist_folder="web/themes/custom/droopler_subtheme/build"
rebuild_command="ddev theme"

# Colors
default=$(tput sgr0)
yellow=$(tput setaf 3)
green=$(tput setaf 2)

changed_files=$(git diff --cached --name-only | grep "^$dist_folder")

if [ -n "$changed_files" ]; then
  echo
  echo "${yellow}dist css files changed. Building for production${default}"
  echo
  $rebuild_command
  git add $dist_folder
else
  echo
  echo "${green}No dist css files changed. Skipping build.${default}"
  echo
fi
