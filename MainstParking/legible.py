import pandas

#Read in csv
parking = pandas.read_csv('sensity_events.csv')

#Drop 'session_type' column because value was always car
parking.drop('session_type', axis = 1, inplace = True)
#Drop rows with null end time/date
parking.dropna(subset = ['end_time'], inplace = True)
#Seperate times from dates
#Seperate start time/date
#start_date = parking.start_time.str[:10]
#parking.insert(2, 'start_date', value = start_date)
#parking.start_time = parking.start_time.str[11:]
#Seperate end time/date
#end_date = parking.end_time.str[:10]
#parking.insert(3, 'end_date', value = end_date)
#parking.end_time = parking.end_time.str[11:]
#remove unnecessary string information in 'asset_id' column
parking.asset_id = parking.asset_id.str[11:]
parking.geometry = parking.geometry.str[34:-3]
parking.geometry = parking.geometry.str.replace('[', '')
parking.geometry = parking.geometry.str.replace(']', '')
#parking.start_time = parking.start_time.str.replace(' ', 'T')
#parking.end_time = parking.end_time.str.replace(' ', 'T')


#Output csv
parking.to_csv('cleanedParking.csv', sep=',', encoding='utf-8', index = False)