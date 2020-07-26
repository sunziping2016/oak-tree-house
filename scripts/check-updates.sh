#!/usr/bin/env sh

ncu
for i in $(ls "packages/@oak-tree-house"); do
  pushd "packages/@oak-tree-house/$i"
  ncu
  popd
done
