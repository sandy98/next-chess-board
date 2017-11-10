#!/usr/bin/env bash

cd sets

echo "chessSets: {" > ../sets.json
for dir in *
  do
    echo "$dir: {" >> ../sets.json
      cd $dir
      echo "In directory $dir"
      for f in *.b64
        do
          echo "Processing file $f"
          n=`echo "$f" | cut -d'.' -f1`
          echo $n: '"' >> ../../sets.json
          cat $f >> ../../sets.json 
          echo '", ' >> ../../sets.json
        done
      cd ..  
    echo '},'  >> ../sets.json
  done
echo '}' >> ../sets.json
          

