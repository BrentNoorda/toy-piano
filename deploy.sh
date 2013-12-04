#!/bin/bash
#
# deploy new toy-piano to server

password=$(head -n 1 password.txt)

expect -f - <<EOD
set timeout 360
spawn meteor deploy toy-piano.meteor.com
expect "Password:"
send "$password\r"

expect "Deploying to toy-piano.meteor.com.  Bundling..."
expect "Uploading"
expect "Now serving at toy-piano.meteor.com"
EOD
