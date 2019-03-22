import pandas


parking = pandas.read_csv("cleanedParking.csv")
events = []

class coordinate:
	def __init__(self, xc, yc):
		self.x = float(xc)
		self.y = float(yc)
	def __str__(self):
		return 'X: ' + str(self.x) + '\nY: ' + str(self.y)

class parkingEvent:
	geometry = []
	def __init__(self, geo, sen):
		self.geometry = geo
		self.sensor = int(sen)
		self.centerX = -1 #Default Value - Will be oerwritten by calculateCenter()
		self.centerY = -1 #Default Value
		self.maxX = float(self.geometry[0]) #Set default values to first entry
		self.minX = float(self.geometry[0])
		self.maxY = float(self.geometry[1])
		self.minY = float(self.geometry[1])
		self.calculateMinMaxs()
		self.calculateCenter()
	def __str__(self):
		return '--------\nGeometry: \n[' + str(self.geometry[0]) + ', ' + str(self.geometry[1]) + '], \n[' + str(self.geometry[2]) + ', ' + str(self.geometry[3]) + '], \n[' + str(self.geometry[4]) + ', ' + str(self.geometry[5]) + '], \n[' + str(self.geometry[6]) + ', ' + str(self.geometry[7]) +  ']\nSensor: ' + str(self.sensor) + '\nCenter: ' + str(self.centerX) + ', ' + str(self.centerY) + '\n Min X: ' + str(self.minX)
	def calculateMinMaxs(self):
		 
		for i in range(2, len(self.geometry), 2): #Start at index 2 because values were initialized to first entires already in __init__
			if (float(self.geometry[i]) > self.maxX):
				self.maxX = float(self.geometry[i])
			if (float(self.geometry[i]) < self.minX):
				self.minX = float(self.geometry[i])
			if (float(self.geometry[i+1]) > self.maxY):
				self.maxY = float(self.geometry[i+1])
			if (float(self.geometry[i+1]) < self.minY):
				self.minY = float(self.geometry[i+1])

	def calculateCenter(self):
		totalX = 0
		totalY = 0
		for i in range(0, 7, 2):
			totalX += float(self.geometry[i])
			totalY += float(self.geometry[i+1])
		self.centerX = totalX/4
		self.centerY = totalY/4 #returns 23 element array of the x and y coordinates 

def calculateSensorCentroids(allevents): #'events' must be an eight element array.  X & Y of each corner of a polygon
	centroids = []
	sensorcount = []
	for i in range(0, 23):
		centroids.append(coordinate(0, 0))
		sensorcount.append(0)
	for i in range(0, len(centroids)):
		for event in allevents:
			if (int(event.sensor) == (i+1)):
				centroids[i].x += float(event.centerX)
				centroids[i].y += float(event.centerY)
				sensorcount[i] += 1
		if (sensorcount[i] != 0):
			centroids[i].x /= sensorcount[i]
			centroids[i].y /= sensorcount[i]

	return centroids #returns coordinate array of sensor (i-1) centroid location



def calculateSensorMaxs(allevents):
	maximums = []
	for i in range(0, 23):
		maximums.append(coordinate(0,0))
	for i in range(0, len(maximums)):
		for event in allevents:
			if (int(event.sensor) == (i+1)):
				if (event.maxX > maximums[i].x or maximums[i].x == 0):
					maximums[i].x = event.maxX
				if (event.maxY > maximums[i].y or maximums[i].y == 0):
					maximums[i].y = event.maxY
	return maximums

def calculateSensorMins(allevents):
	minimums = []
	for i in range(0, 23):
		minimums.append(coordinate(0,0))
	for i in range(0, len(minimums)):
		for event in allevents:
			if (int(event.sensor) == (i+1)):
				if (event.maxX < minimums[i].x or minimums[i].x == 0):
					minimums[i].x = event.maxX
				if (event.maxY < minimums[i].y or minimums[i].y == 0):
					minimums[i].y = event.maxY
	return minimums



for idx, row in parking.iterrows():	#Input data as parkingEvent objects
	events.append(parkingEvent(row['geometry'].split(','), row['asset_id']))



centroids_of_sensors = calculateSensorCentroids(events)
maximums_of_sensors = calculateSensorMaxs(events)
minimums_of_sensors = calculateSensorMins(events)

#for i in range(0, 23):
#	print('---------------------')
#	print('Sensor: ' + str(i+1))
#	print('Centroid: '+ '\n'+ str(centroids_of_sensors[i]))
#	print('Maximum Coordinate: ' + '\n' + str(maximums_of_sensors[i]))
#	print('Minimum Coordinate: ' + '\n' + str(minimums_of_sensors[i]))

sensorinformation = pandas.DataFrame(columns = ['sensor_id', 'centroidX', 'centroidY', 'minX', 'minY', 'maxX', 'maxY'])
for i in range(0,23):
	sensorinformation.loc[i] = [i + 1, centroids_of_sensors[i].x, centroids_of_sensors[i].y, minimums_of_sensors[i].x, minimums_of_sensors[i].y, maximums_of_sensors[i].x, maximums_of_sensors[i].y]

#Output csv
sensorinformation.to_csv('sensorInformation.csv', sep=',', encoding='utf-8', index = False)

