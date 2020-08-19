import pandas

nframes = 12 #Corresponds to bins per hour IE: 5 minutes = 12

sensorcsv = pandas.read_csv('TimeSeries_Sensor14.csv')







averages = []
count = 0
total = 0
for i in sensorcsv.no_of_cars:
	count += 1
	total += i
	if (count % nframes == 0):
		averages.append(total/nframes)
		total = 0

	count %= nframes


hours = []
count = 0
for i in sensorcsv.start_time:
	count += 1
	if (count % nframes == 0):
		hours.append(i)
	count %= nframes

outputdata = pandas.DataFrame({"Hourly_Averages": averages, "Hours: ": hours})

outputdata.to_csv('Hourly_Averages.csv', sep=',')

