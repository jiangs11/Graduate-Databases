library(mongolite)
library(ggplot2)

m <- mongo("email2", url = "mongodb://localhost", db = "enron")

# Bar Chart
output1 <- m$aggregate(
	'[{ "$match": { "text": { "$regex": "Arthur Andersen", "$options": "i" } } },
	  { "$project": { 
		  "year": { "$year": { "$dateFromString": { "dateString": { "$substr": ["$Date", 9, 21] } } } } 
	  } },
	  { "$group": { 
		  "_id": "$year", 
		  "count": { "$sum": 1 } } },
	  { "$sort": { "count": -1 } }
]')

# Define the columns that the aggregate will return (look at the fields in $group)
#	_id	will be equated to Year
#	count	will be equated to NumberOfEmails
names(output1) <- c("Year", "NumberOfEmails")
ggplot(aes(Year, NumberOfEmails), data = output1) + geom_col() + ggtitle("Number of Emails containing Arthur Andersen per Year")



# Scatter Plot
output2 <- m$aggregate(
	'[{ "$match": { "text": { "$regex": "Arthur Andersen", "$options": "i" } } },
          { "$project": { 
		  "year": { "$year": { "$dateFromString": { "dateString": { "$substr": ["$Date", 9, 21] } } } },
		  "sender": "$From"
	  } },
          { "$group": { 
		  "_id": "$year",
		  "count": { "$sum": 1 },
		  "sender": { "$first": "$sender" } } },
          { "$sort": { "count": -1 } }
]')

# Define the columns that the aggregate will return (look at the fields in $group)
#	_id	will be equated to Year
#	count 	will be equated to NumberOfEmails
#	sender	will be equated to Email
names(output2) <- c("Year", "NumberOfEmails", "Email")
ggplot(aes(Year, NumberOfEmails), data = output2) +  
	geom_point(aes(color = factor(Email))) + 
	geom_smooth(method = "lm") +
	ggtitle("Emails who sent the most containing Arthur Andersen per Year")
