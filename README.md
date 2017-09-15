# Node JSON merge stream

## Usage
```bash
#data.json is newline delimited JSON objects   
#mergefile.json is an array
<data.json nmerge --mf mergefile.json --mk (KEY IN MERGEFILE TO MATCH AGAINST) --mvk (KEY IN MERGEFILE TO USE AS VALUE) -k (KEY IN DATAFILE TO MATCH AGAINST) --vk (KEY TO SET IN DATAFILE)
```
