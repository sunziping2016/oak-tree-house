#!/bin/sh
rsync -v -r site/.vuepress/dist/ sun@szp15.com:/srv/http/blog
