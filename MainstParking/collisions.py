import pandas
from datetime import datetime, timedelta
from shapely.geometry import Polygon

timeSelection =datetime.strptime('2018-08-23 23:54:29', '%Y-%m-%d %H:%M:%S')



parking = pandas.read_csv('cleanedParking.csv')

def intersectionPercentage(shape1, shape2):
	intersection = shape1.intersection(shape2)
	return intersection.area/shape1.area



shapes = []
start_times = []
end_times = []

for i, row in parking.iterrows():
	inputStart = row['start_time'].split('.')
	inputEnd = row['end_time'].split('.')
	start_time = datetime.strptime(inputStart[0], '%Y-%m-%d %H:%M:%S')
	end_time = datetime.strptime(inputEnd[0], '%Y-%m-%d %H:%M:%S')
	start_times.append(start_time)
	end_times.append(end_time)

	#if (start_time > timeSelection and end_time > timeSelection):
																			

	geometrystring = row['geometry']
	geometry = geometrystring.split(",")

	coordinates = [(float(geometry[0]),float(geometry[1])),
	(float(geometry[2]),float(geometry[3])),
	(float(geometry[4]),float(geometry[5])),
	(float(geometry[6]),float(geometry[7])),
	(float(geometry[8]),float(geometry[9])),]

	shapes.append(Polygon(coordinates))
	
#intersection = shapes[1000].intersection(shapes[1001])
#print(intersection.area)
#print(intersectionPercentage(shapes[0], shapes[1]))
print(len(shapes),len(start_times),len(end_times))


for i in range(0, len(shapes)):
	for j in range (i, len(shapes)):
		print(i, j)
		if (start_times[i] < timeSelection and end_times[i] > timeSelection):
			if (start_times[j] < timeSelection and end_times[j] > timeSelection):
				print (intersectionPercentage(shapes[i], shapes[j]))


#for i, shape in shapes:

  