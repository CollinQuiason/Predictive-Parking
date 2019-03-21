import pandas
import random

def reformatGeometry(x):
	return '{"type":"Polygon","coordinates":[[' + '[' +  str(x).split(',')[0]+ ',' + str(x).split(',')[1] + '],[' +  str(x).split(',')[2] + ',' + str(x).split(',')[3] + '],[' +  str(x).split(',')[4]+ ',' + str(x).split(',')[5] + '],[' +  str(x).split(',')[6] + ',' + str(x).split(',')[7] + '],[' +  str(x).split(',')[8] + ',' + str(x).split(',')[9] + ']'+ ']]}'

percent_of_collision_events_removed = 100

overlaps = set()

#import legible parking data
print('reading from input...')
parking = pandas.read_csv('legibleParking.csv')
badindices = []

with open('overlapmatrix.txt') as input:
	for line in input:
		if (line[0] == "\t"):
			overlaps.add(line[1:].split(',')[0])
print('Parking events: ' + str(len(parking.index)))
print('Overlaps: ' + str(len(overlaps)))


for i in range(0, len(parking.index)):
	if (random.randint(1, 101) <= percent_of_collision_events_removed):
			if (parking['uuid'][i] in overlaps):
				badindices.append(i)

parking.drop(badindices, inplace = True)
print('Cleaned parking events: ' + str(len(parking.index)))
		

parking.to_csv('cleanedParking.csv', sep=',', encoding='utf-8', index = False)

print(parking.columns)


#Create csv that is readable by the AI (the same format as sensity_events.csv)

parking.insert(4, 'session_type', 'car')
parking.asset_id = "SENSITY-kc-" + parking.asset_id.astype(str)
parking.geometry = parking.geometry.apply(reformatGeometry)





parking.to_csv('formatted_cleanParking.csv', sep=',', encoding='utf-8', index = False)