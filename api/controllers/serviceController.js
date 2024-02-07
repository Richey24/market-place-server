const Service = require("../../model/Service");
const { BlobServiceClient } = require("@azure/storage-blob");
const fs = require("fs");
const User = require("../../model/User");
const Rating = require("../../model/Rating");
const { ServiceThirdCat } = require("../../model/ServiceCategory");
const { default: mongoose } = require("mongoose");
const Review = require("../../model/reviews");
const blobClient = BlobServiceClient.fromConnectionString(
     "DefaultEndpointsProtocol=https;AccountName=absa7kzimnaf;AccountKey=8sH4dhZjJa8cMyunmS1iDmwve5hZKLo5kaA1M9ubZScLCJ2oEsuSvWT46P2t+ouKoCwFENosnC4m+AStWRQ+rQ==;EndpointSuffix=core.windows.net",
);
const containerClient = blobClient.getContainerClient("newcontainer");
const { default: algoliasearch } = require("algoliasearch");

exports.createService = async (req, res) => {
     try {
          let user = req.userData;
          //   console.log("user", user);
          //   const file = req.file;
          if (!user) {
               return res.status(400).json({ message: "Send userId", status: false });
          }
          const result = await Service.create({
               ...req.body,
               userId: user._id,
               email: user?.email,
          });
          const client = algoliasearch("CM2FP8NI0T", "daeb45e2c3fb98833358aba5e0c962c6");
          const index = client.initIndex("service-title");
          index.search(req.body.title).then(async ({ hits }) => {
               if (hits.length < 1) {
                    await index.saveObject(
                         { title: req.body.title },
                         {
                              autoGenerateObjectIDIfNotExist: true,
                         },
                    );
               }
          });
          //   await ServiceThirdCat.findOneAndUpdate({ name: serviceType }, { $inc: { count: 1 } });
          res.status(201).json({ result, status: true });
     } catch (err) {
          console.log("error", err);
          res.status(500).json({ err, status: false });
     }
};

exports.updateService = async (req, res) => {
     try {
          const id = req.params.id;
          const body = req.body;
          if (!id) {
               return res.status(400).json({ message: "Send service id", status: false });
          }
          //   if (file) {
          //        const imageClient = containerClient.getBlockBlobClient(file.filename);
          //        const response = await imageClient.uploadFile(file.path, {
          //             blobHTTPHeaders: {
          //                  blobContentType: file.mimetype,
          //             },
          //        });
          //        // delete image from folder after it is uploaded
          //        fs.unlink(file.path, (err) => {
          //             if (err) {
          //                  console.log(err);
          //             }
          //        });
          //        if (response._response.status !== 201) {
          //             console.log("error");
          //             return res
          //                  .status(400)
          //                  .json({ message: "An error occured uploading the image" });
          //        }

          //        body.image = `https://absa7kzimnaf.blob.core.windows.net/newcontainer/${file.filename}`;
          //   }
          const result = await Service.findByIdAndUpdate(id, body, { new: true });
          res.status(201).json({ result, status: true });
     } catch (err) {
          res.status(500).json({ err, status: false });
     }
};

exports.toggleServiceAvailability = async (req, res) => {
     try {
          const { serviceId } = req.params;
          const service = await Service.findById(serviceId);

          if (!service) {
               return res.status(404).json({ message: "Service not found", status: false });
          }

          // Toggle the availability
          service.avialable = !service.avialable;
          await service.save();

          res.status(200).json({
               message: "Service availability toggled successfully",
               status: true,
          });
     } catch (err) {
          console.error("Error toggling service availability:", err);
          res.status(500).json({ err, status: false });
     }
};

exports.getAllService = async (req, res) => {
     try {
          const result = await Service.find({});
          res.status(200).json({ result, status: true });
     } catch (err) {
          res.status(500).json({ err, status: false });
     }
};

exports.getOneService = async (req, res) => {
     try {
          const id = req.params.id;
          if (!id || !mongoose.isValidObjectId(id)) {
               return res
                    .status(400)
                    .json({ message: "Invalid or missing service id", status: false });
          }

          const service = await Service.findById(id)
               .populate("userId") // Populate the userId field
               .exec();

          if (!service) {
               return res.status(404).json({ message: "Service not found", status: false });
          }

          res.status(200).json({ service, status: true });
     } catch (err) {
          console.error(err); // Log the error for internal tracking
          res.status(500).json({ message: "An error occurred", status: false });
     }
};

exports.getServiceByUserId = async (req, res) => {
     try {
          let user = req.userData;
          if (!user) {
               return res.status(400).json({ message: "Send user id", status: false });
          }
          const result = await Service.find({ userId: user?._id });
          res.status(200).json({ result, status: true });
     } catch (err) {
          res.status(500).json({ err, status: false });
     }
};

