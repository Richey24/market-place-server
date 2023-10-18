const VendorTemplate = require("../../model/Template");

// Get all theme functionaitly
exports.getThemes = async (req, res) => {
     let user = req.userData;
     const theme = await VendorTemplate.find({});
     return res.status(201).json({ theme });
};

// Create theme funcaitonality
exports.addThemes = async (req, res) => {
     console.log(req.body);

     const theme = new VendorTemplate({
          theme_url: req.body.theme_url,
          category_id: req.body.category_id,
          name: req.body.name,
          type: req.body.type,
     });

     let data = await theme.save();
     return res.status(201).json({ data });
};
