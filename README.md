# PredictiveParking

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

WILL NOT LOAD WITHOUT BEING RAN ON A SERVER

---------------------------------------------------------------------------------------------------

## **What are the files in '/MainstParking'?**

Go to 'comparisons' folder in the google drive for a visual representation
https://drive.google.com/open?id=1l5e0cedqhZ6vFgRs59fUuYP5gJd62d8m


Flow:

		sensity_events.csv  --------->	legibleParking.csv  --------->	cleanedParking.csv

							legible.py 						clean.py

	                       						 |               ^

	                       			collisions.py|				 |

	                       						 V 				 |

	                       					overlapmatrix.txt ----



legible.py: Cleans the data's format (string manipulation)
collisions.py: produces a matrix of collision events > 20%
clean.py: uses the overlaps to produce a new version of the data with 10% removal bias.
