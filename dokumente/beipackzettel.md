# SWK Admin Dashboard - Beipackzettel

## Einleitung

Das SWK Admin Dashboard ist ein Prototyp, der für Stadtwerke Konstanz entwickelt wurde. Die Anwendung dient als zentrale Verwaltungsoberfläche für Lead-Marketing-Prozesse, Kundenkontakte und die geografische Visualisierung von Produktverfügbarkeiten. Bei diesem Projekt handelt es sich ausdrücklich um einen Prototypen, der mit simulierten Daten arbeitet und keine Anbindung an echte Backend-Systeme besitzt.

Die Benutzeroberfläche ist vollständig auf Deutsch gehalten, da die Zielgruppe deutschsprachige Mitarbeiter der Stadtwerke Konstanz sind. Die Anwendung wurde mit React 18 und modernen Web-Technologien umgesetzt und bietet eine responsive, benutzerfreundliche Oberfläche.

---

## Anwendung starten

Um den Prototypen zu starten, muss zunächst Node.js auf dem Rechner installiert sein. Nach dem Öffnen eines Terminals im Projektverzeichnis werden mit dem Befehl `npm install` alle notwendigen Abhängigkeiten installiert. Dieser Schritt ist nur beim ersten Start erforderlich. Anschließend startet `npm run dev` den Entwicklungsserver, woraufhin die Anwendung im Browser unter der Adresse `http://localhost:5173` erreichbar ist.

Da es sich um einen Prototypen ohne Authentifizierungssystem handelt, sind keine Zugangsdaten erforderlich. Die Anwendung öffnet sich direkt im Dashboard, ohne dass ein Login notwendig wäre.

---

## Aufbau und Navigation

Die Anwendung ist in fünf Hauptbereiche gegliedert, die über eine Seitenleiste am linken Bildschirmrand erreichbar sind. Diese Seitenleiste lässt sich bei Bedarf einklappen, um mehr Platz für den Hauptinhalt zu schaffen. Der aktuelle Zustand der Seitenleiste wird im Browser gespeichert und bleibt auch nach einem Neuladen der Seite erhalten.

Der erste Bereich ist das Dashboard, das als Startseite der Anwendung fungiert und einen Überblick über wichtige Kennzahlen bietet. Darauf folgt der Bereich Marketing-Flows, in dem Lead-Marketing-Abläufe visuell erstellt und bearbeitet werden können. Der dritte Bereich widmet sich der Lead-Verwaltung, wo alle Kundenkontakte eingesehen und gefiltert werden können. Das Produkt-Mapping zeigt als vierter Bereich die Verfügbarkeit verschiedener Produkte auf einer interaktiven Karte der Region Konstanz. Schließlich gibt es noch den Einstellungsbereich für Systemkonfigurationen und Integrationen.

---

## Funktionsbeschreibung

### Dashboard

Das Dashboard bildet den Einstiegspunkt der Anwendung und präsentiert die wichtigsten Leistungskennzahlen auf einen Blick. Hier werden Metriken wie die Anzahl der Leads, Konversionsraten und andere relevante KPIs in übersichtlichen Karten dargestellt. Die Ansicht ist in mehrere Tabs unterteilt, darunter eine Startseite mit den Hauptkennzahlen, eine Kampagnenübersicht, ein News-Feed für aktuelle Aktivitäten sowie eine Traffic-Analyse.

Der Benutzer kann verschiedene Zeiträume auswählen, um die Entwicklung der Kennzahlen über unterschiedliche Perioden zu betrachten. Die Visualisierungen werden mit Hilfe der Recharts-Bibliothek dargestellt und bieten interaktive Diagramme.

### Lead-Marketing Flows

Der Flow-Editor ist das Herzstück der Anwendung und ermöglicht die visuelle Erstellung von Marketing-Automatisierungen. Auf der linken Seite befindet sich eine Liste aller vorhandenen Flows, während der Hauptbereich einen grafischen Canvas zeigt, auf dem die einzelnen Schritte eines Flows angeordnet werden können.

Die Erstellung eines Flows erfolgt durch Drag-and-Drop verschiedener Knotentypen. Es gibt Trigger-Knoten, die den Startpunkt eines Flows definieren, Aktionsknoten für konkrete Maßnahmen wie E-Mail-Versand, sowie Bedingungsknoten für Verzweigungen im Ablauf. Die einzelnen Knoten werden durch Verbindungslinien miteinander verknüpft, um den Ablauf zu visualisieren.

Der Editor unterstützt eine Undo-Redo-Funktionalität, sodass Änderungen rückgängig gemacht werden können. Zusätzlich stehen vorgefertigte Vorlagen zur Verfügung, die als Ausgangspunkt für neue Flows dienen können.

### Lead-Verwaltung

In der Lead-Verwaltung werden alle Kundenkontakte in einer übersichtlichen Liste dargestellt. Die Liste kann nach verschiedenen Kriterien gefiltert und durchsucht werden, etwa nach Status, Quelle oder Kampagnenzugehörigkeit. Jeder Lead verfügt über einen Status wie "Neu", "In Bearbeitung" oder "Qualifiziert", der den aktuellen Stand im Vertriebsprozess widerspiegelt.

