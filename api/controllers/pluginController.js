const Plugin = require("../../model/Plugin");

exports.getPlugins = async (req, res) => {
     try {
          const plugins = await Plugin.find().populate("user", "name email");
          res.status(200).json(plugins);
     } catch (error) {
          res.status(500).json({ message: "Error fetching plugins", error: error });
     }
};

exports.createPlugin = async (req, res) => {
     let user = req.userData;
     try {
          if (!user) {
               return res.status(401).send({ message: "Unauthorized: No user ID provided" });
          }

          const newPlugin = new Plugin({ ...req.body, user: user?._id });

          await newPlugin.save();
          res.status(201).send(newPlugin);
     } catch (error) {
          res.status(400).send(error);
     }
};
