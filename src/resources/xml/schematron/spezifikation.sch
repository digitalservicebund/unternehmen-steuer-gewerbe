<?xml version="1.0" encoding="UTF-8"?>
<sch:schema xmlns:sch="http://purl.oclc.org/dsdl/schematron"
            xmlns:my-sch="my-schematron"
            queryBinding="xslt2"
			   schemaVersion="1.0">
   <sch:ns prefix="xs" uri="http://www.w3.org/2001/XMLSchema"/>
   <sch:ns prefix="rf"
           uri="urn:xoev-de:xunternehmen:standard:basismodul:rechtsform"/>
   <sch:ns prefix="bk"
           uri="http://www.xgewerbeordnung.de/spezifikation/baukasten/1.0"/>
   <sch:ns prefix="ename"
           uri="urn:xoev-de:xunternehmen:standard:basismodul:eingetragenername"/>
   <sch:ns prefix="wt"
           uri="urn:xoev-de:xunternehmen:standard:basismodul:wirtschaftlichetaetigkeit"/>
   <sch:ns prefix="np"
           uri="urn:xoev-de:xunternehmen:standard:basismodul:natuerlicheperson"/>
   <sch:ns prefix="bdt"
           uri="urn:xoev-de:xunternehmen:standard:basismodul:basisdatentypen"/>
   <sch:ns prefix="adr"
           uri="urn:xoev-de:xunternehmen:standard:basismodul:adressen"/>
   <sch:ns prefix="eintr"
           uri="urn:xoev-de:xunternehmen:standard:basismodul:eintragung"/>
   <sch:ns prefix="kom"
           uri="urn:xoev-de:xunternehmen:standard:basismodul:kommunikation"/>
   <sch:ns prefix="nachr"
           uri="urn:xoev-de:xunternehmen:standard:basismodul:nachrichtenstruktur"/>
   <sch:ns prefix="antr"
           uri="urn:xoev-de:xunternehmen:standard:basismodul:antraege-anzeigen"/>
   <sch:ns prefix="erl" uri="http://www.xgewerbeordnung.de/spezifikation/erl/1.0"/>
   <sch:ns prefix="dat"
           uri="urn:xoev-de:xunternehmen:standard:basismodul:datumsangaben"/>
   <sch:ns prefix="jp"
           uri="urn:xoev-de:xunternehmen:standard:basismodul:juristischeperson"/>
   <sch:ns prefix="gv"
           uri="urn:xoev-de:xunternehmen:standard:basismodul:gesetzlichervertreter"/>
   <sch:ns prefix="rpg"
           uri="urn:xoev-de:xunternehmen:standard:basismodul:rechtsfaehigepersonengesellschaft"/>
   <sch:ns prefix="ges"
           uri="urn:xoev-de:xunternehmen:standard:basismodul:gesellschafter"/>
   <sch:ns prefix="xga" uri="http://www.xgewerbeordnung.de/spezifikation/xga/1.0"/>
   <sch:ns prefix="spv"
           uri="urn:xoev-de:xunternehmen:standard:basismodul:sonstigepersonenvereinigung"/>
   <sch:ns prefix="sitze" uri="urn:xoev-de:xunternehmen:standard:basismodul:sitze"/>
   <sch:pattern>
      <sch:rule id="rule.SCH-0001" abstract="true">
         <sch:assert id="SCH-0001"
                     test="if (ancestor::xga:ummeldung) then (exists(xga:neuAusgeuebt) or ancestor::xga:gewerbebetriebVorAenderung) else empty(xga:neuAusgeuebt)">[SCH-0001] Im Falle einer Ummeldung muss angegeben werden, ob ein Schwerpunkt neu ausgeübt wurde. Bei An- und Abmeldungen ist die Angabe unzulässig.</sch:assert>
      </sch:rule>
      <sch:rule context="//xga:schwerpunkt">
         <sch:extends rule="rule.SCH-0001"/>
      </sch:rule>
   </sch:pattern>
   <sch:pattern>
      <sch:rule id="rule.SCH-0006" abstract="true">
         <sch:assert id="SCH-0006"
                     test="if (wt:artOrt/code = ('02','03')) then exists(parent::xga:gewerbebetrieb/xga:abweichendeHauptniederlassung) else true()">[SCH-0006] Wenn es sich um eine Zweigniederlassung oder unselbstständige Zweigstelle handelt, muss die Hauptniederlassung angegeben werden.</sch:assert>
      </sch:rule>
      <sch:rule context="xga:sta.gewerbemeldung.0100//xga:gewerbebetrieb[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]/xga:betriebsstaette">
         <sch:extends rule="rule.SCH-0006"/>
      </sch:rule>
      <sch:rule context="xga:ihk.gewerbemeldung.0200//xga:gewerbebetrieb[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]/xga:betriebsstaette">
         <sch:extends rule="rule.SCH-0006"/>
      </sch:rule>
      <sch:rule context="xga:hwk.gewerbemeldung.0210//xga:gewerbebetrieb[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]/xga:betriebsstaette">
         <sch:extends rule="rule.SCH-0006"/>
      </sch:rule>
      <sch:rule context="xga:dgu.gewerbemeldung.0230//xga:gewerbebetrieb[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]/xga:betriebsstaette">
         <sch:extends rule="rule.SCH-0006"/>
      </sch:rule>
      <sch:rule context="xga:rg.gewerbemeldung.0240//xga:gewerbebetrieb[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]/xga:betriebsstaette">
         <sch:extends rule="rule.SCH-0006"/>
      </sch:rule>
      <sch:rule context="xga:fa.gewerbemeldung.0250//xga:gewerbebetrieb[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]/xga:betriebsstaette">
         <sch:extends rule="rule.SCH-0006"/>
      </sch:rule>
      <sch:rule context="xga:zv.gewerbemeldung.0260//xga:gewerbebetrieb[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]/xga:betriebsstaette">
         <sch:extends rule="rule.SCH-0006"/>
      </sch:rule>
      <sch:rule context="xga:is.gewerbemeldung.0270//xga:gewerbebetrieb[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]/xga:betriebsstaette">
         <sch:extends rule="rule.SCH-0006"/>
      </sch:rule>
      <sch:rule context="xga:as.gewerbemeldung.0280//xga:gewerbebetrieb[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]/xga:betriebsstaette">
         <sch:extends rule="rule.SCH-0006"/>
      </sch:rule>
      <sch:rule context="xga:lue.gewerbemeldung.0290//xga:gewerbebetrieb[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]/xga:betriebsstaette">
         <sch:extends rule="rule.SCH-0006"/>
      </sch:rule>
      <sch:rule context="xga:alg.gewerbemeldung.0300//xga:gewerbebetrieb[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]/xga:betriebsstaette">
         <sch:extends rule="rule.SCH-0006"/>
      </sch:rule>
      <sch:rule context="xga:ext.gewerbemeldung.0400//xga:gewerbebetrieb[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]/xga:betriebsstaette">
         <sch:extends rule="rule.SCH-0006"/>
      </sch:rule>
      <sch:rule context="xga:unterrichtung.0700//xga:gewerbebetrieb[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]/xga:betriebsstaette">
         <sch:extends rule="rule.SCH-0006"/>
      </sch:rule>
   </sch:pattern>
   <sch:pattern>
      <sch:rule id="rule.SCH-0007" abstract="true">
         <sch:assert id="SCH-0007"
                     test="if (xs:boolean(xga:istReisegewerbe) = false()) then exists(xga:betriebsstaette/wt:artOrt) else true()">[SCH-0007] Wenn das Gewerbe kein Reisegewerbe ist, muss die Art der Niederlassung angegeben werden, sonst darf die Art der Niederlassung nicht angegeben werden.</sch:assert>
      </sch:rule>
      <sch:rule context="xga:sta.gewerbemeldung.0100//xga:gewerbebetrieb[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-0007"/>
      </sch:rule>
      <sch:rule context="xga:ihk.gewerbemeldung.0200//xga:gewerbebetrieb[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-0007"/>
      </sch:rule>
      <sch:rule context="xga:hwk.gewerbemeldung.0210//xga:gewerbebetrieb[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-0007"/>
      </sch:rule>
      <sch:rule context="xga:dgu.gewerbemeldung.0230//xga:gewerbebetrieb[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-0007"/>
      </sch:rule>
      <sch:rule context="xga:fa.gewerbemeldung.0250//xga:gewerbebetrieb[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-0007"/>
      </sch:rule>
      <sch:rule context="xga:zv.gewerbemeldung.0260//xga:gewerbebetrieb[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-0007"/>
      </sch:rule>
      <sch:rule context="xga:is.gewerbemeldung.0270//xga:gewerbebetrieb[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-0007"/>
      </sch:rule>
      <sch:rule context="xga:as.gewerbemeldung.0280//xga:gewerbebetrieb[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-0007"/>
      </sch:rule>
      <sch:rule context="xga:lue.gewerbemeldung.0290//xga:gewerbebetrieb[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-0007"/>
      </sch:rule>
      <sch:rule context="xga:alg.gewerbemeldung.0300//xga:gewerbebetrieb[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-0007"/>
      </sch:rule>
      <sch:rule context="xga:ext.gewerbemeldung.0400//xga:gewerbebetrieb[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-0007"/>
      </sch:rule>
      <sch:rule context="xga:unterrichtung.0700//xga:gewerbebetrieb[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-0007"/>
      </sch:rule>
   </sch:pattern>
   <sch:pattern>
      <sch:rule id="rule.SCH-0008" abstract="true">
         <sch:assert id="SCH-0008"
                     test="if (xs:boolean(xga:istReisegewerbe)) then true() else exists(xga:betriebsstaette/bk:anschrift/bk:strassenanschriftInland)">[SCH-0008] Wenn das Gewerbe kein Reisegewerbe ist, muss die Anschrift der Betriebsstätte angegeben werden.</sch:assert>
      </sch:rule>
      <sch:rule context="xga:sta.gewerbemeldung.0100//xga:gewerbebetrieb[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-0008"/>
      </sch:rule>
      <sch:rule context="xga:ihk.gewerbemeldung.0200//xga:gewerbebetrieb[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-0008"/>
      </sch:rule>
      <sch:rule context="xga:hwk.gewerbemeldung.0210//xga:gewerbebetrieb[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-0008"/>
      </sch:rule>
      <sch:rule context="xga:dgu.gewerbemeldung.0230//xga:gewerbebetrieb[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-0008"/>
      </sch:rule>
      <sch:rule context="xga:fa.gewerbemeldung.0250//xga:gewerbebetrieb[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-0008"/>
      </sch:rule>
      <sch:rule context="xga:zv.gewerbemeldung.0260//xga:gewerbebetrieb[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-0008"/>
      </sch:rule>
      <sch:rule context="xga:is.gewerbemeldung.0270//xga:gewerbebetrieb[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-0008"/>
      </sch:rule>
      <sch:rule context="xga:as.gewerbemeldung.0280//xga:gewerbebetrieb[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-0008"/>
      </sch:rule>
      <sch:rule context="xga:lue.gewerbemeldung.0290//xga:gewerbebetrieb[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-0008"/>
      </sch:rule>
      <sch:rule context="xga:alg.gewerbemeldung.0300//xga:gewerbebetrieb[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-0008"/>
      </sch:rule>
      <sch:rule context="xga:ext.gewerbemeldung.0400//xga:gewerbebetrieb[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-0008"/>
      </sch:rule>
      <sch:rule context="xga:abh.gewerbemeldung.0500//xga:gewerbebetrieb[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-0008"/>
      </sch:rule>
      <sch:rule context="xga:unterrichtung.0700//xga:gewerbebetrieb[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-0008"/>
      </sch:rule>
   </sch:pattern>
   <sch:pattern>
      <sch:rule id="rule.SCH-0009" abstract="true">
         <sch:assert id="SCH-0009"
                     test="if (xga:status/code = '1') then exists(xga:ausgestelltAm) else true()">[SCH-0009] Wenn die Handwerkskarte vorliegt, muss das Ausstellungsdatum angegeben werden.</sch:assert>
      </sch:rule>
      <sch:rule context="//xga:handwerkskarte[not(ancestor-or-self::xga:gewerbebetriebVorAenderung|ancestor-or-self::xga:referenzierteSubjekteVorAenderung)]">
         <sch:extends rule="rule.SCH-0009"/>
      </sch:rule>
   </sch:pattern>
   <sch:pattern>
      <sch:rule id="rule.SCH-0011" abstract="true">
         <sch:assert id="SCH-0011"
                     test="exists(np:staatsangehoerigkeit|bk:staatsangehoerigkeitFreitext)">[SCH-0011] Die Staatsangehörigkeit muss als Text und/oder Code angegeben werden.</sch:assert>
      </sch:rule>
      <sch:rule context="xga:sta.gewerbemeldung.0100//xga:natuerlichePerson[ancestor-or-self::xga:referenzierteSubjekte and ancestor-or-self::xga:natuerlichePerson/np:natuerlichePerson.id = (ancestor::xga:satz/*/xga:gewerbebetrieb//xga:gewerbetreibender.id,&#xA;            ancestor::xga:satz/*/xga:referenzierteSubjekte//gv:gesetzlicherVertreter.id, ancestor::xga:satz/*/xga:referenzierteSubjekte//ges:gesellschafter.id)]">
         <sch:extends rule="rule.SCH-0011"/>
      </sch:rule>
      <sch:rule context="xga:ihk.gewerbemeldung.0200//xga:natuerlichePerson[ancestor-or-self::xga:referenzierteSubjekte and ancestor-or-self::xga:natuerlichePerson/np:natuerlichePerson.id = (ancestor::xga:satz/*/xga:gewerbebetrieb//xga:gewerbetreibender.id,&#xA;            ancestor::xga:satz/*/xga:referenzierteSubjekte//gv:gesetzlicherVertreter.id, ancestor::xga:satz/*/xga:referenzierteSubjekte//ges:gesellschafter.id)]">
         <sch:extends rule="rule.SCH-0011"/>
      </sch:rule>
      <sch:rule context="xga:hwk.gewerbemeldung.0210//xga:natuerlichePerson[ancestor-or-self::xga:referenzierteSubjekte and ancestor-or-self::xga:natuerlichePerson/np:natuerlichePerson.id = (ancestor::xga:satz/*/xga:gewerbebetrieb//xga:gewerbetreibender.id,&#xA;            ancestor::xga:satz/*/xga:referenzierteSubjekte//gv:gesetzlicherVertreter.id, ancestor::xga:satz/*/xga:referenzierteSubjekte//ges:gesellschafter.id)]">
         <sch:extends rule="rule.SCH-0011"/>
      </sch:rule>
      <sch:rule context="xga:dgu.gewerbemeldung.0230//xga:natuerlichePerson[ancestor-or-self::xga:referenzierteSubjekte and ancestor-or-self::xga:natuerlichePerson/np:natuerlichePerson.id = (ancestor::xga:satz/*/xga:gewerbebetrieb//xga:gewerbetreibender.id,&#xA;            ancestor::xga:satz/*/xga:referenzierteSubjekte//gv:gesetzlicherVertreter.id, ancestor::xga:satz/*/xga:referenzierteSubjekte//ges:gesellschafter.id)]">
         <sch:extends rule="rule.SCH-0011"/>
      </sch:rule>
      <sch:rule context="xga:fa.gewerbemeldung.0250//xga:natuerlichePerson[ancestor-or-self::xga:referenzierteSubjekte and ancestor-or-self::xga:natuerlichePerson/np:natuerlichePerson.id = (ancestor::xga:satz/*/xga:gewerbebetrieb//xga:gewerbetreibender.id,&#xA;            ancestor::xga:satz/*/xga:referenzierteSubjekte//gv:gesetzlicherVertreter.id, ancestor::xga:satz/*/xga:referenzierteSubjekte//ges:gesellschafter.id)]">
         <sch:extends rule="rule.SCH-0011"/>
      </sch:rule>
      <sch:rule context="xga:zv.gewerbemeldung.0260//xga:natuerlichePerson[ancestor-or-self::xga:referenzierteSubjekte and ancestor-or-self::xga:natuerlichePerson/np:natuerlichePerson.id = (ancestor::xga:satz/*/xga:gewerbebetrieb//xga:gewerbetreibender.id,&#xA;            ancestor::xga:satz/*/xga:referenzierteSubjekte//gv:gesetzlicherVertreter.id, ancestor::xga:satz/*/xga:referenzierteSubjekte//ges:gesellschafter.id)]">
         <sch:extends rule="rule.SCH-0011"/>
      </sch:rule>
      <sch:rule context="xga:alg.gewerbemeldung.0300//xga:natuerlichePerson[ancestor-or-self::xga:referenzierteSubjekte and ancestor-or-self::xga:natuerlichePerson/np:natuerlichePerson.id = (ancestor::xga:satz/*/xga:gewerbebetrieb//xga:gewerbetreibender.id,&#xA;            ancestor::xga:satz/*/xga:referenzierteSubjekte//gv:gesetzlicherVertreter.id, ancestor::xga:satz/*/xga:referenzierteSubjekte//ges:gesellschafter.id)]">
         <sch:extends rule="rule.SCH-0011"/>
      </sch:rule>
      <sch:rule context="xga:ext.gewerbemeldung.0400//xga:natuerlichePerson[ancestor-or-self::xga:referenzierteSubjekte and ancestor-or-self::xga:natuerlichePerson/np:natuerlichePerson.id = (ancestor::xga:satz/*/xga:gewerbebetrieb//xga:gewerbetreibender.id,&#xA;            ancestor::xga:satz/*/xga:referenzierteSubjekte//gv:gesetzlicherVertreter.id, ancestor::xga:satz/*/xga:referenzierteSubjekte//ges:gesellschafter.id)]">
         <sch:extends rule="rule.SCH-0011"/>
      </sch:rule>
      <sch:rule context="xga:abh.gewerbemeldung.0500//xga:natuerlichePerson[ancestor-or-self::xga:referenzierteSubjekte and ancestor-or-self::xga:natuerlichePerson/np:natuerlichePerson.id = (ancestor::xga:satz/*/xga:gewerbebetrieb//xga:gewerbetreibender.id,&#xA;            ancestor::xga:satz/*/xga:referenzierteSubjekte//gv:gesetzlicherVertreter.id, ancestor::xga:satz/*/xga:referenzierteSubjekte//ges:gesellschafter.id)]">
         <sch:extends rule="rule.SCH-0011"/>
      </sch:rule>
      <sch:rule context="xga:unterrichtung.0700//xga:natuerlichePerson[ancestor-or-self::xga:referenzierteSubjekte and ancestor-or-self::xga:natuerlichePerson/np:natuerlichePerson.id = (ancestor::xga:satz/*/xga:gewerbebetrieb//xga:gewerbetreibender.id,&#xA;            ancestor::xga:satz/*/xga:referenzierteSubjekte//gv:gesetzlicherVertreter.id, ancestor::xga:satz/*/xga:referenzierteSubjekte//ges:gesellschafter.id)]">
         <sch:extends rule="rule.SCH-0011"/>
      </sch:rule>
   </sch:pattern>
   <sch:pattern>
      <sch:rule id="rule.SCH-0013" abstract="true">
         <sch:assert id="SCH-0013" test="exists(xga:gewerbebetrieb/xga:betriebArt)">[SCH-0013] Bei einer Anmeldung ist die Art des Betriebs anzugeben</sch:assert>
      </sch:rule>
      <sch:rule context="xga:sta.gewerbemeldung.0100//xga:anmeldung[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-0013"/>
      </sch:rule>
      <sch:rule context="xga:ihk.gewerbemeldung.0200//xga:anmeldung[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-0013"/>
      </sch:rule>
      <sch:rule context="xga:hwk.gewerbemeldung.0210//xga:anmeldung[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-0013"/>
      </sch:rule>
      <sch:rule context="xga:dgu.gewerbemeldung.0230//xga:anmeldung[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-0013"/>
      </sch:rule>
      <sch:rule context="xga:zv.gewerbemeldung.0260//xga:anmeldung[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-0013"/>
      </sch:rule>
      <sch:rule context="xga:is.gewerbemeldung.0270//xga:anmeldung[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-0013"/>
      </sch:rule>
      <sch:rule context="xga:as.gewerbemeldung.0280//xga:anmeldung[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-0013"/>
      </sch:rule>
      <sch:rule context="xga:lue.gewerbemeldung.0290//xga:anmeldung[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-0013"/>
      </sch:rule>
      <sch:rule context="xga:alg.gewerbemeldung.0300//xga:anmeldung[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-0013"/>
      </sch:rule>
      <sch:rule context="xga:ext.gewerbemeldung.0400//xga:anmeldung[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-0013"/>
      </sch:rule>
      <sch:rule context="xga:abh.gewerbemeldung.0500//xga:anmeldung[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-0013"/>
      </sch:rule>
      <sch:rule context="xga:unterrichtung.0700//xga:anmeldung[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-0013"/>
      </sch:rule>
   </sch:pattern>
   <sch:pattern>
      <sch:rule id="rule.SCH-0014" abstract="true">
         <sch:assert id="SCH-0014" test="exists(xga:gewerbebetrieb/xga:betriebArt)">[SCH-0014] Bei einer Anmeldung ist die Art des Betriebs anzugeben</sch:assert>
      </sch:rule>
      <sch:rule context="xga:sta.gewerbemeldung.0100//xga:abmeldung[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-0014"/>
      </sch:rule>
      <sch:rule context="xga:ihk.gewerbemeldung.0200//xga:abmeldung[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-0014"/>
      </sch:rule>
      <sch:rule context="xga:hwk.gewerbemeldung.0210//xga:abmeldung[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-0014"/>
      </sch:rule>
      <sch:rule context="xga:dgu.gewerbemeldung.0230//xga:abmeldung[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-0014"/>
      </sch:rule>
      <sch:rule context="xga:zv.gewerbemeldung.0260//xga:abmeldung[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-0014"/>
      </sch:rule>
      <sch:rule context="xga:is.gewerbemeldung.0270//xga:abmeldung[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-0014"/>
      </sch:rule>
      <sch:rule context="xga:as.gewerbemeldung.0280//xga:abmeldung[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-0014"/>
      </sch:rule>
      <sch:rule context="xga:lue.gewerbemeldung.0290//xga:abmeldung[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-0014"/>
      </sch:rule>
      <sch:rule context="xga:alg.gewerbemeldung.0300//xga:abmeldung[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-0014"/>
      </sch:rule>
      <sch:rule context="xga:ext.gewerbemeldung.0400//xga:abmeldung[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-0014"/>
      </sch:rule>
      <sch:rule context="xga:abh.gewerbemeldung.0500//xga:abmeldung[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-0014"/>
      </sch:rule>
      <sch:rule context="xga:unterrichtung.0700//xga:abmeldung[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-0014"/>
      </sch:rule>
   </sch:pattern>
   <sch:pattern>
      <sch:rule id="rule.SCH-0015" abstract="true">
         <sch:assert id="SCH-0015"
                     test="exists(xga:ursacheAbmeldungSchluessel|xga:ursacheAbmeldung)">[SCH-0015] Die Ursache der Abmeldung muss als Freitext oder mit mindestens einem Schlüssel angegeben werden.</sch:assert>
      </sch:rule>
      <sch:rule context="xga:sta.gewerbemeldung.0100//xga:abmeldung[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-0015"/>
      </sch:rule>
      <sch:rule context="xga:ihk.gewerbemeldung.0200//xga:abmeldung[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-0015"/>
      </sch:rule>
      <sch:rule context="xga:hwk.gewerbemeldung.0210//xga:abmeldung[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-0015"/>
      </sch:rule>
      <sch:rule context="xga:dgu.gewerbemeldung.0230//xga:abmeldung[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-0015"/>
      </sch:rule>
      <sch:rule context="xga:fa.gewerbemeldung.0250//xga:abmeldung[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-0015"/>
      </sch:rule>
      <sch:rule context="xga:zv.gewerbemeldung.0260//xga:abmeldung[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-0015"/>
      </sch:rule>
      <sch:rule context="xga:alg.gewerbemeldung.0300//xga:abmeldung[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-0015"/>
      </sch:rule>
      <sch:rule context="xga:ext.gewerbemeldung.0400//xga:abmeldung[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-0015"/>
      </sch:rule>
      <sch:rule context="xga:unterrichtung.0700//xga:abmeldung[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-0015"/>
      </sch:rule>
   </sch:pattern>
   <sch:pattern>
      <sch:rule id="rule.SCH-0027" abstract="true">
         <sch:assert id="SCH-0027"
                     test="(xga:referenzierteSubjekte/*[(jp:juristischePerson.id|rpg:rechtsfaehigePersonengesellschaft.id) =&#xA;            ancestor::xga:abmeldung/xga:gewerbebetrieb/wt:wirtschaftlichTaetiger.id] | xga:gewerbebetrieb)/bk:eintragung/eintr:artEintragung/code = ('A','B','G')">[SCH-0027] Zulässige Arten der Eintragung sind die Schlüssel "A" (für Handelsregister A), "B" (für Handelsregister B) sowie "G" (für Genossenschftsregister).</sch:assert>
      </sch:rule>
      <sch:rule context="xga:rg.gewerbemeldung.0240//xga:abmeldung[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-0027"/>
      </sch:rule>
   </sch:pattern>
   <sch:pattern>
      <sch:rule id="rule.SCH-0041" abstract="true">
         <sch:assert id="SCH-0041"
                     test="nachr:kommunikationspartnerkennung/nachr:praefix/code = ('MELDID', 'xga')">[SCH-0041] Die Behördenkennung des Autors muss das Präfix MELDID oder xga haben.</sch:assert>
      </sch:rule>
      <sch:rule context="xga:sta.gewerbemeldung.0100//nachr:nachrichtenkopf[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]/nachr:autor">
         <sch:extends rule="rule.SCH-0041"/>
      </sch:rule>
      <sch:rule context="xga:ihk.gewerbemeldung.0200//nachr:nachrichtenkopf[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]/nachr:autor">
         <sch:extends rule="rule.SCH-0041"/>
      </sch:rule>
      <sch:rule context="xga:hwk.gewerbemeldung.0210//nachr:nachrichtenkopf[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]/nachr:autor">
         <sch:extends rule="rule.SCH-0041"/>
      </sch:rule>
      <sch:rule context="xga:ea.gewerbemeldung.0220//nachr:nachrichtenkopf[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]/nachr:autor">
         <sch:extends rule="rule.SCH-0041"/>
      </sch:rule>
      <sch:rule context="xga:dgu.gewerbemeldung.0230//nachr:nachrichtenkopf[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]/nachr:autor">
         <sch:extends rule="rule.SCH-0041"/>
      </sch:rule>
      <sch:rule context="xga:rg.gewerbemeldung.0240//nachr:nachrichtenkopf[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]/nachr:autor">
         <sch:extends rule="rule.SCH-0041"/>
      </sch:rule>
      <sch:rule context="xga:fa.gewerbemeldung.0250//nachr:nachrichtenkopf[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]/nachr:autor">
         <sch:extends rule="rule.SCH-0041"/>
      </sch:rule>
      <sch:rule context="xga:zv.gewerbemeldung.0260//nachr:nachrichtenkopf[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]/nachr:autor">
         <sch:extends rule="rule.SCH-0041"/>
      </sch:rule>
      <sch:rule context="xga:is.gewerbemeldung.0270//nachr:nachrichtenkopf[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]/nachr:autor">
         <sch:extends rule="rule.SCH-0041"/>
      </sch:rule>
      <sch:rule context="xga:as.gewerbemeldung.0280//nachr:nachrichtenkopf[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]/nachr:autor">
         <sch:extends rule="rule.SCH-0041"/>
      </sch:rule>
      <sch:rule context="xga:lue.gewerbemeldung.0290//nachr:nachrichtenkopf[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]/nachr:autor">
         <sch:extends rule="rule.SCH-0041"/>
      </sch:rule>
      <sch:rule context="xga:abh.gewerbemeldung.0500//nachr:nachrichtenkopf[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]/nachr:autor">
         <sch:extends rule="rule.SCH-0041"/>
      </sch:rule>
   </sch:pattern>
   <sch:pattern>
      <sch:rule id="rule.SCH-0042" abstract="true">
         <sch:assert id="SCH-0042"
                     test="nachr:kommunikationspartnerkennung/nachr:praefix/code = 'xga'">[SCH-0042] Die Behördenkennung des Lesers muss das Präfix xga haben.</sch:assert>
      </sch:rule>
      <sch:rule context="xga:sta.gewerbemeldung.0100//nachr:nachrichtenkopf[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]/nachr:leser">
         <sch:extends rule="rule.SCH-0042"/>
      </sch:rule>
      <sch:rule context="xga:ihk.gewerbemeldung.0200//nachr:nachrichtenkopf[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]/nachr:leser">
         <sch:extends rule="rule.SCH-0042"/>
      </sch:rule>
      <sch:rule context="xga:ea.gewerbemeldung.0220//nachr:nachrichtenkopf[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]/nachr:leser">
         <sch:extends rule="rule.SCH-0042"/>
      </sch:rule>
      <sch:rule context="xga:dgu.gewerbemeldung.0230//nachr:nachrichtenkopf[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]/nachr:leser">
         <sch:extends rule="rule.SCH-0042"/>
      </sch:rule>
      <sch:rule context="xga:rg.gewerbemeldung.0240//nachr:nachrichtenkopf[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]/nachr:leser">
         <sch:extends rule="rule.SCH-0042"/>
      </sch:rule>
      <sch:rule context="xga:fa.gewerbemeldung.0250//nachr:nachrichtenkopf[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]/nachr:leser">
         <sch:extends rule="rule.SCH-0042"/>
      </sch:rule>
      <sch:rule context="xga:zv.gewerbemeldung.0260//nachr:nachrichtenkopf[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]/nachr:leser">
         <sch:extends rule="rule.SCH-0042"/>
      </sch:rule>
      <sch:rule context="xga:is.gewerbemeldung.0270//nachr:nachrichtenkopf[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]/nachr:leser">
         <sch:extends rule="rule.SCH-0042"/>
      </sch:rule>
      <sch:rule context="xga:as.gewerbemeldung.0280//nachr:nachrichtenkopf[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]/nachr:leser">
         <sch:extends rule="rule.SCH-0042"/>
      </sch:rule>
      <sch:rule context="xga:lue.gewerbemeldung.0290//nachr:nachrichtenkopf[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]/nachr:leser">
         <sch:extends rule="rule.SCH-0042"/>
      </sch:rule>
   </sch:pattern>
   <sch:pattern>
      <sch:rule id="rule.SCH-0043" abstract="true">
         <sch:assert id="SCH-0043"
                     test="if (nachr:praefix/code = 'MELDID') then nachr:kennung/@listURI = 'urn:de:bund:destatis:bevoelkerungsstatistik:schluessel:ags' else true()">[SCH-0043] Eine Kommunikationspartnerkennung mit Präfix MELDID muss einen Behördenschlüssel aus der Codeliste "Amtlicher Gemeindeschlüssel" haben.</sch:assert>
      </sch:rule>
      <sch:rule context="//nachr:kommunikationspartnerkennung">
         <sch:extends rule="rule.SCH-0043"/>
      </sch:rule>
   </sch:pattern>
   <sch:pattern>
      <sch:rule id="rule.SCH-0045" abstract="true">
         <sch:assert id="SCH-0045"
                     test="if (nachr:praefix/code = 'xga') then nachr:kennung/@listURI = 'urn:xoev-de:xgewerbeordnung:codeliste:weiterekommunikationspartner' else true()">[SCH-0045] Eine Kommunikationspartnerkennung mit Präfix xga muss einen Behördenschlüssel aus der Codeliste "Weitere Kommunikationspartner XGewerbeordnung" haben.</sch:assert>
      </sch:rule>
      <sch:rule context="//nachr:kommunikationspartnerkennung">
         <sch:extends rule="rule.SCH-0045"/>
      </sch:rule>
   </sch:pattern>
   <sch:pattern>
      <sch:rule id="rule.SCH-0076" abstract="true">
         <sch:assert id="SCH-0076"
                     test="if (preceding::nachr:nachrichtenkopf[1]/nachr:autor/nachr:kommunikationspartnerkennung/nachr:praefix/code = 'MELDID') then&#xA;            nachr:kommunikationspartnerkennung/nachr:kennung/code = preceding::nachr:nachrichtenkopf/nachr:autor/nachr:kommunikationspartnerkennung/nachr:kennung/code and&#xA;            nachr:kommunikationspartnerkennung/nachr:kennung/@listURI = preceding::nachr:nachrichtenkopf/nachr:autor/nachr:kommunikationspartnerkennung/nachr:kennung/@listURI and&#xA;            nachr:kommunikationspartnerkennung/nachr:kennung/@listVersionID =&#xA;            preceding::nachr:nachrichtenkopf/nachr:autor/nachr:kommunikationspartnerkennung/nachr:kennung/@listVersionID else true()">[SCH-0076] Falls der Autor der Nachricht die Gewerbebehörde einer Gemeinde ist (Präfix MELDID), so muss die Kommunikationspartnerkennung des Autors auf Satzebene mit der des Autors der Nachricht übereinstimmen.</sch:assert>
      </sch:rule>
      <sch:rule context="//(xga:anmeldung|xga:ummeldung|xga:abmeldung|xga:berichtigung)/xga:autor">
         <sch:extends rule="rule.SCH-0076"/>
      </sch:rule>
   </sch:pattern>
   <sch:pattern>
      <sch:rule id="rule.SCH-0088" abstract="true">
         <sch:assert id="SCH-0088"
                     test="ancestor::xga:ummeldung or ancestor::xga:berichtigung">[SCH-0088] Das Kindelement weitereNeuAusgeuebteTaetigkeiten darf nur bei Ummeldungen oder Berichtigungen angegeben werden.</sch:assert>
      </sch:rule>
      <sch:rule context="//xga:taetigkeitenGesamt/xga:weitereNeuAusgeuebteTaetigkeiten">
         <sch:extends rule="rule.SCH-0088"/>
      </sch:rule>
   </sch:pattern>
   <sch:pattern>
      <sch:rule id="rule.SCH-0094" abstract="true">
         <sch:assert id="SCH-0094"
                     test="if (xga:grundAnmeldungSchluessel/code = '01' and (xga:gewerbebetrieb/xga:betriebsstaette/wt:artOrt/code = '01' or&#xA;            xga:gewerbebetrieb/xga:abweichendeHauptniederlassung/bk:anschrift/bk:anschriftAusland or xs:boolean(xga:gewerbebetrieb/xga:istReisegewerbe))) then&#xA;            empty(xga:bisherigeUnfallversicherung) else exists(xga:bisherigeUnfallversicherung)">[SCH-0094] In den Nachrichten 0230, 0300, 0400 und 0700 sind Angaben zur bisherigen Unfallversicherung mitzuteilen. Ausgenommen hiervon sind: Neugründungen für Hauptniederlassungen und Neugründungen für Zweigniederlassungen oder unselbständige Zweigstellen, deren Hauptniederlassung sich im Ausland befindet sowie Neugründungen eines Reisegewerbes.</sch:assert>
      </sch:rule>
      <sch:rule context="xga:dgu.gewerbemeldung.0230//xga:anmeldung[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-0094"/>
      </sch:rule>
      <sch:rule context="xga:alg.gewerbemeldung.0300//xga:anmeldung[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-0094"/>
      </sch:rule>
      <sch:rule context="xga:ext.gewerbemeldung.0400//xga:anmeldung[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-0094"/>
      </sch:rule>
      <sch:rule context="xga:unterrichtung.0700//xga:anmeldung[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-0094"/>
      </sch:rule>
   </sch:pattern>
   <sch:pattern>
      <sch:rule id="rule.SCH-0095" abstract="true">
         <sch:assert id="SCH-0095" test="empty(xga:bisherigeUnfallversicherung)">[SCH-0095] Bei einer Ummeldung dürfen keine Angaben zur bisherigen Unfallversicherung mitgeteilt werden.</sch:assert>
      </sch:rule>
      <sch:rule context="xga:dgu.gewerbemeldung.0230//xga:ummeldung[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-0095"/>
      </sch:rule>
      <sch:rule context="xga:alg.gewerbemeldung.0300//xga:ummeldung[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-0095"/>
      </sch:rule>
      <sch:rule context="xga:ext.gewerbemeldung.0400//xga:ummeldung[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-0095"/>
      </sch:rule>
      <sch:rule context="xga:unterrichtung.0700//xga:ummeldung[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-0095"/>
      </sch:rule>
   </sch:pattern>
   <sch:pattern>
      <sch:rule id="rule.SCH-0096" abstract="true">
         <sch:assert id="SCH-0096" test="empty(xga:bisherigeUnfallversicherung)">[SCH-0096] Bei einer Abmeldung dürfen keine Angaben zur bisherigen Unfallversicherung mitgeteilt werden.</sch:assert>
      </sch:rule>
      <sch:rule context="xga:dgu.gewerbemeldung.0230//xga:abmeldung[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-0096"/>
      </sch:rule>
      <sch:rule context="xga:alg.gewerbemeldung.0300//xga:abmeldung[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-0096"/>
      </sch:rule>
      <sch:rule context="xga:ext.gewerbemeldung.0400//xga:abmeldung[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-0096"/>
      </sch:rule>
      <sch:rule context="xga:unterrichtung.0700//xga:abmeldung[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-0096"/>
      </sch:rule>
   </sch:pattern>
   <sch:pattern>
      <sch:rule id="rule.SCH-0149" abstract="true">
         <sch:assert id="SCH-0149"
                     test="preceding-sibling::xga:grundUmmeldungSchluessel/code = '99'">[SCH-0149] Anlässe für die Ummeldung dürfen nur mitgeteilt werden, wenn als Grund der Ummeldung "Sonstige" (99) enthalten ist.</sch:assert>
      </sch:rule>
      <sch:rule context="//xga:ummeldung/xga:anlaesseUmmeldung">
         <sch:extends rule="rule.SCH-0149"/>
      </sch:rule>
   </sch:pattern>
   <sch:pattern>
      <sch:rule id="rule.SCH-0150" abstract="true">
         <sch:assert id="SCH-0150"
                     test="if (xs:boolean(xga:istReisegewerbe) and exists(xga:betriebArt)) then xs:boolean(xga:betriebArt/xga:handwerk) or xs:boolean(xga:betriebArt/xga:handel) or&#xA;            xs:boolean(xga:betriebArt/xga:sonstiges) else true()">[SCH-0150] Wenn es sich um ein Reisegewerbe handelt und Angaben zur Betriebsart übermittelt werden, muss bei der Art des Betriebes entweder Handwerk, Handel oder Sonstiges angegeben werden.</sch:assert>
      </sch:rule>
      <sch:rule context="xga:sta.gewerbemeldung.0100//xga:gewerbebetrieb[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-0150"/>
      </sch:rule>
      <sch:rule context="xga:ihk.gewerbemeldung.0200//xga:gewerbebetrieb[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-0150"/>
      </sch:rule>
      <sch:rule context="xga:hwk.gewerbemeldung.0210//xga:gewerbebetrieb[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-0150"/>
      </sch:rule>
      <sch:rule context="xga:dgu.gewerbemeldung.0230//xga:gewerbebetrieb[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-0150"/>
      </sch:rule>
      <sch:rule context="xga:zv.gewerbemeldung.0260//xga:gewerbebetrieb[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-0150"/>
      </sch:rule>
      <sch:rule context="xga:is.gewerbemeldung.0270//xga:gewerbebetrieb[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-0150"/>
      </sch:rule>
      <sch:rule context="xga:as.gewerbemeldung.0280//xga:gewerbebetrieb[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-0150"/>
      </sch:rule>
      <sch:rule context="xga:lue.gewerbemeldung.0290//xga:gewerbebetrieb[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-0150"/>
      </sch:rule>
      <sch:rule context="xga:alg.gewerbemeldung.0300//xga:gewerbebetrieb[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-0150"/>
      </sch:rule>
      <sch:rule context="xga:ext.gewerbemeldung.0400//xga:gewerbebetrieb[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-0150"/>
      </sch:rule>
      <sch:rule context="xga:abh.gewerbemeldung.0500//xga:gewerbebetrieb[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-0150"/>
      </sch:rule>
      <sch:rule context="xga:unterrichtung.0700//xga:gewerbebetrieb[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-0150"/>
      </sch:rule>
   </sch:pattern>
   <sch:pattern>
      <sch:rule id="rule.SCH-0151" abstract="true">
         <sch:assert id="SCH-0151"
                     test="if (xga:grundAnmeldungSchluessel/code = '05') then xga:gewerbebetrieb/wt:wirtschaftlichTaetiger.id =&#xA;            xga:referenzierteSubjekte//rpg:rechtsfaehigePersonengesellschaft.id else true()">[SCH-0151] Ein Gesellschaftereintritt (Grund "05") darf nur bei Personengesellschaften vorkommen.</sch:assert>
      </sch:rule>
      <sch:rule context="//xga:anmeldung">
         <sch:extends rule="rule.SCH-0151"/>
      </sch:rule>
   </sch:pattern>
   <sch:pattern>
      <sch:rule id="rule.SCH-0152" abstract="true">
         <sch:assert id="SCH-0152"
                     test="if (xga:grundAbmeldungSchluessel/code = '05') then xga:gewerbebetrieb/wt:wirtschaftlichTaetiger.id =&#xA;            xga:referenzierteSubjekte//rpg:rechtsfaehigePersonengesellschaft.id else true()">[SCH-0152] Ein Gesellschafteraustritt(Grund "05") darf nur bei Personengesellschaften vorkommen.</sch:assert>
      </sch:rule>
      <sch:rule context="//xga:abmeldung">
         <sch:extends rule="rule.SCH-0152"/>
      </sch:rule>
   </sch:pattern>
   <sch:pattern>
      <sch:rule id="rule.SCH-0153" abstract="true">
         <sch:assert id="SCH-0153"
                     test="not(xga:grundAbmeldungSchluessel/code = '01' and xga:ursacheAbmeldungSchluessel/code = '16')">[SCH-0153] Wenn als Grund die vollständige Aufgabe angegeben wurde, darf als Ursache nicht die Verlegung in einen anderen Meldebezirk angegeben werden werden.</sch:assert>
      </sch:rule>
      <sch:rule context="//xga:abmeldung">
         <sch:extends rule="rule.SCH-0153"/>
      </sch:rule>
   </sch:pattern>
   <sch:pattern>
      <sch:rule id="rule.SCH-0154" abstract="true">
         <sch:assert id="SCH-0154"
                     test="if (xga:status/code = '1') then xs:boolean(parent::xga:gewerbebetrieb/xga:betriebArt/xga:handwerk) else true()">[SCH-0154] Bei vorliegender aktueller Handwerkskarte muss "Handwerk" bei der Art des Betriebes angegeben werden.</sch:assert>
      </sch:rule>
      <sch:rule context="xga:sta.gewerbemeldung.0100//xga:handwerkskarte[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-0154"/>
      </sch:rule>
      <sch:rule context="xga:ihk.gewerbemeldung.0200//xga:handwerkskarte[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-0154"/>
      </sch:rule>
      <sch:rule context="xga:hwk.gewerbemeldung.0210//xga:handwerkskarte[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-0154"/>
      </sch:rule>
      <sch:rule context="xga:dgu.gewerbemeldung.0230//xga:handwerkskarte[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-0154"/>
      </sch:rule>
      <sch:rule context="xga:zv.gewerbemeldung.0260//xga:handwerkskarte[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-0154"/>
      </sch:rule>
      <sch:rule context="xga:is.gewerbemeldung.0270//xga:handwerkskarte[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-0154"/>
      </sch:rule>
      <sch:rule context="xga:as.gewerbemeldung.0280//xga:handwerkskarte[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-0154"/>
      </sch:rule>
      <sch:rule context="xga:lue.gewerbemeldung.0290//xga:handwerkskarte[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-0154"/>
      </sch:rule>
      <sch:rule context="xga:alg.gewerbemeldung.0300//xga:handwerkskarte[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-0154"/>
      </sch:rule>
      <sch:rule context="xga:ext.gewerbemeldung.0400//xga:handwerkskarte[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-0154"/>
      </sch:rule>
      <sch:rule context="xga:abh.gewerbemeldung.0500//xga:handwerkskarte[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-0154"/>
      </sch:rule>
      <sch:rule context="xga:unterrichtung.0700//xga:handwerkskarte[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-0154"/>
      </sch:rule>
   </sch:pattern>
   <sch:pattern>
      <sch:rule id="rule.SCH-0156" abstract="true">
         <sch:assert id="SCH-0156"
                     test="if (eintr:artEintragung/code = ('A', 'B', 'V', 'G')) then exists(eintr:registergericht) else empty(eintr:registergericht)">[SCH-0156] Der Gerichtsschlüssel ist dann und nur dann anzugeben, wenn die Eintragungsart "A", "B", "V", oder "G" angegeben wird.</sch:assert>
      </sch:rule>
      <sch:rule context="//bk:eintragung[not(ancestor-or-self::xga:gewerbebetriebVorAenderung|ancestor-or-self::xga:referenzierteSubjekteVorAenderung)]">
         <sch:extends rule="rule.SCH-0156"/>
      </sch:rule>
   </sch:pattern>
   <sch:pattern>
      <sch:rule id="rule.SCH-0158" abstract="true">
         <sch:assert id="SCH-0158"
                     test="if (eintr:artEintragung/code = ('S', 'X')) then exists(adr:ort) else true()">[SCH-0158] Wenn die Eintragungsart "S" oder "X" ist, muss der Ort der Eintragung angegeben werden.</sch:assert>
      </sch:rule>
      <sch:rule context="//bk:eintragung[not(ancestor-or-self::xga:gewerbebetriebVorAenderung|ancestor-or-self::xga:referenzierteSubjekteVorAenderung)]">
         <sch:extends rule="rule.SCH-0158"/>
      </sch:rule>
   </sch:pattern>
   <sch:pattern>
      <sch:rule id="rule.SCH-0159" abstract="true">
         <sch:assert id="SCH-0159"
                     test="exists(xga:referenzierteSubjekte/xga:natuerlichePerson)">[SCH-0159] Die Gewerbemeldung muss Angaben zu mindestens einer natürlichen Person beinhalten.</sch:assert>
      </sch:rule>
      <sch:rule context="xga:ihk.gewerbemeldung.0200//(xga:anmeldung|xga:ummeldung|xga:abmeldung|xga:berichtigung)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-0159"/>
      </sch:rule>
      <sch:rule context="xga:hwk.gewerbemeldung.0210//(xga:anmeldung|xga:ummeldung|xga:abmeldung|xga:berichtigung)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-0159"/>
      </sch:rule>
      <sch:rule context="xga:ea.gewerbemeldung.0220//(xga:anmeldung|xga:ummeldung|xga:abmeldung|xga:berichtigung)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-0159"/>
      </sch:rule>
      <sch:rule context="xga:dgu.gewerbemeldung.0230//(xga:anmeldung|xga:ummeldung|xga:abmeldung|xga:berichtigung)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-0159"/>
      </sch:rule>
      <sch:rule context="xga:fa.gewerbemeldung.0250//(xga:anmeldung|xga:ummeldung|xga:abmeldung|xga:berichtigung)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-0159"/>
      </sch:rule>
      <sch:rule context="xga:zv.gewerbemeldung.0260//(xga:anmeldung|xga:ummeldung|xga:abmeldung|xga:berichtigung)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-0159"/>
      </sch:rule>
      <sch:rule context="xga:is.gewerbemeldung.0270//(xga:anmeldung|xga:ummeldung|xga:abmeldung|xga:berichtigung)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-0159"/>
      </sch:rule>
      <sch:rule context="xga:as.gewerbemeldung.0280//(xga:anmeldung|xga:ummeldung|xga:abmeldung|xga:berichtigung)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-0159"/>
      </sch:rule>
      <sch:rule context="xga:lue.gewerbemeldung.0290//(xga:anmeldung|xga:ummeldung|xga:abmeldung|xga:berichtigung)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-0159"/>
      </sch:rule>
      <sch:rule context="xga:alg.gewerbemeldung.0300//(xga:anmeldung|xga:ummeldung|xga:abmeldung|xga:berichtigung)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-0159"/>
      </sch:rule>
      <sch:rule context="xga:ext.gewerbemeldung.0400//(xga:anmeldung|xga:ummeldung|xga:abmeldung|xga:berichtigung)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-0159"/>
      </sch:rule>
      <sch:rule context="xga:abh.gewerbemeldung.0500//(xga:anmeldung|xga:ummeldung|xga:abmeldung|xga:berichtigung)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-0159"/>
      </sch:rule>
      <sch:rule context="xga:abruf.antwort.0601//(xga:anmeldung|xga:ummeldung|xga:abmeldung|xga:berichtigung)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-0159"/>
      </sch:rule>
      <sch:rule context="xga:unterrichtung.0700//(xga:anmeldung|xga:ummeldung|xga:abmeldung|xga:berichtigung)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-0159"/>
      </sch:rule>
   </sch:pattern>
   <sch:pattern>
      <sch:rule id="rule.SCH-0160" abstract="true">
         <sch:assert id="SCH-0160"
                     test="if (xga:status/code = '1') then exists(xga:ausgestelltVonSchluessel) else true()">[SCH-0160] Bei einer vorliegenden aktuellen Handwerkskarte ist der Schlüssel der Handwerkskammer anzugeben.</sch:assert>
      </sch:rule>
      <sch:rule context="//xga:handwerkskarte[not(ancestor-or-self::xga:gewerbebetriebVorAenderung|ancestor-or-self::xga:referenzierteSubjekteVorAenderung)]">
         <sch:extends rule="rule.SCH-0160"/>
      </sch:rule>
   </sch:pattern>
   <sch:pattern>
      <sch:rule id="rule.SCH-0163" abstract="true">
         <sch:assert id="SCH-0163"
                     test="if ((ancestor::xga:anmeldung or ancestor::xga:ummeldung) and xga:status/code = '1') then exists(xga:ausgestelltAm) else true()">[SCH-0163] Bei An- und Ummeldung muss bei aktuellem Aufenthaltstitel ein Ausstellungsdatum angegeben werden.</sch:assert>
      </sch:rule>
      <sch:rule context="//xga:aufenthaltstitel">
         <sch:extends rule="rule.SCH-0163"/>
      </sch:rule>
   </sch:pattern>
   <sch:pattern>
      <sch:rule id="rule.SCH-0164" abstract="true">
         <sch:assert id="SCH-0164"
                     test="if ((ancestor::xga:anmeldung or ancestor::xga:ummeldung) and xga:status/code = '1') then exists(xga:ausgestelltAm) else true()">[SCH-0164] Bei An- und Ummeldung muss bei aktueller Erlaubnis ein Ausstellungsdatum angegeben werden.</sch:assert>
      </sch:rule>
      <sch:rule context="//xga:erlaubnis">
         <sch:extends rule="rule.SCH-0164"/>
      </sch:rule>
   </sch:pattern>
   <sch:pattern>
      <sch:rule id="rule.SCH-0165" abstract="true">
         <sch:assert id="SCH-0165"
                     test="if (exists(xga:taetigkeit[empty(xga:endeTaetigkeit)]/xga:taetigkeitEinzeln)) then xga:taetigkeitenZusammengefasst =&#xA;            string-join(xga:taetigkeit[empty(xga:endeTaetigkeit)]/xga:taetigkeitEinzeln, '|') else true()">[SCH-0165] Wenn weitere (aktuelle) Tätigkeitstexte mittels taetigkeitEinzeln als separate Angaben übermittelt werden, ist die Zusammenfassung durch Konkatenation aus ebendiesen zu bilden.</sch:assert>
      </sch:rule>
      <sch:rule context="//xga:weitereTaetigkeiten[not(ancestor-or-self::xga:gewerbebetriebVorAenderung|ancestor-or-self::xga:referenzierteSubjekteVorAenderung)]">
         <sch:extends rule="rule.SCH-0165"/>
      </sch:rule>
   </sch:pattern>
   <sch:pattern>
      <sch:rule id="rule.SCH-0166" abstract="true">
         <sch:assert id="SCH-0166"
                     test="if (exists(xga:taetigkeit[empty(xga:endeTaetigkeit)]/xga:taetigkeitEinzeln)) then xga:taetigkeitenZusammengefasst =&#xA;            string-join(xga:taetigkeit[empty(xga:endeTaetigkeit)]/xga:taetigkeitEinzeln, '|') else true()">[SCH-0166] Wenn weitere (aktuelle) Tätigkeitstexte mittels taetigkeitEinzeln als separate Angaben übermittelt werden, ist die Zusammenfassung durch Konkatenation aus ebendiesen zu bilden.</sch:assert>
      </sch:rule>
      <sch:rule context="//xga:weitereNeuAusgeuebteTaetigkeiten">
         <sch:extends rule="rule.SCH-0166"/>
      </sch:rule>
   </sch:pattern>
   <sch:pattern>
      <sch:rule id="rule.SCH-0167" abstract="true">
         <sch:assert id="SCH-0167" test="exists(.//bk:anschrift)">[SCH-0167] In der Anmeldung muss mindestens eine Anschrift vorhanden sein (zu der Betriebsstätte, der Hauptniederlassung, einer Person oder einer Firma).</sch:assert>
      </sch:rule>
      <sch:rule context="xga:zv.gewerbemeldung.0260//(xga:anmeldung|xga:ummeldung|xga:abmeldung|xga:berichtigung)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-0167"/>
      </sch:rule>
   </sch:pattern>
   <sch:pattern>
      <sch:rule id="rule.SCH-0168" abstract="true">
         <sch:assert id="SCH-0168"
                     test="if ((ancestor::xga:anmeldung or ancestor::xga:ummeldung) and xga:status/code = '1') then exists(xga:ausgestelltVonName) else true()">[SCH-0168] Bei An- und Ummeldung muss bei aktuellem Aufenthaltstitel eine erteilende Behörde angegeben werden.</sch:assert>
      </sch:rule>
      <sch:rule context="//xga:aufenthaltstitel">
         <sch:extends rule="rule.SCH-0168"/>
      </sch:rule>
   </sch:pattern>
   <sch:pattern>
      <sch:rule id="rule.SCH-0169" abstract="true">
         <sch:assert id="SCH-0169"
                     test="if ((ancestor::xga:anmeldung or ancestor::xga:ummeldung) and xga:status/code = '1') then exists(xga:ausgestelltVonName) else true()">[SCH-0169] Bei An- und Ummeldung muss bei aktueller Erlaubnis eine erteilende Behörde angegeben werden.</sch:assert>
      </sch:rule>
      <sch:rule context="//xga:erlaubnis">
         <sch:extends rule="rule.SCH-0169"/>
      </sch:rule>
   </sch:pattern>
   <sch:pattern>
      <sch:rule id="rule.SCH-0178" abstract="true">
         <sch:assert id="SCH-0178"
                     test="if (preceding::nachr:nachrichtenkopf/nachr:autor/nachr:kommunikationspartnerkennung/nachr:praefix/code = 'xga') then&#xA;            substring(nachr:kommunikationspartnerkennung/nachr:kennung/code,1,2) =&#xA;            substring(preceding::nachr:nachrichtenkopf/nachr:autor/nachr:kommunikationspartnerkennung/nachr:kennung/code,1,2) else true()">[SCH-0178] Falls der Autor einer Nachricht ein weiterer Kommunikationspartner ist (Präfix xga), muss der Länder-Code (die ersten beiden Stellen der Behördenkennung) des Autors auf Nachrichten- und Satzebene übereinstimmen.</sch:assert>
      </sch:rule>
      <sch:rule context="//(xga:anmeldung|xga:ummeldung|xga:abmeldung|xga:berichtigung)/xga:autor">
         <sch:extends rule="rule.SCH-0178"/>
      </sch:rule>
   </sch:pattern>
   <sch:pattern>
      <sch:rule id="rule.SCH-0179" abstract="true">
         <sch:assert id="SCH-0179"
                     test="not(xga:ursacheAbmeldungSchluessel/code = '13' and xga:ereigniszeitpunkt &gt;= '2020-05-01')">[SCH-0179] Die Abmeldungsursache 13 ist nur für Ereigniszeitpunkte vor dem 01.05.2020 zulässig, danach sind die differenzierteren Abmeldegründe 19 bis 22 zu verwenden.</sch:assert>
      </sch:rule>
      <sch:rule context="//xga:abmeldung">
         <sch:extends rule="rule.SCH-0179"/>
      </sch:rule>
   </sch:pattern>
   <sch:pattern>
      <sch:rule id="rule.SCH-0180" abstract="true">
         <sch:assert id="SCH-0180"
                     test="if (xga:grundAnmeldungSchluessel/code = '04') then exists(xga:frueheresGewerbe/xga:nameFirmaGewerbetreibender) else true()">[SCH-0180] Bei einem Wechsel der Rechtsform ist das frühere Gewerbe anzugeben.</sch:assert>
      </sch:rule>
      <sch:rule context="xga:ihk.gewerbemeldung.0200//xga:anmeldung[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-0180"/>
      </sch:rule>
      <sch:rule context="xga:hwk.gewerbemeldung.0210//xga:anmeldung[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-0180"/>
      </sch:rule>
      <sch:rule context="xga:dgu.gewerbemeldung.0230//xga:anmeldung[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-0180"/>
      </sch:rule>
      <sch:rule context="xga:rg.gewerbemeldung.0240//xga:anmeldung[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-0180"/>
      </sch:rule>
      <sch:rule context="xga:fa.gewerbemeldung.0250//xga:anmeldung[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-0180"/>
      </sch:rule>
      <sch:rule context="xga:zv.gewerbemeldung.0260//xga:anmeldung[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-0180"/>
      </sch:rule>
      <sch:rule context="xga:is.gewerbemeldung.0270//xga:anmeldung[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-0180"/>
      </sch:rule>
      <sch:rule context="xga:as.gewerbemeldung.0280//xga:anmeldung[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-0180"/>
      </sch:rule>
      <sch:rule context="xga:lue.gewerbemeldung.0290//xga:anmeldung[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-0180"/>
      </sch:rule>
      <sch:rule context="xga:alg.gewerbemeldung.0300//xga:anmeldung[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-0180"/>
      </sch:rule>
      <sch:rule context="xga:ext.gewerbemeldung.0400//xga:anmeldung[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-0180"/>
      </sch:rule>
      <sch:rule context="xga:unterrichtung.0700//xga:anmeldung[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-0180"/>
      </sch:rule>
   </sch:pattern>
   <sch:pattern>
      <sch:rule id="rule.SCH-0181" abstract="true">
         <sch:assert id="SCH-0181"
                     test="if (xga:grundAbmeldungSchluessel/code = '04') then exists(xga:kuenftigesGewerbe/xga:nameFirmaGewerbetreibender) else true()">[SCH-0181] Bei einem Wechsel der Rechtsform ist das künftige Gewerbe anzugeben.</sch:assert>
      </sch:rule>
      <sch:rule context="xga:ihk.gewerbemeldung.0200//xga:abmeldung[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-0181"/>
      </sch:rule>
      <sch:rule context="xga:hwk.gewerbemeldung.0210//xga:abmeldung[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-0181"/>
      </sch:rule>
      <sch:rule context="xga:dgu.gewerbemeldung.0230//xga:abmeldung[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-0181"/>
      </sch:rule>
      <sch:rule context="xga:rg.gewerbemeldung.0240//xga:abmeldung[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-0181"/>
      </sch:rule>
      <sch:rule context="xga:zv.gewerbemeldung.0260//xga:abmeldung[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-0181"/>
      </sch:rule>
      <sch:rule context="xga:is.gewerbemeldung.0270//xga:abmeldung[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-0181"/>
      </sch:rule>
      <sch:rule context="xga:as.gewerbemeldung.0280//xga:abmeldung[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-0181"/>
      </sch:rule>
      <sch:rule context="xga:lue.gewerbemeldung.0290//xga:abmeldung[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-0181"/>
      </sch:rule>
      <sch:rule context="xga:alg.gewerbemeldung.0300//xga:abmeldung[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-0181"/>
      </sch:rule>
      <sch:rule context="xga:ext.gewerbemeldung.0400//xga:abmeldung[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-0181"/>
      </sch:rule>
      <sch:rule context="xga:abh.gewerbemeldung.0500//xga:abmeldung[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-0181"/>
      </sch:rule>
      <sch:rule context="xga:unterrichtung.0700//xga:abmeldung[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-0181"/>
      </sch:rule>
   </sch:pattern>
   <sch:pattern>
      <sch:rule id="rule.SCH-0182" abstract="true">
         <sch:assert id="SCH-0182"
                     test="if (xga:grundAnmeldungSchluessel/code = '06') then exists(xga:frueheresGewerbe/xga:nameFirmaGewerbetreibender) else true()">[SCH-0182] Bei einer Übergabe (Erbfolge/Verkauf/Verpachtung) ist das frühere Gewerbe anzugeben. Ggf. ist 'unbekannt' einzutragen.</sch:assert>
      </sch:rule>
      <sch:rule context="xga:ihk.gewerbemeldung.0200//xga:anmeldung[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-0182"/>
      </sch:rule>
      <sch:rule context="xga:hwk.gewerbemeldung.0210//xga:anmeldung[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-0182"/>
      </sch:rule>
      <sch:rule context="xga:dgu.gewerbemeldung.0230//xga:anmeldung[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-0182"/>
      </sch:rule>
      <sch:rule context="xga:rg.gewerbemeldung.0240//xga:anmeldung[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-0182"/>
      </sch:rule>
      <sch:rule context="xga:fa.gewerbemeldung.0250//xga:anmeldung[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-0182"/>
      </sch:rule>
      <sch:rule context="xga:zv.gewerbemeldung.0260//xga:anmeldung[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-0182"/>
      </sch:rule>
      <sch:rule context="xga:is.gewerbemeldung.0270//xga:anmeldung[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-0182"/>
      </sch:rule>
      <sch:rule context="xga:as.gewerbemeldung.0280//xga:anmeldung[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-0182"/>
      </sch:rule>
      <sch:rule context="xga:lue.gewerbemeldung.0290//xga:anmeldung[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-0182"/>
      </sch:rule>
      <sch:rule context="xga:alg.gewerbemeldung.0300//xga:anmeldung[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-0182"/>
      </sch:rule>
      <sch:rule context="xga:ext.gewerbemeldung.0400//xga:anmeldung[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-0182"/>
      </sch:rule>
      <sch:rule context="xga:unterrichtung.0700//xga:anmeldung[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-0182"/>
      </sch:rule>
   </sch:pattern>
   <sch:pattern>
      <sch:rule id="rule.SCH-0183" abstract="true">
         <sch:assert id="SCH-0183"
                     test="if (xga:grundAbmeldungSchluessel/code = '06') then exists(xga:kuenftigesGewerbe/xga:nameFirmaGewerbetreibender) else true()">[SCH-0183] Bei einer Übergabe (Erbfolge/Verkauf/Verpachtung) ist das künftige Gewerbe anzugeben. Ggf. ist 'unbekannt' einzutragen.</sch:assert>
      </sch:rule>
      <sch:rule context="xga:ihk.gewerbemeldung.0200//xga:abmeldung[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-0183"/>
      </sch:rule>
      <sch:rule context="xga:hwk.gewerbemeldung.0210//xga:abmeldung[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-0183"/>
      </sch:rule>
      <sch:rule context="xga:dgu.gewerbemeldung.0230//xga:abmeldung[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-0183"/>
      </sch:rule>
      <sch:rule context="xga:rg.gewerbemeldung.0240//xga:abmeldung[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-0183"/>
      </sch:rule>
      <sch:rule context="xga:zv.gewerbemeldung.0260//xga:abmeldung[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-0183"/>
      </sch:rule>
      <sch:rule context="xga:is.gewerbemeldung.0270//xga:abmeldung[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-0183"/>
      </sch:rule>
      <sch:rule context="xga:as.gewerbemeldung.0280//xga:abmeldung[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-0183"/>
      </sch:rule>
      <sch:rule context="xga:lue.gewerbemeldung.0290//xga:abmeldung[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-0183"/>
      </sch:rule>
      <sch:rule context="xga:alg.gewerbemeldung.0300//xga:abmeldung[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-0183"/>
      </sch:rule>
      <sch:rule context="xga:ext.gewerbemeldung.0400//xga:abmeldung[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-0183"/>
      </sch:rule>
      <sch:rule context="xga:abh.gewerbemeldung.0500//xga:abmeldung[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-0183"/>
      </sch:rule>
      <sch:rule context="xga:unterrichtung.0700//xga:abmeldung[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-0183"/>
      </sch:rule>
   </sch:pattern>
   <sch:pattern>
      <sch:rule id="rule.SCH-0184" abstract="true">
         <sch:assert id="SCH-0184"
                     test="if (xga:grundAnmeldungSchluessel/code = '03') then exists(xga:frueheresGewerbe/xga:nameFirmaGewerbetreibender) else true()">[SCH-0184] Bei einem Übergang nach dem Umwandlungsgesetz (z. B. Verschmelzung, Spaltung) ist das frühere Gewerbe anzugeben. Ggf. ist 'unbekannt' einzutragen.</sch:assert>
      </sch:rule>
      <sch:rule context="xga:ihk.gewerbemeldung.0200//xga:anmeldung[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-0184"/>
      </sch:rule>
      <sch:rule context="xga:hwk.gewerbemeldung.0210//xga:anmeldung[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-0184"/>
      </sch:rule>
      <sch:rule context="xga:dgu.gewerbemeldung.0230//xga:anmeldung[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-0184"/>
      </sch:rule>
      <sch:rule context="xga:rg.gewerbemeldung.0240//xga:anmeldung[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-0184"/>
      </sch:rule>
      <sch:rule context="xga:fa.gewerbemeldung.0250//xga:anmeldung[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-0184"/>
      </sch:rule>
      <sch:rule context="xga:zv.gewerbemeldung.0260//xga:anmeldung[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-0184"/>
      </sch:rule>
      <sch:rule context="xga:is.gewerbemeldung.0270//xga:anmeldung[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-0184"/>
      </sch:rule>
      <sch:rule context="xga:as.gewerbemeldung.0280//xga:anmeldung[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-0184"/>
      </sch:rule>
      <sch:rule context="xga:lue.gewerbemeldung.0290//xga:anmeldung[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-0184"/>
      </sch:rule>
      <sch:rule context="xga:alg.gewerbemeldung.0300//xga:anmeldung[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-0184"/>
      </sch:rule>
      <sch:rule context="xga:ext.gewerbemeldung.0400//xga:anmeldung[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-0184"/>
      </sch:rule>
      <sch:rule context="xga:unterrichtung.0700//xga:anmeldung[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-0184"/>
      </sch:rule>
   </sch:pattern>
   <sch:pattern>
      <sch:rule id="rule.SCH-0185" abstract="true">
         <sch:assert id="SCH-0185"
                     test="if (xga:grundAbmeldungSchluessel/code = '03') then exists(xga:kuenftigesGewerbe/xga:nameFirmaGewerbetreibender) else true()">[SCH-0185] Bei einem Übergang nach dem Umwandlungsgesetz (z. B. Verschmelzung, Spaltung) ist das künftige Gewerbe anzugeben. Ggf. ist 'unbekannt' einzutragen.</sch:assert>
      </sch:rule>
      <sch:rule context="xga:ihk.gewerbemeldung.0200//xga:abmeldung[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-0185"/>
      </sch:rule>
      <sch:rule context="xga:hwk.gewerbemeldung.0210//xga:abmeldung[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-0185"/>
      </sch:rule>
      <sch:rule context="xga:dgu.gewerbemeldung.0230//xga:abmeldung[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-0185"/>
      </sch:rule>
      <sch:rule context="xga:rg.gewerbemeldung.0240//xga:abmeldung[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-0185"/>
      </sch:rule>
      <sch:rule context="xga:zv.gewerbemeldung.0260//xga:abmeldung[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-0185"/>
      </sch:rule>
      <sch:rule context="xga:is.gewerbemeldung.0270//xga:abmeldung[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-0185"/>
      </sch:rule>
      <sch:rule context="xga:as.gewerbemeldung.0280//xga:abmeldung[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-0185"/>
      </sch:rule>
      <sch:rule context="xga:lue.gewerbemeldung.0290//xga:abmeldung[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-0185"/>
      </sch:rule>
      <sch:rule context="xga:alg.gewerbemeldung.0300//xga:abmeldung[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-0185"/>
      </sch:rule>
      <sch:rule context="xga:ext.gewerbemeldung.0400//xga:abmeldung[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-0185"/>
      </sch:rule>
      <sch:rule context="xga:abh.gewerbemeldung.0500//xga:abmeldung[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-0185"/>
      </sch:rule>
      <sch:rule context="xga:unterrichtung.0700//xga:abmeldung[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-0185"/>
      </sch:rule>
   </sch:pattern>
   <sch:pattern>
      <sch:rule id="rule.SCH-0187" abstract="true">
         <sch:assert id="SCH-0187"
                     test="not(parent::*/xga:referenzierteSubjekte/xga:rechtsfaehigePersonengesellschaft[rpg:rechtsfaehigePersonengesellschaft.id =&#xA;            current()/wt:wirtschaftlichTaetiger.id]/rf:rechtsform/rf:rechtsformcode/code = ('170', '180', '270') and xga:beteiligungOeffentlicheHand/code = '1')">[SCH-0187] Eine Beteiligung der öffentlichen Hand kann für Einzelunternehmen und GbRs nicht vorliegen.</sch:assert>
      </sch:rule>
      <sch:rule context="//xga:gewerbebetrieb">
         <sch:extends rule="rule.SCH-0187"/>
      </sch:rule>
   </sch:pattern>
   <sch:pattern>
      <sch:rule id="rule.SCH-0188" abstract="true">
         <sch:assert id="SCH-0188"
                     test="if (xga:autor/nachr:kommunikationspartnerkennung/nachr:praefix/code = 'MELDID') then xga:autor/nachr:kommunikationspartnerkennung/nachr:kennung/code =&#xA;            xga:gemeindeSchluessel/code else true()">[SCH-0188] Bei Meldungen einer Gemeinde müssen der Behördenschlüssel des Autors und der Gemeindeschlüssel der Betriebsstätte übereinstimmen.</sch:assert>
      </sch:rule>
      <sch:rule context="//(xga:anmeldung|xga:ummeldung|xga:abmeldung|xga:berichtigung)">
         <sch:extends rule="rule.SCH-0188"/>
      </sch:rule>
   </sch:pattern>
   <sch:pattern>
      <sch:rule id="rule.SCH-0189" abstract="true">
         <sch:assert id="SCH-0189"
                     test="if (xga:gemeindeSchluessel/code = ('02000000', '11000000')) then exists(xga:gemeindeschluesselErgaenzung) else true()">[SCH-0189] Für die Städte Hamburg und Berlin ist der Stadtbezirk der Betriebsstätte mitzuteilen.</sch:assert>
      </sch:rule>
      <sch:rule context="//(xga:anmeldung|xga:ummeldung|xga:abmeldung|xga:berichtigung)">
         <sch:extends rule="rule.SCH-0189"/>
      </sch:rule>
   </sch:pattern>
   <sch:pattern>
      <sch:rule id="rule.SCH-0193" abstract="true">
         <sch:assert id="SCH-0193"
                     test="if(ancestor::xga:satz/*/xga:ereigniszeitpunkt &gt;= '2022-05-01') then matches(., '^\+[0-9]{1,5}\s[0-9]{1,5}\s[0-9]{1,8}(-[0-9]{1,5})?$') else true()">[SCH-0193] Ab Version XGewO 1.0 müssen Telefonnummern nach DIN 5008 kodiert werden.</sch:assert>
      </sch:rule>
      <sch:rule context="//kom:telefon[not(ancestor-or-self::xga:gewerbebetriebVorAenderung|ancestor-or-self::xga:referenzierteSubjekteVorAenderung)]">
         <sch:extends rule="rule.SCH-0193"/>
      </sch:rule>
   </sch:pattern>
   <sch:pattern>
      <sch:rule id="rule.SCH-0194" abstract="true">
         <sch:assert id="SCH-0194"
                     test="exists(xga:taetigkeitEinzeln) or exists(xga:taetigkeitSchluessel)">[SCH-0194] Eines der Elemente taetigkeitEinzeln oder taetigkeitSchluessel muss angegeben werden.</sch:assert>
      </sch:rule>
      <sch:rule context="//xga:taetigkeit[not(ancestor-or-self::xga:gewerbebetriebVorAenderung|ancestor-or-self::xga:referenzierteSubjekteVorAenderung)]">
         <sch:extends rule="rule.SCH-0194"/>
      </sch:rule>
   </sch:pattern>
   <sch:pattern>
      <sch:rule id="rule.SCH-0196" abstract="true">
         <sch:assert id="SCH-0196"
                     test="nachr:kommunikationspartnerkennung/nachr:praefix/code = 'azr'">[SCH-0196] Die Behördenkennung des Lesers muss das Präfix azr haben.</sch:assert>
      </sch:rule>
      <sch:rule context="xga:abh.gewerbemeldung.0500//nachr:nachrichtenkopf[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]/nachr:leser">
         <sch:extends rule="rule.SCH-0196"/>
      </sch:rule>
   </sch:pattern>
   <sch:pattern>
      <sch:rule id="rule.SCH-0197" abstract="true">
         <sch:assert id="SCH-0197"
                     test="if (nachr:praefix/code = 'azr') then nachr:kennung/@listURI = 'urn:de:xauslaender:codelist:abhkennung' else true()">[SCH-0197] Eine Behördenkennung mit Präfix azr muss einen Behördenschlüssel aus der Codeliste "Ausländerbehörden" haben.</sch:assert>
      </sch:rule>
      <sch:rule context="//nachr:kommunikationspartnerkennung">
         <sch:extends rule="rule.SCH-0197"/>
      </sch:rule>
   </sch:pattern>
   <sch:pattern>
      <sch:rule id="rule.SCH-0199" abstract="true">
         <sch:assert id="SCH-0199"
                     test="not(np:staatsangehoerigkeit/code = '000' and np:natuerlichePerson.id =&#xA;            ancestor::xga:abh.gewerbemeldung.0500//xga:gewerbebetrieb/xga:gewerbetreibender/xga:gewerbetreibender.id)">[SCH-0199] Den Ausländerbehörden dürfen keine Gewerbetreibenden mit deutscher Staatsangehörigkeit übermittelt werden.</sch:assert>
      </sch:rule>
      <sch:rule context="xga:abh.gewerbemeldung.0500//xga:referenzierteSubjekte[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]/xga:natuerlichePerson">
         <sch:extends rule="rule.SCH-0199"/>
      </sch:rule>
   </sch:pattern>
   <sch:pattern>
      <sch:rule id="rule.SCH-0200" abstract="true">
         <sch:assert id="SCH-0200"
                     test="some $p in descendant::xga:natuerlichePerson satisfies not($p/np:staatsangehoerigkeit/code = '000')">[SCH-0200] Mindestens eine der Personen im Datensatz darf nicht die deutsche Staatsangehörigkeit besitzen.</sch:assert>
      </sch:rule>
      <sch:rule context="xga:abh.gewerbemeldung.0500//(xga:anmeldung|xga:ummeldung|xga:abmeldung|xga:berichtigung)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-0200"/>
      </sch:rule>
   </sch:pattern>
   <sch:pattern>
      <sch:rule id="rule.SCH-0201" abstract="true">
         <sch:assert id="SCH-0201"
                     test="xs:boolean(xga:industrie) or xs:boolean(xga:handwerk) or xs:boolean(xga:handel) or xs:boolean(xga:sonstiges)">[SCH-0201] Es muss eine Art des Betriebes angegeben sein.</sch:assert>
      </sch:rule>
      <sch:rule context="//xga:betriebArt[not(ancestor-or-self::xga:gewerbebetriebVorAenderung|ancestor-or-self::xga:referenzierteSubjekteVorAenderung)]">
         <sch:extends rule="rule.SCH-0201"/>
      </sch:rule>
   </sch:pattern>
   <sch:pattern>
      <sch:rule id="rule.SCH-0202" abstract="true">
         <sch:assert id="SCH-0202"
                     test="if(exists(xga:anlaesseBerichtigung)) then xga:grundBerichtigungSchluessel/code = '99' else true()">[SCH-0202] Anlässe für die Berichtigung dürfen nur mitgeteilt werden, wenn als Grund der Berichtigung "Sonstige" (99) enthalten ist.</sch:assert>
      </sch:rule>
      <sch:rule context="//xga:berichtigung">
         <sch:extends rule="rule.SCH-0202"/>
      </sch:rule>
   </sch:pattern>
   <sch:pattern>
      <sch:rule id="rule.SCH-0203" abstract="true">
         <sch:assert id="SCH-0203" test="exists(xga:gewerbebetriebVorAenderung)">[SCH-0203] Bei einer Ummeldung sind Angaben zum Gewerbe vor der Änderung zu übermitteln.</sch:assert>
      </sch:rule>
      <sch:rule context="//xga:ummeldung">
         <sch:extends rule="rule.SCH-0203"/>
      </sch:rule>
   </sch:pattern>
   <sch:pattern>
      <sch:rule id="rule.SCH-0204" abstract="true">
         <sch:assert id="SCH-0204" test="exists(xga:gewerbebetriebVorAenderung)">[SCH-0204] Bei einer Berichtigung sind Angaben zum Gewerbe vor der Änderung zu übermitteln.</sch:assert>
      </sch:rule>
      <sch:rule context="//xga:berichtigung">
         <sch:extends rule="rule.SCH-0204"/>
      </sch:rule>
   </sch:pattern>
   <sch:pattern>
      <sch:rule id="rule.SCH-0205" abstract="true">
         <sch:assert id="SCH-0205"
                     test="not(rf:rechtsform/rf:rechtsformcode/code = '180' and exists(ename:eingetragenerName) and ancestor::xga:satz/*/xga:ereigniszeitpunkt &gt;= '2021-05-08')">[SCH-0205] Bei einem nicht eingetragenen Einzelunternehmen (180) darf kein eingetragener Name angegeben werden.</sch:assert>
      </sch:rule>
      <sch:rule context="//xga:gewerbebetrieb">
         <sch:extends rule="rule.SCH-0205"/>
      </sch:rule>
   </sch:pattern>
   <sch:pattern>
      <sch:rule id="rule.SCH-0206" abstract="true">
         <sch:assert id="SCH-0206"
                     test="xs:boolean(dat:unbekannt) or xs:string(ancestor::xga:satz//xga:datumMeldung) ge xs:string(dat:datum|dat:jahrMonat|dat:jahr)">[SCH-0206] Das Geburtsdatum einer beteiligten Person muss vor dem Datum der Meldung liegen.</sch:assert>
      </sch:rule>
      <sch:rule context="xga:sta.gewerbemeldung.0100//bk:geburt[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]/np:geburtsdatum">
         <sch:extends rule="rule.SCH-0206"/>
      </sch:rule>
      <sch:rule context="xga:ihk.gewerbemeldung.0200//bk:geburt[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]/np:geburtsdatum">
         <sch:extends rule="rule.SCH-0206"/>
      </sch:rule>
      <sch:rule context="xga:hwk.gewerbemeldung.0210//bk:geburt[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]/np:geburtsdatum">
         <sch:extends rule="rule.SCH-0206"/>
      </sch:rule>
      <sch:rule context="xga:dgu.gewerbemeldung.0230//bk:geburt[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]/np:geburtsdatum">
         <sch:extends rule="rule.SCH-0206"/>
      </sch:rule>
      <sch:rule context="xga:fa.gewerbemeldung.0250//bk:geburt[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]/np:geburtsdatum">
         <sch:extends rule="rule.SCH-0206"/>
      </sch:rule>
      <sch:rule context="xga:zv.gewerbemeldung.0260//bk:geburt[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]/np:geburtsdatum">
         <sch:extends rule="rule.SCH-0206"/>
      </sch:rule>
      <sch:rule context="xga:is.gewerbemeldung.0270//bk:geburt[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]/np:geburtsdatum">
         <sch:extends rule="rule.SCH-0206"/>
      </sch:rule>
      <sch:rule context="xga:as.gewerbemeldung.0280//bk:geburt[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]/np:geburtsdatum">
         <sch:extends rule="rule.SCH-0206"/>
      </sch:rule>
      <sch:rule context="xga:lue.gewerbemeldung.0290//bk:geburt[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]/np:geburtsdatum">
         <sch:extends rule="rule.SCH-0206"/>
      </sch:rule>
      <sch:rule context="xga:alg.gewerbemeldung.0300//bk:geburt[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]/np:geburtsdatum">
         <sch:extends rule="rule.SCH-0206"/>
      </sch:rule>
      <sch:rule context="xga:ext.gewerbemeldung.0400//bk:geburt[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]/np:geburtsdatum">
         <sch:extends rule="rule.SCH-0206"/>
      </sch:rule>
      <sch:rule context="xga:abh.gewerbemeldung.0500//bk:geburt[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]/np:geburtsdatum">
         <sch:extends rule="rule.SCH-0206"/>
      </sch:rule>
      <sch:rule context="xga:unterrichtung.0700//bk:geburt[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]/np:geburtsdatum">
         <sch:extends rule="rule.SCH-0206"/>
      </sch:rule>
   </sch:pattern>
   <sch:pattern>
      <sch:rule id="rule.SCH-0208" abstract="true">
         <sch:assert id="SCH-0208"
                     test="not(preceding-sibling::np:staatsangehoerigkeit/code = '000')">[SCH-0208] Wenn eine natürliche Person die deutsche Staatsangehörigkeit besitzt, so darf für diese Person kein Aufenthaltstitel angegeben werden.</sch:assert>
      </sch:rule>
      <sch:rule context="//xga:natuerlichePerson[not(ancestor-or-self::xga:gewerbebetriebVorAenderung|ancestor-or-self::xga:referenzierteSubjekteVorAenderung)]/xga:aufenthaltstitel">
         <sch:extends rule="rule.SCH-0208"/>
      </sch:rule>
   </sch:pattern>
   <sch:pattern>
      <sch:rule id="rule.SCH-0211" abstract="true">
         <sch:assert id="SCH-0211"
                     test="count(*) =&#xA;            count(distinct-values(.//np:natuerlichePerson.id|.//jp:juristischePerson.id|.//rpg:rechtsfaehigePersonengesellschaft.id|.//spv:sonstigePersonenvereinigung.id))">[SCH-0211] Die IDs der referenzierten Subjekte müssen eindeutig sein.</sch:assert>
      </sch:rule>
      <sch:rule context="//(xga:anmeldung|xga:ummeldung|xga:abmeldung|xga:berichtigung)/xga:referenzierteSubjekte">
         <sch:extends rule="rule.SCH-0211"/>
      </sch:rule>
   </sch:pattern>
   <sch:pattern>
      <sch:rule id="rule.SCH-0212" abstract="true">
         <sch:assert id="SCH-0212"
                     test="xga:gewerbetreibender.id = parent::*/parent::*/xga:referenzierteSubjekte/*/(np:natuerlichePerson.id|jp:juristischePerson.id)">[SCH-0212] Bei dem Gewerbetreibenden muss es sich um eine natürliche oder eine juristische Person in 'referenzierteSubjekte' handeln.</sch:assert>
      </sch:rule>
      <sch:rule context="//xga:gewerbebetrieb/xga:gewerbetreibender">
         <sch:extends rule="rule.SCH-0212"/>
      </sch:rule>
   </sch:pattern>
   <sch:pattern>
      <sch:rule id="rule.SCH-0213" abstract="true">
         <sch:assert id="SCH-0213"
                     test="xga:gewerbetreibender.id = parent::*/parent::*/xga:referenzierteSubjekteVorAenderung/*/(np:natuerlichePerson.id|jp:juristischePerson.id)">[SCH-0213] Bei dem Gewerbetreibenden muss es sich um eine natürliche oder eine juristische Person in 'referenzierteSubjekteVorAenderung' handeln.</sch:assert>
      </sch:rule>
      <sch:rule context="//xga:gewerbebetriebVorAenderung/xga:gewerbetreibender">
         <sch:extends rule="rule.SCH-0213"/>
      </sch:rule>
   </sch:pattern>
   <sch:pattern>
      <sch:rule id="rule.SCH-0214" abstract="true">
         <sch:assert id="SCH-0214"
                     test=". = parent::*/parent::*/parent::*/*/(np:natuerlichePerson.id|jp:juristischePerson.id)">[SCH-0214] Bei dem gesetzlichen Vertreter muss es sich um eine natürliche oder eine juristische Person im gleichen Container ('referenzierteSubjekte', 'referenzierteSubjekteVorAenderung') handeln.</sch:assert>
      </sch:rule>
      <sch:rule context="//gv:gesetzlicherVertreter.id">
         <sch:extends rule="rule.SCH-0214"/>
      </sch:rule>
   </sch:pattern>
   <sch:pattern>
      <sch:rule id="rule.SCH-0215" abstract="true">
         <sch:assert id="SCH-0215"
                     test=". = parent::*/parent::*/parent::*//(np:natuerlichePerson.id|jp:juristischePerson.id|jp:juristischePerson.id|rpg:rechtsfaehigePersonengesellschaft.id)">[SCH-0215] Bei dem Gesellschafter muss es sich um eine natürliche oder eine juristische Person oder eine rechtsfähige Personengesellschaft im gleichen Container ('referenzierteSubjekte', 'referenzierteSubjekteVorAenderung') handeln.</sch:assert>
      </sch:rule>
      <sch:rule context="//xga:rechtsfaehigePersonengesellschaft/xga:gesellschafter/ges:gesellschafter.id">
         <sch:extends rule="rule.SCH-0215"/>
      </sch:rule>
   </sch:pattern>
   <sch:pattern>
      <sch:rule id="rule.SCH-0216" abstract="true">
         <sch:assert id="SCH-0216" test="exists(eintr:eintragungsnummer)">[SCH-0216] Die Eintragungsnummer muss angegeben werden.</sch:assert>
      </sch:rule>
      <sch:rule context="//bk:eintragung[not(ancestor-or-self::xga:gewerbebetriebVorAenderung|ancestor-or-self::xga:referenzierteSubjekteVorAenderung)]">
         <sch:extends rule="rule.SCH-0216"/>
      </sch:rule>
   </sch:pattern>
   <sch:pattern>
      <sch:rule id="rule.SCH-0217" abstract="true">
         <sch:assert id="SCH-0217"
                     test="if (eintr:artEintragung/code = ('A', 'B', 'V', 'G')) then string-length(eintr:eintragungsnummer) le 14 else true()">[SCH-0217] Im Falle eines Eintrags in das Handels-, Vereins- oder Genossenschaftsregister darf die Eintragungsnummer maximal 14 Zeichen umfassen.</sch:assert>
      </sch:rule>
      <sch:rule context="//bk:eintragung[not(ancestor-or-self::xga:gewerbebetriebVorAenderung|ancestor-or-self::xga:referenzierteSubjekteVorAenderung)]">
         <sch:extends rule="rule.SCH-0217"/>
      </sch:rule>
   </sch:pattern>
   <sch:pattern>
      <sch:rule id="rule.SCH-0218" abstract="true">
         <sch:assert id="SCH-0218"
                     test="if (xs:boolean(xga:istReisegewerbe)) then empty(xga:betriebsstaette/wt:artOrt) else true()">[SCH-0218] Wenn das Gewerbe ein Reisegewerbe ist, darf die Art der Niederlassung nicht angegeben werden.</sch:assert>
      </sch:rule>
      <sch:rule context="//xga:gewerbebetrieb">
         <sch:extends rule="rule.SCH-0218"/>
      </sch:rule>
   </sch:pattern>
   <sch:pattern>
      <sch:rule id="rule.SCH-0219" abstract="true">
         <sch:assert id="SCH-0219"
                     test="ancestor::erl:gewerbebetrieb/wt:wirtschaftlichTaetiger.id =&#xA;            ancestor::erl:gewo.erlaubnisantrag34d.1020/erl:referenzierteSubjekte/erl:juristischePerson/jp:juristischePerson.id">[SCH-0219] Eine Sachkundedelegation darf nur für juristische Personen angegeben werden.</sch:assert>
      </sch:rule>
      <sch:rule context="//erl:gewerbebetrieb/erl:sachkundedelegation">
         <sch:extends rule="rule.SCH-0219"/>
      </sch:rule>
   </sch:pattern>
   <sch:pattern>
      <sch:rule id="rule.SCH-0221" abstract="true">
         <sch:assert id="SCH-0221"
                     test=". = //erl:natuerlichePerson/np:natuerlichePerson.id">[SCH-0221] Als Betriebsleiter können nur natürliche Personen angegeben werden.</sch:assert>
      </sch:rule>
      <sch:rule context="//erl:gewerbebetrieb/erl:betriebsleiter.id">
         <sch:extends rule="rule.SCH-0221"/>
      </sch:rule>
   </sch:pattern>
   <sch:pattern>
      <sch:rule id="rule.SCH-0222" abstract="true">
         <sch:assert id="SCH-0222"
                     test="not(exists(erl:gewerbebetrieb) and xs:boolean(erl:gewerbebetriebNichtVorhandenOderBeabsichtigt))">[SCH-0222] Wenn das Element gewerbebetriebNichtVorhandenOderBeabsichtigt angegeben wird, kann kein Gewerbebetrieb angegeben werden.</sch:assert>
      </sch:rule>
      <sch:rule context="//erl:gewo.erlaubnisantrag34c.1010">
         <sch:extends rule="rule.SCH-0222"/>
      </sch:rule>
   </sch:pattern>
   <sch:pattern>
      <sch:rule id="rule.SCH-0223" abstract="true">
         <sch:assert id="SCH-0223"
                     test="not(exists(erl:gewerbebetrieb) and xs:boolean(erl:gewerbebetriebNichtVorhandenOderBeabsichtigt))">[SCH-0223] Wenn das Element gewerbebetriebNichtVorhandenOderBeabsichtigt angegeben wird, kann kein Gewerbebetrieb angegeben werden.</sch:assert>
      </sch:rule>
      <sch:rule context="//erl:gewo.erlaubnisantrag34d.1020">
         <sch:extends rule="rule.SCH-0223"/>
      </sch:rule>
   </sch:pattern>
   <sch:pattern>
      <sch:rule id="rule.SCH-0224" abstract="true">
         <sch:assert id="SCH-0224"
                     test="count(erl:umfangBeantragteZulassung/code[contains(., '34d')]) lt 2">[SCH-0224] Es kann nur genau eine Erlaubnis nach §34d GewO beantragt werden.</sch:assert>
      </sch:rule>
      <sch:rule context="//erl:gewo.erlaubnisantrag34d.1020">
         <sch:extends rule="rule.SCH-0224"/>
      </sch:rule>
   </sch:pattern>
   <sch:pattern>
      <sch:rule id="rule.SCH-0225" abstract="true">
         <sch:assert id="SCH-0225"
                     test="if (code = '1') then exists(following-sibling::erl:qualifikation) else true()">[SCH-0225] Falls artSachkundenachweis = 1 ist, ist verpflichtend eine Qualifikation zu übermitteln.</sch:assert>
      </sch:rule>
      <sch:rule context="//erl:sachkundenachweis/erl:artSachkundenachweis">
         <sch:extends rule="rule.SCH-0225"/>
      </sch:rule>
   </sch:pattern>
   <sch:pattern>
      <sch:rule id="rule.SCH-0226" abstract="true">
         <sch:assert id="SCH-0226"
                     test="if (jp:juristischePerson.id = ancestor::erl:gewo.erlaubnisantrag34d.1020/antr:antragsteller.id) then&#xA;            (exists(ancestor::erl:gewo.erlaubnisantrag34d.1020/erl:gewerbebetrieb/erl:sachkundedelegation) or&#xA;            exists(ancestor::erl:gewo.erlaubnisantrag34d.1020//erl:natuerlichePerson[np:natuerlichePerson.id = current()/gv:gesetzlicherVertreter.id]/erl:sachkundenachweis)) else&#xA;            true()">[SCH-0226] Wenn eine juristische Person Antragstellende für ein Erlaubnis nach § 34d GewO ist, muss mindestens ein gesetzlicher Vertreter einen Sachkundenachweis besitzen. Ansonsten muss eine Sachkundedelegation angegeben werden.</sch:assert>
      </sch:rule>
      <sch:rule context="erl:gewo.erlaubnisantrag34d.1020//erl:juristischePerson">
         <sch:extends rule="rule.SCH-0226"/>
      </sch:rule>
   </sch:pattern>
   <sch:pattern>
      <sch:rule id="rule.SCH-0230" abstract="true">
         <sch:assert id="SCH-0230"
                     test="if (rf:rechtsform/rf:rechtsformcode/code = ('170', '180')) then count(xga:gewerbetreibender) = 1 and xga:gewerbetreibender/xga:gewerbetreibender.id =&#xA;            parent::*/xga:referenzierteSubjekte//np:natuerlichePerson.id else true()">[SCH-0230] Wenn der Gewerbebetrieb die Rechtsform eines Einzelunternehmens hat, so muss der einzige Gewerbetreibende eine natürliche Person sein.</sch:assert>
      </sch:rule>
      <sch:rule context="//xga:gewerbebetrieb">
         <sch:extends rule="rule.SCH-0230"/>
      </sch:rule>
   </sch:pattern>
   <sch:pattern>
      <sch:rule id="rule.SCH-0231" abstract="true">
         <sch:assert id="SCH-0231"
                     test="if (wt:wirtschaftlichTaetiger.id = parent::*/xga:referenzierteSubjekte//(np:natuerlichePerson.id|jp:juristischePerson.id)) then count(xga:gewerbetreibender) = 1 and&#xA;            xga:gewerbetreibender/xga:gewerbetreibender.id = wt:wirtschaftlichTaetiger.id else true()">[SCH-0231] Wenn der wirtschaftlich Tätige eine natürliche oder juristische Person ist, so muss diese die (einzige) Gewerbetreibende sein.</sch:assert>
      </sch:rule>
      <sch:rule context="//xga:gewerbebetrieb">
         <sch:extends rule="rule.SCH-0231"/>
      </sch:rule>
   </sch:pattern>
   <sch:pattern>
      <sch:rule id="rule.SCH-0232" abstract="true">
         <sch:assert id="SCH-0232"
                     test="if (wt:artOrt/code = '01') then empty(parent::xga:gewerbebetrieb/xga:abweichendeHauptniederlassung) else true()">[SCH-0232] Wenn als Art der Betriebsstätte Hauptniederlassung angegeben ist, so darf das Element xga:abweichendeHauptniederlassung nicht angegeben werden.</sch:assert>
      </sch:rule>
      <sch:rule context="//xga:gewerbebetrieb/xga:betriebsstaette">
         <sch:extends rule="rule.SCH-0232"/>
      </sch:rule>
   </sch:pattern>
   <sch:pattern>
      <sch:rule id="rule.SCH-0233" abstract="true">
         <sch:assert id="SCH-0233"
                     test="not(rf:rechtsform/rf:rechtsformcode/code = '270' and exists(ename:eingetragenerName) and ancestor::xga:satz/*/xga:ereigniszeitpunkt &gt;= '2021-05-08')">[SCH-0233] Bei einer Gesellschaft bürgerlichen Rechts (270) darf kein eingetragener Name angegeben werden.</sch:assert>
      </sch:rule>
      <sch:rule context="//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:rechtsfaehigePersonengesellschaft)">
         <sch:extends rule="rule.SCH-0233"/>
      </sch:rule>
   </sch:pattern>
   <sch:pattern>
      <sch:rule id="rule.SCH-0234" abstract="true">
         <sch:assert id="SCH-0234"
                     test="count(*) =&#xA;            count(distinct-values(.//np:natuerlichePerson.id|.//jp:juristischePerson.id|.//rpg:rechtsfaehigePersonengesellschaft.id|.//spv:sonstigePersonenvereinigung.id))">[SCH-0234] Die IDs der referenzierten Subjekte vor Änderung müssen eindeutig sein.</sch:assert>
      </sch:rule>
      <sch:rule context="//(xga:anmeldung|xga:ummeldung|xga:abmeldung|xga:berichtigung)/xga:referenzierteSubjekteVorAenderung">
         <sch:extends rule="rule.SCH-0234"/>
      </sch:rule>
   </sch:pattern>
   <sch:pattern>
      <sch:rule id="rule.SCH-0235" abstract="true">
         <sch:assert id="SCH-0235"
                     test=". =&#xA;            parent::*/parent::*/xga:referenzierteSubjekte/*/(np:natuerlichePerson.id|jp:juristischePerson.id|rpg:rechtsfaehigePersonengesellschaft.id|spv:sonstigePersonenvereinigung.id)">[SCH-0235] Bei dem wirtschaftlich Tätigen muss es sich um eine natürliche oder eine juristische Person oder eine rechtsfähige Personengesellschaft oder eine sonstige Personenvereinigung in 'referenzierteSubjekte' handeln.</sch:assert>
      </sch:rule>
      <sch:rule context="//xga:gewerbebetrieb/wt:wirtschaftlichTaetiger.id">
         <sch:extends rule="rule.SCH-0235"/>
      </sch:rule>
   </sch:pattern>
   <sch:pattern>
      <sch:rule id="rule.SCH-0236" abstract="true">
         <sch:assert id="SCH-0236"
                     test=". =&#xA;            parent::*/parent::*/xga:referenzierteSubjekteVorAenderung/*/(np:natuerlichePerson.id|jp:juristischePerson.id|rpg:rechtsfaehigePersonengesellschaft.id|spv:sonstigePersonenvereinigung.id)">[SCH-0236] Bei dem wirtschaftlich Tätigen muss es sich um eine natürliche oder eine juristische Person oder eine rechtsfähige Personengesellschaft oder eine sonstige Personenvereinigung in 'referenzierteSubjekteVorAenderung' handeln.</sch:assert>
      </sch:rule>
      <sch:rule context="//xga:gewerbebetriebVorAenderung/wt:wirtschaftlichTaetiger.id">
         <sch:extends rule="rule.SCH-0236"/>
      </sch:rule>
   </sch:pattern>
   <sch:pattern>
      <sch:rule id="rule.SCH-0237" abstract="true">
         <sch:assert id="SCH-0237" test="xs:boolean(.) = true()">[SCH-0237] Wenn ein unbekanntes Datum angegeben wird, muss die Belegung für das Feld "dat:unbekannt" wahr sein.</sch:assert>
      </sch:rule>
      <sch:rule context="//dat:unbekannt">
         <sch:extends rule="rule.SCH-0237"/>
      </sch:rule>
   </sch:pattern>
   <sch:pattern>
      <sch:rule id="rule.SCH-0238" abstract="true">
         <sch:assert id="SCH-0238"
                     test="code = ('GewO_34c_01', 'GewO_34c_02','GewO_34c_03', 'GewO_34c_04','GewO_34c_05')">[SCH-0238] Es können nur Erlaubnisse nach § 34c GewO beantragt werden.</sch:assert>
      </sch:rule>
      <sch:rule context="//erl:gewo.erlaubnisantrag34c.1010/erl:umfangBeantragteZulassung">
         <sch:extends rule="rule.SCH-0238"/>
      </sch:rule>
   </sch:pattern>
   <sch:pattern>
      <sch:rule id="rule.SCH-0239" abstract="true">
         <sch:assert id="SCH-0239"
                     test="code = ('GewO_34d_01', 'GewO_34d_02','GewO_34d_03', 'GewO_34d_04','GewO_34d_05')">[SCH-0239] Es können nur Erlaubnisse nach § 34d GewO beantragt werden.</sch:assert>
      </sch:rule>
      <sch:rule context="//erl:gewo.erlaubnisantrag34d.1020/erl:umfangBeantragteZulassung">
         <sch:extends rule="rule.SCH-0239"/>
      </sch:rule>
   </sch:pattern>
   <sch:pattern>
      <sch:rule id="rule.SCH-0242" abstract="true">
         <sch:assert id="SCH-0242"
                     test="nachr:kommunikationspartnerkennung/nachr:praefix/code = 'hwk'">[SCH-0242] Bei einer Datenübermittlung an die Handwerkskammern muss die Behördenkennung des Lesers das Präfix hwk haben.</sch:assert>
      </sch:rule>
      <sch:rule context="xga:hwk.gewerbemeldung.0210//nachr:nachrichtenkopf[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]/nachr:leser">
         <sch:extends rule="rule.SCH-0242"/>
      </sch:rule>
   </sch:pattern>
   <sch:pattern>
      <sch:rule id="rule.SCH-0243" abstract="true">
         <sch:assert id="SCH-0243"
                     test="if (nachr:praefix/code = 'hwk') then nachr:kennung/@listURI = 'urn:xoev-de:xunternehmen:codeliste:handwerkskammern' else true()">[SCH-0243] Eine Behördenkennung mit Präfix hwk muss einen Behördenschlüssel aus der Codeliste "Handwerkskammern" haben (es ist die Spalte "DVDVBehoerdenkennung" zu verwenden).</sch:assert>
      </sch:rule>
      <sch:rule context="//nachr:kommunikationspartnerkennung">
         <sch:extends rule="rule.SCH-0243"/>
      </sch:rule>
   </sch:pattern>
   <sch:pattern>
      <sch:rule id="rule.SCH-0244" abstract="true">
         <sch:assert id="SCH-0244"
                     test="nachr:kommunikationspartnerkennung/nachr:praefix/code = 'MELDID'">[SCH-0244] Bei einer gegenseitigen Unterrichtung (Nachricht 0700) muss die Kommunikationspartnerkennung des Lesers das Präfix MELDID haben.</sch:assert>
      </sch:rule>
      <sch:rule context="xga:unterrichtung.0700//nachr:nachrichtenkopf[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]/nachr:leser">
         <sch:extends rule="rule.SCH-0244"/>
      </sch:rule>
   </sch:pattern>
   <sch:pattern>
      <sch:rule id="rule.SCH-0245" abstract="true">
         <sch:assert id="SCH-0245"
                     test=". = parent::*/parent::*/xga:referenzierteSubjekte/*/np:natuerlichePerson.id and not(. = following-sibling::xga:gewerbetreibender/xga:gewerbetreibender.id or . =&#xA;            parent::*/parent::*/xga:referenzierteSubjekte//gv:gesetzlicherVertreter.id)">[SCH-0245] Eine vertretungsberechtigte Person muss eine natürliche Person sein und darf nicht ebenfalls Gewerbetreibender oder gesetzlicher Vertreter sein.</sch:assert>
      </sch:rule>
      <sch:rule context="//xga:gewerbebetrieb/xga:vertretungsberechtigtePerson.id">
         <sch:extends rule="rule.SCH-0245"/>
      </sch:rule>
   </sch:pattern>
   <sch:pattern>
      <sch:rule id="rule.SCH-FL-xga-anmeldung-xga-verdachtsmomenteText" abstract="true">
         <sch:assert id="SCH-FL-xga-anmeldung-xga-verdachtsmomenteText"
                     test="string-length(.) ge 1 and string-length(.) le 900">[SCH-FL-xga-anmeldung-xga-verdachtsmomenteText] Die Länge des Elements xga:verdachtsmomenteText muss zwischen 1 und 900 liegen.</sch:assert>
      </sch:rule>
      <sch:rule context="//xga:anmeldung/xga:verdachtsmomenteText">
         <sch:extends rule="rule.SCH-FL-xga-anmeldung-xga-verdachtsmomenteText"/>
      </sch:rule>
   </sch:pattern>
   <sch:pattern>
      <sch:rule id="rule.SCH-FL-xga-ummeldung-xga-anlaesseUmmeldung" abstract="true">
         <sch:assert id="SCH-FL-xga-ummeldung-xga-anlaesseUmmeldung"
                     test="string-length(.) ge 1 and string-length(.) le 150">[SCH-FL-xga-ummeldung-xga-anlaesseUmmeldung] Die Länge des Elements xga:anlaesseUmmeldung muss zwischen 1 und 150 liegen.</sch:assert>
      </sch:rule>
      <sch:rule context="//xga:ummeldung/xga:anlaesseUmmeldung">
         <sch:extends rule="rule.SCH-FL-xga-ummeldung-xga-anlaesseUmmeldung"/>
      </sch:rule>
   </sch:pattern>
   <sch:pattern>
      <sch:rule id="rule.SCH-FL-xga-abmeldung-xga-ursacheAbmeldung" abstract="true">
         <sch:assert id="SCH-FL-xga-abmeldung-xga-ursacheAbmeldung"
                     test="string-length(.) ge 1 and string-length(.) le 150">[SCH-FL-xga-abmeldung-xga-ursacheAbmeldung] Die Länge des Elements xga:ursacheAbmeldung muss zwischen 1 und 150 liegen.</sch:assert>
      </sch:rule>
      <sch:rule context="//xga:abmeldung/xga:ursacheAbmeldung">
         <sch:extends rule="rule.SCH-FL-xga-abmeldung-xga-ursacheAbmeldung"/>
      </sch:rule>
   </sch:pattern>
   <sch:pattern>
      <sch:rule id="rule.SCH-FL-xga-berichtigung-xga-anlaesseBerichtigung"
                abstract="true">
         <sch:assert id="SCH-FL-xga-berichtigung-xga-anlaesseBerichtigung"
                     test="string-length(.) ge 1 and string-length(.) le 150">[SCH-FL-xga-berichtigung-xga-anlaesseBerichtigung] Die Länge des Elements xga:anlaesseBerichtigung muss zwischen 1 und 150 liegen.</sch:assert>
      </sch:rule>
      <sch:rule context="//xga:berichtigung/xga:anlaesseBerichtigung">
         <sch:extends rule="rule.SCH-FL-xga-berichtigung-xga-anlaesseBerichtigung"/>
      </sch:rule>
   </sch:pattern>
   <sch:pattern>
      <sch:rule id="rule.SCH-FL-xga-gewerbebetrieb-xga-gemeindeMeldungNr"
                abstract="true">
         <sch:assert id="SCH-FL-xga-gewerbebetrieb-xga-gemeindeMeldungNr"
                     test="string-length(.) ge 1 and string-length(.) le 30">[SCH-FL-xga-gewerbebetrieb-xga-gemeindeMeldungNr] Die Länge des Elements xga:gemeindeMeldungNr muss zwischen 1 und 30 liegen.</sch:assert>
      </sch:rule>
      <sch:rule context="//xga:gewerbebetrieb/xga:gemeindeMeldungNr">
         <sch:extends rule="rule.SCH-FL-xga-gewerbebetrieb-xga-gemeindeMeldungNr"/>
      </sch:rule>
   </sch:pattern>
   <sch:pattern>
      <sch:rule id="rule.SCH-FL-adr-strasse" abstract="true">
         <sch:assert id="SCH-FL-adr-strasse"
                     test="string-length(.) ge 1 and string-length(.) le 100">[SCH-FL-adr-strasse] Die Länge des Elements adr:strasse muss zwischen 1 und 100 liegen.</sch:assert>
      </sch:rule>
      <sch:rule context="//adr:strasse">
         <sch:extends rule="rule.SCH-FL-adr-strasse"/>
      </sch:rule>
   </sch:pattern>
   <sch:pattern>
      <sch:rule id="rule.SCH-FL-bk-strassenanschriftInland-bk-strassenschluessel"
                abstract="true">
         <sch:assert id="SCH-FL-bk-strassenanschriftInland-bk-strassenschluessel"
                     test="string-length(.) ge 1 and string-length(.) le 30">[SCH-FL-bk-strassenanschriftInland-bk-strassenschluessel] Die Länge des Elements bk:strassenschluessel muss zwischen 1 und 30 liegen.</sch:assert>
      </sch:rule>
      <sch:rule context="//bk:strassenanschriftInland/bk:strassenschluessel">
         <sch:extends rule="rule.SCH-FL-bk-strassenanschriftInland-bk-strassenschluessel"/>
      </sch:rule>
   </sch:pattern>
   <sch:pattern>
      <sch:rule id="rule.SCH-FL-bk-strassenanschriftInland-bk-hausnummerVon"
                abstract="true">
         <sch:assert id="SCH-FL-bk-strassenanschriftInland-bk-hausnummerVon"
                     test="string-length(.) ge 1 and string-length(.) le 10">[SCH-FL-bk-strassenanschriftInland-bk-hausnummerVon] Die Länge des Elements bk:hausnummerVon muss zwischen 1 und 10 liegen.</sch:assert>
      </sch:rule>
      <sch:rule context="//bk:strassenanschriftInland/bk:hausnummerVon">
         <sch:extends rule="rule.SCH-FL-bk-strassenanschriftInland-bk-hausnummerVon"/>
      </sch:rule>
   </sch:pattern>
   <sch:pattern>
      <sch:rule id="rule.SCH-FL-bk-strassenanschriftInland-bk-hausnummerBis"
                abstract="true">
         <sch:assert id="SCH-FL-bk-strassenanschriftInland-bk-hausnummerBis"
                     test="string-length(.) ge 1 and string-length(.) le 10">[SCH-FL-bk-strassenanschriftInland-bk-hausnummerBis] Die Länge des Elements bk:hausnummerBis muss zwischen 1 und 10 liegen.</sch:assert>
      </sch:rule>
      <sch:rule context="//bk:strassenanschriftInland/bk:hausnummerBis">
         <sch:extends rule="rule.SCH-FL-bk-strassenanschriftInland-bk-hausnummerBis"/>
      </sch:rule>
   </sch:pattern>
   <sch:pattern>
      <sch:rule id="rule.SCH-FL-adr-postleitzahl" abstract="true">
         <sch:assert id="SCH-FL-adr-postleitzahl"
                     test="string-length(.) ge 1 and string-length(.) le 10">[SCH-FL-adr-postleitzahl] Die Länge des Elements adr:postleitzahl muss zwischen 1 und 10 liegen.</sch:assert>
      </sch:rule>
      <sch:rule context="//adr:postleitzahl">
         <sch:extends rule="rule.SCH-FL-adr-postleitzahl"/>
      </sch:rule>
   </sch:pattern>
   <sch:pattern>
      <sch:rule id="rule.SCH-FL-adr-ort" abstract="true">
         <sch:assert id="SCH-FL-adr-ort"
                     test="string-length(.) ge 1 and string-length(.) le 60">[SCH-FL-adr-ort] Die Länge des Elements adr:ort muss zwischen 1 und 60 liegen.</sch:assert>
      </sch:rule>
      <sch:rule context="//adr:ort">
         <sch:extends rule="rule.SCH-FL-adr-ort"/>
      </sch:rule>
   </sch:pattern>
   <sch:pattern>
      <sch:rule id="rule.SCH-FL-bk-strassenanschriftInland-bk-ortsteil" abstract="true">
         <sch:assert id="SCH-FL-bk-strassenanschriftInland-bk-ortsteil"
                     test="string-length(.) ge 1 and string-length(.) le 60">[SCH-FL-bk-strassenanschriftInland-bk-ortsteil] Die Länge des Elements bk:ortsteil muss zwischen 1 und 60 liegen.</sch:assert>
      </sch:rule>
      <sch:rule context="//bk:strassenanschriftInland/bk:ortsteil">
         <sch:extends rule="rule.SCH-FL-bk-strassenanschriftInland-bk-ortsteil"/>
      </sch:rule>
   </sch:pattern>
   <sch:pattern>
      <sch:rule id="rule.SCH-FL-adr-zusatzangaben" abstract="true">
         <sch:assert id="SCH-FL-adr-zusatzangaben"
                     test="string-length(.) ge 1 and string-length(.) le 30">[SCH-FL-adr-zusatzangaben] Die Länge des Elements adr:zusatzangaben muss zwischen 1 und 30 liegen.</sch:assert>
      </sch:rule>
      <sch:rule context="//adr:zusatzangaben">
         <sch:extends rule="rule.SCH-FL-adr-zusatzangaben"/>
      </sch:rule>
   </sch:pattern>
   <sch:pattern>
      <sch:rule id="rule.SCH-FL-xga-aufenthaltstitel-xga-ausgestelltVonName"
                abstract="true">
         <sch:assert id="SCH-FL-xga-aufenthaltstitel-xga-ausgestelltVonName"
                     test="string-length(.) ge 1 and string-length(.) le 100">[SCH-FL-xga-aufenthaltstitel-xga-ausgestelltVonName] Die Länge des Elements xga:ausgestelltVonName muss zwischen 1 und 100 liegen.</sch:assert>
      </sch:rule>
      <sch:rule context="//xga:aufenthaltstitel/xga:ausgestelltVonName">
         <sch:extends rule="rule.SCH-FL-xga-aufenthaltstitel-xga-ausgestelltVonName"/>
      </sch:rule>
   </sch:pattern>
   <sch:pattern>
      <sch:rule id="rule.SCH-FL-xga-aufenthaltstitel-xga-ausgestelltVonPLZ"
                abstract="true">
         <sch:assert id="SCH-FL-xga-aufenthaltstitel-xga-ausgestelltVonPLZ"
                     test="string-length(.) ge 1 and string-length(.) le 10">[SCH-FL-xga-aufenthaltstitel-xga-ausgestelltVonPLZ] Die Länge des Elements xga:ausgestelltVonPLZ muss zwischen 1 und 10 liegen.</sch:assert>
      </sch:rule>
      <sch:rule context="//xga:aufenthaltstitel/xga:ausgestelltVonPLZ">
         <sch:extends rule="rule.SCH-FL-xga-aufenthaltstitel-xga-ausgestelltVonPLZ"/>
      </sch:rule>
   </sch:pattern>
   <sch:pattern>
      <sch:rule id="rule.SCH-FL-xga-aufenthaltstitel-xga-ausgestelltVonOrt"
                abstract="true">
         <sch:assert id="SCH-FL-xga-aufenthaltstitel-xga-ausgestelltVonOrt"
                     test="string-length(.) ge 1 and string-length(.) le 50">[SCH-FL-xga-aufenthaltstitel-xga-ausgestelltVonOrt] Die Länge des Elements xga:ausgestelltVonOrt muss zwischen 1 und 50 liegen.</sch:assert>
      </sch:rule>
      <sch:rule context="//xga:aufenthaltstitel/xga:ausgestelltVonOrt">
         <sch:extends rule="rule.SCH-FL-xga-aufenthaltstitel-xga-ausgestelltVonOrt"/>
      </sch:rule>
   </sch:pattern>
   <sch:pattern>
      <sch:rule id="rule.SCH-FL-xga-aufenthaltstitel-xga-auflagen" abstract="true">
         <sch:assert id="SCH-FL-xga-aufenthaltstitel-xga-auflagen"
                     test="string-length(.) ge 1 and string-length(.) le 300">[SCH-FL-xga-aufenthaltstitel-xga-auflagen] Die Länge des Elements xga:auflagen muss zwischen 1 und 300 liegen.</sch:assert>
      </sch:rule>
      <sch:rule context="//xga:aufenthaltstitel/xga:auflagen">
         <sch:extends rule="rule.SCH-FL-xga-aufenthaltstitel-xga-auflagen"/>
      </sch:rule>
   </sch:pattern>
   <sch:pattern>
      <sch:rule id="rule.SCH-FL-np-doktorgrad" abstract="true">
         <sch:assert id="SCH-FL-np-doktorgrad"
                     test="string-length(.) ge 1 and string-length(.) le 50">[SCH-FL-np-doktorgrad] Die Länge des Elements np:doktorgrad muss zwischen 1 und 50 liegen.</sch:assert>
      </sch:rule>
      <sch:rule context="//np:doktorgrad">
         <sch:extends rule="rule.SCH-FL-np-doktorgrad"/>
      </sch:rule>
   </sch:pattern>
   <sch:pattern>
      <sch:rule id="rule.SCH-FL-np-familienname" abstract="true">
         <sch:assert id="SCH-FL-np-familienname"
                     test="string-length(.) ge 1 and string-length(.) le 1000">[SCH-FL-np-familienname] Die Länge des Elements np:familienname muss zwischen 1 und 1000 liegen.</sch:assert>
      </sch:rule>
      <sch:rule context="//np:familienname">
         <sch:extends rule="rule.SCH-FL-np-familienname"/>
      </sch:rule>
   </sch:pattern>
   <sch:pattern>
      <sch:rule id="rule.SCH-FL-np-vornamen" abstract="true">
         <sch:assert id="SCH-FL-np-vornamen"
                     test="string-length(.) ge 1 and string-length(.) le 1000">[SCH-FL-np-vornamen] Die Länge des Elements np:vornamen muss zwischen 1 und 1000 liegen.</sch:assert>
      </sch:rule>
      <sch:rule context="//np:vornamen">
         <sch:extends rule="rule.SCH-FL-np-vornamen"/>
      </sch:rule>
   </sch:pattern>
   <sch:pattern>
      <sch:rule id="rule.SCH-FL-np-geburtsname" abstract="true">
         <sch:assert id="SCH-FL-np-geburtsname"
                     test="string-length(.) ge 1 and string-length(.) le 1000">[SCH-FL-np-geburtsname] Die Länge des Elements np:geburtsname muss zwischen 1 und 1000 liegen.</sch:assert>
      </sch:rule>
      <sch:rule context="//np:geburtsname">
         <sch:extends rule="rule.SCH-FL-np-geburtsname"/>
      </sch:rule>
   </sch:pattern>
   <sch:pattern>
      <sch:rule id="rule.SCH-FL-bk-geburt-bk-staat" abstract="true">
         <sch:assert id="SCH-FL-bk-geburt-bk-staat"
                     test="string-length(.) ge 1 and string-length(.) le 50">[SCH-FL-bk-geburt-bk-staat] Die Länge des Elements bk:staat muss zwischen 1 und 50 liegen.</sch:assert>
      </sch:rule>
      <sch:rule context="//bk:geburt/bk:staat">
         <sch:extends rule="rule.SCH-FL-bk-geburt-bk-staat"/>
      </sch:rule>
   </sch:pattern>
   <sch:pattern>
      <sch:rule id="rule.SCH-FL-xga-natuerlichePerson-xga-fachverfahrenskennziffer"
                abstract="true">
         <sch:assert id="SCH-FL-xga-natuerlichePerson-xga-fachverfahrenskennziffer"
                     test="string-length(.) ge 1 and string-length(.) le 50">[SCH-FL-xga-natuerlichePerson-xga-fachverfahrenskennziffer] Die Länge des Elements xga:fachverfahrenskennziffer muss zwischen 1 und 50 liegen.</sch:assert>
      </sch:rule>
      <sch:rule context="//xga:natuerlichePerson/xga:fachverfahrenskennziffer">
         <sch:extends rule="rule.SCH-FL-xga-natuerlichePerson-xga-fachverfahrenskennziffer"/>
      </sch:rule>
   </sch:pattern>
   <sch:pattern>
      <sch:rule id="rule.SCH-FL-ename-eingetragenerName" abstract="true">
         <sch:assert id="SCH-FL-ename-eingetragenerName"
                     test="string-length(.) ge 1 and string-length(.) le 1000">[SCH-FL-ename-eingetragenerName] Die Länge des Elements ename:eingetragenerName muss zwischen 1 und 1000 liegen.</sch:assert>
      </sch:rule>
      <sch:rule context="//ename:eingetragenerName">
         <sch:extends rule="rule.SCH-FL-ename-eingetragenerName"/>
      </sch:rule>
   </sch:pattern>
   <sch:pattern>
      <sch:rule id="rule.SCH-FL-wt-geschaeftsbezeichnung" abstract="true">
         <sch:assert id="SCH-FL-wt-geschaeftsbezeichnung"
                     test="string-length(.) ge 1 and string-length(.) le 1000">[SCH-FL-wt-geschaeftsbezeichnung] Die Länge des Elements wt:geschaeftsbezeichnung muss zwischen 1 und 1000 liegen.</sch:assert>
      </sch:rule>
      <sch:rule context="//wt:geschaeftsbezeichnung">
         <sch:extends rule="rule.SCH-FL-wt-geschaeftsbezeichnung"/>
      </sch:rule>
   </sch:pattern>
   <sch:pattern>
      <sch:rule id="rule.SCH-FL-xga-rechtsfaehigepersonengesellschaft-xga-gbrGesellschafter"
                abstract="true">
         <sch:assert id="SCH-FL-xga-rechtsfaehigepersonengesellschaft-xga-gbrGesellschafter"
                     test="string-length(.) ge 1 and string-length(.) le 1000">[SCH-FL-xga-rechtsfaehigepersonengesellschaft-xga-gbrGesellschafter] Die Länge des Elements xga:gbrGesellschafter muss zwischen 1 und 1000 liegen.</sch:assert>
      </sch:rule>
      <sch:rule context="//xga:rechtsfaehigepersonengesellschaft/xga:gbrGesellschafter">
         <sch:extends rule="rule.SCH-FL-xga-rechtsfaehigepersonengesellschaft-xga-gbrGesellschafter"/>
      </sch:rule>
   </sch:pattern>
   <sch:pattern>
      <sch:rule id="rule.SCH-FL-eintr-eintragungsnummer" abstract="true">
         <sch:assert id="SCH-FL-eintr-eintragungsnummer"
                     test="string-length(.) ge 1 and string-length(.) le 20">[SCH-FL-eintr-eintragungsnummer] Die Länge des Elements eintr:eintragungsnummer muss zwischen 1 und 20 liegen.</sch:assert>
      </sch:rule>
      <sch:rule context="//eintr:eintragungsnummer">
         <sch:extends rule="rule.SCH-FL-eintr-eintragungsnummer"/>
      </sch:rule>
   </sch:pattern>
   <sch:pattern>
      <sch:rule id="rule.SCH-FL-bk-staatsangehoerigkeitFreitext" abstract="true">
         <sch:assert id="SCH-FL-bk-staatsangehoerigkeitFreitext"
                     test="string-length(.) ge 1 and string-length(.) le 50">[SCH-FL-bk-staatsangehoerigkeitFreitext] Die Länge des Elements bk:staatsangehoerigkeitFreitext muss zwischen 1 und 50 liegen.</sch:assert>
      </sch:rule>
      <sch:rule context="//bk:staatsangehoerigkeitFreitext">
         <sch:extends rule="rule.SCH-FL-bk-staatsangehoerigkeitFreitext"/>
      </sch:rule>
   </sch:pattern>
   <sch:pattern>
      <sch:rule id="rule.SCH-EMPTY-xga-anmeldung-xga-verdachtsmoment" abstract="true">
         <sch:assert id="SCH-EMPTY-xga-anmeldung-xga-verdachtsmoment"
                     test="empty(xga:verdachtsmoment)">[SCH-EMPTY-xga-anmeldung-xga-verdachtsmoment] Das Kindelement xga:verdachtsmoment darf in diesem Kontext nicht angegeben werden.</sch:assert>
      </sch:rule>
      <sch:rule context="xga:sta.gewerbemeldung.0100//xga:anmeldung[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-anmeldung-xga-verdachtsmoment"/>
      </sch:rule>
      <sch:rule context="xga:ihk.gewerbemeldung.0200//xga:anmeldung[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-anmeldung-xga-verdachtsmoment"/>
      </sch:rule>
      <sch:rule context="xga:hwk.gewerbemeldung.0210//xga:anmeldung[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-anmeldung-xga-verdachtsmoment"/>
      </sch:rule>
      <sch:rule context="xga:ea.gewerbemeldung.0220//xga:anmeldung[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-anmeldung-xga-verdachtsmoment"/>
      </sch:rule>
      <sch:rule context="xga:dgu.gewerbemeldung.0230//xga:anmeldung[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-anmeldung-xga-verdachtsmoment"/>
      </sch:rule>
      <sch:rule context="xga:rg.gewerbemeldung.0240//xga:anmeldung[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-anmeldung-xga-verdachtsmoment"/>
      </sch:rule>
      <sch:rule context="xga:fa.gewerbemeldung.0250//xga:anmeldung[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-anmeldung-xga-verdachtsmoment"/>
      </sch:rule>
      <sch:rule context="xga:is.gewerbemeldung.0270//xga:anmeldung[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-anmeldung-xga-verdachtsmoment"/>
      </sch:rule>
      <sch:rule context="xga:as.gewerbemeldung.0280//xga:anmeldung[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-anmeldung-xga-verdachtsmoment"/>
      </sch:rule>
      <sch:rule context="xga:lue.gewerbemeldung.0290//xga:anmeldung[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-anmeldung-xga-verdachtsmoment"/>
      </sch:rule>
      <sch:rule context="xga:ext.gewerbemeldung.0400//xga:anmeldung[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-anmeldung-xga-verdachtsmoment"/>
      </sch:rule>
      <sch:rule context="xga:abh.gewerbemeldung.0500//xga:anmeldung[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-anmeldung-xga-verdachtsmoment"/>
      </sch:rule>
   </sch:pattern>
   <sch:pattern>
      <sch:rule id="rule.SCH-EXISTS-xga-anmeldung-xga-verdachtsmoment" abstract="true">
         <sch:assert id="SCH-EXISTS-xga-anmeldung-xga-verdachtsmoment"
                     test="exists(xga:verdachtsmoment)">[SCH-EXISTS-xga-anmeldung-xga-verdachtsmoment] Das Kindelement xga:verdachtsmoment muss in diesem Kontext angegeben werden.</sch:assert>
      </sch:rule>
      <sch:rule context="xga:zv.gewerbemeldung.0260//xga:anmeldung[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-EXISTS-xga-anmeldung-xga-verdachtsmoment"/>
      </sch:rule>
   </sch:pattern>
   <sch:pattern>
      <sch:rule id="rule.SCH-EMPTY-xga-anmeldung-xga-verdachtsmomenteText"
                abstract="true">
         <sch:assert id="SCH-EMPTY-xga-anmeldung-xga-verdachtsmomenteText"
                     test="empty(xga:verdachtsmomenteText)">[SCH-EMPTY-xga-anmeldung-xga-verdachtsmomenteText] Das Kindelement xga:verdachtsmomenteText darf in diesem Kontext nicht angegeben werden.</sch:assert>
      </sch:rule>
      <sch:rule context="xga:sta.gewerbemeldung.0100//xga:anmeldung[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-anmeldung-xga-verdachtsmomenteText"/>
      </sch:rule>
      <sch:rule context="xga:ihk.gewerbemeldung.0200//xga:anmeldung[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-anmeldung-xga-verdachtsmomenteText"/>
      </sch:rule>
      <sch:rule context="xga:hwk.gewerbemeldung.0210//xga:anmeldung[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-anmeldung-xga-verdachtsmomenteText"/>
      </sch:rule>
      <sch:rule context="xga:ea.gewerbemeldung.0220//xga:anmeldung[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-anmeldung-xga-verdachtsmomenteText"/>
      </sch:rule>
      <sch:rule context="xga:dgu.gewerbemeldung.0230//xga:anmeldung[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-anmeldung-xga-verdachtsmomenteText"/>
      </sch:rule>
      <sch:rule context="xga:rg.gewerbemeldung.0240//xga:anmeldung[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-anmeldung-xga-verdachtsmomenteText"/>
      </sch:rule>
      <sch:rule context="xga:fa.gewerbemeldung.0250//xga:anmeldung[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-anmeldung-xga-verdachtsmomenteText"/>
      </sch:rule>
      <sch:rule context="xga:is.gewerbemeldung.0270//xga:anmeldung[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-anmeldung-xga-verdachtsmomenteText"/>
      </sch:rule>
      <sch:rule context="xga:as.gewerbemeldung.0280//xga:anmeldung[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-anmeldung-xga-verdachtsmomenteText"/>
      </sch:rule>
      <sch:rule context="xga:lue.gewerbemeldung.0290//xga:anmeldung[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-anmeldung-xga-verdachtsmomenteText"/>
      </sch:rule>
      <sch:rule context="xga:ext.gewerbemeldung.0400//xga:anmeldung[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-anmeldung-xga-verdachtsmomenteText"/>
      </sch:rule>
      <sch:rule context="xga:abh.gewerbemeldung.0500//xga:anmeldung[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-anmeldung-xga-verdachtsmomenteText"/>
      </sch:rule>
   </sch:pattern>
   <sch:pattern>
      <sch:rule id="rule.SCH-EXISTS-xga-anmeldung-xga-verdachtsmomenteText"
                abstract="true">
         <sch:assert id="SCH-EXISTS-xga-anmeldung-xga-verdachtsmomenteText"
                     test="exists(xga:verdachtsmomenteText)">[SCH-EXISTS-xga-anmeldung-xga-verdachtsmomenteText] Das Kindelement xga:verdachtsmomenteText muss in diesem Kontext angegeben werden.</sch:assert>
      </sch:rule>
   </sch:pattern>
   <sch:pattern>
      <sch:rule id="rule.SCH-EMPTY-xga-anmeldung-xga-grundAnmeldungSchluessel"
                abstract="true">
         <sch:assert id="SCH-EMPTY-xga-anmeldung-xga-grundAnmeldungSchluessel"
                     test="empty(xga:grundAnmeldungSchluessel)">[SCH-EMPTY-xga-anmeldung-xga-grundAnmeldungSchluessel] Das Kindelement xga:grundAnmeldungSchluessel darf in diesem Kontext nicht angegeben werden.</sch:assert>
      </sch:rule>
      <sch:rule context="xga:ea.gewerbemeldung.0220//xga:anmeldung[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-anmeldung-xga-grundAnmeldungSchluessel"/>
      </sch:rule>
      <sch:rule context="xga:abh.gewerbemeldung.0500//xga:anmeldung[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-anmeldung-xga-grundAnmeldungSchluessel"/>
      </sch:rule>
   </sch:pattern>
   <sch:pattern>
      <sch:rule id="rule.SCH-EXISTS-xga-anmeldung-xga-grundAnmeldungSchluessel"
                abstract="true">
         <sch:assert id="SCH-EXISTS-xga-anmeldung-xga-grundAnmeldungSchluessel"
                     test="exists(xga:grundAnmeldungSchluessel)">[SCH-EXISTS-xga-anmeldung-xga-grundAnmeldungSchluessel] Das Kindelement xga:grundAnmeldungSchluessel muss in diesem Kontext angegeben werden.</sch:assert>
      </sch:rule>
      <sch:rule context="xga:sta.gewerbemeldung.0100//xga:anmeldung[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-EXISTS-xga-anmeldung-xga-grundAnmeldungSchluessel"/>
      </sch:rule>
      <sch:rule context="xga:ihk.gewerbemeldung.0200//xga:anmeldung[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-EXISTS-xga-anmeldung-xga-grundAnmeldungSchluessel"/>
      </sch:rule>
      <sch:rule context="xga:hwk.gewerbemeldung.0210//xga:anmeldung[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-EXISTS-xga-anmeldung-xga-grundAnmeldungSchluessel"/>
      </sch:rule>
      <sch:rule context="xga:dgu.gewerbemeldung.0230//xga:anmeldung[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-EXISTS-xga-anmeldung-xga-grundAnmeldungSchluessel"/>
      </sch:rule>
      <sch:rule context="xga:rg.gewerbemeldung.0240//xga:anmeldung[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-EXISTS-xga-anmeldung-xga-grundAnmeldungSchluessel"/>
      </sch:rule>
      <sch:rule context="xga:fa.gewerbemeldung.0250//xga:anmeldung[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-EXISTS-xga-anmeldung-xga-grundAnmeldungSchluessel"/>
      </sch:rule>
      <sch:rule context="xga:zv.gewerbemeldung.0260//xga:anmeldung[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-EXISTS-xga-anmeldung-xga-grundAnmeldungSchluessel"/>
      </sch:rule>
      <sch:rule context="xga:is.gewerbemeldung.0270//xga:anmeldung[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-EXISTS-xga-anmeldung-xga-grundAnmeldungSchluessel"/>
      </sch:rule>
      <sch:rule context="xga:as.gewerbemeldung.0280//xga:anmeldung[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-EXISTS-xga-anmeldung-xga-grundAnmeldungSchluessel"/>
      </sch:rule>
      <sch:rule context="xga:lue.gewerbemeldung.0290//xga:anmeldung[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-EXISTS-xga-anmeldung-xga-grundAnmeldungSchluessel"/>
      </sch:rule>
      <sch:rule context="xga:alg.gewerbemeldung.0300//xga:anmeldung[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-EXISTS-xga-anmeldung-xga-grundAnmeldungSchluessel"/>
      </sch:rule>
      <sch:rule context="xga:ext.gewerbemeldung.0400//xga:anmeldung[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-EXISTS-xga-anmeldung-xga-grundAnmeldungSchluessel"/>
      </sch:rule>
      <sch:rule context="xga:unterrichtung.0700//xga:anmeldung[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-EXISTS-xga-anmeldung-xga-grundAnmeldungSchluessel"/>
      </sch:rule>
   </sch:pattern>
   <sch:pattern>
      <sch:rule id="rule.SCH-EMPTY-xga-anmeldung-xga-frueheresGewerbe" abstract="true">
         <sch:assert id="SCH-EMPTY-xga-anmeldung-xga-frueheresGewerbe"
                     test="empty(xga:frueheresGewerbe)">[SCH-EMPTY-xga-anmeldung-xga-frueheresGewerbe] Das Kindelement xga:frueheresGewerbe darf in diesem Kontext nicht angegeben werden.</sch:assert>
      </sch:rule>
      <sch:rule context="xga:ea.gewerbemeldung.0220//xga:anmeldung[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-anmeldung-xga-frueheresGewerbe"/>
      </sch:rule>
      <sch:rule context="xga:abh.gewerbemeldung.0500//xga:anmeldung[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-anmeldung-xga-frueheresGewerbe"/>
      </sch:rule>
   </sch:pattern>
   <sch:pattern>
      <sch:rule id="rule.SCH-EXISTS-xga-anmeldung-xga-frueheresGewerbe" abstract="true">
         <sch:assert id="SCH-EXISTS-xga-anmeldung-xga-frueheresGewerbe"
                     test="exists(xga:frueheresGewerbe)">[SCH-EXISTS-xga-anmeldung-xga-frueheresGewerbe] Das Kindelement xga:frueheresGewerbe muss in diesem Kontext angegeben werden.</sch:assert>
      </sch:rule>
   </sch:pattern>
   <sch:pattern>
      <sch:rule id="rule.SCH-EMPTY-xga-abmeldung-xga-kuenftigesGewerbe" abstract="true">
         <sch:assert id="SCH-EMPTY-xga-abmeldung-xga-kuenftigesGewerbe"
                     test="empty(xga:kuenftigesGewerbe)">[SCH-EMPTY-xga-abmeldung-xga-kuenftigesGewerbe] Das Kindelement xga:kuenftigesGewerbe darf in diesem Kontext nicht angegeben werden.</sch:assert>
      </sch:rule>
      <sch:rule context="xga:ea.gewerbemeldung.0220//xga:abmeldung[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-abmeldung-xga-kuenftigesGewerbe"/>
      </sch:rule>
      <sch:rule context="xga:abh.gewerbemeldung.0500//xga:abmeldung[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-abmeldung-xga-kuenftigesGewerbe"/>
      </sch:rule>
   </sch:pattern>
   <sch:pattern>
      <sch:rule id="rule.SCH-EXISTS-xga-abmeldung-xga-kuenftigesGewerbe"
                abstract="true">
         <sch:assert id="SCH-EXISTS-xga-abmeldung-xga-kuenftigesGewerbe"
                     test="exists(xga:kuenftigesGewerbe)">[SCH-EXISTS-xga-abmeldung-xga-kuenftigesGewerbe] Das Kindelement xga:kuenftigesGewerbe muss in diesem Kontext angegeben werden.</sch:assert>
      </sch:rule>
   </sch:pattern>
   <sch:pattern>
      <sch:rule id="rule.SCH-EMPTY-xga-abmeldung-xga-grundAbmeldungSchluessel"
                abstract="true">
         <sch:assert id="SCH-EMPTY-xga-abmeldung-xga-grundAbmeldungSchluessel"
                     test="empty(xga:grundAbmeldungSchluessel)">[SCH-EMPTY-xga-abmeldung-xga-grundAbmeldungSchluessel] Das Kindelement xga:grundAbmeldungSchluessel darf in diesem Kontext nicht angegeben werden.</sch:assert>
      </sch:rule>
      <sch:rule context="xga:ea.gewerbemeldung.0220//xga:abmeldung[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-abmeldung-xga-grundAbmeldungSchluessel"/>
      </sch:rule>
      <sch:rule context="xga:abh.gewerbemeldung.0500//xga:abmeldung[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-abmeldung-xga-grundAbmeldungSchluessel"/>
      </sch:rule>
   </sch:pattern>
   <sch:pattern>
      <sch:rule id="rule.SCH-EXISTS-xga-abmeldung-xga-grundAbmeldungSchluessel"
                abstract="true">
         <sch:assert id="SCH-EXISTS-xga-abmeldung-xga-grundAbmeldungSchluessel"
                     test="exists(xga:grundAbmeldungSchluessel)">[SCH-EXISTS-xga-abmeldung-xga-grundAbmeldungSchluessel] Das Kindelement xga:grundAbmeldungSchluessel muss in diesem Kontext angegeben werden.</sch:assert>
      </sch:rule>
      <sch:rule context="xga:sta.gewerbemeldung.0100//xga:abmeldung[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-EXISTS-xga-abmeldung-xga-grundAbmeldungSchluessel"/>
      </sch:rule>
      <sch:rule context="xga:ihk.gewerbemeldung.0200//xga:abmeldung[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-EXISTS-xga-abmeldung-xga-grundAbmeldungSchluessel"/>
      </sch:rule>
      <sch:rule context="xga:hwk.gewerbemeldung.0210//xga:abmeldung[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-EXISTS-xga-abmeldung-xga-grundAbmeldungSchluessel"/>
      </sch:rule>
      <sch:rule context="xga:dgu.gewerbemeldung.0230//xga:abmeldung[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-EXISTS-xga-abmeldung-xga-grundAbmeldungSchluessel"/>
      </sch:rule>
      <sch:rule context="xga:rg.gewerbemeldung.0240//xga:abmeldung[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-EXISTS-xga-abmeldung-xga-grundAbmeldungSchluessel"/>
      </sch:rule>
      <sch:rule context="xga:fa.gewerbemeldung.0250//xga:abmeldung[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-EXISTS-xga-abmeldung-xga-grundAbmeldungSchluessel"/>
      </sch:rule>
      <sch:rule context="xga:zv.gewerbemeldung.0260//xga:abmeldung[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-EXISTS-xga-abmeldung-xga-grundAbmeldungSchluessel"/>
      </sch:rule>
      <sch:rule context="xga:is.gewerbemeldung.0270//xga:abmeldung[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-EXISTS-xga-abmeldung-xga-grundAbmeldungSchluessel"/>
      </sch:rule>
      <sch:rule context="xga:as.gewerbemeldung.0280//xga:abmeldung[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-EXISTS-xga-abmeldung-xga-grundAbmeldungSchluessel"/>
      </sch:rule>
      <sch:rule context="xga:lue.gewerbemeldung.0290//xga:abmeldung[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-EXISTS-xga-abmeldung-xga-grundAbmeldungSchluessel"/>
      </sch:rule>
      <sch:rule context="xga:alg.gewerbemeldung.0300//xga:abmeldung[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-EXISTS-xga-abmeldung-xga-grundAbmeldungSchluessel"/>
      </sch:rule>
      <sch:rule context="xga:ext.gewerbemeldung.0400//xga:abmeldung[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-EXISTS-xga-abmeldung-xga-grundAbmeldungSchluessel"/>
      </sch:rule>
      <sch:rule context="xga:unterrichtung.0700//xga:abmeldung[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-EXISTS-xga-abmeldung-xga-grundAbmeldungSchluessel"/>
      </sch:rule>
   </sch:pattern>
   <sch:pattern>
      <sch:rule id="rule.SCH-EMPTY-xga-abmeldung-xga-ursacheAbmeldung" abstract="true">
         <sch:assert id="SCH-EMPTY-xga-abmeldung-xga-ursacheAbmeldung"
                     test="empty(xga:ursacheAbmeldung)">[SCH-EMPTY-xga-abmeldung-xga-ursacheAbmeldung] Das Kindelement xga:ursacheAbmeldung darf in diesem Kontext nicht angegeben werden.</sch:assert>
      </sch:rule>
      <sch:rule context="xga:ea.gewerbemeldung.0220//xga:abmeldung[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-abmeldung-xga-ursacheAbmeldung"/>
      </sch:rule>
      <sch:rule context="xga:rg.gewerbemeldung.0240//xga:abmeldung[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-abmeldung-xga-ursacheAbmeldung"/>
      </sch:rule>
      <sch:rule context="xga:is.gewerbemeldung.0270//xga:abmeldung[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-abmeldung-xga-ursacheAbmeldung"/>
      </sch:rule>
      <sch:rule context="xga:as.gewerbemeldung.0280//xga:abmeldung[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-abmeldung-xga-ursacheAbmeldung"/>
      </sch:rule>
      <sch:rule context="xga:lue.gewerbemeldung.0290//xga:abmeldung[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-abmeldung-xga-ursacheAbmeldung"/>
      </sch:rule>
      <sch:rule context="xga:abh.gewerbemeldung.0500//xga:abmeldung[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-abmeldung-xga-ursacheAbmeldung"/>
      </sch:rule>
   </sch:pattern>
   <sch:pattern>
      <sch:rule id="rule.SCH-EXISTS-xga-abmeldung-xga-ursacheAbmeldung" abstract="true">
         <sch:assert id="SCH-EXISTS-xga-abmeldung-xga-ursacheAbmeldung"
                     test="exists(xga:ursacheAbmeldung)">[SCH-EXISTS-xga-abmeldung-xga-ursacheAbmeldung] Das Kindelement xga:ursacheAbmeldung muss in diesem Kontext angegeben werden.</sch:assert>
      </sch:rule>
   </sch:pattern>
   <sch:pattern>
      <sch:rule id="rule.SCH-EMPTY-xga-abmeldung-xga-ursacheAbmeldungSchluessel"
                abstract="true">
         <sch:assert id="SCH-EMPTY-xga-abmeldung-xga-ursacheAbmeldungSchluessel"
                     test="empty(xga:ursacheAbmeldungSchluessel)">[SCH-EMPTY-xga-abmeldung-xga-ursacheAbmeldungSchluessel] Das Kindelement xga:ursacheAbmeldungSchluessel darf in diesem Kontext nicht angegeben werden.</sch:assert>
      </sch:rule>
      <sch:rule context="xga:ea.gewerbemeldung.0220//xga:abmeldung[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-abmeldung-xga-ursacheAbmeldungSchluessel"/>
      </sch:rule>
      <sch:rule context="xga:rg.gewerbemeldung.0240//xga:abmeldung[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-abmeldung-xga-ursacheAbmeldungSchluessel"/>
      </sch:rule>
      <sch:rule context="xga:is.gewerbemeldung.0270//xga:abmeldung[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-abmeldung-xga-ursacheAbmeldungSchluessel"/>
      </sch:rule>
      <sch:rule context="xga:as.gewerbemeldung.0280//xga:abmeldung[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-abmeldung-xga-ursacheAbmeldungSchluessel"/>
      </sch:rule>
      <sch:rule context="xga:lue.gewerbemeldung.0290//xga:abmeldung[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-abmeldung-xga-ursacheAbmeldungSchluessel"/>
      </sch:rule>
      <sch:rule context="xga:abh.gewerbemeldung.0500//xga:abmeldung[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-abmeldung-xga-ursacheAbmeldungSchluessel"/>
      </sch:rule>
   </sch:pattern>
   <sch:pattern>
      <sch:rule id="rule.SCH-EXISTS-xga-abmeldung-xga-ursacheAbmeldungSchluessel"
                abstract="true">
         <sch:assert id="SCH-EXISTS-xga-abmeldung-xga-ursacheAbmeldungSchluessel"
                     test="exists(xga:ursacheAbmeldungSchluessel)">[SCH-EXISTS-xga-abmeldung-xga-ursacheAbmeldungSchluessel] Das Kindelement xga:ursacheAbmeldungSchluessel muss in diesem Kontext angegeben werden.</sch:assert>
      </sch:rule>
   </sch:pattern>
   <sch:pattern>
      <sch:rule id="rule.SCH-EMPTY-xga-ummeldung-xga-frueheresGewerbe" abstract="true">
         <sch:assert id="SCH-EMPTY-xga-ummeldung-xga-frueheresGewerbe"
                     test="empty(xga:frueheresGewerbe)">[SCH-EMPTY-xga-ummeldung-xga-frueheresGewerbe] Das Kindelement xga:frueheresGewerbe darf in diesem Kontext nicht angegeben werden.</sch:assert>
      </sch:rule>
      <sch:rule context="xga:ea.gewerbemeldung.0220//xga:ummeldung[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-ummeldung-xga-frueheresGewerbe"/>
      </sch:rule>
      <sch:rule context="xga:abh.gewerbemeldung.0500//xga:ummeldung[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-ummeldung-xga-frueheresGewerbe"/>
      </sch:rule>
   </sch:pattern>
   <sch:pattern>
      <sch:rule id="rule.SCH-EXISTS-xga-ummeldung-xga-frueheresGewerbe" abstract="true">
         <sch:assert id="SCH-EXISTS-xga-ummeldung-xga-frueheresGewerbe"
                     test="exists(xga:frueheresGewerbe)">[SCH-EXISTS-xga-ummeldung-xga-frueheresGewerbe] Das Kindelement xga:frueheresGewerbe muss in diesem Kontext angegeben werden.</sch:assert>
      </sch:rule>
   </sch:pattern>
   <sch:pattern>
      <sch:rule id="rule.SCH-EMPTY-xga-ummeldung-xga-anlaesseUmmeldung" abstract="true">
         <sch:assert id="SCH-EMPTY-xga-ummeldung-xga-anlaesseUmmeldung"
                     test="empty(xga:anlaesseUmmeldung)">[SCH-EMPTY-xga-ummeldung-xga-anlaesseUmmeldung] Das Kindelement xga:anlaesseUmmeldung darf in diesem Kontext nicht angegeben werden.</sch:assert>
      </sch:rule>
      <sch:rule context="xga:ea.gewerbemeldung.0220//xga:ummeldung[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-ummeldung-xga-anlaesseUmmeldung"/>
      </sch:rule>
   </sch:pattern>
   <sch:pattern>
      <sch:rule id="rule.SCH-EXISTS-xga-ummeldung-xga-anlaesseUmmeldung"
                abstract="true">
         <sch:assert id="SCH-EXISTS-xga-ummeldung-xga-anlaesseUmmeldung"
                     test="exists(xga:anlaesseUmmeldung)">[SCH-EXISTS-xga-ummeldung-xga-anlaesseUmmeldung] Das Kindelement xga:anlaesseUmmeldung muss in diesem Kontext angegeben werden.</sch:assert>
      </sch:rule>
   </sch:pattern>
   <sch:pattern>
      <sch:rule id="rule.SCH-EMPTY-xga-ummeldung-xga-grundUmmeldungSchluessel"
                abstract="true">
         <sch:assert id="SCH-EMPTY-xga-ummeldung-xga-grundUmmeldungSchluessel"
                     test="empty(xga:grundUmmeldungSchluessel)">[SCH-EMPTY-xga-ummeldung-xga-grundUmmeldungSchluessel] Das Kindelement xga:grundUmmeldungSchluessel darf in diesem Kontext nicht angegeben werden.</sch:assert>
      </sch:rule>
      <sch:rule context="xga:ea.gewerbemeldung.0220//xga:ummeldung[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-ummeldung-xga-grundUmmeldungSchluessel"/>
      </sch:rule>
   </sch:pattern>
   <sch:pattern>
      <sch:rule id="rule.SCH-EXISTS-xga-ummeldung-xga-grundUmmeldungSchluessel"
                abstract="true">
         <sch:assert id="SCH-EXISTS-xga-ummeldung-xga-grundUmmeldungSchluessel"
                     test="exists(xga:grundUmmeldungSchluessel)">[SCH-EXISTS-xga-ummeldung-xga-grundUmmeldungSchluessel] Das Kindelement xga:grundUmmeldungSchluessel muss in diesem Kontext angegeben werden.</sch:assert>
      </sch:rule>
      <sch:rule context="xga:sta.gewerbemeldung.0100//xga:ummeldung[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-EXISTS-xga-ummeldung-xga-grundUmmeldungSchluessel"/>
      </sch:rule>
      <sch:rule context="xga:ihk.gewerbemeldung.0200//xga:ummeldung[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-EXISTS-xga-ummeldung-xga-grundUmmeldungSchluessel"/>
      </sch:rule>
      <sch:rule context="xga:hwk.gewerbemeldung.0210//xga:ummeldung[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-EXISTS-xga-ummeldung-xga-grundUmmeldungSchluessel"/>
      </sch:rule>
      <sch:rule context="xga:dgu.gewerbemeldung.0230//xga:ummeldung[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-EXISTS-xga-ummeldung-xga-grundUmmeldungSchluessel"/>
      </sch:rule>
      <sch:rule context="xga:rg.gewerbemeldung.0240//xga:ummeldung[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-EXISTS-xga-ummeldung-xga-grundUmmeldungSchluessel"/>
      </sch:rule>
      <sch:rule context="xga:fa.gewerbemeldung.0250//xga:ummeldung[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-EXISTS-xga-ummeldung-xga-grundUmmeldungSchluessel"/>
      </sch:rule>
      <sch:rule context="xga:zv.gewerbemeldung.0260//xga:ummeldung[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-EXISTS-xga-ummeldung-xga-grundUmmeldungSchluessel"/>
      </sch:rule>
      <sch:rule context="xga:is.gewerbemeldung.0270//xga:ummeldung[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-EXISTS-xga-ummeldung-xga-grundUmmeldungSchluessel"/>
      </sch:rule>
      <sch:rule context="xga:as.gewerbemeldung.0280//xga:ummeldung[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-EXISTS-xga-ummeldung-xga-grundUmmeldungSchluessel"/>
      </sch:rule>
      <sch:rule context="xga:lue.gewerbemeldung.0290//xga:ummeldung[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-EXISTS-xga-ummeldung-xga-grundUmmeldungSchluessel"/>
      </sch:rule>
      <sch:rule context="xga:alg.gewerbemeldung.0300//xga:ummeldung[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-EXISTS-xga-ummeldung-xga-grundUmmeldungSchluessel"/>
      </sch:rule>
      <sch:rule context="xga:ext.gewerbemeldung.0400//xga:ummeldung[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-EXISTS-xga-ummeldung-xga-grundUmmeldungSchluessel"/>
      </sch:rule>
      <sch:rule context="xga:abh.gewerbemeldung.0500//xga:ummeldung[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-EXISTS-xga-ummeldung-xga-grundUmmeldungSchluessel"/>
      </sch:rule>
      <sch:rule context="xga:unterrichtung.0700//xga:ummeldung[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-EXISTS-xga-ummeldung-xga-grundUmmeldungSchluessel"/>
      </sch:rule>
   </sch:pattern>
   <sch:pattern>
      <sch:rule id="rule.SCH-EMPTY-xga-berichtigung-xga-anlaesseBerichtigung"
                abstract="true">
         <sch:assert id="SCH-EMPTY-xga-berichtigung-xga-anlaesseBerichtigung"
                     test="empty(xga:anlaesseBerichtigung)">[SCH-EMPTY-xga-berichtigung-xga-anlaesseBerichtigung] Das Kindelement xga:anlaesseBerichtigung darf in diesem Kontext nicht angegeben werden.</sch:assert>
      </sch:rule>
      <sch:rule context="xga:ea.gewerbemeldung.0220//xga:berichtigung[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-berichtigung-xga-anlaesseBerichtigung"/>
      </sch:rule>
   </sch:pattern>
   <sch:pattern>
      <sch:rule id="rule.SCH-EXISTS-xga-berichtigung-xga-anlaesseBerichtigung"
                abstract="true">
         <sch:assert id="SCH-EXISTS-xga-berichtigung-xga-anlaesseBerichtigung"
                     test="exists(xga:anlaesseBerichtigung)">[SCH-EXISTS-xga-berichtigung-xga-anlaesseBerichtigung] Das Kindelement xga:anlaesseBerichtigung muss in diesem Kontext angegeben werden.</sch:assert>
      </sch:rule>
   </sch:pattern>
   <sch:pattern>
      <sch:rule id="rule.SCH-EMPTY-xga-berichtigung-xga-grundBerichtigungSchluessel"
                abstract="true">
         <sch:assert id="SCH-EMPTY-xga-berichtigung-xga-grundBerichtigungSchluessel"
                     test="empty(xga:grundBerichtigungSchluessel)">[SCH-EMPTY-xga-berichtigung-xga-grundBerichtigungSchluessel] Das Kindelement xga:grundBerichtigungSchluessel darf in diesem Kontext nicht angegeben werden.</sch:assert>
      </sch:rule>
      <sch:rule context="xga:ea.gewerbemeldung.0220//xga:berichtigung[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-berichtigung-xga-grundBerichtigungSchluessel"/>
      </sch:rule>
   </sch:pattern>
   <sch:pattern>
      <sch:rule id="rule.SCH-EXISTS-xga-berichtigung-xga-grundBerichtigungSchluessel"
                abstract="true">
         <sch:assert id="SCH-EXISTS-xga-berichtigung-xga-grundBerichtigungSchluessel"
                     test="exists(xga:grundBerichtigungSchluessel)">[SCH-EXISTS-xga-berichtigung-xga-grundBerichtigungSchluessel] Das Kindelement xga:grundBerichtigungSchluessel muss in diesem Kontext angegeben werden.</sch:assert>
      </sch:rule>
      <sch:rule context="xga:sta.gewerbemeldung.0100//xga:berichtigung[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-EXISTS-xga-berichtigung-xga-grundBerichtigungSchluessel"/>
      </sch:rule>
      <sch:rule context="xga:ihk.gewerbemeldung.0200//xga:berichtigung[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-EXISTS-xga-berichtigung-xga-grundBerichtigungSchluessel"/>
      </sch:rule>
      <sch:rule context="xga:hwk.gewerbemeldung.0210//xga:berichtigung[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-EXISTS-xga-berichtigung-xga-grundBerichtigungSchluessel"/>
      </sch:rule>
      <sch:rule context="xga:dgu.gewerbemeldung.0230//xga:berichtigung[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-EXISTS-xga-berichtigung-xga-grundBerichtigungSchluessel"/>
      </sch:rule>
      <sch:rule context="xga:rg.gewerbemeldung.0240//xga:berichtigung[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-EXISTS-xga-berichtigung-xga-grundBerichtigungSchluessel"/>
      </sch:rule>
      <sch:rule context="xga:fa.gewerbemeldung.0250//xga:berichtigung[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-EXISTS-xga-berichtigung-xga-grundBerichtigungSchluessel"/>
      </sch:rule>
      <sch:rule context="xga:zv.gewerbemeldung.0260//xga:berichtigung[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-EXISTS-xga-berichtigung-xga-grundBerichtigungSchluessel"/>
      </sch:rule>
      <sch:rule context="xga:is.gewerbemeldung.0270//xga:berichtigung[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-EXISTS-xga-berichtigung-xga-grundBerichtigungSchluessel"/>
      </sch:rule>
      <sch:rule context="xga:as.gewerbemeldung.0280//xga:berichtigung[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-EXISTS-xga-berichtigung-xga-grundBerichtigungSchluessel"/>
      </sch:rule>
      <sch:rule context="xga:lue.gewerbemeldung.0290//xga:berichtigung[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-EXISTS-xga-berichtigung-xga-grundBerichtigungSchluessel"/>
      </sch:rule>
      <sch:rule context="xga:alg.gewerbemeldung.0300//xga:berichtigung[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-EXISTS-xga-berichtigung-xga-grundBerichtigungSchluessel"/>
      </sch:rule>
      <sch:rule context="xga:ext.gewerbemeldung.0400//xga:berichtigung[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-EXISTS-xga-berichtigung-xga-grundBerichtigungSchluessel"/>
      </sch:rule>
      <sch:rule context="xga:abh.gewerbemeldung.0500//xga:berichtigung[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-EXISTS-xga-berichtigung-xga-grundBerichtigungSchluessel"/>
      </sch:rule>
      <sch:rule context="xga:unterrichtung.0700//xga:berichtigung[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-EXISTS-xga-berichtigung-xga-grundBerichtigungSchluessel"/>
      </sch:rule>
   </sch:pattern>
   <sch:pattern>
      <sch:rule id="rule.SCH-EMPTY-bk-geburt-adr-ort" abstract="true">
         <sch:assert id="SCH-EMPTY-bk-geburt-adr-ort" test="empty(adr:ort)">[SCH-EMPTY-bk-geburt-adr-ort] Das Kindelement adr:ort darf in diesem Kontext nicht angegeben werden.</sch:assert>
      </sch:rule>
      <sch:rule context="xga:sta.gewerbemeldung.0100//bk:geburt[ancestor-or-self::xga:referenzierteSubjekte and ancestor-or-self::xga:natuerlichePerson/np:natuerlichePerson.id = (ancestor::xga:satz/*/xga:gewerbebetrieb//xga:gewerbetreibender.id,&#xA;            ancestor::xga:satz/*/xga:referenzierteSubjekte//gv:gesetzlicherVertreter.id, ancestor::xga:satz/*/xga:referenzierteSubjekte//ges:gesellschafter.id)]">
         <sch:extends rule="rule.SCH-EMPTY-bk-geburt-adr-ort"/>
      </sch:rule>
      <sch:rule context="xga:ea.gewerbemeldung.0220//bk:geburt[ancestor-or-self::xga:referenzierteSubjekte and ancestor-or-self::xga:natuerlichePerson/np:natuerlichePerson.id = (ancestor::xga:satz/*/xga:gewerbebetrieb//xga:gewerbetreibender.id,&#xA;            ancestor::xga:satz/*/xga:referenzierteSubjekte//gv:gesetzlicherVertreter.id, ancestor::xga:satz/*/xga:referenzierteSubjekte//ges:gesellschafter.id)]">
         <sch:extends rule="rule.SCH-EMPTY-bk-geburt-adr-ort"/>
      </sch:rule>
      <sch:rule context="xga:rg.gewerbemeldung.0240//bk:geburt[ancestor-or-self::xga:referenzierteSubjekte and ancestor-or-self::xga:natuerlichePerson/np:natuerlichePerson.id = (ancestor::xga:satz/*/xga:gewerbebetrieb//xga:gewerbetreibender.id,&#xA;            ancestor::xga:satz/*/xga:referenzierteSubjekte//gv:gesetzlicherVertreter.id, ancestor::xga:satz/*/xga:referenzierteSubjekte//ges:gesellschafter.id)]">
         <sch:extends rule="rule.SCH-EMPTY-bk-geburt-adr-ort"/>
      </sch:rule>
   </sch:pattern>
   <sch:pattern>
      <sch:rule id="rule.SCH-EXISTS-bk-geburt-adr-ort" abstract="true">
         <sch:assert id="SCH-EXISTS-bk-geburt-adr-ort" test="exists(adr:ort)">[SCH-EXISTS-bk-geburt-adr-ort] Das Kindelement adr:ort muss in diesem Kontext angegeben werden.</sch:assert>
      </sch:rule>
      <sch:rule context="xga:ihk.gewerbemeldung.0200//bk:geburt[ancestor-or-self::xga:referenzierteSubjekte and ancestor-or-self::xga:natuerlichePerson/np:natuerlichePerson.id = (ancestor::xga:satz/*/xga:gewerbebetrieb//xga:gewerbetreibender.id,&#xA;            ancestor::xga:satz/*/xga:referenzierteSubjekte//gv:gesetzlicherVertreter.id, ancestor::xga:satz/*/xga:referenzierteSubjekte//ges:gesellschafter.id)]">
         <sch:extends rule="rule.SCH-EXISTS-bk-geburt-adr-ort"/>
      </sch:rule>
      <sch:rule context="xga:hwk.gewerbemeldung.0210//bk:geburt[ancestor-or-self::xga:referenzierteSubjekte and ancestor-or-self::xga:natuerlichePerson/np:natuerlichePerson.id = (ancestor::xga:satz/*/xga:gewerbebetrieb//xga:gewerbetreibender.id,&#xA;            ancestor::xga:satz/*/xga:referenzierteSubjekte//gv:gesetzlicherVertreter.id, ancestor::xga:satz/*/xga:referenzierteSubjekte//ges:gesellschafter.id)]">
         <sch:extends rule="rule.SCH-EXISTS-bk-geburt-adr-ort"/>
      </sch:rule>
      <sch:rule context="xga:dgu.gewerbemeldung.0230//bk:geburt[ancestor-or-self::xga:referenzierteSubjekte and ancestor-or-self::xga:natuerlichePerson/np:natuerlichePerson.id = (ancestor::xga:satz/*/xga:gewerbebetrieb//xga:gewerbetreibender.id,&#xA;            ancestor::xga:satz/*/xga:referenzierteSubjekte//gv:gesetzlicherVertreter.id, ancestor::xga:satz/*/xga:referenzierteSubjekte//ges:gesellschafter.id)]">
         <sch:extends rule="rule.SCH-EXISTS-bk-geburt-adr-ort"/>
      </sch:rule>
      <sch:rule context="xga:fa.gewerbemeldung.0250//bk:geburt[ancestor-or-self::xga:referenzierteSubjekte and ancestor-or-self::xga:natuerlichePerson/np:natuerlichePerson.id = (ancestor::xga:satz/*/xga:gewerbebetrieb//xga:gewerbetreibender.id,&#xA;            ancestor::xga:satz/*/xga:referenzierteSubjekte//gv:gesetzlicherVertreter.id, ancestor::xga:satz/*/xga:referenzierteSubjekte//ges:gesellschafter.id)]">
         <sch:extends rule="rule.SCH-EXISTS-bk-geburt-adr-ort"/>
      </sch:rule>
      <sch:rule context="xga:zv.gewerbemeldung.0260//bk:geburt[ancestor-or-self::xga:referenzierteSubjekte and ancestor-or-self::xga:natuerlichePerson/np:natuerlichePerson.id = (ancestor::xga:satz/*/xga:gewerbebetrieb//xga:gewerbetreibender.id,&#xA;            ancestor::xga:satz/*/xga:referenzierteSubjekte//gv:gesetzlicherVertreter.id, ancestor::xga:satz/*/xga:referenzierteSubjekte//ges:gesellschafter.id)]">
         <sch:extends rule="rule.SCH-EXISTS-bk-geburt-adr-ort"/>
      </sch:rule>
      <sch:rule context="xga:is.gewerbemeldung.0270//bk:geburt[ancestor-or-self::xga:referenzierteSubjekte and ancestor-or-self::xga:natuerlichePerson/np:natuerlichePerson.id = (ancestor::xga:satz/*/xga:gewerbebetrieb//xga:gewerbetreibender.id,&#xA;            ancestor::xga:satz/*/xga:referenzierteSubjekte//gv:gesetzlicherVertreter.id, ancestor::xga:satz/*/xga:referenzierteSubjekte//ges:gesellschafter.id)]">
         <sch:extends rule="rule.SCH-EXISTS-bk-geburt-adr-ort"/>
      </sch:rule>
      <sch:rule context="xga:as.gewerbemeldung.0280//bk:geburt[ancestor-or-self::xga:referenzierteSubjekte and ancestor-or-self::xga:natuerlichePerson/np:natuerlichePerson.id = (ancestor::xga:satz/*/xga:gewerbebetrieb//xga:gewerbetreibender.id,&#xA;            ancestor::xga:satz/*/xga:referenzierteSubjekte//gv:gesetzlicherVertreter.id, ancestor::xga:satz/*/xga:referenzierteSubjekte//ges:gesellschafter.id)]">
         <sch:extends rule="rule.SCH-EXISTS-bk-geburt-adr-ort"/>
      </sch:rule>
      <sch:rule context="xga:lue.gewerbemeldung.0290//bk:geburt[ancestor-or-self::xga:referenzierteSubjekte and ancestor-or-self::xga:natuerlichePerson/np:natuerlichePerson.id = (ancestor::xga:satz/*/xga:gewerbebetrieb//xga:gewerbetreibender.id,&#xA;            ancestor::xga:satz/*/xga:referenzierteSubjekte//gv:gesetzlicherVertreter.id, ancestor::xga:satz/*/xga:referenzierteSubjekte//ges:gesellschafter.id)]">
         <sch:extends rule="rule.SCH-EXISTS-bk-geburt-adr-ort"/>
      </sch:rule>
      <sch:rule context="xga:alg.gewerbemeldung.0300//bk:geburt[ancestor-or-self::xga:referenzierteSubjekte and ancestor-or-self::xga:natuerlichePerson/np:natuerlichePerson.id = (ancestor::xga:satz/*/xga:gewerbebetrieb//xga:gewerbetreibender.id,&#xA;            ancestor::xga:satz/*/xga:referenzierteSubjekte//gv:gesetzlicherVertreter.id, ancestor::xga:satz/*/xga:referenzierteSubjekte//ges:gesellschafter.id)]">
         <sch:extends rule="rule.SCH-EXISTS-bk-geburt-adr-ort"/>
      </sch:rule>
      <sch:rule context="xga:ext.gewerbemeldung.0400//bk:geburt[ancestor-or-self::xga:referenzierteSubjekte and ancestor-or-self::xga:natuerlichePerson/np:natuerlichePerson.id = (ancestor::xga:satz/*/xga:gewerbebetrieb//xga:gewerbetreibender.id,&#xA;            ancestor::xga:satz/*/xga:referenzierteSubjekte//gv:gesetzlicherVertreter.id, ancestor::xga:satz/*/xga:referenzierteSubjekte//ges:gesellschafter.id)]">
         <sch:extends rule="rule.SCH-EXISTS-bk-geburt-adr-ort"/>
      </sch:rule>
      <sch:rule context="xga:abh.gewerbemeldung.0500//bk:geburt[ancestor-or-self::xga:referenzierteSubjekte and ancestor-or-self::xga:natuerlichePerson/np:natuerlichePerson.id = (ancestor::xga:satz/*/xga:gewerbebetrieb//xga:gewerbetreibender.id,&#xA;            ancestor::xga:satz/*/xga:referenzierteSubjekte//gv:gesetzlicherVertreter.id, ancestor::xga:satz/*/xga:referenzierteSubjekte//ges:gesellschafter.id)]">
         <sch:extends rule="rule.SCH-EXISTS-bk-geburt-adr-ort"/>
      </sch:rule>
      <sch:rule context="xga:unterrichtung.0700//bk:geburt[ancestor-or-self::xga:referenzierteSubjekte and ancestor-or-self::xga:natuerlichePerson/np:natuerlichePerson.id = (ancestor::xga:satz/*/xga:gewerbebetrieb//xga:gewerbetreibender.id,&#xA;            ancestor::xga:satz/*/xga:referenzierteSubjekte//gv:gesetzlicherVertreter.id, ancestor::xga:satz/*/xga:referenzierteSubjekte//ges:gesellschafter.id)]">
         <sch:extends rule="rule.SCH-EXISTS-bk-geburt-adr-ort"/>
      </sch:rule>
   </sch:pattern>
   <sch:pattern>
      <sch:rule id="rule.SCH-EMPTY-bk-geburt-bk-staat" abstract="true">
         <sch:assert id="SCH-EMPTY-bk-geburt-bk-staat" test="empty(bk:staat)">[SCH-EMPTY-bk-geburt-bk-staat] Das Kindelement bk:staat darf in diesem Kontext nicht angegeben werden.</sch:assert>
      </sch:rule>
      <sch:rule context="xga:sta.gewerbemeldung.0100//bk:geburt[ancestor-or-self::xga:referenzierteSubjekte and ancestor-or-self::xga:natuerlichePerson/np:natuerlichePerson.id = (ancestor::xga:satz/*/xga:gewerbebetrieb//xga:gewerbetreibender.id,&#xA;            ancestor::xga:satz/*/xga:referenzierteSubjekte//gv:gesetzlicherVertreter.id, ancestor::xga:satz/*/xga:referenzierteSubjekte//ges:gesellschafter.id)]">
         <sch:extends rule="rule.SCH-EMPTY-bk-geburt-bk-staat"/>
      </sch:rule>
      <sch:rule context="xga:ea.gewerbemeldung.0220//bk:geburt[ancestor-or-self::xga:referenzierteSubjekte and ancestor-or-self::xga:natuerlichePerson/np:natuerlichePerson.id = (ancestor::xga:satz/*/xga:gewerbebetrieb//xga:gewerbetreibender.id,&#xA;            ancestor::xga:satz/*/xga:referenzierteSubjekte//gv:gesetzlicherVertreter.id, ancestor::xga:satz/*/xga:referenzierteSubjekte//ges:gesellschafter.id)]">
         <sch:extends rule="rule.SCH-EMPTY-bk-geburt-bk-staat"/>
      </sch:rule>
      <sch:rule context="xga:rg.gewerbemeldung.0240//bk:geburt[ancestor-or-self::xga:referenzierteSubjekte and ancestor-or-self::xga:natuerlichePerson/np:natuerlichePerson.id = (ancestor::xga:satz/*/xga:gewerbebetrieb//xga:gewerbetreibender.id,&#xA;            ancestor::xga:satz/*/xga:referenzierteSubjekte//gv:gesetzlicherVertreter.id, ancestor::xga:satz/*/xga:referenzierteSubjekte//ges:gesellschafter.id)]">
         <sch:extends rule="rule.SCH-EMPTY-bk-geburt-bk-staat"/>
      </sch:rule>
   </sch:pattern>
   <sch:pattern>
      <sch:rule id="rule.SCH-EXISTS-bk-geburt-bk-staat" abstract="true">
         <sch:assert id="SCH-EXISTS-bk-geburt-bk-staat" test="exists(bk:staat)">[SCH-EXISTS-bk-geburt-bk-staat] Das Kindelement bk:staat muss in diesem Kontext angegeben werden.</sch:assert>
      </sch:rule>
      <sch:rule context="xga:ihk.gewerbemeldung.0200//bk:geburt[ancestor-or-self::xga:referenzierteSubjekte and ancestor-or-self::xga:natuerlichePerson/np:natuerlichePerson.id = (ancestor::xga:satz/*/xga:gewerbebetrieb//xga:gewerbetreibender.id,&#xA;            ancestor::xga:satz/*/xga:referenzierteSubjekte//gv:gesetzlicherVertreter.id, ancestor::xga:satz/*/xga:referenzierteSubjekte//ges:gesellschafter.id)]">
         <sch:extends rule="rule.SCH-EXISTS-bk-geburt-bk-staat"/>
      </sch:rule>
      <sch:rule context="xga:hwk.gewerbemeldung.0210//bk:geburt[ancestor-or-self::xga:referenzierteSubjekte and ancestor-or-self::xga:natuerlichePerson/np:natuerlichePerson.id = (ancestor::xga:satz/*/xga:gewerbebetrieb//xga:gewerbetreibender.id,&#xA;            ancestor::xga:satz/*/xga:referenzierteSubjekte//gv:gesetzlicherVertreter.id, ancestor::xga:satz/*/xga:referenzierteSubjekte//ges:gesellschafter.id)]">
         <sch:extends rule="rule.SCH-EXISTS-bk-geburt-bk-staat"/>
      </sch:rule>
      <sch:rule context="xga:dgu.gewerbemeldung.0230//bk:geburt[ancestor-or-self::xga:referenzierteSubjekte and ancestor-or-self::xga:natuerlichePerson/np:natuerlichePerson.id = (ancestor::xga:satz/*/xga:gewerbebetrieb//xga:gewerbetreibender.id,&#xA;            ancestor::xga:satz/*/xga:referenzierteSubjekte//gv:gesetzlicherVertreter.id, ancestor::xga:satz/*/xga:referenzierteSubjekte//ges:gesellschafter.id)]">
         <sch:extends rule="rule.SCH-EXISTS-bk-geburt-bk-staat"/>
      </sch:rule>
      <sch:rule context="xga:fa.gewerbemeldung.0250//bk:geburt[ancestor-or-self::xga:referenzierteSubjekte and ancestor-or-self::xga:natuerlichePerson/np:natuerlichePerson.id = (ancestor::xga:satz/*/xga:gewerbebetrieb//xga:gewerbetreibender.id,&#xA;            ancestor::xga:satz/*/xga:referenzierteSubjekte//gv:gesetzlicherVertreter.id, ancestor::xga:satz/*/xga:referenzierteSubjekte//ges:gesellschafter.id)]">
         <sch:extends rule="rule.SCH-EXISTS-bk-geburt-bk-staat"/>
      </sch:rule>
      <sch:rule context="xga:zv.gewerbemeldung.0260//bk:geburt[ancestor-or-self::xga:referenzierteSubjekte and ancestor-or-self::xga:natuerlichePerson/np:natuerlichePerson.id = (ancestor::xga:satz/*/xga:gewerbebetrieb//xga:gewerbetreibender.id,&#xA;            ancestor::xga:satz/*/xga:referenzierteSubjekte//gv:gesetzlicherVertreter.id, ancestor::xga:satz/*/xga:referenzierteSubjekte//ges:gesellschafter.id)]">
         <sch:extends rule="rule.SCH-EXISTS-bk-geburt-bk-staat"/>
      </sch:rule>
      <sch:rule context="xga:is.gewerbemeldung.0270//bk:geburt[ancestor-or-self::xga:referenzierteSubjekte and ancestor-or-self::xga:natuerlichePerson/np:natuerlichePerson.id = (ancestor::xga:satz/*/xga:gewerbebetrieb//xga:gewerbetreibender.id,&#xA;            ancestor::xga:satz/*/xga:referenzierteSubjekte//gv:gesetzlicherVertreter.id, ancestor::xga:satz/*/xga:referenzierteSubjekte//ges:gesellschafter.id)]">
         <sch:extends rule="rule.SCH-EXISTS-bk-geburt-bk-staat"/>
      </sch:rule>
      <sch:rule context="xga:as.gewerbemeldung.0280//bk:geburt[ancestor-or-self::xga:referenzierteSubjekte and ancestor-or-self::xga:natuerlichePerson/np:natuerlichePerson.id = (ancestor::xga:satz/*/xga:gewerbebetrieb//xga:gewerbetreibender.id,&#xA;            ancestor::xga:satz/*/xga:referenzierteSubjekte//gv:gesetzlicherVertreter.id, ancestor::xga:satz/*/xga:referenzierteSubjekte//ges:gesellschafter.id)]">
         <sch:extends rule="rule.SCH-EXISTS-bk-geburt-bk-staat"/>
      </sch:rule>
      <sch:rule context="xga:lue.gewerbemeldung.0290//bk:geburt[ancestor-or-self::xga:referenzierteSubjekte and ancestor-or-self::xga:natuerlichePerson/np:natuerlichePerson.id = (ancestor::xga:satz/*/xga:gewerbebetrieb//xga:gewerbetreibender.id,&#xA;            ancestor::xga:satz/*/xga:referenzierteSubjekte//gv:gesetzlicherVertreter.id, ancestor::xga:satz/*/xga:referenzierteSubjekte//ges:gesellschafter.id)]">
         <sch:extends rule="rule.SCH-EXISTS-bk-geburt-bk-staat"/>
      </sch:rule>
      <sch:rule context="xga:alg.gewerbemeldung.0300//bk:geburt[ancestor-or-self::xga:referenzierteSubjekte and ancestor-or-self::xga:natuerlichePerson/np:natuerlichePerson.id = (ancestor::xga:satz/*/xga:gewerbebetrieb//xga:gewerbetreibender.id,&#xA;            ancestor::xga:satz/*/xga:referenzierteSubjekte//gv:gesetzlicherVertreter.id, ancestor::xga:satz/*/xga:referenzierteSubjekte//ges:gesellschafter.id)]">
         <sch:extends rule="rule.SCH-EXISTS-bk-geburt-bk-staat"/>
      </sch:rule>
      <sch:rule context="xga:ext.gewerbemeldung.0400//bk:geburt[ancestor-or-self::xga:referenzierteSubjekte and ancestor-or-self::xga:natuerlichePerson/np:natuerlichePerson.id = (ancestor::xga:satz/*/xga:gewerbebetrieb//xga:gewerbetreibender.id,&#xA;            ancestor::xga:satz/*/xga:referenzierteSubjekte//gv:gesetzlicherVertreter.id, ancestor::xga:satz/*/xga:referenzierteSubjekte//ges:gesellschafter.id)]">
         <sch:extends rule="rule.SCH-EXISTS-bk-geburt-bk-staat"/>
      </sch:rule>
      <sch:rule context="xga:abh.gewerbemeldung.0500//bk:geburt[ancestor-or-self::xga:referenzierteSubjekte and ancestor-or-self::xga:natuerlichePerson/np:natuerlichePerson.id = (ancestor::xga:satz/*/xga:gewerbebetrieb//xga:gewerbetreibender.id,&#xA;            ancestor::xga:satz/*/xga:referenzierteSubjekte//gv:gesetzlicherVertreter.id, ancestor::xga:satz/*/xga:referenzierteSubjekte//ges:gesellschafter.id)]">
         <sch:extends rule="rule.SCH-EXISTS-bk-geburt-bk-staat"/>
      </sch:rule>
      <sch:rule context="xga:unterrichtung.0700//bk:geburt[ancestor-or-self::xga:referenzierteSubjekte and ancestor-or-self::xga:natuerlichePerson/np:natuerlichePerson.id = (ancestor::xga:satz/*/xga:gewerbebetrieb//xga:gewerbetreibender.id,&#xA;            ancestor::xga:satz/*/xga:referenzierteSubjekte//gv:gesetzlicherVertreter.id, ancestor::xga:satz/*/xga:referenzierteSubjekte//ges:gesellschafter.id)]">
         <sch:extends rule="rule.SCH-EXISTS-bk-geburt-bk-staat"/>
      </sch:rule>
   </sch:pattern>
   <sch:pattern>
      <sch:rule id="rule.SCH-EMPTY-bk-geburt-np-geburtsdatum" abstract="true">
         <sch:assert id="SCH-EMPTY-bk-geburt-np-geburtsdatum" test="empty(np:geburtsdatum)">[SCH-EMPTY-bk-geburt-np-geburtsdatum] Das Kindelement np:geburtsdatum darf in diesem Kontext nicht angegeben werden.</sch:assert>
      </sch:rule>
      <sch:rule context="xga:sta.gewerbemeldung.0100//bk:geburt[ancestor-or-self::xga:referenzierteSubjekte and ancestor-or-self::xga:natuerlichePerson/np:natuerlichePerson.id = (ancestor::xga:satz/*/xga:gewerbebetrieb//xga:gewerbetreibender.id,&#xA;            ancestor::xga:satz/*/xga:referenzierteSubjekte//gv:gesetzlicherVertreter.id, ancestor::xga:satz/*/xga:referenzierteSubjekte//ges:gesellschafter.id)]">
         <sch:extends rule="rule.SCH-EMPTY-bk-geburt-np-geburtsdatum"/>
      </sch:rule>
      <sch:rule context="xga:ea.gewerbemeldung.0220//bk:geburt[ancestor-or-self::xga:referenzierteSubjekte and ancestor-or-self::xga:natuerlichePerson/np:natuerlichePerson.id = (ancestor::xga:satz/*/xga:gewerbebetrieb//xga:gewerbetreibender.id,&#xA;            ancestor::xga:satz/*/xga:referenzierteSubjekte//gv:gesetzlicherVertreter.id, ancestor::xga:satz/*/xga:referenzierteSubjekte//ges:gesellschafter.id)]">
         <sch:extends rule="rule.SCH-EMPTY-bk-geburt-np-geburtsdatum"/>
      </sch:rule>
      <sch:rule context="xga:rg.gewerbemeldung.0240//bk:geburt[ancestor-or-self::xga:referenzierteSubjekte and ancestor-or-self::xga:natuerlichePerson/np:natuerlichePerson.id = (ancestor::xga:satz/*/xga:gewerbebetrieb//xga:gewerbetreibender.id,&#xA;            ancestor::xga:satz/*/xga:referenzierteSubjekte//gv:gesetzlicherVertreter.id, ancestor::xga:satz/*/xga:referenzierteSubjekte//ges:gesellschafter.id)]">
         <sch:extends rule="rule.SCH-EMPTY-bk-geburt-np-geburtsdatum"/>
      </sch:rule>
   </sch:pattern>
   <sch:pattern>
      <sch:rule id="rule.SCH-EXISTS-bk-geburt-np-geburtsdatum" abstract="true">
         <sch:assert id="SCH-EXISTS-bk-geburt-np-geburtsdatum"
                     test="exists(np:geburtsdatum)">[SCH-EXISTS-bk-geburt-np-geburtsdatum] Das Kindelement np:geburtsdatum muss in diesem Kontext angegeben werden.</sch:assert>
      </sch:rule>
      <sch:rule context="xga:ihk.gewerbemeldung.0200//bk:geburt[ancestor-or-self::xga:referenzierteSubjekte and ancestor-or-self::xga:natuerlichePerson/np:natuerlichePerson.id = (ancestor::xga:satz/*/xga:gewerbebetrieb//xga:gewerbetreibender.id,&#xA;            ancestor::xga:satz/*/xga:referenzierteSubjekte//gv:gesetzlicherVertreter.id, ancestor::xga:satz/*/xga:referenzierteSubjekte//ges:gesellschafter.id)]">
         <sch:extends rule="rule.SCH-EXISTS-bk-geburt-np-geburtsdatum"/>
      </sch:rule>
      <sch:rule context="xga:hwk.gewerbemeldung.0210//bk:geburt[ancestor-or-self::xga:referenzierteSubjekte and ancestor-or-self::xga:natuerlichePerson/np:natuerlichePerson.id = (ancestor::xga:satz/*/xga:gewerbebetrieb//xga:gewerbetreibender.id,&#xA;            ancestor::xga:satz/*/xga:referenzierteSubjekte//gv:gesetzlicherVertreter.id, ancestor::xga:satz/*/xga:referenzierteSubjekte//ges:gesellschafter.id)]">
         <sch:extends rule="rule.SCH-EXISTS-bk-geburt-np-geburtsdatum"/>
      </sch:rule>
      <sch:rule context="xga:dgu.gewerbemeldung.0230//bk:geburt[ancestor-or-self::xga:referenzierteSubjekte and ancestor-or-self::xga:natuerlichePerson/np:natuerlichePerson.id = (ancestor::xga:satz/*/xga:gewerbebetrieb//xga:gewerbetreibender.id,&#xA;            ancestor::xga:satz/*/xga:referenzierteSubjekte//gv:gesetzlicherVertreter.id, ancestor::xga:satz/*/xga:referenzierteSubjekte//ges:gesellschafter.id)]">
         <sch:extends rule="rule.SCH-EXISTS-bk-geburt-np-geburtsdatum"/>
      </sch:rule>
      <sch:rule context="xga:fa.gewerbemeldung.0250//bk:geburt[ancestor-or-self::xga:referenzierteSubjekte and ancestor-or-self::xga:natuerlichePerson/np:natuerlichePerson.id = (ancestor::xga:satz/*/xga:gewerbebetrieb//xga:gewerbetreibender.id,&#xA;            ancestor::xga:satz/*/xga:referenzierteSubjekte//gv:gesetzlicherVertreter.id, ancestor::xga:satz/*/xga:referenzierteSubjekte//ges:gesellschafter.id)]">
         <sch:extends rule="rule.SCH-EXISTS-bk-geburt-np-geburtsdatum"/>
      </sch:rule>
      <sch:rule context="xga:zv.gewerbemeldung.0260//bk:geburt[ancestor-or-self::xga:referenzierteSubjekte and ancestor-or-self::xga:natuerlichePerson/np:natuerlichePerson.id = (ancestor::xga:satz/*/xga:gewerbebetrieb//xga:gewerbetreibender.id,&#xA;            ancestor::xga:satz/*/xga:referenzierteSubjekte//gv:gesetzlicherVertreter.id, ancestor::xga:satz/*/xga:referenzierteSubjekte//ges:gesellschafter.id)]">
         <sch:extends rule="rule.SCH-EXISTS-bk-geburt-np-geburtsdatum"/>
      </sch:rule>
      <sch:rule context="xga:is.gewerbemeldung.0270//bk:geburt[ancestor-or-self::xga:referenzierteSubjekte and ancestor-or-self::xga:natuerlichePerson/np:natuerlichePerson.id = (ancestor::xga:satz/*/xga:gewerbebetrieb//xga:gewerbetreibender.id,&#xA;            ancestor::xga:satz/*/xga:referenzierteSubjekte//gv:gesetzlicherVertreter.id, ancestor::xga:satz/*/xga:referenzierteSubjekte//ges:gesellschafter.id)]">
         <sch:extends rule="rule.SCH-EXISTS-bk-geburt-np-geburtsdatum"/>
      </sch:rule>
      <sch:rule context="xga:as.gewerbemeldung.0280//bk:geburt[ancestor-or-self::xga:referenzierteSubjekte and ancestor-or-self::xga:natuerlichePerson/np:natuerlichePerson.id = (ancestor::xga:satz/*/xga:gewerbebetrieb//xga:gewerbetreibender.id,&#xA;            ancestor::xga:satz/*/xga:referenzierteSubjekte//gv:gesetzlicherVertreter.id, ancestor::xga:satz/*/xga:referenzierteSubjekte//ges:gesellschafter.id)]">
         <sch:extends rule="rule.SCH-EXISTS-bk-geburt-np-geburtsdatum"/>
      </sch:rule>
      <sch:rule context="xga:lue.gewerbemeldung.0290//bk:geburt[ancestor-or-self::xga:referenzierteSubjekte and ancestor-or-self::xga:natuerlichePerson/np:natuerlichePerson.id = (ancestor::xga:satz/*/xga:gewerbebetrieb//xga:gewerbetreibender.id,&#xA;            ancestor::xga:satz/*/xga:referenzierteSubjekte//gv:gesetzlicherVertreter.id, ancestor::xga:satz/*/xga:referenzierteSubjekte//ges:gesellschafter.id)]">
         <sch:extends rule="rule.SCH-EXISTS-bk-geburt-np-geburtsdatum"/>
      </sch:rule>
      <sch:rule context="xga:alg.gewerbemeldung.0300//bk:geburt[ancestor-or-self::xga:referenzierteSubjekte and ancestor-or-self::xga:natuerlichePerson/np:natuerlichePerson.id = (ancestor::xga:satz/*/xga:gewerbebetrieb//xga:gewerbetreibender.id,&#xA;            ancestor::xga:satz/*/xga:referenzierteSubjekte//gv:gesetzlicherVertreter.id, ancestor::xga:satz/*/xga:referenzierteSubjekte//ges:gesellschafter.id)]">
         <sch:extends rule="rule.SCH-EXISTS-bk-geburt-np-geburtsdatum"/>
      </sch:rule>
      <sch:rule context="xga:ext.gewerbemeldung.0400//bk:geburt[ancestor-or-self::xga:referenzierteSubjekte and ancestor-or-self::xga:natuerlichePerson/np:natuerlichePerson.id = (ancestor::xga:satz/*/xga:gewerbebetrieb//xga:gewerbetreibender.id,&#xA;            ancestor::xga:satz/*/xga:referenzierteSubjekte//gv:gesetzlicherVertreter.id, ancestor::xga:satz/*/xga:referenzierteSubjekte//ges:gesellschafter.id)]">
         <sch:extends rule="rule.SCH-EXISTS-bk-geburt-np-geburtsdatum"/>
      </sch:rule>
      <sch:rule context="xga:abh.gewerbemeldung.0500//bk:geburt[ancestor-or-self::xga:referenzierteSubjekte and ancestor-or-self::xga:natuerlichePerson/np:natuerlichePerson.id = (ancestor::xga:satz/*/xga:gewerbebetrieb//xga:gewerbetreibender.id,&#xA;            ancestor::xga:satz/*/xga:referenzierteSubjekte//gv:gesetzlicherVertreter.id, ancestor::xga:satz/*/xga:referenzierteSubjekte//ges:gesellschafter.id)]">
         <sch:extends rule="rule.SCH-EXISTS-bk-geburt-np-geburtsdatum"/>
      </sch:rule>
      <sch:rule context="xga:unterrichtung.0700//bk:geburt[ancestor-or-self::xga:referenzierteSubjekte and ancestor-or-self::xga:natuerlichePerson/np:natuerlichePerson.id = (ancestor::xga:satz/*/xga:gewerbebetrieb//xga:gewerbetreibender.id,&#xA;            ancestor::xga:satz/*/xga:referenzierteSubjekte//gv:gesetzlicherVertreter.id, ancestor::xga:satz/*/xga:referenzierteSubjekte//ges:gesellschafter.id)]">
         <sch:extends rule="rule.SCH-EXISTS-bk-geburt-np-geburtsdatum"/>
      </sch:rule>
   </sch:pattern>
   <sch:pattern>
      <sch:rule id="rule.SCH-EMPTY-xga-Gewerbemeldung-xga-istKorrektur" abstract="true">
         <sch:assert id="SCH-EMPTY-xga-Gewerbemeldung-xga-istKorrektur"
                     test="empty(xga:istKorrektur)">[SCH-EMPTY-xga-Gewerbemeldung-xga-istKorrektur] Das Kindelement xga:istKorrektur darf in diesem Kontext nicht angegeben werden.</sch:assert>
      </sch:rule>
      <sch:rule context="xga:sta.gewerbemeldung.0100//(xga:anmeldung|xga:ummeldung|xga:abmeldung|xga:berichtigung)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-Gewerbemeldung-xga-istKorrektur"/>
      </sch:rule>
      <sch:rule context="xga:ihk.gewerbemeldung.0200//(xga:anmeldung|xga:ummeldung|xga:abmeldung|xga:berichtigung)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-Gewerbemeldung-xga-istKorrektur"/>
      </sch:rule>
      <sch:rule context="xga:hwk.gewerbemeldung.0210//(xga:anmeldung|xga:ummeldung|xga:abmeldung|xga:berichtigung)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-Gewerbemeldung-xga-istKorrektur"/>
      </sch:rule>
      <sch:rule context="xga:ea.gewerbemeldung.0220//(xga:anmeldung|xga:ummeldung|xga:abmeldung|xga:berichtigung)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-Gewerbemeldung-xga-istKorrektur"/>
      </sch:rule>
      <sch:rule context="xga:dgu.gewerbemeldung.0230//(xga:anmeldung|xga:ummeldung|xga:abmeldung|xga:berichtigung)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-Gewerbemeldung-xga-istKorrektur"/>
      </sch:rule>
      <sch:rule context="xga:rg.gewerbemeldung.0240//(xga:anmeldung|xga:ummeldung|xga:abmeldung|xga:berichtigung)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-Gewerbemeldung-xga-istKorrektur"/>
      </sch:rule>
      <sch:rule context="xga:fa.gewerbemeldung.0250//(xga:anmeldung|xga:ummeldung|xga:abmeldung|xga:berichtigung)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-Gewerbemeldung-xga-istKorrektur"/>
      </sch:rule>
      <sch:rule context="xga:zv.gewerbemeldung.0260//(xga:anmeldung|xga:ummeldung|xga:abmeldung|xga:berichtigung)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-Gewerbemeldung-xga-istKorrektur"/>
      </sch:rule>
      <sch:rule context="xga:is.gewerbemeldung.0270//(xga:anmeldung|xga:ummeldung|xga:abmeldung|xga:berichtigung)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-Gewerbemeldung-xga-istKorrektur"/>
      </sch:rule>
      <sch:rule context="xga:as.gewerbemeldung.0280//(xga:anmeldung|xga:ummeldung|xga:abmeldung|xga:berichtigung)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-Gewerbemeldung-xga-istKorrektur"/>
      </sch:rule>
      <sch:rule context="xga:lue.gewerbemeldung.0290//(xga:anmeldung|xga:ummeldung|xga:abmeldung|xga:berichtigung)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-Gewerbemeldung-xga-istKorrektur"/>
      </sch:rule>
      <sch:rule context="xga:ext.gewerbemeldung.0400//(xga:anmeldung|xga:ummeldung|xga:abmeldung|xga:berichtigung)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-Gewerbemeldung-xga-istKorrektur"/>
      </sch:rule>
      <sch:rule context="xga:abh.gewerbemeldung.0500//(xga:anmeldung|xga:ummeldung|xga:abmeldung|xga:berichtigung)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-Gewerbemeldung-xga-istKorrektur"/>
      </sch:rule>
   </sch:pattern>
   <sch:pattern>
      <sch:rule id="rule.SCH-EXISTS-xga-Gewerbemeldung-xga-istKorrektur"
                abstract="true">
         <sch:assert id="SCH-EXISTS-xga-Gewerbemeldung-xga-istKorrektur"
                     test="exists(xga:istKorrektur)">[SCH-EXISTS-xga-Gewerbemeldung-xga-istKorrektur] Das Kindelement xga:istKorrektur muss in diesem Kontext angegeben werden.</sch:assert>
      </sch:rule>
   </sch:pattern>
   <sch:pattern>
      <sch:rule id="rule.SCH-EMPTY-xga-Gewerbemeldung-xga-datumMeldung" abstract="true">
         <sch:assert id="SCH-EMPTY-xga-Gewerbemeldung-xga-datumMeldung"
                     test="empty(xga:datumMeldung)">[SCH-EMPTY-xga-Gewerbemeldung-xga-datumMeldung] Das Kindelement xga:datumMeldung darf in diesem Kontext nicht angegeben werden.</sch:assert>
      </sch:rule>
      <sch:rule context="xga:ea.gewerbemeldung.0220//(xga:anmeldung|xga:ummeldung|xga:abmeldung|xga:berichtigung)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-Gewerbemeldung-xga-datumMeldung"/>
      </sch:rule>
      <sch:rule context="xga:rg.gewerbemeldung.0240//(xga:anmeldung|xga:ummeldung|xga:abmeldung|xga:berichtigung)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-Gewerbemeldung-xga-datumMeldung"/>
      </sch:rule>
   </sch:pattern>
   <sch:pattern>
      <sch:rule id="rule.SCH-EXISTS-xga-Gewerbemeldung-xga-datumMeldung"
                abstract="true">
         <sch:assert id="SCH-EXISTS-xga-Gewerbemeldung-xga-datumMeldung"
                     test="exists(xga:datumMeldung)">[SCH-EXISTS-xga-Gewerbemeldung-xga-datumMeldung] Das Kindelement xga:datumMeldung muss in diesem Kontext angegeben werden.</sch:assert>
      </sch:rule>
      <sch:rule context="xga:sta.gewerbemeldung.0100//(xga:anmeldung|xga:ummeldung|xga:abmeldung|xga:berichtigung)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-EXISTS-xga-Gewerbemeldung-xga-datumMeldung"/>
      </sch:rule>
      <sch:rule context="xga:ihk.gewerbemeldung.0200//(xga:anmeldung|xga:ummeldung|xga:abmeldung|xga:berichtigung)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-EXISTS-xga-Gewerbemeldung-xga-datumMeldung"/>
      </sch:rule>
      <sch:rule context="xga:hwk.gewerbemeldung.0210//(xga:anmeldung|xga:ummeldung|xga:abmeldung|xga:berichtigung)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-EXISTS-xga-Gewerbemeldung-xga-datumMeldung"/>
      </sch:rule>
      <sch:rule context="xga:dgu.gewerbemeldung.0230//(xga:anmeldung|xga:ummeldung|xga:abmeldung|xga:berichtigung)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-EXISTS-xga-Gewerbemeldung-xga-datumMeldung"/>
      </sch:rule>
      <sch:rule context="xga:fa.gewerbemeldung.0250//(xga:anmeldung|xga:ummeldung|xga:abmeldung|xga:berichtigung)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-EXISTS-xga-Gewerbemeldung-xga-datumMeldung"/>
      </sch:rule>
      <sch:rule context="xga:zv.gewerbemeldung.0260//(xga:anmeldung|xga:ummeldung|xga:abmeldung|xga:berichtigung)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-EXISTS-xga-Gewerbemeldung-xga-datumMeldung"/>
      </sch:rule>
      <sch:rule context="xga:is.gewerbemeldung.0270//(xga:anmeldung|xga:ummeldung|xga:abmeldung|xga:berichtigung)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-EXISTS-xga-Gewerbemeldung-xga-datumMeldung"/>
      </sch:rule>
      <sch:rule context="xga:as.gewerbemeldung.0280//(xga:anmeldung|xga:ummeldung|xga:abmeldung|xga:berichtigung)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-EXISTS-xga-Gewerbemeldung-xga-datumMeldung"/>
      </sch:rule>
      <sch:rule context="xga:lue.gewerbemeldung.0290//(xga:anmeldung|xga:ummeldung|xga:abmeldung|xga:berichtigung)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-EXISTS-xga-Gewerbemeldung-xga-datumMeldung"/>
      </sch:rule>
      <sch:rule context="xga:alg.gewerbemeldung.0300//(xga:anmeldung|xga:ummeldung|xga:abmeldung|xga:berichtigung)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-EXISTS-xga-Gewerbemeldung-xga-datumMeldung"/>
      </sch:rule>
      <sch:rule context="xga:ext.gewerbemeldung.0400//(xga:anmeldung|xga:ummeldung|xga:abmeldung|xga:berichtigung)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-EXISTS-xga-Gewerbemeldung-xga-datumMeldung"/>
      </sch:rule>
      <sch:rule context="xga:abh.gewerbemeldung.0500//(xga:anmeldung|xga:ummeldung|xga:abmeldung|xga:berichtigung)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-EXISTS-xga-Gewerbemeldung-xga-datumMeldung"/>
      </sch:rule>
      <sch:rule context="xga:unterrichtung.0700//(xga:anmeldung|xga:ummeldung|xga:abmeldung|xga:berichtigung)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-EXISTS-xga-Gewerbemeldung-xga-datumMeldung"/>
      </sch:rule>
   </sch:pattern>
   <sch:pattern>
      <sch:rule id="rule.SCH-EMPTY-xga-Gewerbemeldung-xga-bisherigeUnfallversicherung"
                abstract="true">
         <sch:assert id="SCH-EMPTY-xga-Gewerbemeldung-xga-bisherigeUnfallversicherung"
                     test="empty(xga:bisherigeUnfallversicherung)">[SCH-EMPTY-xga-Gewerbemeldung-xga-bisherigeUnfallversicherung] Das Kindelement xga:bisherigeUnfallversicherung darf in diesem Kontext nicht angegeben werden.</sch:assert>
      </sch:rule>
      <sch:rule context="xga:sta.gewerbemeldung.0100//(xga:anmeldung|xga:ummeldung|xga:abmeldung|xga:berichtigung)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-Gewerbemeldung-xga-bisherigeUnfallversicherung"/>
      </sch:rule>
      <sch:rule context="xga:ihk.gewerbemeldung.0200//(xga:anmeldung|xga:ummeldung|xga:abmeldung|xga:berichtigung)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-Gewerbemeldung-xga-bisherigeUnfallversicherung"/>
      </sch:rule>
      <sch:rule context="xga:hwk.gewerbemeldung.0210//(xga:anmeldung|xga:ummeldung|xga:abmeldung|xga:berichtigung)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-Gewerbemeldung-xga-bisherigeUnfallversicherung"/>
      </sch:rule>
      <sch:rule context="xga:ea.gewerbemeldung.0220//(xga:anmeldung|xga:ummeldung|xga:abmeldung|xga:berichtigung)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-Gewerbemeldung-xga-bisherigeUnfallversicherung"/>
      </sch:rule>
      <sch:rule context="xga:rg.gewerbemeldung.0240//(xga:anmeldung|xga:ummeldung|xga:abmeldung|xga:berichtigung)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-Gewerbemeldung-xga-bisherigeUnfallversicherung"/>
      </sch:rule>
      <sch:rule context="xga:fa.gewerbemeldung.0250//(xga:anmeldung|xga:ummeldung|xga:abmeldung|xga:berichtigung)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-Gewerbemeldung-xga-bisherigeUnfallversicherung"/>
      </sch:rule>
      <sch:rule context="xga:zv.gewerbemeldung.0260//(xga:anmeldung|xga:ummeldung|xga:abmeldung|xga:berichtigung)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-Gewerbemeldung-xga-bisherigeUnfallversicherung"/>
      </sch:rule>
      <sch:rule context="xga:is.gewerbemeldung.0270//(xga:anmeldung|xga:ummeldung|xga:abmeldung|xga:berichtigung)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-Gewerbemeldung-xga-bisherigeUnfallversicherung"/>
      </sch:rule>
      <sch:rule context="xga:as.gewerbemeldung.0280//(xga:anmeldung|xga:ummeldung|xga:abmeldung|xga:berichtigung)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-Gewerbemeldung-xga-bisherigeUnfallversicherung"/>
      </sch:rule>
      <sch:rule context="xga:lue.gewerbemeldung.0290//(xga:anmeldung|xga:ummeldung|xga:abmeldung|xga:berichtigung)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-Gewerbemeldung-xga-bisherigeUnfallversicherung"/>
      </sch:rule>
      <sch:rule context="xga:abh.gewerbemeldung.0500//(xga:anmeldung|xga:ummeldung|xga:abmeldung|xga:berichtigung)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-Gewerbemeldung-xga-bisherigeUnfallversicherung"/>
      </sch:rule>
   </sch:pattern>
   <sch:pattern>
      <sch:rule id="rule.SCH-EXISTS-xga-Gewerbemeldung-xga-bisherigeUnfallversicherung"
                abstract="true">
         <sch:assert id="SCH-EXISTS-xga-Gewerbemeldung-xga-bisherigeUnfallversicherung"
                     test="exists(xga:bisherigeUnfallversicherung)">[SCH-EXISTS-xga-Gewerbemeldung-xga-bisherigeUnfallversicherung] Das Kindelement xga:bisherigeUnfallversicherung muss in diesem Kontext angegeben werden.</sch:assert>
      </sch:rule>
   </sch:pattern>
   <sch:pattern>
      <sch:rule id="rule.SCH-EMPTY-np-name-np-geburtsname" abstract="true">
         <sch:assert id="SCH-EMPTY-np-name-np-geburtsname" test="empty(np:geburtsname)">[SCH-EMPTY-np-name-np-geburtsname] Das Kindelement np:geburtsname darf in diesem Kontext nicht angegeben werden.</sch:assert>
      </sch:rule>
      <sch:rule context="xga:sta.gewerbemeldung.0100//np:name[ancestor-or-self::xga:referenzierteSubjekte and ancestor-or-self::xga:natuerlichePerson/np:natuerlichePerson.id = (ancestor::xga:satz/*/xga:gewerbebetrieb//xga:gewerbetreibender.id,&#xA;            ancestor::xga:satz/*/xga:referenzierteSubjekte//gv:gesetzlicherVertreter.id, ancestor::xga:satz/*/xga:referenzierteSubjekte//ges:gesellschafter.id)]">
         <sch:extends rule="rule.SCH-EMPTY-np-name-np-geburtsname"/>
      </sch:rule>
      <sch:rule context="xga:ea.gewerbemeldung.0220//np:name[ancestor-or-self::xga:referenzierteSubjekte and ancestor-or-self::xga:natuerlichePerson/np:natuerlichePerson.id = (ancestor::xga:satz/*/xga:gewerbebetrieb//xga:gewerbetreibender.id,&#xA;            ancestor::xga:satz/*/xga:referenzierteSubjekte//gv:gesetzlicherVertreter.id, ancestor::xga:satz/*/xga:referenzierteSubjekte//ges:gesellschafter.id)]">
         <sch:extends rule="rule.SCH-EMPTY-np-name-np-geburtsname"/>
      </sch:rule>
   </sch:pattern>
   <sch:pattern>
      <sch:rule id="rule.SCH-EXISTS-np-name-np-geburtsname" abstract="true">
         <sch:assert id="SCH-EXISTS-np-name-np-geburtsname" test="exists(np:geburtsname)">[SCH-EXISTS-np-name-np-geburtsname] Das Kindelement np:geburtsname muss in diesem Kontext angegeben werden.</sch:assert>
      </sch:rule>
   </sch:pattern>
   <sch:pattern>
      <sch:rule id="rule.SCH-EMPTY-xga-gesellschafter-xga-austrittsdatum"
                abstract="true">
         <sch:assert id="SCH-EMPTY-xga-gesellschafter-xga-austrittsdatum"
                     test="empty(xga:austrittsdatum)">[SCH-EMPTY-xga-gesellschafter-xga-austrittsdatum] Das Kindelement xga:austrittsdatum darf in diesem Kontext nicht angegeben werden.</sch:assert>
      </sch:rule>
      <sch:rule context="xga:sta.gewerbemeldung.0100//xga:gesellschafter[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-gesellschafter-xga-austrittsdatum"/>
      </sch:rule>
      <sch:rule context="xga:ihk.gewerbemeldung.0200//xga:gesellschafter[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-gesellschafter-xga-austrittsdatum"/>
      </sch:rule>
      <sch:rule context="xga:hwk.gewerbemeldung.0210//xga:gesellschafter[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-gesellschafter-xga-austrittsdatum"/>
      </sch:rule>
      <sch:rule context="xga:ea.gewerbemeldung.0220//xga:gesellschafter[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-gesellschafter-xga-austrittsdatum"/>
      </sch:rule>
      <sch:rule context="xga:dgu.gewerbemeldung.0230//xga:gesellschafter[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-gesellschafter-xga-austrittsdatum"/>
      </sch:rule>
      <sch:rule context="xga:rg.gewerbemeldung.0240//xga:gesellschafter[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-gesellschafter-xga-austrittsdatum"/>
      </sch:rule>
      <sch:rule context="xga:fa.gewerbemeldung.0250//xga:gesellschafter[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-gesellschafter-xga-austrittsdatum"/>
      </sch:rule>
      <sch:rule context="xga:zv.gewerbemeldung.0260//xga:gesellschafter[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-gesellschafter-xga-austrittsdatum"/>
      </sch:rule>
      <sch:rule context="xga:is.gewerbemeldung.0270//xga:gesellschafter[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-gesellschafter-xga-austrittsdatum"/>
      </sch:rule>
      <sch:rule context="xga:as.gewerbemeldung.0280//xga:gesellschafter[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-gesellschafter-xga-austrittsdatum"/>
      </sch:rule>
      <sch:rule context="xga:lue.gewerbemeldung.0290//xga:gesellschafter[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-gesellschafter-xga-austrittsdatum"/>
      </sch:rule>
      <sch:rule context="xga:abh.gewerbemeldung.0500//xga:gesellschafter[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-gesellschafter-xga-austrittsdatum"/>
      </sch:rule>
   </sch:pattern>
   <sch:pattern>
      <sch:rule id="rule.SCH-EXISTS-xga-gesellschafter-xga-austrittsdatum"
                abstract="true">
         <sch:assert id="SCH-EXISTS-xga-gesellschafter-xga-austrittsdatum"
                     test="exists(xga:austrittsdatum)">[SCH-EXISTS-xga-gesellschafter-xga-austrittsdatum] Das Kindelement xga:austrittsdatum muss in diesem Kontext angegeben werden.</sch:assert>
      </sch:rule>
   </sch:pattern>
   <sch:pattern>
      <sch:rule id="rule.SCH-EMPTY-xga-gesellschafter-xga-eintrittsdatum"
                abstract="true">
         <sch:assert id="SCH-EMPTY-xga-gesellschafter-xga-eintrittsdatum"
                     test="empty(xga:eintrittsdatum)">[SCH-EMPTY-xga-gesellschafter-xga-eintrittsdatum] Das Kindelement xga:eintrittsdatum darf in diesem Kontext nicht angegeben werden.</sch:assert>
      </sch:rule>
      <sch:rule context="xga:sta.gewerbemeldung.0100//xga:gesellschafter[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-gesellschafter-xga-eintrittsdatum"/>
      </sch:rule>
      <sch:rule context="xga:ihk.gewerbemeldung.0200//xga:gesellschafter[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-gesellschafter-xga-eintrittsdatum"/>
      </sch:rule>
      <sch:rule context="xga:hwk.gewerbemeldung.0210//xga:gesellschafter[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-gesellschafter-xga-eintrittsdatum"/>
      </sch:rule>
      <sch:rule context="xga:ea.gewerbemeldung.0220//xga:gesellschafter[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-gesellschafter-xga-eintrittsdatum"/>
      </sch:rule>
      <sch:rule context="xga:dgu.gewerbemeldung.0230//xga:gesellschafter[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-gesellschafter-xga-eintrittsdatum"/>
      </sch:rule>
      <sch:rule context="xga:rg.gewerbemeldung.0240//xga:gesellschafter[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-gesellschafter-xga-eintrittsdatum"/>
      </sch:rule>
      <sch:rule context="xga:fa.gewerbemeldung.0250//xga:gesellschafter[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-gesellschafter-xga-eintrittsdatum"/>
      </sch:rule>
      <sch:rule context="xga:zv.gewerbemeldung.0260//xga:gesellschafter[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-gesellschafter-xga-eintrittsdatum"/>
      </sch:rule>
      <sch:rule context="xga:is.gewerbemeldung.0270//xga:gesellschafter[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-gesellschafter-xga-eintrittsdatum"/>
      </sch:rule>
      <sch:rule context="xga:as.gewerbemeldung.0280//xga:gesellschafter[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-gesellschafter-xga-eintrittsdatum"/>
      </sch:rule>
      <sch:rule context="xga:lue.gewerbemeldung.0290//xga:gesellschafter[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-gesellschafter-xga-eintrittsdatum"/>
      </sch:rule>
      <sch:rule context="xga:abh.gewerbemeldung.0500//xga:gesellschafter[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-gesellschafter-xga-eintrittsdatum"/>
      </sch:rule>
   </sch:pattern>
   <sch:pattern>
      <sch:rule id="rule.SCH-EXISTS-xga-gesellschafter-xga-eintrittsdatum"
                abstract="true">
         <sch:assert id="SCH-EXISTS-xga-gesellschafter-xga-eintrittsdatum"
                     test="exists(xga:eintrittsdatum)">[SCH-EXISTS-xga-gesellschafter-xga-eintrittsdatum] Das Kindelement xga:eintrittsdatum muss in diesem Kontext angegeben werden.</sch:assert>
      </sch:rule>
   </sch:pattern>
   <sch:pattern>
      <sch:rule id="rule.SCH-EMPTY-xga-gesetzlicherVertreter-xga-austrittsdatum"
                abstract="true">
         <sch:assert id="SCH-EMPTY-xga-gesetzlicherVertreter-xga-austrittsdatum"
                     test="empty(xga:austrittsdatum)">[SCH-EMPTY-xga-gesetzlicherVertreter-xga-austrittsdatum] Das Kindelement xga:austrittsdatum darf in diesem Kontext nicht angegeben werden.</sch:assert>
      </sch:rule>
      <sch:rule context="xga:sta.gewerbemeldung.0100//xga:gesetzlicherVertreter[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-gesetzlicherVertreter-xga-austrittsdatum"/>
      </sch:rule>
      <sch:rule context="xga:ihk.gewerbemeldung.0200//xga:gesetzlicherVertreter[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-gesetzlicherVertreter-xga-austrittsdatum"/>
      </sch:rule>
      <sch:rule context="xga:hwk.gewerbemeldung.0210//xga:gesetzlicherVertreter[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-gesetzlicherVertreter-xga-austrittsdatum"/>
      </sch:rule>
      <sch:rule context="xga:ea.gewerbemeldung.0220//xga:gesetzlicherVertreter[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-gesetzlicherVertreter-xga-austrittsdatum"/>
      </sch:rule>
      <sch:rule context="xga:dgu.gewerbemeldung.0230//xga:gesetzlicherVertreter[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-gesetzlicherVertreter-xga-austrittsdatum"/>
      </sch:rule>
      <sch:rule context="xga:rg.gewerbemeldung.0240//xga:gesetzlicherVertreter[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-gesetzlicherVertreter-xga-austrittsdatum"/>
      </sch:rule>
      <sch:rule context="xga:fa.gewerbemeldung.0250//xga:gesetzlicherVertreter[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-gesetzlicherVertreter-xga-austrittsdatum"/>
      </sch:rule>
      <sch:rule context="xga:zv.gewerbemeldung.0260//xga:gesetzlicherVertreter[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-gesetzlicherVertreter-xga-austrittsdatum"/>
      </sch:rule>
      <sch:rule context="xga:is.gewerbemeldung.0270//xga:gesetzlicherVertreter[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-gesetzlicherVertreter-xga-austrittsdatum"/>
      </sch:rule>
      <sch:rule context="xga:as.gewerbemeldung.0280//xga:gesetzlicherVertreter[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-gesetzlicherVertreter-xga-austrittsdatum"/>
      </sch:rule>
      <sch:rule context="xga:lue.gewerbemeldung.0290//xga:gesetzlicherVertreter[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-gesetzlicherVertreter-xga-austrittsdatum"/>
      </sch:rule>
      <sch:rule context="xga:abh.gewerbemeldung.0500//xga:gesetzlicherVertreter[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-gesetzlicherVertreter-xga-austrittsdatum"/>
      </sch:rule>
   </sch:pattern>
   <sch:pattern>
      <sch:rule id="rule.SCH-EXISTS-xga-gesetzlicherVertreter-xga-austrittsdatum"
                abstract="true">
         <sch:assert id="SCH-EXISTS-xga-gesetzlicherVertreter-xga-austrittsdatum"
                     test="exists(xga:austrittsdatum)">[SCH-EXISTS-xga-gesetzlicherVertreter-xga-austrittsdatum] Das Kindelement xga:austrittsdatum muss in diesem Kontext angegeben werden.</sch:assert>
      </sch:rule>
   </sch:pattern>
   <sch:pattern>
      <sch:rule id="rule.SCH-EMPTY-xga-gesetzlicherVertreter-xga-eintrittsdatum"
                abstract="true">
         <sch:assert id="SCH-EMPTY-xga-gesetzlicherVertreter-xga-eintrittsdatum"
                     test="empty(xga:eintrittsdatum)">[SCH-EMPTY-xga-gesetzlicherVertreter-xga-eintrittsdatum] Das Kindelement xga:eintrittsdatum darf in diesem Kontext nicht angegeben werden.</sch:assert>
      </sch:rule>
      <sch:rule context="xga:sta.gewerbemeldung.0100//xga:gesetzlicherVertreter[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-gesetzlicherVertreter-xga-eintrittsdatum"/>
      </sch:rule>
      <sch:rule context="xga:ihk.gewerbemeldung.0200//xga:gesetzlicherVertreter[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-gesetzlicherVertreter-xga-eintrittsdatum"/>
      </sch:rule>
      <sch:rule context="xga:hwk.gewerbemeldung.0210//xga:gesetzlicherVertreter[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-gesetzlicherVertreter-xga-eintrittsdatum"/>
      </sch:rule>
      <sch:rule context="xga:ea.gewerbemeldung.0220//xga:gesetzlicherVertreter[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-gesetzlicherVertreter-xga-eintrittsdatum"/>
      </sch:rule>
      <sch:rule context="xga:dgu.gewerbemeldung.0230//xga:gesetzlicherVertreter[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-gesetzlicherVertreter-xga-eintrittsdatum"/>
      </sch:rule>
      <sch:rule context="xga:rg.gewerbemeldung.0240//xga:gesetzlicherVertreter[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-gesetzlicherVertreter-xga-eintrittsdatum"/>
      </sch:rule>
      <sch:rule context="xga:fa.gewerbemeldung.0250//xga:gesetzlicherVertreter[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-gesetzlicherVertreter-xga-eintrittsdatum"/>
      </sch:rule>
      <sch:rule context="xga:zv.gewerbemeldung.0260//xga:gesetzlicherVertreter[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-gesetzlicherVertreter-xga-eintrittsdatum"/>
      </sch:rule>
      <sch:rule context="xga:is.gewerbemeldung.0270//xga:gesetzlicherVertreter[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-gesetzlicherVertreter-xga-eintrittsdatum"/>
      </sch:rule>
      <sch:rule context="xga:as.gewerbemeldung.0280//xga:gesetzlicherVertreter[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-gesetzlicherVertreter-xga-eintrittsdatum"/>
      </sch:rule>
      <sch:rule context="xga:lue.gewerbemeldung.0290//xga:gesetzlicherVertreter[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-gesetzlicherVertreter-xga-eintrittsdatum"/>
      </sch:rule>
      <sch:rule context="xga:abh.gewerbemeldung.0500//xga:gesetzlicherVertreter[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-gesetzlicherVertreter-xga-eintrittsdatum"/>
      </sch:rule>
   </sch:pattern>
   <sch:pattern>
      <sch:rule id="rule.SCH-EXISTS-xga-gesetzlicherVertreter-xga-eintrittsdatum"
                abstract="true">
         <sch:assert id="SCH-EXISTS-xga-gesetzlicherVertreter-xga-eintrittsdatum"
                     test="exists(xga:eintrittsdatum)">[SCH-EXISTS-xga-gesetzlicherVertreter-xga-eintrittsdatum] Das Kindelement xga:eintrittsdatum muss in diesem Kontext angegeben werden.</sch:assert>
      </sch:rule>
   </sch:pattern>
   <sch:pattern>
      <sch:rule id="rule.SCH-EMPTY-xga-gewerbebetrieb-xga-abweichendeHauptniederlassung"
                abstract="true">
         <sch:assert id="SCH-EMPTY-xga-gewerbebetrieb-xga-abweichendeHauptniederlassung"
                     test="empty(xga:abweichendeHauptniederlassung)">[SCH-EMPTY-xga-gewerbebetrieb-xga-abweichendeHauptniederlassung] Das Kindelement xga:abweichendeHauptniederlassung darf in diesem Kontext nicht angegeben werden.</sch:assert>
      </sch:rule>
      <sch:rule context="xga:ea.gewerbemeldung.0220//xga:gewerbebetrieb[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-gewerbebetrieb-xga-abweichendeHauptniederlassung"/>
      </sch:rule>
   </sch:pattern>
   <sch:pattern>
      <sch:rule id="rule.SCH-EXISTS-xga-gewerbebetrieb-xga-abweichendeHauptniederlassung"
                abstract="true">
         <sch:assert id="SCH-EXISTS-xga-gewerbebetrieb-xga-abweichendeHauptniederlassung"
                     test="exists(xga:abweichendeHauptniederlassung)">[SCH-EXISTS-xga-gewerbebetrieb-xga-abweichendeHauptniederlassung] Das Kindelement xga:abweichendeHauptniederlassung muss in diesem Kontext angegeben werden.</sch:assert>
      </sch:rule>
   </sch:pattern>
   <sch:pattern>
      <sch:rule id="rule.SCH-EMPTY-xga-gewerbebetrieb-xga-anzahlTeilzeitBeschaeftigte"
                abstract="true">
         <sch:assert id="SCH-EMPTY-xga-gewerbebetrieb-xga-anzahlTeilzeitBeschaeftigte"
                     test="empty(xga:anzahlTeilzeitBeschaeftigte)">[SCH-EMPTY-xga-gewerbebetrieb-xga-anzahlTeilzeitBeschaeftigte] Das Kindelement xga:anzahlTeilzeitBeschaeftigte darf in diesem Kontext nicht angegeben werden.</sch:assert>
      </sch:rule>
      <sch:rule context="xga:ea.gewerbemeldung.0220//xga:gewerbebetrieb[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-gewerbebetrieb-xga-anzahlTeilzeitBeschaeftigte"/>
      </sch:rule>
      <sch:rule context="xga:rg.gewerbemeldung.0240//xga:gewerbebetrieb[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-gewerbebetrieb-xga-anzahlTeilzeitBeschaeftigte"/>
      </sch:rule>
      <sch:rule context="xga:fa.gewerbemeldung.0250//xga:gewerbebetrieb[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-gewerbebetrieb-xga-anzahlTeilzeitBeschaeftigte"/>
      </sch:rule>
      <sch:rule context="xga:abh.gewerbemeldung.0500//xga:gewerbebetrieb[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-gewerbebetrieb-xga-anzahlTeilzeitBeschaeftigte"/>
      </sch:rule>
   </sch:pattern>
   <sch:pattern>
      <sch:rule id="rule.SCH-EXISTS-xga-gewerbebetrieb-xga-anzahlTeilzeitBeschaeftigte"
                abstract="true">
         <sch:assert id="SCH-EXISTS-xga-gewerbebetrieb-xga-anzahlTeilzeitBeschaeftigte"
                     test="exists(xga:anzahlTeilzeitBeschaeftigte)">[SCH-EXISTS-xga-gewerbebetrieb-xga-anzahlTeilzeitBeschaeftigte] Das Kindelement xga:anzahlTeilzeitBeschaeftigte muss in diesem Kontext angegeben werden.</sch:assert>
      </sch:rule>
      <sch:rule context="xga:sta.gewerbemeldung.0100//xga:gewerbebetrieb[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-EXISTS-xga-gewerbebetrieb-xga-anzahlTeilzeitBeschaeftigte"/>
      </sch:rule>
      <sch:rule context="xga:ihk.gewerbemeldung.0200//xga:gewerbebetrieb[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-EXISTS-xga-gewerbebetrieb-xga-anzahlTeilzeitBeschaeftigte"/>
      </sch:rule>
      <sch:rule context="xga:hwk.gewerbemeldung.0210//xga:gewerbebetrieb[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-EXISTS-xga-gewerbebetrieb-xga-anzahlTeilzeitBeschaeftigte"/>
      </sch:rule>
      <sch:rule context="xga:dgu.gewerbemeldung.0230//xga:gewerbebetrieb[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-EXISTS-xga-gewerbebetrieb-xga-anzahlTeilzeitBeschaeftigte"/>
      </sch:rule>
      <sch:rule context="xga:zv.gewerbemeldung.0260//xga:gewerbebetrieb[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-EXISTS-xga-gewerbebetrieb-xga-anzahlTeilzeitBeschaeftigte"/>
      </sch:rule>
      <sch:rule context="xga:is.gewerbemeldung.0270//xga:gewerbebetrieb[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-EXISTS-xga-gewerbebetrieb-xga-anzahlTeilzeitBeschaeftigte"/>
      </sch:rule>
      <sch:rule context="xga:as.gewerbemeldung.0280//xga:gewerbebetrieb[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-EXISTS-xga-gewerbebetrieb-xga-anzahlTeilzeitBeschaeftigte"/>
      </sch:rule>
      <sch:rule context="xga:lue.gewerbemeldung.0290//xga:gewerbebetrieb[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-EXISTS-xga-gewerbebetrieb-xga-anzahlTeilzeitBeschaeftigte"/>
      </sch:rule>
      <sch:rule context="xga:alg.gewerbemeldung.0300//xga:gewerbebetrieb[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-EXISTS-xga-gewerbebetrieb-xga-anzahlTeilzeitBeschaeftigte"/>
      </sch:rule>
      <sch:rule context="xga:ext.gewerbemeldung.0400//xga:gewerbebetrieb[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-EXISTS-xga-gewerbebetrieb-xga-anzahlTeilzeitBeschaeftigte"/>
      </sch:rule>
      <sch:rule context="xga:unterrichtung.0700//xga:gewerbebetrieb[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-EXISTS-xga-gewerbebetrieb-xga-anzahlTeilzeitBeschaeftigte"/>
      </sch:rule>
   </sch:pattern>
   <sch:pattern>
      <sch:rule id="rule.SCH-EMPTY-xga-gewerbebetrieb-xga-anzahlVollzeitBeschaeftigte"
                abstract="true">
         <sch:assert id="SCH-EMPTY-xga-gewerbebetrieb-xga-anzahlVollzeitBeschaeftigte"
                     test="empty(xga:anzahlVollzeitBeschaeftigte)">[SCH-EMPTY-xga-gewerbebetrieb-xga-anzahlVollzeitBeschaeftigte] Das Kindelement xga:anzahlVollzeitBeschaeftigte darf in diesem Kontext nicht angegeben werden.</sch:assert>
      </sch:rule>
      <sch:rule context="xga:ea.gewerbemeldung.0220//xga:gewerbebetrieb[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-gewerbebetrieb-xga-anzahlVollzeitBeschaeftigte"/>
      </sch:rule>
      <sch:rule context="xga:rg.gewerbemeldung.0240//xga:gewerbebetrieb[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-gewerbebetrieb-xga-anzahlVollzeitBeschaeftigte"/>
      </sch:rule>
      <sch:rule context="xga:fa.gewerbemeldung.0250//xga:gewerbebetrieb[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-gewerbebetrieb-xga-anzahlVollzeitBeschaeftigte"/>
      </sch:rule>
      <sch:rule context="xga:abh.gewerbemeldung.0500//xga:gewerbebetrieb[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-gewerbebetrieb-xga-anzahlVollzeitBeschaeftigte"/>
      </sch:rule>
   </sch:pattern>
   <sch:pattern>
      <sch:rule id="rule.SCH-EXISTS-xga-gewerbebetrieb-xga-anzahlVollzeitBeschaeftigte"
                abstract="true">
         <sch:assert id="SCH-EXISTS-xga-gewerbebetrieb-xga-anzahlVollzeitBeschaeftigte"
                     test="exists(xga:anzahlVollzeitBeschaeftigte)">[SCH-EXISTS-xga-gewerbebetrieb-xga-anzahlVollzeitBeschaeftigte] Das Kindelement xga:anzahlVollzeitBeschaeftigte muss in diesem Kontext angegeben werden.</sch:assert>
      </sch:rule>
      <sch:rule context="xga:sta.gewerbemeldung.0100//xga:gewerbebetrieb[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-EXISTS-xga-gewerbebetrieb-xga-anzahlVollzeitBeschaeftigte"/>
      </sch:rule>
      <sch:rule context="xga:ihk.gewerbemeldung.0200//xga:gewerbebetrieb[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-EXISTS-xga-gewerbebetrieb-xga-anzahlVollzeitBeschaeftigte"/>
      </sch:rule>
      <sch:rule context="xga:hwk.gewerbemeldung.0210//xga:gewerbebetrieb[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-EXISTS-xga-gewerbebetrieb-xga-anzahlVollzeitBeschaeftigte"/>
      </sch:rule>
      <sch:rule context="xga:dgu.gewerbemeldung.0230//xga:gewerbebetrieb[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-EXISTS-xga-gewerbebetrieb-xga-anzahlVollzeitBeschaeftigte"/>
      </sch:rule>
      <sch:rule context="xga:zv.gewerbemeldung.0260//xga:gewerbebetrieb[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-EXISTS-xga-gewerbebetrieb-xga-anzahlVollzeitBeschaeftigte"/>
      </sch:rule>
      <sch:rule context="xga:is.gewerbemeldung.0270//xga:gewerbebetrieb[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-EXISTS-xga-gewerbebetrieb-xga-anzahlVollzeitBeschaeftigte"/>
      </sch:rule>
      <sch:rule context="xga:as.gewerbemeldung.0280//xga:gewerbebetrieb[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-EXISTS-xga-gewerbebetrieb-xga-anzahlVollzeitBeschaeftigte"/>
      </sch:rule>
      <sch:rule context="xga:lue.gewerbemeldung.0290//xga:gewerbebetrieb[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-EXISTS-xga-gewerbebetrieb-xga-anzahlVollzeitBeschaeftigte"/>
      </sch:rule>
      <sch:rule context="xga:alg.gewerbemeldung.0300//xga:gewerbebetrieb[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-EXISTS-xga-gewerbebetrieb-xga-anzahlVollzeitBeschaeftigte"/>
      </sch:rule>
      <sch:rule context="xga:ext.gewerbemeldung.0400//xga:gewerbebetrieb[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-EXISTS-xga-gewerbebetrieb-xga-anzahlVollzeitBeschaeftigte"/>
      </sch:rule>
      <sch:rule context="xga:unterrichtung.0700//xga:gewerbebetrieb[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-EXISTS-xga-gewerbebetrieb-xga-anzahlVollzeitBeschaeftigte"/>
      </sch:rule>
   </sch:pattern>
   <sch:pattern>
      <sch:rule id="rule.SCH-EMPTY-xga-gewerbebetrieb-xga-beteiligungOeffentlicheHand"
                abstract="true">
         <sch:assert id="SCH-EMPTY-xga-gewerbebetrieb-xga-beteiligungOeffentlicheHand"
                     test="empty(xga:beteiligungOeffentlicheHand)">[SCH-EMPTY-xga-gewerbebetrieb-xga-beteiligungOeffentlicheHand] Das Kindelement xga:beteiligungOeffentlicheHand darf in diesem Kontext nicht angegeben werden.</sch:assert>
      </sch:rule>
      <sch:rule context="xga:sta.gewerbemeldung.0100//xga:gewerbebetrieb[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-gewerbebetrieb-xga-beteiligungOeffentlicheHand"/>
      </sch:rule>
      <sch:rule context="xga:ihk.gewerbemeldung.0200//xga:gewerbebetrieb[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-gewerbebetrieb-xga-beteiligungOeffentlicheHand"/>
      </sch:rule>
      <sch:rule context="xga:hwk.gewerbemeldung.0210//xga:gewerbebetrieb[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-gewerbebetrieb-xga-beteiligungOeffentlicheHand"/>
      </sch:rule>
      <sch:rule context="xga:ea.gewerbemeldung.0220//xga:gewerbebetrieb[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-gewerbebetrieb-xga-beteiligungOeffentlicheHand"/>
      </sch:rule>
      <sch:rule context="xga:rg.gewerbemeldung.0240//xga:gewerbebetrieb[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-gewerbebetrieb-xga-beteiligungOeffentlicheHand"/>
      </sch:rule>
      <sch:rule context="xga:fa.gewerbemeldung.0250//xga:gewerbebetrieb[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-gewerbebetrieb-xga-beteiligungOeffentlicheHand"/>
      </sch:rule>
      <sch:rule context="xga:zv.gewerbemeldung.0260//xga:gewerbebetrieb[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-gewerbebetrieb-xga-beteiligungOeffentlicheHand"/>
      </sch:rule>
      <sch:rule context="xga:is.gewerbemeldung.0270//xga:gewerbebetrieb[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-gewerbebetrieb-xga-beteiligungOeffentlicheHand"/>
      </sch:rule>
      <sch:rule context="xga:as.gewerbemeldung.0280//xga:gewerbebetrieb[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-gewerbebetrieb-xga-beteiligungOeffentlicheHand"/>
      </sch:rule>
      <sch:rule context="xga:lue.gewerbemeldung.0290//xga:gewerbebetrieb[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-gewerbebetrieb-xga-beteiligungOeffentlicheHand"/>
      </sch:rule>
      <sch:rule context="xga:abh.gewerbemeldung.0500//xga:gewerbebetrieb[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-gewerbebetrieb-xga-beteiligungOeffentlicheHand"/>
      </sch:rule>
   </sch:pattern>
   <sch:pattern>
      <sch:rule id="rule.SCH-EXISTS-xga-gewerbebetrieb-xga-beteiligungOeffentlicheHand"
                abstract="true">
         <sch:assert id="SCH-EXISTS-xga-gewerbebetrieb-xga-beteiligungOeffentlicheHand"
                     test="exists(xga:beteiligungOeffentlicheHand)">[SCH-EXISTS-xga-gewerbebetrieb-xga-beteiligungOeffentlicheHand] Das Kindelement xga:beteiligungOeffentlicheHand muss in diesem Kontext angegeben werden.</sch:assert>
      </sch:rule>
      <sch:rule context="xga:dgu.gewerbemeldung.0230//xga:gewerbebetrieb[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-EXISTS-xga-gewerbebetrieb-xga-beteiligungOeffentlicheHand"/>
      </sch:rule>
      <sch:rule context="xga:alg.gewerbemeldung.0300//xga:gewerbebetrieb[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-EXISTS-xga-gewerbebetrieb-xga-beteiligungOeffentlicheHand"/>
      </sch:rule>
      <sch:rule context="xga:ext.gewerbemeldung.0400//xga:gewerbebetrieb[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-EXISTS-xga-gewerbebetrieb-xga-beteiligungOeffentlicheHand"/>
      </sch:rule>
      <sch:rule context="xga:unterrichtung.0700//xga:gewerbebetrieb[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-EXISTS-xga-gewerbebetrieb-xga-beteiligungOeffentlicheHand"/>
      </sch:rule>
   </sch:pattern>
   <sch:pattern>
      <sch:rule id="rule.SCH-EMPTY-xga-gewerbebetrieb-xga-betriebArt" abstract="true">
         <sch:assert id="SCH-EMPTY-xga-gewerbebetrieb-xga-betriebArt"
                     test="empty(xga:betriebArt)">[SCH-EMPTY-xga-gewerbebetrieb-xga-betriebArt] Das Kindelement xga:betriebArt darf in diesem Kontext nicht angegeben werden.</sch:assert>
      </sch:rule>
      <sch:rule context="xga:ea.gewerbemeldung.0220//xga:gewerbebetrieb[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-gewerbebetrieb-xga-betriebArt"/>
      </sch:rule>
      <sch:rule context="xga:rg.gewerbemeldung.0240//xga:gewerbebetrieb[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-gewerbebetrieb-xga-betriebArt"/>
      </sch:rule>
      <sch:rule context="xga:fa.gewerbemeldung.0250//xga:gewerbebetrieb[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-gewerbebetrieb-xga-betriebArt"/>
      </sch:rule>
   </sch:pattern>
   <sch:pattern>
      <sch:rule id="rule.SCH-EXISTS-xga-gewerbebetrieb-xga-betriebArt" abstract="true">
         <sch:assert id="SCH-EXISTS-xga-gewerbebetrieb-xga-betriebArt"
                     test="exists(xga:betriebArt)">[SCH-EXISTS-xga-gewerbebetrieb-xga-betriebArt] Das Kindelement xga:betriebArt muss in diesem Kontext angegeben werden.</sch:assert>
      </sch:rule>
   </sch:pattern>
   <sch:pattern>
      <sch:rule id="rule.SCH-EMPTY-xga-gewerbebetrieb-xga-erlaubnis" abstract="true">
         <sch:assert id="SCH-EMPTY-xga-gewerbebetrieb-xga-erlaubnis"
                     test="empty(xga:erlaubnis)">[SCH-EMPTY-xga-gewerbebetrieb-xga-erlaubnis] Das Kindelement xga:erlaubnis darf in diesem Kontext nicht angegeben werden.</sch:assert>
      </sch:rule>
      <sch:rule context="xga:sta.gewerbemeldung.0100//xga:gewerbebetrieb[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-gewerbebetrieb-xga-erlaubnis"/>
      </sch:rule>
      <sch:rule context="xga:ea.gewerbemeldung.0220//xga:gewerbebetrieb[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-gewerbebetrieb-xga-erlaubnis"/>
      </sch:rule>
      <sch:rule context="xga:dgu.gewerbemeldung.0230//xga:gewerbebetrieb[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-gewerbebetrieb-xga-erlaubnis"/>
      </sch:rule>
      <sch:rule context="xga:rg.gewerbemeldung.0240//xga:gewerbebetrieb[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-gewerbebetrieb-xga-erlaubnis"/>
      </sch:rule>
      <sch:rule context="xga:fa.gewerbemeldung.0250//xga:gewerbebetrieb[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-gewerbebetrieb-xga-erlaubnis"/>
      </sch:rule>
      <sch:rule context="xga:is.gewerbemeldung.0270//xga:gewerbebetrieb[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-gewerbebetrieb-xga-erlaubnis"/>
      </sch:rule>
      <sch:rule context="xga:as.gewerbemeldung.0280//xga:gewerbebetrieb[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-gewerbebetrieb-xga-erlaubnis"/>
      </sch:rule>
      <sch:rule context="xga:lue.gewerbemeldung.0290//xga:gewerbebetrieb[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-gewerbebetrieb-xga-erlaubnis"/>
      </sch:rule>
      <sch:rule context="xga:abh.gewerbemeldung.0500//xga:gewerbebetrieb[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-gewerbebetrieb-xga-erlaubnis"/>
      </sch:rule>
   </sch:pattern>
   <sch:pattern>
      <sch:rule id="rule.SCH-EXISTS-xga-gewerbebetrieb-xga-erlaubnis" abstract="true">
         <sch:assert id="SCH-EXISTS-xga-gewerbebetrieb-xga-erlaubnis"
                     test="exists(xga:erlaubnis)">[SCH-EXISTS-xga-gewerbebetrieb-xga-erlaubnis] Das Kindelement xga:erlaubnis muss in diesem Kontext angegeben werden.</sch:assert>
      </sch:rule>
   </sch:pattern>
   <sch:pattern>
      <sch:rule id="rule.SCH-EMPTY-xga-gewerbebetrieb-xga-handwerkskarte"
                abstract="true">
         <sch:assert id="SCH-EMPTY-xga-gewerbebetrieb-xga-handwerkskarte"
                     test="empty(xga:handwerkskarte)">[SCH-EMPTY-xga-gewerbebetrieb-xga-handwerkskarte] Das Kindelement xga:handwerkskarte darf in diesem Kontext nicht angegeben werden.</sch:assert>
      </sch:rule>
      <sch:rule context="xga:ihk.gewerbemeldung.0200//xga:gewerbebetrieb[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-gewerbebetrieb-xga-handwerkskarte"/>
      </sch:rule>
      <sch:rule context="xga:ea.gewerbemeldung.0220//xga:gewerbebetrieb[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-gewerbebetrieb-xga-handwerkskarte"/>
      </sch:rule>
      <sch:rule context="xga:rg.gewerbemeldung.0240//xga:gewerbebetrieb[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-gewerbebetrieb-xga-handwerkskarte"/>
      </sch:rule>
      <sch:rule context="xga:fa.gewerbemeldung.0250//xga:gewerbebetrieb[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-gewerbebetrieb-xga-handwerkskarte"/>
      </sch:rule>
      <sch:rule context="xga:is.gewerbemeldung.0270//xga:gewerbebetrieb[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-gewerbebetrieb-xga-handwerkskarte"/>
      </sch:rule>
      <sch:rule context="xga:as.gewerbemeldung.0280//xga:gewerbebetrieb[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-gewerbebetrieb-xga-handwerkskarte"/>
      </sch:rule>
      <sch:rule context="xga:lue.gewerbemeldung.0290//xga:gewerbebetrieb[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-gewerbebetrieb-xga-handwerkskarte"/>
      </sch:rule>
      <sch:rule context="xga:abh.gewerbemeldung.0500//xga:gewerbebetrieb[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-gewerbebetrieb-xga-handwerkskarte"/>
      </sch:rule>
   </sch:pattern>
   <sch:pattern>
      <sch:rule id="rule.SCH-EXISTS-xga-gewerbebetrieb-xga-handwerkskarte"
                abstract="true">
         <sch:assert id="SCH-EXISTS-xga-gewerbebetrieb-xga-handwerkskarte"
                     test="exists(xga:handwerkskarte)">[SCH-EXISTS-xga-gewerbebetrieb-xga-handwerkskarte] Das Kindelement xga:handwerkskarte muss in diesem Kontext angegeben werden.</sch:assert>
      </sch:rule>
   </sch:pattern>
   <sch:pattern>
      <sch:rule id="rule.SCH-EMPTY-xga-gewerbebetrieb-xga-istNebenerwerb"
                abstract="true">
         <sch:assert id="SCH-EMPTY-xga-gewerbebetrieb-xga-istNebenerwerb"
                     test="empty(xga:istNebenerwerb)">[SCH-EMPTY-xga-gewerbebetrieb-xga-istNebenerwerb] Das Kindelement xga:istNebenerwerb darf in diesem Kontext nicht angegeben werden.</sch:assert>
      </sch:rule>
      <sch:rule context="xga:fa.gewerbemeldung.0250//xga:gewerbebetrieb[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-gewerbebetrieb-xga-istNebenerwerb"/>
      </sch:rule>
      <sch:rule context="xga:abh.gewerbemeldung.0500//xga:gewerbebetrieb[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-gewerbebetrieb-xga-istNebenerwerb"/>
      </sch:rule>
   </sch:pattern>
   <sch:pattern>
      <sch:rule id="rule.SCH-EXISTS-xga-gewerbebetrieb-xga-istNebenerwerb"
                abstract="true">
         <sch:assert id="SCH-EXISTS-xga-gewerbebetrieb-xga-istNebenerwerb"
                     test="exists(xga:istNebenerwerb)">[SCH-EXISTS-xga-gewerbebetrieb-xga-istNebenerwerb] Das Kindelement xga:istNebenerwerb muss in diesem Kontext angegeben werden.</sch:assert>
      </sch:rule>
   </sch:pattern>
   <sch:pattern>
      <sch:rule id="rule.SCH-EMPTY-xga-gewerbebetrieb-xga-istReisegewerbe"
                abstract="true">
         <sch:assert id="SCH-EMPTY-xga-gewerbebetrieb-xga-istReisegewerbe"
                     test="empty(xga:istReisegewerbe)">[SCH-EMPTY-xga-gewerbebetrieb-xga-istReisegewerbe] Das Kindelement xga:istReisegewerbe darf in diesem Kontext nicht angegeben werden.</sch:assert>
      </sch:rule>
      <sch:rule context="xga:ea.gewerbemeldung.0220//xga:gewerbebetrieb[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-gewerbebetrieb-xga-istReisegewerbe"/>
      </sch:rule>
      <sch:rule context="xga:rg.gewerbemeldung.0240//xga:gewerbebetrieb[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-gewerbebetrieb-xga-istReisegewerbe"/>
      </sch:rule>
      <sch:rule context="xga:abh.gewerbemeldung.0500//xga:gewerbebetrieb[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-gewerbebetrieb-xga-istReisegewerbe"/>
      </sch:rule>
   </sch:pattern>
   <sch:pattern>
      <sch:rule id="rule.SCH-EXISTS-xga-gewerbebetrieb-xga-istReisegewerbe"
                abstract="true">
         <sch:assert id="SCH-EXISTS-xga-gewerbebetrieb-xga-istReisegewerbe"
                     test="exists(xga:istReisegewerbe)">[SCH-EXISTS-xga-gewerbebetrieb-xga-istReisegewerbe] Das Kindelement xga:istReisegewerbe muss in diesem Kontext angegeben werden.</sch:assert>
      </sch:rule>
      <sch:rule context="xga:sta.gewerbemeldung.0100//xga:gewerbebetrieb[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-EXISTS-xga-gewerbebetrieb-xga-istReisegewerbe"/>
      </sch:rule>
      <sch:rule context="xga:ihk.gewerbemeldung.0200//xga:gewerbebetrieb[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-EXISTS-xga-gewerbebetrieb-xga-istReisegewerbe"/>
      </sch:rule>
      <sch:rule context="xga:hwk.gewerbemeldung.0210//xga:gewerbebetrieb[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-EXISTS-xga-gewerbebetrieb-xga-istReisegewerbe"/>
      </sch:rule>
      <sch:rule context="xga:dgu.gewerbemeldung.0230//xga:gewerbebetrieb[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-EXISTS-xga-gewerbebetrieb-xga-istReisegewerbe"/>
      </sch:rule>
      <sch:rule context="xga:fa.gewerbemeldung.0250//xga:gewerbebetrieb[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-EXISTS-xga-gewerbebetrieb-xga-istReisegewerbe"/>
      </sch:rule>
      <sch:rule context="xga:zv.gewerbemeldung.0260//xga:gewerbebetrieb[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-EXISTS-xga-gewerbebetrieb-xga-istReisegewerbe"/>
      </sch:rule>
      <sch:rule context="xga:is.gewerbemeldung.0270//xga:gewerbebetrieb[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-EXISTS-xga-gewerbebetrieb-xga-istReisegewerbe"/>
      </sch:rule>
      <sch:rule context="xga:as.gewerbemeldung.0280//xga:gewerbebetrieb[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-EXISTS-xga-gewerbebetrieb-xga-istReisegewerbe"/>
      </sch:rule>
      <sch:rule context="xga:lue.gewerbemeldung.0290//xga:gewerbebetrieb[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-EXISTS-xga-gewerbebetrieb-xga-istReisegewerbe"/>
      </sch:rule>
      <sch:rule context="xga:ext.gewerbemeldung.0400//xga:gewerbebetrieb[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-EXISTS-xga-gewerbebetrieb-xga-istReisegewerbe"/>
      </sch:rule>
   </sch:pattern>
   <sch:pattern>
      <sch:rule id="rule.SCH-EMPTY-xga-gewerbebetrieb-xga-vertretungsberechtigtePerson.id"
                abstract="true">
         <sch:assert id="SCH-EMPTY-xga-gewerbebetrieb-xga-vertretungsberechtigtePerson.id"
                     test="empty(xga:vertretungsberechtigtePerson.id)">[SCH-EMPTY-xga-gewerbebetrieb-xga-vertretungsberechtigtePerson.id] Das Kindelement xga:vertretungsberechtigtePerson.id darf in diesem Kontext nicht angegeben werden.</sch:assert>
      </sch:rule>
      <sch:rule context="xga:sta.gewerbemeldung.0100//xga:gewerbebetrieb[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-gewerbebetrieb-xga-vertretungsberechtigtePerson.id"/>
      </sch:rule>
      <sch:rule context="xga:rg.gewerbemeldung.0240//xga:gewerbebetrieb[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-gewerbebetrieb-xga-vertretungsberechtigtePerson.id"/>
      </sch:rule>
      <sch:rule context="xga:abh.gewerbemeldung.0500//xga:gewerbebetrieb[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-gewerbebetrieb-xga-vertretungsberechtigtePerson.id"/>
      </sch:rule>
   </sch:pattern>
   <sch:pattern>
      <sch:rule id="rule.SCH-EXISTS-xga-gewerbebetrieb-xga-vertretungsberechtigtePerson.id"
                abstract="true">
         <sch:assert id="SCH-EXISTS-xga-gewerbebetrieb-xga-vertretungsberechtigtePerson.id"
                     test="exists(xga:vertretungsberechtigtePerson.id)">[SCH-EXISTS-xga-gewerbebetrieb-xga-vertretungsberechtigtePerson.id] Das Kindelement xga:vertretungsberechtigtePerson.id muss in diesem Kontext angegeben werden.</sch:assert>
      </sch:rule>
   </sch:pattern>
   <sch:pattern>
      <sch:rule id="rule.SCH-EMPTY-xga-gewerbebetrieb-xga-taetigkeitenGesamt"
                abstract="true">
         <sch:assert id="SCH-EMPTY-xga-gewerbebetrieb-xga-taetigkeitenGesamt"
                     test="empty(xga:taetigkeitenGesamt)">[SCH-EMPTY-xga-gewerbebetrieb-xga-taetigkeitenGesamt] Das Kindelement xga:taetigkeitenGesamt darf in diesem Kontext nicht angegeben werden.</sch:assert>
      </sch:rule>
   </sch:pattern>
   <sch:pattern>
      <sch:rule id="rule.SCH-EXISTS-xga-gewerbebetrieb-xga-taetigkeitenGesamt"
                abstract="true">
         <sch:assert id="SCH-EXISTS-xga-gewerbebetrieb-xga-taetigkeitenGesamt"
                     test="exists(xga:taetigkeitenGesamt)">[SCH-EXISTS-xga-gewerbebetrieb-xga-taetigkeitenGesamt] Das Kindelement xga:taetigkeitenGesamt muss in diesem Kontext angegeben werden.</sch:assert>
      </sch:rule>
      <sch:rule context="xga:sta.gewerbemeldung.0100//xga:gewerbebetrieb[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-EXISTS-xga-gewerbebetrieb-xga-taetigkeitenGesamt"/>
      </sch:rule>
      <sch:rule context="xga:ihk.gewerbemeldung.0200//xga:gewerbebetrieb[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-EXISTS-xga-gewerbebetrieb-xga-taetigkeitenGesamt"/>
      </sch:rule>
      <sch:rule context="xga:hwk.gewerbemeldung.0210//xga:gewerbebetrieb[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-EXISTS-xga-gewerbebetrieb-xga-taetigkeitenGesamt"/>
      </sch:rule>
      <sch:rule context="xga:ea.gewerbemeldung.0220//xga:gewerbebetrieb[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-EXISTS-xga-gewerbebetrieb-xga-taetigkeitenGesamt"/>
      </sch:rule>
      <sch:rule context="xga:dgu.gewerbemeldung.0230//xga:gewerbebetrieb[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-EXISTS-xga-gewerbebetrieb-xga-taetigkeitenGesamt"/>
      </sch:rule>
      <sch:rule context="xga:rg.gewerbemeldung.0240//xga:gewerbebetrieb[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-EXISTS-xga-gewerbebetrieb-xga-taetigkeitenGesamt"/>
      </sch:rule>
      <sch:rule context="xga:fa.gewerbemeldung.0250//xga:gewerbebetrieb[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-EXISTS-xga-gewerbebetrieb-xga-taetigkeitenGesamt"/>
      </sch:rule>
      <sch:rule context="xga:zv.gewerbemeldung.0260//xga:gewerbebetrieb[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-EXISTS-xga-gewerbebetrieb-xga-taetigkeitenGesamt"/>
      </sch:rule>
      <sch:rule context="xga:is.gewerbemeldung.0270//xga:gewerbebetrieb[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-EXISTS-xga-gewerbebetrieb-xga-taetigkeitenGesamt"/>
      </sch:rule>
      <sch:rule context="xga:as.gewerbemeldung.0280//xga:gewerbebetrieb[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-EXISTS-xga-gewerbebetrieb-xga-taetigkeitenGesamt"/>
      </sch:rule>
      <sch:rule context="xga:lue.gewerbemeldung.0290//xga:gewerbebetrieb[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-EXISTS-xga-gewerbebetrieb-xga-taetigkeitenGesamt"/>
      </sch:rule>
      <sch:rule context="xga:alg.gewerbemeldung.0300//xga:gewerbebetrieb[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-EXISTS-xga-gewerbebetrieb-xga-taetigkeitenGesamt"/>
      </sch:rule>
      <sch:rule context="xga:ext.gewerbemeldung.0400//xga:gewerbebetrieb[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-EXISTS-xga-gewerbebetrieb-xga-taetigkeitenGesamt"/>
      </sch:rule>
      <sch:rule context="xga:abh.gewerbemeldung.0500//xga:gewerbebetrieb[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-EXISTS-xga-gewerbebetrieb-xga-taetigkeitenGesamt"/>
      </sch:rule>
      <sch:rule context="xga:unterrichtung.0700//xga:gewerbebetrieb[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-EXISTS-xga-gewerbebetrieb-xga-taetigkeitenGesamt"/>
      </sch:rule>
   </sch:pattern>
   <sch:pattern>
      <sch:rule id="rule.SCH-EMPTY-xga-gewerbebetrieb-xga-gewerbebetriebID"
                abstract="true">
         <sch:assert id="SCH-EMPTY-xga-gewerbebetrieb-xga-gewerbebetriebID"
                     test="empty(xga:gewerbebetriebID)">[SCH-EMPTY-xga-gewerbebetrieb-xga-gewerbebetriebID] Das Kindelement xga:gewerbebetriebID darf in diesem Kontext nicht angegeben werden.</sch:assert>
      </sch:rule>
   </sch:pattern>
   <sch:pattern>
      <sch:rule id="rule.SCH-EXISTS-xga-gewerbebetrieb-xga-gewerbebetriebID"
                abstract="true">
         <sch:assert id="SCH-EXISTS-xga-gewerbebetrieb-xga-gewerbebetriebID"
                     test="exists(xga:gewerbebetriebID)">[SCH-EXISTS-xga-gewerbebetrieb-xga-gewerbebetriebID] Das Kindelement xga:gewerbebetriebID muss in diesem Kontext angegeben werden.</sch:assert>
      </sch:rule>
      <sch:rule context="xga:sta.gewerbemeldung.0100//xga:gewerbebetrieb[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-EXISTS-xga-gewerbebetrieb-xga-gewerbebetriebID"/>
      </sch:rule>
      <sch:rule context="xga:ihk.gewerbemeldung.0200//xga:gewerbebetrieb[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-EXISTS-xga-gewerbebetrieb-xga-gewerbebetriebID"/>
      </sch:rule>
      <sch:rule context="xga:hwk.gewerbemeldung.0210//xga:gewerbebetrieb[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-EXISTS-xga-gewerbebetrieb-xga-gewerbebetriebID"/>
      </sch:rule>
      <sch:rule context="xga:ea.gewerbemeldung.0220//xga:gewerbebetrieb[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-EXISTS-xga-gewerbebetrieb-xga-gewerbebetriebID"/>
      </sch:rule>
      <sch:rule context="xga:dgu.gewerbemeldung.0230//xga:gewerbebetrieb[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-EXISTS-xga-gewerbebetrieb-xga-gewerbebetriebID"/>
      </sch:rule>
      <sch:rule context="xga:rg.gewerbemeldung.0240//xga:gewerbebetrieb[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-EXISTS-xga-gewerbebetrieb-xga-gewerbebetriebID"/>
      </sch:rule>
      <sch:rule context="xga:fa.gewerbemeldung.0250//xga:gewerbebetrieb[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-EXISTS-xga-gewerbebetrieb-xga-gewerbebetriebID"/>
      </sch:rule>
      <sch:rule context="xga:zv.gewerbemeldung.0260//xga:gewerbebetrieb[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-EXISTS-xga-gewerbebetrieb-xga-gewerbebetriebID"/>
      </sch:rule>
      <sch:rule context="xga:is.gewerbemeldung.0270//xga:gewerbebetrieb[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-EXISTS-xga-gewerbebetrieb-xga-gewerbebetriebID"/>
      </sch:rule>
      <sch:rule context="xga:as.gewerbemeldung.0280//xga:gewerbebetrieb[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-EXISTS-xga-gewerbebetrieb-xga-gewerbebetriebID"/>
      </sch:rule>
      <sch:rule context="xga:lue.gewerbemeldung.0290//xga:gewerbebetrieb[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-EXISTS-xga-gewerbebetrieb-xga-gewerbebetriebID"/>
      </sch:rule>
      <sch:rule context="xga:alg.gewerbemeldung.0300//xga:gewerbebetrieb[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-EXISTS-xga-gewerbebetrieb-xga-gewerbebetriebID"/>
      </sch:rule>
      <sch:rule context="xga:abh.gewerbemeldung.0500//xga:gewerbebetrieb[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-EXISTS-xga-gewerbebetrieb-xga-gewerbebetriebID"/>
      </sch:rule>
      <sch:rule context="xga:abruf.antwort.0601//xga:gewerbebetrieb[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-EXISTS-xga-gewerbebetrieb-xga-gewerbebetriebID"/>
      </sch:rule>
      <sch:rule context="xga:unterrichtung.0700//xga:gewerbebetrieb[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-EXISTS-xga-gewerbebetrieb-xga-gewerbebetriebID"/>
      </sch:rule>
   </sch:pattern>
   <sch:pattern>
      <sch:rule id="rule.SCH-EMPTY-xga-gewerbebetrieb-xga-gemeindeMeldungNr"
                abstract="true">
         <sch:assert id="SCH-EMPTY-xga-gewerbebetrieb-xga-gemeindeMeldungNr"
                     test="empty(xga:gemeindeMeldungNr)">[SCH-EMPTY-xga-gewerbebetrieb-xga-gemeindeMeldungNr] Das Kindelement xga:gemeindeMeldungNr darf in diesem Kontext nicht angegeben werden.</sch:assert>
      </sch:rule>
   </sch:pattern>
   <sch:pattern>
      <sch:rule id="rule.SCH-EXISTS-xga-gewerbebetrieb-xga-gemeindeMeldungNr"
                abstract="true">
         <sch:assert id="SCH-EXISTS-xga-gewerbebetrieb-xga-gemeindeMeldungNr"
                     test="exists(xga:gemeindeMeldungNr)">[SCH-EXISTS-xga-gewerbebetrieb-xga-gemeindeMeldungNr] Das Kindelement xga:gemeindeMeldungNr muss in diesem Kontext angegeben werden.</sch:assert>
      </sch:rule>
      <sch:rule context="xga:sta.gewerbemeldung.0100//xga:gewerbebetrieb[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-EXISTS-xga-gewerbebetrieb-xga-gemeindeMeldungNr"/>
      </sch:rule>
      <sch:rule context="xga:ihk.gewerbemeldung.0200//xga:gewerbebetrieb[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-EXISTS-xga-gewerbebetrieb-xga-gemeindeMeldungNr"/>
      </sch:rule>
      <sch:rule context="xga:hwk.gewerbemeldung.0210//xga:gewerbebetrieb[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-EXISTS-xga-gewerbebetrieb-xga-gemeindeMeldungNr"/>
      </sch:rule>
      <sch:rule context="xga:ea.gewerbemeldung.0220//xga:gewerbebetrieb[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-EXISTS-xga-gewerbebetrieb-xga-gemeindeMeldungNr"/>
      </sch:rule>
      <sch:rule context="xga:dgu.gewerbemeldung.0230//xga:gewerbebetrieb[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-EXISTS-xga-gewerbebetrieb-xga-gemeindeMeldungNr"/>
      </sch:rule>
      <sch:rule context="xga:rg.gewerbemeldung.0240//xga:gewerbebetrieb[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-EXISTS-xga-gewerbebetrieb-xga-gemeindeMeldungNr"/>
      </sch:rule>
      <sch:rule context="xga:fa.gewerbemeldung.0250//xga:gewerbebetrieb[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-EXISTS-xga-gewerbebetrieb-xga-gemeindeMeldungNr"/>
      </sch:rule>
      <sch:rule context="xga:zv.gewerbemeldung.0260//xga:gewerbebetrieb[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-EXISTS-xga-gewerbebetrieb-xga-gemeindeMeldungNr"/>
      </sch:rule>
      <sch:rule context="xga:is.gewerbemeldung.0270//xga:gewerbebetrieb[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-EXISTS-xga-gewerbebetrieb-xga-gemeindeMeldungNr"/>
      </sch:rule>
      <sch:rule context="xga:as.gewerbemeldung.0280//xga:gewerbebetrieb[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-EXISTS-xga-gewerbebetrieb-xga-gemeindeMeldungNr"/>
      </sch:rule>
      <sch:rule context="xga:lue.gewerbemeldung.0290//xga:gewerbebetrieb[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-EXISTS-xga-gewerbebetrieb-xga-gemeindeMeldungNr"/>
      </sch:rule>
      <sch:rule context="xga:alg.gewerbemeldung.0300//xga:gewerbebetrieb[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-EXISTS-xga-gewerbebetrieb-xga-gemeindeMeldungNr"/>
      </sch:rule>
      <sch:rule context="xga:abh.gewerbemeldung.0500//xga:gewerbebetrieb[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-EXISTS-xga-gewerbebetrieb-xga-gemeindeMeldungNr"/>
      </sch:rule>
      <sch:rule context="xga:abruf.antwort.0601//xga:gewerbebetrieb[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-EXISTS-xga-gewerbebetrieb-xga-gemeindeMeldungNr"/>
      </sch:rule>
      <sch:rule context="xga:unterrichtung.0700//xga:gewerbebetrieb[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-EXISTS-xga-gewerbebetrieb-xga-gemeindeMeldungNr"/>
      </sch:rule>
   </sch:pattern>
   <sch:pattern>
      <sch:rule id="rule.SCH-EMPTY-xga-BetriebsstaetteType-wt-artOrt" abstract="true">
         <sch:assert id="SCH-EMPTY-xga-BetriebsstaetteType-wt-artOrt"
                     test="empty(wt:artOrt)">[SCH-EMPTY-xga-BetriebsstaetteType-wt-artOrt] Das Kindelement wt:artOrt darf in diesem Kontext nicht angegeben werden.</sch:assert>
      </sch:rule>
      <sch:rule context="xga:abh.gewerbemeldung.0500//xga:BetriebsstaetteType[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-BetriebsstaetteType-wt-artOrt"/>
      </sch:rule>
   </sch:pattern>
   <sch:pattern>
      <sch:rule id="rule.SCH-EXISTS-xga-BetriebsstaetteType-wt-artOrt" abstract="true">
         <sch:assert id="SCH-EXISTS-xga-BetriebsstaetteType-wt-artOrt"
                     test="exists(wt:artOrt)">[SCH-EXISTS-xga-BetriebsstaetteType-wt-artOrt] Das Kindelement wt:artOrt muss in diesem Kontext angegeben werden.</sch:assert>
      </sch:rule>
   </sch:pattern>
   <sch:pattern>
      <sch:rule id="rule.SCH-EMPTY-xga-gewerbetreibender-xga-istNebenerwerb"
                abstract="true">
         <sch:assert id="SCH-EMPTY-xga-gewerbetreibender-xga-istNebenerwerb"
                     test="empty(xga:istNebenerwerb)">[SCH-EMPTY-xga-gewerbetreibender-xga-istNebenerwerb] Das Kindelement xga:istNebenerwerb darf in diesem Kontext nicht angegeben werden.</sch:assert>
      </sch:rule>
      <sch:rule context="xga:ea.gewerbemeldung.0220//xga:gewerbetreibender[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-gewerbetreibender-xga-istNebenerwerb"/>
      </sch:rule>
      <sch:rule context="xga:fa.gewerbemeldung.0250//xga:gewerbetreibender[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-gewerbetreibender-xga-istNebenerwerb"/>
      </sch:rule>
      <sch:rule context="xga:abh.gewerbemeldung.0500//xga:gewerbetreibender[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-gewerbetreibender-xga-istNebenerwerb"/>
      </sch:rule>
   </sch:pattern>
   <sch:pattern>
      <sch:rule id="rule.SCH-EXISTS-xga-gewerbetreibender-xga-istNebenerwerb"
                abstract="true">
         <sch:assert id="SCH-EXISTS-xga-gewerbetreibender-xga-istNebenerwerb"
                     test="exists(xga:istNebenerwerb)">[SCH-EXISTS-xga-gewerbetreibender-xga-istNebenerwerb] Das Kindelement xga:istNebenerwerb muss in diesem Kontext angegeben werden.</sch:assert>
      </sch:rule>
   </sch:pattern>
   <sch:pattern>
      <sch:rule id="rule.SCH-EMPTY-xga-natuerlichePerson-np-geschlecht" abstract="true">
         <sch:assert id="SCH-EMPTY-xga-natuerlichePerson-np-geschlecht"
                     test="empty(np:geschlecht)">[SCH-EMPTY-xga-natuerlichePerson-np-geschlecht] Das Kindelement np:geschlecht darf in diesem Kontext nicht angegeben werden.</sch:assert>
      </sch:rule>
      <sch:rule context="xga:ea.gewerbemeldung.0220//xga:natuerlichePerson[ancestor-or-self::xga:referenzierteSubjekte and ancestor-or-self::xga:natuerlichePerson/np:natuerlichePerson.id = (ancestor::xga:satz/*/xga:gewerbebetrieb//xga:gewerbetreibender.id,&#xA;            ancestor::xga:satz/*/xga:referenzierteSubjekte//gv:gesetzlicherVertreter.id, ancestor::xga:satz/*/xga:referenzierteSubjekte//ges:gesellschafter.id)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-natuerlichePerson-np-geschlecht"/>
      </sch:rule>
      <sch:rule context="xga:fa.gewerbemeldung.0250//xga:natuerlichePerson[ancestor-or-self::xga:referenzierteSubjekte and ancestor-or-self::xga:natuerlichePerson/np:natuerlichePerson.id = (ancestor::xga:satz/*/xga:gewerbebetrieb//xga:gewerbetreibender.id,&#xA;            ancestor::xga:satz/*/xga:referenzierteSubjekte//gv:gesetzlicherVertreter.id, ancestor::xga:satz/*/xga:referenzierteSubjekte//ges:gesellschafter.id)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-natuerlichePerson-np-geschlecht"/>
      </sch:rule>
      <sch:rule context="xga:sta.gewerbemeldung.0100//xga:natuerlichePerson[ancestor-or-self::xga:referenzierteSubjekte and ancestor-or-self::xga:natuerlichePerson/np:natuerlichePerson.id =&#xA;            (ancestor::xga:satz/*/xga:gewerbebetrieb/xga:vertretungsberechtigtePerson.id)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-natuerlichePerson-np-geschlecht"/>
      </sch:rule>
      <sch:rule context="xga:ihk.gewerbemeldung.0200//xga:natuerlichePerson[ancestor-or-self::xga:referenzierteSubjekte and ancestor-or-self::xga:natuerlichePerson/np:natuerlichePerson.id =&#xA;            (ancestor::xga:satz/*/xga:gewerbebetrieb/xga:vertretungsberechtigtePerson.id)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-natuerlichePerson-np-geschlecht"/>
      </sch:rule>
      <sch:rule context="xga:hwk.gewerbemeldung.0210//xga:natuerlichePerson[ancestor-or-self::xga:referenzierteSubjekte and ancestor-or-self::xga:natuerlichePerson/np:natuerlichePerson.id =&#xA;            (ancestor::xga:satz/*/xga:gewerbebetrieb/xga:vertretungsberechtigtePerson.id)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-natuerlichePerson-np-geschlecht"/>
      </sch:rule>
      <sch:rule context="xga:ea.gewerbemeldung.0220//xga:natuerlichePerson[ancestor-or-self::xga:referenzierteSubjekte and ancestor-or-self::xga:natuerlichePerson/np:natuerlichePerson.id =&#xA;            (ancestor::xga:satz/*/xga:gewerbebetrieb/xga:vertretungsberechtigtePerson.id)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-natuerlichePerson-np-geschlecht"/>
      </sch:rule>
      <sch:rule context="xga:dgu.gewerbemeldung.0230//xga:natuerlichePerson[ancestor-or-self::xga:referenzierteSubjekte and ancestor-or-self::xga:natuerlichePerson/np:natuerlichePerson.id =&#xA;            (ancestor::xga:satz/*/xga:gewerbebetrieb/xga:vertretungsberechtigtePerson.id)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-natuerlichePerson-np-geschlecht"/>
      </sch:rule>
      <sch:rule context="xga:rg.gewerbemeldung.0240//xga:natuerlichePerson[ancestor-or-self::xga:referenzierteSubjekte and ancestor-or-self::xga:natuerlichePerson/np:natuerlichePerson.id =&#xA;            (ancestor::xga:satz/*/xga:gewerbebetrieb/xga:vertretungsberechtigtePerson.id)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-natuerlichePerson-np-geschlecht"/>
      </sch:rule>
      <sch:rule context="xga:fa.gewerbemeldung.0250//xga:natuerlichePerson[ancestor-or-self::xga:referenzierteSubjekte and ancestor-or-self::xga:natuerlichePerson/np:natuerlichePerson.id =&#xA;            (ancestor::xga:satz/*/xga:gewerbebetrieb/xga:vertretungsberechtigtePerson.id)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-natuerlichePerson-np-geschlecht"/>
      </sch:rule>
      <sch:rule context="xga:zv.gewerbemeldung.0260//xga:natuerlichePerson[ancestor-or-self::xga:referenzierteSubjekte and ancestor-or-self::xga:natuerlichePerson/np:natuerlichePerson.id =&#xA;            (ancestor::xga:satz/*/xga:gewerbebetrieb/xga:vertretungsberechtigtePerson.id)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-natuerlichePerson-np-geschlecht"/>
      </sch:rule>
      <sch:rule context="xga:is.gewerbemeldung.0270//xga:natuerlichePerson[ancestor-or-self::xga:referenzierteSubjekte and ancestor-or-self::xga:natuerlichePerson/np:natuerlichePerson.id =&#xA;            (ancestor::xga:satz/*/xga:gewerbebetrieb/xga:vertretungsberechtigtePerson.id)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-natuerlichePerson-np-geschlecht"/>
      </sch:rule>
      <sch:rule context="xga:as.gewerbemeldung.0280//xga:natuerlichePerson[ancestor-or-self::xga:referenzierteSubjekte and ancestor-or-self::xga:natuerlichePerson/np:natuerlichePerson.id =&#xA;            (ancestor::xga:satz/*/xga:gewerbebetrieb/xga:vertretungsberechtigtePerson.id)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-natuerlichePerson-np-geschlecht"/>
      </sch:rule>
      <sch:rule context="xga:lue.gewerbemeldung.0290//xga:natuerlichePerson[ancestor-or-self::xga:referenzierteSubjekte and ancestor-or-self::xga:natuerlichePerson/np:natuerlichePerson.id =&#xA;            (ancestor::xga:satz/*/xga:gewerbebetrieb/xga:vertretungsberechtigtePerson.id)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-natuerlichePerson-np-geschlecht"/>
      </sch:rule>
      <sch:rule context="xga:alg.gewerbemeldung.0300//xga:natuerlichePerson[ancestor-or-self::xga:referenzierteSubjekte and ancestor-or-self::xga:natuerlichePerson/np:natuerlichePerson.id =&#xA;            (ancestor::xga:satz/*/xga:gewerbebetrieb/xga:vertretungsberechtigtePerson.id)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-natuerlichePerson-np-geschlecht"/>
      </sch:rule>
      <sch:rule context="xga:ext.gewerbemeldung.0400//xga:natuerlichePerson[ancestor-or-self::xga:referenzierteSubjekte and ancestor-or-self::xga:natuerlichePerson/np:natuerlichePerson.id =&#xA;            (ancestor::xga:satz/*/xga:gewerbebetrieb/xga:vertretungsberechtigtePerson.id)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-natuerlichePerson-np-geschlecht"/>
      </sch:rule>
      <sch:rule context="xga:abh.gewerbemeldung.0500//xga:natuerlichePerson[ancestor-or-self::xga:referenzierteSubjekte and ancestor-or-self::xga:natuerlichePerson/np:natuerlichePerson.id =&#xA;            (ancestor::xga:satz/*/xga:gewerbebetrieb/xga:vertretungsberechtigtePerson.id)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-natuerlichePerson-np-geschlecht"/>
      </sch:rule>
      <sch:rule context="xga:abruf.antwort.0601//xga:natuerlichePerson[ancestor-or-self::xga:referenzierteSubjekte and ancestor-or-self::xga:natuerlichePerson/np:natuerlichePerson.id =&#xA;            (ancestor::xga:satz/*/xga:gewerbebetrieb/xga:vertretungsberechtigtePerson.id)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-natuerlichePerson-np-geschlecht"/>
      </sch:rule>
      <sch:rule context="xga:unterrichtung.0700//xga:natuerlichePerson[ancestor-or-self::xga:referenzierteSubjekte and ancestor-or-self::xga:natuerlichePerson/np:natuerlichePerson.id =&#xA;            (ancestor::xga:satz/*/xga:gewerbebetrieb/xga:vertretungsberechtigtePerson.id)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-natuerlichePerson-np-geschlecht"/>
      </sch:rule>
   </sch:pattern>
   <sch:pattern>
      <sch:rule id="rule.SCH-EXISTS-xga-natuerlichePerson-np-geschlecht"
                abstract="true">
         <sch:assert id="SCH-EXISTS-xga-natuerlichePerson-np-geschlecht"
                     test="exists(np:geschlecht)">[SCH-EXISTS-xga-natuerlichePerson-np-geschlecht] Das Kindelement np:geschlecht muss in diesem Kontext angegeben werden.</sch:assert>
      </sch:rule>
      <sch:rule context="xga:sta.gewerbemeldung.0100//xga:natuerlichePerson[ancestor-or-self::xga:referenzierteSubjekte and ancestor-or-self::xga:natuerlichePerson/np:natuerlichePerson.id = (ancestor::xga:satz/*/xga:gewerbebetrieb//xga:gewerbetreibender.id,&#xA;            ancestor::xga:satz/*/xga:referenzierteSubjekte//gv:gesetzlicherVertreter.id, ancestor::xga:satz/*/xga:referenzierteSubjekte//ges:gesellschafter.id)]">
         <sch:extends rule="rule.SCH-EXISTS-xga-natuerlichePerson-np-geschlecht"/>
      </sch:rule>
      <sch:rule context="xga:ihk.gewerbemeldung.0200//xga:natuerlichePerson[ancestor-or-self::xga:referenzierteSubjekte and ancestor-or-self::xga:natuerlichePerson/np:natuerlichePerson.id = (ancestor::xga:satz/*/xga:gewerbebetrieb//xga:gewerbetreibender.id,&#xA;            ancestor::xga:satz/*/xga:referenzierteSubjekte//gv:gesetzlicherVertreter.id, ancestor::xga:satz/*/xga:referenzierteSubjekte//ges:gesellschafter.id)]">
         <sch:extends rule="rule.SCH-EXISTS-xga-natuerlichePerson-np-geschlecht"/>
      </sch:rule>
      <sch:rule context="xga:hwk.gewerbemeldung.0210//xga:natuerlichePerson[ancestor-or-self::xga:referenzierteSubjekte and ancestor-or-self::xga:natuerlichePerson/np:natuerlichePerson.id = (ancestor::xga:satz/*/xga:gewerbebetrieb//xga:gewerbetreibender.id,&#xA;            ancestor::xga:satz/*/xga:referenzierteSubjekte//gv:gesetzlicherVertreter.id, ancestor::xga:satz/*/xga:referenzierteSubjekte//ges:gesellschafter.id)]">
         <sch:extends rule="rule.SCH-EXISTS-xga-natuerlichePerson-np-geschlecht"/>
      </sch:rule>
      <sch:rule context="xga:dgu.gewerbemeldung.0230//xga:natuerlichePerson[ancestor-or-self::xga:referenzierteSubjekte and ancestor-or-self::xga:natuerlichePerson/np:natuerlichePerson.id = (ancestor::xga:satz/*/xga:gewerbebetrieb//xga:gewerbetreibender.id,&#xA;            ancestor::xga:satz/*/xga:referenzierteSubjekte//gv:gesetzlicherVertreter.id, ancestor::xga:satz/*/xga:referenzierteSubjekte//ges:gesellschafter.id)]">
         <sch:extends rule="rule.SCH-EXISTS-xga-natuerlichePerson-np-geschlecht"/>
      </sch:rule>
      <sch:rule context="xga:rg.gewerbemeldung.0240//xga:natuerlichePerson[ancestor-or-self::xga:referenzierteSubjekte and ancestor-or-self::xga:natuerlichePerson/np:natuerlichePerson.id = (ancestor::xga:satz/*/xga:gewerbebetrieb//xga:gewerbetreibender.id,&#xA;            ancestor::xga:satz/*/xga:referenzierteSubjekte//gv:gesetzlicherVertreter.id, ancestor::xga:satz/*/xga:referenzierteSubjekte//ges:gesellschafter.id)]">
         <sch:extends rule="rule.SCH-EXISTS-xga-natuerlichePerson-np-geschlecht"/>
      </sch:rule>
      <sch:rule context="xga:zv.gewerbemeldung.0260//xga:natuerlichePerson[ancestor-or-self::xga:referenzierteSubjekte and ancestor-or-self::xga:natuerlichePerson/np:natuerlichePerson.id = (ancestor::xga:satz/*/xga:gewerbebetrieb//xga:gewerbetreibender.id,&#xA;            ancestor::xga:satz/*/xga:referenzierteSubjekte//gv:gesetzlicherVertreter.id, ancestor::xga:satz/*/xga:referenzierteSubjekte//ges:gesellschafter.id)]">
         <sch:extends rule="rule.SCH-EXISTS-xga-natuerlichePerson-np-geschlecht"/>
      </sch:rule>
      <sch:rule context="xga:is.gewerbemeldung.0270//xga:natuerlichePerson[ancestor-or-self::xga:referenzierteSubjekte and ancestor-or-self::xga:natuerlichePerson/np:natuerlichePerson.id = (ancestor::xga:satz/*/xga:gewerbebetrieb//xga:gewerbetreibender.id,&#xA;            ancestor::xga:satz/*/xga:referenzierteSubjekte//gv:gesetzlicherVertreter.id, ancestor::xga:satz/*/xga:referenzierteSubjekte//ges:gesellschafter.id)]">
         <sch:extends rule="rule.SCH-EXISTS-xga-natuerlichePerson-np-geschlecht"/>
      </sch:rule>
      <sch:rule context="xga:as.gewerbemeldung.0280//xga:natuerlichePerson[ancestor-or-self::xga:referenzierteSubjekte and ancestor-or-self::xga:natuerlichePerson/np:natuerlichePerson.id = (ancestor::xga:satz/*/xga:gewerbebetrieb//xga:gewerbetreibender.id,&#xA;            ancestor::xga:satz/*/xga:referenzierteSubjekte//gv:gesetzlicherVertreter.id, ancestor::xga:satz/*/xga:referenzierteSubjekte//ges:gesellschafter.id)]">
         <sch:extends rule="rule.SCH-EXISTS-xga-natuerlichePerson-np-geschlecht"/>
      </sch:rule>
      <sch:rule context="xga:lue.gewerbemeldung.0290//xga:natuerlichePerson[ancestor-or-self::xga:referenzierteSubjekte and ancestor-or-self::xga:natuerlichePerson/np:natuerlichePerson.id = (ancestor::xga:satz/*/xga:gewerbebetrieb//xga:gewerbetreibender.id,&#xA;            ancestor::xga:satz/*/xga:referenzierteSubjekte//gv:gesetzlicherVertreter.id, ancestor::xga:satz/*/xga:referenzierteSubjekte//ges:gesellschafter.id)]">
         <sch:extends rule="rule.SCH-EXISTS-xga-natuerlichePerson-np-geschlecht"/>
      </sch:rule>
      <sch:rule context="xga:alg.gewerbemeldung.0300//xga:natuerlichePerson[ancestor-or-self::xga:referenzierteSubjekte and ancestor-or-self::xga:natuerlichePerson/np:natuerlichePerson.id = (ancestor::xga:satz/*/xga:gewerbebetrieb//xga:gewerbetreibender.id,&#xA;            ancestor::xga:satz/*/xga:referenzierteSubjekte//gv:gesetzlicherVertreter.id, ancestor::xga:satz/*/xga:referenzierteSubjekte//ges:gesellschafter.id)]">
         <sch:extends rule="rule.SCH-EXISTS-xga-natuerlichePerson-np-geschlecht"/>
      </sch:rule>
      <sch:rule context="xga:ext.gewerbemeldung.0400//xga:natuerlichePerson[ancestor-or-self::xga:referenzierteSubjekte and ancestor-or-self::xga:natuerlichePerson/np:natuerlichePerson.id = (ancestor::xga:satz/*/xga:gewerbebetrieb//xga:gewerbetreibender.id,&#xA;            ancestor::xga:satz/*/xga:referenzierteSubjekte//gv:gesetzlicherVertreter.id, ancestor::xga:satz/*/xga:referenzierteSubjekte//ges:gesellschafter.id)]">
         <sch:extends rule="rule.SCH-EXISTS-xga-natuerlichePerson-np-geschlecht"/>
      </sch:rule>
      <sch:rule context="xga:abh.gewerbemeldung.0500//xga:natuerlichePerson[ancestor-or-self::xga:referenzierteSubjekte and ancestor-or-self::xga:natuerlichePerson/np:natuerlichePerson.id = (ancestor::xga:satz/*/xga:gewerbebetrieb//xga:gewerbetreibender.id,&#xA;            ancestor::xga:satz/*/xga:referenzierteSubjekte//gv:gesetzlicherVertreter.id, ancestor::xga:satz/*/xga:referenzierteSubjekte//ges:gesellschafter.id)]">
         <sch:extends rule="rule.SCH-EXISTS-xga-natuerlichePerson-np-geschlecht"/>
      </sch:rule>
      <sch:rule context="xga:abruf.antwort.0601//xga:natuerlichePerson[ancestor-or-self::xga:referenzierteSubjekte and ancestor-or-self::xga:natuerlichePerson/np:natuerlichePerson.id = (ancestor::xga:satz/*/xga:gewerbebetrieb//xga:gewerbetreibender.id,&#xA;            ancestor::xga:satz/*/xga:referenzierteSubjekte//gv:gesetzlicherVertreter.id, ancestor::xga:satz/*/xga:referenzierteSubjekte//ges:gesellschafter.id)]">
         <sch:extends rule="rule.SCH-EXISTS-xga-natuerlichePerson-np-geschlecht"/>
      </sch:rule>
      <sch:rule context="xga:unterrichtung.0700//xga:natuerlichePerson[ancestor-or-self::xga:referenzierteSubjekte and ancestor-or-self::xga:natuerlichePerson/np:natuerlichePerson.id = (ancestor::xga:satz/*/xga:gewerbebetrieb//xga:gewerbetreibender.id,&#xA;            ancestor::xga:satz/*/xga:referenzierteSubjekte//gv:gesetzlicherVertreter.id, ancestor::xga:satz/*/xga:referenzierteSubjekte//ges:gesellschafter.id)]">
         <sch:extends rule="rule.SCH-EXISTS-xga-natuerlichePerson-np-geschlecht"/>
      </sch:rule>
   </sch:pattern>
   <sch:pattern>
      <sch:rule id="rule.SCH-EMPTY-xga-natuerlichePerson-bk-geburt" abstract="true">
         <sch:assert id="SCH-EMPTY-xga-natuerlichePerson-bk-geburt" test="empty(bk:geburt)">[SCH-EMPTY-xga-natuerlichePerson-bk-geburt] Das Kindelement bk:geburt darf in diesem Kontext nicht angegeben werden.</sch:assert>
      </sch:rule>
      <sch:rule context="xga:sta.gewerbemeldung.0100//xga:natuerlichePerson[ancestor-or-self::xga:referenzierteSubjekte and ancestor-or-self::xga:natuerlichePerson/np:natuerlichePerson.id = (ancestor::xga:satz/*/xga:gewerbebetrieb//xga:gewerbetreibender.id,&#xA;            ancestor::xga:satz/*/xga:referenzierteSubjekte//gv:gesetzlicherVertreter.id, ancestor::xga:satz/*/xga:referenzierteSubjekte//ges:gesellschafter.id)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-natuerlichePerson-bk-geburt"/>
      </sch:rule>
      <sch:rule context="xga:ea.gewerbemeldung.0220//xga:natuerlichePerson[ancestor-or-self::xga:referenzierteSubjekte and ancestor-or-self::xga:natuerlichePerson/np:natuerlichePerson.id = (ancestor::xga:satz/*/xga:gewerbebetrieb//xga:gewerbetreibender.id,&#xA;            ancestor::xga:satz/*/xga:referenzierteSubjekte//gv:gesetzlicherVertreter.id, ancestor::xga:satz/*/xga:referenzierteSubjekte//ges:gesellschafter.id)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-natuerlichePerson-bk-geburt"/>
      </sch:rule>
      <sch:rule context="xga:rg.gewerbemeldung.0240//xga:natuerlichePerson[ancestor-or-self::xga:referenzierteSubjekte and ancestor-or-self::xga:natuerlichePerson/np:natuerlichePerson.id = (ancestor::xga:satz/*/xga:gewerbebetrieb//xga:gewerbetreibender.id,&#xA;            ancestor::xga:satz/*/xga:referenzierteSubjekte//gv:gesetzlicherVertreter.id, ancestor::xga:satz/*/xga:referenzierteSubjekte//ges:gesellschafter.id)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-natuerlichePerson-bk-geburt"/>
      </sch:rule>
      <sch:rule context="xga:sta.gewerbemeldung.0100//xga:natuerlichePerson[ancestor-or-self::xga:referenzierteSubjekte and ancestor-or-self::xga:natuerlichePerson/np:natuerlichePerson.id =&#xA;            (ancestor::xga:satz/*/xga:gewerbebetrieb/xga:vertretungsberechtigtePerson.id)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-natuerlichePerson-bk-geburt"/>
      </sch:rule>
      <sch:rule context="xga:ihk.gewerbemeldung.0200//xga:natuerlichePerson[ancestor-or-self::xga:referenzierteSubjekte and ancestor-or-self::xga:natuerlichePerson/np:natuerlichePerson.id =&#xA;            (ancestor::xga:satz/*/xga:gewerbebetrieb/xga:vertretungsberechtigtePerson.id)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-natuerlichePerson-bk-geburt"/>
      </sch:rule>
      <sch:rule context="xga:hwk.gewerbemeldung.0210//xga:natuerlichePerson[ancestor-or-self::xga:referenzierteSubjekte and ancestor-or-self::xga:natuerlichePerson/np:natuerlichePerson.id =&#xA;            (ancestor::xga:satz/*/xga:gewerbebetrieb/xga:vertretungsberechtigtePerson.id)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-natuerlichePerson-bk-geburt"/>
      </sch:rule>
      <sch:rule context="xga:ea.gewerbemeldung.0220//xga:natuerlichePerson[ancestor-or-self::xga:referenzierteSubjekte and ancestor-or-self::xga:natuerlichePerson/np:natuerlichePerson.id =&#xA;            (ancestor::xga:satz/*/xga:gewerbebetrieb/xga:vertretungsberechtigtePerson.id)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-natuerlichePerson-bk-geburt"/>
      </sch:rule>
      <sch:rule context="xga:dgu.gewerbemeldung.0230//xga:natuerlichePerson[ancestor-or-self::xga:referenzierteSubjekte and ancestor-or-self::xga:natuerlichePerson/np:natuerlichePerson.id =&#xA;            (ancestor::xga:satz/*/xga:gewerbebetrieb/xga:vertretungsberechtigtePerson.id)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-natuerlichePerson-bk-geburt"/>
      </sch:rule>
      <sch:rule context="xga:rg.gewerbemeldung.0240//xga:natuerlichePerson[ancestor-or-self::xga:referenzierteSubjekte and ancestor-or-self::xga:natuerlichePerson/np:natuerlichePerson.id =&#xA;            (ancestor::xga:satz/*/xga:gewerbebetrieb/xga:vertretungsberechtigtePerson.id)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-natuerlichePerson-bk-geburt"/>
      </sch:rule>
      <sch:rule context="xga:fa.gewerbemeldung.0250//xga:natuerlichePerson[ancestor-or-self::xga:referenzierteSubjekte and ancestor-or-self::xga:natuerlichePerson/np:natuerlichePerson.id =&#xA;            (ancestor::xga:satz/*/xga:gewerbebetrieb/xga:vertretungsberechtigtePerson.id)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-natuerlichePerson-bk-geburt"/>
      </sch:rule>
      <sch:rule context="xga:zv.gewerbemeldung.0260//xga:natuerlichePerson[ancestor-or-self::xga:referenzierteSubjekte and ancestor-or-self::xga:natuerlichePerson/np:natuerlichePerson.id =&#xA;            (ancestor::xga:satz/*/xga:gewerbebetrieb/xga:vertretungsberechtigtePerson.id)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-natuerlichePerson-bk-geburt"/>
      </sch:rule>
      <sch:rule context="xga:is.gewerbemeldung.0270//xga:natuerlichePerson[ancestor-or-self::xga:referenzierteSubjekte and ancestor-or-self::xga:natuerlichePerson/np:natuerlichePerson.id =&#xA;            (ancestor::xga:satz/*/xga:gewerbebetrieb/xga:vertretungsberechtigtePerson.id)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-natuerlichePerson-bk-geburt"/>
      </sch:rule>
      <sch:rule context="xga:as.gewerbemeldung.0280//xga:natuerlichePerson[ancestor-or-self::xga:referenzierteSubjekte and ancestor-or-self::xga:natuerlichePerson/np:natuerlichePerson.id =&#xA;            (ancestor::xga:satz/*/xga:gewerbebetrieb/xga:vertretungsberechtigtePerson.id)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-natuerlichePerson-bk-geburt"/>
      </sch:rule>
      <sch:rule context="xga:lue.gewerbemeldung.0290//xga:natuerlichePerson[ancestor-or-self::xga:referenzierteSubjekte and ancestor-or-self::xga:natuerlichePerson/np:natuerlichePerson.id =&#xA;            (ancestor::xga:satz/*/xga:gewerbebetrieb/xga:vertretungsberechtigtePerson.id)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-natuerlichePerson-bk-geburt"/>
      </sch:rule>
      <sch:rule context="xga:alg.gewerbemeldung.0300//xga:natuerlichePerson[ancestor-or-self::xga:referenzierteSubjekte and ancestor-or-self::xga:natuerlichePerson/np:natuerlichePerson.id =&#xA;            (ancestor::xga:satz/*/xga:gewerbebetrieb/xga:vertretungsberechtigtePerson.id)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-natuerlichePerson-bk-geburt"/>
      </sch:rule>
      <sch:rule context="xga:ext.gewerbemeldung.0400//xga:natuerlichePerson[ancestor-or-self::xga:referenzierteSubjekte and ancestor-or-self::xga:natuerlichePerson/np:natuerlichePerson.id =&#xA;            (ancestor::xga:satz/*/xga:gewerbebetrieb/xga:vertretungsberechtigtePerson.id)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-natuerlichePerson-bk-geburt"/>
      </sch:rule>
      <sch:rule context="xga:abh.gewerbemeldung.0500//xga:natuerlichePerson[ancestor-or-self::xga:referenzierteSubjekte and ancestor-or-self::xga:natuerlichePerson/np:natuerlichePerson.id =&#xA;            (ancestor::xga:satz/*/xga:gewerbebetrieb/xga:vertretungsberechtigtePerson.id)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-natuerlichePerson-bk-geburt"/>
      </sch:rule>
      <sch:rule context="xga:abruf.antwort.0601//xga:natuerlichePerson[ancestor-or-self::xga:referenzierteSubjekte and ancestor-or-self::xga:natuerlichePerson/np:natuerlichePerson.id =&#xA;            (ancestor::xga:satz/*/xga:gewerbebetrieb/xga:vertretungsberechtigtePerson.id)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-natuerlichePerson-bk-geburt"/>
      </sch:rule>
      <sch:rule context="xga:unterrichtung.0700//xga:natuerlichePerson[ancestor-or-self::xga:referenzierteSubjekte and ancestor-or-self::xga:natuerlichePerson/np:natuerlichePerson.id =&#xA;            (ancestor::xga:satz/*/xga:gewerbebetrieb/xga:vertretungsberechtigtePerson.id)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-natuerlichePerson-bk-geburt"/>
      </sch:rule>
   </sch:pattern>
   <sch:pattern>
      <sch:rule id="rule.SCH-EXISTS-xga-natuerlichePerson-bk-geburt" abstract="true">
         <sch:assert id="SCH-EXISTS-xga-natuerlichePerson-bk-geburt"
                     test="exists(bk:geburt)">[SCH-EXISTS-xga-natuerlichePerson-bk-geburt] Das Kindelement bk:geburt muss in diesem Kontext angegeben werden.</sch:assert>
      </sch:rule>
      <sch:rule context="xga:ihk.gewerbemeldung.0200//xga:natuerlichePerson[ancestor-or-self::xga:referenzierteSubjekte and ancestor-or-self::xga:natuerlichePerson/np:natuerlichePerson.id = (ancestor::xga:satz/*/xga:gewerbebetrieb//xga:gewerbetreibender.id,&#xA;            ancestor::xga:satz/*/xga:referenzierteSubjekte//gv:gesetzlicherVertreter.id, ancestor::xga:satz/*/xga:referenzierteSubjekte//ges:gesellschafter.id)]">
         <sch:extends rule="rule.SCH-EXISTS-xga-natuerlichePerson-bk-geburt"/>
      </sch:rule>
      <sch:rule context="xga:hwk.gewerbemeldung.0210//xga:natuerlichePerson[ancestor-or-self::xga:referenzierteSubjekte and ancestor-or-self::xga:natuerlichePerson/np:natuerlichePerson.id = (ancestor::xga:satz/*/xga:gewerbebetrieb//xga:gewerbetreibender.id,&#xA;            ancestor::xga:satz/*/xga:referenzierteSubjekte//gv:gesetzlicherVertreter.id, ancestor::xga:satz/*/xga:referenzierteSubjekte//ges:gesellschafter.id)]">
         <sch:extends rule="rule.SCH-EXISTS-xga-natuerlichePerson-bk-geburt"/>
      </sch:rule>
      <sch:rule context="xga:dgu.gewerbemeldung.0230//xga:natuerlichePerson[ancestor-or-self::xga:referenzierteSubjekte and ancestor-or-self::xga:natuerlichePerson/np:natuerlichePerson.id = (ancestor::xga:satz/*/xga:gewerbebetrieb//xga:gewerbetreibender.id,&#xA;            ancestor::xga:satz/*/xga:referenzierteSubjekte//gv:gesetzlicherVertreter.id, ancestor::xga:satz/*/xga:referenzierteSubjekte//ges:gesellschafter.id)]">
         <sch:extends rule="rule.SCH-EXISTS-xga-natuerlichePerson-bk-geburt"/>
      </sch:rule>
      <sch:rule context="xga:fa.gewerbemeldung.0250//xga:natuerlichePerson[ancestor-or-self::xga:referenzierteSubjekte and ancestor-or-self::xga:natuerlichePerson/np:natuerlichePerson.id = (ancestor::xga:satz/*/xga:gewerbebetrieb//xga:gewerbetreibender.id,&#xA;            ancestor::xga:satz/*/xga:referenzierteSubjekte//gv:gesetzlicherVertreter.id, ancestor::xga:satz/*/xga:referenzierteSubjekte//ges:gesellschafter.id)]">
         <sch:extends rule="rule.SCH-EXISTS-xga-natuerlichePerson-bk-geburt"/>
      </sch:rule>
      <sch:rule context="xga:zv.gewerbemeldung.0260//xga:natuerlichePerson[ancestor-or-self::xga:referenzierteSubjekte and ancestor-or-self::xga:natuerlichePerson/np:natuerlichePerson.id = (ancestor::xga:satz/*/xga:gewerbebetrieb//xga:gewerbetreibender.id,&#xA;            ancestor::xga:satz/*/xga:referenzierteSubjekte//gv:gesetzlicherVertreter.id, ancestor::xga:satz/*/xga:referenzierteSubjekte//ges:gesellschafter.id)]">
         <sch:extends rule="rule.SCH-EXISTS-xga-natuerlichePerson-bk-geburt"/>
      </sch:rule>
      <sch:rule context="xga:is.gewerbemeldung.0270//xga:natuerlichePerson[ancestor-or-self::xga:referenzierteSubjekte and ancestor-or-self::xga:natuerlichePerson/np:natuerlichePerson.id = (ancestor::xga:satz/*/xga:gewerbebetrieb//xga:gewerbetreibender.id,&#xA;            ancestor::xga:satz/*/xga:referenzierteSubjekte//gv:gesetzlicherVertreter.id, ancestor::xga:satz/*/xga:referenzierteSubjekte//ges:gesellschafter.id)]">
         <sch:extends rule="rule.SCH-EXISTS-xga-natuerlichePerson-bk-geburt"/>
      </sch:rule>
      <sch:rule context="xga:as.gewerbemeldung.0280//xga:natuerlichePerson[ancestor-or-self::xga:referenzierteSubjekte and ancestor-or-self::xga:natuerlichePerson/np:natuerlichePerson.id = (ancestor::xga:satz/*/xga:gewerbebetrieb//xga:gewerbetreibender.id,&#xA;            ancestor::xga:satz/*/xga:referenzierteSubjekte//gv:gesetzlicherVertreter.id, ancestor::xga:satz/*/xga:referenzierteSubjekte//ges:gesellschafter.id)]">
         <sch:extends rule="rule.SCH-EXISTS-xga-natuerlichePerson-bk-geburt"/>
      </sch:rule>
      <sch:rule context="xga:lue.gewerbemeldung.0290//xga:natuerlichePerson[ancestor-or-self::xga:referenzierteSubjekte and ancestor-or-self::xga:natuerlichePerson/np:natuerlichePerson.id = (ancestor::xga:satz/*/xga:gewerbebetrieb//xga:gewerbetreibender.id,&#xA;            ancestor::xga:satz/*/xga:referenzierteSubjekte//gv:gesetzlicherVertreter.id, ancestor::xga:satz/*/xga:referenzierteSubjekte//ges:gesellschafter.id)]">
         <sch:extends rule="rule.SCH-EXISTS-xga-natuerlichePerson-bk-geburt"/>
      </sch:rule>
      <sch:rule context="xga:alg.gewerbemeldung.0300//xga:natuerlichePerson[ancestor-or-self::xga:referenzierteSubjekte and ancestor-or-self::xga:natuerlichePerson/np:natuerlichePerson.id = (ancestor::xga:satz/*/xga:gewerbebetrieb//xga:gewerbetreibender.id,&#xA;            ancestor::xga:satz/*/xga:referenzierteSubjekte//gv:gesetzlicherVertreter.id, ancestor::xga:satz/*/xga:referenzierteSubjekte//ges:gesellschafter.id)]">
         <sch:extends rule="rule.SCH-EXISTS-xga-natuerlichePerson-bk-geburt"/>
      </sch:rule>
      <sch:rule context="xga:ext.gewerbemeldung.0400//xga:natuerlichePerson[ancestor-or-self::xga:referenzierteSubjekte and ancestor-or-self::xga:natuerlichePerson/np:natuerlichePerson.id = (ancestor::xga:satz/*/xga:gewerbebetrieb//xga:gewerbetreibender.id,&#xA;            ancestor::xga:satz/*/xga:referenzierteSubjekte//gv:gesetzlicherVertreter.id, ancestor::xga:satz/*/xga:referenzierteSubjekte//ges:gesellschafter.id)]">
         <sch:extends rule="rule.SCH-EXISTS-xga-natuerlichePerson-bk-geburt"/>
      </sch:rule>
      <sch:rule context="xga:abh.gewerbemeldung.0500//xga:natuerlichePerson[ancestor-or-self::xga:referenzierteSubjekte and ancestor-or-self::xga:natuerlichePerson/np:natuerlichePerson.id = (ancestor::xga:satz/*/xga:gewerbebetrieb//xga:gewerbetreibender.id,&#xA;            ancestor::xga:satz/*/xga:referenzierteSubjekte//gv:gesetzlicherVertreter.id, ancestor::xga:satz/*/xga:referenzierteSubjekte//ges:gesellschafter.id)]">
         <sch:extends rule="rule.SCH-EXISTS-xga-natuerlichePerson-bk-geburt"/>
      </sch:rule>
      <sch:rule context="xga:unterrichtung.0700//xga:natuerlichePerson[ancestor-or-self::xga:referenzierteSubjekte and ancestor-or-self::xga:natuerlichePerson/np:natuerlichePerson.id = (ancestor::xga:satz/*/xga:gewerbebetrieb//xga:gewerbetreibender.id,&#xA;            ancestor::xga:satz/*/xga:referenzierteSubjekte//gv:gesetzlicherVertreter.id, ancestor::xga:satz/*/xga:referenzierteSubjekte//ges:gesellschafter.id)]">
         <sch:extends rule="rule.SCH-EXISTS-xga-natuerlichePerson-bk-geburt"/>
      </sch:rule>
   </sch:pattern>
   <sch:pattern>
      <sch:rule id="rule.SCH-EMPTY-xga-natuerlichePerson-xga-doktorgrad"
                abstract="true">
         <sch:assert id="SCH-EMPTY-xga-natuerlichePerson-xga-doktorgrad"
                     test="empty(xga:doktorgrad)">[SCH-EMPTY-xga-natuerlichePerson-xga-doktorgrad] Das Kindelement xga:doktorgrad darf in diesem Kontext nicht angegeben werden.</sch:assert>
      </sch:rule>
      <sch:rule context="xga:sta.gewerbemeldung.0100//xga:natuerlichePerson[ancestor-or-self::xga:referenzierteSubjekte and ancestor-or-self::xga:natuerlichePerson/np:natuerlichePerson.id =&#xA;            (ancestor::xga:satz/*/xga:gewerbebetrieb/xga:vertretungsberechtigtePerson.id)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-natuerlichePerson-xga-doktorgrad"/>
      </sch:rule>
      <sch:rule context="xga:ihk.gewerbemeldung.0200//xga:natuerlichePerson[ancestor-or-self::xga:referenzierteSubjekte and ancestor-or-self::xga:natuerlichePerson/np:natuerlichePerson.id =&#xA;            (ancestor::xga:satz/*/xga:gewerbebetrieb/xga:vertretungsberechtigtePerson.id)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-natuerlichePerson-xga-doktorgrad"/>
      </sch:rule>
      <sch:rule context="xga:hwk.gewerbemeldung.0210//xga:natuerlichePerson[ancestor-or-self::xga:referenzierteSubjekte and ancestor-or-self::xga:natuerlichePerson/np:natuerlichePerson.id =&#xA;            (ancestor::xga:satz/*/xga:gewerbebetrieb/xga:vertretungsberechtigtePerson.id)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-natuerlichePerson-xga-doktorgrad"/>
      </sch:rule>
      <sch:rule context="xga:ea.gewerbemeldung.0220//xga:natuerlichePerson[ancestor-or-self::xga:referenzierteSubjekte and ancestor-or-self::xga:natuerlichePerson/np:natuerlichePerson.id =&#xA;            (ancestor::xga:satz/*/xga:gewerbebetrieb/xga:vertretungsberechtigtePerson.id)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-natuerlichePerson-xga-doktorgrad"/>
      </sch:rule>
      <sch:rule context="xga:dgu.gewerbemeldung.0230//xga:natuerlichePerson[ancestor-or-self::xga:referenzierteSubjekte and ancestor-or-self::xga:natuerlichePerson/np:natuerlichePerson.id =&#xA;            (ancestor::xga:satz/*/xga:gewerbebetrieb/xga:vertretungsberechtigtePerson.id)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-natuerlichePerson-xga-doktorgrad"/>
      </sch:rule>
      <sch:rule context="xga:rg.gewerbemeldung.0240//xga:natuerlichePerson[ancestor-or-self::xga:referenzierteSubjekte and ancestor-or-self::xga:natuerlichePerson/np:natuerlichePerson.id =&#xA;            (ancestor::xga:satz/*/xga:gewerbebetrieb/xga:vertretungsberechtigtePerson.id)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-natuerlichePerson-xga-doktorgrad"/>
      </sch:rule>
      <sch:rule context="xga:fa.gewerbemeldung.0250//xga:natuerlichePerson[ancestor-or-self::xga:referenzierteSubjekte and ancestor-or-self::xga:natuerlichePerson/np:natuerlichePerson.id =&#xA;            (ancestor::xga:satz/*/xga:gewerbebetrieb/xga:vertretungsberechtigtePerson.id)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-natuerlichePerson-xga-doktorgrad"/>
      </sch:rule>
      <sch:rule context="xga:zv.gewerbemeldung.0260//xga:natuerlichePerson[ancestor-or-self::xga:referenzierteSubjekte and ancestor-or-self::xga:natuerlichePerson/np:natuerlichePerson.id =&#xA;            (ancestor::xga:satz/*/xga:gewerbebetrieb/xga:vertretungsberechtigtePerson.id)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-natuerlichePerson-xga-doktorgrad"/>
      </sch:rule>
      <sch:rule context="xga:is.gewerbemeldung.0270//xga:natuerlichePerson[ancestor-or-self::xga:referenzierteSubjekte and ancestor-or-self::xga:natuerlichePerson/np:natuerlichePerson.id =&#xA;            (ancestor::xga:satz/*/xga:gewerbebetrieb/xga:vertretungsberechtigtePerson.id)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-natuerlichePerson-xga-doktorgrad"/>
      </sch:rule>
      <sch:rule context="xga:as.gewerbemeldung.0280//xga:natuerlichePerson[ancestor-or-self::xga:referenzierteSubjekte and ancestor-or-self::xga:natuerlichePerson/np:natuerlichePerson.id =&#xA;            (ancestor::xga:satz/*/xga:gewerbebetrieb/xga:vertretungsberechtigtePerson.id)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-natuerlichePerson-xga-doktorgrad"/>
      </sch:rule>
      <sch:rule context="xga:lue.gewerbemeldung.0290//xga:natuerlichePerson[ancestor-or-self::xga:referenzierteSubjekte and ancestor-or-self::xga:natuerlichePerson/np:natuerlichePerson.id =&#xA;            (ancestor::xga:satz/*/xga:gewerbebetrieb/xga:vertretungsberechtigtePerson.id)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-natuerlichePerson-xga-doktorgrad"/>
      </sch:rule>
      <sch:rule context="xga:alg.gewerbemeldung.0300//xga:natuerlichePerson[ancestor-or-self::xga:referenzierteSubjekte and ancestor-or-self::xga:natuerlichePerson/np:natuerlichePerson.id =&#xA;            (ancestor::xga:satz/*/xga:gewerbebetrieb/xga:vertretungsberechtigtePerson.id)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-natuerlichePerson-xga-doktorgrad"/>
      </sch:rule>
      <sch:rule context="xga:ext.gewerbemeldung.0400//xga:natuerlichePerson[ancestor-or-self::xga:referenzierteSubjekte and ancestor-or-self::xga:natuerlichePerson/np:natuerlichePerson.id =&#xA;            (ancestor::xga:satz/*/xga:gewerbebetrieb/xga:vertretungsberechtigtePerson.id)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-natuerlichePerson-xga-doktorgrad"/>
      </sch:rule>
      <sch:rule context="xga:abh.gewerbemeldung.0500//xga:natuerlichePerson[ancestor-or-self::xga:referenzierteSubjekte and ancestor-or-self::xga:natuerlichePerson/np:natuerlichePerson.id =&#xA;            (ancestor::xga:satz/*/xga:gewerbebetrieb/xga:vertretungsberechtigtePerson.id)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-natuerlichePerson-xga-doktorgrad"/>
      </sch:rule>
      <sch:rule context="xga:abruf.antwort.0601//xga:natuerlichePerson[ancestor-or-self::xga:referenzierteSubjekte and ancestor-or-self::xga:natuerlichePerson/np:natuerlichePerson.id =&#xA;            (ancestor::xga:satz/*/xga:gewerbebetrieb/xga:vertretungsberechtigtePerson.id)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-natuerlichePerson-xga-doktorgrad"/>
      </sch:rule>
      <sch:rule context="xga:unterrichtung.0700//xga:natuerlichePerson[ancestor-or-self::xga:referenzierteSubjekte and ancestor-or-self::xga:natuerlichePerson/np:natuerlichePerson.id =&#xA;            (ancestor::xga:satz/*/xga:gewerbebetrieb/xga:vertretungsberechtigtePerson.id)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-natuerlichePerson-xga-doktorgrad"/>
      </sch:rule>
   </sch:pattern>
   <sch:pattern>
      <sch:rule id="rule.SCH-EXISTS-xga-natuerlichePerson-xga-doktorgrad"
                abstract="true">
         <sch:assert id="SCH-EXISTS-xga-natuerlichePerson-xga-doktorgrad"
                     test="exists(xga:doktorgrad)">[SCH-EXISTS-xga-natuerlichePerson-xga-doktorgrad] Das Kindelement xga:doktorgrad muss in diesem Kontext angegeben werden.</sch:assert>
      </sch:rule>
   </sch:pattern>
   <sch:pattern>
      <sch:rule id="rule.SCH-EMPTY-xga-natuerlichePerson-bk-anschrift" abstract="true">
         <sch:assert id="SCH-EMPTY-xga-natuerlichePerson-bk-anschrift"
                     test="empty(bk:anschrift)">[SCH-EMPTY-xga-natuerlichePerson-bk-anschrift] Das Kindelement bk:anschrift darf in diesem Kontext nicht angegeben werden.</sch:assert>
      </sch:rule>
      <sch:rule context="xga:sta.gewerbemeldung.0100//xga:natuerlichePerson[ancestor-or-self::xga:referenzierteSubjekte and ancestor-or-self::xga:natuerlichePerson/np:natuerlichePerson.id = (ancestor::xga:satz/*/xga:gewerbebetrieb//xga:gewerbetreibender.id,&#xA;            ancestor::xga:satz/*/xga:referenzierteSubjekte//gv:gesetzlicherVertreter.id, ancestor::xga:satz/*/xga:referenzierteSubjekte//ges:gesellschafter.id)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-natuerlichePerson-bk-anschrift"/>
      </sch:rule>
      <sch:rule context="xga:sta.gewerbemeldung.0100//xga:natuerlichePerson[ancestor-or-self::xga:referenzierteSubjekte and ancestor-or-self::xga:natuerlichePerson/np:natuerlichePerson.id =&#xA;            (ancestor::xga:satz/*/xga:gewerbebetrieb/xga:vertretungsberechtigtePerson.id)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-natuerlichePerson-bk-anschrift"/>
      </sch:rule>
      <sch:rule context="xga:ihk.gewerbemeldung.0200//xga:natuerlichePerson[ancestor-or-self::xga:referenzierteSubjekte and ancestor-or-self::xga:natuerlichePerson/np:natuerlichePerson.id =&#xA;            (ancestor::xga:satz/*/xga:gewerbebetrieb/xga:vertretungsberechtigtePerson.id)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-natuerlichePerson-bk-anschrift"/>
      </sch:rule>
      <sch:rule context="xga:hwk.gewerbemeldung.0210//xga:natuerlichePerson[ancestor-or-self::xga:referenzierteSubjekte and ancestor-or-self::xga:natuerlichePerson/np:natuerlichePerson.id =&#xA;            (ancestor::xga:satz/*/xga:gewerbebetrieb/xga:vertretungsberechtigtePerson.id)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-natuerlichePerson-bk-anschrift"/>
      </sch:rule>
      <sch:rule context="xga:ea.gewerbemeldung.0220//xga:natuerlichePerson[ancestor-or-self::xga:referenzierteSubjekte and ancestor-or-self::xga:natuerlichePerson/np:natuerlichePerson.id =&#xA;            (ancestor::xga:satz/*/xga:gewerbebetrieb/xga:vertretungsberechtigtePerson.id)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-natuerlichePerson-bk-anschrift"/>
      </sch:rule>
      <sch:rule context="xga:dgu.gewerbemeldung.0230//xga:natuerlichePerson[ancestor-or-self::xga:referenzierteSubjekte and ancestor-or-self::xga:natuerlichePerson/np:natuerlichePerson.id =&#xA;            (ancestor::xga:satz/*/xga:gewerbebetrieb/xga:vertretungsberechtigtePerson.id)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-natuerlichePerson-bk-anschrift"/>
      </sch:rule>
      <sch:rule context="xga:rg.gewerbemeldung.0240//xga:natuerlichePerson[ancestor-or-self::xga:referenzierteSubjekte and ancestor-or-self::xga:natuerlichePerson/np:natuerlichePerson.id =&#xA;            (ancestor::xga:satz/*/xga:gewerbebetrieb/xga:vertretungsberechtigtePerson.id)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-natuerlichePerson-bk-anschrift"/>
      </sch:rule>
      <sch:rule context="xga:fa.gewerbemeldung.0250//xga:natuerlichePerson[ancestor-or-self::xga:referenzierteSubjekte and ancestor-or-self::xga:natuerlichePerson/np:natuerlichePerson.id =&#xA;            (ancestor::xga:satz/*/xga:gewerbebetrieb/xga:vertretungsberechtigtePerson.id)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-natuerlichePerson-bk-anschrift"/>
      </sch:rule>
      <sch:rule context="xga:zv.gewerbemeldung.0260//xga:natuerlichePerson[ancestor-or-self::xga:referenzierteSubjekte and ancestor-or-self::xga:natuerlichePerson/np:natuerlichePerson.id =&#xA;            (ancestor::xga:satz/*/xga:gewerbebetrieb/xga:vertretungsberechtigtePerson.id)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-natuerlichePerson-bk-anschrift"/>
      </sch:rule>
      <sch:rule context="xga:is.gewerbemeldung.0270//xga:natuerlichePerson[ancestor-or-self::xga:referenzierteSubjekte and ancestor-or-self::xga:natuerlichePerson/np:natuerlichePerson.id =&#xA;            (ancestor::xga:satz/*/xga:gewerbebetrieb/xga:vertretungsberechtigtePerson.id)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-natuerlichePerson-bk-anschrift"/>
      </sch:rule>
      <sch:rule context="xga:as.gewerbemeldung.0280//xga:natuerlichePerson[ancestor-or-self::xga:referenzierteSubjekte and ancestor-or-self::xga:natuerlichePerson/np:natuerlichePerson.id =&#xA;            (ancestor::xga:satz/*/xga:gewerbebetrieb/xga:vertretungsberechtigtePerson.id)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-natuerlichePerson-bk-anschrift"/>
      </sch:rule>
      <sch:rule context="xga:lue.gewerbemeldung.0290//xga:natuerlichePerson[ancestor-or-self::xga:referenzierteSubjekte and ancestor-or-self::xga:natuerlichePerson/np:natuerlichePerson.id =&#xA;            (ancestor::xga:satz/*/xga:gewerbebetrieb/xga:vertretungsberechtigtePerson.id)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-natuerlichePerson-bk-anschrift"/>
      </sch:rule>
      <sch:rule context="xga:alg.gewerbemeldung.0300//xga:natuerlichePerson[ancestor-or-self::xga:referenzierteSubjekte and ancestor-or-self::xga:natuerlichePerson/np:natuerlichePerson.id =&#xA;            (ancestor::xga:satz/*/xga:gewerbebetrieb/xga:vertretungsberechtigtePerson.id)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-natuerlichePerson-bk-anschrift"/>
      </sch:rule>
      <sch:rule context="xga:ext.gewerbemeldung.0400//xga:natuerlichePerson[ancestor-or-self::xga:referenzierteSubjekte and ancestor-or-self::xga:natuerlichePerson/np:natuerlichePerson.id =&#xA;            (ancestor::xga:satz/*/xga:gewerbebetrieb/xga:vertretungsberechtigtePerson.id)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-natuerlichePerson-bk-anschrift"/>
      </sch:rule>
      <sch:rule context="xga:abh.gewerbemeldung.0500//xga:natuerlichePerson[ancestor-or-self::xga:referenzierteSubjekte and ancestor-or-self::xga:natuerlichePerson/np:natuerlichePerson.id =&#xA;            (ancestor::xga:satz/*/xga:gewerbebetrieb/xga:vertretungsberechtigtePerson.id)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-natuerlichePerson-bk-anschrift"/>
      </sch:rule>
      <sch:rule context="xga:abruf.antwort.0601//xga:natuerlichePerson[ancestor-or-self::xga:referenzierteSubjekte and ancestor-or-self::xga:natuerlichePerson/np:natuerlichePerson.id =&#xA;            (ancestor::xga:satz/*/xga:gewerbebetrieb/xga:vertretungsberechtigtePerson.id)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-natuerlichePerson-bk-anschrift"/>
      </sch:rule>
      <sch:rule context="xga:unterrichtung.0700//xga:natuerlichePerson[ancestor-or-self::xga:referenzierteSubjekte and ancestor-or-self::xga:natuerlichePerson/np:natuerlichePerson.id =&#xA;            (ancestor::xga:satz/*/xga:gewerbebetrieb/xga:vertretungsberechtigtePerson.id)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-natuerlichePerson-bk-anschrift"/>
      </sch:rule>
   </sch:pattern>
   <sch:pattern>
      <sch:rule id="rule.SCH-EXISTS-xga-natuerlichePerson-bk-anschrift" abstract="true">
         <sch:assert id="SCH-EXISTS-xga-natuerlichePerson-bk-anschrift"
                     test="exists(bk:anschrift)">[SCH-EXISTS-xga-natuerlichePerson-bk-anschrift] Das Kindelement bk:anschrift muss in diesem Kontext angegeben werden.</sch:assert>
      </sch:rule>
      <sch:rule context="xga:ihk.gewerbemeldung.0200//xga:natuerlichePerson[ancestor-or-self::xga:referenzierteSubjekte and ancestor-or-self::xga:natuerlichePerson/np:natuerlichePerson.id = (ancestor::xga:satz/*/xga:gewerbebetrieb//xga:gewerbetreibender.id,&#xA;            ancestor::xga:satz/*/xga:referenzierteSubjekte//gv:gesetzlicherVertreter.id, ancestor::xga:satz/*/xga:referenzierteSubjekte//ges:gesellschafter.id)]">
         <sch:extends rule="rule.SCH-EXISTS-xga-natuerlichePerson-bk-anschrift"/>
      </sch:rule>
      <sch:rule context="xga:hwk.gewerbemeldung.0210//xga:natuerlichePerson[ancestor-or-self::xga:referenzierteSubjekte and ancestor-or-self::xga:natuerlichePerson/np:natuerlichePerson.id = (ancestor::xga:satz/*/xga:gewerbebetrieb//xga:gewerbetreibender.id,&#xA;            ancestor::xga:satz/*/xga:referenzierteSubjekte//gv:gesetzlicherVertreter.id, ancestor::xga:satz/*/xga:referenzierteSubjekte//ges:gesellschafter.id)]">
         <sch:extends rule="rule.SCH-EXISTS-xga-natuerlichePerson-bk-anschrift"/>
      </sch:rule>
      <sch:rule context="xga:ea.gewerbemeldung.0220//xga:natuerlichePerson[ancestor-or-self::xga:referenzierteSubjekte and ancestor-or-self::xga:natuerlichePerson/np:natuerlichePerson.id = (ancestor::xga:satz/*/xga:gewerbebetrieb//xga:gewerbetreibender.id,&#xA;            ancestor::xga:satz/*/xga:referenzierteSubjekte//gv:gesetzlicherVertreter.id, ancestor::xga:satz/*/xga:referenzierteSubjekte//ges:gesellschafter.id)]">
         <sch:extends rule="rule.SCH-EXISTS-xga-natuerlichePerson-bk-anschrift"/>
      </sch:rule>
      <sch:rule context="xga:dgu.gewerbemeldung.0230//xga:natuerlichePerson[ancestor-or-self::xga:referenzierteSubjekte and ancestor-or-self::xga:natuerlichePerson/np:natuerlichePerson.id = (ancestor::xga:satz/*/xga:gewerbebetrieb//xga:gewerbetreibender.id,&#xA;            ancestor::xga:satz/*/xga:referenzierteSubjekte//gv:gesetzlicherVertreter.id, ancestor::xga:satz/*/xga:referenzierteSubjekte//ges:gesellschafter.id)]">
         <sch:extends rule="rule.SCH-EXISTS-xga-natuerlichePerson-bk-anschrift"/>
      </sch:rule>
      <sch:rule context="xga:rg.gewerbemeldung.0240//xga:natuerlichePerson[ancestor-or-self::xga:referenzierteSubjekte and ancestor-or-self::xga:natuerlichePerson/np:natuerlichePerson.id = (ancestor::xga:satz/*/xga:gewerbebetrieb//xga:gewerbetreibender.id,&#xA;            ancestor::xga:satz/*/xga:referenzierteSubjekte//gv:gesetzlicherVertreter.id, ancestor::xga:satz/*/xga:referenzierteSubjekte//ges:gesellschafter.id)]">
         <sch:extends rule="rule.SCH-EXISTS-xga-natuerlichePerson-bk-anschrift"/>
      </sch:rule>
      <sch:rule context="xga:fa.gewerbemeldung.0250//xga:natuerlichePerson[ancestor-or-self::xga:referenzierteSubjekte and ancestor-or-self::xga:natuerlichePerson/np:natuerlichePerson.id = (ancestor::xga:satz/*/xga:gewerbebetrieb//xga:gewerbetreibender.id,&#xA;            ancestor::xga:satz/*/xga:referenzierteSubjekte//gv:gesetzlicherVertreter.id, ancestor::xga:satz/*/xga:referenzierteSubjekte//ges:gesellschafter.id)]">
         <sch:extends rule="rule.SCH-EXISTS-xga-natuerlichePerson-bk-anschrift"/>
      </sch:rule>
      <sch:rule context="xga:zv.gewerbemeldung.0260//xga:natuerlichePerson[ancestor-or-self::xga:referenzierteSubjekte and ancestor-or-self::xga:natuerlichePerson/np:natuerlichePerson.id = (ancestor::xga:satz/*/xga:gewerbebetrieb//xga:gewerbetreibender.id,&#xA;            ancestor::xga:satz/*/xga:referenzierteSubjekte//gv:gesetzlicherVertreter.id, ancestor::xga:satz/*/xga:referenzierteSubjekte//ges:gesellschafter.id)]">
         <sch:extends rule="rule.SCH-EXISTS-xga-natuerlichePerson-bk-anschrift"/>
      </sch:rule>
      <sch:rule context="xga:is.gewerbemeldung.0270//xga:natuerlichePerson[ancestor-or-self::xga:referenzierteSubjekte and ancestor-or-self::xga:natuerlichePerson/np:natuerlichePerson.id = (ancestor::xga:satz/*/xga:gewerbebetrieb//xga:gewerbetreibender.id,&#xA;            ancestor::xga:satz/*/xga:referenzierteSubjekte//gv:gesetzlicherVertreter.id, ancestor::xga:satz/*/xga:referenzierteSubjekte//ges:gesellschafter.id)]">
         <sch:extends rule="rule.SCH-EXISTS-xga-natuerlichePerson-bk-anschrift"/>
      </sch:rule>
      <sch:rule context="xga:as.gewerbemeldung.0280//xga:natuerlichePerson[ancestor-or-self::xga:referenzierteSubjekte and ancestor-or-self::xga:natuerlichePerson/np:natuerlichePerson.id = (ancestor::xga:satz/*/xga:gewerbebetrieb//xga:gewerbetreibender.id,&#xA;            ancestor::xga:satz/*/xga:referenzierteSubjekte//gv:gesetzlicherVertreter.id, ancestor::xga:satz/*/xga:referenzierteSubjekte//ges:gesellschafter.id)]">
         <sch:extends rule="rule.SCH-EXISTS-xga-natuerlichePerson-bk-anschrift"/>
      </sch:rule>
      <sch:rule context="xga:lue.gewerbemeldung.0290//xga:natuerlichePerson[ancestor-or-self::xga:referenzierteSubjekte and ancestor-or-self::xga:natuerlichePerson/np:natuerlichePerson.id = (ancestor::xga:satz/*/xga:gewerbebetrieb//xga:gewerbetreibender.id,&#xA;            ancestor::xga:satz/*/xga:referenzierteSubjekte//gv:gesetzlicherVertreter.id, ancestor::xga:satz/*/xga:referenzierteSubjekte//ges:gesellschafter.id)]">
         <sch:extends rule="rule.SCH-EXISTS-xga-natuerlichePerson-bk-anschrift"/>
      </sch:rule>
      <sch:rule context="xga:alg.gewerbemeldung.0300//xga:natuerlichePerson[ancestor-or-self::xga:referenzierteSubjekte and ancestor-or-self::xga:natuerlichePerson/np:natuerlichePerson.id = (ancestor::xga:satz/*/xga:gewerbebetrieb//xga:gewerbetreibender.id,&#xA;            ancestor::xga:satz/*/xga:referenzierteSubjekte//gv:gesetzlicherVertreter.id, ancestor::xga:satz/*/xga:referenzierteSubjekte//ges:gesellschafter.id)]">
         <sch:extends rule="rule.SCH-EXISTS-xga-natuerlichePerson-bk-anschrift"/>
      </sch:rule>
      <sch:rule context="xga:ext.gewerbemeldung.0400//xga:natuerlichePerson[ancestor-or-self::xga:referenzierteSubjekte and ancestor-or-self::xga:natuerlichePerson/np:natuerlichePerson.id = (ancestor::xga:satz/*/xga:gewerbebetrieb//xga:gewerbetreibender.id,&#xA;            ancestor::xga:satz/*/xga:referenzierteSubjekte//gv:gesetzlicherVertreter.id, ancestor::xga:satz/*/xga:referenzierteSubjekte//ges:gesellschafter.id)]">
         <sch:extends rule="rule.SCH-EXISTS-xga-natuerlichePerson-bk-anschrift"/>
      </sch:rule>
      <sch:rule context="xga:abh.gewerbemeldung.0500//xga:natuerlichePerson[ancestor-or-self::xga:referenzierteSubjekte and ancestor-or-self::xga:natuerlichePerson/np:natuerlichePerson.id = (ancestor::xga:satz/*/xga:gewerbebetrieb//xga:gewerbetreibender.id,&#xA;            ancestor::xga:satz/*/xga:referenzierteSubjekte//gv:gesetzlicherVertreter.id, ancestor::xga:satz/*/xga:referenzierteSubjekte//ges:gesellschafter.id)]">
         <sch:extends rule="rule.SCH-EXISTS-xga-natuerlichePerson-bk-anschrift"/>
      </sch:rule>
      <sch:rule context="xga:unterrichtung.0700//xga:natuerlichePerson[ancestor-or-self::xga:referenzierteSubjekte and ancestor-or-self::xga:natuerlichePerson/np:natuerlichePerson.id = (ancestor::xga:satz/*/xga:gewerbebetrieb//xga:gewerbetreibender.id,&#xA;            ancestor::xga:satz/*/xga:referenzierteSubjekte//gv:gesetzlicherVertreter.id, ancestor::xga:satz/*/xga:referenzierteSubjekte//ges:gesellschafter.id)]">
         <sch:extends rule="rule.SCH-EXISTS-xga-natuerlichePerson-bk-anschrift"/>
      </sch:rule>
   </sch:pattern>
   <sch:pattern>
      <sch:rule id="rule.SCH-EMPTY-xga-natuerlichePerson-bk-kommunikation"
                abstract="true">
         <sch:assert id="SCH-EMPTY-xga-natuerlichePerson-bk-kommunikation"
                     test="empty(bk:kommunikation)">[SCH-EMPTY-xga-natuerlichePerson-bk-kommunikation] Das Kindelement bk:kommunikation darf in diesem Kontext nicht angegeben werden.</sch:assert>
      </sch:rule>
      <sch:rule context="xga:sta.gewerbemeldung.0100//xga:natuerlichePerson[ancestor-or-self::xga:referenzierteSubjekte and ancestor-or-self::xga:natuerlichePerson/np:natuerlichePerson.id = (ancestor::xga:satz/*/xga:gewerbebetrieb//xga:gewerbetreibender.id,&#xA;            ancestor::xga:satz/*/xga:referenzierteSubjekte//gv:gesetzlicherVertreter.id, ancestor::xga:satz/*/xga:referenzierteSubjekte//ges:gesellschafter.id)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-natuerlichePerson-bk-kommunikation"/>
      </sch:rule>
      <sch:rule context="xga:sta.gewerbemeldung.0100//xga:natuerlichePerson[ancestor-or-self::xga:referenzierteSubjekte and ancestor-or-self::xga:natuerlichePerson/np:natuerlichePerson.id =&#xA;            (ancestor::xga:satz/*/xga:gewerbebetrieb/xga:vertretungsberechtigtePerson.id)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-natuerlichePerson-bk-kommunikation"/>
      </sch:rule>
      <sch:rule context="xga:ihk.gewerbemeldung.0200//xga:natuerlichePerson[ancestor-or-self::xga:referenzierteSubjekte and ancestor-or-self::xga:natuerlichePerson/np:natuerlichePerson.id =&#xA;            (ancestor::xga:satz/*/xga:gewerbebetrieb/xga:vertretungsberechtigtePerson.id)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-natuerlichePerson-bk-kommunikation"/>
      </sch:rule>
      <sch:rule context="xga:hwk.gewerbemeldung.0210//xga:natuerlichePerson[ancestor-or-self::xga:referenzierteSubjekte and ancestor-or-self::xga:natuerlichePerson/np:natuerlichePerson.id =&#xA;            (ancestor::xga:satz/*/xga:gewerbebetrieb/xga:vertretungsberechtigtePerson.id)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-natuerlichePerson-bk-kommunikation"/>
      </sch:rule>
      <sch:rule context="xga:ea.gewerbemeldung.0220//xga:natuerlichePerson[ancestor-or-self::xga:referenzierteSubjekte and ancestor-or-self::xga:natuerlichePerson/np:natuerlichePerson.id =&#xA;            (ancestor::xga:satz/*/xga:gewerbebetrieb/xga:vertretungsberechtigtePerson.id)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-natuerlichePerson-bk-kommunikation"/>
      </sch:rule>
      <sch:rule context="xga:dgu.gewerbemeldung.0230//xga:natuerlichePerson[ancestor-or-self::xga:referenzierteSubjekte and ancestor-or-self::xga:natuerlichePerson/np:natuerlichePerson.id =&#xA;            (ancestor::xga:satz/*/xga:gewerbebetrieb/xga:vertretungsberechtigtePerson.id)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-natuerlichePerson-bk-kommunikation"/>
      </sch:rule>
      <sch:rule context="xga:rg.gewerbemeldung.0240//xga:natuerlichePerson[ancestor-or-self::xga:referenzierteSubjekte and ancestor-or-self::xga:natuerlichePerson/np:natuerlichePerson.id =&#xA;            (ancestor::xga:satz/*/xga:gewerbebetrieb/xga:vertretungsberechtigtePerson.id)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-natuerlichePerson-bk-kommunikation"/>
      </sch:rule>
      <sch:rule context="xga:fa.gewerbemeldung.0250//xga:natuerlichePerson[ancestor-or-self::xga:referenzierteSubjekte and ancestor-or-self::xga:natuerlichePerson/np:natuerlichePerson.id =&#xA;            (ancestor::xga:satz/*/xga:gewerbebetrieb/xga:vertretungsberechtigtePerson.id)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-natuerlichePerson-bk-kommunikation"/>
      </sch:rule>
      <sch:rule context="xga:zv.gewerbemeldung.0260//xga:natuerlichePerson[ancestor-or-self::xga:referenzierteSubjekte and ancestor-or-self::xga:natuerlichePerson/np:natuerlichePerson.id =&#xA;            (ancestor::xga:satz/*/xga:gewerbebetrieb/xga:vertretungsberechtigtePerson.id)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-natuerlichePerson-bk-kommunikation"/>
      </sch:rule>
      <sch:rule context="xga:is.gewerbemeldung.0270//xga:natuerlichePerson[ancestor-or-self::xga:referenzierteSubjekte and ancestor-or-self::xga:natuerlichePerson/np:natuerlichePerson.id =&#xA;            (ancestor::xga:satz/*/xga:gewerbebetrieb/xga:vertretungsberechtigtePerson.id)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-natuerlichePerson-bk-kommunikation"/>
      </sch:rule>
      <sch:rule context="xga:as.gewerbemeldung.0280//xga:natuerlichePerson[ancestor-or-self::xga:referenzierteSubjekte and ancestor-or-self::xga:natuerlichePerson/np:natuerlichePerson.id =&#xA;            (ancestor::xga:satz/*/xga:gewerbebetrieb/xga:vertretungsberechtigtePerson.id)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-natuerlichePerson-bk-kommunikation"/>
      </sch:rule>
      <sch:rule context="xga:lue.gewerbemeldung.0290//xga:natuerlichePerson[ancestor-or-self::xga:referenzierteSubjekte and ancestor-or-self::xga:natuerlichePerson/np:natuerlichePerson.id =&#xA;            (ancestor::xga:satz/*/xga:gewerbebetrieb/xga:vertretungsberechtigtePerson.id)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-natuerlichePerson-bk-kommunikation"/>
      </sch:rule>
      <sch:rule context="xga:alg.gewerbemeldung.0300//xga:natuerlichePerson[ancestor-or-self::xga:referenzierteSubjekte and ancestor-or-self::xga:natuerlichePerson/np:natuerlichePerson.id =&#xA;            (ancestor::xga:satz/*/xga:gewerbebetrieb/xga:vertretungsberechtigtePerson.id)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-natuerlichePerson-bk-kommunikation"/>
      </sch:rule>
      <sch:rule context="xga:ext.gewerbemeldung.0400//xga:natuerlichePerson[ancestor-or-self::xga:referenzierteSubjekte and ancestor-or-self::xga:natuerlichePerson/np:natuerlichePerson.id =&#xA;            (ancestor::xga:satz/*/xga:gewerbebetrieb/xga:vertretungsberechtigtePerson.id)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-natuerlichePerson-bk-kommunikation"/>
      </sch:rule>
      <sch:rule context="xga:abh.gewerbemeldung.0500//xga:natuerlichePerson[ancestor-or-self::xga:referenzierteSubjekte and ancestor-or-self::xga:natuerlichePerson/np:natuerlichePerson.id =&#xA;            (ancestor::xga:satz/*/xga:gewerbebetrieb/xga:vertretungsberechtigtePerson.id)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-natuerlichePerson-bk-kommunikation"/>
      </sch:rule>
      <sch:rule context="xga:abruf.antwort.0601//xga:natuerlichePerson[ancestor-or-self::xga:referenzierteSubjekte and ancestor-or-self::xga:natuerlichePerson/np:natuerlichePerson.id =&#xA;            (ancestor::xga:satz/*/xga:gewerbebetrieb/xga:vertretungsberechtigtePerson.id)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-natuerlichePerson-bk-kommunikation"/>
      </sch:rule>
      <sch:rule context="xga:unterrichtung.0700//xga:natuerlichePerson[ancestor-or-self::xga:referenzierteSubjekte and ancestor-or-self::xga:natuerlichePerson/np:natuerlichePerson.id =&#xA;            (ancestor::xga:satz/*/xga:gewerbebetrieb/xga:vertretungsberechtigtePerson.id)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-natuerlichePerson-bk-kommunikation"/>
      </sch:rule>
   </sch:pattern>
   <sch:pattern>
      <sch:rule id="rule.SCH-EXISTS-xga-natuerlichePerson-bk-kommunikation"
                abstract="true">
         <sch:assert id="SCH-EXISTS-xga-natuerlichePerson-bk-kommunikation"
                     test="exists(bk:kommunikation)">[SCH-EXISTS-xga-natuerlichePerson-bk-kommunikation] Das Kindelement bk:kommunikation muss in diesem Kontext angegeben werden.</sch:assert>
      </sch:rule>
   </sch:pattern>
   <sch:pattern>
      <sch:rule id="rule.SCH-EMPTY-xga-natuerlichePerson-np-staatsangehoerigkeit"
                abstract="true">
         <sch:assert id="SCH-EMPTY-xga-natuerlichePerson-np-staatsangehoerigkeit"
                     test="empty(np:staatsangehoerigkeit)">[SCH-EMPTY-xga-natuerlichePerson-np-staatsangehoerigkeit] Das Kindelement np:staatsangehoerigkeit darf in diesem Kontext nicht angegeben werden.</sch:assert>
      </sch:rule>
      <sch:rule context="xga:ea.gewerbemeldung.0220//xga:natuerlichePerson[ancestor-or-self::xga:referenzierteSubjekte and ancestor-or-self::xga:natuerlichePerson/np:natuerlichePerson.id = (ancestor::xga:satz/*/xga:gewerbebetrieb//xga:gewerbetreibender.id,&#xA;            ancestor::xga:satz/*/xga:referenzierteSubjekte//gv:gesetzlicherVertreter.id, ancestor::xga:satz/*/xga:referenzierteSubjekte//ges:gesellschafter.id)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-natuerlichePerson-np-staatsangehoerigkeit"/>
      </sch:rule>
      <sch:rule context="xga:rg.gewerbemeldung.0240//xga:natuerlichePerson[ancestor-or-self::xga:referenzierteSubjekte and ancestor-or-self::xga:natuerlichePerson/np:natuerlichePerson.id = (ancestor::xga:satz/*/xga:gewerbebetrieb//xga:gewerbetreibender.id,&#xA;            ancestor::xga:satz/*/xga:referenzierteSubjekte//gv:gesetzlicherVertreter.id, ancestor::xga:satz/*/xga:referenzierteSubjekte//ges:gesellschafter.id)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-natuerlichePerson-np-staatsangehoerigkeit"/>
      </sch:rule>
      <sch:rule context="xga:is.gewerbemeldung.0270//xga:natuerlichePerson[ancestor-or-self::xga:referenzierteSubjekte and ancestor-or-self::xga:natuerlichePerson/np:natuerlichePerson.id = (ancestor::xga:satz/*/xga:gewerbebetrieb//xga:gewerbetreibender.id,&#xA;            ancestor::xga:satz/*/xga:referenzierteSubjekte//gv:gesetzlicherVertreter.id, ancestor::xga:satz/*/xga:referenzierteSubjekte//ges:gesellschafter.id)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-natuerlichePerson-np-staatsangehoerigkeit"/>
      </sch:rule>
      <sch:rule context="xga:as.gewerbemeldung.0280//xga:natuerlichePerson[ancestor-or-self::xga:referenzierteSubjekte and ancestor-or-self::xga:natuerlichePerson/np:natuerlichePerson.id = (ancestor::xga:satz/*/xga:gewerbebetrieb//xga:gewerbetreibender.id,&#xA;            ancestor::xga:satz/*/xga:referenzierteSubjekte//gv:gesetzlicherVertreter.id, ancestor::xga:satz/*/xga:referenzierteSubjekte//ges:gesellschafter.id)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-natuerlichePerson-np-staatsangehoerigkeit"/>
      </sch:rule>
      <sch:rule context="xga:lue.gewerbemeldung.0290//xga:natuerlichePerson[ancestor-or-self::xga:referenzierteSubjekte and ancestor-or-self::xga:natuerlichePerson/np:natuerlichePerson.id = (ancestor::xga:satz/*/xga:gewerbebetrieb//xga:gewerbetreibender.id,&#xA;            ancestor::xga:satz/*/xga:referenzierteSubjekte//gv:gesetzlicherVertreter.id, ancestor::xga:satz/*/xga:referenzierteSubjekte//ges:gesellschafter.id)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-natuerlichePerson-np-staatsangehoerigkeit"/>
      </sch:rule>
      <sch:rule context="xga:sta.gewerbemeldung.0100//xga:natuerlichePerson[ancestor-or-self::xga:referenzierteSubjekte and ancestor-or-self::xga:natuerlichePerson/np:natuerlichePerson.id =&#xA;            (ancestor::xga:satz/*/xga:gewerbebetrieb/xga:vertretungsberechtigtePerson.id)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-natuerlichePerson-np-staatsangehoerigkeit"/>
      </sch:rule>
      <sch:rule context="xga:ihk.gewerbemeldung.0200//xga:natuerlichePerson[ancestor-or-self::xga:referenzierteSubjekte and ancestor-or-self::xga:natuerlichePerson/np:natuerlichePerson.id =&#xA;            (ancestor::xga:satz/*/xga:gewerbebetrieb/xga:vertretungsberechtigtePerson.id)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-natuerlichePerson-np-staatsangehoerigkeit"/>
      </sch:rule>
      <sch:rule context="xga:hwk.gewerbemeldung.0210//xga:natuerlichePerson[ancestor-or-self::xga:referenzierteSubjekte and ancestor-or-self::xga:natuerlichePerson/np:natuerlichePerson.id =&#xA;            (ancestor::xga:satz/*/xga:gewerbebetrieb/xga:vertretungsberechtigtePerson.id)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-natuerlichePerson-np-staatsangehoerigkeit"/>
      </sch:rule>
      <sch:rule context="xga:ea.gewerbemeldung.0220//xga:natuerlichePerson[ancestor-or-self::xga:referenzierteSubjekte and ancestor-or-self::xga:natuerlichePerson/np:natuerlichePerson.id =&#xA;            (ancestor::xga:satz/*/xga:gewerbebetrieb/xga:vertretungsberechtigtePerson.id)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-natuerlichePerson-np-staatsangehoerigkeit"/>
      </sch:rule>
      <sch:rule context="xga:dgu.gewerbemeldung.0230//xga:natuerlichePerson[ancestor-or-self::xga:referenzierteSubjekte and ancestor-or-self::xga:natuerlichePerson/np:natuerlichePerson.id =&#xA;            (ancestor::xga:satz/*/xga:gewerbebetrieb/xga:vertretungsberechtigtePerson.id)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-natuerlichePerson-np-staatsangehoerigkeit"/>
      </sch:rule>
      <sch:rule context="xga:rg.gewerbemeldung.0240//xga:natuerlichePerson[ancestor-or-self::xga:referenzierteSubjekte and ancestor-or-self::xga:natuerlichePerson/np:natuerlichePerson.id =&#xA;            (ancestor::xga:satz/*/xga:gewerbebetrieb/xga:vertretungsberechtigtePerson.id)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-natuerlichePerson-np-staatsangehoerigkeit"/>
      </sch:rule>
      <sch:rule context="xga:fa.gewerbemeldung.0250//xga:natuerlichePerson[ancestor-or-self::xga:referenzierteSubjekte and ancestor-or-self::xga:natuerlichePerson/np:natuerlichePerson.id =&#xA;            (ancestor::xga:satz/*/xga:gewerbebetrieb/xga:vertretungsberechtigtePerson.id)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-natuerlichePerson-np-staatsangehoerigkeit"/>
      </sch:rule>
      <sch:rule context="xga:zv.gewerbemeldung.0260//xga:natuerlichePerson[ancestor-or-self::xga:referenzierteSubjekte and ancestor-or-self::xga:natuerlichePerson/np:natuerlichePerson.id =&#xA;            (ancestor::xga:satz/*/xga:gewerbebetrieb/xga:vertretungsberechtigtePerson.id)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-natuerlichePerson-np-staatsangehoerigkeit"/>
      </sch:rule>
      <sch:rule context="xga:is.gewerbemeldung.0270//xga:natuerlichePerson[ancestor-or-self::xga:referenzierteSubjekte and ancestor-or-self::xga:natuerlichePerson/np:natuerlichePerson.id =&#xA;            (ancestor::xga:satz/*/xga:gewerbebetrieb/xga:vertretungsberechtigtePerson.id)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-natuerlichePerson-np-staatsangehoerigkeit"/>
      </sch:rule>
      <sch:rule context="xga:as.gewerbemeldung.0280//xga:natuerlichePerson[ancestor-or-self::xga:referenzierteSubjekte and ancestor-or-self::xga:natuerlichePerson/np:natuerlichePerson.id =&#xA;            (ancestor::xga:satz/*/xga:gewerbebetrieb/xga:vertretungsberechtigtePerson.id)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-natuerlichePerson-np-staatsangehoerigkeit"/>
      </sch:rule>
      <sch:rule context="xga:lue.gewerbemeldung.0290//xga:natuerlichePerson[ancestor-or-self::xga:referenzierteSubjekte and ancestor-or-self::xga:natuerlichePerson/np:natuerlichePerson.id =&#xA;            (ancestor::xga:satz/*/xga:gewerbebetrieb/xga:vertretungsberechtigtePerson.id)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-natuerlichePerson-np-staatsangehoerigkeit"/>
      </sch:rule>
      <sch:rule context="xga:alg.gewerbemeldung.0300//xga:natuerlichePerson[ancestor-or-self::xga:referenzierteSubjekte and ancestor-or-self::xga:natuerlichePerson/np:natuerlichePerson.id =&#xA;            (ancestor::xga:satz/*/xga:gewerbebetrieb/xga:vertretungsberechtigtePerson.id)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-natuerlichePerson-np-staatsangehoerigkeit"/>
      </sch:rule>
      <sch:rule context="xga:ext.gewerbemeldung.0400//xga:natuerlichePerson[ancestor-or-self::xga:referenzierteSubjekte and ancestor-or-self::xga:natuerlichePerson/np:natuerlichePerson.id =&#xA;            (ancestor::xga:satz/*/xga:gewerbebetrieb/xga:vertretungsberechtigtePerson.id)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-natuerlichePerson-np-staatsangehoerigkeit"/>
      </sch:rule>
      <sch:rule context="xga:abh.gewerbemeldung.0500//xga:natuerlichePerson[ancestor-or-self::xga:referenzierteSubjekte and ancestor-or-self::xga:natuerlichePerson/np:natuerlichePerson.id =&#xA;            (ancestor::xga:satz/*/xga:gewerbebetrieb/xga:vertretungsberechtigtePerson.id)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-natuerlichePerson-np-staatsangehoerigkeit"/>
      </sch:rule>
      <sch:rule context="xga:abruf.antwort.0601//xga:natuerlichePerson[ancestor-or-self::xga:referenzierteSubjekte and ancestor-or-self::xga:natuerlichePerson/np:natuerlichePerson.id =&#xA;            (ancestor::xga:satz/*/xga:gewerbebetrieb/xga:vertretungsberechtigtePerson.id)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-natuerlichePerson-np-staatsangehoerigkeit"/>
      </sch:rule>
      <sch:rule context="xga:unterrichtung.0700//xga:natuerlichePerson[ancestor-or-self::xga:referenzierteSubjekte and ancestor-or-self::xga:natuerlichePerson/np:natuerlichePerson.id =&#xA;            (ancestor::xga:satz/*/xga:gewerbebetrieb/xga:vertretungsberechtigtePerson.id)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-natuerlichePerson-np-staatsangehoerigkeit"/>
      </sch:rule>
   </sch:pattern>
   <sch:pattern>
      <sch:rule id="rule.SCH-EXISTS-xga-natuerlichePerson-np-staatsangehoerigkeit"
                abstract="true">
         <sch:assert id="SCH-EXISTS-xga-natuerlichePerson-np-staatsangehoerigkeit"
                     test="exists(np:staatsangehoerigkeit)">[SCH-EXISTS-xga-natuerlichePerson-np-staatsangehoerigkeit] Das Kindelement np:staatsangehoerigkeit muss in diesem Kontext angegeben werden.</sch:assert>
      </sch:rule>
   </sch:pattern>
   <sch:pattern>
      <sch:rule id="rule.SCH-EMPTY-xga-natuerlichePerson-bk-staatsangehoerigkeitFreitext"
                abstract="true">
         <sch:assert id="SCH-EMPTY-xga-natuerlichePerson-bk-staatsangehoerigkeitFreitext"
                     test="empty(bk:staatsangehoerigkeitFreitext)">[SCH-EMPTY-xga-natuerlichePerson-bk-staatsangehoerigkeitFreitext] Das Kindelement bk:staatsangehoerigkeitFreitext darf in diesem Kontext nicht angegeben werden.</sch:assert>
      </sch:rule>
      <sch:rule context="xga:ea.gewerbemeldung.0220//xga:natuerlichePerson[ancestor-or-self::xga:referenzierteSubjekte and ancestor-or-self::xga:natuerlichePerson/np:natuerlichePerson.id = (ancestor::xga:satz/*/xga:gewerbebetrieb//xga:gewerbetreibender.id,&#xA;            ancestor::xga:satz/*/xga:referenzierteSubjekte//gv:gesetzlicherVertreter.id, ancestor::xga:satz/*/xga:referenzierteSubjekte//ges:gesellschafter.id)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-natuerlichePerson-bk-staatsangehoerigkeitFreitext"/>
      </sch:rule>
      <sch:rule context="xga:rg.gewerbemeldung.0240//xga:natuerlichePerson[ancestor-or-self::xga:referenzierteSubjekte and ancestor-or-self::xga:natuerlichePerson/np:natuerlichePerson.id = (ancestor::xga:satz/*/xga:gewerbebetrieb//xga:gewerbetreibender.id,&#xA;            ancestor::xga:satz/*/xga:referenzierteSubjekte//gv:gesetzlicherVertreter.id, ancestor::xga:satz/*/xga:referenzierteSubjekte//ges:gesellschafter.id)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-natuerlichePerson-bk-staatsangehoerigkeitFreitext"/>
      </sch:rule>
      <sch:rule context="xga:is.gewerbemeldung.0270//xga:natuerlichePerson[ancestor-or-self::xga:referenzierteSubjekte and ancestor-or-self::xga:natuerlichePerson/np:natuerlichePerson.id = (ancestor::xga:satz/*/xga:gewerbebetrieb//xga:gewerbetreibender.id,&#xA;            ancestor::xga:satz/*/xga:referenzierteSubjekte//gv:gesetzlicherVertreter.id, ancestor::xga:satz/*/xga:referenzierteSubjekte//ges:gesellschafter.id)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-natuerlichePerson-bk-staatsangehoerigkeitFreitext"/>
      </sch:rule>
      <sch:rule context="xga:as.gewerbemeldung.0280//xga:natuerlichePerson[ancestor-or-self::xga:referenzierteSubjekte and ancestor-or-self::xga:natuerlichePerson/np:natuerlichePerson.id = (ancestor::xga:satz/*/xga:gewerbebetrieb//xga:gewerbetreibender.id,&#xA;            ancestor::xga:satz/*/xga:referenzierteSubjekte//gv:gesetzlicherVertreter.id, ancestor::xga:satz/*/xga:referenzierteSubjekte//ges:gesellschafter.id)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-natuerlichePerson-bk-staatsangehoerigkeitFreitext"/>
      </sch:rule>
      <sch:rule context="xga:lue.gewerbemeldung.0290//xga:natuerlichePerson[ancestor-or-self::xga:referenzierteSubjekte and ancestor-or-self::xga:natuerlichePerson/np:natuerlichePerson.id = (ancestor::xga:satz/*/xga:gewerbebetrieb//xga:gewerbetreibender.id,&#xA;            ancestor::xga:satz/*/xga:referenzierteSubjekte//gv:gesetzlicherVertreter.id, ancestor::xga:satz/*/xga:referenzierteSubjekte//ges:gesellschafter.id)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-natuerlichePerson-bk-staatsangehoerigkeitFreitext"/>
      </sch:rule>
      <sch:rule context="xga:sta.gewerbemeldung.0100//xga:natuerlichePerson[ancestor-or-self::xga:referenzierteSubjekte and ancestor-or-self::xga:natuerlichePerson/np:natuerlichePerson.id =&#xA;            (ancestor::xga:satz/*/xga:gewerbebetrieb/xga:vertretungsberechtigtePerson.id)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-natuerlichePerson-bk-staatsangehoerigkeitFreitext"/>
      </sch:rule>
      <sch:rule context="xga:ihk.gewerbemeldung.0200//xga:natuerlichePerson[ancestor-or-self::xga:referenzierteSubjekte and ancestor-or-self::xga:natuerlichePerson/np:natuerlichePerson.id =&#xA;            (ancestor::xga:satz/*/xga:gewerbebetrieb/xga:vertretungsberechtigtePerson.id)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-natuerlichePerson-bk-staatsangehoerigkeitFreitext"/>
      </sch:rule>
      <sch:rule context="xga:hwk.gewerbemeldung.0210//xga:natuerlichePerson[ancestor-or-self::xga:referenzierteSubjekte and ancestor-or-self::xga:natuerlichePerson/np:natuerlichePerson.id =&#xA;            (ancestor::xga:satz/*/xga:gewerbebetrieb/xga:vertretungsberechtigtePerson.id)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-natuerlichePerson-bk-staatsangehoerigkeitFreitext"/>
      </sch:rule>
      <sch:rule context="xga:ea.gewerbemeldung.0220//xga:natuerlichePerson[ancestor-or-self::xga:referenzierteSubjekte and ancestor-or-self::xga:natuerlichePerson/np:natuerlichePerson.id =&#xA;            (ancestor::xga:satz/*/xga:gewerbebetrieb/xga:vertretungsberechtigtePerson.id)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-natuerlichePerson-bk-staatsangehoerigkeitFreitext"/>
      </sch:rule>
      <sch:rule context="xga:dgu.gewerbemeldung.0230//xga:natuerlichePerson[ancestor-or-self::xga:referenzierteSubjekte and ancestor-or-self::xga:natuerlichePerson/np:natuerlichePerson.id =&#xA;            (ancestor::xga:satz/*/xga:gewerbebetrieb/xga:vertretungsberechtigtePerson.id)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-natuerlichePerson-bk-staatsangehoerigkeitFreitext"/>
      </sch:rule>
      <sch:rule context="xga:rg.gewerbemeldung.0240//xga:natuerlichePerson[ancestor-or-self::xga:referenzierteSubjekte and ancestor-or-self::xga:natuerlichePerson/np:natuerlichePerson.id =&#xA;            (ancestor::xga:satz/*/xga:gewerbebetrieb/xga:vertretungsberechtigtePerson.id)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-natuerlichePerson-bk-staatsangehoerigkeitFreitext"/>
      </sch:rule>
      <sch:rule context="xga:fa.gewerbemeldung.0250//xga:natuerlichePerson[ancestor-or-self::xga:referenzierteSubjekte and ancestor-or-self::xga:natuerlichePerson/np:natuerlichePerson.id =&#xA;            (ancestor::xga:satz/*/xga:gewerbebetrieb/xga:vertretungsberechtigtePerson.id)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-natuerlichePerson-bk-staatsangehoerigkeitFreitext"/>
      </sch:rule>
      <sch:rule context="xga:zv.gewerbemeldung.0260//xga:natuerlichePerson[ancestor-or-self::xga:referenzierteSubjekte and ancestor-or-self::xga:natuerlichePerson/np:natuerlichePerson.id =&#xA;            (ancestor::xga:satz/*/xga:gewerbebetrieb/xga:vertretungsberechtigtePerson.id)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-natuerlichePerson-bk-staatsangehoerigkeitFreitext"/>
      </sch:rule>
      <sch:rule context="xga:is.gewerbemeldung.0270//xga:natuerlichePerson[ancestor-or-self::xga:referenzierteSubjekte and ancestor-or-self::xga:natuerlichePerson/np:natuerlichePerson.id =&#xA;            (ancestor::xga:satz/*/xga:gewerbebetrieb/xga:vertretungsberechtigtePerson.id)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-natuerlichePerson-bk-staatsangehoerigkeitFreitext"/>
      </sch:rule>
      <sch:rule context="xga:as.gewerbemeldung.0280//xga:natuerlichePerson[ancestor-or-self::xga:referenzierteSubjekte and ancestor-or-self::xga:natuerlichePerson/np:natuerlichePerson.id =&#xA;            (ancestor::xga:satz/*/xga:gewerbebetrieb/xga:vertretungsberechtigtePerson.id)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-natuerlichePerson-bk-staatsangehoerigkeitFreitext"/>
      </sch:rule>
      <sch:rule context="xga:lue.gewerbemeldung.0290//xga:natuerlichePerson[ancestor-or-self::xga:referenzierteSubjekte and ancestor-or-self::xga:natuerlichePerson/np:natuerlichePerson.id =&#xA;            (ancestor::xga:satz/*/xga:gewerbebetrieb/xga:vertretungsberechtigtePerson.id)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-natuerlichePerson-bk-staatsangehoerigkeitFreitext"/>
      </sch:rule>
      <sch:rule context="xga:alg.gewerbemeldung.0300//xga:natuerlichePerson[ancestor-or-self::xga:referenzierteSubjekte and ancestor-or-self::xga:natuerlichePerson/np:natuerlichePerson.id =&#xA;            (ancestor::xga:satz/*/xga:gewerbebetrieb/xga:vertretungsberechtigtePerson.id)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-natuerlichePerson-bk-staatsangehoerigkeitFreitext"/>
      </sch:rule>
      <sch:rule context="xga:ext.gewerbemeldung.0400//xga:natuerlichePerson[ancestor-or-self::xga:referenzierteSubjekte and ancestor-or-self::xga:natuerlichePerson/np:natuerlichePerson.id =&#xA;            (ancestor::xga:satz/*/xga:gewerbebetrieb/xga:vertretungsberechtigtePerson.id)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-natuerlichePerson-bk-staatsangehoerigkeitFreitext"/>
      </sch:rule>
      <sch:rule context="xga:abh.gewerbemeldung.0500//xga:natuerlichePerson[ancestor-or-self::xga:referenzierteSubjekte and ancestor-or-self::xga:natuerlichePerson/np:natuerlichePerson.id =&#xA;            (ancestor::xga:satz/*/xga:gewerbebetrieb/xga:vertretungsberechtigtePerson.id)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-natuerlichePerson-bk-staatsangehoerigkeitFreitext"/>
      </sch:rule>
      <sch:rule context="xga:abruf.antwort.0601//xga:natuerlichePerson[ancestor-or-self::xga:referenzierteSubjekte and ancestor-or-self::xga:natuerlichePerson/np:natuerlichePerson.id =&#xA;            (ancestor::xga:satz/*/xga:gewerbebetrieb/xga:vertretungsberechtigtePerson.id)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-natuerlichePerson-bk-staatsangehoerigkeitFreitext"/>
      </sch:rule>
      <sch:rule context="xga:unterrichtung.0700//xga:natuerlichePerson[ancestor-or-self::xga:referenzierteSubjekte and ancestor-or-self::xga:natuerlichePerson/np:natuerlichePerson.id =&#xA;            (ancestor::xga:satz/*/xga:gewerbebetrieb/xga:vertretungsberechtigtePerson.id)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-natuerlichePerson-bk-staatsangehoerigkeitFreitext"/>
      </sch:rule>
   </sch:pattern>
   <sch:pattern>
      <sch:rule id="rule.SCH-EXISTS-xga-natuerlichePerson-bk-staatsangehoerigkeitFreitext"
                abstract="true">
         <sch:assert id="SCH-EXISTS-xga-natuerlichePerson-bk-staatsangehoerigkeitFreitext"
                     test="exists(bk:staatsangehoerigkeitFreitext)">[SCH-EXISTS-xga-natuerlichePerson-bk-staatsangehoerigkeitFreitext] Das Kindelement bk:staatsangehoerigkeitFreitext muss in diesem Kontext angegeben werden.</sch:assert>
      </sch:rule>
   </sch:pattern>
   <sch:pattern>
      <sch:rule id="rule.SCH-EMPTY-xga-natuerlichePerson-xga-aufenthaltstitel"
                abstract="true">
         <sch:assert id="SCH-EMPTY-xga-natuerlichePerson-xga-aufenthaltstitel"
                     test="empty(xga:aufenthaltstitel)">[SCH-EMPTY-xga-natuerlichePerson-xga-aufenthaltstitel] Das Kindelement xga:aufenthaltstitel darf in diesem Kontext nicht angegeben werden.</sch:assert>
      </sch:rule>
      <sch:rule context="xga:sta.gewerbemeldung.0100//xga:natuerlichePerson[ancestor-or-self::xga:referenzierteSubjekte and ancestor-or-self::xga:natuerlichePerson/np:natuerlichePerson.id = (ancestor::xga:satz/*/xga:gewerbebetrieb//xga:gewerbetreibender.id,&#xA;            ancestor::xga:satz/*/xga:referenzierteSubjekte//gv:gesetzlicherVertreter.id, ancestor::xga:satz/*/xga:referenzierteSubjekte//ges:gesellschafter.id)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-natuerlichePerson-xga-aufenthaltstitel"/>
      </sch:rule>
      <sch:rule context="xga:ihk.gewerbemeldung.0200//xga:natuerlichePerson[ancestor-or-self::xga:referenzierteSubjekte and ancestor-or-self::xga:natuerlichePerson/np:natuerlichePerson.id = (ancestor::xga:satz/*/xga:gewerbebetrieb//xga:gewerbetreibender.id,&#xA;            ancestor::xga:satz/*/xga:referenzierteSubjekte//gv:gesetzlicherVertreter.id, ancestor::xga:satz/*/xga:referenzierteSubjekte//ges:gesellschafter.id)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-natuerlichePerson-xga-aufenthaltstitel"/>
      </sch:rule>
      <sch:rule context="xga:hwk.gewerbemeldung.0210//xga:natuerlichePerson[ancestor-or-self::xga:referenzierteSubjekte and ancestor-or-self::xga:natuerlichePerson/np:natuerlichePerson.id = (ancestor::xga:satz/*/xga:gewerbebetrieb//xga:gewerbetreibender.id,&#xA;            ancestor::xga:satz/*/xga:referenzierteSubjekte//gv:gesetzlicherVertreter.id, ancestor::xga:satz/*/xga:referenzierteSubjekte//ges:gesellschafter.id)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-natuerlichePerson-xga-aufenthaltstitel"/>
      </sch:rule>
      <sch:rule context="xga:ea.gewerbemeldung.0220//xga:natuerlichePerson[ancestor-or-self::xga:referenzierteSubjekte and ancestor-or-self::xga:natuerlichePerson/np:natuerlichePerson.id = (ancestor::xga:satz/*/xga:gewerbebetrieb//xga:gewerbetreibender.id,&#xA;            ancestor::xga:satz/*/xga:referenzierteSubjekte//gv:gesetzlicherVertreter.id, ancestor::xga:satz/*/xga:referenzierteSubjekte//ges:gesellschafter.id)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-natuerlichePerson-xga-aufenthaltstitel"/>
      </sch:rule>
      <sch:rule context="xga:dgu.gewerbemeldung.0230//xga:natuerlichePerson[ancestor-or-self::xga:referenzierteSubjekte and ancestor-or-self::xga:natuerlichePerson/np:natuerlichePerson.id = (ancestor::xga:satz/*/xga:gewerbebetrieb//xga:gewerbetreibender.id,&#xA;            ancestor::xga:satz/*/xga:referenzierteSubjekte//gv:gesetzlicherVertreter.id, ancestor::xga:satz/*/xga:referenzierteSubjekte//ges:gesellschafter.id)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-natuerlichePerson-xga-aufenthaltstitel"/>
      </sch:rule>
      <sch:rule context="xga:rg.gewerbemeldung.0240//xga:natuerlichePerson[ancestor-or-self::xga:referenzierteSubjekte and ancestor-or-self::xga:natuerlichePerson/np:natuerlichePerson.id = (ancestor::xga:satz/*/xga:gewerbebetrieb//xga:gewerbetreibender.id,&#xA;            ancestor::xga:satz/*/xga:referenzierteSubjekte//gv:gesetzlicherVertreter.id, ancestor::xga:satz/*/xga:referenzierteSubjekte//ges:gesellschafter.id)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-natuerlichePerson-xga-aufenthaltstitel"/>
      </sch:rule>
      <sch:rule context="xga:fa.gewerbemeldung.0250//xga:natuerlichePerson[ancestor-or-self::xga:referenzierteSubjekte and ancestor-or-self::xga:natuerlichePerson/np:natuerlichePerson.id = (ancestor::xga:satz/*/xga:gewerbebetrieb//xga:gewerbetreibender.id,&#xA;            ancestor::xga:satz/*/xga:referenzierteSubjekte//gv:gesetzlicherVertreter.id, ancestor::xga:satz/*/xga:referenzierteSubjekte//ges:gesellschafter.id)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-natuerlichePerson-xga-aufenthaltstitel"/>
      </sch:rule>
      <sch:rule context="xga:is.gewerbemeldung.0270//xga:natuerlichePerson[ancestor-or-self::xga:referenzierteSubjekte and ancestor-or-self::xga:natuerlichePerson/np:natuerlichePerson.id = (ancestor::xga:satz/*/xga:gewerbebetrieb//xga:gewerbetreibender.id,&#xA;            ancestor::xga:satz/*/xga:referenzierteSubjekte//gv:gesetzlicherVertreter.id, ancestor::xga:satz/*/xga:referenzierteSubjekte//ges:gesellschafter.id)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-natuerlichePerson-xga-aufenthaltstitel"/>
      </sch:rule>
      <sch:rule context="xga:as.gewerbemeldung.0280//xga:natuerlichePerson[ancestor-or-self::xga:referenzierteSubjekte and ancestor-or-self::xga:natuerlichePerson/np:natuerlichePerson.id = (ancestor::xga:satz/*/xga:gewerbebetrieb//xga:gewerbetreibender.id,&#xA;            ancestor::xga:satz/*/xga:referenzierteSubjekte//gv:gesetzlicherVertreter.id, ancestor::xga:satz/*/xga:referenzierteSubjekte//ges:gesellschafter.id)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-natuerlichePerson-xga-aufenthaltstitel"/>
      </sch:rule>
      <sch:rule context="xga:lue.gewerbemeldung.0290//xga:natuerlichePerson[ancestor-or-self::xga:referenzierteSubjekte and ancestor-or-self::xga:natuerlichePerson/np:natuerlichePerson.id = (ancestor::xga:satz/*/xga:gewerbebetrieb//xga:gewerbetreibender.id,&#xA;            ancestor::xga:satz/*/xga:referenzierteSubjekte//gv:gesetzlicherVertreter.id, ancestor::xga:satz/*/xga:referenzierteSubjekte//ges:gesellschafter.id)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-natuerlichePerson-xga-aufenthaltstitel"/>
      </sch:rule>
      <sch:rule context="xga:sta.gewerbemeldung.0100//xga:natuerlichePerson[ancestor-or-self::xga:referenzierteSubjekte and ancestor-or-self::xga:natuerlichePerson/np:natuerlichePerson.id =&#xA;            (ancestor::xga:satz/*/xga:gewerbebetrieb/xga:vertretungsberechtigtePerson.id)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-natuerlichePerson-xga-aufenthaltstitel"/>
      </sch:rule>
      <sch:rule context="xga:ihk.gewerbemeldung.0200//xga:natuerlichePerson[ancestor-or-self::xga:referenzierteSubjekte and ancestor-or-self::xga:natuerlichePerson/np:natuerlichePerson.id =&#xA;            (ancestor::xga:satz/*/xga:gewerbebetrieb/xga:vertretungsberechtigtePerson.id)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-natuerlichePerson-xga-aufenthaltstitel"/>
      </sch:rule>
      <sch:rule context="xga:hwk.gewerbemeldung.0210//xga:natuerlichePerson[ancestor-or-self::xga:referenzierteSubjekte and ancestor-or-self::xga:natuerlichePerson/np:natuerlichePerson.id =&#xA;            (ancestor::xga:satz/*/xga:gewerbebetrieb/xga:vertretungsberechtigtePerson.id)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-natuerlichePerson-xga-aufenthaltstitel"/>
      </sch:rule>
      <sch:rule context="xga:ea.gewerbemeldung.0220//xga:natuerlichePerson[ancestor-or-self::xga:referenzierteSubjekte and ancestor-or-self::xga:natuerlichePerson/np:natuerlichePerson.id =&#xA;            (ancestor::xga:satz/*/xga:gewerbebetrieb/xga:vertretungsberechtigtePerson.id)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-natuerlichePerson-xga-aufenthaltstitel"/>
      </sch:rule>
      <sch:rule context="xga:dgu.gewerbemeldung.0230//xga:natuerlichePerson[ancestor-or-self::xga:referenzierteSubjekte and ancestor-or-self::xga:natuerlichePerson/np:natuerlichePerson.id =&#xA;            (ancestor::xga:satz/*/xga:gewerbebetrieb/xga:vertretungsberechtigtePerson.id)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-natuerlichePerson-xga-aufenthaltstitel"/>
      </sch:rule>
      <sch:rule context="xga:rg.gewerbemeldung.0240//xga:natuerlichePerson[ancestor-or-self::xga:referenzierteSubjekte and ancestor-or-self::xga:natuerlichePerson/np:natuerlichePerson.id =&#xA;            (ancestor::xga:satz/*/xga:gewerbebetrieb/xga:vertretungsberechtigtePerson.id)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-natuerlichePerson-xga-aufenthaltstitel"/>
      </sch:rule>
      <sch:rule context="xga:fa.gewerbemeldung.0250//xga:natuerlichePerson[ancestor-or-self::xga:referenzierteSubjekte and ancestor-or-self::xga:natuerlichePerson/np:natuerlichePerson.id =&#xA;            (ancestor::xga:satz/*/xga:gewerbebetrieb/xga:vertretungsberechtigtePerson.id)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-natuerlichePerson-xga-aufenthaltstitel"/>
      </sch:rule>
      <sch:rule context="xga:zv.gewerbemeldung.0260//xga:natuerlichePerson[ancestor-or-self::xga:referenzierteSubjekte and ancestor-or-self::xga:natuerlichePerson/np:natuerlichePerson.id =&#xA;            (ancestor::xga:satz/*/xga:gewerbebetrieb/xga:vertretungsberechtigtePerson.id)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-natuerlichePerson-xga-aufenthaltstitel"/>
      </sch:rule>
      <sch:rule context="xga:is.gewerbemeldung.0270//xga:natuerlichePerson[ancestor-or-self::xga:referenzierteSubjekte and ancestor-or-self::xga:natuerlichePerson/np:natuerlichePerson.id =&#xA;            (ancestor::xga:satz/*/xga:gewerbebetrieb/xga:vertretungsberechtigtePerson.id)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-natuerlichePerson-xga-aufenthaltstitel"/>
      </sch:rule>
      <sch:rule context="xga:as.gewerbemeldung.0280//xga:natuerlichePerson[ancestor-or-self::xga:referenzierteSubjekte and ancestor-or-self::xga:natuerlichePerson/np:natuerlichePerson.id =&#xA;            (ancestor::xga:satz/*/xga:gewerbebetrieb/xga:vertretungsberechtigtePerson.id)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-natuerlichePerson-xga-aufenthaltstitel"/>
      </sch:rule>
      <sch:rule context="xga:lue.gewerbemeldung.0290//xga:natuerlichePerson[ancestor-or-self::xga:referenzierteSubjekte and ancestor-or-self::xga:natuerlichePerson/np:natuerlichePerson.id =&#xA;            (ancestor::xga:satz/*/xga:gewerbebetrieb/xga:vertretungsberechtigtePerson.id)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-natuerlichePerson-xga-aufenthaltstitel"/>
      </sch:rule>
      <sch:rule context="xga:alg.gewerbemeldung.0300//xga:natuerlichePerson[ancestor-or-self::xga:referenzierteSubjekte and ancestor-or-self::xga:natuerlichePerson/np:natuerlichePerson.id =&#xA;            (ancestor::xga:satz/*/xga:gewerbebetrieb/xga:vertretungsberechtigtePerson.id)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-natuerlichePerson-xga-aufenthaltstitel"/>
      </sch:rule>
      <sch:rule context="xga:ext.gewerbemeldung.0400//xga:natuerlichePerson[ancestor-or-self::xga:referenzierteSubjekte and ancestor-or-self::xga:natuerlichePerson/np:natuerlichePerson.id =&#xA;            (ancestor::xga:satz/*/xga:gewerbebetrieb/xga:vertretungsberechtigtePerson.id)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-natuerlichePerson-xga-aufenthaltstitel"/>
      </sch:rule>
      <sch:rule context="xga:abh.gewerbemeldung.0500//xga:natuerlichePerson[ancestor-or-self::xga:referenzierteSubjekte and ancestor-or-self::xga:natuerlichePerson/np:natuerlichePerson.id =&#xA;            (ancestor::xga:satz/*/xga:gewerbebetrieb/xga:vertretungsberechtigtePerson.id)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-natuerlichePerson-xga-aufenthaltstitel"/>
      </sch:rule>
      <sch:rule context="xga:abruf.antwort.0601//xga:natuerlichePerson[ancestor-or-self::xga:referenzierteSubjekte and ancestor-or-self::xga:natuerlichePerson/np:natuerlichePerson.id =&#xA;            (ancestor::xga:satz/*/xga:gewerbebetrieb/xga:vertretungsberechtigtePerson.id)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-natuerlichePerson-xga-aufenthaltstitel"/>
      </sch:rule>
      <sch:rule context="xga:unterrichtung.0700//xga:natuerlichePerson[ancestor-or-self::xga:referenzierteSubjekte and ancestor-or-self::xga:natuerlichePerson/np:natuerlichePerson.id =&#xA;            (ancestor::xga:satz/*/xga:gewerbebetrieb/xga:vertretungsberechtigtePerson.id)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-natuerlichePerson-xga-aufenthaltstitel"/>
      </sch:rule>
   </sch:pattern>
   <sch:pattern>
      <sch:rule id="rule.SCH-EXISTS-xga-natuerlichePerson-xga-aufenthaltstitel"
                abstract="true">
         <sch:assert id="SCH-EXISTS-xga-natuerlichePerson-xga-aufenthaltstitel"
                     test="exists(xga:aufenthaltstitel)">[SCH-EXISTS-xga-natuerlichePerson-xga-aufenthaltstitel] Das Kindelement xga:aufenthaltstitel muss in diesem Kontext angegeben werden.</sch:assert>
      </sch:rule>
   </sch:pattern>
   <sch:pattern>
      <sch:rule id="rule.SCH-EMPTY-xga-natuerlichePerson-xga-erlaubnis" abstract="true">
         <sch:assert id="SCH-EMPTY-xga-natuerlichePerson-xga-erlaubnis"
                     test="empty(xga:erlaubnis)">[SCH-EMPTY-xga-natuerlichePerson-xga-erlaubnis] Das Kindelement xga:erlaubnis darf in diesem Kontext nicht angegeben werden.</sch:assert>
      </sch:rule>
      <sch:rule context="xga:sta.gewerbemeldung.0100//xga:natuerlichePerson[ancestor-or-self::xga:referenzierteSubjekte and ancestor-or-self::xga:natuerlichePerson/np:natuerlichePerson.id = (ancestor::xga:satz/*/xga:gewerbebetrieb//xga:gewerbetreibender.id,&#xA;            ancestor::xga:satz/*/xga:referenzierteSubjekte//gv:gesetzlicherVertreter.id, ancestor::xga:satz/*/xga:referenzierteSubjekte//ges:gesellschafter.id)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-natuerlichePerson-xga-erlaubnis"/>
      </sch:rule>
      <sch:rule context="xga:ea.gewerbemeldung.0220//xga:natuerlichePerson[ancestor-or-self::xga:referenzierteSubjekte and ancestor-or-self::xga:natuerlichePerson/np:natuerlichePerson.id = (ancestor::xga:satz/*/xga:gewerbebetrieb//xga:gewerbetreibender.id,&#xA;            ancestor::xga:satz/*/xga:referenzierteSubjekte//gv:gesetzlicherVertreter.id, ancestor::xga:satz/*/xga:referenzierteSubjekte//ges:gesellschafter.id)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-natuerlichePerson-xga-erlaubnis"/>
      </sch:rule>
      <sch:rule context="xga:dgu.gewerbemeldung.0230//xga:natuerlichePerson[ancestor-or-self::xga:referenzierteSubjekte and ancestor-or-self::xga:natuerlichePerson/np:natuerlichePerson.id = (ancestor::xga:satz/*/xga:gewerbebetrieb//xga:gewerbetreibender.id,&#xA;            ancestor::xga:satz/*/xga:referenzierteSubjekte//gv:gesetzlicherVertreter.id, ancestor::xga:satz/*/xga:referenzierteSubjekte//ges:gesellschafter.id)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-natuerlichePerson-xga-erlaubnis"/>
      </sch:rule>
      <sch:rule context="xga:rg.gewerbemeldung.0240//xga:natuerlichePerson[ancestor-or-self::xga:referenzierteSubjekte and ancestor-or-self::xga:natuerlichePerson/np:natuerlichePerson.id = (ancestor::xga:satz/*/xga:gewerbebetrieb//xga:gewerbetreibender.id,&#xA;            ancestor::xga:satz/*/xga:referenzierteSubjekte//gv:gesetzlicherVertreter.id, ancestor::xga:satz/*/xga:referenzierteSubjekte//ges:gesellschafter.id)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-natuerlichePerson-xga-erlaubnis"/>
      </sch:rule>
      <sch:rule context="xga:fa.gewerbemeldung.0250//xga:natuerlichePerson[ancestor-or-self::xga:referenzierteSubjekte and ancestor-or-self::xga:natuerlichePerson/np:natuerlichePerson.id = (ancestor::xga:satz/*/xga:gewerbebetrieb//xga:gewerbetreibender.id,&#xA;            ancestor::xga:satz/*/xga:referenzierteSubjekte//gv:gesetzlicherVertreter.id, ancestor::xga:satz/*/xga:referenzierteSubjekte//ges:gesellschafter.id)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-natuerlichePerson-xga-erlaubnis"/>
      </sch:rule>
      <sch:rule context="xga:is.gewerbemeldung.0270//xga:natuerlichePerson[ancestor-or-self::xga:referenzierteSubjekte and ancestor-or-self::xga:natuerlichePerson/np:natuerlichePerson.id = (ancestor::xga:satz/*/xga:gewerbebetrieb//xga:gewerbetreibender.id,&#xA;            ancestor::xga:satz/*/xga:referenzierteSubjekte//gv:gesetzlicherVertreter.id, ancestor::xga:satz/*/xga:referenzierteSubjekte//ges:gesellschafter.id)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-natuerlichePerson-xga-erlaubnis"/>
      </sch:rule>
      <sch:rule context="xga:as.gewerbemeldung.0280//xga:natuerlichePerson[ancestor-or-self::xga:referenzierteSubjekte and ancestor-or-self::xga:natuerlichePerson/np:natuerlichePerson.id = (ancestor::xga:satz/*/xga:gewerbebetrieb//xga:gewerbetreibender.id,&#xA;            ancestor::xga:satz/*/xga:referenzierteSubjekte//gv:gesetzlicherVertreter.id, ancestor::xga:satz/*/xga:referenzierteSubjekte//ges:gesellschafter.id)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-natuerlichePerson-xga-erlaubnis"/>
      </sch:rule>
      <sch:rule context="xga:lue.gewerbemeldung.0290//xga:natuerlichePerson[ancestor-or-self::xga:referenzierteSubjekte and ancestor-or-self::xga:natuerlichePerson/np:natuerlichePerson.id = (ancestor::xga:satz/*/xga:gewerbebetrieb//xga:gewerbetreibender.id,&#xA;            ancestor::xga:satz/*/xga:referenzierteSubjekte//gv:gesetzlicherVertreter.id, ancestor::xga:satz/*/xga:referenzierteSubjekte//ges:gesellschafter.id)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-natuerlichePerson-xga-erlaubnis"/>
      </sch:rule>
      <sch:rule context="xga:abh.gewerbemeldung.0500//xga:natuerlichePerson[ancestor-or-self::xga:referenzierteSubjekte and ancestor-or-self::xga:natuerlichePerson/np:natuerlichePerson.id = (ancestor::xga:satz/*/xga:gewerbebetrieb//xga:gewerbetreibender.id,&#xA;            ancestor::xga:satz/*/xga:referenzierteSubjekte//gv:gesetzlicherVertreter.id, ancestor::xga:satz/*/xga:referenzierteSubjekte//ges:gesellschafter.id)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-natuerlichePerson-xga-erlaubnis"/>
      </sch:rule>
      <sch:rule context="xga:sta.gewerbemeldung.0100//xga:natuerlichePerson[ancestor-or-self::xga:referenzierteSubjekte and ancestor-or-self::xga:natuerlichePerson/np:natuerlichePerson.id =&#xA;            (ancestor::xga:satz/*/xga:gewerbebetrieb/xga:vertretungsberechtigtePerson.id)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-natuerlichePerson-xga-erlaubnis"/>
      </sch:rule>
      <sch:rule context="xga:ihk.gewerbemeldung.0200//xga:natuerlichePerson[ancestor-or-self::xga:referenzierteSubjekte and ancestor-or-self::xga:natuerlichePerson/np:natuerlichePerson.id =&#xA;            (ancestor::xga:satz/*/xga:gewerbebetrieb/xga:vertretungsberechtigtePerson.id)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-natuerlichePerson-xga-erlaubnis"/>
      </sch:rule>
      <sch:rule context="xga:hwk.gewerbemeldung.0210//xga:natuerlichePerson[ancestor-or-self::xga:referenzierteSubjekte and ancestor-or-self::xga:natuerlichePerson/np:natuerlichePerson.id =&#xA;            (ancestor::xga:satz/*/xga:gewerbebetrieb/xga:vertretungsberechtigtePerson.id)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-natuerlichePerson-xga-erlaubnis"/>
      </sch:rule>
      <sch:rule context="xga:ea.gewerbemeldung.0220//xga:natuerlichePerson[ancestor-or-self::xga:referenzierteSubjekte and ancestor-or-self::xga:natuerlichePerson/np:natuerlichePerson.id =&#xA;            (ancestor::xga:satz/*/xga:gewerbebetrieb/xga:vertretungsberechtigtePerson.id)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-natuerlichePerson-xga-erlaubnis"/>
      </sch:rule>
      <sch:rule context="xga:dgu.gewerbemeldung.0230//xga:natuerlichePerson[ancestor-or-self::xga:referenzierteSubjekte and ancestor-or-self::xga:natuerlichePerson/np:natuerlichePerson.id =&#xA;            (ancestor::xga:satz/*/xga:gewerbebetrieb/xga:vertretungsberechtigtePerson.id)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-natuerlichePerson-xga-erlaubnis"/>
      </sch:rule>
      <sch:rule context="xga:rg.gewerbemeldung.0240//xga:natuerlichePerson[ancestor-or-self::xga:referenzierteSubjekte and ancestor-or-self::xga:natuerlichePerson/np:natuerlichePerson.id =&#xA;            (ancestor::xga:satz/*/xga:gewerbebetrieb/xga:vertretungsberechtigtePerson.id)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-natuerlichePerson-xga-erlaubnis"/>
      </sch:rule>
      <sch:rule context="xga:fa.gewerbemeldung.0250//xga:natuerlichePerson[ancestor-or-self::xga:referenzierteSubjekte and ancestor-or-self::xga:natuerlichePerson/np:natuerlichePerson.id =&#xA;            (ancestor::xga:satz/*/xga:gewerbebetrieb/xga:vertretungsberechtigtePerson.id)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-natuerlichePerson-xga-erlaubnis"/>
      </sch:rule>
      <sch:rule context="xga:zv.gewerbemeldung.0260//xga:natuerlichePerson[ancestor-or-self::xga:referenzierteSubjekte and ancestor-or-self::xga:natuerlichePerson/np:natuerlichePerson.id =&#xA;            (ancestor::xga:satz/*/xga:gewerbebetrieb/xga:vertretungsberechtigtePerson.id)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-natuerlichePerson-xga-erlaubnis"/>
      </sch:rule>
      <sch:rule context="xga:is.gewerbemeldung.0270//xga:natuerlichePerson[ancestor-or-self::xga:referenzierteSubjekte and ancestor-or-self::xga:natuerlichePerson/np:natuerlichePerson.id =&#xA;            (ancestor::xga:satz/*/xga:gewerbebetrieb/xga:vertretungsberechtigtePerson.id)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-natuerlichePerson-xga-erlaubnis"/>
      </sch:rule>
      <sch:rule context="xga:as.gewerbemeldung.0280//xga:natuerlichePerson[ancestor-or-self::xga:referenzierteSubjekte and ancestor-or-self::xga:natuerlichePerson/np:natuerlichePerson.id =&#xA;            (ancestor::xga:satz/*/xga:gewerbebetrieb/xga:vertretungsberechtigtePerson.id)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-natuerlichePerson-xga-erlaubnis"/>
      </sch:rule>
      <sch:rule context="xga:lue.gewerbemeldung.0290//xga:natuerlichePerson[ancestor-or-self::xga:referenzierteSubjekte and ancestor-or-self::xga:natuerlichePerson/np:natuerlichePerson.id =&#xA;            (ancestor::xga:satz/*/xga:gewerbebetrieb/xga:vertretungsberechtigtePerson.id)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-natuerlichePerson-xga-erlaubnis"/>
      </sch:rule>
      <sch:rule context="xga:alg.gewerbemeldung.0300//xga:natuerlichePerson[ancestor-or-self::xga:referenzierteSubjekte and ancestor-or-self::xga:natuerlichePerson/np:natuerlichePerson.id =&#xA;            (ancestor::xga:satz/*/xga:gewerbebetrieb/xga:vertretungsberechtigtePerson.id)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-natuerlichePerson-xga-erlaubnis"/>
      </sch:rule>
      <sch:rule context="xga:ext.gewerbemeldung.0400//xga:natuerlichePerson[ancestor-or-self::xga:referenzierteSubjekte and ancestor-or-self::xga:natuerlichePerson/np:natuerlichePerson.id =&#xA;            (ancestor::xga:satz/*/xga:gewerbebetrieb/xga:vertretungsberechtigtePerson.id)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-natuerlichePerson-xga-erlaubnis"/>
      </sch:rule>
      <sch:rule context="xga:abh.gewerbemeldung.0500//xga:natuerlichePerson[ancestor-or-self::xga:referenzierteSubjekte and ancestor-or-self::xga:natuerlichePerson/np:natuerlichePerson.id =&#xA;            (ancestor::xga:satz/*/xga:gewerbebetrieb/xga:vertretungsberechtigtePerson.id)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-natuerlichePerson-xga-erlaubnis"/>
      </sch:rule>
      <sch:rule context="xga:abruf.antwort.0601//xga:natuerlichePerson[ancestor-or-self::xga:referenzierteSubjekte and ancestor-or-self::xga:natuerlichePerson/np:natuerlichePerson.id =&#xA;            (ancestor::xga:satz/*/xga:gewerbebetrieb/xga:vertretungsberechtigtePerson.id)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-natuerlichePerson-xga-erlaubnis"/>
      </sch:rule>
      <sch:rule context="xga:unterrichtung.0700//xga:natuerlichePerson[ancestor-or-self::xga:referenzierteSubjekte and ancestor-or-self::xga:natuerlichePerson/np:natuerlichePerson.id =&#xA;            (ancestor::xga:satz/*/xga:gewerbebetrieb/xga:vertretungsberechtigtePerson.id)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-natuerlichePerson-xga-erlaubnis"/>
      </sch:rule>
   </sch:pattern>
   <sch:pattern>
      <sch:rule id="rule.SCH-EXISTS-xga-natuerlichePerson-xga-erlaubnis"
                abstract="true">
         <sch:assert id="SCH-EXISTS-xga-natuerlichePerson-xga-erlaubnis"
                     test="exists(xga:erlaubnis)">[SCH-EXISTS-xga-natuerlichePerson-xga-erlaubnis] Das Kindelement xga:erlaubnis muss in diesem Kontext angegeben werden.</sch:assert>
      </sch:rule>
   </sch:pattern>
   <sch:pattern>
      <sch:rule id="rule.SCH-EMPTY-xga-natuerlichePerson-xga-fachverfahrenskennziffer"
                abstract="true">
         <sch:assert id="SCH-EMPTY-xga-natuerlichePerson-xga-fachverfahrenskennziffer"
                     test="empty(xga:fachverfahrenskennziffer)">[SCH-EMPTY-xga-natuerlichePerson-xga-fachverfahrenskennziffer] Das Kindelement xga:fachverfahrenskennziffer darf in diesem Kontext nicht angegeben werden.</sch:assert>
      </sch:rule>
      <sch:rule context="xga:sta.gewerbemeldung.0100//xga:natuerlichePerson[ancestor-or-self::xga:referenzierteSubjekte and ancestor-or-self::xga:natuerlichePerson/np:natuerlichePerson.id = (ancestor::xga:satz/*/xga:gewerbebetrieb//xga:gewerbetreibender.id,&#xA;            ancestor::xga:satz/*/xga:referenzierteSubjekte//gv:gesetzlicherVertreter.id, ancestor::xga:satz/*/xga:referenzierteSubjekte//ges:gesellschafter.id)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-natuerlichePerson-xga-fachverfahrenskennziffer"/>
      </sch:rule>
      <sch:rule context="xga:ihk.gewerbemeldung.0200//xga:natuerlichePerson[ancestor-or-self::xga:referenzierteSubjekte and ancestor-or-self::xga:natuerlichePerson/np:natuerlichePerson.id = (ancestor::xga:satz/*/xga:gewerbebetrieb//xga:gewerbetreibender.id,&#xA;            ancestor::xga:satz/*/xga:referenzierteSubjekte//gv:gesetzlicherVertreter.id, ancestor::xga:satz/*/xga:referenzierteSubjekte//ges:gesellschafter.id)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-natuerlichePerson-xga-fachverfahrenskennziffer"/>
      </sch:rule>
      <sch:rule context="xga:hwk.gewerbemeldung.0210//xga:natuerlichePerson[ancestor-or-self::xga:referenzierteSubjekte and ancestor-or-self::xga:natuerlichePerson/np:natuerlichePerson.id = (ancestor::xga:satz/*/xga:gewerbebetrieb//xga:gewerbetreibender.id,&#xA;            ancestor::xga:satz/*/xga:referenzierteSubjekte//gv:gesetzlicherVertreter.id, ancestor::xga:satz/*/xga:referenzierteSubjekte//ges:gesellschafter.id)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-natuerlichePerson-xga-fachverfahrenskennziffer"/>
      </sch:rule>
      <sch:rule context="xga:ea.gewerbemeldung.0220//xga:natuerlichePerson[ancestor-or-self::xga:referenzierteSubjekte and ancestor-or-self::xga:natuerlichePerson/np:natuerlichePerson.id = (ancestor::xga:satz/*/xga:gewerbebetrieb//xga:gewerbetreibender.id,&#xA;            ancestor::xga:satz/*/xga:referenzierteSubjekte//gv:gesetzlicherVertreter.id, ancestor::xga:satz/*/xga:referenzierteSubjekte//ges:gesellschafter.id)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-natuerlichePerson-xga-fachverfahrenskennziffer"/>
      </sch:rule>
      <sch:rule context="xga:dgu.gewerbemeldung.0230//xga:natuerlichePerson[ancestor-or-self::xga:referenzierteSubjekte and ancestor-or-self::xga:natuerlichePerson/np:natuerlichePerson.id = (ancestor::xga:satz/*/xga:gewerbebetrieb//xga:gewerbetreibender.id,&#xA;            ancestor::xga:satz/*/xga:referenzierteSubjekte//gv:gesetzlicherVertreter.id, ancestor::xga:satz/*/xga:referenzierteSubjekte//ges:gesellschafter.id)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-natuerlichePerson-xga-fachverfahrenskennziffer"/>
      </sch:rule>
      <sch:rule context="xga:rg.gewerbemeldung.0240//xga:natuerlichePerson[ancestor-or-self::xga:referenzierteSubjekte and ancestor-or-self::xga:natuerlichePerson/np:natuerlichePerson.id = (ancestor::xga:satz/*/xga:gewerbebetrieb//xga:gewerbetreibender.id,&#xA;            ancestor::xga:satz/*/xga:referenzierteSubjekte//gv:gesetzlicherVertreter.id, ancestor::xga:satz/*/xga:referenzierteSubjekte//ges:gesellschafter.id)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-natuerlichePerson-xga-fachverfahrenskennziffer"/>
      </sch:rule>
      <sch:rule context="xga:fa.gewerbemeldung.0250//xga:natuerlichePerson[ancestor-or-self::xga:referenzierteSubjekte and ancestor-or-self::xga:natuerlichePerson/np:natuerlichePerson.id = (ancestor::xga:satz/*/xga:gewerbebetrieb//xga:gewerbetreibender.id,&#xA;            ancestor::xga:satz/*/xga:referenzierteSubjekte//gv:gesetzlicherVertreter.id, ancestor::xga:satz/*/xga:referenzierteSubjekte//ges:gesellschafter.id)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-natuerlichePerson-xga-fachverfahrenskennziffer"/>
      </sch:rule>
      <sch:rule context="xga:zv.gewerbemeldung.0260//xga:natuerlichePerson[ancestor-or-self::xga:referenzierteSubjekte and ancestor-or-self::xga:natuerlichePerson/np:natuerlichePerson.id = (ancestor::xga:satz/*/xga:gewerbebetrieb//xga:gewerbetreibender.id,&#xA;            ancestor::xga:satz/*/xga:referenzierteSubjekte//gv:gesetzlicherVertreter.id, ancestor::xga:satz/*/xga:referenzierteSubjekte//ges:gesellschafter.id)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-natuerlichePerson-xga-fachverfahrenskennziffer"/>
      </sch:rule>
      <sch:rule context="xga:is.gewerbemeldung.0270//xga:natuerlichePerson[ancestor-or-self::xga:referenzierteSubjekte and ancestor-or-self::xga:natuerlichePerson/np:natuerlichePerson.id = (ancestor::xga:satz/*/xga:gewerbebetrieb//xga:gewerbetreibender.id,&#xA;            ancestor::xga:satz/*/xga:referenzierteSubjekte//gv:gesetzlicherVertreter.id, ancestor::xga:satz/*/xga:referenzierteSubjekte//ges:gesellschafter.id)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-natuerlichePerson-xga-fachverfahrenskennziffer"/>
      </sch:rule>
      <sch:rule context="xga:as.gewerbemeldung.0280//xga:natuerlichePerson[ancestor-or-self::xga:referenzierteSubjekte and ancestor-or-self::xga:natuerlichePerson/np:natuerlichePerson.id = (ancestor::xga:satz/*/xga:gewerbebetrieb//xga:gewerbetreibender.id,&#xA;            ancestor::xga:satz/*/xga:referenzierteSubjekte//gv:gesetzlicherVertreter.id, ancestor::xga:satz/*/xga:referenzierteSubjekte//ges:gesellschafter.id)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-natuerlichePerson-xga-fachverfahrenskennziffer"/>
      </sch:rule>
      <sch:rule context="xga:lue.gewerbemeldung.0290//xga:natuerlichePerson[ancestor-or-self::xga:referenzierteSubjekte and ancestor-or-self::xga:natuerlichePerson/np:natuerlichePerson.id = (ancestor::xga:satz/*/xga:gewerbebetrieb//xga:gewerbetreibender.id,&#xA;            ancestor::xga:satz/*/xga:referenzierteSubjekte//gv:gesetzlicherVertreter.id, ancestor::xga:satz/*/xga:referenzierteSubjekte//ges:gesellschafter.id)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-natuerlichePerson-xga-fachverfahrenskennziffer"/>
      </sch:rule>
      <sch:rule context="xga:ext.gewerbemeldung.0400//xga:natuerlichePerson[ancestor-or-self::xga:referenzierteSubjekte and ancestor-or-self::xga:natuerlichePerson/np:natuerlichePerson.id = (ancestor::xga:satz/*/xga:gewerbebetrieb//xga:gewerbetreibender.id,&#xA;            ancestor::xga:satz/*/xga:referenzierteSubjekte//gv:gesetzlicherVertreter.id, ancestor::xga:satz/*/xga:referenzierteSubjekte//ges:gesellschafter.id)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-natuerlichePerson-xga-fachverfahrenskennziffer"/>
      </sch:rule>
      <sch:rule context="xga:abh.gewerbemeldung.0500//xga:natuerlichePerson[ancestor-or-self::xga:referenzierteSubjekte and ancestor-or-self::xga:natuerlichePerson/np:natuerlichePerson.id = (ancestor::xga:satz/*/xga:gewerbebetrieb//xga:gewerbetreibender.id,&#xA;            ancestor::xga:satz/*/xga:referenzierteSubjekte//gv:gesetzlicherVertreter.id, ancestor::xga:satz/*/xga:referenzierteSubjekte//ges:gesellschafter.id)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-natuerlichePerson-xga-fachverfahrenskennziffer"/>
      </sch:rule>
      <sch:rule context="xga:sta.gewerbemeldung.0100//xga:natuerlichePerson[ancestor-or-self::xga:referenzierteSubjekte and ancestor-or-self::xga:natuerlichePerson/np:natuerlichePerson.id =&#xA;            (ancestor::xga:satz/*/xga:gewerbebetrieb/xga:vertretungsberechtigtePerson.id)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-natuerlichePerson-xga-fachverfahrenskennziffer"/>
      </sch:rule>
      <sch:rule context="xga:ihk.gewerbemeldung.0200//xga:natuerlichePerson[ancestor-or-self::xga:referenzierteSubjekte and ancestor-or-self::xga:natuerlichePerson/np:natuerlichePerson.id =&#xA;            (ancestor::xga:satz/*/xga:gewerbebetrieb/xga:vertretungsberechtigtePerson.id)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-natuerlichePerson-xga-fachverfahrenskennziffer"/>
      </sch:rule>
      <sch:rule context="xga:hwk.gewerbemeldung.0210//xga:natuerlichePerson[ancestor-or-self::xga:referenzierteSubjekte and ancestor-or-self::xga:natuerlichePerson/np:natuerlichePerson.id =&#xA;            (ancestor::xga:satz/*/xga:gewerbebetrieb/xga:vertretungsberechtigtePerson.id)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-natuerlichePerson-xga-fachverfahrenskennziffer"/>
      </sch:rule>
      <sch:rule context="xga:ea.gewerbemeldung.0220//xga:natuerlichePerson[ancestor-or-self::xga:referenzierteSubjekte and ancestor-or-self::xga:natuerlichePerson/np:natuerlichePerson.id =&#xA;            (ancestor::xga:satz/*/xga:gewerbebetrieb/xga:vertretungsberechtigtePerson.id)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-natuerlichePerson-xga-fachverfahrenskennziffer"/>
      </sch:rule>
      <sch:rule context="xga:dgu.gewerbemeldung.0230//xga:natuerlichePerson[ancestor-or-self::xga:referenzierteSubjekte and ancestor-or-self::xga:natuerlichePerson/np:natuerlichePerson.id =&#xA;            (ancestor::xga:satz/*/xga:gewerbebetrieb/xga:vertretungsberechtigtePerson.id)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-natuerlichePerson-xga-fachverfahrenskennziffer"/>
      </sch:rule>
      <sch:rule context="xga:rg.gewerbemeldung.0240//xga:natuerlichePerson[ancestor-or-self::xga:referenzierteSubjekte and ancestor-or-self::xga:natuerlichePerson/np:natuerlichePerson.id =&#xA;            (ancestor::xga:satz/*/xga:gewerbebetrieb/xga:vertretungsberechtigtePerson.id)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-natuerlichePerson-xga-fachverfahrenskennziffer"/>
      </sch:rule>
      <sch:rule context="xga:fa.gewerbemeldung.0250//xga:natuerlichePerson[ancestor-or-self::xga:referenzierteSubjekte and ancestor-or-self::xga:natuerlichePerson/np:natuerlichePerson.id =&#xA;            (ancestor::xga:satz/*/xga:gewerbebetrieb/xga:vertretungsberechtigtePerson.id)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-natuerlichePerson-xga-fachverfahrenskennziffer"/>
      </sch:rule>
      <sch:rule context="xga:zv.gewerbemeldung.0260//xga:natuerlichePerson[ancestor-or-self::xga:referenzierteSubjekte and ancestor-or-self::xga:natuerlichePerson/np:natuerlichePerson.id =&#xA;            (ancestor::xga:satz/*/xga:gewerbebetrieb/xga:vertretungsberechtigtePerson.id)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-natuerlichePerson-xga-fachverfahrenskennziffer"/>
      </sch:rule>
      <sch:rule context="xga:is.gewerbemeldung.0270//xga:natuerlichePerson[ancestor-or-self::xga:referenzierteSubjekte and ancestor-or-self::xga:natuerlichePerson/np:natuerlichePerson.id =&#xA;            (ancestor::xga:satz/*/xga:gewerbebetrieb/xga:vertretungsberechtigtePerson.id)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-natuerlichePerson-xga-fachverfahrenskennziffer"/>
      </sch:rule>
      <sch:rule context="xga:as.gewerbemeldung.0280//xga:natuerlichePerson[ancestor-or-self::xga:referenzierteSubjekte and ancestor-or-self::xga:natuerlichePerson/np:natuerlichePerson.id =&#xA;            (ancestor::xga:satz/*/xga:gewerbebetrieb/xga:vertretungsberechtigtePerson.id)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-natuerlichePerson-xga-fachverfahrenskennziffer"/>
      </sch:rule>
      <sch:rule context="xga:lue.gewerbemeldung.0290//xga:natuerlichePerson[ancestor-or-self::xga:referenzierteSubjekte and ancestor-or-self::xga:natuerlichePerson/np:natuerlichePerson.id =&#xA;            (ancestor::xga:satz/*/xga:gewerbebetrieb/xga:vertretungsberechtigtePerson.id)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-natuerlichePerson-xga-fachverfahrenskennziffer"/>
      </sch:rule>
      <sch:rule context="xga:alg.gewerbemeldung.0300//xga:natuerlichePerson[ancestor-or-self::xga:referenzierteSubjekte and ancestor-or-self::xga:natuerlichePerson/np:natuerlichePerson.id =&#xA;            (ancestor::xga:satz/*/xga:gewerbebetrieb/xga:vertretungsberechtigtePerson.id)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-natuerlichePerson-xga-fachverfahrenskennziffer"/>
      </sch:rule>
      <sch:rule context="xga:ext.gewerbemeldung.0400//xga:natuerlichePerson[ancestor-or-self::xga:referenzierteSubjekte and ancestor-or-self::xga:natuerlichePerson/np:natuerlichePerson.id =&#xA;            (ancestor::xga:satz/*/xga:gewerbebetrieb/xga:vertretungsberechtigtePerson.id)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-natuerlichePerson-xga-fachverfahrenskennziffer"/>
      </sch:rule>
      <sch:rule context="xga:abh.gewerbemeldung.0500//xga:natuerlichePerson[ancestor-or-self::xga:referenzierteSubjekte and ancestor-or-self::xga:natuerlichePerson/np:natuerlichePerson.id =&#xA;            (ancestor::xga:satz/*/xga:gewerbebetrieb/xga:vertretungsberechtigtePerson.id)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-natuerlichePerson-xga-fachverfahrenskennziffer"/>
      </sch:rule>
      <sch:rule context="xga:abruf.antwort.0601//xga:natuerlichePerson[ancestor-or-self::xga:referenzierteSubjekte and ancestor-or-self::xga:natuerlichePerson/np:natuerlichePerson.id =&#xA;            (ancestor::xga:satz/*/xga:gewerbebetrieb/xga:vertretungsberechtigtePerson.id)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-natuerlichePerson-xga-fachverfahrenskennziffer"/>
      </sch:rule>
      <sch:rule context="xga:unterrichtung.0700//xga:natuerlichePerson[ancestor-or-self::xga:referenzierteSubjekte and ancestor-or-self::xga:natuerlichePerson/np:natuerlichePerson.id =&#xA;            (ancestor::xga:satz/*/xga:gewerbebetrieb/xga:vertretungsberechtigtePerson.id)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-natuerlichePerson-xga-fachverfahrenskennziffer"/>
      </sch:rule>
   </sch:pattern>
   <sch:pattern>
      <sch:rule id="rule.SCH-EXISTS-xga-natuerlichePerson-xga-fachverfahrenskennziffer"
                abstract="true">
         <sch:assert id="SCH-EXISTS-xga-natuerlichePerson-xga-fachverfahrenskennziffer"
                     test="exists(xga:fachverfahrenskennziffer)">[SCH-EXISTS-xga-natuerlichePerson-xga-fachverfahrenskennziffer] Das Kindelement xga:fachverfahrenskennziffer muss in diesem Kontext angegeben werden.</sch:assert>
      </sch:rule>
   </sch:pattern>
   <sch:pattern>
      <sch:rule id="rule.SCH-EMPTY-xga-juristischePerson-xga-anzahlGesetzlicheVertreter"
                abstract="true">
         <sch:assert id="SCH-EMPTY-xga-juristischePerson-xga-anzahlGesetzlicheVertreter"
                     test="empty(xga:anzahlGesetzlicheVertreter)">[SCH-EMPTY-xga-juristischePerson-xga-anzahlGesetzlicheVertreter] Das Kindelement xga:anzahlGesetzlicheVertreter darf in diesem Kontext nicht angegeben werden.</sch:assert>
      </sch:rule>
      <sch:rule context="xga:ea.gewerbemeldung.0220//xga:juristischePerson[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-juristischePerson-xga-anzahlGesetzlicheVertreter"/>
      </sch:rule>
      <sch:rule context="xga:dgu.gewerbemeldung.0230//xga:juristischePerson[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-juristischePerson-xga-anzahlGesetzlicheVertreter"/>
      </sch:rule>
      <sch:rule context="xga:rg.gewerbemeldung.0240//xga:juristischePerson[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-juristischePerson-xga-anzahlGesetzlicheVertreter"/>
      </sch:rule>
      <sch:rule context="xga:fa.gewerbemeldung.0250//xga:juristischePerson[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-juristischePerson-xga-anzahlGesetzlicheVertreter"/>
      </sch:rule>
      <sch:rule context="xga:is.gewerbemeldung.0270//xga:juristischePerson[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-juristischePerson-xga-anzahlGesetzlicheVertreter"/>
      </sch:rule>
      <sch:rule context="xga:abh.gewerbemeldung.0500//xga:juristischePerson[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-juristischePerson-xga-anzahlGesetzlicheVertreter"/>
      </sch:rule>
   </sch:pattern>
   <sch:pattern>
      <sch:rule id="rule.SCH-EXISTS-xga-juristischePerson-xga-anzahlGesetzlicheVertreter"
                abstract="true">
         <sch:assert id="SCH-EXISTS-xga-juristischePerson-xga-anzahlGesetzlicheVertreter"
                     test="exists(xga:anzahlGesetzlicheVertreter)">[SCH-EXISTS-xga-juristischePerson-xga-anzahlGesetzlicheVertreter] Das Kindelement xga:anzahlGesetzlicheVertreter muss in diesem Kontext angegeben werden.</sch:assert>
      </sch:rule>
   </sch:pattern>
   <sch:pattern>
      <sch:rule id="rule.SCH-EMPTY-xga-juristischePerson-bk-eintragung" abstract="true">
         <sch:assert id="SCH-EMPTY-xga-juristischePerson-bk-eintragung"
                     test="empty(bk:eintragung)">[SCH-EMPTY-xga-juristischePerson-bk-eintragung] Das Kindelement bk:eintragung darf in diesem Kontext nicht angegeben werden.</sch:assert>
      </sch:rule>
      <sch:rule context="xga:ea.gewerbemeldung.0220//xga:juristischePerson[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-juristischePerson-bk-eintragung"/>
      </sch:rule>
   </sch:pattern>
   <sch:pattern>
      <sch:rule id="rule.SCH-EXISTS-xga-juristischePerson-bk-eintragung"
                abstract="true">
         <sch:assert id="SCH-EXISTS-xga-juristischePerson-bk-eintragung"
                     test="exists(bk:eintragung)">[SCH-EXISTS-xga-juristischePerson-bk-eintragung] Das Kindelement bk:eintragung muss in diesem Kontext angegeben werden.</sch:assert>
      </sch:rule>
   </sch:pattern>
   <sch:pattern>
      <sch:rule id="rule.SCH-EMPTY-xga-juristischePerson-xga-erlaubnis" abstract="true">
         <sch:assert id="SCH-EMPTY-xga-juristischePerson-xga-erlaubnis"
                     test="empty(xga:erlaubnis)">[SCH-EMPTY-xga-juristischePerson-xga-erlaubnis] Das Kindelement xga:erlaubnis darf in diesem Kontext nicht angegeben werden.</sch:assert>
      </sch:rule>
      <sch:rule context="xga:fa.gewerbemeldung.0250//xga:juristischePerson[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-juristischePerson-xga-erlaubnis"/>
      </sch:rule>
      <sch:rule context="xga:abh.gewerbemeldung.0500//xga:juristischePerson[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-juristischePerson-xga-erlaubnis"/>
      </sch:rule>
   </sch:pattern>
   <sch:pattern>
      <sch:rule id="rule.SCH-EXISTS-xga-juristischePerson-xga-erlaubnis"
                abstract="true">
         <sch:assert id="SCH-EXISTS-xga-juristischePerson-xga-erlaubnis"
                     test="exists(xga:erlaubnis)">[SCH-EXISTS-xga-juristischePerson-xga-erlaubnis] Das Kindelement xga:erlaubnis muss in diesem Kontext angegeben werden.</sch:assert>
      </sch:rule>
   </sch:pattern>
   <sch:pattern>
      <sch:rule id="rule.SCH-EMPTY-xga-rechtsfaehigePersonengesellschaft-xga-anzahlGeschaeftsfuehrendeGesellschafter"
                abstract="true">
         <sch:assert id="SCH-EMPTY-xga-rechtsfaehigePersonengesellschaft-xga-anzahlGeschaeftsfuehrendeGesellschafter"
                     test="empty(xga:anzahlGeschaeftsfuehrendeGesellschafter)">[SCH-EMPTY-xga-rechtsfaehigePersonengesellschaft-xga-anzahlGeschaeftsfuehrendeGesellschafter] Das Kindelement xga:anzahlGeschaeftsfuehrendeGesellschafter darf in diesem Kontext nicht angegeben werden.</sch:assert>
      </sch:rule>
      <sch:rule context="xga:ea.gewerbemeldung.0220//xga:rechtsfaehigePersonengesellschaft[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-rechtsfaehigePersonengesellschaft-xga-anzahlGeschaeftsfuehrendeGesellschafter"/>
      </sch:rule>
      <sch:rule context="xga:dgu.gewerbemeldung.0230//xga:rechtsfaehigePersonengesellschaft[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-rechtsfaehigePersonengesellschaft-xga-anzahlGeschaeftsfuehrendeGesellschafter"/>
      </sch:rule>
      <sch:rule context="xga:rg.gewerbemeldung.0240//xga:rechtsfaehigePersonengesellschaft[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-rechtsfaehigePersonengesellschaft-xga-anzahlGeschaeftsfuehrendeGesellschafter"/>
      </sch:rule>
      <sch:rule context="xga:fa.gewerbemeldung.0250//xga:rechtsfaehigePersonengesellschaft[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-rechtsfaehigePersonengesellschaft-xga-anzahlGeschaeftsfuehrendeGesellschafter"/>
      </sch:rule>
      <sch:rule context="xga:is.gewerbemeldung.0270//xga:rechtsfaehigePersonengesellschaft[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-rechtsfaehigePersonengesellschaft-xga-anzahlGeschaeftsfuehrendeGesellschafter"/>
      </sch:rule>
      <sch:rule context="xga:abh.gewerbemeldung.0500//xga:rechtsfaehigePersonengesellschaft[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-rechtsfaehigePersonengesellschaft-xga-anzahlGeschaeftsfuehrendeGesellschafter"/>
      </sch:rule>
   </sch:pattern>
   <sch:pattern>
      <sch:rule id="rule.SCH-EXISTS-xga-rechtsfaehigePersonengesellschaft-xga-anzahlGeschaeftsfuehrendeGesellschafter"
                abstract="true">
         <sch:assert id="SCH-EXISTS-xga-rechtsfaehigePersonengesellschaft-xga-anzahlGeschaeftsfuehrendeGesellschafter"
                     test="exists(xga:anzahlGeschaeftsfuehrendeGesellschafter)">[SCH-EXISTS-xga-rechtsfaehigePersonengesellschaft-xga-anzahlGeschaeftsfuehrendeGesellschafter] Das Kindelement xga:anzahlGeschaeftsfuehrendeGesellschafter muss in diesem Kontext angegeben werden.</sch:assert>
      </sch:rule>
   </sch:pattern>
   <sch:pattern>
      <sch:rule id="rule.SCH-EMPTY-xga-rechtsfaehigePersonengesellschaft-bk-eintragung"
                abstract="true">
         <sch:assert id="SCH-EMPTY-xga-rechtsfaehigePersonengesellschaft-bk-eintragung"
                     test="empty(bk:eintragung)">[SCH-EMPTY-xga-rechtsfaehigePersonengesellschaft-bk-eintragung] Das Kindelement bk:eintragung darf in diesem Kontext nicht angegeben werden.</sch:assert>
      </sch:rule>
      <sch:rule context="xga:ea.gewerbemeldung.0220//xga:rechtsfaehigePersonengesellschaft[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-rechtsfaehigePersonengesellschaft-bk-eintragung"/>
      </sch:rule>
   </sch:pattern>
   <sch:pattern>
      <sch:rule id="rule.SCH-EXISTS-xga-rechtsfaehigePersonengesellschaft-bk-eintragung"
                abstract="true">
         <sch:assert id="SCH-EXISTS-xga-rechtsfaehigePersonengesellschaft-bk-eintragung"
                     test="exists(bk:eintragung)">[SCH-EXISTS-xga-rechtsfaehigePersonengesellschaft-bk-eintragung] Das Kindelement bk:eintragung muss in diesem Kontext angegeben werden.</sch:assert>
      </sch:rule>
   </sch:pattern>
   <sch:pattern>
      <sch:rule id="rule.SCH-EMPTY-xga-rechtsfaehigePersonengesellschaft-xga-erlaubnis"
                abstract="true">
         <sch:assert id="SCH-EMPTY-xga-rechtsfaehigePersonengesellschaft-xga-erlaubnis"
                     test="empty(xga:erlaubnis)">[SCH-EMPTY-xga-rechtsfaehigePersonengesellschaft-xga-erlaubnis] Das Kindelement xga:erlaubnis darf in diesem Kontext nicht angegeben werden.</sch:assert>
      </sch:rule>
      <sch:rule context="xga:fa.gewerbemeldung.0250//xga:rechtsfaehigePersonengesellschaft[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-rechtsfaehigePersonengesellschaft-xga-erlaubnis"/>
      </sch:rule>
      <sch:rule context="xga:abh.gewerbemeldung.0500//xga:rechtsfaehigePersonengesellschaft[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-rechtsfaehigePersonengesellschaft-xga-erlaubnis"/>
      </sch:rule>
   </sch:pattern>
   <sch:pattern>
      <sch:rule id="rule.SCH-EXISTS-xga-rechtsfaehigePersonengesellschaft-xga-erlaubnis"
                abstract="true">
         <sch:assert id="SCH-EXISTS-xga-rechtsfaehigePersonengesellschaft-xga-erlaubnis"
                     test="exists(xga:erlaubnis)">[SCH-EXISTS-xga-rechtsfaehigePersonengesellschaft-xga-erlaubnis] Das Kindelement xga:erlaubnis muss in diesem Kontext angegeben werden.</sch:assert>
      </sch:rule>
   </sch:pattern>
   <sch:pattern>
      <sch:rule id="rule.SCH-EMPTY-xga-sonstigePersonenvereinigung-xga-erlaubnis"
                abstract="true">
         <sch:assert id="SCH-EMPTY-xga-sonstigePersonenvereinigung-xga-erlaubnis"
                     test="empty(xga:erlaubnis)">[SCH-EMPTY-xga-sonstigePersonenvereinigung-xga-erlaubnis] Das Kindelement xga:erlaubnis darf in diesem Kontext nicht angegeben werden.</sch:assert>
      </sch:rule>
      <sch:rule context="xga:fa.gewerbemeldung.0250//xga:sonstigePersonenvereinigung[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-sonstigePersonenvereinigung-xga-erlaubnis"/>
      </sch:rule>
      <sch:rule context="xga:abh.gewerbemeldung.0500//xga:sonstigePersonenvereinigung[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-sonstigePersonenvereinigung-xga-erlaubnis"/>
      </sch:rule>
   </sch:pattern>
   <sch:pattern>
      <sch:rule id="rule.SCH-EXISTS-xga-sonstigePersonenvereinigung-xga-erlaubnis"
                abstract="true">
         <sch:assert id="SCH-EXISTS-xga-sonstigePersonenvereinigung-xga-erlaubnis"
                     test="exists(xga:erlaubnis)">[SCH-EXISTS-xga-sonstigePersonenvereinigung-xga-erlaubnis] Das Kindelement xga:erlaubnis muss in diesem Kontext angegeben werden.</sch:assert>
      </sch:rule>
   </sch:pattern>
   <sch:pattern>
      <sch:rule id="rule.SCH-EMPTY-xga-kuenftigesGewerbe-xga-nameFirmaGewerbetreibender"
                abstract="true">
         <sch:assert id="SCH-EMPTY-xga-kuenftigesGewerbe-xga-nameFirmaGewerbetreibender"
                     test="empty(xga:nameFirmaGewerbetreibender)">[SCH-EMPTY-xga-kuenftigesGewerbe-xga-nameFirmaGewerbetreibender] Das Kindelement xga:nameFirmaGewerbetreibender darf in diesem Kontext nicht angegeben werden.</sch:assert>
      </sch:rule>
      <sch:rule context="xga:sta.gewerbemeldung.0100//xga:kuenftigesGewerbe[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-kuenftigesGewerbe-xga-nameFirmaGewerbetreibender"/>
      </sch:rule>
      <sch:rule context="xga:fa.gewerbemeldung.0250//xga:kuenftigesGewerbe[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-kuenftigesGewerbe-xga-nameFirmaGewerbetreibender"/>
      </sch:rule>
   </sch:pattern>
   <sch:pattern>
      <sch:rule id="rule.SCH-EXISTS-xga-kuenftigesGewerbe-xga-nameFirmaGewerbetreibender"
                abstract="true">
         <sch:assert id="SCH-EXISTS-xga-kuenftigesGewerbe-xga-nameFirmaGewerbetreibender"
                     test="exists(xga:nameFirmaGewerbetreibender)">[SCH-EXISTS-xga-kuenftigesGewerbe-xga-nameFirmaGewerbetreibender] Das Kindelement xga:nameFirmaGewerbetreibender muss in diesem Kontext angegeben werden.</sch:assert>
      </sch:rule>
   </sch:pattern>
   <sch:pattern>
      <sch:rule id="rule.SCH-EMPTY-xga-frueheresGewerbe-xga-nameFirmaGewerbetreibender"
                abstract="true">
         <sch:assert id="SCH-EMPTY-xga-frueheresGewerbe-xga-nameFirmaGewerbetreibender"
                     test="empty(xga:nameFirmaGewerbetreibender)">[SCH-EMPTY-xga-frueheresGewerbe-xga-nameFirmaGewerbetreibender] Das Kindelement xga:nameFirmaGewerbetreibender darf in diesem Kontext nicht angegeben werden.</sch:assert>
      </sch:rule>
      <sch:rule context="xga:sta.gewerbemeldung.0100//xga:frueheresGewerbe[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-frueheresGewerbe-xga-nameFirmaGewerbetreibender"/>
      </sch:rule>
   </sch:pattern>
   <sch:pattern>
      <sch:rule id="rule.SCH-EXISTS-xga-frueheresGewerbe-xga-nameFirmaGewerbetreibender"
                abstract="true">
         <sch:assert id="SCH-EXISTS-xga-frueheresGewerbe-xga-nameFirmaGewerbetreibender"
                     test="exists(xga:nameFirmaGewerbetreibender)">[SCH-EXISTS-xga-frueheresGewerbe-xga-nameFirmaGewerbetreibender] Das Kindelement xga:nameFirmaGewerbetreibender muss in diesem Kontext angegeben werden.</sch:assert>
      </sch:rule>
   </sch:pattern>
   <sch:pattern>
      <sch:rule id="rule.SCH-EMPTY-xga-schwerpunkt-xga-beginnTaetigkeit"
                abstract="true">
         <sch:assert id="SCH-EMPTY-xga-schwerpunkt-xga-beginnTaetigkeit"
                     test="empty(xga:beginnTaetigkeit)">[SCH-EMPTY-xga-schwerpunkt-xga-beginnTaetigkeit] Das Kindelement xga:beginnTaetigkeit darf in diesem Kontext nicht angegeben werden.</sch:assert>
      </sch:rule>
      <sch:rule context="xga:sta.gewerbemeldung.0100//xga:schwerpunkt[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-schwerpunkt-xga-beginnTaetigkeit"/>
      </sch:rule>
      <sch:rule context="xga:ihk.gewerbemeldung.0200//xga:schwerpunkt[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-schwerpunkt-xga-beginnTaetigkeit"/>
      </sch:rule>
      <sch:rule context="xga:hwk.gewerbemeldung.0210//xga:schwerpunkt[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-schwerpunkt-xga-beginnTaetigkeit"/>
      </sch:rule>
      <sch:rule context="xga:ea.gewerbemeldung.0220//xga:schwerpunkt[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-schwerpunkt-xga-beginnTaetigkeit"/>
      </sch:rule>
      <sch:rule context="xga:dgu.gewerbemeldung.0230//xga:schwerpunkt[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-schwerpunkt-xga-beginnTaetigkeit"/>
      </sch:rule>
      <sch:rule context="xga:rg.gewerbemeldung.0240//xga:schwerpunkt[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-schwerpunkt-xga-beginnTaetigkeit"/>
      </sch:rule>
      <sch:rule context="xga:fa.gewerbemeldung.0250//xga:schwerpunkt[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-schwerpunkt-xga-beginnTaetigkeit"/>
      </sch:rule>
      <sch:rule context="xga:zv.gewerbemeldung.0260//xga:schwerpunkt[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-schwerpunkt-xga-beginnTaetigkeit"/>
      </sch:rule>
      <sch:rule context="xga:is.gewerbemeldung.0270//xga:schwerpunkt[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-schwerpunkt-xga-beginnTaetigkeit"/>
      </sch:rule>
      <sch:rule context="xga:as.gewerbemeldung.0280//xga:schwerpunkt[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-schwerpunkt-xga-beginnTaetigkeit"/>
      </sch:rule>
      <sch:rule context="xga:lue.gewerbemeldung.0290//xga:schwerpunkt[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-schwerpunkt-xga-beginnTaetigkeit"/>
      </sch:rule>
      <sch:rule context="xga:ext.gewerbemeldung.0400//xga:schwerpunkt[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-schwerpunkt-xga-beginnTaetigkeit"/>
      </sch:rule>
      <sch:rule context="xga:abh.gewerbemeldung.0500//xga:schwerpunkt[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-schwerpunkt-xga-beginnTaetigkeit"/>
      </sch:rule>
   </sch:pattern>
   <sch:pattern>
      <sch:rule id="rule.SCH-EXISTS-xga-schwerpunkt-xga-beginnTaetigkeit"
                abstract="true">
         <sch:assert id="SCH-EXISTS-xga-schwerpunkt-xga-beginnTaetigkeit"
                     test="exists(xga:beginnTaetigkeit)">[SCH-EXISTS-xga-schwerpunkt-xga-beginnTaetigkeit] Das Kindelement xga:beginnTaetigkeit muss in diesem Kontext angegeben werden.</sch:assert>
      </sch:rule>
   </sch:pattern>
   <sch:pattern>
      <sch:rule id="rule.SCH-EMPTY-xga-schwerpunkt-xga-endeTaetigkeit" abstract="true">
         <sch:assert id="SCH-EMPTY-xga-schwerpunkt-xga-endeTaetigkeit"
                     test="empty(xga:endeTaetigkeit)">[SCH-EMPTY-xga-schwerpunkt-xga-endeTaetigkeit] Das Kindelement xga:endeTaetigkeit darf in diesem Kontext nicht angegeben werden.</sch:assert>
      </sch:rule>
      <sch:rule context="xga:sta.gewerbemeldung.0100//xga:schwerpunkt[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-schwerpunkt-xga-endeTaetigkeit"/>
      </sch:rule>
      <sch:rule context="xga:ihk.gewerbemeldung.0200//xga:schwerpunkt[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-schwerpunkt-xga-endeTaetigkeit"/>
      </sch:rule>
      <sch:rule context="xga:hwk.gewerbemeldung.0210//xga:schwerpunkt[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-schwerpunkt-xga-endeTaetigkeit"/>
      </sch:rule>
      <sch:rule context="xga:ea.gewerbemeldung.0220//xga:schwerpunkt[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-schwerpunkt-xga-endeTaetigkeit"/>
      </sch:rule>
      <sch:rule context="xga:dgu.gewerbemeldung.0230//xga:schwerpunkt[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-schwerpunkt-xga-endeTaetigkeit"/>
      </sch:rule>
      <sch:rule context="xga:rg.gewerbemeldung.0240//xga:schwerpunkt[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-schwerpunkt-xga-endeTaetigkeit"/>
      </sch:rule>
      <sch:rule context="xga:fa.gewerbemeldung.0250//xga:schwerpunkt[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-schwerpunkt-xga-endeTaetigkeit"/>
      </sch:rule>
      <sch:rule context="xga:zv.gewerbemeldung.0260//xga:schwerpunkt[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-schwerpunkt-xga-endeTaetigkeit"/>
      </sch:rule>
      <sch:rule context="xga:is.gewerbemeldung.0270//xga:schwerpunkt[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-schwerpunkt-xga-endeTaetigkeit"/>
      </sch:rule>
      <sch:rule context="xga:as.gewerbemeldung.0280//xga:schwerpunkt[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-schwerpunkt-xga-endeTaetigkeit"/>
      </sch:rule>
      <sch:rule context="xga:lue.gewerbemeldung.0290//xga:schwerpunkt[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-schwerpunkt-xga-endeTaetigkeit"/>
      </sch:rule>
      <sch:rule context="xga:ext.gewerbemeldung.0400//xga:schwerpunkt[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-schwerpunkt-xga-endeTaetigkeit"/>
      </sch:rule>
      <sch:rule context="xga:abh.gewerbemeldung.0500//xga:schwerpunkt[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-schwerpunkt-xga-endeTaetigkeit"/>
      </sch:rule>
   </sch:pattern>
   <sch:pattern>
      <sch:rule id="rule.SCH-EXISTS-xga-schwerpunkt-xga-endeTaetigkeit" abstract="true">
         <sch:assert id="SCH-EXISTS-xga-schwerpunkt-xga-endeTaetigkeit"
                     test="exists(xga:endeTaetigkeit)">[SCH-EXISTS-xga-schwerpunkt-xga-endeTaetigkeit] Das Kindelement xga:endeTaetigkeit muss in diesem Kontext angegeben werden.</sch:assert>
      </sch:rule>
   </sch:pattern>
   <sch:pattern>
      <sch:rule id="rule.SCH-EMPTY-xga-taetigkeit-xga-beginnTaetigkeit" abstract="true">
         <sch:assert id="SCH-EMPTY-xga-taetigkeit-xga-beginnTaetigkeit"
                     test="empty(xga:beginnTaetigkeit)">[SCH-EMPTY-xga-taetigkeit-xga-beginnTaetigkeit] Das Kindelement xga:beginnTaetigkeit darf in diesem Kontext nicht angegeben werden.</sch:assert>
      </sch:rule>
      <sch:rule context="xga:sta.gewerbemeldung.0100//xga:taetigkeit[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-taetigkeit-xga-beginnTaetigkeit"/>
      </sch:rule>
      <sch:rule context="xga:ihk.gewerbemeldung.0200//xga:taetigkeit[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-taetigkeit-xga-beginnTaetigkeit"/>
      </sch:rule>
      <sch:rule context="xga:hwk.gewerbemeldung.0210//xga:taetigkeit[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-taetigkeit-xga-beginnTaetigkeit"/>
      </sch:rule>
      <sch:rule context="xga:ea.gewerbemeldung.0220//xga:taetigkeit[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-taetigkeit-xga-beginnTaetigkeit"/>
      </sch:rule>
      <sch:rule context="xga:dgu.gewerbemeldung.0230//xga:taetigkeit[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-taetigkeit-xga-beginnTaetigkeit"/>
      </sch:rule>
      <sch:rule context="xga:rg.gewerbemeldung.0240//xga:taetigkeit[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-taetigkeit-xga-beginnTaetigkeit"/>
      </sch:rule>
      <sch:rule context="xga:fa.gewerbemeldung.0250//xga:taetigkeit[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-taetigkeit-xga-beginnTaetigkeit"/>
      </sch:rule>
      <sch:rule context="xga:zv.gewerbemeldung.0260//xga:taetigkeit[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-taetigkeit-xga-beginnTaetigkeit"/>
      </sch:rule>
      <sch:rule context="xga:is.gewerbemeldung.0270//xga:taetigkeit[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-taetigkeit-xga-beginnTaetigkeit"/>
      </sch:rule>
      <sch:rule context="xga:as.gewerbemeldung.0280//xga:taetigkeit[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-taetigkeit-xga-beginnTaetigkeit"/>
      </sch:rule>
      <sch:rule context="xga:lue.gewerbemeldung.0290//xga:taetigkeit[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-taetigkeit-xga-beginnTaetigkeit"/>
      </sch:rule>
      <sch:rule context="xga:ext.gewerbemeldung.0400//xga:taetigkeit[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-taetigkeit-xga-beginnTaetigkeit"/>
      </sch:rule>
      <sch:rule context="xga:abh.gewerbemeldung.0500//xga:taetigkeit[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-taetigkeit-xga-beginnTaetigkeit"/>
      </sch:rule>
   </sch:pattern>
   <sch:pattern>
      <sch:rule id="rule.SCH-EXISTS-xga-taetigkeit-xga-beginnTaetigkeit"
                abstract="true">
         <sch:assert id="SCH-EXISTS-xga-taetigkeit-xga-beginnTaetigkeit"
                     test="exists(xga:beginnTaetigkeit)">[SCH-EXISTS-xga-taetigkeit-xga-beginnTaetigkeit] Das Kindelement xga:beginnTaetigkeit muss in diesem Kontext angegeben werden.</sch:assert>
      </sch:rule>
   </sch:pattern>
   <sch:pattern>
      <sch:rule id="rule.SCH-EMPTY-xga-taetigkeit-xga-endeTaetigkeit" abstract="true">
         <sch:assert id="SCH-EMPTY-xga-taetigkeit-xga-endeTaetigkeit"
                     test="empty(xga:endeTaetigkeit)">[SCH-EMPTY-xga-taetigkeit-xga-endeTaetigkeit] Das Kindelement xga:endeTaetigkeit darf in diesem Kontext nicht angegeben werden.</sch:assert>
      </sch:rule>
      <sch:rule context="xga:sta.gewerbemeldung.0100//xga:taetigkeit[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-taetigkeit-xga-endeTaetigkeit"/>
      </sch:rule>
      <sch:rule context="xga:ihk.gewerbemeldung.0200//xga:taetigkeit[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-taetigkeit-xga-endeTaetigkeit"/>
      </sch:rule>
      <sch:rule context="xga:hwk.gewerbemeldung.0210//xga:taetigkeit[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-taetigkeit-xga-endeTaetigkeit"/>
      </sch:rule>
      <sch:rule context="xga:ea.gewerbemeldung.0220//xga:taetigkeit[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-taetigkeit-xga-endeTaetigkeit"/>
      </sch:rule>
      <sch:rule context="xga:dgu.gewerbemeldung.0230//xga:taetigkeit[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-taetigkeit-xga-endeTaetigkeit"/>
      </sch:rule>
      <sch:rule context="xga:rg.gewerbemeldung.0240//xga:taetigkeit[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-taetigkeit-xga-endeTaetigkeit"/>
      </sch:rule>
      <sch:rule context="xga:fa.gewerbemeldung.0250//xga:taetigkeit[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-taetigkeit-xga-endeTaetigkeit"/>
      </sch:rule>
      <sch:rule context="xga:zv.gewerbemeldung.0260//xga:taetigkeit[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-taetigkeit-xga-endeTaetigkeit"/>
      </sch:rule>
      <sch:rule context="xga:is.gewerbemeldung.0270//xga:taetigkeit[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-taetigkeit-xga-endeTaetigkeit"/>
      </sch:rule>
      <sch:rule context="xga:as.gewerbemeldung.0280//xga:taetigkeit[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-taetigkeit-xga-endeTaetigkeit"/>
      </sch:rule>
      <sch:rule context="xga:lue.gewerbemeldung.0290//xga:taetigkeit[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-taetigkeit-xga-endeTaetigkeit"/>
      </sch:rule>
      <sch:rule context="xga:ext.gewerbemeldung.0400//xga:taetigkeit[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-taetigkeit-xga-endeTaetigkeit"/>
      </sch:rule>
      <sch:rule context="xga:abh.gewerbemeldung.0500//xga:taetigkeit[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-taetigkeit-xga-endeTaetigkeit"/>
      </sch:rule>
   </sch:pattern>
   <sch:pattern>
      <sch:rule id="rule.SCH-EXISTS-xga-taetigkeit-xga-endeTaetigkeit" abstract="true">
         <sch:assert id="SCH-EXISTS-xga-taetigkeit-xga-endeTaetigkeit"
                     test="exists(xga:endeTaetigkeit)">[SCH-EXISTS-xga-taetigkeit-xga-endeTaetigkeit] Das Kindelement xga:endeTaetigkeit muss in diesem Kontext angegeben werden.</sch:assert>
      </sch:rule>
   </sch:pattern>
   <sch:pattern>
      <sch:rule id="rule.SCH-EMPTY-xga-taetigkeit-xga-taetigkeitEinzeln"
                abstract="true">
         <sch:assert id="SCH-EMPTY-xga-taetigkeit-xga-taetigkeitEinzeln"
                     test="empty(xga:taetigkeitEinzeln)">[SCH-EMPTY-xga-taetigkeit-xga-taetigkeitEinzeln] Das Kindelement xga:taetigkeitEinzeln darf in diesem Kontext nicht angegeben werden.</sch:assert>
      </sch:rule>
      <sch:rule context="xga:sta.gewerbemeldung.0100//xga:taetigkeit[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-taetigkeit-xga-taetigkeitEinzeln"/>
      </sch:rule>
      <sch:rule context="xga:ihk.gewerbemeldung.0200//xga:taetigkeit[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-taetigkeit-xga-taetigkeitEinzeln"/>
      </sch:rule>
      <sch:rule context="xga:hwk.gewerbemeldung.0210//xga:taetigkeit[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-taetigkeit-xga-taetigkeitEinzeln"/>
      </sch:rule>
      <sch:rule context="xga:ea.gewerbemeldung.0220//xga:taetigkeit[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-taetigkeit-xga-taetigkeitEinzeln"/>
      </sch:rule>
      <sch:rule context="xga:dgu.gewerbemeldung.0230//xga:taetigkeit[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-taetigkeit-xga-taetigkeitEinzeln"/>
      </sch:rule>
      <sch:rule context="xga:rg.gewerbemeldung.0240//xga:taetigkeit[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-taetigkeit-xga-taetigkeitEinzeln"/>
      </sch:rule>
      <sch:rule context="xga:fa.gewerbemeldung.0250//xga:taetigkeit[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-taetigkeit-xga-taetigkeitEinzeln"/>
      </sch:rule>
      <sch:rule context="xga:zv.gewerbemeldung.0260//xga:taetigkeit[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-taetigkeit-xga-taetigkeitEinzeln"/>
      </sch:rule>
      <sch:rule context="xga:is.gewerbemeldung.0270//xga:taetigkeit[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-taetigkeit-xga-taetigkeitEinzeln"/>
      </sch:rule>
      <sch:rule context="xga:as.gewerbemeldung.0280//xga:taetigkeit[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-taetigkeit-xga-taetigkeitEinzeln"/>
      </sch:rule>
      <sch:rule context="xga:lue.gewerbemeldung.0290//xga:taetigkeit[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-taetigkeit-xga-taetigkeitEinzeln"/>
      </sch:rule>
      <sch:rule context="xga:abh.gewerbemeldung.0500//xga:taetigkeit[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-EMPTY-xga-taetigkeit-xga-taetigkeitEinzeln"/>
      </sch:rule>
   </sch:pattern>
   <sch:pattern>
      <sch:rule id="rule.SCH-EXISTS-xga-taetigkeit-xga-taetigkeitEinzeln"
                abstract="true">
         <sch:assert id="SCH-EXISTS-xga-taetigkeit-xga-taetigkeitEinzeln"
                     test="exists(xga:taetigkeitEinzeln)">[SCH-EXISTS-xga-taetigkeit-xga-taetigkeitEinzeln] Das Kindelement xga:taetigkeitEinzeln muss in diesem Kontext angegeben werden.</sch:assert>
      </sch:rule>
   </sch:pattern>
   <sch:pattern>
      <sch:rule id="rule.SCH-EMPTY-erl-gewerbebetrieb-erl-leitenderAngestellter.id"
                abstract="true">
         <sch:assert id="SCH-EMPTY-erl-gewerbebetrieb-erl-leitenderAngestellter.id"
                     test="empty(erl:leitenderAngestellter.id)">[SCH-EMPTY-erl-gewerbebetrieb-erl-leitenderAngestellter.id] Das Kindelement erl:leitenderAngestellter.id darf in diesem Kontext nicht angegeben werden.</sch:assert>
      </sch:rule>
      <sch:rule context="erl:gewo.erlaubnisantrag34c.1010//erl:gewerbebetrieb">
         <sch:extends rule="rule.SCH-EMPTY-erl-gewerbebetrieb-erl-leitenderAngestellter.id"/>
      </sch:rule>
   </sch:pattern>
   <sch:pattern>
      <sch:rule id="rule.SCH-EXISTS-erl-gewerbebetrieb-erl-leitenderAngestellter.id"
                abstract="true">
         <sch:assert id="SCH-EXISTS-erl-gewerbebetrieb-erl-leitenderAngestellter.id"
                     test="exists(erl:leitenderAngestellter.id)">[SCH-EXISTS-erl-gewerbebetrieb-erl-leitenderAngestellter.id] Das Kindelement erl:leitenderAngestellter.id muss in diesem Kontext angegeben werden.</sch:assert>
      </sch:rule>
   </sch:pattern>
   <sch:pattern>
      <sch:rule id="rule.SCH-EMPTY-erl-gewerbebetrieb-erl-sachkundedelegation"
                abstract="true">
         <sch:assert id="SCH-EMPTY-erl-gewerbebetrieb-erl-sachkundedelegation"
                     test="empty(erl:sachkundedelegation)">[SCH-EMPTY-erl-gewerbebetrieb-erl-sachkundedelegation] Das Kindelement erl:sachkundedelegation darf in diesem Kontext nicht angegeben werden.</sch:assert>
      </sch:rule>
      <sch:rule context="erl:gewo.erlaubnisantrag34c.1010//erl:gewerbebetrieb">
         <sch:extends rule="rule.SCH-EMPTY-erl-gewerbebetrieb-erl-sachkundedelegation"/>
      </sch:rule>
   </sch:pattern>
   <sch:pattern>
      <sch:rule id="rule.SCH-EXISTS-erl-gewerbebetrieb-erl-sachkundedelegation"
                abstract="true">
         <sch:assert id="SCH-EXISTS-erl-gewerbebetrieb-erl-sachkundedelegation"
                     test="exists(erl:sachkundedelegation)">[SCH-EXISTS-erl-gewerbebetrieb-erl-sachkundedelegation] Das Kindelement erl:sachkundedelegation muss in diesem Kontext angegeben werden.</sch:assert>
      </sch:rule>
   </sch:pattern>
   <sch:pattern>
      <sch:rule id="rule.SCH-EMPTY-erl-gewerbebetrieb-erl-angabenParagraph1VersVermV"
                abstract="true">
         <sch:assert id="SCH-EMPTY-erl-gewerbebetrieb-erl-angabenParagraph1VersVermV"
                     test="empty(erl:angabenParagraph1VersVermV)">[SCH-EMPTY-erl-gewerbebetrieb-erl-angabenParagraph1VersVermV] Das Kindelement erl:angabenParagraph1VersVermV darf in diesem Kontext nicht angegeben werden.</sch:assert>
      </sch:rule>
      <sch:rule context="erl:gewo.erlaubnisantrag34c.1010//erl:gewerbebetrieb">
         <sch:extends rule="rule.SCH-EMPTY-erl-gewerbebetrieb-erl-angabenParagraph1VersVermV"/>
      </sch:rule>
   </sch:pattern>
   <sch:pattern>
      <sch:rule id="rule.SCH-EXISTS-erl-gewerbebetrieb-erl-angabenParagraph1VersVermV"
                abstract="true">
         <sch:assert id="SCH-EXISTS-erl-gewerbebetrieb-erl-angabenParagraph1VersVermV"
                     test="exists(erl:angabenParagraph1VersVermV)">[SCH-EXISTS-erl-gewerbebetrieb-erl-angabenParagraph1VersVermV] Das Kindelement erl:angabenParagraph1VersVermV muss in diesem Kontext angegeben werden.</sch:assert>
      </sch:rule>
   </sch:pattern>
   <sch:pattern>
      <sch:rule id="rule.SCH-EMPTY-erl-gewerbebetrieb-erl-auslandstaetigkeitIn"
                abstract="true">
         <sch:assert id="SCH-EMPTY-erl-gewerbebetrieb-erl-auslandstaetigkeitIn"
                     test="empty(erl:auslandstaetigkeitIn)">[SCH-EMPTY-erl-gewerbebetrieb-erl-auslandstaetigkeitIn] Das Kindelement erl:auslandstaetigkeitIn darf in diesem Kontext nicht angegeben werden.</sch:assert>
      </sch:rule>
      <sch:rule context="erl:gewo.erlaubnisantrag34c.1010//erl:gewerbebetrieb">
         <sch:extends rule="rule.SCH-EMPTY-erl-gewerbebetrieb-erl-auslandstaetigkeitIn"/>
      </sch:rule>
   </sch:pattern>
   <sch:pattern>
      <sch:rule id="rule.SCH-EXISTS-erl-gewerbebetrieb-erl-auslandstaetigkeitIn"
                abstract="true">
         <sch:assert id="SCH-EXISTS-erl-gewerbebetrieb-erl-auslandstaetigkeitIn"
                     test="exists(erl:auslandstaetigkeitIn)">[SCH-EXISTS-erl-gewerbebetrieb-erl-auslandstaetigkeitIn] Das Kindelement erl:auslandstaetigkeitIn muss in diesem Kontext angegeben werden.</sch:assert>
      </sch:rule>
   </sch:pattern>
   <sch:pattern>
      <sch:rule id="rule.SCH-EMPTY-erl-gewerbebetrieb-erl-auslandsniederlassung"
                abstract="true">
         <sch:assert id="SCH-EMPTY-erl-gewerbebetrieb-erl-auslandsniederlassung"
                     test="empty(erl:auslandsniederlassung)">[SCH-EMPTY-erl-gewerbebetrieb-erl-auslandsniederlassung] Das Kindelement erl:auslandsniederlassung darf in diesem Kontext nicht angegeben werden.</sch:assert>
      </sch:rule>
      <sch:rule context="erl:gewo.erlaubnisantrag34c.1010//erl:gewerbebetrieb">
         <sch:extends rule="rule.SCH-EMPTY-erl-gewerbebetrieb-erl-auslandsniederlassung"/>
      </sch:rule>
   </sch:pattern>
   <sch:pattern>
      <sch:rule id="rule.SCH-EXISTS-erl-gewerbebetrieb-erl-auslandsniederlassung"
                abstract="true">
         <sch:assert id="SCH-EXISTS-erl-gewerbebetrieb-erl-auslandsniederlassung"
                     test="exists(erl:auslandsniederlassung)">[SCH-EXISTS-erl-gewerbebetrieb-erl-auslandsniederlassung] Das Kindelement erl:auslandsniederlassung muss in diesem Kontext angegeben werden.</sch:assert>
      </sch:rule>
   </sch:pattern>
   <sch:pattern>
      <sch:rule id="rule.SCH-EMPTY-erl-gewerbebetrieb-erl-betriebsleiter.id"
                abstract="true">
         <sch:assert id="SCH-EMPTY-erl-gewerbebetrieb-erl-betriebsleiter.id"
                     test="empty(erl:betriebsleiter.id)">[SCH-EMPTY-erl-gewerbebetrieb-erl-betriebsleiter.id] Das Kindelement erl:betriebsleiter.id darf in diesem Kontext nicht angegeben werden.</sch:assert>
      </sch:rule>
      <sch:rule context="erl:gewo.erlaubnisantrag34d.1020//erl:gewerbebetrieb">
         <sch:extends rule="rule.SCH-EMPTY-erl-gewerbebetrieb-erl-betriebsleiter.id"/>
      </sch:rule>
   </sch:pattern>
   <sch:pattern>
      <sch:rule id="rule.SCH-EXISTS-erl-gewerbebetrieb-erl-betriebsleiter.id"
                abstract="true">
         <sch:assert id="SCH-EXISTS-erl-gewerbebetrieb-erl-betriebsleiter.id"
                     test="exists(erl:betriebsleiter.id)">[SCH-EXISTS-erl-gewerbebetrieb-erl-betriebsleiter.id] Das Kindelement erl:betriebsleiter.id muss in diesem Kontext angegeben werden.</sch:assert>
      </sch:rule>
   </sch:pattern>
   <sch:pattern>
      <sch:rule id="rule.SCH-EMPTY-erl-natuerlichePerson-erl-sachkundenachweis.id"
                abstract="true">
         <sch:assert id="SCH-EMPTY-erl-natuerlichePerson-erl-sachkundenachweis.id"
                     test="empty(erl:sachkundenachweis.id)">[SCH-EMPTY-erl-natuerlichePerson-erl-sachkundenachweis.id] Das Kindelement erl:sachkundenachweis.id darf in diesem Kontext nicht angegeben werden.</sch:assert>
      </sch:rule>
      <sch:rule context="erl:gewo.erlaubnisantrag34c.1010//erl:natuerlichePerson">
         <sch:extends rule="rule.SCH-EMPTY-erl-natuerlichePerson-erl-sachkundenachweis.id"/>
      </sch:rule>
   </sch:pattern>
   <sch:pattern>
      <sch:rule id="rule.SCH-EXISTS-erl-natuerlichePerson-erl-sachkundenachweis.id"
                abstract="true">
         <sch:assert id="SCH-EXISTS-erl-natuerlichePerson-erl-sachkundenachweis.id"
                     test="exists(erl:sachkundenachweis.id)">[SCH-EXISTS-erl-natuerlichePerson-erl-sachkundenachweis.id] Das Kindelement erl:sachkundenachweis.id muss in diesem Kontext angegeben werden.</sch:assert>
      </sch:rule>
   </sch:pattern>
   <sch:pattern>
      <sch:rule id="rule.SCH-EMPTY-erl-natuerlichePerson-erl-sachkundenachweis"
                abstract="true">
         <sch:assert id="SCH-EMPTY-erl-natuerlichePerson-erl-sachkundenachweis"
                     test="empty(erl:sachkundenachweis)">[SCH-EMPTY-erl-natuerlichePerson-erl-sachkundenachweis] Das Kindelement erl:sachkundenachweis darf in diesem Kontext nicht angegeben werden.</sch:assert>
      </sch:rule>
      <sch:rule context="erl:gewo.erlaubnisantrag34c.1010//erl:natuerlichePerson">
         <sch:extends rule="rule.SCH-EMPTY-erl-natuerlichePerson-erl-sachkundenachweis"/>
      </sch:rule>
   </sch:pattern>
   <sch:pattern>
      <sch:rule id="rule.SCH-EXISTS-erl-natuerlichePerson-erl-sachkundenachweis"
                abstract="true">
         <sch:assert id="SCH-EXISTS-erl-natuerlichePerson-erl-sachkundenachweis"
                     test="exists(erl:sachkundenachweis)">[SCH-EXISTS-erl-natuerlichePerson-erl-sachkundenachweis] Das Kindelement erl:sachkundenachweis muss in diesem Kontext angegeben werden.</sch:assert>
      </sch:rule>
      <sch:rule context="erl:gewo.erlaubnisantrag34d.1020//erl:natuerlichePerson[ancestor-or-self::erl:referenzierteSubjekte and ancestor-or-self::erl:natuerlichePerson/np:natuerlichePerson.id = (ancestor::erl:*/erl:gewerbebetrieb/erl:sachkundedelegation/erl:vertretungsberechtigteAufsichtsperson.id)]">
         <sch:extends rule="rule.SCH-EXISTS-erl-natuerlichePerson-erl-sachkundenachweis"/>
      </sch:rule>
   </sch:pattern>
   <sch:pattern>
      <sch:rule id="rule.SCH-EMPTY-erl-natuerlichePerson-bk-anschrift" abstract="true">
         <sch:assert id="SCH-EMPTY-erl-natuerlichePerson-bk-anschrift"
                     test="empty(bk:anschrift)">[SCH-EMPTY-erl-natuerlichePerson-bk-anschrift] Das Kindelement bk:anschrift darf in diesem Kontext nicht angegeben werden.</sch:assert>
      </sch:rule>
   </sch:pattern>
   <sch:pattern>
      <sch:rule id="rule.SCH-EXISTS-erl-natuerlichePerson-bk-anschrift" abstract="true">
         <sch:assert id="SCH-EXISTS-erl-natuerlichePerson-bk-anschrift"
                     test="exists(bk:anschrift)">[SCH-EXISTS-erl-natuerlichePerson-bk-anschrift] Das Kindelement bk:anschrift muss in diesem Kontext angegeben werden.</sch:assert>
      </sch:rule>
      <sch:rule context="erl:gewo.erlaubnisantrag34c.1010//erl:natuerlichePerson[ancestor-or-self::erl:referenzierteSubjekte and ancestor-or-self::erl:natuerlichePerson/np:natuerlichePerson.id = (ancestor::erl:*/erl:referenzierteSubjekte//gv:gesetzlicherVertreter.id,&#xA;            ancestor::erl:*/erl:referenzierteSubjekte//ges:gesellschafter.id)]">
         <sch:extends rule="rule.SCH-EXISTS-erl-natuerlichePerson-bk-anschrift"/>
      </sch:rule>
      <sch:rule context="erl:gewo.erlaubnisantrag34d.1020//erl:natuerlichePerson[ancestor-or-self::erl:referenzierteSubjekte and ancestor-or-self::erl:natuerlichePerson/np:natuerlichePerson.id = (ancestor::erl:*/erl:referenzierteSubjekte//gv:gesetzlicherVertreter.id,&#xA;            ancestor::erl:*/erl:referenzierteSubjekte//ges:gesellschafter.id)]">
         <sch:extends rule="rule.SCH-EXISTS-erl-natuerlichePerson-bk-anschrift"/>
      </sch:rule>
      <sch:rule context="erl:gewo.erlaubnisantrag34c.1010//erl:natuerlichePerson[ancestor-or-self::erl:referenzierteSubjekte and ancestor-or-self::erl:natuerlichePerson/np:natuerlichePerson.id = (ancestor::erl:*/erl:gewerbebetrieb/erl:betriebsleiter.id)]">
         <sch:extends rule="rule.SCH-EXISTS-erl-natuerlichePerson-bk-anschrift"/>
      </sch:rule>
   </sch:pattern>
   <sch:pattern>
      <sch:rule id="rule.SCH-EMPTY-erl-natuerlichePerson-bk-geburt" abstract="true">
         <sch:assert id="SCH-EMPTY-erl-natuerlichePerson-bk-geburt" test="empty(bk:geburt)">[SCH-EMPTY-erl-natuerlichePerson-bk-geburt] Das Kindelement bk:geburt darf in diesem Kontext nicht angegeben werden.</sch:assert>
      </sch:rule>
   </sch:pattern>
   <sch:pattern>
      <sch:rule id="rule.SCH-EXISTS-erl-natuerlichePerson-bk-geburt" abstract="true">
         <sch:assert id="SCH-EXISTS-erl-natuerlichePerson-bk-geburt"
                     test="exists(bk:geburt)">[SCH-EXISTS-erl-natuerlichePerson-bk-geburt] Das Kindelement bk:geburt muss in diesem Kontext angegeben werden.</sch:assert>
      </sch:rule>
      <sch:rule context="erl:gewo.erlaubnisantrag34c.1010//erl:natuerlichePerson[ancestor-or-self::erl:referenzierteSubjekte and ancestor-or-self::erl:natuerlichePerson/np:natuerlichePerson.id = (ancestor::erl:*/erl:referenzierteSubjekte//gv:gesetzlicherVertreter.id,&#xA;            ancestor::erl:*/erl:referenzierteSubjekte//ges:gesellschafter.id)]">
         <sch:extends rule="rule.SCH-EXISTS-erl-natuerlichePerson-bk-geburt"/>
      </sch:rule>
      <sch:rule context="erl:gewo.erlaubnisantrag34c.1010//erl:natuerlichePerson[ancestor-or-self::erl:referenzierteSubjekte and ancestor-or-self::erl:natuerlichePerson/np:natuerlichePerson.id = (/erl:*/erl:gewerbebetrieb/erl:leitenderAngestellter.id)]">
         <sch:extends rule="rule.SCH-EXISTS-erl-natuerlichePerson-bk-geburt"/>
      </sch:rule>
      <sch:rule context="erl:gewo.erlaubnisantrag34c.1010//erl:natuerlichePerson[ancestor-or-self::erl:referenzierteSubjekte and ancestor-or-self::erl:natuerlichePerson/np:natuerlichePerson.id = (ancestor::erl:*/erl:gewerbebetrieb/erl:betriebsleiter.id)]">
         <sch:extends rule="rule.SCH-EXISTS-erl-natuerlichePerson-bk-geburt"/>
      </sch:rule>
      <sch:rule context="erl:gewo.erlaubnisantrag34d.1020//erl:natuerlichePerson[ancestor-or-self::erl:referenzierteSubjekte and ancestor-or-self::erl:natuerlichePerson/np:natuerlichePerson.id = (ancestor::erl:*/erl:referenzierteSubjekte//gv:gesetzlicherVertreter.id,&#xA;            ancestor::erl:*/erl:referenzierteSubjekte//ges:gesellschafter.id)]">
         <sch:extends rule="rule.SCH-EXISTS-erl-natuerlichePerson-bk-geburt"/>
      </sch:rule>
      <sch:rule context="erl:gewo.erlaubnisantrag34d.1020//erl:natuerlichePerson[ancestor-or-self::erl:referenzierteSubjekte and ancestor-or-self::erl:natuerlichePerson/np:natuerlichePerson.id = (ancestor::erl:*/erl:gewerbebetrieb/erl:sachkundedelegation/erl:vertretungsberechtigteAufsichtsperson.id)]">
         <sch:extends rule="rule.SCH-EXISTS-erl-natuerlichePerson-bk-geburt"/>
      </sch:rule>
      <sch:rule context="erl:gewo.erlaubnisantrag34d.1020//erl:natuerlichePerson[ancestor-or-self::erl:referenzierteSubjekte and ancestor-or-self::erl:natuerlichePerson/np:natuerlichePerson.id = (/erl:*/erl:gewerbebetrieb/erl:leitenderAngestellter.id)]">
         <sch:extends rule="rule.SCH-EXISTS-erl-natuerlichePerson-bk-geburt"/>
      </sch:rule>
   </sch:pattern>
   <sch:pattern>
      <sch:rule id="rule.SCH-EMPTY-erl-natuerlichePerson-np-geschlecht" abstract="true">
         <sch:assert id="SCH-EMPTY-erl-natuerlichePerson-np-geschlecht"
                     test="empty(np:geschlecht)">[SCH-EMPTY-erl-natuerlichePerson-np-geschlecht] Das Kindelement np:geschlecht darf in diesem Kontext nicht angegeben werden.</sch:assert>
      </sch:rule>
   </sch:pattern>
   <sch:pattern>
      <sch:rule id="rule.SCH-EXISTS-erl-natuerlichePerson-np-geschlecht"
                abstract="true">
         <sch:assert id="SCH-EXISTS-erl-natuerlichePerson-np-geschlecht"
                     test="exists(np:geschlecht)">[SCH-EXISTS-erl-natuerlichePerson-np-geschlecht] Das Kindelement np:geschlecht muss in diesem Kontext angegeben werden.</sch:assert>
      </sch:rule>
      <sch:rule context="erl:gewo.erlaubnisantrag34c.1010//erl:natuerlichePerson[ancestor-or-self::erl:referenzierteSubjekte and ancestor-or-self::erl:natuerlichePerson/np:natuerlichePerson.id = (ancestor::erl:*/erl:referenzierteSubjekte//gv:gesetzlicherVertreter.id,&#xA;            ancestor::erl:*/erl:referenzierteSubjekte//ges:gesellschafter.id)]">
         <sch:extends rule="rule.SCH-EXISTS-erl-natuerlichePerson-np-geschlecht"/>
      </sch:rule>
      <sch:rule context="erl:gewo.erlaubnisantrag34d.1020//erl:natuerlichePerson[ancestor-or-self::erl:referenzierteSubjekte and ancestor-or-self::erl:natuerlichePerson/np:natuerlichePerson.id = (ancestor::erl:*/erl:referenzierteSubjekte//gv:gesetzlicherVertreter.id,&#xA;            ancestor::erl:*/erl:referenzierteSubjekte//ges:gesellschafter.id)]">
         <sch:extends rule="rule.SCH-EXISTS-erl-natuerlichePerson-np-geschlecht"/>
      </sch:rule>
   </sch:pattern>
   <sch:pattern>
      <sch:rule id="rule.SCH-EMPTY-erl-natuerlichePerson-np-staatsangehoerigkeit"
                abstract="true">
         <sch:assert id="SCH-EMPTY-erl-natuerlichePerson-np-staatsangehoerigkeit"
                     test="empty(np:staatsangehoerigkeit)">[SCH-EMPTY-erl-natuerlichePerson-np-staatsangehoerigkeit] Das Kindelement np:staatsangehoerigkeit darf in diesem Kontext nicht angegeben werden.</sch:assert>
      </sch:rule>
   </sch:pattern>
   <sch:pattern>
      <sch:rule id="rule.SCH-EXISTS-erl-natuerlichePerson-np-staatsangehoerigkeit"
                abstract="true">
         <sch:assert id="SCH-EXISTS-erl-natuerlichePerson-np-staatsangehoerigkeit"
                     test="exists(np:staatsangehoerigkeit)">[SCH-EXISTS-erl-natuerlichePerson-np-staatsangehoerigkeit] Das Kindelement np:staatsangehoerigkeit muss in diesem Kontext angegeben werden.</sch:assert>
      </sch:rule>
      <sch:rule context="erl:gewo.erlaubnisantrag34c.1010//erl:natuerlichePerson[ancestor-or-self::erl:referenzierteSubjekte and ancestor-or-self::erl:natuerlichePerson/np:natuerlichePerson.id = (ancestor::erl:*/erl:referenzierteSubjekte//gv:gesetzlicherVertreter.id,&#xA;            ancestor::erl:*/erl:referenzierteSubjekte//ges:gesellschafter.id)]">
         <sch:extends rule="rule.SCH-EXISTS-erl-natuerlichePerson-np-staatsangehoerigkeit"/>
      </sch:rule>
      <sch:rule context="erl:gewo.erlaubnisantrag34d.1020//erl:natuerlichePerson[ancestor-or-self::erl:referenzierteSubjekte and ancestor-or-self::erl:natuerlichePerson/np:natuerlichePerson.id = (ancestor::erl:*/erl:referenzierteSubjekte//gv:gesetzlicherVertreter.id,&#xA;            ancestor::erl:*/erl:referenzierteSubjekte//ges:gesellschafter.id)]">
         <sch:extends rule="rule.SCH-EXISTS-erl-natuerlichePerson-np-staatsangehoerigkeit"/>
      </sch:rule>
   </sch:pattern>
   <sch:pattern>
      <sch:rule id="rule.SCH-RF-URI" abstract="true">
         <sch:assert id="SCH-RF-URI" test="@listVersionID = 1 ">[SCH-RF-URI] Es ist die Rechtsformliste in der Version 1 zu verwenden.</sch:assert>
      </sch:rule>
      <sch:rule context="//rf:rechtsform/rf:rechtsformcode">
         <sch:extends rule="rule.SCH-RF-URI"/>
      </sch:rule>
   </sch:pattern>
   <sch:pattern>
      <sch:rule id="rule.SCH-RF-JP" abstract="true">
         <sch:assert id="SCH-RF-JP"
                     test="rf:rechtsformcode/code = ('310', '320', '321', '322', '323', '324', '350', '351', '360', '400', '450', '510', '590', '611', '700', '790', '912', '992')">[SCH-RF-JP]  Als Rechtsformen einer juristischen Personen sind zulässig:    Aktiengesellschaft (AG)    Kommanditgesellschaft auf Aktien (KGaA)    Aktiengesellschaft &amp; Co. Kommanditgesellschaft auf Aktien (AG &amp; Co. KGaA)    Gesellschaft mit beschränkter Haftung &amp; Co. Kommanditgesellschaft auf Aktien (GmbH &amp; Co. KGaA)    UG (haftungsbeschränkt) &amp; Co.KGaA    Europäische Aktiengesellschaft und Co. Kommanditgesellschaft auf Aktien (SE &amp; Co. KGaA)    Gesellschaft mit beschränkter Haftung (GmbH); auch gemeinnützige GmbH (gGmbH)    Unternehmergesellschaft (haftungsbeschränkt); auch UG (haftungsbeschränkt)    Europäische Aktiengesellschaft (SE)    eingetragene Genossenschaft (eG)    Europäische Genossenschaft (SCE)    Versicherungsverein auf Gegenseitigkeit (VVaG)    eingetragener Verein    rechtsfähige Stiftung    Sonstige nicht aufgeführte deutsche Rechtsform – juristische Person    Sonstige Betriebe gewerblicher Art von Körperschaften des öffentlichen Rechts    Sonstige ausländische Rechtsform nach EU-Recht - juristische Person    Sonstige ausländische Rechtsform - juristische Person (nicht nach EU-Recht)   </sch:assert>
      </sch:rule>
      <sch:rule context="//(xga:referenzierteSubjekte/xga:juristischePerson|erl:referenzierteSubjekte/erl:juristischePerson)[not(ancestor-or-self::xga:gewerbebetriebVorAenderung|ancestor-or-self::xga:referenzierteSubjekteVorAenderung)]/rf:rechtsform">
         <sch:extends rule="rule.SCH-RF-JP"/>
      </sch:rule>
   </sch:pattern>
   <sch:pattern>
      <sch:rule id="rule.SCH-RF-PG" abstract="true">
         <sch:assert id="SCH-RF-PG"
                     test="rf:rechtsformcode/code = ('210', '211', '220', '221', '222', '223', '230', '232', '240', '242', '250', '251', '260', '270', '280', '290', '994', '996')">[SCH-RF-PG]  Als Rechtsformen einer rechtsfähigen Personenengesellschaft sind zulässig:    Offene Handelsgesellschaft (OHG)    Kommanditgesellschaft auf Aktien &amp; Co. Offene Handelsgesellschaft (KGaA &amp; Co. OHG)    Kommanditgesellschaft (KG)    Stiftung &amp; Co. Kommanditgesellschaft (Stiftung &amp; Co. KG)    eingetragene Genossenschaft &amp; Co. Kommanditgesellschaft (eG &amp; Co. KG)    Kommanditgesellschaft auf Aktien &amp; Co. Kommanditgesellschaft (KGaA &amp; Co. KG)    Gesellschaft mit beschränkter Haftung &amp; Co. Kommanditgesellschaft (GmbH &amp; Co. KG)    Unternehmergesellschaft (haftungsbeschränkt) &amp; Co.KG; auch UG (haftungsbeschränkt) &amp; Co.KG    Gesellschaft mit beschränkter Haftung &amp; Co. Offene Handelsgesellschaft (GmbH &amp; Co. OHG)    Unternehmergesellschaft (haftungsbeschränkt) &amp; Co.OHG; auch UG (haftungsbeschränkt) &amp;Co.OHG    Aktiengesellschaft &amp; Co. Kommanditgesellschaft (AG &amp; Co. KG)    Europäische Aktiengesellschaft &amp; Co. KG (SE &amp; Co. KG)    Aktiengesellschaft &amp; Co. Offene Handelsgesellschaft (AG &amp; Co. OHG)    Gesellschaft des bürgerlichen Rechts (GbR; BGB-Gesellschaft)    Europäische Wirtschaftliche Interessenvereinigung (EWIV)    Sonstige nicht aufgeführte deutsche Personengesellschaft    ausländische Rechtsform nach EU-Recht - Personengesellschaft    Sonstige ausländische Rechtsform - Personengesellschaft (nicht nach EU-Recht)   </sch:assert>
      </sch:rule>
      <sch:rule context="//(xga:referenzierteSubjekte/xga:rechtsfaehigePersonengesellschaft|erl:referenzierteSubjekte/erl:rechtsfaehigePersonengesellschaft)[not(ancestor-or-self::xga:gewerbebetriebVorAenderung|ancestor-or-self::xga:referenzierteSubjekteVorAenderung)]/rf:rechtsform">
         <sch:extends rule="rule.SCH-RF-PG"/>
      </sch:rule>
   </sch:pattern>
   <sch:pattern>
      <sch:rule id="rule.SCH-RF-WT-NP" abstract="true">
         <sch:assert id="SCH-RF-WT-NP"
                     test="if (rf:rechtsform/rf:rechtsformcode/code = ('170', '180', '993', '995')) then wt:wirtschaftlichTaetiger.id = parent::*/*:referenzierteSubjekte//np:natuerlichePerson.id else true()">[SCH-RF-WT-NP]  Wenn der Gewerbebetrieb die Rechtsform eines Einzelunternehmens hat, muss der wirtschaftlich Tätige eine natürliche Person sein. </sch:assert>
      </sch:rule>
      <sch:rule context="//(xga:gewerbebetrieb|erl:gewerbebetrieb)">
         <sch:extends rule="rule.SCH-RF-WT-NP"/>
      </sch:rule>
   </sch:pattern>
   <sch:pattern>
      <sch:rule id="rule.SCH-RF-WT-JP" abstract="true">
         <sch:assert id="SCH-RF-WT-JP"
                     test="if (rf:rechtsform/rf:rechtsformcode/code = ('310', '320', '321', '322', '323', '324', '350', '351', '360', '400', '450', '510', '590', '611', '700', '790', '912', '992')) then wt:wirtschaftlichTaetiger.id = parent::*/*:referenzierteSubjekte//jp:juristischePerson.id else true()">[SCH-RF-WT-JP]  Wenn der Gewerbebetrieb die Rechtsform einer juristischen Person hat, muss der wirtschaftlich Tätige eine juristische Person sein. </sch:assert>
      </sch:rule>
      <sch:rule context="//(xga:gewerbebetrieb|erl:gewerbebetrieb)">
         <sch:extends rule="rule.SCH-RF-WT-JP"/>
      </sch:rule>
   </sch:pattern>
   <sch:pattern>
      <sch:rule id="rule.SCH-RF-WT-PG" abstract="true">
         <sch:assert id="SCH-RF-WT-PG"
                     test="if (rf:rechtsform/rf:rechtsformcode/code = ('210', '211', '220', '221', '222', '223', '230', '232', '240', '242', '250', '251', '260', '270', '280', '290', '994', '996')) then wt:wirtschaftlichTaetiger.id = parent::*/*:referenzierteSubjekte//rpg:rechtsfaehigePersonengesellschaft.id else true()">[SCH-RF-WT-PG]  Wenn der Gewerbebetrieb die Rechtsform einer rechtsfähigen Personengesellschaft hat, muss der wirtschaftlich Tätige eine juristische Person sein. </sch:assert>
      </sch:rule>
      <sch:rule context="//(xga:gewerbebetrieb|erl:gewerbebetrieb)">
         <sch:extends rule="rule.SCH-RF-WT-PG"/>
      </sch:rule>
   </sch:pattern>
   <sch:pattern>
      <sch:rule id="rule.SCH-RF-GB-170" abstract="true">
         <sch:assert id="SCH-RF-GB-170"
                     test="if (rf:rechtsform/rf:rechtsformcode/code = '170') then bk:eintragung/eintr:artEintragung/code = ('A') else true()">[SCH-RF-GB-170] Für die Rechtsform 'eingetragenes Einzelunternehmen (e.K.; e.Kfm.; e.Kfr.)' - Code 170 - sind die folgenden Eintragungsarten zulässig: A</sch:assert>
      </sch:rule>
      <sch:rule context="xga:sta.gewerbemeldung.0100//(xga:gewerbebetrieb|erl:gewerbebetrieb)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-GB-170"/>
      </sch:rule>
      <sch:rule context="xga:ihk.gewerbemeldung.0200//(xga:gewerbebetrieb|erl:gewerbebetrieb)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-GB-170"/>
      </sch:rule>
      <sch:rule context="xga:hwk.gewerbemeldung.0210//(xga:gewerbebetrieb|erl:gewerbebetrieb)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-GB-170"/>
      </sch:rule>
      <sch:rule context="xga:dgu.gewerbemeldung.0230//(xga:gewerbebetrieb|erl:gewerbebetrieb)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-GB-170"/>
      </sch:rule>
      <sch:rule context="xga:rg.gewerbemeldung.0240//(xga:gewerbebetrieb|erl:gewerbebetrieb)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-GB-170"/>
      </sch:rule>
      <sch:rule context="xga:fa.gewerbemeldung.0250//(xga:gewerbebetrieb|erl:gewerbebetrieb)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-GB-170"/>
      </sch:rule>
      <sch:rule context="xga:zv.gewerbemeldung.0260//(xga:gewerbebetrieb|erl:gewerbebetrieb)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-GB-170"/>
      </sch:rule>
      <sch:rule context="xga:is.gewerbemeldung.0270//(xga:gewerbebetrieb|erl:gewerbebetrieb)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-GB-170"/>
      </sch:rule>
      <sch:rule context="xga:as.gewerbemeldung.0280//(xga:gewerbebetrieb|erl:gewerbebetrieb)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-GB-170"/>
      </sch:rule>
      <sch:rule context="xga:lue.gewerbemeldung.0290//(xga:gewerbebetrieb|erl:gewerbebetrieb)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-GB-170"/>
      </sch:rule>
      <sch:rule context="xga:alg.gewerbemeldung.0300//(xga:gewerbebetrieb|erl:gewerbebetrieb)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-GB-170"/>
      </sch:rule>
      <sch:rule context="xga:ext.gewerbemeldung.0400//(xga:gewerbebetrieb|erl:gewerbebetrieb)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-GB-170"/>
      </sch:rule>
      <sch:rule context="xga:abh.gewerbemeldung.0500//(xga:gewerbebetrieb|erl:gewerbebetrieb)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-GB-170"/>
      </sch:rule>
      <sch:rule context="erl:gewo.erlaubnisantrag34c.1010//(xga:gewerbebetrieb|erl:gewerbebetrieb)">
         <sch:extends rule="rule.SCH-RF-GB-170"/>
      </sch:rule>
      <sch:rule context="erl:gewo.erlaubnisantrag34d.1020//(xga:gewerbebetrieb|erl:gewerbebetrieb)">
         <sch:extends rule="rule.SCH-RF-GB-170"/>
      </sch:rule>
   </sch:pattern>
   <sch:pattern>
      <sch:rule id="rule.SCH-RF-GB-180" abstract="true">
         <sch:assert id="SCH-RF-GB-180"
                     test="if (rf:rechtsform/rf:rechtsformcode/code = '180') then  empty(bk:eintragung) else true()">[SCH-RF-GB-180] Für die Rechtsform 'nicht eingetragenes Einzelunternehmen' - Code 180 - sind die folgenden Eintragungsarten zulässig: keine Eintragungsart</sch:assert>
      </sch:rule>
      <sch:rule context="xga:sta.gewerbemeldung.0100//(xga:gewerbebetrieb|erl:gewerbebetrieb)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-GB-180"/>
      </sch:rule>
      <sch:rule context="xga:ihk.gewerbemeldung.0200//(xga:gewerbebetrieb|erl:gewerbebetrieb)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-GB-180"/>
      </sch:rule>
      <sch:rule context="xga:hwk.gewerbemeldung.0210//(xga:gewerbebetrieb|erl:gewerbebetrieb)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-GB-180"/>
      </sch:rule>
      <sch:rule context="xga:dgu.gewerbemeldung.0230//(xga:gewerbebetrieb|erl:gewerbebetrieb)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-GB-180"/>
      </sch:rule>
      <sch:rule context="xga:rg.gewerbemeldung.0240//(xga:gewerbebetrieb|erl:gewerbebetrieb)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-GB-180"/>
      </sch:rule>
      <sch:rule context="xga:fa.gewerbemeldung.0250//(xga:gewerbebetrieb|erl:gewerbebetrieb)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-GB-180"/>
      </sch:rule>
      <sch:rule context="xga:zv.gewerbemeldung.0260//(xga:gewerbebetrieb|erl:gewerbebetrieb)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-GB-180"/>
      </sch:rule>
      <sch:rule context="xga:is.gewerbemeldung.0270//(xga:gewerbebetrieb|erl:gewerbebetrieb)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-GB-180"/>
      </sch:rule>
      <sch:rule context="xga:as.gewerbemeldung.0280//(xga:gewerbebetrieb|erl:gewerbebetrieb)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-GB-180"/>
      </sch:rule>
      <sch:rule context="xga:lue.gewerbemeldung.0290//(xga:gewerbebetrieb|erl:gewerbebetrieb)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-GB-180"/>
      </sch:rule>
      <sch:rule context="xga:alg.gewerbemeldung.0300//(xga:gewerbebetrieb|erl:gewerbebetrieb)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-GB-180"/>
      </sch:rule>
      <sch:rule context="xga:ext.gewerbemeldung.0400//(xga:gewerbebetrieb|erl:gewerbebetrieb)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-GB-180"/>
      </sch:rule>
      <sch:rule context="xga:abh.gewerbemeldung.0500//(xga:gewerbebetrieb|erl:gewerbebetrieb)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-GB-180"/>
      </sch:rule>
      <sch:rule context="erl:gewo.erlaubnisantrag34c.1010//(xga:gewerbebetrieb|erl:gewerbebetrieb)">
         <sch:extends rule="rule.SCH-RF-GB-180"/>
      </sch:rule>
      <sch:rule context="erl:gewo.erlaubnisantrag34d.1020//(xga:gewerbebetrieb|erl:gewerbebetrieb)">
         <sch:extends rule="rule.SCH-RF-GB-180"/>
      </sch:rule>
   </sch:pattern>
   <sch:pattern>
      <sch:rule id="rule.SCH-RF-PG-210" abstract="true">
         <sch:assert id="SCH-RF-PG-210"
                     test="if (rf:rechtsform/rf:rechtsformcode/code = '210') then bk:eintragung/eintr:artEintragung/code = ('A') else true()">[SCH-RF-PG-210] Für die Rechtsform 'Offene Handelsgesellschaft (OHG)' - Code 210 - sind die folgenden Eintragungsarten zulässig: A</sch:assert>
      </sch:rule>
      <sch:rule context="xga:sta.gewerbemeldung.0100//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:rechtsfaehigePersonengesellschaft|erl:referenzierteSubjekte/erl:rechtsfaehigePersonengesellschaft)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-PG-210"/>
      </sch:rule>
      <sch:rule context="xga:ihk.gewerbemeldung.0200//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:rechtsfaehigePersonengesellschaft|erl:referenzierteSubjekte/erl:rechtsfaehigePersonengesellschaft)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-PG-210"/>
      </sch:rule>
      <sch:rule context="xga:hwk.gewerbemeldung.0210//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:rechtsfaehigePersonengesellschaft|erl:referenzierteSubjekte/erl:rechtsfaehigePersonengesellschaft)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-PG-210"/>
      </sch:rule>
      <sch:rule context="xga:dgu.gewerbemeldung.0230//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:rechtsfaehigePersonengesellschaft|erl:referenzierteSubjekte/erl:rechtsfaehigePersonengesellschaft)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-PG-210"/>
      </sch:rule>
      <sch:rule context="xga:rg.gewerbemeldung.0240//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:rechtsfaehigePersonengesellschaft|erl:referenzierteSubjekte/erl:rechtsfaehigePersonengesellschaft)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-PG-210"/>
      </sch:rule>
      <sch:rule context="xga:fa.gewerbemeldung.0250//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:rechtsfaehigePersonengesellschaft|erl:referenzierteSubjekte/erl:rechtsfaehigePersonengesellschaft)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-PG-210"/>
      </sch:rule>
      <sch:rule context="xga:zv.gewerbemeldung.0260//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:rechtsfaehigePersonengesellschaft|erl:referenzierteSubjekte/erl:rechtsfaehigePersonengesellschaft)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-PG-210"/>
      </sch:rule>
      <sch:rule context="xga:is.gewerbemeldung.0270//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:rechtsfaehigePersonengesellschaft|erl:referenzierteSubjekte/erl:rechtsfaehigePersonengesellschaft)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-PG-210"/>
      </sch:rule>
      <sch:rule context="xga:as.gewerbemeldung.0280//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:rechtsfaehigePersonengesellschaft|erl:referenzierteSubjekte/erl:rechtsfaehigePersonengesellschaft)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-PG-210"/>
      </sch:rule>
      <sch:rule context="xga:lue.gewerbemeldung.0290//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:rechtsfaehigePersonengesellschaft|erl:referenzierteSubjekte/erl:rechtsfaehigePersonengesellschaft)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-PG-210"/>
      </sch:rule>
      <sch:rule context="xga:alg.gewerbemeldung.0300//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:rechtsfaehigePersonengesellschaft|erl:referenzierteSubjekte/erl:rechtsfaehigePersonengesellschaft)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-PG-210"/>
      </sch:rule>
      <sch:rule context="xga:ext.gewerbemeldung.0400//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:rechtsfaehigePersonengesellschaft|erl:referenzierteSubjekte/erl:rechtsfaehigePersonengesellschaft)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-PG-210"/>
      </sch:rule>
      <sch:rule context="xga:abh.gewerbemeldung.0500//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:rechtsfaehigePersonengesellschaft|erl:referenzierteSubjekte/erl:rechtsfaehigePersonengesellschaft)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-PG-210"/>
      </sch:rule>
      <sch:rule context="erl:gewo.erlaubnisantrag34c.1010//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:rechtsfaehigePersonengesellschaft|erl:referenzierteSubjekte/erl:rechtsfaehigePersonengesellschaft)">
         <sch:extends rule="rule.SCH-RF-PG-210"/>
      </sch:rule>
      <sch:rule context="erl:gewo.erlaubnisantrag34d.1020//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:rechtsfaehigePersonengesellschaft|erl:referenzierteSubjekte/erl:rechtsfaehigePersonengesellschaft)">
         <sch:extends rule="rule.SCH-RF-PG-210"/>
      </sch:rule>
   </sch:pattern>
   <sch:pattern>
      <sch:rule id="rule.SCH-RF-PG-211" abstract="true">
         <sch:assert id="SCH-RF-PG-211"
                     test="if (rf:rechtsform/rf:rechtsformcode/code = '211') then bk:eintragung/eintr:artEintragung/code = ('A') else true()">[SCH-RF-PG-211] Für die Rechtsform 'Kommanditgesellschaft auf Aktien &amp; Co. Offene Handelsgesellschaft (KGaA &amp; Co. OHG)' - Code 211 - sind die folgenden Eintragungsarten zulässig: A</sch:assert>
      </sch:rule>
      <sch:rule context="xga:sta.gewerbemeldung.0100//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:rechtsfaehigePersonengesellschaft|erl:referenzierteSubjekte/erl:rechtsfaehigePersonengesellschaft)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-PG-211"/>
      </sch:rule>
      <sch:rule context="xga:ihk.gewerbemeldung.0200//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:rechtsfaehigePersonengesellschaft|erl:referenzierteSubjekte/erl:rechtsfaehigePersonengesellschaft)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-PG-211"/>
      </sch:rule>
      <sch:rule context="xga:hwk.gewerbemeldung.0210//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:rechtsfaehigePersonengesellschaft|erl:referenzierteSubjekte/erl:rechtsfaehigePersonengesellschaft)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-PG-211"/>
      </sch:rule>
      <sch:rule context="xga:dgu.gewerbemeldung.0230//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:rechtsfaehigePersonengesellschaft|erl:referenzierteSubjekte/erl:rechtsfaehigePersonengesellschaft)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-PG-211"/>
      </sch:rule>
      <sch:rule context="xga:rg.gewerbemeldung.0240//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:rechtsfaehigePersonengesellschaft|erl:referenzierteSubjekte/erl:rechtsfaehigePersonengesellschaft)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-PG-211"/>
      </sch:rule>
      <sch:rule context="xga:fa.gewerbemeldung.0250//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:rechtsfaehigePersonengesellschaft|erl:referenzierteSubjekte/erl:rechtsfaehigePersonengesellschaft)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-PG-211"/>
      </sch:rule>
      <sch:rule context="xga:zv.gewerbemeldung.0260//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:rechtsfaehigePersonengesellschaft|erl:referenzierteSubjekte/erl:rechtsfaehigePersonengesellschaft)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-PG-211"/>
      </sch:rule>
      <sch:rule context="xga:is.gewerbemeldung.0270//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:rechtsfaehigePersonengesellschaft|erl:referenzierteSubjekte/erl:rechtsfaehigePersonengesellschaft)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-PG-211"/>
      </sch:rule>
      <sch:rule context="xga:as.gewerbemeldung.0280//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:rechtsfaehigePersonengesellschaft|erl:referenzierteSubjekte/erl:rechtsfaehigePersonengesellschaft)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-PG-211"/>
      </sch:rule>
      <sch:rule context="xga:lue.gewerbemeldung.0290//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:rechtsfaehigePersonengesellschaft|erl:referenzierteSubjekte/erl:rechtsfaehigePersonengesellschaft)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-PG-211"/>
      </sch:rule>
      <sch:rule context="xga:alg.gewerbemeldung.0300//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:rechtsfaehigePersonengesellschaft|erl:referenzierteSubjekte/erl:rechtsfaehigePersonengesellschaft)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-PG-211"/>
      </sch:rule>
      <sch:rule context="xga:ext.gewerbemeldung.0400//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:rechtsfaehigePersonengesellschaft|erl:referenzierteSubjekte/erl:rechtsfaehigePersonengesellschaft)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-PG-211"/>
      </sch:rule>
      <sch:rule context="xga:abh.gewerbemeldung.0500//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:rechtsfaehigePersonengesellschaft|erl:referenzierteSubjekte/erl:rechtsfaehigePersonengesellschaft)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-PG-211"/>
      </sch:rule>
      <sch:rule context="erl:gewo.erlaubnisantrag34c.1010//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:rechtsfaehigePersonengesellschaft|erl:referenzierteSubjekte/erl:rechtsfaehigePersonengesellschaft)">
         <sch:extends rule="rule.SCH-RF-PG-211"/>
      </sch:rule>
      <sch:rule context="erl:gewo.erlaubnisantrag34d.1020//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:rechtsfaehigePersonengesellschaft|erl:referenzierteSubjekte/erl:rechtsfaehigePersonengesellschaft)">
         <sch:extends rule="rule.SCH-RF-PG-211"/>
      </sch:rule>
   </sch:pattern>
   <sch:pattern>
      <sch:rule id="rule.SCH-RF-PG-220" abstract="true">
         <sch:assert id="SCH-RF-PG-220"
                     test="if (rf:rechtsform/rf:rechtsformcode/code = '220') then bk:eintragung/eintr:artEintragung/code = ('A') else true()">[SCH-RF-PG-220] Für die Rechtsform 'Kommanditgesellschaft (KG)' - Code 220 - sind die folgenden Eintragungsarten zulässig: A</sch:assert>
      </sch:rule>
      <sch:rule context="xga:sta.gewerbemeldung.0100//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:rechtsfaehigePersonengesellschaft|erl:referenzierteSubjekte/erl:rechtsfaehigePersonengesellschaft)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-PG-220"/>
      </sch:rule>
      <sch:rule context="xga:ihk.gewerbemeldung.0200//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:rechtsfaehigePersonengesellschaft|erl:referenzierteSubjekte/erl:rechtsfaehigePersonengesellschaft)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-PG-220"/>
      </sch:rule>
      <sch:rule context="xga:hwk.gewerbemeldung.0210//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:rechtsfaehigePersonengesellschaft|erl:referenzierteSubjekte/erl:rechtsfaehigePersonengesellschaft)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-PG-220"/>
      </sch:rule>
      <sch:rule context="xga:dgu.gewerbemeldung.0230//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:rechtsfaehigePersonengesellschaft|erl:referenzierteSubjekte/erl:rechtsfaehigePersonengesellschaft)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-PG-220"/>
      </sch:rule>
      <sch:rule context="xga:rg.gewerbemeldung.0240//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:rechtsfaehigePersonengesellschaft|erl:referenzierteSubjekte/erl:rechtsfaehigePersonengesellschaft)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-PG-220"/>
      </sch:rule>
      <sch:rule context="xga:fa.gewerbemeldung.0250//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:rechtsfaehigePersonengesellschaft|erl:referenzierteSubjekte/erl:rechtsfaehigePersonengesellschaft)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-PG-220"/>
      </sch:rule>
      <sch:rule context="xga:zv.gewerbemeldung.0260//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:rechtsfaehigePersonengesellschaft|erl:referenzierteSubjekte/erl:rechtsfaehigePersonengesellschaft)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-PG-220"/>
      </sch:rule>
      <sch:rule context="xga:is.gewerbemeldung.0270//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:rechtsfaehigePersonengesellschaft|erl:referenzierteSubjekte/erl:rechtsfaehigePersonengesellschaft)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-PG-220"/>
      </sch:rule>
      <sch:rule context="xga:as.gewerbemeldung.0280//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:rechtsfaehigePersonengesellschaft|erl:referenzierteSubjekte/erl:rechtsfaehigePersonengesellschaft)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-PG-220"/>
      </sch:rule>
      <sch:rule context="xga:lue.gewerbemeldung.0290//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:rechtsfaehigePersonengesellschaft|erl:referenzierteSubjekte/erl:rechtsfaehigePersonengesellschaft)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-PG-220"/>
      </sch:rule>
      <sch:rule context="xga:alg.gewerbemeldung.0300//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:rechtsfaehigePersonengesellschaft|erl:referenzierteSubjekte/erl:rechtsfaehigePersonengesellschaft)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-PG-220"/>
      </sch:rule>
      <sch:rule context="xga:ext.gewerbemeldung.0400//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:rechtsfaehigePersonengesellschaft|erl:referenzierteSubjekte/erl:rechtsfaehigePersonengesellschaft)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-PG-220"/>
      </sch:rule>
      <sch:rule context="xga:abh.gewerbemeldung.0500//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:rechtsfaehigePersonengesellschaft|erl:referenzierteSubjekte/erl:rechtsfaehigePersonengesellschaft)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-PG-220"/>
      </sch:rule>
      <sch:rule context="erl:gewo.erlaubnisantrag34c.1010//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:rechtsfaehigePersonengesellschaft|erl:referenzierteSubjekte/erl:rechtsfaehigePersonengesellschaft)">
         <sch:extends rule="rule.SCH-RF-PG-220"/>
      </sch:rule>
      <sch:rule context="erl:gewo.erlaubnisantrag34d.1020//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:rechtsfaehigePersonengesellschaft|erl:referenzierteSubjekte/erl:rechtsfaehigePersonengesellschaft)">
         <sch:extends rule="rule.SCH-RF-PG-220"/>
      </sch:rule>
   </sch:pattern>
   <sch:pattern>
      <sch:rule id="rule.SCH-RF-PG-221" abstract="true">
         <sch:assert id="SCH-RF-PG-221"
                     test="if (rf:rechtsform/rf:rechtsformcode/code = '221') then bk:eintragung/eintr:artEintragung/code = ('A') else true()">[SCH-RF-PG-221] Für die Rechtsform 'Stiftung &amp; Co. Kommanditgesellschaft (Stiftung &amp; Co. KG)' - Code 221 - sind die folgenden Eintragungsarten zulässig: A</sch:assert>
      </sch:rule>
      <sch:rule context="xga:sta.gewerbemeldung.0100//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:rechtsfaehigePersonengesellschaft|erl:referenzierteSubjekte/erl:rechtsfaehigePersonengesellschaft)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-PG-221"/>
      </sch:rule>
      <sch:rule context="xga:ihk.gewerbemeldung.0200//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:rechtsfaehigePersonengesellschaft|erl:referenzierteSubjekte/erl:rechtsfaehigePersonengesellschaft)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-PG-221"/>
      </sch:rule>
      <sch:rule context="xga:hwk.gewerbemeldung.0210//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:rechtsfaehigePersonengesellschaft|erl:referenzierteSubjekte/erl:rechtsfaehigePersonengesellschaft)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-PG-221"/>
      </sch:rule>
      <sch:rule context="xga:dgu.gewerbemeldung.0230//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:rechtsfaehigePersonengesellschaft|erl:referenzierteSubjekte/erl:rechtsfaehigePersonengesellschaft)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-PG-221"/>
      </sch:rule>
      <sch:rule context="xga:rg.gewerbemeldung.0240//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:rechtsfaehigePersonengesellschaft|erl:referenzierteSubjekte/erl:rechtsfaehigePersonengesellschaft)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-PG-221"/>
      </sch:rule>
      <sch:rule context="xga:fa.gewerbemeldung.0250//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:rechtsfaehigePersonengesellschaft|erl:referenzierteSubjekte/erl:rechtsfaehigePersonengesellschaft)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-PG-221"/>
      </sch:rule>
      <sch:rule context="xga:zv.gewerbemeldung.0260//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:rechtsfaehigePersonengesellschaft|erl:referenzierteSubjekte/erl:rechtsfaehigePersonengesellschaft)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-PG-221"/>
      </sch:rule>
      <sch:rule context="xga:is.gewerbemeldung.0270//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:rechtsfaehigePersonengesellschaft|erl:referenzierteSubjekte/erl:rechtsfaehigePersonengesellschaft)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-PG-221"/>
      </sch:rule>
      <sch:rule context="xga:as.gewerbemeldung.0280//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:rechtsfaehigePersonengesellschaft|erl:referenzierteSubjekte/erl:rechtsfaehigePersonengesellschaft)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-PG-221"/>
      </sch:rule>
      <sch:rule context="xga:lue.gewerbemeldung.0290//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:rechtsfaehigePersonengesellschaft|erl:referenzierteSubjekte/erl:rechtsfaehigePersonengesellschaft)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-PG-221"/>
      </sch:rule>
      <sch:rule context="xga:alg.gewerbemeldung.0300//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:rechtsfaehigePersonengesellschaft|erl:referenzierteSubjekte/erl:rechtsfaehigePersonengesellschaft)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-PG-221"/>
      </sch:rule>
      <sch:rule context="xga:ext.gewerbemeldung.0400//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:rechtsfaehigePersonengesellschaft|erl:referenzierteSubjekte/erl:rechtsfaehigePersonengesellschaft)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-PG-221"/>
      </sch:rule>
      <sch:rule context="xga:abh.gewerbemeldung.0500//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:rechtsfaehigePersonengesellschaft|erl:referenzierteSubjekte/erl:rechtsfaehigePersonengesellschaft)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-PG-221"/>
      </sch:rule>
      <sch:rule context="erl:gewo.erlaubnisantrag34c.1010//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:rechtsfaehigePersonengesellschaft|erl:referenzierteSubjekte/erl:rechtsfaehigePersonengesellschaft)">
         <sch:extends rule="rule.SCH-RF-PG-221"/>
      </sch:rule>
      <sch:rule context="erl:gewo.erlaubnisantrag34d.1020//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:rechtsfaehigePersonengesellschaft|erl:referenzierteSubjekte/erl:rechtsfaehigePersonengesellschaft)">
         <sch:extends rule="rule.SCH-RF-PG-221"/>
      </sch:rule>
   </sch:pattern>
   <sch:pattern>
      <sch:rule id="rule.SCH-RF-PG-222" abstract="true">
         <sch:assert id="SCH-RF-PG-222"
                     test="if (rf:rechtsform/rf:rechtsformcode/code = '222') then bk:eintragung/eintr:artEintragung/code = ('A') else true()">[SCH-RF-PG-222] Für die Rechtsform 'eingetragene Genossenschaft &amp; Co. Kommanditgesellschaft (eG &amp; Co. KG)' - Code 222 - sind die folgenden Eintragungsarten zulässig: A</sch:assert>
      </sch:rule>
      <sch:rule context="xga:sta.gewerbemeldung.0100//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:rechtsfaehigePersonengesellschaft|erl:referenzierteSubjekte/erl:rechtsfaehigePersonengesellschaft)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-PG-222"/>
      </sch:rule>
      <sch:rule context="xga:ihk.gewerbemeldung.0200//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:rechtsfaehigePersonengesellschaft|erl:referenzierteSubjekte/erl:rechtsfaehigePersonengesellschaft)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-PG-222"/>
      </sch:rule>
      <sch:rule context="xga:hwk.gewerbemeldung.0210//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:rechtsfaehigePersonengesellschaft|erl:referenzierteSubjekte/erl:rechtsfaehigePersonengesellschaft)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-PG-222"/>
      </sch:rule>
      <sch:rule context="xga:dgu.gewerbemeldung.0230//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:rechtsfaehigePersonengesellschaft|erl:referenzierteSubjekte/erl:rechtsfaehigePersonengesellschaft)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-PG-222"/>
      </sch:rule>
      <sch:rule context="xga:rg.gewerbemeldung.0240//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:rechtsfaehigePersonengesellschaft|erl:referenzierteSubjekte/erl:rechtsfaehigePersonengesellschaft)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-PG-222"/>
      </sch:rule>
      <sch:rule context="xga:fa.gewerbemeldung.0250//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:rechtsfaehigePersonengesellschaft|erl:referenzierteSubjekte/erl:rechtsfaehigePersonengesellschaft)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-PG-222"/>
      </sch:rule>
      <sch:rule context="xga:zv.gewerbemeldung.0260//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:rechtsfaehigePersonengesellschaft|erl:referenzierteSubjekte/erl:rechtsfaehigePersonengesellschaft)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-PG-222"/>
      </sch:rule>
      <sch:rule context="xga:is.gewerbemeldung.0270//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:rechtsfaehigePersonengesellschaft|erl:referenzierteSubjekte/erl:rechtsfaehigePersonengesellschaft)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-PG-222"/>
      </sch:rule>
      <sch:rule context="xga:as.gewerbemeldung.0280//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:rechtsfaehigePersonengesellschaft|erl:referenzierteSubjekte/erl:rechtsfaehigePersonengesellschaft)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-PG-222"/>
      </sch:rule>
      <sch:rule context="xga:lue.gewerbemeldung.0290//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:rechtsfaehigePersonengesellschaft|erl:referenzierteSubjekte/erl:rechtsfaehigePersonengesellschaft)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-PG-222"/>
      </sch:rule>
      <sch:rule context="xga:alg.gewerbemeldung.0300//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:rechtsfaehigePersonengesellschaft|erl:referenzierteSubjekte/erl:rechtsfaehigePersonengesellschaft)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-PG-222"/>
      </sch:rule>
      <sch:rule context="xga:ext.gewerbemeldung.0400//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:rechtsfaehigePersonengesellschaft|erl:referenzierteSubjekte/erl:rechtsfaehigePersonengesellschaft)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-PG-222"/>
      </sch:rule>
      <sch:rule context="xga:abh.gewerbemeldung.0500//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:rechtsfaehigePersonengesellschaft|erl:referenzierteSubjekte/erl:rechtsfaehigePersonengesellschaft)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-PG-222"/>
      </sch:rule>
      <sch:rule context="erl:gewo.erlaubnisantrag34c.1010//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:rechtsfaehigePersonengesellschaft|erl:referenzierteSubjekte/erl:rechtsfaehigePersonengesellschaft)">
         <sch:extends rule="rule.SCH-RF-PG-222"/>
      </sch:rule>
      <sch:rule context="erl:gewo.erlaubnisantrag34d.1020//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:rechtsfaehigePersonengesellschaft|erl:referenzierteSubjekte/erl:rechtsfaehigePersonengesellschaft)">
         <sch:extends rule="rule.SCH-RF-PG-222"/>
      </sch:rule>
   </sch:pattern>
   <sch:pattern>
      <sch:rule id="rule.SCH-RF-PG-223" abstract="true">
         <sch:assert id="SCH-RF-PG-223"
                     test="if (rf:rechtsform/rf:rechtsformcode/code = '223') then bk:eintragung/eintr:artEintragung/code = ('A') else true()">[SCH-RF-PG-223] Für die Rechtsform 'Kommanditgesellschaft auf Aktien &amp; Co. Kommanditgesellschaft (KGaA &amp; Co. KG)' - Code 223 - sind die folgenden Eintragungsarten zulässig: A</sch:assert>
      </sch:rule>
      <sch:rule context="xga:sta.gewerbemeldung.0100//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:rechtsfaehigePersonengesellschaft|erl:referenzierteSubjekte/erl:rechtsfaehigePersonengesellschaft)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-PG-223"/>
      </sch:rule>
      <sch:rule context="xga:ihk.gewerbemeldung.0200//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:rechtsfaehigePersonengesellschaft|erl:referenzierteSubjekte/erl:rechtsfaehigePersonengesellschaft)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-PG-223"/>
      </sch:rule>
      <sch:rule context="xga:hwk.gewerbemeldung.0210//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:rechtsfaehigePersonengesellschaft|erl:referenzierteSubjekte/erl:rechtsfaehigePersonengesellschaft)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-PG-223"/>
      </sch:rule>
      <sch:rule context="xga:dgu.gewerbemeldung.0230//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:rechtsfaehigePersonengesellschaft|erl:referenzierteSubjekte/erl:rechtsfaehigePersonengesellschaft)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-PG-223"/>
      </sch:rule>
      <sch:rule context="xga:rg.gewerbemeldung.0240//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:rechtsfaehigePersonengesellschaft|erl:referenzierteSubjekte/erl:rechtsfaehigePersonengesellschaft)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-PG-223"/>
      </sch:rule>
      <sch:rule context="xga:fa.gewerbemeldung.0250//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:rechtsfaehigePersonengesellschaft|erl:referenzierteSubjekte/erl:rechtsfaehigePersonengesellschaft)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-PG-223"/>
      </sch:rule>
      <sch:rule context="xga:zv.gewerbemeldung.0260//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:rechtsfaehigePersonengesellschaft|erl:referenzierteSubjekte/erl:rechtsfaehigePersonengesellschaft)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-PG-223"/>
      </sch:rule>
      <sch:rule context="xga:is.gewerbemeldung.0270//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:rechtsfaehigePersonengesellschaft|erl:referenzierteSubjekte/erl:rechtsfaehigePersonengesellschaft)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-PG-223"/>
      </sch:rule>
      <sch:rule context="xga:as.gewerbemeldung.0280//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:rechtsfaehigePersonengesellschaft|erl:referenzierteSubjekte/erl:rechtsfaehigePersonengesellschaft)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-PG-223"/>
      </sch:rule>
      <sch:rule context="xga:lue.gewerbemeldung.0290//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:rechtsfaehigePersonengesellschaft|erl:referenzierteSubjekte/erl:rechtsfaehigePersonengesellschaft)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-PG-223"/>
      </sch:rule>
      <sch:rule context="xga:alg.gewerbemeldung.0300//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:rechtsfaehigePersonengesellschaft|erl:referenzierteSubjekte/erl:rechtsfaehigePersonengesellschaft)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-PG-223"/>
      </sch:rule>
      <sch:rule context="xga:ext.gewerbemeldung.0400//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:rechtsfaehigePersonengesellschaft|erl:referenzierteSubjekte/erl:rechtsfaehigePersonengesellschaft)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-PG-223"/>
      </sch:rule>
      <sch:rule context="xga:abh.gewerbemeldung.0500//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:rechtsfaehigePersonengesellschaft|erl:referenzierteSubjekte/erl:rechtsfaehigePersonengesellschaft)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-PG-223"/>
      </sch:rule>
      <sch:rule context="erl:gewo.erlaubnisantrag34c.1010//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:rechtsfaehigePersonengesellschaft|erl:referenzierteSubjekte/erl:rechtsfaehigePersonengesellschaft)">
         <sch:extends rule="rule.SCH-RF-PG-223"/>
      </sch:rule>
      <sch:rule context="erl:gewo.erlaubnisantrag34d.1020//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:rechtsfaehigePersonengesellschaft|erl:referenzierteSubjekte/erl:rechtsfaehigePersonengesellschaft)">
         <sch:extends rule="rule.SCH-RF-PG-223"/>
      </sch:rule>
   </sch:pattern>
   <sch:pattern>
      <sch:rule id="rule.SCH-RF-PG-230" abstract="true">
         <sch:assert id="SCH-RF-PG-230"
                     test="if (rf:rechtsform/rf:rechtsformcode/code = '230') then bk:eintragung/eintr:artEintragung/code = ('A') else true()">[SCH-RF-PG-230] Für die Rechtsform 'Gesellschaft mit beschränkter Haftung &amp; Co. Kommanditgesellschaft (GmbH &amp; Co. KG)' - Code 230 - sind die folgenden Eintragungsarten zulässig: A</sch:assert>
      </sch:rule>
      <sch:rule context="xga:sta.gewerbemeldung.0100//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:rechtsfaehigePersonengesellschaft|erl:referenzierteSubjekte/erl:rechtsfaehigePersonengesellschaft)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-PG-230"/>
      </sch:rule>
      <sch:rule context="xga:ihk.gewerbemeldung.0200//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:rechtsfaehigePersonengesellschaft|erl:referenzierteSubjekte/erl:rechtsfaehigePersonengesellschaft)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-PG-230"/>
      </sch:rule>
      <sch:rule context="xga:hwk.gewerbemeldung.0210//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:rechtsfaehigePersonengesellschaft|erl:referenzierteSubjekte/erl:rechtsfaehigePersonengesellschaft)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-PG-230"/>
      </sch:rule>
      <sch:rule context="xga:dgu.gewerbemeldung.0230//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:rechtsfaehigePersonengesellschaft|erl:referenzierteSubjekte/erl:rechtsfaehigePersonengesellschaft)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-PG-230"/>
      </sch:rule>
      <sch:rule context="xga:rg.gewerbemeldung.0240//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:rechtsfaehigePersonengesellschaft|erl:referenzierteSubjekte/erl:rechtsfaehigePersonengesellschaft)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-PG-230"/>
      </sch:rule>
      <sch:rule context="xga:fa.gewerbemeldung.0250//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:rechtsfaehigePersonengesellschaft|erl:referenzierteSubjekte/erl:rechtsfaehigePersonengesellschaft)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-PG-230"/>
      </sch:rule>
      <sch:rule context="xga:zv.gewerbemeldung.0260//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:rechtsfaehigePersonengesellschaft|erl:referenzierteSubjekte/erl:rechtsfaehigePersonengesellschaft)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-PG-230"/>
      </sch:rule>
      <sch:rule context="xga:is.gewerbemeldung.0270//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:rechtsfaehigePersonengesellschaft|erl:referenzierteSubjekte/erl:rechtsfaehigePersonengesellschaft)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-PG-230"/>
      </sch:rule>
      <sch:rule context="xga:as.gewerbemeldung.0280//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:rechtsfaehigePersonengesellschaft|erl:referenzierteSubjekte/erl:rechtsfaehigePersonengesellschaft)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-PG-230"/>
      </sch:rule>
      <sch:rule context="xga:lue.gewerbemeldung.0290//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:rechtsfaehigePersonengesellschaft|erl:referenzierteSubjekte/erl:rechtsfaehigePersonengesellschaft)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-PG-230"/>
      </sch:rule>
      <sch:rule context="xga:alg.gewerbemeldung.0300//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:rechtsfaehigePersonengesellschaft|erl:referenzierteSubjekte/erl:rechtsfaehigePersonengesellschaft)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-PG-230"/>
      </sch:rule>
      <sch:rule context="xga:ext.gewerbemeldung.0400//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:rechtsfaehigePersonengesellschaft|erl:referenzierteSubjekte/erl:rechtsfaehigePersonengesellschaft)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-PG-230"/>
      </sch:rule>
      <sch:rule context="xga:abh.gewerbemeldung.0500//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:rechtsfaehigePersonengesellschaft|erl:referenzierteSubjekte/erl:rechtsfaehigePersonengesellschaft)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-PG-230"/>
      </sch:rule>
      <sch:rule context="erl:gewo.erlaubnisantrag34c.1010//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:rechtsfaehigePersonengesellschaft|erl:referenzierteSubjekte/erl:rechtsfaehigePersonengesellschaft)">
         <sch:extends rule="rule.SCH-RF-PG-230"/>
      </sch:rule>
      <sch:rule context="erl:gewo.erlaubnisantrag34d.1020//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:rechtsfaehigePersonengesellschaft|erl:referenzierteSubjekte/erl:rechtsfaehigePersonengesellschaft)">
         <sch:extends rule="rule.SCH-RF-PG-230"/>
      </sch:rule>
   </sch:pattern>
   <sch:pattern>
      <sch:rule id="rule.SCH-RF-PG-232" abstract="true">
         <sch:assert id="SCH-RF-PG-232"
                     test="if (rf:rechtsform/rf:rechtsformcode/code = '232') then bk:eintragung/eintr:artEintragung/code = ('A') else true()">[SCH-RF-PG-232] Für die Rechtsform 'Unternehmergesellschaft (haftungsbeschränkt) &amp; Co.KG; auch UG (haftungsbeschränkt) &amp; Co.KG' - Code 232 - sind die folgenden Eintragungsarten zulässig: A</sch:assert>
      </sch:rule>
      <sch:rule context="xga:sta.gewerbemeldung.0100//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:rechtsfaehigePersonengesellschaft|erl:referenzierteSubjekte/erl:rechtsfaehigePersonengesellschaft)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-PG-232"/>
      </sch:rule>
      <sch:rule context="xga:ihk.gewerbemeldung.0200//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:rechtsfaehigePersonengesellschaft|erl:referenzierteSubjekte/erl:rechtsfaehigePersonengesellschaft)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-PG-232"/>
      </sch:rule>
      <sch:rule context="xga:hwk.gewerbemeldung.0210//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:rechtsfaehigePersonengesellschaft|erl:referenzierteSubjekte/erl:rechtsfaehigePersonengesellschaft)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-PG-232"/>
      </sch:rule>
      <sch:rule context="xga:dgu.gewerbemeldung.0230//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:rechtsfaehigePersonengesellschaft|erl:referenzierteSubjekte/erl:rechtsfaehigePersonengesellschaft)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-PG-232"/>
      </sch:rule>
      <sch:rule context="xga:rg.gewerbemeldung.0240//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:rechtsfaehigePersonengesellschaft|erl:referenzierteSubjekte/erl:rechtsfaehigePersonengesellschaft)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-PG-232"/>
      </sch:rule>
      <sch:rule context="xga:fa.gewerbemeldung.0250//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:rechtsfaehigePersonengesellschaft|erl:referenzierteSubjekte/erl:rechtsfaehigePersonengesellschaft)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-PG-232"/>
      </sch:rule>
      <sch:rule context="xga:zv.gewerbemeldung.0260//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:rechtsfaehigePersonengesellschaft|erl:referenzierteSubjekte/erl:rechtsfaehigePersonengesellschaft)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-PG-232"/>
      </sch:rule>
      <sch:rule context="xga:is.gewerbemeldung.0270//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:rechtsfaehigePersonengesellschaft|erl:referenzierteSubjekte/erl:rechtsfaehigePersonengesellschaft)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-PG-232"/>
      </sch:rule>
      <sch:rule context="xga:as.gewerbemeldung.0280//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:rechtsfaehigePersonengesellschaft|erl:referenzierteSubjekte/erl:rechtsfaehigePersonengesellschaft)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-PG-232"/>
      </sch:rule>
      <sch:rule context="xga:lue.gewerbemeldung.0290//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:rechtsfaehigePersonengesellschaft|erl:referenzierteSubjekte/erl:rechtsfaehigePersonengesellschaft)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-PG-232"/>
      </sch:rule>
      <sch:rule context="xga:alg.gewerbemeldung.0300//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:rechtsfaehigePersonengesellschaft|erl:referenzierteSubjekte/erl:rechtsfaehigePersonengesellschaft)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-PG-232"/>
      </sch:rule>
      <sch:rule context="xga:ext.gewerbemeldung.0400//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:rechtsfaehigePersonengesellschaft|erl:referenzierteSubjekte/erl:rechtsfaehigePersonengesellschaft)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-PG-232"/>
      </sch:rule>
      <sch:rule context="xga:abh.gewerbemeldung.0500//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:rechtsfaehigePersonengesellschaft|erl:referenzierteSubjekte/erl:rechtsfaehigePersonengesellschaft)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-PG-232"/>
      </sch:rule>
      <sch:rule context="erl:gewo.erlaubnisantrag34c.1010//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:rechtsfaehigePersonengesellschaft|erl:referenzierteSubjekte/erl:rechtsfaehigePersonengesellschaft)">
         <sch:extends rule="rule.SCH-RF-PG-232"/>
      </sch:rule>
      <sch:rule context="erl:gewo.erlaubnisantrag34d.1020//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:rechtsfaehigePersonengesellschaft|erl:referenzierteSubjekte/erl:rechtsfaehigePersonengesellschaft)">
         <sch:extends rule="rule.SCH-RF-PG-232"/>
      </sch:rule>
   </sch:pattern>
   <sch:pattern>
      <sch:rule id="rule.SCH-RF-PG-240" abstract="true">
         <sch:assert id="SCH-RF-PG-240"
                     test="if (rf:rechtsform/rf:rechtsformcode/code = '240') then bk:eintragung/eintr:artEintragung/code = ('A') else true()">[SCH-RF-PG-240] Für die Rechtsform 'Gesellschaft mit beschränkter Haftung &amp; Co. Offene Handelsgesellschaft (GmbH &amp; Co. OHG)' - Code 240 - sind die folgenden Eintragungsarten zulässig: A</sch:assert>
      </sch:rule>
      <sch:rule context="xga:sta.gewerbemeldung.0100//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:rechtsfaehigePersonengesellschaft|erl:referenzierteSubjekte/erl:rechtsfaehigePersonengesellschaft)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-PG-240"/>
      </sch:rule>
      <sch:rule context="xga:ihk.gewerbemeldung.0200//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:rechtsfaehigePersonengesellschaft|erl:referenzierteSubjekte/erl:rechtsfaehigePersonengesellschaft)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-PG-240"/>
      </sch:rule>
      <sch:rule context="xga:hwk.gewerbemeldung.0210//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:rechtsfaehigePersonengesellschaft|erl:referenzierteSubjekte/erl:rechtsfaehigePersonengesellschaft)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-PG-240"/>
      </sch:rule>
      <sch:rule context="xga:dgu.gewerbemeldung.0230//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:rechtsfaehigePersonengesellschaft|erl:referenzierteSubjekte/erl:rechtsfaehigePersonengesellschaft)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-PG-240"/>
      </sch:rule>
      <sch:rule context="xga:rg.gewerbemeldung.0240//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:rechtsfaehigePersonengesellschaft|erl:referenzierteSubjekte/erl:rechtsfaehigePersonengesellschaft)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-PG-240"/>
      </sch:rule>
      <sch:rule context="xga:fa.gewerbemeldung.0250//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:rechtsfaehigePersonengesellschaft|erl:referenzierteSubjekte/erl:rechtsfaehigePersonengesellschaft)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-PG-240"/>
      </sch:rule>
      <sch:rule context="xga:zv.gewerbemeldung.0260//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:rechtsfaehigePersonengesellschaft|erl:referenzierteSubjekte/erl:rechtsfaehigePersonengesellschaft)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-PG-240"/>
      </sch:rule>
      <sch:rule context="xga:is.gewerbemeldung.0270//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:rechtsfaehigePersonengesellschaft|erl:referenzierteSubjekte/erl:rechtsfaehigePersonengesellschaft)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-PG-240"/>
      </sch:rule>
      <sch:rule context="xga:as.gewerbemeldung.0280//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:rechtsfaehigePersonengesellschaft|erl:referenzierteSubjekte/erl:rechtsfaehigePersonengesellschaft)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-PG-240"/>
      </sch:rule>
      <sch:rule context="xga:lue.gewerbemeldung.0290//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:rechtsfaehigePersonengesellschaft|erl:referenzierteSubjekte/erl:rechtsfaehigePersonengesellschaft)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-PG-240"/>
      </sch:rule>
      <sch:rule context="xga:alg.gewerbemeldung.0300//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:rechtsfaehigePersonengesellschaft|erl:referenzierteSubjekte/erl:rechtsfaehigePersonengesellschaft)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-PG-240"/>
      </sch:rule>
      <sch:rule context="xga:ext.gewerbemeldung.0400//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:rechtsfaehigePersonengesellschaft|erl:referenzierteSubjekte/erl:rechtsfaehigePersonengesellschaft)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-PG-240"/>
      </sch:rule>
      <sch:rule context="xga:abh.gewerbemeldung.0500//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:rechtsfaehigePersonengesellschaft|erl:referenzierteSubjekte/erl:rechtsfaehigePersonengesellschaft)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-PG-240"/>
      </sch:rule>
      <sch:rule context="erl:gewo.erlaubnisantrag34c.1010//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:rechtsfaehigePersonengesellschaft|erl:referenzierteSubjekte/erl:rechtsfaehigePersonengesellschaft)">
         <sch:extends rule="rule.SCH-RF-PG-240"/>
      </sch:rule>
      <sch:rule context="erl:gewo.erlaubnisantrag34d.1020//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:rechtsfaehigePersonengesellschaft|erl:referenzierteSubjekte/erl:rechtsfaehigePersonengesellschaft)">
         <sch:extends rule="rule.SCH-RF-PG-240"/>
      </sch:rule>
   </sch:pattern>
   <sch:pattern>
      <sch:rule id="rule.SCH-RF-PG-242" abstract="true">
         <sch:assert id="SCH-RF-PG-242"
                     test="if (rf:rechtsform/rf:rechtsformcode/code = '242') then bk:eintragung/eintr:artEintragung/code = ('A') else true()">[SCH-RF-PG-242] Für die Rechtsform 'Unternehmergesellschaft (haftungsbeschränkt) &amp; Co.OHG; auch UG (haftungsbeschränkt) &amp;Co.OHG' - Code 242 - sind die folgenden Eintragungsarten zulässig: A</sch:assert>
      </sch:rule>
      <sch:rule context="xga:sta.gewerbemeldung.0100//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:rechtsfaehigePersonengesellschaft|erl:referenzierteSubjekte/erl:rechtsfaehigePersonengesellschaft)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-PG-242"/>
      </sch:rule>
      <sch:rule context="xga:ihk.gewerbemeldung.0200//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:rechtsfaehigePersonengesellschaft|erl:referenzierteSubjekte/erl:rechtsfaehigePersonengesellschaft)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-PG-242"/>
      </sch:rule>
      <sch:rule context="xga:hwk.gewerbemeldung.0210//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:rechtsfaehigePersonengesellschaft|erl:referenzierteSubjekte/erl:rechtsfaehigePersonengesellschaft)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-PG-242"/>
      </sch:rule>
      <sch:rule context="xga:dgu.gewerbemeldung.0230//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:rechtsfaehigePersonengesellschaft|erl:referenzierteSubjekte/erl:rechtsfaehigePersonengesellschaft)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-PG-242"/>
      </sch:rule>
      <sch:rule context="xga:rg.gewerbemeldung.0240//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:rechtsfaehigePersonengesellschaft|erl:referenzierteSubjekte/erl:rechtsfaehigePersonengesellschaft)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-PG-242"/>
      </sch:rule>
      <sch:rule context="xga:fa.gewerbemeldung.0250//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:rechtsfaehigePersonengesellschaft|erl:referenzierteSubjekte/erl:rechtsfaehigePersonengesellschaft)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-PG-242"/>
      </sch:rule>
      <sch:rule context="xga:zv.gewerbemeldung.0260//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:rechtsfaehigePersonengesellschaft|erl:referenzierteSubjekte/erl:rechtsfaehigePersonengesellschaft)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-PG-242"/>
      </sch:rule>
      <sch:rule context="xga:is.gewerbemeldung.0270//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:rechtsfaehigePersonengesellschaft|erl:referenzierteSubjekte/erl:rechtsfaehigePersonengesellschaft)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-PG-242"/>
      </sch:rule>
      <sch:rule context="xga:as.gewerbemeldung.0280//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:rechtsfaehigePersonengesellschaft|erl:referenzierteSubjekte/erl:rechtsfaehigePersonengesellschaft)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-PG-242"/>
      </sch:rule>
      <sch:rule context="xga:lue.gewerbemeldung.0290//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:rechtsfaehigePersonengesellschaft|erl:referenzierteSubjekte/erl:rechtsfaehigePersonengesellschaft)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-PG-242"/>
      </sch:rule>
      <sch:rule context="xga:alg.gewerbemeldung.0300//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:rechtsfaehigePersonengesellschaft|erl:referenzierteSubjekte/erl:rechtsfaehigePersonengesellschaft)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-PG-242"/>
      </sch:rule>
      <sch:rule context="xga:ext.gewerbemeldung.0400//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:rechtsfaehigePersonengesellschaft|erl:referenzierteSubjekte/erl:rechtsfaehigePersonengesellschaft)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-PG-242"/>
      </sch:rule>
      <sch:rule context="xga:abh.gewerbemeldung.0500//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:rechtsfaehigePersonengesellschaft|erl:referenzierteSubjekte/erl:rechtsfaehigePersonengesellschaft)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-PG-242"/>
      </sch:rule>
      <sch:rule context="erl:gewo.erlaubnisantrag34c.1010//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:rechtsfaehigePersonengesellschaft|erl:referenzierteSubjekte/erl:rechtsfaehigePersonengesellschaft)">
         <sch:extends rule="rule.SCH-RF-PG-242"/>
      </sch:rule>
      <sch:rule context="erl:gewo.erlaubnisantrag34d.1020//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:rechtsfaehigePersonengesellschaft|erl:referenzierteSubjekte/erl:rechtsfaehigePersonengesellschaft)">
         <sch:extends rule="rule.SCH-RF-PG-242"/>
      </sch:rule>
   </sch:pattern>
   <sch:pattern>
      <sch:rule id="rule.SCH-RF-PG-250" abstract="true">
         <sch:assert id="SCH-RF-PG-250"
                     test="if (rf:rechtsform/rf:rechtsformcode/code = '250') then bk:eintragung/eintr:artEintragung/code = ('A') else true()">[SCH-RF-PG-250] Für die Rechtsform 'Aktiengesellschaft &amp; Co. Kommanditgesellschaft (AG &amp; Co. KG)' - Code 250 - sind die folgenden Eintragungsarten zulässig: A</sch:assert>
      </sch:rule>
      <sch:rule context="xga:sta.gewerbemeldung.0100//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:rechtsfaehigePersonengesellschaft|erl:referenzierteSubjekte/erl:rechtsfaehigePersonengesellschaft)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-PG-250"/>
      </sch:rule>
      <sch:rule context="xga:ihk.gewerbemeldung.0200//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:rechtsfaehigePersonengesellschaft|erl:referenzierteSubjekte/erl:rechtsfaehigePersonengesellschaft)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-PG-250"/>
      </sch:rule>
      <sch:rule context="xga:hwk.gewerbemeldung.0210//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:rechtsfaehigePersonengesellschaft|erl:referenzierteSubjekte/erl:rechtsfaehigePersonengesellschaft)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-PG-250"/>
      </sch:rule>
      <sch:rule context="xga:dgu.gewerbemeldung.0230//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:rechtsfaehigePersonengesellschaft|erl:referenzierteSubjekte/erl:rechtsfaehigePersonengesellschaft)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-PG-250"/>
      </sch:rule>
      <sch:rule context="xga:rg.gewerbemeldung.0240//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:rechtsfaehigePersonengesellschaft|erl:referenzierteSubjekte/erl:rechtsfaehigePersonengesellschaft)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-PG-250"/>
      </sch:rule>
      <sch:rule context="xga:fa.gewerbemeldung.0250//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:rechtsfaehigePersonengesellschaft|erl:referenzierteSubjekte/erl:rechtsfaehigePersonengesellschaft)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-PG-250"/>
      </sch:rule>
      <sch:rule context="xga:zv.gewerbemeldung.0260//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:rechtsfaehigePersonengesellschaft|erl:referenzierteSubjekte/erl:rechtsfaehigePersonengesellschaft)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-PG-250"/>
      </sch:rule>
      <sch:rule context="xga:is.gewerbemeldung.0270//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:rechtsfaehigePersonengesellschaft|erl:referenzierteSubjekte/erl:rechtsfaehigePersonengesellschaft)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-PG-250"/>
      </sch:rule>
      <sch:rule context="xga:as.gewerbemeldung.0280//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:rechtsfaehigePersonengesellschaft|erl:referenzierteSubjekte/erl:rechtsfaehigePersonengesellschaft)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-PG-250"/>
      </sch:rule>
      <sch:rule context="xga:lue.gewerbemeldung.0290//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:rechtsfaehigePersonengesellschaft|erl:referenzierteSubjekte/erl:rechtsfaehigePersonengesellschaft)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-PG-250"/>
      </sch:rule>
      <sch:rule context="xga:alg.gewerbemeldung.0300//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:rechtsfaehigePersonengesellschaft|erl:referenzierteSubjekte/erl:rechtsfaehigePersonengesellschaft)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-PG-250"/>
      </sch:rule>
      <sch:rule context="xga:ext.gewerbemeldung.0400//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:rechtsfaehigePersonengesellschaft|erl:referenzierteSubjekte/erl:rechtsfaehigePersonengesellschaft)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-PG-250"/>
      </sch:rule>
      <sch:rule context="xga:abh.gewerbemeldung.0500//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:rechtsfaehigePersonengesellschaft|erl:referenzierteSubjekte/erl:rechtsfaehigePersonengesellschaft)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-PG-250"/>
      </sch:rule>
      <sch:rule context="erl:gewo.erlaubnisantrag34c.1010//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:rechtsfaehigePersonengesellschaft|erl:referenzierteSubjekte/erl:rechtsfaehigePersonengesellschaft)">
         <sch:extends rule="rule.SCH-RF-PG-250"/>
      </sch:rule>
      <sch:rule context="erl:gewo.erlaubnisantrag34d.1020//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:rechtsfaehigePersonengesellschaft|erl:referenzierteSubjekte/erl:rechtsfaehigePersonengesellschaft)">
         <sch:extends rule="rule.SCH-RF-PG-250"/>
      </sch:rule>
   </sch:pattern>
   <sch:pattern>
      <sch:rule id="rule.SCH-RF-PG-251" abstract="true">
         <sch:assert id="SCH-RF-PG-251"
                     test="if (rf:rechtsform/rf:rechtsformcode/code = '251') then bk:eintragung/eintr:artEintragung/code = ('A') else true()">[SCH-RF-PG-251] Für die Rechtsform 'Europäische Aktiengesellschaft &amp; Co. KG (SE &amp; Co. KG)' - Code 251 - sind die folgenden Eintragungsarten zulässig: A</sch:assert>
      </sch:rule>
      <sch:rule context="xga:sta.gewerbemeldung.0100//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:rechtsfaehigePersonengesellschaft|erl:referenzierteSubjekte/erl:rechtsfaehigePersonengesellschaft)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-PG-251"/>
      </sch:rule>
      <sch:rule context="xga:ihk.gewerbemeldung.0200//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:rechtsfaehigePersonengesellschaft|erl:referenzierteSubjekte/erl:rechtsfaehigePersonengesellschaft)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-PG-251"/>
      </sch:rule>
      <sch:rule context="xga:hwk.gewerbemeldung.0210//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:rechtsfaehigePersonengesellschaft|erl:referenzierteSubjekte/erl:rechtsfaehigePersonengesellschaft)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-PG-251"/>
      </sch:rule>
      <sch:rule context="xga:dgu.gewerbemeldung.0230//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:rechtsfaehigePersonengesellschaft|erl:referenzierteSubjekte/erl:rechtsfaehigePersonengesellschaft)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-PG-251"/>
      </sch:rule>
      <sch:rule context="xga:rg.gewerbemeldung.0240//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:rechtsfaehigePersonengesellschaft|erl:referenzierteSubjekte/erl:rechtsfaehigePersonengesellschaft)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-PG-251"/>
      </sch:rule>
      <sch:rule context="xga:fa.gewerbemeldung.0250//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:rechtsfaehigePersonengesellschaft|erl:referenzierteSubjekte/erl:rechtsfaehigePersonengesellschaft)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-PG-251"/>
      </sch:rule>
      <sch:rule context="xga:zv.gewerbemeldung.0260//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:rechtsfaehigePersonengesellschaft|erl:referenzierteSubjekte/erl:rechtsfaehigePersonengesellschaft)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-PG-251"/>
      </sch:rule>
      <sch:rule context="xga:is.gewerbemeldung.0270//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:rechtsfaehigePersonengesellschaft|erl:referenzierteSubjekte/erl:rechtsfaehigePersonengesellschaft)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-PG-251"/>
      </sch:rule>
      <sch:rule context="xga:as.gewerbemeldung.0280//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:rechtsfaehigePersonengesellschaft|erl:referenzierteSubjekte/erl:rechtsfaehigePersonengesellschaft)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-PG-251"/>
      </sch:rule>
      <sch:rule context="xga:lue.gewerbemeldung.0290//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:rechtsfaehigePersonengesellschaft|erl:referenzierteSubjekte/erl:rechtsfaehigePersonengesellschaft)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-PG-251"/>
      </sch:rule>
      <sch:rule context="xga:alg.gewerbemeldung.0300//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:rechtsfaehigePersonengesellschaft|erl:referenzierteSubjekte/erl:rechtsfaehigePersonengesellschaft)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-PG-251"/>
      </sch:rule>
      <sch:rule context="xga:ext.gewerbemeldung.0400//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:rechtsfaehigePersonengesellschaft|erl:referenzierteSubjekte/erl:rechtsfaehigePersonengesellschaft)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-PG-251"/>
      </sch:rule>
      <sch:rule context="xga:abh.gewerbemeldung.0500//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:rechtsfaehigePersonengesellschaft|erl:referenzierteSubjekte/erl:rechtsfaehigePersonengesellschaft)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-PG-251"/>
      </sch:rule>
      <sch:rule context="erl:gewo.erlaubnisantrag34c.1010//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:rechtsfaehigePersonengesellschaft|erl:referenzierteSubjekte/erl:rechtsfaehigePersonengesellschaft)">
         <sch:extends rule="rule.SCH-RF-PG-251"/>
      </sch:rule>
      <sch:rule context="erl:gewo.erlaubnisantrag34d.1020//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:rechtsfaehigePersonengesellschaft|erl:referenzierteSubjekte/erl:rechtsfaehigePersonengesellschaft)">
         <sch:extends rule="rule.SCH-RF-PG-251"/>
      </sch:rule>
   </sch:pattern>
   <sch:pattern>
      <sch:rule id="rule.SCH-RF-PG-260" abstract="true">
         <sch:assert id="SCH-RF-PG-260"
                     test="if (rf:rechtsform/rf:rechtsformcode/code = '260') then bk:eintragung/eintr:artEintragung/code = ('A') else true()">[SCH-RF-PG-260] Für die Rechtsform 'Aktiengesellschaft &amp; Co. Offene Handelsgesellschaft (AG &amp; Co. OHG)' - Code 260 - sind die folgenden Eintragungsarten zulässig: A</sch:assert>
      </sch:rule>
      <sch:rule context="xga:sta.gewerbemeldung.0100//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:rechtsfaehigePersonengesellschaft|erl:referenzierteSubjekte/erl:rechtsfaehigePersonengesellschaft)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-PG-260"/>
      </sch:rule>
      <sch:rule context="xga:ihk.gewerbemeldung.0200//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:rechtsfaehigePersonengesellschaft|erl:referenzierteSubjekte/erl:rechtsfaehigePersonengesellschaft)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-PG-260"/>
      </sch:rule>
      <sch:rule context="xga:hwk.gewerbemeldung.0210//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:rechtsfaehigePersonengesellschaft|erl:referenzierteSubjekte/erl:rechtsfaehigePersonengesellschaft)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-PG-260"/>
      </sch:rule>
      <sch:rule context="xga:dgu.gewerbemeldung.0230//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:rechtsfaehigePersonengesellschaft|erl:referenzierteSubjekte/erl:rechtsfaehigePersonengesellschaft)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-PG-260"/>
      </sch:rule>
      <sch:rule context="xga:rg.gewerbemeldung.0240//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:rechtsfaehigePersonengesellschaft|erl:referenzierteSubjekte/erl:rechtsfaehigePersonengesellschaft)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-PG-260"/>
      </sch:rule>
      <sch:rule context="xga:fa.gewerbemeldung.0250//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:rechtsfaehigePersonengesellschaft|erl:referenzierteSubjekte/erl:rechtsfaehigePersonengesellschaft)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-PG-260"/>
      </sch:rule>
      <sch:rule context="xga:zv.gewerbemeldung.0260//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:rechtsfaehigePersonengesellschaft|erl:referenzierteSubjekte/erl:rechtsfaehigePersonengesellschaft)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-PG-260"/>
      </sch:rule>
      <sch:rule context="xga:is.gewerbemeldung.0270//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:rechtsfaehigePersonengesellschaft|erl:referenzierteSubjekte/erl:rechtsfaehigePersonengesellschaft)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-PG-260"/>
      </sch:rule>
      <sch:rule context="xga:as.gewerbemeldung.0280//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:rechtsfaehigePersonengesellschaft|erl:referenzierteSubjekte/erl:rechtsfaehigePersonengesellschaft)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-PG-260"/>
      </sch:rule>
      <sch:rule context="xga:lue.gewerbemeldung.0290//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:rechtsfaehigePersonengesellschaft|erl:referenzierteSubjekte/erl:rechtsfaehigePersonengesellschaft)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-PG-260"/>
      </sch:rule>
      <sch:rule context="xga:alg.gewerbemeldung.0300//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:rechtsfaehigePersonengesellschaft|erl:referenzierteSubjekte/erl:rechtsfaehigePersonengesellschaft)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-PG-260"/>
      </sch:rule>
      <sch:rule context="xga:ext.gewerbemeldung.0400//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:rechtsfaehigePersonengesellschaft|erl:referenzierteSubjekte/erl:rechtsfaehigePersonengesellschaft)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-PG-260"/>
      </sch:rule>
      <sch:rule context="xga:abh.gewerbemeldung.0500//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:rechtsfaehigePersonengesellschaft|erl:referenzierteSubjekte/erl:rechtsfaehigePersonengesellschaft)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-PG-260"/>
      </sch:rule>
      <sch:rule context="erl:gewo.erlaubnisantrag34c.1010//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:rechtsfaehigePersonengesellschaft|erl:referenzierteSubjekte/erl:rechtsfaehigePersonengesellschaft)">
         <sch:extends rule="rule.SCH-RF-PG-260"/>
      </sch:rule>
      <sch:rule context="erl:gewo.erlaubnisantrag34d.1020//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:rechtsfaehigePersonengesellschaft|erl:referenzierteSubjekte/erl:rechtsfaehigePersonengesellschaft)">
         <sch:extends rule="rule.SCH-RF-PG-260"/>
      </sch:rule>
   </sch:pattern>
   <sch:pattern>
      <sch:rule id="rule.SCH-RF-PG-270" abstract="true">
         <sch:assert id="SCH-RF-PG-270"
                     test="if (rf:rechtsform/rf:rechtsformcode/code = '270') then  empty(bk:eintragung) else true()">[SCH-RF-PG-270] Für die Rechtsform 'Gesellschaft des bürgerlichen Rechts (GbR; BGB-Gesellschaft)' - Code 270 - sind die folgenden Eintragungsarten zulässig: keine Eintragungsart</sch:assert>
      </sch:rule>
      <sch:rule context="xga:sta.gewerbemeldung.0100//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:rechtsfaehigePersonengesellschaft|erl:referenzierteSubjekte/erl:rechtsfaehigePersonengesellschaft)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-PG-270"/>
      </sch:rule>
      <sch:rule context="xga:ihk.gewerbemeldung.0200//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:rechtsfaehigePersonengesellschaft|erl:referenzierteSubjekte/erl:rechtsfaehigePersonengesellschaft)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-PG-270"/>
      </sch:rule>
      <sch:rule context="xga:hwk.gewerbemeldung.0210//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:rechtsfaehigePersonengesellschaft|erl:referenzierteSubjekte/erl:rechtsfaehigePersonengesellschaft)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-PG-270"/>
      </sch:rule>
      <sch:rule context="xga:dgu.gewerbemeldung.0230//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:rechtsfaehigePersonengesellschaft|erl:referenzierteSubjekte/erl:rechtsfaehigePersonengesellschaft)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-PG-270"/>
      </sch:rule>
      <sch:rule context="xga:rg.gewerbemeldung.0240//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:rechtsfaehigePersonengesellschaft|erl:referenzierteSubjekte/erl:rechtsfaehigePersonengesellschaft)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-PG-270"/>
      </sch:rule>
      <sch:rule context="xga:fa.gewerbemeldung.0250//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:rechtsfaehigePersonengesellschaft|erl:referenzierteSubjekte/erl:rechtsfaehigePersonengesellschaft)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-PG-270"/>
      </sch:rule>
      <sch:rule context="xga:zv.gewerbemeldung.0260//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:rechtsfaehigePersonengesellschaft|erl:referenzierteSubjekte/erl:rechtsfaehigePersonengesellschaft)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-PG-270"/>
      </sch:rule>
      <sch:rule context="xga:is.gewerbemeldung.0270//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:rechtsfaehigePersonengesellschaft|erl:referenzierteSubjekte/erl:rechtsfaehigePersonengesellschaft)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-PG-270"/>
      </sch:rule>
      <sch:rule context="xga:as.gewerbemeldung.0280//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:rechtsfaehigePersonengesellschaft|erl:referenzierteSubjekte/erl:rechtsfaehigePersonengesellschaft)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-PG-270"/>
      </sch:rule>
      <sch:rule context="xga:lue.gewerbemeldung.0290//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:rechtsfaehigePersonengesellschaft|erl:referenzierteSubjekte/erl:rechtsfaehigePersonengesellschaft)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-PG-270"/>
      </sch:rule>
      <sch:rule context="xga:alg.gewerbemeldung.0300//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:rechtsfaehigePersonengesellschaft|erl:referenzierteSubjekte/erl:rechtsfaehigePersonengesellschaft)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-PG-270"/>
      </sch:rule>
      <sch:rule context="xga:ext.gewerbemeldung.0400//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:rechtsfaehigePersonengesellschaft|erl:referenzierteSubjekte/erl:rechtsfaehigePersonengesellschaft)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-PG-270"/>
      </sch:rule>
      <sch:rule context="xga:abh.gewerbemeldung.0500//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:rechtsfaehigePersonengesellschaft|erl:referenzierteSubjekte/erl:rechtsfaehigePersonengesellschaft)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-PG-270"/>
      </sch:rule>
      <sch:rule context="erl:gewo.erlaubnisantrag34c.1010//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:rechtsfaehigePersonengesellschaft|erl:referenzierteSubjekte/erl:rechtsfaehigePersonengesellschaft)">
         <sch:extends rule="rule.SCH-RF-PG-270"/>
      </sch:rule>
      <sch:rule context="erl:gewo.erlaubnisantrag34d.1020//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:rechtsfaehigePersonengesellschaft|erl:referenzierteSubjekte/erl:rechtsfaehigePersonengesellschaft)">
         <sch:extends rule="rule.SCH-RF-PG-270"/>
      </sch:rule>
   </sch:pattern>
   <sch:pattern>
      <sch:rule id="rule.SCH-RF-PG-280" abstract="true">
         <sch:assert id="SCH-RF-PG-280"
                     test="if (rf:rechtsform/rf:rechtsformcode/code = '280') then bk:eintragung/eintr:artEintragung/code = ('A') else true()">[SCH-RF-PG-280] Für die Rechtsform 'Europäische Wirtschaftliche Interessenvereinigung (EWIV)' - Code 280 - sind die folgenden Eintragungsarten zulässig: A</sch:assert>
      </sch:rule>
      <sch:rule context="xga:sta.gewerbemeldung.0100//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:rechtsfaehigePersonengesellschaft|erl:referenzierteSubjekte/erl:rechtsfaehigePersonengesellschaft)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-PG-280"/>
      </sch:rule>
      <sch:rule context="xga:ihk.gewerbemeldung.0200//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:rechtsfaehigePersonengesellschaft|erl:referenzierteSubjekte/erl:rechtsfaehigePersonengesellschaft)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-PG-280"/>
      </sch:rule>
      <sch:rule context="xga:hwk.gewerbemeldung.0210//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:rechtsfaehigePersonengesellschaft|erl:referenzierteSubjekte/erl:rechtsfaehigePersonengesellschaft)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-PG-280"/>
      </sch:rule>
      <sch:rule context="xga:dgu.gewerbemeldung.0230//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:rechtsfaehigePersonengesellschaft|erl:referenzierteSubjekte/erl:rechtsfaehigePersonengesellschaft)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-PG-280"/>
      </sch:rule>
      <sch:rule context="xga:rg.gewerbemeldung.0240//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:rechtsfaehigePersonengesellschaft|erl:referenzierteSubjekte/erl:rechtsfaehigePersonengesellschaft)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-PG-280"/>
      </sch:rule>
      <sch:rule context="xga:fa.gewerbemeldung.0250//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:rechtsfaehigePersonengesellschaft|erl:referenzierteSubjekte/erl:rechtsfaehigePersonengesellschaft)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-PG-280"/>
      </sch:rule>
      <sch:rule context="xga:zv.gewerbemeldung.0260//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:rechtsfaehigePersonengesellschaft|erl:referenzierteSubjekte/erl:rechtsfaehigePersonengesellschaft)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-PG-280"/>
      </sch:rule>
      <sch:rule context="xga:is.gewerbemeldung.0270//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:rechtsfaehigePersonengesellschaft|erl:referenzierteSubjekte/erl:rechtsfaehigePersonengesellschaft)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-PG-280"/>
      </sch:rule>
      <sch:rule context="xga:as.gewerbemeldung.0280//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:rechtsfaehigePersonengesellschaft|erl:referenzierteSubjekte/erl:rechtsfaehigePersonengesellschaft)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-PG-280"/>
      </sch:rule>
      <sch:rule context="xga:lue.gewerbemeldung.0290//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:rechtsfaehigePersonengesellschaft|erl:referenzierteSubjekte/erl:rechtsfaehigePersonengesellschaft)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-PG-280"/>
      </sch:rule>
      <sch:rule context="xga:alg.gewerbemeldung.0300//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:rechtsfaehigePersonengesellschaft|erl:referenzierteSubjekte/erl:rechtsfaehigePersonengesellschaft)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-PG-280"/>
      </sch:rule>
      <sch:rule context="xga:ext.gewerbemeldung.0400//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:rechtsfaehigePersonengesellschaft|erl:referenzierteSubjekte/erl:rechtsfaehigePersonengesellschaft)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-PG-280"/>
      </sch:rule>
      <sch:rule context="xga:abh.gewerbemeldung.0500//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:rechtsfaehigePersonengesellschaft|erl:referenzierteSubjekte/erl:rechtsfaehigePersonengesellschaft)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-PG-280"/>
      </sch:rule>
      <sch:rule context="erl:gewo.erlaubnisantrag34c.1010//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:rechtsfaehigePersonengesellschaft|erl:referenzierteSubjekte/erl:rechtsfaehigePersonengesellschaft)">
         <sch:extends rule="rule.SCH-RF-PG-280"/>
      </sch:rule>
      <sch:rule context="erl:gewo.erlaubnisantrag34d.1020//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:rechtsfaehigePersonengesellschaft|erl:referenzierteSubjekte/erl:rechtsfaehigePersonengesellschaft)">
         <sch:extends rule="rule.SCH-RF-PG-280"/>
      </sch:rule>
   </sch:pattern>
   <sch:pattern>
      <sch:rule id="rule.SCH-RF-PG-290" abstract="true">
         <sch:assert id="SCH-RF-PG-290"
                     test="if (rf:rechtsform/rf:rechtsformcode/code = '290') then bk:eintragung/eintr:artEintragung/code = ('A') or  empty(bk:eintragung) else true()">[SCH-RF-PG-290] Für die Rechtsform 'Sonstige nicht aufgeführte deutsche Personengesellschaft' - Code 290 - sind die folgenden Eintragungsarten zulässig: A oder keine Eintragungsart</sch:assert>
      </sch:rule>
      <sch:rule context="xga:sta.gewerbemeldung.0100//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:rechtsfaehigePersonengesellschaft|erl:referenzierteSubjekte/erl:rechtsfaehigePersonengesellschaft)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-PG-290"/>
      </sch:rule>
      <sch:rule context="xga:ihk.gewerbemeldung.0200//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:rechtsfaehigePersonengesellschaft|erl:referenzierteSubjekte/erl:rechtsfaehigePersonengesellschaft)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-PG-290"/>
      </sch:rule>
      <sch:rule context="xga:hwk.gewerbemeldung.0210//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:rechtsfaehigePersonengesellschaft|erl:referenzierteSubjekte/erl:rechtsfaehigePersonengesellschaft)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-PG-290"/>
      </sch:rule>
      <sch:rule context="xga:dgu.gewerbemeldung.0230//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:rechtsfaehigePersonengesellschaft|erl:referenzierteSubjekte/erl:rechtsfaehigePersonengesellschaft)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-PG-290"/>
      </sch:rule>
      <sch:rule context="xga:rg.gewerbemeldung.0240//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:rechtsfaehigePersonengesellschaft|erl:referenzierteSubjekte/erl:rechtsfaehigePersonengesellschaft)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-PG-290"/>
      </sch:rule>
      <sch:rule context="xga:fa.gewerbemeldung.0250//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:rechtsfaehigePersonengesellschaft|erl:referenzierteSubjekte/erl:rechtsfaehigePersonengesellschaft)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-PG-290"/>
      </sch:rule>
      <sch:rule context="xga:zv.gewerbemeldung.0260//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:rechtsfaehigePersonengesellschaft|erl:referenzierteSubjekte/erl:rechtsfaehigePersonengesellschaft)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-PG-290"/>
      </sch:rule>
      <sch:rule context="xga:is.gewerbemeldung.0270//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:rechtsfaehigePersonengesellschaft|erl:referenzierteSubjekte/erl:rechtsfaehigePersonengesellschaft)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-PG-290"/>
      </sch:rule>
      <sch:rule context="xga:as.gewerbemeldung.0280//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:rechtsfaehigePersonengesellschaft|erl:referenzierteSubjekte/erl:rechtsfaehigePersonengesellschaft)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-PG-290"/>
      </sch:rule>
      <sch:rule context="xga:lue.gewerbemeldung.0290//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:rechtsfaehigePersonengesellschaft|erl:referenzierteSubjekte/erl:rechtsfaehigePersonengesellschaft)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-PG-290"/>
      </sch:rule>
      <sch:rule context="xga:alg.gewerbemeldung.0300//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:rechtsfaehigePersonengesellschaft|erl:referenzierteSubjekte/erl:rechtsfaehigePersonengesellschaft)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-PG-290"/>
      </sch:rule>
      <sch:rule context="xga:ext.gewerbemeldung.0400//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:rechtsfaehigePersonengesellschaft|erl:referenzierteSubjekte/erl:rechtsfaehigePersonengesellschaft)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-PG-290"/>
      </sch:rule>
      <sch:rule context="xga:abh.gewerbemeldung.0500//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:rechtsfaehigePersonengesellschaft|erl:referenzierteSubjekte/erl:rechtsfaehigePersonengesellschaft)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-PG-290"/>
      </sch:rule>
      <sch:rule context="erl:gewo.erlaubnisantrag34c.1010//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:rechtsfaehigePersonengesellschaft|erl:referenzierteSubjekte/erl:rechtsfaehigePersonengesellschaft)">
         <sch:extends rule="rule.SCH-RF-PG-290"/>
      </sch:rule>
      <sch:rule context="erl:gewo.erlaubnisantrag34d.1020//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:rechtsfaehigePersonengesellschaft|erl:referenzierteSubjekte/erl:rechtsfaehigePersonengesellschaft)">
         <sch:extends rule="rule.SCH-RF-PG-290"/>
      </sch:rule>
   </sch:pattern>
   <sch:pattern>
      <sch:rule id="rule.SCH-RF-JP-310" abstract="true">
         <sch:assert id="SCH-RF-JP-310"
                     test="if (rf:rechtsform/rf:rechtsformcode/code = '310') then bk:eintragung/eintr:artEintragung/code = ('B') else true()">[SCH-RF-JP-310] Für die Rechtsform 'Aktiengesellschaft (AG)' - Code 310 - sind die folgenden Eintragungsarten zulässig: B</sch:assert>
      </sch:rule>
      <sch:rule context="xga:sta.gewerbemeldung.0100//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:juristischePerson|erl:referenzierteSubjekte/erl:juristischePerson)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-JP-310"/>
      </sch:rule>
      <sch:rule context="xga:ihk.gewerbemeldung.0200//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:juristischePerson|erl:referenzierteSubjekte/erl:juristischePerson)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-JP-310"/>
      </sch:rule>
      <sch:rule context="xga:hwk.gewerbemeldung.0210//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:juristischePerson|erl:referenzierteSubjekte/erl:juristischePerson)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-JP-310"/>
      </sch:rule>
      <sch:rule context="xga:dgu.gewerbemeldung.0230//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:juristischePerson|erl:referenzierteSubjekte/erl:juristischePerson)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-JP-310"/>
      </sch:rule>
      <sch:rule context="xga:rg.gewerbemeldung.0240//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:juristischePerson|erl:referenzierteSubjekte/erl:juristischePerson)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-JP-310"/>
      </sch:rule>
      <sch:rule context="xga:fa.gewerbemeldung.0250//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:juristischePerson|erl:referenzierteSubjekte/erl:juristischePerson)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-JP-310"/>
      </sch:rule>
      <sch:rule context="xga:zv.gewerbemeldung.0260//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:juristischePerson|erl:referenzierteSubjekte/erl:juristischePerson)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-JP-310"/>
      </sch:rule>
      <sch:rule context="xga:is.gewerbemeldung.0270//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:juristischePerson|erl:referenzierteSubjekte/erl:juristischePerson)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-JP-310"/>
      </sch:rule>
      <sch:rule context="xga:as.gewerbemeldung.0280//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:juristischePerson|erl:referenzierteSubjekte/erl:juristischePerson)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-JP-310"/>
      </sch:rule>
      <sch:rule context="xga:lue.gewerbemeldung.0290//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:juristischePerson|erl:referenzierteSubjekte/erl:juristischePerson)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-JP-310"/>
      </sch:rule>
      <sch:rule context="xga:alg.gewerbemeldung.0300//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:juristischePerson|erl:referenzierteSubjekte/erl:juristischePerson)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-JP-310"/>
      </sch:rule>
      <sch:rule context="xga:ext.gewerbemeldung.0400//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:juristischePerson|erl:referenzierteSubjekte/erl:juristischePerson)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-JP-310"/>
      </sch:rule>
      <sch:rule context="xga:abh.gewerbemeldung.0500//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:juristischePerson|erl:referenzierteSubjekte/erl:juristischePerson)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-JP-310"/>
      </sch:rule>
      <sch:rule context="erl:gewo.erlaubnisantrag34c.1010//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:juristischePerson|erl:referenzierteSubjekte/erl:juristischePerson)">
         <sch:extends rule="rule.SCH-RF-JP-310"/>
      </sch:rule>
      <sch:rule context="erl:gewo.erlaubnisantrag34d.1020//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:juristischePerson|erl:referenzierteSubjekte/erl:juristischePerson)">
         <sch:extends rule="rule.SCH-RF-JP-310"/>
      </sch:rule>
   </sch:pattern>
   <sch:pattern>
      <sch:rule id="rule.SCH-RF-JP-320" abstract="true">
         <sch:assert id="SCH-RF-JP-320"
                     test="if (rf:rechtsform/rf:rechtsformcode/code = '320') then bk:eintragung/eintr:artEintragung/code = ('B') else true()">[SCH-RF-JP-320] Für die Rechtsform 'Kommanditgesellschaft auf Aktien (KGaA)' - Code 320 - sind die folgenden Eintragungsarten zulässig: B</sch:assert>
      </sch:rule>
      <sch:rule context="xga:sta.gewerbemeldung.0100//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:juristischePerson|erl:referenzierteSubjekte/erl:juristischePerson)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-JP-320"/>
      </sch:rule>
      <sch:rule context="xga:ihk.gewerbemeldung.0200//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:juristischePerson|erl:referenzierteSubjekte/erl:juristischePerson)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-JP-320"/>
      </sch:rule>
      <sch:rule context="xga:hwk.gewerbemeldung.0210//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:juristischePerson|erl:referenzierteSubjekte/erl:juristischePerson)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-JP-320"/>
      </sch:rule>
      <sch:rule context="xga:dgu.gewerbemeldung.0230//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:juristischePerson|erl:referenzierteSubjekte/erl:juristischePerson)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-JP-320"/>
      </sch:rule>
      <sch:rule context="xga:rg.gewerbemeldung.0240//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:juristischePerson|erl:referenzierteSubjekte/erl:juristischePerson)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-JP-320"/>
      </sch:rule>
      <sch:rule context="xga:fa.gewerbemeldung.0250//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:juristischePerson|erl:referenzierteSubjekte/erl:juristischePerson)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-JP-320"/>
      </sch:rule>
      <sch:rule context="xga:zv.gewerbemeldung.0260//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:juristischePerson|erl:referenzierteSubjekte/erl:juristischePerson)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-JP-320"/>
      </sch:rule>
      <sch:rule context="xga:is.gewerbemeldung.0270//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:juristischePerson|erl:referenzierteSubjekte/erl:juristischePerson)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-JP-320"/>
      </sch:rule>
      <sch:rule context="xga:as.gewerbemeldung.0280//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:juristischePerson|erl:referenzierteSubjekte/erl:juristischePerson)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-JP-320"/>
      </sch:rule>
      <sch:rule context="xga:lue.gewerbemeldung.0290//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:juristischePerson|erl:referenzierteSubjekte/erl:juristischePerson)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-JP-320"/>
      </sch:rule>
      <sch:rule context="xga:alg.gewerbemeldung.0300//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:juristischePerson|erl:referenzierteSubjekte/erl:juristischePerson)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-JP-320"/>
      </sch:rule>
      <sch:rule context="xga:ext.gewerbemeldung.0400//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:juristischePerson|erl:referenzierteSubjekte/erl:juristischePerson)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-JP-320"/>
      </sch:rule>
      <sch:rule context="xga:abh.gewerbemeldung.0500//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:juristischePerson|erl:referenzierteSubjekte/erl:juristischePerson)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-JP-320"/>
      </sch:rule>
      <sch:rule context="erl:gewo.erlaubnisantrag34c.1010//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:juristischePerson|erl:referenzierteSubjekte/erl:juristischePerson)">
         <sch:extends rule="rule.SCH-RF-JP-320"/>
      </sch:rule>
      <sch:rule context="erl:gewo.erlaubnisantrag34d.1020//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:juristischePerson|erl:referenzierteSubjekte/erl:juristischePerson)">
         <sch:extends rule="rule.SCH-RF-JP-320"/>
      </sch:rule>
   </sch:pattern>
   <sch:pattern>
      <sch:rule id="rule.SCH-RF-JP-321" abstract="true">
         <sch:assert id="SCH-RF-JP-321"
                     test="if (rf:rechtsform/rf:rechtsformcode/code = '321') then bk:eintragung/eintr:artEintragung/code = ('B') else true()">[SCH-RF-JP-321] Für die Rechtsform 'Aktiengesellschaft &amp; Co. Kommanditgesellschaft auf Aktien (AG &amp; Co. KGaA)' - Code 321 - sind die folgenden Eintragungsarten zulässig: B</sch:assert>
      </sch:rule>
      <sch:rule context="xga:sta.gewerbemeldung.0100//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:juristischePerson|erl:referenzierteSubjekte/erl:juristischePerson)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-JP-321"/>
      </sch:rule>
      <sch:rule context="xga:ihk.gewerbemeldung.0200//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:juristischePerson|erl:referenzierteSubjekte/erl:juristischePerson)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-JP-321"/>
      </sch:rule>
      <sch:rule context="xga:hwk.gewerbemeldung.0210//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:juristischePerson|erl:referenzierteSubjekte/erl:juristischePerson)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-JP-321"/>
      </sch:rule>
      <sch:rule context="xga:dgu.gewerbemeldung.0230//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:juristischePerson|erl:referenzierteSubjekte/erl:juristischePerson)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-JP-321"/>
      </sch:rule>
      <sch:rule context="xga:rg.gewerbemeldung.0240//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:juristischePerson|erl:referenzierteSubjekte/erl:juristischePerson)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-JP-321"/>
      </sch:rule>
      <sch:rule context="xga:fa.gewerbemeldung.0250//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:juristischePerson|erl:referenzierteSubjekte/erl:juristischePerson)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-JP-321"/>
      </sch:rule>
      <sch:rule context="xga:zv.gewerbemeldung.0260//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:juristischePerson|erl:referenzierteSubjekte/erl:juristischePerson)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-JP-321"/>
      </sch:rule>
      <sch:rule context="xga:is.gewerbemeldung.0270//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:juristischePerson|erl:referenzierteSubjekte/erl:juristischePerson)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-JP-321"/>
      </sch:rule>
      <sch:rule context="xga:as.gewerbemeldung.0280//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:juristischePerson|erl:referenzierteSubjekte/erl:juristischePerson)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-JP-321"/>
      </sch:rule>
      <sch:rule context="xga:lue.gewerbemeldung.0290//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:juristischePerson|erl:referenzierteSubjekte/erl:juristischePerson)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-JP-321"/>
      </sch:rule>
      <sch:rule context="xga:alg.gewerbemeldung.0300//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:juristischePerson|erl:referenzierteSubjekte/erl:juristischePerson)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-JP-321"/>
      </sch:rule>
      <sch:rule context="xga:ext.gewerbemeldung.0400//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:juristischePerson|erl:referenzierteSubjekte/erl:juristischePerson)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-JP-321"/>
      </sch:rule>
      <sch:rule context="xga:abh.gewerbemeldung.0500//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:juristischePerson|erl:referenzierteSubjekte/erl:juristischePerson)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-JP-321"/>
      </sch:rule>
      <sch:rule context="erl:gewo.erlaubnisantrag34c.1010//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:juristischePerson|erl:referenzierteSubjekte/erl:juristischePerson)">
         <sch:extends rule="rule.SCH-RF-JP-321"/>
      </sch:rule>
      <sch:rule context="erl:gewo.erlaubnisantrag34d.1020//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:juristischePerson|erl:referenzierteSubjekte/erl:juristischePerson)">
         <sch:extends rule="rule.SCH-RF-JP-321"/>
      </sch:rule>
   </sch:pattern>
   <sch:pattern>
      <sch:rule id="rule.SCH-RF-JP-322" abstract="true">
         <sch:assert id="SCH-RF-JP-322"
                     test="if (rf:rechtsform/rf:rechtsformcode/code = '322') then bk:eintragung/eintr:artEintragung/code = ('B') else true()">[SCH-RF-JP-322] Für die Rechtsform 'Gesellschaft mit beschränkter Haftung &amp; Co. Kommanditgesellschaft auf Aktien (GmbH &amp; Co. KGaA)' - Code 322 - sind die folgenden Eintragungsarten zulässig: B</sch:assert>
      </sch:rule>
      <sch:rule context="xga:sta.gewerbemeldung.0100//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:juristischePerson|erl:referenzierteSubjekte/erl:juristischePerson)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-JP-322"/>
      </sch:rule>
      <sch:rule context="xga:ihk.gewerbemeldung.0200//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:juristischePerson|erl:referenzierteSubjekte/erl:juristischePerson)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-JP-322"/>
      </sch:rule>
      <sch:rule context="xga:hwk.gewerbemeldung.0210//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:juristischePerson|erl:referenzierteSubjekte/erl:juristischePerson)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-JP-322"/>
      </sch:rule>
      <sch:rule context="xga:dgu.gewerbemeldung.0230//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:juristischePerson|erl:referenzierteSubjekte/erl:juristischePerson)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-JP-322"/>
      </sch:rule>
      <sch:rule context="xga:rg.gewerbemeldung.0240//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:juristischePerson|erl:referenzierteSubjekte/erl:juristischePerson)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-JP-322"/>
      </sch:rule>
      <sch:rule context="xga:fa.gewerbemeldung.0250//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:juristischePerson|erl:referenzierteSubjekte/erl:juristischePerson)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-JP-322"/>
      </sch:rule>
      <sch:rule context="xga:zv.gewerbemeldung.0260//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:juristischePerson|erl:referenzierteSubjekte/erl:juristischePerson)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-JP-322"/>
      </sch:rule>
      <sch:rule context="xga:is.gewerbemeldung.0270//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:juristischePerson|erl:referenzierteSubjekte/erl:juristischePerson)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-JP-322"/>
      </sch:rule>
      <sch:rule context="xga:as.gewerbemeldung.0280//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:juristischePerson|erl:referenzierteSubjekte/erl:juristischePerson)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-JP-322"/>
      </sch:rule>
      <sch:rule context="xga:lue.gewerbemeldung.0290//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:juristischePerson|erl:referenzierteSubjekte/erl:juristischePerson)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-JP-322"/>
      </sch:rule>
      <sch:rule context="xga:alg.gewerbemeldung.0300//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:juristischePerson|erl:referenzierteSubjekte/erl:juristischePerson)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-JP-322"/>
      </sch:rule>
      <sch:rule context="xga:ext.gewerbemeldung.0400//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:juristischePerson|erl:referenzierteSubjekte/erl:juristischePerson)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-JP-322"/>
      </sch:rule>
      <sch:rule context="xga:abh.gewerbemeldung.0500//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:juristischePerson|erl:referenzierteSubjekte/erl:juristischePerson)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-JP-322"/>
      </sch:rule>
      <sch:rule context="erl:gewo.erlaubnisantrag34c.1010//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:juristischePerson|erl:referenzierteSubjekte/erl:juristischePerson)">
         <sch:extends rule="rule.SCH-RF-JP-322"/>
      </sch:rule>
      <sch:rule context="erl:gewo.erlaubnisantrag34d.1020//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:juristischePerson|erl:referenzierteSubjekte/erl:juristischePerson)">
         <sch:extends rule="rule.SCH-RF-JP-322"/>
      </sch:rule>
   </sch:pattern>
   <sch:pattern>
      <sch:rule id="rule.SCH-RF-JP-323" abstract="true">
         <sch:assert id="SCH-RF-JP-323"
                     test="if (rf:rechtsform/rf:rechtsformcode/code = '323') then bk:eintragung/eintr:artEintragung/code = ('B') else true()">[SCH-RF-JP-323] Für die Rechtsform 'UG (haftungsbeschränkt) &amp; Co.KGaA' - Code 323 - sind die folgenden Eintragungsarten zulässig: B</sch:assert>
      </sch:rule>
      <sch:rule context="xga:sta.gewerbemeldung.0100//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:juristischePerson|erl:referenzierteSubjekte/erl:juristischePerson)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-JP-323"/>
      </sch:rule>
      <sch:rule context="xga:ihk.gewerbemeldung.0200//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:juristischePerson|erl:referenzierteSubjekte/erl:juristischePerson)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-JP-323"/>
      </sch:rule>
      <sch:rule context="xga:hwk.gewerbemeldung.0210//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:juristischePerson|erl:referenzierteSubjekte/erl:juristischePerson)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-JP-323"/>
      </sch:rule>
      <sch:rule context="xga:dgu.gewerbemeldung.0230//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:juristischePerson|erl:referenzierteSubjekte/erl:juristischePerson)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-JP-323"/>
      </sch:rule>
      <sch:rule context="xga:rg.gewerbemeldung.0240//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:juristischePerson|erl:referenzierteSubjekte/erl:juristischePerson)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-JP-323"/>
      </sch:rule>
      <sch:rule context="xga:fa.gewerbemeldung.0250//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:juristischePerson|erl:referenzierteSubjekte/erl:juristischePerson)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-JP-323"/>
      </sch:rule>
      <sch:rule context="xga:zv.gewerbemeldung.0260//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:juristischePerson|erl:referenzierteSubjekte/erl:juristischePerson)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-JP-323"/>
      </sch:rule>
      <sch:rule context="xga:is.gewerbemeldung.0270//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:juristischePerson|erl:referenzierteSubjekte/erl:juristischePerson)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-JP-323"/>
      </sch:rule>
      <sch:rule context="xga:as.gewerbemeldung.0280//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:juristischePerson|erl:referenzierteSubjekte/erl:juristischePerson)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-JP-323"/>
      </sch:rule>
      <sch:rule context="xga:lue.gewerbemeldung.0290//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:juristischePerson|erl:referenzierteSubjekte/erl:juristischePerson)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-JP-323"/>
      </sch:rule>
      <sch:rule context="xga:alg.gewerbemeldung.0300//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:juristischePerson|erl:referenzierteSubjekte/erl:juristischePerson)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-JP-323"/>
      </sch:rule>
      <sch:rule context="xga:ext.gewerbemeldung.0400//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:juristischePerson|erl:referenzierteSubjekte/erl:juristischePerson)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-JP-323"/>
      </sch:rule>
      <sch:rule context="xga:abh.gewerbemeldung.0500//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:juristischePerson|erl:referenzierteSubjekte/erl:juristischePerson)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-JP-323"/>
      </sch:rule>
      <sch:rule context="erl:gewo.erlaubnisantrag34c.1010//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:juristischePerson|erl:referenzierteSubjekte/erl:juristischePerson)">
         <sch:extends rule="rule.SCH-RF-JP-323"/>
      </sch:rule>
      <sch:rule context="erl:gewo.erlaubnisantrag34d.1020//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:juristischePerson|erl:referenzierteSubjekte/erl:juristischePerson)">
         <sch:extends rule="rule.SCH-RF-JP-323"/>
      </sch:rule>
   </sch:pattern>
   <sch:pattern>
      <sch:rule id="rule.SCH-RF-JP-324" abstract="true">
         <sch:assert id="SCH-RF-JP-324"
                     test="if (rf:rechtsform/rf:rechtsformcode/code = '324') then bk:eintragung/eintr:artEintragung/code = ('B') else true()">[SCH-RF-JP-324] Für die Rechtsform 'Europäische Aktiengesellschaft und Co. Kommanditgesellschaft auf Aktien (SE &amp; Co. KGaA)' - Code 324 - sind die folgenden Eintragungsarten zulässig: B</sch:assert>
      </sch:rule>
      <sch:rule context="xga:sta.gewerbemeldung.0100//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:juristischePerson|erl:referenzierteSubjekte/erl:juristischePerson)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-JP-324"/>
      </sch:rule>
      <sch:rule context="xga:ihk.gewerbemeldung.0200//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:juristischePerson|erl:referenzierteSubjekte/erl:juristischePerson)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-JP-324"/>
      </sch:rule>
      <sch:rule context="xga:hwk.gewerbemeldung.0210//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:juristischePerson|erl:referenzierteSubjekte/erl:juristischePerson)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-JP-324"/>
      </sch:rule>
      <sch:rule context="xga:dgu.gewerbemeldung.0230//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:juristischePerson|erl:referenzierteSubjekte/erl:juristischePerson)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-JP-324"/>
      </sch:rule>
      <sch:rule context="xga:rg.gewerbemeldung.0240//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:juristischePerson|erl:referenzierteSubjekte/erl:juristischePerson)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-JP-324"/>
      </sch:rule>
      <sch:rule context="xga:fa.gewerbemeldung.0250//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:juristischePerson|erl:referenzierteSubjekte/erl:juristischePerson)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-JP-324"/>
      </sch:rule>
      <sch:rule context="xga:zv.gewerbemeldung.0260//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:juristischePerson|erl:referenzierteSubjekte/erl:juristischePerson)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-JP-324"/>
      </sch:rule>
      <sch:rule context="xga:is.gewerbemeldung.0270//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:juristischePerson|erl:referenzierteSubjekte/erl:juristischePerson)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-JP-324"/>
      </sch:rule>
      <sch:rule context="xga:as.gewerbemeldung.0280//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:juristischePerson|erl:referenzierteSubjekte/erl:juristischePerson)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-JP-324"/>
      </sch:rule>
      <sch:rule context="xga:lue.gewerbemeldung.0290//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:juristischePerson|erl:referenzierteSubjekte/erl:juristischePerson)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-JP-324"/>
      </sch:rule>
      <sch:rule context="xga:alg.gewerbemeldung.0300//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:juristischePerson|erl:referenzierteSubjekte/erl:juristischePerson)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-JP-324"/>
      </sch:rule>
      <sch:rule context="xga:ext.gewerbemeldung.0400//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:juristischePerson|erl:referenzierteSubjekte/erl:juristischePerson)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-JP-324"/>
      </sch:rule>
      <sch:rule context="xga:abh.gewerbemeldung.0500//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:juristischePerson|erl:referenzierteSubjekte/erl:juristischePerson)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-JP-324"/>
      </sch:rule>
      <sch:rule context="erl:gewo.erlaubnisantrag34c.1010//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:juristischePerson|erl:referenzierteSubjekte/erl:juristischePerson)">
         <sch:extends rule="rule.SCH-RF-JP-324"/>
      </sch:rule>
      <sch:rule context="erl:gewo.erlaubnisantrag34d.1020//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:juristischePerson|erl:referenzierteSubjekte/erl:juristischePerson)">
         <sch:extends rule="rule.SCH-RF-JP-324"/>
      </sch:rule>
   </sch:pattern>
   <sch:pattern>
      <sch:rule id="rule.SCH-RF-JP-350" abstract="true">
         <sch:assert id="SCH-RF-JP-350"
                     test="if (rf:rechtsform/rf:rechtsformcode/code = '350') then bk:eintragung/eintr:artEintragung/code = ('B') else true()">[SCH-RF-JP-350] Für die Rechtsform 'Gesellschaft mit beschränkter Haftung (GmbH); auch gemeinnützige GmbH (gGmbH)' - Code 350 - sind die folgenden Eintragungsarten zulässig: B</sch:assert>
      </sch:rule>
      <sch:rule context="xga:sta.gewerbemeldung.0100//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:juristischePerson|erl:referenzierteSubjekte/erl:juristischePerson)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-JP-350"/>
      </sch:rule>
      <sch:rule context="xga:ihk.gewerbemeldung.0200//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:juristischePerson|erl:referenzierteSubjekte/erl:juristischePerson)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-JP-350"/>
      </sch:rule>
      <sch:rule context="xga:hwk.gewerbemeldung.0210//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:juristischePerson|erl:referenzierteSubjekte/erl:juristischePerson)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-JP-350"/>
      </sch:rule>
      <sch:rule context="xga:dgu.gewerbemeldung.0230//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:juristischePerson|erl:referenzierteSubjekte/erl:juristischePerson)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-JP-350"/>
      </sch:rule>
      <sch:rule context="xga:rg.gewerbemeldung.0240//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:juristischePerson|erl:referenzierteSubjekte/erl:juristischePerson)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-JP-350"/>
      </sch:rule>
      <sch:rule context="xga:fa.gewerbemeldung.0250//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:juristischePerson|erl:referenzierteSubjekte/erl:juristischePerson)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-JP-350"/>
      </sch:rule>
      <sch:rule context="xga:zv.gewerbemeldung.0260//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:juristischePerson|erl:referenzierteSubjekte/erl:juristischePerson)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-JP-350"/>
      </sch:rule>
      <sch:rule context="xga:is.gewerbemeldung.0270//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:juristischePerson|erl:referenzierteSubjekte/erl:juristischePerson)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-JP-350"/>
      </sch:rule>
      <sch:rule context="xga:as.gewerbemeldung.0280//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:juristischePerson|erl:referenzierteSubjekte/erl:juristischePerson)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-JP-350"/>
      </sch:rule>
      <sch:rule context="xga:lue.gewerbemeldung.0290//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:juristischePerson|erl:referenzierteSubjekte/erl:juristischePerson)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-JP-350"/>
      </sch:rule>
      <sch:rule context="xga:alg.gewerbemeldung.0300//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:juristischePerson|erl:referenzierteSubjekte/erl:juristischePerson)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-JP-350"/>
      </sch:rule>
      <sch:rule context="xga:ext.gewerbemeldung.0400//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:juristischePerson|erl:referenzierteSubjekte/erl:juristischePerson)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-JP-350"/>
      </sch:rule>
      <sch:rule context="xga:abh.gewerbemeldung.0500//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:juristischePerson|erl:referenzierteSubjekte/erl:juristischePerson)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-JP-350"/>
      </sch:rule>
      <sch:rule context="erl:gewo.erlaubnisantrag34c.1010//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:juristischePerson|erl:referenzierteSubjekte/erl:juristischePerson)">
         <sch:extends rule="rule.SCH-RF-JP-350"/>
      </sch:rule>
      <sch:rule context="erl:gewo.erlaubnisantrag34d.1020//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:juristischePerson|erl:referenzierteSubjekte/erl:juristischePerson)">
         <sch:extends rule="rule.SCH-RF-JP-350"/>
      </sch:rule>
   </sch:pattern>
   <sch:pattern>
      <sch:rule id="rule.SCH-RF-JP-351" abstract="true">
         <sch:assert id="SCH-RF-JP-351"
                     test="if (rf:rechtsform/rf:rechtsformcode/code = '351') then bk:eintragung/eintr:artEintragung/code = ('B') else true()">[SCH-RF-JP-351] Für die Rechtsform 'Unternehmergesellschaft (haftungsbeschränkt); auch UG (haftungsbeschränkt)' - Code 351 - sind die folgenden Eintragungsarten zulässig: B</sch:assert>
      </sch:rule>
      <sch:rule context="xga:sta.gewerbemeldung.0100//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:juristischePerson|erl:referenzierteSubjekte/erl:juristischePerson)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-JP-351"/>
      </sch:rule>
      <sch:rule context="xga:ihk.gewerbemeldung.0200//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:juristischePerson|erl:referenzierteSubjekte/erl:juristischePerson)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-JP-351"/>
      </sch:rule>
      <sch:rule context="xga:hwk.gewerbemeldung.0210//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:juristischePerson|erl:referenzierteSubjekte/erl:juristischePerson)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-JP-351"/>
      </sch:rule>
      <sch:rule context="xga:dgu.gewerbemeldung.0230//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:juristischePerson|erl:referenzierteSubjekte/erl:juristischePerson)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-JP-351"/>
      </sch:rule>
      <sch:rule context="xga:rg.gewerbemeldung.0240//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:juristischePerson|erl:referenzierteSubjekte/erl:juristischePerson)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-JP-351"/>
      </sch:rule>
      <sch:rule context="xga:fa.gewerbemeldung.0250//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:juristischePerson|erl:referenzierteSubjekte/erl:juristischePerson)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-JP-351"/>
      </sch:rule>
      <sch:rule context="xga:zv.gewerbemeldung.0260//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:juristischePerson|erl:referenzierteSubjekte/erl:juristischePerson)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-JP-351"/>
      </sch:rule>
      <sch:rule context="xga:is.gewerbemeldung.0270//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:juristischePerson|erl:referenzierteSubjekte/erl:juristischePerson)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-JP-351"/>
      </sch:rule>
      <sch:rule context="xga:as.gewerbemeldung.0280//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:juristischePerson|erl:referenzierteSubjekte/erl:juristischePerson)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-JP-351"/>
      </sch:rule>
      <sch:rule context="xga:lue.gewerbemeldung.0290//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:juristischePerson|erl:referenzierteSubjekte/erl:juristischePerson)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-JP-351"/>
      </sch:rule>
      <sch:rule context="xga:alg.gewerbemeldung.0300//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:juristischePerson|erl:referenzierteSubjekte/erl:juristischePerson)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-JP-351"/>
      </sch:rule>
      <sch:rule context="xga:ext.gewerbemeldung.0400//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:juristischePerson|erl:referenzierteSubjekte/erl:juristischePerson)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-JP-351"/>
      </sch:rule>
      <sch:rule context="xga:abh.gewerbemeldung.0500//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:juristischePerson|erl:referenzierteSubjekte/erl:juristischePerson)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-JP-351"/>
      </sch:rule>
      <sch:rule context="erl:gewo.erlaubnisantrag34c.1010//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:juristischePerson|erl:referenzierteSubjekte/erl:juristischePerson)">
         <sch:extends rule="rule.SCH-RF-JP-351"/>
      </sch:rule>
      <sch:rule context="erl:gewo.erlaubnisantrag34d.1020//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:juristischePerson|erl:referenzierteSubjekte/erl:juristischePerson)">
         <sch:extends rule="rule.SCH-RF-JP-351"/>
      </sch:rule>
   </sch:pattern>
   <sch:pattern>
      <sch:rule id="rule.SCH-RF-PV-355" abstract="true">
         <sch:assert id="SCH-RF-PV-355"
                     test="if (rf:rechtsform/rf:rechtsformcode/code = '355') then  empty(bk:eintragung) else true()">[SCH-RF-PV-355] Für die Rechtsform 'Gesellschaft mit beschränkter Haftung in Gründung (GmbH in Gründung; GmbH i.G.; auch gemeinnützige GmbH in Gründung (gGmbH i.G.)' - Code 355 - sind die folgenden Eintragungsarten zulässig: keine Eintragungsart</sch:assert>
      </sch:rule>
      <sch:rule context="xga:sta.gewerbemeldung.0100//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:sonstigePersonenvereinigung|erl:referenzierteSubjekte/erl:sonstigePersonenvereinigung)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-PV-355"/>
      </sch:rule>
      <sch:rule context="xga:ihk.gewerbemeldung.0200//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:sonstigePersonenvereinigung|erl:referenzierteSubjekte/erl:sonstigePersonenvereinigung)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-PV-355"/>
      </sch:rule>
      <sch:rule context="xga:hwk.gewerbemeldung.0210//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:sonstigePersonenvereinigung|erl:referenzierteSubjekte/erl:sonstigePersonenvereinigung)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-PV-355"/>
      </sch:rule>
      <sch:rule context="xga:dgu.gewerbemeldung.0230//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:sonstigePersonenvereinigung|erl:referenzierteSubjekte/erl:sonstigePersonenvereinigung)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-PV-355"/>
      </sch:rule>
      <sch:rule context="xga:rg.gewerbemeldung.0240//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:sonstigePersonenvereinigung|erl:referenzierteSubjekte/erl:sonstigePersonenvereinigung)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-PV-355"/>
      </sch:rule>
      <sch:rule context="xga:fa.gewerbemeldung.0250//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:sonstigePersonenvereinigung|erl:referenzierteSubjekte/erl:sonstigePersonenvereinigung)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-PV-355"/>
      </sch:rule>
      <sch:rule context="xga:zv.gewerbemeldung.0260//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:sonstigePersonenvereinigung|erl:referenzierteSubjekte/erl:sonstigePersonenvereinigung)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-PV-355"/>
      </sch:rule>
      <sch:rule context="xga:is.gewerbemeldung.0270//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:sonstigePersonenvereinigung|erl:referenzierteSubjekte/erl:sonstigePersonenvereinigung)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-PV-355"/>
      </sch:rule>
      <sch:rule context="xga:as.gewerbemeldung.0280//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:sonstigePersonenvereinigung|erl:referenzierteSubjekte/erl:sonstigePersonenvereinigung)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-PV-355"/>
      </sch:rule>
      <sch:rule context="xga:lue.gewerbemeldung.0290//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:sonstigePersonenvereinigung|erl:referenzierteSubjekte/erl:sonstigePersonenvereinigung)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-PV-355"/>
      </sch:rule>
      <sch:rule context="xga:alg.gewerbemeldung.0300//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:sonstigePersonenvereinigung|erl:referenzierteSubjekte/erl:sonstigePersonenvereinigung)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-PV-355"/>
      </sch:rule>
      <sch:rule context="xga:ext.gewerbemeldung.0400//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:sonstigePersonenvereinigung|erl:referenzierteSubjekte/erl:sonstigePersonenvereinigung)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-PV-355"/>
      </sch:rule>
      <sch:rule context="xga:abh.gewerbemeldung.0500//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:sonstigePersonenvereinigung|erl:referenzierteSubjekte/erl:sonstigePersonenvereinigung)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-PV-355"/>
      </sch:rule>
      <sch:rule context="erl:gewo.erlaubnisantrag34c.1010//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:sonstigePersonenvereinigung|erl:referenzierteSubjekte/erl:sonstigePersonenvereinigung)">
         <sch:extends rule="rule.SCH-RF-PV-355"/>
      </sch:rule>
      <sch:rule context="erl:gewo.erlaubnisantrag34d.1020//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:sonstigePersonenvereinigung|erl:referenzierteSubjekte/erl:sonstigePersonenvereinigung)">
         <sch:extends rule="rule.SCH-RF-PV-355"/>
      </sch:rule>
   </sch:pattern>
   <sch:pattern>
      <sch:rule id="rule.SCH-RF-PV-356" abstract="true">
         <sch:assert id="SCH-RF-PV-356"
                     test="if (rf:rechtsform/rf:rechtsformcode/code = '356') then  empty(bk:eintragung) else true()">[SCH-RF-PV-356] Für die Rechtsform 'Unternehmergesellschaft (haftungsbeschränkt) in Gründung (UG (haftungsbeschränkt) in Gründung; UG (haftungsbeschränkt) i.G.' - Code 356 - sind die folgenden Eintragungsarten zulässig: keine Eintragungsart</sch:assert>
      </sch:rule>
      <sch:rule context="xga:sta.gewerbemeldung.0100//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:sonstigePersonenvereinigung|erl:referenzierteSubjekte/erl:sonstigePersonenvereinigung)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-PV-356"/>
      </sch:rule>
      <sch:rule context="xga:ihk.gewerbemeldung.0200//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:sonstigePersonenvereinigung|erl:referenzierteSubjekte/erl:sonstigePersonenvereinigung)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-PV-356"/>
      </sch:rule>
      <sch:rule context="xga:hwk.gewerbemeldung.0210//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:sonstigePersonenvereinigung|erl:referenzierteSubjekte/erl:sonstigePersonenvereinigung)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-PV-356"/>
      </sch:rule>
      <sch:rule context="xga:dgu.gewerbemeldung.0230//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:sonstigePersonenvereinigung|erl:referenzierteSubjekte/erl:sonstigePersonenvereinigung)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-PV-356"/>
      </sch:rule>
      <sch:rule context="xga:rg.gewerbemeldung.0240//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:sonstigePersonenvereinigung|erl:referenzierteSubjekte/erl:sonstigePersonenvereinigung)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-PV-356"/>
      </sch:rule>
      <sch:rule context="xga:fa.gewerbemeldung.0250//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:sonstigePersonenvereinigung|erl:referenzierteSubjekte/erl:sonstigePersonenvereinigung)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-PV-356"/>
      </sch:rule>
      <sch:rule context="xga:zv.gewerbemeldung.0260//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:sonstigePersonenvereinigung|erl:referenzierteSubjekte/erl:sonstigePersonenvereinigung)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-PV-356"/>
      </sch:rule>
      <sch:rule context="xga:is.gewerbemeldung.0270//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:sonstigePersonenvereinigung|erl:referenzierteSubjekte/erl:sonstigePersonenvereinigung)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-PV-356"/>
      </sch:rule>
      <sch:rule context="xga:as.gewerbemeldung.0280//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:sonstigePersonenvereinigung|erl:referenzierteSubjekte/erl:sonstigePersonenvereinigung)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-PV-356"/>
      </sch:rule>
      <sch:rule context="xga:lue.gewerbemeldung.0290//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:sonstigePersonenvereinigung|erl:referenzierteSubjekte/erl:sonstigePersonenvereinigung)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-PV-356"/>
      </sch:rule>
      <sch:rule context="xga:alg.gewerbemeldung.0300//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:sonstigePersonenvereinigung|erl:referenzierteSubjekte/erl:sonstigePersonenvereinigung)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-PV-356"/>
      </sch:rule>
      <sch:rule context="xga:ext.gewerbemeldung.0400//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:sonstigePersonenvereinigung|erl:referenzierteSubjekte/erl:sonstigePersonenvereinigung)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-PV-356"/>
      </sch:rule>
      <sch:rule context="xga:abh.gewerbemeldung.0500//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:sonstigePersonenvereinigung|erl:referenzierteSubjekte/erl:sonstigePersonenvereinigung)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-PV-356"/>
      </sch:rule>
      <sch:rule context="erl:gewo.erlaubnisantrag34c.1010//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:sonstigePersonenvereinigung|erl:referenzierteSubjekte/erl:sonstigePersonenvereinigung)">
         <sch:extends rule="rule.SCH-RF-PV-356"/>
      </sch:rule>
      <sch:rule context="erl:gewo.erlaubnisantrag34d.1020//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:sonstigePersonenvereinigung|erl:referenzierteSubjekte/erl:sonstigePersonenvereinigung)">
         <sch:extends rule="rule.SCH-RF-PV-356"/>
      </sch:rule>
   </sch:pattern>
   <sch:pattern>
      <sch:rule id="rule.SCH-RF-JP-360" abstract="true">
         <sch:assert id="SCH-RF-JP-360"
                     test="if (rf:rechtsform/rf:rechtsformcode/code = '360') then bk:eintragung/eintr:artEintragung/code = ('B', 'X') else true()">[SCH-RF-JP-360] Für die Rechtsform 'Europäische Aktiengesellschaft (SE)' - Code 360 - sind die folgenden Eintragungsarten zulässig: B oder X</sch:assert>
      </sch:rule>
      <sch:rule context="xga:sta.gewerbemeldung.0100//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:juristischePerson|erl:referenzierteSubjekte/erl:juristischePerson)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-JP-360"/>
      </sch:rule>
      <sch:rule context="xga:ihk.gewerbemeldung.0200//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:juristischePerson|erl:referenzierteSubjekte/erl:juristischePerson)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-JP-360"/>
      </sch:rule>
      <sch:rule context="xga:hwk.gewerbemeldung.0210//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:juristischePerson|erl:referenzierteSubjekte/erl:juristischePerson)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-JP-360"/>
      </sch:rule>
      <sch:rule context="xga:dgu.gewerbemeldung.0230//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:juristischePerson|erl:referenzierteSubjekte/erl:juristischePerson)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-JP-360"/>
      </sch:rule>
      <sch:rule context="xga:rg.gewerbemeldung.0240//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:juristischePerson|erl:referenzierteSubjekte/erl:juristischePerson)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-JP-360"/>
      </sch:rule>
      <sch:rule context="xga:fa.gewerbemeldung.0250//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:juristischePerson|erl:referenzierteSubjekte/erl:juristischePerson)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-JP-360"/>
      </sch:rule>
      <sch:rule context="xga:zv.gewerbemeldung.0260//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:juristischePerson|erl:referenzierteSubjekte/erl:juristischePerson)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-JP-360"/>
      </sch:rule>
      <sch:rule context="xga:is.gewerbemeldung.0270//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:juristischePerson|erl:referenzierteSubjekte/erl:juristischePerson)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-JP-360"/>
      </sch:rule>
      <sch:rule context="xga:as.gewerbemeldung.0280//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:juristischePerson|erl:referenzierteSubjekte/erl:juristischePerson)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-JP-360"/>
      </sch:rule>
      <sch:rule context="xga:lue.gewerbemeldung.0290//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:juristischePerson|erl:referenzierteSubjekte/erl:juristischePerson)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-JP-360"/>
      </sch:rule>
      <sch:rule context="xga:alg.gewerbemeldung.0300//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:juristischePerson|erl:referenzierteSubjekte/erl:juristischePerson)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-JP-360"/>
      </sch:rule>
      <sch:rule context="xga:ext.gewerbemeldung.0400//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:juristischePerson|erl:referenzierteSubjekte/erl:juristischePerson)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-JP-360"/>
      </sch:rule>
      <sch:rule context="xga:abh.gewerbemeldung.0500//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:juristischePerson|erl:referenzierteSubjekte/erl:juristischePerson)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-JP-360"/>
      </sch:rule>
      <sch:rule context="erl:gewo.erlaubnisantrag34c.1010//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:juristischePerson|erl:referenzierteSubjekte/erl:juristischePerson)">
         <sch:extends rule="rule.SCH-RF-JP-360"/>
      </sch:rule>
      <sch:rule context="erl:gewo.erlaubnisantrag34d.1020//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:juristischePerson|erl:referenzierteSubjekte/erl:juristischePerson)">
         <sch:extends rule="rule.SCH-RF-JP-360"/>
      </sch:rule>
   </sch:pattern>
   <sch:pattern>
      <sch:rule id="rule.SCH-RF-JP-400" abstract="true">
         <sch:assert id="SCH-RF-JP-400"
                     test="if (rf:rechtsform/rf:rechtsformcode/code = '400') then bk:eintragung/eintr:artEintragung/code = ('G') else true()">[SCH-RF-JP-400] Für die Rechtsform 'eingetragene Genossenschaft (eG)' - Code 400 - sind die folgenden Eintragungsarten zulässig: G</sch:assert>
      </sch:rule>
      <sch:rule context="xga:sta.gewerbemeldung.0100//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:juristischePerson|erl:referenzierteSubjekte/erl:juristischePerson)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-JP-400"/>
      </sch:rule>
      <sch:rule context="xga:ihk.gewerbemeldung.0200//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:juristischePerson|erl:referenzierteSubjekte/erl:juristischePerson)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-JP-400"/>
      </sch:rule>
      <sch:rule context="xga:hwk.gewerbemeldung.0210//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:juristischePerson|erl:referenzierteSubjekte/erl:juristischePerson)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-JP-400"/>
      </sch:rule>
      <sch:rule context="xga:dgu.gewerbemeldung.0230//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:juristischePerson|erl:referenzierteSubjekte/erl:juristischePerson)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-JP-400"/>
      </sch:rule>
      <sch:rule context="xga:rg.gewerbemeldung.0240//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:juristischePerson|erl:referenzierteSubjekte/erl:juristischePerson)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-JP-400"/>
      </sch:rule>
      <sch:rule context="xga:fa.gewerbemeldung.0250//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:juristischePerson|erl:referenzierteSubjekte/erl:juristischePerson)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-JP-400"/>
      </sch:rule>
      <sch:rule context="xga:zv.gewerbemeldung.0260//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:juristischePerson|erl:referenzierteSubjekte/erl:juristischePerson)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-JP-400"/>
      </sch:rule>
      <sch:rule context="xga:is.gewerbemeldung.0270//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:juristischePerson|erl:referenzierteSubjekte/erl:juristischePerson)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-JP-400"/>
      </sch:rule>
      <sch:rule context="xga:as.gewerbemeldung.0280//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:juristischePerson|erl:referenzierteSubjekte/erl:juristischePerson)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-JP-400"/>
      </sch:rule>
      <sch:rule context="xga:lue.gewerbemeldung.0290//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:juristischePerson|erl:referenzierteSubjekte/erl:juristischePerson)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-JP-400"/>
      </sch:rule>
      <sch:rule context="xga:alg.gewerbemeldung.0300//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:juristischePerson|erl:referenzierteSubjekte/erl:juristischePerson)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-JP-400"/>
      </sch:rule>
      <sch:rule context="xga:ext.gewerbemeldung.0400//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:juristischePerson|erl:referenzierteSubjekte/erl:juristischePerson)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-JP-400"/>
      </sch:rule>
      <sch:rule context="xga:abh.gewerbemeldung.0500//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:juristischePerson|erl:referenzierteSubjekte/erl:juristischePerson)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-JP-400"/>
      </sch:rule>
      <sch:rule context="erl:gewo.erlaubnisantrag34c.1010//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:juristischePerson|erl:referenzierteSubjekte/erl:juristischePerson)">
         <sch:extends rule="rule.SCH-RF-JP-400"/>
      </sch:rule>
      <sch:rule context="erl:gewo.erlaubnisantrag34d.1020//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:juristischePerson|erl:referenzierteSubjekte/erl:juristischePerson)">
         <sch:extends rule="rule.SCH-RF-JP-400"/>
      </sch:rule>
   </sch:pattern>
   <sch:pattern>
      <sch:rule id="rule.SCH-RF-JP-450" abstract="true">
         <sch:assert id="SCH-RF-JP-450"
                     test="if (rf:rechtsform/rf:rechtsformcode/code = '450') then bk:eintragung/eintr:artEintragung/code = ('G', 'X') else true()">[SCH-RF-JP-450] Für die Rechtsform 'Europäische Genossenschaft (SCE)' - Code 450 - sind die folgenden Eintragungsarten zulässig: G oder X</sch:assert>
      </sch:rule>
      <sch:rule context="xga:sta.gewerbemeldung.0100//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:juristischePerson|erl:referenzierteSubjekte/erl:juristischePerson)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-JP-450"/>
      </sch:rule>
      <sch:rule context="xga:ihk.gewerbemeldung.0200//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:juristischePerson|erl:referenzierteSubjekte/erl:juristischePerson)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-JP-450"/>
      </sch:rule>
      <sch:rule context="xga:hwk.gewerbemeldung.0210//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:juristischePerson|erl:referenzierteSubjekte/erl:juristischePerson)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-JP-450"/>
      </sch:rule>
      <sch:rule context="xga:dgu.gewerbemeldung.0230//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:juristischePerson|erl:referenzierteSubjekte/erl:juristischePerson)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-JP-450"/>
      </sch:rule>
      <sch:rule context="xga:rg.gewerbemeldung.0240//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:juristischePerson|erl:referenzierteSubjekte/erl:juristischePerson)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-JP-450"/>
      </sch:rule>
      <sch:rule context="xga:fa.gewerbemeldung.0250//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:juristischePerson|erl:referenzierteSubjekte/erl:juristischePerson)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-JP-450"/>
      </sch:rule>
      <sch:rule context="xga:zv.gewerbemeldung.0260//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:juristischePerson|erl:referenzierteSubjekte/erl:juristischePerson)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-JP-450"/>
      </sch:rule>
      <sch:rule context="xga:is.gewerbemeldung.0270//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:juristischePerson|erl:referenzierteSubjekte/erl:juristischePerson)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-JP-450"/>
      </sch:rule>
      <sch:rule context="xga:as.gewerbemeldung.0280//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:juristischePerson|erl:referenzierteSubjekte/erl:juristischePerson)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-JP-450"/>
      </sch:rule>
      <sch:rule context="xga:lue.gewerbemeldung.0290//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:juristischePerson|erl:referenzierteSubjekte/erl:juristischePerson)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-JP-450"/>
      </sch:rule>
      <sch:rule context="xga:alg.gewerbemeldung.0300//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:juristischePerson|erl:referenzierteSubjekte/erl:juristischePerson)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-JP-450"/>
      </sch:rule>
      <sch:rule context="xga:ext.gewerbemeldung.0400//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:juristischePerson|erl:referenzierteSubjekte/erl:juristischePerson)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-JP-450"/>
      </sch:rule>
      <sch:rule context="xga:abh.gewerbemeldung.0500//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:juristischePerson|erl:referenzierteSubjekte/erl:juristischePerson)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-JP-450"/>
      </sch:rule>
      <sch:rule context="erl:gewo.erlaubnisantrag34c.1010//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:juristischePerson|erl:referenzierteSubjekte/erl:juristischePerson)">
         <sch:extends rule="rule.SCH-RF-JP-450"/>
      </sch:rule>
      <sch:rule context="erl:gewo.erlaubnisantrag34d.1020//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:juristischePerson|erl:referenzierteSubjekte/erl:juristischePerson)">
         <sch:extends rule="rule.SCH-RF-JP-450"/>
      </sch:rule>
   </sch:pattern>
   <sch:pattern>
      <sch:rule id="rule.SCH-RF-JP-510" abstract="true">
         <sch:assert id="SCH-RF-JP-510"
                     test="if (rf:rechtsform/rf:rechtsformcode/code = '510') then bk:eintragung/eintr:artEintragung/code = ('B') else true()">[SCH-RF-JP-510] Für die Rechtsform 'Versicherungsverein auf Gegenseitigkeit (VVaG)' - Code 510 - sind die folgenden Eintragungsarten zulässig: B</sch:assert>
      </sch:rule>
      <sch:rule context="xga:sta.gewerbemeldung.0100//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:juristischePerson|erl:referenzierteSubjekte/erl:juristischePerson)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-JP-510"/>
      </sch:rule>
      <sch:rule context="xga:ihk.gewerbemeldung.0200//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:juristischePerson|erl:referenzierteSubjekte/erl:juristischePerson)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-JP-510"/>
      </sch:rule>
      <sch:rule context="xga:hwk.gewerbemeldung.0210//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:juristischePerson|erl:referenzierteSubjekte/erl:juristischePerson)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-JP-510"/>
      </sch:rule>
      <sch:rule context="xga:dgu.gewerbemeldung.0230//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:juristischePerson|erl:referenzierteSubjekte/erl:juristischePerson)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-JP-510"/>
      </sch:rule>
      <sch:rule context="xga:rg.gewerbemeldung.0240//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:juristischePerson|erl:referenzierteSubjekte/erl:juristischePerson)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-JP-510"/>
      </sch:rule>
      <sch:rule context="xga:fa.gewerbemeldung.0250//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:juristischePerson|erl:referenzierteSubjekte/erl:juristischePerson)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-JP-510"/>
      </sch:rule>
      <sch:rule context="xga:zv.gewerbemeldung.0260//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:juristischePerson|erl:referenzierteSubjekte/erl:juristischePerson)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-JP-510"/>
      </sch:rule>
      <sch:rule context="xga:is.gewerbemeldung.0270//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:juristischePerson|erl:referenzierteSubjekte/erl:juristischePerson)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-JP-510"/>
      </sch:rule>
      <sch:rule context="xga:as.gewerbemeldung.0280//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:juristischePerson|erl:referenzierteSubjekte/erl:juristischePerson)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-JP-510"/>
      </sch:rule>
      <sch:rule context="xga:lue.gewerbemeldung.0290//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:juristischePerson|erl:referenzierteSubjekte/erl:juristischePerson)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-JP-510"/>
      </sch:rule>
      <sch:rule context="xga:alg.gewerbemeldung.0300//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:juristischePerson|erl:referenzierteSubjekte/erl:juristischePerson)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-JP-510"/>
      </sch:rule>
      <sch:rule context="xga:ext.gewerbemeldung.0400//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:juristischePerson|erl:referenzierteSubjekte/erl:juristischePerson)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-JP-510"/>
      </sch:rule>
      <sch:rule context="xga:abh.gewerbemeldung.0500//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:juristischePerson|erl:referenzierteSubjekte/erl:juristischePerson)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-JP-510"/>
      </sch:rule>
      <sch:rule context="erl:gewo.erlaubnisantrag34c.1010//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:juristischePerson|erl:referenzierteSubjekte/erl:juristischePerson)">
         <sch:extends rule="rule.SCH-RF-JP-510"/>
      </sch:rule>
      <sch:rule context="erl:gewo.erlaubnisantrag34d.1020//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:juristischePerson|erl:referenzierteSubjekte/erl:juristischePerson)">
         <sch:extends rule="rule.SCH-RF-JP-510"/>
      </sch:rule>
   </sch:pattern>
   <sch:pattern>
      <sch:rule id="rule.SCH-RF-JP-590" abstract="true">
         <sch:assert id="SCH-RF-JP-590"
                     test="if (rf:rechtsform/rf:rechtsformcode/code = '590') then bk:eintragung/eintr:artEintragung/code = ('V') else true()">[SCH-RF-JP-590] Für die Rechtsform 'eingetragener Verein' - Code 590 - sind die folgenden Eintragungsarten zulässig: V</sch:assert>
      </sch:rule>
      <sch:rule context="xga:sta.gewerbemeldung.0100//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:juristischePerson|erl:referenzierteSubjekte/erl:juristischePerson)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-JP-590"/>
      </sch:rule>
      <sch:rule context="xga:ihk.gewerbemeldung.0200//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:juristischePerson|erl:referenzierteSubjekte/erl:juristischePerson)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-JP-590"/>
      </sch:rule>
      <sch:rule context="xga:hwk.gewerbemeldung.0210//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:juristischePerson|erl:referenzierteSubjekte/erl:juristischePerson)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-JP-590"/>
      </sch:rule>
      <sch:rule context="xga:dgu.gewerbemeldung.0230//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:juristischePerson|erl:referenzierteSubjekte/erl:juristischePerson)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-JP-590"/>
      </sch:rule>
      <sch:rule context="xga:rg.gewerbemeldung.0240//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:juristischePerson|erl:referenzierteSubjekte/erl:juristischePerson)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-JP-590"/>
      </sch:rule>
      <sch:rule context="xga:fa.gewerbemeldung.0250//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:juristischePerson|erl:referenzierteSubjekte/erl:juristischePerson)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-JP-590"/>
      </sch:rule>
      <sch:rule context="xga:zv.gewerbemeldung.0260//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:juristischePerson|erl:referenzierteSubjekte/erl:juristischePerson)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-JP-590"/>
      </sch:rule>
      <sch:rule context="xga:is.gewerbemeldung.0270//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:juristischePerson|erl:referenzierteSubjekte/erl:juristischePerson)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-JP-590"/>
      </sch:rule>
      <sch:rule context="xga:as.gewerbemeldung.0280//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:juristischePerson|erl:referenzierteSubjekte/erl:juristischePerson)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-JP-590"/>
      </sch:rule>
      <sch:rule context="xga:lue.gewerbemeldung.0290//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:juristischePerson|erl:referenzierteSubjekte/erl:juristischePerson)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-JP-590"/>
      </sch:rule>
      <sch:rule context="xga:alg.gewerbemeldung.0300//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:juristischePerson|erl:referenzierteSubjekte/erl:juristischePerson)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-JP-590"/>
      </sch:rule>
      <sch:rule context="xga:ext.gewerbemeldung.0400//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:juristischePerson|erl:referenzierteSubjekte/erl:juristischePerson)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-JP-590"/>
      </sch:rule>
      <sch:rule context="xga:abh.gewerbemeldung.0500//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:juristischePerson|erl:referenzierteSubjekte/erl:juristischePerson)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-JP-590"/>
      </sch:rule>
      <sch:rule context="erl:gewo.erlaubnisantrag34c.1010//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:juristischePerson|erl:referenzierteSubjekte/erl:juristischePerson)">
         <sch:extends rule="rule.SCH-RF-JP-590"/>
      </sch:rule>
      <sch:rule context="erl:gewo.erlaubnisantrag34d.1020//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:juristischePerson|erl:referenzierteSubjekte/erl:juristischePerson)">
         <sch:extends rule="rule.SCH-RF-JP-590"/>
      </sch:rule>
   </sch:pattern>
   <sch:pattern>
      <sch:rule id="rule.SCH-RF-PV-610" abstract="true">
         <sch:assert id="SCH-RF-PV-610"
                     test="if (rf:rechtsform/rf:rechtsformcode/code = '610') then  empty(bk:eintragung) else true()">[SCH-RF-PV-610] Für die Rechtsform 'Nicht rechtsfähiger Verein' - Code 610 - sind die folgenden Eintragungsarten zulässig: keine Eintragungsart</sch:assert>
      </sch:rule>
      <sch:rule context="xga:sta.gewerbemeldung.0100//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:sonstigePersonenvereinigung|erl:referenzierteSubjekte/erl:sonstigePersonenvereinigung)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-PV-610"/>
      </sch:rule>
      <sch:rule context="xga:ihk.gewerbemeldung.0200//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:sonstigePersonenvereinigung|erl:referenzierteSubjekte/erl:sonstigePersonenvereinigung)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-PV-610"/>
      </sch:rule>
      <sch:rule context="xga:hwk.gewerbemeldung.0210//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:sonstigePersonenvereinigung|erl:referenzierteSubjekte/erl:sonstigePersonenvereinigung)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-PV-610"/>
      </sch:rule>
      <sch:rule context="xga:dgu.gewerbemeldung.0230//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:sonstigePersonenvereinigung|erl:referenzierteSubjekte/erl:sonstigePersonenvereinigung)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-PV-610"/>
      </sch:rule>
      <sch:rule context="xga:rg.gewerbemeldung.0240//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:sonstigePersonenvereinigung|erl:referenzierteSubjekte/erl:sonstigePersonenvereinigung)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-PV-610"/>
      </sch:rule>
      <sch:rule context="xga:fa.gewerbemeldung.0250//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:sonstigePersonenvereinigung|erl:referenzierteSubjekte/erl:sonstigePersonenvereinigung)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-PV-610"/>
      </sch:rule>
      <sch:rule context="xga:zv.gewerbemeldung.0260//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:sonstigePersonenvereinigung|erl:referenzierteSubjekte/erl:sonstigePersonenvereinigung)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-PV-610"/>
      </sch:rule>
      <sch:rule context="xga:is.gewerbemeldung.0270//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:sonstigePersonenvereinigung|erl:referenzierteSubjekte/erl:sonstigePersonenvereinigung)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-PV-610"/>
      </sch:rule>
      <sch:rule context="xga:as.gewerbemeldung.0280//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:sonstigePersonenvereinigung|erl:referenzierteSubjekte/erl:sonstigePersonenvereinigung)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-PV-610"/>
      </sch:rule>
      <sch:rule context="xga:lue.gewerbemeldung.0290//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:sonstigePersonenvereinigung|erl:referenzierteSubjekte/erl:sonstigePersonenvereinigung)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-PV-610"/>
      </sch:rule>
      <sch:rule context="xga:alg.gewerbemeldung.0300//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:sonstigePersonenvereinigung|erl:referenzierteSubjekte/erl:sonstigePersonenvereinigung)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-PV-610"/>
      </sch:rule>
      <sch:rule context="xga:ext.gewerbemeldung.0400//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:sonstigePersonenvereinigung|erl:referenzierteSubjekte/erl:sonstigePersonenvereinigung)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-PV-610"/>
      </sch:rule>
      <sch:rule context="xga:abh.gewerbemeldung.0500//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:sonstigePersonenvereinigung|erl:referenzierteSubjekte/erl:sonstigePersonenvereinigung)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-PV-610"/>
      </sch:rule>
      <sch:rule context="erl:gewo.erlaubnisantrag34c.1010//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:sonstigePersonenvereinigung|erl:referenzierteSubjekte/erl:sonstigePersonenvereinigung)">
         <sch:extends rule="rule.SCH-RF-PV-610"/>
      </sch:rule>
      <sch:rule context="erl:gewo.erlaubnisantrag34d.1020//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:sonstigePersonenvereinigung|erl:referenzierteSubjekte/erl:sonstigePersonenvereinigung)">
         <sch:extends rule="rule.SCH-RF-PV-610"/>
      </sch:rule>
   </sch:pattern>
   <sch:pattern>
      <sch:rule id="rule.SCH-RF-JP-611" abstract="true">
         <sch:assert id="SCH-RF-JP-611"
                     test="if (rf:rechtsform/rf:rechtsformcode/code = '611') then bk:eintragung/eintr:artEintragung/code = ('A', 'S') or  empty(bk:eintragung) else true()">[SCH-RF-JP-611] Für die Rechtsform 'rechtsfähige Stiftung' - Code 611 - sind die folgenden Eintragungsarten zulässig: A, S oder keine Eintragungsart</sch:assert>
      </sch:rule>
      <sch:rule context="xga:sta.gewerbemeldung.0100//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:juristischePerson|erl:referenzierteSubjekte/erl:juristischePerson)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-JP-611"/>
      </sch:rule>
      <sch:rule context="xga:ihk.gewerbemeldung.0200//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:juristischePerson|erl:referenzierteSubjekte/erl:juristischePerson)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-JP-611"/>
      </sch:rule>
      <sch:rule context="xga:hwk.gewerbemeldung.0210//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:juristischePerson|erl:referenzierteSubjekte/erl:juristischePerson)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-JP-611"/>
      </sch:rule>
      <sch:rule context="xga:dgu.gewerbemeldung.0230//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:juristischePerson|erl:referenzierteSubjekte/erl:juristischePerson)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-JP-611"/>
      </sch:rule>
      <sch:rule context="xga:rg.gewerbemeldung.0240//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:juristischePerson|erl:referenzierteSubjekte/erl:juristischePerson)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-JP-611"/>
      </sch:rule>
      <sch:rule context="xga:fa.gewerbemeldung.0250//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:juristischePerson|erl:referenzierteSubjekte/erl:juristischePerson)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-JP-611"/>
      </sch:rule>
      <sch:rule context="xga:zv.gewerbemeldung.0260//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:juristischePerson|erl:referenzierteSubjekte/erl:juristischePerson)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-JP-611"/>
      </sch:rule>
      <sch:rule context="xga:is.gewerbemeldung.0270//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:juristischePerson|erl:referenzierteSubjekte/erl:juristischePerson)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-JP-611"/>
      </sch:rule>
      <sch:rule context="xga:as.gewerbemeldung.0280//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:juristischePerson|erl:referenzierteSubjekte/erl:juristischePerson)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-JP-611"/>
      </sch:rule>
      <sch:rule context="xga:lue.gewerbemeldung.0290//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:juristischePerson|erl:referenzierteSubjekte/erl:juristischePerson)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-JP-611"/>
      </sch:rule>
      <sch:rule context="xga:alg.gewerbemeldung.0300//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:juristischePerson|erl:referenzierteSubjekte/erl:juristischePerson)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-JP-611"/>
      </sch:rule>
      <sch:rule context="xga:ext.gewerbemeldung.0400//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:juristischePerson|erl:referenzierteSubjekte/erl:juristischePerson)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-JP-611"/>
      </sch:rule>
      <sch:rule context="xga:abh.gewerbemeldung.0500//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:juristischePerson|erl:referenzierteSubjekte/erl:juristischePerson)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-JP-611"/>
      </sch:rule>
      <sch:rule context="erl:gewo.erlaubnisantrag34c.1010//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:juristischePerson|erl:referenzierteSubjekte/erl:juristischePerson)">
         <sch:extends rule="rule.SCH-RF-JP-611"/>
      </sch:rule>
      <sch:rule context="erl:gewo.erlaubnisantrag34d.1020//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:juristischePerson|erl:referenzierteSubjekte/erl:juristischePerson)">
         <sch:extends rule="rule.SCH-RF-JP-611"/>
      </sch:rule>
   </sch:pattern>
   <sch:pattern>
      <sch:rule id="rule.SCH-RF-JP-700" abstract="true">
         <sch:assert id="SCH-RF-JP-700"
                     test="if (rf:rechtsform/rf:rechtsformcode/code = '700') then bk:eintragung/eintr:artEintragung/code = ('A', 'B', 'G', 'V') else true()">[SCH-RF-JP-700] Für die Rechtsform 'Sonstige nicht aufgeführte deutsche Rechtsform – juristische Person ' - Code 700 - sind die folgenden Eintragungsarten zulässig: A, B, G oder V</sch:assert>
      </sch:rule>
      <sch:rule context="xga:sta.gewerbemeldung.0100//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:juristischePerson|erl:referenzierteSubjekte/erl:juristischePerson)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-JP-700"/>
      </sch:rule>
      <sch:rule context="xga:ihk.gewerbemeldung.0200//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:juristischePerson|erl:referenzierteSubjekte/erl:juristischePerson)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-JP-700"/>
      </sch:rule>
      <sch:rule context="xga:hwk.gewerbemeldung.0210//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:juristischePerson|erl:referenzierteSubjekte/erl:juristischePerson)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-JP-700"/>
      </sch:rule>
      <sch:rule context="xga:dgu.gewerbemeldung.0230//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:juristischePerson|erl:referenzierteSubjekte/erl:juristischePerson)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-JP-700"/>
      </sch:rule>
      <sch:rule context="xga:rg.gewerbemeldung.0240//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:juristischePerson|erl:referenzierteSubjekte/erl:juristischePerson)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-JP-700"/>
      </sch:rule>
      <sch:rule context="xga:fa.gewerbemeldung.0250//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:juristischePerson|erl:referenzierteSubjekte/erl:juristischePerson)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-JP-700"/>
      </sch:rule>
      <sch:rule context="xga:zv.gewerbemeldung.0260//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:juristischePerson|erl:referenzierteSubjekte/erl:juristischePerson)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-JP-700"/>
      </sch:rule>
      <sch:rule context="xga:is.gewerbemeldung.0270//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:juristischePerson|erl:referenzierteSubjekte/erl:juristischePerson)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-JP-700"/>
      </sch:rule>
      <sch:rule context="xga:as.gewerbemeldung.0280//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:juristischePerson|erl:referenzierteSubjekte/erl:juristischePerson)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-JP-700"/>
      </sch:rule>
      <sch:rule context="xga:lue.gewerbemeldung.0290//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:juristischePerson|erl:referenzierteSubjekte/erl:juristischePerson)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-JP-700"/>
      </sch:rule>
      <sch:rule context="xga:alg.gewerbemeldung.0300//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:juristischePerson|erl:referenzierteSubjekte/erl:juristischePerson)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-JP-700"/>
      </sch:rule>
      <sch:rule context="xga:ext.gewerbemeldung.0400//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:juristischePerson|erl:referenzierteSubjekte/erl:juristischePerson)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-JP-700"/>
      </sch:rule>
      <sch:rule context="xga:abh.gewerbemeldung.0500//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:juristischePerson|erl:referenzierteSubjekte/erl:juristischePerson)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-JP-700"/>
      </sch:rule>
      <sch:rule context="erl:gewo.erlaubnisantrag34c.1010//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:juristischePerson|erl:referenzierteSubjekte/erl:juristischePerson)">
         <sch:extends rule="rule.SCH-RF-JP-700"/>
      </sch:rule>
      <sch:rule context="erl:gewo.erlaubnisantrag34d.1020//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:juristischePerson|erl:referenzierteSubjekte/erl:juristischePerson)">
         <sch:extends rule="rule.SCH-RF-JP-700"/>
      </sch:rule>
   </sch:pattern>
   <sch:pattern>
      <sch:rule id="rule.SCH-RF-JP-790" abstract="true">
         <sch:assert id="SCH-RF-JP-790"
                     test="if (rf:rechtsform/rf:rechtsformcode/code = '790') then bk:eintragung/eintr:artEintragung/code = ('A') or  empty(bk:eintragung) else true()">[SCH-RF-JP-790] Für die Rechtsform 'Sonstige Betriebe gewerblicher Art von Körperschaften des öffentlichen Rechts' - Code 790 - sind die folgenden Eintragungsarten zulässig: A oder keine Eintragungsart</sch:assert>
      </sch:rule>
      <sch:rule context="xga:sta.gewerbemeldung.0100//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:juristischePerson|erl:referenzierteSubjekte/erl:juristischePerson)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-JP-790"/>
      </sch:rule>
      <sch:rule context="xga:ihk.gewerbemeldung.0200//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:juristischePerson|erl:referenzierteSubjekte/erl:juristischePerson)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-JP-790"/>
      </sch:rule>
      <sch:rule context="xga:hwk.gewerbemeldung.0210//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:juristischePerson|erl:referenzierteSubjekte/erl:juristischePerson)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-JP-790"/>
      </sch:rule>
      <sch:rule context="xga:dgu.gewerbemeldung.0230//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:juristischePerson|erl:referenzierteSubjekte/erl:juristischePerson)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-JP-790"/>
      </sch:rule>
      <sch:rule context="xga:rg.gewerbemeldung.0240//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:juristischePerson|erl:referenzierteSubjekte/erl:juristischePerson)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-JP-790"/>
      </sch:rule>
      <sch:rule context="xga:fa.gewerbemeldung.0250//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:juristischePerson|erl:referenzierteSubjekte/erl:juristischePerson)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-JP-790"/>
      </sch:rule>
      <sch:rule context="xga:zv.gewerbemeldung.0260//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:juristischePerson|erl:referenzierteSubjekte/erl:juristischePerson)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-JP-790"/>
      </sch:rule>
      <sch:rule context="xga:is.gewerbemeldung.0270//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:juristischePerson|erl:referenzierteSubjekte/erl:juristischePerson)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-JP-790"/>
      </sch:rule>
      <sch:rule context="xga:as.gewerbemeldung.0280//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:juristischePerson|erl:referenzierteSubjekte/erl:juristischePerson)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-JP-790"/>
      </sch:rule>
      <sch:rule context="xga:lue.gewerbemeldung.0290//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:juristischePerson|erl:referenzierteSubjekte/erl:juristischePerson)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-JP-790"/>
      </sch:rule>
      <sch:rule context="xga:alg.gewerbemeldung.0300//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:juristischePerson|erl:referenzierteSubjekte/erl:juristischePerson)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-JP-790"/>
      </sch:rule>
      <sch:rule context="xga:ext.gewerbemeldung.0400//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:juristischePerson|erl:referenzierteSubjekte/erl:juristischePerson)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-JP-790"/>
      </sch:rule>
      <sch:rule context="xga:abh.gewerbemeldung.0500//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:juristischePerson|erl:referenzierteSubjekte/erl:juristischePerson)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-JP-790"/>
      </sch:rule>
      <sch:rule context="erl:gewo.erlaubnisantrag34c.1010//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:juristischePerson|erl:referenzierteSubjekte/erl:juristischePerson)">
         <sch:extends rule="rule.SCH-RF-JP-790"/>
      </sch:rule>
      <sch:rule context="erl:gewo.erlaubnisantrag34d.1020//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:juristischePerson|erl:referenzierteSubjekte/erl:juristischePerson)">
         <sch:extends rule="rule.SCH-RF-JP-790"/>
      </sch:rule>
   </sch:pattern>
   <sch:pattern>
      <sch:rule id="rule.SCH-RF-JP-912" abstract="true">
         <sch:assert id="SCH-RF-JP-912"
                     test="if (rf:rechtsform/rf:rechtsformcode/code = '912') then bk:eintragung/eintr:artEintragung/code = ('B', 'G', 'V', 'X') else true()">[SCH-RF-JP-912] Für die Rechtsform 'Sonstige ausländische Rechtsform nach EU-Recht - juristische Person' - Code 912 - sind die folgenden Eintragungsarten zulässig: B, G, V oder X</sch:assert>
      </sch:rule>
      <sch:rule context="xga:sta.gewerbemeldung.0100//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:juristischePerson|erl:referenzierteSubjekte/erl:juristischePerson)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-JP-912"/>
      </sch:rule>
      <sch:rule context="xga:ihk.gewerbemeldung.0200//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:juristischePerson|erl:referenzierteSubjekte/erl:juristischePerson)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-JP-912"/>
      </sch:rule>
      <sch:rule context="xga:hwk.gewerbemeldung.0210//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:juristischePerson|erl:referenzierteSubjekte/erl:juristischePerson)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-JP-912"/>
      </sch:rule>
      <sch:rule context="xga:dgu.gewerbemeldung.0230//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:juristischePerson|erl:referenzierteSubjekte/erl:juristischePerson)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-JP-912"/>
      </sch:rule>
      <sch:rule context="xga:rg.gewerbemeldung.0240//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:juristischePerson|erl:referenzierteSubjekte/erl:juristischePerson)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-JP-912"/>
      </sch:rule>
      <sch:rule context="xga:fa.gewerbemeldung.0250//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:juristischePerson|erl:referenzierteSubjekte/erl:juristischePerson)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-JP-912"/>
      </sch:rule>
      <sch:rule context="xga:zv.gewerbemeldung.0260//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:juristischePerson|erl:referenzierteSubjekte/erl:juristischePerson)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-JP-912"/>
      </sch:rule>
      <sch:rule context="xga:is.gewerbemeldung.0270//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:juristischePerson|erl:referenzierteSubjekte/erl:juristischePerson)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-JP-912"/>
      </sch:rule>
      <sch:rule context="xga:as.gewerbemeldung.0280//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:juristischePerson|erl:referenzierteSubjekte/erl:juristischePerson)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-JP-912"/>
      </sch:rule>
      <sch:rule context="xga:lue.gewerbemeldung.0290//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:juristischePerson|erl:referenzierteSubjekte/erl:juristischePerson)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-JP-912"/>
      </sch:rule>
      <sch:rule context="xga:alg.gewerbemeldung.0300//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:juristischePerson|erl:referenzierteSubjekte/erl:juristischePerson)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-JP-912"/>
      </sch:rule>
      <sch:rule context="xga:ext.gewerbemeldung.0400//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:juristischePerson|erl:referenzierteSubjekte/erl:juristischePerson)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-JP-912"/>
      </sch:rule>
      <sch:rule context="xga:abh.gewerbemeldung.0500//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:juristischePerson|erl:referenzierteSubjekte/erl:juristischePerson)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-JP-912"/>
      </sch:rule>
      <sch:rule context="erl:gewo.erlaubnisantrag34c.1010//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:juristischePerson|erl:referenzierteSubjekte/erl:juristischePerson)">
         <sch:extends rule="rule.SCH-RF-JP-912"/>
      </sch:rule>
      <sch:rule context="erl:gewo.erlaubnisantrag34d.1020//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:juristischePerson|erl:referenzierteSubjekte/erl:juristischePerson)">
         <sch:extends rule="rule.SCH-RF-JP-912"/>
      </sch:rule>
   </sch:pattern>
   <sch:pattern>
      <sch:rule id="rule.SCH-RF-JP-992" abstract="true">
         <sch:assert id="SCH-RF-JP-992"
                     test="if (rf:rechtsform/rf:rechtsformcode/code = '992') then bk:eintragung/eintr:artEintragung/code = ('B', 'G', 'V', 'X') or  empty(bk:eintragung) else true()">[SCH-RF-JP-992] Für die Rechtsform 'Sonstige ausländische Rechtsform - juristische Person (nicht nach EU-Recht)' - Code 992 - sind die folgenden Eintragungsarten zulässig: B, G, V, X oder keine Eintragungsart</sch:assert>
      </sch:rule>
      <sch:rule context="xga:sta.gewerbemeldung.0100//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:juristischePerson|erl:referenzierteSubjekte/erl:juristischePerson)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-JP-992"/>
      </sch:rule>
      <sch:rule context="xga:ihk.gewerbemeldung.0200//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:juristischePerson|erl:referenzierteSubjekte/erl:juristischePerson)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-JP-992"/>
      </sch:rule>
      <sch:rule context="xga:hwk.gewerbemeldung.0210//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:juristischePerson|erl:referenzierteSubjekte/erl:juristischePerson)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-JP-992"/>
      </sch:rule>
      <sch:rule context="xga:dgu.gewerbemeldung.0230//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:juristischePerson|erl:referenzierteSubjekte/erl:juristischePerson)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-JP-992"/>
      </sch:rule>
      <sch:rule context="xga:rg.gewerbemeldung.0240//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:juristischePerson|erl:referenzierteSubjekte/erl:juristischePerson)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-JP-992"/>
      </sch:rule>
      <sch:rule context="xga:fa.gewerbemeldung.0250//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:juristischePerson|erl:referenzierteSubjekte/erl:juristischePerson)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-JP-992"/>
      </sch:rule>
      <sch:rule context="xga:zv.gewerbemeldung.0260//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:juristischePerson|erl:referenzierteSubjekte/erl:juristischePerson)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-JP-992"/>
      </sch:rule>
      <sch:rule context="xga:is.gewerbemeldung.0270//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:juristischePerson|erl:referenzierteSubjekte/erl:juristischePerson)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-JP-992"/>
      </sch:rule>
      <sch:rule context="xga:as.gewerbemeldung.0280//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:juristischePerson|erl:referenzierteSubjekte/erl:juristischePerson)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-JP-992"/>
      </sch:rule>
      <sch:rule context="xga:lue.gewerbemeldung.0290//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:juristischePerson|erl:referenzierteSubjekte/erl:juristischePerson)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-JP-992"/>
      </sch:rule>
      <sch:rule context="xga:alg.gewerbemeldung.0300//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:juristischePerson|erl:referenzierteSubjekte/erl:juristischePerson)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-JP-992"/>
      </sch:rule>
      <sch:rule context="xga:ext.gewerbemeldung.0400//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:juristischePerson|erl:referenzierteSubjekte/erl:juristischePerson)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-JP-992"/>
      </sch:rule>
      <sch:rule context="xga:abh.gewerbemeldung.0500//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:juristischePerson|erl:referenzierteSubjekte/erl:juristischePerson)[not(ancestor-or-self::xga:referenzierteSubjekteVorAenderung or ancestor-or-self::xga:gewerbebetriebVorAenderung)]">
         <sch:extends rule="rule.SCH-RF-JP-992"/>
      </sch:rule>
      <sch:rule context="erl:gewo.erlaubnisantrag34c.1010//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:juristischePerson|erl:referenzierteSubjekte/erl:juristischePerson)">
         <sch:extends rule="rule.SCH-RF-JP-992"/>
      </sch:rule>
      <sch:rule context="erl:gewo.erlaubnisantrag34d.1020//(xga:gewerbebetrieb|erl:gewerbebetrieb|xga:referenzierteSubjekte/xga:juristischePerson|erl:referenzierteSubjekte/erl:juristischePerson)">
         <sch:extends rule="rule.SCH-RF-JP-992"/>
      </sch:rule>
   </sch:pattern>
</sch:schema>
