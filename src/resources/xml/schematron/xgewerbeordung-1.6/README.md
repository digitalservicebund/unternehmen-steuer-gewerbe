# XGewerbeordnung 1.6 Schematron

- `spezifikation.xsl`
  - From ZIP "xgewerbeordnung-1.6-schematron-20260126.zip"
    - Described as "Schematron-Regeln entsprechend HAW vom 26.01.2026"
    - Fetched from https://www.xrepository.de/details/urn:xoev-de:kosit:standard:xgewerbeordnung_1.6#version
  - Contains "compiled" XSL from base schematron file (also available in above ZIP, but not necessary for us)

- `generated.spezifikation.sef.json`
  - Generated for use in Saxon-JS
  - ```bash
    pnpm xslt3 -xsl:src/resources/xml/schematron/xgewerbeordung-1.6/spezifikation.xsl -export:src/resources/xml/schematron/xgewerbeordung-1.6/generated.spezifikation.sef.json
     -t  -nogo
    ```

  ```

  ```
