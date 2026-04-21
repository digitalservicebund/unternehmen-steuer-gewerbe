# XGewerbeordnung 1.6 Schematron Validation

- `spezifikation.xsl`
  - Contains Schematron rules as XSL
  - Available at https://www.xrepository.de/details/urn:xoev-de:kosit:standard:xgewerbeordnung_1.6#version
    - Description: "Schematron-Regeln entsprechend HAW vom 26.01.2026"
    - Downloaded as `xgewerbeordnung-1.6-schematron-20260126.zip`
      - The ZIP also contains the "base" schematron rules, so we could "compile" the XSL ourselves. Luckily, they already do so for us, so the XSL is all we need.

- `generated.spezifikation.sef.json`
  - Json file that our library [SaxonJS](https://www.saxonica.com/saxonjs/index.xml) requires as input.
  - It has been generated from the Schematron rules (`spezifikation.xsl`, cf. above) using [xslt3](https://www.npmjs.com/package/xslt3?activeTab=readme), a command line interface for SaxonJS by running

  ```bash
    pnpm xslt3-he -xsl:src/resources/xml/schematron/xgewerbeordung-1.6/spezifikation.xsl -export:src/resources/xml/schematron/xgewerbeordung-1.6/generated.spezifikation.sef.json -t -nogo
  ```

  - Unless there is a new `spezifikation.xsl`, there should not be any need for compiling this Json again.
