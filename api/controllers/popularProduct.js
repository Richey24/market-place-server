const { BlobServiceClient } = require("@azure/storage-blob")
const fs = require("fs")
const PopularProduct = require("../../model/popularProduct")
const blobClient = BlobServiceClient.fromConnectionString("DefaultEndpointsProtocol=https;AccountName=absa7kzimnaf;AccountKey=8sH4dhZjJa8cMyunmS1iDmwve5hZKLo5kaA1M9ubZScLCJ2oEsuSvWT46P2t+ouKoCwFENosnC4m+AStWRQ+rQ==;EndpointSuffix=core.windows.net")
const containerClient = blobClient.getContainerClient("newcontainer")


exports.createPopular = async (req, res) => {
    const body = req.body
    const file = req.file

    if (!file) {
        res.status(400).json({ message: "Send the required image" })
    }

    const imageClient = containerClient.getBlockBlobClient(file.filename)
    const response = await imageClient.uploadFile(file.path, {
        blobHTTPHeaders: {
            blobContentType: file.mimetype,
        },
    })
    // delete image from folder after it is uploaded
    fs.unlink(file.path, (err) => {
        if (err) {
            console.log(err);
        }
    })

    if (response._response.status !== 201) {
        console.log("error");
        return res.status(400).json({ message: "An error occured uploading the image" })
    }

    body.image = `https://absa7kzimnaf.blob.core.windows.net/newcontainer/${file.filename}`

    const product = await PopularProduct.create(body)
    res.status(201).json(product)

}

exports.getAllPopular = async (req, res) => {
    try {
        const product = await PopularProduct.find({})
        res.status(200).json(product)
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error", status: false });
    }
}