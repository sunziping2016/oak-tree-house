#!/usr/bin/env sh

# This script is used to change the dates in all posts from
# "2019-9-07 08:57:54" format to ISO "2019-09-07T00:57:54Z" format

for file in $(find site -type f -name "*.md"); do
  date=$(cat "$file" | sed -n "s/^date:\\s*\\(.*\)\$/\\1/p")
  if [ "$date" = "" ]; then
    echo "Cannot find date in ${file}"
  else
    newdate=$(date +@%s -d "$date" | xargs date -u "+%FT%TZ" -d)
    sed -i "s/^date:\\s*\\(.*\)\$/date: ${newdate}/" "${file}"
    echo "Change date format in ${file} from ${date} to ${newdate}"
  fi
done
