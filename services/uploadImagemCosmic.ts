import multer from "multer";
import { createBucketClient } from "@cosmicjs/sdk";

const { BUCKET_SLUG, READ_KEY, WRITE_KEY } = process.env;
if (BUCKET_SLUG && READ_KEY) {

    const bucketDevagram = createBucketClient({
        bucketSlug: BUCKET_SLUG,
        writeKey: WRITE_KEY,
        readKey: READ_KEY
    });


    const storage = multer.memoryStorage();
    var upload = multer({ storage: storage });

    var uploarImagemCosmic = async (req: any) => {
        if(req?.file?.originalname) {                       
            const media_object = {
                originalname: req.file.originalname,
                buffer: req.file.buffer
            };

            if (req.url && req.url.includes('publicacoes')) {
                return await bucketDevagram.media.insertOne({
                    media: media_object,
                    folder: 'publicacoes'
                });

            } else {
                return await bucketDevagram.media.insertOne({
                    media: media_object,
                    folder: 'avatares'
                });
            }
        }
    }
}

export { upload, uploarImagemCosmic };