import {S3Client} from "@aws-sdk/client-s3";

export const SUPABASE_URL = "https://kabqjysokbrpvxtxbjsl.storage.supabase.co";

const s3Client = new S3Client({
  credentials: {
    accessKeyId: "REDACTED",
    secretAccessKey:
      "REDACTED"
  },
  endpoint: `${SUPABASE_URL}/storage/v1/s3`,
  region: "ap-south-1",
  forcePathStyle: true
  
});
export default s3Client;