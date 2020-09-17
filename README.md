# Parking Data
Analysis, cleaning, and visualization of data used for research leveraging AI/ML to predict parking availability 

Parking Availability Forecasting Model - https://ieeexplore.ieee.org/document/9071688

---------------------------------------------------------------------------------------------------

##  **GETTING IT RUNNING:**

-You must install node.js 'http-server' module and add it to your path.

	+npm install http-server

-Run localserver.bat and open 'localhost:8080' in browser

-Otherwise, find another way to host a local server

---------------------------------------------------------------------------------------------------

##  **GUI:**

Buttons are self-explanatory

Push 'Enter' after altering text box for time selection to update visualization

Slider located on top left for changing transparency (Updated visualization on mouse-click-up)

---------------------------------------------------------------------------------------------------

##  **NOTES/WARNINGS:**

WILL NOT LOAD WITHOUT BEING RUN ON A SERVER

---------------------------------------------------------------------------------------------------

## **What are the files in '/KansasCityData/'?**

Go to 'comparisons' folder in the [Google Drive](https://drive.google.com/open?id=1l5e0cedqhZ6vFgRs59fUuYP5gJd62d8m) for a visual representation



Flow:

        sensity_events.csv  --------->  legibleParking.csv  --------->  cleanedParking.csv & formatted_cleanedParking.csv --------------------> sensorInformation.csv

                            legible.py           |          clean.py                                                       findSensorBounds.py

                                                 |               ^

                                    collisions.py|               |

                                                 V               |

                                            overlapmatrix.txt ----



legible.py: Cleans the data's format (just string manipulation)

collisions.py: produces a matrix of collision events > 20% overlap

clean.py: uses the overlaps to produce a new version of the data with X% removal bias (currently 0, or 100% removal of overlaps > 20%).
		Also creates a version in the same format as the original sensity_events.csv data
