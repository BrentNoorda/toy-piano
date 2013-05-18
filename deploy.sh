#!/bin/bash
#
# deploy new toy-piano to server

cat password.txt | meteor deploy toy-piano.meteor.com
open http://toy-piano.meteor.com/