exports.getServicesByCategoryName = async (req, res) => {
     try {
          const categoryName = req.params.categoryName;
          const services = await Service.find({ category: categoryName }); // Assuming 'category' field in your Service model
          res.json({ services, status: true });
     } catch (error) {
          res.status(500).send({ message: error.message });
     }
};

exports.getServiceByUserIdParams = async (req, res) => {
     try {
          let id = req.params.id;

          if (!id) {
               return res.status(400).json({ message: "Send user id", status: false });
          }

          // Convert string to ObjectId
          // const objectId = mongoose.Types.ObjectId(id);

          // Fetch services and populate user details
          let services = await Service.find({}).populate({
               path: "userId",
               match: { _id: id },
          });

          // Filter out services that don't match the userId
          services = services.filter((service) => service.userId && service.userId._id.equals(id));

          // console.log("id", id, services);
          res.status(200).json({ services, status: true });
     } catch (err) {
          res.status(500).json({ err, status: false });
     }
};

exports.searchService = async (req, res) => {
     try {
          const body = req.body;
          const keys = Object.keys(body);
          const obj = {};
          keys.forEach((key) => {
               obj[key] = { $regex: body[key], $options: "i" };
          });
          const result = await Service.find(obj);
          res.status(200).json({ result, status: true });
     } catch (err) {
          res.status(500).json({ err, status: false });
     }
};

exports.deleteService = async (req, res) => {
     try {
          const id = req.params.id;
          if (!id) {
               return res.status(400).json({ message: "Send service id", status: false });
          }
          await Service.findByIdAndDelete(id);
          res.status(200).json({ deleted: true });
     } catch (err) {
          res.status(500).json({ err, status: false });
     }
};

exports.rateService = async (req, res) => {
     try {
          const { serviceId, userId, title, name, detail, rating } = req.body;
          if (!serviceId || !title || !userId || !name || !rating) {
               return res
                    .status(400)
                    .json({ message: "Send all required parameters", status: false });
          }
          const user = await User.findById(userId);
          if (user.rated.includes(serviceId)) {
               return res
                    .status(400)
                    .json({ message: "User already rated this service", status: false });
          }
          const rateObj = {
               productId: serviceId,
               ratings: {
                    title: title,
                    name: name,
                    detail: detail,
                    rating: rating,
                    date: Date.now(),
               },
          };
          const rate = await Rating.findOne({ productId: serviceId });
          let theRate;
          if (rate) {
               theRate = await Rating.findOneAndUpdate(
                    { productId: productId },
                    { $push: { ratings: rateObj.ratings } },
                    { new: true },
               );
          } else {
               theRate = await Rating.create(rateObj);
          }
          const mapNum = theRate.ratings.map((ra) => ra.rating);
          const ratingAvg = mapNum.reduce((a, b) => Number(a) + Number(b)) / mapNum.length;
          const result = await Service.findByIdAndUpdate(id, { rating: ratingAvg }, { new: true });
          res.status(200).json({ result, status: true });
     } catch (err) {
          res.status(500).json({ err, status: false });
     }
};

exports.addReview = async (req, res) => {
     const { serviceId, userId, rating, reviewText } = req.body;

     try {
          const review = new Review({
               service: serviceId,
               user: userId,
               rating,
               reviewText,
          });

          await review.save();
          res.status(201).json({ message: "Review added successfully", status: true });
     } catch (err) {
          res.status(500).json({ message: err.message });
     }
};

exports.getServiceReviews = async (req, res) => {
     const { serviceId } = req.params;

     try {
          const reviews = await Review.find({ service: serviceId }).populate("user");
          res.json({ reviews, status: true });
     } catch (err) {
          res.status(500).json({ message: err.message });
     }
};

exports.updateReview = async (req, res) => {
     const { reviewId } = req.params;
     const { rating, reviewText } = req.body;

     try {
          const review = await Review.findByIdAndUpdate(
               reviewId,
               { rating, reviewText },
               { new: true },
          );
          if (!review) {
               return res.status(404).json({ message: "Review not found", status: false });
          }
          res.json({ message: "Review updated successfully", review, status: true });
     } catch (err) {
          res.status(500).json({ message: err.message });
     }
};

exports.deleteReview = async (req, res) => {
     const { reviewId } = req.params;

     try {
          const review = await Review.findByIdAndDelete(reviewId);
          if (!review) {
               return res.status(404).json({ message: "Review not found", status: false });
          }
          res.json({ message: "Review deleted successfully", status: true });
     } catch (err) {
          res.status(500).json({ message: err.message });
     }
};

exports.getReviewsByServiceUserId = async (req, res) => {
     const serviceUserId = req.params.userId;

     try {
          const services = await Service.find({ userId: serviceUserId }).exec();

          const serviceIds = services.map((service) => service._id);

          const reviews = await Review.find({ service: { $in: serviceIds } }).exec();

          res.json({ reviews, status: true });
     } catch (err) {
          res.status(500).json({ message: err.message });
     }
};
