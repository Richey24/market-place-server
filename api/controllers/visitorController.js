const Visitor = require("../../model/Visitor");

exports.getUniqueVisitors = async (req, res) => {
     const { startDate, endDate } = req.query;

     try {
          const uniqueVisitors = await Visitor.distinct("identifier", {
               timestamp: { $gte: new Date(startDate), $lte: new Date(endDate) },
          });

          const totalUniqueVisitors = uniqueVisitors.length;

          res.json({ totalUniqueVisitors });
     } catch (error) {
          console.error(error);
          res.status(500).json({ error: "Internal Server Error" });
     }
};
