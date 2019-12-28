#!/bin/sh
rsync -v -r site/.vuepress/dist/ sun@szp.io:/srv/http/blog
