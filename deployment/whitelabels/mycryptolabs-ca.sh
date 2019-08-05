#!/bin/sh
BASIC_AUTH=$(echo "wave68&Row" | htpasswd -ni mycryptolabs) \
WHITELABEL_ID=mycryptolabs-ca \
WHITELABEL_HOST=www.mycryptolabs.ca \
envtpl ./deployment.tpl.yaml