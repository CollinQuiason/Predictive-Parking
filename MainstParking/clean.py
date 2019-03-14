import pandas
import random

percent_of_collision_events_removed = 90

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


#for i in range(0, len(overlaps)):
#	#if (len(parking.loc[parking['uuid'] == overlaps[i]].index) > 1):
#	print(parking.loc[parking['uuid']==overlaps[i]].index[0])

for i in range(0, len(parking.index)):
	if (random.randint(1, 101) <= percent_of_collision_events_removed):
			if (parking['uuid'][i] in overlaps):
				badindices.append(i)

parking.drop(badindices, inplace = True)
print('Cleaned parking events: ' + str(len(parking.index)))
		

parking.to_csv('cleanedParking.csv', sep=',', encoding='utf-8', index = False)