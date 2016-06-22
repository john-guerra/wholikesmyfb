#!/bin/sh

# scp -i ~/documentos/dutoViz/dutoviz.pem * ubuntu@ec2-23-22-159-101.compute-1.amazonaws.com:/var/www/albumsExplorer
# rsync -avz -e "ssh -i /Users/aguerra/documentos/dutoViz/dutoVizNew.pem" . ubuntu@ec2-23-22-159-101.compute-1.amazonaws.com:/var/www/albumsExplorer
rsync -avz -e "ssh -i /Users/aguerra/documentos/dutoViz/dutoVizNew.pem" . ubuntu@wholikesmyfb.com:/var/www/albumsExplorer
