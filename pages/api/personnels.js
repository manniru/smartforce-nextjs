// posts.js

import clientPromise from "../../../lib/mongodb";

export default async function handler(req, res) {
  const client = await clientPromise;
  const db = client.db(process.env.MONGODB_DB);
  switch (req.method) {
    case "POST":
      let bodyObject = JSON.parse(req.body);
      let myPost = await db.collection("_personnels").insertOne(bodyObject);
      res.json(myPost.ops[0]);
      break;
    case "GET":
      // const allPersonnels = await db.collection("_personnels").find({}).limit( 20 ).toArray();
      const allPersonnels = await db.collection("_personnels").aggregate([{
        $lookup: {
                from: "_ranks",
                localField: "rank_id",
                foreignField: "id",
                as: "rank"
            }
    }]).limit( 20 ).toArray();
      res.json({ status: 200, data: allPersonnels });
      break;
  }
}
