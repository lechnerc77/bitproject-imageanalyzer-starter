const fetch = require('node-fetch');
const mime = require('mime-types');
const { BlobServiceClient } = require("@azure/storage-blob");

module.exports = async function (context, req) {

    let responseMessage = "";
    let responseStatus = "200";

    context.log('JavaScript HTTP trigger function processed a request.');

    const url = req.body.url;
    const picName = req.body.picname;

    try {

        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`unexpected response ${response.statusText}`);
        }

        const mimeType = response.headers.get('content-type')
        const fileName = `${picName}.${mime.extension(mimeType)}`

        const blobServiceClient = await BlobServiceClient.fromConnectionString(process.env["AZURE_STORAGE_CONNECTION_STRING"]);

        const containerClient = await blobServiceClient.getContainerClient("imageanalyzer");
        const blockBlobClient = containerClient.getBlockBlobClient(fileName);

        const uploadBlobResponse = await blockBlobClient.uploadStream(
            response.body,
            10 * 1024 * 1024,
            20,
            {
                blobHTTPHeaders: {
                    blobContentType: mimeType,
                },
            }
        );

        responseMessage = `Status of Upload to Blob storage is: ${uploadBlobResponse._response.status}`;

    }
    catch (error) {
        context.log(error);
        responseMessage = error;
        responseStatus = 500;
    }

    context.res = {
        status: responseStatus,
        body: responseMessage
    };

}