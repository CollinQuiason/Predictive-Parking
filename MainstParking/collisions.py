import pandas
from datetime import datetime, timedelta
from shapely.geometry import Polygon


timeSelection = datetime.strptime('2018-08-23 23:54:29', '%Y-%m-%d %H:%M:%S')



parking = pandas.read_csv('cleanedParking.csv')
print(list(parking))

def intersectionPercentage(shape1, shape2):
	intersection = shape1.intersection(shape2)
	return intersection.area/shape1.area


data = [] #[sensor][event#][data {UUID, start_time, end_time, Polygon_object}]

for i in range(0, 24):
	data.append([])

for i, row in parking.iterrows():

	inputStart = row['start_time'].split('.')
	inputEnd = row['end_time'].split('.')
	start_time = datetime.strptime(inputStart[0], '%Y-%m-%d %H:%M:%S')
	end_time = datetime.strptime(inputEnd[0], '%Y-%m-%d %H:%M:%S')
	

	#if (start_time > timeSelection and end_time > timeSelection):
																			

	geometrystring = row['geometry']
	geometry = geometrystring.split(",")

	coordinates = [(float(geometry[0]),float(geometry[1])),
	(float(geometry[2]),float(geometry[3])),
	(float(geometry[4]),float(geometry[5])),
	(float(geometry[6]),float(geometry[7])),
	(float(geometry[8]),float(geometry[9])),]

	#data[int(row['asset_id'])].append([row['uuid'], start_time, end_time, Poly(coordinates)])
	#data.insert(int(row['asset_id']), )
	data[int(row['asset_id'])].append([row['uuid'], start_time, end_time, Polygon(coordinates)])

	#start_times.append(start_time)
	#end_times.append(end_time)
	#shapes.append(Polygon(coordinates))
	
#intersection = shapes[1000].intersection(shapes[1001])
#print(intersection.area)
#print(intersectionPercentage(shapes[0], shapes[1]))



#for i in range(0, len(shapes)):
#	for j in range (i, len(shapes)):
#		print(i, j)
#		if (start_times[i] < timeSelection and end_times[i] > timeSelection):
#			if (start_times[j] < timeSelection and end_times[j] > timeSelection):
#				print (intersectionPercentage(shapes[i], shapes[j]))


for idx, sensor in enumerate(data):
	for i in range(0, len(sensor)):
		for j in range(i+1, len(sensor)):
			print (idx, i)
			if (sensor[i][1] < timeSelection and sensor[i][2] > timeSelection):
				if (sensor[j][1] < timeSelection and sensor[j][2] > timeSelection):
					print(intersectionPercentage(sensor[i][3], sensor[j][3]))

#for i, shape in shapes:

 