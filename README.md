# Performance matters

De volgende testen zijn gedaan met een gesimuleerde internetsnelheid van 200kb/200kb.

## Index
* Compression toegevoegd aan de server
* HTML minify toegevoegd aan de server  

Zonder compression & minified HTML 850 - 900ms.  
Met compression & minified HTML 670 - 720ms.  
Bespaart ~150ms

* Aleen de benodigde CSS in het bestand gezet

Spaart 50ms loading time. (van 750 - 800ms naar 700 - 750 ms)


## Caching
Na het aanzetten van caching duur het reloaden van de home page maar 560 - 610ms i.p.v. ~700ms
