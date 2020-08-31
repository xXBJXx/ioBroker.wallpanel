![Logo](admin/media/wallpanel.png)
# ioBroker.wallpanel

[![NPM version](http://img.shields.io/npm/v/iobroker.wallpanel.svg)](https://www.npmjs.com/package/iobroker.wallpanel)
[![Downloads](https://img.shields.io/npm/dm/iobroker.wallpanel.svg)](https://www.npmjs.com/package/iobroker.wallpanel)
![Number of Installations (latest)](http://iobroker.live/badges/wallpanel-installed.svg)
![Number of Installations (stable)](http://iobroker.live/badges/wallpanel-stable.svg)
[![Dependency Status](https://img.shields.io/david/xXBJXx/iobroker.wallpanel.svg)](https://david-dm.org/xXBJXx/iobroker.wallpanel)
[![Known Vulnerabilities](https://snyk.io/test/github/xXBJXx/ioBroker.wallpanel/badge.svg)](https://snyk.io/test/github/xXBJXx/ioBroker.wallpanel)

[![NPM](https://nodei.co/npm/iobroker.wallpanel.png?downloads=true)](https://nodei.co/npm/iobroker.wallpanel/)

**Tests:**: [![Travis-CI](http://img.shields.io/travis/xXBJXx/ioBroker.wallpanel/master.svg)](https://travis-ci.org/xXBJXx/ioBroker.wallpanel)

## **Achtung noch in der BETA** 

## **Sentry**
**Dieser Adapter verwendet Sentry-Bibliotheken, um Ausnahmen und Codefehler automatisch an die Entwickler zu melden.** <br>
Weitere Details und Informationen zum Deaktivieren der Fehlerberichterstattung finden Sie in der 
[Sentry-Plugin-Dokumentation](https://github.com/ioBroker/plugin-sentry#plugin-sentry) <br>
Sentry Reporting wird ab js-controller 3.0 verwendet.

## Adapter Beschreibung
Der Adapter liest die [Wallpenel app Android](https://play.google.com/store/apps/details?id=com.thanksmister.iot.wallpanel&hl=de) 
aus und trägt es in Datenpunkte ein. <br>
Man kann auch ein paar Funktionen steuern, wie z.B. die Helligkeit. <br>
Es können mehrere Device abgefragt bzw. gesteuert werden.


## Config
Noch Kurtz zu der Config Seite was man einstellen muss.
![wallpanel_config.png](admin/media/Wallpanel_config.png)

1. Hier wird der Abfrageintervall festgelegt **(Achtung nicht unter 10 sec einstellen)**.
2. Hier kann man dem Adapter sagen, dass er die Datenpunkte automatisch löschen kann, wen das Device aus der Liste entfernt wurde **(Standard aus)**.
3. Hier wird der Name von eurem Devise eingetragen (dieser wird dann für die Erstellung der Devise Ordner in den Datenpunkten verwendet).
4. Hier wird die Ip Adresse von eurem Device das ihr Abfragen bzw. Steuern wollt eingetragen **(wenn kein Name für das Devise eingetragen wurde, wird die Ip für die Devise Ordner verwendet)**.
5. Hier trage ihr den Port denn ihr in der Wallpanel app vergeben habt **Standard ist 2971**.
6. Hier kann man das Device von der Abfrage Deaktivieren, ohne es zu löschen.

## State Übersicht
Hier eine Übersicht über die Stats.
![wallpanel_state.png](admin/media/Wallpanel_state.png)
#### Command's:
* brightness ===> Helligkeit von 0 bis 255
* camera ===> aktiviert / deaktiviert das Kamera-Streaming und fordert die Aktivierung der Kamera.
* clearCache ===> löscht den Browser-Cache.
* eval ===> wertet JavaScript im Dashboard aus z.B. **alert('Hello World!')**.
* relaunch ===> startet das Dashboard über die konfigurierte launch URL neu.
* reload ===> lädt die aktuelle Seite sofort neu.
* speak ===> verwendet das TTS des Geräts, um die Nachricht zu sprechen.
* url ===> Navigieren Sie sofort zu einer neuen URL.
* urlAudio ===> Spielen Sie das durch die URL angegebene Audio sofort ab.
* volume ===> ändert die Lautstärke, Wert 0–100 (in%. Wirkt sich nicht auf die TTS-Lautstärke aus).
* wake ===> weckt den Bildschirm, wenn er ausgeschaltet ist.

#### Abfrage der states
* brightness ===> aktueller Helligkeitswert des Bildschirms.
* currentUrl ===> Aktuelle URL, die angezeigt wird.
* isWallpanelAlive ===> kommt vom Adapter und zeigt an, ob das Devise erreichbar ist.
* lastInfoUpdate ===> kommt vom Adapter und zeigt an, wann die letzte Aktualisierung der states war.
* screenOn ===> zeigt an ob der Bildschirm grade an ist


## Changelog

### 0.1.0
* (xXBJXx) Revised code
* (xXBJXx) Documentation added
* (xXBJXx) lastInfoUpdate state added

### 0.0.2
* (xXBJXx) first Beta

### 0.0.1
* (xXBJXx) initial release

## License
MIT License

Copyright (c) 2020 xXBJXx <alienware.games@gmail.com>

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.