/*
██████╗███████╗██╗███╗   ██╗██╗███╗   ███╗
██╔════╝██╔════╝██║████╗  ██║██║████╗ ████║
█████╗  ███████╗██║██╔██╗ ██║██║██╔████╔██║
██╔══╝  ╚════██║██║██║╚██╗██║██║██║╚██╔╝██║
███████╗███████║██║██║ ╚████║██║██║ ╚═╝ ██║
╚══════╝╚══════╝╚═╝╚═╝  ╚═══╝╚═╝╚═╝     ╚═╝

██████╗ ███████╗███╗   ██╗██╗███╗   ███╗
██╔══██╗██╔════╝████╗  ██║██║████╗ ████║
██████╔╝█████╗  ██╔██╗ ██║██║██╔████╔██║
██╔══██╗██╔══╝  ██║╚██╗██║██║██║╚██╔╝██║
██████╔╝███████╗██║ ╚████║██║██║ ╚═╝ ██║
╚═════╝ ╚══════╝╚═╝  ╚═══╝╚═╝╚═╝     ╚═╝

██╗  ██╗███████╗██████╗     ███████╗███████╗██╗   ██╗██╗███╗   ███╗
██║  ██║██╔════╝██╔══██╗    ██╔════╝██╔════╝╚██╗ ██╔╝██║████╗ ████║
███████║█████╗  ██████╔╝    ███████╗█████╗   ╚████╔╝ ██║██╔████╔██║
██╔══██║██╔══╝  ██╔══██╗    ╚════██║██╔══╝    ╚██╔╝  ██║██║╚██╔╝██║
██║  ██║███████╗██║  ██║    ███████║███████╗   ██║   ██║██║ ╚═╝ ██║
╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝    ╚══════╝╚══════╝   ╚═╝   ╚═╝╚═╝     ╚═╝
*/



const { MongoClient } = require('mongodb');

async function main() {
	const uri = "mongodb+srv://mali:efmukl123@yazlab21.3tqyjnc.mongodb.net/?retryWrites=true&w=majority&appName=Yazlab21";

	const client = new MongoClient(uri);

	try {
		await client.connect();

		await listDatabases(client);

		await createListing(client, {
			name: "esincan",
			summary: "Her şeyim",
		})

		await findListByName(client, "esincan")
		await findSomethingWithAnyData(client, "esincan", "Her şeyim")



	} catch (error) {
		console.error(error);
	} finally {
		await client.close();
	}
}

main().catch(console.error);

async function listDatabases(client) {
	const databasesList = await client.db().admin().listDatabases();
	databasesList.databases.forEach(db => {
		console.log(`- ${db.name}`);
	});
}




// liste oluşturma

async function createListing(client, newListing) {
	const result = await client.db("yazlab21").collection("deneme").insertOne(newListing);

	console.log(`new listing created with the following id: ${result.insertedId}`)
}


// liste okuma

async function findListByName(client, nameOfListings){
	const result = await client.db("yazlab21").collection("deneme").findOne({name: nameOfListings})

	if (result) {
		console.log(`Found a listing in the collection with the name of ${nameOfListings}`);
		console.log(result)

	} else {
		console.log(`No listing found with the name ${nameOfListings}`);
	}
}

// herhangi bir değerinde liste bulma


async function findSomethingWithAnyData(client, data1, data2) {
    try {
        const cursor = client.db("yazlab21").collection("deneme").find({
            name: {$gte: data1},
            summary: {$gte: data2}
        });

        // Cursor'u diziye dönüştürün
        const results = await cursor.toArray();

        if (results.length > 0) {
            console.log(`Datalara göre sorgu: ${data1} ${data2}`);
            console.log(results);
        } else {
            console.log("Veri bulunamadı !!!!!!!");
        }
    } catch (error) {
        // Hata oluşursa yakalayın
        console.error("An error occurred while finding the data:", error);
    }
}
