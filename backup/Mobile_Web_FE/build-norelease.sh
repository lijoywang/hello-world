#!/bin/bash

 br=$1

 fe=.

 output_public=../m2-fe-compiled

 cd $fe

 git fetch
 if [[ "" != "$br" ]] ; then
     git branch | grep -E "\b$br\b"
     if [[ $? == 0 ]]; then
         git checkout $1
     else
         git branch -a | grep -E "\b$br\b"
         if [[ $? == 0 ]]; then
             git checkout -t origin/$br
         else
             echo "分支$br不存在"
             exit 1
         fi
     fi

 fi

 git pull

 npm install

 rm -rf $fe/output

 chmod +x $fe/build.js

 node $fe/build.js -s dev

 test -d $output_public || mkdir -p $output_public
 test -d $fe/output/view && cp -r $fe/output/view $output_public
 test -d $fe/output/public && cp -r $fe/output/public $output_public


