import pandas

nframes = 12 #Corresponds to averaging 1 hour worth of data

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



outputdata = pandas.DataFrame({"Hourly_Averages": averages}) #TODO: {Sensor-Visualizer Time Display} Add a column for the time

outputdata.to_csv('Hourly_Averages.csv', sep=',')

