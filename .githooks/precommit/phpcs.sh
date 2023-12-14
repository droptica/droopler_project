#!/bin/bash

# Run PHP CodeSniffer
ddev phpcs

# Capture the exit code of the last command
exit_code=$?

# Check if PHP CodeSniffer had errors
if [ $exit_code -ne 0 ]; then
    echo "PHP CodeSniffer check failed. Please fix the issues before committing."
    exit 1  # Prevent the commit
fi

exit 0  # Allow the commit
