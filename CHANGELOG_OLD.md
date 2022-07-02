# Older changes
## 0.3.0 (2022-05-30)
* (xXBJXx) Admin UI rebuilt to a new React UI
* (xXBJXx) update Dependencies and add new dependencies for the new React UI
* (xXBJXx) Code cleanup
    * added a query if the adapter is running in debug mode to not write so much log.
    * the request for the MQTT stats reworked
    * new state added [mjpegStream, connected, json].
    * new command added [settings], with which you can call the settings page on the wallpanel.
    * MQTT state creation adjusted a bit, so that the sensor folder not created when MQTT switched off
    * delete function added to delete devices that are not configured anymore
    * code adapted for the new React UI [onMessage] was enabled.
* (xXBJXx) update README and Licence date

## 0.2.0-0.0 (2022-03-28)
* (xXBJXx) Automatic translations migrated from gulp to => [iobroker/adapter-dev](https://github.com/ioBroker/adapter-dev)
* (xXBJXx) dependencies updated
* (xXBJXx) Switching Project from JavaScript to TypeScript
* (xXBJXx) fixed: [(issue #270)](https://github.com/xXBJXx/ioBroker.wallpanel/issues/270)

## 0.1.7-0 (2021-09-06)
* (xXBJXx) test-and-release.yml update
* (xXBJXx) dependencies update
* (xXBJXx) check of the created state structure added

## 0.1.6-0 (2021-02-26)
* (xXBJXx) README edited and deleted unused images
* (xXBJXx) add MQTT Instance select and remove state delete

## 0.1.5-0 (2021-01-27)
* (xXBJXx) Update dependabot.yml and test-and-release.yml
* (xXBJXx) Dependency updates
* (xXBJXx) README revised and added Documentation link and LICENSE updated
* (xXBJXx) Code Optimization
* (xXBJXx) config page style customized

## 0.1.4-beta.4 (2020-10-08)
* (xXBJXx) README change

## 0.1.4-beta.3 (2020-10-08)
* (xXBJXx) Test and Release.yml change

## 0.1.4-beta.2 (2020-10-08)
* (xXBJXx) fix display bug

## 0.1.4-beta.1 (2020-10-07)
* (xXBJXx) README edited

## 0.1.4-beta.0 (2020-10-07)
* (xXBJXx) Added MQTT states query
* (xXBJXx) GitHub Actions added

## 0.1.3-0 (2020-09-08)
* (xXBJXx) code update

## 0.1.2-0 (2020-09-05)
* (xXBJXx) Dependency update and release

## 0.1.1
* (xXBJXx) added IP address datapoint
* (xXBJXx) wake state edit

## 0.1.0
* (xXBJXx) Revised code
* (xXBJXx) Documentation added
* (xXBJXx) lastInfoUpdate state added

## 0.0.2
* (xXBJXx) first Beta

## 0.0.1
* (xXBJXx) initial release
