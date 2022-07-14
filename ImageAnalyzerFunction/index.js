module.exports = async function (context, businessCardImage) {
    context.log("JavaScript blob trigger function processed blob");
    context.log(`Blob: ${context.bindingData.blobTrigger}`);
    context.log(`Blob Size: ${businessCardImage.length} Bytes`);
};