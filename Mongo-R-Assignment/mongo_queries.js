print("Arthur Andersen, an accounting firm, played a significant role in the Enron scandal.")
print("Theory: I will check whether the number of emails containing \"Arthur Andersen\" increased leading up to the dates nearing the scandal.")
print("One of the queries will be counting the number of emails containing Arthur Andersen are grouped by the year.")
print("The other query will be finding the top email who sent an email containing Arthur Andersen grouped by the year.")
print("The box plot will be Year vs. Number of Emails containing \"Arthur Andersen\".")
print("The scatter plot will also be Year vs. Number of Emails containing \"Arthur Andersen\" but also labeled with which email.")

// Run from enron database. Javascript alternative for "use"
db = db.getSiblingDB('enron')


// Number of emails containing Arthur Andersen grouped by the year
db.email2.aggregate([ 
	{ $match: { text: { $regex: /Arthur Andersen/i } } },
	{ $project: { year: { $year: { $dateFromString: { dateString: { $substr: ["$Date", 9, 21] } } } } } },
	{ $group: { 
		_id: "$year", 
		count: { $sum: 1 } } },
	{ $sort: { count: -1 } },
	{ $out: "jiangs1_query1" }
]);

print("\nHere are the emails containing Arthur Andersen:")
cursor = db.jiangs1_query1.find()
while (cursor.hasNext()) {
	printjson(cursor.next())
}



// The people that sent the most emails containing Arthur Andersen grouped by the year
db.email2.aggregate([
        { $match: { text: { $regex: /Arthur Andersen/i } } },
        { $project: { 
		year: { $year: { $dateFromString: { dateString: { $substr: ["$Date", 9, 21] } } } },
		sender: "$From"
	} },
	{ $group: { 
		_id: "$year",
		sender: {"$first": "$sender"},	
		count: { "$sum": 1 } } },
        { $sort: { count: -1 } },
        { $out: "jiangs1_query2" }
]);

print("\nHere are the top people who sent the most emails containing Arthur Andersen:")
cursor = db.jiangs1_query2.find()
while (cursor.hasNext()) {
	printjson(cursor.next())
}



// The Map-Reduce version of the above query except doesn't have year
db.email2.mapReduce(
	function()	{ emit(this.From, 1); },
	function(k, v)	{ return Array.sum(v); },
	{ 
		query: { text: { $regex: /Arthur Andersen/i } },
		out: { merge: "jiangs1_email_grouping", db: "jiangs1" } 
	}
);
db = db.getSiblingDB('jiangs1')

print("\nHere are how many times people have sent an email containing Arthur Andersen:")
cursor = db.jiangs1_email_grouping.find()
while (cursor.hasNext()) {
	printjson(cursor.next())
}