Durch Anklicken eines Eintrags öffnet sich eine Detailansicht, die alle verfügbaren Informationen zum jeweiligen Lead anzeigt. Hier finden sich Kontaktdaten, die Herkunft des Leads, zugeordnete Kampagnen sowie der bisherige Verlauf der Interaktionen.

### Produkt-Mapping

Das Produkt-Mapping bietet eine geografische Darstellung der Produktverfügbarkeit in der Region Konstanz. Die interaktive Karte basiert auf der React-Leaflet-Bibliothek und ermöglicht das Navigieren durch Zoomen und Verschieben. Verschiedene Regionen sind farblich markiert, um die Verfügbarkeit bestimmter Produkte anzuzeigen.

Durch Anklicken einer Region werden Details zur Produktverfügbarkeit in diesem Gebiet eingeblendet. Die zugrunde liegenden Daten stammen aus JSON-Dateien, die verschiedene Verfügbarkeitsszenarien abbilden.

### Einstellungen

Der Einstellungsbereich bietet eine Übersicht über verfügbare Integrationen mit externen Systemen wie CRM-Plattformen oder E-Mail-Diensten. Zusätzlich werden Sync-Protokolle angezeigt, die den Status der Datenabgleiche dokumentieren.

---

## Implementierungsstand

Der Prototyp befindet sich in unterschiedlichen Entwicklungsstadien, je nach Funktionsbereich. Vollständig umgesetzt sind das Dashboard mit seinen KPI-Karten, der visuelle Flow-Editor, die Lead-Liste mit Detailansichten sowie das Produkt-Mapping mit der interaktiven Karte. Auch die gesamte UI-Komponentenbibliothek ist fertiggestellt und bietet wiederverwendbare Elemente wie Buttons, Karten, Tabellen und Formulare.

Teilweise implementiert sind die Einstellungen und Integrationen, bei denen zwar die Oberfläche vorhanden ist, jedoch keine echte Funktionalität dahinter steht. Gleiches gilt für einige Dashboard-Tabs, die Platzhalterinhalte zeigen. Die Flow-Ausführung ist ebenfalls nur visuell dargestellt, ohne dass Flows tatsächlich ausgeführt werden.

Nicht implementiert sind grundlegende Produktionsfunktionen wie die Benutzerauthentifizierung, echte Backend-APIs, Datenbankanbindungen, E-Mail-Versand, CRM-Integrationen und Exportfunktionen. Diese Funktionen würden für einen produktiven Einsatz zusätzlich entwickelt werden müssen.

---

## Testdaten

Sämtliche in der Anwendung angezeigten Daten sind simulierte Beispieldaten, die in JSON-Dateien im Verzeichnis `src/data/` hinterlegt sind. Dort finden sich Beispiel-Leads, Abschlussdaten, ein Produktkatalog sowie Verfügbarkeitsinformationen für verschiedene Regionen.

Zusätzlich nutzt die Anwendung den localStorage des Browsers für bestimmte Daten. Leads, die durch Flows generiert werden, werden dort unter dem Schlüssel `swk:flow-leads` gespeichert. Auch der Zustand der Seitenleiste wird persistent im Browser abgelegt.

---

## Technische Grundlage

Die Anwendung wurde mit React 18 und dem Build-Tool Vite entwickelt. Für das Styling kommt Tailwind CSS zum Einsatz, das ein konsistentes Design-System mit den Markenfarben der Stadtwerke Konstanz ermöglicht. Diagramme und Visualisierungen werden mit Recharts umgesetzt, während die Kartenfunktionalität auf React-Leaflet basiert. Die Icons stammen aus der Lucide-React-Bibliothek.

Die Anwendung verwendet kein TypeScript, sondern plain JavaScript mit JSX-Syntax für die React-Komponenten. Es gibt keinen Router, stattdessen wird die Navigation über einen zentralen State in der App-Komponente gesteuert.

---

## Empfehlungen für die Demonstration

Für eine Vorführung des Prototypen empfiehlt es sich, mit dem Dashboard zu beginnen, um einen ersten Eindruck der Kennzahlen zu vermitteln. Anschließend bietet der Flow-Editor die Möglichkeit, die Hauptfunktionalität der visuellen Flow-Erstellung zu demonstrieren. Die Lead-Verwaltung zeigt exemplarisch, wie Kundendaten organisiert und eingesehen werden können. Zum Abschluss verdeutlicht das Produkt-Mapping die geografische Komponente der Anwendung.

---

## Einschränkungen

Da es sich um einen Prototypen handelt, bestehen verschiedene Einschränkungen. Alle angezeigten Daten sind Beispieldaten ohne realen Bezug. Eine dauerhafte Speicherung auf einem Server findet nicht statt, lediglich der localStorage des Browsers wird genutzt. E-Mail-Funktionen, CRM-Anbindungen und andere Integrationen sind nicht funktionsfähig. Die Anwendung ist nicht für den Mehrbenutzerbetrieb ausgelegt und verfügt über keine Zugriffskontrolle.

---

*Dokumentation erstellt im Januar 2025*
