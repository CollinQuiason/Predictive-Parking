import pandas
from datetime import datetime, timedelta
from shapely.geometry import Polygon

data = [] #[sensor][event#][data {UUID, start_time, end_time, Polygon_object}]
#timeSelection = datetime.strptime('2018-08-23 23:54:29', '%Y-%m-%d %H:%M:%S')  ##Calculate intersections at second (All events from timeSelection to timselection + 1 second)
#timeSelection = datetime.strptime('2018-11-9 4:54:29', '%Y-%m-%d %H:%M:%S')  ##Fri Nov 09 2018 04:54:29 GMT-0600 (Central Standard Time)
#maxParkingTime = timedelta(hours = 10)
#minParkingStart = timeSelection - maxParkingTime
#maxParkingEnd = timeSelection + maxParkingTime

print("Reading in values from \'cleanedParking.csv\'...")
parking = pandas.read_csv('cleanedParking.csv')
print(list(parking))
overlapMatrix = []

def isSortedAscending(arr):
	cur = arr[0]
	for i in range(1, len(arr)):
		if arr[i] < cur:
			print("First non-sorted index (ascending): " + str(i))
			return False
			cur = arr[i]
	return True

#Quicksort was adapted from http://interactivepython.org/courselib/static/pythonds/SortSearch/TheQuickSort.html
def quickSort(alist): #IMPORTANT: EXPECTS 2 DIMENSIONAL EVENTS ARRAY (array corresponding to 1 sensor), NOT THE ENTIRE ARRAY OF SENSORS
   quickSortHelper(alist,0,len(alist)-1)

def quickSortHelper(alist,first,last):
   if first<last:
       splitpoint = partition(alist,first,last)
       quickSortHelper(alist,first,splitpoint-1)
       quickSortHelper(alist,splitpoint+1,last)


def partition(alist,first,last):
   pivotvalue = alist[first][1]
   leftmark = first+1
   rightmark = last
   done = False

   while not done:
       while leftmark <= rightmark and alist[leftmark][1] <= pivotvalue:
           leftmark = leftmark + 1
       while alist[rightmark][1] >= pivotvalue and rightmark >= leftmark:
           rightmark = rightmark -1
       if rightmark < leftmark:
           done = True
       else:
           temp = alist[leftmark]
           alist[leftmark] = alist[rightmark]
           alist[rightmark] = temp

   temp = alist[first]
   alist[first] = alist[rightmark]
   alist[rightmark] = temp
   return rightmark

def intersectionPercentage(shape1, shape2):
	intersection = shape1.intersection(shape2)
	return intersection.area/shape1.area

#TODO:
def findEvent(arr, time):
	idx = -1
	return idx

for i in range(0, 24): #Fixing size of first dimension (Sensor ID)
	data.append([])


print("Organizing data...")
for i, row in parking.iterrows(): #For each row in the CSV file
									#Grab the start_time, end_time, and geometry
	inputStart = row['start_time'].split('.')
	inputEnd = row['end_time'].split('.')
	start_time = datetime.strptime(inputStart[0], '%Y-%m-%d %H:%M:%S')
	end_time = datetime.strptime(inputEnd[0], '%Y-%m-%d %H:%M:%S')
	geometrystring = row['geometry']
	geometry = geometrystring.split(",")
	coordinates = [(float(geometry[0]),float(geometry[1])),	#Parameters for Polygon()
	(float(geometry[2]),float(geometry[3])),				#
	(float(geometry[4]),float(geometry[5])),				#
	(float(geometry[6]),float(geometry[7])),				#
	(float(geometry[8]),float(geometry[9])),]				#

	data[int(row['asset_id'])].append([row['uuid'], start_time, end_time, Polygon(coordinates)]) #Input to the array. Refer to line 5 for format

print("Sorting data based on \'start_time\' on a per-sensor-basis")
for i in range(0, len(data)):
	quickSort(data[i])

dates = []
for event in data[1]:
	dates.append(event[1])


overlapMatrix.append([])

total1 = 0

print("Calculating intersections...")



timeSelection = datetime.strptime('2018-08-10 23:33:26', '%Y-%m-%d %H:%M:%S')
maxDataTime = datetime.strptime('2018-11-26 15:52:31', '%Y-%m-%d %H:%M:%S')
timedelt = int((maxDataTime - timeSelection).total_seconds())
processinterval = 60 #seconds between overlap processing

with open("overlapmatrix.txt", "w+") as output:
	for tdelta in range(0, int(timedelt/processinterval)):
		timeSelection = timeSelection + timedelta(seconds = processinterval)
		output.write("*" + str(timeSelection) + "\n")
		if (tdelta % 10 == 0):
			print(timeSelection)
		for idx, sensor in enumerate(data): #For every sensor
			for i in range(0, len(sensor)): 
				if (sensor[i][1] > timeSelection):
					break
				if (sensor[i][2] > timeSelection):
					for j in range(i+1, len(sensor)): 
						if (sensor[j][1] > timeSelection):
							break
						if (sensor[j][2] > timeSelection):
							if (intersectionPercentage(sensor[i][3], sensor[j][3]) > .20):
								total1 += 1
								output.write("	"+sensor[i][0] + "," + sensor[j][0] + "\n")


