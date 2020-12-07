#!/bin/bash

info() { printf "\033[1;31m\n   %s\033[0;33m$@\n\n";  }
error() { printf "\033[1;31m • $@\033[0;0m\n"; }
passed() { printf "\033[0;32m • $@\033[0;0m\n"; }

if [ -z "$URL_PREFIX" ]; then
    URL_PREFIX="http://web:3000/kurs-pm"
    sleep 5s
fi

FAILED=""

#
# Curls a url and tests if the response contains a string.
# If it fails sets FAILED to true.
#
# Usage: expectPathToContain "/_monitor" "active"
#
expectPathToContain() {
    
    ENDPOINT="$1"
    PATTERN="$2"
    FAILURE_INFO="$3"
    
    TEST_URL="$URL_PREFIX$ENDPOINT"

    curl -k -S --max-time 3 $TEST_URL > .curl.log 2>&1
    RESULT=$(cat .curl.log)

    if [[ "$RESULT" == *"$PATTERN"* ]]; then
        if [ ! -z "$FAILURE_INFO" ]; then
            passed "$FAILURE_INFO."
        else 
            passed "$TEST_URL contains $PATTERN"
        fi
 
    else
        if [ ! -z "$FAILURE_INFO" ]; then
            error "$FAILURE_INFO"
        fi
        info "'$TEST_URL' does not contain pattern '$PATTERN'."
        
        FAILED="true"
    fi

}

# ---------------- Tests ----------------

expectPathToContain "/_monitor" "APPLICATION_STATUS: OK" "Always show OK as status"

# Result
if [[ "$FAILED" != *"true"* ]]; then
    info "All end-to-end tests passed."
    exit 0
else
    echo ""
    exit 1
fi







