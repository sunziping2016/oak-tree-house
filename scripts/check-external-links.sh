#!/usr/bin/env sh

connect_timeout=10

for link in $(cat external-link-list.txt); do
  printf "Check \"$link\" ... "
  ret=$(curl -s --connect-timeout $connect_timeout --head $link | head -n 1 | sed -n -r "s/^HTTP\/[.0-9]+\s+(.*)/\1/p")
  if [[ "$ret" == 405* ]]; then
    ret=$(curl -s --connect-timeout $connect_timeout --head -X GET $link | head -n 1 | sed -n -r "s/^HTTP\/[.0-9]+\s+(.*)/\1/p")
  fi
  if [[ "$ret" == 2* ]] || [[ "$ret" == 3* ]]; then
    echo -e "\e[38;2;0;255;0m$ret\e[0m"
  else
    if [ "$ret" = "" ]; then
      ret="TIMEOUT"
    fi
    echo -e "\e[38;2;255;0;0m$ret\e[0m"
    failed=true
  fi
done

if [ "$failed" == true ]; then
  exit 1
fi
