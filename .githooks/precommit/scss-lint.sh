#!/bin/sh

# Run the linter
ddev theme lint

# Check the exit status of the lint command
if [ $? -ne 0 ]; then
    echo "Linting errors found. Commit aborted."
    exit 1
fi

echo "Linting passed. Proceeding with commit."
exit 0
