const { default: algoliasearch } = require("algoliasearch");
const Event = require("../../model/Event");
const jwt = require("jsonwebtoken");
const { sendCreateEventMail } = require("../../config/helpers");

exports.createEvent = async (req, res) => {
     try {
          const body = req.body;
          if (!body.name || !body.email) {
               return res.status(400).json({ message: "Send all required parameter" });
          }
          const event = await Event.create(body);
          const client = algoliasearch("CM2FP8NI0T", "daeb45e2c3fb98833358aba5e0c962c6");
          const index = client.initIndex("ishop-event");
          index.search(body.name).then(async ({ hits }) => {
               if (hits.length < 1) {
                    await index.saveObject(
                         {
                              name: body.name,
                              description: body.description,
                         },
                         {
                              autoGenerateObjectIDIfNotExist: true,
                         },
                    );
               }
          });
          res.status(200).json(event);
     } catch (error) {
          res.status(500).json({ message: "Internal server error", status: false });
     }
};

exports.updateEvent = async (req, res) => {
     try {
          const id = req.params.id;
          const body = req.body;
          if (!id) {
               return res.status(400).json({ message: "Send id" });
          }
          const event = await Event.findByIdAndUpdate(id, body, { new: true });
          res.status(200).json(event);
     } catch (error) {
          res.status(500).json({ message: "Internal server error", status: false });
     }
};

exports.getOneEvent = async (req, res) => {
     try {
          const id = req.params.id;
          if (!id) {
               return res.status(400).json({ message: "Send id" });
          }
          const event = await Event.findById(id);
          res.status(200).json(event);
     } catch (error) {
          res.status(500).json({ message: "Internal server error", status: false });
     }
};

exports.searchByLocation = async (req, res) => {
     const region = req.query.region;
     try {
          let events = await Event.find({
               $or: [{ country: region }, { city: region }, { state: region }],
               published: true,
          });
          return res.status(200).json(events);
     } catch (err) {
          res.status(500).json({ message: "Internal server error", status: false });
     }
};

exports.getAllEvent = async (req, res) => {
     try {
          const events = await Event.find({ published: true });
          res.status(200).json(events);
     } catch (error) {
          res.status(500).json({ message: "Internal server error", status: false });
     }
};

exports.searchEvent = async (req, res) => {
     try {
          const body = req.body;
          const keys = Object.keys(body);
          const obj = {};

          keys.forEach((key) => {
               if (key === "price") {
                    // Check if price is meant to represent "free" events
                    if (req.body.price === "free") {
                         // Use numeric comparison for price equal to 0
                         obj[key] = { $eq: 0 };
                    } else {
                         // For prices greater than 0
                         obj[key] = { $gt: 0 };
                    }
               } else if (typeof body[key] === "boolean") {
                    console.log({ val: { [obj[key]]: body[key] } });
                    obj[key] = body[key];
               } else {
                    // Apply regex for all other string fields with case-insensitive search
                    obj[key] = { $regex: body[key], $options: "i" };
               }
          });

          if (!!body.published) {
               obj["published"] = true;
          }

          // console.log({ obj, body, keys });

          const events = await Event.find(obj);
          res.status(200).json(events);
     } catch (error) {
          res.status(500).json({ message: "Internal server error", status: false });
     }
};

exports.deleteEvent = async (req, res) => {
     try {
          const id = req.params.id;
          if (!id) {
               return res.status(400).json({ message: "Send id" });
          }
          await Event.findByIdAndDelete(id);
          res.status(200).json({ message: "deleted successfully" });
     } catch (error) {
          res.status(500).json({ message: "Internal server error", status: false });
     }
};

exports.sendEventMail = async (req, res) => {
     try {
          const { id, email } = req.body;
          if (!id) {
               return res.status(400).json({ message: "Send id" });
          }
          const token = jwt.sign(
               {
                    id: id,
               },
               "event_secret",
          );
          sendCreateEventMail(email, token);
          res.status(200).json({ message: "message sent successfully" });
     } catch (error) {
          res.status(500).json({ message: "Internal server error", status: false });
     }
};

exports.publishEvent = async (req, res) => {
     try {
          const { token } = req.body;
          if (!token) {
               return res.status(400).json({ message: "Send token" });
          }
          const decoded = jwt.verify(token, "event_secret");
          if (decoded.id) {
               const event = await Event.findByIdAndUpdate(
                    decoded.id,
                    {
                         published: true,
                    },
                    { new: true },
               );
               res.status(200).json(event);
          } else {
               res.status(400).json({ message: "No ID" });
          }
     } catch (error) {
          res.status(500).json({ message: "Internal server error", status: false });
     }
};
