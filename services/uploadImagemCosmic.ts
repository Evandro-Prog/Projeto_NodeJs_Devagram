import multer from "multer";
import { createBucketClient } from "@cosmicjs/sdk";
    

    const bucketDevagram = createBucketClient({
        bucketSlug: "devagram-imagens-publicacoes",
        writeKey: "qTnnxcqdW1tC05QyFsdeH6SVb9TNrIDZc5JFNTgvOBReEhtR6d",
        readKey: "2O4AGU5nJnX3HnRylL88QCQyQvUpOTC2PrPD1pugLUuVO9L81b"
    });
    

    const storage = multer.memoryStorage();
    const upload = multer({storage : storage});

    const uploarImagemCosmic = async(req : any) => {
        
        if(req?.file?.originalname){
            const media_object = {
                originalname: req.file.originalname,
                buffer : req.file.buffer
            };            
            
            if(req.url && req.url.includes('publicacoes')){
                return await bucketDevagram.media.insertOne({
                    media : media_object,
                    folder : 'publicacoes'
                });
                
            } else{
                return await bucketDevagram.media.insertOne({
                    media : media_object,
                    folder : 'avatares'
                });
            }           
        }
    }

    export {upload, uploarImagemCosmic};