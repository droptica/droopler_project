#!/bin/bash

# Run PHP Static analysis
ddev phpstan

# Capture the exit code of the last command
exit_code=$?

# Check if PHP Static analysis had errors
if [ $exit_code -ne 0 ]; then
    echo "PHP Static analysis check failed. Please fix the issues before committing."
    exit 1  # Prevent the commit
fi

exit 0  # Allow the commit
